/**
 * Expansion Production Book — structural + lore-boundary tests.
 *
 * Per the 2026-04-27 plan §Verification, this test enforces:
 *   1. Card counts match the planned scope (84 + 28 + 10 = 122)
 *   2. Cutscene count = 9; VFX count = 18
 *   3. Every card / cutscene / VFX entry has ≥1 lore citation
 *   4. Lore-boundary spoiler sweep: non-secret entries do NOT
 *      contain Acts 3-7 spoiler keywords
 *   5. Every un-canon Hierarchy card carries archetypeRationale
 *   6. Every cutscene has ≥3 beats + a defined trigger
 *   7. Every VFX entry has the locked output spec
 *      (1920×1080 VP9 α @30fps)
 *
 * Failures here mean either: (a) the source authoring drifted
 * out of spec, or (b) the spec needs to be re-aligned with the
 * plan. Either way, fail loudly.
 */
import { describe, it, expect } from "vitest";
import {
  EXPANSION_CARD_PROMPTS,
  EXPANSION_CUTSCENE_PROMPTS,
  EXPANSION_VFX_PROMPTS,
} from "./index";
import type { ExpansionCardPrompt } from "./types";

// ──────────────────────────────────────────────────────────────
// Spoiler keywords — non-secret entries must NOT contain these.
// Secret entries (id-prefix `secret_`) are exempt because they
// are unlock-gated per THE ASSISTANT model and may surface
// earned post-Epoch-2 truths.
// ──────────────────────────────────────────────────────────────
const SPOILER_KEYWORDS: readonly string[] = [
  "Watcher unmasked",
  "Watcher's true identity",
  "Source is Kael",
  "Kael Reborn",
  "Engineer is the Memoirist", // The phrasing that would directly state the Act 4-5 reveal
  "Daniel Cross",
  "Programmer-as-Antiquarian",
  "third thing in the room",
];

const cards = Object.values(EXPANSION_CARD_PROMPTS);
const cutscenes = Object.values(EXPANSION_CUTSCENE_PROMPTS);
const vfxList = Object.values(EXPANSION_VFX_PROMPTS);

// Hierarchy cards lacking established LORE_BIBLE canon must carry
// archetypeRationale. The 6 canon-anchored Hierarchy cards (Mol'Garath,
// Xeth'Raal, Riri'Ahlia reprint, Varkul, Shadow Tongue, Fenra reprint)
// are the only Hierarchy entries permitted to omit it.
const HIERARCHY_CANON_ANCHORED: ReadonlySet<string> = new Set([
  "s2_hierarchy_ceo_mol_garath",
  "s2_hierarchy_cfo_xeth_raal",
  "s2_hierarchy_coo_ririahlia_reprint",
  "s2_hierarchy_vp_security_varkul",
  "s2_hierarchy_vp_comms_shadow_tongue",
  "s2_hierarchy_dir_ops_fenra_reprint",
]);

// ──────────────────────────────────────────────────────────────
// Section §1 — Card counts
// ──────────────────────────────────────────────────────────────
describe("Expansion cards — scope counts", () => {
  it("ships exactly 122 cards in total", () => {
    expect(cards.length).toBe(122);
  });

  it("ships 84 cards under S2_HIERARCHY (id-prefix s2_hierarchy_)", () => {
    const s2 = cards.filter((c) => c.cardId.startsWith("s2_hierarchy_"));
    expect(s2.length).toBe(84);
    for (const c of s2) {
      expect(c.setCode).toBe("S2_HIERARCHY");
      expect(c.faction).toBe("new_babylon");
    }
  });

  it("ships 28 cards under ACT_EXCLUSIVES (id-prefix act{1..7}_)", () => {
    const acts = cards.filter((c) => /^act[1-7]_/.test(c.cardId));
    expect(acts.length).toBe(28);
    for (const c of acts) expect(c.setCode).toBe("ACT_EXCLUSIVES");
    // Per-act count: each act gets exactly 4
    for (let n = 1; n <= 7; n++) {
      const perAct = acts.filter((c) => c.cardId.startsWith(`act${n}_`));
      expect(perAct.length, `Act ${n} should have 4 exclusive cards`).toBe(4);
    }
  });

  it("ships 10 specials (3 cosmetic-tier + 7 lore-discovery secrets)", () => {
    const specials = cards.filter(
      (c) => c.cardId.startsWith("special_") || c.cardId.startsWith("secret_"),
    );
    expect(specials.length).toBe(10);
    const cosmetic = cards.filter((c) => c.cardId.startsWith("special_"));
    expect(cosmetic.length).toBe(3);
    const secrets = cards.filter((c) => c.cardId.startsWith("secret_"));
    expect(secrets.length).toBe(7);
    // One secret per Act
    for (let n = 1; n <= 7; n++) {
      const perAct = secrets.filter((c) => c.cardId.startsWith(`secret_act${n}_`));
      expect(perAct.length, `Act ${n} should have 1 lore-discovery secret`).toBe(1);
    }
  });

  it("every card has a unique id", () => {
    const ids = new Set(cards.map((c) => c.cardId));
    expect(ids.size).toBe(cards.length);
  });
});

// ──────────────────────────────────────────────────────────────
// Section §1 — Card structural rigor
// ──────────────────────────────────────────────────────────────
describe("Expansion cards — structural rigor", () => {
  it("every card has ≥1 lore citation", () => {
    const offenders = cards.filter((c) => c.loreCitations.length === 0);
    expect(offenders.map((c) => c.cardId)).toEqual([]);
  });

  it("every card has non-empty name, sceneDelta, palette, composition", () => {
    const offenders = cards.filter(
      (c) =>
        !c.name?.trim() ||
        !c.sceneDelta?.trim() ||
        !c.palette?.trim() ||
        !c.composition?.trim(),
    );
    expect(offenders.map((c) => c.cardId)).toEqual([]);
  });

  it("every card has ≥3 mood keywords", () => {
    const offenders = cards.filter((c) => c.moodKeywords.length < 3);
    expect(offenders.map((c) => c.cardId)).toEqual([]);
  });

  it("every un-canon Hierarchy card carries archetypeRationale", () => {
    const offenders = cards.filter((c) => {
      if (!c.cardId.startsWith("s2_hierarchy_")) return false;
      if (HIERARCHY_CANON_ANCHORED.has(c.cardId)) return false;
      return !c.archetypeRationale?.trim();
    });
    expect(offenders.map((c) => c.cardId)).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────
// Section §1 — Lore-boundary spoiler sweep
// ──────────────────────────────────────────────────────────────
describe("Expansion cards — lore-boundary sweep", () => {
  it("no non-secret card contains Acts 3-7 spoiler keywords", () => {
    const offenders: Array<{ id: string; keyword: string; field: string }> = [];
    for (const c of cards) {
      if (c.cardId.startsWith("secret_")) continue;
      const fields: Array<[string, string | undefined]> = [
        ["sceneDelta", c.sceneDelta],
        ["flavorText", c.flavorText],
        ["palette", c.palette],
        ["composition", c.composition],
        ["notes", c.notes],
        ["archetypeRationale", c.archetypeRationale],
      ];
      for (const [field, text] of fields) {
        if (!text) continue;
        for (const kw of SPOILER_KEYWORDS) {
          if (text.includes(kw)) {
            offenders.push({ id: c.cardId, keyword: kw, field });
          }
        }
      }
    }
    if (offenders.length > 0) {
      const summary = offenders
        .map((o) => `  ${o.id}.${o.field} — '${o.keyword}'`)
        .join("\n");
      expect.fail(`Spoiler keywords found in non-secret entries:\n${summary}`);
    }
  });
});

// ──────────────────────────────────────────────────────────────
// Section §2 — Cutscenes
// ──────────────────────────────────────────────────────────────
describe("Expansion cutscenes", () => {
  it("ships exactly 9 cutscenes", () => {
    expect(cutscenes.length).toBe(9);
  });

  it("every cutscene has a defined trigger", () => {
    const offenders = cutscenes.filter((c) => !c.trigger?.trim());
    expect(offenders.map((c) => c.id)).toEqual([]);
  });

  it("every cutscene has ≥3 beats", () => {
    const offenders = cutscenes.filter((c) => c.beats.length < 3);
    expect(offenders.map((c) => c.id)).toEqual([]);
  });

  it("every beat has cameraDirection, framingPrompt, motionPrompt", () => {
    const offenders: Array<{ cutscene: string; beat: string }> = [];
    for (const c of cutscenes) {
      for (const b of c.beats) {
        if (
          !b.cameraDirection?.trim() ||
          !b.framingPrompt?.trim() ||
          !b.motionPrompt?.trim()
        ) {
          offenders.push({ cutscene: c.id, beat: b.beatId });
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("every cutscene has ≥1 lore citation", () => {
    const offenders = cutscenes.filter((c) => c.loreCitations.length === 0);
    expect(offenders.map((c) => c.id)).toEqual([]);
  });

  it("estimatedDurationSec is positive on every cutscene", () => {
    const offenders = cutscenes.filter((c) => c.estimatedDurationSec <= 0);
    expect(offenders.map((c) => c.id)).toEqual([]);
  });
});

// ──────────────────────────────────────────────────────────────
// Section §3 — VFX
// ──────────────────────────────────────────────────────────────
describe("Expansion VFX", () => {
  it("ships exactly 18 VFX entries", () => {
    expect(vfxList.length).toBe(18);
  });

  it("every VFX has the locked prelude-pipeline output spec", () => {
    const offenders = vfxList.filter((v) => {
      const o = v.output;
      return (
        o.width !== 1920 ||
        o.height !== 1080 ||
        o.codec !== "vp9" ||
        o.alpha !== true ||
        o.fps !== 30
      );
    });
    expect(offenders.map((v) => v.id)).toEqual([]);
  });

  it("every VFX has start-frame, end-frame, motion, SFX cue", () => {
    const offenders = vfxList.filter(
      (v) =>
        !v.startFramePrompt?.trim() ||
        !v.endFramePrompt?.trim() ||
        !v.motionPrompt?.trim() ||
        !v.sfxCue?.trim(),
    );
    expect(offenders.map((v) => v.id)).toEqual([]);
  });

  it("every VFX has ≥1 lore citation", () => {
    const offenders = vfxList.filter((v) => v.loreCitations.length === 0);
    expect(offenders.map((v) => v.id)).toEqual([]);
  });

  it("every VFX has a defined trigger and positive duration", () => {
    const offenders = vfxList.filter(
      (v) => !v.trigger?.trim() || v.estimatedDurationSec <= 0,
    );
    expect(offenders.map((v) => v.id)).toEqual([]);
  });

  it("ships the 7 rarity-tier pack-flip ceremonies", () => {
    const expected: ReadonlyArray<string> = [
      "vfx_pack_flip_common",
      "vfx_pack_flip_uncommon",
      "vfx_pack_flip_rare",
      "vfx_pack_flip_epic",
      "vfx_pack_flip_legendary",
      "vfx_pack_flip_mythic",
      "vfx_pack_flip_neyon",
    ];
    const ids = new Set(vfxList.map((v) => v.id));
    for (const id of expected) {
      expect(ids.has(id), `missing rarity-flip VFX ${id}`).toBe(true);
    }
  });
});
