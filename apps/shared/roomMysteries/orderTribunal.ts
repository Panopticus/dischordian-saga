/* ═══════════════════════════════════════════════════════
   ORDER TRIBUNAL MYSTERY — judges-bench + evidence-locker

   Two-hotspot module. Sets tribunal_seen on first-look at
   the judges-bench. Universal room.
   ═══════════════════════════════════════════════════════ */

import type { RoomMysteryModule } from "./_template";

export type OrderTribunalHotspotId = "judges-bench" | "evidence-locker";

export const ORDER_TRIBUNAL_MYSTERY: RoomMysteryModule<OrderTribunalHotspotId> = {
  roomId: "order-tribunal",
  responses: {
    "judges-bench": {
      look: {
        narration: {
          lucid:
            "The judges-bench is a long brass-and-oak slab elevated above the floor by three steps. Three high-backed chairs. The middle chair is taller than the other two by a hand's-width — the position the chief adjudicator sits in. The seat is worn. Three centuries of judgments have happened on that wood.",
          fragmented:
            "Three centuries. Three centuries. Three centuries. The wood remembers.",
          luminous:
            "The bench is pre-Ark. It was carried onto this ship from another vessel, by someone who wanted the institutional memory to come with them. Three centuries of judgments are absorbed into the wood. The Order's discipline was that no new bench was ever cut — the same wood had to bear every verdict, so that the verdicts could not be lighter than the wood.",
        },
        voId: "elara.order-tribunal.judges-bench.look",
        setsFlag: "tribunal_seen",
        logsClue: {
          id: "clue-tribunal-bench-pre-ark",
          title: "The tribunal bench is older than the Ark",
          body:
            "The Order Tribunal's judges-bench was carried onto the Ark from a previous vessel. Three centuries of accumulated judgments live in the wood. The Order's discipline forbade cutting a new bench — every verdict had to be heavier than the wood it was rendered on.",
          source: "order-tribunal",
          order: 0,
        },
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, the judges-bench surfaces the
        // currently-active Syndicate pairs ledger. Lore match: the
        // bench catalogues active dockets, and the three living
        // Syndicate pairs (Feet / Voices / Witnesses) are open
        // enforcement targets — listed in the same column as every
        // pending verdict the Order has ever pronounced.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e3",
          cluesFound: ["wraith.e3.living_pairs_ledger"],
        },
      },
      use: {
        narration: {
          lucid:
            "You press both palms to the bench's worn middle seat. The wood warms briefly under the touch — three centuries of judgments registering one more witness — and the bench's underside surfaces a sealed contract you had not noticed: red wax, demon's mark, signed by Mol'Vereth, Hierarchy junior partner. The contract names the Degen as a trustee, not a debtor. The bench has been carrying the contract underneath it since the day the verdict was rendered.",
          fragmented:
            "Mol'Vereth. Mol'Vereth. Junior partner. Junior partner. Trustee. Trustee. Not a debtor. Not a debtor.",
          luminous:
            "The judges-bench has been holding Mol'Vereth's contract underneath the chief adjudicator's seat since the Order rendered its verdict on the trusteeship. The contract is sealed in red wax with the demon's signature. It names the Degen as trustee, not debtor. The Order ratified the arrangement; Mol'Vereth's contract has been in force ever since. The bench is the wood that bears the verdict, and the verdict — for the Degen — is that he is not, by Hierarchy law, a free agent. He is managing someone else's stake.",
        },
        voId: "elara.order-tribunal.judges-bench.use",
        // Mystery Engine binding — when the Degen arc is the
        // active case, pressing the bench surfaces Mol'Vereth's
        // sealed contract from the trusteeship verdict. Lore
        // match: the bench is canonically pre-Ark and "every
        // verdict had to be heavier than the wood" — the Order
        // ratified the trusteeship at this bench, and the wood
        // has carried the contract underneath it ever since.
        mysteryBinding: {
          mysteryId: "mystery.the_degen",
          episodeId: "degen.e1",
          cluesFound: ["degen.e1.hierarchy_demon_signature"],
        },
      },
    },
    "evidence-locker": {
      look: {
        narration: {
          lucid:
            "The evidence-locker along the back wall is a wall of small brass-faced compartments. Most are empty. Three are sealed with red wax — open cases, awaiting verdict. The newest red seal is dated the year of Lyra's death. Whatever case it is, it has been open for two and a half centuries.",
          fragmented:
            "Three open. Three open. Three. Three open cases. Three.",
          luminous:
            "The newest sealed compartment is, by my best read, the case the Order opened against the Editor — though they did not, in their records, name him. Lyra brought charges through the tribunal in the last week of her command. The case was procedurally opened and never closed, because the prosecutor and the principal witness were both, within seventy-two hours, dead or departed. The case is still on the docket.",
        },
        voId: "elara.order-tribunal.evidence-locker.look",
        logsClue: {
          id: "clue-tribunal-open-case-against-editor",
          title: "Open tribunal case against the editor (procedural)",
          body:
            "The Order Tribunal's evidence-locker holds three red-wax-sealed open cases. The newest seal dates to the week of Lyra Vox's death — a case she brought against the Editor, though the records do not name him. The case was procedurally opened and never closed; the prosecutor (Lyra) died and the principal witness (Wraith Calder) departed within 72 hours.",
          source: "order-tribunal",
          order: 1,
        },
        // Mystery Engine binding — when Wraith Calder arc is the
        // active case, the evidence-locker surfaces the Order
        // Tribunal Confirmed-Kill list #C-7. Lore match is exact:
        // the evidence-locker holds the open case where Wraith was
        // the principal witness; the kill list is a sibling exhibit
        // in the same red-wax-sealed compartment.
        mysteryBinding: {
          mysteryId: "mystery.wraith_calder",
          episodeId: "wraith.e3",
          cluesFound: ["wraith.e3.tribunal_kill_list"],
        },
      },
    },
  },
};
