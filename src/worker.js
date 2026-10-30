/**
 * ai-ulu.com Cloudflare Worker.
 *
 * Static files are served from shipcraft/dist.
 * POST /form.php preserves the existing app.js JSON contract and replaces PHP.
 *
 * Bindings:
 *   ASSETS - Workers Static Assets
 *   DB     - Cloudflare D1
 *   EMAIL  - Cloudflare Email Sending
 */

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  // Match the current site's short HSTS policy. Do not enable includeSubDomains
  // or preload until every subdomain has been verified for HTTPS.
  "Strict-Transport-Security": "max-age=86400",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...SECURITY_HEADERS,
    },
  });
}

function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function isValidPhone(value) {
  return /^\+?[\d\s().-]{7,}$/.test(value);
}

function isValidReach(value) {
  return value.length <= 160 && (isValidEmail(value) || isValidPhone(value));
}

function getClientIP(request) {
  // CF-Connecting-IP is set by Cloudflare at the edge. Do not trust a
  // caller-supplied X-Forwarded-For value as a rate-limit identity.
  return cleanText(request.headers.get("CF-Connecting-IP") || "unknown", 64);
}

function integerSetting(value, fallback, minimum, maximum) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, parsed));
}

async function checkRateLimit(db, ip, maximum, windowMinutes) {
  const now = Math.floor(Date.now() / 1000);
  const windowSeconds = windowMinutes * 60;

  // A single atomic UPSERT protects the limit under concurrent requests.
  const result = await db
    .prepare(
      "INSERT INTO rate_limits (ip, window_started_at, submissions, updated_at) " +
      "VALUES (?, ?, 1, ?) " +
      "ON CONFLICT(ip) DO UPDATE SET " +
      "window_started_at = CASE " +
      "WHEN excluded.updated_at - rate_limits.window_started_at >= ? " +
      "THEN excluded.updated_at ELSE rate_limits.window_started_at END, " +
      "submissions = CASE " +
      "WHEN excluded.updated_at - rate_limits.window_started_at >= ? " +
      "THEN 1 ELSE rate_limits.submissions + 1 END, " +
      "updated_at = excluded.updated_at " +
      "RETURNING submissions"
    )
    .bind(ip, now, now, windowSeconds, windowSeconds)
    .first();

  if (!result) throw new Error("D1 rate-limit statement returned no row");

  // Opportunistic cleanup only when this IP starts a fresh window.
  if (result.submissions === 1) {
    await db
      .prepare("DELETE FROM rate_limits WHERE updated_at < ?")
      .bind(now - windowSeconds * 2)
      .run();
  }

  return {
    allowed: result.submissions <= maximum,
    remaining: Math.max(0, maximum - result.submissions),
  };
}

async function handleForm(request, env) {
  if (request.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, 405);
  }

  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return json({ success: false, error: "Expected application/json" }, 415);
  }

  const declaredLength = Number.parseInt(request.headers.get("Content-Length") || "0", 10);
  if (declaredLength > 20_000) {
    return json({ success: false, error: "Payload too large" }, 413);
  }

  let raw;
  try {
    raw = await request.text();
  } catch {
    return json({ success: false, error: "Invalid request body" }, 400);
  }

  if (!raw || raw.length > 20_000) {
    return json({ success: false, error: "Invalid request body" }, 400);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return json({ success: false, error: "Invalid JSON" }, 400);
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return json({ success: false, error: "Invalid payload" }, 400);
  }

  // Exact honeypot field used by the existing app.js and form.php.
  const website = cleanText(data.website, 100);
  if (website) {
    return json({ success: true, message: "Thank you!" }, 200);
  }

  // Preserve the existing client contract: name, reach, type, msg, website.
  // "reach" may be either an email address or a phone number.
  const name = cleanText(data.name, 120);
  const reach = cleanText(data.reach, 160);
  const typeValue = cleanText(data.type, 40);
  const message = cleanText(data.msg, 4_000);
  const page = cleanText(data.page || request.headers.get("Referer") || "", 500);
  const userAgent = cleanText(request.headers.get("User-Agent") || "", 300);
  const typeLabels = {
    site: "Website",
    app: "App",
    both: "Site + app",
    unsure: "Not sure yet",
  };
  const type = Object.hasOwn(typeLabels, typeValue) ? typeValue : "unsure";
  const language = cleanText(data.lang || "", 5) === "tr" ? "tr" : "en";

  if (!name || !reach || !isValidReach(reach)) {
    return json(
      {
        success: false,
        error: language === "tr"
          ? "Ad ve geçerli e-posta veya telefon gerekli."
          : "Name and a valid email address or phone number are required.",
      },
      422
    );
  }

  const ip = getClientIP(request);
  const maxSubmissions = integerSetting(
    env.RATE_LIMIT_MAX_SUBMISSIONS,
    5,
    1,
    100
  );
  const windowMinutes = integerSetting(
    env.RATE_LIMIT_WINDOW_MINUTES,
    15,
    1,
    1_440
  );

  let rateCheck;
  try {
    rateCheck = await checkRateLimit(env.DB, ip, maxSubmissions, windowMinutes);
  } catch (error) {
    console.error("D1 rate-limit check failed:", error?.message || "unknown error");
    return json(
      {
        success: false,
        error: language === "tr"
          ? "Form şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin."
          : "The form is temporarily unavailable. Please try again later.",
      },
      503
    );
  }

  if (!rateCheck.allowed) {
    return json(
      {
        success: false,
        error: language === "tr"
          ? "Çok fazla istek. Lütfen daha sonra tekrar deneyin."
          : "Too many requests. Please try again later.",
      },
      429
    );
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  try {
    await env.DB
      .prepare(
        "INSERT INTO leads " +
        "(id, name, reach, type, msg, ip, user_agent, page, notification_status, created_at) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)"
      )
      .bind(id, name, reach, type, message, ip, userAgent, page, createdAt)
      .run();
  } catch (error) {
    console.error("D1 lead insert failed:", error?.message || "unknown error");
    return json(
      {
        success: false,
        error: language === "tr"
          ? "Mesaj kaydedilemedi. Lütfen tekrar deneyin."
          : "Your message could not be saved. Please try again.",
      },
      500
    );
  }

  // Store the lead before sending email. A mail delivery failure must not
  // discard the enquiry or cause the browser to resubmit and duplicate it.
  let notificationStatus = "sent";
  const safeName = escapeHtml(name);
  const safeReach = escapeHtml(reach);
  const safeMessage = escapeHtml(message);
  const safePage = escapeHtml(page);
  const safeIP = escapeHtml(ip);
  const safeDate = escapeHtml(createdAt);
  const typeLabel = typeLabels[type];

  const textBody = [
    "New request from ai-ulu.com",
    "",
    "Name: " + name,
    "Reach: " + reach,
    "Wants: " + typeLabel,
    "When: " + createdAt,
    "",
    "Message:",
    message || "(none)",
    "",
    "IP: " + ip,
    "Page: " + page,
  ].join("\n");

  const htmlBody =
    "<h2>New request from ai-ulu.com</h2>" +
    "<p><strong>Name:</strong> " + safeName + "<br>" +
    "<strong>Reach:</strong> " + safeReach + "<br>" +
    "<strong>Wants:</strong> " + escapeHtml(typeLabel) + "</p>" +
    "<p><strong>Message:</strong></p><pre>" + safeMessage + "</pre>" +
    "<hr><small>IP: " + safeIP + "<br>Page: " + safePage +
    "<br>Date: " + safeDate + "</small>";

  try {
    await env.EMAIL.send({
      to: env.TO_EMAIL,
      from: env.FROM_EMAIL,
      subject: "ai-ulu enquiry: " + name,
      text: textBody,
      html: htmlBody,
    });
  } catch (error) {
    notificationStatus = "failed";
    console.error("Email send failed:", error?.message || "unknown error");
  }

  try {
    await env.DB
      .prepare("UPDATE leads SET notification_status = ? WHERE id = ?")
      .bind(notificationStatus, id)
      .run();
  } catch (error) {
    console.error("D1 notification status update failed:", error?.message || "unknown error");
  }

  return json({
    success: true,
    message: language === "tr"
      ? "Mesajınız alındı. Teşekkürler!"
      : "Your message has been received. Thank you!",
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/form.php" || url.pathname === "/api/contact") {
      return handleForm(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
