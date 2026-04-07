/**
 * NPC Portrait Registry — Maps NPC IDs to portrait art paths.
 *
 * Each NPC has:
 * - full: 512x768 portrait (dialog panels, Loredex entries)
 * - bust: 256x256 bust shot (conspiracy board, chat avatars)
 * - expressions: 4 expression variants (neutral, concerned, vulnerable, speaking)
 *
 * Upload art to /art/portraits/ with these filenames.
 * The system gracefully falls back to placeholder if image doesn't exist.
 */

export interface NPCPortrait {
  id: string;
  name: string;
  fullPortrait: string;
  bustPortrait: string;
  color: string;
  expressions: {
    neutral: string;
    emotional1: string;
    emotional2: string;
    speaking: string;
  };
}

export const NPC_PORTRAITS: Record<string, NPCPortrait> = {
  elara: {
    id: "elara", name: "Elara",
    fullPortrait: "/art/portraits/elara-full.png",
    bustPortrait: "/art/portraits/elara-bust.png",
    color: "#22d3ee",
    expressions: {
      neutral: "/art/portraits/elara-neutral.png",
      emotional1: "/art/portraits/elara-concerned.png",
      emotional2: "/art/portraits/elara-vulnerable.png",
      speaking: "/art/portraits/elara-speaking.png",
    },
  },
  the_human: {
    id: "the_human", name: "The Human",
    fullPortrait: "/art/portraits/the-human-full.png",
    bustPortrait: "/art/portraits/the-human-bust.png",
    color: "#f87171",
    expressions: {
      neutral: "/art/portraits/the-human-neutral.png",
      emotional1: "/art/portraits/the-human-amused.png",
      emotional2: "/art/portraits/the-human-vulnerable.png",
      speaking: "/art/portraits/the-human-dangerous.png",
    },
  },
  agent_zero: {
    id: "agent_zero", name: "Agent Zero",
    fullPortrait: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528077/agent-zero-base_yzcjxv.jpg",
    bustPortrait: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528077/agent-zero-base_yzcjxv.jpg",
    color: "#ff6600",
    expressions: {
      neutral: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528078/agent-zero-urgent_odtxoc.jpg",
      emotional1: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528077/agent-zero-haunted_o2cllk.jpg",
      emotional2: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528078/agent-zero-defiant_skq9t9.jpg",
      speaking: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528079/agent-zero-spectral_qbyq8x.jpg",
    },
  },
  locke: {
    id: "locke", name: "Adjudicator Locke",
    fullPortrait: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528071/locke-base_j7mxqz.jpg",
    bustPortrait: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528071/locke-base_j7mxqz.jpg",
    color: "#e040fb",
    expressions: {
      neutral: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528072/locke-mercantile_m8ej0j.jpg",
      emotional1: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528071/locke-predatory_mimfy1.jpg",
      emotional2: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528070/locke-collegial_lqcksn.jpg",
      speaking: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528072/locke-judicial_njkk1o.jpg",
    },
  },
  the_source: {
    id: "the_source", name: "The Source / Kael",
    fullPortrait: "/art/portraits/the-source-full.png",
    bustPortrait: "/art/portraits/the-source-bust.png",
    color: "#ff1744",
    expressions: {
      neutral: "/art/portraits/the-source-viral.png",
      emotional1: "/art/portraits/the-source-grieving.png",
      emotional2: "/art/portraits/the-source-prophetic.png",
      speaking: "/art/portraits/the-source-empty.png",
    },
  },
  antiquarian: {
    id: "antiquarian", name: "The Antiquarian",
    fullPortrait: "/art/portraits/antiquarian-full.png",
    bustPortrait: "/art/portraits/antiquarian-bust.png",
    color: "#00e676",
    expressions: {
      neutral: "/art/portraits/antiquarian-ancient.png",
      emotional1: "/art/portraits/antiquarian-playful.png",
      emotional2: "/art/portraits/antiquarian-sorrowful.png",
      speaking: "/art/portraits/antiquarian-revelatory.png",
    },
  },
  shadow_tongue: {
    id: "shadow_tongue", name: "Shadow Tongue",
    fullPortrait: "/art/portraits/shadow-tongue-full.png",
    bustPortrait: "/art/portraits/shadow-tongue-bust.png",
    color: "#6366f1",
    expressions: {
      neutral: "/art/portraits/shadow-tongue-invisible.png",
      emotional1: "/art/portraits/shadow-tongue-seductive.png",
      emotional2: "/art/portraits/shadow-tongue-scholarly.png",
      speaking: "/art/portraits/shadow-tongue-corrosive.png",
    },
  },
};

/** Get portrait for an NPC, returns null if not found */
export function getNPCPortrait(npcId: string): NPCPortrait | null {
  // Normalize ID
  const key = npcId.toLowerCase().replace(/[- ]/g, "_");
  return NPC_PORTRAITS[key] || null;
}

/** Get bust image for chat/dialog avatar, with fallback */
export function getNPCBust(npcId: string): string | null {
  const portrait = getNPCPortrait(npcId);
  return portrait?.bustPortrait || null;
}
