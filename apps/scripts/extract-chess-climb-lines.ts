/**
 * Extract chess-climb Game Master VO lines from chessClimbDialog.ts
 * into a JSON the chess-climb VO generator consumes.
 *
 * Usage:
 *   pnpm tsx apps/scripts/extract-chess-climb-lines.ts
 *
 * Writes apps/scripts/chess-climb-lines.json. Overwrites on each run.
 *
 * Speaker handling (both registers use the same voice id per
 * docs/production/chess-vo-direction.md — "one actor, two registers"):
 *   - game_master_corrupted → Arena register (menacing/performative)
 *   - game_master_celebration → tutor register (warm/patient)
 *
 * Narrator cues are emitted with speaker=narrator but no voiceId — flagged
 * for skip by the generator since the project doesn't yet have a
 * narrator voice id mapped.
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { CHESS_CLIMB_SCENES } from "../shared/tcg-core/story/chessClimbDialog";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Two distinct ElevenLabs voices for the two GM registers, even though the
// in-fiction conceit (per chess-vo-direction.md) is "one actor, two
// registers." The Corrupted register is a game-theorist AI *performing* as a
// loud quiz-show host — the calibrated artifice is captured by giving the
// performance its own voice id and a delivery prompt that names the act.
const GAME_MASTER_CELEBRATION_VOICE_ID = "TT28j5FWUeiDbRr27c7t";
const GAME_MASTER_CORRUPTED_VOICE_ID = "7fUsquJ4dducD13xnA2i";

interface VoLine {
  id: string;
  speaker: string;
  voiceId: string;
  text: string;
  context: string;
  emotion: string;
  register: "celebration" | "corrupted" | "narrator";
}

const out: VoLine[] = [];
const skipped: string[] = [];

for (const scene of CHESS_CLIMB_SCENES) {
  for (const cue of scene.cues) {
    const id = cue.audioClipId ?? `${scene.id}__${out.length}`;

    if (cue.speaker === "narrator") {
      skipped.push(id);
      continue;
    }

    const isCorrupted = cue.speaker === "game_master_corrupted";
    const register: "celebration" | "corrupted" = isCorrupted
      ? "corrupted"
      : "celebration";
    const emotion = isCorrupted ? "menacing" : (cue.mood ?? "warm");

    out.push({
      id,
      speaker: cue.speaker,
      voiceId: isCorrupted
        ? GAME_MASTER_CORRUPTED_VOICE_ID
        : GAME_MASTER_CELEBRATION_VOICE_ID,
      text: cue.text,
      context: scene.id,
      emotion,
      register,
    });
  }
}

const outPath = join(__dirname, "chess-climb-lines.json");
writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log(`wrote ${out.length} lines → ${outPath}`);
console.log(
  `  corrupted=${out.filter((l) => l.register === "corrupted").length}  celebration=${out.filter((l) => l.register === "celebration").length}`,
);

if (skipped.length > 0) {
  console.log(`\nskipped ${skipped.length} narrator cue(s) — no voice id mapped:`);
  for (const id of skipped) console.log(`  - ${id}`);
}
