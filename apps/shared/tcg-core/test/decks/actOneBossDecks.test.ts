/**
 * Act 1 curated boss-deck integrity tests.
 *
 * Replaces the generic `bossDeckForFaction()` placeholders with
 * curated 39-card decks per boss (§5.8 Authority, §5.5 Warlord,
 * §5.6 Programmer, §5.7 Game Master, §4.9 Seer). Each deck must:
 *   1. be exactly 39 cards (Dischordia deck-size invariant)
 *   2. respect the 3-copy limit
 *   3. resolve every card id in the shipped registry
 *   4. pass STANDARD_S1 validateDeck() paired with its boss general
 *   5. be wired into the chapter's StoryEncounter bossDeckCardDefIds
 */
import { describe, it, expect } from "vitest";
import {
  buildCardRegistry,
  ALL_CARD_DEFINITIONS,
  validateDeck,
  STANDARD_S1,
} from "../../index";
import { AUTHORITY_TRIAL_BOSS_DECK } from "../../decks/authorityTrialBossDeck";
import { WARLORD_ZERO_BOSS_DECK } from "../../decks/warlordZeroBossDeck";
import { PROGRAMMER_GIFT_BOSS_DECK } from "../../decks/programmerGiftBossDeck";
import {
  GAME_MASTER_BOSS_DECK,
  GAME_MASTER_PUBLIC_DELTA_IDS,
} from "../../decks/gameMasterBossDeck";
import { SEER_VISIT_BOSS_DECK } from "../../decks/seerVisitBossDeck";
import { CHAPTER_MAP } from "../../story/chapters";

const registry = buildCardRegistry(ALL_CARD_DEFINITIONS);

interface Scenario {
  label: string;
  deck: readonly string[];
  general: string;
  chapterId: string;
}

const SCENARIOS: Scenario[] = [
  {
    label: "§5.8 Authority",
    deck: AUTHORITY_TRIAL_BOSS_DECK,
    general: "gen_authority",
    chapterId: "ch_authority_trial",
  },
  {
    label: "§5.5 Warlord Zero",
    deck: WARLORD_ZERO_BOSS_DECK,
    general: "gen_architect",
    chapterId: "ch_warlord_zero_first",
  },
  {
    label: "§5.6 Programmer",
    deck: PROGRAMMER_GIFT_BOSS_DECK,
    general: "gen_programmer",
    chapterId: "ch_programmer_gift",
  },
  {
    label: "§5.7 Game Master",
    deck: GAME_MASTER_BOSS_DECK,
    general: "gen_game_master_original",
    chapterId: "ch_game_master",
  },
  {
    label: "§4.9 Seer",
    deck: SEER_VISIT_BOSS_DECK,
    general: "gen_seer",
    chapterId: "ch_seer_visit",
  },
];

describe("Act 1 curated boss decks", () => {
  for (const s of SCENARIOS) {
    describe(s.label, () => {
      it("is exactly 39 cards (Dischordia invariant)", () => {
        expect(s.deck.length).toBe(39);
      });

      it("respects the 3-copy limit", () => {
        const counts = new Map<string, number>();
        for (const id of s.deck) counts.set(id, (counts.get(id) ?? 0) + 1);
        for (const [id, count] of counts) {
          expect(count, `${id} × ${count}`).toBeLessThanOrEqual(3);
        }
      });

      it("every card id resolves in the shipped registry", () => {
        for (const id of s.deck) {
          expect(registry.has(id), `registry missing ${id}`).toBe(true);
        }
      });

      it("validates cleanly under STANDARD_S1 format", () => {
        const result = validateDeck(
          { generalDefId: s.general, cardDefIds: s.deck },
          STANDARD_S1,
          registry,
        );
        expect(result.valid, JSON.stringify(result.issues)).toBe(true);
      });

      it("is wired into its chapter StoryEncounter", () => {
        const encounter = CHAPTER_MAP[s.chapterId];
        expect(encounter, `chapter ${s.chapterId} not registered`).toBeDefined();
        expect(encounter!.bossDeckCardDefIds).toBe(s.deck);
        expect(encounter!.bossGeneralDefId).toBe(s.general);
      });
    });
  }

  it("Warlord deck includes three_moves at full 3× for the scripted force-play", () => {
    const threeMoves = WARLORD_ZERO_BOSS_DECK.filter(
      (id) => id === "s1_warlord_three_moves",
    );
    expect(threeMoves.length).toBe(3);
  });

  it("Game Master deck over-selects authored public_delta cards", () => {
    const publicDeltaIds = new Set(GAME_MASTER_PUBLIC_DELTA_IDS);
    const count = GAME_MASTER_BOSS_DECK.filter((id) => publicDeltaIds.has(id)).length;
    // All four signature verdict-stream cards at full 3× each = 12.
    expect(count).toBe(12);
  });

  it("Seer deck excludes the winnable-path burnt_card_placeholder", () => {
    expect(SEER_VISIT_BOSS_DECK).not.toContain("burnt_card_placeholder");
  });
});
