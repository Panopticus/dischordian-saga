/* ═══════════════════════════════════════════════════════
   SPECIES-EXCLUSIVE ROOM MODULES — bonus content

   Six bonus rooms, two per species, gated by canAccessRoom()
   in apps/shared/characterCreationImpact.ts. Each player only
   sees their own two — ⅔ of bonus content is invisible per
   playthrough.

   ACCESSIBILITY CONSTRAINT (load-bearing):
   Every flag set by these modules is cosmetic / Loredex-only.
   No flag here may be a prerequisite for any other room, item,
   quest, or critical-path content. The §6.3b parity probe
   (apps/shared/roomAccessibilityParity.test.ts) must remain
   green after this file is added — it asserts no critical-path
   content lives in a species-gated room.

   Six modules collected in one file (vs. one-file-per-room) to
   keep the species-content footprint visible at a glance.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

/* ─── DEMAGI ─────────────────────────────────────────── */

export type ElementalForgeHotspotId =
  | "crucible-of-origins"
  | "ancestral-anvil";

export const ELEMENTAL_FORGE_MYSTERY: RoomMysteryModule<ElementalForgeHotspotId> = {
  roomId: "the_elemental_forge",
  responses: {
    "crucible-of-origins": {
      look: {
        narration: {
          lucid:
            "The crucible-of-origins is suspended over a slow-pulsing magma vent. The brass tiles ringing it represent the eight elemental relations, but the four DeMagi tiles — earth, fire, water, air — glow brighter than the others. The crucible recognises your bloodline.",
          fragmented:
            "Brighter. Brighter. Brighter. They glow brighter for me.",
          luminous:
            "The crucible recognises a DeMagi reader. The four DeMagi tiles flare warm-gold under your attention; the four Quarchon tiles dim by contrast. This is the room's whole conversation with you — it is, in effect, saying hello in your inheritance's vocabulary. Stand here. The room has been waiting.",
        },
        voId: "elara.elemental-forge.crucible-of-origins.look",
        setsFlag: "demagi_forge_seen",
        logsClue: {
          id: "clue-demagi-forge-recognises-bloodline",
          title: "The Elemental Forge recognises DeMagi readers",
          body:
            "The crucible-of-origins responds to a DeMagi visitor by brightening the four DeMagi elemental tiles and dimming the Quarchon ones. The room's recognition is a greeting in inherited vocabulary. (DeMagi-only bonus content.)",
          source: "the_elemental_forge",
          order: 0,
        },
      },
    },
    "ancestral-anvil": {
      look: {
        narration:
          "Three meters tall, polished mirror-bright. The face holds a faint reflection of the most recent ancestor in your line who struck it. The reflection is, on most days, a stranger to the visitor. Today it is a stranger to you.",
        voId: "elara.elemental-forge.ancestral-anvil.look",
      },
    },
  },
};

export type BloodArchiveHotspotId = "lineage-codex" | "blood-relic-shrine";

export const BLOOD_ARCHIVE_MYSTERY: RoomMysteryModule<BloodArchiveHotspotId> = {
  roomId: "blood_archive",
  responses: {
    "lineage-codex": {
      look: {
        narration:
          "A brass-bound codex chained to its shelf, opening of its own accord to the page that records your particular branch of DeMagi lineage. The page is dense with names. Most you do not recognise. One, a great-great-aunt, is annotated in handwriting that matches the schematics in Lyra's forge. She knew you would arrive here.",
        voId: "elara.blood-archive.lineage-codex.look",
        setsFlag: "demagi_archive_seen",
        logsClue: {
          id: "clue-demagi-archive-aunt-annotation",
          title: "A great-great-aunt annotated your lineage in Lyra's hand",
          body:
            "The Blood Archive's lineage codex opens to the player's branch of DeMagi descent. A great-great-aunt's entry is annotated in Lyra Vox's handwriting. (DeMagi-only bonus content.)",
          source: "blood_archive",
          order: 0,
        },
      },
    },
    "blood-relic-shrine": {
      look: {
        narration:
          "A low oxblood-leather altar holding a single covered relic under glass. The relic is yours by inheritance, by the rule of the room — the shrine displays the relic relevant to whichever DeMagi has just walked in. The cover is closed. You may, in time, be ready to lift it. Not today.",
        voId: "elara.blood-archive.blood-relic-shrine.look",
      },
    },
  },
};

/* ─── QUARCHON ───────────────────────────────────────── */

export type ProbabilityChamberHotspotId = "wavefunction-rig" | "dice-of-states";

export const PROBABILITY_CHAMBER_MYSTERY: RoomMysteryModule<ProbabilityChamberHotspotId> = {
  roomId: "probability_chamber",
  responses: {
    "wavefunction-rig": {
      look: {
        narration:
          "A brass armature suspending a translucent quartz orb that pulses through superposed images of itself. The orb is, on the rig's working principle, every possible state at once — and your presence collapses it, briefly, into the version most likely to be true. The collapse is unsettling because the version is, in some details, slightly different from the version you walked in expecting.",
        voId: "elara.probability-chamber.wavefunction-rig.look",
        setsFlag: "quarchon_chamber_seen",
        logsClue: {
          id: "clue-quarchon-chamber-collapse",
          title: "The wavefunction-rig collapses to the slightly-wrong version",
          body:
            "The Probability Chamber's wavefunction-rig collapses, briefly, into the version of reality most likely to be true — which is not always the version the visitor walked in expecting. (Quarchon-only bonus content.)",
          source: "probability_chamber",
          order: 0,
        },
      },
    },
    "dice-of-states": {
      look: {
        narration:
          "Twelve hand-carved dice, each inscribed with an unknown sigil. Rolling them is forbidden by the room's working discipline — the dice are for contemplation, not consultation. Whoever carved them did not want them used to make decisions. They wanted them used to read decisions already made.",
        voId: "elara.probability-chamber.dice-of-states.look",
      },
    },
  },
};

export type DimensionalObservatoryHotspotId = "rift-lens" | "dimension-loom";

export const DIMENSIONAL_OBSERVATORY_MYSTERY: RoomMysteryModule<DimensionalObservatoryHotspotId> = {
  roomId: "dimensional_observatory",
  responses: {
    "rift-lens": {
      look: {
        narration:
          "A brass-and-glass aperture pointing upward, currently showing a fractal slice of an unfamiliar starfield. The starfield is, on the lens's calibration, a different galaxy — or possibly the same galaxy at a different point in its history. The lens does not commit to which. That refusal is the room's discipline.",
        voId: "elara.dimensional-observatory.rift-lens.look",
        setsFlag: "quarchon_observatory_seen",
        logsClue: {
          id: "clue-quarchon-observatory-rift-lens",
          title: "The rift-lens refuses to specify what it is showing",
          body:
            "The Dimensional Observatory's rift-lens shows an unfamiliar starfield without specifying whether it is a different galaxy or a different time. The refusal is a Quarchon discipline — the lens shows the question, not the answer. (Quarchon-only bonus content.)",
          source: "dimensional_observatory",
          order: 0,
        },
      },
    },
    "dimension-loom": {
      look: {
        narration:
          "A vertical brass frame strung with phosphor-lavender threads weaving themselves into a slow-shifting tapestry of glyphs you almost recognise. The loom is related to the dreams-workshop loom in the same way two siblings are related — different orientations of the same inheritance.",
        voId: "elara.dimensional-observatory.dimension-loom.look",
      },
    },
  },
};

/* ─── NE-YON ─────────────────────────────────────────── */

export type HybridSanctumHotspotId = "dual-altar" | "severed-mirror";

export const HYBRID_SANCTUM_MYSTERY: RoomMysteryModule<HybridSanctumHotspotId> = {
  roomId: "hybrid_sanctum",
  responses: {
    "dual-altar": {
      look: {
        narration:
          "Two halves: one in DeMagi brass-and-magma motifs, the other in Quarchon phosphor-lavender-and-glass. The seam where they meet is the room's whole proposition — neither side dominates, neither side reconciles, both halves remain themselves. The Ne-Yon discipline is to hold the tension rather than resolve it.",
        voId: "elara.hybrid-sanctum.dual-altar.look",
        setsFlag: "neyon_sanctum_seen",
        logsClue: {
          id: "clue-neyon-sanctum-dual-altar",
          title: "The dual altar holds tension rather than resolving it",
          body:
            "The Hybrid Sanctum's dual altar combines DeMagi and Quarchon motifs without reconciling them. The Ne-Yon discipline holds the tension rather than resolving it — a third path, neither parent species, that survives by refusing synthesis. (Ne-Yon-only bonus content.)",
          source: "hybrid_sanctum",
          order: 0,
        },
      },
    },
    "severed-mirror": {
      look: {
        narration:
          "A floor-to-ceiling mirror split chest-high by a hairline crack. The crack widens to a notch where the two altar halves meet. Looking into the upper half of the mirror reflects you as the DeMagi parent saw you; looking into the lower half reflects you as the Quarchon parent saw you. Both reflections are accurate. Neither is complete.",
        voId: "elara.hybrid-sanctum.severed-mirror.look",
      },
    },
  },
};

export type TheBetweenHotspotId = "threshold-stone" | "between-pool";

export const THE_BETWEEN_MYSTERY: RoomMysteryModule<TheBetweenHotspotId> = {
  roomId: "the_between",
  responses: {
    "threshold-stone": {
      look: {
        narration:
          "A single brass threshold-stone, knee-high, set in a circular pool of still water. Standing on it puts you in the room called The Between — a doorway that goes nowhere and everywhere. The room's whole content is the stone and your willingness to stand on it.",
        voId: "elara.the-between.threshold-stone.look",
        setsFlag: "neyon_between_seen",
        logsClue: {
          id: "clue-neyon-the-between-threshold",
          title: "The Between is a single threshold-stone",
          body:
            "The Between's content is a single brass threshold-stone in a circular pool. The room rewards the visitor's willingness to stand on the threshold without crossing it — Ne-Yon's third-path discipline made architecture. (Ne-Yon-only bonus content.)",
          source: "the_between",
          order: 0,
        },
      },
    },
    "between-pool": {
      look: {
        narration:
          "The pool reflects a ceiling that is not in this room. The reflection is consistent with the dreams-workshop mirror-pool — both rooms see into the same elsewhere, from different vantages. The Between is, in the architecture's working logic, the room from which the dreams-workshop was inherited. Or possibly the other way around. The room does not commit.",
        voId: "elara.the-between.between-pool.look",
      },
    },
  },
};
