# VO Coverage Audit (2026-04-28)

Inventory of every voice-over surface in the game, current coverage,
the canonical generator for each, and the exact local-run command
sequence to fill remaining gaps. Generated alongside this doc:
`scripts/_vo-audit.mjs` — a re-runnable coverage report.

## Why this lives here

The Claude Code Remote sandbox blocks egress to `api.elevenlabs.io`
(its proxy returns `HTTP 403 host_not_allowed` before requests leave).
That matches the warning in `apps/scripts/VO_GENERATION_README.md`:
*"Cloud sandboxes like Claude Code Remote cannot run this — use your
local machine."* The audit + idempotency patches in this branch are
the work that **can** be done from the sandbox; the actual ElevenLabs
calls have to happen on a host with open egress.

## Coverage table (post-patches)

`node scripts/_vo-audit.mjs` regenerates this:

| Surface              | Expected | In-manifest | Missing | Idempotent | Generator                                          |
| -------------------- | -------: | ----------: | ------: | :--------: | -------------------------------------------------- |
| agent_zero           |       23 |          23 |    **0** |  yes       | `python3 apps/scripts/generate_agent_zero_vo.py`   |
| antiquarian          |        8 |           8 |    **0** |  yes       | `python3 apps/scripts/generate_antiquarian_vo.py`  |
| cades                |       43 |          43 |    **0** |  yes       | `python3 apps/scripts/generate_cades_vo.py`        |
| degen                |       12 |          12 |    **0** |  yes       | `python3 apps/scripts/generate_degen_vo.py`        |
| elara (lines.json)   |      147 |         139 |    **8** |  yes       | `python3 apps/scripts/generate_elara_vo.py`        |
| human (lines.json)   |       69 |          63 |    **6** |  yes       | `python3 apps/scripts/generate_human_vo.py`        |
| locke                |        7 |           7 |    **0** |  yes       | `python3 apps/scripts/generate_locke_vo.py`        |
| meme                 |       87 |          87 |    **0** |  yes       | `python3 apps/scripts/generate_meme_vo.py`         |
| necromancer          |        3 |           3 |    **0** |  yes       | `python3 apps/scripts/generate_necromancer_vo.py`  |
| nilmorg              |       28 |          28 |    **0** |  yes       | `python3 apps/scripts/generate_nilmorg_vo.py`      |
| shadow_tongue        |        8 |           8 |    **0** |  yes       | `python3 apps/scripts/generate_shadow_tongue_vo.py`|
| source               |       27 |          27 |    **0** |  yes       | `python3 apps/scripts/generate_source_vo.py`       |
| story-mode           |       11 |          11 |    **0** |  yes       | `pnpm vo:story-mode`                                |
| chess-climb          |       41 |          21 |   **20** |  yes       | `pnpm tsx apps/scripts/generate-chess-climb-vo.ts` |
| act2                 |       28 |           0 |   **28** |  yes       | `pnpm vo:act2`                                      |
| act3                 |       79 |           0 |   **76** |  yes       | `pnpm vo:te-sync && pnpm vo:act3 --skip-todo`       |
| act4                 |        8 |           0 |    **8** |  yes       | `pnpm vo:act4`                                      |
| act5                 |       24 |           0 |   **24** |  yes       | `pnpm vo:act5`                                      |
| act6                 |       15 |           0 |   **15** |  yes       | `pnpm vo:act6`                                      |
| act7                 |       13 |           0 |   **13** |  yes       | `pnpm vo:act7`                                      |
| elaraLines.ts        |      210 |         210 |    **0** |  yes       | `pnpm vo:companion`                                 |
| humanLines.ts        |       49 |          49 |    **0** |  yes       | `pnpm vo:companion`                                 |
| Prelude (CSV)        |        6 |           6 |    **0** |  yes       | `pnpm vo:prelude`                                   |
| Act 1 Opponent (CSV) |      144 |         144 |    **0** |  yes       | `pnpm vo:act1`                                      |
| First Contact        |        7 |           6 |    **1** |  yes       | `pnpm vo:first-contact`                             |

**Total ElevenLabs calls needed:** 199 (28+76+8+24+15+13 acts + 20
chess-climb + 1 first-contact + 8+6 elara/human + 0 elsewhere).

### What's *expected* but **not yet authored** (no line source on disk)

The repo carries empty placeholder manifests for surfaces that don't
yet have a `*-lines.json` source. They're tracked here so the next
content pass knows what to author:

- `architectVoManifest.json` — wired by `useArchitectVO`, content-pass pending
- `eidolaVoManifest.json`, `collectorVoManifest.json`, `seerVoManifest.json`,
  `watcherVoManifest.json`, `warlordVoManifest.json`, `programmerVoManifest.json`,
  `matrikalaVoManifest.json`, `authorityVoManifest.json` — fighter/NPC stubs (3 lines each)
- `engineerMemoirVoManifest.json` (36 entries authored), `palimpsestHostVoManifest.json` (36),
  `gamemasterVoManifest.json` (24, plus 20 chess-climb pending), `princeVoManifest.json` (2)

These will round out as their content pipelines come online; not
blocking on this audit.

## What changed in this branch

1. **All 12 `apps/scripts/generate_*_vo.py` scripts patched** to be
   idempotent. Before the patch they did `manifest = {}` then
   re-generated every line, *clobbering* unrelated entries that
   accumulated from other generation paths (e.g. running
   `generate_elara_vo.py` would have destroyed 265 of the 412
   entries in `elaraVoManifest.json`).

   After the patch each Python generator:
   - loads any existing `<name>VoManifest.json` first
   - skips lines whose id is already a manifest key
   - flushes the manifest after every successful line (crash-safe)

   Patcher: `/tmp/aaa_assets/patch_python_vo.py` (one-shot). All 12
   scripts now carry a `# IDEMPOTENT_PATCH` marker so re-running the
   patcher is a no-op.

2. **Trade Empire voice IDs partially filled** in
   `apps/shared/tradeEmpireVoLines.ts`:
   - `the_antiquarian` → `yAKlvHIsuj4SvnKQ6Mk4`
   - `locke` → `8XiBWqS5ffaH5naIFHPI`

   Remaining `TODO_*` placeholders (orin_fell, the_architect,
   mol_garath) await producer voice assignment. `pnpm vo:te-sync`
   re-runs after this change cleanly. `pnpm vo:act3 --skip-todo`
   will now generate 76 of 79 act3 lines.

3. **Coverage report `scripts/_vo-audit.mjs`** added for repeat audits.

## Run plan (local — host with `api.elevenlabs.io` egress)

```bash
# 1. Required env
export ELEVENLABS_API_KEY=sk_...
export AWS_ACCESS_KEY_ID=AKIA...
export AWS_SECRET_ACCESS_KEY=...
# (Optional) export AWS_REGION=us-east-2  S3_BUCKET=dgrsvoices  (defaults)

cd <repo-root>
pnpm install          # if you haven't

# 2. Re-sync TE lines into act3 (no API calls)
pnpm vo:te-sync

# 3. Acts 2-7 spine — 164 lines (TE TODO ids skipped)
pnpm vo:act2
pnpm tsx apps/scripts/generate-act-vo.ts --act 3 --skip-todo
pnpm vo:act4
pnpm vo:act5
pnpm vo:act6
pnpm vo:act7

# 4. Companion + Prelude + Act 1 — currently 100% covered, but the
#    generators are idempotent so a re-run is a free coverage check
pnpm vo:companion
pnpm vo:prelude
pnpm vo:act1

# 5. First-contact (1 line: locke_first_contact)
pnpm vo:first-contact

# 6. Story mode (already 100%, no-op)
pnpm vo:story-mode

# 7. Chess-climb GameMaster (20 lines)
pnpm tsx apps/scripts/generate-chess-climb-vo.ts

# 8. Per-character Python — idempotent post-patch; 14 missing total
#    (8 elara_2 + 6 human_2). Other 10 are fully covered and will
#    no-op.
for char in elara human agent_zero antiquarian cades degen locke meme \
            necromancer nilmorg shadow_tongue source; do
  python3 apps/scripts/generate_${char}_vo.py
done

# 9. Re-audit
node scripts/_vo-audit.mjs
```

## ElevenLabs voice-id registry (consolidated)

Pulled from `VO_GENERATION_README.md`,
`generate-act-vo.ts SPEAKER_SETTINGS`, and the per-character python
scripts. Only listed once here; canonical sources remain authoritative.

| Speaker / preset           | ElevenLabs ID            |
| -------------------------- | ------------------------ |
| `elara` / EngineerZero     | `xMyNDrPFEtQN8iZtT7l2`   |
| `human` / TrenchCoat       | `oGbGJdgofRR8z0MxwI8L`   |
| `the_prince`               | `FLW8imgp50K85LICuLQs`   |
| `locke`                    | `8XiBWqS5ffaH5naIFHPI`   |
| `the_antiquarian`          | `yAKlvHIsuj4SvnKQ6Mk4`   |
| `agent_zero` / `vex_solene`| `F1waTCPWl7KpShIScYQs`   |
| `the_eyes`                 | `Fu4ULyfBJO8Rl5TwP0ZB`   |
| `narrator` / neutral       | `VgFgBh5TnWeBhCBvCJ1E`   |
| `iron_lion`                | `UFc00HkV4yTNA1eMW99e`   |
| `game_masters` (Left)      | `BCJrrrZvds7k3qzM9nXU`   |
| `game_master_right`        | `IPETV0e5tVE7Fjwi8XIC`   |
| `zephyr_9`                 | `KSh0G8kOAWOgMbf9FWEL`   |
| `kael_prisoner` / `the_source` | `4tTGaP2vBgPN3iYrFoxa` |
| `shadow_tongue`            | `14wGKUgRFDPSwtCQurbB`   |
| `thoughtborn`              | `dyc1L3GAWDC51vAN1Co9`   |
| `vex_solene` (act 5)       | `F1waTCPWl7KpShIScYQs`   |

## Hard blockers / open questions

1. **`orin_fell`, `the_architect`, `mol_garath` voice assignments**
   pending — 3 act3 TE lines (out of 79) skip on `--skip-todo`.

2. The python `generate_human_vo.py` references a `human-lines.json`
   that ships 69 ids; the manifest carries 212 entries (the extra 143
   came from the Companion + Act-1-opponent + Prelude generators).
   The 6 missing ids are act1-opening lines that the runner has never
   processed — the patched python generator will now fill them
   without disturbing the other 206. Same shape for elara (147 vs
   412 manifest entries; 8 missing).

3. `pendingVoLines.json` (antiquarian + elara) is currently empty —
   nothing is queued for production "we know we need to record this
   eventually" placeholder review.
