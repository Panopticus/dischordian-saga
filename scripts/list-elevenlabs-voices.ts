#!/usr/bin/env npx tsx
/* ═══════════════════════════════════════════════════════
   List all voices in your ElevenLabs account.
   Usage:
     ELEVENLABS_API_KEY=sk_... npx tsx scripts/list-elevenlabs-voices.ts
   Or set the key in your .env file and run:
     npx tsx scripts/list-elevenlabs-voices.ts
   ═══════════════════════════════════════════════════════ */
import "dotenv/config";

const API_KEY = process.env.ELEVENLABS_API_KEY;

if (!API_KEY) {
  console.error("Error: ELEVENLABS_API_KEY is not set.");
  console.error("Set it via environment variable or in your .env file.");
  process.exit(1);
}

interface Voice {
  voice_id: string;
  name: string;
  category: string;
  labels: Record<string, string>;
  preview_url: string | null;
  description: string | null;
}

async function main() {
  const res = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: { "xi-api-key": API_KEY! },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`ElevenLabs API error ${res.status}: ${body}`);
    process.exit(1);
  }

  const data = (await res.json()) as { voices: Voice[] };
  const voices = data.voices;

  console.log(`\nFound ${voices.length} voice(s) in your ElevenLabs account:\n`);
  console.log("─".repeat(90));
  console.log(
    "Name".padEnd(25) +
      "Category".padEnd(15) +
      "Voice ID".padEnd(25) +
      "Labels"
  );
  console.log("─".repeat(90));

  for (const v of voices) {
    const labels = Object.entries(v.labels || {})
      .map(([k, val]) => `${k}: ${val}`)
      .join(", ");

    console.log(
      v.name.padEnd(25) +
        v.category.padEnd(15) +
        v.voice_id.padEnd(25) +
        labels
    );
  }

  console.log("─".repeat(90));
  console.log(`\nTotal: ${voices.length} voices`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
