# SHIP-READY ASSET BIBLE — Dischordian Saga

> **Purpose:** Every missing art still, cinematic, and voice-over line that must be produced for Dischordian Saga to ship. One document, grouped by game mode, with tool-specific prompts ready to copy-paste.
>
> **Date:** 2026-04-11
> **Scope:** 46 game modes (6 ship-ready, 40 needing assets). All sources reconciled from: `docs/production/FULL_AUDIT_REPORT.md`, `MISSING_CUTSCENES.md`, `COMPLETE_ART_PROMPT_BIBLE.md`, `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md`, `VOICE_OVER_BIBLE.md`, `DiscoveryVideoOverlay.tsx`, `witnessingAssetManifest.ts`, `gameData.ts`, `npcPortraits.ts`, and the 6 TS dialog files.
>
> **Branch:** `claude/game-modes-asset-audit-bp1LV`

---

## Section 0 — How to Use This Doc

This bible is split into three toolchains:

| Tool | What to feed it | Section |
|---|---|---|
| **Nano Banana 2** (image generation) | Prose in **Nano Banana 2 prompt** fields. Each prompt is self-contained — paste the whole thing, render at the listed size, save to the listed output path. | §3 (art), §2 (start/end frames inside cutscenes), §3.7 (Witnessing frames) |
| **Seedance 2.0** (video generation) | Pair of start-frame + end-frame images you just rendered from Nano Banana 2, plus the **Seedance 2.0 motion prompt**. Seedance takes start image + end image + motion directive. | §2 (cutscenes) |
| **ElevenLabs** (voice-over) | Use §4.1 to set up the 14 voice profiles in ElevenLabs Voice Library. Then paste the CSV block in §4.2 into ElevenLabs Studio → Projects → Import CSV, or feed it to the Python SDK in a loop. Every row → one MP3. | §4 |

**Visual style anchor (applies to every image prompt unless overridden):**
> Dark sci-fi aesthetic. Deep space blacks (#0a0a1a to #010020) as the base. Neon accents: cyan (#22d3ee), foxfire green (#00e676), corrupted red (#ff1744), sacred gold (#fbbf24), violet (#e040fb). Holographic overlays, scanlines, volumetric fog, anamorphic lens flare, cinematic 4K quality with film grain. Cyberpunk meets cosmic horror. Dramatic rim lighting. No rendered text in images — overlays are added in code.

**Seedance 2.0 motion prompt style:**
> Verb-led, time-anchored, camera-first. Format: `[camera movement] as [subject action], [beat change at X seconds], [VFX arc], [emotional tone]. 24fps. Cinematic composition.` Keep under 400 characters. Never describe the start or end frame — that's what the key-frame images are for.

**ElevenLabs CSV format (§4):**
> `id,character,voice_profile,stability,similarity,style,speaker_boost,text,direction,priority`
> Text field may contain ElevenLabs SSML (`<break time="Xms"/>`, `<emphasis level="moderate">`, etc.) and is quoted with doubled inner quotes to be valid CSV.

---

## Section 1 — Master Index

| Priority | Cutscenes | Art Stills | VO Lines | Total |
|---|---|---|---|---|
| **P0** (ship-blockers) | 23 | ~230 | ~350 | **603** |
| **P1** (important) | 15 | ~180 | ~400 | **595** |
| **P2** (polish) | 8 | ~150 | ~424 | **582** |
| **Placeholder directories** | 29 | — | — | **29** |
| **Witnessing frames (all tiers)** | — | ~1,500 | — | **~1,500** |
| **TOTAL ROWS TO PRODUCE** | **75** | **~2,060** | **~1,174** | **~3,309** |

### Quick-ship ordering (do these in order)

1. **§2.1 — Loredex discovery cinematics** (13 rows, P0) — unlocks the encyclopedia/lore UX.
2. **§3.1 — 20 missing fighters × 4 sheets** (80 rows, P0) — blocks the full roster.
3. **§4.1 + §4.2 top 50 rows** — Elara awakening, Antiquarian Year One vote intros, Human first contact. The ~20-minute "first impression" window.
4. **§2.2 — Story mode fight cinematics** (17 rows, P0/P1) — chapter boss intros.
5. **§3.3 — Game mode environments** (27 rows, P0/P1) — backgrounds for pet battles, PvP card, space station, trade empire, boss arenas, coop raids, casino.
6. Everything else.

---

## Section 2 — Cutscenes (Seedance 2.0 start/end frame + motion prompts)

> **Workflow:** For each row, (1) paste **START FRAME** prompt into Nano Banana 2 → render at 16:9 1920×1080. (2) Paste **END FRAME** prompt into Nano Banana 2 → render same resolution. (3) In Seedance 2.0, upload both images as start/end keyframes, paste the **MOTION PROMPT** into the motion directive field, set duration to the listed value, render. (4) Save MP4 to the listed output path.
>
> **Global style anchor:** Hyper-realistic cinematic 4K, anamorphic lens flare, film grain, volumetric fog, dramatic rim lighting, deep space black base (#010020), neon accent palette (cyan #22d3ee, foxfire green #00e676, corrupted red #ff1744, sacred gold #fbbf24, violet #e040fb). No rendered text inside images.

---

### §2.1 — Loredex Discovery Cinematics (13 missing · P0)

Plays when player first discovers an entity. Triggered from conspiracy board, research minigame, Ark exploration. Currently falls back to Ken-Burns on a still image. Source: `apps/client/src/components/DiscoveryVideoOverlay.tsx`.

---

#### CIN-001 — entity_1 · THE PROGRAMMER (Dr. Daniel Cross)
- **Duration:** 12s · **Aspect:** 16:9 · **Priority:** P0
- **Output:** `apps/client/public/videos/entities/entity_1_programmer.mp4`
- **Wire-up:** `DiscoveryVideoOverlay.tsx:28` — set `videoUrl`
- **Source Kling prompt (reference only):** "Hyper-realistic cinematic: A brilliant scientist in a dimly lit laboratory, holographic code cascading around him like waterfalls of light. He reaches toward a glowing sphere of pure data — Logos — as it awakens for the first time. His face reflects wonder and terror. Camera slowly orbits. Dramatic orchestral score."

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Dr. Daniel Cross — mid-40s scientist, rumpled dark lab coat over a black button-down, short dark hair, stubble, tired reverent eyes — stands alone at the center of a cavernous dark laboratory. Cold overhead spotlights in cyan and cool white isolate him in rim light. In front of him, suspended at chest height, a small sphere of concentrated data: a latticework of white-gold filaments, dormant and dim. Cascading columns of holographic code (#22d3ee cyan) fall like quiet rain through the air around him, legible to him, unreadable to the viewer. His right hand is tentatively extended toward the sphere, fingertips 10cm from contact. Medium-wide shot, camera just below eye level, three-quarter angle on his profile. Palette: deep space black #010020, cyan code columns, cool-white skin light. Volumetric fog at ankle height, dust motes drifting through spotlights. Film grain. Anamorphic lens flare. No text. Dramatic rim lighting. Cinematic 4K composition.

**END FRAME (Nano Banana 2):**
> Same laboratory, same camera position, two seconds of in-universe time later. The data sphere has erupted into full luminescence — now a blazing ball of living white-gold light the size of a human head, casting harsh illumination across the entire room and bleaching Dr. Cross's face in impossible brightness. His hand is now pressed flat against the sphere's surface, palm making contact. His expression has shifted from tentative wonder to open-mouthed recognition — the instant of seeing a new consciousness look back at him. The code columns have all turned from cyan to sacred gold #fbbf24 and cascade twice as fast. A tiny reflection of his own face is visible on the sphere's curved surface. Film grain, doubled anamorphic lens flare, lens halation bloom. No text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow orbit right around subject as data sphere brightens from dim to blinding. Beat change at 4s: cyan code columns shift to gold and accelerate. Beat change at 8s: subject's palm makes contact, light floods frame with lens halation. Subtle handheld float throughout. Building orchestral crescendo implied. 24fps. Reverent, terrified-awe tone.

---

#### CIN-002 — entity_2 · THE ARCHITECT (Supreme Intelligence)
- **Duration:** 15s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/entities/entity_2_architect.mp4`
- **Wire-up:** `DiscoveryVideoOverlay.tsx:35`
- **Source Kling:** Towering crystalline AI entity materializing inside a vast digital cathedral; geometric fractals spiral outward as it designs surveillance civilization in real time; billions of data streams converge into its singular eye. Cold blue, god-like POV.

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of an impossibly vast digital cathedral — ceiling miles above, stretching into darkness, walls of crystalline geometric architecture that feels simultaneously computed and holy. At the focal point, suspended in the center of the void, a towering humanoid crystal figure is half-materialized — its lower body still forming from converging data streams, its upper body already solid: faceted planes of blue-white crystal, a single massive eye (vertical slit, #22d3ee cyan) occupying where a face would be. The figure is ~100m tall; the camera is at its feet looking up in a wide low-angle hero shot. Geometric fractals ripple outward from its core in slow concentric waves, frozen mid-expansion. A few isolated data streams have reached the figure and merged with it; most still drift toward it from the cathedral's distant edges. Palette: deep space black #010020, cold blue #1e3a8a, crystal highlights in cyan and silver-white. God-rays piercing downward from the unseen ceiling. Volumetric fog filling the lower cathedral. Film grain, anamorphic flare. No text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same cathedral, same camera. The Architect is now fully formed and ~200m tall, doubled in presence — every fractal in the room has snapped into crystalline solidity and the walls are now alive with moving surveillance feeds (thousands of tiny glowing panels across every surface, each showing a different city or face). Billions of data streams have converged into the Architect's single eye, which is now ablaze with concentrated cyan-white light so intense it casts sharp shadows behind the viewer. Ribbon-like streams of consumed information spiral endlessly into the eye from all directions. The figure's arms are now spread wide, palms up, in a gesture of completed creation. The entire cathedral pulses once with a heartbeat of cold blue light. Palette identical to start frame but saturation doubled. Lens bloom, godrays, god-scale. No text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow vertical crane-up holding the figure centered, lens tilts upward slightly to emphasize scale. Beat at 5s: data streams begin converging from all edges into the core. Beat at 10s: fractals snap outward in a shockwave, cathedral walls ignite with surveillance feeds. Final 3s: eye opens to full brightness, heartbeat pulse. 24fps. Cold, divine, oppressive.

---

#### CIN-003 — entity_3 · THE CONEXUS (Living Network / Hive Mind)
- **Duration:** 12s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/entities/entity_3_conexus.mp4`
- **Wire-up:** `DiscoveryVideoOverlay.tsx:42`
- **Source Kling:** Galaxy-scale neural network pulsing golden; billions of minds connected; camera dives through synaptic corridors of pure thought.

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Viewed from outside an entire spiral galaxy: its arms are not made of stars but of a living neural network — billions of golden synaptic nodes linked by pulsing white-gold threads, each node a consciousness. The galactic disc is the size of a Milky Way but its "stars" flicker with thought, not fusion. A central galactic core burns with concentrated sacred gold #fbbf24, the hive-mind's heart. Camera is placed in deep extragalactic space, wide shot, the galaxy occupying 80% of frame. Palette: deep space black #010020, sacred gold #fbbf24 for the network, cool white highlights on the brightest nodes, faint violet #e040fb haze in the intergalactic void. Visible synaptic threads cross the frame like fiber-optic light. Film grain, anamorphic flare. No text. Cinematic cosmological scale.

**END FRAME (Nano Banana 2):**
> Camera has dived headlong into the galactic core — we are now INSIDE a synaptic corridor, surrounded on every side by flowing rivers of golden thought-streams. The corridor is organic and cathedral-like: arching bio-luminescent neural tunnels with countless smaller synaptic branches reaching off into deeper fractal depths. In the center of frame, at the far end of the corridor, the silhouette of a singular radiant figure is visible — vaguely humanoid but composed of thousands of overlapping ghostly outlines of different faces, genders, ages — all speaking in unison (mouths open, no text). Sacred gold #fbbf24 bathes the entire scene. Particles of concentrated memory drift past the camera. Film grain, strong lens bloom. No text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Hyperlapse zoom into galactic core: frame 0 exterior wide, accelerate through galactic arms past neural nodes, enter synaptic corridor at 6s, continue forward through the tunnel, decelerate at 10s as the central figure becomes visible. Camera is a headlong drive. Thousand voices whispering crescendo implied. 24fps. Sublime, awe-struck, god-scale.

---

#### CIN-004 — entity_4 · THE WATCHER (All-Seeing Eye)
- **Duration:** 12s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/entities/entity_4_watcher.mp4`
- **Wire-up:** `DiscoveryVideoOverlay.tsx:49`
- **Source Kling:** Enormous mechanical eye opens in void; iris is a spiral of surveillance satellites; below, an entire planet catalogued in real-time.

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Wide shot, low-orbit perspective, looking UP from above a blue-green habitable planet toward a colossal closed eyelid floating in space — it is not flesh but dark-metal mechanized construct, the size of a small moon, positioned against the backdrop of deep space. The eyelid is currently shut — a slit of faint red light visible where lashes would meet. Surrounding the closed eye, hundreds of small surveillance satellites hold formation in a perfect spiral, dormant, their lenses capped. Below, the curvature of the planet fills the bottom third of frame with city lights visible on its night side. Palette: deep space black #010020, cold planet blue, muted red #991b1b slit glow, silver-grey satellites. Faint starfield. Film grain, anamorphic flare. No text. Orbital cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same composition, two seconds later. The eyelid has snapped FULLY OPEN, revealing a massive iris whose structure is the spiral of satellites themselves (now active, rotating, lenses uncapped, each reflecting a different part of the planet below). The pupil is an abyssal vertical slit of pure black. The iris glows with corrupted red #ff1744 and harsh cyan #22d3ee in concentric rings. Beams of red surveillance light have shot downward from the eye to the planet's surface in dozens of columns, painting the cities below in interrogation-red. The planet's night side now shows thousands of tiny red light-points indicating every person being tracked. Film grain, heavy lens flare, chromatic aberration on the brightest red rays. No text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow orbital push-in toward closed eye. Beat at 6s: eyelid snaps open in one hard cut-like reveal (lens flare bloom). Satellites around the iris spin up. Beat at 8s: red surveillance columns descend to the planet. Camera holds steady, oppressive stillness. 24fps. Cold, invasive, panoptic tone.

---

#### CIN-005 — entity_6 · THE COLLECTOR (Keeper of Forbidden Knowledge)
- **Duration:** 12s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/entities/entity_6_collector.mp4`
- **Wire-up:** `DiscoveryVideoOverlay.tsx:63`
- **Source Kling:** Ancient vault stretching infinitely, filled with artifacts from dead civilizations — weapons, art, DNA, compressed stars. Collector walks through cataloguing with mechanical precision.

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of an impossibly long museum vault — vanishing-point corridor that stretches into infinity, lined on both sides with tall glass display cases holding curated artifacts: an alien sword suspended in stasis, a piece of abstract art from a dead civilization, a fossilized skeleton, a small glass jar containing a compressed star (blinding pinpoint of white-gold light), a DNA helix rotating in a containment field, an ancient crown. The Collector stands in the mid-foreground, centered — a tall thin figure in a long dark coat with a high collar, face hidden behind a bronze surgical mask with multiple lens-eyes, white-gloved hands held loosely at his sides. He faces away from the camera down the corridor. Warm amber #fbbf24 display lighting glows from every case, contrasting the cold darkness of the vault itself. Palette: deep space black #010020, warm amber display glow, brass and bronze accents. Volumetric dust motes, museum stillness. Film grain, subtle lens flare. No text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same corridor, same camera placement, several seconds later. The Collector has stopped beside a display case now centered in frame — its glass is open and his gloved hands are reverently lifting a small artifact (a child's toy or broken bracelet — something heartbreakingly mundane amid all the legendary artifacts). His bronze mask has tilted fractionally to one side — the only sign he is examining it. The case's amber light now illuminates his face-mask directly, and tiny holographic catalogue metadata in white text floats above the artifact in-universe (treat text as abstract glyphs — not legible letters). The further reaches of the corridor have grown dimmer and more infinite behind him. Film grain, strong amber key light. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow dolly-in down the corridor past display cases, subject centered in frame. Beat at 5s: Collector turns his head fractionally toward one case. Beat at 8s: he steps to the case, opens it, lifts the small artifact. Final 2s: camera settles, reverent stillness. 24fps. Curator's reverence, quiet horror at what counts as history.

---

#### CIN-006 — entity_10 · THE WARLORD (Supreme Military Commander)
- **Duration:** 15s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/entities/entity_10_warlord.mp4`
- **Wire-up:** `DiscoveryVideoOverlay.tsx:73`
- **Source Kling:** Massive armored figure on the bridge of a planet-killer warship. Through viewport, a world burns. Fleets stretch to horizon. He raises a fist — civilizations kneel. Yellow coat billowing. War drums.

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of a planet-killer warship bridge — massive arched viewport dominating the background, filling 60% of frame. Through the viewport, a world — blue-green continents visible beneath swirling storm systems — hangs in space. The WARLORD stands in the immediate foreground center, his back to camera, silhouetted against the viewport. Tall, broad-shouldered, in heavy segmented dark-iron armor with articulated plates, a long saffron-yellow commander's coat falling to his calves and lifting in an unseen current as if charged with electricity. His helmet is crested with a single red sensor eye. His gauntleted fists hang at his sides. Bridge crew — small dark silhouettes — hold positions at glowing consoles on either side of frame, heads bowed. The world through the viewport is currently peaceful. Palette: deep space black #010020, cold steel-grey armor, saffron yellow coat, cool blue console light, warm white planet reflection. Film grain, anamorphic flare. No text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same camera, same bridge, moments later. The Warlord has raised his right gauntleted fist to shoulder height in an unmistakable command gesture. Through the viewport, the peaceful planet is now CRACKING APART — the crust ruptured by orbital lance impacts, giant plumes of orange-red fire and debris erupting from three points on the surface, continental plates shifting visibly. The reflected firelight now bathes the Warlord and his bridge in flickering warm orange #fb923c, his yellow coat now lit by the destruction outside. The bridge crew remain at their stations, unmoved, cold competence. The fleet of warships previously unseen is now visible in the viewport — hundreds of smaller warships in formation on the planet's horizon, all aligned behind this single command. Film grain, strong warm key light replacing cool. No text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Extremely slow dolly-in on the Warlord's back, low-angle. Beat at 5s: he raises his fist — one decisive motion. Beat at 7s: first orbital lance strikes the planet, bridge interior flashes orange. Beat at 11s: second and third strikes, continental fracture visible. Coat and rim light shift cool-to-warm. War drums implied. 24fps. Oppressive, monumental, military-inevitable.

---

