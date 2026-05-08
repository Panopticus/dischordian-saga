# Release runbook — May 2026

This document is the ordered checklist for the human-executed parts of
the audit-fix release: the database schema cutover, S3 bucket-policy
apply, AI-content disclosure paperwork, GDPR sub-processor verification,
and the legal-text operator-fill placeholders.

The PR-side of the audit landed in `claude/code-analysis-review-VS1ob`
across PRs #494 and #495 plus this sprint's PR #496. **None of this
runbook can be executed by an agent.** Each section names an owner, the
prerequisite, the action, and the verification step.

---

## Phase 1 — Pre-deploy verification (engineering)

Owner: **release engineer**. Window: any time during the deploy day.

- [ ] CI on `main` is green at the deploy SHA. Confirm the latest GitHub Actions
      run shows all required checks passing (typecheck, lint, vitest, ship-check,
      db-smoke, e2e).
- [ ] `INTEGRATION_TEST_DATABASE_URL` is wired in CI's `db-smoke` job (already
      added in audit Wave 2.3 — verify the env var is set in
      `.github/workflows/ci.yml`).
- [ ] `pnpm ship:check` produces **25 PASS / 1 RATCHET / 0 FAIL** locally
      (only `a11y.void_contrast_coverage: 10` remains as RATCHET — closes when
      the planned `scripts/audit-contrast.ts` headless-Chrome probe lands).
- [ ] `git revert` invocations verified for every commit in this sprint —
      schema rollback safety is non-destructive (every FK declaration in this
      branch produces ON DELETE/UPDATE constraints; reverting drops the
      constraints, never the data).

## Phase 2 — Database baseline migration cutover

Owner: **DBA**. Window: scheduled maintenance window with a brief read-only
fence.

Reference docs:
- Step 2 plan: `apps/db/migrations/README.md` Step 2 ("Cutover preparation").
- Automation: `scripts/generate-baseline-migration.ts` (DBA runbook embedded
  in the file header).

Action:
- [ ] Spin up a transient empty MySQL (8.0) container with a fresh `loredex_baseline` DB:
      ```bash
      docker run --rm -d --name baseline-mysql \
        -e MYSQL_ROOT_PASSWORD=baseline_pw \
        -e MYSQL_DATABASE=loredex_baseline \
        -p 3307:3306 mysql:8.0
      ```
- [ ] Wait for the container to be healthy. Run the baseline generator:
      ```bash
      DATABASE_URL=mysql://root:baseline_pw@127.0.0.1:3307/loredex_baseline \
        pnpm tsx scripts/generate-baseline-migration.ts
      ```
- [ ] The script writes `apps/db/0071_baseline_v1.sql` and appends the journal
      entry. Commit both on a separate `db/baseline-0071` branch (NOT main).
- [ ] On the next maintenance window, run the follow-up apply against staging:
      `pnpm db:migrate:prod` against a staging MySQL that's been freshly
      provisioned. Confirm `pnpm db:smoke` passes against the resulting state.
- [ ] Apply against production via the normal Railway deploy with the staging
      sequence verified.
- [ ] After the cutover lands, archive the existing `0000_*.sql` … `0070_*.sql`
      files into `apps/db/_archive/` and reset
      `apps/db/migrations/migration-drift.baseline.json` to
      `{ "driftedSqlFiles": [], "knownPrefixCollisions": [] }`.

Verification:
- [ ] `pnpm db:smoke` passes against fresh DB.
- [ ] `pnpm db:migrate` on a fresh DB applies cleanly without `continue-on-error`.
- [ ] All bootstrap* IIFEs in `apps/server/_core/index.ts` can be retired (this
      is a follow-up cleanup PR; the cutover does not depend on it).

Rollback: drop the new database; redeploy with the previous Railway image.

## Phase 3 — S3 bucket-policy apply (IaC)

Owner: **ops / cloud admin**. Window: any time; this is read-mostly and
backwards-compatible.

Reference doc: `docs/legal/S3_BUCKET_POLICIES.md` (canonical IaC source).

Action:
- [ ] Compare the live `dgrsart` bucket policy against the canonical JSON in
      `docs/legal/S3_BUCKET_POLICIES.md`:
      ```bash
      aws s3api get-bucket-policy --bucket dgrsart \
        | jq -r '.Policy' | jq . > /tmp/dgrsart.live.json
      ```
- [ ] If the live policy differs from canonical, apply the canonical policy:
      ```bash
      aws s3api put-bucket-policy --bucket dgrsart \
        --policy file://docs/legal/S3_BUCKET_POLICIES.dgrsart.canonical.json
      ```
      (Extract the JSON block from the doc into a separate file at apply time.)
- [ ] Repeat for `dgrsvoices`.
- [ ] Verify Block Public Access settings at the account level match the
      doc's specification.
- [ ] Verify the `cdn/client-public/*` prefix path-allowlist on
      `dgrsart` AND that no objects exist outside that prefix that are world-
      readable:
      ```bash
      aws s3api list-objects --bucket dgrsart \
        --query 'Contents[?!starts_with(Key, `cdn/client-public/`)]'
      ```
      (The result should be empty.)

Verification:
- [ ] `aws s3api get-bucket-policy --bucket dgrsart` matches the canonical JSON
      by hash.
- [ ] No object outside `cdn/client-public/*` is world-readable.

Rollback: re-apply the previous policy via `aws s3api put-bucket-policy`. The
bucket has versioning enabled per default Railway IaC — no data is lost.

## Phase 4 — AI provenance + ElevenLabs commercial-tier sign-off

Owner: **operations + legal counsel**. Window: blocking for store-listing
submission to Apple and Google Play.

Reference doc: `docs/legal/AI_PROVENANCE.md`.

Action:
- [ ] Confirm ElevenLabs commercial-tier ToS executed and filed in the secure
      document store. Until this signature exists, the production VO build
      MUST NOT include any ElevenLabs-generated voices.
- [ ] Confirm Google Gemini DPA ( https://cloud.google.com/terms/data-processing-addendum )
      executed; SCCs apply for non-EEA transfer.
- [ ] Build the in-app **About → AI in Loredex OS** page (currently planned;
      page not yet shipped). The page reproduces the manifest in plain language;
      this is a blocking precondition for the Apple §4.1 / Google Play
      "Generative AI Apps" disclosure flag in the store listings.
- [ ] In Apple App Store Connect: toggle the **AI-generated content** flag in
      the app submission form. Reference the in-app About → AI page in the
      reviewer notes.
- [ ] In Google Play Console: complete the **Generative AI Apps disclosure**
      questionnaire. Reference the same in-app page.
- [ ] Verify per-asset provenance manifests are populated for any AI-prompted
      art. Currently only Pack 2 placeholder art uses AI prompts; check
      `docs/production/act1ArtPrompts.ts` and per-card production notes.

Verification:
- [ ] No production build path includes an AI asset whose manifest entry is
      missing model + promptHash + humanReviewer + licenseTag.
- [ ] Apple + Google store listings have the AI-content disclosure flag set
      and reference the in-app About → AI page.

Rollback: pull the AI assets and ship a simpler human-authored fallback set
for the affected category. The runtime gracefully degrades to the asset
manifest's `fallbackUrl` when present.

## Phase 5 — GDPR sub-processor verification

Owner: **privacy / DPO**. Window: blocking for EU launch.

Reference doc: `apps/client/src/legal/privacy.md` §5 (Vendors and
sub-processors) + `docs/legal/VENDORS.md`.

Action:
- [ ] For each vendor in the privacy.md §5 table, confirm the executed DPA
      is on file in the secure document store. The list:
      Google (OAuth + Gemini), Discord (OAuth), GitHub (OAuth), Stripe,
      AWS S3, ElevenLabs, Sentry, OpenTelemetry, Railway, RevenueCat.
- [ ] For each non-adequacy-country vendor, confirm SCCs (Standard Contractual
      Clauses) are in place. The relevant set: Google (Gemini, US),
      Stripe (US), AWS (US), ElevenLabs (US), Sentry (US), Railway (US).
- [ ] Verify the in-app **Settings → Privacy → Sub-processors** page (currently
      planned; not yet shipped) renders the same vendor list as the privacy
      policy. Adding a vendor must update both surfaces.
- [ ] EU representative appointed (Art. 27 GDPR). Until appointed, the placeholder
      `[EU_REPRESENTATIVE]` in `apps/client/src/legal/privacy.md` remains.
- [ ] UK representative appointed (Art. 27 UK GDPR). Same placeholder pattern.

Verification:
- [ ] Every vendor row has a filed DPA + (where applicable) executed SCCs.
- [ ] No `[<UPPER_CASE_PLACEHOLDER>]` strings remain in the published privacy
      policy:
      ```bash
      grep -E '\[[A-Z_]+\]' apps/client/src/legal/privacy.md
      ```
      (Must return empty before publication.)

Rollback: if a vendor relationship cannot be confirmed in time for EU launch,
either (a) replace the vendor with an adequacy-country alternative or
(b) feature-flag the affected functionality off in EU regions until the DPA
lands.

## Phase 6 — Legal-text operator placeholders

Owner: **operator (founder / company officer)**. Window: blocking for any
public publication of the privacy / terms text.

Reference docs: `apps/client/src/legal/privacy.md`,
`apps/client/src/legal/terms.md`, `apps/client/src/legal/cookies.md`.

Action:
- [ ] Replace each operator placeholder in the legal text with the real value:
      - `[OPERATOR_REGISTERED_ADDRESS]` — the company's registered postal address.
      - `[EU_REPRESENTATIVE]` — the appointed Art. 27 GDPR representative.
      - `[UK_REPRESENTATIVE]` — the appointed Art. 27 UK GDPR representative.
      - `[DPO_NAME_OR_NONE_DESIGNATED]` — DPO name or "None designated; privacy
        team handles requests" if no DPO appointed.
      - `[GOVERNING_LAW_JURISDICTION]` — the jurisdiction whose laws govern the
        Terms (typically the company's home jurisdiction).
      - `[VENUE_CITY_STATE]` — the venue for any non-arbitration disputes.
      - `[ARBITRATION_PROVIDER]` — the chosen arbitration administrator
        (e.g. JAMS, AAA).
      - `[OPT_OUT_WINDOW_DAYS]` — the arbitration opt-out window (default 30).
- [ ] Bump `apps/server/routers/account.ts` `CURRENT_AGREEMENT_VERSIONS` to a
      new ISO date when any material change lands (forces re-acceptance via
      the in-app gate).

Verification:
- [ ] `grep -rE '\[[A-Z_]+\]' apps/client/src/legal/` returns empty.
- [ ] The version date in each `.md` file's first-line `<!-- version: ... -->`
      comment matches the corresponding `CURRENT_AGREEMENT_VERSIONS` entry.
      The `apps/client/src/legal/legal.test.ts` parity test enforces this.

Rollback: revert the legal/* commits; the previous version remains in
`CURRENT_AGREEMENT_VERSIONS` until the operator re-bumps.

## Phase 7 — Post-deploy smoke

Owner: **release engineer + QA**. Window: 30 minutes after deploy.

Action:
- [ ] Visit `/privacy`, `/terms`, `/cookies` — each renders without runtime
      errors and the version banner shows the bumped date.
- [ ] Cookie consent banner link no longer 404s; points to `/privacy`.
- [ ] Age-verification page accepts a valid DOB and locks an under-age one
      (test with a 10-year-old DOB; expect FORBIDDEN).
- [ ] Memorial Corridor / Pet Garden / Character Creation pages each render.
      Memorial Corridor "Add a flower" mutates the row.
- [ ] Throw a punch in the fight scene — hit registers and damage flashes
      (smoke for the FightEngine2D extraction).
- [ ] Open a card duel; play a card; end a turn; confirm replay determinism
      by re-running the same seed and verifying identical state hash.
- [ ] CI integration job runs against the mysql:8.0 service container and
      passes.

Verification:
- [ ] No Sentry-reported errors in the first 30 minutes.
- [ ] No regression in the 24-hour active-user count.
- [ ] All MEM ratchet rows in `pnpm ship:check` against the deployed SHA hold
      their ceilings (no slippage).

## Owners + escalation

| Phase | Primary owner | Secondary | Escalation |
|---|---|---|---|
| 1 — Pre-deploy verify | release engineer | DevOps | CTO |
| 2 — DB baseline | DBA | release engineer | CTO |
| 3 — S3 IaC | cloud admin | DevOps | CTO |
| 4 — AI provenance | ops + legal counsel | privacy DPO | CEO |
| 5 — GDPR sub-processors | privacy DPO | legal counsel | CEO |
| 6 — Legal placeholders | operator | privacy DPO | — |
| 7 — Post-deploy smoke | release engineer + QA | — | release engineer |

Escalation path: if any phase blocker can't be resolved in the deploy window,
**postpone the deploy**. The system is currently green at PR #495's merge
SHA on main (`0ff790a`); the audit-fix sprint that this runbook ships
alongside is non-destructive and does not require an emergency push.

## Out of scope of this runbook

- The actual prose of the legal text — that's the operator's review with
  counsel, separate from this runbook's mechanical steps.
- The `a11y.void_contrast_coverage` ratchet — needs the planned
  `scripts/audit-contrast.ts` headless-Chrome probe, not on the deploy
  critical path.
- Future audit-fix waves — this runbook covers the May 2026 sprint; the
  next sprint will have its own.
