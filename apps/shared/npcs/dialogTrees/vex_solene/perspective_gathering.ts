// apps/shared/npcs/dialogTrees/vex_solene/perspective_gathering.ts
//
// Vex Solène — perspective gathering + challenge entry tree.
//
// Voice register: pre-engineer_zero_confirmed Hitman frame, with
// trailing-word cadence per the bible §1.1 (inventory followed by
// a courtesy). Vex does NOT voice "Engineer" or "Engineer Zero"
// (§1.2 silence rule); references the man she carries by deixis
// ("him", "he", "the one who"). She also does not perform
// contrition or call herself Agent Zero.
//
// Cross-NPC echoes: when the player carries the Degen's memory or
// has defeated wraith_calder, additional root choices surface.
// Vex reads them with the Maestro's accuracy — she knows the
// cadence of who you've already been at the table with.
//
// VO line ids follow vex.perspective.<aspect>; MP3s land via
// `pnpm vo:npc-first-meet --only=vex_solene`.

import type { NpcDialogTree } from "../types";

export const VEX_SOLENE_PERSPECTIVE_GATHERING: NpcDialogTree = {
  id: "vex-solene-perspective-gathering",
  npcKey: "vex_solene",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "vex_solene",
      voLineId: "vex.perspective.root",
      requiresRevealStage: "eyes_of_reality",
      onscreenText:
        "I know what you came for. I know who sent you. I know which of the questions you have prepared are the ones I will answer and which are the ones you have brought because you would rather ask them than do nothing. Hello. I'm glad it's you. Ask.",
      choices: [
        {
          label: "How many rooms are you actually counting?",
          nextId: "aspect_counted_audience",
          sets: "vex_solene:counted_audience",
          trustDelta: 2,
        },
        {
          label: "Whose mission are you carrying?",
          nextId: "aspect_inherited_mission",
          sets: "vex_solene:inherited_mission",
          trustDelta: 3,
          publicFlag: "vex_revealed_inherited_mission_to_player",
        },
        {
          label: "What's underneath the Hitman face?",
          nextId: "aspect_diplomat_underneath",
          sets: "vex_solene:diplomat_underneath",
          trustDelta: 2,
          publicFlag: "vex_revealed_diplomat_to_player",
        },
        // Cross-NPC echoes — the Maestro reads what you've already
        // sat at a table with.
        {
          label: "I carry the Degen's memory.",
          nextId: "echo_degen_memory",
          requires: "player_carries_the_degen_memory",
          trustDelta: 1,
        },
        {
          label: "I beat the Hierophant at his lectern.",
          nextId: "echo_wraith_memory",
          requires: "player_carries_wraith_calder_memory",
          trustDelta: 1,
        },
        {
          label: "I'd like to play you.",
          nextId: "challenge_offer",
        },
      ],
    },

    /* ─── Aspect 1: counted audience (motive — the surveillance
         frame) ─── */
    aspect_counted_audience: {
      id: "aspect_counted_audience",
      npcKey: "vex_solene",
      voLineId: "vex.perspective.counted_audience",
      requiresRevealStage: "eyes_of_reality",
      onscreenText:
        "Right now? Four. The room we are in. The room the Coda chair is in, which is reading this exchange in encrypted text. The room you came from, which is recording you on cadence the way I am. And the room you have not yet entered, which I am preparing in advance because preparation is the cheapest courtesy I can offer it. I am always counting the rooms. The counting is what makes the diplomacy possible.",
      autoNext: "after_aspect",
    },

    /* ─── Aspect 2: inherited mission (wound — the lack-of-memory
         canon) ─── */
    aspect_inherited_mission: {
      id: "aspect_inherited_mission",
      npcKey: "vex_solene",
      voLineId: "vex.perspective.inherited_mission",
      requiresRevealStage: "eyes_of_reality",
      onscreenText:
        "I carry the work of a man whose memories I do not have. I will not name him. I will reference him by the work he left and by the chair I built that sounds like him without being him. The intellect is here. The memory is not. I have looked. I have stopped looking. The Coda is the form the mission took when the man it was meant for could not continue carrying it. I am the chair held out for the work, not for him.",
      autoNext: "after_aspect",
    },

    /* ─── Aspect 3: diplomat underneath (contradiction — Hitman
         face / diplomat behind) ─── */
    aspect_diplomat_underneath: {
      id: "aspect_diplomat_underneath",
      npcKey: "vex_solene",
      voLineId: "vex.perspective.diplomat_underneath",
      requiresRevealStage: "eyes_of_reality",
      onscreenText:
        "Diplomatic precision. I was a diplomat before I was a contractor; I am still a diplomat in every component of the work except the closing instrument. A contract is a treaty. A treaty is a contract. The difference is who is at the table to sign it. When the parties cannot be brought to the table, the Coda goes to them. That is the only difference between what I do and what an embassy does. The Hitman face is the closing instrument. The diplomat is the entire rest of the negotiation.",
      autoNext: "after_aspect",
    },

    /* ─── Cross-NPC echoes ─── */
    echo_degen_memory: {
      id: "echo_degen_memory",
      npcKey: "vex_solene",
      voLineId: "vex.perspective.echo_degen_memory",
      requiresRevealStage: "eyes_of_reality",
      onscreenText:
        "He gives a small ration back. He chooses who. The arithmetic on you arrived in this room two beats before you did. I know the cadence; the Coda has a file on the cadence; the file has its own opinion. We will not consult the file out loud. We will simply note the cadence has been counted and proceed.",
      autoNext: "after_aspect",
    },

    echo_wraith_memory: {
      id: "echo_wraith_memory",
      npcKey: "vex_solene",
      voLineId: "vex.perspective.echo_wraith_memory",
      requiresRevealStage: "eyes_of_reality",
      onscreenText:
        "Then you have sat at the lectern. Good. The body that did the dying sits well; the body that does the writing sits better. The Coda has reached out to the chamber before; the chamber answered in writing; the writing was longer than the question and shorter than the answer. The Maestro and the Hierophant are not at the same table. We are at adjacent tables. You have now been at both. That counts.",
      autoNext: "after_aspect",
    },

    /* ─── Re-entry ─── */
    after_aspect: {
      id: "after_aspect",
      npcKey: "vex_solene",
      voLineId: "vex.perspective.after_aspect",
      requiresRevealStage: "eyes_of_reality",
      onscreenText:
        "Another question. Or the table. Either is in cadence.",
      choices: [
        {
          label: "How many rooms are you counting?",
          nextId: "aspect_counted_audience",
          requires: "vex_perspective_re_entry_ok",
          sets: "vex_solene:counted_audience",
          trustDelta: 1,
        },
        {
          label: "Whose mission are you carrying?",
          nextId: "aspect_inherited_mission",
          requires: "vex_perspective_re_entry_ok",
          sets: "vex_solene:inherited_mission",
          trustDelta: 2,
        },
        {
          label: "What's underneath the Hitman face?",
          nextId: "aspect_diplomat_underneath",
          requires: "vex_perspective_re_entry_ok",
          sets: "vex_solene:diplomat_underneath",
          trustDelta: 1,
        },
        {
          label: "Play me.",
          nextId: "challenge_offer",
        },
        {
          label: "I'll close this room.",
          nextId: "terminal_come_back",
        },
      ],
    },

    /* ─── Challenge offer — Vex does not perform reluctance ─── */
    challenge_offer: {
      id: "challenge_offer",
      npcKey: "vex_solene",
      voLineId: "vex.perspective.challenge_offer",
      requiresRevealStage: "eyes_of_reality",
      onscreenText:
        "A table. Then yes. I will deal the way the Coda deals: accurately, briefly, and without theatre. You will play the way you play, which is what I am here to read. The Maestro takes one card on your loss; the Maestro folds the tray on your win. The deeper the room you asked about, the deeper the tray. Sit. Hello. Play.",
      choices: [
        {
          label: "Deal.",
          nextId: "challenge_accepted",
          challenge: { npcKey: "vex_solene" },
          publicFlag: "vex_challenged_by_player",
        },
        {
          label: "Not in this room.",
          nextId: "terminal_come_back",
        },
      ],
    },

    challenge_accepted: {
      id: "challenge_accepted",
      npcKey: "vex_solene",
      voLineId: "vex.perspective.challenge_accepted",
      requiresRevealStage: "eyes_of_reality",
      onscreenText:
        "Then we play. The cadence is yours; the contract is mine; the room is both.",
    },

    terminal_come_back: {
      id: "terminal_come_back",
      npcKey: "vex_solene",
      voLineId: "vex.perspective.terminal_come_back",
      requiresRevealStage: "eyes_of_reality",
      onscreenText:
        "Then the room closes on cadence. The Coda remains. So do I. Come back when the question has finished forming. They tend to.",
    },
  },
};
