/**
 * ChoicePillarLightDark — Canonical alignment choice UI.
 *
 * Split gold/violet pillar. States: appearance → light | dark
 * Beat J. Bible §17.6, §18.5.
 * CANONICAL UI PATTERN for ALL alignment choices across the game.
 * Full keyboard + gamepad + touch accessibility required.
 */
import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { registerPreludeVfx, type PreludeVfxProps } from "../preludeVfxRegistry";
import "../prelude-vfx.css";

type PillarState = "appearance" | "light" | "dark";

interface ChoicePillarProps extends PreludeVfxProps {
  /** Called when the player selects a side. */
  onChoice?: (choice: "light" | "dark") => void;
}

export function ChoicePillarLightDark({
  active,
  state = "appearance",
  onChoice,
  onComplete,
  className = "",
}: ChoicePillarProps) {
  const pillarState = (state as PillarState) || "appearance";
  const isSelectable = pillarState === "appearance";

  const handleSelect = useCallback(
    (choice: "light" | "dark") => {
      if (!isSelectable) return;
      onChoice?.(choice);
      onComplete?.();
    },
    [isSelectable, onChoice, onComplete],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isSelectable) return;
      if (e.key === "ArrowLeft" || e.key === "a") handleSelect("light");
      if (e.key === "ArrowRight" || e.key === "d") handleSelect("dark");
      if (e.key === "Enter" || e.key === " ") handleSelect("light"); // default to light on confirm
    },
    [isSelectable, handleSelect],
  );

  if (!active) return null;

  const selectedSide = pillarState === "light" || pillarState === "dark" ? pillarState : null;

  return (
    <AnimatePresence>
      <motion.div
        className={className}
        role="group"
        aria-label="Alignment choice: Light or Dark"
        tabIndex={isSelectable ? 0 : -1}
        onKeyDown={handleKeyDown}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "absolute",
          width: "80px",
          height: "200px",
          display: "flex",
          outline: "none",
          cursor: isSelectable ? "pointer" : "default",
          pointerEvents: isSelectable ? "auto" : "none",
        }}
      >
        {/* Light half (left) — soft gold var(--energy-accent) */}
        <motion.button
          aria-label="Choose Light"
          onClick={() => handleSelect("light")}
          disabled={!isSelectable}
          animate={{
            opacity: selectedSide === "dark" ? 0.3 : 1,
            filter: selectedSide === "light" ? "brightness(1.4)" : "brightness(1)",
          }}
          transition={{ duration: 0.4 }}
          style={{
            flex: 1,
            border: "none",
            cursor: isSelectable ? "pointer" : "default",
            borderRadius: "4px 0 0 4px",
            background: "linear-gradient(180deg, var(--energy-accent), #fbbf24)",
            boxShadow: selectedSide === "light"
              ? "0 0 24px var(--energy-accent), 0 0 48px rgba(253, 230, 138, 0.5)"
              : "0 0 12px rgba(253, 230, 138, 0.3)",
          }}
        />
        {/* Dark half (right) — deep violet #1e1b4b */}
        <motion.button
          aria-label="Choose Dark"
          onClick={() => handleSelect("dark")}
          disabled={!isSelectable}
          animate={{
            opacity: selectedSide === "light" ? 0.3 : 1,
            filter: selectedSide === "dark" ? "brightness(1.4)" : "brightness(1)",
          }}
          transition={{ duration: 0.4 }}
          style={{
            flex: 1,
            border: "none",
            cursor: isSelectable ? "pointer" : "default",
            borderRadius: "0 4px 4px 0",
            background: "linear-gradient(180deg, #312e81, #1e1b4b)",
            boxShadow: selectedSide === "dark"
              ? "0 0 24px #312e81, 0 0 48px rgba(49, 46, 129, 0.5)"
              : "0 0 12px rgba(30, 27, 75, 0.3)",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

registerPreludeVfx("vfx_choice_pillar_light_dark_split", {
  component: ChoicePillarLightDark as React.ComponentType<PreludeVfxProps>,
  label: "Choice Pillar Light/Dark Split",
  mode: "stateful",
});
