/**
 * BridgedSpacePage — generic room renderer keyed on canonical space id.
 *
 * Routes: `/space/:canonicalId` (e.g. `/space/veh.cades_apc`,
 * `/space/dest.castle_of_death.cod01_entrance_hall`).
 *
 * Surfaces every NEW_ART-bridged vehicle / destination / panorama
 * delivered via `newArtRoomBridge`. Reuses:
 *   - `useRoomArt(canonicalId, …)`     — composite art layer stack
 *   - `hotspotsForSpace(canonicalId)`  — sidecar hotspot block
 *   - `canAccessBridgedSpace(…)`       — unlock gate evaluator
 *   - `trpc.discovery.recordRoomVisit` — first-visit ripple producer
 *   - `visitLoredexUnlockFor(…)`       — DiscoveryNotification side effect
 *
 * The route accepts any canonical id; unknown ids render a tasteful
 * "this space does not exist" panel rather than 404'ing.
 */

import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { ChevronLeft, Lock, X, BookOpen, ArrowRight } from "lucide-react";
import type { RoomHotspotEntry } from "@shared/expansionArt/roomHotspotManifest";
import { isSubSceneAction, spaceSubSceneBeat } from "@shared/spaceSubSceneBeats";

import { useGame } from "@/contexts/GameContext";
import { trpc } from "@/lib/trpc";
import { emitDiscoveryNotification } from "@/components/DiscoveryNotification";
import ParallaxRoom from "@/components/ParallaxRoom";
import { useRoomArt } from "@/game/useRoomArt";
import { canAccessBridgedSpace } from "@shared/roomGating/canAccessBridgedSpace";
import {
  NEW_ART_BRIDGED_ROOMS_BY_ID,
  type BridgedRoomCategory,
} from "@shared/expansionArt/newArtRoomBridge";
import { hotspotsForSpace } from "@shared/expansionArt/roomHotspotManifest";
import { visitLoredexUnlockFor } from "@shared/visitLoredexUnlocks";

type RecordCategory = "vehicle" | "destination_subzone" | "ark_room" | "hellbox" | "other";

function categoryOf(canonicalSpaceId: string): {
  record: RecordCategory;
  display: BridgedRoomCategory | "ark_room" | "hellbox" | "unknown";
  label: string;
} {
  if (canonicalSpaceId.startsWith("veh.")) {
    return { record: "vehicle", display: "vehicle", label: "Vessel" };
  }
  if (canonicalSpaceId.startsWith("dest.panorama.")) {
    return { record: "destination_subzone", display: "destination_panorama", label: "Destination Vista" };
  }
  if (canonicalSpaceId.startsWith("dest.")) {
    return { record: "destination_subzone", display: "destination_subzone", label: "Destination" };
  }
  if (canonicalSpaceId.startsWith("hb.")) {
    return { record: "hellbox", display: "hellbox", label: "Hellbox" };
  }
  if (canonicalSpaceId.startsWith("ark.")) {
    return { record: "ark_room", display: "ark_room", label: "Ark Room" };
  }
  return { record: "other", display: "unknown", label: "Space" };
}

function prettyName(canonicalSpaceId: string): string {
  const bridged = NEW_ART_BRIDGED_ROOMS_BY_ID.get(canonicalSpaceId);
  if (bridged?.category === "vehicle") {
    return canonicalSpaceId.replace(/^veh\./, "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
  if (bridged?.category === "destination_subzone") {
    const [, cat, slug] = canonicalSpaceId.split(".");
    const niceSlug = slug
      .replace(/^(cod|cr|td|te|qs)\d+_/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const niceCat = cat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return `${niceCat} — ${niceSlug}`;
  }
  if (bridged?.category === "destination_panorama") {
    return canonicalSpaceId
      .replace(/^dest\.panorama\./, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return canonicalSpaceId;
}

export default function BridgedSpacePage() {
  const [, params] = useRoute("/space/:canonicalId");
  const canonicalId = params?.canonicalId ?? "";
  const { state } = useGame();
  const cat = categoryOf(canonicalId);
  const name = useMemo(() => prettyName(canonicalId), [canonicalId]);

  // `pinInventory` is `string[]`; map to the shape the evaluator
  // expects. `armyUnits` here is the Trade Empire/CADES roster, not
  // the apprentice cohort — pass nothing rather than risk false
  // positives on `apprentice_in_cohort` checks. Blood-weave alignment
  // is read via flags (`blood_weave_alignment_<n>_reached`) rather
  // than a numeric column; the evaluator's threshold check will fail
  // closed until a numeric source lands.
  const accessSlice = useMemo(
    () => ({
      narrativeAct: state.narrativeAct ?? 0,
      narrativeFlags: state.narrativeFlags ?? {},
      inventory: (state.pinInventory ?? []).map((id) => ({ id })),
      loredexUnlockedCount: (state.loredexDiscovered ?? []).length,
    }),
    [state.narrativeAct, state.narrativeFlags, state.pinInventory, state.loredexDiscovered],
  );

  const access = useMemo(
    () => canAccessBridgedSpace(canonicalId, accessSlice),
    [canonicalId, accessSlice],
  );

  const layers = useRoomArt(canonicalId, {
    narrativeFlags: state.narrativeFlags ?? {},
  });
  const hotspots = useMemo(() => hotspotsForSpace(canonicalId), [canonicalId]);
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  const [openHotspot, setOpenHotspot] = useState<RoomHotspotEntry | null>(null);
  const visitUnlock = useMemo(() => visitLoredexUnlockFor(canonicalId), [canonicalId]);
  const dossierEntityId = visitUnlock?.entityIds[0];

  /** Verb for the hotspot modal's primary heading, derived from
   *  hotspot.type. Matches the existing affordance vocabulary so the
   *  player reads consistent verbs whether they hover or click. */
  function verbFor(type: RoomHotspotEntry["type"]): string {
    switch (type) {
      case "interact": return "Engage";
      case "examine":  return "Examine";
      case "door":     return "Pass through";
      case "item":     return "Pick up";
      case "npc":      return "Approach";
      case "terminal": return "Access";
    }
  }

  /* ─── Record the visit (idempotent ripple producer) ─── */

  const recordRoomVisit = trpc.discovery.recordRoomVisit.useMutation({
    onSuccess: (data) => {
      if (!data.firstVisit) return;
      const unlock = visitLoredexUnlockFor(canonicalId);
      if (!unlock || unlock.entityIds.length === 0) return;
      emitDiscoveryNotification({
        featureKey: `visit-${canonicalId}`,
        featureLabel: `${unlock.discoveryLabel} — ${unlock.entityIds.length} Loredex ${
          unlock.entityIds.length === 1 ? "entry" : "entries"
        } unlocked`,
        roomName: name,
        path: `/entity/${unlock.entityIds[0]}`,
      });
    },
  });

  useEffect(() => {
    if (!canonicalId || !access.allowed) return;
    recordRoomVisit.mutate({ canonicalRoomId: canonicalId, category: cat.record });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonicalId, access.allowed]);

  /* ─── Renders ─── */

  if (!canonicalId) {
    return (
      <div className="min-h-screen p-8 text-white" style={{ background: "var(--bg-deep)" }}>
        <h1 className="text-2xl">Missing space id.</h1>
        <Link href="/" className="underline">Return home.</Link>
      </div>
    );
  }

  if (!access.allowed) {
    return (
      <div
        className="min-h-screen p-8 flex flex-col items-center justify-center text-white text-center"
        style={{ background: "var(--bg-deep)" }}
        data-page="bridged-space-locked"
        data-canonical-id={canonicalId}
      >
        <Lock size={48} className="mb-4 opacity-70" />
        <h1 className="font-mono text-xl mb-2">{name}</h1>
        <p className="font-mono text-sm opacity-60 mb-1">{cat.label} — locked</p>
        <p className="max-w-md opacity-80 mt-4">{access.reason}</p>
        <Link
          href="/search"
          className="mt-8 px-4 py-2 rounded font-mono text-xs"
          style={{ border: "1px solid var(--glass-border)" }}
        >
          ◂ Back
        </Link>
      </div>
    );
  }

  if (layers.length === 0) {
    return (
      <div
        className="min-h-screen p-8 flex flex-col items-center justify-center text-white text-center"
        style={{ background: "var(--bg-deep)" }}
        data-page="bridged-space-unknown"
        data-canonical-id={canonicalId}
      >
        <h1 className="font-mono text-xl mb-2">{name}</h1>
        <p className="opacity-70 mt-2">This space hasn't been mapped yet.</p>
        <Link
          href="/search"
          className="mt-8 px-4 py-2 rounded font-mono text-xs"
          style={{ border: "1px solid var(--glass-border)" }}
        >
          ◂ Back
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative text-white"
      style={{ background: "var(--bg-deep)" }}
      data-page="bridged-space"
      data-canonical-id={canonicalId}
    >
      <Link
        href="/search"
        className="absolute top-4 left-4 z-30 px-3 py-2 rounded font-mono text-xs flex items-center gap-2"
        style={{ background: "var(--bg-overlay)", border: "1px solid var(--glass-border)" }}
      >
        <ChevronLeft size={14} /> Back
      </Link>
      <div className="absolute top-4 right-4 z-30 text-right font-mono">
        <div className="text-sm">{name}</div>
        <div className="text-[10px] opacity-60">{cat.label}</div>
      </div>

      <div className="relative w-full" style={{ minHeight: "100vh" }}>
        <ParallaxRoom layers={[...layers]} fit="contain" />

        {hotspots.map((h) => {
          const isHover = hoveredHotspotId === h.id;
          return (
            <button
              key={h.id}
              type="button"
              onMouseEnter={() => setHoveredHotspotId(h.id)}
              onMouseLeave={() => setHoveredHotspotId(null)}
              onClick={() => setOpenHotspot(h)}
              className="absolute z-20 rounded font-mono text-[10px]"
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                width: `${h.width}%`,
                height: `${h.height}%`,
                background: isHover
                  ? "color-mix(in oklch, var(--electric-blue) 22%, transparent)"
                  : "color-mix(in oklch, var(--electric-blue) 10%, transparent)",
                border: `1px solid color-mix(in oklch, var(--electric-blue) ${isHover ? 60 : 30}%, transparent)`,
                color: "var(--text-primary)",
              }}
              aria-label={h.name}
              title={h.description}
            >
              <span className="px-2 py-1">{h.name}</span>
            </button>
          );
        })}
      </div>

      {openHotspot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "color-mix(in oklch, var(--bg-deep) 70%, transparent)" }}
          onClick={() => setOpenHotspot(null)}
          role="dialog"
          aria-modal="true"
          aria-label={openHotspot.name}
          data-hotspot-modal-id={openHotspot.id}
        >
          <div
            className="void-surface p-6 max-w-md w-full"
            style={{ border: "1px solid var(--glass-border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-mono text-[10px] opacity-60 uppercase tracking-wider mb-1">
                  {verbFor(openHotspot.type)}
                </div>
                <h2 className="font-display text-lg">{openHotspot.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpenHotspot(null)}
                aria-label="Close"
                className="opacity-70 hover:opacity-100"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm leading-relaxed opacity-90 mb-5">
              {openHotspot.description}
            </p>
            <div className="flex flex-wrap gap-3">
              {(() => {
                const action = openHotspot.action ?? openHotspot.id;
                if (!isSubSceneAction(action)) return null;
                if (!spaceSubSceneBeat(canonicalId, action)) return null;
                return (
                  <Link
                    href={`/space/${canonicalId}/${action}`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded font-mono text-xs"
                    style={{
                      background: "color-mix(in oklch, var(--electric-blue) 20%, transparent)",
                      border: "1px solid color-mix(in oklch, var(--electric-blue) 50%, transparent)",
                    }}
                  >
                    <ArrowRight size={12} /> Step inside
                  </Link>
                );
              })()}
              {dossierEntityId && (
                <Link
                  href={`/entity/${dossierEntityId}`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded font-mono text-xs"
                  style={{
                    background: "color-mix(in oklch, var(--electric-blue) 15%, transparent)",
                    border: "1px solid color-mix(in oklch, var(--electric-blue) 40%, transparent)",
                  }}
                >
                  <BookOpen size={12} /> Read dossier on {name}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
