/* ═══════════════════════════════════════════════════════
   CREW ROSTER PAGE — Bloodlines, Breeding & Cloning

   The hub for the crew management system. Contains:
   - Roster grid with role assignment
   - Incubator pods with start/repair/hatch actions
   - Breeding selector with inheritance preview
   - Bloodline dynasty viewer
   - Crew missions dispatch
   - Memorial wall
   - Activity feed
   ═══════════════════════════════════════════════════════ */

import { Suspense, lazy, useEffect, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronLeft,
  Users,
  Dna,
  Heart,
  Skull,
  Rocket,
  Radio,
  Crown,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useGame } from "@/contexts/GameContext";
import {
  createBloodline,
  getTemplate,
  type BloodlineId,
} from "@/game/crewGenetics";
import { cloneFromTemplate, buildPendingOffspring, realizeOffspring } from "@/game/crewBirth";
import type { CrewState } from "@shared/crewPersistence";

// Lazy-load heavy sub-views
const CrewRosterView = lazy(() => import("@/components/crew/CrewRosterView"));
const IncubatorMonitor = lazy(() => import("@/components/crew/IncubatorMonitor"));
const BreedingSelector = lazy(() => import("@/components/crew/BreedingSelector"));
const BloodlineViewer = lazy(() => import("@/components/crew/BloodlineViewer"));
const CrewMissionsBoard = lazy(() => import("@/components/crew/CrewMissionsBoard"));
const MemorialWall = lazy(() => import("@/components/crew/MemorialWall"));
const CrewActivityFeed = lazy(() => import("@/components/crew/CrewActivityFeed"));
const OffspringReviewModal = lazy(() => import("@/components/crew/OffspringReviewModal"));
const CloneFromTemplateModal = lazy(() => import("@/components/crew/CloneFromTemplateModal"));
const CrewDangerEventModal = lazy(() => import("@/components/crew/CrewDangerEventModal"));

type Tab =
  | "roster"
  | "incubator"
  | "breeding"
  | "bloodlines"
  | "missions"
  | "memorial"
  | "feed";

export default function CrewRosterPage() {
  const { setNarrativeFlag, state: gameState } = useGame();
  const [tab, setTab] = useState<Tab>("roster");
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [reviewOffspringId, setReviewOffspringId] = useState<string | null>(null);
  const [showDangerModal, setShowDangerModal] = useState(false);

  const { data: crewState, refetch, isLoading } = trpc.crew.getState.useQuery(undefined, {
    refetchInterval: 30000,
  });

  // Sync narrative flags back into GameContext as crew state advances
  useEffect(() => {
    if (!crewState) return;
    const cs = crewState as CrewState;
    if (cs.crewSystemUnlocked && !gameState.narrativeFlags.crew_system_unlocked) {
      setNarrativeFlag("crew_system_unlocked");
    }
    if (cs.firstCrewMemberBorn && !gameState.narrativeFlags.first_crew_member_born) {
      setNarrativeFlag("first_crew_member_born");
    }
    if (cs.generation2Reached && !gameState.narrativeFlags.crew_generation_2) {
      setNarrativeFlag("crew_generation_2");
    }
  }, [crewState, gameState.narrativeFlags, setNarrativeFlag]);

  // Passive threat-scan: ~25% chance per real day, auto-opens the danger modal
  // when the player visits /crew if a threat event triggers. Gated by the
  // localStorage key so we only roll once per day.
  useEffect(() => {
    const cs = crewState as CrewState | undefined;
    if (!cs || cs.roster.members.length === 0) return;
    const key = `crew-threat-scan-last-day`;
    const today = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem(key) === today) return;
    localStorage.setItem(key, today);
    // 25% chance per day
    if (Math.random() < 0.25) {
      setShowDangerModal(true);
      toast.warning("Security alert: threat detected on the Ark");
    }
  }, [crewState]);

  const foundBloodline = trpc.crew.foundBloodline.useMutation({
    onSuccess: () => refetch(),
    onError: (e: any) => toast.error(e.message),
  });
  const startIncubation = trpc.crew.startIncubation.useMutation({
    onSuccess: () => {
      toast.success("Incubation started");
      refetch();
    },
    onError: (e: any) => toast.error(e.message),
  });
  const repairPod = trpc.crew.repairPod.useMutation({
    onSuccess: () => {
      toast.success("Pod repaired");
      refetch();
    },
    onError: (e: any) => toast.error(e.message),
  });
  const cancelIncubation = trpc.crew.cancelIncubation.useMutation({
    onSuccess: () => refetch(),
    onError: (e: any) => toast.error(e.message),
  });
  const hatchPod = trpc.crew.hatchPod.useMutation({
    onSuccess: data => {
      toast.success(`${data.member?.name ?? "New crew"} joined the roster`);
      refetch();
    },
    onError: (e: any) => toast.error(e.message),
  });
  const assignRole = trpc.crew.assignRole.useMutation({
    onSuccess: () => refetch(),
    onError: (e: any) => toast.error(e.message),
  });
  const recordOffspring = trpc.crew.recordOffspring.useMutation({
    onSuccess: () => refetch(),
    onError: (e: any) => toast.error(e.message),
  });
  const dismissOffspring = trpc.crew.dismissOffspring.useMutation({
    onSuccess: () => refetch(),
    onError: (e: any) => toast.error(e.message),
  });
  const bootstrap = trpc.crew.bootstrap.useMutation({
    onSuccess: data => {
      if (data.founder) toast.success(`${data.founder.name} has stirred in Pod 01`);
      refetch();
    },
    onError: () => {
      /* silent — already bootstrapped */
    },
  });

  // First-visit seed: once the crew system is unlocked and the roster is
  // empty (new save, no deceased either), auto-call bootstrap once.
  useEffect(() => {
    const cs = crewState as CrewState | undefined;
    if (!cs) return;
    if (!cs.crewSystemUnlocked) return;
    if (cs.roster.members.length > 0 || cs.roster.deceased.length > 0) return;
    if (bootstrap.isPending || bootstrap.isSuccess) return;
    bootstrap.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crewState]);

  const cs = (crewState as CrewState | undefined) ?? null;
  const activeMemberCount = cs?.roster.members.filter(m => m.status === "active").length ?? 0;
  const incubatingCount = cs?.incubator.pods.filter(p => p.status === "gestating").length ?? 0;
  const readyCount = cs?.incubator.pods.filter(p => p.status === "ready").length ?? 0;
  const malfunctionCount = cs?.incubator.pods.filter(p => p.status === "malfunction").length ?? 0;
  const foundedBloodlineCount = cs ? Object.keys(cs.bloodlines).length : 0;
  const missionActiveCount = cs?.missions.filter(m => m.status === "dispatched").length ?? 0;

  const handleClone = async (templateId: string, bloodlineId: BloodlineId) => {
    if (!cs) return;
    // Ensure bloodline is founded
    if (!cs.bloodlines[bloodlineId]) {
      const bl = createBloodline(bloodlineId);
      await foundBloodline.mutateAsync({ bloodlineId, bloodline: bl as any });
    }
    const template = getTemplate(templateId);
    if (!template) return;
    const rarityHours: Record<string, number> = {
      common: 4,
      uncommon: 8,
      rare: 12,
      exotic: 24,
    };
    // Find first empty pod
    const emptyPod = cs.incubator.pods.find(p => p.status === "empty");
    if (!emptyPod) {
      toast.error("No empty incubator pods");
      return;
    }
    await startIncubation.mutateAsync({
      podId: emptyPod.id,
      templateId,
      bloodlineId,
      generation: 1,
      parentIds: null,
      rarityHours: rarityHours[template.rarity] ?? 8,
      traits: [],
      pendingOffspringId: null,
    });
    setShowCloneModal(false);
  };

  const handleBreed = async (parent1Id: string, parent2Id: string) => {
    if (!cs) return;
    const p1 = cs.roster.members.find(m => m.id === parent1Id);
    const p2 = cs.roster.members.find(m => m.id === parent2Id);
    if (!p1 || !p2) return;
    // Pass living + deceased roster so the LCA walk can reach dead ancestors
    const fullRoster = [...cs.roster.members, ...cs.roster.deceased];
    const pending = buildPendingOffspring(p1, p2, fullRoster);
    await recordOffspring.mutateAsync({ pending: pending as any });
    setReviewOffspringId(pending.id);
    toast.success("Breeding complete — review the offspring");
  };

  const handleHatch = async (podId: number) => {
    if (!cs) return;
    const pod = cs.incubator.pods.find(p => p.id === podId);
    if (!pod || pod.status !== "ready" || !pod.templateId || !pod.bloodlineId) return;
    const currentCycle = Date.now();
    let member;
    if (pod.parentIds) {
      // This pod came from breeding; look for matching pending offspring (pre-hatch)
      const pending = cs.pendingOffspring.find(
        p => p.parent1Id === pod.parentIds![0] && p.parent2Id === pod.parentIds![1],
      );
      if (pending) {
        member = realizeOffspring(pending, pod.templateId, currentCycle);
      }
    }
    if (!member) {
      member = cloneFromTemplate(pod.templateId, pod.bloodlineId as BloodlineId, currentCycle);
    }
    await hatchPod.mutateAsync({ podId, member: member as any });
  };

  if (isLoading || !cs) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pendingForReview =
    reviewOffspringId != null
      ? cs.pendingOffspring.find(p => p.id === reviewOffspringId)
      : null;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/ark">
            <Button variant="ghost" size="sm">
              <ChevronLeft size={16} />
              Ark
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-lg font-bold tracking-wide">CREW MANIFEST</h1>
            <p className="font-mono text-[11px] text-muted-foreground">
              {activeMemberCount} / {cs.roster.maxCapacity} active  ·  {foundedBloodlineCount}{" "}
              bloodline{foundedBloodlineCount === 1 ? "" : "s"}  ·  gen{" "}
              {cs.roster.generationRecord}
            </p>
          </div>
          {cs.roster.members.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowDangerModal(true)}
              className="gap-1"
              title="Scan for active threats"
            >
              <AlertTriangle size={14} />
              Threat Scan
            </Button>
          )}
          <Button size="sm" onClick={() => setShowCloneModal(true)} className="gap-1">
            <Dna size={14} />
            Clone from Archive
          </Button>
        </div>
      </div>

      {/* Quick-status ribbon */}
      {(readyCount > 0 || malfunctionCount > 0 || cs.pendingOffspring.length > 0) && (
        <div className="max-w-6xl mx-auto px-4 pt-3">
          <div className="flex flex-wrap gap-2">
            {readyCount > 0 && (
              <Badge variant="default" className="gap-1">
                <Heart size={12} />
                {readyCount} pod{readyCount === 1 ? "" : "s"} ready to hatch
              </Badge>
            )}
            {malfunctionCount > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle size={12} />
                {malfunctionCount} pod{malfunctionCount === 1 ? "" : "s"} malfunctioning
              </Badge>
            )}
            {cs.pendingOffspring.length > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Dna size={12} />
                {cs.pendingOffspring.length} offspring awaiting review
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 pt-4">
        <Tabs value={tab} onValueChange={v => setTab(v as Tab)}>
          <TabsList className="grid grid-cols-7 w-full">
            <TabsTrigger value="roster" className="gap-1">
              <Users size={14} />
              Roster
            </TabsTrigger>
            <TabsTrigger value="incubator" className="gap-1">
              <Dna size={14} />
              Pods
              {incubatingCount + readyCount + malfunctionCount > 0 && (
                <span className="text-[9px] font-mono ml-1">
                  {incubatingCount + readyCount + malfunctionCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="breeding" className="gap-1">
              <Heart size={14} />
              Breed
            </TabsTrigger>
            <TabsTrigger value="bloodlines" className="gap-1">
              <Crown size={14} />
              Houses
            </TabsTrigger>
            <TabsTrigger value="missions" className="gap-1">
              <Rocket size={14} />
              Missions
              {missionActiveCount > 0 && (
                <span className="text-[9px] font-mono ml-1">{missionActiveCount}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="memorial" className="gap-1">
              <Skull size={14} />
              Memorial
            </TabsTrigger>
            <TabsTrigger value="feed" className="gap-1">
              <Radio size={14} />
              Feed
              {cs.feedUnreadCount > 0 && (
                <span className="text-[9px] font-mono ml-1">{cs.feedUnreadCount}</span>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <Suspense
              fallback={
                <div className="py-12 text-center text-muted-foreground font-mono text-xs">
                  loading…
                </div>
              }
            >
              <TabsContent value="roster">
                <CrewRosterView
                  state={cs}
                  onAssignRole={(memberId, role) => assignRole.mutate({ memberId, role })}
                />
              </TabsContent>
              <TabsContent value="incubator">
                <IncubatorMonitor
                  state={cs}
                  onHatch={handleHatch}
                  onRepair={podId => repairPod.mutate({ podId })}
                  onCancel={podId => cancelIncubation.mutate({ podId })}
                />
              </TabsContent>
              <TabsContent value="breeding">
                <BreedingSelector state={cs} onBreed={handleBreed} />
              </TabsContent>
              <TabsContent value="bloodlines">
                <BloodlineViewer state={cs} />
              </TabsContent>
              <TabsContent value="missions">
                <CrewMissionsBoard state={cs} onRefetch={() => refetch()} />
              </TabsContent>
              <TabsContent value="memorial">
                <MemorialWall state={cs} />
              </TabsContent>
              <TabsContent value="feed">
                <CrewActivityFeed state={cs} />
              </TabsContent>
            </Suspense>
          </div>
        </Tabs>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCloneModal && (
          <Suspense fallback={null}>
            <CloneFromTemplateModal
              onClose={() => setShowCloneModal(false)}
              onClone={handleClone}
              founded={Object.keys(cs.bloodlines)}
            />
          </Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDangerModal && (
          <Suspense fallback={null}>
            <CrewDangerEventModal
              state={cs}
              onClose={() => {
                setShowDangerModal(false);
                refetch();
              }}
            />
          </Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingForReview && (
          <Suspense fallback={null}>
            <OffspringReviewModal
              pending={pendingForReview}
              state={cs}
              onClose={() => {
                setReviewOffspringId(null);
              }}
              onDismiss={async () => {
                await dismissOffspring.mutateAsync({ offspringId: pendingForReview.id });
                setReviewOffspringId(null);
              }}
              onIncubate={async (templateId: string) => {
                if (!cs) return;
                const emptyPod = cs.incubator.pods.find(p => p.status === "empty");
                if (!emptyPod) {
                  toast.error("No empty incubator pods");
                  return;
                }
                const template = getTemplate(templateId);
                if (!template) return;
                const rarityHours: Record<string, number> = {
                  common: 4,
                  uncommon: 8,
                  rare: 12,
                  exotic: 24,
                };
                await startIncubation.mutateAsync({
                  podId: emptyPod.id,
                  templateId,
                  bloodlineId: pendingForReview.bloodlineId,
                  generation: pendingForReview.generation,
                  parentIds: [pendingForReview.parent1Id, pendingForReview.parent2Id],
                  rarityHours: rarityHours[template.rarity] ?? 8,
                  traits: [...pendingForReview.inheritedTraits, ...pendingForReview.newMutations],
                  pendingOffspringId: null,
                });
                setReviewOffspringId(null);
              }}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
