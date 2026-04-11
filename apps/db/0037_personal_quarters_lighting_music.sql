-- Task — Consolidate Player Cabin + Personal Quarters into one housing system.
--
-- The codebase had TWO parallel housing systems: `personalQuarters` (server-wired,
-- persisted, 120+ RPG-gated decoration items) and `playerCabin` (UI-only, no
-- persistence, but with a nicer visual slot-map, 8 lighting presets, and a music
-- box track system). This migration folds the Cabin's features into the
-- existing Personal Quarters table so we can delete the orphaned Cabin code.
--
-- New columns on `player_quarters`:
--   - `lightingPreset`   — active lighting preset id (one of: void, warm, cold,
--                          noir, candle, neon, corruption, starlight). Drives
--                          the room's atmosphere in the client.
--   - `musicTrack`       — active music-box track key (one of the keys in
--                          CABIN_MUSIC_TRACKS in shared/personalQuarters.ts).
--
-- The existing `placedItems` JSON column gains an optional per-entry `slotId`
-- field (see shared/personalQuarters.ts::ZONE_SLOT_MAPS) that pins a decoration
-- to a specific visual hotspot in the room map. Items without a slotId still
-- render via their (x,y) grid coordinates, so existing rows need no backfill.

ALTER TABLE `player_quarters`
  ADD COLUMN `lightingPreset` VARCHAR(32) NOT NULL DEFAULT 'void',
  ADD COLUMN `musicTrack` VARCHAR(64) NOT NULL DEFAULT 'music_void_ambient';
