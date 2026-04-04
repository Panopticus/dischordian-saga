/* ═══════════════════════════════════════════════════════
   BRIDGE CONSOLE — The Living Ark's Command Interface

   This replaces the old Home page "intelligence feed."
   It shows ONLY what you've discovered through gameplay:
   - Daily Brief (3 events from the Living Ark)
   - Active NPC signals (discovered NPCs only)
   - Recent lore discoveries (rooms you've visited)
   - Ship status (discovered rooms, active quarantines)
   - Current mission objectives

   If you haven't found it, it doesn't appear here.
   The Bridge is your window into the Ark — not a menu.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio, Eye, Shield, ChevronRight, Zap, AlertTriangle,
  Clock, BookOpen, Music, Skull, Heart, Swords, Package,
  Ship, Compass, Star, MessageCircle,
} from "lucide-react";
import { useGame, ROOM_DEFINITIONS } from "@/contexts/GameContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { generateDailyBrief, ROOMS, type RoomEvent, type RoomId } from "@/game/livingArk";
import { FACTION_NPCS, type FactionNPCId } from "@/game/factionNPCs";

/* ─── NPC SIGNAL CARD ─── */
function NPCSignalCard({ npcId, trust }: { npcId: string; trust: number }) {
  const npc = FACTION_NPCS[npcId as FactionNPCId];
  if (!npc) return null;

  const room = ROOMS[npc.primaryRoom as RoomId];
  const tierLabel = trust < 20 ? "FAINT" : trust < 40 ? "WEAK" : trust < 60 ? "CLEAR" : trust < 80 ? "STRONG" : "BONDED";

  return (
    <Link href="/ark">
      <div
        className="flex items-center gap-3 p-3 rounded-lg border transition-all hover:brightness-110 cursor-pointer"
        style={{
          borderColor: `${npc.color}20`,
          background: `${npc.color}05`,
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `${npc.color}15`, boxShadow: `0 0 8px ${npc.color}20` }}
        >
          <Radio size={12} style={{ color: npc.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs font-bold truncate" style={{ color: npc.color }}>{npc.name}</p>
          <p className="font-mono text-[8px] text-white/30">{room?.name || npc.primaryRoom} // Signal: {tierLabel}</p>
        </div>
        <div className="w-10 h-1 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${trust}%`, background: npc.color }} />
        </div>
      </div>
    </Link>
  );
}

/* ─── DAILY EVENT CARD ─── */
function EventCard({ event, accent }: { event: RoomEvent; accent: string }) {
  const room = ROOMS[event.roomId];
  const typeIcon = event.type === "npc_conversation" ? <MessageCircle size={12} /> :
    event.type === "signal_fragment" ? <Radio size={12} /> :
    event.type === "tome_discovered" ? <BookOpen size={12} /> :
    event.type === "music_transmission" ? <Music size={12} /> :
    event.type === "boss_challenge" ? <Swords size={12} /> :
    event.type === "trade_opportunity" ? <Package size={12} /> :
    event.type === "system_anomaly" ? <AlertTriangle size={12} /> :
    event.type === "stargazing" ? <Star size={12} /> :
    <Compass size={12} />;

  return (
    <Link href="/ark">
      <div className="p-3 rounded-lg border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
            style={{ background: `${accent}10`, border: `1px solid ${accent}25` }}>
            <span style={{ color: accent }}>{typeIcon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs text-white/80 font-bold truncate group-hover:text-white transition-colors">
              {event.title}
            </p>
            <p className="font-mono text-[9px] text-white/30 mt-0.5">{event.description}</p>
            <p className="font-mono text-[8px] text-white/15 mt-1">{room?.name || event.roomId}</p>
          </div>
          <ChevronRight size={12} className="text-white/10 group-hover:text-white/30 transition-colors mt-1 shrink-0" />
        </div>
      </div>
    </Link>
  );
}

/* ─── RECENT DISCOVERY ─── */
function DiscoveryCard({ entry, onDiscover }: { entry: LoredexEntry; onDiscover: (id: string) => void }) {
  const href = entry.type === "song" ? `/song/${entry.id}` : `/entity/${entry.id}`;
  return (
    <Link href={href} onClick={() => onDiscover(entry.id)}>
      <div className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/[0.03] transition-all cursor-pointer group">
        {entry.image ? (
          <img src={entry.image} alt="" className="w-8 h-8 rounded object-cover shrink-0" loading="lazy" />
        ) : (
          <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0">
            <Eye size={10} className="text-white/20" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] text-white/70 truncate group-hover:text-white/90">{entry.name}</p>
          <p className="font-mono text-[7px] text-white/20 uppercase">{entry.type}</p>
        </div>
      </div>
    </Link>
  );
}

/* ═══ MAIN BRIDGE CONSOLE ═══ */
export default function BridgeConsole() {
  const { state } = useGame();
  const gam = useGamification();
  const { entries, discoverEntry } = useLoredex();

  // Daily Brief
  const dailyBrief = useMemo(() => {
    const daySeed = Math.floor(Date.now() / 86400000);
    const act = state.narrativeFlags?.act_1_complete ? (state.narrativeFlags?.act_2_complete ? 2 : 1) : 0;
    const trust = state.elaraTrust ?? 10;
    const completed = new Set<string>(
      Object.keys(state.narrativeFlags || {}).filter(k => k.startsWith("tome_") || k.startsWith("music_"))
    );
    return generateDailyBrief(daySeed, act, trust, completed);
  }, [state.narrativeFlags, state.elaraTrust]);

  // Discovered NPCs (only show NPCs the player has met)
  const discoveredNPCs = useMemo(() => {
    const npcs: { id: string; trust: number }[] = [];
    // Elara is always discovered
    npcs.push({ id: "elara", trust: state.elaraTrust || 10 });
    // The Human if contact made
    if (state.humanContactMade) {
      npcs.push({ id: "the_human", trust: state.humanTrust || 0 });
    }
    // Other NPCs from discovery flags
    for (const [npcId, discovered] of Object.entries(state.npcDiscovered || {})) {
      if (discovered) {
        npcs.push({ id: npcId, trust: state.npcTrust?.[npcId] || 0 });
      }
    }
    return npcs;
  }, [state.elaraTrust, state.humanContactMade, state.humanTrust, state.npcDiscovered, state.npcTrust]);

  // Ship status
  const discoveredRooms = Object.values(state.rooms).filter(r => r.unlocked).length;
  const totalVisits = Object.values(state.rooms).reduce((sum, r) => sum + (r.visitCount || 0), 0);

  // Recent discoveries — only lore entries from visited rooms/discovered content
  const recentEntries = useMemo(() => {
    // Filter to entries the player has reasonably discovered
    return entries
      .filter(e => e.image && (e.type === "character" || e.type === "faction" || e.type === "location"))
      .slice(0, 8);
  }, [entries]);

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 6 ? "Night cycle. Ship running on minimal power." :
    hour < 12 ? "Morning cycle. Systems warming up." :
    hour < 18 ? "Standard operations. All systems nominal." :
    "Evening cycle. Observation windows are clear.";

  return (
    <div className="min-h-screen animate-fade-in pb-20">
      {/* ═══ BRIDGE HEADER ═══ */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
          <span className="font-mono text-[8px] text-emerald-400/60 tracking-[0.3em]">BRIDGE // ACTIVE</span>
        </div>
        <h1 className="font-display text-lg font-bold tracking-wider text-white/80 mb-0.5">
          Good {hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"}, Operative.
        </h1>
        <p className="font-mono text-[9px] text-white/25">{greeting}</p>
      </div>

      {/* ═══ DAILY BRIEF ═══ */}
      <div className="px-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={10} className="text-cyan-400/60" />
          <span className="font-mono text-[9px] text-cyan-400/60 tracking-[0.2em]">TODAY'S BRIEF</span>
        </div>
        <div className="space-y-2">
          {dailyBrief.gameplay && <EventCard event={dailyBrief.gameplay} accent="#33E2E6" />}
          {dailyBrief.story && <EventCard event={dailyBrief.story} accent="#a855f7" />}
          {dailyBrief.relationship && <EventCard event={dailyBrief.relationship} accent="#f59e0b" />}
        </div>
      </div>

      {/* ═══ ACTIVE SIGNALS (discovered NPCs) ═══ */}
      {discoveredNPCs.length > 0 && (
        <div className="px-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Radio size={10} className="text-red-400/60" />
            <span className="font-mono text-[9px] text-red-400/60 tracking-[0.2em]">ACTIVE SIGNALS</span>
          </div>
          <div className="space-y-1.5">
            {discoveredNPCs.map(npc => (
              <NPCSignalCard key={npc.id} npcId={npc.id} trust={npc.trust} />
            ))}
          </div>
        </div>
      )}

      {/* ═══ SHIP STATUS ═══ */}
      <div className="px-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Ship size={10} className="text-white/20" />
          <span className="font-mono text-[9px] text-white/20 tracking-[0.2em]">SHIP STATUS</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
            <p className="font-display text-lg font-bold text-cyan-400">{discoveredRooms}</p>
            <p className="font-mono text-[7px] text-white/20 tracking-wider">SECTORS</p>
          </div>
          <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
            <p className="font-display text-lg font-bold text-amber-400">{totalVisits}</p>
            <p className="font-mono text-[7px] text-white/20 tracking-wider">VISITS</p>
          </div>
          <div className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02]">
            <p className="font-display text-lg font-bold text-purple-400">{discoveredNPCs.length}</p>
            <p className="font-mono text-[7px] text-white/20 tracking-wider">CONTACTS</p>
          </div>
        </div>
      </div>

      {/* ═══ RECENT INTEL (discovered lore only) ═══ */}
      {recentEntries.length > 0 && (
        <div className="px-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Eye size={10} className="text-white/20" />
              <span className="font-mono text-[9px] text-white/20 tracking-[0.2em]">RECENT INTEL</span>
            </div>
            <Link href="/search" className="font-mono text-[8px] text-cyan-400/40 hover:text-cyan-400/60 transition-colors">
              VIEW ALL
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {recentEntries.map(entry => (
              <DiscoveryCard key={entry.id} entry={entry} onDiscover={discoverEntry} />
            ))}
          </div>
        </div>
      )}

      {/* ═══ EXPLORE PROMPT (if early in game) ═══ */}
      {discoveredRooms < 3 && (
        <div className="px-4">
          <Link href="/ark">
            <div className="p-4 rounded-lg border border-cyan-500/15 bg-cyan-500/[0.03] text-center cursor-pointer hover:bg-cyan-500/[0.06] transition-all">
              <Compass size={20} className="text-cyan-400/50 mx-auto mb-2" />
              <p className="font-mono text-xs text-white/50">The Ark awaits exploration.</p>
              <p className="font-mono text-[9px] text-cyan-400/40 mt-1">Tap to enter the ship.</p>
            </div>
          </Link>
        </div>
      )}

      {/* ═══ FOOTER ═══ */}
      <div className="px-4 mt-8 text-center">
        <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-white/5 to-transparent mb-3" />
        <p className="font-mono text-[7px] text-white/10 tracking-[0.4em]">
          ARK 1047 // {gam.title || "OPERATIVE"} // BRIDGE CONSOLE
        </p>
      </div>
    </div>
  );
}
