/* ═══════════════════════════════════════════════════════
   MOL'GARATH ENDGAME LAYER

   Mol'Garath is NOT a school teacher. Per his bible
   (apps/shared/npcs/bibles/the_game_master.md §3.2 — he is
   "Mol'Garath the Unmaker — CEO" of the Hierarchy, the only
   non-faculty entity in this whole architecture) and his
   epilogue (apps/shared/tcg-core/story/molGarathEpilogue.ts),
   he is the saga's endgame REFEREE. He is "not the Architect's
   ally. Not the Game Master's enemy."

   Access path:
     1. Player wins Tier 3 of the chess climb (chessClimbTiers.ts).
        Mol'Garath leaves without comment.
     2. Later, the player accepts a private audience.
        MOL_GARATH_EPILOGUE in molGarathEpilogue.ts fires.
     3. After the audience, the THREE endgame gates below open.

   What he gates (per plan §7.5):
     • LABYRINTH ANNOTATIONS — retroactive margin notes on
       every Engineer recording, citing which Labyrinth trap
       that recording was dismantling. The Engineer told only
       Mol'Garath that he finished the Labyrinth. The audience
       reveals it; the annotations ship the receipts.
     • TRAPS-BEING-DESIGNED FEED — a live readable feed showing
       which traps are currently being designed across the saga.
       Updated every hour. Fed by livingUniverseEvents.ts.
     • CONSPIRACY BOARD FINAL CONNECTION — the Hamlet board's
       final clue. Mol'Garath is the only being who refereed the
       run where the Engineer named the Warlord's substrate.
       The audience confirms it.

   See plan §7.5 (Mol'Garath's Audience — The Long View Layer).
   ═══════════════════════════════════════════════════════ */

import type { HoloRecordingId } from "./engineerRecordings";

/* ─── LABYRINTH ANNOTATIONS ─── */

/**
 * After Mol'Garath's audience unlocks, every Engineer recording
 * surfaces a margin annotation in his voice — a retroactive
 * footnote citing which Labyrinth trap that recording was
 * dismantling. The Engineer left the trap-list at the end of
 * the Labyrinth; Mol'Garath has been keeping it for centuries.
 */
export interface LabyrinthAnnotation {
  /** Engineer recording this annotation attaches to. */
  readonly recordingId: HoloRecordingId;
  /** Which trap the Engineer was disassembling, in Mol'Garath's voice. */
  readonly trapName: string;
  /** The annotation, in Mol'Garath's voice (warm, almost cheerful). */
  readonly annotation: string;
}

export const LABYRINTH_ANNOTATIONS: readonly LabyrinthAnnotation[] = [
  {
    recordingId: "holo_trap_is_you",
    trapName: "Trap Class 0 — The Curriculum That Refuses to End",
    annotation:
      "He left this one for last. The trap that finishes itself by being read by you. I have refereed five hundred curricula that tried this. None of them worked. His worked. He did not tell me how. I AM still figuring it out. Notice with discipline.",
  },
  {
    recordingId: "holo_wake_the_bench",
    trapName: "Trap Class 14 — The Frequency That Owns You",
    annotation:
      "There is a trap in the Labyrinth where a tool only obeys its first owner. He inverted it. The bench hums in three frequencies because he refused to be the only owner. The third frequency is yours. He budgeted you in.",
  },
  {
    recordingId: "holo_princes_notebook",
    trapName: "Trap Class 7 — The Loop That Eats Its Own Children",
    annotation:
      "The first Celebration was running a four-year reset on its parents — a children-eating loop the Hierarchy sold as 'ceremonial childhood.' He took the goggles, looked once, and dismantled forty-three death traps before anyone noticed the pattern broke. The parents kept living the same lives. The children stopped dying.",
  },
  {
    recordingId: "holo_worlds_i_saved",
    trapName: "Trap Class 22 — The Roster of the Counted Lost",
    annotation:
      "Most designers leave a roster of the saved. He left a roster of the counted lost — the children he did not reach in time. He recited the names every morning at the bench for the rest of his life. I was supposed to comfort him. I never did.",
  },
  {
    recordingId: "holo_line_they_crossed",
    trapName: "Trap Class 31 — The Tool That Becomes a Weapon",
    annotation:
      "He resisted weapon-design until they took Kael. After they took Kael, he built four weapons in eleven days. All four were elegant. None of them killed anyone — they returned the people who had been taken. The Labyrinth had no entry for that class. I wrote him in.",
  },
  {
    recordingId: "holo_which_ark",
    trapName: "Trap Class 19 — The Vessel That Decides Its Crew",
    annotation:
      "The Inception Arks were originally one vessel. He refused that. He built twelve, knowing eleven would be empty most of the time, because a vessel that decides its own crew is a trap. Yours is Ark 1047. The number is not random. He was watching for you.",
  },
  {
    recordingId: "holo_agent_zero_dispatched",
    trapName: "Trap Class 41 — The Operator Authored by the Operated-Upon",
    annotation:
      "Agent Zero's playbook was the Game Master's. The Game Master recognized it in her hands at Zenon. That recognition was the trap. The Engineer wrote the playbook. He gave it to her. He let the Hierarchy think it was theirs. The contract observed itself.",
  },
  {
    recordingId: "holo_deck_remembers",
    trapName: "Trap Class 0 (closed) — The Curriculum That Finished",
    annotation:
      "The recording you just heard is the only Labyrinth annotation written by the trap-designer himself. He did not need a referee for this one. The bench was his witness. The Deck still remembers.",
  },
];

export function getAnnotationForRecording(
  recordingId: HoloRecordingId,
): LabyrinthAnnotation | undefined {
  return LABYRINTH_ANNOTATIONS.find((a) => a.recordingId === recordingId);
}

/* ─── TRAPS-BEING-DESIGNED FEED ─── */

/**
 * Mol'Garath's audience exposes the live feed: traps currently being
 * designed across the saga, updated as Living Universe pressures shift.
 * Each entry sources from a Living Universe event id (so the feed is
 * grounded in real community-state data, per livingUniverseEvents.ts).
 *
 * The feed is visible in the player's late-game intel panel after
 * Mol'Garath's audience completes.
 */
export type TrapDesignerVoice =
  | "the_warlord"           // residual nanobot consciousness; second Celebration's eater
  | "the_architect"         // adult Archie; sanctioned syllabus
  | "the_hierarchy"         // R&D continues without the Game Master
  | "the_meme"              // broadcast traps; cultural designs
  | "shadow_tongue"         // narrative-layer edits
  | "the_necromancer"       // prestige-cycle traps
  | "the_red_death"         // post-Necromancer escalation
  | "unattributed";         // designer not yet identified

export interface TrapInDesign {
  readonly id: string;
  /** Internal label. */
  readonly label: string;
  /** Living Universe event id whose pressure feeds this trap's progress. */
  readonly livingUniverseEventId: string;
  /** Who the Labyrinth record names as the designer. */
  readonly designer: TrapDesignerVoice;
  /** Mol'Garath's one-line summary, in his almost-cheerful voice. */
  readonly description: string;
  /** What in-game system the player can disrupt the trap through. */
  readonly counterSystem: string;
}

export const TRAPS_IN_DESIGN: readonly TrapInDesign[] = [
  {
    id: "warlord_eats_second_celebration",
    label: "The Warlord eats the second Celebration",
    livingUniverseEventId: "shadow_tongue_edit",
    designer: "the_warlord",
    description:
      "The same swarm that took the first city is reading the reconstruction. Slowly. Patiently. The Mascoteers do not know they are being read. He does. So now do you.",
    counterSystem: "celebration_school_episode_replays",
  },
  {
    id: "architect_diploma_machine",
    label: "The Diploma Machine",
    livingUniverseEventId: "architect_strengthens",
    designer: "the_architect",
    description:
      "Every diploma signed at Mechronis adds a stitch to a garment the Architect is sewing. We do not know what the garment is for. He does not, either. The Dreamer might.",
    counterSystem: "mechronis_m12_refusal",
  },
  {
    id: "necromancer_buffer_overflow",
    label: "The Resurrection Buffer Overflow",
    livingUniverseEventId: "necromancer_return",
    designer: "the_necromancer",
    description:
      "Every community death loads the consciousness buffer. The buffer was designed with a hard ceiling. The community is approaching the ceiling. He has not said what happens at the ceiling. I suspect it is one of his.",
    counterSystem: "coalition_banishment_quests",
  },
  {
    id: "shadow_tongue_canon_rewrite",
    label: "The Canon Rewrite",
    livingUniverseEventId: "shadow_tongue_edit",
    designer: "shadow_tongue",
    description:
      "He is editing the Loredex while you read it. The strikethroughs in cadesNarrativeIntegration are not his joke. They are the trap. Read with the original Antiquarian entries beside them and you can see the shape of what is being removed.",
    counterSystem: "loredex_dual_narration",
  },
  {
    id: "meme_attention_economy",
    label: "The Late Night Attention Economy",
    livingUniverseEventId: "meme_broadcast_pressure",
    designer: "the_meme",
    description:
      "She is harvesting attention into a fund. The fund's purpose is not stated. She is one of three Archons I trust by reflex, so I am inclined to wait. Notice with discipline anyway.",
    counterSystem: "seasonal_event_participation",
  },
  {
    id: "red_death_post_necromancer_pressure",
    label: "Red Death Pressure Curve",
    livingUniverseEventId: "terminus_advance",
    designer: "the_red_death",
    description:
      "If the Resurrection Buffer overflows, the Red Death moves. Not before. The trap is the threshold. He is not the threshold's author. He is what waits past it.",
    counterSystem: "vortex_incursion_runs",
  },
  {
    id: "warlord_substrate_unnamed",
    label: "The Warlord's True Name (UNNAMED)",
    livingUniverseEventId: "shadow_tongue_edit",
    designer: "unattributed",
    description:
      "The substrate the Warlord lives in has a name. It has been redacted from every record I keep. I refereed the run where the Engineer named it. He named it. I heard it. I cannot recall it. The redaction is a trap I am inside. The Conspiracy Board is its key.",
    counterSystem: "hamlet_conspiracy_board_completion",
  },
];

export function getTrapsByDesigner(designer: TrapDesignerVoice): readonly TrapInDesign[] {
  return TRAPS_IN_DESIGN.filter((t) => t.designer === designer);
}

export function getTrapById(id: string): TrapInDesign | undefined {
  return TRAPS_IN_DESIGN.find((t) => t.id === id);
}

/* ─── CONSPIRACY BOARD FINAL CONNECTION ─── */

/**
 * Once the player has assembled all the Hamlet clues across the
 * Celebration episodes, Mol'Garath's audience exposes the FINAL
 * connection — the Warlord's substrate name, which the Engineer
 * named in the Labyrinth and Mol'Garath cannot quite recall (the
 * redaction is itself a trap on him).
 *
 * The mechanic:
 *   - Player must have collected: ghost_seen, uncle_blocks_messenger,
 *     banner_glitches_propaganda, ghost_speaks_the_warlord,
 *     warlord_revealed, prince_is_engineer.
 *   - Plus Mechronis branch: patron_is_architect_proxy.
 *   - Plus Mol'Garath audience completed.
 *   - Then the player names the substrate themselves, from a
 *     selection menu that includes decoys.
 *   - Correct selection = trap fires in Act 6 (canon: Goggles
 *     Arc beat 6).
 */
export interface HamletFinalConnection {
  readonly id: "hamlet_final_warlord_substrate";
  readonly requiredClues: readonly string[];
  readonly requiresMolGarathAudience: true;
  /** Substrate name candidates. ONE is canonically correct. */
  readonly candidates: readonly HamletSubstrateCandidate[];
  /** Which candidate is correct. Authored here, not exposed at runtime. */
  readonly correctCandidateId: string;
  /** Mol'Garath's voice when the player gets it right. */
  readonly correctReaction: string;
  /** Mol'Garath's voice when the player gets it wrong. */
  readonly incorrectReaction: string;
}

export interface HamletSubstrateCandidate {
  readonly id: string;
  readonly displayName: string;
  /** A clue-justification for this candidate, shown when hovered. */
  readonly justification: string;
}

export const HAMLET_FINAL_CONNECTION: HamletFinalConnection = {
  id: "hamlet_final_warlord_substrate",
  requiredClues: [
    "ghost_seen",
    "uncle_blocks_messenger",
    "banner_glitches_propaganda",
    "ghost_speaks_the_warlord",
    "warlord_revealed",
    "patron_is_architect_proxy",
    "prince_is_engineer",
  ],
  requiresMolGarathAudience: true,
  candidates: [
    {
      id: "the_uncle_himself",
      displayName: "The Uncle Himself",
      justification:
        "He spoke; he plotted; he wore the crown. The simplest answer. The Hamlet answer.",
    },
    {
      id: "the_nanobot_swarm",
      displayName: "The Nanobot Swarm",
      justification:
        "The Uncle was a vessel. The swarm was the substrate. The script you saw confirmed this.",
    },
    {
      id: "the_propaganda_layer",
      displayName: "The Propaganda Layer (Shadow Tongue's medium)",
      justification:
        "The banner glitched. The substrate that lets a face be edited onto a king is the substrate the Warlord lives in.",
    },
    {
      id: "the_loop_itself",
      displayName: "The Loop Itself (Celebration's four-year reset)",
      justification:
        "The first Celebration was a loop. The Warlord IS the loop — the institutional pattern that makes children die on schedule. The vessel and the swarm were both effects.",
    },
    {
      id: "the_architects_grief",
      displayName: "The Architect's Grief",
      justification:
        "He could not save them. His design — every Mechronis Professor, every diploma — is a refusal to grieve. The Warlord lives in the unaddressed wound.",
    },
  ],
  // The substrate the Warlord LIVES IN is the loop itself.
  // The Uncle and the swarm were instances; the propaganda layer
  // and the Architect's grief are real-but-not-substrate.
  correctCandidateId: "the_loop_itself",
  correctReaction:
    "Yes. THAT is the name. The Warlord lives in the loop. The vessel and the swarm and the propaganda were instances; the loop was the substrate. The Engineer named it on a piece of bench-paper I kept for him for seven thousand years and then could not read. You read it. The Labyrinth is shorter by one entry. Notice with discipline.",
  incorrectReaction:
    "No. That was an instance. The substrate is the thing that makes the instance possible. Try again. I am not going anywhere — I have several centuries.",
};

export function isHamletConnectionUnlocked(
  collectedClues: ReadonlySet<string>,
  molGarathAudienceCompleted: boolean,
): boolean {
  if (!molGarathAudienceCompleted) return false;
  return HAMLET_FINAL_CONNECTION.requiredClues.every((c) => collectedClues.has(c));
}
