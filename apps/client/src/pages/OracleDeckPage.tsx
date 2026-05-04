/* ═══════════════════════════════════════════════════════
   THE ORACLE DECK — 23-card Dischordian Tarot System

   Collection view + daily reading + weekly spread. Pre-match
   readings are triggered from the TCG / chess match lobbies
   (E6 / E7), not from this page directly.

   Design: the page is deliberately small. A tarot reading is
   mostly negative space around a few intense images. The UI
   should feel like flipping a card on an oak table, not
   browsing a menu.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import {
  ArrowLeft,
  Sparkles,
  Lock,
  Moon,
  Sun,
  Loader2,
  CheckCircle2,
  Calendar,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getOracleCardBySlug } from "@shared/tcg-core";
import { useGame } from "@/contexts/GameContext";
import { useWitnessingStore } from "@/stores/witnessingStore";
import {
  PROPHECY_VISIONS,
  type ProphecyVision,
} from "@shared/prophecyVisionMap";
import { getProphecyById } from "@shared/danielCrossProphecies";
import { getSlideshow } from "@shared/songSlideshows";
import { DREAMER_VISIONS } from "@shared/dreamerVisions";

/** Find the prophecy vision bound to an Oracle card slug, if any.
 *  ~23 marquee visions are bound (one per Major Arcanum); the
 *  remaining marquees + every whisper / static are unbound. */
function findVisionForOracleSlug(slug: string): ProphecyVision | undefined {
  return PROPHECY_VISIONS.find((v) => v.oracleCardSlug === slug);
}

function resolveSlideshowDef(slideshowId: string) {
  const direct = getSlideshow(slideshowId);
  if (direct) return direct;
  for (const dv of DREAMER_VISIONS) {
    if (dv.slideshow.id === slideshowId) return dv.slideshow;
  }
  return undefined;
}

type View = "deck" | "daily_reading" | "weekly_reading";

/** Arcanum → subtle accent color. The Thoth deck taught us that
 *  tarot loves color. Dischordia gets a cooler, more digital
 *  palette than Crowley's. */
const ARCANUM_ACCENT: Record<string, string> = {
  fool: "void-border void-text-energy",
  magician: "void-border void-text-accent",
  high_priestess: "void-border void-text-energy",
  empress: "void-border-success void-text-energy",
  emperor: "void-border void-text",
  hierophant: "void-border-system void-text-system",
  lovers: "void-border-error void-text-error",
  chariot: "void-border void-text-premium",
  justice: "void-border-success void-text-energy",
  hermit: "void-border void-text",
  fortune: "void-border void-text-premium",
  strength: "void-border-error void-text-error",
  hanged_man: "void-border-success void-text-energy",
  death: "void-border void-text",
  temperance: "void-border-success void-text-energy",
  devil: "void-border-system void-text-system",
  tower: "void-border-error void-text-error",
  star: "void-border void-text-energy",
  moon: "void-border-system void-text-system",
  sun: "void-border void-text-premium",
  judgment: "void-border-success void-text-energy",
  world: "void-border-system void-text-system",
  fnord: "void-border-error void-text-error",
};

export default function OracleDeckPage() {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState<View>("deck");

  const progressQ = trpc.oracleDeck.getProgress.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const collectionQ = trpc.oracleDeck.listCollection.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const activeDailyQ = trpc.oracleDeck.getActiveDailyReading.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const castDaily = trpc.oracleDeck.castDaily.useMutation();
  const castWeekly = trpc.oracleDeck.castWeekly.useMutation();
  const utils = trpc.useUtils();

  const [dailyReading, setDailyReading] = useState<any>(null);
  const [weeklyReading, setWeeklyReading] = useState<any>(null);

  const owned = collectionQ.data?.filter((c: any) => c.owned) ?? [];
  const locked = collectionQ.data?.filter((c: any) => !c.owned) ?? [];

  const handleCastDaily = async () => {
    const result = await castDaily.mutateAsync();
    setDailyReading(result.reading);
    // Refresh the active-daily query so the banner on the deck
    // view reflects today's draw when the player returns.
    utils.oracleDeck.getActiveDailyReading.invalidate();
    setView("daily_reading");
  };

  const handleCastWeekly = async () => {
    try {
      const result = await castWeekly.mutateAsync();
      setWeeklyReading(result.reading);
      setView("weekly_reading");
    } catch (err: any) {
      alert(err.message ?? "Could not cast weekly reading.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <a
          href={getLoginUrl()}
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold"
        >
          Sign in to open the Oracle Deck
        </a>
      </div>
    );
  }

  if (progressQ.isLoading || collectionQ.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  const progress = progressQ.data?.progress;
  const charges = progress?.charges ?? 0;
  const todayDayNumber = progressQ.data?.dayNumber ?? 0;
  const canCastDaily = progress?.lastDailyDayNumber !== todayDayNumber;
  const thisWeekNumber = progressQ.data?.weekNumber ?? 0;
  const canCastWeekly =
    progress?.lastWeeklyWeekNumber !== thisWeekNumber && charges >= 3;

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-md bg-secondary/50 hover:bg-secondary"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-wider flex items-center gap-2">
            <Moon size={20} className="void-text-system" />
            THE ORACLE DECK
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            Twenty-three cards the Oracle and the Engineer wrote together
            the week before she left // {owned.length} / {collectionQ.data?.length ?? 23} collected
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "deck" && (
          <motion.div
            key="deck"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Today's reading banner — only when already cast */}
            {activeDailyQ.data && (() => {
              const draw = activeDailyQ.data.draws?.[0];
              if (!draw) return null;
              const card = getOracleCardBySlug(draw.cardSlug);
              if (!card) return null;
              return (
                <div
                  className="rounded-lg border void-border void-bg-sunk p-4 cursor-pointer hover-lift"
                  onClick={() => {
                    setDailyReading(activeDailyQ.data);
                    setView("daily_reading");
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={14} className="void-text-accent" />
                    <span className="font-display text-xs font-bold tracking-wider void-text-accent">
                      TODAY&apos;S READING
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground ml-auto">
                      click to reopen
                    </span>
                  </div>
                  <p className="font-display text-base font-bold">
                    {card.name}{" "}
                    <span className="font-mono text-[10px] text-muted-foreground italic">
                      ({draw.orientation})
                    </span>
                  </p>
                  <p className="font-mono text-[11px] void-text-accent mt-1">
                    {draw.buff.label}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-2 italic line-clamp-2">
                    &ldquo;{draw.orientation === "upright" ? card.uprightMeaning : card.reversedMeaning}&rdquo;
                  </p>
                </div>
              );
            })()}

            {/* Reading actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleCastDaily}
                disabled={!canCastDaily || castDaily.isPending}
                className="rounded-lg border void-border void-bg-sunk p-4 text-left hover-lift disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Sun size={16} className="void-text-energy" />
                  <span className="font-display text-sm font-bold tracking-wider">
                    DAILY READING
                  </span>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {canCastDaily
                    ? "One free card for the shape of your day."
                    : "Already cast today. Come back tomorrow."}
                </p>
              </button>

              <button
                onClick={handleCastWeekly}
                disabled={!canCastWeekly || castWeekly.isPending}
                className="rounded-lg border void-border-system void-bg-system p-4 text-left hover-lift disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={16} className="void-text-system" />
                  <span className="font-display text-sm font-bold tracking-wider">
                    WEEKLY SPREAD — THE FIVE FORCES
                  </span>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {canCastWeekly
                    ? `Five cards for the week. Cost: 3 Oracle charges (you have ${charges}).`
                    : charges < 3
                      ? `Not enough charges (need 3, have ${charges}).`
                      : "Already cast this week. Come back next week."}
                </p>
              </button>
            </div>

            {/* Charges display */}
            <div className="rounded-lg border border-border/30 bg-card/20 p-3 flex items-center gap-3">
              <Sparkles size={16} className="void-text-accent" />
              <span className="font-mono text-xs">
                Oracle Charges: <span className="void-text-accent">{charges}</span>
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                // earned from governance votes, chapter completions, and
                Academy milestones. 1 per pre-match reading; 3 per weekly spread.
              </span>
            </div>

            {/* Owned cards */}
            {owned.length > 0 && (
              <div>
                <h2 className="font-display text-sm font-bold tracking-wider mb-2 flex items-center gap-2">
                  <CheckCircle2 size={14} className="void-text-energy" />
                  IN YOUR DECK
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {owned.map((card: any) => (
                    <OracleCardFace key={card.slug} card={card} />
                  ))}
                </div>
              </div>
            )}

            {/* Locked cards */}
            {locked.length > 0 && (
              <div>
                <h2 className="font-display text-sm font-bold tracking-wider mb-2 flex items-center gap-2">
                  <Lock size={14} className="text-muted-foreground" />
                  NOT YET COLLECTED
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {locked.map((card: any) => (
                    <OracleCardFace key={card.slug} card={card} silhouette />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {view === "daily_reading" && dailyReading && (
          <ReadingView
            key="daily"
            reading={dailyReading}
            onClose={() => {
              setView("deck");
              setDailyReading(null);
            }}
          />
        )}

        {view === "weekly_reading" && weeklyReading && (
          <ReadingView
            key="weekly"
            reading={weeklyReading}
            onClose={() => {
              setView("deck");
              setWeeklyReading(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── OracleCardFace ─── */
function OracleCardFace({
  card,
  silhouette,
}: {
  card: any;
  silhouette?: boolean;
}) {
  const accent = ARCANUM_ACCENT[card.arcanum] ?? "border-border/30 text-foreground";
  if (silhouette) {
    return (
      <div className="rounded-md border border-border/30 bg-card/20 p-3 opacity-60">
        <div className="flex items-center gap-1 mb-1">
          <Lock size={10} className="text-muted-foreground" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            ??? // {card.arcanum.replace(/_/g, " ")}
          </span>
        </div>
        <p className="font-display text-xs font-bold text-muted-foreground">
          {card.id === 22 ? "???" : card.name}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground mt-2 line-clamp-3">
          {card.unlock.label}
        </p>
      </div>
    );
  }
  return (
    <div className={`rounded-md border ${accent} bg-card/40 p-3 hover-lift`}>
      <span className="font-mono text-[9px] uppercase tracking-widest">
        {card.id} // {card.arcanum.replace(/_/g, " ")}
      </span>
      <p className="font-display text-xs font-bold mt-1">{card.name}</p>
      <p className="font-mono text-[10px] text-muted-foreground mt-2 line-clamp-4">
        {card.loreBlurb}
      </p>
    </div>
  );
}

/* ─── ReadingView ─── */
function ReadingView({
  reading,
  onClose,
}: {
  reading: any;
  onClose: () => void;
}) {
  const draws = reading.draws ?? [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-lg border void-border-system bg-gradient-to-br from-violet-500/5 to-transparent p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold tracking-wider">
          {reading.spread?.name ?? "Reading"}
        </h2>
        <button
          onClick={onClose}
          className="font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          ← close
        </button>
      </div>
      <p className="font-mono text-[11px] text-muted-foreground">
        {reading.spread?.blurb}
      </p>

      <div
        className={`grid gap-3 ${
          draws.length <= 1
            ? "grid-cols-1"
            : draws.length <= 3
              ? "grid-cols-1 sm:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        }`}
      >
        {draws.map((d: any, i: number) => (
          <DrawnCard key={i} drawn={d} hidden={d.position.label === "Hidden"} />
        ))}
      </div>

      {reading.fallback && (
        <p className="font-mono text-[10px] void-text-accent border-l-2 void-border pl-3">
          Fallback reading — you own fewer cards than the spread length. The
          Prisoner stood in for you today. Collect more Oracle cards to
          unlock the full reading.
        </p>
      )}
    </motion.div>
  );
}

function DrawnCard({ drawn, hidden }: { drawn: any; hidden: boolean }) {
  // Look up the full card data so we can show the name, arcanum,
  // and upright/reversed meaning instead of the raw slug.
  const card = !hidden ? getOracleCardBySlug(drawn.cardSlug) : undefined;
  const accent = hidden
    ? "void-border-error void-text-error"
    : card
      ? ARCANUM_ACCENT[card.arcanum] ?? "border-border/30 text-foreground"
      : "border-border/30 text-foreground";

  // Prophecy binding: ~23 marquees are bound to Oracle cards. If
  // this card has a bound vision, surface the appropriate
  // affordance — "Witness this prophecy" when the player has
  // unlocked it, a "hum-of-vision" tease when they haven't.
  const game = useGame();
  const playSlideshow = useWitnessingStore((s) => s.playSlideshow);
  const completeActive = useWitnessingStore((s) => s.completeActiveSlideshow);
  const progressQuery = trpc.dreamerVisions.getProphecyProgress.useQuery(
    undefined,
    { enabled: !hidden && Boolean(drawn.cardSlug) },
  );
  const markIndexViewedMutation =
    trpc.dreamerVisions.markIndexViewed.useMutation();

  const boundVision = !hidden ? findVisionForOracleSlug(drawn.cardSlug) : undefined;
  const boundOpening = boundVision
    ? getProphecyById(boundVision.openingProphecyId)
    : undefined;

  const visionUnlocked = useMemo(() => {
    if (!boundVision || !progressQuery.data) return false;
    const received = new Set(progressQuery.data.marqueesReceived);
    const completed = new Set(progressQuery.data.marqueesCompleted);
    const unlockedWhispers = new Set(progressQuery.data.unlockedWhispers);
    const viewed = new Set(progressQuery.data.viewedInIndex);
    if (boundVision.intensity === "marquee") {
      return received.has(boundVision.id) || completed.has(boundVision.id);
    }
    return unlockedWhispers.has(boundVision.id) || viewed.has(boundVision.id);
  }, [boundVision, progressQuery.data]);

  const watchProphecy = () => {
    if (!boundVision) return;
    const def = resolveSlideshowDef(boundVision.slideshowId);
    if (!def) return;
    const opening = getProphecyById(boundVision.openingProphecyId);
    const closing = getProphecyById(boundVision.closingProphecyId);
    playSlideshow(def, {
      dream:
        opening && closing
          ? {
              visionId: boundVision.id,
              bookend: { opening, closing },
              unawakenable: boundVision.unawakenable,
              onDreamEnd: ({ kind }) => {
                if (kind === "full") {
                  // Index re-watch from a reading is a free re-experience —
                  // it counts toward the Archivist tier but not toward
                  // initial completion (server short-circuits dupes).
                  markIndexViewedMutation.mutate({
                    visionId: boundVision.id,
                    currentAct: deriveActFromFlags(game.state.narrativeFlags),
                  });
                }
              },
            }
          : undefined,
      onComplete: () => completeActive(),
    });
  };

  return (
    <div className={`rounded-md border ${accent} bg-black/40 p-4 space-y-2`}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {drawn.position.label}
      </p>
      {hidden ? (
        <>
          <p className="font-display text-sm font-bold void-text-error">???</p>
          <p className="font-mono text-[10px] text-muted-foreground">
            The Hidden card is not revealed in the reading UI. Its effect
            fires at an unspecified moment during the week.
          </p>
        </>
      ) : (
        <>
          <p className="font-display text-sm font-bold">
            {card?.name ?? drawn.cardSlug}
          </p>
          <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
            {card?.arcanum.replace(/_/g, " ")} // {drawn.orientation}
          </p>
          <p className="font-mono text-[10px] text-muted-foreground italic line-clamp-3">
            &ldquo;{drawn.orientation === "upright" ? card?.uprightMeaning : card?.reversedMeaning}&rdquo;
          </p>
          <p className="font-mono text-[10px] void-text-accent">
            {drawn.buff?.label}
          </p>
          <p className="font-mono text-[9px] text-muted-foreground">
            applies at {drawn.position.appliesAt}
          </p>
          {boundVision && visionUnlocked && (
            <button
              type="button"
              onClick={watchProphecy}
              className="mt-2 w-full rounded border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-primary hover:bg-primary/20 transition-colors"
            >
              Witness this prophecy →
            </button>
          )}
          {boundVision && !visionUnlocked && (
            <div className="mt-2 rounded border border-border/20 bg-black/30 px-3 py-2">
              <p className="font-mono text-[10px] italic text-muted-foreground/70">
                This card hums with a vision you haven&apos;t dreamed.
              </p>
              {boundOpening && (
                <p className="font-display text-[11px] text-foreground/60 italic mt-1 line-clamp-2">
                  {boundOpening.text.split("\n")[0]}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function deriveActFromFlags(
  flags: Readonly<Record<string, boolean>> | undefined,
): number {
  if (!flags) return 1;
  for (let n = 7; n >= 1; n--) {
    if (flags[`act${n}_started`] || flags[`act${n}_complete`]) return n;
  }
  return 1;
}
