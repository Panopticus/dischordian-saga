/* ═══════════════════════════════════════════════════════
   REPLAY PAGE — View and share battle replays
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Play, Film, Share2, Clock, Star,
  Trophy, Eye, Swords, ThumbsUp, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Tab = "my" | "featured";

export default function ReplayPage() {
  const [tab, setTab] = useState<Tab>("my");
  const [selectedReplayId, setSelectedReplayId] = useState<number | null>(null);

  const { data: myReplays, isLoading } = trpc.replay.getMyReplays.useQuery({ limit: 30 });
  const { data: featuredReplays } = trpc.replay.getFeaturedReplays.useQuery(
    { limit: 20 },
    { enabled: tab === "featured" }
  );
  const { data: replayDetail } = trpc.replay.getReplay.useQuery(
    { replayId: selectedReplayId! },
    { enabled: !!selectedReplayId }
  );
  // Like functionality placeholder
  const handleLike = () => toast.info("Feature coming soon");

  const replays = tab === "my" ? myReplays : featuredReplays;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/ark" className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <Film size={18} className="text-primary" />
          <h1 className="font-display text-sm font-bold tracking-[0.15em]">BATTLE REPLAYS</h1>
        </div>
        <div className="px-4 sm:px-6 flex gap-1 pb-2">
          {(["my", "featured"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setSelectedReplayId(null); }}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                tab === t ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "my" ? "MY REPLAYS" : "FEATURED"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 space-y-4">
        {/* Replay Detail View */}
        {selectedReplayId && replayDetail && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-primary/20 bg-card/50 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold tracking-wide flex items-center gap-2">
                <Play size={14} className="text-primary" />
                REPLAY #{replayDetail.id}
              </h3>
              <Button size="sm" variant="ghost" onClick={() => setSelectedReplayId(null)}>
                Back to list
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="rounded-md bg-muted/10 p-2">
                <p className="text-muted-foreground/60 text-[10px]">GAME TYPE</p>
                <p className="text-foreground">{replayDetail.gameType}</p>
              </div>
              <div className="rounded-md bg-muted/10 p-2">
                <p className="text-muted-foreground/60 text-[10px]">RESULT</p>
                <p className={replayDetail.winnerId === replayDetail.player1Id ? "text-accent" : "text-destructive"}>
                  {replayDetail.winnerId === replayDetail.player1Id ? "WIN" : "LOSS"}
                </p>
              </div>
              <div className="rounded-md bg-muted/10 p-2">
                <p className="text-muted-foreground/60 text-[10px]">DURATION</p>
                <p className="text-foreground">{replayDetail.duration || 0}s</p>
              </div>
              <div className="rounded-md bg-muted/10 p-2">
                <p className="text-muted-foreground/60 text-[10px]">MOVES</p>
                <p className="text-foreground">{replayDetail.totalMoves}</p>
              </div>
            </div>

            {/* Moves timeline */}
            {replayDetail.moveData && (
              <div>
                <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider mb-2">MOVE LOG ({replayDetail.totalMoves} moves)</p>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-2 scrollbar-thin">
                  <p className="font-mono text-[10px] text-muted-foreground">Move data recorded ({replayDetail.moveData.length} chars)</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleLike}
              >
                <ThumbsUp size={12} className="mr-1" /> Like
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/replay/${replayDetail.id}`);
                  toast.success("Replay link copied!");
                }}
              >
                <Share2 size={12} className="mr-1" /> Share
              </Button>
            </div>
          </motion.div>
        )}

        {/* Replay List */}
        {!selectedReplayId && (
          <>
            {(!replays || replays.length === 0) ? (
              <div className="text-center py-16">
                <Film size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="font-mono text-sm text-muted-foreground">
                  {tab === "my" ? "No replays yet" : "No featured replays"}
                </p>
                <p className="font-mono text-xs text-muted-foreground/60 mt-1">
                  {tab === "my" ? "Play some games to generate replays!" : "Check back for community highlights"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {replays.map((replay: any, i: number) => (
                  <motion.div
                    key={replay.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => setSelectedReplayId(replay.id)}
                    className="rounded-lg border border-border/30 bg-card/30 p-3 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-all"
                  >
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                      replay.winnerId === replay.player1Id ? "bg-accent/10" : "bg-destructive/10"
                    }`}>
                      {replay.winnerId === replay.player1Id ? (
                        <Trophy size={18} className="text-accent" />
                      ) : (
                        <Swords size={18} className="text-destructive" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs font-semibold truncate">
                        {replay.gameType} — {replay.winnerId === replay.player1Id ? "WIN" : "LOSS"}
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground flex items-center gap-2">
                        <Clock size={9} /> {new Date(replay.playedAt).toLocaleDateString()}
                        <Swords size={9} className="ml-1" /> {replay.totalMoves} moves
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground/40" />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
