/* ═══════════════════════════════════════════════════════
   ROOM TIER ART PROMPTS — LucasArts spine variants

   Sibling to roomStateArtPrompts.ts. Where that catalog
   covers the Section F flag-driven mid-investigation
   states for Cryo Bay and Medical Bay, this catalog covers
   the **4-tier progression spine** (apps/shared/roomTier.ts)
   for the showcase rooms beyond Section F:

       Tier 0 — Dormant         (entry, sparse, broken)
       Tier 1 — Investigating   (clue logged, traces visible)
       Tier 2 — Activated       (primary system online)
       Tier 3 — Restored        (full art + crew + decor)

   Cryo Bay / Medical Bay continue to use their Section F
   variants (roomStateArtPrompts.ts) — those map onto the
   same tier semantic at runtime via `pickTierAsset()` in
   apps/client/src/game/roomStateAssets.ts.

   Only the Activated and Restored variants are authored
   here for now. Tier 0 reuses the existing single-image
   room render (current shipping art reads as Dormant
   already — empty consoles, no crew, low light), and
   Tier 1 reads as Tier 0 with the verb-coin / clue
   journal mid-flow visual rather than a separate render.

   Wire-up:
     - Drop the rendered URL into ROOM_TIER_ASSET_URLS in
       apps/client/src/game/roomStateAssets.ts under the
       matching roomId + tier. The runtime resolver picks
       it up automatically.
     - resolveRoomBackgroundUrl() falls down-tier if a
       higher tier URL is missing, so a partial drop
       (Tier 2 only) ships safely.

   Style anchor and layout convention follow
   roomStateArtPrompts.ts so the existing visual vocabulary
   (cyberpunk-meets-steampunk-sorcery, 28mm wide-shot,
   no figures, no rendered text) carries over verbatim.
   ═══════════════════════════════════════════════════════ */

import { ROOM_STATE_STYLE_ANCHOR } from "./roomStateArtPrompts";
import type { RoomTier } from "./roomTier";

export type RoomTierArtRoomId = "bridge" | "engineering";

export interface RoomTierArtPrompt {
  /** Stable asset id — `<roomId>:t<tier>`. */
  assetId: string;
  roomId: RoomTierArtRoomId;
  tier: RoomTier;
  label: string;
  /** Plain-English description of the runtime condition that
   *  promotes a room to this tier. Should match the threshold
   *  flags in apps/shared/roomTier.ts ROOM_TIER_THRESHOLDS. */
  condition: string;
  prompt: string;
  resolution: string;
  priority: "P0" | "P1" | "P2";
  dependencies: readonly string[];
}

const RES = "1920x1080";
const DEPS = ["room_state_style_anchor"] as const;

/* ─── BRIDGE — shared layout sentence ───
   The Bridge is the Ark's command deck. The same architectural
   vocabulary across all three tiers — only the activation /
   crew / decoration layer changes. Do NOT alter the layout
   sentence; it's what makes the variants feel like the same
   room evolving. */
const BRIDGE_LAYOUT =
  "The Command Bridge of the Inception Ark seen from the central nave — viewport-spanning back wall " +
  "showing a curved smoked-glass observation panel of deep space, flanked by twin riveted-brass console " +
  "stations with oxblood leather chairs. Centered on the back wall: a wheel-shaped Conspiracy Board " +
  "display (the room's signature element) — a brass armature ringed with pinned tarot-shaped intelligence " +
  "cards strung together with phosphor-lavender ley-line filaments. Mid-foreground: the Captain's chair " +
  "raised on a small dais, its armrest terminal a dark smoked-glass slab. Foreground left: the alien-glyph " +
  "Navigation Console with its oil-blued steel housing and warm-gold readout panel. Foreground right: " +
  "the Diplomacy Table — a round brass-rimmed slab with seven holographic-projector sockets ringing its " +
  "edge. Ceiling is vaulted hull-rib architecture in oil-blued steel; floor is textured plate metal " +
  "with a faint compass-rose etched at frame center.";

/* ─── ENGINEERING — shared layout sentence ───
   Engineering is the Ark's heart-of-power deck. The reactor
   is the room's gravity well; the workbench, blueprint table,
   and research station orbit it. Layout stays constant across
   all tiers. */
const ENGINEERING_LAYOUT =
  "The Engineering Bay of the Inception Ark seen from the deck-entry vantage — a working-shop interior " +
  "anchored by a back-wall reactor housing in patinated brass and oil-blued steel, the reactor's smoked-glass " +
  "containment lens centred at upper-mid-frame and breathing a phosphor-lavender pulse. Mid-foreground left: " +
  "the Crafting Workbench — a chest-high brass-and-leather slab with a fusion socket, hand-tools racked on a " +
  "wall-mounted board behind it. Mid-foreground right: a holographic Blueprint Projector — a low brass plinth " +
  "throwing card-schematic lines into the air at chest height. Background right: a curved Research Station " +
  "wall with twin terminals and a small experiment cubicle. Floor is textured plate metal with riveted " +
  "expansion seams running radially out from the reactor base. Ceiling is exposed copper conduit and " +
  "phosphor-green ley-line lighting routed along the hull ribs.";

/* ─── BRIDGE — three tier prompts ─── */

const BRIDGE_PROMPTS: readonly RoomTierArtPrompt[] = [
  {
    assetId: "bridge:t0",
    roomId: "bridge",
    tier: 0,
    label: "Bridge — Dormant (entry)",
    condition:
      "Default state on first entry: no investigative or operational flags set. The room reads as 'a command deck that has been empty for a long time.'",
    resolution: RES,
    priority: "P1",
    dependencies: DEPS,
    prompt:
      `${BRIDGE_LAYOUT} STATE: dormant. Service lamps are dim — only the warm-gold floor strips along the dais ` +
      "are lit at half-intensity. The Conspiracy Board on the back wall is a static armature; pinned cards are " +
      "present but their ley-line filaments are dark, threads unconnected. The Navigation Console's alien-glyph " +
      "panel reads in cold-blue stand-by — no warm-gold authentication light. The Diplomacy Table's seven " +
      "holographic projectors are off; the table is a blank brass disc. The Captain's chair shows a faint " +
      "body-impression on the cushion — someone has sat here recently — but no figure is in frame. A thin layer " +
      "of dust catches the dim light on the foreground console housings. Mood: 'this room is waiting.'",
  },
  {
    assetId: "bridge:t2",
    roomId: "bridge",
    tier: 2,
    label: "Bridge — Activated (nav online)",
    condition:
      "narrativeFlags.fast_travel_unlocked === true. The player has solved the alien-glyph nav-calibration puzzle and the navigation system is online.",
    resolution: RES,
    priority: "P0",
    dependencies: DEPS,
    prompt:
      `${BRIDGE_LAYOUT} STATE: activated. Service lamps have come up to full warm-gold. The Conspiracy Board's ` +
      "ley-line filaments are now lit — phosphor-lavender threads connecting roughly half the pinned cards, " +
      "forming visible web-segments without yet completing the full pattern. Three threads still end at the same " +
      "central blank pin. The Navigation Console's alien-glyph panel has flipped from cold-blue to warm-gold — " +
      "its primary glyph ring rotates slowly with a stable authentication halo around it; a faint star-chart " +
      "projection extends a few inches off the panel into the air. The Diplomacy Table's seven holographic " +
      "projectors have cycled on, casting silhouette-only avatars of faction representatives at their seats — " +
      "rendered as thin phosphor-lavender outlines so they read as 'present, indistinct.' The Captain's chair " +
      "armrest terminal glows. Floor compass-rose is lightly lit. No figures in frame. Mood: 'the deck has " +
      "remembered how to think.'",
  },
  {
    assetId: "bridge:t3",
    roomId: "bridge",
    tier: 3,
    label: "Bridge — Restored (war table online)",
    condition:
      "narrativeFlags.bridge_war_table_online === true. The player has pinned their first conspiracy thread and the room is fully crewed/decorated.",
    resolution: RES,
    priority: "P1",
    dependencies: DEPS,
    prompt:
      `${BRIDGE_LAYOUT} STATE: restored, war table online. The Conspiracy Board is fully threaded — every pinned ` +
      "card connected to its neighbors with luminous phosphor-lavender filaments, and the central blank pin now " +
      "carries a single hand-pinned card with an etched sigil (no rendered text). The Navigation Console projects " +
      "a full holographic star-chart sphere a foot off its surface, with traversal arcs lit between named systems. " +
      "The Diplomacy Table's holographic faction avatars have resolved from silhouette to detailed phosphor-" +
      "lavender carvings, mid-gesture as if in active negotiation. A new architectural element has appeared in the " +
      "room: a central holographic War Map projector slab descends from the ceiling between the Captain's chair " +
      "and the Conspiracy Board, casting a glowing tactical overlay onto the dais floor — territories, conflict " +
      "zones, faction borders, all in warm-gold and phosphor-lavender. Service lamps are at full brightness; the " +
      "compass-rose on the floor is fully lit. No figures in frame. Mood: 'this is now a command deck that " +
      "decides things.'",
  },
];

/* ─── ENGINEERING — three tier prompts ─── */

const ENGINEERING_PROMPTS: readonly RoomTierArtPrompt[] = [
  {
    assetId: "engineering:t0",
    roomId: "engineering",
    tier: 0,
    label: "Engineering — Dormant (bleeding capacity)",
    condition:
      "Default state on first entry: no investigative or operational flags set. The reactor is bleeding capacity and the workshop has been abandoned mid-job.",
    resolution: RES,
    priority: "P1",
    dependencies: DEPS,
    prompt:
      `${ENGINEERING_LAYOUT} STATE: dormant, bleeding. The reactor's containment lens pulses in a slow, weak ` +
      "phosphor-lavender — visibly under-driven, color-shifted toward a cold near-grey. A small warm-gold readout " +
      "panel beside the reactor housing shows a stalled capacity gauge (rendered as a partial bar shape, no " +
      "numerals). The Crafting Workbench is laid out for an unfinished job: tools fanned in the right hand, a " +
      "blank fusion socket, a few half-prepped material slugs. The Blueprint Projector is dark; only the brass " +
      "plinth itself is visible. The Research Station's twin terminals are dim with cold-blue stand-by glow. " +
      "Phosphor-green ley-line lighting along the hull ribs has dropped to a thready intermittent flicker. " +
      "Sparks visible in the foreground are absent. No figures in frame. Mood: 'someone walked away mid-fix.'",
  },
  {
    assetId: "engineering:t2",
    roomId: "engineering",
    tier: 2,
    label: "Engineering — Activated (signal booster built)",
    condition:
      "narrativeFlags.engineering_signal_booster_built === true. The player has combined the antenna fragment + amplifier circuit on the workbench (apps/client/src/game/adventureFeatures.ts INVENTORY_COMBINATIONS).",
    resolution: RES,
    priority: "P0",
    dependencies: DEPS,
    prompt:
      `${ENGINEERING_LAYOUT} STATE: activated. The reactor's containment lens has stabilised to a steady warm ` +
      "phosphor-lavender at full saturation; the capacity gauge beside it has filled to roughly two-thirds and " +
      "stopped bleeding. Phosphor-green ley-lines along the hull ribs are now solid and bright, tracing a clear " +
      "circuit pattern from reactor to workbench to Research Station. The Crafting Workbench is the dramatic " +
      "focus of the frame: the fusion socket holds a finished Signal Booster — a brass-and-copper apparatus " +
      "the size of a forearm, its central crystal arrayed with copper antenna spines, its base etched with a " +
      "phosphor-lavender sigil ring that is breathing in time with the reactor. A few fresh orange sparks " +
      "trail off the workbench surface as the build cools. The Blueprint Projector is now lit, showing a single " +
      "card-schematic in the air above its plinth. The Research Station terminals have flipped to warm-gold " +
      "active state. No figures in frame. Mood: 'a thing was made; the room is satisfied.'",
  },
  {
    assetId: "engineering:t3",
    roomId: "engineering",
    tier: 3,
    label: "Engineering — Restored (research bench online)",
    condition:
      "narrativeFlags.engineering_research_bench_online === true. The Research Station has run its first successful experiment and the room is fully crewed/decorated.",
    resolution: RES,
    priority: "P1",
    dependencies: DEPS,
    prompt:
      `${ENGINEERING_LAYOUT} STATE: restored, research bench online. The reactor's containment lens runs at full ` +
      "warm phosphor-lavender; its capacity gauge is at maximum and a thin ring of phosphor-green ley-line light " +
      "now wraps the entire reactor housing. The Crafting Workbench's fusion socket holds the finished Signal " +
      "Booster from the previous tier and now also a small cluster of brass-cased component parts — the workbench " +
      "is in active use, mid-job-after-job. The Blueprint Projector now displays three rotating card-schematics " +
      "in the air at staggered heights, each haloed by phosphor-lavender light, with a faint connecting ley-line " +
      "between them. The Research Station's twin terminals project a third holographic experiment rig in the air " +
      "above its small cubicle — a translucent lattice of test-tube shapes and arc-glyph diagrams, all running " +
      "simultaneously. Architectural addition: a fresh tool-rack panel has appeared on the back wall behind the " +
      "workbench, lined with brass-cased instruments hung in rows. Floor radial seams now glow softly in " +
      "phosphor-green. Orange sparks rise occasionally from multiple work surfaces. No figures in frame. " +
      "Mood: 'this is a room that builds.'",
  },
];

/* ─── EXPORT — full catalog ─── */

export const ROOM_TIER_ART_PROMPTS: readonly RoomTierArtPrompt[] = [
  ...BRIDGE_PROMPTS,
  ...ENGINEERING_PROMPTS,
];

/** The shared style anchor is re-exported here so generators that
 *  pull this catalog can compose the same `${ANCHOR} ${prompt}`
 *  string the Section F catalog uses, without round-tripping
 *  through roomStateArtPrompts.ts. */
export const ROOM_TIER_ART_STYLE_ANCHOR = ROOM_STATE_STYLE_ANCHOR;
