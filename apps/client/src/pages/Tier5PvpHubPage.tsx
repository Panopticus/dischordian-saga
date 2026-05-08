/* ═══════════════════════════════════════════════════════
   TIER 5 PVP HUB — Circuit / Trade / CADES / TD Live Siege /
   Guild Skirmish. Lightweight UI exposing each variant's
   propose / submit / list endpoints in one place.
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft, Crosshair, Compass, Target, Shield, Flag, Plus,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

type Tab = "circuit" | "trade" | "cades" | "td_siege" | "skirmish";

export default function Tier5PvpHubPage() {
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<Tab>("circuit");
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="font-mono text-sm text-muted-foreground">Sign in to access PvP variants.</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/" className="font-mono text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
        <ArrowLeft size={12} /> BACK
      </Link>
      <h1 className="font-display text-3xl font-black tracking-wider flex items-center gap-3 mt-4">
        <Crosshair className="text-primary" size={28} />
        PVP VARIANTS
      </h1>
      <p className="font-mono text-sm text-muted-foreground mt-1 mb-6">
        Cross-mode competitive surfaces — Circuit, Trade, CADES, Live Siege, Guild Skirmish.
      </p>
      <div className="flex gap-2 mb-6 flex-wrap">
        {([
          { key: "circuit", label: "CIRCUIT", icon: Crosshair },
          { key: "trade", label: "TRADE", icon: Compass },
          { key: "cades", label: "CADES", icon: Target },
          { key: "td_siege", label: "LIVE SIEGE", icon: Shield },
          { key: "skirmish", label: "SKIRMISH", icon: Flag },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`font-mono text-xs px-3 py-1.5 border rounded inline-flex items-center gap-1 ${
              tab === key
                ? "border-primary text-primary bg-primary/10"
                : "border-border/40 text-muted-foreground hover:border-border"
            }`}
          >
            <Icon size={11} />{label}
          </button>
        ))}
      </div>
      {tab === "circuit" && <CircuitTab />}
      {tab === "trade" && <TradeTab />}
      {tab === "cades" && <CadesTab />}
      {tab === "td_siege" && <TdSiegeTab />}
      {tab === "skirmish" && <SkirmishTab />}
    </div>
  );
}

function OpponentInput({ onSubmit, label }: { onSubmit: (opponentId: number) => void; label: string }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex gap-2 mb-4">
      <input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Opponent user ID"
        className="font-mono text-xs px-2 py-1 bg-background border border-border/40 rounded flex-1"
      />
      <button
        type="button"
        disabled={!val}
        onClick={() => { const n = Number(val); if (n > 0) onSubmit(n); }}
        className="font-mono text-xs px-3 py-1 border border-primary/40 text-primary rounded hover:bg-primary/10 inline-flex items-center gap-1"
      >
        <Plus size={11} /> {label}
      </button>
    </div>
  );
}

function MatchCard({ children, status }: { children: React.ReactNode; status?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg p-3 ${
        status === "completed"
          ? "border-primary/40 bg-primary/5"
          : "border-border/40 bg-secondary/20"
      }`}
    >
      {children}
    </motion.div>
  );
}

function CircuitTab() {
  const matches = trpc.tier5Pvp.circuit.getMyMatches.useQuery({ limit: 20 });
  const utils = trpc.useUtils();
  const propose = trpc.tier5Pvp.circuit.proposeMatch.useMutation({
    onSuccess: () => utils.tier5Pvp.circuit.getMyMatches.invalidate(),
  });
  return (
    <div>
      <OpponentInput
        label="QUEUE RIVAL RUN"
        onSubmit={(id) => propose.mutate({ opponentId: id, format: "single_race" })}
      />
      <h3 className="font-display text-sm font-bold tracking-wider mb-2">RECENT RACES</h3>
      <div className="grid gap-2 md:grid-cols-2">
        {(matches.data ?? []).map((m) => (
          <MatchCard key={m.id} status={m.status}>
            <div className="flex justify-between">
              <span className="font-mono text-xs">vs user {m.player1Id === m.player2Id ? "self" : (m.player2Id ?? "—")}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{m.format}</span>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground mt-1">
              status: {m.status} {m.winnerId ? `· winner: ${m.winnerId}` : ""}
            </p>
          </MatchCard>
        ))}
        {(matches.data ?? []).length === 0 && (
          <p className="font-mono text-xs text-muted-foreground italic">No races yet.</p>
        )}
      </div>
    </div>
  );
}

function TradeTab() {
  const [sectorId, setSectorId] = useState("panopticon_core");
  const sector = trpc.tier5Pvp.trade.getSectorState.useQuery({ sectorId });
  const duels = trpc.tier5Pvp.trade.getMyOracleDuels.useQuery({ limit: 20 });
  const utils = trpc.useUtils();
  const contribute = trpc.tier5Pvp.trade.contributeToSector.useMutation({
    onSuccess: () => utils.tier5Pvp.trade.getSectorState.invalidate(),
  });
  const proposeDuel = trpc.tier5Pvp.trade.proposeOracleDuel.useMutation({
    onSuccess: () => utils.tier5Pvp.trade.getMyOracleDuels.invalidate(),
  });
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-sm font-bold tracking-wider mb-2">SECTOR CONTROL</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={sectorId}
            onChange={(e) => setSectorId(e.target.value)}
            className="font-mono text-xs px-2 py-1 bg-background border border-border/40 rounded flex-1"
            placeholder="sector id"
          />
          <button
            type="button"
            onClick={() => contribute.mutate({ sectorId, points: 100 })}
            className="font-mono text-xs px-3 py-1 border border-primary/40 text-primary rounded hover:bg-primary/10"
          >
            CONTRIBUTE 100
          </button>
        </div>
        {sector.data && (
          <div className="border border-border/40 rounded-lg p-3 bg-secondary/20">
            <p className="font-mono text-xs">
              <span className="text-muted-foreground">Sector Lord:</span>{" "}
              <span className="text-primary">user {sector.data.lordUserId ?? "—"}</span>
            </p>
            <p className="font-mono text-[10px] text-muted-foreground mt-1">
              Week starts: {sector.data.weekStart ? new Date(sector.data.weekStart).toLocaleDateString() : "—"}
            </p>
          </div>
        )}
      </div>
      <div>
        <h3 className="font-display text-sm font-bold tracking-wider mb-2">ORACLE FUTURES DUELS</h3>
        <OpponentInput
          label="PROPOSE CALL DUEL"
          onSubmit={(id) => proposeDuel.mutate({
            opponentId: id,
            sectorId,
            strikePrice: 1000,
            myPosition: "call",
          })}
        />
        <div className="grid gap-2 md:grid-cols-2">
          {(duels.data ?? []).map((d) => (
            <MatchCard key={d.id} status={d.status}>
              <p className="font-mono text-xs">duel {d.duelId.slice(0, 8)}</p>
              <p className="font-mono text-[10px] text-muted-foreground">
                {d.sectorId} · strike {d.strikePrice}
                {d.settlementPrice != null && ` · settled ${d.settlementPrice}`}
                {d.winnerId && ` · winner ${d.winnerId}`}
              </p>
            </MatchCard>
          ))}
        </div>
      </div>
    </div>
  );
}

function CadesTab() {
  const matches = trpc.tier5Pvp.cades.getMyMatches.useQuery({ limit: 20 });
  const utils = trpc.useUtils();
  const propose = trpc.tier5Pvp.cades.proposeMatch.useMutation({
    onSuccess: () => utils.tier5Pvp.cades.getMyMatches.invalidate(),
  });
  return (
    <div>
      <OpponentInput
        label="PROPOSE RIVAL RUN"
        onSubmit={(id) => propose.mutate({ opponentId: id, scenarioMode: "last_stand" })}
      />
      <h3 className="font-display text-sm font-bold tracking-wider mb-2">RECENT RUNS</h3>
      <div className="grid gap-2 md:grid-cols-2">
        {(matches.data ?? []).map((m) => (
          <MatchCard key={m.id} status={m.status}>
            <p className="font-mono text-xs">{m.scenarioMode} · {m.matchId.slice(-8)}</p>
            <p className="font-mono text-[10px] text-muted-foreground">
              p1 {m.player1Score ?? "—"} vs p2 {m.player2Score ?? "—"} · status {m.status}
            </p>
          </MatchCard>
        ))}
      </div>
    </div>
  );
}

function TdSiegeTab() {
  const sieges = trpc.tier5Pvp.tdLiveSiege.getMySieges.useQuery({ limit: 20 });
  const utils = trpc.useUtils();
  const start = trpc.tier5Pvp.tdLiveSiege.startSiege.useMutation({
    onSuccess: () => utils.tier5Pvp.tdLiveSiege.getMySieges.invalidate(),
  });
  return (
    <div>
      <OpponentInput
        label="START LIVE SIEGE"
        onSubmit={(id) => start.mutate({ defenderId: id })}
      />
      <h3 className="font-display text-sm font-bold tracking-wider mb-2">RECENT SIEGES</h3>
      <div className="grid gap-2 md:grid-cols-2">
        {(sieges.data ?? []).map((s) => (
          <MatchCard key={s.id} status={s.status}>
            <p className="font-mono text-xs">siege {s.siegeId.slice(-8)}</p>
            <p className="font-mono text-[10px] text-muted-foreground">
              attacker {s.attackerUserId} → defender {s.defenderUserId} · {s.starsAwarded}★ · {s.trophyDelta > 0 ? "+" : ""}{s.trophyDelta}
            </p>
          </MatchCard>
        ))}
      </div>
    </div>
  );
}

function SkirmishTab() {
  const skirmishes = trpc.tier5Pvp.guildSkirmish.getMySkirmishes.useQuery({ limit: 20 });
  const utils = trpc.useUtils();
  const declare = trpc.tier5Pvp.guildSkirmish.declareSkirmish.useMutation({
    onSuccess: () => utils.tier5Pvp.guildSkirmish.getMySkirmishes.invalidate(),
  });
  const accept = trpc.tier5Pvp.guildSkirmish.acceptSkirmish.useMutation({
    onSuccess: () => utils.tier5Pvp.guildSkirmish.getMySkirmishes.invalidate(),
  });
  return (
    <div>
      <OpponentInput
        label="DECLARE SKIRMISH"
        onSubmit={(id) => declare.mutate({ rivalGuildId: id })}
      />
      <h3 className="font-display text-sm font-bold tracking-wider mb-2">SKIRMISH BRACKET</h3>
      <div className="space-y-2">
        {(skirmishes.data ?? []).map((s) => {
          const outcomes = s.modeOutcomes ?? {};
          const aWins = Object.values(outcomes).filter((o) => o === "guild_a").length;
          const bWins = Object.values(outcomes).filter((o) => o === "guild_b").length;
          return (
            <MatchCard key={s.id} status={s.status}>
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs font-bold">
                  Guild {s.guildAId} vs Guild {s.guildBId}
                </p>
                <span className="font-mono text-[10px] px-2 py-0.5 border border-border/40 rounded">
                  {s.status}
                </span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground mt-1">
                Score: {aWins}–{bWins} (best of 4)
                {s.winnerGuildId ? ` · winner: guild ${s.winnerGuildId}` : ""}
              </p>
              <div className="mt-2 grid grid-cols-4 gap-1 text-center">
                {(["card_duel", "chess", "td_live", "cades"] as const).map((mode) => {
                  const o = outcomes[mode];
                  return (
                    <div
                      key={mode}
                      className={`font-mono text-[10px] px-1 py-1 border rounded ${
                        o === "guild_a"
                          ? "border-primary/40 text-primary bg-primary/5"
                          : o === "guild_b"
                            ? "void-border void-text-accent void-bg-sunk"
                            : "border-border/40 text-muted-foreground"
                      }`}
                    >
                      {mode.replace("_", " ")}
                      <br />
                      {o ?? "—"}
                    </div>
                  );
                })}
              </div>
              {s.status === "proposed" && (
                <button
                  type="button"
                  className="mt-2 w-full font-mono text-xs py-1.5 border border-primary text-primary rounded hover:bg-primary/10"
                  onClick={() => accept.mutate({ skirmishId: s.skirmishId })}
                >
                  ACCEPT
                </button>
              )}
            </MatchCard>
          );
        })}
        {(skirmishes.data ?? []).length === 0 && (
          <p className="font-mono text-xs text-muted-foreground italic">No skirmishes yet.</p>
        )}
      </div>
    </div>
  );
}
