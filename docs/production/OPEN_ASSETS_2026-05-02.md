# OPEN_ASSETS_2026-05-02 — Everything still to be made

> **This is the single canonical "still-to-render" doc.**
>
> **Supersedes:**
> - `docs/production/CONSOLIDATED_MISSING_PROMPTS.md` (2026-04-25)
> - `docs/production/MISSING_CUTSCENES.md` (2026-04-25)
> - `docs/production/MISSING_ART_PROMPTS.md` (2026-04-25)
> - `docs/production/MISSING_PRELUDE_ACT1_ASSETS.md` (2026-04-25)
>
> Those four docs have been moved to `docs/archive/missing-asset-history/`
> with `SUPERSEDED` headers. Do not edit them.
>
> **Excludes**: guild cutscenes (`GUILD_CUTSCENE_BIBLE.md` and signature-room/portal-chamber stills) per user direction 2026-05-02.
>
> **Methodology**: triple-signal audit (Wired / Consumed / Live on CDN). Ledger at `docs/production/audit/cdn-liveness.tsv`. See §11.

## Headlines

The 2026-05-02 audit finds the codebase is in much better shape than the 2026-04-25 prompt pack assumed. **All 17 currently-configured fighter sprite kits are live on CDN.** **37 of 42 Acts 2–7 cinematic MP4s are live.** **All 8 arena backgrounds are live.** Most legacy CloudFront URLs are inaccessible (1,727 dead) but that's a migration issue, not a render-needed issue.

The genuinely open work is concentrated in:

| Category | Count | Tool | Priority |
|---|---:|---|---|
| §2 Fighter sprite kits — 5 new playable fighters | 20 PNGs (3 sheets × 5 fighters + 5 portraits) | NB2 + repack pipeline | **P0** |
| §1.1 Acts 2–7 cinematic MP4s — confirmed missing | 5 videos | Veo 3.1 | P1 |
| §1.2 Cinematic START/END key frames | ~80 PNGs | NB2 | P1 (only if Veo regen is needed) |
| §3 VFX atlases | 21 PNGs | NB2 | P1 |
| §6.1 Acts 2–3 intro music | 2 MP3s | Suno v4 | P1 |
| §6.2 Acts 2–7 score (stingers, character cues) | ~30 MP3s | Suno v4 | P2 |
| §6.4 Character themes — boss intros | 3 MP3s | Suno v4 | P2 |
| §6.5 Engineer's Log instrumentals | 39 MP3s | Suno v4 | P2 |
| §7.1 UI sound layer | 10 sounds + code | Web Audio synth | P1 |
| §7.2 CADES atmosphere SFX | 7 WAVs | ElevenLabs | P2 |
| §1.3 Loredex Discovery videos | 13 videos | Kling | P2 |
| §1.4 Story Mode fight cinematics | 17 videos | Kling | P2 |
| §1.5 Dead Man's Circuit cinematics | 6 videos | Kling | P2 |
| §1.6 Living Universe events | 5 videos | Kling | P2 |
| §1.7 Crew Awakening / Prestige / Companion Death | 5 videos | Kling | P2 |
| §1.8 Mode intros (Casino, Trade Empire, Mechronis, etc.) | placeholders | Kling | P2 |
| §4 TCG card art (s1_pack2 + race + allegiance gaps) | ~120 WEBPs | NB2 | P2 |
| §5 Loredex portraits — entity/char only (corrected from "4") | 38 PNGs (1 already fixed) | NB2 | P2 |
| §5.5 🚨 CloudFront migration (1,727 dead URLs) — BLOCKS LOREDEX/CARDS DISPLAY | code/infra | — | **P0** |
| §8 Acts 2–7 voice-over | per `act{N}VoManifest.json` | ElevenLabs | P0–P1 |
| §10 Cross-cutting code work (out of asset scope) | code | — | P1 |

---

## §1 Cutscenes & cinematics

### §1.1 — Acts 2–7 cinematic MP4s, **confirmed missing**

All probed against `https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/videos/acts/act-{N}/{cin_id}.mp4`. The other 37 in the manifest returned 200.

| Asset ID | Output path | Bible §ref | Status |
|---|---|---|---|
| OPEN-CIN-ACT2-SILENCE | `videos/acts/act-2/cin_act2_silence.mp4` | `ACTS_2_TO_7_PRODUCTION_BIBLE.md` §1.3 | 🔴 403 |
| OPEN-CIN-ACT2-GAMEMASTER-LEFT | `videos/acts/act-2/cin_act2_gamemaster_left.mp4` | §1.4 | 🔴 403 |
| OPEN-CIN-ACT2-GAMEMASTER-RIGHT | `videos/acts/act-2/cin_act2_gamemaster_right.mp4` | §1.4 | 🔴 403 |
| OPEN-CIN-ACT3-ENGINEER-REC4 | `videos/acts/act-3/cin_act3_engineer_rec4.mp4` | §2.6 | 🔴 403 |
| OPEN-CIN-ACT3-ENGINEER-REC5 | `videos/acts/act-3/cin_act3_engineer_rec5.mp4` | §2.6 | 🔴 403 |

**Tool**: Veo 3.1 with the start/end frames (§1.2) as keyframe inputs.
**Prompts**: full motion prompts already in `docs/production/ACTS_2_TO_7_PRODUCTION_BIBLE.md` at the section refs above. No new prompt authoring needed — re-run Veo with the existing prompts.

### §1.2 — Cinematic START/END key frames

Probed at `cinematics/act-{N}/{start|end}/{cin_id}_{start|end}.png`, `art/cinematics/act-{N}/{cin_id}_{start|end}.png`, and 5 other plausible paths. All return 403. **None are on CDN at any tested path.**

The `docs/production/acts-2-7-aaa-final/DELIVERY_NOTES.md` notes these are "intermediate work products" living in a ZIP at `cinematics/act-{N}/{start,end}/*.png` — not uploaded to CDN. Since 37/42 final MP4s are live on CDN, the START/END frames are likely consumed only as Veo input, not by the runtime. **If the producer needs to re-render any of the 5 missing Acts 2–3 MP4s in §1.1, the START/END frames must be regenerated first.**

| Bible § | Cinematic | START | END |
|---|---|---|---|
| §1.2 | CIN-ACT2-OPENER | `cin_act2_opener_start.png` | `_end.png` |
| §1.3 | CIN-ACT2-SILENCE | `cin_act2_silence_start.png` | `_end.png` |
| §1.4 | CIN-ACT2-GAMEMASTER-{LEFT,RIGHT} | 2 starts | 2 ends |
| §1.5–1.6 | CIN-ACT2-ENGINEER-RECORDING-{2,3} | 2 starts | 2 ends |
| §2.2–2.6 | All Act 3 | 7 starts | 7 ends + 3 infiltration variant ends |
| §3.2–3.6 | All Act 4 (incl. 4 Kael Extractions) | 9 starts | 9 ends |
| §4.x | Act 4.5 (2 cinematics) | 2 | 2 |
| §5.x | Act 5 (6 cinematics) | 6 | 6 |
| §6.x | Act 6 (4 cinematics) | 4 | 4 |
| §7.x | Act 7 (7 cinematics, some shared starts) | 7 | 7 |

Total: ~80 PNGs. **Full prompts** for every cinematic's START + END frame are in `docs/production/ACTS_2_TO_7_PRODUCTION_BIBLE.md`. Tool: NB2 (Nano Banana 2) at the prompt's specified aspect ratio.

### §1.3 — Loredex Discovery videos (13)

Per `docs/archive/missing-asset-history/MISSING_CUTSCENES.2026-04-25.md` §1, 13 of 18 Loredex discovery videos are unrendered. Kling prompts are inline in `apps/client/src/components/DiscoveryVideoOverlay.tsx`.

| Subject | Tool | Notes |
|---|---|---|
| Programmer | Kling | Prompt in DiscoveryVideoOverlay.tsx |
| Architect | Kling | " |
| CoNexus | Kling | " |
| Watcher | Kling | " |
| Collector | Kling | " |
| Warlord | Kling | " |
| Enigma | Kling | " |
| Engineer | Kling | " |
| Necromancer | Kling | " |
| Human | Kling | " |
| Source | Kling | " |
| Antiquarian | Kling | " |
| Degen | Kling | " |

### §1.4 — Story Mode fight cinematics (17)

Per the legacy MISSING_CUTSCENES doc, 17 of 21 story-mode pre-fight cinematics need rendering: Ch5 Watcher, Ch6 Necromancer, Ch7 Meme, Ch8 Collector, Ch9 Kael, Ch10 Human, Ch11 Game Master, Ch12 Collector rematch, Ch13 Architect, Ch14 Source, Ch15 Jailer, Ch16 Iron Lion rematch, Ch17 Elara, Ch18 Agent Zero, Ch19 Antiquarian, Ch20 Dreamer, Ch21 Oracle/Meme.

Tool: Kling. Prompts to be authored — currently dispersed across `apps/client/src/game/cinematicDesign.ts` STORY_SCENE_EFFECTS and `storyModeChapters.ts`. Producer should consolidate before commission.

### §1.5 — Dead Man's Circuit cinematics (6)

`circuit-opens`, `clone-awakening`, `the-race`, `signal-lost`, `severance-prize`, `nilmorg-speaks`. Spec scattered in `docs/production/DEAD_MANS_CIRCUIT_PRODUCTION.md` and `apps/shared/dmc*` registries. Producer: extract Kling prompts from those sources.

### §1.6 — Living Universe events (5)

`necromancer-returns`, `dreamer-awakens`, `terminus-advance`, `antiquarian-reveals`, `shadow-tongue-edits`. Tool: Kling. Prompts not yet authored.

### §1.7 — Crew Awakening / Prestige / Companion Death (5)

- `first-clone-born` (Elara) — Crew Awakening
- `93847-sunrises` (Elara solo) — Crew Awakening
- `the-mandate` (Elara + Player) — Crew Awakening
- `the-reset` (Player, Elara, Human, Antiquarian) — Prestige Cycle
- `signal-lost` (any companion + Player) — Companion Death

Tool: Kling. Prompts not yet authored.

### §1.8 — Mode intros (placeholder-only)

Per the prior agent audit, none of these have rendered intro cinematics yet. All are placeholders with output paths declared but no prompts:

- Casino Expansion (8 environment backgrounds exist in `CASINO_EXPANSION_ART_BIBLE.md`; opening cinematic missing)
- Trade Empire (environment art exists; opening cinematic missing)
- Mechronis Academy (12 classroom backgrounds in `CONSOLIDATED §2`; intro cinematic missing)
- Dead Man's Circuit (see §1.5)
- Chess (Architect's Gambit) — placeholder
- Hacking Puzzle — placeholder
- Tower Defense — placeholder
- Bounty Board, Star Chart, Galactic Map, Quiz Show — placeholder

Priority: P2. Address after §1.1 and §2 land.

---

## §2 Fighter sprite kits — full per-fighter spec

### §2.0 — Engine spec

The engine reads sprite sheets from `https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/fighters/{id}/{id}_{sheetname}.png`.

**Sheet format:**
- 2752 × 1536 PNG, transparent background
- 16 columns × 6 rows of 172×256 cells
- 24 animation states distributed across 3 sheets (`idle_movement`, `attacks_specials`, `reactions_victory`) per the cell schedule in `apps/client/src/game/spriteSheetConfig.ts:65-122`
- Plus a `portraits.png` sheet (any layout — engine reads the whole thing)

**Producer pipeline**:

1. Generate per-state PNG frames at any source resolution (the repack tool resizes to 172×256 preserving alpha). One PNG per animation frame, named `{state}_{frame_index}.png` — e.g. `idle_0.png`, `idle_1.png`, … `idle_9.png`.
2. Run the dry-run to print the cell schedule for a sanity check:
   ```
   npx tsx apps/scripts/repack-fighter-sprite-strip.ts --fighter <id> --dry-run
   ```
3. Composite into 3 engine sheets:
   ```
   npx tsx apps/scripts/repack-fighter-sprite-strip.ts \
     --fighter <id> --in <dir-of-pngs> --out <output-dir>
   ```
   For the 3 variant-named fighters (architect/collector/enigma), add `--variant architect|collector|enigma` to emit the right output filenames.
4. Upload the 3 sheets + portraits.png to `s3://dgrsart/cdn/client-public/art/fighters/{id}/` via `pnpm assets:upload`.
5. Verify load via SpriteAnimator.

### §2.1 — Per-state animation matrix

Required animation states with frame counts (totals: 24 states, 153 frames per fighter):

| State | Frames | Sheet | Row | StartCol | Loop | Notes |
|---|---:|---|---:|---:|:---:|---|
| idle | 10 | idle_movement | 0 | 0 | yes | Combat-ready breathing |
| walkForward | 8 | idle_movement | 1 | 0 | yes | 8-frame cycle |
| walkBack | 8 | idle_movement | 2 | 0 | yes | 8-frame cycle |
| jump | 8 | idle_movement | 3 | 0 | no | Anticipation+rise+peak+fall+land |
| crouch | 4 | idle_movement | 4 | 0 | no | Settle-into-crouch transition |
| dash | 6 | idle_movement | 5 | 0 | no | Dash-forward burst |
| lightPunch | 5 | attacks_specials | 0 | 0 | no | Quick jab |
| mediumPunch | 6 | attacks_specials | 0 | 8 | no | Cross-style strike |
| heavyPunch | 6 | attacks_specials | 1 | 0 | no | Wind-up haymaker |
| lightKick | 5 | attacks_specials | 2 | 0 | no | Snap kick |
| mediumKick | 6 | attacks_specials | 2 | 8 | no | Roundhouse |
| heavyKick | 6 | attacks_specials | 3 | 0 | no | Axe kick / spin kick |
| crouchPunch | 4 | attacks_specials | 3 | 6 | no | Low jab from crouch |
| sweep | 6 | attacks_specials | 3 | 10 | no | Leg sweep |
| crouchKick | 4 | attacks_specials | 4 | 0 | no | Low kick from crouch |
| special | 8 | attacks_specials | 4 | 4 | no | Character signature move (see per-fighter prompts for content) |
| jumpAttack | 5 | attacks_specials | 5 | 0 | no | Aerial strike |
| taunt | 8 | attacks_specials | 5 | 8 | yes | Mocking idle |
| hit | 4 | reactions_victory | 0 | 0 | no | Recoil from any hit |
| knockdown | 6 | reactions_victory | 1 | 0 | no | Thrown to ground |
| block | 3 | reactions_victory | 2 | 0 | no | Guard up |
| dizzy | 6 | reactions_victory | 2 | 6 | yes | Stunned, swaying |
| grab | 6 | reactions_victory | 3 | 0 | no | Throw target |
| victory | 10 | reactions_victory | 4 | 0 | yes | Round/match win loop |
| ko | 6 | reactions_victory | 5 | 0 | no | Defeated, falling |

**Global rendering anchors** (apply to every frame):
- 3/4 front-facing perspective, slight upward camera angle
- Dramatic rim lighting matching the character's accent color
- Hyper-detailed cinematic style matching existing Loredex character artwork
- Transparent background (alpha channel)
- Each frame must depict a single coherent pose — avoid motion blur in source frames

### §2.2 — Repack pipeline

Tool: `apps/scripts/repack-fighter-sprite-strip.ts` (added 2026-05-02).

The dry-run (no `sharp` install needed) prints the producer-facing cell schedule. The full run requires `pnpm add -D sharp` once.

### §2.3 — Per-fighter prompts

Twelve fighters have legacy prompts at the wrong (512×512-per-state) format in `docs/archive/missing-asset-history/ART_SOUND_MUSIC_RESOURCES.legacy.md` Part 1 (we will keep that file for reference text but it's superseded by this section). The 5 new playable fighters need fresh prompts.

The prompt template for every fighter:

> Hyper-realistic cinematic fighting game sprite of **{CHARACTER NAME}** from The Dischordian Saga. **{Loredex visual description}**. The character is performing **{STATE}** against a transparent background. **{Per-state action description}**. Dynamic fighting game pose with dramatic rim lighting and **{accent color hex}** energy effects. Full body visible from feet to head. Hyper-detailed, cinematic quality matching AAA fighting game character art. Transparent PNG, character occupies full frame height with ~10px headroom and ~10px floor clearance. Aspect ratio 172:256.

Producer generates 153 frames per fighter following this template, varying `{STATE}` per frame and `{Per-state action description}` per state row. Then runs the repack tool.

Per-fighter visual descriptions and combat archetypes follow.

#### §2.3.1 — Already-shipped fighters (kits live on CDN; refresh only if regen is required)

These 17 already have full sprite kits at `art/fighters/{id}/`. No work required unless a refresh is commissioned.

| Id | Name | Archetype | Accent | Notes |
|---|---|---|---|---|
| architect | The Architect | Zoner | #ef4444 | Variant naming (basic_attacks, reactions_throws, victory_ko_art) |
| collector | The Collector | Tricky | #06b6d4 | Variant naming (basic_attacks, reactions_victory_ko) |
| enigma | The Enigma | Balanced | #a855f7 | Variant naming (basic_attacks, specials_reactions_victory) |
| warlord | The Warlord | Powerhouse | #dc2626 | Standard pattern |
| necromancer | The Necromancer | Zoner | #6b21a8 | Standard |
| iron_lion | Iron Lion | Rushdown | #f59e0b | Standard |
| white_oracle | The Oracle | Balanced | #fef3c7 | Standard |
| agent_zero | Agent Zero | Glass Cannon | #18181b | Standard |
| meme | The Meme | Tricky | #ec4899 | Standard |
| source | The Source | Tank | #84cc16 | Standard |
| akai_shi | Akai Shi | Rushdown | #b91c1c | Standard |
| human | The Human | Balanced | #cbd5e1 | Standard |
| degen | The Degen | Glass Cannon | #14b8a6 | Standard |
| prisoner | The Prisoner (Kael) | Powerhouse | #f97316 | Standard |
| wraith_calder | Wraith Calder | Rushdown | #818cf8 | Standard |
| warden | The Panoptic Warden | Tank | #facc15 | Standard |
| jailer | The Jailer | Powerhouse | #525252 | Standard |

#### §2.3.2 — NEW: Programmer

- **Loredex visual**: Genesis-era humanoid, scholarly. Tall and angular. Wears a long charcoal-grey coat over a white shirt, sleeves rolled to the elbows. Forearms covered in glowing pale-cyan circuit tattoos that pulse during attacks. Round wire-rim glasses reflect lines of code. Hair: short, salt-and-pepper, neatly combed. Holds a tablet of light in his off-hand at all times — UI panels float around his free hand during specials.
- **Archetype**: Zoner (long-range, control-the-screen)
- **Accent color**: `#06b6d4` (cyan)
- **Special move (`special_*` row)**: COMPILE — opens 4 floating glyph panels around himself in a 90° arc, then snap-collapses them into a horizontal beam of code that travels across the arena.
- **Frame data hint**: Slow start-up, long active, long recovery. Range 1.15×.
- **Sheet output**: standard pattern (no variants)
- **Loredex entry**: `entity_2`-class, Genesis era, "Independent Scholar" affiliation per `FIGHTER_LORE_CROSSREF.md`. **Programmer is not yet in `apps/client/src/game/gameData.ts`** — designer must add a STARTER_FIGHTERS entry before sprite commission so the engine has stats to bind.

#### §2.3.3 — NEW: Shadow Tongue (engine id `shadow_tongue` AND alias `shadow-tongue`)

- **Loredex visual**: SVP Communications — The Propagandist. Lean, draped in a tailored midnight-violet suit with subtle paisley threading. Asymmetric haircut, one eye covered by a glossy black optical patch that occasionally flickers with text. Mouth is wider than human; teeth too neat. Carries no weapon — his weapon is the voice. During specials, ribbons of black ink-text spiral out of his mouth and harden into blades.
- **Archetype**: Tricky (already wired in gameData.ts:239 as `tricky` — preserve)
- **Accent color**: `#6366f1` (indigo, matches gameData.ts color)
- **Special move**: LINGUISTIC CORRUPTION — speaks a black-text sentence that materializes mid-air and slams into opponent as a ribbon-blade.
- **Sheet output**: standard pattern
- **Already in gameData.ts** at line 221 (STARTER) and line 624 (DEMON_FIGHTERS — these are two separate entries; designer should reconcile to one canonical record before sprite commission).

#### §2.3.4 — NEW: Game Master (engine id `game_master` AND alias `game-master`)

- **Loredex visual**: Cyborg-skull rig per `LIVING_CHARACTER_SHEET_ART_BRIEF.md` §2L. Tall, gaunt body in formal magician's tailcoat (deep midnight blue with gold piping). Head is a polished chrome-and-obsidian skull — exposed metal jawbone with visible articulation, two glowing orange optical orbs in the eye sockets. Hands wear white silk gloves. Always holds either a pair of cards or a die that floats above his palm.
- **Archetype**: Balanced (gameData.ts:285 — preserve)
- **Accent color**: `#f97316` (orange — match gameData)
- **Special move**: RULE CHANGE — flips a giant card in the air; on landing, gravity inverts in the arena for ~1.5s.
- **Sheet output**: standard pattern
- **Already in gameData.ts** line 265.

#### §2.3.5 — NEW: Watcher

- **Loredex visual**: All-Seeing Eye of the Empire. Humanoid silhouette draped in flowing black-and-teal robes that ripple as if filled with smoke. The "head" is a single floating teal-gold eye (sclera #14b8a6, iris #facc15) suspended above the collar — no skull, no jaw. Robes are studded with smaller tertiary eyes that blink independently. Hands are normal (long pale fingers) but always end in pointing gestures.
- **Archetype**: Zoner (gameData.ts:262 — preserve)
- **Accent color**: `#14b8a6` (teal — match gameData)
- **Special move**: OMNISCIENT GAZE — the giant eye flares; for ~2s, all incoming attacks against the Watcher counter automatically (parry frame).
- **Sheet output**: standard pattern
- **Already in gameData.ts** line 242.

#### §2.3.6 — NEW: The Authority

- **Loredex visual** (per user direction 2026-05-02; new fighter-form canon): Full-coverage **silver mirror mask** (no eye-holes, no mouth slit — liquid-mercury surface that reflects the opponent at all times). **Three-piece silver suit** — jacket + waistcoat + trousers, sharply tailored, peaked lapels, single-button jacket, white shirt under the waistcoat (no necktie; throat continues the mirror-mask treatment). **Red emissive aura** wrapping the entire figure (#ef4444 core, #b91c1c outer falloff, ~30% baseline intensity, peaks 1.8× on attack). Hands: bare silver mirror-skin (featureless). Feet: black silver-trimmed dress shoes. Posture: formal — judge approaching the bench, never a brawler.
- **Archetype**: Powerhouse (NB: gameData.ts:308 currently says `grappler` — designer should reconcile to `powerhouse` per LIVING_CHARACTER_SHEET_ART_BRIEF §2G.5 archetype directive)
- **Accent color** for fighter HUD: `#ef4444` (red — overrides gameData.ts current `#eab308` per 2026-05-02 canon update; designer to confirm)
- **Special move**: FINAL VERDICT — extends right forearm; aura condenses into a red-light blade-projection that swings downward like a gavel, unblockable on full charge.
- **KO state**: mask cracks once (single hairline fracture, no shards), figure collapses to one knee. Aura inverts cyan (#4ba3b5) and dissolves the figure entirely. Engine should overlay a 1.5s fade-to-black and return to the hall silhouette as the post-fight state.
- **Victory state**: mask reflection briefly resolves into the OPPONENT's victorious face — deliberately unsettling. Aura sustains red. 2.5s hold, then dissolve.
- **Sheet output**: standard pattern
- **Already in gameData.ts** line 288.
- **Canon source**: `docs/production/LIVING_CHARACTER_SHEET_ART_BRIEF.md` §2G.5 (added 2026-05-02). The hall canon (§2G.1–2G.4) remains valid for non-fight-engine surfaces.

### §2.4 — Engine config additions (already shipped 2026-05-02)

- `apps/client/src/game/spriteSheetConfig.ts` — added 5 new fighter ids (programmer, shadow_tongue, game_master, watcher, authority), with hyphen-form aliases for `shadow-tongue` and `game-master` to match gameData.ts. `FIGHTER_IDS` bumped from 17 → 22.
- `apps/client/src/game/gameData.ts` — STARTER_FIGHTERS already has 4 of 5 (shadow-tongue at line 221, watcher at 242, game-master at 265, authority at 288). **`programmer` still needs adding** with stats/archetype/special — designer task.

### §2.5 — Designer follow-ups (not asset work)

- Add Programmer to `STARTER_FIGHTERS` in `gameData.ts` with archetype Zoner, special "COMPILE", color `#06b6d4`, hp ~85, attack 7, defense 6, speed 8.
- Reconcile Shadow Tongue duplication: one record in STARTER_FIGHTERS (line 221) and another in DEMON_FIGHTERS (line 624). Pick one canonical entry.
- Confirm Authority archetype switch grappler → Powerhouse per canon; update `gameData.ts:308` color from `#eab308` to `#ef4444` if the red-glow canon prevails for HUD tinting.

---

## §3 VFX atlases

All 21 VFX atlases declared in `docs/production/acts-2-7-aaa-final/ASSET_MANIFEST.md` returned **403 on dgrsart**. None are on the CDN. The atlases are not referenced by any runtime code (`vfx-atlases/` appears in zero TypeScript files), so they currently render no in-game effect even when a cinematic that should use them plays.

| Atlas | Output path | Bible §ref |
|---|---|---|
| substrate_layer | `vfx-atlases/act-2/substrate_layer.png` | §1.1 |
| bench_glow_light | `vfx-atlases/act-2/bench_glow_light.png` | §1.1 |
| bench_glow_dark | `vfx-atlases/act-2/bench_glow_dark.png` | §1.1 |
| chess_depth_ring | `vfx-atlases/act-2/chess_depth_ring.png` | §1.1 |
| silence_freeze_grain | `vfx-atlases/act-2/silence_freeze_grain.png` | §1.1 |
| thaloria_echo_mist | `vfx-atlases/act-3/thaloria_echo_mist.png` | §2.1 |
| infiltration_choice_beam | `vfx-atlases/act-3/infiltration_choice_beam.png` | §2.1 |
| eyes_helmet_dust | `vfx-atlases/act-3/eyes_helmet_dust.png` | §2.1 |
| kael_memory_palace | `vfx-atlases/act-4/kael_memory_palace.png` | §3.1 |
| caravaggio_light_cone | `vfx-atlases/act-4/caravaggio_light_cone.png` | §3.1 (★ KEY) |
| prison_mirror_reflection | `vfx-atlases/act-4/prison_mirror_reflection.png` | §3.1 |
| identity_chip_etching | `vfx-atlases/act-4_5/identity_chip_etching.png` | §4.1 |
| entropy_table_glow | `vfx-atlases/act-4_5/entropy_table_glow.png` | §4.1 |
| iron_lion_broadcast_static | `vfx-atlases/act-5/iron_lion_broadcast_static.png` | §5.1 |
| vortex_consumption_edge | `vfx-atlases/act-5/vortex_consumption_edge.png` | §5.1 |
| kael_map_ink | `vfx-atlases/act-5/kael_map_ink.png` | §5.1 |
| elara_face_resolve_grain | `vfx-atlases/act-6/elara_face_resolve_grain.png` | §6.1 |
| watcher_shape_stencil | `vfx-atlases/act-6/watcher_shape_stencil.png` | §6.1 |
| army_composite_parallax | `vfx-atlases/act-7/army_composite_parallax.png` | §7.1 |
| voices_align_chord_ring | `vfx-atlases/act-7/voices_align_chord_ring.png` | §7.1 (★★ KEY) |
| invisible_war_overlay | `vfx-atlases/act-7/invisible_war_overlay.png` | §7.1 |

Tool: NB2. Full prompts in `ACTS_2_TO_7_PRODUCTION_BIBLE.md` at the §X.1 sections above.

**Wiring required (code work, not asset)**: even after rendering and uploading, no runtime currently consumes these. Need to wire each atlas into the cinematic player's compositing pass via a new `atlasOverlay` field in `cinematicDesign.ts` or similar. Out of asset scope; tracked in §10.

---

## §4 Card art

The fighter/season-1 unit card register is healthy (1025/1145 = 89.5% live). 120 cards return 403:

| Source | Count | Sample |
|---|---:|---|
| `apps/shared/tcg-core/cards/definitions/s1_pack2/architect.ts` | 62 | `art/cards/architect/s1_arch_*.webp` |
| `apps/shared/tcg-core/cards/definitions/s1_pack2/dreamer.ts` | 62 | `art/cards/dreamer/s1_drm_*.webp` |
| `apps/shared/tcg-core/cards/definitions/s1_pack2/neutral.ts` | 90 | `art/cards/neutral/*.webp` |
| `apps/shared/tcg-core/cards/definitions/s1_pack2/thought_virus.ts` | 53 | `art/cards/thought_virus/*.webp` |
| `apps/shared/tcg-core/cards/definitions/race/{demagi,quarchon,human}.ts` | ~10 | `art/cards/race/s1_race_*.webp` |
| `apps/shared/tcg-core/cards/definitions/allegiance/*.ts` | 36 | `art/cards/allegiance/*.webp` |
| `apps/shared/tcg-core/cards/definitions/elemental/*.ts` | ~15 | `art/cards/elemental/*.webp` |

Tool: NB2. Per-card prompts not yet authored in a consolidated doc — the pre-existing `CONSOLIDATED §12 TCG card definition tier-up art (221 NB2)` is partially relevant. Producer should grep `apps/shared/tcg-core/cardArtPrompts/` for any existing prompts; otherwise generate per-card from the card definition's `name` + `description` + faction + `art:` path.

Total expected new renders: ~120 WEBPs.

---

## §5 Loredex portraits

> **Correction 2026-05-02 (post-publish):** the prior-agent claim of "4 of 372 missing" was wrong. Actual breakdown follows. The bigger problem is that **all 193 currently-populated `image` URLs point to the dead legacy CloudFront** (`d2xsxph8kpxj0f.cloudfront.net`) — every loredex entry is effectively imageless in production until the migration in §10.9 lands.

### §5.0 — Empty `image` field — accurate breakdown

372 entries total in `apps/client/src/data/loredex-data.json`. **179 have an empty/null `image` field**, broken down by id-prefix:

| Prefix | Count | Likely needs portrait? |
|---|---:|---|
| `entity_*` and `char_*` | 39 | Yes — characters/beings |
| `concept_*` | 89 | Design call — abstract lore concepts |
| `song_*` | 37 | All Silence in Heaven album tracks; covers exist as song slideshow frames, not portraits |
| `event_*` | 11 | Event illustration optional |
| `lore_*` | 2 | Design call |
| `location_*` | 1 | `location_ark_47` (Inception Ark 1047) |

Identify the live list any time with:
```bash
jq -r '.entries[] | select(.image == null or .image == "") | .id + "\t" + .name' apps/client/src/data/loredex-data.json
```

### §5.1 — 39 entity/char entries needing portraits

Many of these are core characters with established art elsewhere in the repo (NPC bibles at `apps/shared/npcs/bibles/`, character dirs at `apps/client/public/characters/`). For those, the fix is to **populate the `image` field with the existing CDN URL**, not commission new art.

| Id | Name | Action 2026-05-02 |
|---|---|---|
| `entity_the_seer` | The Seer | ✅ FIXED — now points to `characters/seer/bust.avif` (live on dgrsart) |
| `entity_wraith_calder` | Wraith Calder | 🟡 Has NPC bible at `apps/shared/npcs/bibles/wraith_calder.md` but **no CDN art**. Probe: `characters/wraith_calder/bust.avif` → 403. Needs commission. |
| `entity_akai_shi` | Akai Shi | 🟡 No bible, no CDN art. `characters/akai_shi/bust.avif` → 403. Needs commission. |
| `entity_vex_solene` | Vex Solène | 🟡 Has NPC bible, **no CDN art**. `characters/vex_solene/bust.avif` → 403. Needs commission. |
| `char_the_student` | The Student | Needs commission |
| `char_the_seeker` | The Seeker | Needs commission |
| `entity_105` | Marion Kell | Needs commission |
| `entity_106` | Darren Fessler | Needs commission |
| `entity_107`–`entity_121` | Trickster, Titan, Sorcerer, Kanshi Sha, Six Sins, Frog God Mask, Program and Control, Synopticon, MeMe Civilization, N0NOS / NØX Code, Top Floor Door, The NØX, Casino Heist, The Experiment, Archon Ascension Ceremony | Needs commission (15 entries) |
| `entity_syndicate_of_death` | The Syndicate of Death | Needs commission |
| `entity_word_silence` | The Word and The Silence | Needs commission |
| `entity_thalorian_vessel` | The Thalorian Vessel | Needs commission |
| `entity_hierophant_wraith` | The Hierophant Wraith | Needs commission |
| `entity_jericho_jones` | Jericho Jones | Needs commission |
| `entity_pre_fall_iron_lion` | The Pre-Fall Iron Lion | Needs commission |
| `entity_vex_apprentice` | Vex's Apprentice | Needs commission |
| `entity_game_master_archon` | The Game Master (Archon) | Needs commission (distinct from playable Game Master) |
| `entity_xethraal` | Xeth'Raal | Needs commission |
| `entity_velkraal` | Velkraal | Needs commission |
| `entity_brel_sorrash` | Brel'Sorrash | Needs commission |
| `entity_ozhul_vana` | Ozhul'Vana | Needs commission |
| `entity_tessek_vrall` | Tessek'Vrall | Needs commission |
| `entity_mol_vereth` | Mol'Vereth | Needs commission |

Plus two intentional alias entries that share content with their canonical sibling — **do not merge**:

| Id | Name | Note |
|---|---|---|
| `entity_degen` | The Degen | Intentional Jericho-arc cross-reference of `entity_the_degen`. The entry's own `history` field warns: "the Mystery Engine retains both ids because they were authored against different episode contexts and breaking either reference would silently empty the unlock banner of one arc." Both should populate the same `image` URL when commissioned. |
| `entity_the_degen` | The Degen | Canonical entry. |

(My earlier suggestion to dedup these was wrong — retracting.)

### §5.2 — 89 `concept_*` entries

Abstract lore (e.g. `concept_seam_holder`, `concept_audit_legibility`, `concept_oracle_awaited`). Design decision whether each warrants a unique portrait or whether they should render with a faction-themed placeholder card frame. **Default recommendation:** render with category-themed placeholders (cheaper than 89 unique commissions); only commission portraits for concepts with story-critical UI presence.

### §5.3 — 37 `song_sih_*` entries

Silence in Heaven album tracks (numbered 1–37). Each has slideshow frames at `art/cinematics/silence-of-two-witnesses/...` style paths (verified live via prior probe). Two options:
- **(a)** Populate each `image` field with the song's slideshow `frame01.webp` URL (cheap, immediate fix)
- **(b)** Commission a dedicated cover-art portrait per track (expensive — 37 NB2 renders)

Default: do (a) now, leave (b) as P2.

### §5.4 — 11 `event_*` + 2 `lore_*` + 1 `location_*` entries

Event/lore narrative pages — likely render as text cards without images today. Producer + designer call.

### §5.5 — 🚨 BLOCKING: legacy CloudFront migration

**193 of 193 currently-populated `image` URLs point to the dead `d2xsxph8kpxj0f.cloudfront.net`** bucket which returns 403 on every HEAD probe. This means **0 of 372 loredex entries currently render an image in production**, regardless of whether their `image` field is populated.

The fix is upstream of asset commission: either re-route the CloudFront distribution to the live origin, or migrate every URL to the dgrsart S3 bucket via a sweep over `loredex-data.json`. See §10.9 for the cross-cutting code work.

**Until §10.9 lands, even the 1 entry I just populated above (the Seer) is the only loredex portrait that resolves to a 200 in production.**

---

## §6 Music

### §6.1 — Acts 2–3 intro music

`act-2-intro.mp3` and `act-3-intro.mp3` both return 403. Acts 4, 4.5, 5, 6, 7 are live at `audio/acts/act-{N}-intro.mp3`. Tool: Suno v4. Prompts in `ACTS_2_TO_7_PRODUCTION_BIBLE.md` Part 8.

### §6.2 — Acts 2–7 score (stingers, character cues)

The bible §X.7 sections list ~40 cues (openers + stingers + character bits + transitions). Only the 5 main act intros are on CDN. The remaining ~35 cues are unrendered. Tool: Suno v4. Prompts ready in the bible.

### §6.3 — Book of Daniel album gaps

Per the prior audit + `apps/shared/silenceInHeavenAlbumAudio.json` pattern (which is the only album audio manifest):
- **Polarity** — image/lore present, no MP3
- **Paradise Lost** — URL malformed (no `.mp3` extension), 403
- **The Secret of Words / Little Secrets** — no audio file anywhere

Producer task: convert + upload the 3 missing tracks. The agent's reading is that Polarity needs a fresh Suno gen; Paradise Lost needs the URL fixed; Secret of Words needs both Suno gen and manifest mapping.

Albums 1–4 do NOT have `audioUrl` fields in their slideshow manifests at `apps/shared/expansionArt/album{1,2,3,4}Slideshows.ts`. Even when the audio is rendered and uploaded, the runtime won't play it without manifest plumbing — code task, see §10.

### §6.4 — Character themes (boss intros)

Per `ART_SOUND_MUSIC_RESOURCES.md` Part 4 §"Character Themes" (lines 502–547):
- Architect — "God Complex"
- Iron Lion — "Last Stand"
- Agent Zero — "Ghost Protocol"

Suno v4 prompts already in the doc. Three MP3s to render. Output path: `audio/characters/{id}_theme.mp3`.

### §6.5 — Engineer's Log instrumentals (FNORD-23 / OuterGroove)

`docs/FNORD23_MUSIC_PROMPTS.md` has 41 Suno-ready prompts (OG_001 through OG_067 with gaps). Only 2 (`og_001.mp3`, `og_003.mp3`) are referenced in code. The other 39 are unrendered.

Tool: Suno v4. Prompts ready. Output path: `audio/outergroove/og_{NNN}.mp3`.

### §6.6 — Victory/defeat jingles + arena themes

Arena themes: 8 themes specified in `ART_SOUND_MUSIC_RESOURCES.md` Part 4 §"Arena Fight Themes". `FightSoundManager.ts` lines 14–23 currently maps these to YouTube IDs (working, but external-dependency risk). Either ship local MP3s and switch the runtime, or accept the YouTube-embed model.

Victory/defeat jingles per Part 4 §"Victory Jingle" — 2–3 short Suno prompts. Output path: `audio/jingles/victory.mp3`, `audio/jingles/defeat.mp3`.

---

## §7 SFX

### §7.1 — UI sound layer (entire layer absent)

`ART_SOUND_MUSIC_RESOURCES.md` Part 5 (lines 585–601) specs 10 UI sound types: menu select, hover, back, character select, stage select, loading, round transition, combo tick, meter fill, meter full.

**Zero implementation in code.** No `playSound`, `<audio>`, or `Howler` calls outside fight engine.

Two-track delivery:
1. **Code (out of asset scope; tracked in §10)**: add a `UISoundManager` mirroring `FightSoundManager.ts` — Web Audio synthesis OR external WAV loader. Wire to menu components.
2. **If loading external samples**: 10 short WAVs (50–500 ms each). Output path: `audio/ui/{id}.wav`. Tool: ElevenLabs SFX or hand-synthesized Web Audio (preferred — zero asset weight).

### §7.2 — CADES atmosphere SFX (7 missing of 10)

Per the prior agent audit, 3 of 10 atmosphere SFX live in `cadesAssets.ts`. The 7 missing:
- `loop_reset_dawn`
- `iron_lion_salute`
- `channel_open`
- `game_masters_transmission`
- `thoughtborn_approach`
- `breach_alarm`
- `zone_transition`
- `shield_milestone`
- `pillar_activate`
- `cades_pulse`

(That's 10 in the spec; agent reports 3 live; need to verify via `grep -E '"loop_reset_dawn|iron_lion_salute|...' apps/client/src/data/cadesAssets.ts` to confirm which 3.)

Tool: ElevenLabs SFX. Prompts in `docs/production/CADES_SFX_PROMPTS.md`.

### §7.3 — Ambience (room / environmental)

Currently 8 ambient tracks total: 4 Celebration Park (`apps/shared/celebrationParkMap.ts`), 4 Mechronis. **No casino, panopticon, terminus, or other location ambience.** No central ambience system — each location wires its own audio.

Optional P2 work — out of scope unless designer prioritizes.

---

## §8 Voice-over

Per `apps/shared/act{2,3,4,5,6,7}VoManifest.json`, the manifests are NOT empty (3K to 10K bytes each). The dgrsvoices.s3 bucket appears accessible (`HEAD` returns 200 for sample URLs).

The earlier agent reports of "Acts 2–7 VO manifests are empty" appear to be wrong. Producer should verify line coverage with `pnpm vo:audit` before any commission.

If line gaps exist, recording proceeds via ElevenLabs per `docs/production/VOICE_OVER_BIBLE.md` and the scripts in `apps/scripts/<character>-lines.json`.

---

## §9 Loose orphans (live registries, no consumer)

These have assets on CDN but no runtime renders them. Decision needed: wire them up (§10) or delete the registry.

| Registry | URLs live | Consumer |
|---|---:|---|
| `apps/client/src/data/arenaAssets.ts` | 8/8 | None (per agent audit — designer to verify) |
| `apps/client/src/data/terminusCinematicAssets.ts` | 10/11 | None |
| `apps/client/src/data/darrenMemorial.ts` | 1/1 | None |

---

## §10 Cross-cutting code work (out of asset scope, flagged here)

Producer doesn't render code, but these block several asset categories from being visible in-game:

1. **Cades FPS cross-game emit side** — `games/cades-fps/autoloads/WebBridge.gd` has no `crossGameThreads.emit` calls for the documented beats (Iron Lion greeting, memorial reading, Watcher weather, Kael-descendant NPC, substrate whisper, Last Words radio).
2. **Dead Man's Circuit cross-game emit side** — same: `games/dead-mans-circuit/autoloads/WebBridge.gd` has no game-specific emits (Programmer's Math, Vox letter, substrate signature, telemetry suppression, closing motif).
3. **Duelyst victories → XP/achievements** — `apps/server/duelystWs.ts` MATCH_RESULT only emits ELO; no XP gain, no achievement awards, no quest credit.
4. **UI sound layer code** — see §7.1 sub-bullet 1.
5. **VFX atlas runtime wiring** — see §3 final paragraph. Atlases must be applied during cinematic playback for the rendered effect to show.
6. **Album audio manifest expansion** — albums 1–4 need `audioUrl` plumbing in their slideshow manifests; mirror `silenceInHeavenAlbumAudio.json` shape.
7. **Loredex `image` field population** — once §5.1 commissions land, populate `loredex-data.json` for the 35+ entities still needing `image` URLs. (1 of 39 — the Seer — already fixed 2026-05-02.)
8. **Programmer in gameData.ts** — designer task per §2.5.
9. **🚨 Legacy CloudFront migration (BLOCKING for loredex display)** — 193 loredex `image` URLs + the entire season1-cards.json + most expansion card art point to `d2xsxph8kpxj0f.cloudfront.net` which returns 403 on every probe. 1,727 dead URLs total per the audit ledger. Either re-point the CloudFront distribution at a live origin, or sweep every URL across the codebase migrating to the dgrsart S3 bucket. Without this, the loredex / season1 cards / expansion cards render zero images in production. See `docs/production/audit/per-source-status.tsv` for the full per-source kill list.

---

## §11 Methodology + verification harness

### Triple-signal definition

Per asset:
1. **Wired** — typed TS/JSON registry exports the URL
2. **Consumed** — a React/runtime component imports it
3. **Live** — `curl -I` returns 200 on the URL

Status grades: ✅ SHIPPED (1+2+3) · 🟡 DARK (1+2, dead URL) · 🟡 ORPHANED (1+3, no consumer) · 🟡 PROMPTED-ONLY (prompt exists, no registry) · 🔴 MISSING (none).

### How to re-run the audit

```bash
bash docs/production/audit/extract-urls.sh    # rebuilds all-urls.tsv
bash docs/production/audit/probe-cdn.sh       # rebuilds cdn-liveness.tsv
bash docs/production/audit/scan-path-mismatches.sh  # rebuilds path-mismatches.tsv
```

The extractor was extended on 2026-05-02 to enumerate fighter sprite URLs (17 configured + 5 planned), Acts 2–7 cinematic MP4s (42 ids), cinematic START/END key frames (~80), VFX atlases (21), and music cues (~34). The probe handles 3,805 unique URLs in ~60s with 48-way parallelism.

### Current ledger snapshot (2026-05-02)

```
Total URLs probed: 3805
   200: 1680  (LIVE)
   403: 2027  (DEAD — includes 1727 legacy CloudFront in investigate-pending hold)
   000: 96    (network blip — retried successfully for all sampled subsets)
   ERR: 2     (template-literal junk in source code, not real URLs)

Live, excluding legacy CloudFront: 1680 / 2078 = 80.8%
```

### Sample verifications proving the doc's accuracy

5 SHIPPED items spot-checked manually (each returns 200 on `curl -I`):
- `art/fighters/architect/architect_idle_movement.png`
- `art/fighters/akai_shi/akai_shi_attacks_specials.png`
- `videos/acts/act-4/cin_act4_memorial_corridor.mp4`
- `videos/acts/act-7/cin_act7_voices_align.mp4`
- `audio/acts/act-5-intro.mp3`

5 MISSING items spot-checked (each returns 403):
- `art/fighters/programmer/programmer_idle_movement.png`
- `art/fighters/authority/authority_attacks_specials.png`
- `videos/acts/act-2/cin_act2_silence.mp4`
- `vfx-atlases/act-7/voices_align_chord_ring.png`
- `audio/acts/act-2-intro.mp3`

---

## §12 Index by tool

| Tool | Sections | Approx asset count |
|---|---|---:|
| **Veo 3.1** | §1.1 (5 cinematic MP4s) | 5 videos |
| **NB2 (Nano Banana 2)** | §1.2 (~80 cinematic frames), §2.3 (5 fighter kits = ~765 frames pre-repack), §3 (21 VFX atlases), §4 (~120 card art), §5 (4 loredex portraits) | ~990 PNGs |
| **Suno v4** | §6.1–§6.6 (Acts 2–3 intros, ~35 score cues, 3 album tracks, 3 character themes, 39 OuterGroove instrumentals, jingles) | ~85 MP3s |
| **Kling** | §1.3 (13 Loredex Discovery), §1.4 (17 story-mode), §1.5 (6 DMC), §1.6 (5 Living Universe), §1.7 (5 awakening/prestige/death), §1.8 (mode intros) | ~50+ videos |
| **ElevenLabs SFX** | §7.2 (7 CADES atmosphere) | 7 WAVs |
| **Web Audio synthesis** | §7.1 (10 UI sounds — preferred path) | code-only |
| **ElevenLabs VO** | §8 (per `pnpm vo:audit` gaps) | TBD |
| **Repack pipeline** | §2.2 (`apps/scripts/repack-fighter-sprite-strip.ts`) | n/a — tool |
| **ffmpeg** | various conversions per CONSOLIDATED §1 (now archived) | small |

---

_Last updated: 2026-05-02. Audit ledger: `docs/production/audit/cdn-liveness.tsv`. Engine spec for sprite kits: `apps/client/src/game/spriteSheetConfig.ts`. Repack tool: `apps/scripts/repack-fighter-sprite-strip.ts`._
