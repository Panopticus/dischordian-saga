/**
 * VesselBayPage — hub UI for the 7 NEW_ART_1-bridged vehicles.
 *
 * Each vessel renders with its baseline art thumbnail (from the
 * newArtRoomBridge) and its unlock state (from canAccessBridgedSpace).
 * Unlocked vessels link to `/space/<canonical>`; locked vessels show
 * the gate reason.
 *
 * Route: `/vessels`.
 */

import { Link } from "wouter";
import { ChevronLeft, Lock, ChevronRight } from "lucide-react";

import { useGame } from "@/contexts/GameContext";
import { assetUrl } from "@/lib/assetUrl";
import { newArtBridgedRoomsByCategory } from "@shared/expansionArt/newArtRoomBridge";
import { canAccessBridgedSpace } from "@shared/roomGating/canAccessBridgedSpace";

function prettyVehicleName(canonical: string): string {
  return canonical
    .replace(/^veh\./, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function VesselBayPage() {
  const { state } = useGame();
  const vessels = newArtBridgedRoomsByCategory("vehicle");

  const slice = {
    narrativeAct: state.narrativeAct ?? 0,
    narrativeFlags: state.narrativeFlags ?? {},
    inventory: (state.pinInventory ?? []).map((id) => ({ id })),
    loredexUnlockedCount: (state.loredexDiscovered ?? []).length,
  };

  return (
    <div
      className="min-h-screen text-white p-6"
      style={{ background: "var(--bg-deep)" }}
      data-page="vessel-bay"
    >
      <div className="max-w-6xl mx-auto">
        <Link
          href="/ark"
          className="inline-flex items-center gap-2 px-3 py-2 rounded font-mono text-xs mb-6"
          style={{ background: "var(--bg-overlay)", border: "1px solid var(--glass-border)" }}
        >
          <ChevronLeft size={14} /> Back to the Ark
        </Link>

        <header className="mb-8">
          <h1 className="font-display text-2xl tracking-wider mb-1">Vessel Bay</h1>
          <p className="opacity-70 font-mono text-xs">
            {vessels.length} ship{vessels.length === 1 ? "" : "s"} on the manifest.
            Tap a vessel to board.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vessels.map((v) => {
            const access = canAccessBridgedSpace(v.canonicalSpaceId, slice);
            const name = prettyVehicleName(v.canonicalSpaceId);
            const thumb = assetUrl(v.asset.relPath);
            const card = (
              <article
                className="void-surface p-4 flex flex-col gap-3 relative overflow-hidden h-full"
                style={{
                  border: access.allowed
                    ? "1px solid color-mix(in oklch, var(--electric-blue) 30%, transparent)"
                    : "1px solid var(--glass-border)",
                  opacity: access.allowed ? 1 : 0.55,
                }}
                data-vessel-id={v.canonicalSpaceId}
                data-locked={!access.allowed}
              >
                <div
                  className="aspect-[16/9] w-full rounded overflow-hidden"
                  style={{
                    background: `var(--bg-overlay) url(${thumb}) center/contain no-repeat`,
                  }}
                  aria-hidden
                />
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-mono text-sm">{name}</h2>
                  {access.allowed ? (
                    <ChevronRight size={14} className="opacity-70 mt-1" />
                  ) : (
                    <Lock size={14} className="opacity-70 mt-1" />
                  )}
                </div>
                {!access.allowed && (
                  <p className="font-mono text-[10px] opacity-70">{access.reason}</p>
                )}
              </article>
            );
            if (access.allowed) {
              return (
                <Link key={v.canonicalSpaceId} href={`/space/${v.canonicalSpaceId}`} className="block">
                  {card}
                </Link>
              );
            }
            return (
              <div key={v.canonicalSpaceId} className="cursor-not-allowed">
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
