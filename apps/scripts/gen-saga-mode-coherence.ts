/**
 * Regenerates docs/built/SAGA_GAME_MODE_COHERENCE.md from the canonical
 * narrative spine (apps/shared/narrativeSpine.ts).
 *
 * Run: pnpm tsx apps/scripts/gen-saga-mode-coherence.ts
 *
 * The ship:check gate `narrative.spine_coverage` fails if the doc has
 * drifted from the spine, so this script is the only sanctioned way to
 * update it.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { renderCoherenceMatrix } from "../shared/narrativeSpine";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(
  __dirname,
  "../../docs/built/SAGA_GAME_MODE_COHERENCE.md",
);

fs.writeFileSync(OUT, renderCoherenceMatrix(), "utf-8");
// eslint-disable-next-line no-console
console.log(`Wrote ${path.relative(process.cwd(), OUT)}`);
