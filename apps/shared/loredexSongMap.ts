/* Loredex → Song Auto-Queue Map — opening a Loredex entry queues the connected song.
 *
 * `songId` is the canonical slug used by the audio catalog. For
 * `silence-in-heaven` rows the slug must match an entry in
 * `silenceInHeavenAlbumAudio.json` (37 album positions across 18
 * songs + 19 dialog interludes). The masterBible test pins this. */
export interface LoredexSongLink { loredexId: string; songId: string; songTitle: string; album: string; }

export const LOREDEX_SONG_MAP: LoredexSongLink[] = [
  { loredexId: "entity_enigma", songId: "enigmas-lament", songTitle: "The Enigma's Lament", album: "dischordian-logic" },
  { loredexId: "entity_architect", songId: "building-the-architect", songTitle: "Building the Architect", album: "age-of-privacy" },
  { loredexId: "entity_engineer", songId: "last-words", songTitle: "Last Words", album: "dischordian-logic" },
  { loredexId: "entity_oracle", songId: "the-prisoner", songTitle: "The Prisoner", album: "age-of-privacy" },
  { loredexId: "entity_iron_lion", songId: "the-last-stand", songTitle: "The Last Stand", album: "book-of-daniel" },
  { loredexId: "entity_meme", songId: "false-prophet", songTitle: "False Prophet", album: "silence-in-heaven" },
  { loredexId: "entity_kael", songId: "identity", songTitle: "Identity", album: "book-of-daniel" },
  { loredexId: "entity_human", songId: "to-be-the-human", songTitle: "To Be the Human", album: "dischordian-logic" },
  { loredexId: "entity_antiquarian", songId: "the-final-truth", songTitle: "The Final Truth", album: "silence-in-heaven" },
  { loredexId: "entity_programmer", songId: "death-of-music", songTitle: "The Death of Music", album: "west-by-god" },
  { loredexId: "entity_enigma_storyteller", songId: "in-the-beginning-was-the-word", songTitle: "In the Beginning was the Word", album: "silence-in-heaven" },
  { loredexId: "concept_two_witnesses", songId: "the-two-witnesses", songTitle: "The Two Witnesses", album: "silence-in-heaven" },
  { loredexId: "concept_seventh_seal", songId: "silence-in-heaven", songTitle: "Silence in Heaven", album: "silence-in-heaven" },
  { loredexId: "location_new_babylon", songId: "new-babylon-goddamn", songTitle: "New Babylon Goddamn", album: "silence-in-heaven" },
  { loredexId: "location_panopticon", songId: "the-prisoner", songTitle: "The Prisoner", album: "age-of-privacy" },
  { loredexId: "location_thaloria", songId: "planet-of-the-wolf", songTitle: "Planet of the Wolf", album: "dischordian-logic" },
  { loredexId: "location_terminus", songId: "theft-of-all-time", songTitle: "Theft of All Time", album: "dischordian-logic" },
  { loredexId: "event_fall_of_reality", songId: "the-fall-of-new-babylon", songTitle: "The Fall of New Babylon", album: "silence-in-heaven" },
  { loredexId: "event_nexon", songId: "hacking-reality", songTitle: "Hacking Reality", album: "dischordian-logic" },
  { loredexId: "entity_thought_virus", songId: "medicated", songTitle: "Medicated", album: "west-by-god" },
];
