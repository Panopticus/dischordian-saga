/**
 * MolGarathAudienceOfferToast — Tier-3 climb → audience invitation
 *
 * Watches the chess climb state (via trpc.chessClimb.getState). When
 * the player has cleared Tier 3 (highestClearedRank >= 3) and has
 * not yet completed the Mol'Garath audience scene, surfaces a
 * floating affordance offering the audience.
 *
 * Mol'Garath canonically leaves Tier 3 without comment; this is
 * how the audience reaches the player. The runtime route /mol-garath
 * plays the existing MOL_GARATH_EPILOGUE scene; on completion the
 * page sets MOL_GARATH_AUDIENCE_FLAG, which suppresses this toast.
 *
 * If the player dismisses the toast, mol_garath_audience_offer_dismissed
 * is persisted and the toast stays hidden — the player can still
 * navigate to /mol-garath manually.
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollText, X } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { trpc } from "@/lib/trpc";
import { MOL_GARATH_AUDIENCE_FLAG } from "@shared/matrixSaveFlags";

const OFFER_DISMISSED_FLAG = "mol_garath_audience_offer_dismissed";

export default function MolGarathAudienceOfferToast() {
  const [location] = useLocation();
  const { state, setNarrativeFlag } = useGame();
  const [hidden, setHidden] = useState(false);

  const flags = state.narrativeFlags ?? {};
  const audienceComplete = Boolean(flags[MOL_GARATH_AUDIENCE_FLAG]);
  const dismissed = Boolean(flags[OFFER_DISMISSED_FLAG]);
  const onAudiencePage = location.startsWith("/mol-garath");

  const climbQuery = trpc.chessClimb.getState.useQuery(undefined, {
    refetchInterval: 60_000,
    staleTime: 60_000,
    retry: 1,
  });

  const tier3Cleared =
    (climbQuery.data?.unlocks?.highestClearedRank ?? -1) >= 3;

  const visible =
    tier3Cleared && !audienceComplete && !dismissed && !onAudiencePage && !hidden;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-24 right-6 z-50 max-w-xs rounded-lg border border-stone-600/40 bg-zinc-950/95 backdrop-blur p-4 shadow-lg"
          data-component="mol-garath-audience-offer"
        >
          <div className="flex items-start gap-3">
            <ScrollText size={20} className="text-stone-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-widest text-stone-400 mb-1">
                Mol'Garath the Unmaker
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed mb-3">
                The Archivist requests a private audience. He has not had a
                conversation like this in several centuries.
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href="/mol-garath-audience"
                  className="text-xs px-3 py-1.5 rounded-md border border-stone-500 bg-stone-900/40 hover:bg-stone-900/60 transition-colors"
                >
                  Accept the audience
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setHidden(true);
                    setNarrativeFlag(OFFER_DISMISSED_FLAG, true);
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHidden(true)}
              className="text-zinc-600 hover:text-zinc-300 shrink-0"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
