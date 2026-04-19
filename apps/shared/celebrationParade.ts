/* ═══════════════════════════════════════════════════════
   CELEBRATION PARADE DAYS

   Every seventh day the Park stages a Parade. The rides
   stay open. The Mascoteers all walk. A beloved Apprentice
   "graduates early" at the end of the route. No one
   explains where they go. The programme says "home."

   This file provides the cosmetic banner + descriptor that
   the Apprentice page renders on parade days. Deeper
   mechanics (forced multi-card sequences, early-graduation
   lottery) are intentionally out of scope for this pass —
   the hook is in place for a future integration.
   ═══════════════════════════════════════════════════════ */

export interface ParadeDay {
  /** Trial day number (1-indexed). */
  day: number;
  /** Banner title stamped above the day's card. */
  title: string;
  /** Brochure-voice subtitle. */
  subtitle: string;
  /** Accent colour used for the banner. */
  color: string;
  /** The Mascoteer who leads today's parade. */
  leadMascoteerId: string;
  /** One-line flavor line displayed beneath the banner. */
  flavor: string;
}

export const CELEBRATION_PARADE_DAYS: ParadeDay[] = [
  {
    day: 7,
    title: "The First Parade",
    subtitle: "A Welcome-Waltz For All New Friends!",
    color: "#E8B14A",
    leadMascoteerId: "the_conductor",
    flavor:
      "Conni leads from the bandshell. Forty Apprentices march in perfect step. One of you will be personally congratulated by the Prince at the end. Just one.",
  },
  {
    day: 14,
    title: "The Masquerade Parade",
    subtitle: "Bring Your Best Smile!",
    color: "#9AB4D4",
    leadMascoteerId: "mr_unblink",
    flavor:
      "Mr. Unblink hands out masks at the Promenade gates. Every mask is already your face. Every mask is already smiling. The Studio requires you to wear one all day.",
  },
  {
    day: 21,
    title: "The Royal Parade",
    subtitle: "His Highness Demands Your Company!",
    color: "#C43A5E",
    leadMascoteerId: "the_prince",
    flavor:
      "The Prince rides at the front in his golden cart. He will call one name from the crowd for a royal meet-and-greet. The cart does not return with the same number of occupants it departed with.",
  },
  {
    day: 28,
    title: "Closing Night Fireworks",
    subtitle: "A Celebration YOU Won't Forget!",
    color: "#7EC8A4",
    leadMascoteerId: "the_seeker_child",
    flavor:
      "Red lights the first fuse himself, hands trembling with excitement. The fireworks spell out the names of every graduate in the sky. Yours is up there, too — even though the trial isn't quite over. They had to print the programme in advance.",
  },
];

/**
 * Returns parade metadata for the given trial day, or undefined on
 * non-parade days. Called by the Apprentice page to decide whether to
 * render the parade banner above the daily decision card.
 */
export function getParadeForDay(day: number): ParadeDay | undefined {
  return CELEBRATION_PARADE_DAYS.find(p => p.day === day);
}

export function isParadeDay(day: number): boolean {
  return CELEBRATION_PARADE_DAYS.some(p => p.day === day);
}
