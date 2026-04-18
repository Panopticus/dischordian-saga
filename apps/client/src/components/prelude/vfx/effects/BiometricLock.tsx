/**
 * BiometricLock — 4-state biometric lock component.
 *
 * States: dormant → pulsing → recognize → open
 * Beat F primary, reused Beat E (dormant only) and Beat J.
 * Bible §11.6, §18.2. Most reused component in Prelude VFX.
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";
import "../prelude-vfx.css";

type LockState = "dormant" | "pulsing" | "recognize" | "open";

const STATE_STYLES: Record<LockState, React.CSSProperties> = {
  dormant: {
    backgroundColor: "color-mix(in oklch, var(--energy-primary) 10%, transparent)",
    boxShadow: "0 0 8px color-mix(in oklch, var(--energy-primary) 20%, transparent)",
  },
  pulsing: {
    backgroundColor: "color-mix(in oklch, var(--energy-primary) 20%, transparent)",
    boxShadow: "0 0 16px color-mix(in oklch, var(--energy-primary) 40%, transparent)",
  },
  recognize: {
    backgroundColor: "color-mix(in oklch, var(--energy-primary) 60%, transparent)",
    boxShadow: "0 0 32px color-mix(in oklch, var(--energy-primary) 80%, transparent)",
    animation: "pvfx-bio-flash 0.3s ease-out",
  },
  open: {
    backgroundColor: "color-mix(in oklch, var(--energy-primary) 35%, transparent)",
    boxShadow: "0 0 20px color-mix(in oklch, var(--energy-primary) 50%, transparent)",
  },
};

export function BiometricLock({ active, state = "dormant", onComplete, className = "" }: PreludeVfxProps) {
  const [lockState, setLockState] = useState<LockState>("dormant");

  useEffect(() => {
    const validStates: LockState[] = ["dormant", "pulsing", "recognize", "open"];
    if (validStates.includes(state as LockState)) {
      setLockState(state as LockState);
    }
  }, [state]);

  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={className}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: lockState === "recognize" ? 1.1 : 1,
        }}
        transition={{
          duration: lockState === "recognize" ? 0.15 : 0.4,
          ease: "easeOut",
        }}
        style={{
          position: "absolute",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "2px solid var(--energy-primary)",
          pointerEvents: "none",
          ...STATE_STYLES[lockState],
        }}
        onAnimationComplete={() => {
          if (lockState === "recognize") onComplete?.();
        }}
      />
    </AnimatePresence>
  );
}

registerPreludeVfx("vfx_lockbox_bio_recognize", {
  component: BiometricLock,
  label: "Biometric Lock",
  mode: "stateful",
});
