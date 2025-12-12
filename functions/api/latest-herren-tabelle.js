export async function onRequest() {
  const pageUrl =
    "https://www.hkbv-ev.de/classic/landesebene/spielplaene-und-tabellen/saison-25/26/gruppenliga-m-gl1.html";

  const res = await fetch(pageUrl, {
    headers: { "User-Agent": "KSVVAB/1.0 (Cloudflare Pages)" }
  });

  if (!res.ok) {
    return new Response("Konnte Tabellen-Seite nicht laden.", { status: 502 });
  }

  const html = await res.text();

  // Match z.B. M-GL1-Tabelle-08Sp.pdf
  const re = /href="([^"]*M-GL1-Tabelle-(\d+)Sp\.pdf)"/g;

  let best = null; // { href, n }
  for (const m of html.matchAll(re)) {
    const href = m[1];
    const n = Number(m[2]);
    if (!best || n > best.n) best = { href, n };
  }

  if (!best) {
    return new Response("Keine Herren-Tabellen-PDF gefunden.", { status: 404 });
  }

  // Manche Links sind relativ – absolut machen:
  const target = best.href.startsWith("http")
    ? best.href
    : new URL(best.href, pageUrl).toString();

  return Response.redirect(target, 302);
}
