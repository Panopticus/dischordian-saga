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
 */
export const TRADE_EMPIRE_STYLE_ANCHOR =
  "Dischordian Saga house style. Painterly digital illustration. High-contrast low-saturation palette with one hot accent colour per piece. Bio-mechanical / crystalline / wet-chrome textures where appropriate. Composition readable at thumbnail scale. Subtle eldritch geometry in negative space (rings-within-rings, recursive spirals, impossible angles). No on-image text. Cinematic lighting — volumetric haze, rim light, single key source. Reference: docs/production/COMPLETE_ART_PROMPT_BIBLE.md and ACTS_2_TO_7_PRODUCTION_BIBLE.md.";

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
      "Towering sacred starship converted into a living cathedral, hanging in deep space above a pale blue planet. Stained-glass viewports cast warm gold light from inside the hull onto drifting refugee skiffs. Gothic bio-mechanical spires tipped in white ivory, intertwined with memorial ribbons that fade into vacuum. Soft choir-light halo. Mood: shelter, vigil, the Potentials' home.",
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
      "A jagged red crystalline obelisk the size of a mountain rising from an Authority megacity at dusk. Its refracted light stains every building blood-orange. Cargo freighters circle it like moths — Authority credits literally condense as red vapour at its base. Geometric crystal lattice recursive inward. Mood: wealth as law, law as weapon.",
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
      "A black basalt monolith cracked open vertically to reveal a white-hot industrial furnace-core, taller than any surrounding shipyard. Robotic arms assemble frigate hulls in mid-air around it. Sparks drift in zero-g. Mood: industrial sublime, Architect-aesthetic, war as craft.",
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
      "A silent grove of bioluminescent memorial trees growing out of a fractured starship prow that is half-buried on a mist-wet plain. Each tree's leaves are made of thin paper ledgers, wind-fluttering, inscribed with names too small to read. Kneeling silhouette of a crew member in the distance. Mood: grief held, not displayed.",
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
      "A colossal brass-and-void-glass astronomical instrument the size of a small moon, half-occluding a ringed gas giant. Concentric rotating rings carved with Antiquarian glyphs. A single Antiquarian in layered robes stands on an observation platform, dwarfed by the lens. Inside the lens: a reflection of a future battle that hasn't happened. Mood: knowledge as trespass.",
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
      "An enormous circular warding sigil inscribed into the void at a Lagrange point — concentric rings of angry red glyphs holding shut a perfect black disc of nothing. Fleet ships orbit the sigil at a respectful distance. Faint silhouettes of things pressing outward from inside the disc. Mood: what we keep out, barely.",
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
      "An orbital ring-station sheathed in pale white coral and translucent cyan membrane, singing — visualised as concentric pressure rings of pale light pulsing outward and dissolving Thought-Virus spores (small red-black motes) on contact. Below, a clean ocean planet. Mood: purification as lullaby.",
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
      "The Dreamer (colossal sleeping presence, only the curve of a shoulder and the side of a face visible) half-revealed inside a nebula, surrounded by a lattice of small warm lights — every light a ship of the player's fleet arrayed in a protective shell. Her eyes are closed; one single tear of starlight descends between galaxies. Mood: reprieve, not victory.",
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
      "Wide establishing shot of a single pre-warp colony fleet drifting away from a fractured home-world silhouette. Low-light amber dawn through atmospheric haze. Long horizontal composition; left third is the ruined planet, right two-thirds is the open dark with one hopeful navigation beacon. Mood: survival dawn.",
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
      "Panoramic interior-exterior hybrid: the Ark Cathedral hull opens and light pours out across a pale inhabited moon. Small refugee skiffs move toward it in silhouette. Warmer than First Light but still uncertain. Horizontal composition with the Ark centred-left, the moon-horizon on the right. Mood: gathering. The distant red flare foreshadows the Convergence.",
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
      "Wide view of a young empire's star-map table from above-and-to-the-side, with projected sector tokens floating in holographic amber above a brass surface. A gauntleted hand reaches in from the right to place one piece. Deep interior light, no window view. Mood: deliberate ascent.",
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
      "Panoramic fleet array in crescent formation over a populated world, seen from a great distance so the fleet reads as geometric pattern rather than individual ships. Twilight lighting. The horizon is just beginning to tint red-violet at the edges. Mood: dominion, but the sky is turning.",
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
      "The whole frame is bathed in a terrible red-dark corona — the Convergence arriving at galactic scale. Colossal impossible geometry (rings-within-rings, a door that is also an eye) occludes half the star-field. Tiny fleet silhouettes are below, in silhouette, utterly dwarfed. Horizontal composition with the geometry centred, fleet as a thin line along the bottom edge. Mood: witnessed apocalypse.",
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
      "A dark bridge interior of a player ship at low power. Every monitor shows a single pale eye rendered entirely in RF static noise — blinking in sync across screens. One ceiling speaker hangs crooked, a mouth-shaped crack running down it. A human comms officer is turned away from the camera, frozen mid-movement. Left-heavy composition; negative space on the right reserved for the choice-list UI pane. Mood: someone is already listening.",
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
      "The Dreamer's silhouette (vast, unfocused, only a shoulder and the curve of a distant cheek) across a nebula-scale void. A single tear becomes a cascade of crystalline shards falling slow-motion through space — some are raw Void Crystal, others are simply sad. Left-heavy composition with the tear-path curving from upper-left to mid-frame. Right third reserved for UI overlay. Mood: grief that can be mined.",
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
      "A cargo-bay manifest room. A roster projected on the wall lists names — but every name has two tallies next to it, and the second column is always one number higher than the first. In the foreground, an empty chair is pulled out from the table and gently rocking, seat-cushion still faintly indented. Strong chiaroscuro; left side of the composition is the chair, right side reserved for UI. Mood: someone who was never hired is at work.",
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
      "A colossal door suspended in open space — no wall, no station, just the door. Carved into it: a single polite welcome-glyph in a language that reads even to the viewer as a sentence ending in a question mark. A thin hairline crack runs down the centre; faint warm honey-coloured light leaks through. Distant fleet silhouettes approach from below like pilgrims. Left-heavy composition, door centred-left, right third reserved for UI. Mood: the choice framed as hospitality.",
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
      "A wide horizontal composition of countless small fighter-craft arranged in a moving chevron pattern — readable as a single shape made of fifty distinct dots. Motion-blur implies speed. Two larger carrier silhouettes anchor the left and right edges. Mood: overwhelming by number.",
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
      "A horizontal wall-formation of heavy armoured cruisers overlapping shields, forming a literal wall across the frame. Weapons retracted, shields active as faint hexagonal pattern. Behind the wall, a calm blue planet; in front, incoming fire flecks that disintegrate at the shield line. Mood: immovable promise.",
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
      "Three identical battle-dreadnoughts in perfect geometric triangle formation, surrounded by smaller frigate escorts in mathematically precise orbits. Architect-aesthetic: white hulls, red-black trim, ritual symmetry. The background is a flat dark void with a single dimly-lit ringed world. Mood: order as doctrine.",
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
      "A small elegant fleet (4–6 ships) mid-manoeuvre around a brass astrolabe-like superstructure floating in space. The ships trace curved light-trails that read as a musical phrase. Ship hulls are brass and vellum-cream with Antiquarian glyph-etching. Mood: war as composition.",
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
      "Slim dart-shaped recon skimmer, twin swept wings, oversized sensor-dome nose, minimalist hull, 3/4 view on transparent ground. Mood: eye.",
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
      "Blocky rounded freighter with visible modular cargo pods slung under the main hull, stub engines, civilian bridge bubble, 3/4 view on transparent ground. Mood: utility.",
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
      "Narrow knife-hull with forward rail-gun spine and two side missile racks. Angular, purposeful, 3/4 view on transparent ground. Mood: hunter.",
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
      "Mid-size capital hull with layered armour plating and a central battery turret. Squat, dense silhouette, 3/4 view on transparent ground. Mood: line-of-battle.",
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
      "Long flat-decked carrier with twin parallel flight-deck strips, hangar mouths at bow and stern, tower superstructure offset to one side, 3/4 view on transparent ground. Mood: lifter.",
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
      "Oversized command dreadnought with asymmetrical bridge pagoda, heavy forward prow, multiple secondary gun tiers, a distinct ceremonial banner mast, 3/4 view on transparent ground. Mood: throne.",
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
      "A battered bulk-carrier repainted by hand with a garish red-and-black raider sigil. Cargo-pod skeletons welded crooked, heavy-salvage hull patches, a single oversized broadside gun bolted amidships. Pirate's own small dinghy docked at the side like a parasite. The ship is parked, drifting lazy — engines cold, running lights dimmed to two. Background: empty trade-lane stars. Mood: rudeness as business model.",
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
      "Roaring lion's head silhouette fused with a clenched iron gauntlet. Crude, defiant heraldic emblem, centred, single bold shape.",
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
      "A compass rose whose north arrow is a single bird's feather, offset from centre. Quiet, evasive heraldic emblem, centred.",
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
      "A perfect bisected triangle with a smaller inverted triangle inside, Architect geometry. Ritual, cold heraldic emblem, centred.",
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
      "Three anchors interlocked in a triskele pattern. Merchant-solidarity heraldic emblem, centred, single bold shape.",
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
      "A stylised red hand holding out a single coin; a thin chain runs from the wrist off-frame. Heraldic emblem, centred.",
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
      "An open ledger whose facing pages show a single inked sigil that extends across both sides, impossible to close. Heraldic emblem, centred.",
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
      "Six small circles arranged around a seventh empty centre (the absent chairperson). Heraldic emblem, centred, single bold shape.",
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
      "A single lidless eye inside a ring inside a ring inside a ring — recursive concentric surveillance. Heraldic emblem, centred, single bold shape.",
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
      "A small burning candle whose flame is shaped like a written name — the flame itself is the glyph. Heraldic emblem, centred.",
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
      "A seething Authority-controlled commercial megastation hanging over a calm planet. Hundreds of docking arms, all of them busy. A single red surveillance eye hovers above every major dock.",
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
      "An ecumenopolis city-planet at night, viewed from low orbit. Six tiny pinpricks of red crystal light pulse in sync from a central spire (the coffined minds).",
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
      "A rain-slicked canyon street in the lowest tier of the city-planet, crowded with industrial smokestacks and refugee housing. A single Authority patrol drone hangs in the rain.",
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
      "A half-rebuilt Artificial Empire border outpost, Architect drones mid-assembly around a skeletal city. Bone-white hulls, red-black trim, strict geometry.",
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
      "A planet whose entire night side glows orange from the heat of never-sleeping forges. A ring of active shipyards girdles the equator.",
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
      "A shattered orbital prison complex adrift in silence; individual cells visible as hollow geometric cubes through broken walls. A single empty cell at frame-centre.",
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
      "A dead system whose planets are wrapped in writhing black-red Thought-Virus spore tendrils, growing visibly between worlds.",
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
      "A rugged independent colony on a yellow-grassland moon, watchtowers built from scavenged Imperial hull-plating, cattle grazing in the foreground.",
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
      "A hidden base tucked inside a fractured asteroid, visible only as warm windows in the rock's interior. A single courier skiff departs at silent thrust.",
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
      "A Hierarchy-consumed region where reality visibly bleeds — stars smear like oil paint, space has grain, and a red veinous Blood-Weave pulses between planets.",
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
      "A black hole that is not a black hole: the event-horizon disc is a brass ornate door, carved with Antiquarian glyphs, ajar by a finger's width. No accretion disc — just the door.",
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
      "A corridor of space near the Dreamer's Shield; violet shield-light washes half the frame. Distant silhouette of a civilian convoy paused mid-approach as if waiting for permission.",
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
      "A Potentials-held fortress-moon bristling with defensive turrets and memorial ribbons draped from the walls. Ivory and gold against a cold starfield.",
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
      "An Antiquarian vault built into a cliff-face on a mist-wet world. Tall brass doors etched with names, a single Antiquarian figure climbing the steps with a ledger.",
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
      "An underground Antiquarian archive, shelves of chained ledgers receding into darkness, a great brass chronarch ring rotating slowly overhead. Single candle provides all the light.",
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
      "Drifting wreckage field of a thousand shattered Ark-ships — ivory hulls split open like broken cathedrals, memorial ribbons still clinging and fluttering in vacuum. One intact bow, lit from within, pushes slowly through.",
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
      "A dead approach-corridor toward Terminus. Black-red Thought-Virus spores thicken as the frame moves right; the far horizon is utterly obscured. A single derelict shows the pattern of what happens to vessels that try.",
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
      "A sealed Dischordian-era science hab, neural-lattice locks visible as faint blue filigree on every doorway. Two figures in lab-coats (one human, one Quarchon-humanoid) argue over a central holographic diagram.",
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
      "A DeMagi resonance lab: tall glass chambers filled with slow-rotating elemental tracers (fire, water tuning visible as coloured waves), walls covered in hand-written protocol corrections in fading ink.",
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
      "A Quarchon dimensional-stability lab: a rotating cube-within-cube-within-cube apparatus at centre, thin red warning lines projected on the floor, no windows, no doors visible — only the apparatus.",
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
      "A New Babylon trading floor where every price board shows three parallel future values branching sideways like tree rings. Traders stand frozen mid-gesture as if paused between certainties.",
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
      "A hidden warp-lane bristling with Syndicate bio-scanners (organic growth on old Empire pylons), a lone courier skiff threading between them unseen. Off-frame right: the implied border of the Collector's Garden.",
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
      "A forward-operating command post built into a fortified crag, Iron Lion's sigil painted on the rockface but faded. Two officers (one human, one Quarchon) confer beside a holo-table. Ribbons of the dead hang from the ceiling beams.",
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
      "An unmarked sector painted as a single dim bar interior in the middle of nowhere in space — no signs, no markings — where shadowed figures trade information across small tables. Only the drinks are lit.",
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
      "Ancient DeMagi memory stones half-buried in pale dust, still humming audibly (visualised as thin concentric rings around each stone). A Quarchon probability inspector is kneeling with a device, looking embarrassed.",
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
      "An underwater DeMagi archive seen through a glass observation dome — shelves of preserved parchment suspended in pale green sea-glow, fish moving between them as slow curators. A frustrated Quarchon inspector taps uselessly on the lock panel.",
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
      "A floating industrial city mid-cloud, enormous thermal vents releasing shimmering air-affinity ribbons that keep the city aloft. DeMagi and Quarchon flags fly from the same mast, side by side and grudging.",
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
      "A blackened crater where a world used to be. Forty-six small memorial flames arranged in a ring at its rim, each tended by a single silhouetted figure. Distant Quarchon visitor standing very still at the edge of the ring.",
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
      "An underground forge-chamber, red-orange flames reflected on polished obsidian walls, a single masked figure (Arch-Burner Vel) hammering at an anvil. Runic symbols glow hot along the walls.",
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
      "A substrate-dwelling Architect cell: geometric crystalline lattices grow across the walls in perfect recursion, echoing the Architect's aesthetic. A dormant white-hulled construct lies in the middle, eyes dark.",
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
      "A post-fall human capital city under a weary dawn. Three damaged shipping-platforms visible on the skyline, one still under repair scaffold after eleven years. Streets below are quiet; a single council-tower burns its lamp late.",
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
      "The storm-planet's sister-world, now almost unnaturally quiet. Vast fields of pale grass, a single modest council hall in the middle-distance, no defensive emplacements anywhere. A Hierophant figure writes at an outdoor desk under an umbrella of cloudless sky.",
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
      "A city of identical faces — seventeen thousand, here rendered as a rhythmic crowd of identical silhouettes in civilian clothes, each doing something slightly different (reading, arguing, gardening). The camera catches one turning, singular, toward the viewer.",
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
