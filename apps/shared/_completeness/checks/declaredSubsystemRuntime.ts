/**
 * Declared-but-unbuilt subsystem parity check.
 *
 * Thin adapter over {@link DECLARED_DESIGN_SYSTEMS} — the registry of
 * design docs whose runtime is tracked by the gate. Each entry declares
 * the runtime symbols it expects to produce; this check counts how many
 * are actually present in source.
 *
 * The seed entries (soul_stones, pet_breeding, living_character_sheet)
 * are unchanged in id and shape from the prior inline ARTIFACTS list so
 * the existing `design.declared_subsystem_runtime` ratchet state stays
 * valid. New design entries land in `declaredDesignSystems.ts` and
 * appear here automatically — no code change to this file is needed
 * to track another design.
 *
 * Ratcheted parity. The whole point is that "doc shipped, code didn't"
 * is a tracked state.
 */
import {
  DECLARED_DESIGN_SYSTEMS,
  symbolIsPresent,
} from "../declaredDesignSystems";
import type { RawParityCount } from "../types";

export function checkDeclaredSubsystemRuntime(): RawParityCount {
  const missing: string[] = [];
  let declared = 0;
  for (const sys of DECLARED_DESIGN_SYSTEMS) {
    for (const sym of sys.expectedRuntimeSymbols) {
      declared += 1;
      if (!symbolIsPresent(sym)) {
        missing.push(
          `${sys.id}/${sym.kind}:${sym.needle} — ${sym.description} ` +
            `(see ${sys.docPath})`,
        );
      }
    }
  }
  return {
    declared,
    implemented: declared - missing.length,
    missing,
  };
}
