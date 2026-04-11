import SignalDecryption from "./SignalDecryption";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function SignalDecryptionPage() {
  const [, navigate] = useLocation();
  return (
    <SignalDecryption
      onComplete={(won, guesses) => {
        toast[won ? "success" : "info"](won ? "Signal Decoded!" : "Decryption Failed", {
          description: won ? `Solved in ${guesses} guesses. +25 XP` : "Try again tomorrow.",
        });
        navigate("/ark");
      }}
      onClose={() => navigate("/ark")}
    />
  );
}
