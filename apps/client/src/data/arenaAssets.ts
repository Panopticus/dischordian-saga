import { assetUrl } from "@/lib/assetUrl";
/* ═══════════════════════════════════════════════════════
   ARENA ASSETS — Local Arena Backgrounds (8)

   Local copies of the fighting game arena backgrounds.
   The fighting engine in gameData.ts currently uses
   Cloudinary CDN URLs for arena backgrounds — these
   local files serve as offline-capable fallbacks and
   can replace the CDN URLs when ready.

   Source: s3://dgrsart/arena_backgrounds.zip
   ═══════════════════════════════════════════════════════ */

export const ARENA_BACKGROUNDS = {
  mechronis:    { src: assetUrl("art/arenas/arena-mechronis.jpg"),       name: "Mechronis",          floorColor: "#1a1a2e", ambientColor: "#6366f1" },
  newBabylon:   { src: assetUrl("art/arenas/arena-new-babylon.jpg"),     name: "New Babylon",        floorColor: "#1a0a2e", ambientColor: "#a855f7" },
  panopticon:   { src: assetUrl("art/arenas/arena-panopticon.jpg"),      name: "The Panopticon",     floorColor: "#0a1a1a", ambientColor: "#22d3ee" },
  shadowSanctum:{ src: assetUrl("art/arenas/arena-shadow-sanctum.jpg"),  name: "Shadow Sanctum",     floorColor: "#1a0033", ambientColor: "#7c3aed" },
  terminus:     { src: assetUrl("art/arenas/arena-terminus.jpg"),        name: "Terminus",           floorColor: "#1a0a0a", ambientColor: "#ef4444" },
  thaloria:     { src: assetUrl("art/arenas/arena-thaloria.jpg"),        name: "Thaloria",           floorColor: "#0a1a0a", ambientColor: "#22c55e" },
  theBloodWeave:{ src: assetUrl("art/arenas/arena-the-blood-weave.jpg"), name: "The Blood Weave",    floorColor: "#2d0000", ambientColor: "#dc2626" },
  theCrucible:  { src: assetUrl("art/arenas/arena-the-crucible.jpg"),    name: "The Crucible",       floorColor: "#431407", ambientColor: "#f97316" },
} as const;

export const ARENA_ASSET_MANIFEST = {
  backgrounds: { count: 8, format: "1920×1080 JPG", dir: assetUrl("art/arenas/") },
  total: 8,
} as const;
