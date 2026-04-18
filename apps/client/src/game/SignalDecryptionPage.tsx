import SignalDecryption from "./SignalDecryption";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function SignalDecryptionPage() {
  const [, navigate] = useLocation();
  const updateQuestProgress = trpc.quests.updateProgress.useMutation();
  return (
    <SignalDecryption
      onComplete={(won, guesses) => {
        toast[won ? "success" : "info"](won ? "Signal Decoded!" : "Decryption Failed", {
          description: won ? `Solved in ${guesses} guesses. +25 XP` : "Try again tomorrow.",
        });
        // Audit 3B — fire the minigame daily on successful decrypt.
        if (won) updateQuestProgress.mutate({ questId: "d_decrypt_signal", increment: 1 });
        navigate("/ark");
      }}
      onClose={() => navigate("/ark")}
    />
  );
}
