// api/counter.js
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const NAMESPACE = 'aryashevanahk';
  const KEY       = 'profile-views';

  let views = 0;
  try {
    const r = await fetch(`https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${KEY}`);
    if (!r.ok) throw new Error(`abacus ${r.status}`);
    views = (await r.json()).value;
  } catch (e) {
    console.error('counter failed:', e.message);
    // fallback: tetap tampilkan badge tanpa increment
  }

  const message = shortNumber(views);
  const url = `https://img.shields.io/badge/Profile%20Views-${message}-9f7aea`
            + `?style=for-the-badge&logo=github&labelColor=purple`;

  const svg = await (await fetch(url)).text();
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=86400');
  res.status(200).send(svg);
}

function shortNumber(n) {
  const units = ['', 'K', 'M', 'B', 'T'];
  let i = 0;
  while (n >= 1000 && i < units.length - 1) { n /= 1000; i++; }
  const v = Math.round(n * 10) / 10;
  return (Number.isInteger(v) ? v : v.toFixed(1)) + units[i];
}