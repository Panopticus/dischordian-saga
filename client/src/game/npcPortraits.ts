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
    fullPortrait: "/art/portraits/agent-zero-full.png",
    bustPortrait: "/art/portraits/agent-zero-bust.png",
    color: "#ff6600",
    expressions: {
      neutral: "/art/portraits/agent-zero-urgent.png",
      emotional1: "/art/portraits/agent-zero-haunted.png",
      emotional2: "/art/portraits/agent-zero-defiant.png",
      speaking: "/art/portraits/agent-zero-spectral.png",
    },
  },
  locke: {
    id: "locke", name: "Adjudicator Locke",
    fullPortrait: "/art/portraits/locke-full.png",
    bustPortrait: "/art/portraits/locke-bust.png",
    color: "#e040fb",
    expressions: {
      neutral: "/art/portraits/locke-mercantile.png",
      emotional1: "/art/portraits/locke-predatory.png",
      emotional2: "/art/portraits/locke-collegial.png",
      speaking: "/art/portraits/locke-judicial.png",
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
