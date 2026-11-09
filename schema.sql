-- Initial D1 schema for ai-ulu.com.
-- Apply once after creating the database:
-- npx wrangler d1 execute ai-ulu-leads --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS leads (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  reach               TEXT NOT NULL,
  type                TEXT NOT NULL DEFAULT 'unsure',
  msg                 TEXT NOT NULL DEFAULT '',
  ip                  TEXT NOT NULL,
  user_agent          TEXT NOT NULL DEFAULT '',
  page                TEXT NOT NULL DEFAULT '',
  notification_status TEXT NOT NULL DEFAULT 'pending',
  created_at          TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at
  ON leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_reach
  ON leads(reach);

-- One row per IP. The Worker uses an atomic UPSERT + RETURNING statement,
-- so concurrent submissions cannot bypass the per-IP window counter.
CREATE TABLE IF NOT EXISTS rate_limits (
  ip                TEXT PRIMARY KEY,
  window_started_at INTEGER NOT NULL,
  submissions       INTEGER NOT NULL,
  updated_at        INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_updated_at
  ON rate_limits(updated_at);
