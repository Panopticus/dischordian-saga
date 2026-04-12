/* ═══════════════════════════════════════════════════════
   NARRATOR TRUST-TIER DIALOG — Shared Types

   Elara and The Human — the two narrators on Ark 1047.
   Their dialog changes based on the player's trust level with them.
   5 tiers: 0-20, 21-40, 41-60, 61-80, 81-100.

   Every line is VO-ready: has an audioDialogId, emotion tag,
   timing hint, and direction note for the voice actor.

   This is BioWare-level conversational dialog — not transactional
   tutorial text. Every scene feels like a real moment between two
   beings who have been sharing this ship for weeks, months, years.

   Characters:
     ELARA — Former Senator Voss of Atarion. No memory of her past.
       Her dialog bleeds identity clues at higher trust tiers. She
       calls memories returning "signal degradation" because she
       can't name what they are yet.
     THE HUMAN — The 12th and last Archon. Imprisoned in the Ark's
       substrate layer by his own choice. Fifteen thousand years old.
       He speaks directly into the player's ear — intimate, warm
       menace at low trust, softening to grief-stricken honesty at
       high trust.
   ═══════════════════════════════════════════════════════ */

export type TrustTier = 0 | 1 | 2 | 3 | 4;
// 0: 0-20   — professional / intimate menace
// 1: 21-40  — warming / testing
// 2: 41-60  — confiding / personal
// 3: 61-80  — emotionally invested / softer
// 4: 81-100 — identity cracking / full trust

export type NarratorId = "elara" | "the_human";

export type NarratorEmotion =
  | "neutral" | "warm" | "curious" | "amused" | "cautious"
  | "tender" | "melancholy" | "uncertain" | "recognizing"
  | "intimate" | "menacing" | "testing" | "wry" | "grief"
  | "proud" | "afraid" | "confessional";

/** A single narrator line with full VO metadata. */
export interface NarratorLine {
  /** Stable id for the audio file + TTS cache. */
  audioDialogId: string;
  /** The spoken text. Paragraph breaks = \n\n. */
  text: string;
  /** Emotional register for voice actor and TTS. */
  emotion: NarratorEmotion;
  /** Stage direction for actor — not spoken. */
  stageDirection?: string;
  /** Approximate delivery duration in seconds. */
  estimatedDurationSec: number;
  /** For The Human: audio positioning hint (0 = far, 1 = intimate whisper). */
  proximity?: number;
}

/** A player response option in a wheel. */
export interface PlayerResponseOption {
  id: string;
  label: string;         // Short label on wheel
  fullText: string;      // The line the player says
  /** Flags / state this option is gated on (shown only if all present). */
  requireFlags?: string[];
  /** Flags this option REMOVES from consideration (hide if any present). */
  forbidFlags?: string[];
  /** Class-gated option. */
  requireClass?: "engineer" | "oracle" | "assassin" | "soldier" | "spy";
  /** Species-gated option. */
  requireSpecies?: "demagi" | "quarchon" | "neyon";
  /** Trust delta with the narrator being spoken to. */
  trustDelta: number;
  /** Morality score delta (+humanity / -machine). */
  moralityDelta?: number;
  /** Narrative flags set by choosing this option. */
  setsFlags?: string[];
}

/** One complete scene — a self-contained conversation moment. */
export interface NarratorScene {
  id: string;
  /** Which tier this scene belongs to. */
  tier: TrustTier;
  /** Narrator speaking. */
  speaker: NarratorId;
  /** Gameplay trigger — when this scene can fire. */
  trigger:
    | "room_enter"
    | "post_combat"
    | "quiet_moment"
    | "after_choice"
    | "idle_too_long"
    | "first_visit"
    | "player_returns_after_absence"
    | "post_revelation"
    | "dream_interlude";
  /** Short human-readable description of when/where this fires. */
  triggerContext: string;
  /** Narrative flag prerequisites. */
  requireFlags?: string[];
  /** Flags that prevent this scene from firing. */
  forbidFlags?: string[];
  /** Opening monologue — the narrator's first lines. */
  opener: NarratorLine[];
  /** Player's options in response. */
  wheel: PlayerResponseOption[];
  /** Narrator reactions to each option, keyed by option id. */
  followups: Record<string, NarratorLine[]>;
  /** Optional callback — a memory this scene deposits for future scenes to reference. */
  memoryDeposit?: {
    flagId: string;
    summary: string;
  };
  /** Music cue / atmosphere notes. */
  atmosphere?: string;
}

/** A full tier's dialog dictionary for one narrator. */
export interface NarratorTierDialog {
  narrator: NarratorId;
  tier: TrustTier;
  tierLabel: string;     // e.g. "Professional" / "Intimate Menace"
  voiceProfile: string;  // Direction for voice actor at this tier
  scenes: NarratorScene[];
}

/** Helper: all scenes for a narrator, sorted by tier. */
export function getScenesForNarrator(
  narrator: NarratorId,
  dialogs: NarratorTierDialog[],
): NarratorScene[] {
  return dialogs
    .filter((d) => d.narrator === narrator)
    .sort((a, b) => a.tier - b.tier)
    .flatMap((d) => d.scenes);
}

/** Helper: returns scenes available given current player state. */
export function getAvailableScenes(
  narrator: NarratorId,
  currentTrust: number,
  flags: Record<string, boolean>,
  dialogs: NarratorTierDialog[],
): NarratorScene[] {
  const tier: TrustTier =
    currentTrust >= 81 ? 4 :
    currentTrust >= 61 ? 3 :
    currentTrust >= 41 ? 2 :
    currentTrust >= 21 ? 1 : 0;

  const all = getScenesForNarrator(narrator, dialogs);
  return all.filter((s) => {
    if (s.tier > tier) return false;
    if (s.requireFlags && s.requireFlags.some((f) => !flags[f])) return false;
    if (s.forbidFlags && s.forbidFlags.some((f) => flags[f])) return false;
    return true;
  });
}
