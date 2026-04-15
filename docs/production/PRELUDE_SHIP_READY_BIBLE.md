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

## Section 11 — Beat F: Briefing Room — Kael Contingency Memo

### 11.1 Narrative purpose

The player crosses from the Mess Hall into the **Briefing Room** — a smaller, formal space at the ship's operational center where the original crew used to hold mission planning sessions. A low curved table in the middle, eight swiveling command chairs around it (one currently empty and slightly askew, set aside from the others — this is the seed for Beat F.5's Empty Chair breath beat), a wall-mounted holographic display on the far wall, and two lockboxes embedded in the side walls. The room is **smaller and colder** than the Mess Hall — no warm-amber service light, no memorabilia, no personal objects. This is the room where decisions happened.

**The beat has two load-bearing moments:**

1. **The sealed Recruiter's Logs from Beat E are now opened.** The Briefing Room's left-wall lockbox accepts the same biometric key that was dormant on the strongbox in Beat E's Mess Hall. When the player approaches the Briefing Room lockbox, Elara recognizes the biometric handshake and opens it remotely — the cyan lock that was dim in Beat E is now **bright** on the new lockbox, a deliberate visual callback. Inside the lockbox is the **Recruiter's Logs** — Kael's canonical recording of his 213 Insurgency contacts. Elara previews the count aloud: *"Two hundred and thirteen entries. All of them encrypted."* The player does not see the contents — just the count. The number **canonically matches** `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.4 Audio Log 3 where the Prince says *"Kael had a recruiting network. Two hundred and thirteen contacts."* This is the first time the player's in-game experience concretely ties to the Prince's Oracle audio logs from Beat C — the number they just heard in the log is the number they see on the ledger.

2. **The Kael Contingency Memo is discovered.** Mounted in the right-wall lockbox (which was never locked — just closed) is a single holographic document titled **"If Kael is taken — a memo from the Engineer."** It is a plain-language plan the Prince wrote the day after Kael disappeared from the Razorline staging house (per canon §5.4), addressed to whoever finds it. The memo does not play as VO — it is a **readable document** that materializes as a holographic interface when the player interacts with the lockbox. Its content is intentionally minimal (the memo is *pragmatic*, not emotional) and it appears as three short bullet points on the holo-display. The player reads them. There is no narration over the reading. The silence while the player reads is the point — the Briefing Room is the room where the Prince stopped speaking and started writing.

**The memo's three bullet points (canonical, to be rendered legibly on the holographic display):**

1. *"If Kael is taken: the Recruiter's Logs must be opened. The 213 are already in motion whether or not anyone knows it. Do not keep them for safekeeping. Give them away."*
2. *"If Kael is taken: do not retaliate. I have already modeled six retaliation paths and none of them recover him. Mourn him in public. Keep working in private."*
3. *"If Kael is taken: assume I am next."*

The third bullet is the one that lands. The player has by this point already heard Log 3 (`CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.4 *The List I Am On*) either through Beat C's initial holo-bench interaction or through discovery on the way to Beat F, so the player recognizes that the Prince **was right**. The Contingency Memo is an earlier, less-worked-out version of the diagnosis that Log 3 completes — written the day after Kael was taken, before the Prince had done the full pattern analysis of the Eyes and the Oracle. The memo is the seed. Log 3 is the flower. Log 5 is the harvest.

**This beat is the first concrete payoff of the canon tie between the Oracle audio logs and the in-game environment.** The player has been hearing the Prince's thoughts in the Beat C bench logs; the Briefing Room is where those thoughts become *physical artifacts* the player can touch.

**Structural note on the empty chair:** one of the eight command chairs around the briefing table is set apart from the others — pushed back from the table, angled slightly away, subtly *not fitting the circle*. This is not called out in the Beat F cutscene. It is visible in the art still. It is the canonical seed for **Beat F.5** (§12 — the 90-second silence breath beat) where the Human delivers his third and most fragile line directly to that empty chair. Beat F plants the visual. Beat F.5 pays it off with the silence.

### 11.2 Cross-references

- Kael canonical 213-contact figure: `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.4 Audio Log 3 (line `holo_the_list_i_am_on`)
- Prince's diagnosis that Kael's disappearance is the first of four: same log §5.4
- Prince's Log 5 farewell to Kael: `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.6 Movement 4
- Sealed strongbox seed: §10.1 and §10.3 of this doc (Beat E Mess Hall Archive)
- Empty chair pay-off: §12 of this doc (Beat F.5 Empty Chair breath beat)
- Kael's childhood palace memory (background canon — writer should know but not reference): `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §1.6 Warlord retcon
- Existing Briefing Room context in the wider game: none canonical yet — this doc establishes it

### 11.3 Art — Briefing Room environment still

- **Output:** `apps/client/public/art/rooms/room-briefing-room.png` + `.webp`
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Style anchor:** §0 global + Prelude modifiers. **Critical compositional requirement:** the central circular table with eight command chairs (one visibly askew), the left-wall lockbox that will unlock in the cutscene, the right-wall lockbox that holds the memo, and the far-wall holographic display must all be in frame. The room should feel **smaller and more formal** than the Mess Hall — a working room, not a living room.

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the crew Briefing Room aboard Ark 1047 — a smaller, formal room approximately eight meters square with a ceiling of three and a half meters. **Dead center of the room, a low curved command table** made of dark composite with brass inlay, roughly four meters in diameter, its surface currently dark and inert. **Eight command chairs** arranged around the table — seven of them pulled neatly into the table at equal intervals, backs aligned, creating a disciplined visual rhythm; **the eighth chair sits apart from the circle**, pushed back approximately forty centimeters, angled slightly away from the table as if the last person to sit in it rose, stepped out, and never sat back down. That one chair should draw the eye subtly without dominating — the viewer may not immediately register what is off, but the asymmetry of seven-tight-one-loose reads as *wrong* in a way that is hard to look away from. The chairs are heavy, upholstered in dark brass leather, with small cyan #22d3ee status indicators at the neck (all dark). **Far wall** holds a flat rectangular holographic display, two meters wide, one meter tall, currently dark and inert — a smooth dark composite surface with faint cyan edge strips. **Left wall** holds an embedded lockbox at waist height — a recessed rectangular compartment with a cyan biometric lock on its front door. The lock is currently **bright cyan #22d3ee, pulsing at sub-1 Hz** (a visible change from Beat E's dormant version — this lockbox recognizes the player is in range). **Right wall** holds a second embedded lockbox of identical dimensions but without a biometric lock — its door is slightly ajar, revealing a faint holographic glow spilling from inside (render as soft cyan edge-light, suggest a document waiting but do not render legible text). **Lighting**: no overhead lights. Illumination comes from cyan emergency floor strips, the central table's faint cyan brass-inlay glow, the two lockbox lights (left bright and pulsing, right soft and steady), and dim cyan pips at the base of each command chair. No warm lights in this room at all — the Briefing Room is the first room in the Prelude with **no amber anywhere**, a deliberate break from the Mess Hall's warmth. Volumetric fog at ankle height, slightly denser here than in adjacent rooms. Anamorphic lens flare on the bright pulsing left-wall lockbox. Film grain. Deep space black #010020 base. **No rendered text. No people. No holograms.** Cinematic 4K composition, three-quarter wide shot from the entrance doorway, standing eye level, framing the central table (dominant middle-ground), the eight chairs (with the askew chair creating subtle asymmetry), both lockboxes on the side walls (visible as secondary focal points), and the far-wall holo display (visible but not yet active). The mood: **the room where decisions happened, empty of the people who made them, with one chair pushed back forever.**

### 11.4 Cutscene — F: Briefing Room — Kael Contingency Memo

- **Beat ID:** `prelude-beat-f-briefing-room`
- **Output:** `apps/client/public/videos/prelude/prelude-beat-f-briefing-room.mp4`
- **Duration:** 30s
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `cutscene_briefing_room_intro_complete`, `recruiter_strongbox_unlocked`, `kael_contingency_memo_read`, `kael_213_count_acknowledged`, `briefing_empty_chair_seen`
- **Reduced-motion fallback:** static `room-briefing-room.png` + KineticText narration of `elara_beat_f_213_entries` + a static rendering of the three-bullet Kael Contingency Memo on the right-wall holo display

**Structural note:** this cutscene has **two distinct interactive moments** separated by a beat of silence for the player to process. The first moment is the left-wall lockbox recognizing the player's proximity and the Recruiter's Logs opening. The second moment is the right-wall lockbox's Kael Contingency Memo materializing on the far-wall holo display for the player to read. The silence between them is ~6 seconds — short enough to feel continuous, long enough to register as *this is a different kind of thing*.

- **Act 1 (0–5s) — arrival.** Camera pushes from the doorway into the Briefing Room. Full-color, no sepia, no flashback — this is a *present tense* beat. The central table dominates. The eight chairs (seven neatly aligned, one askew) frame the middle ground. Dust motes drift in the dim cyan emergency lighting. The player sees the askew chair but does not yet know why it matters.
- **Act 2 (5–14s) — Recruiter's Logs unlock.** Camera glides to the left wall as the bright-pulsing lockbox recognizes the player's proximity. Elara's hologram materializes beside the lockbox (first Elara hologram since Beat D). The biometric lock flashes once — a three-frame brighter pulse — and the lockbox door slides open with a brass-on-composite click (foley, §17.6 style). Inside the lockbox is a **small data-slate** the size of a paperback book, pulsing cyan, surfaces inscribed with the faint outlines of holographic text (render no legible text — just a dense grid of glyph-positions suggesting many entries). Elara reaches toward the slate (her hand passes harmlessly through the physical object — she is a hologram projecting into the lockbox's volume). At 11s Elara speaks the `elara_beat_f_213_entries` line from §11.5. At 13s the slate's pulse slows and settles — the logs are "read" but not yet shared with the player's inbox.
- **Silent beat (14–20s).** Camera dollies back to a wide shot of the briefing table. Elara's hologram remains in frame on the left, beside the open lockbox. The askew chair is now centered in the composition. No dialogue, no VO, no music beat — just 6 seconds of held silence while the player registers that the lockbox is open *and* that the chair is misaligned. The music mix in this beat should drop to near-silence (a single low sustained cello note, barely audible).
- **Act 3 (20–30s) — Kael Contingency Memo materializes.** Camera glides to the right wall. The right-wall lockbox's door swings open fully (it was already ajar — now it opens the rest of the way). A single pale cyan holographic sheet rises out of the lockbox and **projects onto the far-wall holo display** — the display wakes for the first time, its dark surface brightening to show a three-bullet document titled **"If Kael is taken — a memo from the Engineer."** The three bullets appear one at a time, two seconds apart, each rendered in **the same handwritten-calligraphic font used on the Prince's Mess Hall diploma**. Render the three bullets **fully legible** on the display (this is the *one* exception to the Prelude's no-legible-text rule — the memo is meant to be read):
  1. *"If Kael is taken: the Recruiter's Logs must be opened. The 213 are already in motion whether or not anyone knows it. Do not keep them for safekeeping. Give them away."*
  2. *"If Kael is taken: do not retaliate. I have already modeled six retaliation paths and none of them recover him. Mourn him in public. Keep working in private."*
  3. *"If Kael is taken: assume I am next."*
  The third bullet lands at 28s and holds for the final 2 seconds of the cutscene. Camera holds on the display. Elara is visible in peripheral frame on the left, silent. The cutscene ends with the third bullet glowing on the display and the player in an empty room reading the Engineer's own prediction of his own death.

**START FRAME (Nano Banana 2):**
> Identical composition to the §11.3 Briefing Room still, but framed from just inside the entrance doorway, camera at standing eye level looking diagonally across the room with the central table in the lower-middle ground, the eight chairs arranged around it (the askew chair visible on the far side of the table), and both side-wall lockboxes visible in the mid-background. The left-wall lockbox's biometric lock is bright cyan, pulsing. The right-wall lockbox's door is already slightly ajar. The far-wall holo display is dark. Full color, no flashback treatment. 16:9, 4K, no text.

**MID FRAME (Nano Banana 2, used for the 213-count moment in Act 2):**
> Medium shot of the left-wall lockbox, open, revealing a small cyan-pulsing data-slate the size of a paperback book. Elara's translucent cyan hologram is standing beside the lockbox, one hand reaching toward the slate, the hand passing harmlessly through the physical slate's volume. Her face is in three-quarter view, expression attentive-sad, her eyes fixed on the slate. The rest of the Briefing Room is slightly out of focus in the background, with the askew chair visible as a blur on the right edge of the frame. Full color. 16:9, 4K, no text *on the slate* (the slate holds the shape of many entries but none legible).

**END FRAME (Nano Banana 2):**
> Full front view of the Briefing Room's far wall, dominated by the holographic display now active and rendering the three-bullet **Kael Contingency Memo**. The display shows, in hand-written calligraphic cyan text, the three bullet points listed in §11.4 above — fully legible and readable by the player as static text in the frame. The title "If Kael is taken — a memo from the Engineer" sits above the three bullets in the same hand. Below and to the left of the display, the right-wall lockbox is open, its interior dark and empty (the memo has risen out of it). In the left peripheral frame, Elara's hologram is visible standing silently, one arm lowered at her side, watching the player read. The central briefing table occupies the lower third of the frame with the eight chairs visible (the askew chair central). Full color. Cinematic 4K composition. **This is the one exception to the "no rendered text" rule** — the three memo bullets MUST be rendered legibly in the end frame because the player is meant to read them.

**SEEDANCE 2.0 motion prompt:**
> Slow continuous camera work across three acts and one silent beat inside a 30-second runtime. **Act 1 (0–5s):** forward dolly from the doorway into the Briefing Room, standing eye level, revealing the central table, eight chairs, both lockboxes, and the dark far-wall display. Dust motes drift in the dim cyan floor-strip light. **Act 2 (5–14s):** camera glides left to the left-wall lockbox. At 7s Elara's hologram materializes beside the lockbox. At 8s the biometric lock flashes once (three-frame brighter pulse) and the lockbox door slides open. At 9s the cyan data-slate is revealed inside. At 11s Elara speaks the `elara_beat_f_213_entries` line. At 13s the slate's pulse slows and settles. **Silent beat (14–20s):** camera dollies back to a wide shot of the briefing table, Elara's hologram remaining in left-frame beside the open lockbox. 6 seconds of held silence. The askew chair is centered in the composition. Music drops to a single low sustained cello note, barely audible. **Act 3 (20–30s):** camera glides right to the right-wall lockbox. At 21s its door swings open fully. At 22s a pale cyan holographic sheet rises out of the lockbox and projects onto the far-wall display, which wakes to bright cyan. At 23s the document title appears ("If Kael is taken — a memo from the Engineer"). At 24s the first bullet renders, fully legible. At 26s the second bullet renders. At 28s the third bullet renders. Camera holds on the display for the final 2 seconds. Elara remains silently in left peripheral frame. 24fps. Cold, measured, documentarian tone — this is the room where decisions were made, not where feelings were expressed.

### 11.5 VO — Beat F new line

**One new Elara line** fires during the Act 2 Recruiter's Logs unlock. The Master Index table in §1 of this doc shows "0 new VO lines" for Beat F — that row is **stale** and will be corrected in the Section 1 Master Index fix-up pass (see §17.7 or a dedicated correction commit). The new line is canonically required to honor the cross-reference from `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.4 *"'two hundred and thirteen entries.' The number is canonical and must match across all references."*

| Line ID | Character | Voice profile | Beat | Text | Direction | Priority |
|---|---|---|---|---|---|---|
| `elara_beat_f_213_entries` | Elara | `elara` | F (fires at 11s of cutscene, Elara's hand reaching toward the newly-revealed data-slate) | `"Two hundred and thirteen entries. All of them encrypted. I cannot read any of them without his key, and his key is not in this room. But the count is the count. Two hundred and thirteen people trusted him enough to be written down by him. I want you to hear that number and hold it. Two hundred and thirteen. He was carrying that many before the Collector took him."` | Reverent, slow, unhurried. Elara is not grieving *yet* — she is acknowledging a weight the player needs to feel. The number "two hundred and thirteen" is said twice; the second time should be slightly quieter and more deliberate, so the player registers it as a recitation of honor rather than a duplicate line. The final sentence "He was carrying that many before the Collector took him" is the only clause that allows the voice to soften slightly — not crack, just soften. Elara is a hologram; she does not have grief-quality vocal cracks, but she has learned from the Human how to vary her register over seventeen thousand years of listening. End on "took him" with a slight downward inflection. | P0 |

**ElevenLabs CSV row:**
```csv
elara_beat_f_213_entries,Elara,elara,0.60,0.85,0.30,true,"Two hundred and thirteen entries.<break time=""500ms""/>All of them encrypted.<break time=""400ms""/>I cannot read any of them without his key, and his key is not in this room.<break time=""600ms""/>But the count is the count.<break time=""700ms""/>Two hundred and thirteen.<break time=""600ms""/>People trusted him enough to be written down by him.<break time=""500ms""/>I want you to hear that number and hold it.<break time=""700ms""/>Two hundred and thirteen.<break time=""500ms""/>He was carrying that many before the Collector took him.","Reverent, slow, unhurried. Not grieving yet — acknowledging a weight. Say '213' twice; the second time slightly quieter and more deliberate, like a recitation of honor. Final clause 'He was carrying that many before the Collector took him' allows slight softening — not a crack, just softer. Elara is a hologram but has learned register variation from the Human over 17,000 years. End on 'took him' with slight downward inflection.",P0
```

**Output:** `apps/client/public/audio/elara/elara_beat_f_213_entries.mp3`

**Note on the delivery:** this line is the first Elara VO in the Prelude that is *not* a room-intro seed. Elara's other lines (rooms A through D) are all keyed to *entering a room* — she introduces the space, offers context, moves on. The Beat F line is different. It is a **ceremonial acknowledgment** of a specific fact. The line is not about the Briefing Room; it is about Kael. Elara's delivery should therefore be slightly less "tour guide" and slightly more "witness." The voice profile's standard `stability 0.60 / style 0.30` is kept, but the **similarity_boost is pushed to 0.85** (from her usual 0.75) to lock in the reverent register so it does not drift into conversational.

### 11.6 VFX — Beat F effects

| VFX ID | Effect | Tech | Output | Notes |
|---|---|---|---|---|
| `vfx_lockbox_bio_recognize` | Bright cyan biometric lock pulses at sub-1 Hz in idle state, then **flashes once** (three-frame brighter pulse) when the player enters proximity, then fades to a calm steady glow as the lockbox door slides open | CSS keyframe alpha + opacity tween + PixiJS edge glow | `apps/client/public/art/vfx/prelude/lockbox-bio-recognize.webm` (idle loop + one-shot recognize variant) | Triggers once in Beat F. Reused as the idle pulse pattern on the **sealed strongbox in Beat E** (§10.3 — the Mess Hall strongbox is dormant in Beat E with this pulse disabled, and the Beat F lockbox is the active recognize variant of the same visual system). Engineering should treat this as a shared lock-state component with a `dormant | pulsing | recognize | open` state enum |
| `vfx_data_slate_glow` | Cyan-pulsing data-slate surface with dense grid of glyph-positions (no legible content), pulse slows from ~1 Hz to ~0.25 Hz after the 213-count line | PixiJS shader with animated glyph-grid mask | `apps/client/public/art/vfx/prelude/data-slate-glow.webm` (pulsing loop + slowdown variant) | Briefing Room only. The slowdown is the visual signifier that the slate is "read" — Elara has counted the entries and the data is now static. Do not render any of the glyph shapes as legible text |
| `vfx_memo_holo_rise` | Pale cyan holographic sheet rises from the right-wall lockbox and projects onto the far-wall holo display, which wakes from dark to bright cyan, then renders three handwritten-calligraphic text bullets one at a time | CSS keyframe + PixiJS sprite rise + text-render pass | `apps/client/public/art/vfx/prelude/memo-holo-rise.webm` | **The three bullets must be rendered as actual legible text** in the end frame — this is the Prelude's single exception to the "no rendered text" rule. Use the same calligraphic handwriting style as the Prince's diploma from Beat E (§10.3). Text color: cyan #22d3ee on dark composite background. Fire the bullets at 24s, 26s, 28s of the cutscene, each with a subtle soft-in (200ms) |

**Engineering note on the shared lock-state component:** both Beat E (dormant strongbox) and Beat F (active lockbox) use the same underlying `BiometricLock` component with four state values: `dormant` (dim, no pulse), `pulsing` (bright cyan, sub-1 Hz pulse), `recognize` (three-frame brighter flash), `open` (calm steady glow). The state transitions are:

- Beat E's Mess Hall strongbox is `dormant` throughout Beat E
- Beat F's Briefing Room lockbox is `pulsing` on player entry (Act 1), transitions to `recognize` at 8s (Act 2 start), and to `open` at 9s (data-slate revealed)
- Beat E's Mess Hall strongbox transitions to `pulsing` *offscreen* after Beat F completes, so if the player re-enters the Mess Hall post-Beat-F, the strongbox now shows the active pulse visual (this is **optional polish** — if the player never re-enters the Mess Hall, they never see it, but the hook is there)
- The `open` state for the Mess Hall strongbox is never entered in the Prelude — that strongbox stays physically sealed even after Beat F, because its role was to seed Beat F and the actual data lives in the Briefing Room lockbox. Engineering should NOT wire the Mess Hall strongbox to an openable animation — it is scenery, not an interactable

This component will be reused for the Two Witnesses scene's Archives access in Beat J — flagged for reuse, not duplicated.

**Reduced-motion accessibility fallback:** when `prefers-reduced-motion` is active, all three Beat F VFX layers (`lockbox-bio-recognize`, `data-slate-glow`, `memo-holo-rise`) drop their animations and render as static frames at their end-state. The lockbox appears in its `open` state from the start. The data-slate is static cyan (no pulse). The three memo bullets appear all at once rather than fading in sequentially. The `elara_beat_f_213_entries` VO still plays in full. The three-bullet memo text is still rendered legibly. The silent beat at 14–20s is preserved (reduced-motion does not cut silence — silence is accessible by default).

---

## Section 12 — Beat F.5: Empty Chair (Breath Beat)

### 12.1 Narrative purpose

The fourth breath beat. The player does not leave the Briefing Room — Beat F.5 is a **same-room continuation** of Beat F, held for ninety seconds of near-silence in front of the askew eighth chair that the previous beat surfaced. No lockboxes open. No memo renders. No new rooms. The player stands in a room they just finished reading the Engineer's contingency plan in, and the camera slowly closes on the one chair that does not fit the circle.

**Ninety seconds is a long time in a video game.** Most players will feel the duration. Some will move away from the chair immediately, skip the beat via the continue-prompt, or check their notifications on the second screen. The breath beat is designed to **allow all of those responses**. The player who waits is rewarded with the Human's most fragile line of the Prelude. The player who skips is not punished — they get the line at reduced volume as ambient background audio on their way to Beat G. Either way, the line plays. The breath beat is not a gate; it is an *offering*.

**The line is addressed directly to the empty chair.** The Human is not speaking to the player. The Human is speaking to Kael. Kael sat in that chair. Kael rose from that chair to leave for the Razorline. Kael never came back. The Human has been holding the words for seventeen thousand years and he says them now because the player is standing in front of the chair and the Human is — canonically — not entirely sure whether anyone will ever be standing there again.

**The Bond-80 hidden flag:** if the player is still in the Briefing Room at the 90-second mark (i.e., they did NOT skip the breath beat via the continue-prompt and did NOT move out of the room), the flag `beat_f5_full_witness` is set to `true`. This flag feeds into the **Human Bond meter** — a hidden relationship system that tracks how attentive the player has been to the Human's quiet moments across the Prelude (galley sandwich line, window breath beat, empty chair). At Bond-80 the Human unlocks Act-scope dialog that the Bond-below-80 player does not see: specifically, a private Act 2 line in which the Human names the Engineer for the first time. The full bond-meter spec is Act-scope and not documented in this Prelude bible, but this flag is one of three inputs. (The other two are `beat_c5_window_first_line` set in §7 and `beat_d5_galley_sandwich_heard` set in §9.)

**Canon hygiene rule — the Human does NOT name the Engineer in this line.** The withholding of the name is the same withholding as the Galley sandwich line (§9.5) — the Human cannot yet say the Prince's name aloud. The name lands in Act 2 after Bond-80 unlocks. In Beat F.5 the Human addresses Kael directly but only uses *Kael's* name. The Engineer is referred to as "him" throughout.

### 12.2 Cross-references

- Human voice profile: `VOICE_OVER_BIBLE.md` Section 2 (existing)
- Empty chair visual seed: §11.3 Beat F art still (the askew eighth chair)
- Human's withholding-the-name pattern: §9.5 `human_beat_d5_sandwich` (Galley line — same withholding)
- Bond-80 hidden flag system: Act 2 scope, partially documented here for Prelude inputs only
- Kael canonical disappearance from the Razorline staging house: `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.4 Audio Log 3

### 12.3 Art — Briefing Room environment still

**No new art still.** Beat F.5 reuses the `room-briefing-room.png` from §11.3. The camera composition is different (closer on the askew chair, wider aspect, different lighting via VFX — see §12.6) but the underlying room asset does not change.

### 12.4 Cutscene — F.5: Empty Chair

- **Beat ID:** `prelude-beat-f5-empty-chair`
- **Output:** `apps/client/public/videos/prelude/prelude-beat-f5-empty-chair.mp4`
- **Duration:** 90s
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `breath_beat_f5_complete`, `empty_chair_acknowledged`, conditionally `beat_f5_full_witness` (set to `true` if player remained in the Briefing Room for the full 90 seconds)
- **Reduced-motion fallback:** static `room-briefing-room.png` cropped on the askew chair + `human_beat_f5_empty_chair` audio at full volume + KineticText banner reading "A memory of someone who used to sit here"

**Structural note:** this is the **longest single-held beat in the Prelude**. Ninety seconds of a camera held on one chair with a single fragile VO line at the 74-second mark. The pacing is deliberately uncomfortable. Most video games do not give the player 16 uninterrupted seconds of nothing; this one gives them 90. The design rule: **the player can skip the beat but cannot miss the line.** The line plays whether they stay or go, at different volumes.

- **Act 1 (0–20s) — the hold.** Camera holds on a medium-close shot of the askew eighth chair, centered in the frame. The rest of the Briefing Room is slightly out of focus in the background — the other seven chairs visible as a disciplined blur, the briefing table half-visible in the lower third. The chair's upholstery is lit only by a single faint cyan floor strip and the dim glow from the far-wall display (now powered off — the Kael Memo has faded from view). Dust motes drift. No movement. No audio except the ship's ambient hum.
- **Act 2 (20–45s) — the slow zoom.** Camera begins a very slow continuous zoom-in toward the chair. The zoom is so gradual it is almost imperceptible — less than one degree per second of field-of-view change. Dust motes continue to drift. No audio change. The slowness is the point.
- **Act 3 (45–73s) — the hot edge.** At approximately 45s, a subtle warm-amber `#fbbf24` **rim-light** begins to build along the chair's upper edge — specifically the seat-back edge and the left armrest edge, as if a directional warm light is reaching the chair from an off-screen source that was not there a moment ago. The rim-light builds very gradually over 28 seconds, reaching maximum intensity at 73s. The rim-light is the **visual signature of a memory approaching**: it is not the same sepia-drain flashback mechanic from Beat E. This is something smaller, quieter, private to the chair. The player should notice the light without being able to name what changed. No audio change during the build-up. No camera movement (the slow zoom has ended).
- **Act 4 (73–90s) — the line.** At 73s the Human begins speaking: `human_beat_f5_empty_chair` (§12.5). The line is addressed to the chair, not the player. The camera remains held. The rim-light remains at max intensity, catching the upper edge of the chair in a warm glow while the rest of the room stays in cold cyan. At 87s the line ends. The rim-light begins a slow fade (3 seconds) back to nothing. At 90s the cutscene ends — the chair is cold again, the Briefing Room is cold again, and the player is still standing in front of the one chair that does not fit the circle.

**START FRAME (Nano Banana 2):**
> Medium-close shot of the askew eighth chair in the crew Briefing Room aboard Ark 1047. The chair is pushed back ~40cm from the central command table and angled slightly away. Dark brass leather upholstery, heavy construction, small cyan status indicator at the neck (dark). The other seven chairs are visible in soft focus in the background, tight to the table. The central table occupies the lower third of the frame, its surface dark and inert. The far-wall holographic display is visible in the deep background, powered off. No rim-light yet — the chair is lit only by cyan floor strips and faint cyan table glow. Dust motes in the air. Volumetric fog ankle height. Full color, no flashback treatment. 16:9, 4K, no text.

**MID FRAME (Nano Banana 2, used for the rim-light buildup in Act 3):**
> Same composition as the start frame, approximately 60 seconds later. Camera has zoomed in very slightly (the chair now occupies slightly more of the frame — ~10% larger than the start frame). A subtle warm-amber `#fbbf24` rim-light is visible along the chair's seat-back upper edge and left armrest, approximately 40% intensity (building toward 100% at the 73s mark). The rim-light is directional, suggesting a soft light source off-screen to the left. The rest of the room remains cold cyan — the rim-light is *localized to the chair only*. Dust motes still drifting. The warm-amber hue should feel like a *memory* of warmth, not actual warmth — almost like a photograph of the light rather than the light itself. No audio visible in the frame (this is a still). 16:9, 4K, no text.

**END FRAME (Nano Banana 2):**
> Same shot as the mid frame, 30 seconds later. The rim-light has reached full intensity then begun fading back — the end frame shows the rim-light at ~20% intensity, clearly dimmer than the mid frame's 40%. The chair is almost cold again. The room is cold again. The composition is held. The mood is **the light has left, the words have been said, the chair is still the chair**. 16:9, 4K, no text.

**SEEDANCE 2.0 motion prompt:**
> Minimal motion across 90 seconds. **Act 1 (0–20s):** held medium-close shot of the askew eighth chair, no camera movement. Dust motes drift in dim cyan light. No audio change. **Act 2 (20–45s):** very slow continuous zoom-in toward the chair — less than 1 degree of FOV change per second, almost imperceptible. Dust motes continue. **Act 3 (45–73s):** zoom halts. Subtle warm-amber `#fbbf24` rim-light begins building along the chair's upper edge and left armrest, over 28 seconds, reaching maximum intensity at 73s. Directional rim-light only — the rest of the room stays cold cyan. No audio change during buildup. **Act 4 (73–87s):** at 73s the `human_beat_f5_empty_chair` VO line begins playing (see §12.5). Camera held, rim-light held at max intensity. At 87s the line ends. **Act 5 (87–90s):** rim-light fades back to zero over 3 seconds. Chair is cold again. Cutscene ends. 24fps. Still, patient, grief-adjacent. This is the slowest beat in the Prelude. Embrace it.

### 12.5 VO — Beat F.5 new line

**One new Human line** fires at 73s of the 90-second cutscene. The line is approximately 14 seconds long and is addressed **directly to the empty chair** — not to the player, not to Elara, not to himself. The Human is speaking to Kael, who is not there.

| Line ID | Character | Voice profile | Beat | Text | Direction | Priority |
|---|---|---|---|---|---|---|
| `human_beat_f5_empty_chair` | The Human | `the_human` | F.5 (fires at 73s of cutscene, at peak rim-light intensity) | `"Kael. I would not have sat in this chair while you were alive because it was yours and you hated when people sat in your chair. I am not going to sit in it now either. I am going to stand here and pretend you are going to come back and tell me to get out of the way of the door. I am going to keep pretending that as long as I am able to. I owe him that much. I owe you that much. I'm sorry I could not save him. I tried. We both tried."` | This is the most fragile Human line in the entire Prelude and it should be delivered with the most control. The Human does NOT crack in this line — he speaks it straight, the way a careful man says the hardest things he has ever said. The fragility is in the **withholding**, not in the tremor. Every sentence should land cleanly. "Kael" at the top is the only moment allowed a slight downward catch in the voice. The rest is flat and true. The line ends on "We both tried" — the word "tried" should be *quiet* but unbroken. Do not soften "tried" into a whisper; hold the weight. This line is also the only place in the Prelude the Human uses the word "him" to refer to the Prince (*"I'm sorry I could not save him"*). The name is still withheld — Bond-80 later in Act 2 unlocks it. **Canon hygiene: the actor must not improvise adding the Engineer's name to this line.** The withholding is the entire point. | P0 |

**ElevenLabs CSV row:**
```csv
human_beat_f5_empty_chair,The Human,the_human,0.55,0.85,0.35,true,"Kael.<break time=""800ms""/>I would not have sat in this chair while you were alive because it was yours and you hated when people sat in your chair.<break time=""600ms""/>I am not going to sit in it now either.<break time=""700ms""/>I am going to stand here and pretend you are going to come back and tell me to get out of the way of the door.<break time=""600ms""/>I am going to keep pretending that as long as I am able to.<break time=""700ms""/>I owe him that much.<break time=""500ms""/>I owe you that much.<break time=""900ms""/>I'm sorry I could not save him.<break time=""500ms""/>I tried.<break time=""400ms""/>We both tried.","The most fragile Human line of the Prelude. Do NOT crack. Straight, careful, controlled. Fragility is in the withholding, not the tremor. 'Kael' at the top gets a slight downward catch; the rest is flat and true. 'We both tried' ends the line: quiet but unbroken, do not soften 'tried' into a whisper, hold the weight. The Human says 'him' twice in reference to the Prince — the name is STILL withheld. Actor must NOT improvise adding the name. Withholding is the point.",P0
```

**Output:** `apps/client/public/audio/human/human_beat_f5_empty_chair.mp3`

**Delivery context:** if the player remains in the room for the full 90 seconds, the line plays at full volume as the designated VO track. If the player skips the beat via continue-prompt or walks out of the Briefing Room before 73s, the line **still plays** — at -6dB ambient volume, layered under the next room's ambient bed, so the player hears it as if it were drifting from behind them through the door. This is handled at the audio-mix layer, not the VO layer; the same `.mp3` asset is used in both cases.

### 12.6 VFX — Beat F.5 effects

| VFX ID | Effect | Tech | Output | Notes |
|---|---|---|---|---|
| `vfx_chair_rim_hot_edge` | Warm-amber `#fbbf24` directional rim-light building along the askew eighth chair's upper edge and left armrest over 28 seconds, holding at peak for 14 seconds during the VO line, then fading back to zero over 3 seconds | CSS keyframe alpha tween + PixiJS directional light mask localized to the chair's silhouette | `apps/client/public/art/vfx/prelude/chair-rim-hot-edge.webm` (build-up + hold + fade-out variants) | Briefing Room only. Beat F.5 only. The light is localized to the chair — it does NOT spill into the rest of the room. The warm amber is the same hue as the Mess Hall's amber service light (§10.3), creating a visual rhyme: the Prince's warmth in the Mess Hall, a memory of warmth in the Briefing Room. The rim-light is **not** the sepia-drain flashback mechanic — it is something smaller and more private. The player should read it as "something warm is almost here" rather than "a memory is replaying." |

**Engineering note on the rim-light:** this effect uses the same `BiometricLock` state machine's `pulsing` hue (warm amber vs. cold cyan) but repurposed as a localized directional light instead of a lock indicator. Engineering can either share the underlying component or write a new one — recommended: new component `ChairRimLight` in `apps/client/src/components/prelude/` since the semantics are distinct and conflating the two components would confuse future writers.

**Reduced-motion accessibility fallback:** when `prefers-reduced-motion` is active, the `vfx_chair_rim_hot_edge` effect renders as a **single static frame** at peak rim-light intensity, held for the full 90 seconds (no build-up, no fade). The zoom-in is also disabled — the camera stays at its start-frame composition. The `human_beat_f5_empty_chair` VO still fires at 73s. The `beat_f5_full_witness` flag still sets if the player remains in the room for 90 seconds (reduced-motion players are given full credit for their patience — the skip detection logic is unchanged). The KineticText banner reads "A memory of someone who used to sit here" for the full 90 seconds.

---

## Section 13 — Beat G: Medical Bay

### 13.1 Narrative purpose

The player crosses from the Briefing Room into the **Medical Bay** — a clinical space along the Ark's mid-hull, containing four med-pods, a central surgical console, a recessed **neural-rig workstation** along one wall, and (in a locked alcove the player cannot enter in the Prelude) the ship's **transfer-array**. The Medical Bay is where the crew's bodies were once repaired, and where — canonically — the Prince began the Resurrection Protocols prototype work that he later refined on the Vortex (per `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.6 Movement 5).

**This beat has no new VO.** The Master Index row for Beat G says "0 new VO lines" and — unlike the Beat F row which turned out to be stale — **this zero is correct**. The Medical Bay is a wordless beat. The player reads the room through environmental storytelling: the four med-pods (three dark, one faintly active), the surgical console scorch-marks on the far wall (suggesting something went wrong here once), the neural-rig workstation with its headset still plugged into the primary port, and — most importantly — the **locked transfer-array alcove** whose sealed hatch glows with a steady amber standby light. The amber light is the second warm-colored light in the entire Prelude (after the Mess Hall service light from §10). Its placement here is deliberate: the transfer-array is the *same system* the Prince used to put the Engineer into Vex Solène's swarm in Log 5. The player does not know that yet. The amber is a seed.

**What the player DOES learn here:**
1. The Ark has a transfer-array. It is functional. It is locked. It is not for them to use in the Prelude.
2. The Medical Bay was the last room used before the crew stopped. The central surgical console has a single sterile tray beside it with three empty syringes arranged in a row — someone was preparing something here and did not finish.
3. The neural-rig workstation is powered and idle. A headset hangs from its primary port, suggesting the last user wore it and walked away. This is a direct visual rhyme with the Mess Hall plate (§10.3) and the Galley mug (§9.3) — a series of *abandoned tasks* the player is encountering in sequence, each one smaller and more personal than the last.

**What the player does NOT learn here:**
- That the transfer-array is the same system used in Log 5
- That the neural-rig workstation was the Prince's personal test rig
- That the Resurrection Protocols were developed in this very room
- That the scorch marks on the surgical console are from an early Protocols test that went wrong

All four of the above are **Act 3+ reveals** and must not be teased in any Prelude VO or cutscene text. The Medical Bay is environmental storytelling only — the player walks through, notices what they notice, and moves on to Beat H without being told what any of it means.

**This beat also serves as structural pacing.** Beat F.5 was 90 seconds of near-silence. Beat G needs to be **short, wordless, clinical** — a palate cleanser that lets the player move without emotional weight being added. The cutscene is 25 seconds. There is no VO. The soundtrack is the neural-rig's idle hum and the transfer-array's steady amber standby tone. The player's job in Beat G is to *walk through, notice, exit*.

### 13.2 Cross-references

- Transfer-array canonical use in Log 5: `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.6 Movement 5 (the Prince's transference into the swarm)
- Resurrection Protocols development: `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §1.3 item 3 + §5.6 Movement 1
- Neural-rig workstation as Prince's personal rig (Act 3+ reveal, DO NOT surface): flagged canon hygiene item, no doc reference
- Scorched surgical console as early-Protocols-test-that-went-wrong (Act 3+ reveal, DO NOT surface): flagged canon hygiene item
- Abandoned-task visual rhyme: §10.3 Mess Hall plate, §9.3 Galley mug — Medical Bay neural-rig headset is the third in the series

### 13.3 Art — Medical Bay environment still

- **Output:** `apps/client/public/art/rooms/room-medical-bay.png` + `.webp`
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Style anchor:** §0 global + Prelude modifiers. **Critical compositional requirement:** all four med-pods (three dark, one faintly active), the central surgical console with its sterile tray + three empty syringes, the neural-rig workstation along one wall with its hung headset, and the locked transfer-array alcove on the opposite wall (with its steady amber standby light) must all be in frame. The room should feel **clinical and abandoned** — a different emptiness than the Mess Hall's domestic warmth or the Briefing Room's formal coldness.

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the crew Medical Bay aboard Ark 1047 — a clinical space approximately ten meters wide and seven meters deep with a slightly-arched four-meter ceiling. **The back wall** holds **four medical pods** arranged in a disciplined row — dark brass-and-white composite cylinders, each two meters long, canted at a slight incline for patient access, with transparent armored glass front panels. Three of the four med-pods are dark and cold (their glass panels opaque with 17,000 years of interior dust). **The fourth med-pod, second from the left, is faintly active** — its glass panel emitting a dim cyan #22d3ee internal glow, pulsing slowly at sub-0.5 Hz, as if something inside it is still running on the last watts of a dying standby cell. The cyan glow is so faint it reads almost as an afterimage. **Dead center of the room, a surgical console** — a rectangular workstation with a flat composite work surface, an articulated overhead boom arm currently swung aside, a sterile silver tray to one side of the console holding **exactly three empty glass syringes arranged in a disciplined parallel row** (render the syringes clearly — their emptiness is the point). The console's surface shows a **faint scorch arc** along its left edge — a curved discoloration suggesting heat damage from a single event that occurred long ago, left uncleaned. **Right wall** holds a recessed **neural-rig workstation** — a small alcove with a contoured chair, a flat desk surface, and a silver-and-brass neural headset hanging from a cable plugged into the workstation's primary port. The headset dangles motionless, caught partway between the port and the chair's headrest as if the last user lifted it off and set it down without quite returning it to its cradle. A small cyan status pip on the workstation is lit steady — the rig is powered, idle, waiting. **Left wall** holds a sealed alcove — a recessed hatch with a heavy armored door labeled (render no legible text but suggest engraved markings) "TRANSFER ARRAY — AUTHORIZED PERSONNEL ONLY." The door is locked. Above the door, **a single amber-yellow #fbbf24 standby indicator** is lit steady — not pulsing, not flashing, just *on*. The amber light is one of only three warm-colored lights in the entire Prelude (the Mess Hall service light and the Beat F.5 chair rim-light are the other two). Its placement marks the transfer-array as thematically significant without explaining why. **Lighting**: no overhead lights in the main room. Illumination comes from cyan emergency floor strips, the cyan edge-strips on the four med-pods (including the faintly-active fourth pod's inner glow), the dim cyan pip on the neural-rig workstation, and the amber standby light above the transfer-array door. The amber is the only warm color in frame. Volumetric fog at ankle height, slightly denser here than in adjacent rooms (medical atmosphere is canonically thicker). Anamorphic lens flare on the amber transfer-array standby light and a softer flare on the faintly-active fourth med-pod. Film grain. Deep space black #010020 base. **No rendered text** on the transfer-array door label, the console's control surfaces, the med-pod status panels, or the neural-rig workstation. **No people. No holograms.** Cinematic 4K composition, three-quarter wide shot from the entrance doorway, standing eye level, framing the four med-pods on the back wall (middle ground), the central surgical console (lower middle with the sterile tray visible), the neural-rig workstation on the right wall (side focal point), and the locked transfer-array alcove on the left wall (the amber standby light drawing the eye to the one warm point in the frame). The mood: **a room where a specific person worked on a specific problem for a long time, left mid-task, and never came back.**

### 13.4 Cutscene — G: Medical Bay

- **Beat ID:** `prelude-beat-g-medical-bay`
- **Output:** `apps/client/public/videos/prelude/prelude-beat-g-medical-bay.mp4`
- **Duration:** 25s
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `cutscene_medical_bay_intro_complete`, `transfer_array_seen_locked`, `neural_rig_seen_idle`, `med_pod_four_seen_active`
- **Reduced-motion fallback:** static `room-medical-bay.png` + a KineticText banner reading "Medical Bay — locked transfer-array, idle neural rig, four med-pods" and no narration (this beat has no VO)

**Structural note:** Beat G is **wordless** — no VO fires during the cutscene. The entire 25 seconds is carried by visual storytelling and the ambient mix. The soundtrack is the neural-rig's idle hum layered under the transfer-array's steady amber standby tone. Both audio elements are new Prelude ambient beds that should be mixed to ~55% volume — loud enough to feel *present* but quiet enough that the player's attention stays on the visuals.

- **Act 1 (0–10s) — the walk through.** Camera pushes diagonally from the entrance doorway across the Medical Bay, passing the central surgical console on the right, the neural-rig workstation in the mid-background on the left, the four med-pods along the back wall. Camera glides slowly. Dust motes drift in the cyan floor-strip light. The faintly-active fourth med-pod's cyan pulse is visible but not dramatic. No camera shake. No audio events. Just the ambient bed.
- **Act 2 (10–17s) — the three syringes.** Camera slows as it passes the central surgical console and **holds briefly** on the sterile silver tray with the three empty glass syringes arranged in parallel. The scorch arc along the console's left edge is visible in soft focus. The player has 7 seconds to notice the emptiness of the syringes, the silver of the tray, and the scorch on the console — all three details visible in the same frame. No VO, no labels, no popup. Just the shot. A player paying attention will register *something happened here*; a player not paying attention will see a clean medical station and move on.
- **Act 3 (17–25s) — the amber standby.** Camera glides left to the transfer-array alcove. The amber standby light above the locked hatch is now the dominant visual focus — the only warm light in the frame, pulsing *not at all* (the steady-on is the point: it has been on for seventeen thousand years). The hatch itself is closed, heavy, armored, labeled. The camera holds on the amber light for the final 5 seconds. In the soft background the neural-rig workstation's hung headset is still visible on the right edge of frame. Fade to black. Cutscene ends.

**START FRAME (Nano Banana 2):**
> Identical composition to the §13.3 Medical Bay still, framed from just inside the entrance doorway. The central surgical console is in the right-middle ground with the sterile tray of three syringes visible. The four med-pods are on the back wall (the faintly-active fourth pod's cyan glow softly visible). The neural-rig workstation is on the right wall with the hung headset. The locked transfer-array alcove is on the left wall, the amber standby light visible above the hatch. Full color. No camera movement yet — this is the still before the cutscene begins. 16:9, 4K, no text.

**MID FRAME (Nano Banana 2, used for the three syringes hold in Act 2):**
> Close shot of the central surgical console, dead-center composition. The sterile silver tray is in the lower-middle of the frame holding three empty glass syringes in a disciplined parallel row — the syringes are fully visible, clearly empty, clearly arranged with intent. Behind the tray, the faint scorch arc along the console's left edge is visible but soft. In the left and right peripheral frame, the edges of the Medical Bay are visible in soft focus (one med-pod edge on the left, the neural-rig workstation's chair on the right). Full color. Cinematic 4K. No text on the console.

**END FRAME (Nano Banana 2):**
> Close shot of the locked transfer-array alcove on the left wall. The heavy armored hatch fills most of the frame, its engraved label visible but unreadable (no rendered text). Above the hatch, the single amber-yellow #fbbf24 standby indicator is lit steady — the only warm color in the frame. The rest of the Medical Bay is visible in soft peripheral blur: the surgical console behind camera-right, the med-pods in deep background, the neural-rig workstation in the right edge. The amber light is the dominant focal point. The mood: **a locked door that has been waiting for the right person for seventeen thousand years, and the right person has not arrived yet.**

**SEEDANCE 2.0 motion prompt:**
> Slow continuous camera work across three acts inside a 25-second runtime. **Act 1 (0–10s):** diagonal dolly from the entrance doorway across the Medical Bay, passing the surgical console on the right and the neural-rig workstation on the left. Dust motes drift. Ambient neural-rig hum + transfer-array standby tone layered at ~55%. **Act 2 (10–17s):** camera slows and holds briefly on the sterile silver tray with the three empty syringes on the surgical console. Scorch arc visible in soft focus. 7 seconds of held shot. No VO. **Act 3 (17–25s):** camera glides left to the transfer-array alcove. At 20s the amber standby light becomes the dominant focal point. Camera holds on the amber light for the final 5 seconds. Fade to black at 25s. 24fps. Clinical, patient, environmental-storytelling tone.

### 13.5 VO — Beat G new lines

**None.** Beat G is intentionally wordless. The Master Index row for Beat G correctly shows "0 new VO lines" and this section reserves a row in the per-beat structure so future writers do not accidentally add one. The clinical silence is the beat's entire emotional delivery.

**If a writer feels tempted to add a VO line here** — either Elara narrating the Medical Bay or the Human commenting on the scorch marks or some later Act writer adding exposition — the instinct should be resisted. The Medical Bay's job in the Prelude is to be *seen and passed through*, not *explained*. Any explanation here spoils the Act 3+ reveals about the transfer-array, the neural rig, and the Resurrection Protocols origin. The hygiene rule is: **Beat G stays silent. Elara and the Human say nothing. The room speaks for itself.**

### 13.6 VFX — Beat G effects

| VFX ID | Effect | Tech | Output | Notes |
|---|---|---|---|---|
| `vfx_med_pod_faint_pulse` | Slow sub-0.5 Hz cyan #22d3ee pulse on the fourth med-pod's interior, reading almost as an afterimage — the pod is "still running on the last watts of a dying standby cell" | CSS keyframe alpha tween on a PixiJS masked sprite | `apps/client/public/art/vfx/prelude/med-pod-faint-pulse.webm` (loop) | Medical Bay only. Decorative but load-bearing for tone — the fourth pod's pulse is the only sign the Medical Bay is "not entirely dead," which creates the quiet tension of the beat |
| `vfx_neural_rig_idle_hum_visual` | Very subtle ambient shimmer on the neural-rig workstation's cyan status pip, suggesting the rig is powered and idle (the audio hum is the primary channel; the visual is a secondary reinforcement) | PixiJS shader micro-shimmer on the pip | `apps/client/public/art/vfx/prelude/neural-rig-idle-hum.webm` (loop) | Medical Bay only. Pair with the neural-rig hum audio bed at ~55% mix volume |
| `vfx_transfer_array_amber_standby` | Steady amber-yellow #fbbf24 standby light above the locked transfer-array hatch, non-pulsing, non-flashing, just *on* — the steady-state is the point | CSS solid color layer + soft bloom + anamorphic flare | `apps/client/public/art/vfx/prelude/transfer-array-amber-standby.webm` (loop) | Medical Bay primary Prelude use, but **flagged for reuse in Beat J** — the Two Witnesses Archives scene references the transfer-array canonically (via the Log 5 Movement 5 transcript) and the amber standby light may need to appear in Beat J's art as a background continuity element |

**Ambient audio beds for Beat G (new, §18 cross-reference placeholder):**

Beat G is the first Prelude beat whose emotional delivery is carried **entirely by ambient audio**. Two new audio beds are required:

1. **`ambient_neural_rig_hum`** — soft ~40 Hz low hum suggesting an idle neural interface rig on standby power. Loop seamlessly. Output: `apps/client/public/audio/ambient/prelude/neural-rig-hum.mp3`. Target loudness: -18 LUFS. Mix in the cutscene at 55% volume.
2. **`ambient_transfer_array_standby`** — a higher-pitched ~180 Hz steady tone suggesting a powered transfer-array in standby mode. Loop seamlessly. Output: `apps/client/public/audio/ambient/prelude/transfer-array-standby.mp3`. Target loudness: -20 LUFS. Mix in the cutscene at 55% volume, layered *above* the neural-rig hum.

Both ambient beds are **reused in later Prelude content**:
- `ambient_neural_rig_hum` plays as ambient background for any subsequent Medical Bay reentry, and also as a background layer in Beat J's Archives scene (the Witnesses are canonically standing near the transfer-array system per §8 of the canon expansion)
- `ambient_transfer_array_standby` plays as ambient background for any Medical Bay reentry and is the **dominant** ambient bed in Beat J's Archives scene

Engineering should treat these two beds as a linked pair — both loaded together when either the Medical Bay or Beat J Archives scene is entered. This avoids a situation where Beat J fires but the standby tone isn't in memory because the player skipped Beat G.

**Reduced-motion accessibility fallback:** when `prefers-reduced-motion` is active, all three Beat G VFX layers drop their animations. The `vfx_med_pod_faint_pulse` renders as a single static frame at ~50% brightness (the pulse midpoint). The `vfx_neural_rig_idle_hum_visual` renders as a static steady-lit pip. The `vfx_transfer_array_amber_standby` is already steady-state so it renders unchanged. The two ambient audio beds still play at full volume — silence of the room is the primary emotional delivery and is preserved in full. The cutscene's camera movement is also disabled: the cutscene plays as three static frames (start, mid, end) held for their allotted durations, with a 1-second fade between each. The KineticText banner from §13.4 is visible throughout.

---

## Section 14 — Beat H: Comms Array + NPC Inbox + Locke's First Message

### 14.1 Narrative purpose

The player crosses from the Medical Bay into the **Comms Array** — a cramped utilitarian room dedicated to the Ark's long-range communications hardware. One wall is dominated by a floor-to-ceiling **signal intake matrix** (a grid of twenty-four small antenna-relay panels, most dark, six lit cyan). A central console with a holographic interface. A wheeled archival cart in the corner stacked with old memo slates. And — the beat's load-bearing element — **a single fresh message** sitting in the central console's inbox, received some undetermined time ago and still waiting for a reader.

**This is the first beat in the Prelude where a living NPC reaches the player.** Everything up to this point has been archived recordings (the Prince holo-logs, the Engineer's memo), environmental storytelling (the plates, mugs, syringes, chair), or Elara/Human as already-aboard entities. Beat H is the first time someone **outside the Ark** has *sent a message in* and had it arrive during the player's current playthrough.

**The sender is Adjudicator Locke, New Babylon Diplomat** — canonically introduced at the Beat D mission board in §8 via the three-legacy-posting slates, but not yet heard from. Her voice profile is existing canon (`VOICE_OVER_BIBLE.md` Section 4). Her appearance and character were canonically established by the 2026-04-15 Canon Rev 7 session (the "young fierce woman with purple hair, cybernetic steampunk eye patch" from `VISUAL_PRODUCTION_BIBLE.md` §34–38). In the Prelude she is a **voice-only entity** — the player hears her but does not see her. Her portrait is already on main from the canon session; her in-game first visual appearance is Act 1+ scope.

**The message is short, functional, and operator-flavored.** Locke has received a signal from the Ark — specifically, the trade-empire seed posting Elara unlocked in Beat D has pinged New Babylon's long-range listening posts. Her message is an acknowledgment of that ping + an offer of a first mission + a subtle test of whether the player is the kind of person she wants to work with. The test is delivered as a single line buried in the otherwise-businesslike message, and the player does not know it's a test until Act 1 when the reply options are graded. The Beat H version only shows the message body + plays the VO; the player's reply options surface later.

**Structural role:** Beat H introduces the **NPC Inbox system** — a persistent, canonical UI element that will track every message the player receives from outside characters across the entire game. The Inbox will grow to hold messages from Elara, the Human (very rare — he is usually an ambient voice, not an Inbox sender), Locke (frequent — she is the player's primary Trade Empire point of contact), Vex Solène (starting Act 2 when her first Coda message arrives), and others. Beat H seeds the system with its very first message: **Locke's greeting**. All subsequent messages in the game arrive in the same UI pattern the player learns here. The onboarding weight of this beat is therefore higher than it might look — the UI pattern needs to be **legible, memorable, and not too busy**, because it will be returned to hundreds of times.

**Canon hygiene rule for Locke's voice delivery:** the character's existing canonical description is *predatory menace meets youthful ambition*. The Prelude is the player's **first audio contact** with her. The voice delivery must NOT be played as fully menacing yet — the predatory edge is reserved for Act 1+ missions where Locke's agenda has become clearer. In Beat H she is **professional, warm-on-the-surface, with a single sentence near the end that carries the *first hint* of the edge**. The sentence is canonically specified below (§14.5). The actor must not amplify the menace beyond that one sentence. A player who is attentive should walk away from Beat H thinking *"she seems friendly, but something was off in that last line"*; a player who is not attentive should walk away thinking *"great, my first mission contact, she's nice."* Both reads are valid onboarding paths.

### 14.2 Cross-references

- Locke voice profile: `VOICE_OVER_BIBLE.md` Section 4 (existing)
- Locke canonical portrait and character description: `docs/production/VISUAL_PRODUCTION_BIBLE.md` lines 34–38 (canonical "young fierce woman with purple hair, cybernetic steampunk eye patch," landed via the Canon Rev 7 session)
- Trade Empire seed that pinged Locke's listening posts: §8.5 `elara_beat_d_17000_year_mission` (Beat D Cargo Bay posting)
- Beat D Locke Mission Board reference: §8.1 narrative purpose
- NPC Inbox UI system: new to this doc, described in §14.4 cutscene
- Vex Solène's first Coda Inbox message (Act 2+): `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §2.3 (reserved — not Prelude scope)
- Elara's role in Beat H (she does NOT narrate — the message plays through the Comms Array console directly, with Elara standing silently beside it): new convention established here to avoid Elara-overdose fatigue

### 14.3 Art — Comms Array environment still

- **Output:** `apps/client/public/art/rooms/room-comms-array.png` + `.webp`
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Style anchor:** §0 global + Prelude modifiers. **Critical compositional requirement:** the signal intake matrix on the back wall (24 antenna-relay panels in a grid, most dark with 6 lit cyan), the central comms console with its holographic interface, the wheeled archival cart with stacked memo slates, and a fresh incoming-message indicator on the central console must all be in frame. The room should feel **cramped and utilitarian** compared to the clinical Medical Bay and the formal Briefing Room — no wasted space, every surface is a working surface

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Comms Array aboard Ark 1047 — a cramped utilitarian room approximately six meters wide and eight meters deep with a ceiling of three meters, ceiling crossed by exposed cyan-edged brass conduits and cable bundles. **The back wall** is dominated by the **signal intake matrix** — a large rectangular grid of twenty-four small antenna-relay panels arranged in a six-wide-by-four-tall pattern, each panel approximately forty centimeters square, each with a small cyan indicator at the top-center. The matrix occupies most of the wall, from knee height to just below the ceiling. **Eighteen of the twenty-four panels are dark** (their indicators dead, their surfaces dust-coated), and **six of the twenty-four are lit cyan #22d3ee** — two in the upper-left quadrant, three in the middle row, and one in the lower-right. The six lit panels suggest the Ark is still listening to six of its twenty-four original signal-intake channels. **Dead center of the room, a curved central console** — roughly two meters wide, a dark composite work surface with an articulated holographic interface projecting a soft cyan field approximately sixty centimeters above the console's surface. The holographic field is currently showing **a single fresh-message indicator** — a small cyan envelope-glyph at the center of the projected field, rendered with slight bloom (suggest "new incoming message" without rendering any legible text on the envelope itself). A small amber #fbbf24 "1" counter is visible above the envelope — the room's third warm light in the Prelude. Below the holographic field, the console's physical surface has a few tactile controls (dark composite buttons and a small dial, no legible labels) and a dim cyan pip on the lower-right. **Left wall** holds a small recessed shelf with a neat row of dark-bound paperbound archive binders — suggest ~twelve binders standing vertically on the shelf, worn but intact. **Right wall** holds a wheeled archival cart — a four-wheeled metal frame holding three shelves, each shelf stacked with old memo slates (rectangular composite tablets, approximately book-sized, most dark but two still faintly glowing cyan). The cart is parked slightly askew, blocking a narrow pathway to a service hatch on the right wall behind it. **Lighting**: no overhead lights. Illumination comes from cyan emergency floor strips, the six lit signal intake matrix panels (back wall), the central console's holographic field and its cyan pip, the amber "1" counter above the message envelope, and the two faintly-glowing memo slates on the archival cart. The amber counter is the only warm light. Volumetric fog at ankle height, slightly thinner than Medical Bay — the Comms Array has better air circulation due to the active cooling fans in the exposed ceiling conduits. Anamorphic lens flare on the amber counter glyph and on the brightest signal intake panel. Film grain. Deep space black #010020 base. **No rendered text anywhere** — the envelope glyph, the archive binder spines, the memo slate surfaces, and the console controls all remain label-free. **No people. No holograms** (Elara's hologram appears only in the cutscene, standing silently beside the console). Cinematic 4K composition, three-quarter wide shot from the entrance doorway, standing eye level, framing the central console (dominant middle), the signal intake matrix (commanding the back wall), the archival cart (right foreground), and the archive binder shelf (left middle). The mood: **a small room where a small amount of information has been trickling in for seventeen thousand years, and one of the pieces of information is new**.

### 14.4 Cutscene — H: Locke's First Message

- **Beat ID:** `prelude-beat-h-comms-array`
- **Output:** `apps/client/public/videos/prelude/prelude-beat-h-comms-array.mp4`
- **Duration:** 25s
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `cutscene_comms_array_intro_complete`, `npc_inbox_first_message_received`, `locke_first_contact`, `locke_subtle_edge_heard` (fires conditionally at 22s — see VO direction)
- **Reduced-motion fallback:** static `room-comms-array.png` + KineticText-rendered Locke message body as a full-text banner + `locke_beat_h_first_message` audio (full VO plays, no silencing)

**Structural note:** this cutscene has to do **two jobs in 25 seconds**. Job 1: introduce the NPC Inbox UI pattern in a legible and memorable way (the player will return to this UI hundreds of times over the course of the game). Job 2: play Locke's first message with enough space for the single "edge" sentence to land without over-signaling it. The tension between these two jobs is real — the UI onboarding wants to be visually explicit, while the character introduction wants to be casual and not draw attention to the subtext. The balance is struck by letting the UI do its work in the first third of the cutscene (establishing the mailbox-glyph → holographic-message-field → reader-view visual pattern) and then letting the message body play out in the remaining two-thirds with minimal UI decoration.

- **Act 1 (0–5s) — the arrival.** Camera pushes from the entrance doorway into the Comms Array. Elara's hologram is already standing beside the central console on the left side of frame, silent, her back partially turned to the camera — she is *waiting* for the player, not guiding them. She does not speak in this beat (see §14.2 hygiene note about Elara-overdose). The amber "1" counter above the console's holographic field is the visual focal point — the only warm light in the frame draws the eye.
- **Act 2 (5–9s) — the NPC Inbox UI reveal.** Camera glides to a three-quarter front view of the console. The holographic field expands from its idle size (~60cm above the console) to a larger reader-sized projection (~90cm tall, 120cm wide) over 2 seconds. The envelope glyph at the field's center unfolds into a **full message reader UI pattern**: a header strip at the top showing sender name **"LOCKE"** and a timestamp (render the sender name as legible text, render the timestamp as unreadable glyphs — the sender identity matters, the exact time doesn't), a thin cyan separator line, and the main message body area below (currently blank — text has not yet been rendered). This is the **canonical NPC Inbox layout** — all future messages in the game use this same three-region pattern (sender header, separator, body). The onboarding weight is on the pattern, not the decoration.
- **Act 3 (9–24s) — the message plays.** At 9s the message body renders as a single flowing block of legible text — this is the **second exception** to the Prelude's "no rendered text" rule (Beat F's Kael Memo was the first). The text appears all at once, not word-by-word — the Inbox system is **not** teletyping, it is showing the player a document. As the text finishes rendering, the `locke_beat_h_first_message` VO begins playing (Locke's voice speaking the text aloud). The camera holds on the message reader, giving the player roughly 15 seconds of display time to both **read the body** and **hear it spoken**. The two delivery channels reinforce each other — a player who reads fast has finished before the VO; a player who listens without reading follows Locke's voice; a player who does both reads ahead and then hears the voice catch up to their eye, which is exactly the rhythm a real letter is read at when someone you care about is not in the room.
- **Act 4 (24–25s) — the edge.** The final clause of Locke's message is the single "edge" sentence (§14.5). It fires at ~22s in the VO track and holds on screen until 24s. Camera slightly tightens on the message text during these 2 seconds — a very subtle zoom, less than 3% of frame scale, almost imperceptible. The `locke_subtle_edge_heard` flag fires at 22s regardless of whether the player was actively looking at the screen. At 25s the cutscene fades to black.

**START FRAME (Nano Banana 2):**
> Identical composition to the §14.3 Comms Array still, framed from just inside the entrance doorway. The central console dominates the middle-ground with its idle holographic field showing the cyan envelope glyph and the amber "1" counter floating above. Elara's translucent cyan hologram stands beside the console on the left side of frame, facing the console with her back three-quarters turned to the camera — she is waiting, not guiding. The signal intake matrix fills the back wall. The archival cart is in the right foreground. Full color, no text rendered. 16:9, 4K.

**MID FRAME (Nano Banana 2, used for the NPC Inbox UI reveal in Act 2/3):**
> Three-quarter front view of the central console, with the holographic field now expanded to reader size (~90cm tall, ~120cm wide). The field displays a **rendered NPC Inbox message reader interface**: at the top, a header strip with the legible sender name "LOCKE" in clean cyan sans-serif text, beside an unreadable glyph-timestamp. Below the header, a thin cyan separator line. Below the separator, the message body area is **now rendering a block of legible text** — the full Locke message body as specified in §14.5 below, in a clean cyan-on-dark-composite sans-serif, approximately 8–10 lines of text at readable size. Render the message text fully legibly. Elara's hologram is still visible on the left, unchanged. The amber "1" counter is still visible above the header strip. 16:9, 4K.

**END FRAME (Nano Banana 2):**
> Close-up three-quarter view of the message reader UI, the full Locke message body now fully rendered and held. The header strip shows "LOCKE" + glyph-timestamp, the separator line, and the full message body below. The final clause of the message is **highlighted subtly** — the last sentence has a slightly brighter cyan glow than the rest of the text, suggesting it has just been read/spoken. Elara's hologram is visible on the far left edge of frame, silent. The camera has tightened very slightly on the reader — less than 3% scale change from the mid frame. 16:9, 4K, message text rendered fully legibly.

**SEEDANCE 2.0 motion prompt:**
> Slow continuous camera work across four acts inside a 25-second runtime. **Act 1 (0–5s):** forward dolly from entrance doorway into the Comms Array, standing eye level. Elara's hologram is already standing beside the central console on the left, silent. The amber "1" counter above the holographic field is the visual focal point. **Act 2 (5–9s):** camera glides to three-quarter front view of the console. Holographic field expands from idle size (60cm) to reader size (90cm × 120cm) over 2 seconds. The envelope glyph unfolds into a full message reader UI pattern with the sender name "LOCKE" rendering legibly in the header strip. **Act 3 (9–24s):** at 9s the message body text renders all at once as a legible block. At 10s the `locke_beat_h_first_message` VO begins playing. Camera holds on the message reader for 14 seconds, giving the player time to both read the body and hear it spoken. **Act 4 (24–25s):** at 22s (during the VO's final clause) the camera tightens less than 3% scale on the message text, and the last sentence's cyan glow brightens subtly. At 24s the line ends. At 25s fade to black. 24fps. Businesslike, warm-on-the-surface, with one beat of subtle edge at the end.

### 14.5 VO — Beat H new line (Locke's first message)

**One new Locke line** is the entire delivered content of the message. The message text is rendered legibly on the Comms Array holographic reader (second and final exception to the Prelude's no-rendered-text rule, following the Beat F Kael Memo). Locke's VO plays the message aloud, voiced by the existing `locke` profile from `VOICE_OVER_BIBLE.md` Section 4 but tuned for this beat's specific *warm-on-the-surface-with-one-edge-sentence* delivery.

| Line ID | Character | Voice profile | Beat | Text | Direction | Priority |
|---|---|---|---|---|---|---|
| `locke_beat_h_first_message` | Adjudicator Locke | `locke` | H (fires at 10s of cutscene, as the message body renders and the player begins reading) | `"Ark 1047 — this is Adjudicator Locke of New Babylon. Your Trade Empire listing on Channel 6 has pinged our long-range posts twice in the last standard week, which means one of two things: your hardware is warming up, or someone is reading the old board. I am going to assume the more interesting possibility. I have three jobs that need a hand and I would like to offer you the first one on a standard intake contract — no obligation, no faction pledge, just a handshake. The job is salvage retrieval from a wreck near the old Kelvara lane, I will send coordinates if you send an accept. One more thing — and this is the only thing I will say twice in any message to you — I prefer to work with people who read everything I send them, not just the bolded parts. I am watching to see which kind of person you are. End transmission."` | Warm and businesslike for the first 80% of the line, then a single subtle edge on the "I am watching to see which kind of person you are" sentence. The warm register is the standard Locke delivery from her existing VOICE_OVER_BIBLE profile, played in its *diplomatic* variant rather than her *mercantile* or *predatory* variants. The edge on the watching-sentence is a **1-click tonal shift** — not a sudden change, just a slight drop in pitch and a micro-beat longer on "watching" and "kind of person." The actor must NOT amplify into menace. This is a warning delivered as an observation. A player who reads it as friendly should be allowed to read it as friendly; a player who hears the edge should feel the room temperature drop by exactly one degree, no more. End transmission line is said *flat* — no intonation change, just the sign-off. **Canon hygiene:** do NOT play this line at the full predatory register Locke uses in Act 3+ Trade Empire Conquest missions. The Prelude is her introduction; she is still in "warm first contact" mode. | P0 |

**ElevenLabs CSV row:**
```csv
locke_beat_h_first_message,Adjudicator Locke,locke,0.50,0.80,0.35,true,"Ark 1047 — this is Adjudicator Locke of New Babylon.<break time=""500ms""/>Your Trade Empire listing on Channel 6 has pinged our long-range posts twice in the last standard week, which means one of two things: your hardware is warming up, or someone is reading the old board.<break time=""600ms""/>I am going to assume the more interesting possibility.<break time=""500ms""/>I have three jobs that need a hand and I would like to offer you the first one on a standard intake contract — no obligation, no faction pledge, just a handshake.<break time=""500ms""/>The job is salvage retrieval from a wreck near the old Kelvara lane, I will send coordinates if you send an accept.<break time=""700ms""/>One more thing — and this is the only thing I will say twice in any message to you — I prefer to work with people who read everything I send them, not just the bolded parts.<break time=""600ms""/>I am watching to see which kind of person you are.<break time=""500ms""/>End transmission.","Warm businesslike for 80%. Single subtle edge on 'I am watching to see which kind of person you are' — 1-click pitch drop + micro-beat longer on 'watching' and 'kind of person.' Do NOT amplify into menace. Warning delivered as observation. Room temperature drops one degree, no more. End transmission line is flat sign-off. CANON HYGIENE: NOT the predatory register from Act 3+ Conquest missions. Diplomatic variant of Locke's existing voice profile. This is her warm first contact.",P0
```

**Output:** `apps/client/public/audio/locke/locke_beat_h_first_message.mp3`

**Rendered message-text styling note (for UI engineering):** the message body appearing on the Inbox reader during the cutscene uses the exact phrasing above as its legible text. The final sentence *"I am watching to see which kind of person you are."* must be rendered in the **same font and weight** as the rest of the message — NOT bolded, NOT italicized, NOT color-shifted. The visual subtlety comes from the Act 4 camera zoom and glow brightening described in §14.4, not from typography. The self-referential joke of Locke saying she prefers people who "read everything, not just the bolded parts" is canonically stronger if the player has to look at plain-format text and recognize *there is no bolding — the whole thing is the same weight*. That is the joke. Landing the typography wrong kills the joke.

**The three-jobs-reference** in the message is a forward-reference to the **three 17,000-year-old Trade Empire postings** on the Beat D cargo bay mission board (§8.1) — Locke's "three jobs that need a hand" are canonically the same three postings the player saw Elara point to in Beat D. The message doesn't spell out the connection, but Act 1 will confirm it. This is a planted echo, not a declared one.

### 14.6 VFX — Beat H effects

| VFX ID | Effect | Tech | Output | Notes |
|---|---|---|---|---|
| `vfx_signal_intake_lit_panel` | Cyan #22d3ee lit panel in the signal intake matrix, pulsing very slowly (sub-0.25 Hz) to suggest active long-range listening | CSS keyframe alpha tween on 6 instances | `apps/client/public/art/vfx/prelude/signal-intake-lit-panel.webm` (loop) | 6 instances in the Comms Array (back wall matrix). Decorative but establishes that the Ark is still listening |
| `vfx_inbox_envelope_unfold` | Cyan envelope glyph idles at ~60cm, then expands and unfolds into a full message reader UI (90cm × 120cm) over 2 seconds, revealing header strip + separator + body area | PixiJS shader animation + sprite transform | `apps/client/public/art/vfx/prelude/inbox-envelope-unfold.webm` (one-shot transition variant) | **Core NPC Inbox UI asset.** Reused every time a new message arrives in the player's inbox across the entire game. This is the most-reused new VFX asset in this doc — it needs to be engineered as a **scalable, configurable** component that accepts sender name, timestamp, and message body as parameters. Register in a shared `NPCInboxUI` system (new file in `apps/client/src/components/npcInbox/`) |
| `vfx_inbox_edge_sentence_bloom` | Subtle cyan glow brightening on the final sentence of a rendered message, fires when the VO track crosses a specified timestamp | PixiJS masked bloom over the last sentence bounding box | `apps/client/public/art/vfx/prelude/inbox-edge-sentence-bloom.webm` (one-shot) | Fires at 22s of the Beat H cutscene. Configurable per-message — future Inbox messages can optionally trigger this effect on any sentence by passing a `highlightSentenceIndex` parameter to the Inbox reader |
| `vfx_amber_counter_glyph` | Steady amber-yellow #fbbf24 "1" counter above the Inbox envelope glyph, indicating unread count | Static sprite + soft bloom + anamorphic flare | `apps/client/public/art/vfx/prelude/amber-counter-glyph.webm` (static) | Comms Array primary Prelude use. Reused anywhere in the game that shows an Inbox unread count — the amber color is canonically the unread-count indicator |

**Reduced-motion accessibility fallback:** when `prefers-reduced-motion` is active, the `vfx_inbox_envelope_unfold` effect renders as a single static end-state frame (the full message reader UI is visible from the start of Act 2, no unfold animation). The `vfx_inbox_edge_sentence_bloom` renders as a static bloom on the last sentence for the final 2 seconds of the VO. The camera zoom in Act 4 is disabled — the reader stays at mid-frame scale. The `locke_beat_h_first_message` VO plays at full volume. The full message body text is rendered legibly for the full duration of the cutscene (not gated on the unfold animation). All semantic meaning of the cutscene is preserved.

---

## Section 15 — Beat H.5: Memo Pile (Breath Beat)

### 15.1 Narrative purpose

The fifth and final breath beat. Same-room continuation of Beat H — the player does not leave the Comms Array. Elara's hologram fades (Locke's message is "read" and the Inbox returns to idle), and the camera drifts across to the **wheeled archival cart** in the right foreground that has been silently present in the Comms Array still since Beat H's opening frame. The cart is stacked with three shelves of old memo slates — rectangular composite tablets approximately book-sized, most of them dark and inert, two still faintly glowing cyan as if running on residual charge.

The breath beat is a **visual meditation on the archive**, not a narrative beat. No VO fires. No message plays. No cutscene action happens. The camera moves to the cart, a single loose paper memo drifts down from the top shelf onto the floor (the result of the Ark's ventilation system breathing very gently against a sheaf that has been in balance for 17,000 years and was disturbed by something — maybe the player's presence, maybe nothing), and the camera holds on the paper as it settles. Twenty seconds total. The player can skip it.

**Structural role:** Beat H.5 is the **decompression chamber** after Beat H's NPC Inbox UI onboarding. Beat H was busy — a new UI pattern was introduced, a message was rendered as legible text, a new character was voice-introduced, an edge sentence landed. The player needs a moment. Beat H.5 gives them twenty seconds of *nothing happens except one piece of paper drifting*, in the same room they just finished reading a message in, without moving to a new environment. The breath beat is pacing, not content.

**The paper is not plot.** The player should not be able to interact with the drifting paper, the cart, the memo slates, or anything else in the room during this beat. The room is observed, not explored. If the player tries to walk toward the cart, the interaction cursor does not appear on any of the memo slates — they are scenery. The player's only valid input is "continue to Beat I" or "wait for the full 20 seconds." Either way the beat completes the same.

**Callback payoff:** the two faintly-glowing memo slates on the archival cart are a callback to the **archive-shelf-with-dormant-items** visual from Beat E (the Mess Hall Archive's unlit objects) and the **six-of-twenty-four-lit signal panels** from Beat H (the Comms Array back wall). In all three cases the Ark is shown as *mostly dark with a few still-running elements*, reinforcing the pacing theme: this ship is a library of dim lights, and the player is walking through all of them.

### 15.2 Cross-references

- Comms Array room still: §14.3
- Archive-mostly-dormant visual theme: §10.3 (Mess Hall), §14.3 (Comms Array matrix)
- Breath-beat pacing convention: §4 (Beat A.5), §7 (Beat C.5), §9 (Beat D.5), §12 (Beat F.5), §15 (this beat)

### 15.3 Art — Comms Array environment still

**No new art still.** Beat H.5 reuses the `room-comms-array.png` from §14.3. The camera composition is closer on the wheeled archival cart in the right foreground, but the underlying room asset does not change.

### 15.4 Cutscene — H.5: Memo Pile

- **Beat ID:** `prelude-beat-h5-memo-pile`
- **Output:** `apps/client/public/videos/prelude/prelude-beat-h5-memo-pile.mp4`
- **Duration:** 20s
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `breath_beat_h5_complete`, `memo_pile_seen`
- **Reduced-motion fallback:** static end-frame of the memo pile with the drifted-paper frozen mid-fall, held for 20 seconds

- **Act 1 (0–8s) — Elara fades, camera drifts.** Elara's hologram, still standing beside the central console from Beat H, fades out over 2 seconds (she is canonically *done* with the Comms Array — her role was to stand quietly while the player received the message, and that role is complete). The Inbox UI on the holographic field shrinks back to its idle envelope-glyph state (the amber "1" counter dims slightly because the message has been "read"). Camera begins a slow glide from the central console toward the wheeled archival cart in the right foreground.
- **Act 2 (8–14s) — the drift.** Camera arrives at the cart. The two faintly-glowing memo slates on the middle and bottom shelves are visible. A single loose paper memo — roughly postcard-sized, slightly yellowed with age — begins to drift downward from the top shelf of the cart. The drift is **very slow** — the memo takes approximately 5 seconds to fall from the top shelf to the floor, caught in the barely-moving air of the Ark's ventilation system. No other motion in the frame.
- **Act 3 (14–20s) — settlement.** The memo comes to rest on the floor beside the cart's lower-right wheel. Camera holds on the settled memo for the final 6 seconds. Dust motes drift around it in the cyan light. The memo's face (the side facing the camera) is blank — no legible text, no glyphs, just aged paper. Fade to black at 20s.

### 15.5 VO — Beat H.5 new lines

**None.** Beat H.5 is wordless. The breath beat is purely visual.

### 15.6 VFX — Beat H.5 effects

| VFX ID | Effect | Tech | Output | Notes |
|---|---|---|---|---|
| `vfx_memo_paper_drift` | Single postcard-sized paper memo drifting slowly from the top shelf of the archival cart to the floor over ~5 seconds, caught in minimal ventilation airflow | PixiJS sprite with physics curve (gravity + slight horizontal drift + rotation) | `apps/client/public/art/vfx/prelude/memo-paper-drift.webm` (one-shot) | Comms Array only. Beat H.5 only. The drift should feel **deliberate but not dramatic** — not a feather, not a leaf, just a piece of paper that has been in balance for seventeen thousand years and is now not |
| `vfx_elara_fade_out` | Elara's cyan-edged hologram fades from full opacity to zero over 2 seconds | CSS opacity keyframe | `apps/client/public/art/vfx/prelude/elara-fade-out.webm` (one-shot transition) | Reusable. Any beat where Elara's hologram ends a scene can use this. Flagged for potential reuse in later Acts |

**Reduced-motion accessibility fallback:** when `prefers-reduced-motion` is active, the drifting paper does not animate — instead, a **single static end-state frame** shows the paper already settled on the floor beside the cart, held for the full 20 seconds. Elara's fade-out is also disabled; her hologram is simply absent from the frame from 0s onward (no fade animation). The camera drift from console to cart is disabled — the cutscene plays as a single static shot of the cart and settled memo. Ambient audio beds from Beat G/H continue to play in the background at reduced volume (~40%).

---

## Section 16 — Beat I: Bridge — Witnessing Hub Activate

### 16.1 Narrative purpose

The player crosses from the Comms Array onto the **Bridge** — the Ark's command center, previously seen but not visited during Beat A's Cryo Wake opening (when the player woke far below the Bridge level). The Bridge is a large elevated room at the ship's prow: a semicircular command crescent with five duty stations (captain's chair centered, four officer stations flanking), a panoramic forward viewport showing the debris graveyard, and — along the rear wall — **the Witnessing Hub**, a dormant circular installation the player has seen referenced in canon but never seen powered.

**This beat is the first major visual *shift* of the Prelude.** Every beat before it has been lit by cyan floor strips, a few dormant cyan panels, and the rare warm-amber pilot light or service light. The Bridge enters *cold* like every other room — but **during the cutscene, the Witnessing Hub activates**, and when it activates, **the Bridge's primary lights restore for the first time in seventeen thousand years**. The visual shift is deliberately enormous: the cold cyan-dominated palette the player has lived in for the entire Prelude gives way — just for this beat — to a full warm sodium-gold primary-light flood. The Bridge glows. The duty stations light up. The viewport's polarization lifts slightly. The player sees the ship the way the crew saw the ship. It is the first time the Ark has looked *alive* in the Prelude.

The restoration is **not permanent for the Prelude**. When the player exits the Bridge into Beat J (the Archives + Two Witnesses Meet), the primary lights dim back down to cyan emergency mode. The warmth the player just experienced is a moment. But the *moment* reframes everything the player has seen so far — they were walking through a corpse, and they did not know what the corpse used to look like alive until now.

**The Witnessing Hub** is a canonically-seeded concept from `docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md` Rev 6.2 — a system that allows Ark 1047 to *witness* cosmic events across the Prelude's current era, feeding Loredex entries and surfacing them for discovery. The Hub's in-world description: a circular brass-and-cyan installation with a recessed central well, twelve radial spokes extending outward, and a holographic hemisphere that blooms over the well when active. In the Prelude the Hub was dormant because the ship had no power budget for it. The player's activation of the Hub is the trigger — the Ark reallocates power, the Hub blooms, and the reallocation cascade lights the Bridge's primary systems that have been dark since the crew died.

**Activation mechanic (no new VO required):** the player approaches the Witnessing Hub and interacts with the central well's recessed cyan pip. Elara's hologram materializes beside them (her fourth Prelude appearance — Beats A, C, D, F have all had her; H/H.5 did not; this is her re-entry). She does not speak. She **raises her hand toward the Hub's central well in a silent gesture of offering**, and the player's own interaction prompt — a simple "PRESS TO ACTIVATE" that fades up on the UI layer — waits for input. When the player presses, the Hub blooms. The cascade begins. The entire Bridge relights.

**Canon hygiene rule — no machine-god hints.** The Witnessing Hub is NOT to be framed as anything connected to the CoNexus/machine-god canon from §4 of the canon expansion. The Hub is a crew-built system from Ark 1047's construction era, nothing more. If a player or writer asks whether the Hub and the machine god are the same thing, the answer is *no, and the Hub's activation cannot reveal anything about the machine god's existence*. The Hub is a Loredex surfacing mechanism, full stop. The machine god reveal lives in Act 4+ and must not be prefigured here.

**Structural role:** Beat I is the beat that reframes the player's emotional relationship with the Ark. Every prior beat established *this ship is dead and I am walking through its corpse*. Beat I says *this ship used to be alive, and for about forty seconds, you get to see what it used to look like*. The next beat (Beat J, the Archives + Two Witnesses Meet) picks up in cold cyan again and the player carries the memory of the warmth into the final scene. That memory is load-bearing for Beat J's emotional landing — the player needs to know what they are grieving for, and Beat I is where they learn it.

### 16.2 Cross-references

- Witnessing Hub canonical system: `docs/design/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md` Rev 6.2 Part VI Section 4 (Loredex surfacing system)
- Bridge environment (previously established): existing `room-bridge.png` asset — Beat I reuses this room
- Elara hologram re-entry convention: §14.1 established that Elara does NOT narrate Beats H / H.5; Beat I reverses that convention with a silent gesture instead of a spoken line
- Machine-god hygiene rule enforcement: `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §4.6 (no CoNexus hints in Prelude content)
- Warm-light callback: §10 Mess Hall (amber service light), §12 Beat F.5 (chair rim-light), §13 Medical Bay (transfer-array standby) — the Bridge's primary-light restoration is the **fourth and largest** warm-light moment in the Prelude

### 16.3 Art — Bridge environment still

**No new art still.** Beat I reuses the existing `apps/client/public/art/rooms/room-bridge.png` asset. That asset was created prior to this doc (the Bridge was referenced in Beat A's `ANIMATED_CUTSCENES.md` Cutscene 1 render brief and the base room still was delivered as part of that work). The cutscene below uses the existing room-bridge asset as its base layer, with new VFX overlays compositing on top to create the primary-light-restoration effect.

**If the existing `room-bridge.png` asset is not at the right composition** (some future reviewer might find that Beat I needs a different angle than what was produced for Beat A), flag it as a P1 art re-render, not a P0 — the Beat A asset was designed for the cryo-wake-level view which is technically far below the Bridge level, so it may or may not be reusable. This is a known unknown and is flagged here for the art pipeline to catch during production.

### 16.4 Cutscene — I: Witnessing Hub Activate (Primary Lights Restore)

- **Beat ID:** `prelude-beat-i-bridge-witnessing-activate`
- **Output:** `apps/client/public/videos/prelude/prelude-beat-i-bridge-witnessing.mp4`
- **Duration:** 40s
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `cutscene_bridge_intro_complete`, `witnessing_hub_activated`, `primary_lights_restored_beat_i`, `primary_lights_dimmed_beat_j_exit` (fires at the end of the cutscene as the player prepares to exit to Beat J), `witnessing_hub_first_loredex_entry_unlocked`
- **Reduced-motion fallback:** static `room-bridge.png` at full cold-cyan palette, then a single cross-fade (3 seconds) to a hand-composed warm-palette variant of the bridge still held for 15 seconds, then a second cross-fade back to cold-cyan held for 10 seconds. The Witnessing Hub bloom is rendered as a static radial bloom instead of an animated one.

**Structural note:** this cutscene has **the biggest visual transformation of any beat in the Prelude**. The palette shift from cold cyan emergency lighting to warm sodium-gold primary lighting is the single most dramatic moment in the Ark's environment storytelling, and the cutscene's pacing is built to give the moment *room* — the player needs to see the cold, understand it is cold, trigger the activation, feel the bloom start, watch the lights cascade, and then sit in the warmth for a beat before the cutscene ends.

- **Act 1 (0–8s) — arrival, cold.** Camera rises up from the Comms Array's exit hatch to the Bridge level (suggestion: a short elevator or ladder ascent that happens in transition between Beat H.5 and Beat I is implied but not shown — the camera simply cuts to the Bridge with the player already standing at the rear of the command crescent). The Bridge is lit in the Prelude's standard cold palette: cyan floor strips, dormant duty-station panels, dim cyan emergency pips, and the faint light from the panoramic forward viewport (polarized dark, showing the graveyard's silhouettes). The Witnessing Hub dominates the rear wall behind the command crescent — a circular brass-and-cyan installation with twelve radial spokes, its central well dark, no hemisphere active. The player can see it but cannot interact yet — the interaction prompt waits for the camera to finish arriving.
- **Act 2 (8–16s) — approach and offering.** Camera glides toward the Witnessing Hub. Elara's hologram materializes beside the Hub's central well at 10s — her fourth Prelude appearance, silent, facing the Hub rather than the camera. At 12s Elara raises her right hand in a slow deliberate gesture toward the central well, palm open, as if *offering* the well something she does not possess. At 14s the UI layer fades up a subtle "PRESS TO ACTIVATE" prompt beside the Hub. At 16s the prompt locks in and the cutscene holds for the player's input. The player can hold in this beat indefinitely — the cutscene does not auto-advance past 16s until the player presses the activation input.
- **Act 3 (16–22s) — activation bloom.** On player input, the Hub's central well lights from the inside out. A cyan pip at the bottom of the well flares bright, and a **hemispheric bloom of cyan-white light** rises out of the well over 3 seconds, reaching approximately 1.5 meters above the Hub's surface. The twelve radial spokes of the Hub light up in sequence — each spoke brightening from dark to cyan to cyan-white over 500ms, the sequence traveling around the ring clockwise from the 12 o'clock position. At 22s all twelve spokes are fully lit and the hemisphere is at maximum intensity. The Bridge is still in cold cyan — the Hub is the only warm element (*cyan-white*, not yet amber).
- **Act 4 (22–30s) — the cascade.** The moment the hemisphere reaches peak, the **primary-light-restoration cascade begins.** A cascade of warm sodium-gold `#fde68a` light washes across the Bridge in a visible wave, starting from the Witnessing Hub at the rear wall and flooding forward toward the panoramic viewport at the prow. The cascade takes 4 seconds to cross the full depth of the Bridge. As it passes each duty station, the station's panels wake up — first a dim amber flash, then steady amber-gold illumination on the console surface. The captain's chair at the center of the command crescent is the fifth station hit by the cascade (at 26s), and when it lights up its armrest indicators glow steady amber. At 28s the cascade reaches the panoramic viewport. The viewport's polarization lifts partially, letting more of the graveyard's starlight in. The Bridge is now fully lit in warm sodium-gold. Dust motes that have been drifting in cold cyan light for the entire Prelude are now drifting in warm gold light — the same dust, photographed under different illumination.
- **Act 5 (30–38s) — the hold.** Camera slowly pans across the warmly-lit Bridge, showing the duty stations, the captain's chair, the panoramic viewport with its partially-lifted polarization, and the still-active Witnessing Hub at the rear. The player has 8 seconds to sit inside the warmth. Elara's hologram is still beside the Hub, her hand lowered now, watching. No VO. The ambient audio bed shifts from the hollow cold-hum of the prior Prelude rooms to a slightly warmer ambient mix — the ship's powered systems are audible now, a subtle layering of fan hum and console electronics that the player has not heard in any prior beat.
- **Act 6 (38–40s) — the dimming.** At 38s the primary lights begin to dim back down to cold cyan, returning to emergency mode. The dimming takes 2 seconds. The Witnessing Hub hemisphere remains active — this is canonically significant, the Hub stays powered from this moment forward, but the *rest* of the Bridge's primary-light restoration was a **one-time flare** triggered by the Hub's initial activation, and the ship cannot sustain it. By 40s the Bridge is back to cold cyan except for the Hub's cyan-white hemisphere glow, which persists. Fade to black at 40s. Cutscene ends.

**START FRAME (Nano Banana 2):**
> Cinematic still of the Bridge aboard Ark 1047, framed from the rear of the command crescent looking forward toward the panoramic viewport. Full cold-cyan palette consistent with every prior Prelude room: cyan floor strips, dormant cyan duty-station pips, dim cyan emergency lighting, and the faint cold light from the polarized panoramic viewport showing the debris graveyard in silhouette. The Witnessing Hub dominates the rear wall behind camera — its circular brass-and-cyan surface visible in the peripheral/background of the composition, central well dark, twelve radial spokes dark. The five duty stations of the command crescent are visible in the middle-ground (captain's chair centered, four flanking officer stations), all dark. Full color, no warm lights anywhere in frame. 16:9, 4K, no text.

**MID FRAME A (Nano Banana 2, used for Act 3 bloom):**
> Three-quarter view of the Witnessing Hub, camera positioned between the command crescent and the Hub. The Hub's central well is now bright — a cyan-white hemispheric bloom rises out of the well to approximately 1.5 meters height. The twelve radial spokes of the Hub are fully lit cyan-white, creating a disc of bright light at the rear wall. Elara's cyan-edged hologram is visible beside the Hub, her hand just lowering from the offering gesture. The rest of the Bridge (duty stations, captain's chair, viewport) remains in cold cyan — the Hub's light has NOT yet cascaded into the rest of the room. The cold/bright contrast is the frame's visual tension. 16:9, 4K, no text.

**MID FRAME B (Nano Banana 2, used for Act 4 cascade mid-point):**
> Wide shot of the Bridge during the primary-light-restoration cascade. The rear half of the Bridge — the Witnessing Hub and the rear-most duty station — is fully lit in warm sodium-gold `#fde68a`. The front half of the Bridge — the remaining three duty stations, the captain's chair, and the panoramic viewport — is still in cold cyan. The **visible wave** of warm light is mid-cascade, transitioning between the two palettes along a diagonal line approximately one-third of the way across the frame. Dust motes in the wave's boundary are caught in *both* lighting at once, a visual signature of the transition. 16:9, 4K, no text.

**END FRAME (Nano Banana 2):**
> Full warm-sodium-gold Bridge. All five duty stations lit with amber-gold console illumination. Captain's chair armrests glowing. Panoramic viewport's polarization partially lifted, admitting more starlight from the debris graveyard outside. Witnessing Hub at rear wall fully active with cyan-white hemisphere. Elara's hologram still visible beside the Hub, hand lowered, silent. Dust motes drifting in warm gold light throughout. Anamorphic lens flares on the captain's chair, the brightest duty station, and the Hub's hemisphere. The Bridge is *alive*. This is the only frame in the Prelude where the Ark looks like the ship it used to be. 16:9, 4K, no text.

**SEEDANCE 2.0 motion prompt:**
> Continuous camera work across six acts inside a 40-second runtime. **Act 1 (0–8s):** camera rises from below (suggesting ascent from the Comms Array exit hatch to the Bridge level), arriving at the rear of the command crescent, facing forward. Full cold cyan palette. Witnessing Hub dormant in peripheral view. **Act 2 (8–16s):** camera glides toward the Witnessing Hub on the rear wall. Elara's hologram materializes beside the Hub's central well at 10s. At 12s Elara raises her right hand in a slow offering gesture. At 14s UI "PRESS TO ACTIVATE" prompt fades up. At 16s cutscene HOLDS for player input (indefinite — does not auto-advance). **Act 3 (16–22s):** on input, Hub's central well flares bright. Hemispheric cyan-white bloom rises over 3 seconds to ~1.5m height. Twelve radial spokes light sequentially clockwise from 12 o'clock over 3 seconds. At 22s hemisphere at max intensity. **Act 4 (22–30s):** primary-light-restoration cascade begins. Wave of warm sodium-gold #fde68a light travels forward from the Hub toward the viewport over 4 seconds. Each duty station lights as the wave passes. Captain's chair lights at 26s. Viewport reached at 28s, polarization lifts partially. At 30s the Bridge is fully lit warm sodium-gold. **Act 5 (30–38s):** slow camera pan across the warmly-lit Bridge showing duty stations, captain's chair, viewport, and the still-active Hub. 8 seconds of held warmth. Ambient audio bed shifts to powered-systems mix. **Act 6 (38–40s):** primary lights dim back to cold cyan over 2 seconds. Witnessing Hub hemisphere remains active. Fade to black at 40s. 24fps. Reverent, awe-tinted, the biggest visual transformation in the Prelude.

### 16.5 VO — Beat I new lines

**None.** Beat I is wordless by design. Elara is present but silent — her hand-raising offering gesture is the non-verbal equivalent of *"you need to do this part yourself."* No Elara line, no Human line, no Locke line. The player's emotional journey through the cutscene is carried entirely by the visual transformation and the ambient audio shift.

**Hygiene rule for future writers:** if a later Act writer is tempted to add a VO line to Beat I — either Elara narrating the Witnessing Hub, the Human commenting on the warmth returning, a triumphal musical cue with embedded dialog — the instinct should be resisted. The wordlessness is load-bearing. The player earns the warmth through silence, and the silence is what makes the warmth readable as grief (the ship *used* to sound like this) rather than as victory. A VO line here would reframe the beat as *"you fixed the Ark!"* which is not what is happening — the Ark is not fixed, it is briefly remembered.

### 16.6 VFX — Beat I effects

| VFX ID | Effect | Tech | Output | Notes |
|---|---|---|---|---|
| `vfx_witnessing_hub_hemisphere_bloom` | Cyan-white hemispheric bloom rising out of the Witnessing Hub's central well, reaching ~1.5m height, accompanied by 12 radial spokes lighting sequentially clockwise from 12 o'clock over 3 seconds | Three.js volumetric + PixiJS spoke sequencer | `apps/client/public/art/vfx/prelude/witnessing-hub-hemisphere-bloom.webm` (one-shot activation + steady-state variant) | Bridge only in the Prelude. Reused in any Act content where the Witnessing Hub is visible (including Beat J's Archives scene, canonically adjacent to the Bridge). The steady-state variant should run continuously after the initial activation — the Hub stays powered from Beat I onward |
| `vfx_primary_lights_cascade` | Wave of warm sodium-gold `#fde68a` light traveling forward from the Witnessing Hub toward the panoramic viewport, lighting each duty station in sequence as it passes | CSS keyframe color grade transition with directional mask + PixiJS station-pip sequencer | `apps/client/public/art/vfx/prelude/primary-lights-cascade.webm` (one-shot forward cascade + one-shot reverse dim-back variant) | Bridge only. Beat I only. The wave should be visible — the player should be able to *see the light moving*, not just see the result. Engineering should tune the cascade speed so the wave takes exactly 4 seconds to cross the Bridge's full depth (22s to 26s) with the captain's chair lighting at exactly 26s (the midpoint). The reverse dim-back variant fires at 38s |
| `vfx_warm_dust_drift` | Dust motes continue their existing drift pattern but now illuminated by warm sodium-gold light instead of cold cyan — the *same dust, different light* | Material swap on existing dust particle system | N/A — no new asset, this is a lighting override on the existing dust system | Fires throughout Act 5 (30–38s). The visual signature of "the Ark used to look like this" is carried by the dust-continuity detail. Engineering: ensure the dust particles do not reset when the cascade fires — the same particles should persist through the palette shift |
| `vfx_viewport_polarization_lift` | The panoramic forward viewport's polarization drops from ~85% opacity to ~65% opacity when the cascade reaches it at 28s, revealing more of the debris graveyard outside | CSS opacity keyframe on the viewport mask layer | `apps/client/public/art/vfx/prelude/viewport-polarization-lift.webm` (one-shot transition) | Bridge only. Beat I only. The viewport's additional revealed starlight is a subtle reward for the activation — the player sees more of the outside world than they could before |

**Ambient audio bed shift for Beat I:** the Prelude's standard cold-hum ambient bed (used in all prior rooms) **transitions to a powered-systems mix** at the exact moment the cascade hits the captain's chair (26s). The powered-systems mix includes subtle fan hum, console electronics clicks, and a very slight low-frequency rumble that suggests the Ark's gravity generators are drawing a small amount of extra power to sustain the primary lights. The mix returns to the cold-hum bed at 38s as the lights dim. Audio engineering: this is a **crossfade, not a cut** — the transition takes 2 seconds at each boundary. The powered-systems mix is **reused in Beat J** as a background layer (per §8 canon the Witnesses are near the transfer-array system, and the transfer-array is drawing the same kind of persistent power Beat I's Bridge does).

**Witnessing Hub first-Loredex-entry unlock (system note):** the activation sets the flag `witnessing_hub_first_loredex_entry_unlocked`. This flag unlocks the Prelude's **first Loredex entry** — a single entry about the Ark's history that the player can discover by returning to the Witnessing Hub at any time after Beat I. The entry's content is out of scope for this doc (it lives in the Loredex content pipeline, not this bible), but the hook is reserved here so engineering knows the flag exists. The entry is NOT surfaced automatically in Beat I's cutscene — the player must *choose* to read it, and if they skip it, nothing is lost.

**Reduced-motion accessibility fallback:** when `prefers-reduced-motion` is active, the Beat I cutscene plays as three held static frames with cross-fades between them. **Frame 1** (0–16s): cold-cyan Bridge with the dormant Witnessing Hub, held static. The "PRESS TO ACTIVATE" prompt fades up at 14s. **Frame 2** (16–38s): on player input, a 3-second cross-fade to a warm-palette variant of the Bridge still with the Witnessing Hub active (hemisphere visible as a static radial bloom, no animation). The warm frame is held for 19 seconds. **Frame 3** (38–40s): 2-second cross-fade back to the cold-cyan frame with the Witnessing Hub hemisphere still visible. The cascade animation is not rendered — the player sees the palette shift as a cross-fade, not as a traveling wave. The ambient audio bed shift still occurs at the same timing. The `witnessing_hub_first_loredex_entry_unlocked` flag still sets. All semantic content is preserved.

---

## Section 17 — Beat J: Archives + Two Witnesses Meet Part 1

### 17.1 Narrative purpose

**Important preamble:** the Section 1 Master Index row for Beat J currently reads *"Engineer's Transference / Tribunal (climax — 2 Prince VO lines including Quinn-as-apprentice-preview reframing line)"*. **This row is canonically stale.** The 2026-04-15 Canon Rev 7 session (landed via PR #32 squash merge `b9966f91`) established via `CANON_REV_7_ORACLE_VEX_EXPANSION.md` Section 8 that Beat J is **"Archives + Two Witnesses Meet Part 1"** — the player's first in-person meeting with the two resurrected Witnesses (Daniel Cross, now called the Antiquarian, and Malkia Ukweli, now called the Enigma) in the context of the Engineer's final Vortex log playing and transitioning into *Last Words*. The transference and tribunal content is NOT Prelude scope. The Master Index row will be corrected in Section 17.7 of this doc.

The player crosses from the Bridge (where the Witnessing Hub has just been activated and the primary lights have dimmed back down) into **the Archives** — a dedicated room in the Ark's aft-upper quarter reserved for the crew's canonical recordings, historical documents, and holographic memory-archives. The room is circular, domed, and contains a central pedestal with an inactive holo-projection well. Along the curved walls, twelve archive plinths each supporting a dormant memory-crystal. The domed ceiling is a single smooth surface of dark composite with a circular star-chart etched into it (the etching shows the stars the Ark was originally pointed at, now long gone from this era's sky).

**Beat J is the single most emotionally dense beat of the entire Prelude.** Its structural load includes:

1. **The full Engineer Log 5 (~6m40s) plays in its entirety.** Per `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.6, Log 5 is *"the climactic Prelude moment — the log that plays during Beat J (Archives + Two Witnesses Meet Part 1) and hands the player their first Light/Dark choice immediately after."* The log has five movements (Vortex situation, farewell to Elara, farewell to the Human, farewell to Kael, Protocols preflight + final silence) and is recorded as one continuous take. Beat J's cutscene plays the full log with synchronized holographic imagery on the central pedestal's projection well.
2. **The log ends with a hard cut mid-syllable on *"Back to the —"*** followed by **one full second of absolute silence** (the only total silence in the Prelude audio mix), followed by the first note of *Last Words* — the Enigma's song canonically written in response to the log. Per canon §5.6.9, this song cue is the trigger for the first Light/Dark choice of the game.
3. **The first Light/Dark choice appears on the *Last Words* chorus line *"Freedom of thought is worth dying for"*.** The choice is the player's alignment answer to *"Do you carry forward what the Witnesses prophesied and died for, or do you let the empire's narrative close over it?"* The Light path is taking up Malkia's flame; the Dark path is letting it die a second time.
4. **The two resurrected Witnesses are physically present in the Archives.** Per the §8.5 recommended framing (option 1, user approval pending), both Daniel Cross (now the Antiquarian) and Malkia Ukweli (now the Enigma) are canonically in the room with the player when the log plays. The Antiquarian's existing `antiq_fc_1` VO line (*"You are... ah. There you are. I've been watching this moment approach from very far away. Across Ages, across the death of stars. You, Potential, are standing at the fulcrum."*) fires as his first address to the player **before** Log 5 begins. The Enigma is silent throughout Log 5's playback — her voice is the Last Words recording playing out of the Archive's projection well as the song; her physical presence in the room is the *witness to the witness*. After the Light/Dark choice lands, the cutscene ends without either Witness speaking again. The "Part 1" in the beat name implies a "Part 2" in Act 1 where the Witnesses actually sit down with the player and explain what they are — that scene is out of scope for this Prelude bible.
5. **The flashback mechanic from Beat E (§10) is reused.** Each of Log 5's five movements is visually paired with a sepia-drained hologram of the younger Prince in the Archives projection well, using the same `vfx_sepia_drain` + `vfx_film_damage_overlay` system. The Prince's hologram is *not* physically in the room — he is rendered inside the holographic projection well, a meta-layered visual: the player sees the Antiquarian (real) and the Enigma (real) standing in a real-color room watching a sepia-drained hologram of the dead Prince, while the Prince's recording plays through the room's audio system and Malkia's song plays through the same system at the end. Three timelines co-present. One room.
6. **The ambient audio bed is the `ambient_transfer_array_standby` tone from Beat G.** Per §8.5 and §13.6, the Witnesses are canonically near the transfer-array system. The Archives scene uses the same 180 Hz standby tone as Beat G's Medical Bay as its dominant ambient bed, layered with the Bridge's powered-systems mix at ~40% — the player is carrying the sound of two previous rooms into this one. Continuity is deliberate.
7. **Canon hygiene rules from §8.6 of the canon expansion are enforced in every VO, subtitle, and visual cue of this beat:**
   - **The Antiquarian** is the player-facing name. Do not write "Daniel Cross" in any Prelude subtitle or dialog.
   - **The Panopticon** has two distinct canonical meanings — the planet (per DSFGL Rev 6.2) and Daniel Cross's Age-of-Insurgency stage name (per Rev 7 §8.2). Neither meaning surfaces in the Prelude. No Beat J subtitle or visual may hint at either.
   - **The 1260 days are historical.** They are not referenced in any Prelude VO, subtitle, or on-screen element. The player is meeting the Witnesses as resurrected survivors, not as Witnesses mid-ministry.
   - **Silence in Heaven** is never spoken or displayed in Beat J or anywhere else in the Prelude.
   - **The Heart of Time** ship is never mentioned in Beat J or anywhere else in the Prelude.
   - **Age names** (Privacy, Prophecy, Insurgency, Revelation) are never spoken or displayed in Beat J. The Antiquarian's canonical existing line *"Across Ages, across the death of stars"* does NOT name any specific Age — that phrasing is the one Prelude-safe reference to the Ages' existence.
   - **The Two Witnesses framing** is player-facing from Beat J onward. The player knows two people are meeting them, one is the Antiquarian, one is the voice on the song, and there is heavy meaning in the room — but does not yet know the biblical reference, the 1260-day clock, the execution-for-thought-crimes fate, or the resurrection arc. Those are Act-level reveals.

**This beat is the Prelude's landing.** Every visual, every cue, every silence in Beat J has to earn what Log 5 is asking of the player. The beat's specification below is therefore the most detailed in this doc — every act, every transition, every flag is documented explicitly to prevent drift during production.

### 17.2 Cross-references (heavy)

Beat J is the most canon-referenced section of this doc. Every reference below is required reading for anyone implementing or reviewing the beat.

**Canon expansion cross-references:**
- **The full Engineer Log 5 transcript (5 movements, ~6m40s):** `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.6, specifically §5.6.2 through §5.6.6 for the five movement transcripts, §5.6.1 for the structural overview, §5.6.9 for the *Last Words* music cue integration, §5.6.10 for the voice-actor direction (**corrected per §8.7** to Insurgency-era-at-peace framing, NOT prophetic), §5.6.11 for the Beat J hand-off, §5.6.12 for the Elara reaction, §5.6.13 for the Human reaction (incorporating the Correction 4 softening to temporal-vagueness phrasing)
- **Two Witnesses identity sequence and hygiene rules:** `CANON_REV_7_ORACLE_VEX_EXPANSION.md` Section 8, specifically §8.1 Age timeline, §8.2 Daniel Cross identity sequence, §8.3 Malkia Ukweli identity sequence, §8.4 Revelation 11 architecture table, §8.5 Beat J implications and the recommended option 1 (both Witnesses physically present), §8.6 eight canon hygiene rules, §8.7 cross-references and the `antiq_fc_1` line framing as literal autobiography
- **The Enigma as the 11th Neyon + Eden context:** `CANON_REV_7_ORACLE_VEX_EXPANSION.md` Section 7 (full Twelve Neyons roster) and Section 6 (Eden canonical context, referenced in Log 5 Movement 5's "garden on a world that no longer exists")
- **The Warlord retcon (affects Log 5 Movement 5 actor direction):** `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §1.6 — the Warlord is a weaponized nanobot swarm, not Malkia; the Prince's displacement of the Warlord pattern in the swarm is canonically clean (killing a weapon, not a corrupted innocent) — the actor direction for Log 5 Movement 5 in §5.6.10 has already been updated to reflect this
- **The 213 Recruiter's Logs figure (canonical number that Beat F and Log 3 both reference):** `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.4 and §11.1 of this doc

**Prelude Bible cross-references:**
- **Prince voice profile:** §2 of this doc (existing). The voice profile direction for Beat J's Log 5 playback is the same as the existing Prince canonical direction; no new modifiers
- **Flashback mechanic (sepia-drain + film-damage + holographic figure):** §10 Beat E (Mess Hall) is where the mechanic was introduced. Beat J reuses the same three-layer system (`vfx_sepia_drain`, `vfx_film_damage_overlay`, and the holo-render system's sepia-mode flag). Per §10.6 engineering note, the sepia-mode flag shifts the holo edge tint from `#22d3ee` to `#a88a6b`
- **The Antiquarian's existing `antiq_fc_1` VO line:** `docs/production/VOICE_OVER_BIBLE.md` Section 6 (existing). **This line does NOT need to be re-recorded or rewritten** — the canon session confirmed it fits Beat J exactly. It fires at ~15 seconds into the Beat J cutscene as the Antiquarian's first address to the player
- **The `human_beat_d5_sandwich` withholding pattern:** §9.5 (Galley). The Human does not speak in Beat J. The Antiquarian does. The withholding of the Engineer's name continues through Beat J — the Antiquarian refers to the Prince as "him" and "the Engineer" but not by any civilian name
- **The `elara_beat_f_213_entries` line's 213 figure:** §11.5. This figure is canonically echoed in Log 5 Movement 4 when the Prince addresses Kael
- **The `vfx_transfer_array_amber_standby` from Beat G:** §13.6. The amber standby light is visible in the Archives as a background continuity element — the transfer-array system canonically adjacent to the Witnesses' gathering place per §8.5
- **The `ambient_transfer_array_standby` audio bed:** §13.6. Dominant ambient bed in Beat J
- **The `ambient_neural_rig_hum` audio bed:** §13.6. Background layer in Beat J at ~50% volume
- **The Bridge powered-systems mix from Beat I:** §16.6. Background layer in Beat J at ~40% volume

**External file cross-references (song lyrics):**
- ***Last Words* full canonical lyrics:** `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.6.9. The song is canonically titled *Last Words*, is canonically sung by The Enigma / Malkia Ukweli, and its first chorus contains the line *"Freedom of thought is worth dying for"* which is the canonical trigger for the first Light/Dark choice UI appearance

### 17.3 Art — Archives environment still

- **Output:** `apps/client/public/art/rooms/room-archives.png` + `.webp`
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Style anchor:** §0 global + Prelude modifiers. **Critical compositional requirement:** the central pedestal with the inactive holo-projection well, the twelve curved-wall archive plinths each supporting a dormant memory-crystal, the domed ceiling with the etched circular star-chart, and **compositional space reserved for two living figures** (the Antiquarian and the Enigma) who will be rendered into the cutscene but NOT in the base room still

**Nano Banana 2 prompt:**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Archives aboard Ark 1047 — a circular domed room approximately ten meters in diameter with a domed ceiling rising to five meters at its peak. **Dead center of the room, a tall waist-height pedestal** — cylindrical dark composite with brass ring inlays, one meter tall and sixty centimeters in diameter, topped by a recessed circular **holo-projection well** approximately forty centimeters across. The well is currently inactive — its interior is dark, no hologram is projecting, only a faint cyan #22d3ee edge-glow around the well's rim indicating powered-standby. **Along the curved walls**, twelve archive plinths arranged evenly around the room's circumference — each plinth is a small waist-height stand of dark composite with a brass top plate, each supporting **a single memory-crystal**: a small rectangular crystal cube approximately 10 centimeters square, faintly glowing cyan from within. Eleven of the twelve crystals are dim (steady dull cyan — dormant but still holding their content). **One crystal on the far wall directly opposite the entrance is brighter than the others** — pulsing at sub-0.5 Hz, clearly containing content the room is "currently holding ready" for the player. This is the Log 5 crystal, seeded by Elara off-screen in preparation for this beat. **The domed ceiling** is a single smooth surface of dark composite with **a circular star-chart etched into it** — the etching shows constellations approximately thirty centimeters across in faint gold `#fde68a` lines. The star-chart is the canonical star-sky that the Ark was originally pointed at during its construction era; those stars are now canonically long gone from this era's sky, which the player cannot see from inside the Archives. The etching is subtle — visible but not dominant. **Entrance doorway** on one wall is a simple arched composite frame, dark. No windows. **Lighting**: no overhead lights. Illumination comes from cyan emergency floor strips around the circular wall, the faint cyan glow from each of the twelve memory-crystals (especially the brighter Log 5 crystal), the cyan rim-glow around the holo-projection well on the central pedestal, a very faint ambient cyan wash from the etched star-chart on the ceiling (the gold etching is barely reflecting the cyan floor light), and — **in the far background visible through the doorway** — the amber `#fbbf24` standby light of the Medical Bay's transfer-array alcove (§13.3), visible as a small distant warm point through the open archive door. The amber point is approximately 10% of the frame's right edge. It is the **only warm light in the Archives composition** and it is technically *outside* the room — a continuity hook linking Beat J to Beat G. Volumetric fog at ankle height, slightly thinner than adjacent rooms (archival climate is canonically drier). Anamorphic lens flare on the brighter Log 5 memory-crystal on the far wall, the central pedestal's rim-glow, and the distant amber transfer-array point through the doorway. Film grain. Deep space black #010020 base. **No rendered text** on any of the crystals, plinths, the pedestal, or the ceiling star-chart (the star-chart etching suggests constellation shapes but contains no legible star names or coordinates). **No people. No holograms.** Both the Antiquarian and the Enigma are absent from the base still — they are rendered into the cutscene as separate figure layers, not baked into the room asset. Cinematic 4K composition, three-quarter wide shot from the entrance doorway, standing eye level, framing the central pedestal (dominant mid-ground), the twelve archive plinths arranged in the curved background, the domed ceiling with its star-chart etching, and the far doorway with the distant amber transfer-array light visible through it. The mood: **a quiet circular room where twelve memories have been kept for seventeen thousand years, and one of them is about to be played.**

### 17.4 Cutscene — J: Archives + Two Witnesses Meet Part 1

- **Beat ID:** `prelude-beat-j-archives-two-witnesses`
- **Output:** `apps/client/public/videos/prelude/prelude-beat-j-archives.mp4`
- **Duration:** **~8m10s** (not 60s as a stale Master Index might suggest — the cutscene contains the full 6m40s Log 5 playback + the 1-second canonical silence + *Last Words* song intro + first Light/Dark choice UI appearance and resolution). This is the longest single cutscene in the entire Prelude, and its length is load-bearing — the Log 5 transcript is canonically one continuous take and cannot be compressed
- **Aspect:** 16:9 1920×1080
- **Priority:** P0
- **Sets flags:** `cutscene_archives_two_witnesses_part1_complete`, `log5_played_in_full`, `last_words_first_chorus_reached`, `first_light_dark_choice_presented`, `first_light_dark_choice_resolved_light` OR `first_light_dark_choice_resolved_dark` (exactly one of these two based on player input), `antiquarian_first_contact` (fires at ~15s when the `antiq_fc_1` line plays), `enigma_physical_presence_confirmed_beat_j` (fires at ~5s when the Enigma becomes visible — pending user approval per §8.5 option 1)
- **Reduced-motion fallback:** full description in §17.4-f below — the fallback is complex because Log 5's 6m40s has to play back in a mode that still honors the sepia-drain mechanic and the final Light/Dark choice. Short version: the 5 Log 5 movements each render as a single held static sepia frame of the Prince with KineticText subtitles of the transcript, the 1-second silence is preserved, *Last Words* plays as audio with lyric KineticText, and the Light/Dark choice UI is identical to the animated version

**Structural preamble:** this cutscene is the most complex in the Prelude because it has to carry **three simultaneous layers of content** without any of them stepping on the others:

1. **The audio layer:** Log 5's continuous 6m40s voice recording, then 1s of absolute silence, then *Last Words* intro and first chorus. The audio layer is the spine.
2. **The visual layer inside the holo-projection well:** sepia-drained holograms of the Prince rendered *inside* the Archives' central pedestal well, reusing the Beat E flashback mechanic (`vfx_sepia_drain` + `vfx_film_damage_overlay`) in a contained 40cm-diameter projection. The Prince is never rendered at full room-scale in Beat J — he is always inside the well, always sepia, always the size of a small hologram.
3. **The visual layer outside the holo-projection well:** the real-color Archives room with the two resurrected Witnesses standing in it, watching the hologram play. The Antiquarian on one side of the pedestal, the Enigma on the other. Real color, present time, grieving.

The three layers are canonically referred to as **the recording, the memory, and the mourners**. Each one has its own rules for when it appears and when it fades. The cutscene's act-by-act breakdown below specifies which layers are active in each act.

**Cutscene timeline (act-by-act):**

- **Act 1 — Arrival (0:00 → 0:15, 15 seconds).** Camera rises from floor level at the Archives doorway (continuing the implicit ascent pattern from Beat I's Bridge entrance) into the circular domed room. Full cold-cyan palette. The central pedestal with its dormant projection well is the visual focal point; the twelve archive plinths curve around the background with the Log 5 crystal pulsing brighter than the others on the far wall. **The Enigma is already in the room when the camera arrives** — she is standing in the eleven-o'clock position relative to the pedestal, silent, facing the pedestal with her back three-quarters turned to camera, wearing (render: dark traveling coat, purple scarf that catches the cyan light, hair pulled back). She does not turn toward the player. She is waiting for the Antiquarian. Camera glides into the room from the doorway. Ambient audio: `ambient_transfer_array_standby` at 100%, `ambient_neural_rig_hum` at 50%, Bridge powered-systems mix at 40%. No Log 5 audio yet.
- **Act 2 — The Antiquarian arrives (0:15 → 0:30, 15 seconds).** At exactly 0:15 **the Antiquarian walks into frame from the doorway behind the player's camera position** — the player sees him enter past them from behind and cross to the four-o'clock position relative to the pedestal, opposite the Enigma. He wears the canonical Antiquarian look from `VOICE_OVER_BIBLE.md` Section 6: long leather coat, red-glowing steampunk goggles pushed up on his forehead, faint green temporal shimmer around his form, an Orb of Worlds miniature city floating near his right hand (*not* in his hand, floating at his palm), white beard, wise and slightly sad eyes. **As he reaches his position the existing `antiq_fc_1` VO line plays in full** — this is canonically his first address to the player and it is the only spoken line before Log 5 begins: *"You are... ah. There you are. I've been watching this moment approach from very far away. Across Ages, across the death of stars. You, Potential, are standing at the fulcrum."* The line runs ~12 seconds. At the end of the line (0:27) the Antiquarian looks toward the Enigma across the pedestal. She nods once, slowly. Three seconds of silent held composition — the Antiquarian, the Enigma, and the player's camera all facing the inactive pedestal.
- **Act 3 — The log ignites (0:30 → 0:34, 4 seconds).** At 0:30 the brighter Log 5 memory-crystal on the far wall **flares**. Its cyan pulse escalates to a bright steady-on over 2 seconds, then a faint cyan beam traces from the crystal across the room to the central pedestal's projection well. The beam is diegetic — it's the Archives system moving the log from storage to playback. At 0:33 the beam terminates at the well, and the well's cyan rim-glow escalates. At 0:34 the well activates: **a sepia-drained, film-damaged holographic Prince materializes inside the well**, contained in a ~40cm diameter volume on top of the pedestal, small-scale (the Prince's hologram is roughly 30cm tall, not life-size — he is a memory held in a cupped hand, not a ghost at full scale). The sepia-drain applies only to the hologram's volume; the rest of the Archives stays in real color. The `vfx_sepia_drain` and `vfx_film_damage_overlay` effects are scoped to the pedestal's well, not the room.
- **Act 4 — Movement 1: Vortex situation (0:34 → 1:54, 1m20s).** Log 5 Movement 1 audio plays in full. The small sepia Prince inside the well stands at a small sepia Vortex console (a reconstructed memory of the Vortex interior, rendered as holographic scene-within-the-well per canon §5.6.2). Camera holds on the pedestal in a medium shot that includes the Antiquarian on the right, the Enigma on the left, and the glowing well between them. Both Witnesses stand completely still throughout the movement. No acting. No reaction shots. The camera does not cut. The player watches the recording *and* the mourners *at the same time* for the full 1m20s. This is the visual grammar of Beat J: **three layers, one shot, no relief**.
- **Act 5 — Movement 2: To Elara (1:54 → 3:14, 1m20s).** Log 5 Movement 2 audio plays in full. The small sepia Prince's scene-within-the-well transitions to a sepia reconstruction of the Ark engineering bay's holo-bench (per canon §5.6.3 — Elara's farewell scene). The Antiquarian's expression does not change. The Enigma very slightly tilts her head down. That is the only movement in the frame for 80 seconds. Camera continues to hold. Do not cut.
- **Act 6 — Movement 3: To the Human (3:14 → 4:34, 1m20s).** Log 5 Movement 3 plays. Small sepia Prince at a reconstructed galley counter, making the sandwich (per canon §5.6.4). The Antiquarian glances briefly toward the far doorway (visible in the background through the entrance arch) — **this glance is toward the distant amber transfer-array standby light from Beat G**, a canonical continuity beat, the Antiquarian acknowledging Beat G's seed without any verbal cue. The glance lasts 2 seconds and then he returns his gaze to the pedestal. The Enigma does not move. Camera holds.
- **Act 7 — Movement 4: To Kael (4:34 → 5:54, 1m20s).** Log 5 Movement 4 plays (per canon §5.6.5 and §5.6 Movement 4 transcript). This is the Prince's farewell to Kael, including the canonical *"the first card Kael ever played against me"* line and the *"If she ever tells you my name — she will not, because she will not know it — you can tell her from me: you were the right call"* line to Kael about Vex. During this movement the Enigma **slowly raises her left hand** and rests it on the rim of the projection well, touching the edge of the sepia hologram's containing volume. Her hand does not enter the well — she rests it on the pedestal's rim just outside the hologram's diameter. The gesture is approximately at the 5:20 mark, midway through Movement 4. The Antiquarian glances at her hand and does not move. Camera holds on the medium shot throughout.
- **Act 8 — Movement 5: Protocols preflight + final silence (5:54 → 7:14, 1m20s).** Log 5 Movement 5 plays (per canon §5.6.6 and §5.6.7), including the Protocols arming sequence clicks, the Warlord displacement acknowledgment, the garden reference (canonically Eden per §6), and the final *"The bench hums. The deck remembers. That is enough. That was always enough."* catechism. At the movement's end, the Prince in the hologram says *"Back to the —"* and the audio **hard-cuts mid-syllable** at exactly 7:14. This hard cut is canonically precise (`CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.6.9). On the cut, the small sepia Prince hologram inside the well **freezes** — it does not fade — and stays frozen in its final pose for the next beat.
- **Act 9 — The one-second canonical silence (7:14 → 7:15, 1 second).** One full second of absolute silence. No ambient audio, no Witnesses breathing, no dust sound, no score, no music. The mix drops to -∞dB. This is the only total silence in the entire Prelude audio bed and it is canonically load-bearing per §5.6.9. The hologram stays frozen. The Antiquarian and the Enigma stay still. Camera holds. This is the quietest moment the player has experienced since waking from cryo.
- **Act 10 — *Last Words* intro and first chorus (7:15 → 8:05, 50 seconds).** At 7:15 the first note of *Last Words* enters the mix (canonical: *"Last Words"* by The Enigma / Malkia Ukweli, lyrics per canon §5.6.9). The song plays over the Archives visual. As the song begins, the frozen small sepia Prince hologram inside the well **slowly dissolves from sepia into a real-color hologram** over 4 seconds — not back to full cyan-edged modern hologram, but a *warmer, gentler* render that hints at the Prince as he would have looked in a real memory of a real moment, roughly contemporaneous with the song's setting. The sepia-drain and film-damage VFX fade off the hologram's volume during those 4 seconds. The Antiquarian takes one small step back from the pedestal. The Enigma lowers her hand from the rim. Camera begins a very slow pull-back, widening the shot over the next 30 seconds. The song's intro plays, then verse 1, then approaches the first chorus. At 7:55 the chorus begins. At approximately 7:58 the chorus reaches its canonical Light/Dark trigger line *"Freedom of thought is worth dying for"* — and on that exact syllable, the **first Light/Dark choice UI** fades up over the frame.
- **Act 11 — First Light/Dark choice (8:05 → resolution).** The Light/Dark choice UI is a two-option selector appearing as a pale pillar split down the middle, the left half soft-gold `#fde68a` (Light) and the right half deep-violet `#1e1b4b` (Dark). No text labels — the choice is canonically wordless, the UI relies on palette alone. *Last Words* continues to play underneath the choice UI at full volume. The cutscene **pauses on the choice** — music continues, visuals continue, but the cutscene does not auto-advance. The player must select Light or Dark. The time pressure is zero. On selection, exactly one of `first_light_dark_choice_resolved_light` or `first_light_dark_choice_resolved_dark` fires, the chosen half of the pillar brightens, the other half dims, and after a 2-second held beat the cutscene fades to black. *Last Words* continues to play over the black screen for another ~8 seconds into its second verse, then fades. The Prelude ends. Cutscene duration depends on player reaction time at the choice but the nominal length is **~8m10s + player-choice-delay**.

**START FRAME (Nano Banana 2):**
> Cinematic still of the Archives aboard Ark 1047, framed from just inside the entrance doorway. Full cold-cyan palette. The central pedestal with its inactive holo-projection well occupies the middle of the frame. The twelve archive plinths curve around the background; the Log 5 crystal on the far wall is visibly brighter than the other eleven, pulsing subtly. **The Enigma is visible** standing in the eleven-o'clock position relative to the pedestal, three-quarters back view to camera — render her as a woman in a dark traveling coat, a deep-purple scarf that catches the cyan light with a slight violet edge-glow, her hair pulled back, her hands clasped in front of her at waist level, her gaze fixed on the central pedestal. She is silent, still, and clearly *waiting*. The Antiquarian is NOT yet in frame (he enters in Act 2). The etched gold star-chart on the domed ceiling is visible but subtle. Through the entrance doorway (partially visible behind the camera's side), the distant amber transfer-array standby light from Beat G is a small warm point at the right edge of frame. 16:9, 4K, no text.

**MID FRAME A (Nano Banana 2, used for Act 2 as the Antiquarian arrives and delivers antiq_fc_1):**
> Wider shot of the Archives, camera positioned inside the room now with the central pedestal as the visual anchor. The Enigma is in her eleven-o'clock position unchanged. **The Antiquarian has just entered the room** and is crossing to his four-o'clock position opposite the Enigma. He wears a long dark leather coat, red-glowing steampunk goggles pushed up on his forehead, a white beard, wise sad eyes, and a subtle green temporal shimmer around his form. An Orb of Worlds miniature city — a small glowing hologram the size of a grapefruit — floats near his right palm, not held but orbiting. He is mid-step, in motion. Both Witnesses are now visible in the same frame with the central pedestal between them. The pedestal's projection well is still inactive (the Log 5 beam has not fired yet). 16:9, 4K, no text.

**MID FRAME B (Nano Banana 2, used for Acts 4–8 during Log 5 playback):**
> Medium shot of the central pedestal with the small sepia hologram of the Prince rendered inside the projection well. The hologram is ~30cm tall, contained within a ~40cm diameter volume on top of the pedestal. Sepia-drained yellow-brown palette within the hologram's volume only. Film-damage scratches and one thin vertical dust line over the hologram. The small sepia Prince is shown at a reconstructed Vortex console (Movement 1's scene-within-the-hologram), wearing his canonical forty-year-old appearance. Around the pedestal, the real-color Archives room is intact: the Antiquarian on the right side of frame, the Enigma on the left, both still. The cyan edge-glow of the projection well's rim is bright. The Log 5 memory-crystal on the far wall is now bright steady-on (no pulse — it is currently playing, not standing by). 16:9, 4K, no text. This frame is used as the visual anchor for the full Log 5 playback in Acts 4–8; only the scene-within-the-hologram changes across movements, not the framing.

**MID FRAME C (Nano Banana 2, used for Act 9 the 1-second silence):**
> Identical composition to MID FRAME B, but the small sepia Prince inside the pedestal well is **frozen** — caught mid-syllable, one hand slightly raised, expression held. The film-damage overlay is momentarily at maximum opacity, as if the recording has caught on the frame that contains the hard cut. The Antiquarian and the Enigma are both still, and the Enigma's left hand is now resting on the rim of the projection well (gesture from Act 7 still held). Volumetric fog is completely motionless. Dust motes do not drift. The frame reads as *the exact instant the recording stopped*. 16:9, 4K, no text.

**MID FRAME D (Nano Banana 2, used for Act 10 as *Last Words* begins and the hologram warms):**
> Same composition as MID FRAME C but the small sepia Prince hologram has **thawed back into real color** — no more sepia, no more film-damage, a warmer cyan-edged render of the Prince roughly as he would have looked in a real memory of the same moment. The Enigma has lowered her hand from the rim. The Antiquarian has taken one small step backward from the pedestal, widening the composition by a few centimeters. A very subtle warm-amber `#fde68a` halo begins to build around the edges of the frame — not a bloom on any specific element, just a **peripheral warmth** that hints at the song entering the room. 16:9, 4K, no text.

**END FRAME (Nano Banana 2):**
> Wide shot of the Archives with the **Light/Dark choice UI visible center-screen**. The UI is a vertical pale pillar approximately 2 meters tall, floating at standing eye level centered between the camera and the pedestal. The pillar is split vertically down its center line: the **left half is soft-gold `#fde68a`** (Light), the **right half is deep-violet `#1e1b4b`** (Dark). No text labels, no icons, no prompts. The Antiquarian is visible on the right side of the composition, the Enigma on the left, both watching the player, both silent. The central pedestal is still in frame behind the choice pillar, the Prince hologram is still gently glowing in real-color inside the well. Around the peripheral edges of the frame, the warm-amber halo from Act 10's buildup has reached full intensity — the Archives is held in a soft amber peripheral glow that does not touch the center of the frame (where the choice UI is) but frames the composition. *Last Words* is canonically audible (the first chorus line *"Freedom of thought is worth dying for"* has just been sung as the choice UI appeared). 16:9, 4K, no text on the choice UI, no text anywhere.

**SEEDANCE 2.0 motion prompt (full ~8m10s cutscene):**
> Continuous camera work across 11 acts and one indefinite choice-hold inside an ~8m10s runtime (plus player-choice-delay at the end). **Act 1 (0:00–0:15):** camera rises from floor level at the Archives doorway, glides into the circular domed room, establishing the pedestal, the twelve plinths, the brighter Log 5 crystal on the far wall, and the Enigma already standing at the eleven-o'clock position. Full cold-cyan palette. Ambient audio beds layered per §17.4 metadata. **Act 2 (0:15–0:30):** camera holds in its room-interior position. The Antiquarian enters from behind the camera and walks into frame, crossing to the four-o'clock position opposite the Enigma. At 0:15 his existing `antiq_fc_1` VO line plays in full (~12 seconds). At 0:27 he looks toward the Enigma; she nods once. 3 seconds of held composition. **Act 3 (0:30–0:34):** the Log 5 memory-crystal flares. A cyan beam traces from the crystal to the central pedestal's projection well over 3 seconds. At 0:34 the well activates and the small sepia Prince hologram materializes inside it with `vfx_sepia_drain` and `vfx_film_damage_overlay` scoped to the well's volume only. **Acts 4–8 (0:34–7:14, 6m40s):** Log 5's five movements play in full through the pedestal's hologram, synchronized with the canonical audio recording per `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.6.2–§5.6.6. Camera holds on a locked medium shot of the pedestal with both Witnesses flanking it. No cuts, no pans, no zooms. The only motion in the frame across the full 6m40s is: a brief Antiquarian glance toward the distant amber transfer-array light (Act 6, approximately 3:50), and the Enigma raising her left hand to rest on the rim of the well (Act 7, approximately 5:20). The Prince hologram's contained scene changes between movements (Vortex console → engineering bench → galley counter → Kael's reconstructed space → Protocols preflight) but the room composition does not. **Act 9 (7:14–7:15, 1 second):** Log 5 audio hard-cuts mid-syllable on *"Back to the —"*. The small sepia Prince hologram **freezes** in its final pose. One full second of absolute silence. All ambient beds drop to -∞dB. No motion. **Act 10 (7:15–8:05, 50 seconds):** *Last Words* enters the mix. Over 4 seconds the Prince hologram thaws from sepia into real color (sepia-drain and film-damage overlays fade off). The Antiquarian takes a small step back. The Enigma lowers her hand. Camera begins a very slow pull-back over the next 30 seconds, widening the shot. A warm-amber `#fde68a` halo begins to build around the peripheral edges of the frame. At 7:55 the song's first chorus begins. At approximately 7:58 the chorus line *"Freedom of thought is worth dying for"* triggers the Light/Dark choice UI to fade up over the frame. **Act 11 (8:05 → player resolution):** cutscene holds on the choice. Music continues. Visuals continue. No auto-advance. On player input, the chosen half of the pillar brightens, the other half dims, 2-second held beat, fade to black. *Last Words* continues over black for another ~8 seconds, then fades. 24fps. This is the longest, most canonically-loaded cutscene in the Prelude. Do not cut it short, do not compress Log 5's runtime, do not add camera movement where the spec says "hold."

**Reduced-motion accessibility fallback:** when `prefers-reduced-motion` is active, the Beat J cutscene renders as a sequence of **held static frames** timed to the Log 5 audio track:

1. **Arrival (0:00–0:30):** a single static START FRAME composition held for 30 seconds. At 0:15 the `antiq_fc_1` VO plays at full volume with an accompanying KineticText subtitle rendering of the line.
2. **Log ignition and Movements 1–5 (0:30–7:14):** the static MID FRAME B composition is held throughout Log 5's full 6m40s runtime. The small sepia Prince hologram inside the pedestal's well is rendered as a **static sepia image** that swaps between five held frames — one per movement — each with a KineticText subtitle of the movement's full canonical transcript per `CANON_REV_7_ORACLE_VEX_EXPANSION.md` §5.6.2–§5.6.6. The subtitle rendering is continuous and auto-scrolls with the audio. No camera movement. No layered VFX animation. The sepia-drain and film-damage effects are rendered as a static sepia-yellow color grade on the pedestal's well volume only; the film-damage layer is a single frozen scratch overlay rather than an animated loop. The peripheral sound layers (`ambient_transfer_array_standby`, `ambient_neural_rig_hum`, Bridge powered-systems mix) play at their specified volumes.
3. **The 1-second silence (7:14–7:15):** preserved exactly. Reduced-motion does not cut silence. All ambient beds drop to -∞dB. The MID FRAME C composition is held.
4. ***Last Words* (7:15–8:05):** the song plays at full volume with an accompanying KineticText subtitle rendering of the lyrics per canon §5.6.9. The static frame transitions from MID FRAME C to MID FRAME D via a 4-second cross-fade (the sepia thaw). No camera pull-back — the frame stays at its medium shot.
5. **Light/Dark choice (8:05 → player resolution):** the choice UI appears identically to the animated version — a vertical gold/violet split pillar, no text, no icons. The choice UI is fully reduced-motion-compatible (it's a static two-button selector in the animated version as well). On selection, the chosen half brightens with a 500ms alpha tween, the other half dims, and a 2-second held beat plays before the fade to black. *Last Words* continues over black for ~8 more seconds, then fades.

All flags (`log5_played_in_full`, `last_words_first_chorus_reached`, `first_light_dark_choice_presented`, `first_light_dark_choice_resolved_light`/`_dark`, `antiquarian_first_contact`, `enigma_physical_presence_confirmed_beat_j`) fire identically in reduced-motion mode. No semantic content is lost. The cutscene's total runtime in reduced-motion mode is **exactly equal** to the animated version (~8m10s + player-choice-delay), because the audio spine is the load-bearing layer and it is unchanged.

