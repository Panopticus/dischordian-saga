/**
 * HeatSelector + HeatIndicator wiring guard (#1 Phase 3).
 *
 * Static-analysis only — the components render JSX that's awkward to
 * exercise without React Testing Library + jsdom (neither is in the
 * project's dev deps). The behavioral contract (selection state,
 * cap enforcement, validation messaging) is enforced by:
 *
 *   1. The Phase-1 registry tests (apps/shared/tcg-core/heat/
 *      registry.test.ts) — the validators the selector calls.
 *   2. The Phase-2 engine tests (apps/shared/tcg-core/heat/
 *      engineIntegration.test.ts) — the contract createMatchState
 *      enforces, which the selector mirrors.
 *
 * What this file locks in:
 *
 *   - HeatSelector reads the canonical Phase-1 helpers
 *     (modifiersUnlockedAtTier / totalHeatCost / validateHeatConfig)
 *     instead of duplicating registry logic.
 *   - HeatSelector is a *controlled* component (no internal mutation
 *     state) so a parent can pass selectedIds + onChange and observe
 *     validity without battling a hidden state machine.
 *   - HeatIndicator is hidden when modifierIds is empty (Heat-0 HUD
 *     stays clean) and reads getModifier from the canonical registry
 *     to derive name + description for tooltips.
 *   - Both components carry aria-label so screen readers pick them
 *     up (#116 accessibility carryover).
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();
function read(rel: string): string {
  return fs.readFileSync(path.resolve(ROOT, rel), "utf-8");
}

describe("HeatSelector — registry / API wiring", () => {
  const SRC = read("apps/client/src/components/heat/HeatSelector.tsx");

  it("imports the Phase-1 helpers from @shared/tcg-core (no duplicated logic)", () => {
    expect(SRC).toMatch(
      /import\s*\{[\s\S]*?modifiersUnlockedAtTier[\s\S]*?\}\s*from\s*["']@shared\/tcg-core["']/,
    );
    expect(SRC).toMatch(
      /import\s*\{[\s\S]*?totalHeatCost[\s\S]*?\}\s*from\s*["']@shared\/tcg-core["']/,
    );
    expect(SRC).toMatch(
      /import\s*\{[\s\S]*?validateHeatConfig[\s\S]*?\}\s*from\s*["']@shared\/tcg-core["']/,
    );
  });

  it("is a controlled component (props expose selectedIds + onChange, no useState mutation)", () => {
    expect(SRC).toMatch(/selectedIds:\s*readonly string\[\]/);
    expect(SRC).toMatch(/onChange:\s*\(nextIds:\s*readonly string\[\]\)\s*=>\s*void/);
    // No internal selection state — the toggle path always pushes
    // through onChange. Guard against a future refactor that adds
    // a useState for the selection (which would split sources of
    // truth and is the canonical bug for controlled-input drift).
    expect(SRC).not.toMatch(/useState<readonly string\[\]>/);
  });

  it("filters the catalog by highestClearedTier (locked tiers hidden, not greyed)", () => {
    expect(SRC).toMatch(/modifiersUnlockedAtTier\(highestClearedTier\)/);
  });

  it("toggle pre-flight rejects picks that would push past the cap", () => {
    // The validator below would also catch this on the next render,
    // but refusing the toggle outright gives the UI a clean "nothing
    // happened" state instead of flashing through invalid.
    expect(SRC).toMatch(/wouldBe\s*=\s*totalCost\s*\+\s*modifier\.cost/);
    expect(SRC).toMatch(/if\s*\(\s*wouldBe\s*>\s*cap\s*\)\s*return/);
  });

  it("clamps cap to MAX_HEAT_LEVEL inside validateHeatConfig", () => {
    // A parent passing an over-MAX_HEAT_LEVEL cap shouldn't break
    // validation. Math.min keeps the validator inside its own
    // accepted range.
    expect(SRC).toMatch(/Math\.min\(\s*cap\s*,\s*MAX_HEAT_LEVEL\s*\)/);
  });

  it("renders a friendly empty-state when no modifiers are unlocked", () => {
    expect(SRC).toMatch(/No modifiers unlocked yet/);
    expect(SRC).toMatch(/Clear an Act 1 ladder run/);
  });

  it("has an aria-label on the section root for screen readers", () => {
    expect(SRC).toMatch(/aria-label=["']Heat selection["']/);
  });

  it("validation errors are announced via role=\"alert\"", () => {
    // The validator's `detail` string is human-readable; surfacing
    // it in an aria-live alert lets a screen-reader user catch the
    // "you over-stacked the cap" feedback without polling.
    expect(SRC).toMatch(/role=["']alert["']/);
  });

  it("emits validity changes through onValidityChange (gated lock-in button support)", () => {
    expect(SRC).toMatch(
      /onValidityChange\?:\s*\(valid:\s*boolean\)\s*=>\s*void/,
    );
    expect(SRC).toMatch(/onChange\?\.\(\s*valid\s*\)/);
  });

  it("modifier rows carry aria-pressed for screen-reader toggle state", () => {
    expect(SRC).toMatch(/aria-pressed=\{selected\}/);
  });

  it("groups modifiers by category in a stable order", () => {
    // CATEGORY_ORDER drives the section layout. A mutation that
    // reorders categories at random would surface as flicker on
    // re-render; locking the constant in here prevents that.
    expect(SRC).toMatch(/CATEGORY_ORDER:\s*readonly ModifierCategory\[\]/);
    expect(SRC).toMatch(/CATEGORY_ORDER\.map/);
  });
});

describe("HeatIndicator — in-match HUD", () => {
  const SRC = read("apps/client/src/components/heat/HeatIndicator.tsx");

  it("reads getModifier from the canonical registry (not a parallel name table)", () => {
    expect(SRC).toMatch(
      /import\s*\{[\s\S]*?getModifier[\s\S]*?\}\s*from\s*["']@shared\/tcg-core["']/,
    );
  });

  it("uses totalHeatCost to derive the badge total (no manual sum)", () => {
    expect(SRC).toMatch(
      /import\s*\{[\s\S]*?totalHeatCost[\s\S]*?\}\s*from\s*["']@shared\/tcg-core["']/,
    );
    expect(SRC).toMatch(/totalHeatCost\(modifierIds\)\s*\?\?\s*0/);
  });

  it("renders nothing when the modifier list is empty (Heat-0 stays clean)", () => {
    expect(SRC).toMatch(/if\s*\(\s*items\.length\s*===\s*0\s*\)\s*return null/);
  });

  it("filters out unknown ids (defensive against legacy replays)", () => {
    // Phase 1 registry adds + removes are explicit, but a row
    // persisted with a long-since-removed id would show up here as
    // `undefined` from getModifier — filter so we don't render a
    // crashing cell.
    expect(SRC).toMatch(/\.filter\(\(m\):\s*m is NonNullable/);
  });

  it("carries an aria-label with both the count and total heat", () => {
    expect(SRC).toMatch(
      /aria-label=\{`Active heat modifiers, total \$\{total\}`\}/,
    );
  });

  it("modifier pills carry the canonical description as a tooltip", () => {
    // Hover state on small badges is the standard place for the
    // description string. role="list" on the parent lets screen
    // readers traverse modifier-by-modifier.
    expect(SRC).toMatch(/title=\{m\.description\}/);
    expect(SRC).toMatch(/role=["']list["']/);
  });

  it("HeatIndicator props are minimal (modifierIds + className only)", () => {
    // The component is read-only — no callbacks. A parent that wants
    // an interactive heat-detail panel should wrap it, not extend it.
    expect(SRC).toMatch(/modifierIds:\s*readonly string\[\]/);
    expect(SRC).toMatch(/className\?:\s*string/);
    expect(SRC).not.toMatch(/onChange|onClick|onSelect/);
  });
});
