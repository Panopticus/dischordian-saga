/**
 * s1_pack_cosm_title_echo — Echo of the Fall
 *
 * Common spell · Neutral faction · 1 cost
 * Keywords: none
 *
 * Oracle text:
 *   "Draw 1.
 *    The Fall echoes still. Listen closely and you can hear it."
 *
 * Lore: The Fall — the cataclysmic event that shattered the old
 * order — reverberates through every corner of the Saga. This
 * spell is a whisper of that echo, a tiny fragment of the knowledge
 * that was scattered when everything came apart. A simple cantrip
 * that keeps the cycle of information flowing.
 *
 * Cosmetic unlock: Collecting this card unlocks the "Echo of the
 * Fall" title.
 *
 * Balance: 1 cost spell. Draw 1 at 1 mana is a standard cantrip.
 * On budget.
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_pack_cosm_title_echo" as CardDefinition["id"],
  name: "Echo of the Fall",
  faction: "neutral",
  cardType: "spell",
  rarity: "common",
  cost: 1,
  keywords: [],
  abilities: [
    {
      id: "eotf_draw" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "draw",
        amount: { kind: "const", value: 1 },
        who: "self",
      },
    },
  ],
  art: "/art/cards/s1_pack_cosm_title_echo.webp",
  flavorText:
    "The Fall echoes still. Listen closely and you can hear it.",
  rulesVersion: "1.0.0",
  trial_categories: ["narrative"] as const,
  verdict_delta: 1,
};
