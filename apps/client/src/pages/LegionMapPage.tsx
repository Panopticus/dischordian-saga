/* ═══════════════════════════════════════════════════════
   LEGION MAP

   Visual galactic overview of where every deployed Apprentice
   is posted. Shows:
     • The Ship (home base)
     • Armies (3 deployment sectors — fronts)
     • Trade routes (2 envoy posts)
     • Tower garrison (1 captain)
     • Cryo Vault (2 frozen slots)
     • Legion graveyard (fallen)

   Animated SVG map. Click a post to inspect its apprentice.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Map as MapIcon, Anchor, Swords, Flag, Snowflake, Skull, Heart, Zap } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import type { Apprentice } from "@shared/apprentices";
import { getArchetypeDef, getRarityTier } from "@shared/apprentices";

interface Deployment {
  id: string;
  role: "companion" | "cryo" | "army_1" | "army_2" | "army_3" | "trade_1" | "trade_2" | "tower" | "sacrificed" | "graveyard";
  name: string;
  x: number; // 0-100 percent
  y: number;
  icon: any;
  color: string;
  description: string;
}

/* ─── MAP NODES ─── */

const MAP_NODES: Deployment[] = [
  // Center: the ship
  { id: "ship", role: "companion", name: "The Ark", x: 50, y: 50, icon: Anchor, color: "void-text-accent", description: "Your ship. The Companion stands here beside you." },

  // Armies — three fronts
  { id: "army_1", role: "army_1", name: "Front I: Thaloria Wastes", x: 15, y: 20, icon: Swords, color: "void-text-error", description: "Primary combat front. Most casualties, most promotions." },
  { id: "army_2", role: "army_2", name: "Front II: Circuit Wastes", x: 85, y: 25, icon: Swords, color: "void-text-premium", description: "Signal-dead territory. Long silences between updates." },
  { id: "army_3", role: "army_3", name: "Front III: New Babylon Perimeter", x: 20, y: 80, icon: Swords, color: "void-text-error", description: "Urban defense. Political pressure, slow grind." },

  // Trade routes
  { id: "trade_1", role: "trade_1", name: "Route I: Violetta Run", x: 80, y: 75, icon: Flag, color: "void-text-energy", description: "Voltari trade. Diplomatic posting." },
  { id: "trade_2", role: "trade_2", name: "Route II: Degens Spiral", x: 70, y: 35, icon: Flag, color: "void-text-energy", description: "Casino station deals. Slippery envoy work. The host knows your name before you introduce yourself." },

  // Tower garrison
  { id: "tower", role: "tower", name: "Terminus Swarm Defense", x: 30, y: 65, icon: Zap, color: "void-text-premium", description: "Tower Captain's post. Defends the supply lines." },

  // Cryo vault
  { id: "cryo_1", role: "cryo", name: "Cryo Vault · Slot 1", x: 40, y: 40, icon: Snowflake, color: "void-text-energy", description: "Frozen. Dreaming. Awaiting thaw." },
  { id: "cryo_2", role: "cryo", name: "Cryo Vault · Slot 2", x: 60, y: 40, icon: Snowflake, color: "void-text-energy", description: "Frozen. Dreaming. Awaiting thaw." },

  // Graveyard (off-map)
  { id: "graveyard", role: "graveyard", name: "The Fallen", x: 5, y: 95, icon: Skull, color: "void-text", description: "Those who did not return." },
];

export default function LegionMapPage() {
  const { state } = useGame();
  const graduates = (state.legionGraduates ?? {}) as Record<string, Apprentice>;
  const currentApprentice = state.apprentice as Apprentice | null;
  const fallen = (state.apprenticeFallen as Apprentice[]) ?? [];
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Mock deployment assignments — in production these come from graduateLegion state
  const deploymentMap = useMemo(() => {
    const map: Record<string, Apprentice | null> = {};
    const graduateList = Object.values(graduates);
    // Simple distribution: first 3 to armies, next 2 to trade, next 1 to tower, next 2 to cryo
    const deploymentOrder = ["army_1", "army_2", "army_3", "trade_1", "trade_2", "tower", "cryo_1", "cryo_2"];
    deploymentOrder.forEach((role, i) => {
      map[role] = graduateList[i] ?? null;
    });
    // Ship shows current companion
    map["ship"] = currentApprentice;
    map["graveyard"] = fallen[fallen.length - 1] ?? null;
    return map;
  }, [graduates, currentApprentice, fallen]);

  const selected = selectedNode ? MAP_NODES.find(n => n.id === selectedNode) : null;
  const selectedApprentice = selectedNode ? deploymentMap[selectedNode] : null;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <MapIcon size={18} className="void-text-energy" />
          <div>
            <h1 className="font-display text-lg font-bold tracking-wider">LEGION MAP</h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-wider">
              {Object.keys(graduates).length} graduates deployed · {fallen.length} fallen
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Map canvas */}
          <div className="lg:col-span-2">
            <div className="relative w-full aspect-video border border-border/40 rounded-lg bg-gradient-to-br from-indigo-950/30 via-background to-purple-950/20 overflow-hidden">
              {/* Star field */}
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                {Array.from({ length: 60 }, (_, i) => {
                  const x = (i * 37) % 100;
                  const y = (i * 71) % 100;
                  const r = 0.1 + (i % 3) * 0.1;
                  return <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={0.4 + (i % 4) * 0.15} />;
                })}
              </svg>

              {/* Deployment lines (ship → each active post) */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {MAP_NODES.filter(n => n.id !== "ship" && n.id !== "graveyard" && deploymentMap[n.id]).map(node => (
                  <line
                    key={`line-${node.id}`}
                    x1={50} y1={50}
                    x2={node.x} y2={node.y}
                    stroke="rgba(165, 180, 252, 0.2)"
                    strokeWidth="0.15"
                    strokeDasharray="0.5 0.8"
                  />
                ))}
              </svg>

              {/* Nodes */}
              {MAP_NODES.map(node => {
                const Icon = node.icon;
                const deployed = deploymentMap[node.id];
                const isActive = !!deployed;
                const isSelected = selectedNode === node.id;
                return (
                  <motion.button
                    key={node.id}
                    onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.05 * MAP_NODES.indexOf(node) }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? "scale-125 void-border void-bg-sunk" :
                      isActive ? "void-border void-bg-sunk hover:scale-110" :
                      "border-border/30 bg-background/40 opacity-40 hover:opacity-70"
                    }`}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    data-testid={`legion-node-${node.id}`}
                    title={node.name}
                  >
                    <Icon size={14} className={isActive ? node.color : "text-muted-foreground/40"} />
                    {isActive && (
                      <motion.span
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border void-border"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
            <p className="font-mono text-[9px] text-muted-foreground/60 text-center mt-2 italic">
              Click any post to inspect. Lines show active deployments connected to the Ark.
            </p>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-1">
            {selected && selectedApprentice ? (
              <DeploymentDetail node={selected} apprentice={selectedApprentice} />
            ) : selected ? (
              <div className="p-4 rounded border border-border/30 bg-card/40">
                <h3 className="font-display text-sm font-bold tracking-wider text-foreground mb-1">{selected.name}</h3>
                <p className="font-mono text-[10px] italic text-muted-foreground/70 leading-relaxed mb-3">{selected.description}</p>
                <p className="font-mono text-[10px] text-muted-foreground/60">No apprentice deployed here yet.</p>
              </div>
            ) : (
              <div className="p-4 rounded border border-dashed border-border/30 bg-card/20 text-center">
                <MapIcon size={24} className="mx-auto text-muted-foreground/30 mb-2" />
                <p className="font-mono text-[10px] text-muted-foreground/60">
                  Click a post on the map to inspect its occupant.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DeploymentDetail({ node, apprentice }: { node: Deployment; apprentice: Apprentice }) {
  const def = getArchetypeDef(apprentice.archetype);
  const tier = getRarityTier(apprentice.rarity);
  const Icon = node.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded border void-border bg-gradient-to-br from-amber-950/20 to-indigo-950/10"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className={node.color} />
        <span className={`font-mono text-[9px] uppercase tracking-[0.25em] ${node.color}`}>
          {node.name}
        </span>
      </div>
      <h3 className="font-display text-lg font-bold text-foreground">{apprentice.name}</h3>
      <p className="font-mono text-[9px] italic void-text-accent mb-2">{def.title} · {def.name}</p>

      <div className="flex items-center gap-2 mb-3">
        <span
          className="font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded border"
          style={{ color: tier.color, borderColor: `${tier.color}60` }}
        >
          {tier.name}
        </span>
        <span className="font-mono text-[9px] text-muted-foreground/60">{apprentice.gender} · {apprentice.race}</span>
      </div>

      <div className="space-y-1.5 mb-3">
        <StatLine icon={Heart} label="Bond" value={`${apprentice.bond}/100`} color="void-text-error" />
        <StatLine icon={Zap} label="Trial Day" value={`${apprentice.trialDay}/28`} color="void-text-energy" />
        {apprentice.corruption > 0 && (
          <StatLine icon={Skull} label="Corruption" value={`${apprentice.corruption}/100`} color="void-text-error" />
        )}
      </div>

      <p className="font-mono text-[9px] italic text-muted-foreground/70 leading-relaxed mb-2">
        {apprentice.backstory}
      </p>
      <p className="font-mono text-[9px] italic text-foreground/70 leading-relaxed">
        Posted: {node.description}
      </p>
    </motion.div>
  );
}

function StatLine({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between px-2 py-1 rounded border border-border/20 bg-background/40">
      <div className="flex items-center gap-1.5">
        <Icon size={10} className={color} />
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/60">{label}</span>
      </div>
      <span className={`font-mono text-[10px] font-bold tabular-nums ${color}`}>{value}</span>
    </div>
  );
}
