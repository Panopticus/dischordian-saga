/* ═══════════════════════════════════════════════════════
   NANOBANNA2 ART ASSETS — 112 Images
   Soul Stones, Eidolons, STRAIN, Spectral Forms,
   Dischordian Companions, Rooms, VFX
   
   Source: s3://dgrsart/NanoBanna2_Art_Assets_112.zip
   Bible: docs/production/COMPLETE_ART_PROMPT_BIBLE.md
   ═══════════════════════════════════════════════════════ */

/* ─── SOUL STONES (3) ─── */
export const SOUL_STONE_ART = {
  violet: "/art/soul-stones/soul-stone-violet.png",
  red:    "/art/soul-stones/soul-stone-red.png",
  gold:   "/art/soul-stones/soul-stone-gold.png",
} as const;

/* ─── EIDOLONS (60) — 5 classes × 4 alignments × 3 stages ─── */
type Alignment = "norm" | "hier" | "dream" | "scar";
type Stage = "frag" | "comp" | "asc";

function eidolonPath(cls: string, align: Alignment, stage: Stage): string {
  return `/art/eidolons/${cls}/${cls}-${align}-${stage}.png`;
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

/* ─── STRAIN (12) ─── */
export const STRAIN_ART: Record<string, string> = {
  auros:   "/art/strain/strain-auros.png",
  nyx:     "/art/strain/strain-nyx.png",
  cog:     "/art/strain/strain-cog.png",
  sibyl:   "/art/strain/strain-sibyl.png",
  toxis:   "/art/strain/strain-toxis.png",
  lux:     "/art/strain/strain-lux.png",
  echo:    "/art/strain/strain-echo.png",
  glyph:   "/art/strain/strain-glyph.png",
  cipher:  "/art/strain/strain-cipher.png",
  flicker: "/art/strain/strain-flicker.png",
  gilt:    "/art/strain/strain-gilt.png",
  spore:   "/art/strain/strain-spore.png",
};

/* ─── SPECTRAL FORMS (13) ─── */
export const SPECTRAL_ART: Record<string, string> = {
  auros:   "/art/spectral/spectral-auros.png",
  nyx:     "/art/spectral/spectral-nyx.png",
  cog:     "/art/spectral/spectral-cog.png",
  sibyl:   "/art/spectral/spectral-sibyl.png",
  toxis:   "/art/spectral/spectral-toxis.png",
  lux:     "/art/spectral/spectral-lux.png",
  echo:    "/art/spectral/spectral-echo.png",
  glyph:   "/art/spectral/spectral-glyph.png",
  cipher:  "/art/spectral/spectral-cipher.png",
  flicker: "/art/spectral/spectral-flicker.png",
  gilt:    "/art/spectral/spectral-gilt.png",
  spore:   "/art/spectral/spectral-spore.png",
  strain:  "/art/spectral/spectral-strain.png",
};

/* ─── DISCHORDIAN COMPANIONS (3) ─── */
export const DISCHORDIAN_COMPANION_ART = {
  firstWord: "/art/specimens/dischordian-first-word.png",
  paradox:   "/art/specimens/dischordian-paradox.png",
  witness:   "/art/specimens/dischordian-witness.png",
} as const;

/* ─── ROOMS (3) ─── */
export const ROOM_ART = {
  memorial:     "/art/rooms/room-memorial-chamber.png",
  purification: "/art/rooms/room-purification-chamber.png",
  summoning:    "/art/rooms/room-summoning-chamber.png",
} as const;

/* ─── VFX (18) — Fusion (12) + Thread (6) ─── */
export const VFX_FUSION_ART: Record<string, string> = {
  auros:   "/art/vfx/vfx-fusion-auros.png",
  nyx:     "/art/vfx/vfx-fusion-nyx.png",
  cog:     "/art/vfx/vfx-fusion-cog.png",
  sibyl:   "/art/vfx/vfx-fusion-sibyl.png",
  toxis:   "/art/vfx/vfx-fusion-toxis.png",
  lux:     "/art/vfx/vfx-fusion-lux.png",
  echo:    "/art/vfx/vfx-fusion-echo.png",
  glyph:   "/art/vfx/vfx-fusion-glyph.png",
  cipher:  "/art/vfx/vfx-fusion-cipher.png",
  flicker: "/art/vfx/vfx-fusion-flicker.png",
  gilt:    "/art/vfx/vfx-fusion-gilt.png",
  strain:  "/art/vfx/vfx-fusion-strain.png",
};

export const VFX_THREAD_ART: Record<string, string> = {
  lux:     "/art/vfx/vfx-thread-lux.png",
  echo:    "/art/vfx/vfx-thread-echo.png",
  glyph:   "/art/vfx/vfx-thread-glyph.png",
  cipher:  "/art/vfx/vfx-thread-cipher.png",
  flicker: "/art/vfx/vfx-thread-flicker.png",
  gilt:    "/art/vfx/vfx-thread-gilt.png",
};

/* ─── MANIFEST ─── */
export const NANOBANNA2_MANIFEST = {
  soulStones:    { count: 3,  dir: "/art/soul-stones/" },
  eidolons:      { count: 60, dir: "/art/eidolons/" },
  strain:        { count: 12, dir: "/art/strain/" },
  spectral:      { count: 13, dir: "/art/spectral/" },
  companions:    { count: 3,  dir: "/art/specimens/" },
  rooms:         { count: 3,  dir: "/art/rooms/" },
  vfxFusion:     { count: 12, dir: "/art/vfx/" },
  vfxThread:     { count: 6,  dir: "/art/vfx/" },
  total: 112,
} as const;
