/**
 * SpaceSubScenePage — focused-beat surface for an actionable hotspot.
 *
 * Routes: `/space/:canonicalId/:action` (e.g.
 * `/space/veh.cades_apc/board`,
 * `/space/dest.castle_of_death.cod07_library_of_forbidden/investigate_chamber`).
 *
 * Renders the room's baseline art as a dimmed backdrop with a
 * centered prose panel: an approach-beat from
 * `spaceSubSceneBeats.ts`, the loredex entry's bio when one exists,
 * and a "Return to the space" button.
 *
 * Beats are category-aware with per-space overrides — short by
 * design, since the deep diegetic content lives in the loredex
 * entry (linked at the bottom of the panel).
 */

import { useMemo } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { ChevronLeft, BookOpen } from "lucide-react";

import { assetUrl } from "@/lib/assetUrl";
import {
  isSubSceneAction,
  spaceSubSceneBeat,
} from "@shared/spaceSubSceneBeats";
import {
  NEW_ART_BRIDGED_ROOMS_BY_ID,
} from "@shared/expansionArt/newArtRoomBridge";
import { roomArtBaselineUrl } from "@shared/expansionArt/roomArtManifest";
import { visitLoredexUnlockFor } from "@shared/visitLoredexUnlocks";

function prettyName(canonicalSpaceId: string): string {
  const bridged = NEW_ART_BRIDGED_ROOMS_BY_ID.get(canonicalSpaceId);
  if (bridged?.category === "vehicle") {
    return canonicalSpaceId
      .replace(/^veh\./, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  if (bridged?.category === "destination_subzone") {
    const [, cat, slug] = canonicalSpaceId.split(".");
    const niceSlug = slug
      .replace(/^(cod|cr|td|te|qs)\d+_/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const niceCat = cat
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return `${niceCat} — ${niceSlug}`;
  }
  return canonicalSpaceId;
}

export default function SpaceSubScenePage() {
  const [, params] = useRoute("/space/:canonicalId/:action");
  const [, navigate] = useLocation();
  const canonicalId = params?.canonicalId ?? "";
  const action = params?.action ?? "";

  const beat = useMemo(() => {
    if (!isSubSceneAction(action)) return null;
    return spaceSubSceneBeat(canonicalId, action);
  }, [canonicalId, action]);

  const name = useMemo(() => prettyName(canonicalId), [canonicalId]);
  const backdrop = useMemo(() => {
    const bridged = NEW_ART_BRIDGED_ROOMS_BY_ID.get(canonicalId);
    if (bridged) return assetUrl(bridged.asset.relPath);
    return roomArtBaselineUrl(canonicalId);
  }, [canonicalId]);
  const dossierEntityId = visitLoredexUnlockFor(canonicalId)?.entityIds[0];

  if (!canonicalId || !isSubSceneAction(action) || !beat) {
    return (
      <div
        className="min-h-screen p-8 flex flex-col items-center justify-center text-white text-center"
        style={{ background: "var(--bg-deep)" }}
        data-page="space-sub-scene-unknown"
      >
        <h1 className="font-mono text-xl mb-2">{name || "Unknown space"}</h1>
        <p className="opacity-70 mt-2">
          No beat has been authored for {action || "this action"} here yet.
        </p>
        <Link
          href={canonicalId ? `/space/${canonicalId}` : "/"}
          className="mt-8 px-4 py-2 rounded font-mono text-xs"
          style={{ border: "1px solid var(--glass-border)" }}
        >
          ◂ Return
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative text-white"
      style={{
        background: backdrop
          ? `var(--bg-deep) url(${backdrop}) center/cover no-repeat`
          : "var(--bg-deep)",
      }}
      data-page="space-sub-scene"
      data-canonical-id={canonicalId}
      data-action={action}
    >
      {/* Dim wash over the backdrop so the prose panel reads. */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "color-mix(in oklch, var(--bg-deep) 65%, transparent)" }}
        aria-hidden
      />

      <Link
        href={`/space/${canonicalId}`}
        className="absolute top-4 left-4 z-30 px-3 py-2 rounded font-mono text-xs flex items-center gap-2"
        style={{ background: "var(--bg-overlay)", border: "1px solid var(--glass-border)" }}
      >
        <ChevronLeft size={14} /> Back to the space
      </Link>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div
          className="void-surface p-8 max-w-2xl w-full"
          style={{ border: "1px solid var(--glass-border)" }}
        >
          <div className="font-mono text-[10px] opacity-60 uppercase tracking-wider mb-2">
            {action.replace(/_/g, " ")}
          </div>
          <h1 className="font-display text-2xl tracking-wider mb-6">{name}</h1>
          <p className="text-base leading-relaxed mb-8">{beat.prose}</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                navigate(beat.continueRoute ?? `/space/${canonicalId}`)
              }
              className="px-4 py-2 rounded font-mono text-xs"
              style={{
                background: "color-mix(in oklch, var(--electric-blue) 20%, transparent)",
                border: "1px solid color-mix(in oklch, var(--electric-blue) 50%, transparent)",
              }}
            >
              {beat.continueVerb ?? "Continue"}
            </button>
            {dossierEntityId && (
              <Link
                href={`/entity/${dossierEntityId}`}
                className="inline-flex items-center gap-2 px-3 py-2 rounded font-mono text-xs"
                style={{ border: "1px solid var(--glass-border)" }}
              >
                <BookOpen size={12} /> Read the full dossier
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
