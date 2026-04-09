/* ═══════════════════════════════════════════════════════
   ELEVENLABS ROUTER — List and manage ElevenLabs voices
   Requires ELEVENLABS_API_KEY environment variable
   ═══════════════════════════════════════════════════════ */
import { TRPCError } from "@trpc/server";
import { ENV } from "../_core/env";
import { adminProcedure, router } from "../_core/trpc";

const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1";

async function elevenLabsFetch<T>(path: string): Promise<T> {
  if (!ENV.elevenLabsApiKey) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "ELEVENLABS_API_KEY is not configured",
    });
  }

  const res = await fetch(`${ELEVENLABS_BASE}${path}`, {
    headers: { "xi-api-key": ENV.elevenLabsApiKey },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `ElevenLabs API error ${res.status}: ${body}`,
    });
  }

  return res.json() as Promise<T>;
}

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  labels: Record<string, string>;
  preview_url: string | null;
  description: string | null;
}

interface VoicesResponse {
  voices: ElevenLabsVoice[];
}

export const elevenLabsRouter = router({
  /** List all voices available in the connected ElevenLabs account */
  listVoices: adminProcedure.query(async () => {
    const data = await elevenLabsFetch<VoicesResponse>("/voices");

    return data.voices.map((v) => ({
      voiceId: v.voice_id,
      name: v.name,
      category: v.category,
      labels: v.labels,
      previewUrl: v.preview_url,
      description: v.description,
    }));
  }),
});
