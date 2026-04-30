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
      },
    },
  },
};
