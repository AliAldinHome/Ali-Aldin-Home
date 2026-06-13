// api/rates.js — live Bank of Canada policy & prime rate
// Official free API, no key required. Cached 6h to be polite.

let cache = { data: null, time: 0 };
const SIX_HOURS = 6 * 60 * 60 * 1000;

module.exports = async (req, res) => {
  try {
    if (cache.data && (Date.now() - cache.time) < SIX_HOURS) {
      return res.status(200).json(cache.data);
    }

    // Bank of Canada Valet API — overnight policy rate + prime rate
    const url = 'https://www.bankofcanada.ca/valet/observations/V39079,V80691311/json?recent=1';
    const r = await fetch(url, { headers: { 'Accept': 'application/json' } });

    if (!r.ok) throw new Error('BoC fetch failed');
    const json = await r.json();

    const obs = (json.observations && json.observations[0]) || {};
    const overnight = obs.V39079 ? parseFloat(obs.V39079.v) : null;     // target overnight rate
    const prime = obs.V80691311 ? parseFloat(obs.V80691311.v) : null;   // prime business rate

    const result = {
      overnight: overnight !== null ? overnight.toFixed(2) : null,
      prime: prime !== null ? prime.toFixed(2) : null,
      date: obs.d || null,
      source: 'Bank of Canada'
    };

    cache = { data: result, time: Date.now() };
    return res.status(200).json(result);

  } catch (err) {
    console.error('Rates error:', err);
    return res.status(200).json({ error: true, message: 'Could not fetch rates' });
  }
};
