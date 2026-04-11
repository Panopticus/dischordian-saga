-- Phase: Casino cosmetic equip slots
--
-- Follow-up to 0044. Adds the equippedCasinoCosmetics JSON column so
-- players can equip one cosmetic per slot (title / chip / card_back /
-- table_felt / companion / loredex).

ALTER TABLE `casino_state`
  ADD COLUMN `equippedCasinoCosmetics` JSON DEFAULT NULL;
