/* ═══════════════════════════════════════════════════════
   ADMIN — PvP Telemetry + Moderation Dashboard.
   Tabs: Telemetry, Moderation, Reveal Audit. Admin-only.
   ═══════════════════════════════════════════════════════ */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, BarChart3, Shield, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

type Tab = "telemetry" | "moderation" | "audit";

export default function AdminPvpPage() {
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState<Tab>("telemetry");
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="font-mono text-sm text-muted-foreground">Sign in (admin) to access this dashboard.</p>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-6">
      <Link to="/" className="font-mono text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
        <ArrowLeft size={12} /> BACK
      </Link>
      <h1 className="font-display text-3xl font-black tracking-wider flex items-center gap-3 mt-4">
        <BarChart3 className="text-primary" size={28} />
        ADMIN — PVP DASHBOARD
      </h1>
      <p className="font-mono text-sm text-muted-foreground mt-1 mb-6">
        Title funnels, moderation queue, server-wide reveal audit log.
      </p>
      <div className="flex gap-2 mb-6 flex-wrap">
        {([
          { key: "telemetry", label: "TELEMETRY", icon: BarChart3 },
          { key: "moderation", label: "MODERATION", icon: Shield },
          { key: "audit", label: "REVEAL AUDIT", icon: Sparkles },
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
      {tab === "telemetry" && <TelemetryTab />}
      {tab === "moderation" && <ModerationTab />}
      {tab === "audit" && <AuditTab />}
    </div>
  );
}

function TelemetryTab() {
  const funnels = trpc.pvpTelemetry.getTitleFunnels.useQuery();
  const ratings = trpc.pvpTelemetry.getRatingDistribution.useQuery();
  const conspiracy = trpc.pvpTelemetry.getConspiracyTelemetry.useQuery();
  const quests = trpc.pvpTelemetry.getGuildQuestStats.useQuery();
  const perks = trpc.pvpTelemetry.getGuildPerkStats.useQuery();
  const apprentice = trpc.pvpTelemetry.getApprenticeTrialStats.useQuery();

  return (
    <div className="space-y-6">
      <Section title="Title funnels (per-rootKey tier counts)">
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {(funnels.data ?? []).map((root) => (
            <div key={root.rootKey} className="border border-border/40 bg-secondary/20 rounded p-3">
              <p className="font-display text-sm font-bold">{root.rootKey}</p>
              <div className="mt-1 space-y-1">
                {root.tiers.map((t) => (
                  <div key={t.titleKey} className="flex items-center justify-between font-mono text-[10px]">
                    <span className="opacity-70">T{t.tier} · {t.name}</span>
                    <span className="text-primary tabular-nums">{t.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Rating distribution (gameType × rankTier)">
        <table className="w-full text-left">
          <thead>
            <tr className="font-mono text-[10px] text-muted-foreground border-b border-border/30">
              <th className="py-1 pr-2">gameType</th>
              <th className="py-1 pr-2">tier</th>
              <th className="py-1 text-right">count</th>
            </tr>
          </thead>
          <tbody>
            {(ratings.data ?? []).map((r, i) => (
              <tr key={i} className="font-mono text-xs border-b border-border/10">
                <td className="py-1 pr-2">{r.gameType}</td>
                <td className="py-1 pr-2">{r.rankTier}</td>
                <td className="py-1 text-right tabular-nums">{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Conspiracy boards — solve rates">
        <table className="w-full text-left">
          <thead>
            <tr className="font-mono text-[10px] text-muted-foreground border-b border-border/30">
              <th className="py-1 pr-2">board</th>
              <th className="py-1 text-right">users touched</th>
              <th className="py-1 text-right">users solved</th>
              <th className="py-1 text-right">guilds racing</th>
              <th className="py-1 text-right">guilds solved</th>
            </tr>
          </thead>
          <tbody>
            {(conspiracy.data?.boardStats ?? []).map((b) => (
              <tr key={b.boardKey} className="font-mono text-xs border-b border-border/10">
                <td className="py-1 pr-2">{b.boardKey}</td>
                <td className="py-1 text-right tabular-nums">{b.usersTouched}</td>
                <td className="py-1 text-right tabular-nums">{b.usersSolved}</td>
                <td className="py-1 text-right tabular-nums">{b.guildsRacing}</td>
                <td className="py-1 text-right tabular-nums">{b.guildsSolved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Guild quests — completion rates">
        <table className="w-full text-left">
          <thead>
            <tr className="font-mono text-[10px] text-muted-foreground border-b border-border/30">
              <th className="py-1 pr-2">quest</th>
              <th className="py-1 text-right">active</th>
              <th className="py-1 text-right">completed</th>
              <th className="py-1 text-right">claimed</th>
            </tr>
          </thead>
          <tbody>
            {(quests.data ?? []).map((q) => (
              <tr key={q.questKey} className="font-mono text-xs border-b border-border/10">
                <td className="py-1 pr-2">{q.questKey}</td>
                <td className="py-1 text-right tabular-nums">{q.activeGuilds}</td>
                <td className="py-1 text-right tabular-nums">{q.completedGuilds}</td>
                <td className="py-1 text-right tabular-nums">{q.claimedGuilds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Guild perks — uptake">
        <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-3">
          {(perks.data ?? []).map((p) => (
            <div key={p.perkKey} className="font-mono text-xs flex justify-between border-b border-border/10 py-1">
              <span>{p.perkKey}</span>
              <span className="text-primary tabular-nums">{p.guildsWithPerk}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Apprentice Trial">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Cohorts attended" value={apprentice.data?.attended ?? 0} />
          <Stat label="Graduates" value={apprentice.data?.graduated ?? 0} />
          <Stat label="Distinct users" value={apprentice.data?.distinctUsers ?? 0} />
        </div>
      </Section>
    </div>
  );
}

function ModerationTab() {
  const stats = trpc.pvpModeration.getModerationStats.useQuery();
  const open = trpc.pvpModeration.getOpenReports.useQuery({ limit: 100 });
  const utils = trpc.useUtils();
  const resolve = trpc.pvpModeration.resolveReport.useMutation({
    onSuccess: () => {
      utils.pvpModeration.getOpenReports.invalidate();
      utils.pvpModeration.getModerationStats.invalidate();
    },
  });
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Open" value={stats.data?.open ?? 0} />
        <Stat label="Resolved (action)" value={stats.data?.resolvedAction ?? 0} />
        <Stat label="Resolved (no action)" value={stats.data?.resolvedNoAction ?? 0} />
        <Stat label="Duplicates" value={stats.data?.duplicates ?? 0} />
      </div>
      <Section title="Open reports">
        {(open.data ?? []).length === 0 && (
          <p className="font-mono text-xs text-muted-foreground italic">No open reports.</p>
        )}
        <div className="space-y-2">
          {(open.data ?? []).map((r) => (
            <div key={r.id} className="border border-border/40 bg-secondary/20 rounded p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="font-mono text-xs font-bold">{r.targetKind} · target #{r.targetId}</p>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                </span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground">
                Reason: <span className="text-amber-400">{r.reason}</span> · reported by user {r.reporterId}
              </p>
              {r.contentSnapshot && (
                <p className="font-mono text-[10px] mt-1 italic break-all">"{r.contentSnapshot}"</p>
              )}
              {r.details && (
                <p className="font-mono text-[10px] mt-1 opacity-70">{r.details}</p>
              )}
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className="font-mono text-[10px] px-2 py-1 border border-red-400/40 text-red-400 rounded hover:bg-red-400/10"
                  onClick={() => resolve.mutate({ reportId: r.id, outcome: "resolved_action", applyAction: true })}
                >
                  ACTION + REVERT
                </button>
                <button
                  type="button"
                  className="font-mono text-[10px] px-2 py-1 border border-border/40 rounded hover:border-primary/40"
                  onClick={() => resolve.mutate({ reportId: r.id, outcome: "resolved_no_action" })}
                >
                  NO ACTION
                </button>
                <button
                  type="button"
                  className="font-mono text-[10px] px-2 py-1 border border-border/40 rounded hover:border-primary/40"
                  onClick={() => resolve.mutate({ reportId: r.id, outcome: "duplicate" })}
                >
                  DUPLICATE
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function AuditTab() {
  const audit = trpc.pvpModeration.getRevealAuditLog.useQuery({ limit: 100 });
  return (
    <div className="space-y-2">
      {(audit.data ?? []).map((evt) => (
        <div key={evt.id} className="border border-border/40 bg-secondary/20 rounded p-3 font-mono text-xs">
          <div className="flex justify-between">
            <span className="font-bold">{evt.eventKey}</span>
            <span className="text-[10px] text-muted-foreground">
              {evt.discoveredAt ? new Date(evt.discoveredAt).toLocaleString() : "—"}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            user {evt.firstDiscovererUserId}
            {evt.firstDiscovererGuildId ? ` · guild ${evt.firstDiscovererGuildId}` : ""}
            {evt.factionAlignment ? ` · faction ${evt.factionAlignment}` : ""}
            {evt.serverWideRevealedAt ? ` · server-wide revealed ${new Date(evt.serverWideRevealedAt).toLocaleString()}` : ""}
          </p>
        </div>
      ))}
      {(audit.data ?? []).length === 0 && (
        <p className="font-mono text-xs text-muted-foreground italic">No reveal events yet.</p>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-border/40 bg-secondary/10 rounded-lg p-4">
      <h3 className="font-display text-sm font-bold tracking-wider mb-3 uppercase">{title}</h3>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border/40 bg-secondary/20 rounded p-3 text-center">
      <p className="font-display text-2xl font-bold tabular-nums">{value}</p>
      <p className="font-mono text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
