// apps/shared/npcs/__tests__/banks.meme.mirror_surface.test.ts
//
// Phase 6d.2 part-3 verification — Meme mirror-surface trigger bank
// (~10 new lines covering canonical 5 surface-types per Phase 1
// mirror_surface trigger kind).
//
// Coverage (5 surface-types × ≥2 register-variants):
//   - reflection (mirrors / dark windows): Broadcast + Quiet
//   - screen (monitors / dead displays): Broadcast + Real
//   - pool (water / fluid): Quiet + Stolen
//   - glass (windows / display cases): Broadcast + Replacement
//   - polished-metal (chrome / ship-hull): Broadcast + Quiet
//
// Voice canon: each line lands canonical "I am here too" register
// at one canonical remove (§1.8). Tell #1 face-vocabulary present.
// Pink-glitch involuntary tell (§1.9 Tell #5) appears in Quiet/
// Stolen-register lines.
//
// Engineering canon: lines use DialogSurface "expression" and gate
// on per-surface unlock flags `mirror_surface_{type}_passed` —
// engine sets the flag on canonical-mirror-surface crossing.

import { describe, it, expect } from "vitest";
import { THE_MEME_BANK } from "../banks/the_meme";

const MIRROR_LINES = THE_MEME_BANK.filter((l) =>
  l.lineId.startsWith("meme.mirror."),
);

describe("Meme mirror-surface trigger bank — Phase 6d.2 part 3", () => {
  it("ships ≥10 mirror-surface lines (Phase 6d.2 part 3 baseline)", () => {
    expect(MIRROR_LINES.length).toBeGreaterThanOrEqual(10);
  });

  it("every mirror line is owned by the_meme", () => {
    for (const l of MIRROR_LINES) {
      expect(l.npcKey, l.lineId).toBe("the_meme");
    }
  });

  it("every mirror line uses 'expression' DialogSurface (canonical visual register)", () => {
    for (const l of MIRROR_LINES) {
      expect(l.surfaces, l.lineId).toContain("expression");
    }
  });

  it("every mirror line uses bracketed [visual] format (canonical non-direct register)", () => {
    for (const l of MIRROR_LINES) {
      expect(l.text.startsWith("["), l.lineId).toBe(true);
      expect(l.text.endsWith("]"), l.lineId).toBe(true);
    }
  });

  it("every mirror line gates on a mirror_surface_{type}_passed flag", () => {
    for (const l of MIRROR_LINES) {
      const flags = l.unlockFlags ?? [];
      const hasMirrorFlag = flags.some((f) =>
        /^mirror_surface_(reflection|screen|pool|glass|polished_metal)_passed$/.test(
          f,
        ),
      );
      expect(hasMirrorFlag, l.lineId).toBe(true);
    }
  });

  it("every mirror line gates minAct ≥2 (canonical Acts-2+ canon)", () => {
    for (const l of MIRROR_LINES) {
      expect(l.minAct ?? 0, l.lineId).toBeGreaterThanOrEqual(2);
    }
  });

  it("every mirror line carries cooldownKey + maxPlays cap", () => {
    for (const l of MIRROR_LINES) {
      expect(l.cooldownKey, l.lineId).toBeDefined();
      expect(l.maxPlays, l.lineId).toBeDefined();
    }
  });

  it("mirror line ids are unique", () => {
    const ids = MIRROR_LINES.map((l) => l.lineId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Surface-type coverage (5 canonical types)", () => {
  const surfaceTypes = ["reflection", "screen", "pool", "glass", "polished_metal"];

  for (const type of surfaceTypes) {
    it(`covers ${type} surface (≥2 register variants)`, () => {
      const lines = MIRROR_LINES.filter((l) =>
        (l.unlockFlags ?? []).includes(`mirror_surface_${type}_passed`),
      );
      expect(lines.length, type).toBeGreaterThanOrEqual(2);
    });
  }
});

describe("Reveal-stage coverage across mirror surfaces", () => {
  it("Broadcast register represented across multiple surface-types", () => {
    const broadcast = MIRROR_LINES.filter(
      (l) => l.requiresRevealStage === "Broadcast",
    );
    expect(broadcast.length).toBeGreaterThanOrEqual(4);
  });

  it("Quiet register represented across multiple surface-types", () => {
    const quiet = MIRROR_LINES.filter(
      (l) => l.requiresRevealStage === "Quiet",
    );
    expect(quiet.length).toBeGreaterThanOrEqual(3);
  });

  it("Stolen / Real / Replacement registers each represented in at least one mirror line", () => {
    const stolen = MIRROR_LINES.filter(
      (l) => l.requiresRevealStage === "Stolen",
    );
    const real = MIRROR_LINES.filter((l) => l.requiresRevealStage === "Real");
    const replacement = MIRROR_LINES.filter(
      (l) => l.requiresRevealStage === "Replacement",
    );
    expect(stolen.length).toBeGreaterThanOrEqual(1);
    expect(real.length).toBeGreaterThanOrEqual(1);
    expect(replacement.length).toBeGreaterThanOrEqual(1);
  });
});

describe("Canonical 'I am here too' register lands per surface", () => {
  it("reflection.broadcast lands canonical 'reflection wears your face' canon", () => {
    const l = MIRROR_LINES.find(
      (x) => x.lineId === "meme.mirror.reflection.broadcast_register",
    );
    expect(l?.text).toMatch(/wears your face/i);
    expect(l?.text).toMatch(/I am here too/i);
  });

  it("screen.broadcast lands canonical 'MEMETIC' attention-hijack canon", () => {
    const l = MIRROR_LINES.find(
      (x) => x.lineId === "meme.mirror.screen.broadcast_register",
    );
    expect(l?.text).toMatch(/dead screen canonically flickers/i);
    expect(l?.text).toMatch(/MEMETIC/);
    expect(l?.text).toMatch(/remember.*without canonically remembering reading/i);
  });

  it("screen.real lands canonical 'small pink form' canonical truer-mirror register", () => {
    const l = MIRROR_LINES.find(
      (x) => x.lineId === "meme.mirror.screen.real_register",
    );
    expect(l?.text).toMatch(/small pink form/i);
    expect(l?.text).toMatch(/canonically smaller/i);
    expect(l?.text).toMatch(/canonically more honest/i);
    // canonical "screens are canonically the truer of the canonical mirror surfaces"
    expect(l?.text).toMatch(/truer of the canonical mirror surfaces/i);
  });

  it("pool.stolen lands canonical 'reflection is the Oracle's' canon", () => {
    const l = MIRROR_LINES.find(
      (x) => x.lineId === "meme.mirror.pool.stolen_register",
    );
    expect(l?.text).toMatch(/reflection in the pool is canonically not yours/i);
    expect(l?.text).toMatch(/the Oracle's/i);
    // canonical pink-glitch under-the-surface
    expect(l?.text).toMatch(/Pink-glitch under the surface/i);
  });

  it("glass.replacement lands canonical 'face you have not seen before' settling-into-permanence canon", () => {
    const l = MIRROR_LINES.find(
      (x) => x.lineId === "meme.mirror.glass.replacement_register",
    );
    expect(l?.text).toMatch(/face you have not seen before/i);
    expect(l?.text).toMatch(/Patient/);
    expect(l?.text).toMatch(/face does not glitch/i);
    expect(l?.text).toMatch(/canonically settling into permanence/i);
  });

  it("polished_metal.broadcast lands canonical 'distortion is canonically the truer rendering' canon", () => {
    const l = MIRROR_LINES.find(
      (x) =>
        x.lineId === "meme.mirror.polished_metal.broadcast_register",
    );
    expect(l?.text).toMatch(/polished-metal/i);
    expect(l?.text).toMatch(/curvature of the metal canonically distorts/i);
    expect(l?.text).toMatch(/distortion is canonically the truer rendering/i);
  });

  it("polished_metal.quiet lands canonical 'reflects nothing for a half-second' absence canon", () => {
    const l = MIRROR_LINES.find(
      (x) => x.lineId === "meme.mirror.polished_metal.quiet_register",
    );
    expect(l?.text).toMatch(/reflects nothing for a half-second/i);
    expect(l?.text).toMatch(/absence is the canonical/i);
    expect(l?.text).toMatch(/canonical Quiet register's 'I am here too'/i);
  });
});

describe("Tell #5 pink-glitch involuntary canon (§1.9)", () => {
  it("at least one Quiet-register mirror line includes canonical pink-glitch tell", () => {
    const quietLines = MIRROR_LINES.filter(
      (l) => l.requiresRevealStage === "Quiet",
    );
    const allQuietText = quietLines.map((l) => l.text).join(" ");
    expect(allQuietText).toMatch(/pink-glitch/i);
  });

  it("Stolen pool register includes canonical pink-glitch destabilisation canon", () => {
    const stolen = MIRROR_LINES.find(
      (x) => x.lineId === "meme.mirror.pool.stolen_register",
    );
    expect(stolen?.text).toMatch(/pink-glitch/i);
    expect(stolen?.text).toMatch(/disguise canonically destabilises/i);
  });
});

describe("§1.10 silence-shape protections (mirror-surface bank)", () => {
  const allText = MIRROR_LINES.map((l) => l.text).join(" ");

  it("§1.10: NO Mascot face / identity / construction in mirror surfaces", () => {
    expect(allText).not.toMatch(/Mascot was a (woman|man|child|ai|robot|creature)/i);
    expect(allText).not.toMatch(/Mascot's face was/i);
  });

  it("§1.10: NO standalone apologies in mirror surfaces", () => {
    expect(allText).not.toMatch(/\bI('m| am) sorry\b/i);
  });

  it("§1.10: NO 'father' / first-person 'partner' from Meme in mirror surfaces", () => {
    expect(allText).not.toMatch(/\bI call him father\b/i);
    expect(allText).not.toMatch(/\bmy father\b/i);
  });
});

describe("§1.8 cadence canon — Meme canonically at one remove", () => {
  it("every mirror line canonically renders at one remove (visual / through-surface canon)", () => {
    // canonical: §1.8 cadence rule — Meme is canonically not in the
    // same room as the player, always at one remove. Mirror lines
    // canonically respect this — the Meme is reflected, watched
    // from inside, broadcast through, leaked through; never directly
    // present.
    for (const l of MIRROR_LINES) {
      // canonical: bracketed visual register format means the Meme
      // is canonically described from outside, not speaking from
      // inside the room.
      expect(l.text.startsWith("["), l.lineId).toBe(true);
    }
  });
});

describe("§1.11 metaphor-source canon (mirror-surface bank)", () => {
  const allText = MIRROR_LINES.map((l) => l.text).join(" ");

  it("§1.11: canonical mirror / face / surface / reflection vocabulary lands", () => {
    expect(allText).toMatch(/(reflection|surface|mirror|face|screen|pool|glass)/i);
  });

  it("§1.11: NO chess / commerce / combat metaphors in mirror surfaces", () => {
    expect(allText).not.toMatch(/\b(checkmate|knight|pawn|battle|weapon|market|inventory)\b/i);
  });
});
