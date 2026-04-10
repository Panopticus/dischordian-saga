/* ═══════════════════════════════════════════════════════
   ATMOSPHERE SCOPE — Local theme override for nested sections

   Ports the upstream void-energy-ui AtmosphereScope pattern
   to React. Applies a different atmosphere to a subtree without
   changing the global <html> theme.

   Usage:
     <AtmosphereScope atmosphere="singularity_core">
       <NPCDialog />
     </AtmosphereScope>
     // NPCDialog renders with Singularity Core theme

   How it works:
   - Sets data-atmosphere, data-physics, data-mode on the wrapper div
   - Injects CSS custom properties as inline styles (scoped to subtree)
   - Children inherit the scoped theme via CSS variable cascade
   - Does NOT affect the global <html> attributes

   Use cases:
   - NPC dialog panels with NPC-specific atmosphere
   - Side-by-side theme previews
   - Embedded content from different narrative contexts
   - Arena/room preview cards
   ═══════════════════════════════════════════════════════ */

import React, { useMemo } from "react";
import { getTheme, type PhysicsType, type ModeType } from "./voidEngine";

interface AtmosphereScopeProps {
  /** Theme ID from the VoidEngine registry */
  atmosphere: string;
  /** Optional physics override (otherwise uses theme default) */
  physics?: PhysicsType;
  /** Optional mode override (otherwise uses theme default) */
  mode?: ModeType;
  /** Additional className for the wrapper */
  className?: string;
  /** Children rendered within the scoped atmosphere */
  children: React.ReactNode;
}

/**
 * Enforce physics/mode constraints locally (same as global engine).
 */
function enforceLocal(physics: PhysicsType, mode: ModeType): { physics: PhysicsType; mode: ModeType } {
  if (physics === "glass" && mode === "light") return { physics: "flat", mode: "light" };
  if (physics === "retro" && mode === "light") return { physics: "retro", mode: "dark" };
  return { physics, mode };
}

export function AtmosphereScope({
  atmosphere,
  physics: physicsOverride,
  mode: modeOverride,
  className,
  children,
}: AtmosphereScopeProps) {
  const scopedStyle = useMemo(() => {
    const theme = getTheme(atmosphere);
    if (!theme) return undefined;

    const rawPhysics = physicsOverride ?? theme.physics;
    const rawMode = modeOverride ?? theme.mode;
    const { physics, mode } = enforceLocal(rawPhysics, rawMode);

    const p = theme.palette;
    return {
      // Inject all palette variables as inline styles
      // These cascade to children via CSS variable inheritance
      "--void-canvas": p.canvas,
      "--void-surface": p.surface,
      "--void-elevated": p.elevated,
      "--void-sunk": p.sunk,
      "--void-spotlight": p.spotlight,
      "--void-text": p.text,
      "--void-text-dim": p.textDim,
      "--void-text-muted": p.textMuted,
      "--void-primary": p.primary,
      "--void-primary-muted": p.primaryMuted,
      "--void-secondary": p.secondary,
      "--void-accent": p.accent,
      "--void-success": p.success,
      "--void-error": p.error,
      "--void-premium": p.premium,
      "--void-system": p.system,
      "--void-border": p.border,
      "--void-border-subtle": p.borderSubtle,
      "--void-glow": p.glow,
      "--void-font-heading": theme.fonts.heading,
      "--void-font-body": theme.fonts.body,
      // Store resolved triad for children that read attributes
      "dataAttributes": { atmosphere, physics, mode },
    } as Record<string, string> & { dataAttributes: { atmosphere: string; physics: PhysicsType; mode: ModeType } };
  }, [atmosphere, physicsOverride, modeOverride]);

  if (!scopedStyle) return <>{children}</>;

  const { dataAttributes, ...cssVars } = scopedStyle as any;

  return (
    <div
      data-atmosphere={dataAttributes.atmosphere}
      data-physics={dataAttributes.physics}
      data-mode={dataAttributes.mode}
      className={className}
      style={cssVars as React.CSSProperties}
    >
      {children}
    </div>
  );
}
