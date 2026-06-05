// api/cron-daily.js
// Runs daily at 9AM EST (13:00 UTC) via Vercel Cron
// Handles: birthdays, property anniversaries, 3-day welcome follow-ups

const {
  getTodayBirthdays, getTodayAnniversaries, getWelcomeFollowUps, updateContact
} = require('../lib/airtable');
const { send, birthdayEmail, anniversaryEmail, welcomeFollowUp } = require('../lib/emails');

module.exports = async (req, res) => {
  // Vercel Cron sends a specific header — verify it to prevent abuse
  const authHeader = req.headers['authorization'];
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const results = { birthdays: 0, anniversaries: 0, followUps: 0, errors: [] };
  const thisYear = new Date().getFullYear();

  try {
    // ── 1. BIRTHDAY EMAILS ───────────────────────────────────────────────────
    const birthdays = await getTodayBirthdays();
    for (const contact of birthdays) {
      const { Name, Email, UnsubscribeToken } = contact.fields;
      try {
        const email = birthdayEmail(Name, UnsubscribeToken);
        await send({ to: Email, subject: email.subject, html: email.html });
        await updateContact(contact.id, { BirthdaySentYear: String(thisYear) });
        results.birthdays++;
        console.log(`Birthday sent: ${Name} <${Email}>`);
      } catch (e) {
        results.errors.push(`Birthday ${Email}: ${e.message}`);
      }
    }

    // ── 2. PROPERTY ANNIVERSARY EMAILS ──────────────────────────────────────
    const anniversaries = await getTodayAnniversaries();
    for (const contact of anniversaries) {
      const { Name, Email, UnsubscribeToken, PropertyAnniversary } = contact.fields;
      try {
        // Calculate how many years
        const anniversary = new Date(PropertyAnniversary);
        const years = thisYear - anniversary.getFullYear();
        if (years < 1) continue; // Skip if less than 1 year

        const email = anniversaryEmail(Name, UnsubscribeToken, years);
        await send({ to: Email, subject: email.subject, html: email.html });
        await updateContact(contact.id, { AnniversarySentYear: String(thisYear) });
        results.anniversaries++;
        console.log(`Anniversary sent: ${Name} <${Email}> (${years} years)`);
      } catch (e) {
        results.errors.push(`Anniversary ${Email}: ${e.message}`);
      }
    }

    // ── 3. WELCOME FOLLOW-UP (day 3) ─────────────────────────────────────────
    const followUps = await getWelcomeFollowUps();
    for (const contact of followUps) {
      const { Name, Email, UnsubscribeToken } = contact.fields;
      try {
        const email = welcomeFollowUp(Name, UnsubscribeToken);
        await send({ to: Email, subject: email.subject, html: email.html });
        await updateContact(contact.id, { WelcomeStep: 2 });
        results.followUps++;
        console.log(`Follow-up sent: ${Name} <${Email}>`);
      } catch (e) {
        results.errors.push(`Follow-up ${Email}: ${e.message}`);
      }
    }

    // ── Summary notification to Ali (only if something was sent) ─────────────
    const total = results.birthdays + results.anniversaries + results.followUps;
    if (total > 0) {
      const nodemailer = require('nodemailer');
      const t = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
      });
      await t.sendMail({
        from: `"Heartland CRM" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `CRM Daily Summary — ${total} emails sent`,
        text: `Daily automation summary:\n\n🎂 Birthdays: ${results.birthdays}\n🏡 Anniversaries: ${results.anniversaries}\n📧 Follow-ups: ${results.followUps}\n\n${results.errors.length ? 'Errors:\n' + results.errors.join('\n') : 'No errors.'}`
      });
    }

    return res.status(200).json({ success: true, ...results });

  } catch (err) {
    console.error('Cron error:', err);
    return res.status(500).json({ error: err.message, ...results });
  }
};
