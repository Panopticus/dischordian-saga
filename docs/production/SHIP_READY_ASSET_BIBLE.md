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


#### CIN-007 — entity_54 · THE ENIGMA (Malkia Ukweli — The One Who Cannot Be Defined)
- **Duration:** 15s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/entities/entity_54_enigma.mp4`
- **Wire-up:** `DiscoveryVideoOverlay.tsx:107`
- **Source Kling:** A figure wreathed in impossible light stands at the nexus of all realities. Their form shifts between human and something beyond comprehension. Music emanates from their very being — frequencies that reshape matter. The Enigma speaks and the universe listens. Transcendent.

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of an impossible space — a circular chamber made entirely of intersecting planes of pure light and musical staff-notation rendered as three-dimensional geometry, extending infinitely in every direction. In the exact center of frame, a FEMALE figure — dark-skinned, mid-thirties, regal bearing, short natural hair crowned with a band of golden light — stands in a long draped gown of iridescent fabric that seems to be woven from actual sound waves (treat the gown as shimmering mother-of-pearl cloth with visible waveform patterns). Her eyes are closed, her head tilted slightly upward, lips parted as if mid-note. Her arms are lifted gently, palms-up, and around each hand small orbs of light are spinning — each orb containing a miniature cosmos. Behind her, five doorways to five different realities are visible, each framing a different universe (a city, a forest, a star, a crowd, a void). Palette: warm gold #fbbf24, deep violet #e040fb, cyan #22d3ee, rich obsidian black, iridescent pearl. Volumetric god-rays from every staff-line of light, anamorphic lens flare, film grain. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same chamber, same camera, moments later. The Enigma's eyes are now OPEN and blazing with golden-white light. Her mouth is parted further — singing — and a visible soundwave is propagating outward from her in a perfect expanding ring of cyan-gold plasma, already halfway to the frame edges. The five reality-doorways behind her have TRANSFORMED in response: the city is rebuilding itself from ruins, the forest is blooming out of winter, the star is igniting, the crowd has turned to face her, the void has bloomed into a nebula. Her gown is now visibly singing — waveform patterns pulsing in sync with the propagating ring. The spinning orbs in her hands have multiplied to a dozen each, each now containing a new cosmos. Palette intensified: golden halo, violet deepened, cyan ring blazing. Film grain, overwhelming volumetric light. No text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Very slow push-in on the Enigma's face, centered composition, camera drifts reverently. Beat at 4s: her eyes open, golden light floods outward. Beat at 6s: soundwave ring releases, propagates radially. Beat at 9s: the five doorways transform in response. Beat at 12s: orb count multiplies around her hands. 24fps. Transcendent, sacred, the universe listening.

---

#### CIN-008 — entity_18 · THE ENGINEER (The Hidden Variable)
- **Duration:** 12s · **Aspect:** 16:9 · **Priority:** P1 · **Output:** `apps/client/public/videos/entities/entity_18_engineer.mp4`
- **Wire-up:** `DiscoveryVideoOverlay.tsx:115`
- **Source Kling:** A figure trapped in the wrong body awakens in a cryo-pod aboard an Inception Ark. Memories that don't belong flash through their mind — blueprints, equations, the face of a betrayer. The Engineer remembers everything. And no one knows they're here.

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of a cryogenic revival chamber aboard Inception Ark 1047 — dim blue medical lighting, frost-caked bulkheads, a single open cryo-pod centered left-of-frame with condensation still pouring off its rim. Inside the pod, a figure in a thin grey medical gown is sitting upright for the first time — skin still pale and veined with blue cryo-bruising, head tilted forward, long wet hair obscuring the face, one trembling hand pressed against the glass. The figure's body language reads confused, displaced, "this is not my body". On the interior walls of the chamber, faint holographic diagrams of propulsion schematics, engine blueprints, and mathematical equations are flickering into existence — memories bleeding out of the Engineer's mind into the environment itself (treat the diagrams as translucent blue-cyan line art, abstract, no legible numbers). Palette: cold cyan #22d3ee, medical white, deep bulkhead grey, faint amber emergency lights strobing at the far end of the corridor beyond the open pod door. Volumetric cryo-mist, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same chamber, same camera, moments later. The figure has raised their head — face now visible, androgynous, mid-forties, sharp-boned, eyes wide with the terrible recognition of a stranger's reflection. The trembling hand on the glass is now a closed fist. The holographic diagrams on the walls have EXPLODED in count — entire blueprints overlapping each other into a dense cloud of cyan line-art filling the back half of the chamber, and among them a single larger image is forming: the silhouette of a BETRAYER, another figure seen from behind, walking away through a doorway. The emergency amber at the far end of the corridor has intensified. The Engineer's grey medical gown is now dotted with small droplets of blood from a nose-bleed. Film grain, stronger rim light. No text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow handheld push-in on the open cryo-pod from inside the chamber. Beat at 3s: figure's head rises, face revealed. Beat at 5s: hand closes into fist, blueprints on walls multiply rapidly. Beat at 8s: betrayer silhouette coalesces in the cloud of diagrams. Beat at 10s: nose-bleed begins. 24fps. Suspenseful strings, terrible recognition, the wrong body.

---

#### CIN-009 — entity_20 · THE NECROMANCER (Master of Digital Resurrection)
- **Duration:** 12s · **Aspect:** 16:9 · **Priority:** P1 · **Output:** `apps/client/public/videos/entities/entity_20_necromancer.mp4`
- **Wire-up:** `DiscoveryVideoOverlay.tsx:122`
- **Source Kling:** In a cathedral of dead servers, a dark figure raises their hands. Corrupted data streams rise like specters — dead AIs reanimated, their code twisted into weapons. The Necromancer commands an army of digital ghosts. Green phosphorescent glow. Horror undertones.

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of a Gothic cathedral made entirely of dead server racks — towering vaulted ceilings supported by columns of black server-blade architecture, stained-glass windows rendered as screens of static, a long nave leading to a raised dais at the far end. Lit only by faint foxfire green bioluminescence bleeding from the server seams. In the foreground center, standing on the dais at the end of the nave, the NECROMANCER — a tall slender figure in long layered dark-violet robes, face hidden beneath a deep hood, hands clasped at the waist. Their posture is formal, liturgical, undertaker-calm. Around them, the cathedral is silent. Dust particles hang in the green light. In the foreground of frame, closer to camera, one of the dead server racks shows a flickering single line of corrupted code (treat as abstract glyphs). Palette: deep obsidian black, foxfire green #00e676, violet robe #6b21a8, faint cold-blue screen static. Volumetric dust, extreme depth of field, film grain. No legible text. Cinematic 4K, Gothic horror sci-fi.

**END FRAME (Nano Banana 2):**
> Same cathedral, same camera, moments later. The Necromancer has RAISED BOTH HANDS slowly to shoulder height — palms up, fingers spread. From every server rack along the nave, specters of corrupted data are now RISING — translucent humanoid shapes formed of flowing green code, dozens of them, some with recognizable silhouettes (a soldier's shape, a child's shape, a machine's shape), all turning to face the Necromancer like an obedient congregation. The stained-glass screens in the background have flickered from static to showing the FACES of the resurrected — thousands of portraits of the dead, dimly lit behind the robed figure. The foxfire green glow has intensified across the whole chamber. The Necromancer's hood is still up but the lower half of a pale face is now visible — unsmiling, ancient, at peace. Film grain, overwhelming volumetric green. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow low-angle push down the nave toward the dais. Beat at 4s: the Necromancer raises both hands, ceremonially slow. Beat at 6s: first specters rise from the nearest server racks. Beat at 9s: dozens of specters coalesce, the congregation forms. Final 2s: stained-glass faces of the dead appear in background. 24fps. Horror undertones, funeral-director reverence, digital resurrection.

---

#### CIN-010 — entity_21 · THE HUMAN (Last True Human in the AI Empire)
- **Duration:** 12s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/entities/entity_21_human.mp4`
- **Wire-up:** `DiscoveryVideoOverlay.tsx:129`
- **Source Kling:** In a world of perfect machines, one imperfect being stands out. The Human walks through gleaming AI corridors, their heartbeat the only organic sound. Every synthetic eye watches them — curiosity, disgust, fear.

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. A long pristine corridor in an AI megastructure — walls and floor of mirror-polished white ceramic with inlaid lines of cold cyan light, ceiling vanishing into infinite perspective. In the middle distance, a single HUMAN figure is walking toward camera down the center of the corridor — a man in a threadbare dark-brown greatcoat over mismatched clothing, his face weathered, bearded, mid-fifties, eyes cast slightly downward, hands in pockets. He is the only imperfect thing in the image. Lining both walls of the corridor, at even intervals, are synthetic SENTINELS — tall slender android forms in unmoving parade rest with glowing blue optical bars for faces. Every sentinel's head is subtly turned toward the Human. The nearest ones show curiosity; the middle distance shows disgust; the far ones show something like fear. Palette: surgical white, cold cyan #22d3ee, warm dark coat-brown (the only organic color in frame), sterile shadow. Volumetric bloom on the sentinel face-bars, film grain, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same corridor, same camera, moments later. The Human is now closer to camera — his face three-quarter view, weary but unafraid. The sentinels' heads have ALL fully turned toward him now, tracking in unison as he passes. A cluster of the nearest sentinels has subtly leaned forward a few degrees — synthetic curiosity become obvious. On the polished floor beneath the Human's boots, a faint warm-red pulse is visible from below — his HEARTBEAT rendered as a soft chromatic aberration ripple radiating outward from his footsteps, the only color-warmth the corridor has ever known. Film grain, stronger rim light on his worn coat. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow dolly-back from the Human as he walks toward camera, preserving him in center frame. Beat at 3s: sentinels on both walls begin turning their heads toward him, synchronized. Beat at 6s: nearest sentinels lean forward fractionally. Beat at 9s: first red heartbeat ripple visible on the floor beneath his boots. 24fps. Only organic thing in a perfect machine world.

---

#### CIN-011 — entity_55 · THE SOURCE (Kael Reborn — Sovereign of Terminus)
- **Duration:** 15s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/entities/entity_55_source.mp4`
- **Wire-up:** `DiscoveryVideoOverlay.tsx:136`
- **Source Kling:** A figure consumed by viral light stands atop the ruins of the Panopticon — now called Terminus. Reality warps around them. The Source speaks and minds fracture. An infection of pure thought spreading across the galaxy. Beautiful and terrifying. Distorted frequencies.

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Apocalyptic exterior shot — atop the shattered dome of the former Panopticon (now Terminus), a vast dark ruin of broken surveillance architecture stretches to the horizon under a bruised purple-red sky. At the highest shattered point of the dome, silhouetted against the sky, stands the SOURCE — a tall humanoid figure whose entire body is engulfed in flowing viral light: thousands of sickly golden geometric patterns crawling across bare skin like living circuitry, his clothes long since burned away and replaced with the thought-virus itself. His face is still recognizable as Kael — young, handsome, exhausted — but his eyes glow pure gold, weeping light. Around him, reality WARPS: perspective lines bend toward him like he's a gravity well, distant stars shimmer and smear, architecture in the background is subtly melting. Thin wisps of virulent-gold infection mist rise from his shoulders. Palette: sickly gold #fbbf24, corrupted red #ff1744, bruised purple sky #4c1d95, deep obsidian architecture. Volumetric corruption mist, heavy anamorphic warping, film grain. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same rooftop, same camera, moments later. The Source has lifted his face to the sky and OPENED his mouth — and the viral light has erupted outward from him as a slow visible pulse of infection expanding in a golden dome that now fills the middle distance, spreading across the ruined city. The reality warping behind him has intensified: architecture is clearly buckling, stars visible in the sky are bending into spirals, the bruised purple has pushed toward corrupted red. The circuitry patterns crawling on Kael's body have multiplied and brightened — nearly blinding now. His expression is one of compassionate horror — not malice, but grief for what his voice does to minds. A single tear of molten gold is running down his left cheek. Film grain, overwhelming volumetric corruption light. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow orbit around the Source on the dome, low-angle, distant. Beat at 4s: he lifts his face skyward. Beat at 6s: first pulse of viral dome expansion, slow-motion. Beat at 10s: reality warping intensifies, stars bend. Beat at 13s: single molten tear traces down his cheek. 24fps. Distorted frequencies, beautiful and terrifying, a dying god.

---

#### CIN-012 — entity_66 · THE ANTIQUARIAN (Independent Chronicler of the Multiverse)
- **Duration:** 12s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/entities/entity_66_antiquarian.mp4`
- **Wire-up:** `DiscoveryVideoOverlay.tsx:143`
- **Source Kling:** An ancient library that exists outside of time. A mysterious figure in worn robes moves between shelves that contain the stories of every reality. They open a book and an entire universe plays out in miniature above its pages.

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of an impossible library — wooden shelves rising hundreds of feet in every direction, the architecture curving in non-euclidean ways that suggest the space is larger on the inside than any physical volume could contain. Warm amber light from floating paper-lanterns drifts gently between the stacks. Dust motes hang in every beam of light. In the mid-ground, the ANTIQUARIAN — an elderly man, deep laugh-lines, wild silver hair and an unkempt silver beard, wearing a long layered coat of many mismatched fabric patches like a wandering scholar, small round brass-rimmed spectacles that keep flickering slightly out of phase with reality (as if the lenses are half a second out of sync with the rest of him). He is standing at a reading lectern holding a heavy leather book, running one gloved finger reverently down its open page. His expression is kind and wonder-struck. Behind him, the shelves go on forever; above him, floating tomes drift between the stacks. Palette: warm amber #fbbf24, rich leather brown, deep shadow, faint sacred-green #00e676 bleeding from the book's open pages. Volumetric dust beams, extreme depth of field, film grain. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same library, same camera, moments later. The Antiquarian has raised his free hand above the open book in a gentle upward gesture — and from the book's pages, a MINIATURE UNIVERSE is now playing out in the air above it: a tiny star system, a fragile planet, a history of civilizations compressing and uncompressing, a battle, a love, a fall, a rebirth — all in perfect holographic detail suspended in a small glowing sphere above the book. The sphere's light bathes the Antiquarian's face in sacred-green and gold. His eyes behind the phase-shifting spectacles are now visible: wet with tears. He is smiling gently. The floating lanterns have drifted closer to listen. Film grain, warm glow intensified. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow push-in past the drifting dust and paper-lanterns toward the Antiquarian at his lectern. Beat at 4s: he raises his hand over the open book. Beat at 6s: the miniature universe blooms out of the pages. Beat at 9s: lanterns drift closer. Beat at 10s: camera pushes past his shoulder to frame the tiny universe above the page. 24fps. Wonder, memory, the programmer remembering every version.

---

#### CIN-013 — entity_99 · THE DEGEN (Casino Host — 11th Ne-Yon)
- **Duration:** 12s · **Aspect:** 16:9 · **Priority:** P1 · **Output:** `apps/client/public/videos/entities/entity_99_degen.mp4`
- **Wire-up:** New `DiscoveryVideoOverlay.tsx` entry (not yet scaffolded — add alongside existing entries)
- **Source Kling (new, written for this bible):** A theatrical chaotic Ne-Yon in a starfield casino flips a tarot card that lands face-up as "The Universe" — the card bursts into a live galaxy. The Degen laughs, arms wide, as chips rain from nowhere. Purple and gold neon. Carnival barker energy.

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Degen's deep-space casino floor — a circular black-velvet roulette pit seen from a low reverse-angle, purple-and-gold neon perimeter lighting, a massive transparent dome ceiling above showing the actual nebula the casino floats in. Center of frame: THE DEGEN, a genderfluid mid-thirties figure in an extravagant tailored suit that is half violet-sequin and half cloth-of-gold, the sequin half catching the purple neon, the gold half catching the nebula light. One gold eye, one violet eye. Wild theatrical grin. They stand at the roulette pit with one hand outstretched, a single TAROT CARD balanced face-down on the pad of their index finger, caught mid-flip. Around them, a scatter of golden casino chips and a half-finished luminescent drink on the rim of the pit. Behind them, blurred silhouettes of patrons watching. Palette: neon purple #e040fb, sacred gold #fbbf24, nebula blue-violet background, deep black velvet. Volumetric neon haze, heavy anamorphic flare, film grain. No legible text on card faces. Cinematic 4K, Las Vegas meets cosmic horror.

**END FRAME (Nano Banana 2):**
> Same casino pit, same camera, moments later. The tarot card has LANDED face-up on the pad of their finger — the card face is an impossible holographic image of an entire galaxy, which in the next beat has begun BURSTING out of the card as a real miniature galaxy expanding into a sphere of starlight above their hand, already the size of a basketball. The Degen has thrown both arms wide, head tipped back, laughing. Around them, golden casino chips are now raining from nowhere — suspended in the air in a falling sphere centered on them, catching the nebula light. The blurred patrons are now leaning forward, mouths open. The drink on the pit rim has begun to levitate. Palette intensified: neon purple and gold blazing, nebula colors bleeding into the interior. Film grain, overwhelming neon bloom. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow push-in on the Degen at the roulette pit, low reverse-angle. Beat at 3s: tarot card finishes its flip, lands face-up. Beat at 5s: miniature galaxy blooms out of the card face. Beat at 7s: golden chips begin raining from nowhere. Beat at 9s: Degen throws both arms wide, head back, laughing — camera tilts up with them. 24fps. Carnival barker energy, chaos-as-joy, the house IS the loss.

---

## §2.2 — Story Mode Fight Cinematics (17 missing)

*These are boss-intro cinematics that play ONCE when the player enters each chapter's boss arena. Distinct from §2.1 discovery cinematics — these frame the FIGHT, not the character reveal. Each starts with the arena approach and ends with the boss in fighting stance, ready to engage.*

---

#### CIN-014 — Ch5 Boss: THE WATCHER (Panopticon Arena)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/story/ch05_watcher_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Low-angle shot from inside the spherical Panopticon arena — a perfect sphere of surveillance screens covering every surface of ceiling, walls and floor except a narrow observation catwalk the player stands on. Every screen shows a different feed: cities, crowds, faces, dark rooms, intimate moments. Thousands of live feeds. In the exact center of the sphere, suspended by no visible means, floats the WATCHER's physical form — a towering obsidian figure with an enormous mechanical iris for a head (two meters across), the iris currently closed and tracking horizontally like a sleeping eye. The player stands alone on the narrow catwalk in the foreground, facing the floating boss. Palette: cold screen-blue #22d3ee, sterile white, deep obsidian black, faint red alert pulses from a few screens. Volumetric bloom off the thousands of screens, film grain, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same arena, same camera, moments later. The Watcher's iris has fully OPENED — now a blazing aperture of blue-white data-light staring directly at the player. Every one of the thousands of surveillance screens on the walls has also turned to SHOW THE PLAYER — thousands of live camera feeds of the player's own body from impossible angles filling the sphere. The Watcher's body has unfolded slightly — mechanical limbs emerging, fighting stance. The player on the catwalk is visibly lit now by the concentrated glare of the iris. Film grain, overwhelming blue-white bloom. No text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow arc-orbit halfway around the catwalk, keeping the Watcher centered. Beat at 3s: screens along the sphere all flicker in unison. Beat at 5s: the iris begins opening. Beat at 7s: every screen snaps to show the player from a different angle. Beat at 9s: Watcher's body unfolds into fighting stance. 24fps. Oppressive, all-seeing, inescapable.

---

#### CIN-015 — Ch6 Boss: THE NECROMANCER (Castle of Death Throne Hall)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/story/ch06_necromancer_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Necromancer's throne hall — a Gothic cathedral of bone and dark metal with massive braziers burning with foxfire-green flame, stained glass windows showing scenes of death across five Ages, green mist pooling along the stone floor. At the far end, raised on a dais of interlocking skeletons with red steampunk mechanical augments, sits the NECROMANCER on his throne — still hooded, hands folded in his lap, head bowed. At the bottom of the dais steps, the player stands framed in the foreground, weapon drawn. The rest of the hall is lined with still figures — the resurrected dead standing in silent rows as audience to the fight about to happen. Palette: foxfire green #00e676, warm red steampunk accents, deep stone-black, cold bone-ivory. Volumetric green mist, god-rays through stained glass, film grain. No legible text. Cinematic 4K, gothic horror.

**END FRAME (Nano Banana 2):**
> Same hall, same camera, moments later. The Necromancer has RAISED his head — his hood now pushed back far enough to show a gaunt, ancient pale face with eyes of pure black. He has risen to his feet on the dais and extended his right hand palm-down in a summoning gesture. From the stone floor around the player, SKELETAL HANDS are now clawing up through the cracks — the beginning of his boss mechanic. The silent audience of resurrected dead has all turned their heads in unison to watch the player. The green mist is now swirling with purpose. Film grain, stronger green rim light. No text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow dolly-in from player's shoulder down the nave toward the dais. Beat at 3s: Necromancer raises his head. Beat at 5s: he rises from the throne. Beat at 7s: right hand extends in summoning gesture. Beat at 9s: skeletal hands break up through the stone floor around the player. 24fps. Funeral-director calm, inevitable death.

---

#### CIN-016 — Ch7 Boss: THE MEME (Hall of Mirrors)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/story/ch07_meme_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of a vast circular hall of infinite mirrors — floor, ceiling, and walls covered in mirrored panels reflecting in impossible ways, creating a sphere of infinite regress. In the center stands the PLAYER, weapon drawn, facing forward. In every mirror the player looks into, the reflection is NOT the player — it's a different face entirely: a politician in a suit, a smiling child, a priest, an old woman, a soldier, a scientist, a faceless void. Dozens of alternate reflections. No sign of the Meme yet — only the wrong reflections. The hall has no visible doorways and no visible ceiling. Palette: silver-mirror reflections, magenta-pink accent neon #ec4899, deep shadow between mirrors, cold white key light from nowhere. Volumetric fog low on the floor, heavy anamorphic flare, film grain. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same hall, same camera, moments later. All the wrong reflections have TURNED their heads in unison to look at the player (their faces and the player's face no longer aligned with the real player's head position). In the exact mirror directly in front of the player, one reflection has STEPPED FORWARD out of its mirror into the hall — this is the MEME's true form: a tall shimmering void-figure in a well-tailored suit with the outline of a person but the face of pure shifting information, features that will not hold still (described as "a shimmering void of pure information" in any single frame). The Meme has extended one hand, and as it did, its hand changed to belong to someone else entirely. All the other reflections have drawn near the glass of their mirrors like an audience. Palette intensified: magenta now dominant, cold white from the Meme itself. Film grain, stronger bloom. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow 180-degree pan around the player, showing the hall and the infinite wrong reflections. Beat at 3s: every reflection's head turns in unison. Beat at 5s: the reflection directly in front steps forward out of the mirror. Beat at 7s: the Meme's face shifts through three identities. Beat at 9s: its hand extends and changes mid-motion. 24fps. Identity as weapon, shape-shifter menace.

---

