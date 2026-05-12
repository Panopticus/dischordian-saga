# NANO BANANA × VEO 3.1 — FIGHT-INTRO PROMPT BOOK (DRAFT)
**Coverage:** Collector's Arena Acts 2–7 chapter intros (14) + TCG main-ladder gaps (15)
**Status:** Draft, awaiting writer + art review. Pairs with `NANO_BANANA_VEO_FULL_PROMPT_BOOK.md` (§3 covers saga chapters 5–21; this book covers Arena 1–12 and TCG main-ladder gaps).
**Authors-note:** Every clip is 8 s. Chained pieces share frames — `END frame` of clip N is `START frame` of clip N+1 verbatim. No music, SFX only. ≤1 VO line per clip, ≤14 words, hard-synced to mouth/motion.

---

## §0 — Conventions

**Camera vocab (verbatim from §1 of the existing book):** slow push-in, slow pull-back, dolly orbit, handheld micro-shake locked frame, rack focus, whip-pan, tilt, camera locked / subject moves frame, subject parallax two-planes. One continuous camera move + one dominant visual idea per shot.

**VFX tokens (verbatim from §2):** `vfx_cyan_tessellation`, `vfx_amber_runes`, `vfx_voidblack_static`, `vfx_palimpsest_chromatic`, `vfx_meme_static`, `vfx_necromancer_red_smoke`, `vfx_collector_dna_helix`, `vfx_seer_white_feathers`, `vfx_witnessing_pulse`, `vfx_warlord_gold_sparks`.

**Additional tokens introduced by this draft:** `vfx_card_materialise_violet`, `vfx_card_materialise_amber`, `vfx_card_materialise_red`, `vfx_card_materialise_magenta`, `vfx_card_materialise_cyan`, `vfx_card_materialise_brass`, `vfx_digital_compile`, `vfx_authority_lattice`, `vfx_blood_impact`, `vfx_matrix_dissolve`.

**Faction palettes (uniform, per §2):**
- Panopticon — steel `#2c3540` + brass `#b88c3a`
- Insurgency — steel `#2c3540` + hot-orange `#ff6b1a`
- New Babylon — indigo-black `#0a0d2e` + magenta `#ff2bd6` XOR cyan `#22d3ee`
- Thought Virus — dark field + magenta `#ff2bd6` + violet bleed
- Architect / Authority — void-black `#010012` + Authority-red `#c11414`
- Dreamer — iridescent black + iris-cyan `#7df3ff`
- Antiquarian — deep-space-black `#010020` + ash `#1a1a24` + brass `#b88c3a` + oxblood `#5b1a1a`

**Rules:** One hot accent per piece. Single dominant key. No on-image text, no modern logos, no lens flares (anamorphic streak OK). VO never plays over a still freeze — only during motion.

**Style anchors:**
- **Arena (MK mode):** 3×8 s chain (24 s total). Brutal, kinetic, threat-stance freeze. VO is taunt-flavoured. SFX leans on bone-impact, environmental damage, audible breath.
- **TCG (anime-card mode):** 2×8 s chain default (16 s). Stillness → card-conjure flourish → stance lock. Cards are weapons — they materialise, fan, ignite, lock into a hand. VO is rule-flavoured (the opponent declaring the round's terms). SFX leans on card-flutter, ki-whoosh, silk-rustle, tile-tap. Bosses chain to 24 s.

---

## §A — Collector's Arena (MK mode, 14 chapters)

---

### §A.1 Arena ch1 "The Dead Signal" — Agent Zero
**Length:** 24 s (3×8 s chain) | **Faction palette:** Insurgency, steel + magenta-violet rim
**Arena:** Panopticon broadcast corridor — brass conduit-lines, blown-out monitors
**Mood:** She is already in the room before the door finished opening.

**Clip 1 — `arena_establish_dead_signal` (0–8 s)**
- **Nano Banana — START frame:** Long Panopticon corridor, low key-light from one dead monitor at the vanishing point flickering blown-out white. Brass conduit-pipes run the ceiling. Floor wet, reflecting a violet smoke-trail rolling toward camera. No figure. Empty oxblood-stained file cabinet against the left wall, drawer open. High-contrast, single key, anamorphic streak from the monitor.
- **Nano Banana — END frame:** Same corridor, same composition — a violet smoke-shape now occupies the mid-ground at 5 m, vaguely humanoid, no resolution. Monitor still flickering. Smoke heavier on the floor.
- **VEO 3.1 motion (8 s):** Camera locked low. Slow push-in 8 m → 5 m. Monitor flickers seconds 1, 3, 6 (`vfx_voidblack_static` 0.3). Wet-floor reflection ripples second 4. Second 7: violet smoke-shape coalesces in mid-ground; no resolved features.
- **SFX:** dead-monitor 60 Hz hum (continuous); single boot-step on wet floor (3.2); distant Panopticon PA bell muted (5.0); female breath inhale close-mic (7.5).
- **VO:** *(none — she has not spoken.)*

**Clip 2 — `agent_zero_reveal` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Mid-corridor, 3 m to camera. Agent Zero centre-frame, three-quarter view: woman, late 20s, dark auburn hair under violet hood (hood half-down), amber eyes, magenta-violet rim along jaw. Purple-black tactical armor, deck holstered at left hip, right hand low and open. Monitor behind her bursts to static, freezing her silhouette as a violet cutout. Smoke fills the floor.
- **VEO 3.1 motion (8 s):** Camera holds. Smoke-shape resolves into Agent Zero on second 0.5 (no entrance — she was always there). Second 2: right hand rises palm-up. Second 4: she takes one step forward, dead monitor bursts to white (`vfx_voidblack_static` 0.6). Second 5.5: mouth motion only. Second 7: she stops, monitor freezes mid-burst, silhouetting her.
- **SFX:** static-pop (4.0); cloth/strap creak (4.1); breath out at conversational distance (5.5 under VO); single drop of ceiling-water hitting floor (7.5).
- **VO:** *"I read your signal. You don't get to send another."* (5.5–7.5 s, conversational volume, smoky-contralto.)

**Clip 3 — `tableau_lock_agent_zero` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide two-shot. Player silhouette right foreground (shoulder + deck-edge visible, no face). Agent Zero centre-left in low fighting stance, right hand drawn to hip ready for a draw — not yet drawing. Dead monitor pure-white behind her, silhouetting both fighters. Smoke ankle-height. This frame = first frame of gameplay; HUD anchor on player deck-edge.
- **VEO 3.1 motion (8 s):** Slow pull-back 3 m → 7 m revealing player shoulder + deck-edge. Second 3: she drops into stance — heels turn, knees bend, weight back. Second 5: monitor floods pure-white, silhouettes both fighters for half a second, then settles to soft glow. Final 2 s: locked frame, smoke ambient motion only.
- **SFX:** boots pivot on wet floor (3.0); monitor surge → soft glow (5.0); ambient smoke-roll continuous; player breath close (6.5); HUD chime placeholder (8.0).
- **VO:** *(none — last word was hers.)*

---

### §A.2 Arena ch2 "The Arena's Law" — Jailer
**Length:** 24 s | **Faction:** Panopticon, steel + brass
**Arena:** Watcher-Panopticon viewing-room platform — hundred small surveillance-eye lenses on the far wall, brass-railed lectern centre
**Mood:** Voice-match horror. Your sign-in is the cell-door.

**Clip 1 — `arena_establish_jailer` (0–8 s)**
- **Nano Banana — START frame:** Wide viewing-room, brass railing across the foreground. Far wall a grid of one hundred small camera-eye lenses, half lit faint amber. Centre platform empty, chrome key-ring resting on a brass lectern. Cold steel `#2c3540` walls, single brass `#b88c3a` accent on the lectern. Ambient haze.
- **Nano Banana — END frame:** Same composition — chrome key-ring now floating one inch above the lectern, rotating slowly. All hundred eyes on the far wall now open and luminous, locked on camera.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: a single eye blinks open. Second 2–4: eyes open in cascading rows top-to-bottom (`vfx_witnessing_pulse` 0.4 ping per row). Second 5: key-ring lifts off lectern, slow rotation. Second 7: every eye full-bright, key-ring hovering.
- **SFX:** ambient room-tone (continuous); brass-metal lift-and-rotate (5.0); soft cascading shutter-clicks per row of eyes (1.0 → 4.0); ventilation hum, very low (under).
- **VO:** *(none.)*

**Clip 2 — `jailer_descend` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Jailer now stands on the platform behind the lectern, three-quarter view: tall, oxblood warden-coat, chrome face-mask with one horizontal luminous slit at eye-line, black-iron key-ring at hip. Key-ring on the lectern has drifted up into the Jailer's gloved hand. The hundred eyes on the far wall all blink shut in unison except one — a single eye centre-frame stays open.
- **VEO 3.1 motion (8 s):** Camera holds. Second 1: Jailer descends from above frame, slow, weight settling on second 3 — heavy boot impact. Second 4: key-ring on lectern drifts up into the Jailer's palm. Second 5.5: mask-slit dims, VO line. Second 7: all eyes shut except centre, leaving the Jailer rim-lit by that one watcher.
- **SFX:** heavy boot impact (3.0); chain-key jingle as ring rises (4.0–4.5); ninety-nine soft shutter-snaps in rapid unison (7.0); breath through chrome-mask, distorted (5.5 under VO).
- **VO:** *"You signed in. The signing is the sentence."* (5.5–7.5 s, genderless hoarse-bass, vocoded through mask.)

**Clip 3 — `tableau_lock_jailer` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide two-shot. Player silhouette right-foreground, shoulder + deck-edge visible. Jailer centre, half-turned, key-ring held at hip-height in a guard-stance, mask-slit pulsing slow. One eye on the far wall still open behind him, framing his head like a halo of surveillance. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 4 m → 8 m, revealing player. Second 3: Jailer half-pivots, key-ring drops to hip-guard. Second 5: mask-slit pulses once (`vfx_witnessing_pulse` 0.5). Final 2 s: locked frame, slit pulsing slow.
- **SFX:** chain jingle on hip-drop (3.5); mask-pulse low subharmonic (5.0); ambient hum continuous; HUD chime (8.0).
- **VO:** *(none.)*

---

### §A.3 Arena ch3a "The General's Honor" — Iron Lion
**Length:** 24 s | **Faction:** Insurgency, steel + hot-orange
**Arena:** Crucible sand-floor — lion-crest banners snapping in wind, brass torch-sconces
**Mood:** Parade-ground baritone. Salutes the Oracle, not you.

**Clip 1 — `arena_establish_crucible` (0–8 s)**
- **Nano Banana — START frame:** Crucible at dusk. Sand-floor centre-frame, four lion-crest banners along the back wall in deep oxblood, hot-orange torches between them. No figures. Wind direction left-to-right. Single banner mid-frame already half-fallen, draped to the ground.
- **Nano Banana — END frame:** Same composition — the half-fallen banner now fully on the ground, sand drifting over it. Wind heavier. A boot-print, fresh, in the sand right of centre.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: torches flicker, wind audible. Second 3: half-fallen banner finishes falling, sand drift. Second 5: a single bootprint impresses itself into the sand right of centre (off-screen weight). Second 7: wind drops to ambient.
- **SFX:** wind on canvas (continuous); torch-crackle (2.0, 4.0, 6.5); banner-fall fabric whump (3.0); sand-crunch under unseen weight (5.0).
- **VO:** *(none.)*

**Clip 2 — `iron_lion_stride` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Iron Lion centre-frame, three-quarter view, mid-stride at 4 m to camera: white bald man, auburn beard, white power-armor with black lion-head logo on left pauldron, hot-orange rim from the torches. Right fist mid-rise to chest in salute — but his head is turned slightly upward, eyes off-camera (saluting something above). Sand drifting around his boots.
- **VEO 3.1 motion (8 s):** Camera locked, low angle. Second 1: Iron Lion enters frame-left, full stride. Second 4: he stops centre, weight settles. Second 5: right fist rises to chest in salute, head tilts up — eyes off-camera. Second 6.5: VO. Second 7.5: fist still at chest, eyes still up.
- **SFX:** measured power-armor footfalls (1.0, 2.0, 3.0); servo-whine on salute (5.0); wind under (continuous); leather-creak on fist-clench (5.2).
- **VO:** *"Honour first. Then the rest."* (6.5–7.8 s, parade-ground baritone, hard-Rs.)

**Clip 3 — `tableau_lock_iron_lion` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide two-shot. Player right-foreground, deck-edge visible. Iron Lion centre, fist now lowered to chest-guard, weapon (a hot-orange edged sabre) drawn and held vertical at his right side, point-down. Banners snap behind him. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 4 m → 8 m. Second 2: fist lowers from salute to chest-guard. Second 4: sabre draws (single motion, hot-orange edge igniting `vfx_amber_runes` 0.4 along the blade). Second 6: weight settles, banners snap. Final 2 s: locked.
- **SFX:** sabre-draw scrape (4.0); blade-ignition crackle (4.5); banner-snap wind (6.0); HUD chime (8.0).
- **VO:** *(none — he gave the line in Clip 2.)*

---

### §A.4 Arena ch3b "The Ghost" — Wraith Calder
**Length:** 24 s | **Faction:** Insurgency, steel + magenta-violet
**Arena:** Shadow Sanctum ruins — seven oxblood candles, three lit, broken altar centre
**Mood:** Seven deaths, seven resurrections. Amber eyes burn through darkness.

**Clip 1 — `arena_establish_sanctum` (0–8 s)**
- **Nano Banana — START frame:** Ruined sanctum interior. Broken altar centre. Seven low oxblood candles in a semicircle on the altar, three lit, four dark. Magenta-violet rim along the broken walls. No figure. Dust-haze.
- **Nano Banana — END frame:** Same composition — three lit candles now flickering low, dust-haze thicker, a faint amber pinpoint glow visible in the doorway-shadow behind the altar (two eyes, no body).
- **VEO 3.1 motion (8 s):** Camera locked. Second 2: candles flicker once, all three nearly out. Second 4: dust-haze thickens. Second 6: two amber pinpoints appear in the doorway-shadow behind the altar, fixed, unblinking. Second 8: hold.
- **SFX:** room-tone ambient stone (continuous); candle-flame whuff per flicker (2.0); slow inhale, distant (6.0); single low heart-thud (7.0).
- **VO:** *(none.)*

**Clip 2 — `wraith_calder_step` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Wraith Calder now stands behind the altar, three-quarter pose, body fully resolved: powerful Black man, burning amber eyes, dark leather armor, magenta-violet rim. Right hand resting flat on the altar between the candles. Three of the previously-dark candles have lit themselves, six now burning total. Dust-haze parts around him.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: Calder steps forward out of the doorway-shadow into full visibility — body resolves, dust parts. Second 3: he lays his right hand flat on the altar. Second 4: three dark candles light themselves one at a time (5.0, 5.5, 6.0). Second 6.5: VO. Second 8: hold.
- **SFX:** quiet footfall on stone (1.0); palm-on-altar contact thud (3.0); candle-ignition whoosh ×3 (5.0, 5.5, 6.0); calm exhale (6.5 under VO).
- **VO:** *"I died six times before you got here. The seventh isn't mine."* (6.5–7.8 s, calm-commanding-alto, steady.)

**Clip 3 — `tableau_lock_wraith` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide two-shot. Player right-foreground, deck-edge visible. Calder centre, hand off altar, low fighting stance, amber eyes locked on camera. Six candles burning behind him, seventh still dark. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 4 m → 8 m. Second 3: hand lifts from altar, stance drops low. Second 5: amber eyes flare once. Final 2 s: locked, seventh candle remains dark.
- **SFX:** soft cloth-shift on stance-drop (3.0); amber-flare low-pulse (5.0); ambient candle-flame (continuous); HUD chime (8.0).
- **VO:** *(none.)*

---

### §A.5 Arena ch4 "The Red Death" — Akai Shi
**Length:** 24 s | **Faction:** Antiquarian, deep-space-black + ash + oxblood + brass
**Arena:** Crimson-Court tile-floor — black tile, oxblood ribbons, code-fragments dissolving in air
**Mood:** They wrote her dead. She disagreed.

**Clip 1 — `arena_establish_crimson` (0–8 s)**
- **Nano Banana — START frame:** Black-tiled court, oxblood ribbons hanging from a high beam, no breeze. Centre: a single twin-blade planted point-down in the tile, crimson edge-glow. No figure. Code-fragments (translucent green glyphs) drifting in the air, slowly dissolving.
- **Nano Banana — END frame:** Same composition — code-fragments thicker, ribbons just beginning to lift in an unfelt breeze, the planted blade now glowing brighter.
- **VEO 3.1 motion (8 s):** Camera locked low on the planted blade. Second 1: green code-fragments drift past (`vfx_matrix_dissolve` 0.4). Second 4: ribbons begin to lift. Second 6: blade-glow intensifies. Second 8: hold.
- **SFX:** silk-ribbon shift (continuous low); code-fragment crystal-shimmer (1.0–6.0); metal-resonance from the blade (6.0).
- **VO:** *(none.)*

**Clip 2 — `akai_shi_descend` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Akai Shi centre-frame, mid-air, three-quarter pose, just touching down on the tile beside the planted blade. Female warrior, red-and-black lacquered armor, second twin-blade drawn mid-fall in right hand, first blade still planted point-down by her left foot. Red-beneath-skin glow at neck and wrist. Code-fragments scatter from her landing.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: a shadow crosses overhead. Second 2: she drops into frame from above, falling with second blade already drawn. Second 4: touchdown — code-fragments shatter outward (`vfx_matrix_dissolve` 0.6). Second 5.5: she lifts the planted blade out of the tile in one motion. Second 7: VO. Second 8: hold.
- **SFX:** wind-rush on fall (2.0); tile-impact landing thud (4.0); shattering glyph-crystals (4.1); blade-pull from stone (5.5); breath in-and-out controlled (7.0 under VO).
- **VO:** *"They wrote me dead. I disagreed."* (7.0–8.0 s, battle-alto, edge-sharp vowels.)

**Clip 3 — `tableau_lock_akai_shi` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide two-shot. Player right-foreground, deck-edge visible. Akai Shi centre, both blades crossed at chest in X-guard, crimson edges glowing. Code-fragments faintly visible in the air around her. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 3 m → 7 m. Second 2: blades raise and cross at chest. Second 4: red-beneath-skin glow pulses once. Second 6: stance settles. Final 2 s: locked.
- **SFX:** blade-cross metal-ring (2.5); skin-glow low pulse (4.0); ambient haze (continuous); HUD chime (8.0).
- **VO:** *(none.)*

---

### §A.6 Arena ch5 "Dead Code Rising" — Necromancer
**Length:** 24 s | **Faction:** Architect, void-black + Authority-red
**Arena:** Necromancer-Castle throne hall — black basalt pillars, eight red sigils orbiting empty throne
**Mood:** Die well. It's harder than it looks.

**Clip 1 — `arena_establish_necromancer_throne` (0–8 s)**
- **Nano Banana — START frame:** Throne hall, cold blue-black. Black basalt throne centre, empty. Eight red sigils slow-orbit the throne at chest-height. Ground fog ankle-height. A single bone-knife (not a card — this is Arena, bone-knives instead) planted in the bottom step.
- **Nano Banana — END frame:** Sigils condensed closer to the throne, ground-fog thicker, bone-knife now risen one inch off the step and rotating.
- **VEO 3.1 motion (8 s):** Slow push-in 9 m → 5 m. Second 2: fog thickens (`vfx_necromancer_red_smoke` 0.5). Second 4: sigils contract toward the throne in unison. Second 6: bone-knife rises and rotates above the step. Second 8: hold.
- **SFX:** low subharmonic drone (continuous, –18 dB); sigil-tone per contraction (4.0); bone-knife shiver-resonance (6.0).
- **VO:** *(none.)*

**Clip 2 — `necromancer_compose` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Necromancer seated on throne, three-quarter pose. Elf-like ears, white spiky hair, red-tinted round glasses, black coat red-lined collar. Eight bone-knives now orbiting his right palm at chest-height. The original step-knife has joined the orbit. Faint smile, eyes closed behind glasses. Red smoke thicker, knee-height.
- **VEO 3.1 motion (8 s):** Camera holds. Second 1: red smoke thickens around throne. Second 2: body composes from the smoke upward, not downward — feet form last. Second 4: sigils condense into orbiting bone-knives. Second 5: knife from step joins orbit. Second 6.5: VO. Second 7.5: faint smile.
- **SFX:** smoke-roll low (continuous); eight bell-tones per sigil-to-knife conversion (4.0–5.0); cloth-settle (5.5); breath in through closed lips (6.5 under VO).
- **VO:** *"Die well. It's harder than it looks."* (6.5–7.8 s, wet-tenor, trails into half-laugh.)

**Clip 3 — `tableau_lock_necromancer_arena` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide two-shot. Player right-foreground, deck-edge visible. Necromancer still on throne but leaning forward, eyes now open behind red glasses, bone-knife orbit tightened into a fan in his left hand, right hand extended palm-out toward camera. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 5 m → 8 m. Second 2: he leans forward, eyes open. Second 3: knife-orbit collapses into a fan in left hand. Second 5: right hand extends palm-out. Final 2 s: locked, smoke continues.
- **SFX:** knife-fan riffle (3.0); silk-rustle of coat-sleeve (5.0); ambient sigil-hum (continuous); HUD chime (8.0).
- **VO:** *(none.)*

---

### §A.7 Arena ch6 "The False Prophet" — White Oracle
**Length:** 24 s | **Faction:** Thought Virus, dark field + magenta + violet bleed
**Arena:** Thaloria canopy — bioluminescent vines, clearing in canopy-light
**Mood:** Mirror-face of the player. Smile 95% right, 5% wrong.

**Clip 1 — `arena_establish_thaloria` (0–8 s)**
- **Nano Banana — START frame:** Bird's-eye on a small clearing in a Thaloria canopy. Bioluminescent vines, pink-magenta glow. A single figure stands centre-clearing, facing away — same hair, same height, same coat as the player. No face visible.
- **Nano Banana — END frame:** Same composition — figure has not moved, but the pink-magenta vine-glow has crept inward, and a faint chromatic-aberration halo has formed around her silhouette (`vfx_palimpsest_chromatic` 0.3).
- **VEO 3.1 motion (8 s):** Camera locked, high overhead. Second 1: vines pulse pink. Second 4: vine-glow creeps inward. Second 6: chromatic halo forms around the figure. Second 8: hold.
- **SFX:** canopy-rustle (continuous); soft chromatic shimmer-tone (4.0); a single bird-call cut short (7.0).
- **VO:** *(none.)*

**Clip 2 — `white_oracle_turn` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** White Oracle facing camera now, three-quarter view, ground-level shot (camera has dropped). Her face is the player's face, almost right — eyes slightly mismatched amber/violet, smile asymmetric, pink chromatic halo more pronounced. She wears the player's coat in white-pink instead of the player's colour. Hands at her sides, mirroring stance.
- **VEO 3.1 motion (8 s):** Camera tilts down from overhead to ground-level over seconds 0–3, settling at 4 m in front of her. Second 4: she turns to face camera (single motion, no transition steps). Second 5: smile forms, chromatic halo intensifies (`vfx_palimpsest_chromatic` 0.5). Second 6.5: VO. Second 8: hold.
- **SFX:** soft cloth-rustle on turn (4.0); chromatic-shimmer pulse (5.0); player's own breath audible faintly (the wrong direction — coming from her, not you) (6.5 under VO).
- **VO:** *"You're early. I've been you for an hour."* (6.5–7.8 s, player-voice clone with pink chromatic aberration on every consonant.)

**Clip 3 — `tableau_lock_oracle_mirror` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide two-shot — but the composition is mirrored. Player right-foreground in player's actual stance; Oracle centre-left in the same stance, flipped. Same deck-edge angle on both. Chromatic halo around her. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 4 m → 7 m revealing player right-foreground. Second 3: Oracle drops into player's exact stance, mirrored. Second 5: halo pulses once. Final 2 s: locked, vines pulse ambient.
- **SFX:** mirrored boot-pivot on canopy-floor (3.0); chromatic-pulse low (5.0); vine-rustle (continuous); HUD chime (8.0).
- **VO:** *(none.)*

---

### §A.8 Arena ch7 "Project Vector" — Warlord (Dr. Vox → Warlord)
**Length:** 24 s | **Faction:** Thought Virus, dark + magenta
**Arena:** Terminus lab — green nanobot tanks lining the walls, console-light dominates
**Mood:** The doctor stepped out. I'll take it from here.

**Clip 1 — `arena_establish_terminus` (0–8 s)**
- **Nano Banana — START frame:** Terminus lab, tall green nanobot tanks lining both walls, a console centre-back. Dr. Vox stands at the console, back to camera: older man, white lab-coat, grey hair, glasses just visible from the side, faintly green-glow nanobots crawling over his coat sleeves. Glyphs scrolling on the console screen.
- **Nano Banana — END frame:** Same composition — Vox has not moved, but the green nanobot-glow on his sleeves has thickened, and one tank along the left wall is fracturing along a hairline crack with pink (not green) light bleeding through.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: console glyphs scroll faster. Second 4: nanobot-glow thickens. Second 6: left-wall tank fractures, pink light bleeds (`vfx_meme_static` 0.3). Second 8: hold.
- **SFX:** console keyboard ambient ticks (continuous low); tank coolant hum (continuous); hairline-fracture crystalline pop (6.0).
- **VO:** *(none.)*

**Clip 2 — `vox_to_warlord_transform` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Warlord now stands where Vox was, three-quarter facing camera, console behind her: young woman, platinum blonde, yellow hooded jacket (hood half-down), face tattoos, green eyes, gold sparks at jacket hem (`vfx_warlord_gold_sparks` 0.5). Knuckles cracked, half-smile. Vox's lab-coat lies on the floor at her feet.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: Vox begins to turn. Second 2: as he turns, face glitches pink (`vfx_meme_static` 0.6) — single hard glitch-cut on second 3 — face replaces with Warlord's face mid-turn. Second 4: body continues turning, lab-coat falls from shoulders to floor. Second 5: she finishes turn, full Warlord, knuckles audibly crack. Second 6.5: VO. Second 8: hold.
- **SFX:** turn-footstep (1.5); pink-static crackle (2.5–3.5); lab-coat fabric-fall (4.0); knuckle-crack (5.0); gold-spark crackle (5.5); breath out, hardcore-alto (6.5 under VO).
- **VO:** *"The doctor stepped out. I'll take it from here."* (6.5–7.8 s, hardcore-alto, drops consonants.)

**Clip 3 — `tableau_lock_warlord` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide two-shot. Player right-foreground, deck-edge visible. Warlord centre, low brawler stance, fists up at jaw-line, hood now fully down, gold sparks trailing at hem. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 4 m → 7 m. Second 2: she drops into brawler stance, hood falls fully back. Second 4: gold-spark hem flares once. Second 6: weight settles. Final 2 s: locked.
- **SFX:** hood-fabric drop (2.0); gold-spark flare (4.0); ambient lab-hum (continuous); HUD chime (8.0).
- **VO:** *(none.)*

---

### §A.9 Arena ch8 "The Detective" — Human
**Length:** 24 s | **Faction:** Insurgency, steel + hot-orange (muted to wet-pavement neon)
**Arena:** Panopticon street-level — rain, neon-flicker, alley mouth
**Mood:** No upgrades. No tricks. Just questions.

**Clip 1 — `arena_establish_street` (0–8 s)**
- **Nano Banana — START frame:** Wet street, neon-flicker on the walls (one hot-orange sign, half-dead). Alley mouth centre-back, dark. Foreground: a lit cigarette on the wet pavement, half-burnt, smoke curling. No figure. Rain misting.
- **Nano Banana — END frame:** Same composition — cigarette burnt down further, smoke heavier, a man's shadow now fills the alley mouth (silhouette only, no face).
- **VEO 3.1 motion (8 s):** Camera locked, low on the cigarette. Second 2: rain mists past. Second 4: a step-sound in the alley. Second 6: shadow fills the alley mouth, no movement after. Second 8: hold.
- **SFX:** rain on pavement (continuous); neon-buzz from the half-dead sign (continuous); single step in puddle (4.0); cigarette ember crackle (continuous low).
- **VO:** *(none.)*

**Clip 2 — `detective_steps_out` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** The Human (Detective) stepped out of the alley, mid-frame at 4 m. Long dark coat, no augmentations, no glowing parts, no faction colour — just a man. Stubble, tired eyes, no weapon. Right hand in coat pocket. He's stepped on the cigarette; smoke gone. Rain wets his hair.
- **VEO 3.1 motion (8 s):** Camera tilts up from cigarette to figure-height over seconds 0–2. Second 2: he steps out of the alley, deliberate. Second 4: foot lands on cigarette, smoke crushed. Second 5: he stops, hands in pockets. Second 6.5: VO. Second 8: hold.
- **SFX:** boot in puddle on alley-step (2.0); cigarette-crush (4.0); rain continuous; quiet exhale (6.5 under VO).
- **VO:** *"No upgrades. No tricks. Just questions."* (6.5–7.8 s, world-weary tenor.)

**Clip 3 — `tableau_lock_detective` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide two-shot. Player right-foreground, deck-edge visible. Detective centre, coat open, no weapon visible, both hands now out of pockets and held loose at his sides — a man's stance, not a fighter's. Rain on his coat. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 4 m → 8 m. Second 3: coat opens (he doesn't open it — it just hangs that way). Second 5: hands come out of pockets, settle at his sides. Final 2 s: locked, rain ambient.
- **SFX:** coat-fabric shift (3.0); rain ambient continuous; HUD chime (8.0).
- **VO:** *(none.)*

---

### §A.10 Arena ch9a "The Unknown Variable" — Enigma
**Length:** 24 s | **Faction:** Insurgency, steel + hot-orange (muted by chalk-glow)
**Arena:** Terminus-Core — equation-walls live-writing, chalk-light dominates
**Mood:** Haven't slept since Veridian Six. Try me.

**Clip 1 — `arena_establish_terminus_core` (0–8 s)**
- **Nano Banana — START frame:** A long chamber of equation-walls — chalk-glow symbols continually rewriting themselves in slow live motion. Floor is a darker stone. No figure. Centre-frame, a half-completed proof on the back wall, one step from resolving.
- **Nano Banana — END frame:** Same composition — equations have rearranged into a partial proof centred on the back wall, the rest scrambled, awaiting a final symbol. Chalk-glow brighter.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1–4: equations continually rewriting (`vfx_amber_runes` 0.3 along walls). Second 5: walls reorganise — symbols streak to form a centred proof. Second 7: proof one symbol from complete, holding. Second 8: hold.
- **SFX:** chalk-on-stone scrape, continuous very low; faint mathematical-ticks per symbol (continuous); a single deep inhale, room-distant (5.0).
- **VO:** *(none.)*

**Clip 2 — `enigma_enters` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Enigma centre-frame, three-quarter view at 4 m: Black woman, long dreadlocks, navy military trench-coat, gold buttons catching the chalk-light. Tired eyes. Right hand raised, two fingers extended toward the back wall. The equation-proof on the back wall has now resolved — and the symbol she pointed at is the final one, glowing brighter.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: she enters frame-left walking. Second 3: she stops centre, raises right hand. Second 4: two fingers extend toward the wall. Second 5: the missing symbol completes itself on the wall (`vfx_amber_runes` 0.5 — single hard glow). Second 6.5: VO. Second 8: hold.
- **SFX:** measured footfalls (1.0, 2.0); coat-rustle on stop (3.0); chalk-thunk as final symbol writes (5.0); soft exhale (6.5 under VO).
- **VO:** *"I haven't slept since Veridian Six. Try me."* (6.5–7.8 s, low-velvet contralto.)

**Clip 3 — `tableau_lock_enigma` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide two-shot. Player right-foreground, deck-edge visible. Enigma centre, both hands at sides, the resolved proof frozen on the back wall behind her like a halo. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 4 m → 7 m. Second 3: she lowers her hand to her side. Second 5: equation-wall scribbling freezes — the only frozen surface in the arena. Final 2 s: locked.
- **SFX:** equation-wall freeze-tick (5.0); coat-shift (3.5); HUD chime (8.0).
- **VO:** *(none.)*

---

### §A.11 Arena ch9b "The Gambler's Truth" — Degen
**Length:** 24 s | **Faction:** New Babylon, indigo-black + magenta (no cyan)
**Arena:** New Babylon rain-neon street — wet table under a casino awning, magenta sign-glow
**Mood:** Bet everything. House doesn't, but I do.

**Clip 1 — `arena_establish_new_babylon` (0–8 s)**
- **Nano Banana — START frame:** Rain-soaked street under a casino awning. Wet table centre-frame, a deck of cards face-down on it, magenta-rim deck-back. Magenta sign-glow only — no cyan accent at all. Two empty chairs.
- **Nano Banana — END frame:** Same composition — one chair pushed back from the table by an invisible hand, the deck cut into two halves, top half slightly offset.
- **VEO 3.1 motion (8 s):** Camera locked low on the table. Second 1: rain ambient. Second 4: chair pushes back (off-screen weight settling). Second 6: deck cuts itself — top half lifts and resets offset. Second 8: hold.
- **SFX:** rain on awning (continuous); chair-scrape on wet stone (4.0); deck-cut crisp paper-flick (6.0).
- **VO:** *(none.)*

**Clip 2 — `degen_sits` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Degen now seated in the previously-empty chair, three-quarter view: blue-skinned bald male, pointed ears, amber eyes, tribal tattoos visible on neck, olive military vest. He's just finished a riffle-shuffle — three aces clearly visible in the mid-shuffle freeze on his right hand. Magenta sign reflects on the wet table.
- **VEO 3.1 motion (8 s):** Camera locked, low table-level. Second 1: he sits — chair shifts, weight settles. Second 2: hands take the deck. Second 3: full riffle-shuffle (`vfx_card_materialise_magenta` 0.3 trailing the riffle). Second 5: three aces visible mid-shuffle (single hard freeze-stamp). Second 6: shuffle resolves. Second 6.5: VO. Second 8: hold.
- **SFX:** chair-creak (1.0); deck-flutter through fingers (3.0–5.5); three aces snap-tone, one per ace (3.5, 4.0, 4.5); breath-laugh (6.5 under VO).
- **VO:** *"Bet everything. House doesn't, but I do."* (6.5–7.8 s, casino-radio baritone, loose.)

**Clip 3 — `tableau_lock_degen` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide two-shot — the player now sits in the previously-empty chair across from Degen, shoulder + deck visible right-foreground. Degen centre, deck set face-down on the table, palms flat beside it, looking up at the player for the first time. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 2 m → 6 m revealing player's chair-arrival. Second 3: Degen sets the deck face-down. Second 5: hands flat beside the deck. Second 6: eyes lift to camera. Final 2 s: locked.
- **SFX:** deck-set on wet table (3.0); rain-continuous; HUD chime (8.0).
- **VO:** *(none.)*

---

### §A.12 Arena ch10 "The Panoptic Warden" — Warden (Foucault)
**Length:** 24 s | **Faction:** Panopticon, steel + brass
**Arena:** Watcher-Panopticon centre — hundred surveillance eyes ringing the ceiling
**Mood:** Chrome jaw reflects an 11-year-old's smile, frozen.

**Clip 1 — `arena_establish_watcher_centre` (0–8 s)**
- **Nano Banana — START frame:** Wide low-angle on a circular chamber. Ceiling lined with one hundred surveillance-eye lenses ringed around a central oculus. Floor is brass tile-work. No figure. Eyes all closed (dark).
- **Nano Banana — END frame:** Same composition — every eye now open and rotating slowly in unison, all locked on the centre of the room. Chamber brighter.
- **VEO 3.1 motion (8 s):** Camera locked low-angle. Second 1: a single eye opens centre-ceiling. Second 2–5: the rest open in a spiral pattern. Second 6: all hundred rotate in unison, locking on the centre point. Second 8: hold (`vfx_witnessing_pulse` 0.4 ping at 6.0).
- **SFX:** soft ambient hum (continuous); single shutter-click per eye opening (1.0–5.0, cascading); unison rotation low whirr (6.0).
- **VO:** *(none.)*

**Clip 2 — `warden_descends` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Warden now stands centre-floor, three-quarter pose: chrome-jaw plating (gleaming, an 11-year-old's smile reflected in the metal as a chromatic ghost — `vfx_palimpsest_chromatic` 0.3), tactical coat, brass-accented surveillance-eye augments at his temples. Hands at his sides. The hundred eyes overhead are all locked on him.
- **VEO 3.1 motion (8 s):** Camera locked low-angle. Second 1: he descends slowly from above frame (cable-mechanism implied, no rope visible). Second 4: weight settles on floor — brass-tile clang. Second 5: he straightens, jaw catches the overhead light. Second 6: the chromatic ghost-smile flashes in his chrome jaw for half a second. Second 6.5: VO. Second 8: hold.
- **SFX:** mechanical descent winch (1.0–3.5); brass-tile impact (4.0); jaw-hum subharmonic (5.0); ghost-smile chromatic shimmer-tone (6.0); breath through chrome jaw, warm (6.5 under VO).
- **VO:** *"You used to laugh like that."* (6.5–7.8 s, brass-warm baritone, guilt-soft.)

**Clip 3 — `tableau_lock_warden` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide two-shot. Player right-foreground, deck-edge visible. Warden centre, brass-accented stance, hands open at his sides, jaw still humming. The hundred overhead eyes have shifted half a degree to track the player as well — both fighters watched. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 3 m → 7 m. Second 3: every eye overhead rotates a half-degree to include the player. Second 5: Warden's hands open at sides — no weapon, but the chrome jaw hums brighter. Final 2 s: locked.
- **SFX:** hundred-eyes half-degree whirr (3.0); jaw-hum brighter (5.0); HUD chime (8.0).
- **VO:** *(none.)*

---

### §A.13 Arena ch11 "The Harvester's Reckoning" — Collector
**Length:** 24 s | **Faction:** Architect, void-black + Authority-red (with greenish under-light from jars)
**Arena:** Architect-throne catalog hall — hundred glass jars on shelves, dim red under-light
**Mood:** You're already on a shelf. Just not yet.

**Clip 1 — `arena_establish_catalog` (0–8 s)**
- **Nano Banana — START frame:** Long catalog-hall, shelves floor-to-ceiling on both sides, hundreds of small glass jars on the shelves. Each jar contains a faint glowing strand — a memory. Greenish under-light from beneath the shelves. Dim red overhead. No figure.
- **Nano Banana — END frame:** Same composition — one jar centre-frame on the middle shelf is now cracking, hairline fracture, with a single helix-strand of light beginning to leak (`vfx_collector_dna_helix` 0.3) into the air.
- **VEO 3.1 motion (8 s):** Slow push-in 8 m → 5 m down the aisle. Second 2: jars glow softly. Second 4: centre-jar develops a hairline crack. Second 6: helix-strand begins to leak. Second 8: hold.
- **SFX:** room-tone glass-quiet (continuous); jar-resonance hum (continuous); single crack-tone (4.0); helix-leak ethereal whisper (6.0–8.0).
- **VO:** *(none.)*

**Clip 2 — `collector_emerges` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Collector centre-frame, three-quarter pose, at 4 m: hooded figure, dark robes, hood shadow hides face, two red glowing eye-points pierce the shadow, red-glowing claw-fingers extended. He has just caught the escaping helix-strand mid-air in his right claw. Cracked jar still on the shelf behind him.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: shadow forms in the aisle behind the cracked jar. Second 2: Collector resolves from the shadow, hooded silhouette. Second 4: red eyes ignite in the hood-shadow. Second 5: claws extend. Second 6: he catches the helix-strand mid-air in one motion. Second 6.5: VO. Second 8: hold (`vfx_collector_dna_helix` 0.6).
- **SFX:** robes-rustle (2.0); red-eye ignition low pulse (4.0); claws-extend metal-on-leather (5.0); helix-catch snap (6.0); layered alto+baritone breath (6.5 under VO, 12 ms delay between layers).
- **VO:** *"You're already on a shelf. Just not yet."* (6.5–7.8 s, genderless, dual-layered alto+baritone, museum-placard tone.)

**Clip 3 — `tableau_lock_collector` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide two-shot. Player right-foreground, deck-edge visible. Collector centre, helix-strand now coiled around his closed right fist, claws relaxed, red eyes still locked on camera. Behind him, all hundred jars have lit at once, the hall now glowing dim red. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 4 m → 8 m. Second 2: helix coils around his closed fist. Second 4: all hundred jars on the shelves light at once (cascading, fast). Second 6: he steps forward one pace, claws relax. Final 2 s: locked.
- **SFX:** helix-coil low resonance (2.0); hundred jars igniting cascade (4.0–4.5); step on stone (6.0); HUD chime (8.0).
- **VO:** *(none.)*

---

### §A.14 Arena ch12 "The Architect's Design" — Architect
**Length:** 24 s | **Faction:** Architect, void-black + Authority-red
**Arena:** Architect-throne — recursive geometry, lattice patterns rotating slowly
**Mood:** You were always going to be here.

**Clip 1 — `arena_establish_architect_throne` (0–8 s)**
- **Nano Banana — START frame:** A vast void-black chamber. Recursive geometry rotating slowly in the deep background (rings within rings, impossible angles, `vfx_authority_lattice` 0.4). A throne centre, but the throne is not seated on the floor — it floats. Empty. Red lattice-veins crawl along the floor radiating from the throne's base.
- **Nano Banana — END frame:** Same composition — recursive geometry has rotated forward, becoming clearer. Red lattice-veins thicker on the floor. The throne is beginning to dissolve — its arms and back are visibly losing definition.
- **VEO 3.1 motion (8 s):** Slow push-in 12 m → 8 m. Second 1: lattice-veins pulse (`vfx_authority_lattice` 0.5). Second 3: recursive geometry rotates forward. Second 5: throne's outline begins to dissolve at the edges. Second 7: throne half-gone. Second 8: hold.
- **SFX:** deep subharmonic drone (continuous, –12 dB, lower than any other arena); lattice-pulse per second-tick (1.0, 2.0, 3.0...); throne-dissolution crystalline crackle (5.0–8.0).
- **VO:** *(none.)*

**Clip 2 — `architect_emerges` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** The Architect now stands where the throne was — but he isn't on a throne, he *is* a throne. His body is composed of the same recursive lattice geometry as the chamber, void-black with Authority-red lattice-veins running through it. Vaguely humanoid silhouette. No face — where the face should be, there's just deeper recursion.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: throne finishes dissolving into pure lattice. Second 3: lattice-fragments contract toward a central point. Second 5: silhouette resolves — Architect formed *as* the throne, not seated on it. Second 6.5: VO. Second 8: hold.
- **SFX:** throne-dissolution finishing crackle (1.0–3.0); lattice-contraction low resonance (3.0–5.0); choir-tone (single sustained note, three voices layered) (5.0 onward); breath-equivalent — a hollow inhalation through the geometry itself (6.5 under VO).
- **VO:** *"You were always going to be here."* (6.5–7.8 s, three-layer choir voice — bass, baritone, alto stacked, no individual voice dominant.)

**Clip 3 — `tableau_lock_architect` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide two-shot. Player right-foreground, deck-edge visible. Architect centre, no stance change — he has not moved — but Authority-red lattice now frames the entire screen edge, locking the frame as part of his geometry. First frame of gameplay. The frame itself feels like part of his body.
- **VEO 3.1 motion (8 s):** Slow pull-back 5 m → 9 m. Second 3: red lattice begins climbing the frame edges. Second 6: lattice locks at all four corners of the screen (`vfx_authority_lattice` 0.7). Final 2 s: locked, lattice continues to pulse slowly.
- **SFX:** lattice-climb low ascending tone (3.0–6.0); lattice-lock at corners snap-tone ×4 (6.0); subharmonic drone continuous; HUD chime (8.0).
- **VO:** *(none.)*

---

## §B — TCG main ladder (anime-card mode, 15 fights)

---

### §B.1 TCG ch1 "The Dead Signal" — Agent Zero
**Length:** 16 s (2×8 s) | **Faction palette:** Insurgency, steel + magenta-violet
**Arena:** Quiet low-light interior — Insurgency safehouse, deck visible on her holster
**Mood:** Quiet hand. Loud round.

**Clip 1 — `agent_zero_card_draw` (0–8 s)**
- **Nano Banana — START frame:** Three-quarter view of Agent Zero, seated low on a crate, head down, violet hood up, dark room with one cold key-light from upper-left. Right hand resting on her deck-holster at left hip. No card visible yet. Magenta-violet rim along her jaw.
- **Nano Banana — END frame:** She has drawn three cards from the holster, fanned in her left hand, deck-back violet edge-glowing (`vfx_card_materialise_violet` 0.5). Right hand has moved to her hood-edge. Head still mostly down — amber eyes barely visible under the hood-shadow.
- **VEO 3.1 motion (8 s):** Camera locked at 3 m, three-quarter angle. Second 1: right hand moves to holster. Second 2–4: three cards draw one at a time, violet edge-glow trailing each draw (`vfx_card_materialise_violet` 0.5 per card). Second 5: cards settle into a fan in left hand. Second 6: right hand rises to hood-edge. Second 8: hold.
- **SFX:** quiet cloth shift (1.0); card-draw paper-flick ×3 (2.0, 3.0, 4.0); violet-glow soft electric chime per draw; hood-fabric brush (6.0).
- **VO:** *(none.)*

**Clip 2 — `agent_zero_card_lock` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Agent Zero centred, three-quarter view, hood now half-down, amber eyes fully open and visible. Three cards still fanned in left hand, held forward at chest-height like a guard. Right hand at her side. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: right hand pushes hood back to half-down. Second 3: head lifts, amber eyes open. Second 5: left hand raises the card-fan to chest-height, forward toward camera. Second 6: VO. Second 8: hold.
- **SFX:** hood-fabric slide (1.0); breath-out short (3.0); card-fan riffle on rise (5.0); HUD chime (8.0).
- **VO:** *"Quiet hand. Loud round."* (6.0–7.5 s, smoky-contralto, conversational.)

---

### §B.2 TCG ch2 "The Arena's Law" — Jailer
**Length:** 16 s (2×8 s) | **Faction palette:** Panopticon, steel + brass
**Arena:** Brass-key Panopticon office — small, intimate, just him and a key-ring
**Mood:** One of these unlocks your turn. Guess wrong.

**Clip 1 — `jailer_keyring_morph` (0–8 s)**
- **Nano Banana — START frame:** Tight on Jailer's chrome-mask, three-quarter view, mask-slit dim. Black-iron key-ring at hip-height in foreground, brass keys visible, no cards yet. Soft steel-grey light, brass accent on the keys.
- **Nano Banana — END frame:** Same composition — but each brass key has transformed into a brass-edged card, hanging from the same key-ring loops. Five keys, five cards. Mask-slit still dim.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1–5: keys morph into cards one at a time — single hard transform per second, brass edge-glow flicker (`vfx_card_materialise_brass` 0.4 per morph). Second 6: all five cards hang, gently swaying. Second 8: hold.
- **SFX:** quiet brass-jingle (continuous low); morph-tone per key ×5 (1.0, 2.0, 3.0, 4.0, 5.0); card-paper settle (6.0).
- **VO:** *(none.)*

**Clip 2 — `jailer_card_offer` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Jailer centred at 3 m, three-quarter view. He has lifted the key-ring up to chest-height. The five cards hang from it in a fan-spread, mask-slit now pulsing brighter, gloved fingers gripping the ring. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 2 m → 4 m. Second 2: gloved hand grasps key-ring at hip. Second 4: ring lifts to chest, cards fan-spread. Second 5.5: mask-slit pulses (`vfx_witnessing_pulse` 0.4). Second 6: VO. Second 8: hold.
- **SFX:** ring-lift chain-jingle (2.0); card-fan-spread paper-flick (4.0); mask-pulse subharmonic (5.5); HUD chime (8.0).
- **VO:** *"One of these unlocks your turn. Guess wrong."* (6.0–7.8 s, genderless hoarse-bass.)

---

### §B.3 TCG ch3a "The General's Honor" — Iron Lion
**Length:** 16 s (2×8 s) | **Faction palette:** Insurgency, steel + hot-orange
**Arena:** Crucible armoury — racked banners, lion-crest deck-backs visible
**Mood:** Forward order. Cards march first.

**Clip 1 — `iron_lion_card_formation` (0–8 s)**
- **Nano Banana — START frame:** Iron Lion centred at 3 m, three-quarter pose, armoury setting behind. Hands at sides, no cards yet. Hot-orange torch-light from upper-right.
- **Nano Banana — END frame:** Four cards have arranged themselves in a single-row parade-formation floating in front of him at waist-height, lion-crest deck-backs, hot-orange edges glowing (`vfx_card_materialise_amber` 0.5). His right fist is mid-rise to chest in salute.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: cards materialise one at a time from his left side moving right (`vfx_card_materialise_amber` 0.5 per card), forming a parade-row. Second 2–5: one card per second (4 total). Second 6: cards lock in place, glowing in unison. Second 7: right fist begins to rise. Second 8: hold.
- **SFX:** servo-whine + card-snap per materialise ×4 (2.0, 3.0, 4.0, 5.0); unison-glow chord (6.0); leather-creak on fist-rise (7.0).
- **VO:** *(none.)*

**Clip 2 — `iron_lion_card_salute` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Iron Lion centred, fist at chest in full salute, head tilted slightly up. The four cards have collapsed into a fan in his left hand, held forward at waist-guard. Hot-orange edge-glow stronger. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: fist completes the rise to chest. Second 3: cards snap from parade-row into a fan in his left hand (single hard snap-frame). Second 4: head tilts up. Second 5.5: VO. Second 8: hold.
- **SFX:** fist-to-chest leather thud (1.0); card-formation-to-fan snap (3.0); breath-in measured (5.0); HUD chime (8.0).
- **VO:** *"Forward order. Cards march first."* (5.5–7.0 s, parade-ground baritone.)

---

### §B.4 TCG ch3b "Ghost's Gambit" — Wraith Calder
**Length:** 16 s (2×8 s) | **Faction palette:** Insurgency, steel + magenta-violet
**Arena:** Sanctum interior — seven candles, seven-card orbit
**Mood:** Six are spent. The seventh is for you.

**Clip 1 — `calder_seven_card_orbit` (0–8 s)**
- **Nano Banana — START frame:** Wraith Calder centred at 3 m, three-quarter pose, sanctum interior with seven candles arranged in semicircle behind him. Hands at sides, palms slightly forward. No cards yet. Amber rim from his eyes catching his jawline.
- **Nano Banana — END frame:** Seven cards now orbit his chest at slow rotation, amber rim along each card-edge (`vfx_card_materialise_amber` 0.4). Six of the cards show wear/burn marks; the seventh is pristine. His hands haven't moved.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: amber pinpoints brighten in his eyes. Second 2–5: cards materialise into orbit one at a time, all amber-edged, each fading in slightly from his chest outward (one card per ~0.7 s, 7 total). Second 6: orbit settles into slow rotation around his chest at neck-height. Second 8: hold.
- **SFX:** low heart-thud (continuous, soft); card-materialise per card ×7 (2.0–5.5, slight pitch ascent); orbit-rotation low resonance (6.0).
- **VO:** *(none.)*

**Clip 2 — `calder_seventh_card` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Six of the seven cards have burnt to ash mid-orbit, ash dropping. The seventh card (the pristine one) has separated from the orbit and floats in his right palm. His left hand is open at his side. Amber eyes locked on camera. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1–3: six cards burn one at a time in sequence (each one a single flash, ash-fall — `vfx_amber_runes` 0.4 per burn). Second 4: seventh card separates from the orbit-position, floats to his right palm. Second 5: he closes his hand half-around it. Second 6: VO. Second 8: hold.
- **SFX:** burn-flash ×6 (1.0, 1.5, 2.0, 2.5, 3.0, 3.5); ash-fall continuous low after each burn; card-settle-into-palm soft thud (4.5); breath-out calm (6.0 under VO).
- **VO:** *"Six are spent. The seventh is for you."* (6.0–7.8 s, calm-commanding-alto.)

---

### §B.5 TCG ch5 "Dead Code Rising" — Necromancer
**Length:** 16 s (2×8 s) | **Faction palette:** Architect, void-black + Authority-red
**Arena:** Necromancer-Castle throne-hall — basalt pillars, sigil-orbit
**Mood:** A conductor at the podium. The orchestra is your dead.

**Clip 1 — `necromancer_summon` (0–8 s)**
- **Nano Banana — START frame:** Throne hall in cold blue-black. Black basalt throne centre, empty. Eight red sigils orbit the throne at chest-height. Ground fog ankle-height. A single black tarot-card lies face-down on the bottom step.
- **Nano Banana — END frame:** Necromancer seated on throne, three-quarter pose: elf-like ears, white spiky hair, red-tinted glasses, black coat with red-lined collar. Right hand palm-up at chest, eight red sigils now condensed into eight tarot-cards orbiting his palm, edges blazing red. Step-card has joined the orbit. Eyes closed, faint smile.
- **VEO 3.1 motion (8 s):** Slow push-in 8 m → 4 m on empty throne. Second 1: ash particles thicken. Second 2.5: sigils condense from rings into eight orbiting cards (`vfx_card_materialise_red` 0.6), one beat per tick across 2.5–4.5. Second 5: Necromancer fades into the throne from below (body composes smoke-up, feet form last). Second 6: palm rises, orbit shifts from throne to his hand. Second 7.5: small smile, eyes closed. No mouth motion.
- **SFX:** low subharmonic drone (continuous, –18 dB); bell-tone per sigil-tick ×8 (2.5–4.5); cloth-settle (5.0); inhale through closed lips (7.5).
- **VO:** *(none.)*

**Clip 2 — `necromancer_stance_lock` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Wider two-shot. Player left shoulder + fanned deck visible right-foreground, deck-edge glowing cyan rim. Necromancer mid-frame on throne, eight cards in a fan in his left hand, right hand extended palm-out toward camera — cards face away from player. Eyes open behind glasses. Red smoke waist-height. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 4 m → 7 m, revealing player. Second 1: orbit collapses into a fan in left hand (`vfx_card_materialise_red` 0.4). Second 3: eyes open behind red glasses. Second 4: right hand extends palm-out, formal "your move" gesture. Second 5.5: VO. Second 7: lock, smoke + sigil-rotation continue ambient.
- **SFX:** card-fan riffle (1.0); silk-rustle coat-sleeve (3.5); ambient sigil-hum (continuous); player-side card-tap (7.8 cue gameplay).
- **VO:** *"Play. I'm patient — I have all your turns."* (5.5–7.0 s, wet-tenor, trails into half-laugh.)

---

### §B.6 TCG ch6 "The False Prophet" — White Oracle
**Length:** 16 s (2×8 s) | **Faction palette:** Thought Virus, dark + magenta + violet bleed
**Arena:** Mirror-grove in Thaloria canopy — pink chromatic glitch on every edge
**Mood:** Your deck. My round.

**Clip 1 — `oracle_steals_deck` (0–8 s)**
- **Nano Banana — START frame:** Centred on White Oracle, three-quarter view, canopy-light behind her. Her face is the player's face, almost right. Empty hands at her sides. Pink chromatic halo faint around her silhouette (`vfx_palimpsest_chromatic` 0.3).
- **Nano Banana — END frame:** The player's own deck-back has materialised in her right hand — same colour, same pattern as the player's deck, but with pink chromatic aberration along every edge (`vfx_palimpsest_chromatic` 0.6). She holds it casually, looking down at it as if it had always been hers.
- **VEO 3.1 motion (8 s):** Camera locked at 3 m. Second 1: faint pink halo intensifies. Second 3: chromatic aberration distorts the air around her right hand. Second 4: the player's deck materialises in her right hand — single hard appear-frame (`vfx_palimpsest_chromatic` 0.7 spike). Second 5: she looks down at the deck. Second 6: faint asymmetric smile. Second 8: hold.
- **SFX:** chromatic shimmer-tone (continuous, rising in pitch 3.0–4.0); deck-appear soft pop (4.0); player's own breath audible (the wrong direction — coming from her) (6.0).
- **VO:** *(none.)*

**Clip 2 — `oracle_card_fan` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Oracle centred, three-quarter view. The stolen deck has fanned in her left hand, five cards visible, pink chromatic edges. Right hand at her side. Asymmetric smile (player's smile, 5% wrong). Eyes mismatched amber/violet. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: deck transfers from right hand to left in a single hand-swap. Second 3: cards fan in left hand, chromatic edges (`vfx_palimpsest_chromatic` 0.5). Second 5: she looks up at camera, smile asymmetric. Second 6: VO. Second 8: hold.
- **SFX:** deck hand-swap soft thwap (1.0); card-fan riffle with chromatic flutter (3.0); smile-soft exhale (5.0 under VO setup); HUD chime (8.0).
- **VO:** *"Your deck. My round."* (6.0–7.0 s, player-voice clone with pink chromatic aberration on consonants.)

---

### §B.7 TCG ch7 "Project Vector" — Warlord (Vox → Warlord)
**Length:** 16 s (2×8 s) | **Faction palette:** Thought Virus, dark + magenta
**Arena:** Terminus lab console — green nanobot-tank rim, pink glitch overlay
**Mood:** The doctor was the deck. I'm the draw.

**Clip 1 — `vox_holds_deck` (0–8 s)**
- **Nano Banana — START frame:** Dr. Vox centred at 3 m, three-quarter view, console behind him with scrolling green glyphs. He holds a deck face-down in his right hand, deck-back showing lab-glyphs in green. Glasses catch the console-glow. Lab-coat sleeves green-glow at the cuffs.
- **Nano Banana — END frame:** Same composition — but the deck-back glyphs have shifted from green lab-glyphs to a nanobot-spiral pattern in magenta. The deck-back has changed mid-shot. Glasses still on Vox. Lab-coat sleeves now magenta-glowing at the cuffs.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: console glyphs scroll faster. Second 3: deck-back glyphs glitch (`vfx_meme_static` 0.3 over the deck only). Second 5: deck-back pattern fully transitions from green-lab to magenta-spiral. Second 6: sleeve-glow also transitions green → magenta. Second 8: hold.
- **SFX:** console keyboard ticks (continuous low); glitch-static on deck (3.0); nanobot-resonance hum rising (5.0); coat-fabric shimmer (6.0).
- **VO:** *(none.)*

**Clip 2 — `warlord_takes_draw` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Warlord centred where Vox was, deck still in her right hand, but face glitched-changed: platinum blonde, face tattoos, green eyes, yellow hood half-down. Gold sparks at jacket-hem. Five cards fanned in her left hand drawn from the now-magenta deck. Lab-coat puddled on the floor at her feet. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: Vox begins to turn — single hard glitch-cut at second 2 (`vfx_meme_static` 0.6), face replaces with Warlord mid-turn. Second 3: body continues turn, lab-coat slides off shoulders. Second 4: she draws five cards from the deck in one motion (`vfx_card_materialise_magenta` 0.5 trailing the draw). Second 5: cards fan in left hand. Second 6.5: VO. Second 8: hold.
- **SFX:** glitch-cut crackle (2.0); lab-coat fabric-fall (3.0); card-draw with magenta-snap ×5 (4.0–4.5); gold-spark hem flicker (5.5); breath-out hardcore-alto (6.5 under VO).
- **VO:** *"The doctor was the deck. I'm the draw."* (6.5–7.8 s, hardcore-alto, drops consonants.)

---

### §B.8 TCG ch9a "The Unknown Variable" — Enigma
**Length:** 16 s (2×8 s) | **Faction palette:** Insurgency, steel + brass + chalk-glow
**Arena:** Equation-walls chamber — chalk-light dominant
**Mood:** Solved. Begin.

**Clip 1 — `enigma_proof_tree` (0–8 s)**
- **Nano Banana — START frame:** Enigma centred at 3 m, three-quarter view. Both hands raised slightly, palms forward. No cards yet. Walls behind her covered in slow-writing equations (`vfx_amber_runes` 0.4). Navy trench-coat, gold buttons catching chalk-glow.
- **Nano Banana — END frame:** Cards have arranged themselves in the air in front of her in a proof-tree pattern — a branching diagram, eight cards in two tiers (four top, four bottom, connected by faint amber lines). Hands still palms-forward. Eyes closed.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: walls scribble faster. Second 2: cards materialise one at a time into the proof-tree positions, top tier first then bottom (`vfx_card_materialise_amber` 0.4 per card). Second 6: amber lines connect the cards, completing the proof-tree. Second 7: lines glow brighter. Second 8: hold.
- **SFX:** chalk-scrape continuous; card-materialise per card ×8 (2.0–5.5); proof-tree connection chord (6.0–7.0).
- **VO:** *(none.)*

**Clip 2 — `enigma_proof_collapse` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Proof-tree has collapsed — the eight cards have snapped into a fan in Enigma's right hand. Left hand now at her side. Walls behind her have frozen mid-equation. Eyes open, locked on camera. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: amber connection-lines retract. Second 2: cards collapse into right-hand fan — single hard snap. Second 3: walls freeze mid-equation. Second 5: eyes open. Second 6: VO. Second 8: hold.
- **SFX:** connection-line retract shimmer (1.0); card-collapse snap (2.0); wall-freeze tick (3.0); eyes-open subtle blink (5.0); HUD chime (8.0).
- **VO:** *"Solved. Begin."* (6.0–7.0 s, low-velvet contralto, two-word command.)

---

### §B.9 TCG ch9b "The Gambler's Truth" — Degen
**Length:** 16 s (2×8 s) | **Faction palette:** New Babylon, indigo-black + magenta (no cyan)
**Arena:** Casino table under magenta sign — wet table, rain ambient
**Mood:** You're on the house tonight.

**Clip 1 — `degen_riffle_shuffle` (0–8 s)**
- **Nano Banana — START frame:** Close-up on Degen's hands holding a deck, table-level shot. Deck in both hands at riffle-position. Magenta sign-glow on his blue-skinned knuckles. Tribal tattoos on the back of his right hand. No cards visible yet beyond the deck.
- **Nano Banana — END frame:** Mid-riffle freeze — three magenta-glowing aces visible spread out of the riffle (`vfx_card_materialise_magenta` 0.5 on each ace), distinctly outlined. Rest of the deck blurred mid-motion.
- **VEO 3.1 motion (8 s):** Camera locked low table-level. Second 1: hands begin riffle-shuffle (`vfx_card_materialise_magenta` 0.3 trailing). Second 3: three aces snap-flash one at a time in mid-shuffle, each visible for half a second (3.0, 3.7, 4.4). Second 5: riffle continues. Second 6: three aces vanish back into the deck (single magenta-flash at 6.0). Second 8: hold.
- **SFX:** deck-flutter through fingers continuous; ace-snap tone ×3 (3.0, 3.7, 4.4); rain on awning (continuous ambient); aces-vanish soft pop (6.0).
- **VO:** *(none.)*

**Clip 2 — `degen_deck_set` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Pull-back to medium shot. Degen seated across the wet table, both hands flat beside the now-set deck (face-down). Magenta sign-glow on his face. Grinning, looking up at camera. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 1 m → 3 m revealing Degen's seat and the wet table. Second 2: he sets the deck face-down. Second 3: both palms settle flat beside the deck. Second 5: he looks up, grinning. Second 6: VO. Second 8: hold.
- **SFX:** deck-set on wet table (2.0); palm-flat tap ×2 (3.0); rain continuous; breath-laugh under (6.0 under VO).
- **VO:** *"You're on the house tonight."* (6.0–7.2 s, casino-radio baritone, loose-friendly.)

---

### §B.10 TCG ch10 "The Panoptic Warden" — Warden
**Length:** 16 s (2×8 s) | **Faction palette:** Panopticon, steel + brass
**Arena:** Watcher-Panopticon central terminal — brass-bracket card-holder forearm-mounted
**Mood:** I've read this hand before.

**Clip 1 — `warden_card_locks` (0–8 s)**
- **Nano Banana — START frame:** Warden centred at 3 m, three-quarter view. Right forearm extended, palm-down, revealing a chrome-bracket card-holder mounted on the forearm (brass detailing). Holder is empty. Chrome jaw catches light. Tactical coat.
- **Nano Banana — END frame:** Five cards have locked into the forearm-bracket one at a time, brass-pin clicks visible on each card-edge. Bracket fully loaded. Chrome jaw still catching light. Hundred surveillance-eyes faint behind him.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: forearm raises into frame, palm-down. Second 2–6: cards materialise and lock into the bracket one per second, each with a brass-pin click (`vfx_card_materialise_brass` 0.4 per lock). Second 7: bracket full, brass-pin synchro-glow. Second 8: hold.
- **SFX:** servo-whine on forearm-raise (1.0); card-lock brass-click ×5 (2.0, 3.0, 4.0, 5.0, 6.0); synchro-glow chord (7.0).
- **VO:** *(none.)*

**Clip 2 — `warden_jaw_reflection` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Close on Warden's chrome jaw and the forearm-bracket. The jaw is angled to catch the bracket's reflection — and reflected in the chrome are the five card-faces (Warden can see what the player will draw). Brass-glow stronger. First frame of gameplay (slight pull-back at the end to reveal player-deck right-foreground).
- **VEO 3.1 motion (8 s):** Slow push-in 3 m → 1.5 m on chrome jaw. Second 2: jaw angles to catch the bracket reflection. Second 4: card-face reflections appear in the chrome (single hard reveal-frame). Second 5: jaw hums brighter. Second 6: VO. Second 7: pull-back begins to widen frame for player-deck. Second 8: hold.
- **SFX:** jaw-servo angle adjust (2.0); reflection-reveal shimmer (4.0); jaw-hum subharmonic (5.0); HUD chime (8.0).
- **VO:** *"I've read this hand before."* (6.0–7.5 s, brass-warm baritone, guilt-soft.)

---

### §B.11 TCG ch11 "The Harvester's Reckoning" — Collector
**Length:** 24 s (3×8 s — boss-chain) | **Faction palette:** Architect, void-black + Authority-red + greenish jar-light
**Arena:** Catalog-hall — jars on shelves, each holds a card
**Mood:** Every card you played, I kept.

**Clip 1 — `collector_jar_shelves` (0–8 s)**
- **Nano Banana — START frame:** Slow tracking shot perspective down a catalog-hall aisle. Shelves on both sides packed with glass jars. Each jar contains a single card suspended inside in a faint glow. Greenish under-light, dim red overhead. No figure.
- **Nano Banana — END frame:** Same composition — one jar mid-aisle, middle shelf, has developed a hairline fracture and is glowing brighter than the others. The card inside is rotating.
- **VEO 3.1 motion (8 s):** Slow push-in 8 m → 5 m down the aisle. Second 2: jars softly hum. Second 4: one jar centre-aisle middle-shelf cracks audibly. Second 6: card inside the cracked jar begins to rotate. Second 8: hold.
- **SFX:** glass-hum continuous; jar-crack soft pop (4.0); card-rotate paper-whisper (6.0).
- **VO:** *(none.)*

**Clip 2 — `collector_catches_card` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Collector now stands centre-aisle at 4 m, three-quarter view, hooded silhouette, red eye-points in hood-shadow, red claws extended. He has caught the helix-card mid-escape in his right claw — the card itself is held but distorted (`vfx_collector_dna_helix` 0.6 wrapping the card).
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: jar fractures fully, card escapes through the crack. Second 2: Collector resolves from the shadow behind the jar. Second 3: red eyes ignite. Second 4: claws extend. Second 5: he catches the escaped card mid-air (single snap-frame). Second 6.5: VO. Second 8: hold.
- **SFX:** glass shatter (1.0); robes-rustle (2.0); eye-ignite low pulse (3.0); claws-extend metal-on-leather (4.0); card-catch snap (5.0); layered alto+baritone breath (6.5 under VO).
- **VO:** *(none — saved for Clip 3.)*

**Clip 3 — `collector_card_slot_in` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide pull-back. Player right-foreground, deck-edge visible. Collector centre, the helix-card now slotted into a fan of cards in his left hand (the fan is composed of cards from other jars, each still glowing faintly). Right claw at his side. Behind him every jar on the shelves has lit at once. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 4 m → 8 m. Second 1: he slots the caught card into a fan in his left hand. Second 3: all hundred jars on the shelves ignite in unison cascade (`vfx_collector_dna_helix` 0.4 each, very brief). Second 5: VO. Second 6: he steps forward one pace. Final 2 s: locked.
- **SFX:** card-slot soft thunk (1.0); hundred-jar cascade ignition (3.0–3.5); step on stone (6.0); HUD chime (8.0).
- **VO:** *"Every card you played, I kept."* (5.0–6.8 s, dual-layered alto+baritone, museum-placard tone.)

---

### §B.12 TCG ch_seer_visit "The Seer" — Seer
**Length:** 16 s (2×8 s) | **Faction palette:** Dreamer, iridescent black + iris-cyan
**Arena:** Temple-sanctum — sacred-space, white feathers drifting
**Mood:** This card. You always play this card.

**Clip 1 — `seer_feather_cards` (0–8 s)**
- **Nano Banana — START frame:** Seer centred at 3 m, three-quarter view, dark sanctum behind her. Blue-skinned female angel, black hair, amber eyes, dark robes, white wings folded behind her. Right palm open at chest-height, empty. White feathers drifting in slow motion in the air (`vfx_seer_white_feathers` 0.5).
- **Nano Banana — END frame:** White feathers around her have transformed into white-edged cards mid-fall — eight cards drifting down at the same slow-feather pace, iris-cyan rims on the card-edges. Two cards have already landed on her right palm, stacked.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: feathers drift down in slow-fall. Second 2: feathers transform one-by-one into cards as they pass eye-level (`vfx_seer_white_feathers` 0.6 with cyan-card transition tone, one per second). Second 5: first card lands on her palm. Second 6: second card lands. Second 8: hold, more cards still drifting.
- **SFX:** room-tone reverent (continuous); feather-transition shimmer-tone per feather ×8 (1.0–7.0); palm-card landing soft tap ×2 (5.0, 6.0).
- **VO:** *(none.)*

**Clip 2 — `seer_one_card` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Close on Seer's right palm — a single card now rests on it, face-up. The other cards have continued to drift but landed elsewhere on the floor around her feet. The single palm-card faces camera — it is the *exact* card the player is most likely to open with (boss-encounter "prophecy mode" reveal). Third-eye tattoo glowing cyan on Seer's forehead. First frame of gameplay (pull-back at end).
- **VEO 3.1 motion (8 s):** Slow push-in 3 m → 1.5 m on palm. Second 1: other cards drift past frame. Second 3: only the palm-card remains in focus, face turning up. Second 4: third-eye tattoo ignites cyan (`vfx_witnessing_pulse` 0.5). Second 5: VO. Second 7: pull-back to reveal player-deck right-foreground. Second 8: hold.
- **SFX:** card-face-turn soft paper-pivot (3.0); third-eye ignition cyan-tone (4.0); reverent breath (5.0 under VO); HUD chime (8.0).
- **VO:** *"This card. You always play this card."* (5.0–7.0 s, choral-alto with overtone-humming layer.)

---

### §B.13 TCG ch_warlord_zero_first "Warlord Zero — Battle of Nexon" — Warlord Zero
**Length:** 24 s (3×8 s — boss-chain) | **Faction palette:** Insurgency, steel + hot-orange (with gold sparks)
**Arena:** Nexon ruins-arena — broken pillars, dust, gold-spark hem
**Mood:** Three of yours. Mine for the round.

**Clip 1 — `warlord_zero_arena` (0–8 s)**
- **Nano Banana — START frame:** Wide on a ruined arena, broken pillars in the background, dust in the air. No figure. Gold sparks drift across the frame (`vfx_warlord_gold_sparks` 0.4) without source.
- **Nano Banana — END frame:** Same composition — gold sparks have concentrated into a vague human silhouette mid-frame, hood-shape implied. Body not yet resolved.
- **VEO 3.1 motion (8 s):** Slow push-in 9 m → 6 m. Second 1: gold sparks drift heavier. Second 4: sparks begin to cluster into a column mid-frame. Second 6: column resolves into a hooded silhouette. Second 8: hold.
- **SFX:** wind across ruins (continuous); gold-spark crackle continuous low (`vfx_warlord_gold_sparks`); cluster-into-figure resonance rising (4.0–6.0).
- **VO:** *(none.)*

**Clip 2 — `warlord_zero_three_cards` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Warlord Zero now fully resolved at 4 m: young woman, platinum blonde, yellow hooded jacket (hood half-up), face tattoos, green eyes. Right hand extended forward, three cards locked under three of her fingers (index, middle, ring), card-faces toward camera. Gold sparks heavy at jacket-hem.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: silhouette resolves into Warlord Zero (cluster-to-figure complete). Second 3: she raises her right hand, palm-camera. Second 4: three cards materialise one at a time, each locking under a finger (`vfx_card_materialise_amber` 0.5 per card). Second 6: face tattoos glow once. Second 7: VO. Second 8: hold.
- **SFX:** silhouette-resolve subharmonic (1.0); hand-raise cloth-rustle (3.0); card-materialise per card ×3 (4.0, 4.5, 5.0); tattoo-glow tone (6.0); breath-out hardcore-alto (7.0 under VO).
- **VO:** *"Three of yours. Mine for the round."* (7.0–8.0 s, hardcore-alto.)

**Clip 3 — `warlord_zero_fist_close` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide pull-back. Player right-foreground, deck-edge visible. Warlord Zero centre, right fist now closed around the three cards (cards crushed into fist, gold sparks bursting around the knuckles). Left hand open at side. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Slow pull-back 4 m → 7 m. Second 2: fingers close around the three cards in a single motion. Second 3: gold sparks burst around the knuckles (`vfx_warlord_gold_sparks` 0.7). Second 5: fist held forward, sparks dying down. Final 2 s: locked.
- **SFX:** fist-close paper-crush (2.0); spark-burst crackle (3.0); HUD chime (8.0).
- **VO:** *(none.)*

---

### §B.14 TCG ch_programmer_gift "The Programmer" — Programmer
**Length:** 16 s (2×8 s) | **Faction palette:** Neutral, dark + green-glyph + brass-rim
**Arena:** Code-vault — server-temple, console-glow on her face
**Mood:** Take this one. I won't need it.

**Clip 1 — `programmer_compile_cards` (0–8 s)**
- **Nano Banana — START frame:** Programmer centred at 3 m, three-quarter view, code-vault behind her: server-stacks, green glyphs scrolling. She has a flat cap on, red steampunk goggles on her forehead (not over eyes yet), navy high-collar jacket. Both hands held forward, palms up, empty.
- **Nano Banana — END frame:** Cards have compiled out of green-glyph code into her palms — five cards stacked across both palms, deck-back showing slowly-resolving glyph-patterns (still mid-compile). Green compile-particles trailing each card (`vfx_digital_compile` 0.5).
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: green glyphs in the room stream toward her palms. Second 2–6: cards compile one at a time, each emerging from a column of green code (`vfx_digital_compile` 0.5 per card). Second 7: cards settle in palms, glyph-patterns finishing. Second 8: hold.
- **SFX:** console keyboard ticks continuous; compile-resolve per card ×5 (2.0, 3.0, 4.0, 5.0, 6.0); resolve-chord (7.0).
- **VO:** *(none.)*

**Clip 2 — `programmer_gift_card` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** Programmer centred, three-quarter view. She has pulled one card from the stack and turned it to face *away* from the camera (the player can see only the back — this is the gift, the deliberately-faced-away offering of §5.6 gift-mode). Other four cards remain in her left palm. Goggles now pulled down over eyes, red-glowing. First frame of gameplay.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: she takes one card from the stack into her right hand. Second 2: card turns to face *away* from camera (single hard turn-frame). Second 4: goggles slide down over eyes — red glow ignites. Second 5: she extends the away-facing card toward player-side (right-foreground). Second 6: VO. Second 8: hold.
- **SFX:** card-pluck (1.0); card-turn paper-whisper (2.0); goggle-slide mechanical click (4.0); goggle-glow electric hum (4.5); HUD chime (8.0).
- **VO:** *"Take this one. I won't need it."* (6.0–7.5 s, focused-tenor, patient, debug-cadence.)

---

### §B.15 TCG ch_authority_trial "The Authority's Trial" — Authority (CoNexus)
**Length:** 24 s (3×8 s — boss-chain, Act 1 finale) | **Faction palette:** Architect, void-black + Authority-red + teal-circuit
**Arena:** Judgment-chamber — void-black, teal circuit-patterns on the walls
**Mood:** Phase one. State your defence.

**Clip 1 — `authority_sphere_dim` (0–8 s)**
- **Nano Banana — START frame:** A vast void-black chamber. Centre: a dark sphere floating mid-frame at chest-height, teal circuit-patterns slow-pulsing across its surface. Energy rings around it, very faint. No cards yet. Walls in deeper darkness.
- **Nano Banana — END frame:** Same composition — sphere has dimmed to total black, teal circuits dark. Walls now visible: teal circuit-patterns crawling across them, energy-rings around the sphere brighter and starting to rotate.
- **VEO 3.1 motion (8 s):** Slow push-in 10 m → 7 m. Second 1: sphere pulses teal once. Second 3: sphere dims to total black. Second 5: walls illuminate with teal circuit-patterns crawling (`vfx_cyan_tessellation` 0.5). Second 7: energy-rings around sphere brighten and begin slow rotation. Second 8: hold.
- **SFX:** deep choir-drone (three voices layered, continuous); sphere-dim subharmonic (3.0); wall-circuit ignition tone (5.0); ring-rotation low resonance (7.0).
- **VO:** *(none.)*

**Clip 2 — `authority_card_lattice` (8–16 s)**
- **Nano Banana — START frame:** = Clip 1 END verbatim.
- **Nano Banana — END frame:** The sphere has ignited with teal + Authority-red lattice (`vfx_authority_lattice` 0.6). Ten cards orbit the sphere in a radial pattern (ten-phase trial, §5.8), each in a fixed equidistant position. Card-edges glow alternating teal and red. Energy-rings around the sphere now rapid rotation.
- **VEO 3.1 motion (8 s):** Camera locked. Second 1: sphere begins to glow teal again, brighter. Second 2: red lattice ignites *through* the teal (`vfx_authority_lattice` 0.7). Second 3: ten cards materialise in radial positions around the sphere one at a time (one per ~0.5 s, alternating teal/red edges — `vfx_card_materialise_cyan` 0.4 then `vfx_card_materialise_red` 0.4 alternating). Second 8: hold.
- **SFX:** sphere-ignite chord (1.0); lattice-ignite power-tone (2.0); card-materialise per card ×10 (3.0–7.5, alternating teal-snap / red-snap); ring-rotation continuous.
- **VO:** *(none.)*

**Clip 3 — `authority_verdict_lock` (16–24 s)**
- **Nano Banana — START frame:** = Clip 2 END verbatim.
- **Nano Banana — END frame:** Wide pull-back. Player right-foreground, deck-edge visible. Sphere centre at 7 m, the ten cards now locked in their radial orbit, lattice rigid. Authority-red lattice has climbed the screen-edges, framing the entire shot. First frame of gameplay — the frame itself is part of the trial-geometry.
- **VEO 3.1 motion (8 s):** Slow pull-back 7 m → 11 m. Second 2: red lattice begins climbing the screen-edges from the floor. Second 5: lattice locks at all four screen-corners (`vfx_authority_lattice` 0.8). Second 6: VO begins as the lattice ignites brighter. Final 2 s: locked, ring-rotation continues.
- **SFX:** lattice-climb ascending tone (2.0–5.0); lattice-corner-lock snap-tone ×4 (5.0); choir-drone continues (continuous); HUD chime (8.0).
- **VO:** *"Phase one. State your defence."* (6.0–7.8 s, three-voice choir layered — bass + baritone + alto in octaves.)

---

## §C — Tally & verification

- **§A entries:** 14 (Collector's Arena chapters 1–12, with 3a/3b branches)
- **§B entries:** 15 (TCG main-ladder gaps: 11 chapters + 4 specials)
- **Total entries:** 29
- **Total clips:** §A 14×3 = 42 + §B (12×2 + 3×3) = 33 → **75 clips**
- **Total runtime:** 75 × 8 s = **10 minutes 0 seconds** of cinematic content

**Chained-frame verification:** Every `END frame` block of clip N within a chain is reproduced verbatim as the `START frame` block of clip N+1 (look for `= Clip N END verbatim.`).

**No-music guarantee:** SFX blocks only. Music/score never appears as a directive.

**VO guarantee:** Each VO line is one sentence, ≤14 words, hard-synced to second-stamp during motion, never during freeze. Several clips intentionally have no VO at all (silence carries weight, especially for Architect/Authority where the layered-choir VO is the only voice).

**Palette guarantee:** Every entry binds to the §2 art-bible palette uniformly. No off-palette accent colour. One hot accent per piece.

## §D — Wiring notes (post-production)

When videos exist:

1. **Collector's Arena (§A entries):** populate `cutsceneVideoUrl` on each `StoryChapter` in `apps/client/src/game/storyModeChapters.ts` with the assetUrl path of the uploaded MP4 (e.g. `assetUrl("videos/arena-intros/ch01_agent_zero_complete.mp4")`). The `FightPage.tsx:818` check will then activate the existing `<video>` overlay.
2. **TCG main-ladder (§B entries):** append entries to `CHAPTER_ID_TO_INTRO_ID` in `apps/shared/storyEncounterChapterIntros.ts` once the producer-side `ChapterIntroDef`s exist in `chapterIntroCutscenes.ts` (extend `RAW` array there with new chapter numbers and slugs, then map engine chapterIds to the new ids).
3. **Update canon-gap audit** at `docs/production/audit/chapter-intro-canon-gap-2026-05.md` — flag §A entries as "Arena cutsceneVideoUrl pending production" and §B entries as "TCG intro pending production".

## §E — Out of scope

- **Music score:** SFX only; mix is downstream audio production.
- **Localization:** English VO only; loc pass is downstream.
- **The 3 missing BONUS variants** on existing CDN (`ch19_nilmorg_BONUS`, `ch20_conexus_BONUS`, `ch21_shadow_tongue_BONUS`) — those have producer prompts in §3 of the existing book; they need re-upload with correct casing, not new prompts.
- **Code edits:** Writing-only deliverable. Wiring is a follow-up PR per §D above.
