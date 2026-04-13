/**
 * s1_spell_121 — Epoch Rewind
 *
 * Common spell · Antiquarian faction · 2 cost
 *
 * Oracle text:
 *   "Heal a friendly unit to full health. The Antiquarian reaches into
 *    the past and retrieves a version that was never wounded."
 *
 * Full heal on a single friendly unit. Temporal manipulation as medicine:
 * the Antiquarian doesn't repair the damage, but rather replaces the
 * wounded present with an unwounded past. The unit's injuries belong
 * to a timeline that no longer exists.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_spell_121" as CardDefinition["id"],
  name: "Epoch Rewind",
  faction: "antiquarian",
  cardType: "spell",
  rarity: "common",
  cost: 2,
  keywords: [],
  abilities: [
    {
      id: "er_full_heal" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "self" },
          chooser: "player",
        },
        do: {
          op: "heal",
          amount: { kind: "missing_health", of: { kind: "it" } },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_spell_121.webp",
  flavorText:
    "The wound was real. The scar was earned. But the Antiquarian remembers a version of you that never bled, and that version is more useful now.",
  rulesVersion: "1.0.0",
};
