/* ═══════════════════════════════════════════════════
   PAPER DOLL RENDERER — SVG-based character art system
   with species-specific base models and equipment overlay layers.
   Equipment visually appears on the character when equipped.
   ═══════════════════════════════════════════════════ */
import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  type Species, type EquipSlot, type EquipmentItem,
  SPECIES_VISUALS, RARITY_COLORS, SLOT_CONFIG, getEquipmentById,
} from "@/data/equipmentData";

interface PaperDollProps {
  species: Species;
  alignment: "order" | "chaos";
  element: string;
  /** Map of slot → equipped item ID (null = empty) */
  equipped: Record<EquipSlot, string | null>;
  /** Character name for the nameplate */
  name?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show slot indicators on hover */
  interactive?: boolean;
  /** Callback when a slot is clicked */
  onSlotClick?: (slot: EquipSlot) => void;
  /** Morality score for aura color */
  moralityScore?: number;
  /** Class for styling */
  className?: string;
}

/** Get element color for aura effects */
function getElementColor(element: string): string {
  const map: Record<string, string> = {
    earth: "#22c55e", fire: "#ef4444", water: "#3b82f6", air: "#94a3b8",
    space: "#8b5cf6", time: "#f59e0b", probability: "#ec4899", reality: "#06b6d4",
  };
  return map[element] || "#60a5fa";
}

/** Get morality aura color */
function getMoralityAura(score: number): { color: string; intensity: number } {
  if (score <= -60) return { color: "#ef4444", intensity: 0.6 };
  if (score <= -30) return { color: "#f87171", intensity: 0.4 };
  if (score >= 60) return { color: "#22c55e", intensity: 0.6 };
  if (score >= 30) return { color: "#4ade80", intensity: 0.4 };
  return { color: "#60a5fa", intensity: 0.2 };
}

/** Size dimensions */
const SIZES = {
  sm: { w: 160, h: 220, scale: 0.6 },
  md: { w: 240, h: 340, scale: 0.85 },
  lg: { w: 320, h: 440, scale: 1.0 },
};

export default function PaperDollRenderer({
  species, alignment, element, equipped, name,
  size = "md", interactive = false, onSlotClick,
  moralityScore = 0, className = "",
}: PaperDollProps) {
  const sv = SPECIES_VISUALS[species];
  const elemColor = getElementColor(element);
  const moralAura = getMoralityAura(moralityScore);
  const isOrder = alignment === "order";
  const dim = SIZES[size];

  /** Resolve equipped items */
  const equippedItems = useMemo(() => {
    const items: Partial<Record<EquipSlot, EquipmentItem>> = {};
    for (const [slot, id] of Object.entries(equipped)) {
      if (id) {
        const item = getEquipmentById(id);
        if (item) items[slot as EquipSlot] = item;
      }
    }
    return items;
  }, [equipped]);

  const viewBox = `0 0 ${dim.w} ${dim.h}`;

  return (
    <div className={`relative ${className}`} style={{ width: dim.w, height: dim.h }}>
      <svg
        viewBox={viewBox}
        width={dim.w}
        height={dim.h}
        xmlns="http://www.w3.org/2000/svg"
        className="select-none"
      >
        <defs>
          {/* Morality aura glow */}
          <radialGradient id={`morality-aura-${species}`} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor={moralAura.color} stopOpacity={moralAura.intensity} />
            <stop offset="70%" stopColor={moralAura.color} stopOpacity={moralAura.intensity * 0.3} />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          {/* Element aura */}
          <radialGradient id={`elem-aura-${species}`} cx="50%" cy="50%" r="45%">
            <stop offset="0%" stopColor={elemColor} stopOpacity="0.15" />
            <stop offset="100%" stopColor={elemColor} stopOpacity="0" />
          </radialGradient>
          {/* Body gradient */}
          <linearGradient id={`body-grad-${species}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sv.skinTone} />
            <stop offset="100%" stopColor={sv.bodyColor} />
          </linearGradient>
          {/* Glow filter */}
          <filter id="glow-soft">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-strong">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── BACKGROUND AURA ── */}
        <ellipse cx={dim.w / 2} cy={dim.h * 0.45} rx={dim.w * 0.45} ry={dim.h * 0.45}
          fill={`url(#morality-aura-${species})`} />
        <ellipse cx={dim.w / 2} cy={dim.h * 0.5} rx={dim.w * 0.35} ry={dim.h * 0.35}
          fill={`url(#elem-aura-${species})`} />

        {/* ── GROUND SHADOW ── */}
        <ellipse cx={dim.w / 2} cy={dim.h * 0.88} rx={dim.w * 0.25} ry={dim.h * 0.03}
          fill="rgba(0,0,0,0.3)" />

        {/* ── BASE BODY ── */}
        <g transform={`translate(${dim.w / 2}, ${dim.h * 0.15})`}>
          {/* Head */}
          <ellipse cx="0" cy={20 * dim.scale} rx={22 * dim.scale} ry={26 * dim.scale}
            fill={sv.skinTone} stroke={sv.accentColor} strokeWidth={1.5 * dim.scale} strokeOpacity="0.5" />

          {/* Eyes */}
          <ellipse cx={-8 * dim.scale} cy={16 * dim.scale} rx={4 * dim.scale} ry={3 * dim.scale}
            fill={sv.eyeColor} filter="url(#glow-soft)" />
          <ellipse cx={8 * dim.scale} cy={16 * dim.scale} rx={4 * dim.scale} ry={3 * dim.scale}
            fill={sv.eyeColor} filter="url(#glow-soft)" />
          {/* Pupils */}
          <circle cx={-7 * dim.scale} cy={16 * dim.scale} r={1.5 * dim.scale} fill="#000" />
          <circle cx={9 * dim.scale} cy={16 * dim.scale} r={1.5 * dim.scale} fill="#000" />

          {/* Species-specific head features */}
          {species === "demagi" && (
            <>
              {/* Arcane rune markings on forehead */}
              <path d={`M ${-10 * dim.scale} ${5 * dim.scale} L 0 ${-2 * dim.scale} L ${10 * dim.scale} ${5 * dim.scale}`}
                stroke={elemColor} strokeWidth={1 * dim.scale} fill="none" strokeOpacity="0.6" filter="url(#glow-soft)" />
              <circle cx="0" cy={-2 * dim.scale} r={2 * dim.scale} fill={elemColor} fillOpacity="0.4" filter="url(#glow-soft)" />
            </>
          )}
          {species === "quarchon" && (
            <>
              {/* Cyber eye implant */}
              <rect x={-14 * dim.scale} y={13 * dim.scale} width={6 * dim.scale} height={6 * dim.scale}
                rx={1 * dim.scale} fill="none" stroke="#06b6d4" strokeWidth={1 * dim.scale} strokeOpacity="0.8" />
              {/* Circuit lines on temple */}
              <line x1={14 * dim.scale} y1={8 * dim.scale} x2={22 * dim.scale} y2={5 * dim.scale}
                stroke="#06b6d4" strokeWidth={0.8 * dim.scale} strokeOpacity="0.5" />
              <line x1={22 * dim.scale} y1={5 * dim.scale} x2={22 * dim.scale} y2={15 * dim.scale}
                stroke="#06b6d4" strokeWidth={0.8 * dim.scale} strokeOpacity="0.5" />
            </>
          )}
          {species === "neyon" && (
            <>
              {/* Dual-colored eye glow (one organic, one AI) */}
              <circle cx={-8 * dim.scale} cy={16 * dim.scale} r={5 * dim.scale}
                fill="none" stroke="#22c55e" strokeWidth={0.8 * dim.scale} strokeOpacity="0.5" filter="url(#glow-soft)" />
              <circle cx={8 * dim.scale} cy={16 * dim.scale} r={5 * dim.scale}
                fill="none" stroke="#f59e0b" strokeWidth={0.8 * dim.scale} strokeOpacity="0.5" filter="url(#glow-soft)" />
              {/* Golden crown hint */}
              <path d={`M ${-12 * dim.scale} ${-5 * dim.scale} L ${-6 * dim.scale} ${-12 * dim.scale} L 0 ${-5 * dim.scale} L ${6 * dim.scale} ${-12 * dim.scale} L ${12 * dim.scale} ${-5 * dim.scale}`}
                stroke="#f59e0b" strokeWidth={1 * dim.scale} fill="none" strokeOpacity="0.4" filter="url(#glow-soft)" />
            </>
          )}

          {/* Neck */}
          <rect x={-6 * dim.scale} y={44 * dim.scale} width={12 * dim.scale} height={12 * dim.scale}
            fill={sv.skinTone} />

          {/* Torso */}
          <path d={`
            M ${-30 * dim.scale} ${56 * dim.scale}
            Q ${-35 * dim.scale} ${80 * dim.scale} ${-28 * dim.scale} ${130 * dim.scale}
            L ${28 * dim.scale} ${130 * dim.scale}
            Q ${35 * dim.scale} ${80 * dim.scale} ${30 * dim.scale} ${56 * dim.scale}
            Z
          `} fill={`url(#body-grad-${species})`} stroke={sv.accentColor} strokeWidth={1 * dim.scale} strokeOpacity="0.3" />

          {/* Arms */}
          <path d={`
            M ${-30 * dim.scale} ${60 * dim.scale}
            Q ${-45 * dim.scale} ${90 * dim.scale} ${-40 * dim.scale} ${130 * dim.scale}
            L ${-35 * dim.scale} ${130 * dim.scale}
            Q ${-38 * dim.scale} ${90 * dim.scale} ${-26 * dim.scale} ${62 * dim.scale}
          `} fill={sv.skinTone} strokeOpacity="0.2" stroke={sv.accentColor} strokeWidth={0.5 * dim.scale} />
          <path d={`
            M ${30 * dim.scale} ${60 * dim.scale}
            Q ${45 * dim.scale} ${90 * dim.scale} ${40 * dim.scale} ${130 * dim.scale}
            L ${35 * dim.scale} ${130 * dim.scale}
            Q ${38 * dim.scale} ${90 * dim.scale} ${26 * dim.scale} ${62 * dim.scale}
          `} fill={sv.skinTone} strokeOpacity="0.2" stroke={sv.accentColor} strokeWidth={0.5 * dim.scale} />

          {/* Legs */}
          <rect x={-18 * dim.scale} y={130 * dim.scale} width={14 * dim.scale} height={60 * dim.scale}
            rx={4 * dim.scale} fill={sv.bodyColor} stroke={sv.accentColor} strokeWidth={0.5 * dim.scale} strokeOpacity="0.3" />
          <rect x={4 * dim.scale} y={130 * dim.scale} width={14 * dim.scale} height={60 * dim.scale}
            rx={4 * dim.scale} fill={sv.bodyColor} stroke={sv.accentColor} strokeWidth={0.5 * dim.scale} strokeOpacity="0.3" />

          {/* Species body features */}
          {species === "demagi" && (
            <>
              {/* Glowing veins on arms */}
              <line x1={-32 * dim.scale} y1={70 * dim.scale} x2={-38 * dim.scale} y2={120 * dim.scale}
                stroke={elemColor} strokeWidth={0.8 * dim.scale} strokeOpacity="0.4" filter="url(#glow-soft)" />
              <line x1={32 * dim.scale} y1={70 * dim.scale} x2={38 * dim.scale} y2={120 * dim.scale}
                stroke={elemColor} strokeWidth={0.8 * dim.scale} strokeOpacity="0.4" filter="url(#glow-soft)" />
              {/* Elemental aura particles */}
              <circle cx={-20 * dim.scale} cy={40 * dim.scale} r={2 * dim.scale} fill={elemColor} fillOpacity="0.5" filter="url(#glow-soft)">
                <animate attributeName="cy" values={`${40 * dim.scale};${35 * dim.scale};${40 * dim.scale}`} dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx={20 * dim.scale} cy={45 * dim.scale} r={1.5 * dim.scale} fill={elemColor} fillOpacity="0.4" filter="url(#glow-soft)">
                <animate attributeName="cy" values={`${45 * dim.scale};${38 * dim.scale};${45 * dim.scale}`} dur="4s" repeatCount="indefinite" />
              </circle>
            </>
          )}
          {species === "quarchon" && (
            <>
              {/* Circuit lines on torso */}
              <line x1={-15 * dim.scale} y1={70 * dim.scale} x2={-15 * dim.scale} y2={110 * dim.scale}
                stroke="#06b6d4" strokeWidth={0.8 * dim.scale} strokeOpacity="0.3" />
              <line x1={-15 * dim.scale} y1={90 * dim.scale} x2={-5 * dim.scale} y2={90 * dim.scale}
                stroke="#06b6d4" strokeWidth={0.8 * dim.scale} strokeOpacity="0.3" />
              <line x1={15 * dim.scale} y1={75 * dim.scale} x2={15 * dim.scale} y2={105 * dim.scale}
                stroke="#06b6d4" strokeWidth={0.8 * dim.scale} strokeOpacity="0.3" />
              {/* Metal plate on shoulder */}
              <rect x={25 * dim.scale} y={56 * dim.scale} width={10 * dim.scale} height={15 * dim.scale}
                rx={2 * dim.scale} fill="#374151" stroke="#06b6d4" strokeWidth={0.8 * dim.scale} strokeOpacity="0.5" />
            </>
          )}
          {species === "neyon" && (
            <>
              {/* Hybrid veins - organic green on left, AI gold on right */}
              <line x1={-10 * dim.scale} y1={60 * dim.scale} x2={-15 * dim.scale} y2={120 * dim.scale}
                stroke="#22c55e" strokeWidth={1 * dim.scale} strokeOpacity="0.3" filter="url(#glow-soft)" />
              <line x1={10 * dim.scale} y1={60 * dim.scale} x2={15 * dim.scale} y2={120 * dim.scale}
                stroke="#f59e0b" strokeWidth={1 * dim.scale} strokeOpacity="0.3" filter="url(#glow-soft)" />
              {/* Golden energy core */}
              <circle cx="0" cy={85 * dim.scale} r={5 * dim.scale} fill="#f59e0b" fillOpacity="0.3" filter="url(#glow-strong)">
                <animate attributeName="r" values={`${5 * dim.scale};${7 * dim.scale};${5 * dim.scale}`} dur="2s" repeatCount="indefinite" />
              </circle>
            </>
          )}

          {/* ── EQUIPMENT LAYERS ── */}

          {/* HELM */}
          {equippedItems.helm && (
            <g filter="url(#glow-soft)">
              <path d={`
                M ${-24 * dim.scale} ${8 * dim.scale}
                Q ${-26 * dim.scale} ${-8 * dim.scale} 0 ${-16 * dim.scale}
                Q ${26 * dim.scale} ${-8 * dim.scale} ${24 * dim.scale} ${8 * dim.scale}
                Q ${20 * dim.scale} ${2 * dim.scale} 0 ${0 * dim.scale}
                Q ${-20 * dim.scale} ${2 * dim.scale} ${-24 * dim.scale} ${8 * dim.scale}
              `} fill={equippedItems.helm.glowColor} fillOpacity="0.3"
                stroke={equippedItems.helm.glowColor} strokeWidth={1.5 * dim.scale} strokeOpacity="0.7" />
              {/* Visor line */}
              <line x1={-16 * dim.scale} y1={10 * dim.scale} x2={16 * dim.scale} y2={10 * dim.scale}
                stroke={equippedItems.helm.glowColor} strokeWidth={1 * dim.scale} strokeOpacity="0.5" />
            </g>
          )}

          {/* ARMOR */}
          {equippedItems.armor && (
            <g filter="url(#glow-soft)">
              <path d={`
                M ${-28 * dim.scale} ${58 * dim.scale}
                Q ${-32 * dim.scale} ${78 * dim.scale} ${-26 * dim.scale} ${125 * dim.scale}
                L ${26 * dim.scale} ${125 * dim.scale}
                Q ${32 * dim.scale} ${78 * dim.scale} ${28 * dim.scale} ${58 * dim.scale}
                Z
              `} fill={equippedItems.armor.glowColor} fillOpacity="0.15"
                stroke={equippedItems.armor.glowColor} strokeWidth={1.5 * dim.scale} strokeOpacity="0.5" />
              {/* Chest plate detail */}
              <path d={`
                M ${-12 * dim.scale} ${65 * dim.scale}
                L 0 ${60 * dim.scale}
                L ${12 * dim.scale} ${65 * dim.scale}
                L 0 ${80 * dim.scale} Z
              `} fill={equippedItems.armor.glowColor} fillOpacity="0.25" />
            </g>
          )}

          {/* WEAPON (left hand) */}
          {equippedItems.weapon && (
            <g filter="url(#glow-soft)">
              {/* Weapon shaft */}
              <line x1={-38 * dim.scale} y1={100 * dim.scale} x2={-48 * dim.scale} y2={50 * dim.scale}
                stroke={equippedItems.weapon.glowColor} strokeWidth={3 * dim.scale} strokeOpacity="0.7" strokeLinecap="round" />
              {/* Weapon head/blade */}
              <path d={`
                M ${-48 * dim.scale} ${50 * dim.scale}
                L ${-55 * dim.scale} ${35 * dim.scale}
                L ${-45 * dim.scale} ${30 * dim.scale}
                L ${-42 * dim.scale} ${45 * dim.scale} Z
              `} fill={equippedItems.weapon.glowColor} fillOpacity="0.5"
                stroke={equippedItems.weapon.glowColor} strokeWidth={1 * dim.scale} strokeOpacity="0.8" />
              {/* Energy glow on blade */}
              <circle cx={-48 * dim.scale} cy={38 * dim.scale} r={4 * dim.scale}
                fill={equippedItems.weapon.glowColor} fillOpacity="0.3" filter="url(#glow-strong)" />
            </g>
          )}

          {/* SECONDARY (right hand) */}
          {equippedItems.secondary && (
            <g filter="url(#glow-soft)">
              <line x1={38 * dim.scale} y1={100 * dim.scale} x2={45 * dim.scale} y2={60 * dim.scale}
                stroke={equippedItems.secondary.glowColor} strokeWidth={2.5 * dim.scale} strokeOpacity="0.6" strokeLinecap="round" />
              <circle cx={45 * dim.scale} cy={55 * dim.scale} r={8 * dim.scale}
                fill={equippedItems.secondary.glowColor} fillOpacity="0.15"
                stroke={equippedItems.secondary.glowColor} strokeWidth={1.5 * dim.scale} strokeOpacity="0.5" />
            </g>
          )}

          {/* ACCESSORY (belt/waist area) */}
          {equippedItems.accessory && (
            <g filter="url(#glow-soft)">
              <ellipse cx="0" cy={128 * dim.scale} rx={20 * dim.scale} ry={4 * dim.scale}
                fill="none" stroke={equippedItems.accessory.glowColor} strokeWidth={2 * dim.scale} strokeOpacity="0.5" />
              {/* Gem on belt */}
              <circle cx="0" cy={128 * dim.scale} r={3 * dim.scale}
                fill={equippedItems.accessory.glowColor} fillOpacity="0.6" filter="url(#glow-soft)" />
            </g>
          )}

          {/* CONSUMABLE (hip pouch) */}
          {equippedItems.consumable && (
            <g>
              <rect x={20 * dim.scale} y={120 * dim.scale} width={10 * dim.scale} height={12 * dim.scale}
                rx={2 * dim.scale} fill={equippedItems.consumable.glowColor} fillOpacity="0.2"
                stroke={equippedItems.consumable.glowColor} strokeWidth={1 * dim.scale} strokeOpacity="0.4" />
            </g>
          )}

          {/* Alignment aura ring */}
          <ellipse cx="0" cy={95 * dim.scale} rx={50 * dim.scale} ry={100 * dim.scale}
            fill="none" stroke={isOrder ? "#22d3ee" : "#a855f7"} strokeWidth={0.5 * dim.scale}
            strokeOpacity="0.15" strokeDasharray={`${4 * dim.scale} ${8 * dim.scale}`}>
            <animateTransform attributeName="transform" type="rotate" from="0 0 95" to="360 0 95" dur="20s" repeatCount="indefinite" />
          </ellipse>
        </g>
      </svg>

      {/* ── INTERACTIVE SLOT INDICATORS ── */}
      {interactive && (
        <div className="absolute inset-0 pointer-events-none">
          {(Object.entries(SLOT_CONFIG) as [EquipSlot, typeof SLOT_CONFIG[EquipSlot]][]).map(([slot, config]) => {
            const item = equippedItems[slot];
            const rarity = item ? RARITY_COLORS[item.rarity] : null;
            return (
              <motion.button
                key={slot}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSlotClick?.(slot)}
                className={`pointer-events-auto absolute w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer
                  ${item
                    ? `${rarity!.border} ${rarity!.bg} shadow-lg`
                    : "border-dashed border-muted-foreground/30 bg-muted/20 hover:border-primary/50"
                  }`}
                style={{
                  left: `${config.position.x}%`,
                  top: `${config.position.y}%`,
                  transform: "translate(-50%, -50%)",
                  boxShadow: item ? `0 0 8px ${item.glowColor}` : undefined,
                }}
                title={item ? `${config.label}: ${item.name}` : `${config.label}: Empty`}
              >
                <span className={`text-[8px] font-mono font-bold ${item ? rarity!.text : "text-muted-foreground/50"}`}>
                  {config.label.charAt(0)}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* ── NAMEPLATE ── */}
      {name && size !== "sm" && (
        <div className="absolute bottom-0 left-0 right-0 text-center">
          <span className={`font-display text-xs tracking-[0.2em] ${isOrder ? "text-cyan-400" : "text-purple-400"}`}
            style={{ textShadow: `0 0 8px ${isOrder ? "rgba(34,211,238,0.5)" : "rgba(168,85,247,0.5)"}` }}>
            {name}
          </span>
        </div>
      )}
    </div>
  );
}
