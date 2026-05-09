/**
 * Companion router — chat with The Human + Elara.
 *
 * As of the NPC-depth Tier 0 LLM teardown, this router is purely
 * scripted: free-form LLM chat has been removed (along with
 * apps/server/_core/llm.ts). The chat procedures return banked stubs
 * matching the existing `process.env.ELARA_LLM !== "on"` production
 * path. Free-form responsiveness will return through the Conversational
 * Q&A Library work (#10 in the NPC depth plan).
 */
import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { companionMessages, companionRelationships } from "../../db/schema";
import { eq, and, desc } from "drizzle-orm";

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
    { id: "my_deck", text: "Look at my deck and tell me what's wrong.", category: "games" },
    { id: "my_faction", text: "Is my faction the right fit?", category: "games" },
    { id: "matchup", text: "I keep losing to one faction. How do I counter it?", category: "games" },
    { id: "cards_general", text: "Tell me about the card warfare simulations.", category: "games" },
    { id: "engineer_deck", text: "Why did the Engineer invent the deck in the first place?", category: "games" },
    { id: "bloodborn", text: "What's the Bloodborn Spell really doing?", category: "games" },
    { id: "trade", text: "What's the real purpose of Trade Empire?", category: "games" },
    { id: "fight", text: "What's the Collector's Arena really about?", category: "games" },
    { id: "cades", text: "How does CADES technology actually work?", category: "lore" },
  ],
};

function getHumanFollowupChoices(category: string, level: number) {
  if (category === "personal") return HUMAN_DIALOG_CHOICES.followup_personal;
  if (category === "music") return HUMAN_DIALOG_CHOICES.followup_music;
  if (category === "games") return HUMAN_DIALOG_CHOICES.followup_games;
  if (category === "lore") return HUMAN_DIALOG_CHOICES.followup_lore;
  if (level >= 50) return HUMAN_DIALOG_CHOICES.greeting_high;
  if (level >= 15) return HUMAN_DIALOG_CHOICES.greeting_mid;
  return HUMAN_DIALOG_CHOICES.greeting_low;
}

export const companionRouter = router({
  // Chat with The Human — banked stub. The scripted dialog trees in
  // apps/shared/dialogTrees/humanAct1.ts handle progression; this
  // procedure exists so the chat UI has a consistent server surface
  // until the Conversational Q&A Library (#10) replaces it.
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
    .mutation(async ({ input }) => {
      const choices = getHumanFollowupChoices(
        input.category || "lore",
        input.relationshipLevel,
      );
      return {
        message:
          "[The Human is listening but not speaking freely.] Use the scripted choice list to continue.",
        choices,
        relationshipGain: 0,
      };
    }),

  // Chat with Elara — banked stub. Same shape as chatWithHuman.
  chatWithElara: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(2000),
      history: z.array(z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })).optional(),
      relationshipLevel: z.number().min(0).max(100).default(0),
      moralityScore: z.number().min(-100).max(100).default(0),
      deckContext: z.object({
        faction: z.string().optional(),
        generalDefId: z.string().optional(),
        deckSize: z.number().optional(),
        recentWins: z.number().optional(),
        recentLosses: z.number().optional(),
      }).optional(),
      category: z.string().optional(),
    }))
    .mutation(async () => {
      return {
        message:
          "[Elara is listening but not speaking freely.] Use the scripted choice list to continue.",
        relationshipGain: 0,
      };
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
