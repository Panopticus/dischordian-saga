/* ═══════════════════════════════════════════════════════
   ACT 4 MATCH PAGE — manifest-driven shell

   First production migration onto `CampaignRunPage`. The
   page is now a thin binding: it composes the canonical
   `ACT_4_MANIFEST` (apps/shared/campaign/manifests/act4.ts)
   with the `ACT_4_ADAPTER` (./act4Adapter.tsx) that owns
   the per-act content + side effects.

   Prior implementation (state machine, taunt overlay,
   chapter-intro routing, cross-game beat fire) is preserved
   bit-for-bit — see the adapter for the side-effect surface
   and CampaignRunPage for the state-machine surface.
   ═══════════════════════════════════════════════════════ */
import { ACT_4_MANIFEST } from "@shared/campaign/manifests/act4";
import CampaignRunPage from "./CampaignRunPage";
import { ACT_4_ADAPTER } from "./act4Adapter";

export default function Act4MatchPage() {
  return <CampaignRunPage manifest={ACT_4_MANIFEST} adapter={ACT_4_ADAPTER} />;
}
