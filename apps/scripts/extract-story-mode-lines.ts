/**
 * Extract Story Mode VO lines from the TS registry into the JSON shape
 * apps/scripts/generate-story-mode-vo.ts expects.
 *
 * Usage:
 *   pnpm tsx apps/scripts/extract-story-mode-lines.ts
 *
 * Writes apps/scripts/story-mode-lines.json. Safe to rerun — overwrites
 * the output file each time.
 *
 * Scope:
 *   - Memory fragments → second-person inner monologue of the
 *     Human/Prisoner character → voiced by the existing `human` ElevenLabs
 *     voice (oGbGJdgofRR8z0MxwI8L), emotion `serious`.
 *   - Pre-fight dialogs are intentionally skipped: chapters 6/10/12 have
 *     character lines from The Meme / The Source / The Architect for
 *     which no voice ID is mapped in the repo yet. Review the output and
 *     hand-append those with the right voice IDs before running the VO
 *     generator if you want them voiced.
 */

import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { STORY_MODE_ENHANCEMENTS } from "../shared/storyModeRewrite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HUMAN_VOICE_ID = "oGbGJdgofRR8z0MxwI8L";

interface VoLine {
  id: string;
  speaker: string;
  voiceId: string;
  text: string;
  context: string;
  emotion: string;
  chapter: string;
}

const lines: VoLine[] = STORY_MODE_ENHANCEMENTS.map((e) => ({
  id: `${e.chapterId}.memory`,
  speaker: "human",
  voiceId: HUMAN_VOICE_ID,
  text: e.enhancedMemoryFragment,
  context: "story_mode_memory_fragment",
  emotion: "serious",
  chapter: e.chapterId,
}));

const outPath = join(__dirname, "story-mode-lines.json");
writeFileSync(outPath, JSON.stringify(lines, null, 2) + "\n", "utf8");
console.log(`wrote ${lines.length} lines → ${outPath}`);

const skippedPreFights = STORY_MODE_ENHANCEMENTS.filter((e) => e.enhancedPreFightDialog);
if (skippedPreFights.length > 0) {
  console.log(
    `\nskipped ${skippedPreFights.length} enhancedPreFightDialog entries (need speaker/voiceId mapping):`,
  );
  for (const e of skippedPreFights) console.log(`  - ${e.chapterId}`);
  console.log("\nEdit story-mode-lines.json to add these manually if you want them voiced.");
}
