/**
 * PreludeVfxOverlay — Container that renders active VFX effects per beat.
 *
 * Import this once in the Prelude scene and pass the current beat ID +
 * active effect states. The overlay resolves VFX IDs to registered
 * components and renders them as positioned overlays.
 *
 * Usage:
 *   <PreludeVfxOverlay
 *     activeEffects={[
 *       { id: "vfx_lockbox_bio_recognize", state: "pulsing" },
 *       { id: "vfx_incubator_pod_dormant_glow" },
 *     ]}
 *   />
 */

/* ─── Side-effect imports: register all components ─── */
import "./effects/CyanPulse";
import "./effects/AmberGlow";
import "./effects/StatusPipShift";
import "./effects/ElaraFadeOut";
import "./effects/ViewportPolarization";
import "./effects/BiometricLock";
import "./effects/DataSlateGlow";
import "./effects/ChairRimHotEdge";
import "./effects/MemoryCrystalPulse";
import "./effects/WitnessingHubBloom";
import "./effects/MissionSlateGlow";
import "./effects/PeripheralWarmHalo";
import "./effects/PrimaryLightsCascade";
import "./ui/InboxEnvelopeUnfold";
import "./ui/InboxSentenceBloom";
import "./ui/AmberCounterGlyph";
import "./ui/ChoicePillarLightDark";

import { PRELUDE_VFX_REGISTRY } from "./preludeVfxRegistry";

export interface ActiveVfxEffect {
  /** VFX ID from preludeSequence.ts (e.g. "vfx_lockbox_bio_recognize"). */
  id: string;
  /** Current state for stateful effects. */
  state?: string;
  /** Callback when the effect completes (one-shot). */
  onComplete?: () => void;
}

interface PreludeVfxOverlayProps {
  /** List of currently active effects to render. */
  activeEffects: ActiveVfxEffect[];
}

export function PreludeVfxOverlay({ activeEffects }: PreludeVfxOverlayProps) {
  if (activeEffects.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 40,
        overflow: "hidden",
      }}
    >
      {activeEffects.map((effect) => {
        const entry = PRELUDE_VFX_REGISTRY.get(effect.id);
        if (!entry) return null;
        const Component = entry.component;
        return (
          <Component
            key={effect.id}
            active
            state={effect.state}
            onComplete={effect.onComplete}
          />
        );
      })}
    </div>
  );
}

export { PRELUDE_VFX_REGISTRY } from "./preludeVfxRegistry";
export { CODE_IMPLEMENTED_VFX_IDS } from "./preludeVfxRegistry";
export type { PreludeVfxProps, PreludeVfxEntry } from "./preludeVfxRegistry";
