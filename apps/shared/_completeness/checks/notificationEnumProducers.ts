/**
 * Notification enum-producer parity check.
 *
 * `apps/db/schema.ts` declares a `notifications.type` enum with ~40
 * variants. Each variant is a notification kind the client knows how to
 * render — but only because at least one server file produces it. A
 * variant the server never emits is a kind the player will never see;
 * a kind the client renders for is a kind that needs at least one
 * producer.
 *
 * For every variant in the enum, this check requires at least one
 * `type: "<variant>"` literal in `apps/server/`. Hard parity — adding
 * a new variant without a producer is a "nothing emits this" footgun.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT, walkSourceFiles } from "../scanner";
import type { RawParityCount } from "../types";

const SCHEMA_PATH = path.join(REPO_ROOT, "apps/db/schema.ts");
const SERVER_DIR = path.join(REPO_ROOT, "apps/server");

/** Extract the literal members of `mysqlEnum("type", [ ... ])` inside the
 *  notifications table block. The block begins at
 *  `notifications = mysqlTable("notifications", {` and the enum we care
 *  about is the column literally named `"type"`. */
function extractNotificationTypeVariants(schemaSrc: string): string[] {
  const startIdx = schemaSrc.indexOf(
    'export const notifications = mysqlTable("notifications", {',
  );
  if (startIdx < 0) return [];
  const tail = schemaSrc.slice(startIdx);
  const enumMatch = tail.match(
    /mysqlEnum\(\s*["']type["']\s*,\s*\[([\s\S]*?)\]\s*\)/,
  );
  if (!enumMatch) return [];
  const list = enumMatch[1];
  const variants = new Set<string>();
  for (const m of list.matchAll(/["']([a-z][a-z0-9_]*)["']/g)) {
    variants.add(m[1]);
  }
  return Array.from(variants).sort();
}

export function checkNotificationEnumProducers(): RawParityCount {
  const schemaSrc = fs.existsSync(SCHEMA_PATH)
    ? fs.readFileSync(SCHEMA_PATH, "utf-8")
    : "";
  const variants = extractNotificationTypeVariants(schemaSrc);

  if (variants.length === 0) {
    throw new Error(
      'checkNotificationEnumProducers: notifications.type enum not found in apps/db/schema.ts',
    );
  }

  const serverFiles = walkSourceFiles(SERVER_DIR);
  const producedAny = new Set<string>();

  for (const abs of serverFiles) {
    const src = fs.readFileSync(abs, "utf-8");
    for (const v of variants) {
      if (producedAny.has(v)) continue;
      // Match `type: "<variant>"` — the canonical writer pattern for
      // notifications.create({ type: "...", ... }) calls.
      const re = new RegExp(
        String.raw`\btype\s*:\s*["']` + v + String.raw`["']`,
      );
      if (re.test(src)) {
        producedAny.add(v);
      }
    }
  }

  const missing = variants.filter((v) => !producedAny.has(v));

  return {
    declared: variants.length,
    implemented: variants.length - missing.length,
    missing: missing.map(
      (v) =>
        `${v}: declared in notifications.type enum but no \`type: "${v}"\` writer found in apps/server/`,
    ),
  };
}
