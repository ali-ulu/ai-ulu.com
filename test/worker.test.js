import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/worker.js";

// Minimal D1 + EMAIL fakes that exercise the real handler logic.

function makeDb() {
  const leads = [];
  const rates = new Map();
  return {
    leads,
    prepare(sql) {
      const stmt = {
        _args: [],
        bind(...args) { this._args = args; return this; },
        async run() {
          if (sql.includes("INSERT INTO leads")) {
            const [id, name, reach, project_type, msg, ip, user_agent, page, created_at] = this._args;
            leads.push({ id, name, reach, project_type, msg, ip, user_agent, page, created_at });
          }
          return { success: true };
        },
        async first() {
          if (sql.includes("INSERT INTO rate_limits")) {
            const [ip, now, windowStart] = this._args;
            const cur = rates.get(ip);
            if (!cur || cur.window_started_at < windowStart) {
              const row = { ip, window_started_at: now, submissions: 1, updated_at: now };
              rates.set(ip, row);
              return { submissions: row.submissions, window_started_at: row.window_started_at };
            }
            cur.submissions += 1;
            cur.updated_at = now;
            return { submissions: cur.submissions, window_started_at: cur.window_started_at };
          }
          return null;
        },
      };
      return stmt;
    },
  };
}

function makeEnv() {
  return {
    DB: makeDb(),
    EMAIL: { sent: [], async send(m) { this.sent.push(m); return { ok: true }; } },
    TO_EMAIL: "aliulu@ai-ulu.com",
    FROM_EMAIL: "noreply@ai-ulu.com",
    RATE_LIMIT_WINDOW_MINUTES: "15",
    RATE_LIMIT_MAX_SUBMISSIONS: "5",
  };
}

function post(body, headers = {}) {
  return new Request("https://ai-ulu.com/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json", "cf-connecting-ip": "1.2.3.4", ...headers },
    body: JSON.stringify(body),
  });
}

test("valid submission stores a lead and sends email", async () => {
  const env = makeEnv();
  const res = await worker.fetch(post({ name: "Ayşe Yılmaz", reach: "ayse@example.com", type: "business", msg: "Klinik sitesi" }), env);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.equal(env.DB.leads.length, 1);
  assert.equal(env.DB.leads[0].name, "Ayşe Yılmaz");
  assert.equal(env.EMAIL.sent.length, 1);
});

test("honeypot silently accepts but stores nothing", async () => {
  const env = makeEnv();
  const res = await worker.fetch(post({ name: "Bot", reach: "bot@example.com", company: "spam inc" }), env);
  assert.equal(res.status, 200);
  assert.equal(env.DB.leads.length, 0);
});

test("rejects missing name", async () => {
  const env = makeEnv();
  const res = await worker.fetch(post({ name: "", reach: "a@b.com" }), env);
  assert.equal(res.status, 422);
});

test("rejects invalid reach", async () => {
  const env = makeEnv();
  const res = await worker.fetch(post({ name: "Ali", reach: "xx" }), env);
  assert.equal(res.status, 422);
});

test("accepts phone number as reach", async () => {
  const env = makeEnv();
  const res = await worker.fetch(post({ name: "Ali Ulu", reach: "+90 500 000 00 00" }), env);
  assert.equal(res.status, 200);
});

test("rate limits after max submissions from one IP", async () => {
  const env = makeEnv();
  for (let i = 0; i < 5; i++) {
    const res = await worker.fetch(post({ name: `User ${i}`, reach: "a@b.com" }), env);
    assert.equal(res.status, 200);
  }
  const res = await worker.fetch(post({ name: "Sixth", reach: "a@b.com" }), env);
  assert.equal(res.status, 429);
});

test("rejects non-POST", async () => {
  const env = makeEnv();
  const res = await worker.fetch(new Request("https://ai-ulu.com/api/lead", { method: "GET" }), env);
  assert.equal(res.status, 405);
});

test("unknown route returns 404", async () => {
  const env = makeEnv();
  const res = await worker.fetch(new Request("https://ai-ulu.com/api/other"), env);
  assert.equal(res.status, 404);
});

test("sanitizes control characters in message", async () => {
  const env = makeEnv();
  await worker.fetch(post({ name: "Ali", reach: "a@b.com", msg: "hello\u0000world" }), env);
  assert.ok(!env.DB.leads[0].msg.includes("\u0000"));
});
