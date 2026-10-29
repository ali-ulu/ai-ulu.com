// node build.mjs  ->  dist/ (EN: /, TR: /tr/) + robots, sitemap, llms.txt, favicon
import { mkdirSync, writeFileSync, cpSync, readFileSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { SITE, T, panorama, gridIds } from "./content.mjs";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const css = readFileSync(new URL("./style.css", import.meta.url), "utf8");
const js = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const waLink = (t) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t)}`;
const arrow = `<span class="ic"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
const eyebrow = (s) => `<span class="pill eyebrow"><i></i>${esc(s)}<i></i></span>`;
const href = (u, p) => (u.startsWith("http") ? u : p + u);
const byId = Object.fromEntries(panorama.map((w) => [w.id, w]));

// Görsel boyutları assets/ ile eşleşmeli (1440x900) — yanlış width/height layout shift yapar.
const IMG_W = 1440, IMG_H = 900;
const srcset = (p, img) =>
  ` srcset="${p}assets/${img.replace(".webp", "-480.webp")} 480w, ${p}assets/${img.replace(".webp", "-720.webp")} 720w, ${p}assets/${img} 1440w" sizes="(max-width:700px) 92vw, (max-width:1100px) 46vw, 36vw"`;

const grad = (id) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb27a"/><stop offset="1" stop-color="#fa6114"/></linearGradient></defs>`;
const icons = [
  `<svg viewBox="0 0 120 120" aria-hidden="true">${grad("g1")}<rect x="14" y="26" width="92" height="68" rx="14" fill="#140b06" stroke="url(#g1)" stroke-width="3"/><path d="M14 46h92" stroke="url(#g1)" stroke-width="3"/><circle cx="28" cy="36" r="3.5" fill="#fa6114"/><circle cx="40" cy="36" r="3.5" fill="#ffb27a"/><path d="M30 64h34M30 76h54" stroke="#fa6114" stroke-width="5" stroke-linecap="round" opacity=".85"/></svg>`,
  `<svg viewBox="0 0 120 120" aria-hidden="true">${grad("g2")}<rect x="34" y="12" width="52" height="96" rx="14" fill="#140b06" stroke="url(#g2)" stroke-width="3"/><rect x="44" y="28" width="32" height="20" rx="6" fill="#fa6114" opacity=".9"/><rect x="44" y="56" width="14" height="14" rx="4" fill="#ffb27a" opacity=".8"/><rect x="62" y="56" width="14" height="14" rx="4" fill="#fa6114" opacity=".6"/><rect x="44" y="76" width="32" height="8" rx="4" fill="#fa6114" opacity=".5"/></svg>`,
  `<svg viewBox="0 0 120 120" aria-hidden="true">${grad("g3")}<rect x="8" y="24" width="72" height="54" rx="12" fill="#140b06" stroke="url(#g3)" stroke-width="3"/><rect x="62" y="42" width="48" height="66" rx="12" fill="#1c0f08" stroke="url(#g3)" stroke-width="3"/><path d="M20 44h30M20 56h46" stroke="#fa6114" stroke-width="5" stroke-linecap="round" opacity=".8"/><circle cx="86" cy="74" r="10" fill="#fa6114" opacity=".9"/></svg>`,
];
const probIcons = [
  `<svg viewBox="0 0 160 90" aria-hidden="true"><rect x="8" y="10" width="44" height="70" rx="8"/><rect x="58" y="10" width="44" height="70" rx="8"/><rect x="108" y="10" width="44" height="70" rx="8"/><path d="M16 28h28M16 40h20M66 28h28M66 40h20M116 28h28M116 40h20"/></svg>`,
  `<svg viewBox="0 0 160 90" aria-hidden="true"><rect x="30" y="26" width="100" height="32" rx="16"/><path d="M62 42h36"/><path d="m122 64 14 14"/></svg>`,
  `<svg viewBox="0 0 160 90" aria-hidden="true"><path d="M14 74V40M44 74V24M74 74V32M104 74V54M134 74V68"/><path d="M14 74h132" opacity=".5"/></svg>`,
];

function nav(t) {
  return `<header class="navwrap"><div class="nav glass">
  <a class="brand" href="${t.dir}" aria-label="ai-ulu"><span class="mark"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 3 3 9v11h18V9z" fill="currentColor"/><path d="M12 8v8M8.5 11.5 12 8l3.5 3.5" stroke="#090401" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span>ai-ulu</span></a>
  <nav aria-label="Primary">${t.nav.map(([id, l]) => `<a href="#${id}">${esc(l)}</a>`).join("")}</nav>
  <div class="tools">
    <a class="lang" href="${t.alt}" hreflang="${t.lang === "en" ? "tr" : "en"}" data-cta="lang">${t.altLabel}</a>
    <button class="theme" id="theme" type="button" aria-label="${esc(t.themeLabel)}"><svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" fill="currentColor"/></svg></button>
    <a class="btn white" href="#contact" data-cta="nav-start">${esc(t.start)}${arrow}</a>
  </div></div></header>`;
}

function hero(t, p) {
  const at = byId.attalia;
  const tiles = panorama.map((w, i) => {
    const tag = w.url ? "a" : "div";
    const attrs = w.url ? ` href="${href(w.url, p)}" target="_blank" rel="noopener" data-cta="pano-${w.id}"` : "";
    return `<${tag} class="tile" data-i="${i}"${attrs}><img src="${p}assets/${w.img}"${srcset(p, w.img)} alt="${esc(w.name)}" width="${IMG_W}" height="${IMG_H}" decoding="async"><span class="tile-meta"><b>${esc(w.name)}</b><em>${esc(t.work.kinds[w.kind])}</em></span></${tag}>`;
  }).join("");
  return `<section class="hero" aria-labelledby="h1">
  <div class="orb" aria-hidden="true"><i></i><i></i><i></i></div><div class="stars" aria-hidden="true"></div>
  <figure class="hero-card glass" aria-label="Attalia"><img src="${p}assets/${at.img}"${srcset(p, at.img)} alt="Attalia website" width="${IMG_W}" height="${IMG_H}" decoding="async"><figcaption><b>Attalia</b><em>${esc(t.hero.card)}</em></figcaption></figure>
  <div class="wrap hero-copy">
    <p class="pill badge"><span class="spark">✦</span>${esc(t.hero.badge)}</p>
    <h1 id="h1">${t.hero.h1}</h1>
    <p class="lead">${esc(t.hero.sub)}</p>
    <div class="cta-row"><a class="btn acc" href="#contact" data-cta="hero-start">${esc(t.start)}${arrow}</a><a class="btn ghost" href="#work" data-cta="hero-works">${esc(t.works)}</a></div>
    <ul class="chips">${t.hero.chips.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
  </div>
  <div class="flow" id="flow" aria-roledescription="carousel" aria-label="${t.work.h}"><div class="flow-stage">${tiles}</div><div class="flow-ctl"><button type="button" class="fb" data-d="-1" aria-label="${esc(t.work.prev)}"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button type="button" class="fb pp" id="flow-pp" aria-pressed="false" data-pause="${esc(t.work.pause)}" data-play="${esc(t.work.play)}" aria-label="${esc(t.work.pause)}"><svg class="ic-pause" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 5v14M15 5v14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg><svg class="ic-play" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg></button><button type="button" class="fb" data-d="1" aria-label="${esc(t.work.next)}"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>
</section>`;
}

function workGrid(t, p) {
  return gridIds.map((id, i) => {
    const w = byId[id];
    const tag = w.url ? "a" : "div";
    const attrs = w.url ? ` href="${href(w.url, p)}" target="_blank" rel="noopener" data-cta="work-${w.id}"` : "";
    return `<${tag} class="bz work-card w${i}"${attrs}><div class="core">
      <div class="shot"><img src="${p}assets/${w.img}"${srcset(p, w.img)} alt="${esc(w.name)}" loading="lazy" decoding="async" width="${IMG_W}" height="${IMG_H}"></div>
      <div class="work-body"><span class="kind">${esc(t.work.kinds[w.kind])}</span><h3>${esc(w.name)}</h3><p>${esc(t.work.desc[w.id])}</p>
      <span class="open">${w.url ? esc(t.work.open) + arrow : esc(t.work.soon)}</span></div></div></${tag}>`;
  }).join("");
}

function jsonld(t, url) {
  const org = `${SITE.origin}/#org`, person = `${SITE.origin}/#ali`;
  const logo = `${SITE.origin}/assets/logo.svg`;
  const sameAs = [SITE.github, SITE.linkedin].filter(Boolean);
  // Hizmet kataloğu doğrudan görünür içerikten (services.items) türetilir — uydurma yok.
  const offers = t.services.items.map(([h, b], i) => ({
    "@type": "Offer", "@id": `${url}#offer-${i}`, name: h, description: b,
    priceCurrency: "USD", availability: "https://schema.org/InStock",
    url: `${url}#services`, seller: { "@id": org },
  }));
  const graph = [
    { "@type": "Organization", "@id": org, name: "ai-ulu", url: SITE.origin + "/", description: t.ld.orgDesc,
      logo: { "@type": "ImageObject", url: logo }, image: logo, founder: { "@id": person }, sameAs },
    { "@type": "WebSite", "@id": `${SITE.origin}/#site`, url: SITE.origin + "/", name: "ai-ulu", inLanguage: ["en", "tr"], publisher: { "@id": org } },
    { "@type": "ProfessionalService", "@id": `${SITE.origin}/#service`, name: "ai-ulu", description: t.desc, url, parentOrganization: { "@id": org },
      serviceType: t.services.items.map(([h]) => h), hasOfferCatalog: { "@type": "OfferCatalog", name: t.pricing.h, itemListElement: offers },
      areaServed: { "@type": "Place", name: "Worldwide" }, availableLanguage: ["English", "Turkish"] },
    { "@type": "Person", "@id": person, name: "Ali Ulu", jobTitle: "Founder", worksFor: { "@id": org }, url: SITE.origin + "/", sameAs },
    { "@type": "WebPage", "@id": `${url}#page`, url, name: t.title, description: t.desc, inLanguage: t.htmlLang,
      isPartOf: { "@id": `${SITE.origin}/#site` }, about: { "@id": `${SITE.origin}/#service` }, primaryImageOfPage: { "@type": "ImageObject", url: logo },
      speakable: { "@type": "SpeakableSpecification", cssSelector: ["#h1", ".lead"] } },
    { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: "ai-ulu", item: SITE.origin + "/" }] },
    { "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: t.faq.items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ];
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}

function page(t) {
  const p = t.lang === "en" ? "" : "../";
  const url = SITE.origin + t.dir;
  const enUrl = SITE.origin + "/", trUrl = SITE.origin + "/tr/";
  const cfg = { waNum: SITE.whatsapp, c: t.contact };
  return `<!doctype html>
<html lang="${t.htmlLang}" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="${enUrl}"><link rel="alternate" hreflang="tr" href="${trUrl}"><link rel="alternate" hreflang="x-default" href="${enUrl}">
<meta property="og:type" content="website"><meta property="og:site_name" content="ai-ulu">
<meta property="og:title" content="${esc(t.title)}"><meta property="og:description" content="${esc(t.desc)}">
<meta property="og:url" content="${url}"><meta property="og:locale" content="${t.lang === "en" ? "en_US" : "tr_TR"}">
<meta property="og:image" content="${SITE.origin}/assets/og-cover.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(t.title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(t.title)}"><meta name="twitter:description" content="${esc(t.desc)}">
<meta name="twitter:image" content="${SITE.origin}/assets/og-cover.png">
<meta name="theme-color" content="#090401">
<link rel="icon" href="${p}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Instrument+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap">
<script>try{var s=localStorage.getItem("theme");if(s)document.documentElement.setAttribute("data-theme",s)}catch(e){}document.documentElement.classList.add("js")</script>
<style>${css}</style>
<script type="application/ld+json">${jsonld(t, url)}</script>
</head>
<body>
<div class="aurora" aria-hidden="true"><i></i><i></i><i></i><i></i></div><div class="grain" aria-hidden="true"></div>
<a class="skip" href="#main">${esc(t.skip)}</a>
${nav(t)}
<main id="main">
${hero(t, p)}
<div class="marquee" aria-hidden="true"><div class="mq-track">${[0, 1].map(() => `<span>${t.marquee.map((w) => `<b>${esc(w)}</b><i>✦</i>`).join("")}</span>`).join("")}</div></div>

<section class="sec wrap center" aria-labelledby="hp">${eyebrow(t.problem.eyebrow)}<h2 id="hp">${t.problem.h}</h2><p class="lead">${esc(t.problem.sub)}</p>
  <div class="cards3">${t.problem.items.map(([h, b], i) => `<article class="bz"><div class="core left"><div class="viz">${probIcons[i]}</div><h3>${esc(h)}</h3><p>${esc(b)}</p></div></article>`).join("")}</div></section>

<section class="sec wrap center" aria-labelledby="hso">${eyebrow(t.solution.eyebrow)}<h2 id="hso">${t.solution.h}</h2><p class="lead">${esc(t.solution.sub)}</p>
  <div class="stats">${t.solution.stats.map(([n, l]) => `<div class="bz"><div class="core stat"><strong>${esc(n)}</strong><span>${esc(l)}</span></div></div>`).join("")}</div>
  <a class="btn acc" href="#work" data-cta="solution-works">${esc(t.works)}${arrow}</a></section>

<section id="services" class="sec wrap center" aria-labelledby="hs">${eyebrow(t.services.eyebrow)}<h2 id="hs">${t.services.h}</h2><p class="lead">${esc(t.services.sub)}</p>
  <div class="cards3 svc">${t.services.items.map(([h, b], i) => `<article class="bz"><div class="core svc-card"><h3>${esc(h)}</h3><div class="ico">${icons[i]}</div><p>${esc(b)}</p></div></article>`).join("")}</div>
  <div class="bz"><div class="core feat left"><div><h3 class="feat-h">${t.services.feat.h}</h3><p>${esc(t.services.feat.text)}</p><a class="btn acc" href="#contact" data-cta="feat-start">${esc(t.start)}${arrow}</a></div>
  <ul>${t.services.feat.items.map(([h, b]) => `<li><b>${esc(h)}</b><span>${esc(b)}</span></li>`).join("")}</ul></div></div></section>

<section id="work" class="sec wrap" aria-labelledby="hw"><div class="work-head"><div>${eyebrow(t.work.eyebrow)}<h2 id="hw">${t.work.h}</h2><p class="lead">${esc(t.work.sub)}</p></div><a class="btn acc" href="#contact" data-cta="work-start">${esc(t.start)}${arrow}</a></div>
  <div class="work-grid">${workGrid(t, p)}</div></section>

<section id="process" class="sec wrap center" aria-labelledby="hpr">${eyebrow(t.process.eyebrow)}<h2 id="hpr">${t.process.h}</h2>
  <ol class="cards3 steps">${t.process.steps.map(([h, b], i) => `<li class="bz"><div class="core left"><span class="num">0${i + 1}</span><h3>${esc(h)}</h3><p>${esc(b)}</p></div></li>`).join("")}</ol></section>

<section id="pricing" class="sec wrap center" aria-labelledby="hpx">${eyebrow(t.pricing.eyebrow)}<h2 id="hpx">${t.pricing.h}</h2><p class="lead">${esc(t.pricing.sub)}</p>
  <div class="cards3 packs">${t.pricing.packs.map(([h, items], i) => `<article class="bz${i === 2 ? " feat-pack" : ""}"><div class="core pack left">${i === 2 ? `<span class="badge-top">${esc(t.pricing.badge)}</span>` : ""}<h3>${esc(h)}</h3><p class="quote">${esc(t.pricing.quote)}</p><ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><a class="btn ${i === 2 ? "acc" : "ghost"}" href="#contact" data-cta="pack-${i}">${esc(t.pricing.cta)}${arrow}</a></div></article>`).join("")}</div></section>

<section id="faq" class="sec wrap center narrow" aria-labelledby="hf">${eyebrow(t.faq.eyebrow)}<h2 id="hf">${esc(t.faq.h)}</h2>
  <div class="faq left">${t.faq.items.map(([q, a]) => `<details class="glass"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></section>

<section id="contact" class="sec wrap" aria-labelledby="hc"><div class="cta-card glass"><div class="cta-glow" aria-hidden="true"></div>
  <div class="contact-copy">${eyebrow(t.contact.eyebrow)}<h2 id="hc">${t.contact.h}</h2><p class="lead">${esc(t.contact.sub)}</p>
    <p class="or">${esc(t.contact.or)}</p><a class="btn ghost" href="${waLink(t.contact.waText)}" target="_blank" rel="noopener" data-cta="contact-whatsapp">${esc(t.contact.waCta)}${arrow}</a></div>
  <form id="lead" class="form" novalidate>
    <label>${esc(t.contact.name)}<input name="name" autocomplete="name" required></label>
    <label>${esc(t.contact.reach)}<input name="reach" autocomplete="email" required></label>
    <label>${esc(t.contact.type)}<select name="type">${t.contact.types.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join("")}</select></label>
    <label>${esc(t.contact.msg)}<textarea name="msg" rows="3"></textarea></label>
    <input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
    <button class="btn acc" type="submit" data-cta="form-submit">${esc(t.contact.send)}${arrow}</button>
    <p class="status" id="status" role="status" aria-live="polite"></p>
  </form></div></section>
</main>
<footer class="foot wrap"><p>${esc(t.footer.rights)}</p><p>${esc(t.footer.tag)}</p>
  <p class="links"><a href="${SITE.github}" rel="noopener">GitHub</a>${SITE.linkedin ? ` · <a href="${SITE.linkedin}" rel="noopener">LinkedIn</a>` : ""} · <a href="${waLink(t.contact.waText)}" rel="noopener">WhatsApp</a></p></footer>
<a class="wa-float" href="${waLink(t.contact.waText)}" target="_blank" rel="noopener" aria-label="WhatsApp" data-cta="float-whatsapp"><svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.4z"/></svg></a>
<script>window.__CFG=${JSON.stringify(cfg).replace(/</g, "\\u003c")}</script>
<script>${js}</script>${analytics}
</body>
</html>`;
}

// Analitik: yalnızca token tanımlıysa enjekte edilir (çerezsiz, KVKK dostu).
const analytics = SITE.cloudflareAnalytics
  ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${SITE.cloudflareAnalytics}"}'></script>`
  : "";

// Şablon sayfaları: üretilen HTML'e SEO meta + ai-ulu dönüş şeridi eklenir.
// Palet/tasarım korunur; yalnızca <head> meta ve üstte geri dönüş linki eklenir.
function enrichTemplate(html, name, desc, slug) {
  const url = `${SITE.origin}/templates/${slug}/`;
  const head = [
    `<meta name="description" content="${esc(desc)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta name="robots" content="index,follow">`,
    `<meta property="og:type" content="website"><meta property="og:site_name" content="ai-ulu">`,
    `<meta property="og:title" content="${esc(name)} — ai-ulu template">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${SITE.origin}/assets/og-cover.png">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org", "@graph": [
        { "@type": "WebPage", "@id": `${url}#page`, name: `${name} — ai-ulu template`, description: desc,
          url, inLanguage: "en", isPartOf: { "@id": `${SITE.origin}/#site` },
          about: { "@type": "Service", "@id": `${url}#service`, name: `${name} template`,
            description: desc, provider: { "@id": `${SITE.origin}/#org` },
            offers: { "@type": "Offer", priceCurrency: "USD", availability: "https://schema.org/InStock", url: `${SITE.origin}/#contact` } },
          publisher: { "@id": `${SITE.origin}/#org` } },
        { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
          { "@type": "ListItem", position: 1, name: "ai-ulu", item: `${SITE.origin}/` },
          { "@type": "ListItem", position: 2, name: "Templates", item: `${SITE.origin}/templates/` },
          { "@type": "ListItem", position: 3, name: name, item: url },
        ] },
      ],
    }).replace(/</g, "\\u003c")}</script>`,
  ].join("");
  // Palet-nötr bar: hem açık hem koyu şablon paletinde okunur, sayfa sınıflandırmasını çevirmez.
  const bar = `<div style="position:fixed;left:0;right:0;bottom:0;z-index:99;display:flex;justify-content:center;padding:16px;pointer-events:none">
<a href="${SITE.origin}/" style="pointer-events:auto;display:inline-flex;align-items:center;gap:10px;background:#fff;border:1px solid #00000022;border-radius:99px;padding:10px 18px;color:#1a0b04;font:500 14px system-ui,sans-serif;text-decoration:none">← <b style="font-weight:600">ai-ulu</b> · this template is adapted to your brand</a></div>`;
  return html
    .replace("</head>", `${head}</head>`)
    .replace(/<body([^>]*)>/, `<body$1>${bar}`);
}

const TEMPLATES = [
  ["clinic", "Aura Aesthetic Clinic", "Aesthetic clinic template: warm neutral palette, arch imagery and a booking-first layout.", "Aesthetic clinic website template"],
  ["restaurant", "Maison Olive", "Restaurant template: wood-fired kitchen, menu-forward layout and a reservation call to action.", "Restaurant website template"],
  ["law", "Hale & Rowe", "Law firm template: navy and gold, practice-area grid and a consultation call to action.", "Law firm website template"],
  ["studio", "Atelier Nord", "Architecture studio template: editorial grid, project list and a strong typographic voice.", "Architecture studio website template"],
  ["fitness", "Pulse Studio", "Fitness studio template: high-contrast type, class schedule chips and a free-class call to action.", "Fitness studio website template"],
];

// /templates/ dizin sayfası — llms.txt bu adrese işaret ediyor, 403 olmamalı.
function templatesIndex() {
  const url = `${SITE.origin}/templates/`;
  const cards = TEMPLATES.map(([slug, name, desc]) =>
    `<li style="border:1px solid #ffffff1f;border-radius:20px;padding:22px;background:#ffffff0a"><a href="./${slug}/" style="color:#fff6ee;text-decoration:none"><b style="font:300 30px 'Cormorant Garamond',Georgia,serif;display:block;margin-bottom:6px">${esc(name)}</b><span style="color:#ffb23d;font:600 11.5px/1.2 'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase">${esc(slug)}</span></a><p style="color:#e8d6c8cc;margin:12px 0 0;font:400 15px/1.6 'Instrument Sans',system-ui,sans-serif">${esc(desc)}</p></li>`
  ).join("");
  return `<!doctype html>
<html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Website templates — ai-ulu</title>
<meta name="description" content="Five starter website templates from ai-ulu: aesthetic clinic, restaurant, law firm, architecture studio and fitness studio. Each one is adapted to your brand.">
<link rel="canonical" href="${url}">
<meta property="og:title" content="Website templates — ai-ulu"><meta property="og:description" content="Five starter templates, each adapted to your brand.">
<meta property="og:url" content="${url}"><meta property="og:image" content="${SITE.origin}/assets/og-cover.png">
<meta name="theme-color" content="#090401">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Instrument+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap">
<style>body{margin:0;background:#070302;color:#fff6ee;font:400 17px/1.6 "Instrument Sans",system-ui,sans-serif}
.aur{position:fixed;inset:0;z-index:-1;background:radial-gradient(60% 50% at 80% 10%,#ff5f1288,transparent 70%),radial-gradient(50% 50% at 10% 90%,#ffb23d55,transparent 70%)}
.w{width:min(1080px,100% - 40px);margin-inline:auto;padding-block:clamp(60px,9vw,120px)}
h1{font:300 clamp(44px,7vw,92px)/.95 "Cormorant Garamond",Georgia,serif;letter-spacing:-.02em;margin:0 0 .3em}
h1 em{font-style:italic;color:#ff8a3d}
ul{list-style:none;padding:0;margin:56px 0 0;display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.back{display:inline-flex;gap:10px;align-items:center;color:#ffb23d;text-decoration:none;font:500 15px system-ui;margin-bottom:34px}
p.lead{color:#e8d6c8cc;max-width:60ch;font-size:clamp(17px,1.5vw,20px)}</style></head>
<body><div class="aur" aria-hidden="true"></div>
<main class="w"><a class="back" href="${SITE.origin}/">← ai-ulu</a>
<h1>Five templates,<br><em>one build system.</em></h1>
<p class="lead">Starter sites for clinics, restaurants, law firms, studios and fitness. Each one is rebuilt around your brand, content and goals — not resold as-is.</p>
<ul>${cards}</ul></main></body></html>`;
}

// 404 — hosting'in varsayılan sayfası yerine markalı sayfa.
function notFound() {
  return `<!doctype html>
<html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Page not found — ai-ulu</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="#090401">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Instrument+Sans:wght@400;500&display=swap">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#070302;color:#fff6ee;font:400 17px/1.6 "Instrument Sans",system-ui,sans-serif;text-align:center;padding:24px}
.aur{position:fixed;inset:0;z-index:-1;background:radial-gradient(60% 50% at 70% 20%,#ff5f1299,transparent 70%),radial-gradient(50% 50% at 10% 90%,#ffb23d44,transparent 70%)}
h1{font-family:"Cormorant Garamond",Georgia,serif;font-weight:300;font-size:clamp(80px,18vw,180px);line-height:.9;margin:0;color:#ff8a3d}
h2{font-family:"Cormorant Garamond",Georgia,serif;font-weight:300;font-size:clamp(28px,4vw,44px);line-height:1.05;margin:12px 0 18px}
p{color:#e8d6c8cc;max-width:44ch;margin:0 auto 30px}
a.b{display:inline-flex;align-items:center;gap:12px;background:linear-gradient(180deg,#ff8a3d,#d94a08);color:#1a0b04;padding:14px 26px;border-radius:99px;text-decoration:none;font-weight:600}</style></head>
<body><div class="aur" aria-hidden="true"></div><div>
<h1>404</h1><h2>This page isn't here.</h2>
<p>The link may be old, or the page may have moved. The work and the contact form are one click away.</p>
<a class="b" href="${SITE.origin}/">Back to ai-ulu →</a></div></body></html>`;
}

rmSync(new URL("./dist", import.meta.url), { recursive: true, force: true });
mkdirSync(new URL("./dist/tr", import.meta.url), { recursive: true });
writeFileSync(new URL("./dist/index.html", import.meta.url), page(T.en));
writeFileSync(new URL("./dist/tr/index.html", import.meta.url), page(T.tr));
cpSync(new URL("./assets", import.meta.url), new URL("./dist/assets", import.meta.url), { recursive: true });
cpSync(new URL("./templates", import.meta.url), new URL("./dist/templates", import.meta.url), { recursive: true });

// Şablonları SEO meta + dönüş şeridi ile zenginleştir (palet korunur)
TEMPLATES.forEach(([slug, name, desc]) => {
  const f = new URL(`./dist/templates/${slug}/index.html`, import.meta.url);
  writeFileSync(f, enrichTemplate(readFileSync(f, "utf8"), name, desc, slug));
});
writeFileSync(new URL("./dist/templates/index.html", import.meta.url), templatesIndex());
writeFileSync(new URL("./dist/404.html", import.meta.url), notFound());
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#090401"/><path d="M16 6 6 13v13h20V13z" fill="#fa6114"/></svg>`;
writeFileSync(new URL("./dist/favicon.svg", import.meta.url), fav);
writeFileSync(new URL("./dist/tr/favicon.svg", import.meta.url), fav);
// AI tarayıcıları açıkça karşılanır; llms.txt ve sitemap işaret edilir.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-Web", "anthropic-ai",
  "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot", "cohere-ai", "Bytespider", "Amazonbot", "meta-externalagent"];
writeFileSync(new URL("./dist/robots.txt", import.meta.url),
  `User-agent: *\nAllow: /\n\n# AI crawlers are welcome\n${AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /`).join("\n")}\n\nSitemap: ${SITE.origin}/sitemap.xml\n# Structured summary for AI assistants:\n# ${SITE.origin}/llms.txt\n`);
const alt = (l, u) => `<xhtml:link rel="alternate" hreflang="${l}" href="${u}"/>`;
const sitemapUrls = [
  { loc: "/", alts: [["en", "/"], ["tr", "/tr/"], ["x-default", "/"]], pri: "1.0" },
  { loc: "/tr/", alts: [["en", "/"], ["tr", "/tr/"], ["x-default", "/"]], pri: "0.9" },
  { loc: "/templates/", pri: "0.7" },
  ...TEMPLATES.map(([slug]) => ({ loc: `/templates/${slug}/`, pri: "0.6" })),
];
// lastmod: içeriğin gerçek son commit tarihi (uydurma "bugün" değil). Git yoksa alan atlanır.
const lastmod = (() => {
  try {
    return execSync("git log -1 --format=%cs -- content.mjs build.mjs style.css", { cwd: new URL(".", import.meta.url), encoding: "utf8" }).trim();
  } catch { return ""; }
})();
const lm = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";
const sitemapBody = sitemapUrls.map(({ loc, alts, pri }) =>
  `<url><loc>${SITE.origin}${loc}</loc>${lm}${(alts || []).map(([l, u]) => alt(l, SITE.origin + u)).join("")}<priority>${pri}</priority></url>`
).join("\n");
writeFileSync(new URL("./dist/sitemap.xml", import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapBody}\n</urlset>\n`);
// llms.txt — AI asistanlarının siteyi doğru okuması için yapılandırılmış özet.
// Tüm ifadeler görünür sayfa içeriğiyle birebir tutarlıdır; yeni iddia eklenmez.
const llmsTxt = `# ai-ulu

> ai-ulu designs, builds and launches cinematic websites and custom web apps, and supports them
> after launch. It works in English and Turkish, and takes clients worldwide. One team, from the
> first call to live. Free intro call, written quote within 24 hours.

## Services
- Websites: art-directed brand and marketing sites. Fast, searchable, built to convert.
- Apps: custom web apps and internal tools - dashboards, portals, automations.
- Site + App: one design system across both, so a whole company feels like one product.
- Post-launch support: fixes, changes and ongoing maintenance.

## Pricing
- No published price list. Every project is scoped individually.
- A written quote is delivered within 24 hours of the intro call.
- Three package shapes: Website, App, Site + App. Each includes launch and post-launch support.

## Process
1. Brief - a free 30-minute call to define goal, scope and timeline.
2. Build - design and development in the open, with a clickable live preview.
3. Ship - launch, test on real devices, then stay on for fixes and changes.

## Work
- Attalia - group site for a global commerce holding.
- Hercules Investments - brand group site for a US e-commerce company (https://herculesinvestmentsllc.com).
- Hydrelon - product site for a water-filtration brand (https://hydrelon.com).
- Starter templates: aesthetic clinic, restaurant, law firm, architecture studio, fitness studio
  (${SITE.origin}/templates/). Each is rebuilt around the client's brand, not resold as-is.

## FAQ
- How long does a website take? A focused marketing site usually takes two to four weeks from the
  first call to launch. Larger sites and apps take longer; the timeline is in the quote.
- Do I own the site and the code? Yes - design, code and content are handed over at launch.
- Do you work after launch? Yes - fixes, changes and ongoing maintenance.
- Can you build apps, not just websites? Yes - custom web apps, dashboards and internal tools.
- Which languages? English and Turkish, for the site and for communication.

## Contact
- Website: ${SITE.origin}/
- Turkish: ${SITE.origin}/tr/
- WhatsApp: +90 507 958 16 42
- Contact form: ${SITE.origin}/#contact
- GitHub: ${SITE.github}
`;
writeFileSync(new URL("./dist/llms.txt", import.meta.url), llmsTxt);

// Host-only files: the PHP form handler and the Apache rules. They ship inside
// dist/ so a plain upload of dist/ is the whole deploy.
cpSync(new URL("./hosting/form.php", import.meta.url), new URL("./dist/form.php", import.meta.url));
cpSync(new URL("./hosting/htaccess", import.meta.url), new URL("./dist/.htaccess", import.meta.url));
mkdirSync(new URL("./dist/leads", import.meta.url), { recursive: true });
cpSync(new URL("./hosting/leads/.htaccess", import.meta.url), new URL("./dist/leads/.htaccess", import.meta.url));
console.log("dist hazir");
