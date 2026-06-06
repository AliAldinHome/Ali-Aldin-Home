// lib/emails.js — All email templates + transporter
// Design system: Montserrat + Cormorant Garamond — matches website

const nodemailer = require('nodemailer');

const SITE_URL = () => process.env.SITE_URL || 'https://your-site.vercel.app';

const C = {
  bg:       '#FAF8F6',
  bgAlt:    '#F7F5F3',
  card:     '#FFFFFF',
  dark:     '#232427',
  charcoal: '#1F1F1F',
  gold:     '#C9A96E',
  goldDark: '#B89455',
  text:     '#1F1F1F',
  sub:      '#666666',
  border:   '#E4DFD8'
};

const FONTS = `<style>@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap');</style>`;

function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
  });
}

function emailHeader() {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="background:${C.dark};padding:28px 40px;text-align:center;">
        <div style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.55em;text-transform:uppercase;color:${C.gold};margin-bottom:4px;">THE</div>
        <div style="font-family:'Montserrat',Arial,sans-serif;font-size:24px;font-weight:300;letter-spacing:0.28em;text-transform:uppercase;color:#FFFFFF;line-height:1.0;">HEARTLAND</div>
        <div style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.55em;text-transform:uppercase;color:${C.gold};margin-top:4px;">— AGENT —</div>
      </td>
    </tr>
  </table>`;
}

function emailFooter(token, showUnsub) {
  const unsubUrl = `${SITE_URL()}/unsubscribe.html?token=${token}`;
  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="background:${C.bgAlt};border-top:1px solid ${C.border};padding:26px 40px;text-align:center;">
        <p style="margin:0 0 4px;font-family:'Montserrat',Arial,sans-serif;font-size:12px;font-weight:500;color:${C.charcoal};letter-spacing:0.08em;">Ali Aldin  &bull;  REALTOR&#174; Salesperson</p>
        <p style="margin:0 0 3px;font-family:'Montserrat',Arial,sans-serif;font-size:11px;font-weight:300;color:${C.sub};">Right at Home Realty, Brokerage</p>
        <p style="margin:0 0 3px;font-family:'Montserrat',Arial,sans-serif;font-size:11px;font-weight:300;color:${C.sub};">480 Eglinton Ave W #30, Mississauga, ON L5R 0G2</p>
        <p style="margin:0;font-family:'Montserrat',Arial,sans-serif;font-size:11px;font-weight:300;color:${C.sub};">416.606.0494  &bull;  aaldin.home@gmail.com</p>
        ${showUnsub ? `
        <p style="margin:16px 0 0;font-family:'Montserrat',Arial,sans-serif;font-size:10px;color:#BBBBBB;">
          You received this because you opted in at <a href="${SITE_URL()}" style="color:${C.gold};text-decoration:none;">${SITE_URL()}</a><br/>
          <a href="${unsubUrl}" style="color:#BBBBBB;text-decoration:underline;">Unsubscribe from marketing emails</a>
        </p>
        <p style="margin:6px 0 0;font-family:'Montserrat',Arial,sans-serif;font-size:9px;color:#CCCCCC;">REALTOR&#174;. Member of The Canadian Real Estate Association. The trademarks REALTOR&#174;, REALTORS&#174; and the REALTOR&#174; logo are controlled by CREA.</p>` : ''}
      </td>
    </tr>
  </table>`;
}

function shell(body, token, showUnsub) {
  if (showUnsub === undefined) showUnsub = true;
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>${FONTS}</head>
<body style="margin:0;padding:0;background:${C.bg};">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg};">
  <tr>
    <td align="center" style="padding:24px 16px;">
      <table width="100%" style="max-width:600px;background:${C.card};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);" cellpadding="0" cellspacing="0" border="0">
        <tr><td>${emailHeader()}</td></tr>
        <tr><td style="padding:36px 40px;">${body}</td></tr>
        <tr><td>${emailFooter(token, showUnsub)}</td></tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function goldBar() {
  return `<div style="width:48px;height:1px;background:${C.gold};margin:18px auto;"></div>`;
}

function pillBtn(text, url, bg) {
  if (!bg) bg = C.charcoal;
  return `<a href="${url}" style="display:inline-block;background:${bg};color:#FFFFFF;padding:14px 32px;border-radius:999px;text-decoration:none;font-family:'Montserrat',Arial,sans-serif;font-size:12px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;">${text}</a>`;
}

// 1. WELCOME (transactional)
function welcomeEmail(name, formType) {
  const msg = {
    seller:       'I have received your home valuation request and will prepare a personalized Comparative Market Analysis within 24 hours.',
    buyer:        'I have received your home search request and will be in touch within 24 hours with listings tailored to your criteria.',
    investor:     'I have received your investor inquiry and will reach out within 24 hours with opportunities matched to your goals.',
    consultation: 'I have received your consultation request and will confirm a time within 24 hours. No commitment required.'
  };
  const body = `
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:16px;font-weight:300;color:${C.charcoal};margin:0 0 14px;">Hi ${name},</p>
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:14px;font-weight:300;color:${C.sub};line-height:1.85;margin:0 0 18px;">${msg[formType] || msg.consultation}</p>
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:14px;font-weight:300;color:${C.sub};line-height:1.85;margin:0 0 22px;">In the meantime, feel free to reach me directly:</p>
    <table cellpadding="0" cellspacing="0" border="0" style="border-left:2px solid ${C.gold};padding-left:16px;margin-bottom:22px;">
      <tr><td style="padding:4px 0;font-family:'Montserrat',Arial,sans-serif;font-size:13px;font-weight:300;color:${C.charcoal};">&#128222; <a href="tel:4166060494" style="color:${C.gold};text-decoration:none;">416.606.0494</a></td></tr>
      <tr><td style="padding:4px 0;font-family:'Montserrat',Arial,sans-serif;font-size:13px;font-weight:300;color:${C.charcoal};"> <a href="https://wa.me/14166060494" style="color:${C.gold};text-decoration:none;">WhatsApp — fastest response</a></td></tr>
    </table>
    <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:16px;font-style:italic;color:${C.sub};margin:0;">Local Expert. Global Mindset.</p>`;
  return { subject: `Hi ${name} — Ali Aldin has received your request`, html: shell(body, '', false) };
}

// 2. WELCOME FOLLOW-UP (day 3)
function welcomeFollowUp(name, token) {
  const body = `
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:16px;font-weight:300;color:${C.charcoal};margin:0 0 14px;">Hi ${name},</p>
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:14px;font-weight:300;color:${C.sub};line-height:1.85;margin:0 0 20px;">I wanted to follow up and let you know what you can expect from me going forward.</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bgAlt};border-radius:10px;border:1px solid ${C.border};margin:0 0 20px;">
      <tr><td style="padding:20px 24px;">
        <p style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:${C.gold};margin:0 0 12px;">What I will send you</p>
        <p style="font-family:'Montserrat',Arial,sans-serif;font-size:13px;font-weight:300;color:${C.sub};line-height:1.8;margin:0 0 7px;">&#128202;  Quarterly GTA West market updates &amp; insights</p>
        <p style="font-family:'Montserrat',Arial,sans-serif;font-size:13px;font-weight:300;color:${C.sub};line-height:1.8;margin:0 0 7px;">&#127874;  A personal birthday greeting each year</p>
        <p style="font-family:'Montserrat',Arial,sans-serif;font-size:13px;font-weight:300;color:${C.sub};line-height:1.8;margin:0 0 7px;">  Your home anniversary &amp; market value updates</p>
        <p style="font-family:'Montserrat',Arial,sans-serif;font-size:13px;font-weight:300;color:${C.sub};line-height:1.8;margin:0;">&#128161;  Timely insights on when to list, buy, or hold</p>
      </td></tr>
    </table>
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:14px;font-weight:300;color:${C.sub};line-height:1.85;margin:0 0 14px;">No spam, no pressure — just useful, relevant content from someone who genuinely cares about your real estate goals.</p>
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:14px;font-weight:300;color:${C.charcoal};margin:0;">Warmly,<br/><strong style="font-weight:500;">Ali Aldin</strong></p>`;
  return { subject: 'A quick note from Ali — The Heartland Agent', html: shell(body, token) };
}

// 3. BIRTHDAY
function birthdayEmail(name, token) {
  const body = `
    <div style="text-align:center;padding:12px 0 28px;">
      <div style="font-size:48px;margin-bottom:16px;">&#127874;</div>
      <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:32px;font-weight:400;color:${C.charcoal};margin:0 0 6px;line-height:1.2;">Happy Birthday, ${name}!</h1>
      ${goldBar()}
      <p style="font-family:'Montserrat',Arial,sans-serif;font-size:15px;font-weight:300;color:${C.sub};line-height:1.85;max-width:400px;margin:0 auto 18px;">Wishing you a wonderful day filled with joy, celebration, and everything that makes you happy.</p>
      <p style="font-family:'Montserrat',Arial,sans-serif;font-size:14px;font-weight:300;color:#AAAAAA;max-width:380px;margin:0 auto 28px;line-height:1.7;">It has been a pleasure knowing you. Here is to another great year ahead!</p>
      <p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:17px;font-style:italic;color:${C.sub};margin:0;">Warmly,<br/>
        <span style="font-style:normal;color:${C.charcoal};font-weight:400;">Ali Aldin</span><br/>
        <span style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:${C.gold};font-style:normal;">The Heartland Agent</span>
      </p>
    </div>`;
  return { subject: `Happy Birthday, ${name}! — Ali Aldin`, html: shell(body, token) };
}

// 4. ANNIVERSARY
function anniversaryEmail(name, token, years) {
  const yr = years === 1 ? '1 year' : `${years} years`;
  const body = `
    <div style="text-align:center;padding:8px 0 20px;">
      <div style="font-size:44px;margin-bottom:12px;"></div>
      <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:400;color:${C.charcoal};margin:0 0 6px;line-height:1.2;">Happy ${yr} in your home, ${name}!</h1>
      ${goldBar()}
    </div>
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:14px;font-weight:300;color:${C.sub};line-height:1.85;margin:0 0 14px;">It has been ${yr} since we worked together — I hope you have loved every moment in your home.</p>
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:14px;font-weight:300;color:${C.sub};line-height:1.85;margin:0 0 20px;">Real estate markets shift constantly and your home's value may have changed significantly. If you are ever curious what it is worth today, I am happy to provide a free, no-obligation update.</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bgAlt};border-radius:10px;border-left:3px solid ${C.gold};margin:0 0 24px;">
      <tr><td style="padding:16px 20px;font-family:'Montserrat',Arial,sans-serif;font-size:13px;font-weight:300;color:${C.charcoal};line-height:1.7;">
        Want to know what your home is worth today? <a href="https://wa.me/14166060494" style="color:${C.gold};text-decoration:none;">WhatsApp me at 416.606.0494</a> — free, no commitment.
      </td></tr>
    </table>
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:14px;font-weight:300;color:${C.charcoal};margin:0;">Here is to many more great years!<br/><strong style="font-weight:500;">Ali Aldin</strong></p>`;
  return { subject: `${yr} in your home — Ali Aldin, The Heartland Agent`, html: shell(body, token) };
}

// 5. MARKET UPDATE
function marketUpdateEmail(name, token, opts) {
  const subj = opts.subject; const headline = opts.headline;
  const bodyContent = opts.body; const quarter = opts.quarter;
  const q = quarter || ('Q' + Math.ceil((new Date().getMonth()+1)/3) + ' ' + new Date().getFullYear());
  const body = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.dark};border-radius:8px;margin:-36px -40px 32px;width:calc(100% + 80px);">
      <tr><td style="padding:24px 40px;">
        <p style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:${C.gold};margin:0 0 8px;">Quarterly Market Report</p>
        <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:26px;font-weight:400;color:#FFFFFF;margin:0 0 5px;line-height:1.2;">${headline || 'GTA West Real Estate Update'}</h1>
        <p style="font-family:'Montserrat',Arial,sans-serif;font-size:11px;font-weight:300;color:rgba(255,255,255,0.4);margin:0;">${q}</p>
      </td></tr>
    </table>
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:14px;font-weight:300;color:${C.sub};margin:0 0 16px;">Hi ${name},</p>
    <div style="font-family:'Montserrat',Arial,sans-serif;font-size:14px;font-weight:300;color:${C.sub};line-height:1.85;">${bodyContent}</div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bgAlt};border-radius:10px;border:1px solid ${C.border};margin:24px 0;">
      <tr><td style="padding:18px 20px;">
        <p style="font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:${C.gold};margin:0 0 8px;">Questions about your property?</p>
        <p style="font-family:'Montserrat',Arial,sans-serif;font-size:13px;font-weight:300;color:${C.sub};margin:0;">Reply to this email or <a href="https://wa.me/14166060494" style="color:${C.gold};text-decoration:none;">WhatsApp Ali at 416.606.0494</a> for a personalized assessment.</p>
      </td></tr>
    </table>
    <p style="font-family:'Montserrat',Arial,sans-serif;font-size:14px;font-weight:300;color:${C.charcoal};margin:0;">Until next quarter,<br/><strong style="font-weight:500;">Ali Aldin</strong> — The Heartland Agent</p>`;
  return { subject: subj || `GTA West Market Update — ${q}`, html: shell(body, token) };
}

// 6. ADMIN NOTIFICATION
const BADGES = {
  seller:       { e: '', l: 'Seller — Free Valuation' },
  buyer:        { e: '', l: 'Buyer Inquiry' },
  investor:     { e: '', l: 'Investor Inquiry' },
  consultation: { e: '', l: 'Free Consultation' }
};

function adminNotification(data) {
  const { formType, name, phone, email, address, propertyType, yearBuilt,
    timeline, budget, bedrooms, areas, investmentGoal, investmentBudget,
    portfolio, preferredContact, bestTime, topic, notes,
    dateOfBirth, propertyAnniversary, howHeard, marketingConsent } = data;

  const b = BADGES[formType] || { e: '&#128203;', l: formType };
  const tel = (phone || '').replace(/\D/g, '');

  const rows = [
    ['Name', `<strong style="font-weight:500;">${name}</strong>`],
    ['Phone', `<a href="tel:${phone}" style="color:${C.gold};text-decoration:none;">${phone}</a>`],
    ['Email', `<a href="mailto:${email}" style="color:${C.gold};text-decoration:none;">${email}</a>`],
    ...(address           ? [['Property',          address]]                  : []),
    ...(propertyType      ? [['Type',               propertyType]]             : []),
    ...(yearBuilt         ? [['Year Built',          yearBuilt]]               : []),
    ...(budget||investmentBudget ? [['Budget',       budget||investmentBudget]] : []),
    ...(bedrooms          ? [['Bedrooms',            bedrooms]]                : []),
    ...(areas             ? [['Areas',               areas]]                   : []),
    ...(investmentGoal    ? [['Investment Goal',      investmentGoal]]         : []),
    ...(portfolio         ? [['Portfolio',            portfolio]]              : []),
    ...(topic             ? [['Topic',                topic]]                  : []),
    ...(preferredContact  ? [['Preferred Contact',    preferredContact]]       : []),
    ...(bestTime          ? [['Best Time',            bestTime]]               : []),
    ...(timeline          ? [['Timeline',             timeline]]               : []),
    ...(dateOfBirth       ? [['Date of Birth',        dateOfBirth]]            : []),
    ...(propertyAnniversary ? [['Property Anniversary', propertyAnniversary]] : []),
    ...(howHeard          ? [['How Found Ali',         howHeard]]              : []),
    ['Marketing Consent', marketingConsent === 'yes' ? '&#9989; Yes — added to CRM' : '&#10060; No — inquiry only'],
    ...(notes             ? [['Notes',                notes]]                  : [])
  ].map(([l, v]) => `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid ${C.border};font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#AAAAAA;width:34%;vertical-align:top;">${l}</td>
      <td style="padding:9px 0;border-bottom:1px solid ${C.border};font-family:'Montserrat',Arial,sans-serif;font-size:13px;font-weight:300;color:${C.charcoal};">${v}</td>
    </tr>`).join('');

  const btns = `
    <div style="margin-top:22px;">
      <a href="https://wa.me/${tel}" style="display:inline-block;background:#25D366;color:#FFFFFF;padding:11px 20px;border-radius:999px;text-decoration:none;font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;margin:4px 6px 4px 0;">WhatsApp ${name}</a>
      <a href="mailto:${email}" style="display:inline-block;background:${C.gold};color:#FFFFFF;padding:11px 20px;border-radius:999px;text-decoration:none;font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;margin:4px 6px 4px 0;">Email ${name}</a>
      <a href="tel:${tel}" style="display:inline-block;background:${C.charcoal};color:#FFFFFF;padding:11px 20px;border-radius:999px;text-decoration:none;font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;margin:4px 0;">Call ${name}</a>
    </div>`;

  const subject = `${b.e} ${b.l} — ${name}${address ? '  -  ' + address : ''}`;
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/>${FONTS}</head>
<body style="margin:0;padding:0;background:${C.bg};">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg};">
  <tr><td align="center" style="padding:24px 16px;">
    <table width="100%" style="max-width:600px;background:${C.card};border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="background:${C.dark};padding:20px 32px;">
        <span style="display:inline-block;background:${C.gold};color:#FFFFFF;padding:5px 14px;border-radius:999px;font-family:'Montserrat',Arial,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;">${b.e} ${b.l}</span>
        <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:400;color:#FFFFFF;margin:10px 0 0;line-height:1.2;">${name}</h2>
      </td></tr>
      <tr><td style="padding:28px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
        ${btns}
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
  return { subject, html };
}

async function send({ to, from, subject, html }) {
  const t = getTransporter();
  await t.sendMail({
    from: from || `"Ali Aldin — The Heartland Agent" <${process.env.GMAIL_USER}>`,
    to, subject, html
  });
}

module.exports = {
  send, welcomeEmail, welcomeFollowUp, birthdayEmail,
  anniversaryEmail, marketUpdateEmail, adminNotification
};
