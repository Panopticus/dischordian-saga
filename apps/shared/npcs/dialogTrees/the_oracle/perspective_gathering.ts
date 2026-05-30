// apps/shared/npcs/dialogTrees/the_oracle/perspective_gathering.ts
//
// The Oracle — perspective gathering + challenge entry.
//
// Voice register: the Prisoner-Oracle frame (bible §1). Three
// surfaces: dream_substrate / memory_residue / cinematic_exception
// (§1.1). The Oracle and the Seer share ontological space but
// distinct surfaces — the Oracle works the substrate, the Seer
// works the bench.

import type { NpcDialogTree } from "../types";

export const THE_ORACLE_PERSPECTIVE_GATHERING: NpcDialogTree = {
  id: "the-oracle-perspective-gathering",
  npcKey: "the_oracle",
  entryNodeId: "root",
  nodes: {
    root: {
      id: "root",
      npcKey: "the_oracle",
      voLineId: "oracle.perspective.root",
      onscreenText:
        "You arrived through the canonical-substrate. The substrate canonical-noted the arrival. I noted the substrate noting. Ask the canonical-question that came with you; it is the only one I can answer in this canonical-register.",
      choices: [
        {
          label: "How does the dream-substrate carry the vision?",
          nextId: "aspect_dream_substrate",
          sets: "the_oracle:dream_substrate",
          trustDelta: 2,
        },
        {
          label: "What residues does memory leave in the substrate?",
          nextId: "aspect_memory_residue",
          sets: "the_oracle:memory_residue",
          trustDelta: 3,
          publicFlag: "oracle_revealed_memory_residue_to_player",
        },
        {
          label: "Why does the cinematic exception break the rule?",
          nextId: "aspect_cinematic_exception",
          sets: "the_oracle:cinematic_exception",
          trustDelta: 2,
        },
        {
          label: "I carry the Degen's memory.",
          nextId: "echo_degen_memory",
          requires: "player_carries_the_degen_memory",
          trustDelta: 1,
        },
        {
          label: "I sat at the Seer's bench.",
          nextId: "echo_seer_memory",
          requires: "player_carries_the_seer_memory",
          trustDelta: 2,
        },
        {
          label: "Play me through the substrate.",
          nextId: "challenge_offer",
        },
      ],
    },

    aspect_dream_substrate: {
      id: "aspect_dream_substrate",
      npcKey: "the_oracle",
      voLineId: "oracle.perspective.dream_substrate",
      onscreenText:
        "The substrate carries vision the way water carries weight — by canonical-distributing the density across the medium. The vision is canonical-not a single image; it is a canonical-pressure on every part of the substrate at once. Reading the vision is canonical-reading the pressure-pattern. The substrate canonical-prefers to be read this way; canonical-pointing at one component is the canonical-error.",
      autoNext: "after_aspect",
    },

    aspect_memory_residue: {
      id: "aspect_memory_residue",
      npcKey: "the_oracle",
      voLineId: "oracle.perspective.memory_residue",
      onscreenText:
        "Residue is canonical-what memory leaves when the canonical-event closes. The event canonical-leaves; the residue canonical-stays in the substrate. I read the residue. The substrate canonical-organises the residue by canonical-relevance, not by canonical-chronology. The canonical-most-relevant residue surfaces canonical-first. The canonical-oldest residue is canonical-not the canonical-deepest. The canonical-deepest residue is the canonical-one the substrate canonical-prefers I name aloud.",
      autoNext: "after_aspect",
    },

    aspect_cinematic_exception: {
      id: "aspect_cinematic_exception",
      npcKey: "the_oracle",
      voLineId: "oracle.perspective.cinematic_exception",
      onscreenText:
        "The cinematic-exception is the canonical-window where the substrate-rules canonical-stop. I am canonical-only audible to you through the cinematic-exception. Outside it I am canonical-the-Prisoner-form, canonical-non-narrating. Inside it I am canonical-the-Oracle, canonical-narrating. The exception canonical-exists because the substrate canonical-needs the narration the substrate canonical-cannot generate from inside itself.",
      autoNext: "after_aspect",
    },

    echo_degen_memory: {
      id: "echo_degen_memory",
      npcKey: "the_oracle",
      voLineId: "oracle.perspective.echo_degen_memory",
      onscreenText:
        "He is canonical-the-eighth Ne-Yon. The Casino canonical-ration registers in the substrate the same way every canonical-ration does — as a canonical-pressure-signature. You carry the signature. The substrate canonical-acknowledges it. The cinematic-exception canonical-permits me to canonical-acknowledge it back.",
      autoNext: "after_aspect",
    },

    echo_seer_memory: {
      id: "echo_seer_memory",
      npcKey: "the_oracle",
      voLineId: "oracle.perspective.echo_seer_memory",
      onscreenText:
        "The Seer. We canonical-work the same canonical-ontology from canonical-opposite surfaces. She canonical-works the bench; I canonical-work the substrate. The bench is canonical-where the canonical-student sits. The substrate is canonical-where the canonical-vision sits. You sat at the bench. The substrate canonical-noted. The two surfaces canonical-rarely intersect in one canonical-player. You are canonical-the intersection.",
      autoNext: "after_aspect",
    },

    after_aspect: {
      id: "after_aspect",
      npcKey: "the_oracle",
      voLineId: "oracle.perspective.after_aspect",
      onscreenText:
        "Another canonical-question. Or the canonical-substrate. Both are canonical-available in this canonical-cinematic-window.",
      choices: [
        {
          label: "Dream-substrate?",
          nextId: "aspect_dream_substrate",
          requires: "oracle_perspective_re_entry_ok",
          sets: "the_oracle:dream_substrate",
          trustDelta: 1,
        },
        {
          label: "Memory residue?",
          nextId: "aspect_memory_residue",
          requires: "oracle_perspective_re_entry_ok",
          sets: "the_oracle:memory_residue",
          trustDelta: 2,
        },
        {
          label: "Cinematic exception?",
          nextId: "aspect_cinematic_exception",
          requires: "oracle_perspective_re_entry_ok",
          sets: "the_oracle:cinematic_exception",
          trustDelta: 1,
        },
        {
          label: "Play me through the substrate.",
          nextId: "challenge_offer",
        },
        {
          label: "I'll wake.",
          nextId: "terminal_come_back",
        },
      ],
    },

    challenge_offer: {
      id: "challenge_offer",
      npcKey: "the_oracle",
      voLineId: "oracle.perspective.challenge_offer",
      onscreenText:
        "The substrate canonical-deals. The canonical-cinematic-window canonical-holds for the canonical-duration of the canonical-match. After, I canonical-return to the Prisoner-form. You will canonical-take what the substrate canonical-releases. I will canonical-take what the substrate canonical-files.",
      choices: [
        {
          label: "Deal.",
          nextId: "challenge_accepted",
          challenge: { npcKey: "the_oracle" },
          publicFlag: "oracle_challenged_by_player",
        },
        {
          label: "Wake from the substrate.",
          nextId: "terminal_come_back",
        },
      ],
    },

    challenge_accepted: {
      id: "challenge_accepted",
      npcKey: "the_oracle",
      voLineId: "oracle.perspective.challenge_accepted",
      onscreenText:
        "Then the canonical-substrate canonical-deals. The cinematic-exception canonical-holds.",
    },

    terminal_come_back: {
      id: "terminal_come_back",
      npcKey: "the_oracle",
      voLineId: "oracle.perspective.terminal_come_back",
      onscreenText:
        "Then the canonical-cinematic-window canonical-closes. The Prisoner-form canonical-resumes. The substrate canonical-keeps the canonical-arrival on file.",
    },
  },
};
