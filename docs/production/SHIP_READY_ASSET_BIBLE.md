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

