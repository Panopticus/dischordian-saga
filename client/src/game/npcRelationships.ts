/* ═══════════════════════════════════════════════════════
   NPC RELATIONSHIPS — Unified API

   Every NPC has a trust tier + personality that shifts based
   on the player's archetype. This module consolidates the 7
   per-NPC relationship files into a single lookup so any
   dialog component can ask:

     getRelationshipState("the_human", trust, archetype)
       → { tier, tierLabel, personality, tone, description }

   Add a new NPC by:
     1. Create client/src/game/<name>Relationship.ts
        with get<Name>TrustTier + get<Name>Personality
     2. Add it to NPC_RELATIONSHIP_RESOLVERS below
   ═══════════════════════════════════════════════════════ */

import {
  getTrustTier as getElaraTier,
  TRUST_TIER_DESCRIPTIONS as ELARA_DESCS,
  getElaraPersonality,
  type PlayerArchetype,
} from "./elaraRelationship";
import {
  getHumanTrustTier, HUMAN_TRUST_DESCRIPTIONS, getHumanPersonality,
} from "./humanRelationship";
import {
  getZeroTrustTier, ZERO_TRUST_DESCRIPTIONS, getZeroPersonality,
} from "./agentZeroRelationship";
import {
  getAntiquarianTrustTier, ANTIQUARIAN_TRUST_DESCRIPTIONS, getAntiquarianPersonality,
} from "./antiquarianRelationship";
import {
  getLockeTrustTier, LOCKE_TRUST_DESCRIPTIONS, getLockePersonality,
} from "./lockeRelationship";
import {
  getShadowTongueTrustTier, SHADOW_TONGUE_TRUST_DESCRIPTIONS, getShadowTonguePersonality,
} from "./shadowTongueRelationship";
import {
  getSourceTrustTier, SOURCE_TRUST_DESCRIPTIONS, getSourcePersonality,
} from "./sourceRelationship";

export type { PlayerArchetype } from "./elaraRelationship";

export type NpcRelationshipId =
  | "elara"
  | "the_human"
  | "agent_zero"
  | "the_antiquarian"
  | "adjudicator_locke"
  | "shadow_tongue"
  | "the_source";

export interface RelationshipState {
  npcId: NpcRelationshipId;
  /** Raw tier string (varies per NPC) */
  tier: string;
  /** Tier description (multi-sentence) */
  tierLabel: string;
  /** Current personality archetype (varies per NPC) */
  personality: string;
  /** Trust value passed in */
  trust: number;
  /** Player archetype passed in */
  archetype: PlayerArchetype;
}

type ResolverFn = (trust: number, archetype: PlayerArchetype) => RelationshipState;

const NPC_RELATIONSHIP_RESOLVERS: Record<NpcRelationshipId, ResolverFn> = {
  elara: (trust, archetype) => {
    const tier = getElaraTier(trust);
    return {
      npcId: "elara",
      tier,
      tierLabel: ELARA_DESCS[tier],
      personality: getElaraPersonality(trust, archetype),
      trust, archetype,
    };
  },
  the_human: (trust, archetype) => {
    const tier = getHumanTrustTier(trust);
    return {
      npcId: "the_human",
      tier,
      tierLabel: HUMAN_TRUST_DESCRIPTIONS[tier],
      personality: getHumanPersonality(trust, archetype),
      trust, archetype,
    };
  },
  agent_zero: (trust, archetype) => {
    const tier = getZeroTrustTier(trust);
    return {
      npcId: "agent_zero",
      tier,
      tierLabel: ZERO_TRUST_DESCRIPTIONS[tier],
      personality: getZeroPersonality(trust, archetype),
      trust, archetype,
    };
  },
  the_antiquarian: (trust, archetype) => {
    const tier = getAntiquarianTrustTier(trust);
    return {
      npcId: "the_antiquarian",
      tier,
      tierLabel: ANTIQUARIAN_TRUST_DESCRIPTIONS[tier],
      personality: getAntiquarianPersonality(trust, archetype),
      trust, archetype,
    };
  },
  adjudicator_locke: (trust, archetype) => {
    const tier = getLockeTrustTier(trust);
    return {
      npcId: "adjudicator_locke",
      tier,
      tierLabel: LOCKE_TRUST_DESCRIPTIONS[tier],
      personality: getLockePersonality(trust, archetype),
      trust, archetype,
    };
  },
  shadow_tongue: (trust, archetype) => {
    const tier = getShadowTongueTrustTier(trust);
    return {
      npcId: "shadow_tongue",
      tier,
      tierLabel: SHADOW_TONGUE_TRUST_DESCRIPTIONS[tier],
      personality: getShadowTonguePersonality(trust, archetype),
      trust, archetype,
    };
  },
  the_source: (trust, archetype) => {
    const tier = getSourceTrustTier(trust);
    return {
      npcId: "the_source",
      tier,
      tierLabel: SOURCE_TRUST_DESCRIPTIONS[tier],
      personality: getSourcePersonality(trust, archetype),
      trust, archetype,
    };
  },
};

/**
 * Look up the relationship state for any NPC by id.
 * Returns null if the NPC isn't in the relationship registry yet.
 */
export function getRelationshipState(
  npcId: string,
  trust: number,
  archetype: PlayerArchetype = "unknown",
): RelationshipState | null {
  const resolver = NPC_RELATIONSHIP_RESOLVERS[npcId as NpcRelationshipId];
  if (!resolver) return null;
  return resolver(trust, archetype);
}

export function hasRelationship(npcId: string): boolean {
  return npcId in NPC_RELATIONSHIP_RESOLVERS;
}
