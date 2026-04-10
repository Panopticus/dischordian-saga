-- Concurrency fix — Prevent duplicate promo code redemptions under load
--
-- The previous redeemCode mutation read from promo_code_redemptions,
-- checked that the user had no existing row, and then inserted a new
-- row in two separate queries. Two concurrent requests from the same
-- user could both pass the existence check before either insert
-- landed, so a single-use promo could be redeemed multiple times and
-- the maxRedemptions cap could be exceeded.
--
-- This migration adds a unique composite index on (promoCodeId, userId)
-- so the second concurrent insert fails at the database layer with a
-- duplicate-key error regardless of application logic. Combined with a
-- transaction + FOR UPDATE row lock in the router (see
-- server/routers/promoCodes.ts) this closes the race.
--
-- Before running this migration in production, clean up any existing
-- duplicate rows:
--
--   SELECT promoCodeId, userId, COUNT(*) AS c
--   FROM promo_code_redemptions
--   GROUP BY promoCodeId, userId
--   HAVING c > 1;
--
-- ...and keep only the earliest redemption per (promoCodeId, userId)
-- pair, recalculating promo_codes.currentRedemptions afterward.

CREATE UNIQUE INDEX `uq_promo_code_redemptions_code_user`
  ON `promo_code_redemptions` (`promoCodeId`, `userId`);
