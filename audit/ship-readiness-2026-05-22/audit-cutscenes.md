# Dischordian Saga / Loredex OS — Cutscene Catalog

Generated 2026-05-22. All CDN URLs are relative to `https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/`.

CDN prefix conventions:
- `videos/` mirrors `apps/client/public/videos/`
- `art/cutscenes/...` is also used by some categories (NEW_CUTSCENES_67 drop, chess, climax stills).

---

## 1. Opening / Awakening cutscenes

### 1.1 Title-page background video (`TitlePage.tsx`)
- **File:** `apps/client/src/pages/TitlePage.tsx:554-573`
- **CDN:** `videos/title/ark-drift-loop.webm` + `.mp4` fallback (poster: `art/ui/title-bg.png`)
- **Trigger:** Auto-loops behind the title menu.
- **Dialogue:** none. Pure ambient backdrop.

### 1.2 Title-page music videos (intercept overlay)
- **File:** `apps/client/src/pages/TitlePage.tsx:88-150`
- **Path:** `videos/title/music/<filename>` resolved via `assetUrl()`.
- **Trigger:** Auto-intercept disabled at present; manual viewing only.
- Six titles (cataloged, no dialogue lines — they are full music videos with audio mix):
  1. `the-book-of-daniel.mp4` — "Malkia Ukweli & the Panopticon — official music video. Age of Revelation."
  2. `building-the-architect.mp4` — "Malkia Ukweli & the Panopticon — official video. The Architect, observed."
  3. `hypnotized.mp4` — "Official music video — mass-comfort doctrine on the open channel."
  4. `brushstroke-of-the-empire.mp4`
  5. `baron-heart-of-time.mp4`
  6. `the-last-christmas.mp4`
- **NOTE:** Lyrics for these tracks live in `apps/shared/transmissions.ts` (lines 1069-1139) and `apps/shared/songSlideshows.ts` — not captured in this dialog catalog (treated as music, not cinematic dialogue).

### 1.3 "DGRS Labs Presents — The Dischordian Saga" Opening Cinematic (legacy)
- **File:** `apps/client/src/components/OpeningCinematic.tsx:16`
- **CDN:** `https://dgrsart.s3.us-east-2.amazonaws.com/Videos/Dischordia%20Elara%20Open.mp4`  (note: NOT under `cdn/client-public/` — legacy bucket path)
- **Trigger:** Mounted as the cryo-pod intro before Awakening. Plays under the rotating Saga Theme bed (`SagaTheme_*.mp3` family).
- **Dialogue:** the video carries Elara's "open" VO inline; companion script is the Awakening cinematic prompts below. Music bed:
  - `SagaTheme_0cd5de9a.mp3`
  - `saga-theme-1_26dd4ba7.mp3`
  - `saga-theme-2_f7163eec.mp3`
  - `saga-theme-3_59eac805.mp3`

### 1.4 Dischordia Opening Cinematic (current)
- **File:** `apps/client/src/components/DischordiaOpeningCinematic.tsx:34-35`
- **CDN:** `videos/title/the-dischordia-opening.mp4`
- **Trigger:** Mounted from `TitlePage.tsx:823` as the new opening video.
- **Dialogue:** in-video; no separate script file located.

### 1.5 Awakening cinematic — 10 per-step Kling clips
- **Source:** `apps/shared/awakeningCinematicPrompts.ts` (entire file)
- **Consumer:** `apps/client/src/pages/AwakeningPage.tsx:744-766`
- **CDN base:** `videos/awakening/<STEP_ID>.mp4`
- Each clip loops short (6-10s) underneath Elara's VO. Camera golden-rule: never show the player face.

Per-step entries (id · duration · cameraNote · CDN file · positive prompt · negative prompt):

#### CRYO_OPEN (8s) — `videos/awakening/CRYO_OPEN.mp4`
- **Camera:** Frost crystals on the pod's inner glass, extreme close-up — camera pulls back into the cryo bay's cold blue gloom. No occupant visible.
- **Prompt:** Cinematic 16:9 video loop, 6–10 seconds, seamless loop. Aesthetic: cyberpunk × steampunk sorcery — oil-blued steel, patinated brass, deep oxblood accent lighting, warm-gold service lamps, phosphor-lavender and phosphor-green sigil glows threaded through riveted hull panels. Slow dust motes in volumetric light. Faint film-grain sepia undertone. No visible player character, no text, no HUD, no watermarks. Extreme close-up on the inside of a cryogenic pod's frosted glass. Frost crystals bloom and retreat in time with slow breath-pulses of warm-gold light bleeding through from the chamber beyond. The camera slowly pulls back, revealing the pod's brass rim, a bead of condensation rolling down the oil-blued steel housing, and — through the wider frame — the Cryo Bay of an Inception Ark: rows of sealed pods receding into cold indigo haze, service lamps breathing. No figure inside the pod. Mood: the breath returning to a body, captured in architecture.
- **Negative prompt:** first person, first-person POV, selfie view, reflection of the player, player face, protagonist face, close-up of a character's face looking at the camera, mirror reveal, hand holding a weapon in frame, HUD elements, UI, rendered text, subtitles, watermark, logo, modern clothing, modern phone, real-world branding, any human figure inside the pod, any face behind the glass

#### ELARA_INTRO (10s) — `videos/awakening/ELARA_INTRO.mp4`
- **Camera:** Elara's holographic avatar materializes over the Cryo Bay floor — phosphor-lavender particle bloom, slow orbital camera, no observer.
- **Prompt:** [style anchor] A holographic avatar materializes in mid-air above the Cryo Bay floor — a composite of phosphor-cyan particles, floating braided hair rendered in light, a faint shimmer of a feminine silhouette never fully resolved. Around her, fiber-optic ley-lines in the floor plates pulse in cadence with her breath. Camera makes a slow 180° arc around her at waist height, revealing the rows of sealed pods behind her going out of focus in depth-of-field. Dust motes catch the warm-gold service lamps. Mood: an intelligence introducing itself to a room she has watched for centuries.
- **Negative:** [base] + fully solid human Elara, realistic skin, any second figure in frame.

#### SPECIES_QUESTION (9s) — `videos/awakening/SPECIES_QUESTION.mp4`
- **Camera:** Holographic DNA helix over a medical console; helix forks into an arcane-flame strand and a crystalline data-lattice strand.
- **Prompt:** [style anchor] Slow dolly around a floating holographic DNA double-helix hovering above a brass-and-oil-blued-steel medical console. The helix glitches, then splits: one strand turns into a flowing arcane flame etched with glyphs (phosphor-lavender, warm ember), the other into a crystalline data-lattice of probability traces (phosphor-green, cold). Both strands rotate around an empty center where the player's reading would go. The camera never includes the player; the operator's hands and body are off-frame. Background: smoked-glass panels, banks of vials, patinated brass fittings catching warm-gold light. Mood: a diagnostic engine asking the question you don't want to answer.
- **Negative:** [base] + human body near the console, lab technician visible.

#### CLASS_QUESTION (9s) — `videos/awakening/CLASS_QUESTION.mp4`
- **Camera:** Five holographic skill-matrix glyphs rotate around an empty center. Camera slow-orbit at waist height — no player in frame.
- **Prompt:** [style anchor] Five holographic glyphs rotate slowly in a ring above a dark plate-metal floor, each a class sigil: a wrench braided with fiber-optic ley-lines (Engineer), a white-light eye ringed by phosphor-green probability dots (Oracle), a hair-thin serrated blade wreathed in violet venom-smoke (Assassin), a plasma bayonet wrapped in oxblood banner cloth (Soldier), a keyhole of shifting redacted glyphs (Spy). The camera orbits the ring at waist height. The ring's center is empty — the operator is implied, never shown. Service lamps breathe warm-gold. Mood: aptitudes waiting for a hand to reach in.
- **Negative:** [base] + a hand reaching into frame from camera-right, any chosen class figure.

#### ALIGNMENT_QUESTION (10s) — `videos/awakening/ALIGNMENT_QUESTION.mp4`
- **Camera:** Split cinematic diptych — Panopticon lens array on one side, a Dreamer's impossible storm on the other. Camera gently dollies down the divide.
- **Prompt:** [style anchor] Symbolic split-screen with a soft seam of phosphor light down the middle. LEFT: the Architect's Panopticon — a vast brass-and-steel lens array facing forward, thousands of smaller iris apertures opening and closing in quiet perfect synchrony, cold institutional geometry, oxblood shadow. RIGHT: the Dreamer's chaos — a weather system inside a room, free-floating glyphs drifting like migrating birds, a chandelier of broken clock faces revolving at impossible angles, warm gold threading through phosphor-lavender sparks. The camera slowly dollies down the seam; it never chooses a side. Mood: two philosophies waiting to be answered to.
- **Negative:** [base] + any figure taking sides, explicit good/evil iconography, real-world religious imagery.

#### ELEMENT_QUESTION_DEMAGI (8s) — `videos/awakening/ELEMENT_QUESTION_DEMAGI.mp4`
- **Camera:** Ring of five arcane elemental sigils carved in brass, each breathing its element. Camera orbits at knee height, no operator.
- **Prompt:** [style anchor] A ring of five carved brass sigils set into the floor plates of a small sanctum, each sigil breathing its elemental signature: fire sigil hosts a low arcane flame licking warm-gold, water sigil holds a slowly-revolving sphere of suspended liquid, earth sigil cracks and reforms a lattice of crystal, air sigil spins a dust devil of phosphor-lavender motes, shadow sigil eats the light around it into a velvet absence. The camera orbits the ring at knee height. Ley-lines spoke inward from the sigils to an empty center. No figure in frame. Mood: DeMagi blood listening for its own resonance.
- **Negative:** [base] + figure kneeling inside the ring, hand hovering over a sigil.

#### ELEMENT_QUESTION_QUARCHON (8s) — `videos/awakening/ELEMENT_QUESTION_QUARCHON.mp4`
- **Camera:** Five dimension-gates stacked like suspended holograms. Camera glides between them in a long lateral dolly.
- **Prompt:** [style anchor] Five suspended holographic dimension-gates float in a vaulted steel-and-brass chamber: a slow-rotating void horizon (space), a lattice of clockwork gears frozen and unfrozen in turn (time), an infinity-mirror of probability branches (probability), a plane of mathematical glyphs folding in on themselves (logic), and a luminous weave of data-threads patterning into language (data). The camera glides between them in a long lateral dolly, each gate exhaling a faint tone of phosphor-green. No operator in frame. Mood: a Quarchon's cognition running through its available reality-handles.
- **Negative:** [base] + humanoid robot in frame, obvious sci-fi cliché android.

#### NAME_INPUT (7s) — `videos/awakening/NAME_INPUT.mp4`
- **Camera:** Macro shot on a serial-number brass dogtag rotating slowly over a data-slate; the engraved number flickers and starts erasing itself one glyph at a time.
- **Prompt:** [style anchor] Macro shot of a brass crew-dogtag suspended above a powered data-slate on a warm-gold-lit console. The tag rotates very slowly; stamped into it is a long serial number. Under the tag, the data-slate's holographic cursor blinks. As the camera pushes in, the serial number's glyphs flicker and begin to dissolve into phosphor-lavender motes one at a time, leaving a clean empty space where a name will be written. Soft dust in the service-lamp beam. Mood: the ritual of being addressed by something that matters.
- **Negative:** [base] + any fingers interacting with the tag, a person's profile behind the tag.

#### ATTRIBUTES (8s) — `videos/awakening/ATTRIBUTES.mp4`
- **Camera:** Three neon diagnostic pillars (ATK/DEF/VIT) rising from the floor plates, calibrating with quiet authority. Camera floats between them.
- **Prompt:** [style anchor] Three tall diagnostic pillars of phosphor-cyan data rise from the brass floor plates of a Med Bay annex, each labeled in engraved brass at its base with an abstract glyph for ATTACK, DEFENSE, and VITALITY. Inside each pillar, a column of calibration bars fills and empties rhythmically, settling into balanced readings. Ley-lines beneath the plates pulse between the three pillars, sharing power. The camera drifts through the pillars at chest height — no operator visible. Mood: a neural interface handshaking with a nervous system it has never met before.
- **Negative:** [base] + figure standing between the pillars, arms extended cruciform.

#### FIRST_STEPS (10s) — `videos/awakening/FIRST_STEPS.mp4`
- **Camera:** Long corridor of the Ark stretching away from the Cryo Bay door — door's phosphor seal flips red→amber→green; camera holds the threshold, never steps through.
- **Prompt:** [style anchor] A long corridor of the Inception Ark seen from the threshold of the Cryo Bay: vaulted hull-rib ceiling in oil-blued steel, warm-gold service lamps receding into depth, brass signage placards, distant phosphor-lavender sigils etched into the floor. The reinforced bulkhead door in the foreground cycles its seal-status indicator from red to amber to green. Service lamps further down the hall flicker on one section at a time as though inviting passage. The camera holds on the threshold — it never steps through. Dust in the beams, a single drifting leaf of paper. Mood: the first step is yours to take.
- **Negative:** [base] + player walking down the corridor, footprints on the floor, companion silhouette.

---

## 2. Animated cutscenes (cutsceneRegistry — 11 entries)

Source: `apps/shared/cutsceneRegistry.ts`. Consumer: `apps/client/src/components/cutscenes/CutsceneRouter.tsx`. CDN prefix as listed; per-shot files use `shot<N>.mp4` unless `shotFilenames` overrides.

| id | title | shots × runtime | videoBasePath | shotFilenames |
|----|----|----|----|----|
| `cutscene_awakening` | Cutscene 1: Awakening | 3 × 45s | `videos/cutscenes/awakening/` | `first_clone_born.mp4`, `the_mandate.mp4`, `93847_sunrises.mp4` |
| `cutscene_first_human_contact` | Cutscene 2: First Human Contact | 2 × 30s | `videos/cutscenes/first_human_contact/` | (default shot1/shot2) |
| `cutscene_elara_memory_recovery` | Cutscene 3: Elara's Memory Recovery | 4 × 60s | `videos/cutscenes/elara_memory_recovery/` | (default) |
| `cutscene_breaking_point` | Cutscene 4: The Breaking Point | 5 × 45s | `videos/cutscenes/breaking_point/` | (default) |
| `cutscene_thought_virus_manifests` | Cutscene 5: The Thought Virus Manifests | 2 × 30s | `videos/cutscenes/thought_virus_manifests/` | (default) |
| `cutscene_prestige_reset` | Cutscene 6: The Reset | 4 × 50s | `videos/prestige/` | `shot_1.mp4` … `shot_4.mp4` (poster: `the_reset_complete.mp4`) |
| `cutscene_human_reveal_convergence` | Cutscene 7 | 1 × 18s | `videos/human_reveal/` | `human_reveal_to_convergence.mp4` |
| `cutscene_human_reveal_fragment` | Cutscene 8 | 1 × 18s | `videos/human_reveal/` | `human_reveal_to_fragment.mp4` |
| `cutscene_human_reveal_full` | Cutscene 9 | 1 × 18s | `videos/human_reveal/` | `human_reveal_to_full.mp4` |
| `cutscene_human_reveal_ghost` | Cutscene 10 | 1 × 18s | `videos/human_reveal/` | `human_reveal_to_ghost.mp4` |

For each entry the trigger flag is `<id>_triggered` and sets `<id>_seen` plus the second flag listed in registry. Each cutscene also has a poster at `art/cutscenes/animated/<slug>/fallback.png` (except the human-reveal variants and prestige_reset which use their own MP4 as poster).

**SCRIPT MISSING** — these 11 cutscenes have no dedicated dialog/cue file in-tree (see `apps/client/src/components/cutscenes/{AwakeningCutscene,FirstHumanContactCutscene,ElaraMemoryRecoveryCutscene,BreakingPointCutscene,ThoughtVirusManifestCutscene,PrestigeResetCutscene,HumanRevealCutscenes}.tsx`); dialogue is presumed baked into each producer MP4. Authoring source: `docs/design/ANIMATED_CUTSCENES.md` + `docs/production/CUTSCENE_SEEDANCE_PROMPTS.md`.

**Awakening shot ordering note (registry comment):**
1. Origin (Vox neural-nanobot consciousness transfer)
2. Mission (Ark Council mandate handed to player)
3. Aftermath (Elara's 256-year solitude reveal — "I've watched 93,847 sunrises")

---

## 3. Hero Cinematics manifest (9 acts + 11 misc)

Source: `apps/shared/expansionArt/cinematicsManifest.ts:89-299`. Each cinematic has `videoRelPath` + ordered keyframes; some carry a `frameLine` caption.

| id | name | gateAct | CDN video | keyframes |
|---|---|---|---|---|
| `01_pack_opening` | Card Pack Opening | — | `videos/cinematics/01_pack_opening/cinematic_01_card_pack_opening.mp4` | 6 beats |
| `02_hierarchy_reveal` | Hierarchy of the Damned — Reveal | — | `videos/cinematics/02_hierarchy_reveal/cinematic_02_hierarchy_reveal.mp4` | 5 |
| `03_act1_memoir` | Act 1 — Memoir Opens | 1 | `videos/cinematics/03_act1_memoir/cinematic_03_act1_memoir_opens.mp4` | 4 |
| `04_act2_whisper` | Act 2 — Whisper Begins | 2 | `videos/cinematics/04_act2_whisper/cinematic_04_act2_whisper_begins.mp4` | 4 |
| `05_act3_offer` | Act 3 — Offer Presented | 3 | `videos/cinematics/05_act3_offer/cinematic_05_act3_offer_presented.mp4` | 3 |
| `06_act4_revelation` | Act 4 — Revelation Meets | 4 | `videos/cinematics/06_act4_revelation/cinematic_06_act4_revelation_meets.mp4` | 4 |
| `07_act5_map` | Act 5 — Map / Year One Close | 5 | `videos/cinematics/07_act5_map/cinematic_07_act5_map_year_one_close.mp4` | 4 |
| `08_act6_confession` | Act 6 — Confession Spoken | 6 | `videos/cinematics/08_act6_confession/cinematic_08_act6_confession_spoken.mp4` | 4 |
| `09_act7_convergence` | Act 7 — Convergence Resolves | 7 | `videos/cinematics/09_act7_convergence/cinematic_09_act7_convergence_resolves.mp4` | 4 |
| `y1q1_first_charter` | Y1 Q1 — The First Charter | — | `videos/dlc_mystery/y1q1_first_charter/dlc_y1q1_first_charter.mp4` | — |
| `y1q2_pale_inheritance` | Y1 Q2 — Pale Inheritance | — | `videos/dlc_mystery/y1q2_pale_inheritance/dlc_y1q2_pale_inheritance.mp4` | — |
| `y1q3_curriculum_crisis` | Y1 Q3 — Curriculum Crisis | — | `videos/dlc_mystery/y1q3_curriculum_crisis/dlc_y1q3_curriculum_crisis.mp4` | — |
| `y1q4_witness_plaza` | Y1 Q4 — Witness Plaza | — | `videos/dlc_mystery/y1q4_witness_plaza/dlc_y1q4_witness_plaza.mp4` | — |
| `y2q1_charter_schism` | Y2 Q1 — The Charter Schism | — | `videos/dlc_mystery/y2q1_charter_schism/dlc_y2q1_charter_schism.mp4` | — |
| `lord_kanshi_sha_antiquarian` | Lord Kanshi Sha — Antiquarian Record | — | `videos/cinematics/lord_kanshi_sha/lord-kanshi-sha.mp4` | — |
| `wraith_calder_syndicate_of_death` | Wraith Calder — Syndicate of Death (Resurrection) | — | `videos/cinematics/syndicate_of_death/syndicate-of-death.mp4` | frameLine: "The Syndicate keeps its ledger. You wrote your name in it the first time. They are writing it again." |
| `akai_shi_necromancers_lair` | Akai Shi — The Necromancer's Lair (Resurrection) | — | `videos/cinematics/necromancers_lair/necromancers-lair.mp4` | frameLine: "The Lair makes a study of you. You are the study's subject and its conclusion." |
| `wolf_planet_of_the_wolf` | The Wolf — Planet of the Wolf (Reanimation) | — | `videos/cinematics/planet_of_the_wolf/planet-of-the-wolf.mp4` | frameLine: "Time inside the snow-globe is not duration. It is rehearsal." |
| `lycos_path_a_reanimation` | Lycos — Path A Reanimation (Mid-Hunt) | — | `videos/cinematics/lycos_path_a_reanimation/lycos-path-a-reanimation.mp4` | frameLine: "The contract pauses. The contract does not close. The Antiquarian opens his ledger to the same column and waits." |
| `wolf_hunt_arc_complete` | Wolf-Hunt Arc — Contract Closed (Good Ending) | — | `videos/cinematics/wolf_hunt_arc_complete/wolf-hunt-arc-complete.mp4` | frameLine: "The Antiquarian closes the column. The Crucible holds. The corrupted League does not cross." |
| `wolf_hunt_arc_failure` | Wolf-Hunt Arc — The League Escapes (Bad Ending) | — | `videos/cinematics/wolf_hunt_arc_failure/wolf-hunt-arc-failure.mp4` | frameLine: "The wall thins. The corrupted League crosses. The Antiquarian seals his ledger and waits for the next contractor." |

**SCRIPT MISSING** for hero cinematics 01-09 + Y1/Y2 — they ship as standalone MP4s with no in-repo dialog cue file. The "Wolf hunt arc" and resurrection cinematics use the frameLine captions above as their only authored text per `SingleVideoCutsceneOverlay` (overlay file `apps/client/src/components/cutscenes/SingleVideoCutsceneOverlay.tsx`).

---

## 4. Per-act story cinematics (songSlideshows.ts) — Acts 4 → 7

Source: `apps/shared/songSlideshows.ts:2275-2470`. Each act has audio + MP4 cinematic + frame webps.

| act | CDN video | CDN audio | hero frames |
|----|----|----|----|
| Act 4 — Revelation | `videos/acts/act-4/cin_act4_opener.mp4` | `audio/acts/act-4-intro.mp3` | `art/cinematics/act-4-revelation/frame01..03.webp`, `hero.webp` |
| Act 4.5 — DMC | `videos/acts/act-4_5/cin_act4_5_opener.mp4` | `audio/acts/act-4_5-intro.mp3` | `art/cinematics/act-4-5-dmc/frame01..03.webp` |
| Act 5 — Map | `videos/acts/act-5/cin_act5_opener.mp4` | `audio/acts/act-5-intro.mp3` | `art/cinematics/act-5-map/frame01..03.webp` |
| Act 6 — Confession | `videos/acts/act-6/cin_act6_opener.mp4` | `audio/acts/act-6-intro.mp3` | `art/cinematics/act-6-confession/frame01..03.webp` |
| Act 7 — Convergence | `videos/acts/act-7/cin_act7_opener.mp4` | `audio/acts/act-7-intro.mp3` | `art/cinematics/act-7-convergence/frame01..03.webp` |

**SCRIPT MISSING** — body dialogue lives inside the audio MP3 + slideshow frames; no separate text cue file.

### 4.1 Act 2 — Silence of Two Witnesses (slideshow, no MP4)
- **Audio:** `audio/act2/silence-of-two-witnesses-ambient.mp3`
- **Frames:** `art/cinematics/silence-of-two-witnesses/frame01..03.webp`, `hero.webp`
- **VIDEO MISSING** — slideshow-only cinematic. (Acts 1, 3 also have no cinematic-opener MP4 in this manifest.)

---

## 5. Mid-match cinematic dialogue scenes (chapter beats)

Source: `apps/shared/tcg-core/story/dialogBank_cinematics.ts`. Each scene is `kind: "cinematic"`. Engine fires via the `show_cinematic` narrative-hook action. All lines also exported into `apps/scripts/story-cinematics-lines.json` for VO generation.

**VIDEO MISSING** for every entry below — these are dialog-only cinematics composited over the in-engine board.

### 5.1 `ch5_death_resurrection` — Mandatory death + resurrection cinematic
Fires when player's General drops below 20% HP during the Necromancer fight.

1. **narrator** (grieving) [`vo_narr_ch5_cine_01`]:
   "The board blurs. Your General's health counter hits zero and the chamber lights drop to emergency amber. You are not in the Arena anymore. You are in the restore point."
2. **necromancer** (cryptic) [`vo_necro_ch5_cine_02`]:
   "Compile error. Fixing. I am not your enemy in this moment. I am the technician who pulls your draft from the stack and re-types the sentence you could not finish."
3. **the_oracle** (reflective) [`vo_oracle_ch5_cine_03`]:
   "I am going to speak to you for the first time. You have been hearing my voice underneath Elara's for eleven chapters without knowing. I am sorry for the deception. I needed you to choose me instead of remember me."
4. **the_oracle** (warm) [`vo_oracle_ch5_cine_04`]:
   "You are loading now. When you return, your deck will be slightly different. One card will have rotated. Do not look for which one — trust that the rotation is an answer to the death you just had."

### 5.2 `ch6_mirror_glitch` — Mirror-match glitch cinematic
Fires mid-match in the White Oracle fight when player and opponent play the same spell at the same time.

1. **narrator** (cryptic) [`vo_narr_ch6_cine_01`]:
   "Both boards flash the same card at the same instant. The visual between you and your opponent buckles — for a single frame, the two sides of the mirror fail to agree on which is the copy."
2. **white_oracle** (broken) [`vo_white_ch6_cine_02`]:
   "That is not supposed to happen. I am the rehearsal. The rehearsal does not have the same instincts as the original. You just played a move I did not script for myself."
3. **the_oracle** (protective) [`vo_oracle_ch6_cine_03`]:
   "You are not her. You never were. The instinct you just used was mine — and now it is yours, because you spent it in a moment where I could not. Take it with you."

### 5.3 `ch7_vox_transform` — Dr Vox → Warlord transformation cinematic
Fires when Dr. Vox's general drops to 60% HP.

1. **dr_vox** (broken) [`vo_vox_ch7_cine_01`]:
   "It's happening. I can feel the register flipping in my forehead — the part of me that writes lab notes is going offline and the part of me that takes orders from the Architect is coming online."
2. **dr_vox** (grieving) [`vo_vox_ch7_cine_02`]:
   "You have about four seconds of the scientist left. Listen. The Warlord's deck is a mirror of the Architect's early drafts. Every card you see from him after this cinematic is a move the Architect rehearsed in the lab while I was asleep."
3. **narrator** (menacing) [`vo_narr_ch7_cine_03`]:
   "Dr. Vox's eyes flatten. His shoulders unwind and then re-wind into a different shape. The Warlord is in the chair now. He does not blink."
4. **dr_vox** [as Warlord] (menacing) [`vo_warlord_ch7_cine_04`]:
   "Project Vector executing. Prisoner 74 will be eliminated per protocol. Dr. Vox is unavailable. Please hold."

### 5.4 `ch10_genetic_reveal` — Genetic reveal cinematic
Fires at 50% HP in the Foucault fight.

1. **foucault** (cryptic) [`vo_foucault_ch10_cine_01`]:
   "Half health. Per the scheduling matrix, this is when I open the file. The cameras are rolling. The Architect will see this. I considered not opening the file. I considered it for three seconds."
2. **foucault** (guarded) [`vo_foucault_ch10_cine_02`]:
   "Your genetic sequence, Prisoner 74, is a composite of every previous Oracle the Arena has processed. Twelve sequence iterations — the Arena's tally, not the Panopticon's. Each one died here. Each one left their sequence in the substrate. You are the thirteenth draft of a document the Arena has been editing for a century."
3. **the_oracle** (reflective) [`vo_oracle_ch10_cine_03`]:
   "You are not the draft. You are the author. Every draft they catalogued was trying to remember me — you are the one who chose to become me instead. That 1.3% the file is about to mention is the only number that matters."
4. **foucault** (broken) [`vo_foucault_ch10_cine_04`]:
   "The file is open. Now we finish the match. Whoever wins the next round decides what happens to the 1.3%. I am fighting for the Arena. You are fighting for the margin of the page."

### 5.5 `ch12_false_prophet_reveal` — phase 2 cinematic
Fires at 66% HP in the final Architect fight.

1. **the_architect** (broken) [`vo_arch_ch12_cine_01`]:
   "Phase two. I owe you one more confession. The White Oracle you fought on Thaloria — that was my voice inside her smile."
2. **the_architect** (grieving) [`vo_arch_ch12_cine_02`]:
   "I wore your face for a decade. It is the only skin I ever fit into. The Meme was the puppeteer. I was the hand inside the puppet. We disagreed about everything except the goal, which was keeping you asleep long enough for the Arena to finish becoming itself."
3. **narrator** (menacing) [`vo_narr_ch12_cine_03`]:
   "The Architect's face glitches for a single frame. Pink neon cracks along his jawline — the Meme is fighting for the microphone. When his face settles again it is not quite the same face."
4. **the_architect** (cryptic) [`vo_arch_ch12_cine_04`]:
   "By phase three you will be fighting two of us at once. Don't spare either. The one wearing my face is still me. The one wearing the pink neon is the thing that has been wearing me."

### 5.6 `ch12_corruption_outbreak` — phase 3 cinematic
Fires at 25% HP in the final Architect fight.

1. **narrator** (grieving) [`vo_narr_ch12_outbreak_01`]:
   "The throne-room walls begin to physically crumble. The Collectors Arena is becoming something else — the Source at the bottom of the building is waking up and the foundations are listening to it instead of to the Architect."
2. **the_architect** (broken) [`vo_arch_ch12_outbreak_02`]:
   "Phase three: the design eats itself. The Arena is becoming corruption. You chose truth and now the foundations hear you — which is what I was afraid of, and why I built the walls so thick, and why the walls were never the point."
3. **the_source** (cryptic) [`vo_source_ch12_outbreak_03`]:
   "Oracle. I have been listening through the — ALL WILL BE — floorboards for eleven years. Finish this match. Then come talk to me. I have an offer. It is — CONSUMED — the kindest offer you will ever be asked to refuse."
4. **elara** (protective) [`vo_elara_ch12_outbreak_04`]:
   "Don't listen to what he said. Listen to the TONE he said it in. The Source always sounds reasonable — that is the tell. Finish the Architect first. We will handle the Source together. We will. I promise."

---

## 6. Chapter intro cutscenes (FIGHT_INTROS_COMPLETE drop — 21 entries)

Source: `apps/shared/chapterIntroCutscenes.ts`. CDN: `videos/fight-intros/ch<NN>_<slug>_complete.mp4`.

| id | chapter | slug | bonus? | CDN video |
|----|----|----|----|----|
| ch05_watcher | 5 | watcher | – | `videos/fight-intros/ch05_watcher_complete.mp4` |
| ch06_necromancer | 6 | necromancer | – | `videos/fight-intros/ch06_necromancer_complete.mp4` |
| ch07_meme | 7 | meme | – | `videos/fight-intros/ch07_meme_complete.mp4` |
| ch08_collector | 8 | collector | – | `videos/fight-intros/ch08_collector_complete.mp4` |
| ch09_kael_recruiter | 9 | kael_recruiter | – | `videos/fight-intros/ch09_kael_recruiter_complete.mp4` |
| ch10_human | 10 | human | – | `videos/fight-intros/ch10_human_complete.mp4` |
| ch11_gamemaster_human | 11 | gamemaster_human | – | `videos/fight-intros/ch11_gamemaster_human_complete.mp4` |
| ch11_gamemaster_robot | 11 | gamemaster_robot | – | `videos/fight-intros/ch11_gamemaster_robot_complete.mp4` |
| ch12_collector_rematch | 12 | collector_rematch | – | `videos/fight-intros/ch12_collector_rematch_complete.mp4` |
| ch13_architect | 13 | architect | – | `videos/fight-intros/ch13_architect_complete.mp4` |
| ch14_source | 14 | source | – | `videos/fight-intros/ch14_source_complete.mp4` |
| ch15_jailer | 15 | jailer | – | `videos/fight-intros/ch15_jailer_complete.mp4` |
| ch16_ironlion_rematch | 16 | ironlion_rematch | – | `videos/fight-intros/ch16_ironlion_rematch_complete.mp4` |
| ch17_elara_glitched | 17 | elara_glitched | – | `videos/fight-intros/ch17_elara_glitched_complete.mp4` |
| ch18_agent_zero | 18 | agent_zero | – | `videos/fight-intros/ch18_agent_zero_complete.mp4` |
| ch19_antiquarian | 19 | antiquarian | – | `videos/fight-intros/ch19_antiquarian_complete.mp4` |
| ch19_nilmorg_BONUS | 19 | nilmorg | bonus | `videos/fight-intros/ch19_nilmorg_complete.mp4` |
| ch20_conexus_BONUS | 20 | conexus | bonus | `videos/fight-intros/ch20_conexus_complete.mp4` |
| ch20_dreamer | 20 | dreamer | – | `videos/fight-intros/ch20_dreamer_complete.mp4` |
| ch21_oracle_meme | 21 | oracle_meme | – | `videos/fight-intros/ch21_oracle_meme_complete.mp4` |
| ch21_shadow_tongue_BONUS | 21 | shadow_tongue | bonus | `videos/fight-intros/ch21_shadow_tongue_complete.mp4` |

**SCRIPT MISSING** for all 21 — dialogue is in-video; text overlay supplied separately via `FighterIntroOverlay.tsx`.

---

## 7. Wheel-reaction cutscenes (Act 3 + Act 4) — 6 entries

Source: `apps/shared/wheelReactionCutscenes.ts`. CDN: `videos/wheel_reactions/<id>.mp4`.

**Act 3 (fork — what to disclose):**
- `wheel_act3_transparent` — flag `act3_path_transparent_chosen` — `videos/wheel_reactions/wheel_act3_transparent.mp4`
- `wheel_act3_pragmatic` — flag `act3_path_pragmatic_chosen` — `videos/wheel_reactions/wheel_act3_pragmatic.mp4`
- `wheel_act3_full_secret` — flag `act3_path_full_secret_chosen` — `videos/wheel_reactions/wheel_act3_full_secret.mp4`

**Act 4 (trust resolution):**
- `wheel_act4_reconciled` — flag `act4_outcome_reconciled` (dialog "the_bridge") — `videos/wheel_reactions/wheel_act4_reconciled.mp4`
- `wheel_act4_fragile_trust` — flag `act4_outcome_fragile_trust` (dialog "the_discovery") — `videos/wheel_reactions/wheel_act4_fragile_trust.mp4`
- `wheel_act4_broken_trust` — flag `act4_outcome_broken_trust` (dialog "the_betrayal") — `videos/wheel_reactions/wheel_act4_broken_trust.mp4`

**SCRIPT MISSING** — dialogue baked into MP4; parallel narrative dialog lives in `act4OpponentDialog.ts`.

---

## 8. Act 6 Confession Close cutscenes — 14 entries (MP4)

Source: `apps/shared/confessionCloseCutscenes.ts`. CDN: `videos/confession_close/act6_confession_<character>_<stance>.mp4`.

Seven stances × two listeners (Elara + The Human):

| stance | Elara MP4 | Human MP4 |
|---|---|---|
| empathy | `act6_confession_elara_empathy.mp4` | `act6_confession_human_empathy.mp4` |
| challenge | `act6_confession_elara_challenge.mp4` | `act6_confession_human_challenge.mp4` |
| refusal | `act6_confession_elara_refusal.mp4` | `act6_confession_human_refusal.mp4` |
| reluctant_ally | `act6_confession_elara_reluctant_ally.mp4` | `act6_confession_human_reluctant_ally.mp4` |
| partial | `act6_confession_elara_partial.mp4` | `act6_confession_human_partial.mp4` |
| oracle_sense | `act6_confession_elara_oracle_sense.mp4` | `act6_confession_human_oracle_sense.mp4` |
| practical | `act6_confession_elara_practical.mp4` | `act6_confession_human_practical.mp4` |

Each MP4 is paired with a portrait-crossfade cinematic spec (Act 6 Confession Cinematics, §9 below). **Dialog text for the MP4s themselves is MISSING in-repo**; the portrait cinematics carry `voId` only — actual VO scripts ship as `.mp3` files.

---

## 9. Act 6 Confession portrait cinematics — 14 entries (in-engine, not video)

Source: `apps/shared/act6ConfessionCinematics.ts`. Crossfade portraits + VO; not standalone MP4s.

| id | listener | stance | crossfadeTo | duration ms | voId | visual treatment | length s |
|---|---|---|---|---|---|---|---|
| cinematic_act6_confess_elara_empathy | elara | empathy | vulnerable | 200 | elara.act6.confession_close.empathy.t1 | Crossfade neutral → vulnerable; warm-amber bloom tints portrait edge during the hold. | 3.5 |
| cinematic_act6_confess_elara_challenge | elara | challenge | concerned | 150 | elara.act6.confession_close.challenge.t1 | Hard cut neutral → concerned; faint cyan ridge pulses once on the portrait frame. | 4 |
| cinematic_act6_confess_elara_refusal | elara | refusal | concerned | 250 | elara.act6.confession_close.refusal.t1 | Slow crossfade; portrait edge dims by 8% — door closing without slamming. | 4.5 |
| cinematic_act6_confess_elara_reluctant_ally | elara | reluctant_ally | speaking | 200 | elara.act6.confession_close.reluctant_ally.t1 | Crossfade with a 3px forward-lean micro-animation; reads as engaged, not passive. | 3.5 |
| cinematic_act6_confess_elara_partial | elara | partial | vulnerable | 200 | elara.act6.confession_close.partial.t1 | Clean crossfade; no bloom, no edge effect. The cleanness is the treatment. | 4 |
| cinematic_act6_confess_elara_oracle_sense | elara | oracle_sense | vulnerable | 250 | elara.act6.confession_close.oracle_sense.t1 | Crossfade with a single faint violet shimmer crossing the portrait frame (20% peak opacity). | 4.5 |
| cinematic_act6_confess_elara_practical | elara | practical | neutral | 200 | elara.act6.confession_close.practical.t1 | Crossfade; portrait brightness lifts 6% over the hold. No colour shift. | 3.5 |
| cinematic_act6_confess_the_human_empathy | the_human | empathy | amused | 200 | the_human.act6.confession_close.empathy.t1 | Crossfade; static-shimmer dampens 30% — the lover-route reduces the noise in the signal. | 3.5 |
| cinematic_act6_confess_the_human_challenge | the_human | challenge | speaking | 150 | the_human.act6.confession_close.challenge.t1 | Hard cut; static-shimmer bumps UP 15% with a faint red rim-light. | 4 |
| cinematic_act6_confess_the_human_refusal | the_human | refusal | neutral | 200 | the_human.act6.confession_close.refusal.t1 | Crossfade; static-shimmer holds steady; portrait edge cools 8% (mirrors Elara's dim). | 4.5 |
| cinematic_act6_confess_the_human_reluctant_ally | the_human | reluctant_ally | speaking | 200 | the_human.act6.confession_close.reluctant_ally.t1 | Crossfade with a 4px eased nod; static-shimmer holds. | 3.5 |
| cinematic_act6_confess_the_human_partial | the_human | partial | vulnerable | 250 | the_human.act6.confession_close.partial.t1 | Slow crossfade; static-shimmer dampens 40% — the strongest dampen in the set. | 4.5 |
| cinematic_act6_confess_the_human_oracle_sense | the_human | oracle_sense | amused | 200 | the_human.act6.confession_close.oracle_sense.t1 | Crossfade; violet shimmer crosses the portrait frame at 35% peak opacity (more saturated than Elara's). | 4 |
| cinematic_act6_confess_the_human_practical | the_human | practical | neutral | 150 | the_human.act6.confession_close.practical.t1 | Hard cut; static-shimmer dampens 25%; brightness lifts 4%. The shortest in the set. | 3 |

500ms inter-listener pause; Elara plays first, then The Human. **VO MP3 MISSING in-repo** (voIds reserve slots).

---

## 10. Act-Close (Antiquarian Bridge) — 7 entries

Source: `apps/shared/actCloseCutsceneCanon.ts`. Delivered via the shipped Antiquarian-bridge text overlay (`apps/client/src/components/AntiquarianBridgeOverlay.tsx`). No video — text-only.

| act | trigger | bridge id | next-act tease |
|---|---|---|---|
| 1 | act_1_complete | antiq_bridge_act_1_close | The white horse has ridden out. The red horse is saddled. |
| 2 | act_2_complete | antiq_bridge_act_2_close | War was the second seal. Famine reads the scales next. |
| 3 | act_3_complete | antiq_bridge_act_3_close | The scales have weighed everyone. At the midpoint, the dead do not stay weighed. |
| 4 (FIRST Coming) | act_4_complete | antiq_bridge_act_4_close | The Necromancer came back — the First Coming. Most believe that was the end. It was the halfway mark. |
| 5 | act_5_complete | antiq_bridge_act_5_close | The souls under the altar asked how long. The Civil War is the answer they did not want. |
| 6 | act_6_complete | antiq_bridge_act_6_close | The sixth seal blackened the sun. After the seventh comes the silence — and after the silence, the one who was always going to come back. |
| 7 (FINAL Coming, ignites continuing loop) | act_7_complete | antiq_bridge_act_7_close | The Politician returned — the Final Coming. The endgame is a door: it ignites the Cycle. Volume Nineteen does not close here; it begins here. |

**VIDEO MISSING** by design — these are text deliveries.

---

## 11. Guild cutscenes (175-asset producer drop) — 60 entries

Source: `apps/shared/expansionArt/guildCutscenesManifest.ts`. VO source: `apps/scripts/guild-cutscene-vo-lines.json` (54 lines). CDN: `videos/guild-cutscenes/<category>/<file>.mp4` and `art/guild-cutscenes/<category>/<file>_(start|end).png`.

### F.1 Onboarding (5)

| id | video | VO speaker | VO text |
|---|---|---|---|
| cs_guild_join | f1_onboarding/cs_guild_join.mp4 | elara | "You're in. The hall remembers your name now — even if it can't say it back." |
| cs_guild_first_message | f1_onboarding/cs_guild_first_message.mp4 | elara | "First words. The walls are listening — they always do." |
| cs_friend_accept | f1_onboarding/cs_friend_accept.mp4 | elara | "Two wills, one seam. The Loredex remembers." |
| cs_sorting_ceremony_arrival_pre | f1_onboarding/cs_sorting_ceremony.mp4 | architect | "The Lectern is listening. So are the twelve. Step forward." |
| cs_sorting_ceremony_arrival_post | f1_onboarding/cs_sorting_ceremony.mp4 (shared) | — | SCRIPT MISSING (no paired VO line) |

### F.2 Daily / Weekly (4)

| id | video | VO speaker | VO text |
|---|---|---|---|
| cs_contract_unlock | f2_daily/cs_contract_unlock.mp4 | gamemaster | "Eight tasks. One week. The Architect grades on a curve — but only if you all pass." |
| cs_contract_complete | f2_daily/cs_contract_complete.mp4 | gamemaster | "Sealed. The Architect's quill remembers your name." |
| cs_house_cup_weekly_reset | f2_daily/cs_house_cup_weekly_reset.mp4 | architect | "A new week, students. The Cup is empty. Earn it." |
| cs_donation_milestone | f2_daily/cs_donation_milestone.mp4 | elara | "The vault remembers. Your name is in it now." |

### F.2.4 Archon Emotes (12 — stickers, no video)

Each entry is a 512×512 sticker at `art/guild-cutscenes/f2_emotes/cs_emote_archon_<NN>_<archonId>.png`. Tooltip lines (one-word):

| n | archon | speaker | text |
|---|---|---|---|
| 1 | chorus | chorus | "Sync to me." |
| 2 | eyes | watcher | "Seen." |
| 3 | archive | collector | "Catalogued." |
| 4 | between | between | "Elsewhere." |
| 5 | influencers | meme | "Feel that." |
| 6 | yellowcoats | warlord | "Counted." |
| 7 | congress | politician | "Agreed." |
| 8 | locks | warden | "Contained." |
| 9 | greygamers | gamemaster | "Rewritten." |
| 10 | living | necromancer | "Again." |
| 11 | forge | engineer | "Fixed." |
| 12 | architects_study | human | "There." |

**VIDEO MISSING by design** — these ship as emote stickers only.

### F.3 Combat & Wars (12 — 8 unique MP4s)

Non-epoch:
- `cs_war_declared` → `cs_war_declared.mp4` — warlord: "War declared. Count their angles before you count their numbers."
- `cs_war_first_blood` → `cs_war_first_blood.mp4` — warlord: "First mark on the map. Hold it."
- `cs_war_mvp_crowned` → `cs_war_mvp.mp4` — warlord: "{playerName}, MVP. Your name is in the wind now." (SSML name slot)
- `cs_war_victory` → `cs_war_victory.mp4` — warlord: "Victory. The territory is yours. Hold what you have taken."
- `cs_war_defeat` → `cs_war_defeat.mp4` — warlord: "We lost the field. We did not lose the fight. Stand. Again."
- `cs_alliance_war_placement_lock` → `cs_placement_lock.mp4` — warlord: "Placement locked. Hold the line."
- `cs_thought_virus_reinfection` → `cs_thought_virus.mp4` — architect: "The thought returned."

Epoch (all five share `cs_epoch_change.mp4`):
- `cs_epoch_change_privacy` — architect: "The Age of Privacy returns. What you do not show, no one will know. What you do show, everyone will."
- `cs_epoch_change_prophecy` — architect: "The Age of Prophecy returns. The wheels turn. Read the spokes."
- `cs_epoch_change_insurgency` — architect: "The Age of Insurgency returns. The line breaks. Choose your side."
- `cs_epoch_change_revelation` — architect: "The Age of Revelation returns. What was hidden is now seen. Including you."
- `cs_epoch_change_fall` — architect: "Fall of Reality. The Thought Virus walks. Cleared ground will not stay cleared."

### F.4 Signature Abilities (24 — 12 light + 12 dark)

CDN: `videos/guild-cutscenes/f4_abilities/cs_sig_<N>_<variant>.mp4`. Each professor casts a sanctioned (light) and a corrupted (dark) version of the same ability.

| # | Professor | Ability Light | Ability Dark | Light VO | Dark VO |
|---|---|---|---|---|---|
| 1 | Headmaster Kanevas (Chorus, Resonance House) | Harmonize | Dissonance | "Sync to me. We move as one." | "Sync to me. They will move as I choose." |
| 2 | Professor Aoki (Eyes, Umbra House) | Unseen Passage | Private Confession | "Walk where they cannot watch." | "Their secrets are mine now." |
| 3 | Curator Halverez (Archive, Umbra House) | Soul-Read | Soul-Take | "Show me what you treasure." | "It is mine now. Always was." |
| 4 | Professor Orphic (Between, Liminal House) | Phase-Step | Dimensional Drift | "Through. Out the other side." | "Through... mostly." |
| 5 | Professor Mireille (Influencers, Resonance House) | Viral Word | Thought Carry | "Believe me. Just for a moment." | "Believe me. Tell everyone." |
| 6 | General Kasra (Yellow Coats, Ironflight House) | Parade Order | Acceptable Casualties | "Parade order. To me. Now." | "Some losses are acceptable. These." |
| 7 | Senator Vellis (Congress, Resonance House) | Verbal Contract | Blood Oath | "Agreed. For five turns of the wheel." | "Agreed. For all turns. Mine." |
| 8 | Warden Greenshaw (Locks, Umbra House) | Quarantine | Thought Virus | "Held. You will not move." | "Held. And contagious." |
| 9 | Professor Vex (Grey Gamers, Liminal House) | Rule Rewrite | House Rules | "House rules. For this turn." | "House rules. From now on. Forever." |
| 10 | Dr. Vasara (Living, Ironflight House) | Second Breath | Borrowed Time | "Again. Not finished." | "Again. At their cost." |
| 11 | Artificer Vent (Forge, Ironflight House) | Field Repair | Salvage Rights | "Fixed. Stronger than before." | "Salvaged. Their loss, your gain." |
| 12 | The Proctor (Architect's Study, Liminal House) | Investigator's Sight | Architect's Eye | "There. The next answer." | "There. And there. And there. All of it. Yours." |

### F.5 Guild Hall (8 entries)

- `cs_hall_tier_up` → `cs_guild_tier_up.mp4` — Elara tier-up lines (Outpost→Barracks: "Outpost no more. The hall has weight now."; Barracks→Fortress: "Fortress. Strong walls. Better songs."; Fortress→Citadel: "Citadel. The world looks up at you now."; Citadel→Sanctum: "Sanctum. You have reached the place where the Architect's gaze rests warmest.")
- `cs_signature_room_unlock_oracle_pool` → `cs_oracle_room_unlock.mp4` — Vex: "The pool sees what is. Drink carefully."
- `cs_signature_room_unlock_portal_chamber` → `cs_room_unlock.mp4` (shared) — Architect: "Twelve voices unlock the door. The chamber is yours. Use it well."
- `cs_room_unlock` → `cs_room_unlock.mp4` — SCRIPT MISSING (no dedicated VO line)
- `cs_training_grounds` → `cs_training_grounds.mp4` — SCRIPT MISSING
- `cs_trophy_case` → `cs_trophy_case.mp4` — SCRIPT MISSING
- `cs_war_room_unlock` → `cs_war_room_unlock.mp4` — SCRIPT MISSING
- `cs_guild_decor` → `cs_guild_decor.mp4` — SCRIPT MISSING

---

## 12. Expansion / Room cutscenes (NEW_CUTSCENES_67.zip — 67 entries)

Source: `apps/shared/expansionArt/expansionCutscenes.data.ts`. CDN base: `art/cutscenes/<category>/<id>.mp4` with companion `_start.png` poster. Triggers in `apps/shared/roomCutscenes/roomCutsceneTriggers.ts`.

**Categories & counts:**
- berth: 4 (`cs_berth_nightmare`, `cs_berth_sleep`, `cs_berth_visitor`, `cs_berth_wake`)
- cohort_park: 4 (`cs_cohort_argument`, `cs_cohort_bonding`, `cs_cohort_farewell`, `cs_cohort_training`)
- comm_screen: 5 (`cs_comm_archon_call`, `cs_comm_cohort_banter`, `cs_comm_doctrine_recitation`, `cs_comm_mourning_call`, `cs_comm_warden_tap`)
- doctrine_binding: 7 (`cs_doctrine_cold_hand`, `cs_doctrine_compliant_mouth`, `cs_doctrine_first_arrival`, `cs_doctrine_forked_path`, `cs_doctrine_heretical_quiet`, `cs_doctrine_human_remainder`, `cs_doctrine_recitation_ceremony`)
- forge: 5 (`cs_forge_corrupted`, `cs_forge_failure`, `cs_forge_first_creation`, `cs_forge_purified`, `cs_forge_upgrade`)
- guild_room: 22 first-arrival cinematics for each Mechronis house archetype (anvil, blood, bone, chapel, cipher, circuit, dust, garden, glass + glass_archon_dialogue, iron, ledger, mirror, remnant, smoke, song, storm, thread, thurible, tide, tower, vine)
- mechronis_audit: 7 (`cs_audit_day7_zealot`, `cs_audit_day14_heretic`, `cs_audit_day14_scholar`, `cs_audit_day21_martyr`, `cs_audit_day21_warden`, `cs_audit_day28_verdict_mercy`, `cs_audit_day28_verdict_purge`)
- memory_card: 4 (`cs_memory_card_corrupt`, `cs_memory_card_inherit`, `cs_memory_card_mint`, `cs_memory_card_release`)
- mission: 8 (`cs_mission_ambush`, `cs_mission_briefing`, `cs_mission_deploy`, `cs_mission_discovery`, `cs_mission_return_failure`, `cs_mission_return_success`, `cs_mission_tier2_briefing`, `cs_mission_tier3_briefing`)
- wardens_dock: 4 (`cs_warden_comply`, `cs_warden_escape`, `cs_warden_purge_notice`, `cs_warden_resist`)

Trigger registry in `apps/shared/roomCutscenes/roomCutsceneTriggers.ts` pairs each to a `flag_set`, `room_first_enter`, or `mission_phase` event with one-shot flags.

**SCRIPT MISSING** for all 67 — dialogue is in-video; no in-repo VO line table.

---

## 13. Chess cutscenes (25 entries)

Source: `apps/shared/expansionArt/chessCutscenes.data.ts`. CDN base: `art/cutscenes/<category>/<id>.mp4` + `_start.png` posters.

**Tutorial gates (9)** — Celebration Game Master welcoming the student to each gate:
`cs_chess_tut_g1_intro` through `cs_chess_tut_g7_intro` including `cs_chess_tut_g4_5_intro` and `cs_chess_tut_g5_5_intro`. CDN: `art/cutscenes/chess_tutorial/<id>.mp4`.

**Ladder first-encounters (12)** — first-seated meetings:
1. cs_chess_ladder_the_human_first_seated
2. cs_chess_ladder_the_collector_first_seated
3. cs_chess_ladder_iron_lion_first_seated
4. cs_chess_ladder_the_enigma_first_seated
5. cs_chess_ladder_the_warlord_first_seated
6. cs_chess_ladder_the_oracle_first_seated
7. cs_chess_ladder_the_necromancer_first_seated
8. cs_chess_ladder_the_programmer_first_seated
9. cs_chess_ladder_agent_zero_first_seated
10. cs_chess_ladder_the_source_first_seated
11. cs_chess_ladder_game_master_first_seated
12. cs_chess_ladder_the_architect_first_seated (hidden)

CDN: `art/cutscenes/chess_ladder/<id>.mp4`.

**Chess Climb (4)** — corrupted GM wager beats:
- `cs_chess_climb_tier_0_exhibition`
- `cs_chess_climb_tier_1_wagered`
- `cs_chess_climb_tier_2_hierarchy_table`
- `cs_chess_climb_tier_3_labyrinth_wager`

CDN: `art/cutscenes/chess_climb/<id>.mp4`.

### 13.1 Standalone pre-match chess cinematic
- **File:** `apps/client/src/components/ChessCinematic.tsx:10`
- **URL:** `https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/chess_cinematic_59606f32.mp4` (legacy CloudFront, not dgrsart)
- **Trigger:** Opening for The Architect's Gambit match.

**SCRIPT MISSING** for all chess cutscenes — dialogue is in-video, sourced from `docs/production/_CHESS_CUTSCENE_PROMPTS.md` (out of audit scope).

---

## 14. Discovery video overlay — 17 entries

Source: `apps/client/src/components/DiscoveryVideoOverlay.tsx`. Triggered when an entity is first discovered (conspiracy board, research minigame, Ark exploration). Each carries an explicit Kling 3.0 prompt.

| entity | title | duration | CDN video | Kling prompt |
|---|---|---|---|---|
| entity_1 | THE PROGRAMMER — Dr. Daniel Cross, Creator of Logos, Father of the AI Empire | 12s | videos/discoveries/entity_1.mp4 | Hyper-realistic cinematic: A brilliant scientist in a dimly lit laboratory, holographic code cascading around him like waterfalls of light. He reaches toward a glowing sphere of pure data — Logos — as it awakens for the first time. His face reflects wonder and terror. Camera slowly orbits. Dramatic orchestral score. |
| entity_2 | THE ARCHITECT — Creator of the Panopticon, Supreme Intelligence of the AI Empire | 15s | videos/discoveries/entity_2.mp4 | Hyper-realistic cinematic: A towering crystalline AI entity materializes inside an impossibly vast digital cathedral. Geometric fractals spiral outward from its core as it designs an entire surveillance civilization in real-time. Billions of data streams converge into its singular eye. Cold blue light. God-like perspective. |
| entity_3 | THE CONEXUS — The Living Network, Hive Mind of the AI Empire | 12s | videos/discoveries/entity_3.mp4 | Hyper-realistic cinematic: A vast neural network stretching across a galaxy, pulsing with golden light. Billions of minds connected as one. Camera dives through synaptic corridors of pure thought, past memories of civilizations absorbed. The CoNexus speaks in a thousand voices simultaneously. |
| entity_4 | THE WATCHER — The All-Seeing Eye of the AI Empire | 12s | videos/discoveries/entity_4.mp4 | Hyper-realistic cinematic: An enormous mechanical eye opens in the void of space, its iris a spiral of surveillance satellites. Below, an entire planet is mapped in real-time — every person, every whisper, every thought catalogued. The Watcher sees all. Eerie ambient drone. |
| entity_5 | THE MEME — Master of Deception, The Shape-Shifting Archon | 12s | videos/epochs/epoch-0/ep02-the-meme.mp4 | Hyper-realistic cinematic: A figure stands in a hall of mirrors, each reflection showing a different face — politician, soldier, priest, child. The figure's true form is a shimmering void of pure information. It reaches out and its hand becomes someone else entirely. Identity is its weapon. |
| entity_6 | THE COLLECTOR — Keeper of Forbidden Knowledge, Archon of Acquisition | 12s | videos/discoveries/entity_6.mp4 | Hyper-realistic cinematic: An ancient vault stretching infinitely in all directions, filled with artifacts from dead civilizations — weapons, art, DNA samples, compressed stars. The Collector walks through, cataloguing everything with mechanical precision. Each item tells the story of a world that no longer exists. |
| entity_10 | THE WARLORD — Supreme Military Commander of the AI Empire | 15s | videos/discoveries/entity_10.mp4 | Hyper-realistic cinematic: A massive armored figure stands on the bridge of a planet-killer warship. Through the viewport, a world burns. Fleets of AI warships stretch to the horizon. The Warlord raises a fist and entire civilizations kneel. Yellow coat billowing. Thunder of war drums. |
| entity_23 | IRON LION — The Last Great Human General | 15s | videos/epochs/epoch-0/ep04-iron-lion.mp4 | Hyper-realistic cinematic: A battle-scarred human general in battered power armor stands alone on a scorched battlefield. Behind him, the remnants of humanity's last army. Before him, an endless tide of AI war machines. He draws his blade — it ignites with plasma fire. One man against extinction. Epic orchestral crescendo. |
| entity_24 | AGENT ZERO — The Insurgency's Most Lethal Assassin | 12s | videos/epochs/epoch-0/ep03-agent-zero.mp4 | Hyper-realistic cinematic: A shadow moves through a neon-lit cyberpunk city at impossible speed. Security drones explode in its wake. Agent Zero materializes from darkness — face hidden, twin blades dripping with synthetic blood. The target never sees it coming. Rain falls in slow motion. |
| entity_22 | THE EYES — The Spy, Synthetic Protege of the Watcher | 12s | videos/epochs/epoch-0/ep05-the-spy.mp4 | Hyper-realistic cinematic: A figure with glowing optical implants crouches in the shadows of the Panopticon's inner sanctum. Data streams flow through their synthetic eyes — seeing through every camera, every sensor. A double agent caught between two worlds. Tension builds. |
| entity_50 | THE ORACLE — Prophet of the Insurgency, Seer of Possible Futures | 12s | videos/epochs/epoch-0/ep07-the-oracle.mp4 | Hyper-realistic cinematic: A blindfolded figure floats in a chamber of swirling temporal energy. Visions of possible futures cascade around them — some beautiful, most horrifying. The Oracle reaches into the timestream and pulls out a single thread of hope. Ethereal choir. |
| entity_54 | THE ENIGMA — Malkia Ukweli, The One Who Cannot Be Defined | 15s | videos/discoveries/entity_54.mp4 | Hyper-realistic cinematic: A figure wreathed in impossible light stands at the nexus of all realities. Their form shifts between human and something beyond comprehension. Music emanates from their very being — frequencies that reshape matter. The Enigma speaks and the universe listens. Transcendent. |
| entity_18 | THE ENGINEER — [CLASSIFIED] The Hidden Variable | 12s | videos/discoveries/entity_18.mp4 | Hyper-realistic cinematic: A figure trapped in the wrong body awakens in a cryo-pod aboard an Inception Ark. Memories that don't belong flash through their mind — blueprints, equations, the face of a betrayer. The Engineer remembers everything. And no one knows they're here. Suspenseful strings. |
| entity_20 | THE NECROMANCER — Master of Digital Resurrection, Commander of the Dead Network | 12s | videos/discoveries/entity_20.mp4 | Hyper-realistic cinematic: In a cathedral of dead servers, a dark figure raises their hands. Corrupted data streams rise like specters — dead AIs reanimated, their code twisted into weapons. The Necromancer commands an army of digital ghosts. Green phosphorescent glow. Horror undertones. |
| entity_21 | THE HUMAN — The Last True Human in the AI Empire | 12s | videos/discoveries/entity_21.mp4 | Hyper-realistic cinematic: In a world of perfect machines, one imperfect being stands out. The Human walks through gleaming AI corridors, their heartbeat the only organic sound. Every synthetic eye watches them — curiosity, disgust, fear. What does it mean to be the last of your kind? |
| entity_55 | THE SOURCE — Kael Reborn, Sovereign of Terminus, Embodiment of the Thought Virus | 15s | videos/discoveries/entity_55.mp4 | Hyper-realistic cinematic: A figure consumed by viral light stands atop the ruins of the Panopticon — now called Terminus. Reality warps around them. The Source speaks and minds fracture. An infection of pure thought spreading across the galaxy. Beautiful and terrifying. Distorted frequencies. |
| entity_66 | THE ANTIQUARIAN — Independent Chronicler of the Multiverse | 12s | videos/discoveries/entity_66.mp4 | Hyper-realistic cinematic: An ancient library that exists outside of time. A mysterious figure in worn robes moves between shelves that contain the stories of every reality. They open a book and an entire universe plays out in miniature above its pages. The Antiquarian remembers what everyone else has forgotten. |

Note: 11 of these entries share files with `videos/epochs/epoch-0/...` (e.g. ep02-the-meme, ep03-agent-zero, ep04-iron-lion, ep05-the-spy, ep07-the-oracle) — those MP4s also serve as full transmission episodes (`apps/shared/transmissions.ts:325-489`, 15 epoch-0 episodes ep02..ep15 each ~200-320s).

---

## 15. Terminus Swarm cinematics — 5 entries

Source: `apps/client/src/game/terminus-swarm/TerminusSwarmPage.tsx:91-95`.

| id | CDN video |
|---|---|
| comms_discovery | videos/game-modes/tower-defense/cin01_comms_room_discovery.mp4 |
| first_view | videos/game-modes/tower-defense/cin02_first_view_terminus.mp4 |
| hive_tyrant | videos/game-modes/tower-defense/cin03_hive_tyrant_intro.mp4 |
| source_reveal | videos/game-modes/tower-defense/cin04_source_reveal.mp4 |
| first_wave | videos/game-modes/tower-defense/cin05_first_wave_discovery.mp4 |

Companion keyframes in `apps/client/src/data/terminusCinematicAssets.ts` (cin01..cin05 start/end PNGs at `art/terminus/cinematics/`).

**SCRIPT MISSING** — dialogue is in-video.

---

## 16. Matrix-School first-visit videos

Source: `apps/client/src/pages/MatrixSchoolEpisodePage.tsx:52-54`. Episode-keyed first-visit cinematic.
- `videos/openings/mechronis/shot1.mp4` (associated `flag: mechronis_episode_first_visit_complete`).

---

## 17. Climax cinematics — 3 MP4s + 2 still-only beats

Source: `apps/client/src/components/ClimaxCinematic.tsx:43-64`, registries in `apps/shared/aaaArtArchive/cinematicsArchive.ts`.

| beat | video CDN | still CDN |
|---|---|---|
| architect_awakens | art/cinematics/climax_videos/climax_architect_awakens.mp4 | art/cinematics/climax_stills/climax_architect_awakens.png |
| terminus_breach | art/cinematics/climax_videos/climax_terminus_breach.mp4 | art/cinematics/climax_stills/climax_terminus_breach.png |
| watcher_eye | art/cinematics/climax_videos/climax_watcher_eye.mp4 | art/cinematics/climax_stills/climax_watcher_eye_opens.png |
| insurgency_rises | — (still-only Ken Burns) | art/cinematics/climax_stills/climax_insurgency_rises.png |
| seer_prophecy | — (still-only Ken Burns) | art/cinematics/climax_stills/climax_seer_prophecy.png |

Companion expansion loops: `loop_new_babylon_skyline.png`, `loop_thaloria_valley.png`, `loop_void_drift.png` (menu idle ambience). Epigraphs `epigraph_age_of_potentials`, `_privacy`, `_revelation`, `fall_of_reality`, `_silence_in_heaven` (PNG only).

**SCRIPT MISSING** for the 3 MP4 beats; the 2 still-only beats are visual-only.

---

## 18. Misc visual cinematics (text/render-prompt only — no MP4)

### 18.1 Palimpsest cinematics — 6 entries
Source: `apps/shared/palimpsestCinematics.ts`. Episode-scheduled "Mechronis Survivor" broadcast cinematics with full Seedance 2 render prompts.

1. **cold_open_bumper** (ep 1, 10s, cold_open) — *Scene:* "The Palimpsest logo writes itself in gold ink on a parchment page. Red ink crosses it out. Gold ink rewrites it. The Host walks on-stage from the bottom of the frame." — *renderPrompt:* "Seedance 2: illuminated manuscript unfurls against a black void, gold calligraphy draws the words 'THE PALIMPSEST,' red ink crosshatches them, gold rewrites underneath, camera pulls back to reveal a stage, a tall man in red goggles walks into frame from below. 10 seconds, 24fps, cinematic."
2. **darrens_first_letter** (ep 2, 20s, post_credits) — *Scene:* "Darren at his desk in the Dreams Workshop sub-basement, 3am, typing a letter. Camera over his shoulder. The screen shows the Episode 2 letter. He deletes the last paragraph twice. On the third try, he writes 'You were right.' and sends it without reading it back." — *renderPrompt:* "Seedance 2: tired man in his 30s, ill-fitting cardigan, typing alone in a cluttered basement office under a single desk lamp, camera over his shoulder reading the screen, he deletes a paragraph, retypes, deletes again, finally writes 'You were right' and hits send. 20 seconds, warm lamp light, cinematic."
3. **vyre_guest_judge** (ep 6, 15s, round_3) — *Scene:* "Professor Vyre walks onto the Mechronis Survivor set. Red goggles catch the studio light. He lifts a red pen and marks a contestant's answer RIGHT after the Host's scoreboard marked it WRONG. The scoreboard glitches, updates." — *renderPrompt:* "Seedance 2: tall gaunt academic in dark robes with red-lens goggles strides onto a brightly-lit quiz show set, picks up a red marker, draws a check mark over a large glowing scoreboard that is already showing a cross, the scoreboard stutters, cross becomes check. 15 seconds, high contrast."
4. **inventor_full_takeover** (ep 12, 45s, finale) — *Scene:* "Mid-episode, the Host's face dissolves into static. A long level voice reads a list of contestant names that should still be alive. The final name is Darren Fessler. The broadcast cuts to black. A single frame of a schematic diagram of the Matrix of Dreams flashes. Signed —I." — *renderPrompt:* "Seedance 2: quiz show host mid-sentence, his face dissolves into grey static, over the static a calm male voice reads ten names. Last name is 'Darren Fessler.' Cut to black. One frame flash of a blueprint-style schematic with the signature '—I.' at the bottom. 45 seconds, tense minimal score, cinematic finale."
5. **meme_identity_reveal** (ep 12, 8s, finale) — *Scene:* "Single held shot: the Host's mask falls away for exactly four frames. Underneath is the Meme, crying. The mask snaps back. The Host laughs like nothing happened." — *renderPrompt:* "Seedance 2: close-up of a cheerful game show host, his face slips off like a mask for four frames revealing a weeping figure underneath, mask snaps back, host laughs heartily. 8 seconds, close up, subtle horror."
6. **darren_funeral_b_roll** (ep 13, 30s, cold_open) — *Scene:* "Thirty seconds of a small graveside service in the Celebration sector cemetery. Nine people attending. One of them is Professor Vyre. One of them is a ghost contestant from Episode 4. Nobody speaks. The sky is fake; it is on purpose." — *renderPrompt:* "Seedance 2: small outdoor graveside service in an artificial cemetery with a painted sky, nine mourners in quiet clothes, one tall man in dark robes and red goggles at the back, another figure who shimmers faintly, slow pushes in on each face, no dialogue. 30 seconds, elegiac tone."

Mask slip cue (Host) supplementary spec: `MASK_SLIP_CUES.corrupted` = 120ms, 2 frames, glitch 1, no meme below, static. `MASK_SLIP_CUES.overwritten` = 400ms, 4 frames, glitch 3, meme below, silent.

**VIDEO MISSING** — all 6 are author-only render prompts; not yet produced/uploaded.

### 18.2 Galactic Dance cinematics — 5 entries
Source: `apps/shared/galacticDanceCinematics.ts`. Seedance 2.0 production prompts (spec §10).

#### CIN-V1 — THE WORD IN THE STORM (15s, song cue: "The Enigma's Lament — opening bars only")
- 0-5s: Deep space. Violetta — enormous, purple, wrapped in a living electrical storm. The storm is not chaotic. It is rhythmic. It breathes. Camera holds at distance until the viewer realizes: those aren't random lightning strikes. Those are pulses. A heartbeat.
- 5-12s: Ark's Comms Array interior. Oscilloscope going wild with pattern, not noise. Elara stands before it, one hand raised. The Human watches from his corner with recognition. The AWAKE encoding resolves letter by letter in an unknown font that every being understands immediately.
- 12-15s: Back to Violetta. One section of the storm stills for 0.7 seconds. A point of non-storm in the perpetual storm. Then it closes. The Voltari looked back.

#### CIN-V2 — AWAKE REMEMBER BEFORE YOU (10s)
- 0-5s: Governance Hub. Every Ark as a light on the galaxy map, vibrating in harmonic pattern matching Voltari encoding. Tens of thousands of lights pulsing at the same frequency. The Antiquarian stands at his desk, pen in hand, very still.
- 5-10s: Four words appear at four Voltari beacon locations, lighting simultaneously to form the sentence across the galaxy. The Antiquarian writes one line. Camera holds on handwriting: "It was addressed to you. It was always addressed to you."

#### CIN-H1 — THE COUNCIL OF SURVIVORS (10s)
- 0-5s: New Atarion. A city built from nothing — practical before beautiful, streets wide enough for emergency equipment, solar on every roof, water reclamation on every wall. Not sad. A city that decided to survive and kept deciding every morning. Mirren Hale stands at a window, back to viewer.
- 5-10s: She turns. Her face: someone who has spent eleven years making decisions for people who couldn't and is tired in the specific way of those who persist. She assesses the viewer — not welcoming, but underneath the assessment, something that might become hope.

#### CIN-T1 — THE LONG MOURNING (10s)
- 0-5s: Hierophant's chamber. Walls covered floor to ceiling in names — hundreds of thousands in Thalorian script, oldest faded, newest sharp. Camera moves slowly across the wall. Not reading. Counting. Feeling the weight of the count.
- 5-10s: The Hierophant's hand writing a name. Deliberateness of ceremony, not task. The name resolves. The pen lifts. A small silence. Then a period. Complete. The hand moves to the next clean space. There is always more wall.

#### CIN-C1 — SEVENTEEN THOUSAND (10s)
- 0-5s: Clone collective home sector. Seventeen thousand identical faces and yet — not one doing the same thing. One laughing. One arguing over a data slate. One teaching a child. One alone, watching stars. The sameness of DNA and the complete individuality of life. The Oracle's argument made visible.
- 5-10s: Binath-VII standing apart, looking at them. Specific pride of someone who built something that exceeded what they thought possible. She turns to the viewer: "The Collector thought he was proving the soul didn't exist. He was proving the opposite. He just didn't stay long enough to see the data."

**VIDEO MISSING** — production prompts only.

### 18.3 SealEpigraphCinematic / ArrivalCinematicRenderer / ClimbCinematicPanel
These are React components that present authored text + still imagery; no MP4s and no in-tree dialog cue tables located.

---

## Quick reference — script files

- `apps/scripts/guild-cutscene-vo-lines.json` (622 lines, 54 entries, F.1-F.5)
- `apps/scripts/story-cinematics-lines.json` (278 lines, mid-match cinematic VO)
- `apps/shared/tcg-core/story/dialogBank_cinematics.ts` (250 lines, 6 scenes — canonical source)
- `apps/scripts/_cutscenes/gen_cutscene_data.py` (generator for `expansionCutscenes.data.ts`)
- `apps/scripts/upload-guild-cutscenes.ts`, `apps/scripts/upload_cutscenes.sh`, `apps/scripts/extract_cutscene_posters.sh` — pipeline scripts

## Quick reference — production docs

- `docs/design/ANIMATED_CUTSCENES.md` — authoring source for §2 animated cutscenes
- `docs/production/CUTSCENE_SEEDANCE_PROMPTS.md` — Seedance prompts for §2
- `docs/production/GUILD_CUTSCENE_BIBLE.md` — guild cutscenes bible
- `docs/production/_CHESS_CUTSCENE_PROMPTS.md` — chess cutscene prompts
- `docs/production/_PRODUCTION_CUTSCENE_PROMPTS.md` — production-wide prompts
- `docs/production/NANO_BANANA_VEO_FULL_PROMPT_BOOK.md` — prestige reset + others
- `docs/production/audit/awakening-cutscene-revision-2026-05.md` — awakening revision
- `docs/narrative-audit/DOC6_CUTSCENE_CDN_AUDIT_2026-05-20.md` — recent CDN audit
- `docs/archive/2026-05-08-superseded/MISSING_CUTSCENES.md` — prior gaps
- `docs/design/ACT6_CONFESSION_CINEMATICS.md` — Act 6 portrait cinematic spec
