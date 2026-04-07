/* ═══════════════════════════════════════════════════════
   CHRISTMAS IN JULY 2026 — EVENT CONFIGURATION
   The Degen's Casino: Gambling, Gifting, and Grace

   A 14-day seasonal event during Act III (Month 7).
   10% of all event revenue donated to LCIF.
   ═══════════════════════════════════════════════════════ */

export const CHRISTMAS_EVENT_CONFIG = {
  eventId: "christmas_in_july_2026",
  name: "Christmas in July",
  subtitle: "The Degen's Casino — Gambling, Gifting, and Grace",
  startDate: "2026-07-01T00:00:00Z",
  endDate: "2026-07-14T23:59:59Z",
  durationDays: 14,
  lcifPercentage: 0.10,
  freeTokensPerDay: 10,
  tokensPerGiftSent: 5,
  tokensPerGiftReceived: 5,
  wheelSpinCost: 5,
  crapsCost: 1, // 1 Soul Stone
  giftBoxCraftCost: 5, // Festive Tokens
} as const;
