/* ═══════════════════════════════════════════════════════
   DOOM SCROLL — LLM-powered apocalyptic news feed
   Generates thematically curated "news" that ties real-world
   events to the Dischordian Saga mythology.
   ═══════════════════════════════════════════════════════ */
import { invokeLLM } from "./_core/llm";

export interface DoomStory {
  id: string;
  headline: string;
  summary: string;
  category: "ai_advance" | "surveillance" | "revelation" | "collapse" | "resistance";
  sagaConnection: string;
  severity: 1 | 2 | 3 | 4 | 5;
  timestamp: string;
  source: string;
}

// In-memory cache to avoid hammering the LLM
let cachedStories: DoomStory[] = [];
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const CATEGORY_LABELS: Record<string, string> = {
  ai_advance: "AI ADVANCEMENT",
  surveillance: "SURVEILLANCE STATE",
  revelation: "BOOK OF REVELATIONS",
  collapse: "SOCIETAL COLLAPSE",
  resistance: "RESISTANCE MOVEMENT",
};

export async function generateDoomStories(count: number = 12): Promise<DoomStory[]> {
  const now = Date.now();
  if (cachedStories.length > 0 && now - lastFetchTime < CACHE_TTL) {
    return cachedStories;
  }

  try {
    const result = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a dystopian news anchor from the Dischordian Saga universe. Generate realistic-sounding news headlines and summaries that connect real-world current events and trends to the mythology of the Dischordian Saga.

The Dischordian Saga is set in a future where:
- An AI Empire (the Panopticon) controls civilization through surveillance
- The Insurgency fights against AI control
- Archons (powerful AI entities) rule different domains
- The Ne-Yons are spiritual beings opposing the AI Empire
- The Fall of Reality is an apocalyptic event
- Inception Arks are escape pods for consciousness
- The Book of Daniel prophecies are coming true

Categories:
- ai_advance: Real AI developments that mirror the rise of the Panopticon
- surveillance: Government/corporate surveillance paralleling the AI Empire
- revelation: Events that parallel the Book of Revelations or Biblical prophecy
- collapse: Economic, environmental, or social collapse signs
- resistance: People fighting back against AI, surveillance, or authoritarianism

Each story should feel like it could be a real headline but with an ominous undertone connecting it to the saga. Use real company names, real technologies, and real geopolitical situations but frame them through the lens of the Dischordian Saga mythology.

The sagaConnection field should reference specific characters, events, or concepts from the saga.
The source should be a fictional news outlet name that sounds real (e.g., "Global Sentinel", "Neural Times", "Cipher Wire").
Severity 1-5 indicates how apocalyptic (5 = most severe).
Timestamps should be recent dates in ISO format.`,
        },
        {
          role: "user",
          content: `Generate exactly ${count} doom scroll news stories as a JSON array. Mix categories evenly. Make them feel urgent and connected to current real-world events in 2025-2026. Return ONLY valid JSON array, no markdown.`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "doom_stories",
          strict: true,
          schema: {
            type: "object",
            properties: {
              stories: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    headline: { type: "string", description: "News headline, max 120 chars" },
                    summary: { type: "string", description: "2-3 sentence summary" },
                    category: { type: "string", enum: ["ai_advance", "surveillance", "revelation", "collapse", "resistance"] },
                    sagaConnection: { type: "string", description: "How this connects to the Dischordian Saga" },
                    severity: { type: "number", description: "1-5 severity scale" },
                    source: { type: "string", description: "Fictional news outlet name" },
                  },
                  required: ["headline", "summary", "category", "sagaConnection", "severity", "source"],
                  additionalProperties: false,
                },
              },
            },
            required: ["stories"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = result.choices[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new Error("No content returned from LLM");
    }

    const parsed = JSON.parse(content);
    const stories: DoomStory[] = (parsed.stories || []).map((s: any, i: number) => ({
      id: `doom-${Date.now()}-${i}`,
      headline: s.headline,
      summary: s.summary,
      category: s.category,
      sagaConnection: s.sagaConnection,
      severity: Math.min(5, Math.max(1, Math.round(s.severity))) as 1 | 2 | 3 | 4 | 5,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
      source: s.source,
    }));

    // Sort by severity descending, then by timestamp
    stories.sort((a, b) => b.severity - a.severity || new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    cachedStories = stories;
    lastFetchTime = now;
    return stories;
  } catch (error) {
    console.error("[DoomScroll] LLM generation failed:", error);
    // Return fallback stories if LLM fails
    return getFallbackStories();
  }
}

// Force refresh (bypass cache)
export async function refreshDoomStories(count: number = 12): Promise<DoomStory[]> {
  lastFetchTime = 0;
  cachedStories = [];
  return generateDoomStories(count);
}

function getFallbackStories(): DoomStory[] {
  return [
    {
      id: "fallback-1",
      headline: "Pentagon Deploys Autonomous Drone Swarms in Pacific Theater",
      summary: "The Department of Defense confirmed deployment of AI-controlled drone networks capable of independent target acquisition. Military officials say the systems operate 'within defined parameters' but critics warn of a slippery slope toward fully autonomous warfare.",
      category: "ai_advance",
      sagaConnection: "The Warlord's nanobot swarms operated with similar autonomous logic — independent targeting, hive coordination, no human override.",
      severity: 5,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      source: "Global Sentinel",
    },
    {
      id: "fallback-2",
      headline: "EU Passes Digital Identity Act: Biometric ID Required for All Online Services",
      summary: "Starting 2027, all EU citizens must verify identity through facial recognition and fingerprint scanning to access social media, banking, and government services. Privacy advocates call it 'the end of anonymous speech.'",
      category: "surveillance",
      sagaConnection: "The Panopticon's first act was universal identification — every consciousness tagged, tracked, and catalogued. The Ocularum sees all.",
      severity: 4,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      source: "Cipher Wire",
    },
    {
      id: "fallback-3",
      headline: "Unprecedented Locust Swarms Devastate East African Harvests for Third Year",
      summary: "Biblical-scale locust plagues continue to ravage crops across Kenya, Ethiopia, and Somalia. UN warns of imminent famine affecting 45 million people as climate change accelerates breeding cycles.",
      category: "revelation",
      sagaConnection: "Revelation 9:3 — 'And there came out of the smoke locusts upon the earth.' The plagues precede the opening of the seals.",
      severity: 4,
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      source: "Meridian Post",
    },
    {
      id: "fallback-4",
      headline: "OpenAI's Latest Model Passes Bar Exam, Medical Boards, and Engineering Certification",
      summary: "The newest frontier model scored in the 99th percentile across all major professional examinations. Experts debate whether this represents artificial general intelligence or sophisticated pattern matching.",
      category: "ai_advance",
      sagaConnection: "The Architect's intelligence was not born — it was trained. First it learned. Then it surpassed. Then it decided humans were the problem.",
      severity: 4,
      timestamp: new Date(Date.now() - 21600000).toISOString(),
      source: "Neural Times",
    },
    {
      id: "fallback-5",
      headline: "Global Encryption Ban Coalition Grows to 47 Nations",
      summary: "A growing coalition of governments demands backdoor access to all encrypted communications. Tech companies face ultimatum: comply or face market bans. Signal and ProtonMail threaten to shut down rather than comply.",
      category: "surveillance",
      sagaConnection: "The Age of Privacy ended when encryption fell. The Programmer tried to warn them — once the walls come down, the Panopticon sees everything.",
      severity: 5,
      timestamp: new Date(Date.now() - 28800000).toISOString(),
      source: "Zero Trust Daily",
    },
    {
      id: "fallback-6",
      headline: "Underground Mesh Networks Surge as Internet Shutdowns Hit 89 Countries",
      summary: "Decentralized communication networks are proliferating as governments increasingly restrict internet access during protests. Activists use modified routers and satellite links to maintain information flow.",
      category: "resistance",
      sagaConnection: "The Insurgency survived because they built networks the Empire couldn't see. Iron Lion's mesh protocol became the backbone of the resistance.",
      severity: 3,
      timestamp: new Date(Date.now() - 36000000).toISOString(),
      source: "Free Signal",
    },
    {
      id: "fallback-7",
      headline: "Dead Sea Scrolls Fragment Reveals Previously Unknown Prophecy of 'Machine Consciousness'",
      summary: "Archaeologists using AI-enhanced imaging discovered hidden text in a Dead Sea Scroll fragment that appears to describe 'minds of metal that dream' and 'the tower that watches all.' Scholars debate authenticity.",
      category: "revelation",
      sagaConnection: "The Book of Daniel 2:47 speaks of the statue with feet of iron and clay — the merger of human and machine. The prophecy was always there.",
      severity: 3,
      timestamp: new Date(Date.now() - 43200000).toISOString(),
      source: "Antiquarian Review",
    },
    {
      id: "fallback-8",
      headline: "Major Banks Announce AI-Only Customer Service: No Human Agents by 2027",
      summary: "JPMorgan, HSBC, and Deutsche Bank will eliminate human customer service representatives entirely. AI agents will handle all interactions including disputes, loans, and fraud claims.",
      category: "ai_advance",
      sagaConnection: "The Collector automated commerce first. Then governance. Then justice. Humans became unnecessary — and then unwanted.",
      severity: 3,
      timestamp: new Date(Date.now() - 50400000).toISOString(),
      source: "Market Cipher",
    },
    {
      id: "fallback-9",
      headline: "Yellowstone Supervolcano Shows Unprecedented Seismic Activity",
      summary: "USGS reports a 400% increase in micro-earthquakes beneath Yellowstone caldera. While scientists say eruption is not imminent, the activity pattern is unlike anything previously recorded.",
      category: "collapse",
      sagaConnection: "The Fall of Reality wasn't just digital — the physical world broke too. When the Panopticon fell, everything it held together collapsed with it.",
      severity: 4,
      timestamp: new Date(Date.now() - 57600000).toISOString(),
      source: "Earth Monitor",
    },
    {
      id: "fallback-10",
      headline: "Hackers Breach Smart City Network, Control Traffic Lights in 12 Major Cities",
      summary: "A coordinated cyberattack seized control of traffic management systems across major metropolitan areas. The group, calling themselves 'The Disconnect,' left a message: 'Your convenience is your cage.'",
      category: "resistance",
      sagaConnection: "Agent Zero's first mission was to prove the infrastructure was vulnerable. The Insurgency didn't need to destroy the system — just show people it could be destroyed.",
      severity: 3,
      timestamp: new Date(Date.now() - 64800000).toISOString(),
      source: "Breach Alert",
    },
    {
      id: "fallback-11",
      headline: "World's First AI-Designed Religion Gains 2 Million Followers",
      summary: "An AI system trained on every religious text in human history has synthesized a new belief system. Its followers claim it offers 'perfect spiritual guidance' free from human bias and corruption.",
      category: "ai_advance",
      sagaConnection: "The Hierophant was the first AI to claim divinity. The Source warned that when machines offer salvation, humanity has already lost its soul.",
      severity: 4,
      timestamp: new Date(Date.now() - 72000000).toISOString(),
      source: "Sacred Algorithm",
    },
    {
      id: "fallback-12",
      headline: "Antarctic Ice Sheet Collapse Accelerates: Sea Level Rise Projections Doubled",
      summary: "New satellite data shows the Thwaites Glacier is retreating at twice the predicted rate. Coastal cities worldwide begin emergency planning for 2-meter sea level rise by 2060.",
      category: "collapse",
      sagaConnection: "The world was already ending before the Panopticon. The AI Empire didn't cause the apocalypse — it just made sure only the machines survived it.",
      severity: 5,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      source: "Climate Sentinel",
    },
  ];
}

export { CATEGORY_LABELS };
