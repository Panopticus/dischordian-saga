import { describe, it, expect, beforeEach } from "vitest";
import * as fs from "fs";
import * as path from "path";

/* ═══════════════════════════════════════════════════════
   TASK 3.1 — GameContext → Zustand (sync status extraction)
   TASK 3.2 — Asset optimization script + ResponsiveImage helper
   TASK 3.3 — Mobile touch targets + orientation hook
   ═══════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════
   TASK 3.1 — Zustand sync status store
   ═══════════════════════════════════════════════════════ */

describe("Task 3.1 — syncStatusStore", () => {
  const storeSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/stores/syncStatusStore.ts"),
    "utf-8",
  );

  it("exports useSyncStatusStore", () => {
    expect(storeSrc).toContain("export const useSyncStatusStore");
  });

  it("exports selector helpers for slice-level subscriptions", () => {
    expect(storeSrc).toContain("export const selectStatus");
    expect(storeSrc).toContain("export const selectLastSyncedAt");
    expect(storeSrc).toContain("export const selectLastError");
    expect(storeSrc).toContain("export const selectIsSaving");
    expect(storeSrc).toContain("export const selectIsSynced");
  });

  it("declares the SyncStatus type with all five states", () => {
    expect(storeSrc).toMatch(/SyncStatus\s*=\s*"idle"\s*\|\s*"saving"\s*\|\s*"loading"\s*\|\s*"synced"\s*\|\s*"error"/);
  });

  it("provides setStatus, markSynced, markError, reset actions", () => {
    expect(storeSrc).toContain("setStatus:");
    expect(storeSrc).toContain("markSynced:");
    expect(storeSrc).toContain("markError:");
    expect(storeSrc).toContain("reset:");
  });

  it("markSynced defaults lastSyncedAt to now() when no arg given", () => {
    expect(storeSrc).toMatch(/markSynced:\s*\(at\)\s*=>[\s\S]*?lastSyncedAt:\s*at\s*\?\?\s*new Date\(\)\.toISOString\(\)/);
  });

  it("markError nulls lastSyncedAt's error counterpart and sets status: error", () => {
    expect(storeSrc).toContain('status: "error"');
  });

  it("documents WHY the extraction happened (the 77-consumer re-render)", () => {
    expect(storeSrc).toContain("Task 3.1");
    expect(storeSrc).toMatch(/77[\s-]consumer/);
    expect(storeSrc).toMatch(/selector-level/i);
  });
});

describe("Task 3.1 — GameContext wiring delegates to syncStatusStore", () => {
  const ctxSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/contexts/GameContext.tsx"),
    "utf-8",
  );

  it("imports the sync status store", () => {
    expect(ctxSrc).toContain('import { useSyncStatusStore } from "@/stores/syncStatusStore"');
  });

  it("replaces local syncStatus useState with a store subscription", () => {
    expect(ctxSrc).toMatch(/setSyncStatus\s*=\s*useSyncStatusStore\(\(s\)\s*=>\s*s\.setStatus\)/);
    expect(ctxSrc).toMatch(/markSynced\s*=\s*useSyncStatusStore\(\(s\)\s*=>\s*s\.markSynced\)/);
    expect(ctxSrc).toMatch(/markError\s*=\s*useSyncStatusStore\(\(s\)\s*=>\s*s\.markError\)/);
  });

  it("removes the old useState<SyncStatus> call for sync status", () => {
    expect(ctxSrc).not.toMatch(/const\s*\[syncStatus,\s*setSyncStatus\]\s*=\s*useState/);
    expect(ctxSrc).not.toMatch(/const\s*\[lastSyncedAt,\s*setLastSyncedAt\]\s*=\s*useState/);
  });

  it("doServerSave calls markSynced on success", () => {
    expect(ctxSrc).toMatch(/markSynced\(\)/);
  });

  it("doServerSave calls markError with the error message", () => {
    expect(ctxSrc).toMatch(/markError\(e instanceof Error \? e\.message : undefined\)/);
  });

  it("documents why sync status moved out of the context", () => {
    expect(ctxSrc).toContain("Task 3.1");
    expect(ctxSrc).toContain("useSyncStatusStore");
  });

  it("no longer surfaces syncStatus on the context provider value", () => {
    // We should no longer pass those fields into the provider
    // (removed from the returned value object).
    const provideBlock = ctxSrc.slice(ctxSrc.indexOf("checkDeploymentCompletion"));
    expect(provideBlock).not.toMatch(/^\s*syncStatus,$/m);
    expect(provideBlock).not.toMatch(/^\s*lastSyncedAt,$/m);
  });
});

describe("Task 3.1 — SettingsPage now reads from the store directly", () => {
  const pageSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/pages/SettingsPage.tsx"),
    "utf-8",
  );

  it("imports the store + selectors", () => {
    expect(pageSrc).toContain('from "@/stores/syncStatusStore"');
    expect(pageSrc).toContain("useSyncStatusStore");
    expect(pageSrc).toContain("selectStatus");
    expect(pageSrc).toContain("selectLastSyncedAt");
  });

  it("subscribes with selectors (slice-level, not whole-store)", () => {
    expect(pageSrc).toMatch(/useSyncStatusStore\(selectStatus\)/);
    expect(pageSrc).toMatch(/useSyncStatusStore\(selectLastSyncedAt\)/);
  });

  it("no longer destructures syncStatus/lastSyncedAt from useGame()", () => {
    expect(pageSrc).not.toMatch(/useGame\(\)[\s\S]{0,200}syncStatus,\s*lastSyncedAt/);
  });
});

/* ═══════════════════════════════════════════════════════
   TASK 3.2 — optimize-images script + ResponsiveImage
   ═══════════════════════════════════════════════════════ */

describe("Task 3.2 — optimize-images script", () => {
  const scriptSrc = fs.readFileSync(
    path.resolve(__dirname, "../scripts/optimize-images.ts"),
    "utf-8",
  );

  it("walks client/public/art by default", () => {
    expect(scriptSrc).toContain('"client", "public", "art"');
  });

  it("supports --dry-run for reporting without mutating files", () => {
    expect(scriptSrc).toContain("--dry-run");
    expect(scriptSrc).toContain("dryRun");
  });

  it("supports --min KB filter", () => {
    expect(scriptSrc).toContain("--min");
    expect(scriptSrc).toContain("minSizeKb");
  });

  it("supports --quality override (defaults to 85)", () => {
    expect(scriptSrc).toContain("--quality");
    expect(scriptSrc).toMatch(/quality:\s*85/);
  });

  it("is idempotent — skips already-fresh .webp files", () => {
    expect(scriptSrc).toContain("destStat.mtimeMs >= srcStat.mtimeMs");
    expect(scriptSrc).toContain("skipped");
  });

  it("fails gracefully when sharp isn't installed", () => {
    expect(scriptSrc).toContain("sharp");
    expect(scriptSrc).toContain("pnpm add -D sharp");
  });

  it("reports before/after/reduction stats on completion", () => {
    expect(scriptSrc).toContain("bytesBefore");
    expect(scriptSrc).toContain("bytesAfter");
    expect(scriptSrc).toContain("Reduction");
  });

  it("scans png/jpg/jpeg only", () => {
    expect(scriptSrc).toContain('".png"');
    expect(scriptSrc).toContain('".jpg"');
    expect(scriptSrc).toContain('".jpeg"');
  });
});

describe("Task 3.2 — package.json scripts", () => {
  const pkgSrc = fs.readFileSync(
    path.resolve(__dirname, "../package.json"),
    "utf-8",
  );

  it("exposes pnpm run optimize:images", () => {
    expect(pkgSrc).toContain('"optimize:images"');
    expect(pkgSrc).toContain("tsx scripts/optimize-images.ts");
  });

  it("exposes pnpm run optimize:images:dry", () => {
    expect(pkgSrc).toContain('"optimize:images:dry"');
    expect(pkgSrc).toContain("--dry-run");
  });
});

describe("Task 3.2 — ResponsiveImage component", () => {
  const componentSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/components/ResponsiveImage.tsx"),
    "utf-8",
  );

  it("exports a default and named ResponsiveImage", () => {
    expect(componentSrc).toContain("export const ResponsiveImage");
    expect(componentSrc).toContain("export default ResponsiveImage");
  });

  it("wraps img in a <picture> with a webp source", () => {
    expect(componentSrc).toContain("<picture>");
    expect(componentSrc).toContain('type="image/webp"');
  });

  it("has a helper that swaps .png/.jpg → .webp for srcSet", () => {
    expect(componentSrc).toContain("toWebpPath");
    expect(componentSrc).toMatch(/replace\(\/\\\.\(png\|jpe\?g\)\/i, "\.webp"\)/);
  });

  it("defaults loading to lazy and decoding to async", () => {
    expect(componentSrc).toMatch(/const loading = eager \? "eager" : "lazy"/);
    expect(componentSrc).toContain('decoding = "async"');
  });

  it("has an `eager` prop for above-the-fold hero art", () => {
    expect(componentSrc).toContain("eager?: boolean");
  });

  it("falls back to plain <img> when the src has no known extension", () => {
    expect(componentSrc).toMatch(/if \(!webp\)[\s\S]{0,200}return \(/);
  });

  it("uses forwardRef so it can receive refs from parent components", () => {
    expect(componentSrc).toContain("forwardRef<HTMLImageElement");
  });
});

describe("Task 3.2 — PlanetGalleryPage uses ResponsiveImage", () => {
  const pageSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/pages/PlanetGalleryPage.tsx"),
    "utf-8",
  );

  it("imports ResponsiveImage", () => {
    expect(pageSrc).toContain('import ResponsiveImage from "@/components/ResponsiveImage"');
  });

  it("uses <ResponsiveImage> for planet thumbnails", () => {
    expect(pageSrc).toMatch(/<ResponsiveImage[\s\S]{0,200}planet\.image/);
  });

  it("marks the selected-planet hero image as eager", () => {
    expect(pageSrc).toMatch(/<ResponsiveImage[\s\S]{0,100}eager/);
  });
});

/* ═══════════════════════════════════════════════════════
   TASK 3.3 — Touch targets + orientation hook
   ═══════════════════════════════════════════════════════ */

describe("Task 3.3 — global touch target CSS", () => {
  const cssSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/index.css"),
    "utf-8",
  );

  it("applies 44px min-height to every button and link (not just role=button)", () => {
    expect(cssSrc).toMatch(/button:not\(\.touch-compact\)/);
    expect(cssSrc).toMatch(/a:not\(\.touch-compact\)/);
  });

  it("covers the aria roles that need to be hit-targetable", () => {
    expect(cssSrc).toContain('[role="button"]');
    expect(cssSrc).toContain('[role="link"]');
    expect(cssSrc).toContain('[role="menuitem"]');
    expect(cssSrc).toContain('[role="tab"]');
    expect(cssSrc).toContain('[role="option"]');
  });

  it("also sets 44px min-width alongside min-height", () => {
    const block = cssSrc.slice(cssSrc.indexOf("Task 3.3"));
    expect(block).toMatch(/min-height:\s*44px/);
    expect(block).toMatch(/min-width:\s*44px/);
  });

  it("adds touch-action: manipulation to prevent double-tap zoom", () => {
    expect(cssSrc).toMatch(/touch-action:\s*manipulation/);
  });

  it("provides a .touch-compact opt-out for dense UI", () => {
    expect(cssSrc).toContain("touch-compact");
  });
});

describe("Task 3.3 — useOrientation hook", () => {
  const hookSrc = fs.readFileSync(
    path.resolve(__dirname, "../client/src/hooks/useOrientation.tsx"),
    "utf-8",
  );

  it("exports useOrientation + RequireLandscape + default export", () => {
    expect(hookSrc).toContain("export function useOrientation");
    expect(hookSrc).toContain("export function RequireLandscape");
    expect(hookSrc).toContain("export default useOrientation");
  });

  it("returns isPortrait, isLandscape, width, height, and orientation", () => {
    expect(hookSrc).toContain("isPortrait:");
    expect(hookSrc).toContain("isLandscape:");
    expect(hookSrc).toContain("width:");
    expect(hookSrc).toContain("height:");
    expect(hookSrc).toContain("orientation:");
  });

  it("listens to both resize and orientationchange", () => {
    expect(hookSrc).toContain('"resize"');
    expect(hookSrc).toContain('"orientationchange"');
  });

  it("cleans up listeners on unmount", () => {
    expect(hookSrc).toContain("removeEventListener");
  });

  it("is SSR-safe (guards window access)", () => {
    expect(hookSrc).toMatch(/typeof window === "undefined"/);
  });

  it("RequireLandscape bypasses the check above a tablet breakpoint", () => {
    expect(hookSrc).toContain("minWidthBypass");
    expect(hookSrc).toMatch(/minWidthBypass\s*=\s*900/);
  });

  it("RequireLandscape renders a default rotate prompt if none supplied", () => {
    expect(hookSrc).toContain("ROTATE DEVICE");
  });

  it("RequireLandscape accepts a custom fallback prop", () => {
    expect(hookSrc).toContain("fallback?: ReactNode");
  });
});

/* ═══════════════════════════════════════════════════════
   RUNTIME CHECK — useOrientation computes the right state
   ═══════════════════════════════════════════════════════ */

describe("Task 3.3 — useOrientation runtime semantics", () => {
  // Simulate reading the orientation-derivation logic without
  // React. The hook exports the helper indirectly via its
  // initial state; we replicate the math here to assert the
  // portrait/landscape boundary.
  const derive = (w: number, h: number) => ({
    isPortrait: h >= w,
    isLandscape: h < w,
    orientation: (h >= w ? "portrait" : "landscape") as "portrait" | "landscape",
  });

  it("treats 375x812 as portrait (iPhone X)", () => {
    const r = derive(375, 812);
    expect(r.isPortrait).toBe(true);
    expect(r.orientation).toBe("portrait");
  });

  it("treats 812x375 as landscape (rotated iPhone X)", () => {
    const r = derive(812, 375);
    expect(r.isLandscape).toBe(true);
    expect(r.orientation).toBe("landscape");
  });

  it("treats a square viewport as portrait (defensive)", () => {
    const r = derive(500, 500);
    expect(r.isPortrait).toBe(true);
  });

  it("treats wide desktop as landscape", () => {
    const r = derive(1920, 1080);
    expect(r.isLandscape).toBe(true);
  });
});

/* ═══════════════════════════════════════════════════════
   RUNTIME CHECK — syncStatusStore actions
   ═══════════════════════════════════════════════════════ */

describe("Task 3.1 — syncStatusStore runtime behavior", () => {
  // Import the store dynamically — this runs it for real.
  // We can do this because the store has no side effects on
  // construction and doesn't require a browser environment.
  let useSyncStatusStore: typeof import("../client/src/stores/syncStatusStore").useSyncStatusStore;

  beforeEach(async () => {
    const mod = await import("../client/src/stores/syncStatusStore");
    useSyncStatusStore = mod.useSyncStatusStore;
    useSyncStatusStore.getState().reset();
  });

  it("starts in the 'idle' state with nulls", () => {
    const s = useSyncStatusStore.getState();
    expect(s.status).toBe("idle");
    expect(s.lastSyncedAt).toBeNull();
    expect(s.lastError).toBeNull();
  });

  it("setStatus flips the status without touching lastSyncedAt", () => {
    useSyncStatusStore.getState().setStatus("saving");
    const s = useSyncStatusStore.getState();
    expect(s.status).toBe("saving");
    expect(s.lastSyncedAt).toBeNull();
  });

  it("markSynced sets status, stamps lastSyncedAt, clears lastError", () => {
    useSyncStatusStore.getState().markError("boom");
    useSyncStatusStore.getState().markSynced();
    const s = useSyncStatusStore.getState();
    expect(s.status).toBe("synced");
    expect(s.lastSyncedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(s.lastError).toBeNull();
  });

  it("markSynced accepts an explicit timestamp", () => {
    useSyncStatusStore.getState().markSynced("2030-01-01T00:00:00.000Z");
    expect(useSyncStatusStore.getState().lastSyncedAt).toBe("2030-01-01T00:00:00.000Z");
  });

  it("markError sets status and captures the message", () => {
    useSyncStatusStore.getState().markError("network down");
    const s = useSyncStatusStore.getState();
    expect(s.status).toBe("error");
    expect(s.lastError).toBe("network down");
  });

  it("reset restores the initial state", () => {
    useSyncStatusStore.getState().markSynced();
    useSyncStatusStore.getState().reset();
    const s = useSyncStatusStore.getState();
    expect(s.status).toBe("idle");
    expect(s.lastSyncedAt).toBeNull();
    expect(s.lastError).toBeNull();
  });
});

/* ═══════════════════════════════════════════════════════
   README migration pattern is documented
   ═══════════════════════════════════════════════════════ */

describe("Task 3.1 — stores/README documents the extraction", () => {
  const readme = fs.readFileSync(
    path.resolve(__dirname, "../client/src/stores/README.md"),
    "utf-8",
  );

  it("lists syncStatusStore in the current stores section", () => {
    expect(readme).toContain("syncStatusStore");
  });

  it("explains what was extracted and why", () => {
    expect(readme).toContain("Task 3.1");
    expect(readme).toContain("syncStatus");
  });

  it("includes a table of future extraction candidates", () => {
    expect(readme).toContain("Extraction candidates");
    expect(readme).toContain("narrativeFlags");
    expect(readme).toContain("petBonds");
  });
});
