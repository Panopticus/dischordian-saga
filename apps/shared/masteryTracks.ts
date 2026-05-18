/* ═══════════════════════════════════════════════════════
   MASTERY TRACKS — the "play → grow → invest" spine

   The progression parts already shipped (classMastery,
   masteryTree, bossMastery, the per-mode reward engine in
   tcg-core/rewards/gameModeRewards.ts). What was missing was
   the connective contract: a guarantee that EVERY system the
   narrative spine reveals also has a growth track — so the
   "play → gain power → invest → play stronger" loop covers
   the whole game, not a scattered subset.

   This is the same pattern as the narrative spine and the
   daily loop: parts shipped; the model that binds them did
   not. The registry is spine-driven — declared = the spine's
   systems — so a new spine system with no growth track is a
   hard-parity failure.

   The parity gate
   (apps/shared/_completeness/checks/masteryTrackCoverage.ts)
   is HARD PARITY: every NARRATIVE_SPINE premise MUST have
   exactly one mastery track whose anchor module exists.

   Pure module. No React.
   ═══════════════════════════════════════════════════════ */

import { NARRATIVE_SPINE } from "./narrativeSpine";
import { getGameModePremise } from "./gameModeNarrativePremises";

export interface MasteryTrack {
  /** The GAME_MODE_PREMISES / spine system this track grows. */
  premiseId: string;
  /** Player-facing track name. */
  track: string;
  /** One-line "play → grow → invest → play stronger" framing. */
  loop: string;
  /** Shipped progression/reward module backing the track (on disk). */
  anchorModule: string;
}

const GAME_MODE_REWARDS = "apps/shared/tcg-core/rewards/gameModeRewards.ts";
const CARD_REWARDS = "apps/shared/tcg-core/rewards/cardRewardRegistry.ts";
const CLASS_MASTERY = "apps/shared/classMastery.ts";
const BOSS_MASTERY = "apps/shared/bossMastery.ts";

/**
 * One track per spine system. Anchor is the shipped module whose
 * progression most directly governs that system's grow loop:
 *  - the TCG trunk grows the card pool   → cardRewardRegistry
 *  - the apprentice loop grows class rank → classMastery
 *  - the arena/encounter trunk            → bossMastery
 *  - everything else earns through the per-mode reward engine
 */
export const MASTERY_TRACKS: readonly MasteryTrack[] = [
  { premiseId: "tcg_dischordia", track: "Imprint Collection", loop: "Win duels → earn imprint cards → stronger decks → harder duels.", anchorModule: CARD_REWARDS },
  { premiseId: "chess", track: "Architect's Ladder", loop: "Climb the ladder → unlock tiers → tougher opponents → rank up.", anchorModule: GAME_MODE_REWARDS },
  { premiseId: "loredex", track: "Chronicle Mastery", loop: "Read & uncover → Loredex completion → lore-gated rewards.", anchorModule: GAME_MODE_REWARDS },
  { premiseId: "mystery_engine", track: "Deduction Record", loop: "Solve arcs → filed readings → witness-reward unlocks.", anchorModule: GAME_MODE_REWARDS },
  { premiseId: "hellbox", track: "Descent Depth", loop: "Descend deeper → Blood-Weave yield → deeper descents.", anchorModule: GAME_MODE_REWARDS },
  { premiseId: "demon_summoning", track: "Contract Standing", loop: "Honor contracts → stronger summons → richer contracts.", anchorModule: GAME_MODE_REWARDS },
  { premiseId: "apprentice_mentor_loop", track: "Mentor Rank", loop: "Mentor trials → class mastery rank → better apprentices.", anchorModule: CLASS_MASTERY },
  { premiseId: "conspiracy_boards", track: "Un-redaction", loop: "Solve boards → Soul Stones → harder boards.", anchorModule: GAME_MODE_REWARDS },
  { premiseId: "trade_empire", track: "Recon Reputation", loop: "Run routes → reputation tiers → higher-value routes.", anchorModule: GAME_MODE_REWARDS },
  { premiseId: "casino", track: "House Read", loop: "Gamble → bankroll growth → higher tables.", anchorModule: GAME_MODE_REWARDS },
  { premiseId: "dead_mans_circuit", track: "Season Standing", loop: "Race the season → kart upgrades → faster tracks.", anchorModule: GAME_MODE_REWARDS },
  { premiseId: "cades_fps", track: "Campaign Record", loop: "Run missions → loadout growth → the final stand.", anchorModule: BOSS_MASTERY },
  { premiseId: "tower_defense", track: "Line Mastery", loop: "Hold waves → tower upgrades → harder swarms.", anchorModule: GAME_MODE_REWARDS },
  { premiseId: "governance_hub", track: "Civic Standing", loop: "Vote & shape → influence growth → bigger decisions.", anchorModule: GAME_MODE_REWARDS },
] as const;

export function getMasteryTrack(premiseId: string): MasteryTrack | undefined {
  return MASTERY_TRACKS.find((t) => t.premiseId === premiseId);
}

/** Spine-driven coverage: declared = spine systems, bound = with a track. */
export function getMasteryTrackCoverage(): {
  declared: number;
  bound: number;
} {
  const premises = new Set(
    NARRATIVE_SPINE.map((b) => b.revealsPremiseId).filter(
      (p) => getGameModePremise(p) !== undefined,
    ),
  );
  const tracked = new Set(MASTERY_TRACKS.map((t) => t.premiseId));
  return {
    declared: premises.size,
    bound: [...premises].filter((p) => tracked.has(p)).length,
  };
}
