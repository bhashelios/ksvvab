async function loadPartial(id, url) {
  const res = await fetch(url);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("site-header", "/partials/header.html");
  loadPartial("site-footer", "/partials/footer.html");
});
