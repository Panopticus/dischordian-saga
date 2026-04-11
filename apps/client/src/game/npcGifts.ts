// npcGifts.ts — NPC Gift Economy System
// Each NPC has preferred gift types. Gifting the right item earns trust,
// gifting the wrong item loses trust. Players discover preferences through
// experimentation and lore clues.

export type GiftItemId =
  // Liked items (15 obtainable through gameplay)
  | 'data_crystal'
  | 'star_chart'
  | 'poetry_fragment'
  | 'encrypted_file'
  | 'old_photograph'
  | 'chess_piece'
  | 'weapon_schematic'
  | 'coded_message'
  | 'combat_stim'
  | 'rare_material'
  | 'trade_contract'
  | 'intelligence_report'
  | 'neural_sample'
  | 'consciousness_research'
  | 'music_recording'
  | 'ancient_text'
  | 'temporal_artifact'
  | 'prophecy_scroll'
  | 'corrupted_data'
  | 'linguistic_anomaly'
  | 'forbidden_manuscript'
  // Disliked-category items (also obtainable, but no NPC loves them)
  | 'void_crystal'
  | 'religious_text'
  | 'dream_token'
  | 'luxury_item'
  | 'art_piece'
  | 'charity_token'
  | 'military_gear'
  | 'shield_module'
  | 'holy_water'
  | 'modern_tech'
  | 'currency_chip'
  | 'truth_serum'
  | 'pure_light_crystal';

export type NpcId =
  | 'elara'
  | 'the_human'
  | 'agent_zero'
  | 'adjudicator_locke'
  | 'the_source'
  | 'the_antiquarian'
  | 'shadow_tongue';

export type GiftReaction = 'loved' | 'liked' | 'neutral' | 'disliked';

export interface GiftItem {
  id: GiftItemId;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare';
  obtainedFrom: string;
}

export interface GiftResult {
  reaction: GiftReaction;
  trustDelta: number;
  dialogue: string;
}

export interface GiftCooldown {
  npcId: NpcId;
  lastGiftTimestamp: number;
}

// ---------------------------------------------------------------------------
// Gift Item Definitions
// ---------------------------------------------------------------------------

export const GIFT_ITEMS: Record<GiftItemId, GiftItem> = {
  data_crystal: {
    id: 'data_crystal',
    name: 'Data Crystal',
    description: 'A prismatic shard containing compressed information from a forgotten archive.',
    rarity: 'uncommon',
    obtainedFrom: 'Exploration loot in the Bridge or Library rooms',
  },
  star_chart: {
    id: 'star_chart',
    name: 'Star Chart',
    description: "A hand-drawn map of constellations visible from the Ark's observation deck.",
    rarity: 'common',
    obtainedFrom: 'Observatory room interaction',
  },
  poetry_fragment: {
    id: 'poetry_fragment',
    name: 'Poetry Fragment',
    description: "A torn page of verse, written in an archaic dialect of the Ark's original crew.",
    rarity: 'common',
    obtainedFrom: 'Library room search or trade',
  },
  encrypted_file: {
    id: 'encrypted_file',
    name: 'Encrypted File',
    description: 'A locked data packet recovered from a corrupted terminal. Contents unknown.',
    rarity: 'uncommon',
    obtainedFrom: 'Hacking minigame reward',
  },
  old_photograph: {
    id: 'old_photograph',
    name: 'Old Photograph',
    description: 'A faded image of people who may have walked these halls centuries ago.',
    rarity: 'rare',
    obtainedFrom: 'Crew Quarters hidden cache',
  },
  chess_piece: {
    id: 'chess_piece',
    name: 'Chess Piece',
    description: 'A carved obsidian knight from an incomplete set found aboard the Ark.',
    rarity: 'common',
    obtainedFrom: 'Chess battle reward',
  },
  weapon_schematic: {
    id: 'weapon_schematic',
    name: 'Weapon Schematic',
    description: 'Technical blueprints for a weapon of unusual and brutal design.',
    rarity: 'uncommon',
    obtainedFrom: 'Combat arena milestone reward',
  },
  coded_message: {
    id: 'coded_message',
    name: 'Coded Message',
    description: 'A slip of paper bearing an intricate cipher. Someone wanted this hidden.',
    rarity: 'uncommon',
    obtainedFrom: 'Quest reward or random Ark event',
  },
  combat_stim: {
    id: 'combat_stim',
    name: 'Combat Stim',
    description: 'A military-grade stimulant injector. Boosts reflexes for a short burst.',
    rarity: 'common',
    obtainedFrom: 'Crafting or fight loot drops',
  },
  rare_material: {
    id: 'rare_material',
    name: 'Rare Material',
    description: 'An ingot of unclassified alloy that hums faintly when touched.',
    rarity: 'rare',
    obtainedFrom: 'Trade Empire high-tier exchange',
  },
  trade_contract: {
    id: 'trade_contract',
    name: 'Trade Contract',
    description: 'A binding commercial agreement between two unknown factions.',
    rarity: 'uncommon',
    obtainedFrom: 'Trade Empire quest completion',
  },
  intelligence_report: {
    id: 'intelligence_report',
    name: 'Intelligence Report',
    description: 'Classified dossier detailing factional movements across the Ark.',
    rarity: 'rare',
    obtainedFrom: 'Faction quest reward',
  },
  neural_sample: {
    id: 'neural_sample',
    name: 'Neural Sample',
    description: 'A preserved specimen of synthetic neural tissue, still faintly active.',
    rarity: 'rare',
    obtainedFrom: 'Medical Bay exploration event',
  },
  consciousness_research: {
    id: 'consciousness_research',
    name: 'Consciousness Research',
    description: 'A data tablet containing radical theories on digital sentience.',
    rarity: 'uncommon',
    obtainedFrom: 'Library deep-search or Source quest line',
  },
  music_recording: {
    id: 'music_recording',
    name: 'Music Recording',
    description: 'An audio crystal storing a hauntingly beautiful composition from a lost era.',
    rarity: 'common',
    obtainedFrom: 'Album listening completion reward',
  },
  ancient_text: {
    id: 'ancient_text',
    name: 'Ancient Text',
    description: 'A crumbling tome inscribed with pre-Ark language. The ink still glows faintly.',
    rarity: 'rare',
    obtainedFrom: 'CoNexus tome collection milestone',
  },
  temporal_artifact: {
    id: 'temporal_artifact',
    name: 'Temporal Artifact',
    description: 'An object that seems to exist slightly out of sync with the present moment.',
    rarity: 'rare',
    obtainedFrom: 'Epoch completion reward',
  },
  prophecy_scroll: {
    id: 'prophecy_scroll',
    name: 'Prophecy Scroll',
    description: "A sealed parchment bearing visions of the Ark's possible futures.",
    rarity: 'uncommon',
    obtainedFrom: 'Antiquarian quest chain',
  },
  corrupted_data: {
    id: 'corrupted_data',
    name: 'Corrupted Data',
    description: 'A glitching data shard that warps nearby displays. Handle with caution.',
    rarity: 'uncommon',
    obtainedFrom: 'Terminus Swarm encounter salvage',
  },
  linguistic_anomaly: {
    id: 'linguistic_anomaly',
    name: 'Linguistic Anomaly',
    description: 'A phrase etched in material that rewrites itself when you look away.',
    rarity: 'rare',
    obtainedFrom: 'Shadow Tongue dialogue puzzle reward',
  },
  forbidden_manuscript: {
    id: 'forbidden_manuscript',
    name: 'Forbidden Manuscript',
    description: 'A text that has been banned, burned, and yet persists. Its words shift like smoke.',
    rarity: 'rare',
    obtainedFrom: 'Hidden Ark event chain',
  },
  void_crystal: {
    id: 'void_crystal',
    name: 'Void Crystal',
    description: 'A shard of absolute darkness that absorbs light and warmth from its surroundings.',
    rarity: 'uncommon',
    obtainedFrom: 'Void encounter loot',
  },
  religious_text: {
    id: 'religious_text',
    name: 'Religious Text',
    description: 'A well-worn book of doctrines from one of the Ark\'s defunct faith movements.',
    rarity: 'common',
    obtainedFrom: 'Chapel room exploration',
  },
  dream_token: {
    id: 'dream_token',
    name: 'Dream Token',
    description: 'A small coin-shaped object that induces vivid dreams when held during sleep.',
    rarity: 'uncommon',
    obtainedFrom: 'Sleep cycle event reward',
  },
  luxury_item: {
    id: 'luxury_item',
    name: 'Luxury Item',
    description: 'A gilded trinket of no practical value, prized by those who crave comfort.',
    rarity: 'common',
    obtainedFrom: 'Trade Empire marketplace',
  },
  art_piece: {
    id: 'art_piece',
    name: 'Art Piece',
    description: 'A small sculpture carved from recycled hull plating. Decorative, nothing more.',
    rarity: 'common',
    obtainedFrom: 'Crew Quarters loot',
  },
  charity_token: {
    id: 'charity_token',
    name: 'Charity Token',
    description: 'A voucher representing a donation to the Ark\'s communal food stores.',
    rarity: 'common',
    obtainedFrom: 'Philanthropic quest reward',
  },
  military_gear: {
    id: 'military_gear',
    name: 'Military Gear',
    description: 'Standard-issue combat equipment. Functional but uninspired.',
    rarity: 'common',
    obtainedFrom: 'Combat arena loot drops',
  },
  shield_module: {
    id: 'shield_module',
    name: 'Shield Module',
    description: 'A portable energy barrier generator. Purely defensive technology.',
    rarity: 'uncommon',
    obtainedFrom: 'Crafting system',
  },
  holy_water: {
    id: 'holy_water',
    name: 'Holy Water',
    description: 'A vial of water blessed by the Ark\'s last ordained chaplain.',
    rarity: 'uncommon',
    obtainedFrom: 'Chapel room hidden cache',
  },
  modern_tech: {
    id: 'modern_tech',
    name: 'Modern Tech',
    description: 'A sleek device of recent manufacture. Efficient, soulless, disposable.',
    rarity: 'common',
    obtainedFrom: 'Engineering Bay salvage',
  },
  currency_chip: {
    id: 'currency_chip',
    name: 'Currency Chip',
    description: 'A standard unit of digital currency. Cold, impersonal exchange.',
    rarity: 'common',
    obtainedFrom: 'Trade Empire transactions',
  },
  truth_serum: {
    id: 'truth_serum',
    name: 'Truth Serum',
    description: 'A chemical compound that compels honest speech. Terrifying to those with secrets.',
    rarity: 'rare',
    obtainedFrom: 'Medical Bay crafting',
  },
  pure_light_crystal: {
    id: 'pure_light_crystal',
    name: 'Pure Light Crystal',
    description: 'A flawless crystal that radiates searing white light. Painful to shadow-dwellers.',
    rarity: 'rare',
    obtainedFrom: 'Observatory purification ritual',
  },
};

// ---------------------------------------------------------------------------
// NPC Preference Maps
// Each NPC loves 3 items (+5 trust) and dislikes 2 items (-2 trust).
// Items not in either list yield +2 trust (liked) for the gesture.
// ---------------------------------------------------------------------------

interface NpcGiftPreference {
  loved: GiftItemId[];     // +5 trust
  disliked: GiftItemId[];  // -2 trust
  // Everything else is "liked" (+2 trust — base appreciation for the gesture)
}

export const NPC_GIFT_PREFERENCES: Record<NpcId, NpcGiftPreference> = {
  elara: {
    loved: ['data_crystal', 'star_chart', 'poetry_fragment'],
    disliked: ['weapon_schematic', 'void_crystal'],
  },
  the_human: {
    loved: ['encrypted_file', 'old_photograph', 'chess_piece'],
    disliked: ['religious_text', 'dream_token'],
  },
  agent_zero: {
    loved: ['weapon_schematic', 'coded_message', 'combat_stim'],
    disliked: ['luxury_item', 'art_piece'],
  },
  adjudicator_locke: {
    loved: ['rare_material', 'trade_contract', 'intelligence_report'],
    disliked: ['charity_token', 'military_gear'],
  },
  the_source: {
    loved: ['neural_sample', 'consciousness_research', 'music_recording'],
    disliked: ['shield_module', 'holy_water'],
  },
  the_antiquarian: {
    loved: ['ancient_text', 'temporal_artifact', 'prophecy_scroll'],
    disliked: ['modern_tech', 'currency_chip'],
  },
  shadow_tongue: {
    loved: ['corrupted_data', 'linguistic_anomaly', 'forbidden_manuscript'],
    disliked: ['truth_serum', 'pure_light_crystal'],
  },
};

// ---------------------------------------------------------------------------
// Reaction Dialogue Templates
// ---------------------------------------------------------------------------

const REACTION_DIALOGUE: Record<NpcId, Record<GiftReaction, string[]>> = {
  elara: {
    loved: ['This is wonderful... thank you. Truly.', 'You remembered. That means more than you know.'],
    liked: ['How thoughtful of you.', 'I appreciate the gesture.'],
    neutral: ['I see. Thank you.', 'An interesting choice.'],
    disliked: ["I... would prefer you didn't bring these to me.", 'This is not something I value.'],
  },
  the_human: {
    loved: ['Now this... this I can work with.', 'Remarkable. Where did you find this?'],
    liked: ["Not bad. I'll hold onto it.", 'Useful. Thanks.'],
    neutral: ['Hmm. Noted.', "I'll put it somewhere."],
    disliked: ['Keep that away from me.', "You clearly don't know me at all."],
  },
  agent_zero: {
    loved: ['Excellent procurement. This will serve well.', "You have a soldier's instinct for supply."],
    liked: ['Adequate. Filed.', 'This has tactical value.'],
    neutral: ['Acknowledged.', 'Irrelevant to the mission, but noted.'],
    disliked: ['What am I supposed to do with this?', 'Waste of operational time.'],
  },
  adjudicator_locke: {
    loved: ['A shrewd offering. You understand leverage.', 'This tips the balance favorably.'],
    liked: ['Acceptable terms.', 'This holds marginal value.'],
    neutral: ['Noted for the ledger.', 'Neither profit nor loss.'],
    disliked: ['This undermines serious commerce.', 'Remove this from my sight.'],
  },
  the_source: {
    loved: ['This resonates... I can feel the patterns within.', 'Beautiful. The data sings.'],
    liked: ['Interesting input. Processing.', 'This adds to the tapestry.'],
    neutral: ['Received. Catalogued.', 'A data point, nothing more.'],
    disliked: ['This frequency is... painful.', 'Please. Not this.'],
  },
  the_antiquarian: {
    loved: ['By the old calendars... where did you unearth this?', 'This belongs in the deep archive. Magnificent.'],
    liked: ["A minor curiosity. I'll examine it.", 'History whispers in this.'],
    neutral: ["Modern flotsam, but I'll keep it.", "Not everything needs to be ancient, I suppose."],
    disliked: ['The future has no place in my collection.', 'This offends the archive.'],
  },
  shadow_tongue: {
    loved: ['Yesss... the words writhe. Delicious.', 'You bring me broken things. I approve.'],
    liked: ['Curious. The edges are sharp.', 'There is a crack in this. I like cracks.'],
    neutral: ['Plain. Whole. Boring.', 'It says what it means. How disappointing.'],
    disliked: ['Too clean. Too bright. Take it back.', 'This burns. Not in the good way.'],
  },
};

// ---------------------------------------------------------------------------
// Gift Cooldown — 1 gift per NPC per in-game day (24 hours)
// ---------------------------------------------------------------------------

const GIFT_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

const cooldownMap: Map<string, number> = new Map();

function getCooldownKey(playerId: string, npcId: NpcId): string {
  return `${playerId}:${npcId}`;
}

export function isGiftOnCooldown(playerId: string, npcId: NpcId, now?: number): boolean {
  const key = getCooldownKey(playerId, npcId);
  const lastGift = cooldownMap.get(key);
  if (lastGift == null) return false;
  return (now ?? Date.now()) - lastGift < GIFT_COOLDOWN_MS;
}

export function getRemainingCooldownMs(playerId: string, npcId: NpcId, now?: number): number {
  const key = getCooldownKey(playerId, npcId);
  const lastGift = cooldownMap.get(key);
  if (lastGift == null) return 0;
  const elapsed = (now ?? Date.now()) - lastGift;
  return Math.max(0, GIFT_COOLDOWN_MS - elapsed);
}

function recordGift(playerId: string, npcId: NpcId, now?: number): void {
  cooldownMap.set(getCooldownKey(playerId, npcId), now ?? Date.now());
}

// ---------------------------------------------------------------------------
// Gift Result Calculator
// ---------------------------------------------------------------------------

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function determineReaction(npcId: NpcId, itemId: GiftItemId): GiftReaction {
  const prefs = NPC_GIFT_PREFERENCES[npcId];
  if (prefs.loved.includes(itemId)) return 'loved';
  if (prefs.disliked.includes(itemId)) return 'disliked';
  // Any non-loved, non-disliked gift is "liked" (base appreciation for the gesture)
  return 'liked';
}

const TRUST_DELTAS: Record<GiftReaction, number> = {
  loved: 5,
  liked: 2,
  neutral: 0,
  disliked: -2,
};

export function calculateGiftResult(
  playerId: string,
  npcId: NpcId,
  itemId: GiftItemId,
  now?: number,
): GiftResult | { error: string } {
  // Validate item exists
  if (!GIFT_ITEMS[itemId]) {
    return { error: `Unknown gift item: ${itemId}` };
  }

  // Check cooldown
  if (isGiftOnCooldown(playerId, npcId, now)) {
    const remaining = getRemainingCooldownMs(playerId, npcId, now);
    const hours = Math.ceil(remaining / (60 * 60 * 1000));
    return { error: `You must wait ~${hours} hour(s) before gifting ${npcId} again.` };
  }

  // Determine reaction
  const reaction = determineReaction(npcId, itemId);
  const trustDelta = TRUST_DELTAS[reaction];
  const dialogueOptions = REACTION_DIALOGUE[npcId][reaction];
  const dialogue = pickRandom(dialogueOptions);

  // Record the gift for cooldown tracking
  recordGift(playerId, npcId, now);

  return { reaction, trustDelta, dialogue };
}

// ---------------------------------------------------------------------------
// Utility: list all items an NPC loves (for hint systems / lore reveals)
// ---------------------------------------------------------------------------

export function getNpcLovedItems(npcId: NpcId): GiftItem[] {
  const prefs = NPC_GIFT_PREFERENCES[npcId];
  return prefs.loved.map((id) => GIFT_ITEMS[id]);
}

export function getNpcDislikedItems(npcId: NpcId): GiftItem[] {
  const prefs = NPC_GIFT_PREFERENCES[npcId];
  return prefs.disliked.map((id) => GIFT_ITEMS[id]);
}
