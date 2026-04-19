/* ═══════════════════════════════════════════════════════
   MECHRONIS ACADEMY PAGE

   The Academy daily-lesson UI — mirrors the Apprentice
   page's Celebration flow, but for the player's own
   skill development. Each day the player's assigned
   Professor delivers a classroom exercise.

   Outcomes affect: Guild skill XP, corruption, and
   the Professor's approval score.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, GraduationCap, ScrollText, Star, AlertTriangle, Trophy, Users,
} from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { getDominantGuild } from "@/game/archonTrainingVoices";
import { getProfessorByArchon } from "@shared/mechronisProfessors";
import {
  generateDailyLesson,
  gradePoints,
  type LessonOption,
  type LessonGrade,
} from "@shared/mechronisLessons";
import {
  MECHRONIS_HOUSES,
  getHouseForArchon,
  getHouseForProfessor,
  houseCupPointsForGrade,
  houseStandings,
  type MechronisHouse,
} from "@shared/mechronisHouses";
import { getVignetteForDay, pickDailyClassmate } from "@shared/mechronisClassmates";
import {
  getDetention, getExtraCredit,
  type DetentionOffer, type ExtraCreditOffer,
} from "@shared/mechronisDetentions";
import type { SkillId } from "@/game/innerVoices";

/**
 * Per-professor classroom art — unique background per Archon.
 * Paths match NanoBanna2 prompt bible (CELEBRATION_MECHRONIS_ART_PROMPTS.md).
 * Falls back to generic mechronis_classroom.jpg until generated.
 */
const CLASSROOM_ART: Record<string, string> = {
  prof_conductor: "/art/classrooms/classroom-kanevas.jpg",
  prof_watcher: "/art/classrooms/classroom-aoki.jpg",
  prof_collector: "/art/classrooms/classroom-halverez.jpg",
  prof_vortex: "/art/classrooms/classroom-orphic.jpg",
  prof_meme: "/art/classrooms/classroom-mireille.jpg",
  prof_warlord: "/art/classrooms/classroom-kasra.jpg",
  prof_politician: "/art/classrooms/classroom-vellis.jpg",
  prof_warden: "/art/classrooms/classroom-greenshaw.jpg",
  prof_game_master: "/art/classrooms/classroom-vex.jpg",
  prof_necromancer: "/art/classrooms/classroom-vasara.jpg",
  prof_engineer: "/art/classrooms/classroom-vent.jpg",
  prof_human: "/art/classrooms/classroom-proctor.jpg",
};
const CLASSROOM_FALLBACK = "/art/mechronis/environments/mechronis_classroom.jpg";

const GRADE_COLORS: Record<LessonGrade, string> = {
  fail: "void-text-error",
  pass: "void-text",
  honor: "void-text-accent",
  distinction: "void-text-energy",
};

const GRADE_LABELS: Record<LessonGrade, string> = {
  fail: "FAIL",
  pass: "PASS",
  honor: "HONOR",
  distinction: "DISTINCTION",
};

const GRADE_BG: Record<LessonGrade, string> = {
  fail: "void-border-error void-bg-error",
  pass: "void-border void-bg-canvas",
  honor: "void-border void-bg-sunk",
  distinction: "void-border-success void-bg-success",
};

export default function MechronisAcademyPage() {
  const {
    state,
    addCorruption,
    setInnerVoiceSkill,
    addAcademyTranscriptEntry,
    adjustProfessorApproval,
    adjustHousePoints,
    setMechronisHouse,
  } = useGame();
  const skills = (state.innerVoiceSkills ?? {}) as Record<SkillId, number>;
  const dominantGuild = useMemo(() => getDominantGuild(skills), [skills]);

  // Resolve the player's House. Pinned once on sort; never re-sorts mid-semester.
  const house: MechronisHouse | undefined = useMemo(() => {
    if (state.mechronisHouseId) {
      return MECHRONIS_HOUSES.find(h => h.id === state.mechronisHouseId);
    }
    if (dominantGuild) {
      return getHouseForArchon(dominantGuild.mentor.archonNumber);
    }
    return undefined;
  }, [state.mechronisHouseId, dominantGuild]);

  // Auto-sort on first Academy visit once a dominant guild exists.
  useEffect(() => {
    if (!state.mechronisHouseId && dominantGuild) {
      const resolved = getHouseForArchon(dominantGuild.mentor.archonNumber);
      if (resolved) setMechronisHouse(resolved.id);
    }
  }, [state.mechronisHouseId, dominantGuild, setMechronisHouse]);

  const standings = useMemo(
    () => houseStandings(state.housePoints ?? {}),
    [state.housePoints],
  );

  const [lastResult, setLastResult] = useState<{
    grade: LessonGrade;
    transcriptNote: string;
    skillXpDelta: number;
  } | null>(null);

  /** Non-null when a detention/extra-credit follow-up is consumed (so it doesn't re-appear). */
  const [followupResolved, setFollowupResolved] = useState<string | null>(null);

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

    // Award House Cup points to the Professor's own House (NOT the player's)
    // so lessons outside your House can still shift standings — the way a
    // guest-lectured class affects Hogwarts's scoreboard.
    const lessonHouse = getHouseForProfessor(lesson.professorId);
    if (lessonHouse) {
      adjustHousePoints(lessonHouse.id, houseCupPointsForGrade(outcome.grade));
    }

    setLastResult({
      grade: outcome.grade,
      transcriptNote: outcome.transcriptNote,
      skillXpDelta: outcome.skillXpDelta,
    });
  }, [
    dominantGuild, skills, lesson, dayIndex,
    addCorruption, setInnerVoiceSkill,
    addAcademyTranscriptEntry, adjustProfessorApproval, adjustHousePoints,
  ]);

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
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in oklch, var(--text-primary) 1%, transparent) 2px, color-mix(in oklch, var(--text-primary) 1%, transparent) 4px)",
      }} />

      {/* Background environment art — classroom / grand hall / graduation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={lastResult
              ? lastResult.grade === "distinction" ? "graduation" : "grand-hall"
              : "classroom"}
            src={lastResult
              ? lastResult.grade === "distinction"
                ? "/art/mechronis/environments/mechronis_graduation.jpg"
                : "/art/mechronis/environments/mechronis_grand_hall.jpg"
              : CLASSROOM_ART[professor?.id ?? ""] ?? CLASSROOM_FALLBACK}
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
          background: "linear-gradient(to bottom, color-mix(in oklch, var(--bg-void) 30%, transparent) 0%, color-mix(in oklch, var(--bg-void) 80%, transparent) 100%)",
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
          <GraduationCap size={18} className="void-text-energy" />
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">MECHRONIS ACADEMY</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              {guild.name} · {professor?.teacherName ?? mentor.archonName}
            </p>
          </div>
        </div>

        {/* House crest + House Cup standings */}
        {house && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border void-border void-bg-sunk backdrop-blur-sm p-3 mb-4"
            style={{
              borderColor: `color-mix(in oklch, ${house.color} 60%, transparent)`,
              background: `linear-gradient(90deg, color-mix(in oklch, ${house.color} 12%, transparent), transparent 60%)`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${house.color}, ${house.accent})`,
                  color: "#10131a",
                }}
                aria-label={`${house.name} crest`}
              >
                <Trophy size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display text-xs font-bold tracking-wider" style={{ color: house.accent }}>
                    {house.name}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/70">
                    · {house.nickname}
                  </span>
                </div>
                <p className="font-mono text-[9px] italic text-foreground/70 mt-0.5">
                  "{house.motto}"
                </p>
              </div>
            </div>

            {/* House Cup standings strip */}
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {standings.map(({ house: h, points }) => (
                <div
                  key={h.id}
                  className={`px-1.5 py-1 rounded border text-center ${h.id === house.id ? "font-bold" : ""}`}
                  style={{
                    borderColor: `color-mix(in oklch, ${h.color} 40%, transparent)`,
                    background: h.id === house.id
                      ? `color-mix(in oklch, ${h.color} 18%, transparent)`
                      : "transparent",
                  }}
                  title={`${h.name} — ${h.nickname}`}
                >
                  <div className="font-mono text-[8px] uppercase tracking-wider truncate" style={{ color: h.accent }}>
                    {h.nickname}
                  </div>
                  <div className="font-mono text-[11px] tabular-nums" style={{ color: h.color }}>
                    {points >= 0 ? "+" : ""}{points}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Professor card */}
        {professor && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border void-border void-bg-sunk backdrop-blur-sm p-4 mb-4"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden border void-border shadow-lg shadow-indigo-500/10 relative">
                <ResponsiveImage
                  src={professor.portrait}
                  alt={professor.teacherName}
                  className="w-full h-full object-cover object-top portrait-breathe"
                  eager
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
                        ? "inset 0 0 20px color-mix(in oklch, var(--energy-premium) 40%, transparent)"
                        : lastResult.grade === "fail"
                        ? "inset 0 0 20px color-mix(in oklch, var(--energy-error) 50%, transparent)"
                        : "none",
                    }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-sm font-bold void-text-energy">{professor.teacherName}</h3>
                <p className="font-mono text-[9px] italic void-text-energy">{professor.title}</p>
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
                  <Star size={18} className="void-text-energy" />
                ) : lastResult.grade === "fail" ? (
                  <AlertTriangle size={18} className="void-text-error" />
                ) : (
                  <ScrollText size={18} className={GRADE_COLORS[lastResult.grade]} />
                )}
                <span className={`font-display text-lg font-bold tracking-wider ${GRADE_COLORS[lastResult.grade]}`}>
                  {GRADE_LABELS[lastResult.grade]}
                </span>
                <span className={`font-mono text-[10px] ml-auto tabular-nums ${lastResult.skillXpDelta >= 0 ? "void-text-energy" : "void-text-error"}`}>
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
                      : "void-text"}
                    fill={i < gradePoints(lastResult.grade) ? "currentColor" : "none"}
                  />
                ))}
              </div>

              {/* Follow-up offer: detention on fail, extra credit on distinction */}
              {(() => {
                if (followupResolved === lesson.id) return null;
                const detention: DetentionOffer | undefined =
                  lastResult.grade === "fail" ? getDetention(lesson.professorId) : undefined;
                const extra: ExtraCreditOffer | undefined =
                  lastResult.grade === "distinction" ? getExtraCredit(lesson.professorId) : undefined;
                if (!detention && !extra) return null;
                const offer = detention ?? extra;
                if (!offer) return null;
                const isDetention = Boolean(detention);

                const accept = () => {
                  adjustProfessorApproval(
                    lesson.professorId,
                    offer.reward.approvalDelta,
                  );
                  const houseForLesson = getHouseForProfessor(lesson.professorId);
                  if (houseForLesson) {
                    adjustHousePoints(houseForLesson.id, offer.reward.housePointsDelta);
                  }
                  if (!isDetention && extra && dominantGuild) {
                    const currentLevel = skills[dominantGuild.skillId] ?? 0;
                    setInnerVoiceSkill(
                      dominantGuild.skillId,
                      Math.max(0, currentLevel + extra.reward.skillXpDelta),
                    );
                  }
                  setFollowupResolved(lesson.id);
                };
                const decline = () => setFollowupResolved(lesson.id);

                return (
                  <div
                    className={`rounded border p-3 mb-3 ${
                      isDetention
                        ? "void-border-error void-bg-error"
                        : "void-border-success void-bg-success"
                    }`}
                  >
                    <div className={`font-mono text-[9px] uppercase tracking-widest mb-1 ${
                      isDetention ? "void-text-error" : "void-text-energy"
                    }`}>
                      {isDetention ? "Detention Offered" : "Extra Credit Offered"}
                    </div>
                    <div className="font-display text-xs font-bold mb-1">{offer.title}</div>
                    <p className="font-mono text-[10px] text-foreground/80 leading-relaxed mb-3">
                      {offer.description}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={accept}
                        className="flex-1 px-3 py-1.5 rounded border void-border font-mono text-[10px] uppercase tracking-wider void-text-energy hover:void-bg-sunk"
                      >
                        Accept · +{offer.reward.approvalDelta} approval · +{offer.reward.housePointsDelta} house
                      </button>
                      <button
                        onClick={decline}
                        className="px-3 py-1.5 rounded border border-border/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:bg-muted/20"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })()}

              <div className="text-center">
                <p className="font-mono text-[9px] text-muted-foreground/50 mb-3">
                  The Academy records your choice. Return tomorrow for the next lesson.
                </p>
                <Link
                  href="/"
                  className="inline-block px-4 py-2 rounded border void-border void-bg-sunk void-text-energy font-mono text-[11px] uppercase tracking-wider void-bg-sunk"
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
              className="rounded-lg border void-border void-bg-sunk backdrop-blur-sm overflow-hidden"
            >
              {/* Lesson header — shows the Professor's course */}
              <div className="p-4 border-b void-border">
                <div className="flex items-center justify-between mb-2 gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-[9px] uppercase tracking-wider void-text-energy truncate">
                      {professor?.courseTitle ?? "Today's Lesson"}
                    </div>
                    {professor?.courseCode && (
                      <div className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/50 tabular-nums">
                        {professor.courseCode}
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground/50 tabular-nums shrink-0">
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
                    className="w-full text-left p-3 rounded-lg border border-border/30 bg-black/20 void-border void-bg-sunk transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-xs font-bold text-foreground group-void-text-energy transition-colors">
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

        {/* Common Room vignette — between-class flavor only, keyed by day */}
        {house && (() => {
          const classmate = pickDailyClassmate(dayIndex, house.id);
          const vignette = getVignetteForDay(dayIndex, house.id);
          return (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-4 rounded-lg border void-border void-bg-sunk p-3"
              style={{
                borderColor: `color-mix(in oklch, ${house.color} 30%, transparent)`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Users size={13} className="void-text-energy" />
                <span className="font-mono text-[9px] uppercase tracking-wider void-text-energy">
                  {house.nickname} Common Room
                </span>
                <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/50 ml-auto">
                  {classmate.name} · {classmate.role}
                </span>
              </div>
              <p className="font-mono text-[10px] italic text-foreground/75 leading-relaxed">
                {vignette.moment}
              </p>
              <p className="font-mono text-[9px] text-muted-foreground/60 mt-2">
                — "{classmate.catchphrase}"
              </p>
            </motion.div>
          );
        })()}
      </div>
    </div>
  );
}
