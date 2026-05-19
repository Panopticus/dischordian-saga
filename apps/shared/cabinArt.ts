/* ═══════════════════════════════════════════════════════
   PLAYER CABIN ART ASSETS — Backgrounds + decoration items
   ═══════════════════════════════════════════════════════ */
const S3_BG = "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/cabin-art/backgrounds";
const S3_ITEM = "https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/cabin-art/items";

export const CABIN_BACKGROUNDS: Record<string, { url: string; name: string; accent: string }> = {
  void_glow:       { url: `${S3_BG}/CABIN-001_Void_Glow.jpg`, name: "Void Glow", accent: "#33E2E6" },
  atarion_sunset:  { url: `${S3_BG}/CABIN-002_Atarion_Sunset.jpg`, name: "Atarion Sunset", accent: "#f59e0b" },
  clinical_white:  { url: `${S3_BG}/CABIN-003_Clinical_White.jpg`, name: "Clinical White", accent: "#e2e8f0" },
  detectives_lamp: { url: `${S3_BG}/CABIN-004_Detectives_Lamp.jpg`, name: "Detective's Lamp", accent: "#d97706" },
  candlelight:     { url: `${S3_BG}/CABIN-005_Candlelight.jpg`, name: "Candlelight", accent: "#fbbf24" },
  neon_dreams:     { url: `${S3_BG}/CABIN-006_Neon_Dreams.jpg`, name: "Neon Dreams", accent: "#8b5cf6" },
  corrupted:       { url: `${S3_BG}/CABIN-007_Corrupted.jpg`, name: "Corrupted", accent: "#ef4444" },
  starlight:       { url: `${S3_BG}/CABIN-008_Starlight.jpg`, name: "Starlight", accent: "#60a5fa" },
};

export const CABIN_ITEMS: Record<string, { url: string; name: string; category: string }> = {
  // Desk items
  antiquarians_journal: { url: `${S3_ITEM}/DESK-01_Antiquarians_Journal.png`, name: "Antiquarian's Journal", category: "desk" },
  elaras_crystal:       { url: `${S3_ITEM}/DESK-02_Elaras_Crystal.png`, name: "Elara's Crystal", category: "desk" },
  humans_coin:          { url: `${S3_ITEM}/DESK-03_Humans_Coin.png`, name: "The Human's Coin", category: "desk" },
  data_pad:             { url: `${S3_ITEM}/DESK-04_Data_Pad.png`, name: "Data Pad", category: "desk" },
  holographic_globe:    { url: `${S3_ITEM}/DESK-05_Holographic_Globe.png`, name: "Holographic Globe", category: "desk" },
  agent_zeros_dagger:   { url: `${S3_ITEM}/DESK-06_Agent_Zeros_Dagger.png`, name: "Agent Zero's Dagger", category: "desk" },
  kaels_last_message:   { url: `${S3_ITEM}/DESK-07_Kaels_Last_Message.png`, name: "Kael's Last Message", category: "desk" },
  ship_model:           { url: `${S3_ITEM}/DESK-08_Ship_Model.png`, name: "Ship Model", category: "desk" },
  coffee_mug:           { url: `${S3_ITEM}/DESK-09_Coffee_Mug.png`, name: "Coffee Mug", category: "desk" },
  personal_terminal:    { url: `${S3_ITEM}/DESK-10_Personal_Terminal.png`, name: "Personal Terminal", category: "desk" },
  // Floor items
  meditation_mat:       { url: `${S3_ITEM}/FLOOR-01_Meditation_Mat.png`, name: "Meditation Mat", category: "floor" },
  weapons_rack:         { url: `${S3_ITEM}/FLOOR-02_Weapons_Rack.png`, name: "Weapons Rack", category: "floor" },
  pet_bed:              { url: `${S3_ITEM}/FLOOR-03_Pet_Bed.png`, name: "Pet Bed", category: "floor" },
  storage_crate:        { url: `${S3_ITEM}/FLOOR-04_Storage_Crate.png`, name: "Storage Crate", category: "floor" },
  bioluminescent_plant: { url: `${S3_ITEM}/FLOOR-05_Bioluminescent_Plant.png`, name: "Bioluminescent Plant", category: "floor" },
  // Shelf items
  chess_trophy:          { url: `${S3_ITEM}/SHELF-01_Chess_Trophy.png`, name: "Chess Trophy", category: "shelf" },
  arena_medallion:       { url: `${S3_ITEM}/SHELF-02_Arena_Medallion.png`, name: "Arena Medallion", category: "shelf" },
  card_display_case:     { url: `${S3_ITEM}/SHELF-03_Card_Display_Case.png`, name: "Card Display Case", category: "shelf" },
  apprentice_figurine:   { url: `${S3_ITEM}/SHELF-04_Apprentice_Figurine.png`, name: "Apprentice Figurine", category: "shelf" },
  void_crystal_specimen: { url: `${S3_ITEM}/SHELF-05_Void_Crystal_Specimen.png`, name: "Void Crystal Specimen", category: "shelf" },
  iron_lion_helm:        { url: `${S3_ITEM}/SHELF-06_Iron_Lion_Helm_Fragment.png`, name: "Iron Lion Helm Fragment", category: "shelf" },
  oracle_lens:           { url: `${S3_ITEM}/SHELF-07_Oracle_Lens.png`, name: "Oracle Lens", category: "shelf" },
  data_crystal_archive:  { url: `${S3_ITEM}/SHELF-08_Data_Crystal_Archive.png`, name: "Data Crystal Archive", category: "shelf" },
  memes_antenna:         { url: `${S3_ITEM}/SHELF-09_Memes_Antenna.png`, name: "Meme's Antenna", category: "shelf" },
  thought_virus_containment: { url: `${S3_ITEM}/SHELF-10_Thought_Virus_Containment.png`, name: "Thought Virus Containment", category: "shelf" },
  // Wall items
  architect_banner:    { url: `${S3_ITEM}/WALL-01_Architect_Banner.png`, name: "Architect Banner", category: "wall" },
  dreamer_banner:      { url: `${S3_ITEM}/WALL-02_Dreamer_Banner.png`, name: "Dreamer Banner", category: "wall" },
  equilibrium_sigil:   { url: `${S3_ITEM}/WALL-03_Equilibrium_Sigil.png`, name: "Equilibrium Sigil", category: "wall" },
  terminus_star_chart:  { url: `${S3_ITEM}/WALL-04_Terminus_Star_Chart.png`, name: "Terminus Star Chart", category: "wall" },
  crew_photo:          { url: `${S3_ITEM}/WALL-05_Crew_Photo.png`, name: "Crew Photo", category: "wall" },
  wanted_poster:       { url: `${S3_ITEM}/WALL-06_Wanted_Poster.png`, name: "Wanted Poster", category: "wall" },
  conspiracy_board:    { url: `${S3_ITEM}/WALL-07_Conspiracy_Board.png`, name: "Conspiracy Board", category: "wall" },
  signal_map:          { url: `${S3_ITEM}/WALL-08_Signal_Map.png`, name: "Signal Map", category: "wall" },
  necromancer_rune:    { url: `${S3_ITEM}/WALL-09_Necromancer_Rune.png`, name: "Necromancer Rune", category: "wall" },
  memory_mosaic:       { url: `${S3_ITEM}/WALL-10_Memory_Mosaic.png`, name: "Memory Mosaic", category: "wall" },
};
