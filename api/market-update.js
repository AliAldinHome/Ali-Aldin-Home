// api/market-update.js
// Admin-triggered bulk send of quarterly market updates
// Protected by ADMIN_SECRET env var

const { getMarketingList } = require('../lib/airtable');
const { send, marketUpdateEmail } = require('../lib/emails');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { adminSecret, subject, headline, body, quarter, previewEmail } = req.body;

  // Admin auth
  if (!process.env.ADMIN_SECRET || adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!body) return res.status(400).json({ error: 'Email body is required' });

  try {
    // ── Preview mode: send to one email only ─────────────────────────────────
    if (previewEmail) {
      const preview = marketUpdateEmail('Preview', 'preview-token', { subject, headline, body, quarter });
      await send({ to: previewEmail, subject: `[PREVIEW] ${preview.subject}`, html: preview.html });
      return res.status(200).json({ success: true, mode: 'preview', sentTo: previewEmail });
    }

    // ── Full send: all subscribed contacts ───────────────────────────────────
    const contacts = await getMarketingList();

    if (contacts.length === 0) {
      return res.status(200).json({ success: true, sent: 0, message: 'No subscribed contacts' });
    }

    let sent = 0;
    const errors = [];

    // Send in batches of 10 with small delay to avoid Gmail rate limits
    for (let i = 0; i < contacts.length; i++) {
      const { Name, Email, UnsubscribeToken } = contacts[i].fields;
      try {
        const email = marketUpdateEmail(Name, UnsubscribeToken, { subject, headline, body, quarter });
        await send({ to: Email, subject: email.subject, html: email.html });
        sent++;

        // Small delay every 10 emails to stay within Gmail limits
        if (sent % 10 === 0) {
          await new Promise(r => setTimeout(r, 1500));
        }
      } catch (e) {
        errors.push(`${Email}: ${e.message}`);
      }
    }

    // Notify Ali of send summary
    const nodemailer = require('nodemailer');
    const t = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
    });
    await t.sendMail({
      from: `"Heartland CRM" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `Market Update Sent — ${sent} of ${contacts.length} delivered`,
      text: `Market update "${subject || headline}" sent.\n\nDelivered: ${sent}/${contacts.length}\nErrors: ${errors.length}\n${errors.length ? '\nFailed:\n' + errors.join('\n') : ''}`
    });

    return res.status(200).json({ success: true, sent, total: contacts.length, errors: errors.length });

  } catch (err) {
    console.error('Market update error:', err);
    return res.status(500).json({ error: err.message });
  }
};
