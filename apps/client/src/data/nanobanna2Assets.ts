import { assetUrl } from "@/lib/assetUrl";
/* ═══════════════════════════════════════════════════════
   NANOBANNA2 ART ASSETS — 112 Images
   Soul Stones, Eidolons, STRAIN, Spectral Forms,
   Dischordian Companions, Rooms, VFX
   
   Source: s3://dgrsart/NanoBanna2_Art_Assets_112.zip
   Bible: docs/production/COMPLETE_ART_PROMPT_BIBLE.md
   ═══════════════════════════════════════════════════════ */

/* ─── SOUL STONES (3) ─── */
export const SOUL_STONE_ART = {
  violet: assetUrl("art/soul-stones/soul-stone-violet.png"),
  red:    assetUrl("art/soul-stones/soul-stone-red.png"),
  gold:   assetUrl("art/soul-stones/soul-stone-gold.png"),
} as const;

/* ─── EIDOLONS (60) — 5 classes × 4 alignments × 3 stages ─── */
type Alignment = "norm" | "hier" | "dream" | "scar";
type Stage = "frag" | "comp" | "asc";

function eidolonPath(cls: string, align: Alignment, stage: Stage): string {
  return assetUrl(`art/eidolons/${cls}/${cls}-${align}-${stage}.png`);
}

export const EIDOLON_CLASSES = ["auros", "nyx", "cog", "sibyl", "toxis"] as const;
export const EIDOLON_ALIGNMENTS: Alignment[] = ["norm", "hier", "dream", "scar"];
export const EIDOLON_STAGES: Stage[] = ["frag", "comp", "asc"];

/** Get art path for any eidolon form */
export function getEidolonArt(cls: string, alignment: Alignment, stage: Stage): string {
  return eidolonPath(cls, alignment, stage);
}

/** Get all 12 forms for a single eidolon class */
export function getEidolonClassForms(cls: string) {
  return EIDOLON_ALIGNMENTS.flatMap(align =>
    EIDOLON_STAGES.map(stage => ({
      alignment: align,
      stage,
      src: eidolonPath(cls, align, stage),
    }))
  );
}

export const EIDOLON_CLASS_META: Record<typeof EIDOLON_CLASSES[number], { name: string; title: string; class: string }> = {
  auros: { name: "Auros",  title: "Gilded Lion",      class: "Soldier" },
  nyx:   { name: "Nyx",    title: "Void Serpent",      class: "Rogue" },
  cog:   { name: "Cog",    title: "Brass Architect",   class: "Engineer" },
  sibyl: { name: "Sibyl",  title: "Crystal Oracle",    class: "Mystic" },
  toxis: { name: "Toxis",  title: "Plague Bloom",      class: "Alchemist" },
};

/* ─── STRAIN (12) — same alignment+stage pattern as eidolons ─── */
export const STRAIN_ART: Record<string, string> = {
  "norm-frag":  assetUrl("art/strain/strain-norm-frag.png"),
  "norm-comp":  assetUrl("art/strain/strain-norm-comp.png"),
  "norm-asc":   assetUrl("art/strain/strain-norm-asc.png"),
  "hier-frag":  assetUrl("art/strain/strain-hier-frag.png"),
  "hier-comp":  assetUrl("art/strain/strain-hier-comp.png"),
  "hier-asc":   assetUrl("art/strain/strain-hier-asc.png"),
  "dream-frag": assetUrl("art/strain/strain-dream-frag.png"),
  "dream-comp": assetUrl("art/strain/strain-dream-comp.png"),
  "dream-asc":  assetUrl("art/strain/strain-dream-asc.png"),
  "scar-frag":  assetUrl("art/strain/strain-scar-frag.png"),
  "scar-comp":  assetUrl("art/strain/strain-scar-comp.png"),
  "scar-asc":   assetUrl("art/strain/strain-scar-asc.png"),
};

/** Get STRAIN art by alignment and stage (same pattern as eidolons) */
export function getStrainArt(alignment: Alignment, stage: Stage): string {
  return assetUrl(`art/strain/strain-${alignment}-${stage}.png`);
}

/* ─── SPECTRAL FORMS (13) ─── */
export const SPECTRAL_ART: Record<string, string> = {
  auros:   assetUrl("art/spectral/spectral-auros.png"),
  nyx:     assetUrl("art/spectral/spectral-nyx.png"),
  cog:     assetUrl("art/spectral/spectral-cog.png"),
  sibyl:   assetUrl("art/spectral/spectral-sibyl.png"),
  toxis:   assetUrl("art/spectral/spectral-toxis.png"),
  lux:     assetUrl("art/spectral/spectral-lux.png"),
  echo:    assetUrl("art/spectral/spectral-echo.png"),
  glyph:   assetUrl("art/spectral/spectral-glyph.png"),
  cipher:  assetUrl("art/spectral/spectral-cipher.png"),
  flicker: assetUrl("art/spectral/spectral-flicker.png"),
  gilt:    assetUrl("art/spectral/spectral-gilt.png"),
  spore:   assetUrl("art/spectral/spectral-spore.png"),
  strain:  assetUrl("art/spectral/spectral-strain.png"),
};

/* ─── DISCHORDIAN COMPANIONS (3) ─── */
export const DISCHORDIAN_COMPANION_ART = {
  firstWord: assetUrl("art/specimens/dischordian-first-word.png"),
  paradox:   assetUrl("art/specimens/dischordian-paradox.png"),
  witness:   assetUrl("art/specimens/dischordian-witness.png"),
} as const;

/* ─── ROOMS (3) ─── */
export const ROOM_ART = {
  memorial:     assetUrl("art/rooms/room-memorial-chamber.png"),
  purification: assetUrl("art/rooms/room-purification-chamber.png"),
  summoning:    assetUrl("art/rooms/room-summoning-chamber.png"),
} as const;

/* ─── VFX (18) — Fusion (12) + Thread (6) ─── */
export const VFX_FUSION_ART: Record<string, string> = {
  auros:   assetUrl("art/vfx/vfx-fusion-auros.png"),
  nyx:     assetUrl("art/vfx/vfx-fusion-nyx.png"),
  cog:     assetUrl("art/vfx/vfx-fusion-cog.png"),
  sibyl:   assetUrl("art/vfx/vfx-fusion-sibyl.png"),
  toxis:   assetUrl("art/vfx/vfx-fusion-toxis.png"),
  lux:     assetUrl("art/vfx/vfx-fusion-lux.png"),
  echo:    assetUrl("art/vfx/vfx-fusion-echo.png"),
  glyph:   assetUrl("art/vfx/vfx-fusion-glyph.png"),
  cipher:  assetUrl("art/vfx/vfx-fusion-cipher.png"),
  flicker: assetUrl("art/vfx/vfx-fusion-flicker.png"),
  gilt:    assetUrl("art/vfx/vfx-fusion-gilt.png"),
  strain:  assetUrl("art/vfx/vfx-fusion-strain.png"),
};

export const VFX_THREAD_ART: Record<string, string> = {
  lux:     assetUrl("art/vfx/vfx-thread-lux.png"),
  echo:    assetUrl("art/vfx/vfx-thread-echo.png"),
  glyph:   assetUrl("art/vfx/vfx-thread-glyph.png"),
  cipher:  assetUrl("art/vfx/vfx-thread-cipher.png"),
  flicker: assetUrl("art/vfx/vfx-thread-flicker.png"),
  gilt:    assetUrl("art/vfx/vfx-thread-gilt.png"),
};

/* ─── MANIFEST ─── */
export const NANOBANNA2_MANIFEST = {
  soulStones:    { count: 3,  dir: assetUrl("art/soul-stones/") },
  eidolons:      { count: 60, dir: assetUrl("art/eidolons/") },
  strain:        { count: 12, dir: assetUrl("art/strain/") },
  spectral:      { count: 13, dir: assetUrl("art/spectral/") },
  companions:    { count: 3,  dir: assetUrl("art/specimens/") },
  rooms:         { count: 3,  dir: assetUrl("art/rooms/") },
  vfxFusion:     { count: 12, dir: assetUrl("art/vfx/") },
  vfxThread:     { count: 6,  dir: assetUrl("art/vfx/") },
  total: 112,
} as const;
