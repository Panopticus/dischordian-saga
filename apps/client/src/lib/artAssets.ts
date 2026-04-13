/* ═══════════════════════════════════════════════════════
   AAA ART ASSET MANIFEST

   Typed registry for the AAA art bundle that lives under
   apps/client/public/art/. Files are served at site root
   by Vite (dev) and Railway's static file middleware (prod)
   with cache-control: public, max-age=31536000, immutable.

   The originals were sourced from the dgrsart S3 bundle
   `dischordian_aaa_game_design_assets.zip` and compressed
   to WebP (max 1536px, q85) by apps/scripts/wire-art-assets.ts.

   Mirrors the structure of casinoAssets.ts. Every category
   object is `as const` so consumers get literal-type
   inference on keys.
   ═══════════════════════════════════════════════════════ */

const ART_BASE = "/art";

/* ─── SECTION 1: HUD / UI CHROME ─── */
/** Heads-up display panels, buttons, status bars, and cursor */
export const HUD_ASSETS = {
  /** Primary HUD panel background */
  panelMain: `${ART_BASE}/ui/hud/panel_main.webp`,
  /** Accent / sub-panel framing */
  panelAccent: `${ART_BASE}/ui/hud/panel_accent.webp`,
  /** Primary call-to-action button */
  buttonPrimary: `${ART_BASE}/ui/hud/button_primary.webp`,
  /** Secondary / alternate button */
  buttonSecondary: `${ART_BASE}/ui/hud/button_secondary.webp`,
  /** Health bar fill / chrome */
  barHealth: `${ART_BASE}/ui/hud/bar_health.webp`,
  /** Mana bar fill / chrome */
  barMana: `${ART_BASE}/ui/hud/bar_mana.webp`,
  /** XP / progression bar */
  barXp: `${ART_BASE}/ui/hud/bar_xp.webp`,
  /** Default mouse cursor sprite */
  cursorDefault: `${ART_BASE}/ui/hud/cursor_default.webp`,
} as const;

/* ─── SECTION 2: ARK ROOM BACKDROPS ─── */
/** Full-bleed environment art for ark interior rooms */
export const ARK_ROOM_ART = {
  /** Crew barracks — bunk room */
  barracks: `${ART_BASE}/rooms/ark_barracks.webp`,
  /** Observatory — star-gazing deck */
  observatory: `${ART_BASE}/rooms/ark_observatory.webp`,
  /** Galley — mess hall / kitchen */
  galley: `${ART_BASE}/rooms/ark_galley.webp`,
  /** Chapel — meditation / prayer space */
  chapel: `${ART_BASE}/rooms/ark_chapel.webp`,
  /** Brig — holding cells */
  brig: `${ART_BASE}/rooms/ark_brig.webp`,
  /** Cryo bay (variant 2) — pod chamber */
  cryo2: `${ART_BASE}/rooms/ark_cryo_2.webp`,
  /** Armory interior — weapon racks */
  armoryInterior: `${ART_BASE}/rooms/ark_armory_interior.webp`,
  /** Reactor core */
  reactor: `${ART_BASE}/rooms/ark_reactor.webp`,
} as const;

/** Look up an ark room backdrop by id, returns null if unknown */
export function getArkRoomArt(roomId: string): string | null {
  return (ARK_ROOM_ART as Record<string, string>)[roomId] ?? null;
}

/* ─── SECTION 3: FACTION LOGOS ─── */
/** Full faction logo / title-card art */
export const FACTION_LOGOS = {
  architect: `${ART_BASE}/logos/faction_architect.webp`,
  dreamer: `${ART_BASE}/logos/faction_dreamer.webp`,
  hierarchyCorp: `${ART_BASE}/logos/faction_hierarchy_corp.webp`,
  potentialsOrder: `${ART_BASE}/logos/faction_potentials_order.webp`,
  neYon: `${ART_BASE}/logos/faction_ne_yon.webp`,
} as const;

/* ─── SECTION 4: CURRENCY ICONS ─── */
/** Trade screen / wallet currency icons */
export const CURRENCY_ICONS = {
  credits: `${ART_BASE}/trade/icons/currency_credits.webp`,
  dust: `${ART_BASE}/trade/icons/currency_dust.webp`,
  silver: `${ART_BASE}/trade/icons/currency_silver.webp`,
  gems: `${ART_BASE}/trade/icons/currency_gems.webp`,
  dreamTokens: `${ART_BASE}/trade/icons/currency_dream_tokens.webp`,
  dischordShards: `${ART_BASE}/trade/icons/currency_dischord_shards.webp`,
} as const;

/** Look up a currency icon by id, returns null if unknown */
export function getCurrencyIcon(currencyId: string): string | null {
  return (CURRENCY_ICONS as Record<string, string>)[currencyId] ?? null;
}

/* ─── SECTION 5: FACTION EMBLEMS (TRADE) ─── */
/** Compact faction crest icons for trade screen rosters */
export const FACTION_EMBLEMS = {
  newBabylon: `${ART_BASE}/trade/emblems/faction_new_babylon.webp`,
  hierarchy: `${ART_BASE}/trade/emblems/faction_hierarchy.webp`,
  neyons: `${ART_BASE}/trade/emblems/faction_neyons.webp`,
  insurgency: `${ART_BASE}/trade/emblems/faction_insurgency.webp`,
} as const;

/* ─── SECTION 6: PVP RANK BADGES ─── */
/** Tier badges for the PvP ladder */
export const PVP_RANK_BADGES = {
  bronze: `${ART_BASE}/pvp/ranks/rank_bronze.webp`,
  silver: `${ART_BASE}/pvp/ranks/rank_silver.webp`,
  gold: `${ART_BASE}/pvp/ranks/rank_gold.webp`,
  platinum: `${ART_BASE}/pvp/ranks/rank_platinum.webp`,
  diamond: `${ART_BASE}/pvp/ranks/rank_diamond.webp`,
  master: `${ART_BASE}/pvp/ranks/rank_master.webp`,
  grandmaster: `${ART_BASE}/pvp/ranks/rank_grandmaster.webp`,
} as const;

/** Ordered list of rank ids, lowest to highest */
export const PVP_RANK_ORDER = [
  "bronze",
  "silver",
  "gold",
  "platinum",
  "diamond",
  "master",
  "grandmaster",
] as const;

export type PvpRankId = (typeof PVP_RANK_ORDER)[number];

/** Look up a rank badge by id, returns the bronze badge as fallback */
export function getRankBadge(rankId: string): string {
  const lower = rankId.toLowerCase();
  return (
    (PVP_RANK_BADGES as Record<string, string>)[lower] ??
    PVP_RANK_BADGES.bronze
  );
}

/* ─── SECTION 7: MINIGAME PANELS ─── */
/** Backdrop / instruction panels for minigame puzzles */
export const MINIGAME_PANELS = {
  signalWaveform: `${ART_BASE}/minigames/panels/signal_waveform.webp`,
  hackingGrid: `${ART_BASE}/minigames/panels/hacking_grid.webp`,
  decryptionKey: `${ART_BASE}/minigames/panels/decryption_key.webp`,
  puzzleNodes: `${ART_BASE}/minigames/panels/puzzle_nodes.webp`,
} as const;

/* ─── SECTION 8: MECH PARTS ─── */
/** Engineering / repair minigame mech part sprites */
export const MECH_PARTS = {
  gearSmall: `${ART_BASE}/gears/mech_gear_small.webp`,
  gearLarge: `${ART_BASE}/gears/mech_gear_large.webp`,
  valveOpen: `${ART_BASE}/gears/mech_valve_open.webp`,
  valveClosed: `${ART_BASE}/gears/mech_valve_closed.webp`,
  pistonIn: `${ART_BASE}/gears/mech_piston_in.webp`,
  pistonOut: `${ART_BASE}/gears/mech_piston_out.webp`,
  cableA: `${ART_BASE}/gears/mech_cable_a.webp`,
  cableB: `${ART_BASE}/gears/mech_cable_b.webp`,
} as const;

/* ─── SECTION 9: ROADMAP MILESTONES ─── */
/** Development roadmap milestone badge art */
export const ROADMAP_MILESTONES = {
  alpha: `${ART_BASE}/roadmap/milestone_alpha.webp`,
  beta: `${ART_BASE}/roadmap/milestone_beta.webp`,
  launch: `${ART_BASE}/roadmap/milestone_launch.webp`,
  live: `${ART_BASE}/roadmap/milestone_live.webp`,
} as const;
