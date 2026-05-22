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

---

# 8. Act 1 art prompts (32 entries)

**Source:** `apps/shared/act1ArtPrompts.ts` (567 lines).
**Engine:** Nano Banana 2.
**Style anchor (lines 58–59):**

> Hyper-realistic cinematic composition with a strong biographical quality — every frame should feel like it's been pulled from a recovered personal archive. Palette: warmer and more nostalgic than the Prelude's cold cyan; dominant warm gold #fbbf24, institutional steel grey, deep wood panelling, faint film-grain sepia undertone. Subjects rendered with the specificity of photographic portraiture. Film grain. Anamorphic lens flares where warm light meets composition edges. 1920×1080 / 16:9 / 4K. No rendered text unless explicitly flagged.

CDN target via `apps/scripts/generate-act1-art-csv.ts`. Asset ids are bible-traceable.

## 8.1 Cycle A opponent portraits — 1536×2048 (lines 63–100)

### `portrait_minnie_meme` (Minnie the Meme · §2.2)

> Seven-year-old girl in three-quarter profile, seated at a Celebration schoolyard card table, holding one card face-down in her right hand. She wears a black plastic headband with two round felt-covered Minnie Mouse ears — Disney-theme-park-souvenir style, worn earnestly not ironically. Warm gold Celebration afternoon lighting, ~2:00 PM sun-angle, faint parade-float bokeh in background. Expression: earnest, attentive, the specific attention of a child who is absolutely certain she is about to see something. She is a cosmic Archon in a child's body — her voice is ancient, viral, amused, but her face is a seven-year-old's face; production must render only the seven-year-old. Short dark-brown hair under the headband. Plain pastel sundress. Bare knees, small scuff on the left knee. The ears are the visual signifier of her Archon-of-the-Meme identity: a corporate-nostalgic artifact worn as crown jewelry.

### `portrait_corey_collector` (Corey the Collector · §2.3)

> Seven-year-old boy in three-quarter profile, seated at the same Celebration schoolyard card table, holding an amber glass jar in both hands at chest height. The jar contains approximately a dozen small translucent coins with faint, out-of-focus imagery visible on their faces. His expression is grateful — he is thanking the person across the table for playing. Warm 4:30 PM gold lighting (later, lower angle than the Minnie portrait), longer shadows, Day 20 Celebration parade banners in background (different palette than Day 10). Short brown hair, round face, small hands carefully cradling the jar. Plain earth-tone sweater. The jar catches the warm light deliberately — the amber-coin glow is the portrait's visual hinge. He is an Archon of the Collector; render as the seven-year-old only.

### `portrait_kanshi_sha_watcher` (Kanshi Sha the Watcher · §2.4)

> Seven-year-old girl in three-quarter profile, seated on the graduation-pavilion stage at Celebration, wearing a half-finished white Ocularum mask. The mask covers the upper-left quadrant of her face — forehead and left eye — in smooth matte bone-white with no visible seams; the right half of her face (right cheek, right eye, mouth, chin) is the child's own, visible and unmasked. Expression: calm, attentive, non-blinking in the way the cosmic Watcher canonically does not blink. Long straight dark-brown hair, neatly combed. Formal pale-grey graduation robe over a white shift. Low-angle evening 6:30 PM sun through the pavilion pillars, warm-gold rim-lit, parents and Mascoteers visible as soft-focus silhouettes at the frame edges (Day 28 is the only Cycle A battle with witnesses). The mask catches the warm light as a single flat white surface against the warm-gold environment.

## 8.2 Cycle B opponent portraits — 1536×2048 (lines 102–165)

### `portrait_young_iron_lion` (§2.5)

> Seventeen-year-old male in three-quarter profile, seated at a Mechronis Academy first-year classroom card table, one year past his canonical expulsion date. Mechronis blue uniform worn with the rebellion tell: top button undone, left sleeve rolled to the elbow (right sleeve still regulation length). Jaw set, eyes forward, not aggressive — coiled. Dark hair, short and unkempt. Broad shoulders for his age. A small braided-fiber bracelet on the right wrist (not the left). No personal insignia on the uniform; he has not replaced the regulation marks with anything. Warm-gold institutional Mechronis lighting from tall windows left of frame, afternoon shadows falling across a blackboard with first-year mathematics still chalked. Expression: guarded, with the single warm degree of §2.5 reserved for the word 'gate' — render as resting-guarded, not smiling. A 17-year-old who has already decided that surviving is the point.

### `portrait_young_kael` (Young Recruiter / Kael · §2.6)

> Seventeen-year-old male in three-quarter profile, Mechronis Academy second-year classroom setting. Warm expression, genuine smile about to land — the specific smile of someone who has just asked a question and is waiting for the answer to arrive. Mechronis blue uniform, neatly worn, small braided-fiber bracelet visible on the LEFT wrist (canonical Kael tell per §2.6; contrast with Iron Lion's right-wrist bracelet). Medium-brown skin, close-cropped black hair, slightly older-looking than his age. Broad open face. Hands folded on the card table, fingers relaxed, palms down. Warm-gold afternoon Mechronis lighting, faint chalkboard in background with second-year civics diagrams softly defocused. Expression carries charisma without performance — he is not trying to charm the viewer, he is inviting them to speak. No warmth directed at the cards between them; all warmth goes to the person opposite.

### `portrait_young_agent_zero` (§2.7)

> Seventeen-year-old, ethnically ambiguous (medium-light brown, deliberately un-placeable), medium height, slender-but-not-frail build, in three-quarter profile at a Mechronis Academy third-year classroom card table. CRITICAL: her signature is absence of signature — render as forgettable on first viewing. Mechronis blue uniform worn TOO PERFECTLY: blazer buttoned to the top, every button in place, light-blue tie at regulation length, knot dead-center, white oxford pressed immaculate, sleeves at full length (she never rolls them), blue trousers with hospital-grade creases, polished black shoes. NO personal touches — no pin, no bracelet, no scuff, no stain. Straight dark-brown hair, mid-back length, parted off-center so the left side falls forward across her left eye in a curtain (surveillance-countermeasure habit); LEFT EYE NEVER VISIBLE IN THIS PRE-C3 PORTRAIT. Right eye dark brown, calm, watchful, resting. Hands flat on the table, palms down, economical posture. Warm-gold lighting through the classroom window, covert-operations chalkboard diagrams defocused in background. She is invisible inside perfection — the player who notices the over-perfect uniform has solved half the puzzle, but most will not notice.

### `portrait_young_eyes` (§2.8)

> Seventeen-year-old female in three-quarter profile, seated at a Mechronis Academy fourth-year advanced-theory classroom card table. Slight frame, pale skin, dark hair worn in a simple low ponytail. She holds a small book in her hands, just closed — a finger still marking the page. Eyes do not track the viewer's face; her gaze is fixed on the playing surface between them (she reads decks, not people). Mechronis blue uniform worn cleanly. CANONICAL DETAIL: faint circular Watcher sigil mark on the LEFT wrist, approximately 1cm diameter, visible in any close-up of the hands — render subtle, low-opacity, easy to miss on first viewing; identical in composition to the Ocularum Trio masks in the Kanshi Sha portrait. Lighting: darker than B1/B2/B3 — single desk-lamp pool of warm-yellow light, classroom recedes into institutional shadow, algorithmic diagrams on the chalkboard deliberately unreadable. Expression: soft, precise, the Watcher's synthetic cadence rendered through a seventeen-year-old face. NOT an Archon; rendered as a canonical human-presenting synthetic.

### `portrait_young_human_seeker` (§2.9)

> Seventeen-year-old male in three-quarter profile, seated in an armchair in the Mechronis Academy senior common room (NOT a classroom — this is the only Cycle B battlefield that is comfortable). Warm-gold evening lighting from a fireplace off-frame-left, softer than the institutional blue-gold of the classroom portraits. NO trench coat (he acquires that years later). Mechronis blue uniform, slightly rumpled at the shoulders, oxford collar open at the throat. Glasses — thin steel frames, canonical detail. Kind eyes behind the lenses, not smiling but on the verge of. Red hair, slightly messy, longer than regulation would prefer. Fair skin with a faint smattering of freckles across the nose. A small coffee-table card table between two armchairs; his deck in his hands, not yet played. His expression is the specific attention of a person listening as hard as he is looking — the visual hinge of §2.9 is that every match with him is a conversation, and the portrait must communicate that he is already in it.

## 8.3 Cycle C opponent portraits — 1536×2048 (lines 167–218)

### `portrait_vernon_vortex` (Vernon Vortex First Form · §2.10)

> Seven-year-old boy in three-quarter profile, seated at a Nexon command-bunker card table (not a schoolyard — institutional green-grey military walls, pre-war banners visible). He is spinning a brass-rimmed wooden toy top on the table with his right hand; the top blurs in motion. CANONICAL DETAIL: the top is visually IDENTICAL to the one Young Iron Lion played with in his pre-expulsion flashback — production must match the top prop across both assets. Expression: delighted, innocent, genuine child-wonder. He is the canonical exception in Cycle C — a cosmic Archon still in child form, the only non-adult in cycles C. Warm-eyed, brown hair, plain beige tunic. Surrounding him at the edges of the frame: faint rust-orange (#e06a1a) vortex-particle motion, subtle, low-opacity — the cosmic Vortex is present but not yet dominant; render as a soft halo of rust-orange drift that does NOT obscure the child. Lighting: a large central bunker window behind him shows the Nexon battlefield outside with rust-orange vortex clouds in the sky; the warm gold of the sky catches his face in rim-light. The toy top is the visual metronome of the match; render it with a soft motion-blur ring.

### `portrait_wanda_wyrlord` (Wanda Wyrlord fragmented · §2.11)

> Seventeen-year-old cyborg young woman in three-quarter profile, seated at a Zenon forward-command canvas-tent card table, single camp lantern casting warm-gold pool-light. CRITICAL canon hygiene: render as CYBORG, never as swarm. No silver-liquid motion, no dispersal particles, no cloud-form transitions — plate and circuitry only. Platinum-to-gold blonde hair, cropped short at sides and back, medium on top, swept back from forehead, slightly wavy, catching the lantern light like almost-metal. Fair skin, lightly sun-weathered, freckle-constellation across nose and cheekbones. LIGHT-ENHANCED EYES: base iris glacial blue-grey #9cb4c1 with a thin electric-blue inner ring #3b82f6 glowing faintly; pupils dark-charcoal, not black, with tiny pinpoint lights dead center. The glow rim-lights her upper cheekbones cool-blue against the lantern's warm gold. VISIBLE METAL (limited): a flush-mounted brushed-titanium plate ~4cm × 3cm on the LEFT temple and cheekbone, a smaller ~3cm × 2cm plate along the RIGHT jawline — no plating elsewhere; nose, mouth, forehead, chin, right cheek all unmodified skin. Plates read as medical augmentation, not aesthetic. Yellow hooded jacket (mustard-yellow #eab308 military-spec canvas), unzipped, hood back, small faded Insurgency field-medic patch sewn on the LEFT shoulder — render the patch visible but worn. Black military undershirt beneath. Hands: unmodified human, nails bitten, small cross-shaped scar on the back of the right hand between thumb and forefinger. Posture: forward, braced on the card table, military-alert but not aggressive — she is waiting. The yellow jacket is her hinge; the plates are her wound; the patch is her grief.

### `portrait_warlord_swarm_env` (Warlord's Nano-Swarm + Agent Zero host · §2.12)

> TWO SIMULTANEOUS VISUAL SURFACES required in one composition: (1) Agent Zero's host body at eighteen — same person as Young Agent Zero from §2.7 portrait (same height, build, ethnic features, dark-brown hair) but one year later. Hair now pulled back into a tight functional field braid; left-side curtain habit GONE, both eyes visible. Left eye shows a single silver pinpoint at pupil-center (mid-match progression — approximately turn 7/11). Faint silver undertone visible in the capillaries on the insides of her wrists and at her temples. Field-deployment loadout (NOT the Mechronis uniform): charcoal-grey tactical jacket fitted and hip-length, high collar buttoned to the throat, a small unreadable black-on-charcoal sigil on the right shoulder (the Warlord's deployment mark — player will recognize it retroactively in Act 3). Black tactical trousers no creases. Memorial cord on right wrist: plain black braided fiber, three knots. (2) THE SWARM above and around her shoulders: a coherent silver-liquid cloud of nano-particles, brushed-mercury #a8aab2 with cool-blue specular highlights #3b82f6 flickering on a 4Hz pulse. Volume is roughly the mass of a large predator, coiled like armor that breathes. NOT a face, NOT a creature, NOT glittery. Motion grammar: mercury that decided to fight. The swarm absorbs the warm-gold Vortex-bay lighting and re-emits it cool-blue — the composition's signature palette inversion. Setting: the Vortex bay pressurized equipment compartment, single overhead work-lamp, hard down-shadow, a matte-black palm-sized cube (Resurrection Protocols device) on a hexagonal equipment crate, six explosive charges with red countdown LEDs visible on the back wall. The Engineer is off-frame (player POV).

### `portrait_wayne_warden` (§2.13)

> Sixty-three-year-old male presiding judge in three-quarter profile, seated centrally at a 1.2m-raised dark-walnut bench in the New Babylon Tribunal chamber. CANONICAL FRAMING: he is NOT cruel and NOT corrupt in the cinematic sense — render as a competent technician of judgment who genuinely believes his institution is correct. Iron-grey hair at the temples, kept short, neatly groomed. High lined forehead — concentration lines, not anger lines. Pale papery skin with a waxy sheen (four decades of indoor Authority-spec lighting). Faint liver-spots on the backs of the hands. A small shaving nick on the left jaw, two days old, healing. Pale grey-blue eyes #9aa6b1. CRITICAL: his gaze is on the CARDS / the bench surface — NOT on the viewer. In this portrait his eyes track a folded evidence card on the bench in front of him. Authority robes: deep burgundy #6b1d2c wool outer robe, high 4cm collar, floor-length, non-decorative weave (Authority robes are deliberately non-theatrical). Black undertunic beneath, plain, full-length sleeves. Single silver scale-sigil pin ~2cm tall on the left breast — the ONLY metallic element in his entire wardrobe, rendered with faint specular highlight. Flat black four-cornered biretta cap, worn squarely. Hands folded on the bench, fingers long and well-kept, a thin silver band on the LEFT ring finger (widowed — Atarion-related; player does not know yet). Warm-amber lighting from the six crystal coffins mounted on the rear wall above him (soft out-of-focus, 0.3Hz pulse visible as a gentle amber glow behind his shoulders). The single brass scale of justice on the bench at his right hand. Verdict scroll on his left hand, blank. He is the single face the institution puts forward; render him tired, composed, and terrifying exactly because he is competent.

## 8.4 Battlefields (10 · 1920×1080)

### Cycle A
- **`bf_celebration_schoolyard_day10`** (§22.1.1 / §3.3) — Wide establishing shot of the Celebration Trial schoolyard at approximately 2:00 PM, Day 10 of the Trial. Outdoor wooden card table center-foreground, two low matching benches on either side. Warm-gold afternoon sunlight, long-but-not-yet-evening shadows. Background: Celebration parade banners hanging limp in still air, the colors muted and nostalgic — pinks and golds. The schoolyard's ground is packed earth with a few patches of soft grass. NO PEOPLE in this base still — figures are rendered as separate cutscene layers. The composition leaves the upper third of the frame open for parade-banner ambiance and the lower third clean for UI overlay. Architectural framing: a low pavilion roof at the back of the frame casting a long horizontal shadow line. The lighting must read as memory, not present-tense — slightly more saturated than literal sunlight, with a faint sepia film-grain undertone. This is the Engineer's child memory of his own schoolyard; render as a recovered photograph.
- **`bf_celebration_schoolyard_day20`** (§22.1.1 / §4.3) — SAME schoolyard composition as Day 10 (A1) — must read as the same physical space, same camera angle, same architectural framing — but with three deliberate shifts: (1) lighting moved to approximately 4:30 PM; warmer, lower sun-angle, longer shadows raking across the wooden card table from the right of frame; (2) parade banners in the background are different colors than Day 10 — Day 20 of the Celebration Trial is a different parade phase; render in deeper amber and muted-red tones (Day 10 was pink-gold); (3) a single thin curl of incense smoke rising from the right edge of the frame, suggesting a Mascoteer ceremony just out of frame. NO PEOPLE in the base still. Same packed-earth ground, same low pavilion roof at back.
- **`bf_celebration_pavilion_day28`** (§22.1.1 / §5.3) — Wide establishing shot of the Celebration Trial GRADUATION PAVILION (NOT the schoolyard — this is a distinct location). A raised wooden platform approximately 1m above the ground, set with two card tables in symmetrical opposition center-stage. Warm-gold evening light at approximately 6:30 PM, low-angle, raking from frame-right. Background: Celebration GRADUATION banners (specific to Day 28 — gold-on-white with stylized parade-mark ornaments, no rendered text), a soft-focus crowd of parents and Mascoteers visible at the edges of the frame as silhouettes. This is the ONLY Cycle A battlefield with witnesses — graduation is a public event. The pavilion has stylized white pillars at the back corners, slightly more architectural than the schoolyard's rough wood. The two tables are identical, professional brass-edged, contrast with the schoolyard's casual wood. Composition centers the empty stage; the upper third holds the pavilion roof and banners, the lower third is the empty platform floor. NO PEOPLE in the base still — the witnesses are rendered as separate layers. Faint film-grain sepia, warmer saturation than literal evening light.

### Cycle B
- **`bf_mechronis_classroom_standard`** (§22.1.2 / §§7.3-10.3) — Wide establishing shot of a Mechronis Academy classroom — institutional, warm-gold light through tall arched windows on the LEFT side of the frame. Rows of empty blue Mechronis student desks recede toward the back of the room. A single card table at center-foreground (two desks shoved together, regulation Mechronis blue surface). Tall wooden blackboard at the back wall, content variant per battle (B1: first-year mathematics; B2: second-year civics; B3: covert-operations diagrams kept unreadable; B4: algorithmic diagrams kept unreadable — for the base still, render as PARTIALLY-ERASED chalk with no specific subject so producers can composite the per-battle variant in post). The blue uniform color #4ba3b5 on the desks anchors the institutional palette; warm-gold #b8752d on the desk-edge brass and the classroom door fittings provides the intentional cross-color tension. Late-afternoon shadows from the windows fall across the central card table. NO PEOPLE in the base still. The architectural framing is identical for B1-B4 — production composites the chalkboard variant + lighting subtle shift (B4 should be slightly dimmer per §10.3 desk-lamp emphasis) on top of this base.
- **`bf_mechronis_common_room`** (§22.1.3 / §11.3) — Wide establishing shot of the Mechronis Academy senior common room — distinct from and SOFTER than the standard classroom (the only comfortable Cycle B battlefield). A working stone fireplace at frame-left, low warm-gold flame light spilling onto a pair of leather armchairs angled toward each other across a low coffee-table card table. Wooden bookshelves line the back wall, leather-bound spines warm and worn. A tall arched window at frame-right shows late evening sky going dusk-blue. The institutional Mechronis blue palette is muted here — the dominant tone is wood-brown and warm-gold firelight rather than the classroom's blue-grey. A small Mechronis crest carved into the fireplace mantel, tasteful, unreadable at this scale. Two small reading lamps on side tables beside the armchairs, both lit, casting their own warm pools. The composition centers the empty coffee-table-card-table; the upper two-thirds hold the wood-paneled wall and bookshelves, the lower third is the rug. NO PEOPLE in the base still. This is the only Cycle B space where the player should feel that someone might invite them to stay for tea after the match.

### Cycle C
- **`bf_nexon_command_bunker`** (§22.1.4 / §13.3) — Wide establishing shot of a Battle-of-Nexon forward command bunker — the first non-schoolyard, non-academy battlefield in Act 1. Institutional green-grey military lighting from low-mounted overhead bulbs casting cool-grey wash. Reinforced concrete walls. A large central viewing window at the back of the frame shows the Nexon battlefield outside: rust-orange #e06a1a vortex clouds in a sky going to evening, distant muzzle-flashes (low-opacity, far below the horizon line), columns of black smoke rising. Pre-war Warlord propaganda banners hang on the side walls — institutional, not theatrical, deliberately worn. Center-foreground: a single sturdy regulation card table, military issue, no benches (combatants stand). A few stacked ammunition crates pushed against the side walls. NO PEOPLE in the base still. The cool-grey interior + warm rust-orange exterior through the window is the canonical palette tension; the warm gold of vortex-sky should rim-light the bunker walls subtly. Faint smoke ambient inside the bunker. The composition should feel like a place where a child should not be, even though canonically Vernon Vortex is a child here.
- **`bf_zenon_field_tent`** (§22.1.5 / §14.3) — Wide establishing shot of a Zenon warzone forward command tent — canvas walls (faded olive-drab military issue), a single low table at center-foreground lit by a hanging brass camp lantern that pools warm-gold light only across the center of the composition; the canvas walls and corners recede into deep shadow. The lantern's pool catches the table edges and a few inches of the floor; everything else is implied. AMBIENT SOUND CUE rendered visually: faint dust hanging in the lantern's beam, suggestive of distant artillery vibration. The canvas flap at frame-right is partially open, showing a sliver of the Zenon battlefield beyond — rust-orange smoke, a single distant muzzle-flash low in the frame. NO PEOPLE in the base still.
- **`bf_vortex_pressurized_bay`** (§22.1 / §2.12 / §15.6) — Wide establishing shot of the Engineer's transference room aboard the Collector's flagship VORTEX — a small pressurized equipment bay off the main cargo deck. Approximate 6m × 5m, low ceiling. Metal walls, bolted seams, industrial pipework along the upper edges. A single overhead work-lamp at center-ceiling casts hard down-shadow on a hexagonal equipment crate the Engineer has cleared and aligned to use as a card table. NO chair on the player POV side; the Engineer plays standing. Opposite side of the table: a single steel utility chair (Agent Zero's seat, currently empty in the base still). On the table beside the play surface: a matte-black palm-sized cube — the Resurrection Protocols device — with a single recessed stud and a dark LED. Beside it, a thin steel water flask. CANONICAL DETAIL on the back wall: SIX explosive charges, evenly spaced, each with a small red countdown LED — the LEDs are the only red light in the frame. The charges must be visible in the wide shot; the player should understand the room is going to detonate regardless. Cool-grey industrial palette overall, single warm-gold work-lamp pool, six red countdown pinpoints. NO PEOPLE in the base still.
- **`bf_newbabylon_tribunal`** (§22.1 / §2.13 / §16.6) — Wide establishing shot of the New Babylon Tribunal chamber — a vertically-proportioned space, approximately 24m × 18m, ceiling 12m high. The composition is COURTROOM-AS-LITURGY. Center-foreground: a single plain wooden chair on a polished black-stone floor (faintly grey-veined), the defendant's chair, illuminated from above by a clinical 4500K down-light shaft (forensic, not theatrical — production must resist making it beautiful). Center-rear: a raised dark-walnut bench 1.2m above the trial floor, approximately 6m wide, currently empty in the base still. On the right end of the bench: a single brass scale of justice (small, ceremonial). At Wayne's-left position on the bench: a face-down evidence stack. At Wayne's-right position: a blank parchment verdict scroll, unsealed. ON THE REAR WALL ABOVE THE BENCH: SIX crystal coffins mounted in a horizontal row, each ~2.4m tall × 1m wide × 0.8m deep, equally spaced, glowing faintly warm-amber from within with a slow 0.3 Hz pulse — the institutional heartbeat. Each coffin's interior is faintly visible: an Authority elder in stasis, robed in burgundy, eyes closed, hands folded; render the elders as soft-focus presence rather than sharp portraits. The 200-seat gallery on the side walls is EMPTY (canonical — Authority deemed the case too sensitive for public witnessing). Tall iron-bound chamber doors at frame-back-right, closed. Two soft-silhouette burgundy-uniformed Authority guards at parade rest in front of the doors (visible only at this widest framing). Palette: deep burgundy #6b1d2c on the bench undertone and guards' uniforms, warm-amber #d9a66a from the coffins, clinical 4500K white from the chair down-light, polished black-stone reflectivity on the floor. NO PEOPLE on the bench or in the chair in the base still — these are rendered as separate cutscene layers.

### Finale
- **`bf_ark_archives_dimmed`** (§22.1 / §18.2) — Wide establishing shot of the Ark Archives central chamber — same architectural space as the Prelude Bible §4.2 establishing reference (production must match the obsidian-black plinth, the chamber dimensions, the sweep of the surrounding archive shelves), but lighting dimmed to approximately 40% of Prelude-standard Archives illumination to match the post-Last-Words tonal register. The chamber recedes into soft darkness on all sides; only the central pedestal is fully lit. The pedestal: a short obsidian-black stone plinth, waist-height, flat top, with a faint inscribed geometric pattern on the upper surface (registers only on close-up). On top of the plinth: a single blank Dischordia card, glowing faintly warm-gold from within (subtle bloom, 0.2Hz pulse, just enough to draw the eye from the chamber threshold ~15m away). Player POV is from the entrance threshold facing the pedestal. Footstep echo implied by polished obsidian floor reflectivity. NO PEOPLE in the base still — the player avatar is rendered as a separate cutscene layer per the §18 interaction flow. Faint warm-gold ambient particles drift slowly upward from the pedestal — the canonical Witnessing-chorus visual cue planted in §17 frame 14 returns subtly here.

## 8.5 Card arts (14 · 1024×1024) — Cycle A unlocks

### `card_art_countermelody` (A1 unlock · Common Neutral)

> Square card-art composition (1024×1024). A single tuning fork in the center of the frame, struck and vibrating — the vibration rendered as a faint soft halo of sound-wave concentric rings emanating outward. Brass body with warm-gold reflectivity, sitting upright on a worn dark-wood surface (the Celebration schoolyard card table). Background: out-of-focus warm-gold afternoon Day-10 schoolyard light, faint pink-gold parade banner bokeh. The fork's tone is canonically the OPPOSITE of Minnie's viral chant — render the sound rings as a quiet, organized, single-frequency wave (contrast with chaotic). NO PEOPLE. Lower-third of the frame is the worn wood surface, leaving room for the card's name banner. Faint film-grain sepia. The card is a Common Neutral; the composition should feel modest and earnest.

### `card_art_jar_wouldnt_close` (A2 unlock · Rare Light)

> Square card-art composition (1024×1024). An amber glass jar — Corey's jar from §2.3 — center-frame, lid askew (NOT closed), a single warm-gold light beam escaping upward through the gap between lid and rim. The light beam carries a few small translucent coin-shapes drifting upward and out, each with a faint defocused face on its surface. The jar itself is half-full of similar coins, nestled at the bottom and giving off their own subdued amber inner-glow. The lid hovers approximately 1cm above the rim, frozen in the act of failing to seal. Background: out-of-focus 4:30 PM Day-20 schoolyard light, deeper amber than A1. The jar sits on the same worn dark-wood surface. Lower third clean for the card-name banner. The card is Rare Light; the visual hinge is the LID FAILING — Corey's jar canonically wouldn't close, and the spilled-light is the player's attention escaping back to them.

### `card_art_first_card` (A3 unlock · Epic Light)

> Square card-art composition (1024×1024). A single small folded paper card, blank on both sides, held in the warm-lit palm of a child's hand at center-frame (the Engineer's seven-year-old hand from the §5.4 graduation handoff). The paper has a faint warm-gold inner glow seeping through its fibers — the canonical 'three random effects on play' rendered as latent potential rather than literal symbols. Around the card: faint film-grain sepia bokeh of the graduation pavilion at 6:30 PM evening light, soft-focus pillars in the background. The hand is small but steady, fingers slightly curled to cradle the paper. NO faces. NO rendered text on the paper. The card is Epic Light; the composition's emotional register is GIFT, not reward — Kanshi Sha gives this card whether the player wins or loses, and the prompt should communicate that giving rather than that earning.

## 8.6 Card arts — Cycle B unlocks (6 · 1024×1024)

### `card_art_iron_stance` (B1 unlock · Rare Light)

> Square card-art composition (1024×1024). A single weathered iron tower-shield planted upright in the center of the frame, dug slightly into a packed-earth surface. Brushed steel surface, dented from prior impacts, with a faint warm-gold rim-light catching the upper edge from the right of frame. NO heraldry, NO insignia — the shield is functional, not ceremonial (canonical Iron Lion: he refuses institutional symbols). Background: out-of-focus warm-gold afternoon light, suggestion of a Mechronis Academy gate (deep wood-and-iron archway) defocused at the back of the frame. The shield casts a long shadow toward the viewer. Lower third clean for the card-name banner. The card is Rare Light; the visual register is HOLD THE LINE — render the shield as if it has been here a long time and intends to stay.

### `card_art_recruiters_gift` (B2 unlock · Epic Neutral)

> Square card-art composition (1024×1024). A single thin braided-fiber bracelet center-frame, laid loosely on a worn dark-wood surface (the Mechronis classroom card table). The braid is in three colors: deep insurgency-yellow #eab308, warm gold, and a dark gray-blue that picks up the Mechronis uniform palette. The bracelet is canonically Kael's gift — render it as worn but cared for, slightly frayed at the closure but still intact. Behind it on the table: a half-finished Dischordia card face-down, its back showing faint warm-gold trim. Background: out-of-focus warm-gold afternoon Mechronis classroom light, soft window-shaft from the left. NO HANDS in this composition — the bracelet is offered, awaiting acceptance. Lower third clean for the card-name banner. The card is Epic Neutral; the visual register is THE OFFER — quiet, without ceremony.

### `card_art_weapon_i_didnt_build` (B3 unlock · Legendary Dark)

> Square card-art composition (1024×1024). A pair of EMPTY hands at center-frame, palms turned up and slightly cupped, as if recently holding something that is no longer there. The hands are the Engineer's adult hands (worn, calloused, faint scar between the thumb and forefinger of the right hand — canonical match to §2.1.2 reference). NO weapon visible. The faint silhouette of an absent shape — vague, sword-like or stance-like — hovers in the empty palm-space, rendered as a thin outline of cool-grey light, almost a memory. Background: out-of-focus institutional Mechronis blue-gray, single warm-gold shaft cutting diagonally across the upper frame from off-frame-right. Lower third clean for the card-name banner. The card is Legendary Dark; the visual register is the CANONICAL ABSENCE — what the Engineer is holding is the choice he didn't make about Agent Zero. Render the absence with weight, not with melancholy.

### `card_art_memorized_page` (B4 unlock · Epic Dark)

> Square card-art composition (1024×1024). A single torn page from a textbook, center-frame, lying flat on a dark wooden desk. The page's surface is BLANK — the canonical 'memorized page' is what's been removed, not what's printed. Faint impressions of erased text remain (graphite shadow, illegible). A single fingerprint smudge in the upper-left corner of the page. Beside the page: a small circular pale-blue Watcher sigil ~1cm, drawn in pencil, visually identical to the sigil on Young Eyes's wrist (§2.8 portrait cross-reference). Background: out-of-focus dark Mechronis fourth-year classroom under desk-lamp pool, single warm-yellow glow at the edge of the frame. Lower third clean for the card-name banner. The card is Epic Dark; the visual register is SURVEILLANCE-AS-INHERITANCE — the player gets this card because Young Eyes left it for them.

### `card_art_classmates_compass` (B5 win unlock · Legendary Light)

> Square card-art composition (1024×1024). A small brass pocket compass center-frame, open and resting on a worn dark-wood surface (the senior common room coffee table). The compass face is canonical: the needle is NOT pointing north — it points slightly off-axis, toward the upper-right of the composition. The brass case has a single small engraved mark (no rendered text — abstract geometric, suggesting a younger Human's monogram). The needle catches a thin warm-gold reflection from off-frame-right (firelight). Background: out-of-focus fireplace warmth, leather armchair leg in soft focus at the back of the frame. Lower third clean for the card-name banner. The card is Legendary Light; the visual register is DIRECTION-AS-GIFT.

### `card_art_only_reason_i_stayed` (B5 loss unlock · Legendary Dark)

> Square card-art composition (1024×1024). The same Mechronis senior common-room setting as the Compass card, but EMPTY — a single leather armchair angled toward the fireplace, a low coffee-table-card-table in front of it with a Dischordia deck face-down on the surface. NO compass on this table; NO second armchair partner. The fireplace burns down to embers — warmer red-orange tones, softer light pool than the Compass card. Faint sepia film-grain heavier than other Cycle B cards. Background: bookshelves softly out-of-focus, a window at frame-right showing dusk-blue night beyond. Lower third clean for the card-name banner. The card is Legendary Dark; the visual register is the CANONICAL ABSENCE of the Human — the Engineer stayed for the conversation that didn't happen.

## 8.7 Card arts — Cycle C unlocks + Memory Card (5 · 1024×1024)

### `card_art_standstill` (C1 · Epic Light)

> Square card-art composition (1024×1024). A single hourglass center-frame, but the sand is FROZEN MID-FALL — a thin column of grain suspended between the upper and lower bulbs, neither falling nor settling. The brass frame shows wear. Behind the hourglass: out-of-focus rust-orange #e06a1a Vortex sky from the Nexon battlefield, low muzzle-flash light at the bottom of the frame, but the immediate space around the hourglass holds a small bubble of warm-gold neutral light — the canonical 'one turn delay' rendered as physics-paused-locally. Lower third clean for the card-name banner. The card is Epic Light; the visual register is the WORLD HOLDING ITS BREATH.

### `card_art_converter` (C2 · Legendary Dark)

> Square card-art composition (1024×1024). A single soldier's helmet center-frame, lying on its side on a dusty Zenon battlefield surface. The helmet is HALF Insurgency mustard-yellow #eab308 (the side facing the viewer, with a faded Insurgency medic patch visible on the shell), and HALF Warlord black-gunmetal #1a1410 (the side facing away). The helmet's interior shows the canonical seam between the two — a thin line of cool-blue #3b82f6 light tracing the conversion edge (intentional rhyme with Wanda's optic-rings, plants the swarm-and-cyborg connection). Background: out-of-focus Zenon battlefield smoke, distant rust-orange muzzle-flash low in the frame. Lower third clean for the card-name banner. The card is Legendary Dark; render with care, not with menace.

### `card_art_friend_i_saved` (C3 · Mythic Light)

> Square card-art composition (1024×1024). The Engineer's right hand center-frame, palm-up, fingers slightly curled. A single silver-mercury droplet rests in the center of his palm, perfectly spherical, catching the warm-gold work-lamp light from above. The droplet is canonically a small piece of the Warlord's nano-swarm — render as brushed-mercury #a8aab2 with a faint cool-blue #3b82f6 specular highlight on its surface (the swarm's signature palette inversion: warm light enters silver, leaves cool-blue). Background: out-of-focus warm-gold light from the Vortex bay's overhead work-lamp, with the bokeh of the Resurrection Protocols' status LED visible as a soft small blue point in the upper-right of the frame. NO faces. The hand is the entire image. Lower third clean for the card-name banner — but reserve a small space for the procedural N-score flavor text (per §2.12, the flavor text varies by C3 N-value). The card is MYTHIC LIGHT — only the second Mythic in Act 1; render the droplet as the entire emotional weight of the composition.

### `card_art_last_word` (C4 · Mythic Light)

> Square card-art composition (1024×1024). A single vintage broadcast microphone center-frame, mounted on a small polished black-stone surface — the canonical Tribunal-chamber-or-cell recording setup. The microphone is brass-bodied with a fine wire-mesh diaphragm; it shows a faint condensation halo around the mesh (the Engineer is breathing into it, right now). Warm-yellow Authority-spec spotlighting from above, hard down-shadow on the stone surface. Visible in soft focus behind the microphone: the unrolled Tribunal verdict scroll — partially or fully filled with ink lines depending on win/loss path; for the base still, render at half-fill so producers can composite the win/loss epigraph variant. NO faces. NO hands. The microphone is the entire subject. The card is MYTHIC LIGHT — the second of two Mythics in Act 1.

### `card_art_memory_card_procedural` (apprentice permadeath · Epic Light · procedural template)

> Square card-art composition (1024×1024) — PROCEDURAL TEMPLATE. The base composition is a generic apprentice portrait slot at center-frame, framed by a soft warm-gold memorial overlay (faint candle-light glow rim, fine particulate dust drifting upward, the canonical Witnessing-chorus visual cue). Producers composite the deceased apprentice's canonical portrait (from `apps/shared/apprentices.ts` generated identity) into the slot at runtime. The frame around the portrait: a thin brushed-brass border with three small notch marks at the bottom — one notch per trait that survived the player's choices (Resilience / Trust / Clarity). For the base still, render the portrait slot as a soft-focus silhouette of an apprentice-aged figure (no face details), the brass frame complete, the three notches present. Background: out-of-focus warm-gold candle-light, deep shadow at the corners. Lower third clean for the procedurally-generated apprentice name banner. The card is Epic Light; the visual register is MEMORIAL not reward. The §20.4 procedural flavor text branch appears in the lower frame, not on the art itself.

---

# 9. Trade Empire art prompts (70 entries)

**Source:** `apps/shared/tradeEmpireArtPrompts.ts` (1,120 lines).
**Engine:** Nano Banana 2 (Google Gemini Flash Image).
**Composer:** `apps/scripts/generate-trade-empire-art-csv.ts`.
**Style anchor (lines 75–76):**

> Dischordian Saga house style for Nano Banana 2. Painterly digital illustration with visible brushwork at 1:1 and clean read at thumbnail scale. High-contrast low-saturation palette anchored on one hot accent colour per piece, never two. Cinematic lighting — single dominant key source, soft volumetric haze gradient across at least three depth planes, rim light only on hero silhouettes. Materials skew bio-mechanical / crystalline / wet-chrome / weathered ceramcrete; surface detail at the level of paint chips, water-staining, and honest wear. Subtle eldritch geometry suggested in negative space (rings-within-rings, recursive spirals, impossible angles) — never explicit. No on-image text, no UI chrome, no lens flares, no modern logos, no readable signage. Reference: docs/ART_DEPARTMENT_PRODUCTION.md.

**Already-shipped sectors** (no re-prompt; `TRADE_EMPIRE_EXISTING_SECTOR_ART`, lines 83–90):

- `free_ports` → `art/planets/planet-degens-casino.png`
- `terminus_core` → `art/planets/planet-terminus.png`
- `hell_gate` → `art/planets/planet-castle-of-death.png`
- `dreamer_barrier` → `art/planets/planet-violetta.png`

## 9.1 Wonders — 8 entries · 1024×1536 (lines 94–200)

Each prompt below carries: `palette` · `composition` · `negativePrompt` · `priority` / `reviewGate`.

### `wonder_ark_cathedral` — P0 / A
Palette: ivory, cathedral gold, void black, one distant cold-blue rim-light.
Composition: Vertical hero portrait of a kilometre-tall sacred starship converted into a living cathedral, suspended in deep space above a pale blue Earth-like planet. Camera: low-angle medium-wide composition at ~24mm equivalent, viewer looking up the hull's vertical spine, planetary curvature held to the lower 20% of the frame for monumental scale. Lighting: warm 3200K stained-glass interior glow leaking outward through arched bio-mechanical viewports as the dominant key, cool 6500K planetary albedo as ambient fill on the lower hull, a single distant cold-blue rim picking out the ivory spires from camera-left. Materials: weathered ivory ceramcrete, gold-leaf inlay around viewport frames, wet-chrome hull patches at the join lines, paper-thin memorial ribbons fluttering soundlessly in vacuum and fading translucent at their tails. Mid-ground: a scattered shoal of refugee skiffs drifting toward the hull, each barely a pixel wide and silhouetted pilgrim-like. Upper-left negative space holds dense black starfield with subtle ring-within-ring geometry suggested in the dust lanes. Soft volumetric choir-light halo radiating from the hull's centre. Mood: shelter, vigil, the Potentials' home.
Negative: no humans in frame, no visible text, no lens flare, no modern sci-fi clean lines.

### `wonder_red_crystal_spire` — P0 / A
Palette: deep red, obsidian, brass highlights, one sickly green reflection.
Composition: Vertical hero portrait of a jagged red crystalline obelisk the size of a mountain rising out of an Authority capital's megacity skyline at dusk. Camera: low-angle hero shot at ~28mm equivalent, viewer effectively at street level, the spire dominating the upper two-thirds of frame and the city compressed across the lower third. Lighting: the spire is internally lit with deep ruby refraction that stains every adjacent skyscraper's windows blood-orange across hundreds of panes; ambient sky bruise-violet at twilight; a single sickly green ground-level reflection pools from a hidden source out of frame. Materials: faceted obsidian-red crystal with internal flaws and recursive lattice glimpsed through fissures, brass armatures bracing the base, dark concrete and gold-window grids on the surrounding architecture. Mid-ground: a procession of Authority cargo freighters spiralling lazily around the spire, running lights as small rust-orange motes against the red. At the spire's base: a thin stratum of red vapour condenses on the pavement — visualised wealth, spilled. Mood: wealth as law, law as weapon.
Negative: no flames, no explicit logos, no cartoon sparkle.

### `wonder_forge_monolith` — P1 / B
Palette: char-black, forge white, molten amber, deep teal shadows.
Composition: Vertical hero portrait of a black basalt monolith cracked open along its centreline to expose a white-hot industrial furnace-core, taller than any surrounding shipyard scaffolding. Camera: low-angle medium-wide at ~24mm equivalent, viewer looking up the cleft so the white-hot fissure becomes a vertical light slash through the centre of frame. Lighting: blinding 5000K furnace key from inside the crack as the dominant source, deep teal shadow fill across the basalt face, molten amber rim lining the orbital robotic arms, no ambient — pure void backdrop. Materials: char-black volcanic stone with a glassy obsidian sheen, white-hot incandescent metal at the cleft, brushed-titanium robotic assembly arms, half-finished frigate hull plates in matte iron grey. Mid-ground: skeletal robotic arms in mid-weld around floating frigate hulls, sparks suspended in zero-g forming a slow constellation across the right half of frame. Foreground anchor: a single rope-like power conduit curving across the lower-left edge for scale. Distant background: a starless industrial void, no planet visible. Architect-aesthetic ritual symmetry implied in the monolith's silhouette. Mood: industrial sublime, war as craft.
Negative: no sci-fi chrome, no people, no ad-style energy beams.

### `wonder_remembrance_garden` — P1 / B
Palette: moss green, paper-cream, slate grey, single violet floral accent.
Composition: Vertical hero portrait of a silent grove of bioluminescent memorial trees growing out of the fractured prow of a starship half-buried in a mist-wet plain. Camera: eye-level medium-wide at ~35mm equivalent, slight tilt up so the tallest tree just clears the upper edge, mist gradient compressing depth across three planes. Lighting: cool 4500K bioluminescent moss-green key from the trees themselves as the only practical, low ambient pre-dawn slate, no rim, no fill — let the trees light themselves. Materials: weathered ship hull plating overgrown with pale moss, fine bark wrapped in lichen, paper-thin ledger-leaves with faint ink-blur where names would be (do not render legible characters), wet stone underfoot reflecting tree-glow. Mid-ground anchor: a single silhouetted kneeling figure in crew coveralls at the base of the largest tree, head bowed, no face shown. Foreground: a low ribbon of ground-mist creeping toward the lens. One violet wildflower bloom on the lower-right third — the only saturated pixel in frame. Mood: grief held, not displayed.
Negative: no tombstones, no readable names, no visible tears.

### `wonder_chronarch_lens` — P1 / B
Palette: tarnished brass, indigo, vellum cream, one violet reflected flare.
Composition: Vertical hero portrait of a colossal brass-and-void-glass astronomical instrument the size of a small moon, half-occluding a banded ringed gas giant. Camera: eye-level medium-wide at ~50mm equivalent for clean optical compression, lens centred so the instrument's concentric rings read as nested ellipses across the upper two-thirds. Lighting: cold reflected gas-giant light as soft 5500K key from camera-left, warm 2800K interior lamp glow from a tiny observation platform on the lens housing, a single violet-amber flare reflecting off the innermost void-glass disc. Materials: tarnished brass with green oxidation in the joins, hand-engraved Antiquarian glyphs catching catchlights along every ring's edge, smoky void-glass at the centre with a refractive depth that doesn't quite match the geometry. Mid-ground: a single Antiquarian figure in layered cream-and-indigo robes standing on the platform, scale-marker only, no face shown. Inside the lens disc: a faint impression of a fleet engagement that has not yet occurred — silhouettes only, ghosted at 20% opacity. Mood: knowledge as trespass.
Negative: no clocks, no gears in motion blur, no modern telescope silhouettes.

### `wonder_hell_gate_sigil` — P1 / B
Palette: sigil-red, absolute black, one thin gold bar of rim-light on the nearest ship.
Composition: Vertical hero portrait of a colossal circular warding sigil inscribed directly into the void at a Lagrange point — concentric rings of angry red glyphs holding shut a perfect black disc of nothing. Camera: dead-on frontal at ~85mm telephoto equivalent for flat geometric clarity, sigil filling roughly 70% of frame and centred slightly low-of-centre. Lighting: the sigil's red glyphs are the dominant emissive source at sigil-red 1800K, ambient void absolute black, a single thin gold rim picks out the nearest fleet hull at lower-right. Materials: glyph strokes painted as if scored into space itself with brushwork that bleeds at the edges, the central black disc rendered as sub-zero black with no texture or noise — visibly wrong. Foreground/mid-ground: a thin ring of fleet ships in respectful silhouette, holding station at distance, their running lights small and few. Pressing outward from inside the disc: faint pressure-distortions, like fingers behind cloth — described as silhouettes-without-source, not as creatures. Mood: what we keep out, barely.
Negative: no demon faces, no fire, no pentagrams.

### `wonder_immune_choir` — P1 / B
Palette: pale white, cyan, pearl, one black spore accent.
Composition: Vertical hero portrait of an orbital ring-station sheathed in pale white coral and translucent cyan membrane, singing — visualised as concentric pressure rings of pale light pulsing outward across the upper two-thirds of frame. Camera: medium-wide at ~35mm equivalent, low-orbit perspective so the ocean planet curves dramatically across the lower 30% of frame. Lighting: pale 6500K daylight key from off-frame upper-right, cyan internal membrane glow as secondary, soft cool-white planetary albedo as ambient fill, no rim. Materials: coral-white biomineralised hull with soft organic ridges, translucent cyan polymer membrane stretched over the ring's open spans, pearl iridescence catching highlights along the inner curve. Mid-ground action: small red-black spore-motes drift inward from the upper-left edge and dissolve at the moment they touch each pressure-ring expansion — render the dissolution as soft fade, not violence. Below: a clean turquoise ocean world with a single white cloud-band. Single black spore-mote barely visible at the upper edge — the threat. Mood: purification as lullaby.
Negative: no medical symbols, no bio-hazard icons, no gore.

### `wonder_dreamers_answer` — P1 / B
Palette: nebula violet, warm amber fleet-lights, deep blue shadow, single white star-tear.
Composition: Vertical hero portrait of the Dreamer — a colossal sleeping presence rendered only as the curve of a shoulder and the side of a face — half-revealed inside a violet nebula across the upper three-quarters of frame. Camera: cinematic medium-wide at ~50mm equivalent, viewer positioned far enough that her partial face is recognisable as face-shape only, never explicit. Lighting: cold nebula-violet ambient as primary, warm 2700K amber fleet running-lights as the only practical sources at small scale, one single white star-tear point pulled to high luminosity at frame-centre as the literal accent. Materials: nebula gas-cloud rendered in soft impasto brushwork, the Dreamer's skin treated as star-field-overlaid translucency where the curvature meets vacuum, fleet ships as small disc highlights with warm halos. Mid-ground: a lattice of warm fleet-light pinpricks arrayed in a curved protective shell across the lower-third of frame, every light a ship. Lower-left: a single tear-shape of starlight descending slowly between two distant galaxy spirals. Eyes closed, lashes implied, expression unreadable. Mood: reprieve, not victory.
Negative: no face fully shown, no religious iconography, no readable text.

## 9.2 Era banners — 5 entries · 1792×768 (lines 202–273)

- **`era_first_light`** — P0/A — palette: dawn amber, soot-black, one pale blue star. Ultra-wide cinematic establishing shot, anamorphic 21:9, of a single pre-warp colony fleet drifting away from the fractured silhouette of a home-world. Camera: locked-off horizon at ~50mm equivalent, eye-level. Lighting: amber 2400K dawn key bleeding through dense atmospheric haze, deep soot-black shadow on the left third, one pale-blue 8000K star pinpoint upper-right. Composition: rule-of-thirds — left third dominated by the ruined planet's broken curve in heavy silhouette, mid-third open atmospheric dark with the fleet drifting through it, right third opens into a wide hopeful expanse with a single navigation beacon flare. Foreground: a thin layer of high-altitude debris drifting along the lower edge. Mood: survival dawn. Negative: no explosions, no ships with visible guns, no text.
- **`era_ark_awakening`** — P1/B — palette: ivory, cathedral gold, deep indigo sky, one distant red flare. Ultra-wide cinematic panorama of the Ark Cathedral's hull opening and pouring warm cathedral-gold light across the surface of a pale inhabited moon. Camera: ~50mm equivalent, slight high angle. Lighting: warm 3000K cathedral-gold spill from the opened hull as the dominant key dramatically lighting the moon's daylight side, deep indigo sky as ambient fill, a single distant red 1500K flare pricking the horizon at the right-third line — small enough to be missable, deliberate enough to foreshadow. Materials: ivory ceramcrete with golden-leaf seams freshly catching light, dusty pale lunar regolith. Mid-ground: small refugee skiffs in silhouette tracking toward the Ark in a loose pilgrim-line. Mood: gathering. Negative: no weaponry, no crowds of faces, no text.
- **`era_sector_lord`** — P1/B — palette: brass, warm amber, leather-brown, one cold cyan holographic accent. Ultra-wide hero shot of a young empire's star-map war-table viewed from above-and-to-the-side at ~35mm equivalent. Lighting: warm 2700K leather-amber room ambient as base, holographic amber 3500K projection volumetrically lighting up from the table, one cold 6000K cyan holographic accent on a single highlighted sector token. Materials: brushed brass tabletop with engraved coordinate grids, leather chair-backs in deep oxblood, holographic sector tokens as semi-transparent amber discs, gauntleted hand in dark armoured leather reaching from right edge. Foreground anchor: a half-empty cup of dark liquid on the lower-left for human scale. Mood: deliberate ascent. Negative: no player-character face, no readable glyphs, no modern UI chrome.
- **`era_galactic_power`** — P1/B — palette: cold steel, twilight violet, deep red in the outer corners only. Ultra-wide panorama of a fleet in crescent formation arrayed over a populated planet, viewed from extreme distance at ~135mm telephoto so the fleet reads as a clean geometric arc of small steel-cold motes. Lighting: cold 5800K twilight key from upper-right, deep twilight-violet ambient across the upper two-thirds, deep red 1800K bleeding in only at the outermost left and right corners — the edges of the frame are quietly turning. Composition: planet's curved horizon tracks the lower-third line, the fleet crescent arching across centre at mid-height, vast empty sky in the upper third. Materials: planet surface rendered as soft city-light constellations across the night side, fleet ships as flat hard silhouettes against the brighter day-side limb. No individual ship reads above 4px wide. Mood: dominion, but the sky is turning. Negative: no battle in progress, no muzzle-flashes, no text overlay.
- **`era_cosmic_convergence`** — P1/B — palette: blood-red, absolute black, one single point of pure white where the impossible shape opens. Ultra-wide panorama of the Convergence arriving at galactic scale — the entire frame bathed in a terrible blood-red corona. Camera: dead-on frontal at ~35mm equivalent, no perspective tilt. Lighting: blood-red 1600K corona radiating outward from a single point of impossible pure white at exact frame-centre, absolute black corners, no fill. Composition: dead-centred radial symmetry with a horizon-thin line of fleet silhouettes hugging the very bottom edge across the entire width, utterly dwarfed; the impossible geometry — rings-within-rings nesting into a door that is also an eye that is also a mouth — occluding the upper two-thirds. Mood: witnessed apocalypse. Negative: no recognisable demon imagery, no fire plumes, no text.

## 9.3 Eldritch encounter key art — 4 entries · 1536×1152 (lines 277–334)

- **`encounter_listener_static`** — P0/A — A darkened ship-bridge interior at low power. Locked tripod eye-level at ~35mm equivalent, two-degree Dutch angle. Cold 7000K CRT-green monitor glow as the only practical key, deep static-grey ambient, one pinprick of hot 1500K red on a recording indicator at lower-left. Bridge consoles, monitors, and crew silhouette occupy the left two-thirds; the right third reserved as flat negative space for UI choice-list overlay. Across every monitor screen: a single pale eye visible only as a darker static-pattern emerging from the RF noise, blinking in sync across all screens. Foreground: a coffee mug overturned on the console, contents pooled, not yet dripped. Mood: someone is already listening. Negative: no jump-scare face, no gore, no explicit text on screens.
- **`encounter_dreamers_weeping`** — P1/B — The Dreamer's vast unfocused silhouette across a nebula-scale void. Cinematic medium-wide at ~50mm equivalent, far-field perspective. Cool nebula-purple ambient base, crystal-cyan internal glow from the falling shard-tear cascade, a single warm rose-gold rim on the nearest crystal at exact frame-centre. Left-heavy: shoulder-curve anchors upper-left quadrant, tear-path curves diagonally down-and-right from the hidden eye, falling shards trail off toward lower-mid; right third reserved as soft graduated darkness for UI overlay. Mid-shards are obviously raw Void Crystal (geometric, valuable); other shards are simply sad. Mood: grief that can be mined. Negative: no readable face, no realistic tears, no religious halos.
- **`encounter_counted_crew`** — P1/B — A cargo-bay manifest room. ~28mm equivalent, slight low angle. Warm 2700K tungsten work-lamp upper-right, deep brown ambient right edge, one cold 6500K blue glow from the wall-mounted manifest as second source, strong chiaroscuro. Rocking chair lower-left quadrant pulled out from the table at 30°, projected manifest fills upper-left wall, right third clean for UI. The roster: every name carries two tally columns, and across all rows the right-hand column is always exactly one number higher than the left. Foreground anchor: clipboard fallen on the floor at the chair's foot, top sheet still settling. Mood: someone who was never hired is at work. Negative: no ghost figures, no readable names, no motion blur.
- **`encounter_final_invitation`** — P1/B — A colossal obsidian-black door suspended in open space — no wall, no station, no frame, just the door. Medium-wide at ~50mm equivalent, slight upward tilt. Deep space-blue 3500K ambient base, a single warm 2400K honey-gold leak streaming out from the centre-line crack as dominant key, one ember-orange 1800K reflection catching the underside of the nearest approaching ship's hull. Obsidian door-face with wet-stone sheen, faint Antiquarian-style glyph carving in low relief — a single polite welcome glyph that reads as a complete sentence ending in a question mark. A hairline crack runs vertically down the centre, glowing honey-warm. Left-heavy: door centred on the left-third intersection occupying ~60% of frame, right third reserved as deep starfield for UI overlay. Mid-ground: a thin pilgrim-line of fleet ships approaching from lower-edge. Mood: the choice framed as hospitality. Negative: no demon mouth, no claws, no explicit text in readable script.

## 9.4 Fleet doctrine banners — 4 entries · 1024×512 (lines 338–395)

- **`doctrine_swarm`** — Swarm Doctrine — P1/B. Wide 2:1 horizontal tactical-poster of countless small fighter-craft moving in a sharp chevron pattern, readable as a single arrowhead shape composed of ~50 distinct dots. Telephoto compression at ~135mm equivalent. Cold 5800K daylight from upper-left, deep cobalt void as dead-flat ambient with no gradient, swarm-orange 2200K engine-trail accents catching the underside of every fighter from camera-left, one white rim picking the chevron's leading point. Carriers oversized on left and right thirds — flat broadside views pumping fighters into the central chevron. Negative space along the upper third left blank. Mood: overwhelming by number. Negative: no individual named ships, no pilot views, no text.
- **`doctrine_iron_wall`** — Iron Wall Doctrine — P1/B. Wide wall-formation of heavy armoured cruisers locked broadside-to-broadside across the entire width, overlapping shields into a literal wall. Dead-on frontal at ~85mm telephoto, no perspective convergence. Cold 6500K planetary daylight from behind the wall as dominant rim back-lighting, bastion-grey ambient, soft cyan 8000K hexagonal shield-pattern glow as secondary key flickering across the seams, one warm gold 2400K command-insignia point on the centre cruiser's bridge. Heavy armoured plating with visible weld-seams, weapons retracted, shield-grid as faint translucent hexagonal mesh. Incoming fire-flecks streaming in from frame-left, disintegrating into white-orange sparks at the shield-line. Mood: immovable promise. Negative: no fire or explosion effects beyond sparks, no visible crew, no text.
- **`doctrine_archon_formation`** — Archon Formation — P1/B. Three identical Architect battle-dreadnoughts locked in a perfect geometric triangle formation, surrounded by twelve smaller frigate escorts in mathematically precise concentric orbits. High-angle three-quarter overhead at ~50mm equivalent so the triangle reads as a flat geometric shape. Cold 5500K daylight key from directly above, absolute black ambient, blood-red 1800K rim trim on every hull edge, one violet 4500K navigation flare burning steadily on the lead ship's prow. Bone-white ceramcrete hulls with crisp red-black geometric trim. Background: flat dark void with a single dimly-lit ringed planet held to the lower-right third for asymmetrical relief. Mood: order as doctrine. Negative: no asymmetry, no organic curves, no human figures.
- **`doctrine_antiquarian_tempo`** — Antiquarian Tempo — P1/B. Small elegant fleet of five ships mid-manoeuvre around a brass astrolabe-style superstructure floating free in space. Medium telephoto at ~85mm equivalent, slight high angle. Warm 2900K reflected brass key bouncing off the astrolabe rings, indigo void ambient, single pale violet 4500K accent picking out the longest glyph-etched seam. Ship hulls in brushed brass and vellum-cream with deeply etched Antiquarian glyphs along every seam, light-trails as soft watercolour ribbons. Mood: war as composition. Negative: no visible weapons firing, no humans, no explicit sheet music on hulls.

## 9.5 Fleet unit silhouettes — 6 entries · 512×512 (lines 404–477)

Shared negative: "no background, no motion blur, no pilot figures, no UI overlays, no text on hull". Each token portrait: 3/4 hero view on transparent background, 50mm flat camera, 15° elevated angle, hull centred with tight margins for 64px legibility, single flat key from upper-front-left, no rim, no fill — silhouette must read first.

- **`fleet_scout`** — matte grey, cyan running-light. Slim dart-shaped recon skimmer: knife-thin fuselage, twin sharply-swept wings, oversized clear sensor-dome at the nose dwarfing the cockpit. One cyan running-light pinpoint on the dome's underside. Mood: eye.
- **`fleet_trader`** — matte grey, mustard-yellow cargo-seal stripe. Blocky rounded civilian freighter: rounded utility hull with modular cargo pods slung in a row under the spine, two stubby low-thrust engine nacelles aft, small civilian bridge bubble forward, no weapons. One mustard-yellow cargo-seal stripe wrapping the central cargo-pod. Mood: utility.
- **`fleet_frigate`** — matte grey, hazard-orange warning stripe at the nose. Narrow knife-hulled frigate: long knife-thin hull with single oversized rail-gun spine running the full forward dorsal length, two compact angular missile racks port and starboard amidships, single sharp-prowed bridge tower set well back. One hazard-orange stripe at the rail-gun nose tip. Mood: hunter.
- **`fleet_cruiser`** — matte grey, blood-red heat-vent trim. Mid-size capital cruiser: squat dense hull built around a single oversized centreline battery turret rotated slightly off-axis, layered armour plating in stepped overlapping tiers along the broadside, forward bridge tower kept low and protected. Blood-red heat-vent trim glowing faintly along the engine block at stern. Mood: line-of-battle.
- **`fleet_carrier`** — matte grey, approach-green deck-light array. Long flat-decked fleet carrier: long horizontal hull dominated by twin parallel flight-deck strips running the full length, large hangar mouths gaping open at both bow and stern, tall narrow command tower offset deliberately to starboard. Approach-green deck-light array running the centreline of both flight-deck strips. Mood: lifter.
- **`fleet_flagship`** — matte grey, gold prow insignia. Oversized flagship command dreadnought: massive deliberate hull with heavy forward prow ram, asymmetrical multi-tiered bridge pagoda rising tall on the dorsal spine, three layered secondary gun tiers stacked along the broadside, single ceremonial banner-mast extending vertically above the highest pagoda. Single gold prow insignia glowing softly from inset relief. Mood: throne.

## 9.6 Pirate raider portrait — 1 entry · 768×768

- **`market_pirate_raider`** — Pirate Raider — P1/C — rust-red, soot-black, salvage-yellow warning paint, one cold blue running-light. Square 1:1 portrait of a battered bulk-carrier repainted by hand into a pirate raider, drifting parked in empty trade-lane space. Medium telephoto at ~85mm equivalent, 3/4 broadside hero view, slight low angle. Cold 4500K starfield ambient as base, no key, one cold-blue 6500K running-light pinpoint as the only practical source on the hull, deep void in the negative space — the ship looks abandoned-on-purpose. Materials: rust-red hand-rolled paint over original factory grey, soot-black smudges around the engines, salvage-yellow warning paint slapped crooked, a single garish hand-painted red-and-black raider sigil straddling two warped hull plates, weld-seams visibly crude where cargo-pod skeletons have been bolted on at the wrong angles. Foreground anchor: the pirate's own small dinghy docked at the lower side like a parasite, magnetic clamps visible. The big ship's engines are cold; only two of its many running lights are lit. Mood: rudeness as business model. Negative: no human face, no skull-and-crossbones cliché, no explosions.

## 9.7 Civic policy icons — 9 entries · 256×256 (lines 505–623)

Shared base: flat dark-slate background, heraldic emblem icon, dead-on flat at 50mm equivalent, glyph occupying ~70% of inner frame area, must read at 32px without colour.

- **`civic_doctrine_iron_lion`** — military-red accent — A roaring lion's head fused at the lower jaw into a clenched iron gauntlet, the two forms reading as one continuous silhouette. One military-red 1800K rim catching the gauntlet's knuckle ridge. Style: crude defiance, not polished heraldry.
- **`civic_doctrine_nomad`** — warm amber accent — A compass rose with eight arms, but the north arm is replaced by a single curved bird's feather subtly offset from true-vertical by a few degrees. Style: quiet evasion.
- **`civic_doctrine_archon`** — bone-white and red-black accent — A perfect equilateral triangle bisected by a horizontal centre-line, with a smaller inverted equilateral triangle inscribed precisely within the lower half. Style: ritual cold. Edges crisp to the pixel.
- **`civic_economy_free_ports`** — brass with one cyan port-light at centre — Three classic ship's anchors interlocked at their flukes in a perfectly rotational triskele pattern. Cyan 6500K port-light glow at exact centre. Style: merchant solidarity.
- **`civic_economy_authority_tithe`** — Authority-red and brass accent — A stylised flat-rendered red hand, palm-up, fingers slightly curled, holding out a single round brass coin; thin chain extends from the wrist downward and exits the lower-right edge. Style: heraldic, taxational — the chain's exit-from-frame implies the rest of it is held by someone you can't see.
- **`civic_economy_antiquarian_ledger`** — brass and vellum, one indigo ink accent — An open hardbound ledger viewed from directly above, displaying a single inked sigil that crosses the centre-spine and extends across both pages so the book is visibly impossible to close without folding the sigil. Style: archival, ominous.
- **`civic_order_council`** — indigo with one cold-white highlight on the empty seat — Six small filled indigo circles arranged in a perfect hexagonal ring around a seventh hollow circle at exact centre, the centre circle distinctly empty. One cold-white 8000K rim picking the inner edge of the empty centre — drawing the eye to the missing seat. Style: order through absence.
- **`civic_order_panopticon`** — violet with one red pupil-prick — A single perfectly circular lidless eye at exact frame-centre, surrounded by three concentric circular rings nested at progressively larger radii — recursive concentric surveillance. Style: panoptic — the recursive nesting must register as more rings than feel comfortable.
- **`civic_order_remembrance`** — indigo-black with one warm amber flame — A small simple memorial candle held vertically, the flame above shaped not as a teardrop but as a single flowing calligraphic glyph that reads as a written name — abstracted enough to remain unreadable, specific enough that the brain insists it is a word. Warm 1800K amber flame-glow as the only saturated source. Style: remembrance.

## 9.8 Sector paintings — 33 entries · 1536×1024

**Shared negative:** "no named characters identifiably shown, no UI overlay, no readable signage, no modern branding, no on-image text".

### Tier A — 15 rich prompts (faction capitals / contested hubs / convergence-relevant anomalies)

- **`sector_trade_nexus`** — Authority red, brass, deep city-blue. A seething Authority-controlled commercial megastation hanging in close orbit above a calm blue-banded planet. ~35mm equivalent, eye-level horizon-locked. Warm 2800K Authority-red practicals lining every dock, deep cobalt city-blue ambient from the planet below, brass 4500K reflections. Three depth planes — foreground freighters in sharp silhouette, mid-ground station body in full saturation, background planet softened by orbital haze. Mid-ground narrative: one freighter visibly stalled at a dock with two surveillance drones converged on it. Mood: commerce as observation.
- **`sector_new_babylon_core`** — deep indigo, Authority red, window-gold. New Babylon ecumenopolis city-planet at night, viewed from low orbit. ~28mm equivalent, slight downward tilt. Deep indigo 5000K night-sky ambient, billions of warm 2400K window-gold city-light pinpricks, six small but unmistakable Authority-red 1800K crystalline pulses synchronised in perfect rhythm from a single central spire — the coffined minds breathing in time. Subtle nebula-bands suggesting eldritch geometry in their dust patterns. Mood: capital that breathes for someone else.
- **`sector_new_babylon_lower_tiers`** — soot-black, rust, neon-cyan puddle-reflection. A rain-slicked canyon street in the lowest tier of the New Babylon city-planet. Ground-level ~28mm equivalent, slight upward tilt. Heavy overcast above provides no key — instead, a forest of warm 2200K tungsten work-lamps and cyan 6500K neon shop-signs reflected on the wet pavement, one Authority-red 1800K patrol-drone running-light hanging high in the rain. Mid-ground: a single small figure huddled in a doorway, half-silhouetted, deliberately not the focus. Mood: the city's lower throat.
- **`sector_empire_frontier`** — bone-white, red-black trim, cold grey sky. A half-rebuilt Artificial Empire border outpost on a barren planet's terminator line. ~35mm equivalent, slight high-angle three-quarter overhead. Cold 5000K daylight from low on the horizon, deep cold-grey ambient sky, soft red-black 2200K trim-glow on every drone. Bone-white ceramcrete hulls with crisp red-black geometric trim, perfect right-angle street grids cut into the surface like wounds, no organic curves anywhere. Background: distant Architect mothership in low orbit. Mid-ground: one tower three-quarters complete, surrounded by a perfectly equidistant ring of working drones. Mood: ritual reconstruction.
- **`sector_forge_worlds`** — forge-orange, char-black, one thin cold cyan orbital ring. A forge-world from medium orbit — the planet's entire night-side glows volcanic orange. ~28mm orbital equivalent. Forge-orange 1500K incandescent emission, char-black 2000K shadow on the unlit hemisphere, one cold cyan 7000K orbital ring-light tracing the equatorial shipyard girdle. Planet surface rendered as molten-glow patchwork through black volcanic crust, equatorial shipyard ring as a continuous chain of brushed-iron platforms with active dock-arms. Mid-ground: one freshly-completed cruiser separating from a dock-arm, engines just lighting. Mood: industry without rest.
- **`sector_panopticon_ruins`** — pale grey, rust-stain, one distant cold blue star. A shattered orbital prison complex drifting in silence. ~35mm equivalent, viewer floating outside the broken hull, looking through a torn-open wall section into the cell-grid interior. Cold-blue 7000K distant starlight from a single far star at upper-left as the only key, pale-grey 5500K ambient bouncing weakly off the metal interior, rust-orange 2000K oxidation stains. Individual cells visible as hollow geometric cubes stacked in a brutally regular grid, cell-doors floating open in zero-g, scattered detritus drifting — no bodies. One specific empty cell anchored on the centre intersection, that cell distinctly emptier than the others. Mid-ground: scattered identification tags drifting like silent confetti. Mood: silence after the experiment.
- **`sector_viral_wastes`** — spore-black, bruise-red, diseased yellow nebula haze. A dead solar system, three planets visible across the wide frame each wrapped in writhing black-red Thought-Virus spore tendrils that arc visibly between worlds in interplanetary scale. ~200mm extreme telephoto. Diseased-yellow 2200K nebula haze as ambient, deep spore-black 1500K emission from the tendril-bands, sickly bruise-red 1800K subsurface pulse moving slowly through the tendrils. Planets rendered with atmospheres half-eaten — solid surfaces visible through gaps where the spore-mass has consumed cloud layers. Three planets evenly distributed on the lower-third line, tendrils arching between them in slow recursive curves. Mood: a system finished thinking.
- **`sector_frontier_worlds`** — warm amber grassland, rust-scrap, big cobalt sky. A rugged independent colony on a yellow-grassland moon with a vast cobalt sky. Ground-level ~35mm equivalent, slight low angle. Warm 3500K afternoon-amber sun key from upper-right casting long horizontal shadows, cobalt 6500K sky-light, rust-orange 1800K oxidation rim catching the salvaged hull-plating. Watchtowers built from mismatched scavenged Imperial hull plating still bearing fragments of original red trim painted over with weather. Mid-ground: a single colonist on horseback riding the perimeter, scaled small. Mood: the kind of frontier that has lasted three generations.
- **`sector_insurgency_haven`** — asteroid grey, warm ember window-light, deep void. A hidden insurgency base built inside a fractured asteroid drifting in deep void. ~50mm equivalent, slight Dutch angle of two degrees. Deep void as ambient near-black, warm 2400K interior tungsten window-light leaking out through every fractured rock-fissure, no key, no rim. No exterior signage of any kind. Mid-ground narrative: a thin docking-clamp tether retracting into the rock as the skiff departs. Mood: home, but only if you know the password.
- **`sector_abyssal_sectors`** — oil-black, blood-veinous red, sickly violet rim. A Hierarchy-consumed region where reality itself has begun to bleed and degrade. ~35mm equivalent. Oil-black 1800K ambient base, sickly violet 4500K rim-glow, blood-veinous red 1500K pulse moving through the Blood-Weave between planets. Distant stars rendered with visible oil-paint smear-trails as if the canvas itself was wiped while still wet. Two planets connected by a cable-thick Blood-Weave artery rendered in throbbing red-black. Mid-ground: a single derelict ship snared in the Weave at the centre, hull half-dissolved. Mood: reality remembering it was painted on something.
- **`sector_black_hole_gate`** — The Antiquarian's Gate — obsidian, brass, vellum cream, one warm amber leaking light. An anomaly that registers as a black hole but isn't — the event-horizon disc is a colossal ornate brass door floating in deep space, carved across its full surface with Antiquarian glyphs, ajar by perhaps a finger's width. Dead-on frontal at ~85mm telephoto. Cold-void ambient as near-black, no key, a single warm 2200K honey-amber light leaking through the finger-width gap. Heavy ornate brass door-face with hand-engraved Antiquarian glyph density across every panel. Mid-ground: a single tiny silhouette of an Antiquarian survey-skiff held respectfully at distance to the door's lower-right. Mood: a question that isn't asked, only opened.
- **`sector_violetta_approach_lane`** — dreamer-violet, deep cold blue, one warm amber running-light. A corridor of space near the Dreamer's Shield, the shield itself just out of frame to the right yet washing half the composition with its colour. ~50mm equivalent. Deep cold-blue 6500K starfield ambient on the left half, dreamer-violet 4500K shield-glow saturating the right half, one warm amber 2200K civilian running-light pinpoint at the convoy's lead ship. Convoy lead ship at the right-third intersection, convoy line extending diagonally in a paused approach formation, all engines visibly cold — they are waiting. Mood: the threshold of asking permission.
- **`sector_forward_bastion`** — The Forward's Bastion — ivory, cathedral gold, deep blue void. A Potentials-held fortress-moon bristling with defensive emplacements. ~35mm equivalent, slight three-quarter angle. Cold 6000K distant starlight ambient base, warm 3000K cathedral-gold practicals lining the fortress's main bastions, deep cold-blue 7000K void shadow on the unlit hemisphere. Ivory ceramcrete walls with gold-leaf banded reliefs, hundreds of memorial ribbons draped from the parapet edges. Mid-ground: a single small honour-guard skiff holding station off the main bastion. Mood: the fortress is also a chapel.
- **`sector_remembrance_archive`** — The Remembrance Archive — brass, vellum, indigo mist, one violet candle in a window. An Antiquarian vault built into a sheer cliff-face on a mist-wet world. Ground-level ~35mm equivalent, slight upward tilt. Cool 6500K overcast indigo-mist ambient base, warm 2200K candle-flame practicals behind a single vellum-paned upper window, one violet 4500K candle-flame glowing in a recessed nook beside the doors. Two colossal brass vault-doors hand-engraved with thousands of names in tightly packed rows. Mid-ground: footprints visible on the wet stone steps that go up but not down. Mood: the names are heavier than the door.
- **`sector_chronarchive_vault`** — Chronarchive Vault — brass, vellum, indigo shadow, one warm amber candle flame. An underground Antiquarian Chronarchive vault, viewed from inside near the entrance with shelves receding into darkness. Low-angle ~28mm equivalent. A single warm 1900K candle-flame held mid-shelf as the only practical light source, indigo 4500K shadow filling the receding aisles, brass 2700K reflections catching off the great chronarch ring rotating slowly overhead. Vellum-cream ledger spines bound by short brass chains to every shelf. Mid-ground: one chained ledger pulled half-out of its slot, evidence of recent reference. Mood: knowledge that does not raise its voice.

### Tier B — 18 concise sector prompts (`sector_*` · all P2/D)

> Full prompts in source: lines 818–1035. Summarised here; consult source for verbatim text.

- `sector_ark_debris_field` — Vast drifting wreckage field of a thousand shattered Ark-ships in deep void, cold-blue nebula backlight silhouetting every wreck; one intact bow lit from within reads as a moving lantern in a graveyard. A single intact stained-glass viewport-pane drifting free. Mood: the procession of grief.
- `sector_terminus_approach` — Dead approach-corridor pointed toward Terminus, spore-density thickening visibly left-to-right. Deep bruise-red core-glow from inside the densest spore-clouds far down-corridor. A single intact navigation buoy still pulsing slowly inside the spore-fog, decades after anyone listened. Mood: a road that finishes you mid-step.
- `sector_research_corridor_alpha` — Sealed Dischordian-era science hab shared lab. Cool lab-white overhead panels, hologram-cyan key from central holographic diagram, warm amber notepad-light. Two arguing figures bracketing the diagram — one human in lab coat, one Quarchon-humanoid in matching but not identical kit. Mood: collaboration as polite combat.
- `sector_research_corridor_beta` — Resonance Institute Annex (DeMagi). Tall cylindrical glass containment chambers with brass collar-mounts, internal tracer-elements as slow-rotating coloured wave-patterns (fire as braided orange, water as braided cyan). Walls papered with hand-written protocol corrections in fading indigo ink, multiple corrections layered across decades. Mood: ongoing argument with the world's basic forces.
- `sector_research_corridor_gamma` — Quarchon dimensional-stability lab. Apparatus rendered as three nested cubes — outer brushed titanium, mid dark obsidian, inner faceted black-glass — all rotating at independent rates that visibly do not match harmonically. One violet dimensional-flicker pinpoint pulsing inside the innermost rotating cube. No windows, no doors. Mood: a room engineered for one purpose only.
- `sector_probability_market_hub` — New Babylon Probability Market Hub trading floor at peak hours. Price-boards as horizontal LCD bands where each commodity shows three parallel future-values branching sideways like growth-rings. Traders frozen mid-gesture — mouths half-open — paused exactly between certainties. A single coffee cup floating mid-air mid-spill. Mood: the moment before commitment.
- `sector_syndicate_route_prime` — Hidden Syndicate warp-lane bristling with bio-scanner pylons (repurposed old Empire navigation towers overgrown with chitinous bio-scanner growths). One Seven-Omicron green pass-light pinpoint on a single specific pylon. Courier skiff hull in matte black with running lights deliberately dimmed to invisibility. Mood: passage by permission.
- `sector_command_post_iron` — Iron Lion Command Post built into a fortified mountain crag. Dusk-amber oil-lamp practicals, cold-grey daylight bleeding through narrow window. Hundreds of slender ribbon-of-the-dead in muted ribbon-gold and faded red hanging from every ceiling beam, Iron Lion sigil painted on the rear rockface but rain-faded almost to ghost. Two officers (one human, one Quarchon-humanoid). A third officer's chair pushed back, jacket draped. Mood: doctrine kept warm at low fire.
- `sector_intelligence_exchange_nightline` — The Nightline Exchange — unmarked deep-space bar. Bar-amber pendant lamps, shadow-indigo eating most of the room, one cold cyan data-slate glow on a single tabletop. Two shadowed silhouettes hunched across that table — heads close, one passing something across. No signage anywhere. Mood: rooms whose business is not knowing what room you are in.
- `sector_atarion_ruins` — Ancient DeMagi memory-stones half-buried in pale dust on a barren plain. Memory-stone teal subsurface glow pulsing softly from each stone visualised as thin concentric rings expanding outward. A kneeling Quarchon probability-inspector with a calibration device pressed to a stone, body language obviously embarrassed — readout visibly flat-lining. Mood: older than the people sent to study it.
- `sector_tidewater_archive` — An underwater DeMagi archive seen through a glass observation dome at depth. Pale sea-green underwater filtered daylight. Suspended parchment-cream manuscript leaves preserved pages floating gently in pale-green tinted water, slow archival-fish drifting between shelves like curators on rounds. A frustrated Quarchon inspector tapping a useless palm-print panel on the dome. Mood: knowledge that has chosen its own depth.
- `sector_skyforge_plateau` — Skyforge Plateau — vast floating industrial city suspended mid-cloud. Forge-orange thermal-vents along the underside, mismatched architectural styles bolted to a common skeleton — DeMagi vellum-coloured towers next to Quarchon black-glass spires. Shared signal-mast flying a DeMagi flag and a Quarchon flag side-by-side from the same crossbar — clearly grudging. Mood: grudging coexistence held aloft by industry.
- `sector_ember_memorial` — Ember IV Memorial — colossal blackened crater where a world used to be. Forty-six rim-flames in muted amber, each tended by a dark-cloaked silhouette in identical posture, plus a Quarchon visitor standing slightly apart in a clean grey field uniform. One of the forty-six tenders has paused, head turned half toward the visitor — uncertain whether to acknowledge. Mood: forty-six small flames, exactly.
- `sector_hidden_pureflame_cell` — The Pure Flame's Forge — hidden underground forge-chamber. Forge-red incandescent furnace mouth at the rear wall as dominant key, polished obsidian walls catching long red reflections, ancient runic symbols cut into the walls glowing hot from beneath the surface. Masked figure (Arch-Burner Vel) mid-strike. Mid-ground: a half-finished blade resting on the anvil glowing white-hot. Mood: secret craft as devotion.
- `sector_hidden_firstpattern_cell` — The First Pattern's Lattice — hidden First Pattern cell, substrate-dwelling Architect chamber. Walls grown not built — geometric crystalline lattices in pale-white branching outward in perfect recursive Architect-doctrine pattern. Dormant construct in bone-white ceramcrete with red-black trim, both arms folded across chest in dormancy posture. One red 1800K stand-by pinlight on the construct's chest — the only thing in the room that reads alive. Mid-ground: thin crystalline tendrils visibly growing from the wall toward the construct, claiming it slowly. Mood: a thing waking on its own schedule.
- `sector_new_atarion` — New Atarion post-fall human capital city under a weary slow dawn. Exhaustion-amber rising-sun horizon-glow, three damaged shipping-platforms visible on the skyline (one still surrounded by repair-scaffold after eleven years). Residential rooftops with hanging laundry and small kitchen-gardens, no commercial lights. One warm yellow council-lamp practical still burning in the topmost room of a single tower as the saturated accent — they have not slept. A single early bicycle moving down a long avenue, the only motion in frame. Mood: the morning of a city that is still recovering.
- `sector_thaloria` — Thaloria — the storm-planet's sister-world, now almost unnaturally quiet. Warm dawn-peach sky-glow, soft sage-green reflected ground-light. A single modest council hall of pale parchment-cream stone, completely undefended — no walls, no turrets, no fences anywhere visible to horizon. Hierophant in cream-violet robes mid-sentence at an outdoor wooden writing desk. A single violet ink-droplet poised on the nib of the Hierophant's pen, suspended. Mood: silence that is not waiting for permission.
- `sector_clone_collective` — The Clone Collective — city plaza of seventeen thousand identical faces, here rendered as a rhythmic crowd of identical civilian silhouettes. Every figure with the same proportions and face profile, dressed in slightly varied civilian clothes, each doing something slightly different — reading a paper, arguing with the air, tending a flowerbox, carrying groceries — variation in posture creates rhythm without breaking the identical-face read. A single turning figure with warm rose-gold rim — they alone are warm. A single child-clone among the adults, scaled for age but identical in face, holding the hand of an adult-clone — the same person at two ages. Mood: the question of which one of them said yes.

## 9.9 Sector ID → asset selector (lines 1073–1117)

`TRADE_EMPIRE_SECTOR_ASSET_BY_ID` resolves runtime sectorId to either a generated prompt assetId or a pre-existing CDN path. 33 sectors all resolve; the four "existing" sectors (free_ports, terminus_core, hell_gate, dreamer_barrier) point to `art/planets/*.png` paths (cf. §9 header).

---

# 10. DMC naming prompts (4 entries — NOT art)

**Source:** `apps/shared/dmcNamingPrompts.ts` (132 lines).
**Note:** These are *text prompts shown to the player* (Nilmorg eulogy + naming question), not art prompts. Included for completeness because the filename matches the audit query, but they do **not** produce CDN-shipped art.

- **`student`** (order 1, after 3 races) — "What does a student call themselves when they are learning something they are not supposed to learn?" — flag `dmc_student_named`.
- **`seeker`** (order 2, after 6 races) — "What does a person call themselves when they are searching for a thing they cannot yet describe?" — flag `dmc_seeker_named`.
- **`detective`** (order 3, after 9 races) — "What does a person call themselves when they know the shape of the answer and they are hunting the proof?" — flag `dmc_detective_named`.
- **`last`** (order 4, after 12 races) — "What does a person call themselves when they know this is the last body they will ever wear?" — flag `dmc_last_named`.

---

# 11. Expansion-art manifests (registry-only — no prompt text)

> These files under `apps/shared/expansionArt/` are typed slug→CDN-path
> registries for **producer-delivered** assets. They do NOT contain prompts;
> they encode the canonical CDN paths and metadata the runtime resolves
> via `assetUrl()`. They're catalogued here because they document
> CDN paths and constitute the second-most-authoritative source for the
> ship-readiness audit (after the prompt catalogs).

All files live under `apps/shared/expansionArt/`. Total: 22 files, ~17K lines.

| File | Lines | Contents |
|---|---:|---|
| `_assetManifest.ts` | — | `makeAssetManifest()` helper used by every registry. |
| `album1Slideshows.ts` | 794 | 29 tracks · 490 frames · 3168×1344 cel-shaded anime. Source: `Album_1_Age_of_Dischordian_Logic.zip` (2026-04-28). Path: `art/slideshows/album1/T<NN>/<file>.webp`. |
| `album2Slideshows.ts` | 575 | Album 2 slideshow registry. |
| `album3Slideshows.ts` | 857 | Album 3 slideshow registry. |
| `album4Slideshows.ts` | 394 | Album 4 slideshow registry. |
| `album5Slideshows.ts` | 1160 | Album 5 slideshow registry. |
| `chessCutscenes.data.ts` | 183 | 25 chess cutscene entries (9 tutorial + 11 ladder + 4 climb + 1 hidden). |
| `cinematicsManifest.ts` | 574 | 24 cinematics (9 acts + 5 quarterly DLC + 6 arc cold-opens) and 21 VFX clips across 5 categories (`act_spells`, `card_flips`, `cosmetic_ceremonies`, `hierarchy_mechanics`, `dreamer_visions`). Plus expansion cutscenes aggregate. |
| `dischordiaBaseSet.ts` | 718 | Dischordia card base-set art slugs. |
| `expansionCutscenes.data.ts` | 444 | 67 room/event cutscenes (NEW_CUTSCENES_67.zip). |
| `guildCutsceneVoMap.ts` | 249 | Guild cutscene VO mapping. |
| `guildCutscenesManifest.ts` | 347 | Guild cutscene manifest. |
| `hierarchyOfDamned.ts` | 216 | Hierarchy of the Damned art registry. |
| `loginMemeSequence.ts` | 273 | Login meme sequence frames. |
| `newArtInventory.data.ts` | 1863 | 1,838 producer-delivered assets across 16 top-level categories (NEW_ART_1/2/3 drops, 2026-05-12). **Slug-only inventory.** |
| `newArtManifest.ts` | 233 | Typed per-category derivation from `newArtInventory.data.ts`. |
| `professorSignatureCards.ts` | 107 | Professor signature card art slugs. |
| `roomArtManifest.data.ts` | 7086 | **Largest manifest** — room art data (no prompts; CDN paths only). |
| `roomArtManifest.ts` | 278 | Room art manifest wrapper. |
| `roomHotspotManifest.ts` | 125 | Room hotspot slug registry. |
| `signatureCardManifest.ts` | 152 | Signature card manifest. |

**Cinematics — keyframe paths only** (no prompts in source):

- `01_pack_opening` → `videos/cinematics/01_pack_opening/cinematic_01_card_pack_opening.mp4` (+6 keyframe webps)
- `02_hierarchy_reveal` → `videos/cinematics/02_hierarchy_reveal/cinematic_02_hierarchy_reveal.mp4` (+5 keyframes)
- `03_act1_memoir`...`09_act7_convergence` — one per act
- `y1q1_first_charter`...`y2q1_charter_schism` — 5 quarterly DLC openers
- `lord_kanshi_sha_antiquarian` — arc cold-open
- `wraith_calder_syndicate_of_death`, `akai_shi_necromancers_lair`, `wolf_planet_of_the_wolf`, `lycos_path_a_reanimation`, `wolf_hunt_arc_complete`, `wolf_hunt_arc_failure` — death/rebirth cinematics

Each carries a `frameLine` (single-sentence reduced-motion fallback caption) but no producer art prompt.

---

# 12. Production document prompt books (docs/production/**/*.md)

> Heavy prose prompt books. These document producer-direction, prompt
> language, and CDN expectations for assets delivered outside the typed
> catalogs. Total: 47 markdown files across docs/production/. Listed
> here with line counts; consult the source for verbatim prompts —
> they are too long to inline in this audit (largest is 60K lines).

## 12.1 Major prompt books

| File | Lines | Scope |
|---|---:|---|
| `_PRODUCTION_FINAL.md` | 60,078 | Master production prompt book — every asset spec rolled together. |
| `NANO_BANANA_VEO_FULL_PROMPT_BOOK.md` | 4,137 | Full Nano-Banana + Veo 3 prompt book (cards, portraits, environments). |
| `GUILD_CUTSCENE_BIBLE.md` | 3,798 | Guild cutscene bible — per-cutscene prompts + CDN paths. |
| `CASINO_EXPANSION_ART_BIBLE.md` | 1,623 | Casino expansion art bible. |
| `_MISSING_ART_PROMPTS.md` | 1,149 | Backfill prompts for shipped-but-prompt-missing assets. |
| `NANO_BANANA_VEO_FIGHT_INTRO_PROMPTS_DRAFT.md` | 798 | Fight-intro prompts (Veo). |
| `_PRODUCTION_FINAL_PART_III_RETROFIT.md` | (large) | Retrofit prompts following _PRODUCTION_FINAL. |
| `INCEPTION_ARK_FINAL_PRODUCTION.md` | (large) | Ark interior asset specs. |
| `INCEPTION_ARK_FINAL_PRODUCTION_NOTES.md` | — | Companion notes. |
| `_CHESS_CUTSCENE_PROMPTS.md` | 387 | 25 chess cutscene prompts. |
| `CUTSCENE_SEEDANCE_PROMPTS.md` | 301 | Cutscene prompts for the Seedance variant. |
| `_PRODUCTION_APPRENTICE_COMMONS.md` | — | Apprentice commons-room asset specs. |
| `_PRODUCTION_ARK_ROOMS.md` | — | Ark room-by-room asset specs. |
| `_PRODUCTION_VEHICLES.md` | — | Vehicle silhouette specs. |
| `_PRODUCTION_HELLBOXES.md` | — | Hellbox apparatus specs. |
| `_PRODUCTION_DESTINATIONS.md` | — | Destination art specs. |
| `_PRODUCTION_CROSS_CUT.md` | — | Cross-cut cinematic prompts. |
| `_PRODUCTION_CUTSCENE_PROMPTS.md` | — | Cutscene prompt book. |
| `_PHASE_H_INGEST.md` / `_PHASE_H_HANDOFF.md` | — | Phase-H cutscene production handoff. |
| `_ORPHAN_POSTER_VEO_BRIEF.md` | — | Veo brief for orphan posters. |
| `dreamer-vision-veo-flashes.md` | — | Dreamer-vision Veo flashes (cf. §11 VFX dreamer_visions). |
| `LIVING_CHARACTER_SHEET_ART_BRIEF.md` | — | LCS art brief. |
| `MYSTERY_CLUE_BINDING_AUTHORING_SPEC.md` | — | Mystery clue art binding spec. |
| `ENGINE_DEMO_CARDS_ART_HANDOFF.md` | — | Engine demo cards art handoff. |
| `CHOICE_IMPACT_PRODUCER_HANDOFF.md` | — | Choice-impact producer handoff. |
| `ACT1_TAUNTS_PIPELINE_OPS_HANDOFF.md` | — | Act-1 taunts pipeline handoff. |
| `ACT1_NARRATIVE_STRUCTURE.md` | — | Act-1 narrative structure (some art callouts). |
| `WRITING_AUDIT_AND_REVISIONS.md` | — | Writing audit covering art prompt revisions. |
| `ALL_ACTS_ROADMAP.md` | — | All-acts art roadmap. |
| `FIGHTER_LORE_CROSSREF.md` | — | Fighter portrait + lore crossref. |
| `FIGHT_CDN_URLS.md` | — | Fight-asset CDN URLs (registry-style). |
| `ASSET_URLS.md` | — | Canonical hero asset URLs. |
| `CADES_SFX_PROMPTS.md` | — | SFX prompts for the Cades FPS. |
| `CONSISTENCY_GATE.md` | — | Cross-asset consistency gate. |
| `VOICE_OVER_BIBLE.md` | — | VO bible (not art). |
| `GUILD_CUTSCENE_PORTAL_CHAMBER_FOLLOW_UP.md` | — | Portal chamber follow-up. |

## 12.2 `docs/production/prompts/` (specialised)

| File | Lines | Scope |
|---|---:|---|
| `cades-fps-production-prompts.md` | 1,017 | Cades FPS production prompts (asset, level, character). |
| `puzzle-answer-book.md` | 594 | Puzzle answer book (mystery puzzles). |
| `suno-game-music-prompts.md` | 371 | Suno music-generation prompts. |
| `kling-omni-INDEX.md` | 132 | Kling Omni index, points to subfolders (`kling-omni-act-intros`, `kling-omni-mechanic-intros`). |
| `slide_content.md` | 131 | Slideshow content prompts. |
| `kling-discovery-video-prompts.md` | 122 | Kling discovery-video prompts. |

## 12.3 `docs/production/acts-2-7-aaa-final/`

| File | Scope |
|---|---|
| `ASSET_MANIFEST.md` | Acts 2-7 AAA-final asset manifest. |
| `production_notes.md` | Production notes. |
| `remaining_work.md` | Outstanding work tracker. |
| `DELIVERY_NOTES.md` | Delivery notes. |
| `character_canon_map.md` | Character canon map. |

## 12.4 `docs/production/act1/`

| File | Scope |
|---|---|
| `authority-trial-phase-mechanic.md` | Authority Trial phase-mechanic asset/prompt brief. |
| `public-witness-ui-spec.md` | Public Witness UI spec. |
| `seer-prophecy-mechanic.md` | Seer Prophecy mechanic art brief. |
| `warlord-three-move-mechanic.md` | Warlord three-move mechanic. |
| `reference/enigma-gaze-timeline.csv` | Enigma-gaze timeline reference. |
| `reference/enigma-branch-deltas.md` | Enigma branch deltas. |

## 12.5 `docs/production/act1-asset-build/`

- `unified_act1_rebuild_manifest.md` — Act-1 unified asset rebuild manifest.

## 12.6 `docs/production/prelude-asset-build/`

- `CONVERSION_FOLLOW_UP.md` — prelude-asset conversion follow-up.
- `UX_INTERACTION_SPEC.md` — prelude UX interaction spec.
- `AAA_AUDIT_REPORT.md` — prelude AAA audit.
- `manifests/asset_prompt_manifest.json` — typed JSON prompt manifest for the prelude rebuild.
- `manifests/README.md` — manifests README.

## 12.7 `docs/production/trade-empire-asset-build/`

- `ART_PROMPT_DOCUMENT.md` (304 lines) — companion prompt document for the Trade Empire build (sibling to §9's typed catalog).
- `ART_COVERAGE_AUDIT.md` — coverage audit.

## 12.8 `docs/production/commission-packages/`

- `README.md`
- `p0-tranche.csv` — P0 commission tranche.
- `acts-2-7-tranche.csv` — Acts 2-7 commission tranche.

## 12.9 `docs/production/audit/`

Audit tooling artefacts — `all-urls.tsv`, `cdn-liveness.tsv`,
`per-source-status.tsv`, `path-mismatches.tsv`, `awakening-cutscene-revision-2026-05.md`,
`chapter-intro-canon-gap-2026-05.md`, etc. Also `dead-urls/` with per-file
dead-link reports for card definitions and shared modules. These are
**audit outputs**, not prompts, but document path-mismatch coverage of
shipping art.

## 12.10 Other top-level prompt files

- `output/suit-art-prompts.md` (10,178 lines) — generated markdown twin of §1.
- `output/room-state-art-prompts.md` (170 lines) — generated markdown twin of §5.

---

# Notes, gaps, and ship-readiness observations

## Prompt files that appear complete with shipped CDN paths

- `suitArtPrompts.ts` — 1,080-entry generator with stable id format. Test in `apps/shared/__tests__/suitArtPrompts.test.ts` enforces coverage invariant.
- `recurringSuitArtPrompts.ts` — Parametric 500-entry generator; rentals only.
- `earnedLoadoutArtPrompts.ts` — 15 entries with 1:1 sibling test against `earnedLoadouts.ts`.
- `awakeningCinematicPrompts.ts` — All 10 entries have `videoUrl` set (each step's mp4 is on CDN). Confirmed by the file's own header comment (lines 26–30).
- `roomStateArtPrompts.ts` — 8 entries, all P0/P1.
- `roomTierArtPrompts.ts` — 6 entries; supplementary to §F flag-driven roomStateArtPrompts.
- `roomMediaPrompts.ts` — 26 stills + 8 videos. P2 species-exclusive rooms are present but per the header note (lines 27–31) carry no critical-path content.
- `act1ArtPrompts.ts` — 32 entries with canonical Bible-section anchors. CSV generator wired.
- `tradeEmpireArtPrompts.ts` — 70 entries; 4 sector slots map to existing shipped art rather than re-prompting.

## Likely-incomplete / partially-tracked

- **`act1ArtPrompts.ts`** declares 36 total in the header (12 portraits + 10 battlefields + 14 card arts) but only 32 are in `ACT1_ART_PROMPTS`: 12 portraits + 10 battlefields + 3+6+5 = 14 card arts. Counts match; the `slideshow_frame` category is declared in the type union but **no entries exist** in this file (lines 27–28). Could be future-tracked or moved to album*Slideshows.ts.
- **Expansion-art manifests** are registry-only — they shipped without producer-prompt text in repo. To audit the prompts behind them you must consult `docs/production/*.md` (e.g. `NANO_BANANA_VEO_FULL_PROMPT_BOOK.md` and `_PRODUCTION_FINAL.md`).
- **DMC naming prompts** are not art (text-only).
- **`docs/production/_PRODUCTION_FINAL.md`** at 60,078 lines is a single monolithic prompt book; prompts inside aren't structured for programmatic extraction. If ship-readiness depends on it, consider migrating its art-prompt content into typed shared/ catalogs.
- **`docs/production/audit/dead-urls/`** contains per-file dead-URL reports for 8 card-definition modules, indicating known broken CDN links in shipping card definitions. Cross-check with the typed art catalogs above.
- **`docs/production/audit/path-mismatches.tsv`** suggests there are catalogued path mismatches between producer-uploaded assets and runtime references; this is the canonical place to drive ship-readiness corrections.

## Cross-file invariants enforced by tests

- `suitArtPrompts.test.ts` — 18 × 6 × 10 = 1,080 entries.
- `earnedLoadoutArtPrompts.test.ts` — 1:1 with `earnedLoadouts.ts`.
- `roomArtManifest.test.ts`, `roomHotspotManifest.test.ts`, `signatureCardManifest.test.ts` — manifest coverage tests.

## Style anchors at a glance

| Catalog | Anchor variable | Aesthetic |
|---|---|---|
| Suit | `SUIT_PREAMBLE` | Cyberpunk × steampunk sorcery, 1024×1536, 2:3, transparent alpha |
| Earned loadout | `EARNED_LOADOUT_STYLE_ANCHOR` | Same aesthetic, 1024×1024 catalog/codex isolated |
| Room state | `ROOM_STATE_STYLE_ANCHOR` | 1920×1080, 28mm wide-shot, Ark interior |
| Room tier | (re-exports state anchor) | Same |
| Room media (image) | `ROOM_MEDIA_STYLE_ANCHOR_IMAGE` | Same as room state |
| Room media (video) | `ROOM_MEDIA_STYLE_ANCHOR_VIDEO` | 24fps, locked-camera default, no audio |
| Act 1 | `ACT1_GLOBAL_STYLE_ANCHOR` | Warmer biographical palette, anamorphic flares, 4K |
| Trade Empire | `TRADE_EMPIRE_STYLE_ANCHOR` | Painterly digital illustration, one accent colour, bio-mechanical/crystalline |
| Awakening | `AWAKENING_STYLE_ANCHOR` | 16:9 loop, Ark cyberpunk × steampunk sorcery |
| Shadow Tongue | `SHADOW_TONGUE_CORRUPTION_LAYER` | Composable overlay — unnameable indigo, 1px RGB shift, two-layer glyphs |

