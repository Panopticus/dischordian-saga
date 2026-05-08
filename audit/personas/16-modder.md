# Modder / Community Dev — Audit

## Top 5 findings

### F1: Faction enum drift between TS type and Zod schema
- file: apps/shared/tcg-core/types/Card.ts:16-24 vs schema.ts:26-36
- severity: high
- category: schema_strictness
- finding: TS `Faction` lists 8 factions and **omits `panopticon`**; Zod `factionSchema` lists 9 including it. A `panopticon` card fails TS compile but passes runtime parse. The "schema validates the type" invariant is broken.
- fix: derive `Faction` from `z.infer<typeof factionSchema>`, or add a `_completeness` parity test asserting set-equality.

### F2: Barrel is hand-maintained — every new card is a manual import + spread
- file: apps/shared/tcg-core/cards/index.ts (977 lines, 475 def files)
- severity: high
- category: barrel_manual
- finding: Adding a card needs the def file, an `import` line, and the symbol in `ALL_CARD_DEFINITIONS`. Forget either of the latter two and the card silently doesn't exist. loader.ts:18-20 names the alternative — *"a generated barrel or a Vite glob import"* — neither is built.
- fix: `import.meta.glob("./definitions/**/*.ts", { eager: true })` + codegen for the server bundle, with a CI staleness check.

### F3: Promised tcg-core README is missing
- file: CONTRIBUTING.md:75-77, no apps/shared/tcg-core/README.md
- severity: high
- category: docs_for_contributors
- finding: CONTRIBUTING.md says *"Read its README first"* — the README does not exist. The only "add a card" narrative is in CLAUDE.md (assistant-directed) and skips the barrel-spread step. No doc on adding a faction or expansionArt manifest.
- fix: write `apps/shared/tcg-core/README.md` — minimal valid card, 3-step add checklist, faction checklist, standalone `cardDefinitionSchema.parse()` invocation.

### F4: "Add a faction" is an invasive multi-file edit
- file: schema.ts:26 + types/Card.ts:16 + cards/index.ts + apps/shared/expansionArt/index.ts + balance/manualTrialCategoryOverrides
- severity: medium
- category: extension_friction
- finding: Factions are inline `z.enum([...])` literals duplicated as a TS union. No `registerFaction()`, no plugin manifest. A modder cannot ship a new faction without forking. Same for `Keyword` and `TrialCategory`.
- fix: extract `FACTIONS = [...] as const` as single source of truth; derive Zod + TS from it. Long term: a `pluginManifest` for community packs.

### F5: Effect-op vocabulary missing TCG staples
- file: apps/shared/tcg-core/engine/effectInterpreter.ts (29 ops), types/Effect.ts:79-127
- severity: medium
- category: effect_op_gaps
- finding: 29 ops cover damage/buff/keyword/draw/move well, but counterspell, copy-effect, deck-search, and damage-prevention math are absent. Authors push engine PRs — a mod cannot land them without a fork.
- fix: ship `cancel_pending_effect`, `copy_effect`, `search_deck`, `transform_amount` in v1.2.0 RULES_VERSION bump. Consider a `registerEffectOp` hook gated by feature flag.

## "Add a card" friction trace

1. **Create file** `apps/shared/tcg-core/cards/definitions/<faction>/<id>.ts`. Import `CardDefinition` and `assetUrl` (5-deep relative path, not `@shared`).
2. **Write the literal**, casting id with `as CardDefinition["id"]` and ability ids with `as CardDefinition["abilities"][number]["id"]`. Include `rulesVersion`, sorted `trial_categories`, optional `verdict_delta`. *Automatable: `pnpm cards:scaffold <id>` would kill the casts.*
3. **Edit `cards/index.ts`** — add `import { cardDef as <id> } from "./definitions/<faction>/<id>.ts";` in the alphabetized block. *Automatable — F2.*
4. **Edit `ALL_CARD_DEFINITIONS`** — append the symbol (or spread). *F2.*
5. **Run `pnpm check && pnpm test`** — schema errors are excellent: `CardRegistryLoadError[<id>]: validation failed at index N: <zod path>`. Asset coverage + ship-check round it out.

Steps 3-4 are pure clerical work.

## Effect-op gap list

1. **`cancel_pending_effect` (counterspell).** No interrupt in trigger queue. ~90% of TCGs ship with one.
2. **`copy_effect` / `clone_card`.** No "copy last spell" or "summon copy of target." `transform { into }` needs a literal tokenId.
3. **`search_deck` / tutor.** `draw` is top-of-deck only. ~30% of TCG design space inaccessible.
4. **`modify_next_amount` / damage prevention.** `forcefield` absorbs one instance; no "prevent N" or "double next damage" — Amount has no upstream multiplier.
5. **`reveal_hand` / hidden-info peek.** No op to look at opponent's hand or top N of deck.

The `superRefine` at schema.ts:502-520 (legacy "-999 reset" warning) is great authoring DX — more of that pattern would help.

## Convergence hints

- **F1** is one parity test in `_completeness/registry.ts` — 5 lines, high leverage. Same template covers Keyword + TrialCategory + EffectOp ↔ effectInterpreter.
- **F2** is one Vite glob-import or codegen — collapses 4 edits to 1.
- **F3** is pure doc work CONTRIBUTING.md already promises exists.
- **F5** is the hard one — `cancel_pending_effect` needs a trigger-queue interrupt with replay-determinism implications. Treat as a v1.2.0 milestone.
- Schema **is** strict; sandbox isolation is good (malformed cards throw at boot, don't crash matches). Strong foundation; friction is in the seams.
