/* ═══════════════════════════════════════════════════════
   STORY PROGRESS — Compact widget showing current chapter,
   epoch, completion %, and next story beat preview.
   Fits in sidebar or dashboard.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Clock } from "lucide-react";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { CHAPTER_ICONS, EPOCH_SYMBOLS } from "@/data/optionalComponentAssets";

/* ── Story chapter definitions ── */
interface StoryChapter {
  id: string;
  number: number;
  name: string;
  epoch: string;
  epochName: string;
  description: string;
  totalBeats: number;
  keyBeat: string; // Next interesting thing
}

/** Map human-readable epoch name → slug key in EPOCH_SYMBOLS. */
const EPOCH_SLUG: Record<string, keyof typeof EPOCH_SYMBOLS> = {
  "The Age of Privacy": "age_of_privacy",
  "The Fall of Reality": "fall_of_reality",
  "The Dischordian War": "dischordian_war",
};

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "ch1",
    number: 1,
    name: "Awakening",
    epoch: "I",
    epochName: "The Age of Privacy",
    description: "You awaken in the Cryo Bay. Elara guides your first steps aboard the Inception Ark.",
    totalBeats: 8,
    keyBeat: "Discover the Bridge and meet the ship's AI systems",
  },
  {
    id: "ch2",
    number: 2,
    name: "The Signal",
    epoch: "I",
    epochName: "The Age of Privacy",
    description: "An anomalous signal draws you deeper into the Ark's mysteries.",
    totalBeats: 12,
    keyBeat: "Decode the transmission from Sector 7-Omega",
  },
  {
    id: "ch3",
    number: 3,
    name: "Fractured Trust",
    epoch: "II",
    epochName: "The Fall of Reality",
    description: "Alliances form and break. The Panopticon's reach extends even here.",
    totalBeats: 15,
    keyBeat: "Choose between Elara's counsel and The Human's warning",
  },
  {
    id: "ch4",
    number: 4,
    name: "The Architect's Ghost",
    epoch: "II",
    epochName: "The Fall of Reality",
    description: "Echoes of the Architect surface in the ship's oldest memory banks.",
    totalBeats: 18,
    keyBeat: "Access the Architect's hidden laboratory",
  },
  {
    id: "ch5",
    number: 5,
    name: "The Thought Virus",
    epoch: "III",
    epochName: "The Dischordian War",
    description: "The Thought Virus mutates. The Ark's systems begin to fail.",
    totalBeats: 20,
    keyBeat: "Confront the Source in the Reactor Core",
  },
  {
    id: "ch6",
    number: 6,
    name: "Convergence",
    epoch: "III",
    epochName: "The Dischordian War",
    description: "All paths converge. The final battle for the Ark — and reality — begins.",
    totalBeats: 25,
    keyBeat: "The Warlord reveals the truth behind the Inception Arks",
  },
];

/* ── Component ── */

interface StoryProgressProps {
  /** Current chapter index (0-based) */
  currentChapter?: number;
  /** Number of story beats completed in current chapter */
  beatsCompleted?: number;
  /** Optional click handler to open full story view */
  onClick?: () => void;
  /** Compact mode for sidebar */
  compact?: boolean;
  className?: string;
}

export default function StoryProgress({
  currentChapter = 0,
  beatsCompleted = 0,
  onClick,
  compact = false,
  className = "",
}: StoryProgressProps) {
  const chapter = STORY_CHAPTERS[currentChapter] ?? STORY_CHAPTERS[0];

  const progress = useMemo(() => {
    if (!chapter) return 0;
    return Math.min(100, Math.round((beatsCompleted / chapter.totalBeats) * 100));
  }, [beatsCompleted, chapter]);

  // Overall story progress
  const overallProgress = useMemo(() => {
    const totalBeats = STORY_CHAPTERS.reduce((sum, c) => sum + c.totalBeats, 0);
    const completedBeats =
      STORY_CHAPTERS.slice(0, currentChapter).reduce((sum, c) => sum + c.totalBeats, 0) +
      beatsCompleted;
    return Math.round((completedBeats / totalBeats) * 100);
  }, [currentChapter, beatsCompleted]);

  const chapterIcon = CHAPTER_ICONS[chapter.number];
  const epochIcon = EPOCH_SYMBOLS[EPOCH_SLUG[chapter.epochName]];

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`void-surface p-3 w-full text-left hover:border-primary/30 transition-all group ${className}`}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <BookOpen size={12} className="text-cyan-400" />
          <span className="font-mono text-[8px] tracking-[0.2em] text-cyan-400/60">
            STORY
          </span>
          <span className="font-mono text-[8px] text-white/20 ml-auto">
            {overallProgress}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          {chapterIcon && (
            <ResponsiveImage
              src={chapterIcon.src}
              alt={chapterIcon.title}
              className="size-5 rounded-sm object-cover flex-shrink-0"
            />
          )}
          <p className="font-display text-xs font-bold text-white/80 truncate">
            Ch. {chapter.number}: {chapter.name}
          </p>
        </div>

        <div className="w-full h-1 rounded-full bg-white/5 mt-1.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-cyan-400/60"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </button>
    );
  }

  return (
    <div
      className={`void-surface p-4 ${onClick ? "cursor-pointer hover:border-primary/30 transition-all" : ""} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-cyan-400" />
          <span className="font-mono text-[9px] tracking-[0.2em] text-cyan-400/60">
            STORY PROGRESS
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/30">
          {overallProgress}% complete
        </span>
      </div>

      {/* Current chapter */}
      <div className="mb-3 flex items-start gap-3">
        {chapterIcon && (
          <ResponsiveImage
            src={chapterIcon.src}
            alt={chapterIcon.title}
            className="size-12 rounded-lg object-cover flex-shrink-0 border border-white/10"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            {epochIcon && (
              <ResponsiveImage
                src={epochIcon.src}
                alt={epochIcon.title}
                className="size-5 flex-shrink-0 object-contain"
              />
            )}
            <span className="font-mono text-[9px] text-amber-400/60 tracking-wider">
              EPOCH {chapter.epoch}
            </span>
            <span className="font-mono text-[8px] text-white/20 truncate">
              {chapter.epochName}
            </span>
          </div>
          <h3 className="font-display text-base font-bold text-white/90">
            Chapter {chapter.number}: {chapter.name}
          </h3>
          <p className="font-mono text-[11px] text-white/40 mt-0.5 leading-relaxed">
            {chapter.description}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-[9px] text-white/25">
            {beatsCompleted}/{chapter.totalBeats} beats
          </span>
          <span className="font-mono text-[9px] text-cyan-400/60 font-bold">
            {progress}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #33E2E6 0%, #3875FA 100%)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Next story beat preview */}
      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
        <Clock size={12} className="text-white/20 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[8px] text-white/20 tracking-wider mb-0.5">
            NEXT STORY BEAT
          </p>
          <p className="font-mono text-[11px] text-white/50 leading-relaxed">
            {chapter.keyBeat}
          </p>
        </div>
        {onClick && (
          <ChevronRight size={14} className="text-white/15 flex-shrink-0 mt-0.5" />
        )}
      </div>
    </div>
  );
}
