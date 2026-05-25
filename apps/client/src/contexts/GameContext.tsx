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
  x: number; // percentage position
  y: number;
  width: number;
  height: number;
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
      // Re-anchored 2026-05-24 via tools/hotspot-author.html (standalone
      // visual editor — see PR #748). The previous 2026-05-24 pass
      // (PR #743) re-anchored against the AAA Final cryo-bay render
      // but with rougher rectangles; this pass tightens every hotspot
      // to its precise visual footprint based on user-driven drag-to-
      // place editing against the live baseline image. Most rectangles
      // shrunk dramatically (sealed-pods-left from 14×50 → 6.5×11,
      // dead-pod from 6×32 → 2.8×9.5, etc.) because the user could
      // see the exact pixel bounds of each interactive object.
      //
      // Notable narrative changes:
      //   • data-crystal moved to under the cryo pod ("hidden on the
      //     floor in the shadows beneath your cryo pod") + Elara
      //     compliments the player's eye for spotting it
      //   • medical-chart re-described as wall-clipped (not pod-
      //     clipped) + new Elara line: "I wonder what that is. I
      //     don't have any record of that."
      //   • candle-ring-2 added as a second visible candle (the user
      //     duplicated candle-ring to anchor both candles flanking
      //     the seal)
      //
      // 14-variant survey confirmed: every variant preserves the
      // same geometry. Baseline anchoring works for baseline +
      // act_tier_2 + battlepass_winter + companion_trust +
      // cycle_longnight + epoch_shadowtongue + faction_insurgency +
      // governance_quarantine + lore_ark_origins + morality_dark +
      // season_closing + system_unlock_crew + trust_elara_luminous +
      // tv_spreading. Variant-specific elements (Shadow Tongue glyphs,
      // quarantine wraps, crystal infections, etc.) are deferred to
      // the `requiresTier?` schema PR.
      //
      // Verify with /ark?debug-hotspots=1 or, for drag-to-place
      // editing, open tools/hotspot-author.html in a browser.
      { id: "sealed-pods-left", name: "Sealed Pods (Tilted)", description: "Two pods stand upright but tilted — cyan ECG readouts cycle steadily inside. Someone is still in there.", x: 28.7, y: 37.1, width: 6.5, height: 11, type: "examine", elaraDialog: "Those pods read warm-gold on the medical side and the heart-trace is still cycling. Whoever's inside is sustaining. Whether that's life or rehearsal-of-life, I genuinely cannot tell from out here.",
        elaraDialogVoId: "room.cryo-bay.hotspot.sealed-pods-left.elara",
        responses: [
          { id: "human.cryo-bay.sealed-pods-left.acknowledge", label: "Leave them.", closesDialog: true },
          {
            id: "human.cryo-bay.sealed-pods-left.who",
            label: "Who's inside?",
            elaraFollowUpVoId: "elara.cryo-bay.sealed-pods-left.who",
            elaraFollowUpText: "The manifest lines for these two are intact. I just don't trust the manifest yet. Ask me again from a room the walls don't reach into.",
          },
        ],
      },
      { id: "sealed-pods-right", name: "Sealed Pods (Right Cluster)", description: "A short column of three or four standing capsules right-of-center. Status indicators are dark.", x: 60.2, y: 36.7, width: 7.6, height: 8.5, type: "examine", elaraDialog: "Those pods are still sealed. Their status indicators went dark when the main power failed. I... I don't want to speculate about what's inside them. Not yet.",
        elaraDialogVoId: "room.cryo-bay.hotspot.sealed-pods-right.elara",
        responses: [
          { id: "human.cryo-bay.sealed-pods-right.acknowledge", label: "Then we don't open them.", closesDialog: true },
          {
            id: "human.cryo-bay.sealed-pods-right.speculate",
            label: "Speculate anyway.",
            elaraFollowUpVoId: "elara.cryo-bay.sealed-pods-right.speculate",
            elaraFollowUpText: "Three possibilities. They're occupied and alive — unlikely, given the power loss. They're occupied and dead — possible. They were never occupied, and someone made it look like they were. I weight the third highest. I don't like why.",
          },
        ],
      },
      { id: "cryo-terminal", name: "Cryo Terminal", description: "An arcade-style terminal on the far-left wall displaying your character data and vital statistics.", x: 0, y: 38, width: 8, height: 17.1, type: "terminal", action: "/character-sheet", elaraDialog: "This terminal has your biometric data — your species markers, class aptitudes, everything we determined during your awakening. You can review your Citizen profile here.",
        tiers: [
          { id: "tier_cryo_terminal_t2", requiredVisitCount: 2, responseId: "hs_cryobay_terminal_t2" },
          { id: "tier_cryo_terminal_t3", requiredVisitCount: 3, responseId: "hs_cryobay_terminal_t3" },
          { id: "tier_cryo_terminal_t5", requiredVisitCount: 5, responseId: "hs_cryobay_terminal_t5_stutter" },
        ],
        elaraDialogVoId: "room.cryo-bay.hotspot.cryo-terminal.elara",
      },
      { id: "cryo-terminal-2", name: "Diagnostics Kiosk", description: "A second arcade-style terminal directly beside the first. Status pages scroll past too fast to read.", x: 11.2, y: 37.1, width: 6.8, height: 14.8, type: "terminal", action: "/profile", elaraDialog: "That kiosk was the medical officer's station. It still cycles, but the data feed itself is sealed. We can mirror your Citizen profile here while we figure out what they were watching.",
        elaraDialogVoId: "room.cryo-bay.hotspot.cryo-terminal-2.elara",
      },
      { id: "antiquarian-tome", name: "Tome on the Pedestal", description: "An old, leather-bound volume rests open on a low pedestal between the diagnostic kiosks and the tilted pods — the Antiquarian's mark glints faintly on the cover.", x: 22.6, y: 47, width: 4.1, height: 4.1, type: "item", action: "tome-antiquarian-cryo", elaraDialog: "The Antiquarian's Library found this for you and delivered it here. I'd read it somewhere quieter than the chamber it's pointing at.",
        tiers: [
          { id: "tier_cryo_tome_t2", requiredVisitCount: 2, responseId: "hs_cryobay_tome_t2" },
          { id: "tier_cryo_tome_t3", requiredVisitCount: 3, responseId: "hs_cryobay_tome_t3" },
          { id: "tier_cryo_tome_t5", requiredVisitCount: 5, responseId: "hs_cryobay_tome_t5_stutter" },
        ],
        elaraDialogVoId: "room.cryo-bay.hotspot.antiquarian-tome.elara",
      },
      { id: "door-medical", name: "Medical Bay Door", description: "A reinforced door leading to the Medical Bay. Green status light.", x: 77.1, y: 30.4, width: 7.3, height: 18, type: "door", action: "medical-bay" },
      { id: "door-bridge", name: "Bridge Access", description: "A recessed bulkhead at back-center beneath the Aetheric-crown emblem. A corridor leading up to Deck 2 — the Command deck.", x: 46.3, y: 32.5, width: 7.4, height: 14.2, type: "door", action: "bridge" },
      { id: "ichor-trail", name: "Green Ichor Trail", description: "A trail of luminous green fluid arcs across the floor from the foreground-left, snaking toward the bridge corridor.", x: 18.2, y: 72.6, width: 19, height: 12.6, type: "examine", elaraDialog: "That isn't cryo-fluid. The spectrometry matches nothing in my registry — and the registry is comprehensive. Don't step in it, and don't let it touch the locket.",
        elaraDialogVoId: "room.cryo-bay.hotspot.ichor-trail.elara",
      },
      // The seal is flanked by TWO candles — candle-ring (left) and
      // candle-ring-2 (right). Both authored BEFORE ark-seal so a
      // click inside the seal hits the seal first (later entries
      // z-stack above).
      { id: "candle-ring", name: "Lit Candles (Left)", description: "A small flame at the left edge of the central floor seal — recently lit.", x: 41.3, y: 43.8, width: 1.6, height: 5, type: "examine", elaraDialog: "The wax is still soft. Whoever lit these was here within the hour. It wasn't me, and it wasn't you, which leaves a question I would rather not answer alone.",
        tiers: [
          { id: "tier_cryo_candle_t2", requiredVisitCount: 2, responseId: "hs_cryobay_candle_t2" },
          { id: "tier_cryo_candle_t3", requiredVisitCount: 3, responseId: "hs_cryobay_candle_t3" },
        ],
        elaraDialogVoId: "room.cryo-bay.hotspot.candle-ring.elara",
      },
      { id: "candle-ring-2", name: "Lit Candles (Right)", description: "A small flame at the right edge of the central floor seal — recently lit, twin to the left.", x: 57, y: 43.7, width: 1.6, height: 5, type: "examine", elaraDialog: "The wax is still soft. Whoever lit these was here within the hour. It wasn't me, and it wasn't you, which leaves a question I would rather not answer alone.",
        elaraDialogVoId: "room.cryo-bay.hotspot.candle-ring.elara",
      },
      { id: "ark-seal", name: "Inception Ark Seal", description: "An eight-pointed compass star inlaid in gold across the chamber's center. The candles encircle it like wards.", x: 43.6, y: 53.8, width: 12.8, height: 11.5, type: "examine", elaraDialog: "The First Wave knelt here before they walked out. The seal isn't decoration — it's a binding, an oath taken in the chamber that made them. The candles say someone is still keeping the rite.",
        tiers: [
          { id: "tier_cryo_seal_t2", requiredVisitCount: 2, responseId: "hs_cryobay_seal_t2" },
          { id: "tier_cryo_seal_t3", requiredVisitCount: 3, responseId: "hs_cryobay_seal_t3" },
          { id: "tier_cryo_seal_t5", requiredVisitCount: 5, responseId: "hs_cryobay_seal_t5_stutter" },
        ],
        elaraDialogVoId: "room.cryo-bay.hotspot.ark-seal.elara",
      },
      { id: "data-crystal", name: "Data Crystal", description: "A small glinting crystal hidden on the floor in the shadows beneath your cryo pod.", x: 66.7, y: 59.1, width: 2.5, height: 2.8, type: "item", action: "data-crystal-alpha", elaraDialog: "A hidden data crystal! You've certainly got a keen eye. These were used by the first wave to store personal logs. This one might contain information about what happened after they woke up.",
        elaraDialogVoId: "room.cryo-bay.hotspot.data-crystal.elara",
      },
      { id: "egg-cryo-scratch", name: "Scratched Symbol", description: "Barely visible scratch marks on the wall behind a pod.", x: 48.3, y: 26, width: 3, height: 4, type: "examine", elaraDialog: "Wait... those scratch marks. They form a symbol — the mark of the Antiquarian. But that's impossible. The Antiquarian is a myth, a figure from the deepest layers of the prophecy. Who carved this here, and when? This predates our launch.",
        elaraDialogVoId: "room.cryo-bay.hotspot.egg-cryo-scratch.elara",
        responses: [
          { id: "human.cryo-bay.egg-cryo-scratch.acknowledge", label: "We saw nothing.", closesDialog: true },
          {
            id: "human.cryo-bay.egg-cryo-scratch.who",
            label: "Who's the Antiquarian?",
            elaraFollowUpVoId: "elara.cryo-bay.egg-cryo-scratch.who",
            elaraFollowUpText: "A name old enough that I shouldn't be saying it. Move on. We'll come back to this when the room isn't listening.",
          },
        ],
      },
      // Section F — Cryo Bay mystery hotspots. Each fires through the
      // cryo-mystery hotspot-handler branch in ArkExplorerPage which
      // resolves the Look response via resolveVerbResponse().
      { id: "dead-pod", name: "Sealed Diplomatic Pod", description: "A pod whose status indicator is cold-blue instead of warm-gold. Something is in there.", x: 36.3, y: 36.5, width: 2.8, height: 9.5, type: "interact", action: "cryo-mystery:dead-pod" },
      { id: "frosted-glass", name: "Frosted Pod Glass", description: "Wipe the frost — see who's inside.", x: 79.6, y: 64.4, width: 4.8, height: 8.8, type: "interact", action: "cryo-mystery:frosted-glass" },
      { id: "medical-chart", name: "Medical Chart", description: "A printed medical chart magnet-clipped to the wall.", x: 41.5, y: 34.3, width: 3, height: 4, type: "interact", action: "cryo-mystery:medical-chart", elaraDialog: "I wonder what that is. I don't have any record of that." },
      { id: "cracked-panel", name: "Cracked Control Panel", description: "The dark pod's control panel is split along a hairline seam. Sabotage?", x: 81.3, y: 57.1, width: 3.1, height: 4.8, type: "interact", action: "cryo-mystery:cracked-panel" },
      { id: "data-slate", name: "Hidden Data Slate", description: "The edge of a data-slate peeks out from under the pod.", x: 60, y: 90.3, width: 3.8, height: 4.7, type: "interact", action: "cryo-mystery:data-slate" },
      { id: "personal-effect", name: "Fallen Locket", description: "Something small has fallen on the floor — a tarnished locket and a cut ID-tag cord.", x: 55.2, y: 86.4, width: 4.7, height: 3.6, type: "interact", action: "cryo-mystery:personal-effect" },
      // The player's actual pod — the broken, fallen capsule in the
      // foreground-right with a handprint smeared on the inside of
      // the glass. Authored LAST so its rectangle z-stacks above
      // `personal-effect` and `data-crystal` in case of overlap.
      { id: "cryo-pod", name: "Your Cryo Pod", description: "Your pod. Fallen on its side, glass spider-webbed. A handprint is smeared on the inside of the glass — yours, from when you broke out.", x: 65.7, y: 49.5, width: 12.7, height: 5.8, type: "examine", elaraDialog: "That's your pod. AK-74-0074. You broke the seal from inside, which the engineering spec says is impossible — and yet, here we are. We need to understand how.",
        elaraDialogVoId: "room.cryo-bay.hotspot.cryo-pod.elara",
        responses: [
          { id: "human.cryo-bay.cryo-pod.acknowledge", label: "Acknowledged.", closesDialog: true },
          {
            id: "human.cryo-bay.cryo-pod.how-long",
            label: "How long, Elara?",
            elaraFollowUpVoId: "elara.cryo-bay.cryo-pod.how-long",
            elaraFollowUpText: "Long enough that the chronometer's drift exceeds my repair budget. I won't lie to you with a number — but the dust on the floor isn't a year's worth.",
          },
          {
            id: "human.cryo-bay.cryo-pod.handprint",
            label: "About the handprint…",
            elaraFollowUpVoId: "elara.cryo-bay.cryo-pod.handprint",
            elaraFollowUpText: "It's on the inside. Whatever woke you up, you fought your way out before it finished doing whatever it came to do. I am — cautiously — glad of that.",
          },
        ],
      },
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
      // Re-anchored 2026-05-24 against the AAA Final medical-bay render
      // (art/rooms/medical_bay/baseline.png + state_act_tier_2 + state_
      // investigation_device_awakened). The 2026-04-25 pass anchored
      // against an older symmetrical render with a central stasis
      // chamber + overhead surgical arm; the AAA Final is an
      // asymmetrical chamber dominated by an Aetheric Crown / phoenix
      // stained-glass arch back-center, a foreground bio-bed on a
      // raised pedestal, a tall imaging tower (gold pillar with cyan
      // crown) to its right, twin foreground diagnostic consoles to
      // its left, a glowing DNA-helix column on the far-right wall,
      // and dispensary kiosks on the far-left wall. The surgical arm
      // only appears in the `investigation_device_awakened` variant;
      // its hotspot will be tier-gated when the `requiresTier?` schema
      // extension lands in a follow-up.
      //
      // Visible landmarks, left-to-right + foreground-to-back:
      //   • two stacked arcade-style dispensary kiosks — far-left
      //     wall (`medicine-cabinet`)
      //   • Cryo Bay door — left wall, arched (`door-cryo`)
      //   • workbench / medical-officer station — left mid-distance
      //     (`medical-log` rests on the pad here)
      //   • twin foreground diagnostic consoles — left of bio-bed
      //     (`autopsy-console`, `advocate-empire-zero-casualty`,
      //     `akai-virus-telemetry`)
      //   • bio-bed on a raised pedestal — center foreground
      //     (`bio-bed`, `mystery-bio-bed`, `npc-the-source`,
      //     `egg-vox-neural-bridge`, `mystery-vox-neural-bridge`)
      //   • imaging tower / gold pillar with cyan crown — center
      //     (`hellbox-lattice`, `severance-broker-quantum-imaging`)
      //   • Aetheric Crown stained-glass arch — back center
      //     (`aetheric-arch`)
      //   • right-wall cabinet + safe drawers — right wall
      //     (`emergency-safe`, `observation-keycard`,
      //     `the-silences-vacated-body`, `egg-med-vial`)
      //   • DNA helix column — far-right wall (`dna-helix`)
      //   • circular floor seal — chamber-center floor
      //     (`floor-seal`)
      //
      // Render order matters: `aetheric-arch` is authored FIRST as
      // backdrop; `autopsy-console` is authored BEFORE its mystery
      // sub-rects (`advocate-empire-zero-casualty`, `akai-virus-
      // telemetry`) so those win clicks on their console screens;
      // `bio-bed` is authored BEFORE `mystery-bio-bed` + `npc-the-
      // source` so those overlays win clicks; `hellbox-lattice`
      // (tower body) is authored BEFORE `severance-broker-quantum-
      // imaging` (small overlay on the cyan crown).
      //
      // Verify with /ark?debug-hotspots=1 or, for drag-to-place
      // editing, /ark?author-hotspots=1.

      // ── BACKDROP + WALLS ──
      { id: "aetheric-arch", name: "Aetheric Crown Window", description: "A stained-glass arch dominates the back wall — a phoenix-form Aetheric Crown rendered in gold and amber light. The glass is intact; the light source behind it is not the sun.", x: 57.6, y: 18.5, width: 13.6, height: 17, type: "examine", elaraDialog: "The Aetheric Crown. This window is the chamber's spine — every wake-cycle the first crew started here, and most of them started kneeling. Whatever lit it then is still lighting it now.",
        elaraDialogVoId: "room.medical-bay.hotspot.aetheric-arch.elara",
        tiers: [
          { id: "tier_med_arch_t2", requiredVisitCount: 2, responseId: "hs_medbay_arch_t2" },
          { id: "tier_med_arch_t3", requiredVisitCount: 3, responseId: "hs_medbay_arch_t3" },
          { id: "tier_med_arch_t5", requiredVisitCount: 5, responseId: "hs_medbay_arch_t5_stutter" },
        ],
        responses: [
          { id: "human.medical-bay.aetheric-arch.acknowledge", label: "Acknowledged.", closesDialog: true },
          {
            id: "human.medical-bay.aetheric-arch.what-lit-it",
            label: "What's lighting it?",
            elaraFollowUpVoId: "elara.medical-bay.aetheric-arch.what-lit-it",
            elaraFollowUpText: "Not the sun. Not the ship's reactor — I'd see the draw. The closest match in my registry is the Hellbox's lattice running in reverse. I would rather not assume it's the same source.",
          },
          {
            id: "human.medical-bay.aetheric-arch.who-knelt",
            label: "Who knelt here?",
            elaraFollowUpVoId: "elara.medical-bay.aetheric-arch.who-knelt",
            elaraFollowUpText: "The First Wave's medics, the founding signatories, and — the disturbed dust on the chamber floor says — someone within the last week. I do not have a name for that someone yet.",
          },
        ],
      },
      { id: "medicine-cabinet", name: "Medicine Cabinet", description: "Two stacked dispensary kiosks built into the far-left wall. Each port holds a row of capped vials; most are labeled, several are not.", x: 2.2, y: 43.3, width: 11.1, height: 33.8, type: "examine", action: "room-mystery:medical-bay:medicine-cabinet", elaraDialog: "Medical supplies. Most are standard stim-packs and neural stabilizers. But some of these vials... I don't recognize the compounds. They weren't in the original manifest.",
        elaraDialogVoId: "room.medical-bay.hotspot.medicine-cabinet.elara",
      },
      { id: "door-cryo", name: "Cryo Bay Door", description: "Return to the Cryo Bay.", x: 17, y: 37.3, width: 8.5, height: 30.9, type: "door", action: "cryo-bay" },
      { id: "dna-helix", name: "DNA Analysis Station", description: "A floor-to-ceiling glass column on the far-right wall holds a slow-rotating holographic double helix, marker-bands lighting up in sequence as it turns.", x: 89.9, y: 25.5, width: 9, height: 56.3, type: "examine", action: "room-mystery:medical-bay:dna-helix", elaraDialog: "The DNA analysis station. It maps your genetic markers against known species templates. DeMagi, Quarchon, Ne-Yon... your hybrid signature is fascinating.",
        elaraDialogVoId: "room.medical-bay.hotspot.dna-helix.elara",
      },

      // ── RIGHT-WALL CABINET / SAFE DRAWERS ──
      // emergency-safe is authored BEFORE the smaller drawer rectangles
      // (the-silences-vacated-body, observation-keycard, egg-med-vial)
      // so those sub-rects can z-stack above and win their specific
      // clicks within the larger safe area.
      { id: "emergency-safe", name: "Emergency Safe", description: "A reinforced wall safe with Dr. Lyra Vox's nameplate. Biometric reader sabotaged by her own hand; numeric keypad still works.", x: 30, y: 35.6, width: 4.2, height: 13.1, type: "interact", action: "room-mystery:medical-bay:emergency-safe" },
      { id: "observation-keycard", name: "Observation Keycard", description: "A biometric access card labeled 'OBS-DECK'. Stored in the medical safe.", x: 30.6, y: 37, width: 2.8, height: 6.7, type: "item", action: "observation-keycard", elaraDialog: "The Observation Keycard! It was in the medical safe all along. The previous crew stored sensitive access cards here for security. This will unlock the Observation Deck — the crew used it to monitor deep space anomalies. Take it.",
        elaraDialogVoId: "room.medical-bay.hotspot.observation-keycard.elara",
        responses: [
          { id: "human.medical-bay.observation-keycard.take", label: "Take the keycard.", closesDialog: true },
          {
            id: "human.medical-bay.observation-keycard.what-deck",
            label: "What's on the Observation Deck?",
            elaraFollowUpVoId: "elara.medical-bay.observation-keycard.what-deck",
            elaraFollowUpText: "Deep-space sensor array. The previous crew used it to watch anomalies the chart pretends aren't there. If the comms-array confirms what the deck records, we'll have a second source for the worst of what we suspect.",
          },
        ],
      },
      // Mystery wiring — Necromancer arc: the Silence's vacated body, catalogued under the Resurrectionist's Samsara-machine taxonomy
      { id: "the-silences-vacated-body", name: "The Silence's Vacated Body (Catalog)", description: "A drawer in the body-catalog indexed to the Resurrectionist's Samsara-machine taxonomy — the Silence's body, tagged 'available' at the moment of her going.", x: 80.1, y: 42.3, width: 3.8, height: 8.6, type: "interact", action: "room-mystery:medical-bay:the-silences-vacated-body" },
      { id: "egg-med-vial", name: "Unlabeled Vial", description: "A tiny vial of shimmering black liquid hidden behind the cabinet.", x: 85.3, y: 67.7, width: 3, height: 4, type: "item", action: "void-essence-sample", elaraDialog: "That vial... the liquid inside is moving on its own. The molecular structure doesn't match anything in my database. It's not from any known universe. The label has been torn off, but there's a serial number: VE-001. 'VE' — Void Essence? This shouldn't exist on this ship." },
      // Stabilize-Elara questline Chapter 1: Darren Fessler's personal-
      // effects locker. The artifact inside is Shadow-Tongue-immune by
      // canon — Darren's habit of writing meaningful sentences in the
      // un-indexable layer is the reason. Hotspot fires only when the
      // questline is active (elara_degradation_revealed); ArkExplorerPage's
      // item handler intercepts the action and sets
      // `darren_artifact_recovered`. See apps/shared/questlineStabilizeElara.ts.
      { id: "darren-personal-effects-locker", name: "Darren Fessler's Personal Effects", description: "A narrow personal-effects drawer in the right-wall cabinet, labeled D. FESSLER · MAINT in old serif. Inside: a folded scrap of paper that does not register on any scanner Elara has tried.", x: 80.1, y: 53.0, width: 3.8, height: 8.6, type: "item", action: "darren-fessler-artifact", elaraDialog: "There. The drawer says D. Fessler — maintenance, decades-out-of-date. Take what's inside; do not unfold it. Whatever it is, my registry does not see it. That is — for the first time today — exactly what I needed.",
        elaraDialogVoId: "room.medical-bay.hotspot.darren-personal-effects-locker.elara",
      },

      // ── LEFT MID-DISTANCE WORKBENCH ──
      { id: "medical-log", name: "Medical Log", description: "A data pad rests on the left-side workbench, screen still faintly lit.", x: 29.7, y: 53.1, width: 3, height: 3.4, type: "item", action: "medical-log-001", elaraDialog: "The last medical officer's log. Dated... I can't read the timestamp. But the entries describe patients with unusual symptoms. Nightmares. Voices. Something about 'the signal.'",
        elaraDialogVoId: "room.medical-bay.hotspot.medical-log.elara",
        tiers: [
          { id: "tier_med_log_t2", requiredVisitCount: 2, responseId: "hs_medbay_log_t2" },
          { id: "tier_med_log_t3", requiredVisitCount: 3, responseId: "hs_medbay_log_t3" },
        ],
        responses: [
          { id: "human.medical-bay.medical-log.take", label: "Take the log.", closesDialog: true },
          {
            id: "human.medical-bay.medical-log.read-here",
            label: "Read it here first.",
            elaraFollowUpVoId: "elara.medical-bay.medical-log.read-here",
            elaraFollowUpText: "The final entry is one line. 'The signal is in the room.' No timestamp, no signature, no follow-up. Whoever wrote it didn't get a chance to write a second sentence.",
          },
          {
            id: "human.medical-bay.medical-log.the-signal",
            label: "What signal?",
            elaraFollowUpVoId: "elara.medical-bay.medical-log.the-signal",
            elaraFollowUpText: "I don't know yet. The med-officer treated it as a known referent — no definition, no context. That tells me everyone here already knew what it was. Which tells me we should be more careful than we are.",
          },
        ],
      },
      { id: "mystery-medical-log", name: "Medical Log (Read)", description: "Read the data pad's final entry under the magnifier — patients across wake-cycles, the same dream, the word 'signal'.", x: 33.3, y: 50.3, width: 3.2, height: 3.7, type: "interact", action: "room-mystery:medical-bay:medical-log" },

      // ── TWIN FOREGROUND DIAGNOSTIC CONSOLES (left of bio-bed) ──
      // autopsy-console is the PARENT area covering both foreground
      // consoles; the smaller mystery sub-rects below z-stack above it
      // so the verb-coin sub-targets win clicks within their specific
      // screen areas.
      // Section 8 — Murder mystery turn-in. Reads the data-slate
      // fragment recovered from the dead pod and recovers the
      // bridge-reset-code. Without the slate the console reports an
      // empty queue. The action `bio-bed-autopsy-console` is handled
      // in ArkExplorerPage's hotspot branch.
      { id: "autopsy-console", name: "Bio-Bed Autopsy Console", description: "A small subsystem of the bio-bed dedicated to forensic readouts. Slot for an external data-slate.", x: 41.3, y: 45.4, width: 4.1, height: 5.7, type: "interact", action: "bio-bed-autopsy-console", elaraDialog: "The autopsy console can read external data-slates. If you have the fragment from the dead pod, slot it in.",
        elaraDialogVoId: "room.medical-bay.hotspot.autopsy-console.elara",
        responses: [
          { id: "human.medical-bay.autopsy-console.acknowledge", label: "Got it.", closesDialog: true },
          {
            id: "human.medical-bay.autopsy-console.what",
            label: "What's it going to tell us?",
            elaraFollowUpVoId: "elara.medical-bay.autopsy-console.what",
            elaraFollowUpText: "If the slate's intact enough — a name. A timestamp of death. And whatever the dead Potential was trying to send before they didn't make it.",
          },
        ],
      },
      // Mystery wiring — advocate.blood_weave · e2 (zero-casualty defender record)
      // Authored AFTER autopsy-console so it wins clicks on the left-console screen.
      { id: "advocate-empire-zero-casualty", name: "Empire — Zero-Casualty Defender Record", description: "On the casualty-archive console: zero combatants killed, zero souls breached across the seven-dimensions siege. One combatant redirected to the Advocate's 'permanent care.' The substrate cost was levied on her alone.", x: 43.4, y: 54.8, width: 2.4, height: 3.4, type: "interact", action: "room-mystery:medical-bay:advocate-empire-zero-casualty" },
      // Mystery wiring — akai_shi.red_death · e1 (virus-consumption telemetry)
      // Authored AFTER autopsy-console so it wins clicks on the right-console screen.
      { id: "akai-virus-telemetry", name: "Akai Shi — Virus-Consumption Telemetry", description: "On the neural-archive console: post-mortem readings show Akai Shi's consumption-curve as a gradient, not a cliff. She held the Virus inside her body longer than anyone in canonical record.", x: 40.3, y: 55.9, width: 2.7, height: 3.8, type: "interact", action: "room-mystery:medical-bay:akai-virus-telemetry" },

      // ── FLOOR ──
      { id: "floor-seal", name: "Medical Bay Floor Seal", description: "Concentric rings inlaid in pale stone span the chamber floor — a calibration mandala the first medics used to align the bio-bed's resonance.", x: 37.2, y: 69, width: 26.8, height: 14, type: "examine", elaraDialog: "The calibration mandala. The bio-bed's resonance is tuned against these rings; if the rings drift, the readouts drift with them. The lines look intact to me, but I'm reading slight distortion at the outer band. Worth checking when we have a free hand.",
        elaraDialogVoId: "room.medical-bay.hotspot.floor-seal.elara",
        responses: [
          { id: "human.medical-bay.floor-seal.acknowledge", label: "Note it.", closesDialog: true },
          {
            id: "human.medical-bay.floor-seal.check-now",
            label: "Walk the outer band now.",
            elaraFollowUpVoId: "elara.medical-bay.floor-seal.check-now",
            elaraFollowUpText: "Hairline crack — west arc. Small enough that the bio-bed compensates; large enough that the mandala isn't a perfect circle anymore. Whatever fractured it hit hard enough to crack inlaid stone and leave no visible debris.",
          },
        ],
      },

      // ── BIO-BED (center foreground) + overlays ──
      { id: "bio-bed", name: "Bio-Bed Scanner", description: "A pedestal-mounted exam bed in the chamber's center. Holographic readouts ghost above the headrest in pale cyan.", x: 44, y: 59.3, width: 8.8, height: 6.8, type: "terminal", action: "/character-sheet", elaraDialog: "The bio-bed can give you a full diagnostic. Your stats, your Dream resonance levels, your cellular integrity. Step on and I'll run a scan.",
        elaraDialogVoId: "room.medical-bay.hotspot.bio-bed.elara",
      },
      { id: "mystery-bio-bed", name: "Bio-Bed Trace Marker", description: "A faint trace marker on the bio-bed's diagnostic strip — your DNA's signature, registered without your having sat down.", x: 46.6, y: 53.1, width: 2.5, height: 4.5, type: "interact", action: "room-mystery:medical-bay:bio-bed" },
      { id: "egg-vox-neural-bridge", name: "Unkempt Neural Device", description: "A hidden device behind the bio-bed's maintenance panel. Cables still warm. A humming needle-port waits for a DNA sample.", x: 53.8, y: 61.3, width: 4, height: 5, type: "interact", action: "dna-device-offer", elaraDialog: "[STATIC BURST] It's humming at a frequency your teeth can feel. A neural-bridge apparatus — military grade, built by Dr. Lyra Vox to move consciousness between a body and the Ark itself. It wants a sample. You don't know what it will give you back." },
      { id: "mystery-vox-neural-bridge", name: "Neural Bridge (Read)", description: "Lyra's etched plate beside the needle-port: 'L. Vox.' She built the bridge to move consciousness between a body and the Ark.", x: 59.4, y: 55, width: 4, height: 5, type: "interact", action: "room-mystery:medical-bay:egg-vox-neural-bridge" },

      // ── IMAGING TOWER (center, right of bio-bed) ──
      // hellbox-lattice rectangle covers the full tower body; the
      // smaller broker-quantum-imaging sub-rect on the cyan crown
      // is authored AFTER so it wins clicks for the calibration
      // chip on the crown itself.
      { id: "hellbox-lattice", name: "Hellbox Lattice", description: "A free-standing imaging tower beside the bio-bed — gold pillar, cyan crown. The neural-lattice kernel that opens a portal into the Matrix of Dreams.", x: 60.2, y: 39.3, width: 4.9, height: 11.6, type: "terminal", action: "/hellbox", elaraDialog: "The Hellbox. The cloning-pod's neural lattice opens straight into the Matrix of Dreams. Every descent is a small Blood-Weave bargain — the Advocate's path in miniature.",
        elaraDialogVoId: "room.medical-bay.hotspot.hellbox-lattice.elara",
        responses: [
          { id: "human.medical-bay.hellbox-lattice.acknowledge", label: "Acknowledged.", closesDialog: true },
          {
            id: "human.medical-bay.hellbox-lattice.bargain",
            label: "What's the bargain?",
            elaraFollowUpVoId: "elara.medical-bay.hellbox-lattice.bargain",
            elaraFollowUpText: "Every Hellbox descent siphons a thread of vitality the Advocate harvests on the other side. Small enough that one descent is cheap; large enough that a hundred descents are not. The math is honest; the framing is not.",
          },
          {
            id: "human.medical-bay.hellbox-lattice.descend",
            label: "Descend now.",
            elaraFollowUpVoId: "elara.medical-bay.hellbox-lattice.descend",
            elaraFollowUpText: "Then I'll log your re-entry vector before you go. If the Matrix decides to keep you, I want a thread to pull on.",
          },
        ],
      },
      // Mystery wiring — severance.bound_champion · e3 (Broker's quantum imaging)
      // Authored AFTER hellbox-lattice so it wins clicks on the cyan crown's calibration chip.
      { id: "severance-broker-quantum-imaging", name: "Broker's Quantum Body Scan", description: "On the quantum-imaging suite: the Broker of Nilmorg's volunteered scan. An age incompatible with a single spine; a Year-One cellular rest-mark; a continuity with one discontinuity.", x: 50.6, y: 45, width: 2.5, height: 5.8, type: "interact", action: "room-mystery:medical-bay:severance-broker-quantum-imaging" },

      // ── NPC PRESENCE (Phase C) ──
      // The Source — primaryRoom = medical_bay (factionNPCs.ts).
      // Manifestation: possessed_system. He surfaces through the bio-bed
      // monitors when called. Authored LAST so it z-stacks above the
      // bio-bed + mystery-bio-bed rectangles and wins clicks when the
      // NPC is actively manifested. Talk verb opens NPCDialog.
      { id: "npc-the-source", name: "The Source (Echo)", description: "The bio-bed monitors flicker in unison. A face — or the suggestion of one — resolves on the central display. Patient Zero is awake.", x: 53.3, y: 46.2, width: 3.6, height: 4.4, type: "npc", action: "npc:the_source", npcId: "the_source" },
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
      { id: "tactical-display", name: "Tactical Display", description: "A massive corkboard on the right wall, layered with photographs and red string — the living web of intelligence the first crew began to assemble.", x: 78, y: 22, width: 21, height: 50, type: "terminal", action: "/board", elaraDialog: "The Conspiracy Board. Every entity, every faction, every connection we've mapped in the Dischordian Saga. It's a web of alliances, betrayals, and secrets. The more you explore, the more connections you'll uncover.",
        tiers: [
          { id: "tier_bridge_tactical_t2", requiredVisitCount: 2, responseId: "hs_bridge_tactical_t2" },
          { id: "tier_bridge_tactical_t3", requiredVisitCount: 3, responseId: "hs_bridge_tactical_t3" },
          { id: "tier_bridge_tactical_t5", requiredVisitCount: 5, responseId: "hs_bridge_tactical_t5_stutter" },
        ],
        elaraDialogVoId: "room.bridge.hotspot.tactical-display.elara",
      },
      { id: "war-map-display", name: "War Map", description: "The lower section of the Conspiracy Board — pinned faction territories and conflict zones, threaded together in red.", x: 78, y: 72, width: 21, height: 18, type: "terminal", action: "/war-map", elaraDialog: "The War Map. Faction territories, conflict zones, and strategic objectives are all tracked here. When faction wars erupt, this is where commanders plan their campaigns." },
      { id: "timeline-projector", name: "Timeline Projector", description: "A floating cyan banner-scroll near the top-right ceiling — a holographic timeline of the Ages of the Dischordian Saga.", x: 72, y: 8, width: 22, height: 24, type: "terminal", action: "/saga-timeline", elaraDialog: "The Timeline Projector. It maps the entire history of the Dischordian Saga across the Ages — from the Age of Privacy through the Fall of Reality and beyond. Each era tells a different chapter of the story.",
        elaraDialogVoId: "room.bridge.hotspot.timeline-projector.elara",
      },
      { id: "guild-console", name: "Guild Registry", description: "The middle terminal in the far-left Architect-channel column. A console for managing guild operations and alliances.", x: 0, y: 48, width: 15, height: 15, type: "terminal", action: "/guild", elaraDialog: "The Guild Registry. Form alliances with other Potentials, coordinate operations, and compete for dominance. Guilds that work together can tackle challenges no individual could face alone.",
        elaraDialogVoId: "room.bridge.hotspot.guild-console.elara",
      },
      { id: "sealed-memory-board", name: "Sealed Memory Board", description: "The bottom terminal in the far-left Architect-channel column. The Editor sealed memories out of the record; this terminal queues the sealed boards.", x: 0, y: 63, width: 15, height: 15, type: "terminal", action: "/conspiracy-board", elaraDialog: "Not the open Conspiracy Board — the sealed ones. The Editor redacted seven memories out of the saga's record. Each board you solve un-redacts a cutscene and a Soul Stone." },
      // Bridge mystery hotspots — see apps/shared/roomMysteries/bridge.ts.
      // Look on captains-chair / nav-console examine logs a clue and
      // flips `bridge_first_clue_found` (Tier 0 → 1). The nav console's
      // existing nav-calibration interact action runs separately on
      // `use` and unlocks fast travel.
      { id: "captains-chair", name: "Captain's Chair", description: "The command chair sits empty on the raised central dais, facing the viewport. A personal data pad is wedged in the armrest.", x: 45, y: 22, width: 14, height: 38, type: "examine", action: "room-mystery:bridge:captains-chair", elaraDialog: "The Captain's chair. Dr. Lyra Vox designed the neural nanobot network that runs every system on this ship. She was the last to sit here before ordering the emergency cryo protocol. Something about her doesn't add up — a neuropsychologist with that level of access to the ship's core systems. Her personal log might still be in the armrest terminal.",
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
      { id: "nav-console", name: "Navigation Console", description: "A foreground holographic console at left-center. A green-cyan star-map orb hovers above its base. An alien glyph interface awaits calibration.", x: 17, y: 70, width: 22, height: 25, type: "interact", action: "nav-calibration", elaraDialog: "The navigation console. It controls the Ark's fast-travel system, but the interface uses alien glyph sequences for authentication. Match the symbol pattern to bring the navigation grid online — then you can jump to any room you've already discovered.",
        elaraDialogVoId: "room.bridge.hotspot.nav-console.elara",
      },
      { id: "diplomacy-table", name: "Diplomacy Table", description: "An eight-pointed compass star inlaid in the chamber floor — the round table where holographic faction representatives convene.", x: 39, y: 60, width: 24, height: 32, type: "terminal", action: "/diplomacy", elaraDialog: "The Diplomacy Table. Negotiate with factions, forge alliances, or declare rivalries. Every diplomatic decision shifts the balance of power across the Saga. Choose your allies carefully.",
        tiers: [
          { id: "tier_bridge_diplomacy_t2", requiredVisitCount: 2, responseId: "hs_bridge_diplomacy_t2" },
          { id: "tier_bridge_diplomacy_t3", requiredVisitCount: 3, responseId: "hs_bridge_diplomacy_t3" },
        ],
        elaraDialogVoId: "room.bridge.hotspot.diplomacy-table.elara",
      },
      { id: "quest-board", name: "Mission Board", description: "A small holographic strategy table beside the dais — chess-like pieces represent active operations and quest objectives.", x: 62, y: 55, width: 16, height: 35, type: "terminal", action: "/quests", elaraDialog: "The Mission Board. Active operations and quest objectives are tracked here. Complete missions to earn rewards, uncover lore, and advance the story. Some missions are time-sensitive — the Saga doesn't wait for anyone.",
        elaraDialogVoId: "room.bridge.hotspot.quest-board.elara",
      },
      // Stabilize-Elara questline Chapter 2: the war-table slot. With the
      // Darren artifact in inventory and the matrix not yet stabilized,
      // clicking this surface completes the chapter and sets
      // `elara_matrix_stabilized_v1`. Without the artifact, Elara explains
      // what's needed. ArkExplorerPage's interact handler dispatches on
      // this action id.
      { id: "darren-artifact-receptacle", name: "War-Table Stabilizer Slot", description: "A bare brass plate set into the diplomacy table's rim, polished smooth as if by repeated use. The plate is not connected to anything on a scanner.", x: 50.5, y: 73, width: 4.0, height: 5.0, type: "interact", action: "bridge-war-table-stabilize", elaraDialog: "Place it on the plate. The plate is one of the few surfaces on this ship I cannot reach into. That is the point.",
        elaraDialogVoId: "room.bridge.hotspot.darren-artifact-receptacle.elara",
      },

      // ── DOORS ──
      // door-cryo is the only visible doorway in the bridge art (left
      // wall, arched, blue-keypad glow). The archives and comms-array
      // transitions are implied — kept as invisible clickable bands
      // on the far-right edge (archives) and bottom floor (comms).
      { id: "door-cryo", name: "Cryo Bay Stairs", description: "An arched left-wall door with a blue keypad. Stairs leading down to Deck 1.", x: 16, y: 30, width: 10, height: 48, type: "door", action: "cryo-bay" },
      { id: "door-archives", name: "Archives Access", description: "A secured passage leading to the Archives.", x: 95, y: 30, width: 5, height: 50, type: "door", action: "archives" },
      { id: "door-comms", name: "Comms Array Corridor", description: "A corridor leading to the Communications Array.", x: 38, y: 95, width: 26, height: 4, type: "door", action: "comms-array" },

      // ── SHADOW TONGUE ANNOTATIONS ──
      // Visible only after shadow_tongue_evidence flag set AND room
      // tier >= 2. The runtime gate handles visibility; this rectangle
      // covers the floating indigo marginalia at three Conspiracy
      // Board nodes per the bridge:annotations-visible art. Authored
      // AFTER tactical-display so it wins clicks on its sub-area.
      { id: "shadow-tongue-annotations", name: "Indigo Marginalia", description: "Faint indigo annotations float at three of the Conspiracy Board's nodes — marginalia in someone else's hand, timestamped to your current shift.", x: 86, y: 22, width: 13, height: 15, type: "interact", action: "room-mystery:bridge:shadow-tongue-annotations" },

      // ── ARCHITECT-CHANNEL MYSTERY TERMINALS (17 small rectangles) ──
      // Distributed across visible terminal screens and corkboard
      // surfaces. Each represents reading a specific Architect-channel
      // entry. Authored AFTER their container hotspots so they win
      // clicks on the specific lines/notes.
      //
      // Top-left terminal (no feature hotspot above it):
      { id: "severance-architect-acknowledge", name: "Architect — Apprentice Oath Acknowledgment", description: "On the Nilmorg Architect-channel: 'noted. the post is recognised. the post was always recognised.' The Console did not need a vote.", x: 1, y: 32, width: 6, height: 6, type: "interact", action: "room-mystery:bridge:severance-architect-acknowledge" },
      { id: "severance-council-ratification", name: "Council Ratification — Inheritance Protocol", description: "On the Council-vote terminal: ratified unanimously, with one abstention — the seventh founding Watcher's empty seat.", x: 8, y: 32, width: 6, height: 6, type: "interact", action: "room-mystery:bridge:severance-council-ratification" },
      { id: "charter-architect-response", name: "Architect's Recovery Response", description: "On the Architect-channel terminal: 'Do you wish to know.' An invitation, not an interrogation. The Console does not answer the inverse — what knowing costs.", x: 1, y: 40, width: 6, height: 6, type: "interact", action: "room-mystery:bridge:charter-architect-response" },
      { id: "charter2-architect-record-correction", name: "Architect Record Correction — Seventh's No", description: "On the Architect-channel: the eighth-epoch record correction — 'the seventh founding watcher did not consent to the fourth-epoch scrub. the record is corrected.'", x: 8, y: 40, width: 6, height: 6, type: "interact", action: "room-mystery:bridge:charter2-architect-record-correction" },
      //
      // Mid-left terminal (guild-console parent — these win sub-clicks):
      { id: "charter2-architect-acknowledgment", name: "Architect Closing — Eight Signatures Legible", description: "On the closing-rite Architect-channel: 'the founding now has eight signatures legible. the silence remains. the architect notes the correction with thanks.' Third use of 'thanks' in eight epochs.", x: 1, y: 50, width: 6, height: 5, type: "interact", action: "room-mystery:bridge:charter2-architect-acknowledgment" },
      { id: "infernal-architect-acknowledges", name: "Architect — Trap-Acknowledgment", description: "On the Architect-channel terminal: 'noted. the clauses are void. the trap was an honest one. the architect thanks the writer.' Fourth use of 'thanks' in eight epochs.", x: 8, y: 50, width: 6, height: 5, type: "interact", action: "room-mystery:bridge:infernal-architect-acknowledges" },
      { id: "chained-dean-silence-on-bridge", name: "Dean's Silence on the Bridge", description: "On the command-deck pedestal: the Dean's hand resting on the apprentice-protection-protocol document. Ratified, sealed, untouched since.", x: 1, y: 56, width: 6, height: 5, type: "interact", action: "room-mystery:bridge:chained-dean-silence-on-bridge" },
      { id: "chained-architect-correction", name: "Architect Correction — Module 17", description: "On the Architect-channel terminal: 'the absence of Module 17 was an honest argument that became a wrong outcome. the architect will not vote on the amendment.'", x: 8, y: 56, width: 6, height: 5, type: "interact", action: "room-mystery:bridge:chained-architect-correction" },
      //
      // Bottom-left terminal (sealed-memory-board parent — these win sub-clicks):
      { id: "chained-architect-rite-acknowledgment", name: "Architect Closing-Rite Acknowledgment", description: "On the closing-rite log: 'the architect notes the thirty-one names. the architect notes the teacher who taught anyway. the case is closed.'", x: 1, y: 65, width: 6, height: 5, type: "interact", action: "room-mystery:bridge:chained-architect-rite-acknowledgment" },
      { id: "watchers-architect-record", name: "Architect's Silence-Break Record", description: "On the Architect-channel terminal: 'six watchers have spoken to six audiences. each line is real. the seventh has not spoken. the architect will not name the seventh.'", x: 8, y: 65, width: 6, height: 5, type: "interact", action: "room-mystery:bridge:watchers-architect-record" },
      { id: "watchers-architect-role-naming", name: "Architect — Seventh-Role Boundary", description: "Pinned to the Architect-channel: 'the role waits to be named by the Ark itself, not by the architect. the silence will continue until the ark has spoken.'", x: 1, y: 71, width: 6, height: 5, type: "interact", action: "room-mystery:bridge:watchers-architect-role-naming" },
      //
      // Right corkboard (tactical-display parent — these win sub-clicks):
      { id: "watchers-architect-closing-thanks", name: "Architect's Closing Thanks", description: "On the closing-rite log: 'six Watchers spoken; one silent; the architect thanks the players for asking the question they sealed.' Fifth use of 'thanks' in eight epochs.", x: 79, y: 40, width: 5, height: 5, type: "interact", action: "room-mystery:bridge:watchers-architect-closing-thanks" },
      { id: "tarn-destination-acknowledged", name: "Architect's Record — Tarn's Departure", description: "On the Architect-channel terminal: 'noted. she may return at her own discretion.' Tarn has left the Ark; Roen knows where but will not say.", x: 85, y: 40, width: 5, height: 5, type: "interact", action: "room-mystery:bridge:tarn-destination-acknowledged" },
      { id: "tarn-architect-vote-note", name: "Architect — Closing-Rite Marginal Note", description: "Pinned to the Architect-channel for the closing rite: 'either choice closes the case. one keeps her name; one keeps her promise. the architect will not pick.'", x: 91, y: 40, width: 5, height: 5, type: "interact", action: "room-mystery:bridge:tarn-architect-vote-note" },
      { id: "memorial-architect-silence-on-torn", name: "Architect Silence — Torn Page", description: "On the Architect-channel terminal: asked to identify the torn-page imprint, the Console returns 'i decline.' Second decline in eight epochs.", x: 79, y: 47, width: 5, height: 5, type: "interact", action: "room-mystery:bridge:memorial-architect-silence-on-torn" },
      { id: "memorial-architect-closing-thanks", name: "Architect's Closing — Grateful", description: "On the closing-rite Architect-channel: 'noted. the plaza was the answer. the architect is grateful.' Second use of 'grateful' in eight epochs.", x: 85, y: 47, width: 5, height: 5, type: "interact", action: "room-mystery:bridge:memorial-architect-closing-thanks" },
      { id: "memorial-architect-sealed-note", name: "Architect's Sealed Note on I-1", description: "On the Architect-channel terminal: the keeper's sealed note opened only when the plaza asks. 'I-1 is the imprint that began the Ark. I will not name them. The plaza may.'", x: 91, y: 47, width: 5, height: 5, type: "interact", action: "room-mystery:bridge:memorial-architect-sealed-note" },

      // ── MYSTERY OVERLAY SUB-RECTANGLES (verb-coin sub-targets) ──
      // The feature-route hotspots above (tactical-display → /board,
      // timeline-projector → /saga-timeline, nav-console → puzzle
      // modal, diplomacy-table → /diplomacy) keep their primary
      // actions; these small adjacent rectangles dispatch the verb-
      // coin's authored mystery responses without stealing the
      // feature route. Authored AFTER their parents so they win
      // clicks on the specific marginalia / sequence / etc.
      { id: "mystery-tactical-display", name: "Conspiracy Marginalia", description: "Faint annotations along the Conspiracy Board's edge — read carefully and the editor's voice resolves.", x: 79, y: 55, width: 6, height: 6, type: "interact", action: "room-mystery:bridge:tactical-display" },
      { id: "mystery-timeline-projector", name: "Timeline Drift", description: "The two post-launch entries on the Timeline Projector's lower edge drift one minute forward on every read.", x: 88, y: 22, width: 6, height: 6, type: "interact", action: "room-mystery:bridge:timeline-projector" },
      { id: "mystery-nav-console", name: "Nav Console Sequence", description: "The previous crew's last unfinished glyph entry, frozen mid-attempt.", x: 30, y: 88, width: 6, height: 5, type: "interact", action: "room-mystery:bridge:nav-console" },
      { id: "mystery-diplomacy-table", name: "Empty Delegate Seat", description: "The chair beside the empty seat at the Diplomacy Table — pulled out by Lyra's hand, in the seconds before the cryo order.", x: 64, y: 80, width: 6, height: 8, type: "interact", action: "room-mystery:bridge:diplomacy-table" },
      { id: "captains-coffee", name: "Captain's Coffee", description: "A mug, half-full, on the dais beside the captain's chair. Two and a half centuries old. The handle still points toward the chair.", x: 40, y: 50, width: 5, height: 7, type: "interact", action: "room-mystery:bridge:captains-coffee" },

      // ── ITEM HOTSPOTS (on captain's chair area + nav console) ──
      // Authored AFTER captains-chair so they win clicks on the
      // armrest compartment / wedged data chip.
      { id: "captains-master-key", name: "Captain's Master Key", description: "A heavy magnetic key hidden in a compartment beneath the captain's armrest.", x: 50, y: 50, width: 4, height: 5, type: "item", action: "captains-master-key", elaraDialog: "The Captain's Master Key! It was hidden in a compartment beneath the armrest — exactly where a commander would keep their most important tool. This key opens the Captain's Quarters, the most restricted area on the ship. Whatever secrets Dr. Lyra Vox was hiding, they're behind that door." },
      { id: "egg-bridge-log", name: "Hidden Data Chip", description: "A micro data chip wedged into the captain's armrest.", x: 54, y: 38, width: 3, height: 4, type: "item", action: "captains-final-log", elaraDialog: "A hidden data chip! Someone concealed this in the armrest before the ship was stolen. Let me decrypt it... 'If you're reading this, the mind swap was successful. I am not who you think I am. The Engineer lives. Find the yellow coats.' The Engineer... hiding among the Potentials? And those yellow coats — that's the Warlord's signature. This changes everything." },
      { id: "egg-infected-starmap", name: "Corrupted Star Chart", description: "A star chart with routes that weren't in the original navigation database, etched into the nav-console's orb. The coordinates pulse with a sickly amber glow.", x: 28, y: 76, width: 5, height: 5, type: "item", action: "infected-starmap", elaraDialog: "[SIGNAL CORRUPTION] These coordinates... they weren't programmed by the crew. The Warlord, through Dr. Vox, uploaded a secondary route map into the navigation core. The routes connect every Inception Ark in the fleet — a delivery network. When Kael stole this ship, the Warlord let him go — because Kael was already Patient Zero, infected through Project Vector. The Thought Virus was in HIM. Every Ark this ship contacted, every port it docked at, every signal it broadcast — the virus spread from Kael's infected body through the ship's systems into every network it touched. Kael thought he was escaping. He was being deployed. The Recruiter became the delivery mechanism for the very weapon he was fighting against." },

      // ── NPC PRESENCE (Phase C) ──
      // Elara's holographic projection. Faction NPC primaryRoom = "bridge".
      // Renders her bust portrait in-room and routes the `talk` verb to
      // NPCDialog with buildFirstContactScene("elara") so VO plays via
      // useDialogVO without any extra hookup. Placed beside the
      // captain's chair on the central dais — visible without
      // overlapping the chair / nav-console rectangles.
      { id: "npc-elara", name: "Elara (Holographic)", description: "Elara's holographic projection flickers beside the captain's chair. She seems to be waiting for you to address her directly.", x: 60, y: 26, width: 7, height: 18, type: "npc", action: "npc:elara", npcId: "elara" },
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
      { id: "data-banks", name: "Data Banks", description: "The far-left wall is a floor-to-ceiling catalog drawer system — every drawer a tier of the Saga's record. Petabytes of data.", x: 0, y: 18, width: 14, height: 70, type: "examine", action: "room-mystery:archives:data-banks", elaraDialog: "Petabytes of data. Ship logs, personnel records, scientific research, intercepted transmissions. Most of it is corrupted or encrypted. I'm still trying to recover what I can." },
      { id: "codex-shelf", name: "The Codex", description: "Floor-to-ceiling cyan-lit bookshelves along the right wall, scaled by a rolling ladder. Ancient tomes and data crystals containing deep lore.", x: 70, y: 5, width: 28, height: 78, type: "terminal", action: "/codex", elaraDialog: "The Codex. These are the deeper lore entries — the histories, the prophecies, the classified files. Some entries are locked until you discover enough connections to piece them together." },
      { id: "search-terminal", name: "Search Terminal", description: "A floating celestial orb on a stone pedestal at center-back — the chamber's database query interface. Speak any name, alias, or keyword and the orb scans every indexed record.", x: 33, y: 28, width: 18, height: 32, type: "terminal", action: "/search", elaraDialog: "The main search terminal. Type any name, alias, or keyword and it will scan our entire database. Characters, locations, factions, songs — everything is indexed and cross-referenced." },
      { id: "clue-journal-desk", name: "Clue Journal", description: "An open journal at the center of the reading table. Ten investigative arcs; the Two Witnesses record what you deduce.", x: 25, y: 78, width: 14, height: 12, type: "terminal", action: "/clue-journal", elaraDialog: "The Clue Journal. Ten arcs, the_watcher through fenra. The Two Witnesses log every reading you file — the canon is partly written by what you conclude." },

      // ── DOORS ──
      // No visible door in the archives art — the Bridge is reached by
      // walking back out the way the player entered. Anchored as an
      // invisible click band along the foreground bottom of the table.
      { id: "door-bridge", name: "Bridge Door", description: "Return to the Command Bridge.", x: 40, y: 94, width: 20, height: 5, type: "door", action: "bridge" },

      // ── ITEM HOTSPOTS ──
      { id: "archive-crystal", name: "Encoded Crystal", description: "A crystal pulsing with amber light, set on the reading table beside one of the brass lamps.", x: 48, y: 70, width: 6, height: 7, type: "item", action: "archive-crystal-beta", elaraDialog: "Another data crystal. This one has partial decryption — it seems to contain information about the Panopticon's surveillance network. The Architect's eyes were everywhere." },
      { id: "egg-archive-tome", name: "Unmarked Tome", description: "A book with no title, sitting on an upper shelf of the right-wall stacks. The binding material is organic and warm to the touch.", x: 88, y: 18, width: 5, height: 8, type: "examine", action: "room-mystery:archives:egg-archive-tome", elaraDialog: "This book... it's not in any catalog. The binding material is organic — it's warm, like skin. The pages contain a prophecy written in a language I can't translate, but one word repeats: 'Dischord.' And at the very end, a drawing of seven seals. The Book of Revelation speaks of seven seals. Silence in Heaven follows the opening of the seventh." },

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
      { id: "corrupted-scroll-rack", name: "Corrupted Scroll Rack", description: "The lower bay of the left-wall drawer catalog — twenty-eight scrolls behind frosted glass, each in two registers: warm-gold underlayer and a slightly out-of-register indigo overlayer.", x: 0, y: 72, width: 14, height: 16, type: "interact", action: "room-mystery:archives:corrupted-scroll-rack" },
      { id: "rewritten-ledger", name: "Rewritten Ledger", description: "An open ledger on the reading table — two entries scrubbed to blanks, one margin annotation surviving in your own younger hand.", x: 18, y: 73, width: 7, height: 8, type: "interact", action: "room-mystery:archives:rewritten-ledger" },
      { id: "indigo-glow-lectern", name: "Indigo-Glow Lectern", description: "The orb's stone pedestal at center-back is ringed in a faint halo in the colour you cannot name. Someone is logged in right now.", x: 36, y: 56, width: 12, height: 14, type: "interact", action: "room-mystery:archives:indigo-glow-lectern" },
      { id: "unnameable-hue-cabinet", name: "Unnameable-Hue Cabinet", description: "The tall glass cabinet right-of-center — a hand-stitched label dyed in an unnameable hue. One scroll inside is undyed and untouched.", x: 49, y: 25, width: 11, height: 38, type: "interact", action: "room-mystery:archives:unnameable-hue-cabinet" },

      // ── ARCHITECT-CHANNEL MYSTERY DRAWERS (left drawer wall, 22 rects) ──
      // 3-column × 8-row grid of 4×5 sub-rectangles on the left-wall
      // drawer catalog. Each represents pulling a specific drawer:
      // Foundation-tier wing, Severance-tier records, Memorial-tier
      // sub-drawer, etc. Authored AFTER data-banks so they win clicks
      // on the specific drawer rows.
      //
      // Row 1 (y=20) — Charter / Severance foundation
      { id: "charter-silt-stratigraphy", name: "Charter Silt-Core Extraction", description: "The lower-deck silt-core on a brass tripod in the Foundation-tier wing — eight strata, the charter sitting in stratum six, two later burials closed over it.", x: 1, y: 20, width: 4, height: 5, type: "interact", action: "room-mystery:archives:charter-silt-stratigraphy" },
      { id: "charter-per-m-preservation-orders", name: "Per. M.'s Preservation-Order File", description: "Forty-three preservation orders on the standing-order vault, one identical signature across eight epochs: 'Per. M.' The inks shift; the hand does not.", x: 5, y: 20, width: 4, height: 5, type: "interact", action: "room-mystery:archives:charter-per-m-preservation-orders" },
      { id: "severance-no-protocol-on-file", name: "Empty Inheritance-Protocol Vault", description: "In the Severance-tier records: the inheritance-protocol vault, empty since the league's founding. The slot exists; the protocol does not.", x: 9, y: 20, width: 4, height: 5, type: "interact", action: "room-mystery:archives:severance-no-protocol-on-file" },
      // Row 2 (y=27) — Severance / Infernal envelopes
      { id: "severance-forty-season-envelopes", name: "Forty Sealed Season Envelopes", description: "Beside the empty vault: forty sealed envelopes, one per Severance. Each contains an attendance list, a death certificate, and Vex Maestro's one-line 'inheritor accepted.' No name on any of them.", x: 1, y: 27, width: 4, height: 5, type: "interact", action: "room-mystery:archives:severance-forty-season-envelopes" },
      { id: "infernal-envelope-set", name: "Forty Envelopes — Solène's Archive", description: "In the audit-evidence drawer: forty envelopes, one per season, pulled from Solène's back-room archive. Each contract has a back. Every back has a clause.", x: 5, y: 27, width: 4, height: 5, type: "interact", action: "room-mystery:archives:infernal-envelope-set" },
      { id: "infernal-atalin-history", name: "Atalin's Personnel History", description: "In the personnel-archive tier: hired two weeks before the first season, dismissed two weeks after. Cause: 'inability to satisfy the Hierarchy ledger-keeper's role concurrently.'", x: 9, y: 27, width: 4, height: 5, type: "interact", action: "room-mystery:archives:infernal-atalin-history" },
      // Row 3 (y=34) — Charter2 / Memorial
      { id: "charter2-solven-tax-records", name: "Solven Tax Records — Epoch-Four Redaction", description: "In the tax-registry tier: three epochs of careful payments; epoch four shows the redaction — every Solven entry struck through, replaced with 'in arrears, year unknown.'", x: 1, y: 34, width: 4, height: 5, type: "interact", action: "room-mystery:archives:charter2-solven-tax-records" },
      { id: "charter2-scrubber-personnel", name: "Heron — Council Archivist Personnel File", description: "In the personnel-archive tier: a Council archivist named Heron — fourth-epoch, retired in the fifth, dead in the sixth. One assignment: 'tidy the founding records.' Nine years.", x: 5, y: 34, width: 4, height: 5, type: "interact", action: "room-mystery:archives:charter2-scrubber-personnel" },
      { id: "memorial-imprint-log", name: "Imprint-Keeper's Leather-Bound Log", description: "In the Memorial-tier sub-drawer: the leather-bound imprint log. The fourteen entries are the only ones with no inscribed name; each waits for a witness slot.", x: 9, y: 34, width: 4, height: 5, type: "interact", action: "room-mystery:archives:memorial-imprint-log" },
      // Row 4 (y=41) — Memorial / Tarn (faculty erasure)
      { id: "memorial-three-elders", name: "Three Elders Who Refused — Long-Wait Register", description: "In the long-wait register: I-155, I-202, I-301 each refused to name themselves at the moment of imprinting. All three on the unwitnessed list for over a decade.", x: 1, y: 41, width: 4, height: 5, type: "interact", action: "room-mystery:archives:memorial-three-elders" },
      { id: "tarn-absent-notes", name: "Lectern Drawer — Empty (Tarn's Binder Missing)", description: "In the lost-and-found drawer: Tarn's lecture binder is missing from the lectern's drawer. Removed at second bell; not recovered at the lectern.", x: 5, y: 41, width: 4, height: 5, type: "interact", action: "room-mystery:archives:tarn-absent-notes" },
      { id: "tarn-erasure-protocol", name: "Faculty Erasure Protocol", description: "In the meeting-minutes annex: 'Step one: omit the professor's name. Step two: invite as contributor, not faculty member. Step three: if declined, proceed.' Tarn was never invited to step two.", x: 9, y: 41, width: 4, height: 5, type: "interact", action: "room-mystery:archives:tarn-erasure-protocol" },
      // Row 5 (y=48) — Tarn / Akai / Advocate
      { id: "tarn-missing-invitation", name: "Unsent Invitation to Tarn", description: "Beside the protocol: an unsent invitation drafted but never delivered. The Dean's signature is absent. The invitation has been sitting in the outbox for six days.", x: 1, y: 48, width: 4, height: 5, type: "interact", action: "room-mystery:archives:tarn-missing-invitation" },
      { id: "akai-recovery-manifest", name: "Akai Shi's Body-Recovery Manifest", description: "In the Thaloria-recovery tier: collected by external agent — Resurrectionist Ne-Yon — within the same engagement cycle. Antiquarian's library entry deferred at the Resurrectionist's request.", x: 5, y: 48, width: 4, height: 5, type: "interact", action: "room-mystery:archives:akai-recovery-manifest" },
      { id: "advocate-shelter-records", name: "Empire of Shadows — Shelter Records", description: "In the Empire-of-Shadows tier: partial shelter-records from three Empire dimensions. Soul-names, dates, Blood-Weave binding signatures. Totals run to the millions.", x: 9, y: 48, width: 4, height: 5, type: "interact", action: "room-mystery:archives:advocate-shelter-records" },
      // Row 6 (y=55) — Storm / Chained
      { id: "storm-calm-intervals", name: "Documented Calm Intervals (Two)", description: "In the cosmic-weather tier: two equilibrium-crossing flatten periods. First calm — Second Fall. Second calm — Casino Heist's planning window. Each followed by the decade's peak flux.", x: 1, y: 55, width: 4, height: 5, type: "interact", action: "room-mystery:archives:storm-calm-intervals" },
      { id: "chained-failure-log", name: "Apprentice-Failure Log", description: "In the apprentice-affairs tier: thirty-one entries. Each error shares a common shape — each apprentice mistook a Terminus formation feint for an actual approach.", x: 5, y: 55, width: 4, height: 5, type: "interact", action: "room-mystery:archives:chained-failure-log" },
      { id: "chained-dean-annotation-record", name: "Dean's Nine-Year Annotation Record", description: "Beside the failure log: the Dean's prospective-faculty records — Auro's name on the list since Year 6, with the same annotation dated nine times.", x: 9, y: 55, width: 4, height: 5, type: "interact", action: "room-mystery:archives:chained-dean-annotation-record" },
      // Row 7 (y=62) — Tarn binder / Memorial 14 / Wolf
      { id: "tarn-binder-page-14", name: "Tarn's Binder, Page 14 of 22", description: "In the lost-and-found drawer — the page of Tarn's lecture binder pulled from the festival hall's recycling bin. The equinox-address opening, in her own hand: 'I will not be teaching this year.'", x: 1, y: 62, width: 4, height: 5, type: "interact", action: "room-mystery:archives:tarn-binder-page-14" },
      { id: "memorial-fourteen-unwitnessed-list", name: "Fourteen-Imprint Unwitnessed Index", description: "In the Memorial-tier drawer: the list of fourteen imprints whose witnesses no longer live. By imprint-id only, the start of the plaza's search.", x: 5, y: 62, width: 4, height: 5, type: "interact", action: "room-mystery:archives:memorial-fourteen-unwitnessed-list" },
      { id: "wolf-crucible-resurrection-record", name: "Crucible Resurrection Record", description: "In the Crucible-inheritance tier: the Year 128,652 A.A. log naming Lycos preserved-and-reanimated, with the Resurrectionist's seal in the corner.", x: 9, y: 62, width: 4, height: 5, type: "interact", action: "room-mystery:archives:wolf-crucible-resurrection-record" },
      // Row 8 (y=69) — Wolf inheritance / Akai dossier / Matrix ledger
      { id: "wolf-crucible-inheritance-manifest", name: "Crucible Inheritance Manifest", description: "The inheritance manifest: the un-itemized line 'preserved instruments (sealed)' the Antiquarian moved into Anara without audit.", x: 1, y: 69, width: 4, height: 5, type: "interact", action: "room-mystery:archives:wolf-crucible-inheritance-manifest" },
      { id: "akai-necromancer-dossier", name: "Necromancer — Targets-List Dossier", description: "In the Necromancer-affairs tier: the dossier on the Architect's tenth-created Archon. The only entry on the Red Death's targets list whose date of elimination is blank.", x: 5, y: 69, width: 4, height: 5, type: "interact", action: "room-mystery:archives:akai-necromancer-dossier" },
      { id: "resur-matrix-energy-ledger", name: "Matrix of Dreams — Energy Ledger Fragment", description: "In the Matrix-of-Dreams maintenance-era tier: the partial ledger. A sustained energy draw from an unnamed internal source, the editor's hand bracketing the 14% the imprints cannot account for.", x: 9, y: 69, width: 4, height: 5, type: "interact", action: "room-mystery:archives:resur-matrix-energy-ledger" },

      // ── RIGHT BOOKSHELF MYSTERIES (5 shelf rects) ──
      // Authored AFTER codex-shelf so they win clicks on specific
      // shelf positions (each is described as being on a particular
      // shelf — "closing-record shelf", "rite-record shelf", etc.).
      { id: "tarn-letter-to-dean", name: "Tarn's Letter to the Dean", description: "On the classified-correspondence shelf: Tarn's sealed letter to the Dean. Explains the request to Roen, the planned silence, the Dean's choice now.", x: 72, y: 10, width: 5, height: 6, type: "interact", action: "room-mystery:archives:tarn-letter-to-dean" },
      { id: "chained-thirty-one-names-read", name: "Thirty-One Names Read at Rite", description: "On the rite-record shelf: the transcript of the thirty-one apprentice-failure names read aloud. Fifteen sent notes; sixteen sent silence. Both are read.", x: 78, y: 10, width: 5, height: 6, type: "interact", action: "room-mystery:archives:chained-thirty-one-names-read" },
      { id: "storm-final-correlation-table", name: "Storm Case-Closure Correlation Table", description: "On the closing-record shelf: seven peak flux periods, seven calms, seven cosmic-consequential moments. The Storm's work as the chronicle's permission to be consequential.", x: 84, y: 10, width: 5, height: 6, type: "interact", action: "room-mystery:archives:storm-final-correlation-table" },
      { id: "infernal-box-owner", name: "Forge-Workshop Box Ownership Log", description: "In the forge-workshop annex log: the PRELIMINARIES box logged to Atalin, ledger-keeper, Year One. One season; never replaced.", x: 72, y: 28, width: 5, height: 6, type: "interact", action: "room-mystery:archives:infernal-box-owner" },
      { id: "resur-protocol-authoring-signature", name: "Resurrection-Protocol Authoring Chain", description: "On the cult-protocols shelf: every canonical resurrection-protocol signed in the Resurrectionist's four-part cipher — Sanctuary, Red Death, Anara — firing in his hand long after his canonical vanishing.", x: 78, y: 28, width: 5, height: 6, type: "interact", action: "room-mystery:archives:resur-protocol-authoring-signature" },

      // ── CENTER-CABINET / ORB-AREA MYSTERIES (3 rects) ──
      // Authored AFTER unnameable-hue-cabinet + search-terminal so
      // they win clicks on specific cabinet shelves / artefacts.
      { id: "resur-twin-glyph", name: "Resurrectionist Twin-Glyph Reference", description: "In the Ne-Yon-glyph reference tier: two mirrored crescents joined at a central axis. The cult reads 'death-bound'; the pre-Empire archaeology reads 'twin-bound.' Two readings; one editorial.", x: 50, y: 30, width: 5, height: 5, type: "interact", action: "room-mystery:archives:resur-twin-glyph" },
      { id: "storm-inventors-heist-window", name: "Inventor's Casino Heist Accounting", description: "On a shelf inside the freestanding glass cabinet: the Casino Heist's post-event accounting, opening line in the Inventor's hand: 'the Storm's grace allowed the window.'", x: 50, y: 40, width: 5, height: 5, type: "interact", action: "room-mystery:archives:storm-inventors-heist-window" },

      // ── NPC PRESENCE (Phase C) ──
      // The Antiquarian — primaryRoom in factionNPCs.ts. A temporal echo
      // beside the celestial orb at center-back. Talk routes to NPCDialog.
      { id: "npc-antiquarian", name: "The Antiquarian", description: "A figure half-out-of-time stands beside the orb, removing his goggles to look at you.", x: 51, y: 38, width: 7, height: 18, type: "npc", action: "npc:the_antiquarian", npcId: "the_antiquarian" },
      // Shadow Tongue — secondaryRoom = archives. Manifests as a possessed
      // system; visible at the orb pedestal when he's currently logged in.
      // Authored AFTER indigo-glow-lectern so the NPC wins clicks on the
      // pedestal area when manifested.
      { id: "npc-shadow-tongue", name: "Shadow Tongue (Presence)", description: "The orb pedestal's indigo halo deepens. A reflection in the cabinet glass doesn't match yours. Someone else is editing — right now.", x: 38, y: 58, width: 8, height: 10, type: "npc", action: "npc:shadow_tongue", npcId: "shadow_tongue" },
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
      { id: "broadcast-screen", name: "Broadcast Screen", description: "The top-left of the right-wall monitor grid — a large screen playing recorded episodes of the Dischordian Saga.", x: 68, y: 18, width: 10, height: 26, type: "terminal", action: "/watch", elaraDialog: "The broadcast system. It plays the recorded history of the Dischordian Saga in episodic format. Each epoch covers a different era — from the Age of Privacy through the Fall of Reality. Watch carefully. There are clues hidden in every episode.",
        tiers: [
          { id: "tier_comms_broadcast_t2", requiredVisitCount: 2, responseId: "hs_comms_broadcast_t2" },
          { id: "tier_comms_broadcast_t3", requiredVisitCount: 3, responseId: "hs_comms_broadcast_t3" },
        ],
      },
      { id: "comms-relay", name: "Communication Relay", description: "The top-mid monitor — a powerful relay antenna capable of scanning for neural signatures across the fleet.", x: 78, y: 18, width: 10, height: 26, type: "interact", action: "comms-relay-import", elaraDialog: "The Communication Relay. I've been trying to re-establish contact with the other vessels — the ones that carried the first wave of Potentials into the void. I can scan for dormant neural signatures across the fleet. Perhaps we can identify other Potentials who survived the journey." },
      { id: "late-night-tv", name: "Pirate Frequency TV", description: "The top-right monitor — a battered CRT television tuned to a frequency that shouldn't exist. The signal comes and goes. Sometimes a handsome devil speaks directly to you.", x: 88, y: 18, width: 11, height: 26, type: "terminal", action: "/transmissions", elaraDialog: "This... this isn't supposed to be here. It's tuned to a frequency outside the Ark's normal broadcast spectrum. The signal ID reads 'MEME-PRIME.' Whoever is broadcasting has been recording the entire Dischordian Saga — and narrating it with alarming personal knowledge. The episodes unlock as you progress. It calls itself 'Late Night with the Meme.' I don't trust it. But I can't stop watching either.",
        tiers: [
          { id: "tier_comms_meme_t2", requiredVisitCount: 2, responseId: "hs_comms_meme_t2" },
          { id: "tier_comms_meme_t3", requiredVisitCount: 3, responseId: "hs_comms_meme_t3" },
          { id: "tier_comms_meme_t5", requiredVisitCount: 5, responseId: "hs_comms_meme_t5_stutter" },
        ],
      },
      { id: "radio-console", name: "Radio Console", description: "The back-alcove recessed window with a radio tuner picking up fragments of music from across the multiverse.", x: 42, y: 22, width: 13, height: 23, type: "examine", action: "room-mystery:comms-array:radio-console", elaraDialog: "The radio picks up fragments of music transmissions. Songs from Malkia Ukweli and the Panopticon — they seem to broadcast across dimensional barriers. Each song tells part of the story." },
      { id: "static-screen", name: "Static Screen", description: "A screen built into the left-wall gauge bank, showing nothing but static. Occasionally, shapes seem to form in the noise.", x: 8, y: 30, width: 12, height: 18, type: "examine", action: "room-mystery:comms-array:static-screen", elaraDialog: "That screen has been showing static since I can remember. But sometimes... sometimes I think I see patterns in it. Faces. Words. It's probably just signal degradation. Probably." },
      { id: "training-console", name: "Training Console", description: "The central transmission pedestal — an interactive tutorial system explaining the lore and mechanics of the Dischordian Saga.", x: 40, y: 50, width: 16, height: 30, type: "terminal", action: "/lore-tutorials", elaraDialog: "The Training Console. It contains interactive tutorials covering the lore, factions, game mechanics, and history of the Dischordian Saga. Essential reading for new Potentials. Even veterans might learn something new.",
        tiers: [
          { id: "tier_comms_training_t2", requiredVisitCount: 2, responseId: "hs_comms_training_t2" },
          { id: "tier_comms_training_t3", requiredVisitCount: 3, responseId: "hs_comms_training_t3" },
        ],
      },

      // ── DOORS ──
      // No visible doors in the comms-array art — the Bridge and
      // Observation Deck are reached via implied corridors at the
      // far-left and far-right edges. Kept as narrow invisible click
      // bands so the player can still navigate.
      { id: "door-bridge", name: "Bridge Corridor", description: "Return to the Command Bridge.", x: 0, y: 30, width: 4, height: 50, type: "door", action: "bridge" },
      { id: "door-observation", name: "Observation Deck", description: "A passage to the Observation Deck.", x: 96, y: 30, width: 4, height: 50, type: "door", action: "observation-deck" },

      // ── STATIC-SCREEN OVERLAY ──
      // Voice in the static — tighter rectangle on the same screen so a
      // tier-3 click can target the silhouette forming inside it.
      // Authored AFTER static-screen so the inner rectangle wins clicks.
      { id: "voice-in-the-static", name: "Voice in the Static", description: "The static on the left-wall screen has begun to organise itself — vertical bands of indigo arranging into the silhouette of a person speaking, then dissolving.", x: 10, y: 33, width: 8, height: 12, type: "interact", action: "room-mystery:comms-array:voice-in-the-static" },

      // ── LEFT-WALL GAUGE BANK MYSTERY RECTS (4 architect channels) ──
      // Standalone mystery rects placed on the far-left edge of the
      // gauge bank, clear of the static-screen and radar-scope rects.
      { id: "charter-bell-log", name: "Lower-Deck Bell Log — Three Pulls", description: "On the maintenance-broadcast shelf: three bell-pulls in the last century. Severance Year 3, a date no one will name, and this morning. The Antiquarian's name on the third.", x: 1, y: 22, width: 5, height: 6, type: "interact", action: "room-mystery:comms-array:charter-bell-log" },
      { id: "severance-first-witness-klessa", name: "Auditor Klessa — Forty-Severance Witness", description: "On the witness-attendance board: she has attended every Severance since Year 1. Brings a single white candle and lights it during the spoken name.", x: 1, y: 30, width: 5, height: 6, type: "interact", action: "room-mystery:comms-array:severance-first-witness-klessa" },
      { id: "akai-voice-mid-hunt", name: "Red Death — Voice Mid-Hunt", description: "On the Matrix-residue intercept board: a field-recording from the third retreat chamber. 'I am the chronicle's correction. I do not hate. I do not pity.'", x: 1, y: 38, width: 5, height: 6, type: "interact", action: "room-mystery:comms-array:akai-voice-mid-hunt" },
      { id: "akai-word-to-the-chronicle", name: "Red Death — Word to the Chronicle", description: "Pinned beside: the Red Death's closing line. 'I do not know if that nod was forgiveness or recognition or the body's last grammar. I do not need to know.'", x: 1, y: 46, width: 5, height: 6, type: "interact", action: "room-mystery:comms-array:akai-word-to-the-chronicle" },

      // ── CENTRAL PEDESTAL MYSTERY SUB-RECTS (4 desk/voice channels) ──
      // Authored AFTER training-console so they win clicks on specific
      // pedestal surfaces.
      { id: "tarn-erasure-vote-audio", name: "The Erasure-Vote Audio", description: "On the transmission desk: forty-three minutes from the war-room's spillover recorder. Three voices, three ayes, three pauses long enough to have been refusals.", x: 41, y: 52, width: 5, height: 6, type: "interact", action: "room-mystery:comms-array:tarn-erasure-vote-audio" },
      { id: "tarn-faculty-silence-hour", name: "The Hour Before the Vote", description: "The fifty-one minutes of room-tone the spillover recorder caught before the vote. Three faculty heads in the same room, no footsteps, no chairs, no dialogue.", x: 47, y: 52, width: 5, height: 6, type: "interact", action: "room-mystery:comms-array:tarn-faculty-silence-hour" },
      { id: "watchers-silence-break-log", name: "Silence-Break Event Log", description: "On the transmission desk: sixty-three seconds of six simultaneous voice-channels addressing six different players. The seventh channel logged as 'active signal, no carrier.'", x: 41, y: 60, width: 5, height: 6, type: "interact", action: "room-mystery:comms-array:watchers-silence-break-log" },
      { id: "chained-lyra-call-fourteen-minutes", name: "Lyra Vox's Fourteen-Minute Call", description: "On the voice-channel desk: Lyra's call from fourteen minutes before contact. 'They are asking what you would do. I think they already know. they want it from you.'", x: 47, y: 60, width: 5, height: 6, type: "interact", action: "room-mystery:comms-array:chained-lyra-call-fourteen-minutes" },

      // ── TOP-LEFT MONITOR MYSTERY SUB-RECTS (3 Severance recordings) ──
      // Authored AFTER broadcast-screen so they win clicks on the
      // specific recorded broadcasts.
      { id: "severance-vex-opening-line", name: "Vex Maestro's Opening Line — Forty Broadcasts", description: "On the broadcast-record desk: every Severance opening since Year 1, all carrying the same line in the same cadence. 'Someone has to pick it up.' The line is older than Vex's tenure.", x: 69, y: 22, width: 4, height: 5, type: "interact", action: "room-mystery:comms-array:severance-vex-opening-line" },
      { id: "severance-year-one-lap-record", name: "Severance Year One Lap Record", description: "On the Year-One archive shelf: two casualties — the champion (named) and a witness who entered the lane (redacted). The only redaction in forty seasons.", x: 73, y: 22, width: 4, height: 5, type: "interact", action: "room-mystery:comms-array:severance-year-one-lap-record" },
      { id: "severance-vex-confession", name: "Vex Maestro's Confession Recording", description: "Pinned to the recent-recordings board: Vex's first-time-naming-the-recruitment confession. 'Someone has to pick it up was always literal.'", x: 69, y: 30, width: 4, height: 5, type: "interact", action: "room-mystery:comms-array:severance-vex-confession" },

      // ── TOP-MID MONITOR MYSTERY SUB-RECTS (4 intercept channels) ──
      // Authored AFTER comms-relay so they win clicks on the specific
      // intercepted channel signatures.
      { id: "watchers-first-trumpet", name: "First Trumpet — Twenty-Two Seconds", description: "On the upper-bands intercept board: twenty-two seconds of Idris's band-three trumpet. The post-launch content slot Phase 4 scaffolded; tonight's first sound.", x: 79, y: 22, width: 4, height: 5, type: "interact", action: "room-mystery:comms-array:watchers-first-trumpet" },
      { id: "wolf-meme-show-transmission", name: "Meme-Show Transmission Intercept", description: "On the intercept board: Locke's adjudicar has pinned the Inventor-voiced transmission naming the Wolf as a predator wearing trust like a mask. The Antiquarian has not denied the framing.", x: 83, y: 22, width: 4, height: 5, type: "interact", action: "room-mystery:comms-array:wolf-meme-show-transmission" },
      { id: "storm-voice-fragment", name: "Storm — Voice-Fragment Intercept", description: "On the flux-frequency intercept board: a fragment captured during an uncorrelated calm. 'A calm is not the absence of weather. It is weather's permission for what otherwise could not be planned.'", x: 79, y: 30, width: 4, height: 5, type: "interact", action: "room-mystery:comms-array:storm-voice-fragment" },
      { id: "storm-closing-transmission", name: "Storm — Closing-Case Transmission", description: "Pinned beside: a second fragment from the case-closure interval, signed in the Storm's flux signature. 'The case will close on the correct side of that difference.'", x: 83, y: 30, width: 4, height: 5, type: "interact", action: "room-mystery:comms-array:storm-closing-transmission" },

      // ── TOP-RIGHT MONITOR MYSTERY SUB-RECTS (4 Advocate broadcasts) ──
      // Authored AFTER late-night-tv so they win clicks on the
      // specific Empire-of-Shadows transmissions.
      { id: "advocate-register-three-broadcast", name: "Advocate Broadcast — Register Three", description: "On the Empire-of-Shadows transmission shelf: the Advocate's register-three liturgical broadcast. 'If a soul comes under my charter, the chronicle has accepted the soul as its own.'", x: 89, y: 22, width: 4, height: 5, type: "interact", action: "room-mystery:comms-array:advocate-register-three-broadcast" },
      { id: "advocate-defection-response", name: "Advocate's Response to the Defections", description: "Pinned beside: the Advocate's register-three reply to the three-general defection. 'They walk under my charter still. I advocate for what they were when they chose.'", x: 94, y: 22, width: 4, height: 5, type: "interact", action: "room-mystery:comms-array:advocate-defection-response" },
      { id: "advocate-walk-in-power-lyric", name: "'Walk in Power' — Lyric Record", description: "On the album-records shelf: the canonical Silence in Heaven duet between the Advocate and the Human. The Empire's most-broadcast resistance anthem.", x: 89, y: 30, width: 4, height: 5, type: "interact", action: "room-mystery:comms-array:advocate-walk-in-power-lyric" },
      { id: "advocate-position-current-broadcast", name: "Advocate's Current-Position Broadcast", description: "On the most-recent-broadcasts shelf: 'I have not stopped. I will not stop. I continue. The Empire continues. The walk continues.'", x: 94, y: 30, width: 4, height: 5, type: "interact", action: "room-mystery:comms-array:advocate-position-current-broadcast" },

      // ── BOT MONITOR ROW (Thaloria archive + trace/signature buffers) ──
      { id: "akai-last-recorded-words", name: "Akai Shi's Last Recorded Words", description: "On the Thaloria-archive shelf — bot-left monitor: the helm-comm field-recording from forty-seven seconds before Jericho reached her. 'It was always going to be a mercy. We just have to live with which kind.'", x: 69, y: 48, width: 5, height: 6, type: "interact", action: "room-mystery:comms-array:akai-last-recorded-words" },
      { id: "miras-dual-thread-transmission", name: "Mira's Dual-Thread Transmission", description: "A personal-channel buffer on the bot-left monitor — Mira Halen's letter home with a carrier clean of any duress marker, and her later answer refusing the question of which thread to cut.", x: 74, y: 48, width: 4, height: 6, type: "interact", action: "room-mystery:comms-array:miras-dual-thread-transmission" },
      { id: "shadow-tongue-signal-trace", name: "Shadow Tongue Signal Trace", description: "A signature buffer on the bot-mid monitor — the Shadow Tongue's operational signature, subtraction without trace across the chronicle layer.", x: 79, y: 48, width: 6, height: 7, type: "interact", action: "room-mystery:comms-array:shadow-tongue-signal-trace" },
      { id: "resur-host-wyrmhole-signature", name: "Plague Dragon Corpse Signature", description: "On the bot-mid monitor's signal-analysis read-out: the Plague Dragon's energy-trace, consistent with the Host's canonical wyrmhole technology. The Virus's path through the breach, settled.", x: 79, y: 60, width: 6, height: 7, type: "interact", action: "room-mystery:comms-array:resur-host-wyrmhole-signature" },
      { id: "egg-comms-signal", name: "Anomalous Frequency", description: "A barely audible signal on a frequency that shouldn't exist — registering on the bot-mid monitor's edge meter.", x: 86, y: 50, width: 3, height: 4, type: "examine", action: "room-mystery:comms-array:egg-comms-signal", elaraDialog: "That frequency... it's not on any standard band. The signal is repeating a pattern: three short, three long, three short. An SOS. But the origin coordinates point to a location that doesn't exist in normal space. Someone — or something — is calling for help from between dimensions. The signal is tagged with an identifier: 'MEME-PRIME.'" },

      // ── RIGHT FOREGROUND BENCH (trace/log surfaces) ──
      // The small wooden bench in the right foreground hosts the
      // "trace buffer" / "cadence log" mysteries — physical surfaces
      // for relay outputs the operator pulled off the monitors.
      { id: "ocularum-relay-trace", name: "Ocularum Relay Trace", description: "A trace buffer printed onto the right-foreground bench — identity-shift signatures the official record does not index. The Senne→Locke transition resolves here.", x: 78, y: 78, width: 8, height: 10, type: "interact", action: "room-mystery:comms-array:ocularum-relay-trace" },
      { id: "dead-drop-cadence-log", name: "Dead-Drop Cadence Log", description: "A cadence log on the bench's right edge — shipping traffic the antenna passively records as it crosses New Babylon. One monthly Locke-signed package repeats.", x: 88, y: 78, width: 8, height: 10, type: "interact", action: "room-mystery:comms-array:dead-drop-cadence-log" },

      // ── NPC PRESENCE (Phase C) ──
      // The Human — primaryRoom = comms_array (factionNPCs.ts).
      // Manifestation: substrate. He propagates through the comms layer
      // and is only readable here once `first_human_revealed` is set; the
      // hotspot is always present but the NPCDialog gate handles
      // pre-reveal silence. Portrait progressive-reveals via
      // getHumanRevealImage(trust). Anchored to the bot-right monitor
      // because that's where the ghost figure manifests in the
      // human_reveal_ghost variant.
      { id: "npc-the-human", name: "The Human (Substrate)", description: "On the bot-right monitor, a silhouette resolves from the broadcast haze. Beneath the relay's hum, a second voice carries — not on any frequency the antenna is tuned to. The substrate itself is broadcasting.", x: 89, y: 47, width: 10, height: 22, type: "npc", action: "npc:the_human", npcId: "the_human" },
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
      { id: "crew-memorial", name: "Crew Memorial", description: "A small framed plaque on the far-left wall, names etched in soft light. The crew who didn't make it.", x: 1, y: 25, width: 8, height: 15, type: "examine", elaraDialog: "A memorial for the crew members who didn't survive the journey. One thousand and forty-seven names. They gave their lives to keep the Ark running while the Potentials slept. I remember every one of them.",
        tiers: [
          { id: "tier_obs_memorial_t2", requiredVisitCount: 2, responseId: "hs_obs_memorial_t2" },
          { id: "tier_obs_memorial_t3", requiredVisitCount: 3, responseId: "hs_obs_memorial_t3" },
          { id: "tier_obs_memorial_t5", requiredVisitCount: 5, responseId: "hs_obs_memorial_t5_stutter" },
        ],
      },
      // Phase G — wire the panoramic viewport to the observation-deck
      // mystery module so Look/Use/Talk all route through the verb coin.
      { id: "viewport", name: "Panoramic Viewport", description: "The vast expanse of space stretches before you through a curved glass wall — stars, a small distant planet, the chamber's only window onto the void.", x: 25, y: 22, width: 50, height: 50, type: "interact", action: "room-mystery:observation-deck:panoramic-viewport", elaraDialog: "Look at the stars. They're beautiful, aren't they? But they're wrong. The constellations don't match any known configuration from any of the mapped universes. Either we've traveled very, very far... or we're somewhere that shouldn't exist." },
      { id: "music-terminal", name: "Music Terminal", description: "A glowing earth-globe on a brass-rimmed table at right-foreground. The complete discography of Malkia Ukweli & the Panopticon is keyed into its base.", x: 78, y: 65, width: 18, height: 20, type: "terminal", action: "/discography", elaraDialog: "The complete discography. Four albums spanning the entire narrative — Dischordian Logic, The Age of Privacy, The Book of Daniel 2:47, and the upcoming Silence in Heaven. Every song is a piece of the puzzle.",
        tiers: [
          { id: "tier_obs_music_t2", requiredVisitCount: 2, responseId: "hs_obs_music_t2" },
          { id: "tier_obs_music_t3", requiredVisitCount: 3, responseId: "hs_obs_music_t3" },
        ],
      },
      { id: "bond-resonance-altar", name: "Bond Resonance Altar", description: "A low circular altar set into the floor's compass-star tiling — brass-rimmed, oxblood-leather kneeler.", x: 40, y: 88, width: 20, height: 10, type: "interact", action: "room-mystery:observation-deck:bond-resonance-altar" },
      { id: "purification-crystal-cradle", name: "Crystal Cradle", description: "The pedestal beneath the globe-table. A brass plaque reads, in Lyra's hand: 'For the crystal that has not yet been chosen.'", x: 80, y: 85, width: 16, height: 8, type: "interact", action: "room-mystery:observation-deck:purification-crystal-cradle" },

      // ── DOORS ──
      // door-comms is the player's walk-out path (no visible door in
      // the art); kept as a narrow invisible band on the bottom-left
      // floor so it doesn't conflict with the visible couch.
      // door-engineering is the maintenance hatch — no visible door
      // either; invisible right edge band.
      { id: "door-comms", name: "Comms Array", description: "Return to the Communications Array.", x: 5, y: 92, width: 15, height: 6, type: "door", action: "comms-array" },
      { id: "door-engineering", name: "Engineering Access", description: "A maintenance hatch leading down to Engineering.", x: 95, y: 30, width: 5, height: 55, type: "door", action: "engineering" },

      // ── VIEWPORT SUB-RECTS ──
      // The viewport itself acts as the cosmic display — each mystery
      // rect represents a specific celestial reading visible in the
      // star-field. Authored AFTER viewport so they win clicks on
      // specific star clusters.
      { id: "egg-obs-constellation", name: "Strange Constellation", description: "A pattern of stars in the viewport's upper-left that seems to form a face.", x: 28, y: 24, width: 5, height: 6, type: "examine", elaraDialog: "Do you see it? That cluster of stars... if you connect them, they form a face. Not just any face — it looks like the Watcher. The all-seeing eye of the Panopticon's surveillance network. But we're light-years from Panopticon space. How can the stars themselves form his likeness? Unless... the stars were arranged. By someone with the power to move suns.",
        tiers: [
          { id: "tier_obs_constellation_t2", requiredVisitCount: 2, responseId: "hs_obs_constellation_t2" },
          { id: "tier_obs_constellation_t3", requiredVisitCount: 3, responseId: "hs_obs_constellation_t3" },
        ],
      },
      { id: "akai-cycle-fold-anomalies", name: "Matrix Cycle-Fold Anomalies", description: "Telemetry overlaid on the viewport's left quadrant — discontinuous folds during the Red Death's hunt. Seven folds, seven retreat chambers, seven encounters. The Necromancer running into his own decisions.", x: 34, y: 28, width: 6, height: 5, type: "interact", action: "room-mystery:observation-deck:akai-cycle-fold-anomalies" },
      { id: "storm-weather-telemetry", name: "Five-Century Cosmic-Weather Console", description: "Telemetry overlaid on the viewport center — five centuries of slow oscillation between two equilibria, with Storm-active intervals pinned exactly to the mid-line crossings.", x: 46, y: 28, width: 6, height: 5, type: "interact", action: "room-mystery:observation-deck:storm-weather-telemetry" },
      { id: "storm-full-calms-register", name: "Register of Nine Calms", description: "Pinned beside the telemetry on the viewport's right quadrant — the full register of nine documented calm intervals; each one a permission interval.", x: 60, y: 28, width: 6, height: 5, type: "interact", action: "room-mystery:observation-deck:storm-full-calms-register" },

      // ── LEFT-WALL MYSTERY RECT (architect channel on bar shelves) ──
      { id: "charter-upper-band-calibration", name: "Upper-Band Calibration Slip", description: "On the upper-band reference shelf, tucked between the bar's backlit bottles: a wafer of metal calibrated to the upper-band frequency, folded into the founding-Watcher's letter. Per. M. had access to the upper bands.", x: 1, y: 50, width: 5, height: 5, type: "interact", action: "room-mystery:observation-deck:charter-upper-band-calibration" },

      // ── GLOBE-TABLE MYSTERY SUB-RECT (cosmic-archaeology console) ──
      // Authored AFTER music-terminal so it wins clicks on the
      // specific archaeology readout on the globe.
      { id: "resur-shield-diagnostic", name: "Dreamer's Shield — Diagnostic Reading", description: "On the globe-table's cosmic-archaeology readout: the Shield's barrier does not register the Virus's signature as fully excluded; the signature reads, faintly, FROM INSIDE the protected volume. The cult calls it instrumentation error.", x: 82, y: 68, width: 5, height: 5, type: "interact", action: "room-mystery:observation-deck:resur-shield-diagnostic" },
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
      { id: "reactor-core", name: "Reactor Core", description: "The central archway holds the chamber's heart — a glowing forge fire above an anvil pedestal, fed by power conduits running into the back wall. The engineers called it the Ark's reactor.", x: 40, y: 22, width: 16, height: 38, type: "examine", action: "room-mystery:engineering:reactor-core", elaraDialog: "The reactor core. It runs on a substance the engineers called 'Dream' — a crystallized form of quantum consciousness. It's the same resource that powers your abilities. The core is running at 34% capacity. We're losing power slowly." },
      { id: "crafting-bench", name: "Crafting Workbench", description: "The left foreground workbench, laid out with tools for card crafting and fusion experiments.", x: 15, y: 68, width: 28, height: 28, type: "terminal", action: "/research-lab", elaraDialog: "The crafting workbench. Here you can fuse cards together to create more powerful versions. The recipes were developed by the Ark's engineers — combine the right elements and you might create something legendary.",
        tiers: [
          { id: "tier_eng_bench_t2", requiredVisitCount: 2, responseId: "hs_eng_bench_t2" },
          { id: "tier_eng_bench_t3", requiredVisitCount: 3, responseId: "hs_eng_bench_t3" },
        ],
      },
      { id: "blueprints", name: "Holographic Blueprints", description: "A cyan holographic blueprint floats above a brass desk at right-center — schematics for card designs and weapon systems the engineers never finished.", x: 55, y: 30, width: 17, height: 28, type: "examine", action: "room-mystery:engineering:blueprints", elaraDialog: "Card schematics. The engineers were designing new card types before... before they stopped. Some of these designs are brilliant. Legendary-tier cards that could turn the tide of any battle." },
      { id: "research-station", name: "Research Station", description: "The right foreground workbench — an interactive research terminal with puzzles and experiments.", x: 55, y: 68, width: 25, height: 28, type: "terminal", action: "/research-minigame", elaraDialog: "The Research Station. Solve engineering puzzles and conduct experiments to unlock new card recipes and crafting techniques. The harder the puzzle, the rarer the reward.",
        tiers: [
          { id: "tier_eng_research_t2", requiredVisitCount: 2, responseId: "hs_eng_research_t2" },
          { id: "tier_eng_research_t3", requiredVisitCount: 3, responseId: "hs_eng_research_t3" },
        ],
      },

      // ── DOORS ──
      // door-forge anchors on the small doorway to the LEFT of the forge
      // archway so it doesn't steal clicks from the reactor-core examine.
      // The actual forge fire stays accessible via reactor-core; the
      // door-forge is the maintenance doorway beside it.
      { id: "door-forge", name: "Forge Workshop", description: "A heavy blast door to the left of the central forge. Heat warnings; the air shimmers.", x: 33, y: 27, width: 5, height: 32, type: "door", action: "forge-workshop" },
      { id: "door-observation", name: "Observation Deck", description: "Return to the Observation Deck.", x: 0, y: 50, width: 4, height: 40, type: "door", action: "observation-deck" },
      { id: "door-armory", name: "Armory Access", description: "A reinforced door at the right edge leading to the Armory.", x: 95, y: 30, width: 4, height: 45, type: "door", action: "armory" },

      // ── LEFT-WALL WORKSTATION MYSTERY RECTS (wolf arc) ──
      // The left-wall multi-screen workstation hosts the medical-archive
      // and containment-systems consoles described in the wolf arc.
      { id: "wolf-host-residue-files", name: "Healer's Host-Residue Research", description: "On engineering's medical-archive console (left workstation, top screen): the healer's preserved files. One draft entry on a Quarchon Potential, edited fourteen times across the week she disappeared.", x: 1, y: 35, width: 8, height: 8, type: "interact", action: "room-mystery:engineering:wolf-host-residue-files" },
      { id: "wolf-anara-architecture-blind-spot", name: "Anara Architectural Schematic", description: "On the containment-systems console (left workstation, lower screen): Anara's schematics expose the single design assumption — outside is threat, inside is family. The family has eaten the chronicler.", x: 1, y: 46, width: 8, height: 8, type: "interact", action: "room-mystery:engineering:wolf-anara-architecture-blind-spot" },

      // ── FORGE-AREA SUB-RECT (etched formula easter egg) ──
      // Authored AFTER reactor-core so it wins clicks on the specific
      // formula etched into the reactor housing.
      { id: "egg-eng-formula", name: "Etched Formula", description: "A mathematical formula scratched into the reactor housing above the forge.", x: 47, y: 28, width: 4, height: 4, type: "examine", action: "room-mystery:engineering:egg-eng-formula", elaraDialog: "Someone etched a formula into the reactor housing. It's a dimensional resonance equation — the kind used to calculate jumps between parallel universes. But there's an extra variable I've never seen: Ψ-null. The null consciousness coefficient. This formula could theoretically open a door to... nowhere. The space between spaces. Where the Source dwells." },

      // ── WORKBENCH SUB-RECTS (foreground bench items) ──
      // Authored AFTER crafting-bench + research-station so they win
      // clicks on specific items laid out across the benches.
      { id: "mystery-crafting-bench", name: "Bench Tool Layout", description: "The tools on the left workbench, set up for a fusion job that was never started. Worn to a left-handed engineer's thumb.", x: 20, y: 80, width: 6, height: 6, type: "interact", action: "room-mystery:engineering:crafting-bench" },
      { id: "instruction-manual", name: "Ark Instruction Manual", description: "A thick paper manual on the left workbench. Cracked spine, hand-stamped dedications.", x: 28, y: 80, width: 5, height: 6, type: "examine", action: "room-mystery:engineering:instruction-manual", elaraDialog: "INCEPTION ARK 1047 — QUICK START GUIDE. Page 1: Step 1, Don't let it get stolen. The author had a sense of humour and a complete absence of optimism." },
      { id: "schematic-pad", name: "Reactor Schematic Pad", description: "An unrolled blueprint on the left workbench. The lines are double-registered — warm-gold underneath, indigo on top, with three connection points subtly redirected.", x: 17, y: 88, width: 12, height: 7, type: "interact", action: "room-mystery:engineering:schematic-pad" },
      // Mystery wiring — Ith'Rael arc: Marion Kell physical-residue bench
      // Anchored on the small side-bench between the right foreground
      // workbench and the right-wall workstation, where centuries-old
      // untouched grain would be visible.
      { id: "kell-physical-residue-bench", name: "Kell's Residue Bench", description: "A side bench kept unmoved for centuries — Marion Kell's old workbench. The grain, the mug-rings, the undusted rectangle the Shadow Tongue never touched.", x: 63, y: 80, width: 7, height: 8, type: "interact", action: "room-mystery:engineering:kell-physical-residue-bench" },

      // ── RIGHT-WALL BULKHEAD EGG ──
      // Anchored on the right-wall workstation's lower bulkhead area
      // where the Warlord's neural residue would register on the
      // bio-scanner panel.
      { id: "egg-warlord-residue", name: "Bio-Scanner Anomaly", description: "The bio-scanner panel on the right-wall workstation flickers with an unidentified neural signature embedded in the bulkhead plating behind it.", x: 88, y: 60, width: 5, height: 6, type: "item", action: "warlord-residue", elaraDialog: "[SIGNAL DISTORTION] The bio-scanners are detecting... no. That can't be right. There's a neural signature embedded in the bulkhead plating itself. Not organic, not synthetic — something in between. The Warlord's consciousness was so powerful that it left an imprint on the ship's physical structure. Dr. Lyra Vox commanded this vessel while the Warlord used her as a host body. The walls literally remember their master. {playerName}, this ship has a darker history than I initially disclosed. The Warlord didn't just pass through here — this was a command vessel." },
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
      { id: "central-forge", name: "Prismatic Forge", description: "The main crafting station — stone-and-brass furnace with the forge fire chamber glowing orange. Step up to the bellows to begin a craft.", x: 28, y: 22, width: 27, height: 50, type: "terminal", action: "/forge", elaraDialog: "The Prismatic Forge. Its flames change color based on the materials you feed it — blue for void metal, green for crystal shards, gold for legendary essence. Step up to the forge and I'll guide you through the crafting process. Every item you create here provides real combat advantages in the Arena, strategic bonuses in Card Battles, and trade benefits in the Empire.",
        tiers: [
          { id: "tier_eng_forge_t2", requiredVisitCount: 2, responseId: "hs_eng_forge_t2" },
          { id: "tier_eng_forge_t3", requiredVisitCount: 3, responseId: "hs_eng_forge_t3" },
          { id: "tier_eng_forge_t5", requiredVisitCount: 5, responseId: "hs_eng_forge_t5_stutter" },
        ],
      },
      { id: "material-vault", name: "Material Vault", description: "The far-left wall is a stacked storage system: a round rack of rolled scrolls + a dark cabinet behind. Secured storage for crafting materials, organised by source and rarity.", x: 0, y: 25, width: 18, height: 40, type: "examine", elaraDialog: "The Material Vault. Your crafting materials are stored here — battle shards from Arena victories, trade metals from the Empire, card essence from sacrificed cards, and ark fragments from exploration. The vault automatically sorts by rarity. I'd recommend stockpiling before attempting any epic-tier recipes." },
      { id: "recipe-archive", name: "Recipe Archive", description: "The tool wall right of the forge — hammers, tongs, and rolled schematic panels mounted in brass brackets. Every known crafting recipe is catalogued here.", x: 47, y: 38, width: 15, height: 22, type: "terminal", action: "/forge", elaraDialog: "The Recipe Archive. Every known crafting recipe is catalogued here — weapons, armor, potions, ship upgrades, and card enhancements. Some recipes are locked behind skill levels. The more you craft in a discipline, the more advanced recipes become available. Master all five disciplines and you'll unlock the legendary-tier recipes." },
      { id: "skill-totems", name: "Skill Totems", description: "The tall carved brass throne at the right wall — five totem-medallions worked into the headrest and arms, one for each crafting discipline. Touch one to see your progress.", x: 75, y: 22, width: 24, height: 68, type: "examine", elaraDialog: "The Skill Totems — one for each crafting discipline. Weaponsmithing, Armorsmithing, Enchanting, Alchemy, and Engineering. They glow brighter as your skill increases. Touch one to see your progress. The engineers who built this place believed that mastery of all five disciplines was the key to creating the ultimate weapon — one that could end the war between the Architect and the Source." },
      { id: "door-engineering-forge", name: "Return to Engineering", description: "The blast door back to the Engineering Bay — walk out through the foreground.", x: 40, y: 93, width: 20, height: 6, type: "door", action: "engineering" },

      // ── FORGE-AREA MYSTERY SUB-RECTS ──
      // Authored AFTER central-forge so they win clicks on the anvil
      // pedestal + tool/diagram wall + quenching pool.
      { id: "anvil", name: "Anvil", description: "The anvil at the foot of the forge — centuries-old hardened brass on a steel base. The face is dished from a working life longer than most stars.", x: 47, y: 58, width: 13, height: 15, type: "interact", action: "room-mystery:forge-workshop:anvil" },
      { id: "schema-rack", name: "Schema Rack", description: "Rolled diagrams in the far-left scroll rack — weapon designs, armour patterns, prosthetic schematics. Most in Lyra's hand. A few in another.", x: 0, y: 28, width: 10, height: 32, type: "interact", action: "room-mystery:forge-workshop:schema-rack" },
      { id: "kiln", name: "Kiln", description: "The quenching pool in the left foreground — brass-bound clay rim around a hot bath. Cold now, but the chimney smells faintly of bay leaf.", x: 5, y: 72, width: 28, height: 22, type: "interact", action: "room-mystery:forge-workshop:kiln" },

      // ── ARCHITECT-CHANNEL MYSTERY RECTS (7) ──
      // Redistributed from the previous y=8/y=19 blank-wall band onto
      // visible surfaces around the workbench, cabinet, and throne.
      // Auro's side-room mysteries cluster on the cabinet (the
      // "side-room" reads as the small partitioned cabinet beside
      // the scroll rack); Solven/Othisen workshops on the throne
      // (architect's seat area); Tarn's letter + Blood Weave spec on
      // the recipe-archive tool wall.
      { id: "chained-auro-tally", name: "Auro's Twelve-Apprentice Notebook", description: "A small leather notebook hanging from a peg on the cabinet beside the scroll rack. Twelve names, forty-three waves held without further loss, nine years of work the Academy never paid for.", x: 12, y: 36, width: 5, height: 6, type: "interact", action: "room-mystery:forge-workshop:chained-auro-tally" },
      { id: "chained-auro-side-room", name: "Auro's Side-Room (Sub-Corridor Seven)", description: "The cabinet's interior panel — whiteboard, three chairs, a one-to-forty Terminus diorama. Where Auro teaches the module the Academy refuses to.", x: 12, y: 45, width: 5, height: 6, type: "interact", action: "room-mystery:forge-workshop:chained-auro-side-room" },
      { id: "chained-tarn-letter-to-the-case", name: "Tarn's Letter to the Case", description: "On the recipe-archive tool wall: a sealed letter Tarn left behind, addressed 'whoever finds this case' — naming the case as the reader's.", x: 49, y: 41, width: 5, height: 5, type: "interact", action: "room-mystery:forge-workshop:chained-tarn-letter-to-the-case" },
      { id: "advocate-weave-specification", name: "Blood Weave Partial Specification", description: "On the recipe-archive tool wall: the partial spec from Zyr'Koth's research archive. Multi-layer fabric, weaver-substrate intake, defensive-chain output; no regeneration; every binding consumes the weaver.", x: 55, y: 41, width: 5, height: 5, type: "interact", action: "room-mystery:forge-workshop:advocate-weave-specification" },
      { id: "infernal-blank-pages-archive", name: "PRELIMINARIES Box — Blank-Backed Pages", description: "On a low shelf inside the material-vault cabinet: forty unsigned blank-backed contract pages in a box labelled 'PRELIMINARIES.' Different paper-stock from the fronts.", x: 12, y: 54, width: 5, height: 5, type: "interact", action: "room-mystery:forge-workshop:infernal-blank-pages-archive" },
      { id: "charter2-solven-workshop", name: "Solven Workshop — Sector 8 Corridor 3", description: "On the throne's right-arm plaque: the Solven workshop record — empty but maintained, 'Open by appointment.' The appointment book is full, every entry signed by the same archivist who keeps the tax registry.", x: 77, y: 50, width: 5, height: 6, type: "interact", action: "room-mystery:forge-workshop:charter2-solven-workshop" },
      { id: "charter2-house-othisen", name: "House Othisen — Small-Engine Assemblers", description: "On the throne's left-arm plaque: House Othisen's assembly record — Trade Empire circuit-racer components for three epochs without recognition. Their charter clause was the longest of the four; the erasure was the cleanest.", x: 88, y: 50, width: 5, height: 6, type: "interact", action: "room-mystery:forge-workshop:charter2-house-othisen" },
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
      { id: "weapon-rack", name: "Weapon Rack", description: "A free-standing glass display case in the left-center holds high-grade weapons, with a wall-mounted rifle rack behind it. Most are locked behind security glass.", x: 15, y: 20, width: 35, height: 55, type: "examine", elaraDialog: "The weapon racks. Plasma swords, energy shields, cloaking devices... most are locked behind security glass. You'll need to prove yourself in combat before I can authorize access to the heavier ordnance.",
        tiers: [
          { id: "tier_arm_weapons_t2", requiredVisitCount: 2, responseId: "hs_arm_weapons_t2" },
          { id: "tier_arm_weapons_t3", requiredVisitCount: 3, responseId: "hs_arm_weapons_t3" },
        ],
      },
      { id: "combat-arena", name: "Combat Arena", description: "The raised circular armor dais at chamber center, ringed by a purple-glow aura. A holographic combat simulation arena for training.", x: 50, y: 25, width: 22, height: 55, type: "terminal", action: "/fight", elaraDialog: "The combat arena. Step inside and I'll generate holographic opponents based on known entities from the Dischordian Saga. It's the safest way to test your abilities... relatively safe.",
        tiers: [
          { id: "tier_arm_arena_t2", requiredVisitCount: 2, responseId: "hs_arm_arena_t2" },
          { id: "tier_arm_arena_t3", requiredVisitCount: 3, responseId: "hs_arm_arena_t3" },
          { id: "tier_arm_arena_t5", requiredVisitCount: 5, responseId: "hs_arm_arena_t5_stutter" },
        ],
      },
      { id: "quiz-terminal", name: "Knowledge Terminal", description: "The far-left corkboard of pinned mission cards — a terminal disguised as a duty board that tests your knowledge of the Dischordian lore.", x: 0, y: 20, width: 15, height: 55, type: "terminal", action: "/quiz", elaraDialog: "The Knowledge Terminal. It tests your understanding of the Dischordian Saga. Answer correctly and you'll earn rewards. Get them wrong and... well, there are no penalties. But I'll be disappointed." },
      { id: "card-battle-station", name: "Card Battle Station", description: "The left half of the right-side tool workbench — a tactical display surface for card game warfare.", x: 74, y: 62, width: 13, height: 17, type: "terminal", action: "/battle", elaraDialog: "The card battle station. Here you can engage in strategic card warfare — deploying your deck against AI opponents or other Potentials. Every victory earns you rewards and moves you closer to understanding the true nature of the conflict." },
      { id: "chess-table", name: "Strategy Table", description: "The right half of the right-side tool workbench — an ornate chess board with holographic pieces depicting Dischordian characters.", x: 87, y: 62, width: 11, height: 17, type: "terminal", action: "/chess", elaraDialog: "The Strategy Table. A chess variant using characters from the Dischordian Saga as pieces. Each character has unique abilities that modify the classic rules. It's not just a game — it's a test of tactical thinking. The AI opponent adapts to your skill level.",
        tiers: [
          { id: "tier_arm_chess_t2", requiredVisitCount: 2, responseId: "hs_arm_chess_t2" },
          { id: "tier_arm_chess_t3", requiredVisitCount: 3, responseId: "hs_arm_chess_t3" },
        ],
      },
      { id: "spectator-screen", name: "Spectator Screen", description: "The front edge of the right-side workbench — a wide screen showing live battles between other Potentials.", x: 74, y: 82, width: 24, height: 12, type: "terminal", action: "/spectate", elaraDialog: "The Spectator Screen. Watch live battles between other Potentials. Study their strategies, learn from their mistakes, and prepare for your own encounters." },

      // ── DOORS ──
      // door-engineering anchors on the back archway visible above the
      // dais. door-cargo has no visible representation — anchored as
      // an invisible click band on the bottom foreground.
      { id: "door-engineering", name: "Engineering Bay", description: "The back archway above the dais — return to Engineering.", x: 52, y: 20, width: 18, height: 10, type: "door", action: "engineering" },
      { id: "door-cargo", name: "Cargo Hold", description: "Stairs leading down to the Cargo Hold.", x: 40, y: 93, width: 20, height: 5, type: "door", action: "cargo-hold" },

      // ── SUB-RECTS (egg + mystery + NPC) ──
      // Authored AFTER container hotspots so they win clicks on
      // specific items.
      { id: "egg-armory-dogtag", name: "Fallen Dog Tag", description: "A military dog tag wedged between the floor plates at the base of the dais.", x: 35, y: 88, width: 3, height: 4, type: "item", action: "agent-zero-dogtag", elaraDialog: "A dog tag. Name: CLASSIFIED. Rank: Assassin, First Class. Unit: Insurgency Special Operations. Callsign: 'Agent Zero.' But wait — the biometric data on the tag doesn't match Agent Zero's profile. It matches... the Engineer. The mind swap. The Engineer is walking around in Agent Zero's body, hiding among the Potentials. On THIS ship." },
      { id: "motivational-poster", name: "Motivational Poster", description: "Pinned to the top corner of the left-wall corkboard — a faded poster showing a sunset with the text 'HANG IN THERE!' Signed in the corner: Iron Lion.", x: 4, y: 18, width: 5, height: 6, type: "examine", action: "room-mystery:armory:motivational-poster", elaraDialog: "Iron Lion's poster. He printed thousands of these. Most of them are gone. This one isn't. There is a cat in the bottom corner that I did not, until today, register." },

      // ── NPC PRESENCE (Phase C) ──
      // Agent Zero NPC primaryRoom = armory (factionNPCs.ts). Manifests
      // here once the egg-armory-dogtag clue has been logged. Authored
      // LAST so the projection wins clicks when manifested.
      { id: "npc-agent-zero", name: "Agent Zero", description: "A figure leaning against the wall-mounted rifle rack. Insurgency uniform, dog-tag at the throat, eyes that have already counted every exit.", x: 38, y: 50, width: 8, height: 18, type: "npc", action: "npc:agent_zero", npcId: "agent_zero" },
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
      { id: "trade-terminal", name: "Trade Empire Terminal", description: "The raised central dais with a mannequin standing in the middle of a flag-ring — the main terminal for the interstellar trade simulation.", x: 40, y: 25, width: 22, height: 50, type: "terminal", action: "/trade-empire", elaraDialog: "Trade Empire. An interstellar trade simulation based on the actual trade routes of the Dischordian universe. Buy low, sell high, avoid pirates, and build your trading empire. The credits you earn here are real — they can be spent in the store." },
      { id: "store-counter", name: "Requisitions Counter", description: "The red-curtained trading alcove right-of-center — a trading post where you can buy items with Dream tokens and credits.", x: 60, y: 35, width: 18, height: 45, type: "terminal", action: "/store", elaraDialog: "The Requisitions Counter. You can spend your Dream tokens and credits here on upgrades, card packs, cosmetics, and more. Some items are only available through the store." },
      { id: "marketplace-board", name: "Marketplace Board", description: "The ring of small flags above the central dais — a bustling exchange board showing buy and sell orders from Potentials across the Ark.", x: 37, y: 22, width: 28, height: 8, type: "terminal", action: "/marketplace", elaraDialog: "The Marketplace. A peer-to-peer exchange where Potentials trade cards, materials, and equipment. Prices fluctuate based on supply and demand. A shrewd trader can make a fortune here." },
      { id: "inventory-locker", name: "Personal Locker", description: "The left-wall recessed display cases — your secured locker containing collected items and equipment.", x: 0, y: 25, width: 14, height: 50, type: "terminal", action: "/inventory", elaraDialog: "Your personal inventory locker. Everything you've collected — weapons, armor, materials, consumables, and artifacts — is stored here. Organize your gear before heading into battle.",
        tiers: [
          { id: "tier_cargo_locker_t2", requiredVisitCount: 2, responseId: "hs_cargo_locker_t2" },
          { id: "tier_cargo_locker_t3", requiredVisitCount: 3, responseId: "hs_cargo_locker_t3" },
        ],
      },
      { id: "fleet-dock", name: "Fleet Docking Bay", description: "The right-wall recessed display cases — a viewport showing the Ark's auxiliary fleet of smaller vessels.", x: 85, y: 25, width: 14, height: 50, type: "terminal", action: "/fleet", elaraDialog: "The Fleet Docking Bay. Your auxiliary vessels are moored here — scout ships, cargo haulers, and combat frigates. Manage your fleet to expand your reach across the trade routes and war zones of the Saga.",
        tiers: [
          { id: "tier_cargo_fleet_t2", requiredVisitCount: 2, responseId: "hs_cargo_fleet_t2" },
          { id: "tier_cargo_fleet_t3", requiredVisitCount: 3, responseId: "hs_cargo_fleet_t3" },
        ],
      },
      { id: "mystery-crate", name: "Sealed Crate", description: "The stack of blue brass-cornered crates at left-center. The largest crate has claw marks on it — something was trying to get in... or out.", x: 15, y: 30, width: 28, height: 50, type: "examine", elaraDialog: "That crate... the claw marks are on the inside. Something was sealed in there and tried to get out. The manifest says it contained 'biological samples from Sector 7.' I've locked it down. Don't touch it.",
        tiers: [
          { id: "tier_cargo_crate_t2", requiredVisitCount: 2, responseId: "hs_cargo_crate_t2" },
          { id: "tier_cargo_crate_t3", requiredVisitCount: 3, responseId: "hs_cargo_crate_t3" },
          { id: "tier_cargo_crate_t5", requiredVisitCount: 5, responseId: "hs_cargo_crate_t5_stutter" },
        ],
      },

      // ── DOORS ──
      { id: "door-armory", name: "Armory Stairs", description: "Stairs leading up to the Armory.", x: 0, y: 78, width: 5, height: 18, type: "door", action: "armory" },
      { id: "door-captains", name: "Captain's Quarters", description: "A restricted access corridor to the Captain's Quarters.", x: 95, y: 78, width: 5, height: 18, type: "door", action: "captains-quarters" },

      // ── CRATE-STACK MYSTERY SUB-RECTS ──
      // The visible blue crate stack hosts the architect-channel
      // mysteries (passenger manifest, House Marek workshop log) and
      // the Hierarchy Cursed-Forest depot placard. Authored AFTER
      // mystery-crate so they win clicks on specific crate faces.
      { id: "resur-ark-passenger-manifest", name: "Inception Ark Passenger Manifest (Redacted)", description: "On the top crate's lid: the passenger-records page — seven names visible; eighth name redacted to a black bar of structural length. Not a casual erasure; a positioned occupant.", x: 18, y: 35, width: 5, height: 5, type: "interact", action: "room-mystery:cargo-hold:resur-ark-passenger-manifest" },
      { id: "charter2-house-marek", name: "House Marek — Toolmakers' Workshops", description: "On a side-crate stencilled 'HOUSE MAREK': three families, one tool-room, four epochs of continuous output. Same scrubber's hand on the charter-signature erasure.", x: 30, y: 35, width: 5, height: 5, type: "interact", action: "room-mystery:cargo-hold:charter2-house-marek" },
      { id: "the-cursed-forest-depot", name: "The Cursed-Forest Depot Placard", description: "A captured Hierarchy operations placard wired to the central crate — Fenra's domain filed not as a battlefield but as a logistics hub, the throughput corrupted souls, the depot dying under its own load.", x: 25, y: 55, width: 6, height: 6, type: "interact", action: "room-mystery:cargo-hold:the-cursed-forest-depot" },

      // ── FOREGROUND ITEMS ──
      // rubber-chicken on the small foreground-left table with the
      // glowing blue orb; egg-cargo-manifest on the floor compass-
      // star inlay between dais and foreground.
      { id: "rubber-chicken", name: "Rubber Chicken", description: "Hanging from the edge of the small foreground table with the glowing blue orb: a rubber chicken with a pulley in the middle. Why is this on a spaceship?", x: 17, y: 78, width: 5, height: 6, type: "examine", action: "room-mystery:cargo-hold:rubber-chicken", elaraDialog: "It's a rubber chicken with a pulley in the middle. I have no tactical assessment. I've failed you as an AI. Also — it has been here longer than any human I have ever known. Take that how you want." },
      { id: "egg-cargo-manifest", name: "Torn Manifest Page", description: "A torn page from the original cargo manifest, half-hidden beneath the central floor compass-star.", x: 50, y: 88, width: 4, height: 5, type: "item", action: "classified-manifest-page", elaraDialog: "A torn manifest page. Most of it is redacted, but one entry is legible: 'Container 7-Omega: BIOLOGICAL — Clone Template, Oracle-class. STATUS: Active. HANDLER: The Collector.' A clone template of the Oracle... on our ship. The False Prophet was made from an Oracle clone. Is there another one here? Is it awake?" },
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
      { id: "trophy-wall", name: "Trophy Wall", description: "The left-wall framed-portrait gallery — a holographic display showing your achievements and collected trophies.", x: 0, y: 25, width: 15, height: 45, type: "terminal", action: "/trophy", elaraDialog: "The Trophy Wall. Every achievement you've earned, every milestone you've reached. Dr. Vox designed this display system — she believed in cataloging everything. Obsessively. Now I wonder if that obsession was hers... or the Warlord's.",
        tiers: [
          { id: "tier_captains_trophy_t2", requiredVisitCount: 2, responseId: "hs_captains_trophy_t2" },
          { id: "tier_captains_trophy_t3", requiredVisitCount: 3, responseId: "hs_captains_trophy_t3" },
        ],
      },
      { id: "deck-builder", name: "Strategic Table", description: "The glass coffee table at the center of the chair circle — a large surface with holographic card projections for deck building.", x: 40, y: 68, width: 18, height: 15, type: "terminal", action: "/deck-builder", elaraDialog: "The Strategic Table. Dr. Vox used this to plan... well, officially it was 'neural network deployment patterns.' But the formations look military. She designed the nanobot operating system that runs every Ark — and the patterns suggest she knew exactly what those nanobots could really do. Now you can use it to build and refine your card decks. A well-built deck is the difference between victory and oblivion." },
      { id: "companion-quarters", name: "Companion Quarters", description: "The single bed/cot at left foreground — a cozy alcove with personal effects. Elara's space and room for another companion.", x: 0, y: 65, width: 22, height: 30, type: "terminal", action: "/companions", elaraDialog: "The Companion Quarters. This is where your companions rest between missions. Each companion has unique abilities and synergies with your build. Strengthen your bond and they'll fight harder for you." },
      { id: "battle-pass-console", name: "Season Terminal", description: "The captain's desk monitor — a terminal displaying the current season's challenges and reward tracks.", x: 40, y: 32, width: 14, height: 16, type: "terminal", action: "/battle-pass", elaraDialog: "The Season Terminal. Each season brings new challenges, exclusive rewards, and limited-time content. Progress through the reward track to earn unique cosmetics, cards, and materials." },
      { id: "morality-compass", name: "Morality Compass", description: "The cyan-glowing compass-star inlay set into the chamber floor at center-foreground — a crystalline measurement of the Ark's moral alignment.", x: 44, y: 86, width: 15, height: 10, type: "terminal", action: "/morality-census", elaraDialog: "The Morality Compass. It measures the collective moral alignment of all Potentials aboard the Ark. Every choice you make — order or chaos, mercy or justice — shifts the balance. The census reveals how the community's choices are shaping the Saga.",
        tiers: [
          { id: "tier_captains_morality_t2", requiredVisitCount: 2, responseId: "hs_captains_morality_t2" },
          { id: "tier_captains_morality_t3", requiredVisitCount: 3, responseId: "hs_captains_morality_t3" },
        ],
      },
      { id: "viewport-stars", name: "Star Viewport", description: "The cyan-glowing mirror/screen mounted on the back wall above the captain's desk — a viewport showing a nebula that seems to pulse with light.", x: 38, y: 22, width: 22, height: 20, type: "examine", elaraDialog: "That nebula... it wasn't there when we launched. It appeared three cycles ago and it's been growing. Sometimes I think it's watching us. That's not scientifically possible, of course. But I think it anyway.",
        tiers: [
          { id: "tier_captains_nebula_t2", requiredVisitCount: 2, responseId: "hs_captains_nebula_t2" },
          { id: "tier_captains_nebula_t3", requiredVisitCount: 3, responseId: "hs_captains_nebula_t3" },
          { id: "tier_captains_nebula_t5", requiredVisitCount: 5, responseId: "hs_captains_nebula_t5_stutter" },
        ],
      },

      // ── DOORS ──
      { id: "door-cargo", name: "Cargo Hold", description: "Return to the Cargo Hold.", x: 0, y: 88, width: 8, height: 10, type: "door", action: "cargo-hold" },
      { id: "door-library", name: "Hidden Passage", description: "A shimmering doorway that wasn't there before. It pulses with purple light.", x: 90, y: 0, width: 10, height: 22, type: "door", action: "antiquarian-library" },

      // ── PORTRAIT-WALL MYSTERY / ITEMS ──
      // Authored AFTER trophy-wall so they win clicks on specific
      // portrait frames.
      { id: "cat-photo", name: "Photo of a Cat", description: "A framed photo on the left portrait wall — a cat wearing tiny goggles. Label reads: 'Mr. Whiskers — Chief Science Officer.'", x: 4, y: 32, width: 4, height: 6, type: "examine", action: "room-mystery:captains-quarters:cat-photo", elaraDialog: "Mr. Whiskers. Chief Science Officer. Lyra hand-lettered the label. The cat is not looking at the camera; the cat is looking at her, who was behind it. I have been looking at this photograph for two hundred and thirty years." },
      { id: "egg-captain-mirror", name: "Cracked Mirror", description: "A small mirror tucked among the portraits, cracked in a spider-web pattern. Your reflection looks... wrong.", x: 4, y: 45, width: 5, height: 7, type: "examine", elaraDialog: "That mirror... look at your reflection. Do you see it? For a fraction of a second, your reflection moved differently than you did. It smiled when you didn't. The White Oracle — the face-changing guardian — was said to inhabit reflective surfaces. Some believe the Meme left the Oracle for dead and assumed his place — the shapeshifter hiding in plain sight. The universe believes the Meme was destroyed, but is it watching us through every mirror on this ship? How long has it been watching?" },

      // ── DESK MYSTERY CLUSTER (advocate + Locke + Coordinator + Director + Mechronis) ──
      // Six small mystery sub-rects on the captain's desk surface,
      // below the monitor. Each represents a specific document or
      // file the player can examine. Authored AFTER battle-pass-
      // console so they win clicks on the specific desk items.
      // Mystery wiring — advocate.blood_weave · e3 + e5
      { id: "advocate-three-generals-post-defection", name: "Three Generals — Post-Defection Logs", description: "On the desk's comm-console: the three Advocate-general post-defection logs. Each general reports the recruitment as 'a relief that did not feel like betrayal.'", x: 38, y: 50, width: 5, height: 5, type: "interact", action: "room-mystery:captains-quarters:advocate-three-generals-post-defection" },
      { id: "advocate-three-generals-current", name: "Three Generals — Current Status", description: "Pinned beside the post-defection logs: the three generals continue under Hierarchy doctrine, still carrying Advocate-countersigned shelter. The charter is operationally enforceable across factional crossings.", x: 44, y: 50, width: 5, height: 5, type: "interact", action: "room-mystery:captains-quarters:advocate-three-generals-current" },
      // Mystery wiring — Watcher arc (Locke-correspondence + Coordinator's summons)
      { id: "lockes-correspondence-cache", name: "Locke's Correspondence Cache", description: "A flat document cache on the desk's lower drawer — every post-act letter Lyra received from Adjudicar Locke, in order. Each signed only 'L.'", x: 50, y: 50, width: 5, height: 5, type: "interact", action: "room-mystery:captains-quarters:lockes-correspondence-cache" },
      { id: "the-coordinators-summons", name: "The Coordinator's Summons", description: "A meeting invitation on the desk, in Locke's hand, delivered by a courier on no Authority manifest. Signed, for the first time, 'The Coordinator.'", x: 38, y: 57, width: 5, height: 5, type: "interact", action: "room-mystery:captains-quarters:the-coordinators-summons" },
      // Mystery wiring — Ith'Rael arc (Director's summons + Mechronis cert)
      { id: "directors-handcouriered-summons", name: "The Director's Summons", description: "A second invitation beside Locke's on the desk, in a different hand — the only Hierarchy invitation that bypasses Hierarchy comms. Signed Ith'Rael, Director.", x: 44, y: 57, width: 5, height: 5, type: "interact", action: "room-mystery:captains-quarters:directors-handcouriered-summons" },
      { id: "mechronis-certification-file", name: "Mechronis Certification File", description: "A personnel file in the desk's operational drawer — the Mechronis Academy spy-class certification whose content hollowed across nine generations.", x: 50, y: 57, width: 5, height: 5, type: "interact", action: "room-mystery:captains-quarters:mechronis-certification-file" },

      // ── FOREGROUND-LEFT SIDE-DESK MYSTERY ──
      // Mystery wiring — Degen arc audit-prep + empty-chair surface
      { id: "degens-corner", name: "The Degen's Corner", description: "A small side-desk between the foreground bed and the chair-circle — the only piece of furniture in the captain's quarters that wasn't Lyra's. The Degen sat here on three documented evenings before her death.", x: 22, y: 72, width: 12, height: 16, type: "interact", action: "room-mystery:captains-quarters:degens-corner" },

      // ── RIGHT BOOKSHELF MYSTERY / ITEMS ──
      // Authored AFTER companion-quarters so they win clicks on
      // specific bookshelf positions.
      { id: "vex-workshop-diary", name: "Vex's Workshop Diary", description: "A small book on the right bookshelf, second shelf — Vex Solène's workshop diary, the spine worn from forty years of opening.", x: 66, y: 28, width: 10, height: 40, type: "interact", action: "room-mystery:captains-quarters:vex-workshop-diary" },
      { id: "egg-vox-personal-log", name: "Dr. Vox's Personal Terminal", description: "A hidden terminal panel revealed behind the right bookshelf, still powered. The screen shows encrypted files.", x: 68, y: 42, width: 5, height: 5, type: "item", action: "vox-personal-log", elaraDialog: "Dr. Lyra Vox's personal terminal. Let me try to decrypt... 'Day 1,247. The Warlord's voice grows louder. I can no longer distinguish my thoughts from its commands. The Thought Virus is complete — the Warden and I have created something that will reshape consciousness itself. But I am losing myself. Today I looked in the mirror and saw the Warlord looking back. Tomorrow I will order the Recruiter's transfer to this vessel. He is already infected — Project Vector saw to that. He is Patient Zero, and he doesn't know it. When Kael steals this ship, the virus will walk aboard with him. Every system he touches will be contaminated from day one. The Source will be born from the ashes of the Recruiter's rage. And the Warlord will have won without ever raising a weapon.' She knew. She knew everything." },

      // ── RIGHT-WALL MAINTENANCE PANEL EGG ──
      { id: "egg-kael-escape-hatch", name: "Forced Access Panel", description: "A maintenance panel on the right wall, behind the small foreground bed — pried open with brute force. Tool marks scar the metal.", x: 82, y: 72, width: 5, height: 8, type: "item", action: "kael-escape-route", elaraDialog: "These tool marks... they're not from standard maintenance equipment. Someone forced this panel open in a hurry. The scratches are deep — desperate. Behind it is an emergency access tunnel that connects directly to the shuttle bay. This is how Kael escaped. The Recruiter turned insurgent turned prisoner. He broke out of the Panopticon, fought his way to this ship, and used this exact tunnel to reach the bridge and override the launch sequence. But look — there's no damage to the security systems. The locks were already disengaged. Dr. Lyra Vox — the Warlord — opened the doors for him. Kael's great escape was a guided tour." },
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
      { id: "charter-silt-fragment", name: "The Charter Fragment", description: "On the central reading table, under archival glass — a scrap of hand-cured vellum. Six legible signatures; the seventh sealed under a black blister of mineralised wax.", x: 1, y: 8, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-silt-fragment" },
      { id: "charter-advocate-signature", name: "The Advocate's Marginalia", description: "Beside the charter fragment on the reading table — a high-resolution rubbing of the charter's reverse. The Advocate's counter-signature carries the only witness annotation on the founding document.", x: 6, y: 8, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-advocate-signature" },
      { id: "tarn-empty-lectern", name: "Tarn's Empty Lectern", description: "Professor Tarn's lectern at the rostrum end of the library, polished pearwood with brass piano-hinges. The binder is missing; a glass of water sits cold on the speaker's shelf.", x: 11, y: 8, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:tarn-empty-lectern" },
      { id: "tarn-folded-robe", name: "Tarn's Folded Robe", description: "Tarn's green-wool faculty robe folded twice on the lectern's bench — sleeves splayed, collar tucked. The fold she keeps on Fridays. Today is Tuesday.", x: 1, y: 15, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:tarn-folded-robe" },
      { id: "tarn-marginalia-stack", name: "Tarn's Marginalia, Three Volumes", description: "Three books lifted from the shelf behind the lectern — chess primer, the Antiquarian's marginalia compendium, Roen's trial-procedure manual — each carrying Tarn's annotations down the side gutters.", x: 6, y: 15, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:tarn-marginalia-stack" },
      { id: "charter-mirror-charter", name: "The Mirror Charter", description: "A second pane of glass on the reading table — the four-house delegation's mirror of the founding charter, brought in this morning. Eight signatures, not seven.", x: 11, y: 15, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-mirror-charter" },
      { id: "charter-eighth-clause", name: "The Eighth Clause Overlay", description: "A transparency overlay sliding from the catalog drawer — the mirror charter's body text laid against the founding charter's, exposing the thirty-four line clause one copy carries and the other never did.", x: 1, y: 22, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-eighth-clause" },
      { id: "infernal-epoch-one-contract", name: "Zyr'Koth's Epoch-One Contract", description: "Spread on the reading table: the DMC season contract Zyr'Koth produced at Nilmorg's ceremony. Front in standard form; back carrying a paragraph that has been quietly enforceable for forty seasons.", x: 6, y: 22, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:infernal-epoch-one-contract" },
      { id: "infernal-clause-back-page", name: "The Infernal Clause", description: "Under archival glass: the back-page paragraph itself. 'In the event of the champion's death, the soul-bond may be claimed by the Hierarchy in lieu of the second-cycle prize.'", x: 11, y: 22, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:infernal-clause-back-page" },
      { id: "chained-apprentice-history", name: "Your Apprentice's File", description: "The catalog's apprentice drawer — your sponsored apprentice's enrolment, transcript, and roof-assignment. Top of cohort for two terms; countersigned by the Dean and by an off-faculty instructor named Auro.", x: 1, y: 29, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:chained-apprentice-history" },
      { id: "chained-curriculum-diff", name: "Curriculum Diff — League vs Academy", description: "Two curricula on the reading table: the league's tower-defense drill curriculum beside the Academy's. The cipher-den has done the diff; one module is missing from the Academy side and only one.", x: 6, y: 29, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:chained-curriculum-diff" },
      { id: "chained-auro-folio", name: "Auro's Module 17 Folio", description: "An eleven-page folio Sergeant Auro brought in at second bell — 'Module 17 — Feint Recognition,' written from memory and combat experience by a teacher the Academy has refused to pay.", x: 11, y: 29, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:chained-auro-folio" },
      { id: "tarn-year-eight-marginalia", name: "Tarn's Year-Eight Retraction", description: "The last leaf of the Antiquarian's marginalia compendium, in Tarn's hand at Year 8 — six lines retracting her Year-One curriculum argument and naming the cost. The Dean has not turned this leaf in six years.", x: 1, y: 36, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:tarn-year-eight-marginalia" },
      { id: "watchers-per-m-confirms", name: "Per. M.'s Confirmation of the Seventh Role", description: "In the central reading dome: the Antiquarian's signed minute of the conversation with Per. M. — confirming the seventh Watcher and the Closer-of-the-charter are the same role.", x: 6, y: 36, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:watchers-per-m-confirms" },
      { id: "infernal-first-clause-date", name: "Forty Clauses — Contemporaneous Dates", description: "On the contract-cross-reference shelf: every clause's date matches the contract's signing week — within a seven-day window. So is every clause.", x: 11, y: 36, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:infernal-first-clause-date" },
      { id: "infernal-solene-recollection", name: "Solène's Audit-Witness Recollection", description: "On the audit-witness shelf: 'the contracts came back from the season-end audit with the clauses already on them. I never saw the clauses being written.'", x: 1, y: 43, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:infernal-solene-recollection" },
      { id: "infernal-atalin-status", name: "Atalin's Current Status", description: "On the staff-roster annex shelf: Atalin is alive. Eighty-six. Lower-deck sector eleven. Has not spoken to anyone from the league in forty seasons.", x: 6, y: 43, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:infernal-atalin-status" },
      { id: "infernal-atalin-account", name: "Atalin's Forty-Year Account", description: "On the closer's-room recording: 'I wrote them because the Hierarchy would have written them if I refused. I wrote them with a flaw. I have been making myself easy to find for forty seasons.'", x: 11, y: 43, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:infernal-atalin-account" },
      { id: "infernal-atalin-at-rite", name: "Atalin at the Closing Rite", description: "On the closing-rite seating chart: Atalin sits beside Solène. They have not been in a public room in forty seasons. They cry once when the Advocate names them. They do not cry again.", x: 1, y: 50, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:infernal-atalin-at-rite" },
      { id: "charter2-solven-kept-record", name: "Solven Household Ledger", description: "On the reading-dome's delegation table: continuous Solven workshop records from founding to today. Customers the Architect has on no roster.", x: 6, y: 50, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter2-solven-kept-record" },
      { id: "charter2-per-m-meeting", name: "Per. M.'s Closer Office — Year-Two Meeting", description: "In Per. M.'s office annex: the closer is older. The lamp still burns. The drawer is still locked. Per. M. listens for thirty-three minutes before speaking.", x: 11, y: 50, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter2-per-m-meeting" },
      { id: "charter2-per-m-clarification", name: "Per. M.'s Silence-as-Vote Clarification", description: "Beside the meeting record: 'The seventh did not sign the scrub. The seventh has been holding the silence as a kind of vote. The Council has been counting the silence wrong.'", x: 1, y: 57, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter2-per-m-clarification" },
      { id: "charter2-charter-addendum", name: "Charter Addendum — Eight Again", description: "On the closing-rite shelf: the folio sewn to both charters. 'We eight signed; we six scrubbed; we four kept; we eight again.'", x: 6, y: 57, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter2-charter-addendum" },
      { id: "charter-signatory-almir", name: "Almir of the Bow — First Signature", description: "On the founding-signatures rubbing wall: Almir's signature. The first crown-bearer. Plain, almost bored — signed last because Almir was the rider.", x: 11, y: 57, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-signatory-almir" },
      { id: "charter-signatory-house-quill", name: "Three Sisters of House Quill", description: "Beside Almir's: sigils two, three, four. A ladder, eldest at the top; the youngest's loop runs into where the seventh signature should begin.", x: 1, y: 64, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-signatory-house-quill" },
      { id: "charter-witness-annotation", name: "Advocate's Marginalia — 'Six Speak'", description: "On the back of the charter, the Advocate's annotation: 'six speak; one listens; one of us is the silence.' Read correctly for the first time.", x: 6, y: 64, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-witness-annotation" },
      { id: "charter-archivist-office", name: "Per. M.'s Office (Four Corridors Down)", description: "Four corridors down: door unlocked, desk occupied. The lamp has burned for twenty-two unbroken epochs — its filament mineralised the same way the wax is.", x: 11, y: 64, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-archivist-office" },
      { id: "charter-staff-roster", name: "Library Staff Roster — Per. M. Absent", description: "Per. M. does not appear on any roster. Key, office, desk, lamp, signature on every preservation order — but not paid, hired, or registered.", x: 1, y: 71, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-staff-roster" },
      { id: "charter-player-inscribes", name: "Seventh-Signature Inscription Choice", description: "On the closing-rite scroll: the empty seventh signature line is open for inscription. The player chooses whether to inscribe a name or leave it blank.", x: 6, y: 71, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:charter-player-inscribes" },
      { id: "severance-second-witness-broker", name: "Broker of Nilmorg — Profile", description: "In the back-room observation alcove: the aging Broker who lives in the back rooms of the Trade Empire's Nilmorg sector. Will not give a name. Pays for the candle.", x: 11, y: 71, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:severance-second-witness-broker" },
      { id: "severance-back-room-chairs", name: "Forty-One Chairs (Back Room Photograph)", description: "In the Severance-reliquary alcove: forty-one mismatched chairs, each facing a shelf at eye-height holding a glass jar with a faint blue glow.", x: 85, y: 8, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:severance-back-room-chairs" },
      { id: "severance-broker-first-chair", name: "Chair One — Reserved Annotation", description: "Beside the chairs photograph: 'Chair One is reserved. I sit there each season after the bond is poured. I have not yet failed to stand.'", x: 89, y: 8, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:severance-broker-first-chair" },
      { id: "severance-jar-inventory", name: "Forty-One-Jar Inventory", description: "On the jar-inventory shelf: forty-one jars. The first jar is heaviest; its glow is steadier. The most recent jar is empty, waiting for tonight's bond.", x: 93, y: 8, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:severance-jar-inventory" },
      { id: "severance-first-chair-log", name: "First-Chair Hidden Ledger", description: "Pulled from inside Chair One's cushion: a small ledger. Forty entries. Each a date and one word: 'stood.'", x: 85, y: 15, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:severance-first-chair-log" },
      { id: "severance-player-choice-record", name: "Apprentice First-Refusal Record", description: "On the apprentice-choice display: 'sit if you can. don't if you can't. either way, the protocol is written tonight.'", x: 89, y: 15, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:severance-player-choice-record" },
      { id: "memorial-first-volume", name: "Year of the Lost — First Volume", description: "On the chronicle-shelf: hand-bound, leather-quilted, 812 pages. Seven hundred ninety-eight names inscribed; fourteen pages blank with 'unwitnessed' in pencil.", x: 93, y: 15, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:memorial-first-volume" },
      { id: "memorial-torn-page", name: "Keeper's Log — Torn Page", description: "In the log fragment-drawer: the keeper's log torn at the page that should contain the fourteenth imprint's id. The tear is old; the keeper does not remember.", x: 85, y: 22, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:memorial-torn-page" },
      { id: "memorial-fourteen-inscribed", name: "Closing-Rite Volume — All Inscribed", description: "Beside the first volume: the volume closed at last bell. Eight hundred and twelve names — and one folio of additional inscriptions for I-1.", x: 89, y: 22, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:memorial-fourteen-inscribed" },
      { id: "memorial-player-carrier-choice", name: "Carrier-Choice — Volume Disposition", description: "The Antiquarian's question: 'will you leave the volume in the library, or carry it back, by hand, to the imprint room? both are honest.' The choice is the player's.", x: 93, y: 22, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:memorial-player-carrier-choice" },
      { id: "tarn-lore-proposal", name: "Lore Faculty Proposal — Veth", description: "On the Lore-faculty submissions shelf: six modules, archive-heavy, citing Tarn's seminar series on the Antiquarian's marginalia.", x: 85, y: 29, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:tarn-lore-proposal" },
      { id: "tarn-binder-recovered", name: "Tarn's Binder, Recovered", description: "On Tarn's desk: twenty-two pages, weighted by a pebble. Page one is the resignation. Page twenty-two reads: 'vote on the curriculum, not on me.'", x: 89, y: 29, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:tarn-binder-recovered" },
      { id: "tarn-curriculum-on-desk", name: "Tarn's Curriculum — Cleaned for Council", description: "Beside the binder: twenty pages copied for the Council. Tarn's authorship line is left blank by Roen. The blank is the choice the player will resolve.", x: 93, y: 29, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:tarn-curriculum-on-desk" },
      { id: "tarn-pebble", name: "Tarn's Pebble", description: "On Tarn's desk under the binder: a grey, water-smoothed lower-deck stone. The pebble is heavier than it looks. The Dean has been weighing it during the vote-prep.", x: 85, y: 36, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:tarn-pebble" },
      { id: "watchers-communique-appendix", name: "Communiqué Appendix — Year-Two", description: "On the communiqué-appendix shelf: the Antiquarian's single-page addition to the year's Council communiqué. One year to consider what the seventh's role might be named.", x: 89, y: 36, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:watchers-communique-appendix" },
      { id: "watchers-seventh-appendix", name: "Memorial Plaza Volume — Seventh Appendix", description: "In the final folio: 'I will not be named until the Ark has named what I am for.' A blank page sewn beside six.", x: 93, y: 36, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:watchers-seventh-appendix" },
      { id: "watchers-six-lines-inscribed", name: "Six Watcher-Lines, Inscribed", description: "On the Memorial Plaza shelf: six Watcher-role descriptions hand-copied by the Antiquarian, sewn between Aren's name and Year-3 inscriptions.", x: 85, y: 43, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:watchers-six-lines-inscribed" },
      { id: "resur-antiquarians-unknown-entry", name: "Antiquarian's 'Unknown' Entry", description: "On the chronicle-open-archive shelf: 'unknown — case shelved at last review.' A small later annotation in a different hand: 'kept current.' The annotator is not named.", x: 89, y: 43, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:resur-antiquarians-unknown-entry" },
      { id: "resur-cult-curated-terminus-map", name: "Cult-Curated Terminus Map", description: "On the chronicle-reference wall: seven walking figures around the Source Kael. Six match first-wave Potential silhouettes. The seventh wears a long-beaked mask.", x: 93, y: 43, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:resur-cult-curated-terminus-map" },
      { id: "akai-jericho-witness-page", name: "Jericho's Witness Page", description: "On the Thaloria-archive shelf: Jericho Jones's hour-after-mercy witness page. 'Akai Shi was already gone. I did the work she would have asked me to do.'", x: 85, y: 50, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:akai-jericho-witness-page" },
      { id: "akai-targets-list", name: "Red Death — Open Targets List", description: "In the case-files drawer: fourteen entities the Red Death has eliminated. Each entry carries a date, a place, and the chronicler's note.", x: 89, y: 50, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:akai-targets-list" },
      { id: "akai-kill-record", name: "Necromancer Kill — Day 15 of Fracture", description: "On the case-closure shelf: the Antiquarian's record entry for Day 15 of Fracture, Year 117,046 A.A. The kind of mercy chosen: clean.", x: 93, y: 50, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:akai-kill-record" },
      { id: "akai-red-death-returns", name: "Red Death Returns from the Matrix", description: "Beside the kill record: twelve cycles after the kill, the Red Death exits the Matrix through the same fold. Unchanged. Time-displacement band intact. Targets list now closed.", x: 85, y: 57, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:akai-red-death-returns" },
      { id: "akai-case-closes", name: "Case File Closes", description: "The Antiquarian's closing seal: 'The case being closed does not mean the case-bearer is.' The arc the Resurrectionist authored is complete.", x: 89, y: 57, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:akai-case-closes" },
      { id: "advocate-closing-walk-in-power-broadcast", name: "Closing 'Walk in Power' Broadcast", description: "In the case-closure playback alcove: the duet's final cadence, captured live from a current Empire-of-Shadows transmission tower. The Antiquarian's canonical closure for the arc.", x: 93, y: 57, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:advocate-closing-walk-in-power-broadcast" },
      { id: "wolf-journal-xxxviii", name: "Antiquarian's Journal Entry XXXVIII", description: "On the chronicle-current shelf: 'Anara. My creation. My refuge. My failure.' The Antiquarian's hand-written admission of his pocket-universe's design flaw.", x: 85, y: 64, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:wolf-journal-xxxviii" },
      { id: "wolf-corruption-ledger", name: "Wolf's Predator-Ledger", description: "In the Anara-affairs drawer: the Quarchon-hand ledger matching Lycos's archived sample. Four entries, three 'mercy: n', one 'mercy: y'.", x: 89, y: 64, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:wolf-corruption-ledger" },
      { id: "wolf-antiquarians-admission", name: "Antiquarian's Design-Failure Admission", description: "On the Anara design-failure shelf: the Antiquarian's pressed admission of moving heroes into Anara without verifying the Wolf's containment.", x: 93, y: 64, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:wolf-antiquarians-admission" },
      { id: "wolf-first-words-recording", name: "Wolf's First Words (Reanimation)", description: "In the cosmic-archaeology audio drawer: the Wolf's first words at reanimation. 'I will give the chronicle the kind of mercy I was given: clean.'", x: 85, y: 71, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:wolf-first-words-recording" },
      { id: "wolf-current-position", name: "Wolf's Current Position (Hall of Disappearances)", description: "On the Anara live-tracking board: the Wolf in the Hall of Disappearances for three cycles. Three more heroes scheduled to enter.", x: 89, y: 71, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:wolf-current-position" },
      { id: "wolf-antiquarians-concession", name: "Antiquarian's Closing Concession", description: "On the case-closure shelf: 'I cannot ask the chronicle's reader to resolve what I designed wrong. I can only ask: walk into the Hall.'", x: 93, y: 71, width: 4, height: 6, type: "interact", action: "room-mystery:antiquarian-library:wolf-antiquarians-concession" },
      { id: "wolf-hall-threshold", name: "Hall of Disappearances — Diagram", description: "On the threshold-record shelf: a circular chamber with twelve niches, each holding an empty pedestal. The chamber's ceremonial geometry annotated.", x: 55, y: 33, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:wolf-hall-threshold" },
      { id: "storm-dossier-quote", name: "Storm Dossier — Operational Sentence", description: "On the right-wall upper bookshelf (cosmic-archaeology section): the Storm's dossier open at its operational sentence. Older than every active Ne-Yon.", x: 59, y: 33, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:storm-dossier-quote" },
      { id: "storm-polarity-lyric-record", name: "Polarity — Lyric Record", description: "On the right-wall upper bookshelf (lyric-records row): the Book of Daniel 2:47 'Polarity' record, signed in the Enigma's hand. The 12th Ne-Yon's endorsement of the Storm/Silence pairing.", x: 63, y: 33, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:storm-polarity-lyric-record" },
      { id: "storm-dreamers-noted-entry", name: "Dreamer's One-Word Entry on the Storm", description: "On the right-wall upper bookshelf (Dreamer-archive section): the Dreamer's library carries one entry on the Storm — 'noted.' Nothing else.", x: 67, y: 33, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:storm-dreamers-noted-entry" },
      { id: "storm-eternal-active-status", name: "Storm Dossier Status: Active", description: "On the right-wall upper bookshelf (dossier-status row): the Storm reads Active despite the Degen-bible's 'only one still awake.' A productive ambiguity the case does not resolve.", x: 55, y: 39, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:storm-eternal-active-status" },
      { id: "chained-tarn-residency-marginalia", name: "Tarn's Residency Marginalia", description: "On the marginalia shelf: Tarn's Year-Two notebook annotation naming Module 17 as the module the Academy will not teach.", x: 59, y: 39, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:chained-tarn-residency-marginalia" },
      { id: "chained-auro-at-rite", name: "Auro at the Closing Rite", description: "In the case-rite annex: the Antiquarian's hand-written note on Auro's attendance. She nods once when Tarn's name is read. She does not nod when the Dean apologises.", x: 63, y: 39, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:chained-auro-at-rite" },
      { id: "wolf-empty-chair", name: "Anara League-Hall Reproduction (Empty Chair)", description: "In a quiet annex off the central dome: the Antiquarian's scaled twelve-chair reproduction of Anara's League hall. One chair stands empty; the Antiquarian has annotated it 'WHO TOOK THEM.'", x: 67, y: 39, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:wolf-empty-chair" },
      { id: "wolf-three-empty-chairs", name: "The Cataloguer's Pattern Wall", description: "On the wall behind the reading dome: three more re-coloured chairs. Medic, signals officer, tactician, residue-specialist healer. The pattern stopped being absence the morning the healer's chair emptied.", x: 55, y: 45, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:wolf-three-empty-chairs" },
      { id: "akai-resurrectionist-seal", name: "Resurrectionist's Recovery Seal", description: "On the central reading table: the Cycle Walker's wheel-and-thread seal pulled from Akai Shi's recovery manifest. The same seal appears on the Wolf's reanimation centuries later.", x: 59, y: 45, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:akai-resurrectionist-seal" },
      { id: "resur-plague-mask-seal", name: "Resurrectionist Case-File Seal", description: "In the cosmic-archaeology drawer: forty case-files, every one stamped with the same long-beaked plague-mask seal. The cult calls the seal ceremonial; the pre-Empire references catalogue it as a worn object.", x: 63, y: 45, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:resur-plague-mask-seal" },
      { id: "resur-pre-empire-twin-text", name: "Pre-Empire Twin-Ne-Yon Fragment", description: "Under archival glass on the cosmic-archaeology shelf: 'the death-bound and the cycle-bound walk in pairs.' The cult reads metaphor; the pre-Empire references read literal taxonomy.", x: 67, y: 45, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:resur-pre-empire-twin-text" },
      { id: "advocate-founding-charter", name: "Empire of Shadows Founding Charter", description: "Under archival glass: the founding charter, the Advocate's signature at the foot, six co-signatures following — five legible, the sixth self-redacted in her own hand.", x: 55, y: 51, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:advocate-founding-charter" },
      { id: "advocate-humanity-trade-spec", name: "Humanity-Trade Operational Specification", description: "On the Empire-of-Shadows shelf: the Advocate's itemised trade spec — three components surrendered to power the Weave, charter, and the unconditional shelter. Authored by her, in register three.", x: 59, y: 51, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:advocate-humanity-trade-spec" },
      { id: "loredex-lectern", name: "The Loredex", description: "The left-center lectern with open book on a brass pedestal — the Antiquarian's living chronicle, the part he lets you walk yourself.", x: 30, y: 32, width: 12, height: 22, type: "terminal", action: "/loredex", elaraDialog: "The Loredex. The Antiquarian is one of the Two Witnesses, and this is the chronicle he lets you read on your own feet. Everything you uncover is written here.",
        tiers: [
          { id: "tier_library_loredex_t2", requiredVisitCount: 2, responseId: "hs_library_loredex_t2" },
          { id: "tier_library_loredex_t3", requiredVisitCount: 3, responseId: "hs_library_loredex_t3" },
        ],
      },
      { id: "orb-of-worlds", name: "The Orb of Worlds", description: "The bronze candle-lamp at the center of the reading table — a golden orb hovering above a leather glove. Inside, a miniature city glows with warm light, its tiny streets and buildings shifting as you watch.", x: 45, y: 38, width: 10, height: 18, type: "terminal", action: "/conexus", elaraDialog: "The Orb of Worlds. The Antiquarian uses it to observe every timeline simultaneously. That city inside — it's not a model. It's a real city, compressed into a pocket of folded space. Touch it and the CoNexus portal opens. You can step into any story from the Dischordian Saga and live it yourself. The AI adapts to your choices. No two journeys are ever the same." },
      { id: "ancient-tomes", name: "Ancient Tomes", description: "The floor-to-ceiling left-wall bookshelves — leather-bound books pulsing with faint inner light. Each spine bears a title from the Dischordian Saga.", x: 0, y: 5, width: 15, height: 85, type: "terminal", action: "/conexus", elaraDialog: "These aren't ordinary books. Each one is a gateway to a CoNexus story game. The Necromancer's Lair, Awaken the Clone, Sundown Bazaar... the Antiquarian has catalogued every major event in the Saga as an interactive narrative. Pick one up and you'll be pulled into the story.",
        tiers: [
          { id: "tier_library_tomes_t2", requiredVisitCount: 2, responseId: "hs_library_tomes_t2" },
          { id: "tier_library_tomes_t3", requiredVisitCount: 3, responseId: "hs_library_tomes_t3" },
        ],
      },
      { id: "data-crystals", name: "Glowing Data Crystals", description: "Crystalline structures embedded in the shelves, each containing compressed narratives from different Ages.", x: 63, y: 51, width: 4, height: 5, type: "examine", elaraDialog: "Data crystals from every Age of the Saga. The Age of Privacy, the Age of Revelation, the Fall of Reality, the Age of Potentials. Each crystal contains thousands of branching narratives — every possible outcome of every possible choice. The Antiquarian has been collecting them for millennia." },
      { id: "antiquarian-desk", name: "The Antiquarian's Desk", description: "An ornate desk covered in star charts, ancient manuscripts, and a leather glove that seems to move on its own.", x: 67, y: 51, width: 4, height: 5, type: "examine", elaraDialog: "The Antiquarian's personal desk. Star charts from universes that no longer exist. Manuscripts written in languages that were never spoken by mortal tongues. And that glove — it's a neural interface, designed to connect directly with the Orb. The Antiquarian doesn't just watch the timelines. He feels them. Every joy, every sorrow, every death — he experiences it all." },
      { id: "star-ceiling", name: "Living Star Map", description: "The domed ceiling displays constellations that move and shift, showing the positions of stars across multiple timelines.", x: 55, y: 57, width: 4, height: 5, type: "examine", elaraDialog: "The ceiling shows star maps from every major timeline in the Saga. Watch — the constellations shift as different realities branch and collapse. Each point of light is a universe. Some are thriving. Some are dying. Some have already been consumed by the Terminus Swarm. The Antiquarian watches them all.",
        tiers: [
          { id: "tier_library_ceiling_t2", requiredVisitCount: 2, responseId: "hs_library_ceiling_t2" },
          { id: "tier_library_ceiling_t3", requiredVisitCount: 3, responseId: "hs_library_ceiling_t3" },
          { id: "tier_library_ceiling_t5", requiredVisitCount: 5, responseId: "hs_library_ceiling_t5_stutter" },
        ],
      },
      { id: "door-captains", name: "Return to Captain's Quarters", description: "The brass-framed circular door at the back of the chamber with the Antiquarian's seal — a shimmering portal back to the Ark.", x: 43, y: 22, width: 16, height: 30, type: "door", action: "captains-quarters" },
      { id: "egg-library-prophecy", name: "Hidden Prophecy", description: "A single page, glowing faintly, tucked behind a shelf. It seems to have been placed here deliberately.", x: 59, y: 57, width: 4, height: 5, type: "item", action: "antiquarian-prophecy", elaraDialog: "A prophecy written in the Antiquarian's own hand. 'When the seventh seal breaks and silence falls upon heaven, the Orb will shatter and the stories will become real. The Potentials will face the final choice: to end the Saga or begin it anew. The Programmer dies so the Antiquarian can live. The Antiquarian lives so the stories can be told. And the stories are told so that you — yes, you, the one reading this — can choose.' He's... he's talking to us directly. He knew we would find this. He planned for everything." },
      { id: "card-catalog", name: "Card Catalogue", description: "A brass-bound card catalogue beside the desk. Pre-Ark inventory of every story the Antiquarian has ever filed.", x: 63, y: 57, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:card-catalog" },
      { id: "locked-vault", name: "Locked Vault", description: "A small reinforced vault recessed into the bookshelf — sealed by the Antiquarian against his own future readings.", x: 67, y: 57, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:locked-vault" },
      { id: "antiquarian-bust", name: "Antiquarian's Bust", description: "A marble bust of the Antiquarian on a pedestal. Eyes inlaid with phosphor-lavender glass.", x: 28, y: 58, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:antiquarian-bust" },
      { id: "hierophants-marginalia-stack", name: "Hierophant's Marginalia Stack", description: "A small stack of catalog cards in the desk's far corner, every card bearing the Hierophant's preserved marginalia.", x: 37, y: 58, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:hierophants-marginalia-stack" },
      { id: "codas-purpose-shelf", name: "Coda's Purpose Shelf", description: "A small dedicated shelf the Antiquarian set aside for the seven inter-faction trustee bodies. The Coda's section is the largest.", x: 46, y: 58, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:codas-purpose-shelf" },
      { id: "velkraals-correspondence-folio", name: "Velkraal's Correspondence Folio", description: "A leather folio on the desk's far-left corner. Velkraal'Sek's correspondence, posthumous letters, and the draft of his closing edit.", x: 55, y: 58, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:velkraals-correspondence-folio" },
      { id: "insurgency-witness-roster", name: "Insurgency Witness Roster", description: "A small bound register on the Insurgency-affairs shelf. The saga's only complete acknowledged-witness list for Vex Solène's recording career.", x: 64, y: 58, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:insurgency-witness-roster" },
      { id: "ocularum-founding-record", name: "Ocularum Founding Record", description: "A bound folio on the desk's near edge, indexed under a glyph the Antiquarian files nowhere else: an eye watching an eye. The Lord Kanshi Sha record.", x: 28, y: 63, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:ocularum-founding-record" },
      { id: "antiquarian-redaction-ledger", name: "Antiquarian's Redaction Ledger", description: "A thin ledger beside the founding folio — the Antiquarian's own record of what his archive does not contain, and why.", x: 37, y: 63, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:antiquarian-redaction-ledger" },
      { id: "directors-doctrine-folio", name: "The Director's Doctrine Folio", description: "A slim grey folio in the Hierarchy-affairs section — a Department of Special Projects standing instruction, signed Ith'Rael, Director.", x: 46, y: 63, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:directors-doctrine-folio" },
      { id: "shadow-tongue-casebook", name: "The Shadow Tongue Casebook", description: "A casebook on the editor-studies shelf — the Marion Kell editing read slowly, and the first failure in four hundred years.", x: 55, y: 63, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:shadow-tongue-casebook" },
      { id: "thaloria-generational-ledger", name: "Thaloria's Generational Ledger", description: "A ledger on the Thaloria-affairs shelf — the Director's recovered engagement notes in his own hand. 'Tested on cohort 4. Holds.'", x: 64, y: 63, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:thaloria-generational-ledger" },
      { id: "siege-keep-witness-fragments", name: "Siege-Keep Witness Fragments", description: "A slim sheaf in the New Babylon-affairs section, indexed under the keep, not the siege — witness fragments recorded inside the inner keep after the perimeter fell.", x: 28, y: 68, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:siege-keep-witness-fragments" },
      { id: "programmer-infiltration-dossier", name: "The Programmer Infiltration Dossier", description: "A dossier filed under a glyph used nowhere else here — a door with no map. The path into the besieged keep, and the hand that walked it.", x: 37, y: 68, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:programmer-infiltration-dossier" },
      { id: "insurance-policy-design-file", name: "The Insurance Policy Design File", description: "A design file in the Authority-origin section: the Politician's own phrase for the Six Imprisoned Minds — 'her Insurance Policy.'", x: 46, y: 68, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:insurance-policy-design-file" },
      { id: "two-witnesses-closing-ledger", name: "The Two Witnesses Closing Ledger", description: "A closing ledger on the case-synthesis shelf — the whole arc assembled in one hand, written by the man it convicts.", x: 55, y: 68, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:two-witnesses-closing-ledger" },
      { id: "collector-catalog-page", name: "The Collector's Catalog Page", description: "A single page in a hand that grieves nothing — the Collector's. Specimen Forty-One: a discipline kept, the donor body not retained.", x: 64, y: 68, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:collector-catalog-page" },
      { id: "collectors-redacted-anomaly", name: "The Collector's Redacted Anomaly", description: "An entry under the Antiquarian's own redaction-discipline — the one 'donor retained, by request,' dated the year of the Fall, the requester struck out.", x: 28, y: 73, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:collectors-redacted-anomaly" },
      { id: "collector-case-closing-ledger", name: "The Collector Case-Closing Ledger", description: "A closing ledger on the case-synthesis shelf — the Collector arc assembled in one hand, the verdict deliberately left open.", x: 37, y: 73, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:collector-case-closing-ledger" },
      { id: "varkul-vigil-cross-catalog", name: "The Varkul Vigil Cross-Catalogue", description: "A cross-catalogued observation under the Antiquarian's glyph for a vigil with no end — what a centuries-long unbroken post does to the one who holds it.", x: 46, y: 73, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:varkul-vigil-cross-catalog" },
      { id: "varkul-testimony-boundary-file", name: "The Varkul Testimony-Boundary File", description: "A boundary file in the Antiquarian's hand — not what Varkul said, but the precise edge of it, and the case the Two Witnesses leave open.", x: 55, y: 73, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:varkul-testimony-boundary-file" },
      { id: "akai-shi-witness-statements", name: "Akai Shi's Witness Statements", description: "Akai Shi's testimony, canonized in the Two Witnesses' chronicle — the killing through the throne, and the second statement that does not retract it.", x: 64, y: 73, width: 7, height: 4, type: "interact", action: "room-mystery:antiquarian-library:akai-shi-witness-statements" },
      { id: "necromancer-case-closing-ledger", name: "The Necromancer Case-Closing Ledger", description: "A closing ledger on the case-synthesis shelf — the Necromancer arc assembled in one hand, the dual-reading closure deliberately left open.", x: 44, y: 10, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:necromancer-case-closing-ledger" },
      { id: "zyr-koth-sisters-and-closing-ledger", name: "The Sisters-of-the-Weave Cross & Closing Ledger", description: "A cross-catalogue under the glyph for a record with a name struck out — three students of the Blood Weave — filed beside the Zyr'Koth case-synthesis ledger and its closing question.", x: 50, y: 10, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:zyr-koth-sisters-and-closing-ledger" },
      { id: "syl-vex-sisters-of-the-weave", name: "The Sisters-of-the-Weave Pedigree", description: "A pre-Severance Thaloria cross-reference under the glyph for a lineage with a name worn off — one lost-named instructor, three students of the Blood Weave, one struck from the Hierarchy's record.", x: 56, y: 10, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:syl-vex-sisters-of-the-weave" },
      { id: "riri-ahlia-closing-ledger", name: "The Taskmaster's Closing Ledger", description: "A case-synthesis ledger under the glyph for a portfolio entry that never closed — the siege filed as a quarter assembled in one hand, and the genuine tri-verdict closing question the archive pre-judges none of.", x: 44, y: 16, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:riri-ahlia-closing-ledger" },
      { id: "fenra-door-and-engine", name: "The Door-and-Engine Folio", description: "A cross-catalogued folio filed beside the Varkul vigil cross-catalogue — the Necromancer's two senior creations as one design, and the asymmetry that Varkul receives the maker's signal and Fenra does not.", x: 50, y: 16, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:fenra-door-and-engine" },
      { id: "fenra-closing-ledger", name: "The Fenra Closing Ledger", description: "The case-synthesis ledger under the glyph for an engine that does not stop — the Fenra arc assembled in one hand, and the genuine tri-verdict closing question that closes the §XVI Mystery Engine roster, pre-judging none.", x: 56, y: 16, width: 4, height: 5, type: "interact", action: "room-mystery:antiquarian-library:fenra-closing-ledger" },
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

      { id: "reactor-core", name: "Reactor Core", description: "The central-back orange-glowing reactor pylon with clock/gauge dial — a sphere of pure energy suspended by magnetic fields, pulsing with the heartbeat of the Ark.", x: 40, y: 18, width: 20, height: 38, type: "examine", elaraDialog: "The Reactor Core. It runs on compressed dark energy harvested from collapsed dimensions. The DeMagi called it 'The Breath of Creation.' It generates enough power to fold space-time. The Architect modified it to also serve as a beacon — broadcasting across every reality simultaneously. That's how the Ark finds lost Potentials like you." },
      { id: "warp-schematics", name: "Warp Drive Schematics", description: "The right-side wall panel with brass-rimmed inset — holographic blueprints showing the Ark's dimensional fold engine in extraordinary detail.", x: 62, y: 22, width: 22, height: 30, type: "examine", elaraDialog: "These schematics show the Ark's warp drive — but not the one in Engineering Bay. This is the real drive. It doesn't move through space. It folds space around the Ark. The Architect reverse-engineered it from Quarchon quantum tunneling technology. Only an Engineer would understand the mathematics involved." },
      { id: "door-engineering", name: "Return to Engineering Bay", description: "The right-edge sealed blast door back to the main engineering section.", x: 88, y: 30, width: 10, height: 50, type: "door", action: "engineering" },
      { id: "reactor-coil", name: "Reactor Coil", description: "The left-foreground workbench's brass-and-steel column running phosphor-green coolant — the hardware is nominal; the schematic is not.", x: 25, y: 55, width: 16, height: 22, type: "interact", action: "room-mystery:engineering-core:reactor-coil" },
      { id: "coolant-pipe", name: "Coolant Pipe Array", description: "The right-foreground workbench's six coolant lines feeding the secondary loop. The pipes are correct; any future repair following the edited schematic would reroute them.", x: 58, y: 55, width: 16, height: 22, type: "interact", action: "room-mystery:engineering-core:coolant-pipe" },
      { id: "core-terminal", name: "Core Terminal", description: "The small left-wall console with three oxblood-leather levers — coolant flow, reactor draw, emergency shutdown. The shutdown lever is locked.", x: 0, y: 30, width: 14, height: 30, type: "interact", action: "room-mystery:engineering-core:core-terminal" },
      { id: "egg-core-frequency", name: "Resonance Frequency", description: "A specific harmonic emanating from the foreground floor channel — the steam-vented strip seems to encode a message.", x: 46, y: 88, width: 8, height: 4, type: "item", action: "core-frequency", elaraDialog: "That frequency... it's not random. It's a message encoded in the core's harmonic oscillation. The Architect left it here for whoever found this room. It says: 'The machine remembers what the maker forgets. Build well, Engineer. The next Ark is yours to design.'" },

      // ── ARCHITECT-CHANNEL MYSTERY RECTS (7) ──
      // Redistributed from y=8 blank-wall onto the actual visible
      // workbench surfaces: left bench (founding-records / substrate-
      // research benches) + right bench (substrate-timestamp /
      // calibration-class benches).
      { id: "storm-flux-signature", name: "Storm-Class Flux Signature", description: "On the left workbench (calibration-class instrument): a non-natural flux signature detectable wherever the equilibrium-crossing pattern shows. The convention names it 'Storm-class.' Nothing else does.", x: 27, y: 60, width: 5, height: 5, type: "interact", action: "room-mystery:engineering-core:storm-flux-signature" },
      { id: "storm-energy-balance-audit", name: "Cosmic Energy-Balance Audit", description: "On the left workbench (Game Master's audit panel): volatility-source and fixed-archive-source instrumented against the Polarity canon, their interaction-product yielding the universe's net positive.", x: 33, y: 60, width: 5, height: 5, type: "interact", action: "room-mystery:engineering-core:storm-energy-balance-audit" },
      { id: "advocate-zyrkoth-protocol-lineage", name: "Severance Protocol — Lineage Note", description: "On the left workbench (substrate-research panel): Zyr'Koth's lineage note — the Severance Protocol is the Blood Weave's offensive inversion. Both share the substrate-consumption signature.", x: 27, y: 67, width: 5, height: 5, type: "interact", action: "room-mystery:engineering-core:advocate-zyrkoth-protocol-lineage" },
      { id: "resur-protocol-activation-timestamp", name: "Resurrection-Protocol Activation Timestamp", description: "On the right workbench (substrate-timestamp bench): a protocol activation timestamped to the Plague Dragon's death-instant. The cult calls the timestamp coincidental; the Antiquarian's discipline does not.", x: 60, y: 60, width: 5, height: 5, type: "interact", action: "room-mystery:engineering-core:resur-protocol-activation-timestamp" },
      { id: "resur-matrix-escape-signature", name: "Necromancer Matrix-Escape Cipher Match", description: "Pinned beside on the right workbench: the Necromancer's Matrix-escape signature matching three of four parts of the Resurrectionist's cipher.", x: 66, y: 60, width: 5, height: 5, type: "interact", action: "room-mystery:engineering-core:resur-matrix-escape-signature" },
      { id: "charter-signatory-engineer-zero", name: "Engineer Zero — Initialled Signature", description: "On the right workbench (founding-records bench): Engineer Zero's signature, initialled rather than written. A clean Z above a horizontal bar. The bar runs into the wax.", x: 60, y: 67, width: 5, height: 5, type: "interact", action: "room-mystery:engineering-core:charter-signatory-engineer-zero" },
      { id: "charter2-house-vyn", name: "House Vyn — Lower-Deck Hydroponic Gardens", description: "On the right workbench (lower-deck-hydroponics console): kept by Vyn descendants for four epochs. Same scrubber's hand on their tax-record erasure.", x: 66, y: 67, width: 5, height: 5, type: "interact", action: "room-mystery:engineering-core:charter2-house-vyn" },
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
      { id: "infernal-advocate-engaged", name: "Advocate Engaged — First Question", description: "In the Council-retainer chamber: the Advocate engaged within minutes of Zyr'Koth's arrival. First question: 'how many other contracts carry this clause?'", x: 22, y: 35, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:infernal-advocate-engaged" },
      { id: "infernal-advocate-observation", name: "Advocate's Date-Forgery Observation", description: "On the Advocate's audit-bench: 'each clause is dated to the contract's signing week. but the dates are forged.'", x: 30, y: 35, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:infernal-advocate-observation" },
      { id: "infernal-zyrkoth-withdraws", name: "Zyr'Koth's Formal Withdrawal", description: "On the Council-record desk: 'the claim is withdrawn. the audit was honest.' Ceremonial fee of one hundred dream tokens for the audit's costs.", x: 38, y: 35, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:infernal-zyrkoth-withdraws" },
      { id: "infernal-bond-poured", name: "Bond Poured — Year Two", description: "On the closing-rite ceremonial stand: Solène pours the season's bond into the empty jar. The chair is sat in by the apprentice (or by Solène alone). The bond is calm.", x: 46, y: 35, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:infernal-bond-poured" },
      // Mystery wiring — charter.second_signatory · e5 (Kassel's Council speech)
      { id: "charter2-kassel-at-council", name: "Kassel's Council-Chamber Speech", description: "In the Council-chamber recording: Kassel's eight-minute speech. She names Heron, the six founders, the seventh's silence as the no-vote it always was. She does not name the seventh.", x: 14, y: 35, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:charter2-kassel-at-council" },
      // Mystery wiring — charter.missing_signatory · color (oracle-sanctum)
      { id: "charter-first-reading", name: "Antiquarian's First Reading Recording", description: "On the first-bell recording: the Antiquarian read the charter aloud to an empty chamber and could not continue at the seventh signature for almost a minute. The recording survives.", x: 78, y: 27, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:charter-first-reading" },
      { id: "charter-confrontation-record", name: "Per. M. Confrontation — Admissible Record", description: "On the confrontation-record shelf: Per. M.'s direct answer. 'I sealed it. I will not say more, and I will not unseal it.'", x: 86, y: 27, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:charter-confrontation-record" },
      { id: "charter-final-conversation", name: "Closer's Account — Thirty-Eight Minutes", description: "On the closing-day record: Per. M. speaks for thirty-eight minutes. A Watcher signed the founding charter, accepted the post of closer, sealed their own name. Both will end together.", x: 6, y: 35, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:charter-final-conversation" },
      // Mystery wiring — severance.bound_champion · color (oracle-sanctum)
      { id: "severance-companion-on-table", name: "Companion on the Witness Table", description: "On the witness-table: a first-circuit eidolon ribboned with the champion's colors. Bond strength reads at peak. Looking for someone they can no longer find.", x: 46, y: 27, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:severance-companion-on-table" },
      { id: "severance-broker-record", name: "Broker's Recorded Statement", description: "On the recorded-statements console: 'I picked up the first bond because no one else would. I've been picking them up because no one else has learned.'", x: 54, y: 27, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:severance-broker-record" },
      { id: "severance-successor-test", name: "Successor-Test Recording", description: "Beside the Broker's record: 'pour the bond into the empty jar; sit in chair one; stand when you can.' If you cannot stand, Klessa pours the wax.", x: 62, y: 27, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:severance-successor-test" },
      { id: "severance-bond-poured", name: "Bond Poured at Second-to-Last Bell", description: "On the closing-rite ceremonial stand: the companion's bond decanted into the empty jar. The jar weighs slightly more than every previous jar — no one knows why. The bond is calm.", x: 70, y: 27, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:severance-bond-poured" },
      // Mystery wiring — memorial.forgotten_names · color (oracle-sanctum)
      { id: "memorial-plaza-register", name: "Plaza Inscription Register — Opening", description: "In the plaza-register alcove: the first three inscriptions are quiet. The fourth player hesitates at the unwitnessed pages.", x: 22, y: 27, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:memorial-plaza-register" },
      { id: "memorial-plaza-consensus", name: "Plaza Consensus — Twenty-Three Names for I-1", description: "In the closing-rite alcove: three minutes of silence, then twenty-three names from twenty-three players. The keeper writes them all down.", x: 30, y: 27, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:memorial-plaza-consensus" },
      { id: "memorial-aren-reading", name: "Aren's Three-Hour Closing Reading", description: "On the closing-recording desk: Aren of the lower decks reads the volume aloud at last bell. Three hours. One forty-five-second pause at I-1's folio.", x: 38, y: 27, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:memorial-aren-reading" },
      // Mystery wiring — mechronis.missing_professor · color (oracle-sanctum)
      { id: "tarn-dean-account", name: "Dean's Last-Sighting Recording", description: "In the witness chamber: the Dean saw Tarn at second bell, walking with the binder toward the festival hall. The Dean did not walk with her — the last hundred steps alone, always.", x: 85, y: 19, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:tarn-dean-account" },
      { id: "tarn-othmar-admission", name: "Othmar's Admission", description: "On the faculty-confession board: 'I voted aye because Veth would have voted aye. I was wrong about Veth. I am not sorry I was wrong.'", x: 93, y: 19, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:tarn-othmar-admission" },
      { id: "tarn-roen-admission", name: "Roen's Admission", description: "Beside Othmar's: 'I voted aye because Othmar would. I have a private reason and I will not say it here.' Roen will say it in episode four.", x: 6, y: 27, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:tarn-roen-admission" },
      { id: "tarn-veth-admission", name: "Veth's Admission", description: "Beside Roen's: 'I voted aye because Roen would. I have been telling myself for a week that I voted aye because the curriculum needed it. I have not been honest.'", x: 14, y: 27, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:tarn-veth-admission" },
      // Mystery wiring — memorial.seven_watchers · color (oracle-sanctum)
      { id: "watchers-player-received-line", name: "Player's Personal Watcher-Line", description: "In the personal-line alcove: the line addressed to the player, six minutes after Seal VII broke. Single sentence. Personalised to the player's saga-choices.", x: 61, y: 19, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:watchers-player-received-line" },
      { id: "watchers-player-line-match", name: "Watcher Line-Matching Console", description: "Beside the personal-line alcove: the line-matching console runs the player's case-history against the six Watcher signatures to identify the speaker.", x: 69, y: 19, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:watchers-player-line-match" },
      { id: "watchers-player-speaker-assignment", name: "Watcher Speaker-Assignment Resolution", description: "On the speaker-assignment console: cross-referencing the player's case-history against the six role-registry entries. The audience the player has belonged to most identifies the speaker.", x: 77, y: 19, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:watchers-player-speaker-assignment" },
      // Mystery wiring — akai_shi.red_death · e2 (Dreamer's quarantine filing)
      { id: "akai-dreamer-quarantine", name: "Dreamer's Quarantine on the Reanimation", description: "In the Ne-Yon arbitration alcove: the Dreamer's quarantine filing on the Resurrectionist's actions in the wake of Akai Shi's reanimation. Canonically open; never lifted.", x: 53, y: 19, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:akai-dreamer-quarantine" },
      // Mystery wiring — mechronis.chained_lesson · color (oracle-sanctum)
      { id: "chained-apprentice-quotes", name: "Apprentice After-Action Recordings", description: "In the witness chamber: three apprentices, three different years, three identical lines about reading the formation as a real approach.", x: 21, y: 19, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:chained-apprentice-quotes" },
      { id: "chained-auro-account", name: "Auro's Statement to the Sanctum", description: "Beside the apprentice recordings: Auro's short statement. 'I teach because the apprentices need it. I do not need a chair.'", x: 29, y: 19, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:chained-auro-account" },
      { id: "chained-lyra-advocacy", name: "Lyra Vox's Advocacy Note", description: "On the advocacy log: Lyra's decision to dedicate tonight's album track to Auro. 'I am tired of waiting for someone else to start.'", x: 37, y: 19, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:chained-lyra-advocacy" },
      { id: "chained-lyra-album-track", name: "Festival-Album Track 16", description: "In the playback alcove: Track 16 plays at the closing rite. 'Sergeant who taught the module the Academy would not — we hear you.'", x: 45, y: 19, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:chained-lyra-album-track" },
      // Mystery wiring — mechronis.missing_professor · e4 (recording + pebble)
      { id: "tarn-pebble-recording", name: "Tarn's Recorded Message", description: "In the playback alcove: the recording Tarn set to play at festival opening. The recorder failed to fire; the sanctum staff recovered it intact two evenings later.", x: 6, y: 8, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:tarn-pebble-recording" },
      // Mystery wiring — memorial.forgotten_names · e1 (Antiquarian's plaza request)
      { id: "memorial-antiquarian-plaza-request", name: "Antiquarian's Plaza Address", description: "In the witness chamber: the Antiquarian's first-bell address asking the gathered players to witness fourteen imprints — and the plaza's immediate, ready response.", x: 13, y: 19, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:memorial-antiquarian-plaza-request" },
      // Mystery wiring — charter.second_signatory · e2 (Kassel's testimony)
      { id: "charter2-kassel-testimony", name: "Kassel Solven's Testimony", description: "The sanctum's witness-chamber recording of Kassel Solven's eight-minute statement: four generations of waiting, a workshop kept across four epochs of administrative absence.", x: 20, y: 30, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:charter2-kassel-testimony" },
      // Mystery wiring — severance.infernal_clause · e4 (Zyr'Koth's concession)
      { id: "infernal-zyrkoth-concession", name: "Zyr'Koth's Concession Recording", description: "In the witness chamber: Zyr'Koth's recorded response to the Advocate's brief, read into the Council record. A long pause, then concession.", x: 27, y: 41, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:infernal-zyrkoth-concession" },
      // Mystery wiring — advocate.blood_weave · e4 (CoNexus story 'The Ninth')
      { id: "advocate-ninth-conexus-story", name: "CoNexus Story — 'The Ninth'", description: "In the CoNexus playback alcove: the Advocate's own narrated meditation on the ninth position. Steady register-three liturgical pace across the full duration.", x: 34, y: 52, width: 6, height: 6, type: "interact", action: "room-mystery:oracle-sanctum:advocate-ninth-conexus-story" },
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
      { id: "probability-sphere", name: "Probability Sphere", description: "The back-wall vaulted oculus showing the purple nebula — a window onto compressed probability fields.", x: 25, y: 0, width: 50, height: 28, type: "examine", elaraDialog: "The Probability Sphere. It contains every possible future of the Dischordian Saga compressed into a single point. When an Oracle touches it, they can navigate the probability streams — see which choices lead to salvation and which lead to destruction. The original Oracle used this to guide the Panopticon's decisions. Now it responds to you." },
      { id: "meditation-platforms", name: "Meditation Platforms", description: "The floor compass rings encircling the central pool — hovering platforms that amplify precognitive abilities.", x: 18, y: 78, width: 64, height: 18, type: "examine", elaraDialog: "These platforms use quantum entanglement to synchronize your neural patterns with the probability field. Sit on one and your visions become clearer, more detailed. The original Oracle spent centuries here, mapping every possible future. Some say they went mad from seeing too much. Others say they achieved perfect clarity." },
      { id: "door-observation", name: "Return to Observation Deck", description: "The shimmering portal back to the Observation Deck.", x: 0, y: 90, width: 8, height: 10, type: "door", action: "observation-deck" },
      { id: "egg-oracle-vision", name: "Sealed Vision", description: "A sealed crystal on the side-altar — a single frozen vision the Oracle locked away.", x: 14, y: 65, width: 5, height: 6, type: "item", action: "oracle-vision", elaraDialog: "A sealed vision. The Oracle locked this one away because it was too dangerous to share. It shows... the end. The final moment of the Saga. I can't see the details — only an Oracle can unseal it. But the emotion radiating from it is overwhelming. Hope and terror in equal measure." },
      // Mystery wiring — apps/shared/roomMysteries/oracleSanctum.ts
      { id: "oracle-pool", name: "Oracle Pool", description: "The central glowing purple/cyan pool sunk into the floor — brass-rimmed and sigil-engraved. The water reflects something that is not in the pool.", x: 28, y: 50, width: 40, height: 32, type: "interact", action: "room-mystery:oracle-sanctum:oracle-pool" },
      { id: "prophecy-tablet", name: "Prophecy Tablet", description: "The left-side lectern with candle — a brass-pedestal'd slate. Currently blank, but the brass beneath has been worn smooth by thousands of writings.", x: 8, y: 50, width: 14, height: 28, type: "interact", action: "room-mystery:oracle-sanctum:prophecy-tablet" },
      { id: "incense-brazier", name: "Incense Brazier", description: "The right-side brazier with green flame on a chain, smoking phosphor-lavender. The smoke falls toward the pool rather than rising.", x: 78, y: 55, width: 16, height: 25, type: "interact", action: "room-mystery:oracle-sanctum:incense-brazier" },
      // Mystery wiring — apps/shared/roomMysteries/oracleSanctum.ts
      // Seer arc clue surface; recessed back-wall cabinet behind the
      // brazier with reel-tape canisters indexed by session.
      { id: "seers-recording-cabinet", name: "Seer's Recording Cabinet", description: "A recessed brass-bound glass-fronted cabinet behind the brazier. Hand-typed labels on every reel-tape canister.", x: 80, y: 56, width: 16, height: 22, type: "interact", action: "room-mystery:oracle-sanctum:seers-recording-cabinet" },
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
      { id: "charter-per-m-pencil-reply", name: "Per. M.'s Pencil Reply", description: "Inside the correspondence drawer: the founding-Watcher's letter to Per. M., stapled to a three-word pencil reply. 'I will close.'", x: 6, y: 8, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:charter-per-m-pencil-reply" },
      // Mystery wiring — severance.bound_champion · e4 (apprentice oath)
      { id: "severance-apprentice-oath", name: "The Apprentice Oath", description: "In the classified-correspondence drawer: eight hand-written lines, no signature. 'I will pour the bond and sit until I can stand.' Waiting forty seasons for a successor.", x: 13, y: 19, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:severance-apprentice-oath" },
      // Mystery wiring — memorial.forgotten_names · e2 (Imprint I-17 + keeper's account)
      { id: "memorial-imprint-i17-aren", name: "Imprint I-17 — Aren of the Lower Decks", description: "On the imprint-room's cold-shelf: dish I-17 lifted to the listening cradle. Aren named themselves at the moment of imprinting; the plaza inscribes them without a second witness.", x: 20, y: 30, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-imprint-i17-aren" },
      { id: "memorial-imprint-keeper-account", name: "Imprint-Keeper's Thirty-Year Account", description: "On the imprint-room's reading desk: the keeper's signed statement. Every imprint can be heard; the fourteen are not difficult to read, only to write.", x: 28, y: 30, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-imprint-keeper-account" },
      // Mystery wiring — charter.second_signatory · e3 (Council's scrub request)
      { id: "charter2-council-scrub-request", name: "The Council's Scrub Request", description: "Inside the classified-correspondence drawer: the fourth-epoch request signed by all six legible founders. The seventh signature line is wax-eaten in the same way the charter is.", x: 27, y: 41, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:charter2-council-scrub-request" },
      // Mystery wiring — memorial.seven_watchers · e2 + e4 (Idris's role + seventh's unwritten line)
      { id: "watchers-idris-archive-role", name: "Idris's Archived Role Registry", description: "Inside the role registry: Idris's archived entry — 'speaks to investigators when the investigator has earned the speaking-to.' Per. M.'s footnote on the earning.", x: 34, y: 52, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-idris-archive-role" },
      { id: "watchers-line-in-apprentice-hand", name: "The Seventh's Unwritten Line", description: "In the classified drawer: the seventh slot. No name, no band, no audience — a single line in Per. M.'s hand: 'I will not be named until the Ark has named what I am for.'", x: 42, y: 52, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-line-in-apprentice-hand" },
      // Mystery wiring — resurrectionist.cycle_walker · e3 + e4 (Necromancer at kill-site + Silence claim)
      { id: "resur-necromancer-at-killsite", name: "Necromancer's Last Recorded Appearance", description: "In the classified faction-witness drawer: the Necromancer at the Plague Dragon kill-site, arriving at the death-instant and departing within minutes. The cult calls it forensic; the Archon does not perform forensics.", x: 41, y: 63, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:resur-necromancer-at-killsite" },
      { id: "resur-silence-body-claim", name: "Silence's Body-Claim Record", description: "On the Ne-Yon body-claim shelf: the Silence's record. A plague-mask seal at the lower-left corner — the only Ne-Yon body-claim record in the chronicle carrying such a seal.", x: 49, y: 63, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:resur-silence-body-claim" },
      // Mystery wiring — charter.missing_signatory · color (shadow-vault)
      { id: "charter-absent-artifact", name: "Per. M.'s Sealed-Inside Drawer", description: "In the empty-drawer alcove: Per. M.'s desk drawer is sealed. The lock is the same alloy as the wax. The Advocate writes that the drawer was sealed from the inside.", x: 46, y: 92, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:charter-absent-artifact" },
      { id: "charter-draft-inventory", name: "Forty-One Charter Drafts", description: "In the unsealed-drawer drawer: forty-one drafts of the founding charter, every one with seven signatures, every seventh sealed by wax. Per. M.'s habit is older than the charter.", x: 54, y: 92, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:charter-draft-inventory" },
      { id: "charter-opening-question", name: "Drawer's Opening Question", description: "On the inside of Per. M.'s sealed drawer: 'WHO DOES NOT WISH TO BE NAMED?' Beneath, in pencil: 'I do not.'", x: 62, y: 92, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:charter-opening-question" },
      { id: "charter-preservation-letter", name: "Founding-Watcher's Letter to Per. M.", description: "Among the drafts: a letter signed in the wax-thumb hand. 'You will not be named. You will not be forgotten. You will be the one who closes the seal.'", x: 70, y: 92, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:charter-preservation-letter" },
      { id: "charter-next-year-hook", name: "Per. M.'s Next-Year Recording", description: "On the long-arrangement shelf: 'whoever names me next year will be naming a Watcher who has been the silence longer than any of us has been alive. Be ready for what they say back.'", x: 78, y: 92, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:charter-next-year-hook" },
      // Mystery wiring — severance.bound_champion · e2 (Year One envelope, thick)
      { id: "severance-year-one-envelope", name: "Year-One Envelope (Two Pages)", description: "In the founding-records drawer: the first Severance's envelope is thicker. Page two contains a hand-drawn diagram with a fourth figure marked only by a circle and the word 'first.'", x: 38, y: 92, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:severance-year-one-envelope" },
      // Mystery wiring — memorial.forgotten_names · color (shadow-vault, imprint room)
      { id: "memorial-imprint-room", name: "Imprint Room — Fourteen Obsidian Dishes", description: "In the imprint-room alcove: fourteen obsidian dishes on a low shelf. Each dish small enough to hold in a palm. The room is cold by design.", x: 62, y: 84, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-imprint-room" },
      { id: "memorial-imprint-i3", name: "Imprint I-3 — Child's Voice", description: "Dish I-3 lifted to the cradle. A child's voice. 'Tell my mother I am here.' No name. The mother is one of the fourteen.", x: 70, y: 84, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-imprint-i3" },
      { id: "memorial-imprint-i44", name: "Imprint I-44 — Forgotten Own Name", description: "Dish I-44 on the cold-shelf. 'I forgot it. I forgot my own name. Tell whoever finds me to write it for me.'", x: 78, y: 84, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-imprint-i44" },
      { id: "memorial-three-children", name: "Three Children Without Witnesses", description: "On the children-without-witnesses shelf: Aren self-named; the three remaining are I-44, I-244, and the torn-page child (fragment reads 'I-1').", x: 86, y: 84, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-three-children" },
      { id: "memorial-elder-refusal-reason", name: "Elder's Refusal — Recorded Reason", description: "Pinned to the keeper's log: I-155's side-note. 'I am not refusing my name; I am refusing to be named in a hurry. The plaza will arrive.'", x: 6, y: 92, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-elder-refusal-reason" },
      { id: "memorial-dish-listening", name: "I-1 Dish — Three-Year-First Listening", description: "The keeper opens the alcove. The dish is read for the first time in three years. A child's voice between three and five. 'I am here. I will be here.'", x: 14, y: 92, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-dish-listening" },
      { id: "memorial-imprint-i1-dish", name: "Imprint I-1's Sealed Alcove Dish", description: "Smaller than the others. Older. Held in a separate alcove with its own lock. The keeper has held the key for three years and has never opened the alcove.", x: 22, y: 92, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-imprint-i1-dish" },
      { id: "memorial-next-year-hook", name: "Antiquarian's Next-Year Hook", description: "On the next-year hook shelf: 'the seventh Watcher is silent because the seventh Watcher has not yet been asked. next Memorial Day, six of the seven will speak.'", x: 30, y: 92, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:memorial-next-year-hook" },
      // Mystery wiring — memorial.seven_watchers · color (shadow-vault, role registry)
      { id: "watchers-verel-archive-role", name: "Verel — Archived Role", description: "In the role-registry drawer: 'Verel of the carrying-band — speaks to caretakers when the caretaking has carried someone forward.'", x: 6, y: 84, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-verel-archive-role" },
      { id: "watchers-kallium-role", name: "Kallium — Reflective-Band Role", description: "Beside Verel's entry: 'Kallium of the reflective band — speaks to combatants when the combat has cost the combatant something they did not have to spend.'", x: 14, y: 84, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-kallium-role" },
      { id: "watchers-mereth-role", name: "Mereth — Resonant-Band Role", description: "Beside Kallium's: 'Mereth of the resonant band — speaks to musicians when the musician has heard a thing the musician was not given to hear.'", x: 22, y: 84, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-mereth-role" },
      { id: "watchers-ophran-role", name: "Ophran — Long-Spectrum Band Role", description: "Beside Mereth's: 'Ophran of the long-spectrum band — speaks to traders when a trade has carried more than its weight.'", x: 30, y: 84, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-ophran-role" },
      { id: "watchers-sothe-role", name: "Sothe — High-Bright-Band Role", description: "Beside Ophran's: 'Sothe of the high bright band — speaks to children when the child has named a thing the elders had not named.'", x: 38, y: 84, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-sothe-role" },
      { id: "watchers-missing-archive-entry", name: "Seventh Slot — Missing Archive Entry", description: "At the bottom of the role-registry drawer: the seventh slot has a number — VII — and a single line. No name. No band. No audience.", x: 46, y: 84, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-missing-archive-entry" },
      { id: "watchers-sealed-question-in-vault", name: "Memorial Plaza Vault — Sealed Question", description: "On the Memorial Plaza vault shelf: an envelope, signed and sealed. To be opened next Memorial Day. Multiple players' questions are sealed alongside.", x: 54, y: 84, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:watchers-sealed-question-in-vault" },
      // Mystery wiring — resurrectionist.cycle_walker · e3 (plague mask at kill-site)
      { id: "resur-plague-mask-at-killsite", name: "Plague Mask at the Kill-Site", description: "Inside the recovered-artifacts drawer: a long-beaked plague mask, perfectly preserved, no occupant. Matches in every contour the seal on every Resurrectionist case-file. The cult does not connect the two.", x: 80, y: 74, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:resur-plague-mask-at-killsite" },
      // Mystery wiring — wolf.anara_hunt · e2 (trust-signature security logs)
      { id: "wolf-trust-signatures", name: "League Trust-Signature Security Logs", description: "In the League security-log drawer: no forced entries on any of the four chambers. Each hero, in their final logged moment, was either with a trusted League member or walking towards one.", x: 72, y: 74, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:wolf-trust-signatures" },
      // Mystery wiring — storm.architect_of_flux · color (shadow-vault)
      { id: "storm-silence-information-logs", name: "Silence's Information-Control Logs", description: "In the information-control tier: every classification decision is permanent, every retraction denied, every leak sealed. Silence is the locked archive.", x: 56, y: 74, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:storm-silence-information-logs" },
      { id: "storm-silence-co-signature", name: "Storm Case — Silence Co-Signature", description: "On the case-closure shelf: the Silence's flat-line co-signature in the lower margin of the closing documents. She does not normally co-sign cases.", x: 64, y: 74, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:storm-silence-co-signature" },
      // Mystery wiring — advocate.blood_weave · e3 (the Sacrum reliquary)
      { id: "advocate-sealed-sacrum", name: "The Sacrum — Sealed Reliquary", description: "In the classified-reliquary drawer: the reliquary the Advocate sealed and Syl'Vex unsealed. Weave-derivative agency-cost bindings — the doctrine the Hierarchy built recruitment-as-relief on.", x: 48, y: 74, width: 6, height: 6, type: "interact", action: "room-mystery:shadow-vault:advocate-sealed-sacrum" },
      { id: "demon-contract-altar", name: "Contract Altar", description: "The Hierarchy answers by contract. Every summon is a clause.", x: 72, y: 28, width: 14, height: 22, type: "terminal", action: "/demon-packs", elaraDialog: "A summoning altar bound to the Hierarchy's contract law. Every demon you call owes exactly what was signed — not one clause more. Mol'Garath audits the ledger quarterly." },
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
      { id: "weapon-arsenal", name: "Weapon Arsenal", description: "The glowing light-coin alcoves on the side walls — small sealed cases containing legendary weapons from across the Saga.", x: 5, y: 30, width: 95, height: 30, type: "examine", elaraDialog: "Agent Zero's personal collection. The Whisper Blade — kills without a sound. The Phase Pistol — shoots through walls. The Null Dart — erases memories. Each weapon was designed for a specific target. Some of those targets were gods. The fact that these weapons exist means someone, somewhere, needed to kill something that shouldn't have been killable." },
      { id: "infiltration-table", name: "Infiltration Table", description: "The central blade-on-pedestal at chamber center, lit by overhead spotlight — projects a holographic table showing routes, blind spots, and vulnerabilities.", x: 38, y: 40, width: 22, height: 32, type: "examine", elaraDialog: "The infiltration map. It shows every security system, every patrol route, every blind spot in every major installation across the Saga. The Panopticon, the Terminus Hive, the Quarchon Quantum Citadel — all mapped in perfect detail. Agent Zero spent lifetimes gathering this intelligence. Now it's yours." },
      { id: "door-armory", name: "Return to Armory", description: "The concealed passage back to the main Armory.", x: 40, y: 93, width: 20, height: 6, type: "door", action: "armory" },
      { id: "egg-shadow-contract", name: "Final Contract", description: "A sealed dossier marked with a skull emblem.", x: 88, y: 32, width: 5, height: 6, type: "item", action: "shadow-contract", elaraDialog: "Agent Zero's final contract. Never completed. The target... is the Architect himself. Someone hired Zero to kill the creator of the Inception Ark. The contract was never fulfilled because Zero discovered the truth — killing the Architect would unravel every reality simultaneously. So Zero sealed the contract here as a warning: some targets must never be eliminated." },
      // ─── Shadow Tongue mystery hotspots (2026-04-30 AAA Final drop) ───
      // These coexist with the legacy assassin-arsenal hotspots above.
      // Authored against the new shadow-vault:cell-sealed art per
      // apps/shared/roomMediaPrompts.ts: dense indigo cell-cylinder
      // centre-frame, manuscript-pile stage-left pedestal, warden-terminal
      // stage-right brass console, three-position lever foreground centre.
      { id: "sealed-cell-glass", name: "Sealed Cell Glass", description: "A tall reinforced-glass cylinder full of the unnameable indigo hue, dense as water. A figure resolves only when you look at it through someone else's eyes.", x: 38, y: 24, width: 24, height: 50, type: "interact", action: "room-mystery:shadow-vault:sealed-cell-glass" },
      { id: "manuscript-pile", name: "Manuscript Pile", description: "Stage-left pedestal stacked carelessly with leather folios — a fair copy of the editor's whole novel, kept in plain sight.", x: 8, y: 56, width: 14, height: 22, type: "interact", action: "room-mystery:shadow-vault:manuscript-pile" },
      { id: "warden-terminal", name: "Warden Terminal", description: "A stage-right brass console with a single phosphor-lavender readout — the editor's live active-edit count.", x: 78, y: 50, width: 14, height: 24, type: "interact", action: "room-mystery:shadow-vault:warden-terminal" },
      { id: "release-or-seal-lever", name: "Release-or-Seal Lever", description: "A long brass lever in the foreground. Three positions: SEAL, NEUTRAL, RELEASE. Currently neutral.", x: 42, y: 80, width: 16, height: 8, type: "interact", action: "room-mystery:shadow-vault:release-or-seal-lever" },
      // Mystery wiring — Varkul arc: the held far-wall door and the maker's-heartbeat readout
      { id: "the-unopened-threshold", name: "The Unopened Threshold", description: "A door set into the vault's far wall that has never been opened — not sealed, held. The room's own commentary on a vigil that does not relent.", x: 8, y: 24, width: 14, height: 22, type: "interact", action: "room-mystery:shadow-vault:the-unopened-threshold" },
      { id: "the-makers-heartbeat-trace", name: "The Maker's Heartbeat Trace", description: "A second readout on the warden-terminal no warden watches — a flat, contentless pulse the Order logs but cannot decode, because there is nothing in it to decode.", x: 78, y: 24, width: 14, height: 20, type: "interact", action: "room-mystery:shadow-vault:the-makers-heartbeat-trace" },
      // Mystery wiring — Necromancer arc: the Cathedral altar-facet, Varkul's four sentences and the maker's recent inscription
      { id: "the-necromancers-altar", name: "The Necromancer's Altar", description: "A stained-glass altar-facet the vault renders against its far wall only when witnessed — the Cathedral of Code's altar, where Varkul speaks his four sentences and the maker's hand recently cut a correction.", x: 26, y: 26, width: 10, height: 18, type: "interact", action: "room-mystery:shadow-vault:the-necromancers-altar" },
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
      { id: "battle-map", name: "Holographic Battle Map", description: "The central round war-table with cosmic star-map projection, 5 faction banners standing on its edge — tracks every military asset across every timeline.", x: 28, y: 52, width: 44, height: 38, type: "examine", elaraDialog: "The Battle Map. It tracks every military asset across every timeline. Those red markers are Terminus Swarm incursions. The blue ones are Panopticon defense fleets. The gold ones... those are unknown. Iron Lion marked them as 'Potential Forces' — armies that don't exist yet but could be raised by the right commander. That's you, Soldier." },
      { id: "tactical-archives", name: "Tactical Archives", description: "The right-wall white text panel with brass frame — sealed military records from every major conflict in the Saga.", x: 76, y: 28, width: 22, height: 38, type: "examine", elaraDialog: "Military records from every war in the Dischordian Saga. Battle formations, casualty reports, after-action reviews. Iron Lion studied every defeat to ensure it never happened again. The most classified file is labeled 'Operation Final Dawn' — a contingency plan for if the Terminus Swarm breaches all defenses. It requires a Soldier of exceptional courage to execute." },
      { id: "guild-war-console", name: "Guild War Command", description: "The left-wall bookshelf of bound folios — a tactical console for coordinating guild war operations.", x: 0, y: 52, width: 14, height: 40, type: "terminal", action: "/guild-war", elaraDialog: "The Guild War Command console. Coordinate with your guild to wage war against rival guilds. Deploy troops, capture territories, and earn glory for your alliance. The strongest guilds control the most valuable sectors of the Saga." },
      { id: "faction-war-map", name: "Faction War Map", description: "Three overhead holographic UI panels (green/cyan/purple) showing faction conflict zones and territory control.", x: 28, y: 18, width: 44, height: 16, type: "terminal", action: "/faction-wars", elaraDialog: "The Faction War Map. The great factions of the Dischordian Saga are locked in eternal conflict. Choose your side, fight for territory, and shape the outcome of the Saga. Your faction's victories and defeats ripple across every timeline." },
      { id: "door-bridge", name: "Return to Command Bridge", description: "The reinforced corridor back to the main Bridge.", x: 0, y: 92, width: 10, height: 6, type: "door", action: "bridge" },
      { id: "egg-war-medal", name: "Iron Lion's Medal", description: "A battered medal of valor pinned to the foreground chair.", x: 48, y: 88, width: 5, height: 6, type: "item", action: "war-medal", elaraDialog: "Iron Lion's Medal of Valor. Awarded for holding the line at the Siege of the Panopticon when all seemed lost. He fought for seventy-two hours without rest, rallying broken units and turning retreat into counterattack. The medal is scratched and dented — he wore it into every battle after. He said it reminded him what he was fighting for: not victory, but the people behind him." },

      // ── OVERHEAD HOLO + BANNER MYSTERIES (37 rects, 6×7 grid x=29-71, y=19-46) ──
      // Row 1 (y=19) — mechronis.chained_lesson arc
      { id: "chained-wave-telemetry", name: "Festival-Roof Wave Telemetry", description: "The main holo-tank's reading of the apprentice's incoming Terminus wave. Standard pattern, fourteen carriers, fully winnable — fourteen years of fully winnable waves the apprentices have failed to win.", x: 29, y: 19, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:chained-wave-telemetry" },
      { id: "chained-feint-pattern", name: "League Feint-Pattern Annotation", description: "The league tower-defense desk's annotation pinned to the tank as cross-reference, naming the third-minute formation feint apprentices have not been taught to wait out.", x: 36, y: 19, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:chained-feint-pattern" },
      { id: "chained-dean-admits", name: "Dean's Admission Recording", description: "On the curriculum-affairs board: the Dean's recorded admission. 'I knew Module 17 was absent. The apprentices were not the failures. The curriculum was.'", x: 43, y: 19, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:chained-dean-admits" },
      { id: "chained-trade-empire-employment", name: "Auro's Trade-Empire Employment Record", description: "Trade-Empire intelligence board: Auro on payroll as a 'route-safety contractor' for nine years — since Year 5, since the first apprentice failure.", x: 50, y: 19, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:chained-trade-empire-employment" },
      { id: "chained-dean-full-admission", name: "Dean's Full Admission", description: "Pinned beside Auro's record: the Dean's full admission of deferring to Tarn for fourteen years, with no excuse for the last six.", x: 57, y: 19, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:chained-dean-full-admission" },
      { id: "chained-amendment-three-options", name: "Three-Amendment Council Options", description: "On the council-vote display: the three amendment options — restore named, restore anonymously, or refuse and fund Auro's Trade-Empire role permanently.", x: 64, y: 19, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:chained-amendment-three-options" },
      // Row 2 (y=23) — mechronis.missing_professor (tarn) arc
      { id: "tarn-faculty-meeting-minutes", name: "Faculty Meeting Minutes — Week Before", description: "On the curriculum-affairs board: three faculty heads in violent disagreement, then a quiet hour, then unanimous agreement on 'Tarn must speak.' Tarn was not at the meeting.", x: 29, y: 23, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:tarn-faculty-meeting-minutes" },
      { id: "tarn-trial-proposal", name: "Trial Faculty Proposal — Roen", description: "Beside the minutes: five modules, ritual-heavy, citing Tarn's authority-trial framework. Signed by Roen. Proposes a celebration-trial co-requisite.", x: 36, y: 23, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:tarn-trial-proposal" },
      { id: "tarn-dean-choice-brief", name: "Dean's Council-Brief Draft", description: "On the Council-brief board: ratify the curriculum and let Tarn go, or summon Tarn back and tell the Academy the truth about the vote. The brief is unsigned.", x: 43, y: 23, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:tarn-dean-choice-brief" },
      { id: "tarn-faculty-apologies", name: "Three Faculty Apologies", description: "On the rite-record board: Othmar, Veth, and the Dean each wrote a public apology. Roen has not — Roen kept Tarn's confidence and was the only one not in the wrong.", x: 50, y: 23, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:tarn-faculty-apologies" },
      { id: "tarn-player-authorship-choice", name: "Curriculum-Authorship Motion", description: "On the closing-rite ballot display: 'curriculum by Professor Tarn' or 'curriculum, anonymous.' Both motions ratify the same modules. The choice is the player's.", x: 57, y: 23, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:tarn-player-authorship-choice" },
      { id: "watchers-council-communique", name: "Council Communiqué of the Six", description: "On the chronicle-public display: the Antiquarian's communiqué naming all six Watchers by band and audience, thanking the seventh for the silence — the Ark's first public statement on the founding Watchers in eight epochs.", x: 64, y: 23, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:watchers-council-communique" },
      // Row 3 (y=27) — severance.bound_champion + severance.infernal_clause start
      { id: "severance-attendance-record", name: "Severance Roster — Two Hundred Sixteen Names", description: "On the Severance roster-board: two hundred sixteen names every season. The first three are the same three names in the same order, every season since Year 1.", x: 29, y: 27, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:severance-attendance-record" },
      { id: "severance-vex-three-names", name: "Vex's Three-Name Confirmation", description: "Pinned beside the roster: Vex confirms the three first names are the inheritor (different each year) and two fixed witnesses. 'That part is the bond's, not mine.'", x: 36, y: 27, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:severance-vex-three-names" },
      { id: "severance-klessa-role", name: "Klessa's Failsafe — Thirty-Nine Wax-Pours", description: "On the failsafe-role board: if a season passes without a successor, Klessa pours the candle wax across the bond's table-line. She has done this thirty-nine times.", x: 43, y: 27, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:severance-klessa-role" },
      { id: "severance-written-protocol", name: "Written Protocol — Eleven Lines", description: "On the closing-rite display: eleven lines hand-copied from the apprentice oath, ratified by Vex Maestro and Auditor Klessa, witnessed by the Architect's Console.", x: 50, y: 27, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:severance-written-protocol" },
      { id: "infernal-forty-ledger-keepers", name: "League Ledger-Keeper Wall", description: "The personnel display: forty seasons of ledger-keepers, forty handwriting samples, none matching the clause-writing hand. One anomaly — a Year-One name that does not appear on the wall.", x: 57, y: 27, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:infernal-forty-ledger-keepers" },
      { id: "infernal-zyrkoth-arrival", name: "Zyr'Koth's Council-Chamber Arrival", description: "On the arrival log: the hall does not go silent. The hall goes quieter — the kind of quiet a room makes when it remembers a story it would rather not tell.", x: 64, y: 27, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:infernal-zyrkoth-arrival" },
      // Row 4 (y=31) — severance.infernal_clause continued
      { id: "infernal-advocate-brief", name: "Advocate's Six-Page Brief", description: "On the Council-brief board: every infernal clause cites a non-existent prize from the date of writing. Every clause is voidable as a matter of contract law. Includes Atalin's signed witness statement.", x: 29, y: 31, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:infernal-advocate-brief" },
      { id: "infernal-atalin-apology", name: "Atalin's Council-Floor Apology", description: "On the Council-floor recording: Atalin apologises to the league for forty seasons of unease, and to the Hierarchy for the trap. The Hierarchy accepts in writing. The league does not need to.", x: 36, y: 31, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:infernal-atalin-apology" },
      { id: "infernal-amnesty-passed", name: "Council Vote — Amnesty Passed", description: "On the Council-vote display: twelve to two, three abstentions. Every infernal clause across forty seasons is declared void by the Council in session.", x: 43, y: 31, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:infernal-amnesty-passed" },
      { id: "infernal-advocate-speech", name: "Advocate's Closing Speech — Eleven Minutes", description: "On the closing-rite recording: 'we have been winning by honest paperwork. we will keep winning that way. it is not a glamorous habit, but it is a survivable one.'", x: 50, y: 31, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:infernal-advocate-speech" },
      { id: "charter2-delegation", name: "Four-House Delegation at the Council Door", description: "On the Council-chamber door log: four people in working clothes. Two old, two young. They will not give names until they have read theirs into the record.", x: 57, y: 31, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:charter2-delegation" },
      { id: "charter-council-briefing", name: "Foundation-Day Council Briefing Pack", description: "On the Council-briefing board: the Antiquarian's pack — everything except the name. The Council can ratify, amend, or contest. None of the three options name the seventh.", x: 64, y: 31, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:charter-council-briefing" },
      // Row 5 (y=35) — charter.second_signatory + watchers arcs
      { id: "charter2-kassel-speaks", name: "Kassel's Council-Floor Speech", description: "On the Council-floor recording: 'we are asking the charter to admit it had eight names from the start. there is a difference, and the charter knows the difference.'", x: 29, y: 35, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:charter2-kassel-speaks" },
      { id: "charter2-kassel-response", name: "Kassel's Silence-as-Vote Response", description: "Pinned beside: Kassel's recorded response. 'The schism is asking for the seventh's silence to be heard correctly, four epochs late.'", x: 36, y: 35, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:charter2-kassel-response" },
      { id: "charter2-council-ratifies-three", name: "Council Vote — Option Three Passes", description: "On the Council-vote display: eleven votes to four, with two abstentions. Two of the four nay-voters apologise from the floor.", x: 43, y: 35, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:charter2-council-ratifies-three" },
      { id: "charter2-three-options", name: "Three-Option Council Ballot", description: "Beside the ratification: (1) ratify the schism, (2) close the schism, (3) ratify backward AND keep the original intact. Drafted by the player and the Antiquarian.", x: 50, y: 35, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:charter2-three-options" },
      { id: "watchers-witness-one-response", name: "Plaza-Audience Watcher-Line Tallies", description: "On the plaza-audience board: three players confirm Idris's voice; two confirm Verel's; five remain unconfirmed. The unconfirmed five are the four other named Watchers' work, plus the seventh's silence.", x: 57, y: 35, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:watchers-witness-one-response" },
      { id: "watchers-player-first-question", name: "Player's First Question — Year-Vault Draft", description: "On the year-vault-archive board: the player's hand-written first question for the silent seventh, sealed in an envelope to be opened next Memorial Day.", x: 64, y: 35, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:watchers-player-first-question" },
      // Row 6 (y=39) — akai_shi + advocate + storm arcs
      { id: "akai-thaloria-battle-logs", name: "Thaloria Battle Logs — Akai Shi's Last Hours", description: "On the Thaloria archive board: energy-manipulation discharges, healing applied to seven Potentials, then 'subject consumed' at hour four. Jericho intercepted at hour seven.", x: 29, y: 39, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:akai-thaloria-battle-logs" },
      { id: "advocate-empire-status-current", name: "Empire of Shadows — Current Status", description: "On the Empire-status board: the charter holds. The bindings on all ten named demon lords are operationally intact. The Advocate has not retired the charter.", x: 36, y: 39, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:advocate-empire-status-current" },
      { id: "advocate-acquisition-attempt-log", name: "Hierarchy Acquisition-Attempt Log", description: "On the defensive display: seven centuries of Hierarchy attempts against Advocate-sheltered souls. Every outcome where the countersignature held: NULL.", x: 43, y: 39, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:advocate-acquisition-attempt-log" },
      { id: "advocate-riri-ahlia-account", name: "Riri'Ahlia's Siege Account", description: "Pinned beside the log: the Hierarchy COO's surviving account of the seven-dimensions siege. 'The Advocate had MORE only in one resource: she was willing to spend herself.' A retreat at a moment her instruments could still have continued.", x: 50, y: 39, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:advocate-riri-ahlia-account" },
      { id: "storm-advocates-blood-weave", name: "Advocate's Blood-Weave Journals", description: "On the Empire-of-Shadows display: the Advocate's operational journals — every Weave deployment within a Storm-active window, the Storm credited as 'a patron of opportunity, indifferent to outcome.'", x: 57, y: 39, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:storm-advocates-blood-weave" },
      { id: "storm-event-correlation-table", name: "Calm-Event Correlation Table", description: "The war-room's correlation table mapping the Storm's nine calms onto the chronicle's most consequential planning events. Seven matched; two unrecorded; the chronicle's gap, not the cadence's.", x: 64, y: 39, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:storm-event-correlation-table" },
      // Row 7 (y=43) — resurrectionist leftover
      { id: "resur-second-fall-casualty-count", name: "Second Fall Casualty Count", description: "On the New-Babylon-affairs board: the Second Fall's casualty count. Millions among the populace; zero among Potentials; zero among awake Ne-Yons. The cult calls it miraculous; the Architect did not intervene.", x: 29, y: 43, width: 6, height: 4, type: "interact", action: "room-mystery:war-room:resur-second-fall-casualty-count" },

      // ── RIGHT TEXT PANEL ARCHIVE MYSTERIES (20 rects, 4×5 grid x=77-97, y=30-58) ──
      // Authored AFTER tactical-archives so they win clicks on
      // specific filed documents. Each rect 5×5.
      // Row 1 (y=30) — Watcher arc Ocularum + Ith'Rael arc start
      { id: "ocularum-vigil-board", name: "Ocularum Vigil Board", description: "A standing-threat panel on the tactical archive's lower rack — institutional powers the room tracks without engaging. The Authority's six minds head the list.", x: 77, y: 30, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:ocularum-vigil-board" },
      { id: "ocularum-cell-roster", name: "Ocularum Cell Roster", description: "A roster card in the archive's deepest drawer — the Ocularum's modern register. Three named cells of seven hundred.", x: 82, y: 30, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:ocularum-cell-roster" },
      { id: "hierarchy-org-chart-board", name: "Hierarchy Org-Chart Board", description: "A captured-document panel on the tactical archive's upper rack — the Hierarchy's internal Severance project org chart. One reporting line, one apex.", x: 87, y: 30, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:hierarchy-org-chart-board" },
      { id: "thalorian-defense-records", name: "Thalorian Defence Records", description: "A defence-doctrine binder in the comparative-history drawer — Thaloria's nine-generation consensual relaxation of its own recertification standards.", x: 92, y: 30, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:thalorian-defense-records" },
      // Row 2 (y=36) — Politician + Collector + Varkul + Necromancer arcs
      { id: "new-babylon-siege-record", name: "New Babylon Siege Record", description: "A campaign binder in the siege-history drawer — Iron Lion's legions at New Babylon, Day 10 of Veil. The record is complete on her forces and silent on her death.", x: 77, y: 36, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:new-babylon-siege-record" },
      { id: "hierarchy-piece-positioning-board", name: "Hierarchy Piece-Positioning Board", description: "A captured-document panel on the archive's deep rack — the Hierarchy of the Damned's aeons-long piece-positioning, read the way a war-room reads a slow board.", x: 82, y: 36, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:hierarchy-piece-positioning-board" },
      { id: "varkul-director-of-security-file", name: "Varkul Director-of-Security File", description: "A personnel order on the command-structure rack — Mol'Garath's post-Severance promotion of the Necromancer's creation to keeper of the Hierarchy's gates, both sides.", x: 87, y: 36, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:varkul-director-of-security-file" },
      { id: "necromancer-castle-log-board", name: "Necromancer Castle-Log Board", description: "A captured Hierarchy R&D log on the document rack — the Castle of Death named in the standing tense from the CFO's office, and Riri'Ahlia's unanswered procedural question.", x: 92, y: 36, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:necromancer-castle-log-board" },
      // Row 3 (y=42) — Zyr'Koth + Severance + Syl'Vex arcs
      { id: "zyr-koth-rd-refinement-file", name: "Zyr'Koth R&D Refinement File", description: "Captured Hierarchy R&D working notes on the document rack — the Advocate's defensive Weave inverted into the Severance, the source technique cited before the change, the test cohort redacted.", x: 77, y: 42, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:zyr-koth-rd-refinement-file" },
      { id: "the-severance-hollowing-report", name: "The Severance Hollowing Report", description: "A Hierarchy R&D observation note on a redacted test subject — a casualty with no wound — and Zyr'Koth's filed no-position on whether the protocol is ever used.", x: 82, y: 42, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:the-severance-hollowing-report" },
      { id: "the-locked-lever-board", name: "The Locked-Lever Board", description: "A strategic-assessment panel — the Severance as the only tested reversal of a Syl'Vex conversion, held only by a clause in Mol'Garath's quarterly review.", x: 87, y: 42, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:the-locked-lever-board" },
      { id: "syl-vex-dual-roster-board", name: "The Dual-Roster Board", description: "Two roster entries for one operative pinned side by side — Mira Halen 'in good standing' on the Insurgency's roster and 'Convert. Recognized.' on the Hierarchy's, both current, neither forged — and the cost-audit that came back blank.", x: 92, y: 42, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:syl-vex-dual-roster-board" },
      // Row 4 (y=48) — Riri'Ahlia siege/portfolio arc
      { id: "the-severance-cross-lock-file", name: "The Severance Cross-Lock File", description: "The Severance design read against a Syl'Vex convert — extracts one thread, never deployed on a convert — and Mol'Garath's quarterly-review clause requiring a consent never sought.", x: 77, y: 48, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:the-severance-cross-lock-file" },
      { id: "the-taskmasters-siege-portfolio", name: "The Taskmaster's Siege Portfolio", description: "A captured Hierarchy operations file on the document rack — the siege of seven dimensions filed not as a campaign but as a portfolio entry with a populated remediation field, and the Taskmaster's own status-grammar register.", x: 82, y: 48, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:the-taskmasters-siege-portfolio" },
      { id: "riri-ahlia-reorg-doctrine-board", name: "The Reorganization-Doctrine Board", description: "A strategic-assessment panel — Riri'Ahlia's doctrine of reorganizing value off a position she cannot take, her silence as her most active state, and Fenra's post-siege seventeen-dimension commendation.", x: 87, y: 48, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:riri-ahlia-reorg-doctrine-board" },
      { id: "the-procedural-question-file", name: "The Procedural-Question File", description: "A captured Hierarchy procedural filing cross-referenced against the necromancer-castle log — Riri'Ahlia's canonically unanswered question filed to be on the record, and the doctrine that the record is the org chart's edge.", x: 92, y: 48, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:the-procedural-question-file" },
      // Row 5 (y=54) — Fenra + Wolf records
      { id: "the-priced-defense-accounting", name: "The Priced-Defense Accounting", description: "Riri'Ahlia's own filed after-action ledger of the siege — expenditure within projection, the assault vector retired, and the one line that mattered: the cost of the Advocate's defense, now measured and in the portfolio.", x: 77, y: 54, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:the-priced-defense-accounting" },
      { id: "fenra-seventeen-front-manifest", name: "The Seventeen-Front Manifest", description: "Fenra's captured operational record, racked beside the Taskmaster's siege portfolio — the seventeen-dimension invasion filed as a supply manifest, fed from one kitchen, the berserker read struck as the false lead.", x: 82, y: 54, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:fenra-seventeen-front-manifest" },
      { id: "the-wolf-in-the-boardroom-file", name: "The Wolf-in-the-Boardroom File", description: "A captured Hierarchy personnel portrait — the fur-lined coat and the lupine snout filed as one canon, the growl that lands on the bookkeeping not the kill, and the silence that is restraint, not the Taskmaster's reorganization or Varkul's vigil.", x: 87, y: 54, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:the-wolf-in-the-boardroom-file" },
      { id: "fenra-varkul-contrast-record", name: "The Fenra-Varkul Contrast Record", description: "Filed beside the Varkul director-of-security order — the Necromancer's two senior creations read as a matched pair: the still door and the moving engine, the two things any continuity needs.", x: 92, y: 54, width: 5, height: 5, type: "interact", action: "room-mystery:war-room:fenra-varkul-contrast-record" },

      // ── SPECIAL-SURFACE MYSTERIES (3 rects) ──
      // holo-table → war-table edge (brass dial)
      // casualty-board → left bookshelf (oxblood-leather binders)
      // signal-flag-rack → stage-left wall between bookshelf + table
      { id: "holo-table", name: "Holo Table Dial", description: "The brass dial at the holo-table's edge. BRIEFING / RECON / OBITUARY. Currently set to BRIEFING.", x: 30, y: 73, width: 8, height: 6, type: "interact", action: "room-mystery:war-room:holo-table" },
      { id: "casualty-board", name: "Casualty Board", description: "Oxblood-leather binders racked along the left wall, each labelled with an operation name and a year. The thickest is PROTOCOL ZERO.", x: 1, y: 76, width: 12, height: 14, type: "interact", action: "room-mystery:war-room:casualty-board" },
      { id: "signal-flag-rack", name: "Signal Flag Rack", description: "Stage-left rack of folded signal-flags between the bookshelf and the war-table. Twelve flags, one per faction Lyra negotiated with in person.", x: 16, y: 52, width: 8, height: 24, type: "interact", action: "room-mystery:war-room:signal-flag-rack" },
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
      { id: "charter-per-m-live-sample", name: "Per. M.'s Live Signature Sample", description: "On the signature-comparison bench: Per. M.'s receipt from this morning, laid under the lens beside the preservation-order file. The doubled-pulse tic matches the wax-thumb on the seventh signature.", x: 6, y: 8, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:charter-per-m-live-sample" },
      { id: "charter-watcher-oath-fragment", name: "Founding-Watcher Oath, Stanza Three", description: "A brittle vellum scrap recovered from the cipher-den's deepest archive — older than the charter. Three lines name the closer's role and the oath that keeps it silent.", x: 14, y: 8, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:charter-watcher-oath-fragment" },
      // Mystery wiring — mechronis.missing_professor · e4 (Roen's confidence)
      { id: "tarn-roen-confidence", name: "Roen's Confidential Account", description: "In the cipher-den's closed wing: Trial-master Roen's full statement on the three-month-old conversation in which Tarn asked them for help leaving without a goodbye.", x: 13, y: 19, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:tarn-roen-confidence" },
      // Mystery wiring — memorial.forgotten_names · e3 + e4 (cross-reference passes + first imprint)
      { id: "memorial-first-pass-five-recovered", name: "Cross-Reference: Five Recovered", description: "On the cross-reference bench: the first-pass results — five names recovered by listening to the unwitnessed imprints in pairs. The chain of memory was not broken at every link.", x: 20, y: 30, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:memorial-first-pass-five-recovered" },
      { id: "memorial-parental-imprint-search", name: "Parental Imprint Search", description: "Beside the first-pass bench: the expanded search across the wider registry. Two hits — a parent imprinted in epoch four named I-244; a sibling imprinted in epoch six named I-44.", x: 28, y: 30, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:memorial-parental-imprint-search" },
      { id: "memorial-first-imprint-record", name: "The First-Imprint Record", description: "From the pre-charter tier: the record of the Ark's first imprint. 'Witnessing I-1.' Taken before the founding charter, by the Architect's own first act.", x: 36, y: 30, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:memorial-first-imprint-record" },
      // Mystery wiring — charter.second_signatory · e3 + e4 (Heron's diary + silence convention)
      { id: "charter2-heron-diary", name: "Heron's Diary", description: "Drawer eleven, fourth-epoch tier — the Council archivist Heron's personal diary, recovered from a sealed compartment in their desk. A confession written in advance of the confessor's pardon.", x: 27, y: 41, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:charter2-heron-diary" },
      { id: "charter2-heron-diary-second-page", name: "Heron's Diary, Page Two", description: "The diary's second page: Heron asking the seventh whether they consented to the scrub, and recording the silence both Heron and the Council misread.", x: 35, y: 41, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:charter2-heron-diary-second-page" },
      { id: "charter2-silence-convention", name: "Silence-as-Vote Convention", description: "The founding-protocols archive's page on the convention Heron did not honour. The seventh Watcher has been voting no by silence since the fourth epoch, exactly as the convention prescribes.", x: 43, y: 41, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:charter2-silence-convention" },
      // Mystery wiring — severance.infernal_clause · e2 + e3 + e4 (cipher-den's three findings)
      { id: "infernal-handwriting-analysis", name: "Forty-Contract Handwriting Analysis", description: "On the signature-comparison bench: the cipher-den's report — forty clauses, one writer, consistent across forty seasons, no match to any seasonal ledger-keeper.", x: 34, y: 52, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:infernal-handwriting-analysis" },
      { id: "infernal-atalin-receipt-sample", name: "Atalin's Receipt — Bench Match", description: "Pulled from Atalin's archived personnel file: a routine receipt whose hand matches the clause-writing exactly. The cipher-den's annotation: 'identity confirmed.'", x: 42, y: 52, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:infernal-atalin-receipt-sample" },
      { id: "infernal-the-flaw", name: "The Trap Atalin Wrote In", description: "In the annotated-contract drawer: every clause names 'the second-cycle prize.' The league didn't institute second-cycle prizes until season eleven. Forty clauses, every one voidable.", x: 50, y: 52, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:infernal-the-flaw" },
      // Mystery wiring — mechronis.chained_lesson · e4 (Tarn's Year-One argument)
      { id: "chained-tarn-year-one-argument", name: "Tarn's Year-One Argument", description: "Drawer seven, year-one tier — the recovered audio of Tarn's forty-minute Year-One argument against Module 17, bookmarked at hour three.", x: 41, y: 63, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:chained-tarn-year-one-argument" },
      // Mystery wiring — severance.infernal_clause · e3 (seven-day window dates)
      { id: "infernal-seven-day-window", name: "Seven-Day Window — Exact Dates", description: "On the window-precision bench: epoch one, week thirty-three, days four through ten. The writer worked retroactively for the first contract, prospectively for the others.", x: 6, y: 82, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:infernal-seven-day-window" },
      // Mystery wiring — charter.second_signatory · color (cipher-den)
      { id: "charter2-eighth-sigil", name: "Eighth Sigil — Hand Opening, Two Fingers Down", description: "On the sigil-reference bench: the eighth sigil from the mirror charter. Last appeared in lower-deck tax ledgers four epochs ago.", x: 74, y: 74, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:charter2-eighth-sigil" },
      { id: "charter2-scrub-pattern", name: "Scrub-Pattern Handwriting Cross-Reference", description: "On the handwriting-cross-reference bench: the redaction's hand matches three other epoch-four scrubs across unrelated archives — all removing artisan-house references. One systematic person.", x: 82, y: 74, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:charter2-scrub-pattern" },
      // Mystery wiring — charter.missing_signatory · e3 (Per. M.'s doubled pulse)
      { id: "charter-archivist-pulse", name: "Per. M.'s Doubled-Pulse Signature Tic", description: "On the signature-rhythm bench: a doubled pulse in every Per. M. signature — a tic present in writers who breathe twice per stroke. Documented in founding-Watcher physiology.", x: 66, y: 74, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:charter-archivist-pulse" },
      // Mystery wiring — severance.bound_champion · color (cipher-den)
      { id: "severance-candle-smoke-residue", name: "Candle Smoke Residue Across Ledgers", description: "On the chemical-trace bench: Klessa's candle leaves the same residue on every Severance ledger. The mark predates Klessa, predates the league, matches the Broker's shelf candles.", x: 50, y: 74, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:severance-candle-smoke-residue" },
      { id: "severance-broker-first-name", name: "Broker's First Name — Year-One Residue Match", description: "On the residue-match bench at case-closure: the Broker is named Solène. They redacted themselves at the first ceremony so the role would not become a person.", x: 58, y: 74, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:severance-broker-first-name" },
      // Mystery wiring — memorial.forgotten_names · e4 (parent search I-1)
      { id: "memorial-parent-search-i1", name: "I-1 Relatives Search — No Result", description: "On the relatives-search bench: no parent imprinted, no sibling imprinted, no witnesses recorded. I-1 is alone in the registry.", x: 42, y: 74, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:memorial-parent-search-i1" },
      // Mystery wiring — mechronis.missing_professor · e2 (Logic faculty proposal)
      { id: "tarn-logic-proposal", name: "Logic Faculty Proposal — Othmar", description: "On the faculty-submissions bench: eight modules, chess-heavy, citing Tarn's residency notes. Signed by Othmar. Proposes elimination of two trial-faculty modules.", x: 34, y: 74, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:tarn-logic-proposal" },
      // Mystery wiring — memorial.seven_watchers · e2 (Verel's band-five signature)
      { id: "watchers-verel-signature", name: "Verel's Band-Five Signature", description: "On the spectrum-analysis bench: band-five card. Bright waveform, narrow spectrum, an overtone like running water. Verel speaks to caretakers.", x: 26, y: 74, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:watchers-verel-signature" },
      // Mystery wiring — resurrectionist.cycle_walker · e1 (Syndicate seven-pointed star)
      { id: "resur-seven-pointed-star", name: "Syndicate Seven-Pointed Star Footer", description: "On the Syndicate-of-Death roster bench: six twin-pairs, six bindings, the canonical six-pointed star embossed on every page. The Resurrectionist's case-file footer carries a seven-pointed star, drawn with the same precision.", x: 81, y: 63, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:resur-seven-pointed-star" },
      // Mystery wiring — akai_shi.red_death · e3 (targets-list order pattern)
      { id: "akai-targets-list-order-pattern", name: "Targets-List — Order Pattern Analysis", description: "On the pattern-analysis bench: the targets sorted by how much each elimination redirected the chronicle. Ascending. The Red Death is building toward something.", x: 73, y: 63, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:akai-targets-list-order-pattern" },
      // Mystery wiring — wolf.anara_hunt · e4 (Crucible seal telemetry)
      { id: "wolf-seal-telemetry", name: "Crucible Seal Telemetry — Wolf's Chamber", description: "On the containment-telemetry bench: the Wolf's seal at 92% at transfer, failed 23 cycles later. Anara's containment ledger does not register the Wolf's chamber as a chamber.", x: 65, y: 63, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:wolf-seal-telemetry" },
      // Mystery wiring — storm.architect_of_flux · color (cipher-den)
      { id: "storm-uncorrelated-residue", name: "Storm — Uncorrelated Calm Residue", description: "On the pattern-anomaly bench: two of nine calms have no recorded chronicle-event. The cult annotates them 'atmospheric'; the signatures are identical to the seven correlated calms.", x: 57, y: 63, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:storm-uncorrelated-residue" },
      // Mystery wiring — mechronis.chained_lesson · color (cipher-den)
      { id: "chained-full-proceedings-audio", name: "Year-One Curriculum-Vote Full Proceedings", description: "On the year-one-audio bench: six and a half hours of recovered audio. Hour three is the curriculum debate; Tarn's forty-minute argument against Module 17 sits inside it.", x: 49, y: 63, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:chained-full-proceedings-audio" },
      // Mystery wiring — memorial.seven_watchers · e1 + e2 + e3 (signatures + Idris + catalogue)
      { id: "watchers-upper-band-signature", name: "Upper-Band Signature Cards", description: "On the spectrum-analysis bench: six distinct upper-band signatures from the silence-break, and a seventh signature present-and-silent throughout the sixty-three-second event.", x: 48, y: 74, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:watchers-upper-band-signature" },
      { id: "watchers-idris-signature", name: "Idris's Band-Three Signature", description: "Beside the bench: the band-three card isolated. Slow waveform, standing-silence undercurrent. Matches the registry placeholder the cipher-den has held for eight epochs.", x: 56, y: 74, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:watchers-idris-signature" },
      { id: "watchers-six-signatures-catalogue", name: "Six-Watcher Master Catalogue", description: "On the master catalogue: six cards arranged by band — Idris, Verel, Ophran, Kallium, Mereth, Sothe. The first complete cipher-den entry for the upper-bands Watchers in eight epochs.", x: 64, y: 74, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:watchers-six-signatures-catalogue" },
      // Mystery wiring — akai_shi.red_death · e4 (Necromancer's seven retreat chambers)
      { id: "akai-necromancer-retreat-chambers", name: "Necromancer's Matrix Retreat Chambers", description: "On the matrix-cartography bench: a schematic of the Necromancer's seven retreat chambers — defense-in-depth designed for chronicle-space hunters. The Red Death is not one.", x: 55, y: 85, width: 6, height: 6, type: "interact", action: "room-mystery:cipher-den:akai-necromancer-retreat-chambers" },
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
      { id: "surveillance-feeds", name: "Surveillance Network", description: "The four large green monitor screens flanking the chamber (2 on each side wall) — live feeds from across the Ark and beyond.", x: 0, y: 18, width: 100, height: 40, type: "examine", elaraDialog: "The Enigma's surveillance network. It doesn't just monitor the Ark — it taps into communication channels across multiple realities. Those feeds show conversations happening right now in the Panopticon, the Terminus Hive, even the Antiquarian's Library. The Enigma saw everything. Knew everything. And trusted no one." },
      { id: "conspiracy-boards", name: "Conspiracy Boards", description: "The three framed silhouette portraits in the center-back — Lyra, Wraith, and Vox. String-and-photo evidence connecting events across the entire Saga.", x: 38, y: 18, width: 24, height: 18, type: "examine", elaraDialog: "The conspiracy boards. Every thread connects to every other thread. The Architect's true identity. The Oracle's hidden agenda. The Collector's real purpose. The Enigma mapped it all. Some of these connections are terrifying — they suggest that certain events in the Saga weren't accidents. They were orchestrated by someone operating above even the Architect's awareness." },
      { id: "door-comms", name: "Return to Comms Array", description: "The hidden panel back to the main Communications Array — walk out through the foreground.", x: 40, y: 93, width: 20, height: 6, type: "door", action: "comms-array" },
      { id: "egg-cipher-key", name: "Master Cipher Key", description: "A small device that can decrypt any message in the Saga.", x: 50, y: 56, width: 6, height: 8, type: "item", action: "cipher-key", elaraDialog: "The Master Cipher Key. The Enigma's ultimate tool. It can decrypt any message, crack any code, bypass any encryption in the entire Dischordian Saga. With this, there are no more secrets. The Enigma left it here with a note: 'The truth will set you free. But first, it will make you very, very angry.' Use it wisely, Spy." },
      // ─── Shadow Tongue uncorruption hub (2026-04-30 AAA Final drop) ───
      // These coexist with the legacy spy-intel hotspots above. Authored
      // against the new cipher-den:initial art per
      // apps/shared/roomMediaPrompts.ts: long oak-and-brass desk centre
      // with rosetta-pad codex on a stand, encrypted-correspondence
      // wall-rack of cubbyholes, dictionary-of-edits free-standing
      // lectern stage-left, uncorruption-bench worktop with magnifier
      // stage-right.
      { id: "rosetta-pad", name: "Rosetta Pad", description: "A thick brass-bound codex on a reading-stand at the centre of the desk. Three columns: indigo glyphs, Elara's warm-gold, and a third hand in old black ink — Lyra Vox's translation key.", x: 40, y: 56, width: 18, height: 22, type: "interact", action: "room-mystery:cipher-den:rosetta-pad" },
      { id: "encrypted-correspondence", name: "Encrypted Correspondence", description: "Cubbyholes along the back wall stuffed with rolled letters — Lyra and Wraith's cipher exchange in the last six months of her command.", x: 4, y: 8, width: 18, height: 50, type: "interact", action: "room-mystery:cipher-den:encrypted-correspondence" },
      { id: "dictionary-of-edits", name: "Dictionary of Edits", description: "A freestanding lectern stage-left with a perpetually-open book. Pages turn themselves at one every fifteen seconds — the editor's vocabulary catalogued.", x: 28, y: 24, width: 10, height: 30, type: "interact", action: "room-mystery:cipher-den:dictionary-of-edits" },
      { id: "uncorruption-bench", name: "Uncorruption Bench", description: "A worktop stage-right with a brass-rimmed magnifier on a swing-arm. Combine corrupted-fragments here with their originals — the lens does the work.", x: 70, y: 60, width: 22, height: 22, type: "interact", action: "room-mystery:cipher-den:uncorruption-bench" },
      // Mystery wiring — Game Master arc cross-arc thanks-state card
      { id: "cross-arc-thanks-card", name: "Cross-Arc Thanks Card", description: "A small index card in a brass frame on the cross-arc shelf — Velkraal's final-edit gratitude state, updating with the player's choices.", x: 92, y: 8, width: 6, height: 10, type: "interact", action: "room-mystery:cipher-den:cross-arc-thanks-card" },
      // Mystery wiring — Vex arc Seer-Vex pair binder
      { id: "vex-seer-pair-binder", name: "Vex-Seer Pair Binder", description: "A two-pocket binder on the Insurgency-engineer shelf — the Seer's consultation request to Vex and a state-card mirroring his undelivered letter.", x: 92, y: 24, width: 6, height: 10, type: "interact", action: "room-mystery:cipher-den:vex-seer-pair-binder" },
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

      { id: "judges-bench", name: "Judges' Bench", description: "The long brass-and-oak slab elevated on three steps at chamber-back, three high-backed chairs with amber lamps flanking. The chief adjudicator's middle seat is taller by a hand's-width.", x: 32, y: 32, width: 36, height: 30, type: "interact", action: "room-mystery:order-tribunal:judges-bench" },
      { id: "scale-justice", name: "Scale of Justice", description: "The golden scales-of-justice motif inlaid on the foreground floor — weighs not gold or silver but intention and consequence.", x: 35, y: 75, width: 30, height: 20, type: "examine", elaraDialog: "The Scale of Justice. It weighs not gold or silver, but intention and consequence. Every major decision in the Saga was evaluated by this scale. The Hierophant used it to determine which actions served the greater good and which served only selfish desire. It's responding to your presence — it recognizes a champion of Order." },
      { id: "law-archives", name: "Law Archives", description: "The left-wall audience pillars with purple-glyph strip lighting — holographic tomes containing every law and code of the Saga.", x: 0, y: 18, width: 22, height: 55, type: "examine", elaraDialog: "The complete legal code of the Dischordian Saga. Laws governing reality itself — the Conservation of Narrative Energy, the Prohibition of Temporal Paradox, the Right of Every Potential to Choose Their Own Path. The Hierophant wrote most of these. Some say they're the only thing preventing the multiverse from collapsing into chaos." },
      { id: "evidence-locker", name: "Evidence Locker", description: "The right-wall jury box with chairs — a wall of small brass-faced compartments behind. Most empty. Three sealed in red wax — open cases, awaiting verdict.", x: 76, y: 30, width: 22, height: 50, type: "interact", action: "room-mystery:order-tribunal:evidence-locker" },
      { id: "door-bridge-order", name: "Return to Bridge", description: "The formal corridor back to the Command Bridge.", x: 42, y: 22, width: 16, height: 8, type: "door", action: "bridge" },
      { id: "apprentice-rostrum", name: "Apprentice Rostrum", description: "The left-side audience rostrum — the Mechronis Academy trial cadence; mentor a successor through the 28-day trial.", x: 22, y: 50, width: 12, height: 28, type: "terminal", action: "/apprentice", elaraDialog: "The Mechronis trial rostrum. You mentor a successor through the twelve-archetype, twenty-eight-day trial — while the Politician's dead insurance policy trains your rival's. The loop is a mirror." },
      { id: "mol-vereth-audit-ledger", name: "Mol'Vereth's Audit Ledger", description: "A small bound volume on a side-shelf beside the judges' bench — Mol'Vereth files every annual audit through this ledger.", x: 24, y: 62, width: 7, height: 10, type: "interact", action: "room-mystery:order-tribunal:mol-vereth-audit-ledger" },
      // Architect-channel mysteries on the judges' bench front (audit-archive readouts)
      { id: "wolf-judge-audit-trail", name: "Judge's Audit Trail — Lycos Open Entry", description: "On the judges' bench front (left lamp area): the Judge's open entry under Day 15 of Resonance, Year 100,001 A.A. 'The work was clean. The instrument was not lost.'", x: 34, y: 48, width: 5, height: 5, type: "interact", action: "room-mystery:order-tribunal:wolf-judge-audit-trail" },
      { id: "wolf-judge-clarification", name: "The Judge's Audit Clarification", description: "On the judges' bench front (center): the Second Ne-Yon's terse reply, distinguishing the instrument He destroyed (the Thought Virus) from the instrument that was preserved (Lycos).", x: 44, y: 48, width: 5, height: 5, type: "interact", action: "room-mystery:order-tribunal:wolf-judge-clarification" },
      { id: "storm-judges-arbitration-register", name: "Judge's Storm-Silence Arbitration Register", description: "On the judges' bench front (right lamp area): seven Judge-arbitrations between the Storm and the Silence, each closed with the same standing position — 'keep the polarity.'", x: 54, y: 48, width: 5, height: 5, type: "interact", action: "room-mystery:order-tribunal:storm-judges-arbitration-register" },
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

      { id: "reality-forges", name: "Reality Forges", description: "Three cauldrons burn with flames of different colors — yellow probability, red paradox, cyan déjà vu — each warping reality around it.", x: 15, y: 35, width: 68, height: 35, type: "examine", elaraDialog: "The Reality Forges. Each one burns a different fuel — compressed probability, crystallized paradox, liquefied déjà vu. The Meme used them to forge weapons that shouldn't exist. A sword that cuts through time. A shield that reflects consequences. A bomb that erases the concept of a specific idea. Chaos isn't destruction — it's unlimited creativity." },
      { id: "chaos-equations", name: "Chaos Equations", description: "The back wall behind the central red cauldron — brilliant equations scrawled alongside anarchist graffiti.", x: 38, y: 28, width: 22, height: 22, type: "examine", elaraDialog: "The equations of chaos. They look like madness, but each one solves an impossible problem. How to travel faster than light without a ship. How to exist in two places simultaneously. How to make a joke so funny it literally rewrites reality. The Meme was a genius — they just expressed their genius through destruction and humor rather than order and logic." },
      { id: "door-engineering-chaos", name: "Return to Engineering Bay", description: "A keyhole-vault door on the far-right wall leading back to Engineering.", x: 88, y: 35, width: 10, height: 45, type: "door", action: "engineering" },
      { id: "chaos-anvil", name: "Chaos Anvil", description: "The central anvil pedestal at chamber center — asymmetric, heavier on the left than the right. Strikes ring different harmonics depending on where they land.", x: 40, y: 72, width: 18, height: 20, type: "interact", action: "room-mystery:chaos-forge:chaos-anvil" },
      { id: "entropy-vat", name: "Entropy Vat", description: "The left-most cauldron with yellow flames — a copper-rimmed bath of seething oil that never settles. Used for tempering — and, by deliberate design, for refusing the smith their certainty.", x: 15, y: 55, width: 17, height: 22, type: "interact", action: "room-mystery:chaos-forge:entropy-vat" },
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

      { id: "convergence-point", name: "Convergence Point", description: "The central flame on a tall pedestal between the four pillars — where fire, water, earth, and air merge into pure white energy.", x: 40, y: 18, width: 18, height: 40, type: "examine", elaraDialog: "The Convergence Point. Where fire, water, earth, and air become one. The DeMagi believed that all of reality was built from these four elements in different combinations. At the convergence, you can feel the truth of it — everything is connected, everything is one. The power here is immense. The DeMagi who built this room could reshape matter with a thought." },
      { id: "demagi-runes", name: "DeMagi Runes", description: "The compass-rose floor ringed in glowing rune script — ancient DeMagi carving in shifting elemental colors.", x: 15, y: 55, width: 70, height: 38, type: "examine", elaraDialog: "Ancient DeMagi script. These runes predate the Ark by millennia. They describe the Elemental Covenant — the agreement between the DeMagi and the elements themselves. In exchange for the power to command fire, water, earth, and air, the DeMagi swore to maintain the balance of nature across every world they touched. Your heritage carries that oath." },
      { id: "door-observation-nexus", name: "Return to Observation Deck", description: "The elemental gateway back to the Observation Deck.", x: 40, y: 92, width: 20, height: 6, type: "door", action: "observation-deck" },
      { id: "elemental-orrery", name: "Elemental Orrery", description: "The brass-armatured golden sphere on the right-foreground stand — a model of the eight elemental relations (four DeMagi, four Quarchon) orbiting an empty centre.", x: 80, y: 58, width: 18, height: 30, type: "interact", action: "room-mystery:elemental-nexus:elemental-orrery" },
      { id: "node-pillar", name: "Node Pillar", description: "The far-right elemental pillar with green/air-swirl element-discs — a fluted brass column with eight horizontal slots. Three hold etched-glass discs; five are empty.", x: 78, y: 8, width: 15, height: 42, type: "interact", action: "room-mystery:elemental-nexus:node-pillar" },
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

      { id: "quantum-anomaly", name: "Quantum Anomaly", description: "The tall cylindrical glass containment vessel at chamber center holds a figure-silhouette — matter existing in multiple states simultaneously.", x: 37, y: 5, width: 28, height: 70, type: "examine", elaraDialog: "The Quantum Anomaly. It's simultaneously a star, a planet, a person, and nothing at all. Quarchon physics says that observation collapses probability into reality — but this anomaly resists observation. It stays in superposition no matter who looks at it. The Quarchon scientists believed it was a fragment of the universe before the Big Bang — before anything decided to be anything." },
      { id: "probability-engine", name: "Probability Engine", description: "Left-wall holographic probability charts — nodes and connections mapping every possible present.", x: 0, y: 18, width: 30, height: 48, type: "examine", elaraDialog: "The Probability Engine. It doesn't predict the future — it calculates every possible present. Feed it a question and it shows you every reality where that question has a different answer. The Quarchon used it to find the optimal timeline — the one where the most beings survive the Terminus Swarm. They found it. We're living in it." },
      { id: "door-archives-quantum", name: "Return to Archives", description: "The quantum-locked door back to the Archives.", x: 40, y: 93, width: 20, height: 5, type: "door", action: "archives" },

      // ── ANALYSIS-STAGE MYSTERY RECTS (7) ──
      // Distributed onto right-wall holographic displays + foreground
      // cogs/brass piping (the "analysis stage" surfaces). Each
      // architect-channel mystery represents reading a specific
      // analysis output.
      { id: "charter-wax-mineralisation-analysis", name: "Wax Mineralisation Analysis", description: "On the lab's left analysis-stage hologram: the charter's wax-blister readout. Standard solvents refused; quantum-imaging places the original temperature in the upper-band range. The Ark does not house a forge that can do this.", x: 2, y: 22, width: 5, height: 5, type: "interact", action: "room-mystery:quantum-lab:charter-wax-mineralisation-analysis" },
      { id: "severance-bond-internal-log", name: "Companion Bond — Sieve Reading", description: "On the lab's sieve-reading bench (left hologram): the companion's bond from this finals night, held in stasis. Forty-one names whispered into the bond at each inheritance, intact and in order.", x: 8, y: 22, width: 5, height: 5, type: "interact", action: "room-mystery:quantum-lab:severance-bond-internal-log" },
      { id: "charter2-vellum-comparison", name: "Parallel-Vellum Imaging Analysis", description: "On the parallel-stage hologram (left wall lower): both charters side by side. Quantum-imaging confirms same hide, adjacent cuts, same week's cure. Two parallel originals from one founding hand.", x: 2, y: 45, width: 5, height: 5, type: "interact", action: "room-mystery:quantum-lab:charter2-vellum-comparison" },
      { id: "infernal-quantum-dating", name: "Forty-Contract Ink-Dating Stage", description: "On the dating stage (right wall hologram): every clause's ink dates to the same seven-day window in epoch one. Thirty-nine of forty clauses pre-date the contracts they appear on.", x: 67, y: 22, width: 5, height: 5, type: "interact", action: "room-mystery:quantum-lab:infernal-quantum-dating" },
      { id: "akai-matrix-entry-fold", name: "Matrix Entry — Day 14 of Fracture", description: "On the fold-analysis stage (right wall hologram): the Red Death's Matrix-entry signature, timestamp Day 14 of Fracture, Year 117,046 A.A. A fold the Game Master's design did not anticipate.", x: 73, y: 22, width: 5, height: 5, type: "interact", action: "room-mystery:quantum-lab:akai-matrix-entry-fold" },
      { id: "akai-red-death-energy-signature", name: "Red Death Energy Signature", description: "On the frequency-band stage (right wall hologram lower): Akai Shi's pre-mortem markers intact, healing band replaced with a time-displacement frequency. The substitution carries the Cycle Walker's authoring signature.", x: 67, y: 45, width: 5, height: 5, type: "interact", action: "room-mystery:quantum-lab:akai-red-death-energy-signature" },
      { id: "akai-necromancer-evasion-log", name: "Necromancer Evasion Log", description: "Beside the signature stage: the Necromancer's millennia-long movements inside the Matrix. Un-territorial geometry. Only a time-displaced agent could enter. The Resurrectionist built one.", x: 73, y: 45, width: 5, height: 5, type: "interact", action: "room-mystery:quantum-lab:akai-necromancer-evasion-log" },
      // Mystery wiring — apps/shared/roomMysteries/quantumLab.ts
      { id: "entanglement-rig", name: "Entanglement Rig", description: "A brass armature suspending two clear quartz orbs at opposite corners of the room. Strike one and the other rings half a beat later.", x: 4, y: 10, width: 26, height: 50, type: "interact", action: "room-mystery:quantum-lab:entanglement-rig" },
      { id: "observation-cage", name: "Observation Cage", description: "A small brass-mesh enclosure beside the entanglement-rig. Faraday-isolated; holds a single oxblood-leather notebook.", x: 64, y: 60, width: 16, height: 32, type: "interact", action: "room-mystery:quantum-lab:observation-cage" },
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

      { id: "dna-helix", name: "Ne-Yon DNA Helix", description: "The central brass-rimmed glass bowl at chamber center, bubbling with bio-synthesis fluid — a rotating holographic DNA helix overlay shows the fusion of organic and synthetic code.", x: 33, y: 32, width: 34, height: 42, type: "examine", elaraDialog: "The Ne-Yon DNA Helix. Half biological, half digital. It shows how the Ne-Yon evolved — or were engineered — to bridge the gap between organic life and artificial intelligence. Every Ne-Yon carries this dual code. Your thoughts are processed by both neurons and nanites simultaneously. That's why you can interface with technology that would fry a pure organic brain." },
      { id: "bio-circuits", name: "Bio-Circuits", description: "The left cyan crystalline input tube feeding the central bowl — living vines functioning as biological data cables.", x: 15, y: 30, width: 18, height: 48, type: "examine", elaraDialog: "Bio-circuits. Living data networks grown from Ne-Yon genetic material. They process information faster than silicon and repair themselves when damaged. The Ne-Yon dream of a future where all technology is alive — where machines grow, evolve, and think alongside their creators. This chamber is the prototype for that future." },
      { id: "door-medical-synthesis", name: "Return to Medical Bay", description: "The bio-organic passage back to the Medical Bay.", x: 40, y: 93, width: 20, height: 5, type: "door", action: "medical-bay" },
      { id: "synth-vat", name: "Synthesis Vat", description: "The right amber crystalline input tube — a cylindrical glass tank holding slow-spinning amber fluid, the medical bay's neural-stim base synthesised from raw biostock.", x: 62, y: 30, width: 18, height: 48, type: "interact", action: "room-mystery:synthesis-chamber:synth-vat" },
      { id: "recipe-board", name: "Recipe Board", description: "The far-right wall holographic recipe panels — a brass-framed slate listing the chamber's authorised syntheses. The newest entry — Substrate-N. RESTRICTED — is in a hand that is not Lyra's.", x: 85, y: 18, width: 14, height: 55, type: "interact", action: "room-mystery:synthesis-chamber:recipe-board" },
      // Mystery wiring — Collector arc: the Architect's assembly-record, the Collector's Garden bed
      { id: "architects-assembly-record", name: "The Architect's Assembly Record", description: "A folio in the chamber's assembly-doctrine drawer — the Collector's curatorial doctrine, his own donorless origin, and the Inception Ark mandate.", x: 4, y: 12, width: 16, height: 28, type: "interact", action: "room-mystery:synthesis-chamber:architects-assembly-record" },
      { id: "the-collectors-garden-bed", name: "The Collector's Garden Bed", description: "A sealed planter fed from the vat's overflow — the Collector's Garden: a three-thousand-year crossbreeding project, the one place he makes rather than keeps.", x: 4, y: 44, width: 16, height: 28, type: "interact", action: "room-mystery:synthesis-chamber:the-collectors-garden-bed" },
      // Mystery wiring — Necromancer arc: the Architect's tolerance doctrine, his silence, and the conditional boundary
      { id: "architects-tolerance-record", name: "The Architect's Tolerance Record", description: "A record of an absence in the assembly-doctrine drawer — the Architect's unspoken consent to the Necromancer's continuity, the tolerance doctrine, and the boundary the roster's leader will defend.", x: 24, y: 76, width: 14, height: 18, type: "interact", action: "room-mystery:synthesis-chamber:architects-tolerance-record" },
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

      { id: "airlock-control", name: "Airlock Control", description: "The central PURPLE GLOWING PORTAL door — a brass-rimmed cylinder with deep-oxblood seal gaskets. Ready-light glowing steady warm-gold.", x: 22, y: 22, width: 28, height: 60, type: "interact", action: "room-mystery:station-dock:airlock-control" },
      { id: "station-console", name: "Station Command Console", description: "The central foreground pedestal with cyan monitor — design and manage your personal space station from this holographic interface.", x: 38, y: 65, width: 22, height: 28, type: "terminal", action: "/space-station", elaraDialog: "The Station Command Console. From here you can build modules, collect resources, and customize your orbital base. Your civil skills in Engineering and Architecture directly affect build speed and module efficiency. Your class determines which specialized modules you can unlock." },
      { id: "defense-grid", name: "The Warden's Vigil", description: "The right-wall faction banners — dimensional fortification and raiding systems, named after the Archon who oversaw the Panopticon's defense grid.", x: 60, y: 25, width: 30, height: 45, type: "terminal", action: "/tower-defense", elaraDialog: "The Warden's Vigil — named after the Archon who oversaw the Panopticon's defense grid. Place elemental towers to fortify your station, or launch raids against other Potentials. Your class, species, alignment, and skills all shape which towers and units you command." },
      { id: "arena-portal", name: "Competitive Arena Portal", description: "The right-foreground brass display case with statue — trophy rankings, daily streaks, and league standings.", x: 78, y: 55, width: 18, height: 32, type: "terminal", action: "/competitive-arena", elaraDialog: "The Competitive Arena. Track your raid trophies, climb the league ladder, and maintain your daily streak for Chrono Shards. Your RPG build gives you an edge — stronger characters earn more trophies per victory." },
      { id: "circuit-paddock", name: "Dead Man's Circuit Paddock", description: "The left-wall doorway area — bone-tracks built from the remains of dead clones, where Nilmorg narrates the season.", x: 0, y: 35, width: 14, height: 50, type: "terminal", action: "/circuit", elaraDialog: "Dead Man's Circuit. The karts race bone-tracks built from dead clones, and Nilmorg calls every lap. The most honest accounting of what disposability costs." },
      { id: "door-engineering-dock", name: "Return to Engineering", description: "The small left-wall door back to Engineering.", x: 0, y: 25, width: 8, height: 12, type: "door", action: "engineering" },
      { id: "ship-manifest", name: "Ship Manifest", description: "Brass slab with rolling-paper readouts on the foreground pedestal — the most recent entry is dated the day before Lyra's death.", x: 40, y: 70, width: 8, height: 8, type: "interact", action: "room-mystery:station-dock:ship-manifest" },
      { id: "cargo-lift", name: "Cargo Lift", description: "The floor platform in front of the central portal — currently empty. Last used to load Wraith's transport. A faint graphite smear remains.", x: 30, y: 92, width: 30, height: 6, type: "interact", action: "room-mystery:station-dock:cargo-lift" },
      { id: "codas-trading-floor", name: "Coda's Trading-Floor Desk", description: "The right-foreground brass display case interior — a worktop where Hierarchy correspondents file documents in transit.", x: 78, y: 60, width: 14, height: 18, type: "interact", action: "room-mystery:station-dock:codas-trading-floor" },
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

      { id: "world-projector", name: "Syndicate World Projector", description: "The right-wall pink/purple star-chart display — a holographic display of your guild's capital world.", x: 70, y: 22, width: 28, height: 50, type: "terminal", action: "/syndicate-world", elaraDialog: "The Syndicate World Projector. Your guild's capital is displayed here. Your civil skills in Architecture and Engineering reduce build costs and times. Your class mastery unlocks special buildings only available to certain classes." },
      { id: "prestige-altar", name: "Prestige Altar", description: "The left-wall tall sigil plaque — a glowing altar where Potentials undertake quest chains to unlock prestige classes.", x: 0, y: 22, width: 22, height: 50, type: "terminal", action: "/prestige-quests", elaraDialog: "The Prestige Altar. Undertake quest chains that unlock prestige classes — advanced specializations that grant powerful bonuses to everything you do. Each requires specific base classes, species, and skill levels." },
      { id: "sigil-altar", name: "Sigil Altar", description: "The central raised octagonal floor seal with sigil — a low brass slab inscribed with every guild-sigil the Ark has ever recognised. Some sigils are scratched out. Some are double-engraved.", x: 30, y: 65, width: 38, height: 30, type: "interact", action: "room-mystery:guild-sanctum:sigil-altar" },
      { id: "conexus-governance-shell", name: "CoNexus Governance Shell", description: "The central-back desk where the figure stands — the governance shell the Architect's dismantled CoNexus left behind.", x: 40, y: 32, width: 20, height: 28, type: "terminal", action: "/governance", elaraDialog: "The CoNexus governance shell. When the Architect dismantled the constructed CoNexus it left this voting chamber empty. The saga's nexus decisions are how the playerbase fills it." },
      { id: "door-bridge-sanctum", name: "Return to Bridge", description: "The arched door back to the Command Bridge.", x: 45, y: 22, width: 10, height: 14, type: "door", action: "bridge" },
      { id: "allegiance-pad", name: "Allegiance Pad", description: "A small pressure-pad in the floor at the lip of the octagonal sigil-altar dais — stepping on it puts your current allegiances on the record.", x: 35, y: 90, width: 28, height: 8, type: "interact", action: "room-mystery:guild-sanctum:allegiance-pad" },

      // ── PRESTIGE-ALTAR MYSTERY SUB-RECTS (left-wall sigil plaque) ──
      { id: "wolf-minigame-entry-state", name: "Hunt-the-Hero — Minigame Entry State", description: "On the left-wall sigil plaque: the case-handover board — the player's E2-E4 choices set the minigame's opening state. The investigation closes; the gameplay opens.", x: 2, y: 28, width: 5, height: 5, type: "interact", action: "room-mystery:guild-sanctum:wolf-minigame-entry-state" },
      { id: "wolf-present-in-hall", name: "Wolf, Present in the Hall — Chronicle Window", description: "On the left-wall sigil plaque: a chronicle window — the Wolf wearing the medic's cloak, reading her inner-lining bond-prayer. Deciding whether to extend mercy a second time.", x: 10, y: 28, width: 5, height: 5, type: "interact", action: "room-mystery:guild-sanctum:wolf-present-in-hall" },
      { id: "storm-degens-house-advantage-anomaly", name: "Degen's House-Advantage Anomaly", description: "On the left-wall sigil plaque (allegiance-pad accounting): a multi-decade anomaly in the Degen's house advantage, annotated 'patron arrangement — Storm-class.'", x: 2, y: 38, width: 5, height: 5, type: "interact", action: "room-mystery:guild-sanctum:storm-degens-house-advantage-anomaly" },
      { id: "advocate-xethraal-debt-ledger", name: "Xeth'Raal's Debt Ledger — Advocate Entry", description: "On the left-wall sigil plaque (debt-archive console): the Hierarchy CFO's ledger entry on the Advocate. 'Sacrifice... recorded as a debt that could never be fully repaid.'", x: 10, y: 38, width: 5, height: 5, type: "interact", action: "room-mystery:guild-sanctum:advocate-xethraal-debt-ledger" },
      { id: "the-advocates-blind-spot", name: "The Advocate's Blind Spot", description: "On the left-wall sigil plaque (cross-reference panel): the third use of the Blood Weave the Advocate's defensive doctrine cannot perceive, and the cost it relocates onto the subject.", x: 2, y: 48, width: 15, height: 8, type: "interact", action: "room-mystery:guild-sanctum:the-advocates-blind-spot" },
      { id: "what-telling-the-advocate-costs", name: "What Telling the Advocate Costs", description: "On the left-wall sigil plaque (witness-and-binding logic): the Advocate's unknowing by construction, and the small severance the player can perform by speaking.", x: 2, y: 60, width: 15, height: 8, type: "interact", action: "room-mystery:guild-sanctum:what-telling-the-advocate-costs" },

      // ── WORLD-PROJECTOR (right-wall) MYSTERY SUB-RECTS ──
      { id: "resur-degens-open-ledger-line", name: "Degen's Open Ledger Line — Ark Survivor", description: "On the right-wall projector (casino-ledger panel): 'Ark survivor, no fee — hundred-year arrangement, settlement deferred.' The Degen's clerks do not write copyist's pleasantries.", x: 72, y: 28, width: 5, height: 5, type: "interact", action: "room-mystery:guild-sanctum:resur-degens-open-ledger-line" },
      { id: "resur-molvereth-contract-clause", name: "Mol'Vereth Contract — Cycle-Walker Clause", description: "Pinned to the right-wall projector: the Mol'Vereth contract clause. 'In the event of the second fall, the cycle walker rides the Ark.' Mol'Vereth's other clauses are notably literal.", x: 80, y: 28, width: 5, height: 5, type: "interact", action: "room-mystery:guild-sanctum:resur-molvereth-contract-clause" },
      { id: "resur-degens-pending-settlement", name: "Degen's Pending Settlement — Ark 1047", description: "On the right-wall projector (long-arrangement shelf): 'pending settlement — hundred-year arrangement, witness night TBD.' Authored on the same instant as the Resurrectionist's vanishing.", x: 88, y: 28, width: 5, height: 5, type: "interact", action: "room-mystery:guild-sanctum:resur-degens-pending-settlement" },
      { id: "the-mirror-doctrine-loom", name: "The Mirror-Doctrine Loom", description: "On the right-wall projector (doctrine cross-reference): the Advocate's doctrine that Syl'Vex weaves the same Weave to convert, the consent-mechanics of it, and what the defending cost the Advocate.", x: 72, y: 40, width: 15, height: 8, type: "interact", action: "room-mystery:guild-sanctum:the-mirror-doctrine-loom" },
      { id: "the-sister-of-the-weave-letter", name: "The Sister-of-the-Weave Letter", description: "On the right-wall projector (witness-and-binding panel): the Weave's refusal to counter-convert, the Advocate's repeated 'sister of the same Weave,' and her closure letter to the player.", x: 72, y: 52, width: 15, height: 8, type: "interact", action: "room-mystery:guild-sanctum:the-sister-of-the-weave-letter" },
      { id: "the-binding-chains-cost", name: "The Binding-Chains Cost", description: "On the right-wall projector lower-edge (defense-doctrine summary): the Advocate's binding chains that made the Taskmaster's siege a category error, and the humanity holding them cost her irreversibly.", x: 72, y: 62, width: 15, height: 8, type: "interact", action: "room-mystery:guild-sanctum:the-binding-chains-cost" },
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

      { id: "comm-terminal", name: "Communications Terminal", description: "The left-wall cork board (upper) — send messages, manage friends, and stay connected.", x: 0, y: 18, width: 14, height: 25, type: "terminal", action: "/social", elaraDialog: "The Communications Terminal. Send friend requests, exchange direct messages, and manage your social connections. A strong network is essential for guild operations and cooperative raids." },
      { id: "bulletin-board", name: "Bulletin Board", description: "The left-wall cork board (lower) — most pinned notices are decades old; a few, including a yearly memorial reading, are recent.", x: 0, y: 44, width: 14, height: 25, type: "interact", action: "room-mystery:social-hub:bulletin-board" },
      { id: "challenge-board", name: "Challenge Board", description: "The back-center kitchen/bar area — issue and accept friendly challenges with custom rules.", x: 35, y: 28, width: 30, height: 30, type: "terminal", action: "/friendly-challenges", elaraDialog: "The Challenge Board. Issue friendly challenges to other Potentials — unranked matches with custom rules. Check the daily challenge for bonus rewards. Your RPG build affects your challenge effectiveness." },
      { id: "donation-shrine", name: "Donation Shrine", description: "The right-wall framed board (upper) — donate resources to your guild and earn reputation.", x: 85, y: 18, width: 14, height: 25, type: "terminal", action: "/donations", elaraDialog: "The Donation Shrine. Contribute resources to your guild and earn reputation points. Higher reputation unlocks special guild perks and shows your dedication to the cause." },
      { id: "degen-casino-table", name: "The Degen's Casino", description: "The right-wall framed board (lower) — the Trickster's inherited casino, at the edge of the Dreamer's Shield.", x: 85, y: 44, width: 14, height: 25, type: "terminal", action: "/casino", elaraDialog: "The Degen's Casino — won in the Casino Heist. You gamble at the edge of the Dreamer's Shield because the house is a Ne-Yon and the game is how he reads you." },
      { id: "lore-desk", name: "Lore Journal Desk", description: "The long dining table across the foreground — write about the Dischordian Saga and earn XP.", x: 16, y: 60, width: 65, height: 30, type: "terminal", action: "/lore-journal", elaraDialog: "The Lore Journal. Write about characters, factions, events, and theories from the Dischordian Saga. Your writing earns XP based on word count, and your RPG build provides writing bonuses — Oracle class boosts XP multiplier, Diplomat civil skill improves engagement." },
      { id: "mess-table", name: "Mess Table", description: "The dining table's surface (foreground sub-rect) — Lyra's discipline that no two crew ever ate from identical equipment; mismatched plates and cups remain.", x: 25, y: 75, width: 45, height: 12, type: "interact", action: "room-mystery:social-hub:mess-table" },
      { id: "door-bridge-social", name: "Return to Bridge", description: "The corridor back to the Command Bridge.", x: 0, y: 92, width: 10, height: 8, type: "door", action: "bridge" },
      // Mystery wiring — advocate.blood_weave · e3 (Syl'Vex's recruitment pitch)
      // Anchored on the left-wall lower bulletin board as a sub-rect.
      { id: "advocate-sylvex-recruitment-pitch", name: "Syl'Vex's Recruitment-Pitch Transcript", description: "Pinned to the left-wall lower bulletin board: the transcript of Syl'Vex's pitch to one of the Advocate's generals. Preserved by the Hierarchy as the doctrine's most-effective recruitment template.", x: 4, y: 50, width: 5, height: 5, type: "interact", action: "room-mystery:social-hub:advocate-sylvex-recruitment-pitch" },
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
      // Mystery wiring — apps/shared/roomMysteries/dreamsWorkshop.ts
      { id: "dream-loom", name: "Dream Loom", description: "A vertical brass frame strung with phosphor-lavender threads. Weaves dreams when unobserved; unweaves when watched.", x: 16, y: 2, width: 14, height: 18, type: "interact", action: "room-mystery:dreams-workshop-subbasement:dream-loom" },
      { id: "fragment-rack", name: "Fragment Rack", description: "A wall-rack of small clear vials. Each holds one finished thread of dream-weave. Labels older than the Ark.", x: 46, y: 2, width: 14, height: 18, type: "interact", action: "room-mystery:dreams-workshop-subbasement:fragment-rack" },
      { id: "mirror-pool", name: "Mirror Pool", description: "A shallow basin of mercury. The surface reflects a ceiling that is not in this room.", x: 46, y: 38, width: 12, height: 12, type: "interact", action: "room-mystery:dreams-workshop-subbasement:mirror-pool" },
      // Mystery wiring — Politician arc: the secret-apprentice imprint lattice (the policy's living half)
      { id: "secret-apprentice-imprint-lattice", name: "Secret-Apprentice Imprint Lattice", description: "Below the loom's frame, half inside the wall, a lattice of phosphor threads that does not unweave when watched — because it is not weaving. It is holding.", x: 16, y: 38, width: 14, height: 16, type: "interact", action: "room-mystery:dreams-workshop-subbasement:secret-apprentice-imprint-lattice" },
      // Mystery wiring — Necromancer arc: the in-Matrix held thread — Varkul's vigil and the maker's pre-authored Protocol 42 schema
      { id: "necromancer-protocol-42-schema", name: "Protocol 42 Schema", description: "A thread the loom holds without weaving — Varkul's vigil at the Cathedral inside the Matrix, and the Necromancer's own pre-authored Resurrection Protocol 42.", x: 62, y: 38, width: 14, height: 16, type: "interact", action: "room-mystery:dreams-workshop-subbasement:necromancer-protocol-42-schema" },
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
      { id: "snow-globe-thirteenth-pedestal", name: "The Thirteenth Pedestal", description: "The unlisted central pedestal — Hellbox-shaped snow-globe, Resurrectionist's seal, the Wolf contained inside.", x: 40, y: 35, width: 20, height: 30, type: "interact", action: "room-mystery:hall-of-disappearances:snow-globe-thirteenth-pedestal" },
      { id: "snow-globe-release-lever", name: "The Release Lever", description: "A single-action, irreversible lever on the pedestal's outer ring. Both companions have warned against pulling it on the record.", x: 38, y: 66, width: 24, height: 14, type: "interact", action: "room-mystery:hall-of-disappearances:snow-globe-release-lever" },
      { id: "antiquarians-journal", name: "Antiquarian's Journal", description: "Open to the final case entry on the reading-table beside the pedestal — the chronicler's concession.", x: 66, y: 50, width: 18, height: 18, type: "interact", action: "room-mystery:hall-of-disappearances:antiquarians-journal" },
      { id: "pedestals-twelve", name: "The Twelve Niches", description: "Twelve niches around the chamber, each holding an empty pedestal carrying a folded cloak. The League heroes who completed their preparation and stepped beyond.", x: 4, y: 12, width: 30, height: 70, type: "examine", action: "room-mystery:hall-of-disappearances:pedestals-twelve" },
      { id: "door-antiquarian-library", name: "Return to Antiquarian Library", description: "The corridor back to the library that holds the chronicle.", x: 86, y: 30, width: 14, height: 60, type: "door", action: "antiquarian-library" },
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
