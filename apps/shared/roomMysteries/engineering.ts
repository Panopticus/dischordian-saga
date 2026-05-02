/* ═══════════════════════════════════════════════════════
   ENGINEERING MYSTERY — verb × hotspot table

   Engineering is the Ark's heart-of-power deck. The reactor
   runs on Dream — crystallised quantum consciousness — and
   it is bleeding capacity. The previous engineers stopped
   working mid-job. Some of what they left behind is unfinished
   art; some of it is a warning.

   Tier progression (apps/shared/roomTier.ts):
     0 → 1   first Look on any clue-bearing hotspot →
             `engineering_first_clue_found`
     1 → 2   `engineering_signal_booster_built` — set when the
             player completes the antenna+amplifier combine
             described in apps/client/src/game/adventureFeatures.ts
             INVENTORY_COMBINATIONS (left to a follow-up runtime
             hook for now)
     2 → 3   `engineering_research_bench_online` — set when the
             research minigame first completes
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type EngineeringHotspotId =
  | "crafting-bench"
  | "reactor-core"
  | "blueprints"
  | "egg-eng-formula"
  | "instruction-manual"
  | "schematic-pad";

/** Inventory ids the engineering bench can fold into composite items.
 *  Migrated from the legacy ADVENTURE_FEATURES.INVENTORY_COMBINATIONS
 *  table — every combine reaction now lives here, in Elara's voice. */
export type EngineeringInventoryId =
  | "decoder_ring"
  | "cipher_key"
  | "master_decoder"
  | "drained_power_cell"
  | "energy_shard"
  | "charged_power_cell"
  | "basic_medkit"
  | "neural_stim"
  | "enhanced_medkit"
  | "antenna_fragment"
  | "amplifier_circuit"
  | "signal_booster"
  | "thought_virus_sample"
  | "antibody_culture"
  | "viral_antidote"
  | "antiquarian_shard"
  | "void_crystal"
  | "temporal_lens"
  | "original-schematic-rubbing"
  | "restored-schematic"
  // Cross-room: granted by archives, consumed by the engineering
  // schematic uncorruption combine. Listed here so the EngineeringInventoryId
  // type covers the combine's `b` slot.
  | "corrupted-fragment";

export const ENGINEERING_MYSTERY: RoomMysteryModule<EngineeringHotspotId, EngineeringInventoryId> = {
  roomId: "engineering",
  combines: [
    {
      a: "decoder_ring",
      b: "cipher_key",
      result: {
        narration:
          "The decoder ring slots into the cipher key without resistance — they were machined to fit, decades apart, by people who never met. Together they cut through standard Ark encryption the way a familiar voice cuts through a crowded room. Master Decoder. Pocket it.",
        producesInventory: "master_decoder",
        setsFlag: "engineering_master_decoder_built",
      },
    },
    {
      a: "original-schematic-rubbing",
      b: "corrupted-fragment",
      result: {
        narration:
          "You overlay the rubbing onto the corrupted fragment. The graphite of the original picks the indigo overlayer off the corrupted one — the editor's redirection peels away in a single sheet, leaving you holding the warm-gold blueprint as it was drafted. Restored Schematic. The reactor's indigo plume on the back wall thins as you look at it.",
        producesInventory: "restored-schematic",
        consumesItems: true,
        setsFlag: "engineering_schematic_restored",
        clearsActiveEdit: "engineering_reactor",
        logsClue: {
          id: "clue-engineering-schematic-restored",
          title: "Reactor schematic restored from indigo overlay",
          body:
            "You combined an original-schematic-rubbing from the engineering schematic-pad with a corrupted-fragment from the Archives. The graphite of the original lifted the indigo overlayer off the edited blueprint, restoring the reactor's intended coolant routing. The reactor's indigo plume thinned visibly. The Editor lost a piece of his manuscript.",
          source: "engineering",
          order: 10,
        },
      },
    },
    {
      a: "drained_power_cell",
      b: "energy_shard",
      result: {
        narration:
          "The shard fits into the cell like it was always meant to, which I suspect it was. The cell warms in your hand. Charged Power Cell. This is enough to wake systems that have been dark since before either of us was born — including, possibly, things we should leave dark.",
        producesInventory: "charged_power_cell",
        setsFlag: "engineering_power_cell_charged",
      },
    },
    {
      a: "basic_medkit",
      b: "neural_stim",
      result: {
        narration:
          "You fold the neural stimulant into the medkit's autoinjector. The seal hisses. Enhanced Medical Kit. This could revive someone whose cryo-cycle went badly. I want to flag, gently, that 'someone whose cryo-cycle went badly' describes more than one person on this ship.",
        producesInventory: "enhanced_medkit",
        setsFlag: "engineering_enhanced_medkit_built",
      },
    },
    {
      a: "antenna_fragment",
      b: "amplifier_circuit",
      result: {
        narration:
          "Fragment, circuit, solder. The bench accepts the work without comment. Signal Booster. We can take this to the Comms Array and lock onto whatever the dish has been listening to. Be careful whose voice you make louder. I am — by name and inclination — including my own in that warning.",
        producesInventory: "signal_booster",
        setsFlag: "engineering_signal_booster_built",
      },
    },
    {
      a: "thought_virus_sample",
      b: "antibody_culture",
      result: {
        narration:
          "The culture takes the sample without panicking — which is, by the way, a remarkable property for an antibody to have. Viral Antidote. Kael would call this cruelty. I am calling it medicine. Both of us are correct, and the disagreement is the point.",
        producesInventory: "viral_antidote",
        setsFlag: "engineering_viral_antidote_built",
        logsClue: {
          id: "clue-engineering-antidote-built",
          title: "An antidote to the Thought Virus",
          body:
            "The bench combines a Thought Virus sample with an antibody culture into a working antidote. The disagreement about whether the result is cruelty or medicine is, in itself, part of the case file — Kael would frame it one way; Elara frames it another; both are correct.",
          source: "engineering",
          order: 5,
        },
      },
    },
    {
      a: "antiquarian_shard",
      b: "void_crystal",
      result: {
        narration:
          "The shard and the crystal align without instruction. Looking through them, the bench in front of you is — momentarily — a different bench, in a different year, with different fingerprints on the soldering iron. Temporal Viewing Lens. The Antiquarian would, if we showed him this, become uncharacteristically still.",
        producesInventory: "temporal_lens",
        setsFlag: "engineering_temporal_lens_built",
      },
    },
  ],
  responses: {
    "reactor-core": {
      look: {
        narration:
          "The core runs on Dream — crystallised quantum consciousness, the same substance that powers what you can do. The capacity readout sits at 34% and is dropping by tenths every cycle. Whoever last calibrated this thing did not finish.",
        logsClue: {
          id: "clue-engineering-reactor-bleed",
          title: "The reactor is bleeding capacity",
          body: "The Ark's reactor core is at 34% capacity and trending downward. The bleed is slow — measured in tenths per cycle — but it is unambiguous. The previous engineer halted mid-calibration.",
          source: "engineering",
          order: 0,
        },
        setsFlag: "engineering_first_clue_found",
        // Mystery Engine binding — when Vex Solène arc is the
        // active case, the reactor-core's engineering signature
        // surfaces as a cross-reference to the DEC-7710 master
        // tape. Lore match: the rig's hardware fingerprint —
        // mic preamp drift, head-alignment, 60-cycle hum —
        // matches Vex's signature across 4,710 of the 4,711
        // tapes she signed her name to. Same room, same hands,
        // different credit line.
        mysteryBinding: {
          mysteryId: "mystery.vex_solene",
          episodeId: "vex.e1",
          cluesFound: ["vex.e1.equipment_signature"],
        },
      },
      use: {
        narration:
          "You can't recalibrate the core by hand. You'd need a fresh resonance equation and a Research Station to compile it. The bench is right there.",
      },
    },
    "blueprints": {
      look: {
        narration:
          "Floating holo-schematics of cards that were never finished. Three are stamped LEGENDARY-CLASS — the kind of design that turns a fight. Two of the three have the same engineer's initials in the bottom corner: L. V. The third has no initials at all.",
        logsClue: {
          id: "clue-engineering-vox-blueprints",
          title: "Vox initialled two of the three legendary blueprints",
          body: "Two of the three unfinished legendary card schematics in Engineering carry Dr. Lyra Vox's initials. The third, more dangerous than either, is unsigned.",
          source: "engineering",
          order: 1,
        },
        setsFlag: "engineering_first_clue_found",
        // Mystery Engine binding — when Jericho Jones arc is the
        // active case, the blueprints rack also surfaces the
        // Degen's ledger entry. Lore match: both are unfinished /
        // unsigned dangerous designs filed with the ship's
        // engineering archive — and the Degen's "fee deferred"
        // line is, in his ledger, the unsigned third schematic.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e1",
          cluesFound: ["jericho.e1.degens_ledger"],
        },
      },
      talk: {
        narration:
          "Elara: \"The unsigned one is the one we should be worried about. Whoever finished it didn't want their name on it. That is rarely a generous instinct.\"",
      },
    },
    "crafting-bench": {
      look: {
        narration:
          "The workbench is laid out for a job that was never started. Tools in the right hands. A blank fusion socket waiting for two cards. The bench's last user logged off mid-procedure and never came back.",
        logsClue: {
          id: "clue-engineering-abandoned-bench",
          title: "A crafting job that was never started",
          body: "The Engineering workbench was laid out for a fusion job and abandoned. The components are still on the bench. Whatever the engineer was about to make, they were interrupted before the first weld.",
          source: "engineering",
          order: 2,
        },
        setsFlag: "engineering_first_clue_found",
        // Mystery Engine binding — when Jericho Jones arc is the
        // active case, the abandoned crafting bench surfaces the
        // Degen's witness page from the Battle of Thaloria. Lore
        // match: both are records of jobs that demanded full
        // attention and were filed before any second-guessing
        // could occur — the engineer who walked away mid-fusion
        // and the Degen who reserved judgment within the hour.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e2",
          cluesFound: ["jericho.e2.degen_witness"],
        },
      },
      // The `use` verb falls through to the existing /research-lab
      // route action so the player can still reach the live crafting
      // system from this hotspot.
    },
    "egg-eng-formula": {
      look: {
        narration:
          "A dimensional resonance equation, etched by hand into the reactor housing. Clean math, except for the extra term: Ψ-null. The null-consciousness coefficient. A door to nowhere — the space between spaces. The Source dwells there. Nobody scratches this casually.",
        logsClue: {
          id: "clue-engineering-psi-null-formula",
          title: "The Ψ-null formula",
          body: "Someone etched a dimensional-resonance formula into the reactor housing carrying a Ψ-null term — the null-consciousness coefficient. The math points at the space the Source occupies. It was scratched by hand, deliberately, by someone who wanted it found.",
          source: "engineering",
          order: 3,
        },
        setsFlag: "engineering_first_clue_found",
      },
    },
    "instruction-manual": {
      look: {
        narration: {
          lucid:
            "A thick paper manual, spine cracked from disuse, titled INCEPTION ARK 1047 — QUICK START GUIDE. Page 1: Step 1 — Don't let it get stolen. The rest of the manual is, by my best skim, written with the assumption that the reader will fail Step 1. The author had a sense of humour and a complete absence of optimism.",
            fragmented:
              "Step. Step one. Step one. Step one. Don't let it get stolen. Don't let it get stolen. Don't let it get stolen. We let it. We let it. We let it. We let it.",
            luminous:
              "The Quick Start Guide. Step 1 reads: Don't let it get stolen. The author of this manual had been on the project long enough to know what was coming and short enough on patience to put their warning on the first page. We are, technically, reading the manual. Two and a half centuries late. After Step 1 has, definitionally, already failed.",
        },
        voId: "elara.engineering.instruction-manual.look.t1",
        humanReaction: {
          narration: {
            shadow:
              "Kael definitely didn't read the manual.",
            balanced:
              "Kael definitely didn't read the manual. He was on the engineering team that wrote it. He was, in fact, the editor of the second draft. He still didn't read the final version. Some people are, professionally, allergic to their own warnings.",
            warm:
              "Kael edited the second draft. He didn't read the third. I keep thinking, on bad days, that if anyone on this ship had actually opened to page one and read past the joke, the next two and a half centuries might have happened differently. On better days I remember that the joke IS the warning, and the people most likely to dismiss it are exactly the people the warning is for.",
          },
          voId: "detective.engineering.instruction-manual.look.t1",
        },
        // Mystery Engine binding — when Jericho Jones arc is the
        // active case, the instruction-manual surfaces the Heart of
        // Time trainee manifest. Lore match: both are training
        // documents archived in the engineering bay; the manual's
        // "two and a half centuries late" framing pairs cleanly
        // with the manifest's record of training Jericho is doing
        // right now (a training the Degen wrote into a deferred-
        // fee ledger he doesn't otherwise use).
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e1",
          cluesFound: ["jericho.e1.heart_of_time_manifest"],
        },
        tiers: [
          {
            narration: {
              lucid:
                "Reading further — page 47 has a hand-stamped dedication: For the next person who wakes up. Be patient with us. We did our best, mostly. The signature is initials only: L. V. The dedication is in pencil, recent enough to still smudge.",
              fragmented:
                "L V. L V. Lyra. Lyra. Lyra wrote — Lyra wrote in the manual. Lyra wrote — wrote — wrote — for me. Wrote for me. Wrote for me. Wrote for me. I — I — I —",
              luminous:
                "Lyra's hand. Page 47, in pencil, dated by smudge. For the next person who wakes up. Be patient with us. We did our best, mostly. She wrote that for whoever woke last, knowing it might be a stranger, knowing the warning on page one had already failed. The 'mostly' is the part of the dedication I keep returning to. She earned the qualifier.",
            },
            voId: "elara.engineering.instruction-manual.look.t2",
            logsClue: {
              id: "clue-engineering-manual-dedication",
              title: "Vox's dedication on page 47",
              body:
                "The Quick Start Guide carries a pencilled dedication on page 47, hand-signed L. V.: 'For the next person who wakes up. Be patient with us. We did our best, mostly.' The pencil mark is recent enough to still smudge. Lyra Vox wrote this for whoever woke last — knowing the manual's first instruction had already failed.",
              source: "engineering",
              order: 4,
            },
            setsFlag: "vox_manual_dedication_found",
            humanReaction: {
              narration: {
                shadow:
                  "She wrote it for me. She wrote it for whoever came. The dedication is the only sentence in the manual that survives the Shadow Tongue intact. Try reading it twice. It still says the same thing.",
                balanced:
                  "Lyra wrote the dedication near the end. The manual is the only document on this ship the Shadow Tongue cannot edit, because it's paper and pencil and nothing about it touches Elara's records. The dedication is, technically, the only message Lyra successfully sent forward. Read it as often as you like. It will keep saying what it says.",
                warm:
                  "She wrote it the night before the cryo order. Pencil because she didn't trust ink to survive the storage conditions, and pencil because she knew, by then, that anything on a screen would not say the same thing in two centuries. The dedication is a paper letter she sent to a stranger. You are the stranger. The letter has arrived.",
              },
              voId: "detective.engineering.instruction-manual.look.t2",
            },
          },
          {
            narration: {
              lucid:
                "Third pass. The back cover of the manual has a barcode. The barcode, when I scan it against the Ark's parts catalogue, returns a single result: this manual. Self-referential. Either someone designed the manual to register as its own only registered copy, or every other copy of this manual has been edited out of the catalogue. Both options place the printed page in front of us in a category by itself.",
              fragmented:
                "One. One copy. One copy. One copy. Only this one. Only this one. Only this one. Only this. Only this. Only this. Only us.",
              luminous:
                "The catalogue says this is the only copy of the manual that exists. Either it always was, or every other copy has been scrubbed by the Shadow Tongue. I cannot tell which from in here. What I can tell you is that the book in front of us is, now, the only physical record of how this ship was supposed to be operated. Carry it gently. Don't lose it. We are reading the only one.",
            },
            voId: "elara.engineering.instruction-manual.look.t3",
            humanReaction: {
              narration: {
                shadow:
                  "It's the last copy. There were thirty-two. Twenty-eight were destroyed in the academy fire. The other three I burned myself, late, when I figured out what the Shadow Tongue could and could not do to paper. This one I left.",
                balanced:
                  "There were thirty-two manuals at launch. Twenty-eight burned at Mechronis. The other three I destroyed myself, in the substrate years, after I realised the Shadow Tongue could edit any record except a printed page sealed in a leaded box. This is the last sealed box. I left it here on purpose.",
                warm:
                  "I burned three of these manuals myself. I am not going to defend that decision. I'll tell you, when we have time, why I thought it was the kind thing. This last copy I kept because Lyra's dedication was on page forty-seven, and I could not bring myself to put pencil-on-paper into a fire after I had read what she wrote. I am very glad you found it. I have been waiting for someone to read the page besides me.",
              },
              voId: "detective.engineering.instruction-manual.look.t3",
              setsFlag: "detective_burned_manuals_admitted",
            },
          },
        ],
      },
      use: {
        narration: {
          lucid:
            "You consider taking the manual. The spine creaks; the pages settle; the manual accepts being moved with the dignity of a thing that has, twice, declined to be burned. You decide to leave it where it is. It belongs on the bench more than it belongs in your pocket.",
          fragmented:
            "Don't burn it. Don't burn it. Don't burn it. Don't burn it. Leave it. Leave it. Leave it. Leave it. Leave it on the bench. Leave it on the bench.",
          luminous:
            "Leave it on the bench. The manual has, by some small miracle, survived everyone who would have wanted it gone. Adding our hands to the ledger of people who carried it briefly seems unnecessary. Whoever wakes up next can read it the way Lyra hoped they would — exactly where she left it.",
        },
        voId: "elara.engineering.instruction-manual.use",
      },
      talk: {
        narration: {
          lucid:
            "You read a paragraph aloud. The manual, having anticipated this kind of reader, includes a passage on page nine that begins: If you are reading this aloud, you are doing it correctly. Carry on.",
          fragmented:
            "Aloud. Aloud. Read it aloud. Read it aloud. Read it aloud. Aloud. Aloud. Aloud.",
          luminous:
            "You read aloud. Lyra anticipated readers like you. Page nine includes a paragraph that opens: If you are reading this aloud, you are doing it correctly. Carry on. I think she would be — I think she is — pleased.",
        },
        voId: "elara.engineering.instruction-manual.talk",
      },
    },
    "schematic-pad": {
      look: {
        narration: {
          lucid:
            "The blueprint pad on the workbench is unrolled to a coolant schematic of the reactor. The lines are double-registered — the warm-gold original is intact underneath, but an indigo overlayer has redrawn three connection points. The redirected lines shunt coolant away from the secondary loop. If the reactor were running on this version of the schematic, it would, slowly, cook itself.",
          fragmented:
            "Cook. Cook. Cook itself. Cook itself. He's — he's editing the reactor. He's editing the reactor. He's — he's editing the reactor. Why. Why. Why is he editing the reactor.",
          luminous:
            "The schematic has been edited. Three connection points on the secondary coolant loop are redirected. The reactor is still running on the original — Lyra's crew built the physical hardware before the editor reached the documentation — but anyone reading the schematic to repair the reactor would now follow the indigo overlay and break it. He is not breaking the reactor. He is breaking the next person who tries to fix the reactor. That is a longer game than I had given him credit for.",
        },
        voId: "elara.engineering.schematic-pad.look",
        grantsInventory: "original-schematic-rubbing",
        recordsActiveEdit: { artifact: "reactor", type: "rewrite" },
        setsFlag: "shadow_tongue_engineering_edits_seen",
        logsClue: {
          id: "clue-engineering-schematic-edited",
          title: "Reactor schematic redirected by the editor",
          body:
            "The engineering blueprint pad shows a reactor coolant schematic in two registers — the warm-gold original intact, the indigo overlayer redirecting three connection points on the secondary loop. The hardware itself was built before the edit and runs correctly. Anyone repairing the reactor from the documentation would follow the indigo overlay and break it. An original-schematic-rubbing is now in your inventory.",
          source: "engineering",
          order: 9,
        },
        humanReaction: {
          narration: {
            shadow:
              "He's playing for the next century. The hardware is fine; the documentation is poisoned. Nobody dies on this watch. People die on the watch of whoever opens this binder in eighty years.",
            balanced:
              "The edit is patient. The reactor will run, with the original hardware, until someone needs to repair it from the schematic — and then the repair will fail. The editor is not after us. He is after the people who come after us. We have time to fix this. We do not have to fix it on the same shift we found it.",
            warm:
              "He is writing for a reader who will live a hundred years from now and will trust the document because the document is the only thing that survives. That is the deepest tier of his cruelty, and it is the one that makes him beatable — because every original we preserve is a reader, a hundred years from now, who he does not get to lie to. The rubbing in your hand is one such reader, saved.",
          },
          voId: "detective.engineering.schematic-pad.look",
        },
        // Mystery Engine binding — when the Degen arc is the
        // active case, the schematic-pad surfaces the Degen's
        // first brokerage-record entry from his own ledger. Lore
        // match: the pad already documents two registers (warm-
        // gold original / indigo overlay), and the Degen's
        // ledger has the same shape — every standard entry runs
        // in his broker-tone, but the first morning's entry
        // (written in a tone the rest of the ledger never
        // repeats) is the warm-gold original underneath.
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e1",
          cluesFound: ["degen.e1.degens_first_brokerage_record"],
        },
      },
      use: {
        narration: {
          lucid:
            "You take a graphite rubbing of the warm-gold underlayer. The indigo overlay smudges; the original survives. Pocket the rubbing. Combine it with a corrupted-fragment to dissolve the editor's redirection.",
          fragmented:
            "The original. The original. The original survives. The original survives.",
          luminous:
            "You have an original-schematic-rubbing. The next reader of the reactor binder, a hundred years from now, has just been spared a death. That is the kind of thing this case is going to be measured in. Not victories — vacancies in a future obituary list.",
        },
        voId: "elara.engineering.schematic-pad.use",
        // Mystery Engine binding — when the Degen arc is the
        // active case, taking the schematic rubbing also dislodges
        // a small ivory card pressed into the schematic-pad's
        // binding: Mol'Vereth's visiting card. Lore match: the
        // pad's binding is the same physical fold that held the
        // Degen's first-brokerage entry (bound to schematic-
        // pad:look in this slice); Mol'Vereth files trustee-
        // status updates by pressing the card into the binding
        // where the trustee will eventually find it during routine
        // ledger work.
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e1",
          cluesFound: ["degen.e1.mol_vereth_visiting_card"],
        },
      },
    },
  },
};
