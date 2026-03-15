import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

// ═══════════════════════════════════════════════════════
// ASCII ART & CONSTANTS
// ═══════════════════════════════════════════════════════

const BANNER_FULL = `
╔══════════════════════════════════════════════════════════════════╗
║  ████████╗██████╗  █████╗ ██████╗ ███████╗    ██╗    ██╗       ║
║  ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔════╝    ██║    ██║       ║
║     ██║   ██████╔╝███████║██║  ██║█████╗      ██║ █╗ ██║       ║
║     ██║   ██╔══██╗██╔══██║██║  ██║██╔══╝      ██║███╗██║       ║
║     ██║   ██║  ██║██║  ██║██████╔╝███████╗    ╚███╔███╔╝       ║
║     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝     ╚══╝╚══╝       ║
║                                                                  ║
║          ═══ D I S C H O R D I A N   S A G A ═══               ║
║                  BBS SPACE TRADING GAME                          ║
║              Inception Ark Command Terminal v2.1                 ║
╚══════════════════════════════════════════════════════════════════╝`;

const BANNER_MOBILE = `
╔═══════════════════════════╗
║   T R A D E   W A R S    ║
║  DISCHORDIAN SAGA  v2.1  ║
║  BBS SPACE TRADING GAME  ║
╚═══════════════════════════╝`;

const BANNER = typeof window !== 'undefined' && window.innerWidth < 640 ? BANNER_MOBILE : BANNER_FULL;

const HELP_TEXT = `
═══ COMMAND REFERENCE ═══

NAVIGATION
  warp <sector> - Warp to sector
  scan - Deep scan sector
  map - Display galaxy map
  sector - Show sector info

TRADING
  buy <item> <qty> - Buy from port
  sell <item> <qty> - Sell to port
  port - Show port prices

COMBAT
  attack - Engage hostiles

MINING
  mine - Mine asteroids

STARDOCK (Sector 1)
  ships - View ships
  upgrade <ship> - Buy ship
  fighters <qty> - Buy drones
  repair - Repair shields

COLONIES
  colonize <name> <type>
  colonies - View colonies
  collect - Collect income
  upgrade-colony <id>
  fortify <id> <qty>

INFO
  status | log | leaderboard
  help | clear | quit

Commodities: fuel, organics, equipment
Colony types: mining, agriculture,
  technology, military, trading`;

const SECTOR_ICONS: Record<string, string> = {
  stardock: "⚓",
  station: "🏛",
  port: "🏪",
  planet: "🌍",
  nebula: "🌫",
  asteroid: "☄",
  hazard: "⚠",
  wormhole: "🌀",
  empty: "·",
};

// ═══════════════════════════════════════════════════════
// TERMINAL LINE COMPONENT
// ═══════════════════════════════════════════════════════

interface TermLine {
  text: string;
  type: "system" | "input" | "output" | "error" | "success" | "warning" | "ascii" | "info";
}

function colorClass(type: TermLine["type"]): string {
  switch (type) {
    case "system": return "text-cyan-400";
    case "input": return "text-green-400";
    case "output": return "text-gray-300";
    case "error": return "text-red-400";
    case "success": return "text-green-300";
    case "warning": return "text-amber-400";
    case "ascii": return "text-cyan-500";
    case "info": return "text-blue-300";
    default: return "text-gray-400";
  }
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

export default function TradeWarsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [lines, setLines] = useState<TermLine[]>([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [booted, setBooted] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // tRPC queries/mutations
  const stateQuery = trpc.tradeWars.getState.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });
  const sectorQuery = trpc.tradeWars.getSector.useQuery({ sectorId: undefined as unknown as number }, {
    enabled: false,
  });
  const shipsQuery = trpc.tradeWars.getShips.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const warpMut = trpc.tradeWars.warp.useMutation();
  const tradeMut = trpc.tradeWars.trade.useMutation();
  const scanMut = trpc.tradeWars.scan.useMutation();
  const upgradeMut = trpc.tradeWars.upgradeShip.useMutation();
  const buyFightersMut = trpc.tradeWars.buyFighters.useMutation();
  const repairMut = trpc.tradeWars.repairShields.useMutation();
  const combatMut = trpc.tradeWars.combat.useMutation();
  const mineMut = trpc.tradeWars.mine.useMutation();
  const claimPlanetMut = trpc.tradeWars.claimPlanet.useMutation();
  const collectIncomeMut = trpc.tradeWars.collectIncome.useMutation();
  const upgradeColonyMut = trpc.tradeWars.upgradeColony.useMutation();
  const fortifyColonyMut = trpc.tradeWars.fortifyColony.useMutation();
  const logQuery = trpc.tradeWars.getLog.useQuery(undefined, { enabled: false });
  const mapQuery = trpc.tradeWars.getMap.useQuery(undefined, { enabled: false });

  const utils = trpc.useUtils();

  // Auto-scroll terminal
  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = useCallback((text: string, type: TermLine["type"] = "output") => {
    setLines(prev => [...prev, { text, type }]);
  }, []);

  const addLines = useCallback((texts: Array<{ text: string; type: TermLine["type"] }>) => {
    setLines(prev => [...prev, ...texts]);
  }, []);

  // Boot sequence
  useEffect(() => {
    if (booted || authLoading) return;
    if (!isAuthenticated) return;

    setBooted(true);
    const bootLines: TermLine[] = [];
    BANNER.split("\n").forEach(line => {
      bootLines.push({ text: line, type: "ascii" });
    });
    bootLines.push({ text: "", type: "output" });
    bootLines.push({ text: "Initializing neural uplink to Inception Ark mainframe...", type: "system" });
    bootLines.push({ text: `Operator: ${user?.name || "Unknown"}`, type: "system" });
    bootLines.push({ text: "Connection established. Type 'help' for commands.", type: "success" });
    bootLines.push({ text: "", type: "output" });
    setLines(bootLines);

    // Show initial sector
    setTimeout(() => {
      showSectorInfo();
    }, 500);
  }, [isAuthenticated, authLoading, booted]);

  // Show sector info
  const showSectorInfo = useCallback(async () => {
    try {
      const data = await utils.tradeWars.getSector.fetch({ sectorId: undefined as unknown as number });
      const state = await utils.tradeWars.getState.fetch();
      if (!data || !state) {
        addLine("ERROR: Unable to retrieve sector data", "error");
        return;
      }

      const sectorLines: Array<{ text: string; type: TermLine["type"] }> = [
        { text: `╔════════════════════════════════════════════╗`, type: "info" },
        { text: `║  SECTOR ${data.sectorId}: ${data.name}`, type: "info" },
        { text: `║  Type: ${(data.sectorType || "unknown").toUpperCase()} ${SECTOR_ICONS[data.sectorType || "empty"] || ""}`, type: "info" },
        { text: `╠════════════════════════════════════════════╣`, type: "info" },
      ];

      // Show port info
      if (data.sectorType === "port" || data.sectorType === "stardock") {
        const portData = data.sectorData as any;
        if (portData?.commodities) {
          sectorLines.push({ text: `║  PORT: ${portData.portName || data.name}`, type: "warning" });
          const c = portData.commodities;
          sectorLines.push({ text: `║  Fuel Ore:   ${c.fuelOre.buying ? "BUYING" : "SELLING"} @ ${c.fuelOre.price} cr`, type: c.fuelOre.buying ? "success" : "output" });
          sectorLines.push({ text: `║  Organics:   ${c.organics.buying ? "BUYING" : "SELLING"} @ ${c.organics.price} cr`, type: c.organics.buying ? "success" : "output" });
          sectorLines.push({ text: `║  Equipment:  ${c.equipment.buying ? "BUYING" : "SELLING"} @ ${c.equipment.price} cr`, type: c.equipment.buying ? "success" : "output" });
        }
      }

      // Show hazard info
      if (data.sectorType === "hazard") {
        const hazData = data.sectorData as any;
        sectorLines.push({ text: `║  ⚠ HAZARD: ${(hazData?.hazardType || "unknown").toUpperCase()}`, type: "error" });
        sectorLines.push({ text: `║  Potential damage: ${hazData?.damage || "??"} shields`, type: "warning" });
      }

      // Show asteroid info
      if (data.sectorType === "asteroid") {
        const astData = data.sectorData as any;
        sectorLines.push({ text: `║  ☄ Mineable ore: ${astData?.mineableOre || "??"} units`, type: "warning" });
      }

      // Show warp connections
      sectorLines.push({ text: `╠════════════════════════════════════════════╣`, type: "info" });
      sectorLines.push({ text: `║  WARPS:`, type: "info" });
      if (data.connectedSectors && data.connectedSectors.length > 0) {
        data.connectedSectors.forEach((cs: any) => {
          const icon = SECTOR_ICONS[cs.sectorType] || "·";
          const explored = cs.explored ? "" : " [UNEXPLORED]";
          sectorLines.push({
            text: `║    ${icon} Sector ${cs.sectorId}: ${cs.explored ? cs.name : "???"}${explored}`,
            type: cs.explored ? "output" : "warning",
          });
        });
      } else {
        sectorLines.push({ text: `║    No warp connections detected`, type: "error" });
      }

      sectorLines.push({ text: `╚════════════════════════════════════════════╝`, type: "info" });

      // Status bar
      sectorLines.push({ text: "", type: "output" });
      sectorLines.push({
        text: `[Credits: ${state.credits?.toLocaleString()}] [Holds: ${getCargoUsed(state)}/${state.holds}] [Shields: ${state.shields}] [Fighters: ${state.fighters}] [Turns: ${state.turnsRemaining}]`,
        type: "system",
      });

      addLines(sectorLines);
    } catch (err) {
      addLine("ERROR: Sector data unavailable", "error");
    }
  }, [addLine, addLines, utils]);

  function getCargoUsed(state: any): number {
    return (state?.fuelOre || 0) + (state?.organics || 0) + (state?.equipment || 0);
  }

  // Process command
  const processCommand = useCallback(async (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    addLine(`> ${cmd}`, "input");
    setIsProcessing(true);

    const parts = trimmed.split(/\s+/);
    const command = parts[0];
    const arg1 = parts[1];
    const arg2 = parts[2];

    try {
      switch (command) {
        case "help":
        case "?": {
          HELP_TEXT.split("\n").forEach(line => addLine(line, "info"));
          break;
        }

        case "clear":
        case "cls": {
          setLines([]);
          break;
        }

        case "quit":
        case "exit": {
          addLine("Disconnecting from Inception Ark mainframe...", "system");
          addLine("Session terminated. Returning to Ark.", "warning");
          setTimeout(() => {
            window.location.href = "/ark";
          }, 1000);
          break;
        }

        case "status":
        case "stat": {
          const state = await utils.tradeWars.getState.fetch();
          if (!state) { addLine("ERROR: State unavailable", "error"); break; }
          const ship = state.shipInfo as any;
          addLines([
            { text: `╔════════════════════════════════════════════╗`, type: "info" },
            { text: `║  SHIP STATUS: ${ship?.name || state.shipType}`, type: "info" },
            { text: `╠════════════════════════════════════════════╣`, type: "info" },
            { text: `║  Sector:     ${state.currentSector}`, type: "output" },
            { text: `║  Credits:    ${state.credits?.toLocaleString()} cr`, type: "success" },
            { text: `║  Cargo:      ${getCargoUsed(state)}/${state.holds} holds`, type: "output" },
            { text: `║    Fuel Ore:   ${state.fuelOre}`, type: "output" },
            { text: `║    Organics:   ${state.organics}`, type: "output" },
            { text: `║    Equipment:  ${state.equipment}`, type: "output" },
            { text: `║  Fighters:   ${state.fighters}`, type: "output" },
            { text: `║  Shields:    ${state.shields}/${ship?.shields || "??"}`, type: state.shields < (ship?.shields || 100) * 0.3 ? "error" : "output" },
            { text: `║  Turns:      ${state.turnsRemaining}/100`, type: state.turnsRemaining < 10 ? "warning" : "output" },
            { text: `║  Experience: ${state.experience} XP`, type: "output" },
            { text: `║  Alignment:  ${state.alignment > 0 ? "Lawful" : state.alignment < 0 ? "Outlaw" : "Neutral"} (${state.alignment})`, type: "output" },
            { text: `║  Explored:   ${(state.discoveredSectors as number[])?.length || 0}/200 sectors`, type: "output" },
            { text: `╚════════════════════════════════════════════╝`, type: "info" },
          ]);
          break;
        }

        case "sector":
        case "look": {
          await showSectorInfo();
          break;
        }

        case "warp":
        case "w":
        case "move": {
          if (!arg1 || isNaN(Number(arg1))) {
            addLine("Usage: warp <sector_number>", "warning");
            break;
          }
          addLine(`Engaging warp drive to sector ${arg1}...`, "system");
          const result = await warpMut.mutateAsync({ targetSector: Number(arg1) });
          if (result.success) {
            addLine(result.message, "success");
            if (result.hazardMessage) addLine(result.hazardMessage, "error");
            if (result.cardReward) {
              addLine(`🎴 CARD FOUND: ${result.cardReward.name} (${result.cardReward.rarity})`, "warning");
            }
            addLine("", "output");
            await showSectorInfo();
          } else {
            addLine(result.message, "error");
          }
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "scan":
        case "s": {
          addLine("Initiating deep-space scan...", "system");
          const result = await scanMut.mutateAsync();
          if (result.success) {
            addLine(result.message || "", "success");
            addLine(`Total sectors discovered: ${result.totalDiscovered}/200`, "info");
          } else {
            addLine(result.message || "Scan failed", "error");
          }
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "map":
        case "galaxy": {
          addLine("Rendering galaxy map...", "system");
          const mapData = await utils.tradeWars.getMap.fetch();
          if (!mapData || !mapData.sectors || mapData.sectors.length === 0) {
            addLine("No sectors discovered yet.", "warning");
            break;
          }

          addLines([
            { text: `╔══════════════════════════════════════════════════════════════╗`, type: "info" },
            { text: `║  GALAXY MAP — ${mapData.totalDiscovered}/${mapData.totalSectors} sectors discovered`, type: "info" },
            { text: `╠══════════════════════════════════════════════════════════════╣`, type: "info" },
          ]);

          // Group by type
          const byType: Record<string, any[]> = {};
          mapData.sectors.forEach((s: any) => {
            const t = s.sectorType || "empty";
            if (!byType[t]) byType[t] = [];
            byType[t].push(s);
          });

          const typeOrder = ["stardock", "station", "port", "planet", "asteroid", "nebula", "wormhole", "hazard", "empty"];
          for (const type of typeOrder) {
            const secs = byType[type];
            if (!secs || secs.length === 0) continue;
            const icon = SECTOR_ICONS[type] || "·";
            addLine(`║  ${icon} ${type.toUpperCase()} (${secs.length}):`, "warning");
            const chunks = [];
            for (let i = 0; i < secs.length; i += 5) {
              chunks.push(secs.slice(i, i + 5));
            }
            for (const chunk of chunks) {
              const line = chunk.map((s: any) => {
                const marker = s.isCurrent ? ">>>" : "   ";
                return `${marker}${String(s.sectorId).padStart(3)} ${s.name?.substring(0, 22) || "Unknown"}`;
              }).join("  ");
              addLine(`║    ${line}`, "output");
            }
          }

          addLines([
            { text: `╠══════════════════════════════════════════════════════════════╣`, type: "info" },
            { text: `║  >>> = Current location  |  ${SECTOR_ICONS.stardock} Stardock  ${SECTOR_ICONS.port} Port  ${SECTOR_ICONS.planet} Planet  ${SECTOR_ICONS.hazard} Hazard`, type: "output" },
            { text: `╚══════════════════════════════════════════════════════════════╝`, type: "info" },
          ]);
          break;
        }

        case "port":
        case "prices": {
          const sectorData = await utils.tradeWars.getSector.fetch({ sectorId: undefined as unknown as number });
          if (!sectorData || (sectorData.sectorType !== "port" && sectorData.sectorType !== "stardock")) {
            addLine("No trading port in this sector.", "error");
            break;
          }
          const portData = sectorData.sectorData as any;
          if (!portData?.commodities) { addLine("Port data unavailable", "error"); break; }
          const c = portData.commodities;
          addLines([
            { text: `╔════════════════════════════════════════════╗`, type: "info" },
            { text: `║  PORT: ${portData.portName || sectorData.name}`, type: "warning" },
            { text: `╠════════════════════════════════════════════╣`, type: "info" },
            { text: `║  Commodity     Action    Price/unit`, type: "info" },
            { text: `║  ──────────    ──────    ──────────`, type: "info" },
            { text: `║  Fuel Ore      ${c.fuelOre.buying ? "BUYING " : "SELLING"} @ ${String(c.fuelOre.price).padStart(5)} cr`, type: c.fuelOre.buying ? "success" : "output" },
            { text: `║  Organics      ${c.organics.buying ? "BUYING " : "SELLING"} @ ${String(c.organics.price).padStart(5)} cr`, type: c.organics.buying ? "success" : "output" },
            { text: `║  Equipment     ${c.equipment.buying ? "BUYING " : "SELLING"} @ ${String(c.equipment.price).padStart(5)} cr`, type: c.equipment.buying ? "success" : "output" },
            { text: `╚════════════════════════════════════════════╝`, type: "info" },
            { text: `  BUYING = port pays you  |  SELLING = you pay port`, type: "system" },
          ]);
          break;
        }

        case "buy":
        case "b": {
          const commodityMap: Record<string, string> = {
            fuel: "fuelOre", fuelore: "fuelOre", ore: "fuelOre",
            org: "organics", organics: "organics",
            eq: "equipment", equip: "equipment", equipment: "equipment",
          };
          const commodity = commodityMap[arg1 || ""];
          if (!commodity) {
            addLine("Usage: buy <fuel|organics|equipment> <quantity>", "warning");
            break;
          }
          const qty = Number(arg2);
          if (!qty || qty < 1) {
            addLine("Usage: buy <commodity> <quantity>", "warning");
            break;
          }
          const result = await tradeMut.mutateAsync({
            commodity: commodity as "fuelOre" | "organics" | "equipment",
            action: "buy",
            quantity: qty,
          });
          addLine(result.message, result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "sell": {
          const commodityMap: Record<string, string> = {
            fuel: "fuelOre", fuelore: "fuelOre", ore: "fuelOre",
            org: "organics", organics: "organics",
            eq: "equipment", equip: "equipment", equipment: "equipment",
          };
          const commodity = commodityMap[arg1 || ""];
          if (!commodity) {
            addLine("Usage: sell <fuel|organics|equipment> <quantity>", "warning");
            break;
          }
          const qty = Number(arg2);
          if (!qty || qty < 1) {
            addLine("Usage: sell <commodity> <quantity>", "warning");
            break;
          }
          const result = await tradeMut.mutateAsync({
            commodity: commodity as "fuelOre" | "organics" | "equipment",
            action: "sell",
            quantity: qty,
          });
          addLine(result.message, result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "attack":
        case "fight":
        case "combat": {
          addLine("Engaging hostile contacts...", "system");
          addLine("", "output");
          const result = await combatMut.mutateAsync();
          if (result.won) {
            addLines([
              { text: `  ╔═══════════════════════════╗`, type: "success" },
              { text: `  ║   ★ COMBAT VICTORY ★     ║`, type: "success" },
              { text: `  ╚═══════════════════════════╝`, type: "success" },
              { text: `  Enemy: ${result.enemyName} (Power: ${result.enemyStrength})`, type: "output" },
              { text: `  Salvage: +${result.creditsChange} credits`, type: "success" },
              { text: `  XP gained: +${result.xpGain}`, type: "success" },
            ]);
            if (result.fightersLost > 0) addLine(`  Fighters lost: ${result.fightersLost}`, "warning");
            if (result.shieldDamage > 0) addLine(`  Shield damage: -${result.shieldDamage}`, "warning");
            if (result.cardReward) {
              addLine(`  🎴 CARD REWARD: ${result.cardReward.name} (${result.cardReward.rarity})`, "warning");
            }
          } else {
            addLines([
              { text: `  ╔═══════════════════════════╗`, type: "error" },
              { text: `  ║   ✖ COMBAT DEFEAT ✖      ║`, type: "error" },
              { text: `  ╚═══════════════════════════╝`, type: "error" },
              { text: `  Enemy: ${result.enemyName} (Power: ${result.enemyStrength})`, type: "output" },
              { text: `  Credits lost: ${Math.abs(result.creditsChange || 0)}`, type: "error" },
              { text: `  Fighters lost: ${result.fightersLost}`, type: "error" },
              { text: `  Shield damage: -${result.shieldDamage}`, type: "error" },
            ]);
          }
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "mine": {
          addLine("Deploying mining drones...", "system");
          const result = await mineMut.mutateAsync();
          addLine(result.message || "", result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "ships": {
          const ships = shipsQuery.data;
          if (!ships) { addLine("Ship data unavailable", "error"); break; }
          addLines([
            { text: `╔══════════════════════════════════════════════════════════╗`, type: "info" },
            { text: `║  STARDOCK SHIPYARD — Available Vessels                   ║`, type: "info" },
            { text: `╠══════════════════════════════════════════════════════════╣`, type: "info" },
            { text: `║  Ship              Holds  Fighters  Shields  Cost       ║`, type: "info" },
            { text: `║  ────              ─────  ────────  ───────  ────       ║`, type: "info" },
          ]);
          ships.forEach((s: any) => {
            addLine(
              `║  ${s.name.padEnd(18)} ${String(s.holds).padStart(5)}  ${String(s.fighters).padStart(8)}  ${String(s.shields).padStart(7)}  ${s.cost === 0 ? "FREE".padStart(9) : (s.cost.toLocaleString() + " cr").padStart(9)}`,
              "output"
            );
          });
          addLines([
            { text: `╠══════════════════════════════════════════════════════════╣`, type: "info" },
            { text: `║  Use: upgrade <ship_id> (e.g., upgrade merchant)        ║`, type: "system" },
            { text: `╚══════════════════════════════════════════════════════════╝`, type: "info" },
          ]);
          break;
        }

        case "upgrade": {
          if (!arg1) {
            addLine("Usage: upgrade <ship_type> (scout, merchant, corvette, frigate, dreadnought, ark)", "warning");
            break;
          }
          const result = await upgradeMut.mutateAsync({ shipType: arg1 });
          addLine(result.message, result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "fighters": {
          if (!arg1 || isNaN(Number(arg1))) {
            addLine("Usage: fighters <quantity>", "warning");
            break;
          }
          const result = await buyFightersMut.mutateAsync({ quantity: Number(arg1) });
          addLine(result.message, result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "repair": {
          const result = await repairMut.mutateAsync();
          addLine(result.message, result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "leaderboard":
        case "lb":
        case "scores":
        case "rankings": {
          addLine("Accessing galactic rankings...", "system");
          const sortOptions: Record<string, "credits" | "experience" | "sectors" | "combat"> = {
            credits: "credits", wealth: "credits",
            xp: "experience", experience: "experience", exp: "experience",
            sectors: "sectors", explore: "sectors",
            combat: "combat", kills: "combat", pvp: "combat",
          };
          const sortBy = sortOptions[arg1 || "credits"] || "credits";
          const lb = await utils.tradeWars.getLeaderboard.fetch({ sortBy });
          if (!lb || lb.length === 0) {
            addLine("No operatives registered yet.", "warning");
            break;
          }
          addLines([
            { text: `╔══════════════════════════════════════════════════════════════════════╗`, type: "info" },
            { text: `║  GALACTIC LEADERBOARD — Sorted by: ${sortBy.toUpperCase().padEnd(12)}                     ║`, type: "info" },
            { text: `╠══════════════════════════════════════════════════════════════════════╣`, type: "info" },
            { text: `║  #   Name                 Credits      XP    Sectors  Wins  Ship   ║`, type: "info" },
            { text: `║  ──  ────                 ───────      ──    ───────  ────  ────   ║`, type: "info" },
          ]);
          lb.forEach((entry: any) => {
            const isYou = entry.userId === stateQuery.data?.userId;
            const marker = isYou ? ">>" : "  ";
            const rankStr = String(entry.rank).padStart(2);
            const name = (entry.name || "Unknown").substring(0, 20).padEnd(20);
            const credits = String(entry.credits?.toLocaleString() || "0").padStart(12);
            const xp = String(entry.experience || 0).padStart(7);
            const sectors = String(entry.sectorsDiscovered || 0).padStart(7);
            const wins = String(entry.combatWins || 0).padStart(5);
            const ship = (entry.shipName || "Scout").substring(0, 6).padEnd(6);
            addLine(
              `║${marker}${rankStr}  ${name} ${credits} ${xp}  ${sectors}  ${wins}  ${ship} ║`,
              isYou ? "warning" : "output"
            );
          });
          addLines([
            { text: `╠══════════════════════════════════════════════════════════════════════╣`, type: "info" },
            { text: `║  Sort: leaderboard <credits|xp|sectors|combat>                      ║`, type: "system" },
            { text: `╚══════════════════════════════════════════════════════════════════════╝`, type: "info" },
          ]);
          break;
        }

        case "colonize":
        case "claim": {
          if (!arg1) {
            addLine("Usage: colonize <planet_name> [type]", "warning");
            addLine("Types: mining, agriculture, technology, military, trading", "info");
            break;
          }
          const colonyTypes = ["mining", "agriculture", "technology", "military", "trading"];
          const colType = colonyTypes.includes(arg2 || "") ? arg2 as any : "mining";
          addLine(`Establishing colony "${arg1}"...`, "system");
          const result = await claimPlanetMut.mutateAsync({
            planetName: arg1,
            colonyType: colType,
          });
          addLine(result.message, result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "colonies":
        case "planets": {
          addLine("Querying colony database...", "system");
          const colonies = await utils.tradeWars.getColonies.fetch();
          if (!colonies || colonies.length === 0) {
            addLine("No colonies established. Use 'colonize <name> [type]' at a planet sector.", "warning");
            break;
          }
          addLines([
            { text: `╔══════════════════════════════════════════════════════════════════════╗`, type: "info" },
            { text: `║  YOUR COLONIES (${colonies.length})                                                   ║`, type: "info" },
            { text: `╠══════════════════════════════════════════════════════════════════════╣`, type: "info" },
          ]);
          colonies.forEach((c: any) => {
            const typeIcon: Record<string, string> = {
              mining: "⛏", agriculture: "🌾", technology: "💻", military: "⚔", trading: "💰",
            };
            addLines([
              { text: `║  ${typeIcon[c.colonyType] || "🏠"} ${c.planetName} (ID: ${c.id}) — Sector ${c.sectorId}`, type: "warning" },
              { text: `║    Type: ${(c.colonyType || "mining").toUpperCase()} | Level: ${c.level}/5 | Pop: ${c.population}`, type: "output" },
              { text: `║    Defense: ${c.defense} fighters | Hours since collection: ${c.hoursSinceCollection}`, type: "output" },
              { text: `║    Pending: ${c.projectedCredits} cr, ${c.projectedFuelOre} ore, ${c.projectedOrganics} org, ${c.projectedEquipment} eq`, type: "success" },
              { text: `║    Income/hr: ${c.baseIncome?.credits} cr, ${c.baseIncome?.fuelOre} ore, ${c.baseIncome?.organics} org, ${c.baseIncome?.equipment} eq`, type: "info" },
              { text: `║`, type: "info" },
            ]);
          });
          addLines([
            { text: `╠══════════════════════════════════════════════════════════════════════╣`, type: "info" },
            { text: `║  collect — Collect all income | upgrade-colony <id> — Level up      ║`, type: "system" },
            { text: `║  fortify <id> <qty> — Deploy fighters for defense                   ║`, type: "system" },
            { text: `╚══════════════════════════════════════════════════════════════════════╝`, type: "info" },
          ]);
          break;
        }

        case "collect":
        case "harvest": {
          addLine("Collecting colony income...", "system");
          const result = await collectIncomeMut.mutateAsync();
          addLine(result.message, result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "upgrade-colony":
        case "uc": {
          if (!arg1 || isNaN(Number(arg1))) {
            addLine("Usage: upgrade-colony <colony_id>", "warning");
            addLine("Use 'colonies' to see your colony IDs.", "info");
            break;
          }
          addLine("Upgrading colony infrastructure...", "system");
          const result = await upgradeColonyMut.mutateAsync({ colonyId: Number(arg1) });
          addLine(result.message, result.success ? "success" : "error");
          break;
        }

        case "fortify": {
          if (!arg1 || isNaN(Number(arg1)) || !arg2 || isNaN(Number(arg2))) {
            addLine("Usage: fortify <colony_id> <fighter_count>", "warning");
            break;
          }
          const result = await fortifyColonyMut.mutateAsync({
            colonyId: Number(arg1),
            fighters: Number(arg2),
          });
          addLine(result.message, result.success ? "success" : "error");
          utils.tradeWars.getState.invalidate();
          break;
        }

        case "log":
        case "history": {
          const logData = await utils.tradeWars.getLog.fetch();
          if (!logData || logData.length === 0) {
            addLine("No actions recorded yet.", "warning");
            break;
          }
          addLine(`╔════════════════════════════════════════════╗`, "info");
          addLine(`║  RECENT ACTIONS (last ${logData.length})`, "info");
          addLine(`╠════════════════════════════════════════════╣`, "info");
          logData.slice(0, 15).forEach((entry: any) => {
            const time = new Date(entry.createdAt).toLocaleTimeString();
            const details = entry.details as any;
            let summary = entry.action;
            if (entry.action === "warp") summary = `Warped to sector ${details?.to}`;
            else if (entry.action === "buy") summary = `Bought ${details?.quantity} ${details?.commodity}`;
            else if (entry.action === "sell") summary = `Sold ${details?.quantity} ${details?.commodity}`;
            else if (entry.action === "combat") summary = `Combat: ${details?.won ? "WON" : "LOST"} vs ${details?.enemy}`;
            addLine(`║  [${time}] ${summary}`, "output");
          });
          addLine(`╚════════════════════════════════════════════╝`, "info");
          break;
        }

        default: {
          addLine(`Unknown command: "${command}". Type 'help' for available commands.`, "error");
        }
      }
    } catch (err: any) {
      addLine(`ERROR: ${err.message || "Command failed"}`, "error");
    }

    setIsProcessing(false);
  }, [addLine, addLines, showSectorInfo, utils, warpMut, tradeMut, scanMut, upgradeMut, buyFightersMut, repairMut, combatMut, mineMut, claimPlanetMut, collectIncomeMut, upgradeColonyMut, fortifyColonyMut, shipsQuery.data, stateQuery.data]);

  // Handle input submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing || !input.trim()) return;

    setCommandHistory(prev => [input, ...prev].slice(0, 50));
    setHistoryIndex(-1);
    processCommand(input);
    setInput("");
  }, [input, isProcessing, processCommand]);

  // Handle key events for history navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistoryIndex(prev => {
        const next = Math.min(prev + 1, commandHistory.length - 1);
        if (commandHistory[next]) setInput(commandHistory[next]);
        return next;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistoryIndex(prev => {
        const next = Math.max(prev - 1, -1);
        setInput(next >= 0 ? commandHistory[next] : "");
        return next;
      });
    }
  }, [commandHistory]);

  // Focus input on terminal click
  const handleTerminalClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Auth gate
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 font-mono animate-pulse">Establishing uplink...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="border border-cyan-500/30 bg-black/90 p-8 rounded max-w-md text-center">
          <pre className="text-cyan-500 text-xs mb-4 whitespace-pre">{`
  ████████╗██╗    ██╗
  ╚══██╔══╝██║    ██║
     ██║   ██║ █╗ ██║
     ██║   ██║███╗██║
     ██║   ╚███╔███╔╝
     ╚═╝    ╚══╝╚══╝`}</pre>
          <h2 className="text-cyan-400 font-mono text-lg mb-2">TRADE WARS</h2>
          <p className="text-gray-400 font-mono text-sm mb-6">Authentication required to access the Inception Ark Command Terminal.</p>
          <a
            href={getLoginUrl()}
            className="inline-block px-6 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-mono text-sm hover:bg-cyan-500/30 transition-colors"
          >
            [ AUTHENTICATE ]
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 py-2 bg-gray-900/80 border-b border-cyan-500/20 gap-1">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/games" className="text-cyan-400 font-mono text-[10px] sm:text-xs hover:text-cyan-300 transition-colors">
            ← GAMES
          </Link>
          <span className="text-gray-600 font-mono text-[10px] sm:text-xs">|</span>
          <span className="text-cyan-500 font-mono text-[10px] sm:text-xs tracking-wider">TRADE WARS</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 font-mono text-[10px] sm:text-xs">
          {stateQuery.data && (
            <>
              <span className="text-green-400">{stateQuery.data.credits?.toLocaleString()} cr</span>
              <span className="text-gray-500">|</span>
              <span className="text-amber-400">T:{stateQuery.data.turnsRemaining}</span>
              <span className="text-gray-500">|</span>
              <span className="text-cyan-400">S{stateQuery.data.currentSector}</span>
            </>
          )}
        </div>
      </div>

      {/* Terminal */}
      <div
        ref={termRef}
        onClick={handleTerminalClick}
        className="flex-1 overflow-y-auto p-2 sm:p-4 font-mono text-[10px] sm:text-sm leading-relaxed cursor-text"
        style={{
          background: "linear-gradient(180deg, #000000 0%, #001a1a 100%)",
          textShadow: "0 0 5px rgba(0, 255, 255, 0.15)",
        }}
      >
        {/* CRT scanline effect */}
        <div
          className="pointer-events-none fixed inset-0 z-10"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          }}
        />

        {lines.map((line, i) => (
          <div key={i} className={`${colorClass(line.type)} whitespace-pre-wrap break-all`}>
            {line.text || "\u00A0"}
          </div>
        ))}

        {isProcessing && (
          <div className="text-cyan-400 animate-pulse">Processing...</div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-900/90 border-t border-cyan-500/20">
        <span className="text-green-400 font-mono text-xs sm:text-sm mr-2">{">"}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          autoFocus
          className="flex-1 bg-transparent text-green-400 font-mono text-xs sm:text-sm outline-none placeholder-gray-600 caret-green-400"
          placeholder={isProcessing ? "Processing..." : "Enter command..."}
          autoComplete="off"
          spellCheck={false}
          autoCapitalize="off"
        />
      </form>
    </div>
  );
}
