/* ═══════════════════════════════════════════════════════
   PERSONAL QUARTERS VISITOR SYSTEM

   Players can invite others to tour their decorated quarters.
   Visitors can react, rate rooms, and leave messages.
   Creates social engagement and incentivizes decoration.

   Inspired by: FFXIV Housing, Animal Crossing visits,
   WoW garrison followers
   ═══════════════════════════════════════════════════════ */

/* ─── TYPES ─── */

export interface QuarterVisit {
  id: string;
  hostUserId: number;
  visitorUserId: number;
  visitedAt: string; // ISO date
  /** Rooms the visitor saw */
  roomsViewed: string[];
  /** Reactions left (emoji-style) */
  reactions: VisitorReaction[];
  /** Optional guest book message */
  guestBookMessage?: string;
  /** Rating 1-5 stars */
  rating?: number;
}

export interface VisitorReaction {
  zone: string;
  itemId?: string;
  emoji: "❤️" | "🔥" | "✨" | "😍" | "🤯" | "👏" | "💎" | "⚡";
}

export interface GuestBookEntry {
  userId: number;
  userName: string;
  message: string;
  rating: number;
  visitedAt: string;
}

export interface QuarterPublicProfile {
  userId: number;
  userName: string;
  /** Which zones are open for visitors */
  openZones: string[];
  /** Total items placed */
  totalItems: number;
  /** Theme/style tag */
  styleTag: "minimalist" | "collector" | "warrior" | "scholar" | "nature" | "tech" | "royal" | "dark";
  /** Average visitor rating */
  averageRating: number;
  /** Total visits received */
  totalVisits: number;
  /** Featured screenshot */
  screenshotUrl?: string;
  /** Is currently accepting visitors */
  isOpen: boolean;
}

/* ─── VISITOR REWARDS ─── */

export interface VisitReward {
  type: "xp" | "dream" | "inspiration";
  amount: number;
}

/** Host earns rewards when visitors visit and react */
export function calculateHostRewards(visit: QuarterVisit): VisitReward[] {
  const rewards: VisitReward[] = [
    { type: "xp", amount: 10 }, // Base XP for hosting
  ];

  // Bonus for reactions
  if (visit.reactions.length > 0) {
    rewards.push({ type: "dream", amount: Math.min(visit.reactions.length * 2, 20) });
  }

  // Bonus for guest book entry
  if (visit.guestBookMessage) {
    rewards.push({ type: "xp", amount: 5 });
  }

  // Bonus for high rating
  if (visit.rating && visit.rating >= 4) {
    rewards.push({ type: "inspiration", amount: 1 });
  }

  return rewards;
}

/** Visitor earns rewards for exploring */
export function calculateVisitorRewards(visit: QuarterVisit): VisitReward[] {
  const rewards: VisitReward[] = [
    { type: "xp", amount: 5 }, // Base XP for visiting
  ];

  // Bonus for viewing multiple zones
  if (visit.roomsViewed.length >= 3) {
    rewards.push({ type: "dream", amount: 5 });
  }
  if (visit.roomsViewed.length >= 5) {
    rewards.push({ type: "dream", amount: 10 });
  }

  return rewards;
}

/* ─── VISIT LIMITS ─── */

export const MAX_VISITS_PER_DAY = 5;
export const MAX_REACTIONS_PER_VISIT = 10;
export const GUEST_BOOK_MAX_LENGTH = 200;

/** Check if user can visit another player today */
export function canVisitToday(visitsToday: number): boolean {
  return visitsToday < MAX_VISITS_PER_DAY;
}

/* ─── FEATURED QUARTERS ─── */

/** Criteria for featuring a player's quarters on a public gallery */
export interface FeaturedCriteria {
  minItems: number;
  minRating: number;
  minVisits: number;
  minZonesDecorated: number;
}

export const FEATURED_CRITERIA: FeaturedCriteria = {
  minItems: 15,
  minRating: 4.0,
  minVisits: 10,
  minZonesDecorated: 3,
};

export function qualifiesForFeatured(profile: QuarterPublicProfile): boolean {
  return (
    profile.totalItems >= FEATURED_CRITERIA.minItems &&
    profile.averageRating >= FEATURED_CRITERIA.minRating &&
    profile.totalVisits >= FEATURED_CRITERIA.minVisits &&
    profile.openZones.length >= FEATURED_CRITERIA.minZonesDecorated
  );
}

/* ─── STYLE TAGS ─── */

export const STYLE_TAGS = [
  { id: "minimalist", label: "Minimalist", icon: "◻️", description: "Clean lines, open space" },
  { id: "collector", label: "Collector", icon: "🏛️", description: "Every surface has a story" },
  { id: "warrior", label: "Warrior", icon: "⚔️", description: "Trophies of conquest" },
  { id: "scholar", label: "Scholar", icon: "📚", description: "Knowledge above all" },
  { id: "nature", label: "Nature", icon: "🌿", description: "Green and growing" },
  { id: "tech", label: "Tech", icon: "🔧", description: "Cutting edge upgrades" },
  { id: "royal", label: "Royal", icon: "👑", description: "Fit for an Archon" },
  { id: "dark", label: "Dark", icon: "🖤", description: "Shadows and secrets" },
] as const;
