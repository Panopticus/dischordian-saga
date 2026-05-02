/**
 * M5 (mobile bundle split) — source-scan invariants for the
 * vite.config.ts `manualChunks` contract. Anchors the vendor-chunk
 * shape so a future refactor can't silently regress it.
 *
 * The actual bundle-size regression check needs `pnpm build` output
 * and lives in CI; this test fences the configuration that drives it.
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const viteConfigSrc = fs.readFileSync(
  path.resolve(__dirname, "..", "..", "..", "vite.config.ts"),
  "utf-8",
);

describe("vite.config.ts — manualChunks vendor-split contract", () => {
  it("declares a manualChunks block at all", () => {
    expect(viteConfigSrc).toContain("manualChunks");
  });

  // Game-engine vendors — heaviest in the tree, loaded lazily by the
  // pages that mount them. Splitting these out of the initial bundle
  // is the M5 P0 win.
  it("splits Pixi.js into a dedicated chunk", () => {
    expect(viteConfigSrc).toMatch(/"vendor-pixi":\s*\["pixi\.js"\]/);
  });

  it("splits Three.js into a dedicated chunk", () => {
    expect(viteConfigSrc).toMatch(/"vendor-three":\s*\["three"\]/);
  });

  it("splits chess.js + stockfish into a dedicated chunk", () => {
    expect(viteConfigSrc).toContain("vendor-chess");
    expect(viteConfigSrc).toContain('"chess.js"');
    expect(viteConfigSrc).toContain('"stockfish"');
  });

  // React + data layer — used everywhere but stable size, so chunking
  // them keeps the initial bundle stable as the app adds features.
  it("splits the React runtime into vendor-react", () => {
    expect(viteConfigSrc).toContain("vendor-react");
    expect(viteConfigSrc).toContain('"react"');
    expect(viteConfigSrc).toContain('"react-dom"');
  });

  it("splits @tanstack/react-query into vendor-tanstack", () => {
    expect(viteConfigSrc).toContain("vendor-tanstack");
    expect(viteConfigSrc).toContain('"@tanstack/react-query"');
  });

  it("splits the @trpc client trio into vendor-trpc", () => {
    expect(viteConfigSrc).toContain("vendor-trpc");
    expect(viteConfigSrc).toContain('"@trpc/client"');
    expect(viteConfigSrc).toContain('"@trpc/react-query"');
  });

  // UI primitives — the full Radix set ships across most pages;
  // bundling once means downloads-once-and-cached vs. partial chunk.
  it("vendor-radix bundles every Radix primitive used by the app (>= 20 packages)", () => {
    const radixSection = viteConfigSrc.match(
      /"vendor-radix":\s*\[([\s\S]*?)\]/,
    );
    expect(radixSection).not.toBeNull();
    const matches = radixSection![1].match(/@radix-ui\/[\w-]+/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(20);
  });

  // Validation / forms / utilities — used widely; off the initial
  // critical path.
  it("splits Zod into vendor-zod", () => {
    expect(viteConfigSrc).toMatch(/"vendor-zod":\s*\["zod"\]/);
  });

  it("splits react-hook-form into vendor-forms", () => {
    expect(viteConfigSrc).toContain("vendor-forms");
    expect(viteConfigSrc).toContain('"react-hook-form"');
  });

  it("splits date-fns into vendor-date-fns", () => {
    expect(viteConfigSrc).toContain("vendor-date-fns");
    expect(viteConfigSrc).toContain('"date-fns"');
  });

  it("splits framer-motion into vendor-framer", () => {
    expect(viteConfigSrc).toMatch(/"vendor-framer":\s*\["framer-motion"\]/);
  });

  it("splits recharts into vendor-recharts", () => {
    expect(viteConfigSrc).toMatch(/"vendor-recharts":\s*\["recharts"\]/);
  });

  it("splits lucide-react icon set into vendor-lucide", () => {
    expect(viteConfigSrc).toContain("vendor-lucide");
    expect(viteConfigSrc).toContain('"lucide-react"');
  });

  it("retains the chunkSizeWarningLimit so oversized chunks surface as build warnings", () => {
    expect(viteConfigSrc).toMatch(/chunkSizeWarningLimit:\s*\d+/);
  });
});
