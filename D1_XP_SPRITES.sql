-- ─────────────────────────────────────────────────────────────
-- D1_XP_SPRITES.sql
-- Run with:
--   npx wrangler d1 execute kitvault-db --file=D1_XP_SPRITES.sql --remote
-- ─────────────────────────────────────────────────────────────

-- XP balances per user
CREATE TABLE IF NOT EXISTS user_xp (
  user_id   TEXT PRIMARY KEY,
  xp        INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL DEFAULT 0
);

-- XP transaction log (optional but useful for debugging/auditing)
CREATE TABLE IF NOT EXISTS xp_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    TEXT NOT NULL,
  amount     INTEGER NOT NULL,
  reason     TEXT NOT NULL,   -- 'comment' | 'gallery_post'
  ref_id     INTEGER,         -- comment id or gallery post id
  created_at INTEGER NOT NULL
);

-- Owned sprites per user
CREATE TABLE IF NOT EXISTS user_sprites (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    TEXT NOT NULL,
  sprite_id  TEXT NOT NULL,   -- 'rx78' | 'wingzero' | 'unicorn' | 'barbatos' | 'exia'
  created_at INTEGER NOT NULL,
  UNIQUE(user_id, sprite_id)
);

CREATE INDEX IF NOT EXISTS idx_user_xp_user ON user_xp(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_user ON xp_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_sprites_user ON user_sprites(user_id);
