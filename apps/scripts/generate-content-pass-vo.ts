/**
 * VO generator for the choice-impact content pass.
 *
 * Reads the new authored content (per-stage romance scenes + Hierarchy-
 * lord encounters + Malkia revolution questline + Source/Kael dialogue
 * tree + Act 7 epilogue VO scripts) and runs each line through
 * ElevenLabs with per-speaker voice_settings, writing MP3s locally
 * and (optionally) to S3.
 *
 * Per-source manifest files land at:
 *   apps/shared/romanceScenesVoManifest.json
 *   apps/shared/encountersVoManifest.json
 *
 * Usage (sandbox can't reach api.elevenlabs.io):
 *
 *   export ELEVENLABS_API_KEY=sk_...
 *   # AWS creds optional — if unset, only local MP3s land
 *   export AWS_ACCESS_KEY_ID=AKIA...
 *   export AWS_SECRET_ACCESS_KEY=...
 *
 *   # Generate everything (~177 lines)
 *   pnpm tsx apps/scripts/generate-content-pass-vo.ts
 *
 *   # Generate only one source bank
 *   pnpm tsx apps/scripts/generate-content-pass-vo.ts --source romance
 *   pnpm tsx apps/scripts/generate-content-pass-vo.ts --source encounters
 *   pnpm tsx apps/scripts/generate-content-pass-vo.ts --source act7
 *
 *   # Generate only one character / encounter
 *   pnpm tsx apps/scripts/generate-content-pass-vo.ts --only locke
 *   pnpm tsx apps/scripts/generate-content-pass-vo.ts --only master_of_rlyeh
 *   pnpm tsx apps/scripts/generate-content-pass-vo.ts --only humanity
 *
 *   # Plan without calling ElevenLabs (lists what would generate)
 *   pnpm tsx apps/scripts/generate-content-pass-vo.ts --dry-run
 *
 *   # Skip lines whose voice ID is still the placeholder
 *   pnpm tsx apps/scripts/generate-content-pass-vo.ts --skip-todo
 *
 *   # Supply voice IDs for sentinel speakers via env vars:
 *   export VOICE_ID_JERICHO_JONES=abc123...
 *   export VOICE_ID_DMC_CLONE_COMPANION=def456...
 *   export VOICE_ID_HIERARCHY_MASTER_OF_RLYEH=ghi789...
 *   export VOICE_ID_HIERARCHY_PALE_EMISSARY=jkl012...
 *   export VOICE_ID_HIERARCHY_RECKONING_DAUGHTER=mno345...
 *   export VOICE_ID_MALKIA_UKWELI=pqr678...
 *   export VOICE_ID_SOURCE=stu901...
 *   export VOICE_ID_KAEL_TRACE=vwx234...
 *   export VOICE_ID_SYSTEM=narrator_voice_id
 *   export VOICE_ID_DUAL=dual_chord_voice_id  # producer mixes elara+human
 *
 *   # Or via JSON config (precedence: env > config > defaults):
 *   pnpm tsx apps/scripts/generate-content-pass-vo.ts \
 *     --voice-config voice-ids.json
 *   # voice-ids.json: { "jericho_jones": "...", "source": "...", ... }
 *
 * Idempotent — manifest entries are skipped on rerun. Output cues
 * embedded in Act 7 lines (the [CUE 0:00] markers) are stripped
 * from the TTS body but preserved in the manifest as voice-direction
 * comments for later editing/re-recording.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  LOCKE_ROMANCE_BANK,
  VEX_ROMANCE_BANK,
  ELARA_ROMANCE_BANK,
  DMC_ROMANCE_BANK,
  JERICHO_ROMANCE_BANK,
} from "../shared/npcs/romanceScenes";
import {
  MASTER_OF_RLYEH_LINES,
  PALE_EMISSARY_LINES,
  RECKONING_DAUGHTER_LINES,
  MALKIA_REVOLUTION_QUESTLINE,
  SOURCE_KAEL_DIALOGUE_LINES,
  ACT7_EPILOGUE_VO_SCRIPTS,
  type EncounterLine,
} from "../shared/encounters";
import type { NpcLine } from "../shared/npcs/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY ?? "";
const BUCKET = process.env.S3_BUCKET ?? "dgrsvoices";
const REGION = process.env.AWS_REGION ?? "us-east-2";
const HAS_AWS =
  Boolean(process.env.AWS_ACCESS_KEY_ID) &&
  Boolean(process.env.AWS_SECRET_ACCESS_KEY);

const REPO_ROOT = join(__dirname, "..", "..");
const PUBLIC_ROOT = join(REPO_ROOT, "apps", "client", "public");
const SHARED_ROOT = join(REPO_ROOT, "apps", "shared");

// ─── Speaker → ElevenLabs voice id ────────────────────────
//
// Roster speakers source their voice IDs from
// apps/shared/npcs/registry.ts. Sentinel speakers (Hierarchy
// lords, Source, Kael trace, Malkia, DMC, Jericho) use
// producer-supplied voice IDs.
//
// Three ways to supply the producer voice IDs, in order of
// precedence:
//
//   1. Env var:  VOICE_ID_<SPEAKER>=...   (highest precedence)
//                  e.g. VOICE_ID_JERICHO_JONES=abc123,
//                       VOICE_ID_HIERARCHY_MASTER_OF_RLYEH=xyz789,
//                       VOICE_ID_SYSTEM=narrator_voice_id
//                  Speaker name is uppercased; ':' becomes '_'.
//   2. JSON config:  --voice-config voice-ids.json
//                  (a flat { "<speaker>": "<voiceId>" } map)
//   3. Defaults below.
//
// Lines whose final resolved voice id is TODO_VOICE are
// skipped when --skip-todo is passed; otherwise they emit a
// warning and are skipped silently in the count.

const TODO_VOICE = "TODO_VOICE";

const DEFAULT_VOICE_IDS: Record<string, string> = {
  // Roster (matches registry.ts)
  elara: "xMyNDrPFEtQN8iZtT7l2",
  the_human: "oGbGJdgofRR8z0MxwI8L",
  antiquarian: "8GibmYIeMaUJxz5IqEY7", // canonical Antiquarian voice
  adjudicator_locke: "8XiBWqS5ffaH5naIFHPI",
  vex_solene: "F1waTCPWl7KpShIScYQs",
  dmc_clone_companion: TODO_VOICE,
  jericho_jones: TODO_VOICE,

  // Encounter sentinels
  "hierarchy:master_of_rlyeh": TODO_VOICE,
  "hierarchy:pale_emissary": TODO_VOICE,
  "hierarchy:reckoning_daughter": TODO_VOICE,
  malkia_ukweli: TODO_VOICE,
  source: TODO_VOICE,
  kael_trace: TODO_VOICE,

  // Dual + system are mixed in post; both speaker tracks use
  // their own voice IDs and the producer mixes them. The
  // 'system' channel uses a dedicated narrator voice.
  system: TODO_VOICE,
  dual: TODO_VOICE,
};

/**
 * Resolve the final voice-id map. Precedence: env var > JSON
 * config (--voice-config) > DEFAULT_VOICE_IDS. The env-var
 * lookup transforms speaker names to upper-snake_case with
 * ':' replaced by '_' so 'hierarchy:master_of_rlyeh' becomes
 * VOICE_ID_HIERARCHY_MASTER_OF_RLYEH.
 */
function buildVoiceIds(configPath?: string): Record<string, string> {
  const ids: Record<string, string> = { ...DEFAULT_VOICE_IDS };
  if (configPath) {
    if (!existsSync(configPath)) {
      console.error(`ERROR: --voice-config ${configPath} not found.`);
      process.exit(1);
    }
    try {
      const json = JSON.parse(readFileSync(configPath, "utf8"));
      for (const [speaker, voiceId] of Object.entries(json)) {
        if (typeof voiceId === "string" && voiceId.length > 0) {
          ids[speaker] = voiceId;
        }
      }
    } catch (err) {
      console.error(`ERROR: failed to parse ${configPath}: ${(err as Error).message}`);
      process.exit(1);
    }
  }
  for (const speaker of Object.keys(ids)) {
    const envKey = `VOICE_ID_${speaker.toUpperCase().replace(/:/g, "_")}`;
    const envValue = process.env[envKey];
    if (envValue && envValue.length > 0) {
      ids[speaker] = envValue;
    }
  }
  return ids;
}

interface Settings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  text_prefix: string;
}

const DEFAULT_SETTINGS: Settings = {
  stability: 0.55,
  similarity_boost: 0.78,
  style: 0.2,
  use_speaker_boost: true,
  text_prefix: "",
};

const SPEAKER_SETTINGS: Record<string, Settings> = {
  elara: {
    stability: 0.55,
    similarity_boost: 0.8,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*lucid, warm, allow audible breath at line ends; the warmth is calibrated, not casual* ",
  },
  the_human: {
    stability: 0.5,
    similarity_boost: 0.8,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*spoken low and steady, conspiratorial, like a transmission through the walls; never hurries* ",
  },
  antiquarian: {
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix:
      "*archival, patient, slightly elevated formality; the inscriber's register — every sentence is being written down as it is spoken* ",
  },
  adjudicator_locke: {
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*contractual cadence; precise consonants; warmth shows only in the pauses, never in the words themselves* ",
  },
  vex_solene: {
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.35,
    use_speaker_boost: true,
    text_prefix:
      "*Maestro-institutional in early stages; allow a softer register on lines that reference the bench or the prince — the softening is the Engineer-trace surfacing* ",
  },
  dmc_clone_companion: {
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*clone-soul cadence with progressive individuation across stages; stage 1 sounds borrowed, stage 5 sounds theirs* ",
  },
  jericho_jones: {
    stability: 0.5,
    similarity_boost: 0.78,
    style: 0.15,
    use_speaker_boost: true,
    text_prefix:
      "*laconic gunfighter cadence; long pauses; the line after the silence is usually the real one* ",
  },
  "hierarchy:master_of_rlyeh": {
    stability: 0.65,
    similarity_boost: 0.78,
    style: 0.4,
    use_speaker_boost: true,
    text_prefix:
      "*archival, wet, never raises; reads aloud at four in the morning to a room that has not asked for the reading* ",
  },
  "hierarchy:pale_emissary": {
    stability: 0.7,
    similarity_boost: 0.78,
    style: 0.15,
    use_speaker_boost: true,
    text_prefix:
      "*tall, courteous, patient beyond instinct; never coerces — presents; the politeness is the threat* ",
  },
  "hierarchy:reckoning_daughter": {
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.2,
    use_speaker_boost: true,
    text_prefix:
      "*meticulous, warm — the warmth of someone who finds correctness comforting; pause before each numerical figure; the pause is the discipline* ",
  },
  malkia_ukweli: {
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix:
      "*declarative, present-tense, never uses the word 'should' — replaces it with 'will' or 'do'; the verb the Antiquarian is the noun of* ",
  },
  source: {
    stability: 0.65,
    similarity_boost: 0.78,
    style: 0.45,
    use_speaker_boost: true,
    text_prefix:
      "*theological present-tense; permeable phrases; 'you are' more often than 'you will be'; the cadence of attention without an object* ",
  },
  kael_trace: {
    stability: 0.55,
    similarity_boost: 0.78,
    style: 0.3,
    use_speaker_boost: true,
    text_prefix:
      "*half a register lower than the Source; memory of being a person leaks through; the leak is rare and precious* ",
  },
  system: {
    stability: 0.6,
    similarity_boost: 0.75,
    style: 0.15,
    use_speaker_boost: true,
    text_prefix:
      "*neutral, distant, declarative; gender-neutral; reverberant; one register, no shifts* ",
  },
  dual: {
    stability: 0.6,
    similarity_boost: 0.78,
    style: 0.25,
    use_speaker_boost: true,
    text_prefix:
      "*PRODUCER NOTE: dual cue — record elara and the_human takes separately, mix at equal volume with 12ms stereo offset* ",
  },
};

// ─── Source data normalisation ─────────────────────────────

interface NormalisedLine {
  /** Stable id used as the manifest key and MP3 filename. */
  id: string;
  /** Speaker key for SPEAKER_SETTINGS lookup. */
  speaker: string;
  /** Cleaned TTS body (stage directions stripped, [CUE] markers removed). */
  text: string;
  /** Original text including stage directions, kept for reference. */
  rawText: string;
  /** Source bank — drives outputDir + s3 prefix. */
  source: "romance" | "encounters" | "act7";
  /** Sub-bucket within the source (locke / master_of_rlyeh / humanity / ...). */
  bucket: string;
  /** Optional voice direction extracted from the raw text. */
  voiceDirection?: string;
}

const STAGE_DIRECTION_RE = /\([^)]+\)/g;
const CUE_MARKER_RE = /\[CUE[^\]]*\]/g;
const VO_DIRECTION_RE = /\[(?!CUE)[^\]]+\]/g;

function extractDirections(raw: string): string {
  const matches = raw.match(VO_DIRECTION_RE) ?? [];
  return matches.join(" | ").trim();
}

function cleanForTts(raw: string): string {
  return raw
    .replace(CUE_MARKER_RE, "")
    .replace(VO_DIRECTION_RE, "")
    .replace(STAGE_DIRECTION_RE, "")
    .replace(/\s+/g, " ")
    .trim();
}

function bucketFromLineId(lineId: string, fallback: string): string {
  const dot = lineId.indexOf(".");
  return dot >= 0 ? lineId.slice(0, dot) : fallback;
}

function fromNpcLine(
  line: NpcLine & { surfaces?: ReadonlyArray<string> },
  source: "romance",
  bucket: string,
): NormalisedLine {
  const raw = line.text;
  return {
    id: line.lineId,
    speaker: line.npcKey,
    text: cleanForTts(raw),
    rawText: raw,
    source,
    bucket,
    voiceDirection: extractDirections(raw) || undefined,
  };
}

function fromEncounterLine(
  line: EncounterLine,
  source: "encounters" | "act7",
  bucket: string,
): NormalisedLine {
  const raw = line.text;
  return {
    id: line.lineId,
    speaker: line.speaker,
    text: cleanForTts(raw),
    rawText: raw,
    source,
    bucket,
    voiceDirection: extractDirections(raw) || undefined,
  };
}

function buildAllLines(): NormalisedLine[] {
  const lines: NormalisedLine[] = [];

  // Romance scenes
  const romance: Array<[string, ReadonlyArray<NpcLine & { surfaces?: ReadonlyArray<string> }>]> = [
    ["locke", LOCKE_ROMANCE_BANK as ReadonlyArray<NpcLine & { surfaces?: ReadonlyArray<string> }>],
    ["vex", VEX_ROMANCE_BANK as ReadonlyArray<NpcLine & { surfaces?: ReadonlyArray<string> }>],
    ["elara", ELARA_ROMANCE_BANK as ReadonlyArray<NpcLine & { surfaces?: ReadonlyArray<string> }>],
    ["dmc_companion", DMC_ROMANCE_BANK as ReadonlyArray<NpcLine & { surfaces?: ReadonlyArray<string> }>],
    ["jericho_jones", JERICHO_ROMANCE_BANK as ReadonlyArray<NpcLine & { surfaces?: ReadonlyArray<string> }>],
  ];
  for (const [bucket, bank] of romance) {
    for (const line of bank) {
      lines.push(fromNpcLine(line, "romance", bucket));
    }
  }

  // Hierarchy + Malkia + Source/Kael encounters
  const encounters: Array<[string, ReadonlyArray<EncounterLine>]> = [
    ["master_of_rlyeh", MASTER_OF_RLYEH_LINES],
    ["pale_emissary", PALE_EMISSARY_LINES],
    ["reckoning_daughter", RECKONING_DAUGHTER_LINES],
    ["malkia_revolution", MALKIA_REVOLUTION_QUESTLINE],
    ["source_kael", SOURCE_KAEL_DIALOGUE_LINES],
  ];
  for (const [bucket, bank] of encounters) {
    for (const line of bank) {
      lines.push(fromEncounterLine(line, "encounters", bucketFromLineId(line.lineId, bucket)));
    }
  }

  // Act 7 epilogue VO scripts
  const act7: Array<[string, ReadonlyArray<EncounterLine>]> = [
    ["humanity", ACT7_EPILOGUE_VO_SCRIPTS.humanity],
    ["machine", ACT7_EPILOGUE_VO_SCRIPTS.machine],
    ["balance", ACT7_EPILOGUE_VO_SCRIPTS.balance],
    ["soldier_command", ACT7_EPILOGUE_VO_SCRIPTS.soldier_command],
    ["silence", ACT7_EPILOGUE_VO_SCRIPTS.silence],
  ];
  for (const [bucket, bank] of act7) {
    for (const line of bank) {
      lines.push(fromEncounterLine(line, "act7", `act7_${bucket}`));
    }
  }

  return lines;
}

// ─── ElevenLabs + S3 ───────────────────────────────────────

function resolveSettings(speaker: string): Settings {
  return SPEAKER_SETTINGS[speaker] ?? DEFAULT_SETTINGS;
}

async function generateSpeech(line: NormalisedLine, voiceId: string): Promise<Buffer> {
  const settings = resolveSettings(line.speaker);
  const body = (settings.text_prefix ?? "") + line.text;
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: body,
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

async function uploadToS3(audio: Buffer, id: string, s3Prefix: string): Promise<string> {
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
      Body: audio,
      ContentType: "audio/mpeg",
      CacheControl: "public, max-age=31536000",
    }),
  );
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(fullKey)}`;
}

function localPathFor(line: NormalisedLine): { dir: string; relPath: string } {
  const subdir = line.source === "romance"
    ? `audio/romance/${line.bucket}`
    : line.source === "encounters"
      ? `audio/encounters/${line.bucket}`
      : `audio/act7/${line.bucket}`;
  const dir = join(PUBLIC_ROOT, subdir);
  return { dir, relPath: `/${subdir}/${line.id}.mp3` };
}

function s3PrefixFor(line: NormalisedLine): string {
  if (line.source === "romance") return `Romance Voices/${line.bucket}`;
  if (line.source === "encounters") return `Encounter Voices/${line.bucket}`;
  return `Act 7 Epilogue Voices/${line.bucket}`;
}

function manifestPathFor(source: NormalisedLine["source"]): string {
  switch (source) {
    case "romance":
      return join(SHARED_ROOT, "romanceScenesVoManifest.json");
    case "encounters":
      return join(SHARED_ROOT, "encountersVoManifest.json");
    case "act7":
      return join(SHARED_ROOT, "act7EpilogueVoManifest.json");
  }
}

interface ManifestEntry {
  url: string;
  speaker: string;
  voiceDirection?: string;
}

function loadManifest(path: string): Record<string, ManifestEntry> {
  if (!existsSync(path)) return {};
  return JSON.parse(readFileSync(path, "utf8")) as Record<string, ManifestEntry>;
}

function saveManifest(path: string, manifest: Record<string, ManifestEntry>): void {
  writeFileSync(path, JSON.stringify(manifest, null, 2) + "\n");
}

// ─── CLI ───────────────────────────────────────────────────

interface Args {
  source: "all" | "romance" | "encounters" | "act7";
  only?: string;
  dryRun: boolean;
  skipTodo: boolean;
  voiceConfig?: string;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const get = (flag: string) => {
    const eq = argv.find((a) => a.startsWith(flag + "="));
    if (eq) return eq.split("=")[1];
    const idx = argv.indexOf(flag);
    return idx >= 0 ? argv[idx + 1] : undefined;
  };
  const sourceArg = get("--source");
  return {
    source: (sourceArg as Args["source"]) ?? "all",
    only: get("--only"),
    dryRun: argv.includes("--dry-run"),
    skipTodo: argv.includes("--skip-todo"),
    voiceConfig: get("--voice-config"),
  };
}

async function main(): Promise<void> {
  const args = parseArgs();

  if (!ELEVENLABS_KEY && !args.dryRun) {
    console.error("ERROR: ELEVENLABS_API_KEY not set (use --dry-run to plan).");
    process.exit(1);
  }

  const VOICE_IDS = buildVoiceIds(args.voiceConfig);
  const todoSpeakers = Object.entries(VOICE_IDS)
    .filter(([, v]) => v === TODO_VOICE)
    .map(([k]) => k);
  if (todoSpeakers.length > 0) {
    console.log(
      `[content-vo] ${todoSpeakers.length} speaker(s) still have placeholder voice IDs ` +
        `(${todoSpeakers.join(", ")}). ` +
        `Override via VOICE_ID_<SPEAKER> env vars or --voice-config <file.json>.`,
    );
  }

  const all = buildAllLines();
  const filtered = all.filter((l) => {
    if (args.source !== "all" && l.source !== args.source) return false;
    if (args.only && l.bucket !== args.only && !l.bucket.endsWith(args.only)) return false;
    return true;
  });

  console.log(
    `[content-vo] ${filtered.length}/${all.length} lines selected ` +
      `(source=${args.source}, only=${args.only ?? "*"}).`,
  );

  // Per-source manifest aggregation — load all up front so a
  // crash mid-run leaves the prior progress intact.
  const manifests: Record<NormalisedLine["source"], Record<string, ManifestEntry>> = {
    romance: loadManifest(manifestPathFor("romance")),
    encounters: loadManifest(manifestPathFor("encounters")),
    act7: loadManifest(manifestPathFor("act7")),
  };

  let generated = 0;
  let skipped = 0;
  let todoSkipped = 0;
  let s3Failed = 0;

  for (const line of filtered) {
    const manifest = manifests[line.source];
    if (manifest[line.id]) {
      skipped++;
      continue;
    }
    const voiceId = VOICE_IDS[line.speaker] ?? TODO_VOICE;
    if (voiceId === TODO_VOICE) {
      if (args.skipTodo) {
        todoSkipped++;
        continue;
      }
      const envKey = `VOICE_ID_${line.speaker.toUpperCase().replace(/:/g, "_")}`;
      console.log(
        `! ${line.id}: speaker '${line.speaker}' has no voice id. ` +
          `Set ${envKey} or use --voice-config voice-ids.json. ` +
          `Pass --skip-todo to silence this warning.`,
      );
      todoSkipped++;
      continue;
    }

    if (args.dryRun) {
      console.log(`[dry] ${line.id} → ${line.speaker} (${line.text.length} chars)`);
      generated++;
      continue;
    }

    try {
      const audio = await generateSpeech(line, voiceId);
      const { dir, relPath } = localPathFor(line);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, `${line.id}.mp3`), audio);

      let url = relPath;
      if (HAS_AWS) {
        try {
          url = await uploadToS3(audio, line.id, s3PrefixFor(line));
        } catch (s3err) {
          s3Failed++;
          console.warn(
            `⚠ ${line.id}: ${(audio.length / 1024).toFixed(0)}KB → local OK, S3 failed (${(s3err as Error).message.slice(0, 80)})`,
          );
        }
      }

      manifest[line.id] = {
        url,
        speaker: line.speaker,
        voiceDirection: line.voiceDirection,
      };
      saveManifest(manifestPathFor(line.source), manifest);

      generated++;
      console.log(
        `✓ ${line.id} (${line.speaker}, ${(audio.length / 1024).toFixed(0)}KB)` +
          (HAS_AWS ? " → S3" : " → local"),
      );
    } catch (err) {
      console.error(`✗ ${line.id}: ${(err as Error).message}`);
    }
  }

  console.log(
    `[content-vo] done. generated=${generated} skipped=${skipped} ` +
      `todo_skipped=${todoSkipped} s3_failed=${s3Failed}`,
  );
}

main().catch((err) => {
  console.error("[content-vo] fatal:", err);
  process.exit(1);
});
