// F13 scheduler unit tests.

import { describe, it, expect, beforeEach } from "vitest";
import {
  enqueue,
  dismiss,
  getActive,
  setContext,
  getContext,
  flush,
  __resetSchedulerForTests,
} from "./companionScheduler";

describe("companionScheduler", () => {
  beforeEach(() => {
    __resetSchedulerForTests();
    // Set context so lucid-band lines pass gate checks by default.
    setContext({
      elaraStability: 10,
      humanLight: -20,
      flags: new Set(),
      act: 0,
    });
  });

  it("enqueues a known line and makes it active", () => {
    const ok = enqueue("awake_step_emergence");
    expect(ok).toBe(true);
    expect(getActive()?.lineId).toBe("awake_step_emergence");
  });

  it("rejects unknown lineIds", () => {
    const ok = enqueue("nonexistent_line_12345");
    expect(ok).toBe(false);
    expect(getActive()).toBeNull();
  });

  it("priority 3 preempts active priority 2", () => {
    // cryo_orient_01_lucid is priority 2; cine_close_lucid_01 is priority 3.
    enqueue("cryo_orient_01_lucid");
    expect(getActive()?.lineId).toBe("cryo_orient_01_lucid");
    enqueue("cine_close_lucid_01");
    expect(getActive()?.lineId).toBe("cine_close_lucid_01");
  });

  it("dismiss advances to the next queued line", () => {
    enqueue("cryo_orient_01_lucid");
    enqueue("cryo_orient_02_lucid");
    // Only first is active (equal priority queues behind).
    expect(getActive()?.lineId).toBe("cryo_orient_01_lucid");
    dismiss();
    expect(getActive()?.lineId).toBe("cryo_orient_02_lucid");
    dismiss();
    expect(getActive()).toBeNull();
  });

  it("applies stability delta on dismiss", () => {
    // tut_first_steps_fs9_lucid grants +1 stability.
    const before = getContext().elaraStability;
    enqueue("tut_first_steps_fs9_lucid");
    dismiss();
    expect(getContext().elaraStability).toBe(before + 1);
  });

  it("band gate filters out luminous lines when stability is lucid", () => {
    const ok = enqueue("cine_close_luminous_01");
    expect(ok).toBe(false);
  });

  it("band gate admits luminous lines once stability crosses 40", () => {
    setContext({ elaraStability: 45, humanLight: -20, flags: new Set(), act: 0 });
    const ok = enqueue("cine_close_luminous_01");
    expect(ok).toBe(true);
  });

  it("cooldownKey blocks repeat enqueues of the same key", () => {
    enqueue("cryo_orient_01_lucid");
    dismiss();
    const ok = enqueue("cryo_orient_01_lucid");
    // Should be rejected by cooldown (same cooldownKey within 30s).
    expect(ok).toBe(false);
  });

  it("flush clears active and queue", () => {
    enqueue("cryo_orient_01_lucid");
    enqueue("cryo_orient_02_lucid");
    flush();
    expect(getActive()).toBeNull();
  });

  it("speaker routing: human lines carry speaker = human", () => {
    // Shadow is the default band; human_first_words_shadow is priority 3.
    enqueue("human_first_words_shadow");
    expect(getActive()?.speaker).toBe("human");
  });

  it("banded lineId with _* suffix resolves to the current band variant", () => {
    // locked_medbay_prelude_* → locked_medbay_prelude_lucid at default.
    const ok = enqueue("locked_medbay_prelude_*");
    expect(ok).toBe(true);
    expect(getActive()?.lineId).toBe("locked_medbay_prelude_lucid");
  });

  it("clamps stability to [-100, 100]", () => {
    setContext({ elaraStability: 99, humanLight: 0, flags: new Set(), act: 0 });
    // tut_first_steps_fs9_fragmented would add +3, but we're lucid so it
    // fails gate; use the lucid one which adds +1.
    enqueue("tut_first_steps_fs9_lucid");
    dismiss();
    // 99 + 1 = 100 (at the cap).
    expect(getContext().elaraStability).toBe(100);
  });
});
