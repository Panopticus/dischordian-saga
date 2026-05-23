/**
 * DestinationMapPage — hub UI for the 60 NEW_ART_2-bridged destination
 * zones grouped by category (Castle of Death, Crucible, Tower Defense,
 * Trade Empire, Quiz Show). Each zone shows its art thumbnail + unlock
 * state. Unlocked zones link to `/space/<canonical>`.
 *
 * Route: `/destinations`.
 */

import { useMemo } from "react";
import { Link } from "wouter";
import { ChevronLeft, Lock, ChevronRight } from "lucide-react";

import { useGame } from "@/contexts/GameContext";
import { assetUrl } from "@/lib/assetUrl";
import {
  newArtBridgedRoomsByCategory,
  type NewArtBridgedRoom,
} from "@shared/expansionArt/newArtRoomBridge";
import { canAccessBridgedSpace } from "@shared/roomGating/canAccessBridgedSpace";

const CATEGORY_LABELS: Record<string, string> = {
  castle_of_death: "Castle of Death",
  crucible: "Crucible",
  tower_defense: "Tower Defense",
  trade_empire: "Trade Empire",
  quiz_show: "Quiz Show",
};

const CATEGORY_BLURBS: Record<string, string> = {
  castle_of_death: "The Necromancer's twenty chambers. Hellbox 2's destination expansion.",
  crucible: "Tier-5 PvP arenas. The meritocracy of recognition.",
  tower_defense: "Military positions. Hold the line.",
  trade_empire: "Hero sectors. The Empire pays in margins.",
  quiz_show: "The Palimpsest's set pieces. Bring your own questions.",
};

function prettyZoneName(canonical: string): string {
  const [, , slug] = canonical.split(".");
  return slug
    .replace(/^(cod|cr|td|te|qs)\d+_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DestinationMapPage() {
  const { state } = useGame();
  const all = newArtBridgedRoomsByCategory("destination_subzone");

  const grouped = useMemo(() => {
    const out: Record<string, NewArtBridgedRoom[]> = {};
    for (const r of all) {
      const cat = r.canonicalSpaceId.split(".")[1];
      (out[cat] ??= []).push(r);
    }
    return out;
  }, [all]);

  const slice = {
    narrativeAct: state.narrativeAct ?? 0,
    narrativeFlags: state.narrativeFlags ?? {},
    inventory: (state.pinInventory ?? []).map((id) => ({ id })),
    loredexUnlockedCount: (state.loredexDiscovered ?? []).length,
  };

  const categories = ["trade_empire", "crucible", "tower_defense", "castle_of_death", "quiz_show"];

  return (
    <div
      className="min-h-screen text-white p-6"
      style={{ background: "var(--bg-deep)" }}
      data-page="destination-map"
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
          <h1 className="font-display text-2xl tracking-wider mb-1">Destination Map</h1>
          <p className="opacity-70 font-mono text-xs">
            {all.length} zones across {categories.length} categories.
          </p>
        </header>

        {categories.map((cat) => {
          const zones = grouped[cat] ?? [];
          if (zones.length === 0) return null;
          const unlocked = zones.filter(
            (z) => canAccessBridgedSpace(z.canonicalSpaceId, slice).allowed,
          ).length;
          return (
            <section key={cat} className="mb-10" data-category={cat}>
              <header className="mb-3 flex items-baseline justify-between">
                <div>
                  <h2 className="font-display text-lg tracking-wider">
                    {CATEGORY_LABELS[cat]}
                  </h2>
                  <p className="opacity-60 font-mono text-[11px] mt-1">{CATEGORY_BLURBS[cat]}</p>
                </div>
                <span className="font-mono text-xs opacity-70">
                  {unlocked}/{zones.length} unlocked
                </span>
              </header>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {zones.map((z) => {
                  const access = canAccessBridgedSpace(z.canonicalSpaceId, slice);
                  const name = prettyZoneName(z.canonicalSpaceId);
                  const thumb = assetUrl(z.asset.relPath);
                  const card = (
                    <article
                      className="void-surface p-3 flex flex-col gap-2 relative h-full"
                      style={{
                        border: access.allowed
                          ? "1px solid color-mix(in oklch, var(--electric-blue) 28%, transparent)"
                          : "1px solid var(--glass-border)",
                        opacity: access.allowed ? 1 : 0.5,
                      }}
                      data-zone-id={z.canonicalSpaceId}
                      data-locked={!access.allowed}
                    >
                      <div
                        className="aspect-square w-full rounded overflow-hidden"
                        style={{
                          background: `var(--bg-overlay) url(${thumb}) center/cover no-repeat`,
                        }}
                        aria-hidden
                      />
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="font-mono text-xs leading-tight">{name}</h3>
                        {access.allowed ? (
                          <ChevronRight size={12} className="opacity-70 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Lock size={12} className="opacity-70 mt-0.5 flex-shrink-0" />
                        )}
                      </div>
                    </article>
                  );
                  if (access.allowed) {
                    return (
                      <Link
                        key={z.canonicalSpaceId}
                        href={`/space/${z.canonicalSpaceId}`}
                        className="block"
                      >
                        {card}
                      </Link>
                    );
                  }
                  return (
                    <div
                      key={z.canonicalSpaceId}
                      className="cursor-not-allowed"
                      title={access.reason}
                    >
                      {card}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
