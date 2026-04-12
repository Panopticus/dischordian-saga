/* ═══════════════════════════════════════════════════════
   MECHRONIS ACADEMY PAGE

   The Academy daily-lesson UI — mirrors the Apprentice
   page's Celebration flow, but for the player's own
   skill development. Each day the player's assigned
   Professor delivers a classroom exercise.

   Outcomes affect: Guild skill XP, corruption, and
   the Professor's approval score.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, GraduationCap, ScrollText, Star, AlertTriangle,
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { getDominantGuild } from "@/game/archonTrainingVoices";
import { getProfessorByArchon } from "@shared/mechronisProfessors";
import {
  generateDailyLesson,
  gradePoints,
  type LessonOption,
  type LessonGrade,
} from "@shared/mechronisLessons";
import type { SkillId } from "@/game/innerVoices";

const GRADE_COLORS: Record<LessonGrade, string> = {
  fail: "text-red-400",
  pass: "text-zinc-300",
  honor: "text-amber-400",
  distinction: "text-emerald-400",
};

const GRADE_LABELS: Record<LessonGrade, string> = {
  fail: "FAIL",
  pass: "PASS",
  honor: "HONOR",
  distinction: "DISTINCTION",
};

const GRADE_BG: Record<LessonGrade, string> = {
  fail: "border-red-500/50 bg-red-500/10",
  pass: "border-zinc-500/40 bg-zinc-500/10",
  honor: "border-amber-500/50 bg-amber-500/10",
  distinction: "border-emerald-500/50 bg-emerald-500/10",
};

export default function MechronisAcademyPage() {
  const { state, addCorruption, setInnerVoiceSkill, addAcademyTranscriptEntry, adjustProfessorApproval } = useGame();
  const skills = (state.innerVoiceSkills ?? {}) as Record<SkillId, number>;
  const dominantGuild = useMemo(() => getDominantGuild(skills), [skills]);

  const [lastResult, setLastResult] = useState<{
    grade: LessonGrade;
    transcriptNote: string;
    skillXpDelta: number;
  } | null>(null);

  // Generate today's lesson based on the player's level as seed
  const playerLevel = Object.values(skills).reduce((s, v) => s + v, 0);
  const dayIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000)); // one lesson per real day

  const lesson = useMemo(
    () => generateDailyLesson(dayIndex, playerLevel),
    [dayIndex, playerLevel],
  );

  const professor = dominantGuild
    ? getProfessorByArchon(dominantGuild.mentor.archonNumber)
    : undefined;

  const handleChoice = useCallback((option: LessonOption) => {
    const { outcome } = option;

    // Apply corruption delta
    if (outcome.corruptionDelta !== 0) {
      addCorruption(outcome.corruptionDelta);
    }

    // Apply skill XP (to dominant skill)
    if (dominantGuild && outcome.skillXpDelta !== 0) {
      const currentLevel = skills[dominantGuild.skillId] ?? 0;
      setInnerVoiceSkill(dominantGuild.skillId, Math.max(0, currentLevel + outcome.skillXpDelta));
    }

    // Persist to academy transcript + professor approval
    addAcademyTranscriptEntry({
      day: dayIndex,
      professorId: lesson.professorId,
      lessonId: lesson.id,
      grade: outcome.grade,
      xpDelta: outcome.skillXpDelta,
    });
    adjustProfessorApproval(lesson.professorId, outcome.approvalDelta);

    setLastResult({
      grade: outcome.grade,
      transcriptNote: outcome.transcriptNote,
      skillXpDelta: outcome.skillXpDelta,
    });
  }, [dominantGuild, skills, addCorruption, setInnerVoiceSkill]);

  // No guild yet — can't attend Academy
  if (!dominantGuild) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <GraduationCap size={40} className="mx-auto text-muted-foreground/40 mb-3" />
          <h2 className="font-display text-lg font-bold tracking-wider mb-2">No Guild Assignment</h2>
          <p className="font-mono text-[10px] text-muted-foreground/70 leading-relaxed">
            Develop your inner voices. When one rises above the rest, the Academy will assign you a Professor and open your classroom.
          </p>
          <Link href="/" className="inline-block mt-4 px-4 py-2 rounded border border-border/40 font-mono text-[11px] text-muted-foreground hover:bg-muted/20">
            Return to Bridge
          </Link>
        </div>
      </div>
    );
  }

  const { guild, mentor } = dominantGuild;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950/30 text-foreground relative overflow-hidden">
      {/* Subtle scanline overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.006) 2px, rgba(255,255,255,0.006) 4px)",
      }} />

      {/* Background environment art — classroom for lessons, grand hall for results */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={lastResult ? "grand-hall" : "classroom"}
            src={lastResult
              ? "/art/mechronis/environments/mechronis_grand_hall.jpg"
              : "/art/mechronis/environments/mechronis_classroom.jpg"}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.14 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="w-[115%] h-[115%] object-cover academy-drift"
            style={{
              position: "absolute", top: "-7.5%", left: "-7.5%",
              filter: "brightness(0.4) saturate(0.6)",
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)",
        }} />
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes academy-drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-1.5%, -1%) scale(1.02); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .academy-drift { animation: academy-drift 25s ease-in-out infinite; }
        @keyframes portrait-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.005); }
        }
        .portrait-breathe { animation: portrait-breathe 4s ease-in-out infinite; }
      `}</style>

      <div className="max-w-4xl mx-auto relative z-10 p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <GraduationCap size={18} className="text-indigo-400" />
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">MECHRONIS ACADEMY</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              {guild.name} · {professor?.teacherName ?? mentor.archonName}
            </p>
          </div>
        </div>

        {/* Professor card */}
        {professor && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-indigo-500/30 bg-indigo-950/20 backdrop-blur-sm p-4 mb-4"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-indigo-500/30 shadow-lg shadow-indigo-500/10 relative">
                <img
                  src={professor.portrait}
                  alt={professor.teacherName}
                  className="w-full h-full object-cover object-top portrait-breathe"
                />
                {/* Grade-reactive glow overlay */}
                {lastResult && (
                  <motion.div
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0"
                    style={{
                      boxShadow: lastResult.grade === "distinction"
                        ? "inset 0 0 20px rgba(52,211,153,0.5)"
                        : lastResult.grade === "honor"
                        ? "inset 0 0 20px rgba(251,191,36,0.4)"
                        : lastResult.grade === "fail"
                        ? "inset 0 0 20px rgba(248,113,113,0.5)"
                        : "none",
                    }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-sm font-bold text-indigo-300">{professor.teacherName}</h3>
                <p className="font-mono text-[9px] italic text-indigo-300/60">{professor.title}</p>
                <p className="font-mono text-[10px] text-foreground/70 mt-1.5 leading-relaxed">
                  "{professor.philosophy}"
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/50">
                    Rule: {professor.classroomRule}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Today's lesson or result */}
        <AnimatePresence mode="wait">
          {lastResult ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`rounded-lg border p-5 ${GRADE_BG[lastResult.grade]}`}
            >
              <div className="flex items-center gap-2 mb-3">
                {lastResult.grade === "distinction" ? (
                  <Star size={18} className="text-emerald-400" />
                ) : lastResult.grade === "fail" ? (
                  <AlertTriangle size={18} className="text-red-400" />
                ) : (
                  <ScrollText size={18} className={GRADE_COLORS[lastResult.grade]} />
                )}
                <span className={`font-display text-lg font-bold tracking-wider ${GRADE_COLORS[lastResult.grade]}`}>
                  {GRADE_LABELS[lastResult.grade]}
                </span>
                <span className={`font-mono text-[10px] ml-auto tabular-nums ${lastResult.skillXpDelta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {lastResult.skillXpDelta >= 0 ? "+" : ""}{lastResult.skillXpDelta} XP
                </span>
              </div>

              {/* Transcript note */}
              <div className="p-3 rounded border border-border/20 bg-black/30 mb-4">
                <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground/50 block mb-1">
                  Transcript Entry
                </span>
                <p className="font-mono text-[10px] italic text-foreground/80 leading-relaxed">
                  {lastResult.transcriptNote}
                </p>
              </div>

              {/* Grade star visualization */}
              <div className="flex items-center justify-center gap-1 mb-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < gradePoints(lastResult.grade)
                      ? GRADE_COLORS[lastResult.grade]
                      : "text-zinc-800"}
                    fill={i < gradePoints(lastResult.grade) ? "currentColor" : "none"}
                  />
                ))}
              </div>

              <div className="text-center">
                <p className="font-mono text-[9px] text-muted-foreground/50 mb-3">
                  The Academy records your choice. Return tomorrow for the next lesson.
                </p>
                <Link
                  href="/"
                  className="inline-block px-4 py-2 rounded border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 font-mono text-[11px] uppercase tracking-wider hover:bg-indigo-500/20"
                >
                  Return to Bridge
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="lesson"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-indigo-500/25 bg-indigo-950/15 backdrop-blur-sm overflow-hidden"
            >
              {/* Lesson header */}
              <div className="p-4 border-b border-indigo-500/15">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-indigo-400/70">
                    Today's Lesson
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground/50 tabular-nums">
                    Academy Day {dayIndex % 365}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-foreground/90 leading-relaxed">
                  {lesson.prompt}
                </p>
              </div>

              {/* Options */}
              <div className="p-3 space-y-2">
                {lesson.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleChoice(opt)}
                    className="w-full text-left p-3 rounded-lg border border-border/30 bg-black/20 hover:border-indigo-400/40 hover:bg-indigo-950/30 transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-xs font-bold text-foreground group-hover:text-indigo-300 transition-colors">
                        {opt.label}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground/70 leading-snug">
                      {opt.description}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
