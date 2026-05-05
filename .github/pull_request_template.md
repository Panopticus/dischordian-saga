<!-- Thanks for the PR. Fill in the sections that apply. -->

## What

<!-- One-paragraph description. The "why" matters more than the "what" — well-named code is its own description. -->

## Type

- [ ] Feature (player-visible behaviour added)
- [ ] Fix (incorrect behaviour corrected)
- [ ] Refactor (no behaviour change)
- [ ] Docs / chore / CI

## Testing

<!-- How did you verify this works? Mark all that apply. -->

- [ ] `pnpm check` (typecheck) passes
- [ ] `pnpm lint` passes
- [ ] `pnpm lint:void-energy` passes (required if you touched an
      adopted file)
- [ ] `pnpm test` passes
- [ ] Manually exercised in dev (describe what you clicked / typed)
- [ ] e2e: ran `pnpm test:e2e` locally _or_ relying on CI

## Player-visible

<!-- If yes, write the changelog entry here so the release-notes
     generator can pick it up. Otherwise delete this section. -->

## Schema / data

<!-- Migrations, JSON column shape changes, anything that changes
     persisted data. If yes, link the migration file and describe
     the rollout (does production need a backfill?). -->

## Risk

<!-- What's the worst thing that could break in production from this
     PR? "Nothing, this is internal" is a fine answer. -->

## Checklist

- [ ] No new `as any` / `@ts-ignore` (or justified in a comment)
- [ ] No new raw hex/rgb colours in adopted void-energy files
- [ ] Currency-bearing mutations are wrapped in `db.transaction`
- [ ] Auth-bearing endpoints use `protectedProcedure` /
      `adminProcedure`, not `publicProcedure`
- [ ] Updated `CHANGELOG.md` if player-visible
