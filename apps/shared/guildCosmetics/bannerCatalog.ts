/**
 * Guild Banner / Emblem catalog — Tier 4C.
 *
 * Banners are unlocked from guild quests, war wins, and conspiracy
 * first-solves. Unlocked banner keys live in `guild_cosmetics.unlockedBanners`
 * (JSON array). The currently equipped banner lives in `guild_cosmetics.bannerKey`.
 *
 * Mottoes are free-text (max 80 chars, profanity-filtered server-side).
 */

export type BannerSource =
  | "starter"
  | "quest_reward"
  | "war_reward"
  | "conspiracy_first_solve"
  | "purchase";

export interface GuildBannerDef {
  readonly bannerKey: string;
  readonly name: string;
  readonly description: string;
  readonly source: BannerSource;
  readonly factionAlignment?: "empire" | "insurgency" | "neutral";
  readonly iconKey: string;
  readonly accentColor: string;
}

export const GUILD_BANNERS: readonly GuildBannerDef[] = [
  /* ─── STARTER (auto-unlocked at guild creation) ─── */
  {
    bannerKey: "banner_default",
    name: "Default Banner",
    description: "The blank canvas every guild begins with.",
    source: "starter",
    iconKey: "Flag",
    accentColor: "#94a3b8",
  },

  /* ─── QUEST REWARDS ─── */
  {
    bannerKey: "banner_warlord_pennant",
    name: "Warlord's Pennant",
    description: "Earned by winning 50 PvP card duels in a week.",
    source: "quest_reward",
    iconKey: "Swords",
    accentColor: "#dc2626",
  },
  {
    bannerKey: "banner_witnesses",
    name: "Banner of the Two Witnesses",
    description: "Earned by clearing 10 co-op raids in a week.",
    source: "quest_reward",
    factionAlignment: "neutral",
    iconKey: "Heart",
    accentColor: "#7c3aed",
  },
  {
    bannerKey: "banner_seasonal_champion",
    name: "Champion's Standard",
    description: "Earned when a member reaches Diamond+ in a season.",
    source: "quest_reward",
    iconKey: "Crown",
    accentColor: "#fbbf24",
  },
  {
    bannerKey: "banner_legion",
    name: "Legion of the Loredex",
    description: "500 ranked card wins in a single season.",
    source: "quest_reward",
    iconKey: "Swords",
    accentColor: "#dc2626",
  },

  /* ─── WAR REWARDS (per territory) ─── */
  {
    bannerKey: "banner_panopticon_core",
    name: "Banner of the Panopticon Core",
    description: "Awarded to guilds that hold the Panopticon Core.",
    source: "war_reward",
    factionAlignment: "empire",
    iconKey: "Eye",
    accentColor: "#0ea5e9",
  },
  {
    bannerKey: "banner_iron_lion_citadel",
    name: "Iron Lion Citadel Banner",
    description: "Awarded to guilds that hold the Iron Lion Citadel.",
    source: "war_reward",
    factionAlignment: "insurgency",
    iconKey: "Shield",
    accentColor: "#f97316",
  },
  {
    bannerKey: "banner_oracles_sanctum",
    name: "Oracle's Sanctum Banner",
    description: "Awarded to guilds that hold the Oracle's Sanctum.",
    source: "war_reward",
    factionAlignment: "neutral",
    iconKey: "Sparkles",
    accentColor: "#8b5cf6",
  },
  {
    bannerKey: "banner_architect_workshop",
    name: "Architect's Workshop Banner",
    description: "Awarded to guilds that hold the Architect's Workshop.",
    source: "war_reward",
    factionAlignment: "empire",
    iconKey: "Building",
    accentColor: "#f59e0b",
  },

  /* ─── CONSPIRACY FIRST-SOLVES ─── */
  {
    bannerKey: "banner_antiquarian",
    name: "Antiquarian's Mark",
    description: "Awarded to first-discoverer guilds of any Conspiracy Board.",
    source: "conspiracy_first_solve",
    iconKey: "Scroll",
    accentColor: "#fbbf24",
  },
  {
    bannerKey: "banner_thought_virus_cured",
    name: "Inoculated",
    description: "First-discoverer of the Thought Virus board.",
    source: "conspiracy_first_solve",
    iconKey: "MessageCircle",
    accentColor: "#10b981",
  },
  {
    bannerKey: "banner_celebration_uncovered",
    name: "Project Celebration Uncovered",
    description: "First-discoverer of the Project Celebration board.",
    source: "conspiracy_first_solve",
    iconKey: "Lock",
    accentColor: "#f472b6",
  },

  /* ─── ACHIEVEMENT-LIKE ─── */
  {
    bannerKey: "banner_standard_bearer",
    name: "Standard Bearer",
    description: "10,000 Guild War contribution in a season.",
    source: "quest_reward",
    iconKey: "Flag",
    accentColor: "#dc2626",
  },
];

const BANNER_BY_KEY = new Map<string, GuildBannerDef>(
  GUILD_BANNERS.map((b) => [b.bannerKey, b]),
);

export function getGuildBanner(bannerKey: string): GuildBannerDef | undefined {
  return BANNER_BY_KEY.get(bannerKey);
}

export function getBannersBySource(source: BannerSource): readonly GuildBannerDef[] {
  return GUILD_BANNERS.filter((b) => b.source === source);
}

/** Default starter banner every new guild gets at creation. */
export const STARTER_BANNER_KEY = "banner_default";

/**
 * Profanity gate for guild mottoes. Bare-bones substring match —
 * extend with a proper service (Tier 5) once content moderation
 * tooling lands.
 */
const PROFANITY_LIST: readonly string[] = [
  // Add only universally-flagged terms; nuanced moderation should
  // route through the existing content-moderation pipeline.
  "fuck", "shit", "cunt", "bitch", "asshole",
];

export function validateMotto(motto: string): { ok: true } | { ok: false; reason: string } {
  if (motto.length > 80) return { ok: false, reason: "too_long" };
  if (motto.length === 0) return { ok: true };
  const lower = motto.toLowerCase();
  for (const word of PROFANITY_LIST) {
    if (lower.includes(word)) {
      return { ok: false, reason: "profanity" };
    }
  }
  return { ok: true };
}
