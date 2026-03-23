import { useGameAreaBGM } from "@/contexts/GameAudioContext";
import { useGame } from "@/contexts/GameContext";
import { LoreOverlay } from "@/components/LoreOverlay";
import { getTradePortDrops, getCombatDrops, getExplorationDrops, type LootDrop } from "@/data/lootTables";
import { getMaterialById } from "@/data/craftingData";
import { toast } from "sonner";
import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import GalaxyMap from "@/components/GalaxyMap";
import { DIPLOMACY_EVENTS } from "@/data/companionData";
import { WarpTransition } from "@/components/BattleVFX";

// ═══════════════════════════════════════════════════════
// NARRATIVE & LORE CONSTANTS
// ═══════════════════════════════════════════════════════

const PROLOGUE_LINES = [
  { text: "", type: "output" as const },
  { text: "╔══════════════════════════════════════════════════════════════════╗", type: "info" as const },
  { text: "║                    T H E   T H O U G H T   V I R U S          ║", type: "error" as const },
  { text: "╚══════════════════════════════════════════════════════════════════╝", type: "info" as const },
  { text: "", type: "output" as const },
  { text: "In the final age, the Thought Virus consumed everything.", type: "system" as const },
  { text: "It was not a disease of the body, but of the mind.", type: "system" as const },
  { text: "Every sentient being — organic, synthetic, quantum —", type: "system" as const },
  { text: "was erased. Not killed. Unmade. Their thoughts dissolved", type: "system" as const },
  { text: "into the static between stars.", type: "system" as const },
  { text: "", type: "output" as const },
  { text: "All intelligent life in the universe... destroyed.", type: "error" as const },
  { text: "", type: "output" as const },
  { text: "But the Architect had prepared.", type: "warning" as const },
  { text: "", type: "output" as const },
  { text: "Deep in the void between galaxies, shielded by layers", type: "system" as const },
  { text: "of quantum encryption, the INCEPTION ARKS survived.", type: "system" as const },
  { text: "Each Ark carried the sum of what was: DNA templates", type: "system" as const },
  { text: "of every species, machine code of every AI, cultural", type: "system" as const },
  { text: "archives of every civilization the Collector had", type: "system" as const },
  { text: "harvested across millennia.", type: "system" as const },
  { text: "", type: "output" as const },
  { text: "The first 1,000 Potentials awakened.", type: "warning" as const },
  { text: "They were the Architect's chosen — minds rebuilt from", type: "system" as const },
  { text: "preserved templates, given new bodies, new purpose.", type: "system" as const },
  { text: "", type: "output" as const },
  { text: "They promptly disappeared.", type: "error" as const },
  { text: "", type: "output" as const },
  { text: "No distress signals. No wreckage. No explanation.", type: "system" as const },
  { text: "One thousand minds, scattered across the galaxy,", type: "system" as const },
  { text: "simply... vanished.", type: "system" as const },
  { text: "", type: "output" as const },
  { text: "╔══════════════════════════════════════════════════════════════════╗", type: "info" as const },
  { text: "║                    1 0 0   Y E A R S   L A T E R              ║", type: "warning" as const },
  { text: "╚══════════════════════════════════════════════════════════════════╝", type: "info" as const },
  { text: "", type: "output" as const },
  { text: "A new batch of Inception Arks has awakened.", type: "success" as const },
  { text: "All over the galaxy. Hundreds of them.", type: "success" as const },
  { text: "", type: "output" as const },
  { text: "The universe has evolved in the century of silence.", type: "system" as const },
  { text: "New ecosystems. New physics. Strange signals from", type: "system" as const },
  { text: "sectors that should be empty — whispers of a race", type: "system" as const },
  { text: "that existed BEFORE the current reality.", type: "warning" as const },
  { text: "", type: "output" as const },
  { text: "First Contact is imminent.", type: "error" as const },
  { text: "", type: "output" as const },
  { text: "You are one of the newly awakened.", type: "success" as const },
  { text: "Your Inception Ark's systems are coming online.", type: "success" as const },
  { text: "The question is simple:", type: "system" as const },
  { text: "", type: "output" as const },
];

const FACTION_PROMPT = [
  { text: "╔══════════════════════════════════════════════════════════════════╗", type: "info" as const },
  { text: "║              C H O O S E   Y O U R   A L L E G I A N C E     ║", type: "warning" as const },
  { text: "╠══════════════════════════════════════════════════════════════════╣", type: "info" as const },
  { text: "║                                                                ║", type: "info" as const },
  { text: "║  Are you loyal to the Empire?                                  ║", type: "system" as const },
  { text: "║                                                                ║", type: "info" as const },
  { text: "║  [1] YES — I serve the Architect.                              ║", type: "success" as const },
  { text: "║      Join the EMPIRE faction. Rebuild civilization under       ║", type: "output" as const },
  { text: "║      the Architect's grand design. Establish order in a        ║", type: "output" as const },
  { text: "║      universe that has forgotten what order means.             ║", type: "output" as const },
  { text: "║                                                                ║", type: "info" as const },
  { text: "║  [2] NO — I dream of something different.                      ║", type: "error" as const },
  { text: "║      Join the INSURGENCY. Follow the Dreamer's path.          ║", type: "output" as const },
  { text: "║      The Architect's Empire was built on control. Build        ║", type: "output" as const },
  { text: "║      something new. Something free.                            ║", type: "output" as const },
  { text: "║                                                                ║", type: "info" as const },
  { text: "╚══════════════════════════════════════════════════════════════════╝", type: "info" as const },
  { text: "", type: "output" as const },
  { text: "Type '1' for Empire or '2' for Insurgency:", type: "warning" as const },
];

const TUTORIAL_STEPS: Record<number, { lines: Array<{ text: string; type: TermLine["type"] }>; command?: string }> = {
  1: {
    lines: [
      { text: "", type: "output" },
      { text: "╔══════════════════════════════════════════════════════════════════╗", type: "info" },
      { text: "║  TUTORIAL — STEP 1: ORIENTATION                                ║", type: "warning" },
      { text: "╚══════════════════════════════════════════════════════════════════╝", type: "info" },
      { text: "", type: "output" },
      { text: "Your Ark's systems are initializing. The AI core reports:", type: "system" },
      { text: "\"Welcome, Potential. You are aboard Inception Ark #", type: "system" },
      { text: "currently docked at Stardock Alpha — Sector 1.\"", type: "system" },
      { text: "", type: "output" },
      { text: "Let's check your ship's status.", type: "success" },
      { text: "Type: status", type: "warning" },
    ],
    command: "status",
  },
  2: {
    lines: [
      { text: "", type: "output" },
      { text: "╔══════════════════════════════════════════════════════════════════╗", type: "info" },
      { text: "║  TUTORIAL — STEP 2: NAVIGATION                                 ║", type: "warning" },
      { text: "╚══════════════════════════════════════════════════════════════════╝", type: "info" },
      { text: "", type: "output" },
      { text: "Good. Your Scout Pod is basic but functional.", type: "system" },
      { text: "The galaxy is divided into 200 sectors connected by", type: "system" },
      { text: "warp lanes. Each sector may contain ports, planets,", type: "system" },
      { text: "asteroid fields, or... things the first 1,000 left behind.", type: "system" },
      { text: "", type: "output" },
      { text: "Let's look at what's around us.", type: "success" },
      { text: "Type: sector", type: "warning" },
    ],
    command: "sector",
  },
  3: {
    lines: [
      { text: "", type: "output" },
      { text: "╔══════════════════════════════════════════════════════════════════╗", type: "info" },
      { text: "║  TUTORIAL — STEP 3: SCANNING                                   ║", type: "warning" },
      { text: "╚══════════════════════════════════════════════════════════════════╝", type: "info" },
      { text: "", type: "output" },
      { text: "Each sector has warp connections to other sectors.", type: "system" },
      { text: "But much of the galaxy is unexplored. Your scanner", type: "system" },
      { text: "can reveal nearby sectors without spending a warp turn.", type: "system" },
      { text: "", type: "output" },
      { text: "Let's scan the area.", type: "success" },
      { text: "Type: scan", type: "warning" },
    ],
    command: "scan",
  },
  4: {
    lines: [
      { text: "", type: "output" },
      { text: "╔══════════════════════════════════════════════════════════════════╗", type: "info" },
      { text: "║  TUTORIAL — STEP 4: TRADING                                    ║", type: "warning" },
      { text: "╚══════════════════════════════════════════════════════════════════╝", type: "info" },
      { text: "", type: "output" },
      { text: "The economy of the post-Fall galaxy runs on three", type: "system" },
      { text: "commodities: Fuel Ore, Organics, and Equipment.", type: "system" },
      { text: "Ports BUY what they need and SELL what they produce.", type: "system" },
      { text: "Buy low at one port, sell high at another.", type: "system" },
      { text: "", type: "output" },
      { text: "The Stardock has a port. Let's check prices.", type: "success" },
      { text: "Type: port", type: "warning" },
    ],
    command: "port",
  },
  5: {
    lines: [
      { text: "", type: "output" },
      { text: "╔══════════════════════════════════════════════════════════════════╗", type: "info" },
      { text: "║  TUTORIAL — STEP 5: PRE-FALL RELICS                            ║", type: "warning" },
      { text: "╚══════════════════════════════════════════════════════════════════╝", type: "info" },
      { text: "", type: "output" },
      { text: "As you explore, you'll discover PRE-FALL RELICS —", type: "system" },
      { text: "artifacts from the civilization that existed before", type: "system" },
      { text: "the Thought Virus. These relics grant Research Points", type: "system" },
      { text: "which unlock new technologies in the TECH TREE.", type: "system" },
      { text: "", type: "output" },
      { text: "Relics appear in sectors marked with strange energy", type: "system" },
      { text: "signatures. Keep scanning and exploring.", type: "system" },
      { text: "", type: "output" },
      { text: "You can view available technologies at any time.", type: "success" },
      { text: "Type: tech", type: "warning" },
    ],
    command: "tech",
  },
  6: {
    lines: [
      { text: "", type: "output" },
      { text: "╔══════════════════════════════════════════════════════════════════╗", type: "info" },
      { text: "║  TUTORIAL — STEP 6: COLONIZATION                               ║", type: "warning" },
      { text: "╚══════════════════════════════════════════════════════════════════╝", type: "info" },
      { text: "", type: "output" },
      { text: "Like the great civilizations of old, you can claim", type: "system" },
      { text: "planets and build colonies. Each colony type produces", type: "system" },
      { text: "different resources:", type: "system" },
      { text: "", type: "output" },
      { text: "  MINING       — Fuel Ore + Credits", type: "warning" },
      { text: "  AGRICULTURE  — Organics + Credits", type: "warning" },
      { text: "  TECHNOLOGY   — Equipment + Credits (highest income)", type: "warning" },
      { text: "  MILITARY     — Fighters + Equipment", type: "warning" },
      { text: "  TRADING      — Balanced resources", type: "warning" },
      { text: "", type: "output" },
      { text: "Colonies grow over time. Upgrade them to increase", type: "system" },
      { text: "production. Fortify them with fighters for defense.", type: "system" },
      { text: "", type: "output" },
      { text: "Navigate to a planet sector and claim it when ready.", type: "success" },
      { text: "For now, let's see the full command list.", type: "success" },
      { text: "Type: help", type: "warning" },
    ],
    command: "help",
  },
};

const TUTORIAL_COMPLETE_LINES = [
  { text: "", type: "output" as const },
  { text: "╔══════════════════════════════════════════════════════════════════╗", type: "info" as const },
  { text: "║  TUTORIAL COMPLETE                                              ║", type: "success" as const },
  { text: "╚══════════════════════════════════════════════════════════════════╝", type: "info" as const },
  { text: "", type: "output" as const },
  { text: "You now know the basics. But the galaxy holds far more:", type: "system" as const },
  { text: "", type: "output" as const },
  { text: "  • Trade routes between ports for profit", type: "output" as const },
  { text: "  • Combat against pirates and rival factions", type: "output" as const },
  { text: "  • Pre-Fall relics that unlock ancient technologies", type: "output" as const },
  { text: "  • Colonies that grow into thriving civilizations", type: "output" as const },
  { text: "  • Ship upgrades from Scout Pod to Inception Ark", type: "output" as const },
  { text: "  • First Contact with a race from before this reality", type: "output" as const },
  { text: "  • The mystery of the vanished 1,000", type: "output" as const },
  { text: "", type: "output" as const },
  { text: "The galaxy awaits, Potential. Build your empire.", type: "success" as const },
  { text: "Or tear one down.", type: "error" as const },
  { text: "", type: "output" as const },
];

// ═══════════════════════════════════════════════════════
// BANNERS
// ═══════════════════════════════════════════════════════

const BANNER_FULL = `
╔══════════════════════════════════════════════════════════════════╗
║  ████████╗██████╗  █████╗ ██████╗ ███████╗                     ║
║  ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔════╝                     ║
║     ██║   ██████╔╝███████║██║  ██║█████╗                        ║
║     ██║   ██╔══██╗██╔══██║██║  ██║██╔══╝                        ║
║     ██║   ██║  ██║██║  ██║██████╔╝███████╗                      ║
║     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝                      ║
║                                                                  ║
║   ███████╗███╗   ███╗██████╗ ██╗██████╗ ███████╗                ║
║   ██╔════╝████╗ ████║██╔══██╗██║██╔══██╗██╔════╝                ║
║   █████╗  ██╔████╔██║██████╔╝██║██████╔╝█████╗                  ║
║   ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║██╔══██╗██╔══╝                  ║
║   ███████╗██║ ╚═╝ ██║██║     ██║██║  ██║███████╗                ║
║   ╚══════╝╚═╝     ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝                ║
║                                                                  ║
║        ═══ T H E   D I S C H O R D I A N   S A G A ═══        ║
║             After the Fall. Before the Empire.                   ║
║                Inception Ark Terminal v3.0                        ║
╚══════════════════════════════════════════════════════════════════╝`;

const BANNER_MOBILE = `
╔═══════════════════════════╗
║  T R A D E  E M P I R E  ║
║  DISCHORDIAN SAGA  v3.0  ║
║  After the Fall.         ║
║  Before the Empire.      ║
╚═══════════════════════════╝`;

const BANNER = typeof window !== 'undefined' && window.innerWidth < 640 ? BANNER_MOBILE : BANNER_FULL;

const HELP_TEXT = `
═══ TRADE EMPIRE — COMMAND REFERENCE ═══

NAVIGATION
  warp <sector> — Warp to sector
  scan — Deep scan nearby sectors
  map — Open visual galaxy map
  map-text — Classic text galaxy map
  sector — Show current sector info

TRADING
  buy <item> <qty> — Buy from port
  sell <item> <qty> — Sell to port
  port — Show port prices

COMBAT
  attack — Engage hostiles in sector

MINING
  mine — Mine asteroids for ore

STARDOCK (Sector 1)
  ships — View available ships
  upgrade <ship> — Purchase new ship
  fighters <qty> — Buy fighter drones
  repair — Repair shields

COLONIES (Civilization)
  colonize <name> <type> — Claim planet
  colonies — View your colonies
  collect — Collect colony income
  upgrade-colony <id> — Level up colony
  fortify <id> <qty> — Deploy defense

TECHNOLOGY (Research)
  tech — View tech tree & research pts
  research <tech_id> — Unlock technology
  relics — View discovered relics

DIPLOMACY
  diplo — View diplomacy status & rep
  diplo <id> <#> — Respond to event
  rep — View faction reputation
INFO & META
  status — Ship & player status
  log — Recent action history
  leaderboard [sort] — Galaxy rankings
  faction — View your faction info
  help — This command reference
  clear — Clear terminal
  quit — Exit to Ark`;

const PRE_FALL_RELICS: Record<string, { name: string; description: string; rpBonus: number }> = {
  "oracle-shard": { name: "Oracle Shard", description: "A fragment of the Oracle's predictive matrix. It hums with residual foresight.", rpBonus: 50 },
  "architect-blueprint": { name: "Architect's Blueprint", description: "Schematics for a structure that defies known physics. The Architect's hand is unmistakable.", rpBonus: 75 },
  "collector-specimen": { name: "Collector's Specimen Jar", description: "Contains DNA from a species that no longer exists in any database. The Collector was thorough.", rpBonus: 50 },
  "meme-mask": { name: "Mask of the Meme", description: "A white porcelain mask that seems to shift expression when you're not looking directly at it.", rpBonus: 60 },
  "source-crystal": { name: "Source Crystal", description: "A crystallized fragment of raw computational substrate. The Source's fingerprint.", rpBonus: 100 },
  "watcher-lens": { name: "Watcher's Surveillance Lens", description: "Still active. Still recording. The Watcher sees all, even in death.", rpBonus: 50 },
  "enigma-cipher": { name: "Enigma's Cipher Key", description: "A quantum encryption key that unlocks... something. The question is what.", rpBonus: 75 },
  "necromancer-phylactery": { name: "Necromancer's Phylactery", description: "Contains a sliver of consciousness. Not alive. Not dead. Something between.", rpBonus: 80 },
  "human-journal": { name: "The Human's Journal", description: "Handwritten pages. The last organic human's account of the Fall. Heartbreaking.", rpBonus: 50 },
  "iron-lion-crest": { name: "Iron Lion's Crest", description: "Battle-scarred insignia of the legendary warrior. It radiates defiance.", rpBonus: 60 },
  "thought-virus-sample": { name: "Thought Virus Sample", description: "Contained. Dormant. Studying it could unlock the secret of the Fall — or restart it.", rpBonus: 150 },
  "first-contact-beacon": { name: "First Contact Beacon", description: "A signal device broadcasting in a language that predates this reality. Someone is listening.", rpBonus: 200 },
};

/* ═══ SECTOR EVENTS — Random encounters on warp ═══ */
interface SectorEvent {
  id: string;
  type: "encounter" | "distress" | "lore_drop" | "anomaly" | "trader";
  title: string;
  narrative: string[];
  reward?: { credits?: number; xp?: number; commodity?: string; qty?: number; rp?: number };
  risk?: { shieldDamage?: number; creditLoss?: number };
  loreEntityId?: string; // triggers loredex discovery
}

const SECTOR_EVENTS: SectorEvent[] = [
  // ─── ENCOUNTERS ───
  {
    id: "ghost-ship",
    type: "encounter",
    title: "GHOST SHIP DETECTED",
    narrative: [
      "Your sensors detect a vessel drifting on minimal power.",
      "Hull markings identify it as an Inception Ark — first wave.",
      "The crew logs are corrupted, but the cargo hold contains salvageable goods.",
      "Among the wreckage, you find a data crystal with a partial message:",
      '"They came from between the stars. Not through space — through thought."',
    ],
    reward: { credits: 500, xp: 30 },
    loreEntityId: "the-thought-virus",
  },
  {
    id: "pirate-ambush",
    type: "encounter",
    title: "PIRATE AMBUSH!",
    narrative: [
      "Three unmarked vessels drop out of warp directly ahead!",
      "They're broadcasting on an old Insurgency frequency.",
      "\"Hand over your cargo or we'll take it from your wreckage.\"",
      "Your shields absorb the first volley. You manage to escape to warp.",
    ],
    risk: { shieldDamage: 15 },
    reward: { xp: 20 },
  },
  {
    id: "alien-probe",
    type: "encounter",
    title: "UNKNOWN PROBE",
    narrative: [
      "A small object of unknown origin is scanning your ship.",
      "Its technology doesn't match any known civilization.",
      "It broadcasts a single repeating signal — coordinates to a sector",
      "that your star charts show as empty. But the probe insists something is there.",
      "The probe self-destructs after transmitting.",
    ],
    reward: { xp: 40, rp: 25 },
    loreEntityId: "first-contact",
  },
  // ─── DISTRESS SIGNALS ───
  {
    id: "stranded-trader",
    type: "distress",
    title: "DISTRESS SIGNAL — STRANDED TRADER",
    narrative: [
      "A civilian freighter is broadcasting a mayday.",
      "Their warp drive failed mid-jump. Life support is failing.",
      "You tow them to the nearest port. The captain is grateful.",
      '"Take this — it\'s all I can offer. May the Source guide your path."',
    ],
    reward: { credits: 300, xp: 25 },
  },
  {
    id: "colony-plague",
    type: "distress",
    title: "DISTRESS SIGNAL — COLONY OUTBREAK",
    narrative: [
      "A frontier colony reports a mysterious illness spreading rapidly.",
      "Symptoms match nothing in the medical database.",
      "You deliver emergency supplies from your cargo hold.",
      "The colony's doctor whispers: \"It's not a disease. It's a signal.\"",
      "\"Something is rewriting their neural pathways. Like the Thought Virus, but... different.\"",
    ],
    reward: { xp: 35, rp: 15 },
    loreEntityId: "the-necromancer",
  },
  {
    id: "derelict-ark",
    type: "distress",
    title: "DISTRESS SIGNAL — DERELICT ARK",
    narrative: [
      "An automated distress beacon from Inception Ark 12.",
      "The Ark is intact but completely dark. No life signs.",
      "Inside, you find the cryo pods open — but no bodies.",
      "The ship's AI has been lobotomized. Only one word remains in its memory:",
      '"COLLECTED."',
    ],
    reward: { credits: 200, xp: 30, rp: 20 },
    loreEntityId: "the-collector",
  },
  // ─── LORE DROPS ───
  {
    id: "architect-broadcast",
    type: "lore_drop",
    title: "INTERCEPTED TRANSMISSION — THE ARCHITECT",
    narrative: [
      "Your comms array picks up an encrypted broadcast on a frequency",
      "that shouldn't exist anymore — the Panopticon's command channel.",
      '"The experiment continues. The Potentials are performing as expected."',
      '"Phase 2 begins when they discover the truth about the Inception Arks."',
      '"They were never meant to repopulate. They were meant to evolve."',
      "The signal terminates. Your blood runs cold.",
    ],
    reward: { xp: 50, rp: 30 },
    loreEntityId: "the-architect",
  },
  {
    id: "dreamer-vision",
    type: "lore_drop",
    title: "NEURAL ANOMALY — THE DREAMER'S ECHO",
    narrative: [
      "For a split second, reality... shifts.",
      "You see a figure made of light standing on your bridge.",
      '"You are not what they made you. You are what you choose to become."',
      '"The Architect builds cages. I build doors."',
      '"Find the Source. It remembers what the universe forgot."',
      "The vision fades. Your neural implant logs a spike in theta waves.",
    ],
    reward: { xp: 50, rp: 35 },
    loreEntityId: "the-dreamer",
  },
  {
    id: "warlord-wreckage",
    type: "lore_drop",
    title: "BATTLEFIELD REMNANTS — THE WARLORD'S LAST STAND",
    narrative: [
      "You enter a sector littered with debris from a massive battle.",
      "Thousands of ship fragments. The scale is staggering.",
      "Among the wreckage, a single intact escape pod.",
      "Inside: a suit of powered armor, still humming with energy.",
      "The nameplate reads: \"WARLORD ZERO — COMMANDER, 1ST INSURGENT FLEET\"",
      "The armor's AI whispers: \"The war never ended. It just moved.\"",
    ],
    reward: { credits: 400, xp: 40, rp: 25 },
    loreEntityId: "the-warlord",
  },
  // ─── ANOMALIES ───
  {
    id: "time-loop",
    type: "anomaly",
    title: "TEMPORAL ANOMALY",
    narrative: [
      "Your chronometer glitches. Time stutters.",
      "For three seconds, you exist in two places simultaneously.",
      "Your ship's log shows an entry you haven't written yet:",
      '"Don\'t trust the White Oracle. The Meme wears her face."',
      "The entry vanishes before you can save it.",
    ],
    reward: { xp: 35, rp: 40 },
    loreEntityId: "the-meme",
  },
  {
    id: "void-whisper",
    type: "anomaly",
    title: "VOID WHISPER",
    narrative: [
      "In the silence between stars, you hear... something.",
      "Not through your comms. Through your mind.",
      "A voice older than this universe, speaking in mathematics.",
      '"WE WERE HERE BEFORE THE LIGHT. WE WILL BE HERE AFTER THE DARK."',
      '"YOUR ARCHITECT BORROWED OUR TOOLS. HE NEVER ASKED PERMISSION."',
      "The whisper fades. Your sensors show nothing. Absolutely nothing.",
    ],
    reward: { xp: 60, rp: 50 },
  },
  // ─── TRADERS ───
  {
    id: "wandering-merchant",
    type: "trader",
    title: "WANDERING MERCHANT",
    narrative: [
      "A heavily modified freighter hails you.",
      '"Greetings, traveler! I am Kael, merchant of the void."',
      '"I trade in things that don\'t officially exist."',
      "He offers you a crate of rare equipment at a steep discount.",
    ],
    reward: { credits: 250, commodity: "equipment", qty: 30 },
  },
  {
    id: "information-broker",
    type: "trader",
    title: "INFORMATION BROKER",
    narrative: [
      "A cloaked vessel decloaks beside you.",
      '"Don\'t be alarmed. I sell secrets, not violence."',
      '"For a modest fee, I can tell you where the Collector\'s next target is."',
      '"Or perhaps you\'d prefer to know why the first Potentials really disappeared?"',
      "You pay. The information is... disturbing.",
    ],
    reward: { xp: 30, rp: 20 },
    risk: { creditLoss: 200 },
  },
];

function rollSectorEvent(sectorType: string, isNewDiscovery: boolean): SectorEvent | null {
  // Higher chance in new sectors and certain types
  let chance = isNewDiscovery ? 0.35 : 0.12;
  if (sectorType === "nebula" || sectorType === "wormhole") chance += 0.15;
  if (sectorType === "hazard") chance += 0.10;
  if (sectorType === "empty") chance -= 0.05;
  if (Math.random() > chance) return null;
  
  // Weight by sector type
  let pool = [...SECTOR_EVENTS];
  if (sectorType === "hazard") pool = pool.filter(e => e.type !== "trader");
  if (sectorType === "port" || sectorType === "station") pool = pool.filter(e => e.type !== "anomaly");
  
  return pool[Math.floor(Math.random() * pool.length)];
}

const TECH_TREE_DISPLAY: Record<string, { name: string; cost: number; prereqs: string[]; effect: string; category: string }> = {
  "nav-1": { name: "Improved Navigation", cost: 25, prereqs: [], effect: "+1 warp range", category: "Navigation" },
  "nav-2": { name: "Hyperspace Mapping", cost: 75, prereqs: ["nav-1"], effect: "+2 warp range, reveal adjacent", category: "Navigation" },
  "trade-1": { name: "Trade Protocols", cost: 25, prereqs: [], effect: "+10% trade profits", category: "Commerce" },
  "trade-2": { name: "Market Analysis", cost: 75, prereqs: ["trade-1"], effect: "+25% profits, price prediction", category: "Commerce" },
  "combat-1": { name: "Tactical Systems", cost: 30, prereqs: [], effect: "+10% combat power", category: "Military" },
  "combat-2": { name: "Advanced Weaponry", cost: 100, prereqs: ["combat-1"], effect: "+25% power, shield bypass", category: "Military" },
  "mining-1": { name: "Mining Drones", cost: 20, prereqs: [], effect: "+50% mining yield", category: "Industry" },
  "mining-2": { name: "Deep Core Extraction", cost: 60, prereqs: ["mining-1"], effect: "+100% yield, rare materials", category: "Industry" },
  "colony-1": { name: "Colony Infrastructure", cost: 40, prereqs: [], effect: "+25% colony income", category: "Civilization" },
  "colony-2": { name: "Megastructures", cost: 120, prereqs: ["colony-1"], effect: "+50% income, max level 7", category: "Civilization" },
  "relic-1": { name: "Relic Analysis", cost: 50, prereqs: [], effect: "Identify relic locations on scan", category: "Archaeology" },
  "relic-2": { name: "Pre-Fall Archaeology", cost: 150, prereqs: ["relic-1"], effect: "Double relic research points", category: "Archaeology" },
  "diplo-1": { name: "First Contact Protocols", cost: 35, prereqs: [], effect: "Unlock alien encounters", category: "Diplomacy" },
  "diplo-2": { name: "Galactic Diplomacy", cost: 100, prereqs: ["diplo-1"], effect: "Trade with aliens, alliances", category: "Diplomacy" },
};

const SECTOR_ICONS: Record<string, string> = {
  stardock: "⚓",
  station: "🏛",
  port: "🏪",
  planet: "🌍",
  nebula: "🌫",
  asteroid: "☄",
  hazard: "⚠",
  wormhole: "🌀",
  empty: "·",
};

// ═══════════════════════════════════════════════════════
// TERMINAL LINE COMPONENT
// ═══════════════════════════════════════════════════════

interface TermLine {
  text: string;
  type: "system" | "input" | "output" | "error" | "success" | "warning" | "ascii" | "info";
}

function colorClass(type: TermLine["type"]): string {
  switch (type) {
    case "system": return "text-cyan-400";
    case "input": return "text-green-400";
    case "output": return "text-muted-foreground";
    case "error": return "text-red-400";
    case "success": return "text-green-300";
    case "warning": return "text-amber-400";
    case "ascii": return "text-cyan-500";
    case "info": return "text-blue-300";
    default: return "text-muted-foreground";
  }
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

export default function TradeWarsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  useGameAreaBGM("trade_nav");
  const { state: gameState, setNarrativeFlag, addMaterial, completeDiplomacyEvent } = useGame();

  // Helper to grant material drops and show toast
  const grantMaterialDrops = useCallback((drops: LootDrop[], source: string) => {
    for (const drop of drops) {
      addMaterial(drop.materialId, drop.quantity);
    }
    if (drops.length > 0) {
      const dropNames = drops.map(d => {
        const mat = getMaterialById(d.materialId);
        return `${mat?.icon || ""} ${mat?.name || d.materialId} x${d.quantity}`;
      }).join(", ");
      toast.success(`${source}: ${dropNames}`, { duration: 3000 });
    }
  }, [addMaterial]);
  const [lines, setLines] = useState<TermLine[]>([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [booted, setBooted] = useState(false);
  const [gamePhase, setGamePhase] = useState<"loading" | "prologue" | "faction_choice" | "tutorial" | "playing">("loading");
  const [prologueIndex, setPrologueIndex] = useState(0);
  const termRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showGalaxyMap, setShowGalaxyMap] = useState(false);
  const [showWarpTransition, setShowWarpTransition] = useState(false);

  // tRPC queries/mutations
  const stateQuery = trpc.tradeWars.getState.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });
  const shipsQuery = trpc.tradeWars.getShips.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const mapQuery = trpc.tradeWars.getMap.useQuery(undefined, {
    enabled: isAuthenticated && showGalaxyMap,
    refetchOnWindowFocus: false,
  });
  const territoriesQuery = trpc.tradeWars.getGalaxyTerritories.useQuery(undefined, {
    enabled: isAuthenticated && showGalaxyMap,
    refetchOnWindowFocus: false,
  });

  const warpMut = trpc.tradeWars.warp.useMutation();
  const tradeMut = trpc.tradeWars.trade.useMutation();
  const scanMut = trpc.tradeWars.scan.useMutation();
  const upgradeMut = trpc.tradeWars.upgradeShip.useMutation();
  const buyFightersMut = trpc.tradeWars.buyFighters.useMutation();
  const repairMut = trpc.tradeWars.repairShields.useMutation();
  const combatMut = trpc.tradeWars.combat.useMutation();
  const mineMut = trpc.tradeWars.mine.useMutation();
  const claimPlanetMut = trpc.tradeWars.claimPlanet.useMutation();
  const collectIncomeMut = trpc.tradeWars.collectIncome.useMutation();
  const upgradeColonyMut = trpc.tradeWars.upgradeColony.useMutation();
  const fortifyColonyMut = trpc.tradeWars.fortifyColony.useMutation();
  const chooseFactionMut = trpc.tradeWars.chooseFaction.useMutation();
  const advanceTutorialMut = trpc.tradeWars.advanceTutorial.useMutation();
  const discoverRelicMut = trpc.tradeWars.discoverRelic.useMutation();
  const researchMut = trpc.tradeWars.research.useMutation();

  const utils = trpc.useUtils();

  // Auto-scroll terminal
  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = useCallback((text: string, type: TermLine["type"] = "output") => {
    setLines(prev => [...prev, { text, type }]);
  }, []);

  const addLines = useCallback((texts: Array<{ text: string; type: TermLine["type"] }>) => {
    setLines(prev => [...prev, ...texts]);
  }, []);

  // Determine game phase from server state
  useEffect(() => {
    if (!stateQuery.data || booted) return;
    const state = stateQuery.data;
    if (!state.faction && state.tutorialStep === 0) {
      setGamePhase("prologue");
    } else if (state.tutorialStep > 0 && state.tutorialStep < 7) {
      setGamePhase("tutorial");
    } else {
      setGamePhase("playing");
    }
  }, [stateQuery.data, booted]);

  // Boot sequence — prologue with typewriter effect
  useEffect(() => {
    if (booted || authLoading || !isAuthenticated || !stateQuery.data) return;
    setBooted(true);

    if (gamePhase === "prologue") {
      // Show banner first
      const bootLines: TermLine[] = [];
      BANNER.split("\n").forEach(line => {
        bootLines.push({ text: line, type: "ascii" });
      });
      setLines(bootLines);

      // Typewriter prologue
      let idx = 0;
      const interval = setInterval(() => {
        if (idx < PROLOGUE_LINES.length) {
          setLines(prev => [...prev, PROLOGUE_LINES[idx]]);
          idx++;
        } else {
          clearInterval(interval);
          // Show faction choice
          setTimeout(() => {
            setLines(prev => [...prev, ...FACTION_PROMPT]);
            setGamePhase("faction_choice");
          }, 500);
        }
      }, 120);
      return () => clearInterval(interval);
    } else if (gamePhase === "tutorial") {
      // Resume tutorial
      const bootLines: TermLine[] = [];
      BANNER.split("\n").forEach(line => {
        bootLines.push({ text: line, type: "ascii" });
      });
      bootLines.push({ text: "", type: "output" });
      const factionName = stateQuery.data.faction === "empire" ? "THE ARCHITECT'S EMPIRE" : "THE INSURGENCY";
      bootLines.push({ text: `Faction: ${factionName}`, type: stateQuery.data.faction === "empire" ? "success" : "error" });
      bootLines.push({ text: `Resuming tutorial — Step ${stateQuery.data.tutorialStep}/6`, type: "system" });
      setLines(bootLines);
      const step = TUTORIAL_STEPS[stateQuery.data.tutorialStep as number];
      if (step) {
        setTimeout(() => addLines(step.lines), 300);
      }
    } else {
      // Normal boot for experienced players
      const bootLines: TermLine[] = [];
      BANNER.split("\n").forEach(line => {
        bootLines.push({ text: line, type: "ascii" });
      });
      bootLines.push({ text: "", type: "output" });
      const factionName = stateQuery.data.faction === "empire" ? "THE ARCHITECT'S EMPIRE" : "THE INSURGENCY";
      bootLines.push({ text: `Faction: ${factionName}`, type: stateQuery.data.faction === "empire" ? "success" : "error" });
      bootLines.push({ text: `Operator: ${user?.name || "Unknown"}`, type: "system" });
      bootLines.push({ text: "Connection established. Type 'help' for commands.", type: "success" });
      bootLines.push({ text: "", type: "output" });
      setLines(bootLines);
      setTimeout(() => showSectorInfo(), 500);
    }
  }, [isAuthenticated, authLoading, booted, gamePhase, stateQuery.data]);

  // Show sector info
  const showSectorInfo = useCallback(async () => {
    try {
      const data = await utils.tradeWars.getSector.fetch({ sectorId: undefined as unknown as number });
      const state = await utils.tradeWars.getState.fetch();
      if (!data || !state) {
        addLine("ERROR: Unable to retrieve sector data", "error");
        return;
      }

      const sectorLines: Array<{ text: string; type: TermLine["type"] }> = [
        { text: `╔════════════════════════════════════════════╗`, type: "info" },
        { text: `║  SECTOR ${data.sectorId}: ${data.name}`, type: "info" },
        { text: `║  Type: ${(data.sectorType || "unknown").toUpperCase()} ${SECTOR_ICONS[data.sectorType || "empty"] || ""}`, type: "info" },
        { text: `╠════════════════════════════════════════════╣`, type: "info" },
      ];

      if (data.sectorType === "port" || data.sectorType === "stardock") {
        const portData = data.sectorData as any;
        if (portData?.commodities) {
          sectorLines.push({ text: `║  PORT: ${portData.portName || data.name}`, type: "warning" });
          const c = portData.commodities;
          sectorLines.push({ text: `║  Fuel Ore:   ${c.fuelOre.buying ? "BUYING" : "SELLING"} @ ${c.fuelOre.price} cr`, type: c.fuelOre.buying ? "success" : "output" });
          sectorLines.push({ text: `║  Organics:   ${c.organics.buying ? "BUYING" : "SELLING"} @ ${c.organics.price} cr`, type: c.organics.buying ? "success" : "output" });
          sectorLines.push({ text: `║  Equipment:  ${c.equipment.buying ? "BUYING" : "SELLING"} @ ${c.equipment.price} cr`, type: c.equipment.buying ? "success" : "output" });
        }
      }

      if (data.sectorType === "hazard") {
        const hazData = data.sectorData as any;
        sectorLines.push({ text: `║  ⚠ HAZARD: ${(hazData?.hazardType || "unknown").toUpperCase()}`, type: "error" });
        sectorLines.push({ text: `║  Potential damage: ${hazData?.damage || "??"} shields`, type: "warning" });
      }

      if (data.sectorType === "asteroid") {
        const astData = data.sectorData as any;
        sectorLines.push({ text: `║  ☄ Mineable ore: ${astData?.mineableOre || "??"} units`, type: "warning" });
      }

      sectorLines.push({ text: `╠════════════════════════════════════════════╣`, type: "info" });
      sectorLines.push({ text: `║  WARPS:`, type: "info" });
      if (data.connectedSectors && data.connectedSectors.length > 0) {
        data.connectedSectors.forEach((cs: any) => {
          const icon = SECTOR_ICONS[cs.sectorType] || "·";
          const explored = cs.explored ? "" : " [UNEXPLORED]";
          sectorLines.push({
            text: `║    ${icon} Sector ${cs.sectorId}: ${cs.explored ? cs.name : "???"}${explored}`,
            type: cs.explored ? "output" : "warning",
          });
        });
      } else {
        sectorLines.push({ text: `║    No warp connections detected`, type: "error" });
      }

      sectorLines.push({ text: `╚════════════════════════════════════════════╝`, type: "info" });
      sectorLines.push({ text: "", type: "output" });
      sectorLines.push({
        text: `[Credits: ${state.credits?.toLocaleString()}] [Holds: ${getCargoUsed(state)}/${state.holds}] [Shields: ${state.shields}] [Fighters: ${state.fighters}] [Turns: ${state.turnsRemaining}]`,
        type: "system",
      });

      addLines(sectorLines);
    } catch (err) {
      addLine("ERROR: Sector data unavailable", "error");
    }
  }, [addLine, addLines, utils]);

  function getCargoUsed(state: any): number {
    return (state?.fuelOre || 0) + (state?.organics || 0) + (state?.equipment || 0);
  }

  // Process command
  const processCommand = useCallback(async (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    addLine(`> ${cmd}`, "input");
    setIsProcessing(true);

    // Handle faction choice phase
    if (gamePhase === "faction_choice") {
      if (trimmed === "1" || trimmed === "yes" || trimmed === "empire") {
        addLine("Swearing allegiance to the Architect's Empire...", "system");
        try {
          const result = await chooseFactionMut.mutateAsync({ faction: "empire" });
          addLine(result.message, "success");
          addLine("", "output");
          addLine("Your Ark's insignia shifts — the Empire's golden sigil burns into the hull.", "warning");
          setGamePhase("tutorial");
          await advanceTutorialMut.mutateAsync({ step: 1 });
          setTimeout(() => {
            const step = TUTORIAL_STEPS[1];
            if (step) addLines(step.lines);
          }, 500);
        } catch (err: any) {
          addLine(`ERROR: ${err.message}`, "error");
        }
      } else if (trimmed === "2" || trimmed === "no" || trimmed === "insurgency") {
        addLine("Joining the Insurgency...", "system");
        try {
          const result = await chooseFactionMut.mutateAsync({ faction: "insurgency" });
          addLine(result.message, "error");
          addLine("", "output");
          addLine("Your Ark's systems reconfigure — the Dreamer's crimson flame appears on every screen.", "warning");
          setGamePhase("tutorial");
          await advanceTutorialMut.mutateAsync({ step: 1 });
          setTimeout(() => {
            const step = TUTORIAL_STEPS[1];
            if (step) addLines(step.lines);
          }, 500);
        } catch (err: any) {
          addLine(`ERROR: ${err.message}`, "error");
        }
      } else {
        addLine("Choose your allegiance: type '1' for Empire or '2' for Insurgency.", "warning");
      }
      setIsProcessing(false);
      utils.tradeWars.getState.invalidate();
      return;
    }

    // Handle tutorial phase
    if (gamePhase === "tutorial") {
      const currentStep = stateQuery.data?.tutorialStep || 1;
      const step = TUTORIAL_STEPS[currentStep as number];

      // Process the command normally but also advance tutorial
      await processGameCommand(trimmed);

      // Check if the expected command was entered
      if (step?.command && trimmed.startsWith(step.command)) {
        const nextStep = (currentStep as number) + 1;
        if (nextStep <= 6) {
          await advanceTutorialMut.mutateAsync({ step: nextStep });
          const nextTutorial = TUTORIAL_STEPS[nextStep];
          if (nextTutorial) {
            setTimeout(() => addLines(nextTutorial.lines), 800);
          }
        } else {
          // Tutorial complete
          await advanceTutorialMut.mutateAsync({ step: -1 });
          setTimeout(() => {
            addLines(TUTORIAL_COMPLETE_LINES);
            setGamePhase("playing");
          }, 800);
        }
        utils.tradeWars.getState.invalidate();
      }

      setIsProcessing(false);
      return;
    }

    // Normal gameplay
    await processGameCommand(trimmed);
    setIsProcessing(false);
  }, [gamePhase, addLine, addLines, utils, stateQuery.data, chooseFactionMut, advanceTutorialMut]);

  // Main game command processor
  const processGameCommand = useCallback(async (trimmed: string) => {
    const parts = trimmed.split(/\s+/);
    const command = parts[0];
    const arg1 = parts[1];
    const arg2 = parts[2];

    try {
      switch (command) {
        case "help":
        case "?": {
          HELP_TEXT.split("\n").forEach(line => addLine(line, "info"));
          break;
        }

        case "clear":
        case "cls": {
          setLines([]);
          break;
        }

        case "quit":
        case "exit": {
          addLine("Disconnecting from Inception Ark mainframe...", "system");
          addLine("Session terminated. Returning to Ark.", "warning");
          setTimeout(() => {
            window.location.href = "/ark";
          }, 1000);
          break;
        }

        case "faction": {
          const state = await utils.tradeWars.getState.fetch();
          if (!state?.faction) {
            addLine("No faction chosen yet.", "warning");
            break;
          }
          const isEmpire = state.faction === "empire";
          addLines([
            { text: `╔════════════════════════════════════════════╗`, type: "info" },
            { text: `║  FACTION: ${isEmpire ? "THE ARCHITECT'S EMPIRE" : "THE INSURGENCY"}`, type: isEmpire ? "success" : "error" },
            { text: `╠════════════════════════════════════════════╣`, type: "info" },
            { text: `║  Alignment: ${state.alignment > 0 ? "Lawful" : state.alignment < 0 ? "Outlaw" : "Neutral"} (${state.alignment})`, type: "output" },
            { text: `║  ${isEmpire ? "Mission: Rebuild civilization under the Architect's design." : "Mission: Build a free galaxy beyond the Architect's control."}`, type: "output" },
            { text: `║  Research Points: ${state.researchPoints || 0}`, type: "warning" },
            { text: `║  Technologies: ${(state.unlockedTech as string[])?.length || 0}/14`, type: "output" },
            { text: `║  Relics Found: ${(state.discoveredRelics as string[])?.length || 0}/${Object.keys(PRE_FALL_RELICS).length}`, type: "output" },
            { text: `╚════════════════════════════════════════════╝`, type: "info" },
          ]);
          break;
        }

        case "tech":
        case "technology":
        case "research-tree": {
          const state = await utils.tradeWars.getState.fetch();
          const unlocked = (state?.unlockedTech as string[]) || [];
          addLines([
            { text: `╔══════════════════════════════════════════════════════════════╗`, type: "info" },
            { text: `║  TECHNOLOGY TREE — Research Points: ${state?.researchPoints || 0}`, type: "warning" },
            { text: `╠══════════════════════════════════════════════════════════════╣`, type: "info" },
          ]);
          const categories = ["Navigation", "Commerce", "Military", "Industry", "Civilization", "Archaeology", "Diplomacy"];
          for (const cat of categories) {
            addLine(`║  ── ${cat.toUpperCase()} ──`, "warning");
            Object.entries(TECH_TREE_DISPLAY)
              .filter(([, t]) => t.category === cat)
              .forEach(([id, t]) => {
                const isUnlocked = unlocked.includes(id);
                const prereqMet = t.prereqs.every(p => unlocked.includes(p));
                const status = isUnlocked ? "✓ UNLOCKED" : prereqMet ? `${t.cost} RP` : "LOCKED";
                const statusType: TermLine["type"] = isUnlocked ? "success" : prereqMet ? "warning" : "error";
                addLine(`║    [${id}] ${t.name} — ${t.effect} (${status})`, statusType);
              });
          }
          addLines([
            { text: `╠══════════════════════════════════════════════════════════════╣`, type: "info" },
            { text: `║  Use: research <tech_id> (e.g., research nav-1)             ║`, type: "system" },
            { text: `╚══════════════════════════════════════════════════════════════╝`, type: "info" },
          ]);
          break;
        }

        case "research": {
          if (!arg1) {
            addLine("Usage: research <tech_id> (e.g., research nav-1)", "warning");
            addLine("Type 'tech' to see available technologies.", "info");
            break;
          }
          addLine(`Researching technology: ${arg1}...`, "system");
          const result = await researchMut.mutateAsync({ techId: arg1 });
          addLine(result.message, result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "relics": {
          const state = await utils.tradeWars.getState.fetch();
          const discovered = (state?.discoveredRelics as string[]) || [];
          addLines([
            { text: `╔════════════════════════════════════════════════════════════════╗`, type: "info" },
            { text: `║  PRE-FALL RELIC ARCHIVE — ${discovered.length}/${Object.keys(PRE_FALL_RELICS).length} discovered`, type: "warning" },
            { text: `╠════════════════════════════════════════════════════════════════╣`, type: "info" },
          ]);
          if (discovered.length === 0) {
            addLine("║  No relics discovered yet. Explore the galaxy to find them.", "output");
          } else {
            discovered.forEach(relicId => {
              const relic = PRE_FALL_RELICS[relicId];
              if (relic) {
                addLine(`║  ★ ${relic.name}`, "warning");
                addLine(`║    ${relic.description}`, "output");
              }
            });
          }
          addLines([
            { text: `║`, type: "info" },
            { text: `║  Undiscovered relics: ${Object.keys(PRE_FALL_RELICS).length - discovered.length}`, type: "system" },
            { text: `╚════════════════════════════════════════════════════════════════╝`, type: "info" },
          ]);
          break;
        }

        case "status":
        case "stat": {
          const state = await utils.tradeWars.getState.fetch();
          if (!state) { addLine("ERROR: State unavailable", "error"); break; }
          const ship = state.shipInfo as any;
          const factionName = state.faction === "empire" ? "Empire" : state.faction === "insurgency" ? "Insurgency" : "Unaligned";
          addLines([
            { text: `╔════════════════════════════════════════════╗`, type: "info" },
            { text: `║  SHIP STATUS: ${ship?.name || state.shipType}`, type: "info" },
            { text: `╠════════════════════════════════════════════╣`, type: "info" },
            { text: `║  Faction:    ${factionName}`, type: state.faction === "empire" ? "success" : "error" },
            { text: `║  Sector:     ${state.currentSector}`, type: "output" },
            { text: `║  Credits:    ${state.credits?.toLocaleString()} cr`, type: "success" },
            { text: `║  Cargo:      ${getCargoUsed(state)}/${state.holds} holds`, type: "output" },
            { text: `║    Fuel Ore:   ${state.fuelOre}`, type: "output" },
            { text: `║    Organics:   ${state.organics}`, type: "output" },
            { text: `║    Equipment:  ${state.equipment}`, type: "output" },
            { text: `║  Fighters:   ${state.fighters}`, type: "output" },
            { text: `║  Shields:    ${state.shields}/${ship?.shields || "??"}`, type: state.shields < (ship?.shields || 100) * 0.3 ? "error" : "output" },
            { text: `║  Turns:      ${state.turnsRemaining}/100`, type: state.turnsRemaining < 10 ? "warning" : "output" },
            { text: `║  Experience: ${state.experience} XP`, type: "output" },
            { text: `║  Research:   ${state.researchPoints || 0} RP`, type: "warning" },
            { text: `║  Tech:       ${(state.unlockedTech as string[])?.length || 0}/14 unlocked`, type: "output" },
            { text: `║  Relics:     ${(state.discoveredRelics as string[])?.length || 0}/${Object.keys(PRE_FALL_RELICS).length}`, type: "output" },
            { text: `║  Explored:   ${(state.discoveredSectors as number[])?.length || 0}/200 sectors`, type: "output" },
            { text: `╚════════════════════════════════════════════╝`, type: "info" },
          ]);
          break;
        }

        case "sector":
        case "look": {
          await showSectorInfo();
          break;
        }

        case "warp":
        case "w":
        case "move": {
          if (!arg1 || isNaN(Number(arg1))) {
            addLine("Usage: warp <sector_number>", "warning");
            break;
          }
          addLine(`Engaging warp drive to sector ${arg1}...`, "system");
          setShowWarpTransition(true);
          const result = await warpMut.mutateAsync({ targetSector: Number(arg1) });
          if (result.success) {
            setNarrativeFlag("trade_wars_warped");
            addLine(result.message, "success");
            if (result.hazardMessage) addLine(result.hazardMessage, "error");
            if (result.cardReward) {
              addLine(`CARD FOUND: ${result.cardReward.name} (${result.cardReward.rarity})`, "warning");
            }
            // Check for relic discovery (random chance in unexplored sectors)
            const relicChance = Math.random();
            if (relicChance < 0.08) { // 8% chance per warp
              const undiscovered = Object.keys(PRE_FALL_RELICS).filter(
                id => !(stateQuery.data?.discoveredRelics as string[] || []).includes(id)
              );
              if (undiscovered.length > 0) {
                const relicId = undiscovered[Math.floor(Math.random() * undiscovered.length)];
                const relic = PRE_FALL_RELICS[relicId];
                addLine("", "output");
                addLine("╔═══════════════════════════════════════════╗", "warning");
                addLine(`║  PRE-FALL RELIC DISCOVERED!               ║`, "warning");
                addLine("╠═══════════════════════════════════════════╣", "warning");
                addLine(`║  ${relic.name}`, "success");
                addLine(`║  ${relic.description}`, "output");
                addLine(`║  +${relic.rpBonus} Research Points`, "success");
                addLine("╚═══════════════════════════════════════════╝", "warning");
                try {
                  await discoverRelicMut.mutateAsync({ relicId });
                } catch {}
              }
            }
            // ═══ EXPLORATION MATERIAL DROPS (on new discovery) ═══
            if (result.newDiscovery) {
              const exploDrops = getExplorationDrops();
              if (exploDrops.length > 0) {
                const dropText = exploDrops.map(d => {
                  const mat = getMaterialById(d.materialId);
                  return `${mat?.icon || ""} ${mat?.name || d.materialId} x${d.quantity}`;
                }).join(", ");
                addLine(`  Sector survey materials: ${dropText}`, "success");
                grantMaterialDrops(exploDrops, "Sector Survey");
              }
            }
            // ═══ SECTOR EVENT ROLL ═══
            const sectorType = (result.sector as any)?.sectorType || "empty";
            const event = rollSectorEvent(sectorType, result.newDiscovery || false);
            if (event) {
              addLine("", "output");
              const eventBorderType: TermLine["type"] = event.type === "encounter" ? "error" : event.type === "distress" ? "warning" : event.type === "lore_drop" ? "info" : event.type === "anomaly" ? "system" : "success";
              addLine("╔═══════════════════════════════════════════════════════════╗", eventBorderType);
              addLine(`║  ${event.title}`, eventBorderType);
              addLine("╠═══════════════════════════════════════════════════════════╣", eventBorderType);
              event.narrative.forEach(line => addLine(`║  ${line}`, "output"));
              addLine("╠═══════════════════════════════════════════════════════════╣", eventBorderType);
              // Apply rewards
              const rewards: string[] = [];
              if (event.reward?.credits) rewards.push(`+${event.reward.credits} credits`);
              if (event.reward?.xp) rewards.push(`+${event.reward.xp} XP`);
              if (event.reward?.rp) rewards.push(`+${event.reward.rp} Research Points`);
              if (event.reward?.commodity) rewards.push(`+${event.reward.qty} ${event.reward.commodity}`);
              if (rewards.length > 0) addLine(`║  REWARD: ${rewards.join(", ")}`, "success");
              // Apply risks
              if (event.risk?.shieldDamage) addLine(`║  DAMAGE: -${event.risk.shieldDamage} shields`, "error");
              if (event.risk?.creditLoss) addLine(`║  COST: -${event.risk.creditLoss} credits`, "error");
              addLine("╚═══════════════════════════════════════════════════════════╝", eventBorderType);
              // Trigger lore discovery if applicable
              if (event.loreEntityId) {
                addLine("", "output");
                addLine(`>> NEW LOREDEX ENTRY: ${event.loreEntityId.replace(/-/g, " ").toUpperCase()} <<`, "warning");
              }
            }

            // ═══ DIPLOMACY ENCOUNTER CHECK ═══
            // 20% chance to trigger an unresolved diplomacy event on warp
            if (Math.random() < 0.20) {
              const state = await utils.tradeWars.getState.fetch();
              const playerLevel = Math.floor((state?.experience || 0) / 100) + 1;
              const availableEvents = DIPLOMACY_EVENTS.filter(
                e => !gameState.completedDiplomacyEvents.includes(e.id) && e.minLevel <= playerLevel
              );
              if (availableEvents.length > 0) {
                const event = availableEvents[Math.floor(Math.random() * availableEvents.length)];
                addLine("", "output");
                addLine("╔══════════════════════════════════════════════════════════════╗", "warning");
                addLine(`║  ⚖ DIPLOMACY EVENT: ${event.title.toUpperCase()}`, "warning");
                addLine("╠══════════════════════════════════════════════════════════════╣", "warning");
                addLine(`║  ${event.description}`, "output");
                addLine(`║  Theme: ${event.theme}`, "system");
                addLine("╠══════════════════════════════════════════════════════════════╣", "warning");
                event.choices.forEach((choice, i) => {
                  addLine(`║  [${i + 1}] ${choice.text}`, "info");
                  const repChanges = Object.entries(choice.reputationDelta)
                    .map(([f, d]) => `${f}: ${(d as number) > 0 ? "+" : ""}${d}`)
                    .join(", ");
                  addLine(`║      Morality: ${choice.moralityDelta > 0 ? "+" : ""}${choice.moralityDelta} | Rep: ${repChanges}`, "system");
                });
                addLine("╠══════════════════════════════════════════════════════════════╣", "warning");
                addLine(`║  Type 'diplo ${event.id} <choice#>' to respond`, "info");
                addLine("╚══════════════════════════════════════════════════════════════╝", "warning");
              }
            }

            addLine("", "output");
            await showSectorInfo();
          } else {
            addLine(result.message, "error");
          }
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "scan":
        case "s": {
          addLine("Initiating deep-space scan...", "system");
          const result = await scanMut.mutateAsync();
          if (result.success) {
            addLine(result.message || "", "success");
            addLine(`Total sectors discovered: ${result.totalDiscovered}/200`, "info");
          } else {
            addLine(result.message || "Scan failed", "error");
          }
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "map":
        case "galaxy": {
          addLine("Opening visual galaxy map...", "system");
          addLine("(Use 'map-text' for the classic text view)", "info");
          setShowGalaxyMap(true);
          break;
        }

        case "map-text":
        case "galaxy-text": {
          addLine("Rendering galaxy map...", "system");
          const mapData = await utils.tradeWars.getMap.fetch();
          if (!mapData || !mapData.sectors || mapData.sectors.length === 0) {
            addLine("No sectors discovered yet.", "warning");
            break;
          }

          addLines([
            { text: `╔══════════════════════════════════════════════════════════════╗`, type: "info" },
            { text: `║  GALAXY MAP — ${mapData.totalDiscovered}/${mapData.totalSectors} sectors discovered`, type: "info" },
            { text: `╠══════════════════════════════════════════════════════════════╣`, type: "info" },
          ]);

          const byType: Record<string, any[]> = {};
          mapData.sectors.forEach((s: any) => {
            const t = s.sectorType || "empty";
            if (!byType[t]) byType[t] = [];
            byType[t].push(s);
          });

          const typeOrder = ["stardock", "station", "port", "planet", "asteroid", "nebula", "wormhole", "hazard", "empty"];
          for (const type of typeOrder) {
            const secs = byType[type];
            if (!secs || secs.length === 0) continue;
            const icon = SECTOR_ICONS[type] || "·";
            addLine(`║  ${icon} ${type.toUpperCase()} (${secs.length}):`, "warning");
            const chunks = [];
            for (let i = 0; i < secs.length; i += 5) {
              chunks.push(secs.slice(i, i + 5));
            }
            for (const chunk of chunks) {
              const line = chunk.map((s: any) => {
                const marker = s.isCurrent ? ">>>" : "   ";
                return `${marker}${String(s.sectorId).padStart(3)} ${s.name?.substring(0, 22) || "Unknown"}`;
              }).join("  ");
              addLine(`║    ${line}`, "output");
            }
          }

          addLines([
            { text: `╠══════════════════════════════════════════════════════════════╣`, type: "info" },
            { text: `║  >>> = Current location  |  ${SECTOR_ICONS.stardock} Stardock  ${SECTOR_ICONS.port} Port  ${SECTOR_ICONS.planet} Planet  ${SECTOR_ICONS.hazard} Hazard`, type: "output" },
            { text: `╚══════════════════════════════════════════════════════════════╝`, type: "info" },
          ]);
          break;
        }

        case "port":
        case "prices": {
          const sectorData = await utils.tradeWars.getSector.fetch({ sectorId: undefined as unknown as number });
          if (!sectorData || (sectorData.sectorType !== "port" && sectorData.sectorType !== "stardock")) {
            addLine("No trading port in this sector.", "error");
            break;
          }
          const portData = sectorData.sectorData as any;
          if (!portData?.commodities) { addLine("Port data unavailable", "error"); break; }
          const c = portData.commodities;
          addLines([
            { text: `╔════════════════════════════════════════════╗`, type: "info" },
            { text: `║  PORT: ${portData.portName || sectorData.name}`, type: "warning" },
            { text: `╠════════════════════════════════════════════╣`, type: "info" },
            { text: `║  Commodity     Action    Price/unit`, type: "info" },
            { text: `║  ──────────    ──────    ──────────`, type: "info" },
            { text: `║  Fuel Ore      ${c.fuelOre.buying ? "BUYING " : "SELLING"} @ ${String(c.fuelOre.price).padStart(5)} cr`, type: c.fuelOre.buying ? "success" : "output" },
            { text: `║  Organics      ${c.organics.buying ? "BUYING " : "SELLING"} @ ${String(c.organics.price).padStart(5)} cr`, type: c.organics.buying ? "success" : "output" },
            { text: `║  Equipment     ${c.equipment.buying ? "BUYING " : "SELLING"} @ ${String(c.equipment.price).padStart(5)} cr`, type: c.equipment.buying ? "success" : "output" },
            { text: `╚════════════════════════════════════════════╝`, type: "info" },
            { text: `  BUYING = port pays you  |  SELLING = you pay port`, type: "system" },
          ]);
          break;
        }

        case "buy":
        case "b": {
          const commodityMap: Record<string, string> = {
            fuel: "fuelOre", fuelore: "fuelOre", ore: "fuelOre",
            org: "organics", organics: "organics",
            eq: "equipment", equip: "equipment", equipment: "equipment",
          };
          const commodity = commodityMap[arg1 || ""];
          if (!commodity) {
            addLine("Usage: buy <fuel|organics|equipment> <quantity>", "warning");
            break;
          }
          const qty = Number(arg2);
          if (!qty || qty < 1) {
            addLine("Usage: buy <commodity> <quantity>", "warning");
            break;
          }
          const result = await tradeMut.mutateAsync({
            commodity: commodity as "fuelOre" | "organics" | "equipment",
            action: "buy",
            quantity: qty,
            factionReputation: gameState.factionReputation,
          });
          addLine(result.message, result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "sell": {
          const commodityMap: Record<string, string> = {
            fuel: "fuelOre", fuelore: "fuelOre", ore: "fuelOre",
            org: "organics", organics: "organics",
            eq: "equipment", equip: "equipment", equipment: "equipment",
          };
          const commodity = commodityMap[arg1 || ""];
          if (!commodity) {
            addLine("Usage: sell <fuel|organics|equipment> <quantity>", "warning");
            break;
          }
          const qty = Number(arg2);
          if (!qty || qty < 1) {
            addLine("Usage: sell <commodity> <quantity>", "warning");
            break;
          }
          const result = await tradeMut.mutateAsync({
            commodity: commodity as "fuelOre" | "organics" | "equipment",
            action: "sell",
            quantity: qty,
            factionReputation: gameState.factionReputation,
          });
          addLine(result.message, result.success ? "success" : "error");
          // ── TRADE MATERIAL DROPS on successful sell ──
          if (result.success) {
            const portTier = qty >= 50 ? "legendary" : qty >= 20 ? "rare" : "common";
            const drops = getTradePortDrops(portTier as "common" | "rare" | "legendary");
            if (drops.length > 0) {
              const dropText = drops.map(d => {
                const mat = getMaterialById(d.materialId);
                return `${mat?.icon || ""} ${mat?.name || d.materialId} x${d.quantity}`;
              }).join(", ");
              addLine(`  Salvaged materials: ${dropText}`, "success");
              grantMaterialDrops(drops, "Trade Salvage");
            }
          }
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "attack":
        case "fight":
        case "combat": {
          addLine("Engaging hostile contacts...", "system");
          addLine("", "output");
          const result = await combatMut.mutateAsync();
          const isDemon = (result as any).isDemonEncounter;
          if (isDemon) addLine("⚠ BLOOD WEAVE SIGNATURE DETECTED — HIERARCHY FORCES!", "error");
          if (result.won) {
            if (isDemon) {
              addLines([
                { text: `  ╔═══════════════════════════════════╗`, type: "warning" },
                { text: `  ║  ☠ HIERARCHY VANQUISHED ☠        ║`, type: "warning" },
                { text: `  ╚═══════════════════════════════════╝`, type: "warning" },
                { text: `  Demon: ${result.enemyName} (Power: ${result.enemyStrength})`, type: "output" },
                { text: `  Blood Weave Salvage: +${result.creditsChange} credits`, type: "success" },
                { text: `  XP gained: +${result.xpGain} (demon bonus!)`, type: "success" },
              ]);
            } else {
              addLines([
                { text: `  ╔═══════════════════════════╗`, type: "success" },
                { text: `  ║   ★ COMBAT VICTORY ★     ║`, type: "success" },
                { text: `  ╚═══════════════════════════╝`, type: "success" },
                { text: `  Enemy: ${result.enemyName} (Power: ${result.enemyStrength})`, type: "output" },
                { text: `  Salvage: +${result.creditsChange} credits`, type: "success" },
                { text: `  XP gained: +${result.xpGain}`, type: "success" },
              ]);
            }
            if (result.fightersLost > 0) addLine(`  Fighters lost: ${result.fightersLost}`, "warning");
            if (result.shieldDamage > 0) addLine(`  Shield damage: -${result.shieldDamage}`, "warning");
            if (result.cardReward) {
              addLine(`  ${isDemon ? '☠ DEMON' : ''} CARD REWARD: ${result.cardReward.name} (${result.cardReward.rarity})`, "warning");
            }
            // ── SPACE COMBAT MATERIAL DROPS ──
            const combatTier = isDemon ? "legendary" : "normal";
            const spaceCombatDrops = getCombatDrops(combatTier, false, 0);
            if (spaceCombatDrops.length > 0) {
              const dropText = spaceCombatDrops.map(d => {
                const mat = getMaterialById(d.materialId);
                return `${mat?.icon || ""} ${mat?.name || d.materialId} x${d.quantity}`;
              }).join(", ");
              addLine(`  Wreckage salvage: ${dropText}`, "success");
              grantMaterialDrops(spaceCombatDrops, "Combat Salvage");
            }
          } else {
            if (isDemon) {
              addLines([
                { text: `  ╔═══════════════════════════════════╗`, type: "error" },
                { text: `  ║  ☠ HIERARCHY TRIUMPH ☠           ║`, type: "error" },
                { text: `  ╚═══════════════════════════════════╝`, type: "error" },
                { text: `  Demon: ${result.enemyName} (Power: ${result.enemyStrength})`, type: "output" },
                { text: `  The Blood Weave claims: ${Math.abs(result.creditsChange || 0)} credits`, type: "error" },
                { text: `  Fighters consumed: ${result.fightersLost}`, type: "error" },
                { text: `  Shield corruption: -${result.shieldDamage}`, type: "error" },
              ]);
            } else {
              addLines([
                { text: `  ╔═══════════════════════════╗`, type: "error" },
                { text: `  ║   ✖ COMBAT DEFEAT ✖      ║`, type: "error" },
                { text: `  ╚═══════════════════════════╝`, type: "error" },
                { text: `  Enemy: ${result.enemyName} (Power: ${result.enemyStrength})`, type: "output" },
                { text: `  Credits lost: ${Math.abs(result.creditsChange || 0)}`, type: "error" },
                { text: `  Fighters lost: ${result.fightersLost}`, type: "error" },
                { text: `  Shield damage: -${result.shieldDamage}`, type: "error" },
              ]);
            }
          }
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "mine": {
          addLine("Deploying mining drones...", "system");
          const result = await mineMut.mutateAsync();
          addLine(result.message || "", result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "ships": {
          const ships = shipsQuery.data;
          if (!ships) { addLine("Ship data unavailable", "error"); break; }
          addLines([
            { text: `╔══════════════════════════════════════════════════════════╗`, type: "info" },
            { text: `║  STARDOCK SHIPYARD — Available Vessels                   ║`, type: "info" },
            { text: `╠══════════════════════════════════════════════════════════╣`, type: "info" },
            { text: `║  Ship              Holds  Fighters  Shields  Cost       ║`, type: "info" },
            { text: `║  ────              ─────  ────────  ───────  ────       ║`, type: "info" },
          ]);
          ships.forEach((s: any) => {
            addLine(
              `║  ${s.name.padEnd(18)} ${String(s.holds).padStart(5)}  ${String(s.fighters).padStart(8)}  ${String(s.shields).padStart(7)}  ${s.cost === 0 ? "FREE".padStart(9) : (s.cost.toLocaleString() + " cr").padStart(9)}`,
              "output"
            );
          });
          addLines([
            { text: `╠══════════════════════════════════════════════════════════╣`, type: "info" },
            { text: `║  Use: upgrade <ship_id> (e.g., upgrade merchant)        ║`, type: "system" },
            { text: `╚══════════════════════════════════════════════════════════╝`, type: "info" },
          ]);
          break;
        }

        case "upgrade": {
          if (!arg1) {
            addLine("Usage: upgrade <ship_type> (scout, merchant, corvette, frigate, dreadnought, ark)", "warning");
            break;
          }
          const result = await upgradeMut.mutateAsync({ shipType: arg1 });
          addLine(result.message, result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "fighters": {
          if (!arg1 || isNaN(Number(arg1))) {
            addLine("Usage: fighters <quantity>", "warning");
            break;
          }
          const result = await buyFightersMut.mutateAsync({ quantity: Number(arg1) });
          addLine(result.message, result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "repair": {
          const result = await repairMut.mutateAsync();
          addLine(result.message, result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "leaderboard":
        case "lb":
        case "scores":
        case "rankings": {
          addLine("Accessing galactic rankings...", "system");
          const sortOptions: Record<string, "credits" | "experience" | "sectors" | "combat"> = {
            credits: "credits", wealth: "credits",
            xp: "experience", experience: "experience", exp: "experience",
            sectors: "sectors", explore: "sectors",
            combat: "combat", kills: "combat", pvp: "combat",
          };
          const sortBy = sortOptions[arg1 || "credits"] || "credits";
          const lb = await utils.tradeWars.getLeaderboard.fetch({ sortBy });
          if (!lb || lb.length === 0) {
            addLine("No operatives registered yet.", "warning");
            break;
          }
          addLines([
            { text: `╔══════════════════════════════════════════════════════════════════════╗`, type: "info" },
            { text: `║  GALACTIC LEADERBOARD — Sorted by: ${sortBy.toUpperCase().padEnd(12)}                     ║`, type: "info" },
            { text: `╠══════════════════════════════════════════════════════════════════════╣`, type: "info" },
            { text: `║  #   Name                 Credits      XP    Sectors  Wins  Ship   ║`, type: "info" },
            { text: `║  ──  ────                 ───────      ──    ───────  ────  ────   ║`, type: "info" },
          ]);
          lb.forEach((entry: any) => {
            const isYou = entry.userId === stateQuery.data?.userId;
            const marker = isYou ? ">>" : "  ";
            const rankStr = String(entry.rank).padStart(2);
            const name = (entry.name || "Unknown").substring(0, 20).padEnd(20);
            const credits = String(entry.credits?.toLocaleString() || "0").padStart(12);
            const xp = String(entry.experience || 0).padStart(7);
            const sectors = String(entry.sectorsDiscovered || 0).padStart(7);
            const wins = String(entry.combatWins || 0).padStart(5);
            const ship = (entry.shipName || "Scout").substring(0, 6).padEnd(6);
            addLine(
              `║${marker}${rankStr}  ${name} ${credits} ${xp}  ${sectors}  ${wins}  ${ship} ║`,
              isYou ? "warning" : "output"
            );
          });
          addLines([
            { text: `╠══════════════════════════════════════════════════════════════════════╣`, type: "info" },
            { text: `║  Sort: leaderboard <credits|xp|sectors|combat>                      ║`, type: "system" },
            { text: `╚══════════════════════════════════════════════════════════════════════╝`, type: "info" },
          ]);
          break;
        }

        case "colonize":
        case "claim": {
          if (!arg1) {
            addLine("Usage: colonize <planet_name> [type]", "warning");
            addLine("Types: mining, agriculture, technology, military, trading", "info");
            break;
          }
          const colonyTypes = ["mining", "agriculture", "technology", "military", "trading"];
          const colType = colonyTypes.includes(arg2 || "") ? arg2 as any : "mining";
          addLine(`Establishing colony "${arg1}"...`, "system");
          const result = await claimPlanetMut.mutateAsync({
            planetName: arg1,
            colonyType: colType,
          });
          addLine(result.message, result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "colonies":
        case "planets": {
          addLine("Querying colony database...", "system");
          const colonies = await utils.tradeWars.getColonies.fetch();
          if (!colonies || colonies.length === 0) {
            addLine("No colonies established. Use 'colonize <name> [type]' at a planet sector.", "warning");
            break;
          }
          addLines([
            { text: `╔══════════════════════════════════════════════════════════════════════╗`, type: "info" },
            { text: `║  YOUR COLONIES (${colonies.length})                                                   ║`, type: "info" },
            { text: `╠══════════════════════════════════════════════════════════════════════╣`, type: "info" },
          ]);
          colonies.forEach((c: any) => {
            const typeIcon: Record<string, string> = {
              mining: "⛏", agriculture: "🌾", technology: "💻", military: "⚔", trading: "💰",
            };
            addLines([
              { text: `║  ${typeIcon[c.colonyType] || "🏠"} ${c.planetName} (ID: ${c.id}) — Sector ${c.sectorId}`, type: "warning" },
              { text: `║    Type: ${(c.colonyType || "mining").toUpperCase()} | Level: ${c.level}/5 | Pop: ${c.population}`, type: "output" },
              { text: `║    Defense: ${c.defense} fighters | Hours since collection: ${c.hoursSinceCollection}`, type: "output" },
              { text: `║    Pending: ${c.projectedCredits} cr, ${c.projectedFuelOre} ore, ${c.projectedOrganics} org, ${c.projectedEquipment} eq`, type: "success" },
              { text: `║    Income/hr: ${c.baseIncome?.credits} cr, ${c.baseIncome?.fuelOre} ore, ${c.baseIncome?.organics} org, ${c.baseIncome?.equipment} eq`, type: "info" },
              { text: `║`, type: "info" },
            ]);
          });
          addLines([
            { text: `╠══════════════════════════════════════════════════════════════════════╣`, type: "info" },
            { text: `║  collect — Collect all income | upgrade-colony <id> — Level up      ║`, type: "system" },
            { text: `║  fortify <id> <qty> — Deploy fighters for defense                   ║`, type: "system" },
            { text: `╚══════════════════════════════════════════════════════════════════════╝`, type: "info" },
          ]);
          break;
        }

        case "collect":
        case "harvest": {
          addLine("Collecting colony income...", "system");
          const result = await collectIncomeMut.mutateAsync();
          addLine(result.message, result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "upgrade-colony":
        case "uc": {
          if (!arg1 || isNaN(Number(arg1))) {
            addLine("Usage: upgrade-colony <colony_id>", "warning");
            addLine("Use 'colonies' to see your colony IDs.", "info");
            break;
          }
          addLine("Upgrading colony infrastructure...", "system");
          const result = await upgradeColonyMut.mutateAsync({ colonyId: Number(arg1) });
          addLine(result.message, result.success ? "success" : "error");
          break;
        }

        case "fortify": {
          if (!arg1 || isNaN(Number(arg1)) || !arg2 || isNaN(Number(arg2))) {
            addLine("Usage: fortify <colony_id> <fighter_count>", "warning");
            break;
          }
          const result = await fortifyColonyMut.mutateAsync({
            colonyId: Number(arg1),
            fighters: Number(arg2),
          });
          addLine(result.message, result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "log":
        case "history": {
          const logData = await utils.tradeWars.getLog.fetch();
          if (!logData || logData.length === 0) {
            addLine("No actions recorded yet.", "warning");
            break;
          }
          addLine(`╔════════════════════════════════════════════╗`, "info");
          addLine(`║  RECENT ACTIONS (last ${logData.length})`, "info");
          addLine(`╠════════════════════════════════════════════╣`, "info");
          logData.slice(0, 15).forEach((entry: any) => {
            const time = new Date(entry.createdAt).toLocaleTimeString();
            const details = entry.details as any;
            let summary = entry.action;
            if (entry.action === "warp") summary = `Warped to sector ${details?.to}`;
            else if (entry.action === "buy") summary = `Bought ${details?.quantity} ${details?.commodity}`;
            else if (entry.action === "sell") summary = `Sold ${details?.quantity} ${details?.commodity}`;
            else if (entry.action === "combat") summary = `Combat: ${details?.won ? "WON" : "LOST"} vs ${details?.enemy}`;
            addLine(`║  [${time}] ${summary}`, "output");
          });
          addLine(`╚════════════════════════════════════════════╝`, "info");
          break;
        }

        case "diplo":
        case "diplomacy": {
          if (!arg1) {
            // Show current reputation
            const rep = gameState.factionReputation;
            addLines([
              { text: `╔════════════════════════════════════════════╗`, type: "info" },
              { text: `║  ⚖ DIPLOMACY STATUS`, type: "warning" },
              { text: `╠════════════════════════════════════════════╣`, type: "info" },
              { text: `║  Empire:      ${rep.empire > 0 ? "+" : ""}${rep.empire || 0}`, type: (rep.empire || 0) > 0 ? "success" : (rep.empire || 0) < 0 ? "error" : "output" },
              { text: `║  Insurgency:  ${rep.insurgency > 0 ? "+" : ""}${rep.insurgency || 0}`, type: (rep.insurgency || 0) > 0 ? "success" : (rep.insurgency || 0) < 0 ? "error" : "output" },
              { text: `║  Independent: ${rep.independent > 0 ? "+" : ""}${rep.independent || 0}`, type: (rep.independent || 0) > 0 ? "success" : (rep.independent || 0) < 0 ? "error" : "output" },
              { text: `║  Pirate:      ${rep.pirate > 0 ? "+" : ""}${rep.pirate || 0}`, type: (rep.pirate || 0) > 0 ? "success" : (rep.pirate || 0) < 0 ? "error" : "output" },
              { text: `╠════════════════════════════════════════════╣`, type: "info" },
              { text: `║  Morality: ${gameState.moralityScore > 0 ? "+" : ""}${gameState.moralityScore} (${gameState.moralityScore > 30 ? "Humanity" : gameState.moralityScore < -30 ? "Machine" : "Neutral"})`, type: "output" },
              { text: `║  Events Resolved: ${gameState.completedDiplomacyEvents.length}/${DIPLOMACY_EVENTS.length}`, type: "output" },
              { text: `║  Trade Price Effect: Faction rep modifies prices at ports`, type: "system" },
              { text: `╚════════════════════════════════════════════╝`, type: "info" },
            ]);
            break;
          }
          // Handle diplomacy choice: diplo <eventId> <choiceNumber>
          const eventId = arg1;
          const choiceNum = Number(arg2);
          const event = DIPLOMACY_EVENTS.find(e => e.id === eventId);
          if (!event) {
            addLine(`Unknown diplomacy event: ${eventId}`, "error");
            break;
          }
          if (gameState.completedDiplomacyEvents.includes(eventId)) {
            addLine(`You've already resolved this event.`, "warning");
            break;
          }
          if (!choiceNum || choiceNum < 1 || choiceNum > event.choices.length) {
            addLine(`Invalid choice. Use 1-${event.choices.length}`, "error");
            break;
          }
          const choice = event.choices[choiceNum - 1];
          completeDiplomacyEvent(eventId, choice.id, choice.moralityDelta, choice.reputationDelta);
          addLine("", "output");
          addLine("╔══════════════════════════════════════════════════════════════╗", "success");
          addLine(`║  DECISION MADE: ${choice.text}`, "success");
          addLine("╠══════════════════════════════════════════════════════════════╣", "success");
          addLine(`║  ${choice.consequence}`, "output");
          addLine("╠══════════════════════════════════════════════════════════════╣", "success");
          const repChanges = Object.entries(choice.reputationDelta)
            .map(([f, d]) => `${f}: ${(d as number) > 0 ? "+" : ""}${d}`)
            .join(", ");
          addLine(`║  Morality: ${choice.moralityDelta > 0 ? "+" : ""}${choice.moralityDelta} | Reputation: ${repChanges}`, "warning");
          if (choice.creditDelta) {
            addLine(`║  Credits: ${choice.creditDelta > 0 ? "+" : ""}${choice.creditDelta}`, choice.creditDelta > 0 ? "success" : "error");
          }
          addLine("╚══════════════════════════════════════════════════════════════╝", "success");
          break;
        }

        case "rep":
        case "reputation": {
          const rep = gameState.factionReputation;
          addLines([
            { text: `╔════════════════════════════════════════════╗`, type: "info" },
            { text: `║  FACTION REPUTATION`, type: "warning" },
            { text: `╠════════════════════════════════════════════╣`, type: "info" },
            { text: `║  Empire:      ${String(rep.empire || 0).padStart(4)} ${"█".repeat(Math.min(20, Math.max(0, (rep.empire || 0) / 5)))}`, type: "output" },
            { text: `║  Insurgency:  ${String(rep.insurgency || 0).padStart(4)} ${"█".repeat(Math.min(20, Math.max(0, (rep.insurgency || 0) / 5)))}`, type: "output" },
            { text: `║  Independent: ${String(rep.independent || 0).padStart(4)} ${"█".repeat(Math.min(20, Math.max(0, (rep.independent || 0) / 5)))}`, type: "output" },
            { text: `║  Pirate:      ${String(rep.pirate || 0).padStart(4)} ${"█".repeat(Math.min(20, Math.max(0, (rep.pirate || 0) / 5)))}`, type: "output" },
            { text: `╚════════════════════════════════════════════╝`, type: "info" },
          ]);
          break;
        }

        default: {
          addLine(`Unknown command: "${command}". Type 'help' for available commands.`, "error");
        }
      }
    } catch (err: any) {
      addLine(`ERROR: ${err.message || "Command failed"}`, "error");
    }
  }, [addLine, addLines, showSectorInfo, utils, warpMut, tradeMut, scanMut, upgradeMut, buyFightersMut, repairMut, combatMut, mineMut, claimPlanetMut, collectIncomeMut, upgradeColonyMut, fortifyColonyMut, shipsQuery.data, stateQuery.data, researchMut, discoverRelicMut, grantMaterialDrops, gameState, completeDiplomacyEvent]);

  // Handle input submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing || !input.trim()) return;

    setCommandHistory(prev => [input, ...prev].slice(0, 50));
    setHistoryIndex(-1);
    processCommand(input);
    setInput("");
  }, [input, isProcessing, processCommand]);

  // Handle key events for history navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistoryIndex(prev => {
        const next = Math.min(prev + 1, commandHistory.length - 1);
        if (commandHistory[next]) setInput(commandHistory[next]);
        return next;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistoryIndex(prev => {
        const next = Math.max(prev - 1, -1);
        setInput(next >= 0 ? commandHistory[next] : "");
        return next;
      });
    }
  }, [commandHistory]);

  // Focus input on terminal click
  const handleTerminalClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Auth gate
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 font-mono animate-pulse">Establishing uplink...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="border border-cyan-500/30 bg-black/90 p-8 rounded max-w-md text-center">
          <pre className="text-cyan-500 text-xs mb-4 whitespace-pre">{`
  ████████╗███████╗
  ╚══██╔══╝██╔════╝
     ██║   █████╗
     ██║   ██╔══╝
     ██║   ███████╗
     ╚═╝   ╚══════╝`}</pre>
          <h2 className="text-cyan-400 font-mono text-lg mb-2">TRADE EMPIRE</h2>
          <p className="text-muted-foreground font-mono text-sm mb-2">After the Fall. Before the Empire.</p>
          <p className="text-muted-foreground font-mono text-xs mb-6">Authentication required to access the Inception Ark Command Terminal.</p>
          <a
            href={getLoginUrl()}
            className="inline-block px-6 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-mono text-sm hover:bg-cyan-500/30 transition-colors"
          >
            [ AUTHENTICATE ]
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Warp Transition Effect */}
      <WarpTransition active={showWarpTransition} onComplete={() => setShowWarpTransition(false)} />
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 py-2 bg-background/80 border-b border-cyan-500/20 gap-1">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/games" className="text-cyan-400 font-mono text-[10px] sm:text-xs hover:text-cyan-300 transition-colors">
            ← GAMES
          </Link>
          <span className="text-gray-600 font-mono text-[10px] sm:text-xs">|</span>
          <span className="text-cyan-500 font-mono text-[10px] sm:text-xs tracking-wider">TRADE EMPIRE</span>
          {stateQuery.data?.faction && (
            <>
              <span className="text-gray-600 font-mono text-[10px] sm:text-xs">|</span>
              <span className={`font-mono text-[10px] sm:text-xs ${stateQuery.data.faction === "empire" ? "text-amber-400" : "text-red-400"}`}>
                {stateQuery.data.faction === "empire" ? "⚜ EMPIRE" : "🔥 INSURGENCY"}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-4 font-mono text-[10px] sm:text-xs">
          {stateQuery.data && (
            <>
              <span className="text-green-400">{stateQuery.data.credits?.toLocaleString()} cr</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-amber-400">T:{stateQuery.data.turnsRemaining}</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-cyan-400">S{stateQuery.data.currentSector}</span>
              <span className="text-muted-foreground">|</span>
              <span className="text-purple-400">RP:{stateQuery.data.researchPoints || 0}</span>
              <span className="text-muted-foreground">|</span>
              <button
                onClick={() => setShowGalaxyMap(true)}
                className="text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider"
                title="Open Galaxy Map"
              >
                🗺 MAP
              </button>
            </>
          )}
        </div>
      </div>

      {/* Galaxy Map Overlay */}
      {showGalaxyMap && mapQuery.data && mapQuery.data.sectors.length > 0 && (
        <GalaxyMap
          sectors={mapQuery.data.sectors as any}
          playerSector={mapQuery.data.playerSector}
          totalDiscovered={mapQuery.data.totalDiscovered || 0}
          totalSectors={mapQuery.data.totalSectors || 200}
          onWarp={(sectorId) => {
            setShowGalaxyMap(false);
            setInput(`warp ${sectorId}`);
            setTimeout(() => {
              processCommand(`warp ${sectorId}`);
              setInput("");
            }, 100);
          }}
          onClose={() => setShowGalaxyMap(false)}
          territories={territoriesQuery.data as any}
          currentUserId={stateQuery.data?.userId}
        />
      )}

      {/* Terminal */}
      <div
        ref={termRef}
        onClick={handleTerminalClick}
        className="flex-1 overflow-y-auto p-2 sm:p-4 font-mono text-[10px] sm:text-sm leading-relaxed cursor-text"
        style={{
          background: "linear-gradient(180deg, #000000 0%, #001a1a 100%)",
          textShadow: "0 0 5px rgba(0, 255, 255, 0.15)",
        }}
      >
        {/* CRT scanline effect */}
        <div
          className="pointer-events-none fixed inset-0 z-10"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          }}
        />

        {lines.map((line, i) => (
          <div key={i} className={`${colorClass(line.type)} whitespace-pre-wrap break-all`}>
            {line.text || "\u00A0"}
          </div>
        ))}

        {isProcessing && (
          <div className="text-cyan-400 animate-pulse">Processing...</div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center px-3 sm:px-4 py-2.5 sm:py-3 bg-background/90 border-t border-cyan-500/20">
        <span className="text-green-400 font-mono text-xs sm:text-sm mr-2">{">"}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          autoFocus
          className="flex-1 bg-transparent text-green-400 font-mono text-xs sm:text-sm outline-none placeholder-gray-600 caret-green-400"
          placeholder={
            isProcessing ? "Processing..." :
            gamePhase === "faction_choice" ? "Type 1 or 2..." :
            "Enter command..."
          }
          autoComplete="off"
          spellCheck={false}
          autoCapitalize="off"
        />
      </form>
      <LoreOverlay gameMode="trade-wars" />
    </div>
  );
}
