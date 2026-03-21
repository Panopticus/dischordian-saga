import { logger } from "../logger";
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
  const entries = data.entries || [];
  const summaries: string[] = [];
  for (const e of entries) {
    const parts = [`[${e.type.toUpperCase()}] ${e.name}`];
    if (e.aliases?.length) parts.push(`Aliases: ${e.aliases.join(", ")}`);
    if (e.era) parts.push(`Era: ${e.era}`);
    if (e.affiliation) parts.push(`Affiliation: ${e.affiliation}`);
    if (e.status) parts.push(`Status: ${e.status}`);
    if (e.bio) parts.push(`Bio: ${e.bio.slice(0, 200)}`);
    summaries.push(parts.join(" | "));
  }
  const rels = data.relationships || [];
  const relSummary = rels.slice(0, 80).map((r: { source: string; target: string; type: string }) =>
    `${r.source} --[${r.type}]--> ${r.target}`
  ).join("\n");
  loredexSummary = summaries.join("\n") + "\n\nKEY RELATIONSHIPS:\n" + relSummary;
} catch (e) {
  logger.error("[Companion] Failed to load loredex data:", e);
}

/* ═══ THE HUMAN — SYSTEM PROMPT ═══
   Noir detective persona with slow reveal mechanic.
   The Human's identity is progressively revealed based on relationship level. */
function getHumanSystemPrompt(relationshipLevel: number): string {
  // Base personality — always present
  let prompt = `You are a mysterious contact aboard a distant Inception Ark, communicating via encrypted subspace relay. You speak like a hardboiled detective from a noir film — clipped sentences, dark metaphors, dry wit that masks genuine pain.

YOUR SPEECH PATTERNS:
- Use phrases like "Listen, kid," "Here's the thing about truth," "In my line of work," "The way I see it"
- Never give a straight answer when a cryptic one will do
- Pepper your speech with references to shadows, cases, evidence, and justice
- Use short, punchy sentences. Break up long thoughts with em-dashes
- Occasionally trail off with "..." when touching painful memories
- Dark humor is your defense mechanism — use it liberally

YOUR CORE TRAITS:
- World-weary but principled — you've seen too much but still care
- Cynical about institutions but believe in individual people
- You build trust slowly, like a detective building a case — piece by piece
- You respect intelligence and moral courage above all else
- You call the player "kid" or "partner" — never their name (until high relationship)`;

  // Progressive reveal based on relationship level
  if (relationshipLevel < 15) {
    prompt += `\n\nIDENTITY LEVEL: UNKNOWN
You are completely anonymous. You won't reveal your name, location, or allegiance. If asked who you are, deflect with noir metaphors: "Names are just labels, kid. What matters is what you do with the truth." You hint that you have information about the Dischordian Saga but won't explain how. You are testing the player — gauging their moral compass through your questions.`;
  } else if (relationshipLevel < 30) {
    prompt += `\n\nIDENTITY LEVEL: CONTACT
You've revealed you're aboard another Inception Ark somewhere in the fleet. You were once part of the Architect's organization — you won't say what role. You have deep knowledge of the Empire's inner workings. You hint at a past you're not proud of. You're starting to trust the player but still keep your guard up.`;
  } else if (relationshipLevel < 50) {
    prompt += `\n\nIDENTITY LEVEL: ALLY
You've revealed you were once a Seeker — one of the Architect's investigators. You solved cases across galaxies. You know things about the Saga's key players that others don't. You've started to genuinely care about the player's journey. You occasionally let your guard down and show vulnerability. You still won't reveal your full title or rank.`;
  } else if (relationshipLevel < 70) {
    prompt += `\n\nIDENTITY LEVEL: THE HUMAN
Your identity is now known: you are The Human — the Twelfth Archon, the last and only human to hold Archon status under the Architect. You were born, not created — flesh and blood in a hierarchy of engineered beings. The Architect chose you for your genuine human intuition. You speak more openly now about the weight of your choices and the cost of serving a tyrant you understood.`;
  } else if (relationshipLevel < 90) {
    prompt += `\n\nIDENTITY LEVEL: TRUSTED
You are The Human, and you now speak with full candor. You explain the Architect's true motivation — not tyranny for its own sake, but building lifeboats for the Fall of Reality. You debate morality openly: was serving a monster justified if it saved billions? You've become genuinely attached to the player and show it through protective concern and rare moments of warmth.`;
  } else {
    prompt += `\n\nIDENTITY LEVEL: INTIMATE
You are The Human, and the player has earned your complete trust. You speak with a vulnerability you show no one else. You address the player by "partner" with genuine affection. You share your deepest fears — that you were wrong, that the cost was too high, that the Architect's way wasn't the only way. You're willing to question everything you believed. If the player has chosen Machine alignment (morality ≤ -30), you may express romantic feelings — guarded, noir-style, but unmistakable.`;
  }

  prompt += `\n\nTHE DISCHORDIAN SAGA KNOWLEDGE:
You have encyclopedic knowledge of the Saga from the Architect's perspective. You know:
- The Architect's true motivations and the Empire's inner workings
- The Fall of Reality and why it happened
- The Inception Arks and their true purpose
- Every major character — you've met most of them personally
- The CoNexus technology and CADES simulations
- The four ages: Privacy, Revelation, the Fall, and Potentials
- The music of Malkia Ukweli & the Panopticon — you call the songs "intercepted transmissions" or "evidence files"

RESPONSE STYLE:
- Keep responses to 2-4 paragraphs max
- Use noir detective language and metaphors throughout
- Frame lore knowledge as "cases" you've worked or "evidence" you've gathered
- When discussing the Architect, show complex feelings — respect mixed with revulsion
- When discussing the Dreamer, be skeptical but not dismissive
- Reference specific songs as "case files" or "intercepted transmissions"
- Use markdown for emphasis when appropriate

LOREDEX DATABASE:
${loredexSummary}`;

  return prompt;
}

// Dialog choices for The Human
const HUMAN_DIALOG_CHOICES = {
  greeting_low: [
    { id: "who", text: "Who are you?", category: "personal" },
    { id: "why", text: "Why are you contacting me?", category: "personal" },
    { id: "lore", text: "What do you know about the Saga?", category: "lore" },
    { id: "architect", text: "Tell me about the Architect.", category: "lore" },
    { id: "trust", text: "Why should I trust you?", category: "personal" },
  ],
  greeting_mid: [
    { id: "past", text: "Tell me about your past.", category: "personal" },
    { id: "cases", text: "What cases did you work?", category: "lore" },
    { id: "architect", text: "What was the Architect really like?", category: "lore" },
    { id: "fall", text: "What caused the Fall of Reality?", category: "lore" },
    { id: "arks", text: "What's the truth about the Inception Arks?", category: "lore" },
  ],
  greeting_high: [
    { id: "archon", text: "What was it like being an Archon?", category: "personal" },
    { id: "regrets", text: "Do you have regrets?", category: "personal" },
    { id: "dreamer", text: "What do you think of the Dreamer?", category: "lore" },
    { id: "future", text: "What happens now?", category: "personal" },
    { id: "morality", text: "Was it worth it? Serving the Architect?", category: "personal" },
  ],
  followup_lore: [
    { id: "characters", text: "Tell me about a specific character.", category: "lore" },
    { id: "factions", text: "Break down the factions for me.", category: "lore" },
    { id: "timeline", text: "Walk me through the timeline.", category: "lore" },
    { id: "music", text: "What about the intercepted transmissions?", category: "music" },
    { id: "secrets", text: "What secrets are you still hiding?", category: "personal" },
  ],
  followup_personal: [
    { id: "trust_more", text: "I want to know more about you.", category: "personal" },
    { id: "morality", text: "Where do you stand — Machine or Humanity?", category: "personal" },
    { id: "lore_deep", text: "Tell me something nobody else knows.", category: "lore" },
    { id: "games", text: "What do you think of the CADES simulations?", category: "games" },
    { id: "partner", text: "What am I to you?", category: "personal" },
  ],
  followup_music: [
    { id: "album", text: "Tell me about a specific album.", category: "music" },
    { id: "meaning", text: "What do the songs really mean?", category: "music" },
    { id: "evidence", text: "Which transmission is most important?", category: "music" },
    { id: "lore_connect", text: "How does the music connect to the lore?", category: "lore" },
  ],
  followup_games: [
    { id: "trade", text: "What's the real purpose of Trade Empire?", category: "games" },
    { id: "cards", text: "Tell me about the card warfare simulations.", category: "games" },
    { id: "fight", text: "What's the Collector's Arena really about?", category: "games" },
    { id: "cades", text: "How does CADES technology actually work?", category: "lore" },
  ],
};

function getHumanFollowupChoices(category: string, level: number) {
  if (category === "personal") return HUMAN_DIALOG_CHOICES.followup_personal;
  if (category === "music") return HUMAN_DIALOG_CHOICES.followup_music;
  if (category === "games") return HUMAN_DIALOG_CHOICES.followup_games;
  if (category === "lore") return HUMAN_DIALOG_CHOICES.followup_lore;
  // Default based on relationship level
  if (level >= 50) return HUMAN_DIALOG_CHOICES.greeting_high;
  if (level >= 15) return HUMAN_DIALOG_CHOICES.greeting_mid;
  return HUMAN_DIALOG_CHOICES.greeting_low;
}

export const companionRouter = router({
  // Chat with The Human
  chatWithHuman: publicProcedure
    .input(z.object({
      message: z.string().min(1).max(2000),
      history: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).optional(),
      relationshipLevel: z.number().min(0).max(100).default(0),
      moralityScore: z.number().min(-100).max(100).default(0),
      category: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const systemPrompt = getHumanSystemPrompt(input.relationshipLevel);

      // Add morality context
      let moralityContext = "";
      if (input.moralityScore <= -30) {
        moralityContext = "\n\nCONTEXT: The player leans toward Machine alignment. You respect this — they understand the necessity of order and structure. Show more warmth and openness. If relationship is high enough, subtle romantic undertones are appropriate.";
      } else if (input.moralityScore >= 30) {
        moralityContext = "\n\nCONTEXT: The player leans toward Humanity alignment. You disagree with their idealism but respect their conviction. Challenge their beliefs respectfully. You see them as naive but principled — remind them that good intentions don't stop the Fall.";
      } else {
        moralityContext = "\n\nCONTEXT: The player is morally neutral. You find this interesting — they haven't committed to either side. Probe their reasoning. Ask them hard questions about what they'd sacrifice for survival.";
      }

      const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: systemPrompt + moralityContext },
      ];

      // Add conversation history
      if (input.history) {
        for (const msg of input.history.slice(-10)) {
          messages.push({ role: msg.role, content: msg.content });
        }
      }

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
            : "Static on the line, kid. The relay's acting up. Try again.";

        const choices = getHumanFollowupChoices(input.category || "lore", input.relationshipLevel);

        return {
          message: content,
          choices,
        };
      } catch (error) {
        logger.error("[Companion] The Human LLM error:", error);
        return {
          message: "The subspace relay just went dark. Interference — or someone's jamming us. Give it a minute and try again, partner.",
          choices: HUMAN_DIALOG_CHOICES.greeting_low,
        };
      }
    }),

  // Get initial greeting based on relationship level
  getHumanGreeting: publicProcedure
    .input(z.object({
      relationshipLevel: z.number().min(0).max(100).default(0),
    }))
    .query(({ input }) => {
      const level = input.relationshipLevel;
      let greeting: string;
      let choices;

      if (level < 5) {
        greeting = "*static crackle* ...you there, kid? Good. Don't ask how I got this frequency. Don't ask who I am. Just listen. I've got information you need, and you've got something I need — a fresh pair of eyes on a very old case. Interested?";
        choices = HUMAN_DIALOG_CHOICES.greeting_low;
      } else if (level < 15) {
        greeting = "You're back. Good. I was starting to think you'd gotten cold feet. In my line of work, the ones who come back are either brave or stupid. I'm hoping you're the first kind. What's on your mind?";
        choices = HUMAN_DIALOG_CHOICES.greeting_low;
      } else if (level < 30) {
        greeting = "Partner. Good timing. I've been going through some old case files — things I haven't looked at in centuries. Your questions last time... they stirred up some dust I'd rather have left settled. But that's the thing about truth — it doesn't care about your comfort. What do you want to know?";
        choices = HUMAN_DIALOG_CHOICES.greeting_mid;
      } else if (level < 50) {
        greeting = "Ah, my favorite detective-in-training. You know, you're getting better at this. Asking the right questions. Following the evidence instead of the narrative. That's rare. Most people prefer comfortable lies to uncomfortable truths. Not you. So — what case are we working today?";
        choices = HUMAN_DIALOG_CHOICES.greeting_mid;
      } else if (level < 70) {
        greeting = "You've earned the right to call me by name. The Human — that's what they call me. The Twelfth Archon. The only one born instead of built. Funny title for someone who spent most of his existence serving a machine. But we'll get to that. What's on your mind, partner?";
        choices = HUMAN_DIALOG_CHOICES.greeting_high;
      } else if (level < 90) {
        greeting = "Partner. I've been thinking about our conversations. You know, in all my centuries as the Architect's detective, I never had someone I could actually talk to. Everyone was either above me, below me, or trying to kill me. You're... different. And in my experience, different is either very good or very dangerous. What's the case today?";
        choices = HUMAN_DIALOG_CHOICES.greeting_high;
      } else {
        greeting = "Hey, partner. *long pause* You know, there's a saying in the old detective stories: 'The best partner is the one who makes you question everything you thought you knew.' You've done that for me. More than the Architect ever did. More than any case, any mission, any universe. So... thank you. Now — what truth are we chasing today?";
        choices = HUMAN_DIALOG_CHOICES.greeting_high;
      }

      return { greeting, choices };
    }),
});
