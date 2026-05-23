/* ═══════════════════════════════════════════════════════
   FORGE WORKSHOP MYSTERY — anvil + schema-rack + kiln

   Three-hotspot module for the deck-8 crafting forge. Sets
   forge_introduced on first-look at the anvil. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type ForgeWorkshopHotspotId =
  | "chained-auro-tally"
  | "chained-auro-side-room"
  | "chained-tarn-letter-to-the-case"
  | "charter2-solven-workshop"
  | "charter2-house-othisen"
  | "infernal-blank-pages-archive"
  | "advocate-weave-specification"
  | "anvil" | "schema-rack" | "kiln";

export const FORGE_WORKSHOP_MYSTERY: RoomMysteryModule<ForgeWorkshopHotspotId> = {
  roomId: "forge-workshop",
  responses: {
    /* ─── mechronis.chained_lesson · e3 (Auro's twelve-apprentice tally) ─── */
    "chained-auro-tally": {
      look: {
        narration:
          "At the back of Sergeant Auro's side-room — three chairs, a chalked Terminus diorama at one-to-forty — a small leather notebook hangs from a peg by a strip of jute. Inside, in Auro's hand, twelve names. Each name carries a tally beside it — the number of waves that apprentice has held since their drill cycle here. Tally total at the bottom: forty-three. Forty-three waves held without further loss, by twelve apprentices the Academy never paid Auro to teach. The notebook is dated nine years and reads as a record of work the Academy declined to recognise.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e3",
          cluesFound: ["chained.e3.twelve_apprentices"],
        },
      },
      use: {
        narration:
          "You flip the notebook open at the spine fold. Half-erased pencil lines on the inside cover read 'I keep this so I know what to charge them if they ever ask.' The Academy has not asked. The Trade Empire has been paying Auro for a job adjacent to this one for nine years. The notebook has not been entered on either ledger.",
      },
      talk: {
        narration:
          "You read the twelve names aloud, in tally order. The side-room's acoustics are designed for small instruction — each name carries cleanly to the three chairs and no further. Auro teaches with the door closed. The list has been spoken in this room before, on every off-shift, in her own voice.",
        voId: "elara.forge-workshop.chained-auro-tally.talk",
      },
    },
    /* ─── advocate.blood_weave · e2 (Blood Weave partial specification) ─── */
    "advocate-weave-specification": {
      look: {
        narration:
          "On the forge-workshop's bench, the partial specification of the Blood Weave — recovered from a Zyr'Koth research archive (the Hierarchy SVP R&D's Weave-derivative work). The specification's operational core: the Weave is a multi-layer binding fabric that ABSORBS cosmic-energy from its weaver to MATERIALIZE chains against hostile instruments. Energy in: weaver's own life-substrate. Energy out: chains that bind. The fabric does not regenerate — every binding consumes the weaver's substrate net. The forge's metallurgical readers cross-reference the spec against bindings recovered from the seven-dimensions siege: the substrate signatures match.",
        mysteryBinding: {
          mysteryId: "advocate.blood_weave",
          episodeId: "advocate.blood_weave.e2",
          cluesFound: ["adv.e2.weave_specification_partial"],
        },
      },
      use: {
        narration:
          "You ask the bench whether the Weave can be replicated by a different weaver. The reader returns the spec's footnote: 'the Weave is keyed to its weaver's substrate. another weaver would weave a different fabric.' The Advocate's Weave is uniquely hers; no successor can wear her chains forward.",
      },
      talk: {
        narration:
          "You read the operational core aloud — energy in is the weaver's own substrate, energy out is chains that bind. The bench's reader catches the recital and offers, by contrast, the Zyr'Koth research footnote: the Hierarchy attempted to derive a Weave variant that drew on someone else's substrate. They failed seven times. The Weave does not delegate its cost.",
        voId: "elara.forge-workshop.advocate-weave-specification.talk",
      },
    },
    /* ─── severance.infernal_clause · e3 (blank-backed pages archive) ─── */
    "infernal-blank-pages-archive": {
      look: {
        narration:
          "Down the forge-workshop sub-corridor, a box labelled 'PRELIMINARIES': forty unsigned blank-backed contract pages. The clauses were written on the blank-backed pages first, then the contract fronts were filled in season by season. The fronts and backs are different paper-stock.",
        mysteryBinding: {
          mysteryId: "severance.infernal_clause",
          episodeId: "severance.infernal_clause.e3",
          cluesFound: ["infernal.e3.blank_pages_archive"],
        },
      },
      use: {
        narration:
          "You inspect the paper-stocks. The back-stock — where the clauses live — is heavier, finer-grained, sourced from a mill the chronicle traces to one supplier in epoch one. The front-stock varies season by season. The writer prepared the clauses with a single batch of paper bought ahead. The contracts came to the clauses, not the other way around.",
        voId: "elara.forge-workshop.infernal-blank-pages-archive.use",
      },
      talk: {
        narration:
          "You read the box's label aloud — PRELIMINARIES. The word does not capture what the box is for. A preliminary is a draft; these are finished clauses awaiting their contracts. The forge-workshop's acoustics swallow the label without correction. The chronicle's vocabulary has been edited by who got there first.",
        voId: "elara.forge-workshop.infernal-blank-pages-archive.talk",
      },
    },
    /* ─── charter.second_signatory · color clues ─── */
    "charter2-solven-workshop": {
      look: {
        narration:
          "In the lower-decks sector-eight third-corridor sub-room, the Solven workshop: empty but maintained. A note on the door: 'open by appointment.' The appointment book is full, every entry signed by the same archivist who keeps the tax registry.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e2",
          cluesFound: ["charter2.e2.solven_workshop"],
        },
      },
      use: {
        narration:
          "You open the appointment book and scan the dates. The cadence is exact — one appointment every nine days, every nine days for three epochs, no gaps. The archivist is not making appointments to use the workshop. The archivist is making appointments to prevent anyone else from using the workshop. The space is being held by booking, not by occupancy.",
        voId: "elara.forge-workshop.charter2-solven-workshop.use",
      },
      talk: {
        narration:
          "You read the archivist's name aloud — the same hand signs the tax registry, signs every appointment in this book, signs the workshop's maintenance log. One person holds three keys. The chronicle's deferral on the Solven workshop is an instrument; the instrument has a single point of failure, and her signature is on every page of it.",
        voId: "elara.forge-workshop.charter2-solven-workshop.talk",
      },
    },
    "charter2-house-othisen": {
      look: {
        narration:
          "Down the forge-workshop sub-corridor, House Othisen — small-engine assemblers. The Othisens have been assembling components for the Trade Empire's circuit racers for three epochs without recognition. Their charter clause was the longest of the four. Their erasure was the cleanest.",
        mysteryBinding: {
          mysteryId: "charter.second_signatory",
          episodeId: "charter.second_signatory.e3",
          cluesFound: ["charter2.e3.house_othisen"],
        },
      },
      use: {
        narration:
          "You inspect a component on the assembly bench — a small-engine impeller, freshly machined. The Othisen maker's mark is stamped on the inner ring, where the Trade Empire's quality-inspectors do not look. The Empire's outer plate carries the Empire's mark; the Othisens have been signing their own work, internally, for three epochs. The erasure was clean from one angle. From the inside of the part, it is loud.",
        voId: "elara.forge-workshop.charter2-house-othisen.use",
      },
      talk: {
        narration:
          "You speak the family name aloud — Othisen. The workshop's acoustic register notes that the name has been said in this corridor four hundred and seventeen times across three epochs, almost exclusively by Othisens themselves. The erasure is a public-facing edit. The internal name has never been edited out.",
        voId: "elara.forge-workshop.charter2-house-othisen.talk",
      },
    },
    /* ─── mechronis.chained_lesson · color clues ─── */
    "chained-auro-side-room": {
      look: {
        narration:
          "Down sub-corridor seven, the side-room where Auro teaches: forge-workshop sub-corridor seven. Whiteboard, three chairs, a Terminus diorama scaled at one to forty. Auro teaches there on her off-shifts. The room is quiet; the chairs are warm. Apprentices have been here within the last hour.",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e3",
          cluesFound: ["chained.e3.auro_side_room"],
        },
      },
      use: {
        narration:
          "You sit in one of the three chairs. The seat is shaped to the wear-pattern of a particular apprentice; the next chair carries a different shape; the third, a third. Auro's three regular students have left their seats marked. The diorama is set at a specific moment in the Terminus engagement — the moment the curriculum she rejected says nothing useful happens.",
        voId: "elara.forge-workshop.chained-auro-side-room.use",
      },
      talk: {
        narration:
          "You greet the empty chairs. The side-room's acoustics are designed for three students and one teacher; a fourth voice carries softly. You are not, strictly, intruding — you are sitting in the seat the curriculum reserved for the case that was never opened. The room accepts the seating without comment.",
        voId: "elara.forge-workshop.chained-auro-side-room.talk",
      },
    },
    "chained-tarn-letter-to-the-case": {
      look: {
        narration:
          "On Auro's bench, beside the side-room door: a sealed letter Tarn left behind, addressed to 'whoever finds this case' — Tarn knew the case would surface. 'I argued for the absence in Year 1; I tried to amend the curriculum in Year 8; I left in Year 14. The case is yours now. The argument I made was sincere; it was also wrong. Both can be true.'",
        mysteryBinding: {
          mysteryId: "mechronis.chained_lesson",
          episodeId: "mechronis.chained_lesson.e4",
          cluesFound: ["chained.e4.tarn_message_to_player"],
        },
      },
      use: {
        narration:
          "You break the seal. The letter unfolds into three pages — the visible quote is the last paragraph. The earlier pages are the argument from Year 1, transcribed in Tarn's own hand, with marginalia from Year 8 amendments and a final dated note from Year 14. The letter is a complete authoring history of the case Tarn refused to close. He has handed you the working file.",
        voId: "elara.forge-workshop.chained-tarn-letter-to-the-case.use",
      },
      talk: {
        narration:
          "You read the closing sentence aloud — 'both can be true.' The forge-workshop's acoustic register catches it; the same sentence has been spoken in this room exactly once before, in Tarn's own voice, on the day he sealed the letter. He read it aloud to himself before signing it. The chronicle has both readings.",
        voId: "elara.forge-workshop.chained-tarn-letter-to-the-case.talk",
      },
    },
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
      use: {
        narration:
          "You strike the anvil with the back of a knuckle. The note is low, even, and rings for nearly four seconds — Lyra's anvil, calibrated. The face's central dish absorbs the strike cleanly; the edges, less worn, ring brighter. The anvil tells you it is ready to be worked.",
        voId: "elara.forge-workshop.anvil.use",
        setsFlag: "forge_anvil_struck",
      },
      talk: {
        narration:
          "If you address the anvil, you address the working centre of the room. Every smith Lyra trained learned to greet it before lifting a hammer — not superstition, exactly, just the discipline of acknowledging what was built before you arrived.",
        voId: "elara.forge-workshop.anvil.talk",
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
      use: {
        narration:
          "You unroll the bottom-most schema. The unrecognised hand has drafted, in clean blue ink, what reads as a substitution-press: a device that takes a shaped artefact in one tray and produces, in the other, a copy with selectively altered geometry. Lyra would have refused to build it. She also, by the position of the schema in the rack, refused to throw it away.",
        voId: "elara.forge-workshop.schema-rack.use",
        setsFlag: "forge_editor_schema_unrolled",
      },
      talk: {
        narration:
          "If you address the rack, you address every weapon Lyra's forge has ever produced — and one weapon it never did. The unbuilt one is, in this room's logic, the most important. Speech here is, by Lyra's discipline, a small refusal of the editor's preferred kind of silence.",
        voId: "elara.forge-workshop.schema-rack.talk",
        humanReaction: {
          narration: {
            balanced:
              "She kept that schema where she could see it. So that every time she walked into the workshop, she remembered what she had refused to make. The discipline was to look at it daily and still not build it.",
            shadow:
              "Some refusals are louder than others. Lyra's refusal of that schema was the loudest one she made. The editor never forgave her for it.",
            warm:
              "Lyra showed me that schema once, just once, and then put it back exactly where it had been. She wanted me to know it existed, and to know she would not build it. That was, in retrospect, a will.",
          },
          voId: "human.forge-workshop.schema-rack.talk",
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
      use: {
        narration:
          "You open the kiln's firebox. The interior is cold ash and a few fragments of unburnt bay leaf at the bottom — last firing was unfinished, interrupted. Whoever was working the kiln when Lyra died never got to close the firing properly. The ash has been undisturbed since.",
        voId: "elara.forge-workshop.kiln.use",
        setsFlag: "forge_kiln_inspected",
      },
      talk: {
        narration:
          "If you address the kiln, you address the smith who left it cold. Their work is unfinished; the metal that was being tempered is, by the manifest stub, still in the quench-tub stage-right. Two and a half centuries late, and waiting.",
        voId: "elara.forge-workshop.kiln.talk",
      },
    },
  },
};
