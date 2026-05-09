/**
 * Loredex VO manifest — typed wrapper for the JSON written by
 * apps/scripts/generate-loredex-vo.ts (NPC depth #9).
 *
 * Each entry maps a Loredex entryId (from
 * apps/client/src/data/loredex-data.json) to a CDN URL of the
 * voiced bio memo that plays when the entry surfaces in a
 * Loredex Encounter Card or is name-dropped in NPC dialog.
 *
 * The manifest is populated by the offline VO generator; lookup
 * helpers below resolve gracefully when an entry has no audio yet
 * (returns null), so the client can fall back to silent text-only
 * presentation while the generator is mid-run.
 */
import manifestData from "./loredexVoManifest.json" with { type: "json" };

export const LOREDEX_VO_MANIFEST: Readonly<Record<string, string>> =
  manifestData as Record<string, string>;

/** Resolve a Loredex entryId to its voiced bio memo URL, or null. */
export function loredexVoiceUrl(entryId: string): string | null {
  return LOREDEX_VO_MANIFEST[entryId] ?? null;
}

/** Coverage stat — useful for ship-check parity rows. */
export function loredexVoCoverage(): {
  total: number;
  ids: ReadonlyArray<string>;
} {
  const ids = Object.keys(LOREDEX_VO_MANIFEST);
  return { total: ids.length, ids };
}
