/* ═══════════════════════════════════════════════════════
   EARNED LOADOUT ART PROMPTS — canonical prompt catalog

   Nano Banana 2 prompts for the 15 class × species reward
   items defined in apps/shared/earnedLoadouts.ts. Used by
   apps/scripts/generate-earned-loadout-art-csv.ts to emit
   production-queue CSVs.

   Style anchor: cyberpunk × steampunk sorcery (brass + chrome
   + arcane sigil; fiber-optic ley lines; clockwork prophecy).
   Every prompt inherits EARNED_LOADOUT_STYLE_ANCHOR below.

   Categories map 1:1 to equip slots:
     - weapon
     - secondary
     - consumable
     - accessory

   Each prompt is keyed by the RewardItem.id from
   earnedLoadouts.ts. The shared-shape test (see the sibling
   earnedLoadoutArtPrompts.test.ts) asserts 1:1 coverage — if
   a new reward lands in earnedLoadouts.ts it MUST land here too.
   ═══════════════════════════════════════════════════════ */

import type { Slot } from "./earnedLoadouts";

export type Priority = "P0" | "P1" | "P2";

export interface EarnedLoadoutArtPrompt {
  /** Matches RewardItem.id in apps/shared/earnedLoadouts.ts. */
  assetId: string;
  /** Human-readable display label. */
  name: string;
  /** Equip slot — mirrors RewardItem.slot. */
  slot: Slot;
  /** The Nano Banana 2 prompt body (without the global style anchor). */
  prompt: string;
  /** Target resolution for the catalog render. */
  resolution: string;
  /** Delivery priority. */
  priority: Priority;
  /** Optional dependency refs (style anchor, continuity refs, etc.). */
  dependencies?: readonly string[];
}

/**
 * Global style anchor. Producers must prepend this to every prompt's
 * `prompt` field before submission. The CSV generator composes it
 * automatically. Matches the aesthetic constraint in plan §Step 3.
 */
export const EARNED_LOADOUT_STYLE_ANCHOR =
  "Cyberpunk meets steampunk sorcery: hand-forged brass and blackened iron fused with fiber-optic ley lines, arcane glyphs that glow from within the metal, and hairline chrome inlays that read as both circuitry and ritual script. Hand-painted edges over a clean vector base. Soft three-point studio lighting at chest height, 50mm equivalent, zero lens tilt, no motion blur, no depth of field. Isolated on transparent alpha — no ground plane, no props, no environment, no text, no watermarks. Material palette: patinated brass, oil-blued steel, oxblood leather, smoked glass, phosphor-green or lavender glyph glow. Single object centered in frame, full silhouette visible from edge to edge with 8% margin. Render as a catalog / codex entry — the object must read as a specific, hand-made artifact, not a generic kit piece.";

const RES_CATALOG = "1024x1024";
const DEPS_ANCHOR = ["earned_loadout_style_anchor"] as const;

/* ─── ENGINEER rewards ─── */

const ENGINEER_PROMPTS: readonly EarnedLoadoutArtPrompt[] = [
  {
    assetId: "brass-sigil-arc-welder",
    name: "Brass-Sigil Arc Welder",
    slot: "weapon",
    resolution: RES_CATALOG,
    priority: "P0",
    dependencies: DEPS_ANCHOR,
    prompt:
      "Three-quarter product shot of a hand-held arc welder the size of a heavy pistol. Body: patinated brass with copper venting along the spine, hand-etched sigils that glow lavender where the current would bite the work. A short ceramic nozzle tipped in oil-blued steel, single ground-strap of oxblood leather looped through a brass ring at the butt. A small beveled quartz window over the capacitor shows a violet internal flame banked like a pilot light. Trigger guard is a filigreed brass hoop. Copper conduit curls once around the grip before joining the main body. Reads as a gunsmith's piece married to a ritual iron — functional welder silhouette, arcane embellishment in the etching. No decals, no serial numbers.",
  },
  {
    assetId: "clockwork-repair-swarm",
    name: "Clockwork Repair Swarm",
    slot: "secondary",
    resolution: RES_CATALOG,
    priority: "P0",
    dependencies: DEPS_ANCHOR,
    prompt:
      "Hero shot of a small lacquered brass lockbox (palm-sized) sitting open, with six mechanical beetles arranged above it in a slight arc as if mid-deploy. Each beetle: brass carapace the size of a walnut, smoked-glass abdomen holding a faint probability-green mote that reads as a caged firefly. Six gossamer wings per beetle — etched brass filigree that suggests circuit traces AND insect veining simultaneously. Mandibles are tiny oil-blued steel calipers. The lockbox interior is velvet the color of dried bracken and shows six precisely-sized beetle sockets. One beetle is slightly off-axis to imply motion without motion blur. No cables, no wires — every beetle is self-contained. The whole piece reads as a watchmaker's instrument kit that happens to be alive.",
  },
  {
    assetId: "aether-loom-gauntlet",
    name: "Aether-Loom Gauntlet",
    slot: "weapon",
    resolution: RES_CATALOG,
    priority: "P0",
    dependencies: DEPS_ANCHOR,
    prompt:
      "Three-quarter product shot of a right-hand gauntlet ending at mid-forearm. Oxblood leather base laced along the inner seam with brass eyelets; outer shell is blackened iron plates riveted at the knuckles. Running from wrist to fingertip: twelve fiber-optic tendons (translucent quartz filaments, phosphor lavender glow) woven through the leather like warp threads on a loom, each terminating in a brass claw-tip at a fingernail. The back of the hand bears a small brass disc engraved with a single radiant glyph. The inner wrist shows a bank of six tiny bobbin-spools — half brass, half smoked glass — stacked like loom reeds. Reads as a weaver's apparatus and a weapon at once; the glow is cool, not hot.",
  },
];

/* ─── ORACLE rewards ─── */

const ORACLE_PROMPTS: readonly EarnedLoadoutArtPrompt[] = [
  {
    assetId: "geomantic-tap-relay",
    name: "Geomantic Tap Relay",
    slot: "weapon",
    resolution: RES_CATALOG,
    priority: "P0",
    dependencies: DEPS_ANCHOR,
    prompt:
      "Hero shot of a Y-shaped divining rod, each arm roughly forearm-length, carved from dark wood and banded at the fork by hammered brass with filigree ley-line etchings. Threaded along the entire length: a single translucent fiber-optic cable that follows the wood grain like an ivy vine, glowing faint phosphor green from pulses that travel root-to-tip. At the fork a small brass resonator drum the size of a pocket watch, smoked-glass face displaying an internal needle. A loop of oxblood leather at the handle end for wear. The object must read first as a dowsing rod and only on second look as a piece of surveying equipment. No visible connectors, no external power source.",
  },
  {
    assetId: "probability-cant-slate",
    name: "Probability-Cant Slate",
    slot: "accessory",
    resolution: RES_CATALOG,
    priority: "P0",
    dependencies: DEPS_ANCHOR,
    prompt:
      "Flat-lay product shot of a hand-sized rectangular slate, slightly thicker than a playing card, held in a brass-rimmed frame with finger cutouts at the short sides. Surface: matte black glass carved with shifting neon-violet probability glyphs arranged in a rotating calendar-wheel pattern (render as a still frame of the wheel, not mid-motion). The glyphs bleed faint light into the bezel. The back (not shown) is brass engraved with a single radiant rune. A slim sliding brass dial runs along one edge like a volume slider. Slate edges are oxblood leather wrapped around the brass frame. Reads as a pocket oracle crossed with a debtor's ledger.",
  },
  {
    assetId: "chrome-augur-lens",
    name: "Chrome Augur Lens",
    slot: "accessory",
    resolution: RES_CATALOG,
    priority: "P0",
    dependencies: DEPS_ANCHOR,
    prompt:
      "Hero shot of a single monocle, chrome bezel fully polished, about 45mm diameter. Lens is quartz with the faintest iridescent oil-slick coating — from certain angles a spiral of etched augur glyphs appears to drift across the glass. A silk-thin chrome chain hooks through a small brass ring at the rim and loops once in a shallow S above the lens. The chromed bezel carries a hairline inlay of a single radiant eye-sigil at the top. The monocle rests as if about to be picked up, tilted 15° off the vertical axis. High polish on the bezel; matte inside edge to avoid glare in the lens itself. No engraving on the chain, no maker's mark.",
  },
];

/* ─── ASSASSIN rewards ─── */

const ASSASSIN_PROMPTS: readonly EarnedLoadoutArtPrompt[] = [
  {
    assetId: "obsidian-rite-blade",
    name: "Obsidian Rite Blade",
    slot: "weapon",
    resolution: RES_CATALOG,
    priority: "P0",
    dependencies: DEPS_ANCHOR,
    prompt:
      "Three-quarter product shot of a short-sword approximately 50cm overall length. Blade: single-edged volcanic glass, translucent black with a faint internal veining of deeper black glyphwork that only resolves under inspection. The spine of the blade is fitted with a hair-thin brass runnel that carries a banked lavender glow from hilt toward tip. Hilt: blackened brass with a sigil inlay at the pommel — a single radiant rune. Grip wrapped in oxblood leather over brass wire. The crossguard is two stubby brass tongues etched with matching glyphs. The blade rests at a slight downward angle so light catches one edge. Reads as sacrificial / ritual knife first, combat weapon second.",
  },
  {
    assetId: "phase-cut-stiletto",
    name: "Phase-Cut Stiletto",
    slot: "weapon",
    resolution: RES_CATALOG,
    priority: "P0",
    dependencies: DEPS_ANCHOR,
    prompt:
      "Hero shot of a needle-thin stiletto, overall 32cm, blade a triangular brass needle with hairline chrome inlay down the central ridge. A faint lavender ghost-image of the same blade is rendered 4px offset toward the viewer — a catalog-legible afterimage, not a motion blur; the afterimage is slightly more translucent than the physical blade. Hilt: blackened steel knurl wrapped once in oxblood leather, pommel a small brass orb bearing one radiant glyph. No crossguard. The weapon sits at a slight diagonal as if about to be drawn. The afterimage must read as deliberate visual language, not an error.",
  },
  {
    assetId: "chrome-silencer-ampoule",
    name: "Chrome Silencer Ampoule",
    slot: "consumable",
    resolution: RES_CATALOG,
    priority: "P0",
    dependencies: DEPS_ANCHOR,
    prompt:
      "Flat-lay hero shot of a small hand-blown glass ampoule, 6cm tall, held upright in a two-prong brass caliper stand. Glass is clear; contents are a mirrored silver oil that catches the studio light like mercury but behaves like liquid — a single cold highlight across the meniscus, no ripples. The neck of the ampoule is sealed with a brass cap engraved with a tiny radiant sigil and a single chrome hairline ring. The caliper stand is patinated brass with oxblood leather feet. No labels, no wax seals, no serial numbers — the object's identity is carried entirely by the mirror of its contents.",
  },
];

/* ─── SOLDIER rewards ─── */

const SOLDIER_PROMPTS: readonly EarnedLoadoutArtPrompt[] = [
  {
    assetId: "iron-rite-bulwark",
    name: "Iron-Rite Bulwark",
    slot: "secondary",
    resolution: RES_CATALOG,
    priority: "P0",
    dependencies: DEPS_ANCHOR,
    prompt:
      "Three-quarter product shot of a kite shield approximately 90cm tall, face presented at a 25° tilt. Body: cold blackened iron, slightly domed, rimmed in hammered brass. Face is stamped with a single large warding sigil that glows a deep, banked phosphor green from recessed channels — the glow is almost dormant, as if saving its strength. Oxblood leather arm-strap and brass-buckled grip visible at the back edge. Several tiny brass rivets around the outer rim, each engraved with a smaller companion glyph. Along the lower third of the face, faint linear score-marks catalog blows it has already turned. Reads as a ceremonial weapon that has done real work.",
  },
  {
    assetId: "clockwork-line-carbine",
    name: "Clockwork Line Carbine",
    slot: "weapon",
    resolution: RES_CATALOG,
    priority: "P0",
    dependencies: DEPS_ANCHOR,
    prompt:
      "Side profile of a short gas-brass carbine approximately 70cm overall. Receiver: patinated brass with a visible clockwork mechanism under a smoked-glass panel on the left side — tiny cogs, an escapement wheel, a single ruby-red jewel bearing. Barrel: oil-blued steel, hex-fluted, short. Stock: dark wood with oxblood leather cheek-rest. A small winding key folds flush against the side of the receiver; above it, a brass pressure gauge with a glowing phosphor-green needle. Bolt handle is a brass knurl. Sling swivel is a single brass D-ring. No optics, no rail, no modern accessories. Reads as a post-arcane clockmaker's rifle.",
  },
  {
    assetId: "voltaic-aegis-harness",
    name: "Voltaic Aegis Harness",
    slot: "secondary",
    resolution: RES_CATALOG,
    priority: "P0",
    dependencies: DEPS_ANCHOR,
    prompt:
      "Front-on hero shot of an upper-body harness floating as if worn by an invisible figure. Oxblood leather straps crossing over the chest and shoulders, silver runes hammered into the leather at each strap intersection. Two small copper Tesla-coils mount at the clavicles, each wrapped in brass filigree, a thin banked-blue arc crawling slowly between the two like captured lightning breathing. At the solar plexus: a circular brass grounding disc engraved with a single radiant sigil. A bank of three fuse-tubes in smoked glass sits at each side of the ribcage, glowing a quiet phosphor lavender. No visible buckles — the straps lace through brass grommets. Reads as protective liturgy that happens to be voltaic.",
  },
];

/* ─── SPY rewards ─── */

const SPY_PROMPTS: readonly EarnedLoadoutArtPrompt[] = [
  {
    assetId: "whispering-ledger",
    name: "Whispering Ledger",
    slot: "accessory",
    resolution: RES_CATALOG,
    priority: "P0",
    dependencies: DEPS_ANCHOR,
    prompt:
      "Hero shot of a small pocket-sized codex, 10cm × 14cm, bound in oxblood leather with hand-tooled brass corners and a single brass clasp. The clasp is engraved with a radiant sigil. Cover leather is scored with faint pencil-thin lines that imply a family tree drawn and half-erased. The book sits slightly open — about 20°, just enough to show the first three pages writing themselves in hairline phosphor-green ink from an invisible nib; the ink must read as still-wet in a line that extends across both visible pages. No ribbon marker; a length of fine chrome wire runs along the spine instead. The interior pages are cream, not white. Reads as a surveyor's notebook and a reliquary at once.",
  },
  {
    assetId: "mirror-cant-dossier",
    name: "Mirror-Cant Dossier",
    slot: "accessory",
    resolution: RES_CATALOG,
    priority: "P0",
    dependencies: DEPS_ANCHOR,
    prompt:
      "Flat-lay overhead shot of a hand-sized folio roughly 18cm × 24cm, open to its center spread. Cover (visible at the edges) is black leather with a chrome inlay running along all four seams. Interior paper is a cold mirror-grey that catches the studio light like polished steel; across both pages a single neon-violet cant script appears to float 2mm above the surface — rendered as a crisp ghost-layer, not motion-blurred. The text reverses subtly toward the gutter as if unsure which tongue it belongs to. A single chrome straight-pin holds a small brass sigil-disc to the upper-left corner of the left page. No handwriting, no annotations, no margin scribbles.",
  },
  {
    assetId: "chrome-veilcloak",
    name: "Chrome Veilcloak",
    slot: "secondary",
    resolution: RES_CATALOG,
    priority: "P0",
    dependencies: DEPS_ANCHOR,
    prompt:
      "Three-quarter display shot of a hooded half-cloak hanging on an invisible form, back-to-viewer three-quarter angle so both the hood and the interior lining are readable. Outer shell: matte charcoal wool. The entire exterior is stitched in a fine scale pattern of mirror-polished chrome shingles, each about the size of a thumbnail, so the garment reflects light as hundreds of tiny facets — the scales read as armor scales from far, sequins from near, and neither up close. Hood interior lined in oxblood silk. A single radiant sigil is embroidered in silver thread at the nape of the neck, only visible where the hood falls back. Hem weighted with hairline brass beads. No clasp visible — the cloak closes with a single hidden magnetic brass stud at the throat.",
  },
];

/* ─── EXPORT — canonical catalog ─── */

export const EARNED_LOADOUT_ART_PROMPTS: readonly EarnedLoadoutArtPrompt[] = [
  ...ENGINEER_PROMPTS,
  ...ORACLE_PROMPTS,
  ...ASSASSIN_PROMPTS,
  ...SOLDIER_PROMPTS,
  ...SPY_PROMPTS,
];
