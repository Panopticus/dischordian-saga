/* ═══════════════════════════════════════════════════════
   GUILD CUTSCENE PREVIEW — dev-only QA surface

   Lets designers + casting reviewers scrub every cs_id from
   GUILD_CUTSCENES without playing through to the trigger.
   Picks any (cs_id, voLineId) pair and renders it via the
   live <GuildCutscenePlayer>, including the producer-original
   variant for F.2.4 emote stickers.

   Route is /dev/guild-cutscenes. URL access only — no nav
   link, no auth gate (matches the existing /dev/variants
   convention).
   ═══════════════════════════════════════════════════════ */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  GUILD_CUTSCENES,
  type GuildCutsceneCategory,
  type GuildCutsceneDef,
  guildCutscenesByCategory,
} from "@shared/expansionArt/guildCutscenesManifest";
import { getCsVoLines } from "@shared/expansionArt/guildCutsceneVoMap";
import { GuildCutscenePlayer } from "@/components/GuildCutscenePlayer";

const CATEGORIES: ReadonlyArray<{ id: GuildCutsceneCategory; label: string }> = [
  { id: "f1_onboarding", label: "F.1 Onboarding" },
  { id: "f2_daily", label: "F.2 Daily / Weekly" },
  { id: "f2_emotes", label: "F.2.4 Emotes" },
  { id: "f3_combat", label: "F.3 Combat & War" },
  { id: "f4_abilities", label: "F.4 Signature Abilities" },
  { id: "f5_guild_hall", label: "F.5 Guild Hall" },
];

interface PickedTrigger {
  csId: string;
  voLineId?: string;
}

export default function DevGuildCutscenesPage() {
  const [activeCategory, setActiveCategory] = useState<GuildCutsceneCategory>(
    "f4_abilities",
  );
  const [picked, setPicked] = useState<PickedTrigger | null>(null);
  const [filter, setFilter] = useState("");

  const entries = useMemo(() => {
    const all = guildCutscenesByCategory(activeCategory);
    if (!filter.trim()) return all;
    const q = filter.trim().toLowerCase();
    return all.filter(
      (e) =>
        e.id.toLowerCase().includes(q) ||
        e.professorId?.toLowerCase().includes(q) ||
        e.archonId?.toLowerCase().includes(q),
    );
  }, [activeCategory, filter]);

  return (
    <div className="min-h-screen bg-black text-foreground p-6">
      <header className="flex items-center gap-4 mb-6">
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
          ← home
        </Link>
        <h1 className="font-display text-lg font-bold tracking-[0.15em]">
          GUILD CUTSCENE PREVIEW
        </h1>
        <span className="font-mono text-[10px] text-muted-foreground">
          {GUILD_CUTSCENES.length} total
        </span>
      </header>

      <div className="flex gap-2 mb-4 flex-wrap">
        {CATEGORIES.map((c) => {
          const active = c.id === activeCategory;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActiveCategory(c.id);
                setPicked(null);
              }}
              className={`px-3 py-1.5 rounded-md font-mono text-xs tracking-wider transition-all ${
                active
                  ? "bg-primary/20 border border-primary/60 text-primary"
                  : "bg-card/30 border border-border/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.label} · {guildCutscenesByCategory(c.id).length}
            </button>
          );
        })}
      </div>

      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="filter by cs_id, professorId, archonId..."
        className="w-full max-w-md px-3 py-2 mb-4 rounded-md bg-card/40 border border-border/30 font-mono text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-1 max-h-[70vh] overflow-y-auto pr-2">
          {entries.map((def) => (
            <CutsceneRow
              key={def.id}
              def={def}
              isPicked={picked?.csId === def.id}
              onPick={(voLineId) => setPicked({ csId: def.id, voLineId })}
            />
          ))}
          {entries.length === 0 && (
            <p className="font-mono text-xs text-muted-foreground italic">
              no matches
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          {picked ? (
            <div className="space-y-3">
              <div className="font-mono text-xs">
                <span className="text-muted-foreground">csId:</span> {picked.csId}
                {picked.voLineId && (
                  <>
                    <span className="text-muted-foreground ml-3">voLineId:</span>{" "}
                    {picked.voLineId}
                  </>
                )}
              </div>
              <GuildCutscenePlayer
                key={`${picked.csId}:${picked.voLineId ?? ""}`}
                csId={picked.csId}
                voLineId={picked.voLineId}
                onComplete={() => setPicked(null)}
              />
            </div>
          ) : (
            <p className="font-mono text-xs text-muted-foreground italic">
              pick a cutscene from the left to preview
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CutsceneRow({
  def,
  isPicked,
  onPick,
}: {
  def: GuildCutsceneDef;
  isPicked: boolean;
  onPick: (voLineId?: string) => void;
}) {
  const voLines = getCsVoLines(def.id);
  const tag =
    def.variant ?? def.professorId ?? def.archonId ?? def.category;

  return (
    <div
      className={`p-2 rounded border text-left ${
        isPicked
          ? "border-primary/60 bg-primary/10"
          : "border-border/20 bg-card/20"
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="font-mono text-xs">{def.id}</span>
        <span className="font-mono text-[9px] text-muted-foreground">{tag}</span>
      </div>
      {voLines.length === 0 ? (
        <button
          type="button"
          onClick={() => onPick(undefined)}
          className="w-full px-2 py-1 rounded bg-card/40 hover:bg-card/60 font-mono text-[0.625rem] text-left text-muted-foreground"
        >
          play cinematic only (no VO)
        </button>
      ) : (
        <div className="space-y-1">
          {voLines.map((line) => (
            <button
              key={line.id}
              type="button"
              onClick={() => onPick(line.id)}
              className="w-full px-2 py-1 rounded bg-card/40 hover:bg-card/60 font-mono text-[0.625rem] text-left"
              title={line.text}
            >
              <span className="text-primary">▸</span> {line.id}
              <span className="text-muted-foreground ml-2 italic">"{line.text.slice(0, 60)}{line.text.length > 60 ? "…" : ""}"</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
