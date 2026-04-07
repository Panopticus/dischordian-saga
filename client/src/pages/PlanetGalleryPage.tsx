/**
 * PlanetGalleryPage — Explorable gallery of planets in the Dischordian universe.
 * Shows uploaded planet art with lore descriptions and living ambient effects.
 */
import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Globe, X } from "lucide-react";
import LivingBackground from "@/components/LivingBackground";

interface Planet {
  id: string;
  name: string;
  image: string;
  color: string;
  description: string;
  faction?: string;
}

const PLANETS: Planet[] = [
  {
    id: "violetta", name: "Violetta", image: "/art/planets/planet-violetta.png", color: "#c084fc",
    description: "The Voltari homeworld. A purple planet inside a living electrical storm. It has been broadcasting a signal for 2 million years. The storm is the language.",
    faction: "Voltari",
  },
  {
    id: "terminus", name: "Terminus", image: "/art/planets/planet-terminus.png", color: "#ef4444",
    description: "The former Panopticon — the Architect's prison planet, broken free and drifting. Every soul the Architect ever imprisoned is here. At its center sits Kael, the self-proclaimed Sovereign. The Thought Virus turned them all into the Swarm.",
    faction: "The Source",
  },
  {
    id: "castle-of-death", name: "Castle of Death", image: "/art/planets/planet-castle-of-death.png", color: "#22c55e",
    description: "The Necromancer's domain in the Matrix of Dreams, now potentially manifesting in reality. A gothic castle of black bone floating in white mist, surrounded by swirling souls. Death is not an ending here — it is a beginning.",
    faction: "The Necromancer",
  },
  {
    id: "degens-casino", name: "The Degen's Casino", image: "/art/planets/planet-degens-casino.png", color: "#f59e0b",
    description: "A lavish casino station on the edge of the Shield — the only open zone in Ne-Yon space. Neon signs in impossible languages, crystal chandeliers made of lightning. The Degen — the only Ne-Yon in the known universe — runs the games. Souls are the favorite currency.",
    faction: "The Degen",
  },
  // Placeholder entries for planets not yet uploaded
  { id: "atarion", name: "Atarion", image: "", color: "#60a5fa", description: "Crystal spires that sing in the wind. Bioluminescent forests. Elara's homeworld — beautiful, destroyed.", faction: "Elara" },
  { id: "new-babylon", name: "New Babylon", image: "", color: "#a855f7", description: "Corrupt mega-city planet. Orbital trade stations. Where Adjudicator Locke makes deals that reshape civilizations.", faction: "Locke" },
  { id: "mechronis", name: "Mechronis", image: "", color: "#22c55e", description: "The Architect's academy world. Gothic spires, institutional cold. Where Potentials are shaped into weapons.", faction: "The Architect" },
  { id: "panopticon", name: "The Panopticon", image: "", color: "#ef4444", description: "Planet-sized surveillance megastructure. Eyes everywhere. Now broken free, becoming Terminus.", faction: "The Architect" },
];

export default function PlanetGalleryPage() {
  const [selected, setSelected] = useState<Planet | null>(null);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 50%, #0a0a1a 0%, #000 100%)",
      }}>
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: 1 + Math.random() * 2,
              height: 1 + Math.random() * 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.1 + Math.random() * 0.5,
              animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="text-muted-foreground hover:text-white"><ChevronLeft size={20} /></Link>
          <Globe size={18} className="text-cyan-400" />
          <div>
            <h1 className="font-display text-xl font-bold tracking-wider">STELLAR CARTOGRAPHY</h1>
            <p className="font-mono text-[10px] text-muted-foreground/60">Known worlds of the Dischordian Saga</p>
          </div>
        </div>

        {/* Planet grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {PLANETS.map((planet, i) => (
            <motion.button
              key={planet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => planet.image && setSelected(planet)}
              className={`void-surface p-3 text-left group ${!planet.image ? "opacity-30 cursor-not-allowed" : ""}`}
            >
              {/* Planet image */}
              <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-black/50 flex items-center justify-center">
                {planet.image ? (
                  <img
                    src={planet.image}
                    alt={planet.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <Globe size={32} className="text-muted-foreground/20" />
                )}
              </div>
              {/* Planet name */}
              <div className="font-display text-sm font-bold tracking-wider" style={{ color: planet.color }}>
                {planet.name}
              </div>
              {planet.faction && (
                <div className="font-mono text-[8px] text-muted-foreground/50 mt-0.5">{planet.faction}</div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Planet detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-2xl w-full void-elevated overflow-hidden"
            >
              {/* Living background */}
              <LivingBackground src={selected.image} accent={selected.color} opacity={0.2} particleCount={8} />

              {/* Hero image */}
              <div className="relative h-64 overflow-hidden">
                <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" style={{ filter: "brightness(0.7)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%)" }} />
                <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-white/50 hover:text-white">
                  <X size={20} />
                </button>
                <div className="absolute bottom-4 left-6">
                  <h2 className="font-display text-3xl font-bold tracking-wider" style={{ color: selected.color, textShadow: `0 0 30px ${selected.color}40` }}>
                    {selected.name}
                  </h2>
                  {selected.faction && (
                    <span className="font-mono text-xs" style={{ color: `${selected.color}80` }}>Domain of {selected.faction}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="relative z-10 p-6">
                <p className="font-mono text-sm text-foreground/80 leading-relaxed">{selected.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
