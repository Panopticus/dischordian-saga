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

## Resurrection cinematics (2026-05-20 producer drop, three dead Potentials)

The producer delivered three character death-and-rebirth cinematics that align with the canonical resurrected-Potentials trio in `apps/shared/dlcMysteries/resurrectionistCycleWalker.ts:46-48` *("He activated resurrection protocols so that all three dead Potentials (Wraith, Akai, Lycos) were resurrected.")*

| Cinematic id | CDN path | Trigger binding |
|---|---|---|
| `wraith_calder_syndicate_of_death` | `videos/cinematics/syndicate_of_death/syndicate-of-death.mp4` (172 MB) | `RESURRECTION_CINEMATIC_BY_NPC.wraith_calder` (`resurrectionProtocols.ts`) |
| `akai_shi_necromancers_lair` | `videos/cinematics/necromancers_lair/necromancers-lair.mp4` (330 MB) | `RESURRECTION_CINEMATIC_BY_NPC.akai_shi` |
| `wolf_planet_of_the_wolf` | `videos/cinematics/planet_of_the_wolf/planet-of-the-wolf.mp4` (406 MB) | `WOLF_CRUCIBLE_RESCUE_CINEMATIC` (`dlcMysteries/wolfAnaraHunt.ts`) |

**Runtime path:**
- For Wraith Calder / Akai Shi: server stamps `pending_resurrection_cinematic_<npcKey>` on the Resurrection Protocols quest transitioning to `completed_path_a` (player-completed, wired in `apps/server/routers/resurrection.ts:completePathA`) or `completed_path_b` (Necromancer-event auto-return — outcome contract exposes `pendingCinematicFlag`, persistence shim still owed). `ResurrectionCinematicRouter` (mounted in `App.tsx`) watches the flag, plays the MP4 once via `SingleVideoCutsceneOverlay`, then stamps `resurrection_cinematic_<npcKey>_seen` so it never replays.
- For Lycos / The Wolf: reanimation is canonically pre-game (Year 128,652 A.A.). The cinematic plays at the **release moment** — when the player commits the Wolf E5 `release_the_wolf` choice, pulling the lever on the Hellbox-shaped snow-globe that contains Lycos at the centre of the Hall of Disappearances. Narratively: Lycos is preserved-and-contained inside Anara / the Crucible (the Antiquarian's pocket universe where the League lives); the snow-globe is a Matrix-of-Dreams pocket realm with unknown time-dilation. Both Elara and the Human warn against release on the record (Wolf E5 `companion_warnings` clue); the player chooses anyway. The trigger flag is the per-choice `mystery_choice:arc.dlc.wolf_anara_hunt:wolf.anara_hunt.e5:wolf.e5.c.release_the_wolf` that `mysteryService` writes (apps/server/services/mysteryService.ts:349-381). The alternative `leave_him_contained` choice does NOT fire the cinematic and does NOT open Hunt-the-Hero. The router has a dedicated Wolf branch that watches the release flag and stamps `resurrection_cinematic_wolf_seen` on completion.

**Parity:** `narrative.resurrection_cinematic_coverage` ship-check entry (registry.ts), **5/5 PASS** — 3 cinematic-id bindings + Wolf trigger-flag canon match + Wolf release-choice-id existence on the arc's final episode (guards against arc renames, episode reorders, or choice-id renames silently breaking the cinematic trigger).

**Outstanding server-side wiring (Path B only):** the necromancer-cycle persistence shim that calls `batchResolvePathB` and writes the outcomes (quest store + transmission + reputation hit + `pendingCinematicFlag`) does not yet exist — `apps/shared/resurrectionPathB.ts` is a pure-function library with no callers. Path A is fully wired.

**Roadmap (out of scope for this PR):** The user's stated narrative arc — all three become full companions who can die again later, the heartbreaking second-death loop — needs three new companion-recruitment surfaces, bond tracks, and re-death beats. Captured in `docs/design/COMPANION_RESURRECTION_RECRUITMENT_ROADMAP.md`.

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
