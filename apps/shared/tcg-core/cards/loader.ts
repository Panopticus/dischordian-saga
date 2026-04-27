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
import { resolveTrialCategories } from "../balance/resolveTrialCategories";
import { deriveSetCode } from "../sets/setCode";

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
export interface BuildCardRegistryOptions {
  /**
   * When true, the loader throws if any non-general card has no
   * `trial_categories` after the resolver pipeline (proposer +
   * second-pass + manual override). Production registries (the
   * client/server `ALL_CARD_DEFINITIONS` load) opt in so §5.8
   * admissibility has full coverage; test fixtures opt out so
   * small ad-hoc card lists don't have to invent categories.
   *
   * Default: false.
   */
  strictTrialCategoryCoverage?: boolean;
}

export function buildCardRegistry(
  allDefinitions: readonly unknown[],
  opts: BuildCardRegistryOptions = {},
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
    // P1.5 — backfill `trial_categories` for the §5.8 Authority
    // trial admissibility check. `resolveTrialCategories` composes
    // the proposer + second-pass + manual-override pipeline and
    // fills the field when the authored card def leaves it empty.
    // Cards that the resolver can't categorize are collected and
    // reported below as a single registry-level error so CI fails
    // loudly rather than silently admitting un-§5.8-playable cards
    // into the pool.
    const resolvedCats = resolveTrialCategories(parsed);
    if (resolvedCats.length > 0 && (!parsed.trial_categories || parsed.trial_categories.length === 0)) {
      parsed = { ...parsed, trial_categories: resolvedCats };
    }
    // Backfill `setCode` from the id prefix when the author omitted
    // it. The 609 cards shipped in PR #227 carry no explicit setCode
    // — they all derive to "S1_MEMOIR" via the rules in
    // sets/setCode.ts. New `s2_*` and `act{1..7}_*` cards inherit
    // their set automatically; authors may still set the field
    // explicitly when they need to override the prefix-based default.
    if (parsed.setCode === undefined) {
      parsed = { ...parsed, setCode: deriveSetCode(parsed.id) };
    }
    byId.set(parsed.id, parsed);
  }

  // §5.8 admissibility: when strict, assert every non-general card
  // has at least one category. Generals are deployed at turn 0
  // (not played from hand) and bypass the §5.8 phase-filter
  // entirely, so they're exempt. Strict is opt-in; test fixtures
  // skip so small ad-hoc card lists don't have to invent
  // categories for every stub card.
  if (opts.strictTrialCategoryCoverage) {
    const uncategorized: string[] = [];
    for (const card of byId.values()) {
      if (card.cardType === "general") continue;
      if (!card.trial_categories || card.trial_categories.length === 0) {
        uncategorized.push(card.id);
      }
    }
    if (uncategorized.length > 0) {
      throw new CardRegistryLoadError(
        null,
        `${uncategorized.length} cards have no trial_categories after the resolver pipeline. ` +
          `Either author \`trial_categories\` on each card or add an entry to ` +
          `apps/shared/tcg-core/balance/manualTrialCategoryOverrides.ts. ` +
          `Missing: ${uncategorized.slice(0, 10).join(", ")}${uncategorized.length > 10 ? "..." : ""}`,
      );
    }
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
