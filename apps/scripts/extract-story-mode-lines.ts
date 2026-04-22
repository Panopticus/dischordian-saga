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
 *   - Memory fragments (all 7 chapters) → voiced by the Human/Prisoner
 *     (second-person inner monologue), emotion `serious`.
 *   - Pre-fight dialogs: per-chapter voice map below. Chapters without a
 *     mapping get their pre-fight skipped and flagged. Extend the map
 *     when storyModeRewrite.ts adds new chapters with pre-fight lines.
 */

import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { STORY_MODE_ENHANCEMENTS } from "../shared/storyModeRewrite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HUMAN_VOICE_ID = "oGbGJdgofRR8z0MxwI8L";
const MEME_VOICE_ID = "VgFgBh5TnWeBhCBvCJ1E";
const SOURCE_VOICE_ID = "hfq5qawrYj4gqFsfoE28";
const ARCHITECT_VOICE_ID = "PmtzUaeg5rMejCZzRqOZ";

interface VoiceAssignment {
  speaker: string;
  voiceId: string;
  emotion: string;
}

/** Per-chapter voice/emotion for the `enhancedPreFightDialog` line.
 *  Chapter 2 is inner monologue → same voice as memory fragments. 6/10/12
 *  are The Meme / The Source / The Architect speaking to the player. */
const PRE_FIGHT_VOICES: Record<string, VoiceAssignment> = {
  chapter_2_first_blood: {
    speaker: "human",
    voiceId: HUMAN_VOICE_ID,
    emotion: "serious",
  },
  chapter_6_shapeshifter: {
    speaker: "meme",
    voiceId: MEME_VOICE_ID,
    emotion: "serious",
  },
  chapter_10_source: {
    speaker: "source",
    voiceId: SOURCE_VOICE_ID,
    emotion: "commanding",
  },
  chapter_12_architects_design: {
    speaker: "architect",
    voiceId: ARCHITECT_VOICE_ID,
    emotion: "commanding",
  },
};

interface VoLine {
  id: string;
  speaker: string;
  voiceId: string;
  text: string;
  context: string;
  emotion: string;
  chapter: string;
}

const lines: VoLine[] = [];
const unmappedPreFights: string[] = [];

for (const e of STORY_MODE_ENHANCEMENTS) {
  lines.push({
    id: `${e.chapterId}.memory`,
    speaker: "human",
    voiceId: HUMAN_VOICE_ID,
    text: e.enhancedMemoryFragment,
    context: "story_mode_memory_fragment",
    emotion: "serious",
    chapter: e.chapterId,
  });

  if (e.enhancedPreFightDialog) {
    const voice = PRE_FIGHT_VOICES[e.chapterId];
    if (!voice) {
      unmappedPreFights.push(e.chapterId);
      continue;
    }
    lines.push({
      id: `${e.chapterId}.prefight`,
      speaker: voice.speaker,
      voiceId: voice.voiceId,
      text: e.enhancedPreFightDialog,
      context: "story_mode_prefight",
      emotion: voice.emotion,
      chapter: e.chapterId,
    });
  }
}

const outPath = join(__dirname, "story-mode-lines.json");
writeFileSync(outPath, JSON.stringify(lines, null, 2) + "\n", "utf8");
console.log(`wrote ${lines.length} lines → ${outPath}`);

if (unmappedPreFights.length > 0) {
  console.log(
    `\nskipped ${unmappedPreFights.length} enhancedPreFightDialog entries (no PRE_FIGHT_VOICES mapping):`,
  );
  for (const id of unmappedPreFights) console.log(`  - ${id}`);
  console.log("\nAdd them to PRE_FIGHT_VOICES in this file if you want them voiced.");
}
