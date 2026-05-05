# Act 1 Opponent Taunts — Pipeline Ops Handoff

Audit follow-up — closes the "Python taunts pipeline run" item from
the post-audit list (item #30). The pipeline (`apps/scripts/generate_act1_taunts_vo.py`)
is structurally validated in CI via `--dry-run` and ready to fire,
but generating the audio requires producer-only credentials.

## What's already done

- `apps/scripts/act1-taunts-lines.json` — 21 lines, 7 characters, 3 phases each.
- `apps/scripts/generate_act1_taunts_vo.py` — generator with real ElevenLabs voice IDs assigned per character, per-emotion preset table, idempotent S3 HEAD-check, manifest writes.
- `apps/scripts/generate_act1_taunts_vo.py --dry-run` — passes locally and in CI; reports "Would generate: 21/21".
- `apps/client/src/hooks/useAct1TauntsVO.ts` — merges per-character manifests; the `Act1OpponentTauntOverlay` calls `speak()` on phase change.
- 7 of 12 act-1 opponents in `apps/shared/act1OpponentDialog.ts` carry the `tauntVoIds` triple matching the JSON ids.

## What's blocked on ops

The script requires three secrets:

| Variable | Source | Used for |
|---|---|---|
| `ELEVENLABS_API_KEY` | ElevenLabs dashboard → API Keys | TTS generation |
| `AWS_ACCESS_KEY_ID` | AWS IAM (S3 PutObject on `dgrsvoices`) | Upload |
| `AWS_SECRET_ACCESS_KEY` | Same | Upload |

Plus two Python packages that are NOT in the CI test environment but are standard producer-side:

```bash
pip3 install boto3 requests
```

## Producer run

```bash
export ELEVENLABS_API_KEY=sk_...
export AWS_ACCESS_KEY_ID=AKIA...
export AWS_SECRET_ACCESS_KEY=...
# Optional: AWS_REGION (default us-east-2), S3_BUCKET (default dgrsvoices)

# Validate without API calls first
python3 apps/scripts/generate_act1_taunts_vo.py --dry-run

# Real run
python3 apps/scripts/generate_act1_taunts_vo.py
# OR via the package script (same thing):
pnpm vo:act1-taunts
```

Idempotent — already-uploaded lines are HEAD-checked and skipped. Safe to re-run after a partial outage.

## Verification

After the run completes, check that the per-character manifests have entries:

```bash
jq 'keys | length' apps/shared/collectorVoManifest.json apps/shared/watcherVoManifest.json apps/shared/eidolaVoManifest.json apps/shared/matrikalaVoManifest.json apps/shared/authorityVoManifest.json apps/shared/programmerVoManifest.json apps/shared/warlordVoManifest.json
```

Each should be ≥ 3 (the three taunts per character). The 7 characters × 3 lines = 21 manifest entries total.

After landing, commit the manifest changes:

```bash
git add apps/shared/*VoManifest.json
git commit -m "vo(act1): bake opponent taunts (21 cues across 7 characters)"
```

In-game flow (auto-wired post-deploy):

1. Player enters Act 1 Card Ladder.
2. Encounter against any of the 7 taunt-bearing opponents (Collector, Watcher, Professor Eidola, Professor Matrikala, The Authority, The Programmer, The Warlord-Zero-First).
3. `Act1OpponentTauntOverlay` reads `tauntVoIds` from the dialog table, calls `useAct1TauntsVO().speak(lineId)` on phase change.
4. The hook hits the merged-manifest URL → S3 → audio plays.

No client code change required after upload.

## Why this is ops-only

The CI environment intentionally has no ElevenLabs or AWS credentials — adding them would let CI burn budget on every push. The existing `--dry-run` mode validates structural correctness so regressions are caught without spending real API quota. Production runs are gated to producer machines that hold the secrets.

## Status

- **Pipeline ready**: ✓ (script + voice IDs + manifest plumbing all in place)
- **Run completed**: pending ops execution
