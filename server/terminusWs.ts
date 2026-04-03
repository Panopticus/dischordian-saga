/* ═══════════════════════════════════════════════════════
   TERMINUS SWARM PVP — WebSocket server for base raids

   Clash of Clans-style PvP:
   - Player searches for a base to raid
   - Server finds a target based on trophy range
   - Attacker deploys waves against defender's saved base
   - Stars, loot, and trophies calculated on completion
   - Defender gets shield after being raided
   ═══════════════════════════════════════════════════════ */
import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { getDb } from "./db";
import { randomUUID } from "crypto";

/* ─── TYPES ─── */

interface RaidPlayer {
  ws: WebSocket;
  userId: number;
  userName: string;
  trophies: number;
}

interface SavedBaseLayout {
  userId: number;
  userName: string;
  trophies: number;
  guildName?: string;
  commanderLevel: number;
  turrets: Array<{ type: string; row: number; col: number; level: number }>;
  barricades: Array<{ row: number; col: number }>;
  traps: Array<{ type: string; row: number; col: number }>;
  resources: { salvage: number; viralIchor: number; neuralCores: number; voidCrystals: number };
  gridWidth: number;
  gridHeight: number;
  corePosition: { x: number; y: number };
  spawnPoints: Array<{ x: number; y: number }>;
  shieldUntil: number; // timestamp
}

interface ActiveRaid {
  raidId: string;
  attacker: RaidPlayer;
  defenderBase: SavedBaseLayout;
  startedAt: number;
  timeLimit: number; // seconds (180 = 3 minutes)
  turretsDestroyed: number;
  totalTurrets: number;
  coreDestroyed: boolean;
  attackDuration: number;
  ended: boolean;
}

type ClientMessage =
  | { type: "FIND_RAID"; userId: number; userName: string; trophies: number }
  | { type: "SKIP_BASE"; cost: number }
  | { type: "START_ATTACK" }
  | { type: "REPORT_TURRET_DESTROYED" }
  | { type: "REPORT_CORE_DESTROYED" }
  | { type: "END_RAID"; duration: number }
  | { type: "CANCEL" }
  | { type: "PING" };

type ServerMessage =
  | { type: "BASE_FOUND"; raidId: string; defenderBase: SavedBaseLayout }
  | { type: "NO_BASE_FOUND"; reason: string }
  | { type: "RAID_STARTED"; timeLimit: number }
  | { type: "RAID_RESULT"; stars: 0 | 1 | 2 | 3; loot: any; trophyChange: number; newTrophies: number }
  | { type: "RAID_CANCELLED" }
  | { type: "DEFENSE_LOG"; attackerName: string; stars: number; lootLost: any; trophyChange: number }
  | { type: "SHIELD_ACTIVATED"; durationHours: number; expiresAt: number }
  | { type: "ERROR"; message: string }
  | { type: "PONG" };

/* ─── STATE ─── */

const activeRaids = new Map<string, ActiveRaid>();
const playerConnections = new Map<number, RaidPlayer>();

// Mock base pool — in production this queries the database
const basePool: SavedBaseLayout[] = [];

/* ─── HELPERS ─── */

function send(ws: WebSocket, msg: ServerMessage) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
}

function calculateStars(coreDestroyed: boolean, turretsDestroyedPct: number, duration: number): 0 | 1 | 2 | 3 {
  if (coreDestroyed) return 3;
  if (turretsDestroyedPct >= 50) return 2;
  if (duration >= 60) return 1;
  return 0;
}

function calculateLoot(defResources: any, stars: number): any {
  const rate = 0.05 + stars * 0.05;
  return {
    salvage: Math.floor((defResources.salvage || 0) * rate),
    viralIchor: Math.floor((defResources.viralIchor || 0) * rate),
    neuralCores: Math.floor((defResources.neuralCores || 0) * rate * 0.5),
    voidCrystals: 0,
  };
}

function calculateTrophyChange(attackerTrophies: number, defenderTrophies: number, stars: number): number {
  const expected = 1 / (1 + Math.pow(10, (defenderTrophies - attackerTrophies) / 400));
  const result = stars >= 2 ? 1 : stars === 1 ? 0.5 : 0;
  return Math.round(30 * (result - expected));
}

function getShieldHours(destructionPct: number): number {
  if (destructionPct >= 90) return 16;
  if (destructionPct >= 60) return 14;
  if (destructionPct >= 30) return 12;
  return 0;
}

function findMatchingBase(attackerTrophies: number, skipIds: Set<number>): SavedBaseLayout | null {
  // Find bases within ±200 trophies that aren't shielded
  const now = Date.now();
  const candidates = basePool.filter(b =>
    !skipIds.has(b.userId) &&
    Math.abs(b.trophies - attackerTrophies) <= 300 &&
    b.shieldUntil < now
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/* ─── WEBSOCKET SERVER ─── */

export function setupTerminusPvpWebSocket(server: Server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    if (req.url === "/api/terminus-pvp") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    }
  });

  wss.on("connection", (ws: WebSocket) => {
    let currentRaidId: string | null = null;
    const skippedBases = new Set<number>();

    ws.on("message", async (data) => {
      try {
        const msg: ClientMessage = JSON.parse(data.toString());

        switch (msg.type) {
          case "PING":
            send(ws, { type: "PONG" });
            break;

          case "FIND_RAID": {
            const player: RaidPlayer = { ws, userId: msg.userId, userName: msg.userName, trophies: msg.trophies };
            playerConnections.set(msg.userId, player);

            const base = findMatchingBase(msg.trophies, skippedBases);
            if (!base) {
              send(ws, { type: "NO_BASE_FOUND", reason: "No bases available in your trophy range. Try again later." });
              break;
            }

            const raidId = randomUUID().slice(0, 12);
            const raid: ActiveRaid = {
              raidId,
              attacker: player,
              defenderBase: base,
              startedAt: Date.now(),
              timeLimit: 180,
              turretsDestroyed: 0,
              totalTurrets: base.turrets.length,
              coreDestroyed: false,
              attackDuration: 0,
              ended: false,
            };
            activeRaids.set(raidId, raid);
            currentRaidId = raidId;

            // Send base to attacker (traps hidden!)
            const visibleBase = {
              ...base,
              traps: [], // Traps are hidden from attacker
            };
            send(ws, { type: "BASE_FOUND", raidId, defenderBase: visibleBase });
            break;
          }

          case "SKIP_BASE": {
            if (currentRaidId) {
              const raid = activeRaids.get(currentRaidId);
              if (raid) {
                skippedBases.add(raid.defenderBase.userId);
                activeRaids.delete(currentRaidId);
              }
            }
            // Find next base
            const player = [...playerConnections.values()].find(p => p.ws === ws);
            if (player) {
              const base = findMatchingBase(player.trophies, skippedBases);
              if (!base) {
                send(ws, { type: "NO_BASE_FOUND", reason: "No more bases available." });
                break;
              }
              const raidId = randomUUID().slice(0, 12);
              const raid: ActiveRaid = {
                raidId,
                attacker: player,
                defenderBase: base,
                startedAt: Date.now(),
                timeLimit: 180,
                turretsDestroyed: 0,
                totalTurrets: base.turrets.length,
                coreDestroyed: false,
                attackDuration: 0,
                ended: false,
              };
              activeRaids.set(raidId, raid);
              currentRaidId = raidId;
              send(ws, { type: "BASE_FOUND", raidId, defenderBase: { ...base, traps: [] } });
            }
            break;
          }

          case "START_ATTACK": {
            if (!currentRaidId) break;
            const raid = activeRaids.get(currentRaidId);
            if (!raid) break;
            raid.startedAt = Date.now();
            send(ws, { type: "RAID_STARTED", timeLimit: raid.timeLimit });
            break;
          }

          case "REPORT_TURRET_DESTROYED": {
            if (!currentRaidId) break;
            const raid = activeRaids.get(currentRaidId);
            if (raid) raid.turretsDestroyed++;
            break;
          }

          case "REPORT_CORE_DESTROYED": {
            if (!currentRaidId) break;
            const raid = activeRaids.get(currentRaidId);
            if (raid) raid.coreDestroyed = true;
            break;
          }

          case "END_RAID": {
            if (!currentRaidId) break;
            const raid = activeRaids.get(currentRaidId);
            if (!raid || raid.ended) break;
            raid.ended = true;
            raid.attackDuration = msg.duration;

            const destructionPct = raid.totalTurrets > 0
              ? (raid.turretsDestroyed / raid.totalTurrets) * 100
              : (raid.coreDestroyed ? 100 : 0);

            const stars = calculateStars(raid.coreDestroyed, destructionPct, raid.attackDuration);
            const loot = calculateLoot(raid.defenderBase.resources, stars);
            const trophyChange = calculateTrophyChange(
              raid.attacker.trophies,
              raid.defenderBase.trophies,
              stars,
            );

            send(ws, {
              type: "RAID_RESULT",
              stars,
              loot,
              trophyChange,
              newTrophies: raid.attacker.trophies + trophyChange,
            });

            // Activate shield for defender
            const shieldHours = getShieldHours(destructionPct);
            if (shieldHours > 0) {
              const shieldExpires = Date.now() + shieldHours * 3600 * 1000;
              // Update defender's shield in base pool
              const defBase = basePool.find(b => b.userId === raid.defenderBase.userId);
              if (defBase) defBase.shieldUntil = shieldExpires;

              // Notify defender if online
              const defPlayer = playerConnections.get(raid.defenderBase.userId);
              if (defPlayer) {
                send(defPlayer.ws, {
                  type: "DEFENSE_LOG",
                  attackerName: raid.attacker.userName,
                  stars,
                  lootLost: loot,
                  trophyChange: -trophyChange,
                });
                send(defPlayer.ws, {
                  type: "SHIELD_ACTIVATED",
                  durationHours: shieldHours,
                  expiresAt: shieldExpires,
                });
              }
            }

            activeRaids.delete(currentRaidId);
            currentRaidId = null;
            break;
          }

          case "CANCEL": {
            if (currentRaidId) {
              activeRaids.delete(currentRaidId);
              currentRaidId = null;
            }
            send(ws, { type: "RAID_CANCELLED" });
            break;
          }
        }
      } catch (e) {
        console.error("[TerminusPvP] Message error:", e);
        send(ws, { type: "ERROR", message: "Invalid message" });
      }
    });

    ws.on("close", () => {
      // Clean up active raid
      if (currentRaidId) {
        activeRaids.delete(currentRaidId);
      }
      // Remove from connections
      for (const [id, p] of playerConnections) {
        if (p.ws === ws) { playerConnections.delete(id); break; }
      }
    });
  });

  console.log("[TerminusPvP] WebSocket server ready on /api/terminus-pvp");
}
