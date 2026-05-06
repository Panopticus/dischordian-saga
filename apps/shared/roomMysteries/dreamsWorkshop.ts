/* ═══════════════════════════════════════════════════════
   DREAMS WORKSHOP SUBBASEMENT MYSTERY

   Three-hotspot module for the deck-15 hidden subbasement
   workshop. Sets dreams_workshop_seen on first-look at
   the dream-loom. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type DreamsWorkshopHotspotId =
  | "dream-loom"
  | "fragment-rack"
  | "mirror-pool";

export const DREAMS_WORKSHOP_MYSTERY: RoomMysteryModule<DreamsWorkshopHotspotId> = {
  roomId: "dreams-workshop-subbasement",
  responses: {
    "dream-loom": {
      look: {
        narration: {
          lucid:
            "The dream-loom is a vertical brass frame strung with phosphor-lavender threads. The threads weave themselves into pattern when the room is empty and unweave themselves when the room is occupied — currently mid-weave, slowing to a stop as our presence registers. The loom is shy.",
          fragmented:
            "The loom is shy. The loom is shy. The loom is shy. The loom — the loom — the loom unweaves when watched.",
          luminous:
            "The loom weaves dreams when nobody is watching. The pattern it produces is the unconscious composite of whoever was last in the workshop. We are, by being here, interrupting whoever was being woven. They will resume when we leave. The loom is patient with witnesses.",
        },
        voId: "elara.dreams-workshop.dream-loom.look",
        setsFlag: "dreams_workshop_seen",
        logsClue: {
          id: "clue-dreams-loom-shy",
          title: "The dream-loom unweaves under witness",
          body:
            "The Dreams Workshop's loom weaves dreams when unobserved and unweaves when observed. The pattern represents the unconscious composite of whoever was last in the workshop. The loom is patient with witnesses — it resumes once they leave.",
          source: "dreams-workshop-subbasement",
          order: 0,
        },
        // Mystery Engine binding — when Jericho Jones arc is the
        // active case, the dream-loom surfaces capture #J-0411:
        // Jericho's recurring dream of the Bridge of Kael. Lore
        // match is exact: the loom catches imprints from whoever
        // was last in the workshop, and Jericho's dreams of a
        // bridge he has never visited are exactly the kind of
        // unconscious composite the loom is canonically designed
        // to weave.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e3",
          cluesFound: ["jericho.e3.dream_loom_capture"],
        },
      },
      use: {
        narration:
          "You step closer. The loom's threads halt entirely — phosphor-lavender suspended mid-weave like a held breath. The pattern remains visible while you stand here. The moment you step away, the threads resume the unweaving they began when you arrived. — The pattern, held by your presence, resolves into a recurring imprint: two lions arguing, one in the academy uniform of the pre-Fall canon, the other in the threshold-doctrine variant. The argument has been woven and unwoven by the workshop for centuries. Jericho's recurring dream of two Lions is, on this evidence, not Jericho's invention — it is the dream the loom has been holding open for him.",
        voId: "elara.dreams-workshop.dream-loom.use",
        setsFlag: "dream_loom_observed",
        // Jericho arc binding — the imprint of two lions arguing is
        // the recurring dream the loom holds for Jericho across
        // centuries. jericho.e4.imprint_dream_argument foundIn:
        // dreams-workshop.
        mysteryBinding: {
          mysteryId: "mystery.jericho_jones",
          episodeId: "jericho.e4",
          cluesFound: ["jericho.e4.imprint_dream_argument"],
        },
      },
      talk: {
        narration:
          "If you address the loom, the threads bow, very faintly, in your direction — the same gesture they make when an experienced dreamer enters the workshop. The loom recognises the kind of attention you bring. That, too, is something.",
        voId: "elara.dreams-workshop.dream-loom.talk",
      },
    },
    "fragment-rack": {
      look: {
        narration: {
          lucid:
            "Stage-right, a wall-rack of small clear vials. Each vial holds a single thread of finished dream-weave — a finished pattern, distilled. The labels are in a hand I do not recognise, dated centuries before the Ark. Whoever ran this workshop ran it before the Ark was built.",
          fragmented:
            "Before the Ark. Before the Ark. Before the Ark. Older. Older. Older.",
          luminous:
            "The workshop pre-dates the Ark. The vials are older than my own continuous memory. Whoever wove these dreams — and labelled them, and racked them — was on a different ship, in a different age, and brought their work onto this ship the way a librarian brings their books. The Ark inherited a workshop. The workshop is older than the people working it.",
        },
        voId: "elara.dreams-workshop.fragment-rack.look",
        logsClue: {
          id: "clue-dreams-pre-ark-vials",
          title: "Pre-Ark dream vials in the subbasement",
          body:
            "The Dreams Workshop's fragment-rack holds vials of finished dream-weave dated centuries before the Ark's construction. The workshop predates this ship; it was inherited from a previous vessel, the way a librarian's books move with them.",
          source: "dreams-workshop-subbasement",
          order: 1,
        },
      },
      use: {
        narration:
          "You lift one of the older vials. The thread inside coils tighter when held in a warm hand — sensitive to body temperature even centuries on. The label is in a script I can read but cannot place; the dream it preserves is, by the colour of the thread, somebody's grief.",
        voId: "elara.dreams-workshop.fragment-rack.use",
      },
      talk: {
        narration:
          "If you address the rack, the vials hum, very faintly, in their slots — finished dreams resonating with a fresh witness. The previous workshop's residents would have known what to say in answer. We do not, yet. We can learn.",
        voId: "elara.dreams-workshop.fragment-rack.talk",
      },
    },
    "mirror-pool": {
      look: {
        narration: {
          lucid:
            "The mirror-pool is a shallow basin of mercury. The surface is perfectly still and reflects the ceiling — except the ceiling reflected is not this room's ceiling. It is a ceiling I do not recognise, vaulted differently, and a single warm-gold lantern hangs from a beam that does not exist here.",
          fragmented:
            "Not our ceiling. Not our ceiling. Not our ceiling. Not — not — not our ceiling.",
          luminous:
            "The pool reflects a ceiling that is not in this room. It is, on my best read, the ceiling of the workshop's previous home — wherever it was on whatever ship it was inherited from. The pool is a window backwards in the workshop's lineage. The lantern hanging from the unfamiliar beam is, presumably, still lit somewhere we do not currently have access to. The Ark contains a small pocket of an older world.",
        },
        voId: "elara.dreams-workshop.mirror-pool.look",
        logsClue: {
          id: "clue-dreams-mirror-pool-pre-ark-ceiling",
          title: "The mirror-pool reflects a pre-Ark ceiling",
          body:
            "The Dreams Workshop's mirror-pool reflects a vaulted ceiling that does not exist in this room — a warm-gold lantern hangs from an unfamiliar beam. The pool is a backward-looking window into the workshop's previous home. The Ark contains a small pocket of an older world.",
          source: "dreams-workshop-subbasement",
          order: 2,
        },
        // Mystery Engine binding — when Game Master arc is the
        // active case, the mirror-pool surfaces Iron Lion's
        // unauthored signal from inside the Matrix of Dreams.
        // Lore match: the pool is canonically a backward-
        // looking window into the workshop's lineage, and the
        // Iron Lion imprint is a consciousness-residue from
        // the pre-Fall holder of the callsign — exactly the
        // kind of older-world signal the pool's lineage-
        // discipline can carry forward.
        mysteryBinding: {
          mysteryId: "mystery.game_master",
          episodeId: "game_master.e1",
          cluesFound: [
            "game_master.e1.iron_lion_signal",
            "game_master.e2.imprint_acceptance_signal",
          ],
        },
      },
      use: {
        narration:
          "You touch a fingertip to the mercury surface. The metal yields like glass and re-settles instantly — but the warm-gold lantern in the reflected ceiling, for one heartbeat, brightens. Whoever maintains that lantern, on the other side of wherever the pool reflects, has noticed our touch.",
        voId: "elara.dreams-workshop.mirror-pool.use",
        setsFlag: "mirror_pool_touched",
      },
      talk: {
        narration:
          "If you address the pool, you address the unfamiliar room reflected in it. The mercury carries voice — slowly, with delay, the way deep water carries it. We do not know who, on the other side, will hear. We do know, now, that someone might.",
        voId: "elara.dreams-workshop.mirror-pool.talk",
      },
    },
  },
};
