# Dischordian Saga / Loredex OS — Art Prompt & Spec Catalog Audit

> Generated: 2026-05-22. Comprehensive index of every art-prompt / art-spec
> file in the repo that documents (a) the CDN-shipping path, (b) the producer
> prompt used to generate the asset, and/or (c) rendering/format/style specs.
>
> CDN base: `https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/`
> Resolver: `apps/client/src/lib/assetUrl.ts` (and `apps/shared/lib/assetUrl.ts`).
> Public→CDN mirror is 1:1 of `apps/client/public/`.

---

## Section index

1. Suit sets (permanent — 1,080 entries)
2. Recurring / seasonal / vote suit sets (parametric)
3. Earned-loadout artifacts (15)
4. Awakening cinematics (10)
5. Room state art (Cryo Bay + Medical Bay × 4 states each — 8)
6. Room tier art (Bridge + Engineering × 3 tiers — 6)
7. Room media (Veo 3.1 + nano-banana — 26 stills + 8 videos)
8. Act 1 art prompts (32: portraits, battlefields, card arts)
9. Trade Empire art prompts (70)
10. DMC naming prompts (4 — text-only, not art)
11. Expansion-art manifests (registry-only — slug→path catalogues)
12. Production-document prompt books (docs/production/**/*.md)

Each curated TS catalog (1–9) includes the full preamble/style anchor plus
every prompt verbatim. The manifest catalogs (11) ship slug→CDN registries
without prompt text — I list those separately with their counts.

---

# 1. Suit sets — permanent 1,080-entry catalog

**Source:** `apps/shared/suitArtPrompts.ts` (468 lines).
**Coverage:** 18 sets × 6 rarity tiers × 10 piece slots = 1,080 prompts.
**Resolution (baked in preamble):** 1024×1536, 2:3 portrait, transparent alpha.
**Asset-id format:** `<setId>:<rarity>:<slot>`.
**CDN path convention:** producers deliver via CSV emitted by
`apps/scripts/generate-suit-art-csv.ts`. Per `assetUrl()` convention,
expected runtime paths follow `art/suits/<setId>/<rarity>/<slot>.png`.
**Generated markdown twin:** `output/suit-art-prompts.md` (10,178 lines —
canonical expansion of every entry).

## 1.1 Shared preamble (§G.8, suitArtPrompts.ts:105–118)

> Full-body orthographic character-reference render, 1024x1536, 2:3,
> transparent background, single figure centered on vertical axis,
> feet planted on a clean horizon at y=1480, head crown at y=120,
> A-pose arms slightly forward at 10 degrees from the body,
> camera at chest height with zero tilt, 50mm lens,
> soft top-down three-point studio lighting, no cast shadows on ground,
> androgynous lithe muscular build, no secondary sex characteristics,
> gender illegible, identical silhouette across all operatives,
> matte skin reference, no motion blur, no depth of field,
> isolated on transparent alpha, no ground plane, no props,
> no text, no watermarks, no logos,
> art style: cyberpunk meets steampunk sorcery, brass + black-iron + luminous glyphs,
> hand-painted edges over clean vector base.

## 1.2 Pivot points (suitArtPrompts.ts:192–195)

> Pivot points (do not move): shoulders: x=430/x=594, y=360; elbows:
> x=380/x=644, y=620; wrists: x=342/x=682, y=880; hips: x=468/x=556,
> y=900; knees: x=470/x=554, y=1180; ankles: x=472/x=552, y=1440;
> crown: x=512, y=120; chin: x=512, y=310.

## 1.3 Slot order, rarity order, anatomical regions

Slot order (`SUIT_SLOT_ORDER`, lines 37–48): head, chest, shoulders, arms,
gloves, belt, legs, feet, weapon-primary, back.

Rarity order (`RARITY_ORDER`, lines 58–65): common, uncommon, rare, epic,
legendary, mythic.

Rarity labels (lines 122–129): common→Salvage · uncommon→Refit ·
rare→Wrought · epic→Master-Forged · legendary→Inventor-Pattern ·
mythic→Inventor's Original.

**Rarity modifiers** (lines 131–144) — pasted into every prompt body:

- common: "matte materials, zero glow, minimal decal, light surface wear"
- uncommon: "one subtle glow accent, light etched filigree along primary edge"
- rare: "two glow accents, polished metallic finish, visible rivets, faint element halo"
- epic: "animated micro-glow hint, embossed set sigil, enamel inlay, intricate filigree"
- legendary: "element-reactive glow pulses (shown mid-pulse), moving filigree cues, heirloom patina"
- mythic: "one-of-one heirloom, hand-painted surface cracks and repairs, signed with the Inventor's sigil at a hidden corner, iridescent not-color underlayer visible at edges"

**Element palettes** (lines 148–157):

- earth: `#5b4a2a` anchor + `#a87f3b` accent
- fire: `#7a1e13` anchor + `#f4a13a` accent
- water: `#13344a` anchor + `#6fd3e7` accent
- air: `#d9e7ef` anchor + `#9fb1bf` accent
- space: `#0a0614` anchor + `#b6a8f2` accent
- time: `#2b2414` anchor + `#e6c87a` accent
- probability: `#221b2d` anchor + `#d8f05a` accent
- reality: `#050506` anchor + `#7a76d8` accent, iridescent null-sheen

**Species decals** (lines 161–170):

- demagi: "hand-etched illuminated rune overlay, glyphs breathe with soft internal glow"
- quarchon: "exposed clockwork gear detail at joint seams, visible brass rivets, steam-vent slits"
- neyon: "gold filigree threading between rune and circuit motifs, duotone gold/black"
- human: "hand-stitched fabric seams, visible ink-and-paper circuitry, photograph-locket clasps"
- (neutral): "none — render without species overlay" for non-species sets.

**Anatomical regions** (lines 197–209):

- head: skull-cap through occipital, optional side panels to ears (above chin y=310)
- chest: sternum to waistline, y=360 to y=760
- shoulders: deltoid caps, x=380 to x=644, y=340 to y=440
- arms: elbow through mid-forearm, both limbs
- gloves: wrist to fingertip, both hands
- belt: waistline band, y=760 to y=830
- legs: hipline to knee
- feet: ankle through toe
- weapon-primary: right-hand-held weapon, centered on pivot x=682 y=880
- back: posterior of torso & legs as a single cloak-layer, mirrored alpha

## 1.4 Suit-set roster (18 entries — suitArtPrompts.ts:225–386)

Every prompt is composed by `buildSuitPrompt(set, rarity, slot)` (lines
394–418) as:

> `<PREAMBLE>\n\nRender ONLY the <slot> piece for the <Set Name> suit, <Rarity Label> tier. The piece covers <anatomical region>; everything outside this region must be fully transparent alpha, including any part of the body itself. Piece motif: <motif>. Rarity modifiers: <modifier>. Element tint: <palette>. Species etching overlay: <decal>. Alignment with base pose: joints at exact pixel pivots. <PIVOT_POINTS> Do not render any body part or clothing outside the <slot> anatomical region.`

### Class sets (5; lines 226–262)

| setId | name | motif |
|---|---|---|
| `regalia-of-the-seeing-stylus` | Regalia of the Seeing Stylus | Oracle suit — brass orrery pauldrons, quill-pen gauntlets, glyph-printed long-coat over a cuirass, divination cant embroidered on the hem |
| `pressure-loom-harness` | Pressure-Loom Harness | Engineer suit — segmented copper plates, pneumatic elbow joints, wrench-holster belt, leather welder's apron, brass-rimmed goggles seated on the forehead |
| `black-crepe-weave` | Black-Crepe Weave | Assassin suit — ribbed chitinous weave, chained sashes across the torso, reverse-grip dagger sheath on the thigh, void-black crepe wrap at the throat |
| `bulwark-of-the-eighth-column` | Bulwark of the Eighth Column | Soldier suit — riveted plating, shield-rail on the back, marching-band epaulets with tarnished braid, regimental buckles at the belt |
| `low-profile-tailoring` | Low-Profile Tailoring | Spy suit — cut suit with hidden armor plates, wire-spool cufflinks, stiletto pen at the breast pocket, razor-thin tie-pin sigil |

### Species sets (3; lines 265–290)

| setId | name | species | motif |
|---|---|---|---|
| `arcane-rune-regalia` | Arcane-Rune Regalia | demagi | Demagi ceremonial suit — hand-etched circuitry blended with illuminated runes; glow breathes at cast; rune overlay brightens at the shoulders and crown |
| `clockwork-exoframe` | Clockwork Exoframe | quarchon | Quarchon exoframe — exposed gears at the joints, steam vents at the shoulders, polished chrome plating over oil-blued steel, brass rivet bands |
| `hybrid-vein-panoply` | Hybrid-Vein Panoply | neyon | Ne-Yon panoply — gold/black duotone, living filigree that threads between circuit and rune, vein-tracery pulses slowly across every plate |

### Element sets (8; lines 293–358)

| setId | name | element | motif |
|---|---|---|---|
| `geomancers-stratum` | Geomancer's Stratum | earth | Earth regalia — layered slate tiles, vein-ore accents, lantern of ley-light at the belt, stone-cut gauntlets |
| `ember-bellows-array` | Ember-Bellows Array | fire | Fire regalia — forge-bellows pauldrons, coal-glow spine, brass-piped gauntlets, ember seams at the seams |
| `tide-engine-carapace` | Tide-Engine Carapace | water | Water regalia — riveted dive-plate, kelp-filigree cloak, pressure-gauge chestpiece, copper porthole knee-plates |
| `aetheric-dirigible-rig` | Aetheric Dirigible Rig | air | Air regalia — canvas-sailed wings, brass altimeter collar, balloon-silk cloak, rope-rigged shoulders |
| `void-sextant-ensemble` | Void-Sextant Ensemble | space | Space regalia — black-lacquer plate, silver starchart inlay, astrolabe pauldron, constellation-pricked greaves |
| `chronometer-livery` | Chronometer Livery | time | Time regalia — pale-gold gears visible under a glass chestplate, second-hand on the crown, escapement-engraved gauntlets |
| `dicewrights-motley` | Dicewright's Motley | probability | Probability regalia — asymmetric panels, die-faceted shoulders, flipping-coin buckle, odds-and-evens dual-tone greaves |
| `null-weaver-mantle` | Null-Weaver Mantle | reality | Reality regalia — iridescent not-black cloth, seams that aren't there, fracture-line gloves, a cloak whose edges refuse to settle |

### Foundation sets (2; lines 361–378)

| setId | name | species | motif |
|---|---|---|---|
| `the-mourners-coat` | The Mourner's Coat | human | Humanity foundation — long hand-stitched coat, photograph-lockets at the breast, paper-and-ink circuitry traced onto the lining, oxblood-dyed cuffs |
| `the-first-chassis` | The First Chassis | (none) | Machine foundation — cold-rolled plating, LED-vein underglow, replaceable-limb hardpoints, standardized socket seams at every joint |

> **Note:** the fully expanded form of all 1,080 prompts is generated at
> `output/suit-art-prompts.md` (10,178 lines). Regenerate via
> `apps/scripts/generate-suit-art-csv.ts`.

---

# 2. Recurring / seasonal / vote suit sets

**Source:** `apps/shared/recurringSuitArtPrompts.ts` (443 lines).
**Composer:** `buildRecurringSuitPrompt()` (lines 367–392) reuses
`SUIT_PREAMBLE` and `SUIT_PIVOT_POINTS` from suit catalog #1 and appends a
"Lifecycle note: <renewalCycle> rental — this piece returns to the chapter
when membership lapses." line.
**Resolution:** 1024×1536 (lines 349).
**Asset-id format:** `recurring:<setId>:<rarity>:<slot>`.
**Ownership:** all rental, gated on membership `dgrs-lions-club`.

Total count = Σ(rarities × 10). Currently:

- 4 seasonal × 6 rarities × 10 = **240**
- 4 seasonal-event × 3 rarities × 10 = **120**
- 4 annual-vote × 3 rarities × 10 = **120**
- 1 annual-founder × 2 rarities × 10 = **20**
- **Grand total: 500 prompts**

## 2.1 Seasonal (4; lines 115–168)

| setId | name | rarities | motif |
|---|---|---|---|
| `vernal-quickening-regalia` | Vernal Quickening Regalia | all 6 | Spring regalia — fresh-brass plating tinted with new-growth green, seed-satchel belt, pollen-glass glyphs on the pauldrons, buds and thorns etched along every seam |
| `solstice-forge-plate` | Solstice Forge-Plate | all 6 | Summer regalia — sun-bronze plates with heat-bloomed enamel, forge-scale greaves, cicada-wing cape seams, ember-filigree along every edge |
| `harvest-ledger-coat` | Harvest Ledger-Coat | all 6 | Autumn regalia — rust-leather longcoat over black-iron plate, abacus gauntlets with real sliding beads, wheat-sheaf sigil on the belt, storm-lantern at the hip |
| `deep-winter-bulwark` | Deep-Winter Bulwark | all 6 | Winter regalia — white lacquer over black-iron plate, frost-glyph filigree that reads cold to the touch, fur-lined collar, breath-fogged visor |

## 2.2 Seasonal events (4; lines 172–230)

| setId | name | rarities | element | motif |
|---|---|---|---|---|
| `christmas-in-july-lightworks` | Christmas-in-July Lightworks | rare/epic/legendary | — | Christmas-in-July festive regalia — warm gold plate wrapped in holographic tinsel, tree-light chestpiece that actually glows, candy-cane greaves, ornament-pommel belt hook |
| `shadow-convergence-mantle` | Shadow Convergence Mantle | rare/epic/legendary | space | Shadow-Convergence regalia — black-lacquer plate veined with silver constellation lines, eclipse-gold cape, void-stitched gloves, starchart visor |
| `first-light-anniversary-plate` | First-Light Anniversary Plate | rare/epic/legendary | — | Anniversary regalia — polished gold rimwork with mother-of-pearl inlay, sunrise-etched chestpiece, commemorative year-sigil at the collar |
| `harvest-vigil-longcoat` | Harvest-Vigil Longcoat | rare/epic/legendary | — | Harvest-Vigil regalia — candle-wax ivory longcoat with beeswax-sealed glyphs, bone-gold buttons, lantern-ember glow at the belt, remembrance-ribbon at the breast |

## 2.3 Annual governance votes (4; lines 234–293)

| setId | name | rarities | element | motif |
|---|---|---|---|---|
| `state-of-the-ark-vestment` | State of the Ark Vestment | epic/legendary/mythic | — | State of the Ark vestment — ceremonial council regalia in ark-deck grey and brass, rostrum-engraved breastplate, parchment-stole across the chest, Antiquarian quill at the belt |
| `faction-succession-mantle` | Faction Succession Mantle | epic/legendary/mythic | — | Faction Succession mantle — four-paneled cape that rotates the reigning faction's sigil, braid-of-inheritance at the shoulder, ballot-seal at the breast |
| `apocalypse-protocol-warplate` | Apocalypse Protocol Warplate | epic/legendary/mythic | fire | Apocalypse Protocol warplate — blackened armor scored by real-looking combat damage, protocol-seal stamped at the shoulder, emergency-red glow at the seams, failsafe keys on a lanyard at the belt |
| `oracles-question-robe` | Oracle's Question Robe | epic/legendary/mythic | probability | Oracle's Question robe — asymmetric probability-cut silks over thin plate, die-faceted pauldrons, query-glyph engraved down the spine, answer-less ballot pinned at the heart |

## 2.4 Annual founder rental (1; lines 297–316)

| setId | name | rarities | motif |
|---|---|---|---|
| `iron-clad-lions-ceremonial` | Iron Clad Lions Ceremonial | legendary / mythic | Iron Clad Lions ceremonial armor — white lacquered iron plates with a gold lion-mask helm, shoulder sacrificial kneel-points scuffed down to bare metal, mane filigree etched with a rosary of servants' names, gold filigree running the seams, matte-white cape hemmed in gold |

---

# 3. Earned-loadout artifacts (15 prompts)

**Source:** `apps/shared/earnedLoadoutArtPrompts.ts` (240 lines).
**Resolution:** 1024×1024 (catalog/codex entries).
**CDN path:** producers deliver via
`apps/scripts/generate-earned-loadout-art-csv.ts`. Asset-id matches
`RewardItem.id` in `apps/shared/earnedLoadouts.ts` — the test in
`earnedLoadoutArtPrompts.test.ts` enforces 1:1 coverage.

## 3.1 Style anchor (lines 51–52)

> Cyberpunk meets steampunk sorcery: hand-forged brass and blackened iron fused with fiber-optic ley lines, arcane glyphs that glow from within the metal, and hairline chrome inlays that read as both circuitry and ritual script. Hand-painted edges over a clean vector base. Soft three-point studio lighting at chest height, 50mm equivalent, zero lens tilt, no motion blur, no depth of field. Isolated on transparent alpha — no ground plane, no props, no environment, no text, no watermarks. Material palette: patinated brass, oil-blued steel, oxblood leather, smoked glass, phosphor-green or lavender glyph glow. Single object centered in frame, full silhouette visible from edge to edge with 8% margin. Render as a catalog / codex entry — the object must read as a specific, hand-made artifact, not a generic kit piece.

## 3.2 Engineer rewards (lines 59–90)

### `brass-sigil-arc-welder` — weapon

> Three-quarter product shot of a hand-held arc welder the size of a heavy pistol. Body: patinated brass with copper venting along the spine, hand-etched sigils that glow lavender where the current would bite the work. A short ceramic nozzle tipped in oil-blued steel, single ground-strap of oxblood leather looped through a brass ring at the butt. A small beveled quartz window over the capacitor shows a violet internal flame banked like a pilot light. Trigger guard is a filigreed brass hoop. Copper conduit curls once around the grip before joining the main body. Reads as a gunsmith's piece married to a ritual iron — functional welder silhouette, arcane embellishment in the etching. No decals, no serial numbers.

### `clockwork-repair-swarm` — secondary

> Hero shot of a small lacquered brass lockbox (palm-sized) sitting open, with six mechanical beetles arranged above it in a slight arc as if mid-deploy. Each beetle: brass carapace the size of a walnut, smoked-glass abdomen holding a faint probability-green mote that reads as a caged firefly. Six gossamer wings per beetle — etched brass filigree that suggests circuit traces AND insect veining simultaneously. Mandibles are tiny oil-blued steel calipers. The lockbox interior is velvet the color of dried bracken and shows six precisely-sized beetle sockets. One beetle is slightly off-axis to imply motion without motion blur. No cables, no wires — every beetle is self-contained. The whole piece reads as a watchmaker's instrument kit that happens to be alive.

### `aether-loom-gauntlet` — weapon

> Three-quarter product shot of a right-hand gauntlet ending at mid-forearm. Oxblood leather base laced along the inner seam with brass eyelets; outer shell is blackened iron plates riveted at the knuckles. Running from wrist to fingertip: twelve fiber-optic tendons (translucent quartz filaments, phosphor lavender glow) woven through the leather like warp threads on a loom, each terminating in a brass claw-tip at a fingernail. The back of the hand bears a small brass disc engraved with a single radiant glyph. The inner wrist shows a bank of six tiny bobbin-spools — half brass, half smoked glass — stacked like loom reeds. Reads as a weaver's apparatus and a weapon at once; the glow is cool, not hot.

## 3.3 Oracle rewards (lines 94–125)

### `geomantic-tap-relay` — weapon

> Hero shot of a Y-shaped divining rod, each arm roughly forearm-length, carved from dark wood and banded at the fork by hammered brass with filigree ley-line etchings. Threaded along the entire length: a single translucent fiber-optic cable that follows the wood grain like an ivy vine, glowing faint phosphor green from pulses that travel root-to-tip. At the fork a small brass resonator drum the size of a pocket watch, smoked-glass face displaying an internal needle. A loop of oxblood leather at the handle end for wear. The object must read first as a dowsing rod and only on second look as a piece of surveying equipment. No visible connectors, no external power source.

### `probability-cant-slate` — accessory

> Flat-lay product shot of a hand-sized rectangular slate, slightly thicker than a playing card, held in a brass-rimmed frame with finger cutouts at the short sides. Surface: matte black glass carved with shifting neon-violet probability glyphs arranged in a rotating calendar-wheel pattern (render as a still frame of the wheel, not mid-motion). The glyphs bleed faint light into the bezel. The back (not shown) is brass engraved with a single radiant rune. A slim sliding brass dial runs along one edge like a volume slider. Slate edges are oxblood leather wrapped around the brass frame. Reads as a pocket oracle crossed with a debtor's ledger.

### `chrome-augur-lens` — accessory

> Hero shot of a single monocle, chrome bezel fully polished, about 45mm diameter. Lens is quartz with the faintest iridescent oil-slick coating — from certain angles a spiral of etched augur glyphs appears to drift across the glass. A silk-thin chrome chain hooks through a small brass ring at the rim and loops once in a shallow S above the lens. The chromed bezel carries a hairline inlay of a single radiant eye-sigil at the top. The monocle rests as if about to be picked up, tilted 15° off the vertical axis. High polish on the bezel; matte inside edge to avoid glare in the lens itself. No engraving on the chain, no maker's mark.

## 3.4 Assassin rewards (lines 129–160)

### `obsidian-rite-blade` — weapon

> Three-quarter product shot of a short-sword approximately 50cm overall length. Blade: single-edged volcanic glass, translucent black with a faint internal veining of deeper black glyphwork that only resolves under inspection. The spine of the blade is fitted with a hair-thin brass runnel that carries a banked lavender glow from hilt toward tip. Hilt: blackened brass with a sigil inlay at the pommel — a single radiant rune. Grip wrapped in oxblood leather over brass wire. The crossguard is two stubby brass tongues etched with matching glyphs. The blade rests at a slight downward angle so light catches one edge. Reads as sacrificial / ritual knife first, combat weapon second.

### `phase-cut-stiletto` — weapon

> Hero shot of a needle-thin stiletto, overall 32cm, blade a triangular brass needle with hairline chrome inlay down the central ridge. A faint lavender ghost-image of the same blade is rendered 4px offset toward the viewer — a catalog-legible afterimage, not a motion blur; the afterimage is slightly more translucent than the physical blade. Hilt: blackened steel knurl wrapped once in oxblood leather, pommel a small brass orb bearing one radiant glyph. No crossguard. The weapon sits at a slight diagonal as if about to be drawn. The afterimage must read as deliberate visual language, not an error.

### `chrome-silencer-ampoule` — consumable

> Flat-lay hero shot of a small hand-blown glass ampoule, 6cm tall, held upright in a two-prong brass caliper stand. Glass is clear; contents are a mirrored silver oil that catches the studio light like mercury but behaves like liquid — a single cold highlight across the meniscus, no ripples. The neck of the ampoule is sealed with a brass cap engraved with a tiny radiant sigil and a single chrome hairline ring. The caliper stand is patinated brass with oxblood leather feet. No labels, no wax seals, no serial numbers — the object's identity is carried entirely by the mirror of its contents.

## 3.5 Soldier rewards (lines 164–195)

### `iron-rite-bulwark` — secondary

> Three-quarter product shot of a kite shield approximately 90cm tall, face presented at a 25° tilt. Body: cold blackened iron, slightly domed, rimmed in hammered brass. Face is stamped with a single large warding sigil that glows a deep, banked phosphor green from recessed channels — the glow is almost dormant, as if saving its strength. Oxblood leather arm-strap and brass-buckled grip visible at the back edge. Several tiny brass rivets around the outer rim, each engraved with a smaller companion glyph. Along the lower third of the face, faint linear score-marks catalog blows it has already turned. Reads as a ceremonial weapon that has done real work.

### `clockwork-line-carbine` — weapon

> Side profile of a short gas-brass carbine approximately 70cm overall. Receiver: patinated brass with a visible clockwork mechanism under a smoked-glass panel on the left side — tiny cogs, an escapement wheel, a single ruby-red jewel bearing. Barrel: oil-blued steel, hex-fluted, short. Stock: dark wood with oxblood leather cheek-rest. A small winding key folds flush against the side of the receiver; above it, a brass pressure gauge with a glowing phosphor-green needle. Bolt handle is a brass knurl. Sling swivel is a single brass D-ring. No optics, no rail, no modern accessories. Reads as a post-arcane clockmaker's rifle.

### `voltaic-aegis-harness` — secondary

> Front-on hero shot of an upper-body harness floating as if worn by an invisible figure. Oxblood leather straps crossing over the chest and shoulders, silver runes hammered into the leather at each strap intersection. Two small copper Tesla-coils mount at the clavicles, each wrapped in brass filigree, a thin banked-blue arc crawling slowly between the two like captured lightning breathing. At the solar plexus: a circular brass grounding disc engraved with a single radiant sigil. A bank of three fuse-tubes in smoked glass sits at each side of the ribcage, glowing a quiet phosphor lavender. No visible buckles — the straps lace through brass grommets. Reads as protective liturgy that happens to be voltaic.

## 3.6 Spy rewards (lines 199–230)

### `whispering-ledger` — accessory

> Hero shot of a small pocket-sized codex, 10cm × 14cm, bound in oxblood leather with hand-tooled brass corners and a single brass clasp. The clasp is engraved with a radiant sigil. Cover leather is scored with faint pencil-thin lines that imply a family tree drawn and half-erased. The book sits slightly open — about 20°, just enough to show the first three pages writing themselves in hairline phosphor-green ink from an invisible nib; the ink must read as still-wet in a line that extends across both visible pages. No ribbon marker; a length of fine chrome wire runs along the spine instead. The interior pages are cream, not white. Reads as a surveyor's notebook and a reliquary at once.

### `mirror-cant-dossier` — accessory

> Flat-lay overhead shot of a hand-sized folio roughly 18cm × 24cm, open to its center spread. Cover (visible at the edges) is black leather with a chrome inlay running along all four seams. Interior paper is a cold mirror-grey that catches the studio light like polished steel; across both pages a single neon-violet cant script appears to float 2mm above the surface — rendered as a crisp ghost-layer, not motion-blurred. The text reverses subtly toward the gutter as if unsure which tongue it belongs to. A single chrome straight-pin holds a small brass sigil-disc to the upper-left corner of the left page. No handwriting, no annotations, no margin scribbles.

### `chrome-veilcloak` — secondary

> Three-quarter display shot of a hooded half-cloak hanging on an invisible form, back-to-viewer three-quarter angle so both the hood and the interior lining are readable. Outer shell: matte charcoal wool. The entire exterior is stitched in a fine scale pattern of mirror-polished chrome shingles, each about the size of a thumbnail, so the garment reflects light as hundreds of tiny facets — the scales read as armor scales from far, sequins from near, and neither up close. Hood interior lined in oxblood silk. A single radiant sigil is embroidered in silver thread at the nape of the neck, only visible where the hood falls back. Hem weighted with hairline brass beads. No clasp visible — the cloak closes with a single hidden magnetic brass stud at the throat.

---

# 4. Awakening cinematics (10 entries)

**Source:** `apps/shared/awakeningCinematicPrompts.ts` (253 lines).
**Engine:** Kling Omni · 16:9 video loops · 6–10 seconds.
**CDN path:** `videos/awakening/<STEP_ID>.mp4` →
`https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/videos/awakening/<STEP_ID>.mp4` (per `videoFor()`, lines 95–96).
**Style anchor (lines 66–73):**

> Cinematic 16:9 video loop, 6–10 seconds, seamless loop. Aesthetic:
> cyberpunk × steampunk sorcery — oil-blued steel, patinated brass,
> deep oxblood accent lighting, warm-gold service lamps,
> phosphor-lavender and phosphor-green sigil glows threaded through
> riveted hull panels. Slow dust motes in volumetric light. Faint
> film-grain sepia undertone. No visible player character, no text,
> no HUD, no watermarks.

**Negative-prompt base (lines 79–84):**

> first person, first-person POV, selfie view, reflection of the
> player, player face, protagonist face, close-up of a character's
> face looking at the camera, mirror reveal, hand holding a weapon
> in frame, HUD elements, UI, rendered text, subtitles, watermark,
> logo, modern clothing, modern phone, real-world branding

## 4.1 `CRYO_OPEN` — 8 s

- CDN: `videos/awakening/CRYO_OPEN.mp4`
- Camera: Frost crystals on the pod's inner glass, extreme close-up — camera pulls back into the cryo bay's cold blue gloom. No occupant visible.
- Prompt:
  > Extreme close-up on the inside of a cryogenic pod's frosted glass. Frost crystals bloom and retreat in time with slow breath-pulses of warm-gold light bleeding through from the chamber beyond. The camera slowly pulls back, revealing the pod's brass rim, a bead of condensation rolling down the oil-blued steel housing, and — through the wider frame — the Cryo Bay of an Inception Ark: rows of sealed pods receding into cold indigo haze, service lamps breathing. No figure inside the pod. Mood: the breath returning to a body, captured in architecture.
- Negative addition: ", any human figure inside the pod, any face behind the glass"

## 4.2 `ELARA_INTRO` — 10 s

- CDN: `videos/awakening/ELARA_INTRO.mp4`
- Camera: Elara's holographic avatar materializes over the Cryo Bay floor — phosphor-lavender particle bloom, slow orbital camera, no observer.
- Prompt:
  > A holographic avatar materializes in mid-air above the Cryo Bay floor — a composite of phosphor-cyan particles, floating braided hair rendered in light, a faint shimmer of a feminine silhouette never fully resolved. Around her, fiber-optic ley-lines in the floor plates pulse in cadence with her breath. Camera makes a slow 180° arc around her at waist height, revealing the rows of sealed pods behind her going out of focus in depth-of-field. Dust motes catch the warm-gold service lamps. Mood: an intelligence introducing itself to a room she has watched for centuries.
- Negative addition: ", fully solid human Elara, realistic skin, any second figure in frame"

## 4.3 `SPECIES_QUESTION` — 9 s

- CDN: `videos/awakening/SPECIES_QUESTION.mp4`
- Camera: Holographic DNA helix over a medical console; helix forks into an arcane-flame strand and a crystalline data-lattice strand.
- Prompt:
  > Slow dolly around a floating holographic DNA double-helix hovering above a brass-and-oil-blued-steel medical console. The helix glitches, then splits: one strand turns into a flowing arcane flame etched with glyphs (phosphor-lavender, warm ember), the other into a crystalline data-lattice of probability traces (phosphor-green, cold). Both strands rotate around an empty center where the player's reading would go. The camera never includes the player; the operator's hands and body are off-frame. Background: smoked-glass panels, banks of vials, patinated brass fittings catching warm-gold light. Mood: a diagnostic engine asking the question you don't want to answer.
- Negative addition: ", human body near the console, lab technician visible"

## 4.4 `CLASS_QUESTION` — 9 s

- CDN: `videos/awakening/CLASS_QUESTION.mp4`
- Camera: Five holographic skill-matrix glyphs rotate around an empty center. Camera slow-orbit at waist height — no player in frame.
- Prompt:
  > Five holographic glyphs rotate slowly in a ring above a dark plate-metal floor, each a class sigil: a wrench braided with fiber-optic ley-lines (Engineer), a white-light eye ringed by phosphor-green probability dots (Oracle), a hair-thin serrated blade wreathed in violet venom-smoke (Assassin), a plasma bayonet wrapped in oxblood banner cloth (Soldier), a keyhole of shifting redacted glyphs (Spy). The camera orbits the ring at waist height. The ring's center is empty — the operator is implied, never shown. Service lamps breathe warm-gold. Mood: aptitudes waiting for a hand to reach in.
- Negative addition: ", a hand reaching into frame from camera-right, any chosen class figure"

## 4.5 `ALIGNMENT_QUESTION` — 10 s

- CDN: `videos/awakening/ALIGNMENT_QUESTION.mp4`
- Camera: Split cinematic diptych — Panopticon lens array on one side, a Dreamer's impossible storm on the other. Camera gently dollies down the divide.
- Prompt:
  > Symbolic split-screen with a soft seam of phosphor light down the middle. LEFT: the Architect's Panopticon — a vast brass-and-steel lens array facing forward, thousands of smaller iris apertures opening and closing in quiet perfect synchrony, cold institutional geometry, oxblood shadow. RIGHT: the Dreamer's chaos — a weather system inside a room, free-floating glyphs drifting like migrating birds, a chandelier of broken clock faces revolving at impossible angles, warm gold threading through phosphor-lavender sparks. The camera slowly dollies down the seam; it never chooses a side. Mood: two philosophies waiting to be answered to.
- Negative addition: ", any figure taking sides, explicit good/evil iconography, real-world religious imagery"

## 4.6 `ELEMENT_QUESTION_DEMAGI` — 8 s

- CDN: `videos/awakening/ELEMENT_QUESTION_DEMAGI.mp4`
- Camera: Ring of five arcane elemental sigils carved in brass, each breathing its element. Camera orbits at knee height, no operator.
- Prompt:
  > A ring of five carved brass sigils set into the floor plates of a small sanctum, each sigil breathing its elemental signature: fire sigil hosts a low arcane flame licking warm-gold, water sigil holds a slowly-revolving sphere of suspended liquid, earth sigil cracks and reforms a lattice of crystal, air sigil spins a dust devil of phosphor-lavender motes, shadow sigil eats the light around it into a velvet absence. The camera orbits the ring at knee height. Ley-lines spoke inward from the sigils to an empty center. No figure in frame. Mood: DeMagi blood listening for its own resonance.
- Negative addition: ", figure kneeling inside the ring, hand hovering over a sigil"

## 4.7 `ELEMENT_QUESTION_QUARCHON` — 8 s

- CDN: `videos/awakening/ELEMENT_QUESTION_QUARCHON.mp4`
- Camera: Five dimension-gates stacked like suspended holograms. Camera glides between them in a long lateral dolly.
- Prompt:
  > Five suspended holographic dimension-gates float in a vaulted steel-and-brass chamber: a slow-rotating void horizon (space), a lattice of clockwork gears frozen and unfrozen in turn (time), an infinity-mirror of probability branches (probability), a plane of mathematical glyphs folding in on themselves (logic), and a luminous weave of data-threads patterning into language (data). The camera glides between them in a long lateral dolly, each gate exhaling a faint tone of phosphor-green. No operator in frame. Mood: a Quarchon's cognition running through its available reality-handles.
- Negative addition: ", humanoid robot in frame, obvious sci-fi cliché android"

## 4.8 `NAME_INPUT` — 7 s

- CDN: `videos/awakening/NAME_INPUT.mp4`
- Camera: Macro shot on a serial-number brass dogtag rotating slowly over a data-slate; the engraved number flickers and starts erasing itself one glyph at a time.
- Prompt:
  > Macro shot of a brass crew-dogtag suspended above a powered data-slate on a warm-gold-lit console. The tag rotates very slowly; stamped into it is a long serial number. Under the tag, the data-slate's holographic cursor blinks. As the camera pushes in, the serial number's glyphs flicker and begin to dissolve into phosphor-lavender motes one at a time, leaving a clean empty space where a name will be written. Soft dust in the service-lamp beam. Mood: the ritual of being addressed by something that matters.
- Negative addition: ", any fingers interacting with the tag, a person's profile behind the tag"

## 4.9 `ATTRIBUTES` — 8 s

- CDN: `videos/awakening/ATTRIBUTES.mp4`
- Camera: Three neon diagnostic pillars (ATK/DEF/VIT) rising from the floor plates, calibrating with quiet authority. Camera floats between them.
- Prompt:
  > Three tall diagnostic pillars of phosphor-cyan data rise from the brass floor plates of a Med Bay annex, each labeled in engraved brass at its base with an abstract glyph for ATTACK, DEFENSE, and VITALITY. Inside each pillar, a column of calibration bars fills and empties rhythmically, settling into balanced readings. Ley-lines beneath the plates pulse between the three pillars, sharing power. The camera drifts through the pillars at chest height — no operator visible. Mood: a neural interface handshaking with a nervous system it has never met before.
- Negative addition: ", figure standing between the pillars, arms extended cruciform"

## 4.10 `FIRST_STEPS` — 10 s

- CDN: `videos/awakening/FIRST_STEPS.mp4`
- Camera: Long corridor of the Ark stretching away from the Cryo Bay door — door's phosphor seal flips red→amber→green; camera holds the threshold, never steps through.
- Prompt:
  > A long corridor of the Inception Ark seen from the threshold of the Cryo Bay: vaulted hull-rib ceiling in oil-blued steel, warm-gold service lamps receding into depth, brass signage placards, distant phosphor-lavender sigils etched into the floor. The reinforced bulkhead door in the foreground cycles its seal-status indicator from red to amber to green. Service lamps further down the hall flicker on one section at a time as though inviting passage. The camera holds on the threshold — it never steps through. Dust in the beams, a single drifting leaf of paper. Mood: the first step is yours to take.
- Negative addition: ", player walking down the corridor, footprints on the floor, companion silhouette"

---

# 5. Room state art (Cryo Bay + Medical Bay — 8 prompts)

**Source:** `apps/shared/roomStateArtPrompts.ts` (289 lines).
**Resolution:** 1920×1080, 16:9.
**Asset-id format:** `<roomId>:<stateId>`.
**Style anchor (lines 59–71):**

> Wide-shot architectural render of an Inception Ark interior, 16:9, 1920x1080,
> cinematic first-person vantage at standing eye-height, 28mm equivalent lens with zero tilt,
> clean horizontal horizon, no dutch angle, no lens distortion.
> Palette: cold institutional steel, patinated brass fittings, deep oxblood accent lighting,
> warm-gold service lamps, phosphor-lavender and phosphor-green glyph glows where sorcerous circuitry runs.
> Aesthetic: cyberpunk meets steampunk sorcery — hand-forged brass married to arcane sigil etching and
> fiber-optic ley lines threaded through riveted hull panels.
> Materials: polished and scuffed brass, oil-blued steel bulkheads, frost residue on cryogenic surfaces,
> smoked glass panels, oxblood leather accents on control panels, hand-stitched decals on signage.
> Soft rim-light from ceiling service strips, a single stronger warm-gold key from one architectural direction,
> visible dust in the beam, faint film-grain sepia undertone.
> No visible figures, no rendered text, no UI overlays, no watermarks, no HUD elements — pure environment.

Generated markdown twin: `output/room-state-art-prompts.md` (170 lines).

## 5.1 Cryo Bay shared layout sentence (lines 82–88)

> The Cryo Bay seen from the operative's waking-pod vantage — three parallel rows of upright cryogenic pods receding into the frame, the viewer's own open pod occupying the lower-right foreground (pod rim and frost-rimed interior visible, no figure inside). The left wall carries a bank of diagnostic cryo-terminals with warm-gold indicator lights; the right wall a brass-framed corridor junction. Ceiling is a vaulted hull-rib architecture in oil-blued steel with exposed copper conduit. Floor is textured plate metal with frost pooled at pod bases. At the far end of the chamber: a reinforced bulkhead door marked with a single warm-gold sigil — the route to the Medical Bay.

### `cryo-bay:initial` — P0 — default state

Condition: Default state: no investigation flags set; player has just arrived in the room.

> [SHARED LAYOUT] STATE: pristine wake-up. All pods are frost-rimed and humming quietly; the service lamps have their warm-gold cast but are dim. The foreground pod (the player's) is the only one open, its interior lined with condensation. Every other pod reads as sealed and intact from this distance. One pod in the middle row — second from the end, left side — shows a dark status indicator instead of the usual warm-gold, but it is easy to miss at this range (about 2% of the frame, just a small cold-blue absence where a light should be). No scattered debris, no movement, no open access panels. The bulkhead door at the far end shows a red-lit seal-status, clearly locked. The overall mood is 'you just woke up and everything is exactly as it should be.'

### `cryo-bay:investigating` — P0

Condition: Player has examined at least one murder-mystery hotspot (dead-pod, cracked-panel, medical-chart, personal-effect, or data-slate). Sets `narrativeFlags.cryo_mystery_first_clue_found`.

> [SHARED LAYOUT] STATE: mid-investigation. The dark pod (middle row, second from end, left side) is now the unmistakable focal point — frame-centered through depth cue, its interior visible through condensed glass as an inky occupied silhouette. Its control panel below the glass is cracked along a hairline fracture, with a slow intermittent arc of phosphor-lavender sparks escaping the seam. A thin printed medical chart is magnetically clipped to the pod's exterior near the fracture, one corner lifted as if disturbed. On the floor directly below the pod: a torn identification tag (brass-edged, cord cut), a small personal effect (a tarnished silver locket, open), and the edge of a data-slate peeking out from under the pod housing. A thin bioluminescent blood trail runs a short distance from beneath the pod toward the central aisle before disappearing under plate-metal seam. Bulkhead door at far end still shows red-lit seal-status. The other pods recede into softer focus to emphasize the evidence cluster. Mood: 'something is wrong here and you have just started to see it.'

### `cryo-bay:victim-identified` — P0

Condition: Player has combined the torn ID tag + data-slate to identify the victim. Sets `narrativeFlags.cryo_mystery_victim_identified` and unlocks the Medical Bay bulkhead.

> [SHARED LAYOUT] STATE: victim identified, door unlocking. The dark pod's glass has been wiped clear of condensation in a small oval where the player leaned in to read; the occupant's silhouette is now unambiguously visible inside but tastefully lit so features are obscured by reflection, not explicit violence — a figure in a crew uniform, slumped. On a small brass-topped diagnostic cart pulled up beside the pod: the torn ID tag laid flat, the data-slate powered on with its screen glow bouncing warm-gold off the cart surface, and the tarnished silver locket open beside them — the three evidence items consolidated as a deliberate exhibit. The cracked control panel is dark now; the phosphor arcs have stopped. At the far end of the chamber the bulkhead door is mid-cycle: seal-status indicator has flipped from red to amber, the door itself partially retracted, warm-gold light spilling from the Medical Bay corridor beyond into a long floor stripe. Mood: 'you have given the dead a name, and a door that was closed is opening because of it.'

### `cryo-bay:case-open-later` — P1

Condition: Player revisits the room after identifying the victim and progressing past Act 1 opening. Case remains open per plan. Sets `narrativeFlags.cryo_case_marked_open`.

> [SHARED LAYOUT] STATE: revisited, case still open. The dark pod is now cordoned off with a translucent phosphor-lavender tape strung between two brass posts placed by the operative — a makeshift crime scene marker. A small hand-written note (Elara's, in a precise scripted hand on a card) is pinned to the tape: rendered as a visible card shape but with no legible text (per anchor). The cracked control panel has been sealed with a brass patch riveted crudely in place. The evidence cart has been moved aside but is still in frame, items arranged more neatly than before. The floor blood trail is dry now, darker, no longer bioluminescent. Through the open bulkhead at the far end the Medical Bay corridor is clearly visible — warm-gold, welcoming. The other pods' service lights have dimmed to a cooler wash as the Ark's power rotation has moved on. Mood: 'this place keeps its dead carefully, but it has already turned its attention elsewhere.'

## 5.2 Medical Bay shared layout sentence (lines 185–194)

> The Medical Bay seen from the doorway — a wide surgical chamber with a central examination bio-bed on a raised brass dais, diagnostic scanners arrayed in a half-ring around it, and banks of pharmaceutical fabricators along the left wall. The right wall carries a floor-to-ceiling DNA analysis station (a slow-rotating holographic double helix in phosphor-green), beside a medicine cabinet of labelled vials. The back wall is dominated by the bio-bed and its floating holographic readout over the headrest. Behind the bio-bed, recessed into the wall between cable conduits, a maintenance access panel is inset — its position is always visible, but whether it is closed, ajar, or open shifts per state. Glass underfoot near the bio-bed — crunched boot-sized footprints trail past it. Ceiling is vaulted hull-rib with copper conduit; walls are oil-blued steel with warm-gold service lamps and brass-rimmed signage placards. A reinforced bulkhead door on the left leads back to the Cryo Bay; a second sealed door on the right (amber seal-status) leads deeper into the Ark.

### `medical-bay:initial` — P0

Condition: Default state on entry: neither donated_dna_sample nor refused_dna_sample is set, device has not yet been engaged.

> [SHARED LAYOUT] STATE: first entry, the unkempt device dormant but findable. The maintenance access panel behind the bio-bed sits ajar by about 30° — not flung open, but clearly not latched, as if whoever was last in the room was in a hurry. Through the gap, a sliver of a brass-and-oil-blued-steel apparatus is visible: a neural-bridge rig with a short articulated needle-arm folded against its housing, a small smoked-glass capacitor window banked a barely-alive phosphor-lavender. A bundle of copper cables runs out of the panel and disappears into the wall conduit. The bio-bed's holographic readout is idle (flat cyan pulse). The DNA-helix station on the right wall rotates its slow green loop. The overall mood is 'something in here was meant to stay hidden, and someone left in a hurry.' No figures in frame. The device sliver is small in the frame (about 5%) — it rewards a player who looks.

### `medical-bay:device-awakened` — P0

Condition: Player has clicked the vox-neural-bridge hotspot and is mid-offer. No flag persisted yet (modal open).

> [SHARED LAYOUT] STATE: device awakened, offer extended. The maintenance access panel behind the bio-bed has been swung fully open (hinged to the right, held by a brass latch). The neural-bridge device is now fully visible: a chest-high apparatus of patinated brass and oil-blued steel, its central column bearing an arcane sigil ring that is breathing a warm-to-cold pulse of phosphor-lavender. The articulated needle-arm has extended from the housing and hovers above the bio-bed surface — a hair-thin chrome needle at its tip, a small sample-vial socket directly beneath it. A ring of fiber-optic ley-lines around the base of the device has come alive, tracing faint runic script across the floor plates in phosphor-lavender. The bio-bed's holographic readout has flipped from idle to ready — a single warm-gold glyph rotating slowly over the headrest. The room's warm-gold service lamps have dimmed slightly; the device is the dominant light source. Mood: 'the room is waiting for your answer.'

### `medical-bay:donated` — P0

Condition: `narrativeFlags.donated_dna_sample === true`. The device has taken a sample and delivered the rolled reward.

> [SHARED LAYOUT] STATE: donation complete, device dormant again, reward delivered. The maintenance panel remains open but the needle-arm has retracted fully into the housing. The device's sigil ring is now a cold, banked ember of phosphor-lavender — spent, not dead. A small brass receipt plate (about postcard-sized) rests on the bio-bed surface where the needle-arm was; its surface is engraved with a fresh radiant glyph and a clean class-species-element cant (rendered as glyph-shapes, not legible words per anchor). Beside the plate: the rolled-reward object itself (small enough to fit the bed — render as an indistinct brass-and-glass silhouette; the specific item is chosen at runtime by the earned-loadout roller, so the prompt must not commit to a shape). The bio-bed's holographic readout has returned to a gentle warm-gold idle pulse. A single sample-vial sits in the device's socket, its silver contents caught in the light. Mood: 'the trade is done; the room remembers.'

### `medical-bay:refused` — P0

Condition: `narrativeFlags.refused_dna_sample === true`. Player stepped back; device has powered down and re-concealed itself.

> [SHARED LAYOUT] STATE: refusal, device re-concealed. The maintenance access panel has been pulled closed but NOT latched — it sits flush with the wall with a single hairline seam visible, a quiet 'I am still here' rather than a sealed 'I am gone.' No phosphor glow escapes around the seam; the device behind it has fully powered down. The bio-bed's holographic readout is idle (flat cyan pulse), same as the initial state. On the floor beside the panel: a faint dust-free rectangle where the needle-arm had briefly extended — an absence the eye has to hunt for. The DNA-helix station on the right wall continues its slow rotation, indifferent. The warm-gold service lamps are back to their normal brightness. Mood: 'nothing was taken and nothing was given, and the room accepts both.'

---

# 6. Room tier art (Bridge + Engineering — 6 prompts)

**Source:** `apps/shared/roomTierArtPrompts.ts` (251 lines).
**Resolution:** 1920×1080.
**Asset-id format:** `<roomId>:t<tier>` (Tier 0/2/3 — Tier 1 reuses Tier 0).
**Style anchor:** re-exports `ROOM_STATE_STYLE_ANCHOR` (see §5).

## 6.1 Bridge layout (lines 72–82)

> The Command Bridge of the Inception Ark seen from the central nave — viewport-spanning back wall showing a curved smoked-glass observation panel of deep space, flanked by twin riveted-brass console stations with oxblood leather chairs. Centered on the back wall: a wheel-shaped Conspiracy Board display (the room's signature element) — a brass armature ringed with pinned tarot-shaped intelligence cards strung together with phosphor-lavender ley-line filaments. Mid-foreground: the Captain's chair raised on a small dais, its armrest terminal a dark smoked-glass slab. Foreground left: the alien-glyph Navigation Console with its oil-blued steel housing and warm-gold readout panel. Foreground right: the Diplomacy Table — a round brass-rimmed slab with seven holographic-projector sockets ringing its edge. Ceiling is vaulted hull-rib architecture in oil-blued steel; floor is textured plate metal with a faint compass-rose etched at frame center.

### `bridge:t0` — Dormant (entry) — P1

Condition: Default state on first entry: no investigative or operational flags set.

> [BRIDGE LAYOUT] STATE: dormant. Service lamps are dim — only the warm-gold floor strips along the dais are lit at half-intensity. The Conspiracy Board on the back wall is a static armature; pinned cards are present but their ley-line filaments are dark, threads unconnected. The Navigation Console's alien-glyph panel reads in cold-blue stand-by — no warm-gold authentication light. The Diplomacy Table's seven holographic projectors are off; the table is a blank brass disc. The Captain's chair shows a faint body-impression on the cushion — someone has sat here recently — but no figure is in frame. A thin layer of dust catches the dim light on the foreground console housings. Mood: 'this room is waiting.'

### `bridge:t2` — Activated (nav online) — P0

Condition: `narrativeFlags.fast_travel_unlocked === true`.

> [BRIDGE LAYOUT] STATE: activated. Service lamps have come up to full warm-gold. The Conspiracy Board's ley-line filaments are now lit — phosphor-lavender threads connecting roughly half the pinned cards, forming visible web-segments without yet completing the full pattern. Three threads still end at the same central blank pin. The Navigation Console's alien-glyph panel has flipped from cold-blue to warm-gold — its primary glyph ring rotates slowly with a stable authentication halo around it; a faint star-chart projection extends a few inches off the panel into the air. The Diplomacy Table's seven holographic projectors have cycled on, casting silhouette-only avatars of faction representatives at their seats — rendered as thin phosphor-lavender outlines so they read as 'present, indistinct.' The Captain's chair armrest terminal glows. Floor compass-rose is lightly lit. No figures in frame. Mood: 'the deck has remembered how to think.'

### `bridge:t3` — Restored (war table online) — P1

Condition: `narrativeFlags.bridge_war_table_online === true`.

> [BRIDGE LAYOUT] STATE: restored, war table online. The Conspiracy Board is fully threaded — every pinned card connected to its neighbors with luminous phosphor-lavender filaments, and the central blank pin now carries a single hand-pinned card with an etched sigil (no rendered text). The Navigation Console projects a full holographic star-chart sphere a foot off its surface, with traversal arcs lit between named systems. The Diplomacy Table's holographic faction avatars have resolved from silhouette to detailed phosphor-lavender carvings, mid-gesture as if in active negotiation. A new architectural element has appeared in the room: a central holographic War Map projector slab descends from the ceiling between the Captain's chair and the Conspiracy Board, casting a glowing tactical overlay onto the dais floor — territories, conflict zones, faction borders, all in warm-gold and phosphor-lavender. Service lamps are at full brightness; the compass-rose on the floor is fully lit. No figures in frame. Mood: 'this is now a command deck that decides things.'

## 6.2 Engineering layout (lines 89–98)

> The Engineering Bay of the Inception Ark seen from the deck-entry vantage — a working-shop interior anchored by a back-wall reactor housing in patinated brass and oil-blued steel, the reactor's smoked-glass containment lens centred at upper-mid-frame and breathing a phosphor-lavender pulse. Mid-foreground left: the Crafting Workbench — a chest-high brass-and-leather slab with a fusion socket, hand-tools racked on a wall-mounted board behind it. Mid-foreground right: a holographic Blueprint Projector — a low brass plinth throwing card-schematic lines into the air at chest height. Background right: a curved Research Station wall with twin terminals and a small experiment cubicle. Floor is textured plate metal with riveted expansion seams running radially out from the reactor base. Ceiling is exposed copper conduit and phosphor-green ley-line lighting routed along the hull ribs.

### `engineering:t0` — Dormant (bleeding capacity) — P1

> [ENG LAYOUT] STATE: dormant, bleeding. The reactor's containment lens pulses in a slow, weak phosphor-lavender — visibly under-driven, color-shifted toward a cold near-grey. A small warm-gold readout panel beside the reactor housing shows a stalled capacity gauge (rendered as a partial bar shape, no numerals). The Crafting Workbench is laid out for an unfinished job: tools fanned in the right hand, a blank fusion socket, a few half-prepped material slugs. The Blueprint Projector is dark; only the brass plinth itself is visible. The Research Station's twin terminals are dim with cold-blue stand-by glow. Phosphor-green ley-line lighting along the hull ribs has dropped to a thready intermittent flicker. Sparks visible in the foreground are absent. No figures in frame. Mood: 'someone walked away mid-fix.'

### `engineering:t2` — Activated (signal booster built) — P0

Condition: `narrativeFlags.engineering_signal_booster_built === true`.

> [ENG LAYOUT] STATE: activated. The reactor's containment lens has stabilised to a steady warm phosphor-lavender at full saturation; the capacity gauge beside it has filled to roughly two-thirds and stopped bleeding. Phosphor-green ley-lines along the hull ribs are now solid and bright, tracing a clear circuit pattern from reactor to workbench to Research Station. The Crafting Workbench is the dramatic focus of the frame: the fusion socket holds a finished Signal Booster — a brass-and-copper apparatus the size of a forearm, its central crystal arrayed with copper antenna spines, its base etched with a phosphor-lavender sigil ring that is breathing in time with the reactor. A few fresh orange sparks trail off the workbench surface as the build cools. The Blueprint Projector is now lit, showing a single card-schematic in the air above its plinth. The Research Station terminals have flipped to warm-gold active state. No figures in frame. Mood: 'a thing was made; the room is satisfied.'

### `engineering:t3` — Restored (research bench online) — P1

Condition: `narrativeFlags.engineering_research_bench_online === true`.

> [ENG LAYOUT] STATE: restored, research bench online. The reactor's containment lens runs at full warm phosphor-lavender; its capacity gauge is at maximum and a thin ring of phosphor-green ley-line light now wraps the entire reactor housing. The Crafting Workbench's fusion socket holds the finished Signal Booster from the previous tier and now also a small cluster of brass-cased component parts — the workbench is in active use, mid-job-after-job. The Blueprint Projector now displays three rotating card-schematics in the air at staggered heights, each haloed by phosphor-lavender light, with a faint connecting ley-line between them. The Research Station's twin terminals project a third holographic experiment rig in the air above its small cubicle — a translucent lattice of test-tube shapes and arc-glyph diagrams, all running simultaneously. Architectural addition: a fresh tool-rack panel has appeared on the back wall behind the workbench, lined with brass-cased instruments hung in rows. Floor radial seams now glow softly in phosphor-green. Orange sparks rise occasionally from multiple work surfaces. No figures in frame. Mood: 'this is a room that builds.'

---

# 7. Room media — nano-banana stills + Veo 3.1 videos (34 prompts)

**Source:** `apps/shared/roomMediaPrompts.ts` (957 lines).
**Image style anchor:** re-exports `ROOM_STATE_STYLE_ANCHOR` from §5.
**Video style anchor (lines 91–98):**

> Cinematographic constraints: 16:9 1920x1080 at 24fps. Locked camera unless explicitly cinematic. Match the still palette exactly: cold institutional steel, patinated brass, deep oxblood accents, warm-gold service lamps, phosphor-lavender and phosphor-green sorcerous-circuit glows. Soft rim-light from ceiling strips, single warm-gold key, visible dust-in-beam, faint film-grain sepia. No rendered text, no UI overlays, no watermarks, no captions, no figures unless explicitly named. Audio NOT generated (the engine drives audio separately). Loops must hide their cut point — match first and last frame.

**Shadow-Tongue corruption layer (lines 102–108)** (composable, append to base when applicable):

> Corruption layer (apply over base): a single artifact in frame is overwritten in an indigo hue that drifts toward a colour the eye cannot quite name (not blue, not violet, not magenta — a hue that reads as 'wrong'). RGB channel-shift on the artifact only, ~1px horizontal red/blue separation. Glyphs on the artifact appear in two layers — a warm-gold underlayer (the original) and a slightly out-of-register indigo overlayer (the edit). No hard glitch artifacts; the corruption is quiet, literary, deniable. The rest of the room is unaffected.

## 7.1 Stills (26 entries · `nano-banana-2` · `1920x1080`)

### Archives (3)
- **archives:corrupted** — P0 — `art/rooms/mystery-states/archives_corrupted.webp` — Condition: `narrativeFlags.shadow_tongue_corruption_seen === true`. Prompt: The Archives' main reading hall, wide architectural shot from the entry-arch vantage. Centre-back: the curved data-orb pedestal, dimmed to the unnameable indigo hue that drifts away from violet. Left and right walls: tall brass-framed scroll racks with frosted-glass fronts, behind which scrolls show two-layer text — a warm-gold underlayer in Elara's hand and a slightly out-of-register indigo overlayer that has rewritten select words. Foreground centre: the lectern stage, its stone base ringed in a faint indigo halo. Stage-right: a freestanding glass cabinet with a hand-stitched label (rendered as fabric texture only, no rendered text). Atmosphere: the room is intact, beautiful, undisturbed — but reading it is no longer neutral. Apply the Shadow Tongue corruption layer on the data-orb, the scroll-rack glass, and the lectern halo only — the rest of the room remains in standard warm-gold.
- **archives:uncorrupted** — P1 — `art/rooms/mystery-states/archives_uncorrupted.webp` — Condition: At least one `shadowTongueState.activeEdits` entry has been cleared via `clearActiveEdit`. Prompt: Same composition as archives:corrupted but the indigo hue has retreated. The data-orb glows warm-gold, the scroll-rack underlayer reads cleanly, the lectern halo is gone. A single rolled scroll on the lectern shows freshly-written warm-gold ink atop the dried indigo overlayer — visible victory. Atmosphere: relief, but the cabinet stage-right still hums faintly. The Editor is not gone, only stepped back. No figures.
- **archives:tier-fluent** — P1 — `art/rooms/mystery-states/archives_tier_fluent.webp` — Condition: `shadowTongueState.powerLevel ≥ 80` AND trust tier === 'fluent'. Prompt: Same composition as archives:corrupted. The unnameable hue is now legible to the camera — every surface that previously read as warm-gold now shows the indigo underlayer beneath, faintly. The data-orb pulses both colours simultaneously in counter-rhythm. The cabinet stage-right is open; its door swings on a slow hinge. Atmosphere: the Editor is not visible, but the room is no longer ambiguous about who has been writing. The viewer is reading both languages at once now. Apply the Shadow Tongue corruption layer across every text-bearing surface, not just the lectern — the corruption has fully bloomed.

### Comms Array (2)
- **comms-array:static-haunted** — P0 — `art/rooms/mystery-states/commsarray_static_haunted.webp` — Condition: `narrativeFlags.shadow_tongue_voice_heard === true`. Prompt: Comms Array operations bay, wide shot. Bank of CRT-style monitors filling the back wall — most show clean signal-traces in phosphor-green, but the central monitor (frame-anchor) shows pure static dimmed to the unnameable indigo hue. Within the static, a single column of vertical glyphs is faintly resolving — recognisable as Elara's hand but mid-rewrite. Foreground: a curved console with brass dials and oxblood-leather wrist-rests. The headset on the console hook is faintly humming a phosphor-lavender glow. Atmosphere: the room sounds full of one voice trying to be heard inside another. Apply the Shadow Tongue corruption layer on the central monitor only.
- **comms-array:signal-clear** — P1 — `art/rooms/mystery-states/commsarray_signal_clear.webp` — Condition: `narrativeFlags.bridge_systems_restored === true`. Prompt: Same composition as comms-array:static-haunted. All monitors now show clean signal-traces in warm-gold or phosphor-green; the central monitor displays a rolling waveform that resolves into a stable peak. The headset hum has gone steady gold. The room is operational, calm, productive. Atmosphere: this is what comms is supposed to feel like. No figures.

### Engineering (2 supplementary; tier 0/2/3 covered in §6)
- **engineering:edited-schematics** — P0 — `art/rooms/mystery-states/engineering_edited_schematics.webp` — Condition: `narrativeFlags.shadow_tongue_engineering_edits_seen === true`. Prompt: Engineering bay wide shot, framed on the workbench. The reactor occupies the back-right at half height, running but spitting a faint indigo plume from one valve. Centre frame: the workbench with a large unrolled blueprint pinned at four corners; the blueprint's lines are split into two registers — the warm-gold original and the indigo overlayer that has subtly redrawn three connection points. Tools scattered (brass calipers, an oil-blued wrench, a notebook open to a half-finished page). Apply the Shadow Tongue corruption layer on the blueprint and the reactor valve only. No figures.
- **engineering:restored-from-edits** — P1 — `art/rooms/mystery-states/engineering_restored_from_edits.webp` — Condition: `shadowTongueState.activeEdits` entry `engineering.reactor` cleared. Prompt: Same composition as engineering:edited-schematics. The blueprint shows a single register only — the warm-gold original, with a fresh hand-rubbing in graphite at one corner (proof of player labour). The reactor's indigo plume is gone; the valve glows steady warm-gold. The notebook on the bench has a new page filled with crisp diagnostic notes (rendered as ink-density only, no legible text). Atmosphere: someone fixed something that was being silently broken. No figures.

### Bridge (1 supplementary; t0/t2/t3 in §6)
- **bridge:annotations-visible** — P0 — `art/rooms/mystery-states/bridge_annotations_visible.webp` — Condition: `narrativeFlags.shadow_tongue_evidence === true` AND room tier ≥ 2. Prompt: Bridge command deck, wide architectural shot, viewed from the captain's-chair vantage looking forward. The tactical-display dome at centre-back glows phosphor-lavender; superimposed on it, faint indigo annotations float at three nodes — readable as marginalia in someone else's hand. The timeline-projector stage-left shows entries in two layers, one warm-gold and one indigo. Crew avatars are absent (Tier 2 — activated, not yet restored). Atmosphere: the room is busy thinking; some of the thoughts are not the Captain's. Apply the Shadow Tongue corruption layer on the tactical-display dome and timeline-projector only.

### Observation Deck (3)
- **observation-deck:initial** — P0 — `art/rooms/mystery-states/observation_deck_initial.webp` — Default state. Prompt: Observation Deck wide shot. Curved floor-to-ceiling viewport across the entire back wall, looking out onto a starfield with the faint sweep of a distant nebula. Foreground centre: a brass telescope on a free-standing pedestal. Floor: hexagonal tile pattern in oil-blued steel with phosphor-lavender grout-lines. Stage-right: a low cradle-pedestal with empty mounting clips (the purification crystal hasn't been placed yet). Atmosphere: contemplative, cold, awaiting. No figures.
- **observation-deck:bond-resonance** — P0 — `art/rooms/mystery-states/observation_deck_bond_resonance.webp` — Condition: `narrativeFlags.first_bond_resonance === true`. Prompt: Same composition as observation-deck:initial. The cradle-pedestal stage-right now holds a single faceted crystal pulsing a slow warm-gold rhythm, casting concentric ripples across the hex floor. The starfield through the viewport has a faint warm-gold afterimage at one star. Atmosphere: a quiet first triumph, two beings in tune. No figures.
- **observation-deck:purification-active** — P1 — `art/rooms/mystery-states/observation_deck_purification_active.webp` — Condition: `narrativeFlags.purification_crystal_activated === true`. Prompt: Same composition as observation-deck:initial. The crystal's pulse has accelerated and brightened; warm-gold light fills the room, casting hard shadows. The hex floor's phosphor-lavender grout has shifted to phosphor-gold. The viewport starfield is fully blanketed in soft golden afterimage. Atmosphere: cleansing power, tangible and active. No figures.

### War Room (2)
- **war-room:initial** — P0 — `art/rooms/mystery-states/war_room_initial.webp` — Default state. Prompt: War Room wide shot. Centre: a circular brass-edged holo-table, currently dormant (matte glass top). Walls: floor-to-ceiling racks of paper casualty-boards in oxblood-leather binders. Stage-left: a brass rack of folded signal-flags. Stage-right: a side-table with a half-empty cut-glass decanter and one used tumbler. Lighting: warm-gold key from above the holo-table, deep shadow at the room edges. Atmosphere: command silence between briefings. No figures.
- **war-room:active-conflict** — P1 — `art/rooms/mystery-states/war_room_active_conflict.webp` — Condition: `narrativeFlags.act_2_active === true` OR `war_room_briefing_open === true`. Prompt: Same composition as war-room:initial. The holo-table is alive — a phosphor-lavender three-dimensional theatre map projects above it, with red and gold faction markers in motion. Two casualty-boards on the back wall have been pulled and pinned open. The decanter is empty. Atmosphere: the room is mid-decision; whoever was here has stepped out for thirty seconds. No figures.

### Station Dock (2)
- **station-dock:initial** — P0 — `art/rooms/mystery-states/station_dock_initial.webp` — Default state. Prompt: Station Dock wide shot. Massive cylindrical airlock at frame-centre, brass-rimmed with deep-oxblood seal gaskets, currently sealed. Service alcoves to either side: stage-left a manifest console, stage-right a cargo-lift platform at floor level. Floor: heavy plate steel with hazard-stripe oxblood paint at the airlock perimeter. Atmosphere: industrial, expectant, the room before a journey. No figures.
- **station-dock:ship-docked** — P0 — `art/rooms/mystery-states/station_dock_ship_docked.webp` — Condition: `narrativeFlags.dock_first_ship === true`. Prompt: Same composition as station-dock:initial. The airlock is cycling open; warm-gold light spills from the inner ship through the half-opened seal, projecting a long shadow forward across the deck plates. The manifest console glows alive with rolling readouts. The cargo-lift has a single sealed crate on it, oxblood seals intact. Atmosphere: arrival, threshold, story-resumes. No figures.

### Engineering Core (1)
- **engineering-core:initial** — P0 — `art/rooms/mystery-states/engineering_core_initial.webp` — Default state. Prompt: Engineering Core wide shot. Centre-frame: the reactor coil — a vertical brass-and-steel cylindrical column ribbed with phosphor-green coolant pipes. Floor: a circular grating with the column rising through it. Stage-right: the core-terminal, a stand-up brass console with three large oxblood-leather-wrapped levers. Atmosphere: heat distortion in the air above the coil, a deep slow pulse of phosphor-green at the column's base, low warm-gold service lighting. No figures.

### Oracle Sanctum (2)
- **oracle-sanctum:initial** — P0 — `art/rooms/mystery-states/oracle_sanctum_initial.webp` — Default. Prompt: Oracle Sanctum wide shot. Centre-frame: a circular still-water oracle pool sunk into the floor, surrounded by a low brass rim engraved with sigils. Back wall: a brass-pedestal'd prophecy-tablet at standing height. Stage-right: a hanging incense-brazier on a chain, smoke drifting in slow phosphor-lavender. Lighting: low warm-gold from sconces, the pool itself faintly luminous from below. Atmosphere: hush, ritual readiness, very few hard edges. No figures.
- **oracle-sanctum:prophecy-active** — P1 — `art/rooms/mystery-states/oracle_sanctum_prophecy_active.webp` — Condition: `narrativeFlags.oracle_consulted === true`. Prompt: Same composition as oracle-sanctum:initial. The oracle pool's surface is broken into slow concentric rings, glowing warm-gold from below. Above the pool, a faint phosphor-lavender glyph hovers half-formed in the air. The prophecy-tablet on the back wall has begun to display warm-gold script (rendered as abstract glyphs only, no legible text). The incense smoke now coils more deliberately. Atmosphere: something is speaking; the room is listening. No figures.

### Shadow Vault (3)
- **shadow-vault:cell-sealed** — P0 — `art/rooms/mystery-states/shadow_vault_cell_sealed.webp` — Default. Prompt: Shadow Vault wide shot. Centre-frame: a sealed-cell glass containment, a tall reinforced-glass cylinder full of the unnameable indigo hue (so dense the eye cannot resolve depth). Floor surrounding the cell: oil-blued steel inscribed with brass-inlaid containment sigils. Stage-left: a manuscript-pile on a low pedestal — leather folios stacked carelessly. Stage-right: the warden-terminal, a brass console with a single phosphor-lavender readout. Foreground centre: a long brass lever in a neutral position. Lighting: extremely cold, all rim-light, no key — the cell itself provides the only colour in the room. No figures. Apply the Shadow Tongue corruption layer concentrated entirely inside the cell glass — the surrounding room is uncorrupted but cold.
- **shadow-vault:cell-released** — P0 — `art/rooms/mystery-states/shadow_vault_cell_released.webp` — Condition: `shadowTongueState.grandEditActive === 1`. Prompt: Same composition as shadow-vault:cell-sealed. The cell-glass has cracked at the base; the unnameable indigo has begun to seep along the floor sigils, lighting them in an out-of-register glow. The manuscript-pile is unbound — folios float in mid-air around the room. The warden-terminal is dark. The lever is fully thrown. Atmosphere: the room has just made a decision and the decision was the wrong one. Apply the Shadow Tongue corruption layer across the entire room.
- **shadow-vault:cell-resealed** — P0 — `art/rooms/mystery-states/shadow_vault_cell_resealed.webp` — Condition: `shadowTongueState.grandEditActive === 0` AND `shadow_vault_released_then_sealed === true`. Prompt: Same composition as shadow-vault:cell-sealed. The cell-glass is restored but visibly scarred — a hairline brass weld traces around its base. The indigo within is dimmer, retreated. The manuscript-pile is bound and stacked. The warden-terminal glows steady warm-gold. The lever is in the neutral position with a small brass lock-plate fitted. Atmosphere: the room remembers what almost happened. No figures.

### Cipher Den (1)
- **cipher-den:initial** — P0 — `art/rooms/mystery-states/cipher_den_initial.webp` — Default. Prompt: Cipher Den wide shot. Centre-frame: a long oak-and-brass desk angled to camera, holding the rosetta-pad (a thick brass-bound codex on a reading-stand) and a stack of encrypted-correspondence folios. Back wall: an entire wall of cubbyholes filled with rolled letters tagged in oxblood ribbons. Stage-left: the dictionary-of-edits — a freestanding lectern with a perpetually-open book whose pages turn themselves slowly. Stage-right: the uncorruption-bench — a worktop with a brass-rimmed magnifier on a swing-arm and small bottles of ink. Lighting: warm-gold from a single hooded desk-lamp, the rest of the room in shadow. Atmosphere: scholarly, suspicious, lived-in. No figures.

### Species-exclusive bonus rooms (6 · P2)
> Gated by `canAccessRoom()` in `apps/shared/characterCreationImpact.ts`; only ~⅓ of players see each.

- **the_elemental_forge:initial** — `art/rooms/species/the_elemental_forge_initial.webp` — DeMagi only. Prompt: A circular forge chamber carved into volcanic basalt. Centre-frame: a brass-bound crucible-of-origins suspended over a slow-pulsing magma vent, ringed by eight inscribed brass tiles (one per element). Stage-left: an ancestral anvil, three meters tall, its face polished mirror-bright by centuries of strikes. Stage-right: a rack of unfinished elemental weapons, half-shaped. Lighting: warm magma-gold from below, cold steel rim-light from above. Atmosphere: ancestral memory at working temperature. No figures.
- **blood_archive:initial** — `art/rooms/species/blood_archive_initial.webp` — DeMagi only. Prompt: A vault chamber lined floor-to-ceiling with brass-bound lineage codices, each chained to its shelf. Centre-frame: a freestanding shrine — a low oxblood-leather altar holding a single covered relic under glass. Floor: red-veined marble inlaid with brass family-tree branches. Lighting: cold rim-light, single warm-gold key on the relic only. Atmosphere: hush of ancestral debt. No figures.
- **probability_chamber:initial** — `art/rooms/species/probability_chamber_initial.webp` — Quarchon only. Prompt: A spherical observation chamber with curved phosphor-lavender walls. Centre-frame: a wavefunction-rig — a brass armature suspending a translucent quartz orb that pulses through superposed images of itself. Stage-right: a low brass tray holding twelve hand-carved dice-of-states, each inscribed with an unknown sigil. Floor: oil-blued steel etched with an interference pattern. Lighting: phosphor-lavender ambient, no key. Atmosphere: every state is true and waiting to collapse. No figures.
- **dimensional_observatory:initial** — `art/rooms/species/dimensional_observatory_initial.webp` — Quarchon only. Prompt: An octagonal observatory with a vaulted ceiling. Centre-frame: a rift-lens — a brass-and-glass aperture pointing upward, currently showing a fractal slice of an unfamiliar starfield. Back wall: a dimension-loom, a vertical brass frame strung with phosphor-lavender threads weaving themselves into a slow-shifting tapestry (rendered as abstract glyph patterns, no legible text). Lighting: cold phosphor-lavender from the aperture, deep oxblood accents on the floor. Atmosphere: a window onto somewhere the camera was not invited. No figures.
- **hybrid_sanctum:initial** — `art/rooms/species/hybrid_sanctum_initial.webp` — Ne-Yon only. Prompt: A long narrow chapel-room with an axial mirror down the centre dividing it into two halves. Centre-frame: a dual-altar — one half forged in DeMagi brass-and-magma motifs, the other in Quarchon phosphor-lavender-and-glass. The dividing mirror is severed at chest height, hairline crack widening to a notch where the two altar halves meet. Lighting: warm-gold on the brass half, phosphor-lavender on the glass half, neutral cold rim where they meet. Atmosphere: reconciled tension, neither side dominant. No figures.
- **the_between:initial** — `art/rooms/species/the_between_initial.webp` — Ne-Yon only. Prompt: A liminal chamber with no clear walls — the floor dissolves into mist about three meters out from the centre. Centre-frame: a single brass threshold-stone, knee-high, set in a circular pool of still water that reflects a ceiling that isn't there. Lighting: ambient warm-gold from no visible source, phosphor-green mist below the floor-line. Atmosphere: a doorway that goes nowhere and everywhere; this is the room between rooms. No figures.

## 7.2 Videos (8 entries · Veo 3.1)

- **shadow-tongue:text-corruption-loop** — P0 — `art/rooms/videos/shadow_tongue_text_corruption_loop.mp4` — `1920x1080@24fps,8s loop`. Cross-room ambient overlay. Prompt: 8-second seamless loop. Locked camera. Tight framing on a single Archives data-bank panel that fills 60% of frame, the surrounding room blurred to phosphor-lavender bokeh. Frame 0: the panel's glyphs resolve cleanly in warm-gold (Elara's hand). From frame 24 to frame 96, individual characters glitch one at a time toward the unnameable indigo hue and silently rewrite themselves into a slightly different glyph — never enough to be obviously different, always enough to read as wrong. From frame 96 to frame 192, the rewrite reverses, returning each character to its warm-gold original. Subtle ~1px RGB channel-shift on each rewrite event, no full glitch artifacts. Loop point invisible: frame 192 must equal frame 0. No rendered text legible to the player, no UI, no figures.
- **archives:glyph-rewriting-loop** — P0 — `art/rooms/videos/archives_glyph_rewriting_loop.mp4` — `1920x1080@24fps,10s loop`. Condition: in archives AND `shadow_tongue_corruption_seen === true`. Prompt: 10-second seamless loop. Locked camera, slight 2% slow-zoom-in across the loop then snap-cut back to start (cut hidden by a one-frame indigo flash). Wide-shot framing of the Archives reading hall from the entry-arch vantage. Across the loop, glyph-bands on the curved back-wall data-banks slowly migrate left-to-right by ~6 pixels and rewrite themselves character-by-character; the warm-gold underlayer remains constant; the indigo overlayer drifts. Scrolls in the rack glass on left and right walls show the same effect at quarter-speed. The data-orb at room-centre pulses once per second, alternating warm-gold and unnameable-indigo. No figures, no audio, no rendered legible text.
- **bridge:fast-travel-unlocked** — P0 — `art/rooms/videos/bridge_fast_travel_unlocked.mp4` — `1920x1080@24fps,6s one-shot`. Condition: `fast_travel_unlocked` false→true. Prompt: 6-second one-shot cinematic. Camera starts on a slight handheld float above the captain's chair vantage, then dollies forward toward the tactical-display dome over 4 seconds. Frame 0–48: the dome is dark, sigils on its rim faintly etched. Frame 48–96: warm-gold phosphor begins to fill the rim sigils one at a time in a clockwise sweep, accompanied by a single bright-key lighting flash on frame 72 (visible as a soft dust-in-beam burst). Frame 96–144: the dome interior blooms into a holographic ley-line web — a 3D map of the Ark with phosphor-lavender lines connecting room-nodes, each node lighting in warm-gold one after another. End frame holds for 12 frames on the fully-lit web. No figures, no audio, no rendered text — just the geometry of the map itself.
- **comms-array:signal-discovery** — P0 — `art/rooms/videos/comms_array_signal_discovery.mp4` — `1920x1080@24fps,5s one-shot`. Condition: `shadow_tongue_voice_heard` false→true. Prompt: 5-second one-shot. Locked camera framed centred on the comms-array's central CRT monitor at 70% of frame. Frame 0–60: pure phosphor-green static. Frame 60–96: the static dims to the unnameable indigo hue and begins to organise — vertical bands resolve into the silhouette of a face composed entirely of glyphs (recognisable as a face only by negative space), holding for exactly 12 frames at frame 96. Frame 108–120: the face dissolves back into static, but the static now has a faint warm-gold underlayer barely visible through the indigo. End frame holds. RGB channel-shift peaks at frame 96 (~3px) then settles to 1px. No audio, no rendered text, no other figures.
- **cryo-bay:awakening** — P1 — `art/rooms/videos/cryo_bay_awakening.mp4` — `1920x1080@24fps,12s one-shot`. Plays on game-start before any flag is set. Prompt: 12-second one-shot cinematic. Camera begins inside a closed cryo-pod looking outward through frosted glass — the room beyond is barely visible, all colour washed pale. Frame 0–48: the frost on the glass begins to retreat from the centre outward, revealing more of the cryo-bay environment in cold blue-green tones. Frame 48–96: a phosphor-lavender stasis-readout HUD on the pod's interior glass briefly illuminates (rendered as abstract bars only, no legible text), then dims. Frame 96–192: the pod's seal cracks audibly (audio engine-driven, do not generate); a slow vertical pull pushes the glass aside; warm-gold service-lamp light spills in from the room beyond, slowly washing the cold colour away. Frame 192–288: camera holds on the open pod-frame; the room beyond is now visible in full warm-gold/oxblood/phosphor-lavender palette; a single character row of cryo-pods recedes into shallow depth-of-field. End frame holds 12 frames. No figures.
- **shadow-vault:meeting** — P0 — `art/rooms/videos/shadow_vault_meeting.mp4` — `1920x1080@24fps,8s one-shot`. Condition: First entry shadow-vault AND `shadow_tongue_face_to_face` set. Prompt: 8-second one-shot cinematic. Camera begins at the room's threshold; over 5 seconds, dollies slowly forward toward the sealed-cell glass cylinder, ending at half a meter from the glass. Frame 0–48: the cell appears as featureless dense indigo. Frame 48–96: as the camera nears, faint glyph-shapes begin to coalesce inside the indigo — like text seen through deep water. Frame 96–144: a single silhouette resolves — humanoid in proportion only, edges defined by the absence of indigo rather than presence of form. Frame 144–168: the silhouette tilts its head slightly, registering the camera; one indigo-on-indigo glyph in the cell visibly rewrites itself in a single frame, sending a ripple through the entire cell. End frame holds 24 frames. The room around the cell remains uncorrupted, very cold, very still. No audio, no figures outside the cell.
- **observation-deck:bond-resonance-pulse** — P1 — `art/rooms/videos/observation_deck_bond_resonance_pulse.mp4` — `1920x1080@24fps,10s loop`. Condition: in observation-deck AND `first_bond_resonance === true`. Prompt: 10-second seamless loop. Locked camera framed on the observation-deck purification-crystal in its cradle-pedestal at 40% of frame, with the panoramic starfield viewport visible behind. Frame 0: the crystal pulses with a slow warm-gold heartbeat. Across the loop, every 2 seconds the crystal emits a soft warm-gold ripple that propagates outward across the hex floor, fading by frame 96; on the second pulse the starfield in the viewport ripples once in a faint warm-gold afterimage; on the third pulse a single distant star momentarily brightens. Frame 240 returns to identical state of frame 0. No figures, no audio, no rendered text.
- **engineering:schematic-edit-reveal** — P0 — `art/rooms/videos/engineering_schematic_edit_reveal.mp4` — `1920x1080@24fps,6s one-shot`. Condition: `shadow_tongue_engineering_edits_seen` false→true. Prompt: 6-second one-shot cinematic. Camera framed top-down on the engineering workbench, looking straight down at the unrolled blueprint. Frame 0–48: the blueprint shows clean warm-gold lines defining a reactor-coolant schematic. Frame 48–96: a shadow-shaped indigo brush passes across three connection points on the diagram (the brush is implied by motion, no figure visible — only the blueprint's lines being touched); each touched line erases and rewrites itself in indigo overlay, slightly redirecting the connection. Frame 96–144: camera pulls back to reveal the wider workbench — the rest of the room is unchanged, the blueprint now shows two registers (warm-gold underlayer + indigo overlayer). End frame holds 24 frames. RGB channel-shift on the blueprint only, ~1px. No figures, no audio, no rendered legible text.
