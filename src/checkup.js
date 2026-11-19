// Free site checkup: scores how well a business site reaches visitors, Google and
// AI assistants. Weights are our own judgment, modelled on public checkers
// (Layer3Labs, Arobis, AgentCheck); search crawlers count, training crawlers do not.

const TIMEOUT_MS = 8000;
const PSI_TIMEOUT_MS = 25000;
const MAPS_FIELDS = "places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.googleMapsUri";
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
  ["harita", "Google Haritalar"],
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
  if (!env?.GOOGLE_KEY) return null;
  try {
    const q = new URLSearchParams({ url: `https://${host}/`, strategy: "mobile", category: "performance", key: env.GOOGLE_KEY });
    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`, { signal: AbortSignal.timeout(PSI_TIMEOUT_MS) });
    if (!res.ok) return null;
    const score = (await res.json())?.lighthouseResult?.categories?.performance?.score;
    return typeof score === "number" ? Math.round(score * 100) : null;
  } catch {
    return null;
  }
}

// Google Places (New) Text Search, only when the visitor typed a business name.
// Returns undefined when not asked, null when not found or unavailable.
async function mapsProfile(name, env) {
  if (!name) return undefined;
  if (!env?.GOOGLE_KEY) return undefined;
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": env.GOOGLE_KEY, "x-goog-fieldmask": MAPS_FIELDS },
      body: JSON.stringify({ textQuery: name, languageCode: "tr", regionCode: "TR", pageSize: 1 }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return undefined;
    const p = (await res.json())?.places?.[0];
    if (!p) return null;
    return { name: p.displayName?.text || name, rating: p.rating ?? null, reviews: p.userRatingCount ?? 0, website: p.websiteUri || "", url: p.googleMapsUri || "" };
  } catch {
    return undefined;
  }
}

const bareHost = (u) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

export async function collect(host, env, name = "") {
  const [https, http] = await Promise.all([get(`https://${host}/`, env), get(`http://${host}/`, env)]);
  const page = https.ok ? https : http;
  const base = https.ok ? `https://${host}` : `http://${host}`;
  const [robots, llms, sitemap, asOai, speed] = await Promise.all([
    get(`${base}/robots.txt`, env), get(`${base}/llms.txt`, env), get(`${base}/sitemap.xml`, env),
    get(`${base}/`, env, OAI_UA), pageSpeed(host, env),
  ]);
  const maps = await mapsProfile(name, env);
  return { host, https, http, page, robots, llms, sitemap, asOai, speed, maps };
}

const errText = (x) => x.error || ([525, 526].includes(x.status) ? "sertifika hatası" : `HTTP ${x.status}`);

function check(cat, label, max, ok, detail, fix, partial = 0) {
  const status = ok === null ? "unknown" : ok ? "pass" : partial ? "warn" : "fail";
  const points = ok === null ? 0 : ok ? max : partial;
  return { cat, label, max: ok === null ? 0 : max, points, status, detail, fix };
}

export function evaluate(d) {
  const { page, https, http, robots, llms, sitemap, asOai } = d;
  const html = page.body;
  const placeholder = /defaultwebpage\.cgi|cgi-sys\/suspendedpage|domain (is )?for sale|parked/i.test(html);
  if (!page.ok || placeholder) {
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
  const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html) || /noindex/i.test(page.headers.get("x-robots-tag") || "");
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
    check("okunur", "Arama açıklaması", 3, Boolean(pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i)), "Google sonucunda başlığın altındaki metin.", "150-160 karakterlik bir meta description ekleyin."),
    check("okunur", "Tek ana başlık (H1)", 2, h1 === 1, `Sayfada ${h1} adet H1 var.`, "Sayfada tek bir H1 olsun; konuyu açıkça söylesin."),
    check("veri", "İşletme bilgisi (schema)", 10, types.some((t) => LOCAL_TYPES.includes(t)), types.length ? `Bulunan türler: ${types.join(", ")}.` : "Sayfada yapılandırılmış veri (JSON-LD) yok.", "Adres, telefon, çalışma saatleri ve konumu içeren LocalBusiness JSON-LD ekleyin.", types.length ? 4 : 0),
    check("veri", "llms.txt", 3, llms.ok && !/<html|<!doctype/i.test(llms.body.slice(0, 300)), "Yapay zekâ asistanlarına işletmeyi özetleyen dosya.", "Sitenin köküne işletmeyi ve ana sayfaları anlatan bir llms.txt koyun."),
    check("veri", "Site haritası (sitemap)", 3, (sitemap.ok && /<urlset|<sitemapindex/i.test(sitemap.body)) || /^sitemap:/im.test(robotsTxt), "Google'a sayfaların listesini veren dosya.", "sitemap.xml oluşturup robots.txt'e ekleyin."),
    check("veri", "Paylaşım önizlemesi (Open Graph)", 2, /<meta[^>]+property=["']og:(title|image)/i.test(html), "WhatsApp ve sosyal medyada link paylaşılınca çıkan kart.", "og:title, og:description ve og:image etiketlerini ekleyin."),
    check("veri", "Asıl adres (canonical)", 2, /<link[^>]+rel=["']canonical/i.test(html), "Aynı sayfanın birden çok adresi varsa Google'a doğrusunu söyler.", "Sayfaya canonical bağlantısı ekleyin."),
    check("donusum", "Dokununca arayan telefon", 5, contact(/href=["']tel:/i), readable ? "Telefondan tek dokunuşla arama." : "İçerik JavaScript ile çizildiği için ölçülemedi.", "Telefon numarasını tel: bağlantısı yapın."),
    check("donusum", "WhatsApp bağlantısı", 5, contact(/wa\.me|api\.whatsapp\.com/i), readable ? "Ziyaretçinin tek dokunuşla yazabilmesi." : "İçerik JavaScript ile çizildiği için ölçülemedi.", "wa.me bağlantılı bir WhatsApp düğmesi ekleyin."),
    check("donusum", "Randevu / iletişim formu", 5, contact(/<form/i), readable ? "Arayamayan ziyaretçi için ikinci kanal." : "İçerik JavaScript ile çizildiği için ölçülemedi.", "Kısa bir randevu ya da iletişim formu ekleyin."),
    ...mapsChecks(d.maps, d.host),
  ];

  const max = checks.reduce((s, c) => s + c.max, 0);
  const got = checks.reduce((s, c) => s + c.points, 0);
  let score = Math.round((got / max) * 100);
  if (noindex) score = Math.min(score, 20);
  const categories = CATEGORIES.map(([id, label]) => {
    const cs = checks.filter((c) => c.cat === id);
    return { id, label, points: cs.reduce((s, c) => s + c.points, 0), max: cs.reduce((s, c) => s + c.max, 0) };
  });
  return { reachable: true, score, grade: grade(score), categories, checks, speed: d.speed, maps: d.maps ?? null };
}

function mapsChecks(m, host) {
  if (m === undefined) return [];
  if (m === null) {
    return [check("harita", "Google Haritalar profili", 5, false, "Yazdığınız adla bir Google Haritalar profili bulunamadı.", "Adı ve şehri tam yazıp tekrar deneyin; profil yoksa Google İşletme Profili açın.")];
  }
  const linked = bareHost(m.website);
  const same = linked && linked === host.replace(/^www\./, "");
  return [
    check("harita", "Google Haritalar profili", 5, true, `Profil bulundu: ${m.name}.`, ""),
    check("harita", "Haritalar puanı", 5, m.rating !== null && m.rating >= 4.3, m.rating === null ? "Henüz puan yok." : `Puan ${m.rating} / 5.`, "Memnun müşterilerden yorum isteyin; olumsuz yorumlara kibarca cevap verin.", m.rating !== null && m.rating >= 4 ? 2 : 0),
    check("harita", "Yorum sayısı", 5, m.reviews >= 30, `${m.reviews} yorum var.`, "Her işlemden sonra yorum linkini WhatsApp'tan gönderin.", m.reviews >= 10 ? 2 : 0),
    check("harita", "Profildeki site linki bu siteye gidiyor", 5, Boolean(same), !m.website ? "Profilde site linki yok; Haritalar'dan gelen ziyaretçi sitenize ulaşamıyor." : same ? "Profil bu siteye bağlı." : `Profildeki link başka bir adrese gidiyor: ${linked}.`, "Google İşletme Profili'nde web sitesi alanını bu adresle güncelleyin."),
  ];
}

export const grade = (s) => (s >= 90 ? "A" : s >= 80 ? "B" : s >= 70 ? "C" : s >= 60 ? "D" : s >= 50 ? "E" : "F");

export async function runCheckup(host, env, name = "") {
  return { host, ...evaluate(await collect(host, env, name)) };
}
