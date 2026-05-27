/* ═══════════════════════════════════════════════════════
   Act 4 adapter — binds Act 4's per-act helpers to the
   generic `CampaignActAdapter` interface consumed by
   CampaignRunPage.

   Centralizes the per-act content + side effects that
   the old Act4MatchPage hard-coded:

     • renderResolvingPanel / renderMatchupPanel /
       renderPostMatchPanel — the per-view JSX
     • onWin — Path A/B/C companion comments, cross-game
       beat fire on Path C, act4_outcome_<outcome> flag for
       the wheel-reaction router
     • beforeBattle — chapter-intro routing
       (Path C fires ch17_elara_glitched)
     • presentation — cyan accent, watcher backdrop,
       Bridge living-background image
   ═══════════════════════════════════════════════════════ */

import { ChevronLeft, Play, X } from "lucide-react";
import type { ReactNode } from "react";
import {
  ACT_4_OPPONENTS,
  type ActNOpponent,
} from "@shared/acts2to7Opponents";
import {
  resolveAct4Dialog,
  type Act4OpponentDialog,
} from "@shared/act4OpponentDialog";
import { getTauntHooksForOpponent } from "@shared/actOpponentTaunts";
import { useAct4MatchStore } from "@/stores/act4MatchStore";
import { fireCrossGameBeat } from "@/lib/crossGameBeats";
import { fireCompanionComment } from "@/lib/companionCommentQueue";
import { act4DialogPathToOutcome } from "@shared/wheelReactionCutscenes";
import { resolveChapterIntroForOpponent } from "@shared/storyEncounterChapterIntros";
import { chapterIntroTriggerFlag } from "@/components/cutscenes/ChapterIntroRouter";
import { assetUrl } from "@/lib/assetUrl";
import type { CampaignActAdapter } from "./CampaignRunPage";

function pathLabelForOpponentId(id: string): string {
  if (id === "act4_the_bridge") return "Path A — Willing Disclosure";
  if (id === "act4_the_discovery") return "Path B — Discovery";
  if (id === "act4_the_betrayal") return "Path C — Betrayal";
  return "Act 4 Match";
}

function resolveOpponentFaction(o: ActNOpponent): string {
  return o.deckLeaning[0] ?? "neutral";
}

const ACCENT = {
  border: "border-cyan-500/40",
  text: "text-cyan-200",
  subText: "text-cyan-300/80",
  bg: "bg-cyan-950/40",
} as const;

function renderResolvingPanel(args: {
  opponent: ActNOpponent | null;
  previousOutcome: "win" | "loss" | null;
  onProceed: () => void;
}): ReactNode {
  const { opponent, previousOutcome, onProceed } = args;
  if (!opponent) {
    return (
      <div className="rounded-md border border-amber-500/40 bg-amber-950/20 p-4">
        <p className="mt-2 font-serif italic text-[12px] text-amber-100/80">
          Act 4 requires one of act1_path_A, act3_partial_share, or
          act3_full_secret on your flag set. Complete the Act 3 Offer
          choice first, then return.
        </p>
      </div>
    );
  }
  return (
    <div className={`rounded-md border ${ACCENT.border} bg-stone-950/60 p-5`}>
      <p
        className={`font-mono text-[9px] uppercase tracking-wider ${ACCENT.subText}`}
      >
        Path resolved
      </p>
      <p className="mt-2 font-serif text-[16px] italic text-cyan-50">
        {pathLabelForOpponentId(opponent.id)}
      </p>
      <p className="mt-3 font-serif italic text-[13px] leading-relaxed text-cyan-100/85">
        {opponent.backstory}
      </p>
      {previousOutcome && (
        <p
          className={`mt-3 font-mono text-[9px] uppercase tracking-wider ${ACCENT.subText}`}
        >
          Previous outcome: {previousOutcome}
        </p>
      )}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onProceed}
          className={`flex items-center gap-2 rounded border border-cyan-500/60 ${ACCENT.bg} px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-cyan-100 hover:bg-cyan-900/60`}
        >
          <Play size={12} />
          {previousOutcome ? "Replay" : "Sit at the table"}
        </button>
      </div>
    </div>
  );
}

function renderMatchupPanel(args: {
  opponent: ActNOpponent;
  dialog: Act4OpponentDialog | null;
  onBack: () => void;
  onBegin: () => void;
}): ReactNode {
  const { opponent, dialog, onBack, onBegin } = args;
  if (!dialog) return null;
  return (
    <>
      <div className={`rounded-md border ${ACCENT.border} bg-stone-950/60 p-5`}>
        <p
          className={`font-mono text-[9px] uppercase tracking-wider ${ACCENT.subText}`}
        >
          {pathLabelForOpponentId(opponent.id)}
        </p>
        <p className="mt-2 font-serif text-[14px] text-cyan-50">
          {opponent.backstory}
        </p>
        <p className="mt-3 font-serif italic text-[12px] leading-relaxed text-cyan-200/80">
          {dialog.frameIntro}
        </p>
        <p
          className={`mt-3 font-mono text-[9px] uppercase tracking-wider ${ACCENT.subText}`}
        >
          Pre-match · Elara
        </p>
        <p className="mt-1 font-serif italic text-[13px] text-cyan-100">
          "{dialog.elaraPreMatch}"
        </p>
        <p
          className={`mt-3 font-mono text-[9px] uppercase tracking-wider ${ACCENT.subText}`}
        >
          Pre-match · Human
        </p>
        <p className="mt-1 font-serif italic text-[13px] text-cyan-100">
          "{dialog.humanPreMatch}"
        </p>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className={`flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider ${ACCENT.subText} hover:text-cyan-100`}
        >
          <ChevronLeft size={12} />
          Back
        </button>
        <button
          type="button"
          onClick={onBegin}
          className={`flex items-center gap-2 rounded border border-cyan-500/60 ${ACCENT.bg} px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-cyan-100 hover:bg-cyan-900/60`}
        >
          <Play size={12} />
          Begin
        </button>
      </div>
    </>
  );
}

function renderPostMatchPanel(args: {
  opponent: ActNOpponent;
  dialog: Act4OpponentDialog | null;
  outcome: "win" | "loss";
  onContinue: () => void;
}): ReactNode {
  const { opponent, dialog, outcome, onContinue } = args;
  if (!dialog) return null;
  return (
    <>
      <div className={`rounded-md border ${ACCENT.border} bg-stone-950/60 p-5`}>
        <div className="flex items-center justify-between">
          <p
            className={`font-mono text-[9px] uppercase tracking-wider ${ACCENT.subText}`}
          >
            {outcome === "win" ? "Match held" : "She won this round"}
          </p>
          <button
            type="button"
            onClick={onContinue}
            className={`${ACCENT.subText} hover:text-cyan-100`}
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
        <p className="mt-2 font-serif text-[14px] italic text-cyan-50">
          {outcome === "win" ? opponent.postMatchWin : opponent.postMatchLoss}
        </p>
        <p className="mt-3 font-serif italic text-[12px] leading-relaxed text-cyan-200/80">
          {outcome === "win" ? dialog.frameCloseWin : dialog.frameCloseLoss}
        </p>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          className={`rounded border border-cyan-500/60 ${ACCENT.bg} px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-cyan-100 hover:bg-cyan-900/60`}
        >
          Continue
        </button>
      </div>
    </>
  );
}

export const ACT_4_ADAPTER: CampaignActAdapter<ActNOpponent, Act4OpponentDialog> = {
  resolveOpponentDetails: (encounterId) =>
    ACT_4_OPPONENTS.find((o) => o.id === encounterId) ?? null,

  resolveDialog: (flags) => resolveAct4Dialog(flags),

  renderResolvingPanel: (args) =>
    renderResolvingPanel({
      opponent: args.opponent,
      previousOutcome: args.previousOutcome,
      onProceed: args.onProceed,
    }),

  renderMatchupPanel: (args) =>
    renderMatchupPanel({
      opponent: args.opponent,
      dialog: args.dialog,
      onBack: args.onBack,
      onBegin: args.onBegin,
    }),

  renderPostMatchPanel: (args) =>
    renderPostMatchPanel({
      opponent: args.opponent,
      dialog: args.dialog,
      outcome: args.outcome,
      onContinue: args.onContinue,
    }),

  onWin: ({ opponent, setNarrativeFlag }) => {
    setNarrativeFlag("act4_revelation_complete", true);
    setNarrativeFlag("act4_army_unlocked", true);
    fireCompanionComment("act4_army_unlocked");
    if (opponent.id === "act4_the_bridge") {
      fireCompanionComment("act4_pathA_complete");
    } else if (opponent.id === "act4_the_discovery") {
      fireCompanionComment("act4_pathB_complete");
    } else if (opponent.id === "act4_the_betrayal") {
      fireCompanionComment("act4_pathC_complete");
      // Tier 4D: the Betrayal variant's aftermath is where the DMC
      // efficiency-honest reflection line lands. Safe to fire for
      // any Path C win — helper is idempotent.
      void fireCrossGameBeat("the_programmers_math_loredex_act4_line");
    }
    // Bible §10 wheel-followup — set the Act 4 outcome flag the
    // WheelReactionRouter watches for.
    const dialogPath = opponent.id.replace(/^act4_/, "");
    const outcome = act4DialogPathToOutcome(dialogPath);
    if (outcome) {
      setNarrativeFlag(`act4_outcome_${outcome}`, true);
    }
  },

  beforeBattle: ({ opponent, setNarrativeFlag }) => {
    // Bible §3.13 — fire ch17_elara_glitched intro on Path C
    // (act4_the_betrayal). The resolver returns null for the other
    // Act 4 paths so they skip silently.
    const intro = resolveChapterIntroForOpponent(opponent.id);
    if (intro) {
      setNarrativeFlag(chapterIntroTriggerFlag(intro.id), true);
    }
  },

  resolveOpponentFaction,

  resolveTauntHooks: (opponent) =>
    getTauntHooksForOpponent(opponent.id) ?? null,

  opponentDisplayName: (opponent) => opponent.name,

  useOutcomeStore: () => {
    const { outcome, recordOutcome } = useAct4MatchStore();
    return { outcome, recordOutcome };
  },

  opponentEncounterId: (opponent) => opponent.id,

  pathLabel: pathLabelForOpponentId,

  presentation: {
    livingBackgroundSrc: assetUrl("art/rooms/room-bridge.png"),
    livingBackgroundAccent: "rgba(34, 211, 238, 0.35)",
    factionBackdrop: "watcher",
    factionBackdropOpacity: 0.1,
    accent: ACCENT,
    routeBack: { to: "/bridge", label: "Return to Bridge" },
    headerEyebrow: "Act 4 · The Revelation",
  },
};
