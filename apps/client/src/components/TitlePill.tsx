/**
 * Title display pill — small chip rendered next to a player name in
 * lobby cards, post-match summaries, friends lists, and spectator UI.
 *
 * Source-of-truth title metadata (rarity color, icon) comes from the
 * shared title definitions; this component only consumes a resolved
 * `{ titleKey, name }` payload returned by `trpc.titles.resolveEquippedTitles`.
 */
import { motion } from "framer-motion";
import { Award, Crown, Eye, Shield, Swords, Sparkles, Lock, BookOpen, Zap, Heart, Users, Moon, MessageCircle, Building, Compass, EyeOff, Scale, HelpCircle, Scroll, Gamepad2, Ghost } from "lucide-react";
import { getTitleDef } from "@shared/titles/titleDefinitions";
import type { TitleDef } from "@shared/titles/types";

const ICON_MAP: Record<string, typeof Award> = {
  Award, Crown, Eye, Shield, Swords, Sparkles, Lock, BookOpen, Zap, Heart, Users, Moon, MessageCircle, Building, Compass, EyeOff, Scale, HelpCircle, Scroll, Gamepad2, Ghost,
};

const RARITY_COLOR: Record<TitleDef["rarity"], { fg: string; border: string; glow: string }> = {
  common: { fg: "#94a3b8", border: "rgba(148, 163, 184, 0.4)", glow: "rgba(148, 163, 184, 0.15)" },
  rare: { fg: "#38bdf8", border: "rgba(56, 189, 248, 0.5)", glow: "rgba(56, 189, 248, 0.2)" },
  epic: { fg: "#a855f7", border: "rgba(168, 85, 247, 0.55)", glow: "rgba(168, 85, 247, 0.25)" },
  legendary: { fg: "#fbbf24", border: "rgba(251, 191, 36, 0.6)", glow: "rgba(251, 191, 36, 0.3)" },
  mythic: { fg: "#f472b6", border: "rgba(244, 114, 182, 0.65)", glow: "rgba(244, 114, 182, 0.35)" },
};

export interface TitlePillProps {
  titleKey: string | null | undefined;
  /** Display name override (server-resolved). Falls back to title def name. */
  name?: string;
  size?: "xs" | "sm" | "md";
  /** Hide if no title equipped. Default true. */
  hideWhenEmpty?: boolean;
}

export function TitlePill({ titleKey, name, size = "sm", hideWhenEmpty = true }: TitlePillProps) {
  if (!titleKey) {
    return hideWhenEmpty ? null : (
      <span className="opacity-50 text-xs italic">(no title)</span>
    );
  }
  const def = getTitleDef(titleKey);
  if (!def) {
    return hideWhenEmpty ? null : (
      <span className="opacity-50 text-xs">{name ?? titleKey}</span>
    );
  }
  const Icon = ICON_MAP[def.iconKey] ?? Award;
  const colors = RARITY_COLOR[def.rarity];
  const fontSize = size === "xs" ? "0.65rem" : size === "md" ? "0.85rem" : "0.75rem";
  const iconSize = size === "xs" ? 10 : size === "md" ? 14 : 12;
  const padding = size === "xs" ? "1px 6px" : size === "md" ? "3px 10px" : "2px 8px";
  return (
    <motion.span
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      title={def.flavorText ?? def.description}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding,
        fontSize,
        fontWeight: 600,
        letterSpacing: "0.02em",
        color: colors.fg,
        border: `1px solid ${colors.border}`,
        borderRadius: "999px",
        background: colors.glow,
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={iconSize} />
      <span>{name ?? def.name}</span>
    </motion.span>
  );
}

export default TitlePill;
