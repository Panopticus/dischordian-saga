/**
 * PreludePage — mount point for the 15-beat Prelude sequence.
 *
 * Gates on `narrativeFlags.prelude_complete`: players who've already
 * finished the Prelude get redirected to the Ark Explorer (the
 * post-Prelude home). Fresh saves / resumers land here and the
 * PreludeSequencePlayerConnected wrapper walks the sequence end-to-end,
 * resuming from `currentPreludeBeat` if the player left mid-playthrough.
 *
 * On completion the Prelude → Act 1 handoff is handled elsewhere: the
 * `prelude_complete` flag is raised by the sequence's last beat and
 * `useNarrativeIntegration` (shouldAdvanceToAct1OnPreludeComplete)
 * advances `narrativeAct` to 1. This page's onPreludeComplete callback
 * just navigates to the Ark so the player has a visible next surface.
 */
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useGame } from "@/contexts/GameContext";
import { PreludeSequencePlayerConnected } from "@/components/prelude/PreludeSequencePlayerConnected";
import RecruitStageVoiceOverlay from "@/components/prelude/RecruitStageVoiceOverlay";

export default function PreludePage() {
  const { state } = useGame();
  const [, navigate] = useLocation();

  const preludeComplete = !!state.narrativeFlags?.prelude_complete;

  useEffect(() => {
    if (preludeComplete) navigate("/ark", { replace: true });
  }, [preludeComplete, navigate]);

  if (preludeComplete) return null;

  return (
    <>
      <RecruitStageVoiceOverlay />
      <PreludeSequencePlayerConnected
        onPreludeComplete={() => navigate("/ark")}
      />
    </>
  );
}
