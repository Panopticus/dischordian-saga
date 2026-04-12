/* useArchitectVO — The Architect's voice-over.
 *
 * Thin wrapper over the unified useFighterVO hook. The actual
 * audio manifest lives at apps/shared/architectVoManifest.json
 * (currently empty — content pass will populate it).
 */
import { useFighterVO, type UseFighterVOResult } from "./useFighterVO";

export function useArchitectVO(): UseFighterVOResult {
  return useFighterVO("architect");
}
