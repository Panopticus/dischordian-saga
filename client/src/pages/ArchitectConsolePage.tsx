/* ═══════════════════════════════════════════════════════
   THE ARCHITECT'S CONSOLE — Dungeon Master Control Board
   Void Energy themed admin dashboard for the Panopticon
   Surveillance Network. Analytics, governance, live ops,
   promo codes, and resource distribution.
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback, lazy, Suspense } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Shield, Vote, Zap, Gift, Radio, Users, BarChart3,
  Plus, X, Check, Power, PowerOff, Ticket, Clock, Target,
  ChevronRight, AlertTriangle, Send, Rewind,
  Search, DollarSign, Globe, ToggleLeft, Gamepad2, Activity,
  Heart, Swords, Brain, Layers,
} from "lucide-react";
import { toast } from "sonner";

const TimeMachineView = lazy(() => import("@/components/TimeMachineView"));

type ConsoleView = "surveillance" | "governance" | "live_ops" | "requisitions" | "awards" | "time_machine" | "inspect" | "economy" | "universe" | "flags" | "test_games";

/* ═══ VOID ENERGY STYLE HELPERS ═══ */
const voidPanel = "bg-white/[0.02] border border-white/10 rounded-xl backdrop-blur";
const voidGlow = "shadow-[0_0_15px_rgba(34,211,238,0.15)]";
const voidBtn = "px-4 py-2 rounded-lg font-mono text-[11px] tracking-wider transition-all";
const voidBtnPrimary = `${voidBtn} bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]`;
const voidBtnDanger = `${voidBtn} bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20`;
const voidInput = "w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white placeholder-white/20 focus:border-cyan-500/50 focus:outline-none";
const voidSelect = "bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-cyan-500/50 focus:outline-none";
const voidLabel = "block font-mono text-[10px] text-white/40 tracking-wider mb-1";

function MetricCard({ label, value, icon: Icon, color = "cyan" }: { label: string; value: string | number; icon: typeof Eye; color?: string }) {
  const colorMap: Record<string, string> = {
    cyan: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
    amber: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    purple: "text-purple-400 border-purple-500/20 bg-purple-500/5",
    green: "text-green-400 border-green-500/20 bg-green-500/5",
    red: "text-red-400 border-red-500/20 bg-red-500/5",
  };
  return (
    <div className={`p-4 rounded-xl border ${colorMap[color] || colorMap.cyan}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="opacity-60" />
        <span className="font-mono text-[9px] tracking-[0.15em] opacity-60">{label}</span>
      </div>
      <p className="font-mono text-2xl font-bold">{value}</p>
    </div>
  );
}

/* ═══ SURVEILLANCE VIEW ═══ */
function SurveillanceView() {
  const metrics = trpc.architectConsole.getDashboardMetrics.useQuery();
  const morality = trpc.architectConsole.getMoralityDistribution.useQuery();
  const species = trpc.architectConsole.getSpeciesDistribution.useQuery();

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard icon={Users} label="TOTAL SUBJECTS" value={metrics.data?.totalUsers ?? "—"} color="cyan" />
        <MetricCard icon={Eye} label="ACTIVE TODAY" value={metrics.data?.dailyActiveUsers ?? "—"} color="green" />
        <MetricCard icon={Zap} label="WEEKLY ACTIVE" value={metrics.data?.weeklyActiveUsers ?? "—"} color="amber" />
        <MetricCard icon={Target} label="CHARACTERS" value={metrics.data?.totalCharacters ?? "—"} color="purple" />
      </div>

      {/* Morality Distribution */}
      <div className={`${voidPanel} p-4`}>
        <h3 className="font-mono text-[10px] tracking-[0.2em] text-white/40 mb-3">MORAL ALIGNMENT DISTRIBUTION</h3>
        {morality.data ? (() => {
          const entries = Object.entries(morality.data as Record<string, number>);
          const total = entries.reduce((s, [, v]) => s + v, 0) || 1;
          const colorMap: Record<string, string> = {
            machine: "bg-red-500", leaning_machine: "bg-orange-500", neutral: "bg-white/30",
            leaning_humanity: "bg-blue-400", humanity: "bg-cyan-400",
          };
          return (
            <div className="space-y-2">
              {entries.map(([alignment, count]) => {
                const pct = ((count / total) * 100).toFixed(1);
                return (
                  <div key={alignment} className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-white/50 w-28 text-right">{alignment.replace("_", " ")}</span>
                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colorMap[alignment] || "bg-white/20"}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="font-mono text-[10px] text-white/40 w-12">{pct}%</span>
                  </div>
                );
              })}
            </div>
          );
        })() : <p className="font-mono text-[10px] text-white/20">Scanning...</p>}
      </div>

      {/* Species Distribution */}
      <div className={`${voidPanel} p-4`}>
        <h3 className="font-mono text-[10px] tracking-[0.2em] text-white/40 mb-3">SPECIES CENSUS</h3>
        {species.data ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(species.data as Record<string, number>).map(([sp, count]) => (
              <div key={sp} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                <span className="font-mono text-[10px] text-white/60">{sp}</span>
                <span className="font-mono text-xs text-cyan-400 font-bold">{count}</span>
              </div>
            ))}
          </div>
        ) : <p className="font-mono text-[10px] text-white/20">Scanning...</p>}
      </div>
    </div>
  );
}

/* ═══ GOVERNANCE VIEW ═══ */
function GovernanceView() {
  const utils = trpc.useUtils();
  const votes = trpc.architectConsole.listVotes.useQuery({ limit: 20 });
  const createVoteMut = trpc.architectConsole.createVote.useMutation({ onSuccess: () => { utils.architectConsole.listVotes.invalidate(); toast.success("Directive created"); setShowCreate(false); } });
  const closeVoteMut = trpc.architectConsole.closeVote.useMutation({ onSuccess: () => { utils.architectConsole.listVotes.invalidate(); toast.success("Directive closed"); } });

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"lore" | "event" | "content" | "quest" | "sacrifice">("lore");
  const [options, setOptions] = useState(["", "", ""]);
  const [durationDays, setDurationDays] = useState(7);

  const handleCreate = useCallback(() => {
    if (!title || options.filter(Boolean).length < 2) return;
    createVoteMut.mutate({
      voteId: `vote_${Date.now()}`,
      title,
      description,
      category,
      options: options.filter(Boolean).map((text, i) => ({ optionNumber: i + 1, optionText: text })),
      endsAt: new Date(Date.now() + durationDays * 86400000).toISOString(),
    });
  }, [title, description, category, options, durationDays, createVoteMut]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-[10px] tracking-[0.2em] text-white/40">COMMUNITY DIRECTIVES</h3>
        <button onClick={() => setShowCreate(!showCreate)} className={voidBtnPrimary}>
          <Plus size={12} className="inline mr-1" /> CREATE DIRECTIVE
        </button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={`${voidPanel} ${voidGlow} p-4 space-y-3`}>
            <label className={voidLabel}>DIRECTIVE TITLE</label>
            <input className={voidInput} value={title} onChange={e => setTitle(e.target.value)} placeholder="Should the Dreamer awaken?" />
            <label className={voidLabel}>DESCRIPTION</label>
            <textarea className={`${voidInput} h-16 resize-none`} value={description} onChange={e => setDescription(e.target.value)} placeholder="The community must decide..." />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={voidLabel}>CATEGORY</label>
                <select className={voidSelect} value={category} onChange={e => setCategory(e.target.value as typeof category)}>
                  {["lore", "event", "content", "quest", "sacrifice"].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
              </div>
              <div>
                <label className={voidLabel}>DURATION (DAYS)</label>
                <input type="number" className={`${voidInput} w-20`} value={durationDays} onChange={e => setDurationDays(+e.target.value)} min={1} max={30} />
              </div>
            </div>
            <label className={voidLabel}>OPTIONS (2-5)</label>
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input className={voidInput} value={opt} onChange={e => { const o = [...options]; o[i] = e.target.value; setOptions(o); }} placeholder={`Option ${i + 1}`} />
                {options.length > 2 && <button onClick={() => setOptions(options.filter((_, j) => j !== i))} className="text-red-400/50 hover:text-red-400"><X size={14} /></button>}
              </div>
            ))}
            {options.length < 5 && <button onClick={() => setOptions([...options, ""])} className="font-mono text-[10px] text-cyan-400/50 hover:text-cyan-400">+ Add option</button>}
            <div className="flex gap-2 pt-2">
              <button onClick={handleCreate} className={voidBtnPrimary} disabled={createVoteMut.isPending}>{createVoteMut.isPending ? "DEPLOYING..." : "DEPLOY DIRECTIVE"}</button>
              <button onClick={() => setShowCreate(false)} className={voidBtn + " text-white/30 hover:text-white/50"}>CANCEL</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vote List */}
      {votes.data?.votes?.map((vote: any) => (
        <div key={vote.id} className={`${voidPanel} p-4`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-mono text-sm text-white font-bold">{vote.title}</h4>
              <span className={`font-mono text-[9px] tracking-wider ${vote.status === "active" ? "text-green-400" : vote.status === "closed" ? "text-white/30" : "text-amber-400"}`}>
                {vote.status.toUpperCase()} • {vote.category.toUpperCase()}
              </span>
            </div>
            {vote.status === "active" && (
              <button onClick={() => {
                const topOpt = vote.options?.reduce((best: any, o: any) => (o.voteCount || 0) > (best?.voteCount || 0) ? o : best, vote.options[0]);
                closeVoteMut.mutate({ voteId: vote.voteId, winnerOptionNumber: topOpt?.optionNumber ?? 1 });
              }} className={voidBtnDanger}>CLOSE</button>
            )}
          </div>
          {vote.options?.map((opt: any) => {
            const totalVotes = vote.options.reduce((s: number, o: any) => s + (o.voteCount || 0), 0) || 1;
            const pct = ((opt.voteCount || 0) / totalVotes * 100).toFixed(1);
            return (
              <div key={opt.optionNumber} className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] text-white/50 w-32 truncate">{opt.optionText}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${opt.isWinner ? "bg-cyan-400" : "bg-white/20"}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="font-mono text-[10px] text-white/40 w-10 text-right">{opt.voteCount || 0}</span>
              </div>
            );
          })}
        </div>
      ))}
      {!votes.data?.votes?.length && <p className="font-mono text-[10px] text-white/20 text-center py-8">No directives issued</p>}
    </div>
  );
}

/* ═══ LIVE OPS VIEW ═══ */
function LiveOpsView() {
  const utils = trpc.useUtils();
  const events = trpc.architectConsole.listEvents.useQuery({ limit: 20 });
  const createEventMut = trpc.architectConsole.createEvent.useMutation({ onSuccess: () => { utils.architectConsole.listEvents.invalidate(); toast.success("Event deployed"); setShowCreate(false); } });
  const activateMut = trpc.architectConsole.activateEvent.useMutation({ onSuccess: () => { utils.architectConsole.listEvents.invalidate(); toast.success("Event activated"); } });
  const deactivateMut = trpc.architectConsole.deactivateEvent.useMutation({ onSuccess: () => { utils.architectConsole.listEvents.invalidate(); toast.success("Event deactivated"); } });

  const [showCreate, setShowCreate] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState<string>("notification");
  const [message, setMessage] = useState("");
  const [expiryHours, setExpiryHours] = useState(24);

  const handleCreate = useCallback(() => {
    if (!eventName) return;
    createEventMut.mutate({
      eventKey: `event_${Date.now()}`,
      eventName,
      eventType: eventType as any,
      message: message || undefined,
      expiresAt: new Date(Date.now() + expiryHours * 3600000).toISOString(),
    });
  }, [eventName, eventType, message, expiryHours, createEventMut]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-[10px] tracking-[0.2em] text-white/40">LIVE OPERATIONS</h3>
        <button onClick={() => setShowCreate(!showCreate)} className={voidBtnPrimary}>
          <Zap size={12} className="inline mr-1" /> DEPLOY EVENT
        </button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={`${voidPanel} ${voidGlow} p-4 space-y-3`}>
            <label className={voidLabel}>EVENT NAME</label>
            <input className={voidInput} value={eventName} onChange={e => setEventName(e.target.value)} placeholder="Double XP Weekend" />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={voidLabel}>TYPE</label>
                <select className={voidSelect} value={eventType} onChange={e => setEventType(e.target.value)}>
                  {["notification", "living_universe", "seasonal_bonus", "instance_spawn", "narrative_trigger", "multiplier"].map(t => <option key={t} value={t}>{t.replace("_", " ").toUpperCase()}</option>)}
                </select>
              </div>
              <div>
                <label className={voidLabel}>EXPIRES IN (HRS)</label>
                <input type="number" className={`${voidInput} w-24`} value={expiryHours} onChange={e => setExpiryHours(+e.target.value)} min={1} />
              </div>
            </div>
            <label className={voidLabel}>MESSAGE (OPTIONAL)</label>
            <textarea className={`${voidInput} h-16 resize-none`} value={message} onChange={e => setMessage(e.target.value)} placeholder="Broadcast to all subjects..." />
            <div className="flex gap-2 pt-2">
              <button onClick={handleCreate} className={voidBtnPrimary} disabled={createEventMut.isPending}>DEPLOY</button>
              <button onClick={() => setShowCreate(false)} className={voidBtn + " text-white/30 hover:text-white/50"}>CANCEL</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {events.data?.events?.map((evt: any) => (
        <div key={evt.id} className={`${voidPanel} p-4 flex items-center justify-between`}>
          <div>
            <h4 className="font-mono text-sm text-white">{evt.eventName}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full ${evt.isActive ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/30"}`}>
                {evt.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
              <span className="font-mono text-[9px] text-white/30">{evt.eventType.replace("_", " ").toUpperCase()}</span>
              {evt.expiresAt && <span className="font-mono text-[9px] text-white/20"><Clock size={10} className="inline mr-0.5" />{new Date(evt.expiresAt).toLocaleDateString()}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            {!evt.isActive ? (
              <button onClick={() => activateMut.mutate({ eventKey: evt.eventKey })} className={voidBtnPrimary}><Power size={12} /></button>
            ) : (
              <button onClick={() => deactivateMut.mutate({ eventKey: evt.eventKey })} className={voidBtnDanger}><PowerOff size={12} /></button>
            )}
          </div>
        </div>
      ))}
      {!events.data?.events?.length && <p className="font-mono text-[10px] text-white/20 text-center py-8">No events deployed</p>}
    </div>
  );
}

/* ═══ REQUISITIONS VIEW (PROMO CODES) ═══ */
function RequisitionsView() {
  const utils = trpc.useUtils();
  const codes = trpc.promoCodes.listAllCodes.useQuery();
  const createCodeMut = trpc.promoCodes.createCode.useMutation({ onSuccess: () => { utils.promoCodes.listAllCodes.invalidate(); toast.success("Requisition code created"); setShowCreate(false); } });
  const deactivateMut = trpc.promoCodes.deactivateCode.useMutation({ onSuccess: () => { utils.promoCodes.listAllCodes.invalidate(); toast.success("Code deactivated"); } });

  const [showCreate, setShowCreate] = useState(false);
  const [code, setCode] = useState("");
  const [rewardType, setRewardType] = useState<string>("dream_currency");
  const [dreamAmount, setDreamAmount] = useState(100);
  const [creditsAmount, setCreditsAmount] = useState(0);
  const [maxUses, setMaxUses] = useState(-1);
  const [expiryDays, setExpiryDays] = useState(14);
  const [description, setDescription] = useState("");

  const handleCreate = useCallback(() => {
    if (!code) return;
    const rewardValue: Record<string, any> = {};
    if (dreamAmount > 0) rewardValue.dream = dreamAmount;
    if (creditsAmount > 0) rewardValue.credits = creditsAmount;
    createCodeMut.mutate({
      code: code.toUpperCase(),
      description,
      rewardType: rewardType as any,
      rewardValue,
      maxRedemptions: maxUses,
      expiresAt: expiryDays > 0 ? new Date(Date.now() + expiryDays * 86400000).toISOString() : undefined,
    });
  }, [code, rewardType, dreamAmount, creditsAmount, maxUses, expiryDays, description, createCodeMut]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-[10px] tracking-[0.2em] text-white/40">REQUISITION CODES</h3>
        <button onClick={() => setShowCreate(!showCreate)} className={voidBtnPrimary}>
          <Ticket size={12} className="inline mr-1" /> CREATE CODE
        </button>
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className={`${voidPanel} ${voidGlow} p-4 space-y-3`}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={voidLabel}>CODE</label>
                <input className={`${voidInput} uppercase`} value={code} onChange={e => setCode(e.target.value)} placeholder="HERO2026" />
              </div>
              <div>
                <label className={voidLabel}>REWARD TYPE</label>
                <select className={voidSelect} value={rewardType} onChange={e => setRewardType(e.target.value)}>
                  {["dream_currency", "credits", "cards", "cosmetics", "mixed"].map(t => <option key={t} value={t}>{t.replace("_", " ").toUpperCase()}</option>)}
                </select>
              </div>
            </div>
            <label className={voidLabel}>DESCRIPTION</label>
            <input className={voidInput} value={description} onChange={e => setDescription(e.target.value)} placeholder="Launch day bonus" />
            <div className="grid grid-cols-4 gap-3">
              <div><label className={voidLabel}>DREAM</label><input type="number" className={voidInput} value={dreamAmount} onChange={e => setDreamAmount(+e.target.value)} /></div>
              <div><label className={voidLabel}>CREDITS</label><input type="number" className={voidInput} value={creditsAmount} onChange={e => setCreditsAmount(+e.target.value)} /></div>
              <div><label className={voidLabel}>MAX USES</label><input type="number" className={voidInput} value={maxUses} onChange={e => setMaxUses(+e.target.value)} /></div>
              <div><label className={voidLabel}>EXPIRY (DAYS)</label><input type="number" className={voidInput} value={expiryDays} onChange={e => setExpiryDays(+e.target.value)} /></div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={handleCreate} className={voidBtnPrimary} disabled={createCodeMut.isPending}>CREATE</button>
              <button onClick={() => setShowCreate(false)} className={voidBtn + " text-white/30 hover:text-white/50"}>CANCEL</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(codes.data as any[])?.map((promo: any) => (
        <div key={promo.id} className={`${voidPanel} p-3 flex items-center justify-between`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-cyan-400 font-bold">{promo.code}</span>
              <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full ${promo.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {promo.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
            <p className="font-mono text-[10px] text-white/30 mt-0.5">
              {promo.currentRedemptions}/{promo.maxRedemptions === -1 ? "∞" : promo.maxRedemptions} used
              {promo.description && ` • ${promo.description}`}
            </p>
          </div>
          {promo.isActive && (
            <button onClick={() => deactivateMut.mutate({ id: promo.id })} className={voidBtnDanger}>REVOKE</button>
          )}
        </div>
      ))}
      {!(codes.data as any[])?.length && <p className="font-mono text-[10px] text-white/20 text-center py-8">No requisition codes</p>}
    </div>
  );
}

/* ═══ AWARDS VIEW ═══ */
function AwardsView() {
  const awardMut = trpc.architectConsole.awardResources.useMutation({
    onSuccess: () => toast.success("Resources awarded"),
    onError: (err) => toast.error(err.message),
  });

  const [userId, setUserId] = useState("");
  const [dream, setDream] = useState(0);
  const [credits, setCredits] = useState(0);
  const [reason, setReason] = useState("");

  const handleAward = useCallback(() => {
    const uid = parseInt(userId);
    if (!uid) return toast.error("Enter a valid user ID");
    if (!reason) return toast.error("Reason is required for audit log");
    awardMut.mutate({
      userId: uid,
      dreamTokens: dream || undefined,
      credits: credits || undefined,
      reason,
    });
  }, [userId, dream, credits, reason, awardMut]);

  return (
    <div className="space-y-4">
      <h3 className="font-mono text-[10px] tracking-[0.2em] text-white/40">RESOURCE DISTRIBUTION</h3>
      <div className={`${voidPanel} ${voidGlow} p-4 space-y-3`}>
        <label className={voidLabel}>TARGET SUBJECT ID</label>
        <input className={voidInput} value={userId} onChange={e => setUserId(e.target.value)} placeholder="User ID" />
        <div className="grid grid-cols-2 gap-3">
          <div><label className={voidLabel}>DREAM CURRENCY</label><input type="number" className={voidInput} value={dream} onChange={e => setDream(+e.target.value)} /></div>
          <div><label className={voidLabel}>CREDITS</label><input type="number" className={voidInput} value={credits} onChange={e => setCredits(+e.target.value)} /></div>
        </div>
        <label className={voidLabel}>REASON (AUDIT LOG)</label>
        <input className={voidInput} value={reason} onChange={e => setReason(e.target.value)} placeholder="Content creator reward" />
        <button onClick={handleAward} className={voidBtnPrimary} disabled={awardMut.isPending}>
          <Send size={12} className="inline mr-1" /> {awardMut.isPending ? "DISTRIBUTING..." : "DISTRIBUTE RESOURCES"}
        </button>
      </div>
    </div>
  );
}

/* ═══ PLAYER INSPECTOR VIEW ═══ */
function InspectView() {
  const [userId, setUserId] = useState("");
  const [inspecting, setInspecting] = useState<number | null>(null);
  const player = trpc.architectConsole.inspectPlayer.useQuery(
    { userId: inspecting! },
    { enabled: inspecting !== null }
  );

  // Manipulation mutations
  const setMorality = trpc.architectConsole.setMorality.useMutation({ onSuccess: () => { player.refetch(); toast.success("Morality updated"); } });
  const setLevel = trpc.architectConsole.setLevel.useMutation({ onSuccess: () => { player.refetch(); toast.success("Level updated"); } });
  const setPrestige = trpc.architectConsole.setPrestige.useMutation({ onSuccess: () => { player.refetch(); toast.success("Prestige updated"); } });
  const setNPCTrust = trpc.architectConsole.setNPCTrust.useMutation({ onSuccess: () => { player.refetch(); toast.success("NPC trust updated"); } });
  const setFlag = trpc.architectConsole.setNarrativeFlag.useMutation({ onSuccess: () => { player.refetch(); toast.success("Flag updated"); } });
  const setPhase = trpc.architectConsole.setGamePhase.useMutation({ onSuccess: () => { player.refetch(); toast.success("Phase updated"); } });
  const grantItem = trpc.architectConsole.grantItem.useMutation({ onSuccess: () => { player.refetch(); toast.success("Item granted"); } });
  const unlockRoom = trpc.architectConsole.unlockRoom.useMutation({ onSuccess: () => { player.refetch(); toast.success("Room unlocked"); } });

  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const p = player.data;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className={`${voidPanel} p-4`}>
        <label className={voidLabel}>PLAYER USER ID</label>
        <div className="flex gap-2">
          <input value={userId} onChange={e => setUserId(e.target.value)} placeholder="Enter user ID..." className={voidInput} />
          <button onClick={() => setInspecting(parseInt(userId) || null)} className={voidBtnPrimary}>
            <Search size={12} className="mr-1 inline" /> INSPECT
          </button>
        </div>
      </div>

      {player.isLoading && <p className="font-mono text-[10px] text-cyan-400/50 text-center py-8">Scanning player data...</p>}

      {p && (
        <div className="space-y-3">
          {/* Identity */}
          <div className={`${voidPanel} p-4`}>
            <h3 className="font-mono text-[10px] text-cyan-400/60 tracking-wider mb-3">IDENTITY</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div><span className="text-white/30 text-[9px]">ID</span><br/>{p.user.id}</div>
              <div><span className="text-white/30 text-[9px]">NAME</span><br/>{p.user.name || "—"}</div>
              <div><span className="text-white/30 text-[9px]">ROLE</span><br/>{p.user.role}</div>
              <div><span className="text-white/30 text-[9px]">LAST LOGIN</span><br/>{p.user.lastSignedIn ? new Date(p.user.lastSignedIn).toLocaleDateString() : "—"}</div>
            </div>
          </div>

          {/* Character */}
          {p.character && (
            <div className={`${voidPanel} p-4`}>
              <h3 className="font-mono text-[10px] text-cyan-400/60 tracking-wider mb-3">CHARACTER</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div><span className="text-white/30 text-[9px]">NAME</span><br/>{p.character.name}</div>
                <div><span className="text-white/30 text-[9px]">SPECIES</span><br/>{p.character.species}</div>
                <div><span className="text-white/30 text-[9px]">CLASS</span><br/>{p.character.class}</div>
                <div><span className="text-white/30 text-[9px]">ALIGNMENT</span><br/>{p.character.alignment}</div>
                <div>
                  <span className="text-white/30 text-[9px]">MORALITY</span><br/>
                  <span className={p.character.moralityScore > 0 ? "text-cyan-400" : p.character.moralityScore < 0 ? "text-red-400" : "text-white/50"}>
                    {p.character.moralityScore}
                  </span>
                  <button onClick={() => { setEditField("morality"); setEditValue(String(p.character!.moralityScore)); }} className="ml-1 text-cyan-500/40 hover:text-cyan-400 text-[8px]">✎</button>
                </div>
                <div>
                  <span className="text-white/30 text-[9px]">LEVEL</span><br/>{p.level}
                  <button onClick={() => { setEditField("level"); setEditValue(String(p.level)); }} className="ml-1 text-cyan-500/40 hover:text-cyan-400 text-[8px]">✎</button>
                </div>
                <div>
                  <span className="text-white/30 text-[9px]">PRESTIGE</span><br/>T{p.character.prestigeTier}
                  <button onClick={() => { setEditField("prestige"); setEditValue(String(p.character!.prestigeTier)); }} className="ml-1 text-cyan-500/40 hover:text-cyan-400 text-[8px]">✎</button>
                </div>
                <div><span className="text-white/30 text-[9px]">CREDITS</span><br/>{p.character.credits}</div>
              </div>
            </div>
          )}

          {/* Economy */}
          <div className={`${voidPanel} p-4`}>
            <h3 className="font-mono text-[10px] text-cyan-400/60 tracking-wider mb-3">ECONOMY</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div><span className="text-white/30 text-[9px]">DREAM</span><br/><span className="text-amber-400">{p.economy.dreamTokens}</span></div>
              <div><span className="text-white/30 text-[9px]">SOUL-BOUND</span><br/><span className="text-purple-400">{p.economy.soulBoundDream}</span></div>
              <div><span className="text-white/30 text-[9px]">DNA CODE</span><br/><span className="text-cyan-400">{p.economy.dnaCode}</span></div>
              <div><span className="text-white/30 text-[9px]">LIFETIME EARNED</span><br/>{p.economy.totalDreamEarned}</div>
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => grantItem.mutate({ userId: inspecting!, itemType: "dream", amount: 100 })} className={`${voidBtn} bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px]`}>+100 Dream</button>
              <button onClick={() => grantItem.mutate({ userId: inspecting!, itemType: "dream", amount: 1000 })} className={`${voidBtn} bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px]`}>+1000 Dream</button>
              <button onClick={() => grantItem.mutate({ userId: inspecting!, itemType: "credits", amount: 5000 })} className={`${voidBtn} bg-green-500/10 border border-green-500/30 text-green-400 text-[9px]`}>+5000 Credits</button>
            </div>
          </div>

          {/* NPC Trust */}
          {p.npcTrust.length > 0 && (
            <div className={`${voidPanel} p-4`}>
              <h3 className="font-mono text-[10px] text-cyan-400/60 tracking-wider mb-3">NPC TRUST</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                {p.npcTrust.map(n => (
                  <div key={n.npcId} className="flex items-center gap-2 bg-white/[0.02] rounded p-2">
                    <Heart size={10} className="text-pink-400/50" />
                    <span className="text-white/50 flex-1">{n.npcId}</span>
                    <span className="text-cyan-400">{n.trust}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Companions */}
          {p.companions.length > 0 && (
            <div className={`${voidPanel} p-4`}>
              <h3 className="font-mono text-[10px] text-cyan-400/60 tracking-wider mb-3">COMPANIONS ({p.companions.length}) {p.fallenCompanions > 0 && <span className="text-red-400/50">// {p.fallenCompanions} fallen</span>}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                {p.companions.map(c => (
                  <div key={c.eidolonId} className="bg-white/[0.02] rounded p-2">
                    <span className="text-white/70">{c.nickname || c.eidolonId}</span>
                    <div className="text-[9px] text-white/30">{c.stage} • Lv{c.level} • {c.health} • Bond:{c.bond}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Summary */}
          <div className={`${voidPanel} p-4`}>
            <h3 className="font-mono text-[10px] text-cyan-400/60 tracking-wider mb-3">PROGRESS</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 font-mono text-xs text-center">
              <div><span className="text-white/30 text-[8px] block">ROOMS</span>{p.rooms.unlocked}/{p.rooms.total}</div>
              <div><span className="text-white/30 text-[8px] block">EPISODES</span>{p.episodesWatched}</div>
              <div><span className="text-white/30 text-[8px] block">QUESTS</span>{p.questsCompleted}</div>
              <div><span className="text-white/30 text-[8px] block">ACHIEVEMENTS</span>{p.achievementCount}</div>
              <div><span className="text-white/30 text-[8px] block">GAMES</span>{p.completedGames}</div>
              <div><span className="text-white/30 text-[8px] block">FEATURES</span>{p.featureUnlocks.length}</div>
            </div>
          </div>

          {/* Narrative Flags */}
          <div className={`${voidPanel} p-4`}>
            <h3 className="font-mono text-[10px] text-cyan-400/60 tracking-wider mb-3">NARRATIVE FLAGS ({p.narrativeFlags.length})</h3>
            <div className="flex flex-wrap gap-1">
              {p.narrativeFlags.map(f => (
                <span key={f} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400/70 text-[8px] font-mono">{f}</span>
              ))}
              {p.narrativeFlags.length === 0 && <span className="text-white/20 text-[9px]">No flags set</span>}
            </div>
          </div>

          {/* Inline Edit Modal */}
          {editField && (
            <div className={`${voidPanel} p-4 border-cyan-500/40`}>
              <h3 className="font-mono text-[10px] text-cyan-400 tracking-wider mb-2">EDIT: {editField.toUpperCase()}</h3>
              <div className="flex gap-2">
                <input value={editValue} onChange={e => setEditValue(e.target.value)} className={voidInput} />
                <button className={voidBtnPrimary} onClick={() => {
                  const val = parseInt(editValue);
                  if (isNaN(val)) return;
                  if (editField === "morality") setMorality.mutate({ userId: inspecting!, score: val });
                  if (editField === "level") setLevel.mutate({ userId: inspecting!, level: val });
                  if (editField === "prestige") setPrestige.mutate({ userId: inspecting!, tier: val });
                  setEditField(null);
                }}>SAVE</button>
                <button className={voidBtnDanger} onClick={() => setEditField(null)}>CANCEL</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══ ECONOMY DASHBOARD VIEW ═══ */
function EconomyView() {
  const economy = trpc.architectConsole.economyDashboard.useQuery();
  const e = economy.data;
  if (!e) return <p className="font-mono text-[10px] text-white/20 text-center py-8">Loading economy data...</p>;

  const statusColor = e.healthStatus === "healthy" ? "green" : e.healthStatus === "watch" ? "amber" : "red";

  return (
    <div className="space-y-4">
      {/* Health Status Banner */}
      <div className={`${voidPanel} p-4 border-${statusColor}-500/30`}>
        <div className="flex items-center gap-2 mb-2">
          <Activity size={14} className={`text-${statusColor}-400`} />
          <span className={`font-mono text-sm font-bold text-${statusColor}-400`}>
            {e.healthStatus === "healthy" ? "ECONOMY HEALTHY" : e.healthStatus === "watch" ? "ECONOMY — WATCH" : "ECONOMY — INTERVENE"}
          </span>
        </div>
        <p className="font-mono text-[10px] text-white/30">
          Net flow: {e.netFlow > 0 ? "+" : ""}{e.netFlow} Dream/day (7d: {e.weeklyNetFlow > 0 ? "+" : ""}{e.weeklyNetFlow})
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="TOTAL CIRCULATION" value={e.totalCirculation.toLocaleString()} icon={DollarSign} color="amber" />
        <MetricCard label="SOUL-BOUND" value={e.totalSoulBound.toLocaleString()} icon={Shield} color="purple" />
        <MetricCard label="AVG BALANCE" value={e.averageBalance.toLocaleString()} icon={Users} color="cyan" />
        <MetricCard label="PLAYERS" value={e.playerCount.toLocaleString()} icon={Users} color="green" />
      </div>

      {/* Daily Flow */}
      <div className={`${voidPanel} p-4`}>
        <h3 className="font-mono text-[10px] text-cyan-400/60 tracking-wider mb-3">DAILY FLOW</h3>
        <div className="grid grid-cols-3 gap-4 font-mono text-xs text-center">
          <div>
            <span className="text-white/30 text-[9px] block">EARNED TODAY</span>
            <span className="text-green-400 text-lg font-bold">{e.dailyEarned.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-white/30 text-[9px] block">SPENT TODAY</span>
            <span className="text-red-400 text-lg font-bold">{e.dailySpent.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-white/30 text-[9px] block">NET FLOW</span>
            <span className={`text-lg font-bold ${e.netFlow >= 0 ? "text-green-400" : "text-red-400"}`}>
              {e.netFlow > 0 ? "+" : ""}{e.netFlow.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Market & Guild */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <MetricCard label="GUILD TREASURIES" value={e.guildTreasuries.toLocaleString()} icon={Shield} color="purple" />
        <MetricCard label="MARKET VOLUME" value={e.marketplaceVolume.toLocaleString()} icon={BarChart3} color="amber" />
        <MetricCard label="MARKET TXS" value={e.marketplaceTransactions.toLocaleString()} icon={Target} color="cyan" />
      </div>
    </div>
  );
}

/* ═══ LIVING UNIVERSE VIEW ═══ */
function UniverseView() {
  const pressures = trpc.architectConsole.getPressureMeters.useQuery();
  const activeEvents = trpc.architectConsole.getActiveUniverseEvents.useQuery();
  const eventHistory = trpc.architectConsole.getEventHistory.useQuery();
  const forceActivate = trpc.architectConsole.forceActivateEvent.useMutation({ onSuccess: () => { activeEvents.refetch(); eventHistory.refetch(); toast.success("Event activated"); } });
  const forceResolve = trpc.architectConsole.forceResolveEvent.useMutation({ onSuccess: () => { activeEvents.refetch(); eventHistory.refetch(); toast.success("Event resolved"); } });

  const p = pressures.data as Record<string, number> | undefined;
  const [eventId, setEventId] = useState("");

  return (
    <div className="space-y-4">
      {/* Pressure Meters */}
      <div className={`${voidPanel} p-4`}>
        <h3 className="font-mono text-[10px] text-cyan-400/60 tracking-wider mb-3">PRESSURE METERS (30-DAY)</h3>
        {p ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(p).map(([key, val]) => (
              <div key={key} className="text-center">
                <div className="h-20 w-full bg-white/[0.03] rounded-lg relative overflow-hidden mb-1">
                  <div className="absolute bottom-0 inset-x-0 bg-cyan-500/30 transition-all" style={{ height: `${Math.min(100, (val / 500) * 100)}%` }} />
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-white font-bold">{val}</span>
                </div>
                <span className="font-mono text-[8px] text-white/30">{key}</span>
              </div>
            ))}
          </div>
        ) : <p className="text-white/20 text-[10px]">Loading...</p>}
      </div>

      {/* Active Events */}
      <div className={`${voidPanel} p-4`}>
        <h3 className="font-mono text-[10px] text-red-400/60 tracking-wider mb-3">
          ACTIVE EVENTS ({activeEvents.data?.length || 0})
        </h3>
        {activeEvents.data?.map((ev: any) => (
          <div key={ev.eventId} className="flex items-center gap-3 p-2 bg-red-500/5 border border-red-500/20 rounded-lg mb-2">
            <AlertTriangle size={14} className="text-red-400" />
            <div className="flex-1 font-mono text-xs">
              <span className="text-red-400 font-bold">{ev.eventId}</span>
              <span className="text-white/30 ml-2">Score: {ev.pressureScore} • Since: {ev.activatedAt ? new Date(ev.activatedAt).toLocaleDateString() : "—"}</span>
            </div>
            <button onClick={() => forceResolve.mutate({ eventId: ev.eventId })} className={`${voidBtn} bg-red-500/10 border border-red-500/30 text-red-400 text-[9px]`}>RESOLVE</button>
          </div>
        ))}
        {(!activeEvents.data || activeEvents.data.length === 0) && <p className="text-white/20 text-[10px]">No active events</p>}
      </div>

      {/* Force Activate */}
      <div className={`${voidPanel} p-4`}>
        <h3 className="font-mono text-[10px] text-cyan-400/60 tracking-wider mb-2">FORCE ACTIVATE EVENT</h3>
        <div className="flex gap-2">
          <input value={eventId} onChange={e => setEventId(e.target.value)} placeholder="Event ID..." className={voidInput} />
          <button onClick={() => { forceActivate.mutate({ eventId }); setEventId(""); }} className={voidBtnPrimary}>ACTIVATE</button>
        </div>
      </div>

      {/* Event History */}
      <div className={`${voidPanel} p-4`}>
        <h3 className="font-mono text-[10px] text-cyan-400/60 tracking-wider mb-3">EVENT HISTORY</h3>
        <div className="space-y-1">
          {eventHistory.data?.slice(0, 20).map((ev: any) => (
            <div key={ev.id} className="flex items-center gap-2 font-mono text-[10px] py-1 border-b border-white/5">
              <span className={ev.isActive ? "text-red-400" : "text-white/30"}>{ev.isActive ? "●" : "○"}</span>
              <span className="text-white/50 flex-1">{ev.eventId}</span>
              <span className="text-white/20">x{ev.occurrenceCount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ FEATURE FLAGS VIEW ═══ */
function FlagsView() {
  const flags = trpc.architectConsole.listFeatureFlags.useQuery();
  const setFlag = trpc.architectConsole.setFeatureFlag.useMutation({ onSuccess: () => { flags.refetch(); toast.success("Flag toggled"); } });
  const seedFlags = trpc.architectConsole.seedFeatureFlags.useMutation({ onSuccess: (d: any) => { flags.refetch(); toast.success(`Seeded ${d.seeded} flags`); } });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-[10px] text-cyan-400/60 tracking-wider">FEATURE FLAGS</h3>
        <button onClick={() => seedFlags.mutate()} className={voidBtnPrimary}>
          <Plus size={12} className="mr-1 inline" /> SEED DEFAULTS
        </button>
      </div>
      <div className={`${voidPanel} p-4`}>
        <div className="space-y-1">
          {flags.data?.map((f: any) => (
            <div key={f.id} className="flex items-center gap-3 py-2 border-b border-white/5">
              <button
                onClick={() => setFlag.mutate({ name: f.featureName, enabled: !f.enabled })}
                className={`w-10 h-5 rounded-full transition-colors ${f.enabled ? "bg-green-500/30" : "bg-red-500/20"}`}
              >
                <div className={`w-4 h-4 rounded-full transition-transform ${f.enabled ? "translate-x-5 bg-green-400" : "translate-x-0.5 bg-red-400"}`} />
              </button>
              <span className={`font-mono text-xs flex-1 ${f.enabled ? "text-white/70" : "text-white/30 line-through"}`}>
                {f.featureName}
              </span>
              <span className="font-mono text-[8px] text-white/20">
                {f.updatedBy ? `by #${f.updatedBy}` : ""}
              </span>
            </div>
          ))}
          {(!flags.data || flags.data.length === 0) && (
            <p className="text-white/20 text-[10px] text-center py-4">No flags yet — click SEED DEFAULTS to create them</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══ GAME MODE TEST LAUNCHER ═══ */
function TestGamesView() {
  const gameModes = trpc.architectConsole.getGameModes.useQuery();
  const categories = ["combat", "cards", "strategy", "defense", "puzzle", "social"];

  return (
    <div className="space-y-4">
      <div className={`${voidPanel} p-4`}>
        <h3 className="font-mono text-[10px] text-cyan-400/60 tracking-wider mb-1">GAME MODE TEST LAUNCHER</h3>
        <p className="font-mono text-[9px] text-white/20 mb-4">Launch any game mode instantly — bypasses all unlock requirements</p>

        {categories.map(cat => {
          const games = gameModes.data?.filter((g: any) => g.category === cat) || [];
          if (games.length === 0) return null;
          const catColor = cat === "combat" ? "red" : cat === "cards" ? "amber" : cat === "strategy" ? "cyan" : cat === "defense" ? "purple" : cat === "puzzle" ? "green" : "pink";
          return (
            <div key={cat} className="mb-4">
              <h4 className={`font-mono text-[9px] text-${catColor}-400/60 tracking-wider mb-2`}>{cat.toUpperCase()}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {games.map((g: any) => (
                  <a
                    key={g.id}
                    href={g.path}
                    className={`p-3 rounded-lg border border-${catColor}-500/20 bg-${catColor}-500/5 hover:bg-${catColor}-500/10 transition-all group`}
                  >
                    <Gamepad2 size={14} className={`text-${catColor}-400/50 mb-1 group-hover:text-${catColor}-400`} />
                    <span className="font-mono text-[10px] text-white/70 block">{g.name}</span>
                    <span className="font-mono text-[8px] text-white/20">{g.path}</span>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══ MAIN CONSOLE ═══ */
const TABS: { id: ConsoleView; label: string; icon: typeof Eye }[] = [
  { id: "surveillance", label: "SURVEILLANCE", icon: Eye },
  { id: "governance", label: "GOVERNANCE", icon: Vote },
  { id: "live_ops", label: "LIVE OPS", icon: Radio },
  { id: "requisitions", label: "REQUISITIONS", icon: Ticket },
  { id: "awards", label: "AWARDS", icon: Gift },
  { id: "time_machine", label: "TIME MACHINE", icon: Rewind },
  { id: "inspect", label: "INSPECT", icon: Search },
  { id: "economy", label: "ECONOMY", icon: DollarSign },
  { id: "universe", label: "UNIVERSE", icon: Globe },
  { id: "flags", label: "FLAGS", icon: ToggleLeft },
  { id: "test_games", label: "TEST GAMES", icon: Gamepad2 },
];

export default function ArchitectConsolePage() {
  const { user, isAuthenticated } = useAuth();
  const [view, setView] = useState<ConsoleView>("surveillance");

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#010020] flex items-center justify-center p-8">
        <div className="text-center">
          <Shield size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="font-mono text-xl tracking-[0.3em] text-white mb-2">ACCESS DENIED</h1>
          <p className="font-mono text-[10px] text-white/30 mb-4">Architect clearance required.</p>
          <Link href="/" className="font-mono text-[10px] text-cyan-400 hover:underline">← Return to Ark</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010020] p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center gap-3 mb-1">
          <Eye size={18} className="text-cyan-400" />
          <h1 className="font-mono text-lg tracking-[0.3em] text-white">THE ARCHITECT&apos;S CONSOLE</h1>
        </div>
        <p className="font-mono text-[10px] text-white/20 ml-8">Panopticon Surveillance Network — All-Seeing Eye Active</p>
        {/* Scan line effect */}
        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto flex gap-1 mb-6 overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = view === tab.id;
          return (
            <button key={tab.id} onClick={() => setView(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-mono text-[10px] tracking-[0.15em] transition-all ${
                active
                  ? `bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 ${voidGlow}`
                  : "bg-white/[0.02] text-white/30 border border-transparent hover:text-white/50 hover:bg-white/[0.04]"
              }`}>
              <Icon size={13} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
            {view === "surveillance" && <SurveillanceView />}
            {view === "governance" && <GovernanceView />}
            {view === "live_ops" && <LiveOpsView />}
            {view === "requisitions" && <RequisitionsView />}
            {view === "awards" && <AwardsView />}
            {view === "time_machine" && (
              <Suspense fallback={<p className="font-mono text-[10px] text-white/20 text-center py-12">Loading Time Machine...</p>}>
                <TimeMachineView />
              </Suspense>
            )}
            {view === "inspect" && <InspectView />}
            {view === "economy" && <EconomyView />}
            {view === "universe" && <UniverseView />}
            {view === "flags" && <FlagsView />}
            {view === "test_games" && <TestGamesView />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
