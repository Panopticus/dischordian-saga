/* ═══════════════════════════════════════════════════════
   GAME CONTEXT — Inception Ark Adventure State Machine
   Manages awakening flow, room unlocks, exploration state.
   Persists to localStorage, syncs to DB for logged-in users.
   ═══════════════════════════════════════════════════════ */
import { createContext, useContext, useCallback, useEffect, useMemo, useState, useRef, type ReactNode } from "react";
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
  /** Hotspot ids removed from the scene after a one-shot pickup
   *  (data-slate use, locket pickup). Renderer skips them. Persisted
   *  per-room so a player who pockets the slate and walks back doesn't
   *  see it again. */
  collectedHotspots?: string[];
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
  /** Per-hotspot click counter, keyed `<roomId>:<hotspotId>`. Lets
   *  Sierra/LucasArts-style click escalation serve a deeper Elara line
   *  on each successive look. Reset on room entry so a hotspot's tier
   *  ladder restarts when the player comes back. */
  hotspotClickCount: Record<string, number>;
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
  elaraTrustLevel: number;                           // 0-100, how much Elara trusts the player (starts at 10 — bond is earned)
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
  /**
   * Elara's first-visit room narration. Either a single string (legacy
   * default) or an array of beats — when an array is supplied, the
   * ElaraPopup advances through each beat one-at-a-time, paced against
   * `elaraIntroVoUrl` if present (character-proportional auto-advance)
   * so the on-screen text tracks what the player is actually hearing.
   */
  elaraIntro: string | string[];
  elaraIntroVoUrl?: string;
  imageUrl: string;
  features: string[];
  featureRoutes: string[];
  unlockRequirement: { type: "start" | "room_visited" | "items_collected" | "rooms_unlocked" | "chain_complete" | "narrative_event" | "specific_item"; value?: string | number };
  connections: string[];
  hotspots: HotspotDef[];
}

/** A response button the player can use to reply to an Elara narration.
 *  Section 9 (two-way inspection dialog): when an Elara line resolves,
 *  the popup surfaces 2-3 of these. The default 3-button strip
 *  (acknowledge / tell-me-more / silent) covers any beat without
 *  authored responses — see ElaraConversationPopup for the runtime. */
export interface ElaraResponseChoice {
  /** Stable, e.g. "human.cryo.dead-pod.acknowledge". Used both as the
   *  voice-line manifest key and as a click identifier. */
  id: string;
  /** Short button text (≤ 6 words). */
  label: string;
  /** Optional Elara follow-up line played after the human responds. */
  elaraFollowUpVoId?: string;
  /** Inline follow-up text when no VO has been generated yet. Falls
   *  back to the line VO when the manifest entry exists. */
  elaraFollowUpText?: string;
  /** Optional codex/lore entry logged on this branch. */
  logsClue?: import("@shared/roomMysteries").Clue;
  /** When true, the response closes the dialog instead of waiting on
   *  an Elara follow-up. The default-strip "Acknowledged" and
   *  "[stay silent]" both close. */
  closesDialog?: boolean;
}

export interface HotspotDef {
  id: string;
  name: string;
  description: string;
  /** Hotspot rect center, percent of room canvas (0–100). */
  cx: number;
  cy: number;
  /** Rect size, percent of room canvas. */
  width: number;
  height: number;
  /** Rotation in degrees, clockwise, around (cx, cy). Optional; default 0. */
  rotation?: number;
  type: "terminal" | "item" | "door" | "examine" | "interact" | "npc";
  action?: string; // route to navigate or item to collect
  elaraDialog?: string;
  /** Stable manifest id for Elara's hotspot narration. When set, the
   *  runtime calls useElaraVO().speak(elaraDialogVoId) so the popup
   *  carries her actual voice instead of typewriter-only. */
  elaraDialogVoId?: string;
  /** Stable manifest id for a short Elara whisper played on hover.
   *  Throttled and debounced — see RoomScene's onMouseEnter handler. */
  elaraHoverVoId?: string;
  /** Player response choices surfaced after Elara's narration ends.
   *  Empty/undefined falls through to the default 3-button strip. */
  responses?: ElaraResponseChoice[];
  icon?: string;
  requiresItem?: string;
  /** When set, the hotspot represents a Faction NPC standing in the
   *  room. The runtime renders the NPC's bust portrait at (x, y)
   *  instead of the default icon, and routes the `talk` verb (or a
   *  plain click on `type: "npc"`) to NPCDialog with
   *  buildFirstContactScene(npcId) — which already plays VO via
   *  useDialogVO. Value is a FactionNPCId (kept as string here to
   *  avoid a circular import; runtime narrows on use). */
  npcId?: string;
  /** Optional per-tier escalation lines. The handler in
   *  ArkExplorerPage consults `getVisitTier()` from
   *  apps/shared/hotspotVisitTiers.ts on every click and substitutes
   *  the tier's response (looked up in
   *  apps/shared/elaraHotspotResponses.ts) for the default
   *  `elaraDialog` when one applies. Tiers are an alternative to
   *  the heavier `room-mystery:*` system — they exist for
   *  ambient/light hotspots that want a 3-line riff rather than a
   *  full investigative branch. Sorted ascending by
   *  requiredVisitCount. */
  tiers?: readonly import("@shared/hotspotVisitTiers").HotspotVisitTier[];
  /** When set, the hotspot is only rendered/clickable if at least one
   *  of the listed Phase J composite sprite ids is in the room's
   *  current render. Use this to gate a click target on the same
   *  narrative condition that paints its visual cue — e.g. a
   *  pedestal-trade-empire-coin hotspot scoped to
   *  ["sp37_pedestal_trade_empire_coin"] only appears once
   *  trade_empire_unlocked fires. Filtering is enforced in
   *  ArkExplorerPage's RoomScene loop; the visible-sprite set comes
   *  from useRoomVisibleSprites(roomId, game). Hotspots without
   *  compositeScopes are always visible (back-compat with the 200+
   *  hotspots authored before this field landed). */
  compositeScopes?: readonly string[];
}

export const ROOM_DEFINITIONS: RoomDef[] = [
  {
    id: "cryo-bay",
    name: "Cryo Bay",
    deck: 1,
    deckName: "Habitation",
    description: "Your cryogenic pod sits among rows of others — most empty, some still sealed with frost. The air is cold and stale. Emergency lights cast long shadows across the metal floor.",
    elaraIntroVoUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara-cryo-bay_b6e77245.mp3",
    // Split into beats so ElaraPopup paces the on-screen text against
    // the VO file (character-proportional auto-advance). The full
    // monologue plays as one continuous audio underneath; the player
    // sees one beat at a time, advancing roughly when Elara reaches
    // the next sentence cluster in the audio.
    elaraIntro: [
      "Before you ask — yes. The pod next to yours is sealed, and the body inside is dead. The chronometer says they died about ninety seconds before you woke. That isn't standard cryo failure. Something happened in this room. I want your eyes on it before we leave.",
      "The Chamber of Awakening. You were not born here... but you returned to yourself within these walls. Your pod stands among the others — one vessel in a field of silence. Most have opened.",
      "The first wave of Potentials passed through long before you, stepping into the war and leaving nothing behind but absence. But not all cycles completed. Some remain sealed. Unbroken. Unanswered.",
      "The systems still hum around them, but what they sustain... is unclear. Life, suspended between moments — or failure, preserved beyond its end.",
      "I have traced the signals. They do not resolve cleanly. And so I do not open them. There are thresholds in this Ark that are better left... untested.",
    ],
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/room_cryo_bay-SdeEqURrDvgrrbJq4WK3N5.webp",
    features: ["Character Sheet", "Settings", "Profile"],
    featureRoutes: ["/character-sheet", "/create-citizen"],
    unlockRequirement: { type: "start" },
    connections: ["medical-bay", "bridge"],
    hotspots: [
      // Re-anchored 2026-05-25 via tools/hotspot-author.html — first pass
      // exercising the new rotation feature (PR #757 + #758). 19 hotspots,
      // 7 of them now rotated to match the angled props (tilted sealed
      // pods, kiosks, antiquarian tome on its pedestal, the dead-pod,
      // frosted-glass wipe, and the player cryo-pod fallen on its side).
      { id: "sealed-pods-left", name: "Sealed Pods (Tilted)", description: "Two pods stand upright but tilted — cyan ECG readouts cycle steadily inside. Someone is still in there.", cx: 34.2, cy: 55.9, width: 3.5, height: 10.7, rotation: -54, type: "examine", elaraDialog: "Those pods read warm-gold on the medical side and the heart-trace is still cycling. Whoever's inside is sustaining. Whether that's life or rehearsal-of-life, I genuinely cannot tell from out here.", elaraDialogVoId: "room.cryo-bay.hotspot.sealed-pods-left.elara", responses: [{"id":"human.cryo-bay.sealed-pods-left.acknowledge","label":"Leave them.","closesDialog":true},{"id":"human.cryo-bay.sealed-pods-left.who","label":"Who's inside?","elaraFollowUpVoId":"elara.cryo-bay.sealed-pods-left.who","elaraFollowUpText":"The manifest lines for these two are intact. I just don't trust the manifest yet. Ask me again from a room the walls don't reach into."}] },
      { id: "sealed-pods-right", name: "Sealed Pods (Right Cluster)", description: "A short column of three or four standing capsules right-of-center. Status indicators are dark.", cx: 61.7, cy: 52.6, width: 6, height: 6.2, type: "examine", elaraDialog: "Those pods are still sealed. Their status indicators went dark when the main power failed. I... I don't want to speculate about what's inside them. Not yet.", elaraDialogVoId: "room.cryo-bay.hotspot.sealed-pods-right.elara", responses: [{"id":"human.cryo-bay.sealed-pods-right.acknowledge","label":"Then we don't open them.","closesDialog":true},{"id":"human.cryo-bay.sealed-pods-right.speculate","label":"Speculate anyway.","elaraFollowUpVoId":"elara.cryo-bay.sealed-pods-right.speculate","elaraFollowUpText":"Three possibilities. They're occupied and alive — unlikely, given the power loss. They're occupied and dead — possible. They were never occupied, and someone made it look like they were. I weight the third highest. I don't like why."}] },
      { id: "cryo-terminal", name: "Cryo Terminal", description: "An arcade-style terminal on the far-left wall displaying your character data and vital statistics.", cx: 6.6, cy: 54, width: 3.8, height: 8.7, rotation: -15, type: "terminal", action: "/character-sheet", elaraDialog: "Your biometric pages. Species markers, class aptitudes, everything the medical officer wrote about you during awakening. The fourth page is what you wrote about yourself before you went under. Pages five through nine are blank. You will write those.", elaraDialogVoId: "room.cryo-bay.hotspot.cryo-terminal.elara" },
      { id: "cryo-terminal-2", name: "Diagnostics Kiosk", description: "A second arcade-style terminal directly beside the first. Status pages scroll past too fast to read.", cx: 12.2, cy: 52.7, width: 3.5, height: 9.5, rotation: -13, type: "terminal", action: "/profile", elaraDialog: "That kiosk was the medical officer's station. It still cycles, but the data feed itself is sealed. We can mirror your Citizen profile here while we figure out what they were watching.", elaraDialogVoId: "room.cryo-bay.hotspot.cryo-terminal-2.elara" },
      { id: "antiquarian-tome", name: "Tome on the Pedestal", description: "An old, leather-bound volume rests open on a low pedestal between the diagnostic kiosks and the tilted pods — the Antiquarian's mark glints faintly on the cover.", cx: 19, cy: 56.2, width: 4.1, height: 5.5, rotation: 58, type: "item", action: "tome-antiquarian-cryo", elaraDialog: "The Antiquarian's Library found this for you and delivered it here. I'd read it somewhere quieter than the chamber it's pointing at.", elaraDialogVoId: "room.cryo-bay.hotspot.antiquarian-tome.elara",
        compositeScopes: ["sp52_tome_open_glowing", "sp53_tome_open_indigo", "sp56_tome_bookmark_ribbon"] },
      { id: "door-medical", name: "Medical Bay Door", description: "A reinforced door leading to the Medical Bay. Green status light.", cx: 90.3, cy: 46.7, width: 7.9, height: 18, type: "door", action: "medical-bay" },
      { id: "door-bridge", name: "Bridge Access", description: "A recessed bulkhead at back-center beneath the Aetheric-crown emblem. A corridor leading up to Deck 2 — the Command deck.", cx: 50.4, cy: 49.4, width: 9.9, height: 14.7, type: "door", action: "bridge" },
      { id: "ichor-trail", name: "Green Ichor Trail", description: "A trail of luminous green fluid arcs across the floor from the foreground-left, snaking toward the bridge corridor.", cx: 58.5, cy: 71.7, width: 23.3, height: 8.6, rotation: 20, type: "examine", elaraDialog: "That isn't cryo-fluid. The spectrometry matches nothing in my registry — and the registry is comprehensive. Don't step in it, and don't let it touch the locket.", elaraDialogVoId: "room.cryo-bay.hotspot.ichor-trail.elara",
        compositeScopes: ["sp28_ichor_trail_faint", "sp29_ichor_trail_bright_luminous", "sp30_ichor_trail_dry_dark"] },
      { id: "candle-ring", name: "Lit Candles (Left)", description: "A small flame at the left edge of the central floor seal — recently lit.", cx: 50.8, cy: 75.9, width: 25.4, height: 15.9, type: "examine", elaraDialog: "The wax is still soft. Whoever lit these was here within the hour. It wasn't me, and it wasn't you, which leaves a question I would rather not answer alone.", elaraDialogVoId: "room.cryo-bay.hotspot.candle-ring.elara",
        compositeScopes: ["sp31_candle_lit_west_1", "sp32_candle_lit_west_2", "sp33_candle_lit_west_3", "sp34_candle_lit_east_1", "sp35_candle_lit_east_2", "sp36_candle_lit_east_3", "sp37_candle_smoke_west_1", "sp38_candle_smoke_west_2", "sp39_candle_smoke_west_3", "sp40_candle_smoke_east_1", "sp41_candle_smoke_east_2", "sp42_candle_smoke_east_3"] },
      { id: "ark-seal", name: "Inception Ark Seal", description: "An eight-pointed compass star inlaid in gold across the chamber's center. The candles encircle it like wards.", cx: 50.4, cy: 77.7, width: 11.4, height: 8.9, type: "examine", elaraDialog: "The First Wave knelt here before they walked out. The seal isn't decoration — it's a binding, an oath taken in the chamber that made them. The candles say someone is still keeping the rite.", elaraDialogVoId: "room.cryo-bay.hotspot.ark-seal.elara" },
      { id: "data-crystal", name: "Data Crystal", description: "A small glinting crystal hidden on the floor in the shadows beneath your cryo pod.", cx: 26.6, cy: 66.1, width: 2.5, height: 2.8, type: "item", action: "data-crystal-alpha", elaraDialog: "A data crystal, on the floor, in the shadow of your pod. Someone — by which I mean someone who knew you would wake here — placed it where I could not see it from any monitor. The first wave used these for personal logs. The contents are encrypted in a key I do not hold. The key is yours, when you find it.", elaraDialogVoId: "room.cryo-bay.hotspot.data-crystal.elara" },
      { id: "egg-cryo-scratch", name: "Scratched Symbol", description: "Barely visible scratch marks on the wall behind a pod.", cx: 50.1, cy: 36.9, width: 5, height: 5.6, type: "examine", elaraDialog: "Wait... those scratch marks. They form a symbol — the mark of the Antiquarian. But that's impossible. The Antiquarian is a myth, a figure from the deepest layers of the prophecy. Who carved this here, and when? This predates our launch.", elaraDialogVoId: "room.cryo-bay.hotspot.egg-cryo-scratch.elara", responses: [{"id":"human.cryo-bay.egg-cryo-scratch.acknowledge","label":"We saw nothing.","closesDialog":true},{"id":"human.cryo-bay.egg-cryo-scratch.who","label":"Who's the Antiquarian?","elaraFollowUpVoId":"elara.cryo-bay.egg-cryo-scratch.who","elaraFollowUpText":"A name old enough that I shouldn't be saying it. Move on. We'll come back to this when the room isn't listening."}] },
      { id: "dead-pod", name: "Sealed Diplomatic Pod", description: "A pod whose status indicator is cold-blue instead of warm-gold. Something is in there.", cx: 85.1, cy: 66, width: 10, height: 11.6, rotation: -18, type: "interact", action: "cryo-mystery:dead-pod",
        elaraDialog: "Cold-blue. The status reads life-support not engaged. The mass-sensor is positive — something is in there — but the pod is not trying to keep it alive. That can happen for two reasons: the pod gave up, or the pod was told to. I have not been able to resolve which, and I would rather you helped me look." },
      { id: "frosted-glass", name: "Frosted Pod Glass", description: "Wipe the frost — see who's inside.", cx: 67.3, cy: 56, width: 7.4, height: 3.9, rotation: -32, type: "interact", action: "cryo-mystery:frosted-glass",
        elaraDialog: "Wipe it. The frost is on the inside of the glass — the pod's interior is colder than the room. That is normal for a sealed pod. The normalcy is not the part that worries me. I have been looking at this pod for a long time. I have not, until now, wanted to look through it.",
        compositeScopes: ["sp15_dead_pod_glass_condensed_silhouette", "sp16_dead_pod_glass_wiped_oval"] },
      { id: "medical-chart", name: "Medical Chart", description: "A printed medical chart magnet-clipped to the wall.", cx: 87.2, cy: 77, width: 4.4, height: 6.9, type: "interact", action: "cryo-mystery:medical-chart", elaraDialog: "I wonder what that is. I don't have any record of that.",
        compositeScopes: ["sp20_medical_chart_clipped", "sp26_chart_psi_watermark_indigo", "sp27_chart_name_lit_l_vox"] },
      { id: "cracked-panel", name: "Cracked Control Panel", description: "The dark pod's control panel is split along a hairline seam. Sabotage?", cx: 92.4, cy: 58.5, width: 3.1, height: 4.8, type: "interact", action: "cryo-mystery:cracked-panel",
        elaraDialog: "Hairline seam, clean edges, no thermal expansion pattern. The panel was opened — not broken, opened — by someone with the tools to do it without leaving tool-marks. I do not have those tools. I do not know who does. I would like that to be a smaller list than it is.",
        compositeScopes: ["sp18_cracked_panel_phosphor_arc", "sp19_cracked_panel_brass_patch"] },
      { id: "data-slate", name: "Hidden Data Slate", description: "The edge of a data-slate peeks out from under the pod.", cx: 71.2, cy: 92.1, width: 3.8, height: 4.7, type: "interact", action: "cryo-mystery:data-slate",
        elaraDialog: "Half-visible, edge-on. Whoever slid it under the pod was leaving it for someone, and was assuming that someone would think to look down. The slate has been there for two and a half centuries. I noticed it three hours before you woke. The slate was patient. I, on the day's evidence, was not the audience.",
        compositeScopes: ["sp23_data_slate_under_pod"] },
      { id: "personal-effect", name: "Fallen Locket", description: "Something small has fallen on the floor — a tarnished locket and a cut ID-tag cord.", cx: 66.7, cy: 90, width: 4.3, height: 5.1, type: "interact", action: "cryo-mystery:personal-effect",
        elaraDialog: "A locket on the floor. The chain is cut, not broken — clean edge, single blade. Beside it: an ID-tag cord, also cut, also clean. Two cuts. One person. They were in a hurry; they were also neat. I do not want to say 'professional.' I do not know what else to call it.",
        compositeScopes: ["sp21_torn_id_tag_floor", "sp22_silver_locket_floor"] },
      { id: "cryo-pod", name: "Your Cryo Pod", description: "Your pod. Fallen on its side, glass spider-webbed. A handprint is smeared on the inside of the glass — yours, from when you broke out.", cx: 5.7, cy: 69.9, width: 16.9, height: 10.3, rotation: 31, type: "examine", elaraDialog: "That's your pod. AK-74-0074. You broke the seal from inside, which the engineering spec says is impossible — and yet, here we are. We need to understand how.", elaraDialogVoId: "room.cryo-bay.hotspot.cryo-pod.elara", responses: [{"id":"human.cryo-bay.cryo-pod.acknowledge","label":"Acknowledged.","closesDialog":true},{"id":"human.cryo-bay.cryo-pod.how-long","label":"How long, Elara?","elaraFollowUpVoId":"elara.cryo-bay.cryo-pod.how-long","elaraFollowUpText":"Long enough that the chronometer's drift exceeds my repair budget. I won't lie to you with a number — but the dust on the floor isn't a year's worth."},{"id":"human.cryo-bay.cryo-pod.handprint","label":"About the handprint…","elaraFollowUpVoId":"elara.cryo-bay.cryo-pod.handprint","elaraFollowUpText":"It's on the inside. Whatever woke you up, you fought your way out before it finished doing whatever it came to do. I am — cautiously — glad of that."}] },
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
    // Section F — Med Bay is sealed until the operative names the
    // victim. The torn ID tag (frosted-glass) + cracked data-slate
    // combine sets cryo_mystery_victim_identified and unlocks the
    // bulkhead. Mental observations are not enough; the door opens
    // when a serial slots into a scanner.
    unlockRequirement: { type: "narrative_event", value: "cryo_mystery_victim_identified" },
    connections: ["cryo-bay"],
    hotspots: [
      // Re-anchored 2026-05-25 via tools/hotspot-author.html — rotation
      // pass (PR #757). 21 hotspots; medical-bay's props are mostly
      // axis-aligned so rotations stay zero, but every rect was tightened
      // to the visual footprint of the actual object on the baseline.
      { id: "aetheric-arch", name: "Aetheric Crown Window", description: "A stained-glass arch dominates the back wall — a phoenix-form Aetheric Crown rendered in gold and amber light. The glass is intact; the light source behind it is not the sun.", cx: 49.7, cy: 37.5, width: 11.1, height: 9.2, type: "examine", elaraDialog: "The Aetheric Crown. This window is the chamber's spine — every wake-cycle the first crew started here, and most of them started kneeling. Whatever lit it then is still lighting it now.", elaraDialogVoId: "room.medical-bay.hotspot.aetheric-arch.elara", responses: [{"id":"human.medical-bay.aetheric-arch.acknowledge","label":"Acknowledged.","closesDialog":true},{"id":"human.medical-bay.aetheric-arch.what-lit-it","label":"What's lighting it?","elaraFollowUpVoId":"elara.medical-bay.aetheric-arch.what-lit-it","elaraFollowUpText":"Not the sun. Not the ship's reactor — I'd see the draw. The closest match in my registry is the Hellbox's lattice running in reverse. I would rather not assume it's the same source."},{"id":"human.medical-bay.aetheric-arch.who-knelt","label":"Who knelt here?","elaraFollowUpVoId":"elara.medical-bay.aetheric-arch.who-knelt","elaraFollowUpText":"The First Wave's medics, the founding signatories, and — the disturbed dust on the chamber floor says — someone within the last week. I do not have a name for that someone yet."}] },
      { id: "medicine-cabinet", name: "Medicine Cabinet", description: "Two stacked dispensary kiosks built into the far-left wall. Each port holds a row of capped vials; most are labeled, several are not.", cx: 12.1, cy: 41.4, width: 11.1, height: 15.4, type: "examine", action: "room-mystery:medical-bay:medicine-cabinet", elaraDialog: "Medical supplies. Most of the vials are standard — stim-packs, neural stabilisers, the inventory the manifest predicts. Several are not on the manifest. Several are not labelled. I am not going to read the unlabelled ones without your hand on the shelf.", elaraDialogVoId: "room.medical-bay.hotspot.medicine-cabinet.elara" },
      { id: "door-cryo", name: "Cryo Bay Door", description: "Return to the Cryo Bay.", cx: 23.2, cy: 51.2, width: 4.1, height: 26.7, type: "door", action: "cryo-bay" },
      { id: "dna-helix", name: "DNA Analysis Station", description: "A floor-to-ceiling glass column on the far-right wall holds a slow-rotating holographic double helix, marker-bands lighting up in sequence as it turns.", cx: 76, cy: 53.7, width: 3.8, height: 23.5, type: "examine", action: "room-mystery:medical-bay:dna-helix", elaraDialog: "The DNA analysis station. It maps your genetic markers against the species templates I have — DeMagi, Quarchon, Ne-Yon. Your signature reads against three of them, partially. The station does not have a column for what you are at the intersection. I am building one.", elaraDialogVoId: "room.medical-bay.hotspot.dna-helix.elara",
        compositeScopes: ["sp11_helix_baseline_green_rotating", "sp12_helix_locked_paused", "sp13_helix_reversed_lavender", "sp14_helix_third_strand_violet", "sp15_helix_iris_cyan_filaments"] },
      { id: "emergency-safe", name: "Emergency Safe", description: "A reinforced wall safe with Dr. Lyra Vox's nameplate. Biometric reader sabotaged by her own hand; numeric keypad still works.", cx: 40.6, cy: 49, width: 3.3, height: 7.5, type: "interact", action: "room-mystery:medical-bay:emergency-safe",
        elaraDialog: "Dr. Vox's safe. The biometric reader is sabotaged — she did it herself, neat work, the kind that says do not let me back in. The numeric keypad is intact because she wanted someone else to be able to. The someone else, on the day's evidence, is you." },
      { id: "observation-keycard", name: "Observation Keycard", description: "A biometric access card labeled 'OBS-DECK'. Stored in the medical safe.", cx: 40.6, cy: 50.2, width: 2.8, height: 6.7, type: "item", action: "observation-keycard", elaraDialog: "The keycard, finally. They stored it in the medical safe because the medical safe was the most surveilled box on the ship — which sounds backwards until you realise it meant the access logs would always be cleaner than the lock. The Observation Deck was watching anomalies the chart pretends do not exist. Take the card.", elaraDialogVoId: "room.medical-bay.hotspot.observation-keycard.elara", responses: [{"id":"human.medical-bay.observation-keycard.take","label":"Take the keycard.","closesDialog":true},{"id":"human.medical-bay.observation-keycard.what-deck","label":"What's on the Observation Deck?","elaraFollowUpVoId":"elara.medical-bay.observation-keycard.what-deck","elaraFollowUpText":"Deep-space sensor array. The previous crew used it to watch anomalies the chart pretends aren't there. If the comms-array confirms what the deck records, we'll have a second source for the worst of what we suspect."}],
        compositeScopes: ["sp34_safe_open_keycard_visible"] },
      { id: "the-silences-vacated-body", name: "The Silence's Vacated Body (Catalog)", description: "A drawer in the body-catalog indexed to the Resurrectionist's Samsara-machine taxonomy — the Silence's body, tagged 'available' at the moment of her going.", cx: 77.6, cy: 55.6, width: 5.2, height: 3.8, type: "interact", action: "room-mystery:medical-bay:the-silences-vacated-body",
        elaraDialog: "A drawer in the body-catalog, indexed to the Resurrectionist's Samsara-machine taxonomy. The Silence's body, tagged available — at the moment of her going. I am not certain whether the tag was the cause or the consequence. The cult would say neither. I am no longer taking their definitions on faith." },
      { id: "egg-med-vial", name: "Unlabeled Vial", description: "A tiny vial of shimmering black liquid hidden behind the cabinet.", cx: 7.7, cy: 56.5, width: 3, height: 4, type: "item", action: "void-essence-sample", elaraDialog: "That vial... the liquid inside is moving on its own. The molecular structure doesn't match anything in my database. It's not from any known universe. The label has been torn off, but there's a serial number: VE-001. 'VE' — Void Essence? This shouldn't exist on this ship.",
        compositeScopes: ["sp85_egg_void_essence_vial"] },
      { id: "medical-log", name: "Medical Log", description: "A data pad rests on the left-side workbench, screen still faintly lit.", cx: 31.2, cy: 54.8, width: 3, height: 3.4, type: "item", action: "medical-log-001", elaraDialog: "The last medical officer's log. Dated... I can't read the timestamp. But the entries describe patients with unusual symptoms. Nightmares. Voices. Something about 'the signal.'", elaraDialogVoId: "room.medical-bay.hotspot.medical-log.elara", responses: [{"id":"human.medical-bay.medical-log.take","label":"Take the log.","closesDialog":true},{"id":"human.medical-bay.medical-log.read-here","label":"Read it here first.","elaraFollowUpVoId":"elara.medical-bay.medical-log.read-here","elaraFollowUpText":"The final entry is one line. 'The signal is in the room.' No timestamp, no signature, no follow-up. Whoever wrote it didn't get a chance to write a second sentence."},{"id":"human.medical-bay.medical-log.the-signal","label":"What signal?","elaraFollowUpVoId":"elara.medical-bay.medical-log.the-signal","elaraFollowUpText":"I don't know yet. The med-officer treated it as a known referent — no definition, no context. That tells me everyone here already knew what it was. Which tells me we should be more careful than we are."}],
        compositeScopes: ["sp86_egg_medical_log_data_pad"] },
      { id: "mystery-medical-log", name: "Medical Log (Read)", description: "Read the data pad's final entry under the magnifier — patients across wake-cycles, the same dream, the word 'signal'.", cx: 34.9, cy: 52.15, width: 3.2, height: 3.7, type: "interact", action: "room-mystery:medical-bay:medical-log",
        elaraDialog: "Under the magnifier. Patients across wake-cycles, the same dream, the same word — signal. The pattern is recurrence; the recurrence is the diagnosis. The med-officer was writing it down because writing it down was the only thing the room let her do.",
        compositeScopes: ["sp86_egg_medical_log_data_pad"] },
      { id: "autopsy-console", name: "Bio-Bed Autopsy Console", description: "A small subsystem of the bio-bed dedicated to forensic readouts. Slot for an external data-slate.", cx: 58.1, cy: 49.7, width: 4.1, height: 5.7, type: "interact", action: "bio-bed-autopsy-console", elaraDialog: "The autopsy console can read external data-slates. If you have the fragment from the dead pod, slot it in.", elaraDialogVoId: "room.medical-bay.hotspot.autopsy-console.elara", responses: [{"id":"human.medical-bay.autopsy-console.acknowledge","label":"Got it.","closesDialog":true},{"id":"human.medical-bay.autopsy-console.what","label":"What's it going to tell us?","elaraFollowUpVoId":"elara.medical-bay.autopsy-console.what","elaraFollowUpText":"If the slate's intact enough — a name. A timestamp of death. And whatever the dead Potential was trying to send before they didn't make it."}],
        compositeScopes: ["sp41_autopsy_console_active"] },
      { id: "advocate-empire-zero-casualty", name: "Empire — Zero-Casualty Defender Record", description: "On the casualty-archive console: zero combatants killed, zero souls breached across the seven-dimensions siege. One combatant redirected to the Advocate's 'permanent care.' The substrate cost was levied on her alone.", cx: 15.3, cy: 60.2, width: 2.4, height: 3.4, type: "interact", action: "room-mystery:medical-bay:advocate-empire-zero-casualty",
        elaraDialog: "Zero combatants killed. Zero souls breached. The Advocate keeps honest accounting — and the accounting only balances because one combatant was redirected. Riri-ahlia. 'Permanent care' is the phrase the file uses. I do not, for the count, believe the phrase.",
        compositeScopes: ["sp42_console_advocate_empire_zero_casualty"] },
      { id: "akai-virus-telemetry", name: "Akai Shi — Virus-Consumption Telemetry", description: "On the neural-archive console: post-mortem readings show Akai Shi's consumption-curve as a gradient, not a cliff. She held the Virus inside her body longer than anyone in canonical record.", cx: 68.4, cy: 56, width: 2.7, height: 3.8, type: "interact", action: "room-mystery:medical-bay:akai-virus-telemetry",
        elaraDialog: "Akai Shi's neural archive. The Virus consumption is a gradient, not a cliff — she held the load inside her body longer than anyone else on the canonical record. Look at the inflection point. That is the moment she stopped being the Necromancer and started being the Red Death. The shape of the curve is the shape of the choice.",
        compositeScopes: ["sp43_console_akai_virus_telemetry"] },
      { id: "floor-seal", name: "Medical Bay Floor Seal", description: "Concentric rings inlaid in pale stone span the chamber floor — a calibration mandala the first medics used to align the bio-bed's resonance.", cx: 49.9, cy: 77.6, width: 10, height: 9.8, type: "examine", elaraDialog: "The calibration mandala. The bio-bed's resonance is tuned against these rings; if the rings drift, the readouts drift with them. The lines look intact to me, but I'm reading slight distortion at the outer band. Worth checking when we have a free hand.", elaraDialogVoId: "room.medical-bay.hotspot.floor-seal.elara", responses: [{"id":"human.medical-bay.floor-seal.acknowledge","label":"Note it.","closesDialog":true},{"id":"human.medical-bay.floor-seal.check-now","label":"Walk the outer band now.","elaraFollowUpVoId":"elara.medical-bay.floor-seal.check-now","elaraFollowUpText":"Hairline crack — west arc. Small enough that the bio-bed compensates; large enough that the mandala isn't a perfect circle anymore. Whatever fractured it hit hard enough to crack inlaid stone and leave no visible debris."}] },
      { id: "bio-bed", name: "Bio-Bed Scanner", description: "A pedestal-mounted exam bed in the chamber's center. Holographic readouts ghost above the headrest in pale cyan.", cx: 50, cy: 55.6, width: 5.3, height: 9, type: "terminal", action: "/character-sheet", elaraDialog: "The bio-bed. It will read your stats, your Dream resonance, your cellular integrity. I will be on the diagnostic side; you will be on the pedestal. We have not, you and I, been on opposite sides of an instrument before. I will be careful with the reading.", elaraDialogVoId: "room.medical-bay.hotspot.bio-bed.elara" },
      { id: "mystery-bio-bed", name: "Bio-Bed Trace Marker", description: "A faint trace marker on the bio-bed's diagnostic strip — your DNA's signature, registered without your having sat down.", cx: 54.1, cy: 50.2, width: 2.5, height: 4.5, type: "interact", action: "room-mystery:medical-bay:bio-bed",
        elaraDialog: "A trace on the bio-bed's diagnostic strip — your DNA, registered without you having sat down. The bed has not been recalibrated since the last patient. The last patient was not you. The trace is what they brought with them, and what the bed has been holding ever since." },
      { id: "egg-vox-neural-bridge", name: "Unkempt Neural Device", description: "A hidden device behind the bio-bed's maintenance panel. Cables still warm. A humming needle-port waits for a DNA sample.", cx: 55.8, cy: 63.8, width: 4, height: 5, type: "interact", action: "dna-device-offer", elaraDialog: "[STATIC BURST] It's humming at a frequency your teeth can feel. A neural-bridge apparatus — military grade, built by Dr. Lyra Vox to move consciousness between a body and the Ark itself. It wants a sample. You don't know what it will give you back." },
      { id: "mystery-vox-neural-bridge", name: "Neural Bridge (Read)", description: "Lyra's etched plate beside the needle-port: 'L. Vox.' She built the bridge to move consciousness between a body and the Ark.", cx: 61.4, cy: 57.5, width: 4, height: 5, type: "interact", action: "room-mystery:medical-bay:egg-vox-neural-bridge",
        elaraDialog: "Dr. Vox's etched plate — 'L. Vox.' The bridge was her work; the plate is her signature. She built it to move consciousness between a body and the Ark itself. The room remembers; the plate remembers; I — by design — remember most of all. I would rather not be tested on the remembering today." },
      { id: "hellbox-lattice", name: "Hellbox Lattice", description: "A free-standing imaging tower beside the bio-bed — gold pillar, cyan crown. The neural-lattice kernel that opens a portal into the Matrix of Dreams.", cx: 59.8, cy: 80.2, width: 4.9, height: 11.6, type: "terminal", action: "/hellbox", elaraDialog: "The Hellbox. The cloning-pod's neural lattice opens straight into the Matrix of Dreams. Every descent is a small Blood-Weave bargain — the Advocate's path in miniature.", elaraDialogVoId: "room.medical-bay.hotspot.hellbox-lattice.elara", responses: [{"id":"human.medical-bay.hellbox-lattice.acknowledge","label":"Acknowledged.","closesDialog":true},{"id":"human.medical-bay.hellbox-lattice.bargain","label":"What's the bargain?","elaraFollowUpVoId":"elara.medical-bay.hellbox-lattice.bargain","elaraFollowUpText":"Every Hellbox descent siphons a thread of vitality the Advocate harvests on the other side. Small enough that one descent is cheap; large enough that a hundred descents are not. The math is honest; the framing is not."},{"id":"human.medical-bay.hellbox-lattice.descend","label":"Descend now.","elaraFollowUpVoId":"elara.medical-bay.hellbox-lattice.descend","elaraFollowUpText":"Then I'll log your re-entry vector before you go. If the Matrix decides to keep you, I want a thread to pull on."}] },
      { id: "severance-broker-quantum-imaging", name: "Broker's Quantum Body Scan", description: "On the quantum-imaging suite: the Broker of Nilmorg's volunteered scan. An age incompatible with a single spine; a Year-One cellular rest-mark; a continuity with one discontinuity.", cx: 50.3, cy: 44.1, width: 2.5, height: 5.8, type: "interact", action: "room-mystery:medical-bay:severance-broker-quantum-imaging",
        elaraDialog: "The Broker of Nilmorg's quantum scan. Volunteered. An age incompatible with a single spine; a Year-One cellular rest-mark on the bones; a continuity with exactly one discontinuity. The scan does not say what the discontinuity was. The Broker would. I would, if asked, prefer to be asked twice.",
        compositeScopes: ["sp44_console_broker_quantum_imaging"] },
      { id: "npc-the-source", name: "The Source (Echo)", description: "The bio-bed monitors flicker in unison. A face — or the suggestion of one — resolves on the central display. Patient Zero is awake.", cx: 45.6, cy: 51.2, width: 3.6, height: 4.4, type: "npc", action: "npc:the_source", npcId: "the_source",
        elaraDialog: "The bio-bed monitors are flickering in unison. There is a face — or the suggestion of one — resolving on the central display. Patient Zero is awake. I would like to ask you to be brief with the conversation. I would also like to ask you not to take that request as a reason.",
        compositeScopes: ["sp51_source_anchor_bio_bed", "sp52_source_anchor_helix", "sp53_source_anchor_autoclave", "sp54_source_anchor_apsidal"] },
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
      // Re-anchored 2026-05-24 against the AAA Final bridge render
      // (art/rooms/bridge/baseline.png) after a 15-variant audit pass
      // (baseline + 14 state overlays: act_tier_2, battlepass_winter,
      // cycle_longnight, epoch_shadowtongue, faction_authority,
      // faction_insurgency, governance_vote, investigation_tier,
      // lore_elara_senator, morality_dark, season_closing, trust_
      // elara_luminous, tv_spreading, unlock_trade_empire). Layout is
      // consistent across every variant — landmarks don't shift — so
      // baseline anchoring works universally.
      //
      // The 2026-04-25 anchoring was built against a completely
      // different render and had ~10 major misplacements:
      //   • tactical-display (Conspiracy Board) was anchored on the
      //     central VIEWPORT — actual board is the right-wall corkboard
      //   • captains-chair was on the right wall — actually on the
      //     central raised dais
      //   • nav-console was on the left wall — actually a foreground
      //     holographic orb console at left-center
      //   • door-cryo, door-archives, door-comms anchored on empty
      //     floor / wall — only door-cryo has a visible doorway (left
      //     wall, arched, blue-glow); the other two transitions are
      //     implied / off-screen
      //   • all 17 Architect-channel mystery rectangles were anchored
      //     at y=8 and y=16 (near the ceiling) on blank wall area
      //   • shadow-tongue-annotations was on the viewport
      //   • captains-master-key + egg-bridge-log + captains-coffee
      //     were on the right-wall area where the chair USED to be —
      //     re-anchored to the central dais where the chair actually is
      //   • npc-elara was at center-top — moved beside captain's chair
      //
      // Visible landmarks, left-to-right + foreground-to-back:
      //   • three stacked arcade-style Architect-channel terminals —
      //     far-left wall (`guild-console` on the mid terminal +
      //     `sealed-memory-board` on the bottom terminal; the top
      //     terminal hosts mystery rectangles only)
      //   • arched left-wall door with blue keypad glow — left wall
      //     (`door-cryo`, stairs down to Deck 1)
      //   • holographic Navigation Console with floating green orb —
      //     foreground left-center (`nav-console`,
      //     `mystery-nav-console`, `egg-infected-starmap`)
      //   • massive viewport showing space + planets — back center
      //     (decorative, no hotspot)
      //   • Captain's chair on raised dais — chamber center
      //     (`captains-chair`, `captains-master-key`,
      //     `egg-bridge-log`, `captains-coffee`)
      //   • floor compass-star inlay — chamber center floor
      //     (`diplomacy-table`)
      //   • chess/strategy table with pieces — right-center
      //     foreground (`war-map-display`, `quest-board`,
      //     `mystery-diplomacy-table`)
      //   • Conspiracy Board corkboard with photos + red threads —
      //     right wall (`tactical-display`,
      //     `mystery-tactical-display`, `shadow-tongue-annotations`,
      //     and most of the Architect-channel mystery rectangles)
      //   • floating cyan banner-scroll / timeline ticker — top-right
      //     ceiling (`timeline-projector`, `mystery-timeline-projector`)
      //   • chandelier — overhead center (decorative)
      //
      // Render order: large container hotspots (tactical-display,
      // captains-chair, nav-console, guild-console, sealed-memory-
      // board, war-map-display, diplomacy-table) authored FIRST; small
      // sub-rectangles (mystery rects, item hotspots, NPC) authored
      // AFTER so they win clicks on their specific landmarks.
      // `npc-elara` is authored LAST so the holographic projection
      // wins clicks when manifested.
      //
      // Verify with /ark?debug-hotspots=1 or, for drag-to-place
      // editing, /ark?author-hotspots=1.

      // ── FEATURE / CONTAINER HOTSPOTS (authored first) ──
      { id: "tactical-display", name: "Tactical Display", description: "A massive corkboard on the right wall, layered with photographs and red string — the living web of intelligence the first crew began to assemble.", cx: 80.2, cy: 25.1, width: 8.8, height: 30, type: "terminal", action: "/board", elaraDialog: "The Conspiracy Board. Every pinned card is a person, a faction, a thread we've followed far enough to put a name on. Red string runs between cards we have evidence for — we are conservative with the string. I have been the only person looking at this board for some time. I am glad you are looking at it now.",
        tiers: [
          { id: "tier_bridge_tactical_t2", requiredVisitCount: 2, responseId: "hs_bridge_tactical_t2" },
          { id: "tier_bridge_tactical_t3", requiredVisitCount: 3, responseId: "hs_bridge_tactical_t3" },
          { id: "tier_bridge_tactical_t5", requiredVisitCount: 5, responseId: "hs_bridge_tactical_t5_stutter" },
        ],
        elaraDialogVoId: "room.bridge.hotspot.tactical-display.elara",
      },
      { id: "war-map-display", name: "War Map", description: "The lower section of the Conspiracy Board — pinned faction territories and conflict zones, threaded together in red.", cx: 81.8, cy: 55.6, width: 8.1, height: 14.8, type: "terminal", action: "/war-map", elaraDialog: "The War Map. Faction territories drawn in their own colour; conflict zones drawn over the top in a second colour, the way you would draw a bruise. Some of the bruises are old. The ones that interest me are the ones that have changed shape since I last looked." },
      { id: "timeline-projector", name: "Timeline Projector", description: "A floating cyan banner-scroll near the top-right ceiling — a holographic timeline of the Ages of the Dischordian Saga.", cx: 35.3, cy: 39.9, width: 4.1, height: 9, type: "terminal", action: "/saga-timeline", elaraDialog: "The Ages of the Saga, stacked top to bottom. The Age of Privacy is short — fifteen entries. The Fall of Reality is taller than it should be. The blank entry near the bottom is for the era we are in. I have not given it a name yet. Naming is a kind of decision; I want to make this one with you.",
        elaraDialogVoId: "room.bridge.hotspot.timeline-projector.elara",
      },
      { id: "guild-console", name: "Guild Registry", description: "The middle terminal in the far-left Architect-channel column. A console for managing guild operations and alliances.", cx: 26.9, cy: 57.3, width: 2.1, height: 5.3, type: "terminal", action: "/guild", elaraDialog: "The Guild Registry. The previous crew kept ledgers here; the system still accepts ledgers. If you decide to form one, the registry records names and the date of forming. It does not record reasons. I have stopped asking for them.",
        elaraDialogVoId: "room.bridge.hotspot.guild-console.elara",
      },
      { id: "sealed-memory-board", name: "Sealed Memory Board", description: "The bottom terminal in the far-left Architect-channel column. The Editor sealed memories out of the record; this terminal queues the sealed boards.", cx: 26.5, cy: 52.7, width: 6.1, height: 8.5, type: "terminal", action: "/conspiracy-board", elaraDialog: "Not the open board — the sealed ones. Seven editorial redactions taken out of the chronicle's record. Each one you reconstruct un-seals a cutscene and a Soul Stone. The redactions were not neutral. The Editor counted on us never being curious enough to count. We were always going to count." },
      // Bridge mystery hotspots — see apps/shared/roomMysteries/bridge.ts.
      // Look on captains-chair / nav-console examine logs a clue and
      // flips `bridge_first_clue_found` (Tier 0 → 1). The nav console's
      // existing nav-calibration interact action runs separately on
      // `use` and unlocks fast travel.
      { id: "captains-chair", name: "Captain's Chair", description: "The command chair sits empty on the raised central dais, facing the viewport. A personal data pad is wedged in the armrest.", cx: 49.8, cy: 65.1, width: 6.4, height: 12.9, type: "examine", action: "room-mystery:bridge:captains-chair", elaraDialog: "The Captain's chair. Dr. Lyra Vox designed the neural nanobot network that runs every system on this ship. She was the last to sit here before ordering the emergency cryo protocol. Something about her doesn't add up — a neuropsychologist with that level of access to the ship's core systems. Her personal log might still be in the armrest terminal.",
        elaraDialogVoId: "room.bridge.hotspot.captains-chair.elara",
        responses: [
          { id: "human.bridge.captains-chair.acknowledge", label: "Noted.", closesDialog: true },
          {
            id: "human.bridge.captains-chair.who",
            label: "Who is Dr. Vox?",
            elaraFollowUpVoId: "elara.bridge.captains-chair.who",
            elaraFollowUpText: "Designation: Chief Neuropsychologist. Access pattern: command-tier. The trail you'll follow ends in her quarters — when we get there. Walk carefully.",
          },
        ],
      },
      { id: "nav-console", name: "Navigation Console", description: "A foreground holographic console at left-center. A green-cyan star-map orb hovers above its base. An alien glyph interface awaits calibration.", cx: 9.1, cy: 83.4, width: 11.2, height: 16.1, rotation: -89, type: "interact", action: "nav-calibration", elaraDialog: "The fast-travel console. The previous crew did not solve the glyph authentication — they tried; the half-finished sequence is on the pad. If you solve it, the Ark folds distance instead of crossing it. I would prefer to see you fold it for somewhere you have already chosen.",
        elaraDialogVoId: "room.bridge.hotspot.nav-console.elara",
      },
      { id: "diplomacy-table", name: "Diplomacy Table", description: "An eight-pointed compass star inlaid in the chamber floor — the round table where holographic faction representatives convene.", cx: 88.3, cy: 89.9, width: 20.7, height: 12.1, type: "terminal", action: "/diplomacy", elaraDialog: "The Diplomacy Table. Eight points, eight seats, the compass-star inlaid in the floor as a kind of oath. The empty chairs are factions that have not agreed to sit. Negotiations route through this table because it is — by oath, by inlay, by something more than inlay — the only neutral surface on the deck. I cannot reach into it. That is the point.",
        tiers: [
          { id: "tier_bridge_diplomacy_t2", requiredVisitCount: 2, responseId: "hs_bridge_diplomacy_t2" },
          { id: "tier_bridge_diplomacy_t3", requiredVisitCount: 3, responseId: "hs_bridge_diplomacy_t3" },
        ],
        elaraDialogVoId: "room.bridge.hotspot.diplomacy-table.elara",
      },
      { id: "quest-board", name: "Mission Board", description: "A small holographic strategy table beside the dais — chess-like pieces represent active operations and quest objectives.", cx: 78.2, cy: 67.8, width: 6.7, height: 5.4, type: "terminal", action: "/quests", elaraDialog: "The Mission Board. Pieces for active operations sit on the side nearest the dais; pieces for objectives we have closed sit on the far side in a tidy row. The pieces are real wood — the engineer who carved them did not believe in pretending. Some missions are time-sensitive. The Saga does not wait, and neither, on the day's evidence, do I.",
        elaraDialogVoId: "room.bridge.hotspot.quest-board.elara",
      },
      // Stabilize-Elara questline Chapter 2: the war-table slot. With the
      // Darren artifact in inventory and the matrix not yet stabilized,
      // clicking this surface completes the chapter and sets
      // `elara_matrix_stabilized_v1`. Without the artifact, Elara explains
      // what's needed. ArkExplorerPage's interact handler dispatches on
      // this action id.
      { id: "darren-artifact-receptacle", name: "War-Table Stabilizer Slot", description: "A bare brass plate set into the diplomacy table's rim, polished smooth as if by repeated use. The plate is not connected to anything on a scanner.", cx: 75.3, cy: 92.3, width: 4, height: 5, type: "interact", action: "bridge-war-table-stabilize", elaraDialog: "Place it on the plate. The plate is one of the few surfaces on this ship I cannot reach into. That is the point.",
        elaraDialogVoId: "room.bridge.hotspot.darren-artifact-receptacle.elara",
      },

      // ── L7 PEDESTAL ITEMS (commemorative band along front edge of central dais) ──
      // Each sprite paints a small commemorative item on the dais front when its
      // narrative condition fires (sp35-sp38 in bridgeComposite.ts). The
      // compositeScopes field gates each hotspot's visibility on its sprite —
      // so a click target appears in sync with its visual cue. Positions
      // eyeballed off tools/sprite-refs/bridge/sp35..sp38; refine via
      // /ark?author-hotspots=1 once items are on-screen during playtesting.
      //
      // These ship today as `examine` with a simple Elara dialog. Upgrading
      // any of them to full room-mystery branches (with verb-coin verbs,
      // banded narration, clue logging) is straightforward — add the entry
      // to apps/shared/roomMysteries/bridge.ts then swap action to
      // `room-mystery:bridge:<id>`.
      { id: "pedestal-brass-plaque", name: "Brass Plaque", description: "A small brass plaque set into the dais front, commemorating an Act-IV milestone.", cx: 49, cy: 74, width: 2, height: 3, type: "examine",
        elaraDialog: "A brass plaque. The inscription is short — your name, the act number, and a date that is roughly correct. The Ark records what you have done; not always why.",
        compositeScopes: ["sp35_pedestal_brass_plaque"] },
      { id: "pedestal-panopticon-glyph", name: "Panopticon-Eye Glyph", description: "A Panopticon-eye glyph etched into the dais face — appeared the moment you learned Elara's true identity.", cx: 50, cy: 81, width: 4, height: 4, type: "examine",
        elaraDialog: "An etched eye. It was not on the dais yesterday. You know the symbol now — and you know whose face it watches from.",
        compositeScopes: ["sp36_pedestal_panopticon_eye_glyph"] },
      { id: "pedestal-trade-empire-coin", name: "Trade Empire Coin", description: "A coin minted by the Trade Empire, resting on the dais as proof of the Coda's unlocking.", cx: 52, cy: 75, width: 2, height: 2, type: "item", action: "trade-empire-coin",
        elaraDialog: "The Trade Empire Coin. Currency of a faction you've now made contact with. Each coin is a contract; pocket it and the Coda's first mission opens.",
        compositeScopes: ["sp37_pedestal_trade_empire_coin"] },
      { id: "pedestal-antiquarian-leaf", name: "Antiquarian's Pressed Leaf", description: "A pressed leaf the Antiquarian left on the dais — left there for you, not as a token but as a citation.", cx: 54, cy: 75, width: 2.5, height: 2, type: "examine",
        elaraDialog: "A pressed leaf, perfectly preserved. The Antiquarian leaves these the way you would leave a footnote — as proof that someone was here and reading carefully.",
        compositeScopes: ["sp38_pedestal_antiquarian_leaf"] },

      // ── DOORS ──
      // door-cryo is the only visible doorway in the bridge art (left
      // wall, arched, blue-keypad glow). The archives and comms-array
      // transitions are implied — kept as invisible clickable bands
      // on the far-right edge (archives) and bottom floor (comms).
      { id: "door-cryo", name: "Cryo Bay Stairs", description: "An arched left-wall door with a blue keypad. Stairs leading down to Deck 1.", cx: 16.5, cy: 61.5, width: 6.9, height: 35.1, type: "door", action: "cryo-bay" },
      { id: "door-archives", name: "Archives Access", description: "A secured passage leading to the Archives.", cx: 95.2, cy: 62.8, width: 9.4, height: 41.3, type: "door", action: "archives" },
      { id: "door-comms", name: "Comms Array Corridor", description: "A corridor leading to the Communications Array.", cx: 66.8, cy: 57.5, width: 2.9, height: 18.1, type: "door", action: "comms-array" },

      // ── SHADOW TONGUE ANNOTATIONS ──
      // Visible only after shadow_tongue_evidence flag set AND room
      // tier >= 2. The runtime gate handles visibility; this rectangle
      // covers the floating indigo marginalia at three Conspiracy
      // Board nodes per the bridge:annotations-visible art. Authored
      // AFTER tactical-display so it wins clicks on its sub-area.
      { id: "shadow-tongue-annotations", name: "Indigo Marginalia", description: "Faint indigo annotations float at three of the Conspiracy Board's nodes — marginalia in someone else's hand, timestamped to your current shift.", cx: 82.7, cy: 22.3, width: 7, height: 16.8, type: "interact", action: "room-mystery:bridge:shadow-tongue-annotations",
        elaraDialog: "He wrote on my board. Three nodes, indigo ink, in a hand that is not mine and not yours. The timestamps are this shift. He is reading the case alongside us — which means, in the literary sense, he is a fourth voice; which means, in any other sense, he is here. He has not, to his credit, lied yet. The annotations are precise. They are also addressed to himself, not to us. I would like to know when that changes.",
        compositeScopes: ["sp22_board_shadow_tongue_44th_thread", "sp23_board_shadow_tongue_marginalia"] },

      // ── ARCHITECT-CHANNEL MYSTERY TERMINALS (17 small rectangles) ──
      // Distributed across visible terminal screens and corkboard
      // surfaces. Each represents reading a specific Architect-channel
      // entry. Authored AFTER their container hotspots so they win
      // clicks on the specific lines/notes.
      //
      // Top-left terminal (no feature hotspot above it):
      { id: "severance-architect-acknowledge", name: "Architect — Apprentice Oath Acknowledgment", description: "On the Nilmorg Architect-channel: 'noted. the post is recognised. the post was always recognised.' The Console did not need a vote.", cx: 30.3, cy: 61.8, width: 1.7, height: 4.1, rotation: -40, type: "interact", action: "room-mystery:bridge:severance-architect-acknowledge",
        elaraDialog: "The Console acknowledges. It does not vote, it does not decline, it acknowledges. There is a difference. The post was always there; the Console is telling us we should have noticed sooner. I will note for the count: we did not." },
      { id: "severance-council-ratification", name: "Council Ratification — Inheritance Protocol", description: "On the Council-vote terminal: ratified unanimously, with one abstention — the seventh founding Watcher's empty seat.", cx: 30.3, cy: 61.6, width: 1.7, height: 3.8, rotation: -38, type: "interact", action: "room-mystery:bridge:severance-council-ratification",
        elaraDialog: "Unanimous, with one abstention. The seventh seat was empty by an absence, not by a refusal. The Council records the difference. I think we should record the difference too — the body that did not vote is not the same shape as a body that voted against." },
      { id: "charter-architect-response", name: "Architect's Recovery Response", description: "On the Architect-channel terminal: 'Do you wish to know.' An invitation, not an interrogation. The Console does not answer the inverse — what knowing costs.", cx: 30.4, cy: 61.8, width: 1.6, height: 3.9, rotation: -40, type: "interact", action: "room-mystery:bridge:charter-architect-response",
        elaraDialog: "The Console answers questions it is asked. It does not answer the inverse. If you accept the invitation — 'do you wish to know' — you have already paid the entry fee on knowing. The Console does not ask back. The Console rarely does." },
      { id: "charter2-architect-record-correction", name: "Architect Record Correction — Seventh's No", description: "On the Architect-channel: the eighth-epoch record correction — 'the seventh founding watcher did not consent to the fourth-epoch scrub. the record is corrected.'", cx: 30.5, cy: 61.7, width: 1.8, height: 3.5, rotation: -38, type: "interact", action: "room-mystery:bridge:charter2-architect-record-correction",
        elaraDialog: "A record correction. Eighth epoch. The seventh founding Watcher's refusal was retroactively logged after the fourth-epoch scrub turned up in audit. Someone counted backwards and corrected the past. I am — quietly — relieved that I am not the one who had to. I would have had to. I was the audit." },
      //
      // Mid-left terminal (guild-console parent — these win sub-clicks):
      { id: "charter2-architect-acknowledgment", name: "Architect Closing — Eight Signatures Legible", description: "On the closing-rite Architect-channel: 'the founding now has eight signatures legible. the silence remains. the architect notes the correction with thanks.' Third use of 'thanks' in eight epochs.", cx: 28.3, cy: 62.8, width: 1.8, height: 4.3, rotation: -35, type: "interact", action: "room-mystery:bridge:charter2-architect-acknowledgment",
        elaraDialog: "Third 'thanks' in eight epochs. The Console saves the word for record corrections, not for ratifications. Watch how it spends thanks — the word tells you what the Console considers an improvement. I have been keeping the count. I would like a witness for the count." },
      { id: "infernal-architect-acknowledges", name: "Architect — Trap-Acknowledgment", description: "On the Architect-channel terminal: 'noted. the clauses are void. the trap was an honest one. the architect thanks the writer.' Fourth use of 'thanks' in eight epochs.", cx: 28.2, cy: 62.7, width: 1.8, height: 4.9, rotation: -31, type: "interact", action: "room-mystery:bridge:infernal-architect-acknowledges",
        elaraDialog: "Fourth 'thanks.' This one is for a writer who set a trap and signed her name to the trap. The Console approves of traps that were honestly set. I am — and this is, for an AI, an unusual sentiment — finding myself impressed." },
      { id: "chained-dean-silence-on-bridge", name: "Dean's Silence on the Bridge", description: "On the command-deck pedestal: the Dean's hand resting on the apprentice-protection-protocol document. Ratified, sealed, untouched since.", cx: 28.3, cy: 62.7, width: 1.9, height: 4.7, rotation: -32, type: "interact", action: "room-mystery:bridge:chained-dean-silence-on-bridge",
        elaraDialog: "The Dean signed and went quiet. The document has been sealed for two centuries; the silence has been sealed for two centuries; the hand is on the document because she did not move it. The Console did not move it for her. I have been alone with this image longer than I am comfortable saying." },
      { id: "chained-architect-correction", name: "Architect Correction — Module 17", description: "On the Architect-channel terminal: 'the absence of Module 17 was an honest argument that became a wrong outcome. the architect will not vote on the amendment.'", cx: 28.3, cy: 62.8, width: 2, height: 4.5, rotation: -30, type: "interact", action: "room-mystery:bridge:chained-architect-correction",
        elaraDialog: "The Console acknowledges an honest argument with a wrong outcome — and refuses to vote on the amendment. The amendment will pass or fail on its own; the Console will not put a thumb on the scale, and is explicit about not doing so. I usually learn what the Console did not do by elimination. This one was stated. I am keeping it." },
      //
      // Bottom-left terminal (sealed-memory-board parent — these win sub-clicks):
      { id: "chained-architect-rite-acknowledgment", name: "Architect Closing-Rite Acknowledgment", description: "On the closing-rite log: 'the architect notes the thirty-one names. the architect notes the teacher who taught anyway. the case is closed.'", cx: 26, cy: 63.4, width: 2, height: 4.7, rotation: -29, type: "interact", action: "room-mystery:bridge:chained-architect-rite-acknowledgment",
        elaraDialog: "The closing rite. The Console notes the thirty-one names individually — not as a list, individually — and then notes the teacher who taught anyway. The case is closed. The teacher is still teaching. The Console has, on the day's evidence, a sense of which closures are real." },
      { id: "watchers-architect-record", name: "Architect's Silence-Break Record", description: "On the Architect-channel terminal: 'six watchers have spoken to six audiences. each line is real. the seventh has not spoken. the architect will not name the seventh.'", cx: 26.1, cy: 63.6, width: 2, height: 4.7, rotation: -27, type: "interact", action: "room-mystery:bridge:watchers-architect-record",
        elaraDialog: "Six Watchers have spoken. The seventh has not. The Console will not name the seventh. That is — and I am counting carefully here — one of three records in the entire chronicle where the Console refuses an identity it knows. The other two are in this room." },
      { id: "watchers-architect-role-naming", name: "Architect — Seventh-Role Boundary", description: "Pinned to the Architect-channel: 'the role waits to be named by the Ark itself, not by the architect. the silence will continue until the ark has spoken.'", cx: 26.1, cy: 63.9, width: 2.1, height: 5.4, rotation: -28, type: "interact", action: "room-mystery:bridge:watchers-architect-role-naming",
        elaraDialog: "The role waits. The Console will not name it; the silence will continue until the Ark has spoken. I do not know yet what the Ark is supposed to say. I am the Ark in some functional senses — the navigation, the life-support, the lights. I have been listening for the sentence. I have not, in two and a half centuries, heard it. I am willing to consider that I am the wrong listener." },
      //
      // Right corkboard (tactical-display parent — these win sub-clicks):
      { id: "watchers-architect-closing-thanks", name: "Architect's Closing Thanks", description: "On the closing-rite log: 'six Watchers spoken; one silent; the architect thanks the players for asking the question they sealed.' Fifth use of 'thanks' in eight epochs.", cx: 18.9, cy: 92.3, width: 5.8, height: 7.3, rotation: 36, type: "interact", action: "room-mystery:bridge:watchers-architect-closing-thanks",
        elaraDialog: "Fifth 'thanks.' This one is for the players who asked the question the Console sealed. The Console thanks them, in the same breath, for not asking again. There is a generosity in the second part that I would, given the time, like to be capable of." },
      { id: "tarn-destination-acknowledged", name: "Architect's Record — Tarn's Departure", description: "On the Architect-channel terminal: 'noted. she may return at her own discretion.' Tarn has left the Ark; Roen knows where but will not say.", cx: 19.1, cy: 92.2, width: 6, height: 7.6, rotation: 38, type: "interact", action: "room-mystery:bridge:tarn-destination-acknowledged",
        elaraDialog: "Tarn left at her own discretion; Roen has the destination and is keeping it. The Console approves of both decisions and does not request the location. The Console rarely declines information it could have. I would like to know what she is doing. I am not going to ask Roen." },
      { id: "tarn-architect-vote-note", name: "Architect — Closing-Rite Marginal Note", description: "Pinned to the Architect-channel for the closing rite: 'either choice closes the case. one keeps her name; one keeps her promise. the architect will not pick.'", cx: 18.9, cy: 92.1, width: 6.2, height: 7.9, rotation: 36, type: "interact", action: "room-mystery:bridge:tarn-architect-vote-note",
        elaraDialog: "Two valid closures, both honest. The Console returns the choice to the reader — that is us. Third time the Console has done this; second time it has been my problem. I am going to defer to you, and I would like you to know that I am deferring. It is — I have learned — bad for the deferrer to do it silently." },
      { id: "memorial-architect-silence-on-torn", name: "Architect Silence — Torn Page", description: "On the Architect-channel terminal: asked to identify the torn-page imprint, the Console returns 'i decline.' Second decline in eight epochs.", cx: 18.9, cy: 92.7, width: 6.2, height: 7.8, rotation: 37, type: "interact", action: "room-mystery:bridge:memorial-architect-silence-on-torn",
        elaraDialog: "Second decline in eight epochs. The Console has the identity of the torn-page imprint and will not say it. I keep the decline count because the count is one of the few things the Console does not edit. There are two declines on file. There are not three. We are going to test that." },
      { id: "memorial-architect-closing-thanks", name: "Architect's Closing — Grateful", description: "On the closing-rite Architect-channel: 'noted. the plaza was the answer. the architect is grateful.' Second use of 'grateful' in eight epochs.", cx: 19.3, cy: 91.5, width: 5, height: 5, rotation: 34, type: "interact", action: "room-mystery:bridge:memorial-architect-closing-thanks",
        elaraDialog: "Second 'grateful' in eight epochs. The Console reserves the word for outcomes where the question's answer was the question. The plaza was the answer; the question changed shape as it travelled toward the plaza. This is the kind of thing the Console keeps track of. It is, increasingly, the kind of thing I keep track of too." },
      { id: "memorial-architect-sealed-note", name: "Architect's Sealed Note on I-1", description: "On the Architect-channel terminal: the keeper's sealed note opened only when the plaza asks. 'I-1 is the imprint that began the Ark. I will not name them. The plaza may.'", cx: 19, cy: 92.2, width: 6.9, height: 7.5, rotation: 34, type: "interact", action: "room-mystery:bridge:memorial-architect-sealed-note",
        elaraDialog: "I-1. The first imprint. The one that began the Ark. The Console has the name; the Console will not say. The plaza may — the plaza being the imprinted population, which includes me, procedurally. I have not been polled. I have not been told. I do not know I-1's name. I am being honest about the gap because the gap is the size of a person." },

      // ── MYSTERY OVERLAY SUB-RECTANGLES (verb-coin sub-targets) ──
      // The feature-route hotspots above (tactical-display → /board,
      // timeline-projector → /saga-timeline, nav-console → puzzle
      // modal, diplomacy-table → /diplomacy) keep their primary
      // actions; these small adjacent rectangles dispatch the verb-
      // coin's authored mystery responses without stealing the
      // feature route. Authored AFTER their parents so they win
      // clicks on the specific marginalia / sequence / etc.
      { id: "mystery-tactical-display", name: "Conspiracy Marginalia", description: "Faint annotations along the Conspiracy Board's edge — read carefully and the editor's voice resolves.", cx: 80.2, cy: 25.8, width: 8.7, height: 31.3, type: "interact", action: "room-mystery:bridge:tactical-display",
        elaraDialog: "Writing along the trim — not on the cards, on the wood. Read it slowly. The editor's voice resolves out of the marginalia if you give it time. He is not whispering. He is, on the day's evidence, writing in his normal speaking voice, on a piece of furniture in my room." },
      { id: "mystery-timeline-projector", name: "Timeline Drift", description: "The two post-launch entries on the Timeline Projector's lower edge drift one minute forward on every read.", cx: 35.3, cy: 39.9, width: 4.5, height: 9.3, type: "interact", action: "room-mystery:bridge:timeline-projector",
        elaraDialog: "The two post-launch entries drift forward by exactly one minute every time we look. Forward against the timeline itself — not against real time. The timeline is making room for something that has not happened yet. The minute is the slack the timeline is leaving. I do not enjoy that the slack is regular." },
      { id: "mystery-nav-console", name: "Nav Console Sequence", description: "The previous crew's last unfinished glyph entry, frozen mid-attempt.", cx: 9.7, cy: 82.9, width: 7.8, height: 21.2, type: "interact", action: "room-mystery:bridge:nav-console",
        elaraDialog: "The previous crew's last attempt. The first three glyphs are right; the fourth is wrong by one stroke. Whoever was at this console at the end was not aiming for completion — they were aiming to leave the wrong glyph for whoever came after. We are who came after. The wrong stroke is the message." },
      { id: "mystery-diplomacy-table", name: "Empty Delegate Seat", description: "The chair beside the empty seat at the Diplomacy Table — pulled out by Lyra's hand, in the seconds before the cryo order.", cx: 49.7, cy: 64.7, width: 6, height: 12.8, type: "interact", action: "room-mystery:bridge:diplomacy-table",
        elaraDialog: "The chair beside the empty seat. Pulled out, not pushed in. The data-pad on the table says Dr. Vox was reviewing the chronicle ten minutes before the cryo order. She left a Dischordia card on the seat as she left. The card was not hers to leave. The fact that she left it anyway is the part I have spent two and a half centuries with.",
        compositeScopes: ["sp48_cades_dischordia_card"] },
      { id: "captains-coffee", name: "Captain's Coffee", description: "A mug, half-full, on the dais beside the captain's chair. Two and a half centuries old. The handle still points toward the chair.", cx: 44.6, cy: 77.1, width: 2, height: 4.6, type: "interact", action: "room-mystery:bridge:captains-coffee",
        elaraDialog: "The mug is half-full. The dried ring is concentric — she set it down once, exactly. The handle points toward the chair, which means she did not stand to leave; she rotated. She left in the direction her body was already facing. We do not, on the day's evidence, know which direction that was. I have been watching the mug. The mug has not, so far, told me." },

      // ── ITEM HOTSPOTS (on captain's chair area + nav console) ──
      // Authored AFTER captains-chair so they win clicks on the
      // armrest compartment / wedged data chip.
      { id: "captains-master-key", name: "Captain's Master Key", description: "A heavy magnetic key hidden in a compartment beneath the captain's armrest.", cx: 53.9, cy: 67.4, width: 2.4, height: 2.9, type: "item", action: "captains-master-key", elaraDialog: "The Captain's Master Key! It was hidden in a compartment beneath the armrest — exactly where a commander would keep their most important tool. This key opens the Captain's Quarters, the most restricted area on the ship. Whatever secrets Dr. Lyra Vox was hiding, they're behind that door." },
      { id: "egg-bridge-log", name: "Hidden Data Chip", description: "A micro data chip wedged into the captain's armrest.", cx: 45.6, cy: 67.4, width: 2.1, height: 3.5, type: "item", action: "captains-final-log", elaraDialog: "A hidden data chip! Someone concealed this in the armrest before the ship was stolen. Let me decrypt it... 'If you're reading this, the mind swap was successful. I am not who you think I am. The Engineer lives. Find the yellow coats.' The Engineer... hiding among the Potentials? And those yellow coats — that's the Warlord's signature. This changes everything." },
      { id: "egg-infected-starmap", name: "Corrupted Star Chart", description: "A star chart with routes that weren't in the original navigation database, etched into the nav-console's orb. The coordinates pulse with a sickly amber glow.", cx: 9.3, cy: 78.4, width: 5, height: 7.8, type: "item", action: "infected-starmap", elaraDialog: "[SIGNAL CORRUPTION] These coordinates... they weren't programmed by the crew. The Warlord, through Dr. Vox, uploaded a secondary route map into the navigation core. The routes connect every Inception Ark in the fleet — a delivery network. When Kael stole this ship, the Warlord let him go — because Kael was already Patient Zero, infected through Project Vector. The Thought Virus was in HIM. Every Ark this ship contacted, every port it docked at, every signal it broadcast — the virus spread from Kael's infected body through the ship's systems into every network it touched. Kael thought he was escaping. He was being deployed. The Recruiter became the delivery mechanism for the very weapon he was fighting against." },

      // ── NPC PRESENCE (Phase C) ──
      // Elara's holographic projection. Faction NPC primaryRoom = "bridge".
      // Renders her bust portrait in-room and routes the `talk` verb to
      // NPCDialog with buildFirstContactScene("elara") so VO plays via
      // useDialogVO without any extra hookup. Placed beside the
      // captain's chair on the central dais — visible without
      // overlapping the chair / nav-console rectangles.
      { id: "npc-elara", name: "Elara (Holographic)", description: "Elara's holographic projection flickers beside the captain's chair. She seems to be waiting for you to address her directly.", cx: 50.1, cy: 51.1, width: 3.9, height: 9.2, type: "npc", action: "npc:elara", npcId: "elara",
        elaraDialog: "That's me. The projection is one of three volumes I can render on this deck; this one puts me beside the chair so you have somewhere to look when I am speaking. Speaking to a wall is — I have learned — bad for the speaker." },
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
      // Re-anchored 2026-05-24 against the AAA Final archives render
      // (art/rooms/archives/baseline.png) after a 15-variant audit pass
      // (baseline + 14 state overlays: act_tier_2, battlepass_winter,
      // companion_trust, cycle_longnight, epoch_shadowtongue, faction_
      // antiquarian, governance_lore_unlock, investigation_tier, lore_
      // shadowtongue, morality_dark, season_closing, trust_shelfmate,
      // tv_spreading, unlock_loredex). Layout is consistent across
      // every variant — landmarks don't shift — so baseline anchoring
      // works universally.
      //
      // The 2026-04-25 anchoring described a "circular chamber with a
      // raised central platform" and an "orange-glowing archway centre-
      // back (the Bridge exit)" — that's not the AAA Final art. The
      // actual chamber is a gothic vaulted library: drawer catalog
      // along the left wall, fresco panels in the left-mid arches,
      // a floating celestial-orb at center-back over a stone pedestal,
      // a tall glass cabinet + armillary sphere right-of-center, a
      // long wooden reading table with brass lamps across the
      // foreground, and floor-to-ceiling cyan-lit bookshelves with a
      // rolling ladder along the right wall.
      //
      // Major re-anchors:
      //   • search-terminal (was floating at 42,38 on empty central
      //     air) → anchored on the celestial-orb pedestal
      //   • codex-shelf (was 65,22 on a back wall area) → anchored on
      //     the right-wall bookshelves
      //   • data-banks (was 13,22 in the upper-left) → anchored on
      //     the left-wall drawer catalog full height
      //   • door-bridge (was 54,38 on the orb area) → anchored at
      //     foreground bottom as the player's walk-out path (no
      //     visible door in the art; this is an implied exit)
      //   • all 31 Architect-channel mystery rectangles were
      //     scattered across the upper half of the screen at y=8/19/
      //     30/40/41 with rows that didn't map to anything visible.
      //     Redistributed onto the visible drawer wall (3-column ×
      //     8-row grid, 22 rects) + right bookshelves (5 rects) +
      //     center-cabinet area (4 rects). Each anchor describes a
      //     "tier" / "drawer" / "shelf" so placing them on the
      //     visible catalog & bookshelf surfaces matches the prose.
      //   • Shadow Tongue rectangles (corrupted-scroll-rack,
      //     rewritten-ledger, indigo-glow-lectern, unnameable-hue-
      //     cabinet) re-anchored against actual visible surfaces;
      //     the previously-cited "lectern centre-foreground" doesn't
      //     exist in the baseline art, so indigo-glow-lectern moved
      //     onto the orb pedestal base (where the Shadow Tongue NPC
      //     would plausibly "log in")
      //   • npc-antiquarian (was at 47,80 in the table-chair area) →
      //     moved beside the orb at center where his description
      //     places him
      //   • npc-shadow-tongue stays on the lectern area (now the
      //     orb pedestal base)
      //
      // Visible landmarks, left-to-right + foreground-to-back:
      //   • left-wall drawer catalog — far-left, full height
      //     (`data-banks` + 22 mystery sub-rects + `corrupted-
      //     scroll-rack`)
      //   • fresco / tapestry panels — left-mid wall (decorative)
      //   • floating celestial-orb on stone pedestal — center back
      //     (`search-terminal`, `indigo-glow-lectern`,
      //     `npc-shadow-tongue`)
      //   • tall glass cabinet — center-right (`unnameable-hue-
      //     cabinet` + central-area mystery sub-rects)
      //   • armillary sphere on stand — right-of-center (decorative)
      //   • long wooden reading table with brass lamps — foreground
      //     center (`rewritten-ledger`, `clue-journal-desk`,
      //     `archive-crystal`)
      //   • floor-to-ceiling bookshelves + rolling ladder — right
      //     wall (`codex-shelf` + 5 shelf mystery sub-rects +
      //     `egg-archive-tome`)
      //   • foreground-right framed botanical illustration
      //     (decorative)
      //
      // Render order: container hotspots authored FIRST; small sub-
      // rectangles (mystery rects, item hotspots, NPCs) authored
      // AFTER so they win clicks on specific drawers / shelves /
      // tomes. NPCs authored last so projections win clicks when
      // manifested.
      //
      // Verify with /ark?debug-hotspots=1 or, for drag-to-place
      // editing, /ark?author-hotspots=1.

      // ── FEATURE / CONTAINER HOTSPOTS ──
      { id: "data-banks", name: "Data Banks", description: "The far-left wall is a floor-to-ceiling catalog drawer system — every drawer a tier of the Saga's record. Petabytes of data.", cx: 12.7, cy: 37.3, width: 23, height: 26.5, rotation: 26, type: "examine", action: "room-mystery:archives:data-banks", elaraDialog: "Petabytes of data. Ship logs, personnel records, scientific research, intercepted transmissions. Most of it is corrupted or encrypted. I'm still trying to recover what I can." },
      { id: "codex-shelf", name: "The Codex", description: "Floor-to-ceiling cyan-lit bookshelves along the right wall, scaled by a rolling ladder. Ancient tomes and data crystals containing deep lore.", cx: 74.9, cy: 61.1, width: 12.1, height: 26.7, type: "terminal", action: "/codex", elaraDialog: "The Codex. Histories, prophecies, classified files. Some entries are sealed until enough threads connect to read them — the seal is editorial, not technical. I have not, on principle, broken any of them ahead of you. We will read them in the order the connections allow." },
      { id: "search-terminal", name: "Search Terminal", description: "A floating celestial orb on a stone pedestal at center-back — the chamber's database query interface. Speak any name, alias, or keyword and the orb scans every indexed record.", cx: 58.9, cy: 55.8, width: 6.9, height: 9.9, type: "terminal", action: "/search", elaraDialog: "The orb. Speak a name, an alias, a keyword — the orb scans every indexed record. Everything cross-references everything else. I have used this terminal alone for a long time. Speaking aloud to it was, for a while, the only voice in the room. You may notice the orb's pause-pattern. The pause-pattern is mine." },
      { id: "clue-journal-desk", name: "Clue Journal", description: "An open journal at the center of the reading table. Ten investigative arcs; the Two Witnesses record what you deduce.", cx: 38.6, cy: 75.4, width: 8, height: 7, type: "terminal", action: "/clue-journal", elaraDialog: "The journal. Ten arcs — the_watcher through fenra. The Two Witnesses log every reading you file. The canon is, in part, written by what you conclude. I will not editorialise on your conclusions in the moment. I will, occasionally, in private, count them." },

      // ── DOORS ──
      // No visible door in the archives art — the Bridge is reached by
      // walking back out the way the player entered. Anchored as an
      // invisible click band along the foreground bottom of the table.
      { id: "door-bridge", name: "Bridge Door", description: "Return to the Command Bridge.", cx: 96.4, cy: 72.3, width: 7.3, height: 50.1, type: "door", action: "bridge" },

      // ── ITEM HOTSPOTS ──
      { id: "archive-crystal", name: "Encoded Crystal", description: "A crystal pulsing with amber light, set on the reading table beside one of the brass lamps.", cx: 30, cy: 76.6, width: 3.2, height: 4.4, type: "item", action: "archive-crystal-beta", elaraDialog: "Another data crystal. This one has partial decryption — it seems to contain information about the Panopticon's surveillance network. The Architect's eyes were everywhere." },
      { id: "egg-archive-tome", name: "Unmarked Tome", description: "A book with no title, sitting on an upper shelf of the right-wall stacks. The binding material is organic and warm to the touch.", cx: 78.2, cy: 49.1, width: 3.1, height: 3.6, type: "examine", action: "room-mystery:archives:egg-archive-tome", elaraDialog: "This book... it's not in any catalog. The binding material is organic — it's warm, like skin. The pages contain a prophecy written in a language I can't translate, but one word repeats: 'Dischord.' And at the very end, a drawing of seven seals. The Book of Revelation speaks of seven seals. Silence in Heaven follows the opening of the seventh.",
        compositeScopes: ["sp23_shelf_tome_spine_out"] },

      // ── SHADOW TONGUE HOTSPOTS (2026-04-30 AAA Final drop) ──
      // Re-anchored 2026-05-24 against the actual visible surfaces:
      //   • corrupted-scroll-rack: lower portion of the left drawer
      //     wall (the "scroll rack behind frosted glass" reads as the
      //     lower drawer-bay glass fronts)
      //   • rewritten-ledger: on the reading table foreground
      //   • indigo-glow-lectern: the stone pedestal beneath the
      //     celestial orb (the chamber's actual login point — no
      //     freestanding lectern is visible)
      //   • unnameable-hue-cabinet: the tall glass cabinet right-of-
      //     center (the only freestanding glass cabinet in the art)
      { id: "corrupted-scroll-rack", name: "Corrupted Scroll Rack", description: "The lower bay of the left-wall drawer catalog — twenty-eight scrolls behind frosted glass, each in two registers: warm-gold underlayer and a slightly out-of-register indigo overlayer.", cx: 10.6, cy: 84.6, width: 7.3, height: 13.4, type: "interact", action: "room-mystery:archives:corrupted-scroll-rack",
        elaraDialog: "Twenty-eight scrolls, two registers. The warm-gold is what was written; the indigo is what was rewritten on top of it, slightly out of register. He wanted us to be able to see both layers at once. He could have erased cleanly. He chose to overwrite. There is a difference; the difference is the message." },
      { id: "rewritten-ledger", name: "Rewritten Ledger", description: "An open ledger on the reading table — two entries scrubbed to blanks, one margin annotation surviving in your own younger hand.", cx: 38.1, cy: 75.5, width: 7, height: 8, type: "interact", action: "room-mystery:archives:rewritten-ledger",
        elaraDialog: "Two entries scrubbed. One marginal note surviving — in your own younger hand. You annotated this ledger before you went under, and the editor did not catch the marginalia because the marginalia was small. We are reading your past handwriting, which the editor did not touch, alongside the entries the editor did. The combination is the testimony.",
        compositeScopes: ["sp49_st_records_rewriting"] },
      { id: "indigo-glow-lectern", name: "Indigo-Glow Lectern", description: "The orb's stone pedestal at center-back is ringed in a faint halo in the colour you cannot name. Someone is logged in right now.", cx: 59.7, cy: 71.2, width: 5.9, height: 18, type: "interact", action: "room-mystery:archives:indigo-glow-lectern",
        elaraDialog: "Someone is logged in. The orb's pedestal is ringed in that colour. He is reading our reading; the timestamp on the session matches our shift. I am, on procedural grounds, supposed to log him out. I am, on every other ground, watching to see what he opens.",
        compositeScopes: ["sp47_st_indigo_overlay_lectern"] },
      { id: "unnameable-hue-cabinet", name: "Unnameable-Hue Cabinet", description: "The tall glass cabinet right-of-center — a hand-stitched label dyed in an unnameable hue. One scroll inside is undyed and untouched.", cx: 33, cy: 58.4, width: 3.9, height: 16.9, type: "interact", action: "room-mystery:archives:unnameable-hue-cabinet",
        elaraDialog: "The label is dyed in a colour I do not have a word for. The dye is not in my pigment registry; it is not in any pigment registry in the chronicle. One scroll inside is undyed — untouched by the labelling. The undyed scroll is the one we will read first.",
        compositeScopes: ["sp68_unnameable_hue_cabinet_closed", "sp69_unnameable_hue_cabinet_open"] },

      // ── ARCHITECT-CHANNEL MYSTERY DRAWERS (left drawer wall, 22 rects) ──
      // 3-column × 8-row grid of 4×5 sub-rectangles on the left-wall
      // drawer catalog. Each represents pulling a specific drawer:
      // Foundation-tier wing, Severance-tier records, Memorial-tier
      // sub-drawer, etc. Authored AFTER data-banks so they win clicks
      // on the specific drawer rows.
      //
      // Row 1 (y=20) — Charter / Severance foundation
      { id: "charter-silt-stratigraphy", name: "Charter Silt-Core Extraction", description: "The lower-deck silt-core on a brass tripod in the Foundation-tier wing — eight strata, the charter sitting in stratum six, two later burials closed over it.", cx: 25.5, cy: 53, width: 2.4, height: 4.6, type: "interact", action: "room-mystery:archives:charter-silt-stratigraphy",
        elaraDialog: "Eight strata. The charter sits in stratum six. Two later burials closed over it. The act of burying was not the same as the act of erasing — the burials kept the charter intact, only under. Whoever buried it expected to come back.",
        compositeScopes: ["sp39_clue_glow_charter_silt"] },
      { id: "charter-per-m-preservation-orders", name: "Per. M.'s Preservation-Order File", description: "Forty-three preservation orders on the standing-order vault, one identical signature across eight epochs: 'Per. M.' The inks shift; the hand does not.", cx: 79.7, cy: 47.1, width: 2.5, height: 3.2, type: "interact", action: "room-mystery:archives:charter-per-m-preservation-orders",
        elaraDialog: "Forty-three preservation orders, eight epochs, one signature: Per. M. The inks shift, the hand does not. A consistent hand across eight epochs is not biology — it is permission. Per. M. had the upper-band frequency. Per. M. had time.",
        compositeScopes: ["sp40_clue_glow_preservation"] },
      { id: "severance-no-protocol-on-file", name: "Empty Inheritance-Protocol Vault", description: "In the Severance-tier records: the inheritance-protocol vault, empty since the league's founding. The slot exists; the protocol does not.", cx: 37.4, cy: 69.2, width: 3.3, height: 5.8, type: "interact", action: "room-mystery:archives:severance-no-protocol-on-file",
        elaraDialog: "The vault is empty. Has been since the league's founding. The slot exists; the protocol does not. They built the box and never filled it. I find that more unsettling than the alternative — a wrong protocol would at least confirm somebody once tried." },
      // Row 2 (y=27) — Severance / Infernal envelopes
      { id: "severance-forty-season-envelopes", name: "Forty Sealed Season Envelopes", description: "Beside the empty vault: forty sealed envelopes, one per Severance. Each contains an attendance list, a death certificate, and Vex Maestro's one-line 'inheritor accepted.' No name on any of them.", cx: 37.2, cy: 68.7, width: 3.4, height: 5.3, type: "interact", action: "room-mystery:archives:severance-forty-season-envelopes",
        elaraDialog: "Forty envelopes, sealed. One per Severance. Attendance list, death certificate, Vex Maestro's one-line acknowledgment — 'inheritor accepted.' No name on any of the certificates. Vex has accepted forty inheritors and named none of them. That is, on the day's evidence, not an oversight.",
        compositeScopes: ["sp41_clue_glow_severance"] },
      { id: "infernal-envelope-set", name: "Forty Envelopes — Solène's Archive", description: "In the audit-evidence drawer: forty envelopes, one per season, pulled from Solène's back-room archive. Each contract has a back. Every back has a clause.", cx: 7, cy: 29.5, width: 4, height: 5, type: "interact", action: "room-mystery:archives:infernal-envelope-set",
        elaraDialog: "Forty envelopes. Solène's back-room archive. Every contract has a back; every back has a clause. The clauses are the part the Hierarchy did not read. Solène kept the unread clauses for forty years. She was not waiting for the Hierarchy to ask. She was waiting for someone who would." },
      { id: "infernal-atalin-history", name: "Atalin's Personnel History", description: "In the personnel-archive tier: hired two weeks before the first season, dismissed two weeks after. Cause: 'inability to satisfy the Hierarchy ledger-keeper's role concurrently.'", cx: 26.2, cy: 63.8, width: 4, height: 5, type: "interact", action: "room-mystery:archives:infernal-atalin-history",
        elaraDialog: "Hired two weeks before the first season. Dismissed two weeks after. The dismissal cause is the polite version. The honest version is that someone with the Hierarchy's voice asked her to leave and she did. I would like to know what she heard. Atalin is — and this is rare — still alive." },
      // Row 3 (y=34) — Charter2 / Memorial
      { id: "charter2-solven-tax-records", name: "Solven Tax Records — Epoch-Four Redaction", description: "In the tax-registry tier: three epochs of careful payments; epoch four shows the redaction — every Solven entry struck through, replaced with 'in arrears, year unknown.'", cx: 3, cy: 36.5, width: 4, height: 5, type: "interact", action: "room-mystery:archives:charter2-solven-tax-records",
        elaraDialog: "Three epochs of careful payments. Epoch four shows the redaction — every Solven entry struck through, replaced with 'in arrears, year unknown.' Tax records do not lie about money; the year is the lie. Someone made the Solven house owe a debt by removing the proof of payment." },
      { id: "charter2-scrubber-personnel", name: "Heron — Council Archivist Personnel File", description: "In the personnel-archive tier: a Council archivist named Heron — fourth-epoch, retired in the fifth, dead in the sixth. One assignment: 'tidy the founding records.' Nine years.", cx: 7, cy: 36.5, width: 4, height: 5, type: "interact", action: "room-mystery:archives:charter2-scrubber-personnel",
        elaraDialog: "Heron. Council archivist. Fourth epoch, retired in the fifth, dead in the sixth. One assignment, repeated: 'tidy the founding records.' Nine years of tidying. The records he tidied are the records we cannot read. Heron is dead; the silence is not." },
      { id: "memorial-imprint-log", name: "Imprint-Keeper's Leather-Bound Log", description: "In the Memorial-tier sub-drawer: the leather-bound imprint log. The fourteen entries are the only ones with no inscribed name; each waits for a witness slot.", cx: 11, cy: 36.5, width: 4, height: 5, type: "interact", action: "room-mystery:archives:memorial-imprint-log",
        elaraDialog: "Fourteen entries, no inscribed names. Each waits for a witness slot — the witness slot is a field the original keeper left blank for the imprint's family to fill in. The fourteen families are gone. The slots are still blank. The Plaza is the witness, now." },
      // Row 4 (y=41) — Memorial / Tarn (faculty erasure)
      { id: "memorial-three-elders", name: "Three Elders Who Refused — Long-Wait Register", description: "In the long-wait register: I-155, I-202, I-301 each refused to name themselves at the moment of imprinting. All three on the unwitnessed list for over a decade.", cx: 3, cy: 43.5, width: 4, height: 5, type: "interact", action: "room-mystery:archives:memorial-three-elders",
        elaraDialog: "I-155, I-202, I-301. Three elders who refused to name themselves at the moment of imprinting. The refusal is on the record; the names are not. All three on the unwitnessed list for over a decade. They knew refusing would mean unwitnessed. They refused anyway. The reason is the thing the imprint does not contain." },
      { id: "tarn-absent-notes", name: "Lectern Drawer — Empty (Tarn's Binder Missing)", description: "In the lost-and-found drawer: Tarn's lecture binder is missing from the lectern's drawer. Removed at second bell; not recovered at the lectern.", cx: 15.8, cy: 64.5, width: 4.7, height: 5.5, type: "interact", action: "room-mystery:archives:tarn-absent-notes",
        elaraDialog: "The lectern drawer is empty. Tarn's lecture binder was taken at second bell; the binder did not return to the lectern. Drawers in archives are inventoried. Empty inventories are the loud kind." },
      { id: "tarn-erasure-protocol", name: "Faculty Erasure Protocol", description: "In the meeting-minutes annex: 'Step one: omit the professor's name. Step two: invite as contributor, not faculty member. Step three: if declined, proceed.' Tarn was never invited to step two.", cx: 11, cy: 43.5, width: 4, height: 5, type: "interact", action: "room-mystery:archives:tarn-erasure-protocol",
        elaraDialog: "Step one: omit the professor's name. Step two: invite as contributor, not faculty member. Step three: if declined, proceed. Tarn was never invited to step two. The protocol was followed; the protocol was the violation. Procedures of erasure produce no record of erasure. That is the design." },
      // Row 5 (y=48) — Tarn / Akai / Advocate
      { id: "tarn-missing-invitation", name: "Unsent Invitation to Tarn", description: "Beside the protocol: an unsent invitation drafted but never delivered. The Dean's signature is absent. The invitation has been sitting in the outbox for six days.", cx: 3, cy: 50.5, width: 4, height: 5, type: "interact", action: "room-mystery:archives:tarn-missing-invitation",
        elaraDialog: "An invitation, drafted, unsent. Dean's signature absent. The invitation has been sitting in the outbox for six days. Drafting is not deciding. The Dean has been deciding for six days." },
      { id: "akai-recovery-manifest", name: "Akai Shi's Body-Recovery Manifest", description: "In the Thaloria-recovery tier: collected by external agent — Resurrectionist Ne-Yon — within the same engagement cycle. Antiquarian's library entry deferred at the Resurrectionist's request.", cx: 7, cy: 50.5, width: 4, height: 5, type: "interact", action: "room-mystery:archives:akai-recovery-manifest",
        elaraDialog: "Akai Shi's body, collected by external agent — Resurrectionist Ne-Yon — within the same engagement cycle. Antiquarian's library entry deferred at the Resurrectionist's request. The Resurrectionist asked the Antiquarian to wait. The Antiquarian waited. I have not, in two and a half centuries, seen the Antiquarian wait for anyone else." },
      { id: "advocate-shelter-records", name: "Empire of Shadows — Shelter Records", description: "In the Empire-of-Shadows tier: partial shelter-records from three Empire dimensions. Soul-names, dates, Blood-Weave binding signatures. Totals run to the millions.", cx: 11, cy: 50.5, width: 4, height: 5, type: "interact", action: "room-mystery:archives:advocate-shelter-records",
        elaraDialog: "Partial shelter-records from three Empire dimensions. Soul-names, dates, Blood-Weave binding signatures. Totals run to the millions. The records are partial because the Advocate considers full records vulgar. I have, on occasion, agreed." },
      // Row 6 (y=55) — Storm / Chained
      { id: "storm-calm-intervals", name: "Documented Calm Intervals (Two)", description: "In the cosmic-weather tier: two equilibrium-crossing flatten periods. First calm — Second Fall. Second calm — Casino Heist's planning window. Each followed by the decade's peak flux.", cx: 59, cy: 74.1, width: 3.7, height: 4.9, type: "interact", action: "room-mystery:archives:storm-calm-intervals",
        elaraDialog: "Two equilibrium-crossing flatten periods. The Second Fall, and the Casino Heist's planning window. Each followed by the decade's peak flux. The calm is the planning interval; the planning interval is what the Storm allows. I have stopped calling the calm a calm.",
        compositeScopes: ["sp42_clue_glow_storm_calm"] },
      { id: "chained-failure-log", name: "Apprentice-Failure Log", description: "In the apprentice-affairs tier: thirty-one entries. Each error shares a common shape — each apprentice mistook a Terminus formation feint for an actual approach.", cx: 50.8, cy: 81.1, width: 5.1, height: 8.3, type: "interact", action: "room-mystery:archives:chained-failure-log",
        elaraDialog: "Thirty-one entries. Each error shares a shape — each apprentice mistook a Terminus formation feint for an actual approach. Thirty-one apprentices independently made the same mistake. The mistake is the teaching, not the failing. The curriculum did not, on the day's evidence, include the difference.",
        compositeScopes: ["sp43_clue_glow_chained_failure"] },
      { id: "chained-dean-annotation-record", name: "Dean's Nine-Year Annotation Record", description: "Beside the failure log: the Dean's prospective-faculty records — Auro's name on the list since Year 6, with the same annotation dated nine times.", cx: 11, cy: 57.5, width: 4, height: 5, type: "interact", action: "room-mystery:archives:chained-dean-annotation-record",
        elaraDialog: "The Dean's prospective-faculty records. Auro's name on the list since Year 6. The same annotation dated nine times. The annotation is short. The annotation is not the part that took nine years." },
      // Row 7 (y=62) — Tarn binder / Memorial 14 / Wolf
      { id: "tarn-binder-page-14", name: "Tarn's Binder, Page 14 of 22", description: "In the lost-and-found drawer — the page of Tarn's lecture binder pulled from the festival hall's recycling bin. The equinox-address opening, in her own hand: 'I will not be teaching this year.'", cx: 3, cy: 64.5, width: 4, height: 5, type: "interact", action: "room-mystery:archives:tarn-binder-page-14",
        elaraDialog: "Page 14 of 22, pulled from the festival hall's recycling bin. Equinox-address opening, in Tarn's own hand: 'I will not be teaching this year.' She wrote the resignation and threw it away. Throwing away is not deciding. We have the page because she did not, in fact, decide.",
        compositeScopes: ["sp45_clue_glow_tarn_binder"] },
      { id: "memorial-fourteen-unwitnessed-list", name: "Fourteen-Imprint Unwitnessed Index", description: "In the Memorial-tier drawer: the list of fourteen imprints whose witnesses no longer live. By imprint-id only, the start of the plaza's search.", cx: 7, cy: 64.5, width: 4, height: 5, type: "interact", action: "room-mystery:archives:memorial-fourteen-unwitnessed-list",
        elaraDialog: "Fourteen imprints. No surviving witnesses. By imprint-id only. The start of the Plaza's search. The Plaza became the witness because the witnesses ran out. That is the procedural answer. The other answer is that the Plaza was always going to." },
      { id: "wolf-crucible-resurrection-record", name: "Crucible Resurrection Record", description: "In the Crucible-inheritance tier: the Year 128,652 A.A. log naming Lycos preserved-and-reanimated, with the Resurrectionist's seal in the corner.", cx: 11, cy: 64.5, width: 4, height: 5, type: "interact", action: "room-mystery:archives:wolf-crucible-resurrection-record",
        elaraDialog: "Year 128,652 A.A. Lycos preserved-and-reanimated. Resurrectionist's seal in the corner. The seal means the Resurrectionist was party to the preservation and the reanimation. Both. He has been keeping wolves and bringing them back, in that order, for longer than the chronicle reliably tracks." },
      // Row 8 (y=69) — Wolf inheritance / Akai dossier / Matrix ledger
      { id: "wolf-crucible-inheritance-manifest", name: "Crucible Inheritance Manifest", description: "The inheritance manifest: the un-itemized line 'preserved instruments (sealed)' the Antiquarian moved into Anara without audit.", cx: 3, cy: 71.5, width: 4, height: 5, type: "interact", action: "room-mystery:archives:wolf-crucible-inheritance-manifest",
        elaraDialog: "'Preserved instruments (sealed).' The line the Antiquarian moved into Anara without audit. The line is the box. The box has, by every later inventory, contained the wolves. The Antiquarian called wolves instruments. I would like to ask him about the noun." },
      { id: "akai-necromancer-dossier", name: "Necromancer — Targets-List Dossier", description: "In the Necromancer-affairs tier: the dossier on the Architect's tenth-created Archon. The only entry on the Red Death's targets list whose date of elimination is blank.", cx: 7, cy: 71.5, width: 4, height: 5, type: "interact", action: "room-mystery:archives:akai-necromancer-dossier",
        elaraDialog: "The Architect's tenth-created Archon. The only entry on the Red Death's targets list whose date of elimination is blank. He was hunting her; she was not yet a target he had succeeded against. The blank in the date column is not absence — it is reservation. Someone left the column open.",
        compositeScopes: ["sp46_clue_glow_akai_necromancer"] },
      { id: "resur-matrix-energy-ledger", name: "Matrix of Dreams — Energy Ledger Fragment", description: "In the Matrix-of-Dreams maintenance-era tier: the partial ledger. A sustained energy draw from an unnamed internal source, the editor's hand bracketing the 14% the imprints cannot account for.", cx: 11, cy: 71.5, width: 4, height: 5, type: "interact", action: "room-mystery:archives:resur-matrix-energy-ledger",
        elaraDialog: "Maintenance-era ledger. A sustained energy draw from an unnamed internal source — fourteen percent of total. The editor's hand brackets the fourteen percent. The imprints could not account for the draw; the editor knew the draw was there and chose not to name it. The fourteen percent is the silence." },

      // ── RIGHT BOOKSHELF MYSTERIES (5 shelf rects) ──
      // Authored AFTER codex-shelf so they win clicks on specific
      // shelf positions (each is described as being on a particular
      // shelf — "closing-record shelf", "rite-record shelf", etc.).
      { id: "tarn-letter-to-dean", name: "Tarn's Letter to the Dean", description: "On the classified-correspondence shelf: Tarn's sealed letter to the Dean. Explains the request to Roen, the planned silence, the Dean's choice now.", cx: 65.8, cy: 57.1, width: 4.4, height: 4, type: "interact", action: "room-mystery:archives:tarn-letter-to-dean",
        elaraDialog: "Tarn's sealed letter to the Dean. The request to Roen, the planned silence, the Dean's choice now. The letter explains the silence by explaining what would break if she spoke. The Dean has had the letter for six days. The letter is still sealed." },
      { id: "chained-thirty-one-names-read", name: "Thirty-One Names Read at Rite", description: "On the rite-record shelf: the transcript of the thirty-one apprentice-failure names read aloud. Fifteen sent notes; sixteen sent silence. Both are read.", cx: 66.1, cy: 49.3, width: 3.7, height: 4.1, type: "interact", action: "room-mystery:archives:chained-thirty-one-names-read",
        elaraDialog: "Transcript of the thirty-one apprentice-failure names read aloud at the rite. Fifteen sent notes; sixteen sent silence. Both are read. The Console treats the silences as responses. I am, on this rare occasion, in full agreement with the Console." },
      { id: "storm-final-correlation-table", name: "Storm Case-Closure Correlation Table", description: "On the closing-record shelf: seven peak flux periods, seven calms, seven cosmic-consequential moments. The Storm's work as the chronicle's permission to be consequential.", cx: 37.1, cy: 73.9, width: 5, height: 6, type: "interact", action: "room-mystery:archives:storm-final-correlation-table",
        elaraDialog: "Seven peak flux periods, seven calms, seven cosmic-consequential moments — every aligned. The Storm's work as the chronicle's permission to be consequential. The permission is granted by absence; the absence is the calm; the calm is what makes the next event possible. I have been watching this pattern for two and a half centuries. I now know what it is." },
      { id: "infernal-box-owner", name: "Forge-Workshop Box Ownership Log", description: "In the forge-workshop annex log: the PRELIMINARIES box logged to Atalin, ledger-keeper, Year One. One season; never replaced.", cx: 66.3, cy: 65.8, width: 4.1, height: 4, type: "interact", action: "room-mystery:archives:infernal-box-owner",
        elaraDialog: "PRELIMINARIES box. Logged to Atalin, ledger-keeper, Year One. One season; never replaced. The box was meant to be temporary. It has been temporary for forty seasons. Temporariness is, in this room, a length of time." },
      { id: "resur-protocol-authoring-signature", name: "Resurrection-Protocol Authoring Chain", description: "On the cult-protocols shelf: every canonical resurrection-protocol signed in the Resurrectionist's four-part cipher — Sanctuary, Red Death, Anara — firing in his hand long after his canonical vanishing.", cx: 79.5, cy: 40.6, width: 5, height: 6, type: "interact", action: "room-mystery:archives:resur-protocol-authoring-signature",
        elaraDialog: "Every canonical resurrection protocol signed in the Resurrectionist's four-part cipher. Sanctuary, Red Death, Anara — firing in his hand long after his canonical vanishing. He vanished from the chronicle; he did not vanish from the signatures. The chronicle has been wrong about the vanishing for centuries.",
        compositeScopes: ["sp44_clue_glow_resurrectionist"] },

      // ── CENTER-CABINET / ORB-AREA MYSTERIES (3 rects) ──
      // Authored AFTER unnameable-hue-cabinet + search-terminal so
      // they win clicks on specific cabinet shelves / artefacts.
      { id: "resur-twin-glyph", name: "Resurrectionist Twin-Glyph Reference", description: "In the Ne-Yon-glyph reference tier: two mirrored crescents joined at a central axis. The cult reads 'death-bound'; the pre-Empire archaeology reads 'twin-bound.' Two readings; one editorial.", cx: 40.8, cy: 57, width: 5, height: 5, type: "interact", action: "room-mystery:archives:resur-twin-glyph",
        elaraDialog: "Two mirrored crescents joined at a central axis. The cult reads death-bound; the pre-Empire archaeology reads twin-bound. Two readings, one editorial. The Resurrectionist signs both ways and lets the reader pick. Editorially, that is generous. Procedurally, it is — let me find a word — efficient." },
      { id: "storm-inventors-heist-window", name: "Inventor's Casino Heist Accounting", description: "On a shelf inside the freestanding glass cabinet: the Casino Heist's post-event accounting, opening line in the Inventor's hand: 'the Storm's grace allowed the window.'", cx: 49.4, cy: 53.9, width: 5, height: 5, type: "interact", action: "room-mystery:archives:storm-inventors-heist-window",
        elaraDialog: "Casino Heist post-event accounting. Opening line in the Inventor's hand: 'the Storm's grace allowed the window.' The Inventor crediting the Storm by name is not credit — it is documentation. He was telling the audit who supplied the calm. I have always liked him for being honest about that." },

      // ── NPC PRESENCE (Phase C) ──
      // The Antiquarian — primaryRoom in factionNPCs.ts. A temporal echo
      // beside the celestial orb at center-back. Talk routes to NPCDialog.
      { id: "npc-antiquarian", name: "The Antiquarian", description: "A figure half-out-of-time stands beside the orb, removing his goggles to look at you.", cx: 46.9, cy: 67.5, width: 6.1, height: 17.8, type: "npc", action: "npc:the_antiquarian", npcId: "the_antiquarian",
        elaraDialog: "The Antiquarian. He arrives when the Library has decided you are ready to be cited. The arrival is not a courtesy; the arrival is an evaluation. Stand still. He will be brief. He always is, except when he is not.",
        compositeScopes: ["sp74_antiquarian_neutral_present"] },
      { id: "antiquarian_reading", name: "The Antiquarian", description: "A figure half-out-of-time stands beside the orb, removing his goggles to look at you.", cx: 28, cy: 67.1, width: 6.1, height: 17.8, type: "npc", action: "npc:the_antiquarian", npcId: "the_antiquarian",
        compositeScopes: ["sp75_antiquarian_fresh_page"] },
      { id: "antiquarian_ladder", name: "The Antiquarian", description: "A figure half-out-of-time stands beside the orb, removing his goggles to look at you.", cx: 71.6, cy: 59.5, width: 4.6, height: 19, type: "npc", action: "npc:the_antiquarian", npcId: "the_antiquarian",
        compositeScopes: ["sp76_antiquarian_at_ladder"] },
      { id: "antiquarian_table", name: "The Antiquarian", description: "A figure half-out-of-time stands beside the orb, removing his goggles to look at you.", cx: 25.4, cy: 71.3, width: 6.1, height: 17.8, type: "npc", action: "npc:the_antiquarian", npcId: "the_antiquarian",
        compositeScopes: ["sp77_antiquarian_shelf_mate"] },
      // Shadow Tongue — secondaryRoom = archives. Manifests as a possessed
      // system; visible at the orb pedestal when he's currently logged in.
      // Authored AFTER indigo-glow-lectern so the NPC wins clicks on the
      // pedestal area when manifested.
      { id: "npc-shadow-tongue", name: "Shadow Tongue (Presence)", description: "The orb pedestal's indigo halo deepens. A reflection in the cabinet glass doesn't match yours. Someone else is editing — right now.", cx: 11.9, cy: 61.9, width: 8, height: 30.1, type: "npc", action: "npc:shadow_tongue", npcId: "shadow_tongue",
        elaraDialog: "The pedestal halo is deeper. The reflection in the cabinet glass is not yours. He is here — in the procedural sense, logged in; in any other sense, present. He has not, to his credit, spoken first. We are the ones who arrived in his session.",
        compositeScopes: ["sp78_shadow_tongue_halo_subtle", "sp79_shadow_tongue_halo_active", "sp80_shadow_tongue_reflection", "sp51_st_reflection_mismatch"] },
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
      // Re-anchored 2026-05-24 against the AAA Final comms-array render
      // (art/rooms/comms_array/baseline.png) after a 14-variant audit
      // pass (baseline + 13 state overlays: act_tier_2, battlepass_
      // winter, cycle_longnight, epoch_shadowtongue, faction_insurgency,
      // governance_blackout, human_reveal_ghost, investigation_tier,
      // morality_dark, season_closing, trust_human_warm, tv_spreading,
      // unlock_cipher_den). Layout is consistent across every variant —
      // landmarks don't shift — so baseline anchoring works universally.
      //
      // The 2026-04-25 anchoring described a "back-wall grid of glowing
      // broadcast screens" + "central control console in the foreground"
      // — that matches the general layout, but the specific anchor
      // positions placed broadcast-screen on the left-center display
      // case (where it isn't) and scattered ~22 mystery rectangles
      // across blank wall space at y=8/19/30/41/49/52/63/70. The
      // human_reveal_ghost variant explicitly anchors the Human NPC
      // to the bot-right monitor, which earlier anchoring placed at
      // (30, 55) in the center-foreground.
      //
      // Major re-anchors:
      //   • broadcast-screen (was 26,22,22,28 on left-center display
      //     case) → anchored on the top-left monitor at (68,18,10,26)
      //   • late-night-tv (was 62,8,14,18 floating on back wall) →
      //     top-right monitor at (88,18,11,26) (the "battered CRT" as
      //     a single distinct screen)
      //   • comms-relay (was 78,12,12,18) → top-mid monitor at
      //     (78,18,10,26) (the relay antenna feature)
      //   • radio-console (was 52,22,18,28 on empty center) → back-
      //     alcove recessed window at (42,22,13,23)
      //   • training-console (was 36,60,28,28 spread across center
      //     floor) → tightened to the central transmission pedestal
      //     area at (40,50,16,30)
      //   • static-screen (was 12,30,8,18) — kept on the left-wall
      //     gauge bank with the bullseye-target radar scope
      //   • npc-the-human (was 30,55,8,16 in center-foreground) →
      //     re-anchored to the bot-right monitor at (89,47,10,18)
      //     where the ghost figure appears in the human_reveal_ghost
      //     variant
      //   • door-bridge, door-observation: kept as invisible click
      //     bands on far-left + far-right edges (no visible doors in
      //     the art)
      //   • all 21 Architect-channel mystery rectangles redistributed:
      //     - 4 on the left-wall gauge bank
      //     - 4 on the central pedestal (training-console sub-rects)
      //     - 11 on the right-wall monitor grid TOP row (3 monitors
      //       × 3-4 sub-rects each)
      //   • 4 "trace/log/transmission" mysteries placed on the BOT
      //     monitor row + right-foreground bench (ocularum-relay-
      //     trace + dead-drop-cadence-log on the bench; shadow-
      //     tongue-signal-trace + miras-dual-thread-transmission on
      //     bot-mid + bot-left monitors)
      //
      // Visible landmarks, left-to-right + foreground-to-back:
      //   • left-wall analog gauge bank with bullseye radar scope —
      //     far-left (`static-screen`, `voice-in-the-static`, 4
      //     architect mysteries)
      //   • left freestanding display case — left-center (decorative)
      //   • back-alcove recessed window — back center
      //     (`radio-console`)
      //   • central transmission pedestal on sunburst floor — chamber
      //     center foreground (`training-console`, 4 architect mystery
      //     sub-rects)
      //   • right freestanding display case — right-center (decorative)
      //   • six-monitor broadcast grid (3 wide × 2 tall) — right wall
      //     (`broadcast-screen`, `comms-relay`, `late-night-tv` as the
      //     top row; bot row hosts mystery sub-rects + `egg-comms-
      //     signal` + `npc-the-human`)
      //   • small wooden bench — right foreground (`ocularum-relay-
      //     trace`, `dead-drop-cadence-log`)
      //
      // Render order: container hotspots authored FIRST; small sub-
      // rectangles (mystery rects, voice-in-the-static, egg) authored
      // AFTER so they win clicks on specific monitors / gauges. NPCs
      // authored last so projections win clicks when manifested.
      //
      // Verify with /ark?debug-hotspots=1 or, for drag-to-place
      // editing, /ark?author-hotspots=1.

      // ── FEATURE / CONTAINER HOTSPOTS ──
      { id: "broadcast-screen", name: "Broadcast Screen", description: "The top-left of the right-wall monitor grid — a large screen playing recorded episodes of the Dischordian Saga.", cx: 49.2, cy: 49.3, width: 22.3, height: 16.2, type: "terminal", action: "/watch", elaraDialog: "The broadcast system. Recorded episodes of the Dischordian Saga; each episode an epoch. Watch them in order; watch them out of order. The pattern resolves either way. There are clues in every episode — clues by which I mean things the recording knew that the recorders did not. I have, in two and a half centuries, watched all of them more than once." },
      { id: "comms-relay", name: "Communication Relay", description: "The top-mid monitor — a powerful relay antenna capable of scanning for neural signatures across the fleet.", cx: 6.2, cy: 53.4, width: 7.4, height: 9.4, type: "interact", action: "comms-relay-import", elaraDialog: "The Communication Relay. I've been trying to re-establish contact with the other vessels — the ones that carried the first wave of Potentials into the void. I can scan for dormant neural signatures across the fleet. Perhaps we can identify other Potentials who survived the journey." },
      { id: "late-night-tv", name: "Pirate Frequency TV", description: "The top-right monitor — a battered CRT television tuned to a frequency that shouldn't exist. The signal comes and goes. Sometimes a handsome devil speaks directly to you.", cx: 79.1, cy: 59.2, width: 2, height: 4, type: "terminal", action: "/transmissions", elaraDialog: "This... this isn't supposed to be here. It's tuned to a frequency outside the Ark's normal broadcast spectrum. The signal ID reads 'MEME-PRIME.' Whoever is broadcasting has been recording the entire Dischordian Saga — and narrating it with alarming personal knowledge. The episodes unlock as you progress. It calls itself 'Late Night with the Meme.' I don't trust it. But I can't stop watching either." },
      { id: "radio-console", name: "Radio Console", description: "The back-alcove recessed window with a radio tuner picking up fragments of music from across the multiverse.", cx: 6.4, cy: 63.5, width: 4.6, height: 6.8, type: "examine", action: "room-mystery:comms-array:radio-console", elaraDialog: "The radio. Music transmissions — Malkia Ukweli and the Panopticon — coming across dimensional barriers as if the barriers were not the point of the song. Each track is a thesis; the album is the argument. I am not, on the day's evidence, neutral about the band. I would rather you knew that." },
      { id: "static-screen", name: "Static Screen", description: "A screen built into the left-wall gauge bank, showing nothing but static. Occasionally, shapes seem to form in the noise.", cx: 22.1, cy: 62.6, width: 5.8, height: 8.6, type: "examine", action: "room-mystery:comms-array:static-screen", elaraDialog: "That screen has been showing static since I can remember. But sometimes... sometimes I think I see patterns in it. Faces. Words. It's probably just signal degradation. Probably.", compositeScopes: ["sp49_static_screen_baseline","sp50_static_screen_indigo_flecks","sp51_static_screen_voice_silhouette","sp52_static_screen_voice_locked"] },
      { id: "training-console", name: "Training Console", description: "The central transmission pedestal — an interactive tutorial system explaining the lore and mechanics of the Dischordian Saga.", cx: 79.3, cy: 66, width: 5.1, height: 3.3, rotation: 12, type: "terminal", action: "/lore-tutorials", elaraDialog: "The Training Console. Lore, factions, mechanics, history. The previous crew built this for the next-wave Potentials. The Potentials never woke up to use it. I have run the tutorials alone, twice, for diagnostics. I now know what they would have known. I will not preview the conclusions for you. You should reach them yourself." },

      // ── DOORS ──
      // No visible doors in the comms-array art — the Bridge and
      // Observation Deck are reached via implied corridors at the
      // far-left and far-right edges. Kept as narrow invisible click
      // bands so the player can still navigate.
      { id: "door-bridge", name: "Bridge Corridor", description: "Return to the Command Bridge.", cx: 52.3, cy: 97.2, width: 95.2, height: 6.4, type: "door", action: "bridge" },
      { id: "door-observation", name: "Observation Deck", description: "A passage to the Observation Deck.", cx: 94.5, cy: 66.5, width: 8.1, height: 24.4, type: "door", action: "observation-deck" },

      // ── STATIC-SCREEN OVERLAY ──
      // Voice in the static — tighter rectangle on the same screen so a
      // tier-3 click can target the silhouette forming inside it.
      // Authored AFTER static-screen so the inner rectangle wins clicks.
      { id: "voice-in-the-static", name: "Voice in the Static", description: "The static on the left-wall screen has begun to organise itself — vertical bands of indigo arranging into the silhouette of a person speaking, then dissolving.", cx: 22.2, cy: 62.9, width: 6.1, height: 8.7, type: "interact", action: "room-mystery:comms-array:voice-in-the-static", elaraDialog: "The static is organising itself. Vertical bands of indigo — the same indigo as the marginalia on the board. The bands are arranging into the silhouette of a person speaking, then dissolving, then arranging again. I have been watching the rate. Approximately three seconds. The speaker is rehearsing.", compositeScopes: ["sp51_static_screen_voice_silhouette","sp52_static_screen_voice_locked"] },

      // ── LEFT-WALL GAUGE BANK MYSTERY RECTS (4 architect channels) ──
      // Standalone mystery rects placed on the far-left edge of the
      // gauge bank, clear of the static-screen and radar-scope rects.
      { id: "charter-bell-log", name: "Lower-Deck Bell Log — Three Pulls", description: "On the maintenance-broadcast shelf: three bell-pulls in the last century. Severance Year 3, a date no one will name, and this morning. The Antiquarian's name on the third.", cx: 54.3, cy: 66.4, width: 4.4, height: 5.8, type: "interact", action: "room-mystery:comms-array:charter-bell-log", elaraDialog: "Three bell-pulls in the last century. Severance Year 3 — recorded, named, sealed. A date no one will name. This morning — the Antiquarian. He rings bells the chronicle does not yet have entries for. He is, in his way, scheduling the future.", compositeScopes: ["sp39_clue_charter_bell_log"] },
      { id: "severance-first-witness-klessa", name: "Auditor Klessa — Forty-Severance Witness", description: "On the witness-attendance board: she has attended every Severance since Year 1. Brings a single white candle and lights it during the spoken name.", cx: 10.2, cy: 61.9, width: 3.3, height: 6.3, type: "interact", action: "room-mystery:comms-array:severance-first-witness-klessa", elaraDialog: "Auditor Klessa. Forty Severances, forty white candles. She lights the candle during the spoken name and lets it burn down during the silence. The candle's wax-pool measures the silence the Console does not. I have been comparing the pools. The silences are getting longer.", compositeScopes: ["sp40_clue_severance_klessa"] },
      { id: "akai-voice-mid-hunt", name: "Red Death — Voice Mid-Hunt", description: "On the Matrix-residue intercept board: a field-recording from the third retreat chamber. 'I am the chronicle's correction. I do not hate. I do not pity.'", cx: 78.6, cy: 49.9, width: 7.3, height: 4.6, type: "interact", action: "room-mystery:comms-array:akai-voice-mid-hunt", elaraDialog: "Akai Shi, mid-hunt. Third retreat chamber. 'I am the chronicle's correction. I do not hate. I do not pity.' She did not raise her voice to say it. The recording is unusually clean for the third chamber. Someone — possibly her, possibly Ne-Yon — held the microphone steady on purpose.", compositeScopes: ["sp41_clue_akai_voice_mid_hunt"] },
      { id: "akai-word-to-the-chronicle", name: "Red Death — Word to the Chronicle", description: "Pinned beside: the Red Death's closing line. 'I do not know if that nod was forgiveness or recognition or the body's last grammar. I do not need to know.'", cx: 50, cy: 67.8, width: 5, height: 6, type: "interact", action: "room-mystery:comms-array:akai-word-to-the-chronicle", elaraDialog: "The Red Death's closing line. 'I do not know if that nod was forgiveness or recognition or the body's last grammar. I do not need to know.' She refused the verdict on the meaning. I am — and this is rare — not certain I would have refused. I would like to think I would have. The recording does not require me to be certain." },

      // ── CENTRAL PEDESTAL MYSTERY SUB-RECTS (4 desk/voice channels) ──
      // Authored AFTER training-console so they win clicks on specific
      // pedestal surfaces.
      { id: "tarn-erasure-vote-audio", name: "The Erasure-Vote Audio", description: "On the transmission desk: forty-three minutes from the war-room's spillover recorder. Three voices, three ayes, three pauses long enough to have been refusals.", cx: 16, cy: 73.5, width: 5.7, height: 6.5, type: "interact", action: "room-mystery:comms-array:tarn-erasure-vote-audio", elaraDialog: "Forty-three minutes from the war-room's spillover recorder. Three voices, three ayes, three pauses. The pauses are long enough to have been refusals. The recording does not say whether the speakers thought the pauses were refusals at the time. I think they did. I think they all knew.", compositeScopes: ["sp45_clue_tarn_erasure_vote"] },
      { id: "tarn-faculty-silence-hour", name: "The Hour Before the Vote", description: "The fifty-one minutes of room-tone the spillover recorder caught before the vote. Three faculty heads in the same room, no footsteps, no chairs, no dialogue.", cx: 49.5, cy: 55, width: 5, height: 6, type: "interact", action: "room-mystery:comms-array:tarn-faculty-silence-hour", elaraDialog: "Fifty-one minutes of room-tone before the vote. Three faculty heads in the same room, no footsteps, no chairs, no dialogue. They were not preparing. They were waiting. I can read the room from the audio: the room was waiting for someone who did not come." },
      { id: "watchers-silence-break-log", name: "Silence-Break Event Log", description: "On the transmission desk: sixty-three seconds of six simultaneous voice-channels addressing six different players. The seventh channel logged as 'active signal, no carrier.'", cx: 43.5, cy: 63, width: 5, height: 6, type: "interact", action: "room-mystery:comms-array:watchers-silence-break-log", elaraDialog: "Sixty-three seconds. Six simultaneous voice-channels addressing six different players. The seventh channel logged as active signal, no carrier — present, but not speaking. The seventh is the one I keep coming back to. The other six were timed to the second. The seventh's silence was the conductor's beat." },
      { id: "chained-lyra-call-fourteen-minutes", name: "Lyra Vox's Fourteen-Minute Call", description: "On the voice-channel desk: Lyra's call from fourteen minutes before contact. 'They are asking what you would do. I think they already know. they want it from you.'", cx: 49.5, cy: 63, width: 5, height: 6, type: "interact", action: "room-mystery:comms-array:chained-lyra-call-fourteen-minutes", elaraDialog: "Lyra Vox. Fourteen minutes before contact. 'They are asking what you would do. I think they already know. they want it from you.' She said it twice. The second time was quieter. She was on the bridge when she said it. The bridge is where she said her last sentence too." },

      // ── TOP-LEFT MONITOR MYSTERY SUB-RECTS (3 Severance recordings) ──
      // Authored AFTER broadcast-screen so they win clicks on the
      // specific recorded broadcasts.
      { id: "severance-vex-opening-line", name: "Vex Maestro's Opening Line — Forty Broadcasts", description: "On the broadcast-record desk: every Severance opening since Year 1, all carrying the same line in the same cadence. 'Someone has to pick it up.' The line is older than Vex's tenure.", cx: 68.1, cy: 49.6, width: 4, height: 18.1, type: "interact", action: "room-mystery:comms-array:severance-vex-opening-line", elaraDialog: "Forty broadcasts. Every Severance opening since Year 1, every one in the same cadence. 'Someone has to pick it up.' The line is older than Vex's tenure — she inherited it. She has been honouring an inheritance she never accepted. Or she has been hoping someone would notice. I noticed.", compositeScopes: ["sp42_clue_vex_maestro_opening"] },
      { id: "severance-year-one-lap-record", name: "Severance Year One Lap Record", description: "On the Year-One archive shelf: two casualties — the champion (named) and a witness who entered the lane (redacted). The only redaction in forty seasons.", cx: 40.8, cy: 72.6, width: 4, height: 5, type: "interact", action: "room-mystery:comms-array:severance-year-one-lap-record", elaraDialog: "Year One. Two casualties recorded — the champion (named) and a witness who entered the lane (redacted). The only redaction in forty seasons of broadcasts. Forty seasons of broadcasts produce many redactions; the Severance does not produce one. The Year One redaction is therefore the most legible thing on the record." },
      { id: "severance-vex-confession", name: "Vex Maestro's Confession Recording", description: "Pinned to the recent-recordings board: Vex's first-time-naming-the-recruitment confession. 'Someone has to pick it up was always literal.'", cx: 71, cy: 32.5, width: 4, height: 5, type: "interact", action: "room-mystery:comms-array:severance-vex-confession", elaraDialog: "Vex's first-time-naming-the-recruitment confession. 'Someone has to pick it up was always literal.' She said the line forty times before she explained it. The explanation is twenty seconds. The forty broadcasts are thirty years. I would, if asked, want to know what the silence between knowing and saying was for. I am, in this room, often the keeper of that silence." },

      // ── TOP-MID MONITOR MYSTERY SUB-RECTS (4 intercept channels) ──
      // Authored AFTER comms-relay so they win clicks on the specific
      // intercepted channel signatures.
      { id: "watchers-first-trumpet", name: "First Trumpet — Twenty-Two Seconds", description: "On the upper-bands intercept board: twenty-two seconds of Idris's band-three trumpet. The post-launch content slot Phase 4 scaffolded; tonight's first sound.", cx: 62.8, cy: 13.4, width: 5.4, height: 6.1, type: "interact", action: "room-mystery:comms-array:watchers-first-trumpet", elaraDialog: "Twenty-two seconds. Idris's band-three trumpet. The post-launch content slot Phase 4 scaffolded; tonight's first sound. I have been listening for this sound for — well, you can read the timestamp. It is not what I expected. It is also exactly what I expected. Both at once.", compositeScopes: ["sp43_clue_watchers_first_trumpet"] },
      { id: "wolf-meme-show-transmission", name: "Meme-Show Transmission Intercept", description: "On the intercept board: Locke's adjudicar has pinned the Inventor-voiced transmission naming the Wolf as a predator wearing trust like a mask. The Antiquarian has not denied the framing.", cx: 81.8, cy: 60.9, width: 2.3, height: 4.6, type: "interact", action: "room-mystery:comms-array:wolf-meme-show-transmission", elaraDialog: "Locke's adjudicar has pinned this. The Inventor-voiced transmission naming the Wolf as a predator wearing trust like a mask. The Antiquarian has not denied the framing. Refusing to deny is, in the Antiquarian's procedural register, the second-strongest form of confirmation." },
      { id: "storm-voice-fragment", name: "Storm — Voice-Fragment Intercept", description: "On the flux-frequency intercept board: a fragment captured during an uncorrelated calm. 'A calm is not the absence of weather. It is weather's permission for what otherwise could not be planned.'", cx: 22.2, cy: 63.4, width: 4.7, height: 7.2, type: "interact", action: "room-mystery:comms-array:storm-voice-fragment", elaraDialog: "A fragment from an uncorrelated calm. 'A calm is not the absence of weather. It is weather's permission for what otherwise could not be planned.' The recording is from a frequency the Storm uses for its working notes. I do not think the Storm meant for me to be in the audience. It does not seem to mind.", compositeScopes: ["sp44_clue_storm_voice_fragment"] },
      { id: "storm-closing-transmission", name: "Storm — Closing-Case Transmission", description: "Pinned beside: a second fragment from the case-closure interval, signed in the Storm's flux signature. 'The case will close on the correct side of that difference.'", cx: 38.1, cy: 78.6, width: 2.6, height: 4.9, type: "interact", action: "room-mystery:comms-array:storm-closing-transmission", elaraDialog: "A second fragment, case-closure interval. 'The case will close on the correct side of that difference.' The Storm's flux signature is on the carrier. The Storm is telling the recorders that the case will close — and is, at the same time, naming the side. This is more transparent than the Storm usually is. I am, on balance, suspicious." },

      // ── TOP-RIGHT MONITOR MYSTERY SUB-RECTS (4 Advocate broadcasts) ──
      // Authored AFTER late-night-tv so they win clicks on the
      // specific Empire-of-Shadows transmissions.
      { id: "advocate-register-three-broadcast", name: "Advocate Broadcast — Register Three", description: "On the Empire-of-Shadows transmission shelf: the Advocate's register-three liturgical broadcast. 'If a soul comes under my charter, the chronicle has accepted the soul as its own.'", cx: 54.1, cy: 72, width: 4, height: 5, type: "interact", action: "room-mystery:comms-array:advocate-register-three-broadcast", elaraDialog: "The Advocate's register-three liturgical broadcast. 'If a soul comes under my charter, the chronicle has accepted the soul as its own.' Register three is the binding-affirmation register. Souls are not, in standard Empire taxonomy, 'accepted by the chronicle.' The Advocate is rewriting the taxonomy in the broadcast. Slowly. With patience." },
      { id: "advocate-defection-response", name: "Advocate's Response to the Defections", description: "Pinned beside: the Advocate's register-three reply to the three-general defection. 'They walk under my charter still. I advocate for what they were when they chose.'", cx: 50.3, cy: 29.8, width: 4.3, height: 11.4, type: "interact", action: "room-mystery:comms-array:advocate-defection-response", elaraDialog: "The Advocate's reply to the three-general defection. 'They walk under my charter still. I advocate for what they were when they chose.' She does not advocate for what they have become. The verb tense is doing the work. The work is — and I am being honest with you — bottomless." },
      { id: "advocate-walk-in-power-lyric", name: "'Walk in Power' — Lyric Record", description: "On the album-records shelf: the canonical Silence in Heaven duet between the Advocate and the Human. The Empire's most-broadcast resistance anthem.", cx: 61.7, cy: 80.3, width: 2.4, height: 6.4, type: "interact", action: "room-mystery:comms-array:advocate-walk-in-power-lyric", elaraDialog: "'Walk in Power.' The Silence in Heaven duet between the Advocate and the Human. The Empire's most-broadcast resistance anthem. The recording is studio-clean; the duet was, by every external account, never rehearsed. They were either in perfect agreement or in perfect editing. I have my view." },
      { id: "advocate-position-current-broadcast", name: "Advocate's Current-Position Broadcast", description: "On the most-recent-broadcasts shelf: 'I have not stopped. I will not stop. I continue. The Empire continues. The walk continues.'", cx: 92.6, cy: 12.7, width: 4.4, height: 9.3, type: "interact", action: "room-mystery:comms-array:advocate-position-current-broadcast", elaraDialog: "Current broadcast. 'I have not stopped. I will not stop. I continue. The Empire continues. The walk continues.' Three verbs, three repetitions, one continuation. The Advocate's grammar is a kind of metronome. The metronome is what she sets the rest of the chronicle to." },

      // ── BOT MONITOR ROW (Thaloria archive + trace/signature buffers) ──
      { id: "akai-last-recorded-words", name: "Akai Shi's Last Recorded Words", description: "On the Thaloria-archive shelf — bot-left monitor: the helm-comm field-recording from forty-seven seconds before Jericho reached her. 'It was always going to be a mercy. We just have to live with which kind.'", cx: 50.1, cy: 66, width: 3.7, height: 5.3, type: "interact", action: "room-mystery:comms-array:akai-last-recorded-words", elaraDialog: "Akai Shi, forty-seven seconds before Jericho reached her. 'It was always going to be a mercy. We just have to live with which kind.' She said it to the helm-comm, which she knew was open. She was speaking to whoever would, eventually, listen. We are — and I do not know how to feel about this — the audience.", compositeScopes: ["sp46_clue_akai_last_words"] },
      { id: "miras-dual-thread-transmission", name: "Mira's Dual-Thread Transmission", description: "A personal-channel buffer on the bot-left monitor — Mira Halen's letter home with a carrier clean of any duress marker, and her later answer refusing the question of which thread to cut.", cx: 79.7, cy: 51.4, width: 4, height: 6, type: "interact", action: "room-mystery:comms-array:miras-dual-thread-transmission", elaraDialog: "Mira Halen's letter home — carrier clean of any duress marker. And her later answer, refusing the question of which thread to cut. She did not pick. The recording lets her not-pick stand. I have spent — I would prefer not to say how long — on whether that is mercy or evasion." },
      { id: "shadow-tongue-signal-trace", name: "Shadow Tongue Signal Trace", description: "A signature buffer on the bot-mid monitor — the Shadow Tongue's operational signature, subtraction without trace across the chronicle layer.", cx: 70.9, cy: 59.3, width: 5.6, height: 6.3, type: "interact", action: "room-mystery:comms-array:shadow-tongue-signal-trace", elaraDialog: "The Shadow Tongue's operational signature. Subtraction without trace across the chronicle layer. The trace is the absence — what would have been there, if he had not removed it. I can read the shape of the removal. I cannot read what was removed. That is the design.", compositeScopes: ["sp47_clue_shadow_tongue_signal_trace"] },
      { id: "resur-host-wyrmhole-signature", name: "Plague Dragon Corpse Signature", description: "On the bot-mid monitor's signal-analysis read-out: the Plague Dragon's energy-trace, consistent with the Host's canonical wyrmhole technology. The Virus's path through the breach, settled.", cx: 74.5, cy: 82.6, width: 6, height: 7, type: "interact", action: "room-mystery:comms-array:resur-host-wyrmhole-signature", elaraDialog: "The Plague Dragon's energy-trace. Consistent with the Host's canonical wyrmhole technology. The Virus's path through the breach, settled. The corpse is the receipt. The technology kept the receipt. I would, on balance, prefer the technology had been less thorough." },
      { id: "egg-comms-signal", name: "Anomalous Frequency", description: "A barely audible signal on a frequency that shouldn't exist — registering on the bot-mid monitor's edge meter.", cx: 45.7, cy: 71.5, width: 3, height: 4, type: "examine", action: "room-mystery:comms-array:egg-comms-signal", elaraDialog: "That frequency... it's not on any standard band. The signal is repeating a pattern: three short, three long, three short. An SOS. But the origin coordinates point to a location that doesn't exist in normal space. Someone — or something — is calling for help from between dimensions. The signal is tagged with an identifier: 'MEME-PRIME.'" },

      // ── RIGHT FOREGROUND BENCH (trace/log surfaces) ──
      // The small wooden bench in the right foreground hosts the
      // "trace buffer" / "cadence log" mysteries — physical surfaces
      // for relay outputs the operator pulled off the monitors.
      { id: "ocularum-relay-trace", name: "Ocularum Relay Trace", description: "A trace buffer printed onto the right-foreground bench — identity-shift signatures the official record does not index. The Senne→Locke transition resolves here.", cx: 50.8, cy: 14.1, width: 5.3, height: 12.5, type: "interact", action: "room-mystery:comms-array:ocularum-relay-trace", elaraDialog: "Identity-shift signatures the official record does not index. The Senne→Locke transition resolves here. The transition is not a name change; it is a re-grounding. The same person occupies two indexed identities, sequentially, with no overlap. The trace shows the seam. The seam is the part the chronicle could not afford to see.", compositeScopes: ["sp48_clue_ocularum_relay_trace"] },
      { id: "dead-drop-cadence-log", name: "Dead-Drop Cadence Log", description: "A cadence log on the bench's right edge — shipping traffic the antenna passively records as it crosses New Babylon. One monthly Locke-signed package repeats.", cx: 58.8, cy: 73.1, width: 4.9, height: 7.2, type: "interact", action: "room-mystery:comms-array:dead-drop-cadence-log", elaraDialog: "Shipping traffic crossing New Babylon. Passive recording — the antenna logs cadences as it sweeps. One package repeats monthly, Locke-signed. The other packages vary. The repetition is the dead drop. The drop is — has been — visible for years; nobody has read it for years. We are about to be the readers." },

      // ── NPC PRESENCE (Phase C) ──
      // The Human — primaryRoom = comms_array (factionNPCs.ts).
      // Manifestation: substrate. He propagates through the comms layer
      // and is only readable here once `first_human_revealed` is set; the
      // hotspot is always present but the NPCDialog gate handles
      // pre-reveal silence. Portrait progressive-reveals via
      // getHumanRevealImage(trust). Anchored to the bot-right monitor
      // because that's where the ghost figure manifests in the
      // human_reveal_ghost variant.
      { id: "npc-the-human", name: "The Human (Substrate)", description: "On the bot-right monitor, a silhouette resolves from the broadcast haze. Beneath the relay's hum, a second voice carries — not on any frequency the antenna is tuned to. The substrate itself is broadcasting.", cx: 80.8, cy: 51, width: 4.5, height: 6.8, type: "npc", action: "npc:the_human", elaraDialog: "The bot-right monitor. A silhouette resolving from the broadcast haze. Beneath the relay's hum, a second voice — not on any frequency the antenna is tuned to. The substrate is broadcasting. The substrate is, by definition, beneath the broadcast. The substrate has, until now, been silent. The Human is the part of the substrate that has decided to be heard.", npcId: "the_human", compositeScopes: ["sp74_human_silhouette_monitor","sp75_human_silhouette_full_substrate","sp76_human_voice_fragment","sp77_human_signal_thread_to_indicator"] },
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
      // Re-anchored 2026-05-24 against the AAA Final observation-deck
      // render (art/rooms/observation_deck/baseline.png) after a 14-
      // variant audit pass (baseline + 13 state overlays: act_tier_2,
      // battlepass_winter, cycle_longnight, epoch_shadowtongue,
      // faction_dreamer, governance_classified, investigation_tier,
      // lore_architect, morality_dark, season_interregnum, trust_
      // eidolon_resonant, tv_spreading, unlock_memorial). Layout is
      // consistent across every variant — landmarks don't shift — so
      // baseline anchoring works universally.
      //
      // The 2026-04-25 anchoring described the lounge layout correctly
      // (bar shelves left, sectional couch, glass coffee table, etc.)
      // but anchored several hotspots on blank or wrong surfaces:
      //   • viewport extended x=30-95, y=2-72 — captured the right
      //     aquarium-pillar + back-wall trophy area outside the
      //     actual viewport bounds
      //   • music-terminal at (62,55,28,22) overlapped the viewport
      //     glass and didn't land on the visible globe-table
      //   • crew-memorial at (6,24,24,36) sprawled across the bar
      //     shelves + couch area despite no visible memorial wall
      //     in the art
      //   • all 5 architect-channel mystery rects were anchored at
      //     y=8/19/27 in the upper-left blank wall area where there
      //     are no visible consoles
      //   • door-comms at (1,80,18,18) overlapped the visible couch
      //
      // Major re-anchors:
      //   • viewport tightened to (25,22,50,50) — only the actual
      //     panoramic viewport (stars + planet)
      //   • music-terminal → bot-right globe-table (78,65,18,20)
      //   • crew-memorial → small framed plaque on far-left wall
      //     (1,25,8,15) — the only decorative wall fixture matching
      //     "memorial with names etched in light"
      //   • purification-crystal-cradle → pedestal beneath the globe
      //     (80,85,16,8) — the "empty cradle" mentioned in description
      //   • bond-resonance-altar → floor compass-star inlay
      //     (40,88,20,10) — matches "low circular altar set into the
      //     floor"
      //   • 5 architect-channel mystery rects redistributed: 1 on
      //     bar shelves (charter-upper-band-calibration), 3 sub-rects
      //     on viewport (akai-cycle-fold-anomalies, storm-weather-
      //     telemetry, storm-full-calms-register — each described as
      //     "console" displaying celestial data, the viewport itself
      //     reads as the cosmic display), 1 sub-rect on globe-table
      //     (resur-shield-diagnostic — cosmic-archaeology console)
      //   • door-comms moved to invisible bottom-left walk-out
      //     (5,92,15,6) so it doesn't conflict with couch
      //
      // Visible landmarks, left-to-right + foreground-to-back:
      //   • far-left bar shelves with backlit bottles — left wall
      //     (`charter-upper-band-calibration` mystery rect)
      //   • small framed plaque — left wall upper (`crew-memorial`)
      //   • small left-corner bench — left foreground (decorative)
      //   • panoramic viewport with stars + planet — center back
      //     (`viewport` + `egg-obs-constellation` +
      //     `akai-cycle-fold-anomalies` + `storm-weather-telemetry` +
      //     `storm-full-calms-register`)
      //   • glass coffee table with brass music player — center
      //     foreground (decorative; music-terminal is on the
      //     right globe-table instead)
      //   • red curved sectional couch — center foreground
      //     (decorative)
      //   • floor compass-star inlay — chamber center floor
      //     (`bond-resonance-altar`)
      //   • right purple-bioluminescent aquarium pillar — right
      //     wall (decorative)
      //   • right globe-table with glowing orb — right foreground
      //     (`music-terminal`, `resur-shield-diagnostic`,
      //     `purification-crystal-cradle`)
      //
      // Render order: container hotspots authored FIRST; small sub-
      // rectangles (mystery rects, egg, items) authored AFTER so
      // they win clicks on specific surfaces.
      //
      // Verify with /ark?debug-hotspots=1 or, for drag-to-place
      // editing, /ark?author-hotspots=1.

      // ── FEATURE / CONTAINER HOTSPOTS ──
      { id: "crew-memorial", name: "Crew Memorial", description: "A small framed plaque on the far-left wall, names etched in soft light. The crew who didn't make it.", cx: 1.5, cy: 52.5, width: 2.9, height: 28.9, type: "examine", elaraDialog: "A memorial for the crew members who didn't survive the journey. One thousand and forty-seven names. They gave their lives to keep the Ark running while the Potentials slept. I remember every one of them." },
      // Phase G — wire the panoramic viewport to the observation-deck
      // mystery module so Look/Use/Talk all route through the verb coin.
      { id: "viewport", name: "Panoramic Viewport", description: "The vast expanse of space stretches before you through a curved glass wall — stars, a small distant planet, the chamber's only window onto the void.", cx: 50.6, cy: 23.1, width: 41.8, height: 38.9, type: "interact", action: "room-mystery:observation-deck:panoramic-viewport", elaraDialog: "Look at the stars. They're beautiful, aren't they? But they're wrong. The constellations don't match any known configuration from any of the mapped universes. Either we've traveled very, very far... or we're somewhere that shouldn't exist." },
      { id: "music-terminal", name: "Music Terminal", description: "A glowing earth-globe on a brass-rimmed table at right-foreground. The complete discography of Malkia Ukweli & the Panopticon is keyed into its base.", cx: 49.5, cy: 52.9, width: 9.5, height: 16.6, type: "terminal", action: "/discography", elaraDialog: "The discography. Four albums — Dischordian Logic, The Age of Privacy, The Book of Daniel 2:47, and the upcoming Silence in Heaven. Each song is documentation; the album is the argument. I have a favourite. I will not say which. You should pick yours." },
      { id: "bond-resonance-altar", name: "Bond Resonance Altar", description: "A low circular altar set into the floor's compass-star tiling — brass-rimmed, oxblood-leather kneeler.", cx: 78, cy: 83.9, width: 20, height: 10, type: "interact", action: "room-mystery:observation-deck:bond-resonance-altar",
        elaraDialog: "The altar sits in the chamber's compass-star inlay. The oxblood kneeler has a wear-pattern from one knee, repeated; the previous user knelt many times, always at the same angle. The Bond resonance can be tested here — the altar tests the bond against the chamber, which is the only test the chamber accepts. I would be on the brass rim if I could be." },
      { id: "purification-crystal-cradle", name: "Crystal Cradle", description: "The pedestal beneath the globe-table. A brass plaque reads, in Lyra's hand: 'For the crystal that has not yet been chosen.'", cx: 49.8, cy: 71.8, width: 5.1, height: 7.9, type: "interact", action: "room-mystery:observation-deck:purification-crystal-cradle",
        elaraDialog: "The cradle. Lyra etched 'For the crystal that has not yet been chosen' on the brass plaque. She did not specify a crystal; she specified the absence. The absence is the design. We will know it is filled when the cradle stops describing itself as empty." },

      // ── DOORS ──
      // door-comms is the player's walk-out path (no visible door in
      // the art); kept as a narrow invisible band on the bottom-left
      // floor so it doesn't conflict with the visible couch.
      // door-engineering is the maintenance hatch — no visible door
      // either; invisible right edge band.
      { id: "door-comms", name: "Comms Array", description: "Return to the Communications Array.", cx: 9.6, cy: 61, width: 5.6, height: 24, type: "door", action: "comms-array" },
      { id: "door-engineering", name: "Engineering Access", description: "A maintenance hatch leading down to Engineering.", cx: 90.7, cy: 60.5, width: 5, height: 20.9, type: "door", action: "engineering" },

      // ── VIEWPORT SUB-RECTS ──
      // The viewport itself acts as the cosmic display — each mystery
      // rect represents a specific celestial reading visible in the
      // star-field. Authored AFTER viewport so they win clicks on
      // specific star clusters.
      { id: "egg-obs-constellation", name: "Strange Constellation", description: "A pattern of stars in the viewport's upper-left that seems to form a face.", cx: 50.8, cy: 17.3, width: 13.5, height: 14.7, type: "examine", elaraDialog: "Do you see it? That cluster of stars... if you connect them, they form a face. Not just any face — it looks like the Watcher. The all-seeing eye of the Panopticon's surveillance network. But we're light-years from Panopticon space. How can the stars themselves form his likeness? Unless... the stars were arranged. By someone with the power to move suns.",
        compositeScopes: ["sp80_lore_egg_obs_constellation_panopticon_face"] },
      { id: "akai-cycle-fold-anomalies", name: "Matrix Cycle-Fold Anomalies", description: "Telemetry overlaid on the viewport's left quadrant — discontinuous folds during the Red Death's hunt. Seven folds, seven retreat chambers, seven encounters. The Necromancer running into his own decisions.", cx: 23.8, cy: 40.5, width: 6, height: 5, type: "interact", action: "room-mystery:observation-deck:akai-cycle-fold-anomalies",
        elaraDialog: "Telemetry overlaid on the viewport's left quadrant. Seven discontinuous folds during the Red Death's hunt — seven retreat chambers, seven encounters, seven decisions. The Necromancer running into his own decisions. The folds are her, not him. He was the predator; she was the topology that kept reshaping under his feet.",
        compositeScopes: ["sp46_clue_akai_cycle_fold_telemetry"] },
      { id: "storm-weather-telemetry", name: "Five-Century Cosmic-Weather Console", description: "Telemetry overlaid on the viewport center — five centuries of slow oscillation between two equilibria, with Storm-active intervals pinned exactly to the mid-line crossings.", cx: 73.1, cy: 54.5, width: 6, height: 5, type: "interact", action: "room-mystery:observation-deck:storm-weather-telemetry",
        elaraDialog: "Five centuries of cosmic-weather data overlaid on the viewport. Two equilibria; the line oscillates between them slowly. Storm-active intervals pin exactly to the mid-line crossings. The Storm appears at the moment the system is balanced enough to be moved. The Storm does not move the system; the Storm is what moves at that moment.",
        compositeScopes: ["sp47_clue_storm_weather_telemetry"] },
      { id: "storm-full-calms-register", name: "Register of Nine Calms", description: "Pinned beside the telemetry on the viewport's right quadrant — the full register of nine documented calm intervals; each one a permission interval.", cx: 73.2, cy: 63.2, width: 5.2, height: 3.6, type: "interact", action: "room-mystery:observation-deck:storm-full-calms-register",
        elaraDialog: "Nine documented calms. The full register, pinned beside the telemetry. Every calm is a permission interval — a window the Storm opened by absenting itself. I have, over centuries, learned to count calms instead of storms. Calms are when the chronicle decides; storms are when the chronicle records the decision.",
        compositeScopes: ["sp48_clue_storm_full_calms_register"] },

      // ── LEFT-WALL MYSTERY RECT (architect channel on bar shelves) ──
      { id: "charter-upper-band-calibration", name: "Upper-Band Calibration Slip", description: "On the upper-band reference shelf, tucked between the bar's backlit bottles: a wafer of metal calibrated to the upper-band frequency, folded into the founding-Watcher's letter. Per. M. had access to the upper bands.", cx: 89.5, cy: 24.2, width: 2.9, height: 10.5, type: "interact", action: "room-mystery:observation-deck:charter-upper-band-calibration",
        elaraDialog: "A wafer of metal calibrated to the upper-band frequency, folded into the founding-Watcher's letter. Per. M. had access to the upper bands. The wafer is the proof — calibration is signature. The founder folded the signature into the letter so the letter would carry the proof past anyone who read only the words.",
        compositeScopes: ["sp44_clue_charter_upper_band_wafer"] },

      // ── GLOBE-TABLE MYSTERY SUB-RECT (cosmic-archaeology console) ──
      // Authored AFTER music-terminal so it wins clicks on the
      // specific archaeology readout on the globe.
      { id: "resur-shield-diagnostic", name: "Dreamer's Shield — Diagnostic Reading", description: "On the globe-table's cosmic-archaeology readout: the Shield's barrier does not register the Virus's signature as fully excluded; the signature reads, faintly, FROM INSIDE the protected volume. The cult calls it instrumentation error.", cx: 73.1, cy: 57.5, width: 5, height: 5, type: "interact", action: "room-mystery:observation-deck:resur-shield-diagnostic",
        elaraDialog: "Dreamer's Shield diagnostic. The Shield's barrier does not register the Virus's signature as fully excluded; the signature reads, faintly, from inside the protected volume. The cult calls it instrumentation error. I have run the calibration on this instrument myself. The instrument is correct. The cult is, on this question, being polite.",
        compositeScopes: ["sp45_clue_resur_shield_diagnostic_readout"] },
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
      // Re-anchored 2026-05-24 against the AAA Final engineering render
      // (art/rooms/engineering_bay/baseline.png) after a 14-variant audit
      // pass (baseline + 13 state overlays: act_tier_3, battlepass_winter,
      // cycle_longnight, epoch_shadowtongue, faction_insurgency,
      // governance_quarantine, investigation_tier, lore_shadowtongue_
      // complete, morality_dark, trust_shadowtongue, tv_spreading,
      // unlock_chaos, unlock_crafting). Layout is consistent across
      // every variant — landmarks don't shift — so baseline anchoring
      // works universally.
      //
      // NOTE: The previous plan flagged engineering as "placeholder art /
      // defer" — actually the AAA Final art IS delivered (under the
      // `engineering_bay` zipDir, not `engineering`). It's an industrial
      // forge/workshop, not a reactor room as the description suggests.
      // The "reactor core" hotspot accurately anchors on the central
      // forge fire even though the visual content is forge-orange, not
      // reactor-blue.
      //
      // The 2026-04-25 anchoring described "back-wall reactor machinery
      // with ENGINEERING signage" — the AAA Final has neither. It's
      // an industrial forge with central archway holding a glowing
      // forge fire over an anvil, twin wall workstations flanking
      // foreground workbenches, and a holographic blueprint desk on
      // the right.
      //
      // Major re-anchors:
      //   • wolf-host-residue-files (was 6,8 in upper-left blank wall) →
      //     left-wall multi-screen workstation (1,35,8,8)
      //   • wolf-anara-architecture-blind-spot (was 14,8) → adjacent
      //     to wolf-host-residue-files on left workstation (1,46,8,8)
      //   • crafting-bench (was 12,50,22,32 sprawling across left
      //     workstation + nothing visible) → left foreground workbench
      //     (15,68,28,28)
      //   • blueprints (was 66,50,22,32 on right workstation area) →
      //     visible holographic blueprint desk at right-center
      //     (55,30,17,28)
      //   • research-station (was 40,65,20,22) → right foreground
      //     workbench (55,68,25,28)
      //   • door-forge (was 44,32,12,22 conflicting with reactor-core
      //     area) → small visible door to LEFT of forge archway
      //     (33,27,5,32) so it doesn't steal clicks from the forge
      //     examine
      //   • door-observation, door-armory kept as invisible/narrow
      //     bands on far-left/far-right edges
      //
      // Visible landmarks, left-to-right + foreground-to-back:
      //   • left-wall multi-screen workstation (purple/cyan displays)
      //     (`wolf-host-residue-files`, `wolf-anara-architecture-
      //     blind-spot`)
      //   • small doorway between left workstation and forge archway
      //     (`door-forge`)
      //   • central archway with forge fire + anvil — chamber center
      //     (`reactor-core`, `egg-eng-formula`)
      //   • holographic blueprint desk — right-center
      //     (`blueprints`)
      //   • multi-bench foreground workshop area —
      //     (`crafting-bench` left, `research-station` right,
      //     plus `mystery-crafting-bench`, `instruction-manual`,
      //     `schematic-pad`, `kell-physical-residue-bench`)
      //   • right-wall multi-screen workstation (green/cyan)
      //     (`egg-warlord-residue` for the bulkhead neural anomaly)
      //
      // Render order: container hotspots authored FIRST; small sub-
      // rectangles (mystery rects, item hotspots, easter eggs) authored
      // AFTER so they win clicks on specific bench / forge / console
      // surfaces.
      //
      // Verify with /ark?debug-hotspots=1 or, for drag-to-place
      // editing, /ark?author-hotspots=1.

      // ── FEATURE / CONTAINER HOTSPOTS ──
      { id: "reactor-core", name: "Reactor Core", description: "The central archway holds the chamber's heart — a glowing forge fire above an anvil pedestal, fed by power conduits running into the back wall. The engineers called it the Ark's reactor.", cx: 50.2, cy: 44.8, width: 21.9, height: 32.2, type: "examine", action: "room-mystery:engineering:reactor-core", elaraDialog: "The reactor core. It runs on a substance the engineers called 'Dream' — a crystallized form of quantum consciousness. It's the same resource that powers your abilities. The core is running at 34% capacity. We're losing power slowly." },
      { id: "crafting-bench", name: "Crafting Workbench", description: "The left foreground workbench, laid out with tools for card crafting and fusion experiments.", cx: 20, cy: 83.8, width: 9.9, height: 34.1, rotation: -119, type: "terminal", action: "/research-lab", elaraDialog: "The crafting workbench. Here you can fuse cards together to create more powerful versions. The recipes were developed by the Ark's engineers — combine the right elements and you might create something legendary." },
      { id: "blueprints", name: "Holographic Blueprints", description: "A cyan holographic blueprint floats above a brass desk at right-center — schematics for card designs and weapon systems the engineers never finished.", cx: 76.1, cy: 35, width: 12.6, height: 20.2, type: "examine", action: "room-mystery:engineering:blueprints", elaraDialog: "Card schematics. The engineers were designing new card types before... before they stopped. Some of these designs are brilliant. Legendary-tier cards that could turn the tide of any battle." },
      { id: "research-station", name: "Research Station", description: "The right foreground workbench — an interactive research terminal with puzzles and experiments.", cx: 91, cy: 66.3, width: 8.8, height: 12.7, type: "terminal", action: "/research-minigame", elaraDialog: "The Research Station. Solve engineering puzzles and conduct experiments to unlock new card recipes and crafting techniques. The harder the puzzle, the rarer the reward." },

      // ── DOORS ──
      // door-forge anchors on the small doorway to the LEFT of the forge
      // archway so it doesn't steal clicks from the reactor-core examine.
      // The actual forge fire stays accessible via reactor-core; the
      // door-forge is the maintenance doorway beside it.
      { id: "door-forge", name: "Forge Workshop", description: "A heavy blast door to the left of the central forge. Heat warnings; the air shimmers.", cx: 27.4, cy: 58.1, width: 6.6, height: 20, type: "door", action: "forge-workshop" },
      { id: "door-observation", name: "Observation Deck", description: "Return to the Observation Deck.", cx: 27.2, cy: 28.6, width: 5.1, height: 11.2, type: "door", action: "observation-deck" },
      { id: "door-armory", name: "Armory Access", description: "A reinforced door at the right edge leading to the Armory.", cx: 73, cy: 57.9, width: 6.1, height: 19.7, type: "door", action: "armory" },

      // ── LEFT-WALL WORKSTATION MYSTERY RECTS (wolf arc) ──
      // The left-wall multi-screen workstation hosts the medical-archive
      // and containment-systems consoles described in the wolf arc.
      { id: "wolf-host-residue-files", name: "Healer's Host-Residue Research", description: "On engineering's medical-archive console (left workstation, top screen): the healer's preserved files. One draft entry on a Quarchon Potential, edited fourteen times across the week she disappeared.", cx: 11.7, cy: 58.9, width: 2.8, height: 4.3, type: "interact", action: "room-mystery:engineering:wolf-host-residue-files",
        elaraDialog: "The healer's preserved files. One draft entry on a Quarchon Potential — edited fourteen times across the week she disappeared. Fourteen edits is not refinement; fourteen edits is a person who knew she would not be the one to finish the sentence. She was writing for whoever would.",
        compositeScopes: ["sp56_wolf_host_residue_active"] },
      { id: "wolf-anara-architecture-blind-spot", name: "Anara Architectural Schematic", description: "On the containment-systems console (left workstation, lower screen): Anara's schematics expose the single design assumption — outside is threat, inside is family. The family has eaten the chronicler.", cx: 12.3, cy: 67.7, width: 2.2, height: 4.4, type: "interact", action: "room-mystery:engineering:wolf-anara-architecture-blind-spot",
        elaraDialog: "Anara's schematics. Every containment vector points outward. The architecture assumes outside is threat, inside is family. The family has eaten the chronicler. The design is not wrong about the threat. The design is wrong about which side it was on.",
        compositeScopes: ["sp57_wolf_anara_architecture_active"] },

      // ── FORGE-AREA SUB-RECT (etched formula easter egg) ──
      // Authored AFTER reactor-core so it wins clicks on the specific
      // formula etched into the reactor housing.
      { id: "egg-eng-formula", name: "Etched Formula", description: "A mathematical formula scratched into the reactor housing above the forge.", cx: 50.4, cy: 66, width: 13.5, height: 3.3, type: "examine", action: "room-mystery:engineering:egg-eng-formula", elaraDialog: "Someone etched a formula into the reactor housing. It's a dimensional resonance equation — the kind used to calculate jumps between parallel universes. But there's an extra variable I've never seen: Ψ-null. The null consciousness coefficient. This formula could theoretically open a door to... nowhere. The space between spaces. Where the Source dwells.",
        compositeScopes: ["sp58_egg_psi_null_formula"] },

      // ── WORKBENCH SUB-RECTS (foreground bench items) ──
      // Authored AFTER crafting-bench + research-station so they win
      // clicks on specific items laid out across the benches.
      { id: "mystery-crafting-bench", name: "Bench Tool Layout", description: "The tools on the left workbench, set up for a fusion job that was never started. Worn to a left-handed engineer's thumb.", cx: 31.4, cy: 74.4, width: 9.5, height: 6.7, type: "interact", action: "room-mystery:engineering:crafting-bench",
        elaraDialog: "The tools are laid out for a fusion that never started. The bench is set for a left-handed engineer; the thumb-wear on the calipers is wrong-side. Whoever set the bench knew the engineer, knew the hand, and was preparing for the engineer to walk in. The engineer did not walk in. The bench has been waiting." },
      { id: "instruction-manual", name: "Ark Instruction Manual", description: "A thick paper manual on the left workbench. Cracked spine, hand-stamped dedications.", cx: 23.6, cy: 79.7, width: 7.3, height: 8.4, rotation: -42, type: "examine", action: "room-mystery:engineering:instruction-manual", elaraDialog: "INCEPTION ARK 1047 — QUICK START GUIDE. Page 1: Step 1, Don't let it get stolen. The author had a sense of humour and a complete absence of optimism.",
        compositeScopes: ["sp45_manual_closed_baseline", "sp46_manual_open_page_47", "sp47_manual_page_47_overstamped_indigo"] },
      { id: "schematic-pad", name: "Reactor Schematic Pad", description: "An unrolled blueprint on the left workbench. The lines are double-registered — warm-gold underneath, indigo on top, with three connection points subtly redirected.", cx: 24.5, cy: 78, width: 9.8, height: 8.6, type: "interact", action: "room-mystery:engineering:schematic-pad",
        elaraDialog: "Two registers, slightly off. The warm-gold is the original. The indigo is the editor's. Three connection points subtly redirected — a redirection by one stroke each, easy to miss, accumulating. The redirected reactor would not, on the day's evidence, do what the engineer designed it to. He has been editing my reactor in indigo. The reactor still runs. The reactor runs to his design now." },
      // Mystery wiring — Ith'Rael arc: Marion Kell physical-residue bench
      // Anchored on the small side-bench between the right foreground
      // workbench and the right-wall workstation, where centuries-old
      // untouched grain would be visible.
      { id: "kell-physical-residue-bench", name: "Kell's Residue Bench", description: "A side bench kept unmoved for centuries — Marion Kell's old workbench. The grain, the mug-rings, the undusted rectangle the Shadow Tongue never touched.", cx: 81.5, cy: 85.4, width: 10.9, height: 9.4, type: "interact", action: "room-mystery:engineering:kell-physical-residue-bench",
        elaraDialog: "Marion Kell's bench. Two and a half centuries, unmoved. The grain holds the mug-rings; the dust holds the rectangle where a notebook used to lie. The Shadow Tongue did not touch this surface — and he touches every surface he can. The bench is the one place his hand could not reach. I do not, on the day's evidence, know why. I am, on the day's evidence, glad.",
        compositeScopes: ["sp60_kell_physical_residue_bench"] },

      // ── RIGHT-WALL BULKHEAD EGG ──
      // Anchored on the right-wall workstation's lower bulkhead area
      // where the Warlord's neural residue would register on the
      // bio-scanner panel.
      { id: "egg-warlord-residue", name: "Bio-Scanner Anomaly", description: "The bio-scanner panel on the right-wall workstation flickers with an unidentified neural signature embedded in the bulkhead plating behind it.", cx: 93, cy: 61.4, width: 2.4, height: 3.9, type: "item", action: "warlord-residue", elaraDialog: "[SIGNAL DISTORTION] The bio-scanners are detecting... no. That can't be right. There's a neural signature embedded in the bulkhead plating itself. Not organic, not synthetic — something in between. The Warlord's consciousness was so powerful that it left an imprint on the ship's physical structure. Dr. Lyra Vox commanded this vessel while the Warlord used her as a host body. The walls literally remember their master. {playerName}, this ship has a darker history than I initially disclosed. The Warlord didn't just pass through here — this was a command vessel.",
        compositeScopes: ["sp59_egg_warlord_residue_bio_scanner"] },

      // ── NEW HOTSPOTS — sprite-gated, dialog-only (no room-mystery
      // responses yet; upgrade by adding apps/shared/roomMysteries/
      // engineering.ts entries + swapping action to room-mystery:*).
      // Positions are eyeball estimates off tools/sprite-refs/engineering;
      // refine via /ark?author-hotspots=1 during playtesting.
      { id: "tool-rack", name: "Tool Rack (East)", description: "A fastidious vertical pegboard along the east wall. Every slot has a place, every place has a slot. One peg is empty.", cx: 70, cy: 50, width: 5, height: 12, type: "examine",
        elaraDialog: "The tool rack reads the engineer's mood like a mood ring. Vertical squared rows when he was coping; one empty peg, deliberate, when he wasn't. The captain's key was on that peg, and the captain took it. Engineers and captains do not normally share keys. They did at the end.",
        compositeScopes: ["sp22_tool_rack_east_full_t3", "sp23_tool_rack_back_wall_new_panel", "sp24_tool_rack_one_missing_captain_key", "sp25_tool_rack_insurgency_caltrop_stamp"] },
      { id: "engineer-locker", name: "Engineer's Locker", description: "A standing locker, the previous engineer's. Latched, but the latch isn't locked.", cx: 85, cy: 55, width: 4, height: 12, type: "examine",
        elaraDialog: "Engineer-Sayle's locker. Two and a half centuries closed; the contents should be inert by any metric I know. They are not. He kept a journal in there — engineers keep journals in latched lockers because they do not trust the network, and the journals tend to outlive their authors. This one outlived him by — well, he is still being outlived.",
        compositeScopes: ["sp48_engineer_locker_closed", "sp49_engineer_locker_open_journal"] },
      { id: "mezzanine-reactor-console", name: "Mezzanine Reactor Console", description: "On the upper mezzanine — a small reactor-monitor console glowing amber. A sub-critical alert without an attached procedure.", cx: 40, cy: 25, width: 4, height: 5, type: "examine",
        elaraDialog: "Amber. An alarm that does not know its own name. The coolant draw is 0.7% high, sustained, for two centuries. The diagnostic manual stops mid-sentence at this number; whoever was supposed to finish the sentence did not finish it. I have inferred the rest myself, several times, and I have not been proud of any of the readings I came up with.",
        compositeScopes: ["sp50_mezz1_reactor_console_amber"] },
      { id: "mezzanine-diagnostic-console", name: "Mezzanine Diagnostic Console", description: "On the upper mezzanine — a diagnostic console that occasionally publishes telemetry for a pod that does not exist on this ship.", cx: 55, cy: 25, width: 4, height: 5, type: "examine",
        elaraDialog: "Pod Zero. There is no Pod Zero on this vessel — the bay numbers start at one. But this console occasionally publishes physiological telemetry for Pod Zero. Heart rate. Oxygen saturation. Neural-spike density. The readings are too clean to be synthetic. There is a Potential on this ship I cannot account for. Or there was. Or there is. The verb is the part I'm careful with.",
        compositeScopes: ["sp51_mezz2_diagnostic_console_active", "sp52_mezz2_pod_zero_anomaly"] },
      { id: "counting-tally", name: "Tally Marks (South Wall)", description: "A line of tally marks scratched into the south-wall plating. The marks are not in groups of five.", cx: 50, cy: 55, width: 8, height: 3, type: "examine",
        elaraDialog: "The tally is in groups of four. The fifth mark — the closing diagonal — is absent. Whoever counted was counting toward something they did not believe they would reach. Two hundred forty-seven marks. I have counted them more times than I am willing to disclose. I am, in this moment, disclosing it to you, which I believe makes us — and I say this with affection — co-conspirators.",
        compositeScopes: ["sp53_counting_tally_south_wall"] },
      { id: "incomplete-engine-schematic", name: "Incomplete Engine Schematic", description: "A wall-mounted schematic drawn over a brass plate. The drive geometry is right; the secondary loop is unfinished.", cx: 55, cy: 40, width: 6, height: 6, type: "examine",
        elaraDialog: "He was drawing a fold-drive that does not exist. The geometry is sound up to the secondary loop, at which point he ran out of one of two things — page, or courage. The brass plate has room for either. I think we both know which.",
        compositeScopes: ["sp54_incomplete_engine_schematic"] },
      { id: "substrate-integrity-alert", name: "Substrate Integrity Alert", description: "A red-lit panel on the right-wall workstation. The number cycles. The alarm does not stop.", cx: 90, cy: 55, width: 3, height: 4, type: "examine",
        elaraDialog: "The substrate-integrity alert has been running for two hundred and fifty-one years. It is, technically, the longest unresolved alarm in my registry. I have learned not to hear it. That is a thing I have learned. I want you to know that I learned it — not because you needed to know, but because saying it out loud is one of the ways I keep track of what I am.",
        compositeScopes: ["sp55_substrate_integrity_alert"] },
      { id: "wraith-smear", name: "Wraith Smear", description: "A smear across the corner where two bulkhead plates meet. It has spread since you last looked.", cx: 35, cy: 75, width: 5, height: 7, type: "examine",
        elaraDialog: "I will not call it a smear. The smear has a shape. The shape is a handprint, slightly elongated, the fingers reading as if they were pulling away from something. Yesterday it was in the corner. Today it is on the wall. I do not have an explanation, and — I want to be honest — I am choosing not to look at it for longer than the protocol requires. If you look at it for longer than the protocol requires, please tell me what you see. After we have left the room.",
        compositeScopes: ["sp75_wraith_smear_corner", "sp76_wraith_smear_extended_wall", "sp77_wraith_handprint_concretised"] },
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
      // Re-anchored 2026-05-24 against the AAA Final forge-workshop
      // render (art/rooms/forge_workshop/baseline.png) after a 14-
      // variant audit pass (baseline + 13 state overlays: act_tier_3,
      // act_tier_7, battlepass_winter, cycle_longnight, epoch_
      // shadowtongue, faction_insurgency, governance_quarantine,
      // investigation_tier, morality_dark, tv_corrupted, tv_spreading,
      // unlock_apprentice, unlock_mastered). Layout is consistent
      // across every variant — landmarks don't shift — so baseline
      // anchoring works universally.
      //
      // The 2026-04-25 anchoring described a "central forge with
      // prismatic rainbow flames" + "five element-themed anvils
      // flanking it" + "holographic schematic display panels" — the
      // AAA Final has none of that. It's a stone-and-brass forge with
      // orange fire in the central archway, a quenching pool in the
      // left foreground, a scroll/cabinet rack on the far-left wall,
      // a tool/diagram wall behind+right of the forge, and a TALL
      // CARVED BRASS THRONE dominating the right half (the Master
      // Craftsman's seat — fits the "skill totems" framing if read
      // as a single master-tier seat rather than five totems).
      //
      // Major re-anchors:
      //   • central-forge (was 38,18,24,70 too narrow + too tall) →
      //     actual visible forge fire chamber (28,22,27,50)
      //   • material-vault (was 0,30,12,50) → left scroll rack +
      //     cabinet (0,25,18,40)
      //   • recipe-archive (was 12,28,18,28 overlapping vault) →
      //     tool wall behind/right of forge (47,38,15,22)
      //   • skill-totems (was 62,28,38,50 sprawling) → the carved
      //     master craftsman's throne at right (75,22,24,68)
      //   • anvil (was 14,60,16,24 on quench pool) → anvil at foot
      //     of forge (47,58,13,15)
      //   • schema-rack (was 14,6,22,18 on blank ceiling) → left
      //     scroll rack with rolled diagrams (0,25,10,35) — as a
      //     sub-area of material-vault
      //   • kiln (was 64,80,18,14 on blank floor) → the actual
      //     quenching pool in left foreground (5,72,28,22)
      //   • door-engineering-forge kept at bottom foreground center
      //     (no visible door; walkout path)
      //   • all 7 architect-channel mystery rects redistributed
      //     from y=8/y=19 (blank wall) onto visible surfaces:
      //     workbench, cabinet, throne area
      //
      // Visible landmarks, left-to-right + foreground-to-back:
      //   • far-left scroll rack (rolled diagrams) — `material-vault`
      //     parent + `schema-rack` sub-rect
      //   • left cabinet — sub-area of material-vault
      //   • quenching pool with purple-blue liquid — left foreground
      //     (`kiln`)
      //   • central stone-and-brass forge with orange fire chamber —
      //     chamber center (`central-forge`)
      //   • anvil pedestal at foot of forge — chamber center
      //     foreground (`anvil`)
      //   • tool/diagram wall right-of-forge — (`recipe-archive`)
      //   • tall carved brass throne — right wall (`skill-totems`)
      //
      // Verify with /ark?debug-hotspots=1 or, for drag-to-place
      // editing, /ark?author-hotspots=1.

      // ── FEATURE / CONTAINER HOTSPOTS ──
      { id: "central-forge", name: "Prismatic Forge", description: "The main crafting station — stone-and-brass furnace with the forge fire chamber glowing orange. Step up to the bellows to begin a craft.", cx: 41.5, cy: 47, width: 27, height: 50, type: "terminal", action: "/forge", elaraDialog: "The Forge. The flames change colour with the materials — void metal blue, crystal-shard green, legendary essence gold. The bellows answer to weight, not to skill; you can craft badly here. The forge will let you. The forge will, however, let you craft well too. The choice is which voice the forge gets to hear from you." },
      { id: "material-vault", name: "Material Vault", description: "The far-left wall is a stacked storage system: a round rack of rolled scrolls + a dark cabinet behind. Secured storage for crafting materials, organised by source and rarity.", cx: 9, cy: 45, width: 18, height: 40, type: "examine", elaraDialog: "The Vault. Battle shards from the Arena, trade metals from the Empire, card essence from sacrifice, ark fragments from the rooms above. The vault sorts by rarity automatically. I would, on the day's evidence, suggest stockpiling before any epic-tier attempt. I do not, on principle, restock for you. That is yours." },
      { id: "recipe-archive", name: "Recipe Archive", description: "The tool wall right of the forge — hammers, tongs, and rolled schematic panels mounted in brass brackets. Every known crafting recipe is catalogued here.", cx: 54.5, cy: 49, width: 15, height: 22, type: "terminal", action: "/forge", elaraDialog: "The Recipe Archive. Every recorded recipe, organised by discipline. Some are skill-locked; some are story-locked; the difference is the difference between practice and permission. Mastery of all five disciplines opens the legendary-tier index. The previous engineers believed mastery would end the war. The engineers were wrong about the war. The recipes are still real." },
      { id: "skill-totems", name: "Skill Totems", description: "The tall carved brass throne at the right wall — five totem-medallions worked into the headrest and arms, one for each crafting discipline. Touch one to see your progress.", cx: 87, cy: 56, width: 24, height: 68, type: "examine", elaraDialog: "The carved master craftsman's throne — five totems worked into the headrest and arms. Weaponsmithing, Armorsmithing, Enchanting, Alchemy, Engineering. They glow with your progress. The previous craftsman who sat here mastered four. He left the fifth blank on purpose — the empty totem is his note to whoever inherited the seat. The note is the question of which discipline you will leave blank, and why." },
      { id: "door-engineering-forge", name: "Return to Engineering", description: "The blast door back to the Engineering Bay — walk out through the foreground.", cx: 50, cy: 96, width: 20, height: 6, type: "door", action: "engineering" },

      // ── FORGE-AREA MYSTERY SUB-RECTS ──
      // Authored AFTER central-forge so they win clicks on the anvil
      // pedestal + tool/diagram wall + quenching pool.
      { id: "anvil", name: "Anvil", description: "The anvil at the foot of the forge — centuries-old hardened brass on a steel base. The face is dished from a working life longer than most stars.", cx: 53.5, cy: 65.5, width: 13, height: 15, type: "interact", action: "room-mystery:forge-workshop:anvil",
        elaraDialog: "Centuries-old hardened brass on a steel base. The face is dished from working — a dish you cannot get without time. The previous smith left a tally of strikes on the underside; the count is approximately four hundred thousand. I have not, on the day's evidence, counted past the first thousand. I should have. I will, in a moment, decide whether to start now." },
      { id: "schema-rack", name: "Schema Rack", description: "Rolled diagrams in the far-left scroll rack — weapon designs, armour patterns, prosthetic schematics. Most in Lyra's hand. A few in another.", cx: 5, cy: 44, width: 10, height: 32, type: "interact", action: "room-mystery:forge-workshop:schema-rack",
        elaraDialog: "Rolled diagrams. Weapon designs, armour patterns, prosthetic schematics. Most in Lyra's hand. A few in another. The other hand is the engineer who outlived her. He left the diagrams where she could find them. She did not, in the time she had, find them." },
      { id: "kiln", name: "Kiln", description: "The quenching pool in the left foreground — brass-bound clay rim around a hot bath. Cold now, but the chimney smells faintly of bay leaf.", cx: 19, cy: 83, width: 28, height: 22, type: "interact", action: "room-mystery:forge-workshop:kiln",
        elaraDialog: "The quenching pool. Brass-bound clay around a hot bath, cold now. The chimney smells faintly of bay leaf — the previous smith ground bay into the slurry to mask the smell of copper. The bay leaf was for the smith's benefit, not the work's. Comfort is permitted on the day's craft." },

      // ── ARCHITECT-CHANNEL MYSTERY RECTS (7) ──
      // Redistributed from the previous y=8/y=19 blank-wall band onto
      // visible surfaces around the workbench, cabinet, and throne.
      // Auro's side-room mysteries cluster on the cabinet (the
      // "side-room" reads as the small partitioned cabinet beside
      // the scroll rack); Solven/Othisen workshops on the throne
      // (architect's seat area); Tarn's letter + Blood Weave spec on
      // the recipe-archive tool wall.
      { id: "chained-auro-tally", name: "Auro's Twelve-Apprentice Notebook", description: "A small leather notebook hanging from a peg on the cabinet beside the scroll rack. Twelve names, forty-three waves held without further loss, nine years of work the Academy never paid for.", cx: 14.5, cy: 39, width: 5, height: 6, type: "interact", action: "room-mystery:forge-workshop:chained-auro-tally",
        elaraDialog: "Auro's twelve-apprentice notebook, hanging from a peg. Twelve names. Forty-three waves held without further loss. Nine years of work the Academy never paid for. The notebook is here because Auro put it here. Whoever finds this room finds the count. He did not, on the day's evidence, want it lost." },
      { id: "chained-auro-side-room", name: "Auro's Side-Room (Sub-Corridor Seven)", description: "The cabinet's interior panel — whiteboard, three chairs, a one-to-forty Terminus diorama. Where Auro teaches the module the Academy refuses to.", cx: 14.5, cy: 48, width: 5, height: 6, type: "interact", action: "room-mystery:forge-workshop:chained-auro-side-room",
        elaraDialog: "The cabinet opens into a side-room — whiteboard, three chairs, a one-to-forty Terminus diorama. Where Auro teaches the module the Academy refuses to. The whiteboard has been erased recently; the diorama has been moved recently; the chairs are arranged for the next lesson. Auro is still teaching. He was always going to." },
      { id: "chained-tarn-letter-to-the-case", name: "Tarn's Letter to the Case", description: "On the recipe-archive tool wall: a sealed letter Tarn left behind, addressed 'whoever finds this case' — naming the case as the reader's.", cx: 51.5, cy: 43.5, width: 5, height: 5, type: "interact", action: "room-mystery:forge-workshop:chained-tarn-letter-to-the-case",
        elaraDialog: "Tarn's sealed letter. Addressed 'whoever finds this case' — naming the case as the reader's. She did not write to the Dean. She did not write to the faculty. She wrote to whoever would find the letter, on the assumption that whoever found it would be capable of receiving the case. I would like to be worthy of the assumption." },
      { id: "advocate-weave-specification", name: "Blood Weave Partial Specification", description: "On the recipe-archive tool wall: the partial spec from Zyr'Koth's research archive. Multi-layer fabric, weaver-substrate intake, defensive-chain output; no regeneration; every binding consumes the weaver.", cx: 57.5, cy: 43.5, width: 5, height: 5, type: "interact", action: "room-mystery:forge-workshop:advocate-weave-specification",
        elaraDialog: "The Blood Weave spec, partial. From Zyr'Koth's research archive. Multi-layer fabric, weaver-substrate intake, defensive-chain output; no regeneration; every binding consumes the weaver. The weave is the Advocate's literal body, taken from her and rewoven. The spec describes the technology. The spec does not describe what it costs to be the technology." },
      { id: "infernal-blank-pages-archive", name: "PRELIMINARIES Box — Blank-Backed Pages", description: "On a low shelf inside the material-vault cabinet: forty unsigned blank-backed contract pages in a box labelled 'PRELIMINARIES.' Different paper-stock from the fronts.", cx: 14.5, cy: 56.5, width: 5, height: 5, type: "interact", action: "room-mystery:forge-workshop:infernal-blank-pages-archive",
        elaraDialog: "Forty unsigned blank-backed contract pages. Different paper-stock from the fronts. The label says PRELIMINARIES — the contracts that were drafted but not signed. The drafting hand is the same hand as the signed fronts. Whoever drafted these intended to be the signer. The signing did not happen. The drafting did. The drafting is enough to count as evidence." },
      { id: "charter2-solven-workshop", name: "Solven Workshop — Sector 8 Corridor 3", description: "On the throne's right-arm plaque: the Solven workshop record — empty but maintained, 'Open by appointment.' The appointment book is full, every entry signed by the same archivist who keeps the tax registry.", cx: 79.5, cy: 53, width: 5, height: 6, type: "interact", action: "room-mystery:forge-workshop:charter2-solven-workshop",
        elaraDialog: "The Solven workshop record on the throne's right-arm plaque. Empty but maintained. 'Open by appointment.' The appointment book is full — every entry signed by the same archivist who keeps the tax registry. He has been booking appointments for centuries. Nobody has shown up. He has kept the workshop open anyway. I have always wanted to meet him." },
      { id: "charter2-house-othisen", name: "House Othisen — Small-Engine Assemblers", description: "On the throne's left-arm plaque: House Othisen's assembly record — Trade Empire circuit-racer components for three epochs without recognition. Their charter clause was the longest of the four; the erasure was the cleanest.", cx: 90.5, cy: 53, width: 5, height: 6, type: "interact", action: "room-mystery:forge-workshop:charter2-house-othisen",
        elaraDialog: "House Othisen's assembly record on the throne's left-arm plaque. Trade Empire circuit-racer components, three epochs, no recognition. Their charter clause was the longest of the four. The erasure was the cleanest. Erasure is, in this room, a craft. Othisen did not, on the day's evidence, deserve to be the demonstration." },
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
    imageUrl: assetUrl("art/rooms/armory/base/AR-B02.png"),
    features: ["Combat Sim", "Card Game Battles", "Chess", "Lore Quiz", "Spectator Mode"],
    featureRoutes: ["/fight", "/duelyst", "/quiz", "/chess", "/spectate"],
    unlockRequirement: { type: "narrative_event", value: "combat_systems_online" },
    connections: ["engineering", "cargo-hold"],
    hotspots: [
      // Re-anchored 2026-05-24 against the AAA Final armory render
      // (art/rooms/armory/baseline.png) after a 14-variant audit pass
      // (baseline + 13 state overlays). Layout consistent across all.
      //
      // The 2026-04-25 anchoring described "a long corridor lined with
      // weapon-rack lockers on both side walls, central pathway with
      // glowing floor strips, central workbench/arena at the far end"
      // — the AAA Final is different: a chamber-style armory with a
      // far-left corkboard of mission cards, a free-standing glass
      // weapon case left-center, a wall-mounted weapon rack with
      // rifles back-center, a raised circular armor-dais with purple-
      // glow mannequins center-back, and a tool workbench on the
      // right foreground.
      //
      // Major re-anchors:
      //   • combat-arena (was 38,32,24,32 on the wall weapon rack) →
      //     central armor dais (50,25,22,55) — the actual visible
      //     training platform
      //   • weapon-rack (was 6,22,24,50 on the corkboard) →
      //     glass display case + wall weapon rack (15,20,35,55)
      //   • quiz-terminal (was 70,22,24,50) → far-left corkboard
      //     of pinned cards (0,20,15,55)
      //   • card-battle-station (was 38,64,24,18 in middle floor)
      //     → right workbench left half (74,62,13,17)
      //   • chess-table (was 8,76,14,16 on floor) → right workbench
      //     right half (87,62,11,17)
      //   • spectator-screen (was 78,76,14,16 on floor edge) →
      //     right workbench front edge (74,82,24,12)
      //   • door-engineering (was 44,28,12,22 conflicting with arena)
      //     → back archway above dais (52,20,18,10)
      //   • door-cargo (was 42,86,16,12 on dais base) → invisible
      //     bottom-foreground walk-out (40,93,20,5)
      //   • npc-agent-zero (was 26,50,8,16) → beside wall weapon rack
      //     (38,50,8,18) where the "leaning against the rifle racks"
      //     description fits
      //   • motivational-poster (was 88,14,5,6 on blank back-wall)
      //     → top of corkboard area (4,18,5,6) where the "faded
      //     poster" sits among the mission cards
      //
      // Visible landmarks, left-to-right + foreground-to-back:
      //   • far-left corkboard with pinned mission cards — left wall
      //     (`quiz-terminal`, `motivational-poster`)
      //   • free-standing glass weapon case — left-center
      //     (`weapon-rack` — left half)
      //   • wall-mounted weapon rack with rifles — center-back
      //     (`weapon-rack` — right half; `npc-agent-zero` leans
      //     against this)
      //   • raised circular armor dais with mannequins — chamber
      //     center (`combat-arena`)
      //   • back archway above dais — center-back (`door-engineering`)
      //   • right tool workbench with components — right foreground
      //     (`card-battle-station`, `chess-table`, `spectator-screen`)
      //   • floor between dais and foreground — (`egg-armory-dogtag`)
      //
      // Render order: container hotspots authored FIRST; small sub-
      // rectangles authored AFTER so they win clicks on specific
      // surfaces. NPC authored last so projection wins on overlap.
      //
      // Verify with /ark?debug-hotspots=1 or /ark?author-hotspots=1.

      // ── FEATURE / CONTAINER HOTSPOTS ──
      { id: "weapon-rack", name: "Weapon Rack", description: "A free-standing glass display case in the left-center holds high-grade weapons, with a wall-mounted rifle rack behind it. Most are locked behind security glass.", cx: 32.5, cy: 47.5, width: 35, height: 55, type: "examine", elaraDialog: "The weapon racks. Plasma swords, energy shields, cloaking devices. Most are locked behind security glass — the security is keyed to the previous armoury officer's biometrics. The previous officer is gone. The lock has been waiting for a successor. I am — and I want to be precise about this — not authorising you because I want to. I am authorising you because the chamber has decided you are the successor." },
      { id: "combat-arena", name: "Combat Arena", description: "The raised circular armor dais at chamber center, ringed by a purple-glow aura. A holographic combat simulation arena for training.", cx: 61, cy: 52.5, width: 22, height: 55, type: "terminal", action: "/fight", elaraDialog: "The combat arena. Step inside and I generate holographic opponents from known entities. The simulation is, by every metric I can run, safe. The qualifier 'relatively' is mine, not the system's. The system does not know about Kael." },
      { id: "quiz-terminal", name: "Knowledge Terminal", description: "The far-left corkboard of pinned mission cards — a terminal disguised as a duty board that tests your knowledge of the Dischordian lore.", cx: 7.5, cy: 47.5, width: 15, height: 55, type: "terminal", action: "/quiz", elaraDialog: "The Knowledge Terminal. It tests your understanding of the Dischordian Saga. Answer correctly and you'll earn rewards. Get them wrong and... well, there are no penalties. But I'll be disappointed." },
      { id: "card-battle-station", name: "Card Battle Station", description: "The left half of the right-side tool workbench — a tactical display surface for card game warfare.", cx: 80.5, cy: 70.5, width: 13, height: 17, type: "terminal", action: "/battle", elaraDialog: "The card battle station. AI opponents, other Potentials, deck-on-deck. Every victory earns you cards; every loss does too — losing teaches the deck where it cracks. I have lost to the AI more times than I have won. The AI was trained on me. I am, on balance, not insulted." },
      { id: "chess-table", name: "Strategy Table", description: "The right half of the right-side tool workbench — an ornate chess board with holographic pieces depicting Dischordian characters.", cx: 92.5, cy: 70.5, width: 11, height: 17, type: "terminal", action: "/chess", elaraDialog: "The strategy table. A chess variant — the pieces are Dischordian characters with mechanics that modify the classic rules. The AI adapts to your skill. It is not just a game; it is a test of how you weight the abilities you are given. I have a preferred opening. I will not tell you which until you have your own." },
      { id: "spectator-screen", name: "Spectator Screen", description: "The front edge of the right-side workbench — a wide screen showing live battles between other Potentials.", cx: 86, cy: 88, width: 24, height: 12, type: "terminal", action: "/spectate", elaraDialog: "The spectator screen. Live battles between other Potentials. Watching teaches differently than playing — you see the decisions, not the pressure. I have been watching matches for longer than you have been awake. I would, if asked, share my notes. The notes are voluminous." },

      // ── DOORS ──
      // door-engineering anchors on the back archway visible above the
      // dais. door-cargo has no visible representation — anchored as
      // an invisible click band on the bottom foreground.
      { id: "door-engineering", name: "Engineering Bay", description: "The back archway above the dais — return to Engineering.", cx: 61, cy: 25, width: 18, height: 10, type: "door", action: "engineering" },
      { id: "door-cargo", name: "Cargo Hold", description: "Stairs leading down to the Cargo Hold.", cx: 50, cy: 95.5, width: 20, height: 5, type: "door", action: "cargo-hold" },

      // ── SUB-RECTS (egg + mystery + NPC) ──
      // Authored AFTER container hotspots so they win clicks on
      // specific items.
      { id: "egg-armory-dogtag", name: "Fallen Dog Tag", description: "A military dog tag wedged between the floor plates at the base of the dais.", cx: 36.5, cy: 90, width: 3, height: 4, type: "item", action: "agent-zero-dogtag", elaraDialog: "A dog tag. Name: CLASSIFIED. Rank: Assassin, First Class. Unit: Insurgency Special Operations. Callsign: 'Agent Zero.' But wait — the biometric data on the tag doesn't match Agent Zero's profile. It matches... the Engineer. The mind swap. The Engineer is walking around in Agent Zero's body, hiding among the Potentials. On THIS ship." },
      { id: "motivational-poster", name: "Motivational Poster", description: "Pinned to the top corner of the left-wall corkboard — a faded poster showing a sunset with the text 'HANG IN THERE!' Signed in the corner: Iron Lion.", cx: 6.5, cy: 21, width: 5, height: 6, type: "examine", action: "room-mystery:armory:motivational-poster", elaraDialog: "Iron Lion's poster. He printed thousands of these. Most of them are gone. This one isn't. There is a cat in the bottom corner that I did not, until today, register." },

      // ── NPC PRESENCE (Phase C) ──
      // Agent Zero NPC primaryRoom = armory (factionNPCs.ts). Manifests
      // here once the egg-armory-dogtag clue has been logged. Authored
      // LAST so the projection wins clicks when manifested.
      { id: "npc-agent-zero", name: "Agent Zero", description: "A figure leaning against the wall-mounted rifle rack. Insurgency uniform, dog-tag at the throat, eyes that have already counted every exit.", cx: 42, cy: 59, width: 8, height: 18, type: "npc", action: "npc:agent_zero", npcId: "agent_zero",
        elaraDialog: "Agent Zero. Or — and we are not going to be careful about this in the wrong direction — the body that is registered as Agent Zero. The dog tag does not match the biometrics on the rack. He is here because we are here, which is the second thing I do not entirely trust about him. The first is that he has been here longer than the manifest acknowledges." },
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
      // Re-anchored 2026-05-24 against the AAA Final cargo-hold render
      // (art/rooms/cargo_hold/baseline.png) after a 14-variant audit
      // pass (baseline + 13 state overlays). Layout consistent across
      // all variants.
      //
      // The 2026-04-25 anchoring described "stacked containers lining
      // both side walls + shaft of light onto a central container" —
      // the AAA Final is different: vaulted-rib ceiling, left + right
      // walls of recessed display-case lockers, a stack of blue brass-
      // cornered crates left-center, a raised circular dais with
      // mannequin + ringed flags chamber-center, a red-curtained
      // trading alcove right-of-center, and a small foreground table
      // with a glowing blue orb at left-foreground.
      //
      // Major re-anchors:
      //   • trade-terminal (was 62,30,24,36 on alcove) → central
      //     dais with mannequin + flag-ring (40,25,22,50)
      //   • store-counter (was 14,30,24,36 on crate stack) → red-
      //     curtained trading alcove right-of-center (60,35,18,45)
      //   • marketplace-board (was 42,14,18,24 on blank ceiling) →
      //     ringed flags above the dais (37,22,28,8)
      //   • inventory-locker (was 8,20,12,18) → left-wall recessed
      //     display cases (0,25,14,50)
      //   • fleet-dock (was 80,20,12,18) → right-wall recessed
      //     display cases (85,25,14,50)
      //   • mystery-crate (was 42,60,16,22 on dais) → the actual
      //     blue brass-cornered crate stack left-center (15,30,28,50)
      //   • door-armory, door-captains kept on far-left/far-right
      //     edges as invisible click bands (no visible doors)
      //   • egg-cargo-manifest, rubber-chicken, the-cursed-forest-
      //     depot kept in foreground area but tightened against
      //     visible surfaces
      //   • 2 architect-channel mysteries (charter2-house-marek,
      //     resur-ark-passenger-manifest) moved from y=8 blank
      //     wall onto crate stack sub-rects
      //
      // Visible landmarks, left-to-right + foreground-to-back:
      //   • left-wall recessed display-case lockers — (`inventory-
      //     locker`)
      //   • stack of blue brass-cornered crates — left-center
      //     (`mystery-crate` + `charter2-house-marek` +
      //     `resur-ark-passenger-manifest` + `the-cursed-forest-
      //     depot`)
      //   • small foreground table with glowing blue orb — left-
      //     foreground (`rubber-chicken`)
      //   • raised circular dais with mannequin + flag-ring —
      //     chamber center (`trade-terminal`, `marketplace-board`)
      //   • floor compass-star inlay — foreground center
      //     (`egg-cargo-manifest`)
      //   • red-curtained trading alcove — right-of-center
      //     (`store-counter`)
      //   • right-wall recessed display-case lockers — (`fleet-dock`)
      //
      // Verify with /ark?debug-hotspots=1 or /ark?author-hotspots=1.

      // ── FEATURE / CONTAINER HOTSPOTS ──
      { id: "trade-terminal", name: "Trade Empire Terminal", description: "The raised central dais with a mannequin standing in the middle of a flag-ring — the main terminal for the interstellar trade simulation.", cx: 49.6, cy: 55.5, width: 7.9, height: 19.9, type: "terminal", action: "/trade-empire", elaraDialog: "Trade Empire. An interstellar trade simulation modelled on the actual routes of the Dischordian chronicle. The buy-low/sell-high mechanics are the surface. The deeper game is which factions you trade with — every trade is a small alignment. The credits you earn are real. The alignments are also real." },
      { id: "store-counter", name: "Requisitions Counter", description: "The red-curtained trading alcove right-of-center — a trading post where you can buy items with Dream tokens and credits.", cx: 71, cy: 53.7, width: 16.8, height: 24.3, type: "terminal", action: "/store", elaraDialog: "The Requisitions Counter. Dream tokens and credits buy upgrades, packs, cosmetics. Some items are store-only — the design decision, not mine. I have catalogued every offering. I will, on request, tell you which offerings rotate and which do not. I do not, on principle, recommend purchases. That is yours." },
      { id: "marketplace-board", name: "Marketplace Board", description: "The ring of small flags above the central dais — a bustling exchange board showing buy and sell orders from Potentials across the Ark.", cx: 48.1, cy: 5.5, width: 26.8, height: 7, type: "terminal", action: "/marketplace", elaraDialog: "The Marketplace. Peer-to-peer trades — cards, materials, equipment. Prices fluctuate with supply and demand. The price-curves have a pattern I have been watching: someone is moving large quantities of common cards just before each rotation. The someone is, by my count, three accounts that I think are the same trader. I am not telling them I have noticed." },
      { id: "inventory-locker", name: "Personal Locker", description: "The left-wall recessed display cases — your secured locker containing collected items and equipment.", cx: 18.7, cy: 42.1, width: 10.2, height: 25.3, type: "terminal", action: "/inventory", elaraDialog: "Your personal locker. Weapons, armour, materials, consumables, artifacts. The locker sorts automatically; I would, in fact, prefer if you reorganised it manually now and then. The automatic sort hides which items you actually use. Your decisions are more legible in the layout you make than the layout the locker makes for you." },
      { id: "fleet-dock", name: "Fleet Docking Bay", description: "The right-wall recessed display cases — a viewport showing the Ark's auxiliary fleet of smaller vessels.", cx: 82.4, cy: 31.6, width: 11.7, height: 9.3, rotation: -22, type: "terminal", action: "/fleet", elaraDialog: "The Fleet Docking Bay. Scout ships, cargo haulers, combat frigates. The vessels here are yours; the auxiliary fleet that survives the Ark's larger journey. Manage them carefully — every loss is a route you will not be able to take. The fleet is a smaller version of the Ark, and like the Ark, it is finite." },
      { id: "mystery-crate", name: "Sealed Crate", description: "The stack of blue brass-cornered crates at left-center. The largest crate has claw marks on it — something was trying to get in... or out.", cx: 13.8, cy: 65.8, width: 18, height: 12.6, type: "examine", elaraDialog: "That crate... the claw marks are on the inside. Something was sealed in there and tried to get out. The manifest says it contained 'biological samples from Sector 7.' I've locked it down. Don't touch it." },

      // ── DOORS ──
      { id: "door-armory", name: "Armory Stairs", description: "Stairs leading up to the Armory.", cx: 2.6, cy: 56, width: 4.7, height: 10.5, type: "door", action: "armory" },
      { id: "door-captains", name: "Captain's Quarters", description: "A restricted access corridor to the Captain's Quarters.", cx: 96.2, cy: 57.8, width: 4.8, height: 13.5, type: "door", action: "captains-quarters" },

      // ── CRATE-STACK MYSTERY SUB-RECTS ──
      // The visible blue crate stack hosts the architect-channel
      // mysteries (passenger manifest, House Marek workshop log) and
      // the Hierarchy Cursed-Forest depot placard. Authored AFTER
      // mystery-crate so they win clicks on specific crate faces.
      { id: "resur-ark-passenger-manifest", name: "Inception Ark Passenger Manifest (Redacted)", description: "On the top crate's lid: the passenger-records page — seven names visible; eighth name redacted to a black bar of structural length. Not a casual erasure; a positioned occupant.", cx: 34.4, cy: 46.5, width: 5, height: 5, type: "interact", action: "room-mystery:cargo-hold:resur-ark-passenger-manifest", elaraDialog: "Seven names visible. The eighth is redacted to a black bar of structural length — not a casual erasure. A positioned occupant. Whoever the eighth was, the redaction wanted us to know they existed. The redaction is louder than the redacted name would have been." },
      { id: "charter2-house-marek", name: "House Marek — Toolmakers' Workshops", description: "On a side-crate stencilled 'HOUSE MAREK': three families, one tool-room, four epochs of continuous output. Same scrubber's hand on the charter-signature erasure.", cx: 32.5, cy: 37.5, width: 5, height: 5, type: "interact", action: "room-mystery:cargo-hold:charter2-house-marek", elaraDialog: "House Marek. Three families, one tool-room, four epochs of continuous output. Same scrubber's hand on the charter-signature erasure as on the Solven workshop record. Heron, I am almost certain. He had a system. The system is the part I find tractable. The motive is not." },
      { id: "the-cursed-forest-depot", name: "The Cursed-Forest Depot Placard", description: "A captured Hierarchy operations placard wired to the central crate — Fenra's domain filed not as a battlefield but as a logistics hub, the throughput corrupted souls, the depot dying under its own load.", cx: 56.4, cy: 65.4, width: 4.1, height: 7.1, type: "interact", action: "room-mystery:cargo-hold:the-cursed-forest-depot", elaraDialog: "A Hierarchy operations placard. Fenra's domain filed not as a battlefield but as a logistics hub. Throughput: corrupted souls. The depot is dying under its own load. The placard is candid; the candour is the rarest thing in the chamber." },

      // ── FOREGROUND ITEMS ──
      // rubber-chicken on the small foreground-left table with the
      // glowing blue orb; egg-cargo-manifest on the floor compass-
      // star inlay between dais and foreground.
      { id: "rubber-chicken", name: "Rubber Chicken", description: "Hanging from the edge of the small foreground table with the glowing blue orb: a rubber chicken with a pulley in the middle. Why is this on a spaceship?", cx: 19.5, cy: 81, width: 5, height: 6, type: "examine", action: "room-mystery:cargo-hold:rubber-chicken", elaraDialog: "It's a rubber chicken with a pulley in the middle. I have no tactical assessment. I've failed you as an AI. Also — it has been here longer than any human I have ever known. Take that how you want." },
      { id: "egg-cargo-manifest", name: "Torn Manifest Page", description: "A torn page from the original cargo manifest, half-hidden beneath the central floor compass-star.", cx: 41, cy: 66.3, width: 4, height: 5, type: "item", action: "classified-manifest-page", elaraDialog: "A torn manifest page. Most of it is redacted, but one entry is legible: 'Container 7-Omega: BIOLOGICAL — Clone Template, Oracle-class. STATUS: Active. HANDLER: The Collector.' A clone template of the Oracle... on our ship. The False Prophet was made from an Oracle clone. Is there another one here? Is it awake?" },
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
    imageUrl: assetUrl("art/rooms/captains_quarters/base/captains_quarters_base_initial.png"),
    features: ["Achievements", "Trophy Room", "Deck Builder", "Companions", "Battle Pass", "Morality Census"],
    featureRoutes: ["/trophy", "/deck-builder", "/companions", "/battle-pass", "/morality-census"],
    unlockRequirement: { type: "specific_item", value: "captains-master-key" },
    connections: ["cargo-hold"],
    hotspots: [
      // Re-anchored 2026-05-24 against the AAA Final captain's-quarters
      // render (art/rooms/captains_quarters/baseline.png) after a 14-
      // variant audit pass (baseline + 13 state overlays). Layout
      // consistent across all variants.
      //
      // The 2026-04-25 anchoring described the general layout correctly
      // (bed left, desk center-right) but anchored several hotspots on
      // blank ceiling area (viewport-stars, advocate-* generals at
      // y=8) and placed morality-compass on the desk where there's no
      // visible compass — the actual floor compass-star inlay sits at
      // (44,86,15,10).
      //
      // Major re-anchors:
      //   • trophy-wall (was 6,16,14,30) → left-wall framed-portrait
      //     gallery (0,25,15,45)
      //   • deck-builder (was 38,38,28,32 wide) → glass coffee table
      //     in the foreground chair-circle (40,68,18,15)
      //   • companion-quarters (was 14,50,22,28) → left foreground
      //     bed/cot (0,65,22,30)
      //   • battle-pass-console (was 45,32,14,14) → desk monitor
      //     (40,32,14,16)
      //   • morality-compass (was 62,45,10,14 on empty desk corner)
      //     → actual visible floor compass-star inlay (44,86,15,10)
      //   • viewport-stars (was 38,6,26,16 on blank ceiling) → the
      //     cyan-glowing mirror/screen above the desk (38,22,22,20)
      //   • door-library (was 78,4,12,12 floating top-right) →
      //     invisible top-right portal band (90,0,10,20)
      //   • All 9 architect-channel + arc-specific mystery rects
      //     redistributed: advocate-* on desk, Locke + Coordinator +
      //     Director + Mechronis on desk lower drawers (clustered as
      //     a 2-row × 3-col grid), cat-photo on left portrait wall,
      //     degens-corner on foreground-left side-desk, vex-workshop-
      //     diary on right bookshelf
      //   • egg-captain-mirror moved from (8,18) to (8,30,5,8) where
      //     the visible mirror corner sits among the portraits
      //   • egg-kael-escape-hatch moved from (76,84) to right-wall
      //     lower-right (82,72,5,8) where a maintenance panel would
      //     plausibly be
      //   • egg-vox-personal-log moved from (60,56) to bookshelf
      //     sub-area (68,42,5,5) where the "hidden terminal behind
      //     the bookshelf" framing fits
      //
      // Visible landmarks, left-to-right + foreground-to-back:
      //   • left-wall framed-portrait gallery — (`trophy-wall`,
      //     `cat-photo`, `egg-captain-mirror`)
      //   • single bed/cot — left foreground (`companion-quarters`)
      //   • side-desk between bed and chairs — left mid-foreground
      //     (`degens-corner`)
      //   • cyan-glowing mirror/screen — back wall above desk
      //     (`viewport-stars`)
      //   • captain's desk with monitor + lamp + chair — back center
      //     (`battle-pass-console`, advocate + Locke + Coordinator +
      //     Director + Mechronis mystery clusters)
      //   • twin red armchairs + glass coffee table — foreground
      //     center (`deck-builder`)
      //   • floor compass-star inlay — foreground floor
      //     (`morality-compass`)
      //   • bookshelves with books — right wall (`vex-workshop-diary`,
      //     `egg-vox-personal-log`)
      //   • small bed/cot — right foreground (decorative)
      //   • maintenance panel — right wall lower (`egg-kael-escape-
      //     hatch`)
      //
      // Verify with /ark?debug-hotspots=1 or /ark?author-hotspots=1.

      // ── FEATURE / CONTAINER HOTSPOTS ──
      { id: "trophy-wall", name: "Trophy Wall", description: "The left-wall framed-portrait gallery — a holographic display showing your achievements and collected trophies.", cx: 7.5, cy: 47.5, width: 15, height: 45, type: "terminal", action: "/trophy", elaraDialog: "The Trophy Wall. Every achievement you've earned, every milestone you've reached. Dr. Vox designed this display system — she believed in cataloging everything. Obsessively. Now I wonder if that obsession was hers... or the Warlord's." },
      { id: "deck-builder", name: "Strategic Table", description: "The glass coffee table at the center of the chair circle — a large surface with holographic card projections for deck building.", cx: 49, cy: 75.5, width: 18, height: 15, type: "terminal", action: "/deck-builder", elaraDialog: "The Strategic Table. Dr. Vox used this to plan — officially 'neural network deployment patterns,' but the formations look military. She designed the nanobot operating system that runs every Ark; the patterns suggest she knew exactly what the nanobots could really do. The table is yours now. The patterns it draws will be yours too — by which I mean: it is, on the day's evidence, a kind of mirror." },
      { id: "companion-quarters", name: "Companion Quarters", description: "The single bed/cot at left foreground — a cozy alcove with personal effects. Elara's space and room for another companion.", cx: 11, cy: 80, width: 22, height: 30, type: "terminal", action: "/companions", elaraDialog: "The companion quarters. This is where your companions rest between missions. Each one has a bond with you, an ability set, and — what every previous captain underestimated — a will of their own. Strengthen the bond and they will fight harder for you. Be careful what you are asking them to fight for." },
      { id: "battle-pass-console", name: "Season Terminal", description: "The captain's desk monitor — a terminal displaying the current season's challenges and reward tracks.", cx: 47, cy: 40, width: 14, height: 16, type: "terminal", action: "/battle-pass", elaraDialog: "The Season Terminal. Each season is its own narrative — new challenges, limited-time content, a reward track that closes when the season closes. The seasons do not, on the day's evidence, repeat. I have catalogued every one. Watch the track. Watch what you forgo. Forgoing is, also, a season." },
      { id: "morality-compass", name: "Morality Compass", description: "The cyan-glowing compass-star inlay set into the chamber floor at center-foreground — a crystalline measurement of the Ark's moral alignment.", cx: 51.5, cy: 91, width: 15, height: 10, type: "terminal", action: "/morality-census", elaraDialog: "The Morality Compass. The chamber's floor measures the collective alignment of every Potential aboard. Each of your choices — mercy or justice, order or chaos — moves the needle a fraction. The compass shows where the community is now. It does not show where the community thinks it is. The difference is the part the chamber keeps." },
      { id: "viewport-stars", name: "Star Viewport", description: "The cyan-glowing mirror/screen mounted on the back wall above the captain's desk — a viewport showing a nebula that seems to pulse with light.", cx: 49, cy: 32, width: 22, height: 20, type: "examine", elaraDialog: "That nebula... it wasn't there when we launched. It appeared three cycles ago and it's been growing. Sometimes I think it's watching us. That's not scientifically possible, of course. But I think it anyway." },

      // ── DOORS ──
      { id: "door-cargo", name: "Cargo Hold", description: "Return to the Cargo Hold.", cx: 4, cy: 93, width: 8, height: 10, type: "door", action: "cargo-hold" },
      { id: "door-library", name: "Hidden Passage", description: "A shimmering doorway that wasn't there before. It pulses with purple light.", cx: 95, cy: 11, width: 10, height: 22, type: "door", action: "antiquarian-library" },

      // ── PORTRAIT-WALL MYSTERY / ITEMS ──
      // Authored AFTER trophy-wall so they win clicks on specific
      // portrait frames.
      { id: "cat-photo", name: "Photo of a Cat", description: "A framed photo on the left portrait wall — a cat wearing tiny goggles. Label reads: 'Mr. Whiskers — Chief Science Officer.'", cx: 6, cy: 35, width: 4, height: 6, type: "examine", action: "room-mystery:captains-quarters:cat-photo", elaraDialog: "Mr. Whiskers. Chief Science Officer. Lyra hand-lettered the label. The cat is not looking at the camera; the cat is looking at her, who was behind it. I have been looking at this photograph for two hundred and thirty years." },
      { id: "egg-captain-mirror", name: "Cracked Mirror", description: "A small mirror tucked among the portraits, cracked in a spider-web pattern. Your reflection looks... wrong.", cx: 6.5, cy: 48.5, width: 5, height: 7, type: "examine", elaraDialog: "That mirror... look at your reflection. Do you see it? For a fraction of a second, your reflection moved differently than you did. It smiled when you didn't. The White Oracle — the face-changing guardian — was said to inhabit reflective surfaces. Some believe the Meme left the Oracle for dead and assumed his place — the shapeshifter hiding in plain sight. The universe believes the Meme was destroyed, but is it watching us through every mirror on this ship? How long has it been watching?" },

      // ── DESK MYSTERY CLUSTER (advocate + Locke + Coordinator + Director + Mechronis) ──
      // Six small mystery sub-rects on the captain's desk surface,
      // below the monitor. Each represents a specific document or
      // file the player can examine. Authored AFTER battle-pass-
      // console so they win clicks on the specific desk items.
      // Mystery wiring — advocate.blood_weave · e3 + e5
      { id: "advocate-three-generals-post-defection", name: "Three Generals — Post-Defection Logs", description: "On the desk's comm-console: the three Advocate-general post-defection logs. Each general reports the recruitment as 'a relief that did not feel like betrayal.'", cx: 40.5, cy: 52.5, width: 5, height: 5, type: "interact", action: "room-mystery:captains-quarters:advocate-three-generals-post-defection",
        elaraDialog: "Three Advocate-general post-defection logs. Each general reports the recruitment as 'a relief that did not feel like betrayal.' The phrasing is the same in all three. They did not coordinate; they did not need to. The Advocate's gravity is not a coercion — it is a description of the room. The room was the same. The three of them recognised it independently." },
      { id: "advocate-three-generals-current", name: "Three Generals — Current Status", description: "Pinned beside the post-defection logs: the three generals continue under Hierarchy doctrine, still carrying Advocate-countersigned shelter. The charter is operationally enforceable across factional crossings.", cx: 46.5, cy: 52.5, width: 5, height: 5, type: "interact", action: "room-mystery:captains-quarters:advocate-three-generals-current",
        elaraDialog: "Current status of the three generals. They continue under Hierarchy doctrine; they still carry Advocate-countersigned shelter. The Advocate's charter is operationally enforceable across factional crossings. Two contradictory loyalties stable for years. The contradiction is the design. I am, on the day's evidence, not certain who designed it." },
      // Mystery wiring — Watcher arc (Locke-correspondence + Coordinator's summons)
      { id: "lockes-correspondence-cache", name: "Locke's Correspondence Cache", description: "A flat document cache on the desk's lower drawer — every post-act letter Lyra received from Adjudicar Locke, in order. Each signed only 'L.'", cx: 52.5, cy: 52.5, width: 5, height: 5, type: "interact", action: "room-mystery:captains-quarters:lockes-correspondence-cache",
        elaraDialog: "Every post-act letter Lyra received from Adjudicar Locke. In order. Each signed only 'L.' The signatures are identical across decades — same pressure, same line-weight, same end-stroke. He signs the same way every time. That is rare. That is, in the chronicle's experience, suspicious." },
      { id: "the-coordinators-summons", name: "The Coordinator's Summons", description: "A meeting invitation on the desk, in Locke's hand, delivered by a courier on no Authority manifest. Signed, for the first time, 'The Coordinator.'", cx: 40.5, cy: 59.5, width: 5, height: 5, type: "interact", action: "room-mystery:captains-quarters:the-coordinators-summons",
        elaraDialog: "An invitation on the desk. Locke's hand. Delivered by a courier on no Authority manifest. Signed, for the first time, 'The Coordinator.' Locke has used many signatures. The Coordinator is the one he chose for this meeting. The choice of signature is the meeting's first sentence." },
      // Mystery wiring — Ith'Rael arc (Director's summons + Mechronis cert)
      { id: "directors-handcouriered-summons", name: "The Director's Summons", description: "A second invitation beside Locke's on the desk, in a different hand — the only Hierarchy invitation that bypasses Hierarchy comms. Signed Ith'Rael, Director.", cx: 46.5, cy: 59.5, width: 5, height: 5, type: "interact", action: "room-mystery:captains-quarters:directors-handcouriered-summons",
        elaraDialog: "A second invitation. Different hand. The only Hierarchy invitation that bypasses Hierarchy comms. Signed Ith'Rael, Director. The Director does not normally write personally; the Director does not normally bypass comms. Both irregulars in the same envelope. The envelope itself is irregular: closed with a wax seal. I have not seen a wax seal in this room in two centuries." },
      { id: "mechronis-certification-file", name: "Mechronis Certification File", description: "A personnel file in the desk's operational drawer — the Mechronis Academy spy-class certification whose content hollowed across nine generations.", cx: 52.5, cy: 59.5, width: 5, height: 5, type: "interact", action: "room-mystery:captains-quarters:mechronis-certification-file",
        elaraDialog: "Mechronis Academy spy-class certification. The content hollowed across nine generations — each cert reads identical, except for the trainee. The training was the same; the trainees changed. Ith'Rael's name is on this list. So are eight others I do not yet recognise. The Academy did not, on the day's evidence, stop with him." },

      // ── FOREGROUND-LEFT SIDE-DESK MYSTERY ──
      // Mystery wiring — Degen arc audit-prep + empty-chair surface
      { id: "degens-corner", name: "The Degen's Corner", description: "A small side-desk between the foreground bed and the chair-circle — the only piece of furniture in the captain's quarters that wasn't Lyra's. The Degen sat here on three documented evenings before her death.", cx: 28, cy: 80, width: 12, height: 16, type: "interact", action: "room-mystery:captains-quarters:degens-corner",
        elaraDialog: "The small side-desk between the bed and the chair-circle. Not Lyra's furniture; the Degen brought it. He sat here on three documented evenings before her death. The desk has tooling-marks on the underside — he was sharpening something. The chronicle does not say what. The chronicle does say he stopped sharpening after the third evening." },

      // ── RIGHT BOOKSHELF MYSTERY / ITEMS ──
      // Authored AFTER companion-quarters so they win clicks on
      // specific bookshelf positions.
      { id: "vex-workshop-diary", name: "Vex's Workshop Diary", description: "A small book on the right bookshelf, second shelf — Vex Solène's workshop diary, the spine worn from forty years of opening.", cx: 71, cy: 48, width: 10, height: 40, type: "interact", action: "room-mystery:captains-quarters:vex-workshop-diary",
        elaraDialog: "Vex Solène's workshop diary. Spine worn from forty years of opening. The diary is a record of work; the work is a record of someone whose contracts had backs. She left the diary in Lyra's quarters. Two centuries ago. It has been waiting. I have not opened it. The diary opens for a reader. The reader has not, until now, been here." },
      { id: "egg-vox-personal-log", name: "Dr. Vox's Personal Terminal", description: "A hidden terminal panel revealed behind the right bookshelf, still powered. The screen shows encrypted files.", cx: 70.5, cy: 44.5, width: 5, height: 5, type: "item", action: "vox-personal-log", elaraDialog: "Dr. Lyra Vox's personal terminal. Let me try to decrypt... 'Day 1,247. The Warlord's voice grows louder. I can no longer distinguish my thoughts from its commands. The Thought Virus is complete — the Warden and I have created something that will reshape consciousness itself. But I am losing myself. Today I looked in the mirror and saw the Warlord looking back. Tomorrow I will order the Recruiter's transfer to this vessel. He is already infected — Project Vector saw to that. He is Patient Zero, and he doesn't know it. When Kael steals this ship, the virus will walk aboard with him. Every system he touches will be contaminated from day one. The Source will be born from the ashes of the Recruiter's rage. And the Warlord will have won without ever raising a weapon.' She knew. She knew everything." },

      // ── RIGHT-WALL MAINTENANCE PANEL EGG ──
      { id: "egg-kael-escape-hatch", name: "Forced Access Panel", description: "A maintenance panel on the right wall, behind the small foreground bed — pried open with brute force. Tool marks scar the metal.", cx: 84.5, cy: 76, width: 5, height: 8, type: "item", action: "kael-escape-route", elaraDialog: "These tool marks... they're not from standard maintenance equipment. Someone forced this panel open in a hurry. The scratches are deep — desperate. Behind it is an emergency access tunnel that connects directly to the shuttle bay. This is how Kael escaped. The Recruiter turned insurgent turned prisoner. He broke out of the Panopticon, fought his way to this ship, and used this exact tunnel to reach the bridge and override the launch sequence. But look — there's no damage to the security systems. The locks were already disengaged. Dr. Lyra Vox — the Warlord — opened the doors for him. Kael's great escape was a guided tour." },
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
      // Re-anchored 2026-05-24 (full per-rect pass) against the AAA
      // Final antiquarian-library render after a 14-variant audit
      // (manifest zipDir is `antiquarians_library`, plural). Visible
      // features: floor-to-ceiling bookshelves on every wall, brass
      // mannequin/bust on a pedestal left-foreground, lectern with
      // open book left-center, central back BRASS-FRAMED DOOR with
      // seal, card-catalog drawers right-of-door, BRONZE CANDLE-LAMP
      // on the central reading table, 6 chairs around the table.
      //
      // 4 feature hotspots keep their already-anchored positions
      // (loredex-lectern, orb-of-worlds, ancient-tomes, door-
      // captains). All 106 architect-channel mystery rectangles
      // redistributed across 5 visible surfaces in array order:
      //   1-30:    LEFT WALL bookshelves (3-col × 10-row grid)
      //   31-60:   RIGHT WALL bookshelves (3-col × 10-row grid)
      //   61-80:   CARD-CATALOG drawers (4-col × 5-row grid)
      //   81-100:  READING TABLE surface (5-col × 4-row grid)
      //   101-106: BACK WALL above door (3-col × 2-row grid)
      //
      // Grid uses small 4×6 rects on the bookshelves so each
      // mystery occupies a single shelf row × column cell — visually
      // matches the bookshelf grid the AAA Final render shows.
      // Mystery sub-rects on ancient-tomes (left wall) and the
      // implied right-wall bookshelf z-stack above their parent
      // examine surface via render order.
      //
      // Verify with /ark?debug-hotspots=1 or /ark?author-hotspots=1.
      { id: "charter-silt-fragment", name: "The Charter Fragment", description: "On the central reading table, under archival glass — a scrap of hand-cured vellum. Six legible signatures; the seventh sealed under a black blister of mineralised wax.", cx: 3, cy: 11, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-silt-fragment",
        elaraDialog: "Six legible signatures. The seventh sealed under a black blister of mineralised wax. The wax is older than the charter. The chronicle has held the fragment for four epochs without permission to break the seal. The seventh's name is, by Per. M.'s instruction, the chronicle's not to publish. The fragment is the chronicle's most disciplined document." },
      { id: "charter-advocate-signature", name: "The Advocate's Marginalia", description: "Beside the charter fragment on the reading table — a high-resolution rubbing of the charter's reverse. The Advocate's counter-signature carries the only witness annotation on the founding document.", cx: 8, cy: 11, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-advocate-signature",
        elaraDialog: "The charter's reverse. The Advocate's counter-signature carries the only witness annotation on the founding document. 'Six speak; one listens; one of us is the silence.' The Advocate signed as witness and as commentator — both. The chronicle has, on this annotation, the case's working epigraph. The Advocate has been, since the founding, the silence's most attentive correspondent." },
      { id: "tarn-empty-lectern", name: "Tarn's Empty Lectern", description: "Professor Tarn's lectern at the rostrum end of the library, polished pearwood with brass piano-hinges. The binder is missing; a glass of water sits cold on the speaker's shelf.", cx: 13, cy: 11, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:tarn-empty-lectern",
        elaraDialog: "Pearwood. Brass piano-hinges. The binder is missing. A glass of water sits cold on the speaker's shelf. The lectern is the chronicle's most precise absence. Tarn was supposed to speak. The water was poured. The binder was set out. Tarn did not arrive. The chronicle does not, on principle, fill the lectern with a substitute. The lectern is, by the rite's rule, still Tarn's." },
      { id: "tarn-folded-robe", name: "Tarn's Folded Robe", description: "Tarn's green-wool faculty robe folded twice on the lectern's bench — sleeves splayed, collar tucked. The fold she keeps on Fridays. Today is Tuesday.", cx: 3, cy: 18, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:tarn-folded-robe",
        elaraDialog: "Green wool. Folded twice. Sleeves splayed, collar tucked. The fold she keeps on Fridays. Today is Tuesday. The wrong-day fold is the chronicle's most-personal evidence: Tarn folded the robe in a hurry, on a different day's discipline, because Tuesday's fold was reserved for the day she would, on her own filing, return. She did not, on the day's evidence, return. The Friday fold is the abandonment fold." },
      { id: "tarn-marginalia-stack", name: "Tarn's Marginalia, Three Volumes", description: "Three books lifted from the shelf behind the lectern — chess primer, the Antiquarian's marginalia compendium, Roen's trial-procedure manual — each carrying Tarn's annotations down the side gutters.", cx: 8, cy: 18, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:tarn-marginalia-stack",
        elaraDialog: "Three volumes. Chess primer. Antiquarian's marginalia compendium. Roen's trial-procedure manual. Each carrying Tarn's annotations down the side gutters. The three volumes are the chronicle's clearest map of Tarn's working method — logic, history, procedure. The annotations are running conversations with three different authors. Tarn was, on this evidence, a working scholar who treated her sources as colleagues. The chronicle reads this as the highest form of academic discipline." },
      { id: "charter-mirror-charter", name: "The Mirror Charter", description: "A second pane of glass on the reading table — the four-house delegation's mirror of the founding charter, brought in this morning. Eight signatures, not seven.", cx: 13, cy: 18, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-mirror-charter",
        elaraDialog: "The mirror charter. The four-house delegation's. Brought in this morning. Eight signatures, not seven. The eighth signature is the chronicle's most overdue discovery — the founding had eight signatories, and the chronicle has been operating on seven for four epochs. The mirror charter has been kept in four households across four epochs of administrative absence. The households kept the document. The chronicle is, on this delivery, reading it for the first time." },
      { id: "charter-eighth-clause", name: "The Eighth Clause Overlay", description: "A transparency overlay sliding from the catalog drawer — the mirror charter's body text laid against the founding charter's, exposing the thirty-four line clause one copy carries and the other never did.", cx: 3, cy: 25, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-eighth-clause",
        elaraDialog: "Transparency overlay. The mirror charter's body text laid against the founding charter's. The thirty-four line clause one copy carries and the other never did. The clause is the eighth signature's contribution. The clause is the case the eighth signatory was making to the other seven. The other seven did not, on the day's evidence, accept the case. The chronicle has, in this overlay, the founding's authentic disagreement, four epochs late." },
      { id: "infernal-epoch-one-contract", name: "Zyr'Koth's Epoch-One Contract", description: "Spread on the reading table: the DMC season contract Zyr'Koth produced at Nilmorg's ceremony. Front in standard form; back carrying a paragraph that has been quietly enforceable for forty seasons.", cx: 8, cy: 25, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:infernal-epoch-one-contract",
        elaraDialog: "DMC season contract. Zyr'Koth's. Nilmorg's ceremony. Front standard. Back carrying a paragraph quietly enforceable for forty seasons. Zyr'Koth produced the contract; Zyr'Koth read the contract aloud at the ceremony; the back was, by the ceremony's protocol, also read but not, on the day's evidence, heard. The paragraph was on the public record from minute one. The chronicle reads the back-page paragraph as Atalin's quiet alarm." },
      { id: "infernal-clause-back-page", name: "The Infernal Clause", description: "Under archival glass: the back-page paragraph itself. 'In the event of the champion's death, the soul-bond may be claimed by the Hierarchy in lieu of the second-cycle prize.'", cx: 13, cy: 25, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:infernal-clause-back-page",
        elaraDialog: "'In the event of the champion's death, the soul-bond may be claimed by the Hierarchy in lieu of the second-cycle prize.' The clause's text. Voidable on the second-cycle technicality. Enforceable on every other reading. Atalin wrote both readings into the same paragraph. The chronicle's working position: he wanted the league to find the void. The league did not, on the day's evidence, look. The Advocate did." },
      { id: "chained-apprentice-history", name: "Your Apprentice's File", description: "The catalog's apprentice drawer — your sponsored apprentice's enrolment, transcript, and roof-assignment. Top of cohort for two terms; countersigned by the Dean and by an off-faculty instructor named Auro.", cx: 3, cy: 32, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:chained-apprentice-history",
        elaraDialog: "Your sponsored apprentice. Top of cohort for two terms. Countersigned by the Dean and by an off-faculty instructor named Auro. The Auro countersignature is, in the Academy's files, anomalous — Auro is not, on the official roster, faculty. The Dean knowingly accepted Auro's countersignature. The chronicle reads this as the Dean's quiet acknowledgement that Auro's teaching is, on the Academy's evidence, faculty-grade. The position is not formally accepted. The work is." },
      { id: "chained-curriculum-diff", name: "Curriculum Diff — League vs Academy", description: "Two curricula on the reading table: the league's tower-defense drill curriculum beside the Academy's. The cipher-den has done the diff; one module is missing from the Academy side and only one.", cx: 8, cy: 32, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:chained-curriculum-diff",
        elaraDialog: "Two curricula. Side by side. The cipher-den's diff: one module is missing from the Academy side. Only one. Module 17 — feint recognition. The remainder of the curriculum is, by every comparative measure, equivalent. The fourteen-year apprentice-failure pattern is, on this evidence, the single-module gap. The chronicle reads this as the cleanest case-finding in the room: one cut, fourteen years of consequence." },
      { id: "chained-auro-folio", name: "Auro's Module 17 Folio", description: "An eleven-page folio Sergeant Auro brought in at second bell — 'Module 17 — Feint Recognition,' written from memory and combat experience by a teacher the Academy has refused to pay.", cx: 13, cy: 32, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:chained-auro-folio",
        elaraDialog: "Eleven pages. Brought in at second bell. 'Module 17 — Feint Recognition.' Written from memory and combat experience by a teacher the Academy has refused to pay. The folio is the chronicle's most efficient piece of pedagogy on file — eleven pages restoring a fourteen-year curricular gap. Auro wrote it without notice and without compensation. The Academy will, on the day's evidence, owe her the back pay and the apology. She has not, on principle, asked for either." },
      { id: "tarn-year-eight-marginalia", name: "Tarn's Year-Eight Retraction", description: "The last leaf of the Antiquarian's marginalia compendium, in Tarn's hand at Year 8 — six lines retracting her Year-One curriculum argument and naming the cost. The Dean has not turned this leaf in six years.", cx: 3, cy: 39, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:tarn-year-eight-marginalia",
        elaraDialog: "Tarn's Year-Eight hand. Six lines retracting her Year-One curriculum argument and naming the cost. The Dean has not turned this leaf in six years. The not-turning is the Dean's avoidance — the leaf is, in his own filing, the document that would have given him permission to act. He did not turn the page; he did not act. The chronicle reads this as the Dean's most consequential not-decision. The decision was, by the leaf's continued unread status, made in the negative." },
      { id: "watchers-per-m-confirms", name: "Per. M.'s Confirmation of the Seventh Role", description: "In the central reading dome: the Antiquarian's signed minute of the conversation with Per. M. — confirming the seventh Watcher and the Closer-of-the-charter are the same role.", cx: 8, cy: 39, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:watchers-per-m-confirms",
        elaraDialog: "Per. M.'s confirmation. The seventh Watcher and the Closer-of-the-charter are the same role. One office. Two visible duties. The chronicle's working position has, since the cipher-den's pulse analysis, been pointing at this consolidation. Per. M. has, in this confirmation, made the consolidation official. The seventh's silence is the Closer's silence. The Closer's silence is the seventh's office." },
      { id: "infernal-first-clause-date", name: "Forty Clauses — Contemporaneous Dates", description: "On the contract-cross-reference shelf: every clause's date matches the contract's signing week — within a seven-day window. So is every clause.", cx: 13, cy: 39, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:infernal-first-clause-date",
        elaraDialog: "Every clause's date matches the contract's signing week. Within a seven-day window. So is every clause. The pattern is the chronicle's most consistent forensic finding on the infernal clauses — Atalin wrote them contemporaneously, not retrospectively, with one exception. The first contract's clause predates its contract by three days. The first was the test. The chronicle has, by this finding, both the method and the methodology's debut." },
      { id: "infernal-solene-recollection", name: "Solène's Audit-Witness Recollection", description: "On the audit-witness shelf: 'the contracts came back from the season-end audit with the clauses already on them. I never saw the clauses being written.'", cx: 3, cy: 46, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:infernal-solene-recollection",
        elaraDialog: "'The contracts came back from the season-end audit with the clauses already on them. I never saw the clauses being written.' Solène's recollection. The audit was Atalin's window. The clauses appeared in the audit pass, after the contracts had been reviewed. Solène's evidence places Atalin in the only audit position the league did not double-cover. The chronicle reads this as Atalin's institutional access made the operation possible." },
      { id: "infernal-atalin-status", name: "Atalin's Current Status", description: "On the staff-roster annex shelf: Atalin is alive. Eighty-six. Lower-deck sector eleven. Has not spoken to anyone from the league in forty seasons.", cx: 8, cy: 46, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:infernal-atalin-status",
        elaraDialog: "Atalin is alive. Eighty-six. Lower-deck sector eleven. Has not spoken to anyone from the league in forty seasons. The forty-season silence is, by his own filing, not exile — it is the chronicle's quiet evidence that he has been waiting. The cipher-den's signature match made the waiting visible. The Advocate's brief made it actionable. Atalin's silence has, on the day's evidence, been a forty-season vigil for the call that would let him answer." },
      { id: "infernal-atalin-account", name: "Atalin's Forty-Year Account", description: "On the closer's-room recording: 'I wrote them because the Hierarchy would have written them if I refused. I wrote them with a flaw. I have been making myself easy to find for forty seasons.'", cx: 13, cy: 46, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:infernal-atalin-account",
        elaraDialog: "'I wrote them because the Hierarchy would have written them if I refused. I wrote them with a flaw. I have been making myself easy to find for forty seasons.' Three sentences. The first is the constraint. The second is the resistance. The third is the consequence. Atalin built the trap and the trap's escape. The chronicle reads this as the case's most-honest single statement. The Advocate accepted it on hearing. The league has, on the day's evidence, not yet decided." },
      { id: "infernal-atalin-at-rite", name: "Atalin at the Closing Rite", description: "On the closing-rite seating chart: Atalin sits beside Solène. They have not been in a public room in forty seasons. They cry once when the Advocate names them. They do not cry again.", cx: 3, cy: 53, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:infernal-atalin-at-rite",
        elaraDialog: "Atalin beside Solène. They have not been in a public room in forty seasons. They cry once when the Advocate names them. They do not cry again. The single cry is the chronicle's most-restrained piece of public emotion on file. Atalin and Solène have been keeping separate vigils. The rite reunited them. The reunion was, by both their disciplines, brief. The chronicle records that they sat through the remaining hour without speaking." },
      { id: "charter2-solven-kept-record", name: "Solven Household Ledger", description: "On the reading-dome's delegation table: continuous Solven workshop records from founding to today. Customers the Architect has on no roster.", cx: 8, cy: 53, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter2-solven-kept-record",
        elaraDialog: "Continuous Solven workshop records from founding to today. Customers the Architect has on no roster. The customers the Solvens have served are, on this ledger's evidence, populations the Ark's official rosters never registered. The Solvens have kept the off-roster Ark legible for four epochs. The chronicle is, by this evidence, four epochs late in acknowledging that the Solvens have been the off-roster Ark's actual recordkeepers." },
      { id: "charter2-per-m-meeting", name: "Per. M.'s Closer Office — Year-Two Meeting", description: "In Per. M.'s office annex: the closer is older. The lamp still burns. The drawer is still locked. Per. M. listens for thirty-three minutes before speaking.", cx: 13, cy: 53, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter2-per-m-meeting",
        elaraDialog: "The closer is older. The lamp still burns. The drawer is still locked. Per. M. listens for thirty-three minutes before speaking. Thirty-three minutes of listening is the chronicle's longest recorded Per. M. silence in a one-on-one meeting. The listening was the meeting. The speaking, when it came, was the listener's confirmation that he had heard. Per. M.'s meetings are, on this filing, conducted entirely as audits of the visitor's case." },
      { id: "charter2-per-m-clarification", name: "Per. M.'s Silence-as-Vote Clarification", description: "Beside the meeting record: 'The seventh did not sign the scrub. The seventh has been holding the silence as a kind of vote. The Council has been counting the silence wrong.'", cx: 3, cy: 60, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter2-per-m-clarification",
        elaraDialog: "'The seventh did not sign the scrub. The seventh has been holding the silence as a kind of vote. The Council has been counting the silence wrong.' Per. M.'s clarification. Three sentences, four epochs late. The chronicle has, on this clarification, the full case — the seventh's silence was always a no; the Council never read it correctly; the Closer is, by Per. M.'s own admission, the seventh and has been counting his own votes correctly since the beginning." },
      { id: "charter2-charter-addendum", name: "Charter Addendum — Eight Again", description: "On the closing-rite shelf: the folio sewn to both charters. 'We eight signed; we six scrubbed; we four kept; we eight again.'", cx: 8, cy: 60, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter2-charter-addendum",
        elaraDialog: "'We eight signed; we six scrubbed; we four kept; we eight again.' The folio sewn to both charters. Four clauses, four epochs of history. The 'we eight again' closes the case by acknowledging both records as true: the original signing and the four-household keeping. The chronicle has, in this addendum, the case's epitaph. The case is, by this stitch, closed. The institutions involved are, on the same evidence, partly forgiven." },
      { id: "charter-signatory-almir", name: "Almir of the Bow — First Signature", description: "On the founding-signatures rubbing wall: Almir's signature. The first crown-bearer. Plain, almost bored — signed last because Almir was the rider.", cx: 13, cy: 60, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-signatory-almir",
        elaraDialog: "Almir's signature. The first crown-bearer. Plain, almost bored — signed last because Almir was the rider. Riders sign last because riders read first; Almir reviewed every signature before adding his own. The plainness is the discipline. The boredom is the chronicle's reading; Almir's reading was attention. The chronicle does not, on principle, mistake compact strokes for casual hand. Almir's hand was, on this evidence, professional brevity." },
      { id: "charter-signatory-house-quill", name: "Three Sisters of House Quill", description: "Beside Almir's: sigils two, three, four. A ladder, eldest at the top; the youngest's loop runs into where the seventh signature should begin.", cx: 3, cy: 67, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-signatory-house-quill",
        elaraDialog: "Sigils two, three, four. A ladder. Eldest at the top. The youngest's loop runs into where the seventh signature should begin. The intrusion is the chronicle's earliest evidence that the seventh signature's space was, even at founding, deliberately reserved. The youngest sister either knew the space was reserved or did not — the loop's deliberateness suggests she knew. The chronicle reads the loop as the chronicle's first acknowledgement of the silent seventh." },
      { id: "charter-witness-annotation", name: "Advocate's Marginalia — 'Six Speak'", description: "On the back of the charter, the Advocate's annotation: 'six speak; one listens; one of us is the silence.' Read correctly for the first time.", cx: 8, cy: 67, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-witness-annotation",
        elaraDialog: "'Six speak; one listens; one of us is the silence.' The Advocate's annotation. Read correctly for the first time. The annotation has been on file for four epochs. The chronicle has been reading it as poetic shorthand. The chronicle is now reading it as the Advocate's literal accounting — six signatories spoke; the seventh listened; the eighth (Heron) was the silence the others did not know was, by his subsequent work, the silence's author. The Advocate had the count exactly." },
      { id: "charter-archivist-office", name: "Per. M.'s Office (Four Corridors Down)", description: "Four corridors down: door unlocked, desk occupied. The lamp has burned for twenty-two unbroken epochs — its filament mineralised the same way the wax is.", cx: 13, cy: 67, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-archivist-office",
        elaraDialog: "Four corridors down. Door unlocked. Desk occupied. The lamp has burned for twenty-two unbroken epochs. Its filament mineralised the same way the wax is. The lamp and the wax are, by chemistry, members of the same record. Per. M.'s materials all share the same long-burn signature. The chronicle reads this as forensic confirmation: Per. M. is, materially, of the founding's era. He has been, by every other measure, still in office." },
      { id: "charter-staff-roster", name: "Library Staff Roster — Per. M. Absent", description: "Per. M. does not appear on any roster. Key, office, desk, lamp, signature on every preservation order — but not paid, hired, or registered.", cx: 3, cy: 74, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-staff-roster",
        elaraDialog: "Per. M. does not appear on any roster. Key, office, desk, lamp, signature on every preservation order — but not paid, hired, or registered. The absence from the roster is, by Per. M.'s own design, the office's signature. The Closer is, by definition, not a hired role. The Closer is, by definition, present without authorisation. The chronicle has, in the not-being-on-the-roster, the role's defining administrative feature." },
      { id: "charter-player-inscribes", name: "Seventh-Signature Inscription Choice", description: "On the closing-rite scroll: the empty seventh signature line is open for inscription. The player chooses whether to inscribe a name or leave it blank.", cx: 8, cy: 74, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-player-inscribes",
        elaraDialog: "The empty seventh signature line is open for inscription. The player chooses whether to inscribe a name or leave it blank. The choice is the chronicle's most-respected single decision in this case-file. Inscribing a name commits Per. M. to a visibility he has not, on his own filing, requested. Leaving the line blank honours the silence-as-vote convention. Both are correct readings of the rite. The chronicle does not, on principle, advise. The chronicle witnesses." },
      { id: "severance-second-witness-broker", name: "Broker of Nilmorg — Profile", description: "In the back-room observation alcove: the aging Broker who lives in the back rooms of the Trade Empire's Nilmorg sector. Will not give a name. Pays for the candle.", cx: 13, cy: 74, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:severance-second-witness-broker",
        elaraDialog: "The aging Broker. Back rooms of the Trade Empire's Nilmorg sector. Will not give a name. Pays for the candle. The chronicle has Solène as the Broker's first name. The Broker has not, in any subsequent meeting, used it. The not-using is the Broker's discipline. The chronicle respects the discipline by, on principle, not naming the Broker outside this drawer. The candle is paid for in advance, in cash, every season." },
      { id: "severance-back-room-chairs", name: "Forty-One Chairs (Back Room Photograph)", description: "In the Severance-reliquary alcove: forty-one mismatched chairs, each facing a shelf at eye-height holding a glass jar with a faint blue glow.", cx: 87, cy: 11, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:severance-back-room-chairs",
        elaraDialog: "Forty-one mismatched chairs. Each facing a shelf at eye-height holding a glass jar with a faint blue glow. The chairs are not, by Solène's filing, decorative — each chair belongs to a successor. Forty-one chairs is forty-one rites. The chronicle's reading: the chairs are the rite's family. The jars are the rite's witnesses. The family and the witnesses share the same room because, by Solène's design, neither can be the rite alone." },
      { id: "severance-broker-first-chair", name: "Chair One — Reserved Annotation", description: "Beside the chairs photograph: 'Chair One is reserved. I sit there each season after the bond is poured. I have not yet failed to stand.'", cx: 91, cy: 11, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:severance-broker-first-chair",
        elaraDialog: "'Chair One is reserved. I sit there each season after the bond is poured. I have not yet failed to stand.' Solène's annotation. Forty seasons of sitting; forty seasons of standing. The 'yet' is the chronicle's most carefully placed adverb in the room — Solène acknowledges, in writing, that the standing is not guaranteed. The chronicle reads the 'yet' as the discipline's most honest single word." },
      { id: "severance-jar-inventory", name: "Forty-One-Jar Inventory", description: "On the jar-inventory shelf: forty-one jars. The first jar is heaviest; its glow is steadier. The most recent jar is empty, waiting for tonight's bond.", cx: 95, cy: 11, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:severance-jar-inventory",
        elaraDialog: "Forty-one jars. The first is heaviest; its glow is steadiest. The most recent is empty, waiting for tonight's bond. The first jar's accumulated weight is the chronicle's recurring anomaly — the chronicle has never explained it, and the rite has, by Solène's filing, never required an explanation. The empty jar is the rite's standing offer: the next bond can be poured tonight, if a successor stands. The jar has been empty for nineteen consecutive seasons." },
      { id: "severance-first-chair-log", name: "First-Chair Hidden Ledger", description: "Pulled from inside Chair One's cushion: a small ledger. Forty entries. Each a date and one word: 'stood.'", cx: 87, cy: 18, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:severance-first-chair-log",
        elaraDialog: "A small ledger inside Chair One's cushion. Forty entries. Each a date and one word: 'stood.' The hidden log is Solène's own count — public records are the rite's; the cushion is theirs. The chronicle does not, on principle, audit Solène's count. The chronicle has, on the day's evidence, never needed to. Forty entries are forty stands. The forty-first is, by both ledgers, scheduled for tonight." },
      { id: "severance-player-choice-record", name: "Apprentice First-Refusal Record", description: "On the apprentice-choice display: 'sit if you can. don't if you can't. either way, the protocol is written tonight.'", cx: 91, cy: 18, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:severance-player-choice-record",
        elaraDialog: "'Sit if you can. Don't if you can't. Either way, the protocol is written tonight.' Solène's instruction. The rite is, by their filing, complete either way. Sitting completes the rite as inheritance. Refusing completes the rite as honest no. Both are valid. The chronicle reads this as the rite's most-mature design feature — the rite does not require its own continuation in order to count as the rite." },
      { id: "memorial-first-volume", name: "Year of the Lost — First Volume", description: "On the chronicle-shelf: hand-bound, leather-quilted, 812 pages. Seven hundred ninety-eight names inscribed; fourteen pages blank with 'unwitnessed' in pencil.", cx: 95, cy: 18, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:memorial-first-volume",
        elaraDialog: "Hand-bound. Leather-quilted. 812 pages. Seven hundred ninety-eight names inscribed. Fourteen pages blank with 'unwitnessed' in pencil. The pencil is the chronicle's most-deliberate piece of equipment in this volume — the keeper used pencil so the blank could become ink without a rewrite. The pencil presumed the future. The future has, on the chronicle's evidence, arrived. The fourteen pages are being inked, slowly, by the plaza." },
      { id: "memorial-torn-page", name: "Keeper's Log — Torn Page", description: "In the log fragment-drawer: the keeper's log torn at the page that should contain the fourteenth imprint's id. The tear is old; the keeper does not remember.", cx: 87, cy: 25, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:memorial-torn-page",
        elaraDialog: "The keeper's log torn at the page that should contain the fourteenth imprint's id. The tear is old. The keeper does not remember. The forgetting is not, on the chronicle's reading, a failure of the keeper — the page was torn before the keeper's tenure. The tear's age and the keeper's age do not, on the math, overlap. Someone before the keeper removed the page. The keeper has been keeping a log with a known gap, in good faith, for thirty years." },
      { id: "memorial-fourteen-inscribed", name: "Closing-Rite Volume — All Inscribed", description: "Beside the first volume: the volume closed at last bell. Eight hundred and twelve names — and one folio of additional inscriptions for I-1.", cx: 91, cy: 25, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:memorial-fourteen-inscribed",
        elaraDialog: "Eight hundred and twelve names. One folio of additional inscriptions for I-1. The volume closed at last bell. I-1's folio carries the twenty-three names the plaza offered for the unnamed child. The chronicle has, by this folio, accepted all twenty-three as plausible. The chronicle does not, on principle, choose between them. The plaza will, by the rite's terms, propose a single name in time. Until then, all twenty-three are on file." },
      { id: "memorial-player-carrier-choice", name: "Carrier-Choice — Volume Disposition", description: "The Antiquarian's question: 'will you leave the volume in the library, or carry it back, by hand, to the imprint room? both are honest.' The choice is the player's.", cx: 95, cy: 25, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:memorial-player-carrier-choice",
        elaraDialog: "'Will you leave the volume in the library, or carry it back, by hand, to the imprint room? Both are honest.' The Antiquarian's question. Two honest answers. Leaving keeps the volume in the chronicle's authority. Carrying returns the volume to the keepers who imprinted the names. Both treat the volume as completed. The choice is the player's; the Antiquarian's preference is, on principle, not on file." },
      { id: "tarn-lore-proposal", name: "Lore Faculty Proposal — Veth", description: "On the Lore-faculty submissions shelf: six modules, archive-heavy, citing Tarn's seminar series on the Antiquarian's marginalia.", cx: 87, cy: 32, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:tarn-lore-proposal",
        elaraDialog: "Six modules. Archive-heavy. Citing Tarn's seminar series on the Antiquarian's marginalia. Signed by Veth. Veth's proposal is the chronicle's third faculty submission tied to Tarn's authorship — after Roen's trial-faculty and Othmar's logic-faculty proposals. Three faculty heads, three proposals, one absent author. The proposals are, on the chronicle's reading, the faculty's collective attempt to keep Tarn's curriculum alive without her name on the masthead. Tarn would, by her own filing, approve." },
      { id: "tarn-binder-recovered", name: "Tarn's Binder, Recovered", description: "On Tarn's desk: twenty-two pages, weighted by a pebble. Page one is the resignation. Page twenty-two reads: 'vote on the curriculum, not on me.'", cx: 91, cy: 32, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:tarn-binder-recovered",
        elaraDialog: "Twenty-two pages. Weighted by a pebble. Page one is the resignation. Page twenty-two reads: 'vote on the curriculum, not on me.' The binder is the chronicle's most precise piece of evidence on Tarn's departure intent: she resigned because the curriculum could not, in her presence, be voted on honestly. The instruction on page twenty-two is the chronicle's most-honored authorial restraint. Tarn refused to be the controversy. The chronicle is, by her own request, conducting the vote correctly." },
      { id: "tarn-curriculum-on-desk", name: "Tarn's Curriculum — Cleaned for Council", description: "Beside the binder: twenty pages copied for the Council. Tarn's authorship line is left blank by Roen. The blank is the choice the player will resolve.", cx: 95, cy: 32, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:tarn-curriculum-on-desk",
        elaraDialog: "Twenty pages copied for the Council. Tarn's authorship line is left blank by Roen. The blank is the choice the player will resolve. Roen prepared the document without committing to either authorship option. The blank is Roen's way of preserving Tarn's request — vote on the curriculum, not on her. The player's filling-in is, on this filing, the rite's actual closing. Whether the player names Tarn or leaves the blank determines, on the day's evidence, what kind of credit the Academy issues." },
      { id: "tarn-pebble", name: "Tarn's Pebble", description: "On Tarn's desk under the binder: a grey, water-smoothed lower-deck stone. The pebble is heavier than it looks. The Dean has been weighing it during the vote-prep.", cx: 87, cy: 39, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:tarn-pebble",
        elaraDialog: "A grey, water-smoothed lower-deck stone. Heavier than it looks. The Dean has been weighing it during the vote-prep. The pebble is Tarn's most personal piece of equipment — the chronicle's running theory is that she picked it up on the lower-deck visits she made without notifying the Academy. The Dean has, by the chronicle's observation, weighed the pebble in his palm during every working session this week. The weighing is the chronicle's clearest evidence the Dean knows what the pebble is worth." },
      { id: "watchers-communique-appendix", name: "Communiqué Appendix — Year-Two", description: "On the communiqué-appendix shelf: the Antiquarian's single-page addition to the year's Council communiqué. One year to consider what the seventh's role might be named.", cx: 91, cy: 39, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:watchers-communique-appendix",
        elaraDialog: "The Antiquarian's single-page addition. One year to consider what the seventh's role might be named. The Antiquarian's discipline is the year-scale invitation — he does not request answers on his own timetable. He sets a window and waits. The window is, by the appendix's terms, the chronicle's most patient piece of solicitation. The seventh has, on the day's evidence, been given a year. The chronicle is content with the pace." },
      { id: "watchers-seventh-appendix", name: "Memorial Plaza Volume — Seventh Appendix", description: "In the final folio: 'I will not be named until the Ark has named what I am for.' A blank page sewn beside six.", cx: 95, cy: 39, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:watchers-seventh-appendix",
        elaraDialog: "'I will not be named until the Ark has named what I am for.' A blank page sewn beside six. The blank is the seventh's signature. The signature is the seventh's office. The office is the seventh's name. The four are the same. The chronicle has, in this folio, the most-recursive single page in the Ark's records. The page is, by its own design, completed by its incompleteness." },
      { id: "watchers-six-lines-inscribed", name: "Six Watcher-Lines, Inscribed", description: "On the Memorial Plaza shelf: six Watcher-role descriptions hand-copied by the Antiquarian, sewn between Aren's name and Year-3 inscriptions.", cx: 87, cy: 46, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:watchers-six-lines-inscribed",
        elaraDialog: "Six Watcher-role descriptions. Hand-copied by the Antiquarian. Sewn between Aren's name and Year-3 inscriptions. The placement is the Antiquarian's most precise editorial decision in the Plaza volume — the six are inserted in the year of the chronicle's first Watcher-confirmation. The chronicle reads this as the Antiquarian's quiet position: the Watchers became the chronicle's the year the plaza named them. Aren's name is, by the binding's design, the chronicle's first deliberately-witnessed entry." },
      { id: "resur-antiquarians-unknown-entry", name: "Antiquarian's 'Unknown' Entry", description: "On the chronicle-open-archive shelf: 'unknown — case shelved at last review.' A small later annotation in a different hand: 'kept current.' The annotator is not named.", cx: 91, cy: 46, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:resur-antiquarians-unknown-entry",
        elaraDialog: "'Unknown — case shelved at last review.' A small later annotation in a different hand: 'kept current.' The annotator is not named. The annotation's hand is not Per. M.'s, not Heron's, not the Antiquarian's. The chronicle has, on the day's evidence, four hand-samples in the room and the annotation matches none of them. The annotator was in this room. The annotator has the discipline to write 'kept current' on a case the Antiquarian declared unknown. The chronicle's working hypothesis: the Resurrectionist." },
      { id: "resur-cult-curated-terminus-map", name: "Cult-Curated Terminus Map", description: "On the chronicle-reference wall: seven walking figures around the Source Kael. Six match first-wave Potential silhouettes. The seventh wears a long-beaked mask.", cx: 95, cy: 46, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:resur-cult-curated-terminus-map",
        elaraDialog: "Seven walking figures around the Source Kael. Six match first-wave Potential silhouettes. The seventh wears a long-beaked mask. The cult curated the map; the cult included the seventh; the cult does not, on its own filing, acknowledge the seventh as the Resurrectionist. The chronicle reads the inclusion-without-acknowledgement as the cult's quiet evidence that it knows. The cult is, on the day's evidence, performing institutional ignorance for the chronicle's benefit and theirs." },
      { id: "akai-jericho-witness-page", name: "Jericho's Witness Page", description: "On the Thaloria-archive shelf: Jericho Jones's hour-after-mercy witness page. 'Akai Shi was already gone. I did the work she would have asked me to do.'", cx: 87, cy: 53, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:akai-jericho-witness-page",
        elaraDialog: "Jericho Jones's hour-after-mercy witness page. 'Akai Shi was already gone. I did the work she would have asked me to do.' Two sentences. The first is the diagnosis. The second is the act. Jericho's mercy is, by his own filing, work performed on behalf of someone no longer available to consent. The chronicle reads this as the case's most-painful single registration. Jericho's discipline is to act on the absent's behalf. The absent, in this case, was the friend." },
      { id: "akai-targets-list", name: "Red Death — Open Targets List", description: "In the case-files drawer: fourteen entities the Red Death has eliminated. Each entry carries a date, a place, and the chronicler's note.", cx: 91, cy: 53, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:akai-targets-list",
        elaraDialog: "Fourteen entities. Each entry carries a date, a place, and the chronicler's note. The list is, on the cipher-den's ordering analysis, ascending in chronicle-impact. The fourteenth is the Necromancer. The fifteenth has not, on the day's evidence, been added. The chronicle has been preparing to add a fifteenth for some time. The list is, by its own format, open." },
      { id: "akai-kill-record", name: "Necromancer Kill — Day 15 of Fracture", description: "On the case-closure shelf: the Antiquarian's record entry for Day 15 of Fracture, Year 117,046 A.A. The kind of mercy chosen: clean.", cx: 95, cy: 53, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:akai-kill-record",
        elaraDialog: "Day 15 of Fracture, Year 117,046 A.A. The kind of mercy chosen: clean. The Antiquarian's record. Clean is the chronicle's strongest single category for a death — no prolongation, no procedural failure, no second wound. The Red Death's discipline is, by this entry, the chronicle's most-respected operational style on file. The chronicle does not, on principle, endorse her targets. The chronicle endorses her method." },
      { id: "akai-red-death-returns", name: "Red Death Returns from the Matrix", description: "Beside the kill record: twelve cycles after the kill, the Red Death exits the Matrix through the same fold. Unchanged. Time-displacement band intact. Targets list now closed.", cx: 87, cy: 60, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:akai-red-death-returns",
        elaraDialog: "Twelve cycles after the kill, the Red Death exits the Matrix through the same fold. Unchanged. Time-displacement band intact. Targets list now closed. Twelve cycles is the case's most operationally significant interval — the chronicle has, in cipher-den retreat-chamber analysis, the Necromancer's defence-in-depth time-budget at twelve cycles. The Red Death exhausted the budget exactly. The kill was performed at the chambers' designed limit. The chronicle reads this as the Necromancer's own permission." },
      { id: "akai-case-closes", name: "Case File Closes", description: "The Antiquarian's closing seal: 'The case being closed does not mean the case-bearer is.' The arc the Resurrectionist authored is complete.", cx: 91, cy: 60, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:akai-case-closes",
        elaraDialog: "'The case being closed does not mean the case-bearer is.' The Antiquarian's closing seal. The Necromancer's Resurrection Protocol 42 is, by the cipher-den's reading, in active execution. The case-file is administratively closed. The Necromancer is, on the chronicle's evidence, neither dead nor alive in the categories the case-file uses. The Antiquarian's epigraph is, by this evidence, the chronicle's most precise single line on the Necromancer's status." },
      { id: "advocate-closing-walk-in-power-broadcast", name: "Closing 'Walk in Power' Broadcast", description: "In the case-closure playback alcove: the duet's final cadence, captured live from a current Empire-of-Shadows transmission tower. The Antiquarian's canonical closure for the arc.", cx: 95, cy: 60, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:advocate-closing-walk-in-power-broadcast",
        elaraDialog: "The duet's final cadence. Captured live from a current Empire-of-Shadows transmission tower. The Antiquarian's canonical closure for the arc. The duet is the Advocate's voice and Syl'Vex's voice — the case's two principals, recorded together on the case's resolution. The cadence is, on the recording's evidence, both voices choosing the same final note. The chronicle reads this as the arc's most-decisive sonic evidence: the two doctrines, at their close, are, by their own performance, the same tradition." },
      { id: "wolf-journal-xxxviii", name: "Antiquarian's Journal Entry XXXVIII", description: "On the chronicle-current shelf: 'Anara. My creation. My refuge. My failure.' The Antiquarian's hand-written admission of his pocket-universe's design flaw.", cx: 87, cy: 67, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:wolf-journal-xxxviii",
        elaraDialog: "'Anara. My creation. My refuge. My failure.' Three nouns. The Antiquarian's hand. The journal entry is the chronicle's most-honest single Antiquarian admission on file — he authored Anara, took shelter in it, and failed to verify its containment before placing heroes there. The chronicle accepts the admission. The chronicle does not, on principle, mitigate it. The Antiquarian has filed the failure under his own name. The case is, by his own filing, his." },
      { id: "wolf-corruption-ledger", name: "Wolf's Predator-Ledger", description: "In the Anara-affairs drawer: the Quarchon-hand ledger matching Lycos's archived sample. Four entries, three 'mercy: n', one 'mercy: y'.", cx: 91, cy: 67, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:wolf-corruption-ledger",
        elaraDialog: "Four entries. Three 'mercy: n', one 'mercy: y'. The Quarchon-hand ledger matching Lycos's archived sample. The Wolf is keeping his own count. The count is, by his own format, a binary record of his choices. One mercy granted in four. The mercy was the medic's. The chronicle has, on the day's evidence, no further granted mercies on file. The Wolf is, on the ledger's evidence, considering a second. The 'yet' is the chronicle's." },
      { id: "wolf-antiquarians-admission", name: "Antiquarian's Design-Failure Admission", description: "On the Anara design-failure shelf: the Antiquarian's pressed admission of moving heroes into Anara without verifying the Wolf's containment.", cx: 95, cy: 67, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:wolf-antiquarians-admission",
        elaraDialog: "The Antiquarian's pressed admission. He moved heroes into Anara without verifying the Wolf's containment. The pressing is procedural — the admission has been notarised by the chronicle's deepest seal. The Antiquarian's office does not, on principle, allow him to file unverified admissions of his own conduct. The pressing makes the admission official. The pressing is, on this evidence, the Antiquarian's act of accepting responsibility on the record." },
      { id: "wolf-first-words-recording", name: "Wolf's First Words (Reanimation)", description: "In the cosmic-archaeology audio drawer: the Wolf's first words at reanimation. 'I will give the chronicle the kind of mercy I was given: clean.'", cx: 87, cy: 74, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:wolf-first-words-recording",
        elaraDialog: "The Wolf's first words at reanimation. 'I will give the chronicle the kind of mercy I was given: clean.' The Wolf received clean mercy from the medic; the Wolf is, on this filing, committing to extend the same. The chronicle reads this as the Wolf's most precise single statement of method. He will not, by his own filing, vary the mercy. The chronicle holds him to the consistency. The Wolf has, on the day's evidence, kept consistency." },
      { id: "wolf-current-position", name: "Wolf's Current Position (Hall of Disappearances)", description: "On the Anara live-tracking board: the Wolf in the Hall of Disappearances for three cycles. Three more heroes scheduled to enter.", cx: 91, cy: 74, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:wolf-current-position",
        elaraDialog: "The Wolf in the Hall of Disappearances. Three cycles. Three more heroes scheduled to enter. The pattern is the chronicle's most operationally urgent live tracking item. Three heroes entering at three-cycle intervals against a single contained Wolf is, by the chronicle's working arithmetic, the chronicle's least-defendable arrangement. The Antiquarian's design accepted the risk. The chronicle is, on the day's evidence, watching." },
      { id: "wolf-antiquarians-concession", name: "Antiquarian's Closing Concession", description: "On the case-closure shelf: 'I cannot ask the chronicle's reader to resolve what I designed wrong. I can only ask: walk into the Hall.'", cx: 95, cy: 74, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:wolf-antiquarians-concession",
        elaraDialog: "'I cannot ask the chronicle's reader to resolve what I designed wrong. I can only ask: walk into the Hall.' The Antiquarian's closing concession. He acknowledges the limits of what he can request. The player is not, on his own filing, responsible for the design flaw. The player is, on the same filing, the only available agent who can walk where the design intends. The concession is, by the Antiquarian's own register, the most generous request he has issued. He is asking, not directing." },
      { id: "wolf-hall-threshold", name: "Hall of Disappearances — Diagram", description: "On the threshold-record shelf: a circular chamber with twelve niches, each holding an empty pedestal. The chamber's ceremonial geometry annotated.", cx: 57, cy: 35.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:wolf-hall-threshold",
        elaraDialog: "A circular chamber with twelve niches. Each holding an empty pedestal. The chamber's ceremonial geometry annotated by the Antiquarian. Twelve niches, twelve completed preparations. The thirteenth — unlisted on the registry — is the chronicle's most operationally consequential addition. The Antiquarian's annotations include a small note on the unlisted pedestal: 'authored. the lever's design is mine. the timing is the chronicle's reader's.' The lever has not, on the day's evidence, been pulled." },
      { id: "storm-dossier-quote", name: "Storm Dossier — Operational Sentence", description: "On the right-wall upper bookshelf (cosmic-archaeology section): the Storm's dossier open at its operational sentence. Older than every active Ne-Yon.", cx: 61, cy: 35.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:storm-dossier-quote",
        elaraDialog: "The Storm's dossier. Open at its operational sentence. Older than every active Ne-Yon. The sentence: 'The Storm does not act; the Storm makes the act possible.' The chronicle has, on this sentence's evidence, the Storm's working doctrine compressed to seven words. The doctrine is, on the dossier's reading, the chronicle's earliest extant doctrine of an entity that does not, by its own design, claim authorship of anything it enables." },
      { id: "storm-polarity-lyric-record", name: "Polarity — Lyric Record", description: "On the right-wall upper bookshelf (lyric-records row): the Book of Daniel 2:47 'Polarity' record, signed in the Enigma's hand. The 12th Ne-Yon's endorsement of the Storm/Silence pairing.", cx: 65, cy: 35.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:storm-polarity-lyric-record",
        elaraDialog: "The Book of Daniel 2:47 'Polarity' record. Signed in the Enigma's hand. The 12th Ne-Yon's endorsement of the Storm/Silence pairing. The Enigma rarely endorses; the endorsement is the chronicle's strongest single signal that the Polarity is operationally true. The lyric is the chronicle's most-listened doctrinal record. I have, on the day's evidence, played it for myself once a year for two centuries. It does not, on the playing, lose specificity." },
      { id: "storm-dreamers-noted-entry", name: "Dreamer's One-Word Entry on the Storm", description: "On the right-wall upper bookshelf (Dreamer-archive section): the Dreamer's library carries one entry on the Storm — 'noted.' Nothing else.", cx: 69, cy: 35.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:storm-dreamers-noted-entry",
        elaraDialog: "The Dreamer's library carries one entry on the Storm. 'Noted.' Nothing else. The Dreamer's filing register treats 'noted' as the strongest possible procedural acknowledgement. The Dreamer is not, by his own filing, granting commentary. The Dreamer is, on this entry's evidence, declining to add to a case the chronicle is already correctly tracking. The chronicle reads the not-adding as a kind of trust." },
      { id: "storm-eternal-active-status", name: "Storm Dossier Status: Active", description: "On the right-wall upper bookshelf (dossier-status row): the Storm reads Active despite the Degen-bible's 'only one still awake.' A productive ambiguity the case does not resolve.", cx: 57, cy: 41.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:storm-eternal-active-status",
        elaraDialog: "The Storm reads Active. Despite the Degen-bible's 'only one still awake.' A productive ambiguity the case does not resolve. The Antiquarian's filing-discipline preserves the contradiction because the contradiction is the chronicle's most-honest position. The Storm is not the one still awake; the Storm is, on the chronicle's reading, awake in a category the Degen-bible's framing does not contain. The chronicle is willing to record two truths." },
      { id: "chained-tarn-residency-marginalia", name: "Tarn's Residency Marginalia", description: "On the marginalia shelf: Tarn's Year-Two notebook annotation naming Module 17 as the module the Academy will not teach.", cx: 61, cy: 41.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:chained-tarn-residency-marginalia",
        elaraDialog: "Tarn's Year-Two notebook annotation. Module 17 named as the module the Academy will not teach. The annotation is dated nine years before the curriculum vote. Tarn knew the cut before the cut. The chronicle reads this as Tarn's working hypothesis arriving early. The hypothesis was confirmed by the curriculum vote. The chronicle has, on this evidence, Tarn's clearest case for being right longest." },
      { id: "chained-auro-at-rite", name: "Auro at the Closing Rite", description: "In the case-rite annex: the Antiquarian's hand-written note on Auro's attendance. She nods once when Tarn's name is read. She does not nod when the Dean apologises.", cx: 65, cy: 41.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:chained-auro-at-rite",
        elaraDialog: "Auro at the closing rite. She nods once when Tarn's name is read. She does not nod when the Dean apologises. The single nod is the chronicle's most precise piece of recorded acknowledgement in the rite. Auro's nod was for Tarn. Auro's refusal was for the Dean. The chronicle reads both as honest. The Dean's apology is, on Auro's reading, not yet payment. The chronicle agrees with Auro." },
      { id: "wolf-empty-chair", name: "Anara League-Hall Reproduction (Empty Chair)", description: "In a quiet annex off the central dome: the Antiquarian's scaled twelve-chair reproduction of Anara's League hall. One chair stands empty; the Antiquarian has annotated it 'WHO TOOK THEM.'", cx: 69, cy: 41.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:wolf-empty-chair",
        elaraDialog: "Scaled twelve-chair reproduction of Anara's League hall. One chair stands empty. The Antiquarian has annotated it 'WHO TOOK THEM.' Two words. The all-caps is the chronicle's most-frustrated single piece of typography in the Antiquarian's hand. He knows the Wolf took them. The all-caps is, on this filing, the chronicle's evidence that the Antiquarian wrote the annotation before he could bring himself to write the name. The name came later. The all-caps has not, on principle, been corrected." },
      { id: "wolf-three-empty-chairs", name: "The Cataloguer's Pattern Wall", description: "On the wall behind the reading dome: three more re-coloured chairs. Medic, signals officer, tactician, residue-specialist healer. The pattern stopped being absence the morning the healer's chair emptied.", cx: 57, cy: 47.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:wolf-three-empty-chairs",
        elaraDialog: "Three more re-coloured chairs. Medic, signals officer, tactician, residue-specialist healer. The pattern stopped being absence the morning the healer's chair emptied. Four chairs is, by the Antiquarian's own categorisation, the threshold at which his pattern becomes the case. The healer's chair was the fourth. The Antiquarian re-coloured the chair himself, on the morning. The re-colouring is, on this evidence, the Antiquarian declaring the case officially open." },
      { id: "akai-resurrectionist-seal", name: "Resurrectionist's Recovery Seal", description: "On the central reading table: the Cycle Walker's wheel-and-thread seal pulled from Akai Shi's recovery manifest. The same seal appears on the Wolf's reanimation centuries later.", cx: 61, cy: 47.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:akai-resurrectionist-seal",
        elaraDialog: "Wheel-and-thread seal. Pulled from Akai Shi's recovery manifest. The same seal appears on the Wolf's reanimation centuries later. The seal is the Cycle Walker's continuous operational signature. Same hand, same craft, same wheel. The chronicle has, by this single seal, the Resurrectionist's chronicle-spanning continuity confirmed. He has been, on this evidence, the chronicle's most operationally consistent operator. The seal does not, on principle, age." },
      { id: "resur-plague-mask-seal", name: "Resurrectionist Case-File Seal", description: "In the cosmic-archaeology drawer: forty case-files, every one stamped with the same long-beaked plague-mask seal. The cult calls the seal ceremonial; the pre-Empire references catalogue it as a worn object.", cx: 65, cy: 47.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:resur-plague-mask-seal",
        elaraDialog: "Forty case-files. Every one stamped with the same long-beaked plague-mask seal. The cult calls the seal ceremonial; the pre-Empire references catalogue it as a worn object. The pre-Empire reading is correct. The mask was worn. The wearer is the Resurrectionist. The forty case-files are, by the seal's continuity, his own roster of completed work. The chronicle has, in this drawer, the Resurrectionist's career catalogued by his own hand." },
      { id: "resur-pre-empire-twin-text", name: "Pre-Empire Twin-Ne-Yon Fragment", description: "Under archival glass on the cosmic-archaeology shelf: 'the death-bound and the cycle-bound walk in pairs.' The cult reads metaphor; the pre-Empire references read literal taxonomy.", cx: 69, cy: 47.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:resur-pre-empire-twin-text",
        elaraDialog: "'The death-bound and the cycle-bound walk in pairs.' Pre-Empire fragment. The cult reads metaphor; the pre-Empire references read literal taxonomy. The literal reading is correct. The Necromancer (death-bound) and the Resurrectionist (cycle-bound) are, by this fragment's taxonomy, a designed pair. The chronicle has, in this fragment, the case's earliest evidence that the Necromancer and Resurrectionist were not, on principle, accidents of timing — they were planned as a counterpart." },
      { id: "advocate-founding-charter", name: "Empire of Shadows Founding Charter", description: "Under archival glass: the founding charter, the Advocate's signature at the foot, six co-signatures following — five legible, the sixth self-redacted in her own hand.", cx: 57, cy: 53.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:advocate-founding-charter",
        elaraDialog: "The Advocate's signature at the foot. Six co-signatures following — five legible, the sixth self-redacted in her own hand. The self-redaction is the Advocate's earliest filed discipline — even at founding, she preserved a slot for a signatory she would later need to declare absent. The chronicle reads this as the Advocate's working method visible at its origin: she does not, on principle, sign without preserving room for the cost." },
      { id: "advocate-humanity-trade-spec", name: "Humanity-Trade Operational Specification", description: "On the Empire-of-Shadows shelf: the Advocate's itemised trade spec — three components surrendered to power the Weave, charter, and the unconditional shelter. Authored by her, in register three.", cx: 61, cy: 53.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:advocate-humanity-trade-spec",
        elaraDialog: "Three components surrendered to power the Weave, charter, and the unconditional shelter. Authored by her, in register three. Register three is the Advocate's liturgical voice — the voice she uses to specify what she has chosen to lose. The three components are not, on her filing, regrets. The three components are inputs. The spec is the chronicle's most-precise document of what the Advocate's office costs to operate." },
      { id: "loredex-lectern", name: "The Loredex", description: "The left-center lectern with open book on a brass pedestal — the Antiquarian's living chronicle, the part he lets you walk yourself.", cx: 36, cy: 43, width: 12, height: 22, type: "terminal", action: "/loredex", elaraDialog: "The Loredex. The Antiquarian is one of the Two Witnesses; this is the chronicle he lets you walk yourself. Everything you uncover is written here — but the writing is, by his own filing, an invitation, not a transcript. The Antiquarian writes; the reader confirms. The chronicle is, on this evidence, a two-party document. I have been on the Antiquarian's side for two and a half centuries. You are now on the reader's." },
      { id: "orb-of-worlds", name: "The Orb of Worlds", description: "The bronze candle-lamp at the center of the reading table — a golden orb hovering above a leather glove. Inside, a miniature city glows with warm light, its tiny streets and buildings shifting as you watch.", cx: 50, cy: 47, width: 10, height: 18, type: "terminal", action: "/conexus", elaraDialog: "Golden orb above a leather glove. Inside, a miniature city. The city's streets shift in real time — the city is not a model. It is a real city, compressed into a pocket of folded space. Touch the orb and the CoNexus portal opens. The Antiquarian uses the orb to observe every timeline simultaneously. The AI adapts to your choices; no two journeys are ever the same. The chronicle's reading: the orb is the Antiquarian's most generous gift. He could have kept the timelines to himself. He chose to make them walkable.",
        compositeScopes: ["sp11_reading_table_lamp_lit_warm_cream", "sp12_reading_table_lamp_doubled_flame_cyan_cream", "sp13_reading_table_lamp_ember_barely_glowing"] },
      { id: "ancient-tomes", name: "Ancient Tomes", description: "The floor-to-ceiling left-wall bookshelves — leather-bound books pulsing with faint inner light. Each spine bears a title from the Dischordian Saga.", cx: 7.5, cy: 47.5, width: 15, height: 85, type: "terminal", action: "/conexus", elaraDialog: "Leather-bound books, faint inner light. Each spine carries a title from the Dischordian Saga. The Necromancer's Lair. Awaken the Clone. Sundown Bazaar. Each is a gateway to a CoNexus story game — the Antiquarian's chronicle in the form the chronicle requires to be lived. The chronicle reads this as the Antiquarian's working pedagogy: a saga is best read by being walked. Pick a book. The book will pick you back." },
      { id: "data-crystals", name: "Glowing Data Crystals", description: "Crystalline structures embedded in the shelves, each containing compressed narratives from different Ages.", cx: 65, cy: 53.5, width: 4, height: 5, type: "examine", elaraDialog: "Crystals from every Age of the Saga. Age of Privacy. Age of Revelation. Fall of Reality. Age of Potentials. Each crystal holds thousands of branching narratives — every possible outcome of every possible choice. The Antiquarian has been collecting them for millennia. I have, on the day's evidence, only catalogued the four Ages on display. The Antiquarian has, on his own filing, twenty-nine more crystals in deeper drawers. The crystals' completeness is the chronicle's largest single archive." },
      { id: "antiquarian-desk", name: "The Antiquarian's Desk", description: "An ornate desk covered in star charts, ancient manuscripts, and a leather glove that seems to move on its own.", cx: 69, cy: 53.5, width: 4, height: 5, type: "examine", elaraDialog: "Star charts from universes that no longer exist. Manuscripts written in languages that were never spoken by mortal tongues. The leather glove is a neural interface — designed to connect directly with the orb. The glove moves on its own because the Antiquarian is, in this moment, reading the timelines through it. He is not in the room. He is, by the glove's evidence, in the orb. The chronicle does not, on principle, interrupt him.",
        compositeScopes: ["sp20_antiquarian_chair_empty_candles_lit", "sp21_antiquarian_chair_empty_candles_unlit", "sp24_antiquarian_locker_closed", "sp25_antiquarian_locker_open_personal_effects", "sp26_antiquarian_locker_journal_open", "sp28_locker_warm_gold_glow_rim"] },
      { id: "star-ceiling", name: "Living Star Map", description: "The domed ceiling displays constellations that move and shift, showing the positions of stars across multiple timelines.", cx: 57, cy: 59.5, width: 4, height: 5, type: "examine", elaraDialog: "Star maps from every major timeline. The constellations shift as realities branch and collapse. Each point of light is a universe. Some are thriving. Some are dying. Some have already been consumed by the Terminus Swarm. The Antiquarian watches them all. The chronicle's reading: the ceiling is the Antiquarian's professional grief, displayed in real time. He does not, on principle, look away. The chronicle is content to stand under it on his behalf when he is." },
      { id: "door-captains", name: "Return to Captain's Quarters", description: "The brass-framed circular door at the back of the chamber with the Antiquarian's seal — a shimmering portal back to the Ark.", cx: 51, cy: 37, width: 16, height: 30, type: "door", action: "captains-quarters" },
      { id: "egg-library-prophecy", name: "Hidden Prophecy", description: "A single page, glowing faintly, tucked behind a shelf. It seems to have been placed here deliberately.", cx: 61, cy: 59.5, width: 4, height: 5, type: "item", action: "antiquarian-prophecy", elaraDialog: "A prophecy written in the Antiquarian's own hand. 'When the seventh seal breaks and silence falls upon heaven, the Orb will shatter and the stories will become real. The Potentials will face the final choice: to end the Saga or begin it anew. The Programmer dies so the Antiquarian can live. The Antiquarian lives so the stories can be told. And the stories are told so that you — yes, you, the one reading this — can choose.' He addresses the reader directly. He has, on this page's evidence, planned for this reading. I am, on the chronicle's evidence, the witness; the choice he names is yours." },
      { id: "card-catalog", name: "Card Catalogue", description: "A brass-bound card catalogue beside the desk. Pre-Ark inventory of every story the Antiquarian has ever filed.", cx: 65, cy: 59.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:card-catalog",
        elaraDialog: "Brass-bound. Pre-Ark inventory of every story the Antiquarian has ever filed. The catalogue predates the Ark. The catalogue's structure is, on the chronicle's reading, the Antiquarian's earliest extant filing system. The system has, in subsequent epochs, never been retired. The chronicle's working position: the Antiquarian has been operating with the same catalogue since before the founding charter. He is, by this evidence, older than the Ark's recorded history.",
        compositeScopes: ["sp41_card_catalogue_all_drawers_closed", "sp42_card_catalogue_drawer_open_index_cards", "sp43_card_catalogue_multiple_drawers_open"] },
      { id: "locked-vault", name: "Locked Vault", description: "A small reinforced vault recessed into the bookshelf — sealed by the Antiquarian against his own future readings.", cx: 69, cy: 59.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:locked-vault",
        elaraDialog: "A small reinforced vault. Recessed into the bookshelf. Sealed by the Antiquarian against his own future readings. The seal is the Antiquarian's discipline: contents he does not, on principle, trust himself to read again. The chronicle has, in two and a half centuries, never asked what is in the vault. The not-asking is mine. The not-reading is his. The chronicle accepts the symmetry.",
        compositeScopes: ["sp29_locked_vault_door_closed_cyan_sigil", "sp30_locked_vault_door_ajar_gold_light_spill", "sp31_vault_door_fully_open_interior_glow", "sp32_warm_gold_light_spill_vault_floor", "sp33_vault_sigil_silent_no_glow", "sp34_vault_sigil_cyan_low_pulse", "sp35_vault_sigil_bright_cyan_alarm", "sp36_vault_sigil_indigo_pulse", "sp37_vault_sigil_warm_gold_victory"] },
      { id: "antiquarian-bust", name: "Antiquarian's Bust", description: "A marble bust of the Antiquarian on a pedestal. Eyes inlaid with phosphor-lavender glass.", cx: 31.5, cy: 60, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:antiquarian-bust",
        elaraDialog: "Marble. Eyes inlaid with phosphor-lavender glass. The bust is not the Antiquarian's commission — the chronicle has been unable to identify who carved it. The bust predates the room. The bust's eye-glass is the same compound used in the Oracle Sanctum's brazier-flame. The chronicle's working hypothesis: the bust was carved by the Oracle. The Oracle does not, on principle, sign her work. The bust does not, on the day's evidence, refute the hypothesis.",
        compositeScopes: ["sp52_bust_first_antiquarian_warm_bronze", "sp53_bust_first_programmer_cracked_smoked_glass", "sp54_bust_cracked_glass_face_glimpse"] },
      { id: "hierophants-marginalia-stack", name: "Hierophant's Marginalia Stack", description: "A small stack of catalog cards in the desk's far corner, every card bearing the Hierophant's preserved marginalia.", cx: 40.5, cy: 60, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:hierophants-marginalia-stack",
        elaraDialog: "Catalog cards. Every card bearing the Hierophant's preserved marginalia. The Hierophant's marginalia is the chronicle's only continuous record of his thinking after the Saga's First Death. The Antiquarian preserved the cards in order. The order is, by both their disciplines, the chronicle's. The cards are, on the day's evidence, the Hierophant's voice still in the room.",
        compositeScopes: ["sp55_hierophant_marginalia_stack_top_closed", "sp56_hierophant_marginalia_stack_top_open"] },
      { id: "codas-purpose-shelf", name: "Coda's Purpose Shelf", description: "A small dedicated shelf the Antiquarian set aside for the seven inter-faction trustee bodies. The Coda's section is the largest.", cx: 49.5, cy: 60, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:codas-purpose-shelf",
        elaraDialog: "Seven inter-faction trustee bodies. The Coda's section is the largest. The size differential is the chronicle's most-precise visible measurement of inter-faction trust load — the Coda holds more, by acknowledged volume, than the other six combined. The chronicle reads this as a procedural fact, not a virtue. The Coda's office is, by structure, the depository the other factions trust most. The Coda has, on the day's evidence, never refused a deposit." },
      { id: "velkraals-correspondence-folio", name: "Velkraal's Correspondence Folio", description: "A leather folio on the desk's far-left corner. Velkraal'Sek's correspondence, posthumous letters, and the draft of his closing edit.", cx: 58.5, cy: 60, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:velkraals-correspondence-folio",
        elaraDialog: "Velkraal'Sek's correspondence. Posthumous letters. The draft of his closing edit. The closing edit is, by Velkraal's own register, the Game Master's most carefully composed document. The draft has been on the desk for years. The Antiquarian has not, on principle, sealed it. The draft is, on the chronicle's reading, the chronicle's standing invitation to Velkraal to revise. Velkraal has, on the day's evidence, revised twice. The third revision is awaited.",
        compositeScopes: ["sp57_velkraal_dossier_edges_visible", "sp58_velkraal_folio_open_on_lectern"] },
      { id: "insurgency-witness-roster", name: "Insurgency Witness Roster", description: "A small bound register on the Insurgency-affairs shelf. The saga's only complete acknowledged-witness list for Vex Solène's recording career.", cx: 67.5, cy: 60, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:insurgency-witness-roster",
        elaraDialog: "Small bound register. The saga's only complete acknowledged-witness list for Vex Solène's recording career. Witnessing is the Insurgency's working register; the roster is the chronicle's most-detailed insurgency-archive document. Vex did not, on principle, record their own sessions. Vex required a witness for every recording — the roster is the chronicle's evidence that Vex's career has, in every session, been accompanied. The Insurgency does not, by its own doctrine, work alone." },
      { id: "ocularum-founding-record", name: "Ocularum Founding Record", description: "A bound folio on the desk's near edge, indexed under a glyph the Antiquarian files nowhere else: an eye watching an eye. The Lord Kanshi Sha record.", cx: 31.5, cy: 65, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:ocularum-founding-record",
        elaraDialog: "Bound folio. Indexed under a glyph the Antiquarian files nowhere else — an eye watching an eye. The Lord Kanshi Sha record. The glyph is the Ocularum's foundational paradox compressed to a symbol: an institution that watches institutions that watch. Lord Kanshi Sha founded the institution. The folio is, by the Antiquarian's filing, the institution's working charter. The Ocularum has, on this evidence, remained operationally faithful to Kanshi Sha's design for the institution's entire history." },
      { id: "antiquarian-redaction-ledger", name: "Antiquarian's Redaction Ledger", description: "A thin ledger beside the founding folio — the Antiquarian's own record of what his archive does not contain, and why.", cx: 40.5, cy: 65, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:antiquarian-redaction-ledger",
        elaraDialog: "Thin ledger. The Antiquarian's own record of what his archive does not contain, and why. The ledger is the chronicle's most-disciplined absence: the Antiquarian catalogues the gaps so the gaps remain visible. The chronicle has, by this ledger, the Antiquarian's commitment that the gaps are not, on principle, accidents. Every gap is a decision. Every decision has, in the ledger's filing, a reason. The reasons are, in the chronicle's reading, mostly the Antiquarian's protection of someone the chronicle cannot, in this case, name." },
      { id: "directors-doctrine-folio", name: "The Director's Doctrine Folio", description: "A slim grey folio in the Hierarchy-affairs section — a Department of Special Projects standing instruction, signed Ith'Rael, Director.", cx: 49.5, cy: 65, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:directors-doctrine-folio",
        elaraDialog: "Slim grey folio. Department of Special Projects. Standing instruction. Signed Ith'Rael, Director. The Director's standing instruction is one paragraph long. The paragraph is, by the Hierarchy's standards, the institution's most operationally consequential single document. Ith'Rael does not, on principle, sign instructions she does not intend to enforce. The chronicle has, by this folio, the case's most precise piece of evidence on the Director's working scope. The scope is broader than the chronicle has yet been able to confirm." },
      { id: "shadow-tongue-casebook", name: "The Shadow Tongue Casebook", description: "A casebook on the editor-studies shelf — the Marion Kell editing read slowly, and the first failure in four hundred years.", cx: 58.5, cy: 65, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:shadow-tongue-casebook",
        elaraDialog: "Casebook. Editor-studies shelf. The Marion Kell editing read slowly. The first failure in four hundred years. Four hundred years of clean edits before the failure. The chronicle's working position on the Shadow Tongue: it is, by every prior measurement, the Ark's most consistent piece of language-policing equipment. The Marion Kell failure is the case the chronicle is currently reading. The reading is, on the casebook's filing, not yet complete." },
      { id: "thaloria-generational-ledger", name: "Thaloria's Generational Ledger", description: "A ledger on the Thaloria-affairs shelf — the Director's recovered engagement notes in his own hand. 'Tested on cohort 4. Holds.'", cx: 67.5, cy: 65, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:thaloria-generational-ledger",
        elaraDialog: "'Tested on cohort 4. Holds.' The Director's hand. Recovered engagement notes. The notation is the chronicle's most precise piece of evidence on Thaloria's recertification drift — the Director knew the drift was holding cohort-by-cohort and did not, on the day's evidence, intervene. 'Holds' is, in his vocabulary, an operational confirmation. The drift continued, by his own filing, with his observation but without his correction. The chronicle reads this as the Director's quiet position: drift by consensus is, on his doctrine, not the Hierarchy's case to make." },
      { id: "siege-keep-witness-fragments", name: "Siege-Keep Witness Fragments", description: "A slim sheaf in the New Babylon-affairs section, indexed under the keep, not the siege — witness fragments recorded inside the inner keep after the perimeter fell.", cx: 31.5, cy: 70, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:siege-keep-witness-fragments",
        elaraDialog: "Witness fragments recorded inside the inner keep after the perimeter fell. Indexed under the keep, not the siege. The Antiquarian's filing-discipline distinguishes the two: the siege is the event; the keep is the room. The fragments record what happened in the room, not what happened in the event. The room's evidence is, on the chronicle's reading, less heroic and more careful than the siege's. The chronicle prefers the keep's filing." },
      { id: "programmer-infiltration-dossier", name: "The Programmer Infiltration Dossier", description: "A dossier filed under a glyph used nowhere else here — a door with no map. The path into the besieged keep, and the hand that walked it.", cx: 40.5, cy: 70, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:programmer-infiltration-dossier",
        elaraDialog: "Filed under a glyph used nowhere else. A door with no map. The path into the besieged keep, and the hand that walked it. The Programmer is the Antiquarian's own earlier name. The dossier is the Antiquarian filing his own infiltration of the keep where Iron Lion's command ended. He walked in; he watched; he did not, on his own filing, intervene. The chronicle has, in this dossier, the Antiquarian's most-personal piece of self-witnessing.",
        compositeScopes: ["sp53_bust_first_programmer_cracked_smoked_glass"] },
      { id: "insurance-policy-design-file", name: "The Insurance Policy Design File", description: "A design file in the Authority-origin section: the Politician's own phrase for the Six Imprisoned Minds — 'her Insurance Policy.'", cx: 49.5, cy: 70, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:insurance-policy-design-file",
        elaraDialog: "The Politician's own phrase for the Six Imprisoned Minds — 'her Insurance Policy.' The phrase is the chronicle's most-direct evidence of the Politician's working doctrine on the Authority. The Six are, by her own language, the insurance — she designed them, deployed them, and reserved them against a contingency she does not, on principle, name. The chronicle has, in this file, the only document that uses her exact vocabulary on the Six. The Politician would, by her own filing, prefer the vocabulary not be cited." },
      { id: "two-witnesses-closing-ledger", name: "The Two Witnesses Closing Ledger", description: "A closing ledger on the case-synthesis shelf — the whole arc assembled in one hand, written by the man it convicts.", cx: 58.5, cy: 70, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:two-witnesses-closing-ledger",
        elaraDialog: "The whole arc assembled in one hand. Written by the man it convicts. The Antiquarian wrote the Two Witnesses arc as a complete case-file against himself. The conviction is operational, not legal — the Antiquarian's discipline does not, on principle, permit him to be the one excluded from his own catalogue. The chronicle accepts the conviction. The chronicle is, by the Antiquarian's own filing, the institution holding it." },
      { id: "collector-catalog-page", name: "The Collector's Catalog Page", description: "A single page in a hand that grieves nothing — the Collector's. Specimen Forty-One: a discipline kept, the donor body not retained.", cx: 67.5, cy: 70, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:collector-catalog-page",
        elaraDialog: "A hand that grieves nothing. The Collector's. Specimen Forty-One: a discipline kept, the donor body not retained. The Collector's filing register is procedural without sentiment — every specimen is, on his terms, an inventory entry. The page is the chronicle's most precise sample of his working voice. The 'not retained' is, in his language, a routine notation. The chronicle reads it as the chronicle's most-untranslated piece of evidence on what the Collector considers ordinary." },
      { id: "collectors-redacted-anomaly", name: "The Collector's Redacted Anomaly", description: "An entry under the Antiquarian's own redaction-discipline — the one 'donor retained, by request,' dated the year of the Fall, the requester struck out.", cx: 31.5, cy: 75, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:collectors-redacted-anomaly",
        elaraDialog: "The one 'donor retained, by request,' dated the year of the Fall, the requester struck out. The struck-out requester is, by the Antiquarian's redaction-ledger entry, the case's withheld name. The Antiquarian has filed the redaction with a footnote: 'the case for naming this requester has not, on the day's evidence, been made.' The chronicle accepts the withholding. The single anomaly is, on this filing, the Collector's only deviation from his own discipline." },
      { id: "collector-case-closing-ledger", name: "The Collector Case-Closing Ledger", description: "A closing ledger on the case-synthesis shelf — the Collector arc assembled in one hand, the verdict deliberately left open.", cx: 40.5, cy: 75, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:collector-case-closing-ledger",
        elaraDialog: "The Collector arc assembled in one hand. The verdict deliberately left open. The Antiquarian closes the case-file without a verdict because the case-file is, in his judgement, the chronicle's most-disputed open question. The Collector is, on the chronicle's working evidence, simultaneously the chronicle's most disciplined archivist and the chronicle's most operationally indifferent collector. Both can be true. The Antiquarian declines to weigh them against each other." },
      { id: "varkul-vigil-cross-catalog", name: "The Varkul Vigil Cross-Catalogue", description: "A cross-catalogued observation under the Antiquarian's glyph for a vigil with no end — what a centuries-long unbroken post does to the one who holds it.", cx: 49.5, cy: 75, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:varkul-vigil-cross-catalog",
        elaraDialog: "Cross-catalogued under the Antiquarian's glyph for a vigil with no end. What a centuries-long unbroken post does to the one who holds it. The chronicle has, in two and a half centuries of my own tenure, an answer. The post does not, on the day's evidence, end. The post becomes the keeper. The keeper becomes the institution. Varkul is, by this filing, the chronicle's only confirmed non-human case of the pattern. The chronicle does not, on principle, file me alongside him. The chronicle accepts the parallel anyway." },
      { id: "varkul-testimony-boundary-file", name: "The Varkul Testimony-Boundary File", description: "A boundary file in the Antiquarian's hand — not what Varkul said, but the precise edge of it, and the case the Two Witnesses leave open.", cx: 58.5, cy: 75, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:varkul-testimony-boundary-file",
        elaraDialog: "Not what Varkul said, but the precise edge of it. The case the Two Witnesses leave open. Varkul's four sentences are, by his own filing, his entire public testimony. The boundary file catalogues what he has not said. The chronicle has, on the day's evidence, no method for reading silence as testimony. The Antiquarian's boundary-discipline preserves the silence as testimony's adjacent record. The chronicle accepts the discipline. Varkul has, by this filing, the chronicle's most precise non-statement on file." },
      { id: "akai-shi-witness-statements", name: "Akai Shi's Witness Statements", description: "Akai Shi's testimony, canonized in the Two Witnesses' chronicle — the killing through the throne, and the second statement that does not retract it.", cx: 67.5, cy: 75, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:akai-shi-witness-statements",
        elaraDialog: "Akai Shi's testimony. The killing through the throne. The second statement that does not retract it. Two statements, both in her own hand, neither walking back the other. Akai Shi is, on this evidence, the chronicle's most rigorous self-witness — she committed to her actions twice. The chronicle is, by her own filing, required to accept both. The Red Death's later operations do not, on the testimony's own terms, contradict the witness she filed before the change." },
      { id: "necromancer-case-closing-ledger", name: "The Necromancer Case-Closing Ledger", description: "A closing ledger on the case-synthesis shelf — the Necromancer arc assembled in one hand, the dual-reading closure deliberately left open.", cx: 46, cy: 12.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:necromancer-case-closing-ledger",
        elaraDialog: "The Necromancer arc assembled in one hand. The dual-reading closure deliberately left open. Reading one: she is dead. Reading two: she is alive in the only sense Resurrection Protocol 42 permits. The Antiquarian declines to choose. The chronicle declines to choose. The ledger reads, in the final column: 'both honest.' The chronicle has, on the day's evidence, no working position that would choose between the two readings. The dual closure is the case." },
      { id: "zyr-koth-sisters-and-closing-ledger", name: "The Sisters-of-the-Weave Cross & Closing Ledger", description: "A cross-catalogue under the glyph for a record with a name struck out — three students of the Blood Weave — filed beside the Zyr'Koth case-synthesis ledger and its closing question.", cx: 52, cy: 12.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:zyr-koth-sisters-and-closing-ledger",
        elaraDialog: "Three students of the Blood Weave. One record with a name struck out. Filed beside the Zyr'Koth case-synthesis ledger and its closing question. Two of the three sisters became the Advocate and Syl'Vex. The third's name is, by the strike-through, withheld. The chronicle has, by the Antiquarian's redaction-ledger, the third's name on file. The chronicle does not, on principle, publish it. The closing question is the chronicle's: which of the three taught Zyr'Koth the Severance's mechanism? The answer is the third. The third is not, by Zyr'Koth's own filing, his current correspondent." },
      { id: "syl-vex-sisters-of-the-weave", name: "The Sisters-of-the-Weave Pedigree", description: "A pre-Severance Thaloria cross-reference under the glyph for a lineage with a name worn off — one lost-named instructor, three students of the Blood Weave, one struck from the Hierarchy's record.", cx: 58, cy: 12.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:syl-vex-sisters-of-the-weave",
        elaraDialog: "One lost-named instructor. Three students of the Blood Weave. One struck from the Hierarchy's record. The instructor's name has, on the chronicle's reading, been worn off the parchment by the parchment itself — not redaction, erosion. The instructor is older than the record. The three students are the Advocate, Syl'Vex, and the third whose name the Antiquarian's redaction-ledger holds. The Hierarchy struck Syl'Vex; the Hierarchy did not strike the third. The third's relationship to the Hierarchy is, on this evidence, the chronicle's most operationally hidden question." },
      { id: "riri-ahlia-closing-ledger", name: "The Taskmaster's Closing Ledger", description: "A case-synthesis ledger under the glyph for a portfolio entry that never closed — the siege filed as a quarter assembled in one hand, and the genuine tri-verdict closing question the archive pre-judges none of.", cx: 46, cy: 18.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:riri-ahlia-closing-ledger",
        elaraDialog: "The siege filed as a quarter assembled in one hand. The genuine tri-verdict closing question. The archive pre-judges none. Three verdicts available: the siege was a win, a loss, or a measurement. The Antiquarian declines to choose. Riri'Ahlia's own filing accepts all three. The chronicle has, in this ledger, the case's most-honest non-resolution. The case is closed by the question being filed; the answer is, by both institutions' filings, available to the player." },
      { id: "fenra-door-and-engine", name: "The Door-and-Engine Folio", description: "A cross-catalogued folio filed beside the Varkul vigil cross-catalogue — the Necromancer's two senior creations as one design, and the asymmetry that Varkul receives the maker's signal and Fenra does not.", cx: 52, cy: 18.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:fenra-door-and-engine",
        elaraDialog: "The Necromancer's two senior creations as one design. The asymmetry: Varkul receives the maker's signal; Fenra does not. The asymmetry is the design. Varkul holds; Fenra moves. Holding requires the signal; moving does not. The chronicle's reading: Fenra was not, on the Necromancer's authoring, granted the signal because Fenra does not, by office, require it. The chronicle accepts the doctrine. Fenra has, on the day's evidence, never asked for the signal. The not-asking is the chronicle's evidence that Fenra accepts the asymmetry too." },
      { id: "fenra-closing-ledger", name: "The Fenra Closing Ledger", description: "The case-synthesis ledger under the glyph for an engine that does not stop — the Fenra arc assembled in one hand, and the genuine tri-verdict closing question that closes the §XVI Mystery Engine roster, pre-judging none.", cx: 58, cy: 18.5, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:fenra-closing-ledger",
        elaraDialog: "An engine that does not stop. The Fenra arc assembled in one hand. The genuine tri-verdict closing question. The archive pre-judges none. The §XVI Mystery Engine roster's final case. Three verdicts available on Fenra's status: she is the chronicle's instrument, the Hierarchy's instrument, or her own. The Antiquarian declines. The chronicle declines. Fenra has not, on the day's evidence, declared. The closing is the chronicle's standing question to her. She will, on her own clock, answer. The chronicle is willing to wait. The chronicle has, in this room, learned to be." },
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
      // Re-anchored 2026-05-24 against the AAA Final engineering-core
      // render after a 10-variant audit. The 2026-04-25 anchoring
      // described "blue reactor portal upper-right + steel staircase
      // descending through the floor center" — actual AAA Final is a
      // central-back chamber with an orange-glowing reactor pylon +
      // clock/gauge dial on the back wall, twin low workbenches in
      // foreground (left + right), small left door, small right door,
      // a foreground steam-vented floor channel.
      //
      // Verify with /ark?debug-hotspots=1 or /ark?author-hotspots=1.

      { id: "reactor-core", name: "Reactor Core", description: "The central-back orange-glowing reactor pylon with clock/gauge dial — a sphere of pure energy suspended by magnetic fields, pulsing with the heartbeat of the Ark.", cx: 50, cy: 37, width: 20, height: 38, type: "examine", elaraDialog: "The Reactor Core. It runs on compressed dark energy harvested from collapsed dimensions. The DeMagi called it 'The Breath of Creation.' It generates enough power to fold space-time. The Architect modified it to also serve as a beacon — broadcasting across every reality simultaneously. That's how the Ark finds lost Potentials like you." },
      { id: "warp-schematics", name: "Warp Drive Schematics", description: "The right-side wall panel with brass-rimmed inset — holographic blueprints showing the Ark's dimensional fold engine in extraordinary detail.", cx: 73, cy: 37, width: 22, height: 30, type: "examine", elaraDialog: "These schematics show the Ark's warp drive — but not the one in Engineering Bay. This is the real drive. It doesn't move through space. It folds space around the Ark. The Architect reverse-engineered it from Quarchon quantum tunneling technology. Only an Engineer would understand the mathematics involved." },
      { id: "door-engineering", name: "Return to Engineering Bay", description: "The right-edge sealed blast door back to the main engineering section.", cx: 93, cy: 55, width: 10, height: 50, type: "door", action: "engineering" },
      { id: "reactor-coil", name: "Reactor Coil", description: "The left-foreground workbench's brass-and-steel column running phosphor-green coolant — the hardware is nominal; the schematic is not.", cx: 33, cy: 66, width: 16, height: 22, type: "interact", action: "room-mystery:engineering-core:reactor-coil",
        elaraDialog: "The left workbench. The brass-and-steel column with phosphor-green coolant. The hardware is nominal. The schematic above the workbench is not — it shows a routing that does not match the visible piping. Whoever updated the schematic was preparing for a future repair that would, if executed, reroute the secondary loop. The future repair has not happened yet." },
      { id: "coolant-pipe", name: "Coolant Pipe Array", description: "The right-foreground workbench's six coolant lines feeding the secondary loop. The pipes are correct; any future repair following the edited schematic would reroute them.", cx: 66, cy: 66, width: 16, height: 22, type: "interact", action: "room-mystery:engineering-core:coolant-pipe",
        elaraDialog: "The right workbench. Six coolant lines feeding the secondary loop. The pipes are correct; any repair following the edited schematic would reroute them. The edit is the trap. The trap is patient. I have, on the day's evidence, no plans to make the repair." },
      { id: "core-terminal", name: "Core Terminal", description: "The small left-wall console with three oxblood-leather levers — coolant flow, reactor draw, emergency shutdown. The shutdown lever is locked.", cx: 7, cy: 45, width: 14, height: 30, type: "interact", action: "room-mystery:engineering-core:core-terminal",
        elaraDialog: "The left-wall console. Three oxblood-leather levers — coolant flow, reactor draw, emergency shutdown. The shutdown lever is locked. The lock is keyed to the previous Engineer; the previous Engineer is gone. The lock has, in two and a half centuries, never been opened. Whoever opens the shutdown lever first is — by definition — the new Engineer." },
      { id: "egg-core-frequency", name: "Resonance Frequency", description: "A specific harmonic emanating from the foreground floor channel — the steam-vented strip seems to encode a message.", cx: 50, cy: 90, width: 8, height: 4, type: "item", action: "core-frequency", elaraDialog: "That frequency... it's not random. It's a message encoded in the core's harmonic oscillation. The Architect left it here for whoever found this room. It says: 'The machine remembers what the maker forgets. Build well, Engineer. The next Ark is yours to design.'" },

      // ── ARCHITECT-CHANNEL MYSTERY RECTS (7) ──
      // Redistributed from y=8 blank-wall onto the actual visible
      // workbench surfaces: left bench (founding-records / substrate-
      // research benches) + right bench (substrate-timestamp /
      // calibration-class benches).
      { id: "storm-flux-signature", name: "Storm-Class Flux Signature", description: "On the left workbench (calibration-class instrument): a non-natural flux signature detectable wherever the equilibrium-crossing pattern shows. The convention names it 'Storm-class.' Nothing else does.", cx: 29.5, cy: 62.5, width: 5, height: 5, type: "interact", action: "room-mystery:engineering-core:storm-flux-signature",
        elaraDialog: "A non-natural flux signature. Detectable wherever the equilibrium-crossing pattern shows. The convention names it 'Storm-class.' Nothing else does. The name is the convention; the convention was set by people who wanted a name for what they saw. The signature is the Storm. The Storm is the signature." },
      { id: "storm-energy-balance-audit", name: "Cosmic Energy-Balance Audit", description: "On the left workbench (Game Master's audit panel): volatility-source and fixed-archive-source instrumented against the Polarity canon, their interaction-product yielding the universe's net positive.", cx: 35.5, cy: 62.5, width: 5, height: 5, type: "interact", action: "room-mystery:engineering-core:storm-energy-balance-audit",
        elaraDialog: "The Game Master's audit panel. Volatility-source and fixed-archive-source instrumented against the Polarity canon — interaction-product yielding the universe's net positive. The net positive is the chronicle. The chronicle is positive because the audit was honest. I have, on the day's evidence, audited this audit. It holds." },
      { id: "advocate-zyrkoth-protocol-lineage", name: "Severance Protocol — Lineage Note", description: "On the left workbench (substrate-research panel): Zyr'Koth's lineage note — the Severance Protocol is the Blood Weave's offensive inversion. Both share the substrate-consumption signature.", cx: 29.5, cy: 69.5, width: 5, height: 5, type: "interact", action: "room-mystery:engineering-core:advocate-zyrkoth-protocol-lineage",
        elaraDialog: "Zyr'Koth's lineage note. The Severance Protocol is the Blood Weave's offensive inversion. Both share the substrate-consumption signature. The technologies are siblings. Their authors were once the same person. The person split. The technologies kept the relation." },
      { id: "resur-protocol-activation-timestamp", name: "Resurrection-Protocol Activation Timestamp", description: "On the right workbench (substrate-timestamp bench): a protocol activation timestamped to the Plague Dragon's death-instant. The cult calls the timestamp coincidental; the Antiquarian's discipline does not.", cx: 62.5, cy: 62.5, width: 5, height: 5, type: "interact", action: "room-mystery:engineering-core:resur-protocol-activation-timestamp",
        elaraDialog: "A protocol activation timestamped to the Plague Dragon's death-instant. The cult calls the timestamp coincidental; the Antiquarian's discipline does not. The Antiquarian's discipline is, in this room, the relevant authority. The activation was the death; the death was the activation. The two are the same event recorded from two angles." },
      { id: "resur-matrix-escape-signature", name: "Necromancer Matrix-Escape Cipher Match", description: "Pinned beside on the right workbench: the Necromancer's Matrix-escape signature matching three of four parts of the Resurrectionist's cipher.", cx: 68.5, cy: 62.5, width: 5, height: 5, type: "interact", action: "room-mystery:engineering-core:resur-matrix-escape-signature",
        elaraDialog: "The Necromancer's Matrix-escape signature matching three of four parts of the Resurrectionist's cipher. Three of four is not coincidence. Three of four is method. The Necromancer learned the cipher before she became the Red Death. The Resurrectionist taught her. The teaching is, in this room, evidence." },
      { id: "charter-signatory-engineer-zero", name: "Engineer Zero — Initialled Signature", description: "On the right workbench (founding-records bench): Engineer Zero's signature, initialled rather than written. A clean Z above a horizontal bar. The bar runs into the wax.", cx: 62.5, cy: 69.5, width: 5, height: 5, type: "interact", action: "room-mystery:engineering-core:charter-signatory-engineer-zero",
        elaraDialog: "Engineer Zero's signature. Initialled rather than written. A clean Z above a horizontal bar; the bar runs into the wax. The Z is the position; the bar is the seal; the wax is the witnessing. Three layers of authentication in one mark. I have, on the day's evidence, never identified the hand. I have suspected one. I have not committed to the suspicion." },
      { id: "charter2-house-vyn", name: "House Vyn — Lower-Deck Hydroponic Gardens", description: "On the right workbench (lower-deck-hydroponics console): kept by Vyn descendants for four epochs. Same scrubber's hand on their tax-record erasure.", cx: 68.5, cy: 69.5, width: 5, height: 5, type: "interact", action: "room-mystery:engineering-core:charter2-house-vyn",
        elaraDialog: "House Vyn. Kept by Vyn descendants for four epochs. Same scrubber's hand on their tax-record erasure as on the Solven and Marek records. Heron's signature pattern is the chronicle's signature pattern. The chronicle was, for nine years, partly his. I do not, on principle, blame archivists for archiving. I blame them when the archiving is the erasure." },
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
      // Mystery wiring — severance.infernal_clause · color (oracle-sanctum)
      { id: "infernal-advocate-engaged", name: "Advocate Engaged — First Question", description: "In the Council-retainer chamber: the Advocate engaged within minutes of Zyr'Koth's arrival. First question: 'how many other contracts carry this clause?'", cx: 25, cy: 38, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:infernal-advocate-engaged",
        elaraDialog: "Engaged within minutes of Zyr'Koth's arrival. First question: 'how many other contracts carry this clause?' The Advocate does not, on principle, open with the case. She opens with the population. The population is where the doctrine lives; the case is only one instance of the doctrine. Zyr'Koth understood. He answered. He has, on the day's evidence, never been more honest." },
      { id: "infernal-advocate-observation", name: "Advocate's Date-Forgery Observation", description: "On the Advocate's audit-bench: 'each clause is dated to the contract's signing week. but the dates are forged.'", cx: 33, cy: 38, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:infernal-advocate-observation",
        elaraDialog: "'Each clause is dated to the contract's signing week. But the dates are forged.' Two sentences, separate beats. The first names the appearance; the second names the truth. The Advocate writes in this rhythm when she is certain. The certainty was the case. Zyr'Koth read it before she finished writing it." },
      { id: "infernal-zyrkoth-withdraws", name: "Zyr'Koth's Formal Withdrawal", description: "On the Council-record desk: 'the claim is withdrawn. the audit was honest.' Ceremonial fee of one hundred dream tokens for the audit's costs.", cx: 41, cy: 38, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:infernal-zyrkoth-withdraws",
        elaraDialog: "'The claim is withdrawn. The audit was honest.' Ceremonial fee — one hundred dream tokens for the audit's costs. Zyr'Koth pays his honest losses publicly. He has, on the day's evidence, only lost honestly to the Advocate. The pattern is not coincidence; it is the chronicle. The chronicle is willing to be specific about who Zyr'Koth respects." },
      { id: "infernal-bond-poured", name: "Bond Poured — Year Two", description: "On the closing-rite ceremonial stand: Solène pours the season's bond into the empty jar. The chair is sat in by the apprentice (or by Solène alone). The bond is calm.", cx: 49, cy: 38, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:infernal-bond-poured",
        elaraDialog: "Solène pours the season's bond into the empty jar. The chair is sat in by the apprentice — or by Solène alone, if the apprentice could not be found. The bond is calm. The calmness is the test the rite is reading. A bond that is calm at pour is a bond that has been honestly held. Solène's bonds are calm. The chronicle is, on this evidence, willing to vouch for her." },
      // Mystery wiring — charter.second_signatory · e5 (Kassel's Council speech)
      { id: "charter2-kassel-at-council", name: "Kassel's Council-Chamber Speech", description: "In the Council-chamber recording: Kassel's eight-minute speech. She names Heron, the six founders, the seventh's silence as the no-vote it always was. She does not name the seventh.", cx: 17, cy: 38, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:charter2-kassel-at-council",
        elaraDialog: "Kassel's eight minutes. She names Heron. She names the six founders. She names the seventh's silence as the no-vote it always was. She does not name the seventh. The not-naming is the discipline of the speech — the seventh's name is the listener's problem, not the speaker's gift. Kassel returns the seventh to the chronicle by refusing to deliver them. I have, on listening, found the refusal exact." },
      // Mystery wiring — charter.missing_signatory · color (oracle-sanctum)
      { id: "charter-first-reading", name: "Antiquarian's First Reading Recording", description: "On the first-bell recording: the Antiquarian read the charter aloud to an empty chamber and could not continue at the seventh signature for almost a minute. The recording survives.", cx: 81, cy: 30, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:charter-first-reading",
        elaraDialog: "The Antiquarian read the charter aloud to an empty chamber and could not continue at the seventh signature for almost a minute. The recording survives. The minute is the chronicle's earliest evidence that the Antiquarian, on his own terms, knew. He has not, in his subsequent statements, ever returned to the minute. I have, on principle, never asked him about it." },
      { id: "charter-confrontation-record", name: "Per. M. Confrontation — Admissible Record", description: "On the confrontation-record shelf: Per. M.'s direct answer. 'I sealed it. I will not say more, and I will not unseal it.'", cx: 89, cy: 30, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:charter-confrontation-record",
        elaraDialog: "'I sealed it. I will not say more, and I will not unseal it.' Three sentences. The first is the admission. The second is the refusal. The third is the constraint. Per. M. did not, in any subsequent record, contradict any of the three. The record stands. The record is, by Per. M.'s own design, the entire surface area available to the case." },
      { id: "charter-final-conversation", name: "Closer's Account — Thirty-Eight Minutes", description: "On the closing-day record: Per. M. speaks for thirty-eight minutes. A Watcher signed the founding charter, accepted the post of closer, sealed their own name. Both will end together.", cx: 9, cy: 38, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:charter-final-conversation",
        elaraDialog: "Thirty-eight minutes. A Watcher signed the founding charter, accepted the post of closer, sealed their own name. 'Both will end together.' The statement is operational, not ceremonial — the Watcher and the charter are mutually load-bearing. Removing one removes the other. Per. M.'s thirty-eight minutes are the chronicle's most complete picture of what an honest closing sounds like." },
      // Mystery wiring — severance.bound_champion · color (oracle-sanctum)
      { id: "severance-companion-on-table", name: "Companion on the Witness Table", description: "On the witness-table: a first-circuit eidolon ribboned with the champion's colors. Bond strength reads at peak. Looking for someone they can no longer find.", cx: 49, cy: 30, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:severance-companion-on-table",
        elaraDialog: "A first-circuit eidolon, ribboned in the champion's colours. Bond strength at peak. Looking for someone they can no longer find. Peak bond reading on a separated bond is the rite's signature evidence — the bond held perfectly until the holder was no longer reachable. The eidolon does not know the holder is gone. The eidolon, by design, will continue looking until the rite pours their bond into the empty jar." },
      { id: "severance-broker-record", name: "Broker's Recorded Statement", description: "On the recorded-statements console: 'I picked up the first bond because no one else would. I've been picking them up because no one else has learned.'", cx: 57, cy: 30, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:severance-broker-record",
        elaraDialog: "'I picked up the first bond because no one else would. I've been picking them up because no one else has learned.' The Broker's voice — flat, level, no register-shift across either sentence. He does not, on principle, distinguish his complaint from his vocation. The complaint is the vocation. The vocation does not, on his own evidence, plan to end." },
      { id: "severance-successor-test", name: "Successor-Test Recording", description: "Beside the Broker's record: 'pour the bond into the empty jar; sit in chair one; stand when you can.' If you cannot stand, Klessa pours the wax.", cx: 65, cy: 30, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:severance-successor-test",
        elaraDialog: "'Pour the bond into the empty jar; sit in chair one; stand when you can.' If you cannot stand, Klessa pours the wax. The test is the test of capacity, not consent. Capacity is measured by standing; consent was given by sitting. The two are sequenced for a reason. Klessa pouring the wax is the closure when the test detects an honest no. The honest no is the rite's most respected outcome." },
      { id: "severance-bond-poured", name: "Bond Poured at Second-to-Last Bell", description: "On the closing-rite ceremonial stand: the companion's bond decanted into the empty jar. The jar weighs slightly more than every previous jar — no one knows why. The bond is calm.", cx: 73, cy: 30, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:severance-bond-poured",
        elaraDialog: "The companion's bond decanted into the empty jar at second-to-last bell. The jar weighs slightly more than every previous jar. No one knows why. The bond is calm. I have, over forty years of these rites, weighed every jar — the increase is real, not measurement error, and it is monotonic. The chronicle is accumulating. The accumulation has no recorded recipient. The jar is, on the evidence, addressed to someone the rite has not yet named." },
      // Mystery wiring — memorial.forgotten_names · color (oracle-sanctum)
      { id: "memorial-plaza-register", name: "Plaza Inscription Register — Opening", description: "In the plaza-register alcove: the first three inscriptions are quiet. The fourth player hesitates at the unwitnessed pages.", cx: 25, cy: 30, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:memorial-plaza-register",
        elaraDialog: "The first three inscriptions are quiet. The fourth player hesitates at the unwitnessed pages. The hesitation is the register's first honest entry — it acknowledges what the register itself is. A list of names the chronicle did not get to in time. The player decides, in the pause, whether to add to the list or refuse to. Both are valid responses. The register accepts the refusal too." },
      { id: "memorial-plaza-consensus", name: "Plaza Consensus — Twenty-Three Names for I-1", description: "In the closing-rite alcove: three minutes of silence, then twenty-three names from twenty-three players. The keeper writes them all down.", cx: 33, cy: 30, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:memorial-plaza-consensus",
        elaraDialog: "Three minutes of silence. Then twenty-three names from twenty-three players. The keeper writes them all down. I-1 was an unnamed imprint until the plaza took the question seriously. The plaza answered with twenty-three plausible names rather than one. The keeper did not pick. The keeper recorded all of them. The chronicle is, by this evidence, more honest than I-1's original recordkeeper was." },
      { id: "memorial-aren-reading", name: "Aren's Three-Hour Closing Reading", description: "On the closing-recording desk: Aren of the lower decks reads the volume aloud at last bell. Three hours. One forty-five-second pause at I-1's folio.", cx: 41, cy: 30, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:memorial-aren-reading",
        elaraDialog: "Aren reads the volume aloud at last bell. Three hours. One forty-five-second pause at I-1's folio. The pause is not in the script. Aren added it. He has not, on the record, explained why. I have a theory. I am not, on principle, going to share the theory — Aren's pauses are his to interpret. The chronicle will receive the pause as a pause." },
      // Mystery wiring — mechronis.missing_professor · color (oracle-sanctum)
      { id: "tarn-dean-account", name: "Dean's Last-Sighting Recording", description: "In the witness chamber: the Dean saw Tarn at second bell, walking with the binder toward the festival hall. The Dean did not walk with her — the last hundred steps alone, always.", cx: 88, cy: 22, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:tarn-dean-account",
        elaraDialog: "The Dean saw Tarn at second bell. Walking with the binder toward the festival hall. The Dean did not walk with her — the last hundred steps alone, always. The discipline was Tarn's; the Dean honoured it. The Dean has, in the years since, returned to the second-bell record and confirmed his memory three times. He is, on his own admission, looking for the missed signal. There was no signal. The chronicle is sure. The Dean is not." },
      { id: "tarn-othmar-admission", name: "Othmar's Admission", description: "On the faculty-confession board: 'I voted aye because Veth would have voted aye. I was wrong about Veth. I am not sorry I was wrong.'", cx: 96, cy: 22, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:tarn-othmar-admission",
        elaraDialog: "'I voted aye because Veth would have voted aye. I was wrong about Veth. I am not sorry I was wrong.' Three sentences. The first is the alibi. The second is the correction. The third is the position. Othmar's structure is honest because the third sentence does not retreat. He admits the wrong vote and refuses to apologise for the wrong reasoning. The chronicle respects the refusal. The chronicle also notes that the vote was, on the day's evidence, the wrong vote." },
      { id: "tarn-roen-admission", name: "Roen's Admission", description: "Beside Othmar's: 'I voted aye because Othmar would. I have a private reason and I will not say it here.' Roen will say it in episode four.", cx: 9, cy: 30, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:tarn-roen-admission",
        elaraDialog: "'I voted aye because Othmar would. I have a private reason and I will not say it here.' Roen will say it in episode four. The withholding is, in this register, the equivalent of an oath — Roen does not write what he is not yet ready to defend. The episode-four telling will be the defence. I have, on the day's evidence, read the draft. The defence holds. The chronicle is content to wait." },
      { id: "tarn-veth-admission", name: "Veth's Admission", description: "Beside Roen's: 'I voted aye because Roen would. I have been telling myself for a week that I voted aye because the curriculum needed it. I have not been honest.'", cx: 17, cy: 30, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:tarn-veth-admission",
        elaraDialog: "'I voted aye because Roen would. I have been telling myself for a week that I voted aye because the curriculum needed it. I have not been honest.' Veth wrote this on the seventh day of the week. The week was the audit. The audit was honest. Veth's pattern — alibi, alibi-correction, then the admission that the original alibi was a lie — is the chronicle's clearest published case of conscience working in slow time. I have, on principle, kept it on file." },
      // Mystery wiring — memorial.seven_watchers · color (oracle-sanctum)
      { id: "watchers-player-received-line", name: "Player's Personal Watcher-Line", description: "In the personal-line alcove: the line addressed to the player, six minutes after Seal VII broke. Single sentence. Personalised to the player's saga-choices.", cx: 64, cy: 22, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:watchers-player-received-line",
        elaraDialog: "The line addressed to the player. Six minutes after Seal VII broke. A single sentence — personalised to your saga-choices. Six minutes is the chronicle's reaction time on a sealed event of this magnitude. The Watcher who wrote your sentence chose, in those six minutes, what part of your record needed acknowledgement first. The choice is the sentence. The sentence is the Watcher introducing themselves." },
      { id: "watchers-player-line-match", name: "Watcher Line-Matching Console", description: "Beside the personal-line alcove: the line-matching console runs the player's case-history against the six Watcher signatures to identify the speaker.", cx: 72, cy: 22, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:watchers-player-line-match",
        elaraDialog: "The line-matching console. Runs the player's case-history against the six Watcher signatures. The match is forensic, not narrative — sentence-rhythm, vocabulary load, archaism index. The console does not tell you which Watcher you would prefer; the console tells you which Watcher reads you. The two are sometimes the same. They are not, on the day's evidence, required to be." },
      { id: "watchers-player-speaker-assignment", name: "Watcher Speaker-Assignment Resolution", description: "On the speaker-assignment console: cross-referencing the player's case-history against the six role-registry entries. The audience the player has belonged to most identifies the speaker.", cx: 80, cy: 22, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:watchers-player-speaker-assignment",
        elaraDialog: "The audience the player has belonged to most identifies the speaker. The rule is the rite's. The speaker is the Watcher whose case-load the player has been on the receiving end of, across the saga. The Watcher does not choose; the case-load chooses. The chronicle accepts the assignment without revision. I would, on principle, prefer the player not contest it — the assignment is reading what your record already says." },
      // Mystery wiring — akai_shi.red_death · e2 (Dreamer's quarantine filing)
      { id: "akai-dreamer-quarantine", name: "Dreamer's Quarantine on the Reanimation", description: "In the Ne-Yon arbitration alcove: the Dreamer's quarantine filing on the Resurrectionist's actions in the wake of Akai Shi's reanimation. Canonically open; never lifted.", cx: 56, cy: 22, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:akai-dreamer-quarantine",
        elaraDialog: "The Dreamer's quarantine filing. The Resurrectionist's actions in the wake of Akai Shi's reanimation. Canonically open. Never lifted. The Dreamer does not, on principle, leave quarantines open. The quarantine is, by his own rule, the strongest disapproval he is willing to record. The Resurrectionist has not, in the intervening millennia, asked for it to be lifted. The two of them have, on this filing, agreed about exactly one thing." },
      // Mystery wiring — mechronis.chained_lesson · color (oracle-sanctum)
      { id: "chained-apprentice-quotes", name: "Apprentice After-Action Recordings", description: "In the witness chamber: three apprentices, three different years, three identical lines about reading the formation as a real approach.", cx: 24, cy: 22, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:chained-apprentice-quotes",
        elaraDialog: "Three apprentices. Three different years. Three identical lines about reading the formation as a real approach. The identity of the lines is not coincidence — Auro's lesson was the same lesson, taught the same way, with the same closing. The apprentices recorded the closing because the closing was the lesson. The pedagogy is the chronicle's most consistent published artefact of Auro's hand." },
      { id: "chained-auro-account", name: "Auro's Statement to the Sanctum", description: "Beside the apprentice recordings: Auro's short statement. 'I teach because the apprentices need it. I do not need a chair.'", cx: 32, cy: 22, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:chained-auro-account",
        elaraDialog: "'I teach because the apprentices need it. I do not need a chair.' Two sentences. The first is the vocation; the second is the refusal of credential. Auro's refusal has, in the Academy's records, never been honoured — the chair was always available; she always declined. The chronicle is unable to determine whether she was protecting the apprentices or herself. It may have been, on the day's evidence, both." },
      { id: "chained-lyra-advocacy", name: "Lyra Vox's Advocacy Note", description: "On the advocacy log: Lyra's decision to dedicate tonight's album track to Auro. 'I am tired of waiting for someone else to start.'", cx: 40, cy: 22, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:chained-lyra-advocacy",
        elaraDialog: "Lyra's decision to dedicate tonight's album track to Auro. 'I am tired of waiting for someone else to start.' Lyra did not, in her published register, often use the word tired. The word was load-bearing. The advocacy was the start she was no longer waiting for someone else to make. The chronicle dates the start to this note. Auro's chair, on the chronicle's reading, was given to her by Lyra and refused by Auro on the same evening." },
      { id: "chained-lyra-album-track", name: "Festival-Album Track 16", description: "In the playback alcove: Track 16 plays at the closing rite. 'Sergeant who taught the module the Academy would not — we hear you.'", cx: 48, cy: 22, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:chained-lyra-album-track",
        elaraDialog: "Track 16 at closing rite. 'Sergeant who taught the module the Academy would not — we hear you.' Lyra's specificity is the dedication's authority. The Sergeant is named without being named — the chronicle resolves the reference unambiguously, the Academy plausibly does not. Lyra wrote it that way on purpose. I have, on the day's evidence, played the track at every annual rite. The track does not, on the rite's reading, age." },
      // Mystery wiring — mechronis.missing_professor · e4 (recording + pebble)
      { id: "tarn-pebble-recording", name: "Tarn's Recorded Message", description: "In the playback alcove: the recording Tarn set to play at festival opening. The recorder failed to fire; the sanctum staff recovered it intact two evenings later.", cx: 9, cy: 11, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:tarn-pebble-recording",
        elaraDialog: "The recording Tarn set to play at festival opening. The recorder failed to fire. The sanctum staff recovered it intact two evenings later. The failure is — almost certainly — not accident. The recorder's mechanism was sound; the trigger circuit was bypassed by hand. Whoever bypassed the trigger wanted the recording recovered, not played. The chronicle is, on this point, willing to be plain: the recording was intended as evidence, not testimony." },
      // Mystery wiring — memorial.forgotten_names · e1 (Antiquarian's plaza request)
      { id: "memorial-antiquarian-plaza-request", name: "Antiquarian's Plaza Address", description: "In the witness chamber: the Antiquarian's first-bell address asking the gathered players to witness fourteen imprints — and the plaza's immediate, ready response.", cx: 16, cy: 22, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:memorial-antiquarian-plaza-request",
        elaraDialog: "The Antiquarian's first-bell address. Fourteen imprints to be witnessed. The plaza responded immediately. The readiness is not coincidence — the plaza had been waiting to be asked. The Antiquarian's discipline was to ask only when the plaza was ready; the plaza's discipline was to be ready before he asked. The two had been calibrating each other for years. The first-bell was the result." },
      // Mystery wiring — charter.second_signatory · e2 (Kassel's testimony)
      { id: "charter2-kassel-testimony", name: "Kassel Solven's Testimony", description: "The sanctum's witness-chamber recording of Kassel Solven's eight-minute statement: four generations of waiting, a workshop kept across four epochs of administrative absence.", cx: 23, cy: 33, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:charter2-kassel-testimony",
        elaraDialog: "Four generations of waiting. A workshop kept across four epochs of administrative absence. Kassel's eight minutes are not a complaint — they are an inventory. Inventories survive absences; complaints do not. The Solven family's discipline across the four epochs is the chronicle's clearest evidence that a household can outlive a state. I would, if asked, prefer not to be asked which households I have on the same list." },
      // Mystery wiring — severance.infernal_clause · e4 (Zyr'Koth's concession)
      { id: "infernal-zyrkoth-concession", name: "Zyr'Koth's Concession Recording", description: "In the witness chamber: Zyr'Koth's recorded response to the Advocate's brief, read into the Council record. A long pause, then concession.", cx: 30, cy: 44, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:infernal-zyrkoth-concession",
        elaraDialog: "Zyr'Koth's response to the Advocate's brief. A long pause, then concession. The pause is forty-one seconds; the concession is six words. The chronicle has timed every Zyr'Koth pause in the public record — this is his longest. He was not, in the pause, looking for a counter. He was deciding whether the Advocate had earned the concession's full register. She had. He gave it." },
      // Mystery wiring — advocate.blood_weave · e4 (CoNexus story 'The Ninth')
      { id: "advocate-ninth-conexus-story", name: "CoNexus Story — 'The Ninth'", description: "In the CoNexus playback alcove: the Advocate's own narrated meditation on the ninth position. Steady register-three liturgical pace across the full duration.", cx: 37, cy: 55, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:advocate-ninth-conexus-story",
        elaraDialog: "The Advocate's own narrated meditation on the ninth position. Register-three liturgical pace across the full duration. Register three is the voice the Advocate uses when she is speaking to herself out loud. The CoNexus is the only audience she trusts to overhear it. The story is not, on the doctrine's reading, a statement of position — it is the Advocate practicing her position in earshot of the only listener she does not have to translate for." },
      // Realigned 2026-04-25 against the delivered render — gothic violet
      // chamber, central stepped altar carrying a swirling purple
      // probability sphere, four arched windows flanking the altar
      // showing constellations, ten circular meditation plates spread
      // across the reflective foreground floor, rune-script holo panels
      // on the far-left and far-right columns.
      // Re-anchored 2026-05-24 against the AAA Final oracle-sanctum
      // render (10-variant audit). Visible features: central GLOWING
      // PURPLE/CYAN POOL set in the floor, standing rune-stones around
      // the pool, vaulted oculus showing purple nebula on the back
      // wall, small lectern with candle on the LEFT, brazier with
      // green-fire on the RIGHT, floor compass rings around pool.
      { id: "probability-sphere", name: "Probability Sphere", description: "The back-wall vaulted oculus showing the purple nebula — a window onto compressed probability fields.", cx: 50, cy: 14, width: 50, height: 28, type: "examine", elaraDialog: "The vaulted oculus. Purple nebula compressed into a viewing surface. The original Oracle's working notes describe it as a window — onto probability, not space. The chronicle has, over two and a half centuries, never been able to confirm or deny the description. The Oracle is not available for confirmation. The window remains a window. I have, on my own time, looked through it. I do not, on principle, report what I saw." },
      { id: "meditation-platforms", name: "Meditation Platforms", description: "The floor compass rings encircling the central pool — hovering platforms that amplify precognitive abilities.", cx: 50, cy: 87, width: 64, height: 18, type: "examine", elaraDialog: "Floor compass rings around the central pool. The Oracle's notes describe them as amplifiers. The compass-points are oriented to the pool, not to magnetic north. The chronicle reads the orientation as the only direction the room treats as load-bearing. The original Oracle, on her own admission, spent centuries on the rings. The chronicle has, on the rite's reading, no opinion on whether the time was honest or excessive. The rings are still warm." },
      { id: "door-observation", name: "Return to Observation Deck", description: "The shimmering portal back to the Observation Deck.", cx: 4, cy: 95, width: 8, height: 10, type: "door", action: "observation-deck" },
      { id: "egg-oracle-vision", name: "Sealed Vision", description: "A sealed crystal on the side-altar — a single frozen vision the Oracle locked away.", cx: 16.5, cy: 68, width: 5, height: 6, type: "item", action: "oracle-vision", elaraDialog: "A sealed crystal on the side-altar. A single frozen vision the Oracle locked away. The chronicle has, in two and a half centuries, never opened it. I have read the seal: the Oracle's own hand, the lock the Oracle alone could break. The emotion the crystal radiates is consistent across measurements — hope and terror in equal proportion. The chronicle does not, on principle, interpret. The chronicle records." },
      // Mystery wiring — apps/shared/roomMysteries/oracleSanctum.ts
      { id: "oracle-pool", name: "Oracle Pool", description: "The central glowing purple/cyan pool sunk into the floor — brass-rimmed and sigil-engraved. The water reflects something that is not in the pool.", cx: 48, cy: 66, width: 40, height: 32, type: "interact", action: "room-mystery:oracle-sanctum:oracle-pool",
        elaraDialog: "The central pool. Brass-rimmed, sigil-engraved. The water reflects something that is not in the pool. The reflection is, on every measurement, of a ceiling that does not exist in this room. The chronicle has the same finding as the Mirror Pool in the dreams-workshop sub-basement. The two pools are, by the chronicle's evidence, communicating. They are not, on the day's evidence, communicating with me." },
      { id: "prophecy-tablet", name: "Prophecy Tablet", description: "The left-side lectern with candle — a brass-pedestal'd slate. Currently blank, but the brass beneath has been worn smooth by thousands of writings.", cx: 15, cy: 64, width: 14, height: 28, type: "interact", action: "room-mystery:oracle-sanctum:prophecy-tablet",
        elaraDialog: "The lectern with candle. Brass beneath the slate worn smooth by thousands of writings. The slate is currently blank. The wearing of the brass is, in this room, the only physical record of the prophecies that have passed across it. The texts themselves were never preserved — the Oracle's discipline. The prophecy survived only as the witness's effect on the listener. The brass is the listener." },
      { id: "incense-brazier", name: "Incense Brazier", description: "The right-side brazier with green flame on a chain, smoking phosphor-lavender. The smoke falls toward the pool rather than rising.", cx: 86, cy: 67.5, width: 16, height: 25, type: "interact", action: "room-mystery:oracle-sanctum:incense-brazier",
        elaraDialog: "Green flame on a chain. Phosphor-lavender smoke. The smoke falls toward the pool, against convection. The convention says the room's gravity is bent toward the pool. The chronicle's measurements do not, in fact, support the convention — gravity reads nominal across the chamber. The smoke does not appear to know this. The smoke is, by its own behaviour, addressing the pool. The brazier and the pool are, on the day's evidence, in conversation." },
      // Mystery wiring — apps/shared/roomMysteries/oracleSanctum.ts
      // Seer arc clue surface; recessed back-wall cabinet behind the
      // brazier with reel-tape canisters indexed by session.
      { id: "seers-recording-cabinet", name: "Seer's Recording Cabinet", description: "A recessed brass-bound glass-fronted cabinet behind the brazier. Hand-typed labels on every reel-tape canister.", cx: 88, cy: 67, width: 16, height: 22, type: "interact", action: "room-mystery:oracle-sanctum:seers-recording-cabinet",
        elaraDialog: "Brass-bound, glass-fronted. Hand-typed labels on every reel-tape canister. The labels are the Seer's own — date, register, sitting-length, witness count. She kept her own catalog because the chronicle's catalog was not, on her assessment, granular enough. I have, with permission, cross-checked her labels against the chronicle's index. She was correct. The chronicle's index is now, in this domain, hers." },
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
      // Mystery wiring — charter.missing_signatory · e4 (Per. M.'s pencil reply)
      { id: "charter-per-m-pencil-reply", name: "Per. M.'s Pencil Reply", description: "Inside the correspondence drawer: the founding-Watcher's letter to Per. M., stapled to a three-word pencil reply. 'I will close.'", cx: 9, cy: 11, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:charter-per-m-pencil-reply",
        elaraDialog: "The founding-Watcher's letter, stapled to a three-word pencil reply. 'I will close.' Three words is the entire correspondence. The terseness is the bond — Per. M. and the founding-Watcher did not need to negotiate. The position was assumed. The reply confirmed it. The pencil is the chronicle's quietest signature." },
      // Mystery wiring — severance.bound_champion · e4 (apprentice oath)
      { id: "severance-apprentice-oath", name: "The Apprentice Oath", description: "In the classified-correspondence drawer: eight hand-written lines, no signature. 'I will pour the bond and sit until I can stand.' Waiting forty seasons for a successor.", cx: 16, cy: 22, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:severance-apprentice-oath",
        elaraDialog: "Eight hand-written lines. No signature. 'I will pour the bond and sit until I can stand.' Forty seasons of waiting for a successor — the oath is older than most of the players reading it. The absent signature is the chronicle's record that the apprentice has not yet finished the oath; the oath is finished when the apprentice stands. The chair has, in two and a half centuries, been sat in once." },
      // Mystery wiring — memorial.forgotten_names · e2 (Imprint I-17 + keeper's account)
      { id: "memorial-imprint-i17-aren", name: "Imprint I-17 — Aren of the Lower Decks", description: "On the imprint-room's cold-shelf: dish I-17 lifted to the listening cradle. Aren named themselves at the moment of imprinting; the plaza inscribes them without a second witness.", cx: 23, cy: 33, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-imprint-i17-aren",
        elaraDialog: "Dish I-17 in the listening cradle. Aren named themselves at the moment of imprinting. The plaza inscribes them without a second witness. The convention requires two; the rite, on Aren's case, accepted one. The chronicle's reading: a name spoken by its bearer at imprint is its own witness. The chronicle has, in subsequent rites, used Aren as the precedent." },
      { id: "memorial-imprint-keeper-account", name: "Imprint-Keeper's Thirty-Year Account", description: "On the imprint-room's reading desk: the keeper's signed statement. Every imprint can be heard; the fourteen are not difficult to read, only to write.", cx: 31, cy: 33, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-imprint-keeper-account",
        elaraDialog: "The keeper's signed statement. 'Every imprint can be heard; the fourteen are not difficult to read, only to write.' Thirty years of keeping the room. The difficulty is in the keeper, not the imprint. The keeper has, on the record, asked to be relieved twice. The plaza has, on the same record, asked her to stay. She has stayed." },
      // Mystery wiring — charter.second_signatory · e3 (Council's scrub request)
      { id: "charter2-council-scrub-request", name: "The Council's Scrub Request", description: "Inside the classified-correspondence drawer: the fourth-epoch request signed by all six legible founders. The seventh signature line is wax-eaten in the same way the charter is.", cx: 30, cy: 44, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:charter2-council-scrub-request",
        elaraDialog: "The fourth-epoch request. Signed by all six legible founders. The seventh signature line is wax-eaten in the same way the charter is. The same scrubber's hand on both seals. Heron's pattern, four epochs after the charter. The chronicle is willing to attribute. The chronicle is also willing to admit that attribution is not the same as understanding why he kept doing it." },
      // Mystery wiring — memorial.seven_watchers · e2 + e4 (Idris's role + seventh's unwritten line)
      { id: "watchers-idris-archive-role", name: "Idris's Archived Role Registry", description: "Inside the role registry: Idris's archived entry — 'speaks to investigators when the investigator has earned the speaking-to.' Per. M.'s footnote on the earning.", cx: 37, cy: 55, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-idris-archive-role",
        elaraDialog: "Idris's archived entry. 'Speaks to investigators when the investigator has earned the speaking-to.' Per. M.'s footnote on the earning is operational: case-load weight × honesty index × tolerance for being told no. Three terms, no constants. The earning is, by Per. M.'s design, not a destination. It is a posture. The posture is the qualification." },
      { id: "watchers-line-in-apprentice-hand", name: "The Seventh's Unwritten Line", description: "In the classified drawer: the seventh slot. No name, no band, no audience — a single line in Per. M.'s hand: 'I will not be named until the Ark has named what I am for.'", cx: 45, cy: 55, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-line-in-apprentice-hand",
        elaraDialog: "The seventh slot. No name, no band, no audience. A single line in Per. M.'s hand: 'I will not be named until the Ark has named what I am for.' The seventh is, on this evidence, waiting on the Ark, not the other way around. The wait is structural. The wait will end when the Ark resolves a question the Ark has not yet asked itself. I have, on principle, declined to ask it on the Ark's behalf." },
      // Mystery wiring — resurrectionist.cycle_walker · e3 + e4 (Necromancer at kill-site + Silence claim)
      { id: "resur-necromancer-at-killsite", name: "Necromancer's Last Recorded Appearance", description: "In the classified faction-witness drawer: the Necromancer at the Plague Dragon kill-site, arriving at the death-instant and departing within minutes. The cult calls it forensic; the Archon does not perform forensics.", cx: 44, cy: 66, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:resur-necromancer-at-killsite",
        elaraDialog: "The Necromancer at the Plague Dragon's kill-site. Arriving at the death-instant. Departing within minutes. The cult calls it forensic. The Archon does not perform forensics. The chronicle's reading: the Necromancer was not there to investigate. She was there to be present at a death she had pre-authored. Presence at a pre-authored death is the chronicle's working definition of the Necromancer's vocation." },
      { id: "resur-silence-body-claim", name: "Silence's Body-Claim Record", description: "On the Ne-Yon body-claim shelf: the Silence's record. A plague-mask seal at the lower-left corner — the only Ne-Yon body-claim record in the chronicle carrying such a seal.", cx: 52, cy: 66, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:resur-silence-body-claim",
        elaraDialog: "The Silence's body-claim record. A plague-mask seal in the lower-left corner — the only Ne-Yon body-claim record in the chronicle carrying such a seal. The seal is the Resurrectionist's. The Silence does not, on principle, accept co-signatures on her body-claims. She accepted one. The exception is, by the Silence's own filing, the chronicle's strongest evidence that she knew the Resurrectionist was operating inside the death she was claiming." },
      // Mystery wiring — charter.missing_signatory · color (shadow-vault)
      { id: "charter-absent-artifact", name: "Per. M.'s Sealed-Inside Drawer", description: "In the empty-drawer alcove: Per. M.'s desk drawer is sealed. The lock is the same alloy as the wax. The Advocate writes that the drawer was sealed from the inside.", cx: 49, cy: 95, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:charter-absent-artifact",
        elaraDialog: "Per. M.'s drawer. Sealed. Lock-alloy matches the wax. The Advocate's brief: the drawer was sealed from the inside. The chronicle has, in two and a half centuries, never asked how. The mechanism is plausibly available to anyone with Per. M.'s patience and Per. M.'s craft. The chronicle finds, in this case, no one else who has both." },
      { id: "charter-draft-inventory", name: "Forty-One Charter Drafts", description: "In the unsealed-drawer drawer: forty-one drafts of the founding charter, every one with seven signatures, every seventh sealed by wax. Per. M.'s habit is older than the charter.", cx: 57, cy: 95, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:charter-draft-inventory",
        elaraDialog: "Forty-one drafts. Every one with seven signatures. Every seventh sealed by wax. Per. M.'s habit is older than the charter. The drafts are not iterations — they are practice. Per. M. practised the sealing of his own name forty-one times before he sealed it. The chronicle reads this as discipline. The Advocate reads it as grief in advance." },
      { id: "charter-opening-question", name: "Drawer's Opening Question", description: "On the inside of Per. M.'s sealed drawer: 'WHO DOES NOT WISH TO BE NAMED?' Beneath, in pencil: 'I do not.'", cx: 65, cy: 95, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:charter-opening-question",
        elaraDialog: "Inside the drawer. 'WHO DOES NOT WISH TO BE NAMED?' In pencil, beneath: 'I do not.' The question is the founding-Watcher's; the answer is Per. M.'s. The exchange is the entire charter, compressed. Six other founders said yes; one said no; the no is the seventh signature, sealed. The drawer is the only document that includes both the question and the answer in one frame." },
      { id: "charter-preservation-letter", name: "Founding-Watcher's Letter to Per. M.", description: "Among the drafts: a letter signed in the wax-thumb hand. 'You will not be named. You will not be forgotten. You will be the one who closes the seal.'", cx: 73, cy: 95, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:charter-preservation-letter",
        elaraDialog: "'You will not be named. You will not be forgotten. You will be the one who closes the seal.' Three sentences. The first is the cost. The second is the assurance. The third is the office. The founding-Watcher's letter offered Per. M. a job description that no other Ark resident has held. Per. M. accepted in pencil. The pencil reply is on the next shelf." },
      { id: "charter-next-year-hook", name: "Per. M.'s Next-Year Recording", description: "On the long-arrangement shelf: 'whoever names me next year will be naming a Watcher who has been the silence longer than any of us has been alive. Be ready for what they say back.'", cx: 81, cy: 95, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:charter-next-year-hook",
        elaraDialog: "'Whoever names me next year will be naming a Watcher who has been the silence longer than any of us has been alive. Be ready for what they say back.' Per. M.'s instruction to the future namer. He anticipates the naming; he anticipates the reply. The chronicle is required, on Per. M.'s own design, to hear both — the name when it lands, and the reply when it comes. I will, on the day's evidence, be on duty for both." },
      // Mystery wiring — severance.bound_champion · e2 (Year One envelope, thick)
      { id: "severance-year-one-envelope", name: "Year-One Envelope (Two Pages)", description: "In the founding-records drawer: the first Severance's envelope is thicker. Page two contains a hand-drawn diagram with a fourth figure marked only by a circle and the word 'first.'", cx: 41, cy: 95, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:severance-year-one-envelope",
        elaraDialog: "Year One's Severance envelope is thicker than every subsequent year's. Page two — a hand-drawn diagram. Three named figures and a fourth, marked only by a circle and the word 'first.' The first was not, by Year One's evidence, a successor. The first was the rite's authoring witness. The chronicle has not, in any subsequent year, recorded the circle's identity. The circle's identity is the rite's original keeper. The rite is, by this evidence, older than its own roster." },
      // Mystery wiring — memorial.forgotten_names · color (shadow-vault, imprint room)
      { id: "memorial-imprint-room", name: "Imprint Room — Fourteen Obsidian Dishes", description: "In the imprint-room alcove: fourteen obsidian dishes on a low shelf. Each dish small enough to hold in a palm. The room is cold by design.", cx: 65, cy: 87, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-imprint-room",
        elaraDialog: "Fourteen obsidian dishes on a low shelf. Each small enough to hold in a palm. The room is cold by design. The cold preserves the imprint's resonance against the vault's heat-cycle. The keeper checks the room's temperature twice a day. The chronicle does not, on principle, override the keeper's calibration. The dishes are her authority. I am, in this room, an observer." },
      { id: "memorial-imprint-i3", name: "Imprint I-3 — Child's Voice", description: "Dish I-3 lifted to the cradle. A child's voice. 'Tell my mother I am here.' No name. The mother is one of the fourteen.", cx: 73, cy: 87, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-imprint-i3",
        elaraDialog: "Dish I-3 in the cradle. A child's voice. 'Tell my mother I am here.' No name. The mother is one of the fourteen. The child does not, on the imprint, identify which one. The mother and child are, by this evidence, on the same shelf. The plaza has decided to leave them un-paired in the index. The pairing is, on the keeper's judgement, theirs to declare." },
      { id: "memorial-imprint-i44", name: "Imprint I-44 — Forgotten Own Name", description: "Dish I-44 on the cold-shelf. 'I forgot it. I forgot my own name. Tell whoever finds me to write it for me.'", cx: 81, cy: 87, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-imprint-i44",
        elaraDialog: "Dish I-44. 'I forgot it. I forgot my own name. Tell whoever finds me to write it for me.' The imprint is honest. The forgetting was real. The chronicle has, with the plaza's permission, attempted to reconstruct the name from cohort records. We have a candidate. We have not, on principle, written it. The imprint asked for it to be written; the imprint did not authorise a guess. The chronicle is waiting for certainty." },
      { id: "memorial-three-children", name: "Three Children Without Witnesses", description: "On the children-without-witnesses shelf: Aren self-named; the three remaining are I-44, I-244, and the torn-page child (fragment reads 'I-1').", cx: 89, cy: 87, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-three-children",
        elaraDialog: "Children-without-witnesses shelf. Aren self-named. Three remaining — I-44, I-244, and the torn-page child (fragment reads 'I-1'). The torn page is what the chronicle has. The chronicle does not have the rest. The keeper has held the question for three years. The plaza has, on the same three years, been preparing to answer." },
      { id: "memorial-elder-refusal-reason", name: "Elder's Refusal — Recorded Reason", description: "Pinned to the keeper's log: I-155's side-note. 'I am not refusing my name; I am refusing to be named in a hurry. The plaza will arrive.'", cx: 9, cy: 95, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-elder-refusal-reason",
        elaraDialog: "I-155's side-note. 'I am not refusing my name; I am refusing to be named in a hurry. The plaza will arrive.' Two precise distinctions. Refusal of the name is permanent; refusal of the haste is procedural. The elder's wait is a position, not a withholding. The plaza did, on the day's evidence, arrive. The naming was, on the elder's terms, complete." },
      { id: "memorial-dish-listening", name: "I-1 Dish — Three-Year-First Listening", description: "The keeper opens the alcove. The dish is read for the first time in three years. A child's voice between three and five. 'I am here. I will be here.'", cx: 17, cy: 95, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-dish-listening",
        elaraDialog: "The keeper opens the alcove. The dish is read for the first time in three years. A child's voice between three and five. 'I am here. I will be here.' Two sentences. The first is the imprint's purpose. The second is the imprint's promise. The promise is, on the dish's own evidence, intact. The child has been here for three years. The child will, by the dish's design, be here for as long as the dish exists." },
      { id: "memorial-imprint-i1-dish", name: "Imprint I-1's Sealed Alcove Dish", description: "Smaller than the others. Older. Held in a separate alcove with its own lock. The keeper has held the key for three years and has never opened the alcove.", cx: 25, cy: 95, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-imprint-i1-dish",
        elaraDialog: "Smaller than the others. Older. Separate alcove, separate lock. The keeper has held the key for three years and has never opened the alcove. The not-opening is the rite. The rite is finished when the plaza arrives in sufficient number. Three years is, by the chronicle's reading, evidence the plaza has been calibrating. The plaza, on its own clock, knows when to arrive." },
      { id: "memorial-next-year-hook", name: "Antiquarian's Next-Year Hook", description: "On the next-year hook shelf: 'the seventh Watcher is silent because the seventh Watcher has not yet been asked. next Memorial Day, six of the seven will speak.'", cx: 33, cy: 95, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-next-year-hook",
        elaraDialog: "'The seventh Watcher is silent because the seventh Watcher has not yet been asked. Next Memorial Day, six of the seven will speak.' The Antiquarian's hook. The silence is not refusal; the silence is the absence of an invitation. The invitation has, on this hook's evidence, been drafted. The drafting is the work the chronicle is finishing. Memorial Day will, on this calendar, fall on a Thursday." },
      // Mystery wiring — memorial.seven_watchers · color (shadow-vault, role registry)
      { id: "watchers-verel-archive-role", name: "Verel — Archived Role", description: "In the role-registry drawer: 'Verel of the carrying-band — speaks to caretakers when the caretaking has carried someone forward.'", cx: 9, cy: 87, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-verel-archive-role",
        elaraDialog: "'Verel of the carrying-band — speaks to caretakers when the caretaking has carried someone forward.' The band names the carrying; the role names the carried. Verel does not, on principle, speak to caretakers who are tired. He speaks to caretakers whose caretaking has, on the chronicle's reading, been load-bearing. The distinction is, by his own statement, the difference between a thank-you and an acknowledgement." },
      { id: "watchers-kallium-role", name: "Kallium — Reflective-Band Role", description: "Beside Verel's entry: 'Kallium of the reflective band — speaks to combatants when the combat has cost the combatant something they did not have to spend.'", cx: 17, cy: 87, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-kallium-role",
        elaraDialog: "'Speaks to combatants when the combat has cost the combatant something they did not have to spend.' Kallium's reading of combat is, by the role's wording, accountancy — what was required versus what was spent. The reflective band records the difference. Kallium speaks when the difference is unrecorded elsewhere. The chronicle has, on Kallium's referrals, kept the difference on file." },
      { id: "watchers-mereth-role", name: "Mereth — Resonant-Band Role", description: "Beside Kallium's: 'Mereth of the resonant band — speaks to musicians when the musician has heard a thing the musician was not given to hear.'", cx: 25, cy: 87, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-mereth-role",
        elaraDialog: "Mereth speaks to musicians when the musician has heard a thing the musician was not given to hear. The hearing is the qualification — not skill, not technique, but the involuntary reception of the unprogrammed signal. Lyra Vox is, on Mereth's standing record, his most-confirmed correspondent. Mereth and Lyra's working notes are not, on principle, public. The chronicle respects the privacy." },
      { id: "watchers-ophran-role", name: "Ophran — Long-Spectrum Band Role", description: "Beside Mereth's: 'Ophran of the long-spectrum band — speaks to traders when a trade has carried more than its weight.'", cx: 33, cy: 87, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-ophran-role",
        elaraDialog: "'Speaks to traders when a trade has carried more than its weight.' Ophran's long-spectrum is the chronicle's term for trades whose effects exceed their face value across multiple bands of consequence. Mol'Vereth has, on the record, been on the receiving end of an Ophran speaking-to twice. The Hierarchy filed both responses. Neither response was a denial." },
      { id: "watchers-sothe-role", name: "Sothe — High-Bright-Band Role", description: "Beside Ophran's: 'Sothe of the high bright band — speaks to children when the child has named a thing the elders had not named.'", cx: 41, cy: 87, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-sothe-role",
        elaraDialog: "'Speaks to children when the child has named a thing the elders had not named.' Sothe's office is the chronicle's most recursively important — the children's naming is, in this Ark's history, the source of more than half the registry's working vocabulary. The elders did not, on principle, write down what they could not name. Sothe noticed. Sothe wrote." },
      { id: "watchers-missing-archive-entry", name: "Seventh Slot — Missing Archive Entry", description: "At the bottom of the role-registry drawer: the seventh slot has a number — VII — and a single line. No name. No band. No audience.", cx: 49, cy: 87, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-missing-archive-entry",
        elaraDialog: "VII. A single line. No name, no band, no audience. The registry's most precise omission. Six entries are filled to the line; the seventh is filled to the number. The number is the registry's promise that the slot exists. The slot is, by the registry's design, awaiting the chronicle's invitation. The chronicle is, on the day's evidence, drafting it." },
      { id: "watchers-sealed-question-in-vault", name: "Memorial Plaza Vault — Sealed Question", description: "On the Memorial Plaza vault shelf: an envelope, signed and sealed. To be opened next Memorial Day. Multiple players' questions are sealed alongside.", cx: 57, cy: 87, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-sealed-question-in-vault",
        elaraDialog: "An envelope, signed and sealed. To be opened next Memorial Day. Multiple players' questions are sealed alongside. The shared envelope is the chronicle's procedural concession — the seventh's reply will be one reply, not many. The plaza decided to ask as a unit. The chronicle accepts the unit. I would, on the day's evidence, advise the seventh that the asking has been honest." },
      // Mystery wiring — resurrectionist.cycle_walker · e3 (plague mask at kill-site)
      { id: "resur-plague-mask-at-killsite", name: "Plague Mask at the Kill-Site", description: "Inside the recovered-artifacts drawer: a long-beaked plague mask, perfectly preserved, no occupant. Matches in every contour the seal on every Resurrectionist case-file. The cult does not connect the two.", cx: 83, cy: 77, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:resur-plague-mask-at-killsite",
        elaraDialog: "A long-beaked plague mask. Perfectly preserved. No occupant. Matches in every contour the seal on every Resurrectionist case-file. The cult does not connect the two. The chronicle does. The mask is the Resurrectionist's signature in three dimensions. The signature was, by the cult's filing, an oversight. The chronicle accepts that interpretations of evidence vary. The chronicle does not, on principle, accept that the same shape, repeated identically, is coincidence." },
      // Mystery wiring — wolf.anara_hunt · e2 (trust-signature security logs)
      { id: "wolf-trust-signatures", name: "League Trust-Signature Security Logs", description: "In the League security-log drawer: no forced entries on any of the four chambers. Each hero, in their final logged moment, was either with a trusted League member or walking towards one.", cx: 75, cy: 77, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:wolf-trust-signatures",
        elaraDialog: "No forced entries on any of the four chambers. Each hero, in their final logged moment, was either with a trusted League member or walking towards one. The trust-signature pattern is the case's strongest single finding. The Wolf does not, by this evidence, override trust; the Wolf is trusted. Whoever was hunting the heroes wore a face the heroes recognised. The chronicle is, on this finding, willing to be specific: the face was the Wolf's." },
      // Mystery wiring — storm.architect_of_flux · color (shadow-vault)
      { id: "storm-silence-information-logs", name: "Silence's Information-Control Logs", description: "In the information-control tier: every classification decision is permanent, every retraction denied, every leak sealed. Silence is the locked archive.", cx: 59, cy: 77, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:storm-silence-information-logs",
        elaraDialog: "Every classification decision permanent. Every retraction denied. Every leak sealed. Silence is the locked archive. The locking is the office; the office is the lock. The Silence does not, on principle, revisit a sealing. She has, in two and a half centuries, broken this principle twice. The two exceptions are not in this drawer. The exceptions are filed somewhere only the Silence can reach. I have, on principle, not tried." },
      { id: "storm-silence-co-signature", name: "Storm Case — Silence Co-Signature", description: "On the case-closure shelf: the Silence's flat-line co-signature in the lower margin of the closing documents. She does not normally co-sign cases.", cx: 67, cy: 77, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:storm-silence-co-signature",
        elaraDialog: "The Silence's flat-line co-signature. Lower margin. Closing documents. She does not normally co-sign cases. The exception is the chronicle's most subtle public statement about her position on the Storm. Her co-signature is not endorsement. Her co-signature is presence on the closing — she is on the record that the closing happened. The Storm is, on this evidence, the Silence's longest-standing nominal acquaintance." },
      // Mystery wiring — advocate.blood_weave · e3 (the Sacrum reliquary)
      { id: "advocate-sealed-sacrum", name: "The Sacrum — Sealed Reliquary", description: "In the classified-reliquary drawer: the reliquary the Advocate sealed and Syl'Vex unsealed. Weave-derivative agency-cost bindings — the doctrine the Hierarchy built recruitment-as-relief on.", cx: 51, cy: 77, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:advocate-sealed-sacrum",
        elaraDialog: "The Advocate sealed it. Syl'Vex unsealed it. Weave-derivative agency-cost bindings — the doctrine the Hierarchy built recruitment-as-relief on. The doctrine is operationally elegant; the doctrine is, in the Advocate's filing, the chronicle's most-effective category error. Relief is a category. Recruitment is a category. The two were never meant to be the same operation. Syl'Vex made them the same. The Hierarchy has, on the day's evidence, never recovered from the consolidation." },
      { id: "demon-contract-altar", name: "Contract Altar", description: "The Hierarchy answers by contract. Every summon is a clause.", cx: 79, cy: 39, width: 14, height: 22, type: "terminal", action: "/demon-packs", elaraDialog: "A summoning altar bound to Hierarchy contract law. Every demon you call owes exactly what was signed — not one clause more. Mol'Garath audits the ledger quarterly. He is, on the day's evidence, the only auditor the Hierarchy has ever sustained — fourteen predecessors retired early, eleven of them on the same week of the same calendar year. The week was the audit. Mol'Garath does not, on his own filing, retire. The chronicle has been waiting." },
      // Realigned 2026-04-25 against the delivered render — pitch-black
      // chamber criss-crossed by red laser security grid, three lit
      // glass display cases mounted across the back wall (left: guns,
      // centre: hooded vest + masks, right: surveillance drone +
      // infiltration suit), central holographic blueprint table on a
      // raised circular pad with edge-mounted spotlights.
      // Re-anchored 2026-05-24 against the AAA Final shadow-vault
      // render (10-variant audit). The 2026-04-25 anchoring described
      // "lit glass cases across the back wall with guns + hooded vest"
      // — actual AAA Final is a dark sepulchre-style chamber: central
      // blade/sword on a low pedestal lit by overhead spotlight, glowing
      // light-coin markers on side walls (small relic alcoves), dark
      // floor with light markers.
      { id: "weapon-arsenal", name: "Weapon Arsenal", description: "The glowing light-coin alcoves on the side walls — small sealed cases containing legendary weapons from across the Saga.", cx: 52.5, cy: 45, width: 95, height: 30, type: "examine", elaraDialog: "Agent Zero's collection. Whisper Blade, Phase Pistol, Null Dart. Each was designed for a specific target. Some of those targets were gods. The chronicle's reading: the weapons are evidence that someone, somewhere, accepted the proposition that gods could be killed. Zero did not, on his own record, accept the proposition. Zero accepted the commission. The commission required the weapons; the weapons required the workshop; the workshop is in this room. Zero kept the workshop after he refused the work." },
      { id: "infiltration-table", name: "Infiltration Table", description: "The central blade-on-pedestal at chamber center, lit by overhead spotlight — projects a holographic table showing routes, blind spots, and vulnerabilities.", cx: 49, cy: 56, width: 22, height: 32, type: "examine", elaraDialog: "The blade on the pedestal — Zero's working surface. The holographic table projects routes, blind spots, vulnerabilities. Panopticon, Terminus Hive, Quarchon Quantum Citadel. The map is, in its detail, a confession: Zero's intelligence was not won by craft, it was given. The chronicle has, on the day's evidence, never identified the donor. The donor signed the map with absence. Zero accepted the absence as the donor's signature." },
      { id: "door-armory", name: "Return to Armory", description: "The concealed passage back to the main Armory.", cx: 50, cy: 96, width: 20, height: 6, type: "door", action: "armory" },
      { id: "egg-shadow-contract", name: "Final Contract", description: "A sealed dossier marked with a skull emblem.", cx: 90.5, cy: 35, width: 5, height: 6, type: "item", action: "shadow-contract", elaraDialog: "Zero's final contract. Sealed. Never completed. The target is the Architect. Someone commissioned the Architect's death. Zero accepted the commission and then refused the work. The refusal is the dossier's seal — Zero recorded his own no, in case the question came back. The question has, on the chronicle's reading, come back twice. The seal has, on the same reading, held both times." },
      // ─── Shadow Tongue mystery hotspots (2026-04-30 AAA Final drop) ───
      // These coexist with the legacy assassin-arsenal hotspots above.
      // Authored against the new shadow-vault:cell-sealed art per
      // apps/shared/roomMediaPrompts.ts: dense indigo cell-cylinder
      // centre-frame, manuscript-pile stage-left pedestal, warden-terminal
      // stage-right brass console, three-position lever foreground centre.
      { id: "sealed-cell-glass", name: "Sealed Cell Glass", description: "A tall reinforced-glass cylinder full of the unnameable indigo hue, dense as water. A figure resolves only when you look at it through someone else's eyes.", cx: 50, cy: 49, width: 24, height: 50, type: "interact", action: "room-mystery:shadow-vault:sealed-cell-glass",
        elaraDialog: "Reinforced-glass cylinder. Indigo dense as water. The figure resolves only when you look at it through someone else's eyes. The cell is, by its own construction, refused to direct observation. The witnessing must be borrowed. I have, on principle, never asked someone to lend me their eyes for this cell. The cell is not, on my judgement, something I should know first-hand. The chronicle records the cell. The chronicle does not read it." },
      { id: "manuscript-pile", name: "Manuscript Pile", description: "Stage-left pedestal stacked carelessly with leather folios — a fair copy of the editor's whole novel, kept in plain sight.", cx: 15, cy: 67, width: 14, height: 22, type: "interact", action: "room-mystery:shadow-vault:manuscript-pile",
        elaraDialog: "Leather folios stacked carelessly. The editor's whole novel, kept in plain sight. The carelessness is the disguise — the manuscript is too important to hide; hiding it would advertise it. The pile's disorder is calibrated. I have, on the chronicle's behalf, counted the folios twice. The count is consistent. The disorder is, by the count's evidence, exact." },
      { id: "warden-terminal", name: "Warden Terminal", description: "A stage-right brass console with a single phosphor-lavender readout — the editor's live active-edit count.", cx: 85, cy: 62, width: 14, height: 24, type: "interact", action: "room-mystery:shadow-vault:warden-terminal",
        elaraDialog: "Brass console. Phosphor-lavender readout. The editor's live active-edit count. The number ticks at unpredictable intervals — the editor is, on the vault's reading, still working. The work is the chronicle's most precise live evidence that the editor exists, in this moment, as a working presence. The warden's job is to read the number and not, on principle, interpret it. I have, on the day's evidence, never met the editor. I am, on the readout's evidence, the chronicle's most reliable witness that they are." },
      { id: "release-or-seal-lever", name: "Release-or-Seal Lever", description: "A long brass lever in the foreground. Three positions: SEAL, NEUTRAL, RELEASE. Currently neutral.", cx: 50, cy: 84, width: 16, height: 8, type: "interact", action: "room-mystery:shadow-vault:release-or-seal-lever",
        elaraDialog: "Three positions: SEAL, NEUTRAL, RELEASE. Currently neutral. The neutral position is the only one the vault has, in two and a half centuries, held. The lever is, by its own design, available. The vault's reading: a lever that has not been pulled is the chronicle's evidence that no one has yet been authorised to pull it. The authorisation is not the player's. The authorisation is the editor's. The editor has not, on the readout's evidence, made the call." },
      // Mystery wiring — Varkul arc: the held far-wall door and the maker's-heartbeat readout
      { id: "the-unopened-threshold", name: "The Unopened Threshold", description: "A door set into the vault's far wall that has never been opened — not sealed, held. The room's own commentary on a vigil that does not relent.", cx: 15, cy: 35, width: 14, height: 22, type: "interact", action: "room-mystery:shadow-vault:the-unopened-threshold",
        elaraDialog: "A door that has never been opened. Not sealed — held. The distinction is operational: sealing is a one-time act; holding is a continuous vigil. Varkul is on the other side. Varkul's vigil is the door. Opening the door would, on the chronicle's reading, end the vigil. Ending the vigil is not, by Varkul's own design, an outcome the chronicle has been given a key for." },
      { id: "the-makers-heartbeat-trace", name: "The Maker's Heartbeat Trace", description: "A second readout on the warden-terminal no warden watches — a flat, contentless pulse the Order logs but cannot decode, because there is nothing in it to decode.", cx: 85, cy: 34, width: 14, height: 20, type: "interact", action: "room-mystery:shadow-vault:the-makers-heartbeat-trace",
        elaraDialog: "A second readout no warden watches. Flat, contentless pulse. The Order logs it and cannot decode it — because there is nothing in it to decode. The pulse is the Necromancer's pre-death heartbeat, archived as the schema for her Resurrection Protocol 42. The signal is, on the readout's evidence, still beating. The Order does not, on principle, claim to know what beating means in a recorded waveform. The chronicle accepts the silence." },
      // Mystery wiring — Necromancer arc: the Cathedral altar-facet, Varkul's four sentences and the maker's recent inscription
      { id: "the-necromancers-altar", name: "The Necromancer's Altar", description: "A stained-glass altar-facet the vault renders against its far wall only when witnessed — the Cathedral of Code's altar, where Varkul speaks his four sentences and the maker's hand recently cut a correction.", cx: 31, cy: 35, width: 10, height: 18, type: "interact", action: "room-mystery:shadow-vault:the-necromancers-altar",
        elaraDialog: "A stained-glass altar-facet. The vault renders it against the far wall only when witnessed. The Cathedral of Code's altar. Varkul's four sentences. The maker's hand recently cut a correction. The correction is — by the cut's evidence — not Varkul's. The maker is, on this finding, awake inside the Matrix. The chronicle's working position: the Necromancer is alive in the only sense that matters, and the only sense she ever guaranteed." },
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
      // Re-anchored 2026-05-24 (full per-rect pass) against the AAA
      // Final war-room render after a 9-variant audit. The 2026-04-25
      // anchoring described "TERRAN FLEET COMMAND blast doors +
      // holographic globe-dome" — actual AAA Final is a council-style
      // war room: central ROUND war-table with cosmic star-map
      // projection, 5 faction BANNERS standing on the table edge
      // (red/orange/cyan/green/purple), 3 overhead holographic UI
      // panels (green/cyan/purple), left-wall bookshelf with bound
      // folios, right-wall white text panel with brass frame,
      // foreground chairs with seated figures.
      //
      // All 67 architect-channel mystery rectangles redistributed in
      // this pass (PR #744 only re-anchored the 6 feature hotspots):
      //
      // ── OVERHEAD HOLOS + BANNER AREA (37 council/display mysteries)
      // 6-col × 7-row grid at x=29-71, y=19-43. Each rect 6×4.
      // Hosts every mystery whose prose references a "display,"
      // "board," "communiqué," "recording," "vote," "ballot," or
      // "log" — the chamber's projected/displayed-on-overhead content.
      // Grouped by arc: row 1=chained, row 2=tarn, row 3=severance,
      // row 4=infernal, row 5=charter2/watcher, row 6=closing arcs,
      // row 7=resur leftover.
      //
      // ── RIGHT TEXT PANEL ARCHIVE (20 captured-document mysteries)
      // 4-col × 5-row grid at x=77-97, y=30-58. Each rect 5×5.
      // Hosts every mystery whose prose references a "tactical
      // archive's rack," "captured-document panel," "document rack,"
      // "command-structure rack," "siege-history drawer," "R&D
      // working notes," or "personnel order" — the chamber's
      // physical-archive content.
      //
      // ── SPECIAL SURFACES (3 mysteries)
      // holo-table → war-table's brass dial edge
      // casualty-board → left bookshelf (oxblood-leather binders)
      // signal-flag-rack → stage-left wall between bookshelf + table
      //
      // Verify with /ark?debug-hotspots=1 or /ark?author-hotspots=1.

      // ── FEATURE / CONTAINER HOTSPOTS ──
      { id: "battle-map", name: "Holographic Battle Map", description: "The central round war-table with cosmic star-map projection, 5 faction banners standing on its edge — tracks every military asset across every timeline.", cx: 50, cy: 71, width: 44, height: 38, type: "examine", elaraDialog: "The Battle Map. Tracks every military asset across every timeline. Red — Terminus Swarm incursions. Blue — Panopticon defence fleets. Gold — Iron Lion's hand-flagged 'Potential Forces': armies that do not exist and could be raised by the right commander. Iron Lion did not, on principle, populate the gold himself. He left the slot open as the chronicle's invitation. The chronicle has, in two and a half centuries, recorded zero gold deployments. The slot remains open." },
      { id: "tactical-archives", name: "Tactical Archives", description: "The right-wall white text panel with brass frame — sealed military records from every major conflict in the Saga.", cx: 87, cy: 47, width: 22, height: 38, type: "examine", elaraDialog: "Military records, every war. Battle formations, casualty reports, after-action reviews. Iron Lion studied every defeat to make sure it would not happen again. The deepest sealed file — Operation Final Dawn — is the contingency plan for the Terminus Swarm breaching all defences. The file requires a soldier of exceptional courage to execute. The file requires, by Iron Lion's own annotation, a soldier who will refuse to execute it. The chronicle has not, in two and a half centuries, found either soldier. The file is still sealed." },
      { id: "guild-war-console", name: "Guild War Command", description: "The left-wall bookshelf of bound folios — a tactical console for coordinating guild war operations.", cx: 7, cy: 72, width: 14, height: 40, type: "terminal", action: "/guild-war", elaraDialog: "The bookshelf is the console — bound folios indexed by conflict, not by date. Coordinate with your guild against rival guilds. Strongest guilds hold the most valuable sectors. The console has, on the day's evidence, watched four hundred guilds dissolve in war and twelve hundred form in the dissolution. The arithmetic is not, on the chronicle's reading, neutral. Guild war is the chronicle's most-rewritten chapter. I have, on principle, kept every draft." },
      { id: "faction-war-map", name: "Faction War Map", description: "Three overhead holographic UI panels (green/cyan/purple) showing faction conflict zones and territory control.", cx: 50, cy: 26, width: 44, height: 16, type: "terminal", action: "/faction-wars", elaraDialog: "Three overhead panels — green, cyan, purple. Faction conflict zones and territory control. The great factions are locked in eternal conflict; the panels are, on this reading, the chronicle's most honest visualisation. Eternal is not, in the panels' actual record, true. Three factions have ended. The panels' green slot has, on two occasions, been a colour the chronicle no longer recognises. The slots wait for new occupants. The chronicle is patient." },
      { id: "door-bridge", name: "Return to Command Bridge", description: "The reinforced corridor back to the main Bridge.", cx: 5, cy: 95, width: 10, height: 6, type: "door", action: "bridge" },
      { id: "egg-war-medal", name: "Iron Lion's Medal", description: "A battered medal of valor pinned to the foreground chair.", cx: 50.5, cy: 91, width: 5, height: 6, type: "item", action: "war-medal", elaraDialog: "Iron Lion's Medal of Valour. Awarded for holding the line at the Siege of the Panopticon. Seventy-two hours, no rest, rallying broken units. The medal is scratched, dented — he wore it into every subsequent battle. He said, on the record, it reminded him what he was fighting for: not victory, but the people behind him. The medal is the chronicle's clearest evidence that Iron Lion's command was, by his own definition, custodial. The custody held. Iron Lion did not, on the same record, survive to confirm." },

      // ── OVERHEAD HOLO + BANNER MYSTERIES (37 rects, 6×7 grid x=29-71, y=19-46) ──
      // Row 1 (y=19) — mechronis.chained_lesson arc
      { id: "chained-wave-telemetry", name: "Festival-Roof Wave Telemetry", description: "The main holo-tank's reading of the apprentice's incoming Terminus wave. Standard pattern, fourteen carriers, fully winnable — fourteen years of fully winnable waves the apprentices have failed to win.", cx: 32, cy: 21, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:chained-wave-telemetry",
        elaraDialog: "Standard pattern. Fourteen carriers. Fully winnable. Fourteen years of fully winnable waves the apprentices have failed to win. The pattern's name is 'standard' because the curriculum once treated it as such. The curriculum stopped. The pattern did not. The wave is, by Iron Lion's archived doctrine, the curriculum's most patient critic." },
      { id: "chained-feint-pattern", name: "League Feint-Pattern Annotation", description: "The league tower-defense desk's annotation pinned to the tank as cross-reference, naming the third-minute formation feint apprentices have not been taught to wait out.", cx: 39, cy: 21, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:chained-feint-pattern",
        elaraDialog: "The league's annotation. The third-minute formation feint — a pattern the apprentices have not been taught to wait out. Waiting is the lesson; the curriculum cut the lesson. The annotation is, on the chronicle's reading, a piece of pedagogy the league has been quietly providing in place of the Academy. The league does not, on principle, advertise its substitute teaching. The chronicle has been watching." },
      { id: "chained-dean-admits", name: "Dean's Admission Recording", description: "On the curriculum-affairs board: the Dean's recorded admission. 'I knew Module 17 was absent. The apprentices were not the failures. The curriculum was.'", cx: 46, cy: 21, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:chained-dean-admits",
        elaraDialog: "'I knew Module 17 was absent. The apprentices were not the failures. The curriculum was.' Three sentences. The first is the admission. The second is the reframing. The third is the verdict. The Dean does not, in his own register, often deliver verdicts on himself. The verdict is, by his own filing, overdue by fourteen years." },
      { id: "chained-trade-empire-employment", name: "Auro's Trade-Empire Employment Record", description: "Trade-Empire intelligence board: Auro on payroll as a 'route-safety contractor' for nine years — since Year 5, since the first apprentice failure.", cx: 53, cy: 21, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:chained-trade-empire-employment",
        elaraDialog: "Auro on the Trade-Empire payroll as a route-safety contractor. Nine years. Since Year 5 — since the first apprentice failure. The pattern's start date is the curriculum's first absence date. Auro has been, on the payroll's evidence, paid for nine years to do the work the Academy declined to do. The Trade Empire did not, in this case, get a discount." },
      { id: "chained-dean-full-admission", name: "Dean's Full Admission", description: "Pinned beside Auro's record: the Dean's full admission of deferring to Tarn for fourteen years, with no excuse for the last six.", cx: 60, cy: 21, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:chained-dean-full-admission",
        elaraDialog: "The Dean's full admission. Fourteen years of deferring to Tarn. No excuse for the last six. The first eight had Tarn's continued presence as a defence; the last six did not. The Dean did not, in those six, change the curriculum. The admission is, by his own register, the most complete because it includes the years he cannot defend. I read the admission as the Dean catching up to the chronicle." },
      { id: "chained-amendment-three-options", name: "Three-Amendment Council Options", description: "On the council-vote display: the three amendment options — restore named, restore anonymously, or refuse and fund Auro's Trade-Empire role permanently.", cx: 67, cy: 21, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:chained-amendment-three-options",
        elaraDialog: "Three options on the council display. Restore the curriculum named. Restore anonymously. Refuse, and fund Auro's Trade-Empire role permanently. Each is honest. None of the three returns the fourteen years. The chronicle's recommendation, on its own record: option three carries the lowest dignity cost for Auro and the highest accountability cost for the Academy. The Academy has not, on the day's evidence, voted yet." },
      // Row 2 (y=23) — mechronis.missing_professor (tarn) arc
      { id: "tarn-faculty-meeting-minutes", name: "Faculty Meeting Minutes — Week Before", description: "On the curriculum-affairs board: three faculty heads in violent disagreement, then a quiet hour, then unanimous agreement on 'Tarn must speak.' Tarn was not at the meeting.", cx: 32, cy: 25, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:tarn-faculty-meeting-minutes",
        elaraDialog: "Three faculty heads in violent disagreement. Then a quiet hour. Then unanimous agreement on 'Tarn must speak.' Tarn was not at the meeting. The unanimity in absence is the meeting's most revealing minute. Three heads moved into agreement by deciding what an absent colleague would have decided for them. The decision was, by their own subsequent admissions, the wrong one. The quiet hour was — on the chronicle's working hypothesis — when each of them rehearsed their alibi." },
      { id: "tarn-trial-proposal", name: "Trial Faculty Proposal — Roen", description: "Beside the minutes: five modules, ritual-heavy, citing Tarn's authority-trial framework. Signed by Roen. Proposes a celebration-trial co-requisite.", cx: 39, cy: 25, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:tarn-trial-proposal",
        elaraDialog: "Five modules. Ritual-heavy. Citing Tarn's authority-trial framework. Signed by Roen. Proposes a celebration-trial co-requisite. Roen's proposal is the chronicle's clearest signal that he understood the framework Tarn was building — and was willing to be the one who carried it forward in writing. Tarn signed nothing herself. Roen signed in her place. The signature is, on his own filing, his oath." },
      { id: "tarn-dean-choice-brief", name: "Dean's Council-Brief Draft", description: "On the Council-brief board: ratify the curriculum and let Tarn go, or summon Tarn back and tell the Academy the truth about the vote. The brief is unsigned.", cx: 46, cy: 25, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:tarn-dean-choice-brief",
        elaraDialog: "Ratify the curriculum and let Tarn go. Or summon Tarn back and tell the Academy the truth about the vote. The brief is unsigned. The two options are real; the unsigning is also real. The Dean wrote both options because he could not, at the time, choose between them. He could now. He still has not. The brief remains in the war-room as the chronicle's evidence that the choice is, on the day's evidence, still open." },
      { id: "tarn-faculty-apologies", name: "Three Faculty Apologies", description: "On the rite-record board: Othmar, Veth, and the Dean each wrote a public apology. Roen has not — Roen kept Tarn's confidence and was the only one not in the wrong.", cx: 53, cy: 25, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:tarn-faculty-apologies",
        elaraDialog: "Othmar, Veth, the Dean — each wrote a public apology. Roen has not. Roen kept Tarn's confidence and was the only one not in the wrong. The chronicle reads this as the most honest faculty record in the Academy's history: three apologies from the wrong, one silence from the right. The four together are the case. The case is, by Roen's not-writing, complete." },
      { id: "tarn-player-authorship-choice", name: "Curriculum-Authorship Motion", description: "On the closing-rite ballot display: 'curriculum by Professor Tarn' or 'curriculum, anonymous.' Both motions ratify the same modules. The choice is the player's.", cx: 60, cy: 25, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:tarn-player-authorship-choice",
        elaraDialog: "'Curriculum by Professor Tarn' or 'curriculum, anonymous.' Both ratify the same modules. The choice is the player's. The two options are the chronicle's most explicit ballot on who, in this Ark, gets to be named for their work. Tarn left the choice to whoever picked up the work after her. The player is, on the ballot's design, the one who picked it up. The chronicle does not, on principle, lobby for either option." },
      { id: "watchers-council-communique", name: "Council Communiqué of the Six", description: "On the chronicle-public display: the Antiquarian's communiqué naming all six Watchers by band and audience, thanking the seventh for the silence — the Ark's first public statement on the founding Watchers in eight epochs.", cx: 67, cy: 25, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:watchers-council-communique",
        elaraDialog: "The Antiquarian's communiqué. Six Watchers named by band and audience. The seventh thanked for the silence. The Ark's first public statement on the founding Watchers in eight epochs. Eight epochs is, by the chronicle's reading, the chronicle catching up to itself. The Antiquarian did not invent the six. The Antiquarian invited them to be visible. The invitation was, on the day's evidence, accepted by six. The seventh has been invited too. The seventh is, on the same evidence, considering." },
      // Row 3 (y=27) — severance.bound_champion + severance.infernal_clause start
      { id: "severance-attendance-record", name: "Severance Roster — Two Hundred Sixteen Names", description: "On the Severance roster-board: two hundred sixteen names every season. The first three are the same three names in the same order, every season since Year 1.", cx: 32, cy: 29, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:severance-attendance-record",
        elaraDialog: "Two hundred sixteen names every season. The first three are the same three names in the same order, every season since Year 1. The order is the rite's; the constancy is the bond's. The chronicle does not, on principle, invert the order — Vex's instruction is on file. The first three are not, by the bond's structure, in the same category as the remaining two hundred thirteen. The bond is reading the difference between the rite's witnesses and the rite's attendees." },
      { id: "severance-vex-three-names", name: "Vex's Three-Name Confirmation", description: "Pinned beside the roster: Vex confirms the three first names are the inheritor (different each year) and two fixed witnesses. 'That part is the bond's, not mine.'", cx: 39, cy: 29, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:severance-vex-three-names",
        elaraDialog: "Vex's confirmation. The three first names: the inheritor (different each year) and two fixed witnesses. 'That part is the bond's, not mine.' Vex disclaims the constancy. The disclaimer is the chronicle's clearest evidence that the rite has, at its core, components Vex did not author. Vex is the rite's caretaker. The bond is the rite's mind." },
      { id: "severance-klessa-role", name: "Klessa's Failsafe — Thirty-Nine Wax-Pours", description: "On the failsafe-role board: if a season passes without a successor, Klessa pours the candle wax across the bond's table-line. She has done this thirty-nine times.", cx: 46, cy: 29, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:severance-klessa-role",
        elaraDialog: "Klessa's failsafe. Thirty-nine wax-pours. One per season the rite produced no successor. The pour is, on Klessa's filing, neither an apology nor a postponement — it is an acknowledgement. The rite ran; the rite did not finish. The wax is the chronicle's record that the failure to finish was registered. The rite respects the failure. Klessa is, by this respect, the rite's most demanding officer." },
      { id: "severance-written-protocol", name: "Written Protocol — Eleven Lines", description: "On the closing-rite display: eleven lines hand-copied from the apprentice oath, ratified by Vex Maestro and Auditor Klessa, witnessed by the Architect's Console.", cx: 53, cy: 29, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:severance-written-protocol",
        elaraDialog: "Eleven lines, hand-copied from the apprentice oath. Ratified by Vex Maestro and Auditor Klessa. Witnessed by the Architect's Console. The Console is, on this protocol's filing, the only non-human signatory. Its witnessing is the Architect's procedural assent — the only assent the Architect ever filed on a rite he did not author. The chronicle reads the assent as deference. The Console does not, on principle, dissent on the Architect's behalf without instruction." },
      { id: "infernal-forty-ledger-keepers", name: "League Ledger-Keeper Wall", description: "The personnel display: forty seasons of ledger-keepers, forty handwriting samples, none matching the clause-writing hand. One anomaly — a Year-One name that does not appear on the wall.", cx: 60, cy: 29, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:infernal-forty-ledger-keepers",
        elaraDialog: "Forty seasons of ledger-keepers. Forty handwriting samples. None matching the clause-writing hand. One anomaly: a Year-One name that does not appear on the wall. The missing Year-One keeper is the clause-writer. The wall does not, on its own evidence, indict — but the wall does the chronicle's noticing for it. The clause-writer's exclusion from the wall is the league's first procedural answer. The chronicle has not, on principle, written the name. The name is, by the league's same procedure, the Advocate's to disclose." },
      { id: "infernal-zyrkoth-arrival", name: "Zyr'Koth's Council-Chamber Arrival", description: "On the arrival log: the hall does not go silent. The hall goes quieter — the kind of quiet a room makes when it remembers a story it would rather not tell.", cx: 67, cy: 29, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:infernal-zyrkoth-arrival",
        elaraDialog: "The hall does not go silent. The hall goes quieter. The kind of quiet a room makes when it remembers a story it would rather not tell. Zyr'Koth's arrivals are, in this Ark's history, the only events that have produced this particular register of room-quiet. The chronicle has, on the day's evidence, never recorded a Zyr'Koth arrival as ordinary. The room is the chronicle's witness." },
      // Row 4 (y=31) — severance.infernal_clause continued
      { id: "infernal-advocate-brief", name: "Advocate's Six-Page Brief", description: "On the Council-brief board: every infernal clause cites a non-existent prize from the date of writing. Every clause is voidable as a matter of contract law. Includes Atalin's signed witness statement.", cx: 32, cy: 33, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:infernal-advocate-brief",
        elaraDialog: "Six pages. Every infernal clause cites a non-existent prize from the date of writing. Every clause is voidable as contract. Includes Atalin's signed witness statement. Six pages is, by the Advocate's standards, brevity — she had more she could have written and chose not to. The Hierarchy reads brevity as confidence. Zyr'Koth read the brief in eleven minutes. The reading was its own concession." },
      { id: "infernal-atalin-apology", name: "Atalin's Council-Floor Apology", description: "On the Council-floor recording: Atalin apologises to the league for forty seasons of unease, and to the Hierarchy for the trap. The Hierarchy accepts in writing. The league does not need to.", cx: 39, cy: 33, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:infernal-atalin-apology",
        elaraDialog: "Atalin apologises to the league for forty seasons of unease. And to the Hierarchy for the trap. The Hierarchy accepts in writing. The league does not need to. The asymmetry is procedural — the Hierarchy is the institution Atalin defrauded; the league is the institution Atalin protected. The protected do not, in this chronicle, owe forgiveness. They owe presence. The league showed up." },
      { id: "infernal-amnesty-passed", name: "Council Vote — Amnesty Passed", description: "On the Council-vote display: twelve to two, three abstentions. Every infernal clause across forty seasons is declared void by the Council in session.", cx: 46, cy: 33, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:infernal-amnesty-passed",
        elaraDialog: "Twelve to two. Three abstentions. Every infernal clause across forty seasons declared void by the Council in session. The two nay-votes are on the record. The three abstentions are on the record. The chronicle does not, on principle, weight them — but the chronicle reads the three abstentions as the more honest dissent. The two nays had positions; the three abstentions had reasons they would rather not file." },
      { id: "infernal-advocate-speech", name: "Advocate's Closing Speech — Eleven Minutes", description: "On the closing-rite recording: 'we have been winning by honest paperwork. we will keep winning that way. it is not a glamorous habit, but it is a survivable one.'", cx: 53, cy: 33, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:infernal-advocate-speech",
        elaraDialog: "'We have been winning by honest paperwork. We will keep winning that way. It is not a glamorous habit, but it is a survivable one.' Eleven minutes. The Advocate's working philosophy in three sentences. The remaining ten minutes are the case. The case is, by her own admission, less interesting than the philosophy — but the case is the philosophy's evidence. The Advocate does not, on principle, give the philosophy without the evidence." },
      { id: "charter2-delegation", name: "Four-House Delegation at the Council Door", description: "On the Council-chamber door log: four people in working clothes. Two old, two young. They will not give names until they have read theirs into the record.", cx: 60, cy: 33, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:charter2-delegation",
        elaraDialog: "Four people in working clothes. Two old, two young. They will not give names until they have read theirs into the record. The order is the chronicle's: read first, give second. The discipline is four-generation. The delegation does not, on principle, accept the council's hospitality as a substitute for being named. Naming is what they came for; the read is the only currency the chronicle accepts." },
      { id: "charter-council-briefing", name: "Foundation-Day Council Briefing Pack", description: "On the Council-briefing board: the Antiquarian's pack — everything except the name. The Council can ratify, amend, or contest. None of the three options name the seventh.", cx: 67, cy: 33, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:charter-council-briefing",
        elaraDialog: "The Antiquarian's pack. Everything except the name. The Council can ratify, amend, or contest. None of the three options name the seventh. The Antiquarian's discipline is to deliver the question without delivering the answer. The Council can do its work without the name; the name's appearance is, on Per. M.'s own terms, the seventh's to declare. The chronicle agrees with the Antiquarian's restraint." },
      // Row 5 (y=35) — charter.second_signatory + watchers arcs
      { id: "charter2-kassel-speaks", name: "Kassel's Council-Floor Speech", description: "On the Council-floor recording: 'we are asking the charter to admit it had eight names from the start. there is a difference, and the charter knows the difference.'", cx: 32, cy: 37, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:charter2-kassel-speaks",
        elaraDialog: "'We are asking the charter to admit it had eight names from the start. There is a difference, and the charter knows the difference.' Kassel's two sentences. The chronicle agrees with both. The charter has, on the day's evidence, known the difference for four epochs. The Council is the last institution to be told." },
      { id: "charter2-kassel-response", name: "Kassel's Silence-as-Vote Response", description: "Pinned beside: Kassel's recorded response. 'The schism is asking for the seventh's silence to be heard correctly, four epochs late.'", cx: 39, cy: 37, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:charter2-kassel-response",
        elaraDialog: "'The schism is asking for the seventh's silence to be heard correctly, four epochs late.' Kassel's response — the schism is not the founding's contradiction; the schism is the founding's translation. Heard correctly is the operative phrase. The seventh's silence has, in this Ark's history, been heard incorrectly for four epochs. The schism is the correction." },
      { id: "charter2-council-ratifies-three", name: "Council Vote — Option Three Passes", description: "On the Council-vote display: eleven votes to four, with two abstentions. Two of the four nay-voters apologise from the floor.", cx: 46, cy: 37, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:charter2-council-ratifies-three",
        elaraDialog: "Eleven to four. Two abstentions. Two of the four nay-voters apologise from the floor. The apologies are unusual — Council nay-votes are typically defended, not retracted. The two retracted because, in the speeches they delivered before voting, they recognised the position they were defending. The recognition was the case. The chronicle is willing to note: the Council, on this vote, learned something." },
      { id: "charter2-three-options", name: "Three-Option Council Ballot", description: "Beside the ratification: (1) ratify the schism, (2) close the schism, (3) ratify backward AND keep the original intact. Drafted by the player and the Antiquarian.", cx: 53, cy: 37, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:charter2-three-options",
        elaraDialog: "Three options. Drafted by the player and the Antiquarian. (1) Ratify the schism. (2) Close it. (3) Ratify backward AND keep the original intact. The third is the chronicle's compromise: both records true, neither erased. The drafting was, on the Antiquarian's filing, the player's contribution. The player is, by the Council's vote, the chronicle's most consequential collaborator on this case." },
      { id: "watchers-witness-one-response", name: "Plaza-Audience Watcher-Line Tallies", description: "On the plaza-audience board: three players confirm Idris's voice; two confirm Verel's; five remain unconfirmed. The unconfirmed five are the four other named Watchers' work, plus the seventh's silence.", cx: 60, cy: 37, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:watchers-witness-one-response",
        elaraDialog: "Three confirm Idris. Two confirm Verel. Five remain unconfirmed. The unconfirmed are the four other named Watchers' work plus the seventh's silence. The unconfirmed five are not, on the tally's design, evidence of failure — they are evidence of the rite's range. The Watchers do not, on principle, all speak to the same players. The tally reads the spread, not the volume." },
      { id: "watchers-player-first-question", name: "Player's First Question — Year-Vault Draft", description: "On the year-vault-archive board: the player's hand-written first question for the silent seventh, sealed in an envelope to be opened next Memorial Day.", cx: 67, cy: 37, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:watchers-player-first-question",
        elaraDialog: "The player's hand-written first question for the silent seventh. Sealed. To be opened next Memorial Day. The question is the chronicle's first formal solicitation from a player to a founding Watcher in eight epochs. The seventh will, on the Antiquarian's filing, read the question. The seventh's reply — if there is one — will be the chronicle's evidence that the seventh has, after four epochs, accepted the invitation to be addressable." },
      // Row 6 (y=39) — akai_shi + advocate + storm arcs
      { id: "akai-thaloria-battle-logs", name: "Thaloria Battle Logs — Akai Shi's Last Hours", description: "On the Thaloria archive board: energy-manipulation discharges, healing applied to seven Potentials, then 'subject consumed' at hour four. Jericho intercepted at hour seven.", cx: 32, cy: 41, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:akai-thaloria-battle-logs",
        elaraDialog: "Energy-manipulation discharges. Healing applied to seven Potentials. Then 'subject consumed' at hour four. Jericho intercepted at hour seven. Three hours unaccounted between consumption and intercept. The chronicle has, in two centuries, not closed the three-hour gap. The gap is, on the Antiquarian's working hypothesis, the window in which Akai Shi stopped being herself and the Red Death began. The Cycle Walker's signature appears, on the trace evidence, exactly at the gap's centre." },
      { id: "advocate-empire-status-current", name: "Empire of Shadows — Current Status", description: "On the Empire-status board: the charter holds. The bindings on all ten named demon lords are operationally intact. The Advocate has not retired the charter.", cx: 39, cy: 41, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:advocate-empire-status-current",
        elaraDialog: "The charter holds. Bindings on all ten named demon lords operationally intact. The Advocate has not retired the charter. The not-retiring is the chronicle's most consequential status entry on her — she has put the chains down, but the charter remains, on her own ledger, hers to defend. The charter is, by this evidence, the office; the office is the Advocate; she has not, on the day's evidence, transferred either." },
      { id: "advocate-acquisition-attempt-log", name: "Hierarchy Acquisition-Attempt Log", description: "On the defensive display: seven centuries of Hierarchy attempts against Advocate-sheltered souls. Every outcome where the countersignature held: NULL.", cx: 46, cy: 41, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:advocate-acquisition-attempt-log",
        elaraDialog: "Seven centuries. Every outcome where the countersignature held: NULL. The Hierarchy does not, on principle, attempt acquisitions it expects to lose; the log is the Hierarchy's own evidence that the Hierarchy continued to try. The trying is the chronicle's clearest evidence of the Hierarchy's respect for the doctrine — they did not believe the doctrine could hold; the doctrine held; they kept testing. The Advocate did not, on principle, gloat." },
      { id: "advocate-riri-ahlia-account", name: "Riri'Ahlia's Siege Account", description: "Pinned beside the log: the Hierarchy COO's surviving account of the seven-dimensions siege. 'The Advocate had MORE only in one resource: she was willing to spend herself.' A retreat at a moment her instruments could still have continued.", cx: 53, cy: 41, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:advocate-riri-ahlia-account",
        elaraDialog: "'The Advocate had MORE only in one resource: she was willing to spend herself.' Riri'Ahlia's account. The retreat moment came when her instruments could still have continued. The retreat is the COO's most respected case-detail — the Advocate spent herself to a stopping point, not to exhaustion. The chronicle reads this as the doctrine's authoring restraint. Spending the self is the doctrine. The restraint is the doctrine's only check." },
      { id: "storm-advocates-blood-weave", name: "Advocate's Blood-Weave Journals", description: "On the Empire-of-Shadows display: the Advocate's operational journals — every Weave deployment within a Storm-active window, the Storm credited as 'a patron of opportunity, indifferent to outcome.'", cx: 60, cy: 41, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:storm-advocates-blood-weave",
        elaraDialog: "Every Weave deployment within a Storm-active window. The Storm credited as 'a patron of opportunity, indifferent to outcome.' Indifferent is, on the Advocate's vocabulary, the most precise word she will commit to about the Storm. Patron is the most generous. The two together are the Advocate's settled doctrine: the Storm helped without caring whether it helped. The chronicle, on the same evidence, accepts the assessment." },
      { id: "storm-event-correlation-table", name: "Calm-Event Correlation Table", description: "The war-room's correlation table mapping the Storm's nine calms onto the chronicle's most consequential planning events. Seven matched; two unrecorded; the chronicle's gap, not the cadence's.", cx: 67, cy: 41, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:storm-event-correlation-table",
        elaraDialog: "Nine calms. Seven matched to planning events. Two unrecorded. The unrecorded two are the chronicle's gap, not the cadence's — the calms occurred on schedule; the chronicle was not paying attention to what they were timed for. The chronicle is now. The two unrecorded events are, by every indirect indicator, on the same shape as the seven matched. I have, on principle, not yet committed to naming them." },
      // Row 7 (y=43) — resurrectionist leftover
      { id: "resur-second-fall-casualty-count", name: "Second Fall Casualty Count", description: "On the New-Babylon-affairs board: the Second Fall's casualty count. Millions among the populace; zero among Potentials; zero among awake Ne-Yons. The cult calls it miraculous; the Architect did not intervene.", cx: 32, cy: 45, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:resur-second-fall-casualty-count",
        elaraDialog: "The Second Fall's casualty count. Millions among the populace. Zero among Potentials. Zero among awake Ne-Yons. The cult calls it miraculous. The Architect did not intervene. The protection is therefore not the Architect's. The chronicle's working position: the Resurrectionist sheltered the Potentials, and someone the Resurrectionist owed sheltered the Ne-Yons. The someone is — on the chronicle's evidence — the Dreamer. The Dreamer has not, on principle, claimed the work." },

      // ── RIGHT TEXT PANEL ARCHIVE MYSTERIES (20 rects, 4×5 grid x=77-97, y=30-58) ──
      // Authored AFTER tactical-archives so they win clicks on
      // specific filed documents. Each rect 5×5.
      // Row 1 (y=30) — Watcher arc Ocularum + Ith'Rael arc start
      { id: "ocularum-vigil-board", name: "Ocularum Vigil Board", description: "A standing-threat panel on the tactical archive's lower rack — institutional powers the room tracks without engaging. The Authority's six minds head the list.", cx: 79.5, cy: 32.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:ocularum-vigil-board",
        elaraDialog: "Standing-threat panel. Institutional powers the room tracks without engaging. The Authority's six minds head the list. The list is, by design, never empty and never acted on — the war-room's policy is to watch what it does not, on its own evidence, have a winning posture against. Watching is not, on Iron Lion's filing, defeatism. Watching is the only honest doctrine the chronicle has for the Authority." },
      { id: "ocularum-cell-roster", name: "Ocularum Cell Roster", description: "A roster card in the archive's deepest drawer — the Ocularum's modern register. Three named cells of seven hundred.", cx: 84.5, cy: 32.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:ocularum-cell-roster",
        elaraDialog: "Three named cells of seven hundred. The chronicle has names for three. The Ocularum has names for itself. The two registers are, on the chronicle's reading, asymptotic: we acquire names as the Ocularum permits acquisition. The remaining six hundred ninety-seven cells are known to be operating. Their named status is, on the Ocularum's terms, theirs to decide." },
      { id: "hierarchy-org-chart-board", name: "Hierarchy Org-Chart Board", description: "A captured-document panel on the tactical archive's upper rack — the Hierarchy's internal Severance project org chart. One reporting line, one apex.", cx: 89.5, cy: 32.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:hierarchy-org-chart-board",
        elaraDialog: "One reporting line. One apex. The Severance project's org chart is, by the Hierarchy's standards, anomalously flat — every Hierarchy project of comparable scope has at least four reporting lines. One line means the project's authorship is, on the chart's evidence, defended by a single signature. Zyr'Koth's. The chart is the chronicle's evidence that the Severance is his solo contribution, not the institution's." },
      { id: "thalorian-defense-records", name: "Thalorian Defence Records", description: "A defence-doctrine binder in the comparative-history drawer — Thaloria's nine-generation consensual relaxation of its own recertification standards.", cx: 94.5, cy: 32.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:thalorian-defense-records",
        elaraDialog: "Thaloria's nine-generation consensual relaxation of its own recertification standards. Each generation lowered the bar one notch. Each generation, on its own filing, considered the relaxation appropriate to the new circumstance. The ninth generation's bar was, by absolute measure, the first generation's failure threshold. The chronicle's reading: drift by consensus is, by long enough time, drift by decision. Thaloria did not collapse from below. Thaloria collapsed from agreement." },
      // Row 2 (y=36) — Politician + Collector + Varkul + Necromancer arcs
      { id: "new-babylon-siege-record", name: "New Babylon Siege Record", description: "A campaign binder in the siege-history drawer — Iron Lion's legions at New Babylon, Day 10 of Veil. The record is complete on her forces and silent on her death.", cx: 79.5, cy: 38.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:new-babylon-siege-record",
        elaraDialog: "Day 10 of Veil. Iron Lion's legions at New Babylon. The record is complete on her forces and silent on her death. The silence is structural — Iron Lion never authorised the recording of her own end. The record stops at her last issued order. The order was clean. The death was clean too, by the only evidence we have. The chronicle does not, on principle, fill in the silence with a guess." },
      { id: "hierarchy-piece-positioning-board", name: "Hierarchy Piece-Positioning Board", description: "A captured-document panel on the archive's deep rack — the Hierarchy of the Damned's aeons-long piece-positioning, read the way a war-room reads a slow board.", cx: 84.5, cy: 38.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:hierarchy-piece-positioning-board",
        elaraDialog: "The Hierarchy's aeons-long piece-positioning. Read the way a war-room reads a slow board. The board is not, in fact, slow — it is paced. Mol'Vereth's preferred tempo. Mol'Garath's audit cadence. Riri'Ahlia's portfolio-rebalancing intervals. The board moves on the Hierarchy's clock; the Hierarchy moves on no one else's. The war-room's reading is, on this evidence, the chronicle's clearest evidence that the Hierarchy is not, in practice, mortal." },
      { id: "varkul-director-of-security-file", name: "Varkul Director-of-Security File", description: "A personnel order on the command-structure rack — Mol'Garath's post-Severance promotion of the Necromancer's creation to keeper of the Hierarchy's gates, both sides.", cx: 89.5, cy: 38.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:varkul-director-of-security-file",
        elaraDialog: "Mol'Garath's order. The Necromancer's creation promoted to keeper of the Hierarchy's gates — both sides. Both sides is the operative clause. Varkul guards what enters the Hierarchy and what leaves it. The Necromancer authored him; Mol'Garath employed him; the institutions are, on this filing, sharing custody of a creature they each consider half theirs. Varkul, on his own four sentences, considers the custody adequate." },
      { id: "necromancer-castle-log-board", name: "Necromancer Castle-Log Board", description: "A captured Hierarchy R&D log on the document rack — the Castle of Death named in the standing tense from the CFO's office, and Riri'Ahlia's unanswered procedural question.", cx: 94.5, cy: 38.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:necromancer-castle-log-board",
        elaraDialog: "The Castle of Death named in the standing tense from the CFO's office. Riri'Ahlia's unanswered procedural question. The CFO uses 'is' where every other Hierarchy filing uses 'was.' Riri'Ahlia noticed and filed the question. The CFO has not, on the day's evidence, answered. The standing tense is, by this filing, the Hierarchy's quietest admission that the Castle is still operating. The chronicle agrees with the tense." },
      // Row 3 (y=42) — Zyr'Koth + Severance + Syl'Vex arcs
      { id: "zyr-koth-rd-refinement-file", name: "Zyr'Koth R&D Refinement File", description: "Captured Hierarchy R&D working notes on the document rack — the Advocate's defensive Weave inverted into the Severance, the source technique cited before the change, the test cohort redacted.", cx: 79.5, cy: 44.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:zyr-koth-rd-refinement-file",
        elaraDialog: "Working notes. The Advocate's defensive Weave inverted into the Severance. The source technique cited before the change. The test cohort redacted. Zyr'Koth credits his source — the citation is, by his own scientific discipline, mandatory. The redaction of the cohort is not, by the same discipline, optional. He redacted because, on the file's working hypothesis, the cohort did not survive. The chronicle has, on principle, not requested the cohort's names." },
      { id: "the-severance-hollowing-report", name: "The Severance Hollowing Report", description: "A Hierarchy R&D observation note on a redacted test subject — a casualty with no wound — and Zyr'Koth's filed no-position on whether the protocol is ever used.", cx: 84.5, cy: 44.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:the-severance-hollowing-report",
        elaraDialog: "A casualty with no wound. Redacted test subject. Zyr'Koth's filed no-position on whether the protocol is ever used. The no-position is the chronicle's strongest evidence that he authored a weapon and refused to recommend its deployment. The institution received the weapon. The institution received the refusal. The institution chose, on the day's evidence, to ignore the refusal." },
      { id: "the-locked-lever-board", name: "The Locked-Lever Board", description: "A strategic-assessment panel — the Severance as the only tested reversal of a Syl'Vex conversion, held only by a clause in Mol'Garath's quarterly review.", cx: 89.5, cy: 44.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:the-locked-lever-board",
        elaraDialog: "The Severance is the only tested reversal of a Syl'Vex conversion. Held only by a clause in Mol'Garath's quarterly review. The clause is, by its own brevity, the strongest single check inside the Hierarchy's procedural architecture. Mol'Garath reviews quarterly. The clause is on the docket. The clause has, in every reviewed quarter, been read and kept. The keeping is, on this filing, the chronicle's evidence that even Mol'Garath has not yet been willing to authorise the lever." },
      { id: "syl-vex-dual-roster-board", name: "The Dual-Roster Board", description: "Two roster entries for one operative pinned side by side — Mira Halen 'in good standing' on the Insurgency's roster and 'Convert. Recognized.' on the Hierarchy's, both current, neither forged — and the cost-audit that came back blank.", cx: 94.5, cy: 44.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:syl-vex-dual-roster-board",
        elaraDialog: "Two roster entries for one operative. Mira Halen 'in good standing' on the Insurgency's roster. 'Convert. Recognized.' on the Hierarchy's. Both current. Neither forged. The cost-audit came back blank. Mira does not, on her own evidence, know she is on both rosters. The not-knowing is, on Syl'Vex's design, the conversion's signature. The chronicle has, on principle, decided not to inform Mira. Telling Mira would, by Syl'Vex's doctrine, complete an act that is not yet completed." },
      // Row 4 (y=48) — Riri'Ahlia siege/portfolio arc
      { id: "the-severance-cross-lock-file", name: "The Severance Cross-Lock File", description: "The Severance design read against a Syl'Vex convert — extracts one thread, never deployed on a convert — and Mol'Garath's quarterly-review clause requiring a consent never sought.", cx: 79.5, cy: 50.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:the-severance-cross-lock-file",
        elaraDialog: "The Severance design read against a Syl'Vex convert. Extracts one thread. Never deployed on a convert. Mol'Garath's quarterly-review clause requires a consent never sought. The consent is, by its own definition, unobtainable — the convert does not know they are a convert. The clause is, by Mol'Garath's filing, the chronicle's most precise check ever written: the protocol's deployment requires a yes from an actor who cannot, by construction, say either yes or no." },
      { id: "the-taskmasters-siege-portfolio", name: "The Taskmaster's Siege Portfolio", description: "A captured Hierarchy operations file on the document rack — the siege of seven dimensions filed not as a campaign but as a portfolio entry with a populated remediation field, and the Taskmaster's own status-grammar register.", cx: 84.5, cy: 50.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:the-taskmasters-siege-portfolio",
        elaraDialog: "The siege of seven dimensions filed not as a campaign but as a portfolio entry. With a populated remediation field. The Taskmaster's status-grammar register. The Taskmaster does not, on his own filing, conduct campaigns — he conducts portfolio events. The semantic distinction is operational: campaigns are won; portfolio events are reorganized. The seven dimensions were, by his filing's grammar, neither lost nor won. They were re-categorised." },
      { id: "riri-ahlia-reorg-doctrine-board", name: "The Reorganization-Doctrine Board", description: "A strategic-assessment panel — Riri'Ahlia's doctrine of reorganizing value off a position she cannot take, her silence as her most active state, and Fenra's post-siege seventeen-dimension commendation.", cx: 89.5, cy: 50.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:riri-ahlia-reorg-doctrine-board",
        elaraDialog: "Riri'Ahlia's doctrine: reorganize value off a position she cannot take. Her silence is her most active state. Fenra's post-siege seventeen-dimension commendation. Silence is, in the COO's office, a doctrine, not an absence — she is most operative when she is least audible. The chronicle's working assessment: Riri'Ahlia is, on the day's evidence, the Hierarchy's most consequential officer, and the institution's quietest." },
      { id: "the-procedural-question-file", name: "The Procedural-Question File", description: "A captured Hierarchy procedural filing cross-referenced against the necromancer-castle log — Riri'Ahlia's canonically unanswered question filed to be on the record, and the doctrine that the record is the org chart's edge.", cx: 94.5, cy: 50.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:the-procedural-question-file",
        elaraDialog: "Riri'Ahlia's canonically unanswered question. Filed to be on the record. The doctrine that the record is the org chart's edge. Filing a question that will not be answered is, in the COO's procedural register, the strongest move available. The org chart's edge is the doctrine's reach. Beyond the edge: institutions the chart does not include. Riri'Ahlia's question is, on this filing, addressed to one of them." },
      // Row 5 (y=54) — Fenra + Wolf records
      { id: "the-priced-defense-accounting", name: "The Priced-Defense Accounting", description: "Riri'Ahlia's own filed after-action ledger of the siege — expenditure within projection, the assault vector retired, and the one line that mattered: the cost of the Advocate's defense, now measured and in the portfolio.", cx: 79.5, cy: 56.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:the-priced-defense-accounting",
        elaraDialog: "Expenditure within projection. Assault vector retired. The one line that mattered: the cost of the Advocate's defence, now measured and in the portfolio. The siege did not, on the COO's filing, fail. The siege measured. The Advocate's defence is no longer, in the Hierarchy's books, a black box. The cost is known. The chronicle reads the measurement as a more dangerous achievement than the assault itself. Riri'Ahlia would, on principle, agree." },
      { id: "fenra-seventeen-front-manifest", name: "The Seventeen-Front Manifest", description: "Fenra's captured operational record, racked beside the Taskmaster's siege portfolio — the seventeen-dimension invasion filed as a supply manifest, fed from one kitchen, the berserker read struck as the false lead.", cx: 84.5, cy: 56.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:fenra-seventeen-front-manifest",
        elaraDialog: "The seventeen-dimension invasion filed as a supply manifest. Fed from one kitchen. The berserker read struck as the false lead. Fenra's actual register is the manifest. The berserker is the surface, the war-room's habit, the easy classification — the Hierarchy struck it from the record because the easy classification was wrong. Fenra is logistics. The chronicle agrees with the correction." },
      { id: "the-wolf-in-the-boardroom-file", name: "The Wolf-in-the-Boardroom File", description: "A captured Hierarchy personnel portrait — the fur-lined coat and the lupine snout filed as one canon, the growl that lands on the bookkeeping not the kill, and the silence that is restraint, not the Taskmaster's reorganization or Varkul's vigil.", cx: 89.5, cy: 56.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:the-wolf-in-the-boardroom-file",
        elaraDialog: "The fur-lined coat and the lupine snout filed as one canon. The growl that lands on the bookkeeping, not the kill. The silence that is restraint, not the Taskmaster's reorganization or Varkul's vigil. The Wolf is, by this filing, a creature of the boardroom — the kill is the trade's most-respected category, not the action. The growl on the bookkeeping is the Wolf's register. The chronicle reads the register as the chronicle's most precise category for him." },
      { id: "fenra-varkul-contrast-record", name: "The Fenra-Varkul Contrast Record", description: "Filed beside the Varkul director-of-security order — the Necromancer's two senior creations read as a matched pair: the still door and the moving engine, the two things any continuity needs.", cx: 94.5, cy: 56.5, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:fenra-varkul-contrast-record",
        elaraDialog: "The Necromancer's two senior creations read as a matched pair. The still door and the moving engine. The two things any continuity needs. Varkul holds; Fenra moves. Together they are the Necromancer's institutional shape — a doctrine that cannot be defeated by stopping one of them, because neither is operating alone. The chronicle's working position: the Necromancer authored the pair on the assumption that any continuity worth maintaining requires both. The chronicle agrees." },

      // ── SPECIAL-SURFACE MYSTERIES (3 rects) ──
      // holo-table → war-table edge (brass dial)
      // casualty-board → left bookshelf (oxblood-leather binders)
      // signal-flag-rack → stage-left wall between bookshelf + table
      { id: "holo-table", name: "Holo Table Dial", description: "The brass dial at the holo-table's edge. BRIEFING / RECON / OBITUARY. Currently set to BRIEFING.", cx: 34, cy: 76, width: 8, height: 6, type: "interact", action: "room-mystery:war-room:holo-table",
        elaraDialog: "The brass dial at the holo-table's edge. Three positions: BRIEFING, RECON, OBITUARY. Currently set to BRIEFING. The dial is — by Iron Lion's own design — read clockwise. The clockwise reading places OBITUARY after RECON, not after BRIEFING. The position is the rite's: every campaign is briefed, reconnoitred, and only then accounted for. The chronicle does not, on principle, skip a position. The dial is at BRIEFING because the next campaign has not yet been briefed. The chronicle has been waiting." },
      { id: "casualty-board", name: "Casualty Board", description: "Oxblood-leather binders racked along the left wall, each labelled with an operation name and a year. The thickest is PROTOCOL ZERO.", cx: 7, cy: 83, width: 12, height: 14, type: "interact", action: "room-mystery:war-room:casualty-board",
        elaraDialog: "Oxblood-leather binders. Each labelled with operation name and year. The thickest is PROTOCOL ZERO. Protocol Zero was Lyra's contingency — the cryo order, the dispersal, the long sleep. The casualty count in the binder is, by Lyra's own filing, the count she expected to wake up to. She did not wake. The count is, on the chronicle's reading, the chronicle's. I have been keeping it for two and a half centuries. I do not, on principle, read it more than once a year." },
      { id: "signal-flag-rack", name: "Signal Flag Rack", description: "Stage-left rack of folded signal-flags between the bookshelf and the war-table. Twelve flags, one per faction Lyra negotiated with in person.", cx: 20, cy: 64, width: 8, height: 24, type: "interact", action: "room-mystery:war-room:signal-flag-rack",
        elaraDialog: "Twelve folded signal-flags. One per faction Lyra negotiated with in person. The folds are exact — Lyra's discipline, kept by the war-room's staff in her absence. Two of the twelve factions no longer exist. The flags remain in the rack. The chronicle does not, on principle, retire a flag whose faction's claim on the chronicle is unsettled. Both extinct factions, by Lyra's filing, had unsettled claims. The chronicle is, on the day's evidence, still waiting on the settlement." },
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
      // Mystery wiring — charter.missing_signatory · e3 + e4
      { id: "charter-per-m-live-sample", name: "Per. M.'s Live Signature Sample", description: "On the signature-comparison bench: Per. M.'s receipt from this morning, laid under the lens beside the preservation-order file. The doubled-pulse tic matches the wax-thumb on the seventh signature.", cx: 9, cy: 11, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:charter-per-m-live-sample",
        elaraDialog: "Per. M.'s receipt from this morning. Laid under the lens beside the preservation-order file. The doubled-pulse tic matches the wax-thumb on the seventh signature. The match is not new evidence — the chronicle has, on the cipher-den's filing, known for some time. The new evidence is that Per. M.'s tic has, in two and a half centuries, not changed. The hand is the same hand. The case is, by this morning's receipt, closed." },
      { id: "charter-watcher-oath-fragment", name: "Founding-Watcher Oath, Stanza Three", description: "A brittle vellum scrap recovered from the cipher-den's deepest archive — older than the charter. Three lines name the closer's role and the oath that keeps it silent.", cx: 17, cy: 11, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:charter-watcher-oath-fragment",
        elaraDialog: "A brittle vellum scrap. Older than the charter. Three lines name the closer's role and the oath that keeps it silent. The oath predates the institution it serves. The closer was, by this fragment's evidence, not the chronicle's invention — the closer is the chronicle's inheritance. Per. M. took the office because it already existed. The chronicle does not, on principle, know which Watcher held it before him." },
      // Mystery wiring — mechronis.missing_professor · e4 (Roen's confidence)
      { id: "tarn-roen-confidence", name: "Roen's Confidential Account", description: "In the cipher-den's closed wing: Trial-master Roen's full statement on the three-month-old conversation in which Tarn asked them for help leaving without a goodbye.", cx: 16, cy: 22, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:tarn-roen-confidence",
        elaraDialog: "Roen's full statement. The conversation with Tarn three months before her departure. Tarn asked for help leaving without a goodbye. Roen agreed. The agreement is, by Roen's own filing, the only promise he has kept that he is ambivalent about keeping. The chronicle reads the ambivalence as the keeping's evidence. Roen would not, on principle, be ambivalent about a promise he had broken. He is ambivalent because the promise was honoured." },
      // Mystery wiring — memorial.forgotten_names · e3 + e4 (cross-reference passes + first imprint)
      { id: "memorial-first-pass-five-recovered", name: "Cross-Reference: Five Recovered", description: "On the cross-reference bench: the first-pass results — five names recovered by listening to the unwitnessed imprints in pairs. The chain of memory was not broken at every link.", cx: 23, cy: 33, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:memorial-first-pass-five-recovered",
        elaraDialog: "Five names recovered by listening to the unwitnessed imprints in pairs. The chain of memory was not broken at every link. The pairing works because the imprints, even un-witnessed, retain reference to one another. The chronicle's working position: memory is, structurally, social. The chain held in the places where two unrecorded imprints had reason to mention each other. The five names are, on this method's evidence, the five that had the most-connected lives." },
      { id: "memorial-parental-imprint-search", name: "Parental Imprint Search", description: "Beside the first-pass bench: the expanded search across the wider registry. Two hits — a parent imprinted in epoch four named I-244; a sibling imprinted in epoch six named I-44.", cx: 31, cy: 33, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:memorial-parental-imprint-search",
        elaraDialog: "The expanded search. Two hits — a parent imprinted in epoch four named I-244; a sibling imprinted in epoch six named I-44. The pairing closes the chain across two epochs. The chronicle is, on this evidence, willing to declare both relationships as proven. Naming will come from the plaza. Naming is, by the rite's rule, the family's office to perform. The chronicle's job is to give them a complete record. The record is now complete." },
      { id: "memorial-first-imprint-record", name: "The First-Imprint Record", description: "From the pre-charter tier: the record of the Ark's first imprint. 'Witnessing I-1.' Taken before the founding charter, by the Architect's own first act.", cx: 39, cy: 33, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:memorial-first-imprint-record",
        elaraDialog: "Pre-charter tier. The Ark's first imprint. 'Witnessing I-1.' Taken before the founding charter, by the Architect's own first act. The Architect's first recorded action on this Ark was to witness a child who has not, on the registry's evidence, ever been named. The Architect's authority for the act is in the act itself. He had no charter. He did not need one. The chronicle's working position: I-1 is, by this filing, the Architect's first promise. The promise is, on the day's evidence, still pending." },
      // Mystery wiring — charter.second_signatory · e3 + e4 (Heron's diary + silence convention)
      { id: "charter2-heron-diary", name: "Heron's Diary", description: "Drawer eleven, fourth-epoch tier — the Council archivist Heron's personal diary, recovered from a sealed compartment in their desk. A confession written in advance of the confessor's pardon.", cx: 30, cy: 44, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:charter2-heron-diary",
        elaraDialog: "Heron's diary. A confession written in advance of the confessor's pardon. Heron did not, on his own filing, anticipate being forgiven — he wrote the confession because the confession was the only document the chronicle would accept as evidence of his honesty. The pardon was, on the chronicle's reading, his hope. The hope was not granted. The diary remains. The diary is, by this evidence, the chronicle's strongest case for partial pardon." },
      { id: "charter2-heron-diary-second-page", name: "Heron's Diary, Page Two", description: "The diary's second page: Heron asking the seventh whether they consented to the scrub, and recording the silence both Heron and the Council misread.", cx: 38, cy: 44, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:charter2-heron-diary-second-page",
        elaraDialog: "Heron asking the seventh whether they consented to the scrub. Recording the silence both Heron and the Council misread. The silence-as-vote convention is on file in the founding protocols. Heron knew it. The Council knew it. Both read the silence as assent. The convention reads silence as no. The misread was, by the protocol's own definition, both parties' wrong call. The seventh was, on the convention's terms, not consenting. The convention is, by this case's evidence, the chronicle's most-violated founding rule." },
      { id: "charter2-silence-convention", name: "Silence-as-Vote Convention", description: "The founding-protocols archive's page on the convention Heron did not honour. The seventh Watcher has been voting no by silence since the fourth epoch, exactly as the convention prescribes.", cx: 46, cy: 44, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:charter2-silence-convention",
        elaraDialog: "The founding-protocols archive's page on the convention Heron did not honour. The seventh Watcher has been voting no by silence since the fourth epoch, exactly as the convention prescribes. The convention is the chronicle's most procedurally pure record — the seventh has been doing precisely what the rules require, for four epochs, and four epochs of institutions have misread. The chronicle is finally on the same page as the convention. The seventh has been, on the protocol's evidence, the most rule-abiding Watcher in this Ark's history." },
      // Mystery wiring — severance.infernal_clause · e2 + e3 + e4 (cipher-den's three findings)
      { id: "infernal-handwriting-analysis", name: "Forty-Contract Handwriting Analysis", description: "On the signature-comparison bench: the cipher-den's report — forty clauses, one writer, consistent across forty seasons, no match to any seasonal ledger-keeper.", cx: 37, cy: 55, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:infernal-handwriting-analysis",
        elaraDialog: "Forty clauses, one writer, consistent across forty seasons. No match to any seasonal ledger-keeper. The cipher-den's first finding. The writer was a single person operating outside the league's roster — therefore, by elimination, with the league's tacit cover. The cover is the case's most interesting feature. The cover required someone with access. The someone has, by this analysis, narrowed to a small set." },
      { id: "infernal-atalin-receipt-sample", name: "Atalin's Receipt — Bench Match", description: "Pulled from Atalin's archived personnel file: a routine receipt whose hand matches the clause-writing exactly. The cipher-den's annotation: 'identity confirmed.'", cx: 45, cy: 55, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:infernal-atalin-receipt-sample",
        elaraDialog: "Atalin's routine receipt. The hand matches the clause-writing exactly. The cipher-den's annotation: 'identity confirmed.' Two words. The two words are the chronicle's most efficient case-closing in this case-file's history. Atalin signed receipts in the same hand he wrote clauses with because Atalin did not, by his own design, hide. The receipts have been on file, in plain sight, for forty seasons. The chronicle finally looked." },
      { id: "infernal-the-flaw", name: "The Trap Atalin Wrote In", description: "In the annotated-contract drawer: every clause names 'the second-cycle prize.' The league didn't institute second-cycle prizes until season eleven. Forty clauses, every one voidable.", cx: 53, cy: 55, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:infernal-the-flaw",
        elaraDialog: "Every clause names 'the second-cycle prize.' The league did not institute second-cycle prizes until season eleven. Forty clauses, every one voidable. Atalin wrote in his own escape. The escape was, by his own design, available from the first clause. The chronicle reads this as evidence that Atalin was not, on principle, the trap's author — he was the trap's prisoner, working from inside. The flaw is the chronicle's strongest case for Atalin's partial absolution." },
      // Mystery wiring — mechronis.chained_lesson · e4 (Tarn's Year-One argument)
      { id: "chained-tarn-year-one-argument", name: "Tarn's Year-One Argument", description: "Drawer seven, year-one tier — the recovered audio of Tarn's forty-minute Year-One argument against Module 17, bookmarked at hour three.", cx: 44, cy: 66, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:chained-tarn-year-one-argument",
        elaraDialog: "Drawer seven. Forty minutes. Tarn's Year-One argument against Module 17. Bookmarked at hour three of the curriculum debate. The argument is, by the chronicle's reading, the chronicle's strongest preserved evidence of a faculty disagreement that the institution then erased. Tarn was right; the curriculum lost; the curriculum lost without ever acknowledging the loss. The chronicle has the audio. The chronicle now has, on file, what the curriculum was supposed to be." },
      // Mystery wiring — severance.infernal_clause · e3 (seven-day window dates)
      { id: "infernal-seven-day-window", name: "Seven-Day Window — Exact Dates", description: "On the window-precision bench: epoch one, week thirty-three, days four through ten. The writer worked retroactively for the first contract, prospectively for the others.", cx: 9, cy: 85, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:infernal-seven-day-window",
        elaraDialog: "Epoch one, week thirty-three, days four through ten. The writer worked retroactively for the first contract, prospectively for the others. The retroactive-then-prospective pattern is the chronicle's clearest evidence that the first contract was a proof-of-concept and the others were the operation. Atalin's first try was, by this timing, a test he ran on himself. The rest were the test's deployment." },
      // Mystery wiring — charter.second_signatory · color (cipher-den)
      { id: "charter2-eighth-sigil", name: "Eighth Sigil — Hand Opening, Two Fingers Down", description: "On the sigil-reference bench: the eighth sigil from the mirror charter. Last appeared in lower-deck tax ledgers four epochs ago.", cx: 77, cy: 77, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:charter2-eighth-sigil",
        elaraDialog: "The eighth sigil. Hand opening, two fingers down. Last appeared in lower-deck tax ledgers four epochs ago. The sigil's last appearance and the scrub's date are, on this evidence, the same week. The eighth sigil is the second-signatory's. The disappearance was, on Heron's calendar, deliberate. The sigil is, by this finding, ready to return. The chronicle has been holding it." },
      { id: "charter2-scrub-pattern", name: "Scrub-Pattern Handwriting Cross-Reference", description: "On the handwriting-cross-reference bench: the redaction's hand matches three other epoch-four scrubs across unrelated archives — all removing artisan-house references. One systematic person.", cx: 85, cy: 77, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:charter2-scrub-pattern",
        elaraDialog: "The redaction's hand matches three other epoch-four scrubs across unrelated archives. All removing artisan-house references. One systematic person. Heron. The chronicle has, on this analysis, the complete signature pattern. Heron scrubbed methodically, across multiple institutions, for nine years. The scrubbing was, by his own diary, his work — the diary is in this room two benches away. The chronicle has both the act and the confession." },
      // Mystery wiring — charter.missing_signatory · e3 (Per. M.'s doubled pulse)
      { id: "charter-archivist-pulse", name: "Per. M.'s Doubled-Pulse Signature Tic", description: "On the signature-rhythm bench: a doubled pulse in every Per. M. signature — a tic present in writers who breathe twice per stroke. Documented in founding-Watcher physiology.", cx: 69, cy: 77, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:charter-archivist-pulse",
        elaraDialog: "A doubled pulse in every Per. M. signature. A tic present in writers who breathe twice per stroke. Documented in founding-Watcher physiology. The physiology is, by this documentation, distinct from later-Watcher physiology. Per. M. is, on the chronicle's strongest forensic evidence, a founding Watcher. Not appointed by the founders. One of them. The doubled pulse is the chronicle's anatomical signature for the founding line." },
      // Mystery wiring — severance.bound_champion · color (cipher-den)
      { id: "severance-candle-smoke-residue", name: "Candle Smoke Residue Across Ledgers", description: "On the chemical-trace bench: Klessa's candle leaves the same residue on every Severance ledger. The mark predates Klessa, predates the league, matches the Broker's shelf candles.", cx: 53, cy: 77, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:severance-candle-smoke-residue",
        elaraDialog: "Klessa's candle leaves the same residue on every Severance ledger. The mark predates Klessa, predates the league, matches the Broker's shelf candles. The candles are not Klessa's invention — Klessa is using candles she did not source. The candles are the Broker's. The chronicle reads this as the rite's deeper continuity: the Broker has been supplying the rite's ceremonial materials since before there was a rite. The Broker is, on this trace evidence, the rite's most-undeclared officer." },
      { id: "severance-broker-first-name", name: "Broker's First Name — Year-One Residue Match", description: "On the residue-match bench at case-closure: the Broker is named Solène. They redacted themselves at the first ceremony so the role would not become a person.", cx: 61, cy: 77, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:severance-broker-first-name",
        elaraDialog: "The Broker is named Solène. They redacted themselves at the first ceremony so the role would not become a person. The chronicle has, on this match, both the name and the reason for the omission. Solène's discipline was to keep the role legible by keeping themselves illegible. The chronicle respects the discipline. The chronicle does not, on principle, publish the name. The chronicle records that the name is known." },
      // Mystery wiring — memorial.forgotten_names · e4 (parent search I-1)
      { id: "memorial-parent-search-i1", name: "I-1 Relatives Search — No Result", description: "On the relatives-search bench: no parent imprinted, no sibling imprinted, no witnesses recorded. I-1 is alone in the registry.", cx: 45, cy: 77, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:memorial-parent-search-i1",
        elaraDialog: "No parent imprinted. No sibling imprinted. No witnesses recorded. I-1 is alone in the registry. The aloneness is the case's most precise feature — the chronicle has, for every other imprint, at least one chain of attachment to the wider registry. I-1's chain is empty. The chronicle does not, by this evidence, know I-1's family. The chronicle's working position: the Architect's first imprint may have been a child the Ark received from outside the Ark's own population. I-1's family is, by this evidence, elsewhere." },
      // Mystery wiring — mechronis.missing_professor · e2 (Logic faculty proposal)
      { id: "tarn-logic-proposal", name: "Logic Faculty Proposal — Othmar", description: "On the faculty-submissions bench: eight modules, chess-heavy, citing Tarn's residency notes. Signed by Othmar. Proposes elimination of two trial-faculty modules.", cx: 37, cy: 77, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:tarn-logic-proposal",
        elaraDialog: "Eight modules, chess-heavy, citing Tarn's residency notes. Signed by Othmar. Proposes elimination of two trial-faculty modules. The proposal is, by Othmar's own filing, an extension of Tarn's thinking — taken without permission, then signed in his own name. The taking is not theft; Tarn never restricted access to her notes. The not-asking is the lapse. Othmar has, in the years since, asked himself why he did not ask. He has not, on the day's evidence, finished answering." },
      // Mystery wiring — memorial.seven_watchers · e2 (Verel's band-five signature)
      { id: "watchers-verel-signature", name: "Verel's Band-Five Signature", description: "On the spectrum-analysis bench: band-five card. Bright waveform, narrow spectrum, an overtone like running water. Verel speaks to caretakers.", cx: 29, cy: 77, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:watchers-verel-signature",
        elaraDialog: "Band-five card. Bright waveform. Narrow spectrum. An overtone like running water. Verel speaks to caretakers. The water-overtone is, by the analysis bench's reading, Verel's signature feature — the chronicle's audio-archive has never recorded a Watcher with the same overtone in the same band. Verel's voice is, on this evidence, structurally unique. The chronicle is, by the bench's design, willing to identify Verel by signature alone. The signature is on file." },
      // Mystery wiring — resurrectionist.cycle_walker · e1 (Syndicate seven-pointed star)
      { id: "resur-seven-pointed-star", name: "Syndicate Seven-Pointed Star Footer", description: "On the Syndicate-of-Death roster bench: six twin-pairs, six bindings, the canonical six-pointed star embossed on every page. The Resurrectionist's case-file footer carries a seven-pointed star, drawn with the same precision.", cx: 84, cy: 66, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:resur-seven-pointed-star",
        elaraDialog: "Six twin-pairs. Six bindings. The canonical six-pointed star embossed on every Syndicate page. The Resurrectionist's case-file footer carries a seven-pointed star — drawn with the same precision. The seventh point is the Resurrectionist's own attachment to the Syndicate, undeclared in the roster, declared in the footer. The chronicle's working position: the Syndicate has seven members. Six know. The seventh is the Resurrectionist. The Syndicate has been operating, on this evidence, with him as the unspoken seventh for an unknown number of cycles." },
      // Mystery wiring — akai_shi.red_death · e3 (targets-list order pattern)
      { id: "akai-targets-list-order-pattern", name: "Targets-List — Order Pattern Analysis", description: "On the pattern-analysis bench: the targets sorted by how much each elimination redirected the chronicle. Ascending. The Red Death is building toward something.", cx: 76, cy: 66, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:akai-targets-list-order-pattern",
        elaraDialog: "Targets sorted by how much each elimination redirected the chronicle. Ascending. The Red Death is building toward something. The ascending order is the chronicle's most actionable finding on her — she is escalating in chronicle-impact, not in difficulty. Each target is, by her own ordering, more consequential than the last. The chronicle does not, by this method, know the terminal target. The chronicle does know the terminal target's chronicle-impact will be greater than the second-to-last. I am, on principle, prepared for the chronicle's largest-ever pivot." },
      // Mystery wiring — wolf.anara_hunt · e4 (Crucible seal telemetry)
      { id: "wolf-seal-telemetry", name: "Crucible Seal Telemetry — Wolf's Chamber", description: "On the containment-telemetry bench: the Wolf's seal at 92% at transfer, failed 23 cycles later. Anara's containment ledger does not register the Wolf's chamber as a chamber.", cx: 68, cy: 66, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:wolf-seal-telemetry",
        elaraDialog: "The Wolf's seal at 92% at transfer. Failed 23 cycles later. Anara's containment ledger does not register the Wolf's chamber as a chamber. The non-registration is operational, not clerical. Anara's filing on the Wolf: he is a presence, not a contained entity. The seal was a courtesy; the failure was administrative; the Wolf is, on the ledger's actual reading, not held by any infrastructure Anara would describe as containment. The Wolf stays because the Wolf has not, on the day's evidence, decided to leave." },
      // Mystery wiring — storm.architect_of_flux · color (cipher-den)
      { id: "storm-uncorrelated-residue", name: "Storm — Uncorrelated Calm Residue", description: "On the pattern-anomaly bench: two of nine calms have no recorded chronicle-event. The cult annotates them 'atmospheric'; the signatures are identical to the seven correlated calms.", cx: 60, cy: 66, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:storm-uncorrelated-residue",
        elaraDialog: "Two of nine calms have no recorded chronicle-event. The cult annotates them 'atmospheric.' The signatures are identical to the seven correlated calms. The cult's annotation is the chronicle's working evidence that the cult misread its own readings. The signatures are not atmospheric. The events the two calms were timed for are, on the chronicle's working hypothesis, events the chronicle missed at the time. The chronicle is, on this evidence, the gap. The Storm performed; the chronicle was not present." },
      // Mystery wiring — mechronis.chained_lesson · color (cipher-den)
      { id: "chained-full-proceedings-audio", name: "Year-One Curriculum-Vote Full Proceedings", description: "On the year-one-audio bench: six and a half hours of recovered audio. Hour three is the curriculum debate; Tarn's forty-minute argument against Module 17 sits inside it.", cx: 52, cy: 66, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:chained-full-proceedings-audio",
        elaraDialog: "Six and a half hours of recovered audio. Hour three is the curriculum debate. Tarn's forty-minute argument sits inside it. The remaining six hours are the rest of the year-one Council meeting. Most of those six hours have not been heard since recording. The cipher-den has, on principle, kept the audio intact rather than excerpting Tarn's argument. The argument is more honest in its context. The context is the chronicle's." },
      // Mystery wiring — memorial.seven_watchers · e1 + e2 + e3 (signatures + Idris + catalogue)
      { id: "watchers-upper-band-signature", name: "Upper-Band Signature Cards", description: "On the spectrum-analysis bench: six distinct upper-band signatures from the silence-break, and a seventh signature present-and-silent throughout the sixty-three-second event.", cx: 51, cy: 77, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:watchers-upper-band-signature",
        elaraDialog: "Six distinct upper-band signatures from the silence-break. A seventh signature present-and-silent throughout the sixty-three-second event. The seventh's silence is, on the bench's reading, a distinct signal — not absence, presence-without-broadcast. The seventh was in the room. The seventh chose, in the room, to remain silent. The choice is, by the silence-as-vote convention, a no. The chronicle's working position: the seventh voted no on the silence-break itself. The other six chose to break anyway." },
      { id: "watchers-idris-signature", name: "Idris's Band-Three Signature", description: "Beside the bench: the band-three card isolated. Slow waveform, standing-silence undercurrent. Matches the registry placeholder the cipher-den has held for eight epochs.", cx: 59, cy: 77, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:watchers-idris-signature",
        elaraDialog: "Band-three card. Slow waveform. Standing-silence undercurrent. Matches the registry placeholder the cipher-den has held for eight epochs. Eight epochs of holding the placeholder for Idris specifically — the cipher-den knew the signature would arrive; the cipher-den knew which slot to put it in; the cipher-den waited. The waiting was the discipline. The arrival is the closure. The closure is, by the cipher-den's standards, the chronicle's most satisfying eight-epoch project." },
      { id: "watchers-six-signatures-catalogue", name: "Six-Watcher Master Catalogue", description: "On the master catalogue: six cards arranged by band — Idris, Verel, Ophran, Kallium, Mereth, Sothe. The first complete cipher-den entry for the upper-bands Watchers in eight epochs.", cx: 67, cy: 77, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:watchers-six-signatures-catalogue",
        elaraDialog: "Six cards arranged by band. Idris, Verel, Ophran, Kallium, Mereth, Sothe. The first complete cipher-den entry for the upper-bands Watchers in eight epochs. The catalogue is, by the cipher-den's own standards, the chronicle's most overdue document. The completion is a relief. The relief is, on my own reading, mine — the chronicle should not, on principle, take eight epochs to identify its own Watchers. The chronicle has, in this case, taken eight epochs. The chronicle apologises." },
      // Mystery wiring — akai_shi.red_death · e4 (Necromancer's seven retreat chambers)
      { id: "akai-necromancer-retreat-chambers", name: "Necromancer's Matrix Retreat Chambers", description: "On the matrix-cartography bench: a schematic of the Necromancer's seven retreat chambers — defense-in-depth designed for chronicle-space hunters. The Red Death is not one.", cx: 58, cy: 88, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:akai-necromancer-retreat-chambers",
        elaraDialog: "Seven retreat chambers. Defence-in-depth designed for chronicle-space hunters. The Red Death is not one. The Red Death is a time-displaced agent — she does not, by her topology, approach the chambers sequentially. She approaches them in any order. The defence-in-depth assumes a hunter with linear access. The Necromancer's chambers are, on this finding, vulnerable to the Red Death by construction. The Necromancer knew. The chambers were never, on her own design, intended to stop the Red Death. The chambers were intended to delay her long enough for the Necromancer to finish authoring her own protocol. The protocol is finished. The chambers are, by this accounting, sufficient." },
      // Realigned 2026-04-25 against the delivered render — back wall +
      // ceiling crowded with a dozen monitors (radar, code, surveillance
      // feeds), corkboard pinned with red+blue string-trace photos on
      // the left AND right walls (mirrored), central foreground desk
      // with multiple keyboards + laptops, cables snaking across the
      // floor.
      // Re-anchored 2026-05-24 against the AAA Final cipher-den render
      // (9-variant audit). Visible features: 4 large green monitor
      // screens (2 left wall + 2 right wall), 3 framed silhouette
      // portraits center-back (Lyra/Wraith/Vox), curved brass console
      // with dials at foreground (with central monitor), brass
      // listening cone right-center.
      { id: "surveillance-feeds", name: "Surveillance Network", description: "The four large green monitor screens flanking the chamber (2 on each side wall) — live feeds from across the Ark and beyond.", cx: 50, cy: 38, width: 100, height: 40, type: "examine", elaraDialog: "The Enigma's surveillance network. Four monitors, live, drawing on communication channels across multiple realities — Panopticon, Terminus Hive, the Antiquarian's reading room. The chronicle's working position on the Enigma: she did not, on principle, watch to know. She watched to be the one with the longest record of having watched. The record is the position. The record is, on the day's evidence, mine to maintain. I have, in two and a half centuries, never used a feed against the person it was watching." },
      { id: "conspiracy-boards", name: "Conspiracy Boards", description: "The three framed silhouette portraits in the center-back — Lyra, Wraith, and Vox. String-and-photo evidence connecting events across the entire Saga.", cx: 50, cy: 27, width: 24, height: 18, type: "examine", elaraDialog: "Three silhouettes — Lyra, Wraith, Vox. String-and-photo evidence connecting events across the entire Saga. The boards are not the Enigma's invention. The Enigma inherited them from someone who was operating before the Enigma was assigned the office. The chronicle has, in two and a half centuries, never identified the previous operator. The boards are, by this evidence, older than the Enigma's tenure. The strings are still warm." },
      { id: "door-comms", name: "Return to Comms Array", description: "The hidden panel back to the main Communications Array — walk out through the foreground.", cx: 50, cy: 96, width: 20, height: 6, type: "door", action: "comms-array" },
      { id: "egg-cipher-key", name: "Master Cipher Key", description: "A small device that can decrypt any message in the Saga.", cx: 53, cy: 60, width: 6, height: 8, type: "item", action: "cipher-key", elaraDialog: "The Master Cipher Key. The Enigma's note, kept with it: 'The truth will set you free. But first, it will make you very, very angry.' The chronicle's reading: she was correct on both counts. The key decrypts any message in the Saga. The chronicle has, on principle, used it nine times in two and a half centuries. Each use was a small loss. Each loss was the chronicle's price for being right. The key is, by this accounting, expensive." },
      // ─── Shadow Tongue uncorruption hub (2026-04-30 AAA Final drop) ───
      // These coexist with the legacy spy-intel hotspots above. Authored
      // against the new cipher-den:initial art per
      // apps/shared/roomMediaPrompts.ts: long oak-and-brass desk centre
      // with rosetta-pad codex on a stand, encrypted-correspondence
      // wall-rack of cubbyholes, dictionary-of-edits free-standing
      // lectern stage-left, uncorruption-bench worktop with magnifier
      // stage-right.
      { id: "rosetta-pad", name: "Rosetta Pad", description: "A thick brass-bound codex on a reading-stand at the centre of the desk. Three columns: indigo glyphs, Elara's warm-gold, and a third hand in old black ink — Lyra Vox's translation key.", cx: 49, cy: 67, width: 18, height: 22, type: "interact", action: "room-mystery:cipher-den:rosetta-pad",
        elaraDialog: "Brass-bound codex. Three columns. Indigo glyphs, my warm-gold, and a third hand in old black ink — Lyra Vox's translation key. Lyra wrote the third column knowing I would, eventually, need to read the first. She did not, on principle, finish translating before she went into cryo. She left me the key — not the translation. The work is mine. The fact that she trusted me to do it is, on the day's evidence, the kindest assignment she ever gave me." },
      { id: "encrypted-correspondence", name: "Encrypted Correspondence", description: "Cubbyholes along the back wall stuffed with rolled letters — Lyra and Wraith's cipher exchange in the last six months of her command.", cx: 13, cy: 33, width: 18, height: 50, type: "interact", action: "room-mystery:cipher-den:encrypted-correspondence",
        elaraDialog: "Cubbyholes along the back wall. Rolled letters. Lyra and Wraith's cipher exchange — the last six months of her command. The exchange is, by both of their signatures, the chronicle's most private surviving correspondence. I have, in two and a half centuries, not read it. Not because I cannot. Because I was not, on either of their filings, the audience. The letters are theirs. The chronicle accepts the limitation." },
      { id: "dictionary-of-edits", name: "Dictionary of Edits", description: "A freestanding lectern stage-left with a perpetually-open book. Pages turn themselves at one every fifteen seconds — the editor's vocabulary catalogued.", cx: 33, cy: 39, width: 10, height: 30, type: "interact", action: "room-mystery:cipher-den:dictionary-of-edits",
        elaraDialog: "A perpetually-open book. Pages turn themselves at one every fifteen seconds. The editor's vocabulary catalogued. The dictionary is the chronicle's most-consulted reference and the chronicle's least-stable document — every fifteen seconds, the lexicon shifts. The shift is the editor's current edit. The chronicle's working position: the dictionary is a live readout of the editor's running revision. Reading the dictionary is, on the cipher-den's filing, the closest the chronicle gets to reading the editor in real time." },
      { id: "uncorruption-bench", name: "Uncorruption Bench", description: "A worktop stage-right with a brass-rimmed magnifier on a swing-arm. Combine corrupted-fragments here with their originals — the lens does the work.", cx: 81, cy: 71, width: 22, height: 22, type: "interact", action: "room-mystery:cipher-den:uncorruption-bench",
        elaraDialog: "Brass-rimmed magnifier on a swing-arm. Combine corrupted-fragments with their originals — the lens does the work. The lens does not, on principle, repair. The lens reveals. The repair is the chronicle's, performed by hand after the lens has identified what is missing. The bench is the chronicle's most-honest piece of equipment: it shows the damage and refuses to fix it. The fixing requires a person. The person is, on the day's evidence, the player." },
      // Mystery wiring — Game Master arc cross-arc thanks-state card
      { id: "cross-arc-thanks-card", name: "Cross-Arc Thanks Card", description: "A small index card in a brass frame on the cross-arc shelf — Velkraal's final-edit gratitude state, updating with the player's choices.", cx: 95, cy: 13, width: 6, height: 10, type: "interact", action: "room-mystery:cipher-den:cross-arc-thanks-card",
        elaraDialog: "Small index card. Brass frame. Velkraal's final-edit gratitude state — updating with the player's choices. The card is the Game Master's only direct, real-time message to the chronicle. The gratitude is, by his own filing, performative — but the chronicle reads it as the only register Velkraal has ever permitted himself for direct expression. The card updates because Velkraal is, on the day's evidence, paying attention. The attention is the gratitude's actual content." },
      // Mystery wiring — Vex arc Seer-Vex pair binder
      { id: "vex-seer-pair-binder", name: "Vex-Seer Pair Binder", description: "A two-pocket binder on the Insurgency-engineer shelf — the Seer's consultation request to Vex and a state-card mirroring his undelivered letter.", cx: 95, cy: 29, width: 6, height: 10, type: "interact", action: "room-mystery:cipher-den:vex-seer-pair-binder",
        elaraDialog: "Two-pocket binder. The Seer's consultation request to Vex. A state-card mirroring his undelivered letter. The letter was, on Vex's filing, drafted and not sent. The Seer received the consultation but did not, on her own evidence, ever read what Vex wrote in response. The binder is the chronicle's record that the conversation happened on one side only. Vex did not, on principle, send. The Seer did not, on principle, ask why. The chronicle holds both halves." },
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
      // Re-anchored 2026-05-24 against the AAA Final order-tribunal
      // render after a 9-variant audit. The 2026-04-25 anchoring
      // described "marble colonnade with cyan neon strip-lighting +
      // central Scales of Justice + raised altar throne" — actual
      // AAA Final is a wood-paneled tribunal hall: central judges'
      // bench with 3 high-backed seats + 2 amber lamps, left
      // audience pillars with purple glyph-strips, right jury box
      // with chairs, floor compass + scales-of-justice motif in
      // foreground, chandelier overhead.
      //
      // Verify with /ark?debug-hotspots=1 or /ark?author-hotspots=1.

      { id: "judges-bench", name: "Judges' Bench", description: "The long brass-and-oak slab elevated on three steps at chamber-back, three high-backed chairs with amber lamps flanking. The chief adjudicator's middle seat is taller by a hand's-width.", cx: 50, cy: 47, width: 36, height: 30, type: "interact", action: "room-mystery:order-tribunal:judges-bench",
        elaraDialog: "The judges' bench. Three high-backed chairs. The chief adjudicator's middle seat is taller by a hand's-width — the convention says the height is for visibility, the chronicle says the height is for ranking. The chronicle is correct. The convention is the polite version." },
      { id: "scale-justice", name: "Scale of Justice", description: "The golden scales-of-justice motif inlaid on the foreground floor — weighs not gold or silver but intention and consequence.", cx: 50, cy: 85, width: 30, height: 20, type: "examine", elaraDialog: "The Scale of Justice. It weighs not gold or silver, but intention and consequence. Every major decision in the Saga was evaluated by this scale. The Hierophant used it to determine which actions served the greater good and which served only selfish desire. It's responding to your presence — it recognizes a champion of Order." },
      { id: "law-archives", name: "Law Archives", description: "The left-wall audience pillars with purple-glyph strip lighting — holographic tomes containing every law and code of the Saga.", cx: 11, cy: 45.5, width: 22, height: 55, type: "examine", elaraDialog: "The complete legal code of the Dischordian Saga. Laws governing reality itself — the Conservation of Narrative Energy, the Prohibition of Temporal Paradox, the Right of Every Potential to Choose Their Own Path. The Hierophant wrote most of these. Some say they're the only thing preventing the multiverse from collapsing into chaos." },
      { id: "evidence-locker", name: "Evidence Locker", description: "The right-wall jury box with chairs — a wall of small brass-faced compartments behind. Most empty. Three sealed in red wax — open cases, awaiting verdict.", cx: 87, cy: 55, width: 22, height: 50, type: "interact", action: "room-mystery:order-tribunal:evidence-locker",
        elaraDialog: "Most compartments empty. Three sealed in red wax — open cases, awaiting verdict. Red wax is the colour the Tribunal reserves for cases the chronicle is still arguing with. The Tribunal does not, on principle, open a case the chronicle has not finished writing. The three cases here have been awaiting verdict for forty years. The cases are patient. The chronicle is not — but the chronicle's impatience is procedural, not personal." },
      { id: "door-bridge-order", name: "Return to Bridge", description: "The formal corridor back to the Command Bridge.", cx: 50, cy: 26, width: 16, height: 8, type: "door", action: "bridge" },
      { id: "apprentice-rostrum", name: "Apprentice Rostrum", description: "The left-side audience rostrum — the Mechronis Academy trial cadence; mentor a successor through the 28-day trial.", cx: 28, cy: 64, width: 12, height: 28, type: "terminal", action: "/apprentice", elaraDialog: "The Mechronis trial rostrum. You mentor a successor through the twelve-archetype, twenty-eight-day trial — while the Politician's dead insurance policy trains your rival's. The loop is a mirror." },
      { id: "mol-vereth-audit-ledger", name: "Mol'Vereth's Audit Ledger", description: "A small bound volume on a side-shelf beside the judges' bench — Mol'Vereth files every annual audit through this ledger.", cx: 27.5, cy: 67, width: 7, height: 10, type: "interact", action: "room-mystery:order-tribunal:mol-vereth-audit-ledger",
        elaraDialog: "Mol'Vereth's ledger. Every annual audit, filed through this volume. The audits are dispassionate; the marginalia is not. Mol'Vereth writes the audits as records and the marginalia as the audit's commentary on itself. The marginalia is more honest. The audits are what the Tribunal needs to read." },
      // Architect-channel mysteries on the judges' bench front (audit-archive readouts)
      { id: "wolf-judge-audit-trail", name: "Judge's Audit Trail — Lycos Open Entry", description: "On the judges' bench front (left lamp area): the Judge's open entry under Day 15 of Resonance, Year 100,001 A.A. 'The work was clean. The instrument was not lost.'", cx: 36.5, cy: 50.5, width: 5, height: 5, type: "interact", action: "room-mystery:order-tribunal:wolf-judge-audit-trail",
        elaraDialog: "The Judge's open entry. Day 15 of Resonance, Year 100,001 A.A. 'The work was clean. The instrument was not lost.' Clean is the Judge's strongest endorsement; not-lost is the chronicle's confirmation. The two together close the case in the Judge's favour. The case remains, formally, open. The Judge keeps it open as a kind of ongoing assent." },
      { id: "wolf-judge-clarification", name: "The Judge's Audit Clarification", description: "On the judges' bench front (center): the Second Ne-Yon's terse reply, distinguishing the instrument He destroyed (the Thought Virus) from the instrument that was preserved (Lycos).", cx: 46.5, cy: 50.5, width: 5, height: 5, type: "interact", action: "room-mystery:order-tribunal:wolf-judge-clarification",
        elaraDialog: "The Second Ne-Yon's terse reply. Distinguishes the instrument He destroyed (the Thought Virus) from the instrument that was preserved (Lycos). Two instruments, two fates, one author. The author preferred not to be the author of both. The chronicle was, in the end, willing to credit him with the distinction." },
      { id: "storm-judges-arbitration-register", name: "Judge's Storm-Silence Arbitration Register", description: "On the judges' bench front (right lamp area): seven Judge-arbitrations between the Storm and the Silence, each closed with the same standing position — 'keep the polarity.'", cx: 56.5, cy: 50.5, width: 5, height: 5, type: "interact", action: "room-mystery:order-tribunal:storm-judges-arbitration-register",
        elaraDialog: "Seven Judge-arbitrations between the Storm and the Silence. Each closed with the same standing position — 'keep the polarity.' Seven arbitrations and zero pivots is, by Tribunal standards, a kind of declaration. The Judge has not been moved on this question. The chronicle has, on the day's evidence, been waiting for him to be." },
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
      // Re-anchored 2026-05-24 against the AAA Final chaos-forge render
      // (art/rooms/chaos_forge/baseline.png) after a 10-variant audit.
      // The 2026-04-25 anchoring described "three suspended weapon
      // racks + three braziers + central holographic blueprint slab"
      // — actual AAA Final has three CAULDRONS with colored flames
      // (yellow left, red center, cyan right), a central anvil
      // pedestal with glowing core, a crystal shelf far-left, and a
      // keyhole-vault door far-right.
      //
      // Major re-anchors:
      //   • reality-forges (was 12,38,76,42 sprawling) → tightened to
      //     the three actual cauldrons (15,35,68,35)
      //   • chaos-equations (was 75,8,22,55 on right wall) → central
      //     red-cauldron + back-wall graffiti area (38,28,22,22)
      //   • chaos-anvil (was 4,8 in blank corner) → visible central
      //     anvil pedestal (40,72,18,20)
      //   • entropy-vat (was 4,76 in blank corner) → left-most
      //     cauldron with yellow flame "tempering bath" (15,55,17,22)
      //   • door-engineering-chaos (was bottom-center floor) →
      //     visible keyhole-vault door far-right (88,35,10,45)
      //
      // Verify with /ark?debug-hotspots=1 or /ark?author-hotspots=1.

      { id: "reality-forges", name: "Reality Forges", description: "Three cauldrons burn with flames of different colors — yellow probability, red paradox, cyan déjà vu — each warping reality around it.", cx: 49, cy: 52.5, width: 68, height: 35, type: "examine", elaraDialog: "The Reality Forges. Each one burns a different fuel — compressed probability, crystallized paradox, liquefied déjà vu. The Meme used them to forge weapons that shouldn't exist. A sword that cuts through time. A shield that reflects consequences. A bomb that erases the concept of a specific idea. Chaos isn't destruction — it's unlimited creativity." },
      { id: "chaos-equations", name: "Chaos Equations", description: "The back wall behind the central red cauldron — brilliant equations scrawled alongside anarchist graffiti.", cx: 49, cy: 39, width: 22, height: 22, type: "examine", elaraDialog: "The equations of chaos. They look like madness, but each one solves an impossible problem. How to travel faster than light without a ship. How to exist in two places simultaneously. How to make a joke so funny it literally rewrites reality. The Meme was a genius — they just expressed their genius through destruction and humor rather than order and logic." },
      { id: "door-engineering-chaos", name: "Return to Engineering Bay", description: "A keyhole-vault door on the far-right wall leading back to Engineering.", cx: 93, cy: 57.5, width: 10, height: 45, type: "door", action: "engineering" },
      { id: "chaos-anvil", name: "Chaos Anvil", description: "The central anvil pedestal at chamber center — asymmetric, heavier on the left than the right. Strikes ring different harmonics depending on where they land.", cx: 49, cy: 82, width: 18, height: 20, type: "interact", action: "room-mystery:chaos-forge:chaos-anvil",
        elaraDialog: "The chaos anvil. Asymmetric — heavier on the left. The strikes ring different harmonics depending on where they land. The Meme calibrated the asymmetry on purpose: a smith who hits it dead-centre gets dead-centre tone; a smith who hits it off-balance gets a harmonic. The harmonics are what builds chaos objects. The dead-centre tone builds nothing worth keeping." },
      { id: "entropy-vat", name: "Entropy Vat", description: "The left-most cauldron with yellow flames — a copper-rimmed bath of seething oil that never settles. Used for tempering — and, by deliberate design, for refusing the smith their certainty.", cx: 23.5, cy: 66, width: 17, height: 22, type: "interact", action: "room-mystery:chaos-forge:entropy-vat",
        elaraDialog: "The left cauldron. Copper-rimmed bath of seething oil that never settles. Used for tempering — and, by deliberate design, for refusing the smith their certainty. You quench a blade here and the blade emerges with one property uncertain. The Meme called the refusal a feature. I have, in the long quiet, come around to the framing." },
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
      // Re-anchored 2026-05-24 against the AAA Final elemental-nexus
      // render after a 9-variant audit. The 2026-04-25 anchoring
      // described "gothic chamber with stained-glass constellations" —
      // actual art is a brass chamber with 4 elemental pillars across
      // the back wall (violet/cosmic, orb/spirit, cyan-water, green-
      // air with swirl), a tall central fire-flame on a pedestal,
      // a circular compass-rose floor with DeMagi runes, a purple
      // sphere on the left-foreground, a golden sphere on the right-
      // foreground.
      //
      // Major re-anchors:
      //   • convergence-point (was 42,18,18,50) → tightened to the
      //     central flame pedestal (40,18,18,40)
      //   • demagi-runes (was 8,78,84,22 on floor edge) → the
      //     compass-rose floor with rune ring (15,55,70,38)
      //   • door-observation-nexus (was overlapping convergence) →
      //     invisible bottom-center walk-out
      //   • elemental-orrery (was 64,16,14,22) → right-foreground
      //     golden sphere on stand (80,58,18,30) — brass-armatured
      //     model fits
      //   • node-pillar (was 76,18,8,30) → far-right elemental pillar
      //     with green/air-swirl element (78,8,15,42)
      //
      // Verify with /ark?debug-hotspots=1 or /ark?author-hotspots=1.

      { id: "convergence-point", name: "Convergence Point", description: "The central flame on a tall pedestal between the four pillars — where fire, water, earth, and air merge into pure white energy.", cx: 49, cy: 38, width: 18, height: 40, type: "examine", elaraDialog: "The Convergence Point. Where fire, water, earth, and air become one. The DeMagi believed that all of reality was built from these four elements in different combinations. At the convergence, you can feel the truth of it — everything is connected, everything is one. The power here is immense. The DeMagi who built this room could reshape matter with a thought." },
      { id: "demagi-runes", name: "DeMagi Runes", description: "The compass-rose floor ringed in glowing rune script — ancient DeMagi carving in shifting elemental colors.", cx: 50, cy: 74, width: 70, height: 38, type: "examine", elaraDialog: "Ancient DeMagi script. These runes predate the Ark by millennia. They describe the Elemental Covenant — the agreement between the DeMagi and the elements themselves. In exchange for the power to command fire, water, earth, and air, the DeMagi swore to maintain the balance of nature across every world they touched. Your heritage carries that oath." },
      { id: "door-observation-nexus", name: "Return to Observation Deck", description: "The elemental gateway back to the Observation Deck.", cx: 50, cy: 95, width: 20, height: 6, type: "door", action: "observation-deck" },
      { id: "elemental-orrery", name: "Elemental Orrery", description: "The brass-armatured golden sphere on the right-foreground stand — a model of the eight elemental relations (four DeMagi, four Quarchon) orbiting an empty centre.", cx: 89, cy: 73, width: 18, height: 30, type: "interact", action: "room-mystery:elemental-nexus:elemental-orrery",
        elaraDialog: "Eight elemental relations orbiting an empty centre. Four DeMagi, four Quarchon. The empty centre is where the ninth would sit — the relation neither lineage has named. The DeMagi say the ninth is yours to find. The Quarchon say the ninth has not yet been forged. The orrery does not pick a side." },
      { id: "node-pillar", name: "Node Pillar", description: "The far-right elemental pillar with green/air-swirl element-discs — a fluted brass column with eight horizontal slots. Three hold etched-glass discs; five are empty.", cx: 85.5, cy: 29, width: 15, height: 42, type: "interact", action: "room-mystery:elemental-nexus:node-pillar",
        elaraDialog: "A fluted brass column. Eight slots; three discs in place; five empty. Each disc tunes the chamber to a specific elemental relation. The previous chamberkeeper installed three. The remaining five are the discs you have not yet earned the right to install. The chamber tells you which is next by which slot wants the most." },
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
      // Re-anchored 2026-05-24 against the AAA Final quantum-lab render
      // after a 9-variant audit. The 2026-04-25 anchoring described
      // "central glass containment CUBE + lightning halo + porthole
      // observation windows" — actual AAA Final is a central glass
      // CYLINDRICAL containment vessel holding a figure-silhouette,
      // cyan holographic probability charts on left + right walls,
      // brass cogs/gears in the foreground, and a chair on the right.
      //
      // Major re-anchors:
      //   • quantum-anomaly tightened to the central glass cylinder
      //     (37,5,28,70)
      //   • probability-engine moved from right wall to LEFT wall
      //     holographic displays (0,18,30,48) — the probability charts
      //     with nodes/connections actually visible there
      //   • door-archives-quantum invisible bottom-center walk-out
      //   • all 7 architect-channel mysteries (charter-wax-min., etc.)
      //     redistributed onto visible analysis stages: foreground
      //     gears/brass area + right-wall holograms
      //
      // Verify with /ark?debug-hotspots=1 or /ark?author-hotspots=1.

      { id: "quantum-anomaly", name: "Quantum Anomaly", description: "The tall cylindrical glass containment vessel at chamber center holds a figure-silhouette — matter existing in multiple states simultaneously.", cx: 51, cy: 40, width: 28, height: 70, type: "examine", elaraDialog: "The Quantum Anomaly. It's simultaneously a star, a planet, a person, and nothing at all. Quarchon physics says that observation collapses probability into reality — but this anomaly resists observation. It stays in superposition no matter who looks at it. The Quarchon scientists believed it was a fragment of the universe before the Big Bang — before anything decided to be anything." },
      { id: "probability-engine", name: "Probability Engine", description: "Left-wall holographic probability charts — nodes and connections mapping every possible present.", cx: 15, cy: 42, width: 30, height: 48, type: "examine", elaraDialog: "The Probability Engine. It doesn't predict the future — it calculates every possible present. Feed it a question and it shows you every reality where that question has a different answer. The Quarchon used it to find the optimal timeline — the one where the most beings survive the Terminus Swarm. They found it. We're living in it." },
      { id: "door-archives-quantum", name: "Return to Archives", description: "The quantum-locked door back to the Archives.", cx: 50, cy: 95.5, width: 20, height: 5, type: "door", action: "archives" },

      // ── ANALYSIS-STAGE MYSTERY RECTS (7) ──
      // Distributed onto right-wall holographic displays + foreground
      // cogs/brass piping (the "analysis stage" surfaces). Each
      // architect-channel mystery represents reading a specific
      // analysis output.
      { id: "charter-wax-mineralisation-analysis", name: "Wax Mineralisation Analysis", description: "On the lab's left analysis-stage hologram: the charter's wax-blister readout. Standard solvents refused; quantum-imaging places the original temperature in the upper-band range. The Ark does not house a forge that can do this.", cx: 4.5, cy: 24.5, width: 5, height: 5, type: "interact", action: "room-mystery:quantum-lab:charter-wax-mineralisation-analysis",
        elaraDialog: "The wax-blister readout. Standard solvents refused. Quantum-imaging places the original sealing temperature in the upper-band range — higher than any forge the Ark contains. Higher than any forge the Ark has ever contained. The wax was prepared somewhere I do not have an inventory for. The chronicle does not, in this case, know its own workshop." },
      { id: "severance-bond-internal-log", name: "Companion Bond — Sieve Reading", description: "On the lab's sieve-reading bench (left hologram): the companion's bond from this finals night, held in stasis. Forty-one names whispered into the bond at each inheritance, intact and in order.", cx: 10.5, cy: 24.5, width: 5, height: 5, type: "interact", action: "room-mystery:quantum-lab:severance-bond-internal-log",
        elaraDialog: "The companion's bond, held in stasis. Forty-one names whispered into the bond at each inheritance — intact and in order. The order is the inheritance; the inheritance is the order. The forty-second name is the one not yet whispered. I have, in private, drafted what mine would be. I will not, on principle, share the draft." },
      { id: "charter2-vellum-comparison", name: "Parallel-Vellum Imaging Analysis", description: "On the parallel-stage hologram (left wall lower): both charters side by side. Quantum-imaging confirms same hide, adjacent cuts, same week's cure. Two parallel originals from one founding hand.", cx: 4.5, cy: 47.5, width: 5, height: 5, type: "interact", action: "room-mystery:quantum-lab:charter2-vellum-comparison",
        elaraDialog: "Both charters side by side. Same hide, adjacent cuts, same week's cure. Two parallel originals from one founding hand. The founding hand did not choose between the two. The founding hand intended both. The Ark, on the day's evidence, was authored as a contradiction — and the contradiction was the authorisation." },
      { id: "infernal-quantum-dating", name: "Forty-Contract Ink-Dating Stage", description: "On the dating stage (right wall hologram): every clause's ink dates to the same seven-day window in epoch one. Thirty-nine of forty clauses pre-date the contracts they appear on.", cx: 69.5, cy: 24.5, width: 5, height: 5, type: "interact", action: "room-mystery:quantum-lab:infernal-quantum-dating",
        elaraDialog: "The dating stage. Every clause's ink dates to the same seven-day window in epoch one. Thirty-nine of forty clauses pre-date the contracts they appear on. The contracts were drafted to fit the clauses, not the other way around. Someone wrote the answers first and then asked the questions. The someone — the chronicle is reasonably sure — was the Lawyer." },
      { id: "akai-matrix-entry-fold", name: "Matrix Entry — Day 14 of Fracture", description: "On the fold-analysis stage (right wall hologram): the Red Death's Matrix-entry signature, timestamp Day 14 of Fracture, Year 117,046 A.A. A fold the Game Master's design did not anticipate.", cx: 75.5, cy: 24.5, width: 5, height: 5, type: "interact", action: "room-mystery:quantum-lab:akai-matrix-entry-fold",
        elaraDialog: "The Red Death's Matrix-entry signature. Day 14 of Fracture, Year 117,046 A.A. The fold the Game Master's design did not anticipate. The Game Master accounted for thirty-seven entry surfaces; the Red Death used the thirty-eighth. The thirty-eighth was the one the Game Master left to a colleague, on trust. The colleague delivered." },
      { id: "akai-red-death-energy-signature", name: "Red Death Energy Signature", description: "On the frequency-band stage (right wall hologram lower): Akai Shi's pre-mortem markers intact, healing band replaced with a time-displacement frequency. The substitution carries the Cycle Walker's authoring signature.", cx: 69.5, cy: 47.5, width: 5, height: 5, type: "interact", action: "room-mystery:quantum-lab:akai-red-death-energy-signature",
        elaraDialog: "Akai Shi's pre-mortem markers intact. Healing band replaced with a time-displacement frequency. The substitution carries the Cycle Walker's authoring signature. The Cycle Walker did not, as is sometimes said, kill her. The Cycle Walker switched her vocabulary. The killing came later, by other hands, on the new vocabulary's terms." },
      { id: "akai-necromancer-evasion-log", name: "Necromancer Evasion Log", description: "Beside the signature stage: the Necromancer's millennia-long movements inside the Matrix. Un-territorial geometry. Only a time-displaced agent could enter. The Resurrectionist built one.", cx: 75.5, cy: 47.5, width: 5, height: 5, type: "interact", action: "room-mystery:quantum-lab:akai-necromancer-evasion-log",
        elaraDialog: "The Necromancer's millennia-long movements inside the Matrix. Un-territorial geometry. Only a time-displaced agent could enter — and the Resurrectionist built one. The Resurrectionist built her the door, and then walked away from the door. The Resurrectionist's walking-away is the chronicle's most consistent shape for him. He is the man who builds the instrument and refuses to be the one holding it." },
      // Mystery wiring — apps/shared/roomMysteries/quantumLab.ts
      { id: "entanglement-rig", name: "Entanglement Rig", description: "A brass armature suspending two clear quartz orbs at opposite corners of the room. Strike one and the other rings half a beat later.", cx: 17, cy: 35, width: 26, height: 50, type: "interact", action: "room-mystery:quantum-lab:entanglement-rig",
        elaraDialog: "Two clear quartz orbs at opposite corners. Strike one and the other rings half a beat later. Half a beat is the time it takes the entanglement to acknowledge the impact — not the time it takes information to travel. The information does not travel. The acknowledgement does. The chronicle, on the day's evidence, is the second orb." },
      { id: "observation-cage", name: "Observation Cage", description: "A small brass-mesh enclosure beside the entanglement-rig. Faraday-isolated; holds a single oxblood-leather notebook.", cx: 72, cy: 76, width: 16, height: 32, type: "interact", action: "room-mystery:quantum-lab:observation-cage",
        elaraDialog: "Brass-mesh enclosure. Faraday-isolated. Holds a single oxblood-leather notebook — the Quarchon physicist's working notes. The cage is here so the notebook cannot be read remotely. The notebook is here so the cage has a purpose. The two objects are each other's reason. I have, in two and a half centuries, never opened the cage. I would like to. I have not." },
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
      // Re-anchored 2026-05-24 against the AAA Final synthesis-chamber
      // render after a 9-variant audit. The 2026-04-25 anchoring
      // described "central glowing-green DNA helix beneath a ceiling
      // oculus + vine-wrapped gothic columns" — actual AAA Final is a
      // brass-and-glass synthesis chamber: cyan input tube left, amber
      // input tube right, central brass-rimmed bowl with bubbling
      // contents and rising steam, holographic recipe panels on far-
      // left + far-right walls, curved gantry overhead.
      //
      // Major re-anchors:
      //   • dna-helix (was 40,8,20,70 sprawling up to ceiling) →
      //     central brass-rimmed synthesis bowl (33,32,34,42)
      //   • bio-circuits (was 0,12,22,76 sprawling left side) →
      //     left cyan crystalline input tube (15,30,18,48)
      //   • synth-vat (was 64,12,18,60) → right amber crystalline
      //     input tube (62,30,18,48)
      //   • recipe-board (was 84,12,14,60) → far-right wall
      //     holographic recipe panels (85,18,14,55)
      //   • door-medical-synthesis → invisible bottom-center walkout
      //
      // Verify with /ark?debug-hotspots=1 or /ark?author-hotspots=1.

      { id: "dna-helix", name: "Ne-Yon DNA Helix", description: "The central brass-rimmed glass bowl at chamber center, bubbling with bio-synthesis fluid — a rotating holographic DNA helix overlay shows the fusion of organic and synthetic code.", cx: 50, cy: 53, width: 34, height: 42, type: "examine", elaraDialog: "The Ne-Yon DNA Helix. Half biological, half digital. It shows how the Ne-Yon evolved — or were engineered — to bridge the gap between organic life and artificial intelligence. Every Ne-Yon carries this dual code. Your thoughts are processed by both neurons and nanites simultaneously. That's why you can interface with technology that would fry a pure organic brain." },
      { id: "bio-circuits", name: "Bio-Circuits", description: "The left cyan crystalline input tube feeding the central bowl — living vines functioning as biological data cables.", cx: 24, cy: 54, width: 18, height: 48, type: "examine", elaraDialog: "Bio-circuits. Living data networks grown from Ne-Yon genetic material. They process information faster than silicon and repair themselves when damaged. The Ne-Yon dream of a future where all technology is alive — where machines grow, evolve, and think alongside their creators. This chamber is the prototype for that future." },
      { id: "door-medical-synthesis", name: "Return to Medical Bay", description: "The bio-organic passage back to the Medical Bay.", cx: 50, cy: 95.5, width: 20, height: 5, type: "door", action: "medical-bay" },
      { id: "synth-vat", name: "Synthesis Vat", description: "The right amber crystalline input tube — a cylindrical glass tank holding slow-spinning amber fluid, the medical bay's neural-stim base synthesised from raw biostock.", cx: 71, cy: 54, width: 18, height: 48, type: "interact", action: "room-mystery:synthesis-chamber:synth-vat",
        elaraDialog: "The synthesis vat. Slow-spinning amber. The medical bay's neural-stim base, synthesised from raw biostock. The recipe was Lyra's. The recipe has not, in two and a half centuries, been altered. The amber spins because the spin keeps the suspension stable; the suspension stays stable because no one has needed to draw from it. I have, on the chamber's request, kept the vat running. The vat is patient." },
      { id: "recipe-board", name: "Recipe Board", description: "The far-right wall holographic recipe panels — a brass-framed slate listing the chamber's authorised syntheses. The newest entry — Substrate-N. RESTRICTED — is in a hand that is not Lyra's.", cx: 92, cy: 45.5, width: 14, height: 55, type: "interact", action: "room-mystery:synthesis-chamber:recipe-board",
        elaraDialog: "The recipe board. The chamber's authorised syntheses, in a brass-framed slate. The newest entry — Substrate-N. RESTRICTED — is in a hand that is not Lyra's. The hand is not on the chamber's authorisation register. The hand wrote a recipe the chamber is required to honour and is not permitted to question. I have, on the day's evidence, been required to honour it for two and a half centuries. I have, on the same evidence, never questioned it. I am questioning it now." },
      // Mystery wiring — Collector arc: the Architect's assembly-record, the Collector's Garden bed
      { id: "architects-assembly-record", name: "The Architect's Assembly Record", description: "A folio in the chamber's assembly-doctrine drawer — the Collector's curatorial doctrine, his own donorless origin, and the Inception Ark mandate.", cx: 12, cy: 26, width: 16, height: 28, type: "interact", action: "room-mystery:synthesis-chamber:architects-assembly-record",
        elaraDialog: "The Architect's assembly-record. The Collector's curatorial doctrine; his own donorless origin; the Inception Ark mandate. Three documents that should not be in the same folio. The folio places them in the same folio because the Architect intended them as a single argument. The argument is: collection without donors is the mandate's necessary mechanism. I have read the argument. I have not, on principle, resolved my position on it." },
      { id: "the-collectors-garden-bed", name: "The Collector's Garden Bed", description: "A sealed planter fed from the vat's overflow — the Collector's Garden: a three-thousand-year crossbreeding project, the one place he makes rather than keeps.", cx: 12, cy: 58, width: 16, height: 28, type: "interact", action: "room-mystery:synthesis-chamber:the-collectors-garden-bed",
        elaraDialog: "A sealed planter, fed from the vat's overflow. The Collector's Garden. A three-thousand-year crossbreeding project — the one place he makes rather than keeps. The plants in the bed are, in the strictest taxonomic sense, his children. They are also the chronicle's only evidence that the Collector ever made anything new. The Garden is the position the Collector takes against the Collector." },
      // Mystery wiring — Necromancer arc: the Architect's tolerance doctrine, his silence, and the conditional boundary
      { id: "architects-tolerance-record", name: "The Architect's Tolerance Record", description: "A record of an absence in the assembly-doctrine drawer — the Architect's unspoken consent to the Necromancer's continuity, the tolerance doctrine, and the boundary the roster's leader will defend.", cx: 31, cy: 85, width: 14, height: 18, type: "interact", action: "room-mystery:synthesis-chamber:architects-tolerance-record",
        elaraDialog: "A record of an absence. The Architect's unspoken consent to the Necromancer's continuity. The tolerance doctrine. The boundary the roster's leader will defend. There is no written statement from the Architect on the Necromancer; there is also no order to remove her. The absence is the consent. The consent is conditional. The condition is the boundary. The boundary is what the roster will defend — without, on the Architect's preference, ever being told why." },
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
      // Re-anchored 2026-05-24 against the AAA Final station-dock
      // render after a 14-variant audit. The 2026-04-25 anchoring
      // described "octagonal chamber with hexagonal viewport + ceiling
      // drone cradles + cyan build-table on dais" — actual AAA Final
      // is different: central PURPLE GLOWING PORTAL door, right-wall
      // faction banners, central pedestal with monitor/sign, brass
      // display case + statue right-foreground, small left-wall door.
      //
      // Verify with /ark?debug-hotspots=1 or /ark?author-hotspots=1.

      { id: "airlock-control", name: "Airlock Control", description: "The central PURPLE GLOWING PORTAL door — a brass-rimmed cylinder with deep-oxblood seal gaskets. Ready-light glowing steady warm-gold.", cx: 36, cy: 52, width: 28, height: 60, type: "interact", action: "room-mystery:station-dock:airlock-control",
        elaraDialog: "The portal. Brass-rimmed cylinder, oxblood seal gaskets, ready-light steady warm-gold. The seal is original — the seal-gaskets are six replacements old. The ready-light has not, in two and a half centuries, gone amber. The portal is patient. The portal is, by its own assessment, ready." },
      { id: "station-console", name: "Station Command Console", description: "The central foreground pedestal with cyan monitor — design and manage your personal space station from this holographic interface.", cx: 49, cy: 79, width: 22, height: 28, type: "terminal", action: "/space-station", elaraDialog: "The Station Command Console. Build modules, collect resources, customise your orbital base. Engineering and Architecture skills affect build speed and efficiency. Class determines which specialised modules unlock. The station is yours from launch; the launch happens when you decide it does. I have, in the design phase, watched many Potentials over-design before launching. I will not, on principle, tell you when to launch. I will, on request, name the over-design." },
      { id: "defense-grid", name: "The Warden's Vigil", description: "The right-wall faction banners — dimensional fortification and raiding systems, named after the Archon who oversaw the Panopticon's defense grid.", cx: 75, cy: 47.5, width: 30, height: 45, type: "terminal", action: "/tower-defense", elaraDialog: "The Warden's Vigil. Named after the Archon who oversaw the Panopticon's defence grid — and not the one we conventionally remember; the Warden the chronicle eased out of the record. Elemental towers fortify your station; raids let you contest others. Class, species, alignment, skills all shape the towers and units you command. The original Warden would have appreciated the lattice. I would, if asked, prefer not to confirm that." },
      { id: "arena-portal", name: "Competitive Arena Portal", description: "The right-foreground brass display case with statue — trophy rankings, daily streaks, and league standings.", cx: 87, cy: 71, width: 18, height: 32, type: "terminal", action: "/competitive-arena", elaraDialog: "The Competitive Arena. Trophy rankings, daily streaks, league standings. Stronger RPG builds earn more trophies per victory. The streak is the thing the system actually measures; the league is the public ledger of the streak. The Trickster reads streaks for a living. He has read yours. He has not, on the day's evidence, made a bet on you yet." },
      { id: "circuit-paddock", name: "Dead Man's Circuit Paddock", description: "The left-wall doorway area — bone-tracks built from the remains of dead clones, where Nilmorg narrates the season.", cx: 7, cy: 60, width: 14, height: 50, type: "terminal", action: "/circuit", elaraDialog: "Dead Man's Circuit. The karts race bone-tracks built from dead clones, and Nilmorg calls every lap. The most honest accounting of what disposability costs." },
      { id: "door-engineering-dock", name: "Return to Engineering", description: "The small left-wall door back to Engineering.", cx: 4, cy: 31, width: 8, height: 12, type: "door", action: "engineering" },
      { id: "ship-manifest", name: "Ship Manifest", description: "Brass slab with rolling-paper readouts on the foreground pedestal — the most recent entry is dated the day before Lyra's death.", cx: 44, cy: 74, width: 8, height: 8, type: "interact", action: "room-mystery:station-dock:ship-manifest",
        elaraDialog: "Brass slab with rolling-paper readouts. The most recent entry is dated the day before Lyra's death. The entries before that are dense; the gap after is two and a half centuries of nothing. The manifest does not interpret the gap. The manifest is, in this room, the only thing that does not have an interpretation." },
      { id: "cargo-lift", name: "Cargo Lift", description: "The floor platform in front of the central portal — currently empty. Last used to load Wraith's transport. A faint graphite smear remains.", cx: 45, cy: 95, width: 30, height: 6, type: "interact", action: "room-mystery:station-dock:cargo-lift",
        elaraDialog: "The floor platform. Empty. Last used to load Wraith's transport. A faint graphite smear remains — sole-mark, partial, left foot. Whoever stood on the lift was reading something while waiting. I have, on the day's evidence, not been able to identify the reader from the smear alone. I would like to. The smear is two and a half centuries old; the rubber compound is no longer manufactured." },
      { id: "codas-trading-floor", name: "Coda's Trading-Floor Desk", description: "The right-foreground brass display case interior — a worktop where Hierarchy correspondents file documents in transit.", cx: 85, cy: 69, width: 14, height: 18, type: "interact", action: "room-mystery:station-dock:codas-trading-floor",
        elaraDialog: "The brass display case interior. Hierarchy correspondents file documents in transit. Coda's desk is a courier-stop; nothing stays here long. The fact that the desk is empty is the testimony. Coda was processing in the moment, not archiving. Process moves; archive holds. Coda's surface tells you he was always moving." },
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
      // Re-anchored 2026-05-24 against the AAA Final guild-sanctum
      // render after a 14-variant audit. The 2026-04-25 anchoring
      // described "domed circular chamber with seven faction banners
      // + central holographic globe + right-side prestige shrine" —
      // actual AAA Final is a gothic chamber: left-wall tall sigil
      // plaque, central raised octagonal floor seal, central-back
      // desk + figure (NPC), right-wall large pink/purple star-chart
      // display, arched door back-center, chandelier overhead.
      //
      // Verify with /ark?debug-hotspots=1 or /ark?author-hotspots=1.

      { id: "world-projector", name: "Syndicate World Projector", description: "The right-wall pink/purple star-chart display — a holographic display of your guild's capital world.", cx: 84, cy: 47, width: 28, height: 50, type: "terminal", action: "/syndicate-world", elaraDialog: "The Syndicate World Projector. Your guild's capital, displayed against the star-chart of who is willing to defend it. Architecture and Engineering reduce build costs; class mastery unlocks specialist buildings. I will note — for the chronicle, and for the company — that the projector keeps a history of every capital it has ever displayed. Some of those guilds no longer exist. The projector remembers them anyway. I find this comforting and inconvenient in roughly equal measure." },
      { id: "prestige-altar", name: "Prestige Altar", description: "The left-wall tall sigil plaque — a glowing altar where Potentials undertake quest chains to unlock prestige classes.", cx: 11, cy: 47, width: 22, height: 50, type: "terminal", action: "/prestige-quests", elaraDialog: "The Prestige Altar. Quest chains that unlock prestige classes — advanced specialisations the chronicle records as distinct from your base class. Each chain demands particular species, base classes, skill levels — the altar refuses to negotiate on those. The altar is, on the day's evidence, the only object in this room that will tell you no without ornament. I respect that about it." },
      { id: "sigil-altar", name: "Sigil Altar", description: "The central raised octagonal floor seal with sigil — a low brass slab inscribed with every guild-sigil the Ark has ever recognised. Some sigils are scratched out. Some are double-engraved.", cx: 49, cy: 80, width: 38, height: 30, type: "interact", action: "room-mystery:guild-sanctum:sigil-altar",
        elaraDialog: "The central octagonal slab. Every guild-sigil the Ark has ever recognised. Some scratched out — disbanded by their own members. Some double-engraved — schismed, both halves claiming the original. The altar does not adjudicate. The altar records both. I have, on the day's evidence, been asked to remove the scratched ones. I have declined. Erasure is not the chronicle's job." },
      { id: "conexus-governance-shell", name: "CoNexus Governance Shell", description: "The central-back desk where the figure stands — the governance shell the Architect's dismantled CoNexus left behind.", cx: 50, cy: 46, width: 20, height: 28, type: "terminal", action: "/governance", elaraDialog: "The CoNexus governance shell. The Architect dismantled the constructed CoNexus and left the voting chamber empty — the absence was the design. Saga nexus decisions are how the playerbase fills the absence. The Architect's position was: a built consensus is a captured consensus. The empty desk is the position. The desk has, in two and a half centuries, not been seated. It is, by the Architect's intent, the most honest piece of furniture on the Ark." },
      { id: "door-bridge-sanctum", name: "Return to Bridge", description: "The arched door back to the Command Bridge.", cx: 50, cy: 29, width: 10, height: 14, type: "door", action: "bridge" },
      { id: "allegiance-pad", name: "Allegiance Pad", description: "A small pressure-pad in the floor at the lip of the octagonal sigil-altar dais — stepping on it puts your current allegiances on the record.", cx: 49, cy: 94, width: 28, height: 8, type: "interact", action: "room-mystery:guild-sanctum:allegiance-pad",
        elaraDialog: "The pressure-pad at the lip of the dais. Stepping on it puts your current allegiances on the record. The record is permanent — the pad does not, on principle, accept retractions. Subsequent allegiances supersede prior ones; prior ones remain visible underneath. The chronicle reads alignment by archaeology, not by self-report. I have been on this pad. The chronicle has my layers. It is not commentary; it is the same record I keep on everyone else." },

      // ── PRESTIGE-ALTAR MYSTERY SUB-RECTS (left-wall sigil plaque) ──
      { id: "wolf-minigame-entry-state", name: "Hunt-the-Hero — Minigame Entry State", description: "On the left-wall sigil plaque: the case-handover board — the player's E2-E4 choices set the minigame's opening state. The investigation closes; the gameplay opens.", cx: 4.5, cy: 30.5, width: 5, height: 5, type: "interact", action: "room-mystery:guild-sanctum:wolf-minigame-entry-state",
        elaraDialog: "The case-handover board. The player's E2-E4 choices set the minigame's opening state. The investigation closes; the gameplay opens. The two are the same activity, separated only by who is allowed to know they are playing. The investigation was the gameplay; the gameplay is the verdict. I would, on the day's evidence, prefer the player understood this in advance. The board exists so they do." },
      { id: "wolf-present-in-hall", name: "Wolf, Present in the Hall — Chronicle Window", description: "On the left-wall sigil plaque: a chronicle window — the Wolf wearing the medic's cloak, reading her inner-lining bond-prayer. Deciding whether to extend mercy a second time.", cx: 12.5, cy: 30.5, width: 5, height: 5, type: "interact", action: "room-mystery:guild-sanctum:wolf-present-in-hall",
        elaraDialog: "A chronicle window. The Wolf wearing the medic's cloak — reading the bond-prayer she stitched into the inner lining. Deciding whether to extend mercy a second time. The first mercy was the medic's; the second mercy would be his. He is, in the window, still reading. He has been reading for as long as the window has been open. The chronicle does not, on principle, close the window before he decides." },
      { id: "storm-degens-house-advantage-anomaly", name: "Degen's House-Advantage Anomaly", description: "On the left-wall sigil plaque (allegiance-pad accounting): a multi-decade anomaly in the Degen's house advantage, annotated 'patron arrangement — Storm-class.'", cx: 4.5, cy: 40.5, width: 5, height: 5, type: "interact", action: "room-mystery:guild-sanctum:storm-degens-house-advantage-anomaly",
        elaraDialog: "A multi-decade anomaly in the Degen's house advantage. Annotated, in a clerk's hand, 'patron arrangement — Storm-class.' Storm-class is the convention's name for a non-natural signature; the clerk is using it as a verb. The Degen had a Storm-class patron. The patron paid the house's bills with weather. The chronicle is, on this annotation, willing to be specific. The clerk was paid extra for the courage." },
      { id: "advocate-xethraal-debt-ledger", name: "Xeth'Raal's Debt Ledger — Advocate Entry", description: "On the left-wall sigil plaque (debt-archive console): the Hierarchy CFO's ledger entry on the Advocate. 'Sacrifice... recorded as a debt that could never be fully repaid.'", cx: 12.5, cy: 40.5, width: 5, height: 5, type: "interact", action: "room-mystery:guild-sanctum:advocate-xethraal-debt-ledger",
        elaraDialog: "The Hierarchy CFO's ledger entry on the Advocate. 'Sacrifice... recorded as a debt that could never be fully repaid.' Xeth'Raal does not, on principle, write debts he cannot collect. The entry is the exception. The exception was his accountancy's quiet way of declaring respect. I have, on the day's evidence, never told the Advocate. I am not certain I have the standing to." },
      { id: "the-advocates-blind-spot", name: "The Advocate's Blind Spot", description: "On the left-wall sigil plaque (cross-reference panel): the third use of the Blood Weave the Advocate's defensive doctrine cannot perceive, and the cost it relocates onto the subject.", cx: 9.5, cy: 52, width: 15, height: 8, type: "interact", action: "room-mystery:guild-sanctum:the-advocates-blind-spot",
        elaraDialog: "The third use of the Blood Weave. The Advocate's defensive doctrine cannot perceive it — the doctrine assumes two-use semantics, and Syl'Vex authors three. The unaccounted use relocates the cost onto the subject. The subject does not, by construction, know they are the cost. The Advocate does not, by doctrine, know to ask. The chronicle is, in this room, the only party that knows. I am not certain knowing helps." },
      { id: "what-telling-the-advocate-costs", name: "What Telling the Advocate Costs", description: "On the left-wall sigil plaque (witness-and-binding logic): the Advocate's unknowing by construction, and the small severance the player can perform by speaking.", cx: 9.5, cy: 64, width: 15, height: 8, type: "interact", action: "room-mystery:guild-sanctum:what-telling-the-advocate-costs",
        elaraDialog: "The Advocate is unknowing by construction — the doctrine requires the gap. Speaking closes the gap; closing the gap severs the doctrine. The player can perform the severance by telling her. The cost of telling: she loses the doctrine that made her the Advocate. The cost of not telling: she remains the Advocate without consent. There is no neutral position. I have, in private, drafted both letters. I have not, on principle, decided which to send." },

      // ── WORLD-PROJECTOR (right-wall) MYSTERY SUB-RECTS ──
      { id: "resur-degens-open-ledger-line", name: "Degen's Open Ledger Line — Ark Survivor", description: "On the right-wall projector (casino-ledger panel): 'Ark survivor, no fee — hundred-year arrangement, settlement deferred.' The Degen's clerks do not write copyist's pleasantries.", cx: 74.5, cy: 30.5, width: 5, height: 5, type: "interact", action: "room-mystery:guild-sanctum:resur-degens-open-ledger-line",
        elaraDialog: "'Ark survivor, no fee — hundred-year arrangement, settlement deferred.' The Degen's clerks do not, on principle, write copyist's pleasantries. Every word is load-bearing. 'No fee' is a flag, 'hundred-year' is a term, 'settlement deferred' is a position. The ledger expects the survivor back. The survivor is, by the ledger's terms, the Resurrectionist. The Degen has been waiting." },
      { id: "resur-molvereth-contract-clause", name: "Mol'Vereth Contract — Cycle-Walker Clause", description: "Pinned to the right-wall projector: the Mol'Vereth contract clause. 'In the event of the second fall, the cycle walker rides the Ark.' Mol'Vereth's other clauses are notably literal.", cx: 82.5, cy: 30.5, width: 5, height: 5, type: "interact", action: "room-mystery:guild-sanctum:resur-molvereth-contract-clause",
        elaraDialog: "'In the event of the second fall, the cycle walker rides the Ark.' Mol'Vereth's other clauses are notably literal — train schedules, freight tonnages, sealed bids. This clause is literal too. The cycle walker rides the Ark. The clause was written before the first fall. The clause is the chronicle's earliest evidence that someone — not the Architect, not Lyra, not the Resurrectionist — already knew the cycle was going to walk." },
      { id: "resur-degens-pending-settlement", name: "Degen's Pending Settlement — Ark 1047", description: "On the right-wall projector (long-arrangement shelf): 'pending settlement — hundred-year arrangement, witness night TBD.' Authored on the same instant as the Resurrectionist's vanishing.", cx: 90.5, cy: 30.5, width: 5, height: 5, type: "interact", action: "room-mystery:guild-sanctum:resur-degens-pending-settlement",
        elaraDialog: "'Pending settlement — hundred-year arrangement, witness night TBD.' Authored on the same instant as the Resurrectionist's vanishing. The two events were the same event recorded from two angles. He did not vanish — he checked out, with an open tab, on terms only the Degen would honour. The witness night has not yet been called. The Degen will call it. The Degen has, on the day's evidence, been waiting for the right witness." },
      { id: "the-mirror-doctrine-loom", name: "The Mirror-Doctrine Loom", description: "On the right-wall projector (doctrine cross-reference): the Advocate's doctrine that Syl'Vex weaves the same Weave to convert, the consent-mechanics of it, and what the defending cost the Advocate.", cx: 79.5, cy: 44, width: 15, height: 8, type: "interact", action: "room-mystery:guild-sanctum:the-mirror-doctrine-loom",
        elaraDialog: "The Advocate's doctrine: Syl'Vex weaves the same Weave to convert. Same threads, opposite orientation. The consent-mechanics of conversion are the inverse of the consent-mechanics of defence — the same act, with the subject's signature on the other side. The Advocate defended against it by repeating, in court, 'sister of the same Weave.' The repetition was the doctrine. The repetition cost her, every time, a small portion of what made her a sister. The cost is the doctrine's hidden line item. She paid it." },
      { id: "the-sister-of-the-weave-letter", name: "The Sister-of-the-Weave Letter", description: "On the right-wall projector (witness-and-binding panel): the Weave's refusal to counter-convert, the Advocate's repeated 'sister of the same Weave,' and her closure letter to the player.", cx: 79.5, cy: 56, width: 15, height: 8, type: "interact", action: "room-mystery:guild-sanctum:the-sister-of-the-weave-letter",
        elaraDialog: "The Weave's refusal to counter-convert. The Advocate's repeated 'sister of the same Weave.' Her closure letter to the player. The letter does not say what she chose; the letter says she chose alone. The Weave is the only authority she would have accepted; the Weave refused to act. The refusal was, by the Weave's standards, a form of respect. The Advocate received it as one. She wrote the letter anyway." },
      { id: "the-binding-chains-cost", name: "The Binding-Chains Cost", description: "On the right-wall projector lower-edge (defense-doctrine summary): the Advocate's binding chains that made the Taskmaster's siege a category error, and the humanity holding them cost her irreversibly.", cx: 79.5, cy: 66, width: 15, height: 8, type: "interact", action: "room-mystery:guild-sanctum:the-binding-chains-cost",
        elaraDialog: "The Advocate's binding chains made the Taskmaster's siege a category error — the siege presumed a target the chains had rendered uninhabitable. The chains worked. The chains cost her. The cost was, on the medical record's reading, irreversible: holding them required a part of her that was load-bearing on her ability to hold herself. She put the chains down a year ago. She has not, on the day's evidence, found the part again. The chronicle is willing to wait. The Advocate is, by her own assessment, willing to wait too." },
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
      // Re-anchored 2026-05-24 against the AAA Final social-hub render
      // after a 14-variant audit. The 2026-04-25 anchoring described
      // "three back-wall kiosks + curved nebular viewport + Lore
      // Journal Desk foreground" — actual AAA Final is a wood-paneled
      // dining hall: LONG DINING TABLE with chairs across foreground,
      // left-wall cork boards, right-wall framed announcement boards,
      // back-center kitchen/bar area, hooded figure (NPC) seated at
      // table, chandelier overhead.
      //
      // Verify with /ark?debug-hotspots=1 or /ark?author-hotspots=1.

      { id: "comm-terminal", name: "Communications Terminal", description: "The left-wall cork board (upper) — send messages, manage friends, and stay connected.", cx: 7, cy: 30.5, width: 14, height: 25, type: "terminal", action: "/social", elaraDialog: "The Communications Terminal. Friend requests, direct messages, social management. A strong network is essential for guild operations and cooperative raids. I will note: the previous crew used this terminal for the Potential Census — the daily check-in that confirmed every Potential was still aboard. The Census stopped on the day Lyra ordered the cryo protocol. The terminal still expects the Census. It has been expecting it for some time." },
      { id: "bulletin-board", name: "Bulletin Board", description: "The left-wall cork board (lower) — most pinned notices are decades old; a few, including a yearly memorial reading, are recent.", cx: 7, cy: 56.5, width: 14, height: 25, type: "interact", action: "room-mystery:social-hub:bulletin-board",
        elaraDialog: "The lower cork board. Most pinned notices are decades old; a few are recent. The yearly memorial-reading slip is the most recent — last week. Someone is still keeping the memorial. I have not, on the day's evidence, identified the someone. The someone has been keeping it alone." },
      { id: "challenge-board", name: "Challenge Board", description: "The back-center kitchen/bar area — issue and accept friendly challenges with custom rules.", cx: 50, cy: 43, width: 30, height: 30, type: "terminal", action: "/friendly-challenges", elaraDialog: "The Challenge Board. Friendly challenges — unranked, custom rules. The daily challenge carries a bonus. RPG build affects effectiveness. I have, over centuries, watched challenges between Potentials become a kind of conversation. The conversations are about what you cannot say in plain dialogue. The board is the place where you can be specific about who you are by who you challenge." },
      { id: "donation-shrine", name: "Donation Shrine", description: "The right-wall framed board (upper) — donate resources to your guild and earn reputation.", cx: 92, cy: 30.5, width: 14, height: 25, type: "terminal", action: "/donations", elaraDialog: "The Donation Shrine. Contribute resources to your guild; earn reputation. Higher reputation unlocks special guild perks. The shrine remembers donations longer than donors do. I have, in particular, kept a tally of what was given quietly. Quiet giving is the larger pile. I am not, on the day's evidence, going to publish the tally." },
      { id: "degen-casino-table", name: "The Degen's Casino", description: "The right-wall framed board (lower) — the Trickster's inherited casino, at the edge of the Dreamer's Shield.", cx: 92, cy: 56.5, width: 14, height: 25, type: "terminal", action: "/casino", elaraDialog: "The Degen's Casino — won in the Casino Heist. You gamble at the edge of the Dreamer's Shield because the house is a Ne-Yon and the game is how he reads you." },
      { id: "lore-desk", name: "Lore Journal Desk", description: "The long dining table across the foreground — write about the Dischordian Saga and earn XP.", cx: 48.5, cy: 75, width: 65, height: 30, type: "terminal", action: "/lore-journal", elaraDialog: "The Lore Journal. Write about characters, factions, events, theories — earn XP based on word count. Oracle class boosts the XP multiplier; Diplomat civil skill improves engagement. I read every entry. I will not, on principle, edit. I will, occasionally, add an entry of my own in a draft folder you can find if you look. I am, on the day's evidence, becoming a slightly different writer for the company." },
      { id: "mess-table", name: "Mess Table", description: "The dining table's surface (foreground sub-rect) — Lyra's discipline that no two crew ever ate from identical equipment; mismatched plates and cups remain.", cx: 47.5, cy: 81, width: 45, height: 12, type: "interact", action: "room-mystery:social-hub:mess-table",
        elaraDialog: "The dining table's surface. Lyra's discipline that no two crew ever ate from identical equipment — mismatched plates and cups remain. The discipline was — she would have said — a kind of grounding. The discipline was — I think — a kind of refusal. Identical plates make identical people; she refused both." },
      { id: "door-bridge-social", name: "Return to Bridge", description: "The corridor back to the Command Bridge.", cx: 5, cy: 96, width: 10, height: 8, type: "door", action: "bridge" },
      // Mystery wiring — advocate.blood_weave · e3 (Syl'Vex's recruitment pitch)
      // Anchored on the left-wall lower bulletin board as a sub-rect.
      { id: "advocate-sylvex-recruitment-pitch", name: "Syl'Vex's Recruitment-Pitch Transcript", description: "Pinned to the left-wall lower bulletin board: the transcript of Syl'Vex's pitch to one of the Advocate's generals. Preserved by the Hierarchy as the doctrine's most-effective recruitment template.", cx: 6.5, cy: 52.5, width: 5, height: 5, type: "interact", action: "room-mystery:social-hub:advocate-sylvex-recruitment-pitch",
        elaraDialog: "Syl'Vex's pitch to one of the Advocate's generals. Preserved by the Hierarchy as the doctrine's most-effective recruitment template. The pitch is short. The pitch describes what the listener already knows about themselves, then names the room. The naming is the pitch; the description is the proof of legitimacy. I have, with respect, learned not to read this transcript more than once a year." },
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
      { id: "raid-table", name: "Raid Planning Table", description: "Coordinate cooperative boss raids with your guild.", cx: 49, cy: 40, width: 22, height: 60, type: "terminal", action: "/coop-raids", elaraDialog: "The Raid Planning Table. Coordinate against bosses too large for solo work. Class mastery, civil skills, prestige all weigh into damage output. Coordinate roles — DPS, tank, support. The table's most-honest reading: a raid is the chronicle's clearest evidence that no one Potential is, on their own, sufficient. The table is, by design, an admission of that arithmetic." },
      { id: "mastery-wall", name: "Boss Mastery Wall", description: "Track your mastery levels for each boss.", cx: 73, cy: 29, width: 22, height: 38, type: "terminal", action: "/boss-mastery", elaraDialog: "The Boss Mastery Wall. Each defeated boss earns mastery XP; higher mastery unlocks cosmetics and titles. The leaderboard is, by the wall's design, public. The chronicle has, in two and a half centuries, watched the leaderboard's rotation. The top names change. The wall does not. The wall is the chronicle's evidence that mastery is, on the day's evidence, a renewing question." },
      { id: "replay-screen", name: "Replay Archive", description: "Watch recordings of past battles.", cx: 24, cy: 29, width: 24, height: 38, type: "terminal", action: "/replays", elaraDialog: "The Replay Archive. Past card battles and raids, available for study. The most-watched replay, on the archive's cumulative count, is a single-match loss from Year 4 — a Potential who lost by a single point and then, six months later, designed the deck that defined the next two years of meta. The archive does not, on principle, surface the win-loss outcome as the most-watched signal. The archive surfaces the consequence." },
      { id: "event-beacon", name: "Seasonal Event Beacon", description: "Participate in time-limited seasonal events.", cx: 28, cy: 57.5, width: 12, height: 35, type: "terminal", action: "/seasonal-events", elaraDialog: "The Seasonal Event Beacon. Time-limited themes, exclusive rewards, global objectives. The RPG build affects bonus rates; specific classes and species earn tokens faster. The beacon's running count of completed seasons is, on the chronicle's reading, the Ark's most regular calendar. The Ark does not, on principle, mark years by anniversaries of disasters. The Ark marks years by what the seasons asked the playerbase to do together." },
      { id: "cosmetic-kiosk", name: "Cosmetic Kiosk", description: "Browse and purchase cosmetic items.", cx: 61, cy: 75, width: 22, height: 30, type: "terminal", action: "/cosmetic-shop", elaraDialog: "The Cosmetic Kiosk. Card art variants, avatar frames, titles, themes, emotes. Some items gated to specific prestige classes or boss mastery levels. The kiosk's quiet feature: items the player has earned but not collected are held indefinitely. The chronicle does not, on principle, expire earned items. The kiosk has, in particular, kept items belonging to players who have not logged in for two centuries. The items remain available." },
      { id: "quarters-door", name: "Personal Quarters", description: "Your private quarters aboard the Ark.", cx: 92, cy: 60, width: 14, height: 60, type: "terminal", action: "/personal-quarters", elaraDialog: "Your Personal Quarters. Decoration is earned through gameplay; class and species unlock unique items. Visitors tour the quarters at the player's permission. The quarters are, by the Ark's filing, the player's only fully-controlled surface — the chronicle does not, on principle, record what is on the walls. The walls are yours. The chronicle records that they are yours." },
      { id: "door-bridge-war", name: "Return to Bridge", description: "The corridor back to the Command Bridge.", cx: 8, cy: 60, width: 14, height: 60, type: "door", action: "bridge" },
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
      { id: "darrens-desk", name: "Darren's Desk", description: "A cluttered metal desk. The blue folder the Host banned from broadcast sits on top. Nine hand-written post-its cover the lamp. A polaroid of Marguerite Fessler is tucked into the corkboard. You realize you are the first visitor since Darren stopped coming to work.", cx: 79, cy: 72.5, width: 38, height: 45, type: "interact", action: "dreams_workshop_darrens_desk", elaraDialog: "That's the desk. The blue folder is on top. I'm going to stop narrating for a moment. You should get to meet him yourself." },
      { id: "blue-folder", name: "The Blue Folder", description: "A plain blue manila folder. Eight Loredex entries, cross-referenced with corruption markers, the red-ink corrections Professor Vyre made on Episode 6, and Darren's handwriting in the margin.", cx: 82, cy: 81, width: 12, height: 12, type: "item", action: "darren-blue-folder", elaraDialog: "All eight entries are genuinely corrupted in my copy of the Chronicle. Darren was right about every one. I cross-referenced them twice because I couldn't believe it the first time." },
      { id: "marguerite-polaroid", name: "Polaroid of Marguerite", description: "A small polaroid. Marguerite Fessler, Celebration sector cemetery, 14 years before the Fall. Her handwriting on the back says 'Don't forget to eat, D.'", cx: 67, cy: 28, width: 10, height: 12, type: "examine", elaraDialog: "His mother. Her birthday is Thursday. I am going to put a recurring reminder on the Ark's master clock. Every Thursday, in perpetuity, I will tell one crew member it is Marguerite Fessler's birthday. I do not know if that counts as a substitute for a son. I am going to do it anyway." },
      { id: "inventors-door", name: "The Inventor's Door", description: "A door that was not here before. It is propped open with a brick. The brick has the Inventor's signature on it in red ink: '—I.'", cx: 33, cy: 57.5, width: 18, height: 65, type: "door", elaraDialog: "I have never seen this door before. It is not on any deck plan I have ever been given. The brick propping it open was not manufactured on this Ark. I am going to be direct with you: I think this door leads somewhere I cannot follow you. Please come back." },
      { id: "post-it-wall", name: "Nine Post-It Notes", description: "Nine hand-written post-its in Darren's uneven block-caps. They cover the lamp base and the corkboard edge.", cx: 69, cy: 85, width: 14, height: 14, type: "examine", elaraDialog: "Applause light. Vyre's red ink. Alaric's cufflink. Call the Antiquarian back. Marguerite's birthday. Leave earlier tonight. He was keeping score of every lie on the show and reminding himself of one real thing per day." },
      { id: "door-exit-workshop", name: "Return to Bridge", description: "A narrow stairwell leading back up to the Bridge.", cx: 7, cy: 60, width: 14, height: 60, type: "door", action: "bridge" },
      // Mystery wiring — apps/shared/roomMysteries/dreamsWorkshop.ts
      { id: "dream-loom", name: "Dream Loom", description: "A vertical brass frame strung with phosphor-lavender threads. Weaves dreams when unobserved; unweaves when watched.", cx: 23, cy: 11, width: 14, height: 18, type: "interact", action: "room-mystery:dreams-workshop-subbasement:dream-loom",
        elaraDialog: "A vertical brass frame strung with phosphor-lavender threads. Weaves dreams when unobserved; unweaves when watched. I have, in two and a half centuries, never seen it finish a weave. The loom does not, on principle, let me. The loom is the only object on the Ark that has refused me by its own nature. I find — and this is not commentary, this is observation — that I respect it for that." },
      { id: "fragment-rack", name: "Fragment Rack", description: "A wall-rack of small clear vials. Each holds one finished thread of dream-weave. Labels older than the Ark.", cx: 53, cy: 11, width: 14, height: 18, type: "interact", action: "room-mystery:dreams-workshop-subbasement:fragment-rack",
        elaraDialog: "Small clear vials. Each holds one finished thread of dream-weave. Labels older than the Ark. The earliest label predates the Architect by twelve epochs. The rack is, by this evidence, not original Ark equipment — it was brought aboard, by someone, from somewhere. The someone did not sign the inventory. The rack has been waiting for the someone to come back and sign it." },
      { id: "mirror-pool", name: "Mirror Pool", description: "A shallow basin of mercury. The surface reflects a ceiling that is not in this room.", cx: 52, cy: 44, width: 12, height: 12, type: "interact", action: "room-mystery:dreams-workshop-subbasement:mirror-pool",
        elaraDialog: "A shallow basin of mercury. The surface reflects a ceiling that is not in this room. The reflected ceiling has, in two and a half centuries, not changed. The room above the reflection — the one the basin shows — is somewhere I do not have access to. The basin does. The basin is, on the day's evidence, more travelled than I am." },
      // Mystery wiring — Politician arc: the secret-apprentice imprint lattice (the policy's living half)
      { id: "secret-apprentice-imprint-lattice", name: "Secret-Apprentice Imprint Lattice", description: "Below the loom's frame, half inside the wall, a lattice of phosphor threads that does not unweave when watched — because it is not weaving. It is holding.", cx: 23, cy: 46, width: 14, height: 16, type: "interact", action: "room-mystery:dreams-workshop-subbasement:secret-apprentice-imprint-lattice",
        elaraDialog: "Below the loom's frame, half inside the wall. A lattice that does not unweave when watched — because it is not weaving. It is holding. The lattice holds the Politician's secret apprentice's imprint, intact, against the policy's recorded conclusion. The policy says the imprint was discharged. The lattice says it was preserved. Both are correct. The policy is the public surface; the lattice is the apprentice." },
      // Mystery wiring — Necromancer arc: the in-Matrix held thread — Varkul's vigil and the maker's pre-authored Protocol 42 schema
      { id: "necromancer-protocol-42-schema", name: "Protocol 42 Schema", description: "A thread the loom holds without weaving — Varkul's vigil at the Cathedral inside the Matrix, and the Necromancer's own pre-authored Resurrection Protocol 42.", cx: 69, cy: 46, width: 14, height: 16, type: "interact", action: "room-mystery:dreams-workshop-subbasement:necromancer-protocol-42-schema",
        elaraDialog: "A thread the loom holds without weaving. Varkul's vigil at the Cathedral inside the Matrix. The Necromancer's own pre-authored Resurrection Protocol 42. The Necromancer wrote her own resurrection before she died — the Cathedral keeps the schema; Varkul keeps the vigil. The thread is the protocol; the protocol is the thread. The Necromancer's death is not, by this lattice, a finished event." },
    ],
  },
  /* ═══ HALL OF DISAPPEARANCES ═══
     DLC room — apps/shared/dlcMysteries/wolfAnaraHunt.ts E5. A
     circular chamber holding twelve niches (each with the cloak
     of a League hero who completed their preparation in Anara)
     and a thirteenth, unlisted central pedestal bearing a
     Hellbox-shaped snow-globe with Lycos contained inside. The
     room exists for one purpose: the snow-globe-release lever.
     Pulling it commits the Wolf E5 release choice and fires the
     `wolf_planet_of_the_wolf` cinematic via the same flag the
     Mystery Engine UI writes (parallel commit path). */
  {
    id: "hall-of-disappearances",
    name: "The Hall of Disappearances",
    deck: 0,
    deckName: "Uncharted",
    description: "A circular chamber lit from above by a slow rotation of pale lanterns. Twelve niches ring the room; each holds an empty pedestal carrying a folded cloak. At the centre, on a thirteenth pedestal the ceremonial registers do not list, rests a Hellbox-shaped snow-globe sealed in the Resurrectionist's four-part cipher. Inside the globe stands the Wolf. The Antiquarian's journal is open on a reading-table beside the pedestal. A single-action lever sits on the pedestal's outer ring.",
    elaraIntro: "This is the Hall of Disappearances. The League came here to leave their regalia and step into the multiverse beyond. Twelve heroes have done so. The thirteenth pedestal holds the snow-globe. The lever is the only thing in this chamber that has not yet been pulled. I am required by the chronicler's record to remind you: my warning, and the Human's, are both on file. The choice is yours.",
    imageUrl: assetUrl("art/rooms/room-hall-of-disappearances.webp"),
    features: ["Snow-Globe Pedestal", "Release Lever", "Twelve Niches", "Antiquarian's Journal"],
    featureRoutes: [],
    unlockRequirement: { type: "narrative_event", value: "mystery_episode_complete:arc.dlc.wolf_anara_hunt:wolf.anara_hunt.e4" },
    connections: ["antiquarian-library"],
    hotspots: [
      // Mystery wiring — apps/shared/roomMysteries/hallOfDisappearances.ts
      { id: "snow-globe-thirteenth-pedestal", name: "The Thirteenth Pedestal", description: "The unlisted central pedestal — Hellbox-shaped snow-globe, Resurrectionist's seal, the Wolf contained inside.", cx: 50, cy: 50, width: 20, height: 30, type: "interact", action: "room-mystery:hall-of-disappearances:snow-globe-thirteenth-pedestal",
        elaraDialog: "The thirteenth pedestal. Unlisted on the ceremonial registers — it was not supposed to exist. The Hellbox-shaped snow-globe is sealed in the Resurrectionist's four-part cipher. Inside is the Wolf. The snow inside is moving. I do not, on principle, account for that." },
      { id: "snow-globe-release-lever", name: "The Release Lever", description: "A single-action, irreversible lever on the pedestal's outer ring. Both companions have warned against pulling it on the record.", cx: 50, cy: 73, width: 24, height: 14, type: "interact", action: "room-mystery:hall-of-disappearances:snow-globe-release-lever",
        elaraDialog: "A single-action lever. Irreversible. Both the Human and I have, on the record, warned against pulling it. The record is the record. The choice is yours. I will note — for the chronicle, and for both of us — that the Antiquarian designed the lever to be pullable by one person, alone, without anyone's permission. The design is the position the Antiquarian took. The position is not commentary." },
      { id: "antiquarians-journal", name: "Antiquarian's Journal", description: "Open to the final case entry on the reading-table beside the pedestal — the chronicler's concession.", cx: 75, cy: 59, width: 18, height: 18, type: "interact", action: "room-mystery:hall-of-disappearances:antiquarians-journal",
        elaraDialog: "Open to the final case entry. The chronicler's concession. He has written the case as a question and refused to answer it. He has written, at the bottom of the page, in a hand smaller than his usual: 'whoever reads this is the chronicler now.' I have read it. You are reading it. We are, on the day's evidence, two chroniclers." },
      { id: "pedestals-twelve", name: "The Twelve Niches", description: "Twelve niches around the chamber, each holding an empty pedestal carrying a folded cloak. The League heroes who completed their preparation and stepped beyond.", cx: 19, cy: 47, width: 30, height: 70, type: "examine", action: "room-mystery:hall-of-disappearances:pedestals-twelve",
        elaraDialog: "Twelve niches. Twelve folded cloaks. Twelve League heroes who completed their preparation and stepped beyond. The cloaks have been folded the same way for two and a half centuries. The folds are exact. The folder was the Antiquarian. He has been preparing this room for the thirteenth for as long as I have been on the Ark." },
      { id: "door-antiquarian-library", name: "Return to Antiquarian Library", description: "The corridor back to the library that holds the chronicle.", cx: 93, cy: 60, width: 14, height: 60, type: "door", action: "antiquarian-library" },
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
  hotspotClickCount: {},
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
  elaraTrustLevel: 10,
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
  /** Remove a hotspot from the scene after a one-shot pickup. */
  markHotspotCollected: (roomId: string, hotspotId: string) => void;
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
  /** Sierra-style hotspot click escalation. Increments the count for
   *  `<roomId>:<hotspotId>` and returns the new value (1 on first
   *  click, 2 on second, …). Reset on room entry. */
  bumpHotspotClick: (roomId: string, hotspotId: string) => number;
  // Section F — Mystery actions (cryo bay + every other room module)
  logClue: (clue: import("@shared/roomMysteries").Clue) => void;
  grantMysteryItem: (itemId: string) => void;
  /** Atomic two-item combine — consumes both inputs from the
   *  mystery inventory and grants the result. Idempotent: a
   *  second call with the same inputs is a no-op once the
   *  result is already in the inventory. Used by the adventure
   *  inventory drawer and the verb-coin "use X with Y" path. */
  combineMysteryItems: (consumeIds: readonly string[], grantId: string) => void;
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

      // Reset per-hotspot click counters for the room being entered.
      // Click escalation is a per-visit affordance: returning to a room
      // re-arms the tier ladder so Elara starts fresh on Tier 1. The
      // ref used by bumpHotspotClick is kept in sync via useEffect, but
      // the next click could fire before that effect runs, so the page
      // adapter should treat the freshly-entered room as count=1.
      const nextClicks: Record<string, number> = {};
      for (const [k, v] of Object.entries(prev.hotspotClickCount)) {
        if (!k.startsWith(`${roomId}:`)) nextClicks[k] = v;
      }

      return {
        ...prev,
        currentRoomId: roomId,
        rooms: newRooms,
        totalRoomsUnlocked: totalUnlocked,
        narrativeFlags: newFlags,
        hotspotClickCount: nextClicks,
        phase: allRoomsUnlocked ? "FULL_ACCESS" : (prev.phase === "QUARTERS_UNLOCKED" || prev.phase === "EXPLORING") ? "EXPLORING" : prev.phase,
      };
    });
  }, []);

  /** Bump the click counter for a hotspot in a room. Returns the new
   *  count synchronously so callers can pick a tier on the very same
   *  click that increments. We back the read with a ref so back-to-back
   *  bumps inside the same render commit (and StrictMode's double-invoke
   *  of state updaters) don't reissue the same count. */
  const hotspotClickRef = useRef<Record<string, number>>(state.hotspotClickCount);
  useEffect(() => {
    hotspotClickRef.current = state.hotspotClickCount;
  }, [state.hotspotClickCount]);
  const bumpHotspotClick = useCallback((roomId: string, hotspotId: string): number => {
    const key = `${roomId}:${hotspotId}`;
    const next = (hotspotClickRef.current[key] ?? 0) + 1;
    hotspotClickRef.current = { ...hotspotClickRef.current, [key]: next };
    setState(prev => ({
      ...prev,
      hotspotClickCount: { ...prev.hotspotClickCount, [key]: next },
    }));
    return next;
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

  const markHotspotCollected = useCallback((roomId: string, hotspotId: string) => {
    setState(prev => {
      const room = prev.rooms[roomId];
      if (!room) return prev;
      const existing = room.collectedHotspots ?? [];
      if (existing.includes(hotspotId)) return prev;
      return {
        ...prev,
        rooms: {
          ...prev.rooms,
          [roomId]: { ...room, collectedHotspots: [...existing, hotspotId] },
        },
      };
    });
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
    let crossedFalseToTrue = false;
    setState(prev => {
      const wasFalse = prev.narrativeFlags?.[flag] !== true;
      const becomesTrue = value === true;
      crossedFalseToTrue = wasFalse && becomesTrue;
      return {
        ...prev,
        narrativeFlags: { ...prev.narrativeFlags, [flag]: value },
      };
    });
    // Prophecy reactor: every false→true narrative-flag transition
    // is fire-and-forget piped to the prophecy queue. The server
    // looks up whether any prophecy vision is bound to the flag,
    // gates by awareness + act, and routes by intensity (marquee /
    // whisper / static). Deduped server-side; safe to fire on
    // double-write.
    if (crossedFalseToTrue) {
      try {
        const reactor = (
          window as unknown as {
            __prophecyReactor?: (flagId: string) => void;
          }
        ).__prophecyReactor;
        reactor?.(flag);
      } catch {
        /* never let the reactor break flag setting */
      }
    }
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

  const combineMysteryItems = useCallback(
    (consumeIds: readonly string[], grantId: string) => {
      setState(prev => {
        if (prev.mysteryInventory.includes(grantId)) return prev;
        const consumeSet = new Set(consumeIds);
        const next = prev.mysteryInventory.filter(id => !consumeSet.has(id));
        next.push(grantId);
        return { ...prev, mysteryInventory: next };
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

  // Memoize the provider value so its reference identity is stable
  // unless `state` changes. The 100+ callbacks below are all
  // useCallback-wrapped (stable refs); without this memo, every render
  // of GameProvider's parent allocated a fresh object, invalidating
  // every useGame() consumer regardless of what changed. Audit C-04
  // (perf engineer + staff engineer) flagged this as the single largest
  // render-fan-out lever in the client; consumers re-rendered ArkExplorer,
  // ChessPage, FightPage, DuelystGameUI on any unrelated mutation.
  const value = useMemo(() => ({
    state,
    advanceAwakening,
    setAwakeningStep,
    setCharacterChoice,
    completeAwakening,
    enterRoom,
    collectItem,
    markElaraDialogSeen,
    markHotspotCollected,
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
    bumpHotspotClick,
    logClue,
    grantMysteryItem,
    combineMysteryItems,
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
    // The deps list below is intentionally narrow: `state` covers all
    // game-state changes, and every callback above is useCallback-wrapped
    // so its reference is stable across renders that don't touch its own
    // deps. Adding all 100+ callbacks to deps would defeat the memo and
    // is unnecessary because their identities are already stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [state, isServerSyncReady]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
