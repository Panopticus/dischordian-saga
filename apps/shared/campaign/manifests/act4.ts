/* ═══════════════════════════════════════════════════════
   ACT 4 — THE REVELATION (canonical manifest)

   Plan §2.1 #1 — the first real-content ActManifest. The
   existing Act 4 page (apps/client/src/pages/Act4MatchPage.tsx)
   hard-codes the flag-resolution order; this manifest moves
   that knowledge into the canonical campaign data layer so
   the eventual CampaignRunPage can drive Act 4 from data
   alone.

   Three flag-gated paths, evaluated in declaration order
   (matches `resolveAct4Dialog()` in
   apps/shared/act4OpponentDialog.ts):

     1. act1_path_A         → The Bridge        (Willing Disclosure)
     2. act3_full_secret    → Elara, Betrayed   (Betrayal)
     3. act3_partial_share  → Elara, Learning   (Discovery)

   No `defaultBranch`: when no flag matches, the player has
   not yet made the upstream Act 3 Offer choice, and the page
   renders a "path not yet resolved" state pointing them
   back to Act 3.

   Encounter ids match `ACT_4_OPPONENTS` in
   apps/shared/acts2to7Opponents.ts; faction values mirror
   the opponent's `deckLeaning[0]`.
   ═══════════════════════════════════════════════════════ */
import type { ActManifest } from "../actManifest";

export const ACT_4_MANIFEST: ActManifest = {
  actId: "4",
  title: "Act 4 · The Revelation",
  subtitle: "The match that resolves the Offer.",
  unlockFlag: "act_4_started",
  startFlag: "act_4_started",
  completionFlag: "act_4_complete",
  defaultDialogBankId: "act4OpponentDialog",
  surface: {
    mode: "branching",
    branches: [
      {
        // Path A — Willing Disclosure: the player declared
        // their hand in Act 1. Elara + the Human co-deal.
        requires: "act1_path_A",
        encounter: {
          encounterId: "act4_the_bridge",
          name: "The Bridge",
          faction: "neutral",
          preMatchBlurb:
            "Path A · Willing Disclosure — Elara and the Human play the same side of the table.",
        },
      },
      {
        // Path C — Betrayal: the secret was kept all the way
        // through Act 3. Evaluated BEFORE Path B so that a
        // player carrying both flags lands on the Betrayal
        // variant (matches the existing resolver's precedence).
        requires: "act3_full_secret",
        encounter: {
          encounterId: "act4_the_betrayal",
          name: "Elara, Betrayed",
          faction: "architect",
          preMatchBlurb:
            "Path C · Betrayal — the Ark's lights flicker on her turn.",
        },
      },
      {
        // Path B — Discovery: the secret was partially shared.
        // Elara processes what she just found in her own substrate.
        requires: "act3_partial_share",
        encounter: {
          encounterId: "act4_the_discovery",
          name: "Elara, Learning",
          faction: "architect",
          preMatchBlurb:
            "Path B · Discovery — she plays to think, not to win.",
        },
      },
    ],
    // No defaultBranch — see header comment.
  },
};
