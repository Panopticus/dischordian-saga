/* ═══════════════════════════════════════════════════════
   THE ARCHITECT'S CONSOLE — Dungeon Master Control Board
   Void Energy themed admin dashboard for the Panopticon
   Surveillance Network. Analytics, governance, live ops,
   promo codes, and resource distribution.
   ═══════════════════════════════════════════════════════ */
import { useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, Shield, Vote, Zap, Gift, Radio, Users, BarChart3,
  Plus, X, Check, Power, PowerOff, Ticket, Clock, Target,
  ChevronRight, AlertTriangle, Send,
} from "lucide-react";
import { toast } from "sonner";

type ConsoleView = "surveillance" | "governance" | "live_ops" | "requisitions" | "awards";

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

/* ═══ MAIN CONSOLE ═══ */
const TABS: { id: ConsoleView; label: string; icon: typeof Eye }[] = [
  { id: "surveillance", label: "SURVEILLANCE", icon: Eye },
  { id: "governance", label: "GOVERNANCE", icon: Vote },
  { id: "live_ops", label: "LIVE OPS", icon: Radio },
  { id: "requisitions", label: "REQUISITIONS", icon: Ticket },
  { id: "awards", label: "AWARDS", icon: Gift },
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
