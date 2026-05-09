/**
 * Elara router — companion-hub chat surface for Elara.
 *
 * As of the NPC-depth Tier 0 LLM teardown, this router is purely
 * scripted: free-form LLM chat has been removed. The `chat` procedure
 * returns the same banked stub as the original
 * `process.env.ELARA_LLM !== "on"` production path. Free-form
 * responsiveness will return through the Conversational Q&A Library
 * (#10 in the NPC depth plan).
 *
 * The non-LLM `lookupEntity` procedure (loredex search) is unchanged.
 */
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { procedureRateLimit } from "../_core/procedureRateLimit";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();

// Dialog choice templates for BioWare-style conversations
const DIALOG_CHOICES = {
  greeting: [
    { id: "lore", text: "Tell me about the Dischordian Saga.", category: "lore" },
    { id: "ark", text: "What is this Inception Ark?", category: "ark" },
    { id: "games", text: "Explain the CADES simulations.", category: "games" },
    { id: "who", text: "Who are you, Elara?", category: "personal" },
    { id: "music", text: "Tell me about the music.", category: "music" },
  ],
  followup_lore: [
    { id: "characters", text: "Tell me about the key characters.", category: "lore" },
    { id: "factions", text: "What factions exist in this universe?", category: "lore" },
    { id: "timeline", text: "Walk me through the timeline.", category: "lore" },
    { id: "fall", text: "What was the Fall of Reality?", category: "lore" },
    { id: "custom", text: "[Ask something specific]", category: "custom" },
  ],
  followup_ark: [
    { id: "bridge", text: "Take me to the Command Bridge.", category: "ark" },
    { id: "conexus", text: "What is the CoNexus Core?", category: "ark" },
    { id: "crew", text: "Who else is aboard?", category: "ark" },
    { id: "decks", text: "Show me the ship's layout.", category: "ark" },
    { id: "custom", text: "[Ask something specific]", category: "custom" },
  ],
  followup_games: [
    { id: "cardgame", text: "How does the Card Game work?", category: "games" },
    { id: "tradewars", text: "Tell me about Trade Empire.", category: "games" },
    { id: "combat", text: "What about the Combat Simulator?", category: "games" },
    { id: "citizen", text: "How do I create my Citizen identity?", category: "games" },
    { id: "custom", text: "[Ask something specific]", category: "custom" },
  ],
  followup_personal: [
    { id: "past", text: "What happened to Senator Voss?", category: "personal" },
    { id: "architect", text: "Tell me about the Architect.", category: "lore" },
    { id: "panopticon", text: "What was the Panopticon?", category: "lore" },
    { id: "purpose", text: "What is your purpose now?", category: "personal" },
    { id: "custom", text: "[Ask something specific]", category: "custom" },
  ],
  followup_music: [
    { id: "albums", text: "Tell me about the albums.", category: "music" },
    { id: "favorites", text: "What songs should I listen to first?", category: "music" },
    { id: "characters_songs", text: "Which characters appear in songs?", category: "music" },
    { id: "custom", text: "[Ask something specific]", category: "custom" },
  ],
};

export const elaraRouter = router({
  // Get initial greeting and dialog choices
  getGreeting: publicProcedure.query(() => {
    return {
      message: "Operative. I am Elara — navigator, keeper of records, and guide aboard this Inception Ark. The CoNexus systems have detected your neural signature. Whether you seek knowledge of the Saga, wish to explore the Ark's systems, or are ready to enter a CADES simulation... I am here.\n\nWhat would you like to know?",
      choices: DIALOG_CHOICES.greeting,
      portrait: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_portrait_7ce2522f.png",
    };
  }),

  // Send a message to Elara — returns banked stub (LLM teardown).
  // Rate-limit retained as defense-in-depth in case a future surface
  // wires through here.
  chat: protectedProcedure
    .use(procedureRateLimit({ windowMs: 60_000, max: 5 }))
    .input(z.object({
      message: z.string().min(1).max(2000),
      category: z.string().optional(),
      pageContext: z.string().optional(),
      moralityScore: z.number().min(-100).max(100).optional(),
      history: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).max(20).optional(),
    }))
    .mutation(async () => {
      return {
        message:
          "Free-form chat is offline. Use the scripted choice list to continue.",
        choices: DIALOG_CHOICES.greeting,
      };
    }),

  // Quick lore lookup — search the loredex JSON. Non-LLM; preserved.
  lookupEntity: publicProcedure
    .input(z.object({ query: z.string().min(1).max(200) }))
    .query(({ input }) => {
      try {
        const dataPath = path.resolve(ROOT, "apps/client/src/data/loredex-data.json");
        const raw = fs.readFileSync(dataPath, "utf-8");
        const data = JSON.parse(raw);
        const entries = data.entries || [];
        const q = input.query.toLowerCase();

        const matches = entries.filter((e: { name: string; aliases?: string[]; bio?: string }) =>
          e.name.toLowerCase().includes(q) ||
          e.aliases?.some((a: string) => a.toLowerCase().includes(q)) ||
          e.bio?.toLowerCase().includes(q)
        ).slice(0, 5);

        return { results: matches };
      } catch {
        return { results: [] };
      }
    }),
});
