/* ═══════════════════════════════════════════════════════
   APPRENTICE GIFTS — gift category resolution per archetype

   Reads from APPRENTICE_IDENTITIES (likes / dislikes / wants
   / avoids) and exposes a single `evaluateGift()` helper the
   gift UI calls when the player offers an item to a crew
   member of a given archetype.

   Outcomes:
    - "loved"     → +12 bond, +5 morale, gift consumed
    - "liked"     → +6 bond, gift consumed
    - "neutral"   → +1 bond, gift returned (no consume)
    - "disliked"  → -6 bond, gift consumed
    - "loathed"   → -12 bond, -5 morale, gift consumed,
                     opens a tension scene in the Commons

   The gift catalog (item ids → categories) is intentionally
   small and lore-tagged — extend in a later authoring pass.
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";
import { APPRENTICE_IDENTITIES } from "./apprenticeIdentity";

export type GiftReaction = "loved" | "liked" | "neutral" | "disliked" | "loathed";

export interface GiftCatalogEntry {
  /** Stable item id (cross-references existing inventory schemas). */
  itemId: string;
  /** Human-readable label for UIs. */
  label: string;
  /** Tag list — matched against archetype identity likes/dislikes. */
  tags: readonly string[];
  /** Optional rarity hint (drives bond delta multiplier). */
  rarity?: "common" | "uncommon" | "rare" | "legendary";
}

/* ─── GIFT CATALOG (seed; expand in authoring pass) ───
   Item ids match the like/dislike tags declared in
   APPRENTICE_IDENTITIES so a per-archetype liked tag is
   guaranteed to have at least one corresponding catalog
   entry. Authoring passes can add richer multi-tag items
   later; the parity gate just requires coverage. */

export const GIFT_CATALOG: readonly GiftCatalogEntry[] = [
  /* Zealot */
  { itemId: "devotional_text", label: "Devotional Text", tags: ["devotional_text", "scripture"], rarity: "uncommon" },
  { itemId: "engraved_sigil", label: "Engraved Sigil", tags: ["engraved_sigil", "ritual_object"], rarity: "uncommon" },
  { itemId: "red_candle", label: "Red Candle", tags: ["red_candle", "ritual_object"], rarity: "common" },
  { itemId: "heretical_pamphlet", label: "Heretical Pamphlet", tags: ["heretical_pamphlet", "dissent"], rarity: "uncommon" },
  { itemId: "bourbon", label: "Bottle of Bourbon", tags: ["bourbon", "informal"], rarity: "common" },
  { itemId: "lottery_ticket", label: "Lottery Ticket", tags: ["lottery_ticket", "chance"], rarity: "common" },

  /* Ghost */
  { itemId: "silenced_recorder", label: "Silenced Recorder", tags: ["silenced_recorder", "private"], rarity: "uncommon" },
  { itemId: "shadow_cloak", label: "Shadow Cloak", tags: ["shadow_cloak", "private"], rarity: "rare" },
  { itemId: "untraceable_coin", label: "Untraceable Coin", tags: ["untraceable_coin", "private"], rarity: "uncommon" },
  { itemId: "spotlight", label: "Spotlight Module", tags: ["spotlight", "exposure"], rarity: "uncommon" },
  { itemId: "official_commendation", label: "Official Commendation", tags: ["official_commendation", "exposure"], rarity: "uncommon" },
  { itemId: "uniform", label: "Standard Uniform", tags: ["uniform", "exposure"], rarity: "common" },

  /* Scholar */
  { itemId: "rare_codex", label: "Rare Codex", tags: ["rare_codex", "scripture"], rarity: "rare" },
  { itemId: "field_microscope", label: "Field Microscope", tags: ["field_microscope", "tool"], rarity: "uncommon" },
  { itemId: "annotated_manuscript", label: "Annotated Manuscript", tags: ["annotated_manuscript", "scholarship"], rarity: "rare" },
  { itemId: "folksy_advice", label: "Pamphlet of Folksy Advice", tags: ["folksy_advice", "dismissive"], rarity: "common" },
  { itemId: "intuition_over_evidence", label: "Treatise on Intuition", tags: ["intuition_over_evidence", "dismissive"], rarity: "common" },
  { itemId: "round_numbers", label: "Round-Numbers Almanac", tags: ["round_numbers", "approximation"], rarity: "common" },

  /* Revenant */
  { itemId: "grave_soil", label: "Vial of Grave Soil", tags: ["grave_soil", "memorial"], rarity: "uncommon" },
  { itemId: "old_coin", label: "Old Coin", tags: ["old_coin", "memorial"], rarity: "common" },
  { itemId: "iron_lock", label: "Iron Lock", tags: ["iron_lock", "permanence"], rarity: "uncommon" },
  { itemId: "fresh_flowers", label: "Fresh Flowers", tags: ["fresh_flowers", "performative"], rarity: "common" },
  { itemId: "celebration_music", label: "Celebration Music Disc", tags: ["celebration_music", "performative"], rarity: "common" },
  { itemId: "second_chances_offered_freely", label: "'Second Chance' Pamphlet", tags: ["second_chances_offered_freely", "performative"], rarity: "common" },

  /* Artisan */
  { itemId: "rare_alloy", label: "Rare Alloy Bar", tags: ["rare_alloy", "raw_material"], rarity: "rare" },
  { itemId: "calibration_jig", label: "Calibration Jig", tags: ["calibration_jig", "tool"], rarity: "uncommon" },
  { itemId: "single_source_pigment", label: "Single-Source Pigment", tags: ["single-source_pigment", "raw_material"], rarity: "rare" },
  { itemId: "mass_produced_tool", label: "Mass-Produced Tool", tags: ["mass_produced_tool", "shoddy"], rarity: "common" },
  { itemId: "approximation_kit", label: "Approximation Kit", tags: ["approximation", "shoddy"], rarity: "common" },
  { itemId: "rushed_work", label: "Rushed Commission", tags: ["rushed_work", "shoddy"], rarity: "common" },

  /* Oracle */
  { itemId: "unread_letter", label: "Unread Letter", tags: ["unread_letter", "omen"], rarity: "uncommon" },
  { itemId: "fogged_mirror", label: "Fogged Mirror", tags: ["fogged_mirror", "omen"], rarity: "uncommon" },
  { itemId: "blank_dice", label: "Blank Dice", tags: ["blank_dice", "omen"], rarity: "common" },
  { itemId: "confirmed_prediction", label: "Confirmed Prediction Slip", tags: ["confirmed_prediction", "specifics"], rarity: "uncommon" },
  { itemId: "calendar", label: "Annual Calendar", tags: ["calendar", "specifics"], rarity: "common" },
  { itemId: "appointment_card", label: "Appointment Card", tags: ["appointment_card", "specifics"], rarity: "common" },

  /* Wanderer */
  { itemId: "star_chart", label: "Star Chart", tags: ["star_chart", "map"], rarity: "uncommon" },
  { itemId: "foreign_coin", label: "Foreign Coin", tags: ["foreign_coin", "travel"], rarity: "common" },
  { itemId: "travel_journal", label: "Travel Journal", tags: ["travel_journal", "story"], rarity: "uncommon" },
  { itemId: "lease_agreement", label: "Lease Agreement", tags: ["lease_agreement", "settled"], rarity: "common" },
  { itemId: "season_subscription", label: "Season Subscription", tags: ["season_subscription", "settled"], rarity: "common" },
  { itemId: "anchor_tattoo", label: "Anchor Tattoo Voucher", tags: ["anchor_tattoo", "settled"], rarity: "common" },

  /* Martyr */
  { itemId: "bandage_kit", label: "Bandage Kit", tags: ["bandage_kit", "small_kindness"], rarity: "common" },
  { itemId: "borrowed_jacket", label: "Borrowed Jacket", tags: ["borrowed_jacket", "small_kindness"], rarity: "common" },
  { itemId: "letter_to_no_one", label: "Letter Addressed to No One", tags: ["letter_addressed_to_no_one", "anonymous"], rarity: "uncommon" },
  { itemId: "selfishness_lessons", label: "Selfishness Lessons", tags: ["selfishness_lessons", "self-care"], rarity: "common" },
  { itemId: "self_help_book", label: "Self-Help Book", tags: ["self_help_book", "self-care"], rarity: "common" },
  { itemId: "mirror", label: "Mirror", tags: ["mirror", "self-care"], rarity: "common" },

  /* Heretic */
  { itemId: "banned_text", label: "Banned Text", tags: ["banned_text", "dissent"], rarity: "rare" },
  { itemId: "underground_zine", label: "Underground Zine", tags: ["underground_zine", "dissent"], rarity: "uncommon" },
  { itemId: "blasphemy_live", label: "Blasphemy Recorded Live", tags: ["blasphemy_recorded_live", "dissent"], rarity: "rare" },
  { itemId: "loyalty_oath", label: "Loyalty Oath Document", tags: ["loyalty_oath", "orthodoxy"], rarity: "uncommon" },

  /* Jester */
  { itemId: "whoopee_cushion", label: "Whoopee Cushion", tags: ["whoopee_cushion", "comedy"], rarity: "common" },
  { itemId: "punchline_book", label: "Book of Punchlines", tags: ["punchline_book", "comedy"], rarity: "common" },
  { itemId: "mismatched_socks", label: "Mismatched Socks", tags: ["mismatched_socks", "comedy"], rarity: "common" },
  { itemId: "sincerity_award", label: "Sincerity Award", tags: ["sincerity_award", "earnest"], rarity: "uncommon" },
  { itemId: "earnest_apology", label: "Earnest Apology Card", tags: ["earnest_apology", "earnest"], rarity: "common" },
  { itemId: "moment_of_silence", label: "Moment-of-Silence Token", tags: ["moment_of_silence", "earnest"], rarity: "common" },

  /* Sentinel */
  { itemId: "watch_log", label: "Watch Log", tags: ["watch_log", "post_duty"], rarity: "common" },
  { itemId: "boot_polish", label: "Boot Polish Kit", tags: ["boot_polish", "post_duty"], rarity: "common" },
  { itemId: "sealed_perimeter_alarm", label: "Sealed Perimeter Alarm", tags: ["sealed_perimeter_alarm", "post_duty"], rarity: "uncommon" },
  { itemId: "off_duty_invitation", label: "Off-Duty Invitation", tags: ["off-duty_invitation", "abandonment"], rarity: "common" },
  { itemId: "celebration_drink", label: "Celebration Drink", tags: ["celebration_drink", "abandonment"], rarity: "common" },
  { itemId: "casual_conversation", label: "Casual-Conversation Recording", tags: ["casual_conversation", "abandonment"], rarity: "common" },

  /* Prodigal */
  { itemId: "return_ticket", label: "Return Ticket", tags: ["return_ticket", "second_chance"], rarity: "uncommon" },
  { itemId: "old_address_book", label: "Old Address Book", tags: ["old_address_book", "second_chance"], rarity: "common" },
  { itemId: "second_chance_voucher", label: "Second-Chance Voucher", tags: ["second_chance_voucher", "second_chance"], rarity: "common" },
  { itemId: "welcome_home_banner", label: "Welcome-Home Banner", tags: ["welcome_home_banner", "performative"], rarity: "common" },
  { itemId: "first_meeting_invitation", label: "First-Meeting Invitation", tags: ["first_meeting_invitation", "performative"], rarity: "common" },
  { itemId: "fresh_start_speech", label: "Fresh-Start Speech", tags: ["fresh_start_speech", "performative"], rarity: "common" },
];

/** Index by itemId for O(1) lookup. */
const CATALOG_INDEX = new Map<string, GiftCatalogEntry>(
  GIFT_CATALOG.map((g) => [g.itemId, g]),
);

/* ─── EVALUATION ─── */

export interface GiftEvaluation {
  reaction: GiftReaction;
  bondDelta: number;
  moraleDelta: number;
  /** Free-form reason string suitable for UI surfacing. */
  reason: string;
}

const RARITY_MULTIPLIER: Record<NonNullable<GiftCatalogEntry["rarity"]>, number> = {
  common: 1,
  uncommon: 1.25,
  rare: 1.6,
  legendary: 2.2,
};

/** Evaluate a gift offered to an apprentice of the given archetype. */
export function evaluateGift(
  archetype: ApprenticeArchetype,
  itemId: string,
): GiftEvaluation {
  const item = CATALOG_INDEX.get(itemId);
  if (!item) {
    return {
      reaction: "neutral",
      bondDelta: 0,
      moraleDelta: 0,
      reason: "Unknown item — they accept it without comment.",
    };
  }
  const identity = APPRENTICE_IDENTITIES[archetype];
  const liked = item.tags.some((t) => identity.likes.includes(t));
  const disliked = item.tags.some((t) => identity.dislikes.includes(t));
  const wanted = item.tags.some((t) => identity.wants.includes(t));
  const avoided = item.tags.some((t) => identity.avoids.includes(t));

  const mult = RARITY_MULTIPLIER[item.rarity ?? "common"];

  if (avoided && disliked) {
    return {
      reaction: "loathed",
      bondDelta: Math.round(-12 * mult),
      moraleDelta: -5,
      reason: `Loathed — ${item.label} hits two of their no-go tags.`,
    };
  }
  if (wanted && liked) {
    return {
      reaction: "loved",
      bondDelta: Math.round(12 * mult),
      moraleDelta: 5,
      reason: `Loved — ${item.label} answers something they actually wanted.`,
    };
  }
  if (liked) {
    return {
      reaction: "liked",
      bondDelta: Math.round(6 * mult),
      moraleDelta: 0,
      reason: `Liked — ${item.label} fits.`,
    };
  }
  if (disliked) {
    return {
      reaction: "disliked",
      bondDelta: Math.round(-6 * mult),
      moraleDelta: 0,
      reason: `Disliked — ${item.label} hits a known dislike.`,
    };
  }
  return {
    reaction: "neutral",
    bondDelta: 1,
    moraleDelta: 0,
    reason: `Neutral — ${item.label} doesn't move them either way.`,
  };
}

/** Returns the union of every tag that any archetype likes/dislikes/etc.
 *  Used by the parity gate to confirm the catalog covers every one. */
export function allReferencedTags(): Set<string> {
  const out = new Set<string>();
  for (const id of Object.values(APPRENTICE_IDENTITIES)) {
    id.likes.forEach((t) => out.add(t));
    id.dislikes.forEach((t) => out.add(t));
    id.wants.forEach((t) => out.add(t));
    id.avoids.forEach((t) => out.add(t));
  }
  return out;
}

/** Coverage by archetype — count of catalog items that reference at
 *  least one of each archetype's like/dislike tags. */
export function giftCoverageByArchetype(): Record<ApprenticeArchetype, number> {
  const out = {} as Record<ApprenticeArchetype, number>;
  for (const arch of Object.keys(APPRENTICE_IDENTITIES) as ApprenticeArchetype[]) {
    const ident = APPRENTICE_IDENTITIES[arch];
    const tagged = ident.likes.concat(ident.dislikes);
    out[arch] = GIFT_CATALOG.filter((g) =>
      g.tags.some((t) => tagged.includes(t)),
    ).length;
  }
  return out;
}
