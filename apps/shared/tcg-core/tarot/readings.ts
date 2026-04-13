/**
 * Oracle Deck — deterministic draw engine (Phase E3).
 *
 * The Engineer's probability coil. Every reading is a pure
 * function of (userId, spreadKind, seed) — so the same player on
 * the same day with the same owned-card subset always gets the
 * same draw. This gives the Oracle Deck two properties Crowley
 * would have loved:
 *
 *   1. The deck is NOT gambling. The Engineer felt very strongly
 *      about this. "A reading that changes when you hit refresh
 *      is a slot machine. A reading that does not change is a
 *      statement the world is making to you at a specific moment."
 *
 *   2. The deck is auditable. The Oracle wanted every draw to be
 *      reproducible from the seed so she could look at a month
 *      of readings and see whether her probability distribution
 *      was staying honest. The seed is public; the interpretation
 *      is not.
 *
 * Algorithm:
 *
 *   1. Derive a 32-bit seed from (userId, spreadKind, seedKey)
 *      using FNV-1a. seedKey is the day number for daily /
 *      weekly readings and a match id for pre-match readings.
 *
 *   2. Run a xoshiro-style PRNG from that seed. Simple, fast,
 *      good-enough for reading divination but not for crypto
 *      (which matters because the Oracle deck is NOT security).
 *
 *   3. Filter the deck to the player's owned cards. If they
 *      own fewer than the spread length, the draw engine falls
 *      back to "not enough cards" and returns a single-position
 *      reading with The Prisoner (card 0, always unlocked).
 *
 *   4. Fisher-Yates shuffle the owned subset, take the first
 *      N cards, and assign each to a position.
 *
 *   5. Flip a second PRNG stream to decide orientation
 *      (upright / reversed) for each drawn card, biased 70/30
 *      toward upright. Reversed cards apply a smaller buff by
 *      dividing numeric fields by 2.
 *
 * This file is pure — no DB access, no tRPC, no side effects.
 * The router (E5) threads the user's collection + the seed into
 * castReading(...) and consumes the returned OracleReading.
 */

import type {
  OracleBuff,
  OracleCard,
} from "./oracleDeckTypes";
import type {
  OracleDrawnPosition,
  OracleSpreadKind,
  OracleSpreadShape,
} from "./spreads";
import { getOracleSpread } from "./spreads";
import { ORACLE_DECK, getOracleCardBySlug } from "./oracleDeck";

/* ═══════════════════════════════════════════════════════
   HASH + PRNG
   ═══════════════════════════════════════════════════════ */

/** FNV-1a 32-bit hash of an ASCII string. Fast, well-distributed
 *  enough for a tarot deck, and famously deterministic across
 *  every language the Engineer might port this to. */
export function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    // Multiply by FNV prime, force to 32-bit
    hash = Math.imul(hash, 0x01000193);
  }
  // Ensure unsigned
  return hash >>> 0;
}

/** Derive the seed for a specific reading. The inputs are public —
 *  the Oracle can replay any reading she has a record of. */
export function deriveReadingSeed(
  userId: number,
  spreadKind: OracleSpreadKind | string,
  seedKey: string | number,
): number {
  return fnv1a32(`oracle:${userId}:${spreadKind}:${seedKey}`);
}

/** Simple Mulberry32 PRNG — one 32-bit seed, one next() per call,
 *  deterministic. Good enough for a tarot deck, not for crypto. */
export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return function next(): number {
    t = (t + 0x6d2b79f5) >>> 0;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/* ═══════════════════════════════════════════════════════
   READING CAST
   ═══════════════════════════════════════════════════════ */

/** A complete resolved reading — the spread shape plus the cards
 *  that landed in each position. The router returns this to the
 *  client for rendering. */
export interface OracleReading {
  /** Echo of the spread shape for the client to iterate. */
  spread: OracleSpreadShape;
  /** Positional draws in spread order. */
  draws: readonly OracleDrawnPosition[];
  /** The seed used — echoed back so the Oracle can audit. */
  seed: number;
  /** When the reading is valid from. Daily reads apply for the
   *  24h window starting at `appliesAt`; weekly reads apply for
   *  the 7d window. ISO timestamp string. */
  appliesAt: string;
  /** True iff the player's collection was smaller than the
   *  spread length and the draw fell back to The Prisoner. */
  fallback: boolean;
}

/** Cast a reading. Pure function. */
export function castReading(params: {
  userId: number;
  spreadKind: OracleSpreadKind;
  seedKey: string | number;
  /** Slugs the player currently owns. The Prisoner (slug
   *  "prisoner", id 0) is assumed to always be owned since it
   *  is the unlock reward for Chapter 1. */
  ownedSlugs: readonly string[];
  /** ISO timestamp this reading applies from. */
  appliesAt: string;
}): OracleReading {
  const spread = getOracleSpread(params.spreadKind);
  if (!spread) {
    throw new Error(`Unknown spread kind: ${params.spreadKind}`);
  }

  const seed = deriveReadingSeed(
    params.userId,
    params.spreadKind,
    params.seedKey,
  );
  const rng = mulberry32(seed);

  // Ensure The Prisoner is always in the pool — it's the first
  // unlockable card and the deck's narrative anchor.
  const ownedSet = new Set(params.ownedSlugs);
  ownedSet.add("prisoner");
  const ownedCards: OracleCard[] = [];
  for (const card of ORACLE_DECK) {
    if (ownedSet.has(card.slug)) ownedCards.push(card);
  }

  // If the player owns fewer cards than the spread length, fall
  // back to a 1-position reading with The Prisoner on repeat.
  // This is a graceful degradation, not a punishment — it is
  // literally what happens when you own one card.
  const fallback = ownedCards.length < spread.positions.length;

  if (fallback) {
    const prisoner = getOracleCardBySlug("prisoner");
    if (!prisoner) {
      throw new Error(
        "The Prisoner card is missing from ORACLE_DECK — this invariant should not be violable.",
      );
    }
    return {
      spread,
      draws: [
        {
          position: spread.positions[0],
          cardSlug: prisoner.slug,
          orientation: "upright",
          buff: prisoner.buff,
        },
      ],
      seed,
      appliesAt: params.appliesAt,
      fallback: true,
    };
  }

  // Fisher-Yates shuffle the owned cards using the PRNG.
  const pool = [...ownedCards];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Take the first N and assign them to positions.
  const draws: OracleDrawnPosition[] = [];
  for (let i = 0; i < spread.positions.length; i++) {
    const card = pool[i];
    // 70/30 biased upright/reversed orientation using a second
    // PRNG stream.
    const orientation: "upright" | "reversed" =
      rng() < 0.7 ? "upright" : "reversed";
    const buff =
      orientation === "upright"
        ? card.buff
        : halveBuff(card.buff);
    draws.push({
      position: spread.positions[i],
      cardSlug: card.slug,
      orientation,
      buff,
    });
  }

  return {
    spread,
    draws,
    seed,
    appliesAt: params.appliesAt,
    fallback: false,
  };
}

/** Halve a buff's numeric magnitudes for reversed orientation.
 *  Non-numeric buffs (reroll_one_card, fnord_secret) pass through
 *  unchanged — they represent categorical effects and halving
 *  them makes no sense. */
function halveBuff(buff: OracleBuff): OracleBuff {
  switch (buff.effect.kind) {
    case "extra_mana":
      return {
        label: `${buff.label} (reversed)`,
        effect: { kind: "extra_mana", amount: Math.max(0, Math.floor(buff.effect.amount / 2)) },
      };
    case "extra_cards":
      return {
        label: `${buff.label} (reversed)`,
        effect: { kind: "extra_cards", amount: Math.max(0, Math.floor(buff.effect.amount / 2)) },
      };
    case "general_hp":
      return {
        label: `${buff.label} (reversed)`,
        effect: { kind: "general_hp", amount: Math.max(0, Math.floor(buff.effect.amount / 2)) },
      };
    case "first_unit_buff":
      return {
        label: `${buff.label} (reversed)`,
        effect: {
          kind: "first_unit_buff",
          power: Math.max(0, Math.floor(buff.effect.power / 2)),
          health: Math.max(0, Math.floor(buff.effect.health / 2)),
        },
      };
    case "mulligan_extra":
      return {
        label: `${buff.label} (reversed)`,
        effect: { kind: "mulligan_extra", amount: Math.max(0, Math.floor(buff.effect.amount / 2)) },
      };
    case "dream_token_bonus":
      return {
        label: `${buff.label} (reversed)`,
        effect: { kind: "dream_token_bonus", percent: Math.max(0, Math.floor(buff.effect.percent / 2)) },
      };
    case "reroll_one_card":
    case "fnord_secret":
      return buff;
  }
}
