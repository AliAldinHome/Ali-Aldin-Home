// api/submit.js
const { createContact, findByEmail, updateContact } = require('../lib/airtable');
const { send, welcomeEmail, adminNotification } = require('../lib/emails');
const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    formType, name, phone, email, address, propertyType, yearBuilt,
    timeline, budget, bedrooms, areas, investmentGoal, investmentBudget,
    portfolio, preferredContact, bestTime, topic, notes,
    dateOfBirth, propertyAnniversary, howHeard, marketingConsent
  } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Name, phone and email are required' });
  }

  try {
    // ── 1. Save to Airtable CRM ─────────────────────────────────────────────
    const unsubToken = crypto.randomUUID();
    const consented = marketingConsent === 'yes';
    const now = new Date().toISOString().split('T')[0];

    // Check if contact already exists → update rather than duplicate
    let existing = null;
    try { existing = await findByEmail(email); } catch (_) {}

    const fields = {
      Name: name,
      Email: email,
      Phone: phone,
      FormType: formType || 'consultation',
      Status: 'Active',
      MarketingConsent: consented,
      ...(consented ? { ConsentDate: now } : {}),
      ...(dateOfBirth ? { DateOfBirth: dateOfBirth } : {}),
      ...(propertyAnniversary ? { PropertyAnniversary: propertyAnniversary } : {}),
      ...(howHeard ? { HowHeard: howHeard } : {}),
      ...(areas ? { AreasOfInterest: areas } : {}),
      ...(budget || investmentBudget ? { Budget: budget || investmentBudget } : {}),
      ...(notes || topic ? { Notes: notes || topic } : {}),
      ...(timeline ? { Timeline: timeline } : {}),
      CreatedAt: now,
      WelcomeStep: 1,
      ...(existing ? {} : { UnsubscribeToken: unsubToken })
    };

    if (existing) {
      await updateContact(existing.id, fields);
    } else {
      await createContact(fields);
    }

    // ── 2. Notify Ali ────────────────────────────────────────────────────────
    const notif = adminNotification(req.body);
    await send({
      to: process.env.GMAIL_USER,
      from: `"Heartland CRM" <${process.env.GMAIL_USER}>`,
      subject: notif.subject,
      html: notif.html
    });

    // ── 3. Welcome email to client (transactional — no unsub needed) ─────────
    const welcome = welcomeEmail(name, formType);
    await send({ to: email, subject: welcome.subject, html: welcome.html });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Submit error:', err);
    return res.status(500).json({ error: 'Submission failed' });
  }
};
