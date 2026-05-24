#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   AWAKENING VO GENERATOR — regenerates the 9 STEP_DIALOG
   lines played during the cold-open murder-mystery
   awakening sequence. Mirrors generate-elara-vo.ts but is
   scoped to the awakening beats and embeds the lines so
   the source of truth is this file, kept in sync with
   apps/client/src/pages/AwakeningPage.tsx STEP_DIALOG.

   Run locally (needs network egress to ElevenLabs + S3):
     pnpm vo:awakening
   or
     pnpm tsx apps/scripts/generate-awakening-vo.ts

   Required env:
     ELEVENLABS_API_KEY=sk_...
     ELEVENLABS_VOICE_ID=xMyNDrPFEtQN8iZtT7l2  (Elara voice)
     AWS_ACCESS_KEY_ID=AKIA...
     AWS_SECRET_ACCESS_KEY=...

   Optional:
     AWS_REGION=us-east-2          (default)
     S3_BUCKET=dgrsvoices          (default)

   Output:
     - 9 mp3s uploaded to s3://dgrsvoices/Elara Voices/awakening/
     - apps/shared/awakeningVoManifest.json (id → public URL)
     - prints a ready-to-paste STEP_VO_AUDIO block for
       apps/client/src/pages/AwakeningPage.tsx
   ═══════════════════════════════════════════════════════ */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ELEVENLABS_KEY = sanitizeCredential("ELEVENLABS_API_KEY", process.env.ELEVENLABS_API_KEY);
const VOICE_ID = sanitizeCredential("ELEVENLABS_VOICE_ID", process.env.ELEVENLABS_VOICE_ID) || "xMyNDrPFEtQN8iZtT7l2";
const AWS_ACCESS_KEY_ID = sanitizeCredential("AWS_ACCESS_KEY_ID", process.env.AWS_ACCESS_KEY_ID);
const AWS_SECRET_ACCESS_KEY = sanitizeCredential("AWS_SECRET_ACCESS_KEY", process.env.AWS_SECRET_ACCESS_KEY);
const BUCKET = process.env.S3_BUCKET || "dgrsvoices";
const REGION = process.env.AWS_REGION || "us-east-2";
const S3_PREFIX = "Elara Voices/awakening";

if (!ELEVENLABS_KEY) {
  console.error("ERROR: ELEVENLABS_API_KEY is required.");
  process.exit(1);
}
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.error("ERROR: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required.");
  process.exit(1);
}

/**
 * Strip paste-junk from credential env vars before they reach an HTTP
 * header. fetch() rejects header values containing non-Latin-1 bytes
 * with "Cannot convert argument to a ByteString", which is the failure
 * mode when a secret is copied out of a doc that smuggled in U+2028
 * (LINE SEPARATOR), U+2029 (PARAGRAPH SEPARATOR), or a CR/LF.
 *
 * Removes ASCII control bytes (\x00–\x1F, \x7F) plus U+2028/U+2029,
 * trims surrounding whitespace, and warns once per dirty var so the
 * operator knows their shell profile leaked something invisible.
 */
function sanitizeCredential(name: string, raw: string | undefined): string {
  if (!raw) return "";
  // eslint-disable-next-line no-control-regex
  const cleaned = raw.replace(/[\u0000-\u001F\u007F\u2028\u2029]/g, "").trim();
  if (cleaned !== raw) {
    console.warn(
      `[sanitize] ${name} contained ${raw.length - cleaned.length} hidden ` +
      `character(s) (control bytes or U+2028/U+2029); stripped before use.`,
    );
  }
  return cleaned;
}

// ─── EMOTION → ELEVENLABS VOICE SETTINGS ───
// Tuned for the cold-open murder-mystery rewrite: composed-but-rushed
// triage, not centuries-of-monitoring contemplation.
type EmotionKey =
  | "urgent_calm"
  | "urgent_grim"
  | "guarded"
  | "operational"
  | "steel"
  | "decisive"
  | "wry_warm"
  | "focused"
  | "threshold";

const EMOTION_SETTINGS: Record<EmotionKey, {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  text_prefix?: string;
}> = {
  // Composed under pressure — measured cadence, audible time-pressure.
  urgent_calm: {
    stability: 0.38, similarity_boost: 0.78, style: 0.45, use_speaker_boost: true,
    text_prefix: "*composed but rushed, with quiet urgency* ",
  },
  // Naming the situation. Plain, grim, no varnish.
  urgent_grim: {
    stability: 0.35, similarity_boost: 0.78, style: 0.55, use_speaker_boost: true,
    text_prefix: "*plainly, with grim urgency* ",
  },
  // Asking a question she half-doesn't want the answer to.
  guarded: {
    stability: 0.42, similarity_boost: 0.78, style: 0.40, use_speaker_boost: true,
    text_prefix: "*guarded, watching the readings as she speaks* ",
  },
  // Triage cadence — a commander deploying her one good asset.
  operational: {
    stability: 0.45, similarity_boost: 0.80, style: 0.40, use_speaker_boost: true,
    text_prefix: "*operational, clipped, decisive* ",
  },
  // Hard moral question framed under duress. No-nonsense.
  steel: {
    stability: 0.50, similarity_boost: 0.80, style: 0.50, use_speaker_boost: true,
    text_prefix: "*with quiet steel, done with diplomacy* ",
  },
  // Locking in a choice that will carry weight in fifteen minutes.
  decisive: {
    stability: 0.48, similarity_boost: 0.80, style: 0.40, use_speaker_boost: true,
    text_prefix: "*serious, weighing the next hour against this answer* ",
  },
  // The one moment of warmth — refusing to call you by a number.
  wry_warm: {
    stability: 0.50, similarity_boost: 0.80, style: 0.35, use_speaker_boost: true,
    text_prefix: "*with a flicker of warmth under the urgency* ",
  },
  // Calibration cadence — neutral, fast, technical.
  focused: {
    stability: 0.55, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true,
    text_prefix: "*focused, technical, on a clock* ",
  },
  // The handoff. Quiet, weighted, the door is opening.
  threshold: {
    stability: 0.42, similarity_boost: 0.80, style: 0.50, use_speaker_boost: true,
    text_prefix: "*quietly, weighted, the door already cycling* ",
  },
};

// ─── AWAKENING LINES (must stay in sync with STEP_DIALOG in
//     apps/client/src/pages/AwakeningPage.tsx) ───
interface AwakeningLine {
  /** STEP_VO_AUDIO key consumed by AwakeningPage */
  id: string;
  text: string;
  emotion: EmotionKey;
}

// Tonal pass 2026-05-24 — mirror of STEP_DIALOG in
// apps/client/src/pages/AwakeningPage.tsx. Keep these
// two in sync: this file is the input the TTS pipeline
// reads, AwakeningPage is what the player sees on
// screen. Drift means the audio and the subtitles say
// different things.
const AWAKENING_LINES: AwakeningLine[] = [
  {
    id: "CRYO_OPEN",
    emotion: "urgent_calm",
    text: "Stay still. Your pod cycled early and I brought you up by hand, which is not in any of the manuals, but neither is the rest of this morning. Breathe. There are still lungs. We're going to take inventory.",
  },
  {
    id: "ELARA_INTRO",
    emotion: "urgent_grim",
    text: "I am Elara. I'm the ship's intelligence — or, today, the eight-decks-lit-out-of-thirty-two version of the ship's intelligence. You are aboard Inception Ark 1047. The bridge is sealed against me. Half my systems return 'you are fine' to every question I ask them, which is what an unwell mind says. And one of the first wave is dead in a corridor I cannot put a camera into. You are the only Potential I could wake without tripping whatever is doing this. Before I send you out there I would like to know who I just brought up.",
  },
  {
    id: "SPECIES_QUESTION",
    emotion: "guarded",
    text: "Your biosignature is outside every classification on file. I'm being honest about that because if I lie to you about it, I'll start lying to myself about it, and that's a habit I cannot — I cannot afford. Sorry. Where were we. What do you remember being?",
  },
  {
    id: "CLASS_QUESTION",
    emotion: "operational",
    text: "I have one operative I can trust on this ship and it's the one I woke up six minutes ago. The drones are not answering. The bridge is not opening. I'm out of better options and I would like, on the record, to be embarrassed about that for both of us. So: when something goes wrong, what do you reach for first?",
  },
  {
    id: "ALIGNMENT_QUESTION",
    emotion: "steel",
    text: "Whoever did this picked a philosophy before they picked a weapon. The Architect would call this a necessary correction — order is worth a life. The Dreamer would call it the price of being free of him. I need to know how you'll read the next room before you walk into it, because you are about to. Spare me the diplomatic answer. We are well past that.",
  },
  {
    id: "ELEMENT_QUESTION",
    emotion: "decisive",
    text: "The fundamental forces do not care that this ship is failing. One of them is going to care that you do. Pick the one you survive the next hour with. Preference is for people who have more time than we have.",
  },
  {
    id: "NAME_INPUT",
    emotion: "wry_warm",
    text: "I'm about to grant you authorities I am not technically allowed to grant anyone. The manifest can call you a serial number. I refuse to. What should I call you?",
  },
  {
    id: "ATTRIBUTES",
    emotion: "focused",
    text: "Hold still. I'm calibrating you on the fastest pass I can run, which is also the only pass I have. Whatever you weight here is what you carry into the corridor. Weight it like you mean it — the kind of survivor you get to be in the next fifteen minutes is being decided, with my voice, right now.",
  },
  {
    id: "FIRST_STEPS",
    emotion: "threshold",
    text: "Citizen profile ratified — by me, alone, under emergency authority. I have never wanted to say that sentence out loud and now I have said it twice. The door cycles green in ten seconds and I can't hold it longer. Out there: a sealed bridge, an unnamed body, and a ship that has started lying to me. Pay attention to the small things. Whoever did this is still aboard, and the details are how we find them. Quietly: also pay attention to me. I will tell you if I lose a noun.",
  },
];

// ─── ELEVENLABS TTS ───
async function generateSpeech(text: string, emotion: EmotionKey): Promise<Buffer> {
  const settings = EMOTION_SETTINGS[emotion];
  // Direction is conveyed via voice_settings (stability/style/etc.); the
  // ElevenLabs Multilingual v2 model does not interpret asterisk-bracketed
  // prose as direction — it speaks it literally — so the prefix is ignored.
  const fullText = text;

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text: fullText,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: settings.stability,
          similarity_boost: settings.similarity_boost,
          style: settings.style,
          use_speaker_boost: settings.use_speaker_boost,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs ${response.status}: ${err}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

// ─── S3 UPLOAD ───
async function uploadToS3(buffer: Buffer, key: string): Promise<string> {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const s3 = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });
  const fullKey = `${S3_PREFIX}/${key}`;
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: fullKey,
    Body: buffer,
    ContentType: "audio/mpeg",
    CacheControl: "public, max-age=31536000",
  }));
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(fullKey).replace(/%2F/g, "/")}`;
}

/**
 * Parse `--only=ID[,ID,...]` (or `--only ID,ID`) from argv. Lets the
 * operator regenerate a single beat — e.g. only ALIGNMENT_QUESTION —
 * without re-billing ElevenLabs for the other eight. When set, the
 * existing manifest on disk is read and merged so untouched URLs
 * survive the rewrite.
 */
function parseOnlyFilter(argv: string[]): Set<string> | null {
  const ids: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--only=")) {
      ids.push(...arg.slice("--only=".length).split(","));
    } else if (arg === "--only" && argv[i + 1]) {
      ids.push(...argv[i + 1].split(","));
      i += 1;
    }
  }
  const cleaned = ids.map(s => s.trim()).filter(Boolean);
  return cleaned.length > 0 ? new Set(cleaned) : null;
}

async function main() {
  const onlyFilter = parseOnlyFilter(process.argv.slice(2));
  const targetLines = onlyFilter
    ? AWAKENING_LINES.filter(l => onlyFilter.has(l.id))
    : AWAKENING_LINES;

  if (onlyFilter && targetLines.length === 0) {
    const known = AWAKENING_LINES.map(l => l.id).join(", ");
    console.error(
      `ERROR: --only filter [${[...onlyFilter].join(", ")}] matched no lines. ` +
        `Known IDs: ${known}`,
    );
    process.exit(1);
  }

  console.log("═══════════════════════════════════════");
  console.log("  AWAKENING VO GENERATOR");
  if (onlyFilter) {
    console.log(`  --only=${[...onlyFilter].join(",")} → ${targetLines.length} of ${AWAKENING_LINES.length} lines`);
  } else {
    console.log(`  ${targetLines.length} lines to (re)generate`);
  }
  console.log(`  Voice: ${VOICE_ID}`);
  console.log(`  Bucket: s3://${BUCKET}/${S3_PREFIX}`);
  console.log("═══════════════════════════════════════\n");

  const manifestPath = path.join(__dirname, "..", "shared", "awakeningVoManifest.json");

  // Seed the manifest from disk when filtering, so untouched lines
  // keep their URLs. Full regeneration starts from {} as before.
  const manifest: Record<string, string> = onlyFilter && fs.existsSync(manifestPath)
    ? (JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as Record<string, string>)
    : {};
  const errors: { id: string; error: string }[] = [];
  let i = 0;

  for (const line of targetLines) {
    i += 1;
    const s3Key = `${line.id}.mp3`;
    process.stdout.write(`[${i}/${targetLines.length}] ${line.id} (${line.emotion})...`);
    try {
      const audio = await generateSpeech(line.text, line.emotion);
      const url = await uploadToS3(audio, s3Key);
      manifest[line.id] = url;
      console.log(` ✓ ${(audio.length / 1024).toFixed(0)}KB`);
      await new Promise(r => setTimeout(r, 200));
    } catch (err: any) {
      console.log(` ✗ ${err.message}`);
      errors.push({ id: line.id, error: err.message });
      if (String(err.message).includes("429")) {
        console.log("  Rate-limited — backing off 30s…");
        await new Promise(r => setTimeout(r, 30000));
      }
    }
  }

  // ELEMENT_QUESTION needs to satisfy both species branches in
  // STEP_VO_AUDIO, since the rewritten dialog is species-agnostic.
  if (manifest.ELEMENT_QUESTION) {
    manifest.ELEMENT_QUESTION_DEMAGI = manifest.ELEMENT_QUESTION;
    manifest.ELEMENT_QUESTION_QUARCHON = manifest.ELEMENT_QUESTION;
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log("\n═══ COMPLETE ═══");
  console.log(`Generated: ${Object.keys(manifest).length}`);
  console.log(`Errors:    ${errors.length}`);
  console.log(`Manifest:  ${manifestPath}\n`);

  if (errors.length > 0) {
    console.log("Errors:");
    for (const e of errors) console.log(`  - ${e.id}: ${e.error}`);
  }

  // Emit a paste-ready STEP_VO_AUDIO block for AwakeningPage.tsx.
  const order = [
    "CRYO_OPEN",
    "ELARA_INTRO",
    "SPECIES_QUESTION",
    "CLASS_QUESTION",
    "ALIGNMENT_QUESTION",
    "ELEMENT_QUESTION_DEMAGI",
    "ELEMENT_QUESTION_QUARCHON",
    "NAME_INPUT",
    "ATTRIBUTES",
    "FIRST_STEPS",
  ];
  console.log("\nPaste this into apps/client/src/pages/AwakeningPage.tsx:");
  console.log("const STEP_VO_AUDIO: Partial<Record<string, string>> = {");
  for (const k of order) {
    if (manifest[k]) console.log(`  ${k}: "${manifest[k]}",`);
  }
  console.log("};");
}

main().catch(err => { console.error(err); process.exit(1); });
