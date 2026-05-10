/* ═══════════════════════════════════════════════════════
   AUDIT TRANSCRIPT — Day 7/14/21 Mechronis surveillance scenes.

   Two views:
     • Pending audit — runs the audit; shows the public
       transcript first (what the Mechronis sees), then the
       private transcript (what the apprentice felt).
     • Past audit log — list of completed audits with their
       classification + deltas applied.

   File: apps/client/src/components/apprentice/pedagogy/AuditTranscript.tsx
   ═══════════════════════════════════════════════════════ */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Eye, FileText, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { AuditDay } from "@shared/apprenticeMechronisAudits";

type DoctrineId =
  | "compliant_mouth" | "forked_path" | "cold_hand"
  | "heretical_quiet" | "human_remainder";

interface ApprenticeSnapshot {
  id: string;
  name: string;
  archetype: "zealot" | "ghost" | "scholar" | "revenant" | "artisan" | "oracle"
    | "wanderer" | "martyr" | "heretic" | "jester" | "sentinel" | "prodigal";
  rarity: "common" | "uncommon" | "rare" | "epic" | "mythic";
  bond: number;
  corruption: number;
  trialDay: number;
}

interface Props {
  apprentice: ApprenticeSnapshot;
  doctrineId: DoctrineId;
  architectInfluence: number;
  /** True when the apprentice carries a Memory-Card-inherited line that
   *  should fire on first_audit. Caller computes this. */
  inheritedFirstAuditLine?: { text: string };
}

const CLASSIFICATION_BADGE: Record<string, { label: string; tone: string }> = {
  compliant:    { label: "compliant",    tone: "bg-amber-900/30 text-amber-200" },
  ambiguous:    { label: "ambiguous",    tone: "bg-slate-800 text-slate-200" },
  noncompliant: { label: "noncompliant", tone: "bg-rose-900/30 text-rose-200" },
  withheld:     { label: "withheld",     tone: "bg-violet-900/30 text-violet-200" },
};

const CLASSIFICATION_ICON: Record<string, React.ReactNode> = {
  compliant: <ShieldCheck className="w-4 h-4 text-amber-300" />,
  ambiguous: <FileText className="w-4 h-4 text-slate-300" />,
  noncompliant: <Eye className="w-4 h-4 text-rose-300" />,
  withheld: <Lock className="w-4 h-4 text-violet-300" />,
};

export default function AuditTranscript({
  apprentice, doctrineId, architectInfluence, inheritedFirstAuditLine,
}: Props) {
  const utils = trpc.useUtils();
  const promptsQuery = trpc.apprenticePedagogy.auditPrompts.useQuery();
  const logQuery = trpc.apprenticePedagogy.auditList.useQuery({ apprenticeId: apprentice.id });
  const [expanded, setExpanded] = useState<AuditDay | null>(null);

  const run = trpc.apprenticePedagogy.auditRun.useMutation({
    onSuccess: (res) => {
      utils.apprenticePedagogy.auditList.invalidate({ apprenticeId: apprentice.id });
      if (!res.replayed) {
        toast.success(`Audit M-${res.outcome.day} complete: ${res.outcome.classification}`);
      }
    },
    onError: (e) => toast.error(e.message),
  });

  const log = logQuery.data ?? [];
  const prompts = promptsQuery.data;

  // Determine the next audit day eligible to run.
  const allDays: AuditDay[] = [7, 14, 21];
  const completed = new Set(log.map(l => l.day));
  const nextDue = allDays.find(d => apprentice.trialDay >= d && !completed.has(d)) ?? null;

  return (
    <div className="space-y-3">
      <div className="text-sm text-slate-300 px-1 flex items-center gap-2">
        <Eye className="w-4 h-4" />
        Mechronis Surveillance Audits — three scheduled across the trial.
      </div>

      {nextDue !== null && prompts && (
        <Card className="border-amber-900/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-5 h-5 text-amber-300" />
              {prompts[nextDue].title} — DUE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm italic text-slate-300 mb-3">
              "{prompts[nextDue].question}"
            </p>
            <div className="text-xs text-slate-500 mb-3">
              The auditor will not be present in the room with you. {apprentice.name} will be questioned alone.
              You will see the transcript afterward.
            </div>
            <Button
              className="w-full"
              disabled={run.isPending}
              onClick={() => run.mutate({
                apprentice: {
                  id: apprentice.id, name: apprentice.name,
                  archetype: apprentice.archetype, rarity: apprentice.rarity,
                  bond: apprentice.bond, corruption: apprentice.corruption,
                  trialDay: apprentice.trialDay,
                },
                doctrineId,
                auditDay: nextDue,
                architectInfluenceAtAudit: architectInfluence,
                fireInheritedLine: !!inheritedFirstAuditLine && nextDue === 7,
                inheritedLineText: inheritedFirstAuditLine?.text,
              })}
            >
              {run.isPending ? "Auditing..." : `Submit ${apprentice.name} for Audit M-${nextDue}`}
            </Button>
          </CardContent>
        </Card>
      )}

      {log.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Audit Log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {log
              .sort((a, b) => a.day - b.day)
              .map(entry => {
                const meta = CLASSIFICATION_BADGE[entry.classification] ?? CLASSIFICATION_BADGE.ambiguous;
                const isOpen = expanded === entry.day;
                return (
                  <div key={entry.day} className="border border-slate-800 rounded">
                    <button
                      className="w-full p-3 flex items-center justify-between hover:bg-slate-900/40"
                      onClick={() => setExpanded(isOpen ? null : entry.day)}
                    >
                      <div className="flex items-center gap-2">
                        {CLASSIFICATION_ICON[entry.classification]}
                        <span className="text-sm font-medium">M-{entry.day}</span>
                        <Badge className={`${meta.tone} text-xs`}>{meta.label}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">
                          bond {entry.bondDelta >= 0 ? "+" : ""}{entry.bondDelta}
                          {" · "}
                          corrupt {entry.corruptionDelta >= 0 ? "+" : ""}{entry.corruptionDelta}
                          {" · "}
                          arch {entry.architectInfluenceDelta >= 0 ? "+" : ""}{entry.architectInfluenceDelta}
                        </span>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="p-3 border-t border-slate-800 space-y-3">
                        <div>
                          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                            Public — Mechronis ledger
                          </div>
                          <div className="text-xs text-slate-300 italic whitespace-pre-wrap">
                            {entry.publicTranscript}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                            Private — what {apprentice.name} actually said
                          </div>
                          <div className="text-xs text-slate-200 whitespace-pre-wrap">
                            {entry.privateTranscript}
                          </div>
                        </div>
                        {entry.inheritedLineFired && (
                          <Badge className="bg-violet-900/30 text-violet-200 text-xs">
                            Inherited line fired
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
