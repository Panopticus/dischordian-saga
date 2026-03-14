import { useLoredex } from "@/contexts/LoredexContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { Link, useSearch } from "wouter";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search, Users, MapPin, Swords, Music, Eye, Play, Filter, X, Terminal, Sparkles
} from "lucide-react";

const TYPE_ICONS: Record<string, typeof Users> = {
  character: Users,
  location: MapPin,
  faction: Swords,
  concept: Sparkles,
  song: Music,
};

const TYPE_COLORS: Record<string, string> = {
  character: "text-[#00f0ff]",
  location: "text-[#ffd700]",
  faction: "text-[#c084fc]",
  song: "text-[#ff2d55]",
  concept: "text-[#4ade80]",
};

const TYPE_BG: Record<string, string> = {
  character: "bg-[#00f0ff]/10 border-[#00f0ff]/20",
  location: "bg-[#ffd700]/10 border-[#ffd700]/20",
  faction: "bg-[#c084fc]/10 border-[#c084fc]/20",
  song: "bg-[#ff2d55]/10 border-[#ff2d55]/20",
  concept: "bg-[#4ade80]/10 border-[#4ade80]/20",
};

export default function SearchPage() {
  const searchParams = useSearch();
  const urlType = new URLSearchParams(searchParams).get("type") || "";
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState(urlType);
  const { entries, search, getByType, discoverEntry } = useLoredex();
  const { playSong } = usePlayer();

  useEffect(() => {
    if (urlType) setActiveType(urlType);
  }, [urlType]);

  const results = useMemo(() => {
    let filtered = query ? search(query) : entries;
    if (activeType) {
      filtered = filtered.filter((e) => e.type === activeType);
    }
    return filtered;
  }, [query, activeType, entries]);

  const types = ["", "character", "location", "faction", "song", "concept"];

  return (
    <div className="animate-fade-in p-4 sm:p-6 pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-lg sm:text-xl font-bold tracking-wider text-primary flex items-center gap-2">
          <Terminal size={18} /> DATABASE SEARCH
        </h1>
        <p className="font-mono text-[10px] text-muted-foreground/50 mt-1">
          {entries.length} ENTRIES INDEXED // QUERY THE ARCHIVE
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search entities, songs, locations..."
          className="w-full pl-10 pr-10 py-3 rounded-lg bg-secondary/30 border border-border/30 text-sm font-mono text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {types.map((type) => {
          const Icon = type ? TYPE_ICONS[type] || Eye : Filter;
          const label = type ? type.toUpperCase() : "ALL";
          const count = type ? getByType(type).length : entries.length;
          if (type && !count) return null;
          const active = activeType === type;
          return (
            <button
              key={type}
              onClick={() => setActiveType(active && type ? "" : type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-mono tracking-wider border transition-all ${
                active
                  ? type ? `${TYPE_BG[type]} ${TYPE_COLORS[type]}` : "bg-primary/15 border-primary/30 text-primary"
                  : "bg-secondary/20 border-border/20 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={10} /> {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <p className="font-mono text-[10px] text-muted-foreground/50 mb-3">
        {results.length} RESULT{results.length !== 1 ? "S" : ""} FOUND
        {query && ` FOR "${query.toUpperCase()}"`}
      </p>

      {/* Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {results.map((entry, i) => {
          const Icon = TYPE_ICONS[entry.type] || Sparkles;
          const isSong = entry.type === "song";
          const href = isSong ? `/song/${entry.id}` : `/entity/${entry.id}`;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.01, 0.5) }}
            >
              <Link
                href={href}
                onClick={() => discoverEntry(entry.id)}
                className="group block rounded-lg border border-border/15 bg-card/20 hover:bg-card/40 hover:border-primary/20 transition-all overflow-hidden"
              >
                <div className="aspect-square relative overflow-hidden bg-secondary/20">
                  {entry.image ? (
                    <img
                      src={entry.image}
                      alt={entry.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon size={24} className="text-muted-foreground/20" />
                    </div>
                  )}
                  {/* Type badge */}
                  <div className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wider border ${TYPE_BG[entry.type]} ${TYPE_COLORS[entry.type]}`}>
                    {entry.type === "character" ? "CHAR" : entry.type.slice(0, 4).toUpperCase()}
                  </div>
                  {/* Play button for songs */}
                  {isSong && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        playSong(entry);
                      }}
                      className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    >
                      <Play size={11} className="ml-0.5" />
                    </button>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-medium truncate group-hover:text-primary transition-colors">
                    {entry.name}
                  </p>
                  <p className="text-[9px] font-mono text-muted-foreground/40 truncate mt-0.5">
                    {isSong ? entry.album : entry.era || entry.affiliation || entry.type}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {results.length === 0 && (
        <div className="text-center py-16">
          <Search size={32} className="mx-auto text-muted-foreground/15 mb-3" />
          <p className="font-mono text-sm text-muted-foreground/40">NO MATCHING ENTRIES FOUND</p>
          <p className="font-mono text-[10px] text-muted-foreground/25 mt-1">Try adjusting your search query or filters</p>
        </div>
      )}
    </div>
  );
}
