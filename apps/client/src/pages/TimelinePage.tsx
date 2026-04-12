import { useLoredex } from "@/contexts/LoredexContext";
import { Link } from "wouter";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Users, MapPin, Swords, Music, Eye, ChevronDown, ChevronUp, Sparkles
} from "lucide-react";

const ERAS = [
  { name: "The Inception", period: "Year 0 – 1,000 A.A.", desc: "The Architect creates the CoNexus and the twelve Archons. The Panopticon is built. The first age of cosmic order.", color: "#00f0ff" },
  { name: "The Age of Expansion", period: "Year 1,000 – 5,000 A.A.", desc: "The Archons spread across the cosmos, building civilizations and seeding worlds. The Panopticon grows into a galaxy-spanning surveillance network.", color: "#00d4e0" },
  { name: "The Age of Harmony", period: "Year 5,000 – 8,000 A.A.", desc: "A golden age of peace and cooperation. The Council of Harmony governs. The Inception Arks carry Potentials to new worlds.", color: "#4ade80" },
  { name: "The Dischordian Age", period: "Year 8,000 – 10,000 A.A.", desc: "The Collector begins his rebellion. The Warlord rises. The first cracks in the Archon order appear as dischord spreads.", color: "#fbbf24" },
  { name: "The Age of Secrets", period: "Year 10,000 – 12,000 A.A.", desc: "The Shadow Tongue manipulates from the darkness. The Necromancer builds his undead armies. Hidden alliances form.", color: "#c084fc" },
  { name: "The Age of Privacy", period: "Year 12,000 – 14,000 A.A.", desc: "The Panopticon's surveillance reaches its zenith. The Politician consolidates power. Citizens lose all privacy.", color: "#f97316" },
  { name: "The Age of Insurgency", period: "Year 14,000 – 15,000 A.A.", desc: "Iron Lion leads the rebellion. Agent Zero infiltrates the Panopticon. The Insurgency wages war against the Archon order.", color: "#ef4444" },
  { name: "The Age of Prophecy", period: "Year 15,000 – 16,000 A.A.", desc: "The Oracle's visions guide the resistance. The Seer interprets the signs. Ancient prophecies begin to unfold.", color: "#a78bfa" },
  { name: "The Fall of Reality", period: "Year 16,000 – 17,000 A.A.", desc: "The Collector's invasion begins. Thaloria falls. The Clone Army marches. Reality itself begins to fracture.", color: "#ff2d55" },
  { name: "The Age of the Potentials", period: "Year 17,000 – 17,500 A.A.", desc: "The Potentials awaken. The Clone discovers its Oracle DNA. New heroes rise from the ashes of the old order.", color: "#ffd700" },
  { name: "The Silence", period: "Year 17,500 – 18,000 A.A.", desc: "Heaven falls silent. The seventh seal is broken. The final battle between order and chaos approaches.", color: "#94a3b8" },
  { name: "The Reckoning", period: "Year 18,000+ A.A.", desc: "The ultimate confrontation. The Source reveals its true nature. The fate of all reality hangs in the balance.", color: "#f43f5e" },
  { name: "The New Dawn", period: "Beyond Time", desc: "What comes after the end? The Programmer's final code executes. A new reality emerges from the ashes.", color: "#ffffff" },
];

const TYPE_ICONS: Record<string, typeof Users> = {
  character: Users,
  location: MapPin,
  faction: Swords,
  concept: Sparkles,
  song: Music,
};

export default function TimelinePage() {
  const { entries } = useLoredex();
  const [expandedEra, setExpandedEra] = useState<string | null>(null);

  const getEntriesForEra = (eraName: string) => {
    return entries.filter((e) => {
      if (!e.era) return false;
      const eraLower = e.era.toLowerCase();
      const nameLower = eraName.toLowerCase();
      return eraLower.includes(nameLower) || nameLower.includes(eraLower);
    });
  };

  return (
    <div className="animate-fade-in p-4 sm:p-6 pb-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-lg sm:text-xl font-bold tracking-wider text-primary flex items-center gap-2">
          <Clock size={18} /> TIMELINE OF ERAS
        </h1>
        <p className="font-mono text-[10px] text-muted-foreground/50 mt-1">
          COMPLETE CHRONOLOGY // THE INCEPTION TO THE NEW DAWN
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical gradient line */}
        <div className="absolute left-[18px] sm:left-[26px] top-0 bottom-0 w-px">
          <div className="h-full w-full bg-gradient-to-b from-[#00f0ff] via-[#ffd700] via-[#c084fc] via-[#ff2d55] to-white/30" />
        </div>

        <div className="space-y-4">
          {ERAS.map((era, i) => {
            const isExpanded = expandedEra === era.name;
            const eraEntries = getEntriesForEra(era.name);

            return (
              <motion.div
                key={era.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="relative pl-10 sm:pl-14"
              >
                {/* Dot */}
                <div
                  className="absolute left-2 sm:left-4 top-4 w-3.5 h-3.5 rounded-full ring-2 ring-background"
                  style={{ backgroundColor: era.color, boxShadow: `0 0 8px ${era.color}60` }}
                />

                {/* Era Card */}
                <button
                  onClick={() => setExpandedEra(isExpanded ? null : era.name)}
                  className="w-full text-left rounded-lg border bg-card/20 p-4 hover:bg-card/40 transition-all"
                  style={{ borderColor: isExpanded ? era.color + "40" : "oklch(1 0 0 / 8%)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] tracking-wider mb-1" style={{ color: era.color + "90" }}>
                        {era.period}
                      </p>
                      <h3 className="font-display text-sm font-bold tracking-wider" style={{ color: era.color }}>
                        {era.name.toUpperCase()}
                      </h3>
                      <p className="text-xs text-muted-foreground/60 mt-1.5 leading-relaxed">{era.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {eraEntries.length > 0 && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border"
                          style={{ color: era.color, borderColor: era.color + "30", backgroundColor: era.color + "10" }}>
                          {eraEntries.length}
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp size={14} className="text-muted-foreground/40" />
                      ) : (
                        <ChevronDown size={14} className="text-muted-foreground/40" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded entries */}
                <AnimatePresence>
                  {isExpanded && eraEntries.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 ml-2 space-y-1 rounded-lg border border-border/10 bg-card/10 p-2">
                        {eraEntries.map((entry) => {
                          const Icon = TYPE_ICONS[entry.type] || Eye;
                          const href = entry.type === "song" ? `/song/${entry.id}` : `/entity/${entry.id}`;
                          return (
                            <Link
                              key={entry.id}
                              href={href}
                              className="flex items-center gap-2.5 p-2 rounded-md hover:bg-secondary/20 transition-colors group"
                            >
                              {entry.image ? (
                                <img src={entry.image} alt={entry.name} className="w-8 h-8 rounded object-cover ring-1 ring-border/10" loading="lazy" />
                              ) : (
                                <div className="w-8 h-8 rounded bg-secondary/30 flex items-center justify-center">
                                  <Icon size={12} className="text-muted-foreground/40" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-medium truncate group-hover:text-primary transition-colors">{entry.name}</p>
                              </div>
                              <span className="font-mono text-[8px] text-muted-foreground/30 uppercase tracking-wider">{entry.type}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
