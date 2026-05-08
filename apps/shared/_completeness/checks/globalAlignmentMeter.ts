/**
 * Global Light/Dark alignment meter parity check.
 *
 * `docs/design/NARRATIVE_ARCHITECTURE.md` §0 calls for a server-aggregated
 * Light/Dark meter — a single global number reflecting the community's
 * collective moral choices. Per-player morality already exists
 * (apps/db/schema.ts → users.lightAlignment / darkAlignment), but the
 * doc's §0 design is an *aggregate* surface that the Hierarchy invasion
 * cadence, Architect-Triggered Events, and Soul Stones drop rates all
 * read from.
 *
 * This check declares the four runtime artifacts that need to exist for
 * the meter to be considered shipped:
 *   1. A schema table or column tracking the global aggregate.
 *   2. A server function that recomputes the aggregate from per-player state.
 *   3. A tRPC procedure that exposes the current value to the client.
 *   4. A UI component that renders it.
 *
 * Hard parity in principle; ratcheted at 4 (everything missing) at landing
 * because the design is documented but unbuilt.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { REPO_ROOT, walkSourceFiles } from "../scanner";
import type { RawParityCount } from "../types";

interface AlignmentArtifact {
  /** Identifier surfaced in `missing` lines. */
  id: string;
  /** Human description of the runtime artifact. */
  description: string;
  /** Predicate: returns true if the artifact is present. */
  present: () => boolean;
}

const SCHEMA_PATH = path.join(REPO_ROOT, "apps/db/schema.ts");
const SERVER_DIR = path.join(REPO_ROOT, "apps/server");
const CLIENT_DIR = path.join(REPO_ROOT, "apps/client/src");

function schemaSrc(): string {
  return fs.existsSync(SCHEMA_PATH) ? fs.readFileSync(SCHEMA_PATH, "utf-8") : "";
}

function anyServerFileMatches(re: RegExp): boolean {
  return walkSourceFiles(SERVER_DIR).some((f) =>
    re.test(fs.readFileSync(f, "utf-8")),
  );
}

function anyClientFileMatches(re: RegExp): boolean {
  return walkSourceFiles(CLIENT_DIR).some((f) =>
    re.test(fs.readFileSync(f, "utf-8")),
  );
}

const ARTIFACTS: ReadonlyArray<AlignmentArtifact> = [
  {
    id: "schema:global_alignment_table",
    description:
      "schema column or table named global_alignment / globalAlignment / lightDarkMeter / alignment_meter in apps/db/schema.ts",
    present: () =>
      /\bglobal[_A-Z]?[Aa]lignment\b|\blightDarkMeter\b|\balignment_meter\b/.test(
        schemaSrc(),
      ),
  },
  {
    id: "server:aggregate_writer",
    description:
      "server function that recomputes the aggregate (recomputeGlobalAlignment / updateLightDarkMeter / aggregateAlignment)",
    present: () =>
      anyServerFileMatches(
        /recomputeGlobalAlignment|updateLightDarkMeter|aggregateAlignment\b/,
      ),
  },
  {
    id: "server:trpc_reader",
    description:
      "tRPC procedure exposing the aggregate (e.g. globalAlignment.get / lightDarkMeter.get / alignment.global)",
    present: () =>
      anyServerFileMatches(
        /globalAlignment\s*[:=]\s*router|lightDarkMeter\s*[:=]\s*router|getGlobalAlignment\b|getLightDarkMeter\b/,
      ),
  },
  {
    id: "client:meter_component",
    description:
      "client component rendering the global meter (GlobalAlignmentMeter / LightDarkMeter / GlobalMoralityMeter)",
    present: () =>
      anyClientFileMatches(
        /\b(?:GlobalAlignmentMeter|LightDarkMeter|GlobalMoralityMeter)\b/,
      ),
  },
];

export function checkGlobalAlignmentMeter(): RawParityCount {
  const missing: string[] = [];
  for (const a of ARTIFACTS) {
    if (!a.present()) {
      missing.push(`${a.id}: ${a.description}`);
    }
  }
  return {
    declared: ARTIFACTS.length,
    implemented: ARTIFACTS.length - missing.length,
    missing,
  };
}
