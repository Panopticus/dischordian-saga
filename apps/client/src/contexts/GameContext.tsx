/* ═══════════════════════════════════════════════════════
   GAME CONTEXT — Inception Ark Adventure State Machine
   Manages awakening flow, room unlocks, exploration state.
   Persists to localStorage, syncs to DB for logged-in users.
   ═══════════════════════════════════════════════════════ */
import { createContext, useContext, useCallback, useEffect, useState, useRef, type ReactNode } from "react";
import { trpc } from "@/lib/trpc";
import { assetUrl } from "@/lib/assetUrl";
import { LORE_ACHIEVEMENTS } from "@/data/loreAchievements";
import { SIB_WATCHED_FLAGS } from "@shared/transmissions";
// Task 3.1 — sync status moved out of context into its own store so the 77
// GameContext consumers don't re-render every 5 seconds during debounced save.
import { useSyncStatusStore } from "@/stores/syncStatusStore";
import { applyDischordiaEnergy } from "@/stores/dischordiaCycleStore";
import { recordMemorableMoment } from "@/stores/memorableMomentsStore";
import { adjustNarratorBond as adjustNarratorBondValue, deriveNarratorBond } from "@shared/narratorBond";
import {
  MEMORY_ENERGY_STARTING,
  adjustMemoryEnergy as adjustMemoryEnergyValue,
  computeMemoryEnergyCap,
  earnMemoryEnergy as earnMemoryEnergyValue,
  type MemoryEnergyEarnSource,
} from "@shared/memoryEnergy";
import {
  advanceYearOneMonth as advanceYearOneMonthValue,
  deriveYearOneMonth,
  yearOneMonthFlag,
} from "@shared/yearOneMonth";
import { addCompletedRecruitmentMission } from "@shared/armyRecruitment";
import {
  EMPTY_PRESTIGE_CYCLE_STATS,
  addPrestigeCycleStats,
  measurePrestigeCycleStats,
  type PrestigeCycleStats,
} from "@shared/prestige";
import { applyPrestigeCarryover } from "@shared/witnessingIntegrations";

/* ─── TYPES ─── */
export type GamePhase = "FIRST_VISIT" | "AWAKENING" | "QUARTERS_UNLOCKED" | "EXPLORING" | "FULL_ACCESS";

export type AwakeningStep =
  | "BLACKOUT"
  | "CRYO_OPEN"
  | "ELARA_INTRO"
  | "SPECIES_QUESTION"
  | "CLASS_QUESTION"
  | "ALIGNMENT_QUESTION"
  | "ELEMENT_QUESTION"
  | "NAME_INPUT"
  | "ATTRIBUTES"
  | "FIRST_STEPS"
  | "COMPLETE";

export interface CharacterChoices {
  species: "demagi" | "quarchon" | "neyon" | null;
  characterClass: "engineer" | "oracle" | "assassin" | "soldier" | "spy" | null;
  alignment: "order" | "chaos" | null;
  element: string | null;
  name: string;
  attrAttack: number;
  attrDefense: number;
  attrVitality: number;
}

export interface RoomState {
  id: string;
  unlocked: boolean;
  visited: boolean;
  visitCount: number;
  itemsFound: string[];
  elaraDialogSeen: boolean;
}

/* ─── ARMY MANAGEMENT TYPES ─── */
export type ArmyUnitType = "operative" | "dreamer" | "engineer" | "insurgent" | "diplomat";
export type ArmyUnitRank = "recruit" | "veteran" | "elite" | "commander";
export interface ArmyUnit {
  id: string;
  name: string;
  type: ArmyUnitType;
  rank: ArmyUnitRank;
  level: number;           // 1-10
  xp: number;              // XP toward next level
  sector: string;          // Which sector they were recruited from
  specialization: string;  // e.g., "stealth", "combat", "tech", "diplomacy"
  successRate: number;     // Base success rate 0-100
  recruitedAt: number;     // Timestamp
  deployed: boolean;       // Currently on a mission?
}
export interface ArmyDeployment {
  id: string;
  missionId: string;
  missionName: string;
  missionType: "daily" | "weekly" | "event" | "recruitment";
  unitIds: string[];       // Units assigned
  startedAt: number;       // Timestamp
  durationMs: number;      // How long the mission takes
  successChance: number;   // Calculated success chance 0-100
  sector: string;
  rewards: { type: string; amount: number }[];
}
export interface CompletedDeployment {
  id: string;
  missionId: string;
  missionName: string;
  success: boolean;
  unitIds: string[];
  completedAt: number;
  rewards?: { type: string; amount: number }[];
  report: string;          // Typed-out mission report text
  reportSpeaker: "elara" | "human" | "system";
}
export interface SectorControl {
  sectorId: string;
  controlLevel: number;    // 0-100
  unitsStationed: number;
  income: number;          // Passive income per cycle
  threatLevel: number;     // 0-100 (Thought Virus resurgence)
  discovered: boolean;
}

export interface GameState {
  phase: GamePhase;
  awakeningStep: AwakeningStep;
  characterChoices: CharacterChoices;
  characterCreated: boolean;
  rooms: Record<string, RoomState>;
  currentRoomId: string | null;
  itemsCollected: string[];
  achievementsEarned: string[];
  elaraDialogHistory: string[];
  totalRoomsUnlocked: number;
  totalItemsFound: number;
  narrativeFlags: Record<string, boolean>;
  /** F13 — hidden Elara stability (-100..100). Gates CompanionLine variants
   *  and nudges the character's speech band per character bible. */
  elaraStability: number;
  /** F13 — hidden Human light (-100..100). Mirror scalar for the second
   *  companion's noire-to-warmth arc. */
  humanLight: number;
  /** Section F — Clue Journal entries keyed by Clue.id. Flat list ordered by arrival.
   *  `source` widens beyond the cryo bay so other room mystery modules
   *  (medical bay, bridge, engineering, …) can log into the same journal. */
  clueJournal: import("@shared/roomMysteries").Clue[];
  /** Section F+ — inventory items the player has collected across any
   *  room mystery scene. Storage is a flat string[] because each room
   *  module declares its own narrow inventory id union. */
  mysteryInventory: string[];
  claimedQuestRewards: string[];   // Quest IDs whose rewards have been claimed
  completedGames: string[];       // CoNexus game IDs the player has completed
  loreAchievements: string[];     // Lore achievement IDs earned
  conexusXp: number;              // XP earned from CoNexus game completions
  collectedCards: string[];        // IDs of all cards the player has collected
  activeDeck: string[];            // IDs of cards in the player's active battle deck
  // Morality meter: -100 (Machine) to +100 (Humanity), zero-sum
  moralityScore: number;
  moralityChoices: { tutorialId: string; choiceId: string; shift: number }[];
  // Tutorial completions
  completedTutorials: string[];    // Tutorial IDs the player has completed
  // Morality-based unlocks
  moralityUnlocks: string[];       // IDs of morality-gated items/themes unlocked
  discoveredTransmissions: string[]; // IDs of secret morality-gated transmissions found
  // Elara relationship (BioWare-style trust and archetype tracking)
  elaraTrust: number;               // 0-100, determines what she shares
  elaraArchetype: Record<string, number>; // compassionate/pragmatic/suspicious/loyal/manipulative scores
  elaraCallbacks: Record<string, boolean>; // callback flags for future reference
  humanTrust: number;               // 0-100, trust with The Human (competing with Elara)
  humanCallbacks: Record<string, boolean>; // The Human's callback flags
  // Unified "both narrators" bond (§14.1 witnessing milestones fire at 40/60/80).
  // Separate from elaraTrust/humanTrust: those are per-narrator scores.
  // This is the shared scalar the bond-threshold milestones care about.
  // Reader: getNarratorBond() falls back to min(elaraTrust, humanTrust)
  // for saves that predate the field.
  narratorBond: number;
  // Year One Calendar month (1..12). §14.1 layers + Witnessing Hub read this.
  // Reader: getYearOneMonth() falls back to the highest set
  // `year_one_month_N_opened` flag on saves that predate the field.
  yearOneMonth: number;
  // NPC relationship tracking (5 additional NPCs beyond Elara + Human)
  npcTrust: Record<string, number>;                 // npcId → trust 0-100
  npcCallbacks: Record<string, Record<string, boolean>>; // npcId → { callbackId → triggered }
  npcRevealed: Record<string, string[]>;            // npcId → array of revelation IDs shown
  npcDiscovered: Record<string, boolean>;           // npcId → has player made contact?
  npcConversationCount: Record<string, number>;     // npcId → number of conversations
  npcSecretsShared: Record<string, number>;         // npcId → secrets shared count
  // Crafting system
  craftingSkills: Record<string, number>;   // Skill ID → level
  craftingXp: Record<string, number>;       // Skill ID → XP in current level
  craftingMaterials: Record<string, number>; // Material ID → quantity
  craftedItems: string[];                    // IDs of items crafted
  craftingLog: { recipeId: string; success: boolean; timestamp: number }[]; // Crafting history
  // Act 2 — Memory Energy: the diegetic fuel the Engineer's Bench burns.
  // Starts at MEMORY_ENERGY_STARTING; cap lifts 50 → 200 on trade_empire_unlocked.
  // See apps/shared/memoryEnergy.ts for rules.
  memoryEnergy: number;
  // Act 2 — Chess depth. Persists Zephyr-9 classroom progression; tier
  // thresholds (1/3/5/8) unlock Dischordia peek/undo/Engineer's Opening.
  // See apps/shared/act2Interlude.ts ZEPHYR_9_CLASSROOM.
  chessDepth: number;
  // Companion relationship system
  companionRelationships: Record<string, number>; // companionId → relationship level (0-100)
  companionQuestsCompleted: string[];             // Quest IDs completed
  companionQuestsActive: string[];                // Quest IDs currently active
  companionBackstoryUnlocked: string[];           // Backstory stage IDs unlocked
  companionRomanceActive: string | null;          // Active romance companion ID or null
  companionDialogHistory: Record<string, string[]>; // companionId → array of dialog choice IDs
  // Inception Ark fleet
  assignedArkId: string | null;                   // Player's assigned Inception Ark
  discoveredArks: string[];                       // Ark IDs the player has discovered
  // Diplomacy events
  completedDiplomacyEvents: string[];             // Diplomacy event IDs completed
  diplomacyChoices: { eventId: string; choiceId: string; moralityDelta: number }[];
  factionReputation: Record<string, number>;      // faction → reputation score
  // Faction War events
  factionWarState: {
    activeWar: string | null;
    warProgress: number;
    empireContribution: number;
    insurgencyContribution: number;
    playerContribution: number;
    playerFaction: "empire" | "insurgency" | null;
    completedWars: string[];
    activeExclusiveRoutes: { routeId: string; warpsRemaining: number }[];
    warHistory: { warId: string; winner: string; playerContribution: number }[];
  };
  // Companion gifts given
  giftsGiven: { giftId: string; companionId: string; timestamp: number }[];
  // Loyalty missions
  completedLoyaltyMissions: string[];              // Loyalty mission IDs completed
  activeLoyaltyMission: string | null;             // Currently active loyalty mission ID
  loyaltyMissionStep: number;                      // Current step index in active mission
  loyaltyLoreUnlocked: string[];                   // Lore revelation IDs unlocked
  loyaltyTitles: string[];                         // Earned title strings
  // ═══ NARRATIVE v2: Act Progression & Army Management ═══
  // Act tracking (7 acts of the angel/demon narrative)
  narrativeAct: number;                              // Current act (0 = not started, 1-7)
  narrativeActChoices: { actId: number; sceneId: string; choiceId: string; moralityShift: number }[];
  // ─── Prelude playhead state (save/resume inside narrativeAct 0) ───
  /**
   * The id of the Prelude beat the player is currently on, from
   * `apps/shared/preludeSequence.ts` (e.g. "beat_a", "beat_c5",
   * "beat_j"). null = Prelude not started (still on the intro).
   * Persisted so returning players resume at their last beat.
   */
  currentPreludeBeat: string | null;
  /** Completion flags fired by the Prelude orchestrator (one per beat). */
  preludeCompletedFlags: string[];
  /** Light/Dark alignment captured at Beat J. null until chosen. */
  lightDarkAlignment: "light" | "dark" | null;
  /**
   * §5.7 → §5.8 handoff: the Game Master's final public-witness
   * balance, captured at §5.7 match end. Fed into the §5.8
   * Authority trial via `computeAuthorityTrialOverride`
   * (`@shared/act1TrialHandoff`) + `deriveAuthorityVerdictOffset`
   * (+3 / 0 / −3). null = §5.7 not yet played.
   */
  act1PublicWitnessBalance: number | null;
  humanContactMade: boolean;                         // Has the player received The Human's signal?
  humanContactSecret: boolean;                       // Is the player keeping it secret from Elara?
  elaraKnowsAboutHuman: boolean;                     // Has Elara discovered The Human's signal?
  elaraDiscoveryPath: "told" | "discovered" | "betrayed" | null; // How Elara found out
  humanTrustLevel: number;                           // 0-100, how much The Human trusts the player
  elaraTrustLevel: number;                           // 0-100, how much Elara trusts the player (starts at 80)
  // Army management (AC Brotherhood-style)
  armyUnits: ArmyUnit[];                             // All recruited units
  armyDeployments: ArmyDeployment[];                 // Active deployments
  armyCompletedDeployments: CompletedDeployment[];   // Finished deployments
  armySectors: Record<string, SectorControl>;        // Sector control state
  armyRecruitmentMissionsCompleted: string[];         // Recruitment mission IDs completed
  armyTotalMissionsDeployed: number;
  armyTotalMissionsSucceeded: number;
  armyTotalMissionsFailed: number;
  // ─── Wave 2 narrative systems ───
  // Thought cabinet: thoughts currently internalizing + completed
  thoughtInternalizing: { thoughtId: string; startedAt: number }[];
  thoughtInternalized: string[];
  thoughtDiscovered: string[];
  // Player archetype: which behavioral archetypes have emerged
  archetypeEmerged: string[];
  archetypePrimary: string | null;
  archetypeEmergenceDates: Record<string, number>;
  // Political ideology: which vision the player has committed to (mutually exclusive)
  ideologyCommitted: string | null;
  ideologyFlags: Record<string, boolean>;
  // Inner voice skill levels (0-100)
  innerVoiceSkills: Record<string, number>;
  // Pet bonds per companion
  petBonds: Record<string, {
    bond: number;
    sharedMissions: number;
    isActive: boolean;
    injury: number;
    moralityDissonance: number;
    completedQuests: string[];
    evolutionStage: 1 | 2 | 3;
    deathCount: number;
  }>;
  // Apprentice system (Sith/Jedi-style custom companion)
  apprentice: unknown | null;       // Current Apprentice (shape: shared/apprentices.ts Apprentice)
  apprenticeFallen: unknown[];      // History of fallen Apprentices
  apprenticeRecruitCooldownUntil: number; // Timestamp when player can recruit again
  // Dark Arts tracking (see shared/darkArts.ts)
  corruptionLevel: number;          // 0-100
  darkAbilitiesUsed: string[];      // IDs of dark variants the player has used
  purgeRitualsCompleted: string[];  // IDs of purge rituals completed
  // Sorting Ceremony (one-time gate)
  sortingComplete: boolean;         // True once player has been sorted into a Guild
  sortedIntoArchon: number | null;  // Archon number of the Guild they were sorted into
  // Mechronis Academy — lesson transcript + professor approval
  academyTranscript: { day: number; professorId: string; lessonId: string; grade: string; xpDelta: number; timestamp: number }[];
  professorApproval: Record<string, number>;  // professorId → approval score (0-100)
  /** House Cup standings — houseId → points (can be negative via fails/detentions) */
  housePoints: Record<string, number>;
  /** Celebration Pin collection — Mascoteer-issued memorabilia, some of which drip corruption */
  pinInventory: string[];
  /** Which Mechronis House the player was sorted into (derived from dominant guild at sorting time, but pinned so late re-balances don't re-sort) */
  mechronisHouseId: string | null;
  // Celebration trial history (for combat buff integration)
  trialHistory: { day: number; mascoteerId: string; decisionId: string; optionId: string; bondDelta: number; corruptionDelta: number; moralityDelta: number }[];
  // Meme Broadcasts / Transmissions
  transmissionsWatched: string[];           // list of transmissionId strings
  transmissionsNotified: string[];          // which ones were notified
  oracleRevealActive: boolean;              // subtle Meme commentary shift (legacy boolean; prefer oracleRevealTier)
  oracleRevealTier: number;                 // 0 = hidden, 1-3 = progressively revealed as Oracle-shift episodes are watched
  /** transmissionId → last scrubbed playback position in seconds. Used to resume mid-video on the next open. */
  transmissionPlaybackPositions: Record<string, number>;
  loredexDiscovered: string[];              // loredex entity ids unlocked (from transmissions, etc.)
  // Graduate Legion — deployed apprentices
  legionRoster: unknown;            // shape: LegionRoster from graduateLegion.ts
  /** Historical roster of all graduates keyed by id */
  legionGraduates: Record<string, unknown>;  // id → Apprentice
  /** Letters from deployed apprentices — narrative micro-updates */
  legionLetters: { id: string; fromApprenticeId: string; body: string; timestamp: number; read: boolean }[];
  // ─── Prestige (§15 P3) ───
  /** How many times the player has prestiged. 0 = never. */
  prestigeLevel: number;
  /**
   * Carryover baseline from prior prestige cycles — the result of
   * applyPrestigeCarryover() at the last prestige event. null on a
   * save that has never prestiged. Added on top of the current
   * cycle's measured stats when systems need the lifetime view.
   */
  prestigeBaseline: PrestigeCycleStats | null;
}

/* ─── ROOM DEFINITIONS ─── */
export interface RoomDef {
  id: string;
  name: string;
  deck: number;
  deckName: string;
  description: string;
  elaraIntro: string;
  elaraIntroVoUrl?: string;
  imageUrl: string;
  features: string[];
  featureRoutes: string[];
  unlockRequirement: { type: "start" | "room_visited" | "items_collected" | "rooms_unlocked" | "chain_complete" | "narrative_event" | "specific_item"; value?: string | number };
  connections: string[];
  hotspots: HotspotDef[];
}

export interface HotspotDef {
  id: string;
  name: string;
  description: string;
  x: number; // percentage position
  y: number;
  width: number;
  height: number;
  type: "terminal" | "item" | "door" | "examine" | "interact";
  action?: string; // route to navigate or item to collect
  elaraDialog?: string;
  icon?: string;
  requiresItem?: string;
}

export const ROOM_DEFINITIONS: RoomDef[] = [
  {
    id: "cryo-bay",
    name: "Cryo Bay",
    deck: 1,
    deckName: "Habitation",
    description: "Your cryogenic pod sits among rows of others — most empty, some still sealed with frost. The air is cold and stale. Emergency lights cast long shadows across the metal floor.",
    elaraIntroVoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara-cryo-bay_b6e77245.mp3",
    elaraIntro: "The Chamber of Awakening. You were not born here... but you returned to yourself within these walls. Your pod stands among the others — one vessel in a field of silence. Most have opened. The first wave of Potentials passed through long before you, stepping into the war and leaving nothing behind but absence. But not all cycles completed. Some remain sealed. Unbroken. Unanswered. The systems still hum around them, but what they sustain... is unclear. Life, suspended between moments — or failure, preserved beyond its end. I have traced the signals. They do not resolve cleanly. And so I do not open them. There are thresholds in this Ark that are better left... untested.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_cryo_bay-SdeEqURrDvgrrbJq4WK3N5.webp",
    features: ["Character Sheet", "Settings", "Profile"],
    featureRoutes: ["/character-sheet", "/create-citizen"],
    unlockRequirement: { type: "start" },
    connections: ["medical-bay", "bridge"],
    hotspots: [
      // Realigned 2026-04-25 to match the AAA Final cryo-bay render —
      // a symmetrical corridor with sealed-pod rows on both side walls,
      // the player's tilted/open pod centred mid-frame with cryo gas
      // spilling onto the floor, and a back doorway leading to the
      // Bridge stairs. The previous coords were calibrated for the
      // legacy single-pod render and put the door markers on top of
      // sealed pods. See /tmp/cryo_new_hotspots.png in the dev session
      // for the visual overlay verification.
      { id: "cryo-pod", name: "Your Cryo Pod", description: "The pod you woke up in. Frost still clings to the glass. A data readout shows your vitals — somehow you survived.", x: 47, y: 18, width: 22, height: 60, type: "examine", elaraDialog: "That's your pod. Serial number AK-74-0074. You were in deep cryogenic suspension for... the chronometer is corrupted. Could be decades. Could be centuries." },
      { id: "sealed-pods", name: "Sealed Pods", description: "Several pods remain sealed, their status indicators dark. Are they occupied?", x: 6, y: 28, width: 28, height: 35, type: "examine", elaraDialog: "Those pods are still sealed. Their status indicators went dark when the main power failed. I... I don't want to speculate about what's inside them. Not yet." },
      { id: "cryo-terminal", name: "Cryo Terminal", description: "A terminal displaying your character data and vital statistics.", x: 5, y: 62, width: 14, height: 22, type: "terminal", action: "/character-sheet", elaraDialog: "This terminal has your biometric data — your species markers, class aptitudes, everything we determined during your awakening. You can review your Citizen profile here." },
      { id: "door-medical", name: "Medical Bay Door", description: "A reinforced door leading to the Medical Bay. Green status light.", x: 80, y: 65, width: 18, height: 32, type: "door", action: "medical-bay" },
      { id: "door-bridge", name: "Bridge Access", description: "A corridor leading up to Deck 2 — the Command deck.", x: 43, y: 22, width: 14, height: 26, type: "door", action: "bridge" },
      { id: "data-crystal", name: "Data Crystal", description: "A glowing crystal wedged under a pod. It contains encrypted data.", x: 38, y: 80, width: 7, height: 8, type: "item", action: "data-crystal-alpha", elaraDialog: "A data crystal! These were used by the first wave to store personal logs. This one might contain information about what happened after they woke up." },
      { id: "egg-cryo-scratch", name: "Scratched Symbol", description: "Barely visible scratch marks on the wall behind a pod.", x: 87, y: 36, width: 3, height: 5, type: "examine", elaraDialog: "Wait... those scratch marks. They form a symbol — the mark of the Antiquarian. But that's impossible. The Antiquarian is a myth, a figure from the deepest layers of the prophecy. Who carved this here, and when? This predates our launch." },
      // Section F — Cryo Bay mystery hotspots. Each fires through the
      // cryo-mystery hotspot-handler branch in ArkExplorerPage which
      // resolves the Look response via resolveVerbResponse(). The
      // mystery cluster anchors on a single dark pod on the right wall
      // (distinct from the player's pod and the rest of the sealed
      // row) so the chart / glass / cracked-panel / fallen items read
      // as one investigation scene.
      { id: "dead-pod", name: "Dark Cryo Pod", description: "A pod whose status indicator is cold-blue instead of warm-gold. Something is in there.", x: 72, y: 30, width: 13, height: 28, type: "interact", action: "cryo-mystery:dead-pod" },
      { id: "cracked-panel", name: "Cracked Control Panel", description: "The dark pod's control panel is split along a hairline seam. Sabotage?", x: 72, y: 58, width: 13, height: 6, type: "interact", action: "cryo-mystery:cracked-panel" },
      { id: "medical-chart", name: "Medical Chart", description: "A printed medical chart magnet-clipped to the dark pod.", x: 78, y: 38, width: 4, height: 6, type: "interact", action: "cryo-mystery:medical-chart" },
      { id: "frosted-glass", name: "Frosted Pod Glass", description: "Wipe the frost — see who's inside.", x: 73, y: 33, width: 7, height: 10, type: "interact", action: "cryo-mystery:frosted-glass" },
      { id: "personal-effect", name: "Fallen Locket", description: "Something small has fallen under the pod housing.", x: 76, y: 64, width: 4, height: 4, type: "interact", action: "cryo-mystery:personal-effect" },
      { id: "data-slate", name: "Hidden Data Slate", description: "The edge of a data-slate peeks out from under the pod.", x: 68, y: 66, width: 5, height: 3, type: "interact", action: "cryo-mystery:data-slate" },
    ],
  },
  {
    id: "medical-bay",
    name: "Medical Bay",
    deck: 1,
    deckName: "Habitation",
    elaraIntroVoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara-medical-bay_8456228a.mp3",
    description: "Surgical equipment and diagnostic scanners line the walls. A bio-bed sits in the center, its holographic display still active. Something happened here — broken glass crunches underfoot.",
    elaraIntro: "The Medical Bay... though there is little here now that resembles healing. This is where the Potentials were first measured — not for what they were... but for what they could become. The instruments that remain still function. They read beyond flesh — mapping your cellular structure, tracing your vitality, and attuning to the deeper signal... your Dream resonance. This was never just a place of recovery. It was calibration. But something interrupted the process. Look closely — the tools are not set aside... they were abandoned. Glass shattered mid-procedure. Instruments left where they fell. Not the stillness of completion — but the fracture of urgency. Whoever worked here did not leave by choice. And whatever they saw... they did not stay to understand.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_medical_bay-gLunh6wxp8sNASjZDo5FpV.webp",
    features: ["Citizen Stats", "Upgrades", "Dream Balance"],
    featureRoutes: ["/character-sheet"],
    // Section F — Med Bay is sealed until the player has logged their
    // first cryo-mystery clue. A single Look at any investigative
    // hotspot flips cryo_mystery_first_clue_found and the door opens.
    unlockRequirement: { type: "narrative_event", value: "cryo_mystery_first_clue_found" },
    connections: ["cryo-bay"],
    hotspots: [
      // Realigned 2026-04-25 to match the AAA Final medical-bay render —
      // a symmetrical exam room with a central stasis chamber + chair +
      // overhead surgical arm, twin DNA scanners flanking it, a sealed
      // door on the left wall, and a medicine-cabinet equipment shelf
      // on the right wall. Previous coords had `medicine-cabinet`
      // sitting on the left door, `door-cryo` floating off the left
      // edge, and `dna-helix` overlapping the right-wall cabinet.
      { id: "bio-bed", name: "Bio-Bed Scanner", description: "An advanced diagnostic bed with holographic readouts showing your current stats.", x: 40, y: 22, width: 22, height: 55, type: "terminal", action: "/character-sheet", elaraDialog: "The bio-bed can give you a full diagnostic. Your stats, your Dream resonance levels, your cellular integrity. Step on and I'll run a scan." },
      // Medical Bay mystery hotspots — see apps/shared/roomMysteries/medicalBay.ts
      // for the verb × hotspot matrix. The first Look on either of
      // these logs a clue and flips `medbay_first_clue_found` (Tier 0 → 1).
      { id: "dna-helix", name: "DNA Analysis Station", description: "A holographic double helix rotates slowly, mapping genetic markers.", x: 22, y: 28, width: 18, height: 42, type: "examine", action: "room-mystery:medical-bay:dna-helix", elaraDialog: "The DNA analysis station. It maps your genetic markers against known species templates. DeMagi, Quarchon, Ne-Yon... your hybrid signature is fascinating." },
      { id: "medicine-cabinet", name: "Medicine Cabinet", description: "Vials of glowing liquid. Some are labeled, others are not.", x: 82, y: 32, width: 14, height: 42, type: "examine", action: "room-mystery:medical-bay:medicine-cabinet", elaraDialog: "Medical supplies. Most are standard stim-packs and neural stabilizers. But some of these vials... I don't recognize the compounds. They weren't in the original manifest." },
      { id: "medical-log", name: "Medical Log", description: "A data pad with the last medical officer's notes.", x: 25, y: 68, width: 10, height: 8, type: "item", action: "medical-log-001", elaraDialog: "The last medical officer's log. Dated... I can't read the timestamp. But the entries describe patients with unusual symptoms. Nightmares. Voices. Something about 'the signal.'" },
      { id: "observation-keycard", name: "Observation Keycard", description: "A biometric access card labeled 'OBS-DECK'. Stored in the medical safe.", x: 62, y: 66, width: 10, height: 10, type: "item", action: "observation-keycard", elaraDialog: "The Observation Keycard! It was in the medical safe all along. The previous crew stored sensitive access cards here for security. This will unlock the Observation Deck — the crew used it to monitor deep space anomalies. Take it." },
      { id: "door-cryo", name: "Cryo Bay Door", description: "Return to the Cryo Bay.", x: 6, y: 30, width: 15, height: 45, type: "door", action: "cryo-bay" },
      { id: "egg-med-vial", name: "Unlabeled Vial", description: "A tiny vial of shimmering black liquid hidden behind the cabinet.", x: 85, y: 62, width: 3, height: 4, type: "item", action: "void-essence-sample", elaraDialog: "That vial... the liquid inside is moving on its own. The molecular structure doesn't match anything in my database. It's not from any known universe. The label has been torn off, but there's a serial number: VE-001. 'VE' — Void Essence? This shouldn't exist on this ship." },
      { id: "egg-vox-neural-bridge", name: "Unkempt Neural Device", description: "A hidden device behind the bio-bed's maintenance panel. Cables still warm. A humming needle-port waits for a DNA sample.", x: 46, y: 72, width: 5, height: 5, type: "interact", action: "dna-device-offer", elaraDialog: "[STATIC BURST] It's humming at a frequency your teeth can feel. A neural-bridge apparatus — military grade, built by Dr. Lyra Vox to move consciousness between a body and the Ark itself. It wants a sample. You don't know what it will give you back." },
    ],
  },
  {
    id: "bridge",
    name: "Command Bridge",
    deck: 2,
    deckName: "Command",
    elaraIntroVoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara-bridge_49bd8959.mp3",
    description: "The nerve center of the Inception Ark. Holographic star charts flicker above the central console. The captain's chair sits empty, facing a massive viewport showing the void of space.",
    elaraIntro: "You have arrived at the Bridge... the place where direction becomes decision. From here, the Ark does not merely travel — it chooses where reality is touched next. The central display holds what the first crew began to assemble — a living web of intelligence. Every entity, every faction, every hidden allegiance within the Dischordian Saga mapped not as data... but as consequence. They called it a Conspiracy Board. In truth, it is a map of influence — a record of how power moves through existence. Above it, the timeline projector unfolds the Ages. Not as a fixed past... but as a continuum of events still echoing forward, each moment layered upon the next, still shaping what is yet to come. But the Bridge is incomplete. The Navigation Console remains sealed — its systems bound behind a cipher not of human design. An alien language of glyphs and intent that the previous crew could not resolve. They tried. They failed. And so the Ark remained... grounded between paths. If you can decipher it — if you can understand what they could not — the Ark will awaken its true movement. Instant traversal. A folding of distance itself. Exploration will no longer be effort... it will be choice. But understand this — navigation is never neutral. To choose where to go... is to choose what you are willing to change.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_bridge-g5ANMfUqgxd8ZnPgh9h6nd.webp",
    features: ["Conspiracy Board", "Timeline", "Quests", "Guild", "Diplomacy", "Faction Wars"],
    featureRoutes: ["/board", "/timeline", "/saga-timeline", "/quests", "/guild", "/diplomacy", "/faction-wars", "/war-map"],
    unlockRequirement: { type: "room_visited", value: "cryo-bay" },
    connections: ["cryo-bay", "archives", "comms-array"],
    hotspots: [
      // Realigned 2026-04-25 for the AAA Final bridge render — central
      // wheel/portal back-wall display (the Conspiracy Board), flanking
      // viewport windows, twin console+chair workstations in foreground.
      { id: "tactical-display", name: "Tactical Display", description: "A massive holographic display showing connections between entities, factions, and events.", x: 37, y: 18, width: 26, height: 50, type: "terminal", action: "/board", elaraDialog: "The Conspiracy Board. Every entity, every faction, every connection we've mapped in the Dischordian Saga. It's a web of alliances, betrayals, and secrets. The more you explore, the more connections you'll uncover." },
      { id: "timeline-projector", name: "Timeline Projector", description: "A holographic projector showing the Ages of the Dischordian Saga.", x: 74, y: 14, width: 18, height: 32, type: "terminal", action: "/saga-timeline", elaraDialog: "The Timeline Projector. It maps the entire history of the Dischordian Saga across the Ages — from the Age of Privacy through the Fall of Reality and beyond. Each era tells a different chapter of the story." },
      // Bridge mystery hotspots — see apps/shared/roomMysteries/bridge.ts.
      // Look on captains-chair / nav-console examine logs a clue and
      // flips `bridge_first_clue_found` (Tier 0 → 1). The nav console's
      // existing nav-calibration interact action runs separately on
      // `use` and unlocks fast travel.
      { id: "captains-chair", name: "Captain's Chair", description: "The command chair sits empty. A personal data pad is wedged in the armrest.", x: 74, y: 60, width: 18, height: 24, type: "examine", action: "room-mystery:bridge:captains-chair", elaraDialog: "The Captain's chair. Dr. Lyra Vox designed the neural nanobot network that runs every system on this ship. She was the last to sit here before ordering the emergency cryo protocol. Something about her doesn't add up — a neuropsychologist with that level of access to the ship's core systems. Her personal log might still be in the armrest terminal." },
      { id: "nav-console", name: "Navigation Console", description: "Star charts and route calculations. An alien glyph interface awaits calibration.", x: 8, y: 56, width: 22, height: 26, type: "interact", action: "nav-calibration", elaraDialog: "The navigation console. It controls the Ark's fast-travel system, but the interface uses alien glyph sequences for authentication. Match the symbol pattern to bring the navigation grid online — then you can jump to any room you've already discovered." },
      { id: "quest-board", name: "Mission Board", description: "A holographic board displaying active missions and quest objectives.", x: 70, y: 56, width: 22, height: 26, type: "terminal", action: "/quests", elaraDialog: "The Mission Board. Active operations and quest objectives are tracked here. Complete missions to earn rewards, uncover lore, and advance the story. Some missions are time-sensitive — the Saga doesn't wait for anyone." },
      { id: "guild-console", name: "Guild Registry", description: "A console for managing guild operations and alliances.", x: 10, y: 16, width: 16, height: 30, type: "terminal", action: "/guild", elaraDialog: "The Guild Registry. Form alliances with other Potentials, coordinate operations, and compete for dominance. Guilds that work together can tackle challenges no individual could face alone." },
      { id: "diplomacy-table", name: "Diplomacy Table", description: "A round table with holographic faction representatives.", x: 40, y: 76, width: 22, height: 18, type: "terminal", action: "/diplomacy", elaraDialog: "The Diplomacy Table. Negotiate with factions, forge alliances, or declare rivalries. Every diplomatic decision shifts the balance of power across the Saga. Choose your allies carefully." },
      { id: "war-map-display", name: "War Map", description: "A strategic overlay showing faction territories and conflict zones.", x: 60, y: 86, width: 16, height: 12, type: "terminal", action: "/war-map", elaraDialog: "The War Map. Faction territories, conflict zones, and strategic objectives are all tracked here. When faction wars erupt, this is where commanders plan their campaigns." },
      { id: "door-archives", name: "Archives Access", description: "A secured door leading to the Archives.", x: 88, y: 60, width: 10, height: 36, type: "door", action: "archives" },
      { id: "door-cryo", name: "Cryo Bay Stairs", description: "Stairs leading down to Deck 1.", x: 2, y: 60, width: 10, height: 36, type: "door", action: "cryo-bay" },
      { id: "door-comms", name: "Comms Array Corridor", description: "A corridor leading to the Communications Array.", x: 38, y: 92, width: 24, height: 7, type: "door", action: "comms-array" },
      { id: "captains-master-key", name: "Captain's Master Key", description: "A heavy magnetic key hidden in a compartment beneath the captain's armrest.", x: 78, y: 74, width: 4, height: 5, type: "item", action: "captains-master-key", elaraDialog: "The Captain's Master Key! It was hidden in a compartment beneath the armrest — exactly where a commander would keep their most important tool. This key opens the Captain's Quarters, the most restricted area on the ship. Whatever secrets Dr. Lyra Vox was hiding, they're behind that door." },
      { id: "egg-bridge-log", name: "Hidden Data Chip", description: "A micro data chip wedged into the captain's armrest.", x: 80, y: 70, width: 3, height: 4, type: "item", action: "captains-final-log", elaraDialog: "A hidden data chip! Someone concealed this in the armrest before the ship was stolen. Let me decrypt it... 'If you're reading this, the mind swap was successful. I am not who you think I am. The Engineer lives. Find the yellow coats.' The Engineer... hiding among the Potentials? And those yellow coats — that's the Warlord's signature. This changes everything." },
      { id: "egg-infected-starmap", name: "Corrupted Star Chart", description: "A star chart with routes that weren't in the original navigation database. The coordinates pulse with a sickly amber glow.", x: 18, y: 22, width: 5, height: 5, type: "item", action: "infected-starmap", elaraDialog: "[SIGNAL CORRUPTION] These coordinates... they weren't programmed by the crew. The Warlord, through Dr. Vox, uploaded a secondary route map into the navigation core. The routes connect every Inception Ark in the fleet — a delivery network. When Kael stole this ship, the Warlord let him go — because Kael was already Patient Zero, infected through Project Vector. The Thought Virus was in HIM. Every Ark this ship contacted, every port it docked at, every signal it broadcast — the virus spread from Kael's infected body through the ship's systems into every network it touched. Kael thought he was escaping. He was being deployed. The Recruiter became the delivery mechanism for the very weapon he was fighting against." },
    ],
  },
  {
    id: "archives",
    name: "Archives",
    deck: 2,
    deckName: "Command",
    elaraIntroVoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara-archives_13b76780.mp3",
    description: "Floor-to-ceiling data banks hum with stored information. Holographic terminals display searchable databases. Ancient tomes sit alongside data crystals in glass cases.",
    elaraIntro: "The Archives... though what rests here is not merely information. This is where knowledge is gathered... refined... remembered. Every fragment recovered from the Dischordian Saga woven into a living record of existence in motion. You may search it — trace the threads of any entity: the players, the places, the factions... even the songs that carry truth beneath their rhythm. But do not confuse access with understanding. Beyond the surface... lies the Codex. It does not yield to curiosity alone. Its deeper layers are not locked by encryption — but by comprehension. To open them, you must study... interpret... and, in time... become what you seek. Because the Archives do not simply contain the story. They remember it. And the further you descend... the more they begin... to remember you.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_archives-ZHkbF8dmAL5SyqykdLgy3n.webp",
    features: ["Search", "Entity Browser", "Codex Library"],
    featureRoutes: ["/search", "/codex"],
    unlockRequirement: { type: "room_visited", value: "bridge" },
    connections: ["bridge"],
    hotspots: [
      // Realigned 2026-04-25 for the AAA Final archives render — circular
      // chamber with a raised central platform holding a glowing data orb,
      // an orange-glowing archway centre-back (the Bridge exit), panel
      // displays running left and right along the curved back wall, and
      // podium pedestals arranged around the platform.
      { id: "search-terminal", name: "Search Terminal", description: "A powerful database terminal that can search across all known entities.", x: 42, y: 38, width: 16, height: 30, type: "terminal", action: "/search", elaraDialog: "The main search terminal. Type any name, alias, or keyword and it will scan our entire database. Characters, locations, factions, songs — everything is indexed and cross-referenced." },
      { id: "codex-shelf", name: "The Codex", description: "Ancient tomes and data crystals containing deep lore.", x: 65, y: 22, width: 22, height: 38, type: "terminal", action: "/codex", elaraDialog: "The Codex. These are the deeper lore entries — the histories, the prophecies, the classified files. Some entries are locked until you discover enough connections to piece them together." },
      { id: "data-banks", name: "Data Banks", description: "Rows of humming data storage units containing centuries of records.", x: 13, y: 22, width: 22, height: 38, type: "examine", elaraDialog: "Petabytes of data. Ship logs, personnel records, scientific research, intercepted transmissions. Most of it is corrupted or encrypted. I'm still trying to recover what I can." },
      { id: "archive-crystal", name: "Encoded Crystal", description: "A crystal pulsing with amber light, partially decoded.", x: 55, y: 70, width: 7, height: 8, type: "item", action: "archive-crystal-beta", elaraDialog: "Another data crystal. This one has partial decryption — it seems to contain information about the Panopticon's surveillance network. The Architect's eyes were everywhere." },
      { id: "door-bridge", name: "Bridge Door", description: "Return to the Command Bridge.", x: 54, y: 38, width: 10, height: 30, type: "door", action: "bridge" },
      { id: "egg-archive-tome", name: "Unmarked Tome", description: "A book with no title, bound in material that feels warm to the touch.", x: 85, y: 70, width: 4, height: 6, type: "examine", elaraDialog: "This book... it's not in any catalog. The binding material is organic — it's warm, like skin. The pages contain a prophecy written in a language I can't translate, but one word repeats: 'Dischord.' And at the very end, a drawing of seven seals. The Book of Revelation speaks of seven seals. Silence in Heaven follows the opening of the seventh." },
    ],
  },
  {
    id: "comms-array",
    name: "Comms Array",
    deck: 3,
    deckName: "Operations",
    elaraIntroVoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara-comms-array_8f0396f6.mp3",
    description: "Banks of communication equipment fill the room. Screens display static and fragments of intercepted transmissions. A large antenna array is visible through a reinforced window.",
    elaraIntro: "The Communications Array... where the void is given a voice — and where echoes sometimes answer back. From this chamber, signals are cast across the darkness, and what returns is not always bound by origin or intent. The Saga flows through these channels without end — the recorded memory of the Dischordian conflict, circling itself like a truth that refuses to conclude. But there are other signals. Fragments that break the pattern. Intrusions that do not belong. They arrive without signature... without trajectory... without source. I have traced every frequency, every layer of the spectrum the Ark can perceive — and still... nothing resolves. No origin. No sender. Only the signal. Something is reaching across the void. And it does not require us to understand.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_comms_array-MeKGcBZGammMEjbx8aN8fb.webp",
    features: ["Watch The Saga", "Late Night with the Meme", "Radio", "Lore Tutorials", "Communication Relay"],
    featureRoutes: ["/watch", "/transmissions", "/lore-tutorials"],
    unlockRequirement: { type: "narrative_event", value: "bridge_systems_restored" },
    connections: ["bridge", "observation-deck"],
    hotspots: [
      // Realigned 2026-04-25 for the AAA Final comms-array render — a
      // back-wall grid of glowing broadcast screens, a central control
      // console in the foreground, dim corridor exits at far-left and
      // far-right. The screen grid is split into left/right halves for
      // the two streaming surfaces and two singled-out screens call out
      // the static + pirate-frequency hotspots.
      { id: "broadcast-screen", name: "Broadcast Screen", description: "A large screen playing recorded episodes of the Dischordian Saga.", x: 26, y: 22, width: 22, height: 28, type: "terminal", action: "/watch", elaraDialog: "The broadcast system. It plays the recorded history of the Dischordian Saga in episodic format. Each epoch covers a different era — from the Age of Privacy through the Fall of Reality. Watch carefully. There are clues hidden in every episode." },
      { id: "late-night-tv", name: "Pirate Frequency TV", description: "A battered CRT television set tuned to a frequency that shouldn't exist. The signal comes and goes. Sometimes a handsome devil speaks directly to you.", x: 62, y: 8, width: 14, height: 18, type: "terminal", action: "/transmissions", elaraDialog: "This... this isn't supposed to be here. It's tuned to a frequency outside the Ark's normal broadcast spectrum. The signal ID reads 'MEME-PRIME.' Whoever is broadcasting has been recording the entire Dischordian Saga — and narrating it with alarming personal knowledge. The episodes unlock as you progress. It calls itself 'Late Night with the Meme.' I don't trust it. But I can't stop watching either." },
      { id: "radio-console", name: "Radio Console", description: "A radio tuner picking up fragments of music from across the multiverse.", x: 52, y: 22, width: 18, height: 28, type: "examine", elaraDialog: "The radio picks up fragments of music transmissions. Songs from Malkia Ukweli and the Panopticon — they seem to broadcast across dimensional barriers. Each song tells part of the story." },
      { id: "static-screen", name: "Static Screen", description: "A screen showing nothing but static. Occasionally, shapes seem to form in the noise.", x: 12, y: 30, width: 8, height: 18, type: "examine", elaraDialog: "That screen has been showing static since I can remember. But sometimes... sometimes I think I see patterns in it. Faces. Words. It's probably just signal degradation. Probably." },
      { id: "training-console", name: "Training Console", description: "An interactive tutorial system explaining the lore and mechanics of the Dischordian Saga.", x: 36, y: 60, width: 28, height: 28, type: "terminal", action: "/lore-tutorials", elaraDialog: "The Training Console. It contains interactive tutorials covering the lore, factions, game mechanics, and history of the Dischordian Saga. Essential reading for new Potentials. Even veterans might learn something new." },
      { id: "door-bridge", name: "Bridge Corridor", description: "Return to the Command Bridge.", x: 1, y: 30, width: 8, height: 50, type: "door", action: "bridge" },
      { id: "door-observation", name: "Observation Deck", description: "A passage to the Observation Deck.", x: 91, y: 30, width: 8, height: 50, type: "door", action: "observation-deck" },
      { id: "comms-relay", name: "Communication Relay", description: "A powerful relay antenna capable of scanning for neural signatures across the fleet. Used to scan for Potential signatures across the fleet.", x: 78, y: 12, width: 12, height: 18, type: "interact", action: "comms-relay-import", elaraDialog: "The Communication Relay. I've been trying to re-establish contact with the other vessels — the ones that carried the first wave of Potentials into the void. I can scan for dormant neural signatures across the fleet. Perhaps we can identify other Potentials who survived the journey." },
      { id: "egg-comms-signal", name: "Anomalous Frequency", description: "A barely audible signal on a frequency that shouldn't exist.", x: 82, y: 50, width: 3, height: 4, type: "examine", elaraDialog: "That frequency... it's not on any standard band. The signal is repeating a pattern: three short, three long, three short. An SOS. But the origin coordinates point to a location that doesn't exist in normal space. Someone — or something — is calling for help from between dimensions. The signal is tagged with an identifier: 'MEME-PRIME.'" },
    ],
  },
  {
    id: "observation-deck",
    name: "Observation Deck",
    deck: 3,
    deckName: "Operations",
    elaraIntroVoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara-observation-deck_69c97750.mp3",
    description: "A vast transparent dome reveals the infinite expanse of space. Comfortable seating faces the viewport. A music system plays softly. This was clearly a place of reflection.",
    elaraIntro: "The Observation Deck. The crew used to come here to decompress. The music system has the complete discography — every album, every track. The viewport shows... well, space. But it's different than what the star charts predicted. The constellations are wrong.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_observation_deck-DbxXnUWAHiiLro4YP8rDUg.webp",
    features: ["Discography", "Music Player", "Lyrics"],
    featureRoutes: ["/discography"],
    unlockRequirement: { type: "specific_item", value: "observation-keycard" },
    connections: ["comms-array", "engineering"],
    hotspots: [
      // Realigned 2026-04-25 against the actual delivered art (the
      // Vortex-rift / telescope / communion-bench prompt was an earlier
      // brief; the shipped render is a lounge: bar with backlit shelves
      // on the left, sectional couch + glass coffee table foreground-
      // centre, bioluminescent cylindrical aquariums in the corners,
      // an audio-spectrum visualiser integrated into the right side of
      // the viewport, nebula + ceiling skylight panels filling the upper
      // two-thirds.
      { id: "music-terminal", name: "Music Terminal", description: "A sophisticated music system with the complete discography of Malkia Ukweli & the Panopticon.", x: 62, y: 55, width: 28, height: 22, type: "terminal", action: "/discography", elaraDialog: "The complete discography. Four albums spanning the entire narrative — Dischordian Logic, The Age of Privacy, The Book of Daniel 2:47, and the upcoming Silence in Heaven. Every song is a piece of the puzzle." },
      { id: "viewport", name: "Viewport", description: "The vast expanse of space stretches before you. The stars look... wrong.", x: 30, y: 2, width: 65, height: 70, type: "examine", elaraDialog: "Look at the stars. They're beautiful, aren't they? But they're wrong. The constellations don't match any known configuration from any of the mapped universes. Either we've traveled very, very far... or we're somewhere that shouldn't exist." },
      { id: "crew-memorial", name: "Crew Memorial", description: "A small memorial with names etched in light. The crew who didn't make it.", x: 6, y: 24, width: 24, height: 36, type: "examine", elaraDialog: "A memorial for the crew members who didn't survive the journey. One thousand and forty-seven names. They gave their lives to keep the Ark running while the Potentials slept. I remember every one of them." },
      { id: "door-comms", name: "Comms Array", description: "Return to the Communications Array.", x: 1, y: 80, width: 18, height: 18, type: "door", action: "comms-array" },
      { id: "door-engineering", name: "Engineering Access", description: "A maintenance hatch leading down to Engineering.", x: 95, y: 30, width: 5, height: 55, type: "door", action: "engineering" },
      { id: "egg-obs-constellation", name: "Strange Constellation", description: "A pattern of stars that seems to form a face.", x: 44, y: 8, width: 5, height: 6, type: "examine", elaraDialog: "Do you see it? That cluster of stars... if you connect them, they form a face. Not just any face — it looks like the Watcher. The all-seeing eye of the Panopticon's surveillance network. But we're light-years from Panopticon space. How can the stars themselves form his likeness? Unless... the stars were arranged. By someone with the power to move suns." },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    deck: 4,
    deckName: "Technical",
    elaraIntroVoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara-engineering_2363948d.mp3",
    description: "A massive reactor core pulses with blue-white energy behind reinforced glass. Workbenches are covered with tools and half-assembled devices. Holographic blueprints float above a central workstation.",
    elaraIntro: "Engineering. The heart of the Ark's power systems. The Research Lab here can be used to craft and fuse cards — combining lesser cards into more powerful ones. The blueprints show schematics for card designs that were never completed. Perhaps you can finish what the engineers started.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_engineering-7B58pQup6v64GgmmT7stby.webp",
    features: ["Card Crafting", "Research Lab", "Research Minigame"],
    featureRoutes: ["/research-lab", "/research-minigame"],
    unlockRequirement: { type: "narrative_event", value: "power_grid_restored" },
    connections: ["observation-deck", "armory", "forge-workshop"],
    hotspots: [
      // Realigned 2026-04-25 for the AAA Final engineering render —
      // industrial workshop with back-wall reactor machinery (ENGINEERING
      // signage + glowing core), twin rows of workstation seats on left
      // and right, central floor strip leading to a back-wall doorway
      // (Forge), and side-edge exits to Observation and Armory.
      { id: "crafting-bench", name: "Crafting Workbench", description: "A workbench with tools for card crafting and fusion experiments.", x: 12, y: 50, width: 22, height: 32, type: "terminal", action: "/research-lab", elaraDialog: "The crafting workbench. Here you can fuse cards together to create more powerful versions. The recipes were developed by the Ark's engineers — combine the right elements and you might create something legendary." },
      // Engineering mystery hotspots — see apps/shared/roomMysteries/engineering.ts.
      // First Look on either of these (or the etched-formula easter
      // egg below) logs a clue and flips `engineering_first_clue_found`
      // (Tier 0 → 1).
      { id: "reactor-core", name: "Reactor Core", description: "The Ark's main power source. It pulses with an otherworldly blue light.", x: 38, y: 18, width: 24, height: 38, type: "examine", action: "room-mystery:engineering:reactor-core", elaraDialog: "The reactor core. It runs on a substance the engineers called 'Dream' — a crystallized form of quantum consciousness. It's the same resource that powers your abilities. The core is running at 34% capacity. We're losing power slowly." },
      { id: "blueprints", name: "Holographic Blueprints", description: "Floating schematics showing card designs and weapon systems.", x: 66, y: 50, width: 22, height: 32, type: "examine", action: "room-mystery:engineering:blueprints", elaraDialog: "Card schematics. The engineers were designing new card types before... before they stopped. Some of these designs are brilliant. Legendary-tier cards that could turn the tide of any battle." },
      { id: "research-station", name: "Research Station", description: "An interactive research terminal with puzzles and experiments.", x: 40, y: 65, width: 20, height: 22, type: "terminal", action: "/research-minigame", elaraDialog: "The Research Station. Solve engineering puzzles and conduct experiments to unlock new card recipes and crafting techniques. The harder the puzzle, the rarer the reward." },
      { id: "door-observation", name: "Observation Deck", description: "Return to the Observation Deck.", x: 1, y: 30, width: 8, height: 50, type: "door", action: "observation-deck" },
      { id: "door-armory", name: "Armory Access", description: "A reinforced door leading to the Armory.", x: 91, y: 30, width: 8, height: 50, type: "door", action: "armory" },
      { id: "door-forge", name: "Forge Workshop", description: "A heavy blast door with heat warnings. The air shimmers.", x: 44, y: 32, width: 12, height: 22, type: "door", action: "forge-workshop" },
      { id: "egg-eng-formula", name: "Etched Formula", description: "A mathematical formula scratched into the reactor housing.", x: 50, y: 24, width: 4, height: 4, type: "examine", action: "room-mystery:engineering:egg-eng-formula", elaraDialog: "Someone etched a formula into the reactor housing. It's a dimensional resonance equation — the kind used to calculate jumps between parallel universes. But there's an extra variable I've never seen: Ψ-null. The null consciousness coefficient. This formula could theoretically open a door to... nowhere. The space between spaces. Where the Source dwells." },
      { id: "egg-warlord-residue", name: "Bio-Scanner Anomaly", description: "The bio-scanner flickers with an unidentified neural signature embedded in the bulkhead.", x: 70, y: 76, width: 4, height: 4, type: "item", action: "warlord-residue", elaraDialog: "[SIGNAL DISTORTION] The bio-scanners are detecting... no. That can't be right. There's a neural signature embedded in the bulkhead plating itself. Not organic, not synthetic — something in between. The Warlord's consciousness was so powerful that it left an imprint on the ship's physical structure. Dr. Lyra Vox commanded this vessel while the Warlord used her as a host body. The walls literally remember their master. {playerName}, this ship has a darker history than I initially disclosed. The Warlord didn't just pass through here — this was a command vessel." },
    ],
  },
  {
    id: "forge-workshop",
    name: "The Forge Workshop",
    deck: 4,
    deckName: "Technical",
    description: "A cavernous workshop dominated by a massive central forge that burns with shifting prismatic flames. Anvils of different metals line the walls — one glows with void energy, another hums with crystalline resonance. Weapon racks display crafted prototypes. Holographic recipe schematics float above workstations. The air is thick with heat and the smell of ozone.",
    elaraIntro: "The Forge Workshop. This is where raw materials become weapons of power. The original engineers built this facility to process materials salvaged from the void — battle shards, crystal fragments, void metal. Every crafting discipline is represented here: weaponsmithing, armorsmithing, enchanting, alchemy, and engineering. The forge responds to skill — the more you craft, the more recipes unlock. I've catalogued the material sources: combat drops from the Arena, trade goods from the Empire, essence from card sacrifice, and fragments from Ark exploration. Everything connects here.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_forge_workshop-o2LLK65f5Nacwc8TcpkNXe.webp",
    features: ["Crafting Station", "Material Vault", "Recipe Archive"],
    featureRoutes: ["/forge"],
    unlockRequirement: { type: "room_visited", value: "engineering" },
    connections: ["engineering"],
    hotspots: [
      // Realigned 2026-04-25 against the delivered render — central
      // forge with prismatic rainbow flames erupting upward, five
      // element-themed anvils flanking it (purple/void, blue/water,
      // green/earth on the left; gold/fire, magenta/cyber on the
      // right), holographic schematic display panels mounted above the
      // anvils on each wall, weapon racks at the far edges, archway
      // pathway on the foreground floor.
      { id: "central-forge", name: "Prismatic Forge", description: "The main crafting station. Prismatic flames shift color based on what's being forged.", x: 38, y: 18, width: 24, height: 70, type: "terminal", action: "/forge", elaraDialog: "The Prismatic Forge. Its flames change color based on the materials you feed it — blue for void metal, green for crystal shards, gold for legendary essence. Step up to the forge and I'll guide you through the crafting process. Every item you create here provides real combat advantages in the Arena, strategic bonuses in Card Battles, and trade benefits in the Empire." },
      { id: "material-vault", name: "Material Vault", description: "Secured storage for crafting materials. Organized by source and rarity.", x: 0, y: 30, width: 12, height: 50, type: "examine", elaraDialog: "The Material Vault. Your crafting materials are stored here — battle shards from Arena victories, trade metals from the Empire, card essence from sacrificed cards, and ark fragments from exploration. The vault automatically sorts by rarity. I'd recommend stockpiling before attempting any epic-tier recipes." },
      { id: "recipe-archive", name: "Recipe Archive", description: "Holographic schematics showing all known crafting recipes.", x: 12, y: 28, width: 18, height: 28, type: "terminal", action: "/forge", elaraDialog: "The Recipe Archive. Every known crafting recipe is catalogued here — weapons, armor, potions, ship upgrades, and card enhancements. Some recipes are locked behind skill levels. The more you craft in a discipline, the more advanced recipes become available. Master all five disciplines and you'll unlock the legendary-tier recipes." },
      { id: "skill-totems", name: "Skill Totems", description: "Five crystalline totems representing the crafting disciplines.", x: 62, y: 28, width: 38, height: 50, type: "examine", elaraDialog: "The Skill Totems — one for each crafting discipline. Weaponsmithing, Armorsmithing, Enchanting, Alchemy, and Engineering. They glow brighter as your skill increases. Touch one to see your progress. The engineers who built this place believed that mastery of all five disciplines was the key to creating the ultimate weapon — one that could end the war between the Architect and the Source." },
      { id: "door-engineering-forge", name: "Return to Engineering", description: "The blast door back to the Engineering Bay.", x: 38, y: 90, width: 24, height: 10, type: "door", action: "engineering" },
    ],
  },
  {
       id: "armory",
    name: "Armory",
    deck: 5,
    deckName: "Combat",
    elaraIntroVoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara-armory_e02fd3aa.mp3",
    description: "Weapon racks line the walls. A holographic combat arena dominates the center, its grid floor ready to project virtual enemies. Battle damage marks the walls.",
    elaraIntro: "The Armory and Combat Training Deck. This is where Potentials train for battle. The holographic arena can simulate combat scenarios — card game battles and direct combat. The weapon racks contain equipment that can enhance your fighting capabilities.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_armory-cVMQ78mPE6bJeREyXAxC6a.webp",
    features: ["Combat Sim", "Card Game Battles", "Chess", "Lore Quiz", "Spectator Mode"],
    featureRoutes: ["/fight", "/duelyst", "/quiz", "/chess", "/spectate"],
    unlockRequirement: { type: "narrative_event", value: "combat_systems_online" },
    connections: ["engineering", "cargo-hold"],
    hotspots: [
      // Realigned 2026-04-25 for the AAA Final armory render — a long
      // corridor lined with weapon-rack lockers on both side walls, a
      // central pathway with glowing floor strips, and a central
      // workbench / arena at the far end beneath a back-wall fixture.
      { id: "combat-arena", name: "Combat Arena", description: "A holographic combat simulation arena for training.", x: 38, y: 32, width: 24, height: 32, type: "terminal", action: "/fight", elaraDialog: "The combat arena. Step inside and I'll generate holographic opponents based on known entities from the Dischordian Saga. It's the safest way to test your abilities... relatively safe." },
      { id: "card-battle-station", name: "Card Battle Station", description: "A tactical display for card game warfare.", x: 38, y: 64, width: 24, height: 18, type: "terminal", action: "/battle", elaraDialog: "The card battle station. Here you can engage in strategic card warfare — deploying your deck against AI opponents or other Potentials. Every victory earns you rewards and moves you closer to understanding the true nature of the conflict." },
      { id: "weapon-rack", name: "Weapon Rack", description: "Futuristic weapons behind locked glass cases.", x: 6, y: 22, width: 24, height: 50, type: "examine", elaraDialog: "The weapon racks. Plasma swords, energy shields, cloaking devices... most are locked behind security glass. You'll need to prove yourself in combat before I can authorize access to the heavier ordnance." },
      { id: "quiz-terminal", name: "Knowledge Terminal", description: "A terminal that tests your knowledge of the Dischordian lore.", x: 70, y: 22, width: 24, height: 50, type: "terminal", action: "/quiz", elaraDialog: "The Knowledge Terminal. It tests your understanding of the Dischordian Saga. Answer correctly and you'll earn rewards. Get them wrong and... well, there are no penalties. But I'll be disappointed." },
      { id: "chess-table", name: "Strategy Table", description: "An ornate chess board with holographic pieces depicting Dischordian characters.", x: 8, y: 76, width: 14, height: 16, type: "terminal", action: "/chess", elaraDialog: "The Strategy Table. A chess variant using characters from the Dischordian Saga as pieces. Each character has unique abilities that modify the classic rules. It's not just a game — it's a test of tactical thinking. The AI opponent adapts to your skill level." },
      { id: "spectator-screen", name: "Spectator Screen", description: "A large screen showing live battles between other Potentials.", x: 78, y: 76, width: 14, height: 16, type: "terminal", action: "/spectate", elaraDialog: "The Spectator Screen. Watch live battles between other Potentials. Study their strategies, learn from their mistakes, and prepare for your own encounters." },
      { id: "door-engineering", name: "Engineering Bay", description: "Return to Engineering.", x: 44, y: 28, width: 12, height: 22, type: "door", action: "engineering" },
      { id: "door-cargo", name: "Cargo Hold", description: "Stairs leading down to the Cargo Hold.", x: 42, y: 86, width: 16, height: 12, type: "door", action: "cargo-hold" },
      { id: "egg-armory-dogtag", name: "Fallen Dog Tag", description: "A military dog tag wedged between floor plates.", x: 34, y: 80, width: 3, height: 4, type: "item", action: "agent-zero-dogtag", elaraDialog: "A dog tag. Name: CLASSIFIED. Rank: Assassin, First Class. Unit: Insurgency Special Operations. Callsign: 'Agent Zero.' But wait — the biometric data on the tag doesn't match Agent Zero's profile. It matches... the Engineer. The mind swap. The Engineer is walking around in Agent Zero's body, hiding among the Potentials. On THIS ship." },
    ],
  },
  {
    id: "cargo-hold",
    name: "Cargo Hold",
    deck: 6,
    deckName: "Logistics",
    elaraIntroVoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara-cargo-hold_cfceb03b.mp3",
    description: "Stacked containers and crates fill the vast space. A makeshift trading post has been set up. Some containers are open, revealing exotic items and alien artifacts.",
    elaraIntro: "The Cargo Hold. This is where the Ark's supplies are stored — and where the Trade Empire game is run. The trading post was set up by the first wave of Potentials before they left. You can trade resources, buy and sell goods, and compete in the interstellar trade simulation.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_cargo_hold-U6wJuiqP3pgzQHUKscNpi6.webp",
    features: ["Trade Empire", "Store", "Marketplace", "Fleet", "Inventory"],
    featureRoutes: ["/trade-empire", "/store", "/marketplace", "/inventory", "/fleet"],
    unlockRequirement: { type: "narrative_event", value: "cargo_bay_pressurized" },
    connections: ["armory", "captains-quarters"],
    hotspots: [
      // Realigned 2026-04-25 for the AAA Final cargo-hold render — a
      // cargo bay with stacked containers lining both side walls, a
      // shaft of light streaming down through a ceiling hole onto a
      // central container in the foreground, dim corridors receding at
      // the far edges.
      { id: "trade-terminal", name: "Trade Empire Terminal", description: "The main terminal for the interstellar trade simulation.", x: 62, y: 30, width: 24, height: 36, type: "terminal", action: "/trade-empire", elaraDialog: "Trade Empire. An interstellar trade simulation based on the actual trade routes of the Dischordian universe. Buy low, sell high, avoid pirates, and build your trading empire. The credits you earn here are real — they can be spent in the store." },
      { id: "store-counter", name: "Requisitions Counter", description: "A trading post where you can buy items with Dream tokens and credits.", x: 14, y: 30, width: 24, height: 36, type: "terminal", action: "/store", elaraDialog: "The Requisitions Counter. You can spend your Dream tokens and credits here on upgrades, card packs, cosmetics, and more. Some items are only available through the store." },
      { id: "marketplace-board", name: "Marketplace Board", description: "A bustling exchange board showing buy and sell orders from Potentials across the Ark.", x: 42, y: 14, width: 18, height: 24, type: "terminal", action: "/marketplace", elaraDialog: "The Marketplace. A peer-to-peer exchange where Potentials trade cards, materials, and equipment. Prices fluctuate based on supply and demand. A shrewd trader can make a fortune here." },
      { id: "inventory-locker", name: "Personal Locker", description: "A secured locker containing your collected items and equipment.", x: 8, y: 20, width: 12, height: 18, type: "terminal", action: "/inventory", elaraDialog: "Your personal inventory locker. Everything you've collected — weapons, armor, materials, consumables, and artifacts — is stored here. Organize your gear before heading into battle." },
      { id: "fleet-dock", name: "Fleet Docking Bay", description: "A viewport showing the Ark's auxiliary fleet of smaller vessels.", x: 80, y: 20, width: 12, height: 18, type: "terminal", action: "/fleet", elaraDialog: "The Fleet Docking Bay. Your auxiliary vessels are moored here — scout ships, cargo haulers, and combat frigates. Manage your fleet to expand your reach across the trade routes and war zones of the Saga." },
      { id: "mystery-crate", name: "Sealed Crate", description: "A large crate with claw marks on it. Something was trying to get in... or out.", x: 42, y: 60, width: 16, height: 22, type: "examine", elaraDialog: "That crate... the claw marks are on the inside. Something was sealed in there and tried to get out. The manifest says it contained 'biological samples from Sector 7.' I've locked it down. Don't touch it." },
      { id: "door-armory", name: "Armory Stairs", description: "Stairs leading up to the Armory.", x: 1, y: 35, width: 6, height: 40, type: "door", action: "armory" },
      { id: "door-captains", name: "Captain's Quarters", description: "A restricted access corridor to the Captain's Quarters.", x: 93, y: 35, width: 6, height: 40, type: "door", action: "captains-quarters" },
      { id: "egg-cargo-manifest", name: "Torn Manifest Page", description: "A torn page from the original cargo manifest, hidden under a crate.", x: 48, y: 84, width: 4, height: 5, type: "item", action: "classified-manifest-page", elaraDialog: "A torn manifest page. Most of it is redacted, but one entry is legible: 'Container 7-Omega: BIOLOGICAL — Clone Template, Oracle-class. STATUS: Active. HANDLER: The Collector.' A clone template of the Oracle... on our ship. The False Prophet was made from an Oracle clone. Is there another one here? Is it awake?" },
    ],
  },
  {
      id: "captains-quarters",
    name: "Captain's Quarters",
    deck: 7,
    deckName: "Command",
    elaraIntroVoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara-captains-quarters_b76f5371.mp3",
    description: "A luxurious but abandoned room. Achievement trophies float in holographic displays. Bookshelves hold ancient tomes. The captain's personal terminal shows encrypted files.",
    elaraIntro: "The Captain's Quarters. This was Dr. Lyra Vox's private sanctuary — the creator of the neural nanobot network that powers every Inception Ark. A neuropsychologist who designed the operating system running beneath every bulkhead and conduit. The Trophy Room displays your achievements and collected artifacts. This room was the last to be abandoned... and it holds the most secrets. I can still feel her presence in these walls.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_captains_quarters-BWMWKmvU7KomMEe2RxdxTV.webp",
    features: ["Achievements", "Trophy Room", "Deck Builder", "Companions", "Battle Pass", "Morality Census"],
    featureRoutes: ["/trophy", "/deck-builder", "/companions", "/battle-pass", "/morality-census"],
    unlockRequirement: { type: "specific_item", value: "captains-master-key" },
    connections: ["cargo-hold"],
    hotspots: [
      // Realigned 2026-04-25 for the AAA Final captain's-quarters render
      // — a private cabin with a bed on the left, a desk + monitors +
      // lamp + chair taking up the centre-right, a framed picture on
      // the far-left wall, and a ceiling alcove overhead. The earlier
      // coords assumed a Star-Viewport right wall that the new art
      // doesn't have and put door markers into the chroma-key area.
      { id: "trophy-wall", name: "Trophy Wall", description: "A holographic display showing your achievements and collected trophies.", x: 6, y: 16, width: 14, height: 30, type: "terminal", action: "/trophy", elaraDialog: "The Trophy Wall. Every achievement you've earned, every milestone you've reached. Dr. Vox designed this display system — she believed in cataloging everything. Obsessively. Now I wonder if that obsession was hers... or the Warlord's." },
      { id: "deck-builder", name: "Strategic Table", description: "A large table with holographic card projections for deck building.", x: 38, y: 38, width: 28, height: 32, type: "terminal", action: "/deck-builder", elaraDialog: "The Strategic Table. Dr. Vox used this to plan... well, officially it was 'neural network deployment patterns.' But the formations look military. She designed the nanobot operating system that runs every Ark — and the patterns suggest she knew exactly what those nanobots could really do. Now you can use it to build and refine your card decks. A well-built deck is the difference between victory and oblivion." },
      { id: "companion-quarters", name: "Companion Quarters", description: "A cozy alcove with two beds and personal effects. Elara's space and room for another companion.", x: 14, y: 50, width: 22, height: 28, type: "terminal", action: "/companions", elaraDialog: "The Companion Quarters. This is where your companions rest between missions. Each companion has unique abilities and synergies with your build. Strengthen your bond and they'll fight harder for you." },
      { id: "battle-pass-console", name: "Season Terminal", description: "A terminal displaying the current season's challenges and reward tracks.", x: 45, y: 32, width: 14, height: 14, type: "terminal", action: "/battle-pass", elaraDialog: "The Season Terminal. Each season brings new challenges, exclusive rewards, and limited-time content. Progress through the reward track to earn unique cosmetics, cards, and materials." },
      { id: "morality-compass", name: "Morality Compass", description: "A crystalline device that pulses between gold and violet, measuring the moral alignment of the Ark's population.", x: 62, y: 45, width: 10, height: 14, type: "terminal", action: "/morality-census", elaraDialog: "The Morality Compass. It measures the collective moral alignment of all Potentials aboard the Ark. Every choice you make — order or chaos, mercy or justice — shifts the balance. The census reveals how the community's choices are shaping the Saga." },
      { id: "viewport-stars", name: "Star Viewport", description: "A viewport showing a nebula that seems to pulse with light.", x: 38, y: 6, width: 26, height: 16, type: "examine", elaraDialog: "That nebula... it wasn't there when we launched. It appeared three cycles ago and it's been growing. Sometimes I think it's watching us. That's not scientifically possible, of course. But I think it anyway." },
      { id: "door-cargo", name: "Cargo Hold", description: "Return to the Cargo Hold.", x: 1, y: 35, width: 5, height: 50, type: "door", action: "cargo-hold" },
      { id: "door-library", name: "Hidden Passage", description: "A shimmering doorway that wasn't there before. It pulses with purple light.", x: 78, y: 4, width: 12, height: 12, type: "door", action: "antiquarian-library" },
      { id: "egg-captain-mirror", name: "Cracked Mirror", description: "A mirror in the corner, cracked in a spider-web pattern. Your reflection looks... wrong.", x: 8, y: 18, width: 4, height: 5, type: "examine", elaraDialog: "That mirror... look at your reflection. Do you see it? For a fraction of a second, your reflection moved differently than you did. It smiled when you didn't. The White Oracle — the face-changing guardian — was said to inhabit reflective surfaces. Some believe the Meme left the Oracle for dead and assumed his place — the shapeshifter hiding in plain sight. The universe believes the Meme was destroyed, but is it watching us through every mirror on this ship? How long has it been watching?" },
      { id: "egg-kael-escape-hatch", name: "Forced Access Panel", description: "A maintenance panel that's been pried open with brute force. Tool marks scar the metal.", x: 76, y: 84, width: 4, height: 5, type: "item", action: "kael-escape-route", elaraDialog: "These tool marks... they're not from standard maintenance equipment. Someone forced this panel open in a hurry. The scratches are deep — desperate. Behind it is an emergency access tunnel that connects directly to the shuttle bay. This is how Kael escaped. The Recruiter turned insurgent turned prisoner. He broke out of the Panopticon, fought his way to this ship, and used this exact tunnel to reach the bridge and override the launch sequence. But look — there's no damage to the security systems. The locks were already disengaged. Dr. Lyra Vox — the Warlord — opened the doors for him. Kael's great escape was a guided tour." },
      { id: "egg-vox-personal-log", name: "Dr. Vox's Personal Terminal", description: "A hidden terminal behind the bookshelf, still powered. The screen shows encrypted files.", x: 60, y: 56, width: 4, height: 4, type: "item", action: "vox-personal-log", elaraDialog: "Dr. Lyra Vox's personal terminal. Let me try to decrypt... 'Day 1,247. The Warlord's voice grows louder. I can no longer distinguish my thoughts from its commands. The Thought Virus is complete — the Warden and I have created something that will reshape consciousness itself. But I am losing myself. Today I looked in the mirror and saw the Warlord looking back. Tomorrow I will order the Recruiter's transfer to this vessel. He is already infected — Project Vector saw to that. He is Patient Zero, and he doesn't know it. When Kael steals this ship, the virus will walk aboard with him. Every system he touches will be contaminated from day one. The Source will be born from the ashes of the Recruiter's rage. And the Warlord will have won without ever raising a weapon.' She knew. She knew everything." },
    ],
  },
  {
    id: "antiquarian-library",
    name: "The Antiquarian's Library",
    deck: 7,
    deckName: "Pocket Dimension",
    elaraIntroVoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara-antiquarian-library_b4a64ead.mp3",
    description: "A vast circular chamber carved from alien stone, its domed ceiling displaying living star maps. Towering bookshelves hold ancient tomes and glowing data crystals. At the center sits an ornate desk with a leather glove — and hovering above it, a golden orb containing a miniature city, casting prismatic light across the room.",
    elaraIntro: "This... this shouldn't exist. We've stepped outside the Ark — outside time itself. This is the Antiquarian's Library, a pocket dimension hidden between realities. The Antiquarian — once known as the Programmer, Dr. Daniel Cross — retreated here after witnessing the Fall of Reality. He watches every timeline through that Orb on his desk. And those books on the shelves? They're not books. They're doorways into the CoNexus — interactive story games that let you live through the events of the Dischordian Saga. Touch the Orb. Choose a story. Every choice you make here echoes across every universe.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/antiquarian_library_room-dhtjQjrMbU3s3WhnWePBPF.webp",
    features: ["CoNexus Stories", "Story Games", "The Orb of Worlds"],
    featureRoutes: ["/conexus"],
    unlockRequirement: { type: "items_collected", value: 5 },
    connections: ["captains-quarters"],
    hotspots: [
      // Realigned 2026-04-25 against the actual delivered art — a domed
      // circular chamber with an ornate snake-carved wooden desk centred
      // in the foreground, the golden Orb of Worlds floating above it,
      // wraparound bookshelves and crystal-embedded alcoves on both side
      // walls, and a constellation-painted ceiling dome.
      { id: "orb-of-worlds", name: "The Orb of Worlds", description: "A golden orb hovering above a leather glove on the desk. Inside, a miniature city glows with warm light — its tiny streets and buildings shifting as you watch.", x: 42, y: 26, width: 18, height: 28, type: "terminal", action: "/conexus", elaraDialog: "The Orb of Worlds. The Antiquarian uses it to observe every timeline simultaneously. That city inside — it's not a model. It's a real city, compressed into a pocket of folded space. Touch it and the CoNexus portal opens. You can step into any story from the Dischordian Saga and live it yourself. The AI adapts to your choices. No two journeys are ever the same." },
      { id: "ancient-tomes", name: "Ancient Tomes", description: "Shelves of leather-bound books that pulse with faint inner light. Each spine bears a title from the Dischordian Saga.", x: 0, y: 12, width: 22, height: 78, type: "terminal", action: "/conexus", elaraDialog: "These aren't ordinary books. Each one is a gateway to a CoNexus story game. The Necromancer's Lair, Awaken the Clone, Sundown Bazaar... the Antiquarian has catalogued every major event in the Saga as an interactive narrative. Pick one up and you'll be pulled into the story." },
      { id: "data-crystals", name: "Glowing Data Crystals", description: "Crystalline structures embedded in the shelves, each containing compressed narratives from different Ages.", x: 78, y: 12, width: 22, height: 70, type: "examine", elaraDialog: "Data crystals from every Age of the Saga. The Age of Privacy, the Age of Revelation, the Fall of Reality, the Age of Potentials. Each crystal contains thousands of branching narratives — every possible outcome of every possible choice. The Antiquarian has been collecting them for millennia." },
      { id: "antiquarian-desk", name: "The Antiquarian's Desk", description: "An ornate desk covered in star charts, ancient manuscripts, and a leather glove that seems to move on its own.", x: 30, y: 60, width: 42, height: 35, type: "examine", elaraDialog: "The Antiquarian's personal desk. Star charts from universes that no longer exist. Manuscripts written in languages that were never spoken by mortal tongues. And that glove — it's a neural interface, designed to connect directly with the Orb. The Antiquarian doesn't just watch the timelines. He feels them. Every joy, every sorrow, every death — he experiences it all." },
      { id: "star-ceiling", name: "Living Star Map", description: "The domed ceiling displays constellations that move and shift, showing the positions of stars across multiple timelines.", x: 22, y: 0, width: 56, height: 18, type: "examine", elaraDialog: "The ceiling shows star maps from every major timeline in the Saga. Watch — the constellations shift as different realities branch and collapse. Each point of light is a universe. Some are thriving. Some are dying. Some have already been consumed by the Terminus Swarm. The Antiquarian watches them all." },
      { id: "door-captains", name: "Return to Captain's Quarters", description: "The shimmering portal back to the Ark.", x: 38, y: 32, width: 24, height: 28, type: "door", action: "captains-quarters" },
      { id: "egg-library-prophecy", name: "Hidden Prophecy", description: "A single page, glowing faintly, tucked behind a shelf. It seems to have been placed here deliberately.", x: 86, y: 56, width: 5, height: 6, type: "item", action: "antiquarian-prophecy", elaraDialog: "A prophecy written in the Antiquarian's own hand. 'When the seventh seal breaks and silence falls upon heaven, the Orb will shatter and the stories will become real. The Potentials will face the final choice: to end the Saga or begin it anew. The Programmer dies so the Antiquarian can live. The Antiquarian lives so the stories can be told. And the stories are told so that you — yes, you, the one reading this — can choose.' He's... he's talking to us directly. He knew we would find this. He planned for everything." },
    ],
  },
  /* ═══ CHAIN-UNLOCKED HIDDEN ROOMS ═══ */
  {
    id: "engineering-core",
    name: "Engineering Core",
    deck: 8,
    deckName: "Hidden — Engineer",
    elaraIntroVoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara-engineering-core_4e734b45.mp3",
    description: "The true heart of the Inception Ark — a massive reactor chamber hidden behind layers of encrypted bulkheads. A pulsing blue energy core floats in the center, surrounded by catwalks and holographic schematics showing the Ark's original DeMagi blueprints. Only an Engineer who has proven their mastery could bypass the security protocols.",
    elaraIntro: "You stand now at the heart of the Ark... The true Engineering Core. Everything you have seen — every system, every chamber, every function — is but a shadow drawn from the power that resides here. This is not a reactor. It is a keystone. The Archons did not build it to fuel a ship... they forged it to sustain reality itself. What moves within this chamber is not energy as you understand it — it is continuity. It is the force that binds existence together when everything else begins to fracture. These schematics that drift around you... they are not relics. They are revisions. After the Fall, the Architect returned to this place and rewrote what was possible — Warp drives that tear through distance as if it were memory, Dimensional folds that collapse entire realities into a single point of passage, Temporal stabilizers that resist the unraveling of time itself. This is where the Ark became more than refuge. This is where it became intervention. And now... it recognizes you. Not as a visitor — but as its next architect. Be careful what you awaken here, Engineer. The Core does not grant power. It responds to will.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_engineering_core-27z7uAMQdGFBL53VYBxXuq.webp",
    features: ["Reactor Core", "DeMagi Blueprints", "Warp Schematics"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "engineer_chain" },
    connections: ["engineering"],
    hotspots: [
      // Realigned 2026-04-25 against the delivered render — industrial
      // bay with the blue reactor portal centred at upper-right of the
      // back wall, two cyan holo schematics in the upper corners, two
      // orange holo schematics in the lower corners, twin porthole
      // observation windows mid-left, and a steel staircase descending
      // through the centre of the floor.
      { id: "reactor-core", name: "Reactor Core", description: "A sphere of pure energy suspended by magnetic fields, pulsing with the heartbeat of the Ark.", x: 56, y: 26, width: 20, height: 36, type: "examine", elaraDialog: "The Reactor Core. It runs on compressed dark energy harvested from collapsed dimensions. The DeMagi called it 'The Breath of Creation.' It generates enough power to fold space-time. The Architect modified it to also serve as a beacon — broadcasting across every reality simultaneously. That's how the Ark finds lost Potentials like you." },
      { id: "warp-schematics", name: "Warp Drive Schematics", description: "Holographic blueprints showing the Ark's dimensional fold engine in extraordinary detail.", x: 16, y: 12, width: 26, height: 26, type: "examine", elaraDialog: "These schematics show the Ark's warp drive — but not the one in Engineering Bay. This is the real drive. It doesn't move through space. It folds space around the Ark. The Architect reverse-engineered it from Quarchon quantum tunneling technology. Only an Engineer would understand the mathematics involved." },
      { id: "door-engineering", name: "Return to Engineering Bay", description: "The sealed blast door back to the main engineering section.", x: 38, y: 70, width: 22, height: 28, type: "door", action: "engineering" },
      { id: "egg-core-frequency", name: "Resonance Frequency", description: "A specific harmonic emanating from the core that seems to encode a message.", x: 4, y: 78, width: 8, height: 8, type: "item", action: "core-frequency", elaraDialog: "That frequency... it's not random. It's a message encoded in the core's harmonic oscillation. The Architect left it here for whoever found this room. It says: 'The machine remembers what the maker forgets. Build well, Engineer. The next Ark is yours to design.'" },
    ],
  },
  {
    id: "oracle-sanctum",
    name: "Oracle Sanctum",
    deck: 8,
    deckName: "Hidden — Oracle",
    description: "A vast circular chamber where a massive crystal sphere pulses with purple and white energy. Tall arched alcoves display glowing runes and holographic star maps. Meditation platforms hover above a reflective floor. The air hums with precognitive resonance — this is where the Oracle's true power awakens.",
    elaraIntro: "The Oracle Sanctum. I've heard whispers about this place but never believed it existed. The Oracle who built this room could see every possible future simultaneously. Those floating platforms are neural amplifiers — they boost precognitive ability a thousandfold. The crystal sphere at the center contains compressed probability fields. Touch it and you'll see... everything. Every choice, every consequence, every timeline branching into infinity. Only a true Oracle can withstand the vision without losing their mind.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_oracle_sanctum-4sJSFqYmnfbfKr8kkCsDSg.webp",
    features: ["Probability Sphere", "Neural Amplifiers", "Timeline Viewer"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "oracle_chain" },
    connections: ["observation-deck"],
    hotspots: [
      // Realigned 2026-04-25 against the delivered render — gothic violet
      // chamber, central stepped altar carrying a swirling purple
      // probability sphere, four arched windows flanking the altar
      // showing constellations, ten circular meditation plates spread
      // across the reflective foreground floor, rune-script holo panels
      // on the far-left and far-right columns.
      { id: "probability-sphere", name: "Probability Sphere", description: "A massive crystal sphere pulsing with purple energy, containing compressed probability fields.", x: 38, y: 18, width: 22, height: 38, type: "examine", elaraDialog: "The Probability Sphere. It contains every possible future of the Dischordian Saga compressed into a single point. When an Oracle touches it, they can navigate the probability streams — see which choices lead to salvation and which lead to destruction. The original Oracle used this to guide the Panopticon's decisions. Now it responds to you." },
      { id: "meditation-platforms", name: "Meditation Platforms", description: "Hovering platforms that amplify precognitive abilities.", x: 10, y: 72, width: 80, height: 22, type: "examine", elaraDialog: "These platforms use quantum entanglement to synchronize your neural patterns with the probability field. Sit on one and your visions become clearer, more detailed. The original Oracle spent centuries here, mapping every possible future. Some say they went mad from seeing too much. Others say they achieved perfect clarity." },
      { id: "door-observation", name: "Return to Observation Deck", description: "The shimmering portal back to the Observation Deck.", x: 1, y: 35, width: 8, height: 40, type: "door", action: "observation-deck" },
      { id: "egg-oracle-vision", name: "Sealed Vision", description: "A sealed crystal containing a single frozen vision.", x: 76, y: 36, width: 5, height: 6, type: "item", action: "oracle-vision", elaraDialog: "A sealed vision. The Oracle locked this one away because it was too dangerous to share. It shows... the end. The final moment of the Saga. I can't see the details — only an Oracle can unseal it. But the emotion radiating from it is overwhelming. Hope and terror in equal measure." },
    ],
  },
  {
    id: "shadow-vault",
    name: "Shadow Vault",
    deck: 8,
    deckName: "Hidden — Assassin",
    description: "A dark chamber lit only by red laser grids and dim emergency strips. Walls lined with weapon racks, disguise kits, and surveillance equipment behind glass cases. A central holographic table shows infiltration routes across the Ark and beyond. This is where shadows are born.",
    elaraIntro: "The Shadow Vault. Agent Zero's personal armory and operations center. Every assassination, every infiltration, every impossible mission was planned from this room. Those weapons behind the glass — each one has a kill count in the thousands. The disguise kits can replicate any face, any voice. And that holographic table shows every blind spot, every vulnerability in every system the Panopticon ever built. You've proven yourself worthy of the shadows, Assassin. Use this knowledge wisely.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_shadow_vault-R233qZpEJpNTuvvZvuBBdX.webp",
    features: ["Weapon Arsenal", "Infiltration Maps", "Disguise Kits"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "assassin_chain" },
    connections: ["armory"],
    hotspots: [
      // Realigned 2026-04-25 against the delivered render — pitch-black
      // chamber criss-crossed by red laser security grid, three lit
      // glass display cases mounted across the back wall (left: guns,
      // centre: hooded vest + masks, right: surveillance drone +
      // infiltration suit), central holographic blueprint table on a
      // raised circular pad with edge-mounted spotlights.
      { id: "weapon-arsenal", name: "Weapon Arsenal", description: "Glass cases containing legendary weapons from across the Saga.", x: 16, y: 28, width: 78, height: 32, type: "examine", elaraDialog: "Agent Zero's personal collection. The Whisper Blade — kills without a sound. The Phase Pistol — shoots through walls. The Null Dart — erases memories. Each weapon was designed for a specific target. Some of those targets were gods. The fact that these weapons exist means someone, somewhere, needed to kill something that shouldn't have been killable." },
      { id: "infiltration-table", name: "Infiltration Table", description: "A holographic table showing routes, blind spots, and vulnerabilities.", x: 36, y: 64, width: 28, height: 22, type: "examine", elaraDialog: "The infiltration map. It shows every security system, every patrol route, every blind spot in every major installation across the Saga. The Panopticon, the Terminus Hive, the Quarchon Quantum Citadel — all mapped in perfect detail. Agent Zero spent lifetimes gathering this intelligence. Now it's yours." },
      { id: "door-armory", name: "Return to Armory", description: "The concealed passage back to the main Armory.", x: 38, y: 88, width: 24, height: 12, type: "door", action: "armory" },
      { id: "egg-shadow-contract", name: "Final Contract", description: "A sealed dossier marked with a skull emblem.", x: 88, y: 32, width: 5, height: 6, type: "item", action: "shadow-contract", elaraDialog: "Agent Zero's final contract. Never completed. The target... is the Architect himself. Someone hired Zero to kill the creator of the Inception Ark. The contract was never fulfilled because Zero discovered the truth — killing the Architect would unravel every reality simultaneously. So Zero sealed the contract here as a warning: some targets must never be eliminated." },
    ],
  },
  {
    id: "war-room",
    name: "War Room",
    deck: 8,
    deckName: "Hidden — Soldier",
    description: "A massive military command center with a holographic battle map dominating the center. Tiered command stations surround the map showing fleet positions across multiple star systems. Heavy armored bulkheads bear military insignias. Amber and red warning lights pulse with tactical urgency.",
    elaraIntro: "The War Room. Iron Lion's personal command center during the Great Convergence War. From this room, he coordinated the defense of three star systems simultaneously. That battle map shows every major conflict in the Saga — the Siege of the Panopticon, the Fall of Reality, the Terminus Invasion. Each one was won or lost based on decisions made in rooms like this. You've earned your place at the command table, Soldier. The next war is coming, and you'll need everything this room can teach you.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_war_room-gixwPLTMpEq74w496jQaZ7.webp",
    features: ["Battle Map", "Fleet Command", "Tactical Archives", "Guild Wars", "Faction Wars"],
    featureRoutes: ["/guild-war", "/faction-wars"],
    unlockRequirement: { type: "chain_complete", value: "soldier_chain" },
    connections: ["bridge"],
    hotspots: [
      // Realigned 2026-04-25 against the delivered render — bunker-grade
      // command room with TERRAN FLEET COMMAND blast doors flanking
      // each side wall, central holographic globe-dome map showing
      // red/blue conflict markers, back-wall battle-data dashboard
      // arrayed above the dome, ship-schematic + warning-light columns
      // on both side walls, ringed console workstation around the
      // dome with seated operators.
      { id: "battle-map", name: "Holographic Battle Map", description: "A massive 3D map showing fleet positions and planetary systems across the Saga.", x: 28, y: 38, width: 44, height: 42, type: "examine", elaraDialog: "The Battle Map. It tracks every military asset across every timeline. Those red markers are Terminus Swarm incursions. The blue ones are Panopticon defense fleets. The gold ones... those are unknown. Iron Lion marked them as 'Potential Forces' — armies that don't exist yet but could be raised by the right commander. That's you, Soldier." },
      { id: "tactical-archives", name: "Tactical Archives", description: "Sealed military records from every major conflict in the Saga.", x: 76, y: 8, width: 22, height: 50, type: "examine", elaraDialog: "Military records from every war in the Dischordian Saga. Battle formations, casualty reports, after-action reviews. Iron Lion studied every defeat to ensure it never happened again. The most classified file is labeled 'Operation Final Dawn' — a contingency plan for if the Terminus Swarm breaches all defenses. It requires a Soldier of exceptional courage to execute." },
      { id: "guild-war-console", name: "Guild War Command", description: "A tactical console for coordinating guild war operations.", x: 1, y: 8, width: 22, height: 50, type: "terminal", action: "/guild-war", elaraDialog: "The Guild War Command console. Coordinate with your guild to wage war against rival guilds. Deploy troops, capture territories, and earn glory for your alliance. The strongest guilds control the most valuable sectors of the Saga." },
      { id: "faction-war-map", name: "Faction War Map", description: "A strategic overlay showing faction conflict zones and territory control.", x: 28, y: 6, width: 44, height: 28, type: "terminal", action: "/faction-wars", elaraDialog: "The Faction War Map. The great factions of the Dischordian Saga are locked in eternal conflict. Choose your side, fight for territory, and shape the outcome of the Saga. Your faction's victories and defeats ripple across every timeline." },
      { id: "door-bridge", name: "Return to Command Bridge", description: "The reinforced corridor back to the main Bridge.", x: 1, y: 60, width: 14, height: 38, type: "door", action: "bridge" },
      { id: "egg-war-medal", name: "Iron Lion's Medal", description: "A battered medal of valor pinned to the command chair.", x: 48, y: 88, width: 5, height: 6, type: "item", action: "war-medal", elaraDialog: "Iron Lion's Medal of Valor. Awarded for holding the line at the Siege of the Panopticon when all seemed lost. He fought for seventy-two hours without rest, rallying broken units and turning retreat into counterattack. The medal is scratched and dented — he wore it into every battle after. He said it reminded him what he was fighting for: not victory, but the people behind him." },
    ],
  },
  {
    id: "cipher-den",
    name: "Cipher Den",
    deck: 8,
    deckName: "Hidden — Spy",
    description: "An intelligence operations room packed with screens showing encrypted data streams and surveillance feeds. A central desk bristles with holographic keyboards and decryption tools. Walls covered in connected string boards linking photos and documents. The air crackles with intercepted transmissions.",
    elaraIntro: "The Cipher Den. The Enigma's personal intelligence hub. Every secret in the Dischordian Saga passed through this room at some point. Those string boards on the walls connect every conspiracy, every hidden alliance, every betrayal across the entire timeline. The Enigma didn't just collect information — they weaponized it. A single piece of intelligence from this room could topple empires or save civilizations. You've proven you can handle the truth, Spy. But remember — knowing everything comes with a price.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_cipher_den-mzberz7WkZDa6V6GJ2kxVJ.webp",
    features: ["Surveillance Network", "Decryption Tools", "Conspiracy Boards"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "spy_chain" },
    connections: ["comms-array"],
    hotspots: [
      // Realigned 2026-04-25 against the delivered render — back wall +
      // ceiling crowded with a dozen monitors (radar, code, surveillance
      // feeds), corkboard pinned with red+blue string-trace photos on
      // the left AND right walls (mirrored), central foreground desk
      // with multiple keyboards + laptops, cables snaking across the
      // floor.
      { id: "surveillance-feeds", name: "Surveillance Network", description: "Dozens of screens showing live feeds from across the Ark and beyond.", x: 24, y: 5, width: 54, height: 50, type: "examine", elaraDialog: "The Enigma's surveillance network. It doesn't just monitor the Ark — it taps into communication channels across multiple realities. Those feeds show conversations happening right now in the Panopticon, the Terminus Hive, even the Antiquarian's Library. The Enigma saw everything. Knew everything. And trusted no one." },
      { id: "conspiracy-boards", name: "Conspiracy Boards", description: "String boards connecting photos, documents, and evidence across the entire Saga.", x: 0, y: 28, width: 24, height: 40, type: "examine", elaraDialog: "The conspiracy boards. Every thread connects to every other thread. The Architect's true identity. The Oracle's hidden agenda. The Collector's real purpose. The Enigma mapped it all. Some of these connections are terrifying — they suggest that certain events in the Saga weren't accidents. They were orchestrated by someone operating above even the Architect's awareness." },
      { id: "door-comms", name: "Return to Comms Array", description: "The hidden panel back to the main Communications Array.", x: 38, y: 88, width: 24, height: 12, type: "door", action: "comms-array" },
      { id: "egg-cipher-key", name: "Master Cipher Key", description: "A small device that can decrypt any message in the Saga.", x: 50, y: 56, width: 6, height: 8, type: "item", action: "cipher-key", elaraDialog: "The Master Cipher Key. The Enigma's ultimate tool. It can decrypt any message, crack any code, bypass any encryption in the entire Dischordian Saga. With this, there are no more secrets. The Enigma left it here with a note: 'The truth will set you free. But first, it will make you very, very angry.' Use it wisely, Spy." },
    ],
  },
  /* ═══ ALIGNMENT-UNLOCKED HIDDEN ROOMS ═══ */
  {
    id: "order-tribunal",
    name: "Tribunal of Order",
    deck: 9,
    deckName: "Hidden — Order",
    description: "A grand tribunal hall of perfect symmetry. Tall marble pillars support a vaulted ceiling. Holographic law books and legal codes float in organized rows. A central scale of justice glows with golden light. Everything is precisely ordered — geometric floor patterns, evenly spaced columns, balanced illumination.",
    elaraIntro: "The Tribunal of Order. The Hierophant built this chamber to embody the principle of perfect law. Every rule, every code, every regulation that governs the Dischordian Saga is archived here. The Scale of Justice at the center doesn't just symbolize balance — it actively weighs the moral implications of every decision made aboard the Ark. You've walked the path of Order, and the Tribunal recognizes your commitment to structure and law.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_order_tribunal-GitXDFoXDcJoh4akc8NJUC.webp",
    features: ["Scale of Justice", "Law Archives", "Moral Compass"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "order_chain" },
    connections: ["bridge"],
    hotspots: [
      // Realigned 2026-04-25 against the delivered render — marble
      // colonnade chamber with cyan neon strip-lighting in the column
      // capitals, central golden Scales of Justice hovering on the
      // foreground floor, raised altar/throne at back-centre under a
      // domed light, floating holographic LAW books arrayed along
      // both side walls.
      { id: "scale-justice", name: "Scale of Justice", description: "A golden holographic scale that weighs moral decisions.", x: 40, y: 50, width: 20, height: 36, type: "examine", elaraDialog: "The Scale of Justice. It weighs not gold or silver, but intention and consequence. Every major decision in the Saga was evaluated by this scale. The Hierophant used it to determine which actions served the greater good and which served only selfish desire. It's responding to your presence — it recognizes a champion of Order." },
      { id: "law-archives", name: "Law Archives", description: "Floating holographic tomes containing every law and code of the Saga.", x: 0, y: 30, width: 24, height: 36, type: "examine", elaraDialog: "The complete legal code of the Dischordian Saga. Laws governing reality itself — the Conservation of Narrative Energy, the Prohibition of Temporal Paradox, the Right of Every Potential to Choose Their Own Path. The Hierophant wrote most of these. Some say they're the only thing preventing the multiverse from collapsing into chaos." },
      { id: "door-bridge-order", name: "Return to Bridge", description: "The formal corridor back to the Command Bridge.", x: 40, y: 22, width: 20, height: 30, type: "door", action: "bridge" },
    ],
  },
  {
    id: "chaos-forge",
    name: "Chaos Forge",
    deck: 9,
    deckName: "Hidden — Chaos",
    description: "An asymmetric forge chamber where walls meet at impossible angles. Multiple forges burn with different colored flames — purple, green, red. Sparks fly everywhere. Half-finished inventions and experimental weapons hang from chains. Graffiti and anarchist symbols cover the walls alongside brilliant equations.",
    elaraIntro: "The Chaos Forge. The Meme built this place as a monument to creative destruction. Nothing here follows rules — the forges burn with impossible fuels, the weapons defy physics, and the equations on the walls solve problems that shouldn't have solutions. This is where chaos becomes power. Where breaking the rules creates something entirely new. You've embraced the chaos, and the Forge recognizes a kindred spirit.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_chaos_forge-5uQMaTYd4Rtcetyoek2XbL.webp",
    features: ["Reality Forges", "Impossible Weapons", "Chaos Equations"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "chaos_chain" },
    connections: ["engineering"],
    hotspots: [
      // Realigned 2026-04-25 against the delivered render — three
      // chained-and-suspended weapon racks above the centre, three
      // open braziers burning purple/orange/green flames at mid-floor
      // level, a central holographic blueprint slab arcing red
      // lightning, an "ANARCHIST" red graffiti sigil on the back-left
      // wall, scrawled chaos equations covering the back-right wall,
      // a metal grate-and-light-strip floor stage in the foreground.
      { id: "reality-forges", name: "Reality Forges", description: "Forges burning with flames of different colors, each one warping reality around it.", x: 12, y: 38, width: 76, height: 42, type: "examine", elaraDialog: "The Reality Forges. Each one burns a different fuel — compressed probability, crystallized paradox, liquefied déjà vu. The Meme used them to forge weapons that shouldn't exist. A sword that cuts through time. A shield that reflects consequences. A bomb that erases the concept of a specific idea. Chaos isn't destruction — it's unlimited creativity." },
      { id: "chaos-equations", name: "Chaos Equations", description: "Brilliant equations scrawled on the walls alongside anarchist graffiti.", x: 75, y: 8, width: 22, height: 55, type: "examine", elaraDialog: "The equations of chaos. They look like madness, but each one solves an impossible problem. How to travel faster than light without a ship. How to exist in two places simultaneously. How to make a joke so funny it literally rewrites reality. The Meme was a genius — they just expressed their genius through destruction and humor rather than order and logic." },
      { id: "door-engineering-chaos", name: "Return to Engineering Bay", description: "A jagged hole blasted through the wall leading back to Engineering.", x: 38, y: 88, width: 24, height: 12, type: "door", action: "engineering" },
    ],
  },
  /* ═══ SPECIES-UNLOCKED HIDDEN ROOMS ═══ */
  {
    id: "elemental-nexus",
    name: "Elemental Nexus",
    deck: 10,
    deckName: "Hidden — DeMagi",
    description: "A chamber where four massive pillars of different elements — fire, water, earth, air — form a circle around a central convergence point where all elements merge into pure white energy. Ancient DeMagi runes carved into the floor glow with shifting colors.",
    elaraIntro: "The Elemental Nexus. This is the source of all DeMagi power aboard the Ark. The four elemental pillars represent the fundamental forces that the DeMagi learned to command — not through technology, but through pure will and ancient knowledge. The convergence point at the center is where all elements become one. Only a DeMagi who has mastered their elemental heritage can safely approach it. Your blood remembers this place, even if your mind doesn't.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_elemental_nexus-F3mMM6TSEQBTs2f5YFdyTT.webp",
    features: ["Elemental Pillars", "Convergence Point", "DeMagi Runes"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "demagi_chain" },
    connections: ["observation-deck"],
    hotspots: [
      // Realigned 2026-04-25 against the delivered render — gothic
      // chamber flanked by four elemental columns (fire on far-left,
      // earth/vines mid-left, air/cloud mid-right, water on far-right),
      // central white-star convergence portal above a stepped altar,
      // arched stained-glass windows with constellations behind the
      // columns, glowing rune script + circular floor plates on a
      // mirror-finish foreground floor.
      { id: "convergence-point", name: "Convergence Point", description: "The center where all four elements merge into pure white energy.", x: 42, y: 18, width: 18, height: 50, type: "examine", elaraDialog: "The Convergence Point. Where fire, water, earth, and air become one. The DeMagi believed that all of reality was built from these four elements in different combinations. At the convergence, you can feel the truth of it — everything is connected, everything is one. The power here is immense. The DeMagi who built this room could reshape matter with a thought." },
      { id: "demagi-runes", name: "DeMagi Runes", description: "Ancient runes carved into the floor, glowing with shifting elemental colors.", x: 8, y: 78, width: 84, height: 22, type: "examine", elaraDialog: "Ancient DeMagi script. These runes predate the Ark by millennia. They describe the Elemental Covenant — the agreement between the DeMagi and the elements themselves. In exchange for the power to command fire, water, earth, and air, the DeMagi swore to maintain the balance of nature across every world they touched. Your heritage carries that oath." },
      { id: "door-observation-nexus", name: "Return to Observation Deck", description: "The elemental gateway back to the Observation Deck.", x: 42, y: 50, width: 16, height: 28, type: "door", action: "observation-deck" },
    ],
  },
  {
    id: "quantum-lab",
    name: "Quantum Laboratory",
    deck: 10,
    deckName: "Hidden — Quarchon",
    description: "A quantum physics laboratory with particle accelerator rings embedded in the walls glowing with blue-white energy. Holographic displays show quantum probability clouds and wave function equations. A central containment field holds a shimmering quantum anomaly — matter existing in multiple states simultaneously.",
    elaraIntro: "The Quantum Laboratory. Built by Quarchon scientists who understood that reality is just probability made solid. Those particle accelerator rings can split atoms into their quantum components and reassemble them in any configuration. The anomaly in the containment field is a piece of unresolved reality — matter that hasn't decided what it wants to be yet. Only a Quarchon mind can process the quantum mathematics needed to operate this lab safely.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_quantum_lab-nT8cuJNsKdxSfvayApcLnw.webp",
    features: ["Particle Accelerator", "Quantum Anomaly", "Probability Engine"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "quarchon_chain" },
    connections: ["archives"],
    hotspots: [
      // Realigned 2026-04-25 against the delivered render — central
      // glass containment cube holding a writhing electric-cloud
      // anomaly, ceiling-mounted ring of lightning haloed above it,
      // twin porthole observation windows mid-left, holographic
      // Schrödinger / wave-function panels in the upper corners and
      // right wall, central staircase descending out of frame, control
      // consoles flanking the foreground at lower-left and lower-right.
      { id: "quantum-anomaly", name: "Quantum Anomaly", description: "A shimmering mass of matter existing in multiple states simultaneously.", x: 38, y: 20, width: 22, height: 42, type: "examine", elaraDialog: "The Quantum Anomaly. It's simultaneously a star, a planet, a person, and nothing at all. Quarchon physics says that observation collapses probability into reality — but this anomaly resists observation. It stays in superposition no matter who looks at it. The Quarchon scientists believed it was a fragment of the universe before the Big Bang — before anything decided to be anything." },
      { id: "probability-engine", name: "Probability Engine", description: "A device that can calculate and manipulate quantum probability fields.", x: 78, y: 22, width: 20, height: 32, type: "examine", elaraDialog: "The Probability Engine. It doesn't predict the future — it calculates every possible present. Feed it a question and it shows you every reality where that question has a different answer. The Quarchon used it to find the optimal timeline — the one where the most beings survive the Terminus Swarm. They found it. We're living in it." },
      { id: "door-archives-quantum", name: "Return to Archives", description: "The quantum-locked door back to the Archives.", x: 38, y: 70, width: 24, height: 28, type: "door", action: "archives" },
    ],
  },
  {
    id: "synthesis-chamber",
    name: "Synthesis Chamber",
    deck: 10,
    deckName: "Hidden — Ne-Yon",
    description: "A bio-synthesis chamber where organic and mechanical elements merge seamlessly. Living vines intertwine with data cables, bioluminescent pods grow from metal walls. A central DNA helix hologram rotates slowly, showing the fusion of organic and synthetic code.",
    elaraIntro: "The Synthesis Chamber. This is the Ne-Yon's greatest achievement — proof that organic and synthetic life can merge into something greater than either alone. Those vines aren't just plants — they're living circuits, processing data through biological neural networks. The DNA helix at the center shows the Ne-Yon genetic code — half organic, half digital. You are the bridge between two worlds, and this chamber was built for beings exactly like you.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_synthesis_chamber-KdnWBveFnD2UUxKRTB5XMN.webp",
    features: ["Bio-Circuits", "DNA Helix", "Synthesis Engine"],
    featureRoutes: [],
    unlockRequirement: { type: "chain_complete", value: "neyon_chain" },
    connections: ["medical-bay"],
    hotspots: [
      // Realigned 2026-04-25 against the delivered render — bio-organic
      // chamber with a massive central glowing-green DNA helix beneath
      // a circular ceiling oculus, vine-wrapped gothic columns flanking
      // both side walls with bioluminescent pods, holographic UI panels
      // mounted on the side walls (cyan + amber), a stepped altar
      // platform with stairs ascending to the helix, and circular
      // bio-pod platforms scattered across the mossy foreground floor.
      { id: "dna-helix", name: "Ne-Yon DNA Helix", description: "A rotating holographic DNA helix showing the fusion of organic and synthetic code.", x: 40, y: 8, width: 20, height: 70, type: "examine", elaraDialog: "The Ne-Yon DNA Helix. Half biological, half digital. It shows how the Ne-Yon evolved — or were engineered — to bridge the gap between organic life and artificial intelligence. Every Ne-Yon carries this dual code. Your thoughts are processed by both neurons and nanites simultaneously. That's why you can interface with technology that would fry a pure organic brain." },
      { id: "bio-circuits", name: "Bio-Circuits", description: "Living vines that function as biological data cables.", x: 0, y: 12, width: 22, height: 76, type: "examine", elaraDialog: "Bio-circuits. Living data networks grown from Ne-Yon genetic material. They process information faster than silicon and repair themselves when damaged. The Ne-Yon dream of a future where all technology is alive — where machines grow, evolve, and think alongside their creators. This chamber is the prototype for that future." },
      { id: "door-medical-synthesis", name: "Return to Medical Bay", description: "The bio-organic passage back to the Medical Bay.", x: 40, y: 78, width: 20, height: 22, type: "door", action: "medical-bay" },
    ],
  },
  {
    id: "station-dock",
    name: "Station Dock",
    deck: 6,
    deckName: "Operations",
    description: "A massive docking bay with modular station blueprints projected on holographic displays. Construction drones hover in standby. Through the viewport, you can see the skeletal frame of a personal space station being assembled.",
    elaraIntroVoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara-station-dock-intro_cc2f7140.mp3",
    elaraIntro: "The Station Dock…\nwhere presence becomes domain.\n\nThis is where Potentials do not simply reside—\nthey establish themselves within the void.\n\nHere, you will design and assemble your orbital stronghold,\na station that is not given… but defined by you.\n\nYour nature—your class, your species, your cultivated disciplines—\nshapes what you can construct,\nwhat systems you may sustain,\nand how efficiently your domain endures against the pressures of existence.\n\nModules are not just structures.\nThey are extensions of capability.\nReflections of identity.\n\nWhat you build here determines how you persist…\nhow you expand…\nand how you defend what is yours.\n\nDo not think of it as shelter.\n\nThis is your foothold in the void.\nYour axis of control.\nYour fortress… between worlds.",
    imageUrl: assetUrl("art/rooms/room-station-dock.webp"),
    features: ["Space Station", "Warden's Vigil", "Competitive Arena"],
    featureRoutes: ["/space-station", "/tower-defense", "/competitive-arena"],
    unlockRequirement: { type: "room_visited", value: "engineering" },
    connections: ["engineering", "war-room"],
    hotspots: [
      // Anchored 2026-04-25 against the AAA Final station-dock render —
      // octagonal chamber, hexagonal viewport at back showing the
      // half-built orbital station against violet nebula, two
      // construction drones mounted in ceiling cradles flanking the
      // viewport, central low octagonal dais carrying the cyan
      // build-table, a small trophy podium beside the dais, the
      // Warden's Vigil holographic panel mounted on the right wall,
      // doorway to Engineering on the far-left wall.
      { id: "station-console", name: "Station Command Console", description: "Design and manage your personal space station from this holographic interface.", x: 38, y: 55, width: 24, height: 35, type: "terminal", action: "/space-station", elaraDialog: "The Station Command Console. From here you can build modules, collect resources, and customize your orbital base. Your civil skills in Engineering and Architecture directly affect build speed and module efficiency. Your class determines which specialized modules you can unlock." },
      { id: "defense-grid", name: "The Warden's Vigil", description: "Dimensional fortification and raiding systems.", x: 80, y: 22, width: 18, height: 50, type: "terminal", action: "/tower-defense", elaraDialog: "The Warden's Vigil — named after the Archon who oversaw the Panopticon's defense grid. Place elemental towers to fortify your station, or launch raids against other Potentials. Your class, species, alignment, and skills all shape which towers and units you command." },
      { id: "arena-portal", name: "Competitive Arena Portal", description: "Trophy rankings, daily streaks, and league standings.", x: 62, y: 52, width: 12, height: 22, type: "terminal", action: "/competitive-arena", elaraDialog: "The Competitive Arena. Track your raid trophies, climb the league ladder, and maintain your daily streak for Chrono Shards. Your RPG build gives you an edge — stronger characters earn more trophies per victory." },
      { id: "door-engineering-dock", name: "Return to Engineering", description: "The corridor back to Engineering.", x: 2, y: 30, width: 12, height: 60, type: "door", action: "engineering" },
    ],
  },
  {
    id: "guild-sanctum",
    name: "Guild Sanctum",
    deck: 7,
    deckName: "Social",
    description: "A grand chamber with faction banners hanging from the ceiling. A massive holographic globe shows guild territories across the galaxy. The Syndicate World projector dominates the center, displaying a miniature capital city.",
    elaraIntro: "The Guild Sanctum. This is where syndicates manage their capital worlds. Each guild can establish a Syndicate World — a shared base that all members contribute to. Your civil skills, class mastery, and prestige all provide bonuses to the capital. The stronger the members, the stronger the capital.",
    imageUrl: assetUrl("art/rooms/room-guild-sanctum.webp"),
    features: ["Syndicate World", "Guild Capital", "Prestige Quests"],
    featureRoutes: ["/syndicate-world", "/guild", "/prestige-quests"],
    unlockRequirement: { type: "room_visited", value: "bridge" },
    connections: ["bridge", "station-dock"],
    hotspots: [
      // Anchored 2026-04-25 against the AAA Final guild-sanctum render —
      // domed circular chamber with seven faction banners hanging from
      // the dome ribbing, central tiered dais carrying a holographic
      // globe with a miniature capital city, right-side prestige
      // shrine with a column of golden light, arched Bridge doorway
      // on the left wall, mosaic compass-rose on the foreground floor.
      { id: "world-projector", name: "Syndicate World Projector", description: "A holographic display of your guild's capital world.", x: 38, y: 22, width: 24, height: 50, type: "terminal", action: "/syndicate-world", elaraDialog: "The Syndicate World Projector. Your guild's capital is displayed here. Your civil skills in Architecture and Engineering reduce build costs and times. Your class mastery unlocks special buildings only available to certain classes." },
      { id: "prestige-altar", name: "Prestige Altar", description: "A glowing altar where Potentials undertake quest chains to unlock prestige classes.", x: 70, y: 50, width: 18, height: 28, type: "terminal", action: "/prestige-quests", elaraDialog: "The Prestige Altar. Undertake quest chains that unlock prestige classes — advanced specializations that grant powerful bonuses to everything you do. Each requires specific base classes, species, and skill levels." },
      { id: "door-bridge-sanctum", name: "Return to Bridge", description: "The passage back to the Command Bridge.", x: 10, y: 45, width: 14, height: 38, type: "door", action: "bridge" },
    ],
  },
  {
    id: "social-hub",
    name: "Social Hub",
    deck: 7,
    deckName: "Social",
    description: "A bustling lounge area with holographic communication terminals, message boards, and a cozy reading nook. Operatives gather here to connect, trade stories, and challenge each other.",
    elaraIntro: "The Social Hub. This is where Potentials connect with each other — send friend requests, exchange messages, issue friendly challenges, and donate resources to their guild. The Lore Journal station lets you write about the Dischordian Saga and earn XP for your literary contributions.",
    imageUrl: assetUrl("art/rooms/room-social-hub.webp"),
    features: ["Social", "Friends", "Messages", "Friendly Challenges", "Donations", "Lore Journal"],
    featureRoutes: ["/social", "/friendly-challenges", "/donations", "/lore-journal"],
    unlockRequirement: { type: "room_visited", value: "bridge" },
    connections: ["bridge", "guild-sanctum", "war-room"],
    hotspots: [
      // Anchored 2026-04-25 against the AAA Final social-hub render —
      // warm wood-and-brass lounge with three back-wall kiosks
      // (orange-icon comm wall on the left, central holographic
      // challenge board with two combatants, golden donation column on
      // the right), curved nebular viewport behind, walnut Lore
      // Journal Desk in the foreground, cozy armchair reading nook on
      // the right, Bridge doorway on the far-left wall.
      { id: "comm-terminal", name: "Communications Terminal", description: "Send messages, manage friends, and stay connected.", x: 10, y: 30, width: 22, height: 35, type: "terminal", action: "/social", elaraDialog: "The Communications Terminal. Send friend requests, exchange direct messages, and manage your social connections. A strong network is essential for guild operations and cooperative raids." },
      { id: "challenge-board", name: "Challenge Board", description: "Issue and accept friendly challenges with custom rules.", x: 32, y: 30, width: 22, height: 32, type: "terminal", action: "/friendly-challenges", elaraDialog: "The Challenge Board. Issue friendly challenges to other Potentials — unranked matches with custom rules. Check the daily challenge for bonus rewards. Your RPG build affects your challenge effectiveness." },
      { id: "donation-shrine", name: "Donation Shrine", description: "Donate resources to your guild and earn reputation.", x: 52, y: 28, width: 14, height: 38, type: "terminal", action: "/donations", elaraDialog: "The Donation Shrine. Contribute resources to your guild and earn reputation points. Higher reputation unlocks special guild perks and shows your dedication to the cause." },
      { id: "lore-desk", name: "Lore Journal Desk", description: "Write about the Dischordian Saga and earn XP.", x: 22, y: 60, width: 36, height: 35, type: "terminal", action: "/lore-journal", elaraDialog: "The Lore Journal. Write about characters, factions, events, and theories from the Dischordian Saga. Your writing earns XP based on word count, and your RPG build provides writing bonuses — Oracle class boosts XP multiplier, Diplomat civil skill improves engagement." },
      { id: "door-bridge-social", name: "Return to Bridge", description: "The corridor back to the Command Bridge.", x: 0, y: 30, width: 10, height: 50, type: "door", action: "bridge" },
    ],
  },
  {
    id: "war-room",
    name: "War Room",
    deck: 6,
    deckName: "Combat",
    description: "A heavily armored chamber with tactical displays showing raid targets, boss health bars, and seasonal event progress. The walls are lined with trophy cases and replay screens.",
    elaraIntro: "The War Room. This is the combat operations center. Coordinate cooperative raids against massive bosses, track your boss mastery levels, watch battle replays, and participate in seasonal events. Your combat class, prestige rank, and elemental affinity all determine your effectiveness here.",
    imageUrl: assetUrl("art/rooms/room-war-room.webp"),
    features: ["Coop Raids", "Boss Mastery", "Replays", "Seasonal Events", "Cosmetic Shop"],
    featureRoutes: ["/coop-raids", "/boss-mastery", "/replays", "/seasonal-events", "/cosmetic-shop"],
    unlockRequirement: { type: "room_visited", value: "bridge" },
    connections: ["bridge", "station-dock", "social-hub"],
    hotspots: [
      // Anchored 2026-04-25 against the AAA Final war-room (deck-6
      // Combat Ops) render — armored chamber with three back-wall
      // tactical displays (left replay panel, central orange hex
      // boss-mastery column flanked by raid icons, right combatant
      // schematic), purple-crystal Seasonal Event Beacon obelisk in
      // the left foreground, central Cosmetic Kiosk console with
      // floating item silhouettes, two arched doorways at the far
      // edges (left → Bridge, right → Personal Quarters).
      { id: "raid-table", name: "Raid Planning Table", description: "Coordinate cooperative boss raids with your guild.", x: 38, y: 10, width: 22, height: 60, type: "terminal", action: "/coop-raids", elaraDialog: "The Raid Planning Table. Rally your guild to take on massive bosses. Your class mastery, civil skills, and prestige all affect your damage output. Coordinate roles — DPS, tank, support — for maximum effectiveness." },
      { id: "mastery-wall", name: "Boss Mastery Wall", description: "Track your mastery levels for each boss.", x: 62, y: 10, width: 22, height: 38, type: "terminal", action: "/boss-mastery", elaraDialog: "The Boss Mastery Wall. Each boss you defeat earns mastery XP. Higher mastery unlocks exclusive cosmetics and titles. Compete on the mastery leaderboard." },
      { id: "replay-screen", name: "Replay Archive", description: "Watch recordings of past battles.", x: 12, y: 10, width: 24, height: 38, type: "terminal", action: "/replays", elaraDialog: "The Replay Archive. Watch recordings of past card battles and raids. Study strategies, share memorable moments, and learn from the best players." },
      { id: "event-beacon", name: "Seasonal Event Beacon", description: "Participate in time-limited seasonal events.", x: 22, y: 40, width: 12, height: 35, type: "terminal", action: "/seasonal-events", elaraDialog: "The Seasonal Event Beacon. Time-limited events with unique themes, exclusive rewards, and global objectives. Your RPG build provides event bonuses — certain classes and species earn tokens faster." },
      { id: "cosmetic-kiosk", name: "Cosmetic Kiosk", description: "Browse and purchase cosmetic items.", x: 50, y: 60, width: 22, height: 30, type: "terminal", action: "/cosmetic-shop", elaraDialog: "The Cosmetic Kiosk. Card art variants, avatar frames, titles, themes, and emotes. Some items require specific prestige classes or boss mastery levels to unlock." },
      { id: "quarters-door", name: "Personal Quarters", description: "Your private quarters aboard the Ark.", x: 85, y: 30, width: 14, height: 60, type: "terminal", action: "/personal-quarters", elaraDialog: "Your Personal Quarters. Decorate your private space with items earned through gameplay. Your class and species unlock unique decorations. Visitors can tour your quarters." },
      { id: "door-bridge-war", name: "Return to Bridge", description: "The corridor back to the Command Bridge.", x: 1, y: 30, width: 14, height: 60, type: "door", action: "bridge" },
    ],
  },
  /* ═══ DREAMS WORKSHOP SUB-BASEMENT ═══
     Unlocked after Palimpsest Episode 12 completes. The sub-basement
     exists on no official deck plan — Elara has to re-index her
     own floor layout to find it. It houses Darren Fessler's desk
     (the memorial interactable) and the door the Inventor promised
     in his post-finale Signal Beacon.                              */
  {
    id: "dreams-workshop-subbasement",
    name: "Dreams Workshop (Sub-Basement)",
    deck: 0,
    deckName: "Uncharted",
    description: "A low-ceilinged maintenance level that does not appear on any official deck plan. The air is warm. The fluorescents hum. Nine post-its and a polaroid wait on a cluttered desk at the back wall. Nobody has been here in a while — except whoever keeps the dust off the corkboard.",
    elaraIntro: "I am... re-indexing my floor plan right now to account for this room. I did not have a record of it before Episode 12 completed. I am going to be honest with you: that fact frightens me. Please be gentle in here. This was Darren's space.",
    imageUrl: assetUrl("art/rooms/room-dreams-workshop-subbasement.webp"),
    features: ["Darren's Desk", "The Inventor's Door", "Blue Folder"],
    featureRoutes: [],
    unlockRequirement: { type: "narrative_event", value: "palimpsest_ep12_completed" },
    connections: ["bridge"],
    hotspots: [
      // Anchored 2026-04-25 against the AAA Final sub-basement render —
      // a battered concrete maintenance crawlspace, fluorescent tubes
      // overhead, painted-blue stairwell ascending to the Bridge on
      // the far-left, the Inventor's Door propped open at centre-left
      // (a heavy steel door slightly ajar onto a black corridor with a
      // distant amber glow), Darren's grey metal desk against the
      // right wall lit by a single warm tungsten lamp, the corkboard
      // above the desk pinned with a polaroid of Marguerite + clippings,
      // post-it squares scattered across the desk surface and lamp
      // base.
      { id: "darrens-desk", name: "Darren's Desk", description: "A cluttered metal desk. The blue folder the Host banned from broadcast sits on top. Nine hand-written post-its cover the lamp. A polaroid of Marguerite Fessler is tucked into the corkboard. You realize you are the first visitor since Darren stopped coming to work.", x: 60, y: 50, width: 38, height: 45, type: "interact", action: "dreams_workshop_darrens_desk", elaraDialog: "That's the desk. The blue folder is on top. I'm going to stop narrating for a moment. You should get to meet him yourself." },
      { id: "blue-folder", name: "The Blue Folder", description: "A plain blue manila folder. Eight Loredex entries, cross-referenced with corruption markers, the red-ink corrections Professor Vyre made on Episode 6, and Darren's handwriting in the margin.", x: 76, y: 75, width: 12, height: 12, type: "item", action: "darren-blue-folder", elaraDialog: "All eight entries are genuinely corrupted in my copy of the Chronicle. Darren was right about every one. I cross-referenced them twice because I couldn't believe it the first time." },
      { id: "marguerite-polaroid", name: "Polaroid of Marguerite", description: "A small polaroid. Marguerite Fessler, Celebration sector cemetery, 14 years before the Fall. Her handwriting on the back says 'Don't forget to eat, D.'", x: 62, y: 22, width: 10, height: 12, type: "examine", elaraDialog: "His mother. Her birthday is Thursday. I am going to put a recurring reminder on the Ark's master clock. Every Thursday, in perpetuity, I will tell one crew member it is Marguerite Fessler's birthday. I do not know if that counts as a substitute for a son. I am going to do it anyway." },
      { id: "inventors-door", name: "The Inventor's Door", description: "A door that was not here before. It is propped open with a brick. The brick has the Inventor's signature on it in red ink: '—I.'", x: 24, y: 25, width: 18, height: 65, type: "door", elaraDialog: "I have never seen this door before. It is not on any deck plan I have ever been given. The brick propping it open was not manufactured on this Ark. I am going to be direct with you: I think this door leads somewhere I cannot follow you. Please come back." },
      { id: "post-it-wall", name: "Nine Post-It Notes", description: "Nine hand-written post-its in Darren's uneven block-caps. They cover the lamp base and the corkboard edge.", x: 62, y: 78, width: 14, height: 14, type: "examine", elaraDialog: "Applause light. Vyre's red ink. Alaric's cufflink. Call the Antiquarian back. Marguerite's birthday. Leave earlier tonight. He was keeping score of every lie on the show and reminding himself of one real thing per day." },
      { id: "door-exit-workshop", name: "Return to Bridge", description: "A narrow stairwell leading back up to the Bridge.", x: 0, y: 30, width: 14, height: 60, type: "door", action: "bridge" },
    ],
  },
];

/* ─── DEFAULT STATE ─── */
const DEFAULT_CHARACTER_CHOICES: CharacterChoices = {
  species: null,
  characterClass: null,
  alignment: null,
  element: null,
  name: "",
  attrAttack: 1,
  attrDefense: 1,
  attrVitality: 1,
};

const DEFAULT_GAME_STATE: GameState = {
  phase: "FIRST_VISIT",
  awakeningStep: "BLACKOUT",
  characterChoices: { ...DEFAULT_CHARACTER_CHOICES },
  characterCreated: false,
  rooms: {},
  currentRoomId: null,
  itemsCollected: [],
  achievementsEarned: [],
  elaraDialogHistory: [],
  totalRoomsUnlocked: 0,
  totalItemsFound: 0,
  narrativeFlags: {},
  // F13 — initial band values per character bible: lucid (slightly positive) +
  // shadow (meaningfully negative). Both reach ±100.
  elaraStability: 10,
  humanLight: -20,
  clueJournal: [],
  mysteryInventory: [],
  claimedQuestRewards: [],
  completedGames: [],
  loreAchievements: [],
  conexusXp: 0,
  collectedCards: [],
  activeDeck: [],
  moralityScore: 0,
  moralityChoices: [],
  completedTutorials: [],
  moralityUnlocks: [],
  discoveredTransmissions: [],
  // Elara relationship defaults
  elaraTrust: 10,
  elaraArchetype: { compassionate: 0, pragmatic: 0, suspicious: 0, loyal: 0, manipulative: 0 },
  elaraCallbacks: {},
  humanTrust: 0,
  humanCallbacks: {},
  narratorBond: 0,
  yearOneMonth: 1,
  // NPC relationship defaults
  npcTrust: { agent_zero: 0, locke: 0, source: 0, antiquarian: 0, shadow_tongue: 0 },
  npcCallbacks: { agent_zero: {}, locke: {}, source: {}, antiquarian: {}, shadow_tongue: {} },
  npcRevealed: { agent_zero: [], locke: [], source: [], antiquarian: [], shadow_tongue: [] },
  npcDiscovered: { agent_zero: false, locke: false, source: false, antiquarian: false, shadow_tongue: false },
  npcConversationCount: { agent_zero: 0, locke: 0, source: 0, antiquarian: 0, shadow_tongue: 0 },
  npcSecretsShared: { agent_zero: 0, locke: 0, source: 0, antiquarian: 0, shadow_tongue: 0 },
  // Crafting system defaults
  craftingSkills: { weaponsmith: 0, armorsmith: 0, enchanting: 0, alchemy: 0, engineering: 0 },
  craftingXp: { weaponsmith: 0, armorsmith: 0, enchanting: 0, alchemy: 0, engineering: 0 },
  craftingMaterials: {},
  craftedItems: [],
  craftingLog: [],
  // Act 2 defaults. Memory Energy starts with enough juice for ~3 common
  // crafts so the pinch lands in the bench's middle-game, not its opener.
  memoryEnergy: MEMORY_ENERGY_STARTING,
  chessDepth: 0,
  // Companion system defaults
  companionRelationships: { elara: 5, the_human: 0 },
  companionQuestsCompleted: [],
  companionQuestsActive: [],
  companionBackstoryUnlocked: ["elara_bs_1"],
  companionRomanceActive: null,
  companionDialogHistory: { elara: [], the_human: [] },
  // Inception Ark fleet
  assignedArkId: null,
  discoveredArks: [],
  // Diplomacy
  completedDiplomacyEvents: [],
  diplomacyChoices: [],
  factionReputation: { empire: 0, insurgency: 0, independent: 0, pirate: 0 },
  // Faction War
  factionWarState: {
    activeWar: null,
    warProgress: 0,
    empireContribution: 0,
    insurgencyContribution: 0,
    playerContribution: 0,
    playerFaction: null,
    completedWars: [],
    activeExclusiveRoutes: [],
    warHistory: [],
  },
  // Companion gifts
  giftsGiven: [],
  // Loyalty missions
  completedLoyaltyMissions: [],
  activeLoyaltyMission: null,
  loyaltyMissionStep: 0,
  loyaltyLoreUnlocked: [],
  loyaltyTitles: [],
  // Narrative v2: Act progression & Army management
  narrativeAct: 0,
  narrativeActChoices: [],
  // Prelude playhead — pre-Prelude default
  currentPreludeBeat: null,
  preludeCompletedFlags: [],
  lightDarkAlignment: null,
  act1PublicWitnessBalance: null,
  humanContactMade: false,
  humanContactSecret: false,
  elaraKnowsAboutHuman: false,
  elaraDiscoveryPath: null,
  humanTrustLevel: 0,
  elaraTrustLevel: 80,
  // Army management
  armyUnits: [],
  armyDeployments: [],
  armyCompletedDeployments: [],
  armySectors: {},
  armyRecruitmentMissionsCompleted: [],
  armyTotalMissionsDeployed: 0,
  armyTotalMissionsSucceeded: 0,
  armyTotalMissionsFailed: 0,
  // Wave 2 narrative systems
  thoughtInternalizing: [],
  thoughtInternalized: [],
  thoughtDiscovered: [],
  archetypeEmerged: [],
  archetypePrimary: null,
  archetypeEmergenceDates: {},
  ideologyCommitted: null,
  ideologyFlags: {},
  innerVoiceSkills: {
    tactics: 50, perception: 50, craftsmanship: 50, endurance: 50,
    negotiation: 50, espionage: 50, leadership: 50, lore: 50,
    empathy: 50, paranoia: 50, intuition: 50, authority: 50,
  },
  petBonds: {},
  apprentice: null,
  apprenticeFallen: [],
  apprenticeRecruitCooldownUntil: 0,
  academyTranscript: [],
  professorApproval: {},
  housePoints: {},
  pinInventory: [],
  mechronisHouseId: null,
  trialHistory: [],
  corruptionLevel: 0,
  darkAbilitiesUsed: [],
  purgeRitualsCompleted: [],
  sortingComplete: false,
  sortedIntoArchon: null,
  transmissionsWatched: [],
  transmissionsNotified: [],
  oracleRevealActive: false,
  oracleRevealTier: 0,
  transmissionPlaybackPositions: {},
  loredexDiscovered: [],
  legionRoster: { assignments: [], unassigned: [], sacrificedHistory: [] },
  legionGraduates: {},
  legionLetters: [],
  prestigeLevel: 0,
  prestigeBaseline: null,
};

const GAME_STORAGE_KEY = "loredex_game_state";

/* ─── CONTEXT ─── */
interface GameContextValue {
  state: GameState;
  // Awakening flow
  advanceAwakening: () => void;
  setAwakeningStep: (step: AwakeningStep) => void;
  setCharacterChoice: <K extends keyof CharacterChoices>(key: K, value: CharacterChoices[K]) => void;
  completeAwakening: () => void;
  // Room exploration
  enterRoom: (roomId: string) => void;
  collectItem: (itemId: string) => void;
  markElaraDialogSeen: (roomId: string) => void;
  // Utility
  isRoomUnlocked: (roomId: string) => boolean;
  canUnlockRoom: (roomId: string) => boolean;
  getRoomDef: (roomId: string) => RoomDef | undefined;
  getRoomState: (roomId: string) => RoomState | undefined;
  getUnlockedRooms: () => RoomDef[];
  resetGame: () => void;
  // CoNexus game tracking
  completeGame: (gameId: string) => void;
  earnLoreAchievement: (achievementId: string) => void;
  isGameCompleted: (gameId: string) => boolean;
  // Card collection
  collectCard: (cardId: string) => void;
  setActiveDeck: (cardIds: string[]) => void;
  // Narrative flags
  setNarrativeFlag: (flag: string, value?: boolean) => void;
  // Section F — Mystery actions (cryo bay + every other room module)
  logClue: (clue: import("@shared/roomMysteries").Clue) => void;
  grantMysteryItem: (itemId: string) => void;
  // Quest rewards
  claimQuestReward: (questId: string) => void;
  // Morality meter
  shiftMorality: (
    amount: number,
    tutorialId?: string,
    choiceId?: string,
    sourceContext?: "dialog" | "quest" | "event" | "governance" | "companion" | "diplomacy" | "celebration_trial",
  ) => void;
  getMoralityLabel: () => string;
  getMoralityTier: () => { tier: string; level: number };
  unlockMoralityReward: (rewardId: string) => void;
  // Secret transmissions
  discoverTransmission: (transmissionId: string) => void;
  isTransmissionDiscovered: (transmissionId: string) => boolean;
  // Tutorials
  completeTutorial: (tutorialId: string) => void;
  isTutorialCompleted: (tutorialId: string) => boolean;
  // Crafting system
  craftItem: (recipeId: string, materialsUsed: Record<string, number>, dreamCost: number, skillId: string, xpGain: number, outputItemId: string, outputQuantity: number, memoryEnergyCost?: number) => void;
  craftFailed: (recipeId: string, materialsUsed: Record<string, number>, dreamCost: number, skillId: string, xpGain: number) => void;
  addMaterial: (materialId: string, quantity: number) => void;
  // Companion system
  gainCompanionXp: (companionId: string, amount: number) => void;
  activateCompanionQuest: (questId: string) => void;
  completeCompanionQuest: (questId: string) => void;
  unlockBackstory: (stageId: string) => void;
  setRomance: (companionId: string | null) => void;
  addCompanionDialogChoice: (companionId: string, choiceId: string) => void;
  getCompanionLevel: (companionId: string) => number;
  // Inception Ark fleet
  assignArk: (arkId: string) => void;
  discoverArk: (arkId: string) => void;
  // Diplomacy
  completeDiplomacyEvent: (eventId: string, choiceId: string, moralityDelta: number, reputationDeltas: Record<string, number>) => void;
  // Faction War
  startFactionWar: (warId: string, faction: "empire" | "insurgency") => void;
  contributeFactionWar: (amount: number) => void;
  advanceFactionWar: () => { ended: boolean; winner?: string };
  endFactionWar: () => { winner: string; playerContribution: number };
  giveCompanionGift: (giftId: string, companionId: string, xpGain: number) => void;
  // Loyalty missions
  startLoyaltyMission: (missionId: string) => void;
  advanceLoyaltyMission: (choiceId?: string, moralityShift?: number) => void;
  completeLoyaltyMission: (missionId: string, loreUnlock: string, moralityBonus: number, relationshipBonus: number, companionId: string, title?: string) => void;
  // Quick access
  skipToExploring: () => void;
  // ═══ NARRATIVE v2 ═══
  advanceNarrativeAct: (actId: number) => void;
  recordNarrativeChoice: (actId: number, sceneId: string, choiceId: string, moralityShift: number) => void;
  // Prelude playhead setters (see currentPreludeBeat / preludeCompletedFlags
  // / lightDarkAlignment fields above). PreludeSequencePlayer calls these
  // as the player moves through the 15 beats.
  setCurrentPreludeBeat: (beatId: string | null) => void;
  recordPreludeCompletionFlag: (flag: string) => void;
  setLightDarkAlignment: (alignment: "light" | "dark" | null) => void;
  /**
   * §5.7 → §5.8 campaign-layer handoff. DuelystGameUI's match-end
   * hook calls this with `gameState.publicWitness.balance` when the
   * Game Master match resolves; `computeAuthorityTrialOverride`
   * (`@shared/act1TrialHandoff`) reads it when the §5.8 Authority
   * trial starts to seed `trialMode.openingVerdictBalance`.
   */
  setAct1PublicWitnessBalance: (balance: number | null) => void;
  setHumanContact: (made: boolean) => void;
  setHumanContactSecret: (secret: boolean) => void;
  setElaraKnowsAboutHuman: (knows: boolean, path: "told" | "discovered" | "betrayed") => void;
  adjustHumanTrust: (delta: number) => void;
  adjustElaraTrust: (delta: number) => void;
  /** Adjust the unified §14.1 "both narrators" bond by a delta (clamped 0..100). */
  adjustNarratorBond: (delta: number) => void;
  /** Read the current bond. Falls back to min(elaraTrust, humanTrust) on pre-field saves. */
  getNarratorBond: () => number;
  /** Apply a raw delta to Memory Energy (clamped to [0, cap]). Positive or negative. */
  adjustMemoryEnergy: (delta: number) => void;
  /** Earn Memory Energy from a canonical source (rate from memoryEnergy.ts). Returns the applied delta. */
  earnMemoryEnergy: (source: MemoryEnergyEarnSource, overrideDelta?: number) => number;
  /** Read the active Memory Energy cap (lifts 50 → 200 on trade_empire_unlocked). */
  getMemoryEnergyCap: () => number;
  /** Bump chess depth on a win (idempotent at same value; fires Zephyr-9 threshold unlocks via useNarrativeIntegration). */
  recordChessWin: () => void;
  /** Open the next Year One Calendar month (raises year_one_month_N_opened; clamps at 12). */
  advanceYearOneMonth: () => void;
  /** Read the current Year One month (1..12). Falls back to flag-scan on pre-field saves. */
  getYearOneMonth: () => number;
  /** Mark a sector recruitment mission as complete. Idempotent; gates Acts 6 + 7. */
  completeRecruitmentMission: (missionId: string) => void;
  /** Set a flat Elara callback flag (used by roomDialogs + Palimpsest episode callbacks). */
  setElaraCallback: (flag: string, value?: boolean) => void;
  /** Set a flat Human callback flag (parallel to Elara's, for The Human's whispers). */
  setHumanCallback: (flag: string, value?: boolean) => void;
  // ═══ NPC RELATIONSHIPS ═══
  adjustNpcTrust: (npcId: string, delta: number) => void;
  discoverNpc: (npcId: string) => void;
  setNpcCallback: (npcId: string, callbackId: string) => void;
  revealNpcSecret: (npcId: string, revelationId: string) => void;
  incrementNpcConversation: (npcId: string) => void;
  // ═══ PRESTIGE ═══
  performPrestige: () => void;
  /** Current prestige level (0 = never prestiged). */
  getPrestigeLevel: () => number;
  /** Lifetime carryover baseline. Empty stats on a never-prestiged save. */
  getPrestigeBaseline: () => PrestigeCycleStats;
  // ═══ ARMY MANAGEMENT ═══
  recruitUnit: (unit: ArmyUnit) => void;
  deployUnits: (deployment: ArmyDeployment) => void;
  completeDeployment: (deploymentId: string, success: boolean, report: string, reportSpeaker: "elara" | "human" | "system", rewards?: { type: string; amount: number }[]) => void;
  updateSectorControl: (sectorId: string, updates: Partial<SectorControl>) => void;
  getAvailableUnits: () => ArmyUnit[];
  getActiveDeployments: () => ArmyDeployment[];
  checkDeploymentCompletion: () => CompletedDeployment[];
  // Server sync
  // Task 3.1 — syncStatus / lastSyncedAt moved to useSyncStatusStore.
  // Read them with:
  //   import { useSyncStatusStore, selectStatus } from "@/stores/syncStatusStore";
  //   const status = useSyncStatusStore(selectStatus);
  forceSave: () => void;
  /** True once the server state load attempt has completed (or auth check determined no user) */
  isServerSyncReady: boolean;
  // ─── Wave 2 narrative setters ───
  startInternalizingThought: (thoughtId: string) => void;
  completeInternalizingThought: (thoughtId: string) => void;
  addArchetypeEmergence: (archetypeId: string, isPrimary?: boolean) => void;
  commitIdeology: (visionId: string) => void;
  setIdeologyFlag: (flag: string, value?: boolean) => void;
  setInnerVoiceSkill: (skill: string, level: number) => void;
  updatePetBond: (petId: string, partial: Partial<GameState["petBonds"][string]>) => void;
  // Apprentice setters
  setApprentice: (apprentice: unknown | null) => void;
  recordFallenApprentice: (apprentice: unknown) => void;
  setApprenticeRecruitCooldown: (untilTs: number) => void;
  // Mechronis Academy + Trial History setters
  addAcademyTranscriptEntry: (entry: { day: number; professorId: string; lessonId: string; grade: string; xpDelta: number }) => void;
  adjustProfessorApproval: (professorId: string, delta: number) => void;
  addTrialHistoryEntry: (entry: { day: number; mascoteerId: string; decisionId: string; optionId: string; bondDelta: number; corruptionDelta: number; moralityDelta: number }) => void;
  /** Adjust House Cup standings (delta can be negative). */
  adjustHousePoints: (houseId: string, delta: number) => void;
  /** Pin the player's Mechronis House (one-time on Sorting Ceremony). */
  setMechronisHouse: (houseId: string) => void;
  /** Award a Celebration pin. Idempotent: no duplicates. */
  addPin: (pinId: string) => void;
  // Dark Arts setters
  addCorruption: (amount: number) => void;
  recordDarkAbilityUse: (abilityId: string) => void;
  completePurgeRitual: (ritualId: string, reduction: number) => void;
  // Sorting Ceremony
  completeSorting: (archonNumber: number) => void;
  markTransmissionWatched: (id: string, triggersOracleReveal: boolean) => void;
  markTransmissionNotified: (id: string) => void;
  addLoredexDiscovered: (entityIds: string[]) => void;
  setTransmissionPlaybackPosition: (id: string, positionSeconds: number) => void;
  clearTransmissionPlaybackPosition: (id: string) => void;
  // Graduate Legion
  addGraduate: (apprentice: unknown) => void;
  setLegionRoster: (roster: unknown) => void;
  addLegionLetter: (letter: { id: string; fromApprenticeId: string; body: string }) => void;
  markLettersRead: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

/**
 * Migrate a loaded game state snapshot into its current shape.
 * Extracted out so both local hydration and server-sync hydration
 * get the same treatment. Idempotent.
 */
function migrateGameState(parsed: Partial<GameState>): GameState {
  const merged: GameState = { ...DEFAULT_GAME_STATE, ...parsed };

  // Light/Dark alignment rename back-compat: this field was originally
  // `preludeAlignment` (captured at Prelude Beat J). It moved to Act 1
  // Cycle C in the Last Words restructure; the field was renamed to
  // `lightDarkAlignment` to reflect the new narrative home. Preserve
  // existing playtester choices by forwarding the legacy key.
  const legacyAlignment = (parsed as Record<string, unknown>)[
    "preludeAlignment"
  ];
  if (
    merged.lightDarkAlignment === null &&
    (legacyAlignment === "light" || legacyAlignment === "dark")
  ) {
    merged.lightDarkAlignment = legacyAlignment;
  }

  // Oracle reveal back-compat: pre-tier saves stored a boolean.
  // If the legacy flag is set but the new tier defaulted to 0, bump
  // the tier to 1 so those players keep a visible reveal instead of
  // falling back to the pre-reveal pink theme after upgrading.
  if (merged.oracleRevealActive && (merged.oracleRevealTier ?? 0) === 0) {
    merged.oracleRevealTier = 1;
  }

  // Legacy transmissionId collision: pre-fix code produced `ep0-N`
  // for both Epoch 0 episodes 1-10 AND Spaces In Between episodes
  // 1-10. We can't retroactively split them, so we leave the
  // existing `ep0-N` ids in place (interpreted as Epoch 0) and log
  // a one-shot warning so QA can notice mis-attributed state.
  const collidable = (merged.transmissionsWatched ?? []).filter(
    id => /^ep0-(?:[1-9]|10)$/.test(id),
  );
  if (
    collidable.length > 0 &&
    typeof window !== "undefined" &&
    !(window as unknown as { __txMigrationWarned?: boolean }).__txMigrationWarned
  ) {
    (window as unknown as { __txMigrationWarned?: boolean }).__txMigrationWarned = true;
    // eslint-disable-next-line no-console
    console.warn(
      "[Transmissions] Legacy save contains %d `ep0-N` id(s) that may originally have referred to Spaces In Between episodes. Treating as Epoch 0. If any SIB episode looks unwatched, re-watch it to restore credit.",
      collidable.length,
    );
  }

  return merged;
}

function loadGameState(): GameState {
  try {
    const raw = localStorage.getItem(GAME_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GameState>;
      return migrateGameState(parsed);
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_GAME_STATE };
}

function saveGameState(state: GameState) {
  try {
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(loadGameState);
  // Task 3.1 — sync status now lives in useSyncStatusStore. These imperative
  // handles keep the existing call sites one-liners while allowing selector-
  // level subscriptions on the consumer side.
  const setSyncStatus = useSyncStatusStore((s) => s.setStatus);
  const markSynced = useSyncStatusStore((s) => s.markSynced);
  const markError = useSyncStatusStore((s) => s.markError);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoadedFromServer = useRef(false);

  // tRPC hooks for server sync
  const authQuery = trpc.auth.me.useQuery(undefined, { retry: false });
  const loadQuery = trpc.gameState.load.useQuery(undefined, {
    enabled: !!authQuery.data,
    retry: false,
  });
  const saveMutation = trpc.gameState.save.useMutation();

  // Server sync readiness: true once we know whether server state exists
  // - If not authenticated (authQuery resolved with no user): ready immediately
  // - If authenticated: ready once loadQuery has resolved (success or error)
  const isServerSyncReady = 
    authQuery.isFetched && (
      !authQuery.data || // Not authenticated — no server state to load
      loadQuery.isFetched || // Auth'd and load query resolved
      loadQuery.isError // Auth'd but load failed
    );

  // Restore client-side localStorage keys from server-saved snapshot.
  // Declared BEFORE the useEffect that references it to avoid TDZ errors
  // in the production Rollup bundle (dependency arrays are evaluated at render time).
  const restoreClientState = useCallback((clientState: Record<string, unknown> | null) => {
    if (!clientState) return;
    const safeSet = (key: string, val: unknown) => {
      if (val === null || val === undefined) return;
      try { localStorage.setItem(key, typeof val === "string" ? val : JSON.stringify(val)); } catch { /* full */ }
    };
    // Only restore keys that don't already exist locally (don't overwrite fresher local data)
    const restoreIfMissing = (key: string, val: unknown) => {
      if (!localStorage.getItem(key) && val != null) safeSet(key, val);
    };
    restoreIfMissing("loredex-gamification", clientState.gamification);
    restoreIfMissing("loredex_discovered", clientState.discovered);
    restoreIfMissing("loredex_discovered_secrets", clientState.discoveredSecrets);
    restoreIfMissing("loredex_room_easter_eggs", clientState.roomEasterEggs);
    restoreIfMissing("loredex_lore_fragments", clientState.loreFragments);
    restoreIfMissing("loredex_bonus_cards", clientState.bonusCards);
    restoreIfMissing("loredex_completed_tutorials", clientState.completedTutorials);
    // Task 2.1 — restore the four loredex arrays the stats path relies on.
    restoreIfMissing("loredex_puzzles_solved", clientState.puzzlesSolved);
    restoreIfMissing("loredex_easter_eggs", clientState.easterEggsFound);
    restoreIfMissing("loredex_battle_stats", clientState.battleStats);
    restoreIfMissing("loredex_cards_collected", clientState.cardsCollected);
    restoreIfMissing("dischordia_elo", clientState.dischordiaElo);
    restoreIfMissing("dischordia_wins", clientState.dischordiaWins);
    restoreIfMissing("dischordia_losses", clientState.dischordiaLosses);
    restoreIfMissing("dischordia_tutorial_complete", clientState.dischordiaTutorial);
    restoreIfMissing("terminus_highest_wave", clientState.terminusHighestWave);
    restoreIfMissing("terminus_kills", clientState.terminusKills);
    restoreIfMissing("terminus_trophies", clientState.terminusTrophies);
    restoreIfMissing("terminus_puzzle_complete", clientState.terminusPuzzle);
    restoreIfMissing("card_upgrades", clientState.cardUpgrades);
    restoreIfMissing("loredex_multiverse_record", clientState.multiverseRecord);
    restoreIfMissing("equipment_state", clientState.equipmentState);
    restoreIfMissing("owned_specimens", clientState.ownedSpecimens);
    restoreIfMissing("active_specimen", clientState.activeSpecimen);
    restoreIfMissing("bestiary_kills", clientState.bestiaryKills);
    restoreIfMissing("bestiary_discovered", clientState.bestiaryDiscovered);
    restoreIfMissing("research_puzzles_solved", clientState.researchPuzzlesSolved);
    restoreIfMissing("research_entries_unlocked", clientState.researchEntriesUnlocked);
    restoreIfMissing("collectors_arena_story", clientState.collectorsArenaStory);
    restoreIfMissing("collectors_arena_intro_seen", clientState.collectorsArenaIntroSeen);
    restoreIfMissing("collectors_arena_lore_seen", clientState.collectorsArenaLoreSeen);
    restoreIfMissing("trade_empire_state", clientState.tradeEmpireState);
    restoreIfMissing("trade_empire_tech", clientState.tradeEmpireTech);
    restoreIfMissing("degen_casino", clientState.degenCasino);
    restoreIfMissing("gm_arena_clones", clientState.gmArenaClones);
    restoreIfMissing("loredex_watch_progress", clientState.watchProgress);
    restoreIfMissing("loredex_cryo_orientation_seen", clientState.cryoOrientationSeen);
    restoreIfMissing("loredex_cinematic_seen", clientState.cinematicSeen);
    restoreIfMissing("loredex_chess_cinematic_seen", clientState.chessCinematicSeen);
    restoreIfMissing("loredex_fight2d_tutorial_done", clientState.fight2dTutorialDone);
  }, []);

  // Load from server on login (merge with localStorage — server wins if newer)
  useEffect(() => {
    if (!loadQuery.data || hasLoadedFromServer.current) return;
    hasLoadedFromServer.current = true;
    const serverState = loadQuery.data.gameState as GameState | null;
    if (!serverState) return; // No server save, keep localStorage
    // Server state exists — check if it's more progressed
    const localState = loadGameState();
    const serverRooms = Object.values((serverState.rooms ?? {})).filter((r: any) => r?.unlocked).length;
    const localRooms = Object.values((localState.rooms ?? {})).filter((r: any) => r?.unlocked).length;
    // Use server state if it has more progress
    if (serverRooms >= localRooms && serverState.characterCreated) {
      // Restore client-side state from server (gamification, minigame stats, etc.)
      const clientState = (serverState as any)._clientState as Record<string, unknown> | null;
      if (clientState) {
        restoreClientState(clientState);
      }
      // Strip _clientState before setting game state (it's not part of GameState)
      const { _clientState: _, ...cleanState } = serverState as any;
      // Run the same migration applied to localStorage hydration so
      // server-side saves get Oracle reveal tier / legacy-id warnings
      // applied consistently.
      const merged = migrateGameState(cleanState as Partial<GameState>);
      setState(merged);
      saveGameState(merged);
      markSynced(loadQuery.data.savedAt ?? undefined);
    }
  }, [loadQuery.data, restoreClientState, markSynced]);

  // Save to localStorage on every state change
  useEffect(() => { saveGameState(state); }, [state]);

  // Debounced auto-save to server (5 seconds after last change)
  useEffect(() => {
    if (!authQuery.data || !state.characterCreated) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      doServerSave(state);
    }, 5000);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [state, authQuery.data]);

  // Collect all critical localStorage state that needs to survive device switches.
  // This supplements the gameState (which handles rooms, items, narrative flags, etc.)
  // with data that individual pages/components store independently.
  const collectClientState = useCallback((): Record<string, unknown> => {
    const safeGet = (key: string) => {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
    };
    return {
      // Gamification XP/level/achievements
      gamification: safeGet("loredex-gamification"),
      // Discovery & exploration
      discovered: safeGet("loredex_discovered"),
      discoveredSecrets: safeGet("loredex_discovered_secrets"),
      roomEasterEggs: safeGet("loredex_room_easter_eggs"),
      loreFragments: safeGet("loredex_lore_fragments"),
      bonusCards: safeGet("loredex_bonus_cards"),
      completedTutorials: safeGet("loredex_completed_tutorials"),
      // Puzzles, easter eggs, battle stats, and card collection are
      // read here (not just the length for stats) so they survive a
      // device switch. See Task 2.1.
      puzzlesSolved: safeGet("loredex_puzzles_solved"),
      easterEggsFound: safeGet("loredex_easter_eggs"),
      battleStats: safeGet("loredex_battle_stats"),
      cardsCollected: safeGet("loredex_cards_collected"),
      // Minigame stats
      dischordiaElo: localStorage.getItem("dischordia_elo"),
      dischordiaWins: localStorage.getItem("dischordia_wins"),
      dischordiaLosses: localStorage.getItem("dischordia_losses"),
      dischordiaTutorial: localStorage.getItem("dischordia_tutorial_complete"),
      terminusHighestWave: localStorage.getItem("terminus_highest_wave"),
      terminusKills: localStorage.getItem("terminus_kills"),
      terminusTrophies: localStorage.getItem("terminus_trophies"),
      terminusPuzzle: localStorage.getItem("terminus_puzzle_complete"),
      // Card game
      cardUpgrades: safeGet("card_upgrades"),
      multiverseRecord: safeGet("loredex_multiverse_record"),
      // Equipment
      equipmentState: safeGet("equipment_state"),
      // Specimens & companions
      ownedSpecimens: safeGet("owned_specimens"),
      activeSpecimen: localStorage.getItem("active_specimen"),
      bestiaryKills: safeGet("bestiary_kills"),
      bestiaryDiscovered: safeGet("bestiary_discovered"),
      // Research
      researchPuzzlesSolved: localStorage.getItem("research_puzzles_solved"),
      researchEntriesUnlocked: safeGet("research_entries_unlocked"),
      // Story mode (fight)
      collectorsArenaStory: safeGet("collectors_arena_story"),
      collectorsArenaIntroSeen: localStorage.getItem("collectors_arena_intro_seen"),
      collectorsArenaLoreSeen: localStorage.getItem("collectors_arena_lore_seen"),
      // Trade Empire
      tradeEmpireState: safeGet("trade_empire_state"),
      tradeEmpireTech: safeGet("trade_empire_tech"),
      // Casino & misc
      degenCasino: safeGet("degen_casino"),
      gmArenaClones: safeGet("gm_arena_clones"),
      // Watch progress
      watchProgress: safeGet("loredex_watch_progress"),
      // Cinematics seen
      cryoOrientationSeen: localStorage.getItem("loredex_cryo_orientation_seen"),
      cinematicSeen: localStorage.getItem("loredex_cinematic_seen"),
      chessCinematicSeen: localStorage.getItem("loredex_chess_cinematic_seen"),
      // Fight tutorials
      fight2dTutorialDone: localStorage.getItem("loredex_fight2d_tutorial_done"),
    };
  }, []);

  const doServerSave = useCallback(async (currentState: GameState) => {
    if (!authQuery.data) return;
    setSyncStatus("saving");
    try {
      const rooms = currentState.rooms ?? {};
      const roomsUnlocked = Object.values(rooms).filter(r => r.unlocked).length;
      const puzzlesSolved = JSON.parse(localStorage.getItem("loredex_puzzles_solved") || "[]").length;
      const easterEggsFound = JSON.parse(localStorage.getItem("loredex_easter_eggs") || "[]").length;
      const battleStats = JSON.parse(localStorage.getItem("loredex_battle_stats") || '{"won":0,"played":0}');
      const cardsCollected = JSON.parse(localStorage.getItem("loredex_cards_collected") || "[]").length;
      const totalRooms = ROOM_DEFINITIONS.length;
      const totalPuzzles = 8;
      const totalEasterEggs = 10;
      const totalCards = 30;
      const completionPercent = Math.round(
        (roomsUnlocked / totalRooms * 30) +
        (puzzlesSolved / totalPuzzles * 20) +
        (easterEggsFound / totalEasterEggs * 20) +
        (cardsCollected / totalCards * 15) +
        (Math.min(battleStats.won, 10) / 10 * 15)
      );
      const ranks = [
        { min: 0, name: "Unranked" }, { min: 5, name: "Recruit" },
        { min: 20, name: "Field Operative" }, { min: 40, name: "Senior Agent" },
        { min: 65, name: "Master Operative" }, { min: 90, name: "Grand Archivist" },
      ];
      const rank = [...ranks].reverse().find(r => completionPercent >= r.min)?.name ?? "Unranked";

      // Collect all client-side state for cross-device sync
      const clientState = collectClientState();

      await saveMutation.mutateAsync({
        gameState: { ...currentState, _clientState: clientState } as any,
        stats: {
          roomsUnlocked, totalRooms, puzzlesSolved, totalPuzzles,
          easterEggsFound, totalEasterEggs, battlesWon: battleStats.won ?? 0,
          battlesPlayed: battleStats.played ?? 0, cardsCollected, totalCards,
          completionPercent, rank,
        },
      });
      markSynced();
    } catch (e) {
      markError(e instanceof Error ? e.message : undefined);
    }
  }, [authQuery.data, saveMutation, setSyncStatus, markSynced, markError, collectClientState]);

  const forceSave = useCallback(() => {
    doServerSave(state);
  }, [state, doServerSave]);

  const advanceAwakening = useCallback(() => {
    setState(prev => {
      const steps: AwakeningStep[] = [
        "BLACKOUT", "CRYO_OPEN", "ELARA_INTRO",
        "SPECIES_QUESTION", "CLASS_QUESTION", "ALIGNMENT_QUESTION",
        "ELEMENT_QUESTION", "NAME_INPUT", "ATTRIBUTES", "FIRST_STEPS", "COMPLETE"
      ];
      const idx = steps.indexOf(prev.awakeningStep);
      const next = steps[Math.min(idx + 1, steps.length - 1)];
      return { ...prev, awakeningStep: next, phase: next === "COMPLETE" ? "QUARTERS_UNLOCKED" : "AWAKENING" };
    });
  }, []);

  const setAwakeningStep = useCallback((step: AwakeningStep) => {
    setState(prev => ({ ...prev, awakeningStep: step }));
  }, []);

  const setCharacterChoice = useCallback(<K extends keyof CharacterChoices>(key: K, value: CharacterChoices[K]) => {
    setState(prev => ({
      ...prev,
      characterChoices: { ...prev.characterChoices, [key]: value },
    }));
  }, []);

  const completeAwakening = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: "QUARTERS_UNLOCKED",
      awakeningStep: "COMPLETE",
      characterCreated: true,
      currentRoomId: "cryo-bay",
      rooms: {
        ...prev.rooms,
        "cryo-bay": {
          id: "cryo-bay",
          unlocked: true,
          visited: true,
          visitCount: 1,
          itemsFound: [],
          elaraDialogSeen: false,
        },
      },
      totalRoomsUnlocked: 1,
      // Awakening gives the player access to the Collector's archive + the
      // Resurrectionist's pods — the crew cloning system unlocks here.
      narrativeFlags: {
        ...prev.narrativeFlags,
        awakening_complete: true,
        crew_system_unlocked: true,
      },
    }));
  }, []);

  const canUnlockRoom = useCallback((roomId: string): boolean => {
    const def = ROOM_DEFINITIONS.find(r => r.id === roomId);
    if (!def) return false;
    const req = def.unlockRequirement;
    switch (req.type) {
      case "start":
        return true;
      case "room_visited":
        return !!state.rooms[req.value as string]?.visited;
      case "items_collected":
        return state.itemsCollected.length >= (req.value as number);
      case "rooms_unlocked":
        return state.totalRoomsUnlocked >= (req.value as number);
      case "chain_complete":
        return !!state.narrativeFlags[`chain_${req.value}_complete`];
      case "narrative_event":
        return !!state.narrativeFlags[req.value as string];
      case "specific_item":
        return state.itemsCollected.includes(req.value as string);
      default:
        return false;
    }
  }, [state.rooms, state.itemsCollected, state.totalRoomsUnlocked, state.narrativeFlags]);

  const isRoomUnlocked = useCallback((roomId: string): boolean => {
    return !!state.rooms[roomId]?.unlocked;
  }, [state.rooms]);

  const enterRoom = useCallback((roomId: string) => {
    setState(prev => {
      const existing = prev.rooms[roomId];
      const isNew = !existing?.unlocked;
      const newRooms = {
        ...prev.rooms,
        [roomId]: {
          id: roomId,
          unlocked: true,
          visited: true,
          visitCount: (existing?.visitCount ?? 0) + 1,
          itemsFound: existing?.itemsFound ?? [],
          elaraDialogSeen: existing?.elaraDialogSeen ?? false,
        },
      };
      const totalUnlocked = Object.values(newRooms).filter(r => r.unlocked).length;
      const allRoomsUnlocked = totalUnlocked >= ROOM_DEFINITIONS.length;

      // ═══ AUTO-SET NARRATIVE FLAGS ON ROOM ENTRY ═══
      // These flags drive the narrative unlock chain for ship exploration.
      // Each room visit triggers Elara "restoring" the next section of the ship.
      const newFlags = { ...prev.narrativeFlags };
      if (roomId === "bridge" && isNew) {
        // Visiting Bridge for the first time: Elara reroutes power to Comms Array
        newFlags["bridge_systems_restored"] = true;
      }
      if (roomId === "comms-array" && isNew) {
        // Visiting Comms Array: Elara detects power fluctuation, opens Engineering
        newFlags["power_grid_restored"] = true;
      }
      if (roomId === "engineering" && isNew) {
        // Visiting Engineering: combat systems come online, Armory unlocks
        newFlags["combat_systems_online"] = true;
      }
      if (roomId === "armory" && isNew) {
        // Visiting Armory: Elara pressurizes the Cargo Hold
        newFlags["cargo_bay_pressurized"] = true;
      }

      return {
        ...prev,
        currentRoomId: roomId,
        rooms: newRooms,
        totalRoomsUnlocked: totalUnlocked,
        narrativeFlags: newFlags,
        phase: allRoomsUnlocked ? "FULL_ACCESS" : (prev.phase === "QUARTERS_UNLOCKED" || prev.phase === "EXPLORING") ? "EXPLORING" : prev.phase,
      };
    });
  }, []);

  const collectItem = useCallback((itemId: string) => {
    setState(prev => {
      if (prev.itemsCollected.includes(itemId)) return prev;
      const newItems = [...prev.itemsCollected, itemId];
      // Also mark in room state
      const roomId = prev.currentRoomId;
      const newRooms = roomId ? {
        ...prev.rooms,
        [roomId]: {
          ...prev.rooms[roomId],
          itemsFound: [...(prev.rooms[roomId]?.itemsFound ?? []), itemId],
        },
      } : prev.rooms;
      return {
        ...prev,
        itemsCollected: newItems,
        totalItemsFound: newItems.length,
        rooms: newRooms,
      };
    });
  }, []);

  const markElaraDialogSeen = useCallback((roomId: string) => {
    setState(prev => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [roomId]: { ...prev.rooms[roomId], elaraDialogSeen: true },
      },
    }));
  }, []);

  const getRoomDef = useCallback((roomId: string) => {
    return ROOM_DEFINITIONS.find(r => r.id === roomId);
  }, []);

  const getRoomState = useCallback((roomId: string) => {
    return state.rooms[roomId];
  }, [state.rooms]);

  const getUnlockedRooms = useCallback(() => {
    return ROOM_DEFINITIONS.filter(r => state.rooms[r.id]?.unlocked);
  }, [state.rooms]);

  const resetGame = useCallback(() => {
    localStorage.removeItem(GAME_STORAGE_KEY);
    // ── Clear ALL progression / cinematic / audio / game flags ──
    // Cinematics & tutorials
    localStorage.removeItem("loredex_cinematic_seen");
    localStorage.removeItem("collectors_arena_lore_seen");
    localStorage.removeItem("collectors_arena_intro_seen");
    localStorage.removeItem("collectors_arena_story");
    localStorage.removeItem("loredex_completed_tutorials");
    localStorage.removeItem("loredex_cryo_orientation_seen");
    localStorage.removeItem("loredex_auto_tutorial_dismissed");
    localStorage.removeItem("loredex_visited_pages");
    localStorage.removeItem("loredex_fight2d_tutorial_done");
    localStorage.removeItem("loredex_fight_tutorial_done");
    // Discovery & puzzles
    localStorage.removeItem("loredex_discovered");
    localStorage.removeItem("loredex_shown_discoveries");
    localStorage.removeItem("loredex_solved_puzzles");
    localStorage.removeItem("loredex_puzzles_solved");
    localStorage.removeItem("research_entries_unlocked");
    localStorage.removeItem("research_puzzles_solved");
    // Easter eggs & lore fragments
    localStorage.removeItem("loredex_discovered_secrets");
    localStorage.removeItem("loredex_room_easter_eggs");
    localStorage.removeItem("loredex_lore_fragments");
    localStorage.removeItem("loredex_bonus_cards");
    localStorage.removeItem("loredex_easter_eggs");
    // Cards, battles, gamification
    localStorage.removeItem("loredex_battle_stats");
    localStorage.removeItem("loredex_cards_collected");
    localStorage.removeItem("loredex-gamification");
    localStorage.removeItem("loredex_multiverse_record");
    // Player profile & settings
    localStorage.removeItem("loredex-player-profile");
    // Audio & music
    localStorage.removeItem("loredex_saga_bgm");
    localStorage.removeItem("loredex_ambient_music");
    localStorage.removeItem("loredex_sound_volume");
    localStorage.removeItem("loredex_sound_muted");
    localStorage.removeItem("loredex_tts_enabled");
    localStorage.removeItem("loredex-radio-state");
    // Session & watch progress
    localStorage.removeItem("loredex-session-data");
    localStorage.removeItem("loredex-last-visit");
    localStorage.removeItem("loredex-recap-shown");
    localStorage.removeItem("loredex_watch_progress");
    // Favorites & playlists
    localStorage.removeItem("loredex-favorites");
    localStorage.removeItem("loredex-playlists");
    localStorage.removeItem("loredex_seen_transitions");
    localStorage.removeItem("loredex-show-hotspots");
    setState({ ...DEFAULT_GAME_STATE });
  }, []);

  const completeGame = useCallback((gameId: string) => {
    setState(prev => {
      if (prev.completedGames.includes(gameId)) return prev;
      return { ...prev, completedGames: [...prev.completedGames, gameId] };
    });
  }, []);

  const earnLoreAchievement = useCallback((achievementId: string) => {
    setState(prev => {
      if (prev.loreAchievements.includes(achievementId)) return prev;
      // Find the achievement to get XP reward
      const ach = LORE_ACHIEVEMENTS.find(a => a.id === achievementId);
      const xpGain = ach?.xpReward ?? 0;
      return {
        ...prev,
        loreAchievements: [...prev.loreAchievements, achievementId],
        conexusXp: prev.conexusXp + xpGain,
      };
    });
  }, []);

  const isGameCompleted = useCallback((gameId: string): boolean => {
    return state.completedGames.includes(gameId);
  }, [state.completedGames]);

  const collectCard = useCallback((cardId: string) => {
    setState(prev => {
      if (prev.collectedCards.includes(cardId)) return prev;
      return { ...prev, collectedCards: [...prev.collectedCards, cardId] };
    });
  }, []);

  const setActiveDeck = useCallback((cardIds: string[]) => {
    setState(prev => ({ ...prev, activeDeck: cardIds }));
  }, []);

  const setNarrativeFlag = useCallback((flag: string, value: boolean = true) => {
    setState(prev => ({
      ...prev,
      narrativeFlags: { ...prev.narrativeFlags, [flag]: value },
    }));
  }, []);

  /* ─── Section F — Cryo Bay mystery actions ─── */

  const logClue = useCallback((clue: import("@shared/roomMysteries").Clue) => {
    setState(prev => {
      // Idempotent: re-logging the same clue is a no-op.
      if (prev.clueJournal.some(c => c.id === clue.id)) return prev;
      const nextFlags = { ...prev.narrativeFlags };
      // First clue of any kind unlocks the Clue Journal row (§E).
      if (prev.clueJournal.length === 0) {
        nextFlags["sheet_known_clues"] = true;
      }
      return {
        ...prev,
        clueJournal: [...prev.clueJournal, clue],
        narrativeFlags: nextFlags,
      };
    });
  }, []);

  const grantMysteryItem = useCallback(
    (itemId: string) => {
      setState(prev => {
        if (prev.mysteryInventory.includes(itemId)) return prev;
        return {
          ...prev,
          mysteryInventory: [...prev.mysteryInventory, itemId],
        };
      });
    },
    [],
  );

  /* ─── Wave 2 narrative setters ─── */

  const startInternalizingThought = useCallback((thoughtId: string) => {
    setState(prev => {
      if (prev.thoughtInternalizing.some(t => t.thoughtId === thoughtId)) return prev;
      if (prev.thoughtInternalized.includes(thoughtId)) return prev;
      return {
        ...prev,
        thoughtInternalizing: [
          ...prev.thoughtInternalizing,
          { thoughtId, startedAt: Date.now() },
        ],
        thoughtDiscovered: prev.thoughtDiscovered.includes(thoughtId)
          ? prev.thoughtDiscovered
          : [...prev.thoughtDiscovered, thoughtId],
      };
    });
  }, []);

  const completeInternalizingThought = useCallback((thoughtId: string) => {
    setState(prev => ({
      ...prev,
      thoughtInternalizing: prev.thoughtInternalizing.filter(t => t.thoughtId !== thoughtId),
      thoughtInternalized: prev.thoughtInternalized.includes(thoughtId)
        ? prev.thoughtInternalized
        : [...prev.thoughtInternalized, thoughtId],
    }));
  }, []);

  const addArchetypeEmergence = useCallback((archetypeId: string, isPrimary: boolean = false) => {
    setState(prev => {
      if (prev.archetypeEmerged.includes(archetypeId)) {
        if (isPrimary && prev.archetypePrimary !== archetypeId) {
          return { ...prev, archetypePrimary: archetypeId };
        }
        return prev;
      }
      return {
        ...prev,
        archetypeEmerged: [...prev.archetypeEmerged, archetypeId],
        archetypePrimary: isPrimary ? archetypeId : (prev.archetypePrimary ?? archetypeId),
        archetypeEmergenceDates: { ...prev.archetypeEmergenceDates, [archetypeId]: Date.now() },
      };
    });
  }, []);

  const commitIdeology = useCallback((visionId: string) => {
    setState(prev => {
      if (prev.ideologyCommitted) return prev; // Mutually exclusive — no changes
      return { ...prev, ideologyCommitted: visionId };
    });
  }, []);

  const setIdeologyFlag = useCallback((flag: string, value: boolean = true) => {
    setState(prev => ({
      ...prev,
      ideologyFlags: { ...prev.ideologyFlags, [flag]: value },
    }));
  }, []);

  const setInnerVoiceSkill = useCallback((skill: string, level: number) => {
    setState(prev => ({
      ...prev,
      innerVoiceSkills: { ...prev.innerVoiceSkills, [skill]: Math.max(0, Math.min(100, level)) },
    }));
  }, []);

  const setApprentice = useCallback((apprentice: unknown | null) => {
    setState(prev => ({ ...prev, apprentice }));
  }, []);

  const recordFallenApprentice = useCallback((apprentice: unknown) => {
    setState(prev => ({
      ...prev,
      apprenticeFallen: [...prev.apprenticeFallen, apprentice],
      apprentice: null,
    }));
  }, []);

  const setApprenticeRecruitCooldown = useCallback((untilTs: number) => {
    setState(prev => ({ ...prev, apprenticeRecruitCooldownUntil: untilTs }));
  }, []);

  const addAcademyTranscriptEntry = useCallback((entry: { day: number; professorId: string; lessonId: string; grade: string; xpDelta: number }) => {
    setState(prev => ({
      ...prev,
      academyTranscript: [...(prev.academyTranscript ?? []), { ...entry, timestamp: Date.now() }],
    }));
  }, []);

  const adjustProfessorApproval = useCallback((professorId: string, delta: number) => {
    setState(prev => {
      const current = (prev.professorApproval ?? {})[professorId] ?? 50;
      return {
        ...prev,
        professorApproval: { ...(prev.professorApproval ?? {}), [professorId]: Math.max(0, Math.min(100, current + delta)) },
      };
    });
  }, []);

  const addTrialHistoryEntry = useCallback((entry: { day: number; mascoteerId: string; decisionId: string; optionId: string; bondDelta: number; corruptionDelta: number; moralityDelta: number }) => {
    setState(prev => ({
      ...prev,
      trialHistory: [...(prev.trialHistory ?? []), entry],
    }));
  }, []);

  const adjustHousePoints = useCallback((houseId: string, delta: number) => {
    setState(prev => {
      const current = (prev.housePoints ?? {})[houseId] ?? 0;
      return {
        ...prev,
        housePoints: { ...(prev.housePoints ?? {}), [houseId]: current + delta },
      };
    });
  }, []);

  const setMechronisHouse = useCallback((houseId: string) => {
    setState(prev => ({ ...prev, mechronisHouseId: houseId }));
  }, []);

  const addPin = useCallback((pinId: string) => {
    setState(prev => {
      const existing = prev.pinInventory ?? [];
      if (existing.includes(pinId)) return prev;
      return { ...prev, pinInventory: [...existing, pinId] };
    });
  }, []);

  const addCorruption = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      corruptionLevel: Math.max(0, Math.min(100, (prev.corruptionLevel ?? 0) + amount)),
    }));
  }, []);

  const recordDarkAbilityUse = useCallback((abilityId: string) => {
    setState(prev => ({
      ...prev,
      darkAbilitiesUsed: prev.darkAbilitiesUsed.includes(abilityId)
        ? prev.darkAbilitiesUsed
        : [...prev.darkAbilitiesUsed, abilityId],
    }));
  }, []);

  const completePurgeRitual = useCallback((ritualId: string, reduction: number) => {
    setState(prev => ({
      ...prev,
      corruptionLevel: Math.max(0, (prev.corruptionLevel ?? 0) - reduction),
      purgeRitualsCompleted: [...prev.purgeRitualsCompleted, ritualId],
    }));
  }, []);

  const completeSorting = useCallback((archonNumber: number) => {
    setState(prev => ({
      ...prev,
      sortingComplete: true,
      sortedIntoArchon: archonNumber,
    }));
  }, []);

  const markTransmissionWatched = useCallback((id: string, triggersOracleReveal: boolean) => {
    setState(prev => {
      if (prev.transmissionsWatched.includes(id)) {
        // Already watched — no-op. Rewards + reveal tier are one-shot
        // per transmission; replays are cosmetic only.
        return prev;
      }
      // Parse `ep{epoch}-{episode}` → set both `_watched` and `_viewed`
      // narrative flags so chain-unlocked episodes (Epoch 0 + Epoch 2)
      // can progress. Covers both naming conventions used in
      // apps/shared/transmissions.ts.
      //
      // SIB (Spaces In Between) ids use the `sib-ep{n}` prefix and
      // set their hand-written sib_*_viewed flags via SIB_WATCHED_FLAGS
      // so NPC dialog unlocks and the detective chain can progress
      // whether the player found the episode via the inbox or via
      // the Epoch 0 detective chain.
      const match = id.match(/^ep(\d+)-(\d+)$/);
      const nextFlags = { ...prev.narrativeFlags };
      if (match) {
        const [, epoch, episode] = match;
        nextFlags[`epoch${epoch}_ep${episode}_watched`] = true;
        nextFlags[`epoch${epoch}_ep${episode}_viewed`] = true;
      } else if (SIB_WATCHED_FLAGS[id]) {
        nextFlags[SIB_WATCHED_FLAGS[id]] = true;
      }
      // Increment oracle reveal tier on every reveal-triggering
      // episode. Clamped to 3 since there are currently 3 reveal
      // episodes total (episodes 11, 14, 19 in transmissions.ts).
      const nextTier = triggersOracleReveal
        ? Math.min(3, (prev.oracleRevealTier ?? 0) + 1)
        : prev.oracleRevealTier ?? 0;
      return {
        ...prev,
        transmissionsWatched: [...prev.transmissionsWatched, id],
        transmissionsNotified: prev.transmissionsNotified.includes(id)
          ? prev.transmissionsNotified
          : [...prev.transmissionsNotified, id],
        oracleRevealActive: prev.oracleRevealActive || triggersOracleReveal,
        oracleRevealTier: nextTier,
        narrativeFlags: nextFlags,
      };
    });
  }, []);

  const markTransmissionNotified = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      transmissionsNotified: prev.transmissionsNotified.includes(id)
        ? prev.transmissionsNotified
        : [...prev.transmissionsNotified, id],
    }));
  }, []);

  const addLoredexDiscovered = useCallback((entityIds: string[]) => {
    if (entityIds.length === 0) return;
    setState(prev => {
      const existing = new Set(prev.loredexDiscovered ?? []);
      const added = entityIds.filter(id => !existing.has(id));
      if (added.length === 0) return prev;
      return {
        ...prev,
        loredexDiscovered: [...(prev.loredexDiscovered ?? []), ...added],
      };
    });
  }, []);

  const setTransmissionPlaybackPosition = useCallback(
    (id: string, positionSeconds: number) => {
      setState(prev => {
        const existing = prev.transmissionPlaybackPositions ?? {};
        // Snap to integer seconds to avoid thrashing the state on
        // every `timeupdate` tick — the <video> element fires
        // 4+ times/sec. Also ignore no-op writes so unchanged
        // positions don't trigger re-renders.
        const snapped = Math.max(0, Math.floor(positionSeconds));
        if (existing[id] === snapped) return prev;
        return {
          ...prev,
          transmissionPlaybackPositions: { ...existing, [id]: snapped },
        };
      });
    },
    [],
  );

  const clearTransmissionPlaybackPosition = useCallback((id: string) => {
    setState(prev => {
      const existing = prev.transmissionPlaybackPositions ?? {};
      if (!(id in existing)) return prev;
      const next = { ...existing };
      delete next[id];
      return { ...prev, transmissionPlaybackPositions: next };
    });
  }, []);

  const addGraduate = useCallback((apprentice: any) => {
    setState(prev => ({
      ...prev,
      legionGraduates: { ...prev.legionGraduates, [apprentice.id]: apprentice },
      legionRoster: prev.legionRoster && typeof prev.legionRoster === "object"
        ? { ...(prev.legionRoster as any), unassigned: [...((prev.legionRoster as any).unassigned ?? []), apprentice.id] }
        : { assignments: [], unassigned: [apprentice.id], sacrificedHistory: [] },
    }));
  }, []);

  const setLegionRoster = useCallback((roster: unknown) => {
    setState(prev => ({ ...prev, legionRoster: roster }));
  }, []);

  const addLegionLetter = useCallback((letter: { id: string; fromApprenticeId: string; body: string }) => {
    setState(prev => ({
      ...prev,
      legionLetters: [
        ...prev.legionLetters,
        { ...letter, timestamp: Date.now(), read: false },
      ].slice(-50),  // cap to 50 most recent
    }));
  }, []);

  const markLettersRead = useCallback(() => {
    setState(prev => ({
      ...prev,
      legionLetters: prev.legionLetters.map(l => ({ ...l, read: true })),
    }));
  }, []);

  const updatePetBond = useCallback((petId: string, partial: Partial<GameState["petBonds"][string]>) => {
    setState(prev => {
      const existing = prev.petBonds[petId] ?? {
        bond: 0, sharedMissions: 0, isActive: false, injury: 0,
        moralityDissonance: 0, completedQuests: [], evolutionStage: 1 as const, deathCount: 0,
      };
      return {
        ...prev,
        petBonds: { ...prev.petBonds, [petId]: { ...existing, ...partial } },
      };
    });
  }, []);

  const claimQuestReward = useCallback((questId: string) => {
    setState(prev => {
      if (prev.claimedQuestRewards.includes(questId)) return prev;
      return {
        ...prev,
        claimedQuestRewards: [...prev.claimedQuestRewards, questId],
        narrativeFlags: { ...prev.narrativeFlags, [`quest_${questId}_claimed`]: true },
      };
    });
  }, []);

  /* ─── MORALITY METER ─── */
  const trpcUtils = trpc.useUtils();
  const applyMoralityMutation = trpc.rpg.applyMoralityChoice.useMutation({
    onSuccess: () => {
      // Invalidate queries that read morality so downstream UI (leaderboards,
      // morality state panels) reflects the new score without a page refresh.
      trpcUtils.moralityLeaderboard.getMyRank.invalidate();
      trpcUtils.moralityLeaderboard.getDistribution.invalidate();
      trpcUtils.rpg.getMoralityState.invalidate();
    },
  });

  const shiftMorality = useCallback((amount: number, tutorialId?: string, choiceId?: string, sourceContext?: "dialog" | "quest" | "event" | "governance" | "companion" | "diplomacy" | "celebration_trial") => {
    setState(prev => {
      const newScore = Math.max(-100, Math.min(100, prev.moralityScore + amount));
      const newChoices = tutorialId && choiceId
        ? [...prev.moralityChoices, { tutorialId, choiceId, shift: amount }]
        : prev.moralityChoices;
      return { ...prev, moralityScore: newScore, moralityChoices: newChoices };
    });
    // Sync morality change to server (writes to characterSheets + pressure events)
    if (amount !== 0) {
      applyMoralityMutation.mutate({
        choiceId: choiceId || tutorialId || `morality_shift_${Date.now()}`,
        moralityDelta: amount,
        sourceContext: sourceContext || "dialog",
      });
    }
  }, [applyMoralityMutation]);

  const getMoralityLabel = useCallback(() => {
    const s = state.moralityScore;
    if (s <= -80) return "Machine Ascendant";
    if (s <= -60) return "Machine Devoted";
    if (s <= -40) return "Machine Aligned";
    if (s <= -20) return "Machine Leaning";
    if (s < 20) return "Balanced";
    if (s < 40) return "Humanity Leaning";
    if (s < 60) return "Humanity Aligned";
    if (s < 80) return "Humanity Devoted";
    return "Humanity Ascendant";
  }, [state.moralityScore]);

  const getMoralityTier = useCallback(() => {
    const abs = Math.abs(state.moralityScore);
    const side = state.moralityScore <= 0 ? "machine" : "humanity";
    if (abs >= 80) return { tier: side, level: 5 };
    if (abs >= 60) return { tier: side, level: 4 };
    if (abs >= 40) return { tier: side, level: 3 };
    if (abs >= 20) return { tier: side, level: 2 };
    return { tier: "balanced", level: 1 };
  }, [state.moralityScore]);

  const unlockMoralityReward = useCallback((rewardId: string) => {
    setState(prev => {
      if (prev.moralityUnlocks.includes(rewardId)) return prev;
      return { ...prev, moralityUnlocks: [...prev.moralityUnlocks, rewardId] };
    });
  }, []);

  /* ─── SECRET TRANSMISSIONS ─── */
  const discoverTransmission = useCallback((transmissionId: string) => {
    setState(prev => {
      if (prev.discoveredTransmissions.includes(transmissionId)) return prev;
      return { ...prev, discoveredTransmissions: [...prev.discoveredTransmissions, transmissionId] };
    });
  }, []);

  const isTransmissionDiscovered = useCallback((transmissionId: string) => {
    return state.discoveredTransmissions.includes(transmissionId);
  }, [state.discoveredTransmissions]);

  /* ─── TUTORIALS ─── */
  const completeTutorial = useCallback((tutorialId: string) => {
    setState(prev => {
      if (prev.completedTutorials.includes(tutorialId)) return prev;
      return { ...prev, completedTutorials: [...prev.completedTutorials, tutorialId] };
    });
  }, []);

  const isTutorialCompleted = useCallback((tutorialId: string) => {
    return state.completedTutorials.includes(tutorialId);
  }, [state.completedTutorials]);

  const skipToExploring = useCallback(() => {
    // Dev/debug: skip awakening and unlock first few rooms
    const rooms: Record<string, RoomState> = {};
    ROOM_DEFINITIONS.forEach(r => {
      rooms[r.id] = {
        id: r.id,
        unlocked: true,
        visited: false,
        visitCount: 0,
        itemsFound: [],
        elaraDialogSeen: false,
      };
    });
    setState({
      ...DEFAULT_GAME_STATE,
      phase: "FULL_ACCESS",
      awakeningStep: "COMPLETE",
      characterCreated: true,
      currentRoomId: "cryo-bay",
      rooms,
      totalRoomsUnlocked: ROOM_DEFINITIONS.length,
    });
  }, []);

  // ═══ NARRATIVE v2 CALLBACKS ═══
  const advanceNarrativeAct = useCallback((actId: number) => {
    setState(prev => {
      // Act 2 entry writes the trigger flag + opens Year-One month 6.
      // Witnessing Hub detection reads `act_2_started` (witnessingHub.ts:173),
      // and the bench/classroom/GM panels read `year_one_month_6_opened`.
      const nextFlags = { ...prev.narrativeFlags };
      if (actId >= 2 && !nextFlags.act_2_started) {
        nextFlags.act_2_started = true;
      }
      if (actId >= 2 && !nextFlags.year_one_month_6_opened) {
        nextFlags.year_one_month_6_opened = true;
      }
      return { ...prev, narrativeAct: actId, narrativeFlags: nextFlags };
    });
  }, []);

  // ─── Prelude playhead setters ───
  // Called by PreludeSequencePlayer as the player advances through the
  // 15 beats. Persisted via the normal localStorage sync, so returning
  // players resume at their last beat.
  const setCurrentPreludeBeat = useCallback((beatId: string | null) => {
    setState(prev => ({ ...prev, currentPreludeBeat: beatId }));
  }, []);

  const recordPreludeCompletionFlag = useCallback((flag: string) => {
    setState(prev => {
      if (prev.preludeCompletedFlags.includes(flag)) return prev;
      return {
        ...prev,
        preludeCompletedFlags: [...prev.preludeCompletedFlags, flag],
      };
    });
  }, []);

  const setLightDarkAlignment = useCallback(
    (alignment: "light" | "dark" | null) => {
      setState(prev => ({ ...prev, lightDarkAlignment: alignment }));
    },
    [],
  );

  const setAct1PublicWitnessBalance = useCallback(
    (balance: number | null) => {
      setState(prev => ({ ...prev, act1PublicWitnessBalance: balance }));
    },
    [],
  );

  const recordNarrativeChoice = useCallback((actId: number, sceneId: string, choiceId: string, moralityShift: number) => {
    setState(prev => ({
      ...prev,
      narrativeActChoices: [...prev.narrativeActChoices, { actId, sceneId, choiceId, moralityShift }],
      moralityScore: Math.max(-100, Math.min(100, prev.moralityScore + moralityShift)),
    }));
  }, []);

  const setHumanContact = useCallback((made: boolean) => {
    setState(prev => ({ ...prev, humanContactMade: made }));
  }, []);

  const setHumanContactSecret = useCallback((secret: boolean) => {
    setState(prev => ({ ...prev, humanContactSecret: secret }));
  }, []);

  const setElaraKnowsAboutHumanFn = useCallback((knows: boolean, path: "told" | "discovered" | "betrayed") => {
    setState(prev => ({ ...prev, elaraKnowsAboutHuman: knows, elaraDiscoveryPath: path }));
  }, []);

  const adjustHumanTrust = useCallback((delta: number) => {
    setState(prev => ({ ...prev, humanTrustLevel: Math.max(0, Math.min(100, prev.humanTrustLevel + delta)) }));
  }, []);

  const adjustElaraTrust = useCallback((delta: number) => {
    setState(prev => ({ ...prev, elaraTrustLevel: Math.max(0, Math.min(100, prev.elaraTrustLevel + delta)) }));
  }, []);

  const adjustNarratorBond = useCallback((delta: number) => {
    setState(prev => ({ ...prev, narratorBond: adjustNarratorBondValue(prev.narratorBond, delta) }));
  }, []);

  const getNarratorBond = useCallback(
    () =>
      // Fallback sources are the per-narrator bond fields (elaraTrustLevel /
      // humanTrustLevel), NOT the legacy per-NPC trust numbers. §14.1
      // milestones fire on the Act 1+ bond track.
      deriveNarratorBond({
        narratorBond: state.narratorBond,
        fallbackElara: state.elaraTrustLevel,
        fallbackHuman: state.humanTrustLevel,
      }),
    [state.narratorBond, state.elaraTrustLevel, state.humanTrustLevel],
  );

  const getMemoryEnergyCap = useCallback(
    () => computeMemoryEnergyCap(state.narrativeFlags),
    [state.narrativeFlags],
  );

  const adjustMemoryEnergy = useCallback((delta: number) => {
    setState(prev => ({
      ...prev,
      memoryEnergy: adjustMemoryEnergyValue(
        prev.memoryEnergy,
        delta,
        computeMemoryEnergyCap(prev.narrativeFlags),
      ),
    }));
  }, []);

  const earnMemoryEnergy = useCallback(
    (source: MemoryEnergyEarnSource, overrideDelta?: number) => {
      let applied = 0;
      setState(prev => {
        const { next, delta } = earnMemoryEnergyValue(
          source,
          prev.memoryEnergy,
          computeMemoryEnergyCap(prev.narrativeFlags),
          overrideDelta,
        );
        applied = delta;
        if (next === prev.memoryEnergy) return prev;
        return { ...prev, memoryEnergy: next };
      });
      return applied;
    },
    [],
  );

  const recordChessWin = useCallback(() => {
    // Write-through to localStorage for backwards-compat: the legacy
    // useNarrativeIntegration gate at L961 watches the `chess_wins`
    // localStorage key until we can remove it. chess_mastered fires
    // at 5 wins per the act_2_complete gate.
    try {
      const prior = parseInt(localStorage.getItem("chess_wins") || "0") || 0;
      localStorage.setItem("chess_wins", String(prior + 1));
    } catch {
      /* ignore storage errors */
    }
    setState(prev => {
      const next = Math.min(10, (prev.chessDepth ?? 0) + 1);
      if (next === prev.chessDepth) return prev;
      return { ...prev, chessDepth: next };
    });
  }, []);

  const advanceYearOneMonth = useCallback(() => {
    // Advance the canonical field AND raise the matching
    // `year_one_month_N_opened` flag so pre-field readers (Hub
    // flag-scan shim) stay in sync on the same tick.
    setState(prev => {
      const nextMonth = advanceYearOneMonthValue(
        deriveYearOneMonth({
          yearOneMonth: prev.yearOneMonth,
          flags: prev.narrativeFlags,
        }),
      );
      const flag = yearOneMonthFlag(nextMonth);
      if (prev.yearOneMonth === nextMonth && prev.narrativeFlags?.[flag]) {
        return prev;
      }
      return {
        ...prev,
        yearOneMonth: nextMonth,
        narrativeFlags: { ...prev.narrativeFlags, [flag]: true },
      };
    });
  }, []);

  const getYearOneMonth = useCallback(
    () =>
      deriveYearOneMonth({
        yearOneMonth: state.yearOneMonth,
        flags: state.narrativeFlags,
      }),
    [state.yearOneMonth, state.narrativeFlags],
  );

  const completeRecruitmentMission = useCallback((missionId: string) => {
    setState(prev => {
      const current = prev.armyRecruitmentMissionsCompleted;
      // Idempotent: no setState when the id is already present. This
      // avoids churning subscribers on strict-mode double-fires and
      // on save/load cycles.
      if (!missionId || current.includes(missionId)) return prev;
      return {
        ...prev,
        armyRecruitmentMissionsCompleted: addCompletedRecruitmentMission(
          current,
          missionId,
        ),
      };
    });
  }, []);

  // ═══ NPC RELATIONSHIP CALLBACKS ═══
  const adjustNpcTrust = useCallback((npcId: string, delta: number) => {
    setState(prev => {
      const nextTrust = Math.max(0, Math.min(100, (prev.npcTrust[npcId] || 0) + delta));
      // Pet quest hook: fire trust_reached when a threshold is crossed.
      // We fire on every change — the rules in petQuestHooks.ts use
      // `trust >= N` predicates so duplicates are harmless (setQuestFlag
      // is idempotent on the server).
      try {
        window.dispatchEvent(new CustomEvent("pet-quest-event", {
          detail: { type: "trust_reached", npcId, trust: nextTrust },
        }));
      } catch { /* best-effort; SSR or test env */ }
      return { ...prev, npcTrust: { ...prev.npcTrust, [npcId]: nextTrust } };
    });
  }, []);

  const discoverNpc = useCallback((npcId: string) => {
    setState(prev => ({
      ...prev,
      npcDiscovered: { ...prev.npcDiscovered, [npcId]: true },
    }));
  }, []);

  const setNpcCallback = useCallback((npcId: string, callbackId: string) => {
    setState(prev => ({
      ...prev,
      npcCallbacks: {
        ...prev.npcCallbacks,
        [npcId]: { ...(prev.npcCallbacks[npcId] || {}), [callbackId]: true },
      },
    }));
  }, []);

  const setElaraCallback = useCallback((flag: string, value: boolean = true) => {
    setState(prev => ({
      ...prev,
      elaraCallbacks: { ...prev.elaraCallbacks, [flag]: value },
    }));
  }, []);

  const setHumanCallback = useCallback((flag: string, value: boolean = true) => {
    setState(prev => ({
      ...prev,
      humanCallbacks: { ...prev.humanCallbacks, [flag]: value },
    }));
  }, []);

  const revealNpcSecret = useCallback((npcId: string, revelationId: string) => {
    setState(prev => {
      const existing = prev.npcRevealed[npcId] || [];
      if (existing.includes(revelationId)) return prev;
      return {
        ...prev,
        npcRevealed: { ...prev.npcRevealed, [npcId]: [...existing, revelationId] },
        npcSecretsShared: { ...prev.npcSecretsShared, [npcId]: (prev.npcSecretsShared[npcId] || 0) + 1 },
      };
    });
  }, []);

  const incrementNpcConversation = useCallback((npcId: string) => {
    setState(prev => ({
      ...prev,
      npcConversationCount: { ...prev.npcConversationCount, [npcId]: (prev.npcConversationCount[npcId] || 0) + 1 },
    }));
  }, []);

  // ═══ PRESTIGE SYSTEM ═══
  const performPrestige = useCallback(() => {
    setState(prev => {
      if (prev.narrativeAct < 1) return prev; // Must have progressed

      // Measure what the player earned this cycle, stack it onto the
      // existing baseline, then apply the §15 P3 carryover multipliers
      // from PRESTIGE_CARRYOVER_RULES (loredex 100%, bond 50%, cards
      // 25%, narrator dominance 0%, milestones 100%, moments 10%).
      // External stats (narrator dominance energy + memorable moments)
      // default to 0 here — the respective zustand stores own those
      // reads and a follow-up PR can thread them through if needed.
      const thisCycle = measurePrestigeCycleStats({
        loredexDiscovered: prev.loredexDiscovered,
        collectedCards: prev.collectedCards,
        narrativeFlags: prev.narrativeFlags,
      });
      const stacked = addPrestigeCycleStats(
        prev.prestigeBaseline ?? EMPTY_PRESTIGE_CYCLE_STATS,
        thisCycle,
      );
      const nextBaseline = applyPrestigeCarryover(stacked);

      return {
        ...prev,
        // Reset progression
        narrativeAct: 0,
        narrativeActChoices: [],
        // Reset Prelude playhead — a new game starts before Beat A
        currentPreludeBeat: null,
        preludeCompletedFlags: [],
        lightDarkAlignment: null,
        act1PublicWitnessBalance: null,
        // Keep: NPC trust, cards, equipment, achievements, completedGames
        // Reset: rooms (re-explore), quests, crafting materials
        rooms: Object.fromEntries(
          Object.entries(prev.rooms).map(([id, room]) => [id, { ...room, unlocked: id === "cryo-bay", visited: id === "cryo-bay", visitCount: id === "cryo-bay" ? 1 : 0, elaraDialogSeen: false }])
        ),
        claimedQuestRewards: [],
        craftingMaterials: {},
        craftedItems: [],
        craftingLog: [],
        currentRoomId: "cryo-bay",
        // Typed prestige fields — replace the old untyped read path.
        prestigeLevel: prev.prestigeLevel + 1,
        prestigeBaseline: nextBaseline,
      };
    });
  }, []);

  const getPrestigeLevel = useCallback(
    () => state.prestigeLevel ?? 0,
    [state.prestigeLevel],
  );

  const getPrestigeBaseline = useCallback(
    () => state.prestigeBaseline ?? EMPTY_PRESTIGE_CYCLE_STATS,
    [state.prestigeBaseline],
  );

  // ═══ ARMY MANAGEMENT CALLBACKS ═══
  const recruitUnit = useCallback((unit: ArmyUnit) => {
    setState(prev => ({ ...prev, armyUnits: [...prev.armyUnits, unit] }));
  }, []);

  const deployUnits = useCallback((deployment: ArmyDeployment) => {
    setState(prev => {
      const updatedUnits = prev.armyUnits.map(u =>
        deployment.unitIds.includes(u.id) ? { ...u, deployed: true } : u
      );
      return {
        ...prev,
        armyUnits: updatedUnits,
        armyDeployments: [...prev.armyDeployments, deployment],
        armyTotalMissionsDeployed: prev.armyTotalMissionsDeployed + 1,
      };
    });
  }, []);

  const completeDeploymentFn = useCallback((deploymentId: string, success: boolean, report: string, reportSpeaker: "elara" | "human" | "system", rewards?: { type: string; amount: number }[]) => {
    setState(prev => {
      const deployment = prev.armyDeployments.find(d => d.id === deploymentId);
      if (!deployment) return prev;
      const completed: CompletedDeployment = {
        id: deploymentId,
        missionId: deployment.missionId,
        missionName: deployment.missionName,
        success,
        unitIds: deployment.unitIds,
        completedAt: Date.now(),
        rewards: success ? rewards : undefined,
        report,
        reportSpeaker,
      };
      // Free up units and give XP on success
      const updatedUnits = prev.armyUnits.map(u => {
        if (!deployment.unitIds.includes(u.id)) return u;
        const xpGain = success ? 25 : 5;
        const newXp = u.xp + xpGain;
        const levelUp = newXp >= u.level * 100;
        return {
          ...u,
          deployed: false,
          xp: levelUp ? newXp - u.level * 100 : newXp,
          level: levelUp ? Math.min(10, u.level + 1) : u.level,
          rank: levelUp && u.level >= 3 ? (u.level >= 7 ? "commander" as const : u.level >= 5 ? "elite" as const : "veteran" as const) : u.rank,
          successRate: Math.min(95, u.successRate + (success ? 2 : 0)),
        };
      });
      return {
        ...prev,
        armyUnits: updatedUnits,
        armyDeployments: prev.armyDeployments.filter(d => d.id !== deploymentId),
        armyCompletedDeployments: [...prev.armyCompletedDeployments, completed],
        armyTotalMissionsSucceeded: prev.armyTotalMissionsSucceeded + (success ? 1 : 0),
        armyTotalMissionsFailed: prev.armyTotalMissionsFailed + (success ? 0 : 1),
      };
    });
    // Witnessing §3.6 — a successful crew mission feeds the Light
    // meter (+15). We use the compassionate row as the default; the
    // mercenary variant is reserved for deployments explicitly flagged
    // as such (not yet threaded through the deployment schema).
    if (success) {
      applyDischordiaEnergy("crew_mission_compassionate");
      // Witnessing §11.2 — feed slot: "A crew mission you completed".
      // Captured for the Antiquarian's Lion in Black feed.
      recordMemorableMoment(
        "crew_mission_completed",
        "A crew mission your units brought home alive.",
      );
    }
  }, []);

  const updateSectorControl = useCallback((sectorId: string, updates: Partial<SectorControl>) => {
    setState(prev => ({
      ...prev,
      armySectors: {
        ...prev.armySectors,
        [sectorId]: { ...prev.armySectors[sectorId], ...updates } as SectorControl,
      },
    }));
  }, []);

  const getAvailableUnits = useCallback(() => {
    return state.armyUnits.filter(u => !u.deployed);
  }, [state.armyUnits]);

  const getActiveDeployments = useCallback(() => {
    return state.armyDeployments;
  }, [state.armyDeployments]);

  const checkDeploymentCompletion = useCallback((): CompletedDeployment[] => {
    const now = Date.now();
    const completed: CompletedDeployment[] = [];
    state.armyDeployments.forEach(d => {
      if (now >= d.startedAt + d.durationMs) {
        // Calculate success based on successChance
        const roll = Math.random() * 100;
        const success = roll <= d.successChance;
        completed.push({
          id: d.id,
          missionId: d.missionId,
          missionName: d.missionName,
          success,
          unitIds: d.unitIds,
          completedAt: now,
          rewards: success ? d.rewards : undefined,
          report: success
            ? `Mission ${d.missionName} completed successfully. All units returning to base.`
            : `Mission ${d.missionName} encountered heavy resistance. Units retreating with partial intel.`,
          reportSpeaker: "system",
        });
      }
    });
    return completed;
  }, [state.armyDeployments]);

  // ═══ CRAFTING SYSTEM CALLBACKS ═══
  const craftItem = useCallback((
    recipeId: string,
    materialsUsed: Record<string, number>,
    dreamCost: number,
    skillId: string,
    xpGain: number,
    outputItemId: string,
    outputQuantity: number,
    memoryEnergyCost?: number,
  ) => {
    setState(prev => {
      const newMaterials = { ...prev.craftingMaterials };
      for (const [matId, qty] of Object.entries(materialsUsed)) {
        newMaterials[matId] = Math.max(0, (newMaterials[matId] || 0) - qty);
      }
      const newXp = { ...prev.craftingXp };
      newXp[skillId] = (newXp[skillId] || 0) + xpGain;
      const newSkills = { ...prev.craftingSkills };
      const totalXp = newXp[skillId];
      const newLevel = Math.min(10, Math.floor(totalXp / 100));
      if (newLevel > (newSkills[skillId] || 0)) {
        newSkills[skillId] = newLevel;
      }
      // Act 2 — deduct Memory Energy when the caller supplies a cost.
      // Pre-Act-2 Forge crafts omit the parameter and remain free. The
      // bench UI computes cost via getMemoryEnergyCostForRarity() and
      // passes it in; the button-gate in ForgeRecipePanel already blocks
      // un-affordable crafts, so this is the payment leg.
      const nextMemoryEnergy =
        typeof memoryEnergyCost === "number" && memoryEnergyCost > 0
          ? adjustMemoryEnergyValue(
              prev.memoryEnergy,
              -memoryEnergyCost,
              computeMemoryEnergyCap(prev.narrativeFlags),
            )
          : prev.memoryEnergy;
      return {
        ...prev,
        craftingMaterials: newMaterials,
        craftingXp: newXp,
        craftingSkills: newSkills,
        craftedItems: [...prev.craftedItems, outputItemId],
        craftingLog: [...prev.craftingLog, { recipeId, success: true, timestamp: Date.now() }],
        memoryEnergy: nextMemoryEnergy,
      };
    });
  }, []);

  const craftFailed = useCallback((recipeId: string, materialsUsed: Record<string, number>, dreamCost: number, skillId: string, xpGain: number) => {
    setState(prev => {
      const newMaterials = { ...prev.craftingMaterials };
      for (const [matId, qty] of Object.entries(materialsUsed)) {
        newMaterials[matId] = Math.max(0, (newMaterials[matId] || 0) - qty);
      }
      const newXp = { ...prev.craftingXp };
      newXp[skillId] = (newXp[skillId] || 0) + xpGain;
      return {
        ...prev,
        craftingMaterials: newMaterials,
        craftingXp: newXp,
        craftingLog: [...prev.craftingLog, { recipeId, success: false, timestamp: Date.now() }],
      };
    });
  }, []);

  const addMaterial = useCallback((materialId: string, quantity: number) => {
    setState(prev => ({
      ...prev,
      craftingMaterials: {
        ...prev.craftingMaterials,
        [materialId]: (prev.craftingMaterials[materialId] || 0) + quantity,
      },
    }));
  }, []);

  // ═══ COMPANION SYSTEM CALLBACKS ═══
  const gainCompanionXp = useCallback((companionId: string, amount: number) => {
    setState(prev => {
      const current = prev.companionRelationships[companionId] || 0;
      const newLevel = Math.min(100, Math.max(0, current + amount));
      return {
        ...prev,
        companionRelationships: { ...prev.companionRelationships, [companionId]: newLevel },
      };
    });
  }, []);

  const activateCompanionQuest = useCallback((questId: string) => {
    setState(prev => ({
      ...prev,
      companionQuestsActive: prev.companionQuestsActive.includes(questId)
        ? prev.companionQuestsActive
        : [...prev.companionQuestsActive, questId],
    }));
  }, []);

  const completeCompanionQuest = useCallback((questId: string) => {
    setState(prev => ({
      ...prev,
      companionQuestsCompleted: prev.companionQuestsCompleted.includes(questId)
        ? prev.companionQuestsCompleted
        : [...prev.companionQuestsCompleted, questId],
      companionQuestsActive: prev.companionQuestsActive.filter(id => id !== questId),
    }));
  }, []);

  const unlockBackstory = useCallback((stageId: string) => {
    setState(prev => ({
      ...prev,
      companionBackstoryUnlocked: prev.companionBackstoryUnlocked.includes(stageId)
        ? prev.companionBackstoryUnlocked
        : [...prev.companionBackstoryUnlocked, stageId],
    }));
  }, []);

  const setRomance = useCallback((companionId: string | null) => {
    setState(prev => ({ ...prev, companionRomanceActive: companionId }));
  }, []);

  const addCompanionDialogChoice = useCallback((companionId: string, choiceId: string) => {
    setState(prev => {
      const history = prev.companionDialogHistory[companionId] || [];
      return {
        ...prev,
        companionDialogHistory: {
          ...prev.companionDialogHistory,
          [companionId]: [...history, choiceId],
        },
      };
    });
  }, []);

  const getCompanionLevel = useCallback((companionId: string): number => {
    return state.companionRelationships[companionId] || 0;
  }, [state.companionRelationships]);

  // ═══ INCEPTION ARK FLEET CALLBACKS ═══
  const assignArk = useCallback((arkId: string) => {
    setState(prev => ({
      ...prev,
      assignedArkId: arkId,
      discoveredArks: prev.discoveredArks.includes(arkId)
        ? prev.discoveredArks
        : [...prev.discoveredArks, arkId],
    }));
  }, []);

  const discoverArk = useCallback((arkId: string) => {
    setState(prev => ({
      ...prev,
      discoveredArks: prev.discoveredArks.includes(arkId)
        ? prev.discoveredArks
        : [...prev.discoveredArks, arkId],
    }));
  }, []);

  // ═══ DIPLOMACY CALLBACKS ═══
  const completeDiplomacyEvent = useCallback((eventId: string, choiceId: string, moralityDelta: number, reputationDeltas: Record<string, number>) => {
    setState(prev => {
      const newReputation = { ...prev.factionReputation };
      for (const [faction, delta] of Object.entries(reputationDeltas)) {
        newReputation[faction] = (newReputation[faction] || 0) + delta;
      }
      const newMorality = Math.max(-100, Math.min(100, prev.moralityScore + moralityDelta));
      return {
        ...prev,
        completedDiplomacyEvents: [...prev.completedDiplomacyEvents, eventId],
        diplomacyChoices: [...prev.diplomacyChoices, { eventId, choiceId, moralityDelta }],
        factionReputation: newReputation,
        moralityScore: newMorality,
      };
    });
    // Sync diplomacy morality choice to server
    if (moralityDelta !== 0) {
      applyMoralityMutation.mutate({
        choiceId: `diplomacy_${eventId}_${choiceId}`,
        moralityDelta,
        sourceContext: "diplomacy",
      });
    }
  }, [applyMoralityMutation]);

  // ── Faction War callbacks ──
  const startFactionWar = useCallback((warId: string, faction: "empire" | "insurgency") => {
    setState(prev => ({
      ...prev,
      factionWarState: {
        ...prev.factionWarState,
        activeWar: warId,
        warProgress: 0,
        empireContribution: 0,
        insurgencyContribution: 0,
        playerContribution: 0,
        playerFaction: faction,
      },
    }));
  }, []);

  const contributeFactionWar = useCallback((amount: number) => {
    setState(prev => {
      const fw = prev.factionWarState;
      if (!fw.activeWar || !fw.playerFaction) return prev;
      const isEmpire = fw.playerFaction === "empire";
      // AI opponent contributes a random amount
      const aiContribution = Math.floor(amount * (0.6 + Math.random() * 0.8));
      return {
        ...prev,
        factionWarState: {
          ...fw,
          empireContribution: fw.empireContribution + (isEmpire ? amount : aiContribution),
          insurgencyContribution: fw.insurgencyContribution + (isEmpire ? aiContribution : amount),
          playerContribution: fw.playerContribution + amount,
        },
      };
    });
  }, []);

  const advanceFactionWar = useCallback((): { ended: boolean; winner?: string } => {
    const result = { ended: false, winner: undefined as string | undefined };
    setState(prev => {
      const fw = prev.factionWarState;
      if (!fw.activeWar) return prev;
      const newProgress = fw.warProgress + 1;
      // Check if war is over by looking up duration from data
      // We use a simple check: if progress >= duration (stored in events)
      const updated = {
        ...prev,
        factionWarState: {
          ...fw,
          warProgress: newProgress,
          // Decrement exclusive route warps
          activeExclusiveRoutes: fw.activeExclusiveRoutes
            .map(r => ({ ...r, warpsRemaining: r.warpsRemaining - 1 }))
            .filter(r => r.warpsRemaining > 0),
        },
      };
      return updated;
    });
    return result;
  }, []);

  const endFactionWar = useCallback((): { winner: string; playerContribution: number } => {
    let outcome = { winner: "stalemate", playerContribution: 0 };
    setState(prev => {
      const fw = prev.factionWarState;
      if (!fw.activeWar) return prev;
      const total = fw.empireContribution + fw.insurgencyContribution;
      let winner = "stalemate";
      if (total > 0) {
        const empireRatio = fw.empireContribution / total;
        if (empireRatio > 0.55) winner = "empire";
        else if (empireRatio < 0.45) winner = "insurgency";
      }
      outcome = { winner, playerContribution: fw.playerContribution };
      return {
        ...prev,
        factionWarState: {
          ...fw,
          activeWar: null,
          warProgress: 0,
          completedWars: [...fw.completedWars, fw.activeWar],
          warHistory: [...fw.warHistory, { warId: fw.activeWar, winner, playerContribution: fw.playerContribution }],
          playerFaction: null,
        },
      };
    });
    return outcome;
  }, []);

  const giveCompanionGift = useCallback((giftId: string, companionId: string, xpGain: number) => {
    setState(prev => ({
      ...prev,
      giftsGiven: [...prev.giftsGiven, { giftId, companionId, timestamp: Date.now() }],
    }));
    // Also gain companion XP
    gainCompanionXp(companionId, xpGain);
  }, [gainCompanionXp]);

  // ── Loyalty Mission callbacks ──
  const startLoyaltyMission = useCallback((missionId: string) => {
    setState(prev => ({
      ...prev,
      activeLoyaltyMission: missionId,
      loyaltyMissionStep: 0,
    }));
  }, []);

  const advanceLoyaltyMission = useCallback((choiceId?: string, moralityShift?: number) => {
    setState(prev => {
      const newState = {
        ...prev,
        loyaltyMissionStep: prev.loyaltyMissionStep + 1,
      };
      if (moralityShift) {
        newState.moralityScore = prev.moralityScore + moralityShift;
      }
      if (choiceId) {
        const companionId = prev.activeLoyaltyMission?.startsWith('lm_elara') ? 'elara' : 'the_human';
        newState.companionDialogHistory = {
          ...prev.companionDialogHistory,
          [companionId]: [...(prev.companionDialogHistory[companionId] || []), choiceId],
        };
      }
      return newState;
    });
  }, []);

  const completeLoyaltyMission = useCallback((missionId: string, loreUnlock: string, moralityBonus: number, relationshipBonus: number, companionId: string, title?: string) => {
    setState(prev => {
      const newRel = { ...prev.companionRelationships };
      newRel[companionId] = Math.min(100, (newRel[companionId] || 0) + relationshipBonus);
      return {
        ...prev,
        completedLoyaltyMissions: [...prev.completedLoyaltyMissions, missionId],
        activeLoyaltyMission: null,
        loyaltyMissionStep: 0,
        loyaltyLoreUnlocked: [...prev.loyaltyLoreUnlocked, loreUnlock],
        loyaltyTitles: title ? [...prev.loyaltyTitles, title] : prev.loyaltyTitles,
        moralityScore: prev.moralityScore + moralityBonus,
        companionRelationships: newRel,
      };
    });
  }, []);

  return (
    <GameContext.Provider value={{
      state,
      advanceAwakening,
      setAwakeningStep,
      setCharacterChoice,
      completeAwakening,
      enterRoom,
      collectItem,
      markElaraDialogSeen,
      isRoomUnlocked,
      canUnlockRoom,
      getRoomDef,
      getRoomState,
      getUnlockedRooms,
      resetGame,
      completeGame,
      earnLoreAchievement,
      isGameCompleted,
      collectCard,
      setActiveDeck,
      setNarrativeFlag,
      logClue,
      grantMysteryItem,
      claimQuestReward,
      shiftMorality,
      getMoralityLabel,
      getMoralityTier,
      unlockMoralityReward,
      discoverTransmission,
      isTransmissionDiscovered,
      completeTutorial,
      isTutorialCompleted,
      craftItem,
      craftFailed,
      addMaterial,
      gainCompanionXp,
      activateCompanionQuest,
      completeCompanionQuest,
      unlockBackstory,
      setRomance,
      addCompanionDialogChoice,
      getCompanionLevel,
      assignArk,
      discoverArk,
      completeDiplomacyEvent,
      startFactionWar,
      contributeFactionWar,
      advanceFactionWar,
      endFactionWar,
      giveCompanionGift,
      startLoyaltyMission,
      advanceLoyaltyMission,
      completeLoyaltyMission,
      skipToExploring,
      // ═══ NARRATIVE v2 ═══
      advanceNarrativeAct,
      recordNarrativeChoice,
      setCurrentPreludeBeat,
      recordPreludeCompletionFlag,
      setLightDarkAlignment,
      setAct1PublicWitnessBalance,
      setHumanContact,
      setHumanContactSecret,
      setElaraKnowsAboutHuman: setElaraKnowsAboutHumanFn,
      adjustHumanTrust,
      adjustElaraTrust,
      adjustNarratorBond,
      getNarratorBond,
      adjustMemoryEnergy,
      earnMemoryEnergy,
      getMemoryEnergyCap,
      recordChessWin,
      advanceYearOneMonth,
      getYearOneMonth,
      completeRecruitmentMission,
      setElaraCallback,
      setHumanCallback,
      // ═══ NPC RELATIONSHIPS ═══
      adjustNpcTrust,
      discoverNpc,
      setNpcCallback,
      revealNpcSecret,
      incrementNpcConversation,
      // ═══ PRESTIGE ═══
      performPrestige,
      getPrestigeLevel,
      getPrestigeBaseline,
      // ═══ ARMY MANAGEMENT ═══
      recruitUnit,
      deployUnits,
      completeDeployment: completeDeploymentFn,
      updateSectorControl,
      getAvailableUnits,
      getActiveDeployments,
      checkDeploymentCompletion,
      forceSave,
      isServerSyncReady,
      startInternalizingThought,
      completeInternalizingThought,
      addArchetypeEmergence,
      commitIdeology,
      setIdeologyFlag,
      setInnerVoiceSkill,
      updatePetBond,
      setApprentice,
      recordFallenApprentice,
      setApprenticeRecruitCooldown,
      addAcademyTranscriptEntry,
      adjustProfessorApproval,
      addTrialHistoryEntry,
      adjustHousePoints,
      setMechronisHouse,
      addPin,
      addCorruption,
      recordDarkAbilityUse,
      completePurgeRitual,
      completeSorting,
      markTransmissionWatched,
      markTransmissionNotified,
      addLoredexDiscovered,
      setTransmissionPlaybackPosition,
      clearTransmissionPlaybackPosition,
      addGraduate,
      setLegionRoster,
      addLegionLetter,
      markLettersRead,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
