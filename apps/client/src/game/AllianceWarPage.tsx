/* ═══════════════════════════════════════════════════════
   ALLIANCE WAR PAGE — wraps the hex map with war timer,
   contribution leaderboard and attack history log.
   Route: /alliance-war • Gated to bridge discovery.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Shield, Swords, Crown, Trophy, X, Zap, Clock, Lock,
} from "lucide-react";
import AllianceWarMap, { WarMapLegend, WarHeader } from "./AllianceWarMap";
import {
  generateWarMap,
  MAX_ATTACKS_PER_MEMBER,
  WAR_PHASE_DURATION_MS,
  type WarMap,
} from "@shared/allianceWar";
import { useGame } from "@/contexts/GameContext";
import { toast } from "sonner";

interface MemberContribution {
  userId: string;
  name: string;
  attacks: number;
  nodesCleared: number;
  points: number;
}

interface AttackLogEntry {
  id: string;
  attackerName: string;
  nodeId: string;
  nodeLabel: string;
  won: boolean;
  timestamp: number;
}

/* ─── DEMO SEED DATA ─── */
const MOCK_CONTRIBUTORS: MemberContribution[] = [
  { userId: "u1", name: "Nova Vex",      attacks: 3, nodesCleared: 3, points: 750 },
  { userId: "u2", name: "Kael Ryn",      attacks: 3, nodesCleared: 2, points: 500 },
  { userId: "u3", name: "Ada-7",         attacks: 2, nodesCleared: 2, points: 400 },
  { userId: "u4", name: "Stitch",        attacks: 3, nodesCleared: 1, points: 200 },
  { userId: "u5", name: "Velour",        attacks: 1, nodesCleared: 1, points: 150 },
];

function formatTimer(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function AllianceWarPage() {
  const [, navigate] = useLocation();
  const { state } = useGame();

  // Gated to bridge
  const bridgeUnlocked = state.rooms?.["bridge"]?.unlocked;

  const [warMap] = useState<WarMap>(() => generateWarMap());
  const [clearedNodes, setClearedNodes] = useState<Set<string>>(new Set());
  const [isDefensePhase, setIsDefensePhase] = useState(false);
  const [attacksUsed, setAttacksUsed] = useState(0);
  const [attackLog, setAttackLog] = useState<AttackLogEntry[]>([]);
  const [phaseStartedAt] = useState(() => Date.now() - 2 * 60 * 60 * 1000); // 2h ago
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeRemaining = useMemo(() => {
    return Math.max(0, phaseStartedAt + WAR_PHASE_DURATION_MS - now);
  }, [phaseStartedAt, now]);

  const guildAScore = useMemo(
    () => MOCK_CONTRIBUTORS.reduce((sum, c) => sum + c.points, 0),
    [],
  );
  const guildBScore = 1850;

  const handleNodeClick = (nodeId: string) => {
    const node = warMap.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    if (isDefensePhase) {
      toast.info(`Placing defender on ${node.type.toUpperCase()} node`, {
        description: "Select a deck from your collection.",
      });
      return;
    }

    if (clearedNodes.has(nodeId)) {
      toast.warning("Already cleared.");
      return;
    }
    if (attacksUsed >= MAX_ATTACKS_PER_MEMBER) {
      toast.error("Out of attacks for today.");
      return;
    }

    // Demo: roll an attack
    const won = Math.random() > 0.3;
    setAttacksUsed((a) => a + 1);
    if (won) {
      setClearedNodes((prev) => new Set(prev).add(nodeId));
    }
    setAttackLog((prev) =>
      [
        {
          id: `${nodeId}-${Date.now()}`,
          attackerName: "You",
          nodeId,
          nodeLabel: node.type.toUpperCase(),
          won,
          timestamp: Date.now(),
        },
        ...prev,
      ].slice(0, 12),
    );

    toast[won ? "success" : "error"](
      won ? `Cleared ${node.type} node!` : `Defeated on ${node.type} node.`,
    );
  };

  if (!bridgeUnlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center void-bg-canvas p-6">
        <div className="max-w-md rounded-lg border void-border-system void-bg-canvas p-8 text-center">
          <Lock className="mx-auto mb-4 void-text-system" size={48} />
          <h2 className="mb-2 text-xl font-bold void-text">Bridge Access Required</h2>
          <p className="mb-4 text-sm void-text">
            The alliance war console is located on the command bridge. Reach the bridge
            to coordinate with your guild.
          </p>
          <button
            onClick={() => navigate("/ark")}
            className="rounded void-bg-system px-4 py-2 font-semibold text-white void-bg-system"
          >
            Return to Ark
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black void-text">
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        {/* Top bar */}
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/ark")}
            className="flex items-center gap-2 rounded border void-border void-bg-canvas px-3 py-1.5 text-sm void-text void-bg-canvas"
            data-testid="alliance-war-back"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-wide">
            <Swords className="void-text-error" /> Alliance War
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setIsDefensePhase((v) => !v)}
              className="rounded border void-border-system void-bg-system px-3 py-1.5 text-xs font-semibold uppercase tracking-wider void-text-system void-bg-system"
              data-testid="toggle-phase"
            >
              Toggle Phase (demo)
            </button>
            <div className="flex items-center gap-2 rounded void-bg-canvas px-3 py-1.5 font-mono text-sm ring-1 ring-slate-700">
              <Clock size={14} className="void-text-accent" />
              {formatTimer(timeRemaining)}
            </div>
          </div>
        </div>

        {/* Score header */}
        <WarHeader
          guildAName="Neon Vanguard"
          guildBName="Null Syndicate"
          guildAScore={guildAScore}
          guildBScore={guildBScore}
          isDefensePhase={isDefensePhase}
          phaseEnded={timeRemaining <= 0 && !isDefensePhase}
          attacksUsed={attacksUsed}
          maxAttacks={MAX_ATTACKS_PER_MEMBER}
        />

        {/* Hex map */}
        <div className="mt-4">
          <AllianceWarMap
            warMap={warMap}
            isDefensePhase={isDefensePhase}
            myGuildId="guild-a"
            onNodeClick={handleNodeClick}
            clearedNodes={clearedNodes}
          />
        </div>

        {/* Legend */}
        <div className="mt-3">
          <WarMapLegend />
        </div>

        {/* Bottom row: contributors + log */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {/* Contributors */}
          <div className="void-surface p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider void-text-accent">
              <Trophy size={16} /> Contribution Leaderboard
            </div>
            <div className="space-y-2">
              {MOCK_CONTRIBUTORS.map((c, i) => (
                <div
                  key={c.userId}
                  className="flex items-center gap-3 rounded border void-border void-bg-canvas px-3 py-2 text-sm"
                >
                  <span
                    className={`w-5 text-center font-mono font-bold ${
                      i === 0
                        ? "void-text-accent"
                        : i === 1
                        ? "void-text"
                        : "void-text"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {i === 0 && <Crown size={14} className="void-text-accent" />}
                  <span className="flex-1 truncate void-text">{c.name}</span>
                  <span className="font-mono text-xs void-text">
                    {c.nodesCleared}/{c.attacks}
                  </span>
                  <span className="w-14 text-right font-mono font-bold void-text-system">
                    {c.points}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Attack log */}
          <div className="void-surface p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider void-text-error">
              <Zap size={16} /> Attack History
            </div>
            <div className="max-h-[260px] space-y-2 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {attackLog.length === 0 ? (
                  <div className="py-6 text-center text-xs void-text">
                    No attacks yet. Click a node to engage.
                  </div>
                ) : (
                  attackLog.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex items-center gap-2 rounded border px-3 py-2 text-xs ${
                        entry.won
                          ? "void-border-success void-bg-success void-text-energy"
                          : "void-border-error void-bg-error void-text-error"
                      }`}
                    >
                      {entry.won ? <Shield size={12} /> : <X size={12} />}
                      <span className="font-semibold">{entry.attackerName}</span>
                      <span className="void-text">
                        {entry.won ? "cleared" : "failed at"}
                      </span>
                      <span className="rounded void-bg-canvas px-1.5 font-mono">
                        {entry.nodeLabel}
                      </span>
                      <span className="ml-auto void-text">
                        {new Date(entry.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
