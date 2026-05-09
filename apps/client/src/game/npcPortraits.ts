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
    color: "var(--energy-primary)",
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
 * Stage 0 (Trust 0–9):   "signal-static"     — Pure interference, no face visible
 * Stage 1 (Trust 10–19): "signal-ghost"       — Faint silhouette bleeding through noise
 * Stage 2 (Trust 20–39): "signal-fragment"    — Features emerging, heavy scanlines
 * Stage 3 (Trust 40–49): "signal-convergence" — Nearly clear, eyes still obscured
 *
 * At Trust 50+ ("I am The Human"), switch to the real portrait.
 */

export interface HumanRevealStage {
  id: string;
  label: string;
  minTrust: number;
  maxTrust: number;
  imageUrl: string;
  description: string;
  /**
   * audit/16 PR 13 (finding Cos7 — Cosplay persona).
   *
   * Cosplay-specific guidance for reproducing this reveal
   * stage. The signal-static / signal-ghost progression is
   * one of the most-cosplayed visual sequences in the saga
   * but pre-audit had no production guidance — cosplayers
   * had to reverse-engineer the mask/static effect from the
   * shipping image. This field documents the spine each
   * cosplayer should target at this stage.
   */
  cosplayGuidance?: string;
  /**
   * audit/16 PR 22 (finding C2 — Cinematic persona).
   *
   * Optional cinematic id to play when the player first
   * crosses INTO this reveal stage (i.e. their human-trust
   * was below `minTrust` last frame and is now in the
   * `[minTrust, maxTrust]` range). Pre-audit, the reveal
   * progression happened silently — the portrait crossfaded
   * but no cinematic punctuated the threshold-cross. The
   * audit'd intent: each progression beat is a story moment
   * and should land as one.
   *
   * The cinematic-id space is shared with the variant
   * resolver's `portraitCinematicId` (PR #524 / #537).
   * Companion-state update logic (queued; not in this PR)
   * compares previous-frame trust to current-frame trust
   * and dispatches the cinematic on threshold-cross.
   */
  trustThresholdCinematic?: string;
}

export const HUMAN_REVEAL_STAGES: HumanRevealStage[] = [
  {
    id: "signal-static",
    trustThresholdCinematic: "cinematic_human_reveal_signal-static",
    label: "SIGNAL STATIC",
    minTrust: 0, maxTrust: 9,
    imageUrl: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775534568/signal-static_rgwpso.jpg",
    description: "Pure interference. A corrupted signal with no discernible form.",
    cosplayGuidance:
      "Full-face static-noise mask. Cosplayers achieve this with a translucent veil printed with broadcast-noise grain + a back-light from a phone screen. The effect should fully obscure facial features — at this stage, the character HAS no face.",
  },
  {
    id: "signal-ghost",
    trustThresholdCinematic: "cinematic_human_reveal_signal-ghost",
    label: "SIGNAL GHOST",
    minTrust: 10, maxTrust: 19,
    imageUrl: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775534569/signal-ghost_m8sg2m.jpg",
    description: "A silhouette bleeds through the static. Something is there.",
    cosplayGuidance:
      "Silhouette emerging through static. A two-layer mask — silhouette underneath, static-noise gauze on top, just sheer enough that the head shape is readable but no individual feature resolves. The viewer should feel the presence of a face without being able to name a single feature.",
  },
  {
    id: "signal-fragment",
    trustThresholdCinematic: "cinematic_human_reveal_signal-fragment",
    label: "SIGNAL FRAGMENT",
    minTrust: 20, maxTrust: 39,
    imageUrl: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775534570/signal-fragment_k0qk9m.jpg",
    description: "Features emerging through heavy scanlines. A face, almost.",
    cosplayGuidance:
      "Heavy scanline overlay on resolved face. The face is now visible — use the same makeup as full-reveal The Human — but covered with a horizontal-scanline mesh (printed silk works; black string mesh works). The eyes should still be lost in the red wash, so amber/red contact lenses + lower-lid red wash.",
  },
  {
    id: "signal-convergence",
    trustThresholdCinematic: "cinematic_human_reveal_signal-convergence",
    label: "SIGNAL CONVERGENCE",
    minTrust: 40, maxTrust: 49,
    imageUrl: "https://res.cloudinary.com/dsenaozjq/image/upload/q_auto/f_auto/v1775534568/signal-convergence_zvkve1.jpg",
    description: "Nearly resolved. Eyes still lost in the red wash. Who is this?",
    cosplayGuidance:
      "Almost-fully-resolved face with persistent eye obscurement. Drop the scanline mesh; keep the red wash on the eyes. The cosplay reads as a complete-but-uncanny face — the viewer wants to ask 'who is this?' and the answer is deliberately withheld until the trust ≥ 50 full reveal.",
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
