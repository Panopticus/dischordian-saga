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
import { useMemo, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Home, Users, Sparkles, Lock } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { AtmosphereScope } from "@/components/void";
import { ARCHON_VOICE_MAPPING, getDominantGuild } from "@/game/archonTrainingVoices";
import { SKILL_VOICES, type SkillId } from "@/game/innerVoices";
import { getAbilityForArchon } from "@shared/guildSignatureAbilities";
import { getProfessorByArchon } from "@shared/mechronisProfessors";
import { ResponsiveImage } from "@/components/ResponsiveImage";

import { assetUrl } from "@/lib/assetUrl";
/* ─── AMBIENT PARTICLES CANVAS ─── */
function AmbientParticles({ color, count = 30 }: { color: string; count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.4,
      size: 1.5 + Math.random() * 3,
      alpha: 0.08 + Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const p of particles) {
        p.x += p.vx + Math.sin(t * 0.0008 + p.phase) * 0.2;
        p.y += p.vy;
        if (p.y < -10) { p.y = window.innerHeight + 10; p.x = Math.random() * window.innerWidth; }
        if (p.x < -10) p.x = window.innerWidth + 10;
        if (p.x > window.innerWidth + 10) p.x = -10;

        const a = p.alpha * (0.5 + 0.5 * Math.sin(t * 0.002 + p.phase));
        ctx.globalAlpha = a;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Soft glow
        ctx.globalAlpha = a * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [color, count]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

const GUILD_ACCENT_HEX: Record<string, string> = {
  "The Chorus": "#818cf8",
  "The Eyes": "#a1a1aa",
  "The Archive": "#fbbf24",
  "The Between": "#e879f9",
  "The Influencers": "#f472b6",
  "The Yellow Coats": "#facc15",
  "The Congress": "#c084fc",
  "The Locks": "#34d399",
  "The Grey Gamers": "#60a5fa",
  "The Living": "#f87171",
  "The Forge": "#fb923c",
  "The Architect's Study": "#a8a29e",
};

const GUILD_AESTHETICS: Record<string, { bg: string; accent: string; borderColor: string }> = {
  "The Chorus": { bg: "from-indigo-950/30 to-purple-950/20", accent: "void-text-energy", borderColor: "void-border" },
  "The Eyes": { bg: "from-slate-950/40 to-zinc-950/20", accent: "void-text", borderColor: "void-border" },
  "The Archive": { bg: "from-amber-950/25 to-yellow-950/15", accent: "void-text-accent", borderColor: "void-border" },
  "The Between": { bg: "from-fuchsia-950/25 to-violet-950/15", accent: "void-text-system", borderColor: "void-border-system" },
  "The Influencers": { bg: "from-pink-950/25 to-rose-950/15", accent: "void-text-error", borderColor: "void-border-error" },
  "The Yellow Coats": { bg: "from-yellow-950/30 to-orange-950/20", accent: "void-text-premium", borderColor: "void-border" },
  "The Congress": { bg: "from-purple-950/25 to-indigo-950/15", accent: "void-text-system", borderColor: "void-border-system" },
  "The Locks": { bg: "from-emerald-950/25 to-teal-950/15", accent: "void-text-energy", borderColor: "void-border-success" },
  "The Grey Gamers": { bg: "from-blue-950/30 to-slate-950/15", accent: "void-text-energy", borderColor: "void-border" },
  "The Living": { bg: "from-red-950/30 to-black/40", accent: "void-text-error", borderColor: "void-border-error" },
  "The Forge": { bg: "from-orange-950/30 to-red-950/20", accent: "void-text-premium", borderColor: "void-border" },
  "The Architect's Study": { bg: "from-stone-900/40 to-amber-950/15", accent: "void-text", borderColor: "void-border" },
};

const GUILD_ROOM_ART: Record<string, string> = {
  "The Chorus": assetUrl("art/guilds/guild-the-chorus.jpg"),
  "The Eyes": assetUrl("art/guilds/guild-the-eyes.jpg"),
  "The Archive": assetUrl("art/guilds/guild-the-archive.jpg"),
  "The Between": assetUrl("art/guilds/guild-the-between.jpg"),
  "The Influencers": assetUrl("art/guilds/guild-the-influencers.jpg"),
  "The Yellow Coats": assetUrl("art/guilds/guild-the-yellow-coats.jpg"),
  "The Congress": assetUrl("art/guilds/guild-the-congress.jpg"),
  "The Locks": assetUrl("art/guilds/guild-the-locks.jpg"),
  "The Grey Gamers": assetUrl("art/guilds/guild-the-grey-gamers.jpg"),
  "The Living": assetUrl("art/guilds/guild-the-living.jpg"),
  "The Forge": assetUrl("art/guilds/guild-the-forge.jpg"),
  "The Architect's Study": assetUrl("art/guilds/guild-the-architects-study.jpg"),
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
  const roomArt = GUILD_ROOM_ART[guild.name];
  const accentHex = GUILD_ACCENT_HEX[guild.name] ?? "#818cf8";

  const guildRoomKey = `guild_${guild.name.toLowerCase().replace(/[^a-z]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "")}`;
  const voice = SKILL_VOICES[skillId];
  const ability = getAbilityForArchon(mentor.archonNumber);
  const professor = getProfessorByArchon(mentor.archonNumber);
  const playerSkillLevel = skills[skillId] ?? 0;
  const abilityUnlocked = ability ? playerSkillLevel >= ability.skillThreshold : false;

  return (
    <AtmosphereScope roomKey={guildRoomKey}>
    <div className={`min-h-screen bg-gradient-to-br ${aesthetic.bg} text-foreground relative overflow-hidden`}>
      {/* Full-page room art background with slow drift */}
      {roomArt && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={roomArt} alt=""
            className="w-[110%] h-[110%] object-cover guild-room-drift"
            style={{ opacity: 0.18, filter: "brightness(0.5) saturate(0.8)", position: "absolute", top: "-5%", left: "-5%" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, color-mix(in oklch, var(--bg-void) 30%, transparent) 0%, color-mix(in oklch, var(--bg-void) 70%, transparent) 100%)" }} />
        </div>
      )}

      {/* Ambient floating particles */}
      <AmbientParticles color={accentHex} count={25} />

      {/* Ambient light pulse overlay */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none guild-room-pulse"
        style={{ background: `radial-gradient(ellipse at 50% 30%, ${accentHex}08 0%, transparent 70%)` }}
      />

      {/* Scanline overlay */}
      <div className="absolute inset-0 z-[3] pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in oklch, var(--text-primary) 1%, transparent) 2px, color-mix(in oklch, var(--text-primary) 1%, transparent) 4px)",
      }} />

      {/* CSS animations */}
      <style>{`
        @keyframes guild-drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-2%, -1.5%) scale(1.02); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes guild-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .guild-room-drift { animation: guild-drift 30s ease-in-out infinite; }
        .guild-room-pulse { animation: guild-pulse 4s ease-in-out infinite; }
        @keyframes guild-prof-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.005); }
        }
        .guild-prof-breathe { animation: guild-prof-breathe 4s ease-in-out infinite; }
      `}</style>

      <div className="max-w-4xl mx-auto relative z-10 p-4 sm:p-6">
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

        {/* Guild banner with room art hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg border-2 ${aesthetic.borderColor} bg-background/40 mb-4 overflow-hidden`}
        >
          {/* Room art hero */}
          {roomArt && (
            <div className="relative h-40 sm:h-52 overflow-hidden">
              <img src={roomArt} alt={guild.name} className="w-full h-full object-cover" style={{ filter: "brightness(0.7) contrast(1.1)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, color-mix(in oklch, var(--bg-void) 85%, transparent) 0%, transparent 60%)" }} />
              <div className="absolute bottom-0 inset-x-0 p-5">
                <h2 className={`font-display text-3xl font-bold tracking-wider ${aesthetic.accent}`} style={{ textShadow: "0 2px 20px color-mix(in oklch, var(--bg-void) 80%, transparent)" }}>
                  {guild.name}
                </h2>
                <p className="font-mono text-xs italic text-foreground/70 mt-1">"{guild.motto}"</p>
              </div>
            </div>
          )}
          {!roomArt && (
            <div className="p-5">
              <h2 className={`font-display text-3xl font-bold tracking-wider ${aesthetic.accent}`}>
                {guild.name}
              </h2>
              <p className="font-mono text-xs italic text-foreground/70 mt-1">"{guild.motto}"</p>
            </div>
          )}
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
              <p className="font-mono text-[9px] italic void-text-error mt-1">
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
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
                Your Professor (simulacrum)
              </span>
            </div>
            {/* Professor portrait */}
            <div className="relative w-full h-48 sm:h-56 rounded-lg overflow-hidden mb-3 border" style={{ borderColor: `${accentHex}30` }}>
              <ResponsiveImage
                src={professor.portrait}
                alt={professor.teacherName}
                className="w-full h-full object-cover object-top guild-prof-breathe"
                style={{ filter: "brightness(0.9) saturate(1.1)" }}
                eager
              />
              <div className="absolute inset-0" style={{
                background: `linear-gradient(to top, color-mix(in oklch, var(--bg-void) 80%, transparent) 0%, transparent 50%),
                  radial-gradient(ellipse at 50% 80%, ${accentHex}15 0%, transparent 60%)`,
              }} />
              <div className="absolute bottom-0 inset-x-0 p-4">
                <h3 className={`font-display text-lg font-bold ${aesthetic.accent}`} style={{ textShadow: "0 2px 12px color-mix(in oklch, var(--bg-void) 80%, transparent)" }}>
                  {professor.teacherName}
                </h3>
                <p className="font-mono text-[9px] italic text-foreground/70">{professor.title}</p>
              </div>
            </div>
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
              <div className="p-2 rounded border void-border-error void-bg-error">
                <span className="font-mono text-[9px] uppercase tracking-wider void-text-error block mb-0.5">
                  ⚠ Hidden Agenda
                </span>
                <p className="font-mono text-[10px] italic void-text-error leading-relaxed">{professor.hiddenAgenda}</p>
              </div>
              <div className="p-2 rounded border void-border-system void-bg-system">
                <span className="font-mono text-[9px] uppercase tracking-wider void-text-system block mb-0.5">
                  ◈ Divergence from the real Archon
                </span>
                <p className="font-mono text-[10px] italic void-text-system leading-relaxed">{professor.divergenceFromReal}</p>
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
              <span className={`font-mono text-[9px] tabular-nums ${abilityUnlocked ? "void-text-energy" : "void-text-premium"}`}>
                {playerSkillLevel} / {ability.skillThreshold}
                {abilityUnlocked && " ✓"}
              </span>
            </div>
            <div className="mt-1.5 h-1 rounded-full void-bg-canvas overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (playerSkillLevel / ability.skillThreshold) * 100)}%` }}
                className={`h-full ${abilityUnlocked ? "void-bg-success" : "void-bg-sunk"}`}
              />
            </div>
            {ability.darkVariant && abilityUnlocked && (
              <div className="mt-3 pt-2 border-t void-border-error">
                <span className="font-mono text-[9px] uppercase tracking-wider void-text-error block mb-1">
                  ⚠ Dark Arts Variant
                </span>
                <p className="font-mono text-[10px] font-bold void-text-error">{ability.darkVariant.name}</p>
                <p className="font-mono text-[9px] italic void-text-error mt-0.5">
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
                <span key={s} className="font-mono text-[10px] px-2 py-1 void-surface text-foreground/80">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </AtmosphereScope>
  );
}
