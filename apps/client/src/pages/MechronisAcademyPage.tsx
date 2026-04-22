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
import SongSlideshow from "@/components/SongSlideshow";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";
import {
  TO_BE_THE_HUMAN_FRAMES,
  TO_BE_THE_HUMAN_TITLE,
  TO_BE_THE_HUMAN_AUDIO,
} from "@/data/mechronisSlideshow";

/** Number of transcript entries that constitute a complete Academy semester. */
const SEMESTER_LENGTH_LESSONS = 30;
import type { SkillId } from "@/game/innerVoices";

import { assetUrl } from "@/lib/assetUrl";
/**
 * Per-professor classroom art — unique background per Archon.
 * Paths match NanoBanna2 prompt bible (CELEBRATION_MECHRONIS_ART_PROMPTS.md).
 * Falls back to generic mechronis_classroom.jpg until generated.
 */
const CLASSROOM_ART: Record<string, string> = {
  prof_conductor: assetUrl("art/classrooms/classroom-kanevas.jpg"),
  prof_watcher: assetUrl("art/classrooms/classroom-aoki.jpg"),
  prof_collector: assetUrl("art/classrooms/classroom-halverez.jpg"),
  prof_vortex: assetUrl("art/classrooms/classroom-orphic.jpg"),
  prof_meme: assetUrl("art/classrooms/classroom-mireille.jpg"),
  prof_warlord: assetUrl("art/classrooms/classroom-kasra.jpg"),
  prof_politician: assetUrl("art/classrooms/classroom-vellis.jpg"),
  prof_warden: assetUrl("art/classrooms/classroom-greenshaw.jpg"),
  prof_game_master: assetUrl("art/classrooms/classroom-vex.jpg"),
  prof_necromancer: assetUrl("art/classrooms/classroom-vasara.jpg"),
  prof_engineer: assetUrl("art/classrooms/classroom-vent.jpg"),
  prof_human: assetUrl("art/classrooms/classroom-proctor.jpg"),
};
const CLASSROOM_FALLBACK = assetUrl("art/mechronis/environments/mechronis_classroom.jpg");

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

  // Sorting Ceremony: only play the ceremony modal on the very first
  // Academy visit. The actual setMechronisHouse call happens when the
  // ceremony is confirmed. If the state is already set (mid-save or
  // repeat visit), skip straight past.
  const [showSorting, setShowSorting] = useState<boolean>(false);
  useEffect(() => {
    if (!state.mechronisHouseId && dominantGuild) {
      setShowSorting(true);
    }
  }, [state.mechronisHouseId, dominantGuild]);

  const confirmSorting = useCallback(() => {
    if (!dominantGuild) return;
    const resolved = getHouseForArchon(dominantGuild.mentor.archonNumber);
    if (resolved) setMechronisHouse(resolved.id);
    setShowSorting(false);
  }, [dominantGuild, setMechronisHouse]);

  const standings = useMemo(
    () => houseStandings(state.housePoints ?? {}),
    [state.housePoints],
  );

  // Low-volume House ambient loop (silently falls back if asset missing).
  useAmbientAudio(house?.ambientAudio, { volume: 0.12 });

  const [lastResult, setLastResult] = useState<{
    grade: LessonGrade;
    transcriptNote: string;
    skillXpDelta: number;
  } | null>(null);

  /** Non-null when a detention/extra-credit follow-up is consumed (so it doesn't re-appear). */
  const [followupResolved, setFollowupResolved] = useState<string | null>(null);

  // Semester-finale gate: the House Cup reveal + slideshow fire once the
  // transcript crosses SEMESTER_LENGTH_LESSONS. Local-session gates so the
  // player can dismiss and replay the closing cinematic later.
  const transcriptLen = (state.academyTranscript ?? []).length;
  const semesterReady = transcriptLen >= SEMESTER_LENGTH_LESSONS;
  const [showHouseCup, setShowHouseCup] = useState(false);
  const [showClosingSlideshow, setShowClosingSlideshow] = useState(false);
  const [semesterAcknowledged, setSemesterAcknowledged] = useState(false);

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

  // Ceremony-candidate house (the one you'd be sorted into RIGHT NOW).
  const ceremonyHouse = dominantGuild
    ? getHouseForArchon(dominantGuild.mentor.archonNumber)
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950/30 text-foreground relative overflow-hidden">
      {/* ── SEMESTER CLOSING SLIDESHOW ── */}
      {showClosingSlideshow && (
        <SongSlideshow
          title={TO_BE_THE_HUMAN_TITLE}
          frames={TO_BE_THE_HUMAN_FRAMES}
          audioSrc={TO_BE_THE_HUMAN_AUDIO}
          onEnd={() => setShowClosingSlideshow(false)}
        />
      )}

      {/* ── HOUSE CUP REVEAL MODAL ── */}
      <AnimatePresence>
        {showHouseCup && (() => {
          const [winner, ...rest] = standings;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              style={{ background: "rgba(6, 8, 18, 0.94)", backdropFilter: "blur(8px)" }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="max-w-xl w-full rounded-xl border-2 p-6 relative overflow-hidden"
                style={{
                  borderColor: winner?.house.color ?? "#888",
                  background: `radial-gradient(ellipse at center top, ${winner?.house.color ?? "#444"}22, #0a0d18 70%)`,
                  boxShadow: `0 0 100px ${winner?.house.color ?? "#444"}66 inset`,
                }}
              >
                <div className="text-center space-y-1 mb-4">
                  <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-foreground/60">
                    The Architect's Commendation
                  </div>
                  <div className="font-display text-2xl font-bold tracking-widest" style={{ color: winner?.house.color ?? "#fff" }}>
                    HOUSE CUP
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    Semester Close · {transcriptLen} lessons recorded
                  </div>
                </div>

                {/* Winner */}
                {winner && (
                  <div
                    className="p-4 rounded-lg border-2 mb-3"
                    style={{
                      borderColor: winner.house.color,
                      background: `linear-gradient(135deg, ${winner.house.color}20, transparent)`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${winner.house.color}, ${winner.house.accent})`,
                          color: "#0a0d18",
                        }}
                      >
                        <Trophy size={26} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono text-[9px] uppercase tracking-widest" style={{ color: winner.house.accent }}>
                          Winner — Common Room lit tonight
                        </div>
                        <div className="font-display text-lg font-bold tracking-wider" style={{ color: winner.house.color }}>
                          {winner.house.name}
                        </div>
                        <div className="font-mono text-[10px] italic text-foreground/70">
                          {winner.points >= 0 ? "+" : ""}{winner.points} points · {winner.house.nickname}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Runners */}
                <div className="space-y-1.5 mb-4">
                  {rest.map(({ house: h, points }, i) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between px-3 py-1.5 rounded border"
                      style={{ borderColor: `color-mix(in oklch, ${h.color} 40%, transparent)` }}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[9px] tabular-nums text-muted-foreground w-5">
                          {i + 2}.
                        </span>
                        <span className="font-display text-xs font-bold tracking-wider truncate" style={{ color: h.accent }}>
                          {h.name}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] tabular-nums" style={{ color: h.color }}>
                        {points >= 0 ? "+" : ""}{points}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="font-mono text-[9px] italic text-muted-foreground/70 text-center mb-4 leading-relaxed">
                  "The Architect reads one commendation aloud. No one has asked what a commendation actually unlocks.
                  The winning common-room stays lit until sunrise. Everyone pretends not to notice."
                </p>

                <button
                  onClick={() => {
                    setShowHouseCup(false);
                    setShowClosingSlideshow(true);
                    setSemesterAcknowledged(true);
                  }}
                  className="w-full px-4 py-2.5 rounded border-2 font-display text-sm font-bold tracking-widest"
                  style={{
                    borderColor: winner?.house.color ?? "#888",
                    color: winner?.house.color ?? "#fff",
                    background: `color-mix(in oklch, ${winner?.house.color ?? "#444"} 10%, transparent)`,
                  }}
                >
                  PROCEED TO GRADUATION
                </button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ── SORTING CEREMONY MODAL ── */}
      <AnimatePresence>
        {showSorting && ceremonyHouse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(6, 8, 18, 0.92)", backdropFilter: "blur(8px)" }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              className="max-w-lg w-full rounded-xl border-2 p-6 relative overflow-hidden"
              style={{
                borderColor: ceremonyHouse.color,
                background: `radial-gradient(ellipse at center top, ${ceremonyHouse.color}22, #0a0d18 70%)`,
                boxShadow: `0 0 80px ${ceremonyHouse.color}55 inset, 0 0 40px ${ceremonyHouse.color}33`,
              }}
            >
              <div className="text-center space-y-2">
                <div className="font-mono text-[9px] uppercase tracking-[0.4em]" style={{ color: ceremonyHouse.accent }}>
                  The Crownless Lectern
                </div>
                <div className="font-display text-2xl font-bold tracking-widest" style={{ color: ceremonyHouse.color }}>
                  THE SORTING
                </div>
                <p className="font-mono text-[10px] italic text-foreground/80 leading-relaxed px-2 pt-2">
                  "The Lectern does not choose, it says. The Lectern merely feels. Approach. Place one hand on the pulpit. Everyone pretends not to watch."
                </p>
              </div>

              {/* Crest */}
              <div className="flex justify-center my-5">
                <motion.div
                  initial={{ rotate: -5, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 140 }}
                  className="w-24 h-24 rounded-xl flex items-center justify-center shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${ceremonyHouse.color}, ${ceremonyHouse.accent})`,
                    color: "#0a0d18",
                  }}
                  aria-label={`${ceremonyHouse.name} crest`}
                >
                  <Trophy size={44} />
                </motion.div>
              </div>

              <div className="text-center space-y-1">
                <div className="font-mono text-[9px] uppercase tracking-widest text-foreground/60">
                  The Lectern has decided. You are sorted into
                </div>
                <div className="font-display text-xl font-bold tracking-wider" style={{ color: ceremonyHouse.accent }}>
                  {ceremonyHouse.name.toUpperCase()}
                </div>
                <div className="font-mono text-[10px] italic text-foreground/70">
                  "{ceremonyHouse.motto}"
                </div>
                <div className="font-mono text-[9px] text-muted-foreground/60 pt-2">
                  Domain: {ceremonyHouse.domain}
                </div>
              </div>

              {/* Common room preview */}
              <div className="mt-4 p-3 rounded border void-border void-bg-sunk">
                <div className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/60 mb-1">
                  Your Common Room
                </div>
                <p className="font-mono text-[10px] italic text-foreground/80 leading-relaxed">
                  {ceremonyHouse.commonRoom}
                </p>
              </div>

              <button
                onClick={confirmSorting}
                className="mt-5 w-full px-4 py-2.5 rounded border-2 font-display text-sm font-bold tracking-widest"
                style={{
                  borderColor: ceremonyHouse.color,
                  color: ceremonyHouse.color,
                  background: `color-mix(in oklch, ${ceremonyHouse.color} 8%, transparent)`,
                }}
              >
                ACCEPT THE HOUSE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                ? assetUrl("art/mechronis/environments/mechronis_graduation.jpg")
                : assetUrl("art/mechronis/environments/mechronis_grand_hall.jpg")
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
        /* Grimoire page: faint sepia fiber flicker */
        @keyframes grimoire-fiber {
          0%, 100% { filter: sepia(0.05) contrast(1.02); }
          50% { filter: sepia(0.12) contrast(1.05); }
        }
        .grimoire-page { animation: grimoire-fiber 6s ease-in-out infinite; }
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

            {/* Semester-ready: reveal button */}
            {semesterReady && !semesterAcknowledged && (
              <button
                onClick={() => setShowHouseCup(true)}
                className="mt-3 w-full px-3 py-2 rounded border-2 font-display text-xs font-bold tracking-widest"
                style={{
                  borderColor: house.color,
                  color: house.color,
                  background: `color-mix(in oklch, ${house.color} 10%, transparent)`,
                }}
              >
                🏆  CLOSE THE SEMESTER · REVEAL HOUSE CUP
              </button>
            )}
            {semesterAcknowledged && (
              <button
                onClick={() => setShowClosingSlideshow(true)}
                className="mt-3 w-full px-3 py-1.5 rounded border font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:void-text-energy"
                style={{ borderColor: `color-mix(in oklch, ${house.color} 30%, transparent)` }}
              >
                Replay "{TO_BE_THE_HUMAN_TITLE}"
              </button>
            )}
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

              {/* Grimoire transcript entry — illuminated ledger page with wax seal */}
              <div
                className="relative p-4 rounded mb-4 grimoire-page"
                style={{
                  background:
                    "linear-gradient(180deg, #f5ecd6 0%, #efe2c2 60%, #e4d0a4 100%)",
                  boxShadow:
                    "inset 0 0 24px rgba(80,48,16,0.25), 0 2px 0 rgba(0,0,0,0.3)",
                  borderLeft: "3px solid #7a4f1e",
                  borderRight: "3px solid #7a4f1e",
                }}
              >
                {/* Wax seal in the corner — colour matches Professor's House */}
                {(() => {
                  const lessonHouse = getHouseForProfessor(lesson.professorId);
                  return (
                    <div
                      className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-md font-display text-[10px] font-bold"
                      style={{
                        background: `radial-gradient(circle at 35% 30%, ${lessonHouse?.accent ?? "#c43a5e"}, ${lessonHouse?.color ?? "#7a1522"} 75%)`,
                        color: "#1a0b06",
                        border: "2px solid rgba(0,0,0,0.3)",
                        transform: "rotate(-8deg)",
                        letterSpacing: "0.06em",
                      }}
                      title={lessonHouse?.name ?? "Mechronis Academy"}
                    >
                      {lessonHouse?.nickname?.[0] ?? "M"}
                    </div>
                  );
                })()}
                <div className="font-display text-[10px] uppercase tracking-[0.35em] text-[#7a4f1e] mb-2">
                  Academy Transcript
                </div>
                <p
                  className="italic leading-relaxed text-[11px] text-[#2a1b0a]"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  "{lastResult.transcriptNote}"
                </p>
                {professor?.courseCode && (
                  <div className="mt-2 pt-2 border-t border-[#7a4f1e33] flex justify-between font-display text-[8px] tracking-[0.3em] uppercase text-[#7a4f1e]">
                    <span>{professor.courseCode}</span>
                    <span>Day {dayIndex % 365}</span>
                  </div>
                )}
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
