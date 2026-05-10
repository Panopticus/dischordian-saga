/* ═══════════════════════════════════════════════════════
   PEDAGOGY HUB — single mounted surface for the new
   apprentice pedagogy systems. Mounts at /apprentice/pedagogy
   (added to client routing) or as a panel embedded inside
   the existing ApprenticePage.

   Tabs:
     • Doctrine     (DoctrinePicker on recruit, viewer on bound)
     • Audits       (Day 7/14/21 surveillance scenes)
     • Forge        (Day 28 signature card)
     • Missions     (Graduate Legion micro-arcs, post-graduation)
     • Cohort       (3 slots overview)
     • Memories     (fallen apprentices' Memory Cards)

   File: apps/client/src/components/apprentice/pedagogy/PedagogyHub.tsx
   ═══════════════════════════════════════════════════════ */

import { useState } from "react";
import DoctrinePicker from "./DoctrinePicker";
import AuditTranscript from "./AuditTranscript";
import SignatureCardForge from "./SignatureCardForge";
import MissionResolver from "./MissionResolver";
import MemoryCardLibrary from "./MemoryCardLibrary";
import CohortSlotsPanel from "./CohortSlotsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Archetype =
  | "zealot" | "ghost" | "scholar" | "revenant" | "artisan" | "oracle"
  | "wanderer" | "martyr" | "heretic" | "jester" | "sentinel" | "prodigal";

type DoctrineId =
  | "compliant_mouth" | "forked_path" | "cold_hand"
  | "heretical_quiet" | "human_remainder";

type GraduateRole =
  | "companion" | "cryo_vault" | "army_leader" | "trade_envoy"
  | "tower_captain" | "sacrificed" | "relationship_gift";

interface ApprenticeLite {
  id: string;
  name: string;
  archetype: Archetype;
  rarity: "common" | "uncommon" | "rare" | "epic" | "mythic";
  bond: number;
  corruption: number;
  trialDay: number;
}

interface Props {
  apprentice: ApprenticeLite;
  /** Caller resolves these from server-side state. */
  doctrineId?: DoctrineId;
  architectInfluence: number;
  mentorProfessorId?: string | null;
  mechronisHouseId?: string | null;
  /** When true, the apprentice is graduated and can run missions. */
  graduated?: boolean;
  graduatedRole?: GraduateRole;
}

export default function PedagogyHub(props: Props) {
  const [tab, setTab] = useState<string>("doctrine");
  const { apprentice, doctrineId, architectInfluence, graduated, graduatedRole } = props;

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="grid grid-cols-6 w-full">
        <TabsTrigger value="doctrine">Doctrine</TabsTrigger>
        <TabsTrigger value="audits" disabled={!doctrineId}>Audits</TabsTrigger>
        <TabsTrigger value="forge" disabled={!doctrineId}>Forge</TabsTrigger>
        <TabsTrigger value="missions" disabled={!graduated || !doctrineId}>Missions</TabsTrigger>
        <TabsTrigger value="cohort">Cohort</TabsTrigger>
        <TabsTrigger value="memories">Memories</TabsTrigger>
      </TabsList>

      <TabsContent value="doctrine" className="mt-3">
        <DoctrinePicker
          apprenticeId={apprentice.id}
          archetype={apprentice.archetype}
          mentorProfessorId={props.mentorProfessorId}
          mechronisHouseId={props.mechronisHouseId}
          initialArchitectInfluence={architectInfluence}
        />
      </TabsContent>

      <TabsContent value="audits" className="mt-3">
        {doctrineId ? (
          <AuditTranscript
            apprentice={apprentice}
            doctrineId={doctrineId}
            architectInfluence={architectInfluence}
          />
        ) : (
          <div className="p-4 text-slate-400 text-sm">Pick a doctrine first.</div>
        )}
      </TabsContent>

      <TabsContent value="forge" className="mt-3">
        {doctrineId ? (
          <SignatureCardForge
            apprentice={apprentice}
            doctrineId={doctrineId}
            architectInfluence={architectInfluence}
            houseId={props.mechronisHouseId ?? null}
          />
        ) : (
          <div className="p-4 text-slate-400 text-sm">Pick a doctrine first.</div>
        )}
      </TabsContent>

      <TabsContent value="missions" className="mt-3">
        {graduated && doctrineId && graduatedRole ? (
          <MissionResolver
            apprenticeId={apprentice.id}
            apprenticeName={apprentice.name}
            apprenticeArchetype={apprentice.archetype}
            doctrineId={doctrineId}
            role={graduatedRole}
          />
        ) : (
          <div className="p-4 text-slate-400 text-sm">
            Missions become available after graduation and deployment to a Legion role.
          </div>
        )}
      </TabsContent>

      <TabsContent value="cohort" className="mt-3">
        <CohortSlotsPanel />
      </TabsContent>

      <TabsContent value="memories" className="mt-3">
        <MemoryCardLibrary />
      </TabsContent>
    </Tabs>
  );
}
