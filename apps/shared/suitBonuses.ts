/* ═══════════════════════════════════════════════════════
   SUIT BONUSES — 2 / 4 / 7 / 10 ladder (plan §G.6)

   Data-only registry. Every set has four bonus tiers that
   apply once the matching number of same-set pieces are
   equipped. Systems that care (TCG encounter init, Ark
   events, crafting bench, etc.) read from here rather than
   hard-coding per-set logic.

   Two exemplary sets are fleshed out per the plan — the
   Oracle Regalia and the Quarchon Exoframe. The other 16
   sets ship with placeholder ladders that follow the same
   shape so the wiring is live today; final bonus copy is
   a narrative-team follow-up (tracked in the plan's
   §G follow-up list).
   ═══════════════════════════════════════════════════════ */

import { getAllSetIds } from "./suitSets";

/** Piece-count threshold for the tier to apply. */
export type BonusTierCount = 2 | 4 | 7 | 10;

export const BONUS_TIERS: readonly BonusTierCount[] = [2, 4, 7, 10] as const;

/**
 * Systems the bonus applies to. Intentionally a string-literal union
 * so downstream readers (encounter.ts, arkEventHandler.ts, crafting,
 * etc.) can narrow on `target` without coupling to implementation.
 */
export type BonusTarget =
  | "tcg_encounter"
  | "boss_encounter"
  | "ark_event_roll"
  | "dialog_check"
  | "crafting_success"
  | "shop_price"
  | "dice_roll"
  | "casino_cap"
  | "cutscene_silhouette";

export interface BonusEffect {
  /** Which subsystem picks this up via the equip:loadout:changed bus. */
  target: BonusTarget;
  /** Human-readable label for UI (short form). */
  label: string;
  /** Longer description for tooltips / codex entries. */
  description: string;
  /**
   * Optional numeric payload. Most bonuses are readable strings; this
   * field lets callers apply a delta without re-parsing the label.
   */
  value?: number;
}

export interface BonusTier {
  pieces: BonusTierCount;
  effects: readonly BonusEffect[];
}

export interface SuitBonusLadder {
  setId: string;
  tiers: readonly BonusTier[];
}

/* ─── Fleshed-out exemplars (plan §G.6 samples) ─── */

const REGALIA_OF_THE_SEEING_STYLUS: SuitBonusLadder = {
  setId: "regalia-of-the-seeing-stylus",
  tiers: [
    {
      pieces: 2,
      effects: [
        {
          target: "tcg_encounter",
          label: "+10% divination accuracy",
          description: "+10% accuracy on divination cards; see one extra card in opponent's draw.",
          value: 0.1,
        },
      ],
    },
    {
      pieces: 4,
      effects: [
        {
          target: "tcg_encounter",
          label: "Foresee",
          description: "Once per encounter, preview the top of the encounter deck.",
        },
      ],
    },
    {
      pieces: 7,
      effects: [
        {
          target: "ark_event_roll",
          label: "Ark auto-crit on 15+",
          description: "Ark-event rolls auto-crit on nat-15 or higher (instead of nat-20).",
          value: 15,
        },
      ],
    },
    {
      pieces: 10,
      effects: [
        {
          target: "dice_roll",
          label: "Inscribed Certainty",
          description:
            "Once per day, replace any die roll anywhere in the game with its average. \"The stylus was already writing this.\"",
        },
      ],
    },
  ],
};

const CLOCKWORK_EXOFRAME: SuitBonusLadder = {
  setId: "clockwork-exoframe",
  tiers: [
    {
      pieces: 2,
      effects: [
        {
          target: "crafting_success",
          label: "+5% craft success · same-element −1 cost",
          description: "Crafting success +5%; same-element materials cost -1.",
          value: 0.05,
        },
      ],
    },
    {
      pieces: 4,
      effects: [
        {
          target: "boss_encounter",
          label: "Self-repair hum",
          description: "Passive 1 HP/round out of combat (self-repair hum).",
          value: 1,
        },
      ],
    },
    {
      pieces: 7,
      effects: [
        {
          target: "ark_event_roll",
          label: "Machine-route override",
          description: "Open a blocked Machine-only Ark route once without meeting its prerequisite.",
        },
      ],
    },
    {
      pieces: 10,
      effects: [
        {
          target: "boss_encounter",
          label: "First Chassis Memory",
          description:
            "The Exoframe replays the last fatal blow taken this session and voids it. Once per act.",
        },
      ],
    },
  ],
};

/* ─── Remaining class sets (4) ─── */

const PRESSURE_LOOM_HARNESS: SuitBonusLadder = {
  setId: "pressure-loom-harness",
  tiers: [
    { pieces: 2, effects: [{ target: "crafting_success", label: "+5% craft success", description: "Crafting success chance +5% on all benches.", value: 0.05 }] },
    { pieces: 4, effects: [{ target: "crafting_success", label: "Ruined-draft refund", description: "Failed crafts return 75% of their materials instead of 50%.", value: 0.75 }] },
    { pieces: 7, effects: [{ target: "ark_event_roll", label: "Engineer's eye", description: "Ark-event salvage rolls are capped at no lower than the median outcome.", value: 0.5 }] },
    { pieces: 10, effects: [{ target: "crafting_success", label: "Loom-Remembers", description: "Once per act, re-roll a failed craft without consuming materials.", value: 1 }] },
  ],
};

const BLACK_CREPE_WEAVE: SuitBonusLadder = {
  setId: "black-crepe-weave",
  tiers: [
    { pieces: 2, effects: [{ target: "tcg_encounter", label: "+5% crit chance", description: "TCG + boss encounters: +5% chance to crit with stealth-tagged cards.", value: 0.05 }] },
    { pieces: 4, effects: [{ target: "dialog_check", label: "Silent entry", description: "Unlocks a 'slip past' dialog line in infiltration scenes that skip one combat encounter per act.", value: 1 }] },
    { pieces: 7, effects: [{ target: "boss_encounter", label: "First-strike doctrine", description: "The first attack of any encounter bypasses 50% of the target's armor.", value: 0.5 }] },
    { pieces: 10, effects: [{ target: "boss_encounter", label: "One clean contract", description: "Once per act, the first kill of an encounter is guaranteed without retaliation.", value: 1 }] },
  ],
};

const BULWARK_OF_THE_EIGHTH_COLUMN: SuitBonusLadder = {
  setId: "bulwark-of-the-eighth-column",
  tiers: [
    { pieces: 2, effects: [{ target: "boss_encounter", label: "+5% HP", description: "+5% maximum health in every combat mode.", value: 0.05 }] },
    { pieces: 4, effects: [{ target: "boss_encounter", label: "Hold the line", description: "Damage taken while stationary is reduced by 10%.", value: 0.1 }] },
    { pieces: 7, effects: [{ target: "ark_event_roll", label: "Fortified position", description: "One Ark-event defense roll per act auto-succeeds.", value: 1 }] },
    { pieces: 10, effects: [{ target: "boss_encounter", label: "Eighth-Column Oath", description: "Once per act, the first blow that would drop the operative below 1 HP is voided.", value: 1 }] },
  ],
};

const LOW_PROFILE_TAILORING: SuitBonusLadder = {
  setId: "low-profile-tailoring",
  tiers: [
    { pieces: 2, effects: [{ target: "shop_price", label: "Same-set vendor discount", description: "Spy-faction vendors offer a 5% discount on same-set pieces.", value: 0.05 }] },
    { pieces: 4, effects: [{ target: "dialog_check", label: "Hidden hand", description: "Reveals one extra faction tile on the Trade Empire map per act.", value: 1 }] },
    { pieces: 7, effects: [{ target: "dialog_check", label: "Plausible deniability", description: "Dialog choices that would normally set a morality flag resolve silently once per act.", value: 1 }] },
    { pieces: 10, effects: [{ target: "dialog_check", label: "Ghost in the paperwork", description: "Once per act, an infiltration check is replaced with a prewritten successful outcome.", value: 1 }] },
  ],
};

/* ─── Species sets (2 remaining; Clockwork Exoframe is exemplar above) ─── */

const ARCANE_RUNE_REGALIA: SuitBonusLadder = {
  setId: "arcane-rune-regalia",
  tiers: [
    { pieces: 2, effects: [{ target: "tcg_encounter", label: "+5% element damage", description: "+5% damage on your chosen element's card suit.", value: 0.05 }] },
    { pieces: 4, effects: [{ target: "dialog_check", label: "Runic recognition", description: "Unlocks Demagi-flavored dialog lines in infiltration + diplomacy.", value: 1 }] },
    { pieces: 7, effects: [{ target: "boss_encounter", label: "Glyph-breath", description: "On round 1 of combat, a matching-element glyph is already on the field.", value: 1 }] },
    { pieces: 10, effects: [{ target: "tcg_encounter", label: "Rune-sovereignty", description: "Once per act, cast an element-tagged card at zero mana cost.", value: 1 }] },
  ],
};

const HYBRID_VEIN_PANOPLY: SuitBonusLadder = {
  setId: "hybrid-vein-panoply",
  tiers: [
    { pieces: 2, effects: [{ target: "crafting_success", label: "Duotone synergy", description: "Crafting Ne-Yon pieces costs one fewer universal material.", value: 1 }] },
    { pieces: 4, effects: [{ target: "dialog_check", label: "Hybrid legitimacy", description: "Both Humanity- and Machine-gated dialog lines are available to the operative while this set is equipped.", value: 1 }] },
    { pieces: 7, effects: [{ target: "boss_encounter", label: "Vein-channeling", description: "Once per encounter, convert 50% of a landed hit into healing.", value: 0.5 }] },
    { pieces: 10, effects: [{ target: "boss_encounter", label: "Filigree-Living", description: "The operative cannot be silenced, muted, or narrative-gagged for the remainder of the act.", value: 1 }] },
  ],
};

/* ─── Element sets (8) ─── */

const GEOMANCERS_STRATUM: SuitBonusLadder = {
  setId: "geomancers-stratum",
  tiers: [
    { pieces: 2, effects: [{ target: "ark_event_roll", label: "Earth affinity", description: "+2 on Earth-element Ark-event rolls.", value: 2 }] },
    { pieces: 4, effects: [{ target: "boss_encounter", label: "Stratum armor", description: "Damage from physical attacks is reduced by 10%.", value: 0.1 }] },
    { pieces: 7, effects: [{ target: "ark_event_roll", label: "Ley-guidance", description: "Once per act, re-roll an Earth-element event outcome you don't like.", value: 1 }] },
    { pieces: 10, effects: [{ target: "boss_encounter", label: "Continent's-Hold", description: "Once per act, become immovable for one round — no knockback, no displacement, no forced movement.", value: 1 }] },
  ],
};

const EMBER_BELLOWS_ARRAY: SuitBonusLadder = {
  setId: "ember-bellows-array",
  tiers: [
    { pieces: 2, effects: [{ target: "ark_event_roll", label: "Fire affinity", description: "+2 on Fire-element Ark-event rolls.", value: 2 }] },
    { pieces: 4, effects: [{ target: "boss_encounter", label: "Bellows-rhythm", description: "Consecutive attacks in the same round deal +3% damage each, stacking.", value: 0.03 }] },
    { pieces: 7, effects: [{ target: "boss_encounter", label: "Forge-heart", description: "+8% damage while below 50% HP.", value: 0.08 }] },
    { pieces: 10, effects: [{ target: "boss_encounter", label: "Ember-Eternal", description: "Once per act, re-ignite after a lethal blow at 1 HP.", value: 1 }] },
  ],
};

const TIDE_ENGINE_CARAPACE: SuitBonusLadder = {
  setId: "tide-engine-carapace",
  tiers: [
    { pieces: 2, effects: [{ target: "ark_event_roll", label: "Water affinity", description: "+2 on Water-element Ark-event rolls.", value: 2 }] },
    { pieces: 4, effects: [{ target: "boss_encounter", label: "Pressure-plate", description: "Damage taken while over 80% HP is reduced by 15%.", value: 0.15 }] },
    { pieces: 7, effects: [{ target: "boss_encounter", label: "Tide-turn", description: "Once per encounter, negate a single debuff application.", value: 1 }] },
    { pieces: 10, effects: [{ target: "boss_encounter", label: "Engine-Roar", description: "Once per act, heal to full on a successful Water-element Ark event.", value: 1 }] },
  ],
};

const AETHERIC_DIRIGIBLE_RIG: SuitBonusLadder = {
  setId: "aetheric-dirigible-rig",
  tiers: [
    { pieces: 2, effects: [{ target: "ark_event_roll", label: "Air affinity", description: "+2 on Air-element Ark-event rolls.", value: 2 }] },
    { pieces: 4, effects: [{ target: "boss_encounter", label: "Sail-lift", description: "+10% dodge while at full HP.", value: 0.1 }] },
    { pieces: 7, effects: [{ target: "boss_encounter", label: "Altitude escape", description: "Once per encounter, cancel an enemy's charged attack by switching rooms.", value: 1 }] },
    { pieces: 10, effects: [{ target: "boss_encounter", label: "Dirigible's-Grace", description: "Once per act, one failure check is resolved as if the operative were above the engagement.", value: 1 }] },
  ],
};

const VOID_SEXTANT_ENSEMBLE: SuitBonusLadder = {
  setId: "void-sextant-ensemble",
  tiers: [
    { pieces: 2, effects: [{ target: "ark_event_roll", label: "Space affinity", description: "+2 on Space-element Ark-event rolls.", value: 2 }] },
    { pieces: 4, effects: [{ target: "dialog_check", label: "Starchart sight", description: "Reveals one extra hidden corridor per act on the ship schematic.", value: 1 }] },
    { pieces: 7, effects: [{ target: "tcg_encounter", label: "Astrolabe orientation", description: "Draw one extra card on the first turn of Space-tagged encounters.", value: 1 }] },
    { pieces: 10, effects: [{ target: "dialog_check", label: "Void-Navigation", description: "Once per act, teleport between two discovered rooms without passing through the corridors.", value: 1 }] },
  ],
};

const CHRONOMETER_LIVERY: SuitBonusLadder = {
  setId: "chronometer-livery",
  tiers: [
    { pieces: 2, effects: [{ target: "ark_event_roll", label: "Time affinity", description: "+2 on Time-element Ark-event rolls.", value: 2 }] },
    { pieces: 4, effects: [{ target: "boss_encounter", label: "Second-hand advantage", description: "Initiative rolls take the better of two rolls.", value: 1 }] },
    { pieces: 7, effects: [{ target: "dialog_check", label: "Rewind whisper", description: "Once per act, step back one dialog choice without consequence.", value: 1 }] },
    { pieces: 10, effects: [{ target: "dice_roll", label: "Chronometer's-Oath", description: "Once per act, replay the last encounter round — same seed, new actions.", value: 1 }] },
  ],
};

const DICEWRIGHTS_MOTLEY: SuitBonusLadder = {
  setId: "dicewrights-motley",
  tiers: [
    { pieces: 2, effects: [{ target: "dice_roll", label: "Tie-breaker favor", description: "+1 on tied dice outcomes across the game.", value: 1 }] },
    { pieces: 4, effects: [{ target: "casino_cap", label: "Dicewright's door", description: "Opens the Degen's Casino VIP door — the room still exists only on the §B map when this is set.", value: 1 }] },
    { pieces: 7, effects: [{ target: "casino_cap", label: "Bankroll unchained", description: "Removes per-game bankroll sink caps inside Degen's Casino.", value: 1 }] },
    { pieces: 10, effects: [{ target: "dice_roll", label: "Motley-Laughter", description: "Once per day, reroll any die anywhere in the game.", value: 1 }] },
  ],
};

const NULL_WEAVER_MANTLE: SuitBonusLadder = {
  setId: "null-weaver-mantle",
  tiers: [
    { pieces: 2, effects: [{ target: "ark_event_roll", label: "Reality affinity", description: "+2 on Reality-element Ark-event rolls.", value: 2 }] },
    { pieces: 4, effects: [{ target: "dialog_check", label: "Unseen seam", description: "Unlocks a dialog option that bypasses any morality-alignment gate once per act.", value: 1 }] },
    { pieces: 7, effects: [{ target: "boss_encounter", label: "Fracture-weave", description: "Once per encounter, turn a landed hit into a miss.", value: 1 }] },
    { pieces: 10, effects: [{ target: "dialog_check", label: "Null-Thread", description: "Once per act, refuse a narrative outcome — the scene resolves to the quieter of its two endings.", value: 1 }] },
  ],
};

/* ─── Foundation sets (2) ─── */

const THE_MOURNERS_COAT: SuitBonusLadder = {
  setId: "the-mourners-coat",
  tiers: [
    { pieces: 2, effects: [{ target: "dialog_check", label: "Humanity's-remembrance", description: "Trust gains with Humanity-aligned NPCs are +10%.", value: 0.1 }] },
    { pieces: 4, effects: [{ target: "tcg_encounter", label: "Locket-shield", description: "The first hit of each encounter deals 25% less damage.", value: 0.25 }] },
    { pieces: 7, effects: [{ target: "dialog_check", label: "Mourner's-Voice", description: "Unlocks Humanity-only dialog choices in every scripted-tree act.", value: 1 }] },
    { pieces: 10, effects: [{ target: "boss_encounter", label: "Mourning-Is-Armor", description: "Once per act, the operative refuses to die once while carrying an active grief-beat flag.", value: 1 }] },
  ],
};

const THE_FIRST_CHASSIS: SuitBonusLadder = {
  setId: "the-first-chassis",
  tiers: [
    { pieces: 2, effects: [{ target: "boss_encounter", label: "Plating-regulation", description: "Armor is treated as 5% higher for damage reduction purposes.", value: 0.05 }] },
    { pieces: 4, effects: [{ target: "crafting_success", label: "Hardpoint modularity", description: "Replacing a piece of any gear slot costs half materials.", value: 0.5 }] },
    { pieces: 7, effects: [{ target: "dialog_check", label: "Chassis-authority", description: "Unlocks Machine-only dialog choices that bypass faction-trust requirements.", value: 1 }] },
    { pieces: 10, effects: [{ target: "boss_encounter", label: "Chassis-Continuity", description: "Once per act, on death, the operative's consciousness transfers to a backup chassis and resumes at 50% HP.", value: 1 }] },
  ],
};

const FLESHED_OUT: readonly SuitBonusLadder[] = [
  // Class sets
  REGALIA_OF_THE_SEEING_STYLUS,
  PRESSURE_LOOM_HARNESS,
  BLACK_CREPE_WEAVE,
  BULWARK_OF_THE_EIGHTH_COLUMN,
  LOW_PROFILE_TAILORING,
  // Species sets
  ARCANE_RUNE_REGALIA,
  CLOCKWORK_EXOFRAME,
  HYBRID_VEIN_PANOPLY,
  // Element sets
  GEOMANCERS_STRATUM,
  EMBER_BELLOWS_ARRAY,
  TIDE_ENGINE_CARAPACE,
  AETHERIC_DIRIGIBLE_RIG,
  VOID_SEXTANT_ENSEMBLE,
  CHRONOMETER_LIVERY,
  DICEWRIGHTS_MOTLEY,
  NULL_WEAVER_MANTLE,
  // Foundation sets
  THE_MOURNERS_COAT,
  THE_FIRST_CHASSIS,
];

const LADDERS: readonly SuitBonusLadder[] = (() => {
  const byId = new Map<string, SuitBonusLadder>();
  for (const l of FLESHED_OUT) byId.set(l.setId, l);
  // Every set id from the roster must have an authored ladder above —
  // FLESHED_OUT now covers all 18. The throw below keeps any future
  // roster additions loud rather than silently shipping blank effects.
  for (const setId of getAllSetIds()) {
    if (!byId.has(setId)) {
      throw new Error(
        `[suitBonuses] no ladder authored for set id "${setId}" — add it to FLESHED_OUT above`,
      );
    }
  }
  return getAllSetIds().map((id) => byId.get(id)!);
})();

/* ─── Accessors ─── */

/** Every ladder in roster order. */
export function getAllSuitBonusLadders(): readonly SuitBonusLadder[] {
  return LADDERS;
}

/** Look up a ladder by set id. Throws if the set id is unknown. */
export function getSuitBonusLadder(setId: string): SuitBonusLadder {
  const l = LADDERS.find((x) => x.setId === setId);
  if (!l) throw new Error(`[suitBonuses] unknown set id: ${setId}`);
  return l;
}

/**
 * Resolve all active effects for a given equipped-count. Effects
 * from lower tiers stack with higher tiers (a 7-piece equip earns
 * the 2pc, 4pc, AND 7pc effects). Lookup is O(tiers) — fine.
 */
export function getActiveBonusEffects(
  setId: string,
  piecesEquipped: number,
): readonly BonusEffect[] {
  const ladder = getSuitBonusLadder(setId);
  const out: BonusEffect[] = [];
  for (const tier of ladder.tiers) {
    if (piecesEquipped >= tier.pieces) {
      out.push(...tier.effects);
    }
  }
  return out;
}

/**
 * Shape of the event bus payload, per §G.6: "every system subscribes
 * to `equip:loadout:changed` and re-reads the player's active-bonus
 * list." Exported so bus emitters/consumers agree on the contract
 * without spreading this shape across the repo.
 */
export interface EquipLoadoutChangedEvent {
  /** Per-set piece counts after the equip change. */
  countsBySetId: Readonly<Record<string, number>>;
  /** Flattened list of every effect currently active across all sets. */
  activeEffects: readonly BonusEffect[];
}

/**
 * Build the equip:loadout:changed payload from a piece-count map.
 * Pure — callers do their own change-detection and fire the bus.
 */
export function buildEquipLoadoutChangedEvent(
  countsBySetId: Readonly<Record<string, number>>,
): EquipLoadoutChangedEvent {
  const active: BonusEffect[] = [];
  for (const [setId, count] of Object.entries(countsBySetId)) {
    if (count <= 0) continue;
    active.push(...getActiveBonusEffects(setId, count));
  }
  return { countsBySetId, activeEffects: active };
}
