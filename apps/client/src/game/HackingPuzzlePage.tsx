import HackingPuzzle from "./HackingPuzzle";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function HackingPuzzlePage() {
  const [, navigate] = useLocation();
  const updateQuestProgress = trpc.quests.updateProgress.useMutation();
  return (
    <HackingPuzzle
      onComplete={(won, timeRemaining) => {
        toast[won ? "success" : "info"](won ? "System Hacked!" : "Lockout — System Reset", {
          description: won ? `${Math.round(timeRemaining)}s remaining. +30 Salvage, +20 XP` : "Security protocols reset. Try again.",
        });
        // Audit 3B — fire the minigame daily on successful hack.
        if (won) updateQuestProgress.mutate({ questId: "d_hack_success", increment: 1 });
        navigate("/ark");
      }}
      onClose={() => navigate("/ark")}
    />
  );
}
