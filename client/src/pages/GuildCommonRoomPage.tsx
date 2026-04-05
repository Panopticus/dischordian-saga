/* ═══════════════════════════════════════════════════════
   GUILD COMMON ROOM

   The player's house common room. Dynamically renders based
   on their dominant Guild. Shows:
     • Guild motto + dark truth
     • Their Archon Professor (programmed simulacrum)
     • Signature ability progress
     • Current Guild standing + AI bot competitors (Wave 4b)
     • Guild-specific narrative hooks

   "Hogwarts run by an evil AI." Every house has its own
   aesthetic leaning. Every Archon's personality shapes its
   space.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Home, Users, Sparkles, Lock } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { ARCHON_VOICE_MAPPING, getDominantGuild } from "@/game/archonTrainingVoices";
import { SKILL_VOICES, type SkillId } from "@/game/innerVoices";
import { getAbilityForArchon } from "@shared/guildSignatureAbilities";
import { getProfessorByArchon } from "@shared/mechronisProfessors";

const GUILD_AESTHETICS: Record<string, { bg: string; accent: string; borderColor: string }> = {
  "The Chorus": { bg: "from-indigo-950/30 to-purple-950/20", accent: "text-indigo-300", borderColor: "border-indigo-500/40" },
  "The Eyes": { bg: "from-slate-950/40 to-zinc-950/20", accent: "text-zinc-300", borderColor: "border-zinc-500/40" },
  "The Archive": { bg: "from-amber-950/25 to-yellow-950/15", accent: "text-amber-300", borderColor: "border-amber-500/40" },
  "The Between": { bg: "from-fuchsia-950/25 to-violet-950/15", accent: "text-fuchsia-300", borderColor: "border-fuchsia-500/40" },
  "The Influencers": { bg: "from-pink-950/25 to-rose-950/15", accent: "text-pink-300", borderColor: "border-pink-500/40" },
  "The Yellow Coats": { bg: "from-yellow-950/30 to-orange-950/20", accent: "text-yellow-300", borderColor: "border-yellow-500/50" },
  "The Congress": { bg: "from-purple-950/25 to-indigo-950/15", accent: "text-purple-300", borderColor: "border-purple-500/40" },
  "The Locks": { bg: "from-emerald-950/25 to-teal-950/15", accent: "text-emerald-300", borderColor: "border-emerald-500/40" },
  "The Grey Gamers": { bg: "from-blue-950/30 to-slate-950/15", accent: "text-blue-300", borderColor: "border-blue-500/40" },
  "The Living": { bg: "from-red-950/30 to-black/40", accent: "text-red-300", borderColor: "border-red-500/50" },
  "The Forge": { bg: "from-orange-950/30 to-red-950/20", accent: "text-orange-300", borderColor: "border-orange-500/40" },
  "The Architect's Study": { bg: "from-stone-900/40 to-amber-950/15", accent: "text-stone-300", borderColor: "border-stone-500/40" },
};

export default function GuildCommonRoomPage() {
  const { state } = useGame();
  const skills = (state.innerVoiceSkills ?? {}) as Record<SkillId, number>;

  const dominantGuild = useMemo(() => getDominantGuild(skills), [skills]);

  if (!dominantGuild) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Home size={40} className="mx-auto text-muted-foreground/40 mb-3" />
          <h2 className="font-display text-lg font-bold tracking-wider mb-2">No Guild Yet</h2>
          <p className="font-mono text-[10px] text-muted-foreground/70 leading-relaxed">
            Develop your inner voices. When one skill rises above the others, the Academy will sort you into its Guild's common room.
          </p>
        </div>
      </div>
    );
  }

  const { guild, mentor, skillId } = dominantGuild;
  const aesthetic = GUILD_AESTHETICS[guild.name] ?? GUILD_AESTHETICS["The Chorus"];
  const voice = SKILL_VOICES[skillId];
  const ability = getAbilityForArchon(mentor.archonNumber);
  const professor = getProfessorByArchon(mentor.archonNumber);
  const playerSkillLevel = skills[skillId] ?? 0;
  const abilityUnlocked = ability ? playerSkillLevel >= ability.skillThreshold : false;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${aesthetic.bg} text-foreground p-4 sm:p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <Home size={18} className={aesthetic.accent} />
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">COMMON ROOM</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              Mechronis Academy · {guild.name}
            </p>
          </div>
        </div>

        {/* Guild banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-lg border-2 ${aesthetic.borderColor} bg-background/40 mb-4`}
        >
          <h2 className={`font-display text-3xl font-bold tracking-wider ${aesthetic.accent}`}>
            {guild.name}
          </h2>
          <p className="font-mono text-xs italic text-foreground/70 mt-1">"{guild.motto}"</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60 block mb-1">
                Your Professor
              </span>
              <p className="font-display text-sm font-bold text-foreground">{mentor.archonName}</p>
              <p className="font-mono text-[9px] italic text-muted-foreground/70 mt-0.5">
                {mentor.discipline}
              </p>
              <p className="font-mono text-[9px] italic mt-1" style={{ color: voice.color }}>
                "{mentor.mantra}"
              </p>
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60 block mb-1">
                Graduates Become
              </span>
              <p className="font-mono text-[10px] text-foreground/85">{guild.graduatesBecome}</p>
              <p className="font-mono text-[9px] italic text-red-300/70 mt-1">
                ⚠ {guild.darkTruth}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Professor simulacrum — programmed teaching version of the Archon */}
        {professor && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={`p-4 rounded-lg border ${aesthetic.borderColor} bg-background/40 mb-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
                Your Professor (simulacrum)
              </span>
            </div>
            <h3 className={`font-display text-lg font-bold ${aesthetic.accent}`}>{professor.teacherName}</h3>
            <p className="font-mono text-[9px] italic text-foreground/60 mb-2">{professor.title}</p>
            <p className="font-mono text-[10px] text-foreground/80 mb-2 leading-relaxed">{professor.appearance}</p>
            <div className="space-y-1.5 mb-2">
              <div className="p-2 rounded border border-border/30 bg-background/40">
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60 block mb-0.5">
                  Philosophy
                </span>
                <p className="font-mono text-[10px] italic text-foreground/85 leading-relaxed">"{professor.philosophy}"</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                <div className="p-2 rounded border border-border/30 bg-background/40">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60 block mb-0.5">
                    Classroom Rule
                  </span>
                  <p className="font-mono text-[10px] text-foreground/85">{professor.classroomRule}</p>
                </div>
                <div className="p-2 rounded border border-border/30 bg-background/40">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60 block mb-0.5">
                    Grading
                  </span>
                  <p className="font-mono text-[10px] text-foreground/85">{professor.gradingStyle}</p>
                </div>
              </div>
              <div className="p-2 rounded border border-red-500/30 bg-red-500/5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-red-400 block mb-0.5">
                  ⚠ Hidden Agenda
                </span>
                <p className="font-mono text-[10px] italic text-red-300/85 leading-relaxed">{professor.hiddenAgenda}</p>
              </div>
              <div className="p-2 rounded border border-purple-500/30 bg-purple-500/5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-purple-400 block mb-0.5">
                  ◈ Divergence from the real Archon
                </span>
                <p className="font-mono text-[10px] italic text-purple-300/85 leading-relaxed">{professor.divergenceFromReal}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Signature ability */}
        {ability && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-4 rounded-lg border ${aesthetic.borderColor} bg-background/40 mb-4 ${abilityUnlocked ? "" : "opacity-70"}`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className={aesthetic.accent} />
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
                  Signature Ability
                </span>
              </div>
              {!abilityUnlocked && <Lock size={12} className="text-muted-foreground/50" />}
            </div>
            <h3 className={`font-display text-lg font-bold ${aesthetic.accent}`}>{ability.name}</h3>
            <p className="font-mono text-[10px] italic text-foreground/75 mt-1 mb-2">{ability.flavor}</p>
            <p className="font-mono text-[10px] text-foreground/85">▸ {ability.mechanics}</p>
            <div className="mt-3 pt-2 border-t border-border/20 flex items-center justify-between">
              <span className="font-mono text-[9px] text-muted-foreground/60">
                Cooldown: {ability.cooldownMinutes}min · Requires skill {ability.skillThreshold}
              </span>
              <span className={`font-mono text-[9px] tabular-nums ${abilityUnlocked ? "text-emerald-400" : "text-yellow-400"}`}>
                {playerSkillLevel} / {ability.skillThreshold}
                {abilityUnlocked && " ✓"}
              </span>
            </div>
            <div className="mt-1.5 h-1 rounded-full bg-zinc-800/80 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (playerSkillLevel / ability.skillThreshold) * 100)}%` }}
                className={`h-full ${abilityUnlocked ? "bg-emerald-500" : "bg-yellow-500"}`}
              />
            </div>
            {ability.darkVariant && abilityUnlocked && (
              <div className="mt-3 pt-2 border-t border-red-500/20">
                <span className="font-mono text-[9px] uppercase tracking-wider text-red-400 block mb-1">
                  ⚠ Dark Arts Variant
                </span>
                <p className="font-mono text-[10px] font-bold text-red-300">{ability.darkVariant.name}</p>
                <p className="font-mono text-[9px] italic text-red-300/70 mt-0.5">
                  ▸ {ability.darkVariant.mechanics} · +{ability.darkVariant.corruptionGain} corruption
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Notable students */}
        {guild.notableStudents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-4 rounded-lg border ${aesthetic.borderColor} bg-background/30`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Users size={12} className={aesthetic.accent} />
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
                Notable Alumni
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {guild.notableStudents.map(s => (
                <span key={s} className="font-mono text-[10px] px-2 py-1 rounded border border-border/30 bg-background/50 text-foreground/80">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
