/* ═══════════════════════════════════════════════════════
   PRELUDE VFX REGISTRY

   Central lookup for all 22 code-implemented Prelude VFX
   effects. Maps VFX IDs (from preludeSequence.ts) to their
   React component and metadata.

   Usage:
     const entry = PRELUDE_VFX_REGISTRY.get("vfx_lockbox_bio_recognize");
     if (entry) <entry.component active state="recognize" />
   ═══════════════════════════════════════════════════════ */

import { type ComponentType } from "react";

/* ─── PROPS ─── */

/** Base props every Prelude VFX component accepts. */
export interface PreludeVfxProps {
  /** Whether the effect is currently active/visible. */
  active: boolean;
  /** For stateful effects: the current state name. */
  state?: string;
  /** Callback fired when a one-shot effect finishes. */
  onComplete?: () => void;
  /** Optional CSS class for positioning overrides. */
  className?: string;
}

/** Registry entry for a single VFX effect. */
export interface PreludeVfxEntry {
  /** The React component that renders this effect. */
  component: ComponentType<PreludeVfxProps>;
  /** Human-readable name from Bible §18. */
  label: string;
  /** Whether this is a one-shot (plays once) or continuous (loops). */
  mode: "one-shot" | "continuous" | "stateful";
}

/* ─── REGISTRY ─── */

/**
 * Populated by each effect module calling `registerPreludeVfx()`.
 * Lazy registration avoids circular imports — the overlay reads
 * from this map at render time, after all modules have loaded.
 */
export const PRELUDE_VFX_REGISTRY = new Map<string, PreludeVfxEntry>();

/** Register a code-implemented VFX effect. */
export function registerPreludeVfx(
  id: string,
  entry: PreludeVfxEntry,
): void {
  PRELUDE_VFX_REGISTRY.set(id, entry);
}

/**
 * Set of VFX IDs that are code-implemented (no .webm file needed).
 * Used by preludeSequence.ts to mark the `codeImplemented` flag and
 * by the readiness test to skip disk-presence checks.
 */
export const CODE_IMPLEMENTED_VFX_IDS: ReadonlySet<string> = new Set([
  // Simple CSS animations
  "vfx_status_pip_color_shift",
  "vfx_incubator_pod_dormant_glow",
  "vfx_bench_standby_pip",
  "vfx_galley_pilot_warm",
  "vfx_med_pod_faint_pulse",
  "vfx_neural_rig_idle_hum_visual",
  "vfx_transfer_array_amber_standby",
  "vfx_signal_intake_lit_panel",
  "vfx_elara_fade_out",
  "vfx_viewport_polarization_lift",
  // Stateful components
  "vfx_lockbox_bio_recognize",
  "vfx_data_slate_glow",
  "vfx_chair_rim_hot_edge",
  "vfx_memory_crystal_pulse",
  "vfx_witnessing_hub_hemisphere_bloom",
  "vfx_mission_slate_glow",
  // Interactive UI components
  "vfx_inbox_envelope_unfold",
  "vfx_inbox_edge_sentence_bloom",
  "vfx_amber_counter_glyph",
  "vfx_choice_pillar_light_dark_split",
  // CSS gradient/mask
  "vfx_peripheral_warm_halo",
  "vfx_primary_lights_cascade",
]);
