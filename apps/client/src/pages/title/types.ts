/* Shared row type used by the ticker, panel, and video player.
   Mirrors the shape returned by `trpc.announcements.listActive`.
   Kept local so client files don't import from the server package. */

export type AnnouncementCategory =
  | "ark_alert"
  | "transmission_incoming"
  | "archival_footage"
  | "overlay";

export type AnnouncementPriority = "normal" | "high";

export type AnnouncementAudience =
  | "all"
  | "unauth"
  | "authed"
  | "act_ge_3"
  | "light_aligned"
  | "dark_aligned";

export interface AnnouncementRow {
  id: number;
  slug: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  title: string;
  body: string | null;
  artUrl: string | null;
  linkUrl: string | null;
  videoUrl: string | null;
  videoPosterUrl: string | null;
  videoDurationSec: number | null;
  triggerOnTitle: boolean;
  triggerProbability: number;
  audience: AnnouncementAudience;
  publishedAt: Date | string;
  expiresAt: Date | string | null;
  firstSeenAt?: Date | string | null;
  dismissedAt?: Date | string | null;
}
