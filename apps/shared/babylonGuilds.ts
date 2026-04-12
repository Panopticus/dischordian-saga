/* ═══════════════════════════════════════════════════════
   BABYLON GUILDS DATA SHELL — Appendix A.5

   Four New Babylon sub-factions that become F1 Infiltration
   routes per §7.3. Each guild unlocks a distinct gameplay
   mechanic when its infiltration flag lands. The shell
   exists so future F1 Infiltration code can ship against
   canonical ids without re-reading the proposal.

   Guilds:
     living        — organic crafting (biomantic recipes)
     locks         — puzzle-box cards (locked Dischordia)
     yellow_coats  — market manipulation (Trade Empire edge)
     influencers   — Loredex rewriting (history as weapon)

   Every guild has an `infiltrationFlag` that lands when the
   player completes its F1 route, and an `unlockFlag` that
   gates the gameplay mechanic. Both are canonical.
   ═══════════════════════════════════════════════════════ */

export type BabylonGuildId =
  | "living"
  | "locks"
  | "yellow_coats"
  | "influencers";

export type BabylonGuildMechanicKind =
  | "organic_crafting"
  | "puzzle_box_cards"
  | "market_manipulation"
  | "loredex_rewriting";

export interface BabylonGuild {
  id: BabylonGuildId;
  name: string;
  /** Single-sentence thesis. */
  thesis: string;
  /** How the player infiltrates this guild (in-fiction). */
  infiltrationVector: string;
  /** Which Witnessing concern this guild serves. */
  mechanicKind: BabylonGuildMechanicKind;
  /** One-line summary of the unlocked mechanic. */
  mechanicSummary: string;
  /** Flag raised when the F1 infiltration route is completed. */
  infiltrationFlag: string;
  /** Flag raised when the unlocked mechanic becomes available. */
  unlockFlag: string;
  /** Reference to the Appendix A.5 shipping flag. */
  appendixShippingFlag: string;
}

export const BABYLON_GUILDS: Record<BabylonGuildId, BabylonGuild> = {
  living: {
    id: "living",
    name: "The Living",
    thesis:
      "A cult that has decided meat is the only thing worth trusting. They grow their tools. They grow their locks. They would grow their weapons if the Watcher had not taken that choice away.",
    infiltrationVector:
      "Earn trust by bringing them a pet that is dying and asking them to save it. They will succeed. The pet will be different when it comes back.",
    mechanicKind: "organic_crafting",
    mechanicSummary:
      "Biomantic crafting: recipes that accept pet traits, crew lineage stats, and Garden harvests as crafting reagents.",
    infiltrationFlag: "guild_living_infiltrated",
    unlockFlag: "organic_crafting_unlocked",
    appendixShippingFlag: "guild_living_infiltrated",
  },

  locks: {
    id: "locks",
    name: "The Locks",
    thesis:
      "A guild of puzzle-smiths who have forgotten why they started locking things. They just know it is the thing their family has done for four hundred years. Every Lock is also a Key. Every Key is also a Lock.",
    infiltrationVector:
      "Solve the Seventeen-Turn puzzle at the front gate. Do it without asking for help. They will know.",
    mechanicKind: "puzzle_box_cards",
    mechanicSummary:
      "A new Dischordia card subtype: Locked cards. The card stays face-down until its puzzle condition is satisfied in play, then flips revealing an oversized effect.",
    infiltrationFlag: "guild_locks_infiltrated",
    unlockFlag: "puzzle_box_cards_unlocked",
    appendixShippingFlag: "guild_locks_infiltrated",
  },

  yellow_coats: {
    id: "yellow_coats",
    name: "The Yellow Coats",
    thesis:
      "Traders in jaundiced linen who know the exact price of every thing and the value of nothing. They do not lie to the customer. They lie to the market.",
    infiltrationVector:
      "Manipulate a Trade Empire market into a corner over three consecutive cycles. Do not get caught. When they come to arrest you, they will offer you a jacket.",
    mechanicKind: "market_manipulation",
    mechanicSummary:
      "Trade Empire edge: the player can pre-seed a sector's price floor by one cycle, producing a guaranteed profit window the AI traders cannot exploit.",
    infiltrationFlag: "guild_yellow_coats_infiltrated",
    unlockFlag: "market_manipulation_unlocked",
    appendixShippingFlag: "guild_yellow_coats_infiltrated",
  },

  influencers: {
    id: "influencers",
    name: "The Influencers",
    thesis:
      "A guild of poets, propagandists, and memetic engineers who know that history is not what happened — history is what is remembered. They remember for everyone, and they charge by the century.",
    infiltrationVector:
      "Rewrite a minor Loredex entry that nobody checks. Have them notice. Have them ask you to do it again. Do it again.",
    mechanicKind: "loredex_rewriting",
    mechanicSummary:
      "Loredex rewriting: the player can amend up to three minor Loredex entries per prestige cycle. The Antiquarian notices. Shadow Tongue gets a matching edit.",
    infiltrationFlag: "guild_influencers_infiltrated",
    unlockFlag: "loredex_rewriting_unlocked",
    appendixShippingFlag: "guild_influencers_infiltrated",
  },
};

export function listBabylonGuilds(): readonly BabylonGuild[] {
  return [
    BABYLON_GUILDS.living,
    BABYLON_GUILDS.locks,
    BABYLON_GUILDS.yellow_coats,
    BABYLON_GUILDS.influencers,
  ];
}

export function getBabylonGuild(id: BabylonGuildId): BabylonGuild {
  return BABYLON_GUILDS[id];
}

/**
 * Which guilds has the player infiltrated given the current
 * narrative flag set? Returns the canonical guild data for
 * each one whose `infiltrationFlag` is raised.
 */
export function listInfiltratedGuilds(
  flags: Record<string, unknown>,
): readonly BabylonGuild[] {
  return listBabylonGuilds().filter((g) => Boolean(flags[g.infiltrationFlag]));
}

/**
 * Which guild mechanics are currently available to the
 * player? Returns the `mechanicKind` for each guild whose
 * unlockFlag is raised.
 */
export function listUnlockedGuildMechanics(
  flags: Record<string, unknown>,
): readonly BabylonGuildMechanicKind[] {
  return listBabylonGuilds()
    .filter((g) => Boolean(flags[g.unlockFlag]))
    .map((g) => g.mechanicKind);
}
