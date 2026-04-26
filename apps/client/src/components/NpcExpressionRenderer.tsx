/* ═══════════════════════════════════════════════════════
   NPC EXPRESSION RENDERER — Phase 4 client UI
   ───────────────────────────────────────────────────────
   Renders an NpcLine across all 6 canonical expression channels:
     verbal              — text bubble with VO + portrait
     glyph               — geometric overlay (1-9s persistence)
     posture             — animated posture-shift bracket frame
     sound               — audio-cue + non-verbal text-frame
     first_word          — singular pause + banner + breath-stack
     named_personality   — full verbal NPC bubble with name banner

   The renderer is the canonical bridge between the bank's
   expressionChannel field (apps/shared/npcs/types.ts) and the
   on-screen player experience.
   ═══════════════════════════════════════════════════════ */
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo } from "react";
import type { NpcLine, ExpressionChannel } from "@shared/npcs/types";
import { NPC_REGISTRY } from "@shared/npcs/registry";

// --- Props ---------------------------------------------------------------

export interface NpcExpressionRendererProps {
  /** The line to render. */
  line: NpcLine;
  /** Optional callback when the line finishes rendering (auto-dismiss). */
  onComplete?: () => void;
  /** Optional override for default duration (ms). */
  durationMs?: number;
  /** Optional player-perception toggle: show narrator-frame for non-verbal? */
  showNarratorFrame?: boolean;
}

// --- Per-channel display defaults ----------------------------------------

const CHANNEL_DEFAULTS: Record<ExpressionChannel, { defaultDurationMs: number; showText: boolean }> = {
  verbal: { defaultDurationMs: 6000, showText: true },
  named_personality: { defaultDurationMs: 6000, showText: true },
  glyph: { defaultDurationMs: 1800, showText: false },
  posture: { defaultDurationMs: 4000, showText: false },
  sound: { defaultDurationMs: 3000, showText: false },
  first_word: { defaultDurationMs: 5500, showText: true },
};

// --- Component -----------------------------------------------------------

export function NpcExpressionRenderer({
  line,
  onComplete,
  durationMs,
  showNarratorFrame = true,
}: NpcExpressionRendererProps) {
  const channel: ExpressionChannel = line.expressionChannel ?? "verbal";
  const profile = NPC_REGISTRY[line.npcKey];
  const defaults = CHANNEL_DEFAULTS[channel];
  const dismissAfter = durationMs ?? line.durationMs ?? defaults.defaultDurationMs;

  useEffect(() => {
    if (line.dismissible === "manual") return;
    const timer = setTimeout(() => onComplete?.(), dismissAfter);
    return () => clearTimeout(timer);
  }, [line.lineId, dismissAfter, onComplete, line.dismissible]);

  const speakerLabel = useMemo(() => profile?.name ?? line.npcKey, [profile, line.npcKey]);

  switch (channel) {
    case "verbal":
    case "named_personality":
      return <VerbalBubble line={line} speakerLabel={speakerLabel} />;
    case "glyph":
      return <GlyphOverlay line={line} showNarratorFrame={showNarratorFrame} />;
    case "posture":
      return <PostureFrame line={line} showNarratorFrame={showNarratorFrame} />;
    case "sound":
      return <SoundCue line={line} showNarratorFrame={showNarratorFrame} />;
    case "first_word":
      return <FirstWordBanner line={line} speakerLabel={speakerLabel} />;
    default:
      return null;
  }
}

// --- Verbal / named-personality (text bubble + portrait) ----------------

function VerbalBubble({ line, speakerLabel }: { line: NpcLine; speakerLabel: string }) {
  return (
    <AnimatePresence>
      <motion.div
        key={line.lineId}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        className="npc-expression npc-expression--verbal"
        data-channel={line.expressionChannel ?? "verbal"}
        data-npc-key={line.npcKey}
      >
        <div className="npc-expression__speaker">{speakerLabel}</div>
        <div className="npc-expression__text">{line.text}</div>
      </motion.div>
    </AnimatePresence>
  );
}

// --- Glyph (visual-only overlay; description as narrator-frame) ----------

function GlyphOverlay({
  line,
  showNarratorFrame,
}: {
  line: NpcLine;
  showNarratorFrame: boolean;
}) {
  return (
    <AnimatePresence>
      <motion.div
        key={line.lineId}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.4 }}
        className="npc-expression npc-expression--glyph"
        data-channel="glyph"
        data-npc-key={line.npcKey}
      >
        <div
          className="npc-expression__glyph-mark"
          aria-label="Non-verbal glyph"
          data-line-id={line.lineId}
        />
        {showNarratorFrame ? (
          <div className="npc-expression__narrator-frame">{line.text}</div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}

// --- Posture (animated stance shift; description as narrator-frame) -----

function PostureFrame({
  line,
  showNarratorFrame,
}: {
  line: NpcLine;
  showNarratorFrame: boolean;
}) {
  return (
    <AnimatePresence>
      <motion.div
        key={line.lineId}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="npc-expression npc-expression--posture"
        data-channel="posture"
        data-npc-key={line.npcKey}
      >
        <div
          className="npc-expression__posture-bracket"
          aria-label="Non-verbal posture shift"
          data-line-id={line.lineId}
        />
        {showNarratorFrame ? (
          <div className="npc-expression__narrator-frame">{line.text}</div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}

// --- Sound (audio cue + optional narrator-frame) ------------------------

function SoundCue({
  line,
  showNarratorFrame,
}: {
  line: NpcLine;
  showNarratorFrame: boolean;
}) {
  return (
    <AnimatePresence>
      <motion.div
        key={line.lineId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="npc-expression npc-expression--sound"
        data-channel="sound"
        data-npc-key={line.npcKey}
        data-vo-id={line.voId ?? line.lineId}
      >
        <div className="npc-expression__sound-icon" aria-label="Non-verbal sound" />
        {showNarratorFrame ? (
          <div className="npc-expression__narrator-frame">{line.text}</div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}

// --- First word (singular event banner + canonical pause) ---------------

function FirstWordBanner({
  line,
  speakerLabel,
}: {
  line: NpcLine;
  speakerLabel: string;
}) {
  return (
    <AnimatePresence>
      <motion.div
        key={line.lineId}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.6 }}
        className="npc-expression npc-expression--first-word"
        data-channel="first_word"
        data-npc-key={line.npcKey}
        role="status"
      >
        <div className="npc-expression__banner">
          {speakerLabel} spoke for the first time.
        </div>
        <div className="npc-expression__first-word-text">{line.text}</div>
      </motion.div>
    </AnimatePresence>
  );
}

// --- Test helper export ---------------------------------------------------

/**
 * Pure helper exported for tests + non-React callers. Returns the channel
 * + default duration that NpcExpressionRenderer would apply for a given
 * line. Useful for verifying gate logic without mounting React.
 */
export function resolveChannelDefaults(line: NpcLine): {
  channel: ExpressionChannel;
  defaultDurationMs: number;
  showText: boolean;
} {
  const channel: ExpressionChannel = line.expressionChannel ?? "verbal";
  return { channel, ...CHANNEL_DEFAULTS[channel] };
}
