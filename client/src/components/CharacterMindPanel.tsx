/* ═══════════════════════════════════════════════════════
   CHARACTER MIND PANEL

   The "inner life" tab on the character sheet. Three sub-panels:
     • INNER VOICES — 12 skill personalities, preview of active ones
     • THOUGHTS — idea cabinet, in-progress + internalized
     • ARCHETYPE — emergent behavioral classification
   ═══════════════════════════════════════════════════════ */
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Lightbulb, User2, Sparkles, Clock, Check } from "lucide-react";
import { SKILL_VOICES, getActiveVoices, type SkillId } from "@/game/innerVoices";
import { THOUGHTS, getThoughtBonuses, getInternalizationProgress, type ThoughtState } from "@/game/thoughtCabinet";
import { ARCHETYPES, getPrimaryArchetype, type ArchetypeState, type ArchetypeId } from "@/game/playerArchetypes";

interface Props {
  /** Player skill levels (0-100) */
  skills?: Partial<Record<SkillId, number>>;
  /** Thought cabinet state */
  thoughtState?: ThoughtState;
  /** Archetype state */
  archetypeState?: ArchetypeState;
}

type Tab = "voices" | "thoughts" | "archetype";

const DEFAULT_SKILLS: Record<SkillId, number> = {
  tactics: 50, perception: 50, craftsmanship: 50, endurance: 50,
  negotiation: 50, espionage: 50, leadership: 50, lore: 50,
  empathy: 50, paranoia: 50, intuition: 50, authority: 50,
};

export default function CharacterMindPanel({ skills, thoughtState, archetypeState }: Props) {
  const [tab, setTab] = useState<Tab>("voices");

  const skillLevels = useMemo(
    () => ({ ...DEFAULT_SKILLS, ...skills }) as Record<SkillId, number>,
    [skills],
  );

  return (
    <div className="border border-border/30 rounded-lg bg-card/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-border/20">
        <Brain size={16} className="text-purple-400" />
        <span className="font-display text-xs font-bold tracking-[0.2em]">MIND</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/20">
        <TabButton active={tab === "voices"} onClick={() => setTab("voices")} icon={Sparkles} label="Voices" />
        <TabButton active={tab === "thoughts"} onClick={() => setTab("thoughts")} icon={Lightbulb} label="Thoughts" />
        <TabButton active={tab === "archetype"} onClick={() => setTab("archetype")} icon={User2} label="Archetype" />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {tab === "voices" && <VoicesTab key="v" skills={skillLevels} />}
        {tab === "thoughts" && <ThoughtsTab key="t" state={thoughtState} />}
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-3 space-y-3">
      {/* Preview utterances */}
      {previewUtterances.length > 0 && (
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 block mb-1.5">
            What your voices would say right now…
          </span>
          <div className="space-y-1.5">
            {previewUtterances.map(u => {
              const voice = SKILL_VOICES[u.skillId];
              return (
                <div key={u.id} className="p-2 rounded border border-border/30 bg-background/40">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[9px] font-bold tracking-wider" style={{ color: voice.color }}>
                      {voice.name.toUpperCase()}
                    </span>
                    <span className="font-mono text-[8px] text-muted-foreground/50 italic">
                      [{voice.voiceDescriptor}]
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

      {/* All 12 skill voices compact grid */}
      <div>
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70 block mb-1.5">
          12 Voices · sorted by strength
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {sortedSkills.map(([id, level]) => {
            const voice = SKILL_VOICES[id];
            const isActive = voiceIds.has(id);
            return (
              <div
                key={id}
                className={`px-2 py-1.5 rounded border ${isActive ? "border-purple-500/40 bg-purple-500/5" : "border-border/20"}`}
                title={voice.personality}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-[9px] font-bold tracking-wider" style={{ color: voice.color }}>
                    {voice.name}
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground tabular-nums">{level}</span>
                </div>
                <div className="h-0.5 bg-zinc-800/80 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${level}%`, backgroundColor: voice.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── THOUGHTS TAB ─── */
function ThoughtsTab({ state }: { state?: ThoughtState }) {
  const thoughtState: ThoughtState = state ?? { internalizing: [], internalized: [], discovered: [], maxSlots: 3 };
  const activeBonuses = getThoughtBonuses(thoughtState);

  const internalizingItems = thoughtState.internalizing.map(i => {
    const thought = THOUGHTS.find(t => t.id === i.thoughtId);
    if (!thought) return null;
    const progress = getInternalizationProgress(i.startedAt, thought.internalizationHours);
    return { thought, progress };
  }).filter(Boolean);

  const internalizedThoughts = thoughtState.internalized
    .map(id => THOUGHTS.find(t => t.id === id))
    .filter(Boolean) as NonNullable<typeof THOUGHTS[number]>[];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-3 space-y-3">
      {/* In progress */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Clock size={10} className="text-amber-400" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400">
            Internalizing ({internalizingItems.length})
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
            Permanent Bonuses
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
