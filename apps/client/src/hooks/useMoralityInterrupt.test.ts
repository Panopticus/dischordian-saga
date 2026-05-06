import { describe, it, expect } from "vitest";
import {
  INITIAL_INTERRUPT_STATE,
  armInterrupt,
  commitInterrupt,
  resetInterrupt,
  tickInterrupt,
} from "./useMoralityInterrupt";

describe("interrupt state machine", () => {
  it("starts idle", () => {
    expect(INITIAL_INTERRUPT_STATE.status).toBe("idle");
    expect(INITIAL_INTERRUPT_STATE.remainingMs).toBe(0);
    expect(INITIAL_INTERRUPT_STATE.committedSide).toBeNull();
  });

  it("arm sets status=armed and the full window", () => {
    const s = armInterrupt(2000);
    expect(s.status).toBe("armed");
    expect(s.remainingMs).toBe(2000);
  });

  it("arm clamps negative durations to 0", () => {
    expect(armInterrupt(-100).remainingMs).toBe(0);
  });

  it("tick decrements an armed window", () => {
    const armed = armInterrupt(2000);
    const after = tickInterrupt(armed, 500);
    expect(after.status).toBe("armed");
    expect(after.remainingMs).toBe(1500);
  });

  it("tick does nothing when idle", () => {
    expect(tickInterrupt(INITIAL_INTERRUPT_STATE, 500)).toEqual(INITIAL_INTERRUPT_STATE);
  });

  it("tick transitions armed → expired when window runs out", () => {
    const armed = armInterrupt(100);
    const after = tickInterrupt(armed, 200);
    expect(after.status).toBe("expired");
    expect(after.remainingMs).toBe(0);
    expect(after.committedSide).toBeNull();
  });

  it("commit transitions armed → committed with the chosen side", () => {
    const armed = armInterrupt(2000);
    const orderCommit = commitInterrupt(armed, "order");
    expect(orderCommit.status).toBe("committed");
    expect(orderCommit.committedSide).toBe("order");
    expect(orderCommit.remainingMs).toBe(0);

    const chaosCommit = commitInterrupt(armed, "chaos");
    expect(chaosCommit.committedSide).toBe("chaos");
  });

  it("commit is a no-op once expired", () => {
    const expired = tickInterrupt(armInterrupt(50), 100);
    const after = commitInterrupt(expired, "order");
    expect(after).toBe(expired);
  });

  it("commit is a no-op once already committed", () => {
    const armed = armInterrupt(2000);
    const first = commitInterrupt(armed, "order");
    const second = commitInterrupt(first, "chaos");
    expect(second.committedSide).toBe("order"); // first commit wins
  });

  it("reset returns to idle from any state", () => {
    expect(resetInterrupt().status).toBe("idle");
  });

  it("a full lifecycle: arm → tick partway → commit", () => {
    let s = armInterrupt(2000);
    s = tickInterrupt(s, 500); // 1500 left
    s = tickInterrupt(s, 500); // 1000 left
    expect(s.remainingMs).toBe(1000);
    s = commitInterrupt(s, "chaos");
    expect(s.status).toBe("committed");
    expect(s.committedSide).toBe("chaos");
  });

  it("a full lifecycle: arm → expire (no commit)", () => {
    let s = armInterrupt(500);
    s = tickInterrupt(s, 200);
    s = tickInterrupt(s, 200);
    s = tickInterrupt(s, 200); // exceeds window
    expect(s.status).toBe("expired");
  });
});
