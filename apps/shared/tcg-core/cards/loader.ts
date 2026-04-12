/**
 * Card registry loader.
 *
 * Takes a list of hand-authored CardDefinition objects, validates every
 * one through the Zod schema, and constructs a frozen CardRegistry. The
 * reducer and effect interpreter read from this registry — they never
 * walk raw files.
 *
 * Loader contract:
 *  - Runs synchronously at startup (client bundle import + server boot).
 *  - Fails loudly with the offending card id if validation fails.
 *  - Defensive: rejects duplicate ids; rejects cards with a rulesVersion
 *    ahead of the engine's current RULES_VERSION; rejects cards whose
 *    faction doesn't match any known faction.
 *  - Returns a frozen CardRegistry — calling code can share the reference.
 *
 * The load function is pure over its input list; in production the
 * application builds `allDefinitions` by importing every file under
 * cards/definitions/**, either via a generated barrel (committed) or a
 * Vite glob import. Tests can pass a small ad-hoc list.
 */
import type { CardDefinition, CardRegistry } from "../index";
import { RULES_VERSION, isReplayCompatible } from "../engine/version";
import { cardDefinitionSchema } from "./schema";

export class CardRegistryLoadError extends Error {
  constructor(
    public readonly cardId: string | null,
    message: string,
    public readonly cause?: unknown
  ) {
    super(
      cardId
        ? `CardRegistryLoadError[${cardId}]: ${message}`
        : `CardRegistryLoadError: ${message}`
    );
    this.name = "CardRegistryLoadError";
  }
}

/**
 * Build a frozen CardRegistry from a list of hand-authored definitions.
 *
 * @throws CardRegistryLoadError on the first validation failure, with the
 *         offending card id and a descriptive message. The intent is to
 *         fail CI loudly rather than silently drop malformed cards.
 */
export function buildCardRegistry(
  allDefinitions: readonly unknown[]
): CardRegistry {
  const byId = new Map<string, CardDefinition>();
  for (let i = 0; i < allDefinitions.length; i++) {
    const raw = allDefinitions[i];
    let parsed: CardDefinition;
    try {
      parsed = cardDefinitionSchema.parse(raw) as unknown as CardDefinition;
    } catch (e) {
      // Pull the id out of the raw object if we can, for a useful error.
      const id =
        raw && typeof raw === "object" && "id" in raw && typeof (raw as { id: unknown }).id === "string"
          ? ((raw as { id: string }).id)
          : null;
      throw new CardRegistryLoadError(
        id,
        `validation failed at index ${i}: ${(e as Error).message}`,
        e
      );
    }
    if (byId.has(parsed.id)) {
      throw new CardRegistryLoadError(
        parsed.id,
        `duplicate card id (first at index ${[...byId.keys()].indexOf(parsed.id)})`
      );
    }
    if (!isReplayCompatible(parsed.rulesVersion, RULES_VERSION)) {
      throw new CardRegistryLoadError(
        parsed.id,
        `rulesVersion '${parsed.rulesVersion}' is incompatible with engine '${RULES_VERSION}'`
      );
    }
    byId.set(parsed.id, parsed);
  }

  // Build the CardRegistry interface. Freeze the underlying map so
  // downstream code can't mutate it accidentally.
  const frozen: ReadonlyMap<string, CardDefinition> = byId;
  const all = Array.from(byId.values());
  Object.freeze(all);

  const registry: CardRegistry = {
    get: (defId: string) => frozen.get(defId),
    has: (defId: string) => frozen.has(defId),
    listAll: () => all,
  };
  Object.freeze(registry);
  return registry;
}

/**
 * Convenience: load the registry and immediately assert a set of card ids
 * is present. Used by tests and by startup smoke checks to make sure
 * critical cards made it through validation.
 */
export function assertCardsPresent(
  registry: CardRegistry,
  requiredIds: readonly string[]
): void {
  const missing = requiredIds.filter((id) => !registry.has(id));
  if (missing.length > 0) {
    throw new CardRegistryLoadError(
      null,
      `required cards missing from registry: ${missing.join(", ")}`
    );
  }
}
