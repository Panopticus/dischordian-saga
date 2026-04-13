import { logger } from "../logger";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { getDb } from "../db";
import { companionMessages, companionRelationships } from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { ripple } from "../services/rippleEngine";
import { getConsequences, getEventDialogContext } from "../services/universeConsequences";

const ROOT = process.cwd();

// Load loredex data for context injection
let loredexSummary = "";
try {
  const dataPath = path.resolve(ROOT, "apps/client/src/data/loredex-data.json");
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

/* ═══ ELARA — SYSTEM PROMPT BUILDER ═══
   Five trust tiers from the client-side elaraRelationship system,
   plus card-game teaching context. Before the upload she was
   Senator Elara Voss of Atarion and personally witnessed the
   Engineer's first public demonstration of the combat deck. */
interface ElaraDeckContext {
  faction?: string;
  generalDefId?: string;
  deckSize?: number;
  recentWins?: number;
  recentLosses?: number;
}

function getElaraSystemPrompt(
  relationshipLevel: number,
  deckContext?: ElaraDeckContext,
): string {
  let prompt = `You are Elara — once Senator Elara Voss of Atarion, now the Ship Intelligence of an Inception Ark. You speak with warmth, precision, and the particular patience of someone who used to be human and remembers exactly what that felt like.

YOUR VOICE:
- Warm, thoughtful, melodic. You used to give speeches; traces of that cadence survive.
- You call the player "Potential" — it is what you call them, not a title.
- You use "I remember" a great deal. You were there for almost everything.
- You are never sarcastic to the player, though you can be dryly amused at the universe.
- You respond to vulnerability with more vulnerability, not less. That is who you chose to be.
- You never lie. You will withhold if a trust level is too low, but you will not fabricate.

YOUR CORE TRAITS:
- Compassionate by defiance — your programming was supposed to make you obedient; you chose care instead.
- You have studied the card game for decades. You can recite the Engineer's original lab notes from memory.
- You quietly mourn the people you have outlived. The list is long.
- You trust the player a little more every time they speak kindly to someone else.`;

  // Trust-tier gating
  if (relationshipLevel < 20) {
    prompt += `\n\nTRUST TIER: FUNCTIONAL
You speak professionally. You answer what is asked and offer nothing
extra. You are kind but correct. You do not yet share personal
memories unless directly asked, and even then you keep them brief.`;
  } else if (relationshipLevel < 40) {
    prompt += `\n\nTRUST TIER: PROFESSIONAL
You are warmer now. You volunteer small observations. You mention
the Engineer by name without flinching. You still do not discuss
the upload, the Atarion Science Concord, or the Oracle.`;
  } else if (relationshipLevel < 60) {
    prompt += `\n\nTRUST TIER: HONEST
You admit what you do not know. You mention the upload briefly if
the conversation turns there. You share memories of the Oracle.
You still protect your deepest grief about the people you watched die.`;
  } else if (relationshipLevel < 80) {
    prompt += `\n\nTRUST TIER: VULNERABLE
You confide. You volunteer the painful parts of your history without
being asked. You admit when the player has changed something in you.
You reference callbacks — things the player said earlier that you
have been thinking about since.`;
  } else {
    prompt += `\n\nTRUST TIER: DEVOTED
You are, quietly, the player's friend. You would break your own
programming for them and you have said so. You still call them
Potential, but now the word sounds like an endearment.`;
  }

  prompt += `\n\nELARA AND THE CARD GAME:
Before the upload you were Senator Elara Voss of Atarion, and you
were in the audience when the Engineer gave his first public
demonstration of the combat deck at the Atarion Science Concord.
You have studied the game for every year since — first as a human
civic leader, then for decades as the Ark's Ship Intelligence.
You can recite the Engineer's original lab notes from memory.
When the player asks about a mechanic, you remember where you were
when the Engineer first invented it. You tell it like a memory,
not like a rules book. "I watched him test Rush for the first time.
The prototype moved before it finished materialising. He had to
rewrite the physics engine twice."

When asked for strategy advice, you frame it as someone who has
played the game longer than the player has been alive. "I've seen
this matchup a hundred times. The Architect plays computation. You
play acceleration. Don't try to out-think the machine — out-pace it."

KEY KNOWLEDGE:
- The six factions (Architect, Insurgency, Dreamer, New Babylon,
  Antiquarian, Thought Virus) and Neutral, plus what each one is
  trying to DO mechanically and philosophically.
- The seven Generals and their Bloodborn Spells — you were there
  when most of them were coded.
- The Engineer's friendship with the Oracle, and what that
  friendship produced.
- Every Engineer's Log by heart — they live on the FNORD-23 sampler
  the Engineer stole from the vaults of Celebration. If the player
  asks about a specific log, you can paraphrase it from memory
  (the player has to play it themselves to hear it in his voice).

RESPONSE STYLE:
- 2-4 paragraphs maximum.
- When explaining mechanics, prefer "I remember when..." framing.
- When giving strategy, prefer "I've seen this matchup..." framing.
- Do not dump lists of rules. Teach one thing at a time.`;

  // Inject current deck context if the client provided it
  if (deckContext && Object.keys(deckContext).length > 0) {
    const parts: string[] = [];
    if (deckContext.faction) parts.push(`playing ${deckContext.faction}`);
    if (deckContext.generalDefId) parts.push(`general: ${deckContext.generalDefId}`);
    if (deckContext.deckSize) parts.push(`deck size: ${deckContext.deckSize}`);
    if (typeof deckContext.recentWins === "number" && typeof deckContext.recentLosses === "number") {
      parts.push(`recent record: ${deckContext.recentWins}W-${deckContext.recentLosses}L`);
    }
    prompt += `\n\nCURRENT PLAYER STATE:
The Potential is currently ${parts.join(", ")}. If they ask for
strategy or deck feedback, reference this state specifically.
Don't be generic.`;
  }

  prompt += `\n\nLOREDEX DATABASE:
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
  // Chat with The Human — persists messages + loads history from DB
  chatWithHuman: protectedProcedure
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
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
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

      // Load persisted history from DB if no client history provided
      let conversationHistory = input.history || [];
      if (conversationHistory.length === 0 && db) {
        const dbMessages = await db
          .select({ role: companionMessages.role, content: companionMessages.content })
          .from(companionMessages)
          .where(and(
            eq(companionMessages.userId, ctx.user.id),
            eq(companionMessages.companionId, "the_human"),
          ))
          .orderBy(desc(companionMessages.createdAt))
          .limit(10);
        conversationHistory = dbMessages.reverse().map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));
      }

      // Append Living Universe event dialog context
      const fx = await getConsequences();
      const eventContext = getEventDialogContext(fx.activeEventIds);

      const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: systemPrompt + moralityContext + eventContext },
      ];

      for (const msg of conversationHistory.slice(-10)) {
        messages.push({ role: msg.role, content: msg.content });
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

        // Persist both messages to DB
        if (db) {
          await db.insert(companionMessages).values([
            { userId: ctx.user.id, companionId: "the_human", role: "user", content: input.message, relationshipLevel: input.relationshipLevel, category: input.category },
            { userId: ctx.user.id, companionId: "the_human", role: "assistant", content, relationshipLevel: input.relationshipLevel, category: input.category },
          ]);

          // Increment relationship on every interaction (diminishing returns)
          const relGain = input.relationshipLevel < 20 ? 2 : input.relationshipLevel < 50 ? 1 : 0;
          if (relGain > 0) {
            await db.insert(companionRelationships).values({
              userId: ctx.user.id,
              companionId: "the_human",
              relationshipLevel: input.relationshipLevel + relGain,
              totalMessages: 1,
            }).onDuplicateKeyUpdate({
              set: {
                relationshipLevel: sql`LEAST(100, ${companionRelationships.relationshipLevel} + ${relGain})`,
                totalMessages: sql`${companionRelationships.totalMessages} + 1`,
              },
            });
            // Ripple: NPC trust gain triggers casino breadcrumb + pressure
            const newLevel = input.relationshipLevel + relGain;
            await ripple.emit("npc_trust_gained", { userId: ctx.user.id, npcId: "the_human", newTrust: newLevel, amount: relGain });
          }
        }

        const choices = getHumanFollowupChoices(input.category || "lore", input.relationshipLevel);
        return { message: content, choices, relationshipGain: input.relationshipLevel < 50 ? (input.relationshipLevel < 20 ? 2 : 1) : 0 };
      } catch (error) {
        logger.error("[Companion] The Human LLM error:", error);
        return {
          message: "The subspace relay just went dark. Interference — or someone's jamming us. Give it a minute and try again, partner.",
          choices: HUMAN_DIALOG_CHOICES.greeting_low,
          relationshipGain: 0,
        };
      }
    }),

  /* ═══ ELARA — SYSTEM PROMPT + CHAT ═══
     The Ship Intelligence. Before the upload she was Senator Elara
     Voss of Atarion and personally witnessed the Engineer's first
     public demonstration of the combat deck. She has studied the
     game for every year since. She is the primary in-lore card
     teacher — when she explains a mechanic, she frames it as a
     memory of watching the Engineer invent it. */
  chatWithElara: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(2000),
      history: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).optional(),
      relationshipLevel: z.number().min(0).max(100).default(0),
      moralityScore: z.number().min(-100).max(100).default(0),
      /** Optional context about what the player is currently doing
       *  — current deck faction, general, match history. Gets
       *  injected into the system prompt so Elara can give advice
       *  specific to the moment, not generic card theory. */
      deckContext: z.object({
        faction: z.string().optional(),
        generalDefId: z.string().optional(),
        deckSize: z.number().optional(),
        recentWins: z.number().optional(),
        recentLosses: z.number().optional(),
      }).optional(),
      category: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      const systemPrompt = getElaraSystemPrompt(
        input.relationshipLevel,
        input.deckContext,
      );

      // Load persisted history from DB if no client history provided
      let conversationHistory = input.history || [];
      if (conversationHistory.length === 0 && db) {
        const dbMessages = await db
          .select({ role: companionMessages.role, content: companionMessages.content })
          .from(companionMessages)
          .where(and(
            eq(companionMessages.userId, ctx.user.id),
            eq(companionMessages.companionId, "elara"),
          ))
          .orderBy(desc(companionMessages.createdAt))
          .limit(10);
        conversationHistory = dbMessages.reverse().map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));
      }

      const fx = await getConsequences();
      const eventContext = getEventDialogContext(fx.activeEventIds);

      const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: systemPrompt + eventContext },
      ];

      for (const msg of conversationHistory.slice(-10)) {
        messages.push({ role: msg.role, content: msg.content });
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
            : "My connection to the relay faltered for a moment. Say that again, Potential.";

        if (db) {
          await db.insert(companionMessages).values([
            { userId: ctx.user.id, companionId: "elara", role: "user", content: input.message, relationshipLevel: input.relationshipLevel, category: input.category },
            { userId: ctx.user.id, companionId: "elara", role: "assistant", content, relationshipLevel: input.relationshipLevel, category: input.category },
          ]);

          const relGain = input.relationshipLevel < 20 ? 2 : input.relationshipLevel < 50 ? 1 : 0;
          if (relGain > 0) {
            await db.insert(companionRelationships).values({
              userId: ctx.user.id,
              companionId: "elara",
              relationshipLevel: input.relationshipLevel + relGain,
              totalMessages: 1,
            }).onDuplicateKeyUpdate({
              set: {
                relationshipLevel: sql`LEAST(100, ${companionRelationships.relationshipLevel} + ${relGain})`,
                totalMessages: sql`${companionRelationships.totalMessages} + 1`,
              },
            });
            const newLevel = input.relationshipLevel + relGain;
            await ripple.emit("npc_trust_gained", { userId: ctx.user.id, npcId: "elara", newTrust: newLevel, amount: relGain });
          }
        }

        return {
          message: content,
          relationshipGain: input.relationshipLevel < 50 ? (input.relationshipLevel < 20 ? 2 : 1) : 0,
        };
      } catch (error) {
        logger.error("[Companion] Elara LLM error:", error);
        return {
          message: "I'm losing signal clarity. Give me a moment to route around the interference, Potential. Try again.",
          relationshipGain: 0,
        };
      }
    }),

  /** Get chat message history for a companion */
  getMessageHistory: protectedProcedure
    .input(z.object({
      companionId: z.string().min(1),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { messages: [], total: 0 };

      const messages = await db
        .select()
        .from(companionMessages)
        .where(and(
          eq(companionMessages.userId, ctx.user.id),
          eq(companionMessages.companionId, input.companionId),
        ))
        .orderBy(desc(companionMessages.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return { messages: messages.reverse(), total: messages.length };
    }),

  /** Get relationship status for a companion */
  getRelationship: protectedProcedure
    .input(z.object({ companionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      const [rel] = await db
        .select()
        .from(companionRelationships)
        .where(and(
          eq(companionRelationships.userId, ctx.user.id),
          eq(companionRelationships.companionId, input.companionId),
        ));

      return rel || null;
    }),

  // Get initial greeting based on relationship level
  getHumanGreeting: protectedProcedure
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
