/* ═══════════════════════════════════════════════════════
   TERMINUS PVP CLIENT — WebSocket connection for base raids
   Connects to /api/terminus-pvp for matchmaking and combat.
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback, useRef, useEffect } from "react";

type PvPPhase = "idle" | "searching" | "base_found" | "attacking" | "results";

interface DefenderBase {
  userName: string;
  trophies: number;
  commanderLevel: number;
  turrets: Array<{ type: string; row: number; col: number; level: number }>;
  barricades: Array<{ row: number; col: number }>;
  gridWidth: number;
  gridHeight: number;
  corePosition: { x: number; y: number };
  spawnPoints: Array<{ x: number; y: number }>;
  resources: { salvage: number; viralIchor: number; neuralCores: number; voidCrystals: number };
}

interface RaidResult {
  stars: 0 | 1 | 2 | 3;
  loot: { salvage: number; viralIchor: number; neuralCores: number; voidCrystals: number };
  trophyChange: number;
  newTrophies: number;
}

export function useTerminusPvP(userId: number, userName: string, trophies: number) {
  const [phase, setPhase] = useState<PvPPhase>("idle");
  const [defenderBase, setDefenderBase] = useState<DefenderBase | null>(null);
  const [raidResult, setRaidResult] = useState<RaidResult | null>(null);
  const [raidId, setRaidId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const startTimeRef = useRef(0);

  const connect = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/terminus-pvp`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "FIND_RAID", userId, userName, trophies }));
      setPhase("searching");
      setError(null);
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      switch (msg.type) {
        case "BASE_FOUND":
          setDefenderBase(msg.defenderBase);
          setRaidId(msg.raidId);
          setPhase("base_found");
          break;
        case "NO_BASE_FOUND":
          setError(msg.reason || "No bases available");
          setPhase("idle");
          break;
        case "RAID_STARTED":
          setPhase("attacking");
          startTimeRef.current = Date.now();
          break;
        case "RAID_RESULT":
          setRaidResult(msg);
          setPhase("results");
          break;
        case "RAID_CANCELLED":
          setPhase("idle");
          break;
        case "ERROR":
          setError(msg.message);
          break;
      }
    };

    ws.onerror = () => {
      setError("Connection failed. Try again later.");
      setPhase("idle");
    };

    ws.onclose = () => {
      wsRef.current = null;
    };
  }, [userId, userName, trophies]);

  const send = useCallback((msg: any) => {
    wsRef.current?.send(JSON.stringify(msg));
  }, []);

  const startAttack = useCallback(() => send({ type: "START_ATTACK" }), [send]);
  const skipBase = useCallback(() => send({ type: "SKIP_BASE", cost: 5 }), [send]);
  const reportTurretDestroyed = useCallback(() => send({ type: "REPORT_TURRET_DESTROYED" }), [send]);
  const reportCoreDestroyed = useCallback(() => send({ type: "REPORT_CORE_DESTROYED" }), [send]);
  const endRaid = useCallback(() => {
    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    send({ type: "END_RAID", duration });
  }, [send]);
  const cancel = useCallback(() => {
    send({ type: "CANCEL" });
    setPhase("idle");
  }, [send]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setPhase("idle");
  }, []);

  // Cleanup on unmount
  useEffect(() => () => { wsRef.current?.close(); }, []);

  return {
    phase, defenderBase, raidResult, raidId, error,
    connect, startAttack, skipBase, reportTurretDestroyed,
    reportCoreDestroyed, endRaid, cancel, disconnect,
  };
}
