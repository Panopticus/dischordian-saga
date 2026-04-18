// fightEnhancements.ts — Air Combos, Counter-Hits, Frame Data, Skins, Challenges, Trials, Mastery

// ============================================================
// 1. AIR COMBO SYSTEM
// ============================================================

export interface AirComboState {
  isJuggled: boolean;
  juggleHeight: number;
  juggleDecay: number;
  juggleHits: number;
  maxJuggle: number;
  damageScaling: number;
}

export function initJuggle(): AirComboState {
  return { isJuggled: false, juggleHeight: 0, juggleDecay: 0.85, juggleHits: 0, maxJuggle: 8, damageScaling: 1.0 };
}

export function updateJuggle(state: AirComboState, launchHeight: number): AirComboState {
  if (state.juggleHits >= state.maxJuggle) return { ...state, isJuggled: false, juggleHeight: 0 };
  const newHeight = Math.max(0, (state.juggleHeight + launchHeight) * state.juggleDecay);
  const hits = state.juggleHits + 1;
  return {
    ...state,
    isJuggled: newHeight > 0,
    juggleHeight: newHeight,
    juggleHits: hits,
    damageScaling: Math.max(0.2, 1.0 - (hits - 1) * 0.1),
  };
}

export function getJuggleDamageMultiplier(state: AirComboState): number {
  return state.damageScaling;
}

// ============================================================
// 2. COUNTER-HIT SYSTEM
// ============================================================

export interface CounterHitResult {
  isCounterHit: boolean;
  isCrushCounter: boolean;
  damageMultiplier: number;
  bonusHitstun: number;
}

export function checkCounterHit(
  attackerMoveWeight: 'light' | 'medium' | 'heavy',
  defenderCurrentFrame: number,
  defenderStartupFrames: number,
): CounterHitResult {
  const inStartup = defenderCurrentFrame > 0 && defenderCurrentFrame <= defenderStartupFrames;
  if (!inStartup) return { isCounterHit: false, isCrushCounter: false, damageMultiplier: 1.0, bonusHitstun: 0 };
  const crush = attackerMoveWeight === 'heavy';
  return {
    isCounterHit: true,
    isCrushCounter: crush,
    damageMultiplier: crush ? 1.5 : 1.25,
    bonusHitstun: crush ? 10 : 5,
  };
}

// ============================================================
// 3. FRAME ADVANTAGE SYSTEM
// ============================================================

export interface FrameAdvantageData {
  moveId: string;
  startup: number;
  active: number;
  recovery: number;
  onHit: number;
  onBlock: number;
  cancelable: boolean;
}

export function calculateFrameAdvantage(
  attackerRecovery: number,
  defenderStun: number,
): number {
  return defenderStun - attackerRecovery;
}

export const SAMPLE_FRAME_DATA: FrameAdvantageData[] = [
  { moveId: 'jab',            startup: 4,  active: 2, recovery: 8,  onHit: 3,   onBlock: -1,  cancelable: true },
  { moveId: 'straight',       startup: 6,  active: 3, recovery: 12, onHit: 5,   onBlock: -2,  cancelable: true },
  { moveId: 'hook',           startup: 8,  active: 3, recovery: 16, onHit: 7,   onBlock: -4,  cancelable: true },
  { moveId: 'uppercut',       startup: 5,  active: 4, recovery: 22, onHit: 10,  onBlock: -8,  cancelable: false },
  { moveId: 'low_kick',       startup: 5,  active: 3, recovery: 10, onHit: 2,   onBlock: -2,  cancelable: true },
  { moveId: 'roundhouse',     startup: 10, active: 4, recovery: 20, onHit: 8,   onBlock: -6,  cancelable: false },
  { moveId: 'sweep',          startup: 9,  active: 3, recovery: 24, onHit: 0,   onBlock: -12, cancelable: false },
  { moveId: 'dash_punch',     startup: 14, active: 5, recovery: 18, onHit: 4,   onBlock: -3,  cancelable: true },
  { moveId: 'spinning_back',  startup: 12, active: 4, recovery: 22, onHit: 6,   onBlock: -7,  cancelable: false },
  { moveId: 'axe_kick',       startup: 18, active: 6, recovery: 26, onHit: 12,  onBlock: -10, cancelable: false },
  { moveId: 'elbow_strike',   startup: 7,  active: 2, recovery: 14, onHit: 4,   onBlock: -3,  cancelable: true },
  { moveId: 'knee_thrust',    startup: 6,  active: 3, recovery: 12, onHit: 3,   onBlock: -2,  cancelable: true },
  { moveId: 'palm_strike',    startup: 11, active: 3, recovery: 16, onHit: 6,   onBlock: -5,  cancelable: true },
  { moveId: 'crescent_kick',  startup: 15, active: 5, recovery: 20, onHit: 9,   onBlock: -8,  cancelable: false },
  { moveId: 'command_grab',   startup: 7,  active: 2, recovery: 30, onHit: 15,  onBlock: -18, cancelable: false },
];

// ============================================================
// 4. CHARACTER SKINS
// ============================================================

export type SkinRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type SkinSource = 'shop' | 'mastery' | 'event' | 'battlepass';

export interface FighterSkin {
  id: string;
  fighterId: string;
  name: string;
  palette: { body: string; accent: string; energy: string; eye: string };
  rarity: SkinRarity;
  source: SkinSource;
  cost: number;
}

export const FIGHTER_SKINS: FighterSkin[] = [
  { id: 'arc-default',     fighterId: 'architect', name: 'Blueprint',        palette: { body: '#3A5FCD', accent: '#C0C0C0', energy: '#00BFFF', eye: '#FFFFFF' }, rarity: 'common',    source: 'shop',       cost: 0 },
  { id: 'arc-neon',        fighterId: 'architect', name: 'Neon Grid',        palette: { body: '#0D0D0D', accent: '#39FF14', energy: '#39FF14', eye: '#39FF14' }, rarity: 'rare',      source: 'shop',       cost: 500 },
  { id: 'arc-golden',      fighterId: 'architect', name: 'Golden Ratio',     palette: { body: 'var(--energy-premium)', accent: '#B8860B', energy: '#FFFACD', eye: '#FF4500' }, rarity: 'legendary', source: 'mastery',    cost: 0 },
  { id: 'eng-default',     fighterId: 'enigma',    name: 'Cipher',           palette: { body: '#4B0082', accent: '#8A2BE2', energy: '#DA70D6', eye: '#FF00FF' }, rarity: 'common',    source: 'shop',       cost: 0 },
  { id: 'eng-void',        fighterId: 'enigma',    name: 'Void Walker',      palette: { body: '#0C0C0C', accent: '#330033', energy: '#9400D3', eye: '#EEDD00' }, rarity: 'epic',      source: 'event',      cost: 1200 },
  { id: 'eng-prism',       fighterId: 'enigma',    name: 'Prism Shift',      palette: { body: '#FFFFFF', accent: '#FF6EC7', energy: '#7DF9FF', eye: '#FF1493' }, rarity: 'rare',      source: 'battlepass', cost: 0 },
  { id: 'war-default',     fighterId: 'warlord',   name: 'Iron Legion',      palette: { body: '#8B0000', accent: '#2F4F4F', energy: '#FF4500', eye: 'var(--energy-premium)' }, rarity: 'common',    source: 'shop',       cost: 0 },
  { id: 'war-frost',       fighterId: 'warlord',   name: 'Frost General',    palette: { body: '#4682B4', accent: '#B0E0E6', energy: '#ADD8E6', eye: '#00CED1' }, rarity: 'rare',      source: 'shop',       cost: 500 },
  { id: 'war-inferno',     fighterId: 'warlord',   name: 'Inferno Lord',     palette: { body: '#1A1A1A', accent: '#FF2400', energy: '#FF6600', eye: '#FF0000' }, rarity: 'legendary', source: 'mastery',    cost: 0 },
  { id: 'hum-default',     fighterId: 'human',     name: 'Survivor',         palette: { body: '#556B2F', accent: '#8B8682', energy: '#F5DEB3', eye: '#2E8B57' }, rarity: 'common',    source: 'shop',       cost: 0 },
  { id: 'hum-cyber',       fighterId: 'human',     name: 'Cybernetic',       palette: { body: '#36454F', accent: '#00FFFF', energy: '#00FFFF', eye: '#00FF00' }, rarity: 'epic',      source: 'shop',       cost: 1000 },
  { id: 'hum-rebel',       fighterId: 'human',     name: 'Rebel Outcast',    palette: { body: '#8B4513', accent: '#D2691E', energy: '#FFA500', eye: '#FFFF00' }, rarity: 'rare',      source: 'battlepass', cost: 0 },
  { id: 'src-default',     fighterId: 'source',    name: 'Raw Code',         palette: { body: '#006400', accent: '#00FF00', energy: '#7CFC00', eye: '#ADFF2F' }, rarity: 'common',    source: 'shop',       cost: 0 },
  { id: 'src-corrupt',     fighterId: 'source',    name: 'Corrupted Data',   palette: { body: '#4A0000', accent: '#FF0000', energy: '#8B0000', eye: '#DC143C' }, rarity: 'epic',      source: 'event',      cost: 1200 },
  { id: 'src-ascended',    fighterId: 'source',    name: 'Ascended Matrix',  palette: { body: '#FAFAD2', accent: 'var(--energy-premium)', energy: '#FFFFFF', eye: '#FFF8DC' }, rarity: 'legendary', source: 'mastery',    cost: 0 },
];

// ============================================================
// 5. DAILY CHALLENGES
// ============================================================

export interface FightChallenge {
  id: string;
  title: string;
  description: string;
  type: 'win' | 'combo' | 'perfect' | 'special' | 'variety';
  target: number;
  rewardXP: number;
  rewardCurrency: number;
}

interface ChallengeTemplate {
  title: string;
  description: string;
  type: FightChallenge['type'];
  target: number;
  rewardXP: number;
  rewardCurrency: number;
}

const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  { title: 'Combo Fiend',       description: 'Land a 5+ hit combo',                     type: 'combo',   target: 1,  rewardXP: 150, rewardCurrency: 50 },
  { title: 'Winning Streak',    description: 'Win 3 fights in a row',                    type: 'win',     target: 3,  rewardXP: 200, rewardCurrency: 75 },
  { title: 'Flawless',          description: 'Win a round without taking damage',         type: 'perfect', target: 1,  rewardXP: 300, rewardCurrency: 100 },
  { title: 'Special Delivery',  description: 'Land 10 special moves',                    type: 'special', target: 10, rewardXP: 175, rewardCurrency: 60 },
  { title: 'Well Rounded',      description: 'Play 3 different fighters',                type: 'variety', target: 3,  rewardXP: 200, rewardCurrency: 80 },
  { title: 'Air Juggler',       description: 'Land 3 air combos',                        type: 'combo',   target: 3,  rewardXP: 250, rewardCurrency: 90 },
  { title: 'Counter Master',    description: 'Land 5 counter-hits',                      type: 'special', target: 5,  rewardXP: 225, rewardCurrency: 85 },
  { title: 'Ten Victories',     description: 'Win 10 fights',                            type: 'win',     target: 10, rewardXP: 400, rewardCurrency: 150 },
  { title: 'No Mercy',          description: 'Win 2 rounds by perfect KO',               type: 'perfect', target: 2,  rewardXP: 350, rewardCurrency: 120 },
  { title: 'World Warrior',     description: 'Use every available fighter at least once', type: 'variety', target: 5,  rewardXP: 500, rewardCurrency: 200 },
];

export function generateDailyChallenges(seed?: number): FightChallenge[] {
  const s = seed ?? Date.now();
  const shuffled = [...CHALLENGE_TEMPLATES].sort((a, b) => {
    const ha = Math.sin(s + CHALLENGE_TEMPLATES.indexOf(a)) * 10000;
    const hb = Math.sin(s + CHALLENGE_TEMPLATES.indexOf(b)) * 10000;
    return (ha - Math.floor(ha)) - (hb - Math.floor(hb));
  });
  return shuffled.slice(0, 3).map((t, i) => ({
    id: `daily-${s}-${i}`,
    title: t.title,
    description: t.description,
    type: t.type,
    target: t.target,
    rewardXP: t.rewardXP,
    rewardCurrency: t.rewardCurrency,
  }));
}

// ============================================================
// 6. COMBO TRIALS
// ============================================================

export interface ComboTrial {
  id: string;
  fighterId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  inputSequence: string[];
  displaySteps: string[];
  targetDamage: number;
}

export const COMBO_TRIALS: ComboTrial[] = [
  {
    id: 'arc-t1', fighterId: 'architect', difficulty: 'beginner',
    inputSequence: ['LP', 'LP', 'MP', 'QCF+LP'],
    displaySteps: ['Jab', 'Jab', 'Straight', 'Blueprint Beam'],
    targetDamage: 180,
  },
  {
    id: 'arc-t2', fighterId: 'architect', difficulty: 'advanced',
    inputSequence: ['HP', 'QCF+MP', 'juggle', 'DP+HP', 'QCB+LP+MP'],
    displaySteps: ['Hook', 'Grid Launch', 'Air Juggle', 'Rising Pillar', 'Schematic Burst (Super)'],
    targetDamage: 420,
  },
  {
    id: 'eng-t1', fighterId: 'enigma', difficulty: 'beginner',
    inputSequence: ['LK', 'MK', 'QCB+MK'],
    displaySteps: ['Low Kick', 'Knee Thrust', 'Phase Slide'],
    targetDamage: 150,
  },
  {
    id: 'war-t1', fighterId: 'warlord', difficulty: 'intermediate',
    inputSequence: ['MP', 'HP', 'HCF+HP', 'juggle', 'DP+MP'],
    displaySteps: ['Straight', 'Hook', 'War Charge', 'Juggle', 'Rising Axe'],
    targetDamage: 310,
  },
  {
    id: 'hum-t1', fighterId: 'human', difficulty: 'intermediate',
    inputSequence: ['LP', 'MP', 'HP', 'QCF+HK', 'juggle', 'QCF+LP'],
    displaySteps: ['Jab', 'Straight', 'Hook', 'Survival Kick Launch', 'Juggle', 'Pulse Shot'],
    targetDamage: 290,
  },
  {
    id: 'src-t1', fighterId: 'source', difficulty: 'advanced',
    inputSequence: ['HK', 'QCF+MP', 'juggle', 'LP', 'MP', 'QCB+HP', 'HCB+LP+HP'],
    displaySteps: ['Roundhouse', 'Data Spike Launch', 'Juggle', 'Jab', 'Straight', 'Recursive Loop', 'Stack Overflow (Super)'],
    targetDamage: 470,
  },
];

// ============================================================
// 7. FIGHTER MASTERY
// ============================================================

export interface MasteryPerk {
  level: number;
  type: 'alt_color' | 'taunt' | 'victory_anim' | 'legendary_skin' | 'title';
  description: string;
}

export interface FighterMastery {
  fighterId: string;
  level: number;
  xp: number;
  perks: MasteryPerk[];
}

const XP_PER_LEVEL = [0, 100, 300, 600, 1000, 1600, 2400, 3500, 5000, 7000];

const MASTERY_PERKS: MasteryPerk[] = [
  { level: 3,  type: 'alt_color',      description: 'Unlocks alternate color palette' },
  { level: 5,  type: 'taunt',          description: 'Unlocks unique taunt emote' },
  { level: 7,  type: 'victory_anim',   description: 'Unlocks exclusive victory animation' },
  { level: 10, type: 'legendary_skin', description: 'Unlocks legendary mastery skin' },
  { level: 10, type: 'title',          description: 'Unlocks mastery title for profile' },
];

export function getLevelPerks(level: number): MasteryPerk[] {
  return MASTERY_PERKS.filter(p => p.level <= level);
}

export function gainFighterXP(mastery: FighterMastery, earned: number): FighterMastery {
  if (mastery.level >= 10) return mastery;
  let xp = mastery.xp + earned;
  let level = mastery.level;
  while (level < 10 && xp >= XP_PER_LEVEL[level]) {
    xp -= XP_PER_LEVEL[level];
    level++;
  }
  if (level >= 10) xp = 0;
  return { fighterId: mastery.fighterId, level, xp, perks: getLevelPerks(level) };
}

export function initMastery(fighterId: string): FighterMastery {
  return { fighterId, level: 1, xp: 0, perks: [] };
}
