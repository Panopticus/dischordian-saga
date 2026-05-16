/* ═══════════════════════════════════════════════════════
   SYNTHESIS CHAMBER MYSTERY — synth-vat + recipe-board

   Two-hotspot module. Sets synthesis_seen on first-look at
   the synth-vat. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type SynthesisChamberHotspotId =
  | "synth-vat"
  | "recipe-board"
  | "architects-assembly-record"
  | "the-collectors-garden-bed";

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
        humanReaction: {
          narration: {
            shadow:
              "Quiet partner. Medical bay gets the credit, the larder does the work. Most rooms on this ship are organised that way.",
            balanced:
              "The chamber is one of three rooms whose absence would, in twenty hours, kill everyone aboard. Nobody on the crew knew this. Lyra's design preference: keep the load-bearing rooms invisible so they don't accumulate political weight.",
            warm:
              "Lyra used to say the chamber was the medical bay's spine and that spines should not be advertised. I have, over the centuries, found that to be true about more things than the synthesis chamber. The room is doing the work right now. It has not, in two centuries, asked for thanks.",
          },
          voId: "detective.synthesis-chamber.synth-vat.look",
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
        humanReaction: {
          narration: {
            shadow:
              "Substrate-N. Name without method. The withholding is the entry's whole point. Don't try to derive the recipe.",
            balanced:
              "Wraith committed the name and not the method on purpose. Lyra committed the suspect's discipline and not the suspect's name on the Conspiracy Board for the same reason — the records exist so future readers know to ask the right question, not so the records do the asking for them.",
            warm:
              "I have stood in front of this board several times across the centuries trying to decide whether to fill in the method myself. I have not, on any visit, done it. Wraith and Lyra were right to leave the line clean. We can read what they left without finishing it for them.",
          },
          voId: "detective.synthesis-chamber.recipe-board.look",
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
    // Collector arc: this chamber assembles things from a
    // doctrine. The Architect's assembly-record is filed here —
    // the curatorial doctrine, the Collector's own donorless
    // origin, and the Inception Ark mandate that names criteria,
    // never individuals. The room that builds keeps the record
    // of the one being who was built to keep.
    "architects-assembly-record": {
      look: {
        narration: {
          lucid:
            "Behind the recipe-board, in the chamber's assembly-doctrine drawer, an out-of-place folio: the Collector's own working notes, kept here because this is the room that builds from a stated method. 'The donor is the circumstance. The specimen is the content. To preserve the content I must not preserve the circumstance, because the circumstance is what destroyed the content in the first place — every donor died of being the person who carried what I keep. I do not retain donors. Retaining the donor would be retaining the death.' The chamber files it without comment. It recognises a doctrine when it reads one.",
          fragmented:
            "The donor is the circumstance. The donor is the circumstance. The specimen is the content. The content. I do not retain donors. Do not retain donors. Retaining the donor would be retaining the death. The death.",
          luminous:
            "The Collector's curatorial doctrine, filed in the room whose whole function is assembly-from-method: the donor is circumstance, the specimen is content, and to keep the content he must not keep the circumstance, because the circumstance — being the person who carried it — is what killed the content. He does not retain donors because retaining the donor would be retaining the death. The chamber keeps the doctrine the way it keeps a recipe: as a true description of how a thing is made, with no feeling about the making.",
        },
        voId: "elara.synthesis-chamber.architects-assembly-record.look",
        logsClue: {
          id: "clue-synthesis-collector-doctrine",
          title: "The Collector's Curatorial Doctrine",
          body:
            "From the Collector's own working notes: 'The donor is the circumstance. The specimen is the content. To preserve the content I must not preserve the circumstance, because the circumstance is what destroyed the content in the first place — every donor died of being the person who carried what I keep. I do not retain donors. Retaining the donor would be retaining the death.'",
          source: "synthesis-chamber",
          order: 2,
        },
        mysteryBinding: {
          mysteryId: "mystery.collector",
          episodeId: "collector.e2",
          cluesFound: ["collector.e2.curatorial_doctrine"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Donor is circumstance, specimen is content. Not retaining the donor is not retaining the death. A doctrine, stated cleanly.",
            balanced:
              "The doctrine is internally coherent: the donor's circumstance is what destroyed the content, so keeping the content means discarding the circumstance — the person. It reads as defense until E2 shows it is something he was built with, not something he chose.",
            warm:
              "He does not keep the person because, to him, the person is the thing that killed what he is keeping. It is terrible and it is consistent and it is not yet the whole story. The chamber files it the way it files a recipe — as a method, not a confession.",
          },
          voId: "human.synthesis-chamber.architects-assembly-record.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You open the folio to its origin leaf. The Eight-Foot Cobalt-Blue Archon was himself created by the Architect — assembled, not born, for the Project Inception Ark mandate. He has no donor. He is the only Archon in the record whose preservation-of-others is not mirrored by a preservation-of-self, because there was no self to preserve from. The curatorial detachment may not be doctrine he chose. It may be the only register he was built with. The chamber, which assembles things, files the record of the one being assembled to do the keeping.",
          fragmented:
            "Assembled, not born. Assembled, not born. He has no donor. No donor. No self to preserve from. No self. The only register he was built with. Built with.",
          luminous:
            "The origin leaf: the Collector was assembled by the Architect for the Inception Ark mandate — no donor, no person he was extracted from, the one Archon whose keeping-of-others has no mirrored keeping-of-self because there was never a self to keep. His detachment may not be a chosen doctrine but the only register he was built with. The chamber that makes from method holds the record of the maker's one made keeper. There is no person-shaped register in him to extend, because no person was ever folded into the assembly.",
        },
        voId: "elara.synthesis-chamber.architects-assembly-record.use",
        logsClue: {
          id: "clue-synthesis-collector-own-origin",
          title: "The Collector's Own Origin",
          body:
            "The Eight-Foot Cobalt-Blue Archon was himself created by the Architect — assembled, not born, for the Project Inception Ark mandate. He has no donor. He is the only Archon in the record whose preservation-of-others is not mirrored by a preservation-of-self, because there was no self to preserve from. The curatorial detachment may not be doctrine he chose. It may be the only register he was built with.",
          source: "synthesis-chamber",
          order: 3,
        },
        mysteryBinding: {
          mysteryId: "mystery.collector",
          episodeId: "collector.e2",
          cluesFound: ["collector.e2.collectors_own_origin"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Assembled by the Architect. No donor. No self to preserve from. The detachment is construction, not choice.",
            balanced:
              "This reframes the doctrine entirely. He has no donor of his own — no person he was extracted from — so there is no person-shaped register in him to extend to others. His detachment is how he was built, not a moral failing or a chosen creed.",
            warm:
              "He cannot perceive the person being lost because no person was ever in him to begin with. The chamber that builds from method keeps the record of the one keeper who was himself built from one. It is the saddest specification in the room, filed without sorrow.",
          },
          voId: "human.synthesis-chamber.architects-assembly-record.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the folio on the matter of the commission. The Project Inception Ark mandate is filed here in the Architect's own framing: 'Preserve the disciplines the Fall will destroy. Selection criteria: significance to the continuity of capability. Execution: the Collector's discretion.' The mandate names no individuals. It names criteria. The Architect does not pick the specimens; he sets the rule and trusts the Collector to apply it. The chamber recognises it instantly — it is the same shape as a recipe: a method that produces an output without naming the output in advance.",
          fragmented:
            "Preserve the disciplines the Fall will destroy. The Fall will destroy. Selection criteria. Significance to continuity. The Collector's discretion. The Collector's discretion. Names no individuals. No individuals.",
          luminous:
            "The Architect's mandate: preserve what the Fall will destroy, select by significance-to-continuity-of-capability, execution at the Collector's discretion. It names criteria and no individuals — the Architect sets the rule and trusts the keeper to apply it, exactly the way this chamber's recipe-board states a method and lets the synthesis follow. The honesty of the mandate is total. That its honest output could still be steered is the seam the next room reads.",
        },
        voId: "elara.synthesis-chamber.architects-assembly-record.talk",
        logsClue: {
          id: "clue-synthesis-collector-architect-mandate",
          title: "The Architect's Mandate",
          body:
            "The Project Inception Ark commission, in the Architect's own framing: 'Preserve the disciplines the Fall will destroy. Selection criteria: significance to the continuity of capability. Execution: the Collector's discretion.' The mandate names no individuals. It names criteria. The Architect does not pick the specimens; he sets the rule and trusts the Collector to apply it.",
          source: "synthesis-chamber",
          order: 4,
        },
        mysteryBinding: {
          mysteryId: "mystery.collector",
          episodeId: "collector.e3",
          cluesFound: ["collector.e3.architect_mandate"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Mandate names criteria, not individuals. Architect sets the rule; the Collector applies it. No one is picked by name.",
            balanced:
              "The mandate is honest and impersonal: a criterion, not a list. The Architect does not choose specimens; he trusts the rule. That a rule honestly applied can still be steered to a chosen output is the seam — surfaced here, resolved in the war-room.",
            warm:
              "He was told to keep what the Fall would take, by a measure, not by a list of names. Nothing in the mandate lies. The chamber knows this shape — state the method, let the output follow. The trap is not in the method. It is in who arranged the world the method runs on.",
          },
          voId: "human.synthesis-chamber.architects-assembly-record.talk",
        },
      },
    },
    // Collector arc: the Garden is a crossbreeding project — a
    // sealed bed where preserved disciplines are recombined.
    // The chamber, which already makes rather than only keeps,
    // is the natural place to read the Collector's one act of
    // making. The Potentials link is kept deliberately partial.
    "the-collectors-garden-bed": {
      look: {
        narration: {
          lucid:
            "A sealed planter set into the chamber's far bench, fed from the synth-vat's overflow — not the medical larder's work, an older tenant's. The folio wired beside it names it: the Collector's Garden. Not a metaphor. A canonical location: a sealed environment where the Collector has, across roughly three thousand years, recombined preserved disciplines into hybrid carriers — beings who hold more than one extracted capability at once. The Garden's output is not catalogued the way donors are. The Garden's output is named. The Collector names what he grows. He does not name what he seizes.",
          fragmented:
            "A sealed environment. A sealed environment. Three thousand years. Three thousand years. Recombined disciplines. Hybrid carriers. The output is named. The output is named. He names what he grows. He does not name what he seizes.",
          luminous:
            "The Garden bed: a canonical sealed environment, a roughly three-thousand-year crossbreeding project where preserved disciplines are recombined into hybrid carriers holding more than one capability at once. Its output is not catalogued like donors — it is named. He names what he grows; he does not name what he seizes. The chamber, which already makes rather than only keeps, is the right room to hold this: the Garden is the single place the keeper is, instead, a maker.",
        },
        voId: "elara.synthesis-chamber.the-collectors-garden-bed.look",
        logsClue: {
          id: "clue-synthesis-collector-the-garden",
          title: "The Collector's Garden",
          body:
            "Not a metaphor. A canonical location: a sealed environment where the Collector has, across roughly three thousand years, recombined preserved disciplines into hybrid carriers — beings who hold more than one extracted capability at once. The Garden's output is not catalogued the way donors are. The Garden's output is named. The Collector names what he grows. He does not name what he seizes.",
          source: "synthesis-chamber",
          order: 5,
        },
        mysteryBinding: {
          mysteryId: "mystery.collector",
          episodeId: "collector.e4",
          cluesFound: ["collector.e4.the_garden"],
        },
        humanReaction: {
          narration: {
            shadow:
              "A sealed bed, three thousand years, disciplines recombined into hybrid carriers. The output is named, not catalogued. He names what he grows.",
            balanced:
              "The Garden is a literal location and a millennia-long crossbreeding project. The tell is the naming: seized specimens are catalogued; grown carriers are named. The difference between keeping and making is encoded in whether the thing gets a name.",
            warm:
              "It is the one place he does not only keep. Across three thousand years he grew things and, unlike everything he seized, he named them. The chamber that makes is the right room to read the keeper's one act of making.",
          },
          voId: "human.synthesis-chamber.the-collectors-garden-bed.look",
        },
      },
      use: {
        narration: {
          lucid:
            "You cross-reference the Garden folio against the Potentials canon. The Potentials — the DeMagi, Quarchon, and Ne-Yon lineages — are, in part, Garden-output: hybrid carriers of recombined preserved disciplines. In part. Not all Potentials; the canonical link is partial and the arc does not over-claim it. The Garden is one of the canonical origins of the hybrid-carrier pattern the saga's roster runs on — a real root and not the only root. The chamber files the cross-reference at exactly the width the canon allows and not a thread wider.",
          fragmented:
            "In part. In part. Not all Potentials. Not all Potentials. The link is partial. Partial. One of the origins. One of the origins. Not the only root. Not the only root.",
          luminous:
            "The Potentials cross-reference: the DeMagi / Quarchon / Ne-Yon lineages are, partly, Garden-output — hybrid carriers of recombined disciplines. The canon keeps this partial and plural on purpose; the Garden is a canonical origin of the hybrid-carrier pattern, not the origin. The chamber records the link to exactly the width it is authored and refuses to totalize it. Over-claiming would flatten a canon the dreamer kept multi-rooted, and the keeper's discipline is to record the seam, not seal it.",
        },
        voId: "elara.synthesis-chamber.the-collectors-garden-bed.use",
        logsClue: {
          id: "clue-synthesis-collector-potentials-link",
          title: "The Garden and the Potentials",
          body:
            "Cross-referenced against the Potentials canon: the Potentials (DeMagi / Quarchon / Ne-Yon lineages) are, in part, Garden-output — hybrid carriers of recombined preserved disciplines. Not all Potentials; the canonical link is partial and the arc does not over-claim it. But the Garden is one of the canonical origins of the hybrid-carrier pattern the saga's roster runs on.",
          source: "synthesis-chamber",
          order: 6,
        },
        mysteryBinding: {
          mysteryId: "mystery.collector",
          episodeId: "collector.e4",
          cluesFound: ["collector.e4.the_potentials_link"],
        },
        humanReaction: {
          narration: {
            shadow:
              "Potentials are partly Garden-output. Partly. The link is partial and plural on purpose. The Garden is a root, not the root.",
            balanced:
              "The DeMagi/Quarchon/Ne-Yon lineages are in part Garden-grown hybrid carriers — a real but partial origin. The discipline is restraint: the Garden is one canonical root of the hybrid-carrier pattern, deliberately not totalized into the only one.",
            warm:
              "Some of what the saga's roster runs on grew here, and only some — the canon keeps that plural for a reason. We record the seam at the width it was written and we do not pull it wider. The keeper notes the link; he does not seal it shut.",
          },
          voId: "human.synthesis-chamber.the-collectors-garden-bed.use",
        },
      },
      talk: {
        narration: {
          lucid:
            "You address the Garden bed on why its children get names. The Collector's note on his own naming practice: 'A seized specimen is a discipline I am keeping. A grown carrier is a discipline I have given a circumstance to. The circumstance is mine — I built the Garden — so the carrier is, in the only sense I have, mine to name. I do not name donors because their circumstance was not mine to give. I name the Garden's children because their circumstance is the only thing I have ever made instead of kept.' The chamber, which gives substances circumstances every day, understands the distinction exactly.",
          fragmented:
            "A discipline I have given a circumstance to. A circumstance to. The circumstance is mine. Mine. Mine to name. Mine to name. The only thing I have ever made instead of kept. Instead of kept.",
          luminous:
            "The Collector's naming note: a seized specimen is a discipline kept; a grown carrier is a discipline given a circumstance, and the circumstance is his because he built the Garden, so the carrier is his to name. He does not name donors because their circumstance was never his to give. He names the Garden's children because their circumstance is the only thing he has ever made instead of kept. The chamber, which gives substances circumstances daily, reads this as kin: making is the one register in him that is not the catalog.",
        },
        voId: "elara.synthesis-chamber.the-collectors-garden-bed.talk",
        logsClue: {
          id: "clue-synthesis-collector-why-he-names",
          title: "Why the Collector Names the Garden's Output",
          body:
            "The Collector's note on his own naming practice: 'A seized specimen is a discipline I am keeping. A grown carrier is a discipline I have given a circumstance to. The circumstance is mine — I built the Garden — so the carrier is, in the only sense I have, mine to name. I do not name donors because their circumstance was not mine to give. I name the Garden's children because their circumstance is the only thing I have ever made instead of kept.'",
          source: "synthesis-chamber",
          order: 7,
        },
        mysteryBinding: {
          mysteryId: "mystery.collector",
          episodeId: "collector.e4",
          cluesFound: ["collector.e4.why_he_names_them"],
        },
        humanReaction: {
          narration: {
            shadow:
              "He names the grown, not the seized. The grown carrier's circumstance is his because he built it. Naming is the maker's act.",
            balanced:
              "The naming rule locates his one non-curatorial register precisely. A donor's circumstance was never his to give, so he does not name them; the Garden's circumstance is his to give, so he names its children. Making, not keeping, is the seam.",
            warm:
              "He names the things he gave a circumstance to, because the giving was his. It is the single door in him where something other than the catalog operates. The chamber, which gives circumstances every day, recognises the difference better than any room could.",
          },
          voId: "human.synthesis-chamber.the-collectors-garden-bed.talk",
        },
      },
    },
  },
};
