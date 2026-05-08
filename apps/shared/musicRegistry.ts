import { assetUrl } from "@shared/lib/assetUrl";
/* ═══════════════════════════════════════════════════════
   MUSIC REGISTRY — Dischordia Songs + variant randomization

   Canonical registry of all in-game music tracks delivered by
   Malkia Ukweli & the Panopticon. Each track may have multiple
   VARIANTS — different takes/mixes of the same song. When a
   scene triggers a track, the runtime picks a variant at random
   so players hear fresh material on repeat visits.

   Adding a new track:
     1. Drop the mp3(s) under apps/client/public/audio/music/{slug}/
        using v1.mp3, v2.mp3, v3.mp3, ... naming.
     2. Add an entry to MUSIC_TRACKS below with the slug + variant
        count + metadata.
     3. Call getMusicVariant(trackId) from your scene.

   Naming convention:
     - Slug: kebab-case matching the on-disk directory
     - Track ID: snake_case union type for type-safe lookups
     - Variant filename: v{n}.mp3 (1-indexed)
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

/** Stable track ids. Each maps to an on-disk slug directory. */
export type MusicTrackId =
  | "main_menu"
  | "ark_exploration"
  | "trade_navigation"
  | "trade_combat"
  | "trade_port"
  | "investigation"
  | "cipher_decode"
  | "connection_web"
  | "lore_quiz"
  | "character_select"
  | "arena_battle"
  | "deck_building"
  | "entity_unlocked"
  | "signal_degradation";

/**
 * Usage context — describes when a track plays. Kept separate from
 * the track id so multiple contexts can share a track if needed.
 */
export type MusicContext =
  | "menu"
  | "exploration"
  | "combat"
  | "trade"
  | "minigame"
  | "arena"
  | "card_game"
  | "sting"
  | "ambient";

/**
 * Loudness target (EBU R128 LUFS) for mastering alignment across
 * tracks. Same convention as PRELUDE_AMBIENT_BEDS in preludeSequence.ts.
 */
export interface MusicTrackMeta {
  /** Stable id used by callers. */
  id: MusicTrackId;
  /** Human-readable title (shown in now-playing UI). */
  title: string;
  /** Kebab-case directory slug under apps/client/public/audio/music/. */
  slug: string;
  /** Usage context for UI/menu classification. */
  context: MusicContext;
  /** Number of variants available (v1.mp3 through v{variantCount}.mp3). */
  variantCount: number;
  /** BPM from the Suno generation spec. null for stings. */
  bpm: number | null;
  /** Description from the spec docs for the dashboard. */
  description: string;
  /** True if the track is a one-shot sting rather than a loop. */
  isSting: boolean;
}

/* ─── REGISTRY ─── */

/**
 * All music tracks delivered in the Dischordia Songs build.
 * Variant counts match what's on disk at
 *   apps/client/public/audio/music/{slug}/v{n}.mp3
 *
 * BPM / description from docs/production/prompts/suno-game-music-prompts.md.
 */
export const MUSIC_TRACKS: readonly MusicTrackMeta[] = [
  {
    id: "main_menu",
    title: "CLASSIFIED FREQUENCY",
    slug: "main-menu",
    context: "menu",
    variantCount: 3,
    bpm: 70,
    description: "Main menu / loredex OS boot — ambient, cryptic, contemplative",
    isSting: false,
  },
  {
    id: "ark_exploration",
    title: "VESSEL 47",
    slug: "ark-exploration",
    context: "exploration",
    variantCount: 2,
    bpm: 60,
    description: "Inception Ark corridor exploration — slow pulse, vast",
    isSting: false,
  },
  {
    id: "trade_navigation",
    title: "WARP LANE ECONOMICS",
    slug: "trade-navigation",
    context: "trade",
    variantCount: 3,
    bpm: 120,
    description: "Trade Empire warp lane navigation — driving synth, purposeful",
    isSting: false,
  },
  {
    id: "trade_combat",
    title: "HOSTILE CONTACT",
    slug: "trade-combat",
    context: "combat",
    variantCount: 4,
    bpm: 140,
    description: "Trade Empire combat encounter — tense, percussive, urgent",
    isSting: false,
  },
  {
    id: "trade_port",
    title: "STARDOCK BAZAAR",
    slug: "trade-port",
    context: "trade",
    variantCount: 2,
    bpm: 85,
    description: "Trade Empire port trading — alien marketplace bustle",
    isSting: false,
  },
  {
    id: "investigation",
    title: "RED STRING THEORY",
    slug: "investigation",
    context: "minigame",
    variantCount: 2,
    bpm: 75,
    description: "Investigation / research mode — detective, methodical",
    isSting: false,
  },
  {
    id: "cipher_decode",
    title: "DECRYPT SEQUENCE",
    slug: "cipher-decode",
    context: "minigame",
    variantCount: 2,
    bpm: 100,
    description: "Cipher decode minigame — glitched, computational",
    isSting: false,
  },
  {
    id: "connection_web",
    title: "NEURAL PATHWAYS",
    slug: "connection-web",
    context: "minigame",
    variantCount: 2,
    bpm: 110,
    description: "Connection web minigame — neural, interconnected, cerebral",
    isSting: false,
  },
  {
    id: "lore_quiz",
    title: "KNOWLEDGE IS POWER",
    slug: "lore-quiz",
    context: "minigame",
    variantCount: 1,
    bpm: 130,
    description: "Timed lore quiz — quick-decision tension",
    isSting: false,
  },
  {
    id: "character_select",
    title: "CHOOSE YOUR CHAMPION",
    slug: "character-select",
    context: "arena",
    variantCount: 3,
    bpm: 95,
    description: "Arena character select screen — heroic, anticipatory",
    isSting: false,
  },
  {
    id: "arena_battle",
    title: "BLOOD ON THE ARENA FLOOR",
    slug: "arena-battle",
    context: "arena",
    variantCount: 2,
    bpm: 160,
    description: "Arena battle theme — brutal, triumphant",
    isSting: false,
  },
  {
    id: "deck_building",
    title: "STRATEGIC ARRANGEMENTS",
    slug: "deck-building",
    context: "card_game",
    variantCount: 3,
    bpm: 80,
    description: "Card-game deck building — strategic, contemplative",
    isSting: false,
  },
  {
    id: "entity_unlocked",
    title: "DOSSIER DECLASSIFIED",
    slug: "entity-unlocked",
    context: "sting",
    variantCount: 1,
    bpm: null,
    description: "Entity unlocked / discovery sting — 15s revelation",
    isSting: true,
  },
  {
    id: "signal_degradation",
    title: "SIGNAL DEGRADATION",
    slug: "signal-degradation",
    context: "ambient",
    variantCount: 1,
    bpm: null,
    description: "Signal degradation sting / transition — glitch moment",
    isSting: true,
  },
];

/* ─── LOOKUP ─── */

const TRACKS_BY_ID: ReadonlyMap<MusicTrackId, MusicTrackMeta> = new Map(
  MUSIC_TRACKS.map((t) => [t.id, t]),
);

/** Get the metadata for a track. Throws if the id is unknown. */
export function getMusicTrack(id: MusicTrackId): MusicTrackMeta {
  const track = TRACKS_BY_ID.get(id);
  if (!track) {
    throw new Error(`Unknown music track id: ${id}`);
  }
  return track;
}

/**
 * Build the public URL for a specific variant (1-indexed).
 * Variant index is clamped into [1, variantCount].
 */
export function getMusicVariantUrl(id: MusicTrackId, variant: number): string {
  const track = getMusicTrack(id);
  const clamped = Math.max(1, Math.min(variant, track.variantCount));
  return assetUrl(`audio/music/${track.slug}/v${clamped}.mp3`);
}

/**
 * Build all variant URLs for a track in order (v1 → v{variantCount}).
 * Useful for preloading or UI that lists variants.
 */
export function getAllMusicVariantUrls(id: MusicTrackId): readonly string[] {
  const track = getMusicTrack(id);
  return Array.from({ length: track.variantCount }, (_, i) =>
    getMusicVariantUrl(id, i + 1),
  );
}

/* ─── RANDOM SELECTION ─── */

/**
 * Pick a random variant URL for the given track. Uses Math.random by
 * default; pass a seeded RNG for deterministic tests.
 *
 * When a track has only 1 variant, that variant is always returned.
 */
export function getRandomMusicVariant(
  id: MusicTrackId,
  rng: () => number = Math.random,
): string {
  const track = getMusicTrack(id);
  if (track.variantCount === 1) return getMusicVariantUrl(id, 1);
  const variant = Math.floor(rng() * track.variantCount) + 1;
  return getMusicVariantUrl(id, variant);
}

/**
 * Pick a random variant URL that isn't the one the caller just played.
 * Ensures consecutive plays never repeat the same variant when there's
 * at least 2 variants available.
 */
export function getRandomMusicVariantExcluding(
  id: MusicTrackId,
  lastUrl: string | null,
  rng: () => number = Math.random,
): string {
  const track = getMusicTrack(id);
  if (track.variantCount === 1) return getMusicVariantUrl(id, 1);

  const all = getAllMusicVariantUrls(id);
  const candidates = lastUrl ? all.filter((u) => u !== lastUrl) : all;
  // Should never be empty for variantCount > 1 + valid lastUrl, but guard anyway
  const pool = candidates.length > 0 ? candidates : all;
  const idx = Math.floor(rng() * pool.length);
  return pool[idx];
}

/* ─── DASHBOARD HELPERS ─── */

/** Total number of distinct tracks in the registry. */
export function countMusicTracks(): number {
  return MUSIC_TRACKS.length;
}

/** Total number of music files on disk (sum of variant counts). */
export function countMusicFiles(): number {
  return MUSIC_TRACKS.reduce((sum, t) => sum + t.variantCount, 0);
}

/**
 * Collected local file paths for every music track + variant, relative
 * to the repo root. Used by the readiness test to verify disk presence.
 */
export function collectMusicFilePaths(): readonly string[] {
  const paths: string[] = [];
  for (const track of MUSIC_TRACKS) {
    for (let v = 1; v <= track.variantCount; v++) {
      paths.push(`apps/client/public/audio/music/${track.slug}/v${v}.mp3`);
    }
  }
  return paths;
}
