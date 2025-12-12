async function loadPartial(id, url) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error(`Failed to load ${url}:`, err);
  }
}

function markActiveNav() {
  const path = window.location.pathname;

  document.querySelectorAll(".links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;

    // Startseite: nur exakt "/" matchen
    if (href === "/" && path === "/") {
      a.classList.add("active");
      return;
    }

    // Alle anderen: wenn Pfad mit href beginnt (z.B. "/verein/" oder "/verein/xyz")
    if (href !== "/" && path.startsWith(href)) {
      a.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartial("site-header", "/partials/header.html");
  await loadPartial("site-footer", "/partials/footer.html");

  // erst nach dem Laden des Headers markieren (sonst gibt's die Links noch nicht)
  markActiveNav();
});
