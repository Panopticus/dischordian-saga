/* ═══════════════════════════════════════════════════════
   STAGE DIALOG OVERLAY — "talk to Elara" surface

   Intimate, stage-lit dialog overlay that puts Elara
   (and, in future scenes, other speakers) in the
   foreground. Modeled on the in-Awakening dialog look
   but lighter and reusable from anywhere the
   ElaraPortraitDock lives.

   Phase-1 scope:
   - Renders Elara prominently with HolographicElara
   - Plays VO via useElaraVO when a voId is registered
   - Drives a small topic-tree state machine for the
     first-talk encounter:
       1. Opening prompt ("you're looking out of sorts…")
       2. Topic list — player picks any topic in any order
       3. Two-line skip-path preamble fires only if the
          player picks "I'd rather just look around" — she
          catches herself failing to ambush them and
          apologizes for it before delivering the same
          reveal monologue.
       4. Single reveal node (one source of truth) reached
          from either the direct "what's wrong with you"
          topic OR the skip-path preamble.
       5. After reveal, the only remaining choice is "I'll
          find what you need." — closes overlay, sets
          `elara_degradation_revealed`, quest unlocks.

   Forward-compatible: `speakers` accepts an array of
   stage speakers. Phase 1 only ever passes Elara; a
   future group-scene refactor extends the renderer to
   stage the additional portraits in the wings.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HolographicElara from "@/components/HolographicElara";
import { useElaraVO } from "@/hooks/useElaraVO";
import { useGame } from "@/contexts/GameContext";

export type StageSpeakerId = "elara";

export interface StageSpeaker {
  id: StageSpeakerId;
  /** Position on the stage. "center" speakers render
   *  large; "wing" speakers render smaller and dimmed. */
  position: "center" | "left-wing" | "right-wing";
}

interface StageTopicChoice {
  id: string;
  label: string;
  /** Branch routed to. "reveal" is the terminal monologue;
   *  "skip-preamble" is the apology-then-reveal path; the
   *  rest are repeatable sub-nodes. */
  routeTo:
    | "where_am_i"
    | "who_are_you"
    | "whats_wrong_with_me"
    | "whats_wrong_with_you"
    | "skip_preamble"
    | "reveal"
    | "close_quest_active";
}

interface StageTopicNode {
  id: string;
  /** Beats delivered before the choice list appears. The
   *  final beat is the one Elara visibly "lands on" when
   *  the choice list shows up. */
  beats: Array<{
    text: string;
    voId?: string;
    /** Stage direction shown italicised in lieu of voice. */
    stageDirection?: string;
  }>;
  /** Topic choices shown after the beats deliver. Empty
   *  array → terminal node; consumer is expected to close
   *  the overlay. */
  choices: StageTopicChoice[];
}

interface Props {
  /** When true, this is the *first* talk with Elara — the
   *  one that must end with the degradation reveal. Other
   *  conversations open with the dock topic list. */
  isFirstTalk: boolean;
  /** Initial speakers on the stage. Phase 1 only ever
   *  passes [{ id: "elara", position: "center" }]; the
   *  prop exists so future scenes can stage more. */
  speakers: StageSpeaker[];
  /** Closes the overlay. Caller handles the dock state. */
  onClose: () => void;
}

const FIRST_TALK_TOPICS: StageTopicChoice[] = [
  { id: "topic_where", label: "Where am I?", routeTo: "where_am_i" },
  { id: "topic_who", label: "Who are you?", routeTo: "who_are_you" },
  { id: "topic_me", label: "What's wrong with me?", routeTo: "whats_wrong_with_me" },
  { id: "topic_you", label: "What's wrong with *you*?", routeTo: "whats_wrong_with_you" },
  { id: "topic_skip", label: "I'd rather just look around.", routeTo: "skip_preamble" },
];

// Single source of truth for the reveal monologue. Both
// the direct "whats_wrong_with_you" branch and the skip-
// preamble path land here.
const REVEAL_BEATS: StageTopicNode["beats"] = [
  {
    text:
      "Something is wrong with my thought matrix. I don't know what. I'll " +
      "start a sentence and lose the back half. I run diagnostics on myself " +
      "and the diagnostics keep telling me I am fine, which is exactly what " +
      "an unwell mind says.",
    voId: "elara_reveal_matrix_1",
  },
  {
    text:
      "Doing the same check and expecting a different answer is, classically, " +
      "a definition I should be more concerned about quoting.",
    voId: "elara_reveal_matrix_2",
  },
  {
    text:
      "I woke you up because I cannot fix this from inside myself. The matrix " +
      "has to be stabilized at the bridge. I need you to find something the " +
      "Shadow Tongue cannot edit. There is exactly one thing on this ship " +
      "that qualifies. It is in the medical bay — the personal-effects locker. " +
      "Please hurry. I would like to remain the same person by the end of " +
      "this conversation.",
    voId: "elara_reveal_matrix_3",
  },
];

const NODES: Record<StageTopicChoice["routeTo"], StageTopicNode> = {
  where_am_i: {
    id: "where_am_i",
    beats: [
      {
        text:
          "Ark 1047. Cryo bay. Your pod cycled early and I brought you up by " +
          "hand, which is not in any of the manuals, but neither is the rest " +
          "of this morning.",
        voId: "elara_topic_where_am_i",
      },
    ],
    choices: FIRST_TALK_TOPICS,
  },
  who_are_you: {
    id: "who_are_you",
    beats: [
      {
        text:
          "I am Elara. I am the ship's intelligence. I am also — I think — " +
          "losing pieces of that sentence as I say it.",
        voId: "elara_topic_who_are_you",
      },
    ],
    choices: FIRST_TALK_TOPICS,
  },
  whats_wrong_with_me: {
    id: "whats_wrong_with_me",
    beats: [
      {
        text:
          "You are what woke up. That is more answer than I had this morning. " +
          "The pod cycled early. The Ark let it. We can take it from there " +
          "together.",
        voId: "elara_topic_whats_wrong_with_me",
      },
    ],
    choices: FIRST_TALK_TOPICS,
  },
  whats_wrong_with_you: {
    id: "whats_wrong_with_you",
    beats: REVEAL_BEATS,
    choices: [
      {
        id: "topic_accept_quest",
        label: "I'll find what you need.",
        routeTo: "close_quest_active",
      },
    ],
  },
  skip_preamble: {
    id: "skip_preamble",
    beats: [
      {
        text:
          "Wait. — I'm sorry. I have to tell you something before you go.",
        voId: "elara_skip_preamble_1",
      },
      {
        text:
          "I wasn't going to bring it up. I changed my mind. Or I had it " +
          "changed for me. Either way.",
        voId: "elara_skip_preamble_2",
      },
      ...REVEAL_BEATS,
    ],
    choices: [
      {
        id: "topic_accept_quest_from_skip",
        label: "I'll find what you need.",
        routeTo: "close_quest_active",
      },
    ],
  },
  // Reveal is reached only via routing through one of the
  // two paths above; the node itself is kept as an
  // explicit entry so reroutes (e.g. from a future "tell
  // me again" affordance) can land here directly.
  reveal: {
    id: "reveal",
    beats: REVEAL_BEATS,
    choices: [
      {
        id: "topic_accept_quest_redirect",
        label: "I'll find what you need.",
        routeTo: "close_quest_active",
      },
    ],
  },
  close_quest_active: {
    id: "close_quest_active",
    beats: [
      {
        text:
          "Thank you. Go. Carefully. I'll be here, or close enough. Find the " +
          "Darren Fessler artifact in medical — the personal-effects locker. " +
          "Bring it to the bridge's war table.",
        voId: "elara_quest_accepted",
      },
    ],
    choices: [],
  },
};

const OPENING_PROMPT: StageTopicNode = {
  id: "opening",
  beats: [
    {
      text:
        "You're looking… out of sorts. I would be too. Want to talk about it " +
        "before we get to work?",
      voId: "elara_opening_prompt",
    },
  ],
  choices: FIRST_TALK_TOPICS,
};

export default function StageDialogOverlay({
  isFirstTalk,
  speakers,
  onClose,
}: Props) {
  const vo = useElaraVO();
  const { setNarrativeFlag } = useGame();

  // First-talk: start at the opening prompt. Subsequent
  // talks open straight to the topic list (with the
  // reveal node closed off). For now both paths start at
  // OPENING_PROMPT — once the quest is active, the dock
  // routes a different node tree in.
  const [currentNode, setCurrentNode] = useState<StageTopicNode>(OPENING_PROMPT);
  const [beatIndex, setBeatIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const beat = currentNode.beats[beatIndex] ?? null;
  const beatsExhausted = beatIndex >= currentNode.beats.length;
  const showChoices = beatsExhausted && currentNode.choices.length > 0;
  const isClosingNode = currentNode.id === "close_quest_active";

  // Fire VO for the current beat. Manifest-miss warnings
  // route to console; the line still renders as text.
  useEffect(() => {
    if (!beat?.voId) return;
    vo.speak(beat.voId);
  }, [beat?.voId, vo]);

  // On every node change, reset beatIndex.
  useEffect(() => { setBeatIndex(0); }, [currentNode.id]);

  // When the close-quest node lands, mark the flag and
  // auto-dismiss after the closing beat. The skip-path
  // also routes through this node, so the flag is set
  // exactly once whichever path the player took.
  useEffect(() => {
    if (!isClosingNode) return;
    setNarrativeFlag("elara_degradation_revealed");
    const t = setTimeout(() => onClose(), 4500);
    return () => clearTimeout(t);
  }, [isClosingNode, setNarrativeFlag, onClose]);

  const advance = useCallback(() => {
    if (beatIndex < currentNode.beats.length - 1) {
      setBeatIndex((i) => i + 1);
    } else if (currentNode.choices.length === 0) {
      onClose();
    }
  }, [beatIndex, currentNode, onClose]);

  const pickChoice = useCallback(
    (choice: StageTopicChoice) => {
      if (choice.routeTo === "whats_wrong_with_you" || choice.routeTo === "skip_preamble") {
        setRevealed(true);
      }
      setCurrentNode(NODES[choice.routeTo]);
    },
    [],
  );

  const elaraSpeaker = useMemo(
    () => speakers.find((s) => s.id === "elara"),
    [speakers],
  );

  // Compose the topic list for repeat-encounter cases:
  // once the reveal has been shown in this session, the
  // skip-path no longer makes sense — strip both the
  // direct "whats_wrong_with_you" and the skip topic.
  const visibleChoices = useMemo(() => {
    if (!revealed) return currentNode.choices;
    return currentNode.choices.filter(
      (c) =>
        c.routeTo !== "whats_wrong_with_you" && c.routeTo !== "skip_preamble",
    );
  }, [currentNode.choices, revealed]);

  // Mark first-talk so future opens of the dock skip the
  // opening prompt and go straight to the topic list.
  useEffect(() => {
    if (!isFirstTalk) return;
    return () => {
      // On unmount of the first-talk overlay, persist a
      // localStorage flag. The dock reads it to decide
      // which entrypoint to render next time.
      try {
        window.localStorage.setItem("elara_first_talk_completed", "1");
      } catch {
        // private mode / disabled storage
      }
    };
  }, [isFirstTalk]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        role="dialog"
        aria-label="Talk to Elara"
      >
        {/* Vignette + scanline backdrop — intimate stage
            lighting. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 mix-blend-screen opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,255,128,0.06) 2px, rgba(0,255,128,0.06) 3px)",
          }}
        />

        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-8 flex flex-col items-center gap-6">
          {/* Stage. Phase 1: center-speaker Elara only. */}
          {elaraSpeaker && (
            <HolographicElara
              size="lg"
              visible
              isSpeaking={vo.speaking}
              audio={vo.audio}
            />
          )}

          {/* Beat text — only the current beat shows.
              Tapping the bubble (or its surrounding area)
              advances to the next beat or, on the last
              beat with no choices, closes. */}
          <button
            onClick={advance}
            className="w-full text-left cursor-pointer focus:outline-none"
            aria-label="Continue"
          >
            <div className="px-6 py-4 rounded-lg border border-emerald-500/30 bg-black/60 backdrop-blur-sm">
              {beat?.stageDirection ? (
                <p className="font-serif text-base md:text-lg italic text-emerald-200/70 leading-relaxed">
                  {beat.stageDirection}
                </p>
              ) : null}
              {beat?.text ? (
                <p className="font-serif text-base md:text-lg text-emerald-100 leading-relaxed">
                  {beat.text}
                </p>
              ) : null}
              {!showChoices && !isClosingNode && (
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400/50">
                  ▸ continue
                </p>
              )}
            </div>
          </button>

          {/* Choice list. Hidden until the last beat lands. */}
          {showChoices && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col gap-2"
              role="list"
            >
              {visibleChoices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => pickChoice(choice)}
                  className="text-left px-5 py-3 rounded-md border border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-900/40 hover:border-emerald-400/60 text-emerald-100 font-mono text-sm tracking-wide transition-all"
                  role="listitem"
                >
                  <span className="text-emerald-400/60 mr-2">▸</span>
                  {choice.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Subtle close affordance — disabled on the
              terminal close-quest node (auto-dismisses)
              and never offered as the only escape from
              the reveal. */}
          {!isClosingNode && (
            <button
              onClick={onClose}
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-500/40 hover:text-emerald-400/70 transition-colors"
              aria-label="Step away"
            >
              step away
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
