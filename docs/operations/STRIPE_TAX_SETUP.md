# Stripe Tax setup

The store router requests `automatic_tax: { enabled: true }` on every
checkout session by default (`STRIPE_AUTOMATIC_TAX=false` to disable).
Stripe will reject the API call until tax is configured in the
Stripe dashboard. This is a one-time operator setup — the code is
already wired.

## What you need to do in the Stripe dashboard

1. **Enable Stripe Tax** — Dashboard → Tax → Enable Tax. This is
   subscription-tier-gated; current pricing is a small per-transaction
   fee, no monthly minimum.
2. **Set the origin address** — your business's tax-determining
   location. For US-LLCs this is your registered address.
3. **Register for the jurisdictions you sell into.** Stripe Tax can
   *calculate* tax everywhere, but it can only *collect* in
   jurisdictions where you've completed registration. Common starts:
   - US: register in your home state. Other states only matter if
     economic nexus thresholds are crossed (typically $100K/200 txns).
   - EU: a single VAT-OSS registration covers all 27 member states
     for B2C digital services. €10K/year threshold before required.
   - UK: separate VAT registration; £85K/year threshold.
   - Canada: GST/HST registration; $30K/year threshold.
4. **Confirm tax codes per product.** The store router currently
   tags every line item as `txcd_10000000` ("Electronically Supplied
   Services"), which fits in-game currency / cosmetic / battle-pass
   purchases. If you add physical merch, change the per-product
   `tax_code` in `apps/server/routers/store.ts:createCheckout`.
5. **Test in Stripe test mode** — Stripe Tax works the same in test
   mode. Run a test checkout with a EU billing address and confirm
   VAT appears on the line items.

## What happens at runtime

- `automatic_tax: { enabled: true }` makes Stripe compute tax as the
  customer fills the address field on the Checkout page.
- `billing_address_collection: "required"` ensures the customer
  provides the address Stripe needs to determine jurisdiction.
- The amount displayed to the customer includes tax. The
  `amount_total` on the resulting webhook event is the
  tax-inclusive total; `amount_subtotal` is pre-tax. Update the
  store-fulfilment ledger to record `amountSubtotal`,
  `taxAmount`, and `amountTotal` separately for accounting.

## Receipts

Stripe automatically emails a receipt when `customer_email` is set
on the session (we do). For invoices and tax receipts that comply
with EU/UK requirements, enable Stripe **Invoicing** in the
dashboard — it adds a downloadable PDF link to the receipt.

## Disable temporarily

Set `STRIPE_AUTOMATIC_TAX=false` in env if you need to ship
checkout before tax registrations are finished. The store will work
but every collected payment in a tax-required jurisdiction is a
liability.

## Related

- `apps/server/routers/store.ts:createCheckout` — call site.
- `apps/server/_core/index.ts` — Stripe webhook handler (already
  idempotent via `processed_webhook_events` + unique index on
  `stripePaymentIntentId`).
