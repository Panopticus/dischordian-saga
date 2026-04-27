/* ═══════════════════════════════════════════════════════
   CONTRACT SIGNING MODAL — Phase 2.4

   Presents a multi-stage Trade Empire contract for player
   signature. Per the canonical Trade Empire deliverable:
   "Contract-signing scenes: new ContractSigningModal
   component. Player can negotiate terms (modify reward /
   hidden clause / faction-effect). Fires contract_signed
   ripple. Locke + Vex + Nilmorg each have authored signing
   dialog."

   Audit-on-signing toggle: per Locke canon §1.4, every
   contract has fine-print player can audit. If the player
   audits before signing, the canonical hidden clauses are
   surfaced and the audit-stance flag canonically propagates
   via crossCharacterReactions (Vex Maestro persona-shift,
   Locke's hidden-clause-trust-stance).
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import {
  X,
  FileSignature,
  EyeOff,
  Eye,
  AlertTriangle,
  Check,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  type ContractDef,
  clausesAtSigning,
} from "@shared/tradeEmpire/contracts";

interface ContractSigningModalProps {
  contract: ContractDef;
  isOpen: boolean;
  onClose: () => void;
  /** Optional: caller is notified after a successful signing. */
  onSigned?: (contractId: number | null, audited: boolean) => void;
}

export function ContractSigningModal({
  contract,
  isOpen,
  onClose,
  onSigned,
}: ContractSigningModalProps) {
  const [audited, setAudited] = useState(false);
  const [showLore, setShowLore] = useState(false);

  const onSigningClauses = useMemo(
    () => clausesAtSigning(contract),
    [contract],
  );

  const signMutation = trpc.tradeEmpire.signContract.useMutation({
    onSuccess: (result) => {
      if (result.alreadySigned) {
        toast.info("Contract already on file.");
      } else {
        toast.success(
          audited
            ? "Contract signed. Hidden clauses canonically acknowledged."
            : "Contract signed. Fine-print canonically deferred.",
        );
      }
      onSigned?.(result.contractId ?? null, audited);
      onClose();
    },
    onError: (err) => {
      toast.error(`Signing failed: ${err.message}`);
    },
  });

  const handleSign = () => {
    signMutation.mutate({
      contractKey: contract.contractKey,
      auditedOnSigning: audited,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="void-bg-sunk void-border w-full max-w-2xl overflow-hidden rounded-lg border shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="void-border flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2">
              <FileSignature className="void-text-accent h-5 w-5" />
              <h2 className="void-text-primary text-lg font-semibold">
                {contract.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="void-text-muted hover:void-text-primary"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Broker stamp + stage count */}
          <div className="void-bg-system void-border flex items-center justify-between border-b px-4 py-2 text-sm">
            <span className="void-text-muted">
              Broker: <span className="void-text-system">{contract.brokerKey}</span>
            </span>
            <span className="void-text-muted">
              {contract.stages.length}{" "}
              {contract.stages.length === 1 ? "stage" : "stages"}
            </span>
          </div>

          {/* Lore toggle */}
          <div className="p-4">
            <button
              onClick={() => setShowLore((v) => !v)}
              className="void-text-accent flex items-center gap-1 text-sm hover:underline"
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  showLore ? "rotate-90" : ""
                }`}
              />
              {showLore ? "Hide context" : "Show context"}
            </button>
            {showLore && (
              <p className="void-text-muted mt-2 text-sm italic">
                {contract.loreContext}
              </p>
            )}
          </div>

          {/* Stages list */}
          <div className="void-border space-y-2 border-t p-4">
            <h3 className="void-text-primary mb-2 text-sm font-semibold uppercase">
              Stages
            </h3>
            {contract.stages.map((stage, idx) => (
              <div
                key={stage.stageId}
                className="void-border flex items-start gap-3 rounded border p-2 text-sm"
              >
                <span className="void-text-muted font-mono">{idx + 1}.</span>
                <div className="flex-1">
                  <div className="void-text-primary font-medium">{stage.label}</div>
                  {stage.objective && (
                    <div className="void-text-muted mt-1 text-xs">
                      {stage.objective}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Audit toggle + clauses */}
          <div className="void-border void-bg-system border-t p-4">
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={audited}
                  onChange={(e) => setAudited(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="void-text-primary">
                  Audit fine-print before signing
                </span>
                {audited ? (
                  <Eye className="void-text-accent h-4 w-4" />
                ) : (
                  <EyeOff className="void-text-muted h-4 w-4" />
                )}
              </label>
              {onSigningClauses.length > 0 && !audited && (
                <span className="void-text-warning flex items-center gap-1 text-xs">
                  <AlertTriangle className="h-3 w-3" />
                  {onSigningClauses.length} clause
                  {onSigningClauses.length === 1 ? "" : "s"} hidden
                </span>
              )}
            </div>

            {audited && onSigningClauses.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="void-text-warning text-xs font-semibold uppercase">
                  Disclosed on Audit
                </div>
                {onSigningClauses.map((clause) => (
                  <div
                    key={clause.clauseId}
                    className="void-border void-bg-sunk rounded border p-2 text-xs"
                  >
                    <div className="void-text-warning font-medium">
                      {clause.label}
                    </div>
                    <div className="void-text-muted mt-1">{clause.text}</div>
                  </div>
                ))}
              </div>
            )}

            {audited && onSigningClauses.length === 0 && (
              <div className="void-text-muted mt-2 flex items-center gap-1 text-xs italic">
                <Check className="void-text-success h-3 w-3" />
                Audit canonically clean — no on-signing clauses.
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="void-border flex justify-end gap-2 border-t p-4">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSign}
              disabled={signMutation.isPending}
            >
              {signMutation.isPending ? "Signing…" : "Sign Contract"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
