/* ═══════════════════════════════════════════════════════
   ACT 2 OPENING PAGE — route wrapper for Act2Opening cutscene

   Navigates to /engineers-bench when the player dismisses the
   transmission. Sets the `act2_opening_seen` narrative flag so
   the consumer (act gate, story orchestrator) can avoid replay.

   Phase H — see apps/client/src/game/Act2Opening.tsx.
   ═══════════════════════════════════════════════════════ */
import { useLocation } from "wouter";
import { useGame } from "@/contexts/GameContext";
import Act2Opening from "@/game/Act2Opening";

export default function Act2OpeningPage() {
  const [, navigate] = useLocation();
  const { setNarrativeFlag } = useGame();
  return (
    <Act2Opening
      onComplete={() => {
        setNarrativeFlag("act2_opening_seen");
        navigate("/engineers-bench");
      }}
    />
  );
}
