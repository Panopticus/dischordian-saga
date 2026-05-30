/**
 * Choice-outcome consumer parity.
 *
 * Plan §2.1 Foundations #5.
 *
 * `apps/shared/campaign/choiceOutcomeRegistry.ts` catalogues every
 * BioWare-style dialog choice whose outcome cascades into the
 * world (a flag set, a faction shifted, a card unlocked, an
 * encounter deck mutated, a stakes axis touched).
 *
 * Each registered outcome must have a downstream consumer:
 *
 *   - `set_flag`  ⇒ the flag is registered in
 *                   `narrativeFlagRegistry.ts` AND has a
 *                   `setNarrativeFlag(...)` (or `flagsToSet.push(...)`)
 *                   call somewhere in `apps/`. Same producer regex
 *                   that `narrativeFlagBridgeCoverage` uses, so the
 *                   two checks share a vocabulary.
 *
 *   - `unlock_card` ⇒ the card def id is loadable from the registry
 *                     (verified by a literal-string reference scan).
 *
 *   - `faction_rep` ⇒ the faction key is one of the canonical
 *                     FACTIONS enum members (typechecked at
 *                     registry-author-time; verified again here so a
 *                     `Partial<Record<Faction, number>>` typed as
 *                     `Record<string, number>` cannot drift in).
 *
 *   - `mutate_encounter_deck` ⇒ the encounter id appears as a
 *                               StoryEncounter id somewhere in
 *                               `apps/shared/tcg-core/`.
 *
 *   - `stakes_axis` ⇒ the axis id is a canonical engine StakesAxis
 *                     (STAKES_AXES, engine/stakesResolver.ts) AND is
 *                     declared by at least one encounter's
 *                     `stakesMode.axes`. The reducer
 *                     (engine/stakesReducer.ts applyDialogStakes)
 *                     drops deltas for axes no encounter declares, so
 *                     an outcome naming an undeclared axis would be a
 *                     dead write. Was a deferred no-op until the
 *                     stakesMode reducer shipped; now a real scan.
 *
 * The check is **hard parity** — any gap fails CI. Entries land
 * alongside their consumers.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT, walkSourceFiles } from "../scanner";
import type { RawParityCount } from "../types";
import {
  CHOICE_OUTCOME_REGISTRY,
  validateChoiceOutcomeEntry,
} from "../../campaign/choiceOutcomeRegistry";
import {
  isRegisteredFlag,
} from "../../flags/narrativeFlagRegistry";
import { FACTIONS } from "../../tcg-core/cards/schema";
import { STAKES_AXES } from "../../tcg-core/engine/stakesResolver";

const APPS_DIR = path.join(REPO_ROOT, "apps");

/** Call-site producer regex shared with `narrativeFlagBridgeCoverage` —
 *  matches `setNarrativeFlag("<flag>", ...)` and
 *  `flagsToSet.push("<flag>")`. Kept in sync deliberately. */
const FLAG_PRODUCER_RE =
  /(?:setNarrativeFlag|flagsToSet\.push)\(\s*["']([a-z][a-zA-Z0-9_:]+)["']/g;

/** Data-form producer regex. Act-step / NpcDialogChoice objects carry
 *  the flag literal as `setFlag: "<flag>"`; NarrativeEngine.tsx applies
 *  it at runtime via `setNarrativeFlag(choice.setFlag, true)`
 *  (NarrativeEngine.tsx:204,263). The literal therefore never appears
 *  at a `setNarrativeFlag("literal")` call site, so the call-site regex
 *  alone misses these genuine producers. `\b` anchor avoids matching
 *  `resetFlag:` / `unsetFlag:`. */
const SET_FLAG_DATA_RE =
  /\bsetFlag\s*:\s*["']([a-z][a-zA-Z0-9_:]+)["']/g;

/** Dialog-tree producer regex. `NpcDialogChoice` objects carry the
 *  flag literal as `sets: "<flag>"`; applyDialogChoice.ts:115 pushes it
 *  as a narrative flag write at runtime
 *  (`flagWrites.push({ flag: choice.sets, scope: "narrative" })`). The
 *  `\b` anchor avoids matching `assets:` / `offsets:` / `presets:`. */
const SETS_DATA_RE =
  /\bsets\s*:\s*["']([a-z][a-zA-Z0-9_:]+)["']/g;

let producedFlagsCache: Set<string> | null = null;

function scanProducedFlags(): Set<string> {
  if (producedFlagsCache) return producedFlagsCache;
  const out = new Set<string>();
  for (const file of walkSourceFiles(APPS_DIR)) {
    const src = fs.readFileSync(file, "utf-8");
    for (const re of [FLAG_PRODUCER_RE, SET_FLAG_DATA_RE, SETS_DATA_RE]) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(src)) !== null) {
        out.add(m[1]);
      }
      re.lastIndex = 0;
    }
  }
  producedFlagsCache = out;
  return out;
}

let cardDefIdsCache: Set<string> | null = null;

function scanCardDefIds(): Set<string> {
  if (cardDefIdsCache) return cardDefIdsCache;
  // Card definition files name the id on a `id: "<defId>"` line
  // (sometimes with `as CardDefinition["id"]` casts). We don't need
  // to be exhaustive — any `id: "..."` in `apps/shared/tcg-core/cards/`
  // is a candidate.
  const out = new Set<string>();
  const cardsDir = path.join(APPS_DIR, "shared/tcg-core/cards");
  const re = /\bid:\s*["']([a-z0-9][a-zA-Z0-9_]+)["']/g;
  for (const file of walkSourceFiles(cardsDir)) {
    const src = fs.readFileSync(file, "utf-8");
    let m: RegExpExecArray | null;
    while ((m = re.exec(src)) !== null) {
      out.add(m[1]);
    }
    re.lastIndex = 0;
  }
  cardDefIdsCache = out;
  return out;
}

let encounterIdsCache: Set<string> | null = null;

function scanEncounterIds(): Set<string> {
  if (encounterIdsCache) return encounterIdsCache;
  const out = new Set<string>();
  const tcgDir = path.join(APPS_DIR, "shared/tcg-core");
  // StoryEncounter literals look like `id: "<encounterId>"` on the
  // first line of the encounter object. Match the same way as cards.
  const re = /\bid:\s*["']([a-zA-Z][a-zA-Z0-9_]+)["']/g;
  for (const file of walkSourceFiles(tcgDir)) {
    const src = fs.readFileSync(file, "utf-8");
    let m: RegExpExecArray | null;
    while ((m = re.exec(src)) !== null) {
      out.add(m[1]);
    }
    re.lastIndex = 0;
  }
  encounterIdsCache = out;
  return out;
}

let declaredStakesAxesCache: Set<string> | null = null;

/** Axes any encounter declares via `stakesMode: { axes: { <axis>: … } }`.
 *  An outcome's `stakesAxisId` must be one of these or the reducer
 *  (applyDialogStakes) drops the delta on the floor — a dead write.
 *  We scan the canonical STAKES_AXES tokens as `<axis>:` keys inside
 *  the tcg-core story files rather than parsing TS, mirroring the
 *  literal-scan style of the card / encounter scanners above. */
function scanDeclaredStakesAxes(): Set<string> {
  if (declaredStakesAxesCache) return declaredStakesAxesCache;
  const out = new Set<string>();
  const tcgDir = path.join(APPS_DIR, "shared/tcg-core");
  // Match an axis token used as an object key (`verdict:` / `"verdict":`)
  // anywhere a stakesMode block can live. Constrained to the known axis
  // tokens so arbitrary same-named keys elsewhere can't widen the set
  // beyond what the engine actually understands.
  const axisAlternation = STAKES_AXES.join("|");
  const re = new RegExp(`["']?(${axisAlternation})["']?\\s*:`, "g");
  for (const file of walkSourceFiles(tcgDir)) {
    if (file.endsWith(".test.ts") || file.endsWith(".test.tsx")) continue;
    const src = fs.readFileSync(file, "utf-8");
    let m: RegExpExecArray | null;
    while ((m = re.exec(src)) !== null) {
      out.add(m[1]);
    }
    re.lastIndex = 0;
  }
  declaredStakesAxesCache = out;
  return out;
}

export function checkChoiceOutcomeConsumerParity(): RawParityCount {
  const declared = CHOICE_OUTCOME_REGISTRY.length;
  const missing: string[] = [];

  // For caches: only built if needed by the entry kinds that ship.
  let producedFlags: Set<string> | null = null;
  let cardDefIds: Set<string> | null = null;
  let encounterIds: Set<string> | null = null;
  let declaredStakesAxes: Set<string> | null = null;
  const factionKeys = new Set<string>(FACTIONS);

  for (const entry of CHOICE_OUTCOME_REGISTRY) {
    const validity = validateChoiceOutcomeEntry(entry);
    if (!validity.ok) {
      missing.push(`${entry.id}: ${validity.reason}`);
      continue;
    }
    switch (entry.kind) {
      case "set_flag": {
        const flag = entry.flag!;
        if (!isRegisteredFlag(flag)) {
          missing.push(
            `${entry.id}: flag "${flag}" not registered in narrativeFlagRegistry`,
          );
          break;
        }
        producedFlags ??= scanProducedFlags();
        if (!producedFlags.has(flag)) {
          missing.push(
            `${entry.id}: flag "${flag}" has no producer (setNarrativeFlag / flagsToSet.push) in apps/`,
          );
        }
        break;
      }
      case "unlock_card": {
        const cardDefId = entry.cardDefId!;
        cardDefIds ??= scanCardDefIds();
        if (!cardDefIds.has(cardDefId)) {
          missing.push(
            `${entry.id}: card "${cardDefId}" not found in apps/shared/tcg-core/cards/`,
          );
        }
        break;
      }
      case "faction_rep": {
        const faction = entry.faction!;
        if (!factionKeys.has(faction)) {
          missing.push(
            `${entry.id}: faction "${faction}" is not a member of FACTIONS`,
          );
        }
        break;
      }
      case "mutate_encounter_deck": {
        const encounterId = entry.encounterMutation!.encounterId;
        encounterIds ??= scanEncounterIds();
        if (!encounterIds.has(encounterId)) {
          missing.push(
            `${entry.id}: encounter "${encounterId}" not found in apps/shared/tcg-core/`,
          );
        }
        break;
      }
      case "stakes_axis": {
        const axisId = entry.stakesAxisId!;
        if (!(STAKES_AXES as readonly string[]).includes(axisId)) {
          missing.push(
            `${entry.id}: stakes axis "${axisId}" is not a canonical STAKES_AXES member`,
          );
          break;
        }
        declaredStakesAxes ??= scanDeclaredStakesAxes();
        if (!declaredStakesAxes.has(axisId)) {
          missing.push(
            `${entry.id}: stakes axis "${axisId}" is not declared by any encounter's stakesMode.axes (the reducer would drop the delta)`,
          );
        }
        break;
      }
    }
  }

  return {
    declared,
    implemented: declared - missing.length,
    missing,
  };
}
