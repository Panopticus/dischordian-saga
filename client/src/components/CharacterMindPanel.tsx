/* ═══════════════════════════════════════════════════════
   MATRIX OF DREAMS PANEL

   Every Potential is a Waking Dreamer. This panel shows
   their parallel mental life in the Matrix of Dreams:
     • ARCHON VOICES — 12 skill voices, one per Archon,
       training the Potential through simulated experience
       (as Mechronis Academy once trained The Seeker)
     • THOUGHTS — idea-seeds gestating in the dream-substrate
     • ARCHETYPE — the shape Project Celebration is watching
       you become
   ═══════════════════════════════════════════════════════ */
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Lightbulb, User2, Sparkles, Clock, Check, Moon, Play } from "lucide-react";
import { SKILL_VOICES, getActiveVoices, type SkillId } from "@/game/innerVoices";
import { THOUGHTS, getThoughtBonuses, getInternalizationProgress, type ThoughtState } from "@/game/thoughtCabinet";
import { ARCHETYPES, getPrimaryArchetype, type ArchetypeState, type ArchetypeId } from "@/game/playerArchetypes";
import { ARCHON_VOICE_MAPPING, MATRIX_OF_DREAMS_LORE, getDominantGuild } from "@/game/archonTrainingVoices";
import { getAbilityForArchon } from "@shared/guildSignatureAbilities";

interface Props {
  /** Player skill levels (0-100) */
  skills?: Partial<Record<SkillId, number>>;
  /** Thought cabinet state */
  thoughtState?: ThoughtState;
  /** Archetype state */
  archetypeState?: ArchetypeState;
  /** Called when player begins internalizing a thought */
  onStartInternalizing?: (thoughtId: string) => void;
  /** Called when a gestating thought's timer completes */
  onCompleteInternalizing?: (thoughtId: string) => void;
}

type Tab = "voices" | "thoughts" | "archetype";

const DEFAULT_SKILLS: Record<SkillId, number> = {
  tactics: 50, perception: 50, craftsmanship: 50, endurance: 50,
  negotiation: 50, espionage: 50, leadership: 50, lore: 50,
  empathy: 50, paranoia: 50, intuition: 50, authority: 50,
};

export default function CharacterMindPanel({ skills, thoughtState, archetypeState, onStartInternalizing, onCompleteInternalizing }: Props) {
  const [tab, setTab] = useState<Tab>("voices");

  const skillLevels = useMemo(
    () => ({ ...DEFAULT_SKILLS, ...skills }) as Record<SkillId, number>,
    [skills],
  );

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-border/20 bg-gradient-to-r from-purple-950/20 via-indigo-950/10 to-transparent">
        <div className="flex items-center gap-2 mb-0.5">
          <Moon size={14} className="text-purple-400" />
          <span className="font-display text-xs font-bold tracking-[0.2em]">
            {MATRIX_OF_DREAMS_LORE.heading.toUpperCase()}
          </span>
        </div>
        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-purple-400/60">
          {MATRIX_OF_DREAMS_LORE.subheading}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/20">
        <TabButton active={tab === "voices"} onClick={() => setTab("voices")} icon={Sparkles} label="Archons" />
        <TabButton active={tab === "thoughts"} onClick={() => setTab("thoughts")} icon={Lightbulb} label="Thoughts" />
        <TabButton active={tab === "archetype"} onClick={() => setTab("archetype")} icon={User2} label="Shape" />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {tab === "voices" && <VoicesTab key="v" skills={skillLevels} />}
        {tab === "thoughts" && <ThoughtsTab key="t" state={thoughtState} onStart={onStartInternalizing} onComplete={onCompleteInternalizing} />}
        {tab === "archetype" && <ArchetypeTab key="a" state={archetypeState} />}
      </AnimatePresence>
    </div>
  );
}

/* ─── TAB BUTTON ─── */
function TabButton({ active, onClick, icon: Icon, label }: {
  active: boolean; onClick: () => void; icon: any; label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 font-mono text-[10px] tracking-wider transition-colors ${
        active ? "text-purple-400 border-b border-purple-400 bg-purple-500/5" : "text-muted-foreground/60 hover:text-foreground"
      }`}
      data-testid={`mind-tab-${label.toLowerCase()}`}
    >
      <Icon size={11} />
      {label.toUpperCase()}
    </button>
  );
}

/* ─── VOICES TAB ─── */
function VoicesTab({ skills }: { skills: Record<SkillId, number> }) {
  // Preview voices for a common dialog-moment trigger
  const previewUtterances = useMemo(
    () => getActiveVoices({ type: "choice_presented" }, skills, 3),
    [skills],
  );
  const voiceIds = new Set(previewUtterances.map(u => u.skillId));

  // Split skills into active (high) vs dormant (low)
  const sortedSkills = useMemo(
    () => Object.entries(skills).sort((a, b) => b[1] - a[1]) as [SkillId, number][],
    [skills],
  );

  const dominantGuild = useMemo(() => getDominantGuild(skills), [skills]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-3 space-y-3">
      {/* Canonical Academy prompt — from CoNexus story */}
      <div className="px-2 py-1.5 rounded border-l-2 border-amber-500/40 bg-amber-950/10">
        <p className="font-mono text-[9px] italic text-amber-300/80 leading-relaxed">
          ✦ {MATRIX_OF_DREAMS_LORE.academyPrompt}
        </p>
      </div>

      {/* Intro lore */}
      <p className="font-mono text-[9px] italic text-purple-300/70 leading-relaxed px-1">
        {MATRIX_OF_DREAMS_LORE.intro}
      </p>

      {/* Academy Standing — player's dominant Guild ("sorted house") */}
      {dominantGuild && (() => {
        const signatureAbility = getAbilityForArchon(dominantGuild.mentor.archonNumber);
        const topSkillLevel = skills[dominantGuild.skillId] ?? 0;
        const unlocked = signatureAbility ? topSkillLevel >= signatureAbility.skillThreshold : false;
        return (
          <div className="p-2.5 rounded border border-amber-600/30 bg-gradient-to-br from-amber-900/10 via-background/40 to-purple-900/10" data-testid="academy-standing">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-amber-400/80">
                ◊ Your Academy Standing ◊
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-sm font-bold text-foreground">
                  {dominantGuild.guild.name}
                </h3>
                <p className="font-mono text-[8px] italic text-amber-300/70">
                  "{dominantGuild.guild.motto}"
                </p>
                <p className="font-mono text-[9px] text-muted-foreground/80 mt-1 leading-snug">
                  Mentored by <span className="text-purple-300">{dominantGuild.mentor.archonName}</span> ·
                  Graduates become <span className="text-foreground/80">{dominantGuild.guild.graduatesBecome.toLowerCase()}</span>
                </p>
                <p className="font-mono text-[9px] italic text-red-300/60 mt-1 leading-relaxed">
                  ⚠ {dominantGuild.guild.darkTruth}
                </p>
                {signatureAbility && (
                  <div className={`mt-2 pt-2 border-t border-amber-500/20 ${unlocked ? "" : "opacity-50"}`}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-mono text-[8px] uppercase tracking-wider text-amber-400">
                        ✦ Signature: {signatureAbility.name}
                      </span>
                      <span className={`font-mono text-[8px] ${unlocked ? "text-emerald-400" : "text-muted-foreground/50"}`}>
                        {unlocked ? "UNLOCKED" : `${topSkillLevel}/${signatureAbility.skillThreshold}`}
                      </span>
                    </div>
                    <p className="font-mono text-[9px] italic text-amber-200/70 leading-snug">{signatureAbility.flavor}</p>
                    <p className="font-mono text-[9px] text-foreground/70 leading-snug mt-0.5">
                      ▸ {signatureAbility.mechanics}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Warning */}
      <div className="p-2 rounded border-l-2 border-red-500/40 bg-red-500/5">
        <p className="font-mono text-[9px] italic text-red-300/80 leading-relaxed">
          ⚠ {MATRIX_OF_DREAMS_LORE.warning}
        </p>
      </div>

      {/* Preview utterances — "what the Archons would say" */}
      {previewUtterances.length > 0 && (
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 block mb-1.5">
            What your Archons would whisper right now…
          </span>
          <div className="space-y-1.5">
            {previewUtterances.map(u => {
              const voice = SKILL_VOICES[u.skillId];
              const mentor = ARCHON_VOICE_MAPPING[u.skillId];
              return (
                <div key={u.id} className="p-2 rounded border border-border/30 bg-background/40">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-[9px] font-bold tracking-wider" style={{ color: voice.color }}>
                      {voice.name.toUpperCase()}
                    </span>
                    <span className="font-mono text-[8px] text-purple-300/60">
                      ◈ {mentor.archonName} (Archon {mentor.archonNumber})
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-foreground/80 italic leading-relaxed">
                    "{u.text}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 12 Archon mentors grid */}
      <div>
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 block mb-1.5">
          12 Archon Mentors · your training voices
        </span>
        <div className="grid grid-cols-1 gap-1.5">
          {sortedSkills.map(([id, level]) => {
            const voice = SKILL_VOICES[id];
            const mentor = ARCHON_VOICE_MAPPING[id];
            const isActive = voiceIds.has(id);
            return (
              <div
                key={id}
                className={`px-2 py-1.5 rounded border ${isActive ? "border-purple-500/40 bg-purple-500/5" : "border-border/20"}`}
                title={`${mentor.archonName} — ${mentor.discipline}`}
                data-testid={`archon-voice-${id}`}
              >
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-[9px] font-bold tracking-wider" style={{ color: voice.color }}>
                      {voice.name}
                    </span>
                    <span className="font-mono text-[8px] text-purple-300/50 truncate">
                      ◈ {mentor.archonName}
                    </span>
                    {mentor.mechronisGuild && (
                      <span className="font-mono text-[7px] text-amber-400/50 truncate hidden sm:inline">
                        [{mentor.mechronisGuild}]
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground tabular-nums shrink-0">{level}</span>
                </div>
                <div className="h-0.5 bg-zinc-800/80 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${level}%`, backgroundColor: voice.color }}
                  />
                </div>
                <p className="font-mono text-[8px] italic text-muted-foreground/50 mt-0.5 leading-snug">
                  "{mentor.mantra}"
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── THOUGHTS TAB ─── */
function ThoughtsTab({ state, onStart, onComplete }: {
  state?: ThoughtState;
  onStart?: (id: string) => void;
  onComplete?: (id: string) => void;
}) {
  const thoughtState: ThoughtState = state ?? { internalizing: [], internalized: [], discovered: [], maxSlots: 3 };
  const activeBonuses = getThoughtBonuses(thoughtState);

  const internalizingItems = thoughtState.internalizing.map(i => {
    const thought = THOUGHTS.find(t => t.id === i.thoughtId);
    if (!thought) return null;
    const progress = getInternalizationProgress(i.startedAt, thought.internalizationHours);
    return { thought, progress };
  }).filter(Boolean);

  // Auto-complete thoughts that have finished gestating
  useEffect(() => {
    if (!onComplete) return;
    for (const item of internalizingItems) {
      if (item && item.progress >= 1) onComplete(item.thought.id);
    }
  }, [internalizingItems, onComplete]);

  const internalizedThoughts = thoughtState.internalized
    .map(id => THOUGHTS.find(t => t.id === id))
    .filter(Boolean) as NonNullable<typeof THOUGHTS[number]>[];

  // Discovered but not yet internalized/completed
  const availableThoughts = thoughtState.discovered
    .map(id => THOUGHTS.find(t => t.id === id))
    .filter((t): t is NonNullable<typeof THOUGHTS[number]> =>
      !!t &&
      !thoughtState.internalized.includes(t.id) &&
      !thoughtState.internalizing.some(i => i.thoughtId === t.id),
    );

  const canStartMore = thoughtState.internalizing.length < thoughtState.maxSlots;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-3 space-y-3">
      <p className="font-mono text-[9px] italic text-purple-300/70 leading-relaxed px-1">
        Idea-seeds gestate in the dream-substrate across real-time hours. What you decide to
        keep thinking about becomes part of who you are — permanently.
      </p>

      {/* Discovered — ready to internalize */}
      {availableThoughts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles size={10} className="text-indigo-400" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-indigo-400">
                Discovered · ready to internalize ({availableThoughts.length})
              </span>
            </div>
            <span className="font-mono text-[8px] text-muted-foreground/60">
              {thoughtState.internalizing.length}/{thoughtState.maxSlots} slots used
            </span>
          </div>
          <div className="space-y-1.5">
            {availableThoughts.slice(0, 5).map(t => (
              <div key={t.id} className="p-2 rounded border border-indigo-500/30 bg-indigo-500/5">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <span className="font-mono text-[10px] font-bold text-foreground">{t.name}</span>
                  <button
                    onClick={() => canStartMore && onStart?.(t.id)}
                    disabled={!canStartMore || !onStart}
                    className={`shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded border font-mono text-[8px] uppercase tracking-wider transition-colors ${
                      canStartMore && onStart
                        ? "border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/20"
                        : "border-border/20 text-muted-foreground/40 cursor-not-allowed"
                    }`}
                    data-testid={`start-thought-${t.id}`}
                  >
                    <Play size={8} /> Begin · {t.internalizationHours}h
                  </button>
                </div>
                <p className="font-mono text-[9px] text-muted-foreground/70 leading-relaxed">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In progress */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Clock size={10} className="text-amber-400" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400">
            Gestating in the Matrix ({internalizingItems.length})
          </span>
        </div>
        {internalizingItems.length === 0 ? (
          <p className="font-mono text-[9px] text-muted-foreground/50 italic px-2">
            No thoughts currently being internalized.
          </p>
        ) : (
          <div className="space-y-1.5">
            {internalizingItems.map(item => item && (
              <div key={item.thought.id} className="p-2 rounded border border-amber-500/30 bg-amber-500/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] font-bold text-foreground">{item.thought.name}</span>
                  <span className="font-mono text-[9px] text-amber-400 tabular-nums">{Math.floor(item.progress * 100)}%</span>
                </div>
                <div className="h-1 bg-zinc-800/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all"
                    style={{ width: `${item.progress * 100}%` }}
                  />
                </div>
                <p className="font-mono text-[9px] text-muted-foreground/70 mt-1 leading-relaxed">
                  {item.thought.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Internalized */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Check size={10} className="text-emerald-400" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400">
            Internalized ({internalizedThoughts.length})
          </span>
        </div>
        {internalizedThoughts.length === 0 ? (
          <p className="font-mono text-[9px] text-muted-foreground/50 italic px-2">
            No thoughts internalized yet.
          </p>
        ) : (
          <div className="space-y-1.5">
            {internalizedThoughts.map(t => (
              <div key={t.id} className="p-2 rounded border border-emerald-500/30 bg-emerald-500/5">
                <span className="font-mono text-[10px] font-bold text-foreground block">{t.name}</span>
                <p className="font-mono text-[9px] text-muted-foreground/70 mt-0.5 leading-relaxed">{t.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active bonuses summary */}
      {activeBonuses.length > 0 && (
        <div className="pt-2 border-t border-border/20">
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 block mb-1">
            Bonuses carried back to the waking world
          </span>
          <ul className="space-y-0.5">
            {activeBonuses.map((b, i) => (
              <li key={i} className="font-mono text-[9px] text-foreground/80">
                ▸ {b.stat} {b.value >= 0 ? "+" : ""}{b.value}{b.percent ? "%" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

/* ─── ARCHETYPE TAB ─── */
function ArchetypeTab({ state }: { state?: ArchetypeState }) {
  const archetypeState: ArchetypeState = state ?? { emerged: [], primary: null, emergenceDates: {} };
  const primary = archetypeState.primary ?? getPrimaryArchetype(archetypeState.emerged);
  const primaryArchetype = primary ? ARCHETYPES.find(a => a.id === primary) : null;
  const emergedSet = new Set<ArchetypeId>(archetypeState.emerged);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-3 space-y-3">
      <p className="font-mono text-[9px] italic text-purple-300/70 leading-relaxed px-1">
        Project Celebration is still running. It watches how you act and decides what shape
        you are becoming. The Archon who graded The Seeker is grading you now.
      </p>

      {/* Primary archetype */}
      {primaryArchetype ? (
        <div className="p-3 rounded border border-purple-500/40 bg-gradient-to-br from-purple-500/10 to-indigo-500/5">
          <div className="flex items-center gap-2 mb-1">
            <User2 size={14} className="text-purple-400" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-purple-400">Primary Archetype</span>
          </div>
          <h3 className="font-display text-base font-bold text-foreground">{primaryArchetype.name}</h3>
          <p className="font-mono text-[9px] italic text-purple-300/80 mb-2">{primaryArchetype.title}</p>
          <p className="font-mono text-[10px] text-foreground/80 leading-relaxed">{primaryArchetype.description}</p>
          {primaryArchetype.bonuses.length > 0 && (
            <div className="mt-2 pt-2 border-t border-purple-500/20">
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 block mb-1">
                Bonuses
              </span>
              <ul className="space-y-0.5">
                {primaryArchetype.bonuses.map((b, i) => (
                  <li key={i} className="font-mono text-[9px] text-foreground/80">
                    ▸ {b.stat} {b.value >= 0 ? "+" : ""}{b.value}{b.percent ? "%" : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 rounded border border-border/30 bg-background/20">
          <p className="font-mono text-[10px] text-muted-foreground/60 italic leading-relaxed">
            No archetype has emerged yet. Your behavior over time will reveal who you are becoming.
          </p>
        </div>
      )}

      {/* All 8 archetypes — emerged/dormant */}
      <div>
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 block mb-1.5">
          All Archetypes ({archetypeState.emerged.length}/{ARCHETYPES.length} emerged)
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {ARCHETYPES.map(a => {
            const emerged = emergedSet.has(a.id);
            return (
              <div
                key={a.id}
                className={`p-2 rounded border ${emerged ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/20 bg-background/20 opacity-60"}`}
                title={a.description}
              >
                <span className="font-mono text-[10px] font-bold block text-foreground">{a.name}</span>
                <span className="font-mono text-[9px] italic text-muted-foreground/60">{a.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
