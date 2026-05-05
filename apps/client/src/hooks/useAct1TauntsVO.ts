/* useAct1TauntsVO — Plays Act 1 opponent taunt VO from per-character manifests.
 *
 * Audit 2026-05-05 §4.1: 21 taunt lines authored in
 * apps/scripts/act1-taunts-lines.json. The producer-side generator
 * apps/scripts/generate_act1_taunts_vo.py emits per-character
 * manifests (collectorVoManifest.json, watcherVoManifest.json, etc.)
 * keyed by line id (e.g. "little_collector_taunt_early"). This hook
 * merges those seven manifests so the overlay can call speak(lineId)
 * without knowing which character the line belongs to.
 *
 * Idempotent against missing manifest entries: when the producer has
 * not yet generated a line, useNpcVO logs a warn and the overlay
 * falls back to text-only.
 */
import { useNpcVO } from "./useNpcVO";

const loader = async (): Promise<Record<string, string>> => {
  const [collector, watcher, eidola, matrikala, authority, programmer, warlord] =
    await Promise.all([
      import("@shared/collectorVoManifest.json"),
      import("@shared/watcherVoManifest.json"),
      import("@shared/eidolaVoManifest.json"),
      import("@shared/matrikalaVoManifest.json"),
      import("@shared/authorityVoManifest.json"),
      import("@shared/programmerVoManifest.json"),
      import("@shared/warlordVoManifest.json"),
    ]);
  const merged: Record<string, string> = {};
  const sources = [
    (collector.default || collector) as Record<string, string>,
    (watcher.default || watcher) as Record<string, string>,
    (eidola.default || eidola) as Record<string, string>,
    (matrikala.default || matrikala) as Record<string, string>,
    (authority.default || authority) as Record<string, string>,
    (programmer.default || programmer) as Record<string, string>,
    (warlord.default || warlord) as Record<string, string>,
  ];
  for (const m of sources) Object.assign(merged, m);
  return merged;
};

export function useAct1TauntsVO() {
  return useNpcVO("act1-taunts", loader);
}
