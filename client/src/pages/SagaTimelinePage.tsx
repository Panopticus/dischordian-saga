/* ═══════════════════════════════════════════════════════
   SAGA TIMELINE — Horizontal scrollable timeline mapping
   epochs, albums, key events, and CoNexus games into one
   unified narrative view.
   ═══════════════════════════════════════════════════════ */
import { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Music, Tv, Gamepad2, Users, MapPin, Swords, Eye,
  ChevronRight, ChevronLeft, Zap, BookOpen, Star, Disc3
} from "lucide-react";

/* ─── TIMELINE DATA ─── */
interface TimelineNode {
  id: string;
  title: string;
  subtitle?: string;
  type: "epoch" | "album" | "event" | "game" | "era";
  era: string;
  description: string;
  color: string;
  icon: typeof Clock;
  link?: string;
  characters?: string[];
  songs?: number;
  year?: string;
}

const TIMELINE_NODES: TimelineNode[] = [
  {
    id: "genesis",
    title: "Genesis",
    subtitle: "The Beginning",
    type: "era",
    era: "Genesis",
    description: "The origin of all things. The Architect begins to shape reality, setting in motion events that will echo across all epochs.",
    color: "var(--neon-cyan)",
    icon: Star,
    characters: ["The Architect", "The Source"],
  },
  {
    id: "golden-age",
    title: "The Golden Age",
    subtitle: "Rise of Civilization",
    type: "era",
    era: "Golden Age",
    description: "A period of unprecedented growth and discovery. The great factions form and the first power structures emerge.",
    color: "var(--neon-amber)",
    icon: Star,
    characters: ["The Politician", "The Warlord"],
  },
  {
    id: "album-dischordian",
    title: "Dischordian Logic",
    subtitle: "Album // 29 Tracks",
    type: "album",
    era: "Multiple Eras",
    description: "The foundational album spanning the entire saga. From the Seeds of Inception to the final confrontation, this album maps the complete mythology.",
    color: "var(--neon-cyan)",
    icon: Disc3,
    link: "/album/dischordian-logic",
    songs: 29,
    year: "2025",
  },
  {
    id: "epoch-zero",
    title: "Epoch Zero: The Fall of Reality",
    subtitle: "The Prequel",
    type: "epoch",
    era: "The Fall of Reality",
    description: "The end of human civilization as it was known. The Architect, the Enigma, and the first Potentials emerge from the ashes.",
    color: "var(--neon-red)",
    icon: Tv,
    link: "/watch",
    characters: ["The Architect", "The Enigma", "The Human", "The Warlord"],
  },
  {
    id: "game-building-architect",
    title: "Building the Architect",
    subtitle: "CoNexus Interactive",
    type: "game",
    era: "Pre-Fall",
    description: "An interactive story exploring the Architect's origins and the choices that shaped the most powerful being in the multiverse.",
    color: "var(--orb-orange)",
    icon: Gamepad2,
    characters: ["The Architect"],
  },
  {
    id: "game-necromancers-lair",
    title: "The Necromancer's Lair",
    subtitle: "CoNexus Interactive",
    type: "game",
    era: "Fall Era",
    description: "Descend into the Necromancer's domain. Face the undead armies and uncover the secrets of resurrection technology.",
    color: "var(--orb-orange)",
    icon: Gamepad2,
    characters: ["The Necromancer", "The Collector"],
  },
  {
    id: "age-of-privacy",
    title: "The Age of Privacy",
    subtitle: "Album // 20 Tracks",
    type: "album",
    era: "Age of Privacy",
    description: "Set in the era just before the Age of Revelation. Surveillance, control, and the fight for individual freedom define this chapter.",
    color: "var(--neon-amber)",
    icon: Disc3,
    link: "/album/age-of-privacy",
    songs: 20,
    year: "2025",
  },
  {
    id: "epoch-1",
    title: "First Epoch: The Awakening",
    subtitle: "Season 1",
    type: "epoch",
    era: "First Epoch",
    description: "The Potentials awaken in a strange new world. Alliances form, enemies emerge, and the true nature of the Inception Arks begins to reveal itself.",
    color: "var(--neon-cyan)",
    icon: Tv,
    link: "/watch",
    characters: ["The Human", "Iron Lion", "The Collector", "The Oracle"],
  },
  {
    id: "album-book-of-daniel",
    title: "The Book of Daniel 2:47",
    subtitle: "Album // 22 Tracks",
    type: "album",
    era: "First Epoch",
    description: "The Programmer's story. Dr. Daniel Cross travels through time, becoming the Antiquarian, witnessing the rise and fall of civilizations.",
    color: "var(--neon-cyan)",
    icon: Disc3,
    link: "/album/book-of-daniel",
    songs: 22,
    year: "2025",
  },
  {
    id: "game-warlord",
    title: "The Warlord",
    subtitle: "CoNexus Interactive",
    type: "game",
    era: "First Epoch",
    description: "Experience the Warlord's campaign of conquest. Command armies, forge alliances, and shape the fate of the First Epoch.",
    color: "var(--orb-orange)",
    icon: Gamepad2,
    characters: ["The Warlord", "Iron Lion"],
  },
  {
    id: "spaces-between",
    title: "The Spaces Inbetween",
    subtitle: "Interstitial Stories",
    type: "epoch",
    era: "Between Epochs",
    description: "The quiet moments between the great upheavals. Visions, dreams, and the threads that connect all timelines.",
    color: "var(--chart-4)",
    icon: Eye,
    link: "/watch",
  },
  {
    id: "epoch-2",
    title: "Second Epoch: Being and Time",
    subtitle: "Season 2",
    type: "epoch",
    era: "Second Epoch",
    description: "The Potentials have established their new world. But old enemies return, and the nature of time itself becomes a battlefield.",
    color: "var(--neon-amber)",
    icon: Tv,
    link: "/watch",
    characters: ["The Programmer", "The Antiquarian", "The Politician"],
  },
  {
    id: "game-sundown-bazaar",
    title: "Sundown Bazaar",
    subtitle: "CoNexus Interactive // Season 2",
    type: "game",
    era: "Second Epoch",
    description: "Navigate the dangerous markets of Babylon during Season 2. Trade, spy, and survive in the most treacherous bazaar in the multiverse.",
    color: "var(--orb-orange)",
    icon: Gamepad2,
    characters: ["The Collector"],
  },
  {
    id: "album-silence",
    title: "Silence in Heaven",
    subtitle: "Album // 18 Tracks",
    type: "album",
    era: "Age of Revelation",
    description: "The final album before the great silence. When the seventh seal is broken, there is silence in heaven for about half an hour.",
    color: "var(--neon-red)",
    icon: Disc3,
    link: "/album/silence-in-heaven",
    songs: 18,
    year: "2026",
  },
  {
    id: "age-of-revelation",
    title: "The Age of Revelation",
    subtitle: "The Truth Unveiled",
    type: "era",
    era: "Age of Revelation",
    description: "All secrets are revealed. The true nature of the Architect, the Programmer's journey, and the fate of all Potentials converge in this climactic era.",
    color: "var(--neon-red)",
    icon: Zap,
    characters: ["The Architect", "The Enigma", "The Programmer"],
  },
];

const TYPE_BADGES: Record<string, { label: string; class: string }> = {
  epoch: { label: "SHOW", class: "bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border-[var(--neon-cyan)]/30" },
  album: { label: "ALBUM", class: "bg-[var(--neon-amber)]/10 text-[var(--neon-amber)] border-[var(--neon-amber)]/30" },
  event: { label: "EVENT", class: "bg-[var(--neon-red)]/10 text-[var(--neon-red)] border-[var(--neon-red)]/30" },
  game: { label: "GAME", class: "bg-[var(--orb-orange)]/10 text-[var(--orb-orange)] border-[var(--orb-orange)]/30" },
  era: { label: "ERA", class: "bg-[var(--chart-4)]/10 text-[var(--chart-4)] border-[var(--chart-4)]/30" },
};

export default function SagaTimelinePage() {
  const { getEntry } = useLoredex();
  const [selectedNode, setSelectedNode] = useState<TimelineNode | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filteredNodes = useMemo(() => {
    if (filter === "all") return TIMELINE_NODES;
    return TIMELINE_NODES.filter((n) => n.type === filter);
  }, [filter]);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState);
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [filteredNodes]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  return (
    <div className="animate-fade-in pb-8">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-4 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="font-mono text-[10px] text-primary/70 tracking-[0.3em]">CLASSIFIED // NARRATIVE MAP</span>
          <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-foreground mb-2">
          THE <span className="text-primary glow-cyan">SAGA</span> TIMELINE
        </h1>
        <p className="font-mono text-xs text-muted-foreground max-w-2xl">
          A unified narrative map connecting epochs, albums, CoNexus games, and key events
          across the complete Dischordian Saga mythology.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {[
            { key: "all", label: "ALL", icon: Eye },
            { key: "epoch", label: "SHOW", icon: Tv },
            { key: "album", label: "ALBUMS", icon: Disc3 },
            { key: "game", label: "GAMES", icon: Gamepad2 },
            { key: "era", label: "ERAS", icon: Star },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-mono tracking-wider border transition-all ${
                  filter === f.key
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-secondary/30 border-border/30 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                }`}
              >
                <Icon size={10} />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ HORIZONTAL TIMELINE ═══ */}
      <div className="relative">
        {/* Scroll Arrows */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card/90 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all backdrop-blur-sm"
          >
            <ChevronLeft size={16} />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card/90 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all backdrop-blur-sm"
          >
            <ChevronRight size={16} />
          </button>
        )}

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-4"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex items-start gap-0 min-w-max py-4">
            {filteredNodes.map((node, i) => {
              const Icon = node.icon;
              const badge = TYPE_BADGES[node.type];
              const isSelected = selectedNode?.id === node.id;

              return (
                <div key={node.id} className="flex items-start">
                  {/* Node */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedNode(isSelected ? null : node)}
                    className={`relative flex flex-col items-center w-40 sm:w-48 group cursor-pointer`}
                  >
                    {/* Dot on timeline */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "scale-125 shadow-lg"
                          : "group-hover:scale-110"
                      }`}
                      style={{
                        borderColor: node.color,
                        backgroundColor: isSelected ? node.color : "transparent",
                        boxShadow: isSelected ? `0 0 12px ${node.color}40` : "none",
                      }}
                    >
                      <Icon size={9} style={{ color: isSelected ? "var(--background)" : node.color }} />
                    </div>

                    {/* Connector line */}
                    <div
                      className="w-0.5 h-4"
                      style={{ backgroundColor: `${node.color}30` }}
                    />

                    {/* Card */}
                    <div
                      className={`w-full rounded-lg border p-3 text-left transition-all ${
                        isSelected
                          ? "bg-card/80 shadow-lg"
                          : "bg-card/30 hover:bg-card/50"
                      }`}
                      style={{
                        borderColor: isSelected ? `${node.color}60` : "var(--border)",
                      }}
                    >
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wider border mb-1.5 ${badge.class}`}
                      >
                        {badge.label}
                      </span>
                      <p className="font-display text-xs font-bold tracking-wide text-foreground leading-tight mb-0.5">
                        {node.title}
                      </p>
                      {node.subtitle && (
                        <p className="font-mono text-[9px] text-muted-foreground/60 truncate">
                          {node.subtitle}
                        </p>
                      )}
                    </div>
                  </motion.button>

                  {/* Connector between nodes */}
                  {i < filteredNodes.length - 1 && (
                    <div className="flex items-center pt-2.5 px-0">
                      <div className="w-6 sm:w-10 h-0.5 bg-gradient-to-r from-border/40 to-border/20" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ SELECTED NODE DETAIL ═══ */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mx-4 sm:mx-6 mt-2"
          >
            <div
              className="rounded-lg border p-5 sm:p-6"
              style={{ borderColor: `${selectedNode.color}30`, backgroundColor: `${selectedNode.color}05` }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${selectedNode.color}15` }}
                >
                  <selectedNode.icon size={24} style={{ color: selectedNode.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wider border ${
                        TYPE_BADGES[selectedNode.type].class
                      }`}
                    >
                      {TYPE_BADGES[selectedNode.type].label}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                      {selectedNode.era}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold tracking-wide text-foreground mb-1">
                    {selectedNode.title}
                  </h3>
                  <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                    {selectedNode.description}
                  </p>

                  {/* Characters */}
                  {selectedNode.characters && selectedNode.characters.length > 0 && (
                    <div className="mb-4">
                      <p className="font-mono text-[9px] text-muted-foreground/50 tracking-wider mb-2">
                        KEY CHARACTERS
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedNode.characters.map((name) => {
                          const entry = getEntry(name);
                          return (
                            <Link
                              key={name}
                              href={entry ? `/entity/${entry.id}` : "#"}
                              className="flex items-center gap-2 px-2 py-1 rounded-md border border-border/20 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/20 transition-all"
                            >
                              {entry?.image && (
                                <img
                                  src={entry.image}
                                  alt={name}
                                  className="w-6 h-6 rounded-full object-cover ring-1 ring-border/20"
                                />
                              )}
                              <span className="font-mono text-[10px] text-foreground/80">{name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action Link */}
                  {selectedNode.link && (
                    <Link
                      href={selectedNode.link}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-mono border transition-all hover:opacity-80"
                      style={{
                        borderColor: `${selectedNode.color}40`,
                        color: selectedNode.color,
                        backgroundColor: `${selectedNode.color}10`,
                      }}
                    >
                      {selectedNode.type === "epoch" ? <Tv size={12} /> : <Disc3 size={12} />}
                      {selectedNode.type === "epoch" ? "WATCH NOW" : "LISTEN NOW"}
                      <ChevronRight size={11} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ VERTICAL TIMELINE (MOBILE-FRIENDLY) ═══ */}
      <div className="px-4 sm:px-6 mt-8">
        <h2 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
          <BookOpen size={13} />
          CHRONOLOGICAL ORDER
        </h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-accent/20 to-destructive/20" />

          <div className="space-y-3">
            {TIMELINE_NODES.map((node, i) => {
              const Icon = node.icon;
              const badge = TYPE_BADGES[node.type];
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="relative pl-10"
                >
                  {/* Dot */}
                  <div
                    className="absolute left-2.5 top-3 w-3 h-3 rounded-full border-2"
                    style={{ borderColor: node.color, backgroundColor: `${node.color}20` }}
                  />

                  {node.link ? (
                    <Link
                      href={node.link}
                      className="block p-3 rounded-lg border border-border/20 bg-card/20 hover:bg-card/40 hover:border-primary/20 transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wider border ${badge.class}`}>
                          <Icon size={8} />
                          {badge.label}
                        </span>
                        <span className="font-mono text-[9px] text-muted-foreground/40">{node.era}</span>
                      </div>
                      <p className="font-display text-xs font-bold tracking-wide group-hover:text-primary transition-colors">
                        {node.title}
                      </p>
                      <p className="font-mono text-[10px] text-muted-foreground/50 line-clamp-1 mt-0.5">
                        {node.description}
                      </p>
                    </Link>
                  ) : (
                    <div className="p-3 rounded-lg border border-border/20 bg-card/20">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wider border ${badge.class}`}>
                          <Icon size={8} />
                          {badge.label}
                        </span>
                        <span className="font-mono text-[9px] text-muted-foreground/40">{node.era}</span>
                      </div>
                      <p className="font-display text-xs font-bold tracking-wide">{node.title}</p>
                      <p className="font-mono text-[10px] text-muted-foreground/50 line-clamp-1 mt-0.5">
                        {node.description}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
