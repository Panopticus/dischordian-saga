/* ═══════════════════════════════════════════════════════
   NPC INBOX — Async messaging from faction NPCs
   Cyberpunk phone/terminal aesthetic. Unread messages glow.
   Route: /messages • Gated to comms-array discovery
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Mail, MailOpen, Radio, Lock, CornerUpLeft, Signal, Zap,
} from "lucide-react";
import { ASYNC_NPC_MESSAGES, type NPCMessage } from "./witcherCyberpunkFeatures";
import { FACTION_NPCS, type FactionNPCId } from "./factionNPCs";
import { useGame } from "@/contexts/GameContext";
import { toast } from "sonner";

type Filter = "all" | "unread" | "replied";

function formatTime(ts: number): string {
  if (!ts) return "QUEUED";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getNPC(id: string) {
  return FACTION_NPCS[id as FactionNPCId];
}

export default function NPCInboxPage() {
  const [, navigate] = useLocation();
  const { state, setNarrativeFlag } = useGame();
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<NPCMessage | null>(null);
  const [localRead, setLocalRead] = useState<Record<string, boolean>>({});

  const commsDiscovered = state.rooms["comms-array"]?.unlocked;
  const flags = state.narrativeFlags;

  const visibleMessages = useMemo(() => {
    return ASYNC_NPC_MESSAGES.filter(m => {
      if (m.triggerFlag && !flags[m.triggerFlag]) return false;
      return true;
    });
  }, [flags]);

  const isRead = (m: NPCMessage) => localRead[m.id] || !!flags[`msg_${m.id}_read`];
  const isReplied = (m: NPCMessage) => !!flags[`msg_${m.id}_replied`];

  const filtered = useMemo(() => {
    if (filter === "unread") return visibleMessages.filter(m => !isRead(m));
    if (filter === "replied") return visibleMessages.filter(m => isReplied(m));
    return visibleMessages;
  }, [visibleMessages, filter, localRead, flags]);

  const counts = {
    all: visibleMessages.length,
    unread: visibleMessages.filter(m => !isRead(m)).length,
    replied: visibleMessages.filter(m => isReplied(m)).length,
  };

  const openMessage = (m: NPCMessage) => {
    setSelected(m);
    setLocalRead(prev => ({ ...prev, [m.id]: true }));
    setNarrativeFlag(`msg_${m.id}_read`, true);
  };

  const handleReply = (msg: NPCMessage, replyId: string) => {
    const reply = msg.replies?.find(r => r.id === replyId);
    if (!reply) return;
    if (reply.effect?.flag) setNarrativeFlag(reply.effect.flag, true);
    setNarrativeFlag(`msg_${msg.id}_replied`, true);
    toast.success("REPLY SENT", { description: reply.text });
    setSelected(null);
  };

  if (!commsDiscovered) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4 p-6 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
          <Lock size={32} className="mx-auto text-cyan-400/60" />
          <h1 className="font-display text-lg tracking-[0.2em] text-cyan-400">NO RECEIVER ONLINE</h1>
          <p className="font-mono text-[11px] text-white/50 leading-relaxed">
            Encrypted messages require the Comms Array receiver. Discover it before signals can reach you.
          </p>
          <button onClick={() => navigate("/ark")} className="font-mono text-[10px] text-cyan-400 hover:underline">
            ← RETURN TO ARK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-950/20 via-black to-black p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 max-w-3xl mx-auto">
        <button onClick={() => navigate("/ark")} className="flex items-center gap-2 text-white/40 hover:text-white/70 font-mono text-[10px]">
          <ArrowLeft size={14} /> BACK
        </button>
        <div className="text-center">
          <h1 className="font-display text-xl tracking-[0.2em] text-cyan-300 flex items-center justify-center gap-2">
            <Signal size={16} className="text-cyan-400 animate-pulse" /> ENCRYPTED MESSAGES
          </h1>
          <p className="font-mono text-[9px] text-cyan-500/40 tracking-widest">
            COMMS ARRAY • {counts.unread} UNREAD / {counts.all} TOTAL
          </p>
        </div>
        <div className="w-16" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 justify-center mb-4 max-w-3xl mx-auto">
        {(["all", "unread", "replied"] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded font-mono text-[10px] tracking-wider transition-colors border ${
              filter === f
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                : "bg-white/[0.02] border-white/10 text-white/40 hover:text-white/70"
            }`}>
            {f.toUpperCase()} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Message list — phone-app style */}
      <div className="max-w-3xl mx-auto rounded-xl border border-cyan-500/20 bg-black/60 backdrop-blur-sm overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.1)]">
        <div className="px-4 py-2 border-b border-cyan-500/20 bg-cyan-500/5 flex items-center gap-2">
          <Zap size={10} className="text-cyan-400" />
          <span className="font-mono text-[9px] tracking-widest text-cyan-400/70">ARK 1047 :: SECURE CHANNEL</span>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30 font-mono text-xs">
            No {filter} messages.
          </div>
        )}
        <ul className="divide-y divide-white/5">
          {filtered.map(m => {
            const npc = getNPC(m.from);
            const unread = !isRead(m);
            const replied = isReplied(m);
            const color = npc?.color ?? "#888";
            return (
              <motion.li key={m.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <button onClick={() => openMessage(m)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                    unread ? "bg-white/[0.02] hover:bg-cyan-500/10" : "hover:bg-white/[0.03]"
                  }`}>
                  {/* Avatar */}
                  <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center border"
                    style={{
                      borderColor: color + "60",
                      backgroundColor: color + "18",
                      boxShadow: unread ? `0 0 14px ${color}60` : "none",
                    }}>
                    {unread ? <Mail size={14} style={{ color }} /> : <MailOpen size={14} style={{ color: color + "aa" }} />}
                  </div>
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-[11px] truncate" style={{ color: unread ? color : color + "aa" }}>
                        {npc?.name ?? m.from}
                      </p>
                      <span className="font-mono text-[9px] text-white/30 shrink-0">{formatTime(m.timestamp)}</span>
                    </div>
                    <p className={`font-mono text-[10px] truncate ${unread ? "text-white/80" : "text-white/40"}`}>
                      {m.text.slice(0, 80)}{m.text.length > 80 ? "..." : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {replied && <span className="font-mono text-[8px] text-emerald-400/60 tracking-widest">REPLIED</span>}
                      {npc?.corruption && npc.corruption !== "none" && (
                        <span className="font-mono text-[8px] text-red-400/50 tracking-widest">[{npc.corruption.toUpperCase()}]</span>
                      )}
                    </div>
                  </div>
                  {/* Unread dot */}
                  {unread && (
                    <span className="shrink-0 w-2 h-2 rounded-full mt-3 animate-pulse" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
                  )}
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>

      {/* Message detail modal */}
      <AnimatePresence>
        {selected && (() => {
          const npc = getNPC(selected.from);
          const color = npc?.color ?? "#888";
          const replied = isReplied(selected);
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelected(null)}>
              <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                className="w-full max-w-lg rounded-lg border bg-black/90 p-5 relative"
                style={{ borderColor: color + "60", boxShadow: `0 0 60px ${color}30` }}
                onClick={e => e.stopPropagation()}>
                {/* Sender */}
                <div className="flex items-center gap-3 pb-3 border-b" style={{ borderColor: color + "30" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border"
                    style={{ borderColor: color, backgroundColor: color + "20" }}>
                    <Radio size={16} style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-sm tracking-wide" style={{ color }}>{npc?.name ?? selected.from}</p>
                    <p className="font-mono text-[9px] text-white/40 tracking-widest">{npc?.title ?? "UNKNOWN SENDER"}</p>
                  </div>
                  <span className="font-mono text-[9px] text-white/30">{formatTime(selected.timestamp)}</span>
                </div>

                {/* Text */}
                <p className="font-mono text-[12px] leading-relaxed text-white/85 my-4 pl-3 border-l-2" style={{ borderColor: color + "80" }}>
                  {selected.text}
                </p>

                {/* Metadata */}
                <div className="flex flex-wrap gap-2 text-[8px] font-mono text-white/40 mb-4">
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded">ID :: {selected.id}</span>
                  {npc?.manifestation && <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded uppercase">CH :: {npc.manifestation.replace(/_/g, " ")}</span>}
                  {npc?.faction && <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded uppercase">FACTION :: {npc.faction}</span>}
                </div>

                {/* Replies */}
                {selected.replies && selected.replies.length > 0 && !replied ? (
                  <div className="space-y-2">
                    <p className="font-mono text-[9px] text-white/40 tracking-widest flex items-center gap-1">
                      <CornerUpLeft size={10} /> REPLY OPTIONS
                    </p>
                    {selected.replies.map(r => (
                      <button key={r.id} onClick={() => handleReply(selected, r.id)}
                        className="w-full text-left px-3 py-2 rounded border border-white/10 hover:border-cyan-500/40 bg-white/[0.02] hover:bg-cyan-500/10 font-mono text-[11px] text-white/80 hover:text-cyan-200 transition-colors">
                        &gt; {r.text}
                        {r.effect && (
                          <span className="block text-[8px] text-cyan-400/50 mt-0.5">
                            +{r.effect.trust} trust
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : replied ? (
                  <div className="text-center py-2 font-mono text-[10px] text-emerald-400/70 tracking-widest border border-emerald-500/20 bg-emerald-500/5 rounded">
                    REPLY SENT
                  </div>
                ) : (
                  <div className="text-center py-2 font-mono text-[9px] text-white/30 tracking-widest">
                    NO REPLY CHANNEL AVAILABLE
                  </div>
                )}

                <button onClick={() => setSelected(null)}
                  className="mt-3 w-full py-2 bg-white/5 border border-white/10 text-white/60 font-mono text-[10px] hover:bg-white/10 rounded tracking-wider">
                  CLOSE CHANNEL
                </button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
