/* ═══════════════════════════════════════════════════════
   TRADE EMPIRE ART PROMPTS — canonical prompt catalog

   Nano Banana 2 prompts for the Trade Empire expansion
   (Civilization / Market / Council / War Room / Convergence).

   apps/scripts/generate-trade-empire-art-csv.ts consumes this
   module to emit a producer-queue CSV.

   Style anchor: every prompt inherits the Dischordian Saga
   house style (painterly digital illustration, high-contrast
   low-saturation palette with one hot accent colour, bio-
   mechanical/crystalline/wet-chrome textures, subtle eldritch
   geometry in negative space). See TRADE_EMPIRE_STYLE_ANCHOR
   below.

   Categories (70 prompts total, all locations/features):
     - wonder              (8  prompts · 2:3 portrait)
     - era_banner          (5  prompts · 21:9 ultra-wide)
     - encounter_key_art   (4  prompts · 4:3 landscape)
     - doctrine_banner     (4  prompts · 2:1 landscape)
     - fleet_silhouette    (6  prompts · 1:1 square transparent)
     - pirate_portrait     (1  prompt  · 1:1 square)
     - civic_icon          (9  prompts · 1:1 square)
     - sector_painting     (33 prompts · 3:2 landscape)

   Already-imaged sectors (reference-only, not regenerated):
     free_ports, terminus_core, hell_gate, dreamer_barrier
   ═══════════════════════════════════════════════════════ */

export type TradeEmpireArtCategory =
  | "wonder"
  | "era_banner"
  | "encounter_key_art"
  | "doctrine_banner"
  | "fleet_silhouette"
  | "pirate_portrait"
  | "civic_icon"
  | "sector_painting";

export type TradeEmpireArtPriority = "P0" | "P1" | "P2";

export interface TradeEmpireArtPrompt {
  /** Canonical asset id used by UI wiring. */
  assetId: string;
  /** Human-readable display label. */
  name: string;
  /** Asset category. */
  category: TradeEmpireArtCategory;
  /** Target resolution, e.g. "1024x1536". */
  resolution: string;
  /** Dominant palette description (colour discipline for the batch). */
  palette: string;
  /** Composition / subject body text (without the global style anchor). */
  composition: string;
  /** What the image must NOT contain. */
  negativePrompt: string;
  /** Delivery priority. Gate-A pieces are P0. */
  priority: TradeEmpireArtPriority;
  /** Which review gate the piece belongs to (A/B/C/D). */
  reviewGate: "A" | "B" | "C" | "D";
}

/**
 * Dischordian Saga house style, threaded into every prompt.
 * The CSV generator prepends this to the per-prompt composition.
 *
 * Tuned for Nano Banana 2 (Google Gemini Flash Image, late-2025): the
 * model rewards (a) natural-language subject-first sentences, (b) named
 * camera/lens/angle, (c) explicit lighting recipes with colour-temperature
 * cues, (d) concrete material callouts, (e) layered depth-plane staging,
 * and (f) a single closing mood line. Style anchor is prepended to every
 * composition by composeTradeEmpireArtPrompt() below.
 */
export const TRADE_EMPIRE_STYLE_ANCHOR =
  "Dischordian Saga house style for Nano Banana 2. Painterly digital illustration with visible brushwork at 1:1 and clean read at thumbnail scale. High-contrast low-saturation palette anchored on one hot accent colour per piece, never two. Cinematic lighting — single dominant key source, soft volumetric haze gradient across at least three depth planes, rim light only on hero silhouettes. Materials skew bio-mechanical / crystalline / wet-chrome / weathered ceramcrete; surface detail at the level of paint chips, water-staining, and honest wear. Subtle eldritch geometry suggested in negative space (rings-within-rings, recursive spirals, impossible angles) — never explicit. No on-image text, no UI chrome, no lens flares, no modern logos, no readable signage. Reference: docs/production/COMPLETE_ART_PROMPT_BIBLE.md and ACTS_2_TO_7_PRODUCTION_BIBLE.md.";

/**
 * Sectors that already ship with existing art. The vault tracks them
 * for coverage accounting (100% of 38 sectors) but does not re-prompt
 * them unless style-lock demands a redo in a later follow-up.
 */
export const TRADE_EMPIRE_EXISTING_SECTOR_ART: Readonly<
  Record<string, string>
> = {
  free_ports: "art/planets/planet-degens-casino.png",
  terminus_core: "art/planets/planet-terminus.png",
  hell_gate: "art/planets/planet-castle-of-death.png",
  dreamer_barrier: "art/planets/planet-violetta.png",
};

/* ─── 1a. Wonders — key art (8 prompts · 2:3 portrait, 1024×1536) ─── */

const WONDERS: readonly TradeEmpireArtPrompt[] = [
  {
    assetId: "wonder_ark_cathedral",
    name: "The Ark Cathedral",
    category: "wonder",
    resolution: "1024x1536",
    palette:
      "ivory, cathedral gold, void black, one distant cold-blue rim-light",
    composition:
      "Vertical hero portrait of a kilometre-tall sacred starship converted into a living cathedral, suspended in deep space above a pale blue Earth-like planet. Camera: low-angle medium-wide composition at ~24mm equivalent, viewer looking up the hull's vertical spine, planetary curvature held to the lower 20% of the frame for monumental scale. Lighting: warm 3200K stained-glass interior glow leaking outward through arched bio-mechanical viewports as the dominant key, cool 6500K planetary albedo as ambient fill on the lower hull, a single distant cold-blue rim picking out the ivory spires from camera-left. Materials: weathered ivory ceramcrete, gold-leaf inlay around viewport frames, wet-chrome hull patches at the join lines, paper-thin memorial ribbons fluttering soundlessly in vacuum and fading translucent at their tails. Mid-ground: a scattered shoal of refugee skiffs drifting toward the hull, each barely a pixel wide and silhouetted pilgrim-like. Upper-left negative space holds dense black starfield with subtle ring-within-ring geometry suggested in the dust lanes. Soft volumetric choir-light halo radiating from the hull's centre. Mood: shelter, vigil, the Potentials' home.",
    negativePrompt:
      "no humans in frame, no visible text, no lens flare, no modern sci-fi clean lines",
    priority: "P0",
    reviewGate: "A",
  },
  {
    assetId: "wonder_red_crystal_spire",
    name: "The Red Crystal Spire",
    category: "wonder",
    resolution: "1024x1536",
    palette:
      "deep red, obsidian, brass highlights, one sickly green reflection",
    composition:
      "Vertical hero portrait of a jagged red crystalline obelisk the size of a mountain rising out of an Authority capital's megacity skyline at dusk. Camera: low-angle hero shot at ~28mm equivalent, viewer effectively at street level, the spire dominating the upper two-thirds of frame and the city compressed across the lower third. Lighting: the spire is internally lit with deep ruby refraction that stains every adjacent skyscraper's windows blood-orange across hundreds of panes; ambient sky bruise-violet at twilight; a single sickly green ground-level reflection pools from a hidden source out of frame. Materials: faceted obsidian-red crystal with internal flaws and recursive lattice glimpsed through fissures, brass armatures bracing the base, dark concrete and gold-window grids on the surrounding architecture. Mid-ground: a procession of Authority cargo freighters spiralling lazily around the spire, running lights as small rust-orange motes against the red. At the spire's base: a thin stratum of red vapour condenses on the pavement — visualised wealth, spilled. Mood: wealth as law, law as weapon.",
    negativePrompt: "no flames, no explicit logos, no cartoon sparkle",
    priority: "P0",
    reviewGate: "A",
  },
  {
    assetId: "wonder_forge_monolith",
    name: "The Forge Monolith",
    category: "wonder",
    resolution: "1024x1536",
    palette: "char-black, forge white, molten amber, deep teal shadows",
    composition:
      "Vertical hero portrait of a black basalt monolith cracked open along its centreline to expose a white-hot industrial furnace-core, taller than any surrounding shipyard scaffolding. Camera: low-angle medium-wide at ~24mm equivalent, viewer looking up the cleft so the white-hot fissure becomes a vertical light slash through the centre of frame. Lighting: blinding 5000K furnace key from inside the crack as the dominant source, deep teal shadow fill across the basalt face, molten amber rim lining the orbital robotic arms, no ambient — pure void backdrop. Materials: char-black volcanic stone with a glassy obsidian sheen, white-hot incandescent metal at the cleft, brushed-titanium robotic assembly arms, half-finished frigate hull plates in matte iron grey. Mid-ground: skeletal robotic arms in mid-weld around floating frigate hulls, sparks suspended in zero-g forming a slow constellation across the right half of frame. Foreground anchor: a single rope-like power conduit curving across the lower-left edge for scale. Distant background: a starless industrial void, no planet visible. Architect-aesthetic ritual symmetry implied in the monolith's silhouette. Mood: industrial sublime, war as craft.",
    negativePrompt: "no sci-fi chrome, no people, no ad-style energy beams",
    priority: "P1",
    reviewGate: "B",
  },
  {
    assetId: "wonder_remembrance_garden",
    name: "The Remembrance Garden",
    category: "wonder",
    resolution: "1024x1536",
    palette:
      "moss green, paper-cream, slate grey, single violet floral accent",
    composition:
      "Vertical hero portrait of a silent grove of bioluminescent memorial trees growing out of the fractured prow of a starship half-buried in a mist-wet plain. Camera: eye-level medium-wide at ~35mm equivalent, slight tilt up so the tallest tree just clears the upper edge, mist gradient compressing depth across three planes. Lighting: cool 4500K bioluminescent moss-green key from the trees themselves as the only practical, low ambient pre-dawn slate, no rim, no fill — let the trees light themselves. Materials: weathered ship hull plating overgrown with pale moss, fine bark wrapped in lichen, paper-thin ledger-leaves with faint ink-blur where names would be (do not render legible characters), wet stone underfoot reflecting tree-glow. Mid-ground anchor: a single silhouetted kneeling figure in crew coveralls at the base of the largest tree, head bowed, no face shown. Foreground: a low ribbon of ground-mist creeping toward the lens. One violet wildflower bloom on the lower-right third — the only saturated pixel in frame. Mood: grief held, not displayed.",
    negativePrompt: "no tombstones, no readable names, no visible tears",
    priority: "P1",
    reviewGate: "B",
  },
  {
    assetId: "wonder_chronarch_lens",
    name: "The Chronarch Lens",
    category: "wonder",
    resolution: "1024x1536",
    palette:
      "tarnished brass, indigo, vellum cream, one violet reflected flare",
    composition:
      "Vertical hero portrait of a colossal brass-and-void-glass astronomical instrument the size of a small moon, half-occluding a banded ringed gas giant. Camera: eye-level medium-wide at ~50mm equivalent for clean optical compression, lens centred so the instrument's concentric rings read as nested ellipses across the upper two-thirds. Lighting: cold reflected gas-giant light as soft 5500K key from camera-left, warm 2800K interior lamp glow from a tiny observation platform on the lens housing, a single violet-amber flare reflecting off the innermost void-glass disc. Materials: tarnished brass with green oxidation in the joins, hand-engraved Antiquarian glyphs catching catchlights along every ring's edge, smoky void-glass at the centre with a refractive depth that doesn't quite match the geometry. Mid-ground: a single Antiquarian figure in layered cream-and-indigo robes standing on the platform, scale-marker only, no face shown. Inside the lens disc: a faint impression of a fleet engagement that has not yet occurred — silhouettes only, ghosted at 20% opacity. Concentric ring rotation suggested by motion-asymmetry, not blur. Mood: knowledge as trespass.",
    negativePrompt:
      "no clocks, no gears in motion blur, no modern telescope silhouettes",
    priority: "P1",
    reviewGate: "B",
  },
  {
    assetId: "wonder_hell_gate_sigil",
    name: "The Hell Gate Sigil",
    category: "wonder",
    resolution: "1024x1536",
    palette:
      "sigil-red, absolute black, one thin gold bar of rim-light on the nearest ship",
    composition:
      "Vertical hero portrait of a colossal circular warding sigil inscribed directly into the void at a Lagrange point — concentric rings of angry red glyphs holding shut a perfect black disc of nothing. Camera: dead-on frontal at ~85mm telephoto equivalent for flat geometric clarity, sigil filling roughly 70% of frame and centred slightly low-of-centre. Lighting: the sigil's red glyphs are the dominant emissive source at sigil-red 1800K, ambient void absolute black, a single thin gold rim picks out the nearest fleet hull at lower-right. Materials: glyph strokes painted as if scored into space itself with brushwork that bleeds at the edges, the central black disc rendered as sub-zero black with no texture or noise — visibly wrong. Foreground/mid-ground: a thin ring of fleet ships in respectful silhouette, holding station at distance, their running lights small and few. Pressing outward from inside the disc: faint pressure-distortions, like fingers behind cloth — described as silhouettes-without-source, not as creatures. Subtle eldritch geometry implied in the negative space outside the sigil rings. Mood: what we keep out, barely.",
    negativePrompt: "no demon faces, no fire, no pentagrams",
    priority: "P1",
    reviewGate: "B",
  },
  {
    assetId: "wonder_immune_choir",
    name: "The Immune Choir",
    category: "wonder",
    resolution: "1024x1536",
    palette: "pale white, cyan, pearl, one black spore accent",
    composition:
      "Vertical hero portrait of an orbital ring-station sheathed in pale white coral and translucent cyan membrane, singing — visualised as concentric pressure rings of pale light pulsing outward across the upper two-thirds of frame. Camera: medium-wide at ~35mm equivalent, low-orbit perspective so the ocean planet curves dramatically across the lower 30% of frame. Lighting: pale 6500K daylight key from off-frame upper-right, cyan internal membrane glow as secondary, soft cool-white planetary albedo as ambient fill, no rim. Materials: coral-white biomineralised hull with soft organic ridges, translucent cyan polymer membrane stretched over the ring's open spans, pearl iridescence catching highlights along the inner curve. Mid-ground action: small red-black spore-motes drift inward from the upper-left edge and dissolve at the moment they touch each pressure-ring expansion — render the dissolution as soft fade, not violence. Below: a clean turquoise ocean world with a single white cloud-band, the only saturated white in frame. Single black spore-mote barely visible at the upper edge — the threat. Mood: purification as lullaby.",
    negativePrompt: "no medical symbols, no bio-hazard icons, no gore",
    priority: "P1",
    reviewGate: "B",
  },
  {
    assetId: "wonder_dreamers_answer",
    name: "The Dreamer's Answer",
    category: "wonder",
    resolution: "1024x1536",
    palette:
      "nebula violet, warm amber fleet-lights, deep blue shadow, single white star-tear",
    composition:
      "Vertical hero portrait of the Dreamer — a colossal sleeping presence rendered only as the curve of a shoulder and the side of a face — half-revealed inside a violet nebula across the upper three-quarters of frame. Camera: cinematic medium-wide at ~50mm equivalent, viewer positioned far enough that her partial face is recognisable as face-shape only, never explicit. Lighting: cold nebula-violet ambient as primary, warm 2700K amber fleet running-lights as the only practical sources at small scale, one single white star-tear point pulled to high luminosity at frame-centre as the literal accent. Materials: nebula gas-cloud rendered in soft impasto brushwork, the Dreamer's skin treated as star-field-overlaid translucency where the curvature meets vacuum, fleet ships as small disc highlights with warm halos. Mid-ground: a lattice of warm fleet-light pinpricks arrayed in a curved protective shell across the lower-third of frame, every light a ship. Lower-left: a single tear-shape of starlight descending slowly between two distant galaxy spirals. Eyes closed, lashes implied, expression unreadable. Mood: reprieve, not victory.",
    negativePrompt:
      "no face fully shown, no religious iconography, no readable text",
    priority: "P1",
    reviewGate: "B",
  },
];

/* ─── 1b. Era banners (5 prompts · 21:9 ultra-wide, 1792×768) ─── */

const ERA_BANNERS: readonly TradeEmpireArtPrompt[] = [
  {
    assetId: "era_first_light",
    name: "First Light",
    category: "era_banner",
    resolution: "1792x768",
    palette: "dawn amber, soot-black, one pale blue star",
    composition:
      "Ultra-wide cinematic establishing shot, anamorphic 21:9, of a single pre-warp colony fleet drifting away from the fractured silhouette of a home-world. Camera: locked-off horizon at ~50mm equivalent, eye-level, slight distance compression so the fleet reads as a thin geometric line of warm pinpricks. Lighting: amber 2400K dawn key bleeding through dense atmospheric haze, deep soot-black shadow occupying the left third of frame, one pale-blue 8000K star pinpoint upper-right as the only cool note. Composition: rule-of-thirds vertical lines — left third dominated by the ruined planet's broken curve in heavy silhouette, mid-third is open atmospheric dark with the fleet line drifting through it, right third opens into a wide hopeful expanse with a single navigation beacon flare on the third-line. Materials: planet rendered in rough impasto with cracked-shell surface detail, fleet hulls as small flat warm-amber discs with no individual rivet detail, atmospheric haze as a soft gradient with visible particulate. Foreground: a thin layer of high-altitude debris drifting along the lower edge for depth. Mood: survival dawn.",
    negativePrompt:
      "no explosions, no ships with visible guns, no text",
    priority: "P0",
    reviewGate: "A",
  },
  {
    assetId: "era_ark_awakening",
    name: "Ark Awakening",
    category: "era_banner",
    resolution: "1792x768",
    palette:
      "ivory, cathedral gold, deep indigo sky, one distant red flare on the horizon",
    composition:
      "Ultra-wide cinematic panorama, anamorphic 21:9, of the Ark Cathedral's hull opening and pouring warm cathedral-gold light across the surface of a pale inhabited moon. Camera: medium-wide at ~50mm equivalent, slight high angle so the moon's curvature traces a low arc across the lower third, the Ark held centred-left at thirds intersection. Lighting: warm 3000K cathedral-gold spill from the opened hull as the dominant key dramatically lighting the moon's daylight side, deep indigo sky as ambient fill, a single distant red 1500K flare pricking the horizon at the right-third line — small enough to be missable, deliberate enough to foreshadow. Materials: ivory ceramcrete on the Ark with golden-leaf seams freshly catching light, dusty pale lunar regolith with footprint-trails fading at the horizon, atmospheric particulate softening the gold beam into a wide volumetric cone. Mid-ground: small refugee skiffs in silhouette tracking toward the Ark in a loose pilgrim-line, motion implied by trailing shadows on the lunar surface. Right-third negative space: open indigo sky holding the foreshadowing red flare. Mood: gathering. The distant red flare foreshadows the Convergence.",
    negativePrompt: "no weaponry, no crowds of faces, no text",
    priority: "P1",
    reviewGate: "B",
  },
  {
    assetId: "era_sector_lord",
    name: "Sector Lord",
    category: "era_banner",
    resolution: "1792x768",
    palette:
      "brass, warm amber, leather-brown, one cold cyan holographic accent",
    composition:
      "Ultra-wide cinematic 21:9 hero shot of a young empire's star-map war-table viewed from above-and-to-the-side at ~35mm equivalent, three-quarter overhead, the table filling roughly 70% of frame with the chamber receding into deep interior shadow on the edges. Lighting: warm 2700K leather-amber room ambient as base, holographic amber 3500K projection volumetrically lighting up from the table surface as the dominant practical, one cold 6000K cyan holographic accent on a single highlighted sector token, no window source — strictly interior. Materials: brushed brass tabletop with engraved coordinate grids, leather chair-backs in deep oxblood at the edges, holographic sector tokens as semi-transparent amber discs with faint glyph-etching, gauntleted hand in dark armoured leather reaching from right edge. Composition: rule-of-thirds with the held token landing on the lower-right intersection, the player-empire's controlled volume of stars glowing faintly across the upper-left third, the unclaimed dark of the rest of the table on the upper-right. Foreground anchor: a half-empty cup of dark liquid on the lower-left corner of the table for human scale. Mood: deliberate ascent.",
    negativePrompt:
      "no player-character face, no readable glyphs, no modern UI chrome",
    priority: "P1",
    reviewGate: "B",
  },
  {
    assetId: "era_galactic_power",
    name: "Galactic Power",
    category: "era_banner",
    resolution: "1792x768",
    palette:
      "cold steel, twilight violet, deep red in the outer corners only",
    composition:
      "Ultra-wide cinematic 21:9 panorama of a fleet in crescent formation arrayed over a populated planet, viewed from extreme distance at ~135mm telephoto equivalent so the fleet reads as a clean geometric arc of small steel-cold motes rather than individual ships. Lighting: cold 5800K twilight key from upper-right, deep twilight-violet ambient across the upper two-thirds, deep red 1800K bleeding in only at the outermost left and right corners — the edges of the frame are quietly turning. Composition: rule-of-thirds with the planet's curved horizon tracking the lower-third line, the fleet crescent arching cleanly across the centre at exact mid-height, vast empty sky filling the upper third. Materials: planet surface rendered as soft city-light constellations across the night side, fleet ships as flat hard silhouettes against the brighter day-side limb, sky in painterly twilight gradient with subtle ring-within-ring eldritch geometry suggested in the deep right-corner shadow. Foreground: nothing — pure void, viewer hangs in space. No individual ship reads above 4px wide. Mood: dominion, but the sky is turning.",
    negativePrompt:
      "no battle in progress, no muzzle-flashes, no text overlay",
    priority: "P1",
    reviewGate: "B",
  },
  {
    assetId: "era_cosmic_convergence",
    name: "Cosmic Convergence",
    category: "era_banner",
    resolution: "1792x768",
    palette:
      "blood-red, absolute black, one single point of pure white where the impossible shape opens",
    composition:
      "Ultra-wide cinematic 21:9 panorama of the Convergence arriving at galactic scale — the entire frame bathed in a terrible blood-red corona. Camera: dead-on frontal at ~35mm equivalent, no perspective tilt, viewer rooted in place. Lighting: blood-red 1600K corona radiating outward from a single point of impossible pure white at exact frame-centre, absolute black corners, no fill — the white point is the only true accent and it is small. Composition: dead-centred radial symmetry with a horizon-thin line of fleet silhouettes hugging the very bottom edge across the entire width, utterly dwarfed; the impossible geometry — rings-within-rings nesting into a door that is also an eye that is also a mouth — occluding the upper two-thirds. Materials: corona rendered as painterly atmospheric impasto, the central white as hard-edged geometric singularity, the surrounding rings carrying suggestions of recursive spirals at their inner edges, star-field bleeding through wherever the corona thins. The fleet line at the bottom: each ship a pure black silhouette no taller than 3px, no individual detail. Mood: witnessed apocalypse.",
    negativePrompt:
      "no recognisable demon imagery, no fire plumes, no text",
    priority: "P1",
    reviewGate: "B",
  },
];

/* ─── 1c. Eldritch encounter key art (4 prompts · 4:3 landscape, 1536×1152) ─── */

const ENCOUNTER_KEY_ART: readonly TradeEmpireArtPrompt[] = [
  {
    assetId: "encounter_listener_static",
    name: "The Listener Behind the Static",
    category: "encounter_key_art",
    resolution: "1536x1152",
    palette:
      "CRT-green, static-grey, deep black, one pinprick of hot red on a recording indicator",
    composition:
      "4:3 landscape diegetic still of a darkened ship-bridge interior at low power. Camera: locked tripod at eye-level, medium shot at ~35mm equivalent, slight Dutch angle of two degrees so the horizon is subtly wrong. Lighting: cold 7000K CRT-green monitor glow as the only practical key, deep static-grey ambient on the bulkheads, one pinprick of hot 1500K red on a recording indicator at lower-left of frame, no fill, no rim. Materials: scuffed grey ship-deck plating, dust on the consoles, monitor screens rendered as live RF static at high noise density, ceiling speaker grille warped open along a vertical mouth-shaped crack. Composition: left-heavy framing — bridge consoles, monitors, and crew silhouette occupy the left two-thirds; the right third reserved as flat negative space for UI choice-list overlay. Across every monitor screen: a single pale eye visible only as a darker static-pattern emerging from the RF noise, blinking in perfect sync across all screens. Mid-ground: a human comms officer turned three-quarters away from camera, frozen mid-reach, face never visible, headphone-cable taut. Foreground: a coffee mug overturned on the console, contents pooled, not yet dripped. Mood: someone is already listening.",
    negativePrompt:
      "no jump-scare face, no gore, no explicit text on screens",
    priority: "P0",
    reviewGate: "A",
  },
  {
    assetId: "encounter_dreamers_weeping",
    name: "The Dreamer's Weeping",
    category: "encounter_key_art",
    resolution: "1536x1152",
    palette:
      "nebula purple, crystal cyan, ink black, one rose-gold rim on the nearest crystal",
    composition:
      "4:3 landscape key art of the Dreamer's vast unfocused silhouette — only a shoulder-curve and the soft outer line of a distant cheek — rendered across a nebula-scale void. Camera: cinematic medium-wide at ~50mm equivalent, far-field perspective so her form reads as topography, never face. Lighting: cool nebula-purple ambient as base, crystal-cyan internal glow from the falling shard-tear cascade as secondary key, a single warm rose-gold rim on the nearest crystal at exact frame-centre as the only saturated accent. Materials: nebula gas-cloud rendered in heavy painterly impasto, the Dreamer's skin treated as star-field-overlaid translucency where curvature meets vacuum, the crystalline shards cut as faceted geometric forms with refractive caustics catching the rim light. Composition: left-heavy framing — the shoulder-curve anchors the upper-left quadrant, the tear-path curves diagonally down-and-right from the hidden eye through frame-centre, falling shards trail off toward lower-mid; the right third reserved as soft graduated darkness for UI overlay. Mid-shards are obviously raw Void Crystal (geometric, valuable); other shards are simply sad — irregular, melt-shaped, indistinguishable from frozen tears. Mood: grief that can be mined.",
    negativePrompt:
      "no readable face, no realistic tears, no religious halos",
    priority: "P1",
    reviewGate: "B",
  },
  {
    assetId: "encounter_counted_crew",
    name: "The Counted Crew",
    category: "encounter_key_art",
    resolution: "1536x1152",
    palette:
      "warm tungsten, bone-white, deep brown, one cold blue glow from the manifest",
    composition:
      "4:3 landscape diegetic still of a cargo-bay manifest room. Camera: medium-wide at ~28mm equivalent, locked-off, slight low angle to elongate the empty chair in the foreground. Lighting: warm 2700K tungsten work-lamp from upper-right as the dominant key, deep brown ambient shadow filling the right edge, one cold 6500K blue glow projecting from the wall-mounted manifest as the second source bleeding across the room, no fill — strong chiaroscuro. Materials: scuffed bone-white wall paint with handprint smudges around the manifest, dark-stained polymer table edge, chair cushion in worn synthetic with a faintly visible body-shaped indent that has not yet sprung back. Composition: left-heavy — the rocking chair occupies the lower-left quadrant pulled out from the table at 30 degrees, the projected manifest fills the upper-left wall, the right third holds clean negative space reserved for UI overlay. The roster: every name carries two tally columns, and across all rows the right-hand column is always exactly one number higher than the left. Foreground anchor: a clipboard fallen on the floor at the chair's foot, top sheet still settling. The chair rocks — implied by the offset of the cushion-indent against the seat angle, no motion blur. Mood: someone who was never hired is at work.",
    negativePrompt:
      "no ghost figures, no readable names, no motion blur",
    priority: "P1",
    reviewGate: "B",
  },
  {
    assetId: "encounter_final_invitation",
    name: "The Final Invitation",
    category: "encounter_key_art",
    resolution: "1536x1152",
    palette:
      "obsidian door, honey-gold leak, deep space blue, one ember-orange reflection on the nearest ship's hull",
    composition:
      "4:3 landscape key art of a colossal obsidian-black door suspended in open space — no wall, no station, no frame, just the door. Camera: medium-wide at ~50mm equivalent, slight upward tilt so the top edge of the door dissolves into starfield, viewer at fleet-altitude. Lighting: deep space-blue 3500K ambient base, a single warm 2400K honey-gold leak streaming out from the centre-line crack as the dominant key, one ember-orange 1800K reflection catching the underside of the nearest approaching ship's hull as the only accent on a silhouette. Materials: obsidian door-face with a wet-stone sheen, faint Antiquarian-style glyph carving in low relief — a single polite welcome glyph that reads (even to viewers who can't translate it) as a complete sentence ending in a question mark. A hairline crack runs vertically down the centre, glowing honey-warm where it splits. Composition: left-heavy — door centred on the left-third intersection occupying roughly 60% of frame, right third reserved as deep starfield for UI overlay. Mid-ground: a thin pilgrim-line of fleet ships approaching from lower-edge in silhouette, scaled to make the door read as planet-sized. Subtle eldritch geometry suggested in the door's negative-space carvings: rings within rings within the question mark's curve. Mood: the choice framed as hospitality.",
    negativePrompt:
      "no demon mouth, no claws, no explicit text in readable script",
    priority: "P1",
    reviewGate: "B",
  },
];

/* ─── 1d. Fleet doctrine banners (4 prompts · 2:1 landscape, 1024×512) ─── */

const DOCTRINE_BANNERS: readonly TradeEmpireArtPrompt[] = [
  {
    assetId: "doctrine_swarm",
    name: "Swarm Doctrine",
    category: "doctrine_banner",
    resolution: "1024x512",
    palette:
      "gunmetal grey, swarm-orange engine trails, deep cobalt void, one accent white rim",
    composition:
      "Wide 2:1 horizontal tactical-poster composition of countless small fighter-craft moving in a sharp chevron pattern across the frame, readable as a single arrowhead shape composed of roughly fifty distinct dots. Camera: telephoto compression at ~135mm equivalent, eye-level, locked-off so the chevron presents as flat geometric pattern rather than 3D depth. Lighting: cold 5800K daylight key from upper-left, deep cobalt void as dead-flat ambient with no gradient, swarm-orange 2200K engine-trail accents catching the underside of every fighter from camera-left, one white rim picking the chevron's leading point. Materials: matte gunmetal hulls with no surface decoration, engine trails as soft motion-streaks fading to transparency over half a hull-length, carriers in heavier matte grey with a deeper engine-glow at their hangar mouths. Composition: left and right thirds anchored by oversized carrier silhouettes — flat broadside views, no perspective convergence — each pumping a steady stream of fighters into the central chevron. Negative space along the upper third left blank for product/banner copy if used. Motion implied by trailing streaks, not blur. Mood: overwhelming by number.",
    negativePrompt:
      "no individual named ships, no pilot views, no text",
    priority: "P1",
    reviewGate: "B",
  },
  {
    assetId: "doctrine_iron_wall",
    name: "Iron Wall Doctrine",
    category: "doctrine_banner",
    resolution: "1024x512",
    palette:
      "bastion-grey, shield-cyan, deep blue planet, single gold command-insignia glow",
    composition:
      "Wide 2:1 horizontal tactical-poster composition of a wall-formation of heavy armoured cruisers locked broadside-to-broadside across the entire width of frame, overlapping their shields into a literal wall. Camera: dead-on frontal at ~85mm telephoto equivalent, no perspective convergence, viewer parked directly in front of the wall at fleet altitude. Lighting: cold 6500K planetary daylight from behind the wall as the dominant rim back-lighting every hull silhouette, bastion-grey ambient on the visible faces, soft cyan 8000K hexagonal shield-pattern glow as secondary key flickering across the seams between ships, one warm gold 2400K command-insignia point on the centre cruiser's bridge as the only saturated accent. Materials: heavy armoured plating with visible weld-seams and impact-pock pattern, weapons retracted and locked-flush to the hulls, shield-grid as faint translucent hexagonal mesh holding fast across all overlap zones. Composition: wall fills the centre two-thirds horizontally, calm blue planet visible in slivers between and behind ships, incoming fire-flecks streaming in from frame-left at flat trajectory and disintegrating into white-orange sparks at the shield-line. Foreground negative space: empty void below the wall for poster copy if used. Mood: immovable promise.",
    negativePrompt:
      "no fire or explosion effects beyond sparks, no visible crew, no text",
    priority: "P1",
    reviewGate: "B",
  },
  {
    assetId: "doctrine_archon_formation",
    name: "Archon Formation",
    category: "doctrine_banner",
    resolution: "1024x512",
    palette:
      "bone-white, blood-red trim, absolute black, one violet navigation flare",
    composition:
      "Wide 2:1 horizontal tactical-poster composition of three identical Architect battle-dreadnoughts locked in a perfect geometric triangle formation, surrounded by twelve smaller frigate escorts in mathematically precise concentric orbits. Camera: high-angle three-quarter overhead at ~50mm equivalent, viewer positioned to read the triangle as a flat geometric shape rather than 3D pyramid. Lighting: cold 5500K daylight key from directly above as a single overhead source, absolute black ambient with no fill, blood-red 1800K rim trim on every hull edge as the dominant accent, one violet 4500K navigation flare burning steadily on the lead ship's prow. Materials: bone-white ceramcrete hulls with crisp red-black geometric trim painted in ritual symmetry, frigate hulls as smaller identical copies of the dreadnoughts (Architect doctrine: components must echo their parent form), no organic curves anywhere. Composition: triangle dead-centred and locked to mathematical precision, escort frigates arranged on three concentric ring-orbits at exact angular spacing, the entire formation reading as a single sigil. Background: flat dark void with a single dimly-lit ringed planet held to the lower-right third for asymmetrical relief — the only thing in frame that isn't perfectly symmetric. Mood: order as doctrine.",
    negativePrompt:
      "no asymmetry, no organic curves, no human figures",
    priority: "P1",
    reviewGate: "B",
  },
  {
    assetId: "doctrine_antiquarian_tempo",
    name: "Antiquarian Tempo",
    category: "doctrine_banner",
    resolution: "1024x512",
    palette:
      "brass, vellum cream, indigo void, one pale violet accent along the glyph-line",
    composition:
      "Wide 2:1 horizontal tactical-poster composition of a small elegant fleet of five ships mid-manoeuvre around a brass astrolabe-style superstructure floating free in space. Camera: medium telephoto at ~85mm equivalent, slight high angle so the manoeuvre traces read as a flowing horizontal phrase across the frame. Lighting: warm 2900K reflected brass key bouncing off the astrolabe rings as the dominant source, indigo void as ambient, a single pale violet 4500K accent picking out the longest glyph-etched seam across the entire formation, no rim. Materials: ship hulls in brushed brass and vellum-cream with deeply etched Antiquarian glyphs along every seam, the central astrolabe in heavier antique brass with hand-engraved coordinate rings, light-trails rendered as soft watercolour ribbons fading from saturated brass at the prow to translucent at the tail. Composition: rule-of-thirds with the astrolabe centred-left, the fleet's combined manoeuvre-traces curving across the full frame width like a musical phrase notated on staff lines, the rightmost ship just exiting the right edge to imply continuation. Subtle ring-within-ring eldritch geometry suggested in the astrolabe's deepest concentric rings. Foreground anchor: a single Antiquarian-style chart-fragment drifting along the lower edge for texture. Mood: war as composition.",
    negativePrompt:
      "no visible weapons firing, no humans, no explicit sheet music on hulls",
    priority: "P1",
    reviewGate: "B",
  },
];

/* ─── 1e. Fleet unit silhouettes (6 prompts · 1:1 square, 512×512) ─── */
/* Shared: transparent PNG, single 3/4 view, flat matte grey hull with one
   accent-colour highlight, readable at 64px, no background. */

const FLEET_SILHOUETTE_SHARED_NEGATIVE =
  "no background, no motion blur, no pilot figures, no UI overlays, no text on hull";

const FLEET_SILHOUETTES: readonly TradeEmpireArtPrompt[] = [
  {
    assetId: "fleet_scout",
    name: "Scout",
    category: "fleet_silhouette",
    resolution: "512x512",
    palette: "matte grey, cyan running-light",
    composition:
      "Token portrait of a slim dart-shaped recon skimmer in 3/4 hero view on transparent background. Camera: 50mm flat, slight elevated angle of about 15 degrees, no perspective distortion, hull centred in frame with a tight margin of negative space at all edges so the silhouette reads at 64px. Form-language: knife-thin fuselage, twin sharply-swept wings, an oversized clear sensor-dome at the nose dwarfing the cockpit, minimalist hull plating with no extraneous greebling. Lighting: single key from upper-front-left as flat directional light to define the form, no rim, no fill — silhouette must read first. Materials: matte dark grey hull paint, one cyan running-light pinpoint on the dome's underside as the only saturated pixel. Mood: eye.",
    negativePrompt: FLEET_SILHOUETTE_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "C",
  },
  {
    assetId: "fleet_trader",
    name: "Trader",
    category: "fleet_silhouette",
    resolution: "512x512",
    palette: "matte grey, mustard-yellow cargo-seal stripe",
    composition:
      "Token portrait of a blocky rounded civilian freighter in 3/4 hero view on transparent background. Camera: 50mm flat, slight elevated angle of 15 degrees, hull centred with even margins so the form reads at 64px. Form-language: rounded utility hull with visible modular cargo pods slung in a row under the spine, two stubby low-thrust engine nacelles aft, a small civilian bridge bubble forward, no weapons, no military aggression in the line. Lighting: single flat key from upper-front-left, no rim, no fill — wear and personality in the silhouette only. Materials: matte dark grey hull paint scuffed at the cargo-pod join lines, one mustard-yellow cargo-seal stripe wrapping the central cargo-pod as the saturated accent. Mood: utility.",
    negativePrompt: FLEET_SILHOUETTE_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "C",
  },
  {
    assetId: "fleet_frigate",
    name: "Frigate",
    category: "fleet_silhouette",
    resolution: "512x512",
    palette: "matte grey, hazard-orange warning stripe at the nose",
    composition:
      "Token portrait of a narrow knife-hulled frigate in 3/4 hero view on transparent background. Camera: 50mm flat, 15-degree elevated angle, hull centred with tight margins for 64px legibility. Form-language: long knife-thin hull with a single oversized rail-gun spine running the full forward dorsal length, two compact angular missile racks port and starboard amidships, a single sharp-prowed bridge tower set well back, every line forward-pointing and aggressive. Lighting: single flat key from upper-front-left, no rim, no fill — silhouette must communicate menace at thumbnail. Materials: matte dark grey hull paint, one hazard-orange warning stripe at the very tip of the rail-gun nose as the saturated accent, hull seams subtly catching the key light. Mood: hunter.",
    negativePrompt: FLEET_SILHOUETTE_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "C",
  },
  {
    assetId: "fleet_cruiser",
    name: "Cruiser",
    category: "fleet_silhouette",
    resolution: "512x512",
    palette: "matte grey, blood-red heat-vent trim",
    composition:
      "Token portrait of a mid-size capital cruiser in 3/4 hero view on transparent background. Camera: 50mm flat, 15-degree elevated angle, hull centred with tight margins for 64px legibility. Form-language: squat dense hull silhouette built around a single oversized centreline battery turret rotated slightly off-axis, layered armour plating in stepped overlapping tiers along the broadside, a forward bridge tower kept low and protected, no slim or graceful lines anywhere — pure line-of-battle posture. Lighting: single flat key from upper-front-left, no rim, no fill — armour mass must dominate. Materials: matte dark grey hull paint, blood-red heat-vent trim glowing faintly along the engine block at the stern as the saturated accent, armour plates carrying subtle weld-seams and battle-scuff. Mood: line-of-battle.",
    negativePrompt: FLEET_SILHOUETTE_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "C",
  },
  {
    assetId: "fleet_carrier",
    name: "Carrier",
    category: "fleet_silhouette",
    resolution: "512x512",
    palette: "matte grey, approach-green deck-light array",
    composition:
      "Token portrait of a long flat-decked fleet carrier in 3/4 hero view on transparent background. Camera: 50mm flat, 15-degree elevated angle so the parallel flight decks are clearly visible, hull centred with tight margins for 64px legibility. Form-language: long horizontal hull dominated by twin parallel flight-deck strips running the full length, large hangar mouths gaping open at both bow and stern, a tall narrow command tower offset deliberately to the starboard side leaving the deck spans uninterrupted, no broadside batteries — capacity over violence. Lighting: single flat key from upper-front-left, no rim, no fill — the flat deck silhouette must dominate. Materials: matte dark grey hull paint, an approach-green deck-light array running the centreline of both flight-deck strips as the saturated accent, deck surface subtly textured with arrestor-strip grooves. Mood: lifter.",
    negativePrompt: FLEET_SILHOUETTE_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "C",
  },
  {
    assetId: "fleet_flagship",
    name: "Flagship",
    category: "fleet_silhouette",
    resolution: "512x512",
    palette: "matte grey, gold prow insignia",
    composition:
      "Token portrait of an oversized flagship command dreadnought in 3/4 hero view on transparent background. Camera: 50mm flat, 15-degree elevated angle, hull centred with tight margins for 64px legibility. Form-language: massive deliberate hull with a heavy forward prow ram, an asymmetrical multi-tiered bridge pagoda rising tall on the dorsal spine, three layered secondary gun tiers stacked along the broadside, a single ceremonial banner-mast extending vertically above the highest pagoda — clearly meant to be seen from kilometres. Lighting: single flat key from upper-front-left, no rim, no fill — the silhouette must read as throne, not weapon. Materials: matte dark grey hull paint, a single gold prow insignia glowing softly from inset relief as the saturated accent, banner-mast carrying a furled cloth detail at the top. Mood: throne.",
    negativePrompt: FLEET_SILHOUETTE_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "C",
  },
];

/* ─── 1f. Pirate raider portrait (1 prompt · 1:1 square, 768×768) ─── */

const PIRATE_PORTRAIT: readonly TradeEmpireArtPrompt[] = [
  {
    assetId: "market_pirate_raider",
    name: "Pirate Raider",
    category: "pirate_portrait",
    resolution: "768x768",
    palette:
      "rust-red, soot-black, salvage-yellow warning paint, one cold blue running-light",
    composition:
      "Square 1:1 portrait of a battered bulk-carrier repainted by hand into a pirate raider, drifting parked in empty trade-lane space. Camera: medium telephoto at ~85mm equivalent, 3/4 broadside hero view, slight low angle so the bolted-on gun reads silhouetted against starfield. Lighting: cold 4500K starfield ambient as base, no key, one cold-blue 6500K running-light pinpoint as the only practical source on the hull, deep void in the negative space — the ship looks abandoned-on-purpose. Materials: rust-red hand-rolled paint over original factory grey, soot-black smudges around the engines, salvage-yellow warning paint slapped crooked across panels that used to be navigation markings, a single garish hand-painted red-and-black raider sigil straddling two warped hull plates, weld-seams visibly crude where cargo-pod skeletons have been bolted on at the wrong angles. Composition: ship centred, occupying roughly 70% of frame width, broadside view emphasising the oversized salvaged broadside gun bolted amidships at a slightly-off horizontal angle. Foreground anchor: the pirate's own small dinghy docked at the lower side like a parasite, magnetic clamps visible. Mid-ground: empty trade-lane starfield, no other vessels. The big ship's engines are cold; only two of its many running lights are lit. Mood: rudeness as business model.",
    negativePrompt:
      "no human face, no skull-and-crossbones cliché, no explosions",
    priority: "P1",
    reviewGate: "C",
  },
];

/* ─── 1g. Civic policy icons (9 prompts · 1:1 square, 256×256) ─── */
/* Shared: heraldic emblem icons on flat dark-slate background, single bold
   shape, one accent per family, readable at 32px, no text. */

const CIVIC_ICON_SHARED_PALETTE_BASE =
  "flat dark-slate background, ";

const CIVIC_ICONS: readonly TradeEmpireArtPrompt[] = [
  {
    assetId: "civic_doctrine_iron_lion",
    name: "Iron Lion Doctrine (Civic)",
    category: "civic_icon",
    resolution: "256x256",
    palette: CIVIC_ICON_SHARED_PALETTE_BASE + "military-red accent",
    composition:
      "Heraldic emblem icon, square 1:1 token. Centred composition, single bold shape: a roaring lion's head fused at the lower jaw into a clenched iron gauntlet, the two forms reading as one continuous silhouette. Camera: dead-on flat at 50mm equivalent, no perspective, no depth, glyph occupying ~70% of inner frame area. Lighting: subtle radial vignette darkening the corners, one military-red 1800K rim catching the gauntlet's knuckle ridge as the saturated accent, no other highlights. Materials: flat illustration in dark slate over near-black background, hand-rolled ink-rough edge along the silhouette implying defiance. Style: crude defiance, not polished heraldry — silhouette must read at 32px without colour.",
    negativePrompt:
      "no heraldic shield frame, no banners, no readable text",
    priority: "P1",
    reviewGate: "C",
  },
  {
    assetId: "civic_doctrine_nomad",
    name: "Nomad Compass (Civic)",
    category: "civic_icon",
    resolution: "256x256",
    palette: CIVIC_ICON_SHARED_PALETTE_BASE + "warm amber accent",
    composition:
      "Heraldic emblem icon, square 1:1 token. Centred composition, single bold shape: a compass rose with eight arms, but the north arm is replaced by a single curved bird's feather subtly offset from true-vertical by a few degrees so the eye registers something quietly wrong. Camera: dead-on flat at 50mm equivalent, no perspective, glyph occupying ~70% of inner frame area. Lighting: subtle radial vignette, one warm amber 2200K rim catching the feather's outer edge as the saturated accent, no other highlights. Materials: flat illustration in dark slate over near-black background, the feather rendered with a single soft barb-line texture for character, the compass arms clean and sharp. Style: quiet evasion — silhouette must read at 32px without colour.",
    negativePrompt:
      "no cardinal letters, no map behind, no readable text",
    priority: "P1",
    reviewGate: "C",
  },
  {
    assetId: "civic_doctrine_archon",
    name: "Archon Discipline (Civic)",
    category: "civic_icon",
    resolution: "256x256",
    palette: CIVIC_ICON_SHARED_PALETTE_BASE + "bone-white and red-black accent",
    composition:
      "Heraldic emblem icon, square 1:1 token. Centred composition, single bold Architect-geometry shape: a perfect equilateral triangle bisected by a horizontal centre-line, with a smaller inverted equilateral triangle inscribed precisely within the lower half so the three negative-space points form a tighter inner triangle echo. Camera: dead-on flat at 50mm equivalent, mathematically exact, glyph occupying ~70% of inner frame area. Lighting: subtle radial vignette, one cold red-black 1800K rim trim along the outer triangle's right edge as the saturated accent, otherwise bone-white interior fill. Materials: flat illustration in bone-white over near-black background, edges crisp to the pixel — Architect doctrine forbids ink-rough or organic edges here. Style: ritual cold — silhouette must read at 32px without colour, geometry must read as ceremonial.",
    negativePrompt:
      "no weapons, no organic lines, no readable text",
    priority: "P1",
    reviewGate: "C",
  },
  {
    assetId: "civic_economy_free_ports",
    name: "Free Ports Charter (Civic)",
    category: "civic_icon",
    resolution: "256x256",
    palette: CIVIC_ICON_SHARED_PALETTE_BASE + "brass with one cyan port-light at centre",
    composition:
      "Heraldic emblem icon, square 1:1 token. Centred composition, single bold shape: three classic ship's anchors interlocked at their flukes in a perfectly rotational triskele pattern, all three identical, no chains, no rope, no surrounding shield-frame. Camera: dead-on flat at 50mm equivalent, no perspective, glyph occupying ~70% of inner frame area. Lighting: subtle radial vignette, one cyan 6500K port-light glow at the exact centre of the triskele where the three anchor flukes meet as the saturated accent, brass anchor surfaces catching faint highlight on each shaft. Materials: flat illustration with anchors in brushed brass over near-black background, soft handed-edge wear at the anchor crowns implying use, no chains. Style: merchant solidarity — silhouette must read at 32px without colour, three-fold rotational symmetry must be obvious.",
    negativePrompt:
      "no rope, no ship silhouette behind, no readable text",
    priority: "P1",
    reviewGate: "C",
  },
  {
    assetId: "civic_economy_authority_tithe",
    name: "Authority Tithe (Civic)",
    category: "civic_icon",
    resolution: "256x256",
    palette: CIVIC_ICON_SHARED_PALETTE_BASE + "Authority-red and brass accent",
    composition:
      "Heraldic emblem icon, square 1:1 token. Centred composition, single bold shape: a stylised flat-rendered red hand, palm-up, fingers slightly curled, holding out a single round brass coin centred on the palm; a thin chain extends from the wrist downward and exits the lower-right edge of frame. Camera: dead-on flat at 50mm equivalent, no perspective, glyph occupying ~70% of inner frame area. Lighting: subtle radial vignette, the hand rendered in solid Authority-red as the saturated accent, the coin in dull brass catching one small specular highlight at its upper edge. Materials: flat illustration in Authority-red over near-black background, no skin-rendering — pure shape, the chain rendered as a clean repeating-link silhouette without depth. Style: heraldic, taxational — silhouette must read at 32px without colour, the chain's exit-from-frame implies the rest of it is held by someone you can't see.",
    negativePrompt:
      "no face, no crown, no currency symbol on coin, no readable text",
    priority: "P1",
    reviewGate: "C",
  },
  {
    assetId: "civic_economy_antiquarian_ledger",
    name: "Antiquarian Ledger (Civic)",
    category: "civic_icon",
    resolution: "256x256",
    palette: CIVIC_ICON_SHARED_PALETTE_BASE + "brass and vellum, one indigo ink accent",
    composition:
      "Heraldic emblem icon, square 1:1 token. Centred composition, single bold shape: an open hardbound ledger viewed from directly above, facing pages spread flat, displaying a single inked sigil that crosses the centre-spine and extends across both pages so the book is visibly impossible to close without folding the sigil. Camera: dead-on top-down at 50mm equivalent, perfectly flat, ledger occupying ~70% of inner frame area. Lighting: subtle radial vignette, vellum-cream pages catching warm soft highlight as the dominant tone, one indigo 4500K ink accent saturating the sigil itself, brass ledger-clasps glinting at the page edges. Materials: flat illustration with vellum-cream pages aged at the corners, dark-brown leather binding visible at the bottom edge, the sigil rendered as a single continuous flowing line that crosses the centre-spine without break. Style: archival, ominous — silhouette must read at 32px without colour, the cross-spine sigil must be the read.",
    negativePrompt:
      "no readable text, no quill, no hands",
    priority: "P1",
    reviewGate: "C",
  },
  {
    assetId: "civic_order_council",
    name: "Council of Voices (Civic)",
    category: "civic_icon",
    resolution: "256x256",
    palette: CIVIC_ICON_SHARED_PALETTE_BASE + "indigo with one cold-white highlight on the empty seat",
    composition:
      "Heraldic emblem icon, square 1:1 token. Centred composition, single bold shape: six small filled indigo circles arranged in a perfect hexagonal ring around a seventh hollow circle at exact centre, the centre circle distinctly empty (no figure, no glyph, no fill — just the absence). Camera: dead-on flat at 50mm equivalent, mathematically precise hexagonal symmetry, glyph occupying ~70% of inner frame area. Lighting: subtle radial vignette, indigo 4500K fill on the six outer circles as the dominant tone, one cold-white 8000K rim picking the inner edge of the empty centre as the saturated accent — drawing the eye to the missing seat. Materials: flat illustration in indigo over near-black background, edges crisp, no chairs drawn, no human silhouettes. Style: order through absence — silhouette must read at 32px without colour, the empty centre must be the read.",
    negativePrompt:
      "no chairs drawn, no human silhouettes, no readable text",
    priority: "P1",
    reviewGate: "C",
  },
  {
    assetId: "civic_order_panopticon",
    name: "Little Panopticon (Civic)",
    category: "civic_icon",
    resolution: "256x256",
    palette: CIVIC_ICON_SHARED_PALETTE_BASE + "violet with one red pupil-prick",
    composition:
      "Heraldic emblem icon, square 1:1 token. Centred composition, single bold shape: a single perfectly circular lidless eye at exact frame-centre, surrounded by three concentric circular rings nested at progressively larger radii — recursive concentric surveillance, each ring slightly thicker than the last. Camera: dead-on flat at 50mm equivalent, mathematical precision, glyph occupying ~80% of inner frame area. Lighting: subtle radial vignette, violet 4500K fill on the rings as the dominant tone, one red 1800K pupil-prick at the iris-centre as the saturated accent. Materials: flat illustration in violet over near-black background, no eyelashes, no surrounding face context, the eye rendered as pure geometric circle-with-pupil. Style: panoptic — silhouette must read at 32px without colour, the recursive nesting must register as more rings than feel comfortable.",
    negativePrompt:
      "no eyelashes, no face context, no readable text",
    priority: "P1",
    reviewGate: "C",
  },
  {
    assetId: "civic_order_remembrance",
    name: "Remembrance Order (Civic)",
    category: "civic_icon",
    resolution: "256x256",
    palette: CIVIC_ICON_SHARED_PALETTE_BASE + "indigo-black with one warm amber flame",
    composition:
      "Heraldic emblem icon, square 1:1 token. Centred composition, single bold shape: a small simple memorial candle held vertically at frame-centre, the candle itself rendered in indigo-black wax with a subtle drip on the side, the flame above shaped not as a teardrop but as a single flowing calligraphic glyph that reads as a written name — abstracted enough to remain unreadable, specific enough that the brain insists it is a word. Camera: dead-on flat at 50mm equivalent, no perspective, glyph occupying ~70% of inner frame area. Lighting: warm 1800K amber flame-glow as the only saturated source, casting subtle soft falloff onto the candle wax just below, deep indigo-black ambient elsewhere. Materials: flat illustration with indigo-black candle and wick over near-black background, the flame's calligraphic curve drawn as a single continuous line. Style: remembrance — silhouette must read at 32px without colour, the flame's word-shape must register without legibility.",
    negativePrompt:
      "no readable word in the flame, no tears, no hands",
    priority: "P1",
    reviewGate: "C",
  },
];

/* ─── 1h. Sector paintings — 100% coverage (33 prompts · 3:2, 1536×1024) ─── */
/* Shared: painterly establishing shot of the sector, not a ship.
   Faction accent drives palette. */

const SECTOR_SHARED_NEGATIVE =
  "no named characters identifiably shown, no UI overlay, no readable signage, no modern branding, no on-image text";

/* Priority Tier A — 15 faction capitals / contested hubs / convergence-relevant
   anomalies. Rich prompts. */
const SECTORS_TIER_A: readonly TradeEmpireArtPrompt[] = [
  {
    assetId: "sector_trade_nexus",
    name: "The Trade Nexus",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "Authority red, brass, deep city-blue",
    composition:
      "3:2 landscape establishing matte painting of a seething Authority-controlled commercial megastation hanging in close orbit above a calm blue-banded planet. Camera: medium-wide cinematic at ~35mm equivalent, eye-level horizon-locked, viewer at fleet altitude well below the station. Lighting: warm 2800K Authority-red practicals lining every dock as the dominant practical, deep cobalt city-blue ambient from the planet below as soft fill, brass 4500K reflections catching off the polished hull-plating, no rim. Atmospheric perspective: three depth planes — foreground freighters in sharp silhouette, mid-ground station body in full saturation, background planet softened by orbital haze. Materials: brushed brass and red-painted ceramcrete on the station, hundreds of long thin docking arms extending radially with cargo freighters mid-coupling at each, every major dock crowned by a single hovering red surveillance eye-drone. Composition: rule-of-thirds with the station centred-right at the upper-third intersection, planet curve along the lower-third, dense traffic-pattern of freighter running-lights filling the negative space. Mid-ground narrative detail: one freighter visibly stalled at a dock with two surveillance drones converged on it. Mood: commerce as observation.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "D",
  },
  {
    assetId: "sector_new_babylon_core",
    name: "New Babylon Core",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "deep indigo, Authority red, window-gold",
    composition:
      "3:2 landscape establishing matte painting of New Babylon — an ecumenopolis city-planet at night, viewed from low orbit. Camera: high-altitude wide at ~28mm equivalent, slight downward tilt so the planet's curvature traces a gentle arc across the lower edge. Lighting: deep indigo 5000K night-sky ambient as base, billions of warm 2400K window-gold city-light pinpricks blanketing the entire surface as the dominant practical-mass, six small but unmistakable Authority-red 1800K crystalline pulses synchronised in perfect rhythm from a single central spire as the saturated accent — the coffined minds breathing in time. Materials: city-planet surface rendered as a continuous low-relief texture of indistinguishable urban density, the central spire as a single sharp vertical break in the skyline, atmospheric haze layer across the lower planet limb softening the further hemisphere. Composition: planet curve held to lower-third, central spire and its six red pulses anchored on the right-third intersection, upper two-thirds left as deep starfield with subtle nebula-bands suggesting eldritch geometry in their dust patterns. Mid-ground narrative detail: a thin orbital traffic-stream of small freighter lights tracking the city-band like a moving necklace. Mood: capital that breathes for someone else.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "D",
  },
  {
    assetId: "sector_new_babylon_lower_tiers",
    name: "New Babylon Lower Tiers",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "soot-black, rust, neon-cyan puddle-reflection",
    composition:
      "3:2 landscape establishing matte painting of a rain-slicked canyon street in the lowest tier of the New Babylon city-planet. Camera: ground-level medium-wide at ~28mm equivalent, slight upward tilt looking down the canyon, vanishing point on the horizon-third. Lighting: heavy overcast above provides no key — instead, a forest of warm 2200K tungsten work-lamps and cyan 6500K neon shop-signs reflected on the wet pavement as the dominant practicals, soot-black ambient eating most of the upper frame, one Authority-red 1800K patrol-drone running-light hanging high in the rain as the only saturated accent. Materials: rain-slick concrete pavement with neon-cyan puddle-reflections breaking up the darkness, rust-streaked steel canyon walls, towering industrial smokestacks venting amber-glow embers, refugee housing welded haphazardly into the canyon walls in mismatched modular pods, cables and laundry strung between balconies. Composition: rule-of-thirds with the canyon vanishing point dead-centre lower-third, the patrol drone hovering at the upper-third right intersection, foreground pavement reflections drawing the eye into depth. Mid-ground narrative detail: a single small figure huddled in a doorway, half-silhouetted, deliberately not the focus. Atmospheric perspective: rain reduces visibility every plane back, smokestack vapour layered into the mist. Mood: the city's lower throat.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "D",
  },
  {
    assetId: "sector_empire_frontier",
    name: "Imperial Frontier",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "bone-white, red-black trim, cold grey sky",
    composition:
      "3:2 landscape establishing matte painting of a half-rebuilt Artificial Empire border outpost on a barren planet's terminator line. Camera: medium-wide at ~35mm equivalent, slight high-angle three-quarter overhead so the strict-grid layout reads from above. Lighting: cold 5000K daylight key from low on the horizon, deep cold-grey ambient sky with no atmospheric warmth, soft red-black 2200K trim-glow on every drone and assembly arm as the only accent, no rim. Atmospheric perspective: clean dry air, three depth planes — foreground assembly-pit, mid-ground skeletal city, background distant Architect mothership in low orbit. Materials: bone-white ceramcrete hulls and structures with crisp red-black geometric trim, exposed steel framework on half-built towers, perfect right-angle street grids cut into the surface like wounds, no organic curves anywhere. Composition: rule-of-thirds with the central skeletal city occupying the centre, the Architect mothership held to upper-third sky as a flat geometric shape, swarms of small assembly drones moving between buildings in mathematically precise formation. Mid-ground narrative detail: one tower three-quarters complete, surrounded by a perfectly equidistant ring of working drones welding in synchronised rhythm. Mood: ritual reconstruction.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "D",
  },
  {
    assetId: "sector_forge_worlds",
    name: "Forge Worlds",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "forge-orange, char-black, one thin cold cyan orbital ring",
    composition:
      "3:2 landscape establishing matte painting of a forge-world from medium orbit — the planet's entire night-side glows volcanic orange from the heat-bloom of never-sleeping industrial forges. Camera: orbital medium-wide at ~28mm equivalent, slight downward tilt presenting the planet as a curved mass filling the lower two-thirds of frame. Lighting: forge-orange 1500K incandescent emission from the planet's surface as the dominant key, char-black 2000K shadow occupying the unlit hemisphere, one cold cyan 7000K orbital ring-light tracing the equatorial shipyard girdle as the saturated accent. Atmospheric perspective: thick industrial haze visible at the planet limb, three depth planes — foreground shipyard ring, mid-ground planet body, background starless void. Materials: planet surface rendered as molten-glow patchwork through black volcanic crust, the equatorial shipyard ring as a continuous chain of brushed-iron platforms with active dock-arms holding frigate hulls in mid-construction, exhaust plumes venting outward into space. Composition: rule-of-thirds with the planet's equator on the lower-third, the shipyard ring on the same line as a connecting band, dozens of in-flight construction tugs as small motes moving along the ring. Mid-ground narrative detail: one freshly-completed cruiser separating from a dock-arm, engines just lighting. Mood: industry without rest.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "D",
  },
  {
    assetId: "sector_panopticon_ruins",
    name: "Panopticon Ruins",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "pale grey, rust-stain, one distant cold blue star",
    composition:
      "3:2 landscape establishing matte painting of a shattered orbital prison complex drifting in silence. Camera: medium-wide at ~35mm equivalent, viewer floating outside the broken hull, looking through a torn-open wall section into the cell-grid interior. Lighting: cold-blue 7000K distant starlight from a single far star at upper-left as the only key, pale-grey 5500K ambient bouncing weakly off the metal interior, rust-orange 2000K oxidation stains catching faint warm tone where the metal has bled into space, no rim. Atmospheric perspective: pure vacuum, no haze — three depth planes purely from parallax, foreground broken hull-edge, mid-ground cell-grid receding, background distant starfield. Materials: pale-grey weathered hull plating with severe rust-stain bleed at every torn edge, individual cells visible as hollow geometric cubes stacked in a brutally regular grid, cell-doors floating open in zero-g, scattered detritus drifting between them — no bodies. Composition: rule-of-thirds with one specific empty cell anchored on the centre intersection, that cell distinctly emptier than the others, its open door fixed at exact zero degrees. Mid-ground narrative detail: scattered identification tags drifting like silent confetti through the grid. Mood: silence after the experiment.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "D",
  },
  {
    assetId: "sector_viral_wastes",
    name: "Viral Wastes",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "spore-black, bruise-red, diseased yellow nebula haze",
    composition:
      "3:2 landscape establishing matte painting of a dead solar system, three planets visible across the wide frame each wrapped in writhing black-red Thought-Virus spore tendrils that arc visibly between worlds in interplanetary scale. Camera: extreme telephoto at ~200mm equivalent compressing the three planets and their connecting tendrils into a single horizontal composition, viewer on the ecliptic plane. Lighting: diseased-yellow 2200K nebula haze as the dominant ambient, deep spore-black 1500K emission from the tendril-bands themselves casting almost-no light, sickly bruise-red 1800K subsurface pulse moving slowly through the tendrils as the saturated accent, no key, no rim. Atmospheric perspective: nebula haze thickens left-to-right across frame, suggesting infection spreads like a tide. Materials: planets rendered with their atmospheres half-eaten — solid surfaces visible through gaps where the spore-mass has consumed cloud layers, tendrils as braided bio-mechanical cables thicker than continents, surface spore-growth shown as a black-red lichen. Composition: three planets evenly distributed on the lower-third line, tendrils arching between them in slow recursive curves — eldritch geometry suggested in the tendril-knot patterns at every junction. Mid-ground narrative detail: a single dead satellite drifting in the foreground, hull half-consumed. Mood: a system finished thinking.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "D",
  },
  {
    assetId: "sector_frontier_worlds",
    name: "Frontier Worlds",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "warm amber grassland, rust-scrap, big cobalt sky",
    composition:
      "3:2 landscape establishing matte painting of a rugged independent colony settled on a yellow-grassland moon with a vast cobalt sky. Camera: ground-level medium-wide at ~35mm equivalent, slight low angle so the cobalt sky dominates the upper two-thirds, horizon clean and unbroken save for the watchtowers. Lighting: warm 3500K afternoon-amber sun key from upper-right casting long horizontal shadows across the grassland, cobalt 6500K sky-light as ambient fill on the underside of every form, rust-orange 1800K oxidation rim catching the salvaged hull-plating as the saturated accent. Atmospheric perspective: clear dry air, three depth planes — foreground cattle and grass, mid-ground watchtowers and homestead, background distant rolling hills. Materials: tall yellow grassland grass moving in subtle wind, watchtowers built from mismatched scavenged Imperial hull plating still bearing fragments of original red trim painted over with weather, simple wooden pen-fences, modest single-story homestead structures of rammed earth. Composition: rule-of-thirds with the homestead at the right-third intersection, the nearest watchtower at the left-third, four cattle grazing across the foreground in unequal spacing for natural rhythm. Mid-ground narrative detail: a single colonist on horseback riding the perimeter, scaled small. Mood: the kind of frontier that has lasted three generations.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "D",
  },
  {
    assetId: "sector_insurgency_haven",
    name: "Insurgency Haven",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "asteroid grey, warm ember window-light, deep void",
    composition:
      "3:2 landscape establishing matte painting of a hidden insurgency base built inside a fractured asteroid drifting in deep void. Camera: medium-wide at ~50mm equivalent, viewer at fleet altitude looking across at the asteroid's torn-open profile, slight Dutch angle of two degrees suggesting the asteroid's slow tumble. Lighting: deep void as ambient near-black, warm 2400K interior tungsten window-light leaking out through every fractured rock-fissure as the dominant practical, no key, no rim — the rock should read as a dark hulk and the windows as the only saturated detail. Atmospheric perspective: vacuum, no haze; three depth planes from parallax — foreground asteroid surface, mid-ground fissures and structures, background distant starfield. Materials: weathered asteroid grey with deep fissures running like veins, the interior glimpsed through cracks reveals retrofitted habitat modules wedged into the rock with welded scaffold extensions, no exterior signage of any kind. Composition: rule-of-thirds with the asteroid mass anchored centre-left, fissure-windows scattered asymmetrically, a single courier skiff at the lower-right third just leaving the asteroid at silent thrust — engines barely lit, deliberately not announcing itself. Mid-ground narrative detail: a thin docking-clamp tether retracting into the rock as the skiff departs. Mood: home, but only if you know the password.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "D",
  },
  {
    assetId: "sector_abyssal_sectors",
    name: "Abyssal Sectors",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "oil-black, blood-veinous red, sickly violet rim",
    composition:
      "3:2 landscape establishing matte painting of a Hierarchy-consumed region where reality itself has begun to bleed and degrade. Camera: medium-wide at ~35mm equivalent, viewer drifting in stable space looking into the corruption, the affected region occupying roughly two-thirds of frame. Lighting: oil-black 1800K ambient as base, sickly violet 4500K rim-glow at the corruption's furthest edges as the dominant rim, blood-veinous red 1500K pulse moving through the Blood-Weave between planets as the saturated accent — pulse rate slow and uneven. Atmospheric perspective: corruption increases left-to-right; the right side of frame is more clearly broken. Materials: distant stars rendered with visible oil-paint smear-trails as if the canvas itself was wiped while still wet, space carrying a coarse film-grain texture inside the affected zone, planets visible as silhouettes wrapped in pulsing red veinous tendrils that do not quite obey straight-line geometry, two planets connected by a cable-thick Blood-Weave artery rendered in throbbing red-black. Composition: rule-of-thirds with the worst corruption-knot anchored at the right-third, a single 'still healthy' star pinpointed on the left-third for contrast, eldritch geometry strongly implied in the recursive twist of every Blood-Weave junction. Mid-ground narrative detail: a single derelict ship snared in the Weave at the centre, hull half-dissolved. Mood: reality remembering it was painted on something.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "D",
  },
  {
    assetId: "sector_black_hole_gate",
    name: "The Antiquarian's Gate",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "obsidian, brass, vellum cream, one warm amber leaking light",
    composition:
      "3:2 landscape establishing matte painting of an anomaly that registers as a black hole but isn't — the event-horizon disc is a colossal ornate brass door floating in deep space, carved across its full surface with Antiquarian glyphs, ajar by perhaps a finger's width. Camera: dead-on frontal at ~85mm telephoto equivalent for clean geometric clarity, viewer at fleet altitude squarely facing the door, no perspective convergence. Lighting: cold-void ambient as near-black, no key, a single warm 2200K honey-amber light leaking through the finger-width gap as the dominant emissive accent, brass surface catching faint reflected starlight from the surrounding void. Atmospheric perspective: pure vacuum, no haze; depth communicated by parallax of distant stars warping subtly around the door's edges where spacetime is being misbehaved. Materials: heavy ornate brass door-face with hand-engraved Antiquarian glyph density across every panel, vellum-cream highlight catching the engravings, no accretion disc, no swirl, no debris field — the absence of usual black-hole signifiers is the read. Composition: door dead-centred occupying ~60% of frame, gap precisely on the centre seam, glyph-density highest along the door's perimeter so the eye reads the boundary first. Mid-ground narrative detail: a single tiny silhouette of an Antiquarian survey-skiff held respectfully at distance to the door's lower-right, scaled to make the door read as moon-size. Mood: a question that isn't asked, only opened.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "D",
  },
  {
    assetId: "sector_violetta_approach_lane",
    name: "Violetta Approach Lane",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "dreamer-violet, deep cold blue, one warm amber running-light",
    composition:
      "3:2 landscape establishing matte painting of a corridor of space near the Dreamer's Shield, the shield itself just out of frame to the right yet washing half the composition with its colour. Camera: medium-wide at ~50mm equivalent, viewer at fleet altitude looking along the approach lane, slight horizontal pan-frame so the shield-glow reads as directional. Lighting: deep cold-blue 6500K starfield ambient on the left half of frame, dreamer-violet 4500K shield-glow saturating the right half across a soft gradient transition through the centre, one warm amber 2200K civilian running-light pinpoint as the only saturated accent at the convoy's lead ship. Atmospheric perspective: violet glow thickens left-to-right, three depth planes from parallax — foreground beacon-marker, mid-ground convoy line, background shield-edge falloff. Materials: starfield rendered with pinprick precision on the left, violet glow rendered as soft volumetric haze on the right with subtle interior eddies suggesting the Shield is alive, convoy hulls in civilian whites and beiges catching the violet light along their starboard sides. Composition: rule-of-thirds with the convoy lead ship anchored at the right-third intersection, the convoy line extending diagonally from upper-left to right-third in a paused approach formation, all engines visibly cold — they are waiting, not moving. Mid-ground narrative detail: a single navigation beacon-buoy on the left-third pulsing slow violet, the only practical light source besides the Shield. Mood: the threshold of asking permission.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "D",
  },
  {
    assetId: "sector_forward_bastion",
    name: "The Forward's Bastion",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "ivory, cathedral gold, deep blue void",
    composition:
      "3:2 landscape establishing matte painting of a Potentials-held fortress-moon bristling with defensive emplacements, viewed from fleet-approach distance. Camera: medium-wide at ~35mm equivalent, slight three-quarter angle showing both the lit and dark hemispheres of the moon, viewer at fleet altitude. Lighting: cold 6000K distant starlight as ambient base, warm 3000K cathedral-gold practicals lining the fortress's main bastions and gun emplacements as the dominant light source, deep cold-blue 7000K void shadow on the unlit hemisphere, no rim. Atmospheric perspective: pure vacuum, three depth planes — foreground turret silhouettes, mid-ground fortress wall, background curving moon horizon. Materials: ivory ceramcrete walls with gold-leaf banded reliefs at every joint, hundreds of memorial ribbons draped from the parapet edges and trailing over the wall faces — fluttering very slightly even in vacuum, as if remembered to wind, defensive turret emplacements in matching ivory with brass barrel-trim, no military green. Composition: rule-of-thirds with the largest bastion anchored at the right-third intersection, the moon's curve held to the lower-third, ribbon-trails draping diagonally across the wall faces in unequal lengths. Mid-ground narrative detail: a single small honour-guard skiff holding station off the main bastion in cathedral-gold paint. Mood: the fortress is also a chapel.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "D",
  },
  {
    assetId: "sector_remembrance_archive",
    name: "The Remembrance Archive",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "brass, vellum, indigo mist, one violet candle in a window",
    composition:
      "3:2 landscape establishing matte painting of an Antiquarian vault built into a sheer cliff-face on a mist-wet world. Camera: ground-level medium-wide at ~35mm equivalent, slight upward tilt so the cliff face and tall vault-doors dominate the upper two-thirds of frame, the Antiquarian figure scaled small for monumentality. Lighting: cool 6500K overcast indigo-mist ambient as base, warm 2200K candle-flame practicals visible behind a single vellum-paned upper window as the dominant warm note, one violet 4500K candle-flame glowing in a recessed nook beside the doors as the saturated accent, no key, no rim. Atmospheric perspective: heavy mist, three depth planes — foreground stone steps, mid-ground vault doors, background cliff-face fading into white. Materials: dark wet stone cliff face with moss in the joints, two colossal brass vault-doors hand-engraved with thousands of names in tightly packed rows, vellum-cream parchment leaves blown against the lower steps, indigo-mist drifting through the scene. Composition: rule-of-thirds with the doors anchored centre-right at the upper-third intersection, the climbing Antiquarian figure on the lower-third climbing the steps with a heavy ledger held in both arms, candle-nook on the right edge. Mid-ground narrative detail: footprints visible on the wet stone steps that go up but not down. Mood: the names are heavier than the door.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "D",
  },
  {
    assetId: "sector_chronarchive_vault",
    name: "Chronarchive Vault",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "brass, vellum, indigo shadow, one warm amber candle flame",
    composition:
      "3:2 landscape establishing matte painting of an underground Antiquarian Chronarchive vault, viewed from inside near the entrance with shelves receding into darkness. Camera: low-angle medium-wide at ~28mm equivalent, viewer standing at the chamber's threshold looking inward and slightly upward, vanishing-point pulled into the rear darkness. Lighting: a single warm 1900K candle-flame held mid-shelf as the only practical light source providing all the illumination in frame, indigo 4500K shadow filling the receding aisles, brass 2700K reflections catching off the great chronarch ring rotating slowly overhead, no other light. Atmospheric perspective: still air with very fine dust visible in the candle-cone, three depth planes — foreground shelf and ledger, mid-ground candle-bearer silhouette, background dissolving into pure black. Materials: vellum-cream ledger spines bound by short brass chains to every shelf, dark-stained wooden shelving with hand-carved Antiquarian glyphs along the upright supports, a great brass ring suspended from the unseen ceiling rotating with audible weight, the candle's flame steady. Composition: rule-of-thirds with the candle-bearer's silhouette anchored at the centre intersection, the chronarch ring held to the upper third arcing across the ceiling, shelves leading lines from foreground both edges into the deep mid-ground. Mid-ground narrative detail: one chained ledger pulled half-out of its slot, evidence of recent reference. Mood: knowledge that does not raise its voice.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P1",
    reviewGate: "D",
  },
];

/* Priority Tier B — 18 remaining sectors (concise prompts for full coverage). */
const SECTORS_TIER_B: readonly TradeEmpireArtPrompt[] = [
  {
    assetId: "sector_ark_debris_field",
    name: "Ark Debris Field",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "ivory, void-black, cathedral-gold, cold-blue nebula backlight",
    composition:
      "3:2 landscape establishing matte painting of a vast drifting wreckage field of a thousand shattered Ark-ships in deep void. Camera: medium-wide at ~50mm equivalent, viewer drifting through the field at fleet altitude, slight horizontal pan-frame so the field reads as continuous. Lighting: cold-blue 7000K nebula backlight from beyond the field as the dominant directional source silhouetting every wreck, warm 3000K cathedral-gold practicals from inside the single intact bow as the saturated accent, ivory hulls catching faint reflected nebula on their unbroken faces. Atmospheric perspective: pure vacuum with subtle nebula-haze gradient back-to-front; three depth planes from parallax — foreground wreck-fragment, mid-ground intact bow, background deep nebula light. Materials: ivory ceramcrete hulls split open like broken cathedral vaults exposing inner choir-spaces never meant for vacuum, hundreds of memorial ribbons still clinging to fractured spires and fluttering soundlessly in nothing, gold-leaf detailing partially burned to char. Composition: rule-of-thirds with the intact bow anchored at the right-third intersection pushing slowly through the field, lit from within so it reads as a moving lantern in a graveyard, smaller wreck-pieces scattered across the field with no two at identical orientation. Mid-ground narrative detail: a single intact stained-glass viewport-pane drifting free between wrecks. Mood: the procession of grief.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_terminus_approach",
    name: "Terminus Approach",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "bruise-red, soot-black, sickly yellow haze",
    composition:
      "3:2 landscape establishing matte painting of a dead approach-corridor pointed toward Terminus, the spore-density thickening visibly as the eye scans left-to-right across frame. Camera: medium-wide at ~35mm equivalent, viewer drifting at fleet-approach altitude looking down the corridor, slight tilt-up so the spore-mass dominates the upper two-thirds. Lighting: deep bruise-red 1800K core-glow from inside the densest spore-clouds far down-corridor as the dominant source bleeding outward, sickly yellow 2400K nebula haze as ambient, soot-black 1500K shadow elsewhere, no key, no rim — the corridor is illuminated only by what is killing it. Atmospheric perspective: spore-haze thickens dramatically from left to right, three depth planes — foreground stripped derelict, mid-ground thickening spore-fog, background utterly obscured horizon. Materials: spore-mass rendered as semi-organic black-red bio-tendrils growing in mid-vacuum with visible braided sub-structure, the derelict at frame-foreground rendered with hull plating partially eaten away in patterns matching how the spores attach, scattered debris suggesting earlier failed approaches. Composition: rule-of-thirds with the warning-derelict anchored at the left-third foreground for scale and threat, the spore-corridor receding diagonally into the right side of frame where visibility drops to zero, no horizon line visible. Mid-ground narrative detail: a single intact navigation buoy still pulsing slowly inside the spore-fog, decades after anyone listened. Mood: a road that finishes you mid-step.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_research_corridor_alpha",
    name: "Research Corridor — Shared Lab",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "lab-white, hologram-cyan, slate-grey, warm amber notepad-light",
    composition:
      "3:2 landscape interior matte painting of a sealed Dischordian-era science hab, viewer standing inside the main shared-lab room. Camera: medium-wide at ~35mm equivalent, eye-level, locked-off, viewer at the threshold of the room with the central workbench claiming mid-frame depth. Lighting: cool 6500K lab-white overhead panels as the dominant key, hologram-cyan 8000K key-light from the central holographic diagram as secondary practical, warm 2400K amber notepad-light at the bench corner as the saturated accent, slate-grey ambient on the walls, no rim. Atmospheric perspective: clean dry interior air, three depth planes — foreground bench-edge, mid-ground holographic diagram and figures, background sealed corridor receding. Materials: pale lab-white wall panels with neural-lattice locks visible as faint blue 8000K filigree etched into every doorway, brushed-steel workbenches, cyan holographic diagram floating mid-air rendered with characteristic scan-line transparency, hand-marked notebooks with visible ink. Composition: rule-of-thirds with the holographic diagram on the centre-vertical, the two arguing figures bracketing it from left and right thirds — one in human lab coat, one in Quarchon-humanoid lab coat (head shape and proportions just slightly off baseline-human), both leaning in, neither yielding. Mid-ground narrative detail: a coffee cup overturned beside the diagram, contents pooled but ignored. Mood: collaboration as polite combat.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_research_corridor_beta",
    name: "Resonance Institute Annex",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "deep teal, flame-orange tracer, parchment-cream, cold-grey stone",
    composition:
      "3:2 landscape interior matte painting of a DeMagi resonance institute annex. Camera: medium-wide at ~35mm equivalent, eye-level, locked-off, viewer standing among the chambers as if mid-rounds. Lighting: deep teal 6500K interior ambient as base, flame-orange 2000K elemental tracer-glow from one chamber and cool blue 7000K water-tracer glow from another as the dominant practical sources colouring opposite halves of frame, parchment-cream 2700K notepaper highlights where the wall-notes catch passing light, no key, no rim — the lab lights itself through its experiments. Atmospheric perspective: clean dry interior air with subtle vapour rising from the warmer chambers, three depth planes — foreground chamber-glass with reflection, mid-ground further chambers, background notation-wall. Materials: tall cylindrical glass containment chambers with brass collar-mounts, internal tracer-elements rendered as slow-rotating coloured wave-patterns (fire as braided orange, water as braided cyan), aged stone walls completely papered with hand-written protocol corrections in fading indigo ink, multiple corrections layered over each other in different hands across decades. Composition: rule-of-thirds with the largest chamber anchored at the right-third intersection housing the fire-tracer, the water-tracer chamber held to the left-third, the wall-notation occupying the deep mid-ground in legible-but-unreadable density. Mid-ground narrative detail: a single hand-corrected protocol page pinned to the central chamber at eye-height, ink barely dry. Mood: ongoing argument with the world's basic forces.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_research_corridor_gamma",
    name: "Reality Institute Annex",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "reality-black, warning-red, paper-white, one violet dimensional accent",
    composition:
      "3:2 landscape interior matte painting of a Quarchon dimensional-stability lab. Camera: medium-wide at ~35mm equivalent, slight low-angle so the apparatus dominates the upper two-thirds, viewer rooted in place at floor-level — there is nowhere else to stand. Lighting: reality-black 1500K ambient as near-total darkness on the walls, sterile paper-white 6500K downlight from a single unseen source above the apparatus as the dominant key, warning-red 1800K projected floor-lines as the saturated accent, one violet 4500K dimensional-flicker pinpoint pulsing inside the innermost rotating cube. Atmospheric perspective: clean dry vacuum-air, three depth planes — foreground floor-warning lines, mid-ground apparatus, background dissolving into pure black — there are no windows visible, no doors visible, only the apparatus and the floor. Materials: apparatus rendered as three nested cubes — outer cube in brushed titanium, mid cube in dark obsidian, inner cube in faceted black-glass — all rotating at independent rates that visibly do not match harmonically. Floor in pale concrete with crisp red projected warning-lines forming a containment ring. Composition: apparatus dead-centred occupying ~50% of frame area, the three cube-rotation axes deliberately misaligned so the eye cannot fix on a stable reference point, recursive geometry strongly implied by the inner cube's faceting. Mid-ground narrative detail: a single dropped clipboard at the very edge of the warning-ring on the lower-left, papers fanned but undisturbed. Mood: a room engineered for one purpose only.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_probability_market_hub",
    name: "Probability Market Hub",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "Authority-red, brass trim, deep cobalt market-screens, one cold-white branch-point glow",
    composition:
      "3:2 landscape interior matte painting of a New Babylon Probability Market Hub trading floor at peak hours. Camera: medium-wide at ~28mm equivalent, slight high three-quarter angle so the floor reads as an architectural composition, viewer at the gallery rail above the trading pit. Lighting: warm 2700K Authority-red practicals along the wall trim as the dominant atmosphere-setter, cool deep cobalt 6500K market-screen glow from the central display banks as secondary key bathing the trader-pit, one cold-white 8000K branch-point flare on a single highlighted price board as the saturated accent — that price has just split. Atmospheric perspective: warm interior haze in the upper galleries, three depth planes — foreground gallery rail, mid-ground trader pit, background tier of price-boards. Materials: brass trim along every rail and balcony, polished ceramcrete floor reflecting the cobalt market-glow, price-boards rendered as horizontal LCD bands where each commodity shows three parallel future-values branching sideways like growth-rings — multiple frozen futures held in superposition. Composition: rule-of-thirds with the highlighted branching price-board on the centre intersection, traders distributed around the pit deliberately frozen mid-gesture — hands raised in shouts that have not yet emerged, mouths half-open — paused exactly between certainties. Mid-ground narrative detail: a single coffee cup floating mid-air mid-spill, droplets suspended above the floor. Mood: the moment before commitment.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_syndicate_route_prime",
    name: "Syndicate Route Prime",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "syndicate-crimson, bio-chitin brown, deep void, one Seven-Omicron green pass-light",
    composition:
      "3:2 landscape establishing matte painting of a hidden Syndicate warp-lane in deep void, bristling with bio-scanner pylons. Camera: medium-wide at ~50mm equivalent, viewer drifting along the lane at courier-altitude, slight horizontal pan-frame so the pylon array reads as a continuous gauntlet. Lighting: deep void 1500K near-black ambient, bio-chitin brown 2400K warm key on the pylons themselves as the dominant practical, one Seven-Omicron green 5500K pass-light pinpoint on a single specific pylon at right-third as the saturated accent — that pylon has just cleared the courier, syndicate-crimson 1800K rim trim faint along scanner heads. Atmospheric perspective: pure vacuum, three depth planes from parallax — foreground courier hull, mid-ground active pylon-gauntlet, background unseen border. Materials: pylons rendered as repurposed old Empire navigation towers now overgrown with chitinous bio-scanner growths in muted brown, cable-thick organic feeders running between pylons forming a connected nervous-system network, courier skiff hull in matte black with running lights deliberately dimmed to invisibility. Composition: rule-of-thirds with the green pass-light at the right-third intersection, the courier skiff at the left-third threading between two pylons, the rest of the lane stretching off-frame to suggest more pylons in both directions, off-frame right implies the Collector's Garden border without showing it. Mid-ground narrative detail: one pylon's bio-scanner head visibly turning to track something the courier just passed — but late. Mood: passage by permission.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_command_post_iron",
    name: "Iron Lion Command Post",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "gunmetal, ribbon-gold, dusk-amber lamplight, cold-grey sky",
    composition:
      "3:2 landscape interior matte painting of an Iron Lion forward-operating command post built into a fortified mountain crag. Camera: medium-wide at ~28mm equivalent, eye-level, viewer standing at the command-post threshold looking inward, slight low-angle so ceiling beams and ribbons read across the upper third. Lighting: dusk-amber 2600K oil-lamp practicals as the dominant warm key, cold-grey 7000K daylight bleeding faintly through a narrow window at frame-right as the saturated cool accent, gunmetal ambient on weapons racks, no rim. Atmospheric perspective: dry mountain interior air with wood-smoke haze, three depth planes — foreground holo-table edge, mid-ground conferring officers, background ribbon-hung ceiling beams. Materials: rough-cut crag-rock walls with mortar, dark-stained timber beams, gunmetal-grey weapons racks lining the side wall, holo-table in brushed brass with active map-projection in pale orange, hundreds of slender ribbon-of-the-dead in muted ribbon-gold and faded red hanging from every ceiling beam, Iron Lion sigil painted on the rear rockface but rain-faded almost to ghost. Composition: rule-of-thirds with the holo-table on the lower-third centre, two officers (one human in faded combat fatigues, one Quarchon-humanoid in matching but not identical kit) leaning over it from opposite sides. Mid-ground narrative detail: a third officer's chair pushed back from the table, jacket draped — they stepped out, recently. Mood: doctrine kept warm at low fire.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_intelligence_exchange_nightline",
    name: "The Nightline Exchange",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "bar-amber, shadow-indigo, one cold cyan data-slate glow",
    composition:
      "3:2 landscape interior matte painting of an unmarked deep-space bar — the Nightline Exchange — viewed from inside, low-light intelligence-trade venue. Camera: low-angle medium-wide at ~35mm equivalent, eye-level seated viewer, locked-off, slight vignetting at the corners. Lighting: bar-amber 2200K above-bar pendant lamps providing the only general illumination, shadow-indigo 5000K ambient eating most of the room, one cold cyan 7000K data-slate glow on a single tabletop in the mid-ground as the saturated accent — only the drinks and that one slate are lit, faces deliberately fall to silhouette. Atmospheric perspective: heavy interior haze (smoke, condensation), three depth planes — foreground bar-edge, mid-ground occupied tables, background dissolving into pure indigo shadow. Materials: weathered hardwood bar-front with brass rail, hammered-copper drink coasters, glassware catching small specular highlights from the pendant lamps, no signage anywhere — the room intentionally communicates nothing about itself. Composition: rule-of-thirds with the cyan-lit data-slate table on the right-third intersection, two shadowed silhouettes hunched across that table — heads close, one passing something across — bar dominating the left-third. Mid-ground narrative detail: a single drink left unattended on the bar, condensation ring forming, the patron mid-handoff at the lit table. Mood: rooms whose business is not knowing what room you are in.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_atarion_ruins",
    name: "Atarion Ruins",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "bone-dust white, memory-stone teal, slate-grey, one warm amber inscription glow",
    composition:
      "3:2 landscape establishing matte painting of the Atarion Ruins — ancient DeMagi memory-stones half-buried in pale dust on a barren plain. Camera: ground-level medium-wide at ~35mm equivalent, slight low-angle so the stones read monumental against an empty sky, viewer standing at field-edge. Lighting: cool 6500K overcast slate-grey daylight as ambient base, memory-stone teal 5500K subsurface glow pulsing softly from each stone as the dominant emissive source visualised as thin concentric rings expanding outward and fading at half a stone-height, one warm amber 2400K inscription-glow on a single stone closest to the camera as the saturated accent. Atmospheric perspective: clear dry air with dust-haze along the ground, three depth planes — foreground inscribed stone, mid-ground kneeling figure, background dust-plain receding to flat horizon. Materials: bone-dust white stones carved with ancient DeMagi memory-glyphs in shallow relief, pale grey ground-dust drifting in slight breeze, the kneeling Quarchon probability-inspector in a clean grey field uniform with a calibration device pressed to a stone, body language obviously embarrassed. Composition: rule-of-thirds with the inspector and the inscription-glow stone on the centre-right intersection, smaller stones scattered across the field at irregular spacing, no human structures visible to the horizon. Mid-ground narrative detail: the inspector's calibration-device readout visibly flat-lining — instruments cannot measure what the stones are doing. Mood: older than the people sent to study it.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_tidewater_archive",
    name: "Tidewater Archive",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "sea-green, parchment-cream, deep navy water, one warm amber caught light",
    composition:
      "3:2 landscape interior matte painting of the Tidewater Archive — an underwater DeMagi archive seen through a glass observation dome at depth. Camera: medium-wide at ~35mm equivalent, eye-level inside the dry observation chamber, viewer standing at the curved glass facing outward into the submerged archive. Lighting: pale sea-green 7000K underwater filtered daylight from above as the dominant ambient bathing the archive interior beyond the glass, deep navy 5000K shadow in the lower water, one warm 2400K caught-light pinpoint on a brass lantern still lit on a far shelf as the saturated accent, parchment-cream highlights on the suspended manuscripts, no rim. Atmospheric perspective: light loses warm wavelengths with depth; foreground inspector reads warmer than the deep archive, three depth planes — foreground inspector at glass, mid-ground nearest archive shelves, background depths dissolving to navy. Materials: thick observation glass with subtle ripple-distortion at edges, suspended parchment-cream manuscript leaves rendered as preserved pages floating gently in pale-green tinted water, dark-stained wooden shelves sagging slightly against time, slow archival-fish (long-bodied, cautious, scaled in muted greens) drifting between shelves like curators on rounds. Composition: rule-of-thirds with the frustrated Quarchon inspector at the left-third tapping a useless palm-print panel on the dome, the brass lantern saturated accent at the right-third deep in the archive, fish movement-trails curving the eye between them. Mid-ground narrative detail: a single manuscript page rotating slowly in current, ink visibly intact after centuries. Mood: knowledge that has chosen its own depth.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_skyforge_plateau",
    name: "Skyforge Plateau",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "forge-orange, cloud-white, dusk-violet sky, one cold-blue plateau-lamp",
    composition:
      "3:2 landscape establishing matte painting of the Skyforge Plateau — a vast floating industrial city suspended mid-cloud high above an unseen surface. Camera: medium-wide at ~35mm equivalent, slight low-angle from below the cloud-deck looking up at the city's underside and broadside, viewer at airship-altitude. Lighting: forge-orange 1900K thermal-vent emission from the city's ventral side as the dominant warm key, dusk-violet 4500K cloud-strata light as ambient fill across the upper third of frame, cloud-white 6500K daylight scatter, one cold-blue 7000K plateau-warning lamp on the city's tallest mast as the saturated accent. Atmospheric perspective: heavy cloud haze, three depth planes — foreground cloud-tops drifting past, mid-ground city silhouette, background distant atmospheric layers receding. Materials: city built from massive black-iron platforms cantilevered together, forge-orange thermal-vents along the underside venting shimmering air-affinity ribbons (visualised as braided heat-currents in pale orange) that keep the city aloft, mismatched architectural styles bolted to a common skeleton — DeMagi vellum-coloured towers next to Quarchon black-glass spires next to Quarchon black-glass spires. Composition: rule-of-thirds with the city centred along the upper-third horizontal, thermal-ribbons curving downward into the lower third like roots, the shared signal-mast on the right-third intersection flying a DeMagi flag and a Quarchon flag side-by-side from the same crossbar — clearly grudging. Mid-ground narrative detail: a single cargo-skiff approaching the underside venting, deliberately tiny against the city's mass. Mood: grudging coexistence held aloft by industry.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_ember_memorial",
    name: "Ember IV Memorial",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "ash-grey, memorial-amber, deep charcoal sky, one cold-white Quarchon light",
    composition:
      "3:2 landscape establishing matte painting of the Ember IV Memorial — a colossal blackened crater where a world used to be, viewed from low orbit and slightly inside the rim. Camera: medium-wide at ~35mm equivalent, slight high three-quarter angle so the crater's curve and the rim-ring of memorial flames both read in frame, viewer hovering at memorial-altitude. Lighting: charcoal 2000K dead-sky ambient as base, memorial-amber 1800K small flame-glow from the forty-six rim-flames as the dominant emissive ring of practical sources, one cold-white 7500K Quarchon visitor running-light at the rim's edge as the saturated cool accent, ash-grey ambient fill on the crater floor. Atmospheric perspective: dense ash-haze in the crater bowl, three depth planes — foreground ash, mid-ground rim of flames, background charred sky. Materials: ash-grey crater surface fissured and inert, small bronze memorial braziers each holding a single steady flame in muted amber, dark-cloaked silhouettes — forty-six in total — each tending one brazier in identical posture, the Quarchon visitor standing slightly apart in a clean grey field uniform, very still. Composition: rule-of-thirds with the rim-ring of flames forming an arc across the upper-third, the Quarchon visitor at the right-third intersection slightly outside the ring, the crater floor stretching into the lower two-thirds in unbroken ash. Mid-ground narrative detail: one of the forty-six tenders has paused, head turned half toward the visitor — uncertain whether to acknowledge. Mood: forty-six small flames, exactly.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_hidden_pureflame_cell",
    name: "The Pure Flame's Forge",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "forge-red, obsidian-black, ember-amber, one cold steel highlight on the hammer",
    composition:
      "3:2 landscape interior matte painting of the Pure Flame's Forge — a hidden underground forge-chamber. Camera: medium-wide at ~35mm equivalent, slight low-angle so the chamber ceiling reads vaulted, viewer standing at the chamber threshold roughly five paces from the anvil. Lighting: forge-red 1500K incandescent furnace mouth at the rear wall as the dominant key flooding the chamber with deep red light, ember-amber 1800K floor reflections, obsidian-black 2000K ambient shadow, one cold-steel 6500K specular highlight catching the hammer head at exact strike-position as the saturated cool accent. Atmospheric perspective: heavy heat-shimmer rising from the furnace, three depth planes — foreground anvil and figure, mid-ground furnace mouth, background chamber walls dissolving into blackness. Materials: polished obsidian walls catching long red reflections of the forge-flame, ancient runic symbols cut into the walls glowing hot from beneath the surface as if heated from within, anvil in heavy black iron, masked figure (Arch-Burner Vel) in dark forge-leathers and a featureless mask, mid-strike with hammer raised. Composition: rule-of-thirds with the masked figure on the centre-left intersection, the hammer head suspended at the upper-third just before contact, runic wall-glyphs receding along the side walls in unequal heat-glow. Mid-ground narrative detail: a half-finished blade resting on the anvil glowing white-hot, recognisably a weapon but indistinct. Mood: secret craft as devotion.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_hidden_firstpattern_cell",
    name: "The First Pattern's Lattice",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "bone-white, lattice-violet, deep-black recess, one red stand-by pinlight",
    composition:
      "3:2 landscape interior matte painting of a hidden First Pattern cell, a substrate-dwelling Architect chamber. Camera: medium-wide at ~28mm equivalent, slight low-angle so the recursive wall-lattice reads dominant, viewer standing at the chamber threshold facing the dormant construct. Lighting: deep recess 1500K near-black ambient on the floor and ceiling, lattice-violet 4500K subsurface glow inside the crystalline wall growths as the dominant emissive light source, bone-white 6500K key picking out the dormant construct's hull plates from above, one red 1800K stand-by pinlight on the construct's chest as the saturated accent — the only thing in the room that reads alive. Atmospheric perspective: dry inert chamber air, three depth planes — foreground floor-pattern, mid-ground construct, background dissolving into recursive lattice-darkness. Materials: walls grown not built — geometric crystalline lattices in pale-white branching outward in perfect recursive Architect-doctrine pattern (rings within rings, fractals at the edges), the dormant construct rendered in bone-white ceramcrete with red-black trim, eyes optically dark, both arms folded across chest in dormancy posture. Composition: rule-of-thirds with the construct anchored at centre on the lower-third sleeping plane, the recursive wall-lattice fanning outward symmetrically from behind the construct's head as if grown to receive it, eldritch geometry obviously deliberate in every wall-pattern node. Mid-ground narrative detail: thin crystalline tendrils visibly growing from the wall toward the construct, claiming it slowly. Mood: a thing waking on its own schedule.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_new_atarion",
    name: "New Atarion",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "exhaustion-amber, dust-grey, slate-blue sky, one warm council-lamp yellow",
    composition:
      "3:2 landscape establishing matte painting of New Atarion — a post-fall human capital city under a weary slow dawn. Camera: medium-wide at ~35mm equivalent, slight high three-quarter from a residential rooftop perspective looking across the city, viewer at human-eye altitude. Lighting: exhaustion-amber 2400K rising-sun horizon-glow as the dominant key from the right edge of frame, slate-blue 6000K dawn-sky ambient across the upper two-thirds, dust-grey 5500K fill on the city surfaces, one warm yellow 2200K council-lamp practical still burning in the topmost room of a single tower as the saturated accent — they have not slept. Atmospheric perspective: dawn-haze layered across the city, three depth planes — foreground rooftop edge, mid-ground city sprawl, background distant horizon and damaged platforms. Materials: weathered concrete and patched steel construction throughout, three damaged shipping-platforms visible on the skyline (one still surrounded by repair-scaffold after eleven years, others abandoned mid-repair), residential rooftops with hanging laundry and small kitchen-gardens, no commercial lights. Composition: rule-of-thirds with the council-tower lamp anchored at the right-third intersection, the unrepaired shipping-platforms at the left-third for visual rhyme, streets receding into mid-ground stillness — no traffic visible despite the hour. Mid-ground narrative detail: a single early bicycle moving down a long avenue, the only motion in frame. Mood: the morning of a city that is still recovering.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_thaloria",
    name: "Thaloria",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "sage-green, parchment-cream, dawn-peach sky, one violet ink accent on the page",
    composition:
      "3:2 landscape establishing matte painting of Thaloria — the storm-planet's sister-world, now almost unnaturally quiet. Camera: ground-level medium-wide at ~35mm equivalent, slight high-angle showing the open grass-field stretching toward the horizon, viewer standing at field-edge near the writing Hierophant. Lighting: warm dawn-peach 3500K sky-glow from low horizon as the dominant warm ambient, soft sage-green 6500K reflected ground-light from the grass on the underside of every form, one warm 2200K vellum-paper highlight on the Hierophant's writing desk as a small saturated practical, no rim. Atmospheric perspective: clear still air, almost no haze — three depth planes purely from focal-distance, foreground writing desk, mid-ground council hall, background distant grass-horizon. Materials: pale sage-green grass moving very slightly in nonexistent wind (the calm itself feels staged), a single modest council hall of pale parchment-cream stone in the middle-distance, completely undefended — no walls, no turrets, no fences anywhere visible to horizon, an outdoor wooden writing desk with vellum and a brass inkwell, the Hierophant figure in cream-violet robes mid-sentence. Composition: rule-of-thirds with the writing desk at the lower-left intersection, the council hall at the right-third for visual balance, the empty grass-horizon stretching across the middle-third, no military element anywhere in frame. Mid-ground narrative detail: a single violet ink-droplet poised on the nib of the Hierophant's pen, suspended. Mood: silence that is not waiting for permission.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
  {
    assetId: "sector_clone_collective",
    name: "The Clone Collective",
    category: "sector_painting",
    resolution: "1536x1024",
    palette: "uniform slate-grey, civilian warm-brown, overcast sky, one accent rose-gold on the turning figure",
    composition:
      "3:2 landscape establishing matte painting of the Clone Collective — a city plaza of seventeen thousand identical faces, here rendered as a rhythmic crowd of identical civilian silhouettes. Camera: medium-wide at ~50mm equivalent, slight high three-quarter angle from a balcony perspective so the crowd reads as a continuous patterned mass receding across the plaza, viewer at second-storey altitude. Lighting: cool 6500K overcast daylight as ambient base, uniform slate-grey 5500K key with no strong directional shadows so the crowd pattern reads cleanly, one warm rose-gold 2400K rim catching the single turning figure as the saturated accent — they alone are warm, everyone else is cool. Atmospheric perspective: clear urban air, three depth planes — foreground turning figure, mid-ground rhythmic crowd, background plaza buildings receding. Materials: every figure rendered with the same proportions and the same face profile, dressed in slightly varied civilian clothes (warm-brown shawls, work-jackets, garden-aprons), each doing something slightly different — one reading a paper, one arguing with the air, one tending a flowerbox, one carrying groceries — the variation in posture creates rhythm without breaking the identical-face read. Composition: rule-of-thirds with the singular turning figure anchored at the right-third intersection, body angled toward the viewer, that face a fraction more individuated than the rest because of pose, the crowd patterned around them in unhurried staggered rows. Mid-ground narrative detail: a single child-clone among the adults, scaled for age but identical in face, holding the hand of an adult-clone — the same person at two ages. Mood: the question of which one of them said yes.",
    negativePrompt: SECTOR_SHARED_NEGATIVE,
    priority: "P2",
    reviewGate: "D",
  },
];

/* ═══════════════════════════════════════════════════════
   EXPORTED AGGREGATES
   ═══════════════════════════════════════════════════════ */

export const TRADE_EMPIRE_ART_PROMPTS: readonly TradeEmpireArtPrompt[] = [
  ...WONDERS,
  ...ERA_BANNERS,
  ...ENCOUNTER_KEY_ART,
  ...DOCTRINE_BANNERS,
  ...FLEET_SILHOUETTES,
  ...PIRATE_PORTRAIT,
  ...CIVIC_ICONS,
  ...SECTORS_TIER_A,
  ...SECTORS_TIER_B,
];

export const TRADE_EMPIRE_CATEGORY_COUNTS: Readonly<
  Record<TradeEmpireArtCategory, number>
> = {
  wonder: 8,
  era_banner: 5,
  encounter_key_art: 4,
  doctrine_banner: 4,
  fleet_silhouette: 6,
  pirate_portrait: 1,
  civic_icon: 9,
  sector_painting: 33,
};

/**
 * All 38 sectors in the Trade Empire, mapped to how they get their art.
 * Either a prompt assetId in this vault ("prompt") or a pre-existing
 * asset path ("existing"). Used by the coverage test to prove every
 * sector is accounted for.
 */
export const TRADE_EMPIRE_SECTOR_ART_COVERAGE: Readonly<
  Record<string, { kind: "prompt"; assetId: string } | { kind: "existing"; path: string }>
> = {
  // Tier A — 15 faction capitals / contested hubs / convergence-relevant.
  trade_nexus: { kind: "prompt", assetId: "sector_trade_nexus" },
  new_babylon_core: { kind: "prompt", assetId: "sector_new_babylon_core" },
  new_babylon_lower_tiers: { kind: "prompt", assetId: "sector_new_babylon_lower_tiers" },
  empire_frontier: { kind: "prompt", assetId: "sector_empire_frontier" },
  forge_worlds: { kind: "prompt", assetId: "sector_forge_worlds" },
  panopticon_ruins: { kind: "prompt", assetId: "sector_panopticon_ruins" },
  viral_wastes: { kind: "prompt", assetId: "sector_viral_wastes" },
  frontier_worlds: { kind: "prompt", assetId: "sector_frontier_worlds" },
  insurgency_haven: { kind: "prompt", assetId: "sector_insurgency_haven" },
  abyssal_sectors: { kind: "prompt", assetId: "sector_abyssal_sectors" },
  black_hole_gate: { kind: "prompt", assetId: "sector_black_hole_gate" },
  violetta_approach_lane: { kind: "prompt", assetId: "sector_violetta_approach_lane" },
  forward_bastion: { kind: "prompt", assetId: "sector_forward_bastion" },
  remembrance_archive: { kind: "prompt", assetId: "sector_remembrance_archive" },
  chronarchive_vault: { kind: "prompt", assetId: "sector_chronarchive_vault" },
  // Tier B — 18 remaining.
  ark_debris_field: { kind: "prompt", assetId: "sector_ark_debris_field" },
  terminus_approach: { kind: "prompt", assetId: "sector_terminus_approach" },
  research_corridor_alpha: { kind: "prompt", assetId: "sector_research_corridor_alpha" },
  research_corridor_beta: { kind: "prompt", assetId: "sector_research_corridor_beta" },
  research_corridor_gamma: { kind: "prompt", assetId: "sector_research_corridor_gamma" },
  probability_market_hub: { kind: "prompt", assetId: "sector_probability_market_hub" },
  syndicate_route_prime: { kind: "prompt", assetId: "sector_syndicate_route_prime" },
  command_post_iron: { kind: "prompt", assetId: "sector_command_post_iron" },
  intelligence_exchange_nightline: { kind: "prompt", assetId: "sector_intelligence_exchange_nightline" },
  atarion_ruins: { kind: "prompt", assetId: "sector_atarion_ruins" },
  tidewater_archive: { kind: "prompt", assetId: "sector_tidewater_archive" },
  skyforge_plateau: { kind: "prompt", assetId: "sector_skyforge_plateau" },
  ember_memorial: { kind: "prompt", assetId: "sector_ember_memorial" },
  hidden_pureflame_cell: { kind: "prompt", assetId: "sector_hidden_pureflame_cell" },
  hidden_firstpattern_cell: { kind: "prompt", assetId: "sector_hidden_firstpattern_cell" },
  new_atarion: { kind: "prompt", assetId: "sector_new_atarion" },
  thaloria: { kind: "prompt", assetId: "sector_thaloria" },
  clone_collective: { kind: "prompt", assetId: "sector_clone_collective" },
  // Pre-existing sector art — 4.
  free_ports: { kind: "existing", path: TRADE_EMPIRE_EXISTING_SECTOR_ART.free_ports },
  terminus_core: { kind: "existing", path: TRADE_EMPIRE_EXISTING_SECTOR_ART.terminus_core },
  hell_gate: { kind: "existing", path: TRADE_EMPIRE_EXISTING_SECTOR_ART.hell_gate },
  dreamer_barrier: { kind: "existing", path: TRADE_EMPIRE_EXISTING_SECTOR_ART.dreamer_barrier },
};

export function composeTradeEmpireArtPrompt(p: TradeEmpireArtPrompt): string {
  const negative = p.negativePrompt ? `\n\nNegative: ${p.negativePrompt}` : "";
  return `${TRADE_EMPIRE_STYLE_ANCHOR}\n\nPalette: ${p.palette}\n\n${p.composition}${negative}`;
}
