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
  /** When true, dismiss after the human's reply instead of waiting
   *  on a follow-up. Default-strip "Acknowledged" and "[stay silent]"
   *  set this true. */
  closesDialog?: boolean;
  /** Side-effect callback fired when the player picks this choice
   *  (e.g. log a clue, set a flag). Runs before the human VO. */
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

  // When the human reply ends → either close (dialog ends) or move
  // into Elara follow-up.
  useEffect(() => {
    if (phase !== "humanSpeaking") return;
    const a = humanVO.audio;
    const advance = () => {
      if (!pickedChoice) { setPhase("closed"); return; }
      if (pickedChoice.closesDialog) { setPhase("closed"); return; }
      // Either the follow-up VO id or the inline fallback text — at
      // least one must be set or we just close.
      if (pickedChoice.elaraFollowUpVoId) {
        setFollowUpText(pickedChoice.elaraFollowUpText ?? "");
        setPhase("elaraFollowUp");
        return;
      }
      if (pickedChoice.elaraFollowUpText) {
        setFollowUpText(pickedChoice.elaraFollowUpText);
        setPhase("elaraFollowUp");
        return;
      }
      setPhase("closed");
    };
    if (!a) {
      // Manifest miss → no human audio fired. Advance immediately
      // after a short beat so the avatar swap is visible.
      const t = setTimeout(advance, 350);
      return () => clearTimeout(t);
    }
    a.addEventListener("ended", advance);
    return () => a.removeEventListener("ended", advance);
  }, [phase, humanVO.audio, pickedChoice]);

  // Drive the Elara follow-up.
  useEffect(() => {
    if (phase !== "elaraFollowUp") return;
    if (!pickedChoice?.elaraFollowUpVoId) return;
    elaraVO.speak(pickedChoice.elaraFollowUpVoId);
  }, [phase, pickedChoice]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== "elaraFollowUp") return;
    const a = elaraVO.audio;
    if (!a) {
      // No follow-up audio (text-only mode) → close after a short read.
      const t = setTimeout(() => setPhase("closed"), 2500);
      return () => clearTimeout(t);
    }
    const onEnded = () => setPhase("closed");
    a.addEventListener("ended", onEnded);
    return () => a.removeEventListener("ended", onEnded);
  }, [phase, elaraVO.audio]);

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
    if (responses && responses.length > 0) return responses;
    return DEFAULT_RESPONSES();
  }, [responses]);

  const speakingNow = phase === "elaraSpeaking" || phase === "elaraFollowUp";
  const liveAudio =
    phase === "humanSpeaking" ? humanVO.audio :
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
