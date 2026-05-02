# Playwright e2e

## Public flows

Run unconditionally — no auth needed:

```bash
pnpm test:e2e
```

Covers landing page, route registration, public-page smoke checks.

## Auth-gated flows

The `apps/e2e/global-setup.ts` mints a JWT pointing at a real DB user
when these env vars are present:

| Env var              | Purpose                                                       |
|----------------------|---------------------------------------------------------------|
| `JWT_SECRET`         | Same secret the server uses to sign sessions                  |
| `E2E_AUTH_OPEN_ID`   | Test user's `users.openId` (seeded via `pnpm seed:e2e-user`)  |
| `E2E_AUTH_NAME`      | Display name embedded in the JWT (default: `e2e`)             |
| `E2E_BASE_URL`       | Cookie scope (default: `http://localhost:3000`)               |

A `storageState.json` is written under `.auth/`; spec files check for
its presence and either run or skip auth-gated cases.

### Seed the test user once

```bash
DATABASE_URL="mysql://..." pnpm seed:e2e-user
```

Idempotent — re-running confirms the user exists. Defaults to
`openId="e2e-test-user"` if `E2E_AUTH_OPEN_ID` is unset.

### Run locally with auth

```bash
# 1. Start the dev server (uses your real DB).
pnpm dev &

# 2. Seed the test user once.
DATABASE_URL="$YOUR_DEV_DB_URL" pnpm seed:e2e-user

# 3. Run Playwright with auth env vars set.
JWT_SECRET="$YOUR_DEV_JWT_SECRET" \
  E2E_AUTH_OPEN_ID="e2e-test-user" \
  pnpm test:e2e
```

## CI

A dedicated `e2e` job in `.github/workflows/ci.yml` runs the full
auth-gated suite when:

- The repo variable `RUN_E2E` is set to `"true"` (Settings → Variables
  → Actions → Variables), OR
- The workflow is triggered manually via `workflow_dispatch`.

The job uses the repo secret `E2E_JWT_SECRET` if set; otherwise it
falls back to a non-prod CI-only constant. Set the secret in
Settings → Secrets → Actions → New repository secret if you want to
reuse a stable JWT across runs.

The job spins a fresh MySQL service, runs migrations, seeds the e2e
user, builds the app, starts `pnpm start` in the background, then
runs Playwright. Test failures upload the HTML report as a 7-day
artifact (`playwright-report`).

## Adding new auth-gated specs

```ts
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import { join } from "node:path";

const HAS_AUTH = existsSync(join(__dirname, ".auth", "storageState.json"));

test.describe("My new flow", () => {
  test.skip(!HAS_AUTH, "Set JWT_SECRET + E2E_AUTH_OPEN_ID to run");

  test("the auth-gated thing happens", async ({ page }) => {
    await page.goto("/some-protected-page");
    await expect(page.getByRole("heading")).toBeVisible();
  });
});
```

The `HAS_AUTH` gate keeps the spec passing locally for devs who
haven't set the env vars. CI sets them for the `e2e` job.
