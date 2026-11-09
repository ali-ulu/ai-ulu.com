// Cloudflare Worker: handles /api/lead only. All other routes are served
// by the static assets binding (see wrangler.jsonc -> run_worker_first).

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function sanitize(value, max = 2000) {
  return String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, max);
}

// Validates an e-mail OR a phone-ish reach string. Kept permissive on purpose:
// users type either one and we only need a way to reply.
function validReach(value) {
  const v = value.trim();
  if (v.length < 5 || v.length > 160) return false;
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phone = /^[+()\d\s.-]{7,}$/;
  return email.test(v) || phone.test(v);
}

function clientIp(request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
}

async function rateLimited(env, ip) {
  const windowMinutes = Number(env.RATE_LIMIT_WINDOW_MINUTES || 15);
  const maxSubs = Number(env.RATE_LIMIT_MAX_SUBMISSIONS || 5);
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  const windowStart = now - windowMs;

  const row = await env.DB.prepare(
    `INSERT INTO rate_limits (ip, window_started_at, submissions, updated_at)
     VALUES (?1, ?2, 1, ?2)
     ON CONFLICT(ip) DO UPDATE SET
       window_started_at = CASE WHEN rate_limits.window_started_at < ?3 THEN ?2 ELSE rate_limits.window_started_at END,
       submissions = CASE WHEN rate_limits.window_started_at < ?3 THEN 1 ELSE rate_limits.submissions + 1 END,
       updated_at = ?2
     RETURNING submissions, window_started_at`
  ).bind(ip, now, windowStart).first();

  return row && row.submissions > maxSubs;
}

async function handleLead(request, env) {
  if (request.method !== "POST") return json({ error: "Yöntem desteklenmiyor." }, 405);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Geçersiz istek." }, 400);
  }

  // Honeypot: bots fill hidden fields.
  if (sanitize(payload.company)) return json({ ok: true });

  const name = sanitize(payload.name, 120);
  const reach = sanitize(payload.reach, 160);
  const type = sanitize(payload.type, 40) || "unsure";
  const msg = sanitize(payload.msg, 2000);

  if (name.length < 2) return json({ error: "Lütfen adınızı yazın." }, 422);
  if (!validReach(reach)) return json({ error: "Geçerli bir e-posta veya telefon girin." }, 422);

  const ip = clientIp(request);
  try {
    if (await rateLimited(env, ip)) {
      return json({ error: "Çok fazla deneme. Lütfen biraz sonra tekrar deneyin." }, 429);
    }
  } catch (err) {
    console.error("rate limit check failed", err);
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const ua = sanitize(request.headers.get("user-agent"), 400);
  const page = sanitize(payload.page || request.headers.get("referer"), 300);

  try {
    await env.DB.prepare(
      `INSERT INTO leads (id, name, reach, type, msg, ip, user_agent, page, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`
    ).bind(id, name, reach, type, msg, ip, ua, page, createdAt).run();
  } catch (err) {
    console.error("lead insert failed", err);
    return json({ error: "Kayıt oluşturulamadı. Lütfen e-posta ile ulaşın." }, 500);
  }

  // Notify by e-mail (best effort — never fail the request over this).
  try {
    await env.EMAIL.send({
      to: env.TO_EMAIL,
      from: env.FROM_EMAIL,
      subject: `Yeni teklif isteği: ${name}`,
      text: [
        `Ad: ${name}`,
        `İletişim: ${reach}`,
        `Tür: ${type}`,
        `Mesaj: ${msg || "-"}`,
        `IP: ${ip}`,
        `Sayfa: ${page}`,
        `Zaman: ${createdAt}`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("email send failed", err);
  }

  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/lead") {
      return handleLead(request, env);
    }
    return new Response("Not found", { status: 404 });
  },
};
