import { describe, it, expect } from "vitest";
import {
  PALIMPSEST_SIGNAL_CONTRIBUTIONS,
  PALIMPSEST_NOISE_CONTRIBUTIONS,
  PALIMPSEST_STATE_THRESHOLDS,
  getPalimpsestState,
  listPalimpsestContributions,
} from "./palimpsestMeter";
import {
  PALIMPSEST_CONTESTANTS,
  getPalimpsestContestant,
  listPalimpsestContestants,
} from "./contestants";
import {
  PALIMPSEST_EPISODES,
  getPalimpsestEpisode,
  listPalimpsestEpisodes,
} from "./episodeFormats";
import {
  INVENTOR_HACK_PROGRESSION,
  getInventorHackStepByEpisode,
  listInventorHackSteps,
} from "./inventorHack";
import {
  DARREN_ARC_BEATS,
  DARREN_MEMORIAL_CARD,
  CLAUSE_14_SUBSTITUTION,
  listDarrenArcBeats,
  getDarrenArcBeat,
} from "./darrenArc";
import {
  HOST_FACE_SCROLL,
  MEME_MONOLOGUE_BEATS,
  EPISODE_13_ENVELOPE,
  PALIMPSEST_GAME_MASTERS,
  listPalimpsestGameMasters,
  listHostFaceScroll,
} from "./reveal";
import {
  APPENDIX_C_CANONICAL_USES,
  APPENDIX_C_NEW_CODE,
  listAppendixCCanonicalUses,
  listAppendixCNewCode,
} from "./integrationMap";

describe("Appendix C §C.1 — Palimpsest Meter", () => {
  it("has at least one contribution per axis", () => {
    expect(PALIMPSEST_SIGNAL_CONTRIBUTIONS.length).toBeGreaterThan(0);
    expect(PALIMPSEST_NOISE_CONTRIBUTIONS.length).toBeGreaterThan(0);
  });

  it("every signal contribution has axis=signal", () => {
    for (const c of PALIMPSEST_SIGNAL_CONTRIBUTIONS) {
      expect(c.axis).toBe("signal");
    }
  });

  it("every noise contribution has axis=noise", () => {
    for (const c of PALIMPSEST_NOISE_CONTRIBUTIONS) {
      expect(c.axis).toBe("noise");
    }
  });

  it("catching a Meme disguise is worth +25 Signal", () => {
    const c = PALIMPSEST_SIGNAL_CONTRIBUTIONS.find(
      (c) => c.id === "signal_meme_disguise_caught",
    );
    expect(c?.amount).toBe(25);
  });

  it("agreeing with Alaric costs +10 Noise", () => {
    const c = PALIMPSEST_NOISE_CONTRIBUTIONS.find(
      (c) => c.id === "noise_alaric_agreement",
    );
    expect(c?.amount).toBe(10);
  });

  it("state thresholds are contiguous and cover all deltas", () => {
    expect(PALIMPSEST_STATE_THRESHOLDS.length).toBe(4);
  });

  it("getPalimpsestState returns wide signal when delta >= 100", () => {
    expect(getPalimpsestState(200, 50)).toBe("signal_dominant_wide");
  });

  it("getPalimpsestState returns narrow signal when 0 < delta < 100", () => {
    expect(getPalimpsestState(60, 50)).toBe("signal_dominant_narrow");
  });

  it("getPalimpsestState returns narrow noise when -100 < delta <= 0", () => {
    expect(getPalimpsestState(50, 60)).toBe("noise_dominant_narrow");
  });

  it("getPalimpsestState returns wide noise when delta <= -100", () => {
    expect(getPalimpsestState(50, 200)).toBe("noise_dominant_wide");
  });

  it("listPalimpsestContributions returns both axes combined", () => {
    const all = listPalimpsestContributions();
    expect(all.length).toBe(
      PALIMPSEST_SIGNAL_CONTRIBUTIONS.length +
        PALIMPSEST_NOISE_CONTRIBUTIONS.length,
    );
  });
});

describe("Appendix C §C.2 — Four Contestants", () => {
  it("has exactly four contestants", () => {
    expect(PALIMPSEST_CONTESTANTS.length).toBe(4);
  });

  it("seats are 1-4 contiguously", () => {
    const seats = [...PALIMPSEST_CONTESTANTS].map((c) => c.seat).sort();
    expect(seats).toEqual([1, 2, 3, 4]);
  });

  it("Darren is the quiz_partner with net_new lore anchor", () => {
    const darren = getPalimpsestContestant("darren_fessler");
    expect(darren?.role).toBe("quiz_partner");
    expect(darren?.loreAnchor).toBe("net_new");
  });

  it("Alaric is the primary_opponent", () => {
    const alaric = getPalimpsestContestant("general_alaric");
    expect(alaric?.role).toBe("primary_opponent");
  });

  it("Inventor is the meta_contestant with canonical lore anchor", () => {
    const inv = getPalimpsestContestant("the_inventor");
    expect(inv?.role).toBe("meta_contestant");
    expect(inv?.loreAnchor).toBe("canonical");
  });

  it("Player occupies the player_seat", () => {
    const player = getPalimpsestContestant("the_player");
    expect(player?.role).toBe("player_seat");
  });

  it("listPalimpsestContestants returns all four", () => {
    expect(listPalimpsestContestants().length).toBe(4);
  });
});

describe("Appendix C §C.3 — Episode Formats", () => {
  it("has exactly 13 episodes", () => {
    expect(PALIMPSEST_EPISODES.length).toBe(13);
  });

  it("orders are 1-13 contiguously", () => {
    const orders = [...PALIMPSEST_EPISODES].map((e) => e.order).sort(
      (a, b) => a - b,
    );
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });

  it("episode 4 is zero deaths (the scariest one)", () => {
    const ep4 = getPalimpsestEpisode("ep04_the_auction");
    expect(ep4?.zeroDeaths).toBe(true);
  });

  it("episode 7 is also zero deaths (legal filings, not executions)", () => {
    const ep7 = getPalimpsestEpisode("ep07_railroad");
    expect(ep7?.zeroDeaths).toBe(true);
  });

  it("episode 13 is the anticlimax with no Round 3 game", () => {
    const ep13 = getPalimpsestEpisode("ep13_the_reckoning");
    expect(ep13?.isAnticlimax).toBe(true);
  });

  it("every episode has a unique completedFlag", () => {
    const flags = PALIMPSEST_EPISODES.map((e) => e.completedFlag);
    expect(new Set(flags).size).toBe(flags.length);
  });

  it("listPalimpsestEpisodes returns all 13", () => {
    expect(listPalimpsestEpisodes().length).toBe(13);
  });
});

describe("Appendix C §C.4 — Inventor Hack Progression", () => {
  it("has one step per episode (13 total)", () => {
    expect(INVENTOR_HACK_PROGRESSION.length).toBe(13);
  });

  it("intensity climbs monotonically from Ep1 through Ep12", () => {
    const ep1to12 = INVENTOR_HACK_PROGRESSION.filter(
      (s) => s.episode >= 1 && s.episode <= 12,
    );
    const sorted = [...ep1to12].sort((a, b) => a.episode - b.episode);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].intensityPercent).toBeGreaterThanOrEqual(
        sorted[i - 1].intensityPercent,
      );
    }
  });

  it("Episode 12 is the 95% full takeover", () => {
    const step = getInventorHackStepByEpisode(12);
    expect(step?.intensityPercent).toBe(95);
    expect(step?.label.toLowerCase()).toContain("takeover");
  });

  it("Episode 13 intensity resets to 0 (Inventor silenced)", () => {
    const step = getInventorHackStepByEpisode(13);
    expect(step?.intensityPercent).toBe(0);
  });

  it("Episodes 1-2 produce no inventor line (glyph only)", () => {
    expect(getInventorHackStepByEpisode(1)?.inventorLine).toBeNull();
    expect(getInventorHackStepByEpisode(2)?.inventorLine).toBeNull();
  });

  it("listInventorHackSteps returns all 13", () => {
    expect(listInventorHackSteps().length).toBe(13);
  });
});

describe("Appendix C §C.5 — Darren's Arc", () => {
  it("has one beat per episode 1-12", () => {
    expect(DARREN_ARC_BEATS.length).toBe(12);
    const eps = [...DARREN_ARC_BEATS].map((b) => b.episode).sort(
      (a, b) => a - b,
    );
    expect(eps).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("Episode 12 contributes +200 Signal (the canonical largest moment)", () => {
    const beat = getDarrenArcBeat(12);
    expect(beat?.palimpsestSignal).toBe(200);
  });

  it("THE ASSISTANT memorial card has the canonical rules text", () => {
    expect(DARREN_MEMORIAL_CARD.name).toBe("THE ASSISTANT");
    expect(DARREN_MEMORIAL_CARD.rulesText).toContain("break one of your own rules");
  });

  it("Clause 14 substitution delivery line is 'I made it up.'", () => {
    expect(CLAUSE_14_SUBSTITUTION.deliverySentence).toBe("I made it up.");
  });

  it("Alaric's response mentions Darren finally writing something", () => {
    expect(CLAUSE_14_SUBSTITUTION.alaricResponse).toContain("written");
  });

  it("listDarrenArcBeats returns all twelve", () => {
    expect(listDarrenArcBeats().length).toBe(12);
  });
});

describe("Appendix C §C.6 — Episode 13 Reveal", () => {
  it("the face scroll is non-empty and ordered", () => {
    expect(HOST_FACE_SCROLL.length).toBeGreaterThanOrEqual(11);
    const orders = [...HOST_FACE_SCROLL].map((f) => f.order).sort(
      (a, b) => a - b,
    );
    for (let i = 0; i < orders.length; i++) {
      expect(orders[i]).toBe(i + 1);
    }
  });

  it("the player's chosen avatar is held for a full second", () => {
    const frame = HOST_FACE_SCROLL.find((f) =>
      f.face.toLowerCase().includes("avatar"),
    );
    expect(frame?.holdMs).toBe(1000);
  });

  it("the Meme monologue has exactly three beats", () => {
    expect(MEME_MONOLOGUE_BEATS.length).toBe(3);
  });

  it("the third monologue beat foreshadows the White Oracle", () => {
    const third = MEME_MONOLOGUE_BEATS.find((b) => b.order === 3);
    expect(third?.beat.toLowerCase()).toContain("white");
  });

  it("the envelope is addressed to the real account name", () => {
    expect(EPISODE_13_ENVELOPE.addressedTo).toBe(
      "the_players_real_account_name",
    );
  });

  it("has three Game Masters — dead, Meme-worn, Academy Professor", () => {
    expect(PALIMPSEST_GAME_MASTERS.length).toBe(3);
    const statuses = PALIMPSEST_GAME_MASTERS.map((g) => g.status).sort();
    expect(statuses).toEqual(["academy_professor", "dead", "worn_by_meme"]);
  });

  it("the Academy Professor is Glinn Vyre", () => {
    const prof = PALIMPSEST_GAME_MASTERS.find(
      (g) => g.status === "academy_professor",
    );
    expect(prof?.label).toContain("Glinn Vyre");
  });

  it("listPalimpsestGameMasters returns all three", () => {
    expect(listPalimpsestGameMasters().length).toBe(3);
  });

  it("listHostFaceScroll returns the full scroll", () => {
    expect(listHostFaceScroll().length).toBe(HOST_FACE_SCROLL.length);
  });
});

describe("Appendix C §C.7 — Integration Map", () => {
  it("canonical uses contain quizSpectator, rippleEngine, transmissions", () => {
    const ids = APPENDIX_C_CANONICAL_USES.map((e) => e.id);
    expect(ids).toContain("quiz_spectator");
    expect(ids).toContain("ripple_engine");
    expect(ids).toContain("transmissions");
  });

  it("new code entries declare Palimpsest meter + Darren NPC + Alaric NPC", () => {
    const ids = APPENDIX_C_NEW_CODE.map((e) => e.id);
    expect(ids).toContain("palimpsest_meter");
    expect(ids).toContain("darren_fessler_npc");
    expect(ids).toContain("general_alaric_npc");
  });

  it("every canonical use has status=existing", () => {
    for (const e of APPENDIX_C_CANONICAL_USES) {
      expect(e.status).toBe("existing");
    }
  });

  it("new code is never tagged as pre-existing canon", () => {
    for (const e of APPENDIX_C_NEW_CODE) {
      expect(e.status).not.toBe("existing");
    }
  });

  it("every new-code entry has already shipped on main", () => {
    // The quiz-show track shipped all eleven entries. This test
    // is the regression guard that keeps the integration map
    // honest if any of them are reverted.
    for (const e of APPENDIX_C_NEW_CODE) {
      expect(e.status).toBe("shipped");
    }
  });

  it("listAppendixCCanonicalUses and listAppendixCNewCode return the registries", () => {
    expect(listAppendixCCanonicalUses().length).toBe(
      APPENDIX_C_CANONICAL_USES.length,
    );
    expect(listAppendixCNewCode().length).toBe(APPENDIX_C_NEW_CODE.length);
  });
});
