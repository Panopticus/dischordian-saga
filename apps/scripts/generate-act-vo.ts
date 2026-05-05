/**
 * Acts 2-7 generic VO generator — ElevenLabs TTS + local/S3 delivery.
 *
 * Reads `apps/scripts/act<N>-vo-lines.json` (per-act TTS line manifests),
 * generates each via ElevenLabs with per-speaker voice_settings, and
 * writes results to both `apps/client/public/<outputDir>/<id>.mp3` AND
 * (optionally) s3://dgrsvoices/Act <N> Voices/<id>.mp3. Per-act manifest
 * lands at `apps/shared/act<N>VoManifest.json`.
 *
 * Usage (local — sandbox can't reach api.elevenlabs.io):
 *   export ELEVENLABS_API_KEY=sk_...
 *   # AWS creds optional — if unset, only local MP3s land
 *   export AWS_ACCESS_KEY_ID=AKIA...
 *   export AWS_SECRET_ACCESS_KEY=...
 *   pnpm tsx apps/scripts/generate-act-vo.ts --act 2
 *   pnpm tsx apps/scripts/generate-act-vo.ts --act 4.5
 *
 * Skip lines with TODO voice IDs:
 *   pnpm tsx apps/scripts/generate-act-vo.ts --act 2 --skip-todo
 *
 * Smoke-test a single section:
 *   pnpm tsx apps/scripts/generate-act-vo.ts --act 2 --only §5
 *
 * Plan without calling ElevenLabs:
 *   pnpm tsx apps/scripts/generate-act-vo.ts --act 2 --dry-run
 *
 * Idempotent — existing manifest keys are skipped.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { optionalCredential } from "./credentialUtils";
const ELEVENLABS_KEY = optionalCredential("ELEVENLABS_API_KEY");
const BUCKET = process.env.S3_BUCKET ?? "dgrsvoices";
const REGION = process.env.AWS_REGION ?? "us-east-2";
const HAS_AWS =
  Boolean(process.env.AWS_ACCESS_KEY_ID) &&
  Boolean(process.env.AWS_SECRET_ACCESS_KEY);

interface Settings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  text_prefix: string;
}

/**
 * Per-speaker ElevenLabs voice_settings. Align with the presets in
 * docs/production/ACTS_2_THROUGH_7_ASSET_BIBLE.md §0 voice registry
 * AND the emotion descriptors in each line. `zephyr_9` and
 * `game_master_right` use placeholder tunings that will still
 * generate sensibly if the user provides any reasonable voice ID.
 */
const SPEAKER_SETTINGS: Record<string, Settings> = {
  elara: {
    stability: 0.55,
    similarity_boost: 0.8,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix: "",
  },
  human: {
    stability: 0.5,
    similarity_boost: 0.8,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*spoken low and steady, conspiratorial, like a transmission through the walls* ",
  },
  narrator: {
    stability: 0.6,
    similarity_boost: 0.75,
    style: 0.15,
    use_speaker_boost: true,
    text_prefix:
      "*neutral, unprocessed narrator voice — gender-neutral, dry, no emotion* ",
  },
  zephyr_9: {
    stability: 0.7,
    similarity_boost: 0.78,
    style: 0.1,
    use_speaker_boost: true,
    text_prefix:
      "*precise, slow, lightly mechanical, with almost-affectionate restraint; never repeats, never hurries — a patient chess tutor who has taught this lesson for a hundred years* ",
  },
  game_master_left: {
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*measured, arithmetic, male — a calm game-theorist who has already proven the outcome; Front Man cadence* ",
  },
  game_master_right: {
    stability: 0.45,
    similarity_boost: 0.78,
    style: 0.55,
    use_speaker_boost: true,
    text_prefix:
      "*theatrical, cruel, female — Bobby-Fischer-via-TV; performs delight and menace in the same breath, lands ALL-CAPS words with full commitment* ",
  },
  the_eyes: {
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.35,
    use_speaker_boost: true,
    text_prefix:
      "*Asian female-Bond cadence, formal precision, seductive-confident but never hot; she already knows the ending and is choosing to let you arrive there* ",
  },
  kael_prisoner: {
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*broken-and-recovering baritone, low register, the thing between Warlord and Engineer — no pleading, no hostility, very tired* ",
  },
  iron_lion: {
    stability: 0.55,
    similarity_boost: 0.8,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*weathered male military commander, clipped cadence, smoke-damaged vocal texture, never raises the voice* ",
  },
  agent_zero: {
    stability: 0.45,
    similarity_boost: 0.8,
    style: 0.35,
    use_speaker_boost: true,
    text_prefix:
      "*female, urgent, military-clipped, signal static, haunted underneath; transmitted through a failing comm link* ",
  },
  vex_solene: {
    stability: 0.5,
    similarity_boost: 0.78,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix:
      "*low female, wry, trailing-word cadence — a pre-insurgency diplomat who knows exactly how many rooms she is speaking into* ",
  },
  engineer_recall: {
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.15,
    use_speaker_boost: true,
    text_prefix:
      "*male, measured, tired — the Engineer Recordings voice bank, not the Prisoner; a man giving a gentle final briefing* ",
  },
  both_narrators: {
    // Used for lines where Elara and Human speak together (Act 7 convergence
    // landing, silence-of-two-witnesses meta). Record two takes with elara
    // and human voiceIds and mix in post; this preset is the coordination
    // marker, not a single voice.
    stability: 0.55,
    similarity_boost: 0.8,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*both narrators speaking in unison — record each voice separately at identical timing and phase-lock in post; in solo generation render this as whichever voiceId is set on the line* ",
  },
  // ─── Trade Empire expansion speakers ───
  the_antiquarian: {
    stability: 0.65,
    similarity_boost: 0.78,
    style: 0.15,
    use_speaker_boost: true,
    text_prefix:
      "*chronicler, archival, patient, professorial — speaks from outside time, lines feel cited rather than spoken, measured cadence with occasional dry wry inflection on millennia of witnessing* ",
  },
  locke: {
    stability: 0.55,
    similarity_boost: 0.8,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix:
      "*chrome bureaucrat, silky and confident, female; always reading the room, calculation under the diplomatic warmth; tone shifts cooler when negotiations break down* ",
  },
  orin_fell: {
    stability: 0.5,
    similarity_boost: 0.78,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix:
      "*field operative, direct and urgent, no nonsense; clipped cadence with faint signal-static undertone, Insurgency-trained, speaks in tradecraft not philosophy* ",
  },
  the_source: {
    stability: 0.5,
    similarity_boost: 0.78,
    style: 0.4,
    use_speaker_boost: true,
    text_prefix:
      "*Kael corrupted by the Thought Virus; viral red-black harmonic distortion underneath; alternates seductive inevitability with swarm-logic cold calculation; lucid Engineer-recruiter remnants flicker through* ",
  },
  the_architect: {
    stability: 0.7,
    similarity_boost: 0.78,
    style: 0.1,
    use_speaker_boost: true,
    text_prefix:
      "*red-eyed digital presence, computational, ancient, patient; speaks in chess-move logic with no inflection — pure information; rare flashes of acknowledged curiosity about the player* ",
  },
  mol_garath: {
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.4,
    use_speaker_boost: true,
    text_prefix:
      "*demonic bureaucrat, Master of R'lyeh; reptilian and ancient, infernal corporate logic; cold humour at mortal suffering, treats the galaxy as a hostile-acquisition target* ",
  },
};

/**
 * Emotion overrides on top of the per-speaker baseline. The baseline
 * above already encodes the dominant register; these nudge for
 * specific moments (whispered-parenthetical, conspiratorial, etc.).
 */
const EMOTION_NUDGES: Partial<Record<string, Partial<Settings>>> = {
  whisper_heavy_reverb: {
    stability: 0.75,
    style: 0.05,
    text_prefix:
      "*whispered, almost inaudible, as if describing an unspoken moment to the camera; heavy reverb in post* ",
  },
  warm_serious: {
    style: 0.3,
  },
  quiet_wonder: {
    stability: 0.7,
    style: 0.15,
  },
};

interface VoLine {
  id: string;
  speaker: keyof typeof SPEAKER_SETTINGS;
  voiceId: string;
  text: string;
  context: string;
  section: string;
  emotion: string;
  outputDir: string; // "vo/act2" or "audio/act2"
}

const PUBLIC_ROOT = join(__dirname, "..", "client", "public");

function pathsForAct(actKey: string) {
  return {
    linesFile: join(__dirname, `act${actKey}-vo-lines.json`),
    manifestPath: join(
      __dirname,
      "..",
      "shared",
      `act${actKey.replace(".", "_")}VoManifest.json`,
    ),
    s3Prefix: `Act ${actKey} Voices`,
  };
}

function resolveSettings(line: VoLine): Settings {
  const base = SPEAKER_SETTINGS[line.speaker];
  if (!base)
    throw new Error(`No settings registered for speaker '${line.speaker}'`);
  const nudge = EMOTION_NUDGES[line.emotion] ?? {};
  return {
    ...base,
    ...nudge,
    text_prefix: (nudge.text_prefix ?? base.text_prefix) || "",
  };
}

async function generateSpeech(line: VoLine): Promise<Buffer> {
  const settings = resolveSettings(line);
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${line.voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: line.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: settings.stability,
          similarity_boost: settings.similarity_boost,
          style: settings.style,
          use_speaker_boost: settings.use_speaker_boost,
        },
      }),
    },
  );
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs ${response.status}: ${err.slice(0, 200)}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function uploadToS3(
  body: Buffer,
  id: string,
  s3Prefix: string,
): Promise<string> {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const s3 = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });
  const fullKey = `${s3Prefix}/${id}.mp3`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: fullKey,
      Body: body,
      ContentType: "audio/mpeg",
      CacheControl: "public, max-age=31536000",
    }),
  );
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(fullKey)}`;
}

function writeLocalMp3(body: Buffer, line: VoLine): string {
  const dir = join(PUBLIC_ROOT, line.outputDir);
  mkdirSync(dir, { recursive: true });
  const path = join(dir, `${line.id}.mp3`);
  writeFileSync(path, body);
  return `/${line.outputDir}/${line.id}.mp3`;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const getOpt = (flag: string) => {
    const eq = args.find((a) => a.startsWith(flag + "="));
    if (eq) return eq.split("=")[1];
    const idx = args.indexOf(flag);
    return idx >= 0 ? args[idx + 1] : undefined;
  };
  return {
    act: getOpt("--act"),
    skipTodo: args.includes("--skip-todo"),
    onlySection: getOpt("--only"),
    dryRun: args.includes("--dry-run"),
  };
}

async function main() {
  const { act, skipTodo, onlySection, dryRun } = parseArgs();

  if (!act) {
    console.error(
      "ERROR: --act <N> required (e.g. --act 2, --act 4.5, --act 6).",
    );
    process.exit(1);
  }
  const { linesFile, manifestPath, s3Prefix } = pathsForAct(act);

  if (!ELEVENLABS_KEY && !dryRun) {
    console.error("ERROR: ELEVENLABS_API_KEY not set (use --dry-run to plan).");
    process.exit(1);
  }
  if (!existsSync(linesFile)) {
    console.error(`ERROR: ${linesFile} missing.`);
    process.exit(1);
  }

  const lines: VoLine[] = JSON.parse(readFileSync(linesFile, "utf8"));
  const manifest: Record<string, string> = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf8"))
    : {};

  let candidates = lines.filter((l) => !manifest[l.id]);
  if (skipTodo) {
    candidates = candidates.filter((l) => !l.voiceId.startsWith("TODO"));
  }
  if (onlySection) {
    candidates = candidates.filter((l) => l.section.includes(onlySection));
  }

  const todoVoices = lines.filter((l) => l.voiceId.startsWith("TODO"));

  console.log("═══════════════════════════════════════");
  console.log(`  ACT ${act} VO GENERATOR`);
  console.log(`  ${lines.length} lines total`);
  console.log(`  ${lines.length - candidates.length} already in manifest`);
  console.log(`  ${candidates.length} to generate on this run`);
  if (todoVoices.length > 0 && !skipTodo) {
    console.log(
      `  ${todoVoices.length} line(s) have placeholder voice IDs — set the real IDs in ${linesFile} or pass --skip-todo`,
    );
    const uniqueTodos = [...new Set(todoVoices.map((l) => l.voiceId))];
    for (const t of uniqueTodos) console.log(`    • ${t}`);
  }
  console.log(
    `  Bucket: ${HAS_AWS ? BUCKET + "/" + s3Prefix : "(local only)"}`,
  );
  console.log(`  Dry run: ${dryRun}`);
  console.log("═══════════════════════════════════════\n");

  if (dryRun) {
    for (const line of candidates) {
      console.log(
        `  ${line.id.padEnd(32)}  ${line.speaker.padEnd(18)}  ${line.section}`,
      );
    }
    return;
  }

  let generated = 0;
  let errors = 0;

  for (const line of candidates) {
    if (line.voiceId.startsWith("TODO")) {
      console.log(`[skip] ${line.id} — placeholder voice ID ${line.voiceId}`);
      continue;
    }
    process.stdout.write(
      `[${generated + errors + 1}/${candidates.length}] ${line.id} (${line.speaker})... `,
    );
    let localPath: string | undefined;
    try {
      const audio = await generateSpeech(line);
      localPath = writeLocalMp3(audio, line);
      // Persist the local URL FIRST so a subsequent S3 failure can't
      // strand the just-generated MP3 — re-runs will then skip this line
      // (manifest hit) instead of paying ElevenLabs again.
      manifest[line.id] = localPath;
      writeFileSync(
        manifestPath,
        JSON.stringify(manifest, null, 2) + "\n",
        "utf8",
      );
      if (HAS_AWS) {
        try {
          const url = await uploadToS3(audio, line.id, s3Prefix);
          manifest[line.id] = url;
          writeFileSync(
            manifestPath,
            JSON.stringify(manifest, null, 2) + "\n",
            "utf8",
          );
          console.log(`✓ ${(audio.length / 1024).toFixed(0)}KB → S3`);
        } catch (s3err) {
          console.log(
            `⚠ ${(audio.length / 1024).toFixed(0)}KB → local OK, S3 failed (${(s3err as Error).message.slice(0, 80)})`,
          );
        }
      } else {
        console.log(`✓ ${(audio.length / 1024).toFixed(0)}KB → local`);
      }
      generated++;
      await new Promise((r) => setTimeout(r, 150));
    } catch (err) {
      errors++;
      console.log(`✗ ${(err as Error).message}`);
      if ((err as Error).message.includes("429")) {
        console.log("  rate-limited — backing off 30s");
        await new Promise((r) => setTimeout(r, 30000));
      }
    }
  }

  console.log(`\n═══ COMPLETE ═══`);
  console.log(`Generated:                       ${generated}`);
  console.log(`Skipped (manifest + TODO):       ${lines.length - candidates.length}`);
  console.log(`Errors:                          ${errors}`);
  console.log(`Manifest:                        ${manifestPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
