-- TCG #8 — ELO decay tracking for idempotent enforcement
--
-- Adds a `lastDecayAt` timestamp to pvp_leaderboard so the decay
-- helper (server/routers/pvp.ts applyPendingDecay) can apply only
-- the delta since the last check rather than recomputing the full
-- (now - lastMatchAt) window on every read.
--
-- Existing rows get NULL;
--> statement-breakpoint the helper falls back to `lastMatchAt`
-- as the anchor on first application, then writes the real value.

ALTER TABLE `pvp_leaderboard`
  ADD COLUMN `lastDecayAt` TIMESTAMP NULL DEFAULT NULL AFTER `lastMatchAt`;
