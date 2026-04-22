/**
 * Generate the six chess SFX mp3s (move, capture, check, mate, mate_climb,
 * leak) via ElevenLabs' sound-generation API. Saves to
 * apps/client/public/audio/chess_sfx/<event>.mp3 so the existing
 * chessSfx.ts loader — which uses assetUrl() — finds them once they're
 * uploaded to S3 (run pnpm assets:upload:dry --only=audio afterward to
 * confirm and pnpm assets:upload --only=audio to publish).
 *
 * Usage:
 *   ELEVENLABS_API_KEY=sk_... pnpm tsx apps/scripts/generate-chess-sfx.ts
 *
 * Idempotent: skips files that already exist on disk. Delete the target
 * file to regenerate.
 */

import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const API_URL = "https://api.elevenlabs.io/v1/sound-generation";
const OUT_DIR = join(
  process.cwd(),
  "apps",
  "client",
  "public",
  "audio",
  "chess_sfx",
);

interface SfxSpec {
  id: string;
  prompt: string;
  durationSeconds: number;
  promptInfluence: number;
}

// Short, dry, percussive effects to match the tight feedback loop chess
// players expect. Prompt-influence up on the decisive events (capture,
// check, mate) so they don't drift into ambient noise.
const SFX: SfxSpec[] = [
  {
    id: "move",
    prompt:
      "short crisp click of a wooden chess piece being placed on a board, dry, no reverb",
    durationSeconds: 0.5,
    promptInfluence: 0.55,
  },
  {
    id: "capture",
    prompt:
      "confident heavy thud of a chess piece capturing another, slight wooden resonance",
    durationSeconds: 0.6,
    promptInfluence: 0.6,
  },
  {
    id: "check",
    prompt:
      "tense alert chime announcing check in chess, brief metallic ping with subtle dissonance",
    durationSeconds: 0.8,
    promptInfluence: 0.65,
  },
  {
    id: "mate",
    prompt:
      "dramatic checkmate strike, deep wooden thud with a short dark reverb tail, final",
    durationSeconds: 1.2,
    promptInfluence: 0.7,
  },
  {
    id: "mate_climb",
    prompt:
      "victorious ascending chime sequence three bright tones climbing over two seconds, uplifting, bell-like",
    durationSeconds: 2.0,
    promptInfluence: 0.7,
  },
  {
    id: "leak",
    prompt:
      "ethereal reversed breath whisper, low atmospheric underlay, subtle and distant",
    durationSeconds: 1.5,
    promptInfluence: 0.5,
  },
];

async function generateOne(spec: SfxSpec, apiKey: string): Promise<Buffer> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: spec.prompt,
      duration_seconds: spec.durationSeconds,
      prompt_influence: spec.promptInfluence,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `ElevenLabs ${spec.id}: ${response.status} ${response.statusText} — ${body.slice(0, 200)}`,
    );
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length === 0) throw new Error(`ElevenLabs ${spec.id}: empty body`);
  return buffer;
}

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("ERROR: ELEVENLABS_API_KEY not set.");
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });

  let generated = 0;
  let skipped = 0;
  for (const spec of SFX) {
    const outPath = join(OUT_DIR, `${spec.id}.mp3`);
    if (existsSync(outPath)) {
      console.log(`skip  ${spec.id}.mp3 (exists)`);
      skipped++;
      continue;
    }
    process.stdout.write(`gen   ${spec.id}.mp3 ... `);
    try {
      const buffer = await generateOne(spec, apiKey);
      writeFileSync(outPath, buffer);
      console.log(`${buffer.length} B`);
      generated++;
    } catch (err) {
      console.log("FAIL");
      console.error(`  ${(err as Error).message}`);
    }
  }
  console.log(`\ndone — generated=${generated} skipped=${skipped} total=${SFX.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
