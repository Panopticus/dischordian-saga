/* ═══════════════════════════════════════════════════════
   APPRENTICE SIGNATURE CARD — The Day-28 Forge

   At the end of the 28-day Celebration Trial, the player and
   the apprentice forge a card together. This is the
   "lightsaber moment" — the one BioWare beat the apprentice
   loop was missing. The card is a CardDefinition with the
   apprentice's id baked into its provenance, art tinted by
   archetype × doctrine × bond/corruption ratio at the moment
   of forging, and one effect-tree slot the player picked from
   4–6 doctrine-eligible options.

   Lifecycle:
     • Day 28 trial completion fires forgeSignatureCard()
     • The returned CardDefinition is registered into the
       player's personal registry (separate from the global
       expansion drops — these are unique-per-player)
     • If the apprentice falls (permadeath), the signature
       card persists. It can be revived via the Memory Card
       inheritance pipeline (apprenticeMemoryInheritance).

   The card's id is `sigcard_<apprenticeId>` — stable, so
   replay logs can reference the exact card by id.
   ═══════════════════════════════════════════════════════ */

import type { CardDefinition } from "./tcg-core/types/Card";
import type { Apprentice, ApprenticeArchetype, Rarity as ApprenticeRarity } from "./apprentices";
import { getDoctrine, type DoctrineId } from "./apprenticeDoctrines";
import { RULES_VERSION } from "./tcg-core/engine/version";

/* ─── Effect Slot Catalog ─── */

/**
 * The 6 effect slots the player can pick at the forge. Each is a
 * pre-authored effect-tree fragment compatible with the engine's
 * `op` discriminated union. Doctrines gate which slots are eligible.
 */
export type SignatureEffectSlot =
  | "battle_cry_recitation"
  | "deathwatch_lament"
  | "rebirth_silence"
  | "rally_chorus"
  | "drain_witness"
  | "stun_keyturn";

export interface EffectSlotDef {
  id: SignatureEffectSlot;
  /** Display name in the forge UI. */
  name: string;
  /** Player-facing description. */
  description: string;
  /** Which doctrines may pick this slot. */
  doctrineGate: ReadonlySet<DoctrineId>;
  /** Power cost — high-impact slots cost +1 mana on the resulting card. */
  costDelta: number;
  /** The keyword(s) the slot adds. */
  keywords: readonly CardDefinition["keywords"][number][];
  /** Power/health bias (added to base 2/2 unit). */
  statBias: { power: number; health: number };
}

export const EFFECT_SLOTS: Record<SignatureEffectSlot, EffectSlotDef> = {
  battle_cry_recitation: {
    id: "battle_cry_recitation",
    name: "Battle-Cry: Recite the Stanza",
    description: "On summon, the apprentice recites their doctrine stanza. Buffs adjacent allies.",
    doctrineGate: new Set<DoctrineId>(["compliant_mouth", "forked_path", "human_remainder"]),
    costDelta: 0,
    keywords: ["rally_buff"],
    statBias: { power: 1, health: 1 },
  },
  deathwatch_lament: {
    id: "deathwatch_lament",
    name: "Deathwatch: Lament for the Lost",
    description: "When any unit dies, the apprentice gains +1 power. They keep counting.",
    doctrineGate: new Set<DoctrineId>(["heretical_quiet", "human_remainder", "forked_path"]),
    costDelta: 1,
    keywords: ["deathwatch"],
    statBias: { power: 0, health: 2 },
  },
  rebirth_silence: {
    id: "rebirth_silence",
    name: "Rebirth: Silence Outlives Speech",
    description: "On death, leaves a 0/1 echo that hatches next turn — what they wouldn't say.",
    doctrineGate: new Set<DoctrineId>(["heretical_quiet", "human_remainder"]),
    costDelta: 1,
    keywords: ["rebirth"],
    statBias: { power: 0, health: 1 },
  },
  rally_chorus: {
    id: "rally_chorus",
    name: "Chorus: Resonance Locks Allies",
    description: "On deploy, adjacent allies gain Provoke. The chorus closes ranks.",
    doctrineGate: new Set<DoctrineId>(["compliant_mouth", "cold_hand"]),
    costDelta: 1,
    keywords: ["provoke", "rally_buff"],
    statBias: { power: 0, health: 3 },
  },
  drain_witness: {
    id: "drain_witness",
    name: "Drain: The Witness Takes",
    description: "Heals owner for 50% of damage dealt. The apprentice carries what they saw.",
    doctrineGate: new Set<DoctrineId>(["cold_hand", "forked_path"]),
    costDelta: 1,
    keywords: ["drain"],
    statBias: { power: 1, health: 0 },
  },
  stun_keyturn: {
    id: "stun_keyturn",
    name: "Stun: The Key Turns",
    description: "Attacks stun the target. The lock on their next turn is your gift.",
    doctrineGate: new Set<DoctrineId>(["cold_hand"]),
    costDelta: 2,
    keywords: ["stun"],
    statBias: { power: 1, health: 1 },
  },
};

export function eligibleEffectSlots(doctrineId: DoctrineId): EffectSlotDef[] {
  return Object.values(EFFECT_SLOTS).filter(s => s.doctrineGate.has(doctrineId));
}

/* ─── Forge ─── */

export interface ForgeInput {
  apprentice: Apprentice;
  doctrineId: DoctrineId;
  pickedSlotId: SignatureEffectSlot;
  /** Player's bond at the moment of forging. */
  bondAtForge: number;
  /** Player's corruption at the moment of forging. */
  corruptionAtForge: number;
  /** Architect Influence at moment of forging — bands the art. */
  architectInfluenceAtForge: number;
  /** Mechronis House the player belongs to (informs art band). */
  houseId: string | null;
}

export interface ForgeOutput {
  card: CardDefinition;
  /** Diagnostic info for the forge UI screen. */
  provenance: SignatureCardProvenance;
}

export interface SignatureCardProvenance {
  apprenticeId: string;
  apprenticeName: string;
  archetype: ApprenticeArchetype;
  rarity: ApprenticeRarity;
  doctrineId: DoctrineId;
  pickedSlotId: SignatureEffectSlot;
  bondAtForge: number;
  corruptionAtForge: number;
  architectInfluenceAtForge: number;
  houseId: string | null;
  forgedAt: number;
  /** True if the architect's influence captured the forge — visible in
   *  the card's hidden flavor band. The card still works, but the
   *  apprentice's voice on it isn't entirely theirs. */
  architectCoopted: boolean;
}

/**
 * Forge the apprentice's signature card. Pure function — caller persists
 * the output (player-card registry) and surfaces the provenance to the UI.
 */
export function forgeSignatureCard(input: ForgeInput): ForgeOutput {
  const { apprentice, doctrineId, pickedSlotId } = input;
  const slot = EFFECT_SLOTS[pickedSlotId];
  if (!slot.doctrineGate.has(doctrineId)) {
    throw new Error(
      `Effect slot ${pickedSlotId} is not eligible under doctrine ${doctrineId}`,
    );
  }
  const doctrine = getDoctrine(doctrineId);
  const id = `sigcard_${apprentice.id}` as CardDefinition["id"];
  const cardName = `${apprentice.name}, ${apprenticeTitle(apprentice.archetype, doctrineId)}`;

  // Stat budget — base 2/2 unit + class/archetype + doctrine + slot.
  const baseStats = computeBaseStats(apprentice, slot);
  const cost = computeCost(apprentice, slot);
  const rarity = mapApprenticeRarity(apprentice.rarity);

  const architectCoopted = input.architectInfluenceAtForge >= 60;
  const flavor = composeFlavor(
    apprentice,
    doctrine.id,
    input.bondAtForge,
    input.corruptionAtForge,
    architectCoopted,
  );

  const card: CardDefinition = {
    id,
    name: cardName,
    faction: factionForArchetype(apprentice.archetype),
    cardType: "unit",
    rarity,
    cost,
    baseStats,
    keywords: slot.keywords,
    abilities: [],
    art: signatureArtUrl(apprentice, doctrineId, input.architectInfluenceAtForge),
    flavorText: flavor,
    rulesVersion: RULES_VERSION,
    trial_categories: trialCategoriesFor(doctrineId, slot.id),
    verdict_delta: doctrineId === "heretical_quiet" ? -1 : 1,
  };

  const provenance: SignatureCardProvenance = {
    apprenticeId: apprentice.id,
    apprenticeName: apprentice.name,
    archetype: apprentice.archetype,
    rarity: apprentice.rarity,
    doctrineId,
    pickedSlotId,
    bondAtForge: input.bondAtForge,
    corruptionAtForge: input.corruptionAtForge,
    architectInfluenceAtForge: input.architectInfluenceAtForge,
    houseId: input.houseId,
    forgedAt: Date.now(),
    architectCoopted,
  };

  return { card, provenance };
}

/* ─── Helpers ─── */

function apprenticeTitle(archetype: ApprenticeArchetype, doctrineId: DoctrineId): string {
  const titles: Record<ApprenticeArchetype, string> = {
    zealot: "the True", ghost: "the Watcher",
    scholar: "the Reader", revenant: "the Returned",
    artisan: "the Maker", oracle: "the Half-Seer",
    wanderer: "the Restless", martyr: "the Given",
    heretic: "the Asking", jester: "the Mask",
    sentinel: "the Held Line", prodigal: "the Returned-Without",
  };
  const doctrineSuffix: Record<DoctrineId, string> = {
    compliant_mouth: " (Choirvoice)",
    forked_path: " (Hinged)",
    cold_hand: " (Locksmith)",
    heretical_quiet: " (Withheld)",
    human_remainder: " (Remainder)",
  };
  return titles[archetype] + doctrineSuffix[doctrineId];
}

function computeBaseStats(
  apprentice: Apprentice,
  slot: EffectSlotDef,
): { power: number; health: number } {
  const rarityFloor: Record<ApprenticeRarity, number> = {
    common: 0, uncommon: 0, rare: 1, epic: 1, mythic: 2,
  };
  const floor = rarityFloor[apprentice.rarity];
  return {
    power: 2 + slot.statBias.power + floor,
    health: 2 + slot.statBias.health + floor,
  };
}

function computeCost(apprentice: Apprentice, slot: EffectSlotDef): number {
  const rarityCost: Record<ApprenticeRarity, number> = {
    common: 2, uncommon: 2, rare: 3, epic: 3, mythic: 4,
  };
  return Math.max(1, rarityCost[apprentice.rarity] + slot.costDelta);
}

function mapApprenticeRarity(r: ApprenticeRarity): CardDefinition["rarity"] {
  const map: Record<ApprenticeRarity, CardDefinition["rarity"]> = {
    common: "common", uncommon: "uncommon", rare: "rare",
    epic: "epic", mythic: "legendary",
  };
  return map[r];
}

function factionForArchetype(archetype: ApprenticeArchetype): CardDefinition["faction"] {
  // Apprentices map onto the 'neutral' faction by default — they're
  // not native to any of the canonical factions until deployed.
  // Heretic & Ghost lean Insurgency; Zealot & Sentinel lean Architect.
  const map: Partial<Record<ApprenticeArchetype, CardDefinition["faction"]>> = {
    heretic: "insurgency",
    ghost: "insurgency",
    zealot: "architect",
    sentinel: "architect",
  };
  return map[archetype] ?? "neutral";
}

function signatureArtUrl(
  apprentice: Apprentice,
  doctrineId: DoctrineId,
  architectInfluence: number,
): string {
  // The art system isn't authored per signature card — there's no
  // pre-rendered art for every (archetype × doctrine × influence)
  // tuple. We point at a procedural-tint base art and pass the
  // recipe in the URL fragment for the renderer to apply at display
  // time. Renderer reads the fragment and tints accordingly.
  const motif = getDoctrine(doctrineId).signatureMotif;
  const tint = getDoctrine(doctrineId).signatureColorBand.replace("#", "");
  const influence = Math.min(100, Math.max(0, architectInfluence));
  return `art/cards/signature/${apprentice.archetype}_${motif}.webp#tint=${tint}&influence=${influence}`;
}

function composeFlavor(
  apprentice: Apprentice,
  doctrineId: DoctrineId,
  bond: number,
  corruption: number,
  architectCoopted: boolean,
): string {
  const ratio = bond - corruption;
  if (architectCoopted) {
    return `"${apprentice.name} graduated. The chorus thanks you for the addition." — Architect's commendation, unread.`;
  }
  if (ratio >= 50) {
    return `"They graduated as themselves. They graduated also as yours. They are harder to lose than you knew." — your forge log, Day 28.`;
  }
  if (ratio <= -20) {
    return `"They graduated. You signed the diploma without looking up. Neither of you said the other's name." — forge log, Day 28.`;
  }
  return `"They graduated. The forge cooled before either of you spoke. You both spoke first." — forge log, Day 28.`;
}

function trialCategoriesFor(
  doctrineId: DoctrineId,
  slotId: SignatureEffectSlot,
): CardDefinition["trial_categories"] {
  // Sorted in canonical order per CLAUDE.md (confession < defensive
  // < evidence < narrative < offensive < reactive).
  const cats = new Set<NonNullable<CardDefinition["trial_categories"]>[number]>();
  if (slotId === "rally_chorus" || slotId === "rebirth_silence") cats.add("defensive");
  if (slotId === "battle_cry_recitation") cats.add("narrative");
  if (slotId === "drain_witness") cats.add("evidence");
  if (slotId === "stun_keyturn") cats.add("reactive");
  if (slotId === "deathwatch_lament") cats.add("narrative");
  if (doctrineId === "heretical_quiet") cats.add("confession");
  // Sort canonical
  const order: Record<NonNullable<CardDefinition["trial_categories"]>[number], number> = {
    confession: 0, defensive: 1, evidence: 2, narrative: 3, offensive: 4, reactive: 5,
  };
  return [...cats].sort((a, b) => order[a] - order[b]);
}

/**
 * The signature card's id pattern — used by the player-card registry
 * to look it up from the apprentice id, and by replay logs to pin the
 * card across runs.
 */
export function signatureCardId(apprenticeId: string): string {
  return `sigcard_${apprenticeId}`;
}
