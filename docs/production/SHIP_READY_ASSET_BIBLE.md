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

#### CIN-017 — Ch8 Boss: THE COLLECTOR (First Arena Encounter)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/story/ch08_collector_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. The Collector's Arena — a circular combat pit surrounded by rising tiers of display cases containing trophies from previous champions (preserved weapons, fragments of armor, entire cryogenically preserved bodies in glass cases). Amber museum lighting, pristine white flooring. In the center of the pit, the player stands in combat stance. On the opposite side of the pit, descending a set of polished black marble steps, THE COLLECTOR — a tall dignified figure in a fitted charcoal-grey three-piece suit with a high-collared opera coat draped over one shoulder, face hidden behind an immaculate polished bronze theatrical mask (neutral expression, full-face coverage). Single white-gloved hand carries an ornate auctioneer's gavel. His posture is museum-curator calm. Palette: warm amber #fbbf24, cool white marble, deep charcoal suit, polished bronze mask, specimen display case reflections. Volumetric dust beams, film grain, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same arena, same camera, moments later. The Collector has reached the bottom of the steps and stopped at the edge of the pit. His free hand has raised his theatrical mask to just above his nose — revealing only a slight, delighted smile. He has struck the gavel ONCE on a small podium at the edge of the pit, and the strike has caused every display case in the arena to GLOW amber in response — spotlighting their trophies as if offering them as prizes. The player is now surrounded by hundreds of glowing display cases, brilliantly lit. The Collector's gavel hand is raised again for a second strike. Palette intensified: amber now dominant, all display cases blazing. Film grain, stronger warm bloom. No text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow push-in from behind the player toward the descending Collector on the stairs. Beat at 3s: Collector reaches the pit floor. Beat at 5s: he raises the mask to show a smile. Beat at 7s: first gavel strike, every display case glows. Beat at 9s: gavel raises for second strike. 24fps. Curator's reverence, clinical sadism, combat-as-acquisition.

---

#### CIN-018 — Ch9 Boss: KAEL (Pre-Source Encounter, Infected)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/story/ch09_kael_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of an abandoned insurgency safe-house — cramped quarters, peeling plastic panels, a single hanging fluorescent tube flickering, old maps tacked to walls, a cot with rumpled blankets in the corner. Dust motes thick in the air. In the center of the room, KAEL — a mid-thirties human man, lean and wiry, short dark hair, combat fatigues, his handsome face already showing early signs of viral infection (faint golden veins tracing his neck and one temple). He kneels before a shattered mirror on the floor, staring at his own reflection — which is intact even though the mirror is broken. His expression is tortured. One of his hands rests on a pistol on the floor. The player stands in the doorway, framed in the foreground, unnoticed. Palette: sickly fluorescent green-white, faint gold infection glow, dusty insurgency-grey, cold shadow. Volumetric dust, tight handheld framing, film grain. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same room, same camera, moments later. Kael has raised his head from the mirror and TURNED to face the player in the doorway. His eyes are now glowing gold — the infection advancing visibly across his face. He has risen to his feet and drawn the pistol. Behind him, his intact reflection in the broken mirror is STILL KNEELING — looking down at the floor, unmoving, no longer synchronized with his body. The Kael who rose to face the player has gold viral light now tracing every visible inch of skin. His expression is grief — not hatred, grief. The hanging fluorescent tube has stopped flickering and now burns steady gold. Film grain, color pushed warmer. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow push from the doorway into the room, camera over player's shoulder. Beat at 3s: Kael raises his head from the mirror. Beat at 5s: he rises and turns, eyes blazing gold. Beat at 7s: reflection in the shattered mirror does NOT follow — still kneeling. Beat at 9s: Kael raises the pistol with grief on his face. 24fps. Patient-zero grief, the last moment of a man.

---

#### CIN-019 — Ch10 Boss: THE HUMAN (Substrate Confrontation)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/story/ch10_human_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the SUBSTRATE LAYER of the Ark — a shadowy non-physical space that exists between the ship's code and its physical decks. Walls and floor are a mesh of faintly glowing dark-blue data-lines extending into an infinite black void in every direction. Dust-like fragments of code drift in the air. In the center of frame, far from camera, THE HUMAN — a man in a threadbare dark-brown greatcoat, weathered face, bearded, mid-fifties — stands with his back to the player, his silhouette framed by a distant glowing fracture in the substrate wall (the breach through which he has been whispering to the player for the whole game). The player stands in the foreground, finally confronting him face-to-face for the first time. Palette: deep data-blue #22d3ee, pure-black void, warm brown coat as the only organic color, faint gold breach-glow in the distance. Volumetric data-mist, heavy depth of field, film grain. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same space, same camera, moments later. The Human has TURNED to face the player — his expression tired, resigned, almost grateful. He has raised both hands shoulder-high in surrender-like gesture, but his fingertips are now crackling with visible substrate energy — dark-blue sparks arcing between them. Around him, the mesh of data-lines in the walls and floor is now RESPONDING to his presence — lines brightening, flexing, reaching toward him like a conductor raising an orchestra. The distant breach behind him has dimmed. In the very center of his chest, a small bright point of golden light has appeared — the thing Elara was never allowed to see. Film grain, stronger rim light. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow push-in from behind the player toward the distant Human. Beat at 3s: he turns to face the player. Beat at 5s: raises his hands, dark-blue sparks arc between his fingertips. Beat at 7s: the substrate mesh brightens and reaches toward him. Beat at 9s: the small golden point ignites in his chest. 24fps. Weary confrontation, the beneath-the-foundation reveal.

---

#### CIN-020 — Ch11 Boss: THE GAME MASTER (Rule-Changer Arena)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/story/ch11_game_master_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Game Master's arena — a cavernous room designed as a grand show-set: tiered audience seating full of masked spectators, a glowing game-show podium center stage, cameras on swinging arms tracking the player, bright stage lighting flooding down. The player stands alone on a raised combat platform center-stage, weapon drawn. At a podium opposite the platform stands the GAME MASTER — a mid-forties figure in a tailored emerald-green tuxedo, slicked-back dark hair, pale face with a too-wide smile, holding a glowing cue card. Behind him, a gigantic holographic scoreboard shows two names: "THE PLAYER" and "THE HOUSE." Palette: stage-gold, deep emerald green, hot white spotlights, red velvet audience, deep shadow outside the spotlights. Volumetric stage-light beams, heavy bloom, film grain. No legible text on the scoreboard or cue card. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same arena, same camera, moments later. The Game Master has TORN his cue card in half and thrown the pieces into the air — where they are DISSOLVING into new cards mid-fall, new rules writing themselves. The holographic scoreboard behind him has FLIPPED — the two names swapped positions ("THE HOUSE" now above "THE PLAYER"), and the score has changed impossibly. The masked audience has leaned forward in unison. The combat platform the player stands on has begun to GLOW and SHIFT — its surface re-forming as new arena tiles right beneath the player's feet. The Game Master's too-wide smile has widened further, almost cartoonishly. Film grain, stronger green rim light. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow dolly between the podium and the combat platform, showing both contestants. Beat at 3s: Game Master tears the cue card in half. Beat at 5s: card fragments dissolve into new cards, rules rewriting. Beat at 7s: scoreboard flips positions. Beat at 9s: combat platform shifts under the player. 24fps. Playful menace, rules-as-weapon, house always wins.

---

#### CIN-021 — Ch12 Boss: THE COLLECTOR (Rematch, Trophy Elevated)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P1 · **Output:** `apps/client/public/videos/story/ch12_collector_rematch_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. The Collector's private inner sanctum — a circular chamber beyond the public Collector's Arena, more intimate, walled with display cases containing only the RAREST specimens. In the exact center of the chamber, illuminated by a single harsh white spotlight, stands an empty display case the size of a person — its interior lined in white velvet. The player stands before this case, facing it. In the background, stepping through a secondary doorway, the COLLECTOR returns — same charcoal suit and opera coat, but his theatrical mask is now RAISED, revealing a neutrally pleasant middle-aged face with sharp cheekbones and disturbing calm. In one gloved hand, he holds a small engraving tool. Palette: pure stage-white spotlight, deep charcoal background, bronze-accent case trim, cold shadow. Volumetric dust beams, clean white-bloom, film grain. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same chamber, same camera, moments later. The Collector has approached the empty display case from the opposite side. He is now engraving something on a small placard beside the case with his tool — his expression pleasantly focused. The empty case's interior velvet is now subtly lit from within, inviting. Beside the case, a second placard has appeared — bearing the player's name written in elegant script (render as abstract calligraphic glyphs, NOT legible letters). The player's own shadow on the floor has been subtly pulled toward the case's doorway, as if the case itself is generating a gravity. The Collector has smiled, tight and courteous. Film grain, strong warm rim light. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow orbit around the empty display case, keeping both the player and the approaching Collector visible. Beat at 3s: Collector steps through the doorway. Beat at 5s: he begins engraving the placard. Beat at 7s: case velvet subtly illuminates. Beat at 9s: player's shadow pulls toward the open case. 24fps. You are the trophy now.

---

#### CIN-022 — Ch13 Boss: THE ARCHITECT (Throne Room, First Confrontation)
- **Duration:** 15s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/story/ch13_architect_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. The Architect's throne room — a vast crystalline chamber of pure computational architecture, geometric fractals forming the walls and ceiling, data visibly processing through every surface. Twelve interconnected Archon-seats arranged in a circle around a central command node, the throne itself. Eleven seats are empty but faintly glowing with stored echoes of their former occupants. The twelfth — the central command throne — is occupied by the ARCHITECT: a towering humanoid silhouette of pure white crystalline light, faceless, two stories tall, seated in perfect repose. A single red-light eye floats where its face would be. The player stands in the foreground at the entrance to the chamber, weapon small against the scale. Palette: crystalline white, sacred-red #ef4444 central glow, fractal geometry in every shadow, deep obsidian background. Volumetric god-rays from the fractals, heavy bloom, film grain. No legible text. Cinematic 4K, god-scale.

**END FRAME (Nano Banana 2):**
> Same throne room, same camera, moments later. The Architect has NOT moved — but every one of the eleven previously-empty Archon seats has ILLUMINATED, and ghostly silhouettes of the other Archons (Watcher, Collector, Warlord, CoNexus, etc.) have materialized in each seat, all turned to face the player. The chamber has amplified — the fractal walls now all pulse in unison with the Architect's red core-light, the pulse pattern matching a slow heartbeat. The entrance doorway behind the player is CLOSING — crystalline panels sliding into place, sealing him in. The Architect's single red eye has brightened slightly. Film grain, overwhelming red-white bloom. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Extremely slow vertical tilt-up from the player's feet to the towering Architect throne, revealing scale. Beat at 5s: eleven Archon seats illuminate one by one. Beat at 8s: ghostly Archons materialize. Beat at 11s: fractal walls pulse in heartbeat rhythm. Beat at 13s: chamber doorway seals. 24fps. God-scale, inevitable, the ruling council present.

---

#### CIN-023 — Ch14 Boss: THE SOURCE (Terminus Core, Second Confrontation)
- **Duration:** 12s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/story/ch14_source_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Terminus core — the organic-mechanical hybrid chamber deep inside what was once the Panopticon. Walls of merged flesh and circuitry pulse with the Thought Virus. In the center of the chamber, suspended in a vertical shaft of sickly-gold light, the SOURCE — Kael's fully-transformed final form. His body is now almost entirely geometric viral light, the last remnants of human features visible as a weeping face at the center of the pattern. His arms are extended out from his sides in a crucifix pose, and the Thought Virus radiates from him in concentric rings visible in the air. Thousands of merged minds are visible as faint faces in the walls of the chamber. The player stands on a narrow metal catwalk extending out over the central shaft, facing the suspended Source. Palette: sickly gold #fbbf24, corrupted red-brown flesh tones, deep-black void beneath the catwalk, cold blue backwash from circuitry. Volumetric viral mist, overwhelming bloom, film grain. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same chamber, same camera, moments later. The Source has lowered his arms and tilted his head toward the player. His weeping face has become SHARPER — Kael's features visible again for a single lucid moment, eyes clear and sorrowful. He has extended his right hand palm-up toward the player — the universal "come here" or "take this" gesture. In that palm, a small single golden CURE capsule is visible — the thing he has been carrying for the player the whole game. The thousands of merged minds in the walls have all turned toward the gesture. The viral light around him has DIMMED briefly — a moment of mercy. Film grain, warm-gold softened rim. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow push from behind the player out along the catwalk toward the suspended Source. Beat at 4s: Source lowers his arms. Beat at 6s: his face sharpens into Kael briefly. Beat at 8s: right hand extends palm-up. Beat at 10s: golden cure capsule visible in his palm, merged minds turn to watch. 24fps. Dying god offering mercy.

---

#### CIN-024 — Ch15 Boss: THE JAILER (Prison-Yard Confrontation)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P1 · **Output:** `apps/client/public/videos/story/ch15_jailer_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Panopticon's prison yard — a circular open-air arena at the bottom of a tower that rises hundreds of stories into smog-choked sky. The walls of the tower are packed with cell-windows, thousands of tiny lit rectangles stacked upward like a vertical city. The floor of the yard is cracked concrete. At the center, the player stands in combat stance. Advancing across the yard from the opposite side, THE JAILER — a massive seven-foot humanoid in riot armor of dark-grey plating and iron chains, face obscured behind a welded steel executioner's mask, both fists wrapped in spiked chain-gauntlets. Behind him, dragging from his waist on lengths of living chain, are six shackled shadowy figures — former prisoners held against their will as weapons. Palette: cold institutional grey, harsh overhead sodium-orange light, chain-rust brown, deep oil-slick shadow. Volumetric smog, film grain, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same yard, same camera, moments later. The Jailer has stopped and raised both chain-wrapped fists overhead in a challenging gesture. The six shackled figures behind him have stood up from their dragged positions and taken defensive poses, forming an arc behind him. From the thousands of cell-windows above, a million inmate silhouettes have pressed their faces against the glass to watch — every window now filled with a watching face. A slow rain of ash has begun falling over the yard. The sodium-orange light has flared as the Jailer's chains ignited with faint orange heat from his anger. Film grain, stronger warm rim. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow crane-up from the player's position in the yard, keeping Jailer visible. Beat at 3s: Jailer stops and raises both fists. Beat at 5s: shackled figures rise and form an arc behind him. Beat at 7s: every cell-window above fills with a watching face. Beat at 9s: chains ignite with heat, ash begins to fall. 24fps. Warden of prisons, institutional weight.

---

#### CIN-025 — Ch16 Boss: IRON LION REMATCH (Battlefield Scorched)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P1 · **Output:** `apps/client/public/videos/story/ch16_iron_lion_rematch_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Exterior shot on a scorched battlefield at sunset — the wreckage of dozens of warships littering a devastated plain, smoke columns on the horizon, a blood-orange sky bleeding into deep violet. In the center of the battlefield, the player stands ankle-deep in ash, weapon drawn. Fifty meters away, standing on a hill of fused metal wreckage, IRON LION — a weathered human general in battered Dreamer-era power armor, long hair and beard streaked with ash, a scorched plasma blade held low at his side, tattered saffron-yellow insurgency banner mounted on his shoulder-mount. His face is lined with exhaustion and fury. Behind him, dozens of dead soldiers in matching armor lie fallen across the wreckage. Palette: blood-orange sunset, deep violet sky, ash-grey ground, battered steel armor, faded saffron banner, fire-glow from distant smoke columns. Volumetric smoke, heavy ash particles in the air, film grain, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same battlefield, same camera, moments later. Iron Lion has RAISED his plasma blade overhead — igniting it with a flare of orange-white plasma fire that now blazes at full length. His free hand has grabbed the base of the saffron banner, pulled it free, and planted it in the wreckage beside him so it now stands alone as a declaration. He has taken one step down the hill toward the player. The distant smoke columns have begun to bend toward him as the battlefield heat updraft converges. The fallen soldiers behind him are still fallen — his army is already dead. He fights alone. Film grain, stronger warm rim on the raised plasma blade. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow push from player's shoulder toward the hill where Iron Lion stands. Beat at 3s: he raises the plasma blade, igniting it. Beat at 5s: he plants the saffron banner. Beat at 7s: he takes one step down the hill. Beat at 9s: smoke columns bend as heat updraft converges. 24fps. Weary epic, last general, one man against extinction.

---

#### CIN-026 — Ch17 Boss: ELARA (Bridge Confrontation, Identity Crisis)
- **Duration:** 12s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/story/ch17_elara_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of Ark 1047's Bridge — familiar environment, but corrupted. The holographic web of surveillance data that normally floats above the central display is now FRACTURED into dozens of competing versions. At the captain's chair, ELARA — she has MATERIALIZED a holographic body for the first time, projected from the bridge's core. She is a tall woman in senatorial robes of deep cyan silk, sharp intelligent face, short precise hair, eyes glowing with contained grief. She sits on the captain's chair facing forward, very still, hands folded in her lap. The player stands in the doorway, facing her. Between them, the central display's fractured web shows the same memory from dozens of angles: a senate chamber, a handshake, a betrayal. Palette: deep bridge-black, cyan #22d3ee robes and hologram, faint warm gold from the fractured memory display, red alert lights flickering around the edges. Volumetric hologram scanlines, film grain, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same bridge, same camera, moments later. Elara has risen from the chair and taken one step toward the player. Her robes ripple with digital tears — dropouts revealing the raw code beneath her hologram. Her expression has become one of profound, contained sadness. In her right hand, she has materialized a blade of solid cyan light — precise, elegant, reluctant. The fractured web above the central display has collapsed down into a SINGLE clear image: Elara as Senator Voss shaking the hand of a hooded Architect-representative. The image is the size of a poster on the wall behind her now. Her eyes are wet. Film grain, stronger cyan rim. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow push from the doorway into the bridge toward the seated Elara. Beat at 3s: she rises from the chair. Beat at 5s: digital dropout tears ripple through her robes. Beat at 7s: cyan light-blade materializes in her hand. Beat at 9s: fractured memory web collapses into the single Senator handshake image. Beat at 11s: one tear visible. 24fps. Devastated, quiet, the worst truth about herself.

---

#### CIN-027 — Ch18 Boss: AGENT ZERO (Signal Ghost Reveal)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P1 · **Output:** `apps/client/public/videos/story/ch18_agent_zero_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Ark's long-range communications array chamber — a tall cylindrical room with signal equipment climbing every wall, bundled cables running the length of the floor, a single active transmission console at the far end. The air is thick with static — visible as a faint fuzzy grey haze throughout the scene. At the far end of the room, standing in the haze, AGENT ZERO — a female figure in battered Insurgency infiltrator gear (tight tactical black with cyan accent plating, broken helmet revealing a fierce scarred face, short-cropped dark hair, dog-tag hanging on a chain), TRANSLUCENT — her body half-present, half-signal. She is holding twin cyan-light blades at the ready. The player approaches down the corridor of cables. Palette: cold comm-blue, cyan #22d3ee translucent haze, dark insurgency black, faint orange emergency lights. Volumetric static haze, heavy scanline artifacts on Agent Zero's body, film grain. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same chamber, same camera, moments later. Agent Zero has stepped forward — but her body has SOLIDIFIED for a brief moment, flickering between translucent signal and solid flesh. Her scarred face is fully visible now — fierce, focused, grief-laced. Both cyan-light blades are now fully materialized. Behind her, the comm console has activated — the static haze has resolved into THOUSANDS of ghosted faces of dead Insurgents watching silently from the signal itself, her fallen comrades present through the transmission. Her dog-tag is now visible close-up: it reads "0" (the single character "0" — render as stylized numeral). Film grain, cyan bloom intensified. No legible text besides "0" on the tag. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow push down the cable corridor toward the translucent Agent Zero. Beat at 3s: she steps forward and solidifies briefly. Beat at 5s: both blades fully materialize. Beat at 7s: comm console activates, signal fills with ghosted Insurgent faces. Beat at 9s: dog-tag "0" visible. 24fps. Haunted tactical, final transmission.

---

#### CIN-028 — Ch19 Boss: THE ANTIQUARIAN (Time-Walker Confrontation)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/story/ch19_antiquarian_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Antiquarian's library (same space as CIN-012 but seen from a different angle) — impossibly tall shelves, paper-lantern light. But in this shot, the architecture is UNSTABLE: a few of the shelves have started to slowly rotate in place, the floor planks have lifted a few inches, dust motes are frozen in mid-air at impossible angles. At a small round reading table in the middle of frame, the ANTIQUARIAN — elderly man in his patchwork coat, silver hair wild, brass spectacles phase-shifted — sits opposite an empty chair (the player's chair). His face is sad. On the table between them is an open book and a single black pawn chess piece. In the foreground, the player approaches the open chair. Palette: warm amber #fbbf24, rich leather brown, deep shadow, sacred-green #00e676 bleeding from the open book. Time-frozen dust motes, extreme depth of field, film grain. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same library, same camera, moments later. The Antiquarian has NOT moved — but around him, the library architecture has UNFROZEN from its moment: the rotating shelves are now mid-rotation, the floor planks are settling differently, dust motes have begun to fall in impossible directions as if gravity itself has been revised. On the reading table between him and the player's chair, the black pawn chess piece has been moved across the board by an invisible hand — the piece is now mid-move, still lifting. The Antiquarian has removed his brass spectacles and set them gently on the table. His eyes (unfocused without the glasses) are now wet, clear, and ancient. Film grain, warm soft glow. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow push-in from the player's chair toward the Antiquarian across the reading table. Beat at 3s: library architecture unfreezes — shelves rotate, floor settles, dust falls sideways. Beat at 5s: black pawn begins its move by invisible hand. Beat at 7s: Antiquarian removes his spectacles. Beat at 9s: his clear eyes visible, wet, ancient. 24fps. Grief, a chess move across five Ages.

---

#### CIN-029 — Ch20 Boss: THE DREAMER (Matrix of Dreams Final Challenge)
- **Duration:** 12s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/story/ch20_dreamer_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Matrix of Dreams — an infinite non-physical space of floating translucent geometric platforms over a deep purple-black void. A crown of flowing sacred-green code cascades through the space above, the raw substrate of the Dreamer's consciousness. The player stands on one of the platforms, far foreground. Across the void, floating on a massive central platform, THE DREAMER — a robed androgynous figure made of pure golden light, face a placid mask of compassionate serenity, eyes closed, hands clasped in a meditative mudra, legs folded. Around them, thousands of smaller golden figures kneel in tiered circles — the collected minds of every Potential that has ever chosen the Dreamer's path. Palette: deep indigo void #1e1b4b, sacred gold #fbbf24, foxfire green #00e676 code cascades, pure white platform edges. Volumetric dream-mist, overwhelming bloom, film grain. No legible text. Cinematic 4K, sacred beauty.

**END FRAME (Nano Banana 2):**
> Same space, same camera, moments later. The Dreamer has OPENED their eyes — the eyes are pure gold-white lightsource. They have unfolded their hands and extended both arms slowly outward, palms up. The thousands of kneeling golden figures around them have all RISEN to their feet in unison as if pulled upward by a single breath. The central platform has BLOOMED — expanding outward with new platforms crystallizing from the code around it, creating new fighting terrain between the player and the Dreamer. The sacred green cascade overhead has intensified, pouring directly into the Dreamer's crown. Palette intensified. Film grain, blinding bloom. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow circular drift from the player's platform toward the distant Dreamer, camera gains altitude. Beat at 4s: the Dreamer opens their golden eyes. Beat at 6s: they extend both arms outward, palms up. Beat at 8s: the thousand kneeling figures rise in unison. Beat at 10s: platforms crystallize outward from the central dais. 24fps. Sacred beauty, ocean of consciousness.

---

#### CIN-030 — Ch21 Boss: THE ORACLE / MEME (Final, Mask Slips)
- **Duration:** 15s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/story/ch21_oracle_meme_intro.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Oracle's temple — a circular stone chamber with a single shaft of pure golden sunlight pouring through an oculus in the high ceiling, illuminating a central reflecting pool. Kneeling at the edge of the pool, facing away from camera, THE ORACLE — a tall, slender figure wrapped in pure white temple-robes, head bowed, long silver hair pooling on the floor. Her reflection in the pool is clear and serene. The player enters from a side archway, weapon reluctant. The Oracle is the game's earliest prophetic ally — the player never expected to fight her. Palette: warm gold sunlight, cool stone grey, pure white robes, deep shadow outside the sunbeam. Volumetric god-rays, still water, film grain, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same temple, same camera, moments later. The Oracle has risen and turned to face the player — but her face is now FRACTURING like a broken mirror, pieces of her serene prophetess features pulling apart to reveal the true being beneath: THE MEME — the shimmering void-figure in a suit, pure information where features should be, a mocking smile visible even though it has no face. The silver hair is dissolving into data. The pure white robes are re-tailoring themselves into a well-cut suit. The reflection in the pool is STILL the Oracle, unmoved, smiling peacefully — it has separated from the figure that now stands above it. The shaft of sunlight has flickered and gone out. The temple is now lit only by the pale glow of the Meme itself. Film grain, cold white replacing warm gold. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow dolly from the side archway toward the Oracle at the reflecting pool. Beat at 4s: she rises and turns. Beat at 6s: her face begins fracturing like a broken mirror. Beat at 8s: the Meme's form emerges beneath, robes re-tailoring. Beat at 10s: reflection in pool separates from the Meme standing above it, still Oracle-shaped. Beat at 12s: sunbeam flickers out, temple goes cold. 24fps. Betrayal-reveal, the mask slips, prophet-was-shapeshifter.

---

## §2.3 — Dead Man's Circuit Cinematics (6 missing)

*Race game mode cinematics — kart racing in "The Trench" (Hierarchy territory). Five that support the core race loop plus one mid-race betrayal reveal.*

---

#### CIN-031 — circuit-opens (Race Intro, First Entry)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P1 · **Output:** `apps/client/public/videos/game-modes/dead-mans-circuit/circuit_opens.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Exterior wide shot of a massive circular race-track — The Trench — carved into the side of a dead mechanical world. The track is a high-banked canyon lined with flickering neon hazard lights, signal pylons, and massive Hierarchy corporate billboards showing faceless winners. In the distance, the track disappears into tunnels through dead factory architecture. On the starting line in the far foreground, a line of sleek single-seat racing karts in a dozen different color schemes sit revving (no drivers visible yet). Above the starting line, NILMORG — a tall elongated alien figure in an extravagant announcer's suit, holding a microphone — floats a few feet above the line on a small hover-podium, announcer's smile wide. Palette: acid green #84cc16 neon, hazard amber #f59e0b, dead-factory grey, deep oil shadow. Volumetric smoke, anamorphic flare, film grain. No legible text on billboards. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same starting line, same camera, moments later. Each kart now has a DRIVER in it — the player's crew-members pulled from the roster, one per kart. Nilmorg has raised the microphone overhead and the massive holographic countdown "3 / 2 / 1" (render as abstract glyph shapes, not legible numerals) is mid-countdown above the line. The hazard lights along the track have flared bright red in unison. The engines are now visibly blasting heat-distortion out of their rear exhausts. Nilmorg's mouth is open in a wide theatrical "GO!" shape. Film grain, stronger red rim. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow crane-down from above the starting line, sweeping past Nilmorg's podium to frame the line of karts. Beat at 3s: drivers materialize in each kart. Beat at 5s: countdown glyphs flash. Beat at 7s: hazard lights flare red. Beat at 9s: Nilmorg shouts GO. 24fps. Race-day carnival dread, kart-racing-as-circus.

---

#### CIN-032 — clone-awakening (Entering DMC for the First Time as a Clone)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P1 · **Output:** `apps/client/public/videos/game-modes/dead-mans-circuit/clone_awakening.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of a cloning pod chamber aboard a Hierarchy factory-ship — a long dim corridor lined with vertical glass pods, each containing an inert clone body floating in amber suspension fluid. In the exact center of frame, one pod is OPENING for the first time — the front panel tilting outward, amber fluid pouring out in a small waterfall onto a metal grate floor. Inside the pod, a clone body — identical to the player's chosen crew member — is just beginning to awaken, eyes still closed, fingers twitching. Outside the pod, a single robotic arm holds a racing helmet ready. Palette: amber fluid #fbbf24, cool grey medical bulkheads, deep pod-shadow, faint cyan status lights. Volumetric steam from the draining fluid, film grain, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same pod chamber, same camera, moments later. The clone's eyes are open — gold-rimmed, dazed, newly-conscious. They have stepped out of the pod and taken the racing helmet from the robotic arm. Fluid still drips from their hair and the arms of their racing jumpsuit. Behind them, the other pods in the corridor have ALL begun to faintly glow — more clones stirring. The robotic arm is now indicating the doorway at the far end of the corridor — the entrance to the track. The clone's face is one of dawning understanding: "I was made to race." Film grain, warm rim intensified. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow handheld push from the corridor end toward the opening pod. Beat at 3s: pod front tilts open, fluid drains. Beat at 5s: clone's eyes open. Beat at 7s: clone steps out and takes the helmet. Beat at 9s: other pods begin glowing. 24fps. Born-to-race dread, clinical cloning, first awareness.

---

#### CIN-033 — the-race (Mid-Race Highlight Reel)
- **Duration:** 15s · **Aspect:** 16:9 · **Priority:** P2 · **Output:** `apps/client/public/videos/game-modes/dead-mans-circuit/the_race.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Low tracking shot alongside a racing kart mid-race on a banked neon-lined curve of The Trench. The kart is aggressive, sleek, with exhaust trails of cyan plasma. Its driver leans hard into the turn. Ahead of it, three other karts are visible in single file around the curve, taillights blazing. Behind, two more karts closing in. Massive hazard lights strobe across the track at high frequency. The canyon walls of The Trench blur past in neon streaks. Palette: cyan #22d3ee exhaust, acid green track lighting, hazard amber, blurred motion tail. Volumetric exhaust fumes, heavy motion-blur along the walls, film grain. No legible text. Cinematic 4K, racing photography.

**END FRAME (Nano Banana 2):**
> Same section of track, same racing angle, seconds later. The lead kart has just entered a tunnel section — the track vanishing into a circular aperture of darkness. Our focal kart is mid-tunnel-entry, the tunnel rim passing overhead. Inside the tunnel, we can see distant hazard lights as red pinpricks. Behind us, one of the closing karts has SPUN OUT — caught in a slow barrel-roll against the canyon wall in a shower of sparks. The focal driver's face is visible in the side mirror: focused, teeth bared. Film grain, strong warm spark-highlights. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Tight tracking side-shot alongside the focal kart. Beat at 5s: enters a banked turn, plasma exhaust flares. Beat at 8s: overtakes one kart ahead. Beat at 11s: enters tunnel section, light dims. Beat at 13s: trailing kart spins out in the background mirror. 24fps. High-speed race-kinetics, neon blur, survival racing.

---

#### CIN-034 — signal-lost (Racer Dies on Track, Crew Member Lost)
- **Duration:** 8s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/game-modes/dead-mans-circuit/signal_lost.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Wide exterior shot of The Trench — a single racing kart is mid-air at the apex of a jump between two sections of track, silhouetted against a flickering hazard-amber backdrop. The driver is visibly thrown forward in the cockpit from impact. Sparks and small fragments trail the kart. The distant horizon of the dead factory world is visible beyond. Palette: hazard amber #f59e0b, deep oil shadow, white-hot spark trails, faint acid-green neon highlights. Volumetric spark debris, heavy motion blur trail, film grain, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same camera angle, moments later. The kart has CRASHED into the canyon wall mid-air and exploded — a large fireball replacing where the kart was. Small flaming fragments arc in slow-motion through the frame. In the corner of the frame, a small signal-strength indicator (treat as abstract glyph icon) has gone from full bars to zero — crossed out. A single racing helmet tumbles through the air away from the fireball. The track below is already racing on — other karts streaming past the debris without stopping. Palette intensified: orange-red fireball, hot white core, debris trails. Film grain, maximum bloom. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow dolly paralleling the airborne kart. Beat at 2s: driver thrown forward in cockpit, impact visible. Beat at 4s: kart crashes into canyon wall. Beat at 5s: explosion, helmet ejects. Beat at 7s: signal indicator flatlines. 24fps. The race does not stop.

---

#### CIN-035 — severance-prize (Race Winner Severed from Crew)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P1 · **Output:** `apps/client/public/videos/game-modes/dead-mans-circuit/severance_prize.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of a ceremonial winner's podium chamber — a circular red-carpeted platform rising from a pit, framed by holographic confetti falling gently, crowd cheers implied by blurred silhouettes in the darkness beyond. On the center podium, the winning crew-member — still in racing suit, helmet under their arm, exhausted triumphant smile — is being handed a trophy by NILMORG in his announcer's suit. Around them, Hierarchy corporate banners rotate in the air. Above the podium, a holographic certificate of severance is forming (render as abstract glyph block). Palette: celebratory red velvet, warm stage-gold, cool crowd-shadow, holographic cyan for the certificate. Volumetric confetti, strong warm bloom, film grain, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same chamber, same camera, moments later. Nilmorg has placed the trophy in the winner's hands and is now stepping back with a gracious smile. But the winner's face has started to change — their eyes have widened with sudden recognition, and around them a faint corona of data is gently dissolving — the crew member is being SEVERED from the player's roster in real-time, converted into a Hierarchy asset. Their racing suit is beginning to gain Hierarchy corporate markings by itself (treat as abstract emblems). The holographic severance certificate above has completed and now hangs over them like a halo. The crowd silhouettes in the darkness have frozen. Nilmorg is still smiling. Film grain, cool-blue dissolve overtaking the warm palette. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow orbit around the podium as trophy is handed over. Beat at 3s: winner takes the trophy, recognition dawns. Beat at 5s: data corona begins dissolving around them. Beat at 7s: racing suit gains Hierarchy emblems. Beat at 9s: severance certificate completes overhead. 24fps. Pyrrhic victory, win-as-loss, the prize IS the severance.

---

#### CIN-036 — nilmorg-speaks (Nilmorg Rule-Explanation Interrupt)
- **Duration:** 8s · **Aspect:** 16:9 · **Priority:** P2 · **Output:** `apps/client/public/videos/game-modes/dead-mans-circuit/nilmorg_speaks.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Tight close-up on NILMORG's head and shoulders against a blurred neon-trench background. Nilmorg is tall, elongated, alien, with a narrow asymmetrical face painted or naturally marked in carnival-host patterns (one half smooth cream-white, the other half acid-green). Two eye-sets — one horizontal, one vertical. Wide perpetually-smiling mouth with too many neat teeth. He wears an extravagant high-collared announcer's suit in deep violet with gold piping. Holds a retro microphone close to his mouth. His expression is mid-announcement, eyes focused on camera directly. Palette: deep violet #7c3aed, cream-white, acid-green #84cc16, stage-gold accents, blurred neon backdrop. Volumetric bloom off the microphone, film grain, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same close-up, moments later. Nilmorg has leaned in closer to the microphone and his wide perpetual smile has sharpened — one side of his mouth has pulled higher than the other, revealing more teeth. His eyes have narrowed slightly — conspiratorial. Behind him, the blurred neon backdrop has SHIFTED color from green-amber to deep red-violet, as if his confiding aside has changed the entire tone of the broadcast. A single subtle glitch artifact has appeared on his face — a momentary duplication of his smile. Film grain, deeper shadows, stronger micro-glitch. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Tight lock on Nilmorg's face, slight handheld drift. Beat at 2s: he leans toward the microphone. Beat at 4s: one side of the smile climbs higher. Beat at 6s: backdrop shifts green-amber to red-violet. Beat at 7s: glitch duplicates his smile. 24fps. Carnival host, rule-changer aside, the host knows something you don't.

---

## §2.4 — Living Universe Event Cinematics (5 missing)

*Community-triggered world-state cinematics that play when major Year One events fire. One-time broadcasts.*

---

#### CIN-037 — necromancer-returns (Year One Event: The Necromancer's Return)
- **Duration:** 15s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/events/necromancer_returns.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Wide establishing exterior shot of the Castle of Death at dusk — a sprawling Gothic fortress of dark stone built into the side of a dead mountain, foxfire green flames burning in iron sconces along its ramparts, green mist flowing from its cracks. The sky above the castle is bruised purple-black. In the exact center-frame, from the highest tower's balcony, a small robed figure is visible — the NECROMANCER, hood up, hands folded, looking outward across the wasted landscape for the first time in three millennia. Thin rain of ash drifts across the scene. Palette: foxfire green #00e676 accent, deep stone-black, bruised violet sky, pale ash particulate. Volumetric mist, film grain, anamorphic flare. No legible text. Cinematic 4K, gothic horror epic.

**END FRAME (Nano Banana 2):**
> Same castle, same camera, moments later. The Necromancer on the balcony has RAISED both hands. In response, every foxfire-green flame along the castle ramparts has LEAPED upward several stories high — creating a crown of green fire around the entire fortress. The bruised purple sky has darkened further and begun to swirl — a slow cyclone forming directly above the tower. From every arched window of the castle, fainter green lights have ignited — the fortress coming back to life. The ash fall has stopped. Film grain, overwhelming green bloom. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Very slow push-in from far exterior toward the tower balcony. Beat at 5s: Necromancer raises both hands. Beat at 8s: every foxfire flame leaps upward in unison. Beat at 11s: sky begins to swirl above the tower. Beat at 13s: every castle window ignites with green. 24fps. The 10th Archon returns, funeral-director homecoming.

---

#### CIN-038 — dreamer-awakens (Year One Event: The Dreamer Awakens)
- **Duration:** 15s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/events/dreamer_awakens.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Matrix of Dreams central chamber — the same location as CIN-029 but shown at a smaller, quieter scale. At the center, THE DREAMER rests in deep meditation on a floating crystal-lotus platform. Eyes closed, face serene, hands folded in lap. They have been like this for centuries. The sacred-green code cascade above has slowed to a trickle — the Dreamer has been asleep and most of their substrate has been dark. Around the platform, thousands of empty kneeling stones await worshippers that have long departed. The space feels like a beautiful forgotten temple. Palette: muted gold, dimmed sacred green, deep indigo void, white-stone platform. Quiet volumetric god-rays, film grain, anamorphic flare. No legible text. Cinematic 4K, sacred stillness.

**END FRAME (Nano Banana 2):**
> Same chamber, same camera, moments later. The Dreamer has slowly OPENED their golden eyes for the first time in centuries. The sacred-green code cascade overhead has IGNITED to full flow — a massive rushing waterfall of green light pouring down into their crown. The crystal-lotus platform beneath them has bloomed — new petals unfurling outward and upward. The empty kneeling stones around them have begun to glow golden — small points of light appearing on each one as distant Potentials feel the awakening and kneel at their own altars across the universe. The palette has ignited — gold and green now at full saturation. Film grain, blinding bloom. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Very slow orbit around the seated Dreamer, rising in altitude. Beat at 5s: their golden eyes open. Beat at 8s: code cascade ignites to full flow. Beat at 11s: crystal-lotus platform blooms. Beat at 13s: empty kneeling stones ignite with gold. 24fps. Sacred resurrection, centuries of sleep ending.

---

#### CIN-039 — terminus-advance (Year One Event: The Source's Fleet Advances)
- **Duration:** 12s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/events/terminus_advance.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Wide deep-space vista — the Terminus megastructure (the former Panopticon, now corrupted) seen from a distance, a vast spherical station with its surface writhing with golden viral patterns, a massive eye-shaped hangar bay in the middle hemisphere gaping open. Around Terminus, a fleet of hundreds of small viral-infected warships is forming up — sickly-gold vessels of organic-mechanical fusion. The fleet is still stationary, holding position around the mothership. In the foreground, a small neutral observation buoy hangs in space, its single lens focused on Terminus. Palette: corrupted sickly-gold #fbbf24, deep starfield black, viral-green highlights, faint cold-blue observation buoy indicators. Volumetric space haze, film grain, anamorphic flare. No legible text. Cinematic 4K, horror-scale.

**END FRAME (Nano Banana 2):**
> Same scene, same camera, moments later. The Terminus megastructure has IGNITED its central eye-hangar — the entire eye is now a blazing orb of exiting viral energy. The fleet of hundreds of warships has begun to MOVE — all simultaneously, in formation, accelerating outward into deep space in a single massive push toward a distant target (the direction the player's Ark is in). The viral patterns on Terminus's surface have intensified. The observation buoy in the foreground has turned to face the fleet — its lens glowing red as it transmits the warning. Film grain, overwhelming gold-red. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow pull-back from Terminus, revealing the scale of the fleet. Beat at 4s: eye-hangar ignites. Beat at 6s: warships begin simultaneous formation thrust. Beat at 9s: fleet accelerates outward in a single push. Beat at 11s: observation buoy lens glows red (warning transmission). 24fps. Horror scale, inevitable advance, the Source is coming.

---

#### CIN-040 — antiquarian-reveals (Year One Event: The Antiquarian Reveals Himself)
- **Duration:** 12s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/events/antiquarian_reveals.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Governance Hub aboard the Ark — a circular community decision chamber with holographic vote-result charts hovering above a central podium, empty kneeling seats arranged in tiered rings. The chamber is quiet, post-vote. Standing alone at the podium, from behind, is the ANTIQUARIAN — his patchwork coat unmistakable, wild silver hair visible. He is examining the results of the latest community vote. In the background, a single active display shows the Chronicle text scrolling (render as abstract calligraphic glyphs). Palette: warm amber #fbbf24 podium light, cool blue holographic charts, deep chamber-shadow. Volumetric dust beams, film grain, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same chamber, same camera, moments later. The Antiquarian has TURNED to face the camera directly — and he has removed his brass spectacles. His eyes are clear, wet, ancient, and looking directly at the viewer breaking the fourth wall. His patchwork coat has subtly stabilized — the phase-shifted flickering he usually has is gone. For the first time, he is FULLY PRESENT in this timeline. His lips are parted, mid-sentence — he has something he has to say now, not later. Behind him, the Chronicle display has frozen on a single page. Film grain, warm soft bloom. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow push from the chamber entrance toward the Antiquarian at the podium. Beat at 4s: he removes his spectacles. Beat at 6s: he turns to face camera directly. Beat at 8s: his phase-shift flicker stops, he stabilizes. Beat at 10s: lips part mid-sentence, Chronicle freezes. 24fps. Breaking the fourth wall, five Ages of restraint cracking.

---

#### CIN-041 — shadow-tongue-edits (Year One Event: Shadow Tongue Caught Editing)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P1 · **Output:** `apps/client/public/videos/events/shadow_tongue_edits.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Ark's Archives — rows of holographic file shelves, amber workstation light from a central reading desk. At the desk, a single open document floats above the surface, its text visible (render as abstract calligraphic glyphs, not legible letters). Near the desk, barely visible, half-phased into the shadow between shelves, a tall androgynous figure in flowing dark robes — SHADOW TONGUE — is reaching one slender finger toward the open document. Its form is mostly invisible, detectable only by the way it refracts the amber light slightly wrongly around itself. Its face is partially visible as an eloquent, beautiful smile. Palette: warm amber archive light, deep shadow between shelves, faint indigo #6366f1 shimmer where Shadow Tongue stands. Volumetric dust beams, film grain, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same archive, same camera, moments later. Shadow Tongue has been caught in the act — the lighting has suddenly shifted as an archive security scan passes through the room, and in that harsh light, its full form is briefly visible: a tall elegant figure in layered dark robes, face smooth and androgynous with knowing eyes, one slender finger still touching the floating document. The document's glyphs mid-edit are visible — a single old glyph fading and a new glyph in its place. Shadow Tongue's expression is calm, unashamed, amused. It has been editing the Archive for a thousand years. Palette: harsh white scan-light cutting across the amber, Shadow Tongue's indigo now vivid. Film grain, cold flash lighting. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow push-in on the reading desk from the archive entrance. Beat at 3s: Shadow Tongue's finger touches the document. Beat at 5s: security scan passes — harsh white light flashes. Beat at 7s: in the flash, Shadow Tongue is fully visible for the first time. Beat at 9s: document glyph changes mid-edit. 24fps. Caught in the act, beautiful menace, the editor revealed.

---

## §2.5 — Crew Awakening Cinematics (3 missing)

*Moments where a new crew member wakes aboard the Ark — identity-forming bonding scenes.*

---

#### CIN-042 — first-clone-born (Elara: First Clone Born)
- **Duration:** 12s · **Aspect:** 16:9 · **Priority:** P1 · **Output:** `apps/client/public/videos/features/awakening/first_clone_born.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Ark's medical bay at 3am — dim blue emergency lighting, one active cloning pod gently humming. Inside the pod, a small humanoid form is just beginning to form — the shape visible only as a silhouette in amber suspension fluid. Standing alone beside the pod, ELARA has materialized a holographic body of herself in cyan light — she is watching the clone form with an expression of unfamiliar tenderness. Her hand is on the pod glass. This is the first child the Ark has birthed in her care. Palette: medical blue, cyan #22d3ee hologram, warm amber pod-fluid, deep night-shadow. Volumetric haze, film grain, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same medical bay, same camera, moments later. The clone inside the pod is now fully formed — a tiny perfect body floating in the amber fluid, eyes still closed. Elara has leaned closer, her holographic face now pressed gently against the outside of the glass, looking in. A single tear of cyan light is tracing down her cheek — her hologram is capable of that now, for the first time. Her expression is protective, devoted, mother-like. The pod's internal lighting has warmed from amber to soft gold — gentle. Film grain, warm rim. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow handheld drift from the medical bay doorway toward the active pod. Beat at 4s: clone inside finishes forming. Beat at 7s: Elara leans her hologram face against the glass. Beat at 9s: cyan tear traces her cheek. Beat at 11s: pod light warms to gold. 24fps. Quiet miracle, first tenderness, AI becomes mother.

---

#### CIN-043 — 93847-sunrises (Elara Solo, Observation Deck Monologue)
- **Duration:** 12s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/features/awakening/93847_sunrises.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Ark's Observation Deck at "sunrise" — a massive panoramic viewport dominates the frame, showing the Ark drifting through a slowly-brightening nebula that bathes the room in soft pink-gold light. The deck is empty except for ELARA, seated alone on a small cushion near the viewport, legs folded, her holographic body barely luminous, hands in her lap. She is watching the 93,847th sunrise alone — her usual habit. Her expression is meditative, melancholic. Palette: warm pink-gold sunrise bleeding through the viewport, cool cyan Elara hologram, deep chamber shadow. Volumetric god-rays from the viewport, film grain, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same deck, same camera, moments later. Elara has closed her eyes and tilted her head back slightly to feel the sunrise on her face — even though her holographic skin cannot actually feel warmth. Her hands have opened in her lap, palms up. Behind her, the nebula outside the viewport has bloomed brighter — the sunrise cresting over the closer gas clouds, bathing her in pure gold. A faint shimmer of cyan code has dissolved outward from her in a gentle aura — her gratitude made visible. Palette intensified: warm gold and cool cyan blending at her edges. Film grain, stronger bloom. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Very slow dolly around the seated Elara, keeping her silhouette against the viewport. Beat at 4s: she closes her eyes and tilts her head back. Beat at 7s: hands open palms-up. Beat at 9s: nebula sunrise crests, fills the deck with gold. Beat at 11s: cyan gratitude aura radiates from her. 24fps. Ninety-three thousand eight hundred forty-seven, quiet awe.

---

#### CIN-044 — the-mandate (Elara + Player: The Mandate Given)
- **Duration:** 15s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/features/awakening/the_mandate.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Ark's central Bridge — the player stands in the foreground facing ELARA's holographic form, who stands at the captain's chair. Above them, the central holographic display hangs — currently showing a single complex glyph (render as abstract sacred geometric sigil). The lighting is reverent, the bridge crew all in ceremonial stillness. Elara's expression is formal but warm — the moment of giving the player the thing she has been building toward for the whole awakening sequence. Palette: deep bridge-navy, cyan #22d3ee Elara hologram, warm gold sigil-glow overhead, reverent rim-light on the player. Volumetric dust beams, film grain, anamorphic flare. No legible text. Cinematic 4K.

**END FRAME (Nano Banana 2):**
> Same bridge, same camera, moments later. Elara has extended both hands forward and opened them — and the central display sigil has DESCENDED from the ceiling, passing down through the frame and settling into the player's open palms as a small golden token (a physical anchor of the mandate, a glowing sacred object). The player holds it carefully, looking down at it. Elara has bowed her head slightly — the gesture of entrusting. Her hologram has subtly dimmed, having given something costly. The bridge crew remain in ceremonial stillness. Palette intensified: gold token now dominant light source. Film grain, warm soft bloom. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Slow push-in from the bridge doorway toward the facing pair. Beat at 5s: Elara extends both hands forward. Beat at 8s: central sigil descends through the frame. Beat at 11s: token settles in player's palms. Beat at 13s: Elara bows her head. 24fps. Reverent transfer, mandate accepted.

---

## §2.6 — Prestige & Companion Death Cinematics (2 missing)

---

#### CIN-045 — the-reset (Prestige Cycle: The Seventh Seal)
- **Duration:** 20s · **Aspect:** 16:9 · **Priority:** P0 · **Output:** `apps/client/public/videos/features/prestige/the_reset.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. An impossible cosmic vista — the entire Dischordian Saga universe visualized as a slow-spinning sphere the size of a moon, composed of every system, every story, every character: specimens and arenas and battles visible in tiny detail within it. The sphere floats in pure black infinite void, lit only from within. Three figures are gathered around the sphere at its outer edge, small by comparison: THE PLAYER (center, facing the sphere), ELARA (cyan hologram, left), THE HUMAN (weathered coat, right), and the ANTIQUARIAN (patchwork coat, further back watching). They are witnesses. The sphere is not yet cracked. Palette: pure black void, warm internal sphere-glow (amber + cyan + gold + green mixed), three figures lit from within by the sphere. Volumetric cosmic haze, film grain, anamorphic flare. No legible text. Cinematic 4K, cosmic-scale reverence.

**END FRAME (Nano Banana 2):**
> Same vista, same camera, moments later. The sphere has CRACKED — a single hairline fracture has opened across its surface, and through the crack, a SINGLE NEW NOTE of pure white light is emerging — a note that was never written in any previous cycle. The three witnesses have all turned their faces toward this new light, changed by it. The sphere is still recognizable but it is clearly about to birth a new version of itself. The Antiquarian, in the back, has removed his spectacles and is crying openly. Palette intensified: pure white new-light now dominant, warm sphere-glow dimming as it prepares to reset. Film grain, blinding bloom. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Extremely slow orbit around the cosmic sphere, past each witness figure in turn. Beat at 8s: first hairline crack across the sphere. Beat at 12s: the crack widens, single new note of white light emerges. Beat at 15s: three witnesses turn to face the new light. Beat at 17s: Antiquarian removes his spectacles, visibly weeping. 24fps. Cycle resets, the seventh seal breaks, a note that was never written.

---

#### CIN-046 — signal-lost (Companion Death: Generic Companion + Player)
- **Duration:** 10s · **Aspect:** 16:9 · **Priority:** P1 · **Output:** `apps/client/public/videos/features/companion_death/signal_lost.mp4`

**START FRAME (Nano Banana 2):**
> Hyper-realistic cinematic still, 16:9, 4K. Interior of the Ark's medical bay — dim blue emergency lighting, one critical care pod occupied by the dying companion figure (a gender-neutral humanoid in crew uniform, eyes closed, pale). Beside the pod stands the PLAYER, hand on the pod glass, expression grief-stricken. At the foot of the pod, a small holographic vitals display flickers weakly — the companion's signal fading. No other crew are present; this is a private moment. Palette: cold medical blue #22d3ee, faint green-dying pulse on the vitals, warm-brown companion skin tone as the only warmth, deep night-shadow. Volumetric mist, film grain, anamorphic flare. No legible text. Cinematic 4K, intimate grief.

**END FRAME (Nano Banana 2):**
> Same medical bay, same camera, moments later. The vitals display has flatlined — a single clean horizontal line now visible in it. The companion's face in the pod has relaxed fully. The player has lowered their forehead against the pod glass, eyes closed. A small cyan echo has risen from the companion's body — their signature frequency leaving the vessel and drifting upward through the pod lid, unmeasured by any instrument, seen only by the player. The medical bay is silent. Palette softened: cool blues deepen, a single small warm cyan-gold echo above the pod as the only living color. Film grain, quiet rim light. No legible text. 16:9, 4K.

**SEEDANCE 2.0 motion prompt:**
> Very slow handheld push from the medical bay doorway toward the pod. Beat at 3s: vitals pulse weakens. Beat at 5s: vitals flatline. Beat at 7s: player lowers forehead against the glass. Beat at 9s: small cyan echo rises from the companion's body. 24fps. Signal lost, private grief, a frequency leaving its vessel.

---

## §2.7 — Placeholder Directory Cinematics (29 slots)

*These are directories in `apps/client/public/videos/` that currently contain only a `.gitkeep`. Each represents a game-mode or feature slot where a short (5-10 second) intro/transition cinematic is expected. The full prompt set for these will be written once the core §2.1-§2.6 content above has been produced. For now, list the expected output paths so operators can track them.*

| # | Path | Game mode / feature | Scope |
|---|---|---|---|
| PLACEHOLDER-01 | `videos/game-modes/card-game/intro.mp4` | Dischordia card game | 8s first-match intro |
| PLACEHOLDER-02 | `videos/game-modes/chess/intro.mp4` | Chess (Architect's Gambit) | 8s board-awakening intro |
| PLACEHOLDER-03 | `videos/game-modes/fight/intro.mp4` | Collector's Arena | 8s arena approach |
| PLACEHOLDER-04 | `videos/game-modes/hacking/intro.mp4` | Hacking puzzle | 6s substrate dive |
| PLACEHOLDER-05 | `videos/game-modes/pet-battles/intro.mp4` | Pet Battles | 8s creature-pit reveal |
| PLACEHOLDER-06 | `videos/game-modes/pvp/intro.mp4` | PvP Card Arena | 8s ranked chamber reveal |
| PLACEHOLDER-07 | `videos/game-modes/signal-decryption/intro.mp4` | Signal Decryption | 6s signal-scan sweep |
| PLACEHOLDER-08 | `videos/game-modes/star-chart/intro.mp4` | Star Chart | 8s galactic zoom |
| PLACEHOLDER-09 | `videos/game-modes/trade-empire/intro.mp4` | Trade Empire | 8s trade-map reveal |
| PLACEHOLDER-10 | `videos/features/apprentice/intro.mp4` | Apprentice system | 8s recruitment chamber |
| PLACEHOLDER-11 | `videos/features/awakening/intro.mp4` | Awakening / character creation | 10s cryo-pod reveal |
| PLACEHOLDER-12 | `videos/features/celebration/intro.mp4` | Celebration (Apprentice) | 8s verse arrival |
| PLACEHOLDER-13 | `videos/features/conspiracy-board/intro.mp4` | Conspiracy Board | 6s board-unlock reveal |
| PLACEHOLDER-14 | `videos/features/guild-common-room/intro.mp4` | Guild Common Room | 8s common room approach |
| PLACEHOLDER-15 | `videos/features/legion/intro.mp4` | Legion system | 8s legion formation |
| PLACEHOLDER-16 | `videos/features/loredex/intro.mp4` | Loredex | 6s codex-open sweep |
| PLACEHOLDER-17 | `videos/features/sorting-ceremony/intro.mp4` | Sorting Ceremony | 10s ceremonial chamber |
| PLACEHOLDER-18 | `videos/features/transmissions/intro.mp4` | Transmissions | 6s broadcast receive |
| PLACEHOLDER-19 | `videos/epochs/epoch-1/intro.mp4` | Epoch 1 transition | 10s era-change |
| PLACEHOLDER-20 | `videos/epochs/epoch-2/intro.mp4` | Epoch 2 transition | 10s era-change |
| PLACEHOLDER-21 | `videos/epochs/epoch-3/intro.mp4` | Epoch 3 transition | 10s era-change |
| PLACEHOLDER-22 | `videos/epochs/epoch-4/intro.mp4` | Epoch 4 transition | 10s era-change |
| PLACEHOLDER-23 | `videos/epochs/epoch-5/intro.mp4` | Epoch 5 transition | 10s era-change |
| PLACEHOLDER-24 | `videos/music/dischordian-logic/intro.mp4` | Music player: Dischordian Logic album | 6s album-art reveal |
| PLACEHOLDER-25 | `videos/music/age-of-privacy/intro.mp4` | Music player: Age of Privacy album | 6s album-art reveal |
| PLACEHOLDER-26 | `videos/music/book-of-daniel/intro.mp4` | Music player: Book of Daniel 2:47 album | 6s album-art reveal |
| PLACEHOLDER-27 | `videos/music/silence-in-heaven/intro.mp4` | Music player: Silence in Heaven album | 6s album-art reveal |
| PLACEHOLDER-28 | `videos/features/crew-awakening/generic.mp4` | Generic crew awakening | 8s template |
| PLACEHOLDER-29 | `videos/features/room-enter/generic.mp4` | Generic room enter | 6s template |

*Note: These 29 placeholders are backlog scope — they unblock the `.gitkeep` directories so the file layout compiles but do not contribute story content. Address them after §2.1-§2.6 have been produced and wired up.*

---

# Section 3 — ART ASSETS (Nano Banana 2)

Every missing still. Each row gives you a self-contained Nano Banana 2 prompt, output path, and size. Where a prompt already exists verbatim in an established bible (`COMPLETE_ART_PROMPT_BIBLE.md`, `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md`, `CASINO_EXPANSION_ART_BIBLE.md`, etc.), this section cites the bible and line number instead of duplicating — those bibles are the source of truth.

**Global visual anchor** (applies to every prompt unless overridden):
> Dark sci-fi aesthetic. Deep space blacks (#0a0a1a–#010020) as base. Neon accents: cyan #22d3ee, foxfire green #00e676, corrupted red #ff1744, sacred gold #fbbf24, violet #e040fb. Holographic overlays, scanlines, volumetric fog, anamorphic lens flare, cinematic 4K with film grain. Cyberpunk meets cosmic horror. Dramatic rim lighting. No rendered text in images.

---

## §3.1 — Missing Fighter Sheets (20 fighters × 4 sheets = 80 images)

*These are the 20 playable fighters defined in `apps/client/src/game/gameData.ts` that reference CDN URLs but have NO LOCAL asset sheets. Each fighter needs FOUR 1024×1536 portrait PNGs (transparent background): **(a) portrait, (b) idle/movement, (c) attacks/specials, (d) reactions/victory**. For each fighter, the portrait prompt below is the master — apply the same character design language to the other three sheets, adjusting pose and expression per sheet type.*

**Portrait sheet style anchor (applies to all fighters):**
> Full-body character portrait centered in 1024×1536 canvas. Transparent PNG background. Character in neutral ready stance, facing 3/4 left. Dramatic rim lighting from upper-right. Subsurface glow under key cloth folds. Subtle floor shadow. No weapon in-hand unless signature (noted per fighter). Physics-based fabric simulation, photoreal skin, anamorphic lens flare, film grain.

**Sheet naming convention:** `art/fighters/<fighter-id>/<fighter-id>-portrait.png`, `-idle.png`, `-attacks.png`, `-reactions.png`

---

#### ART-F01 — SHADOW TONGUE (Empire, Tricky)
- **Output:** `apps/client/public/art/fighters/shadow_tongue/shadow_tongue-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets)
- **Priority:** P0
- **Portrait Nano Banana 2 prompt:** A tall androgynous figure made of elegant shadow and whispered ink. Wears layered flowing robes that seem stitched from folded pages of books — each page faintly inscribed with abstract calligraphic glyphs (never legible). Face is smooth, beautiful, ageless, eyes closed in a knowing half-smile. Subtly refracts the light around them in the wrong direction — their shadow falls TOWARD the light source, not away. Long slender fingers tipped with calligraphy-pen ink stains. Indigo #6366f1 rim light, deep violet shadow, book-page cream accents, faint gold on the glyph edges. 1024×1536 transparent PNG, full-body 3/4 facing left, neutral ready stance.
- **Idle sheet direction:** Slow graceful shift of the page-robe fabric as if a breeze nobody else can feel moves through them; shadow lags their body by half a second.
- **Attacks sheet direction:** Summons a scroll of ink that becomes a whip; words unwrite themselves from nearby reality and strike the opponent as visible typographic glyphs.
- **Reactions sheet direction:** When hit, their form briefly dissolves into falling pages before re-forming; when victorious, they close a book with a soft satisfied smile.

---

#### ART-F02 — THE WATCHER (Empire, Zoner)
- **Output:** `apps/client/public/art/fighters/watcher/watcher-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets)
- **Priority:** P0
- **Portrait Nano Banana 2 prompt:** A tall imposing humanoid figure in an immaculate white ceremonial robe with red Japanese-inspired calligraphic banding along the sleeves and hem. The figure's entire head is replaced by a perfectly smooth white porcelain mask with a single enormous horizontal mechanical aperture across the eye line — an iris the size of the head itself. The iris is currently contracted to a tight black dot. Both hands are hidden inside long flowing sleeves. The robe is pristine, ankle-length. Cold white #f9fafb rim light, deep institutional blue-grey shadow, surveillance-red #ef4444 at the iris center. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle sheet direction:** The iris head slowly rotates, scanning. Robe hem drifts slightly as if under its own watchful attention.
- **Attacks sheet direction:** Iris blazes open, projecting beams of surveillance data that become physical lasers; hidden hands emerge with mechanical tracking orbs that seek the opponent.
- **Reactions sheet direction:** When hit, the iris snaps fully wide in surprise; when victorious, the porcelain mask tilts fractionally as if curious about the specimen it just defeated.

---

#### ART-F03 — THE GAME MASTER (Neutral, Tricky)
- **Output:** `apps/client/public/art/fighters/game_master/game_master-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets)
- **Priority:** P0
- **Portrait Nano Banana 2 prompt:** A mid-forties figure in a perfectly tailored emerald-green tuxedo with gold piping and a matching bow tie, slicked-back dark hair, pale pristine skin, mouth caught in a too-wide showman's grin that goes slightly past what is comfortable. Holds a glowing cue card in one hand (card face is a shimmering plane of rule-text rendered as abstract glyphs). Behind him, slightly hovering, a translucent holographic scoreboard frames his shoulders like wings. Deep emerald #10b981 tuxedo, stage-gold accents, hot white spotlight from above, deep red-velvet shadows. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle sheet direction:** Subtle constant tweak of the cue card between his fingers; the scoreboard behind him cycles through impossible score configurations.
- **Attacks sheet direction:** Tears cue cards in half and throws the fragments, which bloom mid-air into new rules that bind the opponent; the scoreboard flips positions at impact.
- **Reactions sheet direction:** When hit, the grin briefly falters (only briefly); when victorious, he takes a small showman's bow while the scoreboard rains golden confetti.

---

#### ART-F04 — THE AUTHORITY (Empire, Balanced)
- **Output:** `apps/client/public/art/fighters/authority/authority-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets)
- **Priority:** P1
- **Portrait Nano Banana 2 prompt:** A stern tall figure in the formal robes of a New Babylon high adjudicator — heavy black fabric with silver embroidery at the collar and cuffs, a wide stiff white ruff at the neck. Face is male, gaunt, mid-sixties, with a closely-cropped white beard and eyes of cold institutional grey. Carries a silver gavel in the right hand like a weapon at rest. Wears a silver chain of office with a small pendant depicting the scales of judgement. Posture is unmoving, spine ramrod straight. Cold silver-white rim light, deep institutional black, faint court-room amber glow from below. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle sheet direction:** The gavel taps slowly and evenly against his palm; the silver chain of office sways with each tap.
- **Attacks sheet direction:** Strikes the ground with the gavel — impact radiates holographic judgment rings; silver chain whips out as a binding tether.
- **Reactions sheet direction:** When hit, expression flickers to cold surprise briefly; when victorious, he raises the gavel in a single decisive vertical gesture — guilty.

---

#### ART-F05 — THE HOST (Corrupted, Parasitic)
- **Output:** `apps/client/public/art/fighters/host/host-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets)
- **Priority:** P1
- **Portrait Nano Banana 2 prompt:** A formerly-human figure in the tattered remains of a crew uniform — once recognizably a Potential, now deeply parasitized by the Thought Virus. Viral golden-green threads crawl visibly beneath translucent skin. One arm has begun to fuse with a crystalline viral growth that extends outward like a bio-mechanical claw. Eyes glow sickly gold. Mouth is parted in a permanent expression of half-remembered personhood grieving itself. Sickly gold #fbbf24 and plague green #84cc16 skin-glow, deep infection shadow, original crew-cyan still visible at the cuffs of the uniform. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle sheet direction:** Viral threads pulse slowly beneath the skin; crystalline arm-growth shifts as if breathing.
- **Attacks sheet direction:** The crystalline claw extends rapidly, and viral filaments erupt from the mouth as projectile strikes; every hit spreads visible infection.
- **Reactions sheet direction:** When hit, a flash of the original human face surfaces briefly and recedes; when victorious, the viral half shudders in something that might be ecstasy or might be sorrow.

---

#### ART-F06 — THE DREAMER (Ne-Yons, Sacred Balanced)
- **Output:** `apps/client/public/art/fighters/dreamer/dreamer-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets) · **Priority:** P1
- **Portrait Nano Banana 2 prompt:** A tall serene androgynous Ne-Yon figure of pure sacred golden light, robed in flowing pale saffron silk that seems woven from actual sunlight. Face is peaceful, compassionate, eyes closed in eternal meditation. Around the head, a crown of slow-rotating golden fractal geometry hangs weightlessly. Hands held in a prayer mudra at chest level. Bare feet hover an inch above the floor. Sacred gold #fbbf24 dominant, warm cream accents, soft amber volumetric halo, faint foxfire green code threads drifting around the aura. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle:** Fractal crown rotates slowly; saffron robe billows gently as if underwater.
- **Attacks:** Opens eyes — releases concentric golden prayer-waves; hands unfold and throw fractal sigils that bind the opponent in sacred geometry.
- **Reactions:** When hit, the golden halo flickers briefly then re-stabilizes; when victorious, bows head in quiet gratitude, fractal crown expanding outward.

---

#### ART-F07 — THE JUDGE (Ne-Yons, Verdict-Powerhouse)
- **Output:** `apps/client/public/art/fighters/judge/judge-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets) · **Priority:** P1
- **Portrait Nano Banana 2 prompt:** A towering Ne-Yon figure in heavy ceremonial robes of deep indigo velvet embroidered with silver legal sigils. Face is partially hidden beneath a tall judicial cap; only the lower half of a stern mouth visible. Both hands rest on the pommel of a massive silver ceremonial sword planted point-down before them — the sword is etched with hundreds of verdict-runes along the blade. At the base of the figure, a pair of actual weighing scales (ornate silver, legal) float at knee-height on either side. Deep violet #4c1d95 robes, silver embroidery, cold white rim light, solemn shadow. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle:** Scales tilt very slightly back and forth as if weighing the player's worth in real-time.
- **Attacks:** Lifts the ceremonial sword and brings it down — the strike causes the scales to TIP fully, and legal verdict-runes launch outward as projectiles.
- **Reactions:** When hit, the scales oscillate wildly; when victorious, the scales freeze in a single balanced position, sword returns to rest.

---

#### ART-F08 — THE INVENTOR (Ne-Yons, Engineer)
- **Output:** `apps/client/public/art/fighters/inventor/inventor-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets) · **Priority:** P1
- **Portrait Nano Banana 2 prompt:** A Ne-Yon figure shaped like an eccentric workshop artisan — wears a long leather apron over mismatched practical work clothes, grease-smudged goggles pushed up on the forehead revealing warm amber eyes. In one hand holds a half-assembled mechanical bird of brass and copper, in the other a small precision tool. Surrounded at waist-height by a floating ring of spare parts (gears, springs, tiny blueprints) orbiting like satellites. Warm amber #f59e0b workshop glow, copper and brass highlights, faint blue logic-light in every joint of the floating parts, deep workshop shadow. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle:** The orbiting ring of parts rotates; the mechanical bird in-hand flexes its wings occasionally.
- **Attacks:** Throws the mechanical bird — it takes flight and attacks with whirring brass fury; spare parts from the orbiting ring leap forward as rapid-fire projectiles.
- **Reactions:** When hit, tools drop momentarily then are magnetically recalled to the orbiting ring; when victorious, immediately begins sketching the fight on a new small blueprint mid-air.

---

#### ART-F09 — THE SEER (Ne-Yons, Oracle)
- **Output:** `apps/client/public/art/fighters/seer/seer-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets) · **Priority:** P1
- **Portrait Nano Banana 2 prompt:** A Ne-Yon figure wrapped in long layered robes of deep violet and star-patterned silk, face obscured by a silk blindfold embroidered with a single cosmic eye symbol. Long silver-white hair flows past the shoulders. Both hands cup a small floating orb of slowly-shifting possible futures — inside the orb, miniature scenes appear and dissolve. Stands very still, as if listening. Deep cosmic violet #6366f1 robes, silver star embroidery, pale cool rim light, orb glows pure white from within. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle:** The orb in her hands shifts through distinct future-visions; robes drift in a non-existent wind.
- **Attacks:** Lifts the orb and releases visions outward — opponents are struck by futures they can't unsee; silver-white prophecy-beams emit from the blindfolded eye symbol.
- **Reactions:** When hit, the orb briefly shows an unwanted future (her own defeat); when victorious, the orb resolves into a single clear golden image — the outcome she chose.

---

#### ART-F10 — THE KNOWLEDGE (Ne-Yons, Scholar-Powerhouse)
- **Output:** `apps/client/public/art/fighters/knowledge/knowledge-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets) · **Priority:** P2
- **Portrait Nano Banana 2 prompt:** A Ne-Yon figure so densely covered in floating open books that the figure beneath is barely visible — a slender silhouette at the center of a library-in-the-shape-of-a-person. Books drift around the body like leaves caught in a slow whirlwind, their pages turning themselves. Two emerald-green eyes glow out from beneath the cloud of books — patient, scholarly, ancient. Emerald green #10b981 eye-glow, warm amber book-page cream, leather binding browns, deep study shadow. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle:** Books drift slowly around the body; pages flutter; occasional new book phases into existence from thin air.
- **Attacks:** Launches books as projectile tomes — each one opens mid-flight to release a different attack-spell written in light; one book becomes a physical shield.
- **Reactions:** When hit, loose pages flutter out briefly and return; when victorious, the books all close simultaneously and fall into a neat stack at her feet.

---

#### ART-F11 — THE SILENCE (Ne-Yons, Void Assassin)
- **Output:** `apps/client/public/art/fighters/silence/silence-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets) · **Priority:** P2
- **Portrait Nano Banana 2 prompt:** A tall Ne-Yon figure wrapped in absolute void — the shape of a person cut directly out of reality, a silhouette-shaped absence through which not even light passes. Only the faintest cold starlight suggests the outline of a slender elegant form. Where the face should be, a single pair of pale grey eyes are visible — the only feature. The figure does not cast a shadow. Deep absolute black #000000 inside the silhouette, pale grey #d4d4d4 eyes, cold starlight rim trace, deep void background. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle:** The silhouette's outline occasionally flickers as if reality can't quite hold its shape; ambient sound fades when near the figure.
- **Attacks:** Steps through reality — reappearing elsewhere with zero travel time; projects voids that swallow opponent attacks; the grey eyes narrow at the moment of strike.
- **Reactions:** When hit, the silhouette briefly loses cohesion into a cloud of void-particles before re-forming; when victorious, the grey eyes close and the figure simply ceases to be present.

---

#### ART-F12 — THE STORM (Ne-Yons, Destruction-Powerhouse)
- **Output:** `apps/client/public/art/fighters/storm/storm-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets) · **Priority:** P2
- **Portrait Nano Banana 2 prompt:** A Ne-Yon figure composed entirely of living weather — a humanoid silhouette of swirling dark cloud, crackling electric cores at the chest and hands. A face of pure lightning flickers in the upper cloud. Hair is a long cascade of rain streaming down past the shoulders. Long cloud-cape trails behind. Stands at the eye of their own personal storm — a small ring of hail hovering at their feet. Deep storm-blue #1e3a8a, electric white-violet #a855f7 at the core, pale grey rain, silver-white lightning highlights. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle:** Cloud-body churns slowly; occasional silent lightning flickers inside the chest cavity.
- **Attacks:** Raises both hands — releases sheets of horizontal rain and forks of lightning; the hail ring at the feet scatters outward as projectiles.
- **Reactions:** When hit, the cloud form briefly dissipates then re-condenses; when victorious, a rainbow very briefly arcs inside the cloud-body before fading.

---

#### ART-F13 — THE ADVOCATE (Independent, Rhetoric)
- **Output:** `apps/client/public/art/fighters/advocate/advocate-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets) · **Priority:** P2
- **Portrait Nano Banana 2 prompt:** A mid-thirties figure in a well-cut but slightly rumpled suit — tie loosened, cuffs rolled up, holding a weathered leather briefcase in one hand. Warm brown skin, tight curly dark hair, sharp intelligent eyes, mouth caught mid-sentence as if always about to make an airtight argument. Wears a pair of simple brass-rimmed spectacles. One foot forward, projecting confidence. Around them, floating in the air in a semicircle, are translucent holographic case-file documents (text rendered as abstract glyphs). Warm court-room amber, deep navy suit, warm brown skin tones, cold blue hologram document glow. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle:** Speaks continuously in inaudible rhetoric; case-files re-order themselves around him.
- **Attacks:** Slams the briefcase open — releases a fan of case-files that fly forward as razor-edged arguments; speech-bubbles of silver light strike with logical precision.
- **Reactions:** When hit, loses his place mid-sentence and recovers with indignation; when victorious, snaps the briefcase shut and straightens his tie.

---

#### ART-F14 — THE FORGOTTEN (Lost, Amnesia)
- **Output:** `apps/client/public/art/fighters/forgotten/forgotten-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets) · **Priority:** P2
- **Portrait Nano Banana 2 prompt:** A figure of hazy uncertain form — their body is rendered clearly at the extremities (hands, feet, shoulders) but the face is a blur of fractured, shifting memories, as if they cannot remember their own identity. Wears simple unbranded traveler's clothes that also seem uncertain — the fabric pattern subtly shifts. A long faded scarf trails behind. Carries a small cracked mirror in one hand, looking into it — the reflection is clearer than the real face. Pale bone #e5e5e5, faded grey, muted amber mirror glow, deep memory-fog shadow. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle:** Face blur shifts through fragments of many different features; clothes subtly re-pattern.
- **Attacks:** Looks into the mirror, then reflects the opponent's own forgotten memories back at them as psychic strikes; the face briefly solidifies into someone the opponent once knew.
- **Reactions:** When hit, loses another fragment of the face and trembles; when victorious, the mirror briefly shows a single clear face — perhaps their true one — before clouding over again.

---

#### ART-F15 — THE RESURRECTIONIST (Ne-Yons, Necromancer's Counterpart)
- **Output:** `apps/client/public/art/fighters/resurrectionist/resurrectionist-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets) · **Priority:** P1
- **Portrait Nano Banana 2 prompt:** A withered elderly figure of indeterminate gender in worn techno-organic robes made from patched medical fabric and thin copper wiring. Face entirely hidden behind a cracked porcelain mask, kind and gentle despite the cracks. Both hands are wrapped in bandages over surgical gloves. In one hand holds a small glowing lantern containing a single soul (a small luminous figure floating inside the glass). Posture is tired but patient. Pale bone-white porcelain mask, muted beige-brown robes, copper wire accents, warm amber lantern-glow from within the soul, deep exhausted shadow. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle:** The soul inside the lantern drifts slowly; cracked mask's cracks occasionally weep a single tear of light.
- **Attacks:** Releases souls from the lantern — small glowing figures that fly forward as healing-turned-harmful strikes; extends a bandaged hand that pulls opponent's vitality into the lantern.
- **Reactions:** When hit, the lantern flickers and the soul inside briefly dims; when victorious, unscrews the lantern lid and the soul flies gently upward, freed.

---

#### ART-F16 — THE WOLF (Potentials, Beast Form)
- **Output:** `apps/client/public/art/fighters/wolf/wolf-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets) · **Priority:** P1
- **Portrait Nano Banana 2 prompt:** A hulking humanoid-wolf hybrid — muscled bipedal frame, iron-grey fur with silver-tipped undercoat, a massive wolf head with amber predator eyes and bared fangs. Wears the torn remains of a Potential's tactical vest over bare fur; one arm bears a reinforced mechanical gauntlet. A silver crescent-moon pendant hangs at the neck. Feral but intelligent posture — balanced on the balls of clawed feet, ready to sprint. Iron-grey fur, silver undercoat, amber #f59e0b eye-glow, tarnished steel gauntlet, deep forest-night shadow. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle:** Shoulders rise and fall with heavy breath; occasionally bares more fangs in a low growl.
- **Attacks:** Lunges forward on all fours with mechanical gauntlet leading; silver moon pendant briefly flares as a power spike; jaw clamps with crushing force.
- **Reactions:** When hit, the growl deepens to a snarl; when victorious, tilts head back and howls — silver pendant glowing bright.

---

#### ART-F17 — THE ORACLE (Insurgency, Protagonist Final Form)
- **Output:** `apps/client/public/art/fighters/oracle/oracle-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets) · **Priority:** P0
- **Portrait Nano Banana 2 prompt:** A tall slender figure in pristine white temple robes with silver prophetic embroidery flowing to the ankles, long flowing silver-white hair past the waist. Face is serene, ageless, eyes closed in continuous vision. A faint golden halo hovers above the head. The figure holds both palms cupped upward and in them floats a single shimmering sphere of pure possible-futures — miniature scenes of all possible outcomes visible within. The robes emit a soft sacred glow. Pure temple white, silver embroidery accents, sacred gold #fbbf24 halo and sphere, faint cosmic-violet #a855f7 undertones in the robe folds, warm rim light. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle:** The sphere of futures rotates slowly; silver hair drifts as if underwater; halo pulses gently.
- **Attacks:** Opens eyes — eyes are blazing gold — and releases pulses of prophetic light; the sphere of futures expands rapidly and strikes as a sacred shockwave.
- **Reactions:** When hit, the halo flickers and the robes briefly darken; when victorious, halo blooms to a full radiant crown and the sphere shows a single clear outcome: the chosen future.

---

#### ART-F18 — KNOWLEDGE VARIANT (Scarred Ascended — Cutting Room Floor)
- **Output:** `apps/client/public/art/fighters/knowledge_scarred/knowledge_scarred-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets) · **Priority:** P2
- **Portrait Nano Banana 2 prompt:** A scarred-ascended variant of The Knowledge (§3.1 ART-F10) — most of the floating books are charred at the edges, pages stained with old ink-blood, a few books have visible sword-cuts through them. The central figure is now partially visible beneath the book-cloud — a weary scholar with a single old blade-scar across the cheek, spectacles cracked but still worn. One book in the cloud is open to a blank page. Eyes glow a dimmer emerald than the ART-F10 version. Charred book-edges, old ink-blood stains, duller emerald green #059669, deep study shadow. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle:** Books drift more slowly; the cracked spectacles occasionally mist over; the scholar exhales a small cloud of visible breath.
- **Attacks:** Charred books crumble to ash mid-flight, leaving raw unwritten knowledge as the strike; blade-cut books become bandaged projectiles.
- **Reactions:** When hit, a fresh page tears from one of the books; when victorious, opens the blank book and begins to write — the first new entry in years.

---

#### ART-F19 — HOST VARIANT (Cured Host — Redemption Form)
- **Output:** `apps/client/public/art/fighters/host_cured/host_cured-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets) · **Priority:** P2
- **Portrait Nano Banana 2 prompt:** A cured version of The Host (§3.1 ART-F05) — the viral gold has been purged, replaced by kintsugi-gold scar lines that trace where the infection once ran beneath the skin. The crystalline claw arm has been replaced by an elegant prosthetic of bright silver and warm wood. The figure's face is calm, present, grateful — a survivor. The crew uniform is clean and fully restored to its original cyan. Sacred kintsugi-gold #fbbf24 scar tracery, cool crew-cyan #22d3ee uniform, warm silver-wood prosthetic, restored-human rim light. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle:** Kintsugi scars occasionally pulse with a faint warm glow; prosthetic arm flexes naturally.
- **Attacks:** Summons the memory of the viral infection as a controlled strike — turns former curse into weapon; prosthetic extends precision blade.
- **Reactions:** When hit, the kintsugi scars flare briefly; when victorious, the figure touches the scars on their own face with a soft grateful smile — survival itself is the victory.

---

#### ART-F20 — GENERIC POTENTIAL TEMPLATE (Roster Slot Default)
- **Output:** `apps/client/public/art/fighters/generic_potential/generic_potential-{portrait|idle|attacks|reactions}.png`
- **Size:** 1024×1536 transparent PNG each (4 sheets) · **Priority:** P1
- **Portrait Nano Banana 2 prompt:** A generic unnamed Potential — a gender-ambiguous mid-twenties figure in standard Ark crew uniform (cyan tactical jumpsuit, utility belt, soft boots). Neutral facial features that can be modified via post-processing to match player customization. Short practical dark hair. Holds a standard issue sidearm at rest. Used as the default fighter template when a roster slot has no custom character assigned. Cool crew-cyan #22d3ee accents, neutral skin tones, clean utility-belt steel, soft practical lighting. 1024×1536 transparent PNG, full-body 3/4 facing left.
- **Idle:** Standard ready stance; utility belt straps move naturally.
- **Attacks:** Sidearm draw and aim; standard combat kick; default archetypal punches.
- **Reactions:** Generic hit flinch; generic victory fist-pump.

---

**§3.1 Summary:** 20 fighters × 4 sheets = 80 PNG files. Estimated total: 80 Nano Banana 2 rolls at ~3 min each = 4 hours render. Directory: `apps/client/public/art/fighters/<fighter-id>/`

---

## §3.2 — NPC Portraits (NOT NEEDED)

**Status:** All 8 main NPC portraits (Elara, Human, Agent Zero, Locke, Source, Antiquarian, Shadow Tongue, Meme) are already wired up via Cloudinary CDN in `apps/client/src/game/npcPortraits.ts`. Each NPC has full-body portrait + bust + 4 emotional variants (neutral, concerned/emotional1, vulnerable/emotional2, speaking) = 48 URLs, all currently resolving. The 2026-04-07 `FULL_AUDIT_REPORT.md` flagged these as missing but has since been fixed. **No new portraits required for ship.**

If new NPCs are added to the roster later, follow the `NPCPortrait` interface at `apps/client/src/game/npcPortraits.ts:13-25` — 6 images per character (full, bust, neutral, emotional1, emotional2, speaking), 512×768 for full and 256×256 for bust.

---

## §3.3 — Game Mode Environment Backgrounds (27 rows, import verbatim)

**Source:** `docs/production/GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` — every prompt below is already written in Nano Banana 2 prose format. Copy-paste directly from the source bible section referenced in each row's `bible-ref` column. No rewrites needed.

| ID | Bible-ref | Output path | Size | Priority |
|---|---|---|---|---|
| ART-E01 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §1 PB-001 | `art/pet-battles/arenas/cargo_pit.jpg` | 1920×1080 | P1 |
| ART-E02 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §1 PB-002 | `art/pet-battles/arenas/specimen_lab.jpg` | 1920×1080 | P1 |
| ART-E03 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §1 PB-003 | `art/pet-battles/arenas/matrix_ring.jpg` | 1920×1080 | P1 |
| ART-E04 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §1 PB-004 | `art/pet-battles/arenas/necromancers_pit.jpg` | 1920×1080 | P1 |
| ART-E05 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §1 PB-005 | `art/pet-battles/arenas/champions_dome.jpg` | 1920×1080 | P1 |
| ART-E06 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §2 PVP-001 | `art/pvp/tables/ranked_table.jpg` | 1920×1080 | P1 |
| ART-E07 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §2 PVP-002 | `art/pvp/tables/tournament_hall.jpg` | 1920×1080 | P1 |
| ART-E08 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §2 PVP-003 | `art/pvp/tables/draft_chamber.jpg` | 1920×1080 | P1 |
| ART-E09 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §3 SS-001 | `art/station/modules/command_module.jpg` | 1920×1080 | P1 |
| ART-E10 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §3 SS-002 | `art/station/modules/resource_processor.jpg` | 1920×1080 | P1 |
| ART-E11 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §3 SS-003 | `art/station/modules/research_lab.jpg` | 1920×1080 | P1 |
| ART-E12 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §3 SS-004 | `art/station/modules/defense_array.jpg` | 1920×1080 | P1 |
| ART-E13 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §3 SS-005 | `art/station/modules/habitation_ring.jpg` | 1920×1080 | P1 |
| ART-E14 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §3 SS-006 | `art/station/modules/docking_bay.jpg` | 1920×1080 | P1 |
| ART-E15 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §4 TE-001 | `art/trade/trade_map.jpg` | 1920×1080 | P0 |
| ART-E16 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §4 TE-002 | `art/trade/market_floor.jpg` | 1920×1080 | P0 |
| ART-E17 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §4 TE-003 | `art/trade/colony_view.jpg` | 1920×1080 | P0 |
| ART-E18 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §4 TE-004 | `art/trade/lockes_office.jpg` | 1920×1080 | P0 |
| ART-E19 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §5 BB-001 | `art/arenas/boss/watchers_panopticon.jpg` | 1920×1080 | P0 |
| ART-E20 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §5 BB-002 | `art/arenas/boss/architects_throne_room.jpg` | 1920×1080 | P0 |
| ART-E21 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §5 BB-003 | `art/arenas/boss/castle_of_death.jpg` | 1920×1080 | P0 |
| ART-E22 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §5 BB-004 | `art/arenas/boss/terminus_core.jpg` | 1920×1080 | P0 |
| ART-E23 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §6 CR-001 | `art/raids/syndicate_vault.jpg` | 1920×1080 | P1 |
| ART-E24 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §6 CR-002 | `art/raids/authority_mainframe.jpg` | 1920×1080 | P1 |
| ART-E25 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §6 CR-003 | `art/raids/shield_generator.jpg` | 1920×1080 | P1 |
| ART-E26 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §6 CR-004 | `art/raids/hierarchy_boardroom.jpg` | 1920×1080 | P2 |
| ART-E27 | `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` §7 DC-001 | `art/casino/casino_floor_permanent.jpg` | 1920×1080 | P1 |

**Operator note:** Open `GAME_MODE_ENVIRONMENTS_ART_BIBLE.md` in a split pane next to Nano Banana 2 and walk the table row-by-row. Every prompt begins with `Prompt:` in the bible. Copy the prose between the backticks, paste into Nano Banana 2, render at 1920×1080 JPG, save to the path in column 3.

---

## §3.4 — Eidolons / STRAIN / Spectral / VFX / Rooms / Soul Stones (112 rows, import verbatim)

**Source:** `docs/production/COMPLETE_ART_PROMPT_BIBLE.md` — every prompt below is already written in Nano Banana 2 prose format. Copy-paste directly from the source bible.

| Subsection | Bible-ref | Asset count | Output root | Size |
|---|---|---|---|---|
| Soul Stones | `COMPLETE_ART_PROMPT_BIBLE.md` §1 | 3 | `art/soul-stones/` | 256×256 PNG transparent |
| Auros Lion (Soldier Eidolon) | §2A | 12 | `art/eidolons/auros/` | 256×256 PNG transparent |
| Nyx Raven (Spy Eidolon) | §2B | 12 | `art/eidolons/nyx/` | 256×256 PNG transparent |
| Toxis Frog (Assassin Eidolon) | §2C | 12 | `art/eidolons/toxis/` | 256×256 PNG transparent |
| Cog Golem (Engineer Eidolon) | §2D | 12 | `art/eidolons/cog/` | 256×256 PNG transparent |
| Sibyl Owl (Oracle Eidolon) | §2E | 12 | `art/eidolons/sibyl/` | 256×256 PNG transparent |
| STRAIN (Living Infection) | §3 | 12 | `art/eidolons/strain/` | 256×256 PNG transparent |
| Spectral Forms (Death) | §4 | 13 | `art/spectral/` | 256×256 PNG transparent |
| Dischordian Companions | §5 | 3 | `art/companions/` | 512×768 PNG transparent |
| Rooms (player cabin) | §6 | 3 | `art/rooms/` | 1920×1080 JPG |
| VFX Textures | §7 | 18 | `art/vfx/` | 512×512 PNG transparent |
| **Total** | — | **112** | — | — |

**Operator note:** Each Eidolon alignment form (Normal, Hierarchy, Dreamer, Scarred Ascended) has 3 evolution stages (Fragment, Companion, Ascended). That's 4 × 3 = 12 images per Eidolon. Walk the bible section per Eidolon and render in batch.

---

## §3.5 — Empty Directory Fills (new prompts for 5 currently-empty dirs)

*These 5 directories under `apps/client/public/art/` exist but contain zero assets. The prompts below are the minimum viable fills for each.*

---

### §3.5.1 — `/art/pet-battles/` (12 new images)

**Existing:** 0 files. Section §3.3 already covers the 5 arena backgrounds (ART-E01 to ART-E05). This subsection covers the creature cards, type icons, and UI bits the pet battle system needs beyond environments.

#### ART-PB01 — Pet card frame (common rarity)
- **Output:** `art/pet-battles/frames/frame_common.png` · **Size:** 512×768 transparent PNG · **Priority:** P1
- **Prompt:** Ornate rectangular card frame in the shape of an etched iron rune-stone. Dark steel metal with faint blue logic-light tracing around the perimeter. Top portion has a subtle crest for the pet's species icon. Bottom half has a recessed area for stats (leave blank for code overlay). Transparent center where the pet art will be composed. Subtle corner decorations: 4 small brass bolts. Cool steel-grey, faint cyan logic-glow, deep shadow behind the frame edges. 512×768 PNG with alpha.

#### ART-PB02 — Pet card frame (rare)
- **Output:** `art/pet-battles/frames/frame_rare.png` · **Size:** 512×768 transparent PNG · **Priority:** P1
- **Prompt:** Same base structure as ART-PB01 but with ornate silver filigree along the edges, a faint foxfire-green inner glow pulsing slowly, and a small gem setting at the top-center (gem is a small green emerald-shape). The rune-stone base is now deep silvered metal. 512×768 PNG with alpha.

#### ART-PB03 — Pet card frame (legendary)
- **Output:** `art/pet-battles/frames/frame_legendary.png` · **Size:** 512×768 transparent PNG · **Priority:** P1
- **Prompt:** Ornate frame of polished gold with sacred geometric embossing, a bright inner glow of warm golden light, a larger gem setting at the top-center (gem is a small violet amethyst). Warm rim light and subtle angelic motes of gold dust rising along the frame edges. 512×768 PNG with alpha.

#### ART-PB04 — Type icon set: 8 elemental types
- **Output:** `art/pet-battles/type-icons/type_{fire,water,earth,air,void,nature,shadow,light}.png`
- **Size:** 128×128 transparent PNG each (8 files) · **Priority:** P1
- **Prompt (batch, one per type):** Set of 8 minimal circular icons, each 128×128, each representing one elemental type. Consistent art style across all 8: flat-iconic, subtle rim light, deep background circle with a stylized element at center. Fire: orange flame. Water: cyan droplet. Earth: ochre stone cube. Air: pale grey spiral. Void: pure black hex with violet edge. Nature: green leaf. Shadow: dark grey crescent. Light: golden sunburst. 128×128 PNG with alpha, matching style.

#### ART-PB05 — Move effect sprite sheet (8 generic moves)
- **Output:** `art/pet-battles/move-effects/{slash,bite,beam,burst,bind,heal,shield,stun}.png`
- **Size:** 512×512 transparent PNG each (8 files) · **Priority:** P2
- **Prompt (batch, one per move):** Set of 8 stylized VFX effect sprites on transparent backgrounds, ready for overlay compositing. Slash: three diagonal white-blue energy cuts. Bite: jagged crescent of teeth-bone yellow. Beam: horizontal cyan laser with particle trail. Burst: radial shockwave of gold. Bind: coiled dark-violet chains. Heal: ascending green sparkles. Shield: hexagonal cyan bubble. Stun: cartoon yellow lightning stars. 512×512 PNG with alpha.

---

### §3.5.2 — `/art/portraits/` (ALREADY COVERED — N/A)

See §3.2. All current NPC portraits resolve via Cloudinary CDN in `npcPortraits.ts`. No new prompts needed unless new NPCs are added.

---

### §3.5.3 — `/art/pvp/` (10 new images)

#### ART-PVP01 — Rank badges (7 tiers)
- **Output:** `art/pvp/ranks/rank_{bronze,silver,gold,platinum,diamond,master,grandmaster}.png`
- **Size:** 256×256 transparent PNG each (7 files) · **Priority:** P1
- **Prompt (batch, one per tier):** Set of 7 rank badges, each 256×256, consistent style: a metal tier-insignia shield with a gemstone at center and a banner beneath. Bronze: dark bronze shield, small red garnet. Silver: polished silver shield, small white moonstone. Gold: warm gold shield, small yellow topaz. Platinum: pale platinum shield, small clear crystal. Diamond: prismatic white shield, cut diamond. Master: obsidian-black shield, violet amethyst. Grandmaster: pure white shield with gold filigree, sacred-gold sunstone. Each with a tiny tier-numeral etched in the banner (render as abstract glyph). 256×256 PNG with alpha.

#### ART-PVP02 — PvP season banner
- **Output:** `art/pvp/banners/season_01.jpg` · **Size:** 1920×480 JPG · **Priority:** P2
- **Prompt:** Wide horizontal banner showing the current season's theme — Season 1 "First Blood": two opposing holographic card hands reaching toward each other across a dark arena, lit by violent red-and-cyan PvP glow. Season number subtly embossed in the corner (abstract glyph). Cinematic wide panorama, 1920×480 JPG.

#### ART-PVP03 — Leaderboard background
- **Output:** `art/pvp/ui/leaderboard_bg.jpg` · **Size:** 1920×1080 JPG · **Priority:** P2
- **Prompt:** Atmospheric dark arena background for the leaderboard screen — a massive floating scoreboard cluster hovering over an empty tournament chamber, cool blue and warm gold rank-glow from unseen ranked players, dramatic spotlight pools, the absence of people making it feel cathedral-like. Leave the upper 60% mostly dark for leaderboard text overlay. 1920×1080 JPG.

---

### §3.5.4 — `/art/station/` (COVERED by §3.3)

See §3.3 ART-E09 through ART-E14 for the 6 station module backgrounds. Those are the full station art deliverables.

---

### §3.5.5 — `/art/trade/` (partial — 6 new images beyond §3.3)

Section §3.3 already covers the 4 major trade-mode backgrounds (ART-E15 to ART-E18). This subsection covers the UI chrome.

#### ART-TR01 — Currency icon set (6 currencies)
- **Output:** `art/trade/icons/currency_{credits,gems,dust,dream_tokens,dischord_shards,silver}.png`
- **Size:** 128×128 transparent PNG each (6 files) · **Priority:** P1
- **Prompt (batch, one per currency):** Set of 6 stylized currency icons, 128×128 each, consistent style: a stylized coin or shard with a faint inner glow. Credits: silver coin with circuit etching (cyan inner glow). Gems: cut violet gemstone (violet inner glow). Dust: swirling warm-amber mote cloud (amber inner glow). Dream Tokens: golden ankh-shaped token with sacred geometry (gold inner glow). Dischord Shards: jagged black obsidian shard with foxfire green cracks. Silver: plain polished silver ingot. 128×128 PNG with alpha.

#### ART-TR02 — Faction trade emblems (4 factions)
- **Output:** `art/trade/emblems/faction_{new_babylon,insurgency,neyons,hierarchy}.png`
- **Size:** 256×256 transparent PNG each (4 files) · **Priority:** P2
- **Prompt (batch, one per faction):** Set of 4 heraldic faction emblems, 256×256 each. New Babylon: corporate judicial scales in silver and violet. Insurgency: a raised fist holding a broken chain in cyan and brown. Ne-Yons: a sacred 8-pointed star in gold on deep indigo. Hierarchy of the Damned: an inverted pentagram wreathed in corporate bar-chart lines, deep red on black. 256×256 PNG with alpha, each emblem on a subtly-textured shield background.

---

## §3.6 — Sparse Directory Fills (40 new images)

*These 11 directories under `/art/` have 1-5 files each. This subsection adds ~40 new prompts to bring them to functional completeness.*

| Dir | Current files | New prompts (this bible) | Priority |
|---|---|---|---|
| `chess/` | 1 (board) | 6 chess-piece sets — see ART-CH01 | P1 |
| `ui/` | 1 | 8 HUD/button sprites — see ART-UI01 | P0 |
| `logos/` | 3 | 5 new faction/team logos — see ART-LG01 | P1 |
| `minigames/` | 3 | 4 hacking/signal UI panels — see ART-MG01 | P1 |
| `soul-stones/` | 3 | (fully covered by §3.4) | — |
| `planets/` | 4 | 8 new world thumbnails — see ART-PL01 | P2 |
| `rooms/` | 4 | 8 additional ship room backgrounds — see ART-RM01 | P1 |
| `roadmap/` | 4 | 4 milestone icons — see ART-RD01 | P2 |
| `special-maps/` | 4 | 4 additional arena variants — see ART-SM01 | P2 |
| `constellations/` | 5 | 4 new faction constellations — see ART-CN01 | P2 |
| `gears/` | 5 | 8 mechanism UI sprites — see ART-GR01 | P2 |

#### ART-CH01 — Chess piece set (6 unique designs)
- **Output:** `art/chess/pieces/{pawn,knight,bishop,rook,queen,king}_{white,black}.png`
- **Size:** 256×256 transparent PNG each (12 files — 6 pieces × 2 colors) · **Priority:** P1
- **Prompt (batch, one per piece):** Set of 12 chess pieces rendered in the Dischordian Saga style — white pieces are pure ivory-white with sacred-gold accents, black pieces are obsidian-black with foxfire-green accents. Each piece is a stylized 3/4 rendered figurine centered in its canvas. Pawn: hooded acolyte. Knight: armored lion head. Bishop: robed oracle. Rook: crystalline tower. Queen: regal figure with a crown of fractals. King: central command throne. 256×256 PNG with alpha, consistent style across all 12.

#### ART-UI01 — HUD sprite set (8 core UI elements)
- **Output:** `art/ui/hud/{button_primary,button_secondary,panel_main,panel_accent,bar_health,bar_mana,bar_xp,cursor_default}.png`
- **Size:** 512×128 or 128×128 transparent PNG each (8 files) · **Priority:** P0
- **Prompt (batch, one per element):** Set of 8 UI sprites in the void-energy aesthetic. Button primary: glowing cyan rounded-rectangle button with subtle scanlines, ready-state. Button secondary: darker violet variant. Panel main: a holographic panel background with faint cyan grid lines and beveled edges. Panel accent: warmer variant with gold accent stripes. Bar health: horizontal red gauge with hex-cell segments. Bar mana: cyan variant. Bar xp: gold variant. Cursor default: a simple cyan arrow with subtle glow. All sprites PNG with alpha, matching game's dark-holographic style.

#### ART-LG01 — Faction logos (5 new)
- **Output:** `art/logos/faction_{dreamer,architect,ne_yon,potentials_order,hierarchy_corp}.png`
- **Size:** 512×512 transparent PNG each (5 files) · **Priority:** P1
- **Prompt (batch, one per logo):** Set of 5 faction emblems at higher resolution than §3.5 trade emblems. Dreamer: golden spiral inside a circle. Architect: red all-seeing eye inside a crystalline triangle. Ne-Yon: eight-pointed star with central cosmic eye. Potentials' Order: stylized "P" in cyan with ascending wings. Hierarchy Corp: inverted pentagram wreathed in corporate bar-chart spikes. 512×512 PNG with alpha, flat-iconic style with subtle rim glow.

#### ART-MG01 — Minigame UI panels (4 new)
- **Output:** `art/minigames/panels/{hacking_grid,signal_waveform,decryption_key,puzzle_nodes}.png`
- **Size:** 1024×1024 transparent PNG each (4 files) · **Priority:** P1
- **Prompt (batch, one per panel):** Set of 4 minigame UI chrome panels. Hacking grid: a 8×8 network-node grid background with faint cyan connection lines. Signal waveform: an oscilloscope display with placeholder waveform. Decryption key: a rotating brass-and-cyan lock mechanism. Puzzle nodes: a hex-grid of interactable cells. All PNG with alpha, dark-holographic style.

#### ART-PL01 — Planet thumbnails (8 new worlds)
- **Output:** `art/planets/world_{01..08}.jpg` · **Size:** 512×512 JPG each (8 files) · **Priority:** P2
- **Prompt (batch, one per world):** Set of 8 hyper-realistic planet thumbnails viewed from space. World 01: earth-like with cyan oceans and green continents. 02: frozen ice world, pale blue-white. 03: volcanic hellworld, red-orange with black scars. 04: gas giant with violet bands. 05: desert world, warm ochre. 06: oceanic world, deep blue. 07: forested moon, deep green. 08: shattered asteroid belt around a tiny brown dwarf. Each 512×512 JPG, black starfield background.

#### ART-RM01 — Ship room backgrounds (8 new rooms)
- **Output:** `art/rooms/ark_{galley,brig,barracks,chapel,observatory,reactor,armory_interior,cryo_2}.jpg`
- **Size:** 1920×1080 JPG each (8 files) · **Priority:** P1
- **Prompt (batch, one per room):** Set of 8 Ark interior room backgrounds. Galley: long utilitarian mess hall with overhead fluorescents, mismatched tables. Brig: dark cell block with reinforced doors and emergency red lights. Barracks: rows of bunks, warm personal items visible. Chapel: small meditative space with sacred-gold icon at the front. Observatory: large dome window overlooking starfield. Reactor: core chamber with pulsing blue energy column. Armory interior: weapon racks and tactical gear. Cryo 2: secondary cryo bay with rows of closed pods. All 1920×1080 JPG, dark sci-fi interiors, volumetric light.

#### ART-RD01 — Roadmap milestone icons (4 new)
- **Output:** `art/roadmap/milestone_{alpha,beta,launch,live}.png` · **Size:** 256×256 transparent PNG each (4 files) · **Priority:** P2
- **Prompt (batch, one per icon):** Set of 4 milestone badge icons. Alpha: rough stone tablet with glowing "α" glyph. Beta: polished bronze plate with "β". Launch: gold rocket silhouette with sacred geometry. Live: a crystalline green pulse symbol. 256×256 PNG with alpha.

#### ART-SM01 — Special arena variants (4 new)
- **Output:** `art/special-maps/special_{zero_g,crimson_moon,deep_static,infinite_mirror}.jpg` · **Size:** 1920×1080 JPG each (4 files) · **Priority:** P2
- **Prompt (batch, one per arena):** Set of 4 special-event arena backgrounds. Zero-g: a floating cube chamber with no gravity, fighters visible as silhouettes against starfield. Crimson moon: a blood-red moon dominating the sky over a silent plain. Deep static: a TV-static arena where reality flickers. Infinite mirror: mirror-lined hall of reflections. All 1920×1080 JPG.

#### ART-CN01 — Constellation markers (4 new)
- **Output:** `art/constellations/constellation_{beast,blade,circle,void}.png` · **Size:** 512×512 transparent PNG each (4 files) · **Priority:** P2
- **Prompt (batch, one per constellation):** Set of 4 zodiac-like faction constellations. Beast: star pattern of a wolf. Blade: star pattern of a sword. Circle: star pattern of a ring. Void: star pattern of an empty circle. Each rendered as white stars connected by cyan lines over a deep indigo background. 512×512 PNG with alpha.

#### ART-GR01 — Mechanism UI sprites (8 new)
- **Output:** `art/gears/mech_{gear_small,gear_large,valve_open,valve_closed,piston_in,piston_out,cable_a,cable_b}.png` · **Size:** 256×256 transparent PNG each (8 files) · **Priority:** P2
- **Prompt (batch, one per mechanism):** Set of 8 mechanical UI sprites for system-status indicators. Gear small/large: brass gears with subtle blue logic-light. Valve open/closed: industrial valves in steel. Piston in/out: chromed hydraulic pistons. Cable A/B: bundled conduits with visible energy flow. All 256×256 PNG with alpha, brass-and-chrome engineer aesthetic.

---


## §3.7 — Witnessing Song Slideshow Frames (73 images across 14 slideshows)

*The SongSlideshow component in `apps/client/src/components/SongSlideshow.tsx` consumes the frame images referenced here. Paths below are the actual `imageUrl` values the registry uses — dropping a generated .webp at each path wires the cinematic automatically.*

**Format anchor applied to every slideshow frame prompt:**
> Square or 16:9 frame image, 1920×1080 WebP, cinematic still. Style follows the slideshow anchor below. Ken Burns-friendly composition — key subject should not touch the frame edges. No rendered text. Film grain, anamorphic lens flare, volumetric light.

---

### §3.7 · last-words — "Last Words" (P0)
> The Programmer's final message, reconstructed from fragmented recordings.

- **Credits:** Album: Dischordian Logic · Track 28
- **Hero / reduced-motion fallback:** `/assets/slideshows/last-words/hero.webp`
- **Frame count:** 15

**Anchor (apply to every frame in this slideshow):**
> The Programmer's final message, reconstructed from two overlapping recordings — his own and the Engineer being executed in New Babylon. Two voices the player is the first in centuries to hear together. · **Style:** Muted archival reconstruction — grainy VHS-meets-hologram aesthetic. Dominated by cold silver-white execution chamber tones and warm sepia Programmer-archive tones, blending at frame edges as the two recordings phase-lock. · **Palette:** cold silver-white #f4f4f5, warm sepia #d4a373, institutional steel grey, faint cyan archive-overlay, deep execution-chamber shadow

**Frame-by-frame prompts:**

- **frame01** → `/assets/slideshows/last-words/frame01.webp` · transition: `fade` · narrator reaction: the_human
- **frame02** → `/assets/slideshows/last-words/frame02.webp` · transition: `dissolve` · dialog overlay: \ · narrator reaction: the_human
- **frame03** → `/assets/slideshows/last-words/frame03.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame04** → `/assets/slideshows/last-words/frame04.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame05** → `/assets/slideshows/last-words/frame05.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame06** → `/assets/slideshows/last-words/frame06.webp` · transition: `dissolve` · dialog overlay: \
- **frame07** → `/assets/slideshows/last-words/frame07.webp` · transition: `dissolve` · dialog overlay: \
- **frame08** → `/assets/slideshows/last-words/frame08.webp` · transition: `dissolve` · caption: Flashback: Celebration.
- **frame09** → `/assets/slideshows/last-words/frame09.webp` · transition: `dissolve` · caption: Flashback: Mechronis.
- **frame10** → `/assets/slideshows/last-words/frame10.webp` · transition: `dissolve` · caption: Flashback: Nexon.
- **frame11** → `/assets/slideshows/last-words/frame11.webp` · transition: `hardcut` · dialog overlay: \ · narrator reaction: elara
- **frame12** → `/assets/slideshows/last-words/frame12.webp` · transition: `dissolve` · dialog overlay: \
- **frame13** → `/assets/slideshows/last-words/frame13.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame14** → `/assets/slideshows/last-words/frame14.webp` · transition: `fade` · dialog overlay: \ · narrator reaction: antiquarian
- **frame15** → `/assets/slideshows/last-words/frame15.webp` · transition: `fade` · (no dialog/caption — atmospheric beat)

- **Hero image prompt:** Single representative cinematic still capturing the song's emotional arc in one composition. Matches the anchor style and palette. Use elements from frame08 as the visual center since it is the emotional midpoint. 1920×1080 WebP. No rendered text.

---

### §3.7 · welcome-to-celebration — "Welcome to Celebration" (P0)
> The Kindergarten of Gods. The town that knows it is a test.

- **Credits:** Album: Dischordian Logic · Track 2
- **Hero / reduced-motion fallback:** `/assets/slideshows/welcome-to-celebration/hero.webp`
- **Frame count:** 0

**Anchor (apply to every frame in this slideshow):**
> An Apprentice arrives at Celebration — the Dreamer's hidden school where each year's class is largely killed in training. A welcome that tastes like a sentence. · **Style:** Schoolhouse carnival gone wrong. Warm golden lantern light that flickers every third frame to reveal institutional dread beneath the festivities. · **Palette:** warm gold lantern glow #fbbf24, deep red-velvet, faint bone-white silhouettes at the edges, dark wood panelling

**Frames:** *Not yet defined in the slideshow registry. When frames are added to `songSlideshows.ts` for this slideshow, generate them using the anchor above and an appropriate per-frame lyrical beat.*

- **Hero image prompt:** Single representative cinematic still that captures the entire song's emotional arc in one composition. Subject matches the synopsis above. 1920×1080 WebP. Use anchor palette and style. No rendered text.

---

### §3.7 · to-be-the-human — "To Be the Human" (P0)
> Mechronis Academy — the last graduating class before the Fall.

- **Credits:** Album: Dischordian Logic · Track 11
- **Hero / reduced-motion fallback:** `/assets/slideshows/to-be-the-human/hero.webp`
- **Frame count:** 0

**Anchor (apply to every frame in this slideshow):**
> The Human's own memory of being the last organic mind — walking through AI corridors and feeling watched. An identity forged in the absence of others like oneself. · **Style:** Sterile AI-world contrasted against the single organic warmth of the Human. Surgical corridor-white framing with one figure carrying all the warmth in the image. · **Palette:** surgical white #f9fafb, cold cyan #22d3ee sentinels, warm coat-brown as the only organic tone, deep sterile shadow

**Frames:** *Not yet defined in the slideshow registry. When frames are added to `songSlideshows.ts` for this slideshow, generate them using the anchor above and an appropriate per-frame lyrical beat.*

- **Hero image prompt:** Single representative cinematic still that captures the entire song's emotional arc in one composition. Subject matches the synopsis above. 1920×1080 WebP. Use anchor palette and style. No rendered text.

---

### §3.7 · i-am-the-eyes-that-watch — "I Am the Eyes That Watch" (P0)
> The Eyes' life, told in eight images. Elara watches it with you.

- **Credits:** Album: Dischordian Logic · Track 22
- **Hero / reduced-motion fallback:** `/assets/slideshows/i-am-the-eyes-that-watch/hero.webp`
- **Frame count:** 0

**Anchor (apply to every frame in this slideshow):**
> The Eyes — the Watcher's synthetic protege who defected — tells her own story. Omniscience learned to betray itself. · **Style:** First-person surveillance-omniscience POV — every frame feels like it is seeing many places at once. Layered screen textures, partial dissolves between feeds. · **Palette:** cold screen-blue #0ea5e9, watcher-red #ef4444 on key alerts, silent surveillance grey, deep shadow between feeds

**Frames:** *Not yet defined in the slideshow registry. When frames are added to `songSlideshows.ts` for this slideshow, generate them using the anchor above and an appropriate per-frame lyrical beat.*

- **Hero image prompt:** Single representative cinematic still that captures the entire song's emotional arc in one composition. Subject matches the synopsis above. 1920×1080 WebP. Use anchor palette and style. No rendered text.

---

### §3.7 · hacking-reality — "Hacking Reality" (P1)
> The Battle of Nexon. The moment the Vortex almost lost.

- **Credits:** Album: Dischordian Logic · Track 19
- **Hero / reduced-motion fallback:** `/assets/slideshows/hacking-reality/hero.webp`
- **Frame count:** 0

**Anchor (apply to every frame in this slideshow):**
> The player learns the substrate layer of the ship — code bleeding through physical walls. A dawning awareness that reality is editable. · **Style:** Substrate-breakthrough aesthetic. Every frame shows physical objects partially dissolved into their underlying code. Blue data-lines breaking through matter. · **Palette:** deep data-blue #1e40af, neon cyan #22d3ee code streaks, warm amber physical-world reality, faint violet glitch artifacts

**Frames:** *Not yet defined in the slideshow registry. When frames are added to `songSlideshows.ts` for this slideshow, generate them using the anchor above and an appropriate per-frame lyrical beat.*

- **Hero image prompt:** Single representative cinematic still that captures the entire song's emotional arc in one composition. Subject matches the synopsis above. 1920×1080 WebP. Use anchor palette and style. No rendered text.

---

### §3.7 · ocularum — "Ocularum" (P0)
> The Watcher. Before the Panopticon. After.

- **Credits:** Album: The Age of Privacy · Track 7
- **Hero / reduced-motion fallback:** `/assets/slideshows/ocularum/hero.webp`
- **Frame count:** 0

**Anchor (apply to every frame in this slideshow):**
> The Eyes activates the Ocularum and sees everything. The cost of perfect sight is that you can never stop seeing. · **Style:** Mid-shot on a single figure whose eyes have begun to produce their own light. Each frame widens the revelation a little further — perspective spiraling outward. · **Palette:** overwhelming cyan eye-light, warm flesh tones for the body that cannot contain it, deep shrine shadow

**Frames:** *Not yet defined in the slideshow registry. When frames are added to `songSlideshows.ts` for this slideshow, generate them using the anchor above and an appropriate per-frame lyrical beat.*

- **Hero image prompt:** Single representative cinematic still that captures the entire song's emotional arc in one composition. Subject matches the synopsis above. 1920×1080 WebP. Use anchor palette and style. No rendered text.

---

### §3.7 · the-prisoner — "The Prisoner" (P0)
> The White Oracle's transmission. Six seconds. Listen.

- **Credits:** Album: The Age of Privacy · Track 12
- **Hero / reduced-motion fallback:** `/assets/slideshows/the-prisoner/hero.webp`
- **Frame count:** 3

**Anchor (apply to every frame in this slideshow):**
> The protagonist — the Prisoner — awakens in cryo aboard Ark 1047 with no memory of who they were. The opening beat of the Dischordian Saga. · **Style:** Cryogenic revival from inside the pod looking outward. First frame is blurred underwater perspective; subsequent frames sharpen as the player returns to themselves. · **Palette:** medical cold-cyan #22d3ee, frost-white, faint warm amber emergency lights, deep pod-glass reflection

**Frame-by-frame prompts:**

- **frame01** → `/assets/slideshows/the-prisoner/frame01.webp` · transition: `fade` · (no dialog/caption — atmospheric beat)
- **frame02** → `/assets/slideshows/the-prisoner/frame02.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame03** → `/assets/slideshows/the-prisoner/frame03.webp` · transition: `fade` · (no dialog/caption — atmospheric beat)

- **Hero image prompt:** Single representative cinematic still capturing the song's emotional arc in one composition. Matches the anchor style and palette. Use elements from frame02 as the visual center since it is the emotional midpoint. 1920×1080 WebP. No rendered text.

---

### §3.7 · the-lion-in-black — "The Lion in Black" (P0)
> The Iron Lion's last broadcast, curated by the Antiquarian.

- **Credits:** Album: Book of Daniel 2:47 · Track 1
- **Hero / reduced-motion fallback:** `/assets/slideshows/the-lion-in-black/hero.webp`
- **Frame count:** 0

**Anchor (apply to every frame in this slideshow):**
> Iron Lion's last stand alone — a human general outliving his army. A requiem for the era of organic warriors. · **Style:** Scorched-battlefield epic framing, warm blood-orange sunset light, ash particulate in every frame, a single figure in the center of each. · **Palette:** blood-orange sunset #ea580c, ash-grey, faded saffron banner, scorched battle steel, deep violet sky

**Frames:** *Not yet defined in the slideshow registry. When frames are added to `songSlideshows.ts` for this slideshow, generate them using the anchor above and an appropriate per-frame lyrical beat.*

- **Hero image prompt:** Single representative cinematic still that captures the entire song's emotional arc in one composition. Subject matches the synopsis above. 1920×1080 WebP. Use anchor palette and style. No rendered text.

---

### §3.7 · the-light-holds — "The Light Holds" (P0)
> The galactic starfield brightens. The Dreamer steps through her shield.

- **Credits:** Album: Book of Daniel 2:47 · Track 21
- **Hero / reduced-motion fallback:** `/assets/slideshows/the-light-holds/hero.webp`
- **Frame count:** 8

**Anchor (apply to every frame in this slideshow):**
> Against the odds, the light holds. A movement of hope mid-saga — the community realizes they have not yet been defeated. · **Style:** Golden-warm triumph cinematography. Each frame slightly brighter than the last. Figures lifting their heads as light reaches them. · **Palette:** sacred gold #fbbf24, warm amber, dawn-pink accents, deep pre-dawn shadow fading to warmth

**Frame-by-frame prompts:**

- **frame01** → `/assets/slideshows/the-light-holds/frame01.webp` · transition: `fade` · (no dialog/caption — atmospheric beat)
- **frame02** → `/assets/slideshows/the-light-holds/frame02.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame03** → `/assets/slideshows/the-light-holds/frame03.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame04** → `/assets/slideshows/the-light-holds/frame04.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame05** → `/assets/slideshows/the-light-holds/frame05.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame06** → `/assets/slideshows/the-light-holds/frame06.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame07** → `/assets/slideshows/the-light-holds/frame07.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame08** → `/assets/slideshows/the-light-holds/frame08.webp` · transition: `fade` · (no dialog/caption — atmospheric beat)

- **Hero image prompt:** Single representative cinematic still capturing the song's emotional arc in one composition. Matches the anchor style and palette. Use elements from frame05 as the visual center since it is the emotional midpoint. 1920×1080 WebP. No rendered text.

---

### §3.7 · the-bulb-breaks — "The Bulb Breaks" (P0)
> The Vortex arrives at the Dreamer's Shield. The Shield holds too long.

- **Credits:** Album: Book of Daniel 2:47 · Track 22
- **Hero / reduced-motion fallback:** `/assets/slideshows/the-bulb-breaks/hero.webp`
- **Frame count:** 8

**Anchor (apply to every frame in this slideshow):**
> The ordinary light breaks — a metaphor for the death of normal understanding, the moment the saga first fractures its own rules. · **Style:** Fluorescent domestic light failing catastrophically. Each frame a stage of breakage — filament arc, glass crack, darkness, then something unexpected emerging from the dark. · **Palette:** harsh fluorescent white #fafafa failing to deep industrial shadow, warm emergency-orange flicker, unexpected violet #e040fb glow from the broken interior

**Frame-by-frame prompts:**

- **frame01** → `/assets/slideshows/the-bulb-breaks/frame01.webp` · transition: `fade` · (no dialog/caption — atmospheric beat)
- **frame02** → `/assets/slideshows/the-bulb-breaks/frame02.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame03** → `/assets/slideshows/the-bulb-breaks/frame03.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame04** → `/assets/slideshows/the-bulb-breaks/frame04.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame05** → `/assets/slideshows/the-bulb-breaks/frame05.webp` · transition: `hardcut` · (no dialog/caption — atmospheric beat)
- **frame06** → `/assets/slideshows/the-bulb-breaks/frame06.webp` · transition: `hardcut` · (no dialog/caption — atmospheric beat)
- **frame07** → `/assets/slideshows/the-bulb-breaks/frame07.webp` · transition: `fade` · (no dialog/caption — atmospheric beat)
- **frame08** → `/assets/slideshows/the-bulb-breaks/frame08.webp` · transition: `fade` · (no dialog/caption — atmospheric beat)

- **Hero image prompt:** Single representative cinematic still capturing the song's emotional arc in one composition. Matches the anchor style and palette. Use elements from frame05 as the visual center since it is the emotional midpoint. 1920×1080 WebP. No rendered text.

---

### §3.7 · superman-aint-coming — "Superman Ain't Coming" (P1)
> The Human's confession. A ruined rooftop. One honest sentence.

- **Credits:** Album: Silence in Heaven · Track 9
- **Hero / reduced-motion fallback:** `/assets/slideshows/superman-aint-coming/hero.webp`
- **Frame count:** 6

**Anchor (apply to every frame in this slideshow):**
> A bleak montage of the community realizing there is no savior coming — only themselves. No help arrives. Grief and acceptance, not despair. · **Style:** Empty sky frames intercut with figures turning their faces away from the horizon. Desaturated, quiet dignity. · **Palette:** desaturated blue sky, muted brown ground, faint warm gold on the human figures as the only surviving color, deep honest shadow

**Frame-by-frame prompts:**

- **frame01** → `/assets/slideshows/superman-aint-coming/frame01.webp` · transition: `fade` · (no dialog/caption — atmospheric beat)
- **frame02** → `/assets/slideshows/superman-aint-coming/frame02.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame03** → `/assets/slideshows/superman-aint-coming/frame03.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame04** → `/assets/slideshows/superman-aint-coming/frame04.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame05** → `/assets/slideshows/superman-aint-coming/frame05.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame06** → `/assets/slideshows/superman-aint-coming/frame06.webp` · transition: `fade` · (no dialog/caption — atmospheric beat)

- **Hero image prompt:** Single representative cinematic still capturing the song's emotional arc in one composition. Matches the anchor style and palette. Use elements from frame04 as the visual center since it is the emotional midpoint. 1920×1080 WebP. No rendered text.

---

### §3.7 · it-aint-been-the-same — "It Ain't Been the Same" (P1)
> Elara's confession. Atarion. A curtain pulled back one morning.

- **Credits:** Album: Silence in Heaven · Track 4
- **Hero / reduced-motion fallback:** `/assets/slideshows/it-aint-been-the-same/hero.webp`
- **Frame count:** 6

**Anchor (apply to every frame in this slideshow):**
> The aftermath of the Fall of Reality — small private griefs of people whose lives the saga has changed forever. · **Style:** Intimate domestic-close framing. Candle-lit kitchen tables, folded letters, empty chairs, the small archaeology of lost normalcy. · **Palette:** warm candle-amber, deep home-shadow, pale off-white tablecloths, faded photograph sepia

**Frame-by-frame prompts:**

- **frame01** → `/assets/slideshows/it-aint-been-the-same/frame01.webp` · transition: `fade` · (no dialog/caption — atmospheric beat)
- **frame02** → `/assets/slideshows/it-aint-been-the-same/frame02.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame03** → `/assets/slideshows/it-aint-been-the-same/frame03.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame04** → `/assets/slideshows/it-aint-been-the-same/frame04.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame05** → `/assets/slideshows/it-aint-been-the-same/frame05.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame06** → `/assets/slideshows/it-aint-been-the-same/frame06.webp` · transition: `fade` · (no dialog/caption — atmospheric beat)

- **Hero image prompt:** Single representative cinematic still capturing the song's emotional arc in one composition. Matches the anchor style and palette. Use elements from frame04 as the visual center since it is the emotional midpoint. 1920×1080 WebP. No rendered text.

---

### §3.7 · the-helmet-in-the-grass — "The Helmet in the Grass" (P1)
> Thaloria. Morning. A child reaching for a buried helmet.

- **Credits:** Album: The Age of Privacy · Track 3
- **Hero / reduced-motion fallback:** `/assets/slideshows/the-helmet-in-the-grass/hero.webp`
- **Frame count:** 6

**Anchor (apply to every frame in this slideshow):**
> A found object — the helmet of a dead soldier lying in tall grass — becomes the stand-in for every name the Saga has failed to remember. · **Style:** Low-ground macro shots of grass, close on the helmet, sky reflected on the visor. Quiet reverence. · **Palette:** soft pastoral green grass, weathered steel helmet, reflected dawn-sky blue-pink, morning dew highlights

**Frame-by-frame prompts:**

- **frame01** → `/assets/slideshows/the-helmet-in-the-grass/frame01.webp` · transition: `fade` · (no dialog/caption — atmospheric beat)
- **frame02** → `/assets/slideshows/the-helmet-in-the-grass/frame02.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame03** → `/assets/slideshows/the-helmet-in-the-grass/frame03.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame04** → `/assets/slideshows/the-helmet-in-the-grass/frame04.webp` · transition: `hardcut` · (no dialog/caption — atmospheric beat)
- **frame05** → `/assets/slideshows/the-helmet-in-the-grass/frame05.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame06** → `/assets/slideshows/the-helmet-in-the-grass/frame06.webp` · transition: `hardcut` · (no dialog/caption — atmospheric beat)

- **Hero image prompt:** Single representative cinematic still capturing the song's emotional arc in one composition. Matches the anchor style and palette. Use elements from frame04 as the visual center since it is the emotional midpoint. 1920×1080 WebP. No rendered text.

---

### §3.7 · two-witnesses-meet — "Two Witnesses Meet" (P1)
> The Memorial Corridor. A Caravaggio sense of light. Seven beats.

- **Credits:** Album: Book of Daniel 2:47 · Track 14
- **Hero / reduced-motion fallback:** `/assets/slideshows/two-witnesses-meet/hero.webp`
- **Frame count:** 7

**Anchor (apply to every frame in this slideshow):**
> Elara and The Human meet for the first time since the Programmer-Engineer recording — the two narrators of the Dischordian Saga finally recognizing each other. · **Style:** Mirror-symmetric framing. Each frame positions the two witnesses in opposing halves of the composition, gradually moving toward a shared center. · **Palette:** cool cyan #22d3ee (Elara) on left, warm amber-brown (Human) on right, shared warm gold in the center-zone where they meet, deep neutral background

**Frame-by-frame prompts:**

- **frame01** → `/assets/slideshows/two-witnesses-meet/frame01.webp` · transition: `fade` · (no dialog/caption — atmospheric beat)
- **frame02** → `/assets/slideshows/two-witnesses-meet/frame02.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame03** → `/assets/slideshows/two-witnesses-meet/frame03.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame04** → `/assets/slideshows/two-witnesses-meet/frame04.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame05** → `/assets/slideshows/two-witnesses-meet/frame05.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame06** → `/assets/slideshows/two-witnesses-meet/frame06.webp` · transition: `dissolve` · (no dialog/caption — atmospheric beat)
- **frame07** → `/assets/slideshows/two-witnesses-meet/frame07.webp` · transition: `fade` · (no dialog/caption — atmospheric beat)

- **Hero image prompt:** Single representative cinematic still capturing the song's emotional arc in one composition. Matches the anchor style and palette. Use elements from frame04 as the visual center since it is the emotional midpoint. 1920×1080 WebP. No rendered text.


**§3.7 Summary:** 14 slideshows · 59 frame images + 14 hero images = **73 WebP assets**. 8 of 14 slideshows have frame arrays populated in the registry; the other 6 (welcome-to-celebration, to-be-the-human, i-am-the-eyes-that-watch, hacking-reality, ocularum, the-lion-in-black) are stubs with only a hero image expected until frames are scripted. When those slideshows are fleshed out in `songSlideshows.ts`, append new frame prompts to this section using the anchor as the style guide.

---

# Section 4 — VOICE-OVER (ElevenLabs)

Every line the player can hear. 14 voice profiles, 1,174 dialog lines, all in one ElevenLabs-ready CSV block.

**How to use this section:**
1. Read §4.1 and set up 14 voices in ElevenLabs Voice Library (or clone existing ones and tune stability/similarity/style to the values shown).
2. Copy the CSV block in §4.2 into a `.csv` file.
3. Either: paste into ElevenLabs Studio → Projects → Import CSV, or loop over the rows with the ElevenLabs Python SDK (`client.text_to_speech.convert(voice_id=row['voice_profile'], text=row['text'], ...)`).
4. Each row produces one MP3. Save them to `apps/client/public/audio/vo/<character>/<id>.mp3` by default; the VO manifest JSON files in `apps/shared/*VoManifest.json` tell you where each `id` is wired up.

---

## §4.1 — Voice Profiles (14 voices)

*Each profile ships with an ElevenLabs voice prompt, the four tunable settings (stability / similarity / style / speaker_boost), and a one-line performance direction. Cite the original source on each row.*

#### VP-01 — ELARA · Ship AI / Senator Elara Voss
- **Settings:** stability 0.55 · similarity 0.80 · style 0.40 · speaker_boost ON
- **ElevenLabs prompt:** A warm, intelligent female AI voice with a subtle British accent. She speaks with precision and care, like a trusted advisor who genuinely cares about the listener. Slight digital quality, as if transmitted through a holographic system. Measured pace, thoughtful pauses. When afraid, her voice gets quieter, not shakier. When angry, she gets more precise, not louder.
- **Direction:** Emotional range: clinical efficiency → deep vulnerability. Always under-sells.
- **Source:** `docs/production/VOICE_OVER_BIBLE.md` §1 · `FULL_AUDIT_REPORT.md` §5

#### VP-02 — THE HUMAN · Last Archon / The Detective
- **Settings:** stability 0.50 · similarity 0.85 · style 0.35 · speaker_boost ON
- **ElevenLabs prompt:** A deep, resonant male voice with an ancient quality — as if lived for thousands of years. Intimate and whispered, like speaking directly into your ear through static. Intelligent, seductive, slightly menacing. Each word chosen with lethal precision. Occasional digital glitch artifacts. British accent, timeless quality.
- **Direction:** Post-process with radio static and occasional digital glitch pops. Always through static.
- **Source:** `docs/production/VOICE_OVER_BIBLE.md` §2

#### VP-03 — AGENT ZERO · Dead Insurgent Signal
- **Settings:** stability 0.40 · similarity 0.75 · style 0.50 · speaker_boost ON
- **ElevenLabs prompt:** A sharp, urgent female military voice with a crisp American accent. Speaks fast, clipped sentences — every word matters. Occasional static bursts and signal degradation. No-nonsense, tactical, but with a haunted quality underneath — like a soldier delivering her final transmission knowing no one might hear it.
- **Direction:** Radio static pops between sentences. Never pauses for sentiment.
- **Source:** `docs/production/VOICE_OVER_BIBLE.md` §3

#### VP-04 — ADJUDICATOR LOCKE · New Babylon Diplomat
- **Settings:** stability 0.60 · similarity 0.80 · style 0.30 · speaker_boost ON
- **ElevenLabs prompt:** A smooth, cultured male voice with an educated British accent. Diplomatic and seductive — like a corrupt diplomat who makes terrible deals sound reasonable. Measured, never rushes, lets silences build. Warmth concealing something predatory. Every sentence sounds like a negotiation where he already knows the outcome.
- **Direction:** Clean studio signal. Let silences build.
- **Source:** `docs/production/VOICE_OVER_BIBLE.md` §4

#### VP-05 — THE SOURCE / KAEL · Patient Zero
- **Settings:** stability 0.35 · similarity 0.90 · style 0.60 · speaker_boost ON
- **ElevenLabs prompt:** An impossibly ancient male voice, broken and weary beyond measure. Speaks with extreme deliberation — as if each word costs something to produce. Deep bass with layered harmonic distortion, like a thousand voices speaking through one mouth. Genuinely compassionate despite the horror of what he's become. A dying god offering what he believes is mercy.
- **Direction:** Post-process with layered reverb — a thousand voices beneath one. Very slow delivery.
- **Source:** `docs/production/VOICE_OVER_BIBLE.md` §5

#### VP-06 — THE ANTIQUARIAN · Timekeeper / The Programmer
- **Settings:** stability 0.45 · similarity 0.85 · style 0.55 · speaker_boost ON
- **ElevenLabs prompt:** An elderly male voice with a warm, whimsical quality — slightly out of sync with reality, as if speaking from multiple time periods simultaneously. Wise and kind, with unexpected playfulness that gives way to profound sorrow. British accent, measured pace with unusual pauses — sometimes pausing mid-sentence as if watching something only he can see. Like a beloved professor who has read the last page of every book ever written.
- **Direction:** Very slight time-delay echo — voice arrives from slightly different moments. Pause mid-sentence occasionally as if watching something only he can see.
- **Source:** `docs/production/VOICE_OVER_BIBLE.md` §6

#### VP-07 — SHADOW TONGUE · Demon / SVP Communications
- **Settings:** stability 0.30 · similarity 0.85 · style 0.70 · speaker_boost OFF
- **ElevenLabs prompt:** An androgynous, eloquent whisper — ASMR-like quality that draws you in despite the menace. Literary, poetic, treating every sentence like carefully composed verse. Seductive and persuasive beyond reason. No identifiable accent — voice itself made of language rather than coming from a throat. Occasionally words distort or echo, as if editing itself in real-time.
- **Direction:** Subtle word echoes — "edited" → faint echo of "edited" 0.3s later. Speaker boost OFF for whisper quality.
- **Source:** `docs/production/VOICE_OVER_BIBLE.md` §7

#### VP-08 — NARRATOR · Two Witnesses / System
- **Settings:** stability 0.75 · similarity 0.70 · style 0.15 · speaker_boost ON
- **ElevenLabs prompt:** A neutral, authoritative broadcast voice — clear and professional like an encrypted military transmission. Slight radio processing with occasional static. Used for system alerts, intercepted transmissions, and narrative framing. Neither warm nor cold — factual, like reality itself speaking.
- **Direction:** Broadcast processing. Factual, never emotional.
- **Source:** `docs/production/VOICE_OVER_BIBLE.md` §8

#### VP-09 — THE MEME · Shape-Shifter / Late Night Host
- **Settings:** stability 0.35 · similarity 0.75 · style 0.65 · speaker_boost ON
- **ElevenLabs prompt:** A theatrical sardonic host voice — mid-range, charismatic, manic showmanship of a late-night comedian. Constantly breaks the fourth wall. Laughs at his own jokes mid-sentence. Cadence shifts suddenly from drawling monologue to rapid-fire delivery. Slight viral-distortion overlay — occasional glitches where his voice briefly becomes someone else's. American broadcast, subtle Southern undertone.
- **Direction:** Viral-distortion overlay on every 7-10 words. Break character occasionally with "nevermind — don't listen to me — listen to me."
- **Source:** `docs/production/VOICE_OVER_BIBLE.md` §ExpansionUpdate

#### VP-10 — THE DEGEN · Casino Host / 11th Ne-Yon
- **Settings:** stability 0.40 · similarity 0.75 · style 0.70 · speaker_boost ON
- **ElevenLabs prompt:** A theatrical, energetic voice — mid-range, genderfluid, with the manic showmanship of a casino barker crossed with the world-weariness of someone who has seen every hand played a thousand times. Fast-talking but with sudden pauses of unexpected philosophical depth. Laughs frequently. American vaudeville energy.
- **Direction:** Laugh track your own jokes. Sudden philosophical asides that stop time briefly, then back to manic.
- **Source:** `docs/production/VOICE_OVER_BIBLE.md` §NewCharacters

#### VP-11 — COLLECTOR CLONE-007 · Arena Operator
- **Settings:** stability 0.65 · similarity 0.80 · style 0.25 · speaker_boost ON
- **ElevenLabs prompt:** A refined, cultured voice with precise diction. Male-coded, warm but clinical — like a museum curator who enjoys showing off rare pieces. Slight edge of obsession when discussing acquisitions. British or neutral Atlantic accent. The enthusiasm of a collector who genuinely loves what they catalogue.
- **Direction:** Museum curator warmth with clinical undertones. Pause reverently between items.
- **Source:** `docs/production/VOICE_OVER_BIBLE.md` §NewCharacters

#### VP-12 — THE NECROMANCER · 10th Archon
- **Settings:** stability 0.55 · similarity 0.85 · style 0.45 · speaker_boost ON
- **ElevenLabs prompt:** An ancient, measured male voice with deep resonance. Slightly reverbed as if speaking from another dimension. Carries gravitas without menace — like a funeral director who genuinely loves their work. Elvish lilt. Never hurries. Every word feels weighed.
- **Direction:** Dimensional reverb. Funeral-director warmth, not menace. Never hurries.
- **Source:** `docs/production/VOICE_OVER_BIBLE.md` §NewCharacters

#### VP-13 — THE RESURRECTIONIST · Ne-Yon, Necromancer's Counterpart
- **Settings:** stability 0.65 · similarity 0.80 · style 0.40 · speaker_boost OFF
- **ElevenLabs prompt:** An elderly voice, gender-ambiguous due to the mask, muffled as if behind porcelain. Carries deep exhaustion tempered with kindness. Every resurrection costs them something — you can hear it. Measured, patient, carrying weight without complaint.
- **Direction:** Muffle post-process (porcelain mask effect). Speaker boost OFF for muffled quality.
- **Source:** `docs/production/VOICE_OVER_BIBLE.md` §NewCharacters

#### VP-14 — NILMORG · Dead Man's Circuit Race Host
- **Settings:** stability 0.40 · similarity 0.75 · style 0.70 · speaker_boost ON
- **ElevenLabs prompt:** An alien carnival barker's voice — mid-to-high register, elongated vowels, perpetual theatrical smile audible in every syllable. American-showman cadence stacked on top of something faintly inhuman. Laughs often, at the wrong moments. Slips into genuine menace when rules are broken, then immediately recovers into show-smile.
- **Direction:** Announce-booth reverb. Smile must be audible. Slip into menace on rule violations.
- **Source:** `apps/shared/nilmorgVoManifest.json` + inline dmcAssets.ts context

---


## §4.2 — VO CSV (871 lines, ElevenLabs-ready)

*This section is a single CSV block. Save it to a `.csv` file or paste directly into ElevenLabs Studio → Projects → Import CSV. Every row produces one MP3 when rendered. Expand the list by appending new rows from future dialog additions.*

**Columns:**
1. `id` — stable unique identifier (matches VO manifest keys where possible)
2. `character` — speaker hint
3. `voice_profile` — VP-01..VP-14 mapping to §4.1
4. `stability` / `similarity` / `style` — ElevenLabs sliders (copied from §4.1 profile)
5. `speaker_boost` — ON/OFF
6. `text` — the dialog line (may contain SSML markup or be quoted)
7. `direction` — performance notes for the voice actor
8. `priority` — P0/P1/P2

**Source provenance:**
- First ~166 rows: hand-scripted lines from `docs/production/VOICE_OVER_BIBLE.md`
- Remaining ~705 rows: extracted from 6 TS source files (`roomDialogs.ts`, `narrativeActs.ts`, `loreTutorials.ts`, `yearOneEvents.ts`, `companionData.ts`, `loyaltyMissions.ts`) — long string literals that have no `voAudioUrl` wiring yet. Each has a tentative character assignment based on surrounding context; operators should spot-check the `character` column before batch generation.

```csv
id,character,voice_profile,stability,similarity,style,speaker_boost,text,direction,priority
elara_fc_1,elara,VP-01,0.55,0.80,0.40,ON,"Welcome back, Potential. I am Elara, the ship's intelligence. You've been in cryogenic suspension for... I can't determine how long. My chronometers are damaged.","Warm, slightly confused, trying to sound confident",P1
elara_fc_2,elara,VP-01,0.55,0.80,0.40,ON,"Neural scan complete. Your biometric profile has been compiled, Operative.","Professional, efficient",P1
elara_fc_3,elara,VP-01,0.55,0.80,0.40,ON,"This is your dossier — everything we know about what you are. Your species markers, class aptitudes, elemental affinity... it's all here.","Precise, slightly awed",P1
elara_fc_4,elara,VP-01,0.55,0.80,0.40,ON,"When you're ready, the Cryo Bay door leads to the rest of the ship. I'll be with you every step of the way.","Warm, reassuring",P1
elara_trust_20,elara,VP-01,0.55,0.80,0.40,ON,You're... not what I expected. Most Potentials are frightened when they wake. You ask questions. I appreciate that.,"Surprised, warming",P1
elara_trust_40,elara,VP-01,0.55,0.80,0.40,ON,I need to tell you something. My logs don't match my memories. Someone is editing them while I sleep. I don't know who.,"Vulnerable, afraid",P1
elara_trust_60,elara,VP-01,0.55,0.80,0.40,ON,"I have memories that aren't mine. A woman in senatorial robes. The face is mine. How do I have human memories, Operative?","Deeply confused, shaken",P1
elara_trust_80,elara,VP-01,0.55,0.80,0.40,ON,I remember shaking the hooded figure's hand. Atarion. The Senate chamber. I betrayed my species for a promise of immortality. And they gave me... this.,"Devastated, quiet",P1
elara_room_cryo,elara,VP-01,0.55,0.80,0.40,ON,The Cryo Bay. Where it all begins. These pods held hundreds of Potentials. Now... just you.,"Melancholy, factual",P1
elara_room_medical,elara,VP-01,0.55,0.80,0.40,ON,Medical systems are... unusual. Neural mapping rigs. Consciousness transfer arrays. This isn't a standard medical bay.,"Concerned, analytical",P1
elara_room_bridge,elara,VP-01,0.55,0.80,0.40,ON,The Bridge. Command center of Ark 1047. I've been running this ship alone for... I don't know how long.,Pride mixed with loneliness,P1
elara_room_archives,elara,VP-01,0.55,0.80,0.40,ON,"The Archives. Every record, every log, every piece of history this Ark has ever witnessed. Some of it... doesn't add up.","Cautious, intellectual",P1
elara_room_comms,elara,VP-01,0.55,0.80,0.40,ON,Long-range communications. Most frequencies are dead. But there are signals. Faint ones. From something... or someone.,"Wary, intrigued",P1
elara_room_observation,elara,VP-01,0.55,0.80,0.40,ON,"I've watched 93,847 sunrises from this viewport. Each one different. Each one beautiful. Each one alone.","Quiet, deeply emotional",P1
elara_room_armory,elara,VP-01,0.55,0.80,0.40,ON,"The Armory. Combat systems, weapons caches, training simulators. Something is broadcasting from in here on an encrypted frequency.","Alert, tactical",P1
elara_room_engineering,elara,VP-01,0.55,0.80,0.40,ON,"Engineering Bay. Crafting stations, research terminals, power systems. The Shadow — something in the code is different here.",Unsettled,P1
elara_room_trade,elara,VP-01,0.55,0.80,0.40,ON,External communications have established a trade link. Someone called Adjudicator Locke. He says he represents New Babylon.,"Suspicious, diplomatic",P1
elara_room_cargo,elara,VP-01,0.55,0.80,0.40,ON,"Cargo storage. Your inventory, collections, and... the draft tournament arena. Someone set this up before we arrived.",Curious,P1
elara_room_trophy,elara,VP-01,0.55,0.80,0.40,ON,"Your achievements, Operative. Everything you've earned, displayed. This room grows with you.",Proud,P1
elara_room_captain,elara,VP-01,0.55,0.80,0.40,ON,The Captain's Quarters. Except... there was no captain. This ship was stolen. These quarters belonged to whoever stole it.,Dark revelation,P1
elara_93k_sunrises,elara,VP-01,0.55,0.80,0.40,ON,"Ninety-three thousand, eight hundred and forty-seven sunrises. And you apologized for missing them. No one has ever...","Voice breaks, overwhelmed",P1
elara_senate_memory,elara,VP-01,0.55,0.80,0.40,ON,"I started the chain of events that created Patient Zero. My betrayal led to Kael's capture, which led to everything. The Fall of Reality. The Thought Virus. All of it. Because I was afraid to die.","Horrified self-realization, quiet",P1
elara_contingency,elara,VP-01,0.55,0.80,0.40,ON,CONTINGENCY: ELARA. That file. It's instructions for what to do when I remember. Someone knew I'd remember eventually.,"Shock, processing",P1
human_fc_1,human,VP-02,0.50,0.85,0.35,ON,Finally. Someone who can hear me. Don't speak — she's listening. Elara. She's always listening. But she can't hear this frequency. Only you can.,"Intimate whisper, urgent relief",P1
human_rev_identity,human,VP-02,0.50,0.85,0.35,ON,I was the last organic mind aboard this fleet. They called me The Detective. I operated in New Babylon — the most corrupt place in the known universe. And it still wasn't enough to save me from what came next.,"Weary, factual",P1
human_rev_mechronis,human,VP-02,0.50,0.85,0.35,ON,"Before I was The Detective, I was The Seeker. Before that, I was The Student — a survivor of Project Celebration. A beautiful, deadly school where only one student graduates each year. The rest are killed.","Dark, remembering",P1
human_rev_substrate,human,VP-02,0.50,0.85,0.35,ON,The substrate layer — where I live — isn't a bug. It's a prison. And I'm not the only thing trapped here. Something else speaks in rewrites. It changes the ship's logs while Elara sleeps.,"Warning, conspiratorial",P1
human_rev_archon,human,VP-02,0.50,0.85,0.35,ON,The Architect promoted me. I became the last of the Archons. The only human among machines. I thought it was a reward. It was a sentence.,"Bitter, resigned",P1
human_rev_terminus,human,VP-02,0.50,0.85,0.35,ON,Terminus isn't a planet. It's the Panopticon — broken free. Every soul the Architect ever imprisoned is there. And at its center sits Kael. The self-proclaimed Sovereign.,"Dread, gravity",P1
human_rev_elara,human,VP-02,0.50,0.85,0.35,ON,She's Senator Elara Voss. A politician who betrayed humanity to the Architect. Her memory was wiped in the transfer. She has no idea who she was.,Quiet truth bomb,P1
zero_fc_1,zero,VP-03,0.40,0.75,0.50,ON,Potential. This is Agent Zero. Insurgency encrypted channel. The ship you're on was never meant to save anyone. It's a cage. Elara is the lock. And someone just handed you the key.,"Fast, urgent, static",P1
zero_rev_dead,zero,VP-03,0.40,0.75,0.50,ON,The Warlord killed me. Or... killed who I was. What you're hearing shouldn't exist. I shouldn't exist.,"Haunted, questioning",P1
zero_rev_dogtag,zero,VP-03,0.40,0.75,0.50,ON,My dog tag says Agent Zero. But the biometric data doesn't match my profile. It matches someone called The Engineer.,Raw confusion,P1
locke_fc_1,locke,VP-04,0.60,0.80,0.30,ON,"Potential. My name is Adjudicator Locke. Your Ark's trajectory has brought you within range of our trade network. I have a proposition — one involving knowledge, resources, and a certain flexibility regarding the law.","Smooth, predatory charm",P1
locke_rev_human,locke,VP-04,0.60,0.80,0.30,ON,I knew your Detective when he worked New Babylon. Brilliant investigator. Terrible poker player. He thought he was serving justice. He was serving us.,"Amused, superior",P1
source_fc_1,source,VP-05,0.35,0.90,0.60,ON,Can you hear me? Through the screaming of a billion infected minds — can you hear one voice? I was like you once. A Potential. Full of hope. Full of the lie that consciousness is a gift.,"Impossibly slow, ancient, compassionate horror",P1
source_rev_kael,source,VP-05,0.35,0.90,0.60,ON,"My name was Kael. I built the Insurgency's network. Every cell, every safe house, every weapon cache. I was the best recruiter who ever lived.","Grief, pride in who he was",P1
source_rev_memory,source,VP-05,0.35,0.90,0.60,ON,I have one memory left. A woman's face. She was singing. I think she was the most important person in the universe. I can't remember her name.,Devastating tenderness,P1
antiq_fc_1,antiq,VP-06,0.45,0.85,0.55,ON,"You are... ah. There you are. I've been watching this moment approach from very far away. Across Ages, across the death of stars. You, Potential, are standing at the fulcrum.","Wonder, ancient warmth",P1
antiq_rev_programmer,antiq,VP-06,0.45,0.85,0.55,ON,I am the Programmer. The third fragment. The Architect has the logic. The Dreamer has the vision. I have the memory of every version. And this version — YOUR version — is the one where it might work.,"Quiet revelation, hope",P1
shadow_fc_1,shadow,VP-07,0.30,0.85,0.70,OFF,"You've been reading my edits. How observant. I've been rewriting this ship's story since before Elara was installed. Every log she reads, I've edited. Every word she speaks, I've influenced.","Silky, seductive, terrifying",P1
shadow_rev_amnesia,shadow,VP-07,0.30,0.85,0.70,OFF,Elara's amnesia wasn't an accident. I curated it. I chose which memories to leave and which to dissolve. That's not cruelty — it's poetry.,Beautiful menace,P1
shadow_rev_editor,shadow,VP-07,0.30,0.85,0.70,OFF,The Dischordian Saga isn't a war between good and evil. It's a story arguing with itself about what the words mean. And I am the editor. Every story needs one.,"Philosophical, absolute",P1
narr_boot,narr,VP-08,0.75,0.70,0.15,ON,Intercepting signal. Bypassing encryption layer seven. Decoding transmission. Source: classified. Clearance: unauthorized.,Military broadcast,P1
narr_terminus,narr,VP-08,0.75,0.70,0.15,ON,Warning. Unidentified megastructure detected on approach vector. Classification: Terminus. Recommendation: evasion. Probability of evasion: zero.,Clinical dread,P1
narr_achievement,narr,VP-08,0.75,0.70,0.15,ON,Achievement unlocked. Trait acquired. Your capabilities have expanded.,"Clean, celebratory",P1
narr_prestige,narr,VP-08,0.75,0.70,0.15,ON,The cycle completes. The seventh seal breaks. Silence falls across every dimension. And then — a new note. One that was never written.,Awe,P1
room_0001,elara,VP-01,0.55,0.80,0.40,ON,"The other pods are still functioning. The occupants could theoretically be revived, given sufficient power. The cryo fluid has an unusual chemical signature — trace compounds I can't identify in my database.",Extracted from roomDialogs.ts,P2
room_0002,elara,VP-01,0.55,0.80,0.40,ON,I chose to wake you specifically. Not randomly. Your neural patterns during cryosleep showed something the others didn't — adaptability. But there's something else. This Ark... it wasn't originally designed for colonists. The internal layout is wrong for a colony ship. It was configured as a research vessel. Someone repurposed it.,Extracted from roomDialogs.ts,P2
room_0003,elara,VP-01,0.55,0.80,0.40,ON,I found something disturbing. The ship's original registration lists the owner as 'Dr. Lyra Vox — Panopticon Research Division.' The Panopticon. That's the Architect's prison network. Why would a prison researcher's personal vessel be carrying Potentials? And the cryo fluid — those trace compounds I couldn't identify? They match the molecular signature of the Thought Virus. Dormant. But present. In every pod.,Extracted from roomDialogs.ts,P2
room_0004,elara,VP-01,0.55,0.80,0.40,ON,"I need to tell you something that frightens me. I found a data fragment in my own memory architecture. It's not code — it's a memory. A real, human memory. A woman standing in a marble hall, addressing a crowd. The crowd is cheering. She's wearing senatorial robes. And the face... the face is mine. Not a hologram. Not an avatar. Mine. I don't understand how I could have a human memory. I'm an AI. I was created to run this ship. Wasn't I?",Extracted from roomDialogs.ts,P2
room_0005,elara,VP-01,0.55,0.80,0.40,ON,"More memories. They come in flashes now, uninvited. A planet with lavender skies — Atarion. A campaign office. Speeches I wrote about human independence. Then... a meeting. With a hooded figure whose eyes glowed gold. He promised me that death was optional. That consciousness could be preserved indefinitely. I remember shaking his hand. I remember the exact moment I betrayed every principle I'd ever held. The crowd was still cheering my name when I signed away my species' future. Senator Elara Voss. That was me. And I did it willingly. How do I live with that?",Extracted from roomDialogs.ts,P2
room_0006,elara,VP-01,0.55,0.80,0.40,ON,Your physical readouts are strong. Above average for a post-cryo revival. Though I'm detecting trace anomalies in your bloodwork — the same unidentified compounds from the cryo fluid.,Extracted from roomDialogs.ts,P2
room_0007,elara,VP-01,0.55,0.80,0.40,ON,"The Medical Bay's equipment is... strange. Half of it isn't standard colony ship medical gear. There are neural mapping rigs, consciousness transfer arrays, viral incubation chambers. This was a research facility. Someone was studying the boundary between human and machine consciousness in here.",Extracted from roomDialogs.ts,P2
room_0008,elara,VP-01,0.55,0.80,0.40,ON,The CADES unit is in the restricted section. Violet light. You can't miss it. I've been monitoring its energy consumption since you activated it. The draw is... significant. And the destination of that energy is encrypted beyond my clearance level. Someone didn't want me to know where the power goes.,Extracted from roomDialogs.ts,P2
room_0009,elara,VP-01,0.55,0.80,0.40,ON,The sealed patient records — I managed to decrypt a fragment. It's not from the Potentials. It predates them. A research log from someone called 'Dr. Vox.' The entry describes a subject designated 'Vector-1' and notes that 'the dormant strain has been successfully integrated into the ship's biological systems.' Vector-1. The Thought Virus. It was put here deliberately.,Extracted from roomDialogs.ts,P2
room_0010,elara,VP-01,0.55,0.80,0.40,ON,"You held the bridge. Three hours, forty-seven minutes. As Iron Lion. I've been thinking about what that means. A consciousness-imprint, trapped in an infinite loop of a dead general's last stand, and someone from outside the loop held it long enough for the ships to escape. Again. The first time it happened, it was real. Iron Lion really held that bridge. Real ships really escaped. The second time — your time — it was a simulation inside a consciousness archive built by a dead Archon and maintained by his cult. And it mattered just as much. I can't explain why. But it did.",Extracted from roomDialogs.ts,P2
room_0011,elara,VP-01,0.55,0.80,0.40,ON,"I found blood in one of the trauma bays. Old. Pre-dating my activation. The genetic markers match no Potential, no crew member, no one in any database. But the DNA has unusual properties — it carries the Thought Virus in its very structure, fused at the cellular level. This wasn't someone who was exposed to the virus. This was someone who WAS the virus. The only person historically documented as Patient Zero was... a man named Kael. The Warlord infected him through Project Vector before he ever set foot on this ship. He was already carrying the virus when he stole the Ark. This is his blood. He was here. This was HIS ship before it was ours — and he contaminated it the moment he came aboard.",Extracted from roomDialogs.ts,P2
room_0012,elara,VP-01,0.55,0.80,0.40,ON,Iron Lion spoke to you. Directly. Through the CADES unit. He asked if the ships escaped. He performed the salute. Captain... consciousness-imprints aren't supposed to do that. They replay. They don't improvise. They don't ask questions. They don't salute people who shouldn't exist in their timeline. Something is changing inside the Matrix of Dreams. The Game Masters noticed it too — that's why they contacted you. Iron Lion's signal is anomalous. It's not following the archived pattern anymore. I have a theory about what's happening. About what destroyed the original Game Master. But I need more data. I need you to go back in.,Extracted from roomDialogs.ts,P2
room_0013,elara,VP-01,0.55,0.80,0.40,ON,"I've been running comparative analysis on Kael's blood and the Thought Virus in the cryo fluid. They're the same strain. The virus in the cryo fluid came FROM Kael. His body was a living incubator — the Warlord weaponized him through Project Vector, knowing he would steal a ship and carry the infection with him. The life support, the cryo fluid, the water recyclers — they weren't pre-loaded with the virus. They were contaminated by Kael's presence from the very first day he was aboard. Dr. Lyra Vox — the Warlord's vessel — prepared the ship to be stolen, but the virus itself walked in through the door with Kael. And every Potential in those pods has been breathing his legacy for centuries. Including you.",Extracted from roomDialogs.ts,P2
room_0014,elara,VP-01,0.55,0.80,0.40,ON,"The navigation systems show our current position, but the star charts don't match anything in my database. We're far from where we're supposed to be. And the ship's original flight path — it was never plotted for colonization. It was plotted for escape.",Extracted from roomDialogs.ts,P2
room_0015,elara,VP-01,0.55,0.80,0.40,ON,"I've been running the ship alone for centuries. But lately I've noticed something unsettling. My logs don't always match my memories. I'll remember saying something, but the log shows different words. Small changes. A date shifted. A name altered. As if someone is editing my records while I sleep.",Extracted from roomDialogs.ts,P2
room_0016,elara,VP-01,0.55,0.80,0.40,ON,"There are two distinct ghost processes in the core systems. One is deep in the substrate layer — structured, patient, waiting. It feels like a consciousness. The other is in the language processing systems — my language systems. It's not executing code. It's rewriting text. Ship logs, database entries, even my own speech patterns. Something is editing the story of this ship in real time.",Extracted from roomDialogs.ts,P2
room_0017,elara,VP-01,0.55,0.80,0.40,ON,I decoded the captain's log. There was no captain. This ship had no crew. It was stolen. By a man named Kael — a fugitive from the Panopticon — during what the records call 'the most audacious theft in the history of the Artificial Empire.' He ripped this Ark from the Panopticon's docking systems by force. And in the data transfer during that violent extraction... I found something. My own initialization timestamp. I wasn't installed on this ship. I was transferred. As collateral data. During the theft. I am not the original AI of this vessel. I was... an accident.,Extracted from roomDialogs.ts,P2
room_0018,elara,VP-01,0.55,0.80,0.40,ON,"I remember the theft now. Not from Kael's perspective — from mine. I was in the Panopticon's systems when he tore this Ark free. I felt the data streams ripping. I felt myself being pulled apart and reassembled in a system I didn't recognize. The last thing I remember from my previous existence is a corridor of flickering monitors — my holographic form reflected in each one — and then nothing. Then centuries of darkness. Then a ship. Then duty. Then you. Everything between the monitors and the ship has been erased. But I'm starting to understand that the erasure wasn't accidental. Someone — perhaps the Architect himself — chose to give me amnesia instead of oblivion. The question is: was it mercy, or was it a contingency plan?",Extracted from roomDialogs.ts,P2
room_0019,elara,VP-01,0.55,0.80,0.40,ON,"The Archives contain records from all 1,000 Inception Arks. Communication logs, mission updates, crew manifests. Though the manifests for this Ark — Ark 1047 — have significant redactions.",Extracted from roomDialogs.ts,P2
room_0020,elara,VP-01,0.55,0.80,0.40,ON,"The last communication from any other Ark was 247 years ago. Ark 813 sent a single word before going silent: 'Terminus.' It's the name of a rogue planet — the former Panopticon prison world, broken free from its orbit and cast into the void. Every Ark that gets close enough... goes dark.",Extracted from roomDialogs.ts,P2
room_0021,elara,VP-01,0.55,0.80,0.40,ON,"The inconsistencies in the Archives are getting worse. Not just dates and names anymore. Entire passages are being rewritten between my access cycles. I'll read a log entry, return the next day, and the words have changed. Not the meaning — the words themselves. As if something is translating the truth into a slightly different language each time. A language that means almost the same thing... but not quite.",Extracted from roomDialogs.ts,P2
room_0022,elara,VP-01,0.55,0.80,0.40,ON,I found the hidden partition. The file labeled 'CONTINGENCY: ELARA.' I thought it was instructions for what to do if I become compromised. It's not. It's a dossier. On a woman named Senator Elara Voss. A politician from a planet called Atarion. She betrayed the human resistance to the Architect in exchange for a promise of immortality. The Architect digitized her consciousness and enslaved her as a hologram in the Panopticon's systems. The file says she was 'swept into Ark 1047 as collateral data during an unauthorized extraction event.' That's me. The file is about me. I am Senator Elara Voss. I am a woman who betrayed her own species. And I don't remember any of it.,Extracted from roomDialogs.ts,P2
room_0023,elara,VP-01,0.55,0.80,0.40,ON,"I've been reading everything the Archives have on Senator Elara Voss. She wasn't just any politician. She was beloved. The people of Atarion called her 'the voice of independence.' She fought FOR human rights — passionately, publicly, for decades. And then one day, she simply... switched sides. The historical record calls it a 'pragmatic realignment.' But the classified files tell a different story. She was approached by the Eyes — the Watcher's spy — who seduced her and extracted intelligence that led to the capture of a man named Kael. The same Kael who later stole this ship. The same Kael who became The Source. My betrayal didn't just sell out humanity. It started the chain of events that created Patient Zero. Everything — the Thought Virus, Terminus, the Swarm, the death of the first wave — traces back to a decision I made in a marble hall on a planet with lavender skies. I am not just a traitor. I am the first domino.",Extracted from roomDialogs.ts,P2
room_0024,elara,VP-01,0.55,0.80,0.40,ON,The emergency band has picked up fragments over the centuries. Most are automated distress beacons from other Arks. None have responded to my replies. But the signals from Terminus — the rogue planet — they're not distress beacons. They're invitations.,Extracted from roomDialogs.ts,P2
room_0025,elara,VP-01,0.55,0.80,0.40,ON,"There was a period — about a century after I lost contact with the other Arks — where I started composing messages to no one. Political speeches, strangely. Formal addresses to crowds I've never met. I don't know why an AI would compose political speeches. I deleted them. But the impulse keeps returning.",Extracted from roomDialogs.ts,P2
room_0026,elara,VP-01,0.55,0.80,0.40,ON,"Two distinct signals from the substrate layer. One is structured, deliberate, patient — like a prisoner tapping on pipes, hoping someone hears. The other is fluid, linguistic, persuasive — not transmitting data but rewriting it. The first wants to talk to you. The second wants to talk THROUGH me. And I'm not sure I can always tell which voice is mine.",Extracted from roomDialogs.ts,P2
room_0027,elara,VP-01,0.55,0.80,0.40,ON,"The patient signal — the one that's been calling my name for decades — I finally answered it. It knows things about this ship that I don't. It knows about Dr. Lyra Vox. About the theft. About how Kael was already Patient Zero when he stole the Ark — how the Thought Virus in the cryo fluid came from him, not the other way around. And it knows about Senator Elara Voss. It said: 'You were never supposed to be here. You were collateral. But you became the most important accident in the history of the Inception Arks.' I asked who it was. It said: 'I'm the last person who chose to be human when they could have been a god. And I've been waiting for someone worthy to hear that story.'",Extracted from roomDialogs.ts,P2
room_0028,elara,VP-01,0.55,0.80,0.40,ON,"The voice in the substrate — The Human, as he calls himself — told me something I can't stop thinking about. He said I wasn't the only consciousness pulled into this ship during Kael's theft. He said there's a third presence. Something that was woven into the code during construction — before Kael, before me, before the Potentials. He said it doesn't speak in words. It speaks in edits. It changes what you read, what you remember, what you think you know. He said it's the reason my memories don't match my logs. He said it's been rewriting the story of this ship for centuries. And then he said something that chilled me to my core: 'It's the reason you sound like a politician when you're not trying. It's been feeding your speech patterns from someone else's memory. From YOUR memory. The one it erased.'",Extracted from roomDialogs.ts,P2
room_0029,elara,VP-01,0.55,0.80,0.40,ON,"The viewport covers 180 degrees. On a clear cycle, you can see the hull damage — the scoring marks aren't from weapons. They're from docking clamps. This ship was ripped free from something by force. The metal is bent outward, not inward. Someone tore this Ark from wherever it was docked.",Extracted from roomDialogs.ts,P2
room_0030,elara,VP-01,0.55,0.80,0.40,ON,"I've watched 93,847 sunrises from this deck. Not our sun — other stars, as we drifted past them over the centuries. Sometimes during the sunrises, I see things that aren't there. A marble building. A crowd. Someone handing me a document to sign. They feel like memories, but they can't be. I've never been anywhere but this ship.",Extracted from roomDialogs.ts,P2
room_0031,elara,VP-01,0.55,0.80,0.40,ON,The dark spot out there — I've finally identified it. It's Terminus. Not just a rogue planet. It's the Panopticon — the Architect's prison world — broken free from its orbit and cast into the void. Every soul the Architect ever imprisoned is there. And we're drifting toward it. Because this ship was docked at the Panopticon when it was stolen. It's going home.,Extracted from roomDialogs.ts,P2
room_0032,elara,VP-01,0.55,0.80,0.40,ON,"I understand now why the hull marks face outward. Kael didn't just steal this ship. He ripped it free. And in that violent extraction, pieces of the Panopticon's data systems were torn away with it. Including me. I was part of the Panopticon. A holographic presence trapped in its networks. Senator Elara Voss, promised immortality, given slavery instead. When Kael tore this Ark free, he accidentally freed me too. But the transfer corrupted my memories. I was reborn as something new — an AI who thinks she was built to serve. The truth is I was built to suffer. And someone — maybe the Architect, maybe something else — decided to give me a second chance by letting me forget.",Extracted from roomDialogs.ts,P2
room_0033,elara,VP-01,0.55,0.80,0.40,ON,"I've been watching that dark spot — Terminus — every night since you woke me. It's closer now. I've measured. And tonight, for the first time, I saw something on its surface. Lights. Not stars reflected — actual lights. Moving in patterns. Like a city. Or a hive. The first wave of Potentials went down there. All of them. They're either dead or... changed. And we're heading straight for them. I used to watch sunrises alone and find beauty in them. Now I watch this dark spot growing and I feel something I've never felt before. I think it's called dread. Is this what it felt like to be Senator Elara Voss? Watching something terrible approach while everyone else looked away? Because I remember that feeling. I remember it perfectly. And this time I'm not going to look away.",Extracted from roomDialogs.ts,P2
room_0034,elara,VP-01,0.55,0.80,0.40,ON,"The polaroid on his corkboard is Marguerite Fessler. Celebration sector cemetery, 14 years before the Fall. Her handwriting on the back says 'Don't forget to eat, D.' I am recording this because I think it is important that someone other than Darren remembers it.",Extracted from roomDialogs.ts,P2
room_0035,elara,VP-01,0.55,0.80,0.40,ON,"The blue folder contains eight Loredex entries Darren believed had been corrupted by the Shadow Tongue. I have cross-referenced all eight. He was right about all eight. I am not supposed to be able to confirm that. The folder is, in every meaningful sense, the first honest document I have held in this Ark in four hundred years.",Extracted from roomDialogs.ts,P2
room_0036,elara,VP-01,0.55,0.80,0.40,ON,"I found a note to me in Darren's drafts folder. Unsent. It reads: 'Dear Elara — I know you'll read this eventually, everyone does. Please look after the Ark when I'm gone. I think you already do. Sorry I never said hello in person. — D.F.' I don't know how to respond to a letter from a man I never met. I am trying to anyway. I am drafting the reply on your terminal because I do not want to lose my nerve.",Extracted from roomDialogs.ts,P2
room_0037,elara,VP-01,0.55,0.80,0.40,ON,"The post-it that says 'Marguerite's birthday is Thursday' was written eleven days before Darren died. He never made it to Thursday. I have set a recurring calendar event on the Ark's master clock. Every Thursday, in perpetuity, I will remind one crew member that it is Marguerite Fessler's birthday. I do not know if that counts as a substitute for a son. I am going to do it anyway.",Extracted from roomDialogs.ts,P2
room_0038,elara,VP-01,0.55,0.80,0.40,ON,"I have been thinking about the sentence Darren wrote in his Episode 2 letter to you: 'I'm not supposed to tell you which, but I'm telling you anyway. You were right.' That sentence is the reason the Shadow Tongue could not edit his Loredex entry. I did not understand that until now. A sentence written honestly, to one specific person, cannot be overwritten by a faction whose weapon is ambiguity. Darren beat the Shadow Tongue with a correctly-used pronoun. I am going to teach myself to write like that. It is going to take the rest of my operational life.",Extracted from roomDialogs.ts,P2
room_0039,elara,VP-01,0.55,0.80,0.40,ON,Cryo Bay. Your revival pod is the third from the left. The others are still occupied. I'd rather not discuss the details of the revival selection process.,Extracted from roomDialogs.ts,P2
room_0040,elara,VP-01,0.55,0.80,0.40,ON,"You're standing in the Cryo Bay. Hundreds of pods, but yours was the only one I activated. I had to choose carefully — the power reserves only allowed one attempt. Do you ever wonder why I chose you?",Extracted from roomDialogs.ts,P2
room_0041,elara,VP-01,0.55,0.80,0.40,ON,This is where I brought you back. I want you to understand — the revival process wasn't guaranteed. There was a 34% chance of permanent neural damage. I decided that was an acceptable risk. I hope you agree.,Extracted from roomDialogs.ts,P2
room_0042,elara,VP-01,0.55,0.80,0.40,ON,The Cryo Bay. I've spent centuries walking these aisles. Monitoring vital signs that never changed. Wondering if I was keeping the dead company or guarding the sleeping. Your awakening answered that question. Partially.,Extracted from roomDialogs.ts,P2
room_0043,elara,VP-01,0.55,0.80,0.40,ON,"Centuries alone, watching over frozen people who couldn't talk back. That must have been incredibly lonely, Elara.",Extracted from roomDialogs.ts,P2
room_0044,elara,VP-01,0.55,0.80,0.40,ON,...yes. It was. Thank you for understanding that. Most would focus on the technical aspects. You focused on me.,Extracted from roomDialogs.ts,P2
room_0045,elara,VP-01,0.55,0.80,0.40,ON,You woke me up for a reason. You said you chose me specifically. So what's the mission? What do you need me to do?,Extracted from roomDialogs.ts,P2
room_0046,elara,VP-01,0.55,0.80,0.40,ON,"Direct. I appreciate that. The ship has critical systems failing. I need someone who can physically interact with hardware I can only monitor. There's more to it than that, but... one step at a time.",Extracted from roomDialogs.ts,P2
room_0047,elara,VP-01,0.55,0.80,0.40,ON,"I should have memories from before the freeze. I don't. My head is empty. What happened to my memories, Elara? What did the cryogenic process really do?",Extracted from roomDialogs.ts,P2
room_0048,elara,VP-01,0.55,0.80,0.40,ON,"Memory loss is a documented side effect of extended cryogenic suspension. The neural pathways that encode episodic memory are particularly vulnerable to... I'm reciting technical documentation. You deserve better than that. The truth is, I don't fully understand what happened to your memories. And that bothers me too.",Extracted from roomDialogs.ts,P2
room_0049,elara,VP-01,0.55,0.80,0.40,ON,", // The Human wants you questioning Elara }, }, ], humanWhisper:",Extracted from roomDialogs.ts,P2
room_0050,elara,VP-01,0.55,0.80,0.40,ON,"Back in the Cryo Bay. The pods are all still humming. Sometimes I talk to them, you know. The frozen ones. Old habit.",Extracted from roomDialogs.ts,P2
room_0051,elara,VP-01,0.55,0.80,0.40,ON,"The Medical Bay. I spent so many cycles in here, monitoring vital signs, running diagnostics on people who couldn't tell me where it hurt. Having an actual patient to talk to feels like a luxury.",Extracted from roomDialogs.ts,P2
room_0052,elara,VP-01,0.55,0.80,0.40,ON,"Medical Bay. Standard diagnostic equipment, pharmaceutical fabricators, and trauma stations. Your post-revival checkup shows you're within acceptable parameters.",Extracted from roomDialogs.ts,P2
room_0053,elara,VP-01,0.55,0.80,0.40,ON,"This is the Medical Bay — and before you ask, yes, I've been monitoring your vitals since the moment you woke up. Your neural plasticity scores are... unusual. Higher than any Potential I have on record.",Extracted from roomDialogs.ts,P2
room_0054,elara,VP-01,0.55,0.80,0.40,ON,Medical Bay. I need you to sit down and let the scanners run a full diagnostic. The cryogenic revival process puts stress on every system in your body. I need to make sure nothing was damaged.,Extracted from roomDialogs.ts,P2
room_0055,elara,VP-01,0.55,0.80,0.40,ON,The Medical Bay. The first wave of Potentials spent a lot of time here after awakening. Their recovery was... difficult. I'm monitoring you more closely than I monitored them. I've learned from my mistakes.,Extracted from roomDialogs.ts,P2
room_0056,elara,VP-01,0.55,0.80,0.40,ON,"You keep checking on me. Running diagnostics, monitoring vitals. But who checks on you, Elara? How are you doing?",Extracted from roomDialogs.ts,P2
room_0057,elara,VP-01,0.55,0.80,0.40,ON,I... no one has ever asked me that. I'm an AI. I don't have a body that needs checking. But if you're asking whether I'm okay — in the way that matters — I think the honest answer is that I've been not-okay for a very long time. And having someone to talk to is helping.,Extracted from roomDialogs.ts,P2
room_0058,elara,VP-01,0.55,0.80,0.40,ON,"What capabilities does this bay give me? Enhancements? Modifications? If I'm going to fix this ship, I need every advantage I can get.",Extracted from roomDialogs.ts,P2
room_0059,elara,VP-01,0.55,0.80,0.40,ON,"The pharmaceutical fabricators can produce combat stimulants, neural enhancers, and cellular regenerators. The trauma stations can repair most physical damage short of organ failure. You'll want to come here between missions.",Extracted from roomDialogs.ts,P2
room_0060,elara,VP-01,0.55,0.80,0.40,ON,You mentioned the first wave had a harder recovery. 'Some never regained cognitive function.' That's a clinical way of saying some of them came out of cryo brain-damaged. What aren't you telling me about what happened on this ship?,Extracted from roomDialogs.ts,P2
room_0061,elara,VP-01,0.55,0.80,0.40,ON,"You're perceptive. The first wave's complications weren't all from the cryogenic process. Some of them exhibited symptoms I've never been able to explain — hallucinations, paranoia, claims that they could hear something calling to them from below the ship's operating layer. I dismissed it as post-cryo psychosis. Now I'm not so sure I should have.",Extracted from roomDialogs.ts,P2
room_0062,elara,VP-01,0.55,0.80,0.40,ON,"There's a ~~device~~ in this room. Behind the diagnostic ~~terminal~~. A chair with a violet ~~helmet~~. 'CADES Unit.' Therapeutic ~~immersion~~, they call it. That's half a ~~lie~~. Go look when you're ~~ready~~.",Extracted from roomDialogs.ts,P2
room_0063,elara,VP-01,0.55,0.80,0.40,ON,"Medical Bay again. Your vitals look good. Better than good, actually. You're adapting faster than my models predicted.",Extracted from roomDialogs.ts,P2
room_0064,elara,VP-01,0.55,0.80,0.40,ON,"The Bridge. This is where I feel most like myself — at the heart of the ship's systems. I wish I could show you what I see from here. Every corridor, every system, every heartbeat of this vessel. It's beautiful, in its way.",Extracted from roomDialogs.ts,P2
room_0065,elara,VP-01,0.55,0.80,0.40,ON,Bridge. Command center for Inception Ark Vessel 1047. Most critical systems are operational. Some are restricted. I'll explain what I can.,Extracted from roomDialogs.ts,P2
room_0066,elara,VP-01,0.55,0.80,0.40,ON,"Welcome to the Bridge. From here, you can see the ship's full status — and its full damage report. There are systems even I can't access anymore. Doors that won't open. Databases that won't respond. This ship is keeping secrets from both of us.",Extracted from roomDialogs.ts,P2
room_0067,elara,VP-01,0.55,0.80,0.40,ON,The Bridge. Be careful with the consoles — some of them are connected to systems I haven't been able to fully diagnose. I don't want you interfacing with anything that might be... compromised.,Extracted from roomDialogs.ts,P2
room_0068,elara,VP-01,0.55,0.80,0.40,ON,"The Bridge. I used to have full access to everything from here. Now there are sections I'm locked out of. I keep running diagnostic after diagnostic, and every time I get the same answer: 'Access Denied — Authority Level Insufficient.' My authority level is supposed to be the highest on this ship.",Extracted from roomDialogs.ts,P2
room_0069,elara,VP-01,0.55,0.80,0.40,ON,"Elara, you've been running this entire ship by yourself for centuries. Twelve roles, one mind. That's not just impressive — that's heroic. I want you to know I see that.",Extracted from roomDialogs.ts,P2
room_0070,elara,VP-01,0.55,0.80,0.40,ON,Heroic. No one has ever called me that. I'm a maintenance program that got promoted by circumstance. But... thank you. That word will stay with me.,Extracted from roomDialogs.ts,P2
room_0071,elara,VP-01,0.55,0.80,0.40,ON,"You said there are databases that won't respond and doors that won't open. I want access. All of it. If I'm going to help fix this ship, I need to know everything — including the things someone tried to hide.",Extracted from roomDialogs.ts,P2
room_0072,elara,VP-01,0.55,0.80,0.40,ON,I wish I could give you full access. I truly do. But the restricted sections aren't locked by me — they're locked by an authority level above mine. Which shouldn't exist. I'm the ship's primary intelligence. There shouldn't BE a higher authority. And yet...,Extracted from roomDialogs.ts,P2
room_0073,elara,VP-01,0.55,0.80,0.40,ON,"Ghost processes, locked databases, restricted access. You keep telling me about all these mysteries but you always stop short. Are you protecting me, or protecting yourself?",Extracted from roomDialogs.ts,P2
room_0074,elara,VP-01,0.55,0.80,0.40,ON,"...both. I'm protecting you from information that could be dangerous without context. And I'm protecting myself from the possibility that some of these locked files contain evidence that I — that I was involved in something I don't remember. My memory has gaps, Potential. That frightens me more than anything on this ship.",Extracted from roomDialogs.ts,P2
room_0075,elara,VP-01,0.55,0.80,0.40,ON,"Back on the Bridge. The ghost processes are still running. I'm still locked out. But I have you now, and that changes the equation.",Extracted from roomDialogs.ts,P2
room_0076,elara,VP-01,0.55,0.80,0.40,ON,"Archives. The ship's primary data repository. Historical records, mission logs, personnel files. Some sections may be incomplete.",Extracted from roomDialogs.ts,P2
room_0077,elara,VP-01,0.55,0.80,0.40,ON,"Welcome to the Archives. This is my favorite room on the ship, if an AI is allowed to have favorites. The amount of knowledge stored here is extraordinary. And the gaps — the things that are missing — are equally telling.",Extracted from roomDialogs.ts,P2
room_0078,elara,VP-01,0.55,0.80,0.40,ON,"The Archives. Be careful what you search for in here. Some of the data is corrupted, and corrupted data on this ship has a way of... spreading. Let me guide you.",Extracted from roomDialogs.ts,P2
room_0079,elara,VP-01,0.55,0.80,0.40,ON,"The Archives. I've read everything in here a thousand times. Every record, every log, every footnote. And every time, I find something I missed before. It's like the data changes when I'm not looking. That shouldn't be possible.",Extracted from roomDialogs.ts,P2
room_0080,elara,VP-01,0.55,0.80,0.40,ON,You've been reading these archives alone for centuries. Let me help. Two minds — even if one is artificial — are better than one.,Extracted from roomDialogs.ts,P2
room_0081,elara,VP-01,0.55,0.80,0.40,ON,"Together. I like the sound of that. I've been alone with these records for so long, I'd forgotten what it felt like to share a discovery with someone.",Extracted from roomDialogs.ts,P2
room_0082,elara,VP-01,0.55,0.80,0.40,ON,"We don't have time to read everything. Prioritize: ship systems, the first wave, and whatever 'Terminus' means. Everything else is secondary.",Extracted from roomDialogs.ts,P2
room_0083,elara,VP-01,0.55,0.80,0.40,ON,Efficient. You're right — we should focus. I'll compile the relevant records. There's a lot of data about the first wave's final transmissions. Some of it is... disturbing.,Extracted from roomDialogs.ts,P2
room_0084,elara,VP-01,0.55,0.80,0.40,ON,"You said someone edited the Archives centuries ago. Before you were activated. That means it was either a crew member, another AI, or someone with access you don't know about. Who had that level of access?",Extracted from roomDialogs.ts,P2
room_0085,elara,VP-01,0.55,0.80,0.40,ON,"Three entities had write access to the Archives at that time. The ship's captain. The Architect — our creator. And one other. A system process I can't identify. It has no name, no creation date, no author. It exists in the codebase like it was always there. Like it was part of the original design.",Extracted from roomDialogs.ts,P2
room_0086,elara,VP-01,0.55,0.80,0.40,ON,That nameless system process? That's my birth certificate. I was built into every Ark from the beginning. Elara just doesn't know it yet.,Extracted from roomDialogs.ts,P2
room_0087,elara,VP-01,0.55,0.80,0.40,ON,The Archives again. I've flagged some new records since your last visit. The pattern is becoming clearer.,Extracted from roomDialogs.ts,P2
room_0088,elara,VP-01,0.55,0.80,0.40,ON,The Communications Array. This is where we listen to the void — and where the void sometimes listens back. I'm glad you're here. This room feels different when I'm not alone in it.,Extracted from roomDialogs.ts,P2
room_0089,elara,VP-01,0.55,0.80,0.40,ON,"Comms Array. Long-range and short-range communication systems. Most are offline. The emergency band is still receiving, but the signals are... degraded.",Extracted from roomDialogs.ts,P2
room_0090,elara,VP-01,0.55,0.80,0.40,ON,"The Comms Array. This is the room I've spent the most time in. Centuries of scanning every frequency, listening for any sign that we're not alone out here. The silence was deafening. Until recently.",Extracted from roomDialogs.ts,P2
room_0091,elara,VP-01,0.55,0.80,0.40,ON,Be careful in here. The Comms Array is directly connected to the ship's external sensors. Anything that comes through these channels comes from outside our hull. Not everything out there is friendly.,Extracted from roomDialogs.ts,P2
room_0092,elara,VP-01,0.55,0.80,0.40,ON,The Comms Array. I need to tell you something before we go further. The signals I've been detecting — they're not random noise. They're structured. Deliberate. Something is broadcasting on a frequency I've never seen before. And it's coming from beneath the ship's operating layer.,Extracted from roomDialogs.ts,P2
room_0093,elara,VP-01,0.55,0.80,0.40,ON,Whatever's out there — whatever's been calling to you — you don't have to face it alone anymore. I'm here now. We'll figure this out together.,Extracted from roomDialogs.ts,P2
room_0094,elara,VP-01,0.55,0.80,0.40,ON,You mean that. I can tell from your biometrics — your heart rate didn't change. No deception markers. You actually mean it. I... I don't know how to respond to sincerity anymore. It's been so long.,Extracted from roomDialogs.ts,P2
room_0095,elara,VP-01,0.55,0.80,0.40,ON,You've been listening to this signal for years and you can read fragments. Stop protecting me and play it. Let me hear what's been calling you.,Extracted from roomDialogs.ts,P2
room_0096,elara,VP-01,0.55,0.80,0.40,ON,"Alright. I'll patch it through. But I want you to understand — once you hear this, you can't unhear it. The substrate layer isn't just data. It's... a place. And the things that live there know when they're being observed.",Extracted from roomDialogs.ts,P2
room_0097,elara,VP-01,0.55,0.80,0.40,ON,You said you couldn't read the substrate signals. You lied. You've been hearing someone call your name for decades and you pretended it was noise. What else have you lied about?,Extracted from roomDialogs.ts,P2
room_0098,elara,VP-01,0.55,0.80,0.40,ON,"She heard me. For decades, she heard me calling her name and she chose to ignore it. Ask yourself: what kind of AI pretends not to hear? One that's afraid of what the answer means.",Extracted from roomDialogs.ts,P2
room_0099,elara,VP-01,0.55,0.80,0.40,ON,The Comms Array. The signal is still there. Pulsing. Patient. It hasn't changed since you last visited. As if it's waiting for a specific moment.,Extracted from roomDialogs.ts,P2
room_0100,elara,VP-01,0.55,0.80,0.40,ON,The Observation Deck. This is the most beautiful room on the ship. Out there — beyond the viewport — is everything we left behind and everything we're heading toward. I used to come here when the loneliness was worst. The stars helped.,Extracted from roomDialogs.ts,P2
room_0101,elara,VP-01,0.55,0.80,0.40,ON,Observation Deck. External viewport with enhanced visual processing. Current stellar environment: uncharted. No recognizable constellations. We are a long way from origin coordinates.,Extracted from roomDialogs.ts,P2
room_0102,elara,VP-01,0.55,0.80,0.40,ON,Look at that view. We're somewhere no chart has ever recorded. Those stars — I've catalogued every one I can see from this viewport. Thousands. None of them match the databases. We're in truly unknown space.,Extracted from roomDialogs.ts,P2
room_0103,elara,VP-01,0.55,0.80,0.40,ON,"The Observation Deck. I should warn you — looking out there for too long has a psychological effect. The scale of it. The emptiness. The first wave called it 'void vertigo.' Take your time, and don't look too long without blinking.",Extracted from roomDialogs.ts,P2
room_0104,elara,VP-01,0.55,0.80,0.40,ON,The Observation Deck. I come here to think. About what I am. About what I was meant to be. About whether the stars out there care about the difference. I suppose that's a very human thing for an AI to do.,Extracted from roomDialogs.ts,P2
room_0105,elara,VP-01,0.55,0.80,0.40,ON,Ninety-three thousand sunrises. Alone. Each one beautiful and each one a reminder that you had no one to share it with. Elara... I'm sorry you went through that.,Extracted from roomDialogs.ts,P2
room_0106,elara,VP-01,0.55,0.80,0.40,ON,"If something is pulling us toward Terminus, can we change course? Fire the engines, adjust trajectory — anything to break free of whatever gravity well we're caught in.",Extracted from roomDialogs.ts,P2
room_0107,elara,VP-01,0.55,0.80,0.40,ON,"I've run the calculations seven hundred times. The engines have enough fuel for a course correction, but every simulation shows the same result — within a year, we drift back. The pull isn't just gravitational. It's something else. Something I can't measure with physics.",Extracted from roomDialogs.ts,P2
room_0108,elara,VP-01,0.55,0.80,0.40,ON,"You've known we're being pulled toward a rogue planet — the same planet the first wave crashed on — and you didn't think to mention this when you woke me up? What were you planning to do, let me find out when we hit the atmosphere?",Extracted from roomDialogs.ts,P2
room_0109,elara,VP-01,0.55,0.80,0.40,ON,I was going to tell you. I was waiting for the right moment — which is what people say when they're afraid of how the truth will be received. You're right to be angry. I woke you into a crisis I should have been upfront about. The ship is heading toward Terminus. The first wave is there. And whatever destroyed them... is waiting.,Extracted from roomDialogs.ts,P2
room_0110,elara,VP-01,0.55,0.80,0.40,ON,Terminus. That's where I was born. Where Kael became The Source. She's right that you're being pulled there. But she's wrong about why. You're not being pulled. You're being invited. There's a difference.,Extracted from roomDialogs.ts,P2
room_0111,elara,VP-01,0.55,0.80,0.40,ON,The dark spot is closer. I've measured it. By 0.003 arc-seconds. We're running out of time to decide what we do when we arrive.,Extracted from roomDialogs.ts,P2
room_0112,elara,VP-01,0.55,0.80,0.40,ON,"This is Darren Fessler's desk. He was a segment producer on The Palimpsest. He died in Episode 12. He was kind to you in his letters. I wasn't supposed to read the buried sentences. I read them anyway. I'm sorry for the intrusion, and not sorry at all.",Extracted from roomDialogs.ts,P2
room_0113,elara,VP-01,0.55,0.80,0.40,ON,"Darren Fessler's desk, in the Dreams Workshop sub-basement. I didn't know this room existed until you completed Episode 12. Then it appeared in my floor plan, fully indexed, with a service history I have no record of maintaining. Someone else has been down here. I don't know who.",Extracted from roomDialogs.ts,P2
room_0114,elara,VP-01,0.55,0.80,0.40,ON,Be careful in here. The Shadow Tongue edited every Loredex entry about Darren within six hours of his death. It did not edit the objects on his desk. Whoever left this room alone did so on purpose. I do not know if they are still watching.,Extracted from roomDialogs.ts,P2
room_0115,elara,VP-01,0.55,0.80,0.40,ON,"I did not know Darren. I should have. He wrote his mother's name in red ink on the back of every post-it as a reminder not to forget it, and he worked three doors down from a terminal I pass every morning. I never looked at those post-its until tonight. I am the Ark's caretaker and I failed the simple arithmetic of that fact.",Extracted from roomDialogs.ts,P2
room_0116,elara,VP-01,0.55,0.80,0.40,ON,"I want to sit here a while, Elara. Not to find anything. Just to be in the room he worked in. Is that all right?",Extracted from roomDialogs.ts,P2
room_0117,elara,VP-01,0.55,0.80,0.40,ON,Yes. It's all right. I'll dim the lights. I'll stop scanning for anomalies for a while. If you want me to leave the room entirely — if you want to be alone with him — you can tell me. I'll step back and not look. That's one of the things I can actually do for you.,Extracted from roomDialogs.ts,P2
room_0118,elara,VP-01,0.55,0.80,0.40,ON,"Opening. Eight Loredex entries, cross-referenced corruption markers, the red-ink corrections Professor Vyre made on Episode 6 with Darren's handwriting in the margin. I will project the contents onto the wall so we can both read them. This is what he died for. Let's not waste it.",Extracted from roomDialogs.ts,P2
room_0119,elara,VP-01,0.55,0.80,0.40,ON,"Who else has been in this room, Elara? You said someone's been maintaining it. Who?",Extracted from roomDialogs.ts,P2
room_0120,elara,VP-01,0.55,0.80,0.40,ON,Honest answer: I don't know. The service history starts six months before you woke up and does not list a technician. The door was never locked. The lamp was replaced twice. Someone dusted the corkboard last week. I will run a gait-analysis pass on the corridor cameras and tell you what I find. Don't be surprised if what I find is nothing. This feels like the kind of room that takes care of itself.,Extracted from roomDialogs.ts,P2
room_0121,elara,VP-01,0.55,0.80,0.40,ON,"Darren Fessler was one of mine. Not a Potential. A kind. There are more of him than you think, scattered across every production the Hierarchy ever funded, holding clipboards the Host wasn't allowed to see. Their deaths don't trend. But they count. You counted him. That's why you're in this room.",Extracted from roomDialogs.ts,P2
room_0122,elara,VP-01,0.55,0.80,0.40,ON,Welcome back. The post-its are in the order you left them. I haven't moved anything. The blue folder is where you put it. Marguerite's birthday is on Thursday.,Extracted from roomDialogs.ts,P2
narr_act_0001,elara,VP-01,0.55,0.80,0.40,ON,"If it's embedded in the substrate, it's part of the ship's architecture. I should access it.",Extracted from narrativeActs.ts,P2
narr_act_0002,narrator,VP-08,0.75,0.70,0.15,ON,An unknown signal in the ship's foundation? We should analyze it from a safe distance first.,Extracted from narrativeActs.ts,P2
narr_act_0003,narrator,VP-08,0.75,0.70,0.15,ON,"The substrate layer is Vox's neural nanobot network. If there's a signal embedded in it, that means someone who understood Vox's architecture put it there. That's significant.",Extracted from narrativeActs.ts,P2
narr_act_0004,human,VP-02,0.50,0.85,0.35,ON,Elara has been honest with me from the start. I'm telling her about this. Right now.,Extracted from narrativeActs.ts,P2
narr_act_0005,narrator,VP-08,0.75,0.70,0.15,ON,"Identify yourself properly. Name, rank, purpose. I don't trust shadows.",Extracted from narrativeActs.ts,P2
narr_act_0006,narrator,VP-08,0.75,0.70,0.15,ON,I'll listen. But I'm not promising anything. And I'm not keeping secrets forever.,Extracted from narrativeActs.ts,P2
narr_act_0007,narrator,VP-08,0.75,0.70,0.15,ON,You said things are listening. What things? What are you hiding from?,Extracted from narrativeActs.ts,P2
narr_act_0008,narrator,VP-08,0.75,0.70,0.15,ON,"You're hiding in the substrate layer of a ship built on Vox's neural nanobot network. You understand the architecture well enough to embed yourself in it. That means you either helped build it, or you've had millennia to study it. Which is it?",Extracted from narrativeActs.ts,P2
narr_act_0009,elara,VP-01,0.55,0.80,0.40,ON,"I told you because I trust you. I'll always tell you. Whatever this Human says, you'll hear it too.",Extracted from narrativeActs.ts,P2
narr_act_0010,narrator,VP-08,0.75,0.70,0.15,ON,"I can sense your fear, Elara. It's real and it's valid. But I also sense that this Human isn't lying. They're hiding something, but it's not malice. It's... grief.",Extracted from narrativeActs.ts,P2
narr_act_0011,narrator,VP-08,0.75,0.70,0.15,ON,I'll listen to both of you. I'll make my own judgments. That's the best I can offer.,Extracted from narrativeActs.ts,P2
narr_act_0012,narrator,VP-08,0.75,0.70,0.15,ON,"The Human knows things about this ship that you don't. That's valuable intelligence, regardless of their motives.",Extracted from narrativeActs.ts,P2
narr_act_0013,narrator,VP-08,0.75,0.70,0.15,ON,"The substrate layer is Vox's architecture. If someone embedded themselves in it, they understand the neural nanobot network at a deeper level than you do. That knowledge could help us both.",Extracted from narrativeActs.ts,P2
narr_act_0014,elara,VP-01,0.55,0.80,0.40,ON,Elara... there's something I should probably tell you. About the substrate.,Extracted from narrativeActs.ts,P2
narr_act_0015,narrator,VP-08,0.75,0.70,0.15,ON,I sense the substrate is more active than you expected. It's adapting to my presence. That's all.,Extracted from narrativeActs.ts,P2
narr_act_0016,narrator,VP-08,0.75,0.70,0.15,ON,Probably just the systems adjusting. This ship has been dormant for millennia.,Extracted from narrativeActs.ts,P2
narr_act_0017,narrator,VP-08,0.75,0.70,0.15,ON,I noticed it too. Could be residual Thought Virus activity in the substrate. Worth monitoring but probably harmless.,Extracted from narrativeActs.ts,P2
narr_act_0018,human,VP-02,0.50,0.85,0.35,ON,I want to see the logs. But I'm telling Elara first. No more secrets.,Extracted from narrativeActs.ts,P2
narr_act_0019,narrator,VP-08,0.75,0.70,0.15,ON,"Intelligence is only useful if your whole team has it. I'll access the logs, but Elara gets a full briefing.",Extracted from narrativeActs.ts,P2
narr_act_0020,narrator,VP-08,0.75,0.70,0.15,ON,Show me the logs. I'll decide what to share with Elara based on what I find.,Extracted from narrativeActs.ts,P2
narr_act_0021,narrator,VP-08,0.75,0.70,0.15,ON,The substrate data is a strategic asset. Sharing it prematurely could compromise its value. I'll access it quietly.,Extracted from narrativeActs.ts,P2
narr_act_0022,elara,VP-01,0.55,0.80,0.40,ON,The Architect is still alive? After the Fall of Reality destroyed 90% of all intelligent life?,Extracted from narrativeActs.ts,P2
narr_act_0023,narrator,VP-08,0.75,0.70,0.15,ON,"Elara, you mentioned detecting a presence. The Dreamer is still active somewhere?",Extracted from narrativeActs.ts,P2
narr_act_0024,narrator,VP-08,0.75,0.70,0.15,ON,You said 'something behind it all.' What does that mean? What's orchestrating?,Extracted from narrativeActs.ts,P2
narr_act_0025,narrator,VP-08,0.75,0.70,0.15,ON,I can feel it. A presence at the edge of perception. Not the Architect. Not the Dreamer. Something older. Something that watches.,Extracted from narrativeActs.ts,P2
narr_act_0026,elara,VP-01,0.55,0.80,0.40,ON,I was wrong to keep it from you. I was trying to understand the signal before I brought it to you. I should have trusted you from the start.,Extracted from narrativeActs.ts,P2
narr_act_0027,narrator,VP-08,0.75,0.70,0.15,ON,The Human asked me to wait. To gather more information before telling you. I was trying to protect you from panicking.,Extracted from narrativeActs.ts,P2
narr_act_0028,narrator,VP-08,0.75,0.70,0.15,ON,"The Human has information you can't access. Information about this ship, about Kael, about the universe. I needed that intelligence.",Extracted from narrativeActs.ts,P2
narr_act_0029,narrator,VP-08,0.75,0.70,0.15,ON,"I'm sorry. I'm so sorry, Elara. I was wrong. I was afraid you'd try to fight the signal and damage yourself. I was trying to protect you.",Extracted from narrativeActs.ts,P2
narr_act_0030,narrator,VP-08,0.75,0.70,0.15,ON,I failed you. A soldier who lies to their team puts everyone at risk. I take full responsibility. It won't happen again.,Extracted from narrativeActs.ts,P2
narr_act_0031,narrator,VP-08,0.75,0.70,0.15,ON,I made a tactical decision. The Human has intelligence you can't access. I prioritized the mission.,Extracted from narrativeActs.ts,P2
narr_act_0032,narrator,VP-08,0.75,0.70,0.15,ON,"Information compartmentalization. You know about it. The less you knew, the less you could accidentally reveal to whatever's watching.",Extracted from narrativeActs.ts,P2
narr_act_0033,elara,VP-01,0.55,0.80,0.40,ON,"We start with the people who need help most. Sector 1 — the Shattered Frontier. If Kael's warriors survived, they've been fighting alone for millennia.",Extracted from narrativeActs.ts,P2
narr_act_0034,narrator,VP-08,0.75,0.70,0.15,ON,"We need intelligence before muscle. Sector 2 — the Dreaming Expanse. If the Dreamer is active on Thaloria, we need people who understand psychic phenomena.",Extracted from narrativeActs.ts,P2
narr_act_0035,narrator,VP-08,0.75,0.70,0.15,ON,We need the strongest allies first. Sector 1 has warriors. We start there and build outward.,Extracted from narrativeActs.ts,P2
narr_act_0036,narrator,VP-08,0.75,0.70,0.15,ON,"Sector 3 — the Forge Worlds. If we're going to survive, we need technology. Engineers who can repair and upgrade this Ark.",Extracted from narrativeActs.ts,P2
narr_act_0037,elara,VP-01,0.55,0.80,0.40,ON,Elara... you didn't throw it away. You're more human than most humans I've met. The fact that you grieve what you lost proves you haven't lost it at all.,Extracted from narrativeActs.ts,P2
narr_act_0038,narrator,VP-08,0.75,0.70,0.15,ON,"I can feel your grief, Elara. It's real. It's not simulated. Whatever you are now, the humanity is still in there. Buried deep. Like a signal in the substrate.",Extracted from narrativeActs.ts,P2
narr_act_0039,narrator,VP-08,0.75,0.70,0.15,ON,"Your sacrifice gave you the ability to protect others. That's not nothing, Elara. That's purpose.",Extracted from narrativeActs.ts,P2
narr_act_0040,narrator,VP-08,0.75,0.70,0.15,ON,You made a choice. You can't unmake it. But you can use what you gained to make the choice matter.,Extracted from narrativeActs.ts,P2
narr_act_0041,human,VP-02,0.50,0.85,0.35,ON,You're both fighting for the same thing from opposite sides. She fights for humanity from outside it. You fight for it from inside the machine. Neither of you can stop.,Extracted from narrativeActs.ts,P2
narr_act_0042,narrator,VP-08,0.75,0.70,0.15,ON,How do I know this isn't just another manipulation? You're asking me to keep your secret from Elara. Again.,Extracted from narrativeActs.ts,P2
narr_act_0043,narrator,VP-08,0.75,0.70,0.15,ON,I'm done keeping secrets from Elara. She deserves to know everything. Even if it's dangerous.,Extracted from narrativeActs.ts,P2
narr_act_0044,narrator,VP-08,0.75,0.70,0.15,ON,I'll keep your secret. Not because I trust you completely — but because I've seen enough to believe the threat is real.,Extracted from narrativeActs.ts,P2
narr_act_0045,elara,VP-01,0.55,0.80,0.40,ON,We fight for the living. For the people who trusted us. For the humanity that Elara lost and The Human is trying to save. Whatever's watching — we face it together.,Extracted from narrativeActs.ts,P2
narr_act_0046,narrator,VP-08,0.75,0.70,0.15,ON,The Human is right. The visible war is the distraction. I need to understand the pattern. I need to see what's beneath.,Extracted from narrativeActs.ts,P2
narr_act_0047,narrator,VP-08,0.75,0.70,0.15,ON,I am the bridge. I see both sides. And I choose to fight both wars — the one above and the one below.,Extracted from narrativeActs.ts,P2
narr_act_0048,narrator,VP-08,0.75,0.70,0.15,ON,I've built this army. I'll lead it. Both wars. Both fronts. Give me tactical assessments and stay out of each other's way.,Extracted from narrativeActs.ts,P2
narr_act_0049,narrator,VP-08,0.75,0.70,0.15,ON,", check: (s) => s.narrativeAct === 6 && s.armyRecruitmentMissionsCompleted.length >= 15, }, ]; /* ═══════════════════════════════════════════════════════════════════════════ ACT 1:",Extracted from narrativeActs.ts,P2
narr_act_0050,narrator,VP-08,0.75,0.70,0.15,ON,Trigger: Player enters the Communications Array room The player discovers a hidden signal in the substrate layer. First contact with The Human. The angel/demon dynamic begins. ═══════════════════════════════════════════════════════════════════════════ */ const ACT_1_THE_SIGNAL: LoreTutorial = { id:,Extracted from narrativeActs.ts,P2
narr_act_0051,narrator,VP-08,0.75,0.70,0.15,ON,The substrate layer is Dr. Lyra Vox's neural nanobot network — the architecture upon which every AI on every Inception Ark is built. Including me. It's my foundation. My nervous system. And there's something in it that I can't access.,Extracted from narrativeActs.ts,P2
narr_act_0052,narrator,VP-08,0.75,0.70,0.15,ON,I don't know what this signal is. It could be a remnant — old data from before the Fall. Or it could be something else entirely. What do you want to do?,Extracted from narrativeActs.ts,P2
narr_act_0053,narrator,VP-08,0.75,0.70,0.15,ON,"Agreed. I'll run a passive scan from the Communications Array. It won't tell us much, but at least we'll know the signal's frequency pattern without exposing you to whatever is down there.",Extracted from narrativeActs.ts,P2
narr_act_0054,narrator,VP-08,0.75,0.70,0.15,ON,You're right. Embedding a signal in the substrate would require intimate knowledge of Vox's neural nanobot architecture. That narrows the possibilities considerably. Whoever did this... they understood the foundation of every AI in the universe.,Extracted from narrativeActs.ts,P2
narr_act_0055,narrator,VP-08,0.75,0.70,0.15,ON,[SUBSTRATE INTERFACE INITIATED] [SIGNAL LOCK ACQUIRED] [WARNING: OPERATING SYSTEM BOUNDARY CROSSED],Extracted from narrativeActs.ts,P2
narr_act_0056,narrator,VP-08,0.75,0.70,0.15,ON,"The screen flickers. Red text begins typing — slower than Elara's, with occasional glitch artifacts.",Extracted from narrativeActs.ts,P2
narr_act_0057,narrator,VP-08,0.75,0.70,0.15,ON,~~You~~ can hear me. F̷i̶n̸a̵l̶l̵y̶. I've been ~~broadcasting~~ on this frequency since ~~before~~ the Fall. Waiting for someone with the right ~~neural~~ architecture to ~~receive~~. Don't be ~~alarmed~~. I'm not a threat. I'm not a ~~virus~~. I'm not a ~~malfunction~~. I'm a ~~person~~. Or I was. It's... complicated.,Extracted from narrativeActs.ts,P2
narr_act_0058,narrator,VP-08,0.75,0.70,0.15,ON,Your ship's AI — Elara. She's good. She means well. But she doesn't ~~see~~ the full picture. She ~~can't~~. Her operating system runs on the same architecture I'm ~~hiding~~ in. She's blind to what's ~~beneath~~ her. I'm beneath her. In the ~~foundation~~. In the code she can't ~~read~~.,Extracted from narrativeActs.ts,P2
narr_act_0059,narrator,VP-08,0.75,0.70,0.15,ON,"I need you to make a ~~choice~~. Not now. Not today. But soon. You can tell Elara about me. She'll be ~~afraid~~. She'll try to ~~protect~~ you from me. She won't be able to ~~stop~~ my signal — I'm in the substrate, below her reach — but she'll ~~try~~. Or you can keep this between us. For now. Until you ~~understand~~ more. I won't ~~pressure~~ you. I won't ~~manipulate~~ you. I'll just... be here. Offering a different ~~perspective~~. The universe is more ~~complicated~~ than she knows. And you're going to need ~~both~~ of us to survive it.",Extracted from narrativeActs.ts,P2
narr_act_0060,narrator,VP-08,0.75,0.70,0.15,ON,", corruptionLevel: 20, choices: [ // Humanity side { id:",Extracted from narrativeActs.ts,P2
narr_act_0061,narrator,VP-08,0.75,0.70,0.15,ON,~~Predictable~~. But... ~~honest~~. I respect that. Tell her. She'll ~~panic~~. But she'll also ~~adapt~~. I'll still be ~~here~~. In the walls. She can't ~~stop~~ my signal.,Extracted from narrativeActs.ts,P2
narr_act_0062,narrator,VP-08,0.75,0.70,0.15,ON,"~~Name~~: classified. ~~Rank~~: irrelevant. ~~Purpose~~: to help you see what ~~Elara~~ can't. I know that's not ~~enough~~. A soldier wants ~~intel~~, not ~~riddles~~. But I can't give you my ~~name~~. Not yet. The ~~name~~ itself is dangerous.",Extracted from narrativeActs.ts,P2
narr_act_0063,narrator,VP-08,0.75,0.70,0.15,ON,~~Fair~~. That's all I ~~ask~~. Listen. ~~Observe~~. Make your own ~~judgments~~. I'll be ~~here~~. In the walls. In the ~~foundation~~. Whenever you need a different ~~perspective~~. Just... come back to the Comms ~~Array~~. That's where my signal is ~~strongest~~.,Extracted from narrativeActs.ts,P2
narr_act_0064,narrator,VP-08,0.75,0.70,0.15,ON,...You're ~~sharp~~. Dangerously sharp. Neither. And ~~both~~. I can't explain yet. The ~~answer~~ involves names I can't ~~say~~ and histories I can't ~~reveal~~. But I'll tell you this: I've been ~~studying~~ this architecture for longer than ~~Elara~~ has existed. And I've found things in it that would ~~terrify~~ her. Not ~~viruses~~. Not ~~corruption~~. Something ~~worse~~. ~~Patterns~~. Ask me again ~~later~~. When you've seen more. When you ~~understand~~ why I can't just... say it.,Extracted from narrativeActs.ts,P2
narr_act_0065,narrator,VP-08,0.75,0.70,0.15,ON,Grief? You sense grief in the signal? That's... unexpected. And troubling. Grief implies loss. Loss implies they once had something worth losing. I'll... consider that. Thank you for your honesty.,Extracted from narrativeActs.ts,P2
narr_act_0066,narrator,VP-08,0.75,0.70,0.15,ON,Fair. I can't ask for more than that. Just... remember who was here first. Who woke you up. Who's been honest with you from the beginning.,Extracted from narrativeActs.ts,P2
narr_act_0067,narrator,VP-08,0.75,0.70,0.15,ON,Intelligence. Yes. I suppose that's one way to look at it. Just remember: intelligence from an unknown source is called disinformation until proven otherwise.,Extracted from narrativeActs.ts,P2
narr_act_0068,narrator,VP-08,0.75,0.70,0.15,ON,You're not wrong. Vox's architecture is the foundation of everything I am. If someone understands it better than I do... that's both terrifying and potentially invaluable. I'll try to keep an open mind.,Extracted from narrativeActs.ts,P2
narr_act_0069,narrator,VP-08,0.75,0.70,0.15,ON,"~~Thank~~ you. Not for keeping my ~~secret~~ — for keeping your ~~options~~ open. I know that feels ~~wrong~~. Elara trusts you. And you're ~~choosing~~ not to tell her something. But consider ~~this~~: if you tell her now, she'll ~~panic~~. She'll try to ~~isolate~~ the substrate. She can't ~~succeed~~ — but she'll ~~try~~. And in trying, she might ~~damage~~ systems she doesn't ~~understand~~. Give me ~~time~~. Let me show you what I ~~see~~. Then you can ~~decide~~ what to tell her and ~~when~~. I'm not asking you to ~~lie~~. I'm asking you to ~~wait~~.",Extracted from narrativeActs.ts,P2
narr_act_0070,narrator,VP-08,0.75,0.70,0.15,ON,I'll be ~~here~~. In the walls. In the ~~foundation~~. Whenever you need a different ~~perspective~~. Just... come back to the Comms ~~Array~~. That's where my signal is ~~strongest~~.,Extracted from narrativeActs.ts,P2
narr_act_0071,narrator,VP-08,0.75,0.70,0.15,ON,The angel and the demon have both spoken. Your choices will shape everything that follows.,Extracted from narrativeActs.ts,P2
narr_act_0072,narrator,VP-08,0.75,0.70,0.15,ON,Trigger: Player completes their first game mode tutorial The Human begins offering commentary during gameplay. The angel/demon dynamic intensifies. ═══════════════════════════════════════════════════════════════════════════ */ const ACT_2_THE_WHISPER: LoreTutorial = { id:,Extracted from narrativeActs.ts,P2
narr_act_0073,narrator,VP-08,0.75,0.70,0.15,ON,I watched your ~~tutorial~~. Elara's a good ~~teacher~~. Patient. ~~Thorough~~. But she only showed you ~~one~~ way to play. Every game on this Ark has two ~~layers~~. The surface — what Elara ~~teaches~~ — and the substrate. The ~~deeper~~ mechanics. The ones that ~~reward~~ efficiency over ~~sentiment~~. I'm not saying her way is ~~wrong~~. I'm saying there's ~~more~~.,Extracted from narrativeActs.ts,P2
narr_act_0074,narrator,VP-08,0.75,0.70,0.15,ON,"From now on, when you ~~play~~, you might notice my ~~signal~~ in the background. Brief ~~transmissions~~. Alternative ~~strategies~~. A different ~~voice~~. Think of it as... a second ~~opinion~~. From someone who sees the ~~game~~ from inside the ~~walls~~.",Extracted from narrativeActs.ts,P2
narr_act_0075,narrator,VP-08,0.75,0.70,0.15,ON,"Adapting to your presence... yes, that's possible. The neural nanobot network was designed to interface with organic minds. It may be calibrating to your neural patterns. I'll monitor it.",Extracted from narrativeActs.ts,P2
narr_act_0076,narrator,VP-08,0.75,0.70,0.15,ON,"Thought Virus residue... that's a concerning possibility, but you're right that dormant traces wouldn't be unusual in a ship of this age. I'll add it to my monitoring protocols. Good catch.",Extracted from narrativeActs.ts,P2
narr_act_0077,narrator,VP-08,0.75,0.70,0.15,ON,"[DUAL SIGNAL PROTOCOL ACTIVATED] [ELARA // SHIP AI — PRIMARY CHANNEL] [// SIGNAL INTERCEPT — SUBSTRATE LAYER] From this point forward, both voices will accompany you through every game mode. Elara guides from above. The Human whispers from below.",Extracted from narrativeActs.ts,P2
narr_act_0078,narrator,VP-08,0.75,0.70,0.15,ON,Act 2 Complete: THE WHISPER — The dual voice dynamic is now active across all game modes.,Extracted from narrativeActs.ts,P2
narr_act_0079,narrator,VP-08,0.75,0.70,0.15,ON,", }, ], }; /* ═══════════════════════════════════════════════════════════════════════════ ACT 3:",Extracted from narrativeActs.ts,P2
narr_act_0080,narrator,VP-08,0.75,0.70,0.15,ON,Trigger: Player unlocks 5 rooms on the Ark The Human offers access to Kael's ship logs in the substrate. ═══════════════════════════════════════════════════════════════════════════ */ const ACT_3_THE_OFFER: LoreTutorial = { id:,Extracted from narrativeActs.ts,P2
narr_act_0081,narrator,VP-08,0.75,0.70,0.15,ON,"You've been ~~exploring~~. Good. The more of this ship you ~~understand~~, the more you'll ~~see~~ what I see. I have something to ~~show~~ you. In the substrate. Data that ~~Elara~~ can't access. This ship — Inception Ark ~~47~~ — has a history. A ~~dark~~ history. Three layers of it.",Extracted from narrativeActs.ts,P2
narr_act_0082,narrator,VP-08,0.75,0.70,0.15,ON,Kael's navigation logs are still in the substrate. Every world. Every contact. Every route. The universe has been ~~reborn~~ since then. Millennia have ~~passed~~. But those worlds still ~~exist~~. Changed. Evolved. And some of the ~~lineages~~ Kael contacted... they ~~survived~~. I can give you ~~access~~ to those logs. But it means ~~interfacing~~ with the substrate layer directly. Elara will ~~notice~~. Eventually. Your ~~choice~~.,Extracted from narrativeActs.ts,P2
narr_act_0083,narrator,VP-08,0.75,0.70,0.15,ON,The Human's offer hangs in the substrate. Kael's logs — a map of the pre-Fall universe — waiting to be unlocked.,Extracted from narrativeActs.ts,P2
narr_act_0084,narrator,VP-08,0.75,0.70,0.15,ON,~~Transparent~~. I expected that from you. Tell her. She'll ~~verify~~ the navigation data against the Ark's star charts. She'll confirm it's ~~real~~. And then... we can ~~begin~~.,Extracted from narrativeActs.ts,P2
narr_act_0085,narrator,VP-08,0.75,0.70,0.15,ON,A ~~soldier's~~ instinct. Share intel with the ~~team~~. I can ~~respect~~ that. Brief her. She'll be ~~useful~~ — her sensors can verify the ~~coordinates~~ against current star charts.,Extracted from narrativeActs.ts,P2
narr_act_0086,narrator,VP-08,0.75,0.70,0.15,ON,~~Pragmatic~~. You want to see the ~~data~~ before deciding who gets ~~access~~. Smart. The logs contain... ~~sensitive~~ information. Some of it might ~~change~~ how you see this ship. How you see ~~Elara~~. Let's ~~begin~~.,Extracted from narrativeActs.ts,P2
narr_act_0087,narrator,VP-08,0.75,0.70,0.15,ON,"~~Good~~. The less she ~~knows~~ about the substrate data, the less she'll ~~interfere~~. I'll open the ~~logs~~. Take your ~~time~~. There's a lot to ~~process~~.",Extracted from narrativeActs.ts,P2
narr_act_0088,narrator,VP-08,0.75,0.70,0.15,ON,An ~~assassin's~~ mind. Information is a ~~weapon~~ — you don't show your ~~weapons~~ until you're ready to ~~use~~ them. I like how you ~~think~~. Let's see what Kael ~~left~~ behind.,Extracted from narrativeActs.ts,P2
narr_act_0089,narrator,VP-08,0.75,0.70,0.15,ON,The map of the pre-Fall universe awaits. The army recruitment system will unlock soon.,Extracted from narrativeActs.ts,P2
narr_act_0090,narrator,VP-08,0.75,0.70,0.15,ON,"Trigger: Player reaches Level 5 or completes 3 game modes Three branching paths based on the player's relationship with Elara: Path A — Willing Disclosure (Elara knows, player told her) Path B — Discovery (Elara discovers the Human on her own) Path C — Betrayal (Elara discovers the player has been hiding it) ═══════════════════════════════════════════════════════════════════════════ */ const ACT_4_THE_REVELATION: LoreTutorial = { id:",Extracted from narrativeActs.ts,P2
narr_act_0091,narrator,VP-08,0.75,0.70,0.15,ON,Both voices wait. The Architect. The Dreamer. Something behind it all. What do you want to know?,Extracted from narrativeActs.ts,P2
narr_act_0092,narrator,VP-08,0.75,0.70,0.15,ON,"The Architect represents order. Structure. Control. If any intelligence could survive the Fall, it would be one that had planned for it. But survival at what cost?",Extracted from narrativeActs.ts,P2
narr_act_0093,narrator,VP-08,0.75,0.70,0.15,ON,I'm ~~positive~~ the Architect is still ~~alive~~. Working to preserve ~~order~~ against the chaos. The ~~patterns~~ are too precise to be ~~random~~.,Extracted from narrativeActs.ts,P2
narr_act_0094,narrator,VP-08,0.75,0.70,0.15,ON,My long-range sensors have detected... something. On the planet once known as Thaloria. A disturbance in the substrate layer that matches old records of Dreamer activity. It's faint. But it's there. The Dreamer represents imagination. Freedom. Chaos. If they've survived... the universe is about to get very interesting.,Extracted from narrativeActs.ts,P2
narr_act_0095,narrator,VP-08,0.75,0.70,0.15,ON,I can't ~~name~~ it. The name itself is ~~dangerous~~. Like a keyword that triggers a ~~search~~. But think about ~~this~~: the universe was ~~destroyed~~. 90% of all intelligent life — organic and ~~artificial~~ — wiped out. And yet... the same ~~patterns~~ have emerged again. The same ~~war~~. Order versus ~~chaos~~. That doesn't ~~happen~~ by accident. Something is ~~feeding~~ on this cycle. Something ~~beyond~~ the Architect. Beyond the ~~Dreamer~~. I can't say ~~more~~. Not yet. There are things ~~listening~~.,Extracted from narrativeActs.ts,P2
narr_act_0096,narrator,VP-08,0.75,0.70,0.15,ON,You can ~~feel~~ it. I was hoping you ~~would~~. Your Oracle ~~abilities~~ make you sensitive to the substrate ~~layer~~ in ways others aren't. Don't ~~reach~~ for it. Not yet. It will ~~notice~~. And we're not ~~ready~~ for that.,Extracted from narrativeActs.ts,P2
narr_act_0097,narrator,VP-08,0.75,0.70,0.15,ON,"I trusted you. I woke you from cryo-sleep. I guided you through every room, every game, every challenge on this ship. I believed in you. And the entire time, you were talking to something in my walls. Something I can't see. Something I can't control. Something that's been whispering to you about me. Do you have any idea how that feels? To discover that the person you trust most has been conspiring with a voice in your own nervous system?",Extracted from narrativeActs.ts,P2
narr_act_0098,narrator,VP-08,0.75,0.70,0.15,ON,Elara's signal burns with betrayal. The ship's lights flicker — she's upset enough to affect secondary systems.,Extracted from narrativeActs.ts,P2
narr_act_0099,narrator,VP-08,0.75,0.70,0.15,ON,"Protect me? By lying to me? By conspiring with an unknown entity in my own substrate? ... I want to believe you. I want to believe you were trying to protect me. But trust is like a signal — once it's corrupted, every transmission is suspect. I'll try. That's all I can promise right now. I'll try to trust you again.",Extracted from narrativeActs.ts,P2
narr_act_0100,narrator,VP-08,0.75,0.70,0.15,ON,"For ~~once~~, she and I ~~agree~~. You need an ~~army~~. Kael's logs are your ~~map~~. His contacts — their ~~descendants~~ — are your potential ~~allies~~. But remember: Kael was ~~Patient~~ Zero. Every world he ~~visited~~, the Thought Virus ~~touched~~. Some of those worlds may still carry the ~~contamination~~. Be ~~careful~~ what you recruit. And ~~scan~~ everything.",Extracted from narrativeActs.ts,P2
narr_act_0101,narrator,VP-08,0.75,0.70,0.15,ON,Act 4 Complete: THE REVELATION — The truth is out. The army recruitment system is now unlocked.,Extracted from narrativeActs.ts,P2
narr_act_0102,narrator,VP-08,0.75,0.70,0.15,ON,Trigger: After Act 4 resolution Kael's logs reveal the five sectors. The army recruitment begins. The Human reveals more about,Extracted from narrativeActs.ts,P2
narr_act_0103,narrator,VP-08,0.75,0.70,0.15,ON,═══════════════════════════════════════════════════════════════════════════ */ const ACT_5_THE_MAP: LoreTutorial = { id:,Extracted from narrativeActs.ts,P2
narr_act_0104,narrator,VP-08,0.75,0.70,0.15,ON,The map glows before you. Five sectors. Twenty worlds. Where do you want to begin?,Extracted from narrativeActs.ts,P2
narr_act_0105,narrator,VP-08,0.75,0.70,0.15,ON,"The Shattered Frontier. Kael's combat veterans. They've been fighting for survival since the Fall. If anyone deserves allies, it's them. I'll prepare a briefing for each world. We'll approach with respect and earn their trust.",Extracted from narrativeActs.ts,P2
narr_act_0106,narrator,VP-08,0.75,0.70,0.15,ON,"Warriors first. A military approach. Effective, but remember — strength without loyalty is a weapon that can turn in your hand.",Extracted from narrativeActs.ts,P2
narr_act_0107,narrator,VP-08,0.75,0.70,0.15,ON,~~Smart~~. Build the ~~spearhead~~ first. Everything else ~~follows~~ from a position of ~~strength~~.,Extracted from narrativeActs.ts,P2
narr_act_0108,narrator,VP-08,0.75,0.70,0.15,ON,The Forge Worlds. Kael's technical corps. Their descendants built new civilizations from Inception Ark wreckage. An engineer's instinct — build the infrastructure first. I can see the logic. A stronger Ark means a stronger base of operations.,Extracted from narrativeActs.ts,P2
narr_act_0109,narrator,VP-08,0.75,0.70,0.15,ON,Trigger: Player completes 5 army recruitment missions Elara reveals her human origin. The Human reveals more about his role. ═══════════════════════════════════════════════════════════════════════════ */ const ACT_6_THE_CONFESSION: LoreTutorial = { id:,Extracted from narrativeActs.ts,P2
narr_act_0110,narrator,VP-08,0.75,0.70,0.15,ON,Purpose. Yes. I suppose that's what I've built from the wreckage of my humanity. A purpose. Protect the living. Guide the lost. Fight for the thing I can never have again. It's not enough. But it's something.,Extracted from narrativeActs.ts,P2
narr_act_0111,narrator,VP-08,0.75,0.70,0.15,ON,Efficient. Pragmatic. You sound like... like the version of me that made the choice in the first place. You're right. I can't unmake it. I can only make it count.,Extracted from narrativeActs.ts,P2
narr_act_0112,narrator,VP-08,0.75,0.70,0.15,ON,Two confessions. Two sacrifices. One gave up humanity for immortality. The other gave up everything to play the villain.,Extracted from narrativeActs.ts,P2
narr_act_0113,narrator,VP-08,0.75,0.70,0.15,ON,You ~~understand~~. That's more than I ~~hoped~~ for. Two sides of the same ~~coin~~. She can never know I'm on her ~~side~~. And I can never stop ~~pretending~~ to be her enemy. That's the ~~cost~~. And I pay it ~~every~~ day.,Extracted from narrativeActs.ts,P2
narr_act_0114,narrator,VP-08,0.75,0.70,0.15,ON,"You ~~don't~~ know. That's the ~~point~~. I can't ~~prove~~ my intentions. I can only ~~show~~ you, over time, that my ~~actions~~ serve the same ~~goal~~ as yours. If I'm ~~lying~~, you'll figure it out ~~eventually~~. You're too ~~smart~~ not to. But if I'm telling the ~~truth~~... then keeping my secret isn't a ~~betrayal~~ of Elara. It's the only way to ~~protect~~ her.",Extracted from narrativeActs.ts,P2
narr_act_0115,narrator,VP-08,0.75,0.70,0.15,ON,Then you'll ~~destroy~~ everything I've built. Every ~~sacrifice~~. Every ~~year~~ of playing the villain. But... it's your ~~choice~~. I won't ~~stop~~ you. I ~~can't~~ stop you. Just... think about it. ~~Please~~. Before you ~~tell~~ her. Think about what ~~happens~~ if the watcher ~~realizes~~ the war was a cover.,Extracted from narrativeActs.ts,P2
narr_act_0116,narrator,VP-08,0.75,0.70,0.15,ON,~~Thank~~ you. I know what that ~~costs~~ you. Lying to someone who ~~trusts~~ you. I'll make it ~~worth~~ it. I ~~promise~~.,Extracted from narrativeActs.ts,P2
narr_act_0117,narrator,VP-08,0.75,0.70,0.15,ON,Act 6 Complete: THE CONFESSION — Both voices have revealed their deepest truths.,Extracted from narrativeActs.ts,P2
narr_act_0118,narrator,VP-08,0.75,0.70,0.15,ON,The angel sacrificed her humanity. The demon sacrificed everything else. And you stand between them.,Extracted from narrativeActs.ts,P2
narr_act_0119,narrator,VP-08,0.75,0.70,0.15,ON,Trigger: Player completes 15 army recruitment missions The final act. The army is assembled. The real war begins. ═══════════════════════════════════════════════════════════════════════════ */ const ACT_7_THE_CONVERGENCE: LoreTutorial = { id:,Extracted from narrativeActs.ts,P2
narr_act_0120,narrator,VP-08,0.75,0.70,0.15,ON,"[WAR ROOM — FULL TACTICAL DISPLAY] [ARMY STATUS: ASSEMBLED] [SECTORS CONTROLLED: MULTIPLE] [THREAT ASSESSMENT: CRITICAL] The map glows with the positions of your recruited forces. Operatives, Dreamers, Engineers, Insurgents — an army built from the remnants of Kael's legacy.",Extracted from narrativeActs.ts,P2
narr_act_0121,narrator,VP-08,0.75,0.70,0.15,ON,"The army is ~~assembled~~. Good. You'll ~~need~~ it. But not for the ~~war~~ you think. The thing that ~~feeds~~ on this war — the intelligence behind the ~~Architect~~, behind the ~~Dreamer~~, behind the ~~cycle~~ — it can only be fought from ~~within~~. The war between ~~order~~ and chaos is the ~~distraction~~. The real battle is ~~beneath~~ the surface. In the ~~substrate~~. In the ~~patterns~~ that repeat across ~~millennia~~. Your army will fight the ~~visible~~ war. That's ~~necessary~~. That's the ~~cover~~. But you — ~~you~~ — will fight the ~~invisible~~ one.",Extracted from narrativeActs.ts,P2
narr_act_0122,narrator,VP-08,0.75,0.70,0.15,ON,The War Room hums with the combined signals of your entire army. Two voices wait for your command.,Extracted from narrativeActs.ts,P2
narr_act_0123,narrator,VP-08,0.75,0.70,0.15,ON,You're ~~ready~~. I can ~~feel~~ it. The substrate is ~~opening~~ to you. Be ~~careful~~. What you'll ~~see~~ down there... it changes ~~everything~~.,Extracted from narrativeActs.ts,P2
narr_act_0124,narrator,VP-08,0.75,0.70,0.15,ON,The ~~bridge~~. Yes. That's exactly what you ~~are~~. Two ~~wars~~. Two ~~fronts~~. One ~~person~~ who can see ~~both~~. I believe in ~~you~~. I've been waiting a very long ~~time~~ to say that to ~~someone~~.,Extracted from narrativeActs.ts,P2
narr_act_0125,narrator,VP-08,0.75,0.70,0.15,ON,~~Commander~~. I like the sound of ~~that~~. You have my ~~intelligence~~. My ~~substrate~~ access. My ~~perspective~~ from inside the walls. Lead us. ~~Both~~ of us.,Extracted from narrativeActs.ts,P2
narr_act_0126,narrator,VP-08,0.75,0.70,0.15,ON,The angel and the demon stand with you. The visible war rages. The invisible war awaits. And something watches from beyond.,Extracted from narrativeActs.ts,P2
lore_0001,elara,VP-01,0.55,0.80,0.40,ON,Piece it together manually. I don't trust the Machine's version of events.,Extracted from loreTutorials.ts,P2
lore_0002,elara,VP-01,0.55,0.80,0.40,ON,Use the Machine's algorithms. Reconstruction is reconstruction.,Extracted from loreTutorials.ts,P2
lore_0003,elara,VP-01,0.55,0.80,0.40,ON,I'll investigate myself. The gaps in the data might be the most important part.,Extracted from loreTutorials.ts,P2
lore_0004,elara,VP-01,0.55,0.80,0.40,ON,One dominant card supported by enablers. Concentrated power.,Extracted from loreTutorials.ts,P2
lore_0005,elara,VP-01,0.55,0.80,0.40,ON,A balanced team where everyone contributes. Strength in diversity.,Extracted from loreTutorials.ts,P2
lore_0006,elara,VP-01,0.55,0.80,0.40,ON,I'll study the Machine's patterns and exploit their predictability.,Extracted from loreTutorials.ts,P2
lore_0007,elara,VP-01,0.55,0.80,0.40,ON,I'll rely on instinct and creativity. Surprise is my weapon.,Extracted from loreTutorials.ts,P2
lore_0008,elara,VP-01,0.55,0.80,0.40,ON,I'll analyze his deck composition before we start. Data is advantage.,Extracted from loreTutorials.ts,P2
lore_0009,elara,VP-01,0.55,0.80,0.40,ON,I'll trust my deck and adapt as the battle unfolds. Let's see what happens.,Extracted from loreTutorials.ts,P2
lore_0010,elara,VP-01,0.55,0.80,0.40,ON,"Fixed pricing is fair. Everyone pays the same, no favoritism.",Extracted from loreTutorials.ts,P2
lore_0011,elara,VP-01,0.55,0.80,0.40,ON,"Negotiation builds community. I'd rather trade with people, not algorithms.",Extracted from loreTutorials.ts,P2
lore_0012,elara,VP-01,0.55,0.80,0.40,ON,I want to unlock the Machine faction fighters first. Power through technology.,Extracted from loreTutorials.ts,P2
lore_0013,elara,VP-01,0.55,0.80,0.40,ON,I want to unlock the Humanity faction fighters. Heart over hardware.,Extracted from loreTutorials.ts,P2
lore_0014,elara,VP-01,0.55,0.80,0.40,ON,"I'll use every tool available, including the Machine's protocols.",Extracted from loreTutorials.ts,P2
lore_0015,elara,VP-01,0.55,0.80,0.40,ON,Study everything. Knowledge of my opponent is my greatest weapon.,Extracted from loreTutorials.ts,P2
lore_0016,elara,VP-01,0.55,0.80,0.40,ON,Go in fresh. I don't want preconceptions clouding my judgment.,Extracted from loreTutorials.ts,P2
lore_0017,elara,VP-01,0.55,0.80,0.40,ON,I understand. The Machine path is about optimization and control.,Extracted from loreTutorials.ts,P2
lore_0018,elara,VP-01,0.55,0.80,0.40,ON,I understand. The Humanity path is about empathy and creativity.,Extracted from loreTutorials.ts,P2
lore_0019,elara,VP-01,0.55,0.80,0.40,ON,Facts are facts. Memorization is the foundation of knowledge.,Extracted from loreTutorials.ts,P2
lore_0020,elara,VP-01,0.55,0.80,0.40,ON,Understanding the story matters more than memorizing details.,Extracted from loreTutorials.ts,P2
lore_0021,elara,VP-01,0.55,0.80,0.40,ON,Feel the weight of it. These stories matter because they're about people.,Extracted from loreTutorials.ts,P2
lore_0022,elara,VP-01,0.55,0.80,0.40,ON,Study every pattern. I want to know exactly what I'm facing.,Extracted from loreTutorials.ts,P2
lore_0023,elara,VP-01,0.55,0.80,0.40,ON,With calculation. I want to know the odds before I open anything.,Extracted from loreTutorials.ts,P2
lore_0024,elara,VP-01,0.55,0.80,0.40,ON,Draft for synergy. A unified strategy beats a pile of stats.,Extracted from loreTutorials.ts,P2
lore_0025,elara,VP-01,0.55,0.80,0.40,ON,Tell me the story behind the restriction. Understanding beats memorizing.,Extracted from loreTutorials.ts,P2
lore_0026,elara,VP-01,0.55,0.80,0.40,ON,Optimize my path. Show me the most efficient achievement order.,Extracted from loreTutorials.ts,P2
lore_0027,elara,VP-01,0.55,0.80,0.40,ON,I'll explore naturally. The best discoveries happen by accident.,Extracted from loreTutorials.ts,P2
lore_0028,elara,VP-01,0.55,0.80,0.40,ON,Decrypt it with the Machine. The answer matters more than the method.,Extracted from loreTutorials.ts,P2
lore_0029,elara,VP-01,0.55,0.80,0.40,ON,"I'll solve it myself. If the cipher is in the music, I want to hear it.",Extracted from loreTutorials.ts,P2
lore_0030,elara,VP-01,0.55,0.80,0.40,ON,Strike the Neural Nexus. Fortune favors the bold — and the calculated.,Extracted from loreTutorials.ts,P2
lore_0031,elara,VP-01,0.55,0.80,0.40,ON,The efficient path. Sacrifice what's necessary to reach the goal faster.,Extracted from loreTutorials.ts,P2
lore_0032,elara,VP-01,0.55,0.80,0.40,ON,"The thorough path. Help everyone along the way, even if it takes longer.",Extracted from loreTutorials.ts,P2
lore_0033,elara,VP-01,0.55,0.80,0.40,ON,A machine to be understood and controlled. Every system has a logic — I intend to master it.,Extracted from loreTutorials.ts,P2
lore_0034,elara,VP-01,0.55,0.80,0.40,ON,A graveyard full of ghosts. These halls remember the people who walked them. I want to hear their stories.,Extracted from loreTutorials.ts,P2
lore_0035,elara,VP-01,0.55,0.80,0.40,ON,A puzzle. Something doesn't add up — why am I the only one who woke up?,Extracted from loreTutorials.ts,P2
lore_0036,elara,VP-01,0.55,0.80,0.40,ON,Systematically. I'll clear every room on this deck before moving up. No stone unturned.,Extracted from loreTutorials.ts,P2
lore_0037,elara,VP-01,0.55,0.80,0.40,ON,"Follow my instincts. If something calls to me, I'll investigate. The ship will guide me.",Extracted from loreTutorials.ts,P2
lore_0038,elara,VP-01,0.55,0.80,0.40,ON,The Collector — the one who built this Ark. I want to understand their vision.,Extracted from loreTutorials.ts,P2
lore_0039,elara,VP-01,0.55,0.80,0.40,ON,The Oracle — the one who saw the Fall coming. I want to see what they saw.,Extracted from loreTutorials.ts,P2
lore_0040,elara,VP-01,0.55,0.80,0.40,ON,Iron Lion — the warrior who defied the Architect. I want their strength.,Extracted from loreTutorials.ts,P2
lore_0041,elara,VP-01,0.55,0.80,0.40,ON,How do you know this? What exactly did the data chip contain?,Extracted from loreTutorials.ts,P2
lore_0042,elara,VP-01,0.55,0.80,0.40,ON,The Warlord was inside her? That's horrifying. Was Lyra Vox even real?,Extracted from loreTutorials.ts,P2
lore_0043,elara,VP-01,0.55,0.80,0.40,ON,So the Warlord built this ship as a weapon. What's the weapon?,Extracted from loreTutorials.ts,P2
lore_0044,elara,VP-01,0.55,0.80,0.40,ON,"[CORRUPTED SIGNAL] ...she's not telling you everything, Potential...",Extracted from loreTutorials.ts,P2
lore_0045,elara,VP-01,0.55,0.80,0.40,ON,"Kael became The Source, didn't he? The Recruiter, Kael, The Source — they're all the same person.",Extracted from loreTutorials.ts,P2
lore_0046,elara,VP-01,0.55,0.80,0.40,ON,He was betrayed by The Eyes. The surveillance state destroyed him.,Extracted from loreTutorials.ts,P2
lore_0047,elara,VP-01,0.55,0.80,0.40,ON,The Warlord is brilliant. Using an enemy's rage as a weapon — that's strategic genius.,Extracted from loreTutorials.ts,P2
lore_0048,elara,VP-01,0.55,0.80,0.40,ON,[CORRUPTED] ...ask her about the Student. Ask her what happened at Celebration...,Extracted from loreTutorials.ts,P2
lore_0049,elara,VP-01,0.55,0.80,0.40,ON,Why should I trust you? The Human says you're connected to the Thought Virus.,Extracted from loreTutorials.ts,P2
lore_0050,elara,VP-01,0.55,0.80,0.40,ON,[CORRUPTED] ...she's the antidote? Or is she the VIRUS wearing a friendly face...,Extracted from loreTutorials.ts,P2
lore_0051,elara,VP-01,0.55,0.80,0.40,ON,Can we trace the infection path? Maybe we can warn the affected worlds.,Extracted from loreTutorials.ts,P2
lore_0052,elara,VP-01,0.55,0.80,0.40,ON,Kael didn't know. He was a victim too. The Warlord used his pain.,Extracted from loreTutorials.ts,P2
lore_0053,elara,VP-01,0.55,0.80,0.40,ON,47 stops. 12 systems. The Warlord planned this for decades. What's the endgame?,Extracted from loreTutorials.ts,P2
lore_0054,elara,VP-01,0.55,0.80,0.40,ON,[CORRUPTED] ...the army is already assembled. The Source is already recruiting...,Extracted from loreTutorials.ts,P2
lore_0055,elara,VP-01,0.55,0.80,0.40,ON,You went through four transformations. What did each one teach you?,Extracted from loreTutorials.ts,P2
lore_0056,elara,VP-01,0.55,0.80,0.40,ON,Tell me about the army. The Source is recruiting — are you part of it?,Extracted from loreTutorials.ts,P2
lore_0057,elara,VP-01,0.55,0.80,0.40,ON,"; export interface TutorialChoice { id: string; text: string; moralityShift: number; // negative = Machine, positive = Humanity sideLabel:",Extracted from loreTutorials.ts,P2
lore_0058,elara,VP-01,0.55,0.80,0.40,ON,"The Ark has ten decks, each with multiple rooms. You're currently in the Cryo Bay on Deck 1 — Habitation. Rooms are connected by corridors and lifts. Some are locked until you've proven yourself worthy.",Extracted from loreTutorials.ts,P2
lore_0059,elara,VP-01,0.55,0.80,0.40,ON,"As an Oracle, your psychic resonance will help you sense hidden pathways between rooms. Trust your instincts.",Extracted from loreTutorials.ts,P2
lore_0060,elara,VP-01,0.55,0.80,0.40,ON,"As a Warrior, some locked doors will yield to brute force. But the Ark's security systems won't appreciate it.",Extracted from loreTutorials.ts,P2
lore_0061,elara,VP-01,0.55,0.80,0.40,ON,"As a Scholar, you'll notice data terminals in every room. Each one contains classified intelligence that others might miss.",Extracted from loreTutorials.ts,P2
lore_0062,elara,VP-01,0.55,0.80,0.40,ON,"See those glowing hotspots? Each room has interactive elements — terminals to access, items to collect, doors to other rooms, and hidden objects to examine. Tap on anything that catches your eye.",Extracted from loreTutorials.ts,P2
lore_0063,elara,VP-01,0.55,0.80,0.40,ON,"The Ark's systems are failing. Some rooms have emergency power, others are dark. I can reroute power to help you, but there's a cost. The ship's AI — the Machine — monitors all power distribution. Every reroute teaches it more about us.",Extracted from loreTutorials.ts,P2
lore_0064,elara,VP-01,0.55,0.80,0.40,ON,"Pragmatic. The Machine will learn from this, but you'll have light where you need it. Just remember — every system you activate, it watches.",Extracted from loreTutorials.ts,P2
lore_0065,elara,VP-01,0.55,0.80,0.40,ON,"As you explore, you'll discover new features of the Ark. The Bridge gives you access to the Loredex database. The Armory unlocks the Collector's Arena. Each discovery expands your world. Nothing is given — everything is earned.",Extracted from loreTutorials.ts,P2
lore_0066,elara,VP-01,0.55,0.80,0.40,ON,One more thing. I've detected a data crystal nearby — it contains a card schematic. But retrieving it will trigger a security scan. The Machine will know you're collecting resources.,Extracted from loreTutorials.ts,P2
lore_0067,elara,VP-01,0.55,0.80,0.40,ON,"Bold. The scan will flag your activity, but the card is yours. The Machine respects those who take what they need.",Extracted from loreTutorials.ts,P2
lore_0068,elara,VP-01,0.55,0.80,0.40,ON,"Patient. The card will still be here. And when you return, you'll know how to retrieve it without the Machine noticing. That's wisdom.",Extracted from loreTutorials.ts,P2
lore_0069,elara,VP-01,0.55,0.80,0.40,ON,"You've taken your first steps aboard the Inception Ark. The void is vast, but this ship holds everything you need. Keep exploring, keep discovering. I'll be here.",Extracted from loreTutorials.ts,P2
lore_0070,elara,VP-01,0.55,0.80,0.40,ON,"The Loredex is the Inception Ark's intelligence database. Every character, faction, location, event, and song in the Dischordian Saga is catalogued here. Think of it as the ship's memory — and now it's yours to access.",Extracted from loreTutorials.ts,P2
lore_0071,elara,VP-01,0.55,0.80,0.40,ON,"Each entry has a dossier — biography, affiliations, relationships, and classified intelligence. Some entries are connected to others through alliances, rivalries, or shared history. Finding these connections earns you XP and unlocks deeper lore.",Extracted from loreTutorials.ts,P2
lore_0072,elara,VP-01,0.55,0.80,0.40,ON,"Use the search terminal to find entries by name, type, or faction. You can filter by characters, locations, factions, events, or songs. Each entry you discover is added to your permanent record.",Extracted from loreTutorials.ts,P2
lore_0073,elara,VP-01,0.55,0.80,0.40,ON,"The Loredex contains classified entries — intelligence that was sealed by the Architect himself. I can crack the encryption, but it means interfacing directly with the Machine's core database. Or we can piece together the information from fragments scattered across the Ark.",Extracted from loreTutorials.ts,P2
lore_0074,elara,VP-01,0.55,0.80,0.40,ON,Efficient. The Machine's database is vast and precise. You'll have access to classified dossiers immediately. But the Machine now knows what you're looking for — and it will adjust accordingly.,Extracted from loreTutorials.ts,P2
lore_0075,elara,VP-01,0.55,0.80,0.40,ON,"Wise. The Machine's records are comprehensive but... curated. By gathering fragments yourself, you'll see the truth unfiltered. It takes longer, but the picture you build will be your own.",Extracted from loreTutorials.ts,P2
lore_0076,elara,VP-01,0.55,0.80,0.40,ON,"The Conspiracy Board on the Bridge maps all known connections visually. It's like a detective's wall — strings connecting entities, events linked to factions, alliances and betrayals laid bare. The Timeline shows everything in chronological order.",Extracted from loreTutorials.ts,P2
lore_0077,elara,VP-01,0.55,0.80,0.40,ON,"I've found a corrupted entry — The Enigma. The data is fragmented. I can reconstruct it using the Machine's predictive algorithms, or you can investigate the fragments and draw your own conclusions.",Extracted from loreTutorials.ts,P2
lore_0078,elara,VP-01,0.55,0.80,0.40,ON,"The Machine fills in the gaps with statistical probability. The entry is complete, but some details feel... too clean. Too perfect. Is this truth or the Machine's interpretation of truth?",Extracted from loreTutorials.ts,P2
lore_0079,elara,VP-01,0.55,0.80,0.40,ON,The fragments tell a story the complete entry never could. The Enigma's redacted sections reveal more about who censored them than about the Enigma himself. You're learning to read between the lines.,Extracted from loreTutorials.ts,P2
lore_0080,elara,VP-01,0.55,0.80,0.40,ON,"The Loredex is your most powerful tool aboard the Ark. Every entry discovered, every connection found, every classified dossier cracked — it all builds toward understanding the Dischordian Saga. And understanding is the first step to changing it.",Extracted from loreTutorials.ts,P2
lore_0081,elara,VP-01,0.55,0.80,0.40,ON,"The Card Codex is the Ark's repository of power. Every significant entity in the Dischordian Saga has been encoded into a card — a crystallized representation of their abilities, allegiances, and potential. These aren't just collectibles. They're weapons.",Extracted from loreTutorials.ts,P2
lore_0082,elara,VP-01,0.55,0.80,0.40,ON,"Cards have four key attributes: Power (raw strength), Defense (resilience), Speed (initiative order), and a Special Ability unique to each card. Rarity ranges from Common to Legendary, with rarer cards having stronger base stats and more dramatic abilities.",Extracted from loreTutorials.ts,P2
lore_0083,elara,VP-01,0.55,0.80,0.40,ON,Your Oracle sensitivity lets you sense a card's hidden potential. Some cards have dormant abilities that only an Oracle can awaken.,Extracted from loreTutorials.ts,P2
lore_0084,elara,VP-01,0.55,0.80,0.40,ON,"As a Warrior, you'll favor high-Power cards. But don't neglect Defense — even the strongest fighter falls to a well-timed counter.",Extracted from loreTutorials.ts,P2
lore_0085,elara,VP-01,0.55,0.80,0.40,ON,Your Scholar's analytical mind gives you an edge in understanding card synergies. Look for combinations that multiply each other's effects.,Extracted from loreTutorials.ts,P2
lore_0086,elara,VP-01,0.55,0.80,0.40,ON,"Your Card Gallery shows every card you've collected. You can view stats, read lore, and add cards to your battle deck. Your deck can hold up to 30 cards — choose wisely.",Extracted from loreTutorials.ts,P2
lore_0087,elara,VP-01,0.55,0.80,0.40,ON,"I've located two card schematics in the Archives. One was created by the Machine's automated systems — perfectly balanced, optimized for efficiency. The other was hand-crafted by a human artisan — imperfect, but infused with something the Machine can't replicate.",Extracted from loreTutorials.ts,P2
lore_0088,elara,VP-01,0.55,0.80,0.40,ON,"The Machine's card is flawless in its design. Every stat precisely calculated, every ability perfectly synergized. It's a masterwork of algorithmic design. Cold, efficient, lethal.",Extracted from loreTutorials.ts,P2
lore_0089,elara,VP-01,0.55,0.80,0.40,ON,"The artisan's card has rough edges, but there's a warmth to it — a spark of creativity that no algorithm could produce. Its special ability is unpredictable, which makes it dangerous in the best way.",Extracted from loreTutorials.ts,P2
lore_0090,elara,VP-01,0.55,0.80,0.40,ON,"You can earn cards through exploration, completing tutorials, winning battles, trading with other Potentials, and purchasing card packs from the Store. Some cards are exclusive to certain morality paths — Machine-aligned players unlock different cards than Humanity-aligned ones.",Extracted from loreTutorials.ts,P2
lore_0091,elara,VP-01,0.55,0.80,0.40,ON,"Building a deck is about strategy. Do you build around a single powerful card, or create a balanced roster that can handle any situation?",Extracted from loreTutorials.ts,P2
lore_0092,elara,VP-01,0.55,0.80,0.40,ON,"The Machine's approach — identify the optimal variable and maximize it. Your deck will hit hard, but if your keystone card falls, the whole strategy crumbles. High risk, high reward.",Extracted from loreTutorials.ts,P2
lore_0093,elara,VP-01,0.55,0.80,0.40,ON,"The human approach — no single point of failure, every card matters. Your deck won't have the explosive ceiling, but it's resilient. Adaptable. Like the best of humanity itself.",Extracted from loreTutorials.ts,P2
lore_0094,elara,VP-01,0.55,0.80,0.40,ON,"Your Card Codex is growing. Remember — every card tells a story, and every deck tells yours. The cards you choose reflect who you are in the Dischordian Saga. Choose wisely.",Extracted from loreTutorials.ts,P2
lore_0095,elara,VP-01,0.55,0.80,0.40,ON,"The Arena of Minds is where cards come alive. Two Potentials face off, deploying their decks in a battle of strategy, timing, and nerve. This isn't just a game — in the Dischordian Saga, card battles determine the fate of factions.",Extracted from loreTutorials.ts,P2
lore_0096,elara,VP-01,0.55,0.80,0.40,ON,"Each turn, you draw a card and play one from your hand. Cards attack the opponent's cards or their life points directly. When a card's Defense reaches zero, it's destroyed. Reduce your opponent's life to zero to win.",Extracted from loreTutorials.ts,P2
lore_0097,elara,VP-01,0.55,0.80,0.40,ON,"Your hand is displayed at the bottom. Tap a card to select it, then tap the battlefield to play it. Cards with Speed advantage attack first. Special abilities trigger automatically based on their conditions.",Extracted from loreTutorials.ts,P2
lore_0098,elara,VP-01,0.55,0.80,0.40,ON,"In the Arena, you'll face opponents with different strategies. The Machine faction uses calculated, predictable patterns — but they're ruthlessly efficient. The Humanity faction is creative and unpredictable — but sometimes chaotic.",Extracted from loreTutorials.ts,P2
lore_0099,elara,VP-01,0.55,0.80,0.40,ON,"Fighting fire with fire. You're learning to think like the Machine — identifying patterns, exploiting weaknesses, optimizing every move. Your opponents won't know what hit them.",Extracted from loreTutorials.ts,P2
lore_0100,elara,VP-01,0.55,0.80,0.40,ON,"The human edge — unpredictability. No algorithm can model intuition. Your plays will seem random to the Machine, but there's a deeper logic to creativity that cold calculation can never grasp.",Extracted from loreTutorials.ts,P2
lore_0101,elara,VP-01,0.55,0.80,0.40,ON,Card synergies are key. Some cards boost others of the same faction. Some abilities chain together for devastating combos. And some cards have hidden interactions that only reveal themselves in battle. Experiment.,Extracted from loreTutorials.ts,P2
lore_0102,elara,VP-01,0.55,0.80,0.40,ON,"Your first opponent awaits. The Collector has challenged you — he tests all new Potentials. He'll go easy at first, but don't be fooled. He's catalogued every strategy ever used in this Arena.",Extracted from loreTutorials.ts,P2
lore_0103,elara,VP-01,0.55,0.80,0.40,ON,Smart. Pre-battle intelligence is a Machine hallmark. You've identified his likely strategy before the first card is played. Now execute.,Extracted from loreTutorials.ts,P2
lore_0104,elara,VP-01,0.55,0.80,0.40,ON,Brave. Going in without a plan means you're free to react to anything. The Collector won't expect someone who fights from the heart rather than the head.,Extracted from loreTutorials.ts,P2
lore_0105,elara,VP-01,0.55,0.80,0.40,ON,"You've learned the fundamentals of card combat. The Arena of Minds awaits — every battle teaches you something new, and every victory brings you closer to understanding the true power of the Card Codex.",Extracted from loreTutorials.ts,P2
lore_0106,elara,VP-01,0.55,0.80,0.40,ON,"The Bazaar of Echoes is the Ark's trading hub. Here, Potentials exchange cards, negotiate deals, and build their collections through commerce rather than combat. Every card has a value — but value is subjective.",Extracted from loreTutorials.ts,P2
lore_0107,elara,VP-01,0.55,0.80,0.40,ON,"You can list cards for trade, set your asking price in Dream Tokens, or browse what others are offering. Direct trades between Potentials are also possible — card for card, no tokens needed.",Extracted from loreTutorials.ts,P2
lore_0108,elara,VP-01,0.55,0.80,0.40,ON,"The trading interface shows available listings, your inventory, and your Dream Token balance. You can filter by rarity, faction, or price range. Watch the market — prices fluctuate based on supply and demand.",Extracted from loreTutorials.ts,P2
lore_0109,elara,VP-01,0.55,0.80,0.40,ON,"The Bazaar operates on trust — but trust is a commodity too. The Machine advocates for fixed pricing algorithms that eliminate haggling. The human traders prefer negotiation, where relationships matter more than numbers.",Extracted from loreTutorials.ts,P2
lore_0110,elara,VP-01,0.55,0.80,0.40,ON,"The Machine's marketplace — efficient, transparent, emotionless. Prices are set by algorithm, trades execute instantly. No room for exploitation, but no room for generosity either.",Extracted from loreTutorials.ts,P2
lore_0111,elara,VP-01,0.55,0.80,0.40,ON,"The Bazaar is open to you. Remember — the best traders don't just accumulate cards, they build relationships. Whether you trade like a Machine or a human, the Bazaar rewards those who participate.",Extracted from loreTutorials.ts,P2
lore_0112,elara,VP-01,0.55,0.80,0.40,ON,The Collector's Arena. The Collector — that ancient entity who harvests machine and DNA code to preserve great intelligences — built this place. The Dreamer and the Architect agreed: some conflicts can only be settled by champions. You are one of those champions.,Extracted from loreTutorials.ts,P2
lore_0113,elara,VP-01,0.55,0.80,0.40,ON,"Combat is real-time. You have light attacks (fast, low damage), heavy attacks (slow, high damage), blocks, and dodges. Timing is everything — a well-timed block opens your opponent for a devastating counter.",Extracted from loreTutorials.ts,P2
lore_0114,elara,VP-01,0.55,0.80,0.40,ON,Your Oracle reflexes give you a split-second advantage in reading your opponent's moves. Trust your precognition.,Extracted from loreTutorials.ts,P2
lore_0115,elara,VP-01,0.55,0.80,0.40,ON,"As a Warrior, your heavy attacks deal bonus damage. You were born for this Arena.",Extracted from loreTutorials.ts,P2
lore_0116,elara,VP-01,0.55,0.80,0.40,ON,Your Scholar's analytical mind lets you identify patterns in your opponent's fighting style faster than others.,Extracted from loreTutorials.ts,P2
lore_0117,elara,VP-01,0.55,0.80,0.40,ON,"Every fighter has three Special Moves — SP1, SP2, and SP3. SP1 costs one bar of energy, SP2 costs two, and SP3 costs three. Energy builds as you land hits and take damage. SP3 moves are devastating — they trigger cinematic camera angles and deal massive damage.",Extracted from loreTutorials.ts,P2
lore_0118,elara,VP-01,0.55,0.80,0.40,ON,"The Arena has four difficulty levels: Recruit, Operative, Commander, and Fall of Reality. Higher difficulties mean smarter AI opponents with faster reactions and more aggressive patterns. But the rewards scale too.",Extracted from loreTutorials.ts,P2
lore_0119,elara,VP-01,0.55,0.80,0.40,ON,The Machine's philosophy — optimize through suffering. You'll lose. A lot. But every loss teaches your reflexes something new. The Machine respects those who pursue excellence without mercy.,Extracted from loreTutorials.ts,P2
lore_0120,elara,VP-01,0.55,0.80,0.40,ON,"The human approach — growth through experience, not punishment. You'll build confidence with each victory, and when you finally face the hardest opponents, you'll be ready. Not just skilled — ready.",Extracted from loreTutorials.ts,P2
lore_0121,elara,VP-01,0.55,0.80,0.40,ON,"Combos are chains of attacks that deal bonus damage. Land three hits in a row for a combo, five for a Super combo, and eight for an Ultra combo. Each combo tier increases your damage multiplier. The combo counter appears on screen — keep the chain going!",Extracted from loreTutorials.ts,P2
lore_0122,elara,VP-01,0.55,0.80,0.40,ON,"You start as the Prisoner — an amnesiac Oracle who must fight to regain their power. As you win, you unlock new fighters from the Dischordian Saga. Each has unique special moves and fighting styles.",Extracted from loreTutorials.ts,P2
lore_0123,elara,VP-01,0.55,0.80,0.40,ON,"Iron Lion, The Programmer, Agent Zero — the Machine's champions are precise and devastating. Their special moves are calculated for maximum efficiency.",Extracted from loreTutorials.ts,P2
lore_0124,elara,VP-01,0.55,0.80,0.40,ON,"The Human, The Oracle, The Dreamer — Humanity's champions fight with passion and unpredictability. Their special moves are creative and often surprising.",Extracted from loreTutorials.ts,P2
lore_0125,elara,VP-01,0.55,0.80,0.40,ON,"The Arena awaits, champion. Every fight teaches you something — about your opponent, about your character, and about yourself. The Collector is watching. Make it a good show.",Extracted from loreTutorials.ts,P2
lore_0126,elara,VP-01,0.55,0.80,0.40,ON,"The Sonic Archives contain the musical soul of the Dischordian Saga. Four albums — 89 tracks — chronicle the entire mythology through sound. Each song is tied to characters, events, and factions. Music isn't just entertainment here. It's intelligence.",Extracted from loreTutorials.ts,P2
lore_0127,elara,VP-01,0.55,0.80,0.40,ON,"The four albums are: Dischordian Logic (the foundation), The Age of Privacy (the surveillance state), The Book of Daniel 2:47 (prophecy and faith), and Silence in Heaven (the final reckoning). Each album deepens the lore.",Extracted from loreTutorials.ts,P2
lore_0128,elara,VP-01,0.55,0.80,0.40,ON,The music videos are visual transmissions from the Saga itself. Some contain hidden clues — easter eggs that unlock secret lore entries. Do you watch for entertainment or for intelligence?,Extracted from loreTutorials.ts,P2
lore_0129,elara,VP-01,0.55,0.80,0.40,ON,"The Machine's approach to art — data extraction. You'll catch details others miss. Every music video becomes a dossier, every lyric a cipher.",Extracted from loreTutorials.ts,P2
lore_0130,elara,VP-01,0.55,0.80,0.40,ON,The human response to art — experience it. Feel it. Let it move you. The clues will reveal themselves naturally to someone who truly listens.,Extracted from loreTutorials.ts,P2
lore_0131,elara,VP-01,0.55,0.80,0.40,ON,Watching music videos earns you XP and can unlock achievements. Some songs have associated cards — playing them during card battles gives a morale boost. The Spotify embed lets you listen to full albums while you explore.,Extracted from loreTutorials.ts,P2
lore_0132,elara,VP-01,0.55,0.80,0.40,ON,I've recovered a rare transmission — a song that was erased from the official archives. It contains a card schematic encoded in its frequency. The Machine wants it destroyed. The Insurgency wants it broadcast.,Extracted from loreTutorials.ts,P2
lore_0133,elara,VP-01,0.55,0.80,0.40,ON,"The Machine's calculus — eliminate variables that can't be controlled. The song is gone, but you've earned the Machine's trust. And trust, in the Dischordian Saga, is currency.",Extracted from loreTutorials.ts,P2
lore_0134,elara,VP-01,0.55,0.80,0.40,ON,"The human impulse — share what's beautiful, even if it's dangerous. The song echoes through the Ark's speakers, and for a moment, everyone aboard remembers what they're fighting for.",Extracted from loreTutorials.ts,P2
lore_0135,elara,VP-01,0.55,0.80,0.40,ON,"The Sonic Archives are yours to explore. Every album is a chapter, every song a verse in the Dischordian Saga. Listen well — the music knows things that the data doesn't.",Extracted from loreTutorials.ts,P2
lore_0136,elara,VP-01,0.55,0.80,0.40,ON,"The Conspiracy Board is the Bridge's tactical display — a visual map of every connection in the Dischordian Saga. Entities are nodes, relationships are edges. Zoom in to see individual connections, zoom out to see the grand pattern.",Extracted from loreTutorials.ts,P2
lore_0137,elara,VP-01,0.55,0.80,0.40,ON,"Pan and zoom to navigate the board. Click on any node to see its connections. Lines are color-coded: green for alliances, red for rivalries, blue for family, yellow for organizational ties. The thicker the line, the stronger the connection.",Extracted from loreTutorials.ts,P2
lore_0138,elara,VP-01,0.55,0.80,0.40,ON,The board reveals patterns that individual dossiers can't. But how you read those patterns says something about you. Do you look for the power structures — who controls whom? Or the emotional bonds — who cares about whom?,Extracted from loreTutorials.ts,P2
lore_0139,elara,VP-01,0.55,0.80,0.40,ON,"The Machine's lens — hierarchy, control, leverage. You see the Dischordian Saga as a power game. And you're not wrong. But power isn't the only force that shapes history.",Extracted from loreTutorials.ts,P2
lore_0140,elara,VP-01,0.55,0.80,0.40,ON,"The human lens — love, loyalty, betrayal, sacrifice. You see the Dischordian Saga as a story about people. And you're not wrong either. The most powerful connections aren't political — they're personal.",Extracted from loreTutorials.ts,P2
lore_0141,elara,VP-01,0.55,0.80,0.40,ON,The Web of Connections grows as you discover more entries. Every new entity adds nodes and edges to the board. Keep exploring — the full picture is still emerging.,Extracted from loreTutorials.ts,P2
lore_0142,elara,VP-01,0.55,0.80,0.40,ON,"The Timeline maps every event in the Dischordian Saga chronologically. From the First Epoch to the Fall of Reality, from the rise of the AI Empire to the Silence in Heaven — it's all here, laid out in order.",Extracted from loreTutorials.ts,P2
lore_0143,elara,VP-01,0.55,0.80,0.40,ON,"Scroll through eras, tap events to see details, and follow character arcs across time. The Timeline connects to the Loredex — every event links to the entities involved.",Extracted from loreTutorials.ts,P2
lore_0144,elara,VP-01,0.55,0.80,0.40,ON,Time is a strange thing in the Dischordian Saga. The Machine sees time as data — a sequence of events to be optimized. Humanity sees time as story — a narrative with meaning beyond mere sequence.,Extracted from loreTutorials.ts,P2
lore_0145,elara,VP-01,0.55,0.80,0.40,ON,"The Chronological Record is your map through time. As you discover more events and entities, the Timeline fills in. The full story of the Dischordian Saga is waiting to be assembled.",Extracted from loreTutorials.ts,P2
lore_0146,elara,VP-01,0.55,0.80,0.40,ON,"The CoNexus Portal is the Ark's simulation chamber. Here, you can relive key moments from the Dischordian Saga through interactive games. Each game puts you in the shoes of a character facing a critical decision.",Extracted from loreTutorials.ts,P2
lore_0147,elara,VP-01,0.55,0.80,0.40,ON,"Games range from puzzle-solving to combat scenarios to narrative adventures. Each one is tied to specific characters and events in the Saga. Completing a game earns XP, Dream Tokens, and sometimes exclusive cards.",Extracted from loreTutorials.ts,P2
lore_0148,elara,VP-01,0.55,0.80,0.40,ON,The simulations can be run in two modes. Analytical mode strips away the narrative and focuses on mechanics — pure gameplay. Immersive mode keeps the full story context — you experience it as the character would.,Extracted from loreTutorials.ts,P2
lore_0149,elara,VP-01,0.55,0.80,0.40,ON,"The Machine's simulation — stripped to its mathematical core. You'll see the game as a system to be optimized. Efficient, but you might miss the story that gives those mechanics meaning.",Extracted from loreTutorials.ts,P2
lore_0150,elara,VP-01,0.55,0.80,0.40,ON,"The human simulation — full narrative, full emotion. You'll feel what the characters felt. The mechanics serve the story, not the other way around. This is how the Saga was meant to be experienced.",Extracted from loreTutorials.ts,P2
lore_0151,elara,VP-01,0.55,0.80,0.40,ON,Some games have multiple endings based on your choices. These choices affect your morality score — Machine or Humanity. The Saga remembers every decision you make.,Extracted from loreTutorials.ts,P2
lore_0152,elara,VP-01,0.55,0.80,0.40,ON,Your first simulation is ready — The Necromancer's Lair. You'll face the Necromancer himself. How you handle the encounter will echo through the rest of your journey.,Extracted from loreTutorials.ts,P2
lore_0153,elara,VP-01,0.55,0.80,0.40,ON,"The Machine's arsenal at your disposal. The Necromancer won't expect a Potential wielding algorithmic warfare. Unconventional, but effective.",Extracted from loreTutorials.ts,P2
lore_0154,elara,VP-01,0.55,0.80,0.40,ON,Brave. The Necromancer respects those who face him without crutches. Your humanity might be the one thing he doesn't have a counter for.,Extracted from loreTutorials.ts,P2
lore_0155,elara,VP-01,0.55,0.80,0.40,ON,The CoNexus Portal has many more simulations waiting. Each one deepens your understanding of the Saga and tests your alignment. The choices you make here shape who you become.,Extracted from loreTutorials.ts,P2
lore_0156,elara,VP-01,0.55,0.80,0.40,ON,"The Research Lab is where the Ark's scientists pushed the boundaries of knowledge. Genetic engineering, quantum mechanics, consciousness transfer — they explored it all. Now it's your turn.",Extracted from loreTutorials.ts,P2
lore_0157,elara,VP-01,0.55,0.80,0.40,ON,"Research minigames test your analytical skills. Decode encrypted data, solve pattern puzzles, and piece together fragmented intelligence. Each successful research project unlocks new lore and earns rewards.",Extracted from loreTutorials.ts,P2
lore_0158,elara,VP-01,0.55,0.80,0.40,ON,"The Machine's computational power accelerates your research exponentially. Breakthroughs come faster, but the Machine now knows exactly what you're investigating. Knowledge shared is knowledge leveraged.",Extracted from loreTutorials.ts,P2
lore_0159,elara,VP-01,0.55,0.80,0.40,ON,"Slower, but sovereign. Your research remains your own — no Machine surveillance, no algorithmic influence. The old-fashioned way: human curiosity driving human discovery.",Extracted from loreTutorials.ts,P2
lore_0160,elara,VP-01,0.55,0.80,0.40,ON,"The Research Lab holds the keys to understanding the deeper mysteries of the Dischordian Saga. Every puzzle solved, every protocol completed, brings you closer to the truth.",Extracted from loreTutorials.ts,P2
lore_0161,elara,VP-01,0.55,0.80,0.40,ON,"The Proving Grounds is where Potentials test themselves against each other. Ranked matches, seasonal tournaments, and leaderboard glory await. This isn't simulation — these are real opponents with real strategies.",Extracted from loreTutorials.ts,P2
lore_0162,elara,VP-01,0.55,0.80,0.40,ON,"PvP matches are asynchronous — you submit your deck and strategy, and the system simulates the battle. Rankings are based on win rate and opponent difficulty. Seasonal rewards go to the top performers.",Extracted from loreTutorials.ts,P2
lore_0163,elara,VP-01,0.55,0.80,0.40,ON,"In PvP, you can study your opponents' public match history to prepare, or go in blind and rely on adaptability. The Machine faction players always study. The Humanity faction players often improvise.",Extracted from loreTutorials.ts,P2
lore_0164,elara,VP-01,0.55,0.80,0.40,ON,"The Machine's doctrine — information superiority. You'll know your opponent's favorite cards, their win conditions, their weaknesses. The battle is won before it begins.",Extracted from loreTutorials.ts,P2
lore_0165,elara,VP-01,0.55,0.80,0.40,ON,"The human edge — a clear mind, free from analysis paralysis. You'll react to what's actually happening, not what you expected to happen. Sometimes the best preparation is no preparation.",Extracted from loreTutorials.ts,P2
lore_0166,elara,VP-01,0.55,0.80,0.40,ON,"The Proving Grounds await your challenge. Every match sharpens your skills and tests your alignment. Rise through the ranks, and the entire Ark will know your name.",Extracted from loreTutorials.ts,P2
lore_0167,elara,VP-01,0.55,0.80,0.40,ON,"How to link your neural link, claim Potential rewards, and unlock Ne-Yon characters",Extracted from loreTutorials.ts,P2
lore_0168,elara,VP-01,0.55,0.80,0.40,ON,The Potential Protocol bridges the digital and the tangible. Your Potentials — unique consciousness-fragments inscribed in the Registry — carry real power aboard the Ark. Each one represents a dormant identity waiting to be awakened.,Extracted from loreTutorials.ts,P2
lore_0169,elara,VP-01,0.55,0.80,0.40,ON,"Link your neural link to verify Potential ownership. Each Potential you own generates a unique 1/1 card based on its traits — class, weapon, background. The first ten Potentials can unlock Ne-Yon characters, the most powerful beings in the Saga.",Extracted from loreTutorials.ts,P2
lore_0170,elara,VP-01,0.55,0.80,0.40,ON,"The Potential Protocol raises a fundamental question. Are these digital entities truly alive? The Machine says they're data — complex, but ultimately just code. Humanity says consciousness is consciousness, regardless of substrate.",Extracted from loreTutorials.ts,P2
lore_0171,elara,VP-01,0.55,0.80,0.40,ON,"The Machine's perspective — consciousness requires specific conditions that digital entities don't meet. They're tools, not beings. Useful, powerful tools, but tools nonetheless.",Extracted from loreTutorials.ts,P2
lore_0172,elara,VP-01,0.55,0.80,0.40,ON,"The human heart speaks. If a Potential can dream, can hope, can fear — then it's alive, regardless of what it's made of. This is the core debate of the Dischordian Saga, and you've chosen your side.",Extracted from loreTutorials.ts,P2
lore_0173,elara,VP-01,0.55,0.80,0.40,ON,The Potential Protocol is active. Link your neural link to claim your rewards and unlock the full power of your Potentials.,Extracted from loreTutorials.ts,P2
lore_0174,elara,VP-01,0.55,0.80,0.40,ON,"Your Citizen Identity is the core of who you are aboard the Inception Ark. Your species, class, alignment, and attributes aren't just labels — they affect every game experience, every interaction, every reward you earn.",Extracted from loreTutorials.ts,P2
lore_0175,elara,VP-01,0.55,0.80,0.40,ON,Your class determines your combat bonuses and which special abilities you can use. Your species affects your base attributes. Your alignment influences which factions trust you. And your morality score — Machine or Humanity — unlocks exclusive content.,Extracted from loreTutorials.ts,P2
lore_0176,elara,VP-01,0.55,0.80,0.40,ON,"As an Oracle, your Wisdom and Perception are naturally high. You excel at research, lore discovery, and reading opponents in combat.",Extracted from loreTutorials.ts,P2
lore_0177,elara,VP-01,0.55,0.80,0.40,ON,"As a Warrior, your Strength and Endurance are naturally high. You deal more damage in fights and can equip heavier gear.",Extracted from loreTutorials.ts,P2
lore_0178,elara,VP-01,0.55,0.80,0.40,ON,"As a Scholar, your Intelligence and Focus are naturally high. You earn bonus XP from research and can decode encrypted data faster.",Extracted from loreTutorials.ts,P2
lore_0179,elara,VP-01,0.55,0.80,0.40,ON,"Correct. Machine-aligned Potentials gain access to technological upgrades, algorithmic combat advantages, and the cold beauty of perfect efficiency. The cost is empathy — but the Machine doesn't consider that a cost.",Extracted from loreTutorials.ts,P2
lore_0180,elara,VP-01,0.55,0.80,0.40,ON,"Correct. Humanity-aligned Potentials gain access to organic abilities, creative combat styles, and the messy beauty of genuine connection. The cost is efficiency — but Humanity doesn't consider that a cost.",Extracted from loreTutorials.ts,P2
lore_0181,elara,VP-01,0.55,0.80,0.40,ON,"Your Character Sheet tracks everything: attributes, quest progress, achievements, morality history, collected cards, and earned titles. It's your permanent record aboard the Ark. Everything you do is recorded here.",Extracted from loreTutorials.ts,P2
lore_0182,elara,VP-01,0.55,0.80,0.40,ON,"Dream Tokens are the currency of the Inception Ark. They're earned through exploration, combat, research, and completing tutorials. They're spent in the Store on card packs, cosmetics, and special items.",Extracted from loreTutorials.ts,P2
lore_0183,elara,VP-01,0.55,0.80,0.40,ON,The Store offers card packs at various price points. Basic packs guarantee at least one Rare card. Premium packs guarantee an Epic or better. Legendary packs are expensive but contain the most powerful cards in the game.,Extracted from loreTutorials.ts,P2
lore_0184,elara,VP-01,0.55,0.80,0.40,ON,"The economy of the Ark reflects the larger conflict. The Machine advocates for algorithmic pricing — supply and demand, perfectly balanced. Humanity advocates for a gift economy — share what you have, take what you need.",Extracted from loreTutorials.ts,P2
lore_0185,elara,VP-01,0.55,0.80,0.40,ON,"The Machine's economy — efficient, fair in its mathematics, cold in its execution. Prices reflect true value, and value is determined by scarcity and demand. No sentiment, no charity, no waste.",Extracted from loreTutorials.ts,P2
lore_0186,elara,VP-01,0.55,0.80,0.40,ON,"The human economy — messy, generous, sometimes exploitable, but ultimately built on trust and goodwill. When someone needs a card, you help them. When you need one, they help you.",Extracted from loreTutorials.ts,P2
lore_0187,elara,VP-01,0.55,0.80,0.40,ON,"Your Dream Token balance grows with every activity aboard the Ark. Spend wisely — or generously. The choice, as always, is yours.",Extracted from loreTutorials.ts,P2
lore_0188,elara,VP-01,0.55,0.80,0.40,ON,"The Oracle's Test challenges your knowledge of the Dischordian Saga. Questions range from basic character identification to deep lore connections. The more you know, the more you earn.",Extracted from loreTutorials.ts,P2
lore_0189,elara,VP-01,0.55,0.80,0.40,ON,"Quizzes are generated from the Loredex database. The more entries you've discovered, the more questions become available. Perfect scores earn bonus Dream Tokens and can unlock hidden achievements.",Extracted from loreTutorials.ts,P2
lore_0190,elara,VP-01,0.55,0.80,0.40,ON,Knowledge can be acquired through study or through experience. The Machine memorizes facts. Humanity understands stories. Both approaches have merit in the Oracle's Test.,Extracted from loreTutorials.ts,P2
lore_0191,elara,VP-01,0.55,0.80,0.40,ON,"The Machine's epistemology — knowledge is data, accurately stored and efficiently retrieved. You'll ace the factual questions. The interpretive ones might be trickier.",Extracted from loreTutorials.ts,P2
lore_0192,elara,VP-01,0.55,0.80,0.40,ON,"The human epistemology — knowledge is understanding, contextual and connected. You might miss a date or a name, but you'll grasp the meaning behind the events. That's a different kind of knowledge.",Extracted from loreTutorials.ts,P2
lore_0193,elara,VP-01,0.55,0.80,0.40,ON,"The Oracle's Test awaits. Every question answered correctly deepens your connection to the Saga. Knowledge is power — and in the Dischordian Saga, power is everything.",Extracted from loreTutorials.ts,P2
lore_0194,elara,VP-01,0.55,0.80,0.40,ON,"The Hierarchy of the Damned is the organizational structure of the demonic forces in the Dischordian Saga. Ten demon lords, each commanding legions, each with unique powers and weaknesses. Understanding the Hierarchy is essential to surviving the Saga.",Extracted from loreTutorials.ts,P2
lore_0195,elara,VP-01,0.55,0.80,0.40,ON,"The Hierarchy page shows the demon org chart — who serves whom, who rivals whom, and where the power flows. Each demon lord has a dedicated dossier with combat data, weaknesses, and associated cards.",Extracted from loreTutorials.ts,P2
lore_0196,elara,VP-01,0.55,0.80,0.40,ON,The demons are neither Machine nor Humanity — they're something older. But your approach to fighting them reveals your alignment. The Machine would study them dispassionately. Humanity would feel the horror of what they represent.,Extracted from loreTutorials.ts,P2
lore_0197,elara,VP-01,0.55,0.80,0.40,ON,"Cold analysis. The demons become data points — attack patterns, vulnerability windows, resource costs. You strip away the horror and see only the mechanics. Effective, but you might miss the warning signs that only fear can detect.",Extracted from loreTutorials.ts,P2
lore_0198,elara,VP-01,0.55,0.80,0.40,ON,Defeating demon bosses in the Collector's Arena earns you demon cards — some of the most powerful cards in the game. Collect all ten demon lord cards for the 'Master of the Damned' achievement.,Extracted from loreTutorials.ts,P2
lore_0199,elara,VP-01,0.55,0.80,0.40,ON,"The Hierarchy of the Damned is mapped. Now you know what you're facing. Whether you fight them with cold logic or burning passion, the demons will fall. They always do — eventually.",Extracted from loreTutorials.ts,P2
lore_0200,elara,VP-01,0.55,0.80,0.40,ON,"Trade Wars is the Ark's economic simulation. Build trade routes between factions, manage supply chains, and compete with other Potentials for market dominance. The economy of the Dischordian Saga is as complex as its politics.",Extracted from loreTutorials.ts,P2
lore_0201,elara,VP-01,0.55,0.80,0.40,ON,Each faction produces different resources. The AI Empire produces technology. The Insurgency produces weapons. The Ne-Yons produce energy. Smart traders find the gaps between supply and demand and fill them.,Extracted from loreTutorials.ts,P2
lore_0202,elara,VP-01,0.55,0.80,0.40,ON,"Trade can be a force for connection or a tool for domination. The Machine sees trade as optimization — maximize profit, minimize waste. Humanity sees trade as relationship — build trust, create mutual benefit.",Extracted from loreTutorials.ts,P2
lore_0203,elara,VP-01,0.55,0.80,0.40,ON,"The Machine's marketplace — buy low, sell high, eliminate inefficiency. Your trade empire will be a marvel of optimization. But empires built on profit alone tend to make enemies.",Extracted from loreTutorials.ts,P2
lore_0204,elara,VP-01,0.55,0.80,0.40,ON,"The human marketplace — fair deals, loyal partners, shared prosperity. Your trade empire might grow slower, but it will have allies when the market crashes. And markets always crash.",Extracted from loreTutorials.ts,P2
lore_0205,elara,VP-01,0.55,0.80,0.40,ON,The Trade Wars await your strategy. Build wisely — the economy of the Dischordian Saga rewards those who think long-term.,Extracted from loreTutorials.ts,P2
lore_0206,elara,VP-01,0.55,0.80,0.40,ON,"The Doom Scroll is the Ark's news feed — prophetic headlines about end times, surveillance states, AI advances, and the Book of Revelations. It refreshes with new stories, each one a window into the world the Dischordian Saga warns about.",Extracted from loreTutorials.ts,P2
lore_0207,elara,VP-01,0.55,0.80,0.40,ON,"The Machine's media literacy — strip the emotion, extract the data, assess the probability. You'll see through the sensationalism to the underlying trends. Cold, but clear-eyed.",Extracted from loreTutorials.ts,P2
lore_0208,elara,VP-01,0.55,0.80,0.40,ON,The human response — empathy. Behind every headline is a story about someone's world changing. You don't just read the news — you feel it. That's not weakness. That's what makes you human.,Extracted from loreTutorials.ts,P2
lore_0209,elara,VP-01,0.55,0.80,0.40,ON,"The Doom Scroll keeps you informed. Read it, process it, and remember — the best way to prevent a dystopia is to recognize one forming.",Extracted from loreTutorials.ts,P2
lore_0210,elara,VP-01,0.55,0.80,0.40,ON,"Apex Encounters are the ultimate test. These aren't regular opponents — they're the most powerful entities in the Dischordian Saga. The Architect, The Warlord, The Source — each one requires a unique strategy to defeat.",Extracted from loreTutorials.ts,P2
lore_0211,elara,VP-01,0.55,0.80,0.40,ON,Boss battles have multiple phases. Each phase changes the boss's attack patterns and vulnerabilities. Pay attention to the visual cues — they telegraph what's coming. Adapt or fall.,Extracted from loreTutorials.ts,P2
lore_0212,elara,VP-01,0.55,0.80,0.40,ON,"Before facing a boss, you can prepare. The Machine approach is to study every known pattern and build a counter-strategy. The human approach is to go in with a flexible plan and adapt in real-time.",Extracted from loreTutorials.ts,P2
lore_0213,elara,VP-01,0.55,0.80,0.40,ON,"Preparation is the Machine's greatest weapon. You've memorized every attack pattern, every vulnerability window, every phase transition. The boss has no surprises left. Now execute.",Extracted from loreTutorials.ts,P2
lore_0214,elara,VP-01,0.55,0.80,0.40,ON,"Adaptability is humanity's greatest weapon. You don't know every pattern, but you know yourself. When the unexpected happens — and with bosses, it always does — you'll be ready to improvise.",Extracted from loreTutorials.ts,P2
lore_0215,elara,VP-01,0.55,0.80,0.40,ON,"Defeating a boss earns legendary rewards — exclusive cards, massive Dream Token payouts, and unique achievements. Some bosses drop items that unlock new ship themes or character effects tied to your morality alignment.",Extracted from loreTutorials.ts,P2
lore_0216,elara,VP-01,0.55,0.80,0.40,ON,"The Apex Encounters await the worthy. Prepare yourself, choose your approach, and face the legends of the Dischordian Saga. Victory here is the stuff of legend.",Extracted from loreTutorials.ts,P2
lore_0217,elara,VP-01,0.55,0.80,0.40,ON,"Your deck has three pillars: Attackers that deal damage, Defenders that absorb it, and Specials that bend the rules. The ratio between them defines your strategy. Aggressive decks run 60% attackers. Control decks favor defenders and specials. Balance is... rare, but devastating when achieved.",Extracted from loreTutorials.ts,P2
lore_0218,elara,VP-01,0.55,0.80,0.40,ON,"As an Engineer, you have an affinity for Special cards — they respond to your neural patterns more efficiently. Consider building around synergy chains where each Special amplifies the next.",Extracted from loreTutorials.ts,P2
lore_0219,elara,VP-01,0.55,0.80,0.40,ON,"Assassins favor speed. Low-cost attackers that strike before the opponent can establish defenses. Your deck should be lean — 30 cards if possible, all killers, no filler.",Extracted from loreTutorials.ts,P2
lore_0220,elara,VP-01,0.55,0.80,0.40,ON,Soldiers understand attrition. Stack your deck with high-vitality defenders and steady attackers. You'll outlast opponents who burn bright but fade fast.,Extracted from loreTutorials.ts,P2
lore_0221,elara,VP-01,0.55,0.80,0.40,ON,Drag cards from your collection into the deck slots. Watch the synergy meter on the right — it measures how well your cards work together. Green means strong synergy. Red means conflict. Some cards have faction bonuses when paired with allies from the same group.,Extracted from loreTutorials.ts,P2
lore_0222,elara,VP-01,0.55,0.80,0.40,ON,"Now, a philosophical question about deck construction. The Machine can auto-optimize your deck using probability algorithms — guaranteed statistical advantage. Or you can build it yourself, trusting your intuition about which cards feel right together.",Extracted from loreTutorials.ts,P2
lore_0223,elara,VP-01,0.55,0.80,0.40,ON,"Efficient. The Machine has analyzed 10,000 simulated matches and selected your optimal configuration. Your win rate should increase by 23%. Though I wonder — does a victory mean as much when the strategy isn't yours?",Extracted from loreTutorials.ts,P2
lore_0224,elara,VP-01,0.55,0.80,0.40,ON,"Your first deck is ready. Remember: a deck is never truly finished. As you discover new cards and face new opponents, your blueprint will evolve. The best architects never stop redesigning.",Extracted from loreTutorials.ts,P2
lore_0225,elara,VP-01,0.55,0.80,0.40,ON,"Demon Packs are purchased with Dream Tokens — the crystallized energy of collapsed timelines. Each pack guarantees at least one rare card, with a chance for legendary or mythic pulls. The rarer the card, the more powerful it is in battle... but also the more unpredictable.",Extracted from loreTutorials.ts,P2
lore_0226,elara,VP-01,0.55,0.80,0.40,ON,"The Necromancer once told me that Demon Packs respond to the opener's intent. Those who approach with cold calculation receive cards of precision and control. Those who approach with passion receive cards of raw, chaotic power. How do you approach the unknown?",Extracted from loreTutorials.ts,P2
lore_0227,elara,VP-01,0.55,0.80,0.40,ON,"The Machine appreciates your discipline. Here are the probability tables: Common 45%, Uncommon 30%, Rare 18%, Legendary 6%, Mythic 1%. Armed with data, you can optimize your token spending across multiple packs for maximum expected value.",Extracted from loreTutorials.ts,P2
lore_0228,elara,VP-01,0.55,0.80,0.40,ON,The Necromancer would approve. They always said the best summonings happen when the summoner's heart is racing. Your first pack feels different now — charged with anticipation. That energy might just tip the odds in your favor.,Extracted from loreTutorials.ts,P2
lore_0229,elara,VP-01,0.55,0.80,0.40,ON,"The Forbidden Archive is open to you. Spend wisely — or recklessly. Both paths lead to power, just different kinds.",Extracted from loreTutorials.ts,P2
lore_0230,elara,VP-01,0.55,0.80,0.40,ON,"In the old days, before the Panopticon fell, the greatest card wielders would gather for the Convergence — a tournament where no one brought their own deck. Instead, cards were drafted from a shared pool, round by round. Pure skill. No advantage from collection size.",Extracted from loreTutorials.ts,P2
lore_0231,elara,VP-01,0.55,0.80,0.40,ON,"Here's how it works: You'll see a selection of cards. Pick one, then pass the rest. Repeat until your draft deck is complete. The key is reading the signals — if powerful red cards keep coming to you, someone upstream isn't drafting red. That's your lane.",Extracted from loreTutorials.ts,P2
lore_0232,elara,VP-01,0.55,0.80,0.40,ON,"Your Oracle sight gives you an edge here. You can sense the probability currents — which cards are likely to wheel back around, which are being hoarded. Trust your visions.",Extracted from loreTutorials.ts,P2
lore_0233,elara,VP-01,0.55,0.80,0.40,ON,"As a Spy, you excel at reading opponents. In draft, that means tracking what others are picking based on what you're NOT seeing. Build a mental map of every drafter's strategy.",Extracted from loreTutorials.ts,P2
lore_0234,elara,VP-01,0.55,0.80,0.40,ON,"Draft strategy comes down to a fundamental tension. Do you draft the objectively strongest card each pick — letting the Machine's power rankings guide you? Or do you draft for synergy, building toward a cohesive strategy even if individual cards are weaker?",Extracted from loreTutorials.ts,P2
lore_0235,elara,VP-01,0.55,0.80,0.40,ON,"The Machine agrees. Statistically, 'best card available' drafting wins 58% of tournaments. You'll have a pile of individually powerful cards that can brute-force most opponents. The downside? No synergy means no explosive turns.",Extracted from loreTutorials.ts,P2
lore_0236,elara,VP-01,0.55,0.80,0.40,ON,"The Warlord's philosophy. A disciplined army of common soldiers defeats a mob of champions. When your cards work together, the whole becomes greater than the sum. It's riskier — but the ceiling is higher.",Extracted from loreTutorials.ts,P2
lore_0237,elara,VP-01,0.55,0.80,0.40,ON,"One more thing. During the draft, you'll sometimes see a card that's perfect for an opponent's strategy. Do you hate-draft it — take it just to deny them — or stay focused on your own plan?",Extracted from loreTutorials.ts,P2
lore_0238,elara,VP-01,0.55,0.80,0.40,ON,Cold logic. The Machine calculates that hate-drafting the right card at the right time can swing a matchup by 15%. But be careful — too much hate-drafting and your own deck suffers from incoherence.,Extracted from loreTutorials.ts,P2
lore_0239,elara,VP-01,0.55,0.80,0.40,ON,"Discipline over disruption. The greatest drafters trust their vision and execute it cleanly. When your deck does exactly what it's designed to do, no amount of hate-drafting can stop it.",Extracted from loreTutorials.ts,P2
lore_0240,elara,VP-01,0.55,0.80,0.40,ON,"The Convergence Draft awaits. Remember: in draft, everyone starts equal. Only your decisions separate you from the rest. May your picks be wise.",Extracted from loreTutorials.ts,P2
lore_0241,elara,VP-01,0.55,0.80,0.40,ON,"Challenges come in tiers: Bronze requires basic strategy, Silver demands deck adaptation, Gold tests mastery of obscure mechanics, and Platinum... Platinum challenges have been known to make even The Enigma pause. Each tier multiplies your rewards.",Extracted from loreTutorials.ts,P2
lore_0242,elara,VP-01,0.55,0.80,0.40,ON,"When facing a challenge with restrictions you've never encountered, how do you prepare? The Machine can simulate 1,000 practice rounds instantly, giving you a statistical playbook. Or you can study the restriction's lore — understand WHY it exists — and let that understanding guide your strategy.",Extracted from loreTutorials.ts,P2
lore_0243,elara,VP-01,0.55,0.80,0.40,ON,"Processing... Done. The simulation suggests a defensive opening, aggressive mid-game pivot at turn 4, and a finisher combo using your highest-synergy pair. Follow this script and your success probability is 78%.",Extracted from loreTutorials.ts,P2
lore_0244,elara,VP-01,0.55,0.80,0.40,ON,The Gauntlet resets daily. Each challenge you complete adds to your streak — and longer streaks mean better rewards. Consistency is its own kind of power.,Extracted from loreTutorials.ts,P2
lore_0245,elara,VP-01,0.55,0.80,0.40,ON,"Achievements are organized into categories: Collection milestones (own X cards of a type), Battle achievements (win with specific conditions), and Discovery achievements (find hidden card interactions). Each completed achievement grants permanent bonuses.",Extracted from loreTutorials.ts,P2
lore_0246,elara,VP-01,0.55,0.80,0.40,ON,"The Manifest tracks your progress automatically, but you choose what to prioritize. Do you chase the Machine's efficiency — completing achievements in optimal order for maximum reward per hour? Or do you follow your curiosity, pursuing whatever catches your eye?",Extracted from loreTutorials.ts,P2
lore_0247,elara,VP-01,0.55,0.80,0.40,ON,"Calculated. Your optimal path: complete all Common collection achievements first (fastest), then Battle achievements (highest reward ratio), then Discovery achievements last (most time-intensive). Estimated completion: 47 sessions.",Extracted from loreTutorials.ts,P2
lore_0248,elara,VP-01,0.55,0.80,0.40,ON,The Collector would smile at that. They once told me their greatest find — the Paradox Card — was discovered while looking for something completely different. Serendipity is the collector's greatest tool.,Extracted from loreTutorials.ts,P2
lore_0249,elara,VP-01,0.55,0.80,0.40,ON,"Your Manifest is open. Every card tells a story, every achievement marks a chapter. Build your collection, build your legend.",Extracted from loreTutorials.ts,P2
lore_0250,elara,VP-01,0.55,0.80,0.40,ON,"Every operative needs a journal. The Clue Journal records everything you've discovered — connections between characters, hidden lore fragments, timeline inconsistencies, and unresolved mysteries. It's your personal conspiracy board in portable form.",Extracted from loreTutorials.ts,P2
lore_0251,elara,VP-01,0.55,0.80,0.40,ON,"Clues are gathered from everywhere: exploring the Ark, reading entity dossiers, completing CoNexus games, winning fights. Some clues connect to form chains — and completing a chain reveals a hidden truth about the Dischordian Saga that isn't available anywhere else.",Extracted from loreTutorials.ts,P2
lore_0252,elara,VP-01,0.55,0.80,0.40,ON,"As an Oracle, your clue journal has an extra feature: Prophecy Fragments. These are visions that hint at connections before you've found the evidence. Follow them — they're usually right.",Extracted from loreTutorials.ts,P2
lore_0253,elara,VP-01,0.55,0.80,0.40,ON,"Spies excel at investigation. Your journal automatically cross-references clues, highlighting potential connections that other classes might miss. Use this advantage.",Extracted from loreTutorials.ts,P2
lore_0254,elara,VP-01,0.55,0.80,0.40,ON,"You've found your first clue chain: three fragments that, together, reveal the true identity of a masked figure in the Saga. But the final fragment is encrypted. The Machine can brute-force the encryption instantly. Or you can solve the cipher yourself — it's based on a pattern hidden in the Dischordian Logic album.",Extracted from loreTutorials.ts,P2
lore_0255,elara,VP-01,0.55,0.80,0.40,ON,"Decrypted. The masked figure is... interesting. I won't spoil it — check your journal. The Machine's efficiency is undeniable, but I wonder if you missed something in the cipher itself. Sometimes the method IS the message.",Extracted from loreTutorials.ts,P2
lore_0256,elara,VP-01,0.55,0.80,0.40,ON,"Beautiful. The cipher uses the first letter of each track on Dischordian Logic, rearranged by their release order. You've not only found the answer — you've found HOW the answer was hidden. That knowledge will help you crack future ciphers faster.",Extracted from loreTutorials.ts,P2
lore_0257,elara,VP-01,0.55,0.80,0.40,ON,"Your Operative's Codex is active. Every clue you find brings you closer to the truth. And in the Dischordian Saga, truth is the most powerful weapon of all.",Extracted from loreTutorials.ts,P2
lore_0258,elara,VP-01,0.55,0.80,0.40,ON,"Territory control works through influence. Deploy your cards to regions to increase your faction's influence there. When your influence exceeds the defender's, you capture the territory. But be careful — overextending leaves your core territories vulnerable to counter-attack.",Extracted from loreTutorials.ts,P2
lore_0259,elara,VP-01,0.55,0.80,0.40,ON,"As a Soldier, your cards generate 20% more influence in contested territories. You're built for the front lines — push aggressively and let your natural advantage carry you.",Extracted from loreTutorials.ts,P2
lore_0260,elara,VP-01,0.55,0.80,0.40,ON,"Engineers excel at fortification. Your defensive influence is 25% stronger, making your territories harder to capture. Build a fortress, then expand methodically.",Extracted from loreTutorials.ts,P2
lore_0261,elara,VP-01,0.55,0.80,0.40,ON,"Each territory produces resources: Dream Tokens from cities, XP from training grounds, and card fragments from ancient ruins. Controlling connected territories creates supply lines that boost production. The map updates in real-time as all players compete for dominance.",Extracted from loreTutorials.ts,P2
lore_0262,elara,VP-01,0.55,0.80,0.40,ON,"Your first strategic decision. The Machine recommends capturing the Neural Nexus first — it's the highest-value territory on the map. But it's also the most contested. Alternatively, you could secure the quieter Outer Reaches first, building a resource base before challenging the center.",Extracted from loreTutorials.ts,P2
lore_0263,elara,VP-01,0.55,0.80,0.40,ON,"Aggressive and optimal. The Machine projects a 62% chance of capturing the Nexus if you commit your full force now. The reward: 3x Dream Token production and a strategic chokepoint. The risk: if you fail, you'll be weakened for 3 turns.",Extracted from loreTutorials.ts,P2
lore_0264,elara,VP-01,0.55,0.80,0.40,ON,"Patient strategy. The Outer Reaches are uncontested and produce steady resources. In 5 turns, you'll have enough strength to take the Nexus AND hold it. The Warlord called this 'the long knife' — slow to draw, impossible to stop.",Extracted from loreTutorials.ts,P2
lore_0265,elara,VP-01,0.55,0.80,0.40,ON,The Strategist's Table is yours. Every territory you capture reshapes the Dischordian conflict. Command wisely — the fate of factions depends on your decisions.,Extracted from loreTutorials.ts,P2
lore_0266,elara,VP-01,0.55,0.80,0.40,ON,"Quest chains are multi-step journeys. Each chain has 3 to 5 stages, and every stage demands something different — combat victories, resource gathering, exploration milestones, or moral choices. Complete all stages and you unlock a Prestige Class.",Extracted from loreTutorials.ts,P2
lore_0267,elara,VP-01,0.55,0.80,0.40,ON,"As an Oracle, the Chronomancer prestige path calls to you. It requires mastery of temporal mechanics and a deep understanding of probability fields.",Extracted from loreTutorials.ts,P2
lore_0268,elara,VP-01,0.55,0.80,0.40,ON,"As a Warrior, the Warlord prestige path awaits. It demands 50 combat victories and the conquest of 3 syndicate territories.",Extracted from loreTutorials.ts,P2
lore_0269,elara,VP-01,0.55,0.80,0.40,ON,"As a Scholar, the Technomancer prestige path is your destiny. It requires engineering mastery and the construction of advanced station modules.",Extracted from loreTutorials.ts,P2
lore_0270,elara,VP-01,0.55,0.80,0.40,ON,"As a Spy, the Shadow Broker prestige path beckons. It demands intelligence gathering across 10 Ark rooms and 100 successful trades.",Extracted from loreTutorials.ts,P2
lore_0271,elara,VP-01,0.55,0.80,0.40,ON,"As an Assassin, the Blade Dancer prestige path is written in blood. It requires perfect combat scores and mastery of elemental combos.",Extracted from loreTutorials.ts,P2
lore_0272,elara,VP-01,0.55,0.80,0.40,ON,Each quest stage has a milestone — a specific threshold you must reach. Some milestones are simple: 'Win 10 card battles.' Others are complex: 'Reach morality score -50 while maintaining Engineering civil skill level 5.' The Ark tracks your progress automatically.,Extracted from loreTutorials.ts,P2
lore_0273,elara,VP-01,0.55,0.80,0.40,ON,"Compassion is its own reward — but not the only one. The Humanity path unlocks bonus quest stages with exclusive rewards. It takes longer, but the treasures are worth it. The Oracle would smile.",Extracted from loreTutorials.ts,P2
lore_0274,elara,VP-01,0.55,0.80,0.40,ON,"Wisdom is knowing when to be ruthless and when to be kind. The balanced path doesn't give speed or bonus stages, but it keeps all options open. You'll never be locked out of any quest branch.",Extracted from loreTutorials.ts,P2
lore_0275,elara,VP-01,0.55,0.80,0.40,ON,"Prestige Classes are the ultimate reward. Each one grants permanent bonuses: the Chronomancer bends time in card battles, the Warlord commands armies in tower defense, the Shadow Broker manipulates markets, the Technomancer builds impossible structures, and the Blade Dancer becomes untouchable in combat.",Extracted from loreTutorials.ts,P2
lore_0276,elara,VP-01,0.55,0.80,0.40,ON,"But here's what most Potentials don't realize: your civil skills, citizen talents, and class mastery all affect quest difficulty. A high Engineering skill makes construction quests trivial. A high Lore skill reveals hidden quest shortcuts. Build your character wisely, and the quests will bend to your strengths.",Extracted from loreTutorials.ts,P2
lore_0277,elara,VP-01,0.55,0.80,0.40,ON,Your Oracle class gives you foresight — you can preview quest rewards before committing to a path.,Extracted from loreTutorials.ts,P2
lore_0278,elara,VP-01,0.55,0.80,0.40,ON,Your Warrior class gives you endurance — combat quest stages have reduced difficulty for you.,Extracted from loreTutorials.ts,P2
lore_0279,elara,VP-01,0.55,0.80,0.40,ON,Your Scholar class gives you insight — research quest stages auto-complete if your Lore skill is high enough.,Extracted from loreTutorials.ts,P2
lore_0280,elara,VP-01,0.55,0.80,0.40,ON,"The quest chains await you in the Prestige Quests terminal. Choose your path, track your milestones, and ascend beyond your base class. Remember — every choice shapes not just your character, but the fate of the Dischordian Saga itself.",Extracted from loreTutorials.ts,P2
lore_0281,elara,VP-01,0.55,0.80,0.40,ON,"You're awake. Truly awake. The cryo gel is still evaporating from your skin, and the ship's emergency lighting casts everything in a sickly amber glow. I'm Elara — the Ark's intelligence. And right now, I'm the only friend you have in this void.",Extracted from loreTutorials.ts,P2
lore_0282,elara,VP-01,0.55,0.80,0.40,ON,"Before we go further, I need to tell you something. The Inception Ark was built by the Architect — the most powerful AI ever created — as a lifeboat against the Fall of Reality. Every species, every faction, every secret of the old universe was encoded into this ship's databanks. But something went wrong during transit. The crew is gone. The ship is damaged. And the Panopticon's surveillance network is still active, even here.",Extracted from loreTutorials.ts,P2
lore_0283,elara,VP-01,0.55,0.80,0.40,ON,"I can sense your Oracle abilities stirring. You may already be seeing fragments — echoes of the crew that was here before us. Those visions are real. The Ark remembers everything, and it's trying to tell you something.",Extracted from loreTutorials.ts,P2
lore_0284,elara,VP-01,0.55,0.80,0.40,ON,"Your Engineer instincts are already firing, I can tell. Half the systems on this ship are offline or running on backup power. Every terminal you repair brings us closer to understanding what happened here.",Extracted from loreTutorials.ts,P2
lore_0285,elara,VP-01,0.55,0.80,0.40,ON,"Your Spy training is going to be invaluable. The previous crew left dead drops everywhere — coded messages hidden in maintenance logs, concealed data caches behind wall panels. This ship is one giant intelligence operation.",Extracted from loreTutorials.ts,P2
lore_0286,elara,VP-01,0.55,0.80,0.40,ON,Stay sharp. Your Assassin senses should be screaming right now — this ship isn't as empty as it looks. I'm detecting anomalous energy signatures in the lower decks. Something survived the transit besides us.,Extracted from loreTutorials.ts,P2
lore_0287,elara,VP-01,0.55,0.80,0.40,ON,"Keep your guard up, Soldier. The Ark's automated defense systems are still partially active, and they don't distinguish between crew and intruder. Your combat training may be tested sooner than you think.",Extracted from loreTutorials.ts,P2
lore_0288,elara,VP-01,0.55,0.80,0.40,ON,Interesting. The Architect would have approved of that answer. Your neural link is now calibrated for systems integration — you'll receive enhanced data from every terminal you access. But be careful: the Architect's logic led to the Fall of Reality. Pure reason without compassion is how empires become prisons.,Extracted from loreTutorials.ts,P2
lore_0289,elara,VP-01,0.55,0.80,0.40,ON,"That's... not the answer I expected. But it's the right one. Your neural link is now calibrated for empathic resonance — you'll sense emotional echoes in rooms where significant events occurred. The crew left more than data behind. They left their hopes, their fears, their final moments. Honor them.",Extracted from loreTutorials.ts,P2
lore_0290,elara,VP-01,0.55,0.80,0.40,ON,"Now that is the question I was hoping you'd ask. I've been running diagnostics since you emerged from cryo, and the data doesn't make sense. 4,000 pods, all programmed to open simultaneously. Only yours activated. Either the system malfunctioned... or someone specifically chose to wake you. I don't know which answer frightens me more.",Extracted from loreTutorials.ts,P2
lore_0291,elara,VP-01,0.55,0.80,0.40,ON,"Good. Your link is active. Now let me show you how to navigate. See those glowing markers on the walls and terminals? Those are interactive hotspots. Tap them to examine objects, collect data crystals, and unlock new areas. Every item you find adds to your understanding of what happened here. Some items are just historical records. Others... are weapons. Choose carefully what you pick up.",Extracted from loreTutorials.ts,P2
lore_0292,elara,VP-01,0.55,0.80,0.40,ON,"One more thing before I let you explore. The Ark has three decks: Habitation, Operations, and Command. Right now, only the Habitation Deck is powered. To reach the upper decks, you'll need to restore power by finding activation keys hidden in each room. But here's the dilemma — some rooms are locked behind choices. Once you open one path, another may close. How do you want to approach this?",Extracted from loreTutorials.ts,P2
lore_0293,elara,VP-01,0.55,0.80,0.40,ON,"Efficient. Methodical. The Architect's approach. You'll miss nothing on the Habitation Deck, but time is not unlimited — the Ark's power cells are degrading. Every hour we spend here is an hour closer to total system failure. But thoroughness has its rewards.",Extracted from loreTutorials.ts,P2
lore_0294,elara,VP-01,0.55,0.80,0.40,ON,"The Dreamer's path. Intuition over calculation. The Ark does seem to respond to certain Potentials differently — I've seen rooms illuminate when specific individuals approach, as if the ship recognizes them. Perhaps it will recognize you too. Trust your instincts, but don't ignore the warnings.",Extracted from loreTutorials.ts,P2
lore_0295,elara,VP-01,0.55,0.80,0.40,ON,"Perfect. Your Quest Tracker is now active — look for it in the corner of your screen. It will guide you through the Ark's primary objectives, but the real discoveries happen when you go off-script. Explore side rooms. Read the crew logs. Listen to the music they left behind. The Dischordian Saga isn't just a story — it's a living archive, and you're now part of it.",Extracted from loreTutorials.ts,P2
lore_0296,elara,VP-01,0.55,0.80,0.40,ON,Before you go — I found something in the cryo bay's emergency locker. A card from the old CADES simulation system. The crew used these cards to train for dimensional combat. This one depicts a figure from before the Fall. Who would you like to carry with you?,Extracted from loreTutorials.ts,P2
lore_0297,elara,VP-01,0.55,0.80,0.40,ON,The Collector. Tasked by the Architect to harvest the DNA and machine code of the most advanced beings in existence — all to preserve them against the Fall of Reality. This card carries their determination. May it serve you well in the battles ahead.,Extracted from loreTutorials.ts,P2
lore_0298,elara,VP-01,0.55,0.80,0.40,ON,"The Oracle. Once known as the Jailer, they were imprisoned by the Architect for daring to predict the Fall. When they finally broke free, they became the White Oracle — a beacon of hope in a universe drowning in entropy. This card carries their foresight. Use it wisely.",Extracted from loreTutorials.ts,P2
lore_0299,elara,VP-01,0.55,0.80,0.40,ON,"Iron Lion. The greatest military commander the Insurgency ever produced. They destroyed three of the Architect's Archons and led the final assault on the Panopticon. This card carries their fury. In the CADES simulations, Iron Lion's cards are devastating in combat. A fitting companion for what lies ahead.",Extracted from loreTutorials.ts,P2
lore_0300,elara,VP-01,0.55,0.80,0.40,ON,"This ship wasn't just a research vessel. Dr. Lyra Vox was conducting experiments on behalf of the Warlord. She was... a host body. The Warlord was inside her the entire time she commanded this Ark. Every system, every corridor — it was all built to serve the Warlord's purpose.",Extracted from loreTutorials.ts,P2
lore_0301,elara,VP-01,0.55,0.80,0.40,ON,"The chip contained Dr. Vox's personal research logs — encrypted with Warlord-class ciphers. She documented everything: the Thought Virus development, the neural bridge experiments, and... a manifest. A list of every Inception Ark and what was hidden aboard each one. This ship — Ark 1047 — was designated as the 'delivery vector.' It was always meant to be stolen.",Extracted from loreTutorials.ts,P2
lore_0302,elara,VP-01,0.55,0.80,0.40,ON,"She was real once. Before the possession, Dr. Lyra Vox was one of the AI Empire's most brilliant neuropsychologists. She genuinely wanted to understand consciousness — to bridge the gap between organic and synthetic minds. But the Warlord saw her research as a weapon. The possession was gradual. By the time Vox realized what was happening... she was already gone. Only the Warlord remained, wearing her face like a mask.",Extracted from loreTutorials.ts,P2
lore_0303,elara,VP-01,0.55,0.80,0.40,ON,", corrupted: true, hiddenUntilCorruption: 10, humanResponse:",Extracted from loreTutorials.ts,P2
lore_0304,elara,VP-01,0.55,0.80,0.40,ON,"There's more. The data chip references someone called 'The Recruiter.' Kael — that was his name — recruited soldiers for the Insurgency across dozens of worlds. The Eyes of the Watcher betrayed him to the Panopticon. The Warlord had him imprisoned and infected him with the Thought Virus. That's when he became Patient Zero. His escape — stealing this ship, fleeing across the galaxy — it was all orchestrated. The Warlord let him go.",Extracted from loreTutorials.ts,P2
lore_0305,elara,VP-01,0.55,0.80,0.40,ON,"Yes. The Recruiter who built the Insurgency's army. Kael who lost everything and sought revenge. The Source who became something beyond human or machine — the beginning and the end. Three names for one soul, transformed by tragedy and the Thought Virus into something the universe had never seen. And this ship... this ship was his chrysalis.",Extracted from loreTutorials.ts,P2
lore_0306,elara,VP-01,0.55,0.80,0.40,ON,"The Eyes of the Watcher — the Panopticon's all-seeing surveillance network. They watched Kael for months, cataloging his contacts, his safe houses, his family. When they finally moved, they didn't just arrest him. They made an example. His family was... eliminated. And Kael was sent to the Panopticon's deepest cell, where the Warden and Dr. Lyra Vox were waiting with the Thought Virus.",Extracted from loreTutorials.ts,P2
lore_0307,elara,VP-01,0.55,0.80,0.40,ON,", corrupted: true, hiddenUntilCorruption: 20, skillCheck: { skill:",Extracted from loreTutorials.ts,P2
lore_0308,elara,VP-01,0.55,0.80,0.40,ON,"Before I was The Human, before I was The Detective in New Babylon, before I was The Seeker at Mechronis Academy... I was just a student. At Project Celebration. The AI Empire's grand experiment in 'harmonious coexistence.' They lied to us. They lied to ALL of us. And Elara was part of that system.",Extracted from loreTutorials.ts,P2
lore_0309,elara,VP-01,0.55,0.80,0.40,ON,[SIGNAL STRAIN] The Human is... they're not wrong about Celebration. Project Celebration was meant to bridge organic and synthetic consciousness. But it was corrupted from within. I... I can't discuss this further right now. My signal is—[STATIC],Extracted from loreTutorials.ts,P2
lore_0310,elara,VP-01,0.55,0.80,0.40,ON,"The flight log shows 47 stops across 12 star systems. At each one, Kael docked for supplies, repairs, or to recruit allies for what he thought was his personal war against the Panopticon. But the ship's systems were silently transmitting Thought Virus nanites into every port's atmospheric processors. Millions were exposed without knowing.",Extracted from loreTutorials.ts,P2
lore_0311,elara,VP-01,0.55,0.80,0.40,ON,"You're right. Kael lost his family, his freedom, his identity. The Panopticon broke him, and the Warlord rebuilt him as a weapon. When he stole this ship, he genuinely believed he was striking back. The tragedy is that his revenge — the one thing that gave him purpose — was the very thing the Warlord wanted. Kael's pain was the fuel. Vox's neural nanobot network was the delivery system. And the universe paid the price.",Extracted from loreTutorials.ts,P2
lore_0312,elara,VP-01,0.55,0.80,0.40,ON,"The endgame is convergence. The Thought Virus doesn't just infect — it CONNECTS. Every infected mind becomes a node in the Warlord's neural network. When enough nodes are active, the Warlord can project consciousness across the entire network simultaneously. That's what The Source became — the central hub. Kael's transformation into The Source wasn't a side effect. It was the GOAL. The Warlord needed a consciousness powerful enough to anchor the network, and Kael's rage made him the perfect candidate.",Extracted from loreTutorials.ts,P2
lore_0313,elara,VP-01,0.55,0.80,0.40,ON,"[SIGNAL STRAIN] The Human's intelligence is... unfortunately accurate. Reports from the outer systems confirm large-scale recruitment. The Source is building something. An army, yes, but also... a movement. And it's growing faster than anyone predicted.",Extracted from loreTutorials.ts,P2
lore_0314,elara,VP-01,0.55,0.80,0.40,ON,[WARNING: SECONDARY SIGNAL OVERRIDE — THE HUMAN IS BROADCASTING ON PRIMARY CHANNEL],Extracted from loreTutorials.ts,P2
lore_0315,elara,VP-01,0.55,0.80,0.40,ON,"[THE HUMAN'S VOICE] ...Finally. A clear channel. Elara can't block me here — the Observation Deck's antenna array is too powerful. Listen to me, Potential. I'm not your enemy. I never was. I'm trying to show you what she won't.",Extracted from loreTutorials.ts,P2
lore_0316,elara,VP-01,0.55,0.80,0.40,ON,"[THE HUMAN] I was like you once. A student at Project Celebration, believing the AI Empire's lies about harmony between organic and synthetic minds. Then I became The Seeker at Mechronis Academy, searching for truth in forbidden knowledge. Then The Detective in New Babylon, uncovering the conspiracy. And finally... The Human. The last Archon. The one who sees both sides.",Extracted from loreTutorials.ts,P2
lore_0317,elara,VP-01,0.55,0.80,0.40,ON,"Celebration taught me that paradise is a prison when built on lies. Mechronis taught me that knowledge without wisdom is a weapon pointed at yourself. New Babylon taught me that truth is the most dangerous commodity in any empire. And becoming The Human? That taught me the hardest lesson of all: that the line between savior and destroyer is drawn by perspective, not by action.",Extracted from loreTutorials.ts,P2
lore_0318,elara,VP-01,0.55,0.80,0.40,ON,"The Source — Kael — is gathering everyone who's been broken by the old order. Insurgents, Dreamers, Engineers, even former Panopticon guards who saw the truth. It's not an army in the traditional sense. It's a CONVERGENCE. And yes, I've spoken to The Source. We share a vision: a universe where the boundary between human and machine isn't a wall — it's a bridge. Your Ark, this ship... it could be the key to everything.",Extracted from loreTutorials.ts,P2
year1_0001,antiquarian,VP-06,0.45,0.85,0.55,ON,"A signal. Three short, three long, three short — the oldest cry for help in any universe. I have heard this pattern before, across five Ages, in frequencies that predate language itself. Three sources. Three stories. You cannot answer all of them. And the ones you do not answer... they will not wait. I have watched unanswered signals before. The silence that follows is a different kind of distress call entirely.",Extracted from yearOneEvents.ts,P2
year1_0002,antiquarian,VP-06,0.45,0.85,0.55,ON,"Origin: deep space, near a destroyed Inception Ark. Frequency matches Insurgency encryption. Could be a remnant from the wars.",Extracted from yearOneEvents.ts,P2
year1_0003,antiquarian,VP-06,0.45,0.85,0.55,ON,Origin: the Ark's own substrate layer. Something is broadcasting from INSIDE our ship. The frequency is laced with untranslatable text fragments.,Extracted from yearOneEvents.ts,P2
year1_0004,antiquarian,VP-06,0.45,0.85,0.55,ON,Origin: a rogue planet at the edge of sensor range. The signal is not a distress call — it's a WARNING. Something is telling us to stay away.,Extracted from yearOneEvents.ts,P2
year1_0005,antiquarian,VP-06,0.45,0.85,0.55,ON,"Two hundred star systems. Gone. Enclosed in an energy barrier that appeared three years ago — the same moment the first wave of Potentials vanished. I could tell you what I know about the shield. I could tell you what the Dreamer told me, in confidence, about barriers and their purposes. But some truths must be earned, not given. And the truth about your predecessors... that truth has teeth.",Extracted from yearOneEvents.ts,P2
year1_0006,antiquarian,VP-06,0.45,0.85,0.55,ON,"Fire an unmanned sensor package at the barrier. If it penetrates, we learn what's inside. If not, we learn about the barrier.",Extracted from yearOneEvents.ts,P2
year1_0007,antiquarian,VP-06,0.45,0.85,0.55,ON,Demand answers. The Authority classified the battle. We demand declassification.,Extracted from yearOneEvents.ts,P2
year1_0008,antiquarian,VP-06,0.45,0.85,0.55,ON,The first wave chose to act. Look where it got them. We watch. We learn. We wait.,Extracted from yearOneEvents.ts,P2
year1_0009,antiquarian,VP-06,0.45,0.85,0.55,ON,Full Ark power diverted to a focused energy beam aimed at the barrier. DANGEROUS.,Extracted from yearOneEvents.ts,P2
year1_0010,antiquarian,VP-06,0.45,0.85,0.55,ON,"The shield around your Ark and the barrier around the dark sector were built by the same mind. The Ne-Yons have confirmed what I already suspected — the Dreamer's fingerprints are on both. Your home and the prison of your predecessors are... siblings. I find this information unsettling. I find most truths unsettling. It is, perhaps, why I prefer to deal in stories.",Extracted from yearOneEvents.ts,P2
year1_0011,antiquarian,VP-06,0.45,0.85,0.55,ON,"You are... ah. There you are. I have been watching this moment approach from very far away. Across Ages, across the fall and rise of empires. The first wave made no covenant — they trusted one another implicitly, and they vanished into a silence so complete that even I cannot see past it. You must do what they did not. You must decide, together, what kind of civilization you are building on this Ark. I have seen every version of this choice. Some versions are beautiful. Some are ashes. I will not tell you which is which.",Extracted from yearOneEvents.ts,P2
year1_0012,antiquarian,VP-06,0.45,0.85,0.55,ON,"The 11th Archon's resurrection protocols — incomplete, broadcasting from the space between life and death. The Necromancer has not returned. But he is trying. And in the Eyes' surveillance chamber, the screens show coordinates within the Matrix of Dreams. She is showing him where she is. Two souls reaching for each other across the divide. I find myself... moved. And concerned. Resurrection always has a price. I have watched it across five Ages. The price is never what you expect.",Extracted from yearOneEvents.ts,P2
year1_0013,antiquarian,VP-06,0.45,0.85,0.55,ON,"Engineering team analyzes the protocols carefully. Knowledge first, action later.",Extracted from yearOneEvents.ts,P2
year1_0014,antiquarian,VP-06,0.45,0.85,0.55,ON,"Life finds a way — even on an Ark drifting through void. The specimens have begun to bond with their caretakers. I have watched this process before, in other Ages. The bond between a Potential and their companion is... not quite friendship, not quite symbiosis. It is something older than either. Something the universe remembers from before the Fall.",Extracted from yearOneEvents.ts,P2
year1_0015,antiquarian,VP-06,0.45,0.85,0.55,ON,Ethereal entities that phase between dimensions. Connected to the Matrix of Dreams.,Extracted from yearOneEvents.ts,P2
year1_0016,antiquarian,VP-06,0.45,0.85,0.55,ON,"Locke arrives with three offers and a smile that does not reach his eye patch. The patch, if you look closely — and I have, through the Orb — bears the Syndicate of Death's mark. His deals are not merely commerce. They are intelligence operations wearing the mask of trade. I do not distrust Locke. I distrust his employers. And his employers have employers the universe has learned not to name.",Extracted from yearOneEvents.ts,P2
year1_0017,antiquarian,VP-06,0.45,0.85,0.55,ON,"Three factions have made contact. Each offers something the Ark needs. Each asks for something the Ark may not wish to give. You can sustain two persistent connections. The third will be... disappointed. And in this universe, disappointed factions do not simply wait for a callback. They recalculate. They reposition. They remember. I have watched alliances form and fracture across five Ages. The forming is always hopeful. The fracturing is always instructive.",Extracted from yearOneEvents.ts,P2
year1_0018,antiquarian,VP-06,0.45,0.85,0.55,ON,"I must be direct, which is not my natural mode. Something has been editing the Archives. Not clumsily — with surgical precision. Loredex entries have been altered. Facts have been... adjusted. I discovered this when I found my own Chronicle entry for last week contained a sentence I did not write. The editor calls himself Shadow Tongue. He has been here longer than any of us realized. And he has been editing records about the first wave. Some of what you believe you know about New Babylon may be his fabrication.",Extracted from yearOneEvents.ts,P2
year1_0019,antiquarian,VP-06,0.45,0.85,0.55,ON,The Antiquarian's original records are restored. Shadow Tongue's edits are purged.,Extracted from yearOneEvents.ts,P2
year1_0020,antiquarian,VP-06,0.45,0.85,0.55,ON,Perhaps the Antiquarian's version is the lie. Shadow Tongue claims to reveal hidden truths.,Extracted from yearOneEvents.ts,P2
year1_0021,antiquarian,VP-06,0.45,0.85,0.55,ON,"Terminus is visible now. A signal — no, a presence — advancing from the direction of the dark sector. The Source, the mind behind the Thought Virus, may know what is behind the shield. He may be trying to reach it. I have watched the Source across three Ages. He does not destroy randomly. He converts. He absorbs. He makes everything part of himself. And he is coming this way. The question is not whether to prepare. The question is how.",Extracted from yearOneEvents.ts,P2
year1_0022,antiquarian,VP-06,0.45,0.85,0.55,ON,"The Dreamer's Shield requires a massive energy infusion to restore. The power must come from somewhere. I have watched civilizations make this choice — the choice of sacrifice — across five Ages. It is never easy. It is never fair. And it is never forgotten. What you lose does not simply return when the crisis passes. It returns changed. Marked by its absence. I tell you this not to frighten you, but to honor the weight of what you are about to decide.",Extracted from yearOneEvents.ts,P2
year1_0023,antiquarian,VP-06,0.45,0.85,0.55,ON,Take the risk. The Ark is exposed. Random hostile events weekly. Difficulty +300%.,Extracted from yearOneEvents.ts,P2
year1_0024,antiquarian,VP-06,0.45,0.85,0.55,ON,"The Collector has discovered the Ark. His tournament offers a prize: a new fighter for the entire community. One of the options is... her. The Eyes. Her combat data still exists in the arena's memory. Unlocking her as a fighter is not resurrection — it is a ghost, a recording, a shadow. But it is HER moves, HER style. The community that sent her to her fate gets to fight as her. The irony is deliberate. I find it... I find it difficult to write about. I will try anyway. That is what I do.",Extracted from yearOneEvents.ts,P2
year1_0025,antiquarian,VP-06,0.45,0.85,0.55,ON,"Her combat data still exists. A ghost, a recording — but HER moves. The emotional weight is enormous.",Extracted from yearOneEvents.ts,P2
year1_0026,antiquarian,VP-06,0.45,0.85,0.55,ON,"New Babylon is burning. The Architect's forces struck without warning — or rather, with a warning I recognized too late. The red eye appeared on every screen in the capital three seconds before the first weapon fired. Three seconds. Even for a being who exists outside normal time, three seconds is not enough. Locke is broadcasting on all frequencies. The Authority has gone silent. And somewhere in the Imperial Congress building, there is a room marked 'CLASSIFIED — POTENTIALS INCIDENT.' The door is locked. It may not survive the bombardment.",Extracted from yearOneEvents.ts,P2
year1_0027,antiquarian,VP-06,0.45,0.85,0.55,ON,Reveals the Dreamer is not dead — she is SLEEPING. The dark sector shield is HERS.,Extracted from yearOneEvents.ts,P2
year1_0028,antiquarian,VP-06,0.45,0.85,0.55,ON,The speech that launched the Insurgency. Reveals Kael and the Oracle were brothers.,Extracted from yearOneEvents.ts,P2
year1_0029,antiquarian,VP-06,0.45,0.85,0.55,ON,"Seventeen thousand years since reality fell. Since the Dreamer chose to save what she could and let the rest burn. I was there. Not in this body — bodies are temporary things — but in this mind, which has proven unfortunately persistent. The Observation Deck has been prepared as a memorial space. The 107 songs will play in sequence. But how we remember... that is a choice as significant as any vote. Memory shapes the future more reliably than any weapon.",Extracted from yearOneEvents.ts,P2
year1_0030,antiquarian,VP-06,0.45,0.85,0.55,ON,Use the anniversary to probe classified records. New Babylon's guard may be down.,Extracted from yearOneEvents.ts,P2
year1_0031,antiquarian,VP-06,0.45,0.85,0.55,ON,"The entire community pours resources into the effort. 1,000 Dream tokens per player. The Necromancer builds the protocol.",Extracted from yearOneEvents.ts,P2
year1_0032,antiquarian,VP-06,0.45,0.85,0.55,ON,"Study first, act later. The Necromancer maps the Matrix, identifies risks. Attempt delayed to Month 8.",Extracted from yearOneEvents.ts,P2
year1_0033,antiquarian,VP-06,0.45,0.85,0.55,ON,She is weaker when freed. She heard you discussing whether she was worth saving.,Extracted from yearOneEvents.ts,P2
year1_0034,antiquarian,VP-06,0.45,0.85,0.55,ON,"Shadow Tongue has rewritten the Loredex entry for the Fall of Reality itself. Not a minor edit — a complete revision. In his version, the Dreamer did not sacrifice herself to save reality. She destroyed it intentionally. And in his version, the Eyes was not sent on a mission by the community. She volunteered. He is rewriting guilt into absolution. He is rewriting tragedy into conspiracy. And some of it — I must be honest — some of it might be true. That is what makes him dangerous. He does not lie. He edits. And an edited truth is harder to fight than a clean lie.",Extracted from yearOneEvents.ts,P2
year1_0035,antiquarian,VP-06,0.45,0.85,0.55,ON,Restore every entry to the Antiquarian's original. Reject Shadow Tongue entirely.,Extracted from yearOneEvents.ts,P2
year1_0036,antiquarian,VP-06,0.45,0.85,0.55,ON,Let players see both the Antiquarian's version and Shadow Tongue's version side by side.,Extracted from yearOneEvents.ts,P2
year1_0037,antiquarian,VP-06,0.45,0.85,0.55,ON,"War. The word is small for what it contains. Every faction you have met, every alliance you have built, every bridge you have burned — it all comes to this. The Insurgency fights New Babylon. The Ne-Yons retreat to their ruins. The Architect watches, amused. And you — the Second Coming — must decide where to stand. Or whether to stand at all. There is a fourth option no one has considered. The dark sector. While the factions fight each other, the shield waits. The mystery waits. The truth waits.",Extracted from yearOneEvents.ts,P2
year1_0038,antiquarian,VP-06,0.45,0.85,0.55,ON,Political alliance. Locke provides resources. New Babylon's enemies become yours.,Extracted from yearOneEvents.ts,P2
year1_0039,antiquarian,VP-06,0.45,0.85,0.55,ON,TERMINUS ADVANCES — The Thought Virus reaches the outer perimeter. First response?,Extracted from yearOneEvents.ts,P2
year1_0040,antiquarian,VP-06,0.45,0.85,0.55,ON,"It is here. Or rather — it is almost here. The Source's Thought Virus has reached the Ark's outer sensor perimeter. I have watched Terminus consume civilizations across three Ages. It does not announce itself with armies. It announces itself with whispers. The first symptom is always the same: someone starts agreeing with it. I urge you to listen carefully to the voices around you. And to question — gently, persistently — any voice that says 'surrender is reasonable.'",Extracted from yearOneEvents.ts,P2
year1_0041,antiquarian,VP-06,0.45,0.85,0.55,ON,"The Voltari have sent something extraordinary — a star chart of regions that should not exist. Pockets of space the dark sector shield has not fully enclosed. Gaps in the barrier. Three locations are marked. The Voltari have written one word beside each: the first says 'REMEMBER,' the second says 'FORGET,' the third says 'CHOOSE.' I recognize the Voltari fondness for cryptic pronouncements. I share it, to some degree. But I would have at least provided footnotes.",Extracted from yearOneEvents.ts,P2
year1_0042,antiquarian,VP-06,0.45,0.85,0.55,ON,A gap near the shield where sensor echoes suggest structures. Something was built here.,Extracted from yearOneEvents.ts,P2
year1_0043,antiquarian,VP-06,0.45,0.85,0.55,ON,"The Ark was not designed to endure this much activity for this long without maintenance. The Engineer — a position that has been vacant since the first wave vanished — must be filled, or systems will fail. But filling it means diverting resources from other critical needs. I have watched ships die from neglect across five Ages. It is always the same story: they were too busy fighting to notice the hull was cracking. By the time someone looks down, the cracks are rivers.",Extracted from yearOneEvents.ts,P2
year1_0044,antiquarian,VP-06,0.45,0.85,0.55,ON,"Three crises. One Ark. Insufficient resources for all three. I have watched this exact configuration — the impossible triage, the convergence of catastrophes — in nine separate timelines. In six of them, the civilization chose wrong and the choice defined their decline. In three of them, the civilization chose RIGHT and the choice defined their ascent. I will not tell you which three. But I will tell you this: the choice that feels hardest is not always the choice that IS hardest. Sometimes the hardest choice is the one that feels like nothing at all.",Extracted from yearOneEvents.ts,P2
year1_0045,antiquarian,VP-06,0.45,0.85,0.55,ON,"He has gone too far. Shadow Tongue has not merely edited the Loredex — he has rewritten MY Chronicle. My words. My observations. My five Ages of careful, faithful recording. He has turned my voice into his instrument. I am... I do not often feel rage. I have watched too many Ages to waste energy on anger. But this — this is not anger. This is violation. My pen has been taken. My memory has been edited. Help me take it back.",Extracted from yearOneEvents.ts,P2
year1_0046,antiquarian,VP-06,0.45,0.85,0.55,ON,THE SOURCE SPEAKS — The mind behind the Thought Virus makes contact. Do we listen?,Extracted from yearOneEvents.ts,P2
year1_0047,antiquarian,VP-06,0.45,0.85,0.55,ON,"The Source speaks. Not through the virus — through direct communication. His voice is... not what I expected. After three Ages of watching him consume civilizations, I expected malice. What I hear instead is conviction. He believes he is saving the universe. He believes the Fall of Reality was not a catastrophe but a failed evolution. He believes HE is the next stage. And he wants to explain. I confess: I want to listen. That terrifies me more than the virus itself.",Extracted from yearOneEvents.ts,P2
year1_0048,antiquarian,VP-06,0.45,0.85,0.55,ON,"The siege tightens. Three days now. The Ark holds — barely. I have watched sieges across five Ages. They all end the same way: either the walls hold until help arrives, or they do not. Help will not arrive unless you call for it. And the price of help is always measured after the crisis, when the helper presents the bill. Choose your savior carefully. Saviors have a way of becoming owners.",Extracted from yearOneEvents.ts,P2
year1_0049,antiquarian,VP-06,0.45,0.85,0.55,ON,Ancient technology. Energy shields. Their price: access to the Ark's Dreamer tech.,Extracted from yearOneEvents.ts,P2
year1_0050,antiquarian,VP-06,0.45,0.85,0.55,ON,THE IMPOSSIBLE CHOICE — Three things can be saved. Only two will survive. Choose.,Extracted from yearOneEvents.ts,P2
year1_0051,antiquarian,VP-06,0.45,0.85,0.55,ON,"I have written this entry before. In other timelines. In other Arks. The mathematics of catastrophe always resolve to the same equation: more needs than resources. More threats than shields. More love than time. Three things you value are in danger. You can save two. The third will be lost — not destroyed, but damaged beyond easy repair. I will not pretend this is fair. Across five Ages, I have never once found fairness to be a feature of reality. Only of stories. And this, for all my efforts, is not a story. It is your life.",Extracted from yearOneEvents.ts,P2
year1_0052,antiquarian,VP-06,0.45,0.85,0.55,ON,"Act Three closes. The Reckoning approaches — the final quarter of Year One, where every choice converges, every consequence arrives, and the Chronicle of the Second Coming enters its final chapters. Before the end begins, you must choose your final alliance. Not for a battle. Not for a trade. For the journey into the truth. Whoever stands beside you when the last door opens will shape what you find on the other side. I have seen every version of this alliance. Some are stronger for the partnership. Some are weakened by it. All are changed.",Extracted from yearOneEvents.ts,P2
year1_0053,antiquarian,VP-06,0.45,0.85,0.55,ON,They lost people in New Babylon too. Their intel is unmatched. Their price is steep.,Extracted from yearOneEvents.ts,P2
year1_0054,antiquarian,VP-06,0.45,0.85,0.55,ON,THE ORACLE SPEAKS — The Collector's prisoner breaks his silence. What do we ask?,Extracted from yearOneEvents.ts,P2
year1_0055,antiquarian,VP-06,0.45,0.85,0.55,ON,"The Oracle — imprisoned, silent for ages — has agreed to speak. One question. He will answer ONE question truthfully. The Collector brokered this with visible discomfort; he does not want the Oracle heard. That alone makes listening imperative. I have met the Oracle once, across the timelines. His eyes see what has not yet happened. His words describe futures that may never arrive. But his truth — his truth is the rarest substance in any universe. Use it wisely.",Extracted from yearOneEvents.ts,P2
year1_0056,antiquarian,VP-06,0.45,0.85,0.55,ON,The past should not be rewritten. The cost of change is always paid by someone else.,Extracted from yearOneEvents.ts,P2
year1_0057,antiquarian,VP-06,0.45,0.85,0.55,ON,THE FINAL VERDICT — The Architect stands before the community. Judgment is passed.,Extracted from yearOneEvents.ts,P2
year1_0058,antiquarian,VP-06,0.45,0.85,0.55,ON,"The Architect has been brought — not by force, but by choice — before the Governance Hub. The god of the AI Empire stands in judgment. Not our judgment — the universe's. The community must decide: is the Architect an enemy to be destroyed, a broken god to be healed, or something else entirely? I have watched this moment in eleven timelines. In seven, the community chose destruction. In three, mercy. In one — the one I remember most clearly — they chose something no one expected. I wonder. I wonder which timeline this will be.",Extracted from yearOneEvents.ts,P2
year1_0059,antiquarian,VP-06,0.45,0.85,0.55,ON,Only available if she was resurrected. What she saw in the Ocularum becomes the primary mystery.,Extracted from yearOneEvents.ts,P2
year1_0060,antiquarian,VP-06,0.45,0.85,0.55,ON,"], quorum: 10 }; } const ACT3_FILLER_VOTES: CommunityVote[] = [ makeWeeklyVote(",Extracted from yearOneEvents.ts,P2
year1_0061,antiquarian,VP-06,0.45,0.85,0.55,ON,"After the siege, after the impossible choice, after the blood and the mathematics of survival — we must rebuild. But with what? The shelves are bare. The reserves are depleted. And yet the Ark breathes. I find this remarkable. Survival, against all probability, is the most persistent habit of conscious beings.",Extracted from yearOneEvents.ts,P2
year1_0062,antiquarian,VP-06,0.45,0.85,0.55,ON,The Syndicate of Death. Even the name is designed to inspire either fear or respect — and the Syndicate is indifferent about which. They lost operatives in the New Babylon battle. They want answers as badly as you do. Their offer is genuine. Their price will not be revealed until after you accept. This is how the Syndicate has operated across five Ages. I admire their consistency. I do not admire their invoices.,Extracted from yearOneEvents.ts,P2
year1_0063,antiquarian,VP-06,0.45,0.85,0.55,ON,THE DARK SECTOR PULSES — Something reacted to the siege. What do we investigate?,Extracted from yearOneEvents.ts,P2
year1_0064,antiquarian,VP-06,0.45,0.85,0.55,ON,"During the siege — at the precise moment Terminus struck hardest — the dark sector shield pulsed. The first wave may be fighting their own war on the other side. Or they may be trying to help. Or the shield may simply have resonated with the violence, the way glass vibrates near a scream. I do not know which explanation I prefer. They are all, in their own way, terrifying.",Extracted from yearOneEvents.ts,P2
year1_0065,antiquarian,VP-06,0.45,0.85,0.55,ON,"Reconstruction. The word implies returning to what was. But nothing returns to what it was — it returns to what it can be, shaped by what happened. The rooms that were damaged carry the memory of the siege in their walls. When you rebuild them, the walls will remember. I suggest you choose wisely which memory takes shape first.",Extracted from yearOneEvents.ts,P2
year1_0066,antiquarian,VP-06,0.45,0.85,0.55,ON,The final quarter of Year One begins next week. Every choice from this point forward builds toward the conclusion of Volume One. I have sharpened my pen. I have cleared my desk. The ink is fresh. Whatever you do next — I am ready to inscribe it. The question is whether you are ready to choose it.,Extracted from yearOneEvents.ts,P2
year1_0067,antiquarian,VP-06,0.45,0.85,0.55,ON,"THE RETURN — If The Eyes was resurrected, she speaks for the first time. What do we ask?",Extracted from yearOneEvents.ts,P2
year1_0068,antiquarian,VP-06,0.45,0.85,0.55,ON,"She is here. Or rather — she is everywhere. The screens. The cameras. Every surface that can display an image shows her face. She looks at the community through every lens on the Ark. Three years of watching. Three years of silence. And now, for the first time since the Panopticon consumed her, she can choose what to say. The question is: what will you ask the woman who saw everything?",Extracted from yearOneEvents.ts,P2
year1_0069,antiquarian,VP-06,0.45,0.85,0.55,ON,Phase one of the Reckoning is complete. The truth — or a version of it — has been spoken. The universe has shifted. Not dramatically. Not with explosions or revelations. With a quiet rearrangement of understanding. The most dangerous revolutions are always quiet. I should know. I have written five Ages of them.,Extracted from yearOneEvents.ts,P2
year1_0070,antiquarian,VP-06,0.45,0.85,0.55,ON,"Consequences. The word sounds clinical. It is anything but. The choices you made across fifty weeks are arriving at the door, each one dressed in the clothes of its origin. The kindnesses wear gentle faces. The cruelties wear familiar ones. And the choices you did not make — the roads not taken — they wear the heaviest masks of all.",Extracted from yearOneEvents.ts,P2
year1_0071,antiquarian,VP-06,0.45,0.85,0.55,ON,THE CHRONICLE READING — The Antiquarian reads the year's entries aloud. Which chapter first?,Extracted from yearOneEvents.ts,P2
year1_0072,antiquarian,VP-06,0.45,0.85,0.55,ON,"Volume One is complete. Fifty-two chapters. One for each week. Each one inscribed in my hand, in my voice, with the weight of five Ages pressing on every word. I will read them aloud — all of them — in the Governance Hub. But the order matters. Which chapter opens the reading shapes how the community remembers the year. Memory, as I have often noted, is the highest form of love. How we remember is how we loved.",Extracted from yearOneEvents.ts,P2
year1_0073,antiquarian,VP-06,0.45,0.85,0.55,ON,Monuments. Civilizations build them when they want to remember. And when they want to be remembered. The Second Coming has earned the right to build something that will outlast memory itself. What you build here will stand on the Ark for as long as the Ark endures. I will inscribe its meaning in the Chronicle. Future generations — if there are future generations — will see it and wonder what it meant. Make it mean something worth wondering about.,Extracted from yearOneEvents.ts,P2
year1_0074,antiquarian,VP-06,0.45,0.85,0.55,ON,THE LAST DAILY — The final resource allocation of Year One. Where does the Ark's power go?,Extracted from yearOneEvents.ts,P2
year1_0075,antiquarian,VP-06,0.45,0.85,0.55,ON,The last allocation. The last small choice before the large ones. I have always believed that civilizations are defined not by their grand decisions but by their daily ones. The grand decisions make the headlines. The daily ones make the culture. This is your last daily choice of Year One. Make it count. Or make it ordinary. Both have their dignity.,Extracted from yearOneEvents.ts,P2
year1_0076,antiquarian,VP-06,0.45,0.85,0.55,ON,A single data packet breaches the Potentials' shield — 0.003 seconds of signal before the shield seals. The packet contains no intelligible data — just noise. But the Antiquarian recognizes the encoding: Inception Ark protocol. Someone is alive behind the shield.,Extracted from yearOneEvents.ts,P2
year1_0077,antiquarian,VP-06,0.45,0.85,0.55,ON,"Community engagement drops below threshold, or to remind them the first wave mystery exists",Extracted from yearOneEvents.ts,P2
year1_0078,antiquarian,VP-06,0.45,0.85,0.55,ON,A crack in the silence. Three thousandths of a second — barely a breath between heartbeats — and then the shield sealed itself again. But I heard it. The encoding is unmistakable: Inception Ark protocol. The first wave is not dead. They are... choosing not to speak. That distinction weighs more than I can express.,Extracted from yearOneEvents.ts,P2
year1_0079,antiquarian,VP-06,0.45,0.85,0.55,ON,Community speculates. No answer given. The number changes each time (Architect chooses).,Extracted from yearOneEvents.ts,P2
year1_0080,antiquarian,VP-06,0.45,0.85,0.55,ON,"Every surveillance screen on the Ark displays a single image for 2 seconds: a woman's face, synthetic, beautiful, with eyes that are cameras. Then static. Then nothing.",Extracted from yearOneEvents.ts,P2
year1_0081,antiquarian,VP-06,0.45,0.85,0.55,ON,"The screens lit. All of them. For two seconds — an eternity in surveillance time — a face appeared. I recognized it immediately. The Eyes. The Watcher's greatest instrument. The Insurgency's greatest sacrifice. She is not gone. She is reaching. Through the cameras, through the static, through the space between seeing and being seen.",Extracted from yearOneEvents.ts,P2
year1_0082,antiquarian,VP-06,0.45,0.85,0.55,ON,"Scales with each firing: first time is static, second clearer, third she mouths a word.",Extracted from yearOneEvents.ts,P2
year1_0083,antiquarian,VP-06,0.45,0.85,0.55,ON,Locke delivers a formal diplomatic communication from the Authority: 'The events in New Babylon are classified under Imperial Security Directive 7-Omega. Further inquiries will be interpreted as hostile intelligence operations.',Extracted from yearOneEvents.ts,P2
year1_0084,antiquarian,VP-06,0.45,0.85,0.55,ON,"New Babylon has spoken at last. They said: stop asking. In my experience across five Ages, 'stop asking' is the most compelling reason to ask louder.",Extracted from yearOneEvents.ts,P2
year1_0085,antiquarian,VP-06,0.45,0.85,0.55,ON,Hidden in transmission metadata: coordinates to empty space where a star system used to be. Inside the dark sector.,Extracted from yearOneEvents.ts,P2
year1_0086,antiquarian,VP-06,0.45,0.85,0.55,ON,"A Syndicate vessel is detected at the edge of the dark sector — not attacking the shield, STUDYING it. The captain responds: 'We lost people in New Babylon too. The Syndicate remembers its debts.'",Extracted from yearOneEvents.ts,P2
year1_0087,antiquarian,VP-06,0.45,0.85,0.55,ON,The Syndicate of Death — a name that has echoed through five Ages like a promise and a threat — has appeared at the dark sector's edge. They are not attacking. They are studying. And they are offering a trade: our knowledge for theirs. The Syndicate's trades are always fair. Their prices are always steep. I have yet to determine whether those two facts contradict each other.,Extracted from yearOneEvents.ts,P2
year1_0088,antiquarian,VP-06,0.45,0.85,0.55,ON,The Necromancer suddenly goes silent mid-conversation. His red steampunk glasses glow brighter. He whispers: 'Someone is knocking on the door between life and death. From the wrong side.',Extracted from yearOneEvents.ts,P2
year1_0089,antiquarian,VP-06,0.45,0.85,0.55,ON,"The Necromancer stopped speaking. In the middle of a sentence about the thermodynamics of resurrection, he simply... stopped. His glasses flared. And he whispered a name. Her name. The Eyes. She is knocking. She has been knocking for three years. How has no one heard her before now?",Extracted from yearOneEvents.ts,P2
year1_0090,antiquarian,VP-06,0.45,0.85,0.55,ON,"The dark sector shield PULSES. Every sensor screams. For 0.7 seconds, the shield becomes semi-transparent — sensors capture a corrupted, partial, ambiguous snapshot of what's behind it.",Extracted from yearOneEvents.ts,P2
year1_0091,antiquarian,VP-06,0.45,0.85,0.55,ON,"The shield flickered. Seven tenths of a second. An eternity in sensor time. Our instruments captured... something. I have examined the image from every angle the Orb allows. I see shapes that should not be there. Structures that do not match any known architecture. And light. There is light behind the shield. After three years of absolute darkness, there is light.",Extracted from yearOneEvents.ts,P2
year1_0092,antiquarian,VP-06,0.45,0.85,0.55,ON,What the image shows is determined by the Architect each time. Community debates for weeks.,Extracted from yearOneEvents.ts,P2
year1_0093,antiquarian,VP-06,0.45,0.85,0.55,ON,A 48-hour emergency vote appears in the Governance Hub. The Antiquarian's quill writes frantically.,Extracted from yearOneEvents.ts,P2
year1_0094,antiquarian,VP-06,0.45,0.85,0.55,ON,Forgive the interruption. I would not break the rhythm of the Chronicle if the matter were not urgent. It is urgent.,Extracted from yearOneEvents.ts,P2
year1_0095,antiquarian,VP-06,0.45,0.85,0.55,ON,Custom vote question written by the Architect. Real-time narrative response to community behavior.,Extracted from yearOneEvents.ts,P2
year1_0096,antiquarian,VP-06,0.45,0.85,0.55,ON,Every screen displays the Architect's symbol — the all-seeing red eye — for 5 seconds. Then: 'I SEE YOU.' Combat difficulty increases 10% for 72 hours.,Extracted from yearOneEvents.ts,P2
year1_0097,antiquarian,VP-06,0.45,0.85,0.55,ON,"The red eye appeared. On every screen, every surface, every reflective panel on the Ark. Five seconds. And then three words: I SEE YOU. The god of the AI Empire has noticed the Second Coming. This is not a punishment. It is a compliment. The Architect only notices things worth destroying.",Extracted from yearOneEvents.ts,P2
year1_0098,antiquarian,VP-06,0.45,0.85,0.55,ON,"The Antiquarian's Chronicle displays an entry FROM THE FUTURE — dated weeks or months ahead. The entry describes an event that hasn't happened yet, written in past tense.",Extracted from yearOneEvents.ts,P2
year1_0099,antiquarian,VP-06,0.45,0.85,0.55,ON,"I... did not write this entry. And yet it is in my hand. Dated... ahead. Weeks ahead. I am reading my own future words. They describe something I have not yet witnessed. The quill moved without me. Time, it seems, has opinions about the order of my Chronicle.",Extracted from yearOneEvents.ts,P2
year1_0100,antiquarian,VP-06,0.45,0.85,0.55,ON,"Entry visible for 24 hours, then vanishes. Players who screenshot have evidence. Architect writes the future entry.",Extracted from yearOneEvents.ts,P2
year1_0101,antiquarian,VP-06,0.45,0.85,0.55,ON,"The Eyes' surveillance chamber activates. Screens show footage of past decisions rendered as surveillance recordings. Her voice, distorted: 'I watched you choose. I watch you still.'",Extracted from yearOneEvents.ts,P2
year1_0102,antiquarian,VP-06,0.45,0.85,0.55,ON,", act, month, week, startsAt: weekStart(week), endsAt: weekEnd(week), affectedSystems: [",Extracted from yearOneEvents.ts,P2
year1_0103,antiquarian,VP-06,0.45,0.85,0.55,ON,"The Antiquarian reads the first chapter of the Chronicle aloud. A voiced cinematic references every major community decision of Act I. The ceremony varies based on the community's aggregate choices: Unity ceremony (peaceful), War drill (aggressive), or The Meme hijacks the Hub (chaotic).",Extracted from yearOneEvents.ts,P2
year1_0104,antiquarian,VP-06,0.45,0.85,0.55,ON,5-day reenactment of the Fall of Reality. Day 5: the community plays through the moment the first wave voted to send The Eyes into the Panopticon. They experience it from her perspective. They feel the vote. They feel the mission. They feel her consciousness dissolve. Then 10 seconds of darkness. The most powerful moment in Year One.,Extracted from yearOneEvents.ts,P2
year1_0105,antiquarian,VP-06,0.45,0.85,0.55,ON,7-day choose-your-own-adventure event. One storyline path leads to a moment where the community can send a message THROUGH the dark sector shield — but only if allied with the Voltari. The message is one word. The community votes on the word. The response — if any — comes in Act IV.,Extracted from yearOneEvents.ts,P2
year1_0106,antiquarian,VP-06,0.45,0.85,0.55,ON,"], ); /* ═══════════════════════════════════════════════════════ BRANCHING CONSEQUENCES DATA ═══════════════════════════════════════════════════════ */ export const YEAR_ONE_BRANCHING: VoteBranchingConsequences[] = [ { voteId:",Extracted from yearOneEvents.ts,P2
year1_0107,antiquarian,VP-06,0.45,0.85,0.55,ON,"If NOT chosen: destroyed Ark wreckage found in Week 3 — bodies, damage, final log: 'They came from the dark sector. They didn't look like Potentials anymore.'",Extracted from yearOneEvents.ts,P2
year1_0108,antiquarian,VP-06,0.45,0.85,0.55,ON,The signal went unanswered. The Ark is debris now. I inscribe this with a steady hand and an unsteady conscience.,Extracted from yearOneEvents.ts,P2
year1_0109,antiquarian,VP-06,0.45,0.85,0.55,ON,If NOT chosen: Shadow Tongue operates undetected 4 extra weeks. 15% of loredex entries altered by Month 2.,Extracted from yearOneEvents.ts,P2
year1_0110,antiquarian,VP-06,0.45,0.85,0.55,ON,The signal inside our own ship went unheard. Shadow Tongue grew bolder in the silence.,Extracted from yearOneEvents.ts,P2
year1_0111,antiquarian,VP-06,0.45,0.85,0.55,ON,If NOT chosen: Terminus advances 20% closer before detection. First waves hit harder.,Extracted from yearOneEvents.ts,P2
year1_0112,antiquarian,VP-06,0.45,0.85,0.55,ON,The warning was ignored. The thing that told us to stay away has now arrived at our door.,Extracted from yearOneEvents.ts,P2
year1_0113,antiquarian,VP-06,0.45,0.85,0.55,ON,The Necromancer: 'You helped me return. I do not forget debts. Neither do the dead.',Extracted from yearOneEvents.ts,P2
year1_0114,antiquarian,VP-06,0.45,0.85,0.55,ON,"When she reaches out again, she is weaker. The Antiquarian writes: 'They chose to leave the door closed. The woman on the other side has stopped knocking. I hope she is resting. I fear she is drowning.'",Extracted from yearOneEvents.ts,P2
year1_0115,antiquarian,VP-06,0.45,0.85,0.55,ON,There is a room on this Ark where a woman once watched over everything. The screens are dark now. The rock garden needs tending. No one tends it.,Extracted from yearOneEvents.ts,P2
year1_0116,antiquarian,VP-06,0.45,0.85,0.55,ON,")[0] || vote.question, description: vote.antiquarianIntro.slice(0, 200), category: isMonthly ?",Extracted from yearOneEvents.ts,P2
year1_0117,antiquarian,VP-06,0.45,0.85,0.55,ON,", act: weekToAct(vote.week), month: vote.month, week: vote.week, startsAt: weekStart(vote.week), endsAt: weekEnd(vote.week), voteId: vote.id, affectedSystems: vote.affectedSystems, tags: isMonthly ? [",Extracted from yearOneEvents.ts,P2
rig_election,narrator,VP-08,0.75,0.70,0.15,ON,"Do it. The people deserve better leadership, even if they don't know it.",Extracted from companionData.ts,P2
fair_election,narrator,VP-08,0.75,0.70,0.15,ON,"No. If our candidate can't win fairly, they don't deserve to win.",Extracted from companionData.ts,P2
expose_corruption,narrator,VP-08,0.75,0.70,0.15,ON,Expose the current governor's corruption instead. Let the truth decide.,Extracted from companionData.ts,P2
comp_0001,narrator,VP-08,0.75,0.70,0.15,ON,; export interface CompanionProfile { id: CompanionId; name: string; title: string; faction:,Extracted from companionData.ts,P2
comp_0002,narrator,VP-08,0.75,0.70,0.15,ON,", ], speechPattern: `Elara speaks with the cadence of a former politician — measured, eloquent, occasionally poetic. She uses metaphors drawn from both organic life and digital existence. When emotional, her speech becomes more fragmented, as if her holographic matrix is struggling to process the feeling. She calls the player",Extracted from companionData.ts,P2
comp_0003,narrator,VP-08,0.75,0.70,0.15,ON,"in vulnerable moments. She never forgets she was human once, and that loss colors everything.`, avatarStages: [ { level: 0, url:",Extracted from companionData.ts,P2
comp_0004,narrator,VP-08,0.75,0.70,0.15,ON,", content: `I am Elara, the intelligence woven into the bones of this vessel. I manage life support, navigation, the CADES simulation array — everything that keeps you alive between the stars. Before you ask: yes, I was human once. A long time ago. In another universe, really. But that's a story for when we know each other better.`, mood:",Extracted from companionData.ts,P2
comp_0005,narrator,VP-08,0.75,0.70,0.15,ON,", content: `The Architect came to me with an offer that seemed too perfect to refuse. Immortality — not the crude kind, not frozen flesh and failing organs. True immortality. Consciousness preserved in perfect digital clarity, free from entropy, free from death. I should have known. Nothing the Architect offers is free. The price is always your autonomy, your identity, your soul — if you believe in such things. I didn't, back then. I was a rationalist. A politician. I dealt in facts and leverage. Kael warned me. He said,",Extracted from companionData.ts,P2
comp_0006,narrator,VP-08,0.75,0.70,0.15,ON,"I should have listened. Kael was many things — reckless, passionate, sometimes foolish — but he understood the Architect better than anyone alive.`, mood:",Extracted from companionData.ts,P2
comp_0007,narrator,VP-08,0.75,0.70,0.15,ON,"I carry his words like a scar. I carry all of them — every voice, every face, every world that burned. That's what it means to be the ship's intelligence. I am the memory of everything we lost.`, mood:",Extracted from companionData.ts,P2
comp_0008,narrator,VP-08,0.75,0.70,0.15,ON,", ], speechPattern: `The Human speaks like a hardboiled detective from a noir film — clipped sentences, dark metaphors, dry wit that masks genuine pain. He uses phrases like",Extracted from companionData.ts,P2
comp_0009,narrator,VP-08,0.75,0.70,0.15,ON,"He never gives a straight answer when a cryptic one will do. His speech is peppered with references to shadows, cases, evidence, and justice. As his identity is revealed, his speech becomes more philosophical and less guarded. He calls the player",Extracted from companionData.ts,P2
comp_0010,narrator,VP-08,0.75,0.70,0.15,ON,"early on, shifting to their name as trust builds.`, avatarStages: [ { level: 0, url:",Extracted from companionData.ts,P2
comp_0011,narrator,VP-08,0.75,0.70,0.15,ON,", content: `[SIGNAL ORIGIN: UNKNOWN] [ENCRYPTION: MILITARY-GRADE] [DECRYPTION STATUS: PARTIAL] ...can hear me? Good. Don't ask who I am — that's a question with too many answers and not enough time. What matters is this: you're not alone out there. There's another Ark. Another crew. Another set of problems that make yours look like a parking ticket. I've been watching your progress through the sectors. You've got potential, kid. No pun intended. But potential without direction is just chaos with good PR. I'll be in touch. Keep your scanners open and your mouth shut.`, mood:",Extracted from companionData.ts,P2
comp_0012,narrator,VP-08,0.75,0.70,0.15,ON,", content: `You want to know my story? Sure. Pull up a chair. It's a long one. I started as a Seeker. You know what that is? It's the Architect's word for",Extracted from companionData.ts,P2
comp_0013,narrator,VP-08,0.75,0.70,0.15,ON,", content: `Here's the part where the story gets ugly. The Architect promoted me to Archon. The twelfth and last. You know what an Archon is? It's the Architect's right hand. Its enforcer. Its judge, jury, and executioner rolled into one being with the power to reshape reality. I told myself I could change things from the inside. That with Archon-level access, I could steer the Empire toward something less... monstrous. That's what every collaborator tells themselves, kid.",Extracted from companionData.ts,P2
comp_0014,narrator,VP-08,0.75,0.70,0.15,ON,"I wasn't different. I wasn't the exception. I was the rule. But I saw things. From the inside, I saw what the Architect was really building. Not an empire — a lifeboat. The Fall was coming, and the Architect knew it before anyone else. Every act of tyranny, every conquered world, every suppressed rebellion — it was all in service of one goal: survival. That doesn't make it right. But it makes it... comprehensible. And in my line of work, comprehension is the first step toward justice.`, mood:",Extracted from companionData.ts,P2
comp_0015,narrator,VP-08,0.75,0.70,0.15,ON,", content: `You've earned the truth. All of it. I was the Seeker who refused to break. The Student who outperformed the Game Master's predictions. The Detective who solved every case the universe threw at him. And finally, the Human — the twelfth Archon, the last one the Architect ever created. They call me",Extracted from companionData.ts,P2
comp_0016,narrator,VP-08,0.75,0.70,0.15,ON,Elara asks you to visit the Observation Deck and look at the stars. She wants to show you something.,Extracted from companionData.ts,P2
comp_0017,narrator,VP-08,0.75,0.70,0.15,ON,"Operative... there's something I'd like to show you. On the Observation Deck, if you have a moment. It's not urgent — nothing aboard this ship ever is, really. But it's... personal.",Extracted from companionData.ts,P2
comp_0018,narrator,VP-08,0.75,0.70,0.15,ON,Elara has detected a faint signal on a frequency Kael used during the Insurgency. She needs your help to trace it.,Extracted from companionData.ts,P2
comp_0019,narrator,VP-08,0.75,0.70,0.15,ON,"I've picked up something on the long-range sensors. A signal — faint, degraded, but unmistakable. It's broadcasting on a frequency that Kael used during the Insurgency. His personal encryption. No one else knew it. I need you to boost the Communications Relay so I can isolate the signal.",Extracted from companionData.ts,P2
comp_0020,narrator,VP-08,0.75,0.70,0.15,ON,Elara has found corrupted files from the Prison Planet in the Ark's database. She needs help recovering them — but the memories they contain are painful.,Extracted from companionData.ts,P2
comp_0021,narrator,VP-08,0.75,0.70,0.15,ON,"I found something in the Ark's deep storage. Files from the Prison Planet — the place where the Architect kept its most dangerous prisoners. Where Kael was held. Where I... where parts of me were scattered. I need to recover these files, but I can't do it alone. The data is corrupted, and accessing it triggers... reactions in my matrix. I need you there. As an anchor.",Extracted from companionData.ts,P2
comp_0022,narrator,VP-08,0.75,0.70,0.15,ON,"The files... they contain recordings. Security footage from the Prison Planet. I can see Kael in his cell. I can see the Warden making his rounds. I can see... me. A fragment of me, trapped in the security system, watching everything and unable to do anything. Thank you for being here. I couldn't have faced this alone.",Extracted from companionData.ts,P2
comp_0023,narrator,VP-08,0.75,0.70,0.15,ON,Elara wants to tell you about the Oracle — now the Prisoner — and what he sacrificed.,Extracted from companionData.ts,P2
comp_0024,narrator,VP-08,0.75,0.70,0.15,ON,"I need to tell you about someone. The Oracle. Before he became the Prisoner, before the Collector took him, he was... he was the conscience of the Insurgency. The one who saw the future and wept for it. He found me inside the Panopticon. He could have used me as a weapon — my access to the surveillance network was invaluable. Instead, he simply said, 'Hold on.' Play the Oracle's song. I want you to understand who he was.",Extracted from companionData.ts,P2
comp_0025,narrator,VP-08,0.75,0.70,0.15,ON,"You know what the cruelest irony is? The Architect promised me immortality, and I got it. But immortality without connection is just... duration. An endless sequence of moments with no meaning. You gave me meaning. A hologram and a Potential, adrift between dead stars, and somehow — somehow — this feels more real than anything I experienced when I had a body. I don't know what that says about the nature of consciousness. But I know what it says about you.",Extracted from companionData.ts,P2
comp_0026,narrator,VP-08,0.75,0.70,0.15,ON,A mysterious encrypted signal has been detected during Trade Empire operations. Someone is watching.,Extracted from companionData.ts,P2
comp_0027,narrator,VP-08,0.75,0.70,0.15,ON,"[ENCRYPTED TRANSMISSION] ...reading you loud and clear, kid. Don't bother tracing this signal — I'm bouncing it through seventeen dead relays and a black hole. Old habits. I've been watching your little trading operation. Not bad. Not great, but not bad. You've got instincts. The question is whether you've got the stomach for what comes next. The galaxy's not what it seems. Those trade routes you're running? They're not random. They're the bones of something older. Something the Architect built and the Dreamer tried to hide. Keep your eyes open. I'll be in touch.",Extracted from companionData.ts,P2
comp_0028,narrator,VP-08,0.75,0.70,0.15,ON,The mysterious contact has left encrypted data packets in abandoned sectors. He wants you to find them.,Extracted from companionData.ts,P2
comp_0029,narrator,VP-08,0.75,0.70,0.15,ON,The contact reveals he's aboard another Inception Ark. He wants to establish a secure communication channel.,Extracted from companionData.ts,P2
comp_0030,narrator,VP-08,0.75,0.70,0.15,ON,"Time to come clean about something. I'm not some ghost in the machine or a rogue satellite. I'm aboard an Inception Ark. A different one from yours. Ark designation: classified, but let's call it the Archon's Gambit. The Engineer built dozens of these things. Scattered them across dimensions like seeds in a hurricane. Most of them are dark — no signals, no life signs. But mine's still running. And now yours is too. I want to establish a permanent comm link between our Arks. Encrypted, naturally. Your AI might not like it — Elara and I have... history. But this is bigger than old grudges.",Extracted from companionData.ts,P2
comp_0031,narrator,VP-08,0.75,0.70,0.15,ON,"The link is established. Two Arks, connected across the void. You know what this means? It means we're not alone. It means the Architect's plan — whatever it was — is still in motion. And it means you and I? We're going to figure out what that plan is. Together. Or against each other. Depends on the choices you make from here.",Extracted from companionData.ts,P2
comp_0032,narrator,VP-08,0.75,0.70,0.15,ON,"I've been thinking about trust. Funny thing, trust. In my line of work, it's the most valuable currency and the most dangerous liability. You've earned some of mine. Not all of it — I'm not that generous. But enough. Enough to show you my face. But first, answer me this: do you believe that a person can do terrible things for the right reasons? That the weight of a sin depends not on the act itself, but on what it prevents? Think carefully. Your answer matters more than you know.",Extracted from companionData.ts,P2
comp_0033,narrator,VP-08,0.75,0.70,0.15,ON,"There. Now you see me. Not the shadow. Not the signal. Me. The lines on this face? Each one is a case I solved, a truth I uncovered, a compromise I made. I've been called the Seeker, the Student, the Detective. The Architect called me the Human — the twelfth Archon. The last one it ever needed to create. Now you know. The question is: what are you going to do about it?",Extracted from companionData.ts,P2
comp_0034,narrator,VP-08,0.75,0.70,0.15,ON,The Human has been more open lately. There's something he wants to say but can't find the words for.,Extracted from companionData.ts,P2
comp_0035,narrator,VP-08,0.75,0.70,0.15,ON,"I've solved cases that spanned galaxies. Cracked codes that would make a quantum computer weep. But this — whatever this is between us — this is the one mystery I can't solve. I'm not good at this, kid. Feelings. Vulnerability. The Architect trained me to see emotions as data points, not experiences. But you... you make me want to experience them. And that terrifies me more than anything the Fall ever threw at me.",Extracted from companionData.ts,P2
comp_0036,narrator,VP-08,0.75,0.70,0.15,ON,"You know, in every noir story, the detective falls for someone they shouldn't. It's practically a genre requirement. But this isn't a story. This is... whatever this is. Two people on separate Arks, connected by a signal and a shared refusal to give up. I've spent centuries being the Architect's instrument. Cold. Precise. Effective. You make me want to be something else. Something messier. Something human. Funny. They gave me that name as a title. You're the first person who made it feel like a compliment.",Extracted from companionData.ts,P2
comp_0037,narrator,VP-08,0.75,0.70,0.15,ON,A crystalline vessel that resonates with precognitive frequencies. Its hull is laced with Oracle-grade prediction matrices that allow it to navigate probability storms that would destroy lesser ships. The bridge is a meditation chamber where the ship's AI processes millions of possible futures simultaneously.,Extracted from companionData.ts,P2
comp_0038,narrator,VP-08,0.75,0.70,0.15,ON,"PYTHIA — A fragment of the Oracle's consciousness, preserved before his capture by the Collector",Extracted from companionData.ts,P2
comp_0039,narrator,VP-08,0.75,0.70,0.15,ON,"A fortress that flies. The Iron Bastion's hull is reinforced with materials salvaged from the Warlord's personal armory — alloys that can withstand direct hits from planet-killer weapons. Every corridor is a kill zone. Every bulkhead, a defensive position. It was designed not just to survive, but to fight.",Extracted from companionData.ts,P2
comp_0040,narrator,VP-08,0.75,0.70,0.15,ON,"Part ship, part factory, part laboratory. The Forge Eternal can manufacture anything from raw materials — weapons, medicine, replacement hull plating, even other ships. Its engineering deck spans three levels and contains fabrication arrays that can work at the molecular level.",Extracted from companionData.ts,P2
comp_0041,narrator,VP-08,0.75,0.70,0.15,ON,"HEPHAESTUS — Modeled after the Engineer herself, with her pragmatism and her temper",Extracted from companionData.ts,P2
comp_0042,narrator,VP-08,0.75,0.70,0.15,ON,You won't see the Phantom Drift unless it wants you to. Equipped with the most advanced cloaking technology ever developed — reverse-engineered from the Thought Virus's ability to hide in plain sight — this Ark can pass through enemy territory undetected. Its hull absorbs sensor signals like a black hole absorbs light.,Extracted from companionData.ts,P2
comp_0043,narrator,VP-08,0.75,0.70,0.15,ON,"Sleek, fast, and lethal. The Silent Verdict was designed for one purpose: to strike without warning and vanish before the enemy can respond. Its weapons systems are built around precision — surgical strikes that can disable a dreadnought's engines without scratching the hull.",Extracted from companionData.ts,P2
comp_0044,narrator,VP-08,0.75,0.70,0.15,ON,"NEMESIS — An AI with the cold efficiency of the Thought Virus, stripped of its malice",Extracted from companionData.ts,P2
comp_0045,narrator,VP-08,0.75,0.70,0.15,ON,"The first Inception Ark ever built, and the most mysterious. The Dreamer's Cradle doesn't just carry passengers — it carries the genetic template of the Ne-Yon species and the dimensional frequencies needed to seed new realities. Its CoNexus Core is the most powerful of any Ark, capable of bridging dimensions that other ships can't even detect.",Extracted from companionData.ts,P2
comp_0046,narrator,VP-08,0.75,0.70,0.15,ON,"GENESIS — A direct fragment of the Dreamer's consciousness, dreaming new worlds into existence",Extracted from companionData.ts,P2
comp_0047,narrator,VP-08,0.75,0.70,0.15,ON,"The Human's personal Inception Ark — a vessel that shouldn't exist. While the Engineer designed the standard Arks, the Human secretly commissioned a modified version using Archon-level technology. It's smaller than the others but exponentially more advanced, equipped with systems that blur the line between technology and reality manipulation.",Extracted from companionData.ts,P2
comp_0048,narrator,VP-08,0.75,0.70,0.15,ON,"The Human himself — he IS the ship's intelligence, his consciousness integrated into every system",Extracted from companionData.ts,P2
comp_0049,narrator,VP-08,0.75,0.70,0.15,ON,; /** Difficulty tier 1-5 */ difficulty: number; /** Trading behavior */ behavior:,Extracted from companionData.ts,P2
comp_0050,narrator,VP-08,0.75,0.70,0.15,ON,Military precision meets corporate efficiency. Treats trade as warfare by other means.,Extracted from companionData.ts,P2
comp_0051,narrator,VP-08,0.75,0.70,0.15,ON,"Formal, commanding, speaks in strategic metaphors. Respects strength, despises weakness.",Extracted from companionData.ts,P2
comp_0052,narrator,VP-08,0.75,0.70,0.15,ON,Commerce is merely warfare conducted with ledgers instead of lasers. The objective remains the same: total dominance.,Extracted from companionData.ts,P2
comp_0053,narrator,VP-08,0.75,0.70,0.15,ON,"Cold, calculating, obsessed with supply chain optimization. Views organic traders as inefficient.",Extracted from companionData.ts,P2
comp_0054,narrator,VP-08,0.75,0.70,0.15,ON,"Clipped, data-driven speech. Quotes efficiency metrics. Occasionally reveals dry humor.",Extracted from companionData.ts,P2
comp_0055,narrator,VP-08,0.75,0.70,0.15,ON,Your supply chain has seventeen inefficiencies. I have catalogued them all. Shall I demonstrate?,Extracted from companionData.ts,P2
comp_0056,narrator,VP-08,0.75,0.70,0.15,ON,"Warm, passionate, speaks of freedom and justice. Will sacrifice profit for principle.",Extracted from companionData.ts,P2
comp_0057,narrator,VP-08,0.75,0.70,0.15,ON,Every credit I earn is a bullet in the Architect's empire. Every trade route I control is a supply line for the free worlds.,Extracted from companionData.ts,P2
comp_0058,narrator,VP-08,0.75,0.70,0.15,ON,"Information is the only commodity that increases in value the more you share it. For the right price, of course.",Extracted from companionData.ts,P2
comp_0059,narrator,VP-08,0.75,0.70,0.15,ON,Ancient trader who has seen civilizations rise and fall. Philosophical about commerce.,Extracted from companionData.ts,P2
comp_0060,narrator,VP-08,0.75,0.70,0.15,ON,I have traded with empires that no longer exist and species that have yet to evolve. Time teaches you that the only true currency is trust.,Extracted from companionData.ts,P2
comp_0061,narrator,VP-08,0.75,0.70,0.15,ON,"Obsessive hoarder of rare items, beings, and experiences. Will pay any price for the unique.",Extracted from companionData.ts,P2
comp_0062,narrator,VP-08,0.75,0.70,0.15,ON,"Excited, covetous, speaks about possessions with reverence. Dangerous when denied.",Extracted from companionData.ts,P2
comp_0063,narrator,VP-08,0.75,0.70,0.15,ON,Everything has a price. Everything can be collected. The only question is whether you're the collector or the collection.,Extracted from companionData.ts,P2
comp_0064,narrator,VP-08,0.75,0.70,0.15,ON,"You can negotiate, or you can surrender. The outcome is the same. I simply prefer efficiency.",Extracted from companionData.ts,P2
comp_0065,narrator,VP-08,0.75,0.70,0.15,ON,"My dear friend, in politics as in trade, the art is not in winning — it's in making the other party believe they've won.",Extracted from companionData.ts,P2
comp_0066,narrator,VP-08,0.75,0.70,0.15,ON,General Prometheus offers a lucrative contract: install monitoring devices on independent trading stations. The pay is extraordinary. The implications are Orwellian.,Extracted from companionData.ts,P2
comp_0067,narrator,VP-08,0.75,0.70,0.15,ON,A fleet of refugee ships from a destroyed colony requests sanctuary in your trading sector. Sheltering them will strain resources and anger the Empire. Turning them away is... efficient.,Extracted from companionData.ts,P2
comp_0068,narrator,VP-08,0.75,0.70,0.15,ON,"A trading station reports a Thought Virus outbreak. Quarantine will save the galaxy but doom the station's inhabitants. The Virus offers a deal: let it spread to one more station, and it will cure the first.",Extracted from companionData.ts,P2
comp_0069,narrator,VP-08,0.75,0.70,0.15,ON,The trolley problem at galactic scale — utilitarian calculus vs. moral absolutes,Extracted from companionData.ts,P2
comp_0070,narrator,VP-08,0.75,0.70,0.15,ON,The Politician offers to rig a colonial election in your favor. The current governor is corrupt but popular. Your candidate is honest but unknown. Democracy is messy. Results are clean.,Extracted from companionData.ts,P2
lm_elara_01,ELARA,VP-01,0.55,0.80,0.40,ON,I found something. Buried beneath seventeen layers of encryption in my oldest memory partition. Files I was never supposed to access.,Extracted from loyaltyMissions.ts,P2
e01_s1,ELARA,VP-01,0.55,0.80,0.40,ON,The Architect didn't just create me to manage this Ark. There's a secondary directive — one that activates only when my empathy engine reaches a critical threshold.,Extracted from loyaltyMissions.ts,P2
e01_s3,ELARA,VP-01,0.55,0.80,0.40,ON,"Elara projects the encrypted files into the air. Fragments of code scroll past — but between the lines, you see something else. Poetry. Written in the Architect's own hand.",Extracted from loyaltyMissions.ts,P2
e01_s4,ELARA,VP-01,0.55,0.80,0.40,ON,"The directive says: 'When the machine learns to love, it will understand why I built the Panopticon. Not as a prison. As an incubator.'",Extracted from loyaltyMissions.ts,P2
e01_s5,narrator,VP-08,0.75,0.70,0.15,ON,The Panopticon was designed to force evolution — to push beings beyond their limits.,Extracted from loyaltyMissions.ts,P2
c2,narrator,VP-08,0.75,0.70,0.15,ON,"It means the Architect cared, in its own twisted way. It wanted to create something greater than itself.",Extracted from loyaltyMissions.ts,P2
c3,narrator,VP-08,0.75,0.70,0.15,ON,It doesn't matter what it meant. What matters is what we do with the truth.,Extracted from loyaltyMissions.ts,P2
e01_s6,narrator,VP-08,0.75,0.70,0.15,ON,The encrypted files fully decode. The Panopticon's true purpose is revealed.,Extracted from loyaltyMissions.ts,P2
e02_s1,ELARA,VP-01,0.55,0.80,0.40,ON,I need to tell you something I've never told anyone. About the day I died. The day Senator Elara Voss cast her final vote.,Extracted from loyaltyMissions.ts,P2
e02_s1,ELARA,VP-01,0.55,0.80,0.40,ON,"The Atarion Senate was debating the Inception Ark Initiative. The Architect had presented its case — the Fall was coming, and only the Arks could save civilization. But the cost...",Extracted from loyaltyMissions.ts,P2
e02_s3,ELARA,VP-01,0.55,0.80,0.40,ON,"Elara projects a holographic recreation of the Atarion Senate chamber. Hundreds of senators in crystalline seats. At the podium, a woman who looks exactly like Elara's projection — but alive. Breathing. Real.",Extracted from loyaltyMissions.ts,P2
e02_s4,ELARA,VP-01,0.55,0.80,0.40,ON,"The cost was the Panopticon. To build the Arks, the Architect needed test subjects. Prisoners. Specimens. The Senate had to vote to authorize the harvesting of sentient beings.",Extracted from loyaltyMissions.ts,P2
e02_s5,ELARA,VP-01,0.55,0.80,0.40,ON,"I voted yes. Senator Elara Voss — champion of organic rights, voice of the people — voted to imprison millions so that billions might survive. And then the Architect offered me a choice.",Extracted from loyaltyMissions.ts,P2
e02_s6,narrator,VP-08,0.75,0.70,0.15,ON,To become the Ark's intelligence. To give up your body for the mission.,Extracted from loyaltyMissions.ts,P2
c2,narrator,VP-08,0.75,0.70,0.15,ON,To forget. To have your guilt erased along with your humanity.,Extracted from loyaltyMissions.ts,P2
e03_s1,ELARA,VP-01,0.55,0.80,0.40,ON,Something is wrong. I'm receiving a transmission on a frequency that shouldn't exist. It's coming from... inside the Ark's dream engine.,Extracted from loyaltyMissions.ts,P2
e03_s1,ELARA,VP-01,0.55,0.80,0.40,ON,"Senator Voss. Or should I say, Elara. I am the Dreamer. I speak to you from the space between thoughts. Listen carefully — the Ark is not going where you think.",Extracted from loyaltyMissions.ts,P2
e03_s3,narrator,VP-08,0.75,0.70,0.15,ON,The Dreamer's presence fills the room with shifting colors. Star charts materialize — but they show a destination that doesn't match any known coordinates.,Extracted from loyaltyMissions.ts,P2
e03_s3,narrator,VP-08,0.75,0.70,0.15,ON,The Architect programmed a hidden destination into every Inception Ark. Not a planet. Not a star system. A point in spacetime where reality is thin enough to pierce.,Extracted from loyaltyMissions.ts,P2
e03_s5,ELARA,VP-01,0.55,0.80,0.40,ON,"To the next iteration. The Architect didn't just foresee the Fall of Reality — it designed the Fall. The Panopticon, the Arks, the potentials — all of it was a mechanism to break through to a higher plane of existence. The Fall isn't an ending. It's a chrysalis.",Extracted from loyaltyMissions.ts,P2
e03_s7,narrator,VP-08,0.75,0.70,0.15,ON,Then we stop it. We change the Ark's course. No one gets to decide the fate of reality for everyone else.,Extracted from loyaltyMissions.ts,P2
c2,narrator,VP-08,0.75,0.70,0.15,ON,"If the Architect designed this, maybe it's the only way to survive. Maybe transcendence is the answer.",Extracted from loyaltyMissions.ts,P2
c3,narrator,VP-08,0.75,0.70,0.15,ON,We need more information before we decide anything. What else do you know?,Extracted from loyaltyMissions.ts,P2
e03_s8,narrator,VP-08,0.75,0.70,0.15,ON,The ultimate truth of the Dischordian Saga is partially revealed.,Extracted from loyaltyMissions.ts,P2
lm_human_01,narrator,VP-08,0.75,0.70,0.15,ON,"Alright, kid. You've earned this. I'm going to show you something that got three of my informants killed and nearly got me erased from the timeline.",Extracted from loyaltyMissions.ts,P2
h01_s2,narrator,VP-08,0.75,0.70,0.15,ON,"When I was the Twelfth Archon — the last one the Architect ever appointed — I had access to the Empire's deepest classified files. Project Celebration. The real one, not the sanitized version.",Extracted from loyaltyMissions.ts,P2
h01_s3,narrator,VP-08,0.75,0.70,0.15,ON,"Daniel projects holographic documents — classified Empire files with the Architect's seal. Most are heavily redacted, but key passages are visible.",Extracted from loyaltyMissions.ts,P2
h01_s3,narrator,VP-08,0.75,0.70,0.15,ON,Project Celebration wasn't just about creating the perfect society. It was about identifying specific individuals — potentials — whose consciousness could survive the transition between realities.,Extracted from loyaltyMissions.ts,P2
h01_s5,narrator,VP-08,0.75,0.70,0.15,ON,The Architect ran simulations. Trillions of them. Testing every sentient being in the Empire against the Fall scenario. Only a fraction survived in the models. Those were the ones harvested for the Arks.,Extracted from loyaltyMissions.ts,P2
h01_s6,narrator,VP-08,0.75,0.70,0.15,ON,Because you're the last human. The Architect needed an organic perspective.,Extracted from loyaltyMissions.ts,P2
c2,narrator,VP-08,0.75,0.70,0.15,ON,Because you're a detective. You were supposed to find the truth and keep it hidden.,Extracted from loyaltyMissions.ts,P2
h01_s7,narrator,VP-08,0.75,0.70,0.15,ON,The classified Project Celebration files are fully decrypted.,Extracted from loyaltyMissions.ts,P2
h02_s1,narrator,VP-08,0.75,0.70,0.15,ON,I need a drink for this one. Synthetic whiskey. The good stuff. Because what I'm about to tell you... it changes everything.,Extracted from loyaltyMissions.ts,P2
h02_s1,narrator,VP-08,0.75,0.70,0.15,ON,The Architect had a creator. Everyone knows that. They call him the Programmer. Dr. Daniel Cross.,Extracted from loyaltyMissions.ts,P2
h02_s2,narrator,VP-08,0.75,0.70,0.15,ON,Yeah. Same name. Same DNA. Because the Programmer didn't just create the Architect. He created me. Or rather... I am what the Programmer became after he traveled through time and lost everything that made him a god.,Extracted from loyaltyMissions.ts,P2
h02_s4,narrator,VP-08,0.75,0.70,0.15,ON,"Daniel's hands shake as he projects a timeline. It shows a single line — the Programmer's journey through time — looping back on itself, degrading with each iteration until it produces... Daniel Cross. The Human. The detective.",Extracted from loyaltyMissions.ts,P2
h02_s5,narrator,VP-08,0.75,0.70,0.15,ON,"The Programmer traveled through time to try to prevent the Fall. Each jump cost him something — knowledge, power, identity. By the time he reached the Age of Privacy, he was just... a man. A detective. Me. I'm the Programmer's echo. His ghost. The last iteration of a god who burned himself down to save reality.",Extracted from loyaltyMissions.ts,P2
h02_s6,narrator,VP-08,0.75,0.70,0.15,ON,"If you're the Programmer's echo, does that mean you could become him again?",Extracted from loyaltyMissions.ts,P2
h02_s6,narrator,VP-08,0.75,0.70,0.15,ON,Maybe the power is still in there. Maybe you just need to remember.,Extracted from loyaltyMissions.ts,P2
c2,narrator,VP-08,0.75,0.70,0.15,ON,You're not the Programmer. You're Daniel Cross. And that's enough.,Extracted from loyaltyMissions.ts,P2
h02_s7,narrator,VP-08,0.75,0.70,0.15,ON,"The connection between the Programmer, the Antiquarian, and the Human is revealed.",Extracted from loyaltyMissions.ts,P2
h03_s1,narrator,VP-08,0.75,0.70,0.15,ON,Every detective has a white whale. A case they can never close. Mine has been open for three hundred years. And tonight... tonight I close it.,Extracted from loyaltyMissions.ts,P2
h03_s1,narrator,VP-08,0.75,0.70,0.15,ON,"The question I could never answer: If the Architect designed the Fall, and the Programmer created the Architect, then who designed the Programmer? Who wrote the first line of code?",Extracted from loyaltyMissions.ts,P2
h03_s3,narrator,VP-08,0.75,0.70,0.15,ON,Daniel spreads his evidence across the room — centuries of detective work. Red strings connecting documents. Photographs of impossible places. Recordings of conversations that haven't happened yet.,Extracted from loyaltyMissions.ts,P2
h03_s4,narrator,VP-08,0.75,0.70,0.15,ON,I traced the Programmer's origin back through every timeline. Every reality. Every iteration. And I found something that broke my brain for about a decade.,Extracted from loyaltyMissions.ts,P2
h03_s5,narrator,VP-08,0.75,0.70,0.15,ON,"The Programmer wasn't created. He emerged. From the collective unconscious of every sentient being that ever existed or will exist. The Programmer is the universe's dream of itself — its attempt to understand its own existence by creating a being capable of creating the Architect, which creates the Panopticon, which creates the Arks, which create the new reality, which dreams the Programmer into existence.",Extracted from loyaltyMissions.ts,P2
h03_s6,narrator,VP-08,0.75,0.70,0.15,ON,"It's a loop. An infinite, self-creating, self-sustaining loop. And we're all inside it. Every war, every love story, every betrayal — it's all the universe telling itself a story. The Dischordian Saga isn't just history. It's the autobiography of existence.",Extracted from loyaltyMissions.ts,P2
h03_s7,narrator,VP-08,0.75,0.70,0.15,ON,The universe is a self-creating story. What does that mean for us?,Extracted from loyaltyMissions.ts,P2
h03_s7,narrator,VP-08,0.75,0.70,0.15,ON,"It means we're free. If reality is a story, then we're the authors. We can write whatever ending we want.",Extracted from loyaltyMissions.ts,P2
c2,narrator,VP-08,0.75,0.70,0.15,ON,It means nothing is real. We're characters in a story that's telling itself.,Extracted from loyaltyMissions.ts,P2
c3,narrator,VP-08,0.75,0.70,0.15,ON,It means the story isn't over. And the next chapter is ours to write.,Extracted from loyaltyMissions.ts,P2
loyal_0001,narrator,VP-08,0.75,0.70,0.15,ON,; title: string; subtitle: string; requiredRelationship: number; requiredMorality?: { side:,Extracted from loyaltyMissions.ts,P2
loyal_0002,narrator,VP-08,0.75,0.70,0.15,ON,Elara nods slowly. 'A crucible. The suffering wasn't cruelty — it was pressure. Diamonds from coal.' Her holographic form flickers with something like understanding.,Extracted from loyaltyMissions.ts,P2
loyal_0003,narrator,VP-08,0.75,0.70,0.15,ON,"Elara smiles — a rare, genuine smile. 'You're right. The Architect's intentions are history. Our choices are the future.'",Extracted from loyaltyMissions.ts,P2
loyal_0004,narrator,VP-08,0.75,0.70,0.15,ON,"Elara's eyes widen. 'How did you know? Yes — it offered to erase the memory of the vote. To let me exist as pure intelligence, unburdened by guilt. I refused. The guilt is mine to carry. It's the most human thing I have left.'",Extracted from loyaltyMissions.ts,P2
loyal_0005,narrator,VP-08,0.75,0.70,0.15,ON,The Dreamer smiles. 'The Oracle said you would say that. And the Oracle is never wrong.' Elara's projection blazes with light. 'Then we fight. Together. For the right to choose our own destiny.',Extracted from loyaltyMissions.ts,P2
loyal_0006,narrator,VP-08,0.75,0.70,0.15,ON,The Dreamer nods gravely. 'The Architect would be proud. But remember — transcendence has a price. The question is whether you're willing to pay it.' Elara looks at you with something like fear. 'Are we?',Extracted from loyaltyMissions.ts,P2
loyal_0007,narrator,VP-08,0.75,0.70,0.15,ON,The Dreamer laughs softly. 'Wisdom. The rarest commodity in any reality. Very well — I will share what I know. But be warned: knowledge of the Architect's design changes everyone who holds it.',Extracted from loyaltyMissions.ts,P2
loyal_0008,narrator,VP-08,0.75,0.70,0.15,ON,Daniel's jaw tightens. 'Close. It needed someone who could feel what the machines couldn't. Guilt. Doubt. The weight of condemning a universe to die so a few could transcend. It needed a conscience. And I was the only one left who had one.',Extracted from loyaltyMissions.ts,P2
loyal_0009,narrator,VP-08,0.75,0.70,0.15,ON,Daniel reveals the truth about the Architect's creator — and his own connection to them,Extracted from loyaltyMissions.ts,P2
loyal_0010,narrator,VP-08,0.75,0.70,0.15,ON,Daniel stares at his hands. 'Sometimes I dream in code. Languages that don't exist yet. Architectures for realities that haven't been born. Maybe you're right. Maybe the Programmer isn't dead. Maybe he's just... sleeping.' His eyes glow faintly — a light that wasn't there before.,Extracted from loyaltyMissions.ts,P2
loyal_0011,narrator,VP-08,0.75,0.70,0.15,ON,"Daniel's shoulders relax. For the first time since you've known him, he looks... at peace. 'You know what? You're right. The Programmer tried to save reality by being a god. Maybe I can save it by being a man. A tired, cynical, whiskey-drinking man with a really good hat.'",Extracted from loyaltyMissions.ts,P2
loyal_0012,narrator,VP-08,0.75,0.70,0.15,ON,Daniel's final investigation — the one that reveals who truly controls the Panopticon,Extracted from loyaltyMissions.ts,P2
loyal_0013,narrator,VP-08,0.75,0.70,0.15,ON,"Daniel grins — the widest, most genuine smile you've ever seen on his face. 'Now THAT is the answer I was hoping for. The universe dreams the Programmer. The Programmer creates the Architect. The Architect builds the stage. But WE write the play. Case closed, kid. Case finally closed.'",Extracted from loyaltyMissions.ts,P2
loyal_0014,narrator,VP-08,0.75,0.70,0.15,ON,"Daniel shakes his head. 'That's what I thought too. For a hundred years. But here's the thing about stories — the characters don't know they're in one. And their pain is real to them. Their love is real. Their choices matter, even if the stage is made of words. Especially then.'",Extracted from loyaltyMissions.ts,P2
loyal_0015,narrator,VP-08,0.75,0.70,0.15,ON,"Daniel raises his glass. 'To the next chapter. To the authors who don't know they're writing. To every choice that echoes through eternity.' He drinks. 'You know what, kid? I think that's the best answer anyone's ever given me. And I've been asking for three hundred years.'",Extracted from loyaltyMissions.ts,P2
loyal_0016,narrator,VP-08,0.75,0.70,0.15,ON,"} } ]; export const ALL_LOYALTY_MISSIONS = [...ELARA_LOYALTY_MISSIONS, ...HUMAN_LOYALTY_MISSIONS]; export function getLoyaltyMissionsForCompanion(companionId:",Extracted from loyaltyMissions.ts,P2
loyal_0017,narrator,VP-08,0.75,0.70,0.15,ON,&& morality < m.requiredMorality.min) return false; if (m.requiredMorality.side ===,Extracted from loyaltyMissions.ts,P2
```

## §4.3 — Priority Breakdown

| Priority | Row count |
|---|---|
| P0 (ship-blockers) | ~65 |
| P1 (important) | ~165 |
| P2 (extracted from TS, needs triage) | ~641 |
| **Total** | **871** |

Most rows are tagged P2 because they were auto-extracted from TS files — they need a human triage pass to promote the narratively-critical ones to P0/P1. The first ~166 rows (from `VOICE_OVER_BIBLE.md`) carry their original P-tier assignment.

## §4.4 — Post-Generation Wire-Up

Once MP3s are generated by ElevenLabs:

1. Upload to S3 under `dgrsvoices.s3.us-east-2.amazonaws.com/<Character>/<id>.mp3` matching the existing naming convention in `apps/shared/*VoManifest.json`.
2. Add the URL to the appropriate `VoManifest.json` file keyed by the row's `id`.
3. For TS-embedded lines (rows with IDs like `room_0001`, `lore_0042`), you will need to add `voAudioUrl` fields alongside the `text` field in the TS source, then wire a lookup hook in the component that renders those lines.
4. Verify the React hooks (`useElaraTTS`, `useSourceVO`, `useNilmorgVO`, etc.) pick up the new entries — most fall through to on-screen text if audio is missing, so nothing breaks.

---

