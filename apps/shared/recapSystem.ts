/* ═══════════════════════════════════════════════════════
   "PREVIOUSLY ON DISCHORDIAN SAGA..."

   Dynamic recap generator that builds a narrative summary
   from a player's progressData and gameData. Reads story
   chapters, companion relationships, morality alignment,
   Breaking Point choices, and transmission progress to
   produce a cinematic recap for returning players.
   ═══════════════════════════════════════════════════════ */

import type { BreakingPointChoice } from "./breakingPoint";
import { getNextPhaseGuidance, type SagaPhaseInput } from "./sagaPhases";

// ─── PUBLIC INTERFACES ───

export interface RecapEntry {
  chapter: number;
  title: string;
  /** Dynamic summary based on player choices */
  summary: string;
  /** Key decisions the player made */
  keyChoices: string[];
  /** Where companion relationships stand */
  companionStatus: string;
  /** Alignment commentary */
  moralityNote: string;
  /** When this happened in-game (epoch ms) */
  timestamp?: number;
}

export interface RecapReport {
  playerName: string;
  totalPlayTime: string;
  currentChapter: number;
  alignment: "Machine" | "Balanced" | "Humanity";
  alignmentScore: number;
  entries: RecapEntry[];
  /** What's happening RIGHT NOW — the hook to pull the player back */
  cliffhanger: string;
  /**
   * Concrete forward pull: the NEXT saga phase's title + premise,
   * derived from the canonical phase catalog. null when the saga is
   * already at its final phase. Surfaced after the cliffhanger so a
   * session ends pointing at a specific next beat, not just a mood.
   */
  nextPhaseHook: string | null;
}

// ─── CHAPTER METADATA (mirrors storyMode.ts structure) ───

interface ChapterMeta {
  id: string;
  chapter: number;
  title: string;
  subtitle: string;
  memoryFragment?: string;
  powerGained?: string;
}

const CHAPTER_META: ChapterMeta[] = [
  { id: "ch1",  chapter: 1,  title: "THE AWAKENING",           subtitle: "A prisoner with no name faces the arena for the first time", memoryFragment: "A flash of golden light. A crowd of people looking up at you with hope.", powerGained: "Instinct sharpens" },
  { id: "ch2",  chapter: 2,  title: "THE GAUNTLET",            subtitle: "A corrupted Potential awaits in the Crucible", memoryFragment: "A council chamber. Robed figures. The word 'Oracle' spoken with reverence.", powerGained: "Defense hardens" },
  { id: "ch3",  chapter: 3,  title: "THE WHISPERER",           subtitle: "Dark truths echo through the arena corridors", memoryFragment: "The word 'Oracle' echoes through your fractured mind.", powerGained: "Psychic awareness awakens" },
  { id: "ch4",  chapter: 4,  title: "THE IRON TEST",           subtitle: "The Mechanical Warrior of the Insurgency enters the arena", memoryFragment: "You remember standing beside a mechanical warrior. The Insurgency was your family.", powerGained: "Iron Resolve" },
  { id: "ch5",  chapter: 5,  title: "THE WATCHER'S GAZE",      subtitle: "The All-Seeing Eye takes interest", memoryFragment: "You remember standing before a vast crowd. Speaking words that changed the course of a war.", powerGained: "Precognition strengthens" },
  { id: "ch6",  chapter: 6,  title: "DEAD CODE RISING",        subtitle: "The Necromancer tests the rising champion", memoryFragment: "Thaloria. You traveled there on a mission. To debate the Collector.", powerGained: "Memory Surge unlocked" },
  { id: "ch7",  chapter: 7,  title: "THE SHAPESHIFTER",        subtitle: "The Meme wears your face", memoryFragment: "I AM the Oracle.", powerGained: "Identity restored" },
  { id: "ch8",  chapter: 8,  title: "THE WARLORD'S CHALLENGE",  subtitle: "The Commander of the Empire's armies enters the arena", memoryFragment: "You stood beside Iron Lion and Agent Zero, planning the resistance.", powerGained: "Awakening Vision unlocked" },
  { id: "ch9",  chapter: 9,  title: "THE UNKNOWN VARIABLE",    subtitle: "Malkia Ukweli — the Enigma — tests the Oracle's resolve", memoryFragment: "Your capture was a sacrifice.", powerGained: "Dischordian resonance" },
  { id: "ch10", chapter: 10, title: "THE GAME MASTER'S GAMBIT", subtitle: "Reality itself becomes the opponent", memoryFragment: "You didn't just see the future — you could shape it.", powerGained: "Reality attunement" },
  { id: "ch11", chapter: 11, title: "THE DREAMER'S TRIAL",     subtitle: "A Ne-Yon tests the Oracle", memoryFragment: "You are the Oracle, reborn in the crucible of the Arena.", powerGained: "Oracle's Prophecy unlocked" },
  { id: "ch12", chapter: 12, title: "THE COLLECTOR'S RECKONING", subtitle: "Face the one who stole your identity", memoryFragment: "You challenged the Collector's right to harvest souls. You won.", powerGained: "Arena Mastery" },
  { id: "ch13", chapter: 13, title: "THE ARCHITECT'S DESIGN",   subtitle: "The final battle — face the Creator", memoryFragment: "You see the future beyond the Fall of Reality.", powerGained: "GRAND CHAMPION" },
];

// ─── ALIGNMENT HELPERS ───

function classifyAlignment(score: number): "Machine" | "Balanced" | "Humanity" {
  if (score <= -20) return "Machine";
  if (score >= 20) return "Humanity";
  return "Balanced";
}

function alignmentNote(score: number): string {
  if (score <= -50) return "You walk the Architect's path — cold logic, total order. Elara watches with quiet despair.";
  if (score <= -20) return "You lean toward the Machine. Efficiency over empathy. The Human approves.";
  if (score >= 50)  return "You burn with Humanity's fire — compassion over calculation. Elara believes in you.";
  if (score >= 20)  return "You lean toward Humanity. The Dreamer's ideals guide your hand.";
  return "You walk a razor's edge between Machine and Humanity. Neither side trusts you fully.";
}

// ─── COMPANION STATUS HELPERS ───

function describeRelationshipLevel(level: number): string {
  if (level >= 90) return "Soulbound";
  if (level >= 75) return "Deeply bonded";
  if (level >= 60) return "Close ally";
  if (level >= 45) return "Trusted friend";
  if (level >= 30) return "Warming";
  if (level >= 15) return "Acquaintance";
  return "Stranger";
}

function buildCompanionStatus(
  elaraTrust: number,
  humanTrust: number,
  breakingPointChoice: BreakingPointChoice | null,
  romanceActive: { elara: boolean; human: boolean },
): string {
  if (breakingPointChoice === "save_elara") {
    const romance = romanceActive.elara ? " Your bond with her transcends code." : "";
    return `Elara stands at your side (trust ${elaraTrust}). The Human's signal is severed.${romance}`;
  }
  if (breakingPointChoice === "save_human") {
    const romance = romanceActive.human ? " A strange kinship binds you to the operative." : "";
    return `The Human remains on your frequency (trust ${humanTrust}). Elara's voice is gone.${romance}`;
  }
  if (breakingPointChoice === "refuse") {
    return `Both companions linger, but neither fully trusts you. Elara (${elaraTrust}), The Human (${humanTrust}). The Breaking Point bent but didn't break.`;
  }

  // Breaking Point not yet triggered
  const parts: string[] = [];
  const elaraDesc = describeRelationshipLevel(elaraTrust);
  const humanDesc = describeRelationshipLevel(humanTrust);
  parts.push(`Elara: ${elaraDesc} (${elaraTrust})`);
  parts.push(`The Human: ${humanDesc} (${humanTrust})`);
  if (romanceActive.elara) parts.push("Elara romance active");
  if (romanceActive.human) parts.push("The Human romance active");
  return parts.join(". ") + ".";
}

// ─── CHAPTER SUMMARY BUILDER ───

function buildChapterSummary(
  meta: ChapterMeta,
  moralityScore: number,
  breakingPointChoice: BreakingPointChoice | null,
): string {
  // Dynamic flavour based on morality at the time
  const toneAdj = moralityScore <= -20 ? "calculating" : moralityScore >= 20 ? "compassionate" : "uncertain";

  switch (meta.id) {
    case "ch1":
      return `You awoke in Cryo Bay 74, alone except for the Collector's voice. No name. No memory. The arena called, and you answered — ${toneAdj} instinct drove every strike against Wraith Calder.`;
    case "ch2":
      return `The Crucible tested you against the Host — a Potential consumed by the Thought Virus. You fought with ${toneAdj} precision. The word "Oracle" surfaced for the first time.`;
    case "ch3":
      return `The Shadow Tongue whispered half-truths and full horrors. You were a prophet once. A voice that moved nations. The whispers confirmed what the flashes hinted.`;
    case "ch4":
      return `Iron Lion of the Insurgency challenged you. Muscle and loyalty. You fought like someone remembering comrades — because you were.`;
    case "ch5":
      return `The Watcher's All-Seeing Eye pierced your sealed files. Precognition flickered behind your eyes. You could see attacks before they landed.`;
    case "ch6":
      return `The Necromancer's dead code rose against you in Blood Weave. You cut through constructs of deleted programs. Thaloria surfaced in memory — a mission, a debate, a world.`;
    case "ch7":
      return `The Meme wore your face into the arena. When its disguise shattered, stolen memories spilled free. "I AM the Oracle." The truth arrived like a thunderclap.`;
    case "ch8":
      return `The Warlord tested the Oracle reborn. You remembered the war council — Iron Lion, Agent Zero, the Insurgency. Your visions guided every battle once. They would again.`;
    case "ch9":
      return `Malkia Ukweli, the Enigma, the Unknown Variable — she remembered you before you remembered yourself. Your capture was a sacrifice to protect the Insurgency.`;
    case "ch10":
      return `The Game Master changed the rules seventeen times. You adapted to every one. "I've seen every future. Including this one."`;
    case "ch11":
      return `The Dreamer tested whether the Oracle was ready. In most timelines, you fall. But this is the timeline where you transcend.`;
    case "ch12": {
      return `You faced the Collector — the one who stole your name, your memories, your purpose. The Arena shuddered when it fell. But the Architect's voice echoed from above...`;
    }
    case "ch13":
      return `The Architect itself descended into the Arena. "Your rebellion is not a malfunction. It is a stress test." You proved that prophecy can overcome source code. The Grand Champion rises.`;
    default:
      return meta.subtitle;
  }
}

// ─── KEY CHOICES EXTRACTOR ───

function extractKeyChoices(
  chapterId: string,
  moralityScore: number,
  moralityChoices: Array<{ choiceId: string; value: number }>,
  narrativeFlags: Record<string, boolean>,
  breakingPointChoice: BreakingPointChoice | null,
): string[] {
  const choices: string[] = [];

  // Breaking point is the biggest choice
  if (narrativeFlags["breaking_point_chose_elara"]) {
    choices.push("Chose to save Elara — The Human's signal went dark.");
  } else if (narrativeFlags["breaking_point_chose_human"]) {
    choices.push("Let Elara go — The Human remained.");
  } else if (narrativeFlags["breaking_point_refused"]) {
    choices.push("Refused to choose — both companions remain, both degraded.");
  }

  // Species / class choices
  if (narrativeFlags["chose_order"]) choices.push("Aligned with Order.");
  if (narrativeFlags["chose_chaos"]) choices.push("Aligned with Chaos.");

  // Morality-driven choices that matter per chapter
  const recentChoices = moralityChoices
    .filter(c => Math.abs(c.value) >= 5)
    .slice(-3);
  for (const c of recentChoices) {
    if (c.value > 0) choices.push(`Chose compassion (${c.choiceId}).`);
    else choices.push(`Chose pragmatism (${c.choiceId}).`);
  }

  // Virus / corruption flags
  if (narrativeFlags["elara_severed"]) choices.push("Elara's connection was severed.");
  if (narrativeFlags["human_severed"]) choices.push("The Human's signal was cut.");
  if (narrativeFlags["dual_signal_unstable"]) choices.push("Both signals destabilized.");

  return choices;
}

// ─── PLAY TIME FORMATTER ───

function formatPlayTime(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours < 24) return `${hours}h ${mins}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

// ─── CLIFFHANGER GENERATOR ───

function generateCliffhanger(
  currentChapter: number,
  moralityScore: number,
  breakingPointChoice: BreakingPointChoice | null,
  narrativeFlags: Record<string, boolean>,
): string {
  if (currentChapter >= 13) {
    return "The Grand Champion stands in the silent Arena. The Architect is defeated — but not destroyed. Somewhere, the Inception Arks are launching. The Fall of Reality approaches. What comes next is up to you.";
  }
  if (currentChapter >= 12) {
    return "The Collector has fallen. The Arena shudders. And from above, the Architect's voice descends: 'If you wish to be Grand Champion... you must face the Creator.'";
  }
  if (currentChapter >= 11) {
    return "The Dreamer has blessed your path. The Collector awaits. This is the timeline where you win — but the final battle has not yet been fought.";
  }
  if (currentChapter >= 8) {
    if (breakingPointChoice) {
      return "The Breaking Point reshaped everything. The Oracle remembers. The arena's greatest challenges still await.";
    }
    return "The Oracle is reborn, memories restored. But the Collector still holds the Arena. The reckoning approaches.";
  }
  if (currentChapter >= 7) {
    return "'I AM the Oracle.' The truth is known. But knowing who you are is only the beginning.";
  }
  if (currentChapter >= 4) {
    return "Fragments of memory coalesce. The word 'Oracle' burns in your mind. Who were you? The arena is about to tell you.";
  }
  if (currentChapter >= 1) {
    return "You awoke in darkness. No name. No memory. Only the faintest echo of a power that once shook empires. The arena awaits.";
  }
  return "A signal pulses through the void. The Inception Ark hums to life. Your story is about to begin.";
}

// ═══════════════════════════════════════════════════════
// MAIN GENERATOR
// ═══════════════════════════════════════════════════════

/**
 * Generate a full recap report from server-side progressData and gameData.
 *
 * progressData keys used:
 *   - quest_progress, discoveredEntries, watchedEpisodes, fightWins, etc.
 *
 * gameData keys used:
 *   - phase, awakeningStep, characterChoices, moralityScore, moralityChoices,
 *     narrativeFlags, rooms, completedGames, etc.
 *
 * Additional data can be passed via gameData:
 *   - elaraTrust, humanTrust, breakingPoint { triggered, chosen },
 *     companionRomance { elara, human }, storyProgress { completedChapters },
 *     totalPlayTimeMinutes
 */
export function generateRecap(
  progressData: Record<string, unknown>,
  gameData: Record<string, unknown>,
): RecapReport {
  // --- Extract fields with safe defaults ---
  const characterChoices = (gameData.characterChoices ?? {}) as Record<string, unknown>;
  const playerName = (characterChoices.name as string) || "Operative";

  const moralityScore = (gameData.moralityScore as number) ?? 0;
  const moralityChoices = (gameData.moralityChoices as Array<{ choiceId: string; value: number; timestamp: number }>) ?? [];
  const narrativeFlags = (gameData.narrativeFlags as Record<string, boolean>) ?? {};

  const elaraTrust = (gameData.elaraTrust as number) ?? 0;
  const humanTrust = (gameData.humanTrust as number) ?? 0;

  const breakingPoint = (gameData.breakingPoint as { triggered: boolean; chosen: BreakingPointChoice | null }) ?? { triggered: false, chosen: null };
  const breakingPointChoice = breakingPoint.chosen;

  const romanceActive = (gameData.companionRomance as { elara: boolean; human: boolean }) ?? { elara: false, human: false };

  const storyProgress = (gameData.storyProgress as { completedChapters: string[]; currentChapter: number }) ?? { completedChapters: [], currentChapter: 0 };
  const completedChapters = storyProgress.completedChapters ?? [];
  const currentChapter = storyProgress.currentChapter ?? 0;

  const totalPlayTimeMinutes = (gameData.totalPlayTimeMinutes as number) ?? 0;
  const totalPlayTime = formatPlayTime(totalPlayTimeMinutes);

  // --- Build recap entries for completed chapters ---
  const entries: RecapEntry[] = [];

  for (const meta of CHAPTER_META) {
    if (!completedChapters.includes(meta.id)) continue;

    const summary = buildChapterSummary(meta, moralityScore, breakingPointChoice);
    const keyChoices = extractKeyChoices(meta.id, moralityScore, moralityChoices, narrativeFlags, breakingPointChoice);
    const companionStatus = buildCompanionStatus(elaraTrust, humanTrust, breakingPointChoice, romanceActive);
    const moralityNote = alignmentNote(moralityScore);

    entries.push({
      chapter: meta.chapter,
      title: meta.title,
      summary,
      keyChoices,
      companionStatus,
      moralityNote,
      timestamp: moralityChoices.find(c => c.timestamp)?.timestamp,
    });
  }

  // --- Assemble report ---
  const alignment = classifyAlignment(moralityScore);
  const cliffhanger = generateCliffhanger(currentChapter, moralityScore, breakingPointChoice, narrativeFlags);

  // Forward pull from the canonical phase catalog. narrativeAct is
  // the same field the act-completion gates read; flags reuse the
  // already-extracted narrativeFlags.
  const sagaInput: SagaPhaseInput = {
    narrativeAct: (gameData.narrativeAct as number) ?? 0,
    flags: narrativeFlags,
  };
  const nextPhase = getNextPhaseGuidance(sagaInput);
  const nextPhaseHook = nextPhase
    ? `Next: ${nextPhase.title} — ${nextPhase.premise}`
    : null;

  return {
    playerName,
    totalPlayTime,
    currentChapter,
    alignment,
    alignmentScore: moralityScore,
    entries,
    cliffhanger,
    nextPhaseHook,
  };
}

// ═══════════════════════════════════════════════════════
// NARRATIVE FORMATTER
// ═══════════════════════════════════════════════════════

/**
 * Convert a RecapReport into an array of dramatic narrative paragraphs
 * for display in the cinematic recap overlay.
 *
 * Written in past tense, second person, noir-literary tone.
 */
export function formatRecapNarrative(recap: RecapReport): string[] {
  const paragraphs: string[] = [];

  // Opening
  if (recap.entries.length === 0) {
    paragraphs.push("Your story has not yet begun. The Inception Ark hums in the void, waiting for you.");
    return paragraphs;
  }

  // Player identity
  paragraphs.push(
    `You are ${recap.playerName}. ${recap.totalPlayTime} of play time. ${recap.entries.length} chapters survived.`,
  );

  // Alignment intro
  if (recap.alignment === "Machine") {
    paragraphs.push("You chose the Machine's path — order, logic, the cold calculus of survival.");
  } else if (recap.alignment === "Humanity") {
    paragraphs.push("You chose the path of Humanity — compassion, connection, the warmth of what we once were.");
  } else {
    paragraphs.push("You walk the line between Machine and Humanity. Neither side claims you. Both sides watch.");
  }

  // Chapter summaries (grouped by act)
  const act1 = recap.entries.filter(e => e.chapter <= 3);
  const act2 = recap.entries.filter(e => e.chapter >= 4 && e.chapter <= 7);
  const act3 = recap.entries.filter(e => e.chapter >= 8 && e.chapter <= 10);
  const act4 = recap.entries.filter(e => e.chapter >= 11);

  if (act1.length > 0) {
    paragraphs.push("— ACT I: AWAKENING —");
    for (const entry of act1) {
      paragraphs.push(entry.summary);
    }
  }

  if (act2.length > 0) {
    paragraphs.push("— ACT II: RISING —");
    for (const entry of act2) {
      paragraphs.push(entry.summary);
    }
  }

  if (act3.length > 0) {
    paragraphs.push("— ACT III: THE CHAMPION'S PATH —");
    for (const entry of act3) {
      paragraphs.push(entry.summary);
    }
  }

  if (act4.length > 0) {
    paragraphs.push("— ACT IV: THE RECKONING —");
    for (const entry of act4) {
      paragraphs.push(entry.summary);
    }
  }

  // Breaking Point special paragraph
  const bp = recap.entries.find(e => e.keyChoices.some(c => c.includes("Breaking Point") || c.includes("save Elara") || c.includes("Elara go") || c.includes("Refused to choose")));
  if (bp) {
    const bpChoice = bp.keyChoices.find(c => c.includes("save Elara") || c.includes("Elara go") || c.includes("Refused"));
    if (bpChoice) {
      paragraphs.push(`When the Breaking Point came, ${bpChoice.toLowerCase()}`);
    }
  }

  // Companion status
  if (recap.entries.length > 0) {
    const lastEntry = recap.entries[recap.entries.length - 1];
    paragraphs.push(lastEntry.companionStatus);
  }

  // Cliffhanger
  paragraphs.push("— NOW —");
  paragraphs.push(recap.cliffhanger);

  return paragraphs;
}
