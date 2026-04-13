/* ═══════════════════════════════════════════════════════
   LYRICS ROUTER — LLM-powered lyrics generation with lore context
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

export const lyricsRouter = router({
  generate: publicProcedure
    .input(
      z.object({
        songName: z.string(),
        albumName: z.string(),
        artistName: z.string(),
        characters: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const { songName, albumName, artistName, characters } = input;

      const characterContext =
        characters.length > 0
          ? `Featured characters in this song: ${characters.join(", ")}.`
          : "";

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a lyrics analyst for the Dischordian Saga universe by ${artistName}. 
When given a song name and album, provide the lyrics or a close approximation based on the themes and characters of the song.
The Dischordian Saga is a multimedia sci-fi/fantasy universe spanning multiple epochs.
Key themes: surveillance, rebellion, power, identity, time travel, artificial intelligence, the nature of reality.
Key characters include: The Architect, The Enigma (Malkia Ukweli), The Programmer (Dr. Daniel Cross), The Warlord, The Human, Iron Lion, The Necromancer, The Oracle, Agent Zero, The Collector.
Format the output as plain lyrics text with blank lines between sections/verses.
Do NOT include section labels like [Verse 1] or [Chorus] - just the lyrics themselves.
If you know the actual lyrics, provide them. If not, create thematically appropriate lyrics that match the song's known characters and themes.`,
          },
          {
            role: "user",
            content: `Provide the lyrics for "${songName}" from the album "${albumName}" by ${artistName}.
${characterContext}
Return only the lyrics text, no commentary or labels.`,
          },
        ],
      });

      const rawContent = response.choices?.[0]?.message?.content;
      const lyrics =
        (typeof rawContent === "string" ? rawContent.trim() : "") ||
        "// TRANSMISSION CORRUPTED — LYRICS UNAVAILABLE //";

      return { lyrics };
    }),
});
