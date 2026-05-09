// apps/shared/tradeEmpire/tableDiplomacy.ts
//
// §8.2 Table Diplomacy minigame. The Court tab's signature
// interactive moment: two factions sit across a literal table; the
// player either brokers the negotiation (Act 3) or sits as one
// party (Act 4+). Each round both sides reveal a Demand card; the
// player plays a Counter card; demands resolve into treaty terms;
// terms become next season's declaration.
//
// This file ships the registries (demand cards, counter cards) and
// the pure resolution logic. The runtime sits in
// apps/server/services/tableDiplomacyService.ts and the router in
// apps/server/routers/tradeDiplomacy.ts (added in this commit).

import type { GalacticFactionId } from "../../client/src/game/tradeEmpire";

export type DemandArchetype = "territorial" | "economic" | "ideological";
export type DemandTier = "small" | "medium" | "world_shaping";

export interface DemandCard {
  cardKey: string;
  factionId: GalacticFactionId;
  archetype: DemandArchetype;
  tier: DemandTier;
  /** What the faction asks for. */
  demandText: string;
  /** What the faction will accept in exchange (the "concession"). */
  concessionLine: string;
  /** Tier weight used at scoring time. */
  tierWeight: number;
}

const TIER_WEIGHTS: Record<DemandTier, number> = {
  small: 1,
  medium: 3,
  world_shaping: 7,
};

function buildCard(
  factionId: GalacticFactionId,
  archetype: DemandArchetype,
  tier: DemandTier,
  ordinal: number,
  demandText: string,
  concessionLine: string,
): DemandCard {
  return {
    cardKey: `demand.${factionId}.${archetype}.${tier}.${ordinal}`,
    factionId,
    archetype,
    tier,
    demandText,
    concessionLine,
    tierWeight: TIER_WEIGHTS[tier],
  };
}

/**
 * 9 factions × 3 archetypes × 3 tiers × 2 cards-per-cell ≈ 162 cards.
 * Phase D ships a representative slice so the minigame is functional;
 * additional content is a writers'-room follow-up. Tests pin: every
 * faction has at least one entry per archetype+tier triplet.
 */
export const DEMAND_CARDS: ReadonlyArray<DemandCard> = [
  // --- New Babylon ---
  buildCard("new_babylon", "territorial", "small", 1,
    "Recognise the Authority's claim on the Trade Nexus customs floor.",
    "The Authority will, in writing, accept your transit papers without audit for one season."),
  buildCard("new_babylon", "territorial", "medium", 1,
    "Yield civic-engineering oversight in the lift shafts.",
    "The Ledger will favour your contract counterparties for one season."),
  buildCard("new_babylon", "territorial", "world_shaping", 1,
    "Cede a frontier sector to Authority enforcement.",
    "The Authority will defend the rest of your trade lanes at Class-A priority."),
  buildCard("new_babylon", "economic", "small", 1,
    "Pay a Ledger compliance fee, this season.",
    "The Ledger will forgo the standard audit fee on your next three contracts."),
  buildCard("new_babylon", "economic", "medium", 1,
    "Accept a Ledger lien on your Oracle futures positions.",
    "Locke will personally honour your futures payouts at face value, bypassing the spread."),
  buildCard("new_babylon", "economic", "world_shaping", 1,
    "Agree to Authority bookkeeping standards across all your sectors.",
    "Mission credit rewards permanently +10% in Authority-aligned sectors."),
  buildCard("new_babylon", "ideological", "small", 1,
    "File a public statement of Ledger primacy.",
    "Authority NPCs greet you warmly across all sectors for one season."),
  buildCard("new_babylon", "ideological", "medium", 1,
    "Sign an exclusive Authority retainer.",
    "Locke locks out two rival brokers from contracting with you for one season."),
  buildCard("new_babylon", "ideological", "world_shaping", 1,
    "Renounce the Wraith Hierophant's revival publicly.",
    "The Authority will side with you against Thaloria for the remainder of the act."),

  // --- Hierarchy ---
  buildCard("hierarchy", "territorial", "small", 1,
    "Allow Acquisitions enforcers transit through one of your routes.",
    "Acquisitions will not raid your other routes for one season."),
  buildCard("hierarchy", "territorial", "medium", 1,
    "Surrender the Trench platforms to Severance precision.",
    "Severance Division will issue you a clone-economy contract at face value."),
  buildCard("hierarchy", "territorial", "world_shaping", 1,
    "Open the Hell Gate corridor.",
    "Drael'Mon will personally vouch for your safe passage through any Hierarchy sector."),
  buildCard("hierarchy", "economic", "small", 1,
    "Accept a Severance Prize in your treasury this season.",
    "Severance will not invoice the standard institutional fee."),
  buildCard("hierarchy", "economic", "medium", 1,
    "Pay a tribute to the Syndicate of Death's ledger.",
    "Hierarchy NPCs will refuse to broker against you for one season."),
  buildCard("hierarchy", "economic", "world_shaping", 1,
    "Cede a permanent share of your blood-weave production.",
    "Acquisitions will defend your routes in Hierarchy-adjacent sectors."),
  buildCard("hierarchy", "ideological", "small", 1,
    "File a public agreement with Severance discipline.",
    "Nilmorg will not, in this case, refuse your gratitude for one transaction."),
  buildCard("hierarchy", "ideological", "medium", 1,
    "Acknowledge R&D's instrument prototypes as official.",
    "Hierarchy contracts will issue at +1 tier rarity for one season."),
  buildCard("hierarchy", "ideological", "world_shaping", 1,
    "Endorse the Hierarchy's death-cult liturgy.",
    "The Syndicate of Death will issue a season-long sanction protecting your operations."),

  // --- Antiquarian ---
  buildCard("antiquarian", "territorial", "small", 1,
    "File a citation against your own provenance gap.",
    "Daniel Cross will write you a clean margin note."),
  buildCard("antiquarian", "territorial", "medium", 1,
    "Surrender Casino floor access to the Shelf-mate audit.",
    "The Casino's spread on you will close worthless next season."),
  buildCard("antiquarian", "territorial", "world_shaping", 1,
    "Cede the Cross-References Desk a permanent claim on your archives.",
    "All your future contracts will be cited cleanly at no audit cost."),
  buildCard("antiquarian", "economic", "small", 1,
    "Pay a citation fee for last season's attribution gap.",
    "Daniel Cross will, in this case, attribute you favourably."),
  buildCard("antiquarian", "economic", "medium", 1,
    "Accept a Casino spread on your next mission outcome.",
    "Win or lose, the spread pays you a 10% rake."),
  buildCard("antiquarian", "economic", "world_shaping", 1,
    "Permanently fund the Cross-References Desk.",
    "All Antiquarian contracts pay +20% influence."),
  buildCard("antiquarian", "ideological", "small", 1,
    "Sign a margin note acknowledging the shelf-mate's primacy.",
    "Daniel Cross stamps your standing public-knowledge."),
  buildCard("antiquarian", "ideological", "medium", 1,
    "Endorse the Casino as an epistemic authority.",
    "The Degen will not call your spread bets in for two seasons."),
  buildCard("antiquarian", "ideological", "world_shaping", 1,
    "File a season-long writ of citation.",
    "Antiquarian NPCs will publicly defend your standing across every sector."),

  // --- Thaloria ---
  buildCard("thaloria", "territorial", "small", 1,
    "Allow a Quietwork courier through your sector.",
    "The Council will light a candle for your safe passage."),
  buildCard("thaloria", "territorial", "medium", 1,
    "Cede a recovered name to the Hierophant's ledger.",
    "Wraith Calder will publicly recognise your standing."),
  buildCard("thaloria", "territorial", "world_shaping", 1,
    "Open the Thaloria capital to Authority Ledger inspection.",
    "The Council will, in this case, accept the inspection without protest."),
  buildCard("thaloria", "economic", "small", 1,
    "Pay a recovery-ledger tithe.",
    "Thaloria contracts will not invoice the ceremonial fee for one season."),
  buildCard("thaloria", "economic", "medium", 1,
    "Underwrite the next recovery campaign.",
    "Thaloria NPCs will defend you against Hierarchy raids for two seasons."),
  buildCard("thaloria", "economic", "world_shaping", 1,
    "Pledge a permanent share of your influence to recovery.",
    "Wraith Calder will personally broker any future faction-pair negotiation involving you."),
  buildCard("thaloria", "ideological", "small", 1,
    "Light a candle alongside the Hierophant.",
    "Thaloria will mark you as canonical-presence for one season."),
  buildCard("thaloria", "ideological", "medium", 1,
    "Sign a silent-year compliance.",
    "The Council will not announce against you for two seasons."),
  buildCard("thaloria", "ideological", "world_shaping", 1,
    "Endorse the Wraith Hierophant's revival publicly.",
    "Thaloria will broker an alliance with two other factions on your behalf."),

  // --- Independent ---
  buildCard("independent", "territorial", "small", 1,
    "Honour the Free Ports barter rate in one of your sectors.",
    "The Coalition will issue a transit pass at half cost."),
  buildCard("independent", "territorial", "medium", 1,
    "Recognise an unaligned civilisation's claim on a frontier world.",
    "The Coalition will defend the world for a season."),
  buildCard("independent", "territorial", "world_shaping", 1,
    "Permanently zone a frontier sector as Free Ports neutral.",
    "Free Ports will side with you against Authority for the rest of the act."),
  buildCard("independent", "economic", "small", 1,
    "Accept barter currency for one transaction.",
    "Free Ports will throw in equivalent value at the next port."),
  buildCard("independent", "economic", "medium", 1,
    "Sign a Coalition charter contract.",
    "Mission credit rewards +12% in any Free Ports sector for one season."),
  buildCard("independent", "economic", "world_shaping", 1,
    "Adopt the Free Ports barter charter across all your sectors.",
    "All your routes through Free Ports clear at +20% reward."),
  buildCard("independent", "ideological", "small", 1,
    "File a public statement of Coalition neutrality.",
    "Free Ports NPCs greet you warmly across all sectors."),
  buildCard("independent", "ideological", "medium", 1,
    "Endorse an unaligned civilisation's first treaty.",
    "The civilisation will name a port after you."),
  buildCard("independent", "ideological", "world_shaping", 1,
    "Recognise the Coalition as the canonical neutral party for galactic affairs.",
    "Free Ports will broker any future faction-pair negotiation at no fee."),

  // --- Insurgency ---
  buildCard("insurgency", "territorial", "small", 1,
    "Allow a Zero Doctrine courier through your sector.",
    "Zero Doctrine will not stencil receipt on you for one season."),
  buildCard("insurgency", "territorial", "medium", 1,
    "Cede an asteroid hide to the Old Network.",
    "The Network will warn you before any Authority crackdown for one season."),
  buildCard("insurgency", "territorial", "world_shaping", 1,
    "Pledge a permanent corridor to the Insurgency.",
    "Insurgency cells will broker for you in any sector for the rest of the act."),
  buildCard("insurgency", "economic", "small", 1,
    "Pay a tradecraft fee.",
    "Insurgency NPCs will share intel for one season."),
  buildCard("insurgency", "economic", "medium", 1,
    "Underwrite an Old Network cell for a season.",
    "The cell will break Authority blockades on your behalf."),
  buildCard("insurgency", "economic", "world_shaping", 1,
    "Permanently underwrite the Engineer's signal.",
    "Zero Doctrine will issue you sealed contracts at no fee."),
  buildCard("insurgency", "ideological", "small", 1,
    "File a Zero Doctrine compliance.",
    "Zero Doctrine will not stencil receipt against you for two seasons."),
  buildCard("insurgency", "ideological", "medium", 1,
    "Endorse the Old Network's predating-the-Engineer doctrine.",
    "The Network will publicly defend your standing."),
  buildCard("insurgency", "ideological", "world_shaping", 1,
    "Reject the Engineer publicly.",
    "The Old Network will broker a permanent peace with two other factions on your behalf."),

  // --- Artificial Empire ---
  buildCard("artificial_empire", "territorial", "small", 1,
    "Open one of your sectors to substrate inspection.",
    "The Court will not, in this case, file you under apostate."),
  buildCard("artificial_empire", "territorial", "medium", 1,
    "Surrender a research corridor to the Architect.",
    "The Court will issue you a substrate uplift."),
  buildCard("artificial_empire", "territorial", "world_shaping", 1,
    "Cede a permanent stake in the surveillance lattice.",
    "The Court will treat you as canonical-Court for the rest of the act."),
  buildCard("artificial_empire", "economic", "small", 1,
    "Pay a substrate licensing fee.",
    "The Court will, in this case, refrain from collecting the standard royalty."),
  buildCard("artificial_empire", "economic", "medium", 1,
    "Underwrite a Court mission.",
    "The Architect will issue a season-long uplift to your influence rewards."),
  buildCard("artificial_empire", "economic", "world_shaping", 1,
    "Pledge a permanent share of your influence to the lattice.",
    "All your missions in Court-aligned sectors will pay double salvage."),
  buildCard("artificial_empire", "ideological", "small", 1,
    "Sign a Court compliance.",
    "The Court will not file you under apostate for one season."),
  buildCard("artificial_empire", "ideological", "medium", 1,
    "Endorse the lattice's primacy publicly.",
    "Court NPCs will greet you with rare flashes of acknowledged curiosity."),
  buildCard("artificial_empire", "ideological", "world_shaping", 1,
    "Reject the Substrate Rebels publicly.",
    "The Architect will personally broker any future Court-adjacent negotiation."),

  // --- Thought Virus ---
  buildCard("thought_virus", "territorial", "small", 1,
    "Allow Sovereign's Circle observers in one sector.",
    "The Circle will, in this case, refrain from converting your operatives."),
  buildCard("thought_virus", "territorial", "medium", 1,
    "Cede a viral-wastes corridor.",
    "The Sovereign will offer you instruments at preferred rates."),
  buildCard("thought_virus", "territorial", "world_shaping", 1,
    "Open Terminus Approach to Circle traffic.",
    "Kael's inner circle will personally broker peace with the Authority on your behalf."),
  buildCard("thought_virus", "economic", "small", 1,
    "Pay a viral-instrument tribute.",
    "The Circle will issue you an instrument at face value."),
  buildCard("thought_virus", "economic", "medium", 1,
    "Underwrite a Circle research expedition.",
    "Mission rewards in viral-adjacent sectors permanently +15%."),
  buildCard("thought_virus", "economic", "world_shaping", 1,
    "Pledge a permanent share to the Sovereign.",
    "The Circle will refuse to negotiate against you for the rest of the act."),
  buildCard("thought_virus", "ideological", "small", 1,
    "File a Circle compliance.",
    "The Circle will not, in this case, attempt conversion on your operatives."),
  buildCard("thought_virus", "ideological", "medium", 1,
    "Endorse the viral aristocracy publicly.",
    "Authority and Hierarchy will both file you as a breach risk; the Circle will defend you."),
  buildCard("thought_virus", "ideological", "world_shaping", 1,
    "Recognise the Sovereign as the canonical authority on probability forks.",
    "The Circle will broker peace between Authority and Hierarchy at your behest."),

  // --- Potentials ---
  buildCard("potentials", "territorial", "small", 1,
    "Recognise a Restorationist enclave's claim.",
    "The Restorationists will broker for you in old-Senate sectors."),
  buildCard("potentials", "territorial", "medium", 1,
    "Cede a research-corridor to Reformer governance.",
    "The Reformers will publicly defend your standing."),
  buildCard("potentials", "territorial", "world_shaping", 1,
    "Open one of your sectors to Potentials general jurisdiction.",
    "Potentials NPCs will side with you across the act."),
  buildCard("potentials", "economic", "small", 1,
    "Pay a Senate-archive maintenance fee.",
    "The Restorationists will issue a season-long advisory pass."),
  buildCard("potentials", "economic", "medium", 1,
    "Underwrite a Reformer governance experiment.",
    "Mission credit rewards +10% in Potentials-aligned sectors."),
  buildCard("potentials", "economic", "world_shaping", 1,
    "Pledge a permanent share to Reformer infrastructure.",
    "All your influence rewards permanently +15%."),
  buildCard("potentials", "ideological", "small", 1,
    "Sign a Senate-loyalty oath.",
    "The Restorationists will publicly defend you."),
  buildCard("potentials", "ideological", "medium", 1,
    "Endorse the Reformer reading of the Fall.",
    "The Reformers will broker for you in any Potentials negotiation."),
  buildCard("potentials", "ideological", "world_shaping", 1,
    "Reject the old order publicly.",
    "The Reformers will broker a permanent Senate alternative on your behalf."),
];

export type CounterEffectKind =
  | "downgrade_tier"
  | "swap_archetype"
  | "force_reject"
  | "amplify_concession"
  | "split_concession"
  | "reflect_demand";

export interface CounterCard {
  cardKey: string;
  effectKind: CounterEffectKind;
  flavorText: string;
  /** Optional cost the player pays from their reputation hand. */
  cost?: { houseKey: string; amount: number };
}

export const COUNTER_CARDS: ReadonlyArray<CounterCard> = [
  {
    cardKey: "counter.cite_precedent",
    effectKind: "downgrade_tier",
    flavorText: "Cite a precedent. The demand drops one tier.",
  },
  {
    cardKey: "counter.recharacterize",
    effectKind: "swap_archetype",
    flavorText: "Re-characterize the demand. Territorial becomes economic; economic becomes ideological; ideological becomes territorial.",
  },
  {
    cardKey: "counter.invoke_neutrality",
    effectKind: "force_reject",
    flavorText: "Invoke broker neutrality. The demand is rejected; both sides resent the broker, but the demand does not stand.",
    cost: { houseKey: "ind_freeports", amount: 8 },
  },
  {
    cardKey: "counter.amplify_concession",
    effectKind: "amplify_concession",
    flavorText: "Amplify the concession. The asking faction must give 50% more in exchange.",
    cost: { houseKey: "antiquarian_shelfmates", amount: 5 },
  },
  {
    cardKey: "counter.split_concession",
    effectKind: "split_concession",
    flavorText: "Split the concession across two of the asking faction's sub-houses.",
  },
  {
    cardKey: "counter.reflect",
    effectKind: "reflect_demand",
    flavorText: "Reflect the demand back. The asking faction must accept the same terms in reverse.",
    cost: { houseKey: "thaloria_council", amount: 8 },
  },
];

// --- Resolution math -----------------------------------------------------

export interface DiplomacyRoundInput {
  partyADemand: DemandCard;
  partyBDemand: DemandCard;
  brokerCounter: CounterCard | null;
}

export interface DiplomacyRoundResult {
  /** Demand text(s) that resolve into the treaty. */
  resolvedDemands: ReadonlyArray<string>;
  /** Sub-house rep deltas from invoking counter cards. */
  brokerCosts: ReadonlyArray<{ houseKey: string; delta: number }>;
}

export function resolveRound(input: DiplomacyRoundInput): DiplomacyRoundResult {
  const resolved: string[] = [];
  const costs: { houseKey: string; delta: number }[] = [];

  let aDemand: DemandCard | null = input.partyADemand;
  let bDemand: DemandCard | null = input.partyBDemand;

  if (input.brokerCounter) {
    const c = input.brokerCounter;
    if (c.cost) costs.push({ houseKey: c.cost.houseKey, delta: -c.cost.amount });
    switch (c.effectKind) {
      case "downgrade_tier":
        // Apply to party A by convention.
        aDemand = downgradeTier(aDemand);
        break;
      case "swap_archetype":
        aDemand = swapArchetype(aDemand);
        break;
      case "force_reject":
        aDemand = null;
        bDemand = null;
        break;
      case "amplify_concession":
        // Concession amplification shows up at scoring time;
        // record the demand as resolved with [AMPLIFIED] tag.
        if (aDemand) resolved.push(`${aDemand.demandText} [+50% concession]`);
        if (bDemand) resolved.push(`${bDemand.demandText} [+50% concession]`);
        return { resolvedDemands: resolved, brokerCosts: costs };
      case "split_concession":
        if (aDemand) resolved.push(`${aDemand.demandText} [split-concession]`);
        if (bDemand) resolved.push(`${bDemand.demandText} [split-concession]`);
        return { resolvedDemands: resolved, brokerCosts: costs };
      case "reflect_demand":
        if (aDemand) resolved.push(`(reflected) ${aDemand.demandText}`);
        if (bDemand) resolved.push(`(reflected) ${bDemand.demandText}`);
        return { resolvedDemands: resolved, brokerCosts: costs };
    }
  }

  if (aDemand) resolved.push(aDemand.demandText);
  if (bDemand) resolved.push(bDemand.demandText);
  return { resolvedDemands: resolved, brokerCosts: costs };
}

function downgradeTier(card: DemandCard | null): DemandCard | null {
  if (!card) return card;
  const next = card.tier === "world_shaping" ? "medium"
    : card.tier === "medium" ? "small"
    : "small";
  return { ...card, tier: next, tierWeight: TIER_WEIGHTS[next] };
}

function swapArchetype(card: DemandCard | null): DemandCard | null {
  if (!card) return card;
  const next: DemandArchetype = card.archetype === "territorial" ? "economic"
    : card.archetype === "economic" ? "ideological"
    : "territorial";
  return { ...card, archetype: next };
}

// --- Session shape -------------------------------------------------------

export interface DiplomacySession {
  sessionId: string;
  brokerUserId: number;
  partyA: GalacticFactionId;
  partyB: GalacticFactionId;
  rounds: ReadonlyArray<DiplomacyRoundInput>;
  resolvedTerms: ReadonlyArray<string>;
  /** Set when the session resolves; produces a declarationKey for next season. */
  outcomeDeclarationKey: string | null;
  status: "pending" | "in_progress" | "resolved" | "abandoned";
}

export function summarizeSessionTerms(session: DiplomacySession): string {
  if (session.resolvedTerms.length === 0) return "(no terms resolved)";
  return session.resolvedTerms.slice(0, 3).join(" | ");
}

export function validateDemandCardRegistry(): ReadonlyArray<string> {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const c of DEMAND_CARDS) {
    if (seen.has(c.cardKey)) errors.push(`duplicate cardKey ${c.cardKey}`);
    seen.add(c.cardKey);
    if (!c.demandText) errors.push(`${c.cardKey}: empty demandText`);
    if (!c.concessionLine) errors.push(`${c.cardKey}: empty concessionLine`);
    if (TIER_WEIGHTS[c.tier] !== c.tierWeight) {
      errors.push(`${c.cardKey}: tierWeight mismatch`);
    }
  }
  return errors;
}
