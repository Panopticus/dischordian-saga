/* ═══════════════════════════════════════════════════════
   BERTH SCENE — the conversation surface.

   One component, six characters. Renders a party member's
   personal space: backdrop, figure asymmetric on the
   doorway, mid-task activity sprite, ambient detail, and a
   wall-mounted comm screen.

   No HUD chrome. The face is their state, not a reaction.

   File: apps/client/src/components/berth/BerthScene.tsx
   ═══════════════════════════════════════════════════════ */

import { useMemo, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import {
  expressionFor,
  activityFor,
  doorframeFor,
  ambientDetailFor,
  presenceDriftFor,
  type BerthStateSnapshot,
  type RecentBerthEvent,
} from "@shared/partyMemberBerth";
import { resolveCommScreenContent, type CommScreenBeat } from "@shared/berthCommScreen";
import { currentPhase, phaseLabel, phaseTint, phaseBrightness } from "@shared/timeOfDay";
import type { PartyMember } from "@shared/partyMember";
import { AnimatedPortrait } from "@/components/AnimatedPortrait";
import { BerthCommScreen } from "./BerthCommScreen";

export interface BerthSceneProps {
  /** Whose berth this is. */
  member: PartyMember;
  /** Other party members the comm screen should consider — Elara/Human
   *  for pinned corners, cohort siblings for banter, etc. */
  roster: PartyMember[];
  /** State snapshot for expression resolution. */
  state?: BerthStateSnapshot;
  /** Recent ambient-detail beats (most-recent first). */
  recentEvents?: ReadonlyArray<RecentBerthEvent>;
  /** Recent comm-screen beats (audit-started, warden-tap, crew-died). */
  recentBeats?: ReadonlyArray<CommScreenBeat>;
  /** Eligible cohort banter pairs (caller filters to the firable set). */
  cohortBanterCandidates?: Parameters<typeof resolveCommScreenContent>[0]["cohortBanterCandidates"];
  /** Eligible companion banter (Elara/Human). */
  companionBanterCandidates?: Parameters<typeof resolveCommScreenContent>[0]["companionBanterCandidates"];
  /** Eligible commons-phone scenes. */
  commonsPhoneCandidates?: Parameters<typeof resolveCommScreenContent>[0]["commonsPhoneCandidates"];
  /** Cooldown state. */
  recentlyFiredBanterIds?: readonly string[];
  /** Trial day for the active apprentice (drives ambient diagnostic). */
  trialDay?: number;
  /** Optional back-link target. Defaults to bunkroom for tier-2,
   *  the canonical room for tier-1. */
  backHref?: string;
  /** Called once per visit when silent-presence threshold crosses 30s.
   *  Subtle; capped at +1 per visit. */
  onPresenceDrift?: (delta: number) => void;
}

const PORTRAIT_NPC_ID: Record<string, string> = {
  apprentice_active: "elara", // fallback — apprentice portraits not yet authored
  elara: "elara",
  the_human: "the_human",
  vex_solene: "vex_solene",
  wraith_calder: "wraith_calder",
  locke: "locke",
  jericho_jones: "jericho_jones",
  akai_shi: "akai_shi",
};

/* Expression key → AnimatedPortrait expression key. The portrait
   component's enum is { neutral, emotional1, emotional2, speaking }
   plus optional namedExpressions. We map the bond×corruption matrix
   onto the named space, falling back to the legacy enum. */
const EXPRESSION_TO_PORTRAIT: Record<string, "neutral" | "emotional1" | "emotional2" | "speaking"> = {
  neutral: "neutral",
  warm: "emotional2",       // collegial / sympathetic / pleased band
  considered: "neutral",
  wary: "emotional1",       // predatory / dangerous / haunted band
  vulnerable: "emotional1", // overlap with wary; named-expr if available
};

export function BerthScene(props: BerthSceneProps) {
  const phase = currentPhase();
  const expression = expressionFor(props.member, props.state);
  const activity = activityFor(props.member, phase);
  const doorframe = doorframeFor(props.member);
  const ambientDetail = ambientDetailFor(props.member, props.recentEvents ?? []);

  const screenState = useMemo(() =>
    resolveCommScreenContent({
      host: props.member,
      roster: props.roster,
      phase,
      trialDay: props.trialDay,
      recentlyFiredBanterIds: props.recentlyFiredBanterIds,
      recentBeats: props.recentBeats,
      cohortBanterCandidates: props.cohortBanterCandidates,
      companionBanterCandidates: props.companionBanterCandidates,
      commonsPhoneCandidates: props.commonsPhoneCandidates,
    }),
    [props.member, props.roster, phase, props.trialDay, props.recentlyFiredBanterIds,
     props.recentBeats, props.cohortBanterCandidates, props.companionBanterCandidates,
     props.commonsPhoneCandidates],
  );

  // Presence drift — measure time-on-page; emit deltas on threshold crossings.
  const [secondsLingered, setSecondsLingered] = useState(0);
  const driftAppliedRef = useRef(0);
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const sec = Math.floor((Date.now() - start) / 1000);
      setSecondsLingered(sec);
      const delta = presenceDriftFor(sec);
      if (delta > driftAppliedRef.current && props.onPresenceDrift) {
        const incremental = delta - driftAppliedRef.current;
        driftAppliedRef.current = delta;
        props.onPresenceDrift(incremental);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [props.onPresenceDrift]);

  const tint = phaseTint(phase);
  const brightness = phaseBrightness(phase);
  const portraitNpcId = PORTRAIT_NPC_ID[props.member.id] ?? "elara";
  const portraitExpr = EXPRESSION_TO_PORTRAIT[expression];
  const isSpeaking = !!screenState.activeCall;

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `linear-gradient(rgba(8, 8, 12, ${1 - brightness * 0.6}), rgba(12, 12, 18, ${1 - brightness * 0.3})), url('${doorframe.backdropPath}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top header — minimal back-link + name + phase. */}
      <div className="absolute top-0 inset-x-0 p-3 flex items-center justify-between text-slate-300 z-40">
        <Link
          href={props.backHref ?? "/ship/bunkroom"}
          className="inline-flex items-center gap-1 text-sm hover:text-slate-100"
        >
          <ChevronLeft className="w-4 h-4" /> back
        </Link>
        <div className="text-center">
          <div className="text-base font-medium">{props.member.displayName}</div>
          <div className="text-xs text-slate-400 italic">
            {activity.label} · {phaseLabel(phase)}
          </div>
        </div>
        <div className="w-12" />
      </div>

      {/* Figure — asymmetric on the doorway. */}
      <div
        className={`absolute inset-y-0 ${
          doorframe.figureAnchor === "left" ? "left-8" :
          doorframe.figureAnchor === "right" ? "right-8" :
          "left-1/2 -translate-x-1/2"
        } flex items-end pb-12 z-10`}
        style={{ width: "min(45vw, 640px)" }}
      >
        <div className="w-full max-w-md">
          <AnimatedPortrait
            npcId={portraitNpcId}
            expression={portraitExpr}
            isSpeaking={isSpeaking}
            size="full"
          />
        </div>
      </div>

      {/* Comm screen — wall-mounted. */}
      <BerthCommScreen state={screenState} position={doorframe.commScreenAnchor} />

      {/* Ambient detail — small overlay at the bottom-left, only when present. */}
      {ambientDetail && (
        <div className="absolute bottom-6 left-6 max-w-xs text-xs italic text-slate-300 z-20 bg-black/40 px-3 py-2 rounded">
          {ambientDetail.description}
        </div>
      )}

      {/* Silent-presence hint — only after 30s, very subtle. */}
      {secondsLingered >= 30 && !screenState.activeCall && (
        <div className="absolute bottom-2 right-2 text-[9px] text-slate-600 font-mono">
          {secondsLingered}s in the room
        </div>
      )}
    </div>
  );
}
