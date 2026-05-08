import { assetUrl } from "@/lib/assetUrl";
/* ═══════════════════════════════════════════════════════
   OPTIONAL COMPONENT ASSETS — Drop-in art asset map
   
   All 34 assets from the Optional Components Art Bible.
   Images are served from /art/ subdirectories. When an
   image file is placed at the expected path, it renders
   automatically. Components fall back to icons/placeholders
   when the image is missing.

   Asset source: s3://dgrsart/optional_components_assets.zip
   Art Bible: docs/archive/2026-05-08-superseded/OPTIONAL_COMPONENTS_ART_BIBLE.md
   ═══════════════════════════════════════════════════════ */

/* ─── SECTION 1: Empty State Illustrations (13) ─── */

export const EMPTY_STATE_ASSETS = {
  questLog:       assetUrl("art/empty-states/empty-quest-log.png"),
  inventory:      assetUrl("art/empty-states/empty-inventory.png"),
  cardCollection: assetUrl("art/empty-states/empty-card-collection.png"),
  loreJournal:    assetUrl("art/empty-states/empty-lore-journal.png"),
  guildHall:      assetUrl("art/empty-states/empty-guild-hall.png"),
  petCollection:  assetUrl("art/empty-states/empty-pet-collection.png"),
  matchHistory:   assetUrl("art/empty-states/empty-match-history.png"),
  notifications:  assetUrl("art/empty-states/empty-notifications.png"),
  companions:     assetUrl("art/empty-states/empty-companions.png"),
  achievements:   assetUrl("art/empty-states/empty-achievements.png"),
  tradeHistory:   assetUrl("art/empty-states/empty-trade-history.png"),
  apprentices:    assetUrl("art/empty-states/empty-apprentices.png"),
  leaderboard:    assetUrl("art/empty-states/empty-leaderboard.png"),
} as const;

/* ─── SECTION 2: Seasonal Replay Broadcast (8) ─── */

export const BROADCAST_FRAME = assetUrl("art/seasonal/broadcast-frame.png");

export const SEASONAL_EVENT_BACKGROUNDS: Record<string, { src: string; title: string }> = {
  shadow_convergence:      { src: assetUrl("art/seasonal/event-shadow-convergence.jpg"),      title: "Shadow Convergence" },
  chrono_harvest:          { src: assetUrl("art/seasonal/event-chrono-harvest.jpg"),           title: "Chrono Harvest" },
  forge_of_nations:        { src: assetUrl("art/seasonal/event-forge-of-nations.jpg"),         title: "Forge of Nations" },
  panopticon_infiltration: { src: assetUrl("art/seasonal/event-panopticon-infiltration.jpg"),  title: "Panopticon Infiltration" },
  lore_symposium:          { src: assetUrl("art/seasonal/event-lore-symposium.jpg"),           title: "Lore Symposium" },
  guild_war_tournament:    { src: assetUrl("art/seasonal/event-guild-war-tournament.jpg"),     title: "Guild War Tournament" },
  fall_of_reality:         { src: assetUrl("art/seasonal/event-fall-of-reality.jpg"),          title: "Fall of Reality" },
};

/* ─── SECTION 3: Content Roadmap (4) ─── */

export const SEASON_BANNERS = {
  current: { src: assetUrl("art/roadmap/season-echoes-of-the-architect.jpg"), title: "Echoes of the Architect" },
  next:    { src: assetUrl("art/roadmap/season-warlords-return.jpg"),         title: "The Warlord's Return" },
} as const;

export const FACTION_ICONS = {
  architect: assetUrl("art/roadmap/faction-architect-seal.png"),
  warlord:   assetUrl("art/roadmap/faction-warlord-crest.png"),
} as const;

/* ─── SECTION 4: Story Progress Icons (9) ─── */

export const CHAPTER_ICONS: Record<number, { src: string; title: string }> = {
  1: { src: assetUrl("art/story-icons/ch1-awakening.png"),      title: "Awakening" },
  2: { src: assetUrl("art/story-icons/ch2-first-contact.png"),   title: "First Contact" },
  3: { src: assetUrl("art/story-icons/ch3-the-infection.png"),    title: "The Infection" },
  4: { src: assetUrl("art/story-icons/ch4-breaking-point.png"),   title: "Breaking Point" },
  5: { src: assetUrl("art/story-icons/ch5-war.png"),              title: "War" },
  6: { src: assetUrl("art/story-icons/ch6-resolution.png"),       title: "Resolution" },
};

export const EPOCH_SYMBOLS: Record<string, { src: string; title: string }> = {
  age_of_privacy:   { src: assetUrl("art/story-icons/epoch-age-of-privacy.png"),   title: "Age of Privacy" },
  fall_of_reality:  { src: assetUrl("art/story-icons/epoch-fall-of-reality.png"),  title: "Fall of Reality" },
  dischordian_war:  { src: assetUrl("art/story-icons/epoch-dischordian-war.png"),  title: "Dischordian War" },
};

/* ─── SECTION 5: Lore Gallery Hi-Res Variants (6) ─── */

export const LORE_GALLERY_HIRES = {
  cardFrames: {
    common:    assetUrl("art/lore-gallery/card-frames/common-hires.png"),
    uncommon:  assetUrl("art/lore-gallery/card-frames/uncommon-hires.png"),
    rare:      assetUrl("art/lore-gallery/card-frames/rare-hires.png"),
    epic:      assetUrl("art/lore-gallery/card-frames/epic-hires.png"),
    legendary: assetUrl("art/lore-gallery/card-frames/legendary-hires.png"),
  },
  overlays: {
    lockedClassified: assetUrl("art/lore-gallery/overlays/locked-classified-hires.png"),
  },
} as const;

/* ─── ASSET MANIFEST ─── */

export const OPTIONAL_ASSET_MANIFEST = {
  emptyStates:    { count: 13, format: "512×512 PNG transparent", dir: assetUrl("art/empty-states/") },
  broadcastFrame: { count: 1,  format: "1920×1080 PNG transparent", dir: assetUrl("art/seasonal/") },
  eventBgs:       { count: 7,  format: "1920×1080 JPG", dir: assetUrl("art/seasonal/") },
  seasonBanners:  { count: 2,  format: "1920×400 JPG", dir: assetUrl("art/roadmap/") },
  factionIcons:   { count: 2,  format: "256×256 PNG transparent", dir: assetUrl("art/roadmap/") },
  chapterIcons:   { count: 6,  format: "128×128 PNG transparent", dir: assetUrl("art/story-icons/") },
  epochSymbols:   { count: 3,  format: "128×128 PNG transparent", dir: assetUrl("art/story-icons/") },
  loreGalleryHires: { count: 6, format: "PNG transparent", dir: assetUrl("art/lore-gallery/") },
  total: 40,
} as const;
