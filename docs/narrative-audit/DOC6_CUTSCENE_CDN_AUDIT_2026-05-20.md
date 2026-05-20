# DOC6 — Cutscene CDN Audit (2026-05-20)

End-to-end audit of every cutscene registry against the actual contents of `s3://dgrsart/cdn/client-public/`. Method: imported each registry via tsx, emitted all 428 expected asset paths, HEAD-checked each against the CDN listing (12,649 objects).

## Result

| Registry | Declared | Wired to CDN | Missing |
|---|---:|---:|---:|
| `cutsceneRegistry.ts` (animated) | 10 cutscenes / 34 files | 10 cutscenes / 25 files | **9 dead MP4 paths (fallback PNGs cover the UX)** |
| `cinematicsManifest.ts` CINEMATICS | 14 / 53 files | 14 / 53 files | 0 |
| `cinematicsManifest.ts` VFX_CLIPS | 21 / 42 files | 21 / 42 files | 0 |
| `chapterIntroCutscenes.ts` | 21 / 21 | 21 / 21 (after fix) | 0 |
| `guildCutscenesManifest.ts` | 175 / 183 | 175 / 183 | 0 (Portal Chamber fallback by design) |
| `expansionCutscenes.data.ts` | 67 / 70 | 67 / 70 | 0 |
| `chessCutscenes.data.ts` | 25 / 25 | 25 / 25 | 0 |
| **Total** | **333 / 428** | **324 / 419** | **9** (all dead MP4 paths covered by fallback PNGs) |

## Code fixes landed on this branch

1. **`chapterIntroCutscenes.ts:67`** — strip trailing `_BONUS` when building the MP4 filename. The registry id retains the suffix for variant disambiguation, but the producer-delivered files (`ch19_nilmorg_complete.mp4`, `ch20_conexus_complete.mp4`, `ch21_shadow_tongue_complete.mp4`) drop it. Before the fix, all three bonus chapter intros 404'd at runtime.

2. **`cutsceneRegistry.ts:230`** — add `shotFilenames` override for `cutscene_prestige_reset`. Producer delivered `shot_1.mp4`..`shot_4.mp4` (underscore between `shot` and the index); the default `shot<N>.mp4` convention missed them.

3. **`cinematicsManifest.ts:380-387`** — remove stale "keyframes pending" comment on `dreamer_visions`. All 3 keyframe webps now on CDN at the exact paths the manifest declares.

4. **`chapterIntroCutscenes.test.ts:21-23`** — updated URL-shape assertion to allow the `_BONUS`-stripping behavior introduced in fix #1.

5. **`cutsceneRegistry.ts` `posterPath` for all 5 named cutscenes** — repointed at producer-delivered composite fallback PNGs under `art/cutscenes/animated/<id>/fallback.png`. The `AnimatedCutscenePlayer` already falls back to `posterPath` on MP4 load-error; the new fallback PNG + summary text + CONTINUE button now renders a coherent experience for the four cutscenes whose MP4 shots were never produced (and for awakening's reduced-motion path, which previously 404'd on its poster).

## 2026-05-20 producer drop — keyframe slideshow assets

Producer delivered `dischordian_cutscene_assets.zip` (264 MB, 46 PNGs) — a fundamental architectural shift from per-shot MP4s to a PixiJS keyframe slideshow. Contents staged on CDN under `cdn/client-public/art/cutscenes/animated/`:

- **Per-cutscene keyframes** (5 dirs × `keyframes/*.png`): 6 awakening shot-pair frames, 3 first-contact frames, 8 memory-recovery fragments, 5 breaking-point scenes, 4 thought-virus scenes
- **Per-cutscene fallback composites** (5 × `fallback.png`): full-frame reduced-motion stills used by the registry's `posterPath`
- **Shared assets** (`_shared/`): 8 textures, 5 particle sprite sheets (4×4 grids, 512×512/cell), 2 UI overlays (skip button, morality meter)
- Producer's CUTSCENE_ASSET_MANIFEST.md + REFERENCE_NOTES.md included alongside under `_shared/`

### Follow-up: PixiJS slideshow renderer

The current `AnimatedCutscenePlayer` is a `<video>` chain; it doesn't consume keyframes/particles. Today the keyframes ship to CDN but only the `fallback.png` per cutscene is actually rendered. Building the full keyframe-pair slideshow with Ken Burns crossfade + PixiJS particle layer + texture compositing is tracked as a future PR:

- Scope: 5 cutscenes × ~6 keyframes/each + shared shader/particle infrastructure
- Spec inputs: producer's `CUTSCENE_ASSET_MANIFEST.md` (per-shot beat descriptions + intended use of each texture/sprite), `docs/production/CUTSCENE_SEEDANCE_PROMPTS.md` (timing + motion notes)
- Suggested approach: new `SlideshowCutscenePlayer` component, registry gains an optional `keyframes: readonly KeyframePair[]` field, `AnimatedCutscenePlayer` dispatches based on which field is set
- Until then, the fallback poster is the shipping experience for these five beats

## Outstanding asset asks

- `lord_kanshi_sha_antiquarian` cinematic — **delivered 2026-05-20**, copied in-bucket from `Videos/Lord Kanshi Sha.mp4` to the manifest path `cdn/client-public/videos/cinematics/lord_kanshi_sha/lord-kanshi-sha.mp4` (46 MB, public, video/mp4).
- Five named animated cutscenes — **delivered 2026-05-20 as keyframe PNGs + fallback composites + particles** (see §"2026-05-20 producer drop" above). Fallback PNGs wired today; full slideshow renderer is the follow-up PR.

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
