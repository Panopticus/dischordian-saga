/* ═══════════════════════════════════════════════════════
   SYNTHESIS CHAMBER MYSTERY — synth-vat + recipe-board

   Two-hotspot module. Sets synthesis_seen on first-look at
   the synth-vat. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type SynthesisChamberHotspotId = "synth-vat" | "recipe-board";

export const SYNTHESIS_CHAMBER_MYSTERY: RoomMysteryModule<SynthesisChamberHotspotId> = {
  roomId: "synthesis-chamber",
  responses: {
    "synth-vat": {
      look: {
        narration: {
          lucid:
            "The synth-vat is a cylindrical glass tank ten feet tall, currently holding a slow-spinning amber fluid. The fluid is, on the manifest, the medical-bay's neural-stim base — synthesised in this room from raw biostock. The chamber is the medical-bay's larder.",
          fragmented:
            "Larder. Larder. Larder. The medical bay's larder.",
          luminous:
            "Every neural-stim, every basic medkit, every antibody culture this ship has used for two and a half centuries was synthesised in this vat. The room is the medical-bay's quiet partner. Without the chamber, the medical bay is decorative. With the chamber, it is the ship's most reliable resource.",
        },
        voId: "elara.synthesis-chamber.synth-vat.look",
        setsFlag: "synthesis_seen",
        logsClue: {
          id: "clue-synthesis-vat-medbay-larder",
          title: "The synthesis chamber is the medical bay's larder",
          body:
            "The Synthesis Chamber's vat synthesises every neural-stim, basic medkit, and antibody culture the medical bay distributes. Without the chamber, the medical bay is decorative; with it, it is the ship's most reliable medical resource.",
          source: "synthesis-chamber",
          order: 0,
        },
      },
      use: {
        narration:
          "You draw a small sample from the vat's tap. The fluid in the phial keeps spinning at the same slow rate it spins in the tank — the synth-vat's standing rotation transfers to anything decanted from it. Lyra's note, taped to the tap: 'Stir before use, but not yet.'",
        voId: "elara.synthesis-chamber.synth-vat.use",
        setsFlag: "synth_vat_sampled",
      },
      talk: {
        narration:
          "If you address the vat, the rotation steadies. The chamber is, in its quiet way, attentive — the larder pays attention to the kitchen it serves. We should pay attention back.",
        voId: "elara.synthesis-chamber.synth-vat.talk",
      },
    },
    "recipe-board": {
      look: {
        narration: {
          lucid:
            "The recipe-board on the back wall is a brass-framed slate listing the chamber's authorised syntheses. Twenty entries. The newest, dated the last week of Lyra's command, is in a hand I do not recognise: 'Substrate-N. RESTRICTED. DO NOT SYNTHESISE WITHOUT CAPTAIN PRESENT.' The recipe is incomplete — listed as a name without a method.",
          fragmented:
            "Substrate-N. Substrate-N. Substrate-N. Restricted. Restricted.",
          luminous:
            "Substrate-N is a recipe Lyra restricted in the last week of her command, in a hand that is not hers. Whoever wrote the entry knew the recipe and refused to commit it to the board. The refusal is the same discipline she applied to the names on the Conspiracy Board — committing the recipe to record would have committed the substance to history. She and her successor agreed not to. The successor was, on the dating, the day Wraith departed.",
        },
        voId: "elara.synthesis-chamber.recipe-board.look",
        logsClue: {
          id: "clue-synthesis-substrate-n-withheld",
          title: "Substrate-N: restricted recipe withheld from the board",
          body:
            "The Synthesis Chamber's recipe-board lists 'Substrate-N. RESTRICTED. DO NOT SYNTHESISE WITHOUT CAPTAIN PRESENT' as its newest entry, dated the last week of Lyra Vox's command. The recipe's method is deliberately withheld — written by Wraith Calder, who refused to commit it to record the same way Lyra refused to commit the suspect's name to the Conspiracy Board.",
          source: "synthesis-chamber",
          order: 1,
        },
      },
      use: {
        narration:
          "You run a finger across the slate's slot for Substrate-N. The chalk gives faintly under your touch — the entry has been re-traced more than once over the centuries, kept legible by visitors who knew not to erase it. Whoever has been re-tracing the line knows the recipe but is honouring the original refusal.",
        voId: "elara.synthesis-chamber.recipe-board.use",
        setsFlag: "synthesis_recipe_retraced",
      },
      talk: {
        narration:
          "If you address the recipe-board, you address every authorised synthesis the chamber has ever done. Twenty entries, mostly routine. One — the last — is the only thing in this room that would change the case if it were spoken aloud. We will not, today, speak it.",
        voId: "elara.synthesis-chamber.recipe-board.talk",
      },
    },
  },
};
