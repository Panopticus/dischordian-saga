/* ═══════════════════════════════════════════════════════
   CARD ADAPTER — Converts Dischordian Saga cards
   to Dischordia tactical format with 6-faction assignment
   ═══════════════════════════════════════════════════════ */
import type { DuelystCard, DuelystCardType, DuelystRarity, DuelystKeyword, Faction, SpellEffect } from "./types";
import sagaCards from "../../data/season1-cards.json";

/* ─── CHARACTER → FACTION MAPPING ─── */
const CHARACTER_FACTION: Record<string, Faction> = {
  // ARCHITECT faction (The Empire)
  "the architect": "architect",
  "conexus": "architect",
  "the collector": "architect",
  "the watcher": "architect",
  "the meme": "architect",
  "the warlord": "architect",
  "the politician": "architect",
  "the warden": "architect",
  "the vortex": "architect",
  "the gamemaster": "architect",
  "the necromancer": "architect",
  "white oracle": "architect",
  "clone army": "architect",
  "panopticon": "architect",
  "central control": "architect",

  // DREAMER faction (The Potentials / Ne-Yons)
  "the dreamer": "dreamer",
  "the judge": "dreamer",
  "the inventor": "dreamer",
  "the seer": "dreamer",
  "the storm": "dreamer",
  "the silence": "dreamer",
  "the knowledge": "dreamer",
  "the degen": "dreamer",
  "the advocate": "dreamer",
  "the resurrectionist": "dreamer",
  "the enigma": "dreamer",
  "ne-yon": "dreamer",

  // INSURGENCY faction (The Resistance)
  "iron lion": "insurgency",
  "the nomad": "insurgency",
  "agent zero": "insurgency",
  "the engineer": "insurgency",
  "council of harmony": "insurgency",
  "the hierophant": "insurgency",
  "the oracle": "insurgency",
  "the eyes": "insurgency",
  "iron clad lion troops": "insurgency",

  // NEW BABYLON faction (Syndicate of Death)
  "the human": "new_babylon",
  "adjudicar locke": "new_babylon",
  "akai shi": "new_babylon",
  "wraith calder": "new_babylon",
  "resurrectionist army": "new_babylon",
  "new babylon": "new_babylon",

  // ANTIQUARIAN faction (The Timekeeper)
  "the antiquarian": "antiquarian",
  "the league": "antiquarian",
  "the wolf": "antiquarian",

  // THOUGHT VIRUS faction (The Infection)
  "the source": "thought_virus",
  "the host": "thought_virus",
  "infected dr. lyra vox": "thought_virus",
  "dr. lyra vox": "thought_virus",
  "plague dragon": "thought_virus",
  "infected robots": "thought_virus",
  "infected soldiers": "thought_virus",
  "thought virus": "thought_virus",
};

const AFFILIATION_FACTION: Record<string, Faction> = {
  "ai empire": "architect",
  "panopticon": "architect",
  "central control": "architect",
  "mechronis": "architect",
  "insurgency": "insurgency",
  "demagi": "dreamer",
  "archon": "dreamer",
  "ne-yon": "dreamer",
  "quarchon": "thought_virus",
  "new babylon": "new_babylon",
};

const ELEMENT_FACTION: Record<string, Faction> = {
  fire: "insurgency", earth: "architect", air: "dreamer",
  water: "antiquarian", void: "thought_virus", psychic: "architect",
  light: "dreamer", lightning: "insurgency",
};

function assignFaction(card: any): Faction {
  // First check character name directly
  const name = (card.name || "").toLowerCase();
  for (const [charName, faction] of Object.entries(CHARACTER_FACTION)) {
    if (name.includes(charName)) return faction;
  }

  // Then check affiliation
  const aff = (card.affiliation || "").toLowerCase();
  for (const [key, faction] of Object.entries(AFFILIATION_FACTION)) {
    if (aff.includes(key)) return faction;
  }

  // Then element
  if (card.element && ELEMENT_FACTION[card.element]) return ELEMENT_FACTION[card.element];

  // Then alignment
  if (card.alignment === "chaos") return "thought_virus";
  if (card.alignment === "order") return "architect";

  return "neutral";
}

/* ─── KEYWORD MAPPING ─── */
const KEYWORD_MAP: Record<string, DuelystKeyword> = {
  taunt: "provoke", shield: "forcefield", rush: "rush",
  flying: "flying", ranged: "ranged", rebirth: "rebirth",
  rally: "zeal", stealth: "backstab", overpower: "frenzy",
  pierce: "blast", deathwatch: "deathwatch", grow: "grow",
  airdrop: "airdrop", intel: "opening_gambit", reveal: "opening_gambit",
  cycle: "dying_wish", drain: "opening_gambit", burn: "opening_gambit",
  freeze: "stun", silence: "dispel", summon: "opening_gambit",
  transform: "opening_gambit", ephemeral: "ephemeral",
};

function mapKeywords(sagaKeywords: string[]): DuelystKeyword[] {
  const mapped = new Set<DuelystKeyword>();
  for (const k of sagaKeywords) {
    const m = KEYWORD_MAP[k.toLowerCase()];
    if (m) mapped.add(m);
  }
  return [...mapped];
}

function mapCardType(sagaType: string): DuelystCardType {
  switch (sagaType) {
    case "unit": return "unit";
    case "spell": return "spell";
    case "artifact": return "artifact";
    case "field": return "unit";
    case "support": return "spell";
    case "narrative": return "spell";
    default: return "unit";
  }
}

function mapRarity(sagaRarity: string): DuelystRarity {
  switch (sagaRarity?.toLowerCase()) {
    case "common": return "common";
    case "uncommon": return "rare";
    case "rare": return "epic";
    case "legendary": return "legendary";
    default: return "common";
  }
}

function generateSpellEffect(card: any, duelystType: DuelystCardType): SpellEffect | undefined {
  const power = card.power || 0;
  const kws = (card.keywords || []).map((k: string) => k.toLowerCase());

  if (duelystType === "spell") {
    if (kws.includes("burn") || kws.includes("blast")) return { type: "damage", value: Math.max(2, power), target: "enemy_unit" };
    if (kws.includes("drain") || kws.includes("heal")) return { type: "heal", value: Math.max(2, power), target: "friendly_general" };
    if (kws.includes("rally") || kws.includes("empower")) return { type: "buff", value: Math.max(1, Math.floor(power / 2)), target: "friendly_unit" };
    if (kws.includes("intel") || kws.includes("reveal")) return { type: "draw", value: 2, target: "self" };
    if (kws.includes("silence") || kws.includes("dispel")) return { type: "dispel", value: 0, target: "enemy_unit" };
    if (kws.includes("freeze") || kws.includes("stun")) return { type: "damage", value: 2, target: "enemy_unit" };
    if (kws.includes("transform")) return { type: "destroy", value: 0, target: "enemy_unit" };
    if (kws.includes("aoe") || kws.includes("storm")) return { type: "aoe_damage", value: Math.max(2, power), target: "all_enemies", radius: 2 };
    if (power > 0) return { type: "damage", value: power, target: "enemy_unit" };
    return { type: "draw", value: 1, target: "self" };
  }

  if (kws.includes("burn") || kws.includes("blast")) return { type: "damage", value: Math.max(1, Math.floor(power / 2)), target: "enemy_unit" };
  if (kws.includes("drain")) return { type: "heal", value: 2, target: "friendly_general" };
  if (kws.includes("summon")) return { type: "summon", value: 2, target: "tile" };
  return undefined;
}

function balanceStats(card: any, duelystType: DuelystCardType): { attack: number; health: number; manaCost: number } {
  const sagaPower = card.power || 0;
  const sagaHealth = card.health || 0;
  const sagaCost = card.cost || 1;

  if (duelystType === "spell") return { attack: 0, health: 0, manaCost: Math.max(1, Math.min(8, sagaCost)) };
  if (duelystType === "artifact") return { attack: Math.max(1, Math.min(4, sagaPower)), health: 0, manaCost: Math.max(1, Math.min(6, sagaCost)) };

  const cost = Math.max(1, Math.min(8, sagaCost));
  let attack = Math.max(1, Math.min(cost + 2, sagaPower || cost));
  let health = Math.max(1, Math.min(cost + 3, sagaHealth || cost + 1));

  if (card.cardType === "field") { attack = 0; health = Math.max(3, Math.min(10, sagaHealth || cost + 3)); }

  return { attack, health, manaCost: cost };
}

/* ─── MAIN ADAPTER ─── */
let _cachedCards: DuelystCard[] | null = null;

export function adaptAllCards(): DuelystCard[] {
  if (_cachedCards) return _cachedCards;
  _cachedCards = (sagaCards as any[]).map((card, idx) => {
    const duelystType = mapCardType(card.cardType || "unit");
    const keywords = mapKeywords(card.keywords || []);
    const stats = balanceStats(card, duelystType);
    const spellEffect = generateSpellEffect(card, duelystType);
    if (card.cardType === "field" && !keywords.includes("structure")) keywords.push("structure");

    return {
      id: `saga_${card.id || idx}`,
      name: card.name || `Card ${idx}`,
      faction: assignFaction(card),
      cardType: duelystType,
      rarity: mapRarity(card.rarity || "common"),
      manaCost: stats.manaCost,
      attack: stats.attack,
      health: stats.health,
      keywords,
      abilityText: card.abilityText || "",
      flavorText: card.flavorText || "",
      imageUrl: card.imageUrl || "",
      spellEffect,
      artifactDurability: duelystType === "artifact" ? 3 : undefined,
      sagaCardId: card.id,
    };
  });
  return _cachedCards;
}

export function getCardsForFaction(faction: Faction): DuelystCard[] {
  return adaptAllCards().filter(c => c.faction === faction || c.faction === "neutral");
}

export function buildStarterDeck(faction: Faction): DuelystCard[] {
  const available = getCardsForFaction(faction);
  const units = available.filter(c => c.cardType === "unit").sort((a, b) => a.manaCost - b.manaCost);
  const spells = available.filter(c => c.cardType === "spell").sort((a, b) => a.manaCost - b.manaCost);
  const artifacts = available.filter(c => c.cardType === "artifact");

  const deck: DuelystCard[] = [];
  for (const u of units) {
    if (deck.length >= 24) break;
    deck.push({ ...u });
    if (deck.length < 24 && u.rarity !== "legendary") deck.push({ ...u });
  }
  for (const s of spells) {
    if (deck.length >= 36) break;
    deck.push({ ...s });
    if (deck.length < 36 && s.rarity !== "legendary") deck.push({ ...s });
  }
  for (const a of artifacts) {
    if (deck.length >= 40) break;
    deck.push({ ...a });
  }
  while (deck.length < 40 && units.length > 0) deck.push({ ...units[deck.length % units.length] });
  return deck.slice(0, 40);
}

export function getFactionCardCounts(): Record<Faction, number> {
  const counts: Record<Faction, number> = {
    architect: 0, dreamer: 0, insurgency: 0,
    new_babylon: 0, antiquarian: 0, thought_virus: 0,
    neutral: 0,
  };
  for (const c of adaptAllCards()) counts[c.faction]++;
  return counts;
}

/** Get all cards formatted for the collection view */
export function getAllCardsForCollection() {
  return adaptAllCards().map(c => ({
    id: c.id,
    name: c.name,
    rarity: c.rarity,
    faction: c.faction,
    cardType: c.cardType,
    manaCost: c.manaCost,
    attack: c.attack,
    health: c.health,
    imageUrl: c.imageUrl || "",
  }));
}
