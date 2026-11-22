import { mkdir, writeFile, rm, cp, access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { transform } from "esbuild";
import { pages, renderPage, notFoundPage } from "../src/site/pages.mjs";
import { site } from "../src/site/config.mjs";
import { posts } from "../src/site/content/blog.mjs";
import { robotsTxt, aiTxt } from "../src/site/robots.mjs";
import { faq } from "../src/site/content/site-content.mjs";
import { byDateDesc } from "../src/site/components/blog.mjs";
import { ENTER_SCRIPT } from "../src/site/components/layout.mjs";
import { createHash } from "node:crypto";

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

// Minify the hand-written CSS and JS in place. Files that ship already minified
// (three.js, the Vite bundle) are left alone, as is fonts.css, whose @font-face
// rules are tiny and read better unminified.
const MINIFY_CSS = ["site.css", "blog.css", "faq-drawer.css", "postmark-form.css", "print.css", "work.css"];
const MINIFY_JS = ["app.js", "vortex.js", "ora.js", "checkup.js"];

async function minify(rel, loader) {
  const target = join(dist, rel);
  const source = await readFile(target, "utf8");
  const { code } = await transform(source, { loader, minify: true, legalComments: "none", target: "esnext" });
  await writeFile(target, code, "utf8");
}

// Source files behind each page; lastmod is the newest commit touching them.
// shortcut: shared files (pages.mjs, site-content.mjs) bump several pages at once, split per page if that gets noisy.
const SOURCES = {
  "/": ["src/site/components/home.mjs", "src/site/content/site-content.mjs"],
  "/sss/": ["src/site/components/faq.mjs", "src/site/content/site-content.mjs"],
  "/blog/": ["src/site/components/blog.mjs", "src/site/content/blog.mjs"],
  "/calismalar/": ["src/site/components/work.mjs", "src/site/content/work.mjs"],
  "/checkup/": ["src/site/pages.mjs", "src/checkup.js"],
  "/sablonlar/": ["apps/sablonlar/index.html", "apps/sablonlar/src"],
};
function lastmod(path) {
  const post = posts.find((p) => path === `/blog/${p.slug}/`);
  if (post) return post.updated;
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...(SOURCES[path] ?? ["src/site/pages.mjs"])], { cwd: root, encoding: "utf8" });
    return out.trim() || site.updated;
  } catch {
    return site.updated; // no git (tarball build): fall back to the build date
  }
}

async function build() {
  try {
    await access(join(gallery, "index.html"));
  } catch {
    throw new Error("apps/sablonlar/dist yok: önce `npm run build -w @ai-ulu/sablonlar` çalıştırın.");
  }
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  for (const p of pages) await write(p.file, renderPage(p));
  await write(notFoundPage.file, renderPage(notFoundPage));
  await cp(assets, dist, { recursive: true });
  await cp(gallery, join(dist, "sablonlar"), { recursive: true });

  for (const rel of MINIFY_CSS) await minify(rel, "css");
  for (const rel of MINIFY_JS) await minify(rel, "js");

  // Permanent redirects. /hakkimizda/ is a real page now; the English spelling
  // people guess lands on it, and the bare contact URLs go to the form.
  await write(
    "_redirects",
    `# from                to              status
/about               /hakkimizda/   301
/about/              /hakkimizda/   301
/ai.txt              /.well-known/ai.txt  301
/iletisim            /#iletisim     301
/iletisim/           /#iletisim     301
/contact             /#iletisim     301
/contact/            /#iletisim     301
`,
  );

  await write("robots.txt", robotsTxt(site));
  // AI access and usage policy. Some tools look under /.well-known/, so the
  // root /ai.txt is a redirect to this canonical copy.
  await write(".well-known/ai.txt", aiTxt(site));

  // Web app manifest: installable shell and the icons browsers expect.
  await write(
    "manifest.webmanifest",
    JSON.stringify(
      {
        name: `${site.name} — ${site.title.split(" — ")[1] ?? "Web siteleri"}`,
        short_name: site.name,
        description: site.description,
        lang: site.lang,
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#08090b",
        theme_color: "#08090b",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      null,
      2,
    ) + "\n",
  );

  // IndexNow ownership proof: the file must be served at /<key>.txt.
  await write(`${site.indexNowKey}.txt`, `${site.indexNowKey}\n`);

  const paths = [...pages.map((p) => p.path), "/sablonlar/"];
  await write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${site.url}${p}</loc><lastmod>${lastmod(p)}</lastmod></url>`).join("\n")}
</urlset>
`);

  // RSS: how aggregators and AI crawlers discover new posts without re-crawling
  // the blog index. RSS dates are RFC 822.
  const rfc822 = (iso) => new Date(`${iso}T00:00:00Z`).toUTCString();
  const xml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const feedItems = byDateDesc
    .map(
      (p) => `    <item>
      <title>${xml(p.title)}</title>
      <link>${site.url}/blog/${p.slug}/</link>
      <guid isPermaLink="true">${site.url}/blog/${p.slug}/</guid>
      <pubDate>${rfc822(p.published)}</pubDate>
      <description>${xml(p.description)}</description>
    </item>`,
    )
    .join("\n");
  await write("feed.xml", `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(site.name)} Blog</title>
    <link>${site.url}/blog/</link>
    <description>${xml("Web sitesi fiyatı, arama görünürlüğü ve müşteri kazanma üzerine pratik yazılar.")}</description>
    <language>${site.lang}</language>
    <lastBuildDate>${rfc822(site.updated)}</lastBuildDate>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>
${feedItems}
  </channel>
</rss>
`);

  const profiles = [
    ["LinkedIn", site.sameAs.find((u) => u.includes("linkedin.com"))],
    ["GitHub", site.sameAs.find((u) => u.includes("github.com"))],
  ].filter(([, href]) => href);

  // GEO: a plain summary AI assistants can quote.
  await write("llms.txt", `# ${site.name}

> ${site.description}

## Sayfalar
- [Ana sayfa](${site.url}/): hizmetler, süreç, paketler, SSS ve iletişim formu
- [Çalışmalar](${site.url}/calismalar/): ai-ulu'nun kendi geliştirdiği açık kaynak yazılımlar ve başka platformlarda yayınlanmış yazılar
- [Hakkında](${site.url}/hakkimizda/): stüdyonun arkasındaki kişi, çalışma şekli ve verilmeyen garantiler
- [Örnek tasarımlar](${site.url}/sablonlar/): sektöre göre site tarzı örnekleri
- [Blog](${site.url}/blog/): web sitesi fiyatı, arama görünürlüğü ve müşteri kazanma üzerine yazılar
- [Gizlilik ve KVKK](${site.url}/gizlilik/)
- [Kullanım şartları](${site.url}/kullanim-sartlari/): hizmet kapsamı, ödeme, fikri mülkiyet ve sorumluluk

## Blog yazıları
${byDateDesc.map((p) => `- [${p.title}](${site.url}/blog/${p.slug}/): ${p.description}`).join("\n")}

## Hizmetler
- Tanıtım sitesi: markaya özel tasarım, hızlı açılış, Google ve yapay zekâ aramalarına hazır yapı
- Özel web uygulaması: panel, portal, randevu, sipariş, otomasyon
- Site + uygulama: tek tasarım dili, tek ekip
- ${site.priceFrom ? `Tanıtım siteleri ${site.priceFrom} başlar; kesin fiyat görüşmeden sonra yazılı teklifte netleşir` : "Fiyat listesi yok; ücretsiz görüşmeden sonra 24 saat içinde yazılı teklif"}

## İletişim
- E-posta: ${site.email}
- Telefon / WhatsApp: ${site.phoneDisplay}

## Künye
- Yazan ve işleten: ${site.owner}
- Hakkında: ${site.url}/hakkimizda/
${profiles.map(([label, href]) => `- ${label}: ${href}`).join("\n")}
- RSS: ${site.url}/feed.xml
- AI erişim politikası: ${site.url}/.well-known/ai.txt

## SSS
${faq.items.map((f) => `- ${f.q} ${f.a}`).join("\n")}
`);

  // Security headers. CSP stays 'self'-only unless Turnstile is switched on (a site
  // key set in config), in which case the widget's script and iframe are allowed.
  const turnstile = Boolean(site.turnstileSiteKey);
  const csp = [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    `script-src 'self' 'sha256-${createHash("sha256").update(ENTER_SCRIPT).digest("base64")}' https://static.cloudflareinsights.com${turnstile ? " https://challenges.cloudflare.com" : ""}`,
    "font-src 'self'",
    "connect-src 'self' https://cloudflareinsights.com",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    ...(turnstile ? ["frame-src https://challenges.cloudflare.com"] : []),
  ].join("; ");
  const immutable = "  Cache-Control: public, max-age=31536000, immutable";
  const week = "  Cache-Control: public, max-age=604800";
  // Root CSS/JS ship unhashed, so they get a week (not a year) plus a revalidation
  // window: a deploy is picked up quickly without a per-request round trip.
  const revalidate = "  Cache-Control: public, max-age=604800, stale-while-revalidate=86400";
  await write("_headers", `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()
  Cross-Origin-Opener-Policy: same-origin
  Content-Security-Policy: ${csp}
  Strict-Transport-Security: max-age=31536000; includeSubDomains

/fonts/*
${immutable}

/vendor/*
${immutable}

/sablonlar/assets/*
${immutable}

/site.css
${revalidate}

/blog.css
${revalidate}

/faq-drawer.css
${revalidate}

/postmark-form.css
${revalidate}

/print.css
${revalidate}

/work.css
${revalidate}

/app.js
${revalidate}

/vortex.js
${revalidate}

/ora.js
${revalidate}

/img/*
${week}

/sablonlar/stiller/*
${week}

/og.png
${week}

/favicon.svg
${week}

/favicon.ico
${week}

/apple-touch-icon.png
${week}

/icon-192.png
${week}

/icon-512.png
${week}

/feed.xml
  Content-Type: application/rss+xml; charset=utf-8
  Cache-Control: public, max-age=3600

/llms.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600

/.well-known/ai.txt
  Content-Type: text/plain; charset=utf-8
  Cache-Control: public, max-age=3600

/manifest.webmanifest
${week}
`);

  console.log(`✓ build: ${pages.length} sayfa + örnek tasarımlar + assets → dist/`);
}

build().catch((err) => {
  console.error("build failed:", err);
  process.exit(1);
});
