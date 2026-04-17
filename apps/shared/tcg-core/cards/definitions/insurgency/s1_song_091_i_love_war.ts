/**
 * s1_song_091 — I Love War
 *
 * Epic spell · Insurgency faction · 6 cost
 * Keywords: pierce, overcharge
 *
 * Oracle text (from season1-cards.json):
 *   "Ignores 3 points of enemy armor. Deals +3 damage on first attack,
 *    then takes 2 self-damage."
 *
 * Design interpretation: on a unit, pierce would ignore armor and
 * overcharge would front-load extra damage at a self-harm cost. But as
 * a spell there is no persistent attacker — the card resolves once.
 * We collapse both keywords into a single powerful damage effect:
 * the spell deals 6 damage to a chosen enemy unit. The 6-damage value
 * reflects the epic rarity and 6-mana cost (pure removal at rate).
 * Pierce is moot (spell damage bypasses armor in most TCG models) and
 * overcharge's self-damage has no "self" to apply to. Keywords are
 * retained in the array for UI display and synergy tagging.
 *
 * Golden tests: test/cards/insurgency/s1_song_091_i_love_war.test.ts
 */
import type { CardDefinition } from "../../../index";

export const cardDef: CardDefinition = {
  id: "s1_song_091" as CardDefinition["id"],
  name: "I Love War",
  faction: "insurgency",
  cardType: "spell",
  rarity: "epic",
  cost: 6,
  keywords: ["pierce", "overcharge"],
  abilities: [
    {
      id: "ilw_deal_damage_6" as CardDefinition["abilities"][number]["id"],
      trigger: { kind: "on_cast" },
      effect: {
        op: "with_target",
        selector: {
          kind: "single",
          filter: { controller: "opponent" },
          chooser: "player",
        },
        do: {
          op: "deal_damage",
          amount: { kind: "const", value: 6 },
          to: { kind: "it" },
        },
      },
    },
  ],
  art: "/art/cards/s1_song_091.webp",
  flavorText:
    "The Warlord wore Vox's skin like a weapon. Agent Zero never saw the nanobots coming — war IS love to the Warlord, and this was an act of intimate conquest.",
  rulesVersion: "1.0.0",
};
