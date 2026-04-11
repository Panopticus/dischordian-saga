/* useCollectorVO — The Collector's voice-over.
 *
 * Thin wrapper over the unified useFighterVO hook. The actual
 * audio manifest lives at apps/shared/collectorVoManifest.json
 * (currently empty — content pass will populate it).
 */
import { useFighterVO, type UseFighterVOResult } from "./useFighterVO";

export function useCollectorVO(): UseFighterVOResult {
  return useFighterVO("collector");
}
