/* ═══════════════════════════════════════════════════════
   ANTIQUARIAN'S INDEX

   Daniel Cross's archive of consciousness forms — the surface
   that hosts the full slideshow for every prophecy vision the
   player has unlocked. Not all dreams come on the dream surface;
   the long tail (Whispers, Statics, replayed Marquees) lives
   here, browsable at the player's pace.

   Layout:
     - Chrono-spine matrix: rows = player acts, columns = the
       two spines (Insurgency Rise / Reality Fall).
     - Each cell shows the visions whose playerAct matches that
       row + the spine matching the column.
     - Locked tiles render as silhouette + ?, no spoilers.
     - Unlocked tiles show "Watch Full Vision" → plays the
       complete slideshow. Marks viewedWhisperIds on completion.

   In-fiction: Daniel Cross is the Antiquarian (apps/shared/
   journalEntries.ts). After Full Tapestry, the page framing
   shifts (Antiquarian voiceover + expanded annotations).
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Eye, Lock, Sparkles } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { useWitnessingStore } from "@/stores/witnessingStore";
import { trpc } from "@/lib/trpc";
import { getSlideshow } from "@shared/songSlideshows";
import { DREAMER_VISIONS } from "@shared/dreamerVisions";

function resolveSlideshowDef(slideshowId: string) {
  const direct = getSlideshow(slideshowId);
  if (direct) return direct;
  for (const dv of DREAMER_VISIONS) {
    if (dv.slideshow.id === slideshowId) return dv.slideshow;
  }
  return undefined;
}

function deriveCurrentAct(
  flags: Readonly<Record<string, boolean>> | undefined,
): number {
  if (!flags) return 1;
  for (let n = 7; n >= 1; n--) {
    if (flags[`act${n}_started`] || flags[`act${n}_complete`]) {
      return n;
    }
  }
  return 1;
}
import {
  PROPHECY_VISIONS,
  listVisionsForAct,
  type PlayerAct,
  type ProphecyVision,
  type Spine,
} from "@shared/prophecyVisionMap";
import { getProphecyById } from "@shared/danielCrossProphecies";
import { usePageMeta } from "@/hooks/usePageMeta";

const ACT_ROWS: readonly PlayerAct[] = [1, 2, 3, 4, 4.5, 5, 6, 7];
const SPINE_COLUMNS: readonly { id: Spine; label: string; flavor: string }[] = [
  {
    id: "insurgency_rise",
    label: "Insurgency Rise",
    flavor: "Albums 1–3 — the Programmer wakes; Logos calls.",
  },
  {
    id: "reality_fall",
    label: "Fall of Reality",
    flavor:
      "Albums 4–5 — the Beast watches all; the Lamb is named.",
  },
];

interface VisionTileState {
  vision: ProphecyVision;
  unlocked: boolean;
  watched: boolean;
  watchedInIndex: boolean;
}

export default function AntiquariansIndexPage() {
  const game = useGame();
  const playSlideshow = useWitnessingStore((s) => s.playSlideshow);
  const completeActive = useWitnessingStore((s) => s.completeActiveSlideshow);

  usePageMeta({
    title: "The Antiquarian's Index",
    description:
      "Daniel Cross's archive. The visions of the prophet Daniel — every full slideshow, every prophecy.",
  });

  const progressQuery = trpc.dreamerVisions.getProphecyProgress.useQuery();
  const markIndexViewedMutation =
    trpc.dreamerVisions.markIndexViewed.useMutation();

  const journalUnlocked = Boolean(
    game.state.narrativeFlags?.antiquarian_journal_unlocked,
  );
  const codexUnlocked = Boolean(
    game.state.narrativeFlags?.antiquarians_codex_unlocked,
  );

  const states = useMemo<Map<string, VisionTileState>>(() => {
    const completed = new Set(progressQuery.data?.marqueesCompleted ?? []);
    const received = new Set(progressQuery.data?.marqueesReceived ?? []);
    const unlockedWhispers = new Set(
      progressQuery.data?.unlockedWhispers ?? [],
    );
    const viewed = new Set(progressQuery.data?.viewedInIndex ?? []);
    const map = new Map<string, VisionTileState>();
    for (const v of PROPHECY_VISIONS) {
      let unlocked = false;
      if (v.intensity === "marquee") {
        unlocked = received.has(v.id) || completed.has(v.id);
      } else if (v.intensity === "whisper") {
        unlocked = unlockedWhispers.has(v.id) || viewed.has(v.id);
      } else if (v.intensity === "static") {
        // Statics are revealed once their flag fires; we treat
        // viewedInIndex as the "they've seen it once" signal, and
        // surface them as unlocked when the player has opened them
        // even once. To keep the surface generous, also mark static
        // tiles unlocked when their parent flag is set on the
        // game state — those are visible-but-undreamt.
        unlocked =
          viewed.has(v.id) ||
          Boolean(game.state.narrativeFlags?.[v.flagId]);
      }
      map.set(v.id, {
        vision: v,
        unlocked,
        watched: completed.has(v.id),
        watchedInIndex: viewed.has(v.id),
      });
    }
    return map;
  }, [progressQuery.data, game.state.narrativeFlags]);

  const watchVision = (state: VisionTileState) => {
    if (!state.unlocked) return;
    const def = resolveSlideshowDef(state.vision.slideshowId);
    if (!def) return;
    const opening = getProphecyById(state.vision.openingProphecyId);
    const closing = getProphecyById(state.vision.closingProphecyId);
    // Index re-watch always uses dream-mode bookends — the player
    // sees the full ceremony every time, but completion does not
    // re-grant (server short-circuits on duplicate). Awaken still
    // works to skip; that's a feature.
    playSlideshow(def, {
      dream:
        opening && closing
          ? {
              visionId: state.vision.id,
              bookend: { opening, closing },
              unawakenable: state.vision.unawakenable,
              onDreamEnd: ({ kind }: { kind: "full" | "awoken_early" }) => {
                if (kind === "full") {
                  markIndexViewedMutation.mutate({
                    visionId: state.vision.id,
                    currentAct: deriveCurrentAct(game.state.narrativeFlags),
                  });
                }
              },
            }
          : undefined,
      onComplete: () => {
        completeActive();
      },
    });
  };

  return (
    <div className="animate-fade-in pb-12 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="pt-4 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary text-xs font-mono mb-4 transition-colors"
        >
          <ArrowLeft size={12} /> BACK
        </Link>
        <div className="flex items-baseline gap-3">
          <BookOpen
            size={20}
            className="text-primary/60"
            aria-hidden="true"
          />
          <h1 className="font-display text-2xl sm:text-4xl font-black tracking-wider text-primary/90">
            THE ANTIQUARIAN'S INDEX
          </h1>
        </div>
        <p className="font-mono text-xs text-muted-foreground/70 mt-2 max-w-2xl italic">
          The visions of the prophet Daniel. Every dream you have
          dreamed lives here in full. Every dream you have not yet
          dreamed waits for the right page.
        </p>
        {codexUnlocked ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] void-text-accent mt-3">
            <Sparkles className="inline" size={10} />{" "}
            ANTIQUARIAN'S CODEX UNLOCKED — THE FULL TRUTH
          </p>
        ) : journalUnlocked ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/70 mt-3">
            <Sparkles className="inline" size={10} /> WITNESS OF THE FULL TAPESTRY
          </p>
        ) : null}
      </div>

      {/* Chrono-spine matrix. */}
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] gap-3">
        <div /> {/* corner */}
        {SPINE_COLUMNS.map((col) => (
          <div key={col.id} className="px-3 pb-2">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary/80">
              {col.label}
            </h2>
            <p className="font-mono text-[10px] text-muted-foreground/50 mt-0.5">
              {col.flavor}
            </p>
          </div>
        ))}

        {ACT_ROWS.map((act) => (
          <RowForAct
            key={String(act)}
            act={act}
            states={states}
            watchVision={watchVision}
          />
        ))}
      </div>

      {progressQuery.isLoading && (
        <p className="text-center text-muted-foreground/50 font-mono text-xs mt-8">
          Loading the archive…
        </p>
      )}
    </div>
  );
}

function RowForAct({
  act,
  states,
  watchVision,
}: {
  act: PlayerAct;
  states: Map<string, VisionTileState>;
  watchVision: (state: VisionTileState) => void;
}) {
  const visions = listVisionsForAct(act);
  const byColumn: Record<Spine, ProphecyVision[]> = {
    insurgency_rise: [],
    reality_fall: [],
  };
  for (const v of visions) {
    byColumn[v.spine].push(v);
  }

  return (
    <>
      <div className="px-3 pt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
        Act {act === 4.5 ? "4½" : act}
      </div>
      {SPINE_COLUMNS.map((col) => (
        <div key={`${act}-${col.id}`} className="space-y-2 p-2">
          {byColumn[col.id].map((v) => {
            const state = states.get(v.id);
            if (!state) return null;
            return (
              <VisionTile
                key={v.id}
                state={state}
                onWatch={() => watchVision(state)}
              />
            );
          })}
          {byColumn[col.id].length === 0 && (
            <div className="opacity-40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/40 px-3 py-4">
              · silent ·
            </div>
          )}
        </div>
      ))}
    </>
  );
}

function VisionTile({
  state,
  onWatch,
}: {
  state: VisionTileState;
  onWatch: () => void;
}) {
  const { vision, unlocked, watched, watchedInIndex } = state;
  const opening = getProphecyById(vision.openingProphecyId);
  return (
    <motion.button
      type="button"
      whileHover={unlocked ? { scale: 1.01 } : undefined}
      whileTap={unlocked ? { scale: 0.99 } : undefined}
      onClick={unlocked ? onWatch : undefined}
      disabled={!unlocked}
      className={`block w-full text-left rounded border px-3 py-2 transition-all ${
        unlocked
          ? "border-primary/20 bg-primary/5 hover:bg-primary/10 cursor-pointer"
          : "border-border/15 bg-muted/10 cursor-not-allowed opacity-60"
      }`}
      aria-label={
        unlocked
          ? `Watch full vision: ${vision.id}`
          : "Locked — awaits a vision"
      }
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
          {labelForIntensity(vision.intensity)} · Album {labelForAlbum(vision.albumSlug)}
        </div>
        <div className="flex items-center gap-1 text-[10px]">
          {unlocked ? (
            watched ? (
              <span title="Witnessed in full">
                <Eye size={10} className="text-primary" />
              </span>
            ) : watchedInIndex ? (
              <span title="Seen in the Archive">
                <Eye size={10} className="text-primary/60" />
              </span>
            ) : null
          ) : (
            <Lock size={10} className="text-muted-foreground/40" />
          )}
        </div>
      </div>
      {unlocked ? (
        <p className="font-mono text-[11px] text-foreground/80 mt-1">
          {opening?.text.split("\n")[0] ?? "Watch this vision"}
        </p>
      ) : (
        <p className="font-mono text-[11px] text-muted-foreground/40 italic mt-1">
          ?
        </p>
      )}
    </motion.button>
  );
}

function labelForIntensity(i: ProphecyVision["intensity"]): string {
  switch (i) {
    case "marquee":
      return "Marquee";
    case "whisper":
      return "Whisper";
    case "static":
      return "Echo";
  }
}

function labelForAlbum(slug: ProphecyVision["albumSlug"]): string {
  switch (slug) {
    case "dischordian-logic":
      return "1";
    case "age-of-privacy":
      return "2";
    case "book-of-daniel":
      return "3";
    case "west-by-god":
      return "4";
    case "silence-in-heaven":
      return "5";
  }
}
