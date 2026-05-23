/**
 * HellboxChambersPage — hub UI for the 12 canonical Hellbox chambers.
 *
 * `/hellbox` (HellboxPortalPage) is the *narrative* portal — its
 * job is to play the Beat-C compelled-transport cinematic and route
 * the player into `/matrix/:episodeId` for school-tagged episode
 * content. This hub is the *spatial* doorway: it surfaces the 12
 * Hellbox canonical-id spaces (hb.celebration_school, etc.) so the
 * player can revisit a chamber as a room (art + hotspots) the same
 * way they revisit a vehicle or destination.
 *
 * Route: `/chambers`.
 */

import { Link } from "wouter";
import { ChevronLeft, Lock, ChevronRight } from "lucide-react";

import { useGame } from "@/contexts/GameContext";
import { roomArtBaselineUrl } from "@shared/expansionArt/roomArtManifest";
import { canAccessBridgedSpace } from "@shared/roomGating/canAccessBridgedSpace";

const CHAMBERS: ReadonlyArray<{ id: string; name: string; hellboxNumber: number }> = [
  { id: "hb.celebration_school", name: "Celebration School", hellboxNumber: 1 },
  { id: "hb.castle_of_death", name: "Castle of Death", hellboxNumber: 2 },
  { id: "hb.quiz_show_palimpsest", name: "Quiz Show Palimpsest", hellboxNumber: 3 },
  { id: "hb.mechronis_academy", name: "Mechronis Academy", hellboxNumber: 4 },
  { id: "hb.universal_selector", name: "Universal Selector", hellboxNumber: 5 },
  { id: "hb.dead_mans_circuit", name: "Dead Man's Circuit", hellboxNumber: 6 },
  { id: "hb.degenerates_casino", name: "The Degenerate's Casino", hellboxNumber: 7 },
  { id: "hb.editors_workshop", name: "Editor's Workshop", hellboxNumber: 8 },
  { id: "hb.eternal_match", name: "The Eternal Match", hellboxNumber: 9 },
  { id: "hb.collected_souls", name: "Hall of Collected Souls", hellboxNumber: 10 },
  { id: "hb.the_hive", name: "The Hive", hellboxNumber: 11 },
  { id: "hb.dischordian_arena", name: "Dischordian Arena", hellboxNumber: 12 },
];

export default function HellboxChambersPage() {
  const { state } = useGame();

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
      data-page="hellbox-chambers"
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
          <h1 className="font-display text-2xl tracking-wider mb-1">The Chambers</h1>
          <p className="opacity-70 font-mono text-xs">
            {CHAMBERS.length} Hellbox spaces — visit any chamber you've opened.
            The portal at <Link href="/hellbox" className="underline">/hellbox</Link> still routes school-tagged episodes.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHAMBERS.map((c) => {
            const access = canAccessBridgedSpace(c.id, slice);
            const thumb = roomArtBaselineUrl(c.id);
            const card = (
              <article
                className="void-surface p-4 flex flex-col gap-3 relative overflow-hidden h-full"
                style={{
                  border: access.allowed
                    ? "1px solid color-mix(in oklch, var(--electric-blue) 30%, transparent)"
                    : "1px solid var(--glass-border)",
                  opacity: access.allowed ? 1 : 0.55,
                }}
                data-chamber-id={c.id}
                data-locked={!access.allowed}
              >
                <div
                  className="aspect-[16/9] w-full rounded overflow-hidden"
                  style={{
                    background: thumb
                      ? `var(--bg-overlay) url(${thumb}) center/cover no-repeat`
                      : "var(--bg-overlay)",
                  }}
                  aria-hidden
                />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-[10px] opacity-60 uppercase tracking-wider">
                      Hellbox {c.hellboxNumber}
                    </div>
                    <h2 className="font-mono text-sm mt-0.5">{c.name}</h2>
                  </div>
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
                <Link key={c.id} href={`/space/${c.id}`} className="block">
                  {card}
                </Link>
              );
            }
            return (
              <div key={c.id} className="cursor-not-allowed">
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
