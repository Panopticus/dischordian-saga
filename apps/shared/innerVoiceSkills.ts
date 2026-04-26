// apps/shared/innerVoiceSkills.ts
//
// Phase 4 — Disco-Elysium-style inner-voice extension.
//
// Per the priority plan §Phase 4: extends the existing dialogWheel.ts
// internalMonologue field with an *autonomous* mode where each player-
// axis-skill (per playerProfile.ts:7-axis) can canonically *speak*
// during dialog as a skill-personification.
//
// Pattern:
//   "Curiosity (whispering): something here is older than the contract"
//   "Mercy (insisting): don't make her sign — she doesn't know what
//    she's giving up"
//
// 7 skill-voices, gated by player-axis-magnitude. High-magnitude axes
// canonically speak more frequently. Low-magnitude axes canonically
// stay quiet.
//
// Renderer: italicized; no portrait highlight; canonical "skill is
// thinking out loud" treatment.

import type { AxisMagnitude, PlayerAxis } from "./npcs/types";

// --- Voice profile per axis ----------------------------------------------

export interface InnerVoiceProfile {
  axis: PlayerAxis;
  /** Canonical speaker label (rendered in dialog UI, italicized). */
  label: string;
  /** Magnitude bands at which this voice canonically activates. */
  activeMagnitudes: ReadonlyArray<AxisMagnitude>;
  /**
   * Voice-cadence tag. UI may map this to subtle tonal cues
   * (whisper / insistence / dryness / urgency / etc.).
   */
  cadence: "whispering" | "insisting" | "dry" | "urgent" | "amused" | "watchful" | "soft";
  /** Bible-canonical short rationale. */
  canonicalNote: string;
}

export const INNER_VOICE_PROFILES: Readonly<Record<PlayerAxis, InnerVoiceProfile>> = {
  curiosity: {
    axis: "curiosity",
    label: "Curiosity",
    activeMagnitudes: ["mild_positive", "moderate_positive", "strong_positive"],
    cadence: "whispering",
    canonicalNote:
      "Curiosity speaks to high-curiosity players. The voice canonically " +
      "*notices* — old phrasings, hidden numbers, reflective surfaces. " +
      "Quietest of the seven.",
  },

  mercy: {
    axis: "mercy",
    label: "Mercy",
    activeMagnitudes: ["moderate_positive", "strong_positive"],
    cadence: "insisting",
    canonicalNote:
      "Mercy insists. Speaks to high-mercy players when a choice is " +
      "about to canonically cost someone other than the player. The " +
      "voice canonically *advocates* — quietly but persistently.",
  },

  vigilance: {
    axis: "vigilance",
    label: "Vigilance",
    activeMagnitudes: ["mild_positive", "moderate_positive", "strong_positive"],
    cadence: "watchful",
    canonicalNote:
      "Vigilance watches. Speaks when something canonically does not " +
      "match the surface — a face wearing the wrong voice (Meme), a " +
      "contract with hidden columns (Locke), a dream-residue the " +
      "Eidolon registered before the player did.",
  },

  vulnerability: {
    axis: "vulnerability",
    label: "Vulnerability",
    activeMagnitudes: ["moderate_positive", "strong_positive"],
    cadence: "soft",
    canonicalNote:
      "Vulnerability speaks softly. Active in moments of canonical " +
      "intimacy — Hierophant chamber, Companion first-word, Seer " +
      "Confidant-band Thaloria invitation. Does not interrupt; " +
      "accompanies.",
  },

  aggression: {
    axis: "aggression",
    label: "Aggression",
    activeMagnitudes: ["moderate_positive", "strong_positive"],
    cadence: "urgent",
    canonicalNote:
      "Aggression speaks urgently. Active in canonical tactical moments " +
      "— pre-fight, contract negotiation tension, Authority Trial " +
      "verdict-stream. Pushes for action; never reflects.",
  },

  conformity: {
    axis: "conformity",
    label: "Order",
    activeMagnitudes: ["mild_positive", "moderate_positive", "strong_positive"],
    cadence: "dry",
    canonicalNote:
      "Order (the high-conformity voice) speaks dryly. Cites canonical " +
      "rules, sequence, protocol. Active when canonical institutional " +
      "framing matters (Locke contracts, Game Master witness mode, " +
      "Authority Trial).",
  },

  wit: {
    axis: "wit",
    label: "Wit",
    activeMagnitudes: ["moderate_positive", "strong_positive"],
    cadence: "amused",
    canonicalNote:
      "Wit speaks with amusement. Active at Degen casino, Akai Shi " +
      "encounters, and any canonical moment when the canonical-" +
      "absurdity is canonically funny. Counterweight to Order.",
  },
};

// --- Voice candidacy resolver -------------------------------------------

/**
 * Inputs for inner-voice candidacy resolution.
 */
export interface InnerVoiceContext {
  /** Player's current axis magnitudes. */
  axes: Readonly<Record<PlayerAxis, AxisMagnitude>>;
  /** Optional cooldown set — recently-spoken voices this beat. */
  recentlySpoken?: ReadonlySet<PlayerAxis>;
}

/**
 * Resolve which inner voices are canonically active for the current
 * player profile. UI selects from this list (typically picks 0-1 voice
 * per beat; high-magnitude axes can speak more often).
 */
export function activeInnerVoices(ctx: InnerVoiceContext): ReadonlyArray<InnerVoiceProfile> {
  const active: InnerVoiceProfile[] = [];
  for (const profile of Object.values(INNER_VOICE_PROFILES)) {
    if (ctx.recentlySpoken?.has(profile.axis)) continue;
    const magnitude = ctx.axes[profile.axis];
    if (profile.activeMagnitudes.includes(magnitude)) {
      active.push(profile);
    }
  }
  return active;
}

/**
 * Pick the highest-priority inner voice for the current beat (or null if
 * none active). Priority: strong_positive > moderate_positive > mild_positive.
 * Ties broken by axis declaration order (curiosity / mercy / vigilance / ...).
 */
export function pickInnerVoice(ctx: InnerVoiceContext): InnerVoiceProfile | null {
  const active = activeInnerVoices(ctx);
  if (active.length === 0) return null;
  const magnitudeRank: Record<AxisMagnitude, number> = {
    strong_negative: 0,
    moderate_negative: 0,
    mild_negative: 0,
    neutral: 0,
    mild_positive: 1,
    moderate_positive: 2,
    strong_positive: 3,
  };
  let best = active[0]!;
  let bestRank = magnitudeRank[ctx.axes[best.axis]];
  for (const candidate of active.slice(1)) {
    const rank = magnitudeRank[ctx.axes[candidate.axis]];
    if (rank > bestRank) {
      best = candidate;
      bestRank = rank;
    }
  }
  return best;
}

/**
 * Render an inner-voice line into its canonical UI shape.
 * Returns "{Label} ({cadence}): {text}" — italicized in UI.
 */
export function renderInnerVoiceLine(profile: InnerVoiceProfile, text: string): string {
  return `${profile.label} (${profile.cadence}): ${text}`;
}
