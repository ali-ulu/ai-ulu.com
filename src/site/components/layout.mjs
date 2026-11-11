import { site, waLink } from "../config.mjs";
import { nav, footerLinks, socials } from "../content/site-content.mjs";
import { escapeHtml } from "../lib/html.mjs";

function head({ title, description, path, jsonLd, styles = [] }) {
  const fullTitle = title ? `${title} · ${site.name}` : site.title;
  const url = `${site.url}${path}`;
  const ld = jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : "";
  const css = styles.map((href) => `<link rel="stylesheet" href="${href}">`).join("\n");
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escapeHtml(fullTitle)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${url}">
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
<meta property="og:updated_time" content="${site.updated}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/bodoni-moda-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/fonts/fonts.css">
<link rel="stylesheet" href="/site.css">
${css}
${ld}`;
}

function header() {
  const links = nav
    .map((n) => `<a href="${n.href}"${n.keep ? ' class="keep"' : ""}>${escapeHtml(n.label)}</a>`)
    .join("\n      ");
  return `<header class="site-header">
  <div class="nav-glass">
    <a class="logo" href="/" aria-label="${site.name} ana sayfa">${site.name}</a>
    <nav aria-label="Ana menü">
      ${links}
    </nav>
    <a class="btn nav-cta" href="${waLink("Merhaba, web sitem için yazıyorum.")}" rel="noopener">WhatsApp</a>
  </div>
</header>`;
}

// Inline brand marks: single-colour paths that inherit the link colour, so the
// footer needs no extra request and the icons stay legible on the dark ground.
const socialIcons = {
  linkedin:
    '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
  dribbble:
    '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 24C5.39 24 0 18.61 0 12S5.39 0 12 0s12 5.39 12 12-5.39 12-12 12zm10.12-10.36c-.35-.11-3.17-.95-6.38-.44 1.34 3.68 1.89 6.68 1.99 7.31 2.3-1.56 3.94-4.02 4.39-6.87zm-6.11 7.81c-.15-.9-.75-4.03-2.19-7.77l-.07.02c-5.79 2.02-7.86 6.03-8.04 6.4 1.73 1.36 3.92 2.17 6.29 2.17 1.42 0 2.77-.29 4-.82zm-11.62-2.58c.23-.4 3.05-5.06 8.33-6.77.14-.04.27-.08.41-.12-.26-.58-.54-1.17-.83-1.74-4.96 1.44-9.92 1.38-10.37 1.37l-.01.31c0 2.63 1 5.04 2.63 6.86zm-2.42-8.96c.46.01 4.68.03 9.48-1.25-1.7-3.02-3.53-5.56-3.8-5.93-2.87 1.35-5.01 3.99-5.68 7.18zm7.63-7.86c.28.38 2.15 2.91 3.82 6 3.65-1.37 5.19-3.44 5.37-3.7-1.81-1.61-4.19-2.59-6.8-2.59-.82 0-1.63.1-2.4.29zm10.34 3.48c-.22.29-1.94 2.49-5.72 4.04.24.49.47.99.68 1.49.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z"/></svg>',
};

function footer(note) {
  const links = footerLinks.map((l) => `<a href="${l.href}">${escapeHtml(l.label)}</a>`).join("");
  const social = socials.length
    ? `<nav class="footer-social" aria-label="Profiller">${socials
        .map((s) => `<a href="${s.href}" rel="noopener" target="_blank" aria-label="${escapeHtml(s.label)}">${socialIcons[s.icon] ?? ""}</a>`)
        .join("")}</nav>`
    : "";
  return `<footer class="site-footer">
  <span>© ${new Date().getFullYear()} ${escapeHtml(site.owner)} · ${site.name}${note ? ` · ${escapeHtml(note)}` : ""}</span>
  <div class="footer-end">${social}<nav aria-label="Alt menü">${links}</nav></div>
</footer>`;
}

// before: markup placed ahead of the header (the home preloader); scripts: extra module scripts.
export function page({ title, description = site.description, path, body, jsonLd = null, before = "", scripts = [], styles = [], footerNote = "" }) {
  const extra = scripts.map((src) => `<script type="module" src="${src}"></script>`).join("\n");
  return `<!doctype html>
<html lang="${site.lang}">
<head>
${head({ title, description, path, jsonLd, styles })}
</head>
<body>
<a class="skip-link" href="#main">İçeriğe geç</a>
<canvas id="vortex" aria-hidden="true"></canvas>
<div class="vignette" aria-hidden="true"></div>
${before}
${header()}
<main id="main">
${body}
</main>
<div class="callbar" role="group" aria-label="Hızlı iletişim">
<a class="callbar-btn tel" href="tel:${site.phone}">Ara</a>
<a class="callbar-btn wa" href="${waLink("Merhaba, web sitem için yazıyorum.")}" rel="noopener">WhatsApp</a>
</div>
${footer(footerNote)}
<script src="/app.js" defer></script>
<script type="module" src="/vortex.js"></script>
${extra}
</body>
</html>`;
}
