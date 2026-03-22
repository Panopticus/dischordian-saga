import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeTabs } from "@/hooks/useSwipeTabs";
import {
  Users, Shield, Crown, Star, MessageSquare, Send, Settings,
  Plus, Search, ChevronRight, Loader2, Flag, Gem, Coins,
  Trophy, Swords, UserPlus, LogOut, Check, X, ArrowUp, Clock
} from "lucide-react";
import { getLoginUrl } from "@/const";

/* ═══ FACTION COLORS ═══ */
const FACTION_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  empire: { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30" },
  insurgency: { color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/30" },
  neutral: { color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30" },
};

const ROLE_ICONS: Record<string, typeof Crown> = {
  leader: Crown,
  officer: Shield,
  member: Users,
};

export default function GuildPage() {
  const { isAuthenticated, user } = useAuth();
  const [tab, setTab] = useState<"overview" | "roster" | "chat" | "treasury" | "wars" | "browse">("overview");

  const { data: myGuild, isLoading: guildLoading, refetch: refetchGuild } = trpc.guild.myGuild.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: invites } = trpc.guild.myInvites.useQuery(undefined, { enabled: isAuthenticated });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 grid-bg">
        <div className="text-center">
          <Shield size={48} className="text-primary mx-auto mb-4 opacity-50" />
          <h2 className="font-display text-xl font-bold mb-2">SYNDICATE ACCESS</h2>
          <p className="font-mono text-sm text-muted-foreground mb-4">Authentication required to access Syndicate operations.</p>
          <a href={getLoginUrl()} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/20 transition-all">
            AUTHENTICATE <ChevronRight size={14} />
          </a>
        </div>
      </div>
    );
  }

  if (guildLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  // No guild — show browse/create
  if (!myGuild) {
    return <NoGuildView invites={invites || []} onJoined={refetchGuild} />;
  }

  const tabs = [
    { id: "overview" as const, label: "OVERVIEW", icon: Shield },
    { id: "roster" as const, label: "ROSTER", icon: Users },
    { id: "chat" as const, label: "COMMS", icon: MessageSquare },
    { id: "treasury" as const, label: "TREASURY", icon: Gem },
    { id: "wars" as const, label: "TERRITORY", icon: Swords },
  ];

  return (
    <div className="min-h-screen grid-bg">
      {/* Guild Header */}
      <div className="px-4 sm:px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${FACTION_STYLE[myGuild.guild.faction]?.bg} border ${FACTION_STYLE[myGuild.guild.faction]?.border}`}>
            <Shield size={20} className={FACTION_STYLE[myGuild.guild.faction]?.color} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-wider flex items-center gap-2">
              {myGuild.guild.name}
              <span className="font-mono text-xs text-muted-foreground">[{myGuild.guild.tag}]</span>
            </h1>
            <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
              <span className={FACTION_STYLE[myGuild.guild.faction]?.color}>
                {myGuild.guild.faction.toUpperCase()}
              </span>
              <span>LVL {myGuild.guild.level}</span>
              <span>{myGuild.guild.memberCount}/{myGuild.guild.maxMembers} MEMBERS</span>
            </div>
          </div>
        </div>
        {myGuild.guild.motd && (
          <div className="mt-2 px-3 py-2 rounded-md bg-card/40 border border-border/20 font-mono text-xs text-muted-foreground">
            {myGuild.guild.motd}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="px-4 sm:px-6 flex gap-1 border-b border-border/20 overflow-x-auto">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 font-mono text-xs tracking-wider transition-all border-b-2 whitespace-nowrap ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GuildOverview guild={myGuild.guild} membership={myGuild.membership} onRefetch={refetchGuild} />
            </motion.div>
          )}
          {tab === "roster" && (
            <motion.div key="roster" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GuildRoster guildId={myGuild.guild.id} myRole={myGuild.membership.role} />
            </motion.div>
          )}
          {tab === "chat" && (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GuildChat />
            </motion.div>
          )}
          {tab === "treasury" && (
            <motion.div key="treasury" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GuildTreasury guild={myGuild.guild} />
            </motion.div>
          )}
          {tab === "wars" && (
            <motion.div key="wars" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GuildTerritoryMap />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══ NO GUILD VIEW — Browse / Create / Invites ═══ */
function NoGuildView({ invites, onJoined }: { invites: any[]; onJoined: () => void }) {
  const [mode, setMode] = useState<"browse" | "create" | "recruitment">("browse");
  const { data: recruitmentPosts } = trpc.guild.getRecruitmentPosts.useQuery();
  const [search, setSearch] = useState("");
  const [faction, setFaction] = useState<string>("all");

  const { data: guildList } = trpc.guild.list.useQuery({
    search: search || undefined,
    faction: faction as any,
    recruiting: true,
  });

  const joinMut = trpc.guild.join.useMutation({ onSuccess: onJoined });
  const respondMut = trpc.guild.respondInvite.useMutation({ onSuccess: onJoined });

  const [createForm, setCreateForm] = useState({
    name: "", tag: "", description: "", faction: "neutral" as "empire" | "insurgency" | "neutral",
  });
  const createMut = trpc.guild.create.useMutation({ onSuccess: onJoined });

  return (
    <div className="min-h-screen grid-bg px-4 sm:px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Shield size={40} className="text-primary mx-auto mb-3 opacity-70" />
          <h1 className="font-display text-2xl font-bold tracking-wider mb-2">SYNDICATE OPERATIONS</h1>
          <p className="font-mono text-sm text-muted-foreground">Join or create a Syndicate to unlock cooperative missions, shared treasury, and faction warfare.</p>
        </div>

        {/* Pending Invites */}
        {invites.length > 0 && (
          <div className="mb-6 space-y-2">
            <h3 className="font-display text-xs font-bold tracking-[0.2em] text-amber-400 flex items-center gap-2">
              <UserPlus size={13} /> PENDING INVITATIONS
            </h3>
            {invites.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-card/40 border border-amber-400/20">
                <div>
                  <p className="font-mono text-sm font-semibold">{inv.guildName} <span className="text-muted-foreground">[{inv.guildTag}]</span></p>
                  <p className="font-mono text-[10px] text-muted-foreground">{inv.guildFaction?.toUpperCase()}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => respondMut.mutate({ inviteId: inv.id, accept: true })}
                    className="p-1.5 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => respondMut.mutate({ inviteId: inv.id, accept: false })}
                    className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("browse")}
            className={`flex-1 py-2 rounded-md font-mono text-xs tracking-wider transition-all ${
              mode === "browse" ? "bg-primary/10 border border-primary/40 text-primary" : "bg-card/30 border border-border/20 text-muted-foreground"
            }`}
          >
            <Search size={13} className="inline mr-1.5" /> BROWSE
          </button>
          <button
            onClick={() => setMode("recruitment")}
            className={`flex-1 py-2 rounded-md font-mono text-xs tracking-wider transition-all ${
              mode === "recruitment" ? "bg-primary/10 border border-primary/40 text-primary" : "bg-card/30 border border-border/20 text-muted-foreground"
            }`}
          >
            <UserPlus size={13} className="inline mr-1.5" /> RECRUITMENT
          </button>
          <button
            onClick={() => setMode("create")}
            className={`flex-1 py-2 rounded-md font-mono text-xs tracking-wider transition-all ${
              mode === "create" ? "bg-primary/10 border border-primary/40 text-primary" : "bg-card/30 border border-border/20 text-muted-foreground"
            }`}
          >
            <Plus size={13} className="inline mr-1.5" /> CREATE
          </button>
        </div>

        {mode === "recruitment" ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <UserPlus size={14} className="text-primary" />
              <span className="font-display text-xs font-bold tracking-[0.2em]">RECRUITMENT BOARD</span>
              <span className="font-mono text-[10px] text-muted-foreground">// ACTIVE POSTINGS</span>
            </div>
            {recruitmentPosts?.posts.map(p => {
              const fs = FACTION_STYLE[p.guildFaction] || FACTION_STYLE.neutral;
              return (
                <div key={p.id} className="p-4 rounded-lg bg-card/40 border border-border/20 hover:border-primary/20 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${fs.bg} border ${fs.border}`}>
                        <Shield size={16} className={fs.color} />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-semibold">{p.guildName} <span className="text-muted-foreground text-xs">[{p.guildTag}]</span></p>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                          <span className={fs.color}>{p.guildFaction.toUpperCase()}</span>
                          <span>LVL {p.guildLevel}</span>
                          <span>{p.memberCount}/{p.maxMembers}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => joinMut.mutate({ guildId: p.guildId })}
                      disabled={joinMut.isPending}
                      className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/40 text-primary font-mono text-xs hover:bg-primary/20 transition-all disabled:opacity-50"
                    >
                      APPLY
                    </button>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.minLevel > 1 && (
                      <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 font-mono text-[10px] text-amber-400">MIN LVL {p.minLevel}</span>
                    )}
                    {p.requirements && (
                      <span className="px-2 py-0.5 rounded bg-card/60 border border-border/30 font-mono text-[10px] text-muted-foreground">{p.requirements}</span>
                    )}
                    {p.preferredClasses?.map((c: string) => (
                      <span key={c} className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 font-mono text-[10px] text-primary">{c}</span>
                    ))}
                  </div>
                </div>
              );
            })}
            {(!recruitmentPosts?.posts || recruitmentPosts.posts.length === 0) && (
              <div className="text-center py-8">
                <UserPlus size={32} className="text-muted-foreground/30 mx-auto mb-2" />
                <p className="font-mono text-xs text-muted-foreground">No active recruitment posts. Check back later or browse syndicates directly.</p>
              </div>
            )}
          </div>
        ) : mode === "browse" ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search syndicates..."
                className="flex-1 px-3 py-2 rounded-md bg-card/40 border border-border/30 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
              />
              <select
                value={faction}
                onChange={e => setFaction(e.target.value)}
                className="px-3 py-2 rounded-md bg-card/40 border border-border/30 font-mono text-xs text-foreground"
              >
                <option value="all">ALL</option>
                <option value="empire">EMPIRE</option>
                <option value="insurgency">INSURGENCY</option>
                <option value="neutral">NEUTRAL</option>
              </select>
            </div>
            {guildList?.guilds.map(g => {
              const fs = FACTION_STYLE[g.faction] || FACTION_STYLE.neutral;
              return (
                <div key={g.id} className="flex items-center justify-between p-3 rounded-lg bg-card/40 border border-border/20 hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center ${fs.bg} border ${fs.border}`}>
                      <Shield size={16} className={fs.color} />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold">{g.name} <span className="text-muted-foreground text-xs">[{g.tag}]</span></p>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                        <span className={fs.color}>{g.faction.toUpperCase()}</span>
                        <span>LVL {g.level}</span>
                        <span>{g.memberCount}/{g.maxMembers}</span>
                        <span><Trophy size={9} className="inline" /> {g.totalWarPoints}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => joinMut.mutate({ guildId: g.id })}
                    disabled={joinMut.isPending}
                    className="px-3 py-1.5 rounded-md bg-primary/10 border border-primary/40 text-primary font-mono text-xs hover:bg-primary/20 transition-all disabled:opacity-50"
                  >
                    JOIN
                  </button>
                </div>
              );
            })}
            {guildList?.guilds.length === 0 && (
              <div className="text-center py-8">
                <Users size={32} className="text-muted-foreground/30 mx-auto mb-2" />
                <p className="font-mono text-xs text-muted-foreground">No syndicates found. Be the first to create one.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 p-4 rounded-lg bg-card/30 border border-border/20">
            <div>
              <label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">SYNDICATE NAME</label>
              <input
                value={createForm.name}
                onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                maxLength={32}
                placeholder="Enter syndicate name..."
                className="w-full px-3 py-2 rounded-md bg-card/40 border border-border/30 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">TAG (2-5 CHARS, UPPERCASE)</label>
              <input
                value={createForm.tag}
                onChange={e => setCreateForm(f => ({ ...f, tag: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5) }))}
                maxLength={5}
                placeholder="TAG"
                className="w-full px-3 py-2 rounded-md bg-card/40 border border-border/30 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">FACTION ALIGNMENT</label>
              <div className="flex gap-2">
                {(["empire", "insurgency", "neutral"] as const).map(f => {
                  const fs = FACTION_STYLE[f];
                  return (
                    <button
                      key={f}
                      onClick={() => setCreateForm(form => ({ ...form, faction: f }))}
                      className={`flex-1 py-2 rounded-md font-mono text-xs tracking-wider transition-all ${
                        createForm.faction === f
                          ? `${fs.bg} border ${fs.border} ${fs.color}`
                          : "bg-card/30 border border-border/20 text-muted-foreground"
                      }`}
                    >
                      {f.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground tracking-wider block mb-1">DESCRIPTION</label>
              <textarea
                value={createForm.description}
                onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))}
                maxLength={500}
                rows={3}
                placeholder="Describe your syndicate..."
                className="w-full px-3 py-2 rounded-md bg-card/40 border border-border/30 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 resize-none"
              />
            </div>
            <button
              onClick={() => createMut.mutate(createForm)}
              disabled={!createForm.name || !createForm.tag || createMut.isPending}
              className="w-full py-2.5 rounded-md bg-primary/10 border border-primary/40 text-primary font-mono text-sm font-bold tracking-wider hover:bg-primary/20 transition-all disabled:opacity-50"
            >
              {createMut.isPending ? <Loader2 size={16} className="animate-spin mx-auto" /> : "ESTABLISH SYNDICATE"}
            </button>
            {createMut.error && (
              <p className="font-mono text-xs text-destructive">{createMut.error.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ GUILD OVERVIEW ═══ */
function GuildOverview({ guild, membership, onRefetch }: { guild: any; membership: any; onRefetch: () => void }) {
  const leaveMut = trpc.guild.leave.useMutation({ onSuccess: onRefetch });
  const fs = FACTION_STYLE[guild.faction] || FACTION_STYLE.neutral;
  const isLeaderOrOfficer = membership.role === "leader" || membership.role === "officer";
  const { data: myRecruitPost, refetch: refetchRecruit } = trpc.guild.getMyRecruitmentPost.useQuery();
  const setRecruitMut = trpc.guild.setRecruitmentPost.useMutation({ onSuccess: () => refetchRecruit() });
  const deleteRecruitMut = trpc.guild.deleteRecruitmentPost.useMutation({ onSuccess: () => refetchRecruit() });
  const [recruitForm, setRecruitForm] = useState({
    description: myRecruitPost?.description || "",
    requirements: myRecruitPost?.requirements || "",
    minLevel: myRecruitPost?.minLevel || 1,
  });
  useEffect(() => {
    if (myRecruitPost) {
      setRecruitForm({
        description: myRecruitPost.description || "",
        requirements: myRecruitPost.requirements || "",
        minLevel: myRecruitPost.minLevel || 1,
      });
    }
  }, [myRecruitPost]);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "LEVEL", value: guild.level, icon: Star, color: "text-amber-400" },
          { label: "MEMBERS", value: `${guild.memberCount}/${guild.maxMembers}`, icon: Users, color: "text-cyan-400" },
          { label: "WAR POINTS", value: guild.totalWarPoints.toLocaleString(), icon: Swords, color: "text-red-400" },
          { label: "XP", value: guild.xp.toLocaleString(), icon: Trophy, color: "text-purple-400" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-3 rounded-lg bg-card/30 border border-border/20">
              <Icon size={16} className={`${s.color} mb-1`} />
              <p className="font-display text-lg font-bold">{s.value}</p>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Description */}
      {guild.description && (
        <div className="p-4 rounded-lg bg-card/30 border border-border/20">
          <h3 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground mb-2">MISSION BRIEF</h3>
          <p className="font-mono text-sm text-foreground/80 leading-relaxed">{guild.description}</p>
        </div>
      )}

      {/* Your Role */}
      <div className="p-4 rounded-lg bg-card/30 border border-border/20">
        <h3 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground mb-3">YOUR STATUS</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(() => { const Icon = ROLE_ICONS[membership.role] || Users; return <Icon size={18} className="text-primary" />; })()}
            <div>
              <p className="font-mono text-sm font-semibold capitalize">{membership.role}</p>
              <p className="font-mono text-[10px] text-muted-foreground">
                Contributed {membership.contributionXp.toLocaleString()} XP
              </p>
            </div>
          </div>
          <button
            onClick={() => { if (confirm("Are you sure you want to leave this Syndicate?")) leaveMut.mutate(); }}
            className="px-3 py-1.5 rounded-md bg-destructive/10 border border-destructive/30 text-destructive font-mono text-xs hover:bg-destructive/20 transition-all"
          >
            <LogOut size={12} className="inline mr-1" /> LEAVE
          </button>
        </div>
      </div>

      {/* Recruitment Management (leaders/officers only) */}
      {isLeaderOrOfficer && (
        <div className="p-4 rounded-lg bg-card/30 border border-border/20 space-y-3">
          <h3 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <UserPlus size={13} className="text-primary" /> RECRUITMENT POST
          </h3>
          {myRecruitPost ? (
            <div className="space-y-2">
              <p className="font-mono text-xs text-foreground/80">{myRecruitPost.description}</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                  myRecruitPost.status === "open" ? "bg-green-400/10 text-green-400 border border-green-400/20" : "bg-red-400/10 text-red-400 border border-red-400/20"
                }`}>{myRecruitPost.status.toUpperCase()}</span>
                <span className="font-mono text-[10px] text-muted-foreground">MIN LVL {myRecruitPost.minLevel}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => deleteRecruitMut.mutate()}
                  className="px-3 py-1 rounded bg-destructive/10 border border-destructive/30 text-destructive font-mono text-[10px] hover:bg-destructive/20"
                >
                  DELETE POST
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={recruitForm.description}
                onChange={e => setRecruitForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe what your syndicate is looking for..."
                rows={3}
                className="w-full px-3 py-2 rounded-md bg-card/40 border border-border/30 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 resize-none"
              />
              <div className="flex gap-2">
                <input
                  value={recruitForm.requirements}
                  onChange={e => setRecruitForm(f => ({ ...f, requirements: e.target.value }))}
                  placeholder="Requirements (optional)"
                  className="flex-1 px-3 py-1.5 rounded-md bg-card/40 border border-border/30 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
                />
                <input
                  type="number"
                  value={recruitForm.minLevel}
                  onChange={e => setRecruitForm(f => ({ ...f, minLevel: Number(e.target.value) || 1 }))}
                  min={1} max={50}
                  className="w-20 px-2 py-1.5 rounded-md bg-card/40 border border-border/30 font-mono text-xs text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
              <button
                onClick={() => setRecruitMut.mutate({ description: recruitForm.description, requirements: recruitForm.requirements, minLevel: recruitForm.minLevel })}
                disabled={!recruitForm.description || recruitForm.description.length < 10 || setRecruitMut.isPending}
                className="w-full py-2 rounded-md bg-primary/10 border border-primary/40 text-primary font-mono text-xs font-bold tracking-wider hover:bg-primary/20 transition-all disabled:opacity-50"
              >
                {setRecruitMut.isPending ? "POSTING..." : "POST RECRUITMENT"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Faction Info */}
      <div className={`p-4 rounded-lg ${fs.bg} border ${fs.border}`}>
        <h3 className={`font-display text-xs font-bold tracking-[0.2em] ${fs.color} mb-2`}>
          <Flag size={12} className="inline mr-1" /> FACTION: {guild.faction.toUpperCase()}
        </h3>
        <p className="font-mono text-xs text-foreground/70">
          {guild.faction === "empire"
            ? "Aligned with the Panopticon. Order through surveillance. Control through information."
            : guild.faction === "insurgency"
            ? "Aligned with the Insurgency. Freedom through disruption. Truth through exposure."
            : "Unaligned. Operating in the shadows between factions, serving only your own interests."}
        </p>
      </div>
    </div>
  );
}

/* ═══ GUILD ROSTER ═══ */
function GuildRoster({ guildId, myRole }: { guildId: number; myRole: string }) {
  const { data: guildData } = trpc.guild.get.useQuery({ guildId });
  const promoteMut = trpc.guild.setMemberRole.useMutation();
  const kickMut = trpc.guild.kickMember.useMutation();

  const members = guildData?.members || [];

  return (
    <div className="space-y-3">
      <h3 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground flex items-center gap-2">
        <Users size={13} className="text-primary" /> OPERATIVES ({members.length})
      </h3>
      {members.map((m, i) => {
        const Icon = ROLE_ICONS[m.role] || Users;
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-border/20"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                m.role === "leader" ? "bg-amber-400/10 border border-amber-400/30" :
                m.role === "officer" ? "bg-cyan-400/10 border border-cyan-400/30" :
                "bg-secondary/30 border border-border/20"
              }`}>
                <Icon size={14} className={
                  m.role === "leader" ? "text-amber-400" :
                  m.role === "officer" ? "text-cyan-400" :
                  "text-muted-foreground"
                } />
              </div>
              <div>
                <p className="font-mono text-sm font-semibold">{m.userName}</p>
                <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                  <span className="capitalize">{m.role}</span>
                  <span>•</span>
                  <span>{m.contributionXp.toLocaleString()} XP</span>
                  <span>•</span>
                  <span><Swords size={9} className="inline" /> {m.warPoints}</span>
                </div>
              </div>
            </div>
            {myRole === "leader" && m.role !== "leader" && (
              <div className="flex gap-1">
                <button
                  onClick={() => promoteMut.mutate({
                    memberId: m.id,
                    role: m.role === "officer" ? "member" : "officer",
                  })}
                  className="p-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                  title={m.role === "officer" ? "Demote" : "Promote"}
                >
                  <ArrowUp size={12} className={m.role === "officer" ? "rotate-180" : ""} />
                </button>
                <button
                  onClick={() => { if (confirm(`Kick ${m.userName}?`)) kickMut.mutate({ memberId: m.id }); }}
                  className="p-1.5 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
                  title="Kick"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ═══ GUILD CHAT ═══ */
function GuildChat() {
  const [message, setMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, refetch } = trpc.guild.getChat.useQuery({ limit: 50 });
  const sendMut = trpc.guild.sendMessage.useMutation({
    onSuccess: () => {
      setMessage("");
      refetch();
    },
  });

  // Auto-scroll and poll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(refetch, 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  const reversed = [...(messages || [])].reverse();

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 280px)" }}>
      <h3 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground flex items-center gap-2 mb-3">
        <MessageSquare size={13} className="text-primary" /> SYNDICATE COMMS
      </h3>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3 p-3 rounded-lg bg-card/20 border border-border/10">
        {reversed.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare size={24} className="text-muted-foreground/30 mx-auto mb-2" />
            <p className="font-mono text-xs text-muted-foreground">No messages yet. Start the conversation.</p>
          </div>
        )}
        {reversed.map(msg => (
          <div
            key={msg.id}
            className={`${msg.messageType === "system" ? "text-center" : ""}`}
          >
            {msg.messageType === "system" ? (
              <p className="font-mono text-[10px] text-muted-foreground/60 italic py-1">
                {msg.message}
              </p>
            ) : (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-md bg-secondary/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Users size={10} className="text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-foreground">{msg.userName}</span>
                    <span className="font-mono text-[9px] text-muted-foreground/50">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-foreground/80 mt-0.5">{msg.message}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && message.trim()) {
              sendMut.mutate({ message: message.trim() });
            }
          }}
          placeholder="Type a message..."
          maxLength={500}
          className="flex-1 px-3 py-2 rounded-md bg-card/40 border border-border/30 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
        />
        <button
          onClick={() => { if (message.trim()) sendMut.mutate({ message: message.trim() }); }}
          disabled={!message.trim() || sendMut.isPending}
          className="px-3 py-2 rounded-md bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20 transition-all disabled:opacity-50"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}

/* ═══ GUILD TREASURY ═══ */
function GuildTreasury({ guild }: { guild: any }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<"dream" | "credits">("dream");
  const donateMut = trpc.guild.donate.useMutation();

  return (
    <div className="space-y-6">
      <h3 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground flex items-center gap-2">
        <Gem size={13} className="text-primary" /> SYNDICATE TREASURY
      </h3>

      {/* Treasury Balances */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-lg bg-purple-400/5 border border-purple-400/20">
          <Gem size={20} className="text-purple-400 mb-2" />
          <p className="font-display text-2xl font-bold text-purple-400">{guild.treasuryDream.toLocaleString()}</p>
          <p className="font-mono text-[10px] text-muted-foreground tracking-wider">DREAM TOKENS</p>
        </div>
        <div className="p-4 rounded-lg bg-amber-400/5 border border-amber-400/20">
          <Coins size={20} className="text-amber-400 mb-2" />
          <p className="font-display text-2xl font-bold text-amber-400">{guild.treasuryCredits.toLocaleString()}</p>
          <p className="font-mono text-[10px] text-muted-foreground tracking-wider">CREDITS</p>
        </div>
      </div>

      {/* Donate */}
      <div className="p-4 rounded-lg bg-card/30 border border-border/20 space-y-3">
        <h4 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground">CONTRIBUTE TO TREASURY</h4>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrency("dream")}
            className={`flex-1 py-2 rounded-md font-mono text-xs transition-all ${
              currency === "dream" ? "bg-purple-400/10 border border-purple-400/30 text-purple-400" : "bg-card/30 border border-border/20 text-muted-foreground"
            }`}
          >
            DREAM
          </button>
          <button
            onClick={() => setCurrency("credits")}
            className={`flex-1 py-2 rounded-md font-mono text-xs transition-all ${
              currency === "credits" ? "bg-amber-400/10 border border-amber-400/30 text-amber-400" : "bg-card/30 border border-border/20 text-muted-foreground"
            }`}
          >
            CREDITS
          </button>
        </div>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Amount..."
          min={1}
          className="w-full px-3 py-2 rounded-md bg-card/40 border border-border/30 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
        />
        <button
          onClick={() => {
            const num = parseInt(amount);
            if (num > 0) {
              donateMut.mutate({ amount: num, currency });
              setAmount("");
            }
          }}
          disabled={!amount || parseInt(amount) <= 0 || donateMut.isPending}
          className="w-full py-2 rounded-md bg-primary/10 border border-primary/40 text-primary font-mono text-xs font-bold tracking-wider hover:bg-primary/20 transition-all disabled:opacity-50"
        >
          {donateMut.isPending ? <Loader2 size={14} className="animate-spin mx-auto" /> : "DONATE"}
        </button>
        {donateMut.data?.xpGain && (
          <p className="font-mono text-xs text-green-400 text-center">+{donateMut.data.xpGain} Guild XP earned!</p>
        )}
      </div>
    </div>
  );
}

/* ═══ GUILD TERRITORY MAP — Visual territory control display ═══ */
function GuildTerritoryMap() {
  const { data, isLoading } = trpc.guildWars.getTerritoryMap.useQuery();
  const [selectedTerritory, setSelectedTerritory] = useState<number | null>(null);

  const FACTION_MAP: Record<string, { color: string; glow: string; label: string; icon: typeof Shield }> = {
    empire: { color: "#ef4444", glow: "rgba(239,68,68,0.4)", label: "EMPIRE", icon: Crown },
    insurgency: { color: "#33e2e6", glow: "rgba(51,226,230,0.4)", label: "INSURGENCY", icon: Shield },
    neutral: { color: "#ffb74d", glow: "rgba(255,183,77,0.4)", label: "NEUTRAL", icon: Flag },
  };

  const TERRITORY_POSITIONS = [
    { x: 50, y: 20 },   // Panopticon Core — center top
    { x: 15, y: 35 },   // Inception Ark Docks — left
    { x: 85, y: 35 },   // Oracle's Sanctum — right
    { x: 25, y: 60 },   // Necromancer's Crypt — lower left
    { x: 75, y: 60 },   // Source Nexus — lower right
    { x: 50, y: 50 },   // Architect's Workshop — center
    { x: 10, y: 80 },   // Enigma Vault — far left bottom
    { x: 90, y: 80 },   // Iron Lion Citadel — far right bottom
  ];

  const BONUS_ICONS: Record<string, string> = {
    dream_boost: "💎",
    trade_boost: "📊",
    card_boost: "🃏",
    fight_boost: "⚔️",
    xp_boost: "⭐",
    craft_boost: "🔧",
    loot_boost: "🎁",
    defense_boost: "🛡️",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!data) return null;

  const selected = selectedTerritory !== null ? data.territories[selectedTerritory] : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-sm font-bold tracking-[0.2em] flex items-center gap-2">
            <Swords size={15} className="text-primary" />
            TERRITORY CONTROL
          </h2>
          <p className="font-mono text-[10px] text-muted-foreground mt-1">
            {data.activeWarCount} active war{data.activeWarCount !== 1 ? "s" : ""} •{" "}
            {data.userFaction ? (
              <span className={data.userFaction === "empire" ? "text-red-400" : data.userFaction === "insurgency" ? "text-cyan-400" : "text-amber-400"}>
                Your faction: {data.userFaction.toUpperCase()}
              </span>
            ) : (
              <span className="text-muted-foreground/50">No faction</span>
            )}
          </p>
        </div>
      </div>

      {/* Territory Map — SVG hex grid */}
      <div className="relative rounded-lg border border-border/30 overflow-hidden" style={{
        background: "linear-gradient(180deg, var(--bg-void) 0%, var(--bg-depth) 100%)",
        minHeight: "320px",
      }}>
        {/* Grid background */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle, rgba(51,226,230,0.3) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />

        {/* Connection lines between territories */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Draw connection lines */}
          {[
            [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], // All connect to Architect's Workshop (center)
            [0, 1], [0, 2], // Panopticon to docks and sanctum
            [1, 3], [2, 4], // Docks to crypt, sanctum to nexus
            [3, 6], [4, 7], // Crypt to vault, nexus to citadel
          ].map(([a, b], i) => (
            <line
              key={i}
              x1={`${TERRITORY_POSITIONS[a].x}%`}
              y1={`${TERRITORY_POSITIONS[a].y}%`}
              x2={`${TERRITORY_POSITIONS[b].x}%`}
              y2={`${TERRITORY_POSITIONS[b].y}%`}
              stroke="rgba(51,226,230,0.1)"
              strokeWidth="0.3"
              strokeDasharray="2,2"
            />
          ))}
        </svg>

        {/* Territory nodes */}
        {data.territories.map((territory, i) => {
          const pos = TERRITORY_POSITIONS[i];
          const factionStyle = territory.controller ? FACTION_MAP[territory.controller] : null;
          const isContested = territory.contested;
          const isSelected = selectedTerritory === i;
          const isUserFaction = territory.controller === data.userFaction;

          return (
            <button
              key={i}
              onClick={() => setSelectedTerritory(isSelected ? null : i)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {/* Glow ring for contested */}
              {isContested && (
                <div className="absolute inset-0 -m-3 rounded-full animate-pulse" style={{
                  background: "radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)",
                }} />
              )}

              {/* Territory node */}
              <div
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex flex-col items-center justify-center border-2 transition-all ${
                  isSelected ? "scale-125 z-10" : "hover:scale-110"
                }`}
                style={{
                  background: isContested
                    ? "rgba(168,85,247,0.15)"
                    : factionStyle
                    ? `${factionStyle.color}22`
                    : "rgba(255,255,255,0.05)",
                  borderColor: isContested
                    ? "rgba(168,85,247,0.5)"
                    : factionStyle
                    ? `${factionStyle.color}66`
                    : "rgba(255,255,255,0.15)",
                  boxShadow: isSelected
                    ? `0 0 20px ${isContested ? "rgba(168,85,247,0.4)" : factionStyle?.glow || "rgba(51,226,230,0.2)"}`
                    : "none",
                }}
              >
                <span className="text-lg">{BONUS_ICONS[territory.bonus] || "🏛️"}</span>
                {isContested && (
                  <Swords size={10} className="text-purple-400 absolute -top-1 -right-1" />
                )}
                {isUserFaction && !isContested && (
                  <Star size={8} className="text-amber-400 absolute -top-1 -right-1 fill-amber-400" />
                )}
              </div>

              {/* Territory name label */}
              <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className={`font-mono text-[8px] sm:text-[9px] tracking-wider ${
                  isContested ? "text-purple-400" : factionStyle ? `text-[${factionStyle.color}]` : "text-muted-foreground/50"
                }`}>
                  {territory.name.replace("The ", "").split("'s")[0].toUpperCase().slice(0, 12)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Territory Detail Panel */}
      <AnimatePresence>
        {selected && selectedTerritory !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-lg border border-border/30 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, var(--bg-void) 0%, var(--bg-spotlight) 100%)",
            }}
          >
            {/* Territory Header */}
            <div className="px-4 py-3 border-b border-border/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{BONUS_ICONS[selected.bonus]}</span>
                <div>
                  <h3 className="font-display text-sm font-bold tracking-wider">{selected.name}</h3>
                  <p className="font-mono text-[10px] text-muted-foreground">{selected.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTerritory(null)}
                className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
              >
                <X size={14} className="text-muted-foreground" />
              </button>
            </div>

            {/* Control Status */}
            <div className="px-4 py-3">
              {selected.contested && selected.activeWar ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Swords size={14} className="text-purple-400" />
                    <span className="font-mono text-xs text-purple-400 tracking-wider">CONTESTED — WAR IN PROGRESS</span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">{selected.activeWar.name}</p>

                  {/* Score bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className={selected.activeWar.factionA === "empire" ? "text-red-400" : "text-cyan-400"}>
                        {selected.activeWar.factionA.toUpperCase()} — {selected.activeWar.scoreA}
                      </span>
                      <span className={selected.activeWar.factionB === "empire" ? "text-red-400" : "text-cyan-400"}>
                        {selected.activeWar.scoreB} — {selected.activeWar.factionB.toUpperCase()}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden flex">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${selected.controlScore}%`,
                          background: selected.activeWar.factionA === "empire"
                            ? "linear-gradient(90deg, #ef4444, #ef444488)"
                            : "linear-gradient(90deg, #33e2e6, #33e2e688)",
                        }}
                      />
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${100 - selected.controlScore}%`,
                          background: selected.activeWar.factionB === "empire"
                            ? "linear-gradient(90deg, #ef444488, #ef4444)"
                            : "linear-gradient(90deg, #33e2e688, #33e2e6)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Time remaining */}
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                    <Clock size={10} />
                    <span>Ends: {new Date(selected.activeWar.endsAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ) : selected.controller ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Crown size={14} className={selected.controller === "empire" ? "text-red-400" : "text-cyan-400"} />
                    <span className={`font-mono text-xs tracking-wider ${
                      selected.controller === "empire" ? "text-red-400" : "text-cyan-400"
                    }`}>
                      CONTROLLED BY {selected.controller.toUpperCase()}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Bonus active: +{selected.bonusValue}% {selected.bonus.replace("_", " ")}
                  </p>
                  {selected.lastWar && (
                    <p className="font-mono text-[9px] text-muted-foreground/50">
                      Won {new Date(selected.lastWar.endedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Flag size={14} className="text-muted-foreground/50" />
                  <span className="font-mono text-xs text-muted-foreground/50 tracking-wider">UNCLAIMED TERRITORY</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Territory Legend */}
      <div className="flex flex-wrap gap-3 font-mono text-[9px] text-muted-foreground/60">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400" /> Empire
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-cyan-400" /> Insurgency
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" /> Contested
        </span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-white/20" /> Unclaimed
        </span>
        <span className="flex items-center gap-1">
          <Star size={8} className="text-amber-400 fill-amber-400" /> Your faction
        </span>
      </div>
    </div>
  );
}
