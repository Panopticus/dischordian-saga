import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronLeft, Shield, Swords, Heart, Zap, User,
  Sparkles, ArrowUp, Droplets, Flame, Wind, Mountain,
  Clock, Globe, Target, Wrench, Eye, Skull, Telescope,
  Star, Trophy, Gem
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   Dot Rating Display
   ═══════════════════════════════════════════════════ */

function DotRating({ value, max = 5, label, color = "cyan" }: {
  value: number; max?: number; label: string; color?: string;
}) {
  const colorMap: Record<string, string> = {
    cyan: "bg-primary shadow-[0_0_6px_rgba(0,255,255,0.4)]",
    amber: "bg-accent shadow-[0_0_6px_rgba(255,191,0,0.4)]",
    red: "bg-destructive shadow-[0_0_6px_rgba(255,0,0,0.4)]",
    purple: "bg-chart-4 shadow-[0_0_6px_rgba(168,85,247,0.4)]",
  };
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] text-muted-foreground w-16 text-right tracking-wider">{label}</span>
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full ${i < value ? colorMap[color] || colorMap.cyan : "bg-muted-foreground/20"}`} />
        ))}
      </div>
      <span className="font-mono text-xs text-muted-foreground/50">{value}</span>
    </div>
  );
}

const ELEMENT_ICONS: Record<string, React.ComponentType<any>> = {
  earth: Mountain, fire: Flame, water: Droplets, air: Wind,
  space: Globe, time: Clock, probability: Target, reality: Sparkles,
};

const CLASS_ICONS: Record<string, React.ComponentType<any>> = {
  engineer: Wrench, oracle: Eye, assassin: Skull, soldier: Swords, spy: Telescope,
};

export default function CharacterSheetPage() {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const character = trpc.citizen.getCharacter.useQuery(undefined, { enabled: isAuthenticated });
  const dreamBalance = trpc.citizen.getDreamBalance.useQuery(undefined, { enabled: isAuthenticated });
  const utils = trpc.useUtils();

  const levelUpClass = trpc.citizen.levelUpClass.useMutation({
    onSuccess: () => { utils.citizen.getCharacter.invalidate(); utils.citizen.getDreamBalance.invalidate(); },
  });
  const levelUpAttr = trpc.citizen.levelUpAttribute.useMutation({
    onSuccess: () => { utils.citizen.getCharacter.invalidate(); utils.citizen.getDreamBalance.invalidate(); },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg">
        <div className="animate-pulse font-mono text-primary text-sm">LOADING CHARACTER DATA...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg p-4">
        <div className="border border-primary/30 rounded-lg bg-card/80 p-8 max-w-md text-center box-glow-cyan">
          <User size={48} className="text-primary mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">AUTHENTICATION REQUIRED</h2>
          <a href={getLoginUrl()} className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary/20 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/30 transition-all">
            AUTHENTICATE
          </a>
        </div>
      </div>
    );
  }

  if (character.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg">
        <div className="animate-pulse font-mono text-primary text-sm">DECRYPTING DOSSIER...</div>
      </div>
    );
  }

  if (!character.data) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg p-4">
        <div className="border border-primary/30 rounded-lg bg-card/80 p-8 max-w-md text-center box-glow-cyan">
          <User size={48} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">NO CITIZEN FOUND</h2>
          <p className="font-mono text-sm text-muted-foreground mb-6">Create your free Citizen to begin.</p>
          <Link href="/create-citizen" className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary/20 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/30 transition-all">
            CREATE CITIZEN
          </Link>
        </div>
      </div>
    );
  }

  const char = character.data;
  const dream = dreamBalance.data;
  const isOrder = char.alignment === "order";
  const glowClass = isOrder
    ? "shadow-[0_0_40px_rgba(0,255,255,0.3)] border-cyan-400/30"
    : "shadow-[0_0_40px_rgba(168,85,247,0.3)] border-purple-400/30";
  const alignColor = isOrder ? "text-cyan-400" : "text-purple-400";
  const alignBg = isOrder ? "bg-cyan-500/10" : "bg-purple-500/10";

  const ElIcon = ELEMENT_ICONS[char.element] || Sparkles;
  const ClIcon = CLASS_ICONS[char.characterClass] || Swords;

  const classLevelCostXp = char.classLevel * 100;
  const classLevelCostDream = char.classLevel * 5;

  const gear = (char.gear || {}) as Record<string, string>;

  return (
    <div className="min-h-screen grid-bg">
      {/* Header */}
      <div className="border-b border-primary/20 bg-card/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <ChevronLeft size={14} /> BACK
          </Link>
          <h1 className="font-display text-sm font-bold tracking-[0.3em] text-primary">CHARACTER SHEET</h1>
          <div className="font-mono text-xs text-muted-foreground">LVL {char.level}</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* ═══ IDENTITY CARD ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border rounded-lg bg-card/60 p-6 ${glowClass}`}
        >
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center border ${
              isOrder ? "bg-cyan-500/10 border-cyan-400/30" : "bg-purple-500/10 border-purple-400/30"
            }`}>
              <User size={40} className={alignColor} />
            </div>

            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold tracking-wider">{char.name}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${alignBg} ${alignColor} border border-current/20`}>
                  {char.alignment.toUpperCase()}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-400/20">
                  {char.species.toUpperCase()}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-400/20">
                  {char.characterClass.toUpperCase()}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 flex items-center gap-1">
                  <ElIcon size={10} /> {char.element.toUpperCase()}
                </span>
              </div>
              <div className="mt-3 font-mono text-xs text-muted-foreground">
                Level {char.level} // Class Level {char.classLevel} // XP: {char.xp}
              </div>
              {/* XP bar */}
              <div className="mt-2 h-1.5 bg-muted-foreground/10 rounded-full overflow-hidden max-w-xs">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min((char.xp % 200) / 200 * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* ═══ ATTRIBUTES ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-border/30 rounded-lg bg-card/40 p-5"
          >
            <h3 className="font-display text-sm font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
              <Star size={14} className="text-primary" /> ATTRIBUTES
            </h3>
            <div className="space-y-4">
              <div>
                <DotRating value={char.attrAttack} label="ATTACK" color="red" />
                {char.attrAttack < 5 && dream && (
                  <button
                    onClick={() => levelUpAttr.mutate({ attribute: "attack" })}
                    disabled={levelUpAttr.isPending}
                    className="ml-[76px] mt-1 font-mono text-[9px] text-accent hover:text-accent/80 flex items-center gap-1"
                  >
                    <ArrowUp size={10} /> UPGRADE ({char.attrAttack * 10} DNA + {char.attrAttack * 3} SB Dream)
                  </button>
                )}
              </div>
              <div>
                <DotRating value={char.attrDefense} label="DEFENSE" color="cyan" />
                {char.attrDefense < 5 && dream && (
                  <button
                    onClick={() => levelUpAttr.mutate({ attribute: "defense" })}
                    disabled={levelUpAttr.isPending}
                    className="ml-[76px] mt-1 font-mono text-[9px] text-accent hover:text-accent/80 flex items-center gap-1"
                  >
                    <ArrowUp size={10} /> UPGRADE ({char.attrDefense * 10} DNA + {char.attrDefense * 3} SB Dream)
                  </button>
                )}
              </div>
              <div>
                <DotRating value={char.attrVitality} label="VITALITY" color="amber" />
                {char.attrVitality < 5 && dream && (
                  <button
                    onClick={() => levelUpAttr.mutate({ attribute: "vitality" })}
                    disabled={levelUpAttr.isPending}
                    className="ml-[76px] mt-1 font-mono text-[9px] text-accent hover:text-accent/80 flex items-center gap-1"
                  >
                    <ArrowUp size={10} /> UPGRADE ({char.attrVitality * 10} DNA + {char.attrVitality * 3} SB Dream)
                  </button>
                )}
              </div>
            </div>

            {levelUpAttr.error && (
              <p className="font-mono text-xs text-destructive mt-3">{levelUpAttr.error.message}</p>
            )}
          </motion.div>

          {/* ═══ COMBAT STATS ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border border-border/30 rounded-lg bg-card/40 p-5"
          >
            <h3 className="font-display text-sm font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
              <Swords size={14} className="text-destructive" /> COMBAT STATS
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card/40 rounded p-3 border border-border/20">
                <Heart size={16} className="text-red-400 mb-1" />
                <p className="font-mono text-[10px] text-muted-foreground">MAX HP</p>
                <p className="font-display text-xl font-bold text-accent">{char.maxHp}</p>
              </div>
              <div className="bg-card/40 rounded p-3 border border-border/20">
                <Shield size={16} className="text-cyan-400 mb-1" />
                <p className="font-mono text-[10px] text-muted-foreground">ARMOR</p>
                <p className="font-display text-xl font-bold text-primary">{char.armor}</p>
              </div>
              <div className="bg-card/40 rounded p-3 border border-border/20">
                <ElIcon size={16} className="text-emerald-400 mb-1" />
                <p className="font-mono text-[10px] text-muted-foreground">ABILITY</p>
                <p className="font-mono text-xs text-emerald-400">{char.elementInfo?.ability}</p>
              </div>
              <div className="bg-card/40 rounded p-3 border border-border/20">
                <ClIcon size={16} className="text-amber-400 mb-1" />
                <p className="font-mono text-[10px] text-muted-foreground">CLASS LVL</p>
                <p className="font-display text-xl font-bold text-amber-400">{char.classLevel}</p>
              </div>
            </div>

            {/* Class level up */}
            <button
              onClick={() => levelUpClass.mutate()}
              disabled={levelUpClass.isPending}
              className="w-full mt-4 py-2 rounded-md bg-accent/10 border border-accent/30 text-accent font-mono text-xs hover:bg-accent/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ArrowUp size={12} /> LEVEL UP CLASS ({classLevelCostXp} XP + {classLevelCostDream} Dream)
            </button>
            {levelUpClass.error && (
              <p className="font-mono text-xs text-destructive mt-2">{levelUpClass.error.message}</p>
            )}
          </motion.div>

          {/* ═══ GEAR ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-border/30 rounded-lg bg-card/40 p-5"
          >
            <h3 className="font-display text-sm font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
              <Wrench size={14} className="text-amber-400" /> EQUIPPED GEAR
            </h3>
            <div className="space-y-2">
              {Object.entries(gear).map(([slot, item]) => (
                <div key={slot} className="flex items-center justify-between bg-card/40 rounded p-2.5 border border-border/20">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{slot}</span>
                  <span className="font-mono text-xs text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ═══ DREAM BALANCE ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="border border-border/30 rounded-lg bg-card/40 p-5"
          >
            <h3 className="font-display text-sm font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
              <Gem size={14} className="text-purple-400" /> DREAM RESOURCES
            </h3>
            {dream ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card/40 rounded p-3 border border-border/20">
                  <p className="font-mono text-[10px] text-muted-foreground">DREAM TOKENS</p>
                  <p className="font-display text-xl font-bold text-purple-400">{dream.dreamTokens}</p>
                  <p className="font-mono text-[9px] text-muted-foreground/50">Tradeable</p>
                </div>
                <div className="bg-card/40 rounded p-3 border border-border/20">
                  <p className="font-mono text-[10px] text-muted-foreground">SOUL BOUND</p>
                  <p className="font-display text-xl font-bold text-amber-400">{dream.soulBoundDream}</p>
                  <p className="font-mono text-[9px] text-muted-foreground/50">From bosses</p>
                </div>
                <div className="bg-card/40 rounded p-3 border border-border/20">
                  <p className="font-mono text-[10px] text-muted-foreground">DNA/CODE</p>
                  <p className="font-display text-xl font-bold text-emerald-400">{dream.dnaCode}</p>
                  <p className="font-mono text-[9px] text-muted-foreground/50">For attributes</p>
                </div>
                <div className="bg-card/40 rounded p-3 border border-border/20">
                  <p className="font-mono text-[10px] text-muted-foreground">TOTAL EARNED</p>
                  <p className="font-display text-xl font-bold text-muted-foreground">{dream.totalDreamEarned}</p>
                  <p className="font-mono text-[9px] text-muted-foreground/50">Lifetime</p>
                </div>
              </div>
            ) : (
              <p className="font-mono text-xs text-muted-foreground">No Dream balance yet. Earn Dream through combat and exploration.</p>
            )}
          </motion.div>
        </div>

        {/* ═══ SPECIES LORE ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-border/30 rounded-lg bg-card/40 p-5"
        >
          <h3 className="font-display text-sm font-bold tracking-[0.2em] mb-3 flex items-center gap-2">
            <Trophy size={14} className="text-accent" /> SPECIES TRAITS
          </h3>
          <p className="font-mono text-xs text-muted-foreground mb-3">{char.speciesInfo?.description}</p>
          <div className="flex flex-wrap gap-2">
            {char.species === "demagi" || char.species === "neyon" ? (
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-400/20">
                +20 HP (Species Bonus)
              </span>
            ) : null}
            {char.species === "quarchon" || char.species === "neyon" ? (
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
                +5 Armor (Species Bonus)
              </span>
            ) : null}
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              {char.elementInfo?.ability} ({char.element.toUpperCase()})
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
