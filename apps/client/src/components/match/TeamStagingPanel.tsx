/**
 * TeamStagingPanel — 2v2 / co-op pre-queue staging.
 *
 * Each party member picks their own deck and toggles "READY". The
 * leader's QUEUE button is gated on every member having both
 * selectedDeckId set AND ready=true (server-enforced; this surface
 * just disables the button for clarity).
 */
import { Users, Check, X, Crown, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { TitlePill } from "@/components/TitlePill";
import { useMemo } from "react";

const MODES = [
  { key: "card_2v2", label: "Ranked 2v2" },
  { key: "card_coop", label: "Card Co-op" },
] as const;

export function TeamStagingPanel() {
  const { isAuthenticated, user } = useAuth();
  const myParty = trpc.party.getMyParty.useQuery(undefined, { enabled: isAuthenticated });
  const myDecks = trpc.pvp.getMyDecks.useQuery(undefined, { enabled: isAuthenticated });
  const myInvites = trpc.party.myInvites.useQuery(undefined, { enabled: isAuthenticated });
  const utils = trpc.useUtils();

  const createParty = trpc.party.createParty.useMutation({
    onSuccess: () => utils.party.getMyParty.invalidate(),
  });
  const setMode = trpc.party.setMode.useMutation({
    onSuccess: () => utils.party.getMyParty.invalidate(),
  });
  const leaveParty = trpc.party.leaveParty.useMutation({
    onSuccess: () => utils.party.getMyParty.invalidate(),
  });
  const setMyDeck = trpc.party.setMyDeck.useMutation({
    onSuccess: () => utils.party.getMyParty.invalidate(),
  });
  const queue = trpc.party.queueParty.useMutation({
    onSuccess: () => utils.party.getMyParty.invalidate(),
  });
  const accept = trpc.party.acceptInvite.useMutation({
    onSuccess: () => {
      utils.party.getMyParty.invalidate();
      utils.party.myInvites.invalidate();
    },
  });
  const decline = trpc.party.declineInvite.useMutation({
    onSuccess: () => utils.party.myInvites.invalidate(),
  });

  const meMembership = useMemo(() => {
    return myParty.data?.members?.find((m) => m.userId === user?.id) ?? null;
  }, [myParty.data, user?.id]);
  const isLeader = meMembership?.role === "leader";
  const allReady = (myParty.data?.members ?? []).every((m) => m.ready && m.selectedDeckId != null);
  const memberCount = myParty.data?.members?.length ?? 0;
  const expectedCount = myParty.data?.mode === "card_2v2" || myParty.data?.mode === "card_coop" ? 2 : 4;

  if (!isAuthenticated) {
    return (
      <p className="font-mono text-xs text-muted-foreground italic">
        Sign in to use 2v2 / co-op queues.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pending invites */}
      {(myInvites.data ?? []).length > 0 && (
        <div className="border border-amber-400/40 bg-amber-400/5 rounded-lg p-3">
          <p className="font-mono text-[10px] text-amber-400 uppercase tracking-wider mb-2">
            PENDING INVITES
          </p>
          <div className="space-y-1.5">
            {myInvites.data!.map((inv) => (
              <div key={inv.inviteId} className="flex items-center justify-between">
                <p className="font-mono text-xs">
                  {inv.party?.mode ?? "open"} party · invited by user #{inv.invitedByUserId}
                </p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => accept.mutate({ inviteId: inv.inviteId })}
                    className="font-mono text-[10px] px-2 py-1 border border-primary/40 text-primary rounded hover:bg-primary/10"
                  >
                    ACCEPT
                  </button>
                  <button
                    type="button"
                    onClick={() => decline.mutate({ inviteId: inv.inviteId })}
                    className="font-mono text-[10px] px-2 py-1 border border-border/40 rounded hover:border-red-400/40"
                  >
                    DECLINE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No party — create flow */}
      {!myParty.data && (
        <div className="border border-border/40 bg-secondary/20 rounded-lg p-4 text-center">
          <Users size={24} className="text-primary mx-auto mb-2" />
          <p className="font-mono text-sm mb-3">No party. Create one to queue 2v2 / co-op.</p>
          <div className="flex gap-2 justify-center">
            {MODES.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => createParty.mutate({ mode: m.key })}
                className="font-mono text-xs px-3 py-1.5 border border-primary/40 text-primary rounded hover:bg-primary/10"
              >
                CREATE {m.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* In-party staging */}
      {myParty.data && (
        <div className="border border-primary/30 bg-primary/5 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-sm font-bold tracking-wider flex items-center gap-2">
                <Users size={14} className="text-primary" />
                YOUR PARTY · <span className="text-primary">{myParty.data.mode}</span>
              </h3>
              <p className="font-mono text-[10px] text-muted-foreground">
                {memberCount}/{expectedCount} members · status {myParty.data.status}
              </p>
            </div>
            <button
              type="button"
              onClick={() => leaveParty.mutate()}
              className="font-mono text-[10px] text-muted-foreground hover:text-red-400"
            >
              LEAVE
            </button>
          </div>

          {/* Mode switcher (leader only, while forming) */}
          {isLeader && myParty.data.status === "forming" && (
            <div className="flex gap-2">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMode.mutate({ mode: m.key })}
                  className={`font-mono text-[10px] px-2 py-1 border rounded ${
                    myParty.data!.mode === m.key
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border/40 text-muted-foreground hover:border-border"
                  }`}
                >
                  {m.label.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {/* Member roster + per-member deck selector */}
          <div className="space-y-2">
            {(myParty.data.members ?? []).map((m) => {
              const isMe = m.userId === user?.id;
              return (
                <div
                  key={m.userId}
                  className={`border rounded p-2.5 ${
                    isMe ? "border-primary/40 bg-primary/5" : "border-border/40 bg-secondary/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {m.role === "leader" && <Crown size={11} className="text-amber-400" />}
                      <p className="font-mono text-xs font-bold">
                        {m.name} {isMe && <span className="text-primary">(you)</span>}
                      </p>
                      <TitlePill titleKey={null} size="xs" hideWhenEmpty />
                    </div>
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        m.ready
                          ? "border border-primary/40 text-primary bg-primary/5"
                          : "border border-border/40 text-muted-foreground"
                      }`}
                    >
                      {m.ready ? <Check size={9} /> : <X size={9} />}
                      {m.ready ? "READY" : "NOT READY"}
                    </span>
                  </div>
                  {isMe && (
                    <div className="mt-2 flex gap-1.5 flex-wrap">
                      <select
                        className="font-mono text-[10px] bg-background border border-border/40 rounded px-2 py-1"
                        value={m.selectedDeckId ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setMyDeck.mutate({
                            deckId: v === "" ? null : Number(v),
                            ready: m.ready,
                          });
                        }}
                      >
                        <option value="">— pick a deck —</option>
                        {(myDecks.data ?? []).map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.cardCount} cards)
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          setMyDeck.mutate({
                            deckId: m.selectedDeckId,
                            ready: !m.ready,
                          })
                        }
                        disabled={!m.ready && m.selectedDeckId == null}
                        className={`font-mono text-[10px] px-2 py-1 border rounded inline-flex items-center gap-1 disabled:opacity-40 ${
                          m.ready
                            ? "border-amber-400/40 text-amber-400"
                            : "border-primary/40 text-primary hover:bg-primary/10"
                        }`}
                      >
                        <Zap size={9} />
                        {m.ready ? "UNREADY" : "READY"}
                      </button>
                    </div>
                  )}
                  {!isMe && m.selectedDeckId != null && (
                    <p className="font-mono text-[10px] text-muted-foreground mt-1">
                      Deck #{m.selectedDeckId}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Queue button */}
          {isLeader && myParty.data.status === "forming" && (
            <button
              type="button"
              disabled={!allReady || memberCount !== expectedCount || queue.isPending}
              onClick={() => queue.mutate()}
              className="w-full font-mono text-xs py-2 border border-primary text-primary rounded hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {queue.isPending
                ? "QUEUEING..."
                : memberCount !== expectedCount
                  ? `WAITING FOR ${expectedCount - memberCount} MORE MEMBER(S)`
                  : !allReady
                    ? "WAITING FOR ALL MEMBERS TO READY UP"
                    : "QUEUE"}
            </button>
          )}
          {myParty.data.status === "queued" && (
            <p className="font-mono text-xs text-primary text-center">
              In matchmaking queue…
            </p>
          )}
          {myParty.data.status === "in_match" && (
            <p className="font-mono text-xs text-primary text-center">
              Match active — head to the arena.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
