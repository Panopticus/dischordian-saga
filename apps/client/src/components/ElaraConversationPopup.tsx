/* ═══════════════════════════════════════════════════════
   ELARA CONVERSATION POPUP — Section 9 two-way inspection dialog.

   Replaces the inline ElaraPopup that lived in ArkExplorerPage. The
   evolution: every Elara narration that fires from a hotspot click
   is now a small conversation. After Elara finishes (audio end OR
   typewriter done), 2-3 player response choices appear. Picking one
   plays a human-side line and may trigger an Elara follow-up.

   State machine:
     idle
       → elaraSpeaking          (line text typing, optional VO playing)
       → awaitingPlayerChoice   (Elara done, response strip live)
       → humanSpeaking          (a choice picked, human VO playing)
       → elaraFollowUp          (optional follow-up line)
       → closed                 (popup dismissed)

   When a choice has `closesDialog: true`, we skip humanSpeaking and
   drop directly to closed. When a choice has no human VO in the
   manifest, the human-speaking phase is instant — the dialog still
   advances to follow-up or close.

   The popup also shows a Holographic Elara (top-left of the card)
   whose visemes drive from the live audio element when one is
   attached. When it's the human's turn, the avatar swaps to a small
   human portrait beneath the human's reply. ════════════════════ */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import HolographicElara from "@/components/HolographicElara";
import type { NpcVoApi } from "@/hooks/useNpcVO";

/* ─── Types ───
   The popup accepts choices in a shape that's a strict superset of
   both client-side `ElaraResponseChoice` and shared
   `MysteryResponseChoice`. The runtime adapter in ArkExplorerPage
   normalizes its inputs to this shape. */
export interface ConversationChoice {
  id: string;
  label: string;
  /** Optional VO id for Elara's follow-up line. */
  elaraFollowUpVoId?: string;
  /** Optional inline text for the follow-up when no VO has been
   *  generated yet. The popup will fall back to the VO id-derived
   *  manifest entry when both are present. */
  elaraFollowUpText?: string;
  /** Detective (the Human companion) follow-up VO id. When set, the
   *  popup plays the Detective's reply through `humanVO.speak` and
   *  shows it in the "DETECTIVE" speaker slot. Used for the "Ask the
   *  Human." branch where the Detective speaks rather than echo the
   *  player's framing. */
  detectiveFollowUpVoId?: string;
  /** Inline text for the Detective's follow-up. Falls back to
   *  typewriter-only when no VO has been recorded yet. */
  detectiveFollowUpText?: string;
  /** When true, skip the "YOU" echo step and go directly into the
   *  next companion phase (Detective if `detectiveFollowUp*` is set,
   *  else Elara follow-up). Used by the "Ask the Human." choice so
   *  the dialog feels like the player gestured rather than spoke. */
  skipPlayerEcho?: boolean;
  /** Recursive branching — when set, after the leading follow-up
   *  finishes the popup re-enters `awaitingPlayerChoice` with these
   *  choices instead of closing. Powers BioWare-style multi-step
   *  branches and the "Stay with Elara's read." / "Trust the
   *  Detective." cost-bearing fork. */
  followUpResponses?: ConversationChoice[];
  /** When true, dismiss after the human's reply instead of waiting
   *  on a follow-up. Default-strip "Acknowledged" and "[stay silent]"
   *  set this true. */
  closesDialog?: boolean;
  /** Side-effect callback fired when the player picks this choice
   *  (e.g. log a clue, set a flag, apply a stability/light delta).
   *  Runs before any audio. */
  onPick?: () => void;
}

export interface ElaraConversationPopupProps {
  /** Elara's narration. Single string for hotspot dialog, array for
   *  multi-beat room intros. */
  text: string | string[];
  /** Optional manifest id; when set, the parent's elaraVo.speak is
   *  called and the avatar lip-syncs to the resulting audio. */
  voId?: string;
  /** Legacy CDN URL fallback for room intros that haven't been
   *  migrated to manifest ids yet (e.g. elaraIntroVoUrl). */
  voUrl?: string;
  /** Player response choices. Empty/undefined → default 3-button
   *  strip (Acknowledged / Tell me more / [stay silent]). */
  responses?: ConversationChoice[];
  /** Fired when the conversation closes (any path). */
  onClose: () => void;
  /** Page-level useElaraVO instance. Shared with the companion-presence
   *  badge so both observe the same playback state. */
  elaraVo: NpcVoApi;
  /** Page-level useHumanVO instance. */
  humanVo: NpcVoApi;
}

const DEFAULT_RESPONSES = (
  onTellMeMoreText?: string,
): ConversationChoice[] => [
  { id: "default.acknowledge", label: "Acknowledged.", closesDialog: true },
  {
    id: "default.tell-me-more",
    label: "Tell me more.",
    elaraFollowUpText:
      onTellMeMoreText ??
      "I'd say more if I had more — but you saw it too. Trust your read for now.",
  },
  { id: "default.silent", label: "[stay silent]", closesDialog: true },
];

type Phase =
  | "elaraSpeaking"
  | "awaitingPlayerChoice"
  | "humanSpeaking"
  | "detectiveSpeaking"
  | "elaraFollowUp"
  | "closed";

export function ElaraConversationPopup({
  text,
  voId,
  voUrl,
  responses,
  onClose,
  elaraVo,
  humanVo,
}: ElaraConversationPopupProps) {
  /* ─── Beat machine for the leading Elara line ─── */
  const beats = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const [beatIndex, setBeatIndex] = useState(0);
  useEffect(() => { setBeatIndex(0); }, [beats]);
  const isFinalBeat = beatIndex >= beats.length - 1;
  const currentBeat = beats[Math.min(beatIndex, beats.length - 1)];

  const [displayed, setDisplayed] = useState("");
  const [typewriterDone, setTypewriterDone] = useState(false);

  /* ─── Phase state ─── */
  const [phase, setPhase] = useState<Phase>("elaraSpeaking");
  const [pickedChoice, setPickedChoice] = useState<ConversationChoice | null>(null);
  const [followUpText, setFollowUpText] = useState<string>("");
  /** When the player drills into a recursive branch, the active
   *  response strip is this list instead of the top-level `responses`
   *  prop. Reset to `null` whenever a fresh top-level conversation
   *  begins (i.e. on `voId`/`voUrl`/`text` change). */
  const [activeResponses, setActiveResponses] = useState<ConversationChoice[] | null>(null);

  /* ─── Audio ───
     The hooks are owned by the parent (the Ark page) so the
     companion-presence badge sees the same `speaking` flag. We just
     consume the API surface from props. */
  const elaraVO = elaraVo;
  const humanVO = humanVo;
  const legacyAudioRef = useRef<HTMLAudioElement | null>(null);

  // Kick off the leading Elara line. Prefer manifest id (voId) over
  // the legacy CDN url (voUrl). Both fall through silently if missing.
  useEffect(() => {
    setPhase("elaraSpeaking");
    setPickedChoice(null);
    setFollowUpText("");
    setActiveResponses(null);
    if (voId) {
      elaraVO.speak(voId);
      return;
    }
    if (voUrl) {
      const audio = new Audio(voUrl);
      audio.crossOrigin = "anonymous";
      audio.volume = 0.92;
      legacyAudioRef.current = audio;
      audio.play().catch(() => { /* autoplay blocked */ });
      return () => {
        audio.pause();
        legacyAudioRef.current = null;
      };
    }
    // No VO at all — phase advances when the typewriter finishes,
    // handled below.
  }, [voId, voUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // When Elara's audio ends (manifest path), drop into player-choice.
  useEffect(() => {
    if (phase !== "elaraSpeaking") return;
    if (!voId) return;
    if (!elaraVO.audio) return;
    const a = elaraVO.audio;
    const onEnded = () => setPhase("awaitingPlayerChoice");
    a.addEventListener("ended", onEnded);
    return () => a.removeEventListener("ended", onEnded);
  }, [phase, voId, elaraVO.audio]);

  // Same for the legacy URL path.
  useEffect(() => {
    if (phase !== "elaraSpeaking") return;
    const a = legacyAudioRef.current;
    if (!a) return;
    const onEnded = () => setPhase("awaitingPlayerChoice");
    a.addEventListener("ended", onEnded);
    return () => a.removeEventListener("ended", onEnded);
  }, [phase]);

  // Auto-advance multi-beat narrations against the live audio's
  // currentTime, apportioned by character count. Same trick the
  // original ElaraPopup used. No-ops when there's only one beat.
  useEffect(() => {
    if (phase !== "elaraSpeaking") return;
    const audio = elaraVO.audio ?? legacyAudioRef.current;
    if (!audio || beats.length <= 1) return;
    const totalChars = beats.reduce((s, b) => s + b.length, 0) || 1;
    const cum: number[] = [];
    beats.reduce((acc, b, i) => { const next = acc + b.length; cum[i] = next; return next; }, 0);
    const tick = () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      const charsAt = totalChars * (audio.currentTime / audio.duration);
      let target = beats.length - 1;
      for (let i = 0; i < beats.length; i++) {
        if (charsAt < cum[i]) { target = i; break; }
      }
      setBeatIndex((p) => (target > p ? target : p));
    };
    audio.addEventListener("timeupdate", tick);
    return () => audio.removeEventListener("timeupdate", tick);
  }, [phase, beats, elaraVO.audio]);

  // Per-beat typewriter. Skipped when audio is driving us.
  useEffect(() => {
    setDisplayed("");
    setTypewriterDone(false);
    const audioActive = !!(voId && elaraVO.audio) || !!legacyAudioRef.current;
    if (audioActive) {
      setDisplayed(currentBeat);
      setTypewriterDone(true);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      if (i < currentBeat.length) {
        setDisplayed(currentBeat.slice(0, i + 1));
        i++;
      } else {
        setTypewriterDone(true);
        clearInterval(id);
      }
    }, 20);
    return () => clearInterval(id);
  }, [currentBeat, voId, elaraVO.audio]);

  // No-VO path: advance to choice once the typewriter completes the
  // final beat.
  useEffect(() => {
    if (phase !== "elaraSpeaking") return;
    if (voId || voUrl) return;
    if (typewriterDone && isFinalBeat) {
      setPhase("awaitingPlayerChoice");
    }
  }, [phase, typewriterDone, isFinalBeat, voId, voUrl]);

  // Drive the human reply when a choice is picked.
  useEffect(() => {
    if (phase !== "humanSpeaking") return;
    if (!pickedChoice) return;
    humanVO.speak(pickedChoice.id);
  }, [phase, pickedChoice]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Decide the next phase after a companion line ends. The Detective
   *  takes priority over Elara so an "Ask the Human." choice lands him
   *  in the dialog before any rebuttal. Recursive `followUpResponses`
   *  re-enter the choice strip; a bare `closesDialog` falls through. */
  const advanceFromChoice = (choice: ConversationChoice | null, justSpoke: "human" | "detective" | "elara") => {
    if (!choice) { setPhase("closed"); return; }
    // Detective branch — only fires once per choice (after the player echo).
    if (justSpoke === "human" && (choice.detectiveFollowUpVoId || choice.detectiveFollowUpText)) {
      setFollowUpText(choice.detectiveFollowUpText ?? "");
      setPhase("detectiveSpeaking");
      return;
    }
    // Elara follow-up branch — fires after either the player echo or the
    // Detective's line, whichever came first.
    if ((justSpoke === "human" || justSpoke === "detective") &&
        (choice.elaraFollowUpVoId || choice.elaraFollowUpText)) {
      setFollowUpText(choice.elaraFollowUpText ?? "");
      setPhase("elaraFollowUp");
      return;
    }
    // Recursive branching — re-enter the choice strip with the new set.
    if (choice.followUpResponses && choice.followUpResponses.length > 0) {
      setActiveResponses(choice.followUpResponses);
      setPickedChoice(null);
      setPhase("awaitingPlayerChoice");
      return;
    }
    setPhase("closed");
  };

  // When the human reply ends → either close, branch into the
  // Detective, or move into Elara follow-up.
  useEffect(() => {
    if (phase !== "humanSpeaking") return;
    const a = humanVO.audio;
    const advance = () => {
      if (!pickedChoice) { setPhase("closed"); return; }
      if (pickedChoice.closesDialog) { setPhase("closed"); return; }
      advanceFromChoice(pickedChoice, "human");
    };
    if (!a) {
      const t = setTimeout(advance, 350);
      return () => clearTimeout(t);
    }
    a.addEventListener("ended", advance);
    return () => a.removeEventListener("ended", advance);
  }, [phase, humanVO.audio, pickedChoice]); // eslint-disable-line react-hooks/exhaustive-deps

  // Drive the Detective's line. The Detective uses the same humanVO
  // hook (humanVoManifest.json gains detective-namespaced ids when VO
  // ships); the popup just labels the slot differently.
  useEffect(() => {
    if (phase !== "detectiveSpeaking") return;
    if (!pickedChoice?.detectiveFollowUpVoId) return;
    humanVO.speak(pickedChoice.detectiveFollowUpVoId);
  }, [phase, pickedChoice]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== "detectiveSpeaking") return;
    const a = humanVO.audio;
    const advance = () => advanceFromChoice(pickedChoice, "detective");
    if (!a) {
      const t = setTimeout(advance, 2500);
      return () => clearTimeout(t);
    }
    a.addEventListener("ended", advance);
    return () => a.removeEventListener("ended", advance);
  }, [phase, humanVO.audio, pickedChoice]); // eslint-disable-line react-hooks/exhaustive-deps

  // Drive the Elara follow-up.
  useEffect(() => {
    if (phase !== "elaraFollowUp") return;
    if (!pickedChoice?.elaraFollowUpVoId) return;
    elaraVO.speak(pickedChoice.elaraFollowUpVoId);
  }, [phase, pickedChoice]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== "elaraFollowUp") return;
    const a = elaraVO.audio;
    const advance = () => advanceFromChoice(pickedChoice, "elara");
    if (!a) {
      const t = setTimeout(advance, 2500);
      return () => clearTimeout(t);
    }
    a.addEventListener("ended", advance);
    return () => a.removeEventListener("ended", advance);
  }, [phase, elaraVO.audio, pickedChoice]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close the popup once we hit the "closed" phase.
  useEffect(() => {
    if (phase === "closed") onClose();
  }, [phase, onClose]);

  /* ─── Handlers ─── */
  const handleClose = () => {
    elaraVO.stop();
    humanVO.stop();
    if (legacyAudioRef.current) {
      legacyAudioRef.current.pause();
      legacyAudioRef.current = null;
    }
    setPhase("closed");
  };

  const pickResponse = (choice: ConversationChoice) => {
    if (phase !== "awaitingPlayerChoice") return;
    choice.onPick?.();
    setPickedChoice(choice);
    // Skip the "YOU" echo when the choice is a gesture (e.g. "Ask the
    // Human.") rather than a spoken framing. Routes straight into the
    // Detective if his line is authored, then falls through to the
    // Elara/follow-up/close cascade.
    if (choice.skipPlayerEcho) {
      if (choice.detectiveFollowUpVoId || choice.detectiveFollowUpText) {
        setFollowUpText(choice.detectiveFollowUpText ?? "");
        setPhase("detectiveSpeaking");
        return;
      }
      if (choice.elaraFollowUpVoId || choice.elaraFollowUpText) {
        setFollowUpText(choice.elaraFollowUpText ?? "");
        setPhase("elaraFollowUp");
        return;
      }
      if (choice.followUpResponses && choice.followUpResponses.length > 0) {
        setActiveResponses(choice.followUpResponses);
        setPickedChoice(null);
        // Stay in awaitingPlayerChoice — just swap the strip.
        return;
      }
      setPhase("closed");
      return;
    }
    setPhase("humanSpeaking");
  };

  // Skip the leading Elara line if the player clicks the typewriter
  // mid-stream. Mirrors the original popup's [next]/[dismiss] beat
  // affordance for multi-beat narrations.
  const handleAdvance = () => {
    if (phase !== "elaraSpeaking") return;
    if (!typewriterDone) {
      setDisplayed(currentBeat);
      setTypewriterDone(true);
      return;
    }
    if (!isFinalBeat) {
      setBeatIndex((i) => Math.min(i + 1, beats.length - 1));
      return;
    }
    setPhase("awaitingPlayerChoice");
  };

  const effectiveResponses = useMemo<ConversationChoice[]>(() => {
    // Recursive branch active → use that strip instead of the top-level prop.
    if (activeResponses && activeResponses.length > 0) return activeResponses;
    if (responses && responses.length > 0) return responses;
    return DEFAULT_RESPONSES();
  }, [responses, activeResponses]);

  const speakingNow =
    phase === "elaraSpeaking" || phase === "elaraFollowUp" || phase === "detectiveSpeaking";
  const liveAudio =
    phase === "humanSpeaking" || phase === "detectiveSpeaking" ? humanVO.audio :
    phase === "elaraFollowUp" || phase === "elaraSpeaking" ? elaraVO.audio :
    null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="fixed top-4 left-4 right-4 sm:top-auto sm:bottom-4 sm:left-auto sm:right-4 sm:w-[460px] z-50"
    >
      <div
        className="rounded-lg p-4 relative"
        style={{
          background: "linear-gradient(135deg, var(--bg-void) 0%, var(--bg-spotlight) 100%)",
          border: "1px solid color-mix(in oklch, var(--energy-primary) 25%, transparent)",
          boxShadow: "0 0 var(--space-lg) color-mix(in oklch, var(--energy-primary) 8%, transparent), 0 var(--space-md) var(--space-2xl) color-mix(in oklch, var(--bg-void) 50%, transparent)",
          backdropFilter: "blur(var(--physics-blur, 20px))",
        }}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 rounded-md border border-[var(--glass-border)] text-muted-foreground/70 hover:text-white hover:bg-muted/40 transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="flex gap-3">
          {/* Holographic Elara — visemes drive from whichever audio is
              live this phase. During humanSpeaking the avatar holds
              "monitoring" so the player visually sees the conversation
              hand off rather than a mute Elara. */}
          <div className="flex-shrink-0">
            <HolographicElara
              size="sm"
              isSpeaking={speakingNow}
              audio={liveAudio}
            />
          </div>

          <div className="flex-1 min-w-0">
            {(phase === "elaraSpeaking" || phase === "awaitingPlayerChoice") && (
              <>
                <p className="font-mono text-[9px] text-[var(--neon-cyan)] tracking-[0.2em] mb-1">ELARA</p>
                <p className="font-mono text-xs text-foreground/90 leading-relaxed">
                  {displayed}
                  {!typewriterDone && (
                    <span className="inline-block w-1.5 h-3 bg-[var(--neon-cyan)] ml-0.5 animate-pulse" />
                  )}
                </p>
              </>
            )}

            {phase === "humanSpeaking" && pickedChoice && (
              <>
                <p className="font-mono text-[9px] text-[var(--energy-system)] tracking-[0.2em] mb-1">YOU</p>
                <p className="font-mono text-xs text-foreground/90 leading-relaxed">
                  {pickedChoice.label}
                </p>
              </>
            )}

            {phase === "elaraFollowUp" && (
              <>
                <p className="font-mono text-[9px] text-[var(--neon-cyan)] tracking-[0.2em] mb-1">ELARA</p>
                <p className="font-mono text-xs text-foreground/90 leading-relaxed">
                  {followUpText || "..."}
                </p>
              </>
            )}

            {phase === "detectiveSpeaking" && (
              <>
                <p className="font-mono text-[9px] text-[var(--energy-warning,_#d97706)] tracking-[0.2em] mb-1">THE&nbsp;HUMAN</p>
                <p className="font-mono text-xs text-foreground/90 leading-relaxed italic">
                  {followUpText || "..."}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Beat counter for multi-beat narrations (room intros). Only
            visible while Elara is delivering the leading line. */}
        {phase === "elaraSpeaking" && beats.length > 1 && (
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="font-mono text-[9px] text-[var(--neon-cyan)]/30 tracking-wider">
              {beatIndex + 1} / {beats.length}
            </span>
            <button
              onClick={handleAdvance}
              className="font-mono text-[10px] text-[var(--neon-cyan)]/50 hover:text-[var(--neon-cyan)] transition-colors"
            >
              {typewriterDone ? (isFinalBeat ? "[next]" : "[next]") : "[skip]"}
            </button>
          </div>
        )}

        {/* Single-beat skip — let the player short-circuit the typing
            without a beat counter taking up space. */}
        {phase === "elaraSpeaking" && beats.length <= 1 && !typewriterDone && (
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleAdvance}
              className="font-mono text-[10px] text-[var(--neon-cyan)]/40 hover:text-[var(--neon-cyan)] transition-colors"
            >
              [skip]
            </button>
          </div>
        )}

        {/* Response strip — only visible once Elara is done with her
            leading line. Default 3-button strip when responses are
            empty; authored set wins when present. */}
        {phase === "awaitingPlayerChoice" && (
          <div className="mt-3 flex flex-col gap-1.5">
            {effectiveResponses.map((choice) => (
              <button
                key={choice.id}
                onClick={() => pickResponse(choice)}
                className="text-left font-mono text-[11px] text-foreground/80 hover:text-white px-3 py-2 rounded-md border border-[color-mix(in_oklch,var(--energy-primary)_18%,transparent)] hover:border-[color-mix(in_oklch,var(--energy-primary)_45%,transparent)] hover:bg-[color-mix(in_oklch,var(--energy-primary)_8%,transparent)] transition-colors"
              >
                <span className="text-[var(--neon-cyan)]/60 mr-2">&gt;</span>
                {choice.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ElaraConversationPopup;
