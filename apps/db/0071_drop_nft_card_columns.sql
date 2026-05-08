-- ─────────────────────────────────────────────────────────────────
-- Drop NFT references from `cards`.
-- - Remove `nftTokenId` and `nftPerks` columns (orphan columns flagged
--   by the schema.no_orphan_columns gate; never read by any router or UI).
-- - Drop `"nft"` from the `unlockMethod` enum.
--
-- The NFT/blockchain backend was stripped earlier (see traitResolver.ts
-- comment "NFT/blockchain backend stripped"); these are the residual
-- column-level references.
-- ─────────────────────────────────────────────────────────────────

ALTER TABLE `cards` DROP COLUMN `nftTokenId`;
ALTER TABLE `cards` DROP COLUMN `nftPerks`;

-- Repoint any rows that were unlockMethod='nft' before tightening the enum.
UPDATE `cards` SET `unlockMethod` = 'starter' WHERE `unlockMethod` = 'nft';

ALTER TABLE `cards` MODIFY COLUMN `unlockMethod`
  ENUM('starter','story','achievement','trade','fight','exploration','purchase','event','admin')
  DEFAULT 'starter';
