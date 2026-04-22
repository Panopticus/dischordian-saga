/**
 * Flag-bridge tests for Dead Man's Circuit (DMC) and The Degen Casino.
 *
 * The canonical Act 4.5 completion gate (`apps/shared/act4_5CompletionGate.ts`
 * + DEAD_MANS_CIRCUIT_TRACKS in `apps/shared/actsFourFiveShells.ts`) reads
 * two narrative flags:
 *   - `act_4_5_circuit_complete`
 *   - `act_4_5_casino_complete`
 *
 * The underlying gameplay has its own canonical flag names per
 * WITNESSING_NARRATIVE_PROPOSAL §10.1 (`dead_mans_circuit_complete`,
 * `player_identity_chain_authored`). This test asserts the server
 * router writes BOTH names so the existing canon stays intact AND the
 * new gate fires.
 *
 * Source-scan style: this is a structural contract test — it doesn't
 * spin up a database or hit the real mutation. The flag-write lines
 * MUST appear literally in the server router source. If they're
 * removed, the gate silently regresses and Act 4.5 becomes
 * unreachable through organic play.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const routerSrc = fs.readFileSync(
  path.resolve(__dirname, "../server/routers/deadMansCircuit.ts"),
  "utf-8",
);

describe("DMC server router — Circuit completion flag bridge", () => {
  it("writes the legacy WITNESSING §10.1 flag name", () => {
    expect(routerSrc).toContain("dead_mans_circuit_complete: true");
  });

  it("ALSO writes the canonical Act 4.5 gate flag name", () => {
    // act_4_5_circuit_complete is what DEAD_MANS_CIRCUIT_TRACKS
    // declares as the Circuit track's completedFlag. The Act 4.5
    // gate reads this name.
    expect(routerSrc).toContain("act_4_5_circuit_complete: true");
  });

  it("still writes the identity-chain canonical companion flag", () => {
    expect(routerSrc).toContain("player_identity_chain_authored: true");
  });
});

describe("DMC server router — Casino completion flag bridge", () => {
  it("wires claimSideQuest('the_degens_wager') to act_4_5_casino_complete", () => {
    // The canonical "completed the Degen Casino" event is claiming
    // the_degens_wager side quest. This test asserts the bridge:
    // the flag write lives in the claim path AND is keyed on the
    // specific quest key so it can't fire off other side-quest
    // claims.
    expect(routerSrc).toContain("act_4_5_casino_complete");
    expect(routerSrc).toMatch(/input\.questKey\s*===\s*["']the_degens_wager["']/);
  });

  it("guards against re-writing the casino flag when already set", () => {
    // Idempotency matters: if the player re-claims (or a concurrent
    // request races), the flag should only be written once.
    expect(routerSrc).toMatch(/!prevFlags\.act_4_5_casino_complete/);
  });
});

describe("Act 4.5 gate + bridge alignment", () => {
  it("DEAD_MANS_CIRCUIT_TRACKS names match what the bridge writes", async () => {
    const mod = await import("./actsFourFiveShells");
    const tracks = mod.DEAD_MANS_CIRCUIT_TRACKS;
    const circuit = tracks.find((t) => t.id === "the_circuit");
    const casino = tracks.find((t) => t.id === "the_casino");
    expect(circuit?.completedFlag).toBe("act_4_5_circuit_complete");
    expect(casino?.completedFlag).toBe("act_4_5_casino_complete");
  });

  it("Act 4.5 gate's required flag names match the bridge writes", async () => {
    const mod = await import("./act4_5CompletionGate");
    expect(mod.ACT_4_5_TRACK_FLAGS).toContain("act_4_5_circuit_complete");
    expect(mod.ACT_4_5_TRACK_FLAGS).toContain("act_4_5_casino_complete");
  });
});
