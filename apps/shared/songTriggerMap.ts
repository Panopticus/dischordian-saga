/* Song-to-Feature Trigger Map — songs activating game features */
export interface SongTrigger { songId: string; songTitle: string; album: string; trigger: string; }

export const SONG_TRIGGER_MAP: SongTrigger[] = [
  { songId: "governance-hub", songTitle: "Governance Hub", album: "dischordian-logic", trigger: "Governance Hub notification badge appears; Elara/Human tutorial begins if not yet visited" },
  { songId: "building-the-architect", songTitle: "Building the Architect", album: "age-of-privacy", trigger: "Mechronis Academy arena unlocks in Collector's Arena" },
  { songId: "the-prisoner", songTitle: "The Prisoner", album: "age-of-privacy", trigger: "Panopticon arena unlocks; 'Kael's Revenge' Loredex entry highlighted" },
  { songId: "welcome-to-celebration", songTitle: "Welcome to Celebration", album: "dischordian-logic", trigger: "Project Celebration lore fragment appears in Journal" },
  { songId: "last-words", songTitle: "Last Words", album: "dischordian-logic", trigger: "Antiquarian Chronicle entry: 'I remember the Engineer. I remember exactly where I was.'" },
  { songId: "planet-of-the-wolf", songTitle: "Planet of the Wolf", album: "dischordian-logic", trigger: "Thaloria arena + Hierophant questline hint surfaces" },
  { songId: "the-two-witnesses", songTitle: "The Two Witnesses", album: "silence-in-heaven", trigger: "Two Witnesses Loredex entry fully reveals; optional cinematic offered" },
  { songId: "hacking-reality", songTitle: "Hacking Reality", album: "dischordian-logic", trigger: "Battle of Nexon Loredex event entry unlocks" },
  { songId: "sih-track-24", songTitle: "Silence in Heaven", album: "silence-in-heaven", trigger: "Mandatory dark mode. Full UI hidden. No interruptions. Lore notification post-song only." },
  { songId: "sih-track-32", songTitle: "The Fall of New Babylon", album: "silence-in-heaven", trigger: "New Babylon Loredex entry: 'FALLEN' status added" },
  { songId: "sih-track-36", songTitle: "The Final Truth", album: "silence-in-heaven", trigger: "Album completion badge + Antiquarian Journal entry generated" },
  { songId: "sih-track-37", songTitle: "The Story is Yours Now", album: "silence-in-heaven", trigger: "Governance Hub: 'The Testimony Question' vote unlocks" },
];
