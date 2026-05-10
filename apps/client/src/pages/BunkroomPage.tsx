/* ═══════════════════════════════════════════════════════
   BUNKROOM PAGE — sub-zone of the Crew Deck Barracks.

   The corridor hub for crew berths. A point-and-click
   scene: backdrop image of the bunk corridor, doors as
   hotspots. Each door is one of the player's recruited
   crew. Locked doors render as "vacant bunk" placards
   until the recruit-flag fires.

   Design priorities:
     • No HUD chrome. The doors are the UI.
     • Hover-audio: hovering on a door fades in a faint
       muffled audio loop of whatever that crew member is
       doing right now. Step off → fade out.
     • Click → routes to /berth/<memberId>, where the
       BerthScene composition takes over.

   Tier 1 (Elara, Human) does NOT live here — they have
   their own canonical posts. Visiting them goes to those
   rooms, not the bunkroom.

   File: apps/client/src/pages/BunkroomPage.tsx
   ═══════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { useApprenticeStore } from "@/stores/apprenticeStore";
import { listCompanionsInRoom } from "@shared/companionRoomRegistry";
import { activityFor, doorframeFor } from "@shared/partyMemberBerth";
import { currentPhase, phaseLabel, phaseTint, phaseBrightness } from "@shared/timeOfDay";
import type { PartyMember } from "@shared/partyMember";
import { assetUrl } from "@/lib/assetUrl";

/* The corridor backdrop — slot for producer art. Renderer falls back
   to a tinted placeholder if missing. */
const BUNKROOM_BACKDROP = assetUrl("art/ship/bunkroom_corridor.webp");

interface DoorSlot {
  member: PartyMember | null;
  /** When member is null, render a vacant-bunk placard at this slot. */
  vacantLabel?: string;
  presenceLine?: string;
}

export default function BunkroomPage() {
  const [, setLocation] = useLocation();
  const { state } = useGame();
  const apprentice = useApprenticeStore(s => s.current);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const phase = currentPhase();

  // Build the door slots.
  const doors: DoorSlot[] = useMemo(() => {
    const slots: DoorSlot[] = [];
    const flags = state.narrativeFlags;

    // 1. Apprentice door — always present (vacant-styled if no apprentice).
    if (apprentice) {
      slots.push({
        member: {
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
        },
        presenceLine: "Your apprentice's bunk. The door is always slightly open.",
      });
    } else {
      slots.push({
        member: null,
        vacantLabel: "Apprentice — Bunk Empty",
        presenceLine: "No apprentice assigned. Roll one from /apprentice.",
      });
    }

    // 2-6. Five recruit doors. Show as locked-vacant when not yet recruited.
    const recruits: Array<{
      id: "vex_solene" | "wraith_calder" | "locke" | "jericho_jones" | "akai_shi";
      name: string;
    }> = [
      { id: "vex_solene", name: "Vex Solene" },
      { id: "wraith_calder", name: "Wraith Calder" },
      { id: "locke", name: "Adjudicator Locke" },
      { id: "jericho_jones", name: "Jericho Jones" },
      { id: "akai_shi", name: "Akai Shi" },
    ];

    const bunkRoomEntries = listCompanionsInRoom("bunk-room", flags);
    for (const r of recruits) {
      const entry = bunkRoomEntries.find(e => e.companionId === r.id);
      if (entry) {
        slots.push({
          member: {
            kind: "recruit",
            id: r.id,
            displayName: r.name,
            bond: 50, // TODO: lift recruit bond from the actual NPC trust state
            recruited: true,
          },
          presenceLine: entry.presenceLine,
        });
      } else {
        slots.push({
          member: null,
          vacantLabel: `${r.name} — Vacant`,
          presenceLine: "No name plate yet. The bunk is unused.",
        });
      }
    }

    return slots;
  }, [apprentice, state.narrativeFlags]);

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `linear-gradient(rgba(8, 8, 12, ${1 - phaseBrightness(phase) * 0.6}), rgba(8, 8, 12, ${1 - phaseBrightness(phase) * 0.6})), url('${BUNKROOM_BACKDROP}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header — minimal, just back-link + phase tag. */}
      <div className="absolute top-0 inset-x-0 p-3 flex items-center justify-between text-slate-300">
        <Link href="/ship" className="inline-flex items-center gap-1 text-sm hover:text-slate-100">
          <ChevronLeft className="w-4 h-4" /> back to deck
        </Link>
        <div className="text-xs text-slate-400 italic">
          Crew Deck · Bunkroom · {phaseLabel(phase)}
        </div>
      </div>

      {/* Door grid. Asymmetric layout — corridor feel. */}
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl w-full mt-12">
          {doors.map((slot, i) => (
            <DoorHotspot
              key={slot.member?.id ?? `vacant_${i}`}
              slot={slot}
              hovered={hoveredId === (slot.member?.id ?? `vacant_${i}`)}
              onHover={() => setHoveredId(slot.member?.id ?? `vacant_${i}`)}
              onLeave={() => setHoveredId(null)}
              onEnter={() => slot.member && setLocation(`/berth/${slot.member.id}`)}
              phaseTint={phaseTint(phase)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface DoorHotspotProps {
  slot: DoorSlot;
  hovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onEnter: () => void;
  phaseTint: string;
}

function DoorHotspot({ slot, hovered, onHover, onLeave, onEnter, phaseTint }: DoorHotspotProps) {
  const occupied = slot.member !== null;
  const member = slot.member;
  // Hover audio loop — what they're doing, muffled through the door.
  const audioUrl = occupied && member
    ? activityFor(member, currentPhase()).audioBedPath
    : undefined;

  return (
    <button
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onEnter}
      disabled={!occupied}
      className={`
        relative aspect-[2/3] rounded-md p-4 text-left transition-all duration-300
        ${occupied ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
        ${hovered && occupied ? "scale-[1.02] shadow-lg" : ""}
      `}
      style={{
        background: occupied
          ? `linear-gradient(180deg, rgba(40,40,60,0.85), rgba(20,20,30,0.92))`
          : `linear-gradient(180deg, rgba(20,20,30,0.7), rgba(8,8,12,0.85))`,
        border: `1px solid ${occupied ? `#${phaseTint}40` : "#22222a"}`,
      }}
    >
      {/* Door plate — name. */}
      <div className="absolute top-2 left-2 right-2 text-xs text-slate-300 font-mono uppercase tracking-wider truncate">
        {member?.displayName ?? slot.vacantLabel ?? "—"}
      </div>

      {/* Door art slot — when occupied, the activity sprite peeks out;
          when vacant, just an empty bunk placard. */}
      <div className="absolute inset-0 flex items-end justify-center pb-6">
        {occupied && member && (
          <div
            className="w-16 h-16 rounded-full opacity-60"
            style={{
              background: `radial-gradient(circle, #${phaseTint} 0%, transparent 70%)`,
            }}
          />
        )}
      </div>

      {/* Bottom: presence line — only when hovered. */}
      {hovered && (
        <div className="absolute bottom-2 left-2 right-2 text-xs italic text-slate-400">
          {slot.presenceLine}
        </div>
      )}

      {/* Hover-audio: only mounted when hovered, browsers respect autoplay
          via the explicit user-hover event. Muted-by-default if reduced
          motion / accessibility; the door still works. */}
      {hovered && occupied && audioUrl && (
        <audio src={audioUrl} autoPlay loop preload="none" style={{ display: "none" }} />
      )}
    </button>
  );
}
