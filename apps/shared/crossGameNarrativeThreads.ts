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

export const CROSS_GAME_THREADS: readonly CrossGameThread[] = [
  CADES_FALL,
  PROGRAMMERS_GIFT,
  LAST_WORDS_ECHO,
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
