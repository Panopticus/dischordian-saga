/* ═══════════════════════════════════════════════════════
   TO BE THE HUMAN — Cycle B Closing Slideshow

   10-frame cinematic set to "To Be the Human"
   (Dischordian Logic). Plays when the player completes
   the Mechronis Academy semester (Cycle B ending).

   Art: uses mechronis environment art (grand hall, classroom,
   graduation) from /art/mechronis/environments/.

   See WITNESSING_NARRATIVE_PROPOSAL §4.4
   ═══════════════════════════════════════════════════════ */
import type { SlideshowFrame } from "@/components/SongSlideshow";

export const TO_BE_THE_HUMAN_TITLE = "To Be the Human";

export const TO_BE_THE_HUMAN_FRAMES: SlideshowFrame[] = [
  {
    imageSrc: "/art/mechronis/environments/mechronis_grand_hall.jpg",
    lyric: "Mechronis Academy. Orion Sector. Secret university hidden under planetary shields.",
    durationMs: 6000,
  },
  {
    imageSrc: "/art/mechronis/environments/mechronis_grand_hall.jpg",
    lyric: "He was the quiet one in our year",
    subtitle: "— The Human",
    durationMs: 5500,
  },
  {
    imageSrc: "/art/mechronis/environments/mechronis_classroom.jpg",
    lyric: "He'd show up late, build something impossible during class, and sleep through the lecture",
    durationMs: 6000,
  },
  {
    imageSrc: "/art/mechronis/environments/mechronis_classroom.jpg",
    lyric: "The Game Master loved him. The Game Master loved him more than he loved me.",
    subtitle: "— The Human",
    durationMs: 6500,
  },
  {
    imageSrc: "/art/mechronis/environments/mechronis_classroom.jpg",
    lyric: "That's not jealousy. That's a fact I carried for fifteen hundred years.",
    durationMs: 6000,
  },
  {
    imageSrc: "/art/celebration/celebration-forge-yard.png",
    lyric: "He made me a compass that only pointed toward good coffee",
    subtitle: "The Engineer's workshop, remembered",
    durationMs: 5500,
  },
  {
    imageSrc: "/art/celebration/celebration-puzzle-garden.png",
    lyric: "He told me he'd fix the galaxy by building it a better box to live in",
    durationMs: 6000,
  },
  {
    imageSrc: "/art/mechronis/environments/mechronis_classroom.jpg",
    lyric: "Then he vanished at the Battle of Nexon",
    durationMs: 5000,
  },
  {
    imageSrc: "/art/mechronis/environments/mechronis_graduation.jpg",
    lyric: "Graduation day at Mechronis. The class photo.",
    subtitle: "The Engineer at the edge, looking out of frame. Iron Lion — missing. The Seeker — center, looking at the Engineer.",
    durationMs: 8000,
  },
  {
    imageSrc: "/art/mechronis/environments/mechronis_graduation.jpg",
    lyric: "The Engineer is looking at the Seer, who is standing outside the frame with a staff.",
    subtitle: "Everyone is smiling except the ones who know.",
    durationMs: 8000,
  },
];

/**
 * Audio source — "To Be the Human" (Dischordian Logic).
 * Silently falls back to no-audio if the file is absent.
 */
export const TO_BE_THE_HUMAN_AUDIO: string | undefined =
  "/audio/music/mechronis/to-be-the-human.mp3";
