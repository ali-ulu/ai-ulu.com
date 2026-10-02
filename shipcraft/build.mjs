// node build.mjs  ->  dist/ (EN: /, TR: /tr/) + robots, sitemap, llms.txt, favicon
import { mkdirSync, writeFileSync, cpSync, readFileSync } from "node:fs";
import { SITE, T, panorama, gridIds } from "./content.mjs";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const css = readFileSync(new URL("./style.css", import.meta.url), "utf8");
const js = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const waLink = (t) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t)}`;
const arrow = `<span class="ic"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
const eyebrow = (s) => `<span class="pill eyebrow"><i></i>${esc(s)}<i></i></span>`;
const href = (u, p) => (u.startsWith("http") ? u : p + u);
const byId = Object.fromEntries(panorama.map((w) => [w.id, w]));

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
  <a class="brand" href="${t.dir}" aria-label="ai-ulu Shipcraft"><span class="mark"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 3 3 9v11h18V9z" fill="currentColor"/><path d="M12 8v8M8.5 11.5 12 8l3.5 3.5" stroke="#090401" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span>Shipcraft</span></a>
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
    return `<${tag} class="tile" data-i="${i}"${attrs}><img src="${p}assets/${w.img}" alt="${esc(w.name)}" width="1440" height="836"><span class="tile-meta"><b>${esc(w.name)}</b><em>${esc(t.work.kinds[w.kind])}</em></span></${tag}>`;
  }).join("");
  return `<section class="hero" aria-labelledby="h1">
  <div class="orb" aria-hidden="true"><i></i><i></i><i></i></div><div class="stars" aria-hidden="true"></div>
  <figure class="hero-card glass" aria-label="Attalia"><img src="${p}assets/${at.img}" alt="Attalia website" width="1440" height="836"><figcaption><b>Attalia</b><em>${esc(t.hero.card)}</em></figcaption></figure>
  <div class="wrap hero-copy">
    <p class="pill badge"><span class="spark">✦</span>${esc(t.hero.badge)}</p>
    <h1 id="h1">${t.hero.h1}</h1>
    <p class="lead">${esc(t.hero.sub)}</p>
    <div class="cta-row"><a class="btn acc" href="#contact" data-cta="hero-start">${esc(t.start)}${arrow}</a><a class="btn ghost" href="#work" data-cta="hero-works">${esc(t.works)}</a></div>
    <ul class="chips">${t.hero.chips.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
  </div>
  <div class="flow" id="flow" aria-roledescription="carousel" aria-label="${t.work.h}"><div class="flow-stage">${tiles}</div><div class="flow-ctl"><button type="button" class="fb" data-d="-1" aria-label="Previous"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button type="button" class="fb" data-d="1" aria-label="Next"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div></div>
</section>`;
}

function workGrid(t, p) {
  return gridIds.map((id, i) => {
    const w = byId[id];
    const tag = w.url ? "a" : "div";
    const attrs = w.url ? ` href="${href(w.url, p)}" target="_blank" rel="noopener" data-cta="work-${w.id}"` : "";
    return `<${tag} class="bz work-card w${i}"${attrs}><div class="core">
      <div class="shot"><img src="${p}assets/${w.img}" alt="${esc(w.name)}" loading="lazy" width="1440" height="836"></div>
      <div class="work-body"><span class="kind">${esc(t.work.kinds[w.kind])}</span><h3>${esc(w.name)}</h3><p>${esc(t.work.desc[w.id])}</p>
      <span class="open">${w.url ? esc(t.work.open) + arrow : esc(t.work.soon)}</span></div></div></${tag}>`;
  }).join("");
}

function jsonld(t, url) {
  const org = `${SITE.origin}/#org`, person = `${SITE.origin}/#ali`;
  const sameAs = [SITE.github, SITE.linkedin].filter(Boolean);
  const graph = [
    { "@type": "Organization", "@id": org, name: "ai-ulu", url: SITE.origin + "/", description: t.ld.orgDesc, founder: { "@id": person }, sameAs },
    { "@type": "WebSite", "@id": `${SITE.origin}/#site`, url: SITE.origin + "/", name: "ai-ulu", inLanguage: ["en", "tr"], publisher: { "@id": org } },
    { "@type": "ProfessionalService", "@id": `${SITE.origin}/#shipcraft`, name: "Shipcraft", description: t.desc, url, parentOrganization: { "@id": org },
      serviceType: ["Website development", "Web application development", "Web design"], areaServed: "Worldwide", availableLanguage: ["English", "Turkish"] },
    { "@type": "Person", "@id": person, name: "Ali Ulu", jobTitle: "Founder", worksFor: { "@id": org }, url: SITE.origin + "/", sameAs },
    { "@type": "FAQPage", mainEntity: t.faq.items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
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
<meta property="og:image" content="${SITE.origin}/assets/og.png"><meta name="twitter:card" content="summary_large_image">
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
<script>${js}</script>
</body>
</html>`;
}

mkdirSync(new URL("./dist/tr", import.meta.url), { recursive: true });
writeFileSync(new URL("./dist/index.html", import.meta.url), page(T.en));
writeFileSync(new URL("./dist/tr/index.html", import.meta.url), page(T.tr));
cpSync(new URL("./assets", import.meta.url), new URL("./dist/assets", import.meta.url), { recursive: true });
cpSync(new URL("./templates", import.meta.url), new URL("./dist/templates", import.meta.url), { recursive: true });
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#090401"/><path d="M16 6 6 13v13h20V13z" fill="#fa6114"/></svg>`;
writeFileSync(new URL("./dist/favicon.svg", import.meta.url), fav);
writeFileSync(new URL("./dist/tr/favicon.svg", import.meta.url), fav);
writeFileSync(new URL("./dist/robots.txt", import.meta.url), `User-agent: *\nAllow: /\n\n# AI crawlers are welcome\nUser-agent: GPTBot\nAllow: /\nUser-agent: ClaudeBot\nAllow: /\nUser-agent: PerplexityBot\nAllow: /\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: ${SITE.origin}/sitemap.xml\n`);
const alt = (l, u) => `<xhtml:link rel="alternate" hreflang="${l}" href="${u}"/>`;
writeFileSync(new URL("./dist/sitemap.xml", import.meta.url), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${["/", "/tr/"].map((d) => `<url><loc>${SITE.origin}${d}</loc>${alt("en", SITE.origin + "/")}${alt("tr", SITE.origin + "/tr/")}${alt("x-default", SITE.origin + "/")}</url>`).join("\n")}\n</urlset>\n`);
writeFileSync(new URL("./dist/llms.txt", import.meta.url), `# ai-ulu — Shipcraft\n\n> Shipcraft is the web and app studio of ai-ulu, run by Ali Ulu. It designs, builds and launches cinematic websites and custom web apps, and supports them after launch. Languages: English and Turkish.\n\n## What we do\n- Websites: brand and marketing sites with art direction and motion\n- Apps: custom web apps, dashboards, internal tools\n- Site + App under one design system\n\n## Work\n- Attalia (group site), Hercules Investments (https://herculesinvestmentsllc.com), Hydrelon (https://hydrelon.com)\n- Starter templates: aesthetic clinic, restaurant, law firm, architecture studio, fitness studio (https://ai-ulu.com/templates/)\n\n## How to start\nFree intro call, written quote within 24 hours. Pricing is scoped per project.\n- English: ${SITE.origin}/\n- Turkish: ${SITE.origin}/tr/\n- WhatsApp: +90 507 958 16 42\n`);
console.log("dist hazir");
