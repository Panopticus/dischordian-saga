/* ═══════════════════════════════════════════════════════
   PET SKILL TREE PANEL

   Renders the 3-branch (Combat/Utility/Social) skill tree
   for a single pet. Skill tree definition is resolved
   per-species so Lux, Cipher, and Echo each see their own
   branches. Unlocks are server-authoritative via
   `trpc.petBattles.unlockSkillNode` — skillPoints and the
   unlocked-node list both live on `playerPets`.
   ═══════════════════════════════════════════════════════ */

import { Lock, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import {
  getSkillTreeForSpecies,
  type PetSkillNode,
  type PetSkillBranch,
} from "@shared/petSkillTrees";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Props {
  petId: string;
  petName: string;
  species: string;
  availablePoints: number;
  unlockedNodes: string[];
}

export default function PetSkillTreePanel({
  petId, petName, species, availablePoints, unlockedNodes,
}: Props) {
  const tree = getSkillTreeForSpecies(species);
  const utils = trpc.useUtils();

  const unlockMutation = trpc.petBattles.unlockSkillNode.useMutation({
    onSuccess: (res) => {
      toast.success(`Unlocked · ${res.nodeId}`);
      utils.petBattles.getMyPets.invalidate();
      utils.petBattles.getPartyTraits.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const canUnlock = (node: PetSkillNode): { ok: boolean; reason?: string } => {
    if (unlockedNodes.includes(node.id)) return { ok: false, reason: "Already unlocked" };
    if (availablePoints < node.cost) return { ok: false, reason: "Not enough skill points" };
    if (node.requires && !unlockedNodes.includes(node.requires)) {
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
    unlockMutation.mutate({ petId, nodeId: node.id });
  };

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 p-4" data-testid="pet-skill-tree">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="void-text-energy" />
          <span className="font-display text-xs font-bold tracking-[0.2em]">
            SKILL TREE · {petName.toUpperCase()}
          </span>
        </div>
        <span className="font-mono text-[9px] void-text-energy">
          {availablePoints} point{availablePoints !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <BranchColumn branch={tree.combat} unlocked={unlockedNodes} canUnlock={canUnlock} onUnlock={handleUnlock} accent="void-text-error" />
        <BranchColumn branch={tree.utility} unlocked={unlockedNodes} canUnlock={canUnlock} onUnlock={handleUnlock} accent="void-text-energy" />
        <BranchColumn branch={tree.social} unlocked={unlockedNodes} canUnlock={canUnlock} onUnlock={handleUnlock} accent="void-text-energy" />
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
                ? "void-border-success void-bg-success"
                : check.ok
                ? "void-border void-bg-sunk void-bg-sunk"
                : "border-border/30 bg-card/30 opacity-60 cursor-not-allowed"
            }`}
            data-testid={`skill-${node.id}`}
            title={check.reason ?? node.description}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-foreground">{node.name}</span>
              <span className="flex items-center gap-1 text-[9px] font-mono">
                {isUnlocked ? <Check size={10} className="void-text-energy" /> : locked ? <Lock size={10} className="text-muted-foreground/60" /> : null}
                <span className="void-text-accent">{node.cost}</span>
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
