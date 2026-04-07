/**
 * NPC Portrait Registry — Maps NPC IDs to portrait art paths.
 *
 * Each NPC has:
 * - full: 512x768 portrait (dialog panels, Loredex entries)
 * - bust: 256x256 bust shot (conspiracy board, chat avatars)
 * - expressions: 4 expression variants (neutral, concerned, vulnerable, speaking)
 *
 * Portraits are served from Cloudinary CDN (res.cloudinary.com/dsenaozjq).
 * The system gracefully falls back to placeholder if image doesn't load.
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
    fullPortrait: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528068/elara-base_i4kbzp.jpg",
    bustPortrait: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528068/elara-base_i4kbzp.jpg",
    color: "#22d3ee",
    expressions: {
      neutral: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528070/elara-neutral_oeyniw.jpg",
      emotional1: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528069/elara-concerned_mlepd8.jpg",
      emotional2: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528068/elara-vulnerable_gdrerr.jpg",
      speaking: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528069/elara-speaking_uuquv0.jpg",
    },
  },
  the_human: {
    id: "the_human", name: "The Human",
    fullPortrait: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528038/the-human-base_tjxrdj.jpg",
    bustPortrait: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528038/the-human-base_tjxrdj.jpg",
    color: "#f87171",
    expressions: {
      neutral: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528038/the-human-base_tjxrdj.jpg",
      emotional1: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528038/the-human-amused_mnco27.jpg",
      emotional2: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528039/the-human-vulnerable_f1bqhc.jpg",
      speaking: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528039/the-human-dangerous_ice4r4.jpg",
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
    fullPortrait: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528042/the-source-empty_xt73mm.jpg",
    bustPortrait: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528042/the-source-empty_xt73mm.jpg",
    color: "#ff1744",
    expressions: {
      neutral: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528043/the-source-viral_zdtfui.jpg",
      emotional1: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528042/the-source-grieving_hmqwzc.jpg",
      emotional2: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528042/the-source-prophetic_lhgucu.jpg",
      speaking: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528042/the-source-empty_xt73mm.jpg",
    },
  },
  antiquarian: {
    id: "antiquarian", name: "The Antiquarian",
    fullPortrait: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775525313/antiquarian-base_d0rlc7.jpg",
    bustPortrait: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775525313/antiquarian-base_d0rlc7.jpg",
    color: "#00e676",
    expressions: {
      neutral: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775525314/antiquarian-ancient_o51jld.jpg",
      emotional1: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775525313/antiquarian-playful_rugsom.jpg",
      emotional2: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775525313/antiquarian-sorrowful_lttyiq.jpg",
      speaking: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775525314/antiquarian-revelatory_gkk0jn.jpg",
    },
  },
  shadow_tongue: {
    id: "shadow_tongue", name: "Shadow Tongue",
    fullPortrait: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528037/shadow-tongue-invisible_cjtj4b.jpg",
    bustPortrait: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528037/shadow-tongue-invisible_cjtj4b.jpg",
    color: "#6366f1",
    expressions: {
      neutral: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528037/shadow-tongue-invisible_cjtj4b.jpg",
      emotional1: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528037/shadow-tongue-seductive_e9n8dz.jpg",
      emotional2: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528037/shadow-tongue-scholarly_t12o4t.jpg",
      speaking: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528036/shadow-tongue-corrosive_n5vver.jpg",
    },
  },
  the_meme: {
    id: "the_meme", name: "The Meme",
    fullPortrait: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528039/the-meme-base_sdggfn.jpg",
    bustPortrait: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528039/the-meme-base_sdggfn.jpg",
    color: "#ec4899",
    expressions: {
      neutral: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528040/the-meme-broadcasting_isecpo.jpg",
      emotional1: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528041/the-meme-sympathetic_fu30uu.jpg",
      emotional2: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528041/the-meme-glitching_y2zlyl.jpg",
      speaking: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775528040/the-meme-dangerous_tdo2c5.jpg",
    },
  },
};

/* ─── THE HUMAN — PROGRESSIVE REVEAL STAGES ───
 *
 * The Human's identity is hidden at first. The player sees only
 * static and interference. As trust grows and revelations unlock,
 * the portrait gradually resolves — from pure noise to a face.
 *
 * Use Cloudinary transformations on the base portrait to create
 * 4 stages of visual degradation → clarity.
 *
 * Stage 0 (Trust 0–9):   "signal-static"     — Pure interference, no face visible
 * Stage 1 (Trust 10–19): "signal-ghost"       — Faint silhouette bleeding through noise
 * Stage 2 (Trust 20–39): "signal-fragment"    — Features emerging, heavy scanlines
 * Stage 3 (Trust 40–49): "signal-convergence" — Nearly clear, eyes still obscured
 *
 * At Trust 50+ ("I am The Human"), switch to the real portrait.
 */

const HUMAN_BASE = "https://res.cloudinary.com/dsenaozjq/image/upload";
const HUMAN_IMG = "v1775528038/the-human-base_tjxrdj.jpg";

export interface HumanRevealStage {
  id: string;
  label: string;
  minTrust: number;
  maxTrust: number;
  imageUrl: string;
  description: string;
}

export const HUMAN_REVEAL_STAGES: HumanRevealStage[] = [
  {
    id: "signal-static",
    label: "SIGNAL STATIC",
    minTrust: 0, maxTrust: 9,
    imageUrl: `${HUMAN_BASE}/e_pixelate:25,e_noise:80,e_colorize:60,co_rgb:991111,q_auto,f_auto/${HUMAN_IMG}`,
    description: "Pure interference. A corrupted signal with no discernible form.",
  },
  {
    id: "signal-ghost",
    label: "SIGNAL GHOST",
    minTrust: 10, maxTrust: 19,
    imageUrl: `${HUMAN_BASE}/e_pixelate:15,e_noise:50,e_blur:6,e_colorize:40,co_rgb:991111,q_auto,f_auto/${HUMAN_IMG}`,
    description: "A silhouette bleeds through the static. Something is there.",
  },
  {
    id: "signal-fragment",
    label: "SIGNAL FRAGMENT",
    minTrust: 20, maxTrust: 39,
    imageUrl: `${HUMAN_BASE}/e_pixelate:8,e_noise:30,e_blur:3,e_colorize:20,co_rgb:991111,q_auto,f_auto/${HUMAN_IMG}`,
    description: "Features emerging through heavy scanlines. A face, almost.",
  },
  {
    id: "signal-convergence",
    label: "SIGNAL CONVERGENCE",
    minTrust: 40, maxTrust: 49,
    imageUrl: `${HUMAN_BASE}/e_noise:15,e_blur:1,e_colorize:10,co_rgb:991111,q_auto,f_auto/${HUMAN_IMG}`,
    description: "Nearly resolved. Eyes still lost in the red wash. Who is this?",
  },
];

/** Get the Human's reveal stage image based on current trust level */
export function getHumanRevealImage(trust: number): string {
  if (trust >= 50) {
    return NPC_PORTRAITS.the_human.fullPortrait;
  }
  const stage = HUMAN_REVEAL_STAGES.find(s => trust >= s.minTrust && trust <= s.maxTrust);
  return stage?.imageUrl ?? HUMAN_REVEAL_STAGES[0].imageUrl;
}

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
