/* ═══════════════════════════════════════════════════════
   CONSPIRACY BOARDS PAGE — Witnessing Discovery Race
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Users, Flag, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function ConspiracyBoardsPage() {
  const { isAuthenticated } = useAuth();
  const catalog = trpc.conspiracy.getCatalog.useQuery();
  const myBoards = trpc.conspiracy.getMyBoards.useQuery(undefined, { enabled: isAuthenticated });
  const guildBoards = trpc.conspiracy.getGuildBoards.useQuery(undefined, { enabled: isAuthenticated });
  const reveals = trpc.conspiracy.getServerWideRevealHistory.useQuery({ limit: 10 });
  const utils = trpc.useUtils();
  const [tab, setTab] = useState<"mine" | "guild" | "history">("mine");

  const solveMutation = trpc.conspiracy.attemptSolve.useMutation({
    onSuccess: () => {
      utils.conspiracy.getMyBoards.invalidate();
      utils.conspiracy.getGuildBoards.invalidate();
      utils.conspiracy.getServerWideRevealHistory.invalidate();
    },
  });

  const [peekedBoard, setPeekedBoard] = useState<string | null>(null);
  const [peekResults, setPeekResults] = useState<Record<string, Array<{ guildId: number; guildName: string; guildTag: string; cluesGathered: number; cluesRequired: number; progress: number }>>>({});
  const peekMutation = trpc.conspiracy.oraclePoolPeek.useMutation({
    onSuccess: (data, variables) => {
      setPeekResults((prev) => ({ ...prev, [variables.boardKey]: data.rivals }));
      setPeekedBoard(variables.boardKey);
    },
  });

  const myByKey = useMemo(() => {
    const m = new Map<string, NonNullable<typeof myBoards.data>[number]>();
    for (const b of myBoards.data ?? []) m.set(b.boardKey, b);
    return m;
  }, [myBoards.data]);

  const guildByKey = useMemo(() => {
    const m = new Map<string, NonNullable<typeof guildBoards.data>[number]>();
    for (const b of guildBoards.data ?? []) m.set(b.boardKey, b);
    return m;
  }, [guildBoards.data]);

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/" className="font-mono text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
        <ArrowLeft size={12} /> BACK
      </Link>
      <h1 className="font-display text-3xl font-black tracking-wider flex items-center gap-3 mt-4">
        <BookOpen className="text-primary" size={28} />
        CONSPIRACY BOARDS
      </h1>
      <p className="font-mono text-sm text-muted-foreground mt-1 mb-6">
        Discover mysteries first. Race rival guilds to flip server-wide secrets.
      </p>

      <div className="flex gap-2 mb-6">
        {(["mine", "guild", "history"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`font-mono text-xs px-3 py-1.5 border rounded ${
              tab === t
                ? "border-primary text-primary bg-primary/10"
                : "border-border/40 text-muted-foreground hover:border-border"
            }`}
          >
            {t === "mine" && <BookOpen size={11} className="inline mr-1" />}
            {t === "guild" && <Users size={11} className="inline mr-1" />}
            {t === "history" && <Flag size={11} className="inline mr-1" />}
            {t === "mine" ? "MY PROGRESS" : t === "guild" ? "GUILD RACE" : "REVEALS"}
          </button>
        ))}
      </div>

      {tab !== "history" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(catalog.data ?? []).map((board) => {
            const mine = myByKey.get(board.boardKey);
            const guild = guildByKey.get(board.boardKey);
            const data = tab === "guild" ? guild : mine;
            const gathered = data?.cluesGathered ?? [];
            const progress = data?.progress ?? 0;
            const solved = !!data?.solvedAt;
            const isFirst = !!data?.isFirstDiscoverer;
            return (
              <motion.div
                key={board.boardKey}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-lg p-4 ${
                  solved ? "border-primary/50 bg-primary/5" : "border-border/40 bg-secondary/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display text-lg font-bold tracking-wider">{board.name}</h3>
                  {isFirst && (
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full void-text-accent border void-border void-bg-sunk whitespace-nowrap">
                      <Sparkles size={9} className="inline mr-0.5" />
                      FIRST
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">{board.description}</p>
                {board.flavorText && (
                  <p className="font-mono text-[10px] italic mt-2 opacity-60">"{board.flavorText}"</p>
                )}

                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {gathered.length} / {board.cluesRequired} CLUES
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {Math.round(progress * 100)}%
                    </p>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Clue checklist */}
                <div className="mt-3 grid grid-cols-2 gap-1">
                  {board.acceptedClues.map((clueKey) => {
                    const have = gathered.includes(clueKey);
                    return (
                      <span
                        key={clueKey}
                        className={`font-mono text-[10px] px-2 py-1 rounded ${
                          have
                            ? "border border-primary/30 text-primary bg-primary/5"
                            : "border border-border/30 text-muted-foreground opacity-50"
                        }`}
                      >
                        {have ? "✓ " : "○ "}
                        {clueKey.replace(/^clue_/, "").replace(/_/g, " ")}
                      </span>
                    );
                  })}
                </div>

                {!solved && progress >= 1 && tab === "mine" && (
                  <button
                    type="button"
                    className="mt-3 w-full font-mono text-xs py-2 border border-primary text-primary rounded hover:bg-primary/10"
                    disabled={solveMutation.isPending}
                    onClick={() => solveMutation.mutate({ boardKey: board.boardKey })}
                  >
                    {solveMutation.isPending ? "SOLVING..." : "ATTEMPT SOLVE"}
                  </button>
                )}
                {solved && (
                  <p className="mt-3 font-mono text-[10px] text-primary text-center">
                    ✓ SOLVED {data?.solvedAt ? new Date(data.solvedAt).toLocaleDateString() : ""}
                  </p>
                )}

                {/* Tier 4: Oracle Pool peek (hall T4+, costs 50 Dream). */}
                {tab === "guild" && (
                  <div className="mt-3">
                    <button
                      type="button"
                      className="w-full font-mono text-[10px] py-1.5 border void-border void-text-accent rounded void-bg-sunk"
                      disabled={peekMutation.isPending}
                      onClick={() => peekMutation.mutate({ boardKey: board.boardKey })}
                    >
                      {peekMutation.isPending && peekMutation.variables?.boardKey === board.boardKey
                        ? "PEEKING..."
                        : "ORACLE POOL PEEK (50 Dream)"}
                    </button>
                    {peekedBoard === board.boardKey && peekResults[board.boardKey] && (
                      <div className="mt-2 border void-border void-bg-sunk rounded p-2 space-y-1">
                        <p className="font-mono text-[10px] void-text-accent mb-1">Rival guilds racing:</p>
                        {peekResults[board.boardKey].length === 0 && (
                          <p className="font-mono text-[10px] text-muted-foreground italic">No rivals on this board.</p>
                        )}
                        {peekResults[board.boardKey].slice(0, 5).map((r) => (
                          <div key={r.guildId} className="flex items-center justify-between font-mono text-[10px]">
                            <span>[{r.guildTag}] {r.guildName}</span>
                            <span className="void-text-accent">
                              {r.cluesGathered}/{r.cluesRequired} ({Math.round(r.progress * 100)}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-2">
          {(reveals.data ?? []).map((evt) => (
            <div key={evt.eventKey} className="border border-border/40 bg-secondary/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs font-bold">{evt.eventKey}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    First by{" "}
                    <span className="text-primary">{evt.firstDiscovererName}</span>
                    {evt.firstDiscovererGuild && (
                      <>
                        {" "}of{" "}
                        <span className="text-primary">[{evt.firstDiscovererGuild.tag}] {evt.firstDiscovererGuild.name}</span>
                      </>
                    )}
                  </p>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {evt.discoveredAt ? new Date(evt.discoveredAt).toLocaleString() : "—"}
                </p>
              </div>
            </div>
          ))}
          {(reveals.data ?? []).length === 0 && (
            <p className="font-mono text-xs text-muted-foreground italic">No reveals yet — be first.</p>
          )}
        </div>
      )}
    </div>
  );
}
