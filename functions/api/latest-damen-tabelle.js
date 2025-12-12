export async function onRequest() {
  const pageUrl =
    "https://www.hkbv-ev.de/classic/landesebene/spielplaene-und-tabellen/saison-25/26/gruppenliga-f-gl1.html";

  const res = await fetch(pageUrl, {
    headers: { "User-Agent": "KSVVAB/1.0 (Cloudflare Pages)" }
  });

  if (!res.ok) {
    return new Response("Konnte Tabellen-Seite nicht laden.", { status: 502 });
  }

  const html = await res.text();

  // Match z.B. F-GL1-Tabelle-08Sp.pdf
  const re = /href="([^"]*F-GL1-Tabelle-(\d+)Sp\.pdf)"/g;

  let best = null;
  for (const m of html.matchAll(re)) {
    const href = m[1];
    const n = Number(m[2]);
    if (!best || n > best.n) best = { href, n };
  }

  if (!best) {
    return new Response("Keine Tabellen-PDF gefunden.", { status: 404 });
  }

  const target = best.href.startsWith("http")
    ? best.href
    : new URL(best.href, pageUrl).toString();

  return Response.redirect(target, 302);
}
