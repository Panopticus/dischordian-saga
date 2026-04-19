/* ═══════════════════════════════════════════════════════
   CROSS-GAME NARRATIVE THREADS — Tier 4D registry scaffold

   The Dischordian Saga is a transmedia project: Loredex OS
   (the card game + narrative), Cades FPS, and Dead Man's
   Circuit share a canonical universe. Events in one game
   can canonically affect the narrative in the others, but
   there is no central registry for those threads.

   This module is the scaffold. Writers register a cross-
   game thread here; game-specific code emits "thread
   progress" events keyed by thread id; other games query
   the registry to surface consequences.

   The registry is intentionally bounded at ship: it carries
   the SHAPE and a small number of canonical seed threads.
   The content-sprint expansion adds per-thread beats the
   way Act 1 expands per-opponent dialog.

   Consumed by:
     - any game's narrative layer that wants to check
       cross-game thread state
     - crossGameNarrativeThreads.test.ts
     - docs/design/AUTHORING_CROSS_GAME_THREADS.md
   ═══════════════════════════════════════════════════════ */

export type DschGame = "loredex" | "cades_fps" | "dead_mans_circuit";

export interface CrossGameThread {
  /** Globally unique id. */
  id: string;
  /** Human-readable thread title. */
  title: string;
  /** Which games participate in this thread. */
  participatingGames: readonly DschGame[];
  /**
   * Canonical ordering of the thread's beats. Each beat is a named
   * milestone in one game that other games can react to.
   */
  beats: readonly CrossGameBeat[];
  /** The game where the thread "originates" — authoritative for canon. */
  originGame: DschGame;
}

export interface CrossGameBeat {
  /** Thread-unique id. Pattern: "{threadId}_{beatLabel}". */
  id: string;
  /** Which game emits this beat. */
  emittedBy: DschGame;
  /** Human-readable label. */
  label: string;
  /**
   * Free-form canonical description of what happens. This is NOT
   * rendered dialog — it's an authoring-reference for writers.
   */
  canonicalDescription: string;
  /**
   * Ordering key. Lower numbers fire first. Beats with the same order
   * are siblings the writer has intentionally not sequenced.
   */
  order: number;
}

/* ─── Canonical threads ─────────────────────────────────
   These three are the first threads writers will extend.
   The list is small on purpose — the authoring sprint adds
   entries the way Act 1's twelve-opponent dialog filled in
   act1OpponentDialog.ts.
   ─────────────────────────────────────────────────────── */

const CADES_FALL: CrossGameThread = {
  id: "cades_fall",
  title: "The Fall of Cades",
  originGame: "cades_fps",
  participatingGames: ["cades_fps", "loredex"],
  beats: [
    {
      id: "cades_fall_expulsion",
      emittedBy: "loredex",
      label: "Mechronis expulsion",
      canonicalDescription:
        "Iron Lion walks out of Mechronis after the Act 1 Cycle B match. The moment is a match of Loredex; the consequence lives in Cades FPS.",
      order: 1,
    },
    {
      id: "cades_fall_arrival",
      emittedBy: "cades_fps",
      label: "Arrival at Cades",
      canonicalDescription:
        "The player character in Cades FPS reaches the Cades system. Loredex acknowledges the arrival as a flag the next time the player opens the Ark.",
      order: 2,
    },
    {
      id: "cades_fall_fall",
      emittedBy: "cades_fps",
      label: "The Fall itself",
      canonicalDescription:
        "The canonical fall of Cades happens in Cades FPS. Loredex's Act 5 star map updates to mark Cades as a pilgrimage site when this beat emits.",
      order: 3,
    },
  ],
};

const PROGRAMMERS_GIFT: CrossGameThread = {
  id: "programmers_gift",
  title: "The Programmer's Gift",
  originGame: "loredex",
  participatingGames: ["loredex", "dead_mans_circuit"],
  beats: [
    {
      id: "programmers_gift_loredex_award",
      emittedBy: "loredex",
      label: "Programmer match — gift awarded",
      canonicalDescription:
        "Act 1 Cycle C — the Programmer hands the player his encoded gift. Loredex records which gift variant the player accepts.",
      order: 1,
    },
    {
      id: "programmers_gift_dmc_decoded",
      emittedBy: "dead_mans_circuit",
      label: "Gift decoded in DMC",
      canonicalDescription:
        "Dead Man's Circuit accepts the Loredex gift flag and unlocks the corresponding decoding puzzle. The puzzle outcome feeds back as a Loredex flag.",
      order: 2,
    },
  ],
};

const LAST_WORDS_ECHO: CrossGameThread = {
  id: "last_words_echo",
  title: "The Last Words Echo",
  originGame: "loredex",
  participatingGames: ["loredex", "cades_fps", "dead_mans_circuit"],
  beats: [
    {
      id: "last_words_echo_loredex_performance",
      emittedBy: "loredex",
      label: "Last Words performed",
      canonicalDescription:
        "Loredex Act 1 finale fires the Last Words witnessing song with the player's Light/Dark choice. The choice is the canonical split all three games read from.",
      order: 1,
    },
    {
      id: "last_words_echo_cades_radio",
      emittedBy: "cades_fps",
      label: "Cades hears the echo",
      canonicalDescription:
        "Cades FPS plays a localized radio fragment of Last Words in the later chapters, tuned to the player's Light/Dark branch.",
      order: 2,
    },
    {
      id: "last_words_echo_dmc_motif",
      emittedBy: "dead_mans_circuit",
      label: "DMC motif lands",
      canonicalDescription:
        "Dead Man's Circuit uses the Last Words motif as the closing theme on the matching branch.",
      order: 3,
    },
  ],
};

/* ─── Expansion threads (Tier 4D authoring pass) ─────── */

const IRON_LIONS_WAKE: CrossGameThread = {
  id: "iron_lions_wake",
  title: "Iron Lion's Wake",
  originGame: "loredex",
  participatingGames: ["loredex", "cades_fps"],
  beats: [
    {
      id: "iron_lions_wake_expulsion_witnessed",
      emittedBy: "loredex",
      label: "Engineer witnesses the expulsion",
      canonicalDescription:
        "Loredex Act 1 Cycle B — the Engineer watches Iron Lion's last match from the back row. Emits a flag Cades FPS can read to give the Iron Lion NPC a single witness-aware line in Chapter 2.",
      order: 1,
    },
    {
      id: "iron_lions_wake_cades_greeting",
      emittedBy: "cades_fps",
      label: "Iron Lion greets the player",
      canonicalDescription:
        "Cades FPS Chapter 2 — if the Loredex witness flag is set, Iron Lion's first dialog acknowledges 'I thought I recognised you from Mechronis.' Otherwise he uses the default greeting.",
      order: 2,
    },
    {
      id: "iron_lions_wake_cades_memorial",
      emittedBy: "cades_fps",
      label: "Memorial reading",
      canonicalDescription:
        "Cades FPS Chapter 7 — Iron Lion's memorial on Cades is read aloud by the Archon if the wake thread is active. Otherwise the memorial is rendered as text-only. Loredex reads the audio flag in Act 5 to unlock the 'Iron Lion Memorial Card' in the Loredex Gallery.",
      order: 3,
    },
    {
      id: "iron_lions_wake_loredex_memorial_card",
      emittedBy: "loredex",
      label: "Memorial card unlocks in Loredex",
      canonicalDescription:
        "Loredex Act 5 — Gallery unlocks the Iron Lion Memorial Card if the Cades memorial-reading flag is set. The card's art is the photograph Cades FPS's memorial displays.",
      order: 4,
    },
  ],
};

const THE_PROGRAMMERS_MATH: CrossGameThread = {
  id: "the_programmers_math",
  title: "The Programmer's Math",
  originGame: "dead_mans_circuit",
  participatingGames: ["loredex", "dead_mans_circuit"],
  beats: [
    {
      id: "the_programmers_math_dmc_puzzle_opened",
      emittedBy: "dead_mans_circuit",
      label: "Puzzle opened in DMC",
      canonicalDescription:
        "Dead Man's Circuit — the player encounters the Programmer's archived math puzzle. The puzzle is only openable if Loredex has emitted programmers_gift_loredex_award.",
      order: 1,
    },
    {
      id: "the_programmers_math_dmc_solved_honest",
      emittedBy: "dead_mans_circuit",
      label: "Puzzle solved honestly",
      canonicalDescription:
        "Dead Man's Circuit — the player solves the puzzle without the Programmer's deliberate error reinserted. Loredex reads this flag in Act 4 to give the Human a specific line about honesty being harder than efficiency.",
      order: 2,
    },
    {
      id: "the_programmers_math_dmc_solved_efficient",
      emittedBy: "dead_mans_circuit",
      label: "Puzzle solved with the error restored",
      canonicalDescription:
        "Dead Man's Circuit — the player restores the Programmer's deliberate error to shortcut the solution. Loredex reads this flag in Act 4 to give Elara a specific line about efficiency that is honest with itself.",
      order: 2,
    },
    {
      id: "the_programmers_math_loredex_act4_line",
      emittedBy: "loredex",
      label: "Act 4 reflection line fires",
      canonicalDescription:
        "Loredex Act 4 — whichever DMC solution flag is set surfaces a different reflection line during the post-Revelation Elara/Human exchange. The lines are authored; the branch is the thread.",
      order: 3,
    },
  ],
};

const SUBSTRATE_HANDSHAKE: CrossGameThread = {
  id: "substrate_handshake",
  title: "The Substrate Handshake",
  originGame: "loredex",
  participatingGames: ["loredex", "cades_fps", "dead_mans_circuit"],
  beats: [
    {
      id: "substrate_handshake_loredex_first_contact",
      emittedBy: "loredex",
      label: "Substrate first contact",
      canonicalDescription:
        "Loredex Act 1 — the first time the player hears the Human's voice through the Communications Array. Emits a flag that Cades FPS and DMC both read to enable 'substrate-aware' one-off lines later in their campaigns.",
      order: 1,
    },
    {
      id: "substrate_handshake_cades_whisper",
      emittedBy: "cades_fps",
      label: "Cades whisper",
      canonicalDescription:
        "Cades FPS Chapter 3 — if substrate_handshake_loredex_first_contact is set, a one-off radio whisper in the Cades ruins says 'I heard you hear me.' Otherwise the radio plays static. The line is never repeated.",
      order: 2,
    },
    {
      id: "substrate_handshake_dmc_signature",
      emittedBy: "dead_mans_circuit",
      label: "DMC signature in code",
      canonicalDescription:
        "Dead Man's Circuit — if substrate_handshake_loredex_first_contact is set, one of the late-game puzzles contains the Human's signature as a hidden watermark the player can reveal by rotating the code ninety degrees. Otherwise the watermark is absent.",
      order: 3,
    },
    {
      id: "substrate_handshake_loredex_act7_callback",
      emittedBy: "loredex",
      label: "Act 7 callback",
      canonicalDescription:
        "Loredex Act 7 — if both the Cades whisper and DMC signature flags are set, the Convergence Seat's post-match dialog references 'the people who heard you in the other two rooms' and credits the player for carrying the thread across three games.",
      order: 4,
    },
  ],
};

const VOX_CORRESPONDENCE: CrossGameThread = {
  id: "vox_correspondence",
  title: "Vox's Correspondence",
  originGame: "loredex",
  participatingGames: ["loredex", "dead_mans_circuit"],
  beats: [
    {
      id: "vox_correspondence_loredex_warden_passage",
      emittedBy: "loredex",
      label: "Warden grants passage",
      canonicalDescription:
        "Loredex Act 3 — the Substrate Warden grants substrate passage. The Warden files a note in Vox's Correspondence folder; the folder is a data structure Dead Man's Circuit reads directly.",
      order: 1,
    },
    {
      id: "vox_correspondence_dmc_letter_found",
      emittedBy: "dead_mans_circuit",
      label: "Vox letter found in DMC",
      canonicalDescription:
        "Dead Man's Circuit — when the Warden-passage flag is set, a new encrypted letter from Dr. Vox appears in the DMC letter-decoding module. The letter is a real canonical document; the decoding itself is a puzzle.",
      order: 2,
    },
    {
      id: "vox_correspondence_dmc_letter_decoded",
      emittedBy: "dead_mans_circuit",
      label: "Vox letter decoded",
      canonicalDescription:
        "Dead Man's Circuit — the player decodes the letter. Loredex reads this flag in Act 6 so Elara can, optionally, reference the letter's contents by quoting one specific line: 'The substrate is for the stranger who has not arrived.'",
      order: 3,
    },
  ],
};

const THE_WATCHERS_YAWN: CrossGameThread = {
  id: "the_watchers_yawn",
  title: "The Watcher's Yawn",
  originGame: "loredex",
  participatingGames: ["loredex", "cades_fps", "dead_mans_circuit"],
  beats: [
    {
      id: "the_watchers_yawn_loredex_shadow_defeated",
      emittedBy: "loredex",
      label: "Loredex defeats the Watcher's Shadow",
      canonicalDescription:
        "Loredex Act 7 — the player beats The Watcher's Shadow without triggering the Watcher's full attention. Emits a flag that Cades FPS and DMC both read to suppress one Watcher-related side effect each.",
      order: 1,
    },
    {
      id: "the_watchers_yawn_cades_weather_suppressed",
      emittedBy: "cades_fps",
      label: "Cades weather stays calm",
      canonicalDescription:
        "Cades FPS Chapter 9 — if the Watcher's-yawn flag is set, the 'Watcher weather' storm event does not occur. The level runs under clear skies and a specific NPC line acknowledges the unseasonable calm.",
      order: 2,
    },
    {
      id: "the_watchers_yawn_dmc_telemetry_clean",
      emittedBy: "dead_mans_circuit",
      label: "DMC telemetry stays clean",
      canonicalDescription:
        "Dead Man's Circuit endgame — if the Watcher's-yawn flag is set, the late-game telemetry panels do not show the specific 'observer artefact' pattern. The absence is noticed by the decoder NPC in a short line.",
      order: 3,
    },
  ],
};

const KAELS_LINEAGE_RETURN: CrossGameThread = {
  id: "kaels_lineage_return",
  title: "Kael's Lineage, Returning",
  originGame: "loredex",
  participatingGames: ["loredex", "cades_fps"],
  beats: [
    {
      id: "kaels_lineage_return_loredex_first_recruit",
      emittedBy: "loredex",
      label: "First Kael-lineage recruit",
      canonicalDescription:
        "Loredex Act 5 — the player's first successful recruitment from a Kael-lineage world. Emits a flag that Cades FPS reads to generate a unique NPC in a later mission: a descendant who is also, canonically, now one of the player's recruits.",
      order: 1,
    },
    {
      id: "kaels_lineage_return_cades_descendant_npc",
      emittedBy: "cades_fps",
      label: "Descendant NPC appears in Cades",
      canonicalDescription:
        "Cades FPS mid-campaign — a descendant NPC from the recruited Kael-lineage shows up with a specific 'we know each other in the other room' line. The NPC offers the player a side mission whose reward loops back to Loredex.",
      order: 2,
    },
    {
      id: "kaels_lineage_return_cades_side_mission_complete",
      emittedBy: "cades_fps",
      label: "Cades side mission complete",
      canonicalDescription:
        "Cades FPS — the side mission completes. Loredex reads the flag and gives the player a specific recruit-bonus: the recruit gains a second dialog option in the War Room referencing the Cades side mission by name.",
      order: 3,
    },
  ],
};

export const CROSS_GAME_THREADS: readonly CrossGameThread[] = [
  CADES_FALL,
  PROGRAMMERS_GIFT,
  LAST_WORDS_ECHO,
  IRON_LIONS_WAKE,
  THE_PROGRAMMERS_MATH,
  SUBSTRATE_HANDSHAKE,
  VOX_CORRESPONDENCE,
  THE_WATCHERS_YAWN,
  KAELS_LINEAGE_RETURN,
];

/* ─── Resolvers ─────────────────────────────────────── */

export function getThread(id: string): CrossGameThread | undefined {
  return CROSS_GAME_THREADS.find((t) => t.id === id);
}

export function getThreadsForGame(game: DschGame): readonly CrossGameThread[] {
  return CROSS_GAME_THREADS.filter((t) => t.participatingGames.includes(game));
}

/** Return beats in a thread, sorted by canonical order. */
export function getOrderedBeats(
  threadId: string,
): readonly CrossGameBeat[] {
  const thread = getThread(threadId);
  if (!thread) return [];
  return [...thread.beats].sort((a, b) => a.order - b.order);
}

/** Convenience: every beat across every thread, keyed by id. */
export function getAllBeats(): Record<string, CrossGameBeat> {
  const out: Record<string, CrossGameBeat> = {};
  for (const thread of CROSS_GAME_THREADS) {
    for (const beat of thread.beats) out[beat.id] = beat;
  }
  return out;
}
