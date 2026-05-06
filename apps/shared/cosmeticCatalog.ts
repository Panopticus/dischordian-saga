/* ═══════════════════════════════════════════════════════
   COSMETIC CATALOG — 3-tier monetization

   Single source of truth for cosmetic SKUs. Previously cosmetics
   were scattered across `economySinks.ts` (one-time Dream items)
   and `endgameSinks.ts` (Prestige Auras, Card Gilding). Those
   modules stay as-is for backwards compatibility; this module is
   the structured catalog new cosmetics flow into and the place
   monetization tooling reads from.

   Three tiers, each with a distinct economic role:

     T1 EARNABLE — Dream-only, ≤ 1500 Dream.
                   Visible to the owner mostly. The "you played
                   the game" reward layer.

     T2 HYBRID  — Dream OR Void Crystals. 1500-5000 Dream
                  (or 100-500 VC). Visible during matches.
                  The grind-or-skip layer.

     T3 PREMIUM — Void Crystals only. 500-3000 VC.
                  Visible everywhere — high social signaling.
                  The "back the game" / whale layer.

   Pay-to-enhance invariants enforced by `cosmeticCatalog.test.ts`:
     - Every cosmetic is purely cosmetic (no power, no card,
       no resource grant). Sold-power = pay-to-win.
     - Every T2 has both a Dream price and a VC price, so F2P
       paths exist.
     - T3 visibility is always "global" (justifies the premium).
   ═══════════════════════════════════════════════════════ */

export type CosmeticTier = "earnable" | "hybrid" | "premium";

/**
 * Where the cosmetic shows up. Drives perceived value: things
 * everyone sees command higher prices than things only the
 * owner sees in their collection screen.
 */
export type CosmeticVisibility =
  | "private"   // only the owner sees (collection screen, profile)
  | "match"     // opponent sees during a Dischordia match
  | "global";   // visible everywhere (lobbies, leaderboards, chat)

export type CosmeticSlot =
  | "card_back"
  | "card_border"
  | "avatar"
  | "avatar_frame"
  | "profile_banner"
  | "board_theme"
  | "title"
  | "aura"
  | "voice_pack"
  | "music_pack"
  | "emote";

export interface Cosmetic {
  id: string;
  name: string;
  description: string;
  tier: CosmeticTier;
  slot: CosmeticSlot;
  visibility: CosmeticVisibility;
  /** Cost in Dream Tokens. 0 = not buyable with Dream (T3 only). */
  priceDream: number;
  /** Cost in Void Crystals. 0 = not buyable with VC (T1 only). */
  priceVoidCrystals: number;
  /** True if this cosmetic can be bought multiple times (e.g. avatar collection). */
  repeatable: boolean;
  /** Min player level required (0 = no gate). */
  minLevel: number;
  /** Restricted to a specific season / event / entitlement, if any. */
  exclusivity?: "season_2" | "founders" | "authors_edition" | "limited_event";
}

/* ─── T1: Earnable (Dream-only) ─── */

const T1_COSMETICS: Cosmetic[] = [
  {
    id: "card_back_basic_blue",
    name: "Card Back: Cobalt",
    description: "A simple blue card back for your decks.",
    tier: "earnable",
    slot: "card_back",
    visibility: "private",
    priceDream: 200,
    priceVoidCrystals: 0,
    repeatable: false,
    minLevel: 1,
  },
  {
    id: "card_back_basic_crimson",
    name: "Card Back: Crimson",
    description: "A simple red card back for your decks.",
    tier: "earnable",
    slot: "card_back",
    visibility: "private",
    priceDream: 200,
    priceVoidCrystals: 0,
    repeatable: false,
    minLevel: 1,
  },
  {
    id: "avatar_static_dreamer",
    name: "Avatar: Dreamer",
    description: "A static portrait of a Dreamer in meditation.",
    tier: "earnable",
    slot: "avatar",
    visibility: "global",
    priceDream: 150,
    priceVoidCrystals: 0,
    repeatable: false,
    minLevel: 1,
  },
  {
    id: "avatar_frame_iron",
    name: "Avatar Frame: Iron",
    description: "A simple iron frame around your avatar.",
    tier: "earnable",
    slot: "avatar_frame",
    visibility: "global",
    priceDream: 500,
    priceVoidCrystals: 0,
    repeatable: false,
    minLevel: 5,
  },
  {
    id: "profile_banner_dischordia",
    name: "Banner: Dischordia",
    description: "A static banner with the Dischordia sigil.",
    tier: "earnable",
    slot: "profile_banner",
    visibility: "global",
    priceDream: 750,
    priceVoidCrystals: 0,
    repeatable: false,
    minLevel: 5,
  },
  {
    id: "title_apprentice",
    name: "Title: Apprentice",
    description: "Display 'Apprentice' next to your name.",
    tier: "earnable",
    slot: "title",
    visibility: "global",
    priceDream: 1000,
    priceVoidCrystals: 0,
    repeatable: false,
    minLevel: 10,
  },
  {
    id: "emote_thumbs_up",
    name: "Emote: Thumbs Up",
    description: "A friendly thumbs-up emote during matches.",
    tier: "earnable",
    slot: "emote",
    visibility: "match",
    priceDream: 300,
    priceVoidCrystals: 0,
    repeatable: false,
    minLevel: 3,
  },
  {
    id: "emote_well_played",
    name: "Emote: Well Played",
    description: "A 'well played' emote.",
    tier: "earnable",
    slot: "emote",
    visibility: "match",
    priceDream: 300,
    priceVoidCrystals: 0,
    repeatable: false,
    minLevel: 3,
  },
];

/* ─── T2: Hybrid (Dream OR Void Crystals) ─── */

const T2_COSMETICS: Cosmetic[] = [
  {
    id: "card_border_animated_amber",
    name: "Card Border: Amber Pulse",
    description: "Pulsing amber border around your cards in matches.",
    tier: "hybrid",
    slot: "card_border",
    visibility: "match",
    priceDream: 2000,
    priceVoidCrystals: 200,
    repeatable: false,
    minLevel: 10,
  },
  {
    id: "card_border_animated_void",
    name: "Card Border: Void Pulse",
    description: "Pulsing void-purple border around your cards.",
    tier: "hybrid",
    slot: "card_border",
    visibility: "match",
    priceDream: 2000,
    priceVoidCrystals: 200,
    repeatable: false,
    minLevel: 10,
  },
  {
    id: "board_theme_obsidian",
    name: "Board Theme: Obsidian",
    description: "Replace the default board with a dark obsidian arena.",
    tier: "hybrid",
    slot: "board_theme",
    visibility: "match",
    priceDream: 3500,
    priceVoidCrystals: 350,
    repeatable: false,
    minLevel: 15,
  },
  {
    id: "board_theme_nebula",
    name: "Board Theme: Nebula",
    description: "A nebula-painted arena board with parallax stars.",
    tier: "hybrid",
    slot: "board_theme",
    visibility: "match",
    priceDream: 3500,
    priceVoidCrystals: 350,
    repeatable: false,
    minLevel: 15,
  },
  {
    id: "avatar_frame_gold",
    name: "Avatar Frame: Gold Filigree",
    description: "An ornate gold frame with subtle motion.",
    tier: "hybrid",
    slot: "avatar_frame",
    visibility: "global",
    priceDream: 2500,
    priceVoidCrystals: 250,
    repeatable: false,
    minLevel: 15,
  },
  {
    id: "title_archon_apprentice",
    name: "Title: Archon's Apprentice",
    description: "A prestige title visible in lobbies and leaderboards.",
    tier: "hybrid",
    slot: "title",
    visibility: "global",
    priceDream: 4000,
    priceVoidCrystals: 400,
    repeatable: false,
    minLevel: 20,
  },
];

/* ─── T3: Premium (Void Crystals only) ─── */

const T3_COSMETICS: Cosmetic[] = [
  {
    id: "aura_void_signature",
    name: "Aura: Void Signature",
    description:
      "A signature void-rift aura that follows your avatar in lobbies and " +
      "matches. Visible to every player. The premium prestige cosmetic.",
    tier: "premium",
    slot: "aura",
    visibility: "global",
    priceDream: 0,
    priceVoidCrystals: 800,
    repeatable: false,
    minLevel: 20,
  },
  {
    id: "aura_archon_flame_premium",
    name: "Aura: Archon Flame (Premium)",
    description:
      "An animated archon-flame aura. The visual signature of true patrons.",
    tier: "premium",
    slot: "aura",
    visibility: "global",
    priceDream: 0,
    priceVoidCrystals: 1500,
    repeatable: false,
    minLevel: 25,
  },
  {
    id: "card_animation_signature",
    name: "Card Animation: Signature Pull",
    description:
      "Cards from your deck pull onto the board with a signature animation " +
      "your opponents can see. One of two top-tier match cosmetics.",
    tier: "premium",
    slot: "card_border",
    visibility: "match",
    priceDream: 0,
    priceVoidCrystals: 1200,
    repeatable: false,
    minLevel: 20,
  },
  {
    id: "voice_pack_companion_lyra",
    name: "Voice Pack: Lyra Vox",
    description:
      "Replaces match callouts with voice lines from Lyra Vox. A premium " +
      "voice pack with full studio-recorded lines.",
    tier: "premium",
    slot: "voice_pack",
    visibility: "match",
    priceDream: 0,
    priceVoidCrystals: 1000,
    repeatable: false,
    minLevel: 15,
  },
  {
    id: "voice_pack_companion_kael",
    name: "Voice Pack: Kael",
    description: "Premium voice pack featuring Kael during matches.",
    tier: "premium",
    slot: "voice_pack",
    visibility: "match",
    priceDream: 0,
    priceVoidCrystals: 1000,
    repeatable: false,
    minLevel: 15,
  },
  {
    id: "music_pack_battle_orchestral",
    name: "Music Pack: Orchestral Combat",
    description:
      "Replaces match music with a fully orchestrated combat suite, " +
      "scored exclusively for premium patrons.",
    tier: "premium",
    slot: "music_pack",
    visibility: "private",
    priceDream: 0,
    priceVoidCrystals: 600,
    repeatable: false,
    minLevel: 10,
  },
  {
    id: "title_founder",
    name: "Title: Founder",
    description:
      "Reserved for Founding Author patrons. Bundled with the Founder's " +
      "Edition; not sold standalone.",
    tier: "premium",
    slot: "title",
    visibility: "global",
    priceDream: 0,
    priceVoidCrystals: 0, // bundle-only — exclusivity gates entitlement
    repeatable: false,
    minLevel: 1,
    exclusivity: "founders",
  },
  {
    id: "aura_authors_edition_s2",
    name: "Aura: Author's Edition S2",
    description:
      "A signature Season 2 aura granted with the Author's Edition. " +
      "Bundle-only — not buyable with Void Crystals.",
    tier: "premium",
    slot: "aura",
    visibility: "global",
    priceDream: 0,
    priceVoidCrystals: 0,
    repeatable: false,
    minLevel: 1,
    exclusivity: "authors_edition",
  },
];

/* ─── Combined catalog ─── */

export const ALL_COSMETICS: readonly Cosmetic[] = Object.freeze([
  ...T1_COSMETICS,
  ...T2_COSMETICS,
  ...T3_COSMETICS,
]);

export const COSMETICS_BY_ID: Readonly<Record<string, Cosmetic>> = Object.freeze(
  Object.fromEntries(ALL_COSMETICS.map((c) => [c.id, c])),
);

export function getCosmeticsByTier(tier: CosmeticTier): readonly Cosmetic[] {
  return ALL_COSMETICS.filter((c) => c.tier === tier);
}

export function getCosmeticsBySlot(slot: CosmeticSlot): readonly Cosmetic[] {
  return ALL_COSMETICS.filter((c) => c.slot === slot);
}

/**
 * Cosmetics the player can currently buy. Filters by:
 *   - level gate
 *   - exclusivity (entitlements held)
 *   - affordability (one of Dream or VC ≥ price)
 *
 * Bundle-exclusive cosmetics (priceDream=0 and priceVoidCrystals=0) are
 * never returned here — they're granted via product purchase, not bought
 * from the cosmetic catalog directly.
 */
export interface CosmeticBuyContext {
  level: number;
  dream: number;
  voidCrystals: number;
  hasFoundingAuthor: boolean;
  hasAuthorsEditionS2: boolean;
}

export function getAffordableCosmetics(ctx: CosmeticBuyContext): readonly Cosmetic[] {
  return ALL_COSMETICS.filter((c) => {
    if (ctx.level < c.minLevel) return false;
    if (c.exclusivity === "founders" && !ctx.hasFoundingAuthor) return false;
    if (c.exclusivity === "authors_edition" && !ctx.hasAuthorsEditionS2) return false;
    // Bundle-exclusive cosmetics (no price): ungrantable from catalog.
    if (c.priceDream === 0 && c.priceVoidCrystals === 0) return false;
    const dreamOk = c.priceDream > 0 && ctx.dream >= c.priceDream;
    const vcOk = c.priceVoidCrystals > 0 && ctx.voidCrystals >= c.priceVoidCrystals;
    return dreamOk || vcOk;
  });
}
