/* ═══════════════════════════════════════════════════════
   LockeConfidentialLedgerPanel

   Renders Adjudicator Locke's Confidential Ledger inside the
   Trade Empire surface. Locke's trust band is read
   server-side from the canonical npc_trust table — no
   client-side stand-in.

   Three sections:
     • Pending Payouts — cross-system credits Locke has issued
       and the player can claim into the receiving subsystem.
     • Available — contracts signable now (pitch + collapsible
       fine print + cost + payout + SIGN).
     • Locked / Completed — visible for context.

   Voice surface only — apps/shared/lockeConfidentialLedger.ts
   owns the pitches, fine print, and close lines.
   ═══════════════════════════════════════════════════════ */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileSignature, ChevronDown, Check, Lock as LockIcon, Coins } from "lucide-react";
import { useLockeLedger, type SignResult } from "@/hooks/useLockeLedger";
import type { LedgerEntry, LedgerPayoutKind } from "@shared/lockeConfidentialLedger";
import type { PendingPayouts } from "@shared/engagementPersistence";

export interface LockeConfidentialLedgerPanelProps {
  /**
   * Apply a claimed payout to the receiving subsystem. Called
   * before the server-side accumulator is debited; if the panel
   * doesn't supply an onClaim, or onClaim throws, no debit
   * happens. Implementations should be idempotent.
   */
  onClaim?: (kind: LedgerPayoutKind, amount: number) => void | Promise<void>;
  /**
   * Kinds the page cannot currently apply (eg celebration_bond
   * when there is no active apprentice). The panel disables the
   * CLAIM button + shows an explanatory hint for these kinds.
   */
  disabledKinds?: ReadonlySet<LedgerPayoutKind>;
  /**
   * Reason text the panel surfaces when a claim is disabled. Keyed
   * by kind. Pages that don't supply a reason fall through to a
   * generic "no eligible target" message.
   */
  disabledReasons?: Partial<Record<LedgerPayoutKind, string>>;
}

const PAYOUT_LABEL: Record<LedgerPayoutKind, string> = {
  crew_xp:               "Crew XP",
  army_recruitment:      "Army Recruitment",
  celebration_bond:      "Celebration Bond",
  mechronis_approval:    "Mechronis Approval",
  trade_reputation:      "Trade Reputation",
};

const REASON_LABEL: Record<string, string> = {
  trust_band_too_low:        "Locke does not yet treat you at this tier.",
  insufficient_reputation:   "Reputation insufficient.",
  prerequisite_not_completed: "An earlier contract is required first.",
  already_completed:         "This contract is already on file.",
  unknown_entry:             "Unknown contract.",
};

export function LockeConfidentialLedgerPanel({
  onClaim,
  disabledKinds,
  disabledReasons,
}: LockeConfidentialLedgerPanelProps) {
  const ledger = useLockeLedger();
  const [expandedFinePrint, setExpandedFinePrint] = React.useState<Set<string>>(new Set());
  const [showCompleted, setShowCompleted] = React.useState(false);

  const toggleFinePrint = (id: string) => {
    setExpandedFinePrint(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const completedIds = new Set(ledger.completedIds);
  const availableIds = new Set(ledger.available.map(e => e.id));
  const lockedEntries = ledger.catalog.filter(
    e => !availableIds.has(e.id) && !completedIds.has(e.id),
  );
  const completedEntries = ledger.catalog.filter(e => completedIds.has(e.id));

  const handleClaim = async (kind: LedgerPayoutKind) => {
    const amount = ledger.pendingPayouts[kind];
    if (amount <= 0) return;
    if (disabledKinds?.has(kind)) return;
    if (!onClaim) return;
    // Page applies first; if it throws we don't debit the server.
    try {
      await onClaim(kind, amount);
    } catch {
      return;
    }
    await ledger.claim(kind, amount);
  };

  return (
    <div className="space-y-4">
      {/* Header — Locke metadata */}
      <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
        <div className="flex items-center gap-2 mb-1">
          <FileSignature size={14} className="text-primary" />
          <h3 className="font-display text-sm font-bold tracking-wide">
            CONFIDENTIAL LEDGER
          </h3>
          <span className="ml-auto font-mono text-[10px] opacity-60 tracking-[0.15em]">
            BAND: <span className="text-primary">{ledger.band.toUpperCase()}</span>
            <span className="opacity-50 mx-1.5">·</span>
            TRUST: <span className="text-primary">{ledger.trust}</span>
          </span>
        </div>
        <p className="text-xs leading-relaxed opacity-80">
          Adjudicator Locke. Side-contracts payable in currencies other than
          trade. The fine print is mine; you may audit on signing.
        </p>
      </div>

      {/* Pending payouts — cross-system credits awaiting claim */}
      <PendingPayoutsCard
        payouts={ledger.pendingPayouts}
        onClaim={handleClaim}
        claiming={ledger.claiming}
        disabledKinds={disabledKinds}
        disabledReasons={disabledReasons}
      />

      {/* Result banner — appears after any sign attempt */}
      <AnimatePresence>
        {ledger.current && (
          <motion.div
            key={ledger.current.entry.id + (ledger.current.result.success ? "-ok" : "-no")}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`rounded-md border p-3 ${
              ledger.current.result.success
                ? "border-primary/40 bg-primary/5"
                : "border-destructive/40 bg-destructive/5"
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[10px] tracking-[0.2em] text-primary">
                {ledger.current.result.success ? "CONTRACT FILED" : "CONTRACT DECLINED"}
              </span>
              <button
                onClick={ledger.dismiss}
                className="ml-auto font-mono text-[10px] opacity-60 hover:opacity-100"
              >
                DISMISS
              </button>
            </div>
            <ResultLine result={ledger.current.result} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available contracts */}
      {ledger.available.length > 0 && (
        <div className="space-y-2">
          <div className="font-mono text-[10px] tracking-[0.2em] opacity-60">
            AVAILABLE
          </div>
          {ledger.available.map(entry => (
            <ContractCard
              key={entry.id}
              entry={entry}
              status="available"
              expandedFinePrint={expandedFinePrint.has(entry.id)}
              onToggleFinePrint={() => toggleFinePrint(entry.id)}
              onSign={() => ledger.sign(entry.id)}
              signing={ledger.signing}
            />
          ))}
        </div>
      )}

      {/* Locked contracts */}
      {lockedEntries.length > 0 && (
        <div className="space-y-2">
          <div className="font-mono text-[10px] tracking-[0.2em] opacity-60">
            LOCKED
          </div>
          {lockedEntries.map(entry => (
            <ContractCard
              key={entry.id}
              entry={entry}
              status="locked"
              expandedFinePrint={false}
              onToggleFinePrint={() => {}}
              onSign={() => {}}
              signing={false}
            />
          ))}
        </div>
      )}

      {/* Completed contracts */}
      {completedEntries.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(s => !s)}
            className="w-full flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] opacity-60 hover:opacity-100"
          >
            <ChevronDown
              size={12}
              className={`transition-transform ${showCompleted ? "rotate-0" : "-rotate-90"}`}
            />
            COMPLETED ({completedEntries.length})
          </button>
          {showCompleted && (
            <div className="space-y-2 mt-2">
              {completedEntries.map(entry => (
                <ContractCard
                  key={entry.id}
                  entry={entry}
                  status="completed"
                  expandedFinePrint={false}
                  onToggleFinePrint={() => {}}
                  onSign={() => {}}
                  signing={false}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {ledger.catalog.length === 0 && (
        <div className="text-center py-8 opacity-50 font-mono text-[10px]">
          Loading ledger...
        </div>
      )}
    </div>
  );
}

function PendingPayoutsCard({
  payouts,
  onClaim,
  claiming,
  disabledKinds,
  disabledReasons,
}: {
  payouts: PendingPayouts;
  onClaim: (kind: LedgerPayoutKind) => void;
  claiming: boolean;
  disabledKinds?: ReadonlySet<LedgerPayoutKind>;
  disabledReasons?: Partial<Record<LedgerPayoutKind, string>>;
}) {
  const entries = (Object.keys(payouts) as LedgerPayoutKind[])
    .filter(k => payouts[k] > 0)
    .map(k => ({ kind: k, amount: payouts[k] }));

  if (entries.length === 0) return null;

  return (
    <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Coins size={12} className="text-primary" />
        <span className="font-mono text-[10px] text-primary tracking-[0.2em]">
          PENDING PAYOUTS
        </span>
      </div>
      <div className="space-y-1.5">
        {entries.map(({ kind, amount }) => {
          const disabled = disabledKinds?.has(kind) ?? false;
          const reason = disabled
            ? (disabledReasons?.[kind] ?? "No eligible target right now.")
            : null;
          return (
            <div
              key={kind}
              className="flex items-center justify-between gap-2 rounded border border-border/30 bg-background/30 px-2 py-1.5"
            >
              <div className="flex-1 min-w-0">
                <div className="font-display text-xs font-bold">
                  {PAYOUT_LABEL[kind]}
                </div>
                <div className="font-mono text-[10px] opacity-60 truncate">
                  {disabled ? reason : `${amount} owing`}
                </div>
              </div>
              <button
                onClick={() => onClaim(kind)}
                disabled={claiming || disabled}
                title={disabled ? reason ?? "Disabled" : undefined}
                className="px-2 py-1 rounded bg-primary/10 border border-primary/40 text-primary text-[10px] font-mono hover:bg-primary/20 transition-all tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {disabled ? "PENDING" : "CLAIM"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContractCard({
  entry,
  status,
  expandedFinePrint,
  onToggleFinePrint,
  onSign,
  signing,
}: {
  entry: LedgerEntry;
  status: "available" | "locked" | "completed";
  expandedFinePrint: boolean;
  onToggleFinePrint: () => void;
  onSign: () => void;
  signing: boolean;
}) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";

  return (
    <div
      className={`rounded-md border p-3 ${
        isCompleted
          ? "border-primary/20 bg-background/30 opacity-70"
          : isLocked
            ? "border-border/40 bg-background/30 opacity-50"
            : "border-primary/30 bg-background/50"
      }`}
    >
      <div className="flex items-start gap-2 mb-1">
        {isCompleted && <Check size={12} className="text-primary mt-0.5" />}
        {isLocked && <LockIcon size={12} className="opacity-50 mt-0.5" />}
        <h4 className="font-display text-sm font-bold tracking-wide flex-1">
          {entry.title}
        </h4>
        <span className="font-mono text-[9px] opacity-60 tracking-[0.15em]">
          TIER {entry.tier}
        </span>
      </div>

      <p className="text-xs leading-relaxed mb-2 opacity-90">{entry.pitch}</p>

      {!isLocked && !isCompleted && (
        <button
          onClick={onToggleFinePrint}
          className="w-full text-left font-mono text-[9px] tracking-[0.2em] opacity-70 hover:opacity-100 mb-2"
        >
          <ChevronDown
            size={10}
            className={`inline mr-1 transition-transform ${expandedFinePrint ? "rotate-0" : "-rotate-90"}`}
          />
          AUDIT FINE PRINT
        </button>
      )}

      {expandedFinePrint && (
        <div className="border-l-2 border-primary/40 pl-3 mb-2">
          <p className="text-xs italic opacity-80 leading-relaxed">{entry.finePrint}</p>
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] font-mono mb-2">
        <span className="opacity-60">
          COST: <span className="text-primary">{entry.reputationCost} TRUST</span>
        </span>
        <span className="opacity-60">
          PAYS: <span className="text-primary">{entry.payout.amount} {PAYOUT_LABEL[entry.payout.kind]}</span>
        </span>
      </div>

      {status === "available" && (
        <button
          onClick={onSign}
          disabled={signing}
          className="w-full px-3 py-1.5 rounded-md bg-primary/10 border border-primary/40 text-primary text-[11px] font-mono hover:bg-primary/20 transition-all tracking-wide disabled:opacity-50"
        >
          {signing ? "FILING..." : "SIGN"}
        </button>
      )}
    </div>
  );
}

function ResultLine({ result }: { result: SignResult }) {
  if (result.success && result.closeLine) {
    return <p className="text-xs leading-relaxed">{result.closeLine}</p>;
  }
  if (!result.success && result.reason) {
    return (
      <p className="text-xs leading-relaxed opacity-90">
        {REASON_LABEL[result.reason] ?? result.reason}
      </p>
    );
  }
  return null;
}
