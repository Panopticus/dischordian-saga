/**
 * SOCIAL FEATURES
 * ══════════════════════════════════════════════════════════
 * Friends list, DMs, recently played, guild recruitment.
 */

export type FriendStatus = "pending" | "accepted" | "blocked";
export type RecruitmentStatus = "open" | "closed" | "invite_only";

export interface FriendRequest {
  fromUserId: string;
  toUserId: string;
  status: FriendStatus;
  sentAt: number;
}

export interface DirectMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  sentAt: number;
  readAt?: number;
}

export interface RecentlyPlayed {
  opponentId: string;
  opponentName: string;
  gameType: string;
  playedAt: number;
  result: "win" | "loss" | "draw";
}

export interface GuildRecruitment {
  guildId: number;
  guildName: string;
  description: string;
  requirements: string;
  status: RecruitmentStatus;
  minLevel: number;
  preferredClasses: string[];
  memberCount: number;
  maxMembers: number;
}

/** Max friends limit */
export const MAX_FRIENDS = 100;
/** Max DM length */
export const MAX_DM_LENGTH = 500;
/** DM rate limit per minute */
export const DM_RATE_LIMIT = 10;
/** Recently played history limit */
export const RECENT_PLAYED_LIMIT = 50;

export function canSendFriendRequest(currentFriendCount: number): boolean {
  return currentFriendCount < MAX_FRIENDS;
}

export function validateDMContent(content: string): { valid: boolean; reason?: string } {
  if (!content.trim()) return { valid: false, reason: "Message cannot be empty" };
  if (content.length > MAX_DM_LENGTH) return { valid: false, reason: `Message too long (max ${MAX_DM_LENGTH} chars)` };
  return { valid: true };
}
