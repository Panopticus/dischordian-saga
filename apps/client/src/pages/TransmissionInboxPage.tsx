/* ═══════════════════════════════════════════════════════
   TRANSMISSION INBOX

   List of unlocked Meme broadcasts. Grouped by epoch, ordered
   by broadcast order. Each has: play button, reward badges,
   "NEW" tag if unwatched.
   ═══════════════════════════════════════════════════════ */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Radio, Play, CheckCircle, Sparkles } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { usePlayerContext } from "@/hooks/usePlayerContext";
import {
  ALL_TRANSMISSIONS, isUnlocked, transmissionId, type Transmission,
} from "@shared/transmissions";
import MemeBroadcast from "@/components/MemeBroadcast";

export default function TransmissionInboxPage() {
  const { state, markTransmissionWatched } = useGame();
  const [playing, setPlaying] = useState<Transmission | null>(null);

  const ctx = usePlayerContext();

  const unlocked = useMemo(
    () => ALL_TRANSMISSIONS.filter(t => isUnlocked(t, ctx)).sort((a, b) => a.broadcastOrder - b.broadcastOrder),
    [ctx],
  );

  const watched = new Set(state.transmissionsWatched ?? []);

  // Group unlocked transmissions by "series" so the inbox renders
  // Spaces In Between separately from the main epoch chains. Returns
  // an ordered list of `{ label, items }` so the UI can walk it.
  const grouped = useMemo(() => {
    type Group = { label: string; key: string; items: Transmission[] };
    const groups: Group[] = [];
    const get = (key: string, label: string): Group => {
      let g = groups.find(x => x.key === key);
      if (!g) {
        g = { key, label, items: [] };
        groups.push(g);
      }
      return g;
    };
    for (const t of unlocked) {
      if (t.broadcastOrder <= -20) {
        get("sib", "Spaces In Between").items.push(t);
      } else {
        get(`epoch${t.epoch}`, `Epoch ${t.epoch}`).items.push(t);
      }
    }
    // SIB → Epoch 0 → Epoch 1 → Epoch 2 …
    groups.sort((a, b) => {
      if (a.key === "sib") return -1;
      if (b.key === "sib") return 1;
      return a.key.localeCompare(b.key);
    });
    return groups;
  }, [unlocked]);

  // Global progress: watched / total across every unlocked episode.
  const watchedCount = unlocked.filter(t => watched.has(transmissionId(t))).length;
  const totalCount = unlocked.length;
  const progressPct = totalCount === 0 ? 0 : Math.round((watchedCount / totalCount) * 100);

  const handleComplete = (id: string) => {
    const t = ALL_TRANSMISSIONS.find(x => transmissionId(x) === id);
    markTransmissionWatched(id, t?.triggersOracleReveal ?? false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
            <Radio size={18} className="text-red-500" />
          </motion.div>
          <div className="flex-1">
            <h1 className="font-display text-lg font-bold tracking-wider">TRANSMISSIONS</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              Late Night with the Meme · {unlocked.length} received · {watchedCount} archived
            </p>
          </div>
        </div>

        {/* Global progress bar */}
        {totalCount > 0 && (
          <div className="mb-5" data-testid="transmission-progress">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/60">
                Archive Progress
              </span>
              <span className="font-mono text-[9px] text-muted-foreground/80 tabular-nums">
                {watchedCount}/{totalCount} · {progressPct}%
              </span>
            </div>
            <div className="h-1 rounded-full bg-border/20 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500/60 to-purple-500/60"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {unlocked.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/30 rounded-lg">
            <Radio size={32} className="mx-auto text-muted-foreground/30 mb-2" />
            <p className="font-mono text-[10px] text-muted-foreground/60">
              No transmissions received yet. Progress the Saga to intercept signals.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map((group) => {
              const groupWatched = group.items.filter(t => watched.has(transmissionId(t))).length;
              return (
                <div key={group.key} data-testid={`transmission-group-${group.key}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
                      {group.label}
                    </h2>
                    <span className="font-mono text-[9px] text-muted-foreground/40 tabular-nums">
                      {groupWatched}/{group.items.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.items.map((t, i) => {
                      const id = transmissionId(t);
                      const isWatched = watched.has(id);
                      const isShift = t.triggersOracleReveal;
                      return (
                        <motion.button
                          key={id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.02 }}
                          onClick={() => setPlaying(t)}
                          className={`w-full p-3 rounded border text-left transition-colors ${
                            isShift ? "border-purple-500/40 bg-purple-500/5 hover:bg-purple-500/10"
                            : "border-border/30 bg-card/40 hover:bg-card/60"
                          }`}
                          data-testid={`transmission-${id}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[9px] text-muted-foreground/50 font-bold tabular-nums w-6 text-right">
                              {String(t.broadcastOrder).padStart(2, "0")}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-display text-sm font-bold text-foreground truncate">{t.title}</span>
                                {!isWatched && (
                                  <span className="font-mono text-[8px] px-1 py-0.5 rounded bg-red-500/20 text-red-300 uppercase tracking-wider">NEW</span>
                                )}
                                {isWatched && <CheckCircle size={10} className="text-emerald-400" />}
                                {isShift && <Sparkles size={10} className="text-purple-400" />}
                              </div>
                              <p className="font-mono text-[9px] text-muted-foreground/70 leading-snug mt-0.5">{t.synopsis}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/40">
                                  Epoch {t.epoch} · Ep {t.episodeNumber} · {Math.floor(t.lengthSeconds / 60)}:{String(t.lengthSeconds % 60).padStart(2, "0")}
                                </span>
                                {!isWatched && (
                                  <span className="font-mono text-[8px] text-amber-400">+{t.reward.xp} XP · +{t.reward.dream} Dream</span>
                                )}
                              </div>
                            </div>
                            <Play size={16} className={isWatched ? "text-muted-foreground/40" : "text-red-400"} />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-6 text-center font-mono text-[9px] italic text-muted-foreground/50">
          "I'm ALWAYS here, frens." — The Meme
        </p>
      </div>

      {playing && (
        <MemeBroadcast
          transmission={playing}
          onClose={() => setPlaying(null)}
          onComplete={handleComplete}
          alreadyWatched={watched.has(transmissionId(playing))}
          oracleRevealActive={state.oracleRevealActive ?? false}
          oracleRevealTier={state.oracleRevealTier ?? 0}
        />
      )}
    </div>
  );
}
