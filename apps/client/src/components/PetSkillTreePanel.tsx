/* ═══════════════════════════════════════════════════════
   PET SKILL TREE PANEL

   Renders the 3-branch (Combat/Utility/Social) skill tree
   for a single pet. Nodes show tier, cost, description, and
   a lock icon if prereqs aren't met. Clicking an unlockable
   node consumes a skill point.

   Unlocks persist in localStorage (client-authoritative for
   now — the server tracks skillPoints only, not the specific
   unlocked nodes. Future: sync nodes via playerPets.unlockedMoves).
   ═══════════════════════════════════════════════════════ */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Check, Sparkles } from "lucide-react";
import { PET_SKILL_TREES, type PetSkillNode, type PetSkillBranch } from "@/game/petBonding";
import { toast } from "sonner";

interface Props {
  petId: string;
  petName: string;
  availablePoints: number;
  onSpendPoint?: () => void;
}

const STORAGE_KEY = "dischordian-pet-skills";

type StoredSkills = Record<string, string[]>;

function loadUnlocked(): StoredSkills {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSkills) : {};
  } catch {
    return {};
  }
}

function saveUnlocked(data: StoredSkills) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

export default function PetSkillTreePanel({ petId, petName, availablePoints, onSpendPoint }: Props) {
  const [unlocked, setUnlocked] = useState<string[]>(() => loadUnlocked()[petId] ?? []);
  const tree = PET_SKILL_TREES.default; // Future: per-species trees

  useEffect(() => {
    setUnlocked(loadUnlocked()[petId] ?? []);
  }, [petId]);

  const canUnlock = (node: PetSkillNode): { ok: boolean; reason?: string } => {
    if (unlocked.includes(node.id)) return { ok: false, reason: "Already unlocked" };
    if (availablePoints < node.cost) return { ok: false, reason: "Not enough skill points" };
    if (node.requires && !unlocked.includes(node.requires)) {
      return { ok: false, reason: `Requires ${node.requires}` };
    }
    return { ok: true };
  };

  const handleUnlock = (node: PetSkillNode) => {
    const check = canUnlock(node);
    if (!check.ok) {
      toast.error(check.reason ?? "Cannot unlock");
      return;
    }
    const next = [...unlocked, node.id];
    setUnlocked(next);
    const all = loadUnlocked();
    all[petId] = next;
    saveUnlocked(all);
    onSpendPoint?.();
    toast.success(`${node.name} unlocked for ${petName}`);
  };

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 p-4" data-testid="pet-skill-tree">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-400" />
          <span className="font-display text-xs font-bold tracking-[0.2em]">SKILL TREE · {petName.toUpperCase()}</span>
        </div>
        <span className="font-mono text-[9px] text-indigo-300">
          {availablePoints} point{availablePoints !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <BranchColumn branch={tree.combat} unlocked={unlocked} canUnlock={canUnlock} onUnlock={handleUnlock} accent="text-red-400" />
        <BranchColumn branch={tree.utility} unlocked={unlocked} canUnlock={canUnlock} onUnlock={handleUnlock} accent="text-emerald-400" />
        <BranchColumn branch={tree.social} unlocked={unlocked} canUnlock={canUnlock} onUnlock={handleUnlock} accent="text-sky-400" />
      </div>
    </div>
  );
}

function BranchColumn({
  branch, unlocked, canUnlock, onUnlock, accent,
}: {
  branch: PetSkillBranch;
  unlocked: string[];
  canUnlock: (n: PetSkillNode) => { ok: boolean; reason?: string };
  onUnlock: (n: PetSkillNode) => void;
  accent: string;
}) {
  return (
    <div className="space-y-2">
      <div className={`font-mono text-[10px] uppercase tracking-wider ${accent}`}>{branch.name}</div>
      {branch.nodes.map((node) => {
        const isUnlocked = unlocked.includes(node.id);
        const check = canUnlock(node);
        const locked = !isUnlocked && !check.ok;
        return (
          <motion.button
            key={node.id}
            whileHover={{ scale: isUnlocked || check.ok ? 1.02 : 1 }}
            onClick={() => !isUnlocked && onUnlock(node)}
            disabled={isUnlocked || !check.ok}
            className={`w-full text-left border rounded-md p-2 transition-colors ${
              isUnlocked
                ? "border-emerald-500/40 bg-emerald-500/10"
                : check.ok
                ? "border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10"
                : "border-border/30 bg-card/30 opacity-60 cursor-not-allowed"
            }`}
            data-testid={`skill-${node.id}`}
            title={check.reason ?? node.description}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-foreground">{node.name}</span>
              <span className="flex items-center gap-1 text-[9px] font-mono">
                {isUnlocked ? <Check size={10} className="text-emerald-400" /> : locked ? <Lock size={10} className="text-muted-foreground/60" /> : null}
                <span className="text-amber-400">{node.cost}</span>
              </span>
            </div>
            <p className="font-mono text-[9px] text-muted-foreground/70 mt-0.5 leading-relaxed">
              {node.description}
            </p>
            <p className="font-mono text-[8px] text-muted-foreground/50 mt-0.5">Tier {node.tier}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
