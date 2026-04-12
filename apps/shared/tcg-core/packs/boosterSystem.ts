/**
 * Season 1 Booster Pack System — "Echoes of the Fall"
 *
 * 100 pack-exclusive cards purchasable only via Dream Token packs.
 * This is the primary monetization layer for the TCG.
 *
 * === CARD VARIANTS (Our version of shinies/holos) ===
 *
 * Every card has a base version. Some cards also exist in special variants:
 *
 * - STANDARD: Normal art, normal border. Default.
 * - HOLOGRAPHIC: Animated holographic foil overlay. ~10% drop rate in packs.
 *   Cosmetic only — same stats. Tradeable on marketplace.
 * - VOID ENERGY: Dark energy particle effects on the card art. ~3% drop rate.
 *   Cosmetic + grants a unique card back when 5 Void Energy cards collected.
 * - CORRUPTED: Glitch-art variant with pink corruption veins. ~1% drop rate.
 *   Cosmetic + the card's flavor text changes to a Thought Virus version.
 * - GOLDEN: Full gold foil border + animated sparkle. ~0.5% drop rate.
 *   Cosmetic + counts as 2x for collection completion.
 * - PRISMATIC: Rainbow shifting holographic. Legendary packs only. ~0.1%.
 *   Cosmetic + unlocks a title when collected.
 *
 * === CROSS-GAME UNLOCK CARDS (Seed Cards) ===
 *
 * Some booster cards unlock content in OTHER game systems when collected:
 *
 * - Governance Seed Cards: Unlock new governance vote topics
 * - Trade Empire Seeds: Unlock hidden Trade Empire missions
 * - Breeding Gene Cards: Unlock rare genetic traits for crew breeding
 * - Chess Opponent Card: Unlocks "The Game Master" as a chess opponent
 * - Fighter Unlock: "Akai Shi, The Red Death" — collect her card to
 *   unlock her as a playable fighter in the Arena combat system
 *
 * === PET EVOLUTION CARDS ===
 *
 * Cards depicting each pet at each evolution stage (8 pets × 3 stages = 24).
 * Collecting all 3 stages of a pet grants a cosmetic pet card back.
 *
 * === IDENTITY VARIANT CARDS ===
 *
 * Key characters exist in multiple identity states:
 * - Kael: The Recruiter → Patient Zero → The Source (3 cards)
 * - The Human: Student → Detective → Archon (3 cards)
 * - Elara: Ship AI → Advocate → Panoptic (3 cards)
 * - The Oracle: Prisoner → Prophet → Ascended (3 cards)
 *
 * === COSMETIC UNLOCK CARDS ===
 *
 * Specific rare cards unlock cosmetics when collected:
 * - Board skins, avatar frames, titles, emotes, trail effects
 */

export type CardVariant =
  | "standard"
  | "holographic"
  | "void_energy"
  | "corrupted"
  | "golden"
  | "prismatic";

export interface VariantDropRate {
  variant: CardVariant;
  /** Probability 0-1 that a card in a pack is this variant. */
  dropRate: number;
  /** Description for the collection UI. */
  description: string;
  /** What collecting N of this variant unlocks. */
  collectionBonus?: string;
}

export const VARIANT_DROP_RATES: readonly VariantDropRate[] = Object.freeze([
  {
    variant: "standard",
    dropRate: 0.854,
    description: "Standard card with normal art and border.",
  },
  {
    variant: "holographic",
    dropRate: 0.10,
    description: "Animated holographic foil overlay. Tradeable.",
  },
  {
    variant: "void_energy",
    dropRate: 0.03,
    description: "Dark energy particle effects. Collect 5 for a unique card back.",
    collectionBonus: "card_back_void_energy",
  },
  {
    variant: "corrupted",
    dropRate: 0.01,
    description: "Glitch-art with pink corruption veins. Alternate Thought Virus flavor text.",
    collectionBonus: "title_corrupted_collector",
  },
  {
    variant: "golden",
    dropRate: 0.005,
    description: "Full gold foil border with animated sparkle. Counts as 2x for collection.",
    collectionBonus: "avatar_frame_golden",
  },
  {
    variant: "prismatic",
    dropRate: 0.001,
    description: "Rainbow shifting holographic. Legendary packs only. Unlocks a title.",
    collectionBonus: "title_prismatic_master",
  },
]);

/** What a booster card can unlock in other game systems. */
export type CrossGameUnlock =
  | { kind: "governance_vote"; voteTopicId: string }
  | { kind: "trade_mission"; missionId: string }
  | { kind: "breeding_gene"; geneId: string; trait: string }
  | { kind: "chess_opponent"; opponentId: string }
  | { kind: "fighter_unlock"; fighterId: string }
  | { kind: "cosmetic"; cosmeticType: string; cosmeticId: string }
  | { kind: "pet_card_back"; petSpecies: string }
  | { kind: "title"; titleId: string }
  | { kind: "none" };

export interface BoosterCardMeta {
  cardDefId: string;
  /** Which cross-game system this card unlocks (if any). */
  crossGameUnlock: CrossGameUnlock;
  /** If this is a pet evolution card, which pet + stage. */
  petEvolution?: { species: string; stage: 1 | 2 | 3 };
  /** If this is an identity variant, which character + state. */
  identityVariant?: { character: string; state: string; order: number };
  /** Pack-exclusive — cannot be earned through gameplay rewards. */
  packExclusive: true;
}

/**
 * All 100 booster pack cards with their cross-game metadata.
 *
 * Categories:
 *   1-24: Pet Evolution cards (8 pets × 3 stages)
 *   25-36: Identity Variant cards (4 characters × 3 states)
 *   37-41: Cross-Game Seed cards (governance, trade, genes, chess, fighter)
 *   42-51: Cosmetic Unlock cards (one per cosmetic category)
 *   52-100: Standard booster units + spells (balanced gameplay cards)
 */
export const BOOSTER_CARD_META: readonly BoosterCardMeta[] = Object.freeze([
  // ─── Pet Evolution Cards (24) ───
  // Holographic Fox
  { cardDefId: "s1_pack_pet_holo_fox_1", crossGameUnlock: { kind: "none" }, petEvolution: { species: "holographic_fox", stage: 1 }, packExclusive: true },
  { cardDefId: "s1_pack_pet_holo_fox_2", crossGameUnlock: { kind: "none" }, petEvolution: { species: "holographic_fox", stage: 2 }, packExclusive: true },
  { cardDefId: "s1_pack_pet_holo_fox_3", crossGameUnlock: { kind: "pet_card_back", petSpecies: "holographic_fox" }, petEvolution: { species: "holographic_fox", stage: 3 }, packExclusive: true },
  // Data Serpent
  { cardDefId: "s1_pack_pet_data_serpent_1", crossGameUnlock: { kind: "none" }, petEvolution: { species: "data_serpent", stage: 1 }, packExclusive: true },
  { cardDefId: "s1_pack_pet_data_serpent_2", crossGameUnlock: { kind: "none" }, petEvolution: { species: "data_serpent", stage: 2 }, packExclusive: true },
  { cardDefId: "s1_pack_pet_data_serpent_3", crossGameUnlock: { kind: "pet_card_back", petSpecies: "data_serpent" }, petEvolution: { species: "data_serpent", stage: 3 }, packExclusive: true },
  // Temporal Kitten
  { cardDefId: "s1_pack_pet_temporal_kitten_1", crossGameUnlock: { kind: "none" }, petEvolution: { species: "temporal_kitten", stage: 1 }, packExclusive: true },
  { cardDefId: "s1_pack_pet_temporal_kitten_2", crossGameUnlock: { kind: "none" }, petEvolution: { species: "temporal_kitten", stage: 2 }, packExclusive: true },
  { cardDefId: "s1_pack_pet_temporal_kitten_3", crossGameUnlock: { kind: "pet_card_back", petSpecies: "temporal_kitten" }, petEvolution: { species: "temporal_kitten", stage: 3 }, packExclusive: true },
  // Glyph Moth
  { cardDefId: "s1_pack_pet_glyph_moth_1", crossGameUnlock: { kind: "none" }, petEvolution: { species: "glyph_moth", stage: 1 }, packExclusive: true },
  { cardDefId: "s1_pack_pet_glyph_moth_2", crossGameUnlock: { kind: "none" }, petEvolution: { species: "glyph_moth", stage: 2 }, packExclusive: true },
  { cardDefId: "s1_pack_pet_glyph_moth_3", crossGameUnlock: { kind: "pet_card_back", petSpecies: "glyph_moth" }, petEvolution: { species: "glyph_moth", stage: 3 }, packExclusive: true },
  // Flicker Imp
  { cardDefId: "s1_pack_pet_flicker_imp_1", crossGameUnlock: { kind: "none" }, petEvolution: { species: "flicker_imp", stage: 1 }, packExclusive: true },
  { cardDefId: "s1_pack_pet_flicker_imp_2", crossGameUnlock: { kind: "none" }, petEvolution: { species: "flicker_imp", stage: 2 }, packExclusive: true },
  { cardDefId: "s1_pack_pet_flicker_imp_3", crossGameUnlock: { kind: "pet_card_back", petSpecies: "flicker_imp" }, petEvolution: { species: "flicker_imp", stage: 3 }, packExclusive: true },
  // Gilt Beetle
  { cardDefId: "s1_pack_pet_gilt_beetle_1", crossGameUnlock: { kind: "none" }, petEvolution: { species: "gilt_beetle", stage: 1 }, packExclusive: true },
  { cardDefId: "s1_pack_pet_gilt_beetle_2", crossGameUnlock: { kind: "none" }, petEvolution: { species: "gilt_beetle", stage: 2 }, packExclusive: true },
  { cardDefId: "s1_pack_pet_gilt_beetle_3", crossGameUnlock: { kind: "pet_card_back", petSpecies: "gilt_beetle" }, petEvolution: { species: "gilt_beetle", stage: 3 }, packExclusive: true },
  // Spore Fungus
  { cardDefId: "s1_pack_pet_spore_fungus_1", crossGameUnlock: { kind: "none" }, petEvolution: { species: "spore_fungus", stage: 1 }, packExclusive: true },
  { cardDefId: "s1_pack_pet_spore_fungus_2", crossGameUnlock: { kind: "none" }, petEvolution: { species: "spore_fungus", stage: 2 }, packExclusive: true },
  { cardDefId: "s1_pack_pet_spore_fungus_3", crossGameUnlock: { kind: "pet_card_back", petSpecies: "spore_fungus" }, petEvolution: { species: "spore_fungus", stage: 3 }, packExclusive: true },
  // Void Crawler
  { cardDefId: "s1_pack_pet_void_crawler_1", crossGameUnlock: { kind: "none" }, petEvolution: { species: "void_crawler", stage: 1 }, packExclusive: true },
  { cardDefId: "s1_pack_pet_void_crawler_2", crossGameUnlock: { kind: "none" }, petEvolution: { species: "void_crawler", stage: 2 }, packExclusive: true },
  { cardDefId: "s1_pack_pet_void_crawler_3", crossGameUnlock: { kind: "pet_card_back", petSpecies: "void_crawler" }, petEvolution: { species: "void_crawler", stage: 3 }, packExclusive: true },

  // ─── Identity Variant Cards (12) ───
  // Kael's transformation arc
  { cardDefId: "s1_pack_id_kael_recruiter", crossGameUnlock: { kind: "none" }, identityVariant: { character: "kael", state: "recruiter", order: 1 }, packExclusive: true },
  { cardDefId: "s1_pack_id_kael_patient_zero", crossGameUnlock: { kind: "none" }, identityVariant: { character: "kael", state: "patient_zero", order: 2 }, packExclusive: true },
  { cardDefId: "s1_pack_id_kael_source", crossGameUnlock: { kind: "title", titleId: "title_witnessed_the_fall" }, identityVariant: { character: "kael", state: "source", order: 3 }, packExclusive: true },
  // The Human's identity chain
  { cardDefId: "s1_pack_id_human_student", crossGameUnlock: { kind: "none" }, identityVariant: { character: "human", state: "student", order: 1 }, packExclusive: true },
  { cardDefId: "s1_pack_id_human_detective", crossGameUnlock: { kind: "none" }, identityVariant: { character: "human", state: "detective", order: 2 }, packExclusive: true },
  { cardDefId: "s1_pack_id_human_archon", crossGameUnlock: { kind: "title", titleId: "title_twelfth_archon" }, identityVariant: { character: "human", state: "archon", order: 3 }, packExclusive: true },
  // Elara's evolution
  { cardDefId: "s1_pack_id_elara_ship_ai", crossGameUnlock: { kind: "none" }, identityVariant: { character: "elara", state: "ship_ai", order: 1 }, packExclusive: true },
  { cardDefId: "s1_pack_id_elara_advocate", crossGameUnlock: { kind: "none" }, identityVariant: { character: "elara", state: "advocate", order: 2 }, packExclusive: true },
  { cardDefId: "s1_pack_id_elara_panoptic", crossGameUnlock: { kind: "cosmetic", cosmeticType: "avatar_frame", cosmeticId: "frame_elara_awakened" }, identityVariant: { character: "elara", state: "panoptic", order: 3 }, packExclusive: true },
  // The Oracle's journey
  { cardDefId: "s1_pack_id_oracle_prisoner", crossGameUnlock: { kind: "none" }, identityVariant: { character: "oracle", state: "prisoner", order: 1 }, packExclusive: true },
  { cardDefId: "s1_pack_id_oracle_prophet", crossGameUnlock: { kind: "none" }, identityVariant: { character: "oracle", state: "prophet", order: 2 }, packExclusive: true },
  { cardDefId: "s1_pack_id_oracle_ascended", crossGameUnlock: { kind: "title", titleId: "title_oracle_ascended" }, identityVariant: { character: "oracle", state: "ascended", order: 3 }, packExclusive: true },

  // ─── Cross-Game Seed Cards (5) ───
  { cardDefId: "s1_pack_seed_governance", crossGameUnlock: { kind: "governance_vote", voteTopicId: "vote_memory_purge" }, packExclusive: true },
  { cardDefId: "s1_pack_seed_trade", crossGameUnlock: { kind: "trade_mission", missionId: "mission_shadow_route" }, packExclusive: true },
  { cardDefId: "s1_pack_seed_gene", crossGameUnlock: { kind: "breeding_gene", geneId: "gene_void_touched", trait: "Void Touched" }, packExclusive: true },
  { cardDefId: "s1_pack_seed_chess", crossGameUnlock: { kind: "chess_opponent", opponentId: "game_master" }, packExclusive: true },
  { cardDefId: "s1_pack_seed_fighter", crossGameUnlock: { kind: "fighter_unlock", fighterId: "akai_shi" }, packExclusive: true },

  // ─── Cosmetic Unlock Cards (10) ───
  { cardDefId: "s1_pack_cosm_board_void", crossGameUnlock: { kind: "cosmetic", cosmeticType: "board_skin", cosmeticId: "board_void_arena" }, packExclusive: true },
  { cardDefId: "s1_pack_cosm_frame_gold", crossGameUnlock: { kind: "cosmetic", cosmeticType: "avatar_frame", cosmeticId: "frame_golden_prophecy" }, packExclusive: true },
  { cardDefId: "s1_pack_cosm_title_echo", crossGameUnlock: { kind: "title", titleId: "title_echo_of_the_fall" }, packExclusive: true },
  { cardDefId: "s1_pack_cosm_emote_taunt", crossGameUnlock: { kind: "cosmetic", cosmeticType: "emote", cosmeticId: "emote_architects_laugh" }, packExclusive: true },
  { cardDefId: "s1_pack_cosm_trail_fire", crossGameUnlock: { kind: "cosmetic", cosmeticType: "trail_effect", cosmeticId: "trail_void_flame" }, packExclusive: true },
  { cardDefId: "s1_pack_cosm_tower_skin", crossGameUnlock: { kind: "cosmetic", cosmeticType: "tower_skin", cosmeticId: "tower_terminus_spire" }, packExclusive: true },
  { cardDefId: "s1_pack_cosm_badge_s1", crossGameUnlock: { kind: "cosmetic", cosmeticType: "badge", cosmeticId: "badge_season1_collector" }, packExclusive: true },
  { cardDefId: "s1_pack_cosm_armor_void", crossGameUnlock: { kind: "cosmetic", cosmeticType: "armor_skin", cosmeticId: "armor_void_sentinel" }, packExclusive: true },
  { cardDefId: "s1_pack_cosm_card_back", crossGameUnlock: { kind: "cosmetic", cosmeticType: "card_back", cosmeticId: "back_echoes_of_the_fall" }, packExclusive: true },
  { cardDefId: "s1_pack_cosm_ship_theme", crossGameUnlock: { kind: "cosmetic", cosmeticType: "ship_theme", cosmeticId: "ship_corrupted_ark" }, packExclusive: true },

  // ─── Standard Booster Cards (49) ───
  // These are strong gameplay cards only available in packs.
  // Balanced but desirable — the reason people buy packs.
  // Distributed across all factions with good mana curve.
  ...(Array.from({ length: 49 }, (_, i) => ({
    cardDefId: `s1_pack_${String(i + 1).padStart(3, "0")}`,
    crossGameUnlock: { kind: "none" as const },
    packExclusive: true as const,
  }))),
]);

export const BOOSTER_CARD_MAP: Readonly<Record<string, BoosterCardMeta>> =
  Object.freeze(
    Object.fromEntries(BOOSTER_CARD_META.map((m) => [m.cardDefId, m]))
  );
