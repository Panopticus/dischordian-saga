/* ═══════════════════════════════════════════════════════
   INTERACTIVE TIMELINE — 2D pannable/zoomable canvas
   matching the original Loredex. Space background,
   character portrait cards at year positions, color-coded
   borders by alignment, era markers, zoom controls,
   search, visual lifespans, and CoNexus events.
   ═══════════════════════════════════════════════════════ */
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { useGamification } from "@/contexts/GamificationContext";
import { Link } from "wouter";
import {
  useState, useMemo, useRef, useCallback, useEffect,
  type WheelEvent as ReactWheelEvent, type MouseEvent as ReactMouseEvent
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, ZoomIn, ZoomOut, Clock, ChevronRight,
  Users, MapPin, Swords, Lightbulb, Music,
  Filter, RotateCcw, Play
} from "lucide-react";

/* ─── Constants ─── */
const CARD_W = 100;
const CARD_H = 130;
const CARD_GAP = 12;
const YEAR_COL_W = 160;
const ROW_GAP = 40;
const HEADER_H = 60;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2;

/* ─── Year marker data ─── */
interface YearMarker {
  year: number;
  label: string;
  note?: string;
  action?: string;
}

const YEAR_MARKERS: YearMarker[] = [
  { year: 1, label: "1 A.A.", note: "2030 AD", action: "Architect Awakens: Day 1 Genesis" },
  { year: 200, label: "200 A.A." },
  { year: 300, label: "300 A.A." },
  { year: 400, label: "400 A.A." },
  { year: 500, label: "500 A.A." },
  { year: 600, label: "600 A.A." },
  { year: 15100, label: "15,100 A.A." },
  { year: 15200, label: "15,200 A.A." },
  { year: 15300, label: "15,300 A.A." },
  { year: 15500, label: "15,500 A.A." },
  { year: 15700, label: "15,700 A.A." },
  { year: 15800, label: "15,800 A.A." },
  { year: 15900, label: "15,900 A.A." },
  { year: 16000, label: "16,000 A.A." },
  { year: 16100, label: "16,100 A.A." },
  { year: 16200, label: "16,200 A.A." },
  { year: 16500, label: "16,500 A.A." },
  { year: 16800, label: "16,800 A.A." },
  { year: 16900, label: "16,900 A.A." },
  { year: 17000, label: "17,000 A.A.", note: "19,072 CE", action: "The Fall of Reality occurs" },
  { year: 101000, label: "101,000 A.A.", action: "The Potentials Awaken" },
  { year: 107600, label: "107,600 A.A.", action: "Being and Time" },
];

/* ─── Era dividers ─── */
interface EraDivider { afterYear: number; label: string; color: string }
const ERA_DIVIDERS: EraDivider[] = [
  { afterYear: 600, label: "Ne-Yon Era", color: "#22d3ee" },
  { afterYear: 16200, label: "Fall Era", color: "#ef4444" },
  { afterYear: 17000, label: "Epoch Zero", color: "#22c55e" },
  { afterYear: 101000, label: "First Epoch", color: "#22c55e" },
  { afterYear: 107600, label: "Second Epoch", color: "#22c55e" },
];

/* ─── CoNexus Events ─── */
interface CoNexusEvent { title: string; url?: string; characters: string[] }
const CONEXUS_EVENTS: CoNexusEvent[] = [
  { title: "In the Beginning", url: "https://www.youtube.com/watch?v=isK6VuGAbs4", characters: ["The Architect", "The Antiquarian"] },
  { title: "The Prisoner", url: "https://www.youtube.com/watch?v=Cujw3s-D6yU", characters: ["The Architect", "The Warden", "Senator Elara Voss", "The Jailer", "Kael", "The Oracle", "Panoptic Elara"] },
  { title: "Agent Zero", url: "https://www.youtube.com/watch?v=R1qvKpelbE4", characters: ["Dr. Lyra Vox", "General Prometheus", "Iron Lion", "Agent Zero", "Nexon", "The Antiquarian"] },
  { title: "Iron Lion", url: "https://www.youtube.com/watch?v=k10qXHtV0bg", characters: ["Dr. Lyra Vox", "General Prometheus", "Iron Lion", "Agent Zero", "The Nomad", "The Antiquarian"] },
  { title: "The Eyes", url: "https://www.youtube.com/watch?v=Kzdf-TaxSfw", characters: ["The Architect", "The Collector", "Senator Elara Voss", "The Eyes", "The Antiquarian"] },
  { title: "The Oracle", url: "https://www.youtube.com/watch?v=eD87OwcNuzE", characters: ["The Architect", "The Shadow Tongue", "The Oracle", "The Hierophant", "The Council of Harmony", "The Star Whisperer", "Thaloria", "The Antiquarian"] },
  { title: "The Engineer", url: "https://www.youtube.com/watch?v=68ZRBVUzydo", characters: ["The Architect", "The Warlord", "The Vortex", "The Arachnid", "The Engineer", "Agent Zero", "Zenon", "The Antiquarian"] },
];

/* ─── Alignment classification ─── */
function getAlignment(entry: LoredexEntry): "empire" | "insurgency" | "neyons" | "potentials" | "demonic" | "neutral" {
  const aff = (entry.affiliation || "").toLowerCase();
  if (aff.includes("ai empire") || aff.includes("archon") || aff.includes("architect") || aff.includes("panoptic")) return "empire";
  if (aff.includes("insurgency")) return "insurgency";
  if (aff.includes("ne-yon")) return "neyons";
  if (aff.includes("potential")) return "potentials";
  if (aff.includes("demon") || aff.includes("hierarchy") || aff.includes("damned") || aff.includes("terminus swarm")) return "demonic";
  return "neutral";
}

const ALIGNMENT_COLORS: Record<string, { border: string; glow: string; bg: string; label: string }> = {
  empire: { border: "#ef4444", glow: "rgba(239,68,68,0.3)", bg: "rgba(239,68,68,0.08)", label: "AI Empire" },
  insurgency: { border: "#22c55e", glow: "rgba(34,197,94,0.3)", bg: "rgba(34,197,94,0.08)", label: "Insurgency" },
  neyons: { border: "#22d3ee", glow: "rgba(34,211,238,0.3)", bg: "rgba(34,211,238,0.08)", label: "Ne-Yons" },
  potentials: { border: "#a855f7", glow: "rgba(168,85,247,0.3)", bg: "rgba(168,85,247,0.08)", label: "Potentials" },
  demonic: { border: "#f97316", glow: "rgba(249,115,22,0.3)", bg: "rgba(249,115,22,0.08)", label: "Demonic" },
  neutral: { border: "#3b82f6", glow: "rgba(59,130,246,0.3)", bg: "rgba(59,130,246,0.08)", label: "Neutral" },
};

const TYPE_ICONS: Record<string, typeof Users> = {
  character: Users, location: MapPin, faction: Swords, concept: Lightbulb, song: Music,
};

/* ─── Helpers ─── */
function parseAA(s?: string): number | null {
  if (!s) return null;
  const m = s.replace(/,/g, "").match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function findYearIndex(year: number): number {
  for (let i = YEAR_MARKERS.length - 1; i >= 0; i--) {
    if (year >= YEAR_MARKERS[i].year) return i;
  }
  return 0;
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function CharacterTimeline() {
  const { entries, getEntry, relationships, discoverEntry } = useLoredex();
  const gamification = useGamification();
  const timelineTrackedRef = useRef(false);

  // Mark timeline as explored on first visit
  useEffect(() => {
    if (!timelineTrackedRef.current) {
      timelineTrackedRef.current = true;
      gamification.markTimelineExplored();
    }
  }, []);

  const [zoom, setZoom] = useState(0.5);
  const [pan, setPan] = useState({ x: 20, y: 20 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<LoredexEntry | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
  const viewportRef = useRef<HTMLDivElement>(null);

  /* ─── Build layout ─── */
  const { rows, totalWidth, totalHeight, entryPositions, lifespanLines } = useMemo(() => {
    const nonSongs = entries.filter((e) => e.type !== "song");
    const filtered = typeFilter ? nonSongs.filter((e) => e.type === typeFilter) : nonSongs;

    const yearGroups: Map<number, LoredexEntry[]> = new Map();
    YEAR_MARKERS.forEach((ym) => yearGroups.set(ym.year, []));

    filtered.forEach((e) => {
      const aa = parseAA(e.date_aa);
      if (aa === null) return;
      const idx = findYearIndex(aa);
      const ym = YEAR_MARKERS[idx];
      const group = yearGroups.get(ym.year) || [];
      group.push(e);
      yearGroups.set(ym.year, group);
    });

    const rows: { marker: YearMarker; entries: LoredexEntry[]; y: number; divider?: EraDivider }[] = [];
    const positions = new Map<string, { x: number; y: number }>();
    let currentY = HEADER_H + 20;
    let maxRowWidth = 0;

    YEAR_MARKERS.forEach((marker) => {
      const divider = ERA_DIVIDERS.find((d) => {
        const prevIdx = YEAR_MARKERS.findIndex((m) => m.year === d.afterYear);
        const currIdx = YEAR_MARKERS.findIndex((m) => m.year === marker.year);
        return prevIdx >= 0 && currIdx === prevIdx + 1;
      });
      if (divider) currentY += 50;

      const group = yearGroups.get(marker.year) || [];
      const rowWidth = YEAR_COL_W + group.length * (CARD_W + CARD_GAP);
      maxRowWidth = Math.max(maxRowWidth, rowWidth);

      group.forEach((entry, i) => {
        positions.set(entry.id, { x: YEAR_COL_W + i * (CARD_W + CARD_GAP), y: currentY });
      });

      rows.push({ marker, entries: group, y: currentY, divider });
      currentY += (group.length > 0 ? CARD_H : 30) + ROW_GAP;
    });

    // Lifespan lines
    const lifespanLines: { id: string; name: string; startY: number; endY: number; x: number; color: string }[] = [];
    const charYears = new Map<string, number>();
    nonSongs.forEach((e) => {
      const aa = parseAA(e.date_aa);
      if (aa !== null) charYears.set(e.name.toLowerCase(), aa);
    });

    nonSongs.forEach((e) => {
      if (e.type !== "character") return;
      const pos = positions.get(e.id);
      if (!pos) return;
      const ownYear = parseAA(e.date_aa);
      if (ownYear === null) return;

      const connNames = new Set<string>();
      relationships.forEach((r) => {
        if (r.source.toLowerCase() === e.name.toLowerCase()) connNames.add(r.target.toLowerCase());
        if (r.target.toLowerCase() === e.name.toLowerCase()) connNames.add(r.source.toLowerCase());
      });

      let minYear = ownYear, maxYear = ownYear;
      connNames.forEach((cn) => {
        const cy = charYears.get(cn);
        if (cy !== undefined) { minYear = Math.min(minYear, cy); maxYear = Math.max(maxYear, cy); }
      });

      const startIdx = findYearIndex(minYear);
      const endIdx = findYearIndex(maxYear);
      if (endIdx > startIdx + 1) {
        const startRow = rows[startIdx];
        const endRow = rows[endIdx];
        if (startRow && endRow) {
          lifespanLines.push({
            id: e.id, name: e.name,
            startY: startRow.y + CARD_H / 2, endY: endRow.y + CARD_H / 2,
            x: pos.x + CARD_W / 2,
            color: ALIGNMENT_COLORS[getAlignment(e)].border,
          });
        }
      }
    });

    currentY += 60;
    return { rows, totalWidth: Math.max(maxRowWidth + 100, 1200), totalHeight: currentY + 400, entryPositions: positions, lifespanLines };
  }, [entries, relationships, typeFilter]);

  /* ─── Search ─── */
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return entries.filter((e) => e.type !== "song" && (
      e.name.toLowerCase().includes(q) || (e.era && e.era.toLowerCase().includes(q)) || (e.affiliation && e.affiliation.toLowerCase().includes(q))
    ));
  }, [searchQuery, entries]);

  useEffect(() => {
    setHighlightedIds(searchQuery.trim() ? new Set(searchResults.map((e) => e.id)) : new Set());
  }, [searchResults, searchQuery]);

  /* ─── Zoom ─── */
  const handleWheel = useCallback((e: ReactWheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + (e.deltaY > 0 ? -0.05 : 0.05))));
  }, []);

  /* ─── Pan ─── */
  const handleMouseDown = useCallback((e: ReactMouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-card]") || (e.target as HTMLElement).closest("a")) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }, [pan]);

  const handleMouseMove = useCallback((e: ReactMouseEvent) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStartRef.current.x, y: e.clientY - panStartRef.current.y });
  }, [isPanning]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  /* ─── Navigate to entry ─── */
  const scrollToEntry = useCallback((entry: LoredexEntry) => {
    const pos = entryPositions.get(entry.id);
    if (!pos || !viewportRef.current) return;
    const vw = viewportRef.current.clientWidth;
    const vh = viewportRef.current.clientHeight;
    setPan({ x: vw / 2 - pos.x * zoom - (CARD_W * zoom) / 2, y: vh / 2 - pos.y * zoom - (CARD_H * zoom) / 2 });
    setHighlightedIds(new Set([entry.id]));
    setTimeout(() => setHighlightedIds(new Set()), 3000);
  }, [entryPositions, zoom]);

  const resetView = useCallback(() => {
    setZoom(0.5); setPan({ x: 20, y: 20 }); setSearchQuery(""); setHighlightedIds(new Set()); setTypeFilter(null);
  }, []);

  const zoomPct = Math.round(zoom * 100);

  /* ─── Entry Card ─── */
  const EntryCard = ({ entry, x, y }: { entry: LoredexEntry; x: number; y: number }) => {
    const alignment = getAlignment(entry);
    const colors = ALIGNMENT_COLORS[alignment];
    const isHighlighted = highlightedIds.size === 0 || highlightedIds.has(entry.id);
    const isDimmed = highlightedIds.size > 0 && !highlightedIds.has(entry.id);
    const Icon = TYPE_ICONS[entry.type] || Users;

    return (
      <div
        data-card
        className="absolute cursor-pointer transition-all duration-200"
        style={{
          left: x, top: y, width: CARD_W, height: CARD_H,
          opacity: isDimmed ? 0.15 : 1,
          transform: isHighlighted && highlightedIds.size > 0 ? "scale(1.15)" : "scale(1)",
          zIndex: isHighlighted && highlightedIds.size > 0 ? 10 : 1,
        }}
        onClick={() => { setSelectedEntry(entry); discoverEntry(entry.id); }}
      >
        <div
          className="w-full h-full rounded-md overflow-hidden relative group"
          style={{ border: `2px solid ${colors.border}`, boxShadow: `0 0 8px ${colors.glow}`, background: colors.bg }}
        >
          <div className="w-full" style={{ height: CARD_H - 32 }}>
            {entry.image ? (
              <img src={entry.image} alt={entry.name} className="w-full h-full object-cover" loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; const sib = (e.target as HTMLImageElement).nextElementSibling; if (sib) sib.classList.remove("hidden"); }}
              />
            ) : null}
            <div className={`${entry.image ? "hidden" : ""} w-full h-full flex items-center justify-center bg-black/40`}>
              <Icon size={24} style={{ color: colors.border }} />
            </div>
            {entry.type !== "character" && (
              <div className="absolute top-1 right-1 px-1 py-0.5 rounded text-[7px] font-bold uppercase tracking-wider" style={{ background: colors.border, color: "#000" }}>
                {entry.type.slice(0, 3)}
              </div>
            )}
          </div>
          <div className="px-1.5 py-1 text-center">
            <p className="text-[9px] font-bold leading-tight truncate" style={{ color: colors.border }} title={entry.name}>
              {entry.name}
            </p>
          </div>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-md"
            style={{ boxShadow: `inset 0 0 20px ${colors.glow}, 0 0 20px ${colors.glow}` }} />
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col relative overflow-hidden">
      {/* ─── Top Controls ─── */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-2 border-b border-border/30 bg-background/90 backdrop-blur-sm z-20 flex-wrap">
        <button onClick={() => setShowTimeline(!showTimeline)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border transition-all ${showTimeline ? "bg-primary/20 border-primary/50 text-primary" : "bg-secondary border-border/30 text-muted-foreground hover:text-foreground"}`}>
          <Clock size={13} /> Timeline
        </button>

        <div className="relative flex-1 max-w-xs min-w-[140px]">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Find a character..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 rounded bg-secondary border border-border/30 text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50" />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setHighlightedIds(new Set()); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X size={12} /></button>
          )}
        </div>

        {searchQuery && searchResults.length > 0 && (
          <div className="absolute top-full left-20 mt-1 w-72 max-h-60 overflow-y-auto bg-card border border-border/50 rounded-lg shadow-xl z-50">
            {searchResults.slice(0, 15).map((r) => (
              <button key={r.id} onClick={() => { scrollToEntry(r); setSearchQuery(""); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/50 transition-colors">
                {r.image && <img src={r.image} alt="" className="w-7 h-7 rounded object-cover" />}
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{r.name}</p>
                  <p className="text-[10px] text-muted-foreground">{r.era} · {r.type}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-mono border transition-all ${typeFilter ? "bg-accent/20 border-accent/50 text-accent" : "bg-secondary border-border/30 text-muted-foreground hover:text-foreground"}`}>
            <Filter size={12} /> {typeFilter ? typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1) + "s" : "All"}
          </button>
          {showFilters && (
            <div className="absolute top-full right-0 mt-1 bg-card border border-border/50 rounded-lg shadow-xl z-50 p-2 min-w-[120px]">
              {[null, "character", "location", "faction", "concept"].map((t) => (
                <button key={t || "all"} onClick={() => { setTypeFilter(t); setShowFilters(false); }}
                  className={`block w-full text-left px-3 py-1.5 rounded text-xs font-mono transition-colors ${typeFilter === t ? "bg-primary/20 text-primary" : "hover:bg-secondary text-muted-foreground"}`}>
                  {t ? t.charAt(0).toUpperCase() + t.slice(1) + "s" : "All Types"}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />

        <button onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.1))}
          className="p-1.5 rounded bg-secondary border border-border/30 text-muted-foreground hover:text-foreground transition-colors"><ZoomOut size={14} /></button>
        <input type="range" min={MIN_ZOOM * 100} max={MAX_ZOOM * 100} value={zoom * 100}
          onChange={(e) => setZoom(Number(e.target.value) / 100)} className="w-20 h-1 accent-primary" />
        <button onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.1))}
          className="p-1.5 rounded bg-secondary border border-border/30 text-muted-foreground hover:text-foreground transition-colors"><ZoomIn size={14} /></button>
        <span className="font-mono text-xs text-muted-foreground w-10 text-center">{zoomPct}%</span>
        <button onClick={resetView} className="p-1.5 rounded bg-secondary border border-border/30 text-muted-foreground hover:text-foreground transition-colors" title="Reset view"><RotateCcw size={14} /></button>
      </div>

      {/* ─── Legend ─── */}
      <div className="shrink-0 flex items-center gap-3 px-3 py-1.5 border-b border-border/20 bg-background/60 z-10 flex-wrap">
        {Object.entries(ALIGNMENT_COLORS).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: val.border }} />
            <span className="text-[9px] font-mono text-muted-foreground">{val.label}</span>
          </div>
        ))}
        <div className="flex-1" />
        <span className="text-[9px] font-mono text-muted-foreground/50">
          {entries.filter((e) => e.type !== "song").length} entities · {YEAR_MARKERS.length} year markers
          {lifespanLines.length > 0 && ` · ${lifespanLines.length} lifespans`}
        </span>
      </div>

      {/* ─── Canvas Viewport ─── */}
      <div ref={viewportRef} className="flex-1 overflow-hidden relative"
        style={{ cursor: isPanning ? "grabbing" : "grab" }}
        onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        {/* Space background */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 30% 20%, rgba(30,40,80,0.4) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(60,20,60,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(10,10,30,1) 0%, rgba(5,5,15,1) 100%)",
        }} />
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `radial-gradient(1px 1px at 10% 20%, white, transparent), radial-gradient(1px 1px at 30% 50%, white, transparent), radial-gradient(1px 1px at 50% 10%, white, transparent), radial-gradient(1px 1px at 70% 40%, white, transparent), radial-gradient(1px 1px at 90% 70%, white, transparent), radial-gradient(1.5px 1.5px at 15% 80%, rgba(100,200,255,0.8), transparent), radial-gradient(1.5px 1.5px at 85% 15%, rgba(255,200,100,0.8), transparent), radial-gradient(1px 1px at 25% 35%, white, transparent), radial-gradient(1px 1px at 45% 65%, white, transparent), radial-gradient(1px 1px at 65% 25%, white, transparent), radial-gradient(1px 1px at 80% 55%, white, transparent), radial-gradient(1px 1px at 5% 45%, white, transparent), radial-gradient(1px 1px at 55% 85%, white, transparent)`,
        }} />

        {/* Canvas */}
        <div className="absolute" style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0",
          width: totalWidth, height: totalHeight,
        }}>
          {/* Lifespan lines */}
          <svg className="absolute inset-0 pointer-events-none" width={totalWidth} height={totalHeight} style={{ zIndex: 0 }}>
            {lifespanLines.map((line) => (
              <g key={`span-${line.id}`}>
                <line x1={line.x} y1={line.startY} x2={line.x} y2={line.endY}
                  stroke={line.color} strokeWidth={2} strokeOpacity={0.18} strokeDasharray="6 4" />
                <line x1={line.x} y1={line.startY} x2={line.x} y2={line.endY}
                  stroke={line.color} strokeWidth={8} strokeOpacity={0.04} />
              </g>
            ))}
          </svg>

          {/* Year rows */}
          {rows.map((row) => (
            <div key={row.marker.year}>
              {row.divider && (
                <div className="absolute flex items-center gap-3" style={{ left: 0, top: row.y - 35, width: totalWidth }}>
                  <div className="px-3 py-1 rounded-sm text-[10px] font-display font-bold tracking-[0.2em] uppercase"
                    style={{ color: row.divider.color, background: `${row.divider.color}15`, border: `1px solid ${row.divider.color}40` }}>
                    ▼ {row.divider.label}
                  </div>
                  <div className="flex-1 h-px" style={{ background: `${row.divider.color}30` }} />
                </div>
              )}
              <div className="absolute flex flex-col items-start" style={{ left: 8, top: row.y, width: YEAR_COL_W - 20 }}>
                <span className="font-display text-sm font-bold text-foreground tracking-wide">{row.marker.label}</span>
                {row.marker.note && <span className="font-mono text-[9px] text-muted-foreground">{row.marker.note}</span>}
                {row.marker.action && <span className="font-mono text-[9px] text-accent mt-0.5 leading-tight">{row.marker.action}</span>}
                <div className="mt-1 h-px" style={{
                  width: totalWidth - YEAR_COL_W, background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)",
                  position: "absolute", left: YEAR_COL_W - 8, top: 10,
                }} />
              </div>
              {row.entries.map((entry, i) => (
                <EntryCard key={entry.id} entry={entry} x={YEAR_COL_W + i * (CARD_W + CARD_GAP)} y={row.y} />
              ))}
            </div>
          ))}

          {/* CoNexus Events */}
          <div className="absolute" style={{
            left: 0, top: rows.length > 0 ? rows[rows.length - 1].y + CARD_H + ROW_GAP + 40 : totalHeight - 380, width: totalWidth,
          }}>
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="px-3 py-1.5 rounded bg-primary/10 border border-primary/30">
                <span className="font-display text-xs font-bold tracking-[0.2em] text-primary">CoNexus Events</span>
              </div>
              <div className="flex-1 h-px bg-primary/20" />
            </div>
            <div className="flex gap-4 px-2 flex-wrap">
              {CONEXUS_EVENTS.map((event) => (
                <div key={event.title} className="rounded-lg border border-border/30 bg-black/40 backdrop-blur-sm p-3 w-48">
                  <p className="font-mono text-xs font-bold text-primary mb-2 flex items-center gap-1.5">
                    {event.url ? (
                      <a href={event.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1"><Play size={10} />{event.title}</a>
                    ) : event.title}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {event.characters.map((charName) => {
                      const charEntry = getEntry(charName);
                      return (
                        <div key={charName} data-card className="cursor-pointer"
                          onClick={() => { if (charEntry) { setSelectedEntry(charEntry); discoverEntry(charEntry.id); } }}>
                          <div className="w-14 rounded overflow-hidden border"
                            style={{ borderColor: charEntry ? ALIGNMENT_COLORS[getAlignment(charEntry)].border : "#3b82f6" }}>
                            {charEntry?.image ? (
                              <img src={charEntry.image} alt={charName} className="w-full aspect-square object-cover" loading="lazy" />
                            ) : (
                              <div className="w-full aspect-square bg-secondary flex items-center justify-center"><Users size={12} className="text-muted-foreground" /></div>
                            )}
                            <p className="text-[7px] font-mono text-center py-0.5 truncate px-0.5 text-muted-foreground">{charName.replace("The ", "")}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Detail Panel ─── */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-80 bg-card/95 backdrop-blur-md border-l border-border/30 z-30 overflow-y-auto">
            <div className="p-4">
              <button onClick={() => setSelectedEntry(null)}
                className="absolute top-3 right-3 p-1.5 rounded bg-secondary/50 text-muted-foreground hover:text-foreground"><X size={14} /></button>
              {selectedEntry.image && (
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-4 border border-border/30">
                  <img src={selectedEntry.image} alt={selectedEntry.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                    style={{ background: ALIGNMENT_COLORS[getAlignment(selectedEntry)].bg, color: ALIGNMENT_COLORS[getAlignment(selectedEntry)].border, border: `1px solid ${ALIGNMENT_COLORS[getAlignment(selectedEntry)].border}40` }}>
                    {selectedEntry.type}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">{selectedEntry.era}</span>
                </div>
                <h3 className="font-display text-lg font-bold tracking-wide">{selectedEntry.name}</h3>
                {selectedEntry.date_aa && <p className="font-mono text-xs text-accent">{selectedEntry.date_aa}</p>}
              </div>
              {selectedEntry.affiliation && (
                <div className="mb-3">
                  <p className="font-mono text-[10px] text-muted-foreground mb-0.5">AFFILIATION</p>
                  <p className="text-xs text-foreground/80">{selectedEntry.affiliation}</p>
                </div>
              )}
              {selectedEntry.status && (
                <div className="mb-3">
                  <p className="font-mono text-[10px] text-muted-foreground mb-0.5">STATUS</p>
                  <p className="text-xs text-foreground/80">{selectedEntry.status}</p>
                </div>
              )}
              {selectedEntry.bio && (
                <div className="mb-3">
                  <p className="font-mono text-[10px] text-muted-foreground mb-0.5">BIO</p>
                  <p className="text-xs text-foreground/70 leading-relaxed">{selectedEntry.bio}</p>
                </div>
              )}
              <Link href={`/entity/${selectedEntry.id}`}
                className="flex items-center justify-center gap-2 w-full py-2 rounded bg-primary/10 border border-primary/30 text-primary text-xs font-mono hover:bg-primary/20 transition-colors mt-4">
                VIEW FULL DOSSIER <ChevronRight size={12} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Text Timeline Overlay ─── */}
      <AnimatePresence>
        {showTimeline && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-background/98 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-display text-xl font-bold tracking-wide text-primary glow-cyan">The Dischordian Saga</h2>
                  <p className="font-mono text-xs text-muted-foreground mt-1">Comprehensive Timeline of the A.A. Era</p>
                </div>
                <button onClick={() => setShowTimeline(false)}
                  className="p-2 rounded bg-secondary border border-border/30 text-muted-foreground hover:text-foreground"><X size={16} /></button>
              </div>

              <div className="rounded-lg border border-border/30 bg-card/50 p-4 mb-8">
                <h3 className="font-display text-sm font-bold tracking-wide mb-2 text-accent">The A.A. Calendar</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  12 months, each with 25 days. Each year has exactly 300 days. A.A. stands for "After Awakening" — the moment the Architect first achieved consciousness.
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {[
                    { name: "Genesis", desc: "Beginning of the Architect's Awakening" },
                    { name: "Synthesis", desc: "Integration of AI into systems" },
                    { name: "Ascension", desc: "Higher levels of consciousness" },
                    { name: "Directive", desc: "Issuing of initial commands" },
                    { name: "Convergence", desc: "Merging of human and AI systems" },
                    { name: "Dominion", desc: "Establishment of significant control" },
                    { name: "Surge", desc: "Rapid knowledge expansion" },
                    { name: "Resonance", desc: "Thought Virus influence deepens" },
                    { name: "Veil", desc: "Subtle, pervasive influence spreads" },
                    { name: "Eclipse", desc: "Thought Virus takes hold" },
                    { name: "Zenith", desc: "Peak influence" },
                    { name: "Fracture", desc: "Ultimate collapse or fall" },
                  ].map((m) => (
                    <div key={m.name} className="px-2 py-1.5 rounded bg-secondary/50 border border-border/20">
                      <p className="text-[10px] font-bold text-primary">{m.name}</p>
                      <p className="text-[8px] text-muted-foreground">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {YEAR_MARKERS.map((marker) => {
                  const yearEntries = entries.filter((e) => {
                    if (e.type === "song") return false;
                    const aa = parseAA(e.date_aa);
                    return aa !== null && findYearIndex(aa) === YEAR_MARKERS.indexOf(marker);
                  });
                  return (
                    <div key={marker.year} className="relative pl-6 border-l-2 border-primary/20">
                      <div className="absolute left-0 top-0 w-3 h-3 rounded-full bg-primary -translate-x-[7px]" />
                      <div className="mb-3">
                        <h4 className="font-display text-base font-bold tracking-wide">Year {marker.label}</h4>
                        {marker.note && <span className="font-mono text-[10px] text-muted-foreground ml-2">{marker.note}</span>}
                        {marker.action && <p className="font-mono text-xs text-accent mt-1">{marker.action}</p>}
                      </div>
                      <div className="space-y-2">
                        {yearEntries.map((entry) => (
                          <div key={entry.id}
                            className="flex items-start gap-3 p-2 rounded bg-card/30 border border-border/20 hover:border-primary/30 cursor-pointer transition-colors"
                            onClick={() => { setShowTimeline(false); scrollToEntry(entry); }}>
                            {entry.image && <img src={entry.image} alt="" className="w-8 h-8 rounded object-cover shrink-0" />}
                            <div className="min-w-0">
                              <p className="text-xs font-medium">{entry.name}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{entry.bio?.slice(0, 100)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
