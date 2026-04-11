/* ═══════════════════════════════════════════════════════
   PAGE BACKGROUNDS — Environmental art for game pages
   ═══════════════════════════════════════════════════════ */

const S3 = "https://dgrsart.s3.us-east-2.amazonaws.com/page-backgrounds";

export const PAGE_BACKGROUNDS: Record<string, { url: string; accent: string; name: string }> = {
  marketplace:      { url: `${S3}/MKT-001_marketplace.jpg`, accent: "#f59e0b", name: "The Trading Floor" },
  guild:            { url: `${S3}/GLD-001_guild-hall.jpg`, accent: "#dc2626", name: "The Guild Hall" },
  inventory:        { url: `${S3}/INV-001_cargo-hold.jpg`, accent: "#f97316", name: "The Cargo Hold" },
  quests:           { url: `${S3}/QST-001_mission-briefing.jpg`, accent: "#ef4444", name: "Mission Briefing" },
  companions:       { url: `${S3}/CMP-001_companion-quarters.jpg`, accent: "#8b5cf6", name: "Companion Quarters" },
  "battle-pass":    { url: `${S3}/BTP-001_season-command.jpg`, accent: "#fbbf24", name: "Season Command" },
  diplomacy:        { url: `${S3}/DPL-001_negotiation-chamber.jpg`, accent: "#3b82f6", name: "Negotiation Chamber" },
  "character-sheet":{ url: `${S3}/CHR-001_operative-dossier.jpg`, accent: "#33E2E6", name: "Operative Dossier" },
  achievements:     { url: `${S3}/ACH-001_achievement-vault.jpg`, accent: "#fbbf24", name: "Achievement Vault" },
  store:            { url: `${S3}/STR-001_requisition-terminal.jpg`, accent: "#f59e0b", name: "Requisition Terminal" },
  codex:            { url: `${S3}/CDX-001_archive-room.jpg`, accent: "#8b5cf6", name: "The Archives" },
  settings:         { url: `${S3}/SET-001_system-terminal.jpg`, accent: "#22c55e", name: "System Terminal" },
};

export function getPageBackground(path: string): { url: string; accent: string } | null {
  const key = path.replace(/^\//, "").split("/")[0];
  return PAGE_BACKGROUNDS[key] || null;
}
