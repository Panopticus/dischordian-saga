/* ═══════════════════════════════════════════════════════
   CHARACTER TIMELINE — Visual lifespan chart showing
   which eras each character spans. Horizontal bars on
   a grid of era columns. Click any character to open
   their dossier. Color-coded by faction/affiliation.
   ═══════════════════════════════════════════════════════ */
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { Link } from "wouter";
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Users, Filter, ChevronDown, ChevronUp, ChevronRight,
  Maximize2, Minimize2, Info
} from "lucide-react";

// Ordered eras for the timeline columns
const ERA_ORDER = [
  { key: "Genesis", label: "Genesis", short: "GEN", color: "#00f0ff", period: "0–100 A.A." },
  { key: "Early Empire", label: "Early Empire", short: "EE", color: "#00d4e0", period: "100–300 A.A." },
  { key: "Expansion", label: "Expansion", short: "EXP", color: "#22d3ee", period: "300–400 A.A." },
  { key: "Consolidation", label: "Consolidation", short: "CON", color: "#34d399", period: "400–500 A.A." },
  { key: "Golden Age", label: "Golden Age", short: "GA", color: "#4ade80", period: "500–600 A.A." },
  { key: "Insurgency Rising", label: "Insurgency", short: "INS", color: "#fbbf24", period: "600–700 A.A." },
  { key: "Late Empire", label: "Late Empire", short: "LE", color: "#f97316", period: "15k–16k A.A." },
  { key: "Pre-Fall", label: "Pre-Fall", short: "PF", color: "#fb923c", period: "16k–16.5k A.A." },
  { key: "Fall Era", label: "Fall Era", short: "FALL", color: "#ef4444", period: "16.5k–17k A.A." },
  { key: "The Fall of Reality", label: "Fall of Reality", short: "FOR", color: "#ff2d55", period: "17k+ A.A." },
  { key: "Epoch Zero", label: "Epoch Zero", short: "E0", color: "#a78bfa", period: "101k A.A." },
  { key: "First Epoch", label: "First Epoch", short: "FE", color: "#c084fc", period: "107k A.A." },
];

const ERA_INDEX = Object.fromEntries(ERA_ORDER.map((e, i) => [e.key, i]));

// Character era spans based on lore knowledge — which eras each character is active in
const CHARACTER_ERA_SPANS: Record<string, string[]> = {
  "The Programmer": ["Genesis", "Early Empire", "Golden Age", "Insurgency Rising", "Late Empire", "Fall Era", "The Fall of Reality"],
  "The Architect": ["Genesis", "Early Empire", "Expansion", "Consolidation", "Golden Age", "Insurgency Rising", "Late Empire", "Pre-Fall", "Fall Era", "The Fall of Reality"],
  "The CoNexus": ["Genesis", "Early Empire", "Expansion", "Consolidation", "Golden Age", "Insurgency Rising", "Late Empire", "Pre-Fall", "Fall Era", "The Fall of Reality"],
  "The Collector": ["Early Empire", "Expansion", "Consolidation", "Golden Age", "Insurgency Rising", "Late Empire", "Pre-Fall", "Fall Era"],
  "The Warlord": ["Expansion", "Consolidation", "Golden Age", "Insurgency Rising"],
  "The Watcher": ["Early Empire", "Golden Age", "Insurgency Rising", "Late Empire"],
  "The Meme": ["Early Empire", "Golden Age", "Insurgency Rising", "Late Empire", "Fall Era", "The Fall of Reality"],
  "The Shadow Tongue": ["Early Empire", "Consolidation", "Golden Age"],
  "The Authority": ["Golden Age", "Insurgency Rising", "Late Empire", "Pre-Fall", "Fall Era"],
  "The Engineer": ["Golden Age", "Insurgency Rising", "Late Empire"],
  "The Oracle": ["Fall Era", "The Fall of Reality"],
  "The Enigma": ["Fall Era", "The Fall of Reality"],
  "Iron Lion": ["Insurgency Rising", "Late Empire", "Pre-Fall"],
  "Agent Zero": ["Insurgency Rising", "Late Empire"],
  "The Politician": ["Consolidation", "Golden Age", "Insurgency Rising"],
  "The Warden": ["Consolidation", "Golden Age", "Insurgency Rising", "Late Empire"],
  "The Vortex": ["Golden Age", "Insurgency Rising"],
  "The Game Master": ["Golden Age", "Insurgency Rising", "Late Empire"],
  "The White Oracle": ["The Fall of Reality"],
  "The Antiquarian": ["The Fall of Reality"],
  "The Human": ["Insurgency Rising", "Late Empire"],
  "The Necromancer": ["Insurgency Rising", "Late Empire"],
  "The Nomad": ["Insurgency Rising", "Late Empire", "Pre-Fall"],
  "The Recruiter": ["Insurgency Rising", "Late Empire"],
  "The Eyes": ["Insurgency Rising", "Late Empire"],
  "The Detective": ["Insurgency Rising"],
  "The Star Whisperer": ["Insurgency Rising", "Late Empire"],
  "The Hierophant": ["Fall Era", "The Fall of Reality"],
  "The Jailer": ["Fall Era", "The Fall of Reality"],
  "The Source": ["Fall Era", "The Fall of Reality"],
  "General Alarik": ["Fall Era"],
  "Dr. Lyra Vox": ["Fall Era"],
  "Ambassador Veron": ["Fall Era"],
  "Senator Elara Voss": ["Fall Era"],
  "Panoptic Elara": ["Fall Era", "The Fall of Reality"],
  "Kael": ["Fall Era", "The Fall of Reality"],
  "General Binath-VII": ["Pre-Fall", "Fall Era"],
  "General Prometheus": ["Pre-Fall", "Fall Era"],
  "The Forgotten": ["Pre-Fall", "Fall Era"],
  "The Resurrectionist": ["Pre-Fall", "Fall Era"],
  "The Dreamer": ["Late Empire", "Pre-Fall"],
  "The Inventor": ["Late Empire"],
  "The Judge": ["Late Empire"],
  "The Knowledge": ["Late Empire"],
  "The Seer": ["Late Empire"],
  "The Silence": ["Late Empire"],
  "The Storm": ["Late Empire"],
  "The Advocate": ["Late Empire"],
  "The Degen": ["Late Empire"],
  "The Wolf": ["Epoch Zero"],
  "Destiny": ["Epoch Zero"],
  "Jericho Jones": ["Epoch Zero"],
  "The Host": ["Epoch Zero"],
  "Akai Shi": ["Epoch Zero"],
  "Wraith Calder": ["Epoch Zero", "First Epoch"],
  "Adjudicar Locke": ["First Epoch"],
  "Nythera": ["First Epoch"],
  "Master of R'lyeh": ["Epoch Zero", "First Epoch"],
};

// Affiliation-based color coding
function getCharColor(entry: LoredexEntry): string {
  const aff = (entry.affiliation || "").toLowerCase();
  if (aff.includes("archon") || aff.includes("ai empire")) return "#ef4444"; // Red for AI Empire
  if (aff.includes("insurgency")) return "#22d3ee"; // Cyan for Insurgency
  if (aff.includes("ne-yon")) return "#fbbf24"; // Amber for Ne-Yons
  if (aff.includes("potential")) return "#a78bfa"; // Purple for Potentials
  if (aff.includes("thaloria") || aff.includes("council")) return "#4ade80"; // Green for Thaloria
  if (aff.includes("independent") || aff.includes("chronicler")) return "#94a3b8"; // Gray for independent
  return "#00d9ff"; // Default cyan
}

type SortMode = "era" | "name" | "span";
type FilterMode = "all" | "season1" | "season2" | "season3" | "multi-era";

export default function CharacterTimeline() {
  const { entries, getEntry } = useLoredex();
  const [sortMode, setSortMode] = useState<SortMode>("era");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const characters = useMemo(() => {
    return entries.filter((e) => e.type === "character");
  }, [entries]);

  // Get era spans for each character
  const charSpans = useMemo(() => {
    const spans: Record<string, { start: number; end: number; eras: string[] }> = {};
    characters.forEach((c) => {
      const knownSpan = CHARACTER_ERA_SPANS[c.name];
      if (knownSpan && knownSpan.length > 0) {
        const indices = knownSpan.map((e) => ERA_INDEX[e]).filter((i) => i !== undefined);
        if (indices.length > 0) {
          spans[c.name] = {
            start: Math.min(...indices),
            end: Math.max(...indices),
            eras: knownSpan,
          };
        }
      } else if (c.era && ERA_INDEX[c.era] !== undefined) {
        // Fallback: single era
        const idx = ERA_INDEX[c.era];
        spans[c.name] = { start: idx, end: idx, eras: [c.era] };
      }
    });
    return spans;
  }, [characters]);

  // Filter and sort characters
  const sortedChars = useMemo(() => {
    let filtered = characters.filter((c) => charSpans[c.name]);

    if (filterMode === "season1") filtered = filtered.filter((c) => c.season === "Season 1");
    else if (filterMode === "season2") filtered = filtered.filter((c) => c.season === "Season 2");
    else if (filterMode === "season3") filtered = filtered.filter((c) => c.season === "Season 3");
    else if (filterMode === "multi-era") filtered = filtered.filter((c) => {
      const span = charSpans[c.name];
      return span && span.eras.length > 1;
    });

    if (sortMode === "era") {
      filtered.sort((a, b) => (charSpans[a.name]?.start ?? 99) - (charSpans[b.name]?.start ?? 99));
    } else if (sortMode === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === "span") {
      filtered.sort((a, b) => {
        const spanA = charSpans[a.name];
        const spanB = charSpans[b.name];
        return (spanB?.eras.length ?? 0) - (spanA?.eras.length ?? 0);
      });
    }

    return filtered;
  }, [characters, charSpans, sortMode, filterMode]);

  // Legend items
  const legendItems = [
    { label: "AI Empire / Archons", color: "#ef4444" },
    { label: "Insurgency", color: "#22d3ee" },
    { label: "Ne-Yons", color: "#fbbf24" },
    { label: "Potentials", color: "#a78bfa" },
    { label: "Thaloria", color: "#4ade80" },
    { label: "Independent", color: "#94a3b8" },
  ];

  const ROW_HEIGHT = expanded ? 44 : 36;
  const NAME_COL_WIDTH = expanded ? 200 : 160;

  return (
    <div className="animate-fade-in p-4 sm:p-6 pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-lg sm:text-xl font-bold tracking-wider text-primary flex items-center gap-2">
          <Clock size={18} /> CHARACTER TIMELINE
        </h1>
        <p className="font-mono text-[10px] text-muted-foreground/50 mt-1">
          OPERATIVE LIFESPANS ACROSS {ERA_ORDER.length} ERAS // {sortedChars.length} CHARACTERS MAPPED
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Sort */}
        <div className="flex items-center gap-1 bg-secondary/50 rounded-md border border-border/20 p-0.5">
          {(["era", "name", "span"] as SortMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSortMode(mode)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider transition-all ${
                sortMode === mode
                  ? "bg-primary/15 text-primary border border-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode === "era" ? "BY ERA" : mode === "name" ? "A-Z" : "BY SPAN"}
            </button>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1 bg-secondary/50 rounded-md border border-border/20 p-0.5">
          <Filter size={10} className="text-muted-foreground/40 ml-1.5" />
          {([
            { key: "all", label: "ALL" },
            { key: "multi-era", label: "MULTI-ERA" },
            { key: "season1", label: "S1" },
            { key: "season2", label: "S2" },
            { key: "season3", label: "S3" },
          ] as { key: FilterMode; label: string }[]).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterMode(f.key)}
              className={`px-2 py-1 rounded text-[10px] font-mono tracking-wider transition-all ${
                filterMode === f.key
                  ? "bg-accent/15 text-accent border border-accent/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/50 border border-border/20 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-all"
        >
          {expanded ? <Minimize2 size={10} /> : <Maximize2 size={10} />}
          {expanded ? "COMPACT" : "EXPAND"}
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 px-1">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded-full" style={{ backgroundColor: item.color, opacity: 0.8 }} />
            <span className="font-mono text-[9px] text-muted-foreground/60">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Timeline Grid */}
      <div className="rounded-lg border border-border/30 bg-card/20 overflow-hidden">
        <div ref={scrollRef} className="overflow-x-auto">
          <div style={{ minWidth: NAME_COL_WIDTH + ERA_ORDER.length * 80 }}>
            {/* Era Header Row */}
            <div className="flex border-b border-border/30 bg-card/40 sticky top-0 z-10">
              <div
                className="shrink-0 border-r border-border/20 px-3 py-2 flex items-center"
                style={{ width: NAME_COL_WIDTH }}
              >
                <span className="font-mono text-[9px] text-muted-foreground/40 tracking-[0.2em]">OPERATIVE</span>
              </div>
              {ERA_ORDER.map((era) => (
                <div
                  key={era.key}
                  className="flex-1 min-w-[80px] border-r border-border/10 px-1.5 py-2 text-center"
                >
                  <p
                    className="font-display text-[9px] font-bold tracking-wider truncate"
                    style={{ color: era.color }}
                    title={era.label}
                  >
                    {era.short}
                  </p>
                  <p className="font-mono text-[7px] text-muted-foreground/30 mt-0.5 hidden sm:block">{era.period}</p>
                </div>
              ))}
            </div>

            {/* Character Rows */}
            {sortedChars.map((char, i) => {
              const span = charSpans[char.name];
              if (!span) return null;
              const charColor = getCharColor(char);
              const isHovered = hoveredChar === char.name;

              return (
                <motion.div
                  key={char.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.01, 0.5) }}
                  className={`flex border-b border-border/10 transition-colors ${
                    isHovered ? "bg-primary/5" : i % 2 === 0 ? "bg-transparent" : "bg-card/10"
                  }`}
                  style={{ height: ROW_HEIGHT }}
                  onMouseEnter={() => setHoveredChar(char.name)}
                  onMouseLeave={() => setHoveredChar(null)}
                >
                  {/* Character Name Column */}
                  <Link
                    href={`/entity/${char.id}`}
                    className="shrink-0 border-r border-border/20 px-2 flex items-center gap-2 group hover:bg-secondary/30 transition-colors"
                    style={{ width: NAME_COL_WIDTH }}
                  >
                    {char.image && (
                      <img
                        src={char.image}
                        alt={char.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-border/20 shrink-0"
                        loading="lazy"
                      />
                    )}
                    <span className="font-mono text-[10px] text-foreground/80 group-hover:text-primary transition-colors truncate">
                      {char.name}
                    </span>
                    <ChevronRight size={9} className="text-muted-foreground/20 group-hover:text-primary/50 shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>

                  {/* Era Cells */}
                  {ERA_ORDER.map((era, eraIdx) => {
                    const isActive = span.eras.includes(era.key);
                    const isStart = eraIdx === span.start;
                    const isEnd = eraIdx === span.end;
                    const isBetween = eraIdx >= span.start && eraIdx <= span.end;

                    return (
                      <div
                        key={era.key}
                        className="flex-1 min-w-[80px] border-r border-border/5 flex items-center px-0.5 relative"
                      >
                        {isActive && (
                          <div
                            className="w-full relative transition-all duration-200"
                            style={{ height: expanded ? 16 : 10 }}
                          >
                            <div
                              className="absolute inset-0 rounded-sm transition-all"
                              style={{
                                backgroundColor: charColor,
                                opacity: isHovered ? 0.8 : 0.5,
                                borderRadius: isStart && isEnd ? "4px" : isStart ? "4px 0 0 4px" : isEnd ? "0 4px 4px 0" : "0",
                                boxShadow: isHovered ? `0 0 8px ${charColor}40` : "none",
                              }}
                            />
                          </div>
                        )}
                        {!isActive && isBetween && (
                          <div
                            className="w-full"
                            style={{ height: expanded ? 16 : 10 }}
                          >
                            <div
                              className="absolute inset-x-0.5 top-1/2 -translate-y-1/2"
                              style={{
                                height: 2,
                                backgroundColor: charColor,
                                opacity: isHovered ? 0.4 : 0.15,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Summary Footer */}
        <div className="border-t border-border/20 bg-card/30 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-muted-foreground/50">
              <span className="text-primary">{sortedChars.length}</span> characters mapped
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/50">
              <span className="text-accent">{sortedChars.filter((c) => (charSpans[c.name]?.eras.length ?? 0) > 1).length}</span> multi-era
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground/30">
            <Info size={10} />
            <span className="font-mono text-[8px]">Scroll horizontally to see all eras</span>
          </div>
        </div>
      </div>

      {/* Hover Detail Card */}
      <AnimatePresence>
        {hoveredChar && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-20 right-4 z-40 max-w-xs"
          >
            {(() => {
              const char = entries.find((e) => e.name === hoveredChar);
              const span = charSpans[hoveredChar];
              if (!char || !span) return null;
              return (
                <div className="rounded-lg border border-primary/30 bg-[oklch(0.08_0.012_280/0.95)] backdrop-blur-xl p-3 box-glow-cyan">
                  <div className="flex items-center gap-2.5 mb-2">
                    {char.image && (
                      <img src={char.image} alt={char.name} className="w-10 h-10 rounded-md object-cover ring-1 ring-primary/20" />
                    )}
                    <div>
                      <p className="font-mono text-xs font-bold text-primary">{char.name}</p>
                      <p className="font-mono text-[9px] text-muted-foreground/60">{char.era} // {char.season}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {span.eras.map((era) => {
                      const eraInfo = ERA_ORDER.find((e) => e.key === era);
                      return (
                        <span
                          key={era}
                          className="px-1.5 py-0.5 rounded text-[8px] font-mono"
                          style={{
                            backgroundColor: (eraInfo?.color || "#00d9ff") + "15",
                            color: eraInfo?.color || "#00d9ff",
                            border: `1px solid ${(eraInfo?.color || "#00d9ff")}30`,
                          }}
                        >
                          {eraInfo?.short || era}
                        </span>
                      );
                    })}
                  </div>
                  {char.affiliation && (
                    <p className="font-mono text-[8px] text-muted-foreground/40 mt-2 truncate">{char.affiliation}</p>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
