/* ═══════════════════════════════════════════════════════
   EMPTY STATES — Narrative-flavored empty state components
   for all major game screens on Inception Ark 1047.

   Each empty state renders a themed void-surface panel
   with an icon, atmospheric title, in-universe description,
   and an optional action button. Entrance animations use
   the VOID preset system so they adapt to glass/flat/retro
   physics automatically.

   Usage:
     <EmptyQuestLog onAction={() => navigate("/explore")} />
     <EmptyInventory className="mt-8" />
   ═══════════════════════════════════════════════════════ */

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Radio,
  Package,
  Layers,
  BookOpen,
  Shield,
  Bug,
  Swords,
  Bell,
  Users,
  Trophy,
  ArrowLeftRight,
  GraduationCap,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VOID } from "@/engine/voidPresets";
import { Button } from "@/components/ui/button";

/* ─── SHARED SHELL ─── */

interface EmptyStateShellProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

function EmptyStateShell({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateShellProps) {
  return (
    <motion.div
      {...VOID.fadeUp(16)}
      className={cn(
        "void-surface flex flex-col items-center justify-center gap-4 px-6 py-12 text-center",
        className,
      )}
    >
      {/* Floating icon */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center justify-center rounded-full p-4"
        style={{
          background:
            "color-mix(in oklch, var(--energy-primary, #33e2e6) 10%, transparent)",
          boxShadow: "0 0 24px var(--material-glow, rgba(51,226,230,0.15))",
        }}
      >
        {icon}
      </motion.div>

      {/* Title */}
      <h3 className="void-heading text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        {title}
      </h3>

      {/* Description */}
      <p
        className="max-w-sm text-sm leading-relaxed"
        style={{ color: "var(--text-dim)" }}
      >
        {description}
      </p>

      {/* Optional action */}
      {actionLabel && onAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
          className="mt-2 void-border"
          style={{
            borderColor: "var(--material-border)",
            color: "var(--energy-primary)",
          }}
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}

/* ─── EMPTY STATES ─── */

interface EmptyStateProps {
  className?: string;
  onAction?: () => void;
}

export function EmptyQuestLog({ className, onAction }: EmptyStateProps) {
  return (
    <EmptyStateShell
      icon={<Radio className="size-8" style={{ color: "var(--energy-primary)" }} />}
      title="The signal is quiet. No transmissions detected."
      description="Elara hasn't identified any objectives yet. Explore the Ark to uncover what needs doing."
      actionLabel="Explore the Ark"
      onAction={onAction}
      className={className}
    />
  );
}

export function EmptyInventory({ className, onAction }: EmptyStateProps) {
  return (
    <EmptyStateShell
      icon={<Package className="size-8" style={{ color: "var(--energy-primary)" }} />}
      title="The cargo hold echoes. Nothing but shadows and dust."
      description="Your collection awaits its first artifact. Complete quests or visit the marketplace."
      actionLabel="Browse Marketplace"
      onAction={onAction}
      className={className}
    />
  );
}

export function EmptyCardCollection({ className, onAction }: EmptyStateProps) {
  return (
    <EmptyStateShell
      icon={<Layers className="size-8" style={{ color: "var(--energy-primary)" }} />}
      title="The deck case is empty. Every commander needs cards to play."
      description="Win battles, open packs, or trade with other Potentials."
      actionLabel="Play Dischordia"
      onAction={onAction}
      className={className}
    />
  );
}

export function EmptyLoreJournal({ className, onAction }: EmptyStateProps) {
  return (
    <EmptyStateShell
      icon={<BookOpen className="size-8" style={{ color: "var(--energy-primary)" }} />}
      title="The pages are blank. Your story hasn't been written yet."
      description="Record your discoveries, theories, and reflections as you uncover the truth."
      actionLabel="Start Writing"
      onAction={onAction}
      className={className}
    />
  );
}

export function EmptyGuildHall({ className, onAction }: EmptyStateProps) {
  return (
    <EmptyStateShell
      icon={<Shield className="size-8" style={{ color: "var(--energy-primary)" }} />}
      title="No guild banner hangs here. You walk alone."
      description="Join a guild to build something greater, or found one yourself."
      actionLabel="Find a Guild"
      onAction={onAction}
      className={className}
    />
  );
}

export function EmptyPetCollection({ className, onAction }: EmptyStateProps) {
  return (
    <EmptyStateShell
      icon={<Bug className="size-8" style={{ color: "var(--energy-primary)" }} />}
      title="The specimen bay is silent. No creatures have been bonded."
      description="Explore Terminus to discover and capture alien specimens."
      actionLabel="Enter Terminus"
      onAction={onAction}
      className={className}
    />
  );
}

export function EmptyMatchHistory({ className, onAction }: EmptyStateProps) {
  return (
    <EmptyStateShell
      icon={<Swords className="size-8" style={{ color: "var(--energy-primary)" }} />}
      title="No battles recorded in the archive."
      description="Step into the arena to test your strategy against other Potentials."
      actionLabel="Enter Arena"
      onAction={onAction}
      className={className}
    />
  );
}

export function EmptyNotifications({ className, onAction }: EmptyStateProps) {
  return (
    <EmptyStateShell
      icon={<Bell className="size-8" style={{ color: "var(--energy-primary)" }} />}
      title="No signals pending. The void is peaceful... for now."
      description="When something stirs aboard the Ark, you'll be the first to know."
      className={className}
      onAction={onAction}
    />
  );
}

export function EmptyCompanions({ className, onAction }: EmptyStateProps) {
  return (
    <EmptyStateShell
      icon={<Users className="size-8" style={{ color: "var(--energy-primary)" }} />}
      title="The crew quarters are empty. The Ark feels vast and lonely."
      description="Meet the inhabitants of the Ark as you explore its decks."
      actionLabel="Explore Decks"
      onAction={onAction}
      className={className}
    />
  );
}

export function EmptyAchievements({ className, onAction }: EmptyStateProps) {
  return (
    <EmptyStateShell
      icon={<Trophy className="size-8" style={{ color: "var(--energy-primary)" }} />}
      title="Your record is clean. A fresh start on a stolen ship."
      description="Every action aboard the Ark leaves its mark. Start exploring."
      className={className}
      onAction={onAction}
    />
  );
}

export function EmptyTradeHistory({ className, onAction }: EmptyStateProps) {
  return (
    <EmptyStateShell
      icon={<ArrowLeftRight className="size-8" style={{ color: "var(--energy-primary)" }} />}
      title="No transactions recorded. The marketplace awaits."
      description="Buy, sell, and trade with Potentials across the fleet."
      className={className}
      onAction={onAction}
    />
  );
}

export function EmptyApprentices({ className, onAction }: EmptyStateProps) {
  return (
    <EmptyStateShell
      icon={<GraduationCap className="size-8" style={{ color: "var(--energy-primary)" }} />}
      title="The training hall stands ready. No apprentices have been recruited."
      description="Seek out promising souls in Celebration and recruit them to your cause."
      actionLabel="Visit Celebration"
      onAction={onAction}
      className={className}
    />
  );
}

export function EmptyLeaderboard({ className, onAction }: EmptyStateProps) {
  return (
    <EmptyStateShell
      icon={<Crown className="size-8" style={{ color: "var(--energy-primary)" }} />}
      title="No rankings established. The competition hasn't begun."
      description="Be the first to stake your claim on the leaderboard."
      className={className}
      onAction={onAction}
    />
  );
}
