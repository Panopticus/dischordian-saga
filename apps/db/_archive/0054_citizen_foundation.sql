-- §G.2 foundation — add the missing `foundation` enum column to
-- `citizen_characters`. The column was declared in apps/db/schema.ts
-- (commit 608189a, "Suits of the Inventor") but no migration shipped
-- with it, so every `.select()` against citizen_characters — including
-- citizen.getCharacter and the existence check inside
-- citizen.createCharacter — blew up with "Unknown column 'foundation'".
--
-- Default "humanity" matches the schema default so existing rows
-- hydrate without a backfill pass.

ALTER TABLE `citizen_characters`
  ADD COLUMN `foundation` ENUM('humanity','machine') NOT NULL DEFAULT 'humanity'
  AFTER `element`;
