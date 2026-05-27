/**
 * Zod schema ↔ TypeScript union parity check.
 *
 * PR-4 discovered that `cardUnlockConditionSchema` in
 * `apps/shared/tcg-core/cards/schema.ts` was missing
 * `kind` discriminator literals from the TypeScript union
 * in `apps/shared/tcg-core/types/Card.ts:CardUnlockCondition`.
 * Variants had been added to the TS union but never mirrored
 * in the Zod schema; the drift caused any card declaring those
 * kinds to fail loader validation at registry build.
 *
 * This check is the regression guard. It walks the
 * `CardUnlockCondition` TS union and confirms the Zod
 * schema's `kind` literal-set covers every TS literal. Any
 * gap is a FAIL.
 *
 * The check is hard-parity (no ratchet) — schema drift
 * here is always a bug.
 */
import { cardUnlockConditionSchema } from "../../tcg-core/cards/schema";
import type { CardUnlockCondition } from "../../tcg-core/types/Card";
import type { RawParityCount } from "../types";

/**
 * Statically declared TypeScript union literals for the
 * CardUnlockCondition.kind discriminator. Kept in sync with
 * `apps/shared/tcg-core/types/Card.ts` manually — any new
 * kind added there MUST be added here too, otherwise the
 * gate misses the corresponding Zod check.
 *
 * The TS compiler enforces this: the `TS_KIND_REGISTRY`
 * literal type is asserted to be assignable to
 * `CardUnlockCondition["kind"]`. If the TS union grows, the
 * compiler will not complain (since extra literals on the
 * union are fine), but if the union SHRINKS, this list will
 * fail to typecheck — keeping the registry honest.
 */
const TS_KIND_REGISTRY = [
  "act_completion",
  "secret",
  "battle_pass",
  "founding_author",
  "authors_edition",
  "dlc_chapter_completion",
  "bloodline_threshold",
  "arc_episode_complete",
  "perspective_learned",
  "dialog_choice",
] as const satisfies readonly CardUnlockCondition["kind"][];

export function checkZodSchemaUnionParity(): RawParityCount {
  const declared = TS_KIND_REGISTRY.length;

  // Extract the kinds from the Zod schema's discriminated-union
  // options. Each option is a strict object whose `kind` field
  // is a z.literal(...). We read the literal's `value` to get
  // the string back.
  // Note: this introspection depends on Zod v4's _zod.def shape.
  // If Zod is upgraded and the introspection breaks, this check
  // becomes a FAIL — which is exactly what we want: the test
  // surfaces the drift.
  const schemaOptions =
    (cardUnlockConditionSchema as unknown as {
      _zod?: { def?: { options?: ReadonlyArray<unknown> } };
    })._zod?.def?.options ?? [];

  const schemaKinds = new Set<string>();
  for (const opt of schemaOptions) {
    const shape = (opt as { def?: { shape?: Record<string, unknown> } }).def?.shape;
    const kindField = shape?.kind as
      | { _zod?: { def?: { values?: ReadonlyArray<unknown> } } }
      | undefined;
    const literalValues = kindField?._zod?.def?.values ?? [];
    for (const v of literalValues) {
      if (typeof v === "string") schemaKinds.add(v);
    }
  }

  const implemented = TS_KIND_REGISTRY.filter((k) => schemaKinds.has(k)).length;

  const missing = TS_KIND_REGISTRY
    .filter((k) => !schemaKinds.has(k))
    .map((k) => `cardUnlockConditionSchema missing kind '${k}' (declared in TS union)`);

  return { declared, implemented, missing };
}
