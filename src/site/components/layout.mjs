import { site } from "../config.mjs";
import { nav, footer } from "../content/site-content.mjs";
import { escapeHtml, icon } from "../lib/html.mjs";

export function head({ title, description, path = "/", jsonLd = null, ogType = "website" }) {
  const fullTitle = title ? `${title} · ${site.name}` : `${site.name} — ${site.tagline}`;
  const url = `${site.url}${path}`;
  const desc = description || site.description;
  const ld = jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
    : "";
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(fullTitle)}</title>
<meta name="description" content="${escapeHtml(desc)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0a0b0f">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${escapeHtml(fullTitle)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="tr_TR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(fullTitle)}">
<meta name="twitter:description" content="${escapeHtml(desc)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/styles.css">
${ld}`;
}

export function header() {
  const links = nav
    .map((n) => `<a href="${n.href}">${escapeHtml(n.label)}</a>`)
    .join("");
  return `<header class="site-header">
  <div class="wrap site-header__inner">
    <a class="brand" href="/" aria-label="${escapeHtml(site.name)} ana sayfa">
      <span class="brand__mark" aria-hidden="true">Ai</span>
      <span>${escapeHtml(site.name)}</span>
    </a>
    <nav class="nav" aria-label="Ana menü">${links}</nav>
    <a class="btn btn--primary header-cta" href="/#iletisim">Teklif al</a>
  </div>
</header>`;
}

export function footerBar() {
  const links = footer.links
    .map((l) => `<li><a href="${l.href}">${escapeHtml(l.label)}</a></li>`)
    .join("");
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="site-footer__grid">
      <div>
        <a class="brand" href="/"><span class="brand__mark" aria-hidden="true">Ai</span><span>${escapeHtml(site.name)}</span></a>
        <p style="color:var(--text-muted);margin-top:.75rem;max-width:34rem">${escapeHtml(footer.note)}</p>
      </div>
      <ul class="site-footer__links">${links}</ul>
    </div>
    <div class="site-footer__bottom">
      <span>© ${year} ${escapeHtml(site.owner)} · ${escapeHtml(site.name)}</span>
      <a href="${site.whatsapp}" rel="noopener" target="_blank">WhatsApp ile yaz ${icon("whatsapp", 16)}</a>
    </div>
  </div>
</footer>`;
}

export function page({ title, description, path = "/", body = "", jsonLd = null, bodyClass = "" }) {
  return `<!doctype html>
<html lang="${site.lang}">
<head>
${head({ title, description, path, jsonLd })}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""}>
<a class="skip-link" href="#main">İçeriğe geç</a>
${header()}
<main id="main">
${body}
</main>
${footerBar()}
<script src="/app.js" defer></script>
</body>
</html>`;
}
