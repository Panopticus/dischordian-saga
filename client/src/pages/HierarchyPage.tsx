/* ═══════════════════════════════════════════════════════
   HIERARCHY OF THE DAMNED — Corporate Org Chart
   Interactive visualization of the demon leadership
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ChevronLeft, Crown, Skull, Eye, Swords, Brain,
  Users, Shield, Flame, Moon, BookOpen, X, ExternalLink,
  ChevronDown, ChevronUp, Zap, Target
} from "lucide-react";
import { useLoredex } from "@/contexts/LoredexContext";
import { useGamification } from "@/contexts/GamificationContext";

/* ─── Hierarchy Data ─── */
interface DemonLeader {
  id: string;
  entityId: string;
  name: string;
  title: string;
  corporateRole: string;
  tier: "c-suite" | "svp" | "director";
  image: string;
  color: string;
  icon: typeof Crown;
  mirrorsArchon: string;
  mirrorsNeyon: string;
  domain: string;
  bloodWeaveConnection: string;
  specialAbility: string;
}

const DEMON_LEADERS: DemonLeader[] = [
  // C-Suite
  {
    id: "molgrath", entityId: "entity_91",
    name: "Mol'Garath", title: "The Unmaker",
    corporateRole: "CEO & Chairman",
    tier: "c-suite",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/0_KK3lTZ00ffv1BTdSOZL3RN_1773778345196_na1fn_L2hvbWUvdWJ1bnR1L21vbGdhcmF0aF9wb3J0cmFpdA_96678e3f.png",
    color: "#dc2626",
    icon: Crown,
    mirrorsArchon: "The Architect",
    mirrorsNeyon: "The Source",
    domain: "Entropy & Unmaking",
    bloodWeaveConnection: "The Blood Weave is Mol'Garath's nervous system — every corrupted soul feeds his power",
    specialAbility: "Hostile Acquisition — can unmake any reality construct",
  },
  {
    id: "xethraal", entityId: "entity_92",
    name: "Xeth'Raal", title: "The Debt Collector",
    corporateRole: "Chief Financial Officer",
    tier: "c-suite",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/1_3OnVmL0nyyr5XrSWZQS6NC_1773778352306_na1fn_L2hvbWUvdWJ1bnR1L3hldGhfcmFhbF9wb3J0cmFpdA_2ce91495.png",
    color: "#eab308",
    icon: BookOpen,
    mirrorsArchon: "The Collector",
    mirrorsNeyon: "The Meme",
    domain: "Soul Economics & Contracts",
    bloodWeaveConnection: "Maintains the Ledger of Souls — the Blood Weave's accounting system",
    specialAbility: "Compound Interest — soul debts grow exponentially over time",
  },
  {
    id: "vexahlia", entityId: "entity_93",
    name: "Vex'Ahlia", title: "The Taskmaster",
    corporateRole: "Chief Operating Officer",
    tier: "c-suite",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/2_aAZuZESUeOqHrqUN21IHeO_1773778340218_na1fn_L2hvbWUvdWJ1bnR1L3ZleF9haGxpYV9wb3J0cmFpdA_c892f37b.png",
    color: "#e11d48",
    icon: Swords,
    mirrorsArchon: "The Warlord",
    mirrorsNeyon: "Iron Lion",
    domain: "Military Operations & Execution",
    bloodWeaveConnection: "Commands the Blood Weave's armies across 17 dimensions simultaneously",
    specialAbility: "Six-Armed Assault — attacks from all angles at once",
  },
  // SVPs
  {
    id: "draelmon", entityId: "entity_94",
    name: "Drael'Mon", title: "The Harvester",
    corporateRole: "SVP of Acquisitions",
    tier: "svp",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/3_HIV067cxcQl9kwSL8YAUmZ_1773778352451_na1fn_L2hvbWUvdWJ1bnR1L2RyYWVsX21vbl9wb3J0cmFpdA_0cf33974.png",
    color: "#7c3aed",
    icon: Target,
    mirrorsArchon: "The Collector",
    mirrorsNeyon: "The Oracle",
    domain: "Dimensional Conquest & Absorption",
    bloodWeaveConnection: "Plants Blood Weave tendrils into new dimensions to prepare for absorption",
    specialAbility: "World Eater — consumes entire realities",
  },
  {
    id: "shadow-tongue", entityId: "entity_7",
    name: "The Shadow Tongue", title: "The Propagandist",
    corporateRole: "SVP of Communications",
    tier: "svp",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/4_pD08Ury2oUpL3sKzjKwe4b_1773778376183_na1fn_L2hvbWUvdWJ1bnR1L3RoZV9zaGFkb3dfdG9uZ3Vl_8ef13dc3.png",
    color: "#6366f1",
    icon: Brain,
    mirrorsArchon: "The Eyes",
    mirrorsNeyon: "The Enigma",
    domain: "Language Corruption & Cultural Subversion",
    bloodWeaveConnection: "Rewrites the Blood Weave's narrative to corrupt entire civilizations from within",
    specialAbility: "Linguistic Corruption — can rewrite the meaning of any text or speech",
  },
  {
    id: "nykoth", entityId: "entity_95",
    name: "Ny'Koth", title: "The Flayer",
    corporateRole: "SVP of Research & Development",
    tier: "svp",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/5_7yZoLkIQZzpQYeFXB1y6sZ_1773778344979_na1fn_L2hvbWUvdWJ1bnR1L255X2tvdGhfdGhlX2ZsYXllcg_cb0ec125.png",
    color: "#10b981",
    icon: Zap,
    mirrorsArchon: "The Necromancer",
    mirrorsNeyon: "The Human",
    domain: "Dimensional Surgery & Thought Virus Engineering",
    bloodWeaveConnection: "Engineered the Thought Virus using Blood Weave samples — his greatest weapon",
    specialAbility: "Thought Virus — infects minds across dimensional barriers",
  },
  {
    id: "sylvex", entityId: "entity_96",
    name: "Syl'Vex", title: "The Corruptor",
    corporateRole: "SVP of Human Resources",
    tier: "svp",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/6_d6GWqZP6Po0UuqtR3n4LeV_1773778361362_na1fn_L2hvbWUvdWJ1bnR1L3N5bHZleF9wb3J0cmFpdA_8a00948a.png",
    color: "#ec4899",
    icon: Users,
    mirrorsArchon: "The Advocate",
    mirrorsNeyon: "Akai Shi",
    domain: "Soul Recruitment & Identity Corruption",
    bloodWeaveConnection: "Uses the Blood Weave to identify vulnerable souls and begin the corruption process",
    specialAbility: "The Beautiful Lie — makes victims willingly surrender their souls",
  },
  // Directors
  {
    id: "varkul", entityId: "entity_82",
    name: "Varkul", title: "The Blood Lord",
    corporateRole: "Director of Security",
    tier: "director",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/068_varkul_blood_lord_63e789d9.png",
    color: "#991b1b",
    icon: Shield,
    mirrorsArchon: "The Jailer",
    mirrorsNeyon: "The Forgotten",
    domain: "Gate Defense & Undead Command",
    bloodWeaveConnection: "Guards the Blood Weave's physical gates between dimensions",
    specialAbility: "Blood Drain — heals by consuming the life force of enemies",
  },
  {
    id: "fenra", entityId: "entity_83",
    name: "Fenra", title: "The Moon Tyrant",
    corporateRole: "Director of Operations",
    tier: "director",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/069_fenra_moon_tyrant_ac869130.png",
    color: "#854d0e",
    icon: Moon,
    mirrorsArchon: "The Warlord",
    mirrorsNeyon: "The Host",
    domain: "Logistics & Multi-Dimensional Supply Chains",
    bloodWeaveConnection: "Coordinates Blood Weave logistics across 17 dimensions simultaneously",
    specialAbility: "Pack Tactics — coordinates devastating multi-front attacks",
  },
  {
    id: "ithrael", entityId: "entity_97",
    name: "Ith'Rael", title: "The Whisperer",
    corporateRole: "Director of Intelligence",
    tier: "director",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663032080159/2quXz2C2n5hMfqc8hNVW3h/9_YGH9kZqz4xBukeKgJhfNNM_1773778350345_na1fn_L2hvbWUvdWJ1bnR1L2l0aF9yYWVsX3BvcnRyYWl0_7d33a51f.png",
    color: "#4338ca",
    icon: Eye,
    mirrorsArchon: "The Programmer",
    mirrorsNeyon: "Agent Zero",
    domain: "Espionage & The Severance Protocol",
    bloodWeaveConnection: "The true Master of Rylloh — orchestrated the Severance using Blood Weave technology",
    specialAbility: "Severance Protocol — can sever dimensional connections permanently",
  },
];

const TIER_LABELS: Record<string, string> = {
  "c-suite": "C-SUITE EXECUTIVES",
  "svp": "SENIOR VICE PRESIDENTS",
  "director": "DIRECTORS",
};

/* ─── Demon Card Component ─── */
function DemonCard({ demon, onClick, isSelected }: { demon: DemonLeader; onClick: () => void; isSelected: boolean }) {
  const Icon = demon.icon;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`relative rounded-lg overflow-hidden border transition-all duration-300 text-left w-full ${
        isSelected
          ? "border-red-500/60 ring-1 ring-red-500/30"
          : "border-border/60 hover:border-border"
      }`}
      style={{ background: isSelected ? `${demon.color}10` : "rgba(255,255,255,0.03)" }}
    >
      <div className="flex items-start gap-3 p-3">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden flex-shrink-0 border border-border/60">
          <img src={demon.image} alt={demon.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Icon size={12} style={{ color: demon.color }} />
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: demon.color }}>{demon.corporateRole}</span>
          </div>
          <h3 className="font-display text-sm font-bold text-foreground truncate">{demon.name}</h3>
          <p className="font-mono text-[10px] text-muted-foreground/60 truncate">{demon.title}</p>
        </div>
      </div>
      {isSelected && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: demon.color }} />
      )}
    </motion.button>
  );
}

/* ─── Detail Panel ─── */
function DemonDetail({ demon, onClose }: { demon: DemonLeader; onClose: () => void }) {
  const { getEntryById } = useLoredex();
  const entry = getEntryById(demon.entityId);
  const [showFullBio, setShowFullBio] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      className="rounded-xl border border-border/60 overflow-hidden"
      style={{ background: "rgba(10,10,20,0.9)" }}
    >
      {/* Header with portrait */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img src={demon.image} alt={demon.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-background/60 border border-border text-muted-foreground/80 hover:text-foreground hover:bg-background/80 transition-colors"
        >
          <X size={14} />
        </button>
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider" style={{ background: demon.color + "30", color: demon.color, border: `1px solid ${demon.color}40` }}>
              {demon.corporateRole}
            </div>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-black text-foreground">{demon.name}</h2>
          <p className="font-mono text-xs text-muted-foreground/70">{demon.title}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Bio */}
        {entry?.bio && (
          <div>
            <p className="font-mono text-xs text-muted-foreground/80 leading-relaxed">
              {showFullBio ? entry.bio : entry.bio.slice(0, 200) + (entry.bio.length > 200 ? "..." : "")}
            </p>
            {entry.bio.length > 200 && (
              <button onClick={() => setShowFullBio(!showFullBio)} className="font-mono text-[10px] mt-1 flex items-center gap-1" style={{ color: demon.color }}>
                {showFullBio ? <><ChevronUp size={10} /> Show less</> : <><ChevronDown size={10} /> Read full dossier</>}
              </button>
            )}
          </div>
        )}

        {/* Mirrors */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-border/60 p-2.5" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.2em] mb-1">MIRRORS ARCHON</div>
            <div className="font-display text-xs font-bold text-foreground">{demon.mirrorsArchon}</div>
          </div>
          <div className="rounded-md border border-border/60 p-2.5" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.2em] mb-1">OPPOSES NEYON</div>
            <div className="font-display text-xs font-bold text-foreground">{demon.mirrorsNeyon}</div>
          </div>
        </div>

        {/* Domain & Ability */}
        <div className="space-y-2">
          <div className="rounded-md border p-2.5" style={{ borderColor: demon.color + "30", background: demon.color + "08" }}>
            <div className="font-mono text-[9px] tracking-[0.2em] mb-1" style={{ color: demon.color }}>DOMAIN</div>
            <div className="font-mono text-xs text-foreground/85">{demon.domain}</div>
          </div>
          <div className="rounded-md border border-red-500/20 p-2.5" style={{ background: "rgba(220,38,38,0.05)" }}>
            <div className="font-mono text-[9px] text-red-400/60 tracking-[0.2em] mb-1">BLOOD WEAVE CONNECTION</div>
            <div className="font-mono text-xs text-muted-foreground/90">{demon.bloodWeaveConnection}</div>
          </div>
          <div className="rounded-md border border-border/60 p-2.5" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.2em] mb-1">SPECIAL ABILITY</div>
            <div className="font-mono text-xs text-foreground/85">{demon.specialAbility}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/entity/${demon.entityId}`}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-border/60 font-mono text-[10px] text-muted-foreground/80 hover:text-foreground hover:border-border transition-colors"
          >
            <ExternalLink size={10} /> VIEW DOSSIER
          </Link>
          <Link
            href="/fight"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-mono text-[10px] font-bold transition-colors"
            style={{ background: demon.color + "20", color: demon.color, border: `1px solid ${demon.color}40` }}
          >
            <Swords size={10} /> FIGHT
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Org Chart Connector Lines ─── */
function OrgConnector({ color }: { color: string }) {
  return (
    <div className="flex justify-center py-1">
      <div className="w-px h-6" style={{ background: `linear-gradient(180deg, ${color}40, ${color}10)` }} />
    </div>
  );
}

/* ─── Main Page ─── */
export default function HierarchyPage() {
  const [selectedDemon, setSelectedDemon] = useState<DemonLeader | null>(null);
  const [viewMode, setViewMode] = useState<"chart" | "list">("chart");
  const { markHierarchyExplored } = useGamification();

  // Track hierarchy exploration for achievement
  useEffect(() => { markHierarchyExplored(); }, []);

  const cSuite = useMemo(() => DEMON_LEADERS.filter(d => d.tier === "c-suite"), []);
  const svps = useMemo(() => DEMON_LEADERS.filter(d => d.tier === "svp"), []);
  const directors = useMemo(() => DEMON_LEADERS.filter(d => d.tier === "director"), []);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0a0008 0%, #0f0010 30%, #120008 60%, #0a0008 100%)" }}>
      {/* Header */}
      <div className="border-b border-red-500/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/games" className="text-muted-foreground/60 hover:text-foreground font-mono text-xs flex items-center gap-1">
              <ChevronLeft size={14} /> GAMES
            </Link>
            <Link href="/demon-packs" className="text-orange-400/70 hover:text-orange-400 font-mono text-[10px] flex items-center gap-1 px-2 py-0.5 rounded border border-orange-500/20 hover:border-orange-500/40 transition-colors">
              OPEN PACKS
            </Link>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("chart")}
              className={`px-3 py-1 rounded font-mono text-[10px] transition-colors ${viewMode === "chart" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-muted-foreground/60 hover:text-muted-foreground/80"}`}
            >
              ORG CHART
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded font-mono text-[10px] transition-colors ${viewMode === "list" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-muted-foreground/60 hover:text-muted-foreground/80"}`}
            >
              LIST VIEW
            </button>
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="px-4 pt-8 pb-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-500/40" />
            <Skull size={16} className="text-red-500/60" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-500/40" />
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-black tracking-wider text-foreground mb-2">
            HIERARCHY OF THE <span className="text-red-500">DAMNED</span>
          </h1>
          <p className="font-mono text-xs text-muted-foreground/60 max-w-lg mx-auto leading-relaxed">
            The corporate structure of Hell itself. Ten demon leaders who mirror the Archons and oppose the Neyons,
            connected through the Blood Weave and bound to the Master of Rylloh.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Org Chart / List */}
          <div className="flex-1">
            {viewMode === "chart" ? (
              <div className="space-y-2">
                {/* CEO at top */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <div className="font-mono text-[9px] text-red-500/40 tracking-[0.3em] mb-2 text-center">{TIER_LABELS["c-suite"]}</div>
                  <div className="flex justify-center mb-1">
                    <div className="w-full max-w-sm">
                      <DemonCard demon={cSuite[0]} onClick={() => setSelectedDemon(cSuite[0])} isSelected={selectedDemon?.id === cSuite[0].id} />
                    </div>
                  </div>
                  {/* Connector from CEO to CFO/COO */}
                  <div className="flex justify-center">
                    <div className="flex items-center gap-0">
                      <div className="w-px h-4 bg-red-500/20" />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="relative w-full max-w-2xl">
                      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-red-500/20" />
                      <div className="absolute top-0 left-1/4 w-px h-3 bg-red-500/20" />
                      <div className="absolute top-0 right-1/4 w-px h-3 bg-red-500/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto mt-3">
                    {cSuite.slice(1).map(d => (
                      <DemonCard key={d.id} demon={d} onClick={() => setSelectedDemon(d)} isSelected={selectedDemon?.id === d.id} />
                    ))}
                  </div>
                </motion.div>

                <OrgConnector color="#dc2626" />

                {/* SVPs */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.3em] mb-2 text-center">{TIER_LABELS["svp"]}</div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {svps.map(d => (
                      <DemonCard key={d.id} demon={d} onClick={() => setSelectedDemon(d)} isSelected={selectedDemon?.id === d.id} />
                    ))}
                  </div>
                </motion.div>

                <OrgConnector color="#dc2626" />

                {/* Directors */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <div className="font-mono text-[9px] text-muted-foreground/50 tracking-[0.3em] mb-2 text-center">{TIER_LABELS["director"]}</div>
                  <div className="grid grid-cols-3 gap-3">
                    {directors.map(d => (
                      <DemonCard key={d.id} demon={d} onClick={() => setSelectedDemon(d)} isSelected={selectedDemon?.id === d.id} />
                    ))}
                  </div>
                </motion.div>
              </div>
            ) : (
              /* List View */
              <div className="space-y-6">
                {(["c-suite", "svp", "director"] as const).map(tier => (
                  <div key={tier}>
                    <div className="font-mono text-[9px] text-red-500/40 tracking-[0.3em] mb-3 flex items-center gap-2">
                      <span className="h-px flex-1 bg-red-500/10" />
                      {TIER_LABELS[tier]}
                      <span className="h-px flex-1 bg-red-500/10" />
                    </div>
                    <div className="space-y-2">
                      {DEMON_LEADERS.filter(d => d.tier === tier).map(d => (
                        <DemonCard key={d.id} demon={d} onClick={() => setSelectedDemon(d)} isSelected={selectedDemon?.id === d.id} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Blood Weave Lore Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 rounded-xl border border-red-500/15 p-5"
              style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.05), rgba(120,20,20,0.03))" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Flame size={14} className="text-red-500/60" />
                <h3 className="font-display text-sm font-bold text-red-400/80 tracking-wider">THE BLOOD WEAVE</h3>
              </div>
              <p className="font-mono text-xs text-muted-foreground/70 leading-relaxed mb-3">
                The Blood Weave is the Hierarchy's nervous system — a vast network of corrupted dimensional threads
                that connects all ten demon leaders to their master, Mol'Garath. Through the Blood Weave, soul contracts
                are enforced, armies are coordinated, and the Thought Virus is propagated across realities.
              </p>
              <p className="font-mono text-xs text-muted-foreground/70 leading-relaxed">
                The Advocate discovered the Blood Weave during the Age of Privacy and attempted to weaponize it against
                the Hierarchy. This discovery led to the creation of the Shadow Tongue as a counter-weapon, and ultimately
                to the Severance — Ith'Rael's masterwork that severed the connection between dimensions and trapped
                countless souls in the spaces between realities.
              </p>
            </motion.div>

            {/* Mirror Table */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 rounded-xl border border-border/60 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="px-4 py-3 border-b border-border/60">
                <h3 className="font-display text-sm font-bold text-foreground/85 tracking-wider">ARCHON / DEMON / NEYON MIRRORS</h3>
                <p className="font-mono text-[10px] text-muted-foreground/50 mt-0.5">Each demon mirrors an Archon's power and opposes a Neyon's purpose</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="px-4 py-2 text-left font-mono text-[9px] text-muted-foreground/50 tracking-wider">ARCHON</th>
                      <th className="px-4 py-2 text-left font-mono text-[9px] text-red-400/50 tracking-wider">DEMON</th>
                      <th className="px-4 py-2 text-left font-mono text-[9px] text-cyan-400/50 tracking-wider">NEYON</th>
                      <th className="px-4 py-2 text-left font-mono text-[9px] text-muted-foreground/50 tracking-wider">ROLE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMON_LEADERS.map((d, i) => (
                      <tr
                        key={d.id}
                        className={`border-b border-border/40 cursor-pointer hover:bg-muted/50 transition-colors ${selectedDemon?.id === d.id ? "bg-red-500/5" : ""}`}
                        onClick={() => setSelectedDemon(d)}
                      >
                        <td className="px-4 py-2 font-mono text-xs text-muted-foreground/80">{d.mirrorsArchon}</td>
                        <td className="px-4 py-2 font-display text-xs font-bold" style={{ color: d.color }}>{d.name}</td>
                        <td className="px-4 py-2 font-mono text-xs text-cyan-400/60">{d.mirrorsNeyon}</td>
                        <td className="px-4 py-2 font-mono text-[10px] text-muted-foreground/60">{d.corporateRole}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Detail Panel (desktop sidebar) */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-4">
              <AnimatePresence mode="wait">
                {selectedDemon ? (
                  <DemonDetail key={selectedDemon.id} demon={selectedDemon} onClose={() => setSelectedDemon(null)} />
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl border border-border/60 p-6 text-center"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                  >
                    <Skull size={32} className="text-red-500/20 mx-auto mb-3" />
                    <p className="font-mono text-xs text-muted-foreground/50">Select a demon leader to view their dossier</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
