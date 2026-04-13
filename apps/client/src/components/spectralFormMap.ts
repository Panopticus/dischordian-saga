/* ═══════════════════════════════════════════════════════
   SPECTRAL FORM MAPPING

   Maps apprentice archetypes and narrative companion ids
   to the 13 spectral form art assets in SPECTRAL_ART
   (apps/client/src/data/nanobanna2Assets.ts).

   The 13 keys (auros, nyx, cog, sibyl, toxis, lux, echo,
   glyph, cipher, flicker, gilt, spore, strain) map one-to-one
   to the image files under /art/spectral/. Use a lookup helper
   so death/memorial UIs can show the right ghost without
   hard-coding paths.
   ═══════════════════════════════════════════════════════ */

export const ARCHETYPE_TO_SPECTRAL: Record<string, keyof typeof import("@/data/nanobanna2Assets").SPECTRAL_ART> = {
  zealot: "auros",      // gilded lion, burning faith
  ghost: "nyx",         // void serpent — literal ghost
  scholar: "cipher",    // hidden-knowledge decoder
  revenant: "strain",   // came back wrong
  artisan: "cog",       // brass architect, maker
  oracle: "sibyl",      // crystal oracle, foresight
  wanderer: "echo",     // signal across distance
  martyr: "gilt",       // sacrificial gold
  heretic: "toxis",     // plague bloom, forbidden
  jester: "flicker",    // chaotic, unstable light
  sentinel: "glyph",    // protective symbol
  prodigal: "lux",      // returning to the light
};

/** Fallback spectral key when nothing matches. */
export const DEFAULT_SPECTRAL_KEY = "spore" as const;

/** Narrative companion → spectral species. Covers the story cast in CompanionFarewell. */
export const COMPANION_TO_SPECTRAL: Record<string, keyof typeof import("@/data/nanobanna2Assets").SPECTRAL_ART> = {
  elara: "sibyl",       // she carries the senator's insight
  human: "lux",         // the cracked but luminous conscience
  agent_zero: "cipher", // the decoder
  kael: "auros",        // the warrior's fallen light
  lyris: "echo",        // the signal that keeps looping
};

/** Crew species → spectral species. Used by the Memorial Wall. */
export const CREW_SPECIES_TO_SPECTRAL: Record<string, keyof typeof import("@/data/nanobanna2Assets").SPECTRAL_ART> = {
  human: "lux",
  demagi: "auros",
  quarchon: "sibyl",
  abyssal: "nyx",
  voltari: "flicker",
  construct: "cog",
  neyon: "echo",
  terminus: "strain",
};

/**
 * Deterministic fallback picker — hash a stable id string and return one of
 * the 13 spectral keys. Used so every memorial entry gets a consistent ghost.
 */
const SPECTRAL_KEYS = [
  "auros","nyx","cog","sibyl","toxis","lux","echo","glyph","cipher","flicker","gilt","spore","strain",
] as const;
export function pickSpectralForId(id: string): typeof SPECTRAL_KEYS[number] {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return SPECTRAL_KEYS[Math.abs(hash) % SPECTRAL_KEYS.length];
}
