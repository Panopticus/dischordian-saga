/* ═══════════════════════════════════════════════════════
   SACRIFICE WITNESSED REACTIONS

   When the player sacrifices an Apprentice, every remaining
   apprentice in the roster reacts. Each archetype has its own
   tone. Bonds drop. Corruption rises. The act has weight.
   ═══════════════════════════════════════════════════════ */

import type { Apprentice, ApprenticeArchetype } from "./apprentices";

export interface SacrificeReaction {
  witnessId: string;
  witnessName: string;
  archetype: ApprenticeArchetype;
  /** Their reaction line */
  line: string;
  /** How their bond with player changed */
  bondDelta: number;
  /** How their corruption changed */
  corruptionDelta: number;
}

const REACTIONS_BY_ARCHETYPE: Record<ApprenticeArchetype, string[]> = {
  zealot: [
    "You did what was necessary. The cause demands much from us. We are worthy of the asking.",
    "I would have volunteered. Next time, ask me first.",
  ],
  ghost: [
    "I didn't look. I rarely look. But I heard it.",
    "Something about the hallway feels wrong now. I'll avoid it for a while.",
  ],
  scholar: [
    "The rarity of a Mythic-tier consciousness is 0.5%. Fewer than thirty exist in any live cohort. You just ended one.",
    "Did you weigh the outcomes before deciding? I need to know this was reasoned, not impulsive.",
  ],
  revenant: [
    "Death is a negotiation. You forced their hand. I understand the transaction. I don't envy the invoice.",
    "They may come back. I did. They may not be the same. I wasn't.",
  ],
  artisan: [
    "I saw them laughing at dinner two nights ago. Now I'll never finish the chair I was making for them.",
    "A waste. A well-crafted life, unfinished. That is the worst kind of loss.",
  ],
  oracle: [
    "I saw this in a dream three weeks ago. I did not tell them. I did not tell you. I should have.",
    "Their future-shape is gone from the room. The Matrix is smaller today.",
  ],
  wanderer: [
    "I'm leaving tonight. Just for a few days. I'll come back. Probably. I need the air.",
    "They always said they'd outlive me. They were wrong about a lot of things, apparently.",
  ],
  martyr: [
    "That should have been me. I would have volunteered. Why didn't you ask me?",
    "I hope the reward was worth their price. I am assuming it was. I am TRYING to.",
  ],
  heretic: [
    "You finally understand what this school teaches. The Architect is proud of you. I am something else.",
    "Welcome to the dark road. I walked it first. It shortens with use.",
  ],
  jester: [
    "At least the body's warm? ... sorry, bad joke. I'm going to bed now. I don't feel like talking.",
    "I'm writing their eulogy as a limerick. It's the only way I know to grieve. Please don't stop me.",
  ],
  sentinel: [
    "I was supposed to guard them. I failed. I will request reassignment after the debrief.",
    "Understood. The roster adjusts. The watch continues.",
  ],
  prodigal: [
    "I thought about leaving when I heard. I decided to stay. I don't know why. Ask me in a week.",
    "You owe someone an explanation someday. Probably me. Probably them. Probably both.",
  ],
};

/* ─── GENERATE REACTIONS ─── */

/**
 * Generate reactions from all living apprentices in the roster when
 * one is sacrificed. Returns one reaction per witness with bond/corruption
 * deltas scaled to witness archetype + sacrificed rarity.
 */
export function generateSacrificeReactions(
  sacrificed: Apprentice,
  witnesses: Apprentice[],
): SacrificeReaction[] {
  const reactions: SacrificeReaction[] = [];
  const rarityShock = { common: 1, uncommon: 1.5, rare: 2.5, epic: 4, mythic: 8 }[sacrificed.rarity];

  for (const witness of witnesses) {
    if (!witness.alive || witness.id === sacrificed.id) continue;
    const lines = REACTIONS_BY_ARCHETYPE[witness.archetype];
    const line = lines[Math.floor(Math.random() * lines.length)];

    // Archetype-specific bond/corruption response
    const { bondDelta, corruptionDelta } = getReactionDeltas(witness.archetype, rarityShock);
    reactions.push({
      witnessId: witness.id,
      witnessName: witness.name,
      archetype: witness.archetype,
      line,
      bondDelta,
      corruptionDelta,
    });
  }

  return reactions;
}

function getReactionDeltas(archetype: ApprenticeArchetype, rarityShock: number): { bondDelta: number; corruptionDelta: number } {
  // Archetype temperament determines who recoils vs who accepts
  const profile: Record<ApprenticeArchetype, { bond: number; corr: number }> = {
    zealot: { bond: -3, corr: 2 },       // accepting, hardens them
    ghost: { bond: -5, corr: 1 },         // withdraws
    scholar: { bond: -6, corr: 0 },       // analytical judgment
    revenant: { bond: -2, corr: 3 },      // familiar with death
    artisan: { bond: -8, corr: -1 },      // hurt by waste
    oracle: { bond: -4, corr: 4 },        // saw it coming
    wanderer: { bond: -6, corr: 1 },      // wants to leave
    martyr: { bond: -10, corr: 2 },       // upset they weren't asked
    heretic: { bond: 3, corr: 5 },        // validates their worldview (RISES)
    jester: { bond: -7, corr: 2 },        // grief as humor
    sentinel: { bond: -4, corr: 1 },      // failure of duty
    prodigal: { bond: -3, corr: 3 },      // old debts stirred
  };
  const p = profile[archetype];
  return {
    bondDelta: Math.round(p.bond * rarityShock),
    corruptionDelta: Math.round(p.corr * rarityShock),
  };
}
