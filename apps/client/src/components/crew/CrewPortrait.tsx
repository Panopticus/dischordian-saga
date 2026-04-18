/* ═══════════════════════════════════════════════════════
   CREW PORTRAIT — Procedural SVG sigil

   Each crew member gets a deterministic geometric portrait
   seeded from their id + species + bloodline. No AI calls,
   no external assets — just SVG shapes arranged by a
   seeded random so the same member always looks the same.

   Species controls silhouette type, bloodline controls
   color, traits add small decorations (mythic traits get
   a halo, combat traits get angular accents, etc.).

   Rationale: apps/shared/characterVisualDNA.ts is reserved
   for named NPCs with hand-authored descriptors. Crew are
   procedural — we need something that scales with the
   roster without calling out to an art pipeline.
   ═══════════════════════════════════════════════════════ */

import { useMemo } from "react";
import { FOUNDING_BLOODLINES, type BloodlineId } from "@/game/crewGenetics";
import type { SerializedCrewMember, CrewSpecies } from "@shared/crewPersistence";

interface Props {
  member: SerializedCrewMember;
  size?: number;
  className?: string;
}

/** Hand-tuned palette overrides for named narrative crew — e.g., the three
 *  bootstrap founders. Looked up by `member.portraitOverrideId`. Each entry
 *  returns a color pair that the portrait's base path/accent will use,
 *  plus an optional extra glyph layered on top of the silhouette. */
const NAMED_PORTRAIT_OVERRIDES: Record<
  string,
  {
    base: string;
    accent: string;
    glyph?: "resonance_wave" | "vigil_flame" | "parallax_rings";
  }
> = {
  bootstrap_vale_resonance: {
    base: "var(--energy-primary)",
    accent: "#67e8f9",
    glyph: "resonance_wave",
  },
  bootstrap_kesh_vigil: {
    base: "#dc2626",
    accent: "#fbbf24",
    glyph: "vigil_flame",
  },
  bootstrap_cipher_parallax: {
    base: "#a855f7",
    accent: "#e9d5ff",
    glyph: "parallax_rings",
  },
};

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const SPECIES_SILHOUETTE: Record<CrewSpecies, {
  /** 0=circle (human), 1=angular (demagi), 2=polygonal (quarchon),
   *  3=teardrop (neyon), 4=burst (voltari), 5=hex (construct),
   *  6=spiked (abyssal) */
  shape: number;
}> = {
  human: { shape: 0 },
  demagi: { shape: 1 },
  quarchon: { shape: 2 },
  neyon: { shape: 3 },
  voltari: { shape: 4 },
  construct: { shape: 5 },
  abyssal: { shape: 6 },
};

/** Draws a head silhouette by species. Returns an SVG path string. */
function silhouettePath(species: CrewSpecies, size: number): string {
  const cx = size / 2;
  const cy = size / 2 - size * 0.05;
  const r = size * 0.3;
  const { shape } = SPECIES_SILHOUETTE[species];
  switch (shape) {
    case 0: // human — circle
      return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`;
    case 1: { // demagi — angular hexagon with flame peak
      const p = [
        [cx, cy - r * 1.2],
        [cx + r * 0.9, cy - r * 0.4],
        [cx + r * 0.85, cy + r * 0.5],
        [cx, cy + r * 1.1],
        [cx - r * 0.85, cy + r * 0.5],
        [cx - r * 0.9, cy - r * 0.4],
      ];
      return "M " + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ") + " Z";
    }
    case 2: { // quarchon — pentagon
      const p = [];
      for (let i = 0; i < 5; i++) {
        const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      }
      return "M " + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ") + " Z";
    }
    case 3: { // neyon — teardrop
      return `M ${cx} ${cy - r * 1.2} Q ${cx + r} ${cy - r * 0.3} ${cx + r * 0.8} ${cy + r * 0.6} Q ${cx} ${cy + r * 1.2} ${cx - r * 0.8} ${cy + r * 0.6} Q ${cx - r} ${cy - r * 0.3} ${cx} ${cy - r * 1.2} Z`;
    }
    case 4: { // voltari — 6-point burst
      const p = [];
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12 - Math.PI / 2;
        const rr = i % 2 === 0 ? r * 1.1 : r * 0.7;
        p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
      }
      return "M " + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ") + " Z";
    }
    case 5: { // construct — flat hex
      const p = [];
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6;
        p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      }
      return "M " + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ") + " Z";
    }
    case 6: { // abyssal — spiked circle
      const p = [];
      for (let i = 0; i < 20; i++) {
        const a = (Math.PI * 2 * i) / 20 - Math.PI / 2;
        const rr = i % 2 === 0 ? r * 1.25 : r * 0.85;
        p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
      }
      return "M " + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ") + " Z";
    }
    default:
      return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`;
  }
}

export default function CrewPortrait({ member, size = 48, className = "" }: Props) {
  const visual = useMemo(() => {
    const rng = seeded(hash(member.id));
    const override = member.portraitOverrideId
      ? NAMED_PORTRAIT_OVERRIDES[member.portraitOverrideId]
      : undefined;
    const forcedAccent = override?.accent;
    const glyph = override?.glyph ?? null;
    const bl = FOUNDING_BLOODLINES[member.bloodlineId as BloodlineId];
    const baseColor = override?.base ?? bl?.color ?? "#666";
    // Derived secondary palette slot from rng so members in the same
    // bloodline still vary.
    const hue = Math.floor(rng() * 60) + hash(member.species) % 120;
    // Mood/status affects the accent saturation and lightness:
    // - low morale dims the accent
    // - high loyalty brightens it
    // - injury desaturates
    const loyaltyBoost = Math.max(0, (member.loyalty - 50) / 50) * 15;
    const moralePenalty = Math.max(0, (50 - member.morale) / 50) * 20;
    const injuryDesat = member.status === "injured" ? 25 : 0;
    const saturation = Math.max(20, 70 - injuryDesat);
    const lightness = Math.max(30, Math.min(75, 55 + loyaltyBoost - moralePenalty));
    const accent = forcedAccent ?? `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    // Dim the whole sigil for injured/sick members
    const opacity = member.status === "injured" || member.status === "sick" ? 0.65 : 1;
    // Eye y position
    const eyeY = size * 0.45 + (rng() - 0.5) * size * 0.05;
    const eyeDx = size * 0.08 + rng() * size * 0.04;
    const hasHalo = member.geneticTraits.some(t =>
      ["archons_echo", "dreamers_mark", "thought_virus_resistant", "necromancers_gift"].includes(t),
    );
    const hasScar = member.geneticTraits.some(t =>
      ["blood_weave_veins", "predator_instinct", "the_hunger"].includes(t),
    );
    const hasStudious = member.geneticTraits.includes("eidetic") ||
      member.geneticTraits.includes("brilliant");
    return { baseColor, accent, eyeY, eyeDx, hasHalo, hasScar, hasStudious, opacity, glyph };
  }, [
    member.id,
    member.bloodlineId,
    member.species,
    member.geneticTraits,
    member.morale,
    member.loyalty,
    member.status,
    member.portraitOverrideId,
    size,
  ]);

  const path = silhouettePath(member.species, size);
  const cx = size / 2;
  const cy = size / 2 - size * 0.05;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label={`portrait of ${member.name}`}
      role="img"
      style={{ opacity: visual.opacity }}
    >
      {/* Background halo for mythic-trait members */}
      {visual.hasHalo && (
        <circle
          cx={cx}
          cy={cy}
          r={size * 0.38}
          fill="none"
          stroke={visual.accent}
          strokeWidth={1}
          strokeOpacity={0.4}
        />
      )}

      {/* Silhouette */}
      <path
        d={path}
        fill={visual.baseColor}
        fillOpacity={0.15}
        stroke={visual.baseColor}
        strokeWidth={1.5}
      />

      {/* Eyes */}
      <circle cx={cx - visual.eyeDx} cy={visual.eyeY} r={size * 0.025} fill={visual.accent} />
      <circle cx={cx + visual.eyeDx} cy={visual.eyeY} r={size * 0.025} fill={visual.accent} />

      {/* Scar / warmark — diagonal line across one eye */}
      {visual.hasScar && (
        <line
          x1={cx - visual.eyeDx - size * 0.06}
          y1={visual.eyeY - size * 0.04}
          x2={cx - visual.eyeDx + size * 0.04}
          y2={visual.eyeY + size * 0.06}
          stroke="var(--energy-error)"
          strokeWidth={1}
          strokeOpacity={0.85}
        />
      )}

      {/* Studious — third eye dot / forehead mark */}
      {visual.hasStudious && (
        <circle cx={cx} cy={cy - size * 0.18} r={size * 0.015} fill={visual.accent} />
      )}

      {/* Status ring */}
      <circle
        cx={cx}
        cy={cy}
        r={size * 0.42}
        fill="none"
        stroke={
          member.status === "dead"
            ? "#7f1d1d"
            : member.status === "injured"
              ? "#f87171"
              : member.status === "on_mission"
                ? "#a855f7"
                : "#4b5563"
        }
        strokeWidth={1}
        strokeOpacity={0.4}
      />

      {/* Named-NPC override glyph */}
      {visual.glyph === "resonance_wave" && (
        <path
          d={`M ${cx - size * 0.28} ${cy + size * 0.3} Q ${cx - size * 0.14} ${cy + size * 0.2} ${cx} ${cy + size * 0.3} T ${cx + size * 0.28} ${cy + size * 0.3}`}
          fill="none"
          stroke={visual.accent}
          strokeWidth={1.5}
          strokeOpacity={0.8}
        />
      )}
      {visual.glyph === "vigil_flame" && (
        <path
          d={`M ${cx} ${cy - size * 0.38} L ${cx - size * 0.05} ${cy - size * 0.28} L ${cx + size * 0.05} ${cy - size * 0.28} Z`}
          fill={visual.accent}
          fillOpacity={0.9}
        />
      )}
      {visual.glyph === "parallax_rings" && (
        <>
          <circle cx={cx} cy={cy} r={size * 0.48} fill="none" stroke={visual.accent} strokeWidth={0.8} strokeOpacity={0.4} />
          <circle cx={cx} cy={cy} r={size * 0.52} fill="none" stroke={visual.accent} strokeWidth={0.8} strokeOpacity={0.3} />
        </>
      )}
    </svg>
  );
}
