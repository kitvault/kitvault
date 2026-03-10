-- ══════════════════════════════════════════════════════════
-- KitVault Session 16 — D1 Migration
-- Add tags, notes, wishlist, timers columns to user_progress
-- ══════════════════════════════════════════════════════════
-- Run via: wrangler d1 execute kitvault-db --remote --file=migration-session16.sql
-- ══════════════════════════════════════════════════════════

-- tags: JSON object { kitId: ["Panel Line", "Paint", ...] }
ALTER TABLE user_progress ADD COLUMN tags TEXT DEFAULT NULL;

-- notes: JSON object { kitId: "note text" }
ALTER TABLE user_progress ADD COLUMN notes TEXT DEFAULT NULL;

-- wishlist: JSON array of kit IDs [123, 456, ...]
ALTER TABLE user_progress ADD COLUMN wishlist TEXT DEFAULT NULL;

-- timers: JSON object { kitId: { accumulated: seconds, running: bool, startedAt: epoch_ms|null, ended: bool } }
ALTER TABLE user_progress ADD COLUMN timers TEXT DEFAULT NULL;
