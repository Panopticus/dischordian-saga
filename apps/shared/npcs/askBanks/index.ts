// apps/shared/npcs/askBanks/index.ts
//
// Aggregator for per-NPC ask-topic banks (Phase 6 Infrastructure
// Deliverable 1). Mirrors the apps/shared/npcs/banks/ pattern: each
// priority-roster NPC owns a per-character file with their AskTopic[]
// bank; this index concatenates them into ALL_NPC_ASK_TOPICS for the
// selector/router and provides per-NPC lookup.
//
// Elara/Human ask-topics remain in apps/shared/companionAskTopics.ts
// (back-compat). They are not duplicated here; consumers that need
// the full union should call mergeWithCompanionAskTopics() below.

import type { NpcKey } from "../types";
import type { AskTopic } from "../askTopics";
import { NILMORG_ASK_TOPICS } from "./nilmorg";
import { ADJUDICATOR_LOCKE_ASK_TOPICS } from "./adjudicator_locke";
import { THE_SEER_ASK_TOPICS } from "./the_seer";
import { VEX_SOLENE_ASK_TOPICS } from "./vex_solene";
import { THE_ORACLE_ASK_TOPICS } from "./the_oracle";
import { THE_DEGEN_ASK_TOPICS } from "./the_degen";
import { DMC_CLONE_COMPANION_ASK_TOPICS } from "./dmc_clone_companion";
import { THE_GAME_MASTER_ASK_TOPICS } from "./the_game_master";
import { THE_MEME_ASK_TOPICS } from "./the_meme";

// Per-NPC banks are added here as they ship through Phase 6a-6e.
// Phase 6 Infrastructure ships only the aggregator + types + resolver;
// per-NPC content authoring lands in the subsequent sub-phases.

const PER_NPC_BANKS: ReadonlyArray<ReadonlyArray<AskTopic>> = [
  NILMORG_ASK_TOPICS,                 // Phase 6a.1 ✅
  ADJUDICATOR_LOCKE_ASK_TOPICS,       // Phase 6a.2 ✅
  THE_SEER_ASK_TOPICS,                // Phase 6b.1 ✅
  VEX_SOLENE_ASK_TOPICS,              // Phase 6b.2 ✅
  THE_ORACLE_ASK_TOPICS,              // Phase 6b.3 ✅
  THE_DEGEN_ASK_TOPICS,               // Phase 6c.1 ✅
  DMC_CLONE_COMPANION_ASK_TOPICS,     // Phase 6c.2 ✅
  THE_GAME_MASTER_ASK_TOPICS,         // Phase 6d.1 ✅
  THE_MEME_ASK_TOPICS,                // Phase 6d.2 part 1 ✅
  // WRAITH_CALDER_ASK_TOPICS,        // Phase 6d.3
  // YOUR_EIDOLON_ASK_TOPICS,         // Phase 6d.4 (expression-prompts)
];

export const ALL_NPC_ASK_TOPICS: ReadonlyArray<AskTopic> =
  PER_NPC_BANKS.flat();

/**
 * Per-NPC bank lookup. Returns the topics for a single character, or an
 * empty array if no bank is shipped yet (silent-fail contract — the ask
 * wheel renders no extra topics rather than crashing).
 */
export function getAskTopicsFor(
  npcKey: NpcKey,
): ReadonlyArray<AskTopic> {
  return ALL_NPC_ASK_TOPICS.filter((t) => t.npcKey === npcKey);
}
