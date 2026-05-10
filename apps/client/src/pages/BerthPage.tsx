/* ═══════════════════════════════════════════════════════
   BERTH PAGE — wraps BerthScene with route-driven member
   resolution.

   Route: /berth/:memberId
     memberId ∈ "apprentice_active" | "elara" | "the_human"
              | "vex_solene" | "wraith_calder" | "locke"
              | "jericho_jones" | "akai_shi"

   Resolves the PartyMember from existing app state (apprentice
   store, GameContext for Elara/Human stability, recruit flags)
   and hands it to BerthScene.

   File: apps/client/src/pages/BerthPage.tsx
   ═══════════════════════════════════════════════════════ */

import { useRoute, Link } from "wouter";
import { useGame } from "@/contexts/GameContext";
import { useApprenticeStore } from "@/stores/apprenticeStore";
import { stabilityBand, lightBand } from "@shared/companion";
import type { PartyMember } from "@shared/partyMember";
import { BerthScene } from "@/components/berth/BerthScene";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

export default function BerthPage() {
  const [, params] = useRoute("/berth/:memberId");
  const memberId = params?.memberId ?? "";
  const { state } = useGame();
  const apprentice = useApprenticeStore(s => s.current);

  const member = resolveMember(memberId, state, apprentice);

  if (!member) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <Link href="/ship/bunkroom" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 mb-3">
          <ChevronLeft className="w-4 h-4" /> back to bunkroom
        </Link>
        <Card>
          <CardContent className="p-6 text-slate-300">
            No one is at this bunk yet. The plate is unmarked.
          </CardContent>
        </Card>
      </div>
    );
  }

  // Roster: include Elara and Human (always-on for the comm screen),
  // plus the host if not already in the roster.
  const roster: PartyMember[] = [member];
  if (member.kind !== "elara") {
    const elara = buildElara(state);
    if (elara) roster.push(elara);
  }
  if (member.kind !== "human") {
    const human = buildHuman(state);
    if (human) roster.push(human);
  }

  // Back href: tier-1 (Elara/Human) → /ship; tier-2 + apprentice → /ship/bunkroom.
  const backHref =
    member.kind === "elara" || member.kind === "human" ? "/ship" : "/ship/bunkroom";

  return (
    <BerthScene
      member={member}
      roster={roster}
      state={
        member.kind === "apprentice"
          ? {
              bond: member.bond,
              corruption: member.corruption,
            }
          : member.kind === "elara"
          ? { elaraStability: member.stability }
          : member.kind === "human"
          ? { humanLight: member.light }
          : { bond: member.bond }
      }
      trialDay={member.kind === "apprentice" ? member.trialDay : undefined}
      backHref={backHref}
    />
  );
}

function resolveMember(
  memberId: string,
  state: ReturnType<typeof useGame>["state"],
  apprentice: ReturnType<typeof useApprenticeStore.getState>["current"],
): PartyMember | null {
  switch (memberId) {
    case "apprentice_active":
      if (!apprentice) return null;
      return {
        kind: "apprentice",
        id: "apprentice_active",
        apprenticeId: apprentice.id,
        displayName: apprentice.name,
        archetype: apprentice.archetype,
        gender: apprentice.gender,
        rarity: apprentice.rarity,
        bond: apprentice.bond,
        corruption: apprentice.corruption,
        trialDay: apprentice.trialDay,
      };
    case "elara":
      return buildElara(state);
    case "the_human":
      return buildHuman(state);
    case "vex_solene":
    case "wraith_calder":
    case "locke":
    case "jericho_jones":
    case "akai_shi":
      return buildRecruit(memberId, state);
    default:
      return null;
  }
}

function buildElara(state: ReturnType<typeof useGame>["state"]): PartyMember | null {
  const stability = state.elaraStability ?? 0;
  return {
    kind: "elara",
    id: "elara",
    displayName: "Elara",
    stability,
    stabilityBand: stabilityBand(stability),
  };
}

function buildHuman(state: ReturnType<typeof useGame>["state"]): PartyMember | null {
  const trust = state.humanTrust ?? 0;
  const light = state.humanLight ?? 0;
  // Reveal stage from trust thresholds (mirrors the canonical reveal pipeline).
  const revealStage: 0 | 1 | 2 | 3 | 4 =
    trust >= 50 ? 4 :
    trust >= 40 ? 3 :
    trust >= 20 ? 2 :
    trust >= 10 ? 1 :
    0;
  return {
    kind: "human",
    id: "the_human",
    displayName: "The Human",
    trust,
    light,
    lightBand: lightBand(light),
    revealStage,
  };
}

function buildRecruit(
  id: "vex_solene" | "wraith_calder" | "locke" | "jericho_jones" | "akai_shi",
  state: ReturnType<typeof useGame>["state"],
): PartyMember | null {
  const flag = `${id}_recruited`;
  const recruited = !!state.narrativeFlags[flag];
  if (!recruited) return null;
  const displayNames: Record<typeof id, string> = {
    vex_solene: "Vex Solene",
    wraith_calder: "Wraith Calder",
    locke: "Adjudicator Locke",
    jericho_jones: "Jericho Jones",
    akai_shi: "Akai Shi",
  };
  // Recruits don't have a unified bond store today; use neutral default.
  // Future: lift from per-NPC trust state once that lands.
  return {
    kind: "recruit",
    id,
    displayName: displayNames[id],
    bond: 50,
    recruited: true,
    recruitGateFlag: flag,
  };
}
