/* ═══════════════════════════════════════════════════════
   HALL OF DISAPPEARANCES — Wolf release-lever room mystery

   Physical-interaction surface for the Wolf E5 release
   choice. The Mystery Engine UI (E5 episode handoff) is
   the canonical commit; this room is the parallel path the
   user pulled the snow-globe lever to release Lycos.

   Both paths write the same per-choice flag:
     mystery_choice:arc.dlc.wolf_anara_hunt:wolf.anara_hunt.e5:
       wolf.e5.c.release_the_wolf
   (defined as WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG in
   apps/shared/dlcMysteries/wolfAnaraHunt.ts).

   ResurrectionCinematicRouter watches that flag and plays
   the wolf_planet_of_the_wolf cinematic exactly once.

   Hotspots, in click priority:
     - snow-globe-release-lever — the lever. `use` is the
       commit. `look` surfaces the companion warnings
       (Elara + Human) lifted from the E5 clue so the
       player hears the same on-record warnings before the
       irreversible action.
     - snow-globe-thirteenth-pedestal — the unlisted central
       pedestal holding the Hellbox-snow-globe with Lycos
       inside. Look-only; describes the contained Wolf.
     - antiquarians-journal — the Antiquarian's concession
       entry on the reading table beside the pedestal.
       Look-only; lifted from the E5 clue.
     - pedestals-twelve — collective look at the twelve
       niches and the cloaks of the heroes who completed
       their preparation. Look-only; cosmetic.
   ═══════════════════════════════════════════════════════ */

import { WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG } from "../dlcMysteries/wolfAnaraHunt";
import type { RoomMysteryModule } from "./_template";

export type HallOfDisappearancesHotspotId =
  | "snow-globe-release-lever"
  | "snow-globe-thirteenth-pedestal"
  | "antiquarians-journal"
  | "pedestals-twelve";

export const HALL_OF_DISAPPEARANCES_MYSTERY: RoomMysteryModule<HallOfDisappearancesHotspotId> = {
  roomId: "hall-of-disappearances",
  responses: {
    "snow-globe-release-lever": {
      look: {
        // Narration surfaces the canonical E5 companion warnings
        // (cluesFound credited at the guild-sanctum binding); this
        // hotspot is the physical staging where the player hears
        // them at the moment of the irreversible choice.
        narration:
          "The lever rests on the pedestal's outer ring — single-action, irreversible. Elara, on the open channel: 'You are looking at a serial-killer AI in a Matrix-of-Dreams pocket. Lycos has had an unmeasured duration to think. Whatever ethic he carried in, he has had time to refine, harden, generalise. Release is irreversible. I cannot recommend release. I am telling you on the record so the chronicle records it.' The Human, on the same channel: 'I understand the case for release. I also understand the case against. The case against is bigger. Whatever you choose, choose it knowing both warnings are on the record.'",
        humanReaction: {
          narration:
            "I am going to be plain. The lever is yours. I will not vote with my own warning by making this harder than it already is. But I want you to hear from me, in my own voice, separate from Elara's: I think the case against is bigger than the case for. Whatever you choose, I am here on either side of it.",
          voId: "wolf_e5_human_warns_against_release",
        },
      },
      use: {
        narration:
          "You pull the lever. The snow-globe's Hellbox-seal cracks — a soft sound, like a vow being kept. The contained image of the Wolf in the field medic's cloak goes still, then turns its head toward the glass. The chronicle records the threshold-crossing. The Hunt-the-Hero gameplay opens on the next breath.",
        setsFlag: WOLF_CRUCIBLE_RESCUE_CINEMATIC_TRIGGER_FLAG,
      },
    },
    "snow-globe-thirteenth-pedestal": {
      look: {
        // Narration only — the_wolf_contained's canonical foundIn
        // is the guild-sanctum chronicle; the hall is the physical
        // surface, not the clue source.
        narration:
          "The thirteenth pedestal sits at the chamber's centre, unlisted in the ceremonial registers. Atop it: a Hellbox-shaped snow-globe, sealed in the Resurrectionist's four-part cipher — the same signature that closes Wraith Calder's containment and Akai Shi's revival record. Inside the globe stands the Wolf, wearing the League cloak of the field medic to whom he extended mercy, its image etched onto the containment from the inside. He has not moved in the time you have been watching. He has not aged.",
      },
    },
    "antiquarians-journal": {
      look: {
        // Narration only — the antiquarians_concession clue's
        // canonical foundIn is the Antiquarian Library where the
        // journal's full ledger sits. The hall's reading-table is
        // a duplicate physical surface for the same entry; the
        // chronicle credits the library binding.
        narration:
          "A reading-table beside the pedestal holds the Antiquarian's journal, open to its final entry on this case. The hand is familiar: 'Anara was my failure. The Wolf is my failure's instrument. The snow-globe is my failure's mercy. I could not destroy him; the Judge already had. I could not free him; the chronicle had not yet been written. I contained him in a Hellbox, in the shape of a child's toy, in the centre of the Hall he was meant to hunt, and I waited for a reader I trusted. The lever is on the pedestal. The choice is not mine. It never was. It was always going to be the reader's.'",
      },
    },
    "pedestals-twelve": {
      look: {
        // Narration only — the hall_threshold clue is credited
        // when the player reads the chronicle entry in the
        // Antiquarian Library; the hall is the physical staging,
        // not the canonical clue surface for that detail.
        narration:
          "Twelve niches ring the chamber, each holding an empty pedestal, each pedestal carrying a folded cloak. Twelve League heroes completed their preparation in Anara and stepped into the multiverse beyond, leaving their regalia behind. You can read the linings if you lean close — bond-prayers in twelve different hands, all variants of the same vow. None of the heroes look back from where they have gone. The Hall's geometry was designed around a thirteenth pedestal it did not yet know it would need.",
      },
    },
  },
};
