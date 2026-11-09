import { site } from "../config.mjs";
import { nav, footerLinks } from "../content/site-content.mjs";
import { escapeHtml } from "../lib/html.mjs";

function head({ title, description, path, jsonLd, asset }) {
  const fullTitle = title ? `${title} · ${site.name}` : site.title;
  const url = `${site.url}${path}`;
  const ld = jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : "";
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escapeHtml(fullTitle)}</title>
<meta name="description" content="${escapeHtml(description)}">
${path.endsWith(".html") ? `<meta name="robots" content="noindex">` : `<link rel="canonical" href="${url}">`}
<meta name="theme-color" content="#08090b">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${escapeHtml(fullTitle)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.url}/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="tr_TR">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/bodoni-moda-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${asset("/site.css")}">
${ld}`;
}

function header() {
  const links = nav
    .map((n) => `<a href="${n.href}"${n.keep ? ' class="keep"' : ""}>${escapeHtml(n.label)}</a>`)
    .join("\n    ");
  return `<header class="site-header">
  <a class="logo" href="/" aria-label="${site.name} ana sayfa">${site.name}</a>
  <nav aria-label="Ana menü">
    ${links}
  </nav>
  <a class="btn" href="${site.whatsapp}" rel="noopener">WhatsApp</a>
</header>`;
}

function footer(note) {
  const links = footerLinks.map((l) => `<a href="${l.href}">${escapeHtml(l.label)}</a>`).join("");
  return `<footer class="site-footer">
  <span>© ${new Date().getFullYear()} ${escapeHtml(site.owner)} · ${site.name}${note ? ` · ${escapeHtml(note)}` : ""}</span>
  <nav aria-label="Alt menü">${links}</nav>
</footer>`;
}

// asset(path) adds a content hash so CSS/JS can be cached for a year; scripts: extra module scripts.
export function page({ title, description = site.description, path, body, jsonLd = null, scripts = [], footerNote = "", asset }) {
  const extra = scripts.map((src) => `<script type="module" src="${asset(src)}"></script>`).join("\n");
  return `<!doctype html>
<html lang="${site.lang}">
<head>
${head({ title, description, path, jsonLd, asset })}
</head>
<body>
<a class="skip-link" href="#main">İçeriğe geç</a>
${header()}
<main id="main">
${body}
</main>
${footer(footerNote)}
<script src="${asset("/app.js")}" defer></script>
${extra}
</body>
</html>`;
}
