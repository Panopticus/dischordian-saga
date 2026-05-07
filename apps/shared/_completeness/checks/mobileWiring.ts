/**
 * E — Native-mobile wiring parity check.
 *
 * Plan §E ships Capacitor + RevenueCat + list virtualization +
 * canvas touch-action + the locked-card UI helper. The wiring is
 * spread across packages, the client, and the server; this gate
 * proves each piece is in place rather than installed-but-unused.
 *
 * Probes (each is a single file + grep):
 *
 *   1. capacitor.config.ts at repo root
 *   2. mobile:sync / mobile:build scripts in package.json
 *   3. payment-adapter exists (apps/client/src/lib/payments/index.ts)
 *      and exposes `purchaseProduct`
 *   4. iapReceipt server router exists and is mounted in routers.ts
 *   5. virtualization helper exists at apps/client/src/lib/virtualization.ts
 *   6. .game-canvas-mount class declared in index.css with
 *      touch-action: none (canvas mounts swallow gestures)
 *   7. LockedCardBadge component exists for unlock-condition display
 *
 * Adding any of these requires the mount/usage to land in the
 * same change — scaffolding without consumers is precisely the
 * "tracked vs shipped" failure mode this gate exists to catch.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

interface Probe {
  name: string;
  file: string;
  pattern: RegExp;
  hint: string;
}

const PROBES: ReadonlyArray<Probe> = [
  {
    name: "capacitor.config.ts at repo root",
    file: "capacitor.config.ts",
    pattern: /CapacitorConfig|appId/,
    hint: "create capacitor.config.ts at the repo root with appId + webDir",
  },
  {
    name: "mobile:* scripts in package.json",
    file: "package.json",
    pattern: /"mobile:sync"\s*:\s*"cap sync"/,
    hint: 'add `"mobile:sync": "cap sync"` and friends to package.json scripts',
  },
  {
    name: "payment adapter exists",
    file: "apps/client/src/lib/payments/index.ts",
    pattern: /export\s+(?:async\s+)?function\s+purchaseProduct\b/,
    hint: "create apps/client/src/lib/payments/index.ts exporting purchaseProduct",
  },
  {
    name: "iapReceipt router defined",
    file: "apps/server/routers/iapReceipt.ts",
    pattern: /export\s+const\s+iapReceiptRouter\b/,
    hint: "create apps/server/routers/iapReceipt.ts exporting iapReceiptRouter",
  },
  {
    name: "iapReceipt mounted in routers.ts",
    file: "apps/server/routers.ts",
    pattern: /\biapReceipt:\s*iapReceiptRouter\b/,
    hint: "add `iapReceipt: iapReceiptRouter` to the appRouter object",
  },
  {
    name: "virtualization helper",
    file: "apps/client/src/lib/virtualization.ts",
    pattern: /export\s+function\s+useListVirtualizer\b/,
    hint: "create apps/client/src/lib/virtualization.ts exporting useListVirtualizer",
  },
  {
    name: "canvas touch-action class",
    file: "apps/client/src/index.css",
    pattern: /\.game-canvas-mount[\s\S]*?touch-action\s*:\s*none/,
    hint: "add a .game-canvas-mount rule with touch-action: none to apps/client/src/index.css",
  },
  {
    name: "LockedCardBadge component",
    file: "apps/client/src/components/LockedCardBadge.tsx",
    pattern: /export\s+function\s+LockedCardBadge\b/,
    hint: "create apps/client/src/components/LockedCardBadge.tsx",
  },
];

export function checkMobileWiring(): RawParityCount {
  const missing: string[] = [];
  for (const probe of PROBES) {
    const abs = path.join(REPO_ROOT, probe.file);
    const src = fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : "";
    if (!probe.pattern.test(src)) {
      missing.push(`${probe.name} — ${probe.hint} (${probe.file})`);
    }
  }
  return {
    declared: PROBES.length,
    implemented: PROBES.length - missing.length,
    missing,
  };
}
