/* ═══════════════════════════════════════════════════════
   CARD CHALLENGE PAGE — Async multiplayer card battles
   Challenge other players from the leaderboard.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  Swords, Trophy, ChevronLeft, Send, Shield,
  Clock, Check, X, Zap, Crown, Users, Loader2
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useGame } from "@/contexts/GameContext";
import { generateStarterDeck, type StarterCard } from "@/components/StarterDeckViewer";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function CardChallengePage() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState } = useGame();
  const [, navigate] = useLocation();
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<{
    winnerId: number; isWinner: boolean; attackerPower: number; defenderPower: number;
  } | null>(null);

  const leaderboard = trpc.gameState.leaderboard.useQuery({ sortBy: "completion", limit: 50 });
  const challenges = trpc.cardChallenge.list.useQuery(undefined, { enabled: isAuthenticated });
  const createChallenge = trpc.cardChallenge.create.useMutation({
    onSuccess: (data) => {
      if (data.success) { toast.success("Challenge sent!"); challenges.refetch(); }
      else { toast.error(data.error ?? "Failed to send challenge"); }
    },
  });
  const acceptChallenge = trpc.cardChallenge.accept.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setShowResult({
          winnerId: data.winnerId!, isWinner: data.isWinner!,
          attackerPower: data.attackerPower!, defenderPower: data.defenderPower!,
        });
        challenges.refetch();
      } else { toast.error(data.error ?? "Failed to accept challenge"); }
    },
  });
  const declineChallenge = trpc.cardChallenge.decline.useMutation({
    onSuccess: () => { toast.info("Challenge declined"); challenges.refetch(); },
  });

  const playerDeck = useMemo(() => {
    const c = gameState.characterChoices;
    return generateStarterDeck({
      species: c.species || undefined, characterClass: c.characterClass || undefined,
      alignment: c.alignment || undefined, element: c.element || undefined, name: c.name || undefined,
    });
  }, [gameState.characterChoices]);

  const handleChallenge = (targetUserId: number) => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    createChallenge.mutate({
      targetUserId,
      attackerDeck: playerDeck.map((c: StarterCard) => ({
        id: c.id, name: c.name, type: c.type, cost: c.cost,
        attack: c.attack, defense: c.defense, ability: c.ability, rarity: c.rarity,
      })),
    });
    setSelectedTarget(null);
  };

  const handleAccept = (matchId: number) => {
    acceptChallenge.mutate({
      matchId,
      defenderDeck: playerDeck.map((c: StarterCard) => ({
        id: c.id, name: c.name, type: c.type, cost: c.cost,
        attack: c.attack, defense: c.defense, ability: c.ability, rarity: c.rarity,
      })),
    });
  };

  const incoming = challenges.data?.incoming ?? [];
  const outgoing = challenges.data?.outgoing ?? [];
  const completed = challenges.data?.completed ?? [];
  const players = leaderboard.data ?? [];

  return (
    <div className="min-h-screen grid-bg p-4 sm:p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/games" className="p-2 rounded-lg bg-card/40 border border-border/20 hover:bg-card/60 transition-colors">
            <ChevronLeft size={16} />
          </Link>
          <div>
            <h1 className="font-display text-xl sm:text-2xl tracking-wider flex items-center gap-2">
              <Swords size={20} className="text-red-400" /> MULTIPLAYER ARENA
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">CHALLENGE OTHER OPERATIVES</p>
          </div>
        </div>

        {/* Result modal */}
        <AnimatePresence>
          {showResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90"
              onClick={() => setShowResult(null)}>
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                className="rounded-xl p-8 text-center max-w-sm w-full"
                style={{
                  background: "rgba(10,10,40,0.95)",
                  border: `2px solid ${showResult.isWinner ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
                }}
                onClick={e => e.stopPropagation()}>
                <div className="mb-4">
                  {showResult.isWinner
                    ? <Crown size={48} className="mx-auto text-yellow-400 mb-2" />
                    : <Shield size={48} className="mx-auto text-red-400 mb-2" />}
                  <h2 className="font-display text-2xl tracking-wider">
                    {showResult.isWinner ? "VICTORY" : "DEFEAT"}
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <p className="font-mono text-[9px] text-muted-foreground">ATTACKER</p>
                    <p className="font-display text-xl text-red-400">{showResult.attackerPower}</p>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <p className="font-mono text-[9px] text-muted-foreground">DEFENDER</p>
                    <p className="font-display text-xl text-blue-400">{showResult.defenderPower}</p>
                  </div>
                </div>
                {showResult.isWinner && (
                  <p className="font-mono text-xs text-green-400 mb-4">+50 XP // +25 POINTS</p>
                )}
                <button onClick={() => setShowResult(null)}
                  className="px-6 py-2 rounded-lg font-mono text-xs tracking-wider bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors">
                  DISMISS
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Incoming challenges */}
        {isAuthenticated && incoming.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h2 className="font-display text-sm tracking-[0.2em] text-red-400 flex items-center gap-2 mb-3">
              <Zap size={14} /> INCOMING CHALLENGES ({incoming.length})
            </h2>
            <div className="space-y-2">
              {incoming.map(ch => (
                <div key={ch.id} className="rounded-lg p-4 flex items-center justify-between"
                  style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                  <div>
                    <p className="font-mono text-sm text-foreground">{ch.player1Name}</p>
                    <p className="font-mono text-[9px] text-muted-foreground">
                      <Clock size={8} className="inline mr-1" />
                      {ch.startedAt ? new Date(ch.startedAt).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleAccept(ch.id)} disabled={acceptChallenge.isPending}
                      className="px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wider bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors flex items-center gap-1">
                      {acceptChallenge.isPending ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />} ACCEPT
                    </button>
                    <button onClick={() => declineChallenge.mutate({ matchId: ch.id })}
                      className="px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wider bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1">
                      <X size={10} /> DECLINE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Outgoing challenges */}
        {isAuthenticated && outgoing.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h2 className="font-display text-sm tracking-[0.2em] text-amber-400 flex items-center gap-2 mb-3">
              <Send size={14} /> PENDING CHALLENGES ({outgoing.length})
            </h2>
            <div className="space-y-2">
              {outgoing.map(ch => (
                <div key={ch.id} className="rounded-lg p-3 flex items-center justify-between"
                  style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.1)" }}>
                  <div>
                    <p className="font-mono text-sm text-foreground">→ {ch.player2Name}</p>
                    <p className="font-mono text-[9px] text-muted-foreground">Awaiting response...</p>
                  </div>
                  <Clock size={14} className="text-amber-400/40" />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Recent results */}
        {isAuthenticated && completed.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h2 className="font-display text-sm tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-3">
              <Trophy size={14} /> RECENT BATTLES
            </h2>
            <div className="space-y-1.5">
              {completed.slice(0, 5).map(ch => {
                const won = ch.winnerId === user?.id;
                return (
                  <div key={ch.id} className="rounded-lg p-3 flex items-center justify-between"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <div className="flex items-center gap-2">
                      {won ? <Crown size={12} className="text-yellow-400" /> : <Shield size={12} className="text-red-400/40" />}
                      <span className="font-mono text-xs">
                        vs {ch.player1Id === user?.id ? ch.player2Name : ch.player1Name}
                      </span>
                    </div>
                    <span className={`font-mono text-[10px] ${won ? "text-green-400" : "text-red-400"}`}>
                      {won ? "WON" : "LOST"}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Player list */}
        <section>
          <h2 className="font-display text-sm tracking-[0.2em] text-foreground flex items-center gap-2 mb-3">
            <Users size={14} className="text-primary" /> CHALLENGE AN OPERATIVE
          </h2>
          {leaderboard.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-primary/40" />
            </div>
          ) : players.length === 0 ? (
            <div className="text-center py-12 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }}>
              <Users size={32} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="font-mono text-sm text-muted-foreground">No operatives found</p>
              <p className="font-mono text-[10px] text-muted-foreground/50 mt-1">Start exploring the Ark to appear on the leaderboard</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {players.filter(p => p.userId !== user?.id).map((player, i) => (
                <motion.div key={player.userId}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-lg p-3 flex items-center justify-between group hover:border-primary/20 transition-all"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-display text-xs text-primary">#{player.rank_position}</span>
                    </div>
                    <div>
                      <p className="font-mono text-sm text-foreground">{player.userName}</p>
                      <p className="font-mono text-[9px] text-muted-foreground">
                        {player.title} // Lv.{player.level} // {player.battlesWon}W
                      </p>
                    </div>
                  </div>
                  {selectedTarget === player.userId ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleChallenge(player.userId)}
                        disabled={createChallenge.isPending}
                        className="px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wider bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1">
                        {createChallenge.isPending ? <Loader2 size={10} className="animate-spin" /> : <Swords size={10} />} CONFIRM
                      </button>
                      <button onClick={() => setSelectedTarget(null)}
                        className="px-2 py-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => {
                      if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
                      setSelectedTarget(player.userId);
                    }}
                      className="px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wider bg-primary/5 border border-primary/10 text-primary/60 hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1">
                      <Swords size={10} /> CHALLENGE
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-8 text-center">
          <Link href="/games" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1">
            <ChevronLeft size={12} /> BACK TO GAMES HUB
          </Link>
        </div>
      </div>
    </div>
  );
}
