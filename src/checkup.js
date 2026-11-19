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
async function get(url, env, ua = UA) {
  const t0 = Date.now();
  try {
    const own = SELF_HOSTS.has(new URL(url).hostname) && env?.ASSETS;
    const req = new Request(url, { redirect: "follow", headers: { "user-agent": ua } });
    const res = own ? await env.ASSETS.fetch(req) : await fetch(req, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    const body = (await res.text()).slice(0, MAX_BODY_CHARS);
    return { ok: res.ok, status: res.status, finalUrl: own ? null : res.url, own: Boolean(own), ms: Date.now() - t0, body, headers: res.headers };
  } catch (e) {
    return { ok: false, status: 0, error: e?.name === "TimeoutError" ? "zaman aşımı" : "bağlantı hatası", ms: Date.now() - t0, body: "", headers: new Headers() };
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

function schemaTypes(html) {
  const types = new Set();
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const t of m[1].matchAll(/"@type"\s*:\s*(\[[^\]]*\]|"[^"]+")/g)) {
      t[1].replace(/[[\]"]/g, "").split(",").forEach((x) => x.trim() && types.add(x.trim()));
    }
  }
  return [...types];
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
  const [https, http] = await Promise.all([get(`https://${host}/`, env), get(`http://${host}/`, env)]);
  const page = https.ok ? https : http;
  const base = https.ok ? `https://${host}` : `http://${host}`;
  const [robots, llms, sitemap, asOai, speed] = await Promise.all([
    get(`${base}/robots.txt`, env), get(`${base}/llms.txt`, env), get(`${base}/sitemap.xml`, env),
    get(`${base}/`, env, OAI_UA), pageSpeed(host, env),
  ]);
  return { host, https, http, page, robots, llms, sitemap, asOai, speed };
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
  // Contact links live in raw HTML only when the page is server-rendered.
  const contact = (re) => (readable ? re.test(html) : null);

  const checks = [
    check("erisim", "Güvenli bağlantı (https)", 8, https.ok, https.ok ? "https çalışıyor." : `https çalışmıyor (${errText(https)}); tarayıcı "güvenli değil" uyarısı gösterir.`, "Hosting panelinden SSL sertifikasını (ücretsiz Let's Encrypt) etkinleştirin."),
    check("erisim", "http adresi https'e yönleniyor", 4, http.own ? null : !http.ok || Boolean(http.finalUrl?.startsWith("https://")), http.own ? "Kendi sitemizin yönlendirmesi bu araçla ölçülemiyor." : "Eski http bağlantıları güvenli adrese gitmeli.", "Sunucuda http → https kalıcı (301) yönlendirmesi açın."),
    check("erisim", "Hızlı ilk yanıt", 4, page.own ? null : page.ms < 1500, page.own ? "Kendi sitemizin yanıt süresi bu araçla ölçülemiyor." : `Sunucu ${(page.ms / 1000).toFixed(1)} saniyede yanıt verdi.`, "Önbellek (cache) ve daha hızlı bir sunucu/CDN kullanın.", page.ms < 3000 ? 2 : 0),
    check("erisim", "Arama motorlarına açık (noindex yok)", 4, !noindex, noindex ? "Sayfa noindex ile arama sonuçlarından gizlenmiş." : "Sayfa dizine eklenebilir.", "Sayfadaki noindex etiketini kaldırın."),
    ...SEARCH_BOTS.map(([bot, pts]) => {
      const ok = robotsAllows(robotsTxt, bot);
      return check("yz", `${bot} siteye girebiliyor`, pts, ok, ok ? "robots.txt izin veriyor." : "robots.txt bu tarayıcıyı engelliyor; bu kanaldaki aramalarda görünmezsiniz.", `robots.txt'e "User-agent: ${bot}" ve "Allow: /" ekleyin.`);
    }),
    check("yz", "Güvenlik duvarı yapay zekâyı engellemiyor", 5, !oaiBlocked, oaiBlocked ? `Site tarayıcıya açılıyor ama ChatGPT'nin arama tarayıcısına ${asOai.status} hatası veriyor.` : "ChatGPT'nin arama tarayıcısı sayfayı alabiliyor.", "Cloudflare/hosting güvenlik ayarlarında OAI-SearchBot'a izin verin."),
    check("okunur", "İçerik JavaScript olmadan okunuyor", 12, readable, readable ? `Sayfada ${text} karakter okunabilir yazı var.` : `Sunucunun verdiği sayfada yalnız ${text} karakter yazı var; içerik sonradan JavaScript ile çiziliyor. Google ve yapay zekâ sayfayı neredeyse boş görür.`, "Sayfayı sunucuda oluşturun (SSR/statik HTML) ya da ana metni HTML'e koyun.", text >= 100 ? 5 : 0),
    check("okunur", "Sayfa başlığı", 3, Boolean(pick(/<title[^>]*>([\s\S]*?)<\/title>/i)), "Google sonucunda görünen başlık.", "Her sayfaya işletme adı + hizmet + şehir içeren bir başlık (title) yazın."),
    check("okunur", "Arama açıklaması", 3, hasMeta(html, "description"), "Google sonucunda başlığın altındaki metin.", "150-160 karakterlik bir meta description ekleyin."),
    check("okunur", "Tek ana başlık (H1)", 2, h1 === 1, `Sayfada ${h1} adet H1 var.`, "Sayfada tek bir H1 olsun; konuyu açıkça söylesin."),
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

export async function runCheckup(host, env) {
  return { host, ...evaluate(await collect(host, env)) };
}
