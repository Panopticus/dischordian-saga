/**
 * MechanicTutorialOverlay — runtime for MECHANIC_TUTORIAL_GATES
 *
 * Mounted on a page that "owns" a tutorial UI surface
 * (e.g. EngineersBenchPage with uiId="engineer_bench"). On
 * mount, checks for eligible gates whose trigger is
 * first_ui_open of the supplied uiId. When eligible, surfaces
 * the next-pending gate as a floating panel; the gate's
 * speaker is resolved via apprenticeChanneledLines (apprentice
 * channels the dead Engineer) or rendered direct.
 *
 * On confirm, persists the gate's completionFlag so the runtime
 * does not re-fire it. The after-gate cascade (intro → curve →
 * synergy → slot-optim → bench-three-frequencies → goggles-
 * inherited) is automatic — completing one gate makes the next
 * eligible.
 *
 * For action-trigger gates (e.g. after the player completes
 * deck_completed_first_time), pages call emitTutorialAction()
 * to surface that gate. Implementation here is a small in-page
 * cycler — it does not modify the global event bus.
 *
 * See plan §11 (Implementation Phases — Phase E onward).
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, X } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import {
  getEligibleGates,
  type MechanicTutorialGate,
} from "@shared/mechanicTutorialGates";
import {
  resolveVariant,
  pickAwarePause,
  type EngineerDomainTopic,
} from "@shared/apprenticeChanneledLines";
import type { ApprenticeArchetype } from "@shared/apprentices";

const FALLBACK_ARCHETYPE: ApprenticeArchetype = "artisan";

interface MechanicTutorialOverlayProps {
  /** The UI surface id this overlay is attached to (e.g. "engineer_bench"). */
  uiId: string;
  /** Optional latest in-page action that may trigger after-action gates. */
  recentAction?: { actionId: string; count?: number };
}

export default function MechanicTutorialOverlay({
  uiId,
  recentAction,
}: MechanicTutorialOverlayProps) {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};

  // Read the player's bonded apprentice archetype, if present. Fall back
  // gracefully if no apprentice is bonded.
  const archetype: ApprenticeArchetype = useMemo(() => {
    const apprentice = state.apprentice as { archetype?: ApprenticeArchetype } | null;
    return apprentice?.archetype ?? FALLBACK_ARCHETYPE;
  }, [state.apprentice]);

  const eligibleGates = useMemo(
    () =>
      getEligibleGates({
        flags: flags as Record<string, unknown>,
        openedUi: uiId,
        recentAction: recentAction?.actionId,
        recentActionCount: recentAction?.count,
      }),
    [flags, uiId, recentAction],
  );

  const nextGate: MechanicTutorialGate | undefined = eligibleGates[0];

  const [dismissed, setDismissed] = useState<string | null>(null);
  // When the eligible gate changes, clear the dismissed marker so it can show.
  useEffect(() => {
    if (nextGate && nextGate.id !== dismissed) {
      setDismissed(null);
    }
  }, [nextGate, dismissed]);

  const onConfirm = useCallback(() => {
    if (!nextGate) return;
    setNarrativeFlag(nextGate.completionFlag, true);
    setDismissed(nextGate.id);
  }, [nextGate, setNarrativeFlag]);

  const onDismiss = useCallback(() => {
    if (!nextGate) return;
    setDismissed(nextGate.id);
  }, [nextGate]);

  if (!nextGate || dismissed === nextGate.id) return null;

  return <GatePanel gate={nextGate} archetype={archetype} onConfirm={onConfirm} onDismiss={onDismiss} />;
}

/* ─── Gate panel ─── */

function GatePanel({
  gate,
  archetype,
  onConfirm,
  onDismiss,
}: {
  gate: MechanicTutorialGate;
  archetype: ApprenticeArchetype;
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  const { speakerLabel, baseLine, channeledPhrase, elaraOverlay, awarePause } =
    resolveGateLines(gate, archetype);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-3rem)] rounded-lg border border-amber-700/40 bg-zinc-950/95 backdrop-blur p-5 shadow-lg"
        data-component="mechanic-tutorial-overlay"
        data-gate-id={gate.id}
      >
        <div className="flex items-start gap-3 mb-3">
          <Sparkles size={18} className="text-amber-500 shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-widest text-amber-400">
              {speakerLabel}
            </div>
            <div className="text-sm font-medium text-zinc-200 mt-1">{gate.label}</div>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="text-zinc-600 hover:text-zinc-300 shrink-0"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>

        <p className="text-sm text-zinc-100 leading-relaxed mb-2">{baseLine}</p>

        {channeledPhrase && (
          <p className="text-sm text-zinc-300 leading-relaxed italic mb-2">
            …{channeledPhrase}
          </p>
        )}

        {awarePause && (
          <p className="text-xs text-zinc-500 leading-relaxed mb-2">{awarePause}</p>
        )}

        {elaraOverlay && (
          <p className="text-xs text-amber-300/80 italic leading-relaxed mb-3 border-l-2 border-amber-700/40 pl-3">
            Elara, quietly: "{elaraOverlay}"
          </p>
        )}

        <div className="flex items-center justify-end gap-2 mt-3">
          <button
            type="button"
            onClick={onConfirm}
            className="text-xs px-3 py-1.5 rounded-md border border-amber-600 bg-amber-900/20 hover:bg-amber-900/40 transition-colors inline-flex items-center gap-1"
          >
            <Check size={12} />
            Got it
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Speaker resolution ─── */

interface ResolvedGateLines {
  speakerLabel: string;
  baseLine: string;
  channeledPhrase?: string;
  elaraOverlay?: string;
  awarePause?: string;
}

function resolveGateLines(
  gate: MechanicTutorialGate,
  archetype: ApprenticeArchetype,
): ResolvedGateLines {
  if (gate.speaker.kind === "apprentice_channeling") {
    const topic: EngineerDomainTopic = gate.speaker.topic;
    const variant = resolveVariant(topic, archetype);
    return {
      speakerLabel: "Your Apprentice",
      baseLine: variant.base,
      channeledPhrase: variant.channeledPhrase,
      elaraOverlay: variant.elaraOverlay,
      awarePause: variant.channeledPhrase ? pickAwarePause(topic, archetype) : undefined,
    };
  }
  // Direct speaker — no channeling layer
  return {
    speakerLabel: prettySpeaker(gate.speaker.speaker),
    baseLine: gate.teaches,
  };
}

function prettySpeaker(s: string): string {
  return s
    .split("_")
    .map((p) => (p.length > 0 ? p[0].toUpperCase() + p.slice(1) : p))
    .join(" ");
}
