/* ═══════════════════════════════════════════════════════
   CADESFeed — compact feed renderer for CADES crew
   reactions. Mounts anywhere; relies on useCadesFeed
   subscribing to narrative-effect events globally.
   ═══════════════════════════════════════════════════════ */
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Flame, Skull, Star, Info } from "lucide-react";
import { useCadesFeed } from "@/hooks/useCadesFeed";

const SEVERITY_COLORS: Record<string, string> = {
  info: "#64748b",
  warning: "#f59e0b",
  alert: "#f97316",
  critical: "#ef4444",
  celebration: "#22c55e",
};

const SEVERITY_ICONS = {
  info: Info,
  warning: AlertTriangle,
  alert: Flame,
  critical: Skull,
  celebration: Star,
} as const;

export function CADESFeed({ limit = 6, title = "CADES CREW FEED" }: { limit?: number; title?: string }) {
  const { entries } = useCadesFeed(limit);
  if (entries.length === 0) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur p-4">
      <p className="font-mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "#8b5cf6" }}>
        {title}
      </p>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {entries.map((entry) => {
            const color = SEVERITY_COLORS[entry.reaction.severity] ?? "#64748b";
            const Icon = SEVERITY_ICONS[entry.reaction.severity] ?? Info;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                className="flex gap-3 p-2 rounded-lg"
                style={{
                  background: `color-mix(in oklch, ${color} 8%, transparent)`,
                  borderLeft: `2px solid ${color}`,
                }}
              >
                <Icon size={12} className="mt-0.5 shrink-0" style={{ color }} />
                <div className="flex-1">
                  <p className="font-mono text-[10px] leading-relaxed" style={{ color: "#e2e8f0" }}>
                    {entry.reaction.feedText}
                  </p>
                  <p className="font-mono text-[8px] tracking-wider mt-1" style={{ color: color + "99" }}>
                    {entry.reaction.room.replace(/_/g, " ").toUpperCase()} · MORALE {entry.reaction.moraleEffect > 0 ? "+" : ""}{entry.reaction.moraleEffect}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
