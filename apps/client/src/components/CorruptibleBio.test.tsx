/**
 * Structural tests for CorruptibleBio.
 *
 * The component depends on tRPC + React Query + the Palimpsest
 * shared module. Rather than mock all of that for a render test,
 * we source-scan the component to verify the new editId / Shadow
 * Tongue path is wired and won't silently regress.
 *
 * Behavioural tests for the ST-edit gating (isEditActive, etc.)
 * live on the pure helpers in apps/shared/shadowTongueEdits.test.ts.
 */
import * as fs from "fs";
import * as path from "path";
import { describe, expect, it } from "vitest";
import { CorruptibleBio } from "./CorruptibleBio";

describe("CorruptibleBio", () => {
  it("exports the component as a named export", () => {
    expect(CorruptibleBio).toBeDefined();
    expect(typeof CorruptibleBio).toBe("function");
  });
});

describe("CorruptibleBio — Shadow Tongue editId wiring", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "CorruptibleBio.tsx"),
    "utf-8",
  );

  it("imports the useShadowTongueState hook", () => {
    expect(src).toContain("useShadowTongueState");
    expect(src).toContain('from "@/hooks/useShadowTongueState"');
  });

  it("accepts an optional editId prop", () => {
    expect(src).toMatch(/editId\?\s*:\s*string/);
  });

  it("calls isEditActive(editId) when editId is set", () => {
    expect(src).toContain("isEditActive(editId)");
  });

  it("OR-combines palimpsest + ST corruption sources", () => {
    expect(src).toMatch(/palimpsestCorrupted\s*\|\|\s*stCorrupted/);
  });

  it("uses editId as the corruption seed when set", () => {
    // Otherwise every ST-edited entry sharing an entryId would
    // crossout identically — the seed must derive from editId
    // so two different artifacts under the same Loredex entry
    // produce visibly distinct corruption patterns.
    expect(src).toMatch(/seed\s*=\s*editId\s*\?\?\s*entryId/);
  });

  it("emits data-corruption-source telemetry attribute", () => {
    expect(src).toContain("data-corruption-source");
    expect(src).toContain("shadow-tongue-edit");
    expect(src).toContain("palimpsest");
  });

  it("emits data-edit-id when an ST edit is applied", () => {
    expect(src).toContain("data-edit-id");
  });

  it("preserves the existing palimpsest path (back-compat)", () => {
    // The existing 5 callers (Home, WatchPage, etc.) pass no
    // editId — they must keep rendering crossouts purely from
    // the global palimpsest meter.
    expect(src).toContain("usePalimpsest");
    expect(src).toContain("isEntryCorrupted");
  });
});

describe("CorruptibleBio — useShadowTongueState hook is well-formed", () => {
  const src = fs.readFileSync(
    path.resolve(__dirname, "..", "hooks", "useShadowTongueState.ts"),
    "utf-8",
  );

  it("queries getShadowTongueState through tRPC", () => {
    expect(src).toContain("trpc.epochWitness.getShadowTongueState.useQuery");
  });

  it("exposes isEditActive + isArtifactEdited helpers", () => {
    expect(src).toContain("isEditActive:");
    expect(src).toContain("isArtifactEdited:");
  });

  it("re-runs parseActiveEdits defensively on the wire payload", () => {
    expect(src).toContain("parseActiveEdits");
  });

  it("uses a 15-second stale window matched to player-paced ST edits", () => {
    expect(src).toContain("15_000");
  });

  it("returns sane defaults during loading (never undefined)", () => {
    expect(src).toContain("DEFAULT_STATE");
    expect(src).toContain("activeEdits: {}");
  });
});
