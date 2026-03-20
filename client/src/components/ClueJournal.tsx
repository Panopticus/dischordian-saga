/* ═══════════════════════════════════════════════════════
   CLUE JOURNAL — Puzzle Progression & Data Crystal Tracker
   Tracks collected clues, Data Crystals, Elara hints, and
   cross-room puzzle dependencies. Accessible from Command Console.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { useGame } from "@/contexts/GameContext";
import {
  BookOpen, Diamond, MessageCircle, Eye, Link2, Trophy,
  Lock, Unlock, ChevronRight, ChevronDown, Sparkles,
  Search, Filter, X, FileText
} from "lucide-react";
import AwakeningJournalEntry from "./AwakeningJournalEntry";
import { motion, AnimatePresence } from "framer-motion";

/* ─── CLUE DATA DEFINITIONS ─── */

export type ClueType = "data_crystal" | "elara_hint" | "environmental" | "cross_room" | "achievement_linked";

export interface Clue {
  id: string;
  type: ClueType;
  title: string;
  description: string;          // Shown when collected
  encryptedHint: string;        // Shown before collected (teaser)
  roomId: string;               // Where it's found
  puzzleId?: string;            // Which puzzle it helps solve
  prerequisite?: string;        // Item/flag needed to find this clue
  dreamReward: number;          // Dream tokens earned on discovery
}

export interface Puzzle {
  id: string;
  name: string;
  location: string;             // Room ID where the puzzle lives
  description: string;
  difficulty: "easy" | "medium" | "hard" | "legendary";
  requiredClues: string[];      // Clue IDs needed to solve
  reward: string;               // What solving unlocks
  dreamReward: number;
  loreConnection: string;       // How it ties to the Dischordian Saga
}

/* ─── CLUE DATABASE ─── */

export const CLUES: Clue[] = [
  // ═══ BRIDGE PUZZLES ═══
  {
    id: "crystal_ark_designation",
    type: "data_crystal",
    title: "Ark Designation Crystal",
    description: "A data crystal containing the Inception Ark's original designation: ARK-47. The number 47 appears repeatedly in the Ark's systems — hull plates, corridor junctions, even the cryo pod count. It's not a coincidence.",
    encryptedHint: "A glowing crystal pulses with encrypted data. Something about a number...",
    roomId: "cryo-bay",
    puzzleId: "bridge_power_relay",
    dreamReward: 25,
  },
  {
    id: "crystal_binary_sequence",
    type: "data_crystal",
    title: "Binary Sequence Fragment",
    description: "A partial binary sequence: 00101111. When decoded, it reads '47' in decimal. The Ark's power relays require a binary authentication code based on the ship's designation.",
    encryptedHint: "Ones and zeros flicker across the crystal's surface...",
    roomId: "engineering",
    puzzleId: "bridge_power_relay",
    dreamReward: 25,
  },
  {
    id: "elara_bridge_hint",
    type: "elara_hint",
    title: "Elara: Power Relay Protocol",
    description: "The Bridge power relay requires a binary authentication code. Think about the Ark's designation — every system on this ship is keyed to that number. Convert it to binary and you'll have your answer.",
    encryptedHint: "Elara seems to know something about the Bridge systems...",
    roomId: "bridge",
    puzzleId: "bridge_power_relay",
    dreamReward: 10,
  },
  {
    id: "env_bridge_console",
    type: "environmental",
    title: "Bridge Console Readout",
    description: "The main console displays: 'POWER RELAY STATUS: OFFLINE. Authentication required. System designation protocol active.' A sticky note reads: 'Remember — the Ark knows its own name.'",
    encryptedHint: "The Bridge console flickers with partially readable text...",
    roomId: "bridge",
    puzzleId: "bridge_power_relay",
    dreamReward: 15,
  },

  // ═══ COMMS ARRAY PUZZLES ═══
  {
    id: "crystal_signal_frequency",
    type: "data_crystal",
    title: "Signal Frequency Log",
    description: "A medical bay log entry: 'Patient exhibited unusual brainwave patterns at 7.83 Hz — the same frequency as the old Earth Schumann resonance. The signal seems to originate from outside the Ark.'",
    encryptedHint: "A crystal containing medical scan data. Something about frequencies...",
    roomId: "medical-bay",
    puzzleId: "comms_frequency_decoder",
    dreamReward: 25,
  },
  {
    id: "crystal_resonance_key",
    type: "data_crystal",
    title: "Resonance Calibration Key",
    description: "Technical specs for the Comms Array: 'Frequency decoder requires harmonic resonance input. Base frequency must match the natural resonance of the origin planet.' Earth's Schumann resonance: 7.83 Hz.",
    encryptedHint: "Engineering specs for the communications system...",
    roomId: "comms-array",
    puzzleId: "comms_frequency_decoder",
    dreamReward: 25,
  },
  {
    id: "elara_comms_hint",
    type: "elara_hint",
    title: "Elara: The Signal",
    description: "There's a signal coming from somewhere beyond the Ark. The Comms Array can decode it, but it needs to be tuned to the right frequency. Think about where we came from — the planet's heartbeat.",
    encryptedHint: "Elara gazes at the Comms Array with concern...",
    roomId: "comms-array",
    puzzleId: "comms_frequency_decoder",
    dreamReward: 10,
  },

  // ═══ NAVIGATION PUZZLES ═══
  {
    id: "crystal_star_chart",
    type: "data_crystal",
    title: "Ancient Star Chart",
    description: "A star chart from before the Fall of Reality. Three stars are circled: Sirius (α CMa), Betelgeuse (α Ori), and Polaris (α UMi). A note reads: 'The triangle of passage — align these three to unlock the gate.'",
    encryptedHint: "An old star chart with markings that don't match current positions...",
    roomId: "bridge",
    puzzleId: "nav_lock",
    dreamReward: 25,
  },
  {
    id: "env_nav_display",
    type: "environmental",
    title: "Navigation Display Pattern",
    description: "The navigation display shows a triangular pattern connecting three star systems. The coordinates form a sequence: S-B-P. The lock mechanism has three dials, each with constellation symbols.",
    encryptedHint: "The navigation display shows a geometric pattern...",
    roomId: "navigation",
    puzzleId: "nav_lock",
    dreamReward: 15,
  },

  // ═══ ARMORY PUZZLES ═══
  {
    id: "crystal_weapon_codes",
    type: "data_crystal",
    title: "Tactical Weapon Codes",
    description: "War Room tactical display archive: 'Armory access codes rotate on a 4-digit cycle. Current cycle seed: the year the Panopticon was founded.' According to Dischordian lore, the Panopticon was founded in year 2047.",
    encryptedHint: "Military-grade encryption on this crystal. Something about weapon access...",
    roomId: "war-room",
    puzzleId: "armory_combination",
    dreamReward: 25,
  },
  {
    id: "elara_armory_hint",
    type: "elara_hint",
    title: "Elara: The Armory Lock",
    description: "The Armory combination changes, but it's always derived from a significant date in the Panopticon's history. Check the War Room tactical archives — the founding year is the key.",
    encryptedHint: "Elara mentions something about the Armory's security system...",
    roomId: "armory",
    puzzleId: "armory_combination",
    dreamReward: 10,
  },

  // ═══ CARGO VAULT PUZZLES ═══
  {
    id: "crystal_vault_shard_1",
    type: "cross_room",
    title: "Vault Seal Fragment Alpha",
    description: "One of three seal fragments needed to open the Cargo Vault. This fragment bears the symbol of the DeMagi — a crystalline eye. It was hidden in the Medical Bay's quarantine storage.",
    encryptedHint: "A fragment of something larger. It hums with energy...",
    roomId: "medical-bay",
    puzzleId: "cargo_vault_seal",
    dreamReward: 30,
  },
  {
    id: "crystal_vault_shard_2",
    type: "cross_room",
    title: "Vault Seal Fragment Beta",
    description: "The second seal fragment, bearing the Quarchon war sigil. Found wedged behind the Training Arena's combat simulation console. Someone hid it here deliberately.",
    encryptedHint: "Another fragment. It resonates when near the first piece...",
    roomId: "training-arena",
    puzzleId: "cargo_vault_seal",
    dreamReward: 30,
  },
  {
    id: "crystal_vault_shard_3",
    type: "cross_room",
    title: "Vault Seal Fragment Gamma",
    description: "The final seal fragment, marked with the Ne-Yon infinity symbol. Discovered in the Mess Hall's storage compartment, wrapped in a cloth bearing the words 'For the worthy.'",
    encryptedHint: "The third piece. Together, they might open something...",
    roomId: "mess-hall",
    puzzleId: "cargo_vault_seal",
    dreamReward: 30,
  },

  // ═══ RESTRICTED ARCHIVE PUZZLES ═══
  {
    id: "crystal_cipher_key_1",
    type: "data_crystal",
    title: "Cipher Key Fragment: Alpha",
    description: "A fragment of the Archive cipher key. Contains the first four characters of the decryption sequence. Found in a hidden compartment in the Codex terminal.",
    encryptedHint: "Encrypted data that seems to be part of a larger key...",
    roomId: "comms-array",
    puzzleId: "archive_cipher",
    dreamReward: 35,
  },
  {
    id: "crystal_cipher_key_2",
    type: "data_crystal",
    title: "Cipher Key Fragment: Beta",
    description: "The second cipher key fragment. The middle portion of the decryption sequence. Hidden in the Navigation system's backup logs.",
    encryptedHint: "More encrypted key data. It connects to something else...",
    roomId: "navigation",
    puzzleId: "archive_cipher",
    dreamReward: 35,
  },
  {
    id: "crystal_cipher_key_3",
    type: "data_crystal",
    title: "Cipher Key Fragment: Gamma",
    description: "The final cipher key fragment. Completing the decryption sequence. Found in the Cargo Bay's manifest system.",
    encryptedHint: "The last piece of the cipher. Now you can decode it...",
    roomId: "cargo-bay",
    puzzleId: "archive_cipher",
    dreamReward: 35,
  },

  // ═══ REACTOR CORE PUZZLES ═══
  {
    id: "crystal_reactor_schematic",
    type: "data_crystal",
    title: "Reactor Power Schematic",
    description: "Engineering schematics showing the reactor's power-up sequence: 'Ignition requires activating fuel rods in order — Hydrogen, Helium, Lithium, Beryllium. The periodic table is the key.'",
    encryptedHint: "Technical schematics for something powerful...",
    roomId: "engineering",
    puzzleId: "reactor_sequence",
    dreamReward: 40,
  },
  {
    id: "env_reactor_display",
    type: "environmental",
    title: "Reactor Status Display",
    description: "The reactor display shows four empty fuel rod slots labeled with atomic numbers: 1, 2, 3, 4. Below: 'Insert elements in ascending atomic order to initiate cold fusion sequence.'",
    encryptedHint: "The reactor display shows numbered slots waiting for input...",
    roomId: "reactor-core",
    puzzleId: "reactor_sequence",
    dreamReward: 20,
  },

  // ═══ VOID GATE PUZZLES ═══
  {
    id: "crystal_void_key",
    type: "achievement_linked",
    title: "The Void Key",
    description: "A crystalline key that materialized when all other puzzles were solved. It pulses with energy from every system on the Ark. The Void Gate awaits.",
    encryptedHint: "Something extraordinary will appear when all puzzles are complete...",
    roomId: "void-gate",
    puzzleId: "void_gate_ritual",
    prerequisite: "all_puzzles_solved",
    dreamReward: 100,
  },
];

/* ─── PUZZLE DATABASE ─── */

export const PUZZLES: Puzzle[] = [
  {
    id: "bridge_power_relay",
    name: "Power Relay Authentication",
    location: "bridge",
    description: "The Bridge's main power relay is locked behind a binary authentication code. Restore power to unlock the full command systems.",
    difficulty: "easy",
    requiredClues: ["crystal_ark_designation", "crystal_binary_sequence"],
    reward: "Full Bridge access + War Room unlock",
    dreamReward: 100,
    loreConnection: "The Ark's designation — 47 — echoes throughout the Dischordian Saga. Daniel 2:47, the 47 Potentials, the 47th frequency.",
  },
  {
    id: "comms_frequency_decoder",
    name: "Frequency Decoder",
    location: "comms-array",
    description: "The Comms Array has detected an external signal, but the frequency decoder needs calibration. Tune it to the right frequency to decode the transmission.",
    difficulty: "easy",
    requiredClues: ["crystal_signal_frequency", "crystal_resonance_key"],
    reward: "Decoded transmission + Navigation unlock",
    dreamReward: 100,
    loreConnection: "The signal originates from beyond the known universe — possibly from the Source itself, broadcasting through the fabric of reality.",
  },
  {
    id: "nav_lock",
    name: "Navigation Lock",
    location: "navigation",
    description: "The Navigation system is locked behind a stellar alignment puzzle. Align the correct stars to plot a course through the void.",
    difficulty: "medium",
    requiredClues: ["crystal_star_chart", "env_nav_display"],
    reward: "Navigation access + star chart data",
    dreamReward: 150,
    loreConnection: "The three-star alignment mirrors the Trinity of Power in Dischordian mythology — Order, Chaos, and Balance.",
  },
  {
    id: "armory_combination",
    name: "Armory Combination Lock",
    location: "armory",
    description: "The Armory is sealed with a rotating combination lock. The code is derived from a significant historical date.",
    difficulty: "medium",
    requiredClues: ["crystal_weapon_codes"],
    reward: "Full Armory access + rare weapon cards",
    dreamReward: 150,
    loreConnection: "The Panopticon's founding in 2047 marked the beginning of the surveillance state that would eventually trigger the Age of Privacy.",
  },
  {
    id: "cargo_vault_seal",
    name: "Cargo Vault Seal",
    location: "cargo-bay",
    description: "The Cargo Vault requires three seal fragments from different parts of the Ark. Each fragment bears the symbol of one of the three species.",
    difficulty: "hard",
    requiredClues: ["crystal_vault_shard_1", "crystal_vault_shard_2", "crystal_vault_shard_3"],
    reward: "Cargo Vault treasures + rare card packs",
    dreamReward: 250,
    loreConnection: "The three species — DeMagi, Quarchon, and Ne-Yon — must unite their symbols to open the vault. Unity is the only path forward.",
  },
  {
    id: "archive_cipher",
    name: "Archive Cipher",
    location: "restricted-archive",
    description: "The Restricted Archive is protected by a multi-part cipher. Fragments of the decryption key are scattered across the Ark's systems.",
    difficulty: "hard",
    requiredClues: ["crystal_cipher_key_1", "crystal_cipher_key_2", "crystal_cipher_key_3"],
    reward: "Classified lore entries + hidden character dossiers",
    dreamReward: 300,
    loreConnection: "The Archive contains the truth about the Fall of Reality — information the Panopticon tried to suppress.",
  },
  {
    id: "reactor_sequence",
    name: "Reactor Ignition Sequence",
    location: "reactor-core",
    description: "The Reactor Core needs to be brought online using the correct element sequence. The periodic table holds the answer.",
    difficulty: "hard",
    requiredClues: ["crystal_reactor_schematic", "env_reactor_display"],
    reward: "Full reactor power + endgame bonuses",
    dreamReward: 350,
    loreConnection: "The reactor runs on cold fusion — a technology that was theoretical before the Ne-Yons shared their knowledge with humanity.",
  },
  {
    id: "void_gate_ritual",
    name: "Void Gate Ritual",
    location: "void-gate",
    description: "The Void Gate requires the combined knowledge of all other puzzles. Only those who have mastered every system can open the gate to what lies beyond.",
    difficulty: "legendary",
    requiredClues: ["crystal_void_key"],
    reward: "The truth beyond the Void",
    dreamReward: 1000,
    loreConnection: "The Void Gate leads to the space between realities — where the Source resides. Opening it means confronting the fundamental nature of the Dischordian universe.",
  },
];

/* ─── HELPER FUNCTIONS ─── */

export function getCluesByRoom(roomId: string): Clue[] {
  return CLUES.filter(c => c.roomId === roomId);
}

export function getCluesForPuzzle(puzzleId: string): Clue[] {
  return CLUES.filter(c => c.puzzleId === puzzleId);
}

export function getPuzzleProgress(puzzleId: string, collectedClueIds: string[]): { total: number; found: number; percent: number } {
  const puzzle = PUZZLES.find(p => p.id === puzzleId);
  if (!puzzle) return { total: 0, found: 0, percent: 0 };
  const total = puzzle.requiredClues.length;
  const found = puzzle.requiredClues.filter(id => collectedClueIds.includes(id)).length;
  return { total, found, percent: total > 0 ? Math.round((found / total) * 100) : 0 };
}

export function isPuzzleSolvable(puzzleId: string, collectedClueIds: string[]): boolean {
  const { total, found } = getPuzzleProgress(puzzleId, collectedClueIds);
  return total > 0 && found >= total;
}

export function hasRoomClue(roomId: string): boolean {
  return CLUES.some(c => c.roomId === roomId);
}

/* ─── CLUE TYPE METADATA ─── */

const CLUE_TYPE_META: Record<ClueType, { label: string; icon: typeof Diamond; color: string; bgColor: string }> = {
  data_crystal: { label: "Data Crystal", icon: Diamond, color: "text-primary", bgColor: "bg-primary/10" },
  elara_hint: { label: "Elara Hint", icon: MessageCircle, color: "text-accent", bgColor: "bg-accent/10" },
  environmental: { label: "Environmental", icon: Eye, color: "text-chart-4", bgColor: "bg-chart-4/10" },
  cross_room: { label: "Cross-Room", icon: Link2, color: "text-destructive", bgColor: "bg-destructive/10" },
  achievement_linked: { label: "Achievement", icon: Trophy, color: "text-chart-3", bgColor: "bg-chart-3/10" },
};

const DIFFICULTY_META: Record<string, { label: string; color: string }> = {
  easy: { label: "EASY", color: "text-green-400" },
  medium: { label: "MEDIUM", color: "text-accent" },
  hard: { label: "HARD", color: "text-destructive" },
  legendary: { label: "LEGENDARY", color: "text-chart-4" },
};

/* ─── CLUE JOURNAL COMPONENT ─── */

interface ClueJournalProps {
  onClose?: () => void;
}

export default function ClueJournal({ onClose }: ClueJournalProps) {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState<"log" | "clues" | "puzzles">(state.characterCreated ? "log" : "clues");
  const [expandedPuzzle, setExpandedPuzzle] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<ClueType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Collected clues are tracked via itemsCollected in GameContext
  const collectedClueIds = useMemo(
    () => state.itemsCollected.filter(id => CLUES.some(c => c.id === id)),
    [state.itemsCollected]
  );

  // Solved puzzles tracked via narrativeFlags
  const solvedPuzzleIds = useMemo(
    () => PUZZLES.filter(p => state.narrativeFlags[`puzzle_${p.id}_solved`]).map(p => p.id),
    [state.narrativeFlags]
  );

  // Filter and search clues
  const filteredClues = useMemo(() => {
    let clues = CLUES;
    if (filterType !== "all") clues = clues.filter(c => c.type === filterType);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      clues = clues.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.roomId.toLowerCase().includes(q)
      );
    }
    return clues;
  }, [filterType, searchQuery]);

  const totalClues = CLUES.length;
  const totalPuzzles = PUZZLES.length;
  const collectedCount = collectedClueIds.length;
  const solvedCount = solvedPuzzleIds.length;

  return (
    <div className="h-full flex flex-col bg-background/95 overflow-hidden">
      {/* ═══ HEADER ═══ */}
      <div className="shrink-0 border-b border-primary/20 bg-card/50 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            <h2 className="font-display text-sm font-bold tracking-[0.2em]">CLUE JOURNAL</h2>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 rounded hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Stats bar */}
        <div className="flex gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <Diamond size={12} className="text-primary" />
            <span className="font-mono text-xs text-muted-foreground">
              <span className="text-primary font-bold">{collectedCount}</span>/{totalClues} Clues
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock size={12} className="text-accent" />
            <span className="font-mono text-xs text-muted-foreground">
              <span className="text-accent font-bold">{solvedCount}</span>/{totalPuzzles} Puzzles
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1">
          {(["log", "clues", "puzzles"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md font-mono text-xs tracking-wider transition-all ${
                activeTab === tab
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {tab === "log" ? "PERSONAL LOG" : tab === "clues" ? "DATA CRYSTALS" : "PUZZLES"}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="wait">
          {activeTab === "log" ? (
            <motion.div
              key="log"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4"
            >
              <AwakeningJournalEntry />
            </motion.div>
          ) : activeTab === "clues" ? (
            <motion.div
              key="clues"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 space-y-3"
            >
              {/* Search & Filter */}
              <div className="flex gap-2 mb-2">
                <div className="flex-1 relative">
                  <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search clues..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-md bg-secondary/50 border border-border/30 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value as ClueType | "all")}
                    className="appearance-none pl-7 pr-6 py-1.5 rounded-md bg-secondary/50 border border-border/30 font-mono text-xs text-foreground focus:outline-none focus:border-primary/50 cursor-pointer"
                  >
                    <option value="all">All</option>
                    <option value="data_crystal">Crystals</option>
                    <option value="elara_hint">Elara</option>
                    <option value="environmental">Environ.</option>
                    <option value="cross_room">Cross-Room</option>
                    <option value="achievement_linked">Achieve.</option>
                  </select>
                  <Filter size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Clue list */}
              {filteredClues.map(clue => {
                const collected = collectedClueIds.includes(clue.id);
                const meta = CLUE_TYPE_META[clue.type];
                const Icon = meta.icon;

                return (
                  <motion.div
                    key={clue.id}
                    layout
                    className={`rounded-lg border p-3 transition-all ${
                      collected
                        ? "border-primary/30 bg-primary/5"
                        : "border-border/20 bg-card/30 opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-md ${meta.bgColor} shrink-0 mt-0.5`}>
                        <Icon size={14} className={meta.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-semibold truncate">
                            {collected ? clue.title : "???"}
                          </span>
                          {collected && (
                            <Sparkles size={10} className="text-primary shrink-0" />
                          )}
                        </div>
                        <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                          {collected ? clue.description : clue.encryptedHint}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className={`font-mono text-[9px] ${meta.color} tracking-wider`}>
                            {meta.label.toUpperCase()}
                          </span>
                          <span className="font-mono text-[9px] text-muted-foreground/50">
                            {clue.roomId.replace(/-/g, " ").toUpperCase()}
                          </span>
                          {collected && (
                            <span className="font-mono text-[9px] text-accent">
                              +{clue.dreamReward} DREAM
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="shrink-0">
                        {collected ? (
                          <Unlock size={14} className="text-primary" />
                        ) : (
                          <Lock size={14} className="text-muted-foreground/30" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {filteredClues.length === 0 && (
                <div className="text-center py-8">
                  <Diamond size={24} className="mx-auto text-muted-foreground/30 mb-2" />
                  <p className="font-mono text-xs text-muted-foreground/50">No clues match your search</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="puzzles"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4 space-y-3"
            >
              {PUZZLES.map(puzzle => {
                const solved = solvedPuzzleIds.includes(puzzle.id);
                const progress = getPuzzleProgress(puzzle.id, collectedClueIds);
                const solvable = isPuzzleSolvable(puzzle.id, collectedClueIds);
                const expanded = expandedPuzzle === puzzle.id;
                const diffMeta = DIFFICULTY_META[puzzle.difficulty];
                const clues = getCluesForPuzzle(puzzle.id);

                return (
                  <motion.div
                    key={puzzle.id}
                    layout
                    className={`rounded-lg border transition-all ${
                      solved
                        ? "border-accent/30 bg-accent/5"
                        : solvable
                        ? "border-primary/40 bg-primary/5 box-glow-cyan"
                        : "border-border/20 bg-card/30"
                    }`}
                  >
                    <button
                      onClick={() => setExpandedPuzzle(expanded ? null : puzzle.id)}
                      className="w-full p-3 text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-md shrink-0 ${solved ? "bg-accent/20" : "bg-secondary/50"}`}>
                          {solved ? (
                            <Unlock size={14} className="text-accent" />
                          ) : (
                            <Lock size={14} className={solvable ? "text-primary" : "text-muted-foreground/40"} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold truncate">{puzzle.name}</span>
                            <span className={`font-mono text-[9px] ${diffMeta.color} tracking-wider`}>
                              {diffMeta.label}
                            </span>
                          </div>
                          {!solved && (
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1 rounded-full bg-secondary/50 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-primary transition-all duration-500"
                                  style={{ width: `${progress.percent}%` }}
                                />
                              </div>
                              <span className="font-mono text-[9px] text-muted-foreground">
                                {progress.found}/{progress.total}
                              </span>
                            </div>
                          )}
                          {solved && (
                            <span className="font-mono text-[10px] text-accent">SOLVED — +{puzzle.dreamReward} DREAM</span>
                          )}
                        </div>
                        {expanded ? (
                          <ChevronDown size={14} className="text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronRight size={14} className="text-muted-foreground shrink-0" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 space-y-2 border-t border-border/10 pt-2">
                            <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                              {puzzle.description}
                            </p>
                            <div className="bg-secondary/30 rounded-md p-2">
                              <p className="font-mono text-[9px] text-primary/70 italic leading-relaxed">
                                "{puzzle.loreConnection}"
                              </p>
                            </div>
                            <div>
                              <p className="font-mono text-[9px] text-muted-foreground/60 mb-1.5 tracking-wider">REQUIRED CLUES:</p>
                              {clues.map(clue => {
                                const found = collectedClueIds.includes(clue.id);
                                const cMeta = CLUE_TYPE_META[clue.type];
                                return (
                                  <div key={clue.id} className="flex items-center gap-2 py-0.5">
                                    {found ? (
                                      <Sparkles size={10} className="text-primary shrink-0" />
                                    ) : (
                                      <Lock size={10} className="text-muted-foreground/30 shrink-0" />
                                    )}
                                    <span className={`font-mono text-[10px] ${found ? "text-foreground" : "text-muted-foreground/40"}`}>
                                      {found ? clue.title : "???"}
                                    </span>
                                    <span className={`font-mono text-[8px] ${cMeta.color}`}>
                                      {cMeta.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            {!solved && (
                              <div className="pt-1">
                                <p className="font-mono text-[9px] text-accent/70">
                                  REWARD: {puzzle.reward}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
