import { assetUrl } from "@shared/lib/assetUrl";
/* ═══════════════════════════════════════════════════════
   CELEBRATION PARK MAP

   Celebration presents itself as a theme park. Each Mascoteer
   runs an attraction; every daily decision is technically a
   ride, a show, or a meet-and-greet. The park map surfaces
   this so the UI can show "You are in Humming Carousel land"
   instead of just "day 6 choice."

   Lands are evocative in the brochure ("Meet your heroes!")
   and ominous in the fine print ("guests smile for the
   entire parade, without exception, without reprieve").

   Shape parity: mirrors mechronisHouses so the daily card
   header can render either "Course + Code" or "Attraction +
   Land".
   ═══════════════════════════════════════════════════════ */

export interface ParkLand {
  id: string;
  /** Public brochure name */
  name: string;
  /** Short tagline on park maps */
  tagline: string;
  /** Which Mascoteer is the cast member here */
  mascoteerId: string;
  /** Evocative colour for UI accents */
  color: string;
  /** Attractions, rides, or exhibits within this land */
  attractions: string[];
  /** The jingle's leitmotif description — used by the sfx layer */
  leitmotif: string;
  /**
   * Short ambient loop path. Silently falls back to no-audio if absent.
   * Convention: /audio/ambient/celebration/<land-id>.mp3
   */
  ambientAudio: string;
  /** Brochure-cheerful description (what guests read) */
  brochure: string;
  /** The whisper underneath (what the decisions actually feel like) */
  undercurrent: string;
}

export const CELEBRATION_PARK_LANDS: ParkLand[] = [
  {
    id: "chorus_plaza",
    name: "Chorus Plaza",
    tagline: "Every Friend Finds Their Note!",
    mascoteerId: "the_conductor",
    color: "#E8B14A",
    attractions: [
      "The Humming Carousel",
      "Sing-Along Bandshell",
      "Conni's Morning Chorus",
      "The Quiet-Coach Pavilion",
    ],
    leitmotif: "A music-box waltz in F major, slightly off-pitch on every third bar.",
    ambientAudio: assetUrl("audio/ambient/celebration/chorus-plaza.mp3"),
    brochure:
      "Start your day in our grandest gathering place! Meet Conni the Conductor and join the choir. No audition required — everyone's voice belongs here.",
    undercurrent:
      "The choir never stops, even when guests walk away. The bandshell's acoustics are designed so you can still hear yourself singing two hours after you've left.",
  },
  {
    id: "watchers_promenade",
    name: "The Watcher's Promenade",
    tagline: "Where Every Friend Is Seen!",
    mascoteerId: "mr_unblink",
    color: "#9AB4D4",
    attractions: [
      "Hall of Mirrors",
      "Mr. Unblink's Portrait Studio",
      "The Forever Selfie Booth",
      "Guest Book of Honour",
    ],
    leitmotif: "A glass-harmonica scale that never quite resolves to tonic.",
    ambientAudio: assetUrl("audio/ambient/celebration/watchers-promenade.mp3"),
    brochure:
      "Pose for a souvenir photo with Mr. Unblink! He remembers every visit. He'll mention your last one, too. Isn't that thoughtful?",
    undercurrent:
      "The portraits age in the frame. Guests who stand too long in front of their own photograph find themselves forgetting what they came in wearing.",
  },
  {
    id: "princes_domain",
    name: "The Prince's Domain",
    tagline: "A Royal Welcome For Every Guest!",
    mascoteerId: "the_prince",
    color: "#C43A5E",
    attractions: [
      "The Coronation Parade",
      "Prince's Hall of Mirrors",
      "Sharpened-Knife Banquet",
      "Royal Decree Window",
    ],
    leitmotif:
      "A fanfare trumpet that phase-shifts into a child's birthday song halfway through.",
    ambientAudio: assetUrl("audio/ambient/celebration/princes-domain.mp3"),
    brochure:
      "His Highness personally greets every visitor! Receive a proclamation written just for you. Keep your proclamation on your person at all times — we do make sure.",
    undercurrent:
      "Proclamations are contracts. Guests who lose theirs are quietly re-named by the castle clerks and added to the Parade as cast members of long standing.",
  },
  {
    id: "seeker_meadow",
    name: "The Seeker's Meadow",
    tagline: "Play Pretend With Us!",
    mascoteerId: "the_seeker_child",
    color: "#7EC8A4",
    attractions: [
      "Puzzle Garden",
      "Little Corey's Hide & Seek",
      "Storytime Under the Clockwork Tree",
      "The Lost-Child Fountain",
    ],
    leitmotif: "A nursery rhyme lullaby played on a toy piano with one key missing.",
    ambientAudio: assetUrl("audio/ambient/celebration/seeker-meadow.mp3"),
    brochure:
      "Bring the little ones! Our youngest Mascoteer loves new friends. Play games all day. The Meadow's clock is stopped at 3:47 PM — naptime is forever!",
    undercurrent:
      "The fountain keeps a running tally of guests who came in with a child and left without one. The tally resets to zero every morning. The tally has never reached zero during operating hours.",
  },
];

/**
 * Resolve which Land a given day maps to. Uses mascoteer assignment
 * so generateDailyDecision's result naturally aligns with a land
 * without requiring the UI to reach into celebrationTrial internals.
 */
export function getLandForMascoteer(mascoteerId: string): ParkLand | undefined {
  return CELEBRATION_PARK_LANDS.find(l => l.mascoteerId === mascoteerId);
}

export function getLand(id: string): ParkLand | undefined {
  return CELEBRATION_PARK_LANDS.find(l => l.id === id);
}

/**
 * Pick a deterministic attraction name for a given day + mascoteer so
 * the daily card header can show "The Humming Carousel · Day 6" — and
 * so the same day reliably surfaces the same attraction if the player
 * reloads.
 */
export function getAttractionForDay(mascoteerId: string, day: number): string | undefined {
  const land = getLandForMascoteer(mascoteerId);
  if (!land || land.attractions.length === 0) return undefined;
  return land.attractions[Math.abs(day) % land.attractions.length];
}
