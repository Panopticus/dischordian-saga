/**
 * Generate docs/FNORD23_MUSIC_PROMPTS.md from every Engineer's Log.
 *
 * Each log in apps/shared/tcg-core/story/engineerLogs* exports a
 * `musicPrompt` object with tempo, key, instrumentation, mood
 * reference, lyrical context, and duration target. This script
 * walks the ENGINEER_LOGS array and emits a single markdown file
 * the user can copy-paste into Suno/Udio one prompt at a time.
 *
 * Run with:
 *   npx tsx scripts/generate_fnord23_music_prompts.ts
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { ENGINEER_LOGS } from "../apps/shared/tcg-core/story/engineerLogs";

// ESM-safe __dirname.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const lines: string[] = [];

lines.push("# FNORD-23 Music Prompts — OUTERGROOVE Channel");
lines.push("");
lines.push(
  "Suno/Udio-ready prompts for every Engineer's Log instrumental.",
);
lines.push(
  "Each block corresponds to one log and one backing track. Paste",
);
lines.push(
  "into your generator of choice and drop the resulting audio into",
);
lines.push("`/public/audio/outergroove/` with the filename `og_NNN.mp3`.");
lines.push("");
lines.push(
  "Voice reference: Childish Gambino raised on Doctor Who, studying",
);
lines.push(
  "under Nikola Tesla. KRS-One meets Rakim meets a British chaos-theory",
);
lines.push(
  "mathematician. Intelligent, melodic, finds the beat under every",
);
lines.push("sentence.");
lines.push("");
lines.push("---");
lines.push("");

for (const log of ENGINEER_LOGS) {
  const p = log.musicPrompt;
  lines.push(`## ${p.trackId.toUpperCase()} — ${log.title}`);
  lines.push("");
  lines.push(`**Log**: \`${log.id}\`  `);
  lines.push(`**Channel**: ${p.channelId.toUpperCase()}  `);
  lines.push(`**Tempo**: ${p.tempoBpm} BPM  `);
  lines.push(`**Key**: ${p.keySignature}  `);
  lines.push(`**Duration target**: ${p.durationTargetSeconds}s (loopable)  `);
  lines.push("");
  lines.push(`**Core instrumentation**: ${p.coreInstrumentation}`);
  lines.push("");
  lines.push(`**Mood reference**: ${p.moodReference}`);
  lines.push("");
  lines.push(`**Lyrical context**: ${p.lyricalContext}`);
  lines.push("");
  lines.push(
    `**Mechanic**: ${log.mechanicExplanation}`,
  );
  lines.push("");
  lines.push("---");
  lines.push("");
}

lines.push(
  `_Auto-generated from ${ENGINEER_LOGS.length} Engineer's Logs via scripts/generate_fnord23_music_prompts.ts._`,
);
lines.push("");

const outPath = join(__dirname, "..", "docs", "FNORD23_MUSIC_PROMPTS.md");
writeFileSync(outPath, lines.join("\n"), "utf-8");
console.log(`Wrote ${outPath} (${lines.length} lines, ${ENGINEER_LOGS.length} prompts)`);
