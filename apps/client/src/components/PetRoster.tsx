/* ═══════════════════════════════════════════════════════
   PET ROSTER

   Displays the player's full pet roster with bond, evolution
   stage, HP, injury state, morality dissonance, and a revive
   button for downed pets. Selection drives which pet leads
   the current arena battle.
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Heart, Swords, Shield, Skull, HeartHandshake, AlertTriangle, RotateCcw, Ghost, Star, StarOff,
} from "lucide-react";
import { calculateMoralityDissonance, canPetLeave } from "@/game/petBonding";
import { useMoralityStore, selectScore } from "@/stores/moralityStore";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export interface RosterPet {
  petId: string;
  species: string;
  name: string;
  evolutionStage: number;
  bond: number;
  skillPoints: number;
  currentHp: number;
  maxHp: number;
  wins: number;
  losses: number;
  injuredUntil: Date | string | null;
  isActive: boolean;
  isSpectral: boolean;
  deathCount: number;
}

interface Props {
  pets: RosterPet[];
  selectedPetId?: string | null;
  onSelect?: (petId: string) => void;
  onOpenSkills?: (petId: string) => void;
  onOpenQuests?: (petId: string) => void;
}

export default function PetRoster({ pets, selectedPetId, onSelect, onOpenSkills, onOpenQuests }: Props) {
  const moralityScore = useMoralityStore(selectScore);
  const utils = trpc.useUtils();
  const reviveMutation = trpc.petBattles.revivePet.useMutation({
    onSuccess: (res) => {
      toast.success(
        res.wasSpectral
          ? `Brought back from the spectral form — -${res.cost} Dream, -${res.bondPenalty} bond`
          : `Pet revived — -${res.cost} Dream, -${res.bondPenalty} bond`,
      );
      utils.petBattles.getMyPets.invalidate();
      utils.petBattles.getPartyTraits.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });
  const setActiveMutation = trpc.petBattles.setPetActive.useMutation({
    onSuccess: (res) => {
      toast.success(res.isActive ? "Added to active party" : "Removed from active party");
      utils.petBattles.getMyPets.invalidate();
      utils.petBattles.getPartyTraits.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  if (pets.length === 0) {
    return (
      <div className="border border-border/30 rounded-lg bg-card/40 p-4 text-center">
        <p className="font-mono text-[10px] text-muted-foreground/60">
          No pets in roster. Claim a starter specimen to begin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2" data-testid="pet-roster">
      <div className="flex items-center justify-between mb-1">
        <span className="font-display text-xs font-bold tracking-[0.2em]">ROSTER</span>
        <span className="font-mono text-[9px] text-muted-foreground/70">
          {pets.length} {pets.length === 1 ? "specimen" : "specimens"}
        </span>
      </div>
      {pets.map((p) => (
        <PetRosterRow
          key={p.petId}
          pet={p}
          selected={p.petId === selectedPetId}
          moralityScore={moralityScore}
          onSelect={() => onSelect?.(p.petId)}
          onOpenSkills={() => onOpenSkills?.(p.petId)}
          onOpenQuests={() => onOpenQuests?.(p.petId)}
          onRevive={() => reviveMutation.mutate({ petId: p.petId })}
          reviving={reviveMutation.isPending && reviveMutation.variables?.petId === p.petId}
          onToggleActive={() => setActiveMutation.mutate({ petId: p.petId, isActive: !p.isActive })}
          toggling={setActiveMutation.isPending && setActiveMutation.variables?.petId === p.petId}
        />
      ))}
    </div>
  );
}

function PetRosterRow({
  pet, selected, moralityScore, onSelect, onOpenSkills, onOpenQuests, onRevive, reviving,
  onToggleActive, toggling,
}: {
  pet: RosterPet;
  selected: boolean;
  moralityScore: number;
  onSelect: () => void;
  onOpenSkills: () => void;
  onOpenQuests: () => void;
  onRevive: () => void;
  reviving: boolean;
  onToggleActive: () => void;
  toggling: boolean;
}) {
  const dissonance = useMemo(
    () => calculateMoralityDissonance(pet.petId, moralityScore),
    [pet.petId, moralityScore],
  );
  const willLeave = canPetLeave(dissonance, pet.bond);

  const hpPercent = (pet.currentHp / pet.maxHp) * 100;
  const injuredUntilTs = pet.injuredUntil ? new Date(pet.injuredUntil).getTime() : 0;
  const isInjured = injuredUntilTs > Date.now();
  const isDowned = pet.currentHp <= 0;
  const stageLabel = ["FRAGMENT", "COMPANION", "ASCENDED"][pet.evolutionStage - 1] ?? "STAGE ?";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-md p-2.5 transition-colors ${
        selected
          ? "void-border-error void-bg-error"
          : "border-border/30 bg-card/40 hover:border-border/60"
      }`}
      data-testid={`pet-row-${pet.petId}`}
    >
      <button onClick={onSelect} className="w-full text-left">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`font-display text-sm font-bold truncate ${pet.isSpectral ? "void-text-energy" : "text-foreground"}`}>
              {pet.name}
            </span>
            {pet.isSpectral && <Ghost size={10} className="void-text-energy shrink-0" />}
            <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/60 shrink-0">
              {stageLabel}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-[9px] void-text-energy tabular-nums">
              {pet.wins}W·{pet.losses}L
            </span>
          </div>
        </div>

        {/* HP bar */}
        <div className="mt-1.5">
          <div className="flex items-center justify-between text-[9px] font-mono mb-0.5">
            <span className="text-muted-foreground/70 flex items-center gap-1">
              <Heart size={9} /> HP
            </span>
            <span className="text-foreground tabular-nums">{pet.currentHp}/{pet.maxHp}</span>
          </div>
          <div className="h-1 void-bg-canvas rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                hpPercent > 50 ? "void-bg-success" : hpPercent > 25 ? "void-bg-sunk" : "void-bg-error"
              }`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* Bond bar */}
        <div className="mt-1">
          <div className="flex items-center justify-between text-[9px] font-mono mb-0.5">
            <span className="text-muted-foreground/70 flex items-center gap-1">
              <HeartHandshake size={9} /> Bond
            </span>
            <span className="text-foreground tabular-nums">{pet.bond}/100</span>
          </div>
          <div className="h-1 void-bg-canvas rounded-full overflow-hidden">
            <div className="h-full void-bg-error" style={{ width: `${pet.bond}%` }} />
          </div>
        </div>
      </button>

      {/* Status chips */}
      <div className="mt-2 flex flex-wrap gap-1">
        {pet.isActive ? (
          <span className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border void-border-success void-bg-success void-text-energy flex items-center gap-1">
            <Star size={8} /> Active Party
          </span>
        ) : (
          <span className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border void-border void-bg-canvas text-muted-foreground/60 flex items-center gap-1">
            <StarOff size={8} /> Benched
          </span>
        )}
        {pet.isSpectral && (
          <span className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border void-border-success void-bg-success void-text-energy flex items-center gap-1">
            <Ghost size={8} /> Spectral
          </span>
        )}
        {pet.deathCount > 0 && (
          <span className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-border/30 text-muted-foreground/70">
            Deaths: {pet.deathCount}
          </span>
        )}
        {isDowned && (
          <span className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border void-border-error void-bg-error void-text-error flex items-center gap-1">
            <Skull size={8} /> Downed
          </span>
        )}
        {isInjured && !isDowned && (
          <span className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border void-border void-bg-sunk void-text-premium">
            Injured · {Math.ceil((injuredUntilTs - Date.now()) / 60_000)}m
          </span>
        )}
        {dissonance > 0 && (
          <span
            className={`font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border flex items-center gap-1 ${
              willLeave
                ? "void-border-error void-bg-error void-text-error"
                : "void-border void-bg-sunk void-text-accent"
            }`}
            title={willLeave ? "This pet may leave your party" : "This pet is uncomfortable with your alignment"}
          >
            <AlertTriangle size={8} />
            {willLeave ? "Leaving" : "Dissonance"}
          </span>
        )}
        {pet.skillPoints > 0 && (
          <span className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border void-border void-bg-sunk void-text-energy">
            {pet.skillPoints} skill{pet.skillPoints > 1 ? "s" : ""} unspent
          </span>
        )}
      </div>

      {/* Action row */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSkills}
            className="font-mono text-[9px] uppercase tracking-wider void-text-energy void-text-energy flex items-center gap-1"
            data-testid={`open-skills-${pet.petId}`}
          >
            <Swords size={10} /> Skills
          </button>
          <button
            onClick={onOpenQuests}
            className="font-mono text-[9px] uppercase tracking-wider void-text-accent void-text-accent flex items-center gap-1"
            data-testid={`open-quests-${pet.petId}`}
          >
            <Shield size={10} /> Quests
          </button>
          <button
            onClick={onToggleActive}
            disabled={toggling}
            className="font-mono text-[9px] uppercase tracking-wider void-text-energy void-text-energy disabled:opacity-50 flex items-center gap-1"
            data-testid={`toggle-active-${pet.petId}`}
          >
            {pet.isActive ? <StarOff size={10} /> : <Star size={10} />}
            {toggling ? "..." : pet.isActive ? "Bench" : "Activate"}
          </button>
        </div>
        {(isDowned || isInjured || pet.isSpectral) && (
          <button
            onClick={onRevive}
            disabled={reviving}
            className="font-mono text-[9px] uppercase tracking-wider void-text-error void-text-error disabled:opacity-50 flex items-center gap-1"
            data-testid={`revive-${pet.petId}`}
          >
            <RotateCcw size={10} /> {reviving ? "Reviving..." : pet.isSpectral ? "Restore" : "Revive"}
          </button>
        )}
      </div>
    </motion.div>
  );
}
