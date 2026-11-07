var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/worker.js
var SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  // Match the current site's short HSTS policy. Do not enable includeSubDomains
  // or preload until every subdomain has been verified for HTTPS.
  "Strict-Transport-Security": "max-age=86400",
  // 'unsafe-inline' matches the existing inline theme script and inline styles;
  // tightening to nonces requires templating every script tag in build.mjs.
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests"
};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...SECURITY_HEADERS
    }
  });
}
__name(json, "json");
function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, maxLength);
}
__name(cleanText, "cleanText");
function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
__name(escapeHtml, "escapeHtml");
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}
__name(isValidEmail, "isValidEmail");
function isValidPhone(value) {
  return /^\+?[\d\s().-]{7,}$/.test(value);
}
__name(isValidPhone, "isValidPhone");
function isValidReach(value) {
  return value.length <= 160 && (isValidEmail(value) || isValidPhone(value));
}
__name(isValidReach, "isValidReach");
function getClientIP(request) {
  return cleanText(request.headers.get("CF-Connecting-IP") || "unknown", 64);
}
__name(getClientIP, "getClientIP");
function integerSetting(value, fallback, minimum, maximum) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, parsed));
}
__name(integerSetting, "integerSetting");
async function checkRateLimit(db, ip, maximum, windowMinutes) {
  const now = Math.floor(Date.now() / 1e3);
  const windowSeconds = windowMinutes * 60;
  const result = await db.prepare(
    "INSERT INTO rate_limits (ip, window_started_at, submissions, updated_at) VALUES (?, ?, 1, ?) ON CONFLICT(ip) DO UPDATE SET window_started_at = CASE WHEN excluded.updated_at - rate_limits.window_started_at >= ? THEN excluded.updated_at ELSE rate_limits.window_started_at END, submissions = CASE WHEN excluded.updated_at - rate_limits.window_started_at >= ? THEN 1 ELSE rate_limits.submissions + 1 END, updated_at = excluded.updated_at RETURNING submissions"
  ).bind(ip, now, now, windowSeconds, windowSeconds).first();
  if (!result) throw new Error("D1 rate-limit statement returned no row");
  if (result.submissions === 1) {
    await db.prepare("DELETE FROM rate_limits WHERE updated_at < ?").bind(now - windowSeconds * 2).run();
  }
  return {
    allowed: result.submissions <= maximum,
    remaining: Math.max(0, maximum - result.submissions)
  };
}
__name(checkRateLimit, "checkRateLimit");
async function handleForm(request, env) {
  if (request.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, 405);
  }
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return json({ success: false, error: "Expected application/json" }, 415);
  }
  const declaredLength = Number.parseInt(request.headers.get("Content-Length") || "0", 10);
  if (declaredLength > 2e4) {
    return json({ success: false, error: "Payload too large" }, 413);
  }
  let raw;
  try {
    raw = await request.text();
  } catch {
    return json({ success: false, error: "Invalid request body" }, 400);
  }
  if (!raw || raw.length > 2e4) {
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
  const website = cleanText(data.website, 100);
  if (website) {
    return json({ success: true, message: "Thank you!" }, 200);
  }
  const name = cleanText(data.name, 120);
  const reach = cleanText(data.reach, 160);
  const typeValue = cleanText(data.type, 40);
  const message = cleanText(data.msg, 4e3);
  const page = cleanText(data.page || request.headers.get("Referer") || "", 500);
  const userAgent = cleanText(request.headers.get("User-Agent") || "", 300);
  const typeLabels = {
    site: "Website",
    app: "App",
    both: "Site + app",
    unsure: "Not sure yet"
  };
  const type = Object.hasOwn(typeLabels, typeValue) ? typeValue : "unsure";
  const requestedLanguage = cleanText(data.lang || "", 5).toLowerCase();
  let refererLanguage = "en";
  try {
    const referer = new URL(request.headers.get("Referer") || request.url);
    if (referer.pathname === "/tr" || referer.pathname.startsWith("/tr/")) {
      refererLanguage = "tr";
    }
  } catch {
  }
  const language = requestedLanguage === "tr" || requestedLanguage === "en" ? requestedLanguage : refererLanguage;
  if (!name || !reach || !isValidReach(reach)) {
    return json(
      {
        success: false,
        error: language === "tr" ? "Ad ve ge\xE7erli e-posta veya telefon gerekli." : "Name and a valid email address or phone number are required."
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
    1440
  );
  let rateCheck;
  try {
    rateCheck = await checkRateLimit(env.DB, ip, maxSubmissions, windowMinutes);
  } catch (error) {
    console.error("D1 rate-limit check failed:", error?.message || "unknown error");
    return json(
      {
        success: false,
        error: language === "tr" ? "Form \u015Fu anda kullan\u0131lam\u0131yor. L\xFCtfen daha sonra tekrar deneyin." : "The form is temporarily unavailable. Please try again later."
      },
      503
    );
  }
  if (!rateCheck.allowed) {
    return json(
      {
        success: false,
        error: language === "tr" ? "\xC7ok fazla istek. L\xFCtfen daha sonra tekrar deneyin." : "Too many requests. Please try again later."
      },
      429
    );
  }
  const id = crypto.randomUUID();
  const createdAt = (/* @__PURE__ */ new Date()).toISOString();
  try {
    await env.DB.prepare(
      "INSERT INTO leads (id, name, reach, type, msg, ip, user_agent, page, notification_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)"
    ).bind(id, name, reach, type, message, ip, userAgent, page, createdAt).run();
  } catch (error) {
    console.error("D1 lead insert failed:", error?.message || "unknown error");
    return json(
      {
        success: false,
        error: language === "tr" ? "Mesaj kaydedilemedi. L\xFCtfen tekrar deneyin." : "Your message could not be saved. Please try again."
      },
      500
    );
  }
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
    "Page: " + page
  ].join("\n");
  const htmlBody = "<h2>New request from ai-ulu.com</h2><p><strong>Name:</strong> " + safeName + "<br><strong>Reach:</strong> " + safeReach + "<br><strong>Wants:</strong> " + escapeHtml(typeLabel) + "</p><p><strong>Message:</strong></p><pre>" + safeMessage + "</pre><hr><small>IP: " + safeIP + "<br>Page: " + safePage + "<br>Date: " + safeDate + "</small>";
  try {
    await env.EMAIL.send({
      to: env.TO_EMAIL,
      from: env.FROM_EMAIL,
      subject: "ai-ulu enquiry: " + name,
      text: textBody,
      html: htmlBody
    });
  } catch (error) {
    notificationStatus = "failed";
    console.error("Email send failed:", error?.message || "unknown error");
  }
  try {
    await env.DB.prepare("UPDATE leads SET notification_status = ? WHERE id = ?").bind(notificationStatus, id).run();
  } catch (error) {
    console.error("D1 notification status update failed:", error?.message || "unknown error");
  }
  return json({
    success: true,
    message: language === "tr" ? "Mesaj\u0131n\u0131z al\u0131nd\u0131. Te\u015Fekk\xFCrler!" : "Your message has been received. Thank you!"
  });
}
__name(handleForm, "handleForm");
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/form.php" || url.pathname === "/api/contact") {
      return handleForm(request, env);
    }
    return env.ASSETS.fetch(request);
  }
};

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-MSN3Nd/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-MSN3Nd/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
