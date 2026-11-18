// Free site checkup: measures where a business site loses visitors and AI assistants.
// Same checks as Desktop/ai-ulu/araclar/checkup/checkup.mjs, run from the Worker.

const TIMEOUT_MS = 8000;
// shortcut: bodies are cut at 1 MB after download; fine for clinic sites, stream if abused.
const MAX_BODY_CHARS = 1_000_000;
const UA = "Mozilla/5.0 (compatible; ai-ulu-checkup/1.0; +https://ai-ulu.com/checkup/)";
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended"];
const LOCAL_TYPES = ["Dentist", "MedicalClinic", "MedicalBusiness", "LocalBusiness", "MedicalOrganization"];

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
  if (/(^|\.)(localhost|local|internal|lan|home|ai-ulu\.com)$/.test(host)) return null;
  return host;
}

async function get(url) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(TIMEOUT_MS), headers: { "user-agent": UA } });
    const body = (await res.text()).slice(0, MAX_BODY_CHARS);
    return { ok: res.ok, status: res.status, finalUrl: res.url, ms: Date.now() - t0, body };
  } catch (e) {
    return { ok: false, status: 0, error: e?.name === "TimeoutError" ? "zaman aşımı" : "bağlantı hatası", ms: Date.now() - t0, body: "" };
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

export function blockedBots(robots) {
  const blocked = new Set();
  let agents = [];
  let lastWasAgent = false;
  for (const raw of robots.split(/\r?\n/)) {
    const [k, ...rest] = raw.replace(/#.*/, "").trim().split(":");
    const v = rest.join(":").trim();
    if (/^user-agent$/i.test(k)) { agents = lastWasAgent ? [...agents, v] : [v]; lastWasAgent = true; continue; }
    lastWasAgent = false;
    if (!/^disallow$/i.test(k) || v !== "/") continue;
    for (const bot of AI_BOTS) if (agents.some((a) => a === "*" || a.toLowerCase() === bot.toLowerCase())) blocked.add(bot);
  }
  return [...blocked];
}

export async function runCheckup(host) {
  const [https, http] = await Promise.all([get(`https://${host}/`), get(`http://${host}/`)]);
  const page = https.ok ? https : http;
  const html = page.body;
  const base = https.ok ? `https://${host}` : `http://${host}`;
  const [llms, robots] = await Promise.all([get(`${base}/llms.txt`), get(`${base}/robots.txt`)]);
  const pick = (re) => (html.match(re) || [])[1]?.trim() || "";
  return {
    host,
    https: { ok: https.ok, status: https.status, error: https.error || null },
    http: { ok: http.ok, status: http.status, error: http.error || null, redirectsToHttps: http.finalUrl?.startsWith("https://") || false },
    placeholder: /defaultwebpage\.cgi|cgi-sys\/suspendedpage|domain (is )?for sale|parked/i.test(html),
    reachable: page.ok, loadMs: page.ms, visibleChars: visibleText(html).length,
    title: pick(/<title[^>]*>([\s\S]*?)<\/title>/i),
    description: pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i),
    viewport: /<meta[^>]+name=["']viewport/i.test(html),
    schema: schemaTypes(html),
    llmsTxt: llms.ok && !/<html|<!doctype/i.test(llms.body.slice(0, 300)),
    aiBotsBlocked: robots.ok ? blockedBots(robots.body) : [],
    tel: /href=["']tel:/i.test(html), whatsapp: /wa\.me|api\.whatsapp\.com/i.test(html), form: /<form/i.test(html),
  };
}

// 525/526 are Cloudflare's codes for a broken TLS certificate on the target site.
const errText = (x) => x.error || ([525, 526].includes(x.status) ? "sertifika hatası" : `HTTP ${x.status}`);

export function findings(r) {
  if (r.reachable && r.placeholder) {
    return [`Adres açılıyor ama site yok: hostingin boş varsayılan sayfası geliyor${r.https.ok ? "" : `, https de çalışmıyor (${errText(r.https)})`}. Google'dan gelen ziyaretçi işletmeniz yerine boş sayfa görüyor.`];
  }
  const up = r.reachable;
  // JS-rendered pages hide their links from raw HTML; claiming "missing" there would be false.
  const measurable = up && r.visibleChars >= 300;
  return [
    [!up, `Site açılmıyor (https: ${errText(r.https)}, http: ${errText(r.http)}). Google'dan tıklayan ziyaretçi hata görüyor.`],
    [up && !r.https.ok, `Güvenli bağlantı (https) çalışmıyor (${errText(r.https)}). Tarayıcı "güvenli değil" uyarısı gösterir.`],
    [r.http.ok && r.https.ok && !r.http.redirectsToHttps, "http adresi güvenli adrese (https) yönlenmiyor."],
    [up && r.visibleChars < 300, `Sunucunun verdiği sayfada yalnız ${r.visibleChars} karakter yazı var; içerik sonradan JavaScript ile çiziliyor. Google ve yapay zekâ asistanları sayfayı neredeyse boş görür.`],
    [up && r.loadMs > 3000, `Sayfa ${(r.loadMs / 1000).toFixed(1)} saniyede yanıt verdi; telefonda ziyaretçi beklemeden çıkar.`],
    [up && !r.title, "Sayfa başlığı yok."],
    [up && !r.description, "Google sonucunda görünen açıklama metni yok."],
    [up && !r.viewport, "Telefon ayarı (viewport) yok; sayfa telefonda küçük görünür."],
    [up && !r.schema.some((t) => LOCAL_TYPES.includes(t)), "İşletme bilgisi (schema) yok. Google ve yapay zekâ adres, saat ve telefonu sayfadan güvenle çekemiyor."],
    [up && !r.llmsTxt, "llms.txt yok: ChatGPT ve Gemini gibi asistanlara işletmenizi özetleyen dosya yok."],
    [r.aiBotsBlocked.length > 0, `Site yapay zekâ tarayıcılarını engelliyor: ${r.aiBotsBlocked.join(", ")}.`],
    [measurable && !r.whatsapp, "Sayfada WhatsApp ile yazma bağlantısı yok."],
    [measurable && !r.tel, "Telefona dokununca arayan bağlantı yok."],
    [measurable && !r.form, "Randevu ya da iletişim formu yok."],
  ].filter(([bad]) => bad).map(([, msg]) => msg);
}
