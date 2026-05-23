/* ═══════════════════════════════════════════════════════
   NEXUS TRIAL — cosmetics registry
   docs/design/NEXUS_TRIAL_PLAN.md → Cosmetic Rewards
   docs/production/NEXUS_TRIAL_COMMISSIONS_BRIEF.md → §4

   Typed registry of all 25 cosmetics shipping with the Trial.
   Six categories per the plan; each entry carries id, name,
   category, surface, artUrl (CDN-resolved), hover text, and
   the grant trigger that determines when a player receives it.

   The Season 2 patch composer (apps/shared/seasons/season2/
   composer.ts) consumes this registry at Wave 1 to grant the
   right cosmetics per the world-state delta. The Loredex's
   cosmetic-display surfaces read from it for the cosmetic
   grid + hover tooltips.

   All asset paths resolve via assetUrl() to
   cdn/client-public/art/cosmetics/nexus_trial/.
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "@shared/lib/assetUrl";
import type { BallotKey, CompanionKey } from "./buckets";
import type { PoliticianForkResolution } from "../seasons/season2/types";
import type { TrialPhase } from "./phases";

export type CosmeticCategory =
  | "universal_commemorative"
  | "phase_pin"
  | "preparation_medal"
  | "ballot_memento"
  | "companion_romance_private"
  | "politician_fork_banner"
  | "profile_theme";

export type CosmeticSurface =
  | "avatar_item"
  | "profile_decoration"
  | "profile_banner"
  | "profile_theme"
  | "player_title";

/**
 * The trigger that grants a player this cosmetic. Each Trial
 * outcome produces a delta the cosmetic-grant pipeline reads;
 * cosmetics whose trigger matches the delta fire. Pure data —
 * the trigger is interpreted by the grant pipeline, not by the
 * cosmetic itself.
 */
export type CosmeticGrantTrigger =
  | { kind: "logged_in_during_trial" }
  | { kind: "phase_testimony"; phase: TrialPhase }
  | { kind: "preparation_mission_passed"; missionId: string }
  | { kind: "ballot_outcome"; ballotKey: BallotKey | "any" }
  | {
      kind: "companion_romance_sacrifice";
      companion: CompanionKey;
    }
  | { kind: "politician_fork"; resolution: PoliticianForkResolution }
  | { kind: "string_only" }; // COS-03 — title string, no art

export interface CosmeticDef {
  id: string;
  name: string;
  category: CosmeticCategory;
  surface: CosmeticSurface;
  /** CDN URL for the art asset. `null` for string-only cosmetics
   *  (e.g. selectable titles). */
  artUrl: string | null;
  /** Player-facing hover text. */
  hoverText: string;
  /** When the cosmetic fires. */
  grant: CosmeticGrantTrigger;
  /** Player-local visibility flag — `true` for romance privates
   *  (visible only to the player on their own profile). Default `false`. */
  privateToPlayer?: boolean;
}

const COSMETICS_LIST: readonly CosmeticDef[] = [
  /* ─── Universal commemoratives (4) ─── */
  {
    id: "cos_01_antiquarians_quill",
    name: "The Antiquarian's Quill",
    category: "universal_commemorative",
    surface: "avatar_item",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_01_antiquarians_quill.webp"),
    hoverText: "Profile decoration. Held by players who were present during any Trial phase.",
    grant: { kind: "logged_in_during_trial" },
  },
  {
    id: "cos_02_lockes_pendant",
    name: "Locke's Pendant",
    category: "universal_commemorative",
    surface: "avatar_item",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_02_lockes_pendant.webp"),
    hoverText: "She filed the world.",
    grant: { kind: "logged_in_during_trial" },
  },
  {
    id: "cos_03_witness_of_mmxxvii",
    name: "Witness of MMXXVII",
    category: "universal_commemorative",
    surface: "player_title",
    artUrl: null,
    hoverText: "Selectable title earned by every player who logged in during the Nexus Trial.",
    grant: { kind: "string_only" },
  },
  {
    id: "cos_04_ledger_theme",
    name: "Ledger Profile Theme",
    category: "profile_theme",
    surface: "profile_theme",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_04_ledger_theme/background.webp"),
    hoverText: "Parchment-and-ink Adjudicator's-bench theme. Toggleable.",
    grant: { kind: "logged_in_during_trial" },
  },

  /* ─── Phase-presence pins (6) ─── */
  {
    id: "cos_05_charge_pin",
    name: "Charge Pin",
    category: "phase_pin",
    surface: "profile_decoration",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_05_charge_pin.webp"),
    hoverText: "Granted for testimony during the Charge phase (hours 0–12).",
    grant: { kind: "phase_testimony", phase: "charge" },
  },
  {
    id: "cos_06_opening_pin",
    name: "Opening Pin",
    category: "phase_pin",
    surface: "profile_decoration",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_06_opening_pin.webp"),
    hoverText: "Granted for testimony during the Opening phase (hours 12–24).",
    grant: { kind: "phase_testimony", phase: "opening" },
  },
  {
    id: "cos_07_evidence_pin",
    name: "Evidence Pin",
    category: "phase_pin",
    surface: "profile_decoration",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_07_evidence_pin.webp"),
    hoverText: "Granted for testimony during the Evidence phase (hours 24–36).",
    grant: { kind: "phase_testimony", phase: "evidence" },
  },
  {
    id: "cos_08_cross_examination_pin",
    name: "Cross-examination Pin",
    category: "phase_pin",
    surface: "profile_decoration",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_08_cross_examination_pin.webp"),
    hoverText: "Granted for testimony during the Cross-examination phase (hours 36–48).",
    grant: { kind: "phase_testimony", phase: "cross_examination" },
  },
  {
    id: "cos_09_confession_pin",
    name: "Confession Pin",
    category: "phase_pin",
    surface: "profile_decoration",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_09_confession_pin.webp"),
    hoverText: "Granted for testimony during the Confession phase (hours 48–60).",
    grant: { kind: "phase_testimony", phase: "confession" },
  },
  {
    id: "cos_10_verdict_pin",
    name: "Verdict Pin",
    category: "phase_pin",
    surface: "profile_decoration",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_10_verdict_pin.webp"),
    hoverText: "Granted for testimony during the Verdict phase (hours 60–72).",
    grant: { kind: "phase_testimony", phase: "verdict" },
  },

  /* ─── Preparation Mission medals (5) ─── */
  {
    id: "cos_11_recovered_hand",
    name: "The Recovered Hand",
    category: "preparation_medal",
    surface: "profile_decoration",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_11_recovered_hand.webp"),
    hoverText: "Five burnt cards bound by Wraith's ribbon — Salvage mission passed.",
    grant: { kind: "preparation_mission_passed", missionId: "salvage" },
  },
  {
    id: "cos_12_filed_page",
    name: "The Filed Page",
    category: "preparation_medal",
    surface: "profile_decoration",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_12_filed_page.webp"),
    hoverText: "Locke's quill resting on a sealed page — Reverse Trial mission passed.",
    grant: { kind: "preparation_mission_passed", missionId: "reverse_trial" },
  },
  {
    id: "cos_13_substrate_bloom",
    name: "The Substrate Bloom",
    category: "preparation_medal",
    surface: "profile_decoration",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_13_substrate_bloom.webp"),
    hoverText: "A rose-and-grey fractal flower — Tribunal: Elara mission passed.",
    grant: { kind: "preparation_mission_passed", missionId: "tribunal_elara" },
  },
  {
    id: "cos_14_open_chip",
    name: "The Open Chip",
    category: "preparation_medal",
    surface: "profile_decoration",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_14_open_chip.webp"),
    hoverText: "The Human's chip, mid-handoff — The Question mission passed.",
    grant: { kind: "preparation_mission_passed", missionId: "the_question" },
  },
  {
    id: "cos_15_council_seal",
    name: "The Council Seal",
    category: "preparation_medal",
    surface: "profile_decoration",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_15_council_seal.webp"),
    hoverText: "The 24 sub-house sigils arranged as a wheel — Bidding War mission passed.",
    grant: { kind: "preparation_mission_passed", missionId: "bidding_war" },
  },

  /* ─── Ballot-winner mementos (4) — granted to ALL players regardless of vote ─── */
  {
    id: "cos_16_thumb_marked_ledger",
    name: "The Thumb-Marked Ledger",
    category: "ballot_memento",
    surface: "profile_decoration",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_16_thumb_marked_ledger.webp"),
    hoverText: "She was last seen carrying the names.",
    grant: { kind: "ballot_outcome", ballotKey: "wraith_calder" },
  },
  {
    id: "cos_17_packs_half_circle",
    name: "The Pack's Half-Circle",
    category: "ballot_memento",
    surface: "profile_decoration",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_17_packs_half_circle.webp"),
    hoverText: "He went back into Anara. The pack waited at the bench.",
    grant: { kind: "ballot_outcome", ballotKey: "lycos" },
  },
  {
    id: "cos_18_grey_helmet",
    name: "The Grey Helmet",
    category: "ballot_memento",
    surface: "avatar_item",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_18_grey_helmet.webp"),
    hoverText: "The Red Death gave her colour back to the dark. The dark accepted.",
    grant: { kind: "ballot_outcome", ballotKey: "akai_shi" },
  },
  {
    id: "cos_19_unfinished_inventory",
    name: "The Unfinished Inventory",
    category: "ballot_memento",
    surface: "profile_decoration",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_19_unfinished_inventory.webp"),
    hoverText: "She finished the inventory. She did not finish the courtesy.",
    grant: { kind: "ballot_outcome", ballotKey: "vex_solene" },
  },

  /* ─── Companion-sacrifice private cosmetics (2) — romance-gated, player-local ─── */
  {
    id: "cos_20_senate_seat",
    name: "The Senate Seat",
    category: "companion_romance_private",
    surface: "profile_decoration",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_20_senate_seat.webp"),
    hoverText: "Single seat in the Atarion Senate, dimly lit. Only you can see this.",
    grant: { kind: "companion_romance_sacrifice", companion: "elara" },
    privateToPlayer: true,
  },
  {
    id: "cos_21_the_chip",
    name: "The Chip",
    category: "companion_romance_private",
    surface: "avatar_item",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_21_the_chip.webp"),
    hoverText: "The chip from the rotunda. Glows faintly. Only you can see this.",
    grant: { kind: "companion_romance_sacrifice", companion: "human" },
    privateToPlayer: true,
  },

  /* ─── Politician-fork banners (3) ─── */
  {
    id: "cos_22_sealed_seat",
    name: "The Sealed Seat",
    category: "politician_fork_banner",
    surface: "profile_banner",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_22_sealed_seat.webp"),
    hoverText: "You closed the door before she returned.",
    grant: { kind: "politician_fork", resolution: "seat_sealed" },
  },
  {
    id: "cos_23_yellow_thread",
    name: "The Yellow Thread",
    category: "politician_fork_banner",
    surface: "profile_banner",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_23_yellow_thread.webp"),
    hoverText: "You watched her come back. You kept her bounded.",
    grant: { kind: "politician_fork", resolution: "constrained_return" },
  },
  {
    id: "cos_24_open_seat",
    name: "The Open Seat",
    category: "politician_fork_banner",
    surface: "profile_banner",
    artUrl: assetUrl("art/cosmetics/nexus_trial/cos_24_open_seat.webp"),
    hoverText: "You let her sit.",
    grant: { kind: "politician_fork", resolution: "full_return" },
  },

  /* ─── COS-25 — Ledger theme token bundle (CSS configuration) ─── */
  {
    id: "cos_25_ledger_theme_tokens",
    name: "Ledger Theme — Token Bundle",
    category: "profile_theme",
    surface: "profile_theme",
    artUrl: null, // CSS file, not art — see brief §4 final entry
    hoverText: "Token bundle for the Ledger profile theme. Loaded by Tailwind v4 @theme inline.",
    grant: { kind: "logged_in_during_trial" },
  },
];

/** Frozen registry keyed by cosmetic id. */
export const NEXUS_TRIAL_COSMETICS: Readonly<Record<string, CosmeticDef>> =
  Object.freeze(
    Object.fromEntries(COSMETICS_LIST.map((c) => [c.id, c])),
  );

/** Ordered list of all cosmetic ids. Stable across builds — useful for
 *  iteration order in UI surfaces. */
export const COSMETIC_IDS: readonly string[] = COSMETICS_LIST.map((c) => c.id);

/** Lookup helper. Returns undefined for unknown ids. */
export function cosmeticById(id: string): CosmeticDef | undefined {
  return NEXUS_TRIAL_COSMETICS[id];
}

/** Filter by category. */
export function cosmeticsByCategory(category: CosmeticCategory): CosmeticDef[] {
  return COSMETICS_LIST.filter((c) => c.category === category);
}
