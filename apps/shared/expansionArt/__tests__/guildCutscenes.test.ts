import { describe, it, expect } from "vitest";

import {
  GUILD_CUTSCENES,
  GUILD_CUTSCENE_TOTAL,
  guildCutsceneById,
  guildCutsceneStillUrls,
  guildCutsceneVideoUrl,
  guildCutscenesByCategory,
  guildCutscenesByProfessor,
} from "../guildCutscenesManifest";
import {
  GUILD_CUTSCENE_VO_PAIRS,
  getCsVoLines,
  getVoLine,
  getVoLineCsId,
  isResolvableCsId,
  roomUnlockCutscene,
  signatureCutsceneFor,
  tierUpCutscene,
  warEventCutscene,
} from "../guildCutsceneVoMap";
import {
  PROFESSOR_SIGNATURE_CARDS,
  PROFESSOR_SIGNATURE_CARD_TOTAL,
  cinematicForCardPlayed,
  getProfessorSignatureEntry,
} from "../professorSignatureCards";

const CDN_PREFIX = "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/";

describe("guildCutscenesManifest — visual asset registry", () => {
  it("ships 65 cutscene defs across the 6 producer categories", () => {
    expect(GUILD_CUTSCENE_TOTAL).toBe(65);
    expect(GUILD_CUTSCENES.length).toBe(65);
    const counts = {
      f1_onboarding: guildCutscenesByCategory("f1_onboarding").length,
      f2_daily: guildCutscenesByCategory("f2_daily").length,
      f2_emotes: guildCutscenesByCategory("f2_emotes").length,
      f3_combat: guildCutscenesByCategory("f3_combat").length,
      f4_abilities: guildCutscenesByCategory("f4_abilities").length,
      f5_guild_hall: guildCutscenesByCategory("f5_guild_hall").length,
    };
    expect(counts).toEqual({
      f1_onboarding: 5, // join, first_message, friend_accept, sorting pre + post
      f2_daily: 4,
      f2_emotes: 12,
      f3_combat: 12, // 7 non-epoch + 5 epoch
      f4_abilities: 24, // 12 sigs × light/dark
      f5_guild_hall: 8, // 7 from bundle + 1 portal_chamber fallback
    });
  });

  it("every entry has at least one still and a stable CDN url", () => {
    for (const def of GUILD_CUTSCENES) {
      expect(def.stillRelPaths.length).toBeGreaterThan(0);
      const urls = guildCutsceneStillUrls(def.id);
      expect(urls.length).toBe(def.stillRelPaths.length);
      for (const u of urls) {
        expect(u.startsWith(CDN_PREFIX)).toBe(true);
        expect(u.includes("/guild-cutscenes/")).toBe(true);
      }
    }
  });

  it("video is present on every cutscene except videoless F.2.4 emotes", () => {
    for (const def of GUILD_CUTSCENES) {
      const url = guildCutsceneVideoUrl(def.id);
      if (def.category === "f2_emotes") {
        expect(url).toBeUndefined();
        expect(def.videoRelPath).toBeUndefined();
      } else {
        expect(url).toBeDefined();
        expect(url!.startsWith(CDN_PREFIX)).toBe(true);
      }
    }
  });

  it("ids are unique", () => {
    const ids = new Set(GUILD_CUTSCENES.map((d) => d.id));
    expect(ids.size).toBe(GUILD_CUTSCENES.length);
  });

  it("F.4 abilities expose both light + dark variants for all 12 Professors", () => {
    const professors = [
      "kanevas", "aoki", "halverez", "orphic", "mireille", "kasra",
      "vellis", "greenshaw", "vex", "vasara", "vent", "proctor",
    ];
    for (const p of professors) {
      const cuts = guildCutscenesByProfessor(p);
      expect(cuts.length).toBe(2);
      expect(cuts.map((c) => c.variant).sort()).toEqual(["dark", "light"]);
    }
  });

  it("F.2.4 emotes expose the producer-original sticker variant", () => {
    for (const def of guildCutscenesByCategory("f2_emotes")) {
      expect(def.originalStillRelPath).toBeDefined();
      expect(def.archonId).toBeTruthy();
    }
  });
});

describe("guildCutsceneVoMap — VO ↔ cutscene pairing", () => {
  it("pairs all 62 lines from guild-cutscene-vo-lines.json", () => {
    expect(GUILD_CUTSCENE_VO_PAIRS.length).toBe(62);
  });

  it("every pair resolves to a real entry in GUILD_CUTSCENES", () => {
    const unresolved = GUILD_CUTSCENE_VO_PAIRS.filter(
      (p) => !isResolvableCsId(p.csId),
    );
    expect(unresolved).toEqual([]);
  });

  it("F.4 line ids carry their light/dark variant in the resolved csId", () => {
    const kanevasLight = getVoLine("kanevas_harmonize_001");
    expect(kanevasLight?.csId).toBe("cs_sig_1_light");
    expect(kanevasLight?.variant).toBe("light");

    const kanevasDark = getVoLine("kanevas_dissonance_001");
    expect(kanevasDark?.csId).toBe("cs_sig_1_dark");
    expect(kanevasDark?.variant).toBe("dark");
  });

  it("cs_hall_tier_up fans out to 4 elara tier lines (2..5)", () => {
    const lines = getCsVoLines("cs_hall_tier_up");
    expect(lines.map((l) => l.id).sort()).toEqual([
      "elara_tier_2_001",
      "elara_tier_3_001",
      "elara_tier_4_001",
      "elara_tier_5_001",
    ]);
  });

  it("non-F.4 lines have no variant", () => {
    const warDeclared = getVoLine("warlord_war_declared_001");
    expect(warDeclared?.variant).toBeUndefined();
    expect(warDeclared?.csId).toBe("cs_war_declared");
  });

  it("getVoLineCsId is the inverse of getCsVoLines", () => {
    for (const pair of GUILD_CUTSCENE_VO_PAIRS) {
      expect(getVoLineCsId(pair.id)).toBe(pair.csId);
      const lines = getCsVoLines(pair.csId);
      expect(lines.map((l) => l.id)).toContain(pair.id);
    }
  });

  it("speaker keys cover the 26 unique guild-cutscene voices", () => {
    const speakers = new Set(GUILD_CUTSCENE_VO_PAIRS.map((p) => p.speaker));
    expect(speakers.size).toBe(26);
    // Spot-check the four newly-introduced archetype-emote speakers
    // and the three Mechronis Professors most likely to be missed.
    for (const k of ["chorus", "between", "warden", "politician", "kanevas", "vellis", "proctor"]) {
      expect(speakers.has(k)).toBe(true);
    }
  });
});

describe("cutscene-trigger helpers", () => {
  it("tierUpCutscene maps tiers 2..5 to the right elara line", () => {
    expect(tierUpCutscene(2)).toEqual({
      csId: "cs_hall_tier_up",
      voLineId: "elara_tier_2_001",
    });
    expect(tierUpCutscene(5).voLineId).toBe("elara_tier_5_001");
    // Every returned voLineId resolves back to a real pair.
    for (const tier of [2, 3, 4, 5] as const) {
      const t = tierUpCutscene(tier);
      expect(getVoLine(t.voLineId!)).toBeDefined();
    }
  });

  it("roomUnlockCutscene returns the signature ids for special rooms", () => {
    expect(roomUnlockCutscene("oracle_pool")).toEqual({
      csId: "cs_signature_room_unlock_oracle_pool",
      voLineId: "vex_oracle_001",
    });
    expect(roomUnlockCutscene("portal_chamber")).toEqual({
      csId: "cs_signature_room_unlock_portal_chamber",
      voLineId: "architect_portal_001",
    });
  });

  it("roomUnlockCutscene falls back to generic for non-signature rooms", () => {
    expect(roomUnlockCutscene("war_room")).toEqual({ csId: "cs_room_unlock" });
    expect(roomUnlockCutscene("training_ground")).toEqual({ csId: "cs_room_unlock" });
    expect(roomUnlockCutscene("trophy_gallery")).toEqual({ csId: "cs_room_unlock" });
  });

  it("roomUnlockCutscene returns null for unknown rooms", () => {
    expect(roomUnlockCutscene("not_a_room")).toBeNull();
  });

  it("signatureCutsceneFor maps each Professor to their light + dark cs_sig_N", () => {
    expect(signatureCutsceneFor("kanevas", false)).toEqual({
      csId: "cs_sig_1_light",
      voLineId: "kanevas_harmonize_001",
    });
    expect(signatureCutsceneFor("kanevas", true)).toEqual({
      csId: "cs_sig_1_dark",
      voLineId: "kanevas_dissonance_001",
    });
    expect(signatureCutsceneFor("proctor", false)?.csId).toBe("cs_sig_12_light");
    expect(signatureCutsceneFor("proctor", true)?.csId).toBe("cs_sig_12_dark");
  });

  it("signatureCutsceneFor returns null for non-Professor casters", () => {
    expect(signatureCutsceneFor("agent_zero", false)).toBeNull();
    expect(signatureCutsceneFor("warlord", true)).toBeNull();
  });

  it("cinematicForCardPlayed returns the correct trigger for the seeded entry", () => {
    const trigger = cinematicForCardPlayed("s1_pack2_thought_virus_quarantine_field");
    expect(trigger).toEqual({
      csId: "cs_sig_8_dark",
      voLineId: "greenshaw_virus_001",
    });
    // Round-trip via the registry entry too.
    const entry = getProfessorSignatureEntry("s1_pack2_thought_virus_quarantine_field");
    expect(entry).toEqual({
      cardDefId: "s1_pack2_thought_virus_quarantine_field",
      professorId: "greenshaw",
      isCorrupted: true,
    });
  });

  it("cinematicForCardPlayed returns null for unregistered cards", () => {
    expect(cinematicForCardPlayed("s1_char_001_some_unit")).toBeNull();
    expect(cinematicForCardPlayed("")).toBeNull();
  });

  it("PROFESSOR_SIGNATURE_CARDS entries all resolve through cinematicForCardPlayed", () => {
    expect(PROFESSOR_SIGNATURE_CARDS.length).toBe(PROFESSOR_SIGNATURE_CARD_TOTAL);
    for (const entry of PROFESSOR_SIGNATURE_CARDS) {
      const trigger = cinematicForCardPlayed(entry.cardDefId);
      expect(trigger).not.toBeNull();
      expect(trigger?.csId.startsWith("cs_sig_")).toBe(true);
      expect(trigger?.csId.endsWith(entry.isCorrupted ? "_dark" : "_light")).toBe(true);
    }
  });

  it("warEventCutscene resolves each canonical war/contract event to a paired cs_id", () => {
    expect(warEventCutscene("war_declared").csId).toBe("cs_war_declared");
    expect(warEventCutscene("war_victory").csId).toBe("cs_war_victory");
    expect(warEventCutscene("contract_unlock").csId).toBe("cs_contract_unlock");
    expect(warEventCutscene("epoch_change_revelation").csId).toBe("cs_epoch_change_revelation");
    // Every returned csId resolves to a real registry entry.
    const events = [
      "contract_unlock", "contract_complete", "house_cup_weekly_reset",
      "donation_milestone", "war_declared", "war_first_blood", "war_mvp_crowned",
      "war_victory", "war_defeat", "alliance_war_placement_lock",
      "thought_virus_reinfection", "epoch_change_privacy", "epoch_change_prophecy",
      "epoch_change_insurgency", "epoch_change_revelation", "epoch_change_fall",
    ] as const;
    for (const e of events) {
      const t = warEventCutscene(e);
      expect(isResolvableCsId(t.csId)).toBe(true);
    }
  });
});
