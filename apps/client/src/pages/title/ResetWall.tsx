/* ═══════════════════════════════════════════════════════
   RESET WALL — Three-step gauntlet to prevent accidental
   character wipes.

     1. Warning panel (deep red vignette, copy-only).
     2. Type-to-confirm: must match state.characterChoices.name
        (case-insensitive, trimmed).
     3. Hold-to-confirm: 2s hold on the Dissolve button.
        Releasing early aborts; the user returns to step 2.

   On success, the server-side playerReset mutation runs,
   then local resetGame() clears storage. The Title page
   then re-evaluates state and renders the no-save view.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useRef, useState } from "react";

import { trpc } from "@/lib/trpc";
import { useGame } from "@/contexts/GameContext";

type Step = "warning" | "type" | "hold" | "dissolving";

const HOLD_MS = 2000;

interface ResetWallProps {
  onAbort: () => void;
  onDone: () => void;
}

export function ResetWall({ onAbort, onDone }: ResetWallProps) {
  const { state, resetGame } = useGame();
  const resetMutation = trpc.playerReset.resetPlayer.useMutation();

  const [step, setStep] = useState<Step>("warning");
  const [typed, setTyped] = useState("");
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);
  const holdStartRef = useRef<number | null>(null);

  const expectedName = (state.characterChoices.name || "").trim();
  const typedMatches =
    expectedName.length > 0 &&
    typed.trim().toLowerCase() === expectedName.toLowerCase();

  // ─── hold-to-confirm loop ───
  const startHold = useCallback(() => {
    if (step !== "hold") return;
    holdStartRef.current = performance.now();
    const tick = () => {
      if (holdStartRef.current == null) return;
      const elapsed = performance.now() - holdStartRef.current;
      const pct = Math.min(1, elapsed / HOLD_MS);
      setHoldProgress(pct);
      if (pct >= 1) {
        // complete
        holdStartRef.current = null;
        setStep("dissolving");
        resetMutation.mutate(undefined, {
          onSettled: () => {
            resetGame();
            onDone();
          },
        });
        return;
      }
      holdTimerRef.current = requestAnimationFrame(tick);
    };
    holdTimerRef.current = requestAnimationFrame(tick);
  }, [step, resetMutation, resetGame, onDone]);

  const cancelHold = useCallback(() => {
    holdStartRef.current = null;
    if (holdTimerRef.current != null) {
      cancelAnimationFrame(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (step === "hold") setHoldProgress(0);
  }, [step]);

  useEffect(() => () => cancelHold(), [cancelHold]);

  // ─── Render ───
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reset Character"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "radial-gradient(ellipse at center, rgba(20,0,0,0.92) 0%, rgba(0,0,0,0.96) 70%, #000 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        color: "#ff9999",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "640px", width: "100%", textAlign: "center" }}>
        <div
          style={{
            color: "#FF3C40",
            fontSize: "0.7rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
            textShadow: "0 0 20px rgba(255,60,64,0.5)",
          }}
        >
          {step === "dissolving"
            ? "> DISSOLVING LINK <"
            : "> WARNING: CONSCIOUSNESS DISSOLUTION IMMINENT <"}
        </div>

        {step === "warning" && (
          <WarningPanel
            characterName={expectedName}
            onCancel={onAbort}
            onContinue={() => setStep("type")}
          />
        )}

        {step === "type" && (
          <TypePanel
            expectedName={expectedName}
            typed={typed}
            onType={setTyped}
            typedMatches={typedMatches}
            onCancel={onAbort}
            onContinue={() => setStep("hold")}
          />
        )}

        {step === "hold" && (
          <HoldPanel
            progress={holdProgress}
            onStart={startHold}
            onCancel={cancelHold}
            onAbort={onAbort}
          />
        )}

        {step === "dissolving" && (
          <p
            style={{
              fontSize: "0.95rem",
              letterSpacing: "0.15em",
              color: "#fff",
              lineHeight: 1.8,
            }}
          >
            Severing neural link…
            <br />
            The Ark forgets you.
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Sub-panels ─── */

function WarningPanel({
  characterName,
  onCancel,
  onContinue,
}: {
  characterName: string;
  onCancel: () => void;
  onContinue: () => void;
}) {
  return (
    <>
      <p
        style={{
          fontSize: "1rem",
          lineHeight: 1.8,
          color: "#fff",
          marginBottom: "0.75rem",
        }}
      >
        This action will <strong>erase all memories</strong>.
      </p>
      <p
        style={{
          fontSize: "0.85rem",
          lineHeight: 1.8,
          color: "#ff9999",
          marginBottom: "2rem",
          letterSpacing: "0.03em",
        }}
      >
        Every bond forged, every choice made, every cycle survived — gone.
        The Ark will not remember {characterName || "you"}. Your Potential
        resets to zero. <strong>This is irreversible.</strong>
      </p>
      <ConfirmButtons
        primaryLabel="PROCEED"
        onCancel={onCancel}
        onPrimary={onContinue}
      />
    </>
  );
}

function TypePanel({
  expectedName,
  typed,
  onType,
  typedMatches,
  onCancel,
  onContinue,
}: {
  expectedName: string;
  typed: string;
  onType: (v: string) => void;
  typedMatches: boolean;
  onCancel: () => void;
  onContinue: () => void;
}) {
  return (
    <>
      <p
        style={{
          fontSize: "0.85rem",
          color: "#ff9999",
          marginBottom: "1.5rem",
          letterSpacing: "0.08em",
        }}
      >
        Type your character's name to sever the link.
      </p>
      <input
        type="text"
        value={typed}
        onChange={e => onType(e.target.value)}
        autoFocus
        placeholder={expectedName || "name required"}
        disabled={!expectedName}
        aria-label="Character name to confirm reset"
        style={{
          width: "100%",
          padding: "0.9rem 1rem",
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,60,64,0.4)",
          borderRadius: "4px",
          color: "#fff",
          fontSize: "1rem",
          letterSpacing: "0.1em",
          textAlign: "center",
          fontFamily: "inherit",
          marginBottom: "1.5rem",
        }}
      />
      <ConfirmButtons
        primaryLabel="CONFIRM NAME"
        primaryDisabled={!typedMatches}
        onCancel={onCancel}
        onPrimary={onContinue}
      />
      {!expectedName && (
        <p style={{ fontSize: "0.65rem", opacity: 0.6, marginTop: "1rem" }}>
          No named character on file — use ABORT to return.
        </p>
      )}
    </>
  );
}

function HoldPanel({
  progress,
  onStart,
  onCancel,
  onAbort,
}: {
  progress: number;
  onStart: () => void;
  onCancel: () => void;
  onAbort: () => void;
}) {
  return (
    <>
      <p
        style={{
          fontSize: "0.85rem",
          color: "#ff9999",
          marginBottom: "1.5rem",
          letterSpacing: "0.08em",
        }}
      >
        Hold to dissolve. Release to abort.
      </p>
      <button
        type="button"
        onPointerDown={onStart}
        onPointerUp={onCancel}
        onPointerLeave={onCancel}
        aria-label="Hold to dissolve character"
        style={{
          position: "relative",
          width: "100%",
          padding: "1.2rem 2rem",
          background: `linear-gradient(90deg, rgba(255,60,64,0.35) ${progress * 100}%, rgba(255,60,64,0.08) ${progress * 100}%)`,
          border: "1px solid rgba(255,60,64,0.5)",
          borderRadius: "4px",
          color: "#fff",
          fontSize: "0.95rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          cursor: "pointer",
          fontFamily: "inherit",
          overflow: "hidden",
          textShadow: "0 0 20px rgba(255,60,64,0.6)",
          marginBottom: "1.5rem",
        }}
      >
        HOLD TO DISSOLVE
      </button>
      <ConfirmButtons
        primaryLabel=""
        hidePrimary
        onCancel={onAbort}
      />
    </>
  );
}

function ConfirmButtons({
  primaryLabel,
  primaryDisabled,
  hidePrimary,
  onCancel,
  onPrimary,
}: {
  primaryLabel: string;
  primaryDisabled?: boolean;
  hidePrimary?: boolean;
  onCancel: () => void;
  onPrimary?: () => void;
}) {
  return (
    <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
      <button
        type="button"
        onClick={onCancel}
        style={{
          padding: "0.8rem 2rem",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "4px",
          color: "#fff",
          fontSize: "0.8rem",
          letterSpacing: "0.2em",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        ABORT
      </button>
      {!hidePrimary && onPrimary && (
        <button
          type="button"
          onClick={onPrimary}
          disabled={!!primaryDisabled}
          style={{
            padding: "0.8rem 2rem",
            background: primaryDisabled ? "rgba(255,60,64,0.1)" : "rgba(255,60,64,0.25)",
            border: "1px solid rgba(255,60,64,0.6)",
            borderRadius: "4px",
            color: "#fff",
            fontSize: "0.8rem",
            letterSpacing: "0.2em",
            cursor: primaryDisabled ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            opacity: primaryDisabled ? 0.4 : 1,
          }}
        >
          {primaryLabel}
        </button>
      )}
    </div>
  );
}
