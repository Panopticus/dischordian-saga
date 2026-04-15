# PRELUDE SHIP-READY ASSET BIBLE — Dischordian Saga

> **Purpose:** Every art still, cinematic key-frame, voice-over line, and VFX effect required to ship the **Prelude** (the opening hour of Dischordian Saga, before the player meets a single living NPC). One document, grouped by narrative beat, with tool-specific prompts ready to copy-paste.
>
> **Date:** 2026-04-14
> **Scope:** 15 narrative beats — Rev 5 Beats A through J plus the Rev 6 breath beats A.5, C.5, D.5, F.5, H.5. All sources reconciled from `docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md` Parts I + VI, `docs/design/ANIMATED_CUTSCENES.md`, `docs/production/SHIP_READY_ASSET_BIBLE.md`, `docs/production/VOICE_OVER_BIBLE.md`, `apps/shared/preludeCrew.ts`, `apps/shared/preludeRoomGate.ts`, `apps/shared/engineerRecordings.ts`.
>
> **Branch:** `claude/game-narrative-design-lIeB5`
>
> **Companion documents — read first, do not duplicate:**
> | Doc | What it already covers | What this doc adds |
> |---|---|---|
> | `SHIP_READY_ASSET_BIBLE.md` | All 46 game-mode art/VO/cinematics post-Prelude | Everything Prelude-specific |
> | `VOICE_OVER_BIBLE.md` | 8 primary + 4 expansion voice profiles, 12 Elara room intros | One **new** voice profile (The Prince) and ~12 **new** Prelude lines |
> | `ANIMATED_CUTSCENES.md` | Cutscene 1 "Awakening" (Beat A) — already canonical | 11 additional Prelude cutscenes (Beats A.5, B, C, C.5, D, D.5, E, F, F.5, G, H, H.5, I, J) |
> | `MISSING_ART_PROMPTS.md` | 10 historical items, all Done | 11 missing Prelude room environments |
> | `MISSING_CUTSCENES.md` | 46 missing cinematics, none Prelude-tagged | All 11 missing Prelude cinematics |

---

## Section 0 — How to Use This Doc

This bible is split into the same three toolchains as `SHIP_READY_ASSET_BIBLE.md`. If you've shipped from that doc, this one works identically.

| Tool | What to feed it | Where in this doc |
|---|---|---|
| **Nano Banana 2** (image generation) | The prose in **Nano Banana 2 prompt** fields. Each prompt is self-contained — paste the whole thing, render at the listed size, save to the listed output path. | §3–§17 (room art + cutscene start/end frames) |
| **Seedance 2.0** (video generation) | The pair of start/end frames you just rendered from Nano Banana 2, plus the **Seedance 2.0 motion prompt**. Seedance takes start image + end image + motion directive + duration. | §3–§17 (cutscenes) |
| **ElevenLabs** (voice-over) | First add the new **Prince** voice profile from §2 to your ElevenLabs Voice Library. Then paste the per-beat CSV blocks (§3–§17) into ElevenLabs Studio → Projects → Import CSV, or feed them to the Python SDK in a loop. Every row → one MP3. | §2 (new profile) + per-beat VO subsections |

**Visual style anchor (applies to every image prompt unless overridden):**
> Dark sci-fi aesthetic. Deep space blacks (#0a0a1a to #010020) as the base. Neon accents: cyan (#22d3ee), foxfire green (#00e676), corrupted red (#ff1744), sacred gold (#fbbf24), violet (#e040fb). Holographic overlays, scanlines, volumetric fog, anamorphic lens flare, cinematic 4K quality with film grain. Cyberpunk meets cosmic horror. Dramatic rim lighting. **No rendered text in images** — overlays are added in code.

**Prelude-specific style modifiers (use in addition to the global anchor):**
- The Ark is **17,000 years old, half-asleep, just waking up**. Every interior should look maintained but exhausted: dust drifting in slow motion, brass-and-bone fixtures softened by 17 millennia of micro-vibration, surface paint worn through to substrate at every grip-point. Nothing is broken — it's just very, very tired.
- Light sources are **practical-only**: emergency floor strips, cyan pod glow, hologram bloom, the occasional shaft of starlight. **No overhead room lighting yet** — the Ark's primary lights don't come back online until Beat I (Bridge).
- A faint **breath-rhythm pulse** (about 1 Hz, sub-15% brightness shift) lives in every emergency strip — the ship is breathing. Render it in the still as a slight hot edge on the closest emergency strip in frame.
- Where the script calls for "five more pods on this row," show **exactly five additional pods** in frame, each with a faint warm cyan glow at the canopy — sleeping, not empty.

**Seedance 2.0 motion prompt style:**
> Verb-led, time-anchored, camera-first. Format: `[camera movement] as [subject action], [beat change at X seconds], [VFX arc], [emotional tone]. 24fps. Cinematic composition.` Keep under 400 characters. Never describe the start or end frame — that's what the key-frame images are for.

**ElevenLabs CSV format (used in every per-beat VO subsection):**
> `id,character,voice_profile,stability,similarity,style,speaker_boost,text,direction,priority`
> Text field may contain ElevenLabs SSML (`<break time="Xms"/>`, `<emphasis level="moderate">`, etc.) and is quoted with doubled inner quotes to be valid CSV.

**Output path conventions used throughout this doc:**
| Asset type | Output path |
|---|---|
| Room environments | `apps/client/public/art/rooms/room-{slug}.{png,webp}` |
| Cutscene videos | `apps/client/public/videos/prelude/{beat-id}-{slug}.mp4` |
| Cutscene start/end frames (intermediate, not shipped) | `assets/intermediate/prelude/{beat-id}-{slug}-{start,end}.png` |
| Voice-over lines | `apps/client/public/audio/{character}/{line-id}.mp3` |
| VFX overlays | `apps/client/public/art/vfx/prelude/{effect-id}.{webm,png}` |

---

## Section 1 — Prelude Master Index

The Prelude is a single uninterrupted hour. The player wakes alone in cryo, walks the length of the Ark, opens an inbox, and pilots the ship out of the graveyard for the first time. There are no living NPCs in the entire Prelude — only Elara (AI), the Human (substrate voice), holographic recordings of the Prince, and one final tribunal. The breath beats (A.5, C.5, D.5, F.5, H.5) were added in Rev 6 to slow the pacing — they are *intentionally* low-stimulus moments. Treat them as such in the art.

| Beat | Title | Room | New art | New cutscenes | New VO lines | New VFX | Priority |
|---|---|---|---|---|---|---|---|
| **A** | Cryo Wake | cryo-bay | 1 | 1 (already canonical in `ANIMATED_CUTSCENES.md`) | 1 (Elara seed) | 3 (frost, hatch, hologram-materialize) | **P0** |
| **A.5** | Corridor First Steps | corridor | 1 | 1 (15s breath) | 0 | 1 (breath-pulse strip) | **P0** |
| **B** | Corridor / Escape | corridor (reuse) | 0 | 1 (20s) | 0 | 1 (door iris) | **P0** |
| **C** | Engineering — Crew Role Choice + Six Incubators | engineering | 1 | 1 (35s) | 1 (Elara seed) | 2 (incubator hum, role-choice glow) | **P0** |
| **C.5** | Window (Breath Beat) | engineering (reuse) | 0 | 1 (20s) | 1 (Human first intimate) | 1 (starfield drift) | **P0** |
| **D** | Cargo Bay — Trade Empire Seed + Locke Mission Board | cargo-hold | 1 | 1 (30s) | 1 (Elara seed) | 2 (mission-board glow, dust shaft) | **P0** |
| **D.5** | Galley (Breath Beat) | galley | 1 | 1 (25s) | 1 (Human sandwich) | 1 (steam) | **P0** |
| **E** | Mess Hall / Prince's Archive | mess-hall | 1 | 1 (45s — flashback) | 2 (Prince) | 3 (sepia drain, film-damage, diploma bloom) | **P0** |
| **F** | Briefing Room — Kael Contingency Memo | briefing-room | 1 | 1 (30s) | 0 | 1 (sealed-log unlock) | **P0** |
| **F.5** | Empty Chair (Breath Beat — 90s silence) | briefing-room (reuse) | 0 | 1 (90s) | 1 (Human, end of scene) | 1 (chair-rim hot edge) | **P0** |
| **G** | Medical Bay | medical-bay | 1 | 1 (25s) | 0 | 2 (neural-rig hum, transfer-array stand-by) | **P0** |
| **H** | NPC Inbox + Locke's First Message | comms-array | 1 | 1 (25s) | 1 (Locke) | 1 (mailbox arrival ping) | **P0** |
| **H.5** | Memo Pile (Breath Beat) | comms-array (reuse) | 0 | 1 (20s) | 0 | 1 (paper drift) | **P0** |
| **I** | Bridge — Witnessing Hub Activate | bridge (reuse) | 0 | 1 (40s) | 0 | 2 (Witnessing radial bloom, primary lights restore) | **P0** |
| **J** | Engineer's Transference / Tribunal | engineering (reuse) | 0 | 1 (60s — climax) | 2 (Prince final, Quinn-as-apprentice-preview reframing line) | 3 (Engineer transference glow, tribunal ring, choice-pillar) | **P0** |
| — | **Cumulative armory backfill** | armory | 1 | 0 | 0 | 0 | **P1** |
| — | **Cumulative captain's quarters backfill** | captains-quarters | 1 | 0 | 0 | 0 | **P1** |

**Totals:**
- **Room environment stills:** 11 (9 P0 + 2 P1)
- **Cutscene videos:** 15 (one per beat; Beat A's render brief already exists in `ANIMATED_CUTSCENES.md` Cutscene 1)
- **New VO lines:** 12 (5 Elara, 4 Human, 2 Prince, 1 Locke)
- **New VFX overlays:** ~22 unique effects, consolidated in §18

**Asset count delta vs `SHIP_READY_ASSET_BIBLE.md`:** This doc adds **40 new asset rows** that were not previously tracked anywhere in production. None duplicate `SHIP_READY_ASSET_BIBLE.md` — that doc covers post-Prelude content only.

---

## Section 2 — New Voice Profile Addition: THE PRINCE (a.k.a. The Engineer)

> **Action required (manual, one-time):** Add the voice profile below to `docs/production/VOICE_OVER_BIBLE.md` Section "CHARACTER VOICE PROFILES" as **Profile 9** (after Narrator). Do not duplicate the prompt anywhere else in the codebase. All Prelude VO subsections in this doc reference the profile by `voice_profile = the_prince`.

### 2.1 Canonical name discipline

The Engineer **does not have a real name**. He was known only as **The Prince** — a title from his pre-Insurgency life on Mechronis Academy that became the only identity left to him after the Empire of Shadows scrubbed his birth records. The "Prince's Archive" referenced in Beat E is canonically *his* archive — see `apps/shared/engineerRecordings.ts` line 99: holo recording 2 is literally titled `holo_princes_notebook` with title "The Prince's Notebook". The Engineer is The Prince.

Where the codebase uses the role label `Engineer` (`engineerRecordings.ts`, `engineerBenchHints.ts`, `engineerGovernanceVotes.ts`, file names), treat that as a **role label, not a personal name**. In any voice line, dossier, log, or subtitle: he is **The Prince**, or referred to in third person as **the Engineer** (lowercase role) or **the Prince** (capitalized title). Never "Engineer" as a name. Never an invented first name. He has only ever been The Prince.

When directly asked his name in any beat (Prelude or later), the canonical response is:

> *"I was The Prince. That's the only name I'm allowed to keep."*

### 2.2 Voice direction

| Attribute | Value |
|---|---|
| **Sex / age** | Male, mid-50s |
| **Mood baseline** | Warm, weary, brilliant, faintly amused |
| **Accent** | Working-class self-taught craftsman on the surface — every fifth or sixth word carries an older, more aristocratic precision he has spent decades trying to bury. The aristocratic register surfaces *involuntarily*, especially on technical vocabulary and on words about people he loved. He never lets it stay. |
| **Pace** | Conversational; slows when explaining something he cares about; slows *further* when afraid (does not raise volume — defuses) |
| **Laugh** | Unexpected, brief, at his own mistakes. Never bitter. Per `engineerRecordings.ts` lines 237–240, "the kid who built impossible things and fell asleep smiling" — that's the smile under everything |
| **Treatment of machines** | Per `engineerRecordings.ts` line 90: *"He'd talk to machines like they were people. And honestly? They listened."* Address every device he handles as if it were a colleague |
| **When afraid** | Quieter, slower, more precise — like he's defusing a bomb. **Never** louder, never broken |
| **Final-recording artifact layer** | Faint hologram-tape artifact (subtle dropout, 0.3-second audio delay tail). Apply to ALL Prince lines in this doc — every line he speaks in the Prelude is a recording, never live |

### 2.3 ElevenLabs prompt (paste directly into Voice Library)

> A warm, weathered male voice, mid-50s. The accent reads working-class on the surface — the voice of a self-taught craftsman who loved what he built — but every fifth or sixth word betrays an older, more aristocratic precision he has spent years trying to bury. The aristocratic register surfaces involuntarily on technical vocabulary and on the names of people he loved. Warmth, wit, unexpected brief laughter at his own failures. He talks to machines as if they were colleagues. When afraid he does not raise his voice — he slows down and becomes gentle, like a man talking through a dangerous procedure. Faint holographic-recording artifact layer on every line: subtle dropout and a 0.3-second delay tail. The voice of a man who was once called Prince, gave it up, and chose sacrifice knowing exactly what it meant.

### 2.4 ElevenLabs voice settings

| Parameter | Value | Rationale |
|---|---|---|
| `stability` | `0.55` | Slight variability so the involuntary aristocratic register can surface naturally |
| `similarity_boost` | `0.85` | Tight clone consistency (he must sound like the same man across all 7 existing recording transcripts in `engineerRecordings.ts`) |
| `style` | `0.35` | Mild stylization — enough warmth, not theatrical |
| `use_speaker_boost` | `true` | Recording artifact layer needs body |

### 2.5 Sample lines for voice library audition

Use any of the existing transcripts in `apps/shared/engineerRecordings.ts` as the audition sample — they are the canonical voice. The most diagnostic single line for cloning is from `holo_princes_notebook` (recording 2):

> *"I borrowed the Game Master's goggles because I was curious. I saw source code. I saw the loop — the 4-year reset, the death traps, my parents living the same lives over and over as props in someone else's play."*

The shifts to listen for: "borrowed" (working-class), "Game Master's goggles" (aristocratic precision returns on the technical noun), "props in someone else's play" (involuntary slip into pre-Insurgency rhetorical cadence).

### 2.6 Voice-profile cross-reference table

All Prelude lines spoken by The Prince across this doc, indexed for the §19 delivery checklist:

| Line ID | Beat | Output path |
|---|---|---|
| `prince_beat_e_kael_find_kira` | E | `apps/client/public/audio/engineer/prince_beat_e_kael_find_kira.mp3` |
| `prince_beat_e_toy_soldier` | E | `apps/client/public/audio/engineer/prince_beat_e_toy_soldier.mp3` |
| `prince_beat_j_final_transference` | J | `apps/client/public/audio/engineer/prince_beat_j_final_transference.mp3` |
| `prince_beat_j_quinn_apprentice_preview` | J | `apps/client/public/audio/engineer/prince_beat_j_quinn_apprentice_preview.mp3` |

Note the per-character directory is `engineer/` (the existing convention from the codebase), not `prince/` — file paths should match the role label used everywhere else in the codebase, even though the *speaker* in the subtitle is "The Prince." This avoids a refactor across `engineerRecordings.ts`, `engineerBenchHints.ts`, `engineerGovernanceVotes.ts`, and the Daily Brief discovery system. **The voice is The Prince. The directory is `engineer/`. Do not change either.**

---

## Section 3 — Beat A: Cryo Wake

### 3.1 Narrative purpose

The first thirty seconds of the game. The player wakes alone in Pod Chamber 47 of Ark 1047 after 17,000 years of cryostasis. The pod hatch hisses open. Elara's hologram materializes. The first emotional question of the entire saga is delivered without commentary: *the player's pod is one of six in the row, and the other five are still occupied.* The Ark is not empty. The other five are sleeping.

This beat exists to:
1. Establish the visual grammar of the entire Prelude (cyan pod glow, breath-rhythm strips, dust in slow motion, no overhead lights).
2. Hand the player the canonical hook: *"There are five more pods on this row. They are not empty. They are sleeping."* (Beat C re-uses this seed when the six incubator pods appear.)
3. Set the `cutscene_awakening_complete` and `first_login` flags exactly as specified in `ANIMATED_CUTSCENES.md`.

### 3.2 Cross-reference

The cutscene **brief** is already canonical in `docs/design/ANIMATED_CUTSCENES.md` Cutscene 1: Awakening (lines 9–33). This section adds the **production assets** for that cutscene and the room art it lives in — the design brief does not need to be rewritten.

### 3.3 Art — Cryo Bay environment still

- **Output:** `apps/client/public/art/rooms/room-cryo-bay.png` + `.webp`
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Style anchor:** §0 global + Prelude modifiers (no overhead lights; breath-pulse on emergency strips; ship is "tired, not broken")

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of Pod Chamber 47 aboard the cryo-bay deck of a 17,000-year-old generation ship called Ark 1047. The chamber is a long curved gallery with two facing rows of upright cryo-stasis pods — six pods per row, twelve total visible. The pods are tall vertical cylinders of brushed brass and obsidian glass, each with a faint warm cyan #22d3ee glow at the canopy where the occupant's face would be. Five pods on each row are sealed and softly luminous from within — sleeping, not empty, the cyan glow pulses at sub-1 Hz, you can almost hear them breathing. **The sixth pod on the near side — center frame — is open**: hatch lifted forty degrees, volumetric cryogas spilling out from the threshold and pooling at floor height in slow motion. The pod's interior is empty (the player just stepped out). Floor is dark composite, scuffed bare to substrate at every walkway, dust drifting in low-angle starlight. Ceiling is unlit — only emergency floor strips along both walls and the cyan canopy glow of the eleven sealed pods illuminate the room. A single brass-and-bone railing runs the length of the gallery. At the far end of the chamber, a dark archway leads into the corridor (Beat A.5). The chamber feels maintained but exhausted — every surface is worn, nothing is broken, the ship has been holding its breath for seventeen millennia. Ankle-height fog. Anamorphic lens flare from the open pod's cyan glow. Film grain. Deep space black #010020 base. No rendered text. No people. No holograms (Elara materializes in the cutscene, not the still). Dramatic cyan rim lighting on the open pod. Cinematic 4K composition, three-quarter wide shot, camera at standing eye level, looking down the gallery toward the corridor archway.

### 3.4 Cutscene — A: Awakening

- **Beat ID:** `prelude-beat-a-awakening`
- **Output:** `apps/client/public/videos/prelude/prelude-beat-a-awakening.mp4`
- **Duration:** 35s (target — within the 30–45s range from `ANIMATED_CUTSCENES.md`)
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `cutscene_awakening_complete`, `first_login`
- **Reduced-motion fallback:** static `room-cryo-bay.png` + `KineticText` typewriter narration of the four-line script in §3.5

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Extreme close-up from inside the cryo pod looking outward through the canopy glass. The glass is half-frosted; six-pointed frost crystals are still forming at the edges of frame in slow motion. The player's POV — we cannot see their face. Beyond the glass, blurred and dim, the curved gallery of Pod Chamber 47 (Ark 1047 cryo-bay) is just becoming visible: shapes of other pods softly glowing cyan #22d3ee in the background. Volumetric cryogas inside the pod is still settling. The pod's internal indicator lights (a vertical column of small cyan LEDs to the right of the canopy) are sequencing from dim to bright — three are lit, three are still dark. Shallow depth of field, focused on the inside of the canopy glass. Palette: deep space black #010020, cyan #22d3ee, white frost. Anamorphic flare on the brightest LED. Faint film grain. No text. No visible character. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same Pod Chamber 47, thirty-five seconds later. Wide establishing shot now from outside the open pod, camera at standing eye level looking down the gallery toward the far corridor archway. The pod is fully open, cryogas has dissipated to ankle-height drift. Center of frame, three meters from the open pod, **Elara's holographic avatar** stands materialized: a translucent female figure in flowing senatorial robes rendered in cyan #22d3ee scanlines, hands clasped in front of her, expression warm and uncertain. She is two meters tall, slightly taller than the player would be. The hologram emits soft cyan rim light onto the floor and the railings around her. Behind her, the eleven sealed pods continue their slow cyan breath-pulse. The first emergency floor strip nearest camera is hot at its leading edge — the breath-rhythm pulse is at peak. Volumetric fog at ankle height. Anamorphic lens flare from Elara's hologram. Film grain. Deep space black #010020 base. No rendered text. Cinematic 4K composition. The framing must clearly show **five other pods on the near row, still sealed, still glowing** — they are the visual punchline of the cutscene and the script line in §3.5 must land on them.

**SEEDANCE 2.0 motion prompt:**
> Begin extreme close-up inside pod canopy as frost crystals retract and final LEDs sequence to bright. Beat at 4s: pod hatch hisses open with volumetric cryogas burst, camera pushes through the opening pod glass and out into the chamber. Beat at 12s: slow continuous pull-back along the gallery, revealing eleven sealed pods on either side, each gently breath-pulsing cyan. Beat at 22s: Elara hologram materializes center-frame in scanline wipe, soft bloom builds. Final 8s: hold on Elara, slow lateral camera drift right to lock the framing. 24fps. Reverent, fragile, just-born tone.

### 3.5 VO — Beat A new lines

The four `elara_fc_*` lines from `VOICE_OVER_BIBLE.md` lines 86–91 already cover the awakening dialog and should be timed to play during this cutscene (existing recordings in `elaraVoManifest.json`). **One new seed line** is added for the breath-beat punch on the five sealed pods:

| Line ID | Character | Voice profile | Beat | Text | Direction | Priority |
|---|---|---|---|---|---|---|
| `elara_beat_a_five_pods` | Elara | `elara` | A (post-awakening, before player steps to corridor) | `"There are five more pods on this row. They are not empty. They are sleeping."` | Quiet wonder, almost protective. Long pause before "sleeping." Do not punch the word. Land it. | P0 |

**ElevenLabs CSV row:**
```csv
elara_beat_a_five_pods,Elara,elara,0.65,0.85,0.30,true,"There are five more pods on this row. They are not empty.<break time=""900ms""/>They are sleeping.","Quiet wonder, almost protective. Long pause before 'sleeping.' Do not punch the word — land it.",P0
```

**Output:** `apps/client/public/audio/elara/elara_beat_a_five_pods.mp3`

### 3.6 VFX — Beat A effects

| VFX ID | Effect | Tech | Output | Notes |
|---|---|---|---|---|
| `vfx_cryo_frost_retreat` | Six-pointed frost crystals form on canopy glass and retreat in 3 seconds | PixiJS particle overlay; alpha-mask to canopy glass region | `apps/client/public/art/vfx/prelude/cryo-frost-retreat.webm` | Reused at beat C for incubator pods (idle hum loop variant) |
| `vfx_pod_hatch_cryogas` | Volumetric cryogas release on hatch open, pools to ankle height in slow motion | Three.js animated plane + particle system | `apps/client/public/art/vfx/prelude/pod-hatch-cryogas.webm` | One-shot, 4-second burst |
| `vfx_hologram_materialize` | Elara hologram materialize via scanline wipe (bottom-to-top, 2 seconds) + bloom build | PixiJS scanline shader + bloom pass | `apps/client/public/art/vfx/prelude/hologram-materialize.webm` | Reused for every Elara hologram entry in Prelude |

All three VFX are catalogued in §18 with full tech specs. This subsection only lists which ones fire during Beat A.

---

## Section 4 — Beat A.5: Corridor First Steps (Breath Beat)

### 4.1 Narrative purpose

Rev 6 added five **breath beats** (A.5, C.5, D.5, F.5, H.5) to slow the Prelude pacing and give the player room to feel the weight of the ship before any plot hits. Beat A.5 is the **first** of those — it exists *only* to let the player walk fifteen meters of empty corridor in silence and notice that the ship is still breathing.

There is no dialog. There is no choice. There is no score. There is the player's footsteps, the breath-pulse of the floor strips, and the dust. That's the whole beat. Resist any temptation to add UI prompts, Elara commentary, or a score swell — Rev 6 is explicit that the breath beats must remain low-stimulus.

### 4.2 Art — Corridor environment still

- **Output:** `apps/client/public/art/rooms/room-corridor.png` + `.webp`
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Style anchor:** §0 global + Prelude modifiers (the breath-pulse strip is the *protagonist* of this image — give it pride of place)

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of a long curving corridor on Deck 4 of Ark 1047, connecting Pod Chamber 47 (out of frame behind camera, to the left) to the engineering bay (out of frame ahead, to the right). The corridor is approximately fifteen meters long and slowly arcs to the right, so the far end is not visible from the camera position. Walls are matte composite the color of charcoal, with horizontal seams every 1.5 meters and exposed cable conduits running along the upper-left and lower-right joins. The floor is bare composite, scuffed to substrate at the center walking line. **No overhead lights** — the only illumination is two parallel **emergency floor strips**, one running along each wall at ankle height. The strips are warm cyan #22d3ee, very dim, and they **pulse together at sub-1 Hz** — render the strip closest to camera at the peak of its pulse (slightly brighter, hot leading edge) and the far strip at its trough (dimmer). Dust drifts in the air, catching the cyan glow as soft motes. Three small auxiliary fixtures (handrail emergency lights) are visible on the right wall, all dark. The corridor feels maintained but exhausted — surfaces are worn, paint has been polished off the right-side handrail by 17,000 years of human passage, but nothing is broken. At the camera position, on the floor, **a single cryogas residue trail** (faint, ankle-height white drift) extends from behind the camera (where the player just came from) and trails ahead toward the corridor's curve. Anamorphic lens flare on the nearest cyan strip. Film grain. Deep space black #010020 base. Volumetric fog at floor level. **No rendered text. No people. No holograms.** Cinematic 4K composition, low three-quarter shot, camera at hip height (slightly below standing eye level — emphasizing the floor strips), pointed down the corridor's curve.

### 4.3 Cutscene — A.5: Corridor First Steps

- **Beat ID:** `prelude-beat-a5-corridor`
- **Output:** `apps/client/public/videos/prelude/prelude-beat-a5-corridor.mp4`
- **Duration:** 15s
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `breath_beat_a5_complete`, `breath_beat_first_completed`
- **Reduced-motion fallback:** static `room-corridor.png` + 15-second silent hold (no narration — the silence is the beat)

**START FRAME (Nano Banana 2):**
> Identical composition to the §4.2 corridor still, but framed for the start of a moving camera: camera positioned at the corridor entrance (just past the cryo-bay archway), looking down the curving corridor. Cryogas residue trail visible at the very base of frame — the player has just stepped through. Both emergency floor strips at the same brightness (mid-pulse, neither at peak nor trough). All other elements identical: dust motes, dim cyan, no overhead light, worn handrails, fifteen meters of corridor curving out of view to the right. 16:9, 4K, deep space black #010020 base. No text.

**END FRAME (Nano Banana 2):**
> Camera has drifted forward fifteen meters along the corridor's gentle right-hand curve. The cryo-bay archway is no longer visible behind. Ahead, partially visible around the curve, is the closed engineering-bay door: a tall vertical iris-style hatch in worn brass with a single dim cyan status pip at center. The door is closed. The breath-pulse on the nearest emergency strip is at peak (hot leading edge, slightly brighter than start frame). Dust motes thicker in this region — they have settled in the lee of the door for centuries. Same palette, same grain, same fog. 16:9, 4K. No text, no people.

**SEEDANCE 2.0 motion prompt:**
> Slow continuous forward dolly along the corridor's gentle right-hand curve, eye level steady at hip height. No camera shake. Beat change at 6s: emergency strip pulse cycles from mid to peak (subtle global brightness shift, 12% increase). Beat change at 12s: engineering-bay door becomes visible around the curve, single cyan status pip ignites. Final 3s: hold on the closed door. Dust motes drift lazily across frame throughout. 24fps. Silent, contemplative, breathing.

### 4.4 VO — Beat A.5

**No dialog.** This is intentional. The breath beat must remain silent.

The audio bed for this beat is:
- Player footsteps (procedural, in-engine, not pre-recorded)
- Faint breath-pulse hum (15 Hz LFO on a 60 Hz fundamental, very low in mix)
- Distant deep-ship creaks (already in the existing ambient bed `apps/client/public/audio/cades/`)

Do not add Elara commentary. Do not add a Human whisper. Do not add a score. The silence is the beat.

### 4.5 VFX — Beat A.5 effects

| VFX ID | Effect | Tech | Output | Notes |
|---|---|---|---|---|
| `vfx_breath_pulse_strip` | Emergency floor strip breath-pulse, sub-1 Hz, 12% brightness shift | CSS-keyframe alpha animation OR PixiJS uniform tween | `apps/client/public/art/vfx/prelude/breath-pulse-strip.webm` (loop) | Reused in **every** Prelude room — this is the visual heartbeat of the entire opening hour. Render once, reuse 11 times. |

---

## Section 5 — Beat B: Corridor / Escape

### 5.1 Narrative purpose

The first plot beat of the Prelude. The player has crossed the corridor in silence (Beat A.5) and now reaches the engineering-bay door, which is **locked from the inside**. Elara cannot open it remotely — her authorizations were stripped 17,000 years ago when the Ark was stolen, and she only just woke up. The player has to open it manually using the brass-and-bone iris hatch.

This beat is the first moment the player **does** something rather than watches. It is also the first moment Elara admits she is not omnipotent: *"I can see the lock. I cannot turn it. You will have to."* The mechanical solution is trivial — pull the recessed iris release, the door spins open — but the emotional point is that the player and the AI are partners, not user and tool.

This beat **reuses the corridor environment still** from §4.2. No new room art is needed. The cutscene is a single 20-second sequence focused on the door iris.

### 5.2 Cross-reference

The "manual door release" interaction is implemented as a tap-and-hold gesture on touch and a hold-`E` interaction on desktop. The interaction itself is gameplay code (out of scope for this doc). This section specs only the cinematic that fires *after* the player completes the hold and the door begins to open.

### 5.3 Art

**No new room still required.** Reuses `apps/client/public/art/rooms/room-corridor.png` from §4.2.

### 5.4 Cutscene — B: Corridor / Escape

- **Beat ID:** `prelude-beat-b-escape`
- **Output:** `apps/client/public/videos/prelude/prelude-beat-b-escape.mp4`
- **Duration:** 20s
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `cutscene_door_iris_complete`, `engineering_bay_unlocked`
- **Trigger:** Fires after the player completes the manual hold-to-release interaction on the iris hatch
- **Reduced-motion fallback:** static end-frame still + 2-second hatch-open SFX

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Close-up of the engineering-bay iris hatch, centered in frame, camera at eye level approximately 1.5 meters from the door surface. The hatch is a tall vertical brass-and-bone disc, two meters in diameter, with twelve radial petals meeting at a central hub. The hub bears a small recessed manual release wheel made of dark brass with knurled grip, and a single dim cyan #22d3ee status pip just below the wheel. Visible age: the central hub paint has been worn off completely, leaving polished brass underneath in a perfect circle the size of a human palm — millennia of hands have touched this exact spot. The petals themselves are matte and show fine concentric scoring from past iris cycles. Behind the door (to the left and right of the hatch frame), the corridor walls fall into shadow. Two emergency floor strips are visible at the very bottom of frame, breath-pulsing dim cyan at mid-cycle. The single status pip on the hub has just turned from dim cyan to **bright foxfire green #00e676** — the lock has just released. Volumetric fog at floor level. Anamorphic lens flare on the green pip. Film grain. Deep space black #010020. **No text. No people.** Cinematic 4K composition.

**END FRAME (Nano Banana 2):**
> Same camera position twenty seconds later. The iris hatch is now **fully open** — the twelve brass-and-bone petals have rotated and retracted into the hatch frame, leaving a clean two-meter circular opening. Beyond the opening, the **engineering bay** is partially visible: a deep wide chamber dominated by the silhouette of the Engineer's workbench at the far end (a long industrial bench with hanging tool racks above it, currently dark and silent) and, in the foreground at floor level, **six dormant incubator pods** arranged in a semicircle facing the bench. The pods are hip-high, brass and obsidian glass, each canopy completely dark — not glowing yet. Cyan floor strips continue through the threshold and into the engineering bay, breath-pulsing at the same rhythm. A faint foxfire-green #00e676 glow emanates from somewhere beyond the workbench (the bench's standby indicator). The hatch's hub status pip has now shifted from foxfire green to **steady cyan #22d3ee** — door is open, locked in open position. Volumetric fog spills slowly through the opening from the engineering bay (warmer-tinted, faintly green). Anamorphic flare from the pip and the distant green glow. Film grain. Deep space black base. **No text. No people. No holograms** (Elara appears in the next beat). Cinematic 4K composition.

**SEEDANCE 2.0 motion prompt:**
> Camera locked at eye level, no movement. Beat 0–3s: hold on closed iris, central pip glowing green. Beat at 3s: twelve petals begin synchronized rotation outward in slow mechanical opening, each petal disengaging with a half-second stagger so the iris peels back like a flower. Beat at 12s: iris fully retracted, warmer green-tinted fog spills through opening from engineering bay beyond. Beat at 16s: pip color shifts from foxfire green to steady cyan. Final 4s: hold on the open doorway and the dormant incubators in the distance. 24fps. Mechanical, reverent, anticipation building.

### 5.5 VO — Beat B

The existing Elara `elara_room_engineering` line from `VOICE_OVER_BIBLE.md` line 111 already covers her spoken reaction when the door opens — *"Engineering Bay. Crafting stations, research terminals, power systems. The Shadow — something in the code is different here."* — and should be timed to play during the final 4 seconds of the cutscene as the door reveals the bay.

**No new VO lines required for Beat B.** One existing line is reused.

### 5.6 VFX — Beat B effects

| VFX ID | Effect | Tech | Output | Notes |
|---|---|---|---|---|
| `vfx_iris_hatch_open` | Twelve-petal brass iris opening, staggered rotation | 3D mesh animation baked to alpha sprite OR pre-rendered .webm | `apps/client/public/art/vfx/prelude/iris-hatch-open.webm` | Reused for every iris hatch in the Prelude (engineering, mess hall, briefing room — three total) |
| `vfx_status_pip_color_shift` | Status pip cyan → green → cyan transition with bloom | CSS-keyframe color tween | `apps/client/public/art/vfx/prelude/status-pip-shift.webm` (loop variant) | Reused on every locked door interaction |

---

## Section 6 — Beat C: Engineering — Crew Role Choice + Six Incubators

### 6.1 Narrative purpose

The first **choice** of the game and the first **planted seed** for the entire long arc. The player walks into the engineering bay and sees two things at once:

1. The **Engineer's workbench** at the far end — a long industrial bench with hanging tool racks, the holographic recording rig that will play `holo_wake_the_bench` later, and the dormant brass deck box that holds the first cards. (Source: `apps/shared/engineerBenchHints.ts`, `engineerRecordings.ts` lines 73–94.)
2. **Six incubator pods** in a semicircle facing the bench, all dormant, all dark. (Source: Rev 6.2 Section 7.2 seed.)

The Crew Role Choice itself is the gameplay layer: the player picks one of three starter roles — **Patch** (engineer/healer), **Zephyr-9** (scout/scientist), **Little One** (child orphan/empath) — defined in `apps/shared/preludeCrew.ts`. The choice is not life-and-death; it picks which of the three starting crewmates is "yours" first. The other two join later.

The six incubator pods are the *uncommented punchline*. Elara explains them in one line — Dr. Lyra Vox built them into every Ark, the Collector's archive is in there, none of them are running yet, they are waiting for someone to choose. Then she stops. The player will not understand what an incubator pod is for ~30 hours of playtime. The seed is planted.

### 6.2 Cross-reference

- Crew Role Choice data: `apps/shared/preludeCrew.ts` (Patch, Zephyr-9, Little One)
- Engineer bench hints: `apps/shared/engineerBenchHints.ts`
- Six incubators canon: `docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md` Part VI Rev 6.2 Section 7.2
- Lyra Vox substrate voice: `apps/shared/lyraVoxDialog.ts` (formal/clinical, flat-tier — **not used in this beat**, only referenced by Elara)

### 6.3 Art — Engineering bay environment still

- **Output:** `apps/client/public/art/rooms/room-engineering.png` + `.webp`
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Style anchor:** §0 global + Prelude modifiers. **Critical compositional requirement:** the six incubator pods and the workbench must both be visible in the same frame, with the bench at the back of the room and the incubators in a semicircle in the foreground

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic still, 16:9, 4K. Wide interior of the engineering bay aboard Ark 1047. The room is approximately fifteen meters deep and twelve meters wide, with a high vaulted ceiling lost in shadow. The far wall is dominated by **the Engineer's workbench**: a long industrial bench three meters wide and two meters deep, made of dark brass and reinforced obsidian composite, with a hanging tool rack above it (loops, calipers, micro-welders, a row of empty data slates, all suspended in tidy order). Above the bench, mounted to the wall, a small **holographic recording rig** — a brass armature with a single dim lens — currently inactive. On the bench itself, dead center, sits **a small brass-and-bone deck box** the size of a hardcover book, latched closed. A faint **foxfire green #00e676** standby indicator glows from the side of the bench at knee height — the only colored light source in the room beyond the cyan floor strips. **In the foreground**, arranged in a semicircle facing the workbench, **six incubator pods**: hip-high upright cylinders, each one meter tall, brass and obsidian glass, each canopy completely dark and dormant. Each pod has a small dataplate at the base bearing a serial number (do not render legible text, just the suggestion of an engraved plate). The pods are spaced 1.2 meters apart in a 240-degree arc, leaving a clear walking aisle from the entrance (camera left) to the workbench (frame back). Floor is dark composite, scuffed. **No overhead lights** — illumination from cyan emergency floor strips along both walls and the foxfire-green standby indicator at the bench. Volumetric fog at ankle height, slightly warmer than the corridor's fog (the bay was built for craftwork; the air carries a faint sense of welding flux even after seventeen millennia). Dust drifting through the cyan light. The room feels **maintained, exhausted, holy**. Anamorphic lens flare on the green standby indicator. Film grain. Deep space black #010020 base. **No rendered text. No people. No holograms** (Elara appears in the cutscene). Cinematic 4K composition, three-quarter wide shot, camera at standing eye level just inside the entrance, framing the six incubators in the foreground arc and the workbench dead center at the back.

### 6.4 Cutscene — C: Crew Role Choice + Six Incubators

- **Beat ID:** `prelude-beat-c-crew-and-incubators`
- **Output:** `apps/client/public/videos/prelude/prelude-beat-c-crew-and-incubators.mp4`
- **Duration:** 35s
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `cutscene_engineering_intro_complete`, `incubators_seen`, `bench_seen`, `crew_role_choice_unlocked`
- **Reduced-motion fallback:** static `room-engineering.png` + KineticText narration of `elara_room_engineering` (existing) and `elara_beat_c_six_incubators` (new, §6.5)

**START FRAME (Nano Banana 2):**
> Identical composition to the §6.3 engineering still, but framed for the start of a moving camera: camera at the engineering-bay threshold (just inside the now-open iris from Beat B), looking down the central aisle toward the workbench. The six incubator pods are visible in the foreground semicircle. Elara's hologram is **just beginning to materialize** at the center of the semicircle, in the spotlight position — only the lower 30% of her form has scanline-wiped in, the rest is still resolving. The bench's foxfire-green standby pip is at full brightness. Volumetric fog, ankle height. 16:9, 4K, no text.

**END FRAME (Nano Banana 2):**
> Same engineering bay, thirty-five seconds later. Camera has drifted forward six meters along the central aisle and now rests at the heart of the incubator semicircle, looking past Elara's fully materialized hologram toward the workbench. **Elara is fully resolved** — translucent senatorial figure in cyan #22d3ee scanlines, hands open at her sides, expression watchful. Her gesture is subtle: one hand turned palm-up toward the six dormant incubator pods, as if presenting them. **The brass deck box on the workbench has its latch open** — only the latch, the lid is still closed. A single new visible detail on the bench: a **small holographic projection** has just bloomed above the recording rig: a low-fidelity 3D outline of the player's chosen starter crewmate (composite silhouette — render an ambiguous androgynous human-shaped wireframe, no facial features, no class signifier — the actual model will be substituted at runtime based on the player's choice). The wireframe is foxfire green. All six incubators remain dark and dormant. Volumetric fog has lifted slightly — the room is welcoming her. Anamorphic flare from the bench standby pip and Elara's hologram. Film grain, deep space black base. No text. Cinematic 4K composition.

**SEEDANCE 2.0 motion prompt:**
> Slow continuous forward dolly six meters down the engineering bay aisle, camera at standing eye level. Beat 0–6s: Elara hologram completes scanline-wipe materialization in the foreground arc, soft bloom builds. Beat at 12s: Elara turns her open palm toward the six dormant incubator pods in a presenting gesture as her line about Dr. Lyra Vox plays. Beat at 22s: brass deck box latch on workbench clicks open mechanically. Beat at 28s: low-fidelity foxfire-green wireframe of chosen crewmate blooms above the bench's recording rig. Final 7s: hold on the framing — Elara, six dark pods, lit bench, wireframe. 24fps. Reverent, careful, planting-a-seed tone.

### 6.5 VO — Beat C new lines

The existing `elara_room_engineering` line plays at the start of the cutscene. **One new seed line** is added for the six incubator reveal:

| Line ID | Character | Voice profile | Beat | Text | Direction | Priority |
|---|---|---|---|---|---|---|
| `elara_beat_c_six_incubators` | Elara | `elara` | C (after `elara_room_engineering`, fires when Elara turns toward the pods at ~14s of the cutscene) | `"Six incubator pods. Dr. Lyra Vox built them into every Ark. The Collector's archive is in there. None of them are running yet. They are waiting for someone to choose."` | Quiet, factual, almost reverent. Do not editorialize. The names "Lyra Vox" and "the Collector" must each get a half-second of breathing room. End on "to choose" without punching it — let the silence after carry the weight. | P0 |

**ElevenLabs CSV row:**
```csv
elara_beat_c_six_incubators,Elara,elara,0.65,0.85,0.30,true,"Six incubator pods. Dr. Lyra Vox built them into every Ark.<break time=""500ms""/>The Collector's archive is in there.<break time=""500ms""/>None of them are running yet.<break time=""700ms""/>They are waiting for someone to choose.","Quiet, factual, reverent. Half-second pause after 'Lyra Vox' and 'the Collector.' Do not punch the ending — let silence carry it.",P0
```

**Output:** `apps/client/public/audio/elara/elara_beat_c_six_incubators.mp3`

### 6.6 VFX — Beat C effects

| VFX ID | Effect | Tech | Output | Notes |
|---|---|---|---|---|
| `vfx_incubator_pod_dormant_glow` | Six dormant incubator canopies, very faint cyan inner shimmer at sub-1 Hz (NOT the active green glow — they are still off) | PixiJS shader, 5% alpha cyan | `apps/client/public/art/vfx/prelude/incubator-pod-dormant.webm` (loop) | Reused later when the pods activate (different overlay, different doc) |
| `vfx_bench_standby_pip` | Foxfire-green standby pip on Engineer's workbench | CSS keyframe | `apps/client/public/art/vfx/prelude/bench-standby-pip.webm` (loop) | Reused in Beat E and Beat J |
| `vfx_role_wireframe_bloom` | Foxfire-green crewmate wireframe blooms above bench recording rig | Three.js wireframe shader + bloom | `apps/client/public/art/vfx/prelude/role-wireframe-bloom.webm` | Runtime swap between three crewmate silhouettes |

---

## Section 7 — Beat C.5: Window (Breath Beat)

### 7.1 Narrative purpose

The second breath beat. After the player chooses a crew role and the wireframe blooms above the bench, Elara's hologram quietly walks (drifts) to a small **viewport on the engineering bay's port-side wall** — a rectangular window the size of a doorframe, looking out at the starfield. She does not say anything. She just stands there.

The Human speaks for the **first time in the entire game**. Not through comms, not through a corruption shader, not through static — just a quiet line, intimate, like he's standing beside the player in the dark. This is the **first contact** with The Human and it is a breath beat — no plot, no choice, no urgency. Just: *"I see you. I've been waiting."* (paraphrase — see §7.5 for the canonical line).

This is structurally the most important breath beat in the Prelude because it is the first time the player learns that the Ark has a **second voice** beyond Elara, and that voice is intimate, ancient, and watching. The player is supposed to feel held, not threatened. The threat comes much later.

### 7.2 Cross-reference

- The Human voice profile: `VOICE_OVER_BIBLE.md` Section 2 (existing)
- The Human's substrate-voice mechanic: `apps/shared/lyraVoxDialog.ts` (referenced for the technical layer the Human speaks through)
- Rev 6 breath beat canon: `docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md` Part VI Rev 6 Section 3.2

### 7.3 Art

**No new room still required.** Reuses `apps/client/public/art/rooms/room-engineering.png` from §6.3 — the engineering bay's port-side viewport is already specified in the §6.3 prompt as part of the room (it sits on the port wall halfway down the bay; the Beat C.5 cutscene start frame composes around it).

**However, a new compositional sub-element is needed for the cutscene start/end frames** — see §7.4 START FRAME, which adds the viewport detail explicitly.

### 7.4 Cutscene — C.5: Window

- **Beat ID:** `prelude-beat-c5-window`
- **Output:** `apps/client/public/videos/prelude/prelude-beat-c5-window.mp4`
- **Duration:** 20s
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `breath_beat_c5_complete`, `human_first_voice_heard`, `cutscene_window_complete`
- **Reduced-motion fallback:** static end-frame still + `human_beat_c5_first_breath` audio

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the engineering bay's port-side wall, framed on **a tall rectangular viewport** approximately 1.2 meters wide and 2 meters tall, set into the matte-charcoal wall at standing height. The viewport glass is thick obsidian-tinted reinforced composite, slightly distorting the view. **Beyond the glass: deep space**, the Ark drifting through a broad starfield. The visible stars are scattered, dim, no nebula, no nearby planet — just the slow void. The Ark's outer hull plating is faintly visible at the bottom of the viewport (a curving brass-and-bone surface, weathered and pitted). **In front of the viewport, ten centimeters from the glass**, **Elara's hologram** stands with her back to the camera — translucent senatorial figure in cyan #22d3ee scanlines, hands at her sides, head tilted slightly upward as if looking at a particular distant star. The hologram bloom casts soft cyan rim light onto the viewport's frame. Camera is approximately three meters behind her, low three-quarter angle, framing both her silhouette and the starfield beyond. The engineering bay around the viewport is in shadow — only the cyan floor strips and Elara's hologram illuminate the scene. Volumetric fog at ankle height. Anamorphic lens flare on Elara's bloom and the brightest visible star. Film grain. Deep space black #010020 base. **No rendered text. No other people. No other holograms.** Cinematic 4K composition. The mood is silent, intimate, contemplative — the player is supposed to want to stand next to her and not say anything.

**END FRAME (Nano Banana 2):**
> Same composition twenty seconds later. Camera has drifted forward two meters — Elara's silhouette is closer, the viewport more dominant. **A second presence has appeared in the scene** without entering it: across the viewport's reinforced glass, **at eye level on the inside surface of the glass**, a faint pattern of frost has formed in the shape of **a single open palm** — five fingers, slightly larger than human, pressed against the glass *from the player's side of the room*. There is no body attached to the palm. No figure. Just the frost-print, suggesting that something invisible is standing right next to the player and has just touched the window. Elara has not turned — she is still looking out at the stars, unaware. The palm-print is rendered in faint white frost on dark glass, very subtle but unmistakably hand-shaped. Same starfield beyond, same cyan rim from Elara, same fog, same grain. 16:9, 4K, no text. The reveal is **the palm-print** — that is The Human, becoming briefly visible to the player and only the player.

**SEEDANCE 2.0 motion prompt:**
> Slow continuous forward dolly two meters toward the viewport, camera at standing eye level, Elara's silhouette held in the right two-thirds of frame. No camera shake. Beat 0–8s: silent drift, dust motes catching cyan light. Beat at 9s: faint warm-white frost begins forming on the inside of the viewport glass at eye level, slowly resolving into the shape of an open palm over four seconds. Beat at 14s: palm-print fully formed, holds. Beat at 17s: The Human's voice begins (out of frame, no visual). Final 3s: hold on the palm-print and Elara's unaware silhouette. 24fps. Intimate, ancient, watching-from-just-beside-you tone.

### 7.5 VO — Beat C.5 new line

| Line ID | Character | Voice profile | Beat | Text | Direction | Priority |
|---|---|---|---|---|---|---|
| `human_beat_c5_first_breath` | The Human | `the_human` | C.5 (fires at 17s of cutscene, after the palm-print resolves) | `"I'm not supposed to be able to do this yet. Whisper, not a voice. Don't tell her — she's listening to a different frequency. I just wanted you to know that you're not alone in here. You never have been. You won't be."` | Intimate whisper, almost unbearably close — like he's standing beside the player and speaking into their ear. Not seductive (yet). Not menacing (yet). Just *present*. The line is approximately 16 seconds long; the cutscene ends immediately after the final word "won't be." Use the existing slight digital-glitch artifact layer on the Human's voice but bring the static very low — this is the quietest he ever gets. | P0 |

**ElevenLabs CSV row:**
```csv
human_beat_c5_first_breath,The Human,the_human,0.55,0.85,0.40,true,"I'm not supposed to be able to do this yet.<break time=""600ms""/>Whisper, not a voice.<break time=""500ms""/>Don't tell her — she's listening to a different frequency.<break time=""700ms""/>I just wanted you to know that you're not alone in here.<break time=""500ms""/>You never have been.<break time=""400ms""/>You won't be.","Intimate whisper, unbearably close. Not seductive, not menacing — just present. Bring static layer very low; this is the quietest he ever gets in the game.",P0
```

**Output:** `apps/client/public/audio/human/human_beat_c5_first_breath.mp3`

### 7.6 VFX — Beat C.5 effects

| VFX ID | Effect | Tech | Output | Notes |
|---|---|---|---|---|
| `vfx_starfield_drift_viewport` | Slow parallax starfield seen through the viewport glass | Three.js skybox + parallax shader | `apps/client/public/art/vfx/prelude/starfield-drift.webm` (loop) | Reused in every Prelude scene that frames a viewport (Beat I bridge has its own variant) |
| `vfx_human_palm_frost` | Open-palm frost-print resolves on inside of viewport glass over 4 seconds | PixiJS particle convergence into hand-shaped alpha mask | `apps/client/public/art/vfx/prelude/human-palm-frost.webm` | One-shot, only this beat. The single most important VFX in the Prelude — get the hand shape right or the moment falls flat |

---

## Section 8 — Beat D: Cargo Bay — Trade Empire Seed + Locke Mission Board

### 8.1 Narrative purpose

The player crosses from engineering into the Ark's enormous cargo hold — a cathedral-scale storage cavern holding crates, salvage, and (along one wall) **a long abandoned mission board** dotted with old job postings on faded paper-thin polymer slates. Most of the slates are dark. Three of them are not.

The Trade Empire Seed: this is the first time the player sees the **Trade Empire system** that will become a major mid-game pillar. The cargo bay has crates with serial numbers, a manual dock interface, and a mission board where Adjudicator Locke (introduced via mailbox in Beat H) will eventually post jobs. Right now, the board has **three legacy postings still active**, none of them taken — including one that has been listed for **17,000 years**. Elara delivers the planted seed: *"That mission has been posted for 17,000 years. Nobody has taken it. It is the simplest one. The salvage is still there."* (See §8.5.)

The simplest mission posted 17,000 years ago will become a recurring callback throughout the game. The player can take it any time. It will always be there. The salvage will always be waiting.

### 8.2 Cross-reference

- Trade Empire system: `docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md` Part III (mid-game pillar)
- Locke mission board: Rev 6.2 Section 7.3 Seed
- Locke voice profile: `VOICE_OVER_BIBLE.md` Section 4 (existing)
- Existing crew mission shells: `apps/shared/preludeCrewMissions.ts` (wreck_next_door, signal_from_nowhere, burnt_card)

### 8.3 Art — Cargo Bay environment still

- **Output:** `apps/client/public/art/rooms/room-cargo-hold.png` + `.webp`
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Style anchor:** §0 global + Prelude modifiers. **Critical compositional requirement:** the mission board on the left wall and a dramatic shaft of light from above must both be in frame; the cargo hold should feel **enormous** — the largest interior space the player has seen so far

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic still, 16:9, 4K. Vast interior of the cargo hold aboard Ark 1047. The chamber is forty meters wide, sixty meters deep, with a vaulted ceiling thirty meters above the floor. The space is dominated by **stacks of cargo crates**: long rows of dark brass-and-bone shipping containers, six meters tall, stacked in three vertical tiers, arranged in parallel rows that recede into the distance with industrial walking aisles between them. The crates are battered, weathered, dust-coated; some bear faded glyphs and serial-number stencils (do not render legible text — just suggest engraved markings). Many of the crates have small dim cyan #22d3ee status indicators at chest height — most dark, a few pulsing faintly. **The left wall** of the bay is the focal point: a massive flat surface ten meters wide, made of dark composite, on which **a long abandoned mission board** is mounted at standing height. The board is approximately five meters wide and two meters tall, divided into a grid of **forty-eight small rectangular slate-mounts**. Most slate-mounts are empty or hold blackened, broken slates. **Three slate-mounts are still active** — three faintly glowing cyan rectangles in the grid, arranged unevenly: one in the upper-left, one center, one lower-right. Each glowing slate is the size of a hardcover book. Above the board, mounted to the wall, a small brass plate engraving (illegible) marks the board's purpose. **From the ceiling, dead center of the cargo hold's main aisle, a single dramatic shaft of starlight** falls through a high open louver in the ceiling — the only natural light in the entire chamber, a beam of cold pale blue cutting through the dust. The shaft strikes the floor and creates a circle of illumination roughly three meters across. **A faint dust column** drifts upward through the shaft, catching the light. Floor is dark composite, scuffed, with old cargo-handling tracks worn into it. **No overhead lights** — illumination comes from the cyan floor strips along the walls, the few cyan crate indicators, the three glowing mission slates, and the central starlight shaft. Volumetric fog at ankle height. Anamorphic lens flare on the starlight shaft and the brightest cyan crate indicator. Film grain. Deep space black #010020 base. **No rendered text. No people. No holograms** (Elara appears in the cutscene). Cinematic 4K composition, three-quarter wide shot, camera at standing eye level, framing both the mission board on the left wall and the central starlight shaft, with rows of crates receding into the back.

### 8.4 Cutscene — D: Trade Empire Seed + Locke Mission Board

- **Beat ID:** `prelude-beat-d-cargo-bay`
- **Output:** `apps/client/public/videos/prelude/prelude-beat-d-cargo-bay.mp4`
- **Duration:** 30s
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `cutscene_cargo_intro_complete`, `mission_board_seen`, `trade_empire_seed_planted`
- **Reduced-motion fallback:** static `room-cargo-hold.png` + KineticText narration of `elara_room_cargo` (existing) + `elara_beat_d_17000_year_mission` (new, §8.5)

**START FRAME (Nano Banana 2):**
> Identical composition to the §8.3 cargo hold still, but framed for the start of a moving camera: camera positioned at the entrance from the engineering bay (right side of frame), looking diagonally across the cargo hold toward the mission board on the far left wall. The starlight shaft is dead center. Elara's hologram is **in mid-stride**, walking from the entrance toward the mission board, her translucent cyan form passing through the starlight shaft (the shaft passes harmlessly through her, no shadow). Camera at standing eye level, slight low angle to emphasize the chamber's height. 16:9, 4K, no text, deep space black base.

**END FRAME (Nano Banana 2):**
> Same cargo hold, thirty seconds later. Camera has dollied forward and slightly left, now positioned about four meters from the mission board, looking past Elara's hologram (who has stopped at the board's center, hand raised, palm-out toward one specific slate in the upper-left corner). The slate Elara is pointing to is the **17,000-year-old posting** — its cyan glow is now visibly more saturated than the other two active slates, drawing the eye. The other two active slates are still glowing faintly. The starlight shaft is now to the right of frame, partially out of view. The mission board occupies the left two-thirds of frame. Above Elara's pointing hand, a faint cyan **glyph projection** has bloomed in front of the slate — a small holographic icon (do not render specific shape) indicating the mission's still-open status. Volumetric fog, ankle height. Anamorphic flare on the highlighted slate. Film grain. Deep space black base. **No rendered text.** Cinematic 4K composition.

**SEEDANCE 2.0 motion prompt:**
> Slow continuous diagonal dolly from cargo entrance toward the left-wall mission board, camera at standing eye level. Beat 0–8s: Elara hologram walks ahead of camera, passing through the central starlight shaft (no shadow cast). Beat at 12s: Elara stops at mission board center, raises one open palm toward upper-left slate. Beat at 18s: highlighted slate's cyan glow saturates over four seconds, becoming visibly brighter than the other two active slates. Beat at 24s: small cyan holographic glyph blooms in front of the highlighted slate. Final 6s: hold on Elara, mission board, glowing slate. 24fps. Quiet, archeological, weight-of-time tone.

### 8.5 VO — Beat D new lines

The existing `elara_room_cargo` line plays at the start of the cutscene. **One new seed line** is added:

| Line ID | Character | Voice profile | Beat | Text | Direction | Priority |
|---|---|---|---|---|---|---|
| `elara_beat_d_17000_year_mission` | Elara | `elara` | D (fires at 18s of cutscene as Elara highlights the slate) | `"That mission has been posted for 17,000 years. Nobody has taken it. It is the simplest one. The salvage is still there."` | Quiet wonder edged with something like grief. Long beat after "17,000 years" — let the number land. The four sentences should each get their own small breath. End on "still there" without inflection. | P0 |

**ElevenLabs CSV row:**
```csv
elara_beat_d_17000_year_mission,Elara,elara,0.65,0.85,0.30,true,"That mission has been posted for 17,000 years.<break time=""900ms""/>Nobody has taken it.<break time=""500ms""/>It is the simplest one.<break time=""500ms""/>The salvage is still there.","Quiet wonder edged with grief. Long beat after '17,000 years.' Each sentence its own breath. End on 'still there' without inflection.",P0
```

**Output:** `apps/client/public/audio/elara/elara_beat_d_17000_year_mission.mp3`

### 8.6 VFX — Beat D effects

| VFX ID | Effect | Tech | Output | Notes |
|---|---|---|---|---|
| `vfx_starlight_shaft_dust` | Volumetric starlight shaft from ceiling louver, with dust column drifting upward through it | Three.js volumetric light + particle column | `apps/client/public/art/vfx/prelude/starlight-shaft-dust.webm` (loop) | Cargo hold only |
| `vfx_mission_slate_glow` | Cyan slate glow with sub-1 Hz pulse and saturate-on-highlight transition | PixiJS shader | `apps/client/public/art/vfx/prelude/mission-slate-glow.webm` (loop + transition variant) | Reused later for any active mission board posting |
| `vfx_mission_glyph_bloom` | Small cyan holographic glyph blooms in front of highlighted slate | PixiJS sprite + bloom | `apps/client/public/art/vfx/prelude/mission-glyph-bloom.webm` | One-shot per posting |

---

## Section 9 — Beat D.5: Galley (Breath Beat)

### 9.1 Narrative purpose

The third breath beat. The player crosses from the cargo hold into a small, almost domestic room — **the galley**, a six-meter-square crew kitchen with a counter, stove, four mismatched stools, a hanging rack of clean copper pans, and one unwashed coffee mug still on the counter from seventeen thousand years ago. Nothing here is plot. Nothing here is choice. The galley exists to give the player a moment in a room that is **human-scale**, after the cathedral of the cargo hold.

The Human speaks his second line — a quiet aside about **the Engineer's sandwich recipe**. It is a callback the player will not understand until Beat E (when they discover the Prince's Archive). It is also the first time the Human says something that sounds *fond* about another person — which, given that he has been trapped in the substrate for seventeen thousand years, is the most fragile thing in the Prelude.

### 9.2 Cross-reference

- Engineer/Prince canonical voice: §2 of this doc
- Galley as a Rev 6 breath-beat addition: `docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md` Part VI Rev 6 Section 3.2
- The Human voice profile: `VOICE_OVER_BIBLE.md` Section 2 (existing)

### 9.3 Art — Galley environment still

- **Output:** `apps/client/public/art/rooms/room-galley.png` + `.webp`
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Style anchor:** §0 global + Prelude modifiers, but with **a deliberate domestic warmth** unique to this room — the galley should feel like the only room in the Prelude where someone *lived*

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the crew galley aboard Ark 1047 — a small, domestic-scale kitchen, six meters square, with a low ceiling (2.5 meters) that makes the room feel intimate after the vastness of the cargo hold. The galley has **a long countertop** along the right wall: dark composite surface, a small recessed sink at one end, an induction stove at the other end (six dim cyan-rimmed burner rings, all cold), and **one unwashed copper coffee mug sitting alone in the center of the counter** — handle facing left, a faint dark ring of dried liquid inside, the mug's exterior coated in 17,000 years of fine dust. Above the counter, a **hanging rack** of clean copper-bottomed pans in descending sizes, ten pans total, brass hooks, faintly catching the cyan light. The far wall holds a small **viewport** (half the size of the engineering bay's window from §7), framing a slice of starfield. **Four mismatched stools** are arranged at a small bar-height counter on the left wall — one tall, one short, one with a worn cushion, one bare brass — facing the wall as if a small crew used to eat their meals shoulder-to-shoulder while looking at a now-blank wall display. A folded apron hangs on a hook beside the stove, dust-coated. The floor is dark composite, scuffed bare to substrate at the sink, the stove, and the path between the stools and the door. **No overhead lights** — the room is illuminated by cyan emergency floor strips, a small standby pip on the induction stove, the dim cyan from the window, and a single warm-amber #fbbf24 pilot light on the side of the stove (the only warm color in the entire Prelude so far). Volumetric fog at ankle height, much fainter here than in the larger rooms — the galley is sealed, the air feels stiller. Anamorphic lens flare on the warm-amber pilot light. Film grain. Deep space black #010020 base. **No rendered text. No people. No holograms.** Cinematic 4K composition, three-quarter shot from inside the doorway, framing the counter, the lone coffee mug, the hanging pans, and the stools on the opposite wall. The mood: **a kitchen where someone made coffee, set the mug down, and never came back**.

### 9.4 Cutscene — D.5: Galley

- **Beat ID:** `prelude-beat-d5-galley`
- **Output:** `apps/client/public/videos/prelude/prelude-beat-d5-galley.mp4`
- **Duration:** 25s
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `breath_beat_d5_complete`, `galley_seen`, `engineer_sandwich_callback_planted`
- **Reduced-motion fallback:** static `room-galley.png` + `human_beat_d5_sandwich` audio

**START FRAME (Nano Banana 2):**
> Identical to the §9.3 galley still, but framed for the start of a moving camera: camera at the galley doorway looking diagonally across the room toward the lone coffee mug on the counter. The framing emphasizes the mug as the natural focal point. Warm-amber pilot light on the stove visible. Dust motes barely moving. 16:9, 4K, no text.

**END FRAME (Nano Banana 2):**
> Same galley, twenty-five seconds later. Camera has dollied two meters forward and slightly right — the coffee mug now occupies the center-right of frame, much closer to the lens. **A faint warm-amber glow** from the stove's pilot light has subtly increased in intensity (5% brighter), and the mug's interior dark ring is now catching the warm light, looking almost like fresh coffee. **No other change** — the mug has not been touched, nothing has moved, no figure has appeared. Same dust, same pans, same stools. The shot is purely about the closer view of the mug and the slight warming of the pilot light. 16:9, 4K, no text.

**SEEDANCE 2.0 motion prompt:**
> Slow continuous forward dolly two meters and slight right pan, camera at standing eye level. No camera shake. Beat 0–8s: silent drift, dust motes barely moving in the still air. Beat at 9s: stove's amber pilot light brightens by 5% over four seconds — almost imperceptible. Beat at 14s: The Human's voice begins (out of frame, no visual). Final 5s: hold on the close shot of the lone coffee mug, warm amber on its rim. 24fps. Domestic, fragile, fond tone.

### 9.5 VO — Beat D.5 new line

| Line ID | Character | Voice profile | Beat | Text | Direction | Priority |
|---|---|---|---|---|---|---|
| `human_beat_d5_sandwich` | The Human | `the_human` | D.5 (fires at 14s of cutscene as the pilot light brightens) | `"He used to make sandwiches in here. Two slices of black bread, something he called 'salt-protein,' a smear of the green stuff from Hydroponics. He'd put one in front of you whether you asked or not. He said he wasn't a cook. He was lying. He was a wonderful cook. He just didn't want anyone to compliment him for it. I'm sorry — I haven't said his name in a long time. It hurts to say his name."` | Quiet, fond, just slightly cracked at the edges. The line is approximately 22 seconds long. The cracking should NOT escalate — the Human keeps it under control because that is who he is. The final clause "It hurts to say his name" should be even quieter than the rest, almost an apology to the player for showing this much. **Do not name the Engineer / Prince in this line.** The withholding of the name is the entire point. | P0 |

**ElevenLabs CSV row:**
```csv
human_beat_d5_sandwich,The Human,the_human,0.55,0.85,0.40,true,"He used to make sandwiches in here.<break time=""500ms""/>Two slices of black bread, something he called 'salt-protein,' a smear of the green stuff from Hydroponics.<break time=""400ms""/>He'd put one in front of you whether you asked or not.<break time=""500ms""/>He said he wasn't a cook. He was lying.<break time=""400ms""/>He was a wonderful cook.<break time=""500ms""/>He just didn't want anyone to compliment him for it.<break time=""900ms""/>I'm sorry — I haven't said his name in a long time.<break time=""500ms""/>It hurts to say his name.","Quiet, fond, slightly cracked at the edges. Do NOT escalate — the Human keeps control. Final clause quieter than the rest, almost an apology. The Engineer's name is never spoken — that is the point.",P0
```

**Output:** `apps/client/public/audio/human/human_beat_d5_sandwich.mp3`

### 9.6 VFX — Beat D.5 effects

| VFX ID | Effect | Tech | Output | Notes |
|---|---|---|---|---|
| `vfx_galley_pilot_warm` | Warm-amber pilot light on stove with subtle 5% brightness increase over 4 seconds | CSS keyframe alpha tween | `apps/client/public/art/vfx/prelude/galley-pilot-warm.webm` | Galley only. The first warm-color light in the Prelude — singular. |
| `vfx_galley_steam_residue` | Faint vertical steam ribbon rising from the coffee mug (visible only in the second half of the cutscene, very subtle, suggests warmth that isn't quite there) | PixiJS particle column with very low alpha | `apps/client/public/art/vfx/prelude/galley-steam-residue.webm` | Optional polish — if it weakens the realism cut it; the line is doing the work |

---

## Section 10 — Beat E: Mess Hall / Prince's Archive

### 10.1 Narrative purpose

The player crosses from the galley (Beat D.5) into the Mess Hall — a long rectangular room with a central ten-seat crew table running most of its length, four side booths along one wall, and, along the *opposite* wall, **the Prince's Archive**. The Archive is not labeled. It is simply a long floor-to-ceiling shelf unit containing the Prince's private memorabilia: objects he kept where the crew could see them but never asked about.

The Mess Hall is **where the Engineer lived the most of his life aboard this ship.** He took every meal at the central table. He cooked for the crew. He read at the corner booth. He kept his things on the shelf because the Mess Hall was the room he spent the most time in, and he wanted the things he loved to be near him when he ate.

**This beat introduces the flashback mechanic** — the single most important interaction system unique to the Prelude. When the player approaches specific objects on the Archive shelf, the room's color palette **sepia-drains** (a three-second transition to yellow-brown tones), a subtle **film-damage** overlay appears (suggesting a memory being replayed), and a **holographic Prince recording** plays — the voice of the dead Engineer, reflecting on that specific object, recorded years before his death and discovered here by the player seventeen thousand years later.

**Two canonical objects trigger flashbacks in Beat E:**

1. **Kael's toy soldier** — a battered cast-metal figure of a human soldier, roughly twelve centimeters tall, standing at a loose approximation of attention. Paint worn away from the arms and face from decades of handling. This is the oldest object in the Archive. The Prince has kept it since he was a child. Triggering this object plays **Prince VO line 1**, a warm reflection on Kael as a child before either of them knew what the world would become. See §10.5.
2. **The Headmaster's diploma** — a framed parchment from the Mechronis Academy, signed by Headmaster Kanevas, hung on the wall *above* the Archive shelf. The frame is dark wood, simple, slightly askew. The parchment is worn, the ink faded but still legible in places (render no legible text in the art — just suggest calligraphic ink marks). Triggering the diploma plays **Prince VO line 2**, a reflection on the Prince's education under Kanevas. The tone is respectful but *measured*. **Canon hygiene rule (enforced):** in this VO line and every Prelude reference to Kanevas, Kanevas is **a standard Mechronis Academy headmaster.** Nothing in this beat — nothing in any Prelude content — may hint at his nature as the CoNexus interface layer. That reveal is Act 4 material per `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §4.6 machine-god hygiene rules.

**A third object is visible but not yet interactive**: **a small dark composite strongbox** at the center of the Archive shelf, roughly the size of a shoebox, sealed with a cyan-glowing biometric lock. A small holographic label beside it (render no legible text) identifies it internally, but the lock is dim and the strongbox is inert. This is the **sealed Recruiter's Logs seed** — canonically it contains Kael's recruiting network of 213 contacts, the same 213 entries the Prince references in Log 3 (`CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.4) and the same 213 entries Elara will mention by name when the player reaches Beat F (§11 below). The player cannot open it in Beat E. They can see it, register the lock, and carry the question forward. The strongbox is a physical object the player will return to after Beat F unlocks it.

**Pay-off for the Beat D.5 Galley callback**: the Human's line about *"he used to make sandwiches in here. He was a wonderful cook. He just didn't want anyone to compliment him for it"* is canonically referring to the Prince. The Mess Hall is where the Engineer made those sandwiches. The galley was his prep station, but the Mess Hall was where he sat down to eat with the crew. A silent visual callback in the cutscene can connect the two: an empty plate on the central table, positioned at the seat-with-the-best-view-of-the-door (the seat the Prince preferred), with a folded paper napkin beside it. Nothing is said about the plate. The player who noticed the Galley mug will notice the plate.

### 10.2 Cross-references

- Prince voice profile: §2 of this doc (existing)
- Flashback mechanic (sepia-drain, film-damage, recorded holo-replay): new to this doc, reused in Beat J
- Kael as Insurgency figure / Collector victim / recruiter of 213: `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.4 Audio Log 3 *The List I Am On*, §5.6 Movement 4 *To Kael*
- Sealed Recruiter's Logs 213-entry canon: `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.6 footnote referencing Beat F Section 11
- Headmaster Kanevas as normal-headmaster-in-Prelude: `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §4.3 and §4.6 hygiene rules
- Warlord / Kael childhood palace canon: `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §1.6 (Warlord retcon — the Engineer does NOT know the Warlord was a swarm, so his memory of childhood with Kael can include implied-Warlord-as-tutor content without breaking canon)
- Galley sandwich callback payoff: §9.5 `human_beat_d5_sandwich` line in this doc

### 10.3 Art — Mess Hall environment still

- **Output:** `apps/client/public/art/rooms/room-mess-hall.png` + `.webp`
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Style anchor:** §0 global + Prelude modifiers. **Critical compositional requirement:** both the central crew table AND the Prince's Archive shelf on the left wall must be in frame, with the Archive readable as the emotional focal point even though the table dominates the composition by sheer size

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the crew Mess Hall aboard Ark 1047 — a long rectangular room, twelve meters deep and six meters wide, with a ceiling of four meters. **Dead center of the room, running most of its length, a long dark brass-and-bone crew table** — ten seats, currently arranged with the chairs slightly pushed back from the table as if the last meal ended mid-conversation seventeen thousand years ago. The chairs are heavy, worn, each one slightly different in wear pattern. **One chair at the far end of the table, the seat closest to the Archive shelf, has a folded paper napkin beside an empty composite plate** — the only plate on the table. Faint ring of dried crumb-dust on the plate's surface. Along the **right wall**, four curved booth alcoves, each with a small embedded reading lamp (all dark), upholstered in dark brass leather that has cracked with age. Along the **left wall**, running nearly the entire twelve-meter length, the **Prince's Archive** — a floor-to-ceiling shelf unit made of dark composite, twelve shelves high, broken into vertical bays every meter, holding an eclectic assortment of small objects: stacks of paperbound books (render no legible spines), small mechanical parts, a wooden chess set mid-game (pieces scattered as if someone was called away mid-move), framed miniature sketches, a glass jar of small brass keys, coils of copper wire, a pair of reading glasses, a small clay teacup. **The center bay of the shelf, at standing eye level, holds three compositionally-dominant objects**: (1) a battered cast-metal child's toy soldier, twelve centimeters tall, standing at loose attention, paint worn away from the face and arms, leaning slightly against the shelf back; (2) a small dark composite strongbox the size of a shoebox, with a cyan #22d3ee biometric lock on its front — the lock is currently dim/inert, not glowing actively — and a small holographic label beside it emitting a very faint cyan glow (render no legible text); (3) a handful of other small trinkets filling the shelf space around them. **Above the Archive shelf, mounted on the left wall approximately two meters above the shelf top**, a framed parchment diploma in a dark wood frame, hung slightly askew — the frame is a simple horizontal rectangle roughly forty centimeters wide, the parchment inside bears calligraphic ink marks in the manner of academic credentials (render no legible text, but suggest the handwriting of formal signatures and a seal at the bottom). The parchment is faded. The frame is old. **Lighting**: no overhead lights. Illumination comes from cyan emergency floor strips, two dim cyan reading-lamp pilot pips on the booth alcoves, a single dim amber-yellow #fbbf24 service light mounted above the far end of the central table (the only warm light), and a very faint cyan glow from the strongbox's holographic label. Volumetric fog at ankle height, very subtle. Anamorphic lens flare on the amber service light and on the framed diploma's glass (a soft edge-glint suggesting the glass is still intact). Film grain. Deep space black #010020 base. **No rendered text anywhere — not on the plate, not on the diploma, not on the strongbox label, not on the book spines. No people. No holograms** (the Prince's holograms appear only in the cutscene). Cinematic 4K composition, three-quarter wide shot from the entrance doorway, standing eye level, framing both the long central table (which dominates the lower two-thirds of the composition) and the Archive shelf on the left wall (which holds the eye because of the visible toy soldier, strongbox, and the diploma mounted above). The mood: **a room where one specific person ate every meal of his adult life, kept the things he loved where he could see them while he ate, and then did not come back.**

### 10.4 Cutscene — E: Mess Hall Flashback

- **Beat ID:** `prelude-beat-e-mess-hall-flashback`
- **Output:** `apps/client/public/videos/prelude/prelude-beat-e-mess-hall-flashback.mp4`
- **Duration:** 45s
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `cutscene_mess_hall_intro_complete`, `prince_archive_seen`, `flashback_mechanic_learned`, `toy_soldier_flashback_played`, `diploma_flashback_played`, `recruiter_strongbox_seen_sealed`
- **Reduced-motion fallback:** static `room-mess-hall.png` + KineticText narration of both Prince VO lines (`prince_beat_e_toy_soldier` and `prince_beat_e_diploma`) in sequence with KineticText-rendered "FLASHBACK — RECORDED RECORDING" banner above the narration

**Structural note:** this cutscene has **three distinct visual acts** inside the 45-second runtime, each marked by a camera move and a sepia-drain transition. The player is being taught *how the flashback mechanic works* for the first time — the Mess Hall is the onboarding beat for a system that will reappear in Beat J's Archives scene.

- **Act 1 (0–10s) — arrival.** Full-color Mess Hall. Camera pushes from the doorway into the room, revealing the long central table, the one-chair-with-a-plate, and the left-wall Archive. Elara is not in this scene — this is a silent room. The player is alone with the furniture.
- **Act 2 (10–25s) — toy soldier flashback.** Camera arrives at the toy soldier's shelf bay. The scene sepia-drains to yellow-brown tones (3-second transition). A **holographic Prince** materializes standing at the Archive shelf, *holding the toy soldier in one hand*, his back half-turned to camera. He is about forty years old in this recording, in the early-career look from §2.4 (cream linen shirt, rolled sleeves, no tie). He is not aware of the camera. He speaks Prince VO line 1 (§10.5) directly to the toy soldier in his hand. At the end of the line, the hologram fades and the sepia drains back to full color over 2 seconds. **The toy soldier has not moved on the real shelf** — the real object stayed where it was the entire time. Only the hologram held it.
- **Act 3 (25–45s) — diploma flashback.** Camera tracks up the left wall to frame the mounted diploma above the shelf. Second sepia-drain (3-second transition). A **different holographic Prince** materializes, this one a younger version — roughly twenty-five, still in the early-career look but slightly less settled in his posture. He is standing where the real player would stand, looking up at the diploma on the wall. He speaks Prince VO line 2 (§10.5). Midway through the line, a brief **diploma bloom** VFX pulses — a soft pale-gold ink glow tracing briefly over the faded calligraphy of the diploma (render as subtle bloom, no legible text revealed). At the end of the line, the hologram fades and the sepia drains back to full color over 2 seconds. Camera pulls back slightly and holds on the Archive shelf for a final 3 seconds, now including the **sealed strongbox** in frame — still dim, still inert, *not* a flashback trigger — and the cyan glow of its dormant biometric lock is the last thing the player sees before the cutscene ends.

**START FRAME (Nano Banana 2):**
> Identical composition to the §10.3 Mess Hall still, but framed for a camera just *inside* the entrance doorway, looking diagonally across the room with the central table dominating the lower right and the Archive shelf on the left wall just coming into frame. The framed diploma is partially visible in the upper-left corner. The plate-with-napkin on the far chair is visible. Warm-amber service light on the ceiling above the far end of the table. Full color (no sepia yet — the sepia drain is an in-motion effect). 16:9, 4K, no text.

**MID FRAME A (Nano Banana 2, used for the toy-soldier flashback hologram in Act 2):**
> Close shot of the Archive shelf's center bay, now sepia-drained to yellow-brown tones. A translucent cyan-edged **holographic figure of the Prince** stands at the shelf, back three-quarters turned to camera, holding the battered toy soldier in his right hand, looking at it. The Prince is approximately forty years old in this recording, wearing a cream linen shirt with rolled sleeves, no tie, loose dark trousers. His face is in partial three-quarter view, soft cheekbone line visible, expression unreadable. The real toy soldier on the shelf is still in its original position — the hologram's hand holding "the toy soldier" is a memory replay, not physical manipulation. Faint holographic scan lines are visible on the Prince's form. Film-damage overlay (subtle scratches, one thin vertical line of bright dust) sits on the entire frame. 16:9, 4K, no text.

**MID FRAME B (Nano Banana 2, used for the diploma flashback hologram in Act 3):**
> Medium shot looking up at the framed diploma on the left wall above the Archive shelf. Sepia-drained to yellow-brown tones. A second translucent cyan-edged **holographic figure of the Prince** stands in the foreground facing the wall, three-quarter back view, looking up at the diploma. This version is younger — roughly twenty-five years old — same cream linen shirt and rolled sleeves, but his posture is slightly less settled, hands in his trouser pockets, weight on one leg. A brief soft pale-gold **ink bloom** is tracing across the calligraphic marks of the diploma inside the frame (render as subtle glow, no legible text revealed). Faint holographic scan lines on the younger Prince's form. Film-damage overlay still present, slightly heavier than in Mid Frame A. 16:9, 4K, no text.

**END FRAME (Nano Banana 2):**
> Full-color Mess Hall, sepia fully drained back to normal, both holograms gone. Camera has pulled back to a medium-wide shot of the Archive shelf, including the toy soldier, the still-dim strongbox (now the compositional focal point — faint cyan glow from its biometric lock), and the diploma mounted above. The plate-and-napkin on the far chair is visible on the right edge of frame. Warm-amber service light above the central table. The real Mess Hall — no holograms, no sepia, no flashback — but the player now knows what the room *contains*. Volumetric fog ankle height. Anamorphic lens flare on the strongbox's cyan lock. Film grain. Deep space black #010020 base. 16:9, 4K, no text.

**SEEDANCE 2.0 motion prompt:**
> Slow continuous camera work across three acts inside a 45-second runtime. **Act 1 (0–10s):** forward dolly from the doorway into the Mess Hall, full color, camera at standing eye level, diagonally revealing the central table, the one-chair-with-plate, and the left-wall Archive shelf. Dust motes drift in the amber service light. **Transition at 10s (3 seconds long):** sepia-drain from full color to yellow-brown tones. **Act 2 (10–25s):** camera is now at the Archive shelf's center bay. Holographic Prince materializes holding the toy soldier (use Mid Frame A as visual anchor). Film-damage overlay appears. At 14s the Prince begins speaking (audio triggers Prince VO line 1 from §10.5). The hologram holds the soldier, occasionally turning it in his hand, the gesture small and private. At 24s the line finishes. The hologram fades over 1 second. **Transition at 25s (sepia drains back to full color over 2 seconds).** **Act 3 (27–45s):** camera tracks up the left wall to frame the diploma. Second sepia-drain transition at 27s (3 seconds). Younger holographic Prince materializes in front of the diploma (use Mid Frame B). At 30s he begins speaking (audio triggers Prince VO line 2 from §10.5). At 34s a brief pale-gold ink bloom traces across the diploma's calligraphy (render as subtle glow, holds 2 seconds, fades). At 40s the line finishes. The hologram fades over 1 second. Sepia drains back to full color over 2 seconds. Camera pulls back slightly for the final 3 seconds to frame the Archive shelf including the dormant strongbox — the final shot is the sealed strongbox's cyan lock glow catching the player's eye as the cutscene ends. 24fps. Reverent, archaeological, private-memory tone.

### 10.5 VO — Beat E new lines (two Prince flashback lines)

Both lines are **recorded holographic recordings** — the Prince speaking to himself in private years before his death. The player discovers them as archived files. Neither is addressed to any living listener; both are internal reflections the Prince committed to his personal archive because he wanted to hear himself think about the specific object in his hand.

**Prince VO Line 1 — `prince_beat_e_toy_soldier`** — fires at 14s of the cutscene, in Act 2, as the forty-year-old holographic Prince holds the toy soldier in his hand. Approximately 18 seconds of audio.

| Line ID | Character | Voice profile | Beat | Text | Direction | Priority |
|---|---|---|---|---|---|---|
| `prince_beat_e_toy_soldier` | The Prince | `the_prince` | E (fires at 14s of cutscene, Act 2 hologram) | `"This one belonged to Kael. I don't know how I ended up with it — I think he gave it to me during one of the tutoring sessions, when we were seven. He told me it was his second-favorite, and I was supposed to be grateful and I was. I have kept it on every desk I have ever owned. When people ask me what the first thing I would grab in a fire is, I never tell them this. I tell them the notebook. But it would be this. It has always been this. He made me a better person by loaning it to me, and he has never asked for it back, and I have never offered."` | Warm, private, half-smile in the voice. The "aristocratic slip" from §2.4 may land subtly once — on the word "tutoring" — but should not be played for emphasis. The line is a man alone in a room talking to himself about a childhood friend he loved. No grief yet — this recording was made before Kael was taken by the Collector. The tone should be the same warmth the Human carries about the Engineer in §9.5, one degree removed. End on "offered" without softening — the Prince has finished thinking about the thing and the recording ends mid-breath, as if he is about to put the toy soldier back on the shelf. | P0 |

**ElevenLabs CSV row:**
```csv
prince_beat_e_toy_soldier,The Prince,the_prince,0.55,0.85,0.35,true,"This one belonged to Kael.<break time=""500ms""/>I don't know how I ended up with it — I think he gave it to me during one of the tutoring sessions, when we were seven.<break time=""500ms""/>He told me it was his second-favorite, and I was supposed to be grateful and I was.<break time=""700ms""/>I have kept it on every desk I have ever owned.<break time=""500ms""/>When people ask me what the first thing I would grab in a fire is, I never tell them this. I tell them the notebook.<break time=""600ms""/>But it would be this. It has always been this.<break time=""700ms""/>He made me a better person by loaning it to me, and he has never asked for it back, and I have never offered.","Warm, private, half-smile in the voice. Aristocratic slip lands subtly on 'tutoring' only, no emphasis. A man alone in a room talking to himself about a childhood friend he loved. No grief yet — this recording predates Kael's capture. Same register as §9.5 Human sandwich line but one degree warmer. End on 'offered' without softening, recording ends mid-breath as if he's about to put the toy soldier back on the shelf.",P0
```

**Output:** `apps/client/public/audio/prince/prince_beat_e_toy_soldier.mp3`

**Prince VO Line 2 — `prince_beat_e_diploma`** — fires at 30s of the cutscene, in Act 3, as the twenty-five-year-old holographic Prince stands in front of the diploma. Approximately 17 seconds of audio.

| Line ID | Character | Voice profile | Beat | Text | Direction | Priority |
|---|---|---|---|---|---|---|
| `prince_beat_e_diploma` | The Prince | `the_prince` | E (fires at 30s of cutscene, Act 3 hologram) | `"Kanevas signed it with his left hand. I noticed because I was in the front row at the ceremony, and I watched him sign every diploma that day, and every one of them was with the left hand. He told me once, in his office, that he preferred to write with the hand that wasn't the dominant one because it made him slow down. He said the slowness was where the thinking happened. I have tried to believe that about him for years. Some days I do. I am going to keep this on the wall because on the days I do not believe it, the frame is still on the wall, and that means I graduated from his academy, and graduating from his academy is a true thing regardless of what I think about him on any given morning."` | Measured, careful, and exactly one click more formal than his other Prelude VO — this is the twenty-five-year-old Prince, younger and still learning to talk about authority figures with precision. The "aristocratic slip" should land once, softly, on "academy" (both times). There is a **crucial canonical hygiene rule**: this line is **NOT a CoNexus hint**. The Prince's ambivalence about Kanevas is the normal ambivalence of a graduate toward a headmaster who was influential but not personally warm. It is NOT the ambivalence of someone who has figured out Kanevas is an interface layer for a machine god. The actor must NOT play mistrust or suspicion — play respect mixed with *mild private reservation*. The line should feel like a young man putting a framed diploma on the wall and thinking about whether he is proud of it. End on "given morning" with zero irony. | P0 |

**ElevenLabs CSV row:**
```csv
prince_beat_e_diploma,The Prince,the_prince,0.50,0.85,0.30,true,"Kanevas signed it with his left hand.<break time=""500ms""/>I noticed because I was in the front row at the ceremony, and I watched him sign every diploma that day, and every one of them was with the left hand.<break time=""600ms""/>He told me once, in his office, that he preferred to write with the hand that wasn't the dominant one because it made him slow down.<break time=""500ms""/>He said the slowness was where the thinking happened.<break time=""700ms""/>I have tried to believe that about him for years.<break time=""500ms""/>Some days I do.<break time=""700ms""/>I am going to keep this on the wall because on the days I do not believe it, the frame is still on the wall, and that means I graduated from his academy, and graduating from his academy is a true thing regardless of what I think about him on any given morning.","Measured, careful, one click more formal than other Prelude Prince VO — younger Prince learning to talk about authority figures with precision. Aristocratic slip lands softly on 'academy' (both times). CANON HYGIENE: NOT a CoNexus hint. Play normal graduate ambivalence toward an influential-but-not-warm headmaster. Actor must NOT play mistrust or suspicion — respect with mild private reservation. Like a young man putting a framed diploma on the wall and thinking about whether he's proud of it. End on 'given morning' with zero irony.",P0
```

**Output:** `apps/client/public/audio/prince/prince_beat_e_diploma.mp3`

**Voice direction note for the casting session:** both Prince lines in Beat E should be recorded in the **same session** as Logs 1–5 from `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5, because they share the same voice profile and the same emotional register. The Beat E lines are *lighter* than any of the Logs — no grief, no prophecy weight, no Witness framing — but they sit in the same actor's mouth and the continuity will read on playback. Do not record Beat E lines in a later session: the voice will age into the role by then and Beat E needs the *pre-grief* Prince, which is a specific vocal quality the actor will be carrying at the start of the session, before Logs 4–5 take it out of them.

### 10.6 VFX — Beat E effects

| VFX ID | Effect | Tech | Output | Notes |
|---|---|---|---|---|
| `vfx_sepia_drain` | Full-screen color grading transition from normal palette to sepia/yellow-brown tones over 3 seconds (and reverse over 2 seconds) | CSS filter keyframes + WebGL shader fallback for older devices | `apps/client/public/art/vfx/prelude/sepia-drain.webm` (forward and reverse variants) | **Core flashback mechanic asset.** Reused in Beat J (Archives) for the Witnesses scene, in any Act-scope content that uses holographic memory replay, and in the existing `DiscoveryVideoOverlay.tsx:28` entity cinematics as a standardized "memory mode" indicator. This is a **shared system asset** — ship it in the Prelude but register it in `apps/client/src/components/VFXRegistry.ts` (new file or existing) so later features can import it |
| `vfx_film_damage_overlay` | Subtle scratch marks, a thin vertical line of bright dust, and occasional frame-jumps layered over the sepia-drained image | PixiJS sprite sheet (three scratch variants, one dust-line loop, one frame-jump one-shot) | `apps/client/public/art/vfx/prelude/film-damage.webm` (loop) | Layers on top of `vfx_sepia_drain` during the flashback. Intensity scales with how "old" the memory is — the toy soldier flashback (Act 2) uses a lighter film-damage layer, the diploma flashback (Act 3) uses a slightly heavier one because the recording is younger in the Prince's voice but older as an archival artifact. Reused in Beat J |
| `vfx_diploma_ink_bloom` | Pale-gold (#fde047) soft bloom tracing across the calligraphic ink marks on the framed diploma, 2-second hold, no legible text revealed | PixiJS masked bloom over the diploma's bounding box | `apps/client/public/art/vfx/prelude/diploma-ink-bloom.webm` (one-shot) | Triggers once at 34s of the Beat E cutscene. The bloom is a visual signifier for the recording "catching" on a specific memory detail — the ink moment is the diploma's equivalent of the toy soldier being held. Mess Hall only, single-use |

**Flashback mechanic summary (for engineering handoff):**

The Beat E cutscene introduces the flashback system that the rest of the Prelude (specifically Beat J) will reuse. The system has three layered components:

1. **Color grade transition** (`vfx_sepia_drain`) — wraps the entire scene, signaling "memory mode"
2. **Film damage overlay** (`vfx_film_damage_overlay`) — layered on top of the color grade, signaling "recorded recording"
3. **Holographic figure** (existing holo-render system from Beat A's Elara hologram) — rendered with additional sepia-compatible color hints so the cyan edges don't clash with the sepia palette

Engineering requirement: the holo-render system must accept a **sepia-mode flag** that shifts the cyan edge tint from `#22d3ee` to a warm cyan-brown blend `#a88a6b` when `vfx_sepia_drain` is active. This is a ~20-line CSS variable swap, not a new shader.

The **trigger pattern** for flashbacks is object-proximity-based: the player's position near a designated "flashback anchor" (a transform node attached to a specific object like the toy soldier or the diploma) causes the flashback cutscene to play. This is identical to the existing Beat D mission-slate interaction pattern but with the cutscene instead of a tooltip. No new input binding is required.

**Reduced-motion accessibility fallback:** when `prefers-reduced-motion` is active, all three flashback VFX layers are suppressed and the Prince VO lines are delivered via KineticText with a static "FLASHBACK — RECORDED RECORDING" banner and a simple sepia overlay (no animation on the drain — it is just *sepia* the whole time). The VO lines play identically. The cutscene's timing is preserved. Reduced-motion players experience the Mess Hall as a static image with narrated holograms.

---

