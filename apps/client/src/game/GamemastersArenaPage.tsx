/* Wrapper page for the Gamemaster's Arena quiz show */
import GamemastersArena from "./GamemastersArena";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function GamemastersArenaPage() {
  const [, navigate] = useLocation();

  return (
    <GamemastersArena
      onComplete={(dream, rounds) => {
        toast.success(`Quiz Complete! +${dream} Dream`, {
          description: `${rounds}/10 rounds survived.`,
        });
        navigate("/ark");
      }}
      onClose={() => navigate("/ark")}
    />
  );
}
