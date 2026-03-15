/**
 * Trade Wars Galaxy Seeder
 * Creates 200 sectors with Dischordian Saga themed locations, ports, and hazards.
 * Based on Trade Wars 2002 mechanics adapted for the universe.
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

// ═══════════════════════════════════════════════════════
// SECTOR TEMPLATES
// ═══════════════════════════════════════════════════════

const NAMED_SECTORS = [
  // Stardock / Hub (Sector 1)
  { sectorId: 1, name: "Inception Ark — Stardock", sectorType: "stardock", loreLocationId: "inception-ark" },
  
  // Major Locations (Named sectors from lore)
  { sectorId: 2, name: "New Babylon — Central Hub", sectorType: "station", loreLocationId: "new-babylon" },
  { sectorId: 3, name: "The Panopticon — Surveillance Nexus", sectorType: "station", loreLocationId: "the-panopticon" },
  { sectorId: 4, name: "The Citadel of Echoes", sectorType: "station", loreLocationId: "citadel-of-echoes" },
  { sectorId: 5, name: "The Obsidian Spire", sectorType: "station", loreLocationId: "obsidian-spire" },
  { sectorId: 6, name: "The Nexus of Fates", sectorType: "station", loreLocationId: "nexus-of-fates" },
  { sectorId: 7, name: "The Shattered Realm", sectorType: "planet", loreLocationId: "shattered-realm" },
  { sectorId: 8, name: "The Void Between", sectorType: "nebula", loreLocationId: "void-between" },
  { sectorId: 9, name: "The Digital Wastes", sectorType: "hazard", loreLocationId: "digital-wastes" },
  { sectorId: 10, name: "The Architect's Domain", sectorType: "station", loreLocationId: "architects-domain" },
  
  // Trading Ports (Major)
  { sectorId: 11, name: "Babylon Market District", sectorType: "port", loreLocationId: "new-babylon" },
  { sectorId: 12, name: "Insurgency Supply Depot", sectorType: "port" },
  { sectorId: 13, name: "Quarchon Trading Post", sectorType: "port" },
  { sectorId: 14, name: "Demagi Exchange", sectorType: "port" },
  { sectorId: 15, name: "Neyon Crystal Bazaar", sectorType: "port" },
  
  // Planets
  { sectorId: 16, name: "Earth — Origin World", sectorType: "planet", loreLocationId: "earth" },
  { sectorId: 17, name: "Demagi Prime", sectorType: "planet" },
  { sectorId: 18, name: "Quarchon Homeworld", sectorType: "planet" },
  { sectorId: 19, name: "The Forgotten Colony", sectorType: "planet" },
  { sectorId: 20, name: "Neyon Sanctuary", sectorType: "planet" },
  
  // Wormholes
  { sectorId: 21, name: "Rift Alpha — Temporal Anomaly", sectorType: "wormhole" },
  { sectorId: 22, name: "Rift Beta — Dimensional Tear", sectorType: "wormhole" },
  { sectorId: 23, name: "Rift Gamma — Probability Storm", sectorType: "wormhole" },
  
  // Hazards
  { sectorId: 24, name: "The Maelstrom", sectorType: "hazard" },
  { sectorId: 25, name: "Necromancer's Graveyard", sectorType: "hazard" },
  
  // Asteroid Fields (Mining)
  { sectorId: 26, name: "Crystalline Asteroid Belt", sectorType: "asteroid" },
  { sectorId: 27, name: "Iron Debris Field", sectorType: "asteroid" },
  { sectorId: 28, name: "Quantum Dust Cloud", sectorType: "asteroid" },
  
  // Nebulae (Hiding spots)
  { sectorId: 29, name: "Crimson Nebula", sectorType: "nebula" },
  { sectorId: 30, name: "Silence Nebula", sectorType: "nebula" },
];

// Port types determine what they buy/sell
// Type 1: Buys Fuel Ore, Sells Organics & Equipment
// Type 2: Buys Organics, Sells Fuel Ore & Equipment
// Type 3: Buys Equipment, Sells Fuel Ore & Organics
// Type 4: Buys Fuel Ore & Organics, Sells Equipment
// Type 5: Buys Fuel Ore & Equipment, Sells Organics
// Type 6: Buys Organics & Equipment, Sells Fuel Ore
// Type 7: Sells all (rare, expensive)
// Type 8: Buys all (rare, good prices)

function generatePortData(sectorId) {
  const portType = (sectorId % 8) + 1;
  const basePrice = 50 + Math.floor(Math.random() * 100);
  const stock = 200 + Math.floor(Math.random() * 800);
  
  const commodities = {
    fuelOre: { price: basePrice + Math.floor(Math.random() * 30), stock, buying: false },
    organics: { price: basePrice + 20 + Math.floor(Math.random() * 40), stock, buying: false },
    equipment: { price: basePrice + 50 + Math.floor(Math.random() * 60), stock, buying: false },
  };
  
  switch (portType) {
    case 1: commodities.fuelOre.buying = true; break;
    case 2: commodities.organics.buying = true; break;
    case 3: commodities.equipment.buying = true; break;
    case 4: commodities.fuelOre.buying = true; commodities.organics.buying = true; break;
    case 5: commodities.fuelOre.buying = true; commodities.equipment.buying = true; break;
    case 6: commodities.organics.buying = true; commodities.equipment.buying = true; break;
    case 7: break; // sells all
    case 8: commodities.fuelOre.buying = true; commodities.organics.buying = true; commodities.equipment.buying = true; break;
  }
  
  // Buying ports pay more, selling ports charge less
  Object.values(commodities).forEach(c => {
    if (c.buying) {
      c.price = Math.floor(c.price * 1.3); // pays 30% more
    } else {
      c.price = Math.floor(c.price * 0.7); // sells 30% cheaper
    }
  });
  
  return { portType, commodities, portName: `Port ${sectorId}` };
}

function generatePlanetData(name) {
  return {
    population: Math.floor(Math.random() * 1000000),
    defense: Math.floor(Math.random() * 500),
    production: {
      fuelOre: Math.floor(Math.random() * 50),
      organics: Math.floor(Math.random() * 50),
      equipment: Math.floor(Math.random() * 30),
    },
    colonizable: true,
  };
}

function generateHazardData() {
  const hazards = ["radiation", "mines", "pirates", "anomaly", "void_storm"];
  return {
    hazardType: hazards[Math.floor(Math.random() * hazards.length)],
    damage: 10 + Math.floor(Math.random() * 40),
    avoidChance: 0.3 + Math.random() * 0.4,
  };
}

function generateWormholeData(sectorId) {
  // Wormholes connect to random distant sectors
  const dest = 100 + Math.floor(Math.random() * 100);
  return { destination: dest, stable: Math.random() > 0.3, twoWay: Math.random() > 0.5 };
}

// ═══════════════════════════════════════════════════════
// GENERATE ALL 200 SECTORS
// ═══════════════════════════════════════════════════════

function generateGalaxy() {
  const sectors = [];
  
  // Add named sectors (1-30)
  for (const ns of NAMED_SECTORS) {
    const sector = {
      sectorId: ns.sectorId,
      name: ns.name,
      sectorType: ns.sectorType,
      warps: [],
      isDiscovered: ns.sectorId <= 5 ? 1 : 0, // First 5 sectors are discovered
      sectorData: {},
      loreLocationId: ns.loreLocationId || null,
    };
    
    if (ns.sectorType === "port" || ns.sectorType === "stardock") {
      sector.sectorData = generatePortData(ns.sectorId);
    } else if (ns.sectorType === "planet") {
      sector.sectorData = generatePlanetData(ns.name);
    } else if (ns.sectorType === "hazard") {
      sector.sectorData = generateHazardData();
    } else if (ns.sectorType === "wormhole") {
      sector.sectorData = generateWormholeData(ns.sectorId);
    }
    
    sectors.push(sector);
  }
  
  // Generate procedural sectors (31-200)
  const sectorNames = [
    "Outer Rim", "Deep Space", "Frontier Zone", "Uncharted Region",
    "Trade Lane", "Mining Colony", "Relay Station", "Outpost",
    "Waypoint", "Junction", "Crossroads", "Transit Hub",
    "Salvage Yard", "Refueling Station", "Communications Array",
    "Research Station", "Military Outpost", "Civilian Hub",
    "Free Port", "Smuggler's Haven", "Patrol Route", "Dead Zone",
  ];
  
  const sectorTypes = ["empty", "empty", "empty", "port", "port", "empty", "asteroid", "nebula", "planet", "hazard"];
  
  for (let i = 31; i <= 200; i++) {
    const type = sectorTypes[Math.floor(Math.random() * sectorTypes.length)];
    const namePrefix = sectorNames[Math.floor(Math.random() * sectorNames.length)];
    
    const sector = {
      sectorId: i,
      name: `${namePrefix} ${i}`,
      sectorType: type,
      warps: [],
      isDiscovered: 0,
      sectorData: {},
      loreLocationId: null,
    };
    
    if (type === "port") {
      sector.sectorData = generatePortData(i);
    } else if (type === "planet") {
      sector.sectorData = generatePlanetData(sector.name);
    } else if (type === "hazard") {
      sector.sectorData = generateHazardData();
    } else if (type === "asteroid") {
      sector.sectorData = {
        mineableOre: 100 + Math.floor(Math.random() * 500),
        danger: Math.floor(Math.random() * 30),
      };
    } else if (type === "nebula") {
      sector.sectorData = {
        hidingBonus: 0.5 + Math.random() * 0.3,
        scanPenalty: 0.3 + Math.random() * 0.4,
      };
    }
    
    sectors.push(sector);
  }
  
  // Generate warp connections (graph edges)
  // Stardock (1) connects to all major hubs
  sectors[0].warps = [2, 3, 4, 5, 6, 11, 16];
  
  // Major stations connect to nearby sectors
  for (let i = 1; i < 30; i++) {
    const s = sectors[i];
    if (s.warps.length > 0) continue;
    
    // Connect to 2-5 nearby sectors
    const numWarps = 2 + Math.floor(Math.random() * 4);
    const warps = new Set();
    
    // Always connect back to stardock region
    if (s.sectorId > 5) warps.add(Math.ceil(Math.random() * 5));
    
    while (warps.size < numWarps) {
      // Prefer nearby sectors
      const range = 15;
      let target = s.sectorId + Math.floor(Math.random() * range * 2) - range;
      target = Math.max(1, Math.min(200, target));
      if (target !== s.sectorId) warps.add(target);
    }
    
    s.warps = [...warps];
  }
  
  // Procedural sectors: connect to 2-4 neighbors
  for (let i = 30; i < sectors.length; i++) {
    const s = sectors[i];
    const numWarps = 2 + Math.floor(Math.random() * 3);
    const warps = new Set();
    
    // Connect to at least one lower sector (path back to hub)
    warps.add(Math.max(1, s.sectorId - Math.ceil(Math.random() * 20)));
    
    while (warps.size < numWarps) {
      let target = s.sectorId + Math.floor(Math.random() * 30) - 15;
      target = Math.max(1, Math.min(200, target));
      if (target !== s.sectorId) warps.add(target);
    }
    
    s.warps = [...warps];
  }
  
  // Ensure bidirectional warps (if A->B, then B->A)
  for (const s of sectors) {
    for (const warpTarget of s.warps) {
      const targetSector = sectors.find(x => x.sectorId === warpTarget);
      if (targetSector && !targetSector.warps.includes(s.sectorId)) {
        targetSector.warps.push(s.sectorId);
      }
    }
  }
  
  return sectors;
}

// ═══════════════════════════════════════════════════════
// DATABASE INSERTION
// ═══════════════════════════════════════════════════════

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);
  
  console.log("Generating galaxy with 200 sectors...");
  const sectors = generateGalaxy();
  
  // Clear existing sectors
  await conn.execute("DELETE FROM tw_sectors");
  console.log("Cleared existing sectors.");
  
  // Insert sectors in batches
  const BATCH_SIZE = 50;
  let inserted = 0;
  
  for (let i = 0; i < sectors.length; i += BATCH_SIZE) {
    const batch = sectors.slice(i, i + BATCH_SIZE);
    const placeholders = batch.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(", ");
    const values = batch.flatMap(s => [
      s.sectorId,
      s.name,
      s.sectorType,
      JSON.stringify(s.warps),
      s.isDiscovered,
      JSON.stringify(s.sectorData),
      s.loreLocationId,
    ]);
    
    await conn.execute(
      `INSERT INTO tw_sectors (sectorId, name, sectorType, warps, isDiscovered, sectorData, loreLocationId) VALUES ${placeholders}`,
      values
    );
    inserted += batch.length;
    console.log(`  Inserted ${inserted}/${sectors.length} sectors...`);
  }
  
  // Print summary
  const typeCounts = {};
  sectors.forEach(s => { typeCounts[s.sectorType] = (typeCounts[s.sectorType] || 0) + 1; });
  console.log("\n═══ Galaxy Generation Complete ═══");
  console.log(`Total sectors: ${sectors.length}`);
  console.log("Sector types:", typeCounts);
  console.log(`Named sectors: ${NAMED_SECTORS.length}`);
  console.log(`Discovered by default: ${sectors.filter(s => s.isDiscovered).length}`);
  
  await conn.end();
}

main().catch(console.error);
