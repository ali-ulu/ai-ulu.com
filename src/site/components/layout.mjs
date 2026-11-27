import { site, waLink } from "../config.mjs";
import { nav, footerLinks, socials } from "../content/site-content.mjs";
import { escapeHtml } from "../lib/html.mjs";
import { trDate } from "../lib/date.mjs";

// Runs before first paint so the entrance animation starts hidden. The build hashes
// this exact string into the CSP script-src, so edit it only here.
export const ENTER_SCRIPT = 'document.documentElement.classList.add("m-enter")';

function head({ title, description, path, jsonLd, styles = [], noscript = "", canonical = true, noindex = false }) {
  const fullTitle = title ? `${title} · ${site.name}` : site.title;
  const url = `${site.url}${path}`;
  const ld = jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : "";
  const css = styles.map((href) => `<link rel="stylesheet" href="${href}">`).join("\n");
  // The 404 has no canonical: it is served for many unknown URLs, so naming one
  // would be a lie. Everything else points at its own absolute URL.
  const canonicalTag = canonical ? `<link rel="canonical" href="${url}">\n` : "";
  // An explicit directive on every page: crawlers get one unambiguous answer
  // instead of inferring it from defaults.
  const robotsTag = `<meta name="robots" content="${noindex ? "noindex, nofollow" : "index, follow"}">\n`;
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escapeHtml(fullTitle)}</title>
<meta name="description" content="${escapeHtml(description)}">
${canonicalTag}${robotsTag}<meta name="theme-color" content="#F4F1EA">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${escapeHtml(fullTitle)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.url}/og.png">
<meta property="og:image:alt" content="${escapeHtml(fullTitle)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="tr_TR">
<meta property="og:updated_time" content="${site.updated}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(fullTitle)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${site.url}/og.png">
<meta name="twitter:image:alt" content="${escapeHtml(fullTitle)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="alternate" type="application/rss+xml" title="${site.name} Blog" href="/feed.xml">
<link rel="preload" href="/fonts/bodoni-moda-normal-latin-ext.woff2" as="font" type="font/woff2" crossorigin fetchpriority="high">
<link rel="preload" href="/fonts/bodoni-moda-normal-latin.woff2" as="font" type="font/woff2" crossorigin fetchpriority="high">
<link rel="preload" href="/fonts/hanken-grotesk-normal-latin-ext.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/hanken-grotesk-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/fonts/fonts.css">
<link rel="stylesheet" href="/site.css">
<link rel="stylesheet" href="/print.css" media="print">
${css}
${ld}${noscript}`;
}

// Visible breadcrumb trail. Google shows it in the result and the BreadcrumbList
// JSON-LD (built in pages.mjs) mirrors the same order.
function breadcrumbNav(crumbs) {
  if (!crumbs?.length) return "";
  const items = crumbs
    .map((c, i) => {
      const last = i === crumbs.length - 1;
      const inner = last
        ? `<span aria-current="page">${escapeHtml(c.label)}</span>`
        : `<a href="${c.href}">${escapeHtml(c.label)}</a>`;
      return `<li>${inner}</li>`;
    })
    .join("");
  return `<nav class="crumbs" aria-label="Site yolu"><ol>${items}</ol></nav>`;
}

function header() {
  const links = nav
    .map((n) => `<a href="${n.href}"${n.keep ? ' class="keep"' : ""}>${escapeHtml(n.label)}</a>`)
    .join("\n      ");
  return `<header class="site-header">
  <div class="nav-glass">
    <a class="logo" href="/" aria-label="${site.name} ana sayfa">
      <svg class="logo-mark" viewBox="0 0 1518 1036" aria-hidden="true" focusable="false" fill="currentColor"><path transform="translate(489.9375,39.8125)" d="M0 0 C0.38 0 0.38 0 2.29 0 C88.12 0.23 176.87 29.7 243.06 85.19 C244.13 86.06 245.19 86.93 246.25 87.8 C259.97 99.13 273.51 111.34 285.08 124.87 C286.59 126.64 288.13 128.39 289.67 130.13 C352.7 201.66 382.87 294.44 423.07 446.52 C423.86 449.72 424.65 452.91 425.44 456.11 C427.82 465.79 430.2 475.47 432.56 485.15 C464.75 617.26 464.75 617.26 504.06 656.19 C504.76 656.91 505.46 657.63 506.18 658.38 C525.4 676.95 552.91 685.81 579.24 685.54 C604.96 684.73 626.91 676.18 647.06 660.19 C648.11 659.4 649.17 658.62 650.25 657.81 C685.5 624.91 694.2 571.27 695.97 525.44 C696.3 513.98 696.22 502.51 696.22 491.05 C696.22 486.88 696.23 482.71 696.24 478.54 C696.25 471.33 696.26 464.12 696.26 456.92 C696.27 445.51 696.29 434.1 696.31 422.69 C696.32 418.78 696.33 414.86 696.34 410.95 C696.34 409.97 696.34 408.99 696.34 407.99 C696.36 396.89 696.38 385.79 696.4 374.69 C696.4 373.68 696.4 372.67 696.41 371.63 C696.43 355.2 696.45 338.78 696.47 322.35 C696.48 305.44 696.51 288.53 696.55 271.62 C696.58 261.21 696.59 250.8 696.59 240.4 C696.59 233.26 696.61 226.13 696.63 219 C696.64 214.89 696.65 210.79 696.64 206.68 C696.59 165.47 705.15 127.89 733.06 96.19 C733.85 95.26 734.65 94.34 735.46 93.39 C741.14 86.91 747.2 81.39 754.06 76.19 C754.84 75.59 755.62 75 756.42 74.39 C781.56 56.03 810.87 46.96 841.88 46.94 C842.56 46.94 843.25 46.94 843.96 46.94 C855.22 46.95 866.08 47.58 877.06 50.19 C877.42 50.27 877.42 50.27 879.2 50.69 C914.13 59.25 945.91 81.65 965.06 112.19 C965.42 112.75 965.77 113.32 966.14 113.9 C973.73 126.16 979.35 139.03 983.38 152.88 C983.5 153.29 983.5 153.29 984.11 155.39 C987.42 167.35 988.36 179.09 988.32 191.46 C988.32 192.97 988.32 194.47 988.33 195.97 C988.33 200.06 988.33 204.15 988.32 208.24 C988.32 212.67 988.33 217.1 988.33 221.52 C988.34 230.19 988.34 238.85 988.33 247.51 C988.33 254.56 988.33 261.62 988.33 268.67 C988.33 269.17 988.33 269.17 988.33 271.72 C988.33 273.76 988.33 275.81 988.33 277.85 C988.34 297.01 988.33 316.17 988.32 335.33 C988.31 351.72 988.31 368.11 988.32 384.49 C988.33 403.57 988.34 422.64 988.33 441.71 C988.33 443.75 988.33 445.79 988.33 447.83 C988.33 448.84 988.33 449.84 988.33 450.88 C988.33 457.9 988.33 464.92 988.34 471.95 C988.34 480.54 988.34 489.13 988.33 497.71 C988.32 502.08 988.32 506.45 988.33 510.82 C988.36 536.79 987.26 562.41 983.88 588.19 C983.77 589 983.66 589.81 983.56 590.65 C975.14 654.71 955.08 717.1 919.06 771.19 C918.59 771.9 918.12 772.61 917.63 773.35 C911.46 782.58 904.94 791.48 898.06 800.19 C897.41 801.02 896.76 801.86 896.08 802.72 C882.56 819.87 867.9 837.36 851.25 851.56 C849.11 853.4 847 855.25 844.93 857.17 C837.75 863.84 830.04 869.72 822.2 875.58 C820.22 877.07 818.24 878.57 816.27 880.08 C806.93 887.13 797.14 893.26 787.06 899.19 C786.45 899.55 785.84 899.91 785.21 900.28 C781.8 902.29 778.37 904.25 774.91 906.16 C773.64 906.87 772.38 907.58 771.11 908.29 C699.92 948.4 613.79 961.62 476.06 944.19 C475.15 943.95 474.24 943.72 473.3 943.48 C380.37 919.19 308.37 856.6 254.04 767.94 C247.25 756.27 241.16 744.22 235.06 732.19 C233.26 734.89 231.89 737.48 230.48 740.39 C217.25 767.49 201.86 792.58 183.06 816.19 C182.7 816.65 182.7 816.65 180.84 819 C175.65 825.45 170.15 831.57 164.51 837.62 C163.03 839.22 161.57 840.83 160.12 842.45 C153.46 849.81 146.51 856.63 139.06 863.19 C138.54 863.65 138.02 864.12 137.48 864.6 C103.19 895.24 62.32 918 19.06 933.19 C18.67 933.33 18.67 933.33 16.7 934.04 C-48.08 957.37 -121.76 960.7 -188.94 946.19 C-190.06 945.95 -191.19 945.7 -192.35 945.45 C-218.43 939.71 -243.97 931 -267.94 919.19 C-268.38 918.97 -268.38 918.97 -270.64 917.87 C-298.73 904.08 -324.78 886.23 -347.94 865.19 C-348.57 864.61 -349.21 864.04 -349.86 863.45 C-361.93 852.52 -372.78 840.94 -382.94 828.19 C-383.82 827.1 -384.71 826.01 -385.59 824.91 C-396.39 811.5 -405.45 797.15 -413.94 782.19 C-414.29 781.57 -414.64 780.95 -415.01 780.31 C-450.68 717.4 -459.63 639.83 -440.94 570.19 C-429.46 530.15 -411.73 492.99 -385.94 460.19 C-385.16 459.19 -384.38 458.2 -383.57 457.17 C-369.85 440.08 -354.28 423.62 -336.94 410.19 C-335.88 409.31 -334.83 408.43 -333.78 407.55 C-316.35 393.01 -296.92 380.89 -276.94 370.19 C-276.02 369.69 -275.09 369.2 -274.14 368.69 C-258.23 360.24 -241.85 353.38 -224.94 347.19 C-224.43 347 -224.43 347 -221.88 346.06 C-190.15 334.57 -156.85 327.69 -123.38 323.94 C-122.64 323.85 -121.9 323.77 -121.13 323.69 C-53.43 316.17 20.05 322.8 84.06 347.19 C75.12 332.49 64.58 318.95 53.06 306.19 C52.28 305.32 51.49 304.45 50.68 303.55 C20.87 272.22 -21.86 256.41 -63.94 251.19 C-64.62 251.09 -65.31 251 -66.01 250.9 C-90.36 247.94 -116.84 249.12 -140.94 253.19 C-142.15 253.39 -143.36 253.6 -144.61 253.81 C-195.24 262.56 -243.17 280.13 -288.12 304.92 C-313.84 319.07 -342.12 329.64 -371.74 322.15 C-387.18 317.5 -399.75 309.33 -407.94 295.19 C-416.87 277.93 -416.4 260.57 -410.75 242.37 C-402.44 217.95 -386.32 196.75 -369.94 177.19 C-369.49 176.64 -369.03 176.1 -368.57 175.54 C-361.43 166.97 -353.92 158.97 -345.94 151.19 C-343.17 148.43 -340.42 145.66 -337.67 142.88 C-331.6 136.76 -325.55 130.72 -318.94 125.19 C-318.02 124.39 -317.11 123.6 -316.16 122.79 C-308.09 115.82 -299.73 109.29 -291.2 102.89 C-289.69 101.75 -288.18 100.61 -286.68 99.47 C-274.2 89.99 -261.3 81.39 -247.94 73.19 C-247.06 72.65 -246.19 72.11 -245.29 71.55 C-185.6 34.89 -119.15 11.35 -49.56 2.88 C-48.9 2.79 -48.23 2.71 -47.55 2.63 C-31.72 0.72 -15.93 -0.03 0 0 Z M-80.94 476.19 C-81.39 476.28 -81.39 476.28 -83.67 476.72 C-121.46 484.31 -158.32 498.5 -186.79 525.21 C-188.94 527.19 -188.94 527.19 -191.51 529.22 C-210.94 544.94 -223.68 572.16 -228.94 596.19 C-229.16 597.2 -229.39 598.2 -229.62 599.24 C-235.06 628.12 -228.65 659.46 -212.52 683.95 C-207.55 691.2 -202.01 697.84 -195.94 704.19 C-195.34 704.85 -194.74 705.51 -194.12 706.19 C-168.98 733.02 -127.49 747.06 -91.39 748.31 C-87.16 748.41 -82.92 748.43 -78.69 748.44 C-77.93 748.44 -77.18 748.44 -76.4 748.44 C-64.03 748.42 -52.08 747.73 -39.94 745.19 C-39.12 745.02 -38.31 744.85 -37.47 744.68 C-2.98 737.43 26.44 721.13 52.06 697.19 C52.89 696.42 53.71 695.65 54.56 694.85 C61.14 688.5 66.74 681.6 72.06 674.19 C72.48 673.61 72.89 673.04 73.31 672.45 C98.92 636.43 112.37 591.07 115.06 547.19 C115.13 546.25 115.2 545.32 115.26 544.36 C115.46 541.38 115.58 538.41 115.69 535.44 C115.72 534.98 115.72 534.98 115.87 532.66 C115.93 528.91 115.89 526.28 113.58 523.23 C111.5 521.36 109.37 519.77 107.06 518.19 C106.31 517.64 105.55 517.08 104.77 516.51 C71.98 492.97 35.09 479.17 -4.94 474.19 C-5.61 474.1 -6.27 474.02 -6.96 473.93 C-12.53 473.25 -18.02 473.01 -23.63 472.98 C-24.53 472.98 -25.44 472.97 -26.37 472.96 C-29.26 472.95 -32.16 472.94 -35.06 472.94 C-36.05 472.94 -37.04 472.94 -38.06 472.94 C-52.55 472.95 -66.69 473.31 -80.94 476.19 Z "/></svg>
      <span class="logo-word">${escapeHtml(site.name)}</span>
    </a>
    <nav aria-label="Ana menü">
      ${links}
    </nav>
    <a class="btn nav-cta" href="${waLink("Merhaba, web sitem için yazıyorum.")}" rel="noopener">WhatsApp</a>
  </div>
</header>`;
}

// Profile marks, rendered inside the 3D buttons (see .social-btn in site.css).
const socialIcons = {
  linkedin:
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
  github:
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z"/></svg>',
};

function footer(note) {
  const links = footerLinks.map((l) => `<a href="${l.href}">${escapeHtml(l.label)}</a>`).join("");
  const social = socials.length
    ? `<nav class="footer-social" aria-label="Profiller">${socials
        .map((s) => `<a class="social-btn" href="${s.href}" rel="noopener" target="_blank" aria-label="${escapeHtml(s.label)}">${socialIcons[s.icon] ?? ""}</a>`)
        .join("")}</nav>`
    : "";
  return `<footer class="site-footer">
  <span>© ${new Date().getFullYear()} <a href="/hakkimizda/" rel="author">${escapeHtml(site.owner)}</a> · ${site.name}${note ? ` · ${escapeHtml(note)}` : ""} · Son güncelleme: <time datetime="${site.updated}">${trDate(site.updated)}</time></span>
  <div class="footer-end">${social}<nav aria-label="Alt menü">${links}</nav></div>
</footer>`;
}

// before: markup placed ahead of the header (the home preloader); scripts: extra module scripts.
export function page({ title, description = site.description, path, body, jsonLd = null, before = "", scripts = [], styles = [], footerNote = "", crumbs = [], trail = null, noscript = "", canonical = true, noindex = false }) {
  const extra = scripts.map((src) => `<script type="module" src="${src}"></script>`).join("\n");
  const cfAnalytics = site.cfAnalyticsToken
    ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${escapeHtml(site.cfAnalyticsToken)}"}'></script>`
    : "";
  return `<!doctype html>
<html lang="${site.lang}">
<head>
<script>${ENTER_SCRIPT}</script>
${head({ title, description, path, jsonLd, styles, noscript, canonical, noindex })}
</head>
<body>
<a class="skip-link" href="#main">İçeriğe geç</a>
${before}
${header()}
<main id="main">
${breadcrumbNav(trail ?? crumbs)}
${body}
</main>
<nav class="callbar" aria-label="Hızlı iletişim">
<a class="callbar-btn tel" href="tel:${site.phone}">Ara</a>
<a class="callbar-btn wa" href="${waLink("Merhaba, web sitem için yazıyorum.")}" rel="noopener">WhatsApp</a>
</nav>
${footer(footerNote)}
<script src="/app.js" defer></script>

${extra}
${cfAnalytics}
</body>
</html>`;
}
