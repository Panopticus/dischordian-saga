/* ═══════════════════════════════════════════════════════
   ADMIN PANEL — Content management for site owner
   Users, Cards, Content Rewards management
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Users, Layers, Gift, BarChart3, Search,
  ChevronLeft, ChevronRight, Edit2, Check, X,
  Crown, UserCog, ArrowLeft, Plus, Trash2, Eye, Compass, Lock, Unlock, Rocket,
  BookOpen, Music, MapPin, Swords, Lightbulb, Save
} from "lucide-react";
import { toast } from "sonner";

type Tab = "dashboard" | "users" | "cards" | "rewards" | "discovery" | "content";

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <Shield size={48} className="text-destructive mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold tracking-wider mb-2">ACCESS DENIED</h1>
          <p className="font-mono text-sm text-muted-foreground mb-4">Admin clearance required.</p>
          <Link href="/" className="text-primary font-mono text-sm hover:underline">← Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Shield }[] = [
    { id: "dashboard", label: "OVERVIEW", icon: BarChart3 },
    { id: "users", label: "USERS", icon: Users },
    { id: "cards", label: "CARDS", icon: Layers },
    { id: "rewards", label: "REWARDS", icon: Gift },
    { id: "discovery", label: "DISCOVERY", icon: Compass },
    { id: "content", label: "CONTENT", icon: BookOpen },
  ];

  return (
    <div className="animate-fade-in pb-8">
      <div className="px-4 sm:px-6 pt-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-destructive" />
            <h1 className="font-display text-lg font-bold tracking-[0.15em]">ADMIN PANEL</h1>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground/50 ml-auto">
            {user?.name} // ADMIN
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 border-b border-border/30 pb-px">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 font-mono text-xs tracking-wider transition-all border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" && <DashboardTab />}
            {activeTab === "users" && <UsersTab />}
            {activeTab === "cards" && <CardsTab />}
            {activeTab === "rewards" && <RewardsTab />}
            {activeTab === "discovery" && <DiscoveryTab />}
            {activeTab === "content" && <ContentTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ═══ DASHBOARD TAB ═══
function DashboardTab() {
  const { data: stats } = trpc.admin.dashboardStats.useQuery();

  const statCards = [
    { label: "TOTAL USERS", value: stats?.totalUsers ?? 0, icon: Users, color: "text-primary", bg: "bg-primary/5", border: "border-primary/20" },
    { label: "TOTAL CARDS", value: stats?.totalCards ?? 0, icon: Layers, color: "text-accent", bg: "bg-accent/5", border: "border-accent/20" },
    { label: "ACTIVE PLAYERS", value: stats?.activeGamePlayers ?? 0, icon: Crown, color: "text-chart-4", bg: "bg-chart-4/5", border: "border-chart-4/20" },
    { label: "PARTICIPATIONS", value: stats?.contentParticipations ?? 0, icon: Gift, color: "text-destructive", bg: "bg-destructive/5", border: "border-destructive/20" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`rounded-lg border ${s.border} ${s.bg} p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className={s.color} />
                <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{s.label}</span>
              </div>
              <p className="font-display text-2xl font-bold">{s.value}</p>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg border border-border/30 bg-card/30 p-5">
        <h3 className="font-display text-xs font-bold tracking-[0.2em] text-primary mb-3">QUICK ACTIONS</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Link href="/admin" onClick={() => {}} className="flex items-center gap-2 p-3 rounded-md bg-secondary/30 border border-border/20 hover:border-primary/30 transition-all font-mono text-xs">
            <UserCog size={14} className="text-primary" /> Manage Users
          </Link>
          <Link href="/admin" onClick={() => {}} className="flex items-center gap-2 p-3 rounded-md bg-secondary/30 border border-border/20 hover:border-accent/30 transition-all font-mono text-xs">
            <Layers size={14} className="text-accent" /> Manage Cards
          </Link>
        </div>
      </div>
    </div>
  );
}

// ═══ USERS TAB ═══
function UsersTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = trpc.admin.listUsers.useQuery({ page, limit: 25, search: search || undefined });
  const updateRole = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => { toast.success("Role updated"); },
    onError: (e) => { toast.error(e.message); },
  });
  const utils = trpc.useUtils();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md bg-secondary/30 border border-border/30 text-sm font-mono focus:outline-none focus:border-primary/50"
          />
        </div>
        <span className="font-mono text-xs text-muted-foreground">{data?.total ?? 0} users</span>
      </div>

      <div className="rounded-lg border border-border/30 overflow-hidden">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="bg-secondary/30 border-b border-border/30">
              <th className="text-left p-3 text-muted-foreground tracking-wider">NAME</th>
              <th className="text-left p-3 text-muted-foreground tracking-wider hidden sm:table-cell">EMAIL</th>
              <th className="text-left p-3 text-muted-foreground tracking-wider">ROLE</th>
              <th className="text-left p-3 text-muted-foreground tracking-wider hidden md:table-cell">JOINED</th>
              <th className="text-right p-3 text-muted-foreground tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {data?.users.map(u => (
              <tr key={u.id} className="border-b border-border/10 hover:bg-secondary/10">
                <td className="p-3">{u.name || "—"}</td>
                <td className="p-3 text-muted-foreground hidden sm:table-cell">{u.email || "—"}</td>
                <td className="p-3">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                    u.role === "admin" ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-primary/10 text-primary border border-primary/20"
                  }`}>
                    {u.role?.toUpperCase() || "USER"}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => {
                      const newRole = u.role === "admin" ? "user" : "admin";
                      updateRole.mutate({ userId: u.id, role: newRole }, {
                        onSuccess: () => utils.admin.listUsers.invalidate(),
                      });
                    }}
                    className="px-2 py-1 rounded text-[10px] bg-secondary/50 border border-border/30 hover:border-primary/30 transition-all"
                    title={u.role === "admin" ? "Demote to user" : "Promote to admin"}
                  >
                    {u.role === "admin" ? "DEMOTE" : "PROMOTE"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.total > 25 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded bg-secondary/30 border border-border/30 disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="font-mono text-xs text-muted-foreground">Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page * 25 >= data.total}
            className="p-1.5 rounded bg-secondary/30 border border-border/30 disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ═══ CARDS TAB ═══
function CardsTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const { data, isLoading } = trpc.admin.listCards.useQuery({ page, limit: 25, search: search || undefined });
  const updateCard = trpc.admin.updateCard.useMutation({
    onSuccess: () => { toast.success("Card updated"); setEditingCard(null); },
    onError: (e) => { toast.error(e.message); },
  });
  const utils = trpc.useUtils();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search cards..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md bg-secondary/30 border border-border/30 text-sm font-mono focus:outline-none focus:border-primary/50"
          />
        </div>
        <span className="font-mono text-xs text-muted-foreground">{data?.total ?? 0} cards</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {data?.cards.map(card => (
          <div key={card.cardId} className="rounded-lg border border-border/30 bg-card/30 p-3 flex items-center gap-3">
            {card.imageUrl && (
              <img src={card.imageUrl} alt={card.name} className="w-10 h-10 rounded object-cover shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs font-semibold truncate">{card.name}</p>
                <span className={`px-1 py-0.5 rounded text-[9px] font-mono ${
                  card.rarity === "legendary" ? "bg-amber-500/10 text-amber-400" :
                  card.rarity === "epic" ? "bg-purple-500/10 text-purple-400" :
                  card.rarity === "rare" ? "bg-blue-500/10 text-blue-400" :
                  "bg-secondary text-muted-foreground"
                }`}>
                  {card.rarity?.toUpperCase()}
                </span>
                <span className="text-[9px] font-mono text-muted-foreground/50">{card.cardType}</span>
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{card.abilityText || card.flavorText || "—"}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-[10px] text-muted-foreground">P:{card.power} H:{card.health} C:{card.cost}</span>
              <button
                onClick={() => {
                  const newActive = card.isActive === 1 ? 0 : 1;
                  updateCard.mutate({ cardId: card.cardId, isActive: newActive }, {
                    onSuccess: () => utils.admin.listCards.invalidate(),
                  });
                }}
                className={`px-2 py-1 rounded text-[10px] border transition-all ${
                  card.isActive ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
                }`}
              >
                {card.isActive ? "ACTIVE" : "DISABLED"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {data && data.total > 25 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded bg-secondary/30 border border-border/30 disabled:opacity-30">
            <ChevronLeft size={14} />
          </button>
          <span className="font-mono text-xs text-muted-foreground">Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page * 25 >= data.total} className="p-1.5 rounded bg-secondary/30 border border-border/30 disabled:opacity-30">
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ═══ REWARDS TAB ═══
function RewardsTab() {
  const { data: rewards, isLoading } = trpc.admin.listContentRewards.useQuery();
  const { data: rewardInfo } = trpc.contentReward.getRewardInfo.useQuery();
  const createReward = trpc.admin.createContentReward.useMutation({
    onSuccess: () => { toast.success("Reward created"); setShowForm(false); },
    onError: (e) => { toast.error(e.message); },
  });
  const deleteReward = trpc.admin.deleteContentReward.useMutation({
    onSuccess: () => { toast.success("Reward deleted"); },
    onError: (e) => { toast.error(e.message); },
  });
  const utils = trpc.useUtils();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    contentType: "episode",
    contentId: "",
    rewardType: "card",
    rewardValue: "",
    quantity: 1,
    description: "",
  });

  return (
    <div className="space-y-4">
      {/* Built-in reward definitions */}
      <div className="rounded-lg border border-border/30 bg-card/30 p-4">
        <h3 className="font-display text-xs font-bold tracking-[0.2em] text-primary mb-3">BUILT-IN CONTENT REWARDS</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {rewardInfo && Object.entries(rewardInfo.rewards).map(([type, def]) => (
            <div key={type} className="rounded-md border border-border/20 bg-secondary/20 p-3">
              <p className="font-mono text-xs font-semibold text-foreground mb-1">{type.replace(/_/g, " ").toUpperCase()}</p>
              <div className="space-y-0.5 text-[10px] font-mono text-muted-foreground">
                <p>Dream: +{def.dreamTokens}</p>
                <p>XP: +{def.xp}</p>
                {def.cardPool && <p>Card Pool: {def.cardPool}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom rewards */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xs font-bold tracking-[0.2em] text-accent">CUSTOM REWARDS</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/30 text-primary text-xs font-mono hover:bg-primary/20 transition-all"
        >
          <Plus size={12} /> ADD REWARD
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">CONTENT TYPE</label>
              <select
                value={form.contentType}
                onChange={e => setForm(f => ({ ...f, contentType: e.target.value }))}
                className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono"
              >
                <option value="episode">Episode</option>
                <option value="conexus_game">CoNexus Game</option>
                <option value="quiz">Quiz</option>
                <option value="album">Album</option>
                <option value="milestone">Milestone</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">CONTENT ID</label>
              <input
                value={form.contentId}
                onChange={e => setForm(f => ({ ...f, contentId: e.target.value }))}
                placeholder="e.g., ep-001 or *"
                className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">REWARD TYPE</label>
              <select
                value={form.rewardType}
                onChange={e => setForm(f => ({ ...f, rewardType: e.target.value }))}
                className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono"
              >
                <option value="card">Card</option>
                <option value="dream">Dream Tokens</option>
                <option value="xp">XP</option>
                <option value="booster">Booster Pack</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">REWARD VALUE</label>
              <input
                value={form.rewardValue}
                onChange={e => setForm(f => ({ ...f, rewardValue: e.target.value }))}
                placeholder="Card ID or amount"
                className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                createReward.mutate(form, {
                  onSuccess: () => utils.admin.listContentRewards.invalidate(),
                });
              }}
              className="px-3 py-1.5 rounded bg-primary/20 border border-primary/40 text-primary text-xs font-mono hover:bg-primary/30"
            >
              <Check size={12} className="inline mr-1" /> CREATE
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 rounded bg-secondary/30 border border-border/30 text-muted-foreground text-xs font-mono"
            >
              CANCEL
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        {rewards?.map(r => (
          <div key={r.id} className="rounded-md border border-border/20 bg-card/30 p-3 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs">
                <span className="text-primary">{r.contentType}</span>
                <span className="text-muted-foreground/50"> → </span>
                <span className="text-accent">{r.rewardType}: {r.rewardValue}</span>
                <span className="text-muted-foreground/50"> x{r.quantity}</span>
              </p>
              {r.description && <p className="text-[10px] text-muted-foreground">{r.description}</p>}
            </div>
            <button
              onClick={() => deleteReward.mutate({ id: r.id }, {
                onSuccess: () => utils.admin.listContentRewards.invalidate(),
              })}
              className="p-1.5 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {(!rewards || rewards.length === 0) && (
          <p className="font-mono text-xs text-muted-foreground/50 text-center py-4">No custom rewards configured yet.</p>
        )}
      </div>
    </div>
  );
}

// ═══ DISCOVERY TAB ═══
const ROOM_FEATURE_MAP: Record<string, string[]> = {
  bridge: ["command_bridge", "ark_console"],
  quarters: ["operative_dossier", "character_sheet", "citizen_id"],
  armory: ["combat_sim", "battle_arena", "pvp_arena"],
  lab: ["research_lab", "crafting"],
  hangar: ["trade_empire"],
  observation: ["conspiracy_board", "character_timeline", "era_timeline", "codex"],
  trophy: ["trophy_room", "card_gallery"],
  training: ["card_game", "deck_builder", "lore_quiz"],
  market: ["requisitions", "potentials"],
  comms: ["watch_show", "discography", "saga_timeline"],
  cargo: ["database"],
  medbay: ["mission_briefing"],
  engine: ["leaderboard"],
  brig: ["simulation_hub"],
  secret: ["explore_ark"],
  tradewars: ["trade_empire"],
};

const FEATURE_LABELS: Record<string, string> = {
  command_bridge: "Command Bridge",
  ark_console: "Ark Console",
  watch_show: "Watch the Show",
  discography: "Discography",
  saga_timeline: "Saga Timeline",
  database: "Database Search",
  conspiracy_board: "Conspiracy Board",
  character_timeline: "Character Timeline",
  era_timeline: "Era Timeline",
  codex: "The Codex",
  simulation_hub: "Simulation Hub",
  card_game: "Card Game",
  trade_empire: "Trade Empire",
  combat_sim: "Combat Sim",
  explore_ark: "Explore the Ark",
  lore_quiz: "Lore Quiz",
  battle_arena: "Battle Arena",
  pvp_arena: "PVP Arena",
  card_gallery: "Card Gallery",
  deck_builder: "Deck Builder",
  research_lab: "Research Lab",
  trophy_room: "Trophy Room",
  operative_dossier: "Operative Dossier",
  leaderboard: "Leaderboard",
  citizen_id: "Citizen ID",
  character_sheet: "Character Sheet",
  requisitions: "Requisitions",
  mission_briefing: "Mission Briefing",
  potentials: "The Potentials",
  crafting: "Crafting",
};

function DiscoveryTab() {
  const { data: progress } = trpc.discovery.getProgress.useQuery();
  const unlockAll = trpc.discovery.unlockAll.useMutation({
    onSuccess: () => { toast.success("All features unlocked!"); },
    onError: (e) => { toast.error(e.message); },
  });
  const utils = trpc.useUtils();

  const allFeatures = Array.from(new Set(Object.values(ROOM_FEATURE_MAP).flat()));

  return (
    <div className="space-y-6">
      {/* Discovery Progress Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Compass size={14} className="text-primary" />
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider">FEATURES UNLOCKED</span>
          </div>
          <p className="font-display text-2xl font-bold">{progress?.unlockedFeatures ?? 0} / {progress?.totalFeatures ?? 0}</p>
        </div>
        <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Rocket size={14} className="text-accent" />
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider">ROOMS VISITED</span>
          </div>
          <p className="font-display text-2xl font-bold">{progress?.roomsVisited ?? 0} / {progress?.totalRooms ?? 0}</p>
        </div>
        <div className="rounded-lg border border-chart-4/20 bg-chart-4/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Unlock size={14} className="text-chart-4" />
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider">DISCOVERY %</span>
          </div>
          <p className="font-display text-2xl font-bold">{progress?.percentage ?? 0}%</p>
        </div>
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 flex items-center justify-center">
          <button
            onClick={() => unlockAll.mutate(undefined, {
              onSuccess: () => utils.discovery.getProgress.invalidate(),
            })}
            disabled={unlockAll.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono hover:bg-destructive/20 transition-all disabled:opacity-50"
          >
            <Unlock size={14} />
            {unlockAll.isPending ? "UNLOCKING..." : "UNLOCK ALL"}
          </button>
        </div>
      </div>

      {/* Room → Feature Mapping */}
      <div className="rounded-lg border border-border/30 bg-card/30 p-4">
        <h3 className="font-display text-xs font-bold tracking-[0.2em] text-primary mb-4">ROOM → FEATURE MAPPING</h3>
        <div className="space-y-3">
          {Object.entries(ROOM_FEATURE_MAP).map(([room, features]) => (
            <div key={room} className="rounded-md border border-border/20 bg-secondary/10 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Rocket size={12} className="text-accent" />
                <span className="font-mono text-xs font-bold tracking-wider text-foreground">{room.toUpperCase()}</span>
                <span className="font-mono text-[10px] text-muted-foreground/50">→ {features.length} features</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {features.map(f => (
                  <span
                    key={f}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/5 border border-primary/15 text-primary/80"
                  >
                    {FEATURE_LABELS[f] || f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Features List */}
      <div className="rounded-lg border border-border/30 bg-card/30 p-4">
        <h3 className="font-display text-xs font-bold tracking-[0.2em] text-accent mb-3">ALL DISCOVERABLE FEATURES ({allFeatures.length})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {allFeatures.map(f => (
            <div key={f} className="flex items-center gap-2 p-2 rounded-md bg-secondary/20 border border-border/10">
              <Lock size={10} className="text-muted-foreground/50 shrink-0" />
              <span className="font-mono text-[10px] truncate">{FEATURE_LABELS[f] || f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══ CONTENT TAB ═══
const TYPE_ICONS: Record<string, typeof Users> = {
  character: Users,
  location: MapPin,
  song: Music,
  faction: Swords,
  concept: Lightbulb,
};

const TYPE_COLORS: Record<string, string> = {
  character: "text-primary",
  location: "text-accent",
  song: "text-destructive",
  faction: "text-chart-4",
  concept: "text-chart-5",
};

function ContentTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data, isLoading } = trpc.contentAdmin.listEntries.useQuery({
    page,
    limit: 25,
    search: search || undefined,
    type: typeFilter || undefined,
  });

  const { data: editEntry } = trpc.contentAdmin.getEntry.useQuery(
    { id: editingId! },
    { enabled: !!editingId }
  );

  const createEntry = trpc.contentAdmin.createEntry.useMutation({
    onSuccess: () => { toast.success("Entry created"); setShowCreateForm(false); },
    onError: (e) => { toast.error(e.message); },
  });

  const updateEntry = trpc.contentAdmin.updateEntry.useMutation({
    onSuccess: () => { toast.success("Entry updated"); setEditingId(null); },
    onError: (e) => { toast.error(e.message); },
  });

  const deleteEntry = trpc.contentAdmin.deleteEntry.useMutation({
    onSuccess: () => { toast.success("Entry deleted"); },
    onError: (e) => { toast.error(e.message); },
  });

  const addRelationship = trpc.contentAdmin.addRelationship.useMutation({
    onSuccess: () => { toast.success("Relationship added"); },
    onError: (e: any) => toast.error(e.message),
  });
  const removeRelationship = trpc.contentAdmin.removeRelationship.useMutation({
    onSuccess: () => { toast.success("Relationship removed"); },
    onError: (e: any) => toast.error(e.message),
  });
  const [newRel, setNewRel] = useState({ target: "", type: "ally", description: "" });

  const utils = trpc.useUtils();

  const [createForm, setCreateForm] = useState({
    id: "",
    type: "character" as string,
    name: "",
    bio: "",
    era: "",
    season: "",
    affiliation: "",
    status: "",
    image: "",
    priority: "medium",
    album: "",
    artist: "",
    track_number: 0,
  });

  const [editForm, setEditForm] = useState<Record<string, unknown>>({});

  // When editEntry loads, populate form
  if (editEntry && editingId && Object.keys(editForm).length === 0) {
    setEditForm({ ...editEntry.entry });
  }

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center gap-4 flex-wrap">
        {data?.stats && Object.entries(data.stats).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] text-muted-foreground tracking-wider">{key.replace(/_/g, " ").toUpperCase()}:</span>
            <span className="font-display text-sm font-bold">{val as number}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search entries..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 rounded-md bg-secondary/30 border border-border/30 text-sm font-mono focus:outline-none focus:border-primary/50"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-md bg-secondary/30 border border-border/30 text-xs font-mono"
        >
          <option value="">ALL TYPES</option>
          <option value="character">Characters</option>
          <option value="location">Locations</option>
          <option value="song">Songs</option>
          <option value="faction">Factions</option>
          <option value="concept">Concepts</option>
        </select>
        <span className="font-mono text-xs text-muted-foreground">{data?.total ?? 0} entries</span>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary/10 border border-primary/30 text-primary text-xs font-mono hover:bg-primary/20 transition-all ml-auto"
        >
          <Plus size={12} /> NEW ENTRY
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3"
        >
          <h3 className="font-display text-xs font-bold tracking-[0.2em] text-primary">CREATE NEW ENTRY</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">ID</label>
              <input
                value={createForm.id}
                onChange={e => setCreateForm(f => ({ ...f, id: e.target.value }))}
                placeholder="e.g., char_new_name"
                className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">TYPE</label>
              <select
                value={createForm.type}
                onChange={e => setCreateForm(f => ({ ...f, type: e.target.value }))}
                className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono"
              >
                <option value="character">Character</option>
                <option value="location">Location</option>
                <option value="song">Song</option>
                <option value="faction">Faction</option>
                <option value="concept">Concept</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">NAME</label>
              <input
                value={createForm.name}
                onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Entry name"
                className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">ERA</label>
              <input
                value={createForm.era}
                onChange={e => setCreateForm(f => ({ ...f, era: e.target.value }))}
                placeholder="e.g., Pre-Fall"
                className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">SEASON</label>
              <input
                value={createForm.season}
                onChange={e => setCreateForm(f => ({ ...f, season: e.target.value }))}
                placeholder="e.g., Season 1"
                className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground block mb-1">IMAGE URL</label>
              <input
                value={createForm.image}
                onChange={e => setCreateForm(f => ({ ...f, image: e.target.value }))}
                placeholder="https://..."
                className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono"
              />
            </div>
            {createForm.type === "song" && (
              <>
                <div>
                  <label className="font-mono text-[10px] text-muted-foreground block mb-1">ALBUM</label>
                  <input
                    value={createForm.album}
                    onChange={e => setCreateForm(f => ({ ...f, album: e.target.value }))}
                    placeholder="Album name"
                    className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-muted-foreground block mb-1">TRACK #</label>
                  <input
                    type="number"
                    value={createForm.track_number}
                    onChange={e => setCreateForm(f => ({ ...f, track_number: parseInt(e.target.value) || 0 }))}
                    className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono"
                  />
                </div>
              </>
            )}
          </div>
          <div>
            <label className="font-mono text-[10px] text-muted-foreground block mb-1">BIO / DESCRIPTION</label>
            <textarea
              value={createForm.bio}
              onChange={e => setCreateForm(f => ({ ...f, bio: e.target.value }))}
              rows={3}
              placeholder="Entry description..."
              className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const payload: Record<string, unknown> = {
                  id: createForm.id,
                  type: createForm.type,
                  name: createForm.name,
                  bio: createForm.bio || undefined,
                  era: createForm.era || undefined,
                  season: createForm.season || undefined,
                  image: createForm.image || undefined,
                  priority: createForm.priority,
                };
                if (createForm.type === "song") {
                  payload.album = createForm.album || undefined;
                  payload.track_number = createForm.track_number || undefined;
                  payload.artist = createForm.artist || "Malkia Ukweli & the Panopticon";
                }
                createEntry.mutate(payload as any, {
                  onSuccess: () => utils.contentAdmin.listEntries.invalidate(),
                });
              }}
              disabled={!createForm.id || !createForm.name}
              className="px-3 py-1.5 rounded bg-primary/20 border border-primary/40 text-primary text-xs font-mono hover:bg-primary/30 disabled:opacity-30"
            >
              <Check size={12} className="inline mr-1" /> CREATE
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-3 py-1.5 rounded bg-secondary/30 border border-border/30 text-muted-foreground text-xs font-mono"
            >
              CANCEL
            </button>
          </div>
        </motion.div>
      )}

      {/* Edit Modal */}
      {editingId && editEntry && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-lg border border-accent/30 bg-accent/5 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xs font-bold tracking-[0.2em] text-accent">EDITING: {editEntry.entry.name}</h3>
            <button onClick={() => { setEditingId(null); setEditForm({}); }} className="text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {["name", "era", "season", "affiliation", "status", "image"].map(field => (
              <div key={field}>
                <label className="font-mono text-[10px] text-muted-foreground block mb-1">{field.toUpperCase()}</label>
                <input
                  value={String(editForm[field] ?? "")}
                  onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                  className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="font-mono text-[10px] text-muted-foreground block mb-1">BIO</label>
            <textarea
              value={String(editForm.bio ?? "")}
              onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))}
              rows={3}
              className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono resize-none"
            />
          </div>
          {editEntry.entry.type === "song" && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-mono text-[10px] text-muted-foreground block mb-1">ALBUM</label>
                <input
                  value={String(editForm.album ?? "")}
                  onChange={e => setEditForm(f => ({ ...f, album: e.target.value }))}
                  className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-muted-foreground block mb-1">TRACK #</label>
                <input
                  type="number"
                  value={Number(editForm.track_number ?? 0)}
                  onChange={e => setEditForm(f => ({ ...f, track_number: parseInt(e.target.value) || 0 }))}
                  className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] text-muted-foreground block mb-1">ARTIST</label>
                <input
                  value={String(editForm.artist ?? "")}
                  onChange={e => setEditForm(f => ({ ...f, artist: e.target.value }))}
                  className="w-full px-2 py-1.5 rounded bg-secondary/30 border border-border/30 text-xs font-mono"
                />
              </div>
            </div>
          )}
          {/* Relationships */}
          <div>
            <label className="font-mono text-[10px] text-muted-foreground block mb-1">RELATIONSHIPS ({editEntry.relationships.length})</label>
            <div className="space-y-1 mb-2">
              {editEntry.relationships.map((r: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-primary">{r.source}</span>
                  <span className="text-muted-foreground/50">—{r.type}→</span>
                  <span className="text-accent">{r.target}</span>
                  {r.description && <span className="text-muted-foreground/40">({r.description})</span>}
                  <button
                    onClick={() => removeRelationship.mutate({ source: r.source, target: r.target, type: r.type }, {
                      onSuccess: () => utils.contentAdmin.getEntry.invalidate({ id: editingId! }),
                    })}
                    className="ml-auto p-0.5 rounded hover:bg-destructive/10 text-destructive/50 hover:text-destructive transition-all"
                    title="Remove relationship"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-end gap-1.5">
              <div className="flex-1">
                <label className="font-mono text-[9px] text-muted-foreground/50">TARGET</label>
                <input value={newRel.target} onChange={e => setNewRel(p => ({ ...p, target: e.target.value }))} placeholder="Entity name..." className="w-full px-2 py-1 rounded bg-secondary/30 border border-border/30 text-[10px] font-mono" />
              </div>
              <div className="w-20">
                <label className="font-mono text-[9px] text-muted-foreground/50">TYPE</label>
                <select value={newRel.type} onChange={e => setNewRel(p => ({ ...p, type: e.target.value }))} className="w-full px-1 py-1 rounded bg-secondary/30 border border-border/30 text-[10px] font-mono">
                  {["ally", "enemy", "mentor", "student", "creator", "member", "leader", "rival", "parent", "child", "sibling", "lover", "betrayed", "controls", "serves"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="font-mono text-[9px] text-muted-foreground/50">DESC</label>
                <input value={newRel.description} onChange={e => setNewRel(p => ({ ...p, description: e.target.value }))} placeholder="Optional..." className="w-full px-2 py-1 rounded bg-secondary/30 border border-border/30 text-[10px] font-mono" />
              </div>
              <button
                onClick={() => {
                  if (!newRel.target.trim()) { toast.error("Target required"); return; }
                  addRelationship.mutate({ source: editEntry.entry.name, target: newRel.target, type: newRel.type, description: newRel.description || undefined }, {
                    onSuccess: () => {
                      utils.contentAdmin.getEntry.invalidate({ id: editingId! });
                      setNewRel({ target: "", type: "ally", description: "" });
                    },
                  });
                }}
                className="px-2 py-1 rounded bg-primary/10 border border-primary/30 text-primary text-[10px] font-mono hover:bg-primary/20"
              >
                + ADD
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const updates: Record<string, unknown> = {};
                const original = editEntry.entry;
                for (const key of ["name", "era", "season", "affiliation", "status", "image", "bio", "album", "track_number", "artist"]) {
                  if (editForm[key] !== undefined && editForm[key] !== (original as Record<string, unknown>)[key]) {
                    updates[key] = editForm[key];
                  }
                }
                if (Object.keys(updates).length === 0) {
                  toast.info("No changes to save");
                  return;
                }
                updateEntry.mutate({ id: editingId, updates: updates as any }, {
                  onSuccess: () => {
                    utils.contentAdmin.listEntries.invalidate();
                    utils.contentAdmin.getEntry.invalidate({ id: editingId });
                    setEditForm({});
                  },
                });
              }}
              className="px-3 py-1.5 rounded bg-accent/20 border border-accent/40 text-accent text-xs font-mono hover:bg-accent/30"
            >
              <Save size={12} className="inline mr-1" /> SAVE CHANGES
            </button>
            <button
              onClick={() => { setEditingId(null); setEditForm({}); }}
              className="px-3 py-1.5 rounded bg-secondary/30 border border-border/30 text-muted-foreground text-xs font-mono"
            >
              CANCEL
            </button>
          </div>
        </motion.div>
      )}

      {/* Entry List */}
      <div className="space-y-1.5">
        {data?.entries.map(entry => {
          const TypeIcon = TYPE_ICONS[entry.type] || BookOpen;
          const typeColor = TYPE_COLORS[entry.type] || "text-foreground";
          return (
            <div key={entry.id} className="rounded-lg border border-border/30 bg-card/30 p-3 flex items-center gap-3 hover:border-border/50 transition-all">
              {entry.image ? (
                <img src={entry.image} alt={entry.name} className="w-10 h-10 rounded object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded bg-secondary/30 flex items-center justify-center shrink-0">
                  <TypeIcon size={16} className={typeColor} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs font-semibold truncate">{entry.name}</p>
                  <span className={`px-1 py-0.5 rounded text-[9px] font-mono ${typeColor} bg-current/5 border border-current/15`}>
                    {entry.type.toUpperCase()}
                  </span>
                  {entry.album && <span className="text-[9px] font-mono text-muted-foreground/50">{entry.album}</span>}
                </div>
                <p className="text-[10px] text-muted-foreground truncate">
                  {[entry.era, entry.season, entry.affiliation].filter(Boolean).join(" • ") || entry.id}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => { setEditingId(entry.id); setEditForm({}); }}
                  className="p-1.5 rounded bg-secondary/30 border border-border/20 hover:border-accent/30 transition-all"
                  title="Edit entry"
                >
                  <Edit2 size={11} className="text-accent" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${entry.name}"? This cannot be undone.`)) {
                      deleteEntry.mutate({ id: entry.id }, {
                        onSuccess: () => utils.contentAdmin.listEntries.invalidate(),
                      });
                    }
                  }}
                  className="p-1.5 rounded bg-destructive/5 border border-destructive/15 hover:bg-destructive/10 transition-all"
                  title="Delete entry"
                >
                  <Trash2 size={11} className="text-destructive" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {data && data.total > 25 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded bg-secondary/30 border border-border/30 disabled:opacity-30">
            <ChevronLeft size={14} />
          </button>
          <span className="font-mono text-xs text-muted-foreground">Page {page} of {Math.ceil(data.total / 25)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page * 25 >= data.total} className="p-1.5 rounded bg-secondary/30 border border-border/30 disabled:opacity-30">
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
