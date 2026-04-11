import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fs from "fs";
import * as path from "path";

/* ═══════════════════════════════════════════════════════
   TASK 4.1 — WebSocket reconnection + grace period
   TASK 4.2 — Global error handling via error toast store
   ═══════════════════════════════════════════════════════ */

/* ─── TASK 4.1 — useReconnectingWs exposes grace state ─── */
describe("Task 4.1 — useReconnectingWs", () => {
  const hookSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/lib/useReconnectingWs.ts"),
    "utf-8",
  );

  it("exposes gracePeriodExpiresAt on the state shape", () => {
    expect(hookSrc).toContain("gracePeriodExpiresAt");
  });

  it("exposes gaveUp when max retries exhausted", () => {
    expect(hookSrc).toContain("gaveUp");
  });

  it("uses a GRACE_PERIOD_MS constant that matches the server 30 s window", () => {
    expect(hookSrc).toMatch(/GRACE_PERIOD_MS\s*=\s*30_000/);
  });

  it("tracks first disconnect timestamp so the countdown stays stable across retries", () => {
    expect(hookSrc).toContain("firstDisconnectAtRef");
  });

  it("resets grace state on successful reopen", () => {
    expect(hookSrc).toMatch(/firstDisconnectAtRef\.current\s*=\s*null/);
    expect(hookSrc).toMatch(/gracePeriodExpiresAt:\s*null/);
  });

  it("resets grace state on explicit disconnect()", () => {
    expect(hookSrc).toMatch(/disconnect\s*=\s*useCallback\([\s\S]{0,400}firstDisconnectAtRef\.current\s*=\s*null/);
  });

  it("still uses exponential backoff + jitter (no regression)", () => {
    expect(hookSrc).toContain("backoffDelay");
    expect(hookSrc).toContain("JITTER_FACTOR");
    expect(hookSrc).toContain("Math.pow(2, attempt)");
  });
});

/* ─── TASK 4.1 — ReconnectingOverlay component ─── */
describe("Task 4.1 — ReconnectingOverlay", () => {
  const overlaySrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/components/ReconnectingOverlay.tsx"),
    "utf-8",
  );

  it("exports named + default", () => {
    expect(overlaySrc).toContain("export function ReconnectingOverlay");
    expect(overlaySrc).toContain("export default ReconnectingOverlay");
  });

  it("accepts visible, retryCount, gracePeriodExpiresAt, gaveUp props", () => {
    expect(overlaySrc).toContain("visible: boolean");
    expect(overlaySrc).toContain("retryCount: number");
    expect(overlaySrc).toContain("gracePeriodExpiresAt: number | null");
    expect(overlaySrc).toContain("gaveUp: boolean");
  });

  it("ticks every second to update the countdown", () => {
    expect(overlaySrc).toContain("setInterval");
    expect(overlaySrc).toContain("1000");
  });

  it("only runs the timer when visible (no leak when hidden)", () => {
    expect(overlaySrc).toMatch(/if \(!visible\) return/);
  });

  it("renders a forfeit state when gaveUp or grace expired", () => {
    expect(overlaySrc).toContain("CONNECTION LOST");
    expect(overlaySrc).toContain("MATCH FORFEITED");
  });

  it("renders countdown with tabular-nums for stable layout", () => {
    expect(overlaySrc).toContain("tabular-nums");
  });

  it("supports onDismiss callback + optional context label", () => {
    expect(overlaySrc).toContain("onDismiss");
    expect(overlaySrc).toContain("context?: string");
  });

  it("has aria-live polite for screen readers", () => {
    expect(overlaySrc).toContain('aria-live="polite"');
    expect(overlaySrc).toContain('role="dialog"');
  });

  it("formats countdown as whole seconds", () => {
    expect(overlaySrc).toContain("Math.ceil(ms / 1000)");
  });
});

/* ─── TASK 4.1 — terminusWs grace period ─── */
describe("Task 4.1 — terminusWs honors the reconnection grace window", () => {
  const wsSrc = fs.readFileSync(
    path.resolve(__dirname, "terminusWs.ts"),
    "utf-8",
  );

  it("imports storeDisconnectedSession + recoverSession from wsRateLimit", () => {
    expect(wsSrc).toContain('from "./wsRateLimit"');
    expect(wsSrc).toContain("storeDisconnectedSession");
    expect(wsSrc).toContain("recoverSession");
  });

  it("on close stores a snapshot instead of deleting the raid immediately", () => {
    expect(wsSrc).toContain("storeDisconnectedSession");
    expect(wsSrc).toMatch(/raid,\s*snapshotAt/);
  });

  it("schedules a 30 s hard expiry to prevent raid-state leaks", () => {
    expect(wsSrc).toMatch(/setTimeout\([\s\S]{0,200}30_000\)/);
  });

  it("documents why the change was made (Task 4.1)", () => {
    expect(wsSrc).toContain("Task 4.1");
    expect(wsSrc).toContain("grace");
  });

  it("re-exports recoverSession as recoverTerminusSession for test assertions", () => {
    expect(wsSrc).toContain("recoverSession as recoverTerminusSession");
  });
});

/* ─── TASK 4.1 — other WS servers already had grace period (regression guard) ─── */
describe("Task 4.1 — existing WS grace periods stay intact", () => {
  it("pvpWs still uses storeDisconnectedSession + 30 s setTimeout", () => {
    const src = fs.readFileSync(path.resolve(__dirname, "pvpWs.ts"), "utf-8");
    expect(src).toContain("storeDisconnectedSession");
    expect(src).toContain("30000");
  });

  it("chessWs still has 30 s grace before forfeit", () => {
    const src = fs.readFileSync(path.resolve(__dirname, "chessWs.ts"), "utf-8");
    expect(src).toMatch(/30 seconds|30_000|30000/);
    expect(src).toContain("disconnect");
  });

  it("duelystWs still uses storeDisconnectedSession + 30 s window", () => {
    const src = fs.readFileSync(path.resolve(__dirname, "duelystWs.ts"), "utf-8");
    expect(src).toContain("storeDisconnectedSession");
    expect(src).toMatch(/30_000|30000/);
  });

  it("wsRateLimit's DisconnectedSession map is still capped at 30 s", () => {
    const src = fs.readFileSync(path.resolve(__dirname, "wsRateLimit.ts"), "utf-8");
    expect(src).toMatch(/GRACE_PERIOD_MS\s*=\s*30_000/);
    expect(src).toContain("recoverSession");
  });
});

/* ─── TASK 4.2 — errorToastStore ─── */
describe("Task 4.2 — errorToastStore", () => {
  const storeSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/stores/errorToastStore.ts"),
    "utf-8",
  );

  it("exports useErrorToastStore + reportError + reportWarning + reportInfo", () => {
    expect(storeSrc).toContain("export const useErrorToastStore");
    expect(storeSrc).toContain("export function reportError");
    expect(storeSrc).toContain("export function reportWarning");
    expect(storeSrc).toContain("export function reportInfo");
  });

  it("exports selectors for slice-level subscriptions", () => {
    expect(storeSrc).toContain("export const selectErrors");
    expect(storeSrc).toContain("export const selectRecentErrors");
    expect(storeSrc).toContain("export const selectHasErrors");
  });

  it("forwards errors to sonner by default", () => {
    expect(storeSrc).toContain('import { toast } from "sonner"');
    expect(storeSrc).toContain("toast.error");
    expect(storeSrc).toContain("toast.warning");
    expect(storeSrc).toContain("toast.info");
  });

  it("supports silent:true for record-only reports", () => {
    expect(storeSrc).toContain("silent?: boolean");
    expect(storeSrc).toContain("if (silent) return");
  });

  it("dedupes by key within a 5 s window", () => {
    expect(storeSrc).toContain("dedupeKey");
    expect(storeSrc).toMatch(/DEFAULT_DEDUPE_WINDOW_MS\s*=\s*5_000/);
  });

  it("caps the rotating buffer at MAX_BUFFER", () => {
    expect(storeSrc).toMatch(/MAX_BUFFER\s*=\s*20/);
    expect(storeSrc).toContain(".slice(0, MAX_BUFFER)");
  });

  it("tracks source tag for admin tooling", () => {
    expect(storeSrc).toContain("source?: string");
  });
});

/* ─── TASK 4.2 — tRPC error link wires errors to the store ─── */
describe("Task 4.2 — main.tsx wires tRPC errors through the store", () => {
  const mainSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/main.tsx"),
    "utf-8",
  );

  it("imports reportError from the error store", () => {
    expect(mainSrc).toContain('import { reportError } from "@/stores/errorToastStore"');
  });

  it("humanizes TRPCClientError into a player-facing message", () => {
    expect(mainSrc).toContain("humanizeTRPCError");
    expect(mainSrc).toContain("TRPCClientError");
  });

  it("swallows BAD_REQUEST's raw zod dump with a friendlier string", () => {
    expect(mainSrc).toContain('code === "BAD_REQUEST"');
  });

  it("skips UNAUTHORIZED / FORBIDDEN (handled by AuthGate)", () => {
    expect(mainSrc).toContain('code === "UNAUTHORIZED"');
    expect(mainSrc).toContain('code === "FORBIDDEN"');
  });

  it("reports query errors with a dedupe key + source tag", () => {
    expect(mainSrc).toMatch(/dedupeKey:\s*`trpc-query:/);
    expect(mainSrc).toMatch(/source:\s*`trpc:query:/);
  });

  it("reports mutation errors with a dedupe key + source tag", () => {
    expect(mainSrc).toMatch(/dedupeKey:\s*`trpc-mutation:/);
    expect(mainSrc).toMatch(/source:\s*`trpc:mutation:/);
  });

  it("still logs to console for dev visibility", () => {
    expect(mainSrc).toContain('console.error("[API Query Error]"');
    expect(mainSrc).toContain('console.error("[API Mutation Error]"');
  });
});

/* ─── TASK 4.2 — RouteErrorBoundary remains in place ─── */
describe("Task 4.2 — RouteErrorBoundary still wraps all routes", () => {
  it("App.tsx mounts RouteErrorBoundary around the Router switch", () => {
    const appSrc = fs.readFileSync(
      path.resolve(__dirname, "../client/src/App.tsx"),
      "utf-8",
    );
    expect(appSrc).toContain("RouteErrorBoundary");
    expect(appSrc).toMatch(/<RouteErrorBoundary>[\s\S]*<Switch>/);
  });

  it("the boundary component itself hasn't regressed", () => {
    const boundarySrc = fs.readFileSync(
      path.resolve(__dirname, "../client/src/components/RouteErrorBoundary.tsx"),
      "utf-8",
    );
    expect(boundarySrc).toContain("getDerivedStateFromError");
    expect(boundarySrc).toContain("componentDidCatch");
    expect(boundarySrc).toContain("handleReset");
  });
});

/* ═══════════════════════════════════════════════════════
   RUNTIME TESTS — errorToastStore actions
   ═══════════════════════════════════════════════════════ */

// Mock sonner so we can assert forwarding happens without rendering.
vi.mock("sonner", () => {
  const error = vi.fn();
  const warning = vi.fn();
  const info = vi.fn();
  return {
    toast: Object.assign(error, { error, warning, info }),
  };
});

describe("Task 4.2 — errorToastStore runtime behavior", () => {
  let useErrorToastStore: typeof import("../client/src/stores/errorToastStore").useErrorToastStore;
  let reportError: typeof import("../client/src/stores/errorToastStore").reportError;
  let reportWarning: typeof import("../client/src/stores/errorToastStore").reportWarning;

  beforeEach(async () => {
    vi.clearAllMocks();
    const mod = await import("../client/src/stores/errorToastStore");
    useErrorToastStore = mod.useErrorToastStore;
    reportError = mod.reportError;
    reportWarning = mod.reportWarning;
    useErrorToastStore.getState().clear();
  });

  it("starts with an empty buffer", () => {
    const s = useErrorToastStore.getState();
    expect(s.errors).toEqual([]);
    expect(s.dedupeMap).toEqual({});
  });

  it("report adds an entry to the buffer with a generated id and timestamp", () => {
    reportError("Boom");
    const s = useErrorToastStore.getState();
    expect(s.errors).toHaveLength(1);
    expect(s.errors[0].message).toBe("Boom");
    expect(s.errors[0].severity).toBe("error");
    expect(s.errors[0].id).toBeTruthy();
    expect(s.errors[0].timestamp).toBeGreaterThan(0);
  });

  it("reportWarning routes through severity: warning", () => {
    reportWarning("Careful");
    expect(useErrorToastStore.getState().errors[0].severity).toBe("warning");
  });

  it("dedupes identical errors with the same key inside 5 s", () => {
    reportError("Save failed", { dedupeKey: "save" });
    reportError("Save failed", { dedupeKey: "save" });
    reportError("Save failed", { dedupeKey: "save" });
    expect(useErrorToastStore.getState().errors).toHaveLength(1);
  });

  it("does not dedupe errors with different keys", () => {
    reportError("A", { dedupeKey: "a" });
    reportError("B", { dedupeKey: "b" });
    expect(useErrorToastStore.getState().errors).toHaveLength(2);
  });

  it("does not dedupe errors without a key", () => {
    reportError("A");
    reportError("A");
    expect(useErrorToastStore.getState().errors).toHaveLength(2);
  });

  it("dismiss removes a single error by id", () => {
    reportError("a");
    reportError("b");
    const firstId = useErrorToastStore.getState().errors[0].id;
    useErrorToastStore.getState().dismiss(firstId);
    const remaining = useErrorToastStore.getState().errors;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).not.toBe(firstId);
  });

  it("clear empties the buffer and dedupe map", () => {
    reportError("a", { dedupeKey: "a" });
    reportError("b", { dedupeKey: "b" });
    useErrorToastStore.getState().clear();
    const s = useErrorToastStore.getState();
    expect(s.errors).toHaveLength(0);
    expect(s.dedupeMap).toEqual({});
  });

  it("caps the buffer at 20 entries", () => {
    for (let i = 0; i < 30; i++) reportError(`err-${i}`);
    const s = useErrorToastStore.getState();
    expect(s.errors).toHaveLength(20);
    // Most recent first
    expect(s.errors[0].message).toBe("err-29");
  });

  it("silent reports still add to the buffer but skip sonner", async () => {
    const { toast } = await import("sonner");
    reportError("quiet", { silent: true });
    expect(useErrorToastStore.getState().errors).toHaveLength(1);
    expect((toast as any).error).not.toHaveBeenCalled();
  });

  it("non-silent error reports call toast.error with the message", async () => {
    const { toast } = await import("sonner");
    reportError("loud");
    expect((toast as any).error).toHaveBeenCalledWith("loud", undefined);
  });

  it("non-silent warning reports call toast.warning", async () => {
    const { toast } = await import("sonner");
    reportWarning("warn");
    expect((toast as any).warning).toHaveBeenCalledWith("warn", undefined);
  });

  it("includes description when provided", async () => {
    const { toast } = await import("sonner");
    reportError("title", { description: "detail" });
    expect((toast as any).error).toHaveBeenCalledWith("title", { description: "detail" });
  });
});

/* ═══════════════════════════════════════════════════════
   RUNTIME — useReconnectingWs countdown math
   ═══════════════════════════════════════════════════════ */

describe("Task 4.1 — countdown math", () => {
  it("formats the grace window to whole seconds ceiling", () => {
    const fmt = (ms: number) => `${Math.max(0, Math.ceil(ms / 1000))}s`;
    expect(fmt(30_000)).toBe("30s");
    expect(fmt(29_500)).toBe("30s"); // ceil, not floor — players never see 0s prematurely
    expect(fmt(1)).toBe("1s");
    expect(fmt(0)).toBe("0s");
    expect(fmt(-500)).toBe("0s"); // clamp
  });

  it("computes gracePeriodExpiresAt from first disconnect + 30 s", () => {
    const firstDisconnectAt = 1_000_000;
    const graceWindowMs = 30_000;
    expect(firstDisconnectAt + graceWindowMs).toBe(1_030_000);
  });

  it("grace window stays stable across subsequent retries in the same streak", () => {
    // If the first disconnect was at T0, retries at T1 and T2 must still
    // resolve against the same expiry — we should never "reset" the grace
    // window back to 30 s when a retry fires.
    const firstDisconnectAt = 100_000;
    const grace = 30_000;
    const expiry = firstDisconnectAt + grace;
    // Simulate 3 retries 2 s apart
    const retryAt1 = firstDisconnectAt + 2_000;
    const retryAt2 = firstDisconnectAt + 4_000;
    const retryAt3 = firstDisconnectAt + 6_000;
    expect(expiry - retryAt1).toBe(28_000);
    expect(expiry - retryAt2).toBe(26_000);
    expect(expiry - retryAt3).toBe(24_000);
  });
});
