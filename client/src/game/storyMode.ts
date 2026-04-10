/* ═══════════════════════════════════════════════════════
   THE COLLECTOR'S ARENA — SEASON ONE
   "The Prisoner's Prophecy"

   Complete Adaptive Story Mode — Dialog Wheel System
   Branching paths, Corruption Arc, Season Finale & Vote.

   Every time the Prisoner speaks, a DIALOG WHEEL appears —
   2-4 options radiating from center, each with a tone icon
   and short label. The player NEVER reads a line they
   didn't choose. The Prisoner is the player's voice.

   TWO PLAYTHROUGHS MINIMUM to unlock all fighters.
   ═══════════════════════════════════════════════════════ */

// ─── DIALOG WHEEL SYSTEM ───────────────────────────────

export type ToneAxis = "truth" | "defiance" | "empathy" | "acceptance";

export interface DialogWheelOption {
  /** Tone icon displayed on the wheel */
  icon: "🔍" | "⚔️" | "💜" | "✋";
  /** Short label shown on the wheel spoke */
  label: string;
  /** Unique key for state tracking */
  key: string;
  /** Which moral axis this nudges */
  axis: ToneAxis;
  /** Direction on the axis: +1 toward, -1 away */
  dir: 1 | -1;
  /** If this option triggers a branch, which branch */
  branch?: string;
  /** Dialog lines that play when this option is chosen */
  response: StoryDialogue[];
  /** Optional internal monologue for the Prisoner */
  internalMonologue?: string;
}

export interface DialogWheel {
  /** Context label shown above the wheel */
  context?: string;
  /** 2-4 options radiating from center */
  options: DialogWheelOption[];
}

// ─── DIALOGUE TYPES ────────────────────────────────────

export interface StoryDialogue {
  speaker: string;
  text: string;
  speakerColor?: string;
  /** Stage direction for portrait behavior */
  portraitDirection?: PortraitDirection;
  /** If true, this is internal monologue (italicized, no portrait highlight) */
  internal?: boolean;
  /** Voice effect applied to this line */
  voiceEffect?: "echo" | "static" | "glitch" | "clinical";
  /**
   * Optional VO line ID. When set, UI playback code should look this ID up in
   * shared/storyModeVoManifest.json and play the matching S3 MP3 during this
   * line. See useStoryModeVO() hook and scripts/story-mode-lines.json for the
   * source-of-truth line catalog.
   */
  voiceId?: string;
}

export type PortraitDirection =
  | "normal"
  | "dim"
  | "zoom"
  | "shake"
  | "flicker"
  | "glitch_pink"
  | "corrupt"
  | "eye_flicker"
  | "jaw_servo"
  | "fade_out";

// ─── PORTRAIT SYSTEM ───────────────────────────────────

export interface PortraitConfig {
  image: string;
  altImage?: string;
  position: "left" | "right";
  baseOpacity: number;
}

// ─── CHAPTER STRUCTURE ─────────────────────────────────

export interface StoryChapter {
  id: string;
  chapter: number;
  title: string;
  subtitle: string;
  opponentId: string;
  arenaId: string;
  difficulty: "easy" | "normal" | "hard" | "nightmare";
  unlocksFighter?: string;
  unlocksVideo?: string;
  preFight: (StoryDialogue | DialogWheel)[];
  postFight: (StoryDialogue | DialogWheel)[];
  postDefeatDialogue: StoryDialogue[];
  memoryFragment?: string;
  powerGained?: string;
  cinematicId?: string;
  mandatoryLoss?: boolean;
  setBranch?: { key: string; value: string };
  requiresBranch?: { key: string; value: string };
  isBoss?: boolean;
  fightPhases?: number;
  secretIdentity?: string;
  dualPortrait?: { initial: string; transformed: string; transformTrigger: string; flickerOnEmpathy: boolean };
  memeGlitch?: { color: string; frameInterval: number; duration: number };
  removeFighterAfter?: boolean;
  mandatoryDeathSequence?: {
    deathDialogue: StoryDialogue[];
    resurrectionVoices: StoryDialogue[];
    postResurrection: (StoryDialogue | DialogWheel)[];
  };
  harvestingMonologue?: StoryDialogue[];
  damnatioMemoriae?: { dialogue: StoryDialogue[]; wheelAfter: DialogWheel };
  falseProphetReveal?: (StoryDialogue | DialogWheel)[];
}

export interface FightPhase {
  phase: number;
  hpThreshold: number;
  transitionDialog: (StoryDialogue | DialogWheel)[];
  arenaModifier?: string;
}

// ─── BRANCH & CORRUPTION ──────────────────────────────

export interface BranchState {
  branchA: string | null;
  branchB: string | null;
}

export interface CorruptionEncounter {
  id: string;
  triggeredByBranch: { key: string; chose: string };
  corruptedFighter: string;
  arenaId: string;
  cinematicId?: string;
  portraitCorruption: {
    base: string;
    eyeShift?: { from: string; to: string };
    coreShift?: { from: string; to: string };
    veinColor: string;
    veinPaths: string[];
  };
  preFight: (StoryDialogue | DialogWheel)[];
  postPurification: StoryDialogue[];
}

// ─── SOURCE BOSS & ENDINGS ────────────────────────────

export type SourceEnding = "redemption" | "sacrifice" | "resurrection" | "mercy";

export interface SourceBossFight {
  id: string;
  opponentId: string;
  arenaId: string;
  difficulty: "nightmare";
  fightPhases: number;
  intro: (StoryDialogue | DialogWheel)[];
  phase2: { trigger: string; dialogue: (StoryDialogue | DialogWheel)[] };
  phase3: { trigger: string; dialogue: (StoryDialogue | DialogWheel)[] };
  postFight: StoryDialogue[];
  finalChoice: DialogWheel;
}

// ─── SEASON FINALE ────────────────────────────────────

export interface SeasonFinale {
  id: string;
  cinematicId: string;
  intro: (StoryDialogue | DialogWheel)[];
  season2Tease: StoryDialogue[];
  voteWheel: DialogWheel;
  outro: StoryDialogue[];
}

// ─── GAME MODES ───────────────────────────────────────

export interface GameModeDefinition {
  id: string;
  name: string;
  unlockCondition: string;
  description: string;
}

// ─── CINEMATICS ───────────────────────────────────────

export interface CinematicDefinition {
  id: string;
  trigger: string;
  duration: number;
  description: string;
}

// ─── ROSTER ───────────────────────────────────────────

export interface RosterEntry {
  id: string;
  name: string;
  unlock: string;
  chapter: number | null;
  notes: string;
}

// ─── VOTE ─────────────────────────────────────────────

export type VoteCandidate = "eyes" | "engineer" | "forgotten";

// ─── STORY PROGRESS ───────────────────────────────────

export interface StoryProgress {
  currentChapter: number;
  completedChapters: string[];
  unlockedFighters: string[];
  memoriesRecovered: string[];
  branches: BranchState;
  corruptionCompleted: boolean;
  sourceEnding: SourceEnding | null;
  finaleCompleted: boolean;
  vote: VoteCandidate | null;
  moralScore: { truth: number; defiance: number; empathy: number; acceptance: number };
  isComplete: boolean;
  playthroughCount: number;
}

export const DEFAULT_STORY_PROGRESS: StoryProgress = {
  currentChapter: 0,
  completedChapters: [],
  unlockedFighters: [],
  memoriesRecovered: [],
  branches: { branchA: null, branchB: null },
  corruptionCompleted: false,
  sourceEnding: null,
  finaleCompleted: false,
  vote: null,
  moralScore: { truth: 0, defiance: 0, empathy: 0, acceptance: 0 },
  isComplete: false,
  playthroughCount: 0,
};

// ─── THE PRISONER ─────────────────────────────────────

export const THE_PRISONER = {
  id: "prisoner",
  name: "The Prisoner",
  title: "Unknown — Designation: Subject Zero",
  faction: "neutral" as const,
  locked: false,
  unlockCost: 0,
  baseHp: 80,
  baseAttack: 6,
  baseDefense: 5,
  baseSpeed: 7,
  color: "#a78bfa",
  special: {
    name: "FRACTURED VISION",
    damage: 20,
    description: "A flash of prophetic power breaks through the amnesia",
    cooldown: 240,
    color: "#a78bfa",
  },
};

export function getPrisonerStats(chaptersCompleted: number) {
  const growth = Math.min(chaptersCompleted, 12);
  return {
    hp: THE_PRISONER.baseHp + growth * 5,
    attack: THE_PRISONER.baseAttack + Math.floor(growth * 0.5),
    defense: THE_PRISONER.baseDefense + Math.floor(growth * 0.4),
    speed: THE_PRISONER.baseSpeed + Math.floor(growth * 0.3),
    special: {
      ...THE_PRISONER.special,
      damage: THE_PRISONER.special.damage + growth * 2,
      name:
        chaptersCompleted >= 11 ? "ORACLE'S PROPHECY"
        : chaptersCompleted >= 8 ? "AWAKENING VISION"
        : chaptersCompleted >= 5 ? "MEMORY SURGE"
        : "FRACTURED VISION",
      description:
        chaptersCompleted >= 11 ? "The full power of the Oracle unleashed — reality bends to your will"
        : chaptersCompleted >= 8 ? "Visions of the past flood back, channeled into devastating force"
        : chaptersCompleted >= 5 ? "Fragments of memory coalesce into a focused psychic blast"
        : "A flash of prophetic power breaks through the amnesia",
    },
  };
}

// ─── LORE OPENING ─────────────────────────────────────

export const ARENA_LORE_OPENING: StoryDialogue[] = [
  { speaker: "narrator", text: "The Architect foresaw the end of everything. It built an Arena — not for glory, but for harvest. The greatest minds in the universe, tested. Their essence, preserved. Their consent, irrelevant.", voiceId: "narrator_arena_lore_00" },
  { speaker: "narrator", text: "They call it the Collector's Arena. On the prison-world of Thaloria, the harvested fight not for freedom but for the right to exist beyond the end of everything.", voiceId: "narrator_arena_lore_01" },
  { speaker: "narrator", text: "And in the deepest cell of the Panopticon, a prisoner awakens. No name. No memory. Only the faintest echo of a power that once shook empires. And the cameras are already rolling.", voiceId: "narrator_arena_lore_02" },
];

// ═══════════════════════════════════════════════════════
// STORY CHAPTERS — See storyModeChapters.ts for full
// chapter data (12 chapters + branches + corruption arc
// + Source boss + Season Finale).
//
// This file contains the type system, interfaces, and
// core configuration. Chapter dialog data is in the
// companion file to keep each file under 100KB.
// ═══════════════════════════════════════════════════════

// ─── GAME MODES ───────────────────────────────────────

export const GAME_MODES: GameModeDefinition[] = [
  { id: "story", name: "Story Mode", unlockCondition: "start", description: "12 chapters + branches — The Prisoner's Prophecy" },
  { id: "sparring", name: "Sparring", unlockCondition: "each_victory", description: "Practice defeated fighters" },
  { id: "vs-local", name: "VS Local", unlockCondition: "ch2_complete", description: "1v1 with unlocked fighters" },
  { id: "arcade-tower", name: "Arcade Tower", unlockCondition: "ch5_complete", description: "8 random opponents, escalating" },
  { id: "survival", name: "Survival", unlockCondition: "ch8_complete", description: "Endless mode with leaderboard" },
  { id: "mirror-match", name: "Mirror Match", unlockCondition: "ch6_complete", description: "Any fighter vs themselves" },
  { id: "time-attack", name: "Time Attack", unlockCondition: "ch10_complete", description: "Speed records" },
  { id: "boss-rush", name: "Boss Rush", unlockCondition: "story_complete", description: "All bosses, no healing" },
  { id: "corruption-gauntlet", name: "Corruption Gauntlet", unlockCondition: "corruption_complete", description: "All corrupted + Source" },
  { id: "prophecy-mode", name: "Prophecy Mode", unlockCondition: "both_branches_seen", description: "All dialog visible" },
];

// ─── FIGHTER ROSTER (18) ──────────────────────────────

export const FIGHTER_ROSTER: RosterEntry[] = [
  { id: "prisoner", name: "Prisoner (Oracle)", unlock: "start", chapter: null, notes: "Always playable" },
  { id: "agent-zero", name: "Agent Zero", unlock: "ch1", chapter: 1, notes: "+ CoNexus video" },
  { id: "jailer", name: "The Jailer", unlock: "ch2", chapter: 2, notes: "Boss" },
  { id: "iron-lion", name: "Iron Lion", unlock: "branch_a", chapter: 3, notes: "Branch A + CoNexus video" },
  { id: "wraith-calder", name: "Wraith Calder", unlock: "branch_a_alt", chapter: 3, notes: "Branch A alt" },
  { id: "akai-shi", name: "Akai Shi", unlock: "ch4", chapter: 4, notes: "" },
  { id: "necromancer", name: "Necromancer", unlock: "ch5", chapter: 5, notes: "Kills you, removed after" },
  { id: "white-oracle", name: "White Oracle", unlock: "ch6", chapter: 6, notes: "Mirror match (secretly the Meme)" },
  { id: "warlord", name: "Warlord", unlock: "ch7", chapter: 7, notes: "Appears as Dr. Vox first" },
  { id: "human", name: "Human", unlock: "ch8", chapter: 8, notes: "" },
  { id: "enigma", name: "Enigma", unlock: "branch_b", chapter: 9, notes: "" },
  { id: "degen", name: "Degen", unlock: "branch_b_alt", chapter: 9, notes: "" },
  { id: "warden", name: "Warden", unlock: "ch10", chapter: 10, notes: "Boss" },
  { id: "collector", name: "Collector", unlock: "ch11", chapter: 11, notes: "Boss" },
  { id: "architect", name: "Architect", unlock: "ch12", chapter: 12, notes: "Final boss" },
  { id: "unchosen-a", name: "[Unchosen A]", unlock: "corruption_arc", chapter: null, notes: "Corrupted first encounter" },
  { id: "unchosen-b", name: "[Unchosen B]", unlock: "corruption_arc", chapter: null, notes: "Corrupted first encounter" },
  { id: "source", name: "Source", unlock: "corruption_final", chapter: null, notes: "Ultimate boss" },
  { id: "meme", name: "Meme", unlock: "season_finale", chapter: null, notes: "Secret unlock" },
];

// ─── VEO CINEMATICS ───────────────────────────────────

export const VEO_CINEMATICS: CinematicDefinition[] = [
  { id: "VEO-001", trigger: "ch1_start", duration: 15, description: "Prisoner wakes. Dark cell. First breath." },
  { id: "VEO-002", trigger: "branch_a_lion", duration: 15, description: "Iron Lion salutes — golden energy flares" },
  { id: "VEO-003", trigger: "branch_a_calder", duration: 15, description: "Seven overlapping bodies — Calder's iterations" },
  { id: "VEO-004", trigger: "ch5_death", duration: 15, description: "Fall, green fire, CUT TO clone tank, new eyes" },
  { id: "VEO-005", trigger: "ch6_identity_a", duration: 15, description: "Violet eruption, prophecy column, Thaloria" },
  { id: "VEO-006", trigger: "ch6_identity_b", duration: 15, description: "Pushes sight down, violet to hands" },
  { id: "VEO-007", trigger: "ch7_transform", duration: 15, description: "Vox lab coat dissolves to Warlord armor" },
  { id: "VEO-008", trigger: "ch12_outbreak", duration: 15, description: "Virus erupts, portraits corrupt one by one" },
  { id: "VEO-009", trigger: "source_redemption", duration: 15, description: "Kael separates from virus, golden ascent" },
  { id: "VEO-010", trigger: "source_sacrifice", duration: 15, description: "Man and virus die together, silence" },
  { id: "VEO-011", trigger: "meme_reveal", duration: 15, description: "White Oracle face SHATTERS to pink neon" },
  { id: "VEO-012", trigger: "vote_launch", duration: 15, description: "Three portraits materialize, YOU DECIDE" },
  { id: "VEO-013", trigger: "corrupted_unchosen", duration: 15, description: "Split screen: healthy past vs corrupted present" },
];

// ─── VOTE SYSTEM ──────────────────────────────────────

export const VOTE_WEIGHTS: Record<string, number> = {
  story_complete: 2,
  corruption_complete: 3,
  both_branches_seen: 5,
  season_finale_seen: 3,
  first_vote: 3,
  weekly_vote: 1,
};

export interface VoteState {
  eyes: number;
  engineer: number;
  forgotten: number;
  totalVotes: number;
  seasonActive: boolean;
}

export const DEFAULT_VOTE_STATE: VoteState = {
  eyes: 0, engineer: 0, forgotten: 0, totalVotes: 0, seasonActive: true,
};

// ─── HELPERS ──────────────────────────────────────────

export function getUnchosen(branch: "A" | "B", state: BranchState): string {
  if (branch === "A") return state.branchA === "iron-lion" ? "wraith-calder" : "iron-lion";
  return state.branchB === "enigma" ? "degen" : "enigma";
}

export function endSeason(seasonId: string) {
  return { seasonId, triggerResurrection: true };
}

// ─── VO LINE COUNT ────────────────────────────────────
// ~520 total lines:
// Prisoner/Oracle: ~140 | Agent Zero: ~20 | Iron Lion: ~18
// Wraith Calder: ~18 | Jailer: ~14 | Akai Shi: ~16
// Necromancer: ~14 | White Oracle: ~18 | Warlord/Vox: ~22
// Human: ~16 | Enigma: ~18 | Degen: ~18 | Warden: ~18
// Collector: ~22 | Architect: ~18 | Source/Kael: ~20
// Meme: ~30 | Narrator: ~10 | Corrupted: ~30 | Elara: ~8
