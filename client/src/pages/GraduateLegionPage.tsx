/* ═══════════════════════════════════════════════════════
   GRADUATE LEGION PAGE

   Manages all graduated apprentices: view roster, deploy to
   roles (army/trade/tower), cryo freeze (2 slots), sacrifice,
   gift to NPCs, read letters from the front.
   ═══════════════════════════════════════════════════════ */
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ChevronLeft, Users, Swords, Ship, Shield, Snowflake, Skull, Gift, Mail, Heart, AlertTriangle,
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import {
  SLOT_LIMITS,
  computeRoleBonus,
  computeSacrificeReward,
  type GraduateRole,
  type LegionRoster,
  type GraduateAssignment,
} from "@shared/graduateLegion";
import { getRarityTier, type Apprentice } from "@shared/apprentices";
import { toast } from "sonner";

const ROLE_META: Record<GraduateRole, { label: string; icon: any; color: string; description: string }> = {
  companion: { label: "On Ship (Companion)", icon: Heart, color: "text-rose-400", description: "With you. Daily bond. Personal quests." },
  cryo_vault: { label: "Cryo Vault", icon: Snowflake, color: "text-cyan-400", description: "Frozen. Stored for later deployment." },
  army_leader: { label: "Army Leader", icon: Swords, color: "text-red-400", description: "Commands a squad in your military." },
  trade_envoy: { label: "Trade Envoy", icon: Ship, color: "text-amber-400", description: "Runs trade routes + faction relations." },
  tower_captain: { label: "Tower Captain", icon: Shield, color: "text-emerald-400", description: "Leads a Tower Defense front." },
  sacrificed: { label: "Sacrificed", icon: Skull, color: "text-red-600", description: "Killed. Dark power gained. Cannot be undone." },
  relationship_gift: { label: "Gifted", icon: Gift, color: "text-purple-400", description: "Given to an NPC as a loyal student." },
};

export default function GraduateLegionPage() {
  const { state, setLegionRoster, addCorruption, markLettersRead } = useGame();
  const roster = (state.legionRoster as LegionRoster) ?? { assignments: [], unassigned: [], sacrificedHistory: [] };
  const graduates = (state.legionGraduates as Record<string, Apprentice>) ?? {};
  const letters = state.legionLetters ?? [];
  const unreadCount = letters.filter(l => !l.read).length;
  const [selectedApprentice, setSelectedApprentice] = useState<Apprentice | null>(null);
  const [showLetters, setShowLetters] = useState(false);

  const allGraduates = useMemo(() => Object.values(graduates), [graduates]);
  const assignmentByApprentice = useMemo(() => {
    const map = new Map<string, GraduateAssignment>();
    for (const a of roster.assignments) map.set(a.apprenticeId, a);
    return map;
  }, [roster.assignments]);

  const assignRole = (apprenticeId: string, role: GraduateRole) => {
    // Check slot limits
    if (role !== "sacrificed" && role !== "relationship_gift") {
      const limit = SLOT_LIMITS[role as keyof typeof SLOT_LIMITS];
      if (limit !== undefined) {
        const used = roster.assignments.filter(a => a.role === role).length;
        if (used >= limit) {
          toast.error(`${ROLE_META[role].label} is full (${used}/${limit}). Unassign someone first.`);
          return;
        }
      }
    }
    const newAssignments = roster.assignments.filter(a => a.apprenticeId !== apprenticeId);
    newAssignments.push({ apprenticeId, role, assignedAt: Date.now() });
    setLegionRoster({ ...roster, assignments: newAssignments });
    toast.success(`${graduates[apprenticeId]?.name} → ${ROLE_META[role].label}`);
    setSelectedApprentice(null);
  };

  const unassign = (apprenticeId: string) => {
    setLegionRoster({
      ...roster,
      assignments: roster.assignments.filter(a => a.apprenticeId !== apprenticeId),
    });
    toast.success("Reassignment complete.");
  };

  const sacrifice = (app: Apprentice) => {
    const reward = computeSacrificeReward(app);
    addCorruption(reward.corruptionGain);
    setLegionRoster({
      ...roster,
      assignments: [
        ...roster.assignments.filter(a => a.apprenticeId !== app.id),
        { apprenticeId: app.id, role: "sacrificed", assignedAt: Date.now(),
          payload: { sacrificeReward: reward.reward } },
      ],
      sacrificedHistory: [
        ...roster.sacrificedHistory,
        { id: app.id, name: app.name, rarity: app.rarity, at: Date.now() },
      ],
    });
    toast.error(`${app.name} SACRIFICED · +${reward.corruptionGain} corruption · ${reward.reward}`, { duration: 8000 });
    setSelectedApprentice(null);
  };

  // Slot usage
  const usage = {
    companion: roster.assignments.filter(a => a.role === "companion").length,
    cryo_vault: roster.assignments.filter(a => a.role === "cryo_vault").length,
    army_leader: roster.assignments.filter(a => a.role === "army_leader").length,
    trade_envoy: roster.assignments.filter(a => a.role === "trade_envoy").length,
    tower_captain: roster.assignments.filter(a => a.role === "tower_captain").length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <Users size={18} className="text-amber-400" />
          <div className="flex-1">
            <h1 className="font-display text-lg font-bold tracking-wider">GRADUATE LEGION</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              {allGraduates.length} graduates · deploy, sacrifice, or freeze
            </p>
          </div>
          <button
            onClick={() => { setShowLetters(!showLetters); if (!showLetters) markLettersRead(); }}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded border border-border/40 hover:bg-muted/20 font-mono text-[10px] uppercase tracking-wider"
            data-testid="letters-toggle"
          >
            <Mail size={12} /> Letters
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white font-mono text-[9px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Slot usage bar */}
        <div className="mb-4 p-3 rounded border border-border/30 bg-card/40">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
            <SlotBox role="companion" usage={usage.companion} limit={SLOT_LIMITS.companion} />
            <SlotBox role="cryo_vault" usage={usage.cryo_vault} limit={SLOT_LIMITS.cryo_vault} />
            <SlotBox role="army_leader" usage={usage.army_leader} limit={SLOT_LIMITS.army_leader} />
            <SlotBox role="trade_envoy" usage={usage.trade_envoy} limit={SLOT_LIMITS.trade_envoy} />
            <SlotBox role="tower_captain" usage={usage.tower_captain} limit={SLOT_LIMITS.tower_captain} />
          </div>
        </div>

        {/* Letters panel */}
        {showLetters && (
          <div className="mb-4 p-3 rounded border border-indigo-500/30 bg-indigo-500/5 max-h-96 overflow-y-auto space-y-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-indigo-400 block">
              LETTERS FROM THE FRONT ({letters.length})
            </span>
            {letters.length === 0 ? (
              <p className="font-mono text-[10px] text-muted-foreground/60 italic">
                No letters yet. Deploy apprentices and wait — they'll write.
              </p>
            ) : (
              letters.slice().reverse().map(l => {
                const sender = graduates[l.fromApprenticeId];
                return (
                  <div key={l.id} className="p-2 rounded border border-border/30 bg-background/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display text-xs font-bold text-indigo-300">
                        {sender?.name ?? "Unknown"}
                      </span>
                      <span className="font-mono text-[8px] text-muted-foreground/50">
                        {new Date(l.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] italic text-foreground/80 leading-relaxed whitespace-pre-line">
                      {l.body}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Roster */}
        <div className="space-y-2">
          {allGraduates.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border/40 rounded-lg bg-card/20">
              <Users size={32} className="mx-auto text-muted-foreground/40 mb-2" />
              <p className="font-mono text-[10px] text-muted-foreground/70">
                No graduates yet. Complete the Celebration trial with an Apprentice to build your Legion.
              </p>
              <Link href="/apprentice" className="mt-3 inline-block px-3 py-1.5 rounded border border-amber-500/40 bg-amber-500/10 text-amber-400 font-mono text-[10px] uppercase tracking-wider hover:bg-amber-500/20">
                Go to Apprentice
              </Link>
            </div>
          ) : (
            allGraduates.map(app => {
              const assignment = assignmentByApprentice.get(app.id);
              const currentRole = assignment?.role;
              const tier = getRarityTier(app.rarity);
              return (
                <GraduateRow
                  key={app.id}
                  apprentice={app}
                  currentRole={currentRole}
                  onClick={() => setSelectedApprentice(app)}
                />
              );
            })
          )}
        </div>

        {/* Assignment modal */}
        {selectedApprentice && (
          <AssignModal
            apprentice={selectedApprentice}
            onAssign={assignRole}
            onUnassign={unassign}
            onSacrifice={sacrifice}
            onClose={() => setSelectedApprentice(null)}
            currentAssignment={assignmentByApprentice.get(selectedApprentice.id)}
          />
        )}
      </div>
    </div>
  );
}

/* ─── SLOT BOX ─── */
function SlotBox({ role, usage, limit }: { role: keyof typeof SLOT_LIMITS; usage: number; limit: number }) {
  const meta = ROLE_META[role];
  const Icon = meta.icon;
  return (
    <div className="p-2 rounded border border-border/30 bg-background/40">
      <div className="flex items-center justify-center gap-1 mb-1">
        <Icon size={10} className={meta.color} />
        <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/70">
          {role === "companion" ? "Ship" : role === "cryo_vault" ? "Cryo" : role === "army_leader" ? "Army" : role === "trade_envoy" ? "Trade" : "Tower"}
        </span>
      </div>
      <div className={`font-display text-sm font-bold tabular-nums ${usage === limit ? "text-red-400" : meta.color}`}>
        {usage}/{limit}
      </div>
    </div>
  );
}

/* ─── GRADUATE ROW ─── */
function GraduateRow({ apprentice, currentRole, onClick }: {
  apprentice: Apprentice; currentRole?: GraduateRole; onClick: () => void;
}) {
  const tier = getRarityTier(apprentice.rarity);
  const role = currentRole ? ROLE_META[currentRole] : null;
  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="w-full text-left p-2.5 rounded border border-border/30 bg-card/40 hover:border-border/60 hover:bg-card/60 transition-colors"
      data-testid={`graduate-${apprentice.id}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display text-sm font-bold text-foreground">{apprentice.name}</span>
            <span
              className="font-mono text-[8px] uppercase tracking-wider px-1 rounded"
              style={{ color: tier.color, backgroundColor: `${tier.color}15` }}
            >
              {tier.name}
            </span>
            {role && (
              <span className={`font-mono text-[8px] uppercase tracking-wider ${role.color}`}>
                ▸ {role.label}
              </span>
            )}
          </div>
          <p className="font-mono text-[9px] text-muted-foreground/60 mt-0.5">
            {apprentice.archetype} · {apprentice.race} · {apprentice.combatClass}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

/* ─── ASSIGN MODAL ─── */
function AssignModal({ apprentice, onAssign, onUnassign, onSacrifice, onClose, currentAssignment }: {
  apprentice: Apprentice;
  onAssign: (id: string, role: GraduateRole) => void;
  onUnassign: (id: string) => void;
  onSacrifice: (app: Apprentice) => void;
  onClose: () => void;
  currentAssignment?: GraduateAssignment;
}) {
  const tier = getRarityTier(apprentice.rarity);
  const [confirmSacrifice, setConfirmSacrifice] = useState(false);
  const sacrificeReward = computeSacrificeReward(apprentice);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        className="max-w-md w-full max-h-[85vh] overflow-y-auto rounded-lg border border-border/40 bg-card p-4 space-y-3"
      >
        <div>
          <h3 className="font-display text-lg font-bold tracking-wider text-foreground">{apprentice.name}</h3>
          <p className="font-mono text-[9px] text-muted-foreground/70">{apprentice.archetype} · {apprentice.backstory}</p>
          <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: tier.color }}>
            {tier.name}
          </span>
        </div>

        {currentAssignment && (
          <div className="p-2 rounded border border-border/30 bg-background/40">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 block mb-1">
              Currently: {ROLE_META[currentAssignment.role].label}
            </span>
            <button
              onClick={() => { onUnassign(apprentice.id); onClose(); }}
              className="w-full px-2 py-1 rounded border border-border/40 font-mono text-[9px] uppercase tracking-wider hover:bg-muted/20"
            >
              Unassign
            </button>
          </div>
        )}

        {/* Deploy buttons */}
        {!confirmSacrifice && (
          <>
            <div className="space-y-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 block">
                Deploy to:
              </span>
              {(["companion", "cryo_vault", "army_leader", "trade_envoy", "tower_captain"] as GraduateRole[]).map(role => {
                const meta = ROLE_META[role];
                const Icon = meta.icon;
                const bonuses = computeRoleBonus(apprentice, role);
                return (
                  <button
                    key={role}
                    onClick={() => onAssign(apprentice.id, role)}
                    className="w-full text-left p-2 rounded border border-border/30 bg-background/40 hover:border-border/60"
                    data-testid={`assign-${role}`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <Icon size={12} className={meta.color} />
                      <span className={`font-mono text-[10px] uppercase tracking-wider ${meta.color}`}>{meta.label}</span>
                    </div>
                    {bonuses.length > 0 && (
                      <p className="font-mono text-[9px] text-foreground/70 leading-snug">
                        {bonuses.map(b => b.label).join(" · ")}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sacrifice section */}
            <div className="pt-2 border-t border-red-500/20">
              <button
                onClick={() => setConfirmSacrifice(true)}
                className="w-full p-2 rounded border border-red-500/40 bg-red-500/5 text-red-400 font-mono text-[10px] uppercase tracking-wider hover:bg-red-500/10 flex items-center justify-center gap-2"
                data-testid="sacrifice-init"
              >
                <Skull size={11} /> Sacrifice for Dark Power
              </button>
            </div>
          </>
        )}

        {/* Sacrifice confirmation */}
        {confirmSacrifice && (
          <div className="p-3 rounded border-2 border-red-500/60 bg-red-500/10 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-400" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-red-400">
                IRREVERSIBLE
              </span>
            </div>
            <p className="font-mono text-[10px] italic text-foreground/80 leading-relaxed">
              {apprentice.name} will die. Every other apprentice in your roster will react. Corruption will rise. The Dreamer will notice.
            </p>
            <div className="p-2 rounded border border-red-500/30 bg-background/40">
              <span className="font-mono text-[9px] uppercase tracking-wider text-red-400 block mb-1">
                Reward ({tier.name})
              </span>
              <p className="font-mono text-[9px] text-foreground/85">+{sacrificeReward.corruptionGain} corruption</p>
              <p className="font-mono text-[9px] italic text-amber-300/80 mt-0.5">{sacrificeReward.reward}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onSacrifice(apprentice)}
                className="flex-1 px-3 py-2 rounded border border-red-500/60 bg-red-500/20 text-red-300 font-mono text-[10px] uppercase tracking-wider hover:bg-red-500/30"
                data-testid="sacrifice-confirm"
              >
                Confirm Sacrifice
              </button>
              <button
                onClick={() => setConfirmSacrifice(false)}
                className="px-3 py-2 rounded border border-border/40 font-mono text-[10px] uppercase tracking-wider hover:bg-muted/20"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full px-3 py-1.5 rounded border border-border/30 text-muted-foreground/70 font-mono text-[9px] uppercase tracking-wider hover:bg-muted/20"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
