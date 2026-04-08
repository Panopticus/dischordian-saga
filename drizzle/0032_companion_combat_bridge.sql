-- Companion Combat Bridge: evolution + death tracking columns

ALTER TABLE `eidolon_bonds` ADD COLUMN `evolutionXp` int NOT NULL DEFAULT 0;
ALTER TABLE `eidolon_bonds` ADD COLUMN `deathCause` varchar(64);
ALTER TABLE `eidolon_bonds` ADD COLUMN `isSpectral` boolean NOT NULL DEFAULT false;
ALTER TABLE `eidolon_bonds` ADD COLUMN `spectralBonusSystem` varchar(64);

ALTER TABLE `player_pets` ADD COLUMN `evolutionXp` int NOT NULL DEFAULT 0;
