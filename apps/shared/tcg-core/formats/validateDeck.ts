/**
 * Deck validation.
 *
 * Pure function that checks a deck against a Format definition and a
 * CardRegistry. Returns a structured result with an array of issues
 * (empty = valid deck). Same code runs on client (deckbuilder red-X
 * indicator) and server (queue entry gate).
 *
 * Checks, in order:
 *   1. General exists in the registry and is cardType "general".
 *   2. Deck size matches format.deckSize exactly (general + cards).
 *   3. No card exceeds format.copyLimit copies.
 *   4. Faction lock: every non-neutral card must match the general's
 *      faction (if factionLock === "strict").
 *   5. Every card id exists in the registry.
 *   6. No card is on the format's banlist.
 *   7. Class restriction (Phase B8): cards with a characterClass
 *      may only appear in decks whose owner matches that class.
 *
 * Validation is fail-fast per check but collects ALL issues across
 * checks so the UI can display a complete error list.
 */
import type { CardRegistry } from "../types/GameState";
import type { Format } from "./standard";
import { setCodeOf } from "../sets/setCode";

export interface DeckInput {
  generalDefId: string;
  cardDefIds: readonly string[];
  /**
   * Player character class — required for class-card validation.
   * Optional for backward compatibility with existing call sites;
   * when omitted, class-restriction checks are skipped. The server
   * should always pass the player's actual class from campaignState
   * or characterSheets; the client deckbuilder should read it from
   * the current user row.
   */
  ownerClass?: "spy" | "oracle" | "assassin" | "engineer" | "soldier" | "neyon";
}

export interface ValidationIssue {
  code:
    | "invalid_general"
    | "wrong_deck_size"
    | "copy_limit_exceeded"
    | "faction_mismatch"
    | "unknown_card"
    | "banned_card"
    | "class_mismatch"
    | "set_not_legal";
  message: string;
  cardId?: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export function validateDeck(
  deck: DeckInput,
  format: Format,
  registry: CardRegistry
): ValidationResult {
  const issues: ValidationIssue[] = [];

  // 1. General check.
  const generalDef = registry.get(deck.generalDefId);
  if (!generalDef) {
    issues.push({
      code: "invalid_general",
      message: `general '${deck.generalDefId}' not found in registry`,
      cardId: deck.generalDefId,
    });
  } else if (generalDef.cardType !== "general") {
    issues.push({
      code: "invalid_general",
      message: `'${deck.generalDefId}' is a ${generalDef.cardType}, not a general`,
      cardId: deck.generalDefId,
    });
  }

  // 2. Deck size (general counts as 1).
  const totalCards = 1 + deck.cardDefIds.length;
  if (totalCards !== format.deckSize) {
    issues.push({
      code: "wrong_deck_size",
      message: `deck has ${totalCards} cards (expected exactly ${format.deckSize})`,
    });
  }

  // 3. Copy limit.
  const counts = new Map<string, number>();
  for (const id of deck.cardDefIds) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  for (const [id, count] of counts) {
    if (count > format.copyLimit) {
      issues.push({
        code: "copy_limit_exceeded",
        message: `'${id}' appears ${count} times (max ${format.copyLimit})`,
        cardId: id,
      });
    }
  }

  // 4. Faction lock.
  if (format.factionLock === "strict" && generalDef) {
    const generalFaction = generalDef.faction;
    for (const id of deck.cardDefIds) {
      const def = registry.get(id);
      if (!def) continue; // caught by check 5
      if (def.faction !== generalFaction && def.faction !== "neutral") {
        issues.push({
          code: "faction_mismatch",
          message: `'${id}' is ${def.faction}, but general is ${generalFaction} (strict faction lock)`,
          cardId: id,
        });
      }
    }
  }

  // 5. Unknown cards.
  for (const id of deck.cardDefIds) {
    if (!registry.has(id)) {
      issues.push({
        code: "unknown_card",
        message: `card '${id}' not found in registry`,
        cardId: id,
      });
    }
  }

  // 6. Banlist.
  const banned = new Set(format.banlist);
  if (banned.has(deck.generalDefId)) {
    issues.push({
      code: "banned_card",
      message: `general '${deck.generalDefId}' is banned in ${format.id}`,
      cardId: deck.generalDefId,
    });
  }
  for (const id of deck.cardDefIds) {
    if (banned.has(id)) {
      issues.push({
        code: "banned_card",
        message: `'${id}' is banned in ${format.id}`,
        cardId: id,
      });
    }
  }

  // 7. Class restriction (Phase B8). Cards tagged with a
  //    characterClass may only appear in decks whose owner has
  //    that class. When ownerClass is not provided, the check is
  //    skipped entirely for backward compatibility.
  if (deck.ownerClass !== undefined) {
    for (const id of deck.cardDefIds) {
      const def = registry.get(id);
      if (!def) continue; // caught by check 5
      if (def.characterClass && def.characterClass !== deck.ownerClass) {
        issues.push({
          code: "class_mismatch",
          message: `'${id}' requires the ${def.characterClass} class, but deck owner is ${deck.ownerClass}`,
          cardId: id,
        });
      }
    }
  }

  // 8. Allowed-set check. Each card's resolved `setCode` (loader-
  //    backfilled from id prefix in cards/loader.ts, or authored
  //    explicitly on the card def) must appear in the format's
  //    allowedSets list. An empty allowedSets list means "all sets
  //    allowed", matching the Format JSDoc.
  if (format.allowedSets.length > 0) {
    const allowed = new Set<string>(format.allowedSets);
    // The general also needs to be in an allowed set, so future
    // expansion-locked generals (e.g. S2 mythic generals) cannot
    // be used in S1-only formats.
    if (generalDef) {
      const gSet = setCodeOf(generalDef);
      if (!allowed.has(gSet)) {
        issues.push({
          code: "set_not_legal",
          message: `general '${generalDef.id}' is from set '${gSet}', not legal in ${format.id} (allowed: ${format.allowedSets.join(", ")})`,
          cardId: generalDef.id,
        });
      }
    }
    for (const id of deck.cardDefIds) {
      const def = registry.get(id);
      if (!def) continue; // caught by check 5
      const cSet = setCodeOf(def);
      if (!allowed.has(cSet)) {
        issues.push({
          code: "set_not_legal",
          message: `'${id}' is from set '${cSet}', not legal in ${format.id} (allowed: ${format.allowedSets.join(", ")})`,
          cardId: id,
        });
      }
    }
  }

  return { valid: issues.length === 0, issues };
}
