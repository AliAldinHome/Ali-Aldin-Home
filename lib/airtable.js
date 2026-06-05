// lib/airtable.js — CRM helper (Airtable as database)
// Airtable free tier: 1,000 records, great visual interface, no SQL needed

const BASE = () => `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Contacts`;
const HEADERS = () => ({
  'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
  'Content-Type': 'application/json'
});

// ── CREATE a new contact record ──────────────────────────────────────────────
async function createContact(fields) {
  const res = await fetch(BASE(), {
    method: 'POST',
    headers: HEADERS(),
    body: JSON.stringify({ fields })
  });
  if (!res.ok) throw new Error(`Airtable create failed: ${await res.text()}`);
  return res.json();
}

// ── FIND contact by email (case-insensitive) ─────────────────────────────────
async function findByEmail(email) {
  const formula = encodeURIComponent(`LOWER({Email})=LOWER("${email}")`);
  const res = await fetch(`${BASE()}?filterByFormula=${formula}&maxRecords=1`, {
    headers: HEADERS()
  });
  const data = await res.json();
  return data.records?.[0] || null;
}

// ── FIND contact by unsubscribe token ────────────────────────────────────────
async function findByToken(token) {
  const formula = encodeURIComponent(`{UnsubscribeToken}="${token}"`);
  const res = await fetch(`${BASE()}?filterByFormula=${formula}&maxRecords=1`, {
    headers: HEADERS()
  });
  const data = await res.json();
  return data.records?.[0] || null;
}

// ── UPDATE a record by Airtable record ID ────────────────────────────────────
async function updateContact(recordId, fields) {
  const res = await fetch(`${BASE()}/${recordId}`, {
    method: 'PATCH',
    headers: HEADERS(),
    body: JSON.stringify({ fields })
  });
  if (!res.ok) throw new Error(`Airtable update failed: ${await res.text()}`);
  return res.json();
}

// ── GET all active, consented contacts (for market updates) ──────────────────
async function getMarketingList() {
  const formula = encodeURIComponent(`AND({MarketingConsent}=1,{Status}="Active")`);
  const fields = ['Name','Email','UnsubscribeToken'].map(f => `fields[]=${f}`).join('&');
  const records = [];
  let offset = '';

  do {
    const url = `${BASE()}?filterByFormula=${formula}&${fields}${offset ? `&offset=${offset}` : ''}`;
    const res = await fetch(url, { headers: HEADERS() });
    const data = await res.json();
    records.push(...(data.records || []));
    offset = data.offset || '';
  } while (offset);

  return records;
}

// ── GET contacts with today's birthday ───────────────────────────────────────
async function getTodayBirthdays() {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const yr = now.getFullYear();

  // Match month+day, consented, active, not sent this year
  const formula = encodeURIComponent(
    `AND({MarketingConsent}=1,{Status}="Active",{DateOfBirth}!="",` +
    `MONTH({DateOfBirth})=${m},DAY({DateOfBirth})=${d},` +
    `OR({BirthdaySentYear}="",VALUE({BirthdaySentYear})<${yr}))`
  );
  const res = await fetch(`${BASE()}?filterByFormula=${formula}`, {
    headers: HEADERS()
  });
  const data = await res.json();
  return data.records || [];
}

// ── GET contacts with today's property anniversary ────────────────────────────
async function getTodayAnniversaries() {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const yr = now.getFullYear();

  const formula = encodeURIComponent(
    `AND({MarketingConsent}=1,{Status}="Active",{PropertyAnniversary}!="",` +
    `MONTH({PropertyAnniversary})=${m},DAY({PropertyAnniversary})=${d},` +
    `OR({AnniversarySentYear}="",VALUE({AnniversarySentYear})<${yr}))`
  );
  const res = await fetch(`${BASE()}?filterByFormula=${formula}`, {
    headers: HEADERS()
  });
  const data = await res.json();
  return data.records || [];
}

// ── GET contacts for 3-day welcome follow-up ─────────────────────────────────
async function getWelcomeFollowUps() {
  // Created 3 days ago, consent given, WelcomeStep = 1 (immediate sent, follow-up pending)
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const dateStr = threeDaysAgo.toISOString().split('T')[0];

  const formula = encodeURIComponent(
    `AND({MarketingConsent}=1,{Status}="Active",{WelcomeStep}=1,` +
    `IS_SAME({CreatedAt},"${dateStr}","day"))`
  );
  const res = await fetch(`${BASE()}?filterByFormula=${formula}`, {
    headers: HEADERS()
  });
  const data = await res.json();
  return data.records || [];
}

module.exports = {
  createContact, findByEmail, findByToken, updateContact,
  getMarketingList, getTodayBirthdays, getTodayAnniversaries, getWelcomeFollowUps
};
