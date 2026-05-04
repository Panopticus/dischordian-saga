/**
 * RecruitStageVoiceOverlay — Architect & Dreamer voices during the Prelude
 *
 * Mounts on PreludePage. Watches state.currentPreludeBeat and:
 *   1. Plays the Architect's cryo-HUD cues (architect specs steps 1–3)
 *      during the early beats — beat_a / beat_a5. He IS the awakening
 *      protocol; he speaks first, before Elara, before vision.
 *   2. Surfaces the Dreamer's "wake gently" line if the unsanctioned-
 *      choice flag is set (matches recruitStageCueSequence's
 *      surfacedBy: "refuse_role" routing).
 *   3. Plays the unmistakable post-Recording-0 line once Recording 0
 *      has been heard.
 *   4. After the cues finish, persists architect_recruit_voice_played
 *      so the overlay self-suppresses on subsequent Prelude visits.
 *
 * Each cue is click-to-advance with a small typewriter-ish reveal.
 * The overlay does not gate the Prelude — it sits over the cryo
 * backdrop and steps aside when done.
 *
 * See plan §3 (Recruit Stage — Architect & Dreamer Entry).
 */

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import {
  ARCHITECT_AWAKENING_CUES,
  type ArchitectAwakeningCue,
} from "@shared/architectAwakeningLines";
import {
  DREAMER_AWAKENING_CUES,
  type DreamerAwakeningCue,
} from "@shared/dreamerAwakeningLines";

const ARCHITECT_PLAYED_FLAG = "architect_recruit_voice_played";
const DREAMER_WAKE_GENTLY_PLAYED_FLAG = "dreamer_wake_gently_played";
const POST_R0_DREAMER_PLAYED_FLAG = "dreamer_post_r0_played";

const DREAMER_UNSANCTIONED_FLAG = "dreamer_unsanctioned_choice";
const ENGINEER_RECORDING_0_FLAG = "engineer_recording_0_discovered";

const EARLY_BEAT_IDS = ["beat_a", "beat_a5"] as const;

type ResolvedCue =
  | { kind: "architect"; cue: ArchitectAwakeningCue }
  | { kind: "dreamer"; cue: DreamerAwakeningCue };

export default function RecruitStageVoiceOverlay() {
  const { state, setNarrativeFlag } = useGame();
  const flags = state.narrativeFlags ?? {};
  const beatId = state.currentPreludeBeat ?? "";

  const queue = useMemo<readonly ResolvedCue[]>(() => {
    const out: ResolvedCue[] = [];

    // 1. Architect specs — only during the early beats, only once
    const architectPlayed = Boolean(flags[ARCHITECT_PLAYED_FLAG]);
    if (
      !architectPlayed &&
      EARLY_BEAT_IDS.includes(beatId as (typeof EARLY_BEAT_IDS)[number])
    ) {
      // Steps 1, 2, 3 — the spec recital that lands first
      for (const cue of ARCHITECT_AWAKENING_CUES) {
        if (cue.step <= 3 && cue.trigger === "auto") {
          out.push({ kind: "architect", cue });
        }
      }
    }

    // 2. Dreamer "wake gently" — if player has made an unsanctioned choice
    //    and the line hasn't surfaced yet
    const dreamerSurfaced = Boolean(flags[DREAMER_WAKE_GENTLY_PLAYED_FLAG]);
    if (Boolean(flags[DREAMER_UNSANCTIONED_FLAG]) && !dreamerSurfaced) {
      const wakeGently = DREAMER_AWAKENING_CUES.find(
        (c) => c.id === "dream_wake_gently",
      );
      if (wakeGently) out.push({ kind: "dreamer", cue: wakeGently });
    }

    // 3. Post-Recording-0 unmistakable cue — once Recording 0 is heard
    const postR0Played = Boolean(flags[POST_R0_DREAMER_PLAYED_FLAG]);
    if (Boolean(flags[ENGINEER_RECORDING_0_FLAG]) && !postR0Played) {
      const postR0 = DREAMER_AWAKENING_CUES.find(
        (c) => c.id === "dream_post_recording_zero",
      );
      if (postR0) out.push({ kind: "dreamer", cue: postR0 });
    }

    return out;
  }, [flags, beatId]);

  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setIndex(0);
    setDone(queue.length === 0);
  }, [queue]);

  const advance = () => {
    if (done) return;
    if (index < queue.length - 1) {
      setIndex(index + 1);
      return;
    }
    // Persist the per-source completion flags
    if (queue.some((c) => c.kind === "architect")) {
      setNarrativeFlag(ARCHITECT_PLAYED_FLAG, true);
    }
    if (queue.some((c) => c.kind === "dreamer" && c.cue.id === "dream_wake_gently")) {
      setNarrativeFlag(DREAMER_WAKE_GENTLY_PLAYED_FLAG, true);
    }
    if (
      queue.some(
        (c) => c.kind === "dreamer" && c.cue.id === "dream_post_recording_zero",
      )
    ) {
      setNarrativeFlag(POST_R0_DREAMER_PLAYED_FLAG, true);
    }
    setDone(true);
  };

  if (done || queue.length === 0) return null;
  const current = queue[index];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer select-none"
        onClick={advance}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            advance();
          }
        }}
        data-component="recruit-stage-voice-overlay"
        data-cue-source={current.kind}
        data-cue-id={current.kind === "architect" ? current.cue.id : current.cue.id}
      >
        <CuePanel resolved={current} />
      </motion.div>
    </AnimatePresence>
  );
}

function CuePanel({ resolved }: { resolved: ResolvedCue }) {
  const isArchitect = resolved.kind === "architect";
  const speakerLabel = isArchitect ? "The Architect" : "The Dreamer";
  const text = resolved.cue.text || "(humming)";

  return (
    <motion.div
      key={resolved.cue.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5 }}
      className={`max-w-2xl mx-6 rounded-lg border ${
        isArchitect ? "border-stone-600/40" : "border-amber-700/30"
      } ${isArchitect ? "bg-stone-950/95" : "bg-amber-950/30"} p-8`}
    >
      <div className="text-xs uppercase tracking-widest mb-3 opacity-70">
        {speakerLabel}
      </div>
      <p
        className={`text-xl leading-relaxed ${
          isArchitect ? "text-stone-100" : "text-amber-100 italic"
        }`}
      >
        {text}
      </p>
      <p className="mt-6 text-xs opacity-50 italic">click or press space to continue</p>
    </motion.div>
  );
}
