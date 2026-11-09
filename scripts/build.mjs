import { mkdir, writeFile, readFile, rm, cp, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pages, renderPage } from "../src/site/pages.mjs";
import { site } from "../src/site/config.mjs";
import { faq } from "../src/site/content/site-content.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const assets = join(root, "src", "site", "assets");
// Built by `npm run build -w @ai-ulu/sablonlar` (root `npm run build` runs it first).
const gallery = join(root, "apps", "sablonlar", "dist");

async function write(rel, content) {
  const target = join(dist, rel);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

async function build() {
  try {
    await access(join(gallery, "index.html"));
  } catch {
    throw new Error("apps/sablonlar/dist yok: önce `npm run build -w @ai-ulu/sablonlar` çalıştırın.");
  }
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  await cp(assets, dist, { recursive: true });
  await cp(gallery, join(dist, "sablonlar"), { recursive: true });
  // One render-blocking stylesheet: font faces + design system (fonts.css stays for the gallery app).
  const css = (await readFile(join(assets, "fonts", "fonts.css"), "utf8")) + (await readFile(join(assets, "site.css"), "utf8"));
  await write("site.css", css);

  // ?v=<content hash> lets these files be cached as immutable; any edit changes the URL.
  const versions = {};
  for (const rel of ["/site.css", "/app.js", "/ora.js"]) {
    versions[rel] = createHash("sha256").update(await readFile(join(dist, rel))).digest("hex").slice(0, 10);
  }
  const asset = (rel) => (versions[rel] ? `${rel}?v=${versions[rel]}` : rel);
  for (const p of pages) await write(p.file, renderPage(p, asset));

  await write("robots.txt", `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`);

  const paths = [...pages.filter((p) => p.inSitemap !== false).map((p) => p.path), "/sablonlar/"];
  await write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${site.url}${p}</loc></url>`).join("\n")}
</urlset>
`);

  // GEO: a plain summary AI assistants can quote.
  await write("llms.txt", `# ${site.name}

> ${site.description}

## Sayfalar
- [Ana sayfa](${site.url}/): hizmetler, süreç, paketler, SSS ve iletişim formu
- [Örnek tasarımlar](${site.url}/sablonlar/): sektöre göre site tarzı örnekleri
- [Gizlilik ve KVKK](${site.url}/gizlilik/)

## Hizmetler
- Tanıtım sitesi: markaya özel tasarım, hızlı açılış, Google ve yapay zekâ aramalarına hazır yapı
- Özel web uygulaması: panel, portal, randevu, sipariş, otomasyon
- Site + uygulama: tek tasarım dili, tek ekip
- Fiyat listesi yok; ücretsiz görüşmeden sonra 24 saat içinde yazılı teklif

## İletişim
- E-posta: ${site.email}
- Telefon / WhatsApp: ${site.phoneDisplay}

## SSS
${faq.items.map((f) => `- ${f.q} ${f.a}`).join("\n")}
`);

  // Security headers. CSP stays 'self'-only: fonts, three.js and images are all served from this origin.
  const immutable = "  Cache-Control: public, max-age=31536000, immutable";
  await write("_headers", `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/site.css
${immutable}

/app.js
${immutable}

/ora.js
${immutable}

/fonts/*
${immutable}

/vendor/*
${immutable}

/sablonlar/assets/*
${immutable}

/img/*
  Cache-Control: public, max-age=604800

/sablonlar/stiller/*
  Cache-Control: public, max-age=604800
`);

  console.log(`✓ build: ${pages.length} sayfa + örnek tasarımlar + assets → dist/`);
}

build().catch((err) => {
  console.error("build failed:", err);
  process.exit(1);
});
