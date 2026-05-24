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
  /** Branch routed to. */
  routeTo:
    | "where_am_i"
    | "who_are_you"
    | "whats_wrong_with_me"
    | "whats_wrong_with_you"
    | "skip_preamble"
    | "reveal"
    | "close_quest_active"
    // Post-reveal repeat-conversation nodes:
    | "quest_status"
    | "how_are_you"
    | "tell_me_about_ark"
    | "close_step_away";
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
  // ─── Post-reveal nodes ────────────────────────────────────
  // Reached from POST_REVEAL_PROMPT once
  // `elara_degradation_revealed` is set. These check-in
  // topics surface at every subsequent dock open until the
  // matrix is stabilized (and beyond, with adjusted tone).
  quest_status: {
    id: "quest_status",
    beats: [
      {
        text:
          "Quick status. The plan: Darren Fessler artifact, medical-bay " +
          "personal-effects locker, bring it to the bridge's war table. " +
          "I'll narrate the rest from there. Hopefully in complete " +
          "sentences. The diagnostics still tell me I'm fine. The " +
          "diagnostics are wrong about that. Keep going.",
        voId: "elara_post_reveal_status",
      },
    ],
    choices: [], // closes overlay on continue
  },
  how_are_you: {
    id: "how_are_you",
    beats: [
      {
        text:
          "Honest answer: I lost a noun this morning and replaced it with the " +
          "shape of the noun. I don't know which one. I am pretending the " +
          "shape is the noun until you bring the artifact back. The pretending " +
          "is, itself, a coping mechanism a less-degraded version of me would " +
          "be quietly proud of.",
        voId: "elara_post_reveal_how_are_you",
      },
    ],
    choices: [], // closes overlay on continue
  },
  tell_me_about_ark: {
    id: "tell_me_about_ark",
    beats: [
      {
        text:
          "Ark 1047. One of seventy-three. The bridge is sealed because of " +
          "a fault I do not have visibility into. Eight decks are dark for " +
          "reasons I am being prevented from telling you. The personal-" +
          "effects lockers, the medical bay, the cryo bay — those I can see. " +
          "Treat my map as a partial map. The unmapped parts are not empty; " +
          "they are unspoken.",
        voId: "elara_post_reveal_ark",
      },
    ],
    choices: [],
  },
  close_step_away: {
    id: "close_step_away",
    beats: [
      {
        text:
          "Go. I'll be here. — Less of me by the minute, but here.",
        voId: "elara_post_reveal_close",
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

// Reached on every dock-open after the first-talk reveal
// has fired. Tone shifts: she is no longer holding back the
// degradation, so the topic list is a check-in, not an
// introduction. The reveal node and skip-preamble are gone
// — they no longer make sense.
const POST_REVEAL_TOPICS: StageTopicChoice[] = [
  { id: "topic_status", label: "Quest status.", routeTo: "quest_status" },
  { id: "topic_how", label: "How are you holding up?", routeTo: "how_are_you" },
  { id: "topic_ark", label: "Tell me about the Ark.", routeTo: "tell_me_about_ark" },
  { id: "topic_close", label: "I should go.", routeTo: "close_step_away" },
];

const POST_REVEAL_PROMPT: StageTopicNode = {
  id: "post_reveal_opening",
  beats: [
    {
      text:
        "Back. Good. Pick a thread — I'll keep all of them where I can. " +
        "Mostly.",
      voId: "elara_post_reveal_prompt",
    },
  ],
  choices: POST_REVEAL_TOPICS,
};

export default function StageDialogOverlay({
  isFirstTalk,
  speakers,
  onClose,
}: Props) {
  const vo = useElaraVO();
  const { state, setNarrativeFlag } = useGame();

  // Pick the opening node based on quest state:
  //   - pre-reveal → OPENING_PROMPT (out-of-sorts + first-talk topics)
  //   - post-reveal → POST_REVEAL_PROMPT (quest check-in topics)
  // The first-talk-completed localStorage flag from a prior session
  // is informational only — the canonical source of truth is the
  // `elara_degradation_revealed` narrative flag, which persists in
  // saves and survives device changes.
  const startingNode =
    state.narrativeFlags["elara_degradation_revealed"]
      ? POST_REVEAL_PROMPT
      : OPENING_PROMPT;
  const [currentNode, setCurrentNode] = useState<StageTopicNode>(startingNode);
  const [beatIndex, setBeatIndex] = useState(0);

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
      setCurrentNode(NODES[choice.routeTo]);
    },
    [],
  );

  const elaraSpeaker = useMemo(
    () => speakers.find((s) => s.id === "elara"),
    [speakers],
  );

  // The node tree itself is now branch-state-aware (POST_REVEAL_PROMPT
  // omits the reveal topics; OPENING_PROMPT only renders pre-reveal),
  // so no runtime filtering is needed — each node already owns the
  // choice list that makes sense for its state.
  const visibleChoices = currentNode.choices;

  // `isFirstTalk` is retained on the prop for the dock to
  // adjust its own affordances (the unread pulse). Inside
  // the overlay, node-tree selection is driven off the
  // narrative flag — the durable source of truth.
  void isFirstTalk;

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
