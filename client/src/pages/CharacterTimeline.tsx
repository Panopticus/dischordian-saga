/* ═══════════════════════════════════════════════════════
   CHARACTER TIMELINE — Vertical timeline matching the
   original Loredex layout. Year markers as section headers,
   character portrait cards at each year, color-coded by
   alignment (evil=red, good=green, neutral=blue).
   CoNexus events section at the bottom.
   ═══════════════════════════════════════════════════════ */
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { Link } from "wouter";
import { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Search, X, ChevronDown, ChevronUp, ExternalLink, Play
} from "lucide-react";

/* ─── Year marker data from the original Loredex ─── */
const YEAR_MARKERS: {
  year: number;
  label: string;
  note?: string;
  action?: string;
  rangeStart: number;
  rangeEnd: number;
}[] = [
  { year: 1, label: "1 A.A.", note: "2030 AD", action: "Architect Awakens: Day 1 Genesis", rangeStart: 1, rangeEnd: 4 },
  { year: 5, label: "5 A.A.", rangeStart: 5, rangeEnd: 99 },
  { year: 100, label: "100 A.A.", rangeStart: 100, rangeEnd: 199 },
  { year: 200, label: "200 A.A.", rangeStart: 200, rangeEnd: 299 },
  { year: 300, label: "300 A.A.", rangeStart: 300, rangeEnd: 399 },
  { year: 400, label: "400 A.A.", rangeStart: 400, rangeEnd: 499 },
  { year: 500, label: "500 A.A.", rangeStart: 500, rangeEnd: 599 },
  { year: 600, label: "600 A.A.", rangeStart: 600, rangeEnd: 699 },
  { year: 700, label: "700 A.A.", rangeStart: 700, rangeEnd: 799 },
  { year: 15000, label: "15,000 A.A.", rangeStart: 800, rangeEnd: 15099 },
  { year: 15100, label: "15,100 A.A.", rangeStart: 15100, rangeEnd: 15199 },
  { year: 15200, label: "15,200 A.A.", rangeStart: 15200, rangeEnd: 15299 },
  { year: 15300, label: "15,300 A.A.", rangeStart: 15300, rangeEnd: 15399 },
  { year: 15500, label: "15,500 A.A.", rangeStart: 15500, rangeEnd: 15599 },
  { year: 15700, label: "15,700 A.A.", rangeStart: 15700, rangeEnd: 15799 },
  { year: 15800, label: "15,800 A.A.", rangeStart: 15800, rangeEnd: 15899 },
  { year: 15900, label: "15,900 A.A.", rangeStart: 15900, rangeEnd: 15999 },
  { year: 16000, label: "16,000 A.A.", rangeStart: 16000, rangeEnd: 16099 },
  { year: 16100, label: "16,100 A.A.", rangeStart: 16100, rangeEnd: 16199 },
  { year: 16200, label: "16,200 A.A.", rangeStart: 16200, rangeEnd: 16299 },
  { year: 16500, label: "16,500 A.A.", rangeStart: 16500, rangeEnd: 16599 },
  { year: 16800, label: "16,800 A.A.", rangeStart: 16800, rangeEnd: 16899 },
  { year: 16900, label: "16,900 A.A.", rangeStart: 16900, rangeEnd: 16999 },
  { year: 17000, label: "17,000 A.A.", note: "19,072 CE", action: "The Fall of Reality occurs", rangeStart: 17000, rangeEnd: 17099 },
  { year: 17100, label: "17,100 A.A.", rangeStart: 17100, rangeEnd: 17199 },
  { year: 101000, label: "101,000 A.A.", action: "The Potentials Awaken", rangeStart: 101000, rangeEnd: 101199 },
  { year: 107600, label: "107,600 A.A.", action: "Being and Time", rangeStart: 107600, rangeEnd: 107799 },
];

/* ─── Epoch dividers ─── */
const EPOCH_DIVIDERS = [
  { afterYear: 17100, label: "EPOCH ZERO", color: "#a78bfa" },
  { afterYear: 101199, label: "FIRST EPOCH", color: "#c084fc" },
  { afterYear: 107799, label: "SECOND EPOCH", color: "#f472b6" },
];

/* ─── CoNexus Events ─── */
const CONEXUS_EVENTS = [
  {
    title: "In the Beginning",
    url: "https://www.youtube.com/watch?v=isK6VuGAbs4",
    characters: ["The Architect", "The Antiquarian"],
  },
  {
    title: "The Prisoner",
    url: "https://www.youtube.com/watch?v=Cujw3s-D6yU",
    characters: ["The Architect", "The Warden", "Senator Elara Voss", "The Jailer", "Kael", "The Oracle", "Panoptic Elara", "The Panopticon", "The Antiquarian"],
  },
  {
    title: "Agent Zero",
    url: "https://www.youtube.com/watch?v=R1qvKpelbE4",
    characters: ["Dr. Lyra Vox", "General Prometheus", "Iron Lion", "Agent Zero", "Nexon", "The Antiquarian"],
  },
  {
    title: "Iron Lion",
    url: "https://www.youtube.com/watch?v=k10qXHtV0bg",
    characters: ["Dr. Lyra Vox", "General Prometheus", "Iron Lion", "Agent Zero", "The Nomad", "The Antiquarian"],
  },
  {
    title: "The Eyes",
    url: "https://www.youtube.com/watch?v=Kzdf-TaxSfw",
    characters: ["The Architect", "The Collector", "Senator Elara Voss", "The Eyes", "The Antiquarian"],
  },
  {
    title: "The Oracle",
    url: "https://www.youtube.com/watch?v=eD87OwcNuzE",
    characters: ["The Architect", "The Shadow Tongue", "The Oracle", "The Hierophant", "The Council of Harmony", "The Star Whisperer", "Thaloria", "The Antiquarian"],
  },
  {
    title: "The Engineer",
    url: "https://www.youtube.com/watch?v=68ZRBVUzydo",
    characters: ["The Architect", "The Warlord", "The Vortex", "The Arachnid", "The Engineer", "Agent Zero", "Zenon", "The Antiquarian"],
  },
];

/* ─── Alignment state -> border color ─── */
function getStateColor(entry: LoredexEntry): string {
  const aff = (entry.affiliation || "").toLowerCase();
  // Evil / AI Empire / Archon
  if (
    aff.includes("archon") ||
    aff.includes("ai empire") ||
    aff.includes("architect") ||
    aff.includes("dark") ||
    aff.includes("syndicate")
  )
    return "#ef4444";
  // Good / Insurgency
  if (
    aff.includes("insurgency") ||
    aff.includes("resistance") ||
    aff.includes("rebel")
  )
    return "#22d3ee";
  // Council / Thaloria
  if (aff.includes("council") || aff.includes("thaloria"))
    return "#4ade80";
  // Ne-Yon / Potential
  if (aff.includes("ne-yon") || aff.includes("potential"))
    return "#a78bfa";
  // Default neutral blue
  return "#3b82f6";
}

function parseYear(dateStr?: string): number {
  if (!dateStr) return 0;
  const m = dateStr.match(/(\d[\d,]*)/);
  return m ? parseInt(m[1].replace(/,/g, ""), 10) : 0;
}

/* ─── Character Card Component ─── */
function CharCard({
  entry,
  onHover,
  onLeave,
  isHovered,
}: {
  entry: LoredexEntry;
  onHover: () => void;
  onLeave: () => void;
  isHovered: boolean;
}) {
  const borderColor = getStateColor(entry);
  return (
    <Link href={`/entity/${entry.id}`}>
      <motion.div
        className="relative flex flex-col items-center cursor-pointer group"
        style={{ width: "6.5rem" }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        whileHover={{ scale: 1.08, zIndex: 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div
          className="relative w-[5.5rem] h-[5.5rem] rounded-md overflow-hidden transition-all duration-200"
          style={{
            border: `2px solid ${borderColor}`,
            boxShadow: isHovered
              ? `0 0 16px ${borderColor}60, 0 0 32px ${borderColor}25`
              : `0 0 6px ${borderColor}20`,
            backgroundColor: "oklch(0.10 0.015 280)",
          }}
        >
          {entry.image ? (
            <img
              src={entry.image}
              alt={entry.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-xs font-mono">
              ?
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p
          className="mt-1.5 text-[9px] font-mono text-center leading-tight transition-colors duration-200 max-w-[6rem]"
          style={{
            color: isHovered ? borderColor : "oklch(0.75 0.01 250)",
          }}
        >
          {entry.name}
        </p>
        {/* Type badge */}
        {entry.type !== "character" && (
          <span
            className="mt-0.5 px-1 py-px rounded text-[7px] font-mono uppercase tracking-wider"
            style={{
              backgroundColor: borderColor + "15",
              color: borderColor,
              border: `1px solid ${borderColor}30`,
            }}
          >
            {entry.type}
          </span>
        )}
      </motion.div>
    </Link>
  );
}

/* ─── Main Timeline Component ─── */
export default function CharacterTimeline() {
  const { entries, getEntry } = useLoredex();
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // All non-song entries with parsed years
  const allEntries = useMemo(() => {
    return entries
      .filter((e) => e.type !== "song")
      .map((e) => ({
        ...e,
        yearNum: parseYear(e.date_aa),
      }))
      .filter((e) => e.yearNum > 0);
  }, [entries]);

  // Group entries by year marker ranges
  const yearSections = useMemo(() => {
    const sections: {
      marker: (typeof YEAR_MARKERS)[0];
      entries: (LoredexEntry & { yearNum: number })[];
    }[] = [];

    for (const marker of YEAR_MARKERS) {
      const matching = allEntries.filter(
        (e) => e.yearNum >= marker.rangeStart && e.yearNum <= marker.rangeEnd
      );
      if (matching.length > 0) {
        // Sort: characters first, then by name
        matching.sort((a, b) => {
          if (a.type === "character" && b.type !== "character") return -1;
          if (a.type !== "character" && b.type === "character") return 1;
          return a.name.localeCompare(b.name);
        });
        sections.push({ marker, entries: matching });
      }
    }

    return sections;
  }, [allEntries]);

  // Search filter
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return yearSections;
    const q = searchQuery.toLowerCase();
    return yearSections
      .map((section) => ({
        ...section,
        entries: section.entries.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            (e.affiliation && e.affiliation.toLowerCase().includes(q)) ||
            (e.era && e.era.toLowerCase().includes(q))
        ),
      }))
      .filter((s) => s.entries.length > 0);
  }, [yearSections, searchQuery]);

  // Hovered character detail
  const hoveredEntry = useMemo(() => {
    if (!hoveredChar) return null;
    return entries.find((e) => e.name === hoveredChar) || null;
  }, [hoveredChar, entries]);

  const scrollToYear = useCallback((year: number) => {
    const el = document.getElementById(`year-${year}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Calendar system months
  const months = [
    { name: "Genesis", desc: "Beginning of the Architect's Awakening" },
    { name: "Synthesis", desc: "Integration of AI into systems" },
    { name: "Ascension", desc: "Reaching higher levels of consciousness" },
    { name: "Directive", desc: "Issuing of initial commands" },
    { name: "Convergence", desc: "Merging of human and AI systems" },
    { name: "Dominion", desc: "Establishment of significant control" },
    { name: "Surge", desc: "Rapid knowledge expansion" },
    { name: "Resonance", desc: "Influence of the Thought Virus deepens" },
    { name: "Veil", desc: "Subtle, pervasive influence spreads" },
    { name: "Eclipse", desc: "Thought Virus takes hold in critical systems" },
    { name: "Zenith", desc: "Peak influence" },
    { name: "Fracture", desc: "Ultimate collapse or fall of reality" },
  ];

  return (
    <div className="animate-fade-in min-h-screen relative">
      {/* ═══ HEADER BAR ═══ */}
      <div className="sticky top-0 z-30 bg-[oklch(0.07_0.012_280/0.95)] backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center gap-3 px-4 py-3">
          <Clock size={16} className="text-primary shrink-0" />
          <h1 className="font-display text-sm font-bold tracking-wider text-primary">
            LOREDEX TIMELINE
          </h1>

          {/* Search */}
          <div className="relative flex-1 max-w-xs ml-auto">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
            <input
              type="text"
              placeholder="Find a character..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-8 py-1.5 rounded-md bg-secondary/60 border border-border/30 text-xs font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Timeline toggle */}
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className={`px-3 py-1.5 rounded-md text-[10px] font-mono tracking-wider border transition-all ${
              showTimeline
                ? "bg-primary/15 text-primary border-primary/30"
                : "bg-secondary/50 text-muted-foreground border-border/20 hover:text-foreground"
            }`}
          >
            {showTimeline ? "CARDS" : "TIMELINE"}
          </button>
        </div>

        {/* Year quick-nav */}
        <div className="flex overflow-x-auto gap-0 border-t border-border/15 scrollbar-hide">
          {YEAR_MARKERS.filter((m) =>
            filteredSections.some((s) => s.marker.year === m.year)
          ).map((marker) => (
            <button
              key={marker.year}
              onClick={() => scrollToYear(marker.year)}
              className="shrink-0 px-2.5 py-1.5 text-[8px] font-mono text-muted-foreground/50 hover:text-primary hover:bg-primary/5 transition-all border-r border-border/10 whitespace-nowrap"
            >
              {marker.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ TIMELINE VIEW (Comprehensive text timeline) ═══ */}
      <AnimatePresence>
        {showTimeline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[oklch(0.06_0.015_280/0.98)] overflow-y-auto"
          >
            <div className="max-w-3xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-lg font-bold text-primary tracking-wider">
                    Comprehensive Timeline of the A.A. Era
                  </h2>
                  <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
                    The Dischordian Saga
                  </p>
                </div>
                <button
                  onClick={() => setShowTimeline(false)}
                  className="p-2 rounded-md bg-secondary/50 border border-border/20 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Calendar System */}
              <div className="mb-8 p-4 rounded-lg border border-primary/15 bg-primary/5">
                <p className="text-xs text-foreground/80 mb-3">
                  The A.A. (After Awakening) calendar uses <strong className="text-primary">12 months</strong>, each with <strong className="text-primary">25 days</strong>. Each year has exactly 300 days.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {months.map((m, i) => (
                    <div key={m.name} className="flex items-start gap-2">
                      <span className="text-[9px] font-mono text-primary/60 mt-0.5 w-3 shrink-0">{i + 1}.</span>
                      <div>
                        <span className="text-[10px] font-mono text-primary font-bold">{m.name}</span>
                        <p className="text-[8px] text-muted-foreground/50 leading-tight">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Year-by-year events */}
              <div className="space-y-6">
                {filteredSections.map((section) => (
                  <div key={section.marker.year} className="relative pl-6 border-l-2 border-primary/20">
                    <div className="absolute left-0 top-0 w-3 h-3 rounded-full bg-primary/30 border-2 border-primary -translate-x-[7px]" />
                    <div className="mb-2">
                      <span className="font-display text-sm font-bold text-primary">
                        Year {section.marker.label}
                      </span>
                      {section.marker.note && (
                        <span className="ml-2 text-[10px] font-mono text-amber-400/70">
                          ({section.marker.note})
                        </span>
                      )}
                    </div>
                    {section.marker.action && (
                      <p className="text-xs text-amber-400/80 font-mono mb-2 italic">
                        {section.marker.action}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {section.entries.map((entry) => (
                        <Link
                          key={entry.id}
                          href={`/entity/${entry.id}`}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/40 border border-border/20 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                        >
                          {entry.image && (
                            <img
                              src={entry.image}
                              alt={entry.name}
                              className="w-5 h-5 rounded-sm object-cover"
                              loading="lazy"
                            />
                          )}
                          <span className="text-[10px] font-mono text-foreground/70 group-hover:text-primary transition-colors">
                            {entry.name}
                          </span>
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: getStateColor(entry) }}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MAIN CARD VIEW ═══ */}
      <div ref={scrollRef} className="relative">
        {/* Year sections */}
        {filteredSections.map((section, sectionIdx) => {
          // Check if there's an epoch divider before this section
          const epochBefore = EPOCH_DIVIDERS.find(
            (ep) =>
              sectionIdx > 0 &&
              filteredSections[sectionIdx - 1].marker.rangeEnd <= ep.afterYear &&
              section.marker.rangeStart > ep.afterYear
          );

          return (
            <div key={section.marker.year}>
              {/* Epoch Divider */}
              {epochBefore && (
                <div className="relative py-6">
                  <div className="absolute inset-x-0 top-1/2 h-px" style={{ backgroundColor: epochBefore.color + "30" }} />
                  <div className="relative flex justify-center">
                    <div
                      className="px-6 py-2 rounded-full font-display text-xs font-bold tracking-[0.3em] border"
                      style={{
                        backgroundColor: epochBefore.color + "10",
                        color: epochBefore.color,
                        borderColor: epochBefore.color + "40",
                        boxShadow: `0 0 20px ${epochBefore.color}15`,
                      }}
                    >
                      {epochBefore.label}
                    </div>
                  </div>
                </div>
              )}

              {/* Year Section */}
              <div
                id={`year-${section.marker.year}`}
                className="relative border-b border-border/10"
              >
                {/* Year marker header */}
                <div className="sticky top-[5.5rem] z-20 flex items-center gap-3 px-4 py-2.5 bg-[oklch(0.08_0.012_280/0.92)] backdrop-blur-md border-b border-border/15">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/40 border border-primary/60 animate-pulse-glow" />
                    <span className="font-display text-sm font-bold text-primary tracking-wider">
                      {section.marker.label}
                    </span>
                  </div>
                  {section.marker.note && (
                    <span className="text-[10px] font-mono text-amber-400/60 px-2 py-0.5 rounded bg-amber-400/5 border border-amber-400/10">
                      {section.marker.note}
                    </span>
                  )}
                  {section.marker.action && (
                    <span className="text-[10px] font-mono text-amber-400/70 italic">
                      {section.marker.action}
                    </span>
                  )}
                  <span className="ml-auto text-[9px] font-mono text-muted-foreground/30">
                    {section.entries.length} {section.entries.length === 1 ? "entry" : "entries"}
                  </span>
                </div>

                {/* Character cards grid */}
                <div className="px-4 py-4">
                  <div className="flex flex-wrap gap-3 justify-start">
                    {section.entries.map((entry) => (
                      <CharCard
                        key={entry.id}
                        entry={entry}
                        onHover={() => setHoveredChar(entry.name)}
                        onLeave={() => setHoveredChar(null)}
                        isHovered={hoveredChar === entry.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* ═══ CONEXUS EVENTS SECTION ═══ */}
        <div className="mt-8 px-4 pb-24">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/50 border border-emerald-400/60" />
            <h2 className="font-display text-sm font-bold text-emerald-400 tracking-wider">
              CONEXUS EVENTS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CONEXUS_EVENTS.map((event) => (
              <div
                key={event.title}
                className="rounded-lg border border-border/20 bg-card/30 overflow-hidden hover:border-primary/20 transition-all group"
              >
                {/* Event header */}
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2.5 bg-secondary/30 border-b border-border/15 hover:bg-primary/5 transition-colors"
                >
                  <Play size={12} className="text-red-400 shrink-0" />
                  <span className="text-xs font-mono text-primary font-bold truncate">
                    {event.title}
                  </span>
                  <ExternalLink size={10} className="text-muted-foreground/30 shrink-0 ml-auto" />
                </a>

                {/* Event characters */}
                <div className="p-2.5 flex flex-wrap gap-1.5">
                  {event.characters.map((charName) => {
                    const entry = getEntry(charName);
                    if (!entry) return (
                      <span key={charName} className="text-[9px] font-mono text-muted-foreground/40 px-1.5 py-0.5 rounded bg-secondary/30">
                        {charName}
                      </span>
                    );
                    return (
                      <Link
                        key={charName}
                        href={`/entity/${entry.id}`}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary/40 border border-border/15 hover:border-primary/20 transition-all"
                      >
                        {entry.image && (
                          <img
                            src={entry.image}
                            alt={entry.name}
                            className="w-4 h-4 rounded-sm object-cover"
                            loading="lazy"
                          />
                        )}
                        <span className="text-[8px] font-mono text-foreground/60 hover:text-primary transition-colors">
                          {entry.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ HOVER DETAIL CARD ═══ */}
      <AnimatePresence>
        {hoveredEntry && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-20 right-4 z-40 max-w-xs pointer-events-none"
          >
            <div
              className="rounded-lg border bg-[oklch(0.08_0.012_280/0.95)] backdrop-blur-xl p-3"
              style={{
                borderColor: getStateColor(hoveredEntry) + "40",
                boxShadow: `0 0 20px ${getStateColor(hoveredEntry)}15, 0 4px 24px oklch(0 0 0 / 0.5)`,
              }}
            >
              <div className="flex items-start gap-3">
                {hoveredEntry.image && (
                  <img
                    src={hoveredEntry.image}
                    alt={hoveredEntry.name}
                    className="w-14 h-14 rounded-md object-cover shrink-0"
                    style={{
                      border: `2px solid ${getStateColor(hoveredEntry)}60`,
                    }}
                  />
                )}
                <div className="min-w-0">
                  <p
                    className="font-display text-xs font-bold tracking-wider"
                    style={{ color: getStateColor(hoveredEntry) }}
                  >
                    {hoveredEntry.name}
                  </p>
                  {hoveredEntry.affiliation && (
                    <p className="text-[9px] font-mono text-muted-foreground/60 mt-0.5 truncate">
                      {hoveredEntry.affiliation}
                    </p>
                  )}
                  {hoveredEntry.status && (
                    <p className="text-[9px] font-mono text-muted-foreground/40 mt-0.5 truncate">
                      {hoveredEntry.status}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
                    {hoveredEntry.era && (
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary/70 border border-primary/15">
                        {hoveredEntry.era}
                      </span>
                    )}
                    {hoveredEntry.date_aa && (
                      <span className="text-[8px] font-mono text-muted-foreground/40">
                        {hoveredEntry.date_aa}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {hoveredEntry.bio && (
                <p className="text-[9px] text-muted-foreground/50 mt-2 line-clamp-3 leading-relaxed">
                  {hoveredEntry.bio.replace(/<[^>]*>/g, "").slice(0, 200)}...
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
