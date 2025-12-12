export async function onRequest() {
  const pageUrl =
    "https://www.hkbv-ev.de/classic/landesebene/spielplaene-und-tabellen/saison-25/26/gruppenliga-f-gl1.html";

  const res = await fetch(pageUrl, {
    headers: { "User-Agent": "KSVVAB/1.0 (Cloudflare Pages)" },
  });

  if (!res.ok) {
    return new Response("Konnte Tabellen-Seite nicht laden.", { status: 502 });
  }

  const html = await res.text();

  // Damen-PDFs heißen z.B. F-GL-1-120-8Sp.pdf
  const re = /href="([^"]*F-GL-1-120-(\d+)Sp\.pdf)"/gi;

  let best = null; // { href, n }
  for (const m of html.matchAll(re)) {
    const href = m[1];
    const n = Number(m[2]);
    if (!best || n > best.n) best = { href, n };
  }

  if (!best) {
    return new Response("Keine Damen-Tabellen-PDF gefunden.", { status: 404 });
  }

  const target = best.href.startsWith("http")
    ? best.href
    : new URL(best.href, pageUrl).toString();

  return Response.redirect(target, 302);
}
