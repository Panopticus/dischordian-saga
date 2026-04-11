import HackingPuzzle from "./HackingPuzzle";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function HackingPuzzlePage() {
  const [, navigate] = useLocation();
  return (
    <HackingPuzzle
      onComplete={(won, timeRemaining) => {
        toast[won ? "success" : "info"](won ? "System Hacked!" : "Lockout — System Reset", {
          description: won ? `${Math.round(timeRemaining)}s remaining. +30 Salvage, +20 XP` : "Security protocols reset. Try again.",
        });
        navigate("/ark");
      }}
      onClose={() => navigate("/ark")}
    />
  );
}
