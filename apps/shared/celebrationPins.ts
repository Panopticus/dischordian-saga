/* ═══════════════════════════════════════════════════════
   CELEBRATION PINS — Collectible Park Souvenirs

   Every surviving day at Celebration earns your Apprentice
   a pin. They look charming. Most of them are.

   Some pins passively drip corruption. The rarest pins only
   appear after morally extreme choices (high bond + high
   corruption on the same day, or Distinction-like outcomes
   at parade events). The player collects them knowing some
   are cursed and not knowing which.

   Pins persist in game state (`state.pinInventory`) and can
   be displayed on the Apprentice's sheet. They are cosmetic
   by default — gameplay hooks are additive.

   See MechronisHouses / celebrationParkMap for the sibling
   "evocative surface, grim undercurrent" pattern.
   ═══════════════════════════════════════════════════════ */

export type PinRarity = "common" | "uncommon" | "rare" | "cursed";

export interface CelebrationPin {
  id: string;
  /** Display name as stamped on the pin */
  name: string;
  /** Which Mascoteer's kiosk issues it (or "parade") */
  sourceMascoteerId: string | "parade";
  /** Which Land gives it out (see celebrationParkMap) */
  landId: string | "parade";
  /** Flavor line stamped on the backing card */
  flavor: string;
  /** Which day of the trial the pin can first be awarded */
  earliestDay: number;
  rarity: PinRarity;
  /**
   * Passive effect description. UI/content note: gameplay hooks are
   * additive — the trial and battle systems do NOT need to read this
   * to function. Treat as flavor + future integration.
   */
  passive?: string;
  /** If true, corruption drips upward each night while held. */
  cursed?: boolean;
  /** Emoji glyph used when no art is available (fallback) */
  glyph: string;
}

export const CELEBRATION_PINS: CelebrationPin[] = [
  // ── Chorus Plaza (the_conductor) ──
  {
    id: "pin_first_note",
    name: "My First Note",
    sourceMascoteerId: "the_conductor",
    landId: "chorus_plaza",
    flavor: "Conni gave it to you with both hands. It was warm.",
    earliestDay: 1,
    rarity: "common",
    glyph: "♪",
  },
  {
    id: "pin_choir_captain",
    name: "Choir Captain",
    sourceMascoteerId: "the_conductor",
    landId: "chorus_plaza",
    flavor: "Congratulations! You led the song. Someone has to.",
    earliestDay: 7,
    rarity: "uncommon",
    passive: "Your Apprentice's lyrics are quoted in the Parade programme.",
    glyph: "♫",
  },
  {
    id: "pin_silent_bar",
    name: "Pin of the Silent Bar",
    sourceMascoteerId: "the_conductor",
    landId: "chorus_plaza",
    flavor: "For the singer who went quiet when the class was told to.",
    earliestDay: 14,
    rarity: "rare",
    cursed: true,
    passive: "You begin dreaming in unison with three strangers you have not met.",
    glyph: "𝄽",
  },

  // ── Watcher's Promenade (mr_unblink) ──
  {
    id: "pin_first_portrait",
    name: "My First Portrait",
    sourceMascoteerId: "mr_unblink",
    landId: "watchers_promenade",
    flavor: "The Studio developed it while you blinked.",
    earliestDay: 2,
    rarity: "common",
    glyph: "◉",
  },
  {
    id: "pin_honour_guest",
    name: "Honour Guest",
    sourceMascoteerId: "mr_unblink",
    landId: "watchers_promenade",
    flavor: "Mr. Unblink says you're his favourite. He says that every day.",
    earliestDay: 10,
    rarity: "uncommon",
    passive: "Friendly cast members address your Apprentice by name on sight.",
    glyph: "◎",
  },
  {
    id: "pin_unblinking",
    name: "Unblinking",
    sourceMascoteerId: "mr_unblink",
    landId: "watchers_promenade",
    flavor: "Issued to a guest who held eye contact until the Studio closed.",
    earliestDay: 18,
    rarity: "rare",
    cursed: true,
    passive: "Your Apprentice does not blink in photographs, ever again.",
    glyph: "⦿",
  },

  // ── Prince's Domain (the_prince) ──
  {
    id: "pin_proclamation",
    name: "Royal Proclamation Holder",
    sourceMascoteerId: "the_prince",
    landId: "princes_domain",
    flavor: "Keep your decree on your person at all times.",
    earliestDay: 3,
    rarity: "common",
    glyph: "♛",
  },
  {
    id: "pin_parade_vanguard",
    name: "Parade Vanguard",
    sourceMascoteerId: "parade",
    landId: "parade",
    flavor: "Awarded to the first guest to match step with the Prince.",
    earliestDay: 7,
    rarity: "uncommon",
    passive: "Your Apprentice's march is one-eighth beat ahead of any cadence.",
    glyph: "⚔",
  },
  {
    id: "pin_sharpened_smile",
    name: "Sharpened Smile",
    sourceMascoteerId: "the_prince",
    landId: "princes_domain",
    flavor: "For banquet attendance above and beyond.",
    earliestDay: 21,
    rarity: "cursed",
    cursed: true,
    passive: "Your Apprentice's smile widens by one-eighth of an inch per day held.",
    glyph: "♤",
  },

  // ── Seeker's Meadow (the_seeker_child) ──
  {
    id: "pin_puzzle_solved",
    name: "Puzzle Solved!",
    sourceMascoteerId: "the_seeker_child",
    landId: "seeker_meadow",
    flavor: "Little Corey pinned it on you himself. He was very proud.",
    earliestDay: 4,
    rarity: "common",
    glyph: "✦",
  },
  {
    id: "pin_hide_and_seek_champion",
    name: "Hide & Seek Champion",
    sourceMascoteerId: "the_seeker_child",
    landId: "seeker_meadow",
    flavor: "You were hard to find. Little Corey tried for an hour.",
    earliestDay: 12,
    rarity: "uncommon",
    passive: "Your Apprentice is not seen on security feeds of the Meadow.",
    glyph: "❋",
  },
  {
    id: "pin_fountain_tally",
    name: "Fountain Tally Marker",
    sourceMascoteerId: "the_seeker_child",
    landId: "seeker_meadow",
    flavor: "For a guest whose count at the Lost-Child Fountain does not match the records.",
    earliestDay: 24,
    rarity: "rare",
    cursed: true,
    passive:
      "One fewer tally mark appears on the fountain each morning. The records do not update.",
    glyph: "✶",
  },

  // ── Parade Days (awarded during scheduled events, not Mascoteer-specific) ──
  {
    id: "pin_first_parade",
    name: "I Marched In The Parade!",
    sourceMascoteerId: "parade",
    landId: "parade",
    flavor: "Wear it everywhere. The parade never technically ends.",
    earliestDay: 7,
    rarity: "uncommon",
    glyph: "✨",
  },
  {
    id: "pin_closing_fireworks",
    name: "Closing Night Fireworks",
    sourceMascoteerId: "parade",
    landId: "parade",
    flavor: "For surviving through the final curtain.",
    earliestDay: 28,
    rarity: "rare",
    passive: "Your Apprentice's silhouette is briefly lit by unseen fireworks at twilight.",
    glyph: "✺",
  },
];

/**
 * Deterministic pin awarded for surviving a given day. Used by the UI
 * after a successful (non-fatal) decision to stamp a memento.
 *
 * Rule of thumb:
 *  - Day is a Parade Day (7/14/21/28) → parade pin
 *  - Otherwise → pick from current Mascoteer's kiosk pool
 *    filtered by earliestDay ≤ day
 */
export function getPinForDay(day: number, mascoteerId: string): CelebrationPin | undefined {
  const paradeDays = new Set([7, 14, 21, 28]);
  const paradePins = CELEBRATION_PINS.filter(
    p => p.sourceMascoteerId === "parade" && p.earliestDay <= day,
  );
  if (paradeDays.has(day) && paradePins.length > 0) {
    return paradePins[Math.abs(day) % paradePins.length];
  }
  const kiosk = CELEBRATION_PINS.filter(
    p => p.sourceMascoteerId === mascoteerId && p.earliestDay <= day,
  );
  if (kiosk.length === 0) return undefined;
  return kiosk[Math.abs(day) % kiosk.length];
}

export function getPin(id: string): CelebrationPin | undefined {
  return CELEBRATION_PINS.find(p => p.id === id);
}

/**
 * Sum of cursed-pin-generated passive corruption held in inventory.
 * Per-day tick is applied by the caller, not this function.
 */
export function countCursedPins(pinIds: string[]): number {
  return pinIds.filter(id => {
    const pin = getPin(id);
    return pin?.cursed === true;
  }).length;
}
