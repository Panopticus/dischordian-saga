-- Task 6.1 — Prevent duplicate Stripe fulfillment
--
-- Stripe retries webhook delivery on any 5xx response. The previous
-- handler just inserted a new row and called fulfillPurchase each
-- time the webhook fired, so a retried delivery could grant the same
-- items twice. This migration adds a unique index on the Stripe
-- payment intent id so the second insert fails and the handler can
-- short-circuit the fulfillment.
--
-- MySQL treats multiple NULL values as non-conflicting, which is
-- exactly what we want: credits / dream purchases never carry a
-- stripePaymentIntentId and must still be free to insert.
--
-- Before running this migration in production, make sure any
-- existing duplicate rows for the same intent id are cleaned up:
--
--   SELECT stripePaymentIntentId, COUNT(*) AS c
--   FROM store_purchases
--   WHERE stripePaymentIntentId IS NOT NULL
--   GROUP BY stripePaymentIntentId
--   HAVING c > 1;
--
-- ...and manually reconcile / delete the older rows.

CREATE UNIQUE INDEX `uq_store_purchases_stripe_intent`
  ON `store_purchases` (`stripePaymentIntentId`);
