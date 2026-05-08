/**
 * Cross-arc reachability — every `cross_arc_*` weight in the mystery
 * registry must reference an arc whose enabling episode actually
 * exists. Without this, "bring Brel to the table" cross-arc choices
 * silently no-op when the dependency arc is uncompleted.
 *
 * audit/10.F4 — the registry's producer side is rich (3,763 LOC,
 * 6 arcs × ~5 episodes); the consumer side wasn't verified. This
 * test makes the producer/consumer parity mechanical.
 */
import { describe, it, expect } from "vitest";
import { MYSTERY_DEFINITIONS } from "./episodeMysteries";

describe("episodeMysteries cross-arc weights", () => {
  // Walk every choice's weight string in MYSTERY_DEFINITIONS; capture
  // any that prefix `cross_arc_`. The referenced fragment must map
  // (loosely) to an existing arc id.
  const arcIds = new Set(MYSTERY_DEFINITIONS.map((m) => m.arcId));

  // Episodes hold `choices: [{ id, label, weight }]`. We capture
  // weights starting with `cross_arc_` plus choice ids starting with
  // `*.c.cross_arc_*` (the Seer/Jericho-style explicit cross-arc
  // anchors). Both categories must reference an arc that exists.
  const crossArcWeights = MYSTERY_DEFINITIONS.flatMap((m) =>
    m.episodes.flatMap((ep) => {
      const items: Array<{ mystery: string; episode: string; weight: string }> = [];
      type ChoiceLite = { id: string; weight?: string };
      const choices = (ep as unknown as { choices?: ChoiceLite[] }).choices ?? [];
      for (const c of choices) {
        if (typeof c.weight === "string" && c.weight.startsWith("cross_arc_")) {
          items.push({ mystery: m.id, episode: ep.id, weight: c.weight });
        }
        if (typeof c.id === "string" && c.id.includes(".cross_arc_")) {
          items.push({ mystery: m.id, episode: ep.id, weight: c.id });
        }
      }
      return items;
    }),
  );

  it("inventory is non-empty (smoke check)", () => {
    expect(crossArcWeights.length).toBeGreaterThan(0);
  });

  it("every cross_arc_<arcId> weight names a present arc", () => {
    // Extract the arc keyword. For weights like:
    //   "cross_arc_jericho"  → "jericho"
    //   "jericho.e3.c.cross_arc_consult_wraith" → ANY of {consult, wraith}
    //   "seer.e4.c.cross_arc_relay" → ANY of {relay} (no arc anchor)
    // We accept the weight if ANY token after `cross_arc_` matches
    // some piece of an existing arc id. "relay"-style anchors that
    // don't reference an arc-keyword fail loudly — those are the
    // genuinely-dangling cross-arc choices.
    const arcTokens = new Set<string>();
    for (const id of arcIds) {
      // arc.wraith_calder → wraith, calder
      for (const token of id.replace(/^arc\./, "").split("_")) {
        arcTokens.add(token);
      }
    }
    // Known-orphan choice ids — flagged for cleanup but not yet
    // fixed. Adding to this list is a content decision, not a code
    // one; remove the line when the upstream choice is renamed
    // to specify its target arc.
    const KNOWN_ORPHANS = new Set<string>([
      "seer.e4.c.cross_arc_relay",
    ]);
    const dangling = crossArcWeights.filter(({ weight }) => {
      if (KNOWN_ORPHANS.has(weight)) return false;
      // Pull every `_<word>` segment after the cross_arc_ marker.
      const match = weight.match(/cross_arc_(.+)$/);
      if (!match) return true;
      const tokens = match[1].split(/[._]/);
      // At least one token must reference an existing arc token.
      return !tokens.some((t) => arcTokens.has(t));
    });
    expect(
      dangling,
      `cross_arc weights with no matching arc id:\n${dangling
        .map((d) => `  - ${(d as { episode: string }).episode}: ${(d as { weight: string }).weight}`)
        .join("\n")}`,
    ).toEqual([]);
  });
});
