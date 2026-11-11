# Security Policy

## Reporting a vulnerability

E-mail **aliulu@ai-ulu.com** with a description and, if possible, reproduction
steps. Please do not open a public issue for security problems. You will get a
reply within a few days.

## Scope

- `src/worker.js` — the `/api/lead` Cloudflare Worker (the only server-side code)
- `src/site/` and `scripts/` — static site generator
- `.github/workflows/deploy.yml` — CI/CD

## Hardening in place

- All D1 queries are parameterized; no string concatenation of user input.
- Input is sanitized (control characters stripped, length capped) and pages are
  HTML-escaped; the CSP is `'self'`-only with no inline scripts.
- Security headers are served from `dist/_headers` (CSP, HSTS, nosniff,
  frame-ancestors, Referrer-Policy, Permissions-Policy).
- Every `/api/*` POST is same-origin checked and its body is capped *while it is
  read* (a chunked request with no `Content-Length` cannot be buffered whole).
  `/api/lead` uses a 16 KB cap, `/api/hit` 2 KB, `/api/error` 4 KB.
- `/api/lead` also enforces a JSON content type, a honeypot, and a per-IP rate
  limit that fails closed.
- `/api/hit` and `/api/error` each have their own per-IP hourly budget under a
  separate key, so analytics and error reporting cannot exhaust the lead budget
  or each other. The error budget fails open on a limiter outage so a report is
  never lost.
- The `hits` key is fully bounded: path, country and referrer host are all
  length-capped, so one caller cannot mint unbounded rows.
- A daily cron (`src/worker.js` `scheduled`) deletes stale rate-limit rows and
  leads older than the retention window.

## Operational checklist (owner)

- [ ] **E-mail authentication (SPF/DKIM/DMARC).** `noreply@ai-ulu.com` sends to a
      real inbox via Cloudflare Email. Verify the SPF, DKIM and DMARC DNS records
      for `ai-ulu.com` so the domain cannot be spoofed. This cannot be done from
      the code repository.
- [ ] **Lead CAPTCHA (Turnstile).** `turnstileOk` returns `true` when
      `TURNSTILE_SECRET` is unset, so the CAPTCHA is **off** until you set both the
      Worker secret and the site key. This is deliberate (the form keeps working
      until then), but it means the live posture depends on a deployment fact. To
      switch it on: `wrangler secret put TURNSTILE_SECRET` and set
      `turnstileSiteKey` in `src/site/config.mjs`, then redeploy. Verify with
      `wrangler secret list` and by confirming the widget renders on the live form.
- [ ] **D1 retention.** Confirm the daily cron runs (`wrangler tail` shows the
      scheduled invocation) and that the 12-month retention in
      `src/site/pages.mjs` matches the policy you publish.
- [ ] **Request-body limits.** The streaming cap above bounds what the Worker
      buffers, but the platform's own request-body limit still applies; confirm it
      for the deployed Workers plan.
- [ ] **Secrets.** `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` live only in
      repository secrets; never commit them.
