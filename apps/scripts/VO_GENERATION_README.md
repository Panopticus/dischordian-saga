# VO generation — local run recipe

Generates the missing Prelude + Act 1 voice lines via ElevenLabs TTS
and (optionally) uploads them to S3. Run from the repo root.

## Scope (what "missing" means)

**Prelude (6 lines total)** — covered by `vo:prelude`:

| Line id                   | Speaker     | Source CSV                                                   |
|---------------------------|-------------|--------------------------------------------------------------|
| `prince_beat_e_toy_soldier` | The Prince  | `docs/production/prelude-asset-build/prompts/voice/section_10_10.5.csv` |
| `antiq_fc_1`              | Antiquarian | `…/section_17_17.5.csv` |
| `elara_fc_1`              | Elara       | `…/section_3_fc.csv` |
| `elara_fc_2`              | Elara       | `…/section_3_fc.csv` |
| `elara_fc_3`              | Elara       | `…/section_3_fc.csv` |
| `elara_fc_4`              | Elara       | `…/section_3_fc.csv` |

The other 10 Prelude lines already have entries in their VoManifest
files and are skipped automatically.

**Act 1 (144 lines total)** — covered by `vo:act1`:

| CSV                                                   | Speaker     | Lines |
|-------------------------------------------------------|-------------|-------|
| `docs/production/vo-batches/act1-opponent-dialog__antiquarian.csv` | Antiquarian | 72    |
| `docs/production/vo-batches/act1-opponent-dialog__elara.csv`       | Elara       | 36    |
| `docs/production/vo-batches/act1-opponent-dialog__human.csv`       | Human       | 36    |

All three CSVs are regenerated from `apps/shared/act1OpponentDialog.ts`
via `pnpm vo:generate-csv`.

## Prereqs

- Node.js 18 or newer (`node --version`).
- `pnpm install` has been run at least once so `tsx` and
  `@aws-sdk/client-s3` are available.
- An ElevenLabs API key **without IP/host restrictions** (or with your
  current IP allowlisted). Cloud sandboxes like Claude Code Remote
  cannot run this — use your local machine.

## Commands

```bash
# ElevenLabs only (always required)
export ELEVENLABS_API_KEY="sk_..."

# Optional: upload mp3s to S3 and record CDN URLs in the manifests.
# If unset, the generator writes /audio/... paths into the manifests
# so the game can play the files in dev, and leaves S3 for later.
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_REGION="us-east-2"        # default
export S3_BUCKET="dgrsvoices"        # default

# Run everything in one shot:
pnpm vo:all

# Or in parts:
pnpm vo:prelude
pnpm vo:act1

# Smoke-test on a small slice before paying for the full 144:
bash apps/scripts/run-act1-opponent-vo.sh --only antiquarian --limit 3
```

Both runners are **idempotent** — a second run only generates lines
whose id is not already a key in the speaker's
`apps/shared/<speaker>VoManifest.json`. Safe to Ctrl+C and rerun;
partial progress is saved after each successful line.

## Outputs per run

- `apps/client/public/audio/<speaker>/<lineId>.mp3` — always written.
- `apps/shared/<speaker>VoManifest.json` — line id added as a key with
  either the full S3 URL (when AWS creds are present) or the
  dev-relative `/audio/<speaker>/<lineId>.mp3` path (when they aren't).

## ElevenLabs voice IDs used

Defined inline in `generate-prelude-vo.ts` and
`generate-act1-opponent-vo.ts`. Keep these in sync if you rotate voices.

| profile       | ElevenLabs id            |
|---------------|--------------------------|
| `elara`       | `xMyNDrPFEtQN8iZtT7l2` |
| `the_human` / `human` | `oGbGJdgofRR8z0MxwI8L` |
| `the_prince`  | `FLW8imgp50K85LICuLQs` |
| `locke`       | `8XiBWqS5ffaH5naIFHPI` |
| `the_antiquarian` / `antiquarian` | `yAKlvHIsuj4SvnKQ6Mk4` |

## Known failure modes

- **`403 Host not in allowlist`** — your ElevenLabs key has IP
  restrictions. Turn them off (or add your IP) in the ElevenLabs
  dashboard and rerun.
- **`429`** — rate limit. The generator pauses 30 s and continues.
- **S3 `AccessDenied`** — your AWS user can't `PutObject` on
  `s3://$S3_BUCKET/Prelude Voices/…` or `.../Act 1 Voices/…`. Fix the
  bucket policy or run local-only by unsetting the AWS vars.
