/* ═══════════════════════════════════════════════════════
   DREAMER VISIONS ROUTER

   Originally just the awareness-threshold cutscene delivery
   (Visions 1-4). Now the full prophecy surface: marquee
   queue drain, whisper unlock + index view, album-as-film
   completion + bookmarks, Antiquarian's Index data.

   Endpoints:

     getNextPendingVision (legacy) — awareness threshold cutscene.

     getNextPendingProphecy — drain the next marquee for the
       caller (≤ 1 per session). Returns the slideshow id +
       bookend prophecy text the client renders in dream mode.

     queueProphecyVision — fire-and-forget. Called by the
       reactor on every false→true narrative-flag transition.
       Routes to the right sink based on intensity.

     markProphecyReceived — mark a marquee as watched
       (full / awoken_early). Triggers achievement evaluation.

     markIndexViewed — mark a Whisper / Static / replayed
       marquee as fully watched in the Antiquarian's Index.

     markAlbumFilmComplete — record an Album-as-Film end-to-end
       watch. Triggers achievement evaluation.

     setAlbumFilmBookmark — save / clear a film position so
       "Awaken from the Album" can resume.

     getProphecyProgress — full snapshot of the player's
       prophecy state. Powers the Antiquarian's Index page.
   ═══════════════════════════════════════════════════════ */
import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import {
  getDreamerAwareness,
  markVisionReceived as markVisionReceivedSvc,
} from "../services/dreamerAwareness";
import {
  nextPendingVision,
  getVisionById,
} from "../../shared/dreamerVisions";
import {
  drainNextMarquee,
  enqueueProphecyForFlag,
  getProphecyProgress,
  markAlbumFilmComplete,
  markIndexViewed,
  markMarqueeWatched,
  setAlbumFilmBookmark,
  type EligibilitySnapshot,
} from "../services/prophecyQueue";
import { evaluateAndGrant } from "../services/prophecyAchievements";
import { backfillProphecyCredit } from "../services/prophecyBackfill";
import {
  getProphecyVisionById,
  resolveBookend,
} from "../../shared/prophecyVisionMap";
import { grantOracleCharges } from "./oracleDeck";
import { getDb } from "../db";

/** The eligibility snapshot input shape — the client sends its
 *  best-effort current act + first-contact flag because those
 *  live in narrative state, not the dreamer_awareness row. */
const eligibilityInput = z
  .object({
    currentAct: z.number().int().min(0).max(7).default(1),
    firstContactReceived: z.boolean().default(false),
  })
  .default({ currentAct: 1, firstContactReceived: false });

function snap(input: z.infer<typeof eligibilityInput>): EligibilitySnapshot {
  return {
    currentAct: input.currentAct,
    firstContactReceived: input.firstContactReceived,
  };
}

export const dreamerVisionsRouter = router({
  /* ─── Legacy awareness-threshold cutscene ─── */
  getNextPendingVision: protectedProcedure.query(async ({ ctx }) => {
    const snapshot = await getDreamerAwareness(ctx.user.id);
    if (!snapshot) {
      return { vision: null as null };
    }
    const next = nextPendingVision(snapshot.count, snapshot.visionsReceived);
    if (!next) return { vision: null as null };
    return {
      vision: {
        id: next.id,
        threshold: next.threshold,
        title: next.title,
        slideshow: next.slideshow,
      },
    };
  }),

  markVisionReceived: protectedProcedure
    .input(z.object({ visionId: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      const vision = getVisionById(input.visionId);
      if (!vision) {
        return { success: false as const, reason: "unknown_vision_id" };
      }
      await markVisionReceivedSvc(ctx.user.id, vision.id);
      return { success: true as const };
    }),

  /* ─── Prophecy marquee drain (the new dream-mode pipeline) ─── */
  getNextPendingProphecy: protectedProcedure
    .input(eligibilityInput)
    .query(async ({ ctx, input }) => {
      const result = await drainNextMarquee(ctx.user.id, snap(input));
      if (!result) return { vision: null as null };
      return {
        vision: {
          id: result.vision.id,
          slideshowId: result.vision.slideshowId,
          albumSlug: result.vision.albumSlug,
          unawakenable: result.vision.unawakenable === true,
          oracleCardSlug: result.vision.oracleCardSlug,
          opening: result.bookend?.opening ?? null,
          closing: result.bookend?.closing ?? null,
        },
      };
    }),

  /* ─── Reactor entry: enqueue on flag transition ─── */
  queueProphecyVision: protectedProcedure
    .input(
      z.object({
        flagId: z.string().min(1).max(128),
        currentAct: z.number().int().min(0).max(7).default(1),
        firstContactReceived: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await enqueueProphecyForFlag(ctx.user.id, input.flagId, {
        currentAct: input.currentAct,
        firstContactReceived: input.firstContactReceived,
      });
      return result;
    }),

  /* ─── Marquee completion ─── */
  markProphecyReceived: protectedProcedure
    .input(
      z.object({
        visionId: z.string().min(1).max(96),
        watched: z.enum(["full", "awoken_early"]),
        currentAct: z.number().int().min(0).max(7).default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await markMarqueeWatched(
        ctx.user.id,
        input.visionId,
        input.watched,
      );
      // On a full watch that newly grants completion, evaluate the
      // Witness ladder and grant the Oracle charge bound to the card
      // (if any). Awoken-early watches and re-watches are no-ops here.
      let achievementsGranted: string[] = [];
      if (result.granted) {
        const vision = getProphecyVisionById(input.visionId);
        if (vision?.oracleCardSlug) {
          const db = await getDb();
          if (db) {
            await grantOracleCharges(db, ctx.user.id, 1);
          }
        }
        const earned = await evaluateAndGrant(
          ctx.user.id,
          input.currentAct >= 7,
        );
        achievementsGranted = earned.map((a) => a.id);
      }
      return { ...result, achievementsGranted };
    }),

  /* ─── Index view (Whisper / Static / re-watched Marquee) ─── */
  markIndexViewed: protectedProcedure
    .input(
      z.object({
        visionId: z.string().min(1).max(96),
        currentAct: z.number().int().min(0).max(7).default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await markIndexViewed(ctx.user.id, input.visionId);
      let achievementsGranted: string[] = [];
      if (result.granted) {
        const earned = await evaluateAndGrant(
          ctx.user.id,
          input.currentAct >= 7,
        );
        achievementsGranted = earned.map((a) => a.id);
      }
      return { ...result, achievementsGranted };
    }),

  /* ─── Album-as-Film ─── */
  markAlbumFilmComplete: protectedProcedure
    .input(
      z.object({
        albumSlug: z.string().min(1).max(64),
        currentAct: z.number().int().min(0).max(7).default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await markAlbumFilmComplete(ctx.user.id, input.albumSlug);
      let achievementsGranted: string[] = [];
      if (result.granted) {
        const earned = await evaluateAndGrant(
          ctx.user.id,
          input.currentAct >= 7,
        );
        achievementsGranted = earned.map((a) => a.id);
      }
      return { ...result, achievementsGranted };
    }),

  setAlbumFilmBookmark: protectedProcedure
    .input(
      z.object({
        albumSlug: z.string().min(1).max(64),
        trackId: z.string().min(1).max(64).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await setAlbumFilmBookmark(ctx.user.id, input.albumSlug, input.trackId);
      return { success: true as const };
    }),

  /* ─── Antiquarian's Index data ─── */
  getProphecyProgress: protectedProcedure.query(async ({ ctx }) => {
    const progress = await getProphecyProgress(ctx.user.id);
    if (!progress) {
      return {
        marqueesReceived: [],
        marqueesCompleted: [],
        unlockedWhispers: [],
        viewedInIndex: [],
        albumFilmsCompleted: [],
        albumFilmBookmarks: {},
        achievementsGranted: [],
        pendingMarquees: [],
      };
    }
    return progress;
  }),

  /* ─── Retroactive Witness credit ─── */
  /** Backfill credit for a player who watched slideshows before the
   *  prophecy system shipped. The client passes its narrativeFlags
   *  map; the server credits any prophecy whose bound flag is set
   *  but whose vision hasn't been received / viewed yet. Idempotent. */
  runProphecyBackfill: protectedProcedure
    .input(
      z.object({
        narrativeFlags: z.record(z.string(), z.boolean()),
        currentAct: z.number().int().min(0).max(7).default(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return backfillProphecyCredit(
        ctx.user.id,
        input.narrativeFlags,
        input.currentAct >= 7,
      );
    }),

  /* ─── Dream-mode bookend resolver (used by free-browse paths
        that want to render a vision with its bookend even when
        not draining from the queue, e.g. Index re-watch). ─── */
  getVisionWithBookend: protectedProcedure
    .input(z.object({ visionId: z.string().min(1).max(96) }))
    .query(async ({ input }) => {
      const vision = getProphecyVisionById(input.visionId);
      if (!vision) return { vision: null as null };
      const bookend = resolveBookend(vision);
      return {
        vision: {
          id: vision.id,
          slideshowId: vision.slideshowId,
          albumSlug: vision.albumSlug,
          unawakenable: vision.unawakenable === true,
          oracleCardSlug: vision.oracleCardSlug,
          opening: bookend?.opening ?? null,
          closing: bookend?.closing ?? null,
        },
      };
    }),
});
