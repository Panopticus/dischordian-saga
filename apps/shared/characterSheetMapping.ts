/* ═══════════════════════════════════════════════════════
   CHARACTER SHEET TAXONOMY — best-fit mapping (Option B)

   The May 2026 producer drop ships icons for a taxonomy that
   doesn't 1:1-match the codebase's `state.characterChoices`
   enums (the producer drew the more-evocative narrative set;
   the codebase stores the engine's mechanical set). This
   module is the canonical bridge.

   Decisions:
   - Species
       demagi   → hybrid       (both: between-species)
       quarchon → void_touched (both: observer / void-affiliated)
       neyon    → neyon        (direct match)
       null     → null         (no choice yet — caller renders no icon)
   - Class
       engineer → engineer (direct match)
       assassin → assassin (direct match)
       oracle   → mystic   (intuition / spirit archetype)
       soldier  → warrior  (combat archetype)
       spy      → diplomat (covert / persuasive ops; the producer's
                            "diplomat" is wider than its plain reading
                            — it covers all soft-influence kit)
       null     → null
   - Faction background (from factionWar.playerFaction)
       "empire"     → authority  (lawful imperial frame)
       "insurgency" → insurgency (canonical match)
       null         → watcher    (the witness — the default narrative
                                  role of the unaligned protagonist)

   Faction backgrounds for dreamer / hierarchy / mechronis /
   terminus stay reachable via `characterSheetBackgroundUrl()`
   in `apps/shared/aaaArtArchive/characterSheets.ts` so other
   surfaces (act intros, witnessing transitions, etc.) can
   pick them up without re-routing through this mapping.

   Attribute icons (agility/charisma/intellect/perception/
   resilience/strength) intentionally remain unmapped — the
   codebase's `attrAttack/attrDefense/attrVitality` (3-axis)
   doesn't fit the 6-axis archive cleanly enough to wire
   without misleading the player. Tracked in the production
   bible §8 as deferred.
   ═══════════════════════════════════════════════════════ */

import type {
  CharacterSheetSpecies,
  CharacterSheetClass,
  CharacterSheetBackground,
} from "./aaaArtArchive";

/** Player-selectable species — mirrors GameContext characterChoices.species. */
export type PlayerSpecies = "demagi" | "quarchon" | "neyon" | null;
/** Player-selectable class — mirrors GameContext characterChoices.characterClass. */
export type PlayerCharacterClass =
  | "engineer"
  | "oracle"
  | "assassin"
  | "soldier"
  | "spy"
  | null;
/** Player faction-war affiliation — mirrors GameContext factionWar.playerFaction. */
export type PlayerFactionWarSide = "empire" | "insurgency" | null;

export function speciesToArchive(s: PlayerSpecies): CharacterSheetSpecies | null {
  if (s === null) return null;
  switch (s) {
    case "demagi":
      return "hybrid";
    case "quarchon":
      return "void_touched";
    case "neyon":
      return "neyon";
  }
}

export function classToArchive(c: PlayerCharacterClass): CharacterSheetClass | null {
  if (c === null) return null;
  switch (c) {
    case "engineer":
      return "engineer";
    case "assassin":
      return "assassin";
    case "oracle":
      return "mystic";
    case "soldier":
      return "warrior";
    case "spy":
      return "diplomat";
  }
}

/** Always returns a background id so the character sheet never renders
 *  un-faction'd. `watcher` is the narrative default — the protagonist
 *  is the Witness until they pick a faction-war side. */
export function factionToArchive(
  playerFaction: PlayerFactionWarSide,
): CharacterSheetBackground {
  switch (playerFaction) {
    case "empire":
      return "authority";
    case "insurgency":
      return "insurgency";
    case null:
      return "watcher";
  }
}
