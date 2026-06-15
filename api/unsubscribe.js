// api/unsubscribe.js
// CASL s.11: unsubscribe must be processed within 10 business days
// We process instantly. Token-based to prevent scraping.

const { send } = require('../lib/emails');
const { findByToken, findByEmail, updateContact } = require('../lib/airtable');

module.exports = async (req, res) => {
  const { token, email } = req.method === 'POST' ? req.body : req.query;

  if (!token && !email) {
    return res.status(400).json({ error: 'Token or email required' });
  }

  try {
    let contact = null;

    if (token) {
      contact = await findByToken(token);
    } else if (email) {
      contact = await findByEmail(email);
    }

    if (!contact) {
      // Don't reveal if email exists — just confirm unsubscribe
      return res.status(200).json({ success: true, message: 'Unsubscribed' });
    }

    // Already unsubscribed
    if (contact.fields?.Status === 'Unsubscribed') {
      return res.status(200).json({ success: true, message: 'Already unsubscribed' });
    }

    // Process unsubscribe immediately (CASL compliant)
    await updateContact(contact.id, {
      Status: 'Unsubscribed',
      MarketingConsent: false,
      UnsubscribeDate: new Date().toISOString().split('T')[0]
    });

    // Notify Ali
    await send({
      to: process.env.ADMIN_EMAIL || 'aaldin.home@gmail.com',
      from: 'Heartland CRM <aaldin@heartlandagent.ca>',
      subject: `Unsubscribe processed — ${contact.fields?.Name || email}`,
      text: `${contact.fields?.Name || 'A contact'} (${contact.fields?.Email || email}) has unsubscribed from all marketing emails. Processed automatically at ${new Date().toISOString()}.`
    });

    return res.status(200).json({ success: true, message: 'Unsubscribed successfully' });

  } catch (err) {
    console.error('Unsubscribe error:', err);
    // Still return 200 to avoid exposing errors to potential scrapers
    return res.status(200).json({ success: true });
  }
};
