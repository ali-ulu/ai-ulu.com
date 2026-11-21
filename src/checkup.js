// Free site checkup: scores how well a business site reaches visitors, Google and
// AI assistants. Weights are our own judgment, modelled on public checkers
// (Layer3Labs, Arobis, AgentCheck); search crawlers count, training crawlers do not.

const TIMEOUT_MS = 8000;
const PSI_TIMEOUT_MS = 25000;
// shortcut: bodies are cut at 1 MB after download; fine for business sites, stream if abused.
const MAX_BODY_CHARS = 1_000_000;
const UA = "Mozilla/5.0 (compatible; ai-ulu-checkup/2.0; +https://ai-ulu.com/checkup/)";
const OAI_UA = "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.3; +https://openai.com/searchbot";
const SELF_HOSTS = new Set(["ai-ulu.com", "www.ai-ulu.com"]);
const LOCAL_TYPES = ["LocalBusiness", "Dentist", "MedicalClinic", "MedicalBusiness", "MedicalOrganization", "ProfessionalService",
  "Restaurant", "Store", "HealthAndBeautyBusiness", "BeautySalon", "HairSalon", "AutoRepair", "LegalService", "Attorney",
  "RealEstateAgent", "HomeAndConstructionBusiness", "FoodEstablishment", "LodgingBusiness", "Hotel", "Organization", "Corporation"];
// Crawlers that put a site into AI and web search answers, with their points.
export const SEARCH_BOTS = [["Googlebot", 6], ["OAI-SearchBot", 6], ["Claude-SearchBot", 4], ["PerplexityBot", 4]];

export const CATEGORIES = [
  ["erisim", "Erişim ve güvenlik"],
  ["yz", "Yapay zekâ erişimi"],
  ["okunur", "Okunabilirlik"],
  ["veri", "İşletme bilgisi"],
  ["donusum", "Müşteriye dönüşüm"],
];

// Only public hostnames: no IP literals, no single-label or internal names.
export function parseHost(input) {
  const raw = String(input || "").trim().toLowerCase();
  if (!raw || raw.length > 253) return null;
  let host;
  try {
    host = new URL(/^https?:\/\//.test(raw) ? raw : `https://${raw}`).hostname;
  } catch {
    return null;
  }
  if (!/^(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(host)) return null;
  if (/(^|\.)(localhost|local|internal|lan|home)$/.test(host)) return null;
  return host;
}

// The Worker cannot fetch its own hostname over the network, so our own site is
// read straight from the static assets binding.
async function get(url, env, ua = UA, redirect = "follow") {
  const t0 = Date.now();
  try {
    const own = SELF_HOSTS.has(new URL(url).hostname) && env?.ASSETS;
    const req = new Request(url, { redirect, headers: { "user-agent": ua } });
    const res = own ? await env.ASSETS.fetch(req) : await fetch(req, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    // Time to first byte is when the response headers land; reading the body is a
    // separate cost. Measuring only after `text()` made "fast first response"
    // really mean "small page", which rewards short HTML instead of a fast server.
    const ttfb = Date.now() - t0;
    const body = (await res.text()).slice(0, MAX_BODY_CHARS);
    return { ok: res.ok, status: res.status, finalUrl: own ? null : res.url, own: Boolean(own), ttfb, ms: Date.now() - t0, body, headers: res.headers };
  } catch (e) {
    const ms = Date.now() - t0;
    return { ok: false, status: 0, error: e?.name === "TimeoutError" ? "zaman aşımı" : "bağlantı hatası", ttfb: ms, ms, body: "", headers: new Headers() };
  }
}

const visibleText = (html) => html
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>/gi, " ")
  .replace(/<[^>]+>/g, " ").replace(/&\w+;/g, " ").replace(/\s+/g, " ").trim();

// Status codes that mean "a live server answered, but it refused us" rather than
// "there is no site here". Bot protection and rate limiting both look like this,
// and reporting them as a dead site is wrong: real visitors see the page fine.
const REFUSED = new Set([401, 403, 405, 406, 429, 503]);
const isRefusal = (r) => !r.ok && REFUSED.has(r.status);

// A hosting placeholder page, not a word search: "parked" alone matches Turkish
// "parkedebileceğiniz" and "parkederek", which condemned every site with a car
// park to 0/F. These are phrases a parked-domain page actually prints.
const PLACEHOLDER_RE = /defaultwebpage\.cgi|cgi-sys\/suspendedpage|this domain (is|may be) for sale|domain (is )?for sale|buy this domain|domain parking|parked (domain|free|by)|site (is )?parked|hesabınız askıya alındı|bu alan adı satılıktır/i;

// Meta tags are matched attribute-order-independently: WordPress themes and
// hand-written HTML both emit <meta content="..." name="description">, and the
// old single-order regex silently failed those pages.
function metaContent(html, name) {
  for (const tag of html.matchAll(/<meta\b[^>]*>/gi)) {
    const t = tag[0];
    const key = (t.match(/\b(?:name|property)\s*=\s*["']([^"']+)["']/i) || [])[1];
    if (!key || key.toLowerCase() !== name.toLowerCase()) continue;
    const val = (t.match(/\bcontent\s*=\s*["']([^"']*)["']/i) || [])[1];
    if (val != null) return val.trim();
  }
  return "";
}

const hasMeta = (html, name) => metaContent(html, name) !== "";

// JSON-LD is the recommended format, but microdata (itemscope/itemtype) is still
// common on hand-built and older WordPress sites. Reading only JSON-LD scored
// those pages as having no business data at all.
function schemaTypes(html) {
  const types = new Set();
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const t of m[1].matchAll(/"@type"\s*:\s*(\[[^\]]*\]|"[^"]+")/g)) {
      t[1].replace(/[[\]"]/g, "").split(",").forEach((x) => x.trim() && types.add(x.trim()));
    }
  }
  for (const m of html.matchAll(/\bitemtype\s*=\s*["']([^"']+)["']/gi)) {
    for (const raw of m[1].split(/\s+/)) {
      const t = raw.replace(/^.*schema\.org\//, "").replace(/\/$/, "").trim();
      if (t) types.add(t);
    }
  }
  return [...types];
}

// JSON-LD objects, not just the type strings. The GEO score needs fields
// (Organization name/logo/sameAs, Article dates, Service provider), so the
// checkup keeps both views: `schemaTypes` for tolerant matching and these
// objects for field-level checks.
export function jsonLdObjects(html) {
  const out = [];
  const add = (value) => {
    if (Array.isArray(value)) {
      value.forEach(add);
      return;
    }
    if (!value || typeof value !== "object") return;
    out.push(value);
    if (value["@graph"]) add(value["@graph"]);
  };
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      add(JSON.parse(m[1]));
    } catch {
      // schemaTypes() already reads malformed blocks; field checks need valid JSON.
    }
  }
  return out.filter((o) => o["@type"]);
}

function typeList(obj) {
  const raw = obj?.["@type"];
  if (!raw) return [];
  return (Array.isArray(raw) ? raw : [raw]).map((t) => String(t).replace(/^.*schema\.org\//, "").replace(/\/$/, ""));
}

function attrValue(tag, name) {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? (m[1] ?? m[2] ?? m[3] ?? "").trim() : "";
}

function linkHrefs(html) {
  return [...html.matchAll(/<a\b[^>]*href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)]
    .map((m) => (m[1] ?? m[2] ?? m[3] ?? "").replace(/&amp;/g, "&").trim())
    .filter((href) => href && !href.startsWith("#") && !/^(?:mailto|tel|javascript|data):/i.test(href));
}

function headingStats(html) {
  const levels = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => Number(m[1]));
  return {
    h1: levels.filter((l) => l === 1).length,
    h2: levels.filter((l) => l === 2).length,
    skipped: levels.some((l, i) => i > 0 && l > levels[i - 1] + 1),
  };
}

function asArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function uniqueStrings(values) {
  return [...new Set(values.filter((v) => typeof v === "string" && v))];
}

// robots.txt per RFC 9309, for the site root only: the most specific user-agent
// group wins over "*", the longest matching rule wins, Allow wins a tie.
export function robotsAllows(robots, bot) {
  const groups = [];
  let cur = null;
  for (const raw of robots.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const i = line.indexOf(":");
    if (i < 0) continue;
    const key = line.slice(0, i).trim().toLowerCase();
    const val = line.slice(i + 1).trim();
    if (key === "user-agent") {
      if (!cur || cur.rules.length) groups.push((cur = { agents: [], rules: [] }));
      cur.agents.push(val.toLowerCase());
    } else if ((key === "allow" || key === "disallow") && cur) {
      cur.rules.push({ allow: key === "allow", path: val });
    }
  }
  const name = bot.toLowerCase();
  const own = groups.filter((g) => g.agents.includes(name));
  const rules = (own.length ? own : groups.filter((g) => g.agents.includes("*"))).flatMap((g) => g.rules);
  let best = null;
  for (const r of rules) {
    if (!r.path || !/^\/\*?$|^\*$/.test(r.path)) continue; // only rules that cover "/"
    if (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.allow)) best = r;
  }
  return !best || best.allow;
}

// Lighthouse is a ~20 s round trip and a metered API. It runs only when asked
// for, and never inside the response's critical path: a visitor waiting on a
// speed number should not wait 25 s for the other checks to be written out.
async function pageSpeed(host, env) {
  if (!env?.PSI_KEY) return null;
  try {
    const q = new URLSearchParams({ url: `https://${host}/`, strategy: "mobile", category: "performance", key: env.PSI_KEY });
    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`, { signal: AbortSignal.timeout(PSI_TIMEOUT_MS) });
    if (!res.ok) return null;
    const score = (await res.json())?.lighthouseResult?.categories?.performance?.score;
    return typeof score === "number" ? Math.round(score * 100) : null;
  } catch {
    return null;
  }
}

export async function collect(host, env) {
  const [https, http, httpProbe] = await Promise.all([
    get(`https://${host}/`, env),
    get(`http://${host}/`, env),
    // The follow response hides the redirect that got us to HTTPS. A manual probe
    // keeps the 301/302 status visible, so the check works in Workers too.
    get(`http://${host}/`, env, UA, "manual"),
  ]);
  const page = https.ok ? https : http;
  const base = https.ok ? `https://${host}` : `http://${host}`;
  const [robots, llms, aiTxt, aiTxtAlt, feed, sitemap, asOai, speed] = await Promise.all([
    get(`${base}/robots.txt`, env), get(`${base}/llms.txt`, env),
    get(`${base}/.well-known/ai.txt`, env), get(`${base}/ai.txt`, env), get(`${base}/feed.xml`, env),
    get(`${base}/sitemap.xml`, env),
    get(`${base}/`, env, OAI_UA),
    // `withSpeed` is set by the caller; without it the 25 s Lighthouse call is
    // skipped entirely instead of being raced and thrown away.
    env?.withSpeed ? pageSpeed(host, env) : null,
  ]);
  return { host, https, http, httpProbe, page, robots, llms, aiTxt, aiTxtAlt, feed, sitemap, asOai, speed };
}

const errText = (x) => x.error || ([525, 526].includes(x.status) ? "sertifika hatası" : `HTTP ${x.status}`);

function check(cat, label, max, ok, detail, fix, partial = 0) {
  const status = ok === null ? "unknown" : ok ? "pass" : partial ? "warn" : "fail";
  const points = ok === null ? 0 : ok ? max : partial;
  // `weight` keeps the rubric value even when the check could not run. Without it
  // `max` collapsed to 0 and the score divided by a shrunken total, so a site
  // measured on half the rubric still looked like a 100.
  return { cat, label, max: ok === null ? 0 : max, weight: max, points, status, detail, fix };
}

export function evaluate(d) {
  const { page, https, http, robots, llms, sitemap, asOai } = d;
  const html = page.body;
  const placeholder = PLACEHOLDER_RE.test(html);
  if (!page.ok || placeholder) {
    const refused = isRefusal(https) || isRefusal(http);
    // A refusal is not a verdict. Bot protection blocks our agent while letting
    // real visitors through, so the honest answer is "could not measure", never
    // "your site is dead" — that would be a false accusation against a working site.
    if (!placeholder && refused) {
      const code = [https, http].find(isRefusal)?.status;
      return { reachable: null, score: null, grade: null, categories: [], speed: null,
        checks: [check("erisim", "Site ölçülemedi", 0, null,
          `Sunucu isteğimizi ${code} ile reddetti. Bu genelde bot koruması (Cloudflare, WAF) ya da hız sınırıdır; site tarayıcıda açılıyor olabilir. Otomatik test yapamadım.`,
          "Bu bir hata değil, ölçüm engeli. Güvenlik duvarınızın arama botlarına izin verdiğini kontrol edin ya da tam raporu elle isteyin.")] };
    }
    const detail = placeholder
      ? `Adres açılıyor ama site yok: hostingin boş varsayılan sayfası geliyor${https.ok ? "" : `, https de çalışmıyor (${errText(https)})`}.`
      : `Site açılmıyor (https: ${errText(https)}, http: ${errText(http)}).`;
    return { reachable: false, score: 0, grade: "F", categories: [], speed: null,
      checks: [check("erisim", "Site açılıyor", 100, false, `${detail} Google'dan gelen ziyaretçi işletmeniz yerine hata ya da boş sayfa görüyor.`, "Hosting ve alan adı ayarlarını kontrol edin; site yeniden yayına alınmalı.")] };
  }
  const pick = (re) => (html.match(re) || [])[1]?.trim() || "";
  const text = visibleText(html).length;
  const readable = text >= 300;
  const types = schemaTypes(html);
  const robotsTxt = robots.ok && !/<html/i.test(robots.body.slice(0, 300)) ? robots.body : "";
  const noindex = /noindex/i.test(metaContent(html, "robots")) || /noindex/i.test(page.headers.get("x-robots-tag") || "");
  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  const oaiBlocked = page.ok && [401, 402, 403, 429, 503].includes(asOai.status);
  // Most visitors to a small business site are on a phone. Without a viewport tag
  // the page renders at desktop width and they have to pinch-zoom to read it.
  // The viewport tag lives in <head>, so it is in the raw HTML even when the body
  // is rendered by JavaScript. It is measurable either way; absence is a real fail.
  const mobileOk = /width\s*=\s*device-width/i.test(metaContent(html, "viewport"));
  // Images without alt text are invisible to Google Images, to screen readers and
  // to the text extraction AI assistants do. Only judged when the page is readable.
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\balt\s*=/i.test(t)).length;
  // A handful of missing alt attributes is a warning, not a fail: pass a boolean
  // here and the partial points through check()'s `partial` argument. Returning 1
  // from this expression made `1` truthy and the check passed outright.
  const altMissingRatio = imgs.length ? noAlt / imgs.length : 0;
  const altOk = !readable ? null : noAlt === 0;
  const altPartial = readable && noAlt > 0 && altMissingRatio < 0.2 ? 1 : 0;
  const h1Text = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1];
  const h1Empty = h1 === 1 && h1Text != null && visibleText(h1Text).length < 3;
  // Contact links live in raw HTML only when the page is server-rendered.
  const contact = (re) => (readable ? re.test(html) : null);

  const checks = [
    check("erisim", "Güvenli bağlantı (https)", 7, https.ok, https.ok ? "https çalışıyor." : `https çalışmıyor (${errText(https)}); tarayıcı "güvenli değil" uyarısı gösterir.`, "Hosting panelinden SSL sertifikasını (ücretsiz Let's Encrypt) etkinleştirin."),
    check("erisim", "http adresi https'e yönleniyor", 4, http.own ? null : !http.ok || Boolean(http.finalUrl?.startsWith("https://")), http.own ? "Kendi sitemizin yönlendirmesi bu araçla ölçülemiyor." : "Eski http bağlantıları güvenli adrese gitmeli.", "Sunucuda http → https kalıcı (301) yönlendirmesi açın."),
    check("erisim", "Hızlı ilk yanıt", 4, page.own || !Number.isFinite(page.ttfb) ? null : page.ttfb < 1500,
      page.own ? "Kendi sitemizin yanıt süresi bu araçla ölçülemiyor."
        : !Number.isFinite(page.ttfb) ? "Yanıt süresi ölçülemedi."
        : `Sunucu ilk baytı ${(page.ttfb / 1000).toFixed(1)} saniyede gönderdi.`,
      "Önbellek (cache) ve daha hızlı bir sunucu/CDN kullanın.", page.ttfb < 3000 ? 2 : 0),
    check("erisim", "Arama motorlarına açık (noindex yok)", 3, !noindex, noindex ? "Sayfa noindex ile arama sonuçlarından gizlenmiş." : "Sayfa dizine eklenebilir.", "Sayfadaki noindex etiketini kaldırın."),
    check("erisim", "Telefonda düzgün açılıyor (viewport)", 2, mobileOk,
      mobileOk === null ? "Sayfada viewport etiketi yok; telefon tarayıcısı sayfayı masaüstü genişliğinde çizip küçültür, yazı okunmaz hale gelir."
        : mobileOk ? "viewport etiketi width=device-width olarak ayarlı." : "viewport etiketi var ama genişliği cihaza uyarlamıyor.",
      'Sayfa başına <meta name="viewport" content="width=device-width, initial-scale=1"> ekleyin.'),
    ...SEARCH_BOTS.map(([bot, pts]) => {
      const ok = robotsAllows(robotsTxt, bot);
      return check("yz", `${bot} siteye girebiliyor`, pts, ok, ok ? "robots.txt izin veriyor." : "robots.txt bu tarayıcıyı engelliyor; bu kanaldaki aramalarda görünmezsiniz.", `robots.txt'e "User-agent: ${bot}" ve "Allow: /" ekleyin.`);
    }),
    check("yz", "Güvenlik duvarı yapay zekâyı engellemiyor", 5, !oaiBlocked, oaiBlocked ? `Site tarayıcıya açılıyor ama ChatGPT'nin arama tarayıcısına ${asOai.status} hatası veriyor.` : "ChatGPT'nin arama tarayıcısı sayfayı alabiliyor.", "Cloudflare/hosting güvenlik ayarlarında OAI-SearchBot'a izin verin."),
    check("okunur", "İçerik JavaScript olmadan okunuyor", 10, readable, readable ? `Sayfada ${text} karakter okunabilir yazı var.` : `Sunucunun verdiği sayfada yalnız ${text} karakter yazı var; içerik sonradan JavaScript ile çiziliyor. Google ve yapay zekâ sayfayı neredeyse boş görür.`, "Sayfayı sunucuda oluşturun (SSR/statik HTML) ya da ana metni HTML'e koyun.", text >= 100 ? 5 : 0),
    check("okunur", "Sayfa başlığı", 3, Boolean(pick(/<title[^>]*>([\s\S]*?)<\/title>/i)), "Google sonucunda görünen başlık.", "Her sayfaya işletme adı + hizmet + şehir içeren bir başlık (title) yazın."),
    check("okunur", "Arama açıklaması", 3, hasMeta(html, "description"), "Google sonucunda başlığın altındaki metin.", "150-160 karakterlik bir meta description ekleyin."),
    check("okunur", "Tek ana başlık (H1)", 2, h1 === 1 && !h1Empty, h1Empty ? "H1 var ama içi boş; başlık metni yok." : `Sayfada ${h1} adet H1 var.`, "Sayfada tek bir H1 olsun; konuyu açıkça söylesin."),
    check("okunur", "Görsellerde alt metin", 2, altOk,
      altOk === null ? "İçerik JavaScript ile çizildiği için görseller okunamadı."
        : imgs.length === 0 ? "Sayfada görsel yok, kontrol atlandı."
        : `Sayfadaki ${imgs.length} görselin ${noAlt} tanesinde alt metin yok.`,
      "Her görsele ne gösterdiğini anlatan kısa bir alt metin yazın (süs görseller için alt=\"\").", altPartial),
    check("veri", "İşletme bilgisi (schema)", 10, types.some((t) => LOCAL_TYPES.includes(t)), types.length ? `Bulunan türler: ${types.join(", ")}.` : "Sayfada yapılandırılmış veri (JSON-LD) yok.", "Adres, telefon, çalışma saatleri ve konumu içeren LocalBusiness JSON-LD ekleyin.", types.length ? 4 : 0),
    check("veri", "llms.txt", 3, llms.ok && !/<html|<!doctype/i.test(llms.body.slice(0, 300)), "Yapay zekâ asistanlarına işletmeyi özetleyen dosya.", "Sitenin köküne işletmeyi ve ana sayfaları anlatan bir llms.txt koyun."),
    check("veri", "Site haritası (sitemap)", 3, (sitemap.ok && /<urlset|<sitemapindex/i.test(sitemap.body)) || /^sitemap:/im.test(robotsTxt), "Google'a sayfaların listesini veren dosya.", "sitemap.xml oluşturup robots.txt'e ekleyin."),
    check("veri", "Paylaşım önizlemesi (Open Graph)", 2, hasMeta(html, "og:title") || hasMeta(html, "og:image"), "WhatsApp ve sosyal medyada link paylaşılınca çıkan kart.", "og:title, og:description ve og:image etiketlerini ekleyin."),
    check("veri", "Asıl adres (canonical)", 2, /<link[^>]+rel=["']canonical/i.test(html), "Aynı sayfanın birden çok adresi varsa Google'a doğrusunu söyler.", "Sayfaya canonical bağlantısı ekleyin."),
    check("donusum", "Dokununca arayan telefon", 5, contact(/href=["']tel:/i), readable ? "Telefondan tek dokunuşla arama." : "İçerik JavaScript ile çizildiği için ölçülemedi.", "Telefon numarasını tel: bağlantısı yapın."),
    check("donusum", "WhatsApp bağlantısı", 5, contact(/wa\.me|api\.whatsapp\.com/i), readable ? "Ziyaretçinin tek dokunuşla yazabilmesi." : "İçerik JavaScript ile çizildiği için ölçülemedi.", "wa.me bağlantılı bir WhatsApp düğmesi ekleyin."),
    check("donusum", "Randevu / iletişim formu", 5, contact(/<form/i), readable ? "Arayamayan ziyaretçi için ikinci kanal." : "İçerik JavaScript ile çizildiği için ölçülemedi.", "Kısa bir randevu ya da iletişim formu ekleyin."),
  ];

  // The score is a share of the whole rubric, not of whatever happened to run.
  // A check that could not be executed earns nothing but still counts against the
  // total, so "100" means all 100 points were actually verified. `covered` reports
  // how much of the rubric that was, so the visitor can see what was skipped.
  const nominal = checks.reduce((s, c) => s + c.weight, 0);
  const got = checks.reduce((s, c) => s + c.points, 0);
  const skippedWeight = checks.reduce((s, c) => s + (c.status === "unknown" ? c.weight : 0), 0);
  const covered = nominal ? (nominal - skippedWeight) / nominal : 0;
  const basis = { points: got, nominal, covered: Math.round(covered * 100), skipped: checks.filter((c) => c.status === "unknown").length };
  let score = nominal ? Math.round((got / nominal) * 100) : null;
  if (noindex && score != null) score = Math.min(score, 20);
  const categories = CATEGORIES.map(([id, label]) => {
    const cs = checks.filter((c) => c.cat === id);
    return { id, label, points: cs.reduce((s, c) => s + c.points, 0), max: cs.reduce((s, c) => s + c.weight, 0) };
  });
  return { reachable: true, score, grade: score == null ? null : grade(score), basis, categories, checks, speed: d.speed };
}

export const grade = (s) => (s >= 90 ? "A" : s >= 80 ? "B" : s >= 70 ? "C" : s >= 60 ? "D" : s >= 50 ? "E" : "F");

// GEO score: a second, more technical reading of the same page. It mirrors the
// public GeoReady categories (structured data, content, technical, AI access,
// brand) instead of the SMB-oriented checkup categories above. The free checkup
// reads one page; the multi-page crawl lives in scripts/geo-audit.mjs.
export const GEO_CATEGORIES = [
  ["schema", "Yapılandırılmış veri"],
  ["content", "İçerik kalitesi"],
  ["technical", "Teknik SEO"],
  ["ai", "Yapay zekâ erişimi"],
  ["brand", "Marka ve varlık"],
];

const GEO_BOTS = [
  ["GPTBot", 2], ["OAI-SearchBot", 2], ["ClaudeBot", 1], ["Claude-SearchBot", 1],
  ["PerplexityBot", 2], ["Google-Extended", 2], ["Bingbot", 1], ["CCBot", 1],
];

const GEO_SEVERITY = { critical: 0, high: 1, medium: 2, low: 3 };

function geoCheck(cat, id, label, max, status, points, detail, fix, severity = "medium") {
  const safe = status === "pass" ? max : status === "fail" || status === "unknown" ? 0 : Math.max(0, Math.min(max, points));
  return { cat, id, label, max, weight: max, points: safe, status, detail, fix, severity };
}

const gPass = (cat, id, label, max, detail, fix, severity) => geoCheck(cat, id, label, max, "pass", max, detail, fix, severity);
const gFail = (cat, id, label, max, detail, fix, severity) => geoCheck(cat, id, label, max, "fail", 0, detail, fix, severity);
const gWarn = (cat, id, label, max, points, detail, fix, severity) => geoCheck(cat, id, label, max, "warn", points, detail, fix, severity);
const gUnknown = (cat, id, label, max, detail, fix, severity) => geoCheck(cat, id, label, max, "unknown", 0, detail, fix, severity);

function geoBrand(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9çğıöşü]+/gi, " ").trim();
}

export function evaluateGeo(d) {
  const { page, https, http, httpProbe, robots, llms, aiTxt, aiTxtAlt, feed, sitemap } = d;
  const html = page.body || "";
  const host = d.host;
  const base = https.ok ? https.finalUrl || `https://${host}/` : http.finalUrl || `http://${host}/`;
  const meta = {
    description: metaContent(html, "description"),
    robots: metaContent(html, "robots"),
    viewport: metaContent(html, "viewport"),
  };
  const title = visibleText((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
  const text = visibleText(html);
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const headings = headingStats(html);
  const types = schemaTypes(html);
  const objects = jsonLdObjects(html);
  const org = objects.find((o) => typeList(o).some((t) => LOCAL_TYPES.includes(t))) || null;
  const person = objects.find((o) => typeList(o).includes("Person")) || null;
  const article = objects.find((o) => typeList(o).some((t) => ["Article", "BlogPosting", "NewsArticle", "TechArticle"].includes(t))) || null;
  const sameAs = uniqueStrings([...asArray(org?.sameAs), ...asArray(person?.sameAs)]);
  const profiles = sameAs.filter((u) => /(?:linkedin\.com|github\.com|x\.com|twitter\.com|instagram\.com|facebook\.com|youtube\.com|crunchbase\.com|wikipedia\.org|wikidata\.org)/i.test(u));
  const hasLinkedIn = sameAs.some((u) => /linkedin\.com/i.test(u));
  const hasKg = sameAs.some((u) => /(?:wikipedia|wikidata|crunchbase)\./i.test(u));
  const robotsTxt = robots?.ok && !/<html/i.test((robots.body || "").slice(0, 300)) ? robots.body : "";
  const robotsMissing = robots?.status === 404 || robots?.status === 410;
  const robotsUnreadable = !robots?.ok && !robotsMissing;
  const sitemapCount = ((sitemap?.body || "").match(/<loc>/gi) || []).length;
  const sitemapIndex = /<sitemapindex\b/i.test(sitemap?.body || "");
  const sitemapOk = Boolean(sitemap?.ok) && /<urlset|<sitemapindex/i.test(sitemap?.body || "") && sitemapCount > 0;
  const llmsOk = Boolean(llms?.ok) && (llms.body || "").length > 100 && /^#\s+/m.test(llms.body || "") && !/<html|<!doctype/i.test((llms.body || "").slice(0, 300));
  const aiTxtOk = Boolean((aiTxt?.ok && (aiTxt.body || "").length > 20) || (aiTxtAlt?.ok && (aiTxtAlt.body || "").length > 20));
  const feedOk = Boolean(feed?.ok && /<rss\b|<feed\b|<rdf:RDF\b/i.test(feed.body || ""));
  const canonicalTag = [...html.matchAll(/<link\b[^>]*>/gi)].find((m) => attrValue(m[0], "rel").toLowerCase().split(/\s+/).includes("canonical"));
  const canonicalRaw = canonicalTag ? attrValue(canonicalTag[0], "href") : "";
  let canonical = "";
  try { canonical = canonicalRaw ? new URL(canonicalRaw, base).href : ""; } catch { canonical = ""; }
  const canonicalSelf = Boolean(canonical) && canonical.replace(/\/$/, "") === String(page.finalUrl || base).replace(/\/$/, "");
  const noindex = /noindex/i.test(meta.robots) || /noindex/i.test(page.headers?.get("x-robots-tag") || "");
  const hasAuthor = Boolean(article?.author || person?.name) || /(?:Yazan|Yazar|Author|By)\s*[:：]/i.test(text) || /\brel\s*=\s*["']author["']/i.test(html) || /\bitemprop\s*=\s*["']author["']/i.test(html);
  const hasDate = Boolean(article?.datePublished || article?.dateModified) || /<time\b[^>]*datetime\s*=/i.test(html) ||
    /\b\d{1,2}\s+(?:Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s+\d{4}\b/i.test(text) ||
    /\b20\d{2}-\d{2}-\d{2}\b/.test(text);
  const hasUpdated = Boolean(article?.dateModified) || /(?:Güncellendi|Güncelleme|Son güncelleme|Updated)/i.test(text);
  const hasFaq = types.includes("FAQPage") || /(?:Sıkça sorulan|Sıkça Sorulan|SSS|FAQ|Soru\s*[:-])/i.test(text);
  const hasPrices = /(?:₺|TL|TRY|€|\$)\s?\d|\d\s?(?:₺|TL|TRY|€|\$)/i.test(text);
  const hasNumbers = hasPrices || (text.match(/\b\d{2,}\b/g) || []).length >= 3;
  const hrefs = linkHrefs(html);
  let internal = 0;
  let aboutLinked = false;
  let contactLinked = false;
  for (const href of hrefs) {
    try {
      const u = new URL(href, base);
      if (u.host !== new URL(base).host) continue;
      internal++;
      if (/\/(?:about|hakkimizda|hakkinda|kurumsal)(?:\/|$)/i.test(u.pathname)) aboutLinked = true;
      if (/\/(?:contact|iletisim|bize-ulasin)(?:\/|$)/i.test(u.pathname)) contactLinked = true;
    } catch { /* ignore */ }
  }
  const hasTel = /href\s*=\s*["']tel:/i.test(html);
  const hasWhatsApp = /wa\.me|api\.whatsapp\.com/i.test(html);
  const hasForm = /<form\b/i.test(html);
  const brandName = geoBrand(org?.name);
  const brandConsistent = Boolean(brandName) && geoBrand(title).includes(brandName);
  const ogOk = hasMeta(html, "og:title") && hasMeta(html, "og:image");
  const ogPartial = hasMeta(html, "og:title") || hasMeta(html, "og:image");
  const service = types.some((t) => ["Service", "Product", "Offer", "OfferCatalog", "ItemList"].includes(t));

  const checks = [];
  // ---- Yapılandırılmış veri (25) ----
  checks.push(org
    ? gPass("schema", "organization", "Organization şeması", 6, "Organization JSON-LD bulundu.", "Şemayı site şablonunda tutun.")
    : gFail("schema", "organization", "Organization şeması", 6, "Organization JSON-LD yok.", "Ad, URL, logo, iletişim ve sosyal profilleri içeren Organization şeması ekleyin.", "critical"));
  const orgCore = Boolean(org?.name && org?.url && (org?.logo || org?.image));
  checks.push(orgCore
    ? gPass("schema", "organization-core", "Organization kimlik alanları", 4, "name, url ve logo alanları var.", "Alanları güncel tutun.")
    : gFail("schema", "organization-core", "Organization kimlik alanları", 4, org ? `Eksik alanlar: ${[!org.name && "name", !org.url && "url", !(org.logo || org.image) && "logo"].filter(Boolean).join(", ")}.` : "Organization bulunamadı.", "Organization içine name, url ve logo ekleyin.", "high"));
  checks.push(sameAs.length >= 2
    ? gPass("schema", "sameas", "sameAs profilleri", 3, `${sameAs.length} profil bağlı.`, "Profilleri güncel tutun.")
    : sameAs.length === 1
      ? gWarn("schema", "sameas", "sameAs profilleri", 3, 1, "Yalnızca 1 profil bağlı.", "En az 2 sahip olunan profil ekleyin.", "high")
      : gFail("schema", "sameas", "sameAs profilleri", 3, "sameAs bağlantısı yok.", "Organization veya Person şemasına sameAs ekleyin.", "high"));
  const orgContact = Boolean(org?.contactPoint || org?.telephone || org?.email);
  checks.push(orgContact
    ? gPass("schema", "organization-contact", "Organization iletişim bilgisi", 2, "contactPoint, telephone veya email var.", "Bilgileri güncel tutun.")
    : gFail("schema", "organization-contact", "Organization iletişim bilgisi", 2, "Organization içinde iletişim alanı yok.", "contactPoint veya telephone/email ekleyin.", "high"));
  checks.push(types.includes("WebSite")
    ? gPass("schema", "website", "WebSite şeması", 2, "WebSite JSON-LD var.", "WebSite şemasını koruyun.")
    : gFail("schema", "website", "WebSite şeması", 2, "WebSite JSON-LD yok.", "Site adı ve URL'siyle WebSite şeması ekleyin.", "medium"));
  checks.push(types.some((t) => ["WebPage", "AboutPage", "ContactPage", "CollectionPage", "ItemPage"].includes(t))
    ? gPass("schema", "webpage", "WebPage şeması", 2, "WebPage JSON-LD var.", "WebPage şemasını koruyun.")
    : gFail("schema", "webpage", "WebPage şeması", 2, "WebPage JSON-LD yok.", "Her sayfaya WebPage şeması ekleyin.", "medium"));
  checks.push(types.some((t) => ["Article", "BlogPosting", "NewsArticle", "TechArticle"].includes(t))
    ? gPass("schema", "article", "Article / BlogPosting şeması", 2, "Article veya BlogPosting şeması var.", "Yazar ve tarih alanlarını koruyun.")
    : gPass("schema", "article", "Article / BlogPosting şeması", 2, "Ana sayfa için uygulanmıyor; blog yazıları ayrı denetlenir.", "Blog yazılarına Article/BlogPosting şeması ekleyin."));
  checks.push(types.includes("FAQPage")
    ? gPass("schema", "faq", "FAQPage şeması", 2, "FAQPage JSON-LD var.", "Soruları görünür metinle birlikte tutun.")
    : gFail("schema", "faq", "FAQPage şeması", 2, "FAQPage şeması yok.", "SSS bölümüne FAQPage JSON-LD ekleyin; yoksa 3-5 soruluk bir SSS açın.", "medium"));
  checks.push(types.includes("BreadcrumbList")
    ? gPass("schema", "breadcrumb", "BreadcrumbList şeması", 1, "BreadcrumbList var.", "İç sayfalarda breadcrumb'ı koruyun.")
    : gPass("schema", "breadcrumb", "BreadcrumbList şeması", 1, "Ana sayfa için uygulanmıyor; iç sayfalarda denetlenir.", "İç sayfalara BreadcrumbList ekleyin."));
  checks.push(service
    ? gPass("schema", "offer", "Hizmet / ürün şeması", 1, "Service, Product, Offer veya ItemList var.", "Fiyat ve kapsam alanlarını ekleyin.")
    : gFail("schema", "offer", "Hizmet / ürün şeması", 1, "Hizmet veya ürün şeması yok.", "Hizmetleriniz için Service, ürünler için Product/Offer JSON-LD ekleyin.", "medium"));

  // ---- İçerik kalitesi (25) ----
  checks.push(words >= 300
    ? gPass("content", "words", "Yeterli metin", 5, `Ana sayfada ${words} kelime var.`, "İçerik derinliğini koruyun.")
    : words >= 150
      ? gWarn("content", "words", "Yeterli metin", 5, 2, `Ana sayfada ${words} kelime var; 300+ hedefleyin.`, "Ana sayfaya 300-600 kelime özgün açıklama ekleyin.", "high")
      : gFail("content", "words", "Yeterli metin", 5, `Ana sayfada ${words} kelime var; içerik çok ince.`, "Ana sayfaya 300-600 kelime özgün açıklama ekleyin.", "high"));
  checks.push(headings.h1 === 1
    ? gPass("content", "h1", "Tek H1", 4, "Ana sayfada tek H1 var.", "Başlık yapısını koruyun.")
    : gFail("content", "h1", "Tek H1", 4, `Ana sayfada ${headings.h1} adet H1 var.`, "Ana sayfada yalnızca bir H1 kullanın.", "high"));
  checks.push(!headings.skipped && (headings.h2 >= 1 || words < 300)
    ? gPass("content", "hierarchy", "Başlık hiyerarşisi", 3, "H2/H3 sırası tutarlı.", "Başlık yapısını koruyun.")
    : gWarn("content", "hierarchy", "Başlık hiyerarşisi", 3, 1, "Başlık seviyeleri atlanıyor veya H2 yok.", "H1 → H2 → H3 sırasını atlamayın.", "medium"));
  checks.push(title.length >= 10 && title.length <= 65
    ? gPass("content", "title", "Sayfa başlığı", 2, `Başlık ${title.length} karakter.`, "Başlığı koruyun.")
    : gFail("content", "title", "Sayfa başlığı", 2, title ? `Başlık ${title.length} karakter; 10-65 hedefleyin.` : "Sayfa başlığı yok.", "10-65 karakterlik benzersiz bir title yazın.", "high"));
  checks.push(meta.description.length >= 70 && meta.description.length <= 160
    ? gPass("content", "description", "Meta açıklama", 2, `Açıklama ${meta.description.length} karakter.`, "Açıklamayı koruyun.")
    : gFail("content", "description", "Meta açıklama", 2, meta.description ? `Açıklama ${meta.description.length} karakter; 70-160 hedefleyin.` : "Meta açıklama yok.", "70-160 karakterlik bir meta description yazın.", "high"));
  checks.push(hasAuthor
    ? gPass("content", "author", "Görünür yazar", 2, "Sayfada yazar veya rel=author bağlantısı var.", "Yazar bilgisini koruyun.")
    : gWarn("content", "author", "Görünür yazar", 2, 1, "Sayfada görünür yazar yok.", "Altbilgiye yazar adı ve /hakkimizda/ bağlantısı ekleyin.", "high"));
  checks.push(hasDate || hasUpdated
    ? gPass("content", "date", "Görünür tarih", 2, "Yayın veya güncelleme tarihi görünüyor.", "Tarihleri koruyun.")
    : gWarn("content", "date", "Görünür tarih", 2, 1, "Sayfada görünür tarih yok.", "Yayın/güncelleme tarihini <time> ile gösterin.", "medium"));
  checks.push(hasFaq
    ? gPass("content", "faq-content", "SSS / soru-cevap", 2, "SSS veya soru-cevap bölümü var.", "Soruları güncel tutun.")
    : gFail("content", "faq-content", "SSS / soru-cevap", 2, "SSS veya soru-cevap bölümü yok.", "3-5 soruluk bir SSS ekleyin.", "medium"));
  checks.push(hasNumbers
    ? gPass("content", "evidence", "Somut veri / fiyat", 2, "Sayfada sayı, fiyat veya ölçülebilir örnek var.", "Rakamları kaynaklandırın.")
    : gFail("content", "evidence", "Somut veri / fiyat", 2, "Sayfada somut sayı, fiyat veya örnek yok.", "Fiyat aralığı, süre veya ölçülebilir sonuç ekleyin.", "medium"));
  checks.push(internal >= 3
    ? gPass("content", "links", "İç bağlantılar", 1, `${internal} iç bağlantı var.`, "Bağlantıları koruyun.")
    : gFail("content", "links", "İç bağlantılar", 1, `Yalnızca ${internal} iç bağlantı var.`, "Ana sayfaya ilgili hizmet ve içerik bağlantıları ekleyin.", "low"));

  // ---- Teknik SEO (20) ----
  checks.push(https.ok
    ? gPass("technical", "https", "HTTPS", 3, "Site HTTPS üzerinden açılıyor.", "Sertifikayı yenilemeyi unutmayın.")
    : gFail("technical", "https", "HTTPS", 3, "Site HTTPS üzerinden açılmıyor.", "Geçerli bir TLS sertifikası kurun.", "critical"));
  const probe = httpProbe || http;
  const httpFinal = String(probe.finalUrl || "");
  checks.push(probe.own
    ? gUnknown("technical", "http-redirect", "HTTP → HTTPS", 2, "Kendi sitemizin yönlendirmesi bu araçla ölçülemiyor.", "Sunucuda kalıcı (301) HTTP → HTTPS yönlendirmesi açın.", "medium")
    : !probe.ok || httpFinal.startsWith("https://") || [301, 302, 307, 308].includes(probe.status)
      ? gPass("technical", "http-redirect", "HTTP → HTTPS", 2, httpFinal.startsWith("https://") ? "HTTP, HTTPS'e yönleniyor." : "HTTP kapalı veya HTTPS'e yönleniyor.", "Kalıcı 301 yönlendirmesi kullanın.")
      : gFail("technical", "http-redirect", "HTTP → HTTPS", 2, "HTTP adresi HTTPS'e yönlenmiyor.", "Sunucuda kalıcı (301) HTTP → HTTPS yönlendirmesi açın.", "high"));
  checks.push(!noindex
    ? gPass("technical", "indexable", "Dizine açık", 3, "Sayfada noindex yok.", "noindex'i yalnızca özel sayfalarda kullanın.")
    : gFail("technical", "indexable", "Dizine açık", 3, "Sayfa noindex ile dizinden gizlenmiş.", "Herkese açık sayfadan noindex'i kaldırın.", "critical"));
  checks.push(canonicalSelf
    ? gPass("technical", "canonical", "Canonical", 2, "Sayfa kendine canonical veriyor.", "Canonical'ı koruyun.")
    : gFail("technical", "canonical", "Canonical", 2, canonical ? "Canonical sayfanın kendi adresini göstermiyor." : "Canonical etiketi yok.", "Sayfaya kendi URL'sini gösteren canonical ekleyin.", "high"));
  checks.push(/width\s*=\s*device-width/i.test(meta.viewport)
    ? gPass("technical", "viewport", "Mobil viewport", 2, "width=device-width ayarlı.", "Viewport'u koruyun.")
    : gFail("technical", "viewport", "Mobil viewport", 2, "Viewport etiketi eksik veya hatalı.", 'Her sayfaya <meta name="viewport" content="width=device-width, initial-scale=1"> ekleyin.', "high"));
  checks.push(sitemapOk
    ? gPass("technical", "sitemap", "Site haritası", 3, `sitemap.xml bulundu (${sitemapCount} ${sitemapIndex ? "alt sitemap" : "URL"}).`, "Yeni sayfaları sitemap'e ekleyin.")
    : gFail("technical", "sitemap", "Site haritası", 3, "Geçerli sitemap.xml bulunamadı.", "sitemap.xml oluşturup robots.txt'e ekleyin.", "critical"));
  checks.push(robotsTxt.match(/^\s*sitemap\s*:/im)
    ? gPass("technical", "sitemap-robots", "robots.txt → sitemap", 1, "robots.txt sitemap'i gösteriyor.", "Yolu koruyun.")
    : gFail("technical", "sitemap-robots", "robots.txt → sitemap", 1, "robots.txt'te Sitemap satırı yok.", "robots.txt'e Sitemap: https://.../sitemap.xml ekleyin.", "medium"));
  checks.push(ogOk
    ? gPass("technical", "og", "Paylaşım kartı", 2, "og:title ve og:image var.", "Kartı koruyun.")
    : ogPartial
      ? gWarn("technical", "og", "Paylaşım kartı", 2, 1, "og:title veya og:image eksik.", "og:title, og:description ve og:image ekleyin.", "medium")
      : gFail("technical", "og", "Paylaşım kartı", 2, "Open Graph etiketleri yok.", "og:title, og:description ve og:image ekleyin.", "medium"));
  checks.push(!Number.isFinite(page.ttfb)
    ? gUnknown("technical", "speed", "İlk yanıt süresi", 2, "İlk bayt süresi ölçülemedi.", "Sunucunun yanıt süresini kontrol edin.", "medium")
    : page.ttfb < 1500
      ? gPass("technical", "speed", "İlk yanıt süresi", 2, `İlk bayt ${(page.ttfb / 1000).toFixed(2)} sn.`, "CDN ve önbellek kullanın.")
      : page.ttfb < 3000
        ? gWarn("technical", "speed", "İlk yanıt süresi", 2, 1, `İlk bayt ${(page.ttfb / 1000).toFixed(2)} sn; 1.5 sn altı hedefleyin.`, "CDN ve önbellek kullanın.", "medium")
        : gFail("technical", "speed", "İlk yanıt süresi", 2, `İlk bayt ${(page.ttfb / 1000).toFixed(2)} sn; çok yavaş.`, "CDN, önbellek ve daha hızlı bir sunucu kullanın.", "medium"));

  // ---- Yapay zekâ erişimi (20) ----
  for (const [bot, points] of GEO_BOTS) {
    if (robotsUnreadable) {
      checks.push(gUnknown("ai", `bot-${bot}`, `${bot} erişimi`, points, "robots.txt okunamadı.", "robots.txt'nin erişilebilir olduğunu kontrol edin.", "medium"));
      continue;
    }
    const allowed = robotsAllows(robotsTxt, bot);
    checks.push(allowed
      ? gPass("ai", `bot-${bot}`, `${bot} erişimi`, points, robotsMissing ? "robots.txt yok; varsayılan olarak izinli." : "robots.txt izin veriyor.", "Engeli kaldırmayın.")
      : gFail("ai", `bot-${bot}`, `${bot} erişimi`, points, `robots.txt ${bot} tarayıcısını engelliyor.`, `robots.txt'te ${bot} için "Allow: /" tanımlayın.`, ["GPTBot", "OAI-SearchBot", "ClaudeBot", "Claude-SearchBot", "PerplexityBot"].includes(bot) ? "critical" : "medium"));
  }
  checks.push(llmsOk
    ? gPass("ai", "llms", "llms.txt", 3, `llms.txt bulundu (${(llms.body || "").length} karakter).`, "Yeni sayfaları llms.txt'ye ekleyin.")
    : gFail("ai", "llms", "llms.txt", 3, llms?.ok ? "llms.txt var ama başlık/bağlantı yapısı zayıf." : "llms.txt bulunamadı.", "Kök dizine H1, kısa özet ve ana sayfa bağlantıları içeren llms.txt ekleyin.", "high"));
  checks.push(aiTxtOk
    ? gPass("ai", "ai-txt", "ai.txt", 2, "ai.txt bulundu.", "Politikayı güncel tutun.")
    : gFail("ai", "ai-txt", "ai.txt", 2, "ai.txt bulunamadı.", "/.well-known/ai.txt ekleyip tarayıcı izinlerini yazın.", "medium"));
  checks.push(feedOk
    ? gPass("ai", "feed", "RSS / Atom akışı", 1, "feed.xml bulundu.", "Yeni yazıları akışa ekleyin.")
    : gFail("ai", "feed", "RSS / Atom akışı", 1, "RSS/Atom akışı bulunamadı.", "Blog için /feed.xml üretin.", "low"));
  checks.push(words >= 300
    ? gPass("ai", "ssr", "JavaScript'siz okunabilir içerik", 2, `${words} kelime sunucudan geliyor.`, "İçeriği HTML'de tutun.")
    : words >= 100
      ? gWarn("ai", "ssr", "JavaScript'siz okunabilir içerik", 2, 1, `${words} kelime var; içerik JavaScript'e bağımlı olabilir.`, "Ana metni SSR/statik HTML ile sunun.", "high")
      : gFail("ai", "ssr", "JavaScript'siz okunabilir içerik", 2, `Yalnızca ${words} kelime var.`, "Ana metni SSR/statik HTML ile sunun.", "critical"));

  // ---- Marka ve varlık (10) ----
  checks.push(hasLinkedIn
    ? gPass("brand", "linkedin", "LinkedIn profili", 2, "sameAs içinde LinkedIn var.", "Profili güncel tutun.")
    : gFail("brand", "linkedin", "LinkedIn profili", 2, "sameAs içinde LinkedIn yok.", "Organization veya Person şemasına LinkedIn profilini ekleyin.", "medium"));
  checks.push(profiles.length >= 2
    ? gPass("brand", "profiles", "Sahip olunan profiller", 2, `${profiles.length} profil bağlı.`, "Profilleri güncel tutun.")
    : gFail("brand", "profiles", "Sahip olunan profiller", 2, `Yalnızca ${profiles.length} profil bağlı.`, "En az 2 sahip olunan profil ekleyin.", "medium"));
  checks.push(hasKg
    ? gPass("brand", "kg", "Bilgi grafiği kaydı", 2, "Wikipedia, Wikidata veya Crunchbase bağlantısı var.", "Kaydı güncel tutun.")
    : gFail("brand", "kg", "Bilgi grafiği kaydı", 2, "Wikipedia, Wikidata veya Crunchbase bağlantısı yok.", "Varsa Wikidata/Crunchbase kaydı oluşturup sameAs'e ekleyin; yoksa uydurmayın.", "low"));
  checks.push(aboutLinked
    ? gPass("brand", "about", "Hakkında sayfası", 2, "Hakkında sayfası bağlantılı.", "İçeriği güncel tutun.")
    : gFail("brand", "about", "Hakkında sayfası", 2, "Hakkında sayfası bağlantısı yok.", "Kimin yazdığını anlatan bir /hakkimizda/ sayfası ekleyip menüye koyun.", "high"));
  checks.push(contactLinked || hasTel || hasForm || hasWhatsApp
    ? gPass("brand", "contact", "İletişim bilgisi", 1, "İletişim sayfası veya doğrudan iletişim bağlantısı var.", "Bilgileri güncel tutun.")
    : gFail("brand", "contact", "İletişim bilgisi", 1, "İletişim sayfası veya tel/form bağlantısı yok.", "İletişim sayfası, tel: bağlantısı veya form ekleyin.", "medium"));
  checks.push(brandConsistent
    ? gPass("brand", "brand", "Marka adı tutarlılığı", 1, "Organization adı sayfa başlığıyla uyumlu.", "Tutarlılığı koruyun.")
    : gFail("brand", "brand", "Marka adı tutarlılığı", 1, "Organization adı ile sayfa başlığı eşleşmiyor.", "Organization name ve title aynı marka adını kullansın.", "low"));

  const categories = GEO_CATEGORIES.map(([id, label]) => {
    const cs = checks.filter((c) => c.cat === id);
    const max = cs.reduce((s, c) => s + c.weight, 0);
    const points = cs.reduce((s, c) => s + c.points, 0);
    return { id, label, points, max, score: max ? Math.round((points / max) * 100) : 0 };
  });
  const nominal = checks.reduce((s, c) => s + c.weight, 0);
  const got = checks.reduce((s, c) => s + c.points, 0);
  const skipped = checks.filter((c) => c.status === "unknown").reduce((s, c) => s + c.weight, 0);
  const score = nominal ? Math.round((got / nominal) * 100) : 0;
  const coverage = nominal ? Math.round(((nominal - skipped) / nominal) * 100) : 0;
  const recommendations = checks
    .filter((c) => (c.status === "fail" || c.status === "warn") && c.points < c.weight)
    .map((c) => ({
      severity: c.severity,
      category: GEO_CATEGORIES.find(([id]) => id === c.cat)?.[1] || c.cat,
      title: c.label,
      lost: c.weight - c.points,
      evidence: c.detail,
      fix: c.fix,
    }))
    .sort((a, b) => (GEO_SEVERITY[a.severity] - GEO_SEVERITY[b.severity]) || (b.lost - a.lost));
  return { score, grade: grade(score), coverage, categories, checks, recommendations };
}


export async function runCheckup(host, env) {
  const data = await collect(host, env);
  const base = evaluate(data);
  return { host, ...base, geo: base.reachable ? evaluateGeo(data) : null };
}
