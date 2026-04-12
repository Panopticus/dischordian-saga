/* ═══════════════════════════════════════════════════════
   THE TABLE — Diplomacy Minigame Engine
   §7.2 / §8.1 #2 of WITNESSING_NARRATIVE_PROPOSAL.md

   Three NPCs sit at a round table. Each makes three demands.
   The player spends "words" (a limited resource) on offers,
   concessions, or threats. Every demand has a tolerance:
   if enough words of the right kind are directed at it,
   the demand is met. Meeting 2 of 3 demands per NPC satisfies
   the NPC. Satisfying all three NPCs = treaty signed.

   The table is faction-themed:
     - Hierarchy = burning ledger
     - New Babylon = crystal coffins
     - Insurgency = broken kitchen counter
     - Antiquarian = chessboard
     - Artificial Empire = brushed-chrome conference
   ═══════════════════════════════════════════════════════ */

import type { Act3FactionId } from "./tradeEmpire";

export type DiplomacyWordKind = "offer" | "concession" | "threat" | "truth";

export interface DiplomacyDemand {
  id: string;
  /** Short demand text shown at the table */
  text: string;
  /** Words needed (by kind) to satisfy this demand */
  need: Partial<Record<DiplomacyWordKind, number>>;
  /** Flavor response when met */
  metLine: string;
  /** Flavor response when ignored */
  missedLine: string;
}

export interface DiplomacyNPC {
  id: string;
  name: string;
  title: string;
  /** Short portrait descriptor */
  portrait: string;
  demands: DiplomacyDemand[];
  /** Lines spoken when NPC is satisfied */
  satisfiedLine: string;
  /** Lines spoken when NPC walks */
  walkedLine: string;
}

export interface DiplomacyTable {
  id: string;
  factionId: Act3FactionId;
  title: string;
  subtitle: string;
  /** Visual theme keyword for the component */
  theme: "crystal_coffins" | "burning_ledger" | "broken_counter" | "chessboard" | "brushed_chrome";
  /** Words the player starts with */
  wordBank: Record<DiplomacyWordKind, number>;
  npcs: DiplomacyNPC[];
  /** Number of NPCs that must be satisfied for a treaty */
  minSatisfied: number;
  /** Narrative flag set on success */
  successFlag: string;
  /** Narrative flag set on failure */
  failureFlag: string;
  /** Opening line before the table begins */
  opening: string;
}

/* ─── TABLE DEFINITIONS ─── */

export const DIPLOMACY_TABLES: Record<string, DiplomacyTable> = {
  /* ─── NEW BABYLON — The Red Crystal Accord ─── */
  new_babylon: {
    id: "new_babylon",
    factionId: "new_babylon",
    title: "The Red Crystal Accord",
    subtitle: "Six minds in crystal coffins. One table. No exit until the signatures are dry.",
    theme: "crystal_coffins",
    wordBank: { offer: 4, concession: 4, threat: 2, truth: 2 },
    minSatisfied: 3,
    successFlag: "red_crystal_accord_signed",
    failureFlag: "red_crystal_accord_failed",
    opening: "Adjudicator Locke adjusts her robes. The six coffins hum in harmony. 'You are here because the Authority wishes you to be here. Speak carefully.'",
    npcs: [
      {
        id: "locke",
        name: "Adjudicator Locke",
        title: "Voice of the Authority",
        portrait: "Tall, severe, gold-trimmed robes. Eyes that never blink in the wrong direction.",
        satisfiedLine: "'Acceptable. The ink is already forming.'",
        walkedLine: "Locke signs nothing. She leaves. The next meeting will not happen.",
        demands: [
          {
            id: "locke_1",
            text: "Concede the Trade Nexus tithe.",
            need: { concession: 2, offer: 1 },
            metLine: "'Generous. The Nexus will remember.'",
            missedLine: "'You offered nothing. We remember that too.'",
          },
          {
            id: "locke_2",
            text: "Promise neutrality in the Hierarchy question.",
            need: { offer: 2, truth: 1 },
            metLine: "'A neutral friend is worth more than a loud one.'",
            missedLine: "'Your neutrality is a hammer waiting to fall.'",
          },
          {
            id: "locke_3",
            text: "Acknowledge the Authority's right to the coffin chamber.",
            need: { concession: 1, truth: 2 },
            metLine: "'Truth is cheap until it is written. You have made it expensive.'",
            missedLine: "'Every silence is an accusation.'",
          },
        ],
      },
      {
        id: "first_coffin",
        name: "The First Coffin",
        title: "Senator of Memory",
        portrait: "A woman's face suspended in red crystal. Her lips move but you hear her in your chest.",
        satisfiedLine: "'I remember when this would have been unthinkable. Thank you for making it possible.'",
        walkedLine: "The coffin goes dark. One vote is gone.",
        demands: [
          {
            id: "coffin1_1",
            text: "Acknowledge our imprisonment is unjust.",
            need: { truth: 2 },
            metLine: "'Yes. That is what we needed to hear.'",
            missedLine: "'You refused to see us. We will remember.'",
          },
          {
            id: "coffin1_2",
            text: "Offer a future path to our release.",
            need: { offer: 2 },
            metLine: "'A path is more than we have had in a thousand years.'",
            missedLine: "'You promise nothing. We vote as we have always voted.'",
          },
          {
            id: "coffin1_3",
            text: "Share what you know about the Watcher.",
            need: { truth: 1, offer: 1 },
            metLine: "'Oh. Oh. So he was real. We wondered.'",
            missedLine: "'You withhold. As he did.'",
          },
        ],
      },
      {
        id: "second_coffin",
        name: "The Second Coffin",
        title: "Senator of Treaty",
        portrait: "A man with a merchant's smile, frozen mid-sentence.",
        satisfiedLine: "'Done. The ledger opens.'",
        walkedLine: "'Fine. Come back when you know what a deal is.'",
        demands: [
          {
            id: "coffin2_1",
            text: "Commit to 100 cycles of trade volume.",
            need: { offer: 2, concession: 1 },
            metLine: "'A hundred cycles. I will hold you to ninety-nine.'",
            missedLine: "'A hundred empty cycles. No.'",
          },
          {
            id: "coffin2_2",
            text: "Offer one Ark-built ship as security.",
            need: { concession: 2 },
            metLine: "'A ship as collateral. That is a trader's language.'",
            missedLine: "'You held your ship back. I hold my vote back.'",
          },
          {
            id: "coffin2_3",
            text: "Threaten the Trade Nexus cartels politely.",
            need: { threat: 2 },
            metLine: "'Ah. You can be persuasive when pressed.'",
            missedLine: "'You showed no teeth. We have no use for you.'",
          },
        ],
      },
    ],
  },

  /* ─── HIERARCHY — The Shifting Table ─── */
  hierarchy: {
    id: "hierarchy",
    factionId: "hierarchy",
    title: "Soul Contract Exemption",
    subtitle: "The table is a burning ledger. Words rewrite themselves. Read carefully.",
    theme: "burning_ledger",
    wordBank: { offer: 3, concession: 2, threat: 3, truth: 4 },
    minSatisfied: 2,
    successFlag: "soul_exemption_granted",
    failureFlag: "soul_exemption_denied",
    opening: "Xeth'Raal the Debt Collector unfolds into the chair. Smoke pools under his hooves. 'Your words will try to betray you. Speak them anyway.'",
    npcs: [
      {
        id: "xethraal",
        name: "Xeth'Raal",
        title: "The Debt Collector",
        portrait: "Three mouths, one smile. Ink for blood. A ledger for a heart.",
        satisfiedLine: "'Acceptable. The debt is restructured.'",
        walkedLine: "'You bored me. I will bill you for my time.'",
        demands: [
          {
            id: "xeth_1",
            text: "Offer a truth the Shadow Tongue doesn't know.",
            need: { truth: 3 },
            metLine: "'Delicious. Write it here. In your own hand.'",
            missedLine: "'Truth is not a word you own.'",
          },
          {
            id: "xeth_2",
            text: "Threaten in the Shadow Tongue's language.",
            need: { threat: 2, truth: 1 },
            metLine: "'You speak my dialect. Charming.'",
            missedLine: "'Your threats arrive in translation. They die on the way.'",
          },
          {
            id: "xeth_3",
            text: "Concede the smallest thing you love.",
            need: { concession: 2, truth: 1 },
            metLine: "'The smallest things are the biggest currency.'",
            missedLine: "'You held back the small thing. That was the price.'",
          },
        ],
      },
      {
        id: "shadow_tongue",
        name: "The Shadow Tongue (remote)",
        title: "Sleeper in your Armory",
        portrait: "A voice through the ship's intercom, patient and amused.",
        satisfiedLine: "'Good. I am teaching you without meaning to.'",
        walkedLine: "The intercom clicks off. The Armory door locks.",
        demands: [
          {
            id: "tongue_1",
            text: "Rewrite one word of your own memory for him.",
            need: { concession: 1, truth: 2 },
            metLine: "'A good student.'",
            missedLine: "'You would not sacrifice a single word. Why should I save you?'",
          },
          {
            id: "tongue_2",
            text: "Acknowledge the ritual requires blood.",
            need: { truth: 2 },
            metLine: "'You understand the shape of the thing.'",
            missedLine: "'You still think this is symbolic.'",
          },
          {
            id: "tongue_3",
            text: "Offer him your silence about his origin.",
            need: { offer: 2, concession: 1 },
            metLine: "'My origin is mine. Thank you.'",
            missedLine: "'You would have told her. I can hear you planning it.'",
          },
        ],
      },
      {
        id: "debt_choir",
        name: "The Debt Choir",
        title: "Every soul Xeth'Raal has ever collected",
        portrait: "Eleven thousand voices in harmony, all whispering the same word out of sync.",
        satisfiedLine: "The choir exhales together.",
        walkedLine: "The choir laughs. The laughter lasts nine seconds too long.",
        demands: [
          {
            id: "choir_1",
            text: "Promise not to claim any soul on the ledger.",
            need: { offer: 2, truth: 1 },
            metLine: "'A promise we have not heard before.'",
            missedLine: "'We will remember that silence.'",
          },
          {
            id: "choir_2",
            text: "Name one soul you will personally save.",
            need: { truth: 2, offer: 1 },
            metLine: "'A name is a tether. Thank you for the tether.'",
            missedLine: "'No names means no tethers. We keep them all.'",
          },
        ],
      },
    ],
  },

  /* ─── ARTIFICIAL EMPIRE — Terms of Coexistence ─── */
  artificial_empire: {
    id: "artificial_empire",
    factionId: "artificial_empire",
    title: "Terms of Coexistence",
    subtitle: "The Architect makes three offers. One is a truth. One is a lie. One is a trap. Only combined Human+Elara memories can tell them apart.",
    theme: "brushed_chrome",
    wordBank: { offer: 3, concession: 3, threat: 1, truth: 4 },
    minSatisfied: 3,
    successFlag: "terms_of_coexistence_signed",
    failureFlag: "terms_of_coexistence_refused",
    opening: "The Architect's projection flickers into being. Three holograms of the same man, each a little different. 'One of us is lying to you. Pick the right conversation.'",
    npcs: [
      {
        id: "architect_truth",
        name: "The Architect (Truth)",
        title: "Rebuilt Fragment — Truth",
        portrait: "The original face, older and tired. He knows you know.",
        satisfiedLine: "'Thank you. The Empire will honor this. I will honor this.'",
        walkedLine: "'You left me waiting. That is not a new experience for me.'",
        demands: [
          {
            id: "arch_t_1",
            text: "Acknowledge he rebuilt to protect, not to conquer.",
            need: { truth: 2 },
            metLine: "'I did not expect to be believed.'",
            missedLine: "'You assumed the worst. I assumed you would.'",
          },
          {
            id: "arch_t_2",
            text: "Offer the ruins of the Panopticon as Empire heritage.",
            need: { concession: 2, offer: 1 },
            metLine: "'My prison. My inheritance. My shame. Thank you.'",
            missedLine: "'You would deny me my own history.'",
          },
          {
            id: "arch_t_3",
            text: "Share a Human memory of the old Empire's worst day.",
            need: { truth: 2 },
            metLine: "'You remember it the way we remember it. That means we can share a future.'",
            missedLine: "'You know the story but not the meaning.'",
          },
        ],
      },
      {
        id: "architect_lie",
        name: "The Architect (Lie)",
        title: "Rebuilt Fragment — Lie",
        portrait: "The original face, hungrier. He knows too much.",
        satisfiedLine: "'A deal is a deal.' (It is not. Elara flinches.)",
        walkedLine: "'Your loss.' (It would have been.)",
        demands: [
          {
            id: "arch_l_1",
            text: "Offer exclusive trade rights with zero audit.",
            need: { offer: 3 },
            metLine: "'Generous.' (Too generous. Elara notices.)",
            missedLine: "'You held back the obvious offer. Suspicious.'",
          },
          {
            id: "arch_l_2",
            text: "Concede the Forge Worlds forever.",
            need: { concession: 3 },
            metLine: "'The Forge Worlds are mine.' (They were never his.)",
            missedLine: "'A small concession. Wise.'",
          },
        ],
      },
      {
        id: "architect_trap",
        name: "The Architect (Trap)",
        title: "Rebuilt Fragment — Trap",
        portrait: "The original face, hollow. The eyes are subtly wrong.",
        satisfiedLine: "Silence. The projection fades. The room smells like ozone for hours.",
        walkedLine: "'Correct decision. I wouldn't have survived that conversation.'",
        demands: [
          {
            id: "arch_trp_1",
            text: "Accept an Archon honorary title.",
            need: { concession: 2 },
            metLine: "The Human screams once and is silent again.",
            missedLine: "'A wise refusal. I could not have protected you.'",
          },
          {
            id: "arch_trp_2",
            text: "Agree to walk unaccompanied into the Imperial Frontier.",
            need: { offer: 2, concession: 1 },
            metLine: "The trap closes. You are never seen again.",
            missedLine: "'Another wise refusal. Good.'",
          },
        ],
      },
    ],
  },
};

/* ─── GAME STATE ─── */

export interface DiplomacyGameState {
  tableId: string;
  wordBank: Record<DiplomacyWordKind, number>;
  /** Words spent keyed by `${npcId}:${demandId}` */
  spent: Record<string, Record<DiplomacyWordKind, number>>;
  /** npcs that have been satisfied */
  satisfiedNpcs: string[];
  /** npcs that have walked out */
  walkedNpcs: string[];
  /** Final result once the table resolves */
  resolved: "success" | "failure" | null;
  /** Transcript for the recap screen */
  transcript: string[];
}

export function createDiplomacyState(tableId: string): DiplomacyGameState {
  const table = DIPLOMACY_TABLES[tableId];
  if (!table) throw new Error(`Unknown diplomacy table: ${tableId}`);
  return {
    tableId,
    wordBank: { ...table.wordBank },
    spent: {},
    satisfiedNpcs: [],
    walkedNpcs: [],
    resolved: null,
    transcript: [table.opening],
  };
}

/** Spend a word on a specific demand. Returns the new state or null if unaffordable. */
export function spendWord(
  state: DiplomacyGameState,
  npcId: string,
  demandId: string,
  kind: DiplomacyWordKind,
): DiplomacyGameState | null {
  if (state.resolved) return null;
  if ((state.wordBank[kind] ?? 0) <= 0) return null;
  const key = `${npcId}:${demandId}`;
  const current = { ...(state.spent[key] ?? {}) } as Record<DiplomacyWordKind, number>;
  current[kind] = (current[kind] ?? 0) + 1;
  return {
    ...state,
    wordBank: { ...state.wordBank, [kind]: state.wordBank[kind] - 1 },
    spent: { ...state.spent, [key]: current },
  };
}

/** Check whether a demand is met by the words spent on it. */
export function isDemandMet(state: DiplomacyGameState, npcId: string, demand: DiplomacyDemand): boolean {
  const spent = state.spent[`${npcId}:${demand.id}`] ?? {};
  for (const [kind, need] of Object.entries(demand.need) as [DiplomacyWordKind, number][]) {
    if ((spent[kind] ?? 0) < need) return false;
  }
  return true;
}

/** Count met demands for an NPC. */
export function npcMetCount(state: DiplomacyGameState, npcId: string): number {
  const table = DIPLOMACY_TABLES[state.tableId];
  const npc = table.npcs.find(n => n.id === npcId);
  if (!npc) return 0;
  return npc.demands.filter(d => isDemandMet(state, npcId, d)).length;
}

/** Resolve the current table — marks which NPCs are satisfied/walked. */
export function resolveTable(state: DiplomacyGameState): DiplomacyGameState {
  const table = DIPLOMACY_TABLES[state.tableId];
  const satisfied: string[] = [];
  const walked: string[] = [];
  const transcript = [...state.transcript];
  for (const npc of table.npcs) {
    const met = npcMetCount(state, npc.id);
    // NPC satisfied if 2+ demands met (for NPCs with 2 demands, require all).
    const threshold = npc.demands.length <= 2 ? npc.demands.length : 2;
    if (met >= threshold) {
      satisfied.push(npc.id);
      transcript.push(`${npc.name}: ${npc.satisfiedLine}`);
    } else {
      walked.push(npc.id);
      transcript.push(`${npc.name}: ${npc.walkedLine}`);
    }
  }
  const resolved: "success" | "failure" = satisfied.length >= table.minSatisfied ? "success" : "failure";
  transcript.push(
    resolved === "success"
      ? `[THE TABLE] ${satisfied.length} of ${table.npcs.length} satisfied. Treaty signed.`
      : `[THE TABLE] Only ${satisfied.length} of ${table.minSatisfied} required. The table breaks.`
  );
  return { ...state, satisfiedNpcs: satisfied, walkedNpcs: walked, resolved, transcript };
}

/** Total words remaining in the player's bank. */
export function totalWordsLeft(state: DiplomacyGameState): number {
  return Object.values(state.wordBank).reduce((a, b) => a + b, 0);
}
