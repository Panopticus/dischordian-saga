/* ═══════════════════════════════════════════════════════
   CASINO ART BIBLE — CDN Asset Map

   All casino visual assets served from S3 CDN.
   Organized by art-bible section. Degen character and
   trust milestone assets use the "remade" variants.

   CDN bucket: dgrsart (us-east-2)
   Path prefix: cdn/casino/
   Cache: public, max-age=31536000, immutable
   ═══════════════════════════════════════════════════════ */

const CDN_BASE = "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/casino";

/* ─── SECTION 1: ENVIRONMENTS ─── */
/** Full-bleed background images for each casino floor area */
export const CASINO_ENVIRONMENTS = {
  /** Main casino floor — wide establishing shot */
  mainFloor: `${CDN_BASE}/environments/CF-001_Main_Casino_Floor.jpg`,
  /** Card tables quarter — poker, pazaak, blackjack */
  cardTables: `${CDN_BASE}/environments/CF-002_Card_Tables_Quarter.jpg`,
  /** The Dice Pit — entropy dice, liar's dice */
  dicePit: `${CDN_BASE}/environments/CF-003_Dice_Pit.jpg`,
  /** Slots gallery — void slots, scratch cards */
  slotsGallery: `${CDN_BASE}/environments/CF-004_Slots_Gallery.jpg`,
  /** VIP lounge — high-trust exclusive area */
  vipLounge: `${CDN_BASE}/environments/CF-005_VIP_Lounge.jpg`,
  /** Betting board amphitheater — faction war betting */
  bettingBoard: `${CDN_BASE}/environments/CF-006_Betting_Board_Amphitheater.jpg`,
  /** Void bingo hall */
  bingoHall: `${CDN_BASE}/environments/CF-007_Void_Bingo_Hall.jpg`,
  /** Dream roulette chamber */
  rouletteChamber: `${CDN_BASE}/environments/CF-008_Dream_Roulette_Chamber.jpg`,
} as const;

/** Map from casino floor tab ID to its environment background */
export const FLOOR_BACKGROUNDS: Record<string, string> = {
  main: CASINO_ENVIRONMENTS.mainFloor,
  cards: CASINO_ENVIRONMENTS.cardTables,
  dice: CASINO_ENVIRONMENTS.dicePit,
  slots: CASINO_ENVIRONMENTS.slotsGallery,
  vip: CASINO_ENVIRONMENTS.vipLounge,
  betting: CASINO_ENVIRONMENTS.bettingBoard,
  bingo: CASINO_ENVIRONMENTS.bingoHall,
  roulette: CASINO_ENVIRONMENTS.rouletteChamber,
};

/* ─── SECTION 2: GAME TABLES ─── */
export const CASINO_GAME_TABLES = {
  /** Card Battler's Gauntlet table */
  cardBattlersTable: `${CDN_BASE}/game_tables/CG-001_Card_Battlers_Gauntlet_Table.jpg`,
  /** Dream Roulette — void charge device */
  voidChargeDevice: `${CDN_BASE}/game_tables/DR-001_Void_Charge_Device.png`,
  /** Faction war betting board */
  factionBettingBoard: `${CDN_BASE}/game_tables/FB-001_Faction_War_Betting_Board.png`,
  /** Tournament bracket display */
  tournamentBracket: `${CDN_BASE}/game_tables/GT-001_Tournament_Bracket.png`,
  /** Blackjack table */
  blackjackTable: `${CDN_BASE}/game_tables/GT-002_Blackjack_Table.jpg`,
  /** Void card back design */
  voidCardBack: `${CDN_BASE}/game_tables/GT-003_Void_Card_Back.png`,
  /** Liar's Dice table */
  liarsDiceTable: `${CDN_BASE}/game_tables/LD-001_Liars_Dice_Table.jpg`,
  /** Dice cup prop */
  diceCup: `${CDN_BASE}/game_tables/LD-002_Dice_Cup.png`,
  /** Liar's Dice NPCs */
  npcTheStone: `${CDN_BASE}/game_tables/LD-003-A_NPC_The_Stone.png`,
  npcTheGiggler: `${CDN_BASE}/game_tables/LD-003-B_NPC_The_Giggler.png`,
  npcTheVeteran: `${CDN_BASE}/game_tables/LD-003-C_NPC_The_Veteran.png`,
  npcTheKid: `${CDN_BASE}/game_tables/LD-003-D_NPC_The_Kid.png`,
  /** Void Bingo card & ball */
  bingoCard: `${CDN_BASE}/game_tables/VB-001_Bingo_Card.png`,
  bingoBall: `${CDN_BASE}/game_tables/VB-002_Bingo_Ball.png`,
} as const;

/* ─── SECTION 3: EFFECTS ─── */
/** Sprite-sheet-style frame pairs for win/loss/jackpot animations */
export const CASINO_EFFECTS = {
  win: [
    `${CDN_BASE}/effects/FX-001_Win_Frame1-2.png`,
    `${CDN_BASE}/effects/FX-001_Win_Frame3-4.png`,
    `${CDN_BASE}/effects/FX-001_Win_Frame5-6.png`,
    `${CDN_BASE}/effects/FX-001_Win_Frame7-8.png`,
  ],
  loss: [
    `${CDN_BASE}/effects/FX-002_Loss_Frame1-2.png`,
    `${CDN_BASE}/effects/FX-002_Loss_Frame3-4.png`,
    `${CDN_BASE}/effects/FX-002_Loss_Frame5-6.png`,
  ],
  jackpot: [
    `${CDN_BASE}/effects/FX-003_Jackpot_Frame1-3.png`,
    `${CDN_BASE}/effects/FX-003_Jackpot_Frame4-6.png`,
    `${CDN_BASE}/effects/FX-003_Jackpot_Frame7-9.png`,
    `${CDN_BASE}/effects/FX-003_Jackpot_Frame10-12.png`,
  ],
} as const;

/* ─── SECTION 4: THE DEGEN (remade) ─── */
/** The Degen's character phases — uses degen_remade assets */
export const DEGEN_CHARACTER = {
  /** Phase 1: The Bartender — charming host (trust 0-24) */
  bartenderPhase: `${CDN_BASE}/degen/DG-001_Bartender_Phase.png`,
  /** Phase 2: The Casino Boss — powerful, revealing (trust 25-79) */
  casinoBossPhase: `${CDN_BASE}/degen/DG-002_Casino_Boss_Phase.png`,
  /** Phase 3: Ne-Yon Reveal — true cosmic form (trust 80+) */
  neYonReveal: `${CDN_BASE}/degen/DG-003_NeYon_Reveal.png`,
  /** Expression variants for dialog */
  expressions: {
    neutral: `${CDN_BASE}/degen/DG-001-EXPR-A_Neutral.png`,
    amused: `${CDN_BASE}/degen/DG-001-EXPR-B_Amused.png`,
    sympathetic: `${CDN_BASE}/degen/DG-001-EXPR-C_Sympathetic.png`,
    nervous: `${CDN_BASE}/degen/DG-001-EXPR-D_Nervous.png`,
  },
} as const;

/** Map from Degen mood to expression asset */
export function getDegenPortrait(
  favor: number,
  mood?: "amused" | "bored" | "impressed" | "nervous" | "philosophical" | "predatory",
): string {
  // High trust reveals the true form
  if (favor >= 80) return DEGEN_CHARACTER.neYonReveal;
  if (favor >= 25) return DEGEN_CHARACTER.casinoBossPhase;

  // Use expression variants for lower trust bartender phase
  if (mood === "amused" || mood === "impressed") return DEGEN_CHARACTER.expressions.amused;
  if (mood === "nervous") return DEGEN_CHARACTER.expressions.nervous;
  if (mood === "philosophical" || mood === "bored") return DEGEN_CHARACTER.expressions.sympathetic;
  return DEGEN_CHARACTER.expressions.neutral;
}

/* ─── SECTION 5: PROPS & CHIPS ─── */
export const CASINO_CHIPS = {
  bronze: `${CDN_BASE}/props_chips/CHIP-BRONZE.png`,
  silver: `${CDN_BASE}/props_chips/CHIP-SILVER.png`,
  gold: `${CDN_BASE}/props_chips/CHIP-GOLD.png`,
  platinum: `${CDN_BASE}/props_chips/CHIP-PLATINUM.png`,
  void: `${CDN_BASE}/props_chips/CHIP-VOID.png`,
} as const;

export const CASINO_PROPS = {
  /** The Degen's signature glass */
  degenGlass: `${CDN_BASE}/props_chips/DG-GLASS.png`,
  /** The Degen's pocket watch (entropy motif) */
  degenWatch: `${CDN_BASE}/props_chips/DG-WATCH.png`,
} as const;

/** Map VIP level name to chip image */
export function getVipChip(vipName: string): string {
  switch (vipName) {
    case "Bronze Degen": return CASINO_CHIPS.bronze;
    case "Silver Tongue": return CASINO_CHIPS.silver;
    case "Gold Standard": return CASINO_CHIPS.gold;
    case "Platinum Edge": return CASINO_CHIPS.platinum;
    case "Void Walker": return CASINO_CHIPS.void;
    default: return CASINO_CHIPS.bronze;
  }
}

/* ─── SECTION 6: TRUST MILESTONES (remade) ─── */
/** Scene art for Degen trust milestone reveals */
export const TRUST_MILESTONES = {
  /** Trust 25 — The Bartender Remembers */
  bartenderRemembers: `${CDN_BASE}/trust/DF-TRUST-25_Bartender_Remembers.jpg`,
  /** Trust 50 — Ne-Yon Space Revealed */
  neYonSpaceRevealed: `${CDN_BASE}/trust/DF-TRUST-50_NeYon_Space_Revealed.jpg`,
  /** Trust 80 — The Mask Comes Off */
  maskComesOff: `${CDN_BASE}/trust/DF-TRUST-80_Mask_Comes_Off.jpg`,
  /** Trust 100 — Entropy's Confession */
  entropysConfession: `${CDN_BASE}/trust/DF-TRUST-100_Entropys_Confession.jpg`,
} as const;

/** Map trust threshold to milestone scene art */
export function getTrustMilestoneArt(threshold: number): string | null {
  switch (threshold) {
    case 25: return TRUST_MILESTONES.bartenderRemembers;
    case 50: return TRUST_MILESTONES.neYonSpaceRevealed;
    case 80: return TRUST_MILESTONES.maskComesOff;
    case 100: return TRUST_MILESTONES.entropysConfession;
    default: return null;
  }
}

/* ─── SECTION 7: ENVIRONMENTAL STORYTELLING ─── */
/** Discoverable props scattered through the casino for lore hunters */
export const ENVIRONMENTAL_PROPS = {
  scratchMarksCryoPod: `${CDN_BASE}/environmental/ES-001_Scratch_Marks_Cryo_Pod.png`,
  projectVectorVial: `${CDN_BASE}/environmental/ES-002_Project_Vector_Vial.png`,
  maintenanceLog: `${CDN_BASE}/environmental/ES-003_Maintenance_Log.png`,
  changingBook: `${CDN_BASE}/environmental/ES-004_Changing_Book.png`,
  agentZeroWeaponSlot: `${CDN_BASE}/environmental/ES-005_Agent_Zero_Weapon_Slot.png`,
  channel7Static: `${CDN_BASE}/environmental/ES-006_Channel_7_Static.png`,
  unnamedConstellation: `${CDN_BASE}/environmental/ES-007_Unnamed_Constellation.png`,
  ghostProcessTerminal: `${CDN_BASE}/environmental/ES-008_Ghost_Process_Terminal.png`,
  sealedBiohazardContainer: `${CDN_BASE}/environmental/ES-009_Sealed_Biohazard_Container.png`,
} as const;

/* ─── SECTION 8: INTERACTION UI ─── */
/** Discovery pulse animation frames + lore text panel */
export const INTERACTION_UI = {
  discoveryPulseFrames: [
    `${CDN_BASE}/interaction/ES-010_Discovery_Pulse_Frame1.png`,
    `${CDN_BASE}/interaction/ES-010_Discovery_Pulse_Frame2.png`,
    `${CDN_BASE}/interaction/ES-010_Discovery_Pulse_Frame3.png`,
    `${CDN_BASE}/interaction/ES-010_Discovery_Pulse_Frame4.png`,
  ],
  loreTextPanel: `${CDN_BASE}/interaction/ES-011_Lore_Text_Panel.png`,
} as const;

/* ─── LIAR'S DICE NPC PORTRAITS ─── */
/** Map NPC id to their portrait asset */
export const LIARS_DICE_NPC_PORTRAITS: Record<string, string> = {
  the_stone: CASINO_GAME_TABLES.npcTheStone,
  the_giggler: CASINO_GAME_TABLES.npcTheGiggler,
  the_veteran: CASINO_GAME_TABLES.npcTheVeteran,
  the_kid: CASINO_GAME_TABLES.npcTheKid,
};
