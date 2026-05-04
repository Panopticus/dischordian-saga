/* ═══════════════════════════════════════════════════════
   ARTIST PRINCE MYSTERY — Hamlet Conspiracy Board

   The Hamlet plot threaded through Celebration School:
   the murdered King, the treacherous Uncle (Warlord), the
   prince who is also the Engineer, the school that was a
   designed loop. The player assembles clues across the 12
   Celebration episodes (and one Mechronis branch) into a
   conspiracy board whose headline question is:

       "How did the FIRST Celebration end?"

   The board's final connection is gated by Mol'Garath's
   audience (molGarathEndgameLayer.ts → HAMLET_FINAL_CONNECTION).
   Solving the board fires the trap in Act 6.

   Style: LucasArts mystery (clue-stitching, named connections,
   visual board) + Hamlet (ghost, uncle, fate) + Pixar palette
   (the second Celebration is bright; the truth underneath is dark).

   See plan §5 (Celebration School — The Mystery as Gameplay).
   ═══════════════════════════════════════════════════════ */

/** Every conspiracy clue is a discrete, narratively-meaningful card on the board. */
export type ClueId =
  | "ghost_seen"
  | "ghost_speaks_the_warlord"
  | "uncle_blocks_messenger"
  | "banner_glitches_propaganda"
  | "warlord_revealed"
  | "patron_is_architect_proxy"
  | "first_celebration_destroyed"
  | "prince_is_engineer";

export interface ClueCard {
  readonly id: ClueId;
  /** Display title on the board. */
  readonly title: string;
  /** Where the clue surfaces (episode id, e.g. celebration_c1_the_watch). */
  readonly sourceEpisodeId: string;
  /** One-sentence framing in the Antiquarian's voice (he keeps the board). */
  readonly framing: string;
  /** Pixar-magical thumbnail tag (free-form, used by frontend later). */
  readonly thumbnailTag: string;
}

export const CLUE_CARDS: readonly ClueCard[] = [
  {
    id: "ghost_seen",
    title: "The Ghost on the Ramparts",
    sourceEpisodeId: "celebration_c1_the_watch",
    framing:
      "Bernardo and Lady Malkia witnessed the King's ghost. He spoke five words: 'Beware the one who wears my crown.' I file this as the Watch Statement.",
    thumbnailTag: "ramparts_lantern_ghost",
  },
  {
    id: "uncle_blocks_messenger",
    title: "The Uncle Blocks the Messenger",
    sourceEpisodeId: "celebration_c7_the_patrons_summons",
    framing:
      "Lady Malkia tried to warn the Prince. The Uncle intercepted her and dispatched her to a 'special Game.' I file this as Tampering with a Witness.",
    thumbnailTag: "courtyard_yellow_eyes",
  },
  {
    id: "banner_glitches_propaganda",
    title: "The Banner Glitches",
    sourceEpisodeId: "celebration_c5_the_banner_glitches",
    framing:
      "The recruitment banner in the town square glitched. Faces appeared in the script. Shadow Tongue surfaced — the propaganda layer is visible to anyone with the right kind of eyes. I file this as Editorial Evidence.",
    thumbnailTag: "town_square_glitched_banner",
  },
  {
    id: "ghost_speaks_the_warlord",
    title: "The Ghost Names the Warlord",
    sourceEpisodeId: "celebration_c8_the_ghost_in_the_hall",
    framing:
      "The Prince's father returned. He said: 'Beware the Warlord. Beware the one who wears my crown.' I file this as a Direct Testimony from the Departed.",
    thumbnailTag: "hall_ghost_full",
  },
  {
    id: "warlord_revealed",
    title: "The Warlord Reveals Himself",
    sourceEpisodeId: "celebration_c11_the_uncles_verdict",
    framing:
      "The Uncle dropped the mask. Nanobot swarm visible. He spoke: 'Celebration will always be mine.' I file this as Confession of Authorship.",
    thumbnailTag: "lair_explosion_swarm",
  },
  {
    id: "patron_is_architect_proxy",
    title: "The Patron Is an Architect Proxy",
    sourceEpisodeId: "mechronis_m11_the_patrons_true_face",
    framing:
      "The Patron who has graded students at Mechronis for centuries grades on the Architect's rubric. The handwriting matches. I file this as the Cross-School Seam — the only Mechronis evidence that surfaces on this board.",
    thumbnailTag: "mechronis_patron_unmasked",
  },
  {
    id: "first_celebration_destroyed",
    title: "The First Celebration Was Destroyed",
    sourceEpisodeId: "celebration_c11_the_uncles_verdict",
    framing:
      "The reconstruction the player walks through via Hellbox is the SECOND incarnation. The first was eaten when the Warlord finished what he started. The Mascoteers do not remember dying. They were preserved before the moment.",
    thumbnailTag: "first_celebration_burns",
  },
  {
    id: "prince_is_engineer",
    title: "The Artist Prince Is the Engineer",
    sourceEpisodeId: "celebration_c12_the_last_good_day",
    framing:
      "On the Last Good Day, two boys at thirteen fixed a clock. The Prince said a line. The line is from Engineer Recording 3, word for word. The Prince IS the Engineer. The recordings the player has been hearing for hours were always his voice.",
    thumbnailTag: "bench_two_boys_clock",
  },
];

/* ─── BOARD CONNECTIONS — between clues ─── */

/**
 * Connections are the pinned strings between clue cards. Each connection
 * has prerequisites (both clues must be discovered) and unlocks an
 * inference — a deductive insight the player can name.
 */
export interface BoardConnection {
  readonly id: string;
  readonly fromClue: ClueId;
  readonly toClue: ClueId;
  /** What this connection lets the player conclude. */
  readonly inference: string;
  /** Antiquarian's voice when the player makes this connection. */
  readonly antiquarianResponse: string;
}

export const BOARD_CONNECTIONS: readonly BoardConnection[] = [
  {
    id: "conn_ghost_to_ghost_speaks",
    fromClue: "ghost_seen",
    toClue: "ghost_speaks_the_warlord",
    inference:
      "Both sightings are the same Ghost. The King returned twice — once to be witnessed, once to name his murderer.",
    antiquarianResponse:
      "Yes. He returned twice. Some of them do. The first time is for the witnesses. The second is for the heir. I have files on three other kings who did this. They are all in my archive.",
  },
  {
    id: "conn_uncle_blocks_to_warlord_revealed",
    fromClue: "uncle_blocks_messenger",
    toClue: "warlord_revealed",
    inference:
      "The Uncle who blocked Malkia and the Warlord who burned the school are the same actor.",
    antiquarianResponse:
      "Of course they are. The Hamlet pattern is robust across iterations. What's interesting to me is not that they are the same — it's that the school PROCESSED the same actor as 'sanctioned faculty' for years. Read that bureaucratic detail with care.",
  },
  {
    id: "conn_banner_to_warlord",
    fromClue: "banner_glitches_propaganda",
    toClue: "warlord_revealed",
    inference:
      "The propaganda layer was the Warlord's medium. His face was edited onto the King's. The substrate that allows that edit is what he lives in.",
    antiquarianResponse:
      "This is the inference Mol'Garath has been waiting for someone to make. I will not say more. He will.",
  },
  {
    id: "conn_first_celebration_to_prince_is_engineer",
    fromClue: "first_celebration_destroyed",
    toClue: "prince_is_engineer",
    inference:
      "The Engineer survived the first Celebration's destruction. He grew up. He built the bench. He made the trap. Every Engineer recording the player has heard is the Prince in his adult voice.",
    antiquarianResponse:
      "Yes. I have known this for a while. I did not say. I am sorry. I owed it to him to let you arrive at it the way he wanted you to — by listening to a thirteen-year-old fix a clock.",
  },
  {
    id: "conn_patron_to_first_celebration",
    fromClue: "patron_is_architect_proxy",
    toClue: "first_celebration_destroyed",
    inference:
      "The Architect grew up in the same school. He watched the first Celebration die. Mechronis is his institutional response — a school he can control, so that no Warlord eats it next time.",
    antiquarianResponse:
      "Adult Archie's grief, written into a syllabus. Now you know why every Mechronis Professor cannot improvise: improvisation is what got the first Celebration eaten. He decided 'never again' meant 'never anything new.' I file this as a Sanctioned Tragedy.",
  },
  {
    id: "conn_ghost_speaks_to_first_celebration",
    fromClue: "ghost_speaks_the_warlord",
    toClue: "first_celebration_destroyed",
    inference:
      "The Ghost King speaks from the first Celebration. The reconstruction preserves him as a recurring witness — every Hellbox visit, he can return.",
    antiquarianResponse:
      "He chose to be preserved. Not all of them choose. I find it useful to remember that.",
  },
];

/* ─── BOARD STATE HELPERS ─── */

export interface BoardState {
  readonly cluesCollected: ReadonlySet<ClueId>;
  readonly connectionsMade: ReadonlySet<string>;
}

export function getAvailableConnections(state: BoardState): readonly BoardConnection[] {
  return BOARD_CONNECTIONS.filter((c) => {
    if (state.connectionsMade.has(c.id)) return false;
    return state.cluesCollected.has(c.fromClue) && state.cluesCollected.has(c.toClue);
  });
}

export function getClueById(id: ClueId): ClueCard | undefined {
  return CLUE_CARDS.find((c) => c.id === id);
}

export function getConnectionById(id: string): BoardConnection | undefined {
  return BOARD_CONNECTIONS.find((c) => c.id === id);
}

/**
 * Total board completion percentage (0–100). 50% = all clues found,
 * other 50% = all connections made. Mol'Garath's final connection
 * is NOT counted here (it's on his endgame layer).
 */
export function boardCompletionPercent(state: BoardState): number {
  const cluePct = (state.cluesCollected.size / CLUE_CARDS.length) * 50;
  const connPct = (state.connectionsMade.size / BOARD_CONNECTIONS.length) * 50;
  return Math.round(cluePct + connPct);
}
