/**
 * s1_char_121 — Epoch Watcher
 *
 * Epic unit · Antiquarian faction · 6 cost · 4/8
 * Keywords: none
 *
 * Oracle text:
 *   "Endures across ages. At the start of your turn, heal self
 *    for 2 — time restores what battle takes."
 *
 * Lore: The Epoch Watcher has existed across multiple iterations of the
 * Dischordian Cycle, its body restored by the temporal currents the
 * Antiquarians harness. Where other units degrade, the Epoch Watcher
 * regenerates — its wounds close as time itself folds around it,
 * borrowing health from futures where it was never hurt. The Witness
 * records that the Epoch Watcher has been present at every major
 * turning point of the saga, always watching, always enduring. It is
 * the Antiquarian faction's philosophy made manifest: time heals all,
 * and the patient outlast the powerful.
 *
 * Mechanical model:
 *  - On turn start (owner: "self"), heal self for 2. A durable body
 *    (4/8) that regenerates, rewarding the Antiquarian's patient
 *    playstyle.
 *
 * Golden tests: test/cards/antiquarian/s1_char_121_epoch_watcher.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_char_121" as CardDefinition["id"],
  name: "Epoch Watcher",
  faction: "antiquarian",
  cardType: "unit",
  rarity: "epic",
  cost: 6,
  baseStats: { power: 4, health: 8 },
  keywords: [],
  abilities: [
    // --- Temporal Restoration: heal 2 on turn start ---
    {
      id: "ew_temporal_restore" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_turn_start", owner: "self" },
      effect: {
        op: "heal",
        amount: { kind: "const", value: 2 },
        to: { kind: "self" },
      },
    },
  ],
  art: "/art/cards/s1_char_121.webp",
  flavorText:
    "It has seen empires rise and fall a thousand times. Each wound is just another memory it has already forgotten.",
  rulesVersion: "1.0.0",
};
