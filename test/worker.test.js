import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/worker.js";

function makeEnv(options = {}) {
  const calls = [];
  const emails = [];
  const db = {
    prepare(sql) {
      return {
        bind(...values) {
          return {
            async first() {
              calls.push({ kind: "first", sql, values });
              if (sql.includes("RETURNING submissions")) {
                return { submissions: options.submissions ?? 1 };
              }
              return null;
            },
            async run() {
              calls.push({ kind: "run", sql, values });
              return { success: true };
            },
          };
        },
      };
    },
  };

  return {
    calls,
    emails,
    env: {
      DB: db,
      EMAIL: {
        async send(message) {
          emails.push(message);
          if (options.emailFailure) throw new Error("simulated email failure");
          return { messageId: "test-message" };
        },
      },
      ASSETS: {
        async fetch(request) {
          return new Response("static asset: " + new URL(request.url).pathname);
        },
      },
      FROM_EMAIL: "noreply@ai-ulu.com",
      TO_EMAIL: "aliulu@ai-ulu.com",
      RATE_LIMIT_WINDOW_MINUTES: "15",
      RATE_LIMIT_MAX_SUBMISSIONS: "5",
    },
  };
}

function formRequest(data, options = {}) {
  return new Request("https://ai-ulu-com-migration.workers.dev/form.php", {
    method: options.method || "POST",
    headers: {
      "Content-Type": "application/json",
      "CF-Connecting-IP": "203.0.113.10",
      "User-Agent": "worker-test",
      "Referer": "https://ai-ulu.com/",
    },
    body: options.noBody ? undefined : JSON.stringify(data),
  });
}

test("non-form paths are served by static assets", async () => {
  const { env } = makeEnv();
  const response = await worker.fetch(
    new Request("https://example.workers.dev/tr/"),
    env
  );
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "static asset: /tr/");
});

test("form rejects methods other than POST", async () => {
  const { env, calls, emails } = makeEnv();
  const response = await worker.fetch(
    formRequest({}, { method: "GET", noBody: true }),
    env
  );
  assert.equal(response.status, 405);
  assert.equal(calls.length, 0);
  assert.equal(emails.length, 0);
});

test("existing app.js JSON contract is accepted and stored", async () => {
  const { env, calls, emails } = makeEnv();
  const response = await worker.fetch(
    formRequest({
      name: "Ali",
      reach: "ali@example.com",
      type: "site",
      msg: "I would like to discuss a website project.",
      website: "",
    }),
    env
  );

  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.ok(calls.some((call) => call.sql.includes("INSERT INTO leads")));
  assert.equal(emails.length, 1);
  assert.equal(emails[0].to, "aliulu@ai-ulu.com");
  assert.equal(emails[0].from, "noreply@ai-ulu.com");
  assert.match(emails[0].text, /Reach: ali@example.com/);
});

test("phone contact is accepted, matching the existing form validation", async () => {
  const { env, emails } = makeEnv();
  const response = await worker.fetch(
    formRequest({
      name: "Ali",
      reach: "+90 555 123 4567",
      type: "unsure",
      msg: "",
      website: "",
    }),
    env
  );

  assert.equal(response.status, 200);
  assert.equal(emails.length, 1);
  assert.match(emails[0].text, /Reach: \+90 555 123 4567/);
});

test("honeypot returns success without writing or sending", async () => {
  const { env, calls, emails } = makeEnv();
  const response = await worker.fetch(
    formRequest({
      name: "",
      reach: "",
      type: "site",
      msg: "",
      website: "filled-by-bot",
    }),
    env
  );

  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.equal(calls.length, 0);
  assert.equal(emails.length, 0);
});

test("invalid contact is rejected before database writes", async () => {
  const { env, calls, emails } = makeEnv();
  const response = await worker.fetch(
    formRequest({
      name: "Ali",
      reach: "not-a-valid-contact",
      type: "site",
      msg: "Hello",
      website: "",
    }),
    env
  );

  assert.equal(response.status, 422);
  assert.equal(calls.length, 0);
  assert.equal(emails.length, 0);
});

test("rate limit rejects the sixth submission before lead insert", async () => {
  const { env, calls, emails } = makeEnv({ submissions: 6 });
  const response = await worker.fetch(
    formRequest({
      name: "Ali",
      reach: "ali@example.com",
      type: "site",
      msg: "Hello",
      website: "",
    }),
    env
  );

  assert.equal(response.status, 429);
  assert.ok(calls.some((call) => call.sql.includes("RETURNING submissions")));
  assert.equal(calls.some((call) => call.sql.includes("INSERT INTO leads")), false);
  assert.equal(emails.length, 0);
});

test("email failure does not discard the lead or report a false form failure", async () => {
  const { env, calls, emails } = makeEnv({ emailFailure: true });
  const response = await worker.fetch(
    formRequest({
      name: "Ali",
      reach: "ali@example.com",
      type: "site",
      msg: "Hello",
      website: "",
    }),
    env
  );

  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.ok(calls.some((call) => call.sql.includes("INSERT INTO leads")));
  assert.ok(calls.some((call) => call.sql.includes("UPDATE leads SET notification_status")));
  assert.equal(emails.length, 1);
});

test("HTML in a submitted message is escaped before notification", async () => {
  const { env, emails } = makeEnv();
  await worker.fetch(
    formRequest({
      name: "Ali",
      reach: "ali@example.com",
      type: "site",
      msg: "<script>alert(1)</script>",
      website: "",
    }),
    env
  );

  assert.equal(emails.length, 1);
  assert.match(emails[0].html, /&lt;script&gt;/);
  assert.doesNotMatch(emails[0].html, /<script>/);
});
