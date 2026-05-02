/**
 * Card co-op encounter registry — Tier 3 / "Two Witnesses" lore frame.
 *
 * Each encounter pairs a 2-player party against a single AI boss.
 * Underlying engine still runs 1v1: the party shares one Side (with
 * inputs routed alternately to the same general by the WS layer) and
 * the boss occupies the other Side. The encounter definition selects:
 *
 *   - Boss general (a single card def serving as the boss's general)
 *   - Boss starting deck (preset card-id list)
 *   - Difficulty modifiers (boss HP multiplier, mana ramp)
 *   - Scripted phase triggers (HP thresholds → boss casts)
 *   - Reward bag (title, dream tokens, clue drop)
 *
 * Pure data; consumed by `apps/server/services/coopEncounterService.ts`
 * to set up matches and by the client co-op selection UI.
 */

export type CoopDifficulty = "normal" | "heroic" | "mythic";

export interface CoopPhaseTrigger {
  /** Boss HP fraction at which this phase fires (0..1, descending). */
  readonly hpFraction: number;
  /** Card ids the boss casts when entering this phase. */
  readonly castCardIds: readonly string[];
  /** Optional one-line lore beat surfaced as a Game Master comment. */
  readonly bossLine?: string;
}

export interface CoopEncounterDef {
  readonly encounterKey: string;
  readonly name: string;
  readonly description: string;
  readonly flavorText?: string;
  /** LOREDEX entity for the boss (DOC4 cross-ref). */
  readonly loredexEntityId?: string;
  /** Boss general card def id. */
  readonly bossGeneralKey: string;
  /** Boss starting deck (card def ids, in draw order). 30 cards. */
  readonly bossDeck: readonly string[];
  /** Boss HP multiplier vs the standard general HP. */
  readonly bossHpMultiplier: Record<CoopDifficulty, number>;
  /** Mana acceleration: extra mana the boss starts with. */
  readonly bossManaBonus: Record<CoopDifficulty, number>;
  /** Scripted phase triggers, ordered descending by hpFraction. */
  readonly phases: readonly CoopPhaseTrigger[];
  /** Rewards granted to every contributing party member on victory. */
  readonly rewards: {
    readonly dreamTokens: number;
    readonly titleKeyOnFirstClear?: string;
    /** Clue drop key (Tier 2B integration). */
    readonly clueDropKey?: string;
  };
}

export const COOP_ENCOUNTERS: readonly CoopEncounterDef[] = [
  {
    encounterKey: "the_warden_descends",
    name: "The Warden Descends",
    description:
      "The Architect's prison-keeper turns its eye on you. Two Witnesses must testify before the doors open.",
    flavorText:
      "The Warden does not speak. It does not need to. Every hinge is its voice.",
    loredexEntityId: "entity_38",
    bossGeneralKey: "the_warden",
    bossDeck: [
      "warden_lockstep_guard", "warden_lockstep_guard",
      "warden_iron_decree", "warden_iron_decree", "warden_iron_decree",
      "warden_panopticon_lens", "warden_panopticon_lens",
      "warden_silenced_witness", "warden_silenced_witness",
      "warden_unbreakable_chain", "warden_unbreakable_chain",
      "warden_purifying_flame",
      "warden_revoked_grace", "warden_revoked_grace",
      "warden_court_of_one",
      "warden_dread_writ", "warden_dread_writ",
      "warden_hollow_oath", "warden_hollow_oath",
      "warden_indifferent_aegis",
      "warden_iron_constabulary", "warden_iron_constabulary",
      "warden_minor_magistrate", "warden_minor_magistrate",
      "warden_lockstep_guard", "warden_iron_decree",
      "warden_silenced_witness", "warden_panopticon_lens",
      "warden_purifying_flame", "warden_court_of_one",
    ],
    bossHpMultiplier: { normal: 2.0, heroic: 3.0, mythic: 4.0 },
    bossManaBonus: { normal: 0, heroic: 1, mythic: 2 },
    phases: [
      { hpFraction: 0.66, castCardIds: ["warden_panopticon_lens"], bossLine: "The Lens turns. Be seen." },
      { hpFraction: 0.33, castCardIds: ["warden_purifying_flame"], bossLine: "Ash is also a verdict." },
      { hpFraction: 0.10, castCardIds: ["warden_court_of_one"], bossLine: "Last chamber. Final ruling." },
    ],
    rewards: {
      dreamTokens: 200,
      titleKeyOnFirstClear: "hierophant_t2",
      clueDropKey: "clue_warden_panopticon_relay",
    },
  },
  {
    encounterKey: "shadow_tongue_address",
    name: "The Shadow Tongue's Address",
    description:
      "The SVP of Communications takes the dais. Every word he speaks rewrites a card in your hand.",
    flavorText: "He smiles like a sentence ending.",
    loredexEntityId: "entity_7",
    bossGeneralKey: "shadow_tongue",
    bossDeck: [
      "tongue_revisionist_clause", "tongue_revisionist_clause",
      "tongue_unspoken_dictionary", "tongue_unspoken_dictionary",
      "tongue_silenced_chorus", "tongue_silenced_chorus",
      "tongue_subliminal_pulse",
      "tongue_idiom_shift", "tongue_idiom_shift", "tongue_idiom_shift",
      "tongue_palimpsest_proxy", "tongue_palimpsest_proxy",
      "tongue_loud_silence",
      "tongue_press_conference",
      "tongue_correction_squad", "tongue_correction_squad",
      "tongue_signal_jamming", "tongue_signal_jamming",
      "tongue_apostle_of_meaning",
      "tongue_revised_history", "tongue_revised_history",
      "tongue_press_conference",
      "tongue_phonemic_anchor", "tongue_phonemic_anchor",
      "tongue_quote_doctored", "tongue_quote_doctored",
      "tongue_silenced_chorus", "tongue_idiom_shift",
      "tongue_apostle_of_meaning", "tongue_loud_silence",
    ],
    bossHpMultiplier: { normal: 1.8, heroic: 2.6, mythic: 3.4 },
    bossManaBonus: { normal: 0, heroic: 1, mythic: 2 },
    phases: [
      { hpFraction: 0.75, castCardIds: ["tongue_idiom_shift"], bossLine: "Allow me to rephrase." },
      { hpFraction: 0.50, castCardIds: ["tongue_press_conference"], bossLine: "Take notes." },
      { hpFraction: 0.20, castCardIds: ["tongue_apostle_of_meaning"], bossLine: "I apologize for the inconvenience." },
    ],
    rewards: {
      dreamTokens: 250,
      titleKeyOnFirstClear: "shadow_tongue_t2",
      clueDropKey: "clue_unspoken_dictionary",
    },
  },
  {
    encounterKey: "warlord_three_moves_replay",
    name: "The Warlord's Three Moves (Replay)",
    description:
      "The Warlord remembers Nexon. He will remember it again. Survive until turn 6 — together.",
    flavorText: "Memetic spread. Still spreading.",
    loredexEntityId: "entity_10",
    bossGeneralKey: "warlord_zero_coop",
    bossDeck: [
      "warlord_three_moves_open", "warlord_three_moves_open",
      "warlord_lockout_charge", "warlord_lockout_charge", "warlord_lockout_charge",
      "warlord_iron_lion_envy",
      "warlord_chrono_cleanse", "warlord_chrono_cleanse",
      "warlord_combat_doctrine", "warlord_combat_doctrine",
      "warlord_disable_radio", "warlord_disable_radio",
      "warlord_overwhelm",
      "warlord_iron_horde", "warlord_iron_horde",
      "warlord_chain_reaction", "warlord_chain_reaction",
      "warlord_rage_phase",
      "warlord_burn_the_bridge",
      "warlord_iron_horde", "warlord_combat_doctrine",
      "warlord_overwhelm", "warlord_chain_reaction",
      "warlord_rage_phase", "warlord_burn_the_bridge",
      "warlord_lockout_charge", "warlord_chrono_cleanse",
      "warlord_iron_lion_envy", "warlord_three_moves_open",
      "warlord_disable_radio",
    ],
    bossHpMultiplier: { normal: 2.5, heroic: 3.5, mythic: 5.0 },
    bossManaBonus: { normal: 1, heroic: 2, mythic: 3 },
    phases: [
      { hpFraction: 0.80, castCardIds: ["warlord_three_moves_open"], bossLine: "First move. Predictable." },
      { hpFraction: 0.45, castCardIds: ["warlord_rage_phase"], bossLine: "Second move. Inevitable." },
      { hpFraction: 0.15, castCardIds: ["warlord_burn_the_bridge"], bossLine: "Third move. Final." },
    ],
    rewards: {
      dreamTokens: 300,
      titleKeyOnFirstClear: "warlord_t2",
      clueDropKey: "clue_warlord_orchestration",
    },
  },
];

const BY_KEY = new Map<string, CoopEncounterDef>(
  COOP_ENCOUNTERS.map((e) => [e.encounterKey, e]),
);

export function getCoopEncounter(encounterKey: string): CoopEncounterDef | undefined {
  return BY_KEY.get(encounterKey);
}

export function listCoopEncounters(): readonly CoopEncounterDef[] {
  return COOP_ENCOUNTERS;
}

export function maxBossHp(
  baseGeneralHp: number,
  encounter: CoopEncounterDef,
  difficulty: CoopDifficulty,
): number {
  return Math.round(baseGeneralHp * encounter.bossHpMultiplier[difficulty]);
}
