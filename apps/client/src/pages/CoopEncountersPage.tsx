/* ═══════════════════════════════════════════════════════
   COOP ENCOUNTERS PAGE — "Two Witnesses" PvE encounters.
   Lobby for picking an encounter + difficulty + party.
   Tier 3 lore frame: card co-op against AI bosses.
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Sparkles, Heart, Shield, Crown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

type Difficulty = "normal" | "heroic" | "mythic";

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  normal: "var(--energy-secondary)",
  heroic: "var(--energy-system)",
  mythic: "var(--energy-accent)",
};

export default function CoopEncountersPage() {
  const { isAuthenticated } = useAuth();
  const catalog = trpc.coopCard.getCatalog.useQuery();
  const myParty = trpc.party.getMyParty.useQuery(undefined, { enabled: isAuthenticated });
  const myInvites = trpc.party.myInvites.useQuery(undefined, { enabled: isAuthenticated });
  const sessions = trpc.coopCard.getMySessions.useQuery({ limit: 10 }, { enabled: isAuthenticated });
  const utils = trpc.useUtils();

  const [difficulty, setDifficulty] = useState<Difficulty>("normal");

  const createParty = trpc.party.createParty.useMutation({
    onSuccess: () => utils.party.getMyParty.invalidate(),
  });
  const setMode = trpc.party.setMode.useMutation({
    onSuccess: () => utils.party.getMyParty.invalidate(),
  });
  const leaveParty = trpc.party.leaveParty.useMutation({
    onSuccess: () => utils.party.getMyParty.invalidate(),
  });
  const acceptInvite = trpc.party.acceptInvite.useMutation({
    onSuccess: () => {
      utils.party.getMyParty.invalidate();
      utils.party.myInvites.invalidate();
    },
  });
  const declineInvite = trpc.party.declineInvite.useMutation({
    onSuccess: () => utils.party.myInvites.invalidate(),
  });
  const startSession = trpc.coopCard.startSession.useMutation({
    onSuccess: (data) => {
      utils.party.getMyParty.invalidate();
      utils.coopCard.getMySessions.invalidate();
      window.location.href = `/pvp?coop=${data.sessionId}`;
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="font-mono text-sm text-muted-foreground">Sign in to play co-op encounters.</p>
      </div>
    );
  }

  const partyMode = myParty.data?.mode;
  const partyMembers = myParty.data?.members ?? [];
  const isLeader = partyMembers.find((m) => m.role === "leader")?.userId === undefined
    ? false
    : true; // user-detection done server-side; if you're rendering the leader controls you're the leader

  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/" className="font-mono text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
        <ArrowLeft size={12} /> BACK
      </Link>
      <h1 className="font-display text-3xl font-black tracking-wider flex items-center gap-3 mt-4">
        <Heart className="text-primary" size={28} />
        TWO WITNESSES
      </h1>
      <p className="font-mono text-sm text-muted-foreground mt-1 mb-6">
        Co-op card encounters against AI bosses. The Hierophant's testimony, made manifest.
      </p>

      {/* Party panel */}
      <section className="border border-border/40 bg-secondary/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm font-bold tracking-wider uppercase flex items-center gap-2">
            <Users size={14} /> Your Party
          </h3>
          {myParty.data && (
            <button
              type="button"
              onClick={() => leaveParty.mutate()}
              className="font-mono text-[10px] text-muted-foreground void-text-error"
            >
              LEAVE
            </button>
          )}
        </div>
        {myParty.data ? (
          <div className="space-y-2">
            <p className="font-mono text-xs">
              Mode: <span className="text-primary">{partyMode}</span>
              {partyMode !== "card_coop" && (
                <button
                  type="button"
                  className="ml-2 font-mono text-[10px] px-2 py-0.5 border void-border void-text-accent rounded void-bg-sunk"
                  onClick={() => setMode.mutate({ mode: "card_coop" })}
                >
                  SWITCH TO COOP
                </button>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {partyMembers.map((m) => (
                <span
                  key={m.userId}
                  className={`font-mono text-[10px] px-2 py-1 rounded-full border ${
                    m.role === "leader"
                      ? "void-border void-text-accent void-bg-sunk"
                      : "border-border/40 text-muted-foreground"
                  }`}
                >
                  {m.role === "leader" && "★ "}
                  {m.name} (slot {m.slot})
                </span>
              ))}
            </div>
            <p className="font-mono text-[10px] text-muted-foreground">
              Status: {myParty.data.status}
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => createParty.mutate({ mode: "card_coop" })}
            className="font-mono text-xs px-3 py-1.5 border border-primary/40 text-primary rounded hover:bg-primary/10"
          >
            CREATE COOP PARTY
          </button>
        )}
      </section>

      {/* Pending invites */}
      {(myInvites.data ?? []).length > 0 && (
        <section className="border void-border void-bg-sunk rounded-lg p-4 mb-6">
          <h3 className="font-display text-sm font-bold tracking-wider uppercase mb-2 void-text-accent">
            Pending Invites
          </h3>
          <div className="space-y-2">
            {myInvites.data!.map((inv) => (
              <div key={inv.inviteId} className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs">
                    {inv.party?.mode ?? "open"} party · invited by user #{inv.invitedByUserId}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Expires {inv.expiresAt ? new Date(inv.expiresAt).toLocaleTimeString() : "—"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => acceptInvite.mutate({ inviteId: inv.inviteId })}
                    className="font-mono text-[10px] px-2 py-1 border border-primary/40 text-primary rounded hover:bg-primary/10"
                  >
                    ACCEPT
                  </button>
                  <button
                    type="button"
                    onClick={() => declineInvite.mutate({ inviteId: inv.inviteId })}
                    className="font-mono text-[10px] px-2 py-1 border border-border/40 rounded void-border-error"
                  >
                    DECLINE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Difficulty selector */}
      <div className="flex gap-2 mb-4">
        {(["normal", "heroic", "mythic"] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDifficulty(d)}
            className={`font-mono text-xs px-3 py-1.5 border rounded ${
              difficulty === d
                ? "text-foreground"
                : "border-border/40 text-muted-foreground hover:border-border"
            }`}
            style={{
              borderColor: difficulty === d ? DIFFICULTY_COLOR[d] : undefined,
              color: difficulty === d ? DIFFICULTY_COLOR[d] : undefined,
            }}
          >
            {d.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Encounter list */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(catalog.data ?? []).map((enc) => {
          const canStart =
            !!myParty.data &&
            myParty.data.mode === "card_coop" &&
            (myParty.data.members?.length ?? 0) >= 1 &&
            (myParty.data.members?.length ?? 0) <= 2 &&
            myParty.data.status === "forming";
          return (
            <motion.div
              key={enc.encounterKey}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border/40 bg-secondary/10 rounded-lg p-4 flex flex-col"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-display text-sm font-bold tracking-wider">{enc.name}</h4>
                <Sparkles size={12} className="text-primary mt-1" />
              </div>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-2">
                {enc.description}
              </p>
              {enc.flavorText && (
                <p className="font-mono text-[10px] italic mb-2 opacity-60">"{enc.flavorText}"</p>
              )}
              <div className="space-y-1 mb-3 mt-auto">
                <p className="font-mono text-[10px] text-muted-foreground">
                  Boss HP × {enc.bossHpMultiplier[difficulty]} ({difficulty})
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {enc.phaseCount} scripted phases
                </p>
                {enc.rewards.titleKeyOnFirstClear && (
                  <p className="font-mono text-[10px] text-primary inline-flex items-center gap-1">
                    <Crown size={10} /> First-clear title
                  </p>
                )}
                {enc.rewards.dreamTokens > 0 && (
                  <p className="font-mono text-[10px] void-text-accent">
                    {enc.rewards.dreamTokens} Dream
                  </p>
                )}
              </div>
              <button
                type="button"
                disabled={!canStart || startSession.isPending}
                onClick={() => startSession.mutate({ encounterKey: enc.encounterKey, difficulty })}
                className="w-full font-mono text-xs py-2 border border-primary text-primary rounded hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {startSession.isPending ? "STARTING..." : canStart ? "BEGIN ENCOUNTER" : "NEED COOP PARTY"}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Recent sessions */}
      {(sessions.data ?? []).length > 0 && (
        <section className="mt-8">
          <h3 className="font-display text-sm font-bold tracking-wider uppercase mb-3 flex items-center gap-2">
            <Shield size={12} /> Recent Sessions
          </h3>
          <div className="space-y-2">
            {sessions.data!.map((s) => (
              <div key={s.id} className="border border-border/40 bg-secondary/20 rounded p-3">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs">
                    <span className="font-bold">{s.encounterKey}</span>
                    <span className="ml-2 text-muted-foreground">[{s.difficulty}]</span>
                  </p>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                      s.outcome === "victory"
                        ? "border border-primary/40 text-primary bg-primary/5"
                        : s.outcome === "defeat"
                          ? "border void-border-error void-text-error void-bg-error"
                          : "border border-border/40 text-muted-foreground"
                    }`}
                  >
                    {s.outcome.toUpperCase()}
                  </span>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground mt-1">
                  {s.startedAt ? new Date(s.startedAt).toLocaleString() : ""}
                  {(s.phasesFired ?? []).length > 0 && ` · ${(s.phasesFired ?? []).length} phases fired`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
