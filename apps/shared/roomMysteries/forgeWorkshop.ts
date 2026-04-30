/* ═══════════════════════════════════════════════════════
   FORGE WORKSHOP MYSTERY — anvil + schema-rack + kiln

   Three-hotspot module for the deck-8 crafting forge. Sets
   forge_introduced on first-look at the anvil. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type ForgeWorkshopHotspotId = "anvil" | "schema-rack" | "kiln";

export const FORGE_WORKSHOP_MYSTERY: RoomMysteryModule<ForgeWorkshopHotspotId> = {
  roomId: "forge-workshop",
  responses: {
    anvil: {
      look: {
        narration: {
          lucid:
            "The anvil is centuries-old hardened brass on a steel base, scarred from a working life longer than most stars. The face has been struck so many times the centre is a quarter-inch lower than the edges. You could chord a tuning fork against it.",
          fragmented:
            "The anvil. The anvil. The anvil is — is — is the centre. The centre. The centre.",
          luminous:
            "The anvil is the room's gravitational centre. Every other tool in the room is positioned at a working distance from it. Whoever set the room up — Lyra, in her own hand, by the manual on the schema-rack — calibrated the layout to the swing-radius of an average smith. The anvil tells you the room was built to be used.",
        },
        voId: "elara.forge-workshop.anvil.look",
        setsFlag: "forge_introduced",
        logsClue: {
          id: "clue-forge-anvil-centre",
          title: "The forge anvil is the room's gravitational centre",
          body:
            "The Forge Workshop's anvil is the layout's anchor — every tool in the room sits at an average smith's swing-radius from it. The face is dished from centuries of strikes. Lyra Vox calibrated the room to be actively used, not displayed.",
          source: "forge-workshop",
          order: 0,
        },
      },
    },
    "schema-rack": {
      look: {
        narration: {
          lucid:
            "The schema-rack along the back wall holds rolled diagrams — weapon designs, armour patterns, prosthetic schematics. Most are Lyra's hand. A few near the bottom are in a hand I do not recognise, dated to the last week of her command.",
          fragmented:
            "Last week. Last week. Last week. Same hand as — same hand as — the twelfth flag.",
          luminous:
            "The unrecognised hand on the bottom schemas matches the twelfth signal-flag. The editor was in this room too — designing something. The last schema in his hand is, by my best read, a weapon. Not for combat: a weapon for editing. A device that performs, in physical materials, the same kind of substitution he performs in text. Lyra never built it. The diagram remains.",
        },
        voId: "elara.forge-workshop.schema-rack.look",
        logsClue: {
          id: "clue-forge-editor-weapon-schema",
          title: "The editor designed a substitution-weapon in Lyra's forge",
          body:
            "The Forge Workshop's schema-rack contains diagrams in the editor's hand from the last week of Lyra Vox's command. The final schema appears to be a physical device that performs material substitution — the editor's text-method translated into hardware. Lyra never built it.",
          source: "forge-workshop",
          order: 1,
        },
      },
    },
    kiln: {
      look: {
        narration: {
          lucid:
            "The kiln in the back-left corner is brass-bound clay, fired thousands of times. Cold now, but the chimney smells faintly of ash and something herbal — bay leaf, by the smell of it. Whoever last fired this kiln was burning bay leaves in the firebox. That is a tradition I do not understand and would like to.",
          fragmented:
            "Bay leaf. Bay leaf. Bay leaf. Why bay leaf. Why bay leaf. Why.",
          luminous:
            "Bay leaves in the firebox is a Lyra tradition. She believed — and recorded, in the schema-rack manuals — that bay-leaf smoke during a firing produced harder steel. The metallurgical reasoning was nonsense. The ritual reasoning was that the smell told the smith they were doing something serious. We will, eventually, fire this kiln again. We will use bay leaf when we do.",
        },
        voId: "elara.forge-workshop.kiln.look",
        logsClue: {
          id: "clue-forge-bay-leaf-tradition",
          title: "Lyra's bay-leaf firing tradition",
          body:
            "The Forge Workshop's kiln smells of bay leaf — Lyra Vox's tradition of burning bay leaves in the firebox during a firing. The metallurgical reasoning was nonsense; the ritual reasoning was that the smell signalled to the smith that the work mattered.",
          source: "forge-workshop",
          order: 2,
        },
      },
    },
  },
};
