/**
 * Engineer's Log — DGRS Lions Club rental-armor explainer.
 *
 * One log entry that fires the first time a player views a rental
 * suit piece. The Engineer lays out the rule in his voice — gear
 * like this is a lease, service is the receipt, the mask comes
 * home when the membership comes home — and drops a single
 * freestyle verse on the theme of rent vs. ownership.
 *
 * The accompanying UI prose (`ENGINEER_NOTE_LIONS_CLUB`) lives in
 * apps/shared/lionsClub.ts alongside the data model. This file is
 * strictly the voice-over record for the FNORD-23 browser.
 */

import type { EngineerLog } from "./engineerLogs";

export const LOG_MEMBERSHIP_LIONSCLUB: EngineerLog = {
  id: "log_membership_lionsclub",
  logNumber: 71,
  title: "Log 071 — You Don't Own The Lion",
  dateStamp: "Day 0001, Post-Fall",
  unlockCondition: { kind: "milestone", value: "first-rental-suit-view" },
  mechanicExplanation:
    "Rental suits (seasonal, seasonal-event, annual-vote, Iron Clad Lions) require an active DGRS Lions Club membership to equip. Memberships renew annually on June 30 and are prorated from the join date. Lapse = the armor returns to the chapter until renewal.",
  linkedCardDefIds: ["s1_char_010_iron_lion", "s1_char_105_iron_lion"],
  transcript: `
[SPOKEN]
Log seventy-one. The armor is a lease. Write that down.

I watched a kid try to pawn a Lion's mask for scrip outside the
chapter gate and the mane knew. The gold went dull in the light.
The plates went heavy. The name-etchings closed up like a shop at
sundown. The mask remembered it wasn't hers.

Membership works. No membership, the suit goes cold. That's not
design. That's physics. It's how the thing was built — the armor
checks the pledge. Real ink. Real dues. Real June renewal. The
twenty-five at the top of every hundred? That flips straight to
LCIF in your name. The Order of the Dreamer writes it down.

[FREESTYLE]
You don't own the Lion, you just carry it a while,
every dent is a kneel, every scratch is a mile,
renew in June or the mane goes quiet,
no named armor in the market, don't you even try it —
pay the dues, say the pledge, sign the line in ink,
twenty-five to LCIF every hundred, that's the link,
service is the rent, the receipt is the work,
and the Lion remembers every name on every clerk.

[SPOKEN]
That's the rule. Gear like this is a lease. Sacrifice is the fee.
Service is the receipt. The mask comes home when your membership
comes home.

We serve.

— The Engineer
`.trim(),
  musicPrompt: {
    channelId: "outergroove",
    trackId: "og_071",
    tempoBpm: 88,
    keySignature: "F minor",
    coreInstrumentation:
      "Standup bass on downbeats, brushed drums, vintage Wurlitzer electric piano, muted trumpet fills, soft-mallet vibraphone pad, a single gospel-organ chord held under the freestyle.",
    moodReference:
      "D'Angelo 'Devil's Pie' meets Curtis Mayfield's 'People Get Ready.' Patient, liturgical, a groove that keeps its word.",
    lyricalContext:
      "Engineer on rental-armor rules and the DGRS Lions Club membership. Tax honesty over swagger — the man loves a covenant.",
    durationTargetSeconds: 105,
  },
};

export const ENGINEER_LOGS_LIONS_CLUB: readonly EngineerLog[] = Object.freeze([
  LOG_MEMBERSHIP_LIONSCLUB,
]);
