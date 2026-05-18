/**
 * Balance F7 — store SKU parity across web / iOS / Android.
 *
 * CLAUDE.md's definition-of-shipped lists "store SKU coverage across
 * web+iOS+Android" as landing under the gate, but no row enforced it:
 * `products.ts` defines `priceUsd` per product with no per-platform
 * store-SKU mapping, and `iapReceipt.ts` trusts a client-supplied
 * `productId` with nothing cross-checking the catalogs. Price/SKU
 * drift between platforms is a revenue leak and a store-policy risk.
 *
 * Declared  = every real-money product (priceUsd > 0) in
 *             apps/server/products.ts — each MUST exist on both
 *             mobile stores.
 * Implemented = those whose `key` is present in a server-side SKU
 *             catalog (apps/server/storeSkuCatalog.ts, exporting
 *             STORE_SKU_CATALOG) with non-empty `ios` AND `android`
 *             store identifiers.
 *
 * Ratcheted: the catalog does not exist yet, so this surfaces the
 * full gap as a tracked (non-failing) row — "tracked, not shipped"
 * made mechanical. Closing F7 = add the catalog + wire iapReceipt to
 * validate against it; the gap then tightens to 0.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT } from "../scanner";
import type { RawParityCount } from "../types";

function readRealMoneyProductKeys(src: string): string[] {
  const keys: string[] = [];
  // Each StoreProduct literal carries a `key: "..."` and a
  // `priceUsd: <n>`. Walk key→nearest-following-priceUsd windows.
  const re = /key:\s*"([^"]+)"[\s\S]{0,400}?priceUsd:\s*(\d+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    if (Number(m[2]) > 0) keys.push(m[1]);
  }
  return keys;
}

export function checkStoreSkuParity(): RawParityCount {
  const productsAbs = path.join(REPO_ROOT, "apps/server/products.ts");
  const productsSrc = fs.existsSync(productsAbs)
    ? fs.readFileSync(productsAbs, "utf-8")
    : "";
  const realMoneyKeys = readRealMoneyProductKeys(productsSrc);

  const catalogAbs = path.join(REPO_ROOT, "apps/server/storeSkuCatalog.ts");
  const catalogSrc = fs.existsSync(catalogAbs)
    ? fs.readFileSync(catalogAbs, "utf-8")
    : "";

  const missing: string[] = [];
  for (const key of realMoneyKeys) {
    // The catalog must declare this key with both an iOS and an
    // Android store identifier. Conservative parse: the key block
    // must contain both an `ios:` and an `android:` non-empty string.
    const block = new RegExp(
      `"${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\s*:\\s*\\{[\\s\\S]{0,300}?\\}`,
    ).exec(catalogSrc)?.[0];
    const wired =
      !!block &&
      /ios:\s*"[^"]+"/.test(block) &&
      /android:\s*"[^"]+"/.test(block);
    if (!wired) {
      missing.push(
        `${key} — add STORE_SKU_CATALOG["${key}"] = { ios, android } in apps/server/storeSkuCatalog.ts and validate it in iapReceipt.ts`,
      );
    }
  }

  return {
    declared: realMoneyKeys.length,
    implemented: realMoneyKeys.length - missing.length,
    missing,
  };
}
