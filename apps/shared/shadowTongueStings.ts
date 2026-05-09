/**
 * Shadow Tongue stings — typed wrapper over the authored bank
 * (apps/scripts/shadow-tongue-stings.json) and its VO manifest
 * (apps/shared/shadowTongueStingManifest.json).
 *
 * The redaction service plays a sting before surfacing a redaction
 * state change in the UI. Stings are keyed by event kind (revealed,
 * contradicted, edited_back, escalated); the runtime picks one at
 * random from the matching bucket so the same sting doesn't fire
 * twice in a row.
 */
import linesData from "../scripts/shadow-tongue-stings.json" with {
  type: "json",
};
import manifestData from "./shadowTongueStingManifest.json" with {
  type: "json",
};

export type StingKind = "revealed" | "contradicted" | "edited_back" | "escalated";

export interface ShadowTongueSting {
  id: string;
  kind: StingKind;
  text: string;
  emotion: string;
  file: string;
}

export const SHADOW_TONGUE_STINGS: ReadonlyArray<ShadowTongueSting> =
  linesData as ReadonlyArray<ShadowTongueSting>;

export const SHADOW_TONGUE_STING_MANIFEST: Readonly<Record<string, string>> =
  manifestData as Record<string, string>;

/** Resolve a sting id to its CDN URL, or null if not yet generated. */
export function stingVoiceUrl(id: string): string | null {
  return SHADOW_TONGUE_STING_MANIFEST[id] ?? null;
}

/** All stings of a given kind. */
export function stingsByKind(kind: StingKind): ReadonlyArray<ShadowTongueSting> {
  return SHADOW_TONGUE_STINGS.filter(s => s.kind === kind);
}

/**
 * Pick a sting for an event kind. `random` is injectable for tests.
 * Returns null if no sting is authored for the kind.
 */
export function pickSting(
  kind: StingKind,
  random: () => number = Math.random,
): ShadowTongueSting | null {
  const pool = stingsByKind(kind);
  if (pool.length === 0) return null;
  const idx = Math.floor(random() * pool.length);
  return pool[idx] ?? null;
}
