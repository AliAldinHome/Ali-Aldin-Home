// lib/emails.js — All email templates + transporter
// Every marketing email is CASL-compliant:
//   ✓ Sender clearly identified
//   ✓ Physical mailing address included
//   ✓ Functional unsubscribe mechanism
//   ✓ Consent recorded at time of capture

const nodemailer = require('nodemailer');

const SITE_URL = () => process.env.SITE_URL || 'https://your-site.vercel.app';
const GOLD  = '#C9A96E';
const DARK  = '#1C1916';
const CREAM = '#F5F1EA';

// ── Transporter ──────────────────────────────────────────────────────────────
function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
}

// ── Shared shell (all marketing emails) ─────────────────────────────────────
// CASL requires: sender name, physical address, unsubscribe link in EVERY CEM
function shell(body, unsubToken, showUnsub = true) {
  const unsubUrl = `${SITE_URL()}/unsubscribe.html?token=${unsubToken}`;
  const footer = showUnsub ? `
    <div style="border-top:1px solid #e0d8cc;margin-top:32px;padding-top:20px;text-align:center;">
      <p style="font-size:11px;color:#888;font-family:Arial,sans-serif;line-height:1.7;margin:0;">
        <strong style="color:#555;">Ali Aldin</strong> &nbsp;·&nbsp; REALTOR® Salesperson<br/>
        Right at Home Realty, Brokerage<br/>
        480 Eglinton Ave W #30, Mississauga, ON L5R 0G2<br/>
        416.606.0494 &nbsp;·&nbsp; aaldin.home@gmail.com
      </p>
      <p style="font-size:10px;color:#aaa;font-family:Arial,sans-serif;margin:12px 0 0;">
        You are receiving this because you opted in at <a href="${SITE_URL()}" style="color:${GOLD};">${SITE_URL()}</a><br/>
        <a href="${unsubUrl}" style="color:#aaa;text-decoration:underline;">Unsubscribe from all marketing emails</a>
        &nbsp;·&nbsp; This unsubscribe link is valid for 60 days
      </p>
      <p style="font-size:9px;color:#ccc;font-family:Arial,sans-serif;margin:8px 0 0;">
        REALTOR®. Member of The Canadian Real Estate Association. 
        The trademarks REALTOR®, REALTORS® and the REALTOR® logo are controlled by CREA.
      </p>
    </div>` : '';

  return `
  <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:${CREAM};">
    <div style="background:${DARK};padding:22px 32px;text-align:center;">
      <div style="font-size:9px;letter-spacing:4px;color:rgba(255,255,255,0.35);text-transform:uppercase;">The</div>
      <div style="font-size:22px;letter-spacing:3px;color:#fff;font-weight:bold;text-transform:uppercase;">Heartland</div>
      <div style="font-size:9px;letter-spacing:6px;color:${GOLD};text-transform:uppercase;margin-top:2px;">&#8212; Agent &#8212;</div>
    </div>
    <div style="padding:28px 32px;">${body}</div>
    ${footer}
  </div>`;
}

// ── 1. WELCOME EMAIL (immediate, transactional — no unsub needed) ────────────
function welcomeEmail(name, formType) {
  const messages = {
    seller: `I've received your home valuation request and will prepare a personalized Comparative Market Analysis for your property within 24 hours.`,
    buyer: `I've received your home search request and will be in touch within 24 hours with listings tailored to your criteria — including some not yet publicly available.`,
    investor: `I've received your investor inquiry and will reach out within 24 hours with opportunities and market data aligned to your investment goals.`,
    consultation: `I've received your consultation request and will confirm a time within 24 hours. No commitment — just an honest conversation about your real estate goals.`
  };
  return {
    subject: `Hi ${name} — Ali Aldin has received your request`,
    html: shell(`
      <p style="font-size:16px;color:${DARK};margin:0 0 14px;">Hi ${name},</p>
      <p style="font-size:14px;color:#555;line-height:1.8;font-family:Arial,sans-serif;margin:0 0 14px;">${messages[formType] || messages.consultation}</p>
      <p style="font-size:14px;color:#555;line-height:1.8;font-family:Arial,sans-serif;margin:0 0 20px;">In the meantime, feel free to reach me directly:</p>
      <div style="border-left:3px solid ${GOLD};padding-left:14px;margin-bottom:20px;">
        <p style="margin:0;font-size:13px;color:${DARK};font-family:Arial,sans-serif;">📞 <a href="tel:4166060494" style="color:${GOLD};">416.606.0494</a></p>
        <p style="margin:6px 0 0;font-size:13px;color:${DARK};font-family:Arial,sans-serif;">💬 <a href="https://wa.me/14166060494" style="color:${GOLD};">WhatsApp — fastest response</a></p>
      </div>
      <p style="font-size:12px;color:#aaa;font-family:Arial,sans-serif;font-style:italic;margin:0;">Local Expert. Global Mindset.</p>
    `, '', false) // no unsub on transactional
  };
}

// ── 2. WELCOME FOLLOW-UP (day 3, marketing — needs unsub) ────────────────────
function welcomeFollowUp(name, token) {
  return {
    subject: `A quick note from Ali — The Heartland Agent`,
    html: shell(`
      <p style="font-size:16px;color:${DARK};margin:0 0 14px;">Hi ${name},</p>
      <p style="font-size:14px;color:#555;line-height:1.8;font-family:Arial,sans-serif;margin:0 0 14px;">
        I just wanted to follow up and let you know what you can expect from me going forward.
      </p>
      <div style="background:#fff;border:1px solid #e8e2d8;border-radius:8px;padding:20px;margin:0 0 20px;">
        <p style="font-size:13px;color:${DARK};font-family:Arial,sans-serif;margin:0 0 10px;font-weight:bold;">Here's what I'll send you:</p>
        <p style="font-size:13px;color:#555;font-family:Arial,sans-serif;margin:6px 0;">📊 &nbsp;<strong>Quarterly market updates</strong> — GTA West prices, trends & insights</p>
        <p style="font-size:13px;color:#555;font-family:Arial,sans-serif;margin:6px 0;">🎂 &nbsp;<strong>Birthday greeting</strong> — a personal note on your birthday</p>
        <p style="font-size:13px;color:#555;font-family:Arial,sans-serif;margin:6px 0;">🏡 &nbsp;<strong>Property milestones</strong> — your home anniversary & market value updates</p>
        <p style="font-size:13px;color:#555;font-family:Arial,sans-serif;margin:6px 0;">💡 &nbsp;<strong>Timely tips</strong> — when to list, when to buy, what's happening near you</p>
      </div>
      <p style="font-size:14px;color:#555;line-height:1.8;font-family:Arial,sans-serif;margin:0 0 14px;">
        No spam, no pressure. Just useful, relevant content from someone who genuinely cares about helping you make smart real estate decisions.
      </p>
      <p style="font-size:14px;color:#555;font-family:Arial,sans-serif;margin:0;">
        As always — I'm one message away.<br/>
        <strong style="color:${DARK};">Ali Aldin</strong>
      </p>
    `, token)
  };
}

// ── 3. BIRTHDAY ECARD ────────────────────────────────────────────────────────
function birthdayEmail(name, token) {
  return {
    subject: `Happy Birthday, ${name}! 🎂 — Ali Aldin`,
    html: shell(`
      <div style="text-align:center;padding:20px 0 28px;">
        <div style="font-size:48px;margin-bottom:16px;">🎂</div>
        <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:${DARK};margin:0 0 8px;">
          Happy Birthday, ${name}!
        </h1>
        <div style="width:60px;height:2px;background:${GOLD};margin:0 auto 20px;"></div>
        <p style="font-size:15px;color:#555;line-height:1.8;font-family:Arial,sans-serif;max-width:400px;margin:0 auto 20px;">
          Wishing you a wonderful day filled with joy, celebration, and everything that makes you happy.
        </p>
        <p style="font-size:14px;color:#888;line-height:1.7;font-family:Arial,sans-serif;max-width:380px;margin:0 auto;">
          It's been a pleasure knowing you. Here's to another great year ahead!
        </p>
        <div style="margin-top:28px;font-size:14px;color:${DARK};font-family:Georgia,serif;font-style:italic;">
          Warmly,<br/>
          <strong style="font-style:normal;">Ali Aldin</strong><br/>
          <span style="font-size:11px;color:#aaa;font-style:normal;">The Heartland Agent</span>
        </div>
      </div>
    `, token)
  };
}

// ── 4. PROPERTY ANNIVERSARY ──────────────────────────────────────────────────
function anniversaryEmail(name, token, years) {
  const yr = years === 1 ? '1 year' : `${years} years`;
  return {
    subject: `${yr} in your home — Ali Aldin, The Heartland Agent`,
    html: shell(`
      <div style="text-align:center;padding:16px 0 24px;">
        <div style="font-size:44px;margin-bottom:14px;">🏡</div>
        <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:400;color:${DARK};margin:0 0 8px;">
          Happy ${yr} in your home, ${name}!
        </h1>
        <div style="width:60px;height:2px;background:${GOLD};margin:0 auto 18px;"></div>
      </div>
      <p style="font-size:14px;color:#555;line-height:1.8;font-family:Arial,sans-serif;margin:0 0 14px;">
        It's been ${yr} since we worked together — and I hope you've loved every moment in your home.
      </p>
      <p style="font-size:14px;color:#555;line-height:1.8;font-family:Arial,sans-serif;margin:0 0 14px;">
        Real estate markets shift constantly, and your home's value may have changed significantly. If you're ever curious what it's worth today — or thinking about your next move — I'm always happy to provide a free, no-obligation market update.
      </p>
      <div style="background:#fff;border:1px solid #e8e2d8;border-left:3px solid ${GOLD};padding:16px 20px;border-radius:0 6px 6px 0;margin:0 0 20px;">
        <p style="font-size:13px;color:${DARK};font-family:Arial,sans-serif;margin:0;">
          📊 Want to know what your home is worth today? Reply to this email or WhatsApp me at 
          <a href="https://wa.me/14166060494" style="color:${GOLD};">416.606.0494</a> — completely free, no commitment.
        </p>
      </div>
      <p style="font-size:14px;color:#555;font-family:Arial,sans-serif;margin:0;">
        Here's to many more great years!<br/>
        <strong style="color:${DARK};">Ali Aldin</strong> — The Heartland Agent
      </p>
    `, token)
  };
}

// ── 5. QUARTERLY MARKET UPDATE (bulk) ────────────────────────────────────────
function marketUpdateEmail(name, token, { subject: subj, headline, body: bodyContent, quarter }) {
  return {
    subject: subj || `GTA West Market Update — ${quarter || 'Q' + Math.ceil((new Date().getMonth()+1)/3) + ' ' + new Date().getFullYear()}`,
    html: shell(`
      <div style="background:${DARK};margin:-28px -32px 28px;padding:20px 32px;">
        <p style="font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:${GOLD};margin:0 0 6px;">Quarterly Market Report</p>
        <h1 style="font-family:Georgia,serif;font-size:24px;font-weight:400;color:#fff;margin:0;line-height:1.3;">
          ${headline || 'GTA West Real Estate Update'}
        </h1>
        <p style="font-size:11px;color:rgba(255,255,255,0.4);margin:6px 0 0;font-family:Arial,sans-serif;">
          ${quarter || new Date().toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}
        </p>
      </div>
      <p style="font-size:14px;color:#555;font-family:Arial,sans-serif;margin:0 0 16px;">Hi ${name},</p>
      <div style="font-size:14px;color:#444;line-height:1.85;font-family:Arial,sans-serif;">${bodyContent}</div>
      <div style="margin-top:24px;background:#fff;border-radius:8px;border:1px solid #e8e2d8;padding:18px 20px;">
        <p style="font-size:12px;color:${GOLD};letter-spacing:.1em;text-transform:uppercase;margin:0 0 8px;font-family:Arial,sans-serif;">Questions about your property?</p>
        <p style="font-size:13px;color:#555;font-family:Arial,sans-serif;margin:0;">
          Reply to this email or WhatsApp Ali at 
          <a href="https://wa.me/14166060494" style="color:${GOLD};">416.606.0494</a> for a personalized assessment.
        </p>
      </div>
      <div style="margin-top:20px;">
        <p style="font-size:13px;color:${DARK};font-family:Arial,sans-serif;margin:0;">
          Until next quarter,<br/>
          <strong>Ali Aldin</strong> — The Heartland Agent
        </p>
      </div>
    `, token)
  };
}

// ── 6. NOTIFICATION TO ALI (all form submissions) ────────────────────────────
const FORM_BADGES = {
  seller: { emoji: '🏡', label: 'Seller — Free Valuation' },
  buyer:  { emoji: '🔍', label: 'Buyer Inquiry' },
  investor: { emoji: '📈', label: 'Investor Inquiry' },
  consultation: { emoji: '💬', label: 'Free Consultation' }
};

function adminNotification(data) {
  const { formType, name, phone, email, address, propertyType, yearBuilt,
          timeline, budget, bedrooms, areas, investmentGoal, investmentBudget,
          portfolio, preferredContact, bestTime, topic, notes,
          dateOfBirth, propertyAnniversary, howHeard, marketingConsent } = data;

  const b = FORM_BADGES[formType] || { emoji: '📋', label: formType };
  const tel = (phone||'').replace(/\D/g,'');

  const rows = [
    ['Name', `<strong>${name}</strong>`],
    ['Phone', `<a href="tel:${phone}" style="color:${GOLD};">${phone}</a>`],
    ['Email', `<a href="mailto:${email}" style="color:${GOLD};">${email}</a>`],
    ...(address ? [['Property', address]] : []),
    ...(propertyType ? [['Type', propertyType]] : []),
    ...(yearBuilt ? [['Year Built', yearBuilt]] : []),
    ...(budget ? [['Budget', budget]] : []),
    ...(bedrooms ? [['Bedrooms', bedrooms]] : []),
    ...(areas ? [['Areas', areas]] : []),
    ...(investmentGoal ? [['Investment Goal', investmentGoal]] : []),
    ...(investmentBudget ? [['Capital', investmentBudget]] : []),
    ...(portfolio ? [['Portfolio', portfolio]] : []),
    ...(topic ? [['Topic', topic]] : []),
    ...(preferredContact ? [['Preferred Contact', preferredContact]] : []),
    ...(bestTime ? [['Best Time', bestTime]] : []),
    ...(timeline ? [['Timeline', timeline]] : []),
    ...(dateOfBirth ? [['Date of Birth', dateOfBirth]] : []),
    ...(propertyAnniversary ? [['Property Anniversary', propertyAnniversary]] : []),
    ...(howHeard ? [['How Found Ali', howHeard]] : []),
    ['Marketing Consent', marketingConsent === 'yes' ? '✅ Yes — added to CRM' : '❌ No — inquiry only'],
    ...(notes ? [['Notes', notes]] : [])
  ].map(([l,v]) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #e8e2d8;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#aaa;font-family:Arial,sans-serif;width:34%;vertical-align:top;">${l}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e8e2d8;font-size:13px;color:${DARK};font-family:Arial,sans-serif;">${v}</td>
    </tr>`).join('');

  return {
    subject: `${b.emoji} ${b.label} — ${name}${address ? ' · ' + address : ''}`,
    html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:${CREAM};padding:0;">
      <div style="background:${DARK};padding:20px 28px;">
        <div style="display:inline-block;background:${GOLD};border-radius:3px;padding:5px 12px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#fff;">${b.emoji} ${b.label}</div>
        <h2 style="color:#fff;font-size:18px;margin:10px 0 0;font-weight:400;">${name}</h2>
      </div>
      <div style="padding:24px 28px;">
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
        <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;">
          <a href="https://wa.me/${tel}" style="background:#25D366;color:#fff;padding:10px 18px;border-radius:4px;text-decoration:none;font-size:12px;font-weight:600;">WhatsApp ${name}</a>
          <a href="mailto:${email}" style="background:${GOLD};color:#fff;padding:10px 18px;border-radius:4px;text-decoration:none;font-size:12px;font-weight:600;">Email ${name}</a>
          <a href="tel:${tel}" style="background:${DARK};color:#fff;padding:10px 18px;border-radius:4px;text-decoration:none;font-size:12px;font-weight:600;">Call ${name}</a>
        </div>
      </div>
    </div>`
  };
}

// ── SEND helper ──────────────────────────────────────────────────────────────
async function send({ to, from, subject, html }) {
  const t = getTransporter();
  await t.sendMail({
    from: from || `"Ali Aldin — The Heartland Agent" <${process.env.GMAIL_USER}>`,
    to, subject, html
  });
}

module.exports = {
  send,
  welcomeEmail,
  welcomeFollowUp,
  birthdayEmail,
  anniversaryEmail,
  marketUpdateEmail,
  adminNotification
};
