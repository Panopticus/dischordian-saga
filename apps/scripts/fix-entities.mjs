import fs from 'fs';

const dataPath = './client/src/data/loredex-data.json';
const d = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// === 1. Add missing entities ===
const newEntities = [
  {
    id: "entity_88",
    name: "Wraith of Death",
    type: "character",
    bio: "A terrifying spectral entity that haunts the boundaries between dimensions. The Wraith of Death is neither alive nor dead, existing in a state of perpetual entropy. It feeds on the collapse of realities and is drawn to places where the fabric of the multiverse is thin. Those who encounter the Wraith rarely survive with their sanity intact.",
    era: "The Fall of Reality",
    affiliation: "Unaligned",
    image: "",
    aliases: ["The Reaper", "Death's Shadow"],
    first_appearance: "Silence in Heaven",
    status: "Active",
    classification: "OMEGA"
  },
  {
    id: "entity_89",
    name: "The Thought Virus",
    type: "faction",
    bio: "A memetic contagion that spreads through consciousness itself. The Thought Virus is not a biological pathogen but an idea — a self-replicating pattern of thought that rewrites the neural architecture of anyone exposed to it. Created as a weapon during the Age of Revelation, it escaped containment and now propagates freely across the multiverse, turning infected minds into nodes of a vast, distributed intelligence.",
    era: "Age of Revelation",
    affiliation: "None",
    image: "",
    aliases: ["The Memetic Plague", "The Idea That Kills"],
    first_appearance: "The Book of Daniel 2:47",
    status: "Active",
    classification: "OMEGA"
  },
  {
    id: "entity_90",
    name: "Inception Arks",
    type: "location",
    bio: "Massive vessels designed by the Engineer and the Council of Harmony as a last resort to preserve life across the multiverse. Each Inception Ark carries thousands of Potentials in cryogenic suspension, along with the genetic and cultural archives of entire civilizations. The Arks were launched during the Fall of Reality, scattered across dimensions with their communications severed. Each Ark is a self-contained world with its own AI guardian, exploration decks, and the technology to seed new civilizations.",
    era: "The Fall of Reality",
    affiliation: "The Council of Harmony",
    image: "",
    aliases: ["The Arks", "Vessels of the Potentials"],
    first_appearance: "Dischordian Logic",
    status: "Active",
    classification: "TOP SECRET"
  }
];

// Add new entities
d.entries.push(...newEntities);

// === 2. Fix relationship name mismatches ===
// These were the broken relationships - restore them with corrected names
const fixedRelationships = [
  // "The Harmony" -> "The Council of Harmony"
  { source: "Thaloria", target: "The Council of Harmony", relationship_type: "connected_to" },
  { source: "The Hierophant", target: "The Council of Harmony", relationship_type: "connected_to" },
  // "The Veron" -> "Ambassador Veron"
  { source: "Atarion", target: "Ambassador Veron", relationship_type: "connected_to" },
  // "Ambassador Voss" -> "Senator Elara Voss"
  { source: "Atarion", target: "Senator Elara Voss", relationship_type: "connected_to" },
  // "Jericho" -> "Jericho Jones"
  { source: "The Wyrmhole", target: "Jericho Jones", relationship_type: "connected_to" },
  { source: "The Terminus Swarm", target: "Jericho Jones", relationship_type: "connected_to" },
  { source: "The City", target: "Jericho Jones", relationship_type: "connected_to" },
  { source: "Akai Shi", target: "Jericho Jones", relationship_type: "connected_to" },
  // Wraith of Death relationships (new entity)
  { source: "New Babylon", target: "Wraith of Death", relationship_type: "connected_to" },
  { source: "The White Oracle", target: "Wraith of Death", relationship_type: "connected_to" },
  { source: "The Wyrmhole", target: "Wraith of Death", relationship_type: "connected_to" },
  { source: "The Terminus Swarm", target: "Wraith of Death", relationship_type: "connected_to" },
  { source: "The City", target: "Wraith of Death", relationship_type: "connected_to" },
  { source: "Jericho Jones", target: "Wraith of Death", relationship_type: "connected_to" },
  // Thought Virus and Inception Arks relationships
  { source: "Destiny", target: "The Thought Virus", relationship_type: "connected_to" },
  { source: "Destiny", target: "Inception Arks", relationship_type: "connected_to" },
];

d.relationships.push(...fixedRelationships);

// === 3. Add Silence in Heaven album songs (placeholder) ===
const silenceInHeavenSongs = [
  "The Seventh Seal", "Silence in Heaven", "The Last Trumpet", "Wormwood",
  "The Abyss Opens", "The Mark of the Beast", "Babylon Falls", "The White Throne",
  "River of Fire", "The New Jerusalem", "Alpha and Omega", "The Lamb's War",
  "Seven Thunders", "The Dragon's Fury", "Armageddon", "The Rapture",
  "Judgment Day", "The Second Death"
];

silenceInHeavenSongs.forEach((title, i) => {
  d.entries.push({
    id: `song_sih_${i + 1}`,
    name: title,
    type: "song",
    bio: `An upcoming track from the 'Silence in Heaven' album (releasing July 30, 2026). This song explores themes from the Fall of Reality and the Book of Revelation, weaving together the final chapter of the Dischordian Saga.`,
    era: "The Fall of Reality",
    affiliation: "Malkia Ukweli & the Panopticon",
    album: "Silence in Heaven",
    track_number: i + 1,
    image: "",
    aliases: [],
    status: "Upcoming",
    classification: "CLASSIFIED"
  });
});

// Update stats
const chars = d.entries.filter(e => e.type === "character").length;
const locs = d.entries.filter(e => e.type === "location").length;
const factions = d.entries.filter(e => e.type === "faction").length;
const songs = d.entries.filter(e => e.type === "song").length;

d.stats = {
  total_entries: d.entries.length,
  characters: chars,
  locations: locs,
  factions: factions,
  songs: songs,
  relationships: d.relationships.length,
};

// Add Silence in Heaven to streaming links
d.streaming_links["Silence in Heaven"] = {
  spotify: "",
  apple_music: "",
  tidal: "",
  release_date: "2026-07-30",
  status: "upcoming"
};

fs.writeFileSync(dataPath, JSON.stringify(d, null, 2));

console.log("=== UPDATED DATA ===");
console.log("Total entries:", d.entries.length);
console.log("Characters:", chars);
console.log("Locations:", locs);
console.log("Factions:", factions);
console.log("Songs:", songs);
console.log("Relationships:", d.relationships.length);
console.log("New entities added:", newEntities.map(e => e.name).join(", "));
console.log("Silence in Heaven songs added:", silenceInHeavenSongs.length);
console.log("Fixed relationships restored:", fixedRelationships.length);
