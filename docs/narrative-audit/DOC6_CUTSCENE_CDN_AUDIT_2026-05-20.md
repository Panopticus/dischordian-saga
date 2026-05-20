# DOC6 — Cutscene CDN Audit (2026-05-20)

End-to-end audit of every cutscene registry against the actual contents of `s3://dgrsart/cdn/client-public/`. Method: imported each registry via tsx, emitted all 428 expected asset paths, HEAD-checked each against the CDN listing (12,649 objects).

## Result

| Registry | Declared | Wired to CDN | Missing |
|---|---:|---:|---:|
| `cutsceneRegistry.ts` (animated) | 10 cutscenes / 34 files | 6 cutscenes / 15 files | **4 cutscenes + 1 poster (18 files)** |
| `cinematicsManifest.ts` CINEMATICS | 14 / 53 files | 14 / 53 files | 0 |
| `cinematicsManifest.ts` VFX_CLIPS | 21 / 42 files | 21 / 42 files | 0 |
| `chapterIntroCutscenes.ts` | 21 / 21 | 21 / 21 (after fix) | 0 |
| `guildCutscenesManifest.ts` | 175 / 183 | 175 / 183 | 0 (Portal Chamber fallback by design) |
| `expansionCutscenes.data.ts` | 67 / 70 | 67 / 70 | 0 |
| `chessCutscenes.data.ts` | 25 / 25 | 25 / 25 | 0 |
| **Total** | **333 / 428** | **315 / 410** | **18** |

## Code fixes landed on this branch

1. **`chapterIntroCutscenes.ts:67`** — strip trailing `_BONUS` when building the MP4 filename. The registry id retains the suffix for variant disambiguation, but the producer-delivered files (`ch19_nilmorg_complete.mp4`, `ch20_conexus_complete.mp4`, `ch21_shadow_tongue_complete.mp4`) drop it. Before the fix, all three bonus chapter intros 404'd at runtime.

2. **`cutsceneRegistry.ts:230`** — add `shotFilenames` override for `cutscene_prestige_reset`. Producer delivered `shot_1.mp4`..`shot_4.mp4` (underscore between `shot` and the index); the default `shot<N>.mp4` convention missed them.

3. **`cinematicsManifest.ts:380-387`** — remove stale "keyframes pending" comment on `dreamer_visions`. All 3 keyframe webps now on CDN at the exact paths the manifest declares.

4. **`chapterIntroCutscenes.test.ts:21-23`** — updated URL-shape assertion to allow the `_BONUS`-stripping behavior introduced in fix #1.

## Outstanding producer asks (18 missing files)

These cutscenes are declared in the registry, have React components (`apps/client/src/components/cutscenes/*Cutscene.tsx`), are mounted via `CutsceneRouter`, but have **zero assets on the CDN**:

| Cutscene | Component | Files needed |
|---|---|---|
| `cutscene_first_human_contact` | `FirstHumanContactCutscene.tsx` | shot1.mp4, shot2.mp4, poster.webp |
| `cutscene_elara_memory_recovery` | `ElaraMemoryRecoveryCutscene.tsx` | shot1.mp4, shot2.mp4, shot3.mp4, shot4.mp4, poster.webp |
| `cutscene_breaking_point` | `BreakingPointCutscene.tsx` | shot1.mp4, shot2.mp4, shot3.mp4, shot4.mp4, shot5.mp4, poster.webp |
| `cutscene_thought_virus_manifests` | `ThoughtVirusManifestCutscene.tsx` | shot1.mp4, shot2.mp4, poster.webp |
| `cutscene_awakening` | `AwakeningCutscene.tsx` | poster.webp (3 shots already delivered) |

Specs:
- Animated cutscenes 2–5: see `docs/design/ANIMATED_CUTSCENES.md` for shot lists, `docs/production/CUTSCENE_SEEDANCE_PROMPTS.md` for Seedance v2 prompt specs.
- `lord_kanshi_sha_antiquarian` cinematic — delivered 2026-05-20, copied in-bucket from `Videos/Lord Kanshi Sha.mp4` to the manifest path `cdn/client-public/videos/cinematics/lord_kanshi_sha/lord-kanshi-sha.mp4` (46 MB, public, video/mp4).

## Outstanding writer ask

**`ch20_conexus_BONUS` gate flag** — the MP4 is now reachable (after fix #1), but the opener is still not registered in `BONUS_CHAPTER_INTRO_GATES` (`apps/shared/bonusChapterIntroTriggers.ts:69-75`). Candidate gates per source comment: Hierarchy DLC completion / Architect-leaning Act 6 close / Visible War cover. Writer to specify, then add the gate entry + flag setter + test in `apps/shared/__tests__/bonusChapterIntroRouter.test.ts`.

## Outstanding producer ask (Portal Chamber)

`guildCutscenesManifest.ts:288-293` currently routes `cs_signature_room_unlock_portal_chamber` to the generic `cs_room_unlock` MP4/stills. VO line `architect_portal_001.mp3` is recorded. Producer ask: deliver a dedicated `cs_portal_chamber.mp4` + `cs_portal_chamber_{start,end}.png` under `videos/guild-cutscenes/f5_guild_hall/` and `art/guild-cutscenes/f5_guild_hall/`, then swap the `bundleSlug` to `cs_portal_chamber`.

## Two-registry note for Act 6 confessions

Two parallel modules cover the Act 6 confession close — keep them distinct:

- **`apps/shared/confessionCloseCutscenes.ts`** is the video-playback registry (14 entries, `videoRelPath`). All 14 MP4s on CDN. Wired to `ConfessionCloseRouter` mounted in `App.tsx:896`. Fully shipped.
- **`apps/shared/act6ConfessionCinematics.ts`** is the in-page portrait-crossfade registry (14 entries with `crossfadeToExpression`, `crossfadeDurationMs`, `voId`). Schema-only ship; runtime consumer not yet built. The per-stance `voId` slots (`elara.act6.confession_close.<stance>.t1` × 14) reference voManifest entries that don't exist — audio is currently baked into the cinematic MP4s, so the voId field is vestigial until the portrait-crossfade layer ships.

## Verification

Re-run the parity check at any time:

```bash
# Dumps the 428 expected paths
npx tsx /tmp/dump-cutscene-paths.ts > /tmp/expected.txt

# Lists the CDN
aws s3 ls s3://dgrsart/cdn/client-public/ --recursive \
  | awk '{print $NF}' | sed 's|^cdn/client-public/||' \
  | sort -u > /tmp/cdn.txt

# Diff
comm -23 <(awk -F'|' '{print $4}' /tmp/expected.txt | sort -u) /tmp/cdn.txt
```
