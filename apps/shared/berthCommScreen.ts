/* ═══════════════════════════════════════════════════════
   BERTH COMM SCREEN — diegetic content resolver.

   Every berth has a wall-mounted Mechronis-issue comm
   terminal. It is always on. Most of the time it shows
   trial day, ship time, Elara's pinned corner, the Human's
   signal at the bottom edge, and ambient diagnostic text.
   Sometimes it blooms — a banter pair calls in, an NPC
   reaches you from their canonical post, the Warden taps
   the line.

   This module is the resolver. Pure function:
     resolveCommScreenContent(context) → CommScreenState

   The UI renders the returned state. The resolver does not
   touch DOM or network — it composes from the existing
   banter / comment / line banks the codebase already has.

   What it surfaces:
     • apprenticeBanter pair (cohort-of-3 cross-talk)
     • companionBanter (Elara/Human exchange)
     • companionComments (Elara/Human reactive)
     • commonsScenePool phone-call mode
     • npcMourningRemarks (when crew dies; everyone's screen
       goes dark for a beat)
     • Warden line-tap watermark (audit in progress)
   ═══════════════════════════════════════════════════════ */

import type { ApprenticeArchetype } from "./apprentices";
import type {
  ElaraStabilityBand,
  HumanLightBand,
} from "./companion";
import type { PartyMember, PartyMemberId } from "./partyMember";
import type { DayPhase } from "./timeOfDay";
import { phaseLabel } from "./timeOfDay";

/* ─── Pinned-corner state (Elara + Human) ─── */

export type CornerSize = "absent" | "idle" | "listening" | "speaking";

export interface PinnedCorner {
  who: "elara" | "human";
  size: CornerSize;
  /** Display tint anchored to stability/light band. */
  tint: string;
  /** Optional one-line micro-mood text — what they're doing in their
   *  corner that's not directed at you. */
  microMood?: string;
}

/* ─── Calls ─── */

export type CommCallSource =
  | "cohort_banter"          // another apprentice slot calls in
  | "companion_banter"       // Elara/Human exchange
  | "npc_call_in"            // recruit/named NPC from their canonical post
  | "commons_scene_phone"    // commonsScenePool phone-call mode
  | "mourning";              // someone died — this is the dark beat

export interface CommCall {
  source: CommCallSource;
  /** Which character is calling (if applicable). Some sources are
   *  group calls; participants is the full set. */
  participants: PartyMemberId[];
  /** Lines to render, in order. */
  lines: { speaker: PartyMemberId; text: string }[];
  /** Banter / scene id — for cooldown tracking. */
  sourceId: string;
  /** Whether this call interrupts; otherwise it queues. */
  interrupting: boolean;
}

/* ─── Watermarks ─── */

export type CommWatermark =
  | "warden_line_tap"   // Mechronis Architect lapel-pin watermark
  | "audit_in_progress" // screen darkened, audit transcript scrolling
  | "narrative_silence"; // post-mourning beat

export interface ScreenWatermark {
  kind: CommWatermark;
  /** 0..1 opacity. */
  opacity: number;
  /** Optional caption text along the bottom edge. */
  caption?: string;
}

/* ─── Ambient diagnostic field ─── */

export interface AmbientDiagnostic {
  /** Short two-line readout shown in the dead space. */
  lines: readonly [string, string];
}

/* ─── Composite screen state ─── */

export interface CommScreenState {
  /** Always present unless suppressed by a watermark. */
  pinnedElara: PinnedCorner | null;
  /** Pre-reveal (revealStage 0): just static at the bottom edge. */
  pinnedHuman: PinnedCorner | null;
  /** Top-priority active call. Returns null when ambient. */
  activeCall: CommCall | null;
  /** Watermark layer. */
  watermark: ScreenWatermark | null;
  /** Bottom diagnostic line. */
  ambient: AmbientDiagnostic;
}

/* ─── Resolver inputs ─── */

export interface CommScreenContext {
  /** The host of the berth — whose room you're in. */
  host: PartyMember;
  /** All party members the resolver should consider for call-ins.
   *  Typically: cohort active + cohort training_a/b + persistent
   *  companions + recruited NPCs. */
  roster: PartyMember[];
  /** Wall-clock phase. */
  phase: DayPhase;
  /** Trial day for the active apprentice (1..28). */
  trialDay?: number;
  /** Recent banter ids that have already fired this visit. Used for
   *  cooldown — don't replay. */
  recentlyFiredBanterIds?: readonly string[];
  /** Recent narrative beats. Drives watermark + ambient. */
  recentBeats?: ReadonlyArray<CommScreenBeat>;
  /** Eligible cohort apprentice → apprentice banter pairs. The
   *  resolver picks one; caller sources from apprenticeBanter. */
  cohortBanterCandidates?: ReadonlyArray<{
    id: string;
    archetypeA: ApprenticeArchetype;
    archetypeB: ApprenticeArchetype;
    lines: { speakerArchetype: ApprenticeArchetype; text: string }[];
  }>;
  /** Eligible companion banter (Elara/Human). */
  companionBanterCandidates?: ReadonlyArray<{
    id: string;
    lines: { speaker: "elara" | "human"; text: string }[];
  }>;
  /** Eligible commons scenes that work in phone-call mode. */
  commonsPhoneCandidates?: ReadonlyArray<{
    id: string;
    participants: PartyMemberId[];
    lines: { speaker: PartyMemberId; text: string }[];
  }>;
}

export interface CommScreenBeat {
  kind: "audit_started" | "audit_ended" | "betrayal_warning" | "crew_died" | "warden_tap";
  /** Wall-clock when the beat fired. */
  at: number;
  /** Optional: id of the affected character. */
  subjectId?: PartyMemberId;
}

/* ─── Resolver ─── */

const RECENT_WINDOW_MS = 60_000;

export function resolveCommScreenContent(ctx: CommScreenContext): CommScreenState {
  const elara = ctx.roster.find(m => m.kind === "elara") as Extract<PartyMember, { kind: "elara" }> | undefined;
  const human = ctx.roster.find(m => m.kind === "human") as Extract<PartyMember, { kind: "human" }> | undefined;

  // Watermark first — it can suppress pinned corners.
  const watermark = resolveWatermark(ctx);
  const watermarkedDark = watermark?.kind === "audit_in_progress" || watermark?.kind === "narrative_silence";

  // Pinned corners. Persistent unless watermarked-dark or pre-reveal.
  const pinnedElara: PinnedCorner | null = (elara && !watermarkedDark)
    ? {
        who: "elara",
        size: corner_size_from_call(ctx),
        tint: tintForElara(elara.stabilityBand),
        microMood: microMoodForElara(elara.stabilityBand, ctx.phase),
      }
    : null;
  const pinnedHuman: PinnedCorner | null = (human && human.revealStage >= 1 && !watermarkedDark)
    ? {
        who: "human",
        size: human.revealStage >= 2 ? corner_size_from_call(ctx) : "idle",
        tint: tintForHuman(human.lightBand),
        microMood: microMoodForHuman(human.lightBand, human.revealStage),
      }
    : null;

  // Active call (priority order: mourning > companion banter > cohort banter > commons phone).
  const activeCall = !watermarkedDark ? resolveActiveCall(ctx) : null;

  // Ambient diagnostic — what shows when no call.
  const ambient = resolveAmbient(ctx);

  return {
    pinnedElara,
    pinnedHuman,
    activeCall,
    watermark,
    ambient,
  };
}

/* ─── Watermark resolution ─── */

function resolveWatermark(ctx: CommScreenContext): ScreenWatermark | null {
  const beats = ctx.recentBeats ?? [];
  const now = Date.now();
  // Audit in progress takes precedence.
  for (const b of beats) {
    if (b.kind === "audit_started" && now - b.at < RECENT_WINDOW_MS) {
      return { kind: "audit_in_progress", opacity: 0.85, caption: "Inspector Veil-7: M-audit in progress." };
    }
    if (b.kind === "warden_tap" && now - b.at < RECENT_WINDOW_MS) {
      return { kind: "warden_line_tap", opacity: 0.25 };
    }
    if (b.kind === "crew_died" && now - b.at < RECENT_WINDOW_MS) {
      return { kind: "narrative_silence", opacity: 0.7 };
    }
  }
  return null;
}

/* ─── Pinned-corner sizing ─── */

function corner_size_from_call(ctx: CommScreenContext): CornerSize {
  // If a companion banter call is currently active, they're speaking.
  const banter = ctx.companionBanterCandidates?.[0];
  if (banter && !alreadyFired(banter.id, ctx)) return "speaking";
  return "idle";
}

function alreadyFired(id: string, ctx: CommScreenContext): boolean {
  return (ctx.recentlyFiredBanterIds ?? []).includes(id);
}

function tintForElara(band: ElaraStabilityBand): string {
  switch (band) {
    case "fragmented": return "9CA8B8"; // staticked blue-grey
    case "lucid": return "B8D4E0";       // clear teal
    case "luminous": return "F4E4B8";    // warm gold
  }
}

function tintForHuman(band: HumanLightBand): string {
  switch (band) {
    case "shadow": return "3B2E48";
    case "balanced": return "8B7B6B";
    case "warm": return "D4A878";
  }
}

function microMoodForElara(band: ElaraStabilityBand, phase: DayPhase): string {
  if (band === "fragmented") return phase === "nightwatch" ? "she is not sure where she is" : "she is half-listening";
  if (band === "luminous") return "she is paying attention to you";
  return "she is reading something offscreen";
}

function microMoodForHuman(band: HumanLightBand, revealStage: number): string {
  if (revealStage <= 1) return "static at the lower edge of the screen";
  if (revealStage === 2) return "his outline is clearer than yesterday";
  if (band === "warm") return "he is paying attention";
  return "he is watching the bay-2 ladder from somewhere";
}

/* ─── Active-call resolution ─── */

function resolveActiveCall(ctx: CommScreenContext): CommCall | null {
  // Priority 1: mourning beat (someone just died).
  const mourning = mourningCall(ctx);
  if (mourning) return mourning;

  // Priority 2: companion banter (Elara/Human have something to say).
  const compBanter = companionBanterCall(ctx);
  if (compBanter) return compBanter;

  // Priority 3: cohort banter (apprentice ↔ apprentice).
  const cohortBanter = cohortBanterCall(ctx);
  if (cohortBanter) return cohortBanter;

  // Priority 4: commons phone-mode scene.
  const commons = commonsPhoneCall(ctx);
  if (commons) return commons;

  return null;
}

function mourningCall(ctx: CommScreenContext): CommCall | null {
  const death = (ctx.recentBeats ?? []).find(b => b.kind === "crew_died");
  if (!death || !death.subjectId) return null;
  return {
    source: "mourning",
    participants: [death.subjectId],
    lines: [
      { speaker: death.subjectId, text: "(channel closed.)" },
    ],
    sourceId: `mourning_${death.subjectId}_${death.at}`,
    interrupting: true,
  };
}

function companionBanterCall(ctx: CommScreenContext): CommCall | null {
  const cand = (ctx.companionBanterCandidates ?? []).find(c => !alreadyFired(c.id, ctx));
  if (!cand) return null;
  return {
    source: "companion_banter",
    participants: cand.lines.map(l => (l.speaker === "elara" ? "elara" : "the_human")),
    lines: cand.lines.map(l => ({
      speaker: l.speaker === "elara" ? "elara" as const : "the_human" as const,
      text: l.text,
    })),
    sourceId: cand.id,
    interrupting: false,
  };
}

function cohortBanterCall(ctx: CommScreenContext): CommCall | null {
  const cand = (ctx.cohortBanterCandidates ?? []).find(c => !alreadyFired(c.id, ctx));
  if (!cand) return null;
  // Cohort banter resolves on the active apprentice's screen calling in
  // from their cohort sibling — speaker ids are both apprentice_active
  // semantically (one host, one caller). For UI display we emit
  // "apprentice_active" for both; the renderer disambiguates by line
  // index. (Future: track speaker slot id explicitly.)
  return {
    source: "cohort_banter",
    participants: ["apprentice_active"],
    lines: cand.lines.map(l => ({
      speaker: "apprentice_active" as const,
      text: l.text,
    })),
    sourceId: cand.id,
    interrupting: false,
  };
}

function commonsPhoneCall(ctx: CommScreenContext): CommCall | null {
  const cand = (ctx.commonsPhoneCandidates ?? []).find(c => !alreadyFired(c.id, ctx));
  if (!cand) return null;
  return {
    source: "commons_scene_phone",
    participants: cand.participants,
    lines: cand.lines,
    sourceId: cand.id,
    interrupting: false,
  };
}

/* ─── Ambient diagnostic field ─── */

function resolveAmbient(ctx: CommScreenContext): AmbientDiagnostic {
  const top = ctx.trialDay
    ? `Trial Day ${ctx.trialDay} — ${phaseLabel(ctx.phase)}`
    : `Ship Time — ${phaseLabel(ctx.phase)}`;
  const bottom = ambientBottomLine(ctx);
  return { lines: [top, bottom] };
}

function ambientBottomLine(ctx: CommScreenContext): string {
  // Cycle a couple of plausible diagnostic readouts. Stable across a
  // single render; varies by host id so different berths show
  // different lines.
  const hostHash = simpleHash(ctx.host.id);
  const lines = [
    "Trade route Coda-3: cleared. ETA next arrival 0410.",
    "House Cup standings: Resonance 142, Umbra 138, Ironflight 121, Liminal 119.",
    "Bay 2 atmospheric: nominal. Bay 7 atmospheric: nominal.",
    "Cargo manifest reconciled at 0600.",
    "Reactor: 92% nominal. No flags.",
    "External weather (Violetta): purple stormfront, level 3.",
    "Ark cohesion index: 0.84. Trending stable.",
    "Mechronis dispatch: routine. No alerts.",
  ];
  return lines[hostHash % lines.length];
}

function simpleHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/* ─── Coverage helper ─── */

/**
 * For the parity gate: the resolver must produce a non-null state
 * for any host, regardless of empty inputs. Verified by tests; this
 * function is the smoke check.
 */
export function hasMinimumScreenState(state: CommScreenState): boolean {
  return !!state.ambient && state.ambient.lines.length === 2;
}
