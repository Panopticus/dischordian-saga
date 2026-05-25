/* ═══════════════════════════════════════════════════════
   WINBACK OFFER MODAL — lapsed-player comeback grant

   Fires once per session when the player logs in and the
   server reports a claimable winback offer. The grant is a
   Dream-token comeback reward scaled by lapse length and
   prior investment (see apps/server/services/winbackOfferService.ts).

   Lifecycle:
   1. trpc.winback.offer returns null for a non-lapsed user
      (≥ MIN_LAPSE_DAYS since last login) and the modal stays
      silent.
   2. For a lapsed user the offer carries tier + rewardDream +
      claimable. We show the modal exactly once per session;
      dismiss-state lives in a ref so a re-render won't re-open.
   3. Clicking "Claim" runs trpc.winback.claim. The server is
      idempotent per lapse-key (anti-farm); a retry is a no-op.
   4. On success we display the granted amount, then auto-close
      after a short reveal.

   Mounted in AppShellImmersive so it triggers regardless of
   which page the player lands on after login.
   ═══════════════════════════════════════════════════════ */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

type Tier = "drifting" | "lapsed" | "lost";

const TIER_HEADLINE: Record<Tier, string> = {
  drifting: "We saved your seat.",
  lapsed: "It's been a while.",
  lost: "Welcome back, captain.",
};

const TIER_FLAVOR: Record<Tier, string> = {
  drifting: "A short detour. The Ark kept your station warm.",
  lapsed: "The crew noticed you were gone. They held the line.",
  lost: "The long dark is over. Your console powered back on.",
};

export default function WinbackOfferModal() {
  // Session-level suppression: once dismissed (or claimed) this
  // session, don't re-open even if the offer query refetches.
  const dismissedRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [grantedDream, setGrantedDream] = useState<number | null>(null);

  const offerQuery = trpc.winback.offer.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const claimMutation = trpc.winback.claim.useMutation();

  useEffect(() => {
    if (dismissedRef.current) return;
    const offer = offerQuery.data;
    if (!offer) return;
    if (!offer.claimable) return;
    setOpen(true);
  }, [offerQuery.data]);

  // Auto-close after success reveal.
  useEffect(() => {
    if (grantedDream === null) return;
    const t = window.setTimeout(() => {
      dismissedRef.current = true;
      setOpen(false);
    }, 2500);
    return () => window.clearTimeout(t);
  }, [grantedDream]);

  const dismiss = () => {
    dismissedRef.current = true;
    setOpen(false);
  };

  const claim = async () => {
    if (claimMutation.isPending) return;
    const result = await claimMutation.mutateAsync();
    if (result.claimed && typeof result.rewardDream === "number") {
      setGrantedDream(result.rewardDream);
    } else {
      dismiss();
    }
  };

  const offer = offerQuery.data;
  if (!offer || !offer.claimable) return null;

  const tier = offer.tier as Tier;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="winback-headline"
        >
          <div
            className="absolute inset-0 bg-black/70"
            onClick={dismiss}
            aria-hidden="true"
          />
          <motion.div
            className="relative max-w-md w-full rounded-2xl border border-white/10 bg-neutral-950/95 p-6 shadow-2xl"
            initial={{ scale: 0.92, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 4 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="absolute right-3 top-3 p-1 opacity-60 hover:opacity-100"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-70 mb-2">
              <Sparkles size={14} />
              <span>Comeback grant</span>
            </div>

            <h2
              id="winback-headline"
              className="text-2xl font-semibold mb-2"
            >
              {TIER_HEADLINE[tier]}
            </h2>
            <p className="text-sm opacity-80 mb-4">{TIER_FLAVOR[tier]}</p>

            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 mb-5">
              <div className="text-xs opacity-60">Reward</div>
              <div className="text-xl font-medium">
                {grantedDream ?? offer.rewardDream} Dream
              </div>
              <div className="text-xs opacity-60 mt-1">
                {offer.daysAway} days away
              </div>
            </div>

            {grantedDream === null ? (
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={dismiss}
                  className="text-sm opacity-70 hover:opacity-100"
                >
                  Not now
                </button>
                <button
                  type="button"
                  onClick={claim}
                  disabled={claimMutation.isPending}
                  className="rounded-md bg-white/90 text-black px-4 py-2 text-sm font-medium disabled:opacity-50"
                >
                  {claimMutation.isPending ? "Claiming…" : "Claim"}
                </button>
              </div>
            ) : (
              <div className="text-center text-sm opacity-80">
                Granted. The Ark logs you back in.
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
