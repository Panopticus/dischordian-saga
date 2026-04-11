/* ═══════════════════════════════════════════════════════
   PET BATTLES ROUTER — source-level smoke tests

   The existing test conventions in this repo (see
   prestige.test.ts, task5-interconnections.test.ts) verify
   router wiring by reading the source and asserting the
   critical contracts. Full integration tests require a live
   MySQL instance, which isn't available in the default
   vitest environment.

   These tests cover the new endpoints added for the pet
   system extension: revivePet, getPartyTraits,
   setPetActive, unlockSkillNode, setQuestFlag,
   getArenaOpponent, killPet, plus the new spectral-bonus
   wiring in submitBattleResult and the acquire-source
   changes in acquirePet.
   ═══════════════════════════════════════════════════════ */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const routerSrc = fs.readFileSync(
  path.resolve(__dirname, "routers/petBattles.ts"),
  "utf-8",
);

describe("petBattles router — endpoint surface", () => {
  it("exposes revivePet mutation", () => {
    expect(routerSrc).toMatch(/revivePet:\s*protectedProcedure/);
  });

  it("exposes getPartyTraits query", () => {
    expect(routerSrc).toMatch(/getPartyTraits:\s*protectedProcedure/);
  });

  it("exposes setPetActive mutation", () => {
    expect(routerSrc).toMatch(/setPetActive:\s*protectedProcedure/);
  });

  it("exposes unlockSkillNode mutation", () => {
    expect(routerSrc).toMatch(/unlockSkillNode:\s*protectedProcedure/);
  });

  it("exposes setQuestFlag mutation", () => {
    expect(routerSrc).toMatch(/setQuestFlag:\s*protectedProcedure/);
  });

  it("exposes getArenaOpponent query", () => {
    expect(routerSrc).toMatch(/getArenaOpponent:\s*protectedProcedure/);
  });

  it("exposes killPet mutation", () => {
    expect(routerSrc).toMatch(/killPet:\s*protectedProcedure/);
  });
});

describe("petBattles router — revivePet contract", () => {
  it("checks dream balance before refunding HP", () => {
    expect(routerSrc).toMatch(/balance\.dreamTokens\s*<\s*cost/);
  });

  it("scales cost by evolution stage (1 → 100, 2 → 250, 3 → 500)", () => {
    expect(routerSrc).toMatch(/\{\s*1:\s*100,\s*2:\s*250,\s*3:\s*500\s*\}/);
  });

  it("applies a bond penalty (softened by high bond)", () => {
    expect(routerSrc).toMatch(/bondPenalty/);
    expect(routerSrc).toMatch(/bond\s*>=\s*60\s*\?\s*5\s*:\s*10/);
  });

  it("adds a spectral penalty bump when reviving a ghost", () => {
    expect(routerSrc).toMatch(/pet\.isSpectral\s*\?\s*basePenalty\s*\+\s*5/);
  });

  it("strips spectral state via petDeath.restorePet", () => {
    expect(routerSrc).toMatch(/petDeath\.restorePet\(ctx\.user\.id,\s*input\.petId\)/);
  });
});

describe("petBattles router — getPartyTraits contract", () => {
  it("filters to active pets only", () => {
    expect(routerSrc).toMatch(/eq\(playerPets\.isActive,\s*true\)/);
  });

  it("computes active traits, bonuses, and suggestion", () => {
    expect(routerSrc).toMatch(/computeActiveTraits\(party\)/);
    expect(routerSrc).toMatch(/resolvePartyBonuses\(party\)/);
    expect(routerSrc).toMatch(/suggestThresholdUpgrade\(party\)/);
  });
});

describe("petBattles router — unlockSkillNode contract", () => {
  it("validates prerequisites before unlocking", () => {
    expect(routerSrc).toMatch(/node\.requires.*unlocked\.includes\(node\.requires\)/s);
  });

  it("decrements skillPoints on successful unlock", () => {
    expect(routerSrc).toMatch(/skillPoints:\s*pet\.skillPoints\s*-\s*node\.cost/);
  });

  it("appends node to unlockedSkillNodes", () => {
    expect(routerSrc).toMatch(/unlockedSkillNodes:\s*nextUnlocked/);
  });

  it("blocks duplicate unlocks with CONFLICT", () => {
    expect(routerSrc).toMatch(/code:\s*"CONFLICT"/);
  });
});

describe("petBattles router — setQuestFlag idempotency", () => {
  it("returns early when the flag is already set", () => {
    expect(routerSrc).toMatch(/alreadySet:\s*true/);
  });

  it("appends new flags to completedQuestSteps", () => {
    expect(routerSrc).toMatch(/completedQuestSteps:\s*next/);
  });
});

describe("petBattles router — acquirePet source gating", () => {
  it("accepts four source enum values", () => {
    expect(routerSrc).toMatch(/"quest_reward",\s*"specimen_drop",\s*"shop_purchase",\s*"starter"/);
  });

  it("charges Dream tokens for shop_purchase", () => {
    expect(routerSrc).toMatch(/SHOP_PET_COST\s*=\s*500/);
    expect(routerSrc).toMatch(/dreamBalance\.dreamTokens\}\s*-\s*\$\{SHOP_PET_COST\}/);
  });

  it("starting bond varies by source", () => {
    expect(routerSrc).toMatch(/source\s*===\s*"quest_reward"\s*\?\s*8/);
  });
});

describe("petBattles router — submitBattleResult spectral wiring", () => {
  it("reads spectral pet bonus before prestige application", () => {
    expect(routerSrc).toMatch(/petDeath\.getSpectralPetBonus\(ctx\.user\.id\)/);
  });

  it("triggers petDeath.killPet on lethal HP", () => {
    expect(routerSrc).toMatch(/petDeath\.killPet\(ctx\.user\.id,\s*input\.petId,\s*"arena_lethal"\)/);
  });

  it("returns a spectralBonus payload when the bonus is non-zero", () => {
    expect(routerSrc).toMatch(/spectralBonus:\s*spectralBonusPct\s*>\s*0/);
  });
});

describe("petBattles router — matchmaker integration", () => {
  it("imports buildOpponent from the shared module", () => {
    expect(routerSrc).toMatch(/import.*buildOpponent.*@shared\/petArenaOpponents/);
  });

  it("getArenaOpponent delegates to buildOpponent", () => {
    expect(routerSrc).toMatch(/return buildOpponent\(input\.tierId/);
  });
});
