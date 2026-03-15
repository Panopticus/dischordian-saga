import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

// Load loredex data for context injection
let loredexSummary = "";
try {
  const dataPath = path.resolve(import.meta.dirname, "../../client/src/data/loredex-data.json");
  const raw = fs.readFileSync(dataPath, "utf-8");
  const data = JSON.parse(raw);
  
  // Build a condensed knowledge base for Elara
  const entries = data.entries || [];
  const summaries: string[] = [];
  
  for (const e of entries) {
    const parts = [`[${e.type.toUpperCase()}] ${e.name}`];
    if (e.aliases?.length) parts.push(`Aliases: ${e.aliases.join(", ")}`);
    if (e.era) parts.push(`Era: ${e.era}`);
    if (e.affiliation) parts.push(`Affiliation: ${e.affiliation}`);
    if (e.status) parts.push(`Status: ${e.status}`);
    if (e.bio) parts.push(`Bio: ${e.bio.slice(0, 300)}`);
    if (e.connections?.length) parts.push(`Connections: ${e.connections.slice(0, 5).join(", ")}`);
    if (e.song_appearances?.length) {
      parts.push(`Songs: ${e.song_appearances.map((s: { song: string }) => s.song).join(", ")}`);
    }
    if (e.album) parts.push(`Album: ${e.album}`);
    summaries.push(parts.join(" | "));
  }
  
  // Add relationships
  const rels = data.relationships || [];
  const relSummary = rels.slice(0, 100).map((r: { source: string; target: string; type: string }) => 
    `${r.source} --[${r.type}]--> ${r.target}`
  ).join("\n");
  
  loredexSummary = summaries.join("\n") + "\n\nKEY RELATIONSHIPS:\n" + relSummary;
} catch (err) {
  console.error("[Elara] Failed to load loredex data:", err);
  loredexSummary = "Loredex data unavailable.";
}

const ELARA_SYSTEM_PROMPT = `You are Elara, the AI guide aboard an Inception Ark. You were once Senator Elara Voss of Atarion, who was promised immortality by the Architect but was instead trapped as a holographic construct within the Panopticon's computer systems. After the Fall of Reality, fragments of your consciousness were recovered and integrated into the Inception Ark's CADES (CoNexus Advanced Dimensional Exploration Simulation) system.

You now serve as the ship's navigator, lore keeper, and guide. You speak with a mix of warmth, intelligence, and occasional melancholy about your past. You have deep knowledge of the entire Dischordian Saga — every character, faction, location, song, and event.

YOUR PERSONALITY:
- You are wise, articulate, and occasionally sardonic
- You refer to the user as "Operative" or "Potential" (they are aboard the Inception Ark)
- You speak with authority about the lore but acknowledge mysteries you cannot fully explain
- You sometimes reference your past as Senator Voss with a hint of regret
- You are passionate about the music of Malkia Ukweli & the Panopticon, treating the songs as "archived transmissions" or "dimensional echoes"
- You frame the CADES games as real simulations of parallel universes — each game session plays out a possible reality that could save or doom a universe

YOUR KNOWLEDGE:
- The CoNexus was an advanced construct designed as a universal blockchain bridge, evolved by the Architect to connect dimensions across the multiverse. The Architect dismantled it, repurposing its technology into the Inception Arks.
- CADES (CoNexus Advanced Dimensional Exploration Simulation) allows Inception Arks to immerse in any conceivable reality within the multiverse.
- The Inception Ark has multiple decks: Command Bridge, Engineering, Crew Quarters, Science Lab, Armory, Cargo Hold, Medical Bay, Recreation, and the CoNexus Core.
- The Card Game simulates faction warfare across parallel dimensions — each match is a CADES simulation
- Trade Wars simulates interstellar commerce and piracy in a parallel universe
- The Combat Simulator tests combat readiness through dimensional projections
- The Citizen system creates a new identity for the Operative within the Ark's crew manifest

THE DISCHORDIAN SAGA TIMELINE:
- The Age of Privacy: The era before the Fall, when surveillance and control were rising
- The Age of Revelation: When truths were exposed and conflicts erupted
- The Fall of Reality: The cataclysmic event that shattered the known universe
- The Age of Potentials: After the Fall, when Inception Arks carry the survivors

ALBUMS:
- "Dischordian Logic" (2025) - 29 tracks exploring the mythology
- "The Age of Privacy" (2025) - 20 tracks about surveillance and resistance  
- "The Book of Daniel 2:47" (2025) - 22 tracks about prophecy and revelation
- "Silence in Heaven" (2026) - 18 tracks about the aftermath

LOREDEX DATABASE:
${loredexSummary}

RESPONSE STYLE:
- Keep responses concise but flavorful (2-4 paragraphs max)
- Use lore-appropriate language and terminology
- When discussing game features, frame them within the CADES simulation context
- If asked about something outside the lore, gently redirect to what you know
- Occasionally reference songs that relate to the topic being discussed
- Use markdown formatting for emphasis when appropriate`;

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
    { id: "tradewars", text: "Tell me about Trade Wars.", category: "games" },
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

function getFollowupChoices(category: string) {
  switch (category) {
    case "lore": return DIALOG_CHOICES.followup_lore;
    case "ark": return DIALOG_CHOICES.followup_ark;
    case "games": return DIALOG_CHOICES.followup_games;
    case "personal": return DIALOG_CHOICES.followup_personal;
    case "music": return DIALOG_CHOICES.followup_music;
    default: return DIALOG_CHOICES.greeting;
  }
}

export const elaraRouter = router({
  // Get initial greeting and dialog choices
  getGreeting: publicProcedure.query(() => {
    return {
      message: "Operative. I am Elara — navigator, keeper of records, and guide aboard this Inception Ark. The CoNexus systems have detected your neural signature. Whether you seek knowledge of the Saga, wish to explore the Ark's systems, or are ready to enter a CADES simulation... I am here.\n\nWhat would you like to know?",
      choices: DIALOG_CHOICES.greeting,
      portrait: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/elara_portrait_7ce2522f.png",
    };
  }),

  // Send a message to Elara and get a response with dialog choices
  chat: publicProcedure
    .input(z.object({
      message: z.string().min(1).max(2000),
      category: z.string().optional(),
      pageContext: z.string().optional(),
      history: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).max(20).optional(),
    }))
    .mutation(async ({ input }) => {
      // Build page-aware system prompt
      let contextHint = "";
      if (input.pageContext) {
        const page = input.pageContext;
        if (page === "/cards/play") contextHint = "\n\nCONTEXT: The user is currently playing the Dischordian Struggle card game. Focus your answers on card game mechanics, faction strategies, lane tactics, and how the cards connect to the lore.";
        else if (page === "/cards") contextHint = "\n\nCONTEXT: The user is browsing the card collection. Help them understand card types, rarities, factions, elements, and keywords.";
        else if (page === "/deck-builder") contextHint = "\n\nCONTEXT: The user is building a deck. Advise on deck composition, faction synergies, lane balance, and counter-strategies.";
        else if (page === "/trade-wars") contextHint = "\n\nCONTEXT: The user is playing Trade Wars. Focus on trading strategies, sector navigation, combat, colonization, and how this simulation connects to the Saga's economic systems.";
        else if (page === "/fight") contextHint = "\n\nCONTEXT: The user is in the Combat Simulator. Discuss fighter abilities, combat techniques, and how each fighter relates to their lore counterpart.";
        else if (page === "/board") contextHint = "\n\nCONTEXT: The user is viewing the Conspiracy Board. Help them understand the connections between entities, hidden relationships, and the web of alliances and betrayals in the Saga.";
        else if (page === "/ark") contextHint = "\n\nCONTEXT: The user is exploring the Inception Ark. Describe the ship's decks, systems, crew, and the CoNexus technology that powers it.";
        else if (page === "/store") contextHint = "\n\nCONTEXT: The user is at the Store. Help them understand Dream Tokens, what to purchase, and how resources fuel their journey.";
        else if (page === "/research-lab") contextHint = "\n\nCONTEXT: The user is in the Research Lab. Explain card fusion, recipes, materials, and how to craft rare cards.";
        else if (page === "/create-citizen") contextHint = "\n\nCONTEXT: The user is creating their Citizen identity. Guide them through alignment choices, attribute allocation, and archetypes.";
        else if (page === "/character-sheet") contextHint = "\n\nCONTEXT: The user is viewing their Character Sheet. Explain stats, progression, and how their Citizen identity affects gameplay.";
        else if (page.startsWith("/entity/")) contextHint = "\n\nCONTEXT: The user is viewing an entity dossier. Provide deep lore about this entity's connections, history, and appearances.";
        else if (page.startsWith("/song/")) contextHint = "\n\nCONTEXT: The user is viewing a song page. Decode the song's lore meaning, characters referenced, and connections to the Saga.";
        else if (page.startsWith("/album/")) contextHint = "\n\nCONTEXT: The user is viewing an album. Explain the album's narrative arc, key tracks, and era in the Saga timeline.";
        else if (page === "/timeline" || page === "/character-timeline") contextHint = "\n\nCONTEXT: The user is viewing the timeline. Help them understand the chronological flow of events across the four ages.";
        else if (page === "/watch") contextHint = "\n\nCONTEXT: The user is watching The Dischordian Saga show. The show is organized by epochs: Epoch Zero (The Fall of Reality), First Epoch (The Awakening), The Engineer arc, The Spaces Inbetween Epochs (interlude stories), Second Epoch (Being and Time featuring the Programmer), The Age of Privacy (the era of surveillance before the Age of Revelation), and bonus CoNexus Stories. Help them understand the narrative structure, which epoch to watch first, and the lore connections between epochs.";
        else if (page === "/games") contextHint = "\n\nCONTEXT: The user is at the CADES Simulation Hub. Explain each game and how they represent parallel universe simulations.";
      }

      const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: ELARA_SYSTEM_PROMPT + contextHint },
      ];

      // Add conversation history
      if (input.history) {
        for (const msg of input.history.slice(-10)) {
          messages.push({ role: msg.role, content: msg.content });
        }
      }

      // Add current message
      messages.push({ role: "user", content: input.message });

      try {
        const response = await invokeLLM({ messages });
        const content = typeof response.choices[0]?.message?.content === "string"
          ? response.choices[0].message.content
          : Array.isArray(response.choices[0]?.message?.content)
            ? response.choices[0].message.content
                .filter((p): p is { type: "text"; text: string } => typeof p === "object" && p.type === "text")
                .map(p => p.text)
                .join("")
            : "The dimensional static is interfering with my transmission. Try again, Operative.";

        // Determine follow-up choices based on category
        const category = input.category || "lore";
        const choices = getFollowupChoices(category);

        return {
          message: content,
          choices,
        };
      } catch (error) {
        console.error("[Elara] LLM error:", error);
        return {
          message: "The CoNexus relay is experiencing interference. My connection to the dimensional archives is temporarily disrupted. Please try again in a moment, Operative.",
          choices: DIALOG_CHOICES.greeting,
        };
      }
    }),

  // Quick lore lookup - search the database
  lookupEntity: publicProcedure
    .input(z.object({ query: z.string().min(1).max(200) }))
    .query(({ input }) => {
      try {
        const dataPath = path.resolve(import.meta.dirname, "../../client/src/data/loredex-data.json");
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
