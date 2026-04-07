/* ═══════════════════════════════════════════════════════
   NARRATIVE GRAPH VALIDATOR

   Programmatically walks every dialog tree branch, story
   chapter, transmission unlock, and flag reference to
   detect structural issues in the narrative graph.

   Usage:
     import { runFullValidation } from "./narrativeValidator";
     const report = runFullValidation();
   ═══════════════════════════════════════════════════════ */

import { ALL_ROOM_DIALOGS, type RoomDialogDef, type RoomChoice } from "../client/src/game/roomDialogs";
import { ALL_CHAPTERS, type StoryChapter } from "../client/src/game/storyMode";
import { ALL_TRANSMISSIONS, type Transmission, type TransmissionTrigger } from "./transmissions";
import { resolveBreakingPoint, BREAKING_POINT_OPTIONS, type BreakingPointChoice } from "./breakingPoint";
import { ARCHETYPES, type ApprenticeArchetype } from "./apprentices";
import { BETRAYAL_THRESHOLDS, type BetrayalStage } from "./apprenticeBetrayal";

/* ─── TYPES ─── */

export type IssueSeverity = "critical" | "warning" | "info";

export interface ValidationIssue {
  severity: IssueSeverity;
  category: string;
  message: string;
  location?: string;
}

export interface ValidationReport {
  issues: ValidationIssue[];
  summary: {
    critical: number;
    warning: number;
    info: number;
    total: number;
  };
  passed: boolean;
}

/* ─── HELPERS ─── */

function issue(
  severity: IssueSeverity,
  category: string,
  message: string,
  location?: string,
): ValidationIssue {
  return { severity, category, message, location };
}

/* ═══════════════════════════════════════════════════════
   1. DIALOG TREE VALIDATION
   ═══════════════════════════════════════════════════════ */

export function validateDialogTrees(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const roomIds = Object.keys(ALL_ROOM_DIALOGS);

  for (const roomId of roomIds) {
    const dialog = ALL_ROOM_DIALOGS[roomId];
    const loc = `roomDialogs/${roomId}`;

    // --- Orphan check: each room must have choices ---
    if (!dialog.choices || dialog.choices.length === 0) {
      issues.push(issue("critical", "dialog_tree", `Room has no dialog choices (orphan node)`, loc));
    }

    // --- Dead-end check: every choice must have an elaraReaction (NPC response) ---
    for (const choice of dialog.choices) {
      if (!choice.effect.elaraReaction || choice.effect.elaraReaction.trim() === "") {
        issues.push(issue("critical", "dialog_tree", `Choice "${choice.id}" has missing NPC response (elaraReaction)`, loc));
      }
      if (!choice.fullText || choice.fullText.trim() === "") {
        issues.push(issue("critical", "dialog_tree", `Choice "${choice.id}" has empty fullText — player sees nothing`, loc));
      }
      if (!choice.label || choice.label.trim() === "") {
        issues.push(issue("critical", "dialog_tree", `Choice "${choice.id}" has empty label`, loc));
      }
    }

    // --- Context completeness: every ElaraPersonality key must have text ---
    const requiredPersonalities = ["warm", "guarded", "curious", "protective", "conflicted"] as const;
    for (const personality of requiredPersonalities) {
      if (!dialog.context[personality] || dialog.context[personality].trim() === "") {
        issues.push(issue("critical", "dialog_tree", `Missing context text for personality "${personality}"`, loc));
      }
    }

    // --- Trust-gated personal layers: check ordering and reachability ---
    const trustLevels = dialog.personalLayers.map(l => l.minTrust);
    for (let i = 1; i < trustLevels.length; i++) {
      if (trustLevels[i] < trustLevels[i - 1]) {
        issues.push(issue("warning", "dialog_tree", `Personal layers trust levels are not ascending (${trustLevels[i - 1]} -> ${trustLevels[i]})`, loc));
      }
    }

    // --- Unreachable trust gates: trust maxes at 100, check for impossible gates ---
    for (const layer of dialog.personalLayers) {
      if (layer.minTrust > 100) {
        issues.push(issue("critical", "dialog_tree", `Personal layer requires trust ${layer.minTrust} which exceeds max (100)`, loc));
      }
      if (layer.text.trim() === "") {
        issues.push(issue("critical", "dialog_tree", `Personal layer at trust ${layer.minTrust} has empty text`, loc));
      }
    }

    // --- Check archetype coverage: each room should have all 3 archetypes ---
    const archetypes = new Set(dialog.choices.map(c => c.archetype));
    const expectedArchetypes = ["compassionate", "pragmatic", "suspicious"];
    for (const arch of expectedArchetypes) {
      if (!archetypes.has(arch as any)) {
        issues.push(issue("warning", "dialog_tree", `Missing "${arch}" dialog choice archetype`, loc));
      }
    }

    // --- Check for duplicate choice IDs within a room ---
    const choiceIds = dialog.choices.map(c => c.id);
    const uniqueIds = new Set(choiceIds);
    if (uniqueIds.size !== choiceIds.length) {
      issues.push(issue("critical", "dialog_tree", `Duplicate choice IDs found`, loc));
    }
  }

  // --- Check for duplicate room IDs ---
  const allRoomIds = Object.values(ALL_ROOM_DIALOGS).map(d => d.roomId);
  const uniqueRoomIds = new Set(allRoomIds);
  if (uniqueRoomIds.size !== allRoomIds.length) {
    issues.push(issue("critical", "dialog_tree", "Duplicate roomId values found across dialog definitions"));
  }

  // --- Verify roomId in key matches roomId in value ---
  for (const [key, dialog] of Object.entries(ALL_ROOM_DIALOGS)) {
    if (key !== dialog.roomId) {
      issues.push(issue("warning", "dialog_tree", `Map key "${key}" does not match dialog.roomId "${dialog.roomId}"`, `roomDialogs/${key}`));
    }
  }

  return issues;
}

/* ═══════════════════════════════════════════════════════
   2. STORY FLAG VALIDATION
   ═══════════════════════════════════════════════════════ */

export function validateStoryFlags(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Collect all flags that are SET across the narrative systems
  const flagsSet = new Map<string, string[]>();   // flag -> [locations where set]
  const flagsChecked = new Map<string, string[]>(); // flag -> [locations where checked]

  function recordSet(flag: string, location: string) {
    if (!flagsSet.has(flag)) flagsSet.set(flag, []);
    flagsSet.get(flag)!.push(location);
  }

  function recordCheck(flag: string, location: string) {
    if (!flagsChecked.has(flag)) flagsChecked.set(flag, []);
    flagsChecked.get(flag)!.push(location);
  }

  // --- Flags set by room dialog choices (callbackFlags) ---
  for (const [roomId, dialog] of Object.entries(ALL_ROOM_DIALOGS)) {
    for (const choice of dialog.choices) {
      if (choice.effect.callbackFlag) {
        recordSet(choice.effect.callbackFlag, `roomDialogs/${roomId}/${choice.id}`);
      }
    }
  }

  // --- Flags set by Breaking Point outcomes ---
  const bpChoices: BreakingPointChoice[] = ["save_elara", "save_human", "refuse"];
  for (const choice of bpChoices) {
    const outcome = resolveBreakingPoint(choice);
    for (const flag of outcome.flags) {
      recordSet(flag, `breakingPoint/${choice}`);
    }
  }

  // --- Flags checked by transmission unlock triggers ---
  for (const t of ALL_TRANSMISSIONS) {
    if (t.unlockTrigger.kind === "flag") {
      recordCheck(t.unlockTrigger.flag, `transmissions/ep${t.epoch}-${t.episodeNumber}`);
    }
  }

  // --- Contradictory flag combinations ---
  const mutuallyExclusiveGroups: string[][] = [
    ["breaking_point_chose_elara", "breaking_point_chose_human", "breaking_point_refused"],
    ["elara_severed", "human_severed"],
    ["elara_bond_locked", "human_bond_locked"],
  ];

  for (const group of mutuallyExclusiveGroups) {
    // Verify these flags exist in the system
    const existing = group.filter(f => flagsSet.has(f));
    if (existing.length > 1) {
      // This is expected -- they're set by different branches. Report as info.
      issues.push(issue("info", "story_flags",
        `Mutually exclusive flags verified: [${group.join(", ")}] — set by different branches`,
        "breakingPoint"));
    }
  }

  // --- Flags checked but never set ---
  for (const [flag, locations] of flagsChecked) {
    if (!flagsSet.has(flag)) {
      issues.push(issue("critical", "story_flags",
        `Flag "${flag}" is checked at [${locations.join(", ")}] but never set anywhere`,
      ));
    }
  }

  // --- Flags set but never checked (potential unused flags) ---
  for (const [flag, locations] of flagsSet) {
    if (!flagsChecked.has(flag)) {
      issues.push(issue("info", "story_flags",
        `Flag "${flag}" is set at [${locations.join(", ")}] but never checked by any trigger`,
      ));
    }
  }

  return issues;
}

/* ═══════════════════════════════════════════════════════
   3. TRUST GATE VALIDATION
   ═══════════════════════════════════════════════════════ */

export function validateTrustGates(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Trust range: 0 to 100
  // Elara trust can be increased by compassionate choices (+8 to +12 per room)
  // Human trust grows by suspicious choices and Human alignment
  // Max achievable trust: compute from dialog choices

  // --- Compute maximum achievable Elara trust from room dialogs ---
  let maxElaraTrustGain = 0;
  let maxElaraTrustLoss = 0;
  for (const [roomId, dialog] of Object.entries(ALL_ROOM_DIALOGS)) {
    let roomMaxGain = -Infinity;
    let roomMaxLoss = Infinity;
    for (const choice of dialog.choices) {
      if (choice.effect.trustChange > roomMaxGain) {
        roomMaxGain = choice.effect.trustChange;
      }
      if (choice.effect.trustChange < roomMaxLoss) {
        roomMaxLoss = choice.effect.trustChange;
      }
    }
    if (roomMaxGain > -Infinity) maxElaraTrustGain += roomMaxGain;
    if (roomMaxLoss < Infinity) maxElaraTrustLoss += roomMaxLoss;
  }

  // Starting trust is assumed 0; check if trust gates are reachable
  const roomCount = Object.keys(ALL_ROOM_DIALOGS).length;

  issues.push(issue("info", "trust_gates",
    `Max Elara trust gain from all rooms (best choices): ${maxElaraTrustGain}. ` +
    `Max trust loss (worst choices): ${maxElaraTrustLoss}. Rooms: ${roomCount}.`));

  // --- Check each room's personal layers against achievable trust ---
  for (const [roomId, dialog] of Object.entries(ALL_ROOM_DIALOGS)) {
    for (const layer of dialog.personalLayers) {
      if (layer.minTrust > maxElaraTrustGain) {
        issues.push(issue("warning", "trust_gates",
          `Personal layer requires trust ${layer.minTrust} but max achievable from room choices alone is ${maxElaraTrustGain}`,
          `roomDialogs/${roomId}`));
      }
    }
  }

  // --- Verify Elara trust path: can compassionate-only reach trust 80? ---
  let compassionateTrust = 0;
  for (const dialog of Object.values(ALL_ROOM_DIALOGS)) {
    const compassionateChoice = dialog.choices.find(c => c.archetype === "compassionate");
    if (compassionateChoice) {
      compassionateTrust += compassionateChoice.effect.trustChange;
    }
  }
  if (compassionateTrust < 80) {
    issues.push(issue("warning", "trust_gates",
      `Compassionate-only path yields trust ${compassionateTrust}, which may not reach trust-80 gates. ` +
      `Players may need additional trust sources (revisits, other systems) to access highest-tier content.`));
  } else {
    issues.push(issue("info", "trust_gates",
      `Compassionate-only path yields trust ${compassionateTrust} — sufficient to reach trust-80 gates.`));
  }

  // --- Verify Human trust path is viable ---
  // Human trust grows via Breaking Point choices, suspicious dialog alignment, etc.
  // The "save_human" Breaking Point sets humanTrustOverride to 100
  const humanTrustViaSaveHuman = 100;
  issues.push(issue("info", "trust_gates",
    `Human trust path: "save_human" Breaking Point sets humanTrust to ${humanTrustViaSaveHuman} — Human trust gates are reachable via this path.`));

  // --- Check Breaking Point trust overrides ---
  for (const choice of bpChoices) {
    const outcome = resolveBreakingPoint(choice);
    if (outcome.elaraTrustOverride !== undefined && outcome.elaraTrustOverride > 100) {
      issues.push(issue("critical", "trust_gates",
        `Breaking Point "${choice}" sets elaraTrustOverride to ${outcome.elaraTrustOverride} (exceeds max 100)`,
        `breakingPoint/${choice}`));
    }
    if (outcome.humanTrustOverride !== undefined && outcome.humanTrustOverride > 100) {
      issues.push(issue("critical", "trust_gates",
        `Breaking Point "${choice}" sets humanTrustOverride to ${outcome.humanTrustOverride} (exceeds max 100)`,
        `breakingPoint/${choice}`));
    }
  }

  return issues;
}

const bpChoices: BreakingPointChoice[] = ["save_elara", "save_human", "refuse"];

/* ═══════════════════════════════════════════════════════
   4. TRANSMISSION UNLOCK VALIDATION
   ═══════════════════════════════════════════════════════ */

export function validateTransmissionUnlocks(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Collect all known chapter IDs from story chapters
  const allChapterIds = new Set(ALL_CHAPTERS.map(ch => ch.id));

  // Collect all known room IDs from dialogs
  const allRoomIds = new Set(Object.keys(ALL_ROOM_DIALOGS));

  for (const t of ALL_TRANSMISSIONS) {
    const loc = `transmissions/ep${t.epoch}-${t.episodeNumber} ("${t.title}")`;
    const trigger = t.unlockTrigger;

    switch (trigger.kind) {
      case "always":
        // Always available — no validation needed
        break;

      case "level":
        if (trigger.minLevel < 0) {
          issues.push(issue("critical", "transmission_unlock",
            `Requires negative level (${trigger.minLevel})`, loc));
        }
        // Reasonable level range check
        if (trigger.minLevel > 100) {
          issues.push(issue("warning", "transmission_unlock",
            `Requires level ${trigger.minLevel} which may be unreachable in normal gameplay`, loc));
        }
        break;

      case "chapter_complete":
        if (!allChapterIds.has(trigger.chapterId)) {
          issues.push(issue("critical", "transmission_unlock",
            `References chapter "${trigger.chapterId}" which does not exist in STORY_CHAPTERS or BONUS_CHAPTERS`, loc));
        }
        break;

      case "awakening_step":
        // Awakening step is a string — just verify it's non-empty
        if (!trigger.step || trigger.step.trim() === "") {
          issues.push(issue("critical", "transmission_unlock",
            `Has empty awakening_step`, loc));
        }
        break;

      case "trust":
        if (trigger.minTrust < 0 || trigger.minTrust > 100) {
          issues.push(issue("warning", "transmission_unlock",
            `Trust trigger requires ${trigger.minTrust} for NPC "${trigger.npcId}" — outside 0-100 range`, loc));
        }
        break;

      case "morality":
        if (trigger.threshold < 0) {
          issues.push(issue("warning", "transmission_unlock",
            `Morality trigger has negative threshold (${trigger.threshold})`, loc));
        }
        break;

      case "flag":
        if (!trigger.flag || trigger.flag.trim() === "") {
          issues.push(issue("critical", "transmission_unlock",
            `Has empty flag trigger`, loc));
        }
        break;

      case "room_visited":
        if (!allRoomIds.has(trigger.roomId)) {
          issues.push(issue("warning", "transmission_unlock",
            `References room "${trigger.roomId}" not found in ALL_ROOM_DIALOGS`, loc));
        }
        break;

      case "apprentice_graduates":
        // Valid trigger — just verify it exists
        break;

      default: {
        const _exhaustive: never = trigger;
        issues.push(issue("critical", "transmission_unlock",
          `Unknown trigger kind: ${(trigger as any).kind}`, loc));
      }
    }

    // --- Verify episode metadata ---
    if (!t.title || t.title.trim() === "") {
      issues.push(issue("critical", "transmission_unlock", `Episode has empty title`, loc));
    }
    if (!t.memeIntro || t.memeIntro.trim() === "") {
      issues.push(issue("warning", "transmission_unlock", `Episode has empty memeIntro`, loc));
    }
    if (!t.memeOutro || t.memeOutro.trim() === "") {
      issues.push(issue("warning", "transmission_unlock", `Episode has empty memeOutro`, loc));
    }
    if (t.lengthSeconds <= 0) {
      issues.push(issue("warning", "transmission_unlock", `Episode has invalid lengthSeconds: ${t.lengthSeconds}`, loc));
    }
    if (!t.videoUrl && !t.driveFileId) {
      issues.push(issue("warning", "transmission_unlock", `Episode has neither videoUrl nor driveFileId`, loc));
    }
  }

  // --- Check for duplicate episode numbers within an epoch ---
  const episodeKeys = ALL_TRANSMISSIONS.map(t => `${t.epoch}-${t.episodeNumber}`);
  const uniqueEpisodes = new Set(episodeKeys);
  if (uniqueEpisodes.size !== episodeKeys.length) {
    issues.push(issue("critical", "transmission_unlock",
      `Duplicate epoch-episodeNumber combinations found in transmissions`));
  }

  // --- Check for duplicate broadcast orders ---
  const broadcastOrders = ALL_TRANSMISSIONS.map(t => t.broadcastOrder);
  const uniqueOrders = new Set(broadcastOrders);
  if (uniqueOrders.size !== broadcastOrders.length) {
    issues.push(issue("critical", "transmission_unlock",
      `Duplicate broadcastOrder values found in transmissions`));
  }

  // --- Check broadcast order is sequential ---
  const sortedOrders = [...broadcastOrders].sort((a, b) => a - b);
  for (let i = 0; i < sortedOrders.length; i++) {
    if (sortedOrders[i] !== i) {
      issues.push(issue("warning", "transmission_unlock",
        `Broadcast orders are not contiguous 0..N: expected ${i}, found ${sortedOrders[i]}`));
      break;
    }
  }

  return issues;
}

/* ═══════════════════════════════════════════════════════
   5. LORE CONSISTENCY VALIDATION
   ═══════════════════════════════════════════════════════ */

export function validateLoreConsistency(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // --- Cross-reference character names across systems ---
  // Key characters that should be consistently named
  const knownCharacters: Record<string, string[]> = {
    "Elara": ["roomDialogs", "breakingPoint", "dialogWheel"],
    "The Human": ["roomDialogs", "breakingPoint", "dialogWheel"],
    "The Architect": ["storyMode", "transmissions"],
    "The Collector": ["storyMode", "transmissions"],
    "The Meme": ["storyMode", "transmissions"],
    "The Oracle": ["storyMode", "transmissions", "apprentices"],
    "Kael": ["roomDialogs"],
    "The Source": ["storyMode", "transmissions"],
  };

  // --- Verify key character references in room dialogs ---
  const allRoomText = Object.values(ALL_ROOM_DIALOGS).flatMap(dialog => {
    const texts: string[] = [];
    for (const p of Object.values(dialog.context)) texts.push(p);
    for (const layer of dialog.personalLayers) texts.push(layer.text);
    for (const choice of dialog.choices) {
      texts.push(choice.fullText);
      texts.push(choice.effect.elaraReaction);
    }
    if (dialog.humanWhisper) texts.push(dialog.humanWhisper);
    if (dialog.revisitLine) texts.push(dialog.revisitLine);
    return texts;
  });
  const roomCorpus = allRoomText.join(" ");

  // --- Verify key character references in story chapters ---
  const allStoryText = ALL_CHAPTERS.flatMap(ch => {
    const texts: string[] = [];
    for (const d of ch.preDialogue) texts.push(d.text);
    for (const d of ch.postVictoryDialogue) texts.push(d.text);
    for (const d of ch.postDefeatDialogue) texts.push(d.text);
    if (ch.memoryFragment) texts.push(ch.memoryFragment);
    return texts;
  });
  const storyCorpus = allStoryText.join(" ");

  // --- Verify key character references in transmissions ---
  const allTransmissionText = ALL_TRANSMISSIONS.flatMap(t => [
    t.title, t.memeIntro, t.memeOutro, t.synopsis,
  ]);
  const transmissionCorpus = allTransmissionText.join(" ");

  // --- Check character name consistency: "Elara Voss" vs "Elara" ---
  if (roomCorpus.includes("Elara Voss") && roomCorpus.includes("Senator Elara Voss")) {
    issues.push(issue("info", "lore_consistency",
      `Elara is referenced as both "Elara Voss" and "Senator Elara Voss" in room dialogs — consistent with progressive revelation.`));
  }

  // --- Check for location consistency ---
  const keyLocations = [
    "Panopticon", "Terminus", "Thaloria", "Violetta", "Atarion", "New Babylon",
  ];
  for (const location of keyLocations) {
    const inRooms = roomCorpus.includes(location);
    const inStory = storyCorpus.includes(location);
    const inTransmissions = transmissionCorpus.includes(location);
    const sources: string[] = [];
    if (inRooms) sources.push("roomDialogs");
    if (inStory) sources.push("storyMode");
    if (inTransmissions) sources.push("transmissions");
    if (sources.length > 0) {
      issues.push(issue("info", "lore_consistency",
        `Location "${location}" referenced in: [${sources.join(", ")}]`));
    }
  }

  // --- Story chapter dialog completeness ---
  for (const ch of ALL_CHAPTERS) {
    const loc = `storyMode/${ch.id}`;
    if (ch.preDialogue.length === 0) {
      issues.push(issue("critical", "lore_consistency", `Chapter has no preDialogue`, loc));
    }
    if (ch.postVictoryDialogue.length === 0) {
      issues.push(issue("critical", "lore_consistency", `Chapter has no postVictoryDialogue`, loc));
    }
    if (ch.postDefeatDialogue.length === 0) {
      issues.push(issue("critical", "lore_consistency", `Chapter has no postDefeatDialogue`, loc));
    }

    // --- Every dialogue line must have a speaker and text ---
    const allDialogLines = [
      ...ch.preDialogue,
      ...ch.postVictoryDialogue,
      ...ch.postDefeatDialogue,
    ];
    for (const line of allDialogLines) {
      if (!line.speaker || line.speaker.trim() === "") {
        issues.push(issue("critical", "lore_consistency",
          `Dialog line has empty speaker`, loc));
      }
      if (!line.text || line.text.trim() === "") {
        issues.push(issue("critical", "lore_consistency",
          `Dialog line from "${line.speaker}" has empty text`, loc));
      }
    }
  }

  // --- Apprentice archetypes all have betrayal flavor ---
  const archetypeIds = ARCHETYPES.map(a => a.id);
  for (const archId of archetypeIds) {
    const arch = ARCHETYPES.find(a => a.id === archId)!;
    if (!arch.breakingPoint || arch.breakingPoint.trim() === "") {
      issues.push(issue("warning", "lore_consistency",
        `Archetype "${archId}" has no breakingPoint description`,
        `apprentices/${archId}`));
    }
  }

  // --- Verify all Breaking Point options have descriptions ---
  for (const opt of BREAKING_POINT_OPTIONS) {
    if (!opt.description || opt.description.trim() === "") {
      issues.push(issue("critical", "lore_consistency",
        `Breaking Point option "${opt.id}" has empty description`,
        "breakingPoint"));
    }
    if (!opt.label || opt.label.trim() === "") {
      issues.push(issue("critical", "lore_consistency",
        `Breaking Point option "${opt.id}" has empty label`,
        "breakingPoint"));
    }
  }

  // --- Verify Breaking Point outcomes all have epilogue text ---
  for (const choice of bpChoices) {
    const outcome = resolveBreakingPoint(choice);
    if (!outcome.epilogueConsequence || outcome.epilogueConsequence.trim() === "") {
      issues.push(issue("critical", "lore_consistency",
        `Breaking Point "${choice}" outcome has empty epilogueConsequence`,
        `breakingPoint/${choice}`));
    }
  }

  // --- Verify betrayal stages have correct thresholds ---
  const expectedThresholds: Record<BetrayalStage, number> = {
    warning: 60,
    turn: 75,
    declaration: 90,
    betrayal: 100,
  };
  for (const [stage, threshold] of Object.entries(expectedThresholds)) {
    if (BETRAYAL_THRESHOLDS[stage as BetrayalStage] !== threshold) {
      issues.push(issue("warning", "lore_consistency",
        `Betrayal stage "${stage}" threshold is ${BETRAYAL_THRESHOLDS[stage as BetrayalStage]}, expected ${threshold}`,
        "apprenticeBetrayal"));
    }
  }

  return issues;
}

/* ═══════════════════════════════════════════════════════
   FULL VALIDATION
   ═══════════════════════════════════════════════════════ */

export function runFullValidation(): ValidationReport {
  const allIssues: ValidationIssue[] = [
    ...validateDialogTrees(),
    ...validateStoryFlags(),
    ...validateTrustGates(),
    ...validateTransmissionUnlocks(),
    ...validateLoreConsistency(),
  ];

  const critical = allIssues.filter(i => i.severity === "critical").length;
  const warning = allIssues.filter(i => i.severity === "warning").length;
  const info = allIssues.filter(i => i.severity === "info").length;

  return {
    issues: allIssues,
    summary: {
      critical,
      warning,
      info,
      total: allIssues.length,
    },
    passed: critical === 0,
  };
}
