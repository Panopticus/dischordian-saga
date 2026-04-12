/**
 * Seed Season 1 cards into the database
 * Maps generated card data to the cards table schema
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cardsPath = path.join(__dirname, "..", "client", "src", "data", "season1-cards.json");
const cards = JSON.parse(fs.readFileSync(cardsPath, "utf-8"));

// Map generated card types to schema enum values
const CARD_TYPE_MAP = {
  unit: "character",
  spell: "song",
  field: "location",
  support: "action",
};

// Map species to schema enum
const SPECIES_MAP = {
  archon: "synthetic",
  human: "human",
  "ne-yon": "neyon",
  potential: "human",
  ai: "synthetic",
  synthetic: "synthetic",
  digital: "synthetic",
  corrupted: "unknown",
  demon: "unknown",
  mythic: "unknown",
  eldritch: "unknown",
  thalorian: "human",
  alien: "unknown",
  unknown: "unknown",
};

// Map class to schema enum
const CLASS_MAP = {
  warrior: "soldier",
  assassin: "assassin",
  prophet: "oracle",
  engineer: "engineer",
  spy: "spy",
};

async function seed() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not set. Run with: DATABASE_URL=... node scripts/seed-season1-cards.mjs");
    process.exit(1);
  }

  const connection = await mysql.createConnection(dbUrl);
  console.log("Connected to database");

  // Check how many cards already exist
  const [existing] = await connection.execute("SELECT COUNT(*) as cnt FROM cards WHERE season = 'Season 1'");
  const existingCount = existing[0].cnt;
  if (existingCount > 0) {
    console.log(`Found ${existingCount} existing Season 1 cards. Clearing and re-seeding...`);
    await connection.execute("DELETE FROM cards WHERE season = 'Season 1'");
  }

  let inserted = 0;
  for (const card of cards) {
    const cardType = CARD_TYPE_MAP[card.cardType] || "character";
    const species = SPECIES_MAP[card.species] || "unknown";
    const charClass = CLASS_MAP[card.characterClass] || "none";

    // Map element to dimension
    const dimensionMap = { earth: "space", water: "time", air: "probability", fire: "reality" };
    const dimension = dimensionMap[card.element] || "space";

    // Determine unlock method based on rarity
    const unlockMap = {
      common: "starter",
      uncommon: "exploration",
      rare: "fight",
      epic: "achievement",
      legendary: "story",
    };
    const unlockMethod = unlockMap[card.rarity] || "starter";

    try {
      await connection.execute(
        `INSERT INTO cards (cardId, name, cardType, rarity, alignment, element, dimension,
         characterClass, species, faction, cost, power, health, abilityText, flavorText,
         imageUrl, loredexEntryId, album, era, season, keywords, unlockMethod, isActive)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          card.id,
          card.name,
          cardType,
          card.rarity,
          card.alignment || "order",
          card.element || "earth",
          dimension,
          charClass,
          species,
          card.affiliation || null,
          card.cost,
          card.power,
          card.health,
          card.abilityText || null,
          card.flavorText || null,
          card.imageUrl || null,
          card.loreSource || null,
          card.album || null,
          card.era || null,
          "Season 1",
          JSON.stringify(card.keywords || []),
          unlockMethod,
          1,
        ]
      );
      inserted++;
    } catch (err) {
      console.error(`Failed to insert card ${card.id} (${card.name}):`, err.message);
    }
  }

  console.log(`\n═══ SEASON 1 SEED COMPLETE ═══`);
  console.log(`Inserted: ${inserted}/${cards.length} cards`);

  // Print summary
  const [summary] = await connection.execute(
    "SELECT cardType, rarity, COUNT(*) as cnt FROM cards WHERE season = 'Season 1' GROUP BY cardType, rarity ORDER BY cardType, rarity"
  );
  console.log("\nBreakdown:");
  for (const row of summary) {
    console.log(`  ${row.cardType} / ${row.rarity}: ${row.cnt}`);
  }

  await connection.end();
}

seed().catch(console.error);
