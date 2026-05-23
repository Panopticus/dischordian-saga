/**
 * Prestige dialog VO manifest — typed wrapper over
 * `prestigeVoManifest.json`.
 *
 * Generator: `apps/scripts/generate-prestige-vo.ts`. The manifest
 * starts empty; the producer runs the generator with ElevenLabs +
 * AWS credentials to produce MP3s and append entries. The client's
 * prestige notification renderer calls `prestigeVoiceUrl(flagId)` —
 * a missing key returns `undefined` and the renderer falls back to
 * text-only.
 *
 * Voice casting reference (from `prestige-lines.json:_meta`):
 *   elara            → xMyNDrPFEtQN8iZtT7l2  (Elara Voices/)
 *   the_human        → oGbGJdgofRR8z0MxwI8L  (Human Voices/)
 *   adjudicator_locke→ 8XiBWqS5ffaH5naIFHPI  (Locke Voices/)
 *   shadow_tongue    → 14wGKUgRFDPSwtCQurbB  (ShadowTongue Voices/)
 *   the_source       → hfq5qawrYj4gqFsfoE28  (Source Voices/)
 *   the_antiquarian  → yAKlvHIsuj4SvnKQ6Mk4  (Antiquarian Voices/)
 *   the_meme         → VgFgBh5TnWeBhCBvCJ1E  (Meme Voices/)
 *   the_necromancer  → II5QotwxLcQdwey5xEyd  (Necromancer Voices/)
 *   the_degen        → r6VqF23i4qBEORazjelf  (Degen Voices/)
 */

import manifestData from "./prestigeVoManifest.json";

export interface PrestigeVoEntry {
  flagId: string;
  npcId: string;
  url: string;
  generatedAt: string;
}

export interface PrestigeVoManifest {
  generatedAt: string;
  entries: PrestigeVoEntry[];
}

const MANIFEST: PrestigeVoManifest = manifestData as PrestigeVoManifest;

const BY_FLAG_ID: ReadonlyMap<string, PrestigeVoEntry> = new Map(
  MANIFEST.entries.map((e) => [e.flagId, e] as const),
);

/**
 * Resolve the CDN URL for a prestige dialog's MP3. Returns `undefined`
 * when the line hasn't been recorded yet — the client should fall back
 * to text-only display in that case.
 */
export function prestigeVoiceUrl(flagId: string): string | undefined {
  return BY_FLAG_ID.get(flagId)?.url;
}

/** Total recorded entries (for dashboards / audits). */
export const PRESTIGE_VO_TOTAL = MANIFEST.entries.length;

export { MANIFEST as PRESTIGE_VO_MANIFEST };
