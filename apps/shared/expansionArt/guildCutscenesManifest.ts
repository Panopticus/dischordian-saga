/* ═══════════════════════════════════════════════════════
   GUILD CUTSCENES MANIFEST — typed registry for the
   producer-delivered guild-cutscene visual drop.

   Source: producer drop DischordianSaga_GuildCutscenes_Complete.zip
   (2026-05-01, 175 assets, 774 MB). Files served from:
     videos/ → cdn/client-public/videos/guild-cutscenes/<category>/
     art/    → cdn/client-public/art/guild-cutscenes/<category>/

   The registry's `id` strings match the `cs_id` values referenced in
   apps/scripts/guild-cutscene-vo-lines.json's `context` field, so
   pairing a VO line with its cinematic at runtime is mechanical.

   Categories mirror the bundle directory layout:
     f1_onboarding · f2_daily · f2_emotes · f3_combat · f4_abilities · f5_guild_hall
   ═══════════════════════════════════════════════════════ */

import { assetUrl } from "../../client/src/lib/assetUrl";
import { makeAssetManifest } from "./_assetManifest";

export type GuildCutsceneCategory =
  | "f1_onboarding"
  | "f2_daily"
  | "f2_emotes"
  | "f3_combat"
  | "f4_abilities"
  | "f5_guild_hall";

/** F.4 signature abilities have a light (sanctioned) and dark
 *  (corruption) variant; both share the same cs_sig_N number but
 *  ship as separate stills + videos. */
export type GuildCutsceneVariant = "light" | "dark";

export interface GuildCutsceneDef {
  /** Matches cs_id in the lines-file context (e.g. "cs_war_declared",
   *  "cs_sig_1_light"). For F.4 abilities the variant is suffixed. */
  id: string;
  category: GuildCutsceneCategory;
  /** 4–8s MP4 clip. F.2.4 emotes have no video (sticker only). The
   *  five F.3 epoch cutscenes share the unified cs_epoch_change.mp4. */
  videoRelPath?: string;
  /** Beat-ordered stills. Most cutscenes have 2 (start/end); the
   *  F.1 sorting_ceremony has 4 (pre_start, pre_end, post_start,
   *  post_end). F.2.4 emotes have 1 (the anchor-frame sticker). */
  stillRelPaths: readonly string[];
  /** F.2.4 emotes ship a polished + producer-original variant; this
   *  field carries the original. */
  originalStillRelPath?: string;
  /** F.4 only. */
  variant?: GuildCutsceneVariant;
  /** F.4 only — matches the speaker key in guild-cutscene-vo-lines.json
   *  (kanevas | aoki | halverez | orphic | mireille | kasra | vellis |
   *  greenshaw | vex | vasara | vent | proctor). */
  professorId?: string;
  /** F.2.4 only — archetype slug in the bundle filename
   *  (chorus | eyes | archive | between | influencers | yellowcoats |
   *  congress | locks | greygamers | living | forge | architects_study). */
  archonId?: string;
}

/* ─── F.4 signature ability casting table ─── */
/* Drives the 24 cs_sig_N_{light,dark} entries below. Order matches
 * the Production Bible's Mechronis Professor sequence and the F.4
 * ordering in guild-cutscene-vo-lines.json. */
const SIG_PROFESSORS: ReadonlyArray<{
  n: number;
  professorId: string;
  abilityLight: string;
  abilityDark: string;
}> = [
  { n: 1, professorId: "kanevas", abilityLight: "Harmonize", abilityDark: "Dissonance" },
  { n: 2, professorId: "aoki", abilityLight: "Unseen Passage", abilityDark: "Private Confession" },
  { n: 3, professorId: "halverez", abilityLight: "Soul-Read", abilityDark: "Soul-Take" },
  { n: 4, professorId: "orphic", abilityLight: "Phase-Step", abilityDark: "Dimensional Drift" },
  { n: 5, professorId: "mireille", abilityLight: "Viral Word", abilityDark: "Thought Carry" },
  { n: 6, professorId: "kasra", abilityLight: "Parade Order", abilityDark: "Acceptable Casualties" },
  { n: 7, professorId: "vellis", abilityLight: "Verbal Contract", abilityDark: "Blood Oath" },
  { n: 8, professorId: "greenshaw", abilityLight: "Quarantine", abilityDark: "Thought Virus" },
  { n: 9, professorId: "vex", abilityLight: "Rule Rewrite", abilityDark: "House Rules" },
  { n: 10, professorId: "vasara", abilityLight: "Second Breath", abilityDark: "Borrowed Time" },
  { n: 11, professorId: "vent", abilityLight: "Field Repair", abilityDark: "Salvage Rights" },
  { n: 12, professorId: "proctor", abilityLight: "Investigator's Sight", abilityDark: "Architect's Eye" },
];

/* ─── F.2.4 archon emote table (anchor stickers, 512×512) ─── */
const EMOTE_ARCHONS: ReadonlyArray<{ n: number; archonId: string }> = [
  { n: 1, archonId: "chorus" },
  { n: 2, archonId: "eyes" },
  { n: 3, archonId: "archive" },
  { n: 4, archonId: "between" },
  { n: 5, archonId: "influencers" },
  { n: 6, archonId: "yellowcoats" },
  { n: 7, archonId: "congress" },
  { n: 8, archonId: "locks" },
  { n: 9, archonId: "greygamers" },
  { n: 10, archonId: "living" },
  { n: 11, archonId: "forge" },
  { n: 12, archonId: "architects_study" },
];

/* ─── Path helpers ─── */
const stillPath = (cat: GuildCutsceneCategory, file: string) =>
  `art/guild-cutscenes/${cat}/${file}`;
const videoPath = (cat: GuildCutsceneCategory, file: string) =>
  `videos/guild-cutscenes/${cat}/${file}`;

/* ─── F.1 Onboarding (4 cutscenes) ─── */
const F1_ONBOARDING: readonly GuildCutsceneDef[] = [
  {
    id: "cs_guild_join",
    category: "f1_onboarding",
    videoRelPath: videoPath("f1_onboarding", "cs_guild_join.mp4"),
    stillRelPaths: [
      stillPath("f1_onboarding", "cs_guild_join_start.png"),
      stillPath("f1_onboarding", "cs_guild_join_end.png"),
    ],
  },
  {
    id: "cs_guild_first_message",
    category: "f1_onboarding",
    videoRelPath: videoPath("f1_onboarding", "cs_guild_first_message.mp4"),
    stillRelPaths: [
      stillPath("f1_onboarding", "cs_guild_first_message_start.png"),
      stillPath("f1_onboarding", "cs_guild_first_message_end.png"),
    ],
  },
  {
    id: "cs_friend_accept",
    category: "f1_onboarding",
    videoRelPath: videoPath("f1_onboarding", "cs_friend_accept.mp4"),
    stillRelPaths: [
      stillPath("f1_onboarding", "cs_friend_accept_start.png"),
      stillPath("f1_onboarding", "cs_friend_accept_end.png"),
    ],
  },
  {
    id: "cs_sorting_ceremony",
    category: "f1_onboarding",
    videoRelPath: videoPath("f1_onboarding", "cs_sorting_ceremony.mp4"),
    stillRelPaths: [
      stillPath("f1_onboarding", "cs_sorting_ceremony_pre_start.png"),
      stillPath("f1_onboarding", "cs_sorting_ceremony_pre_end.png"),
      stillPath("f1_onboarding", "cs_sorting_ceremony_post_start.png"),
      stillPath("f1_onboarding", "cs_sorting_ceremony_post_end.png"),
    ],
  },
];

/* ─── F.2 Daily / Weekly (4 cutscenes) ─── */
const F2_DAILY: readonly GuildCutsceneDef[] = (
  ["cs_contract_unlock", "cs_contract_complete", "cs_house_cup_weekly_reset", "cs_donation_milestone"] as const
).map((id) => ({
  id,
  category: "f2_daily" as const,
  videoRelPath: videoPath("f2_daily", `${id}.mp4`),
  stillRelPaths: [
    stillPath("f2_daily", `${id}_start.png`),
    stillPath("f2_daily", `${id}_end.png`),
  ],
}));

/* ─── F.2.4 Emotes (12 anchor stickers, no video) ─── */
const F2_EMOTES: readonly GuildCutsceneDef[] = EMOTE_ARCHONS.map(({ n, archonId }) => {
  const nn = String(n).padStart(2, "0");
  const baseFile = `cs_emote_archon_${nn}_${archonId}`;
  return {
    id: `cs_emote_archon_${n}`,
    category: "f2_emotes" as const,
    archonId,
    stillRelPaths: [stillPath("f2_emotes", `${baseFile}.png`)],
    originalStillRelPath: stillPath("f2_emotes", `${baseFile}_original.png`),
  };
});

/* ─── F.3 Combat & War (12 cutscenes; 8 unique videos) ─── */
/* The five epoch cutscenes share cs_epoch_change.mp4 — the bundle ships
 * one video for the whole epoch transition and per-epoch start/end stills
 * for chyron / overlay use. */
const F3_EPOCHS = ["privacy", "prophecy", "insurgency", "revelation", "fall"] as const;
const F3_COMBAT_NON_EPOCH = [
  "cs_war_declared",
  "cs_war_first_blood",
  "cs_war_mvp",
  "cs_war_victory",
  "cs_war_defeat",
  "cs_placement_lock",
  "cs_thought_virus",
] as const;
const F3_COMBAT: readonly GuildCutsceneDef[] = [
  ...F3_COMBAT_NON_EPOCH.map((id) => ({
    id,
    category: "f3_combat" as const,
    videoRelPath: videoPath("f3_combat", `${id}.mp4`),
    stillRelPaths: [
      stillPath("f3_combat", `${id}_start.png`),
      stillPath("f3_combat", `${id}_end.png`),
    ],
  })),
  ...F3_EPOCHS.map((epoch) => ({
    id: `cs_epoch_${epoch}`,
    category: "f3_combat" as const,
    videoRelPath: videoPath("f3_combat", "cs_epoch_change.mp4"),
    stillRelPaths: [
      stillPath("f3_combat", `cs_epoch_${epoch}_start.png`),
      stillPath("f3_combat", `cs_epoch_${epoch}_end.png`),
    ],
  })),
];

/* ─── F.4 Signature Abilities (12 sigs × light/dark = 24 entries) ─── */
const F4_ABILITIES: readonly GuildCutsceneDef[] = SIG_PROFESSORS.flatMap(
  ({ n, professorId }) =>
    (["light", "dark"] as const).map<GuildCutsceneDef>((variant) => ({
      id: `cs_sig_${n}_${variant}`,
      category: "f4_abilities",
      variant,
      professorId,
      videoRelPath: videoPath("f4_abilities", `cs_sig_${n}_${variant}.mp4`),
      stillRelPaths: [
        stillPath("f4_abilities", `cs_sig_${n}_${variant}_start.png`),
        stillPath("f4_abilities", `cs_sig_${n}_${variant}_end.png`),
      ],
    })),
);

/* ─── F.5 Guild Hall (7 cutscenes) ─── */
const F5_GUILD_HALL: readonly GuildCutsceneDef[] = (
  [
    "cs_guild_tier_up",
    "cs_oracle_room_unlock",
    "cs_room_unlock",
    "cs_training_grounds",
    "cs_trophy_case",
    "cs_war_room_unlock",
    "cs_guild_decor",
  ] as const
).map((id) => ({
  id,
  category: "f5_guild_hall" as const,
  videoRelPath: videoPath("f5_guild_hall", `${id}.mp4`),
  stillRelPaths: [
    stillPath("f5_guild_hall", `${id}_start.png`),
    stillPath("f5_guild_hall", `${id}_end.png`),
  ],
}));

/* ─── Combined registry ─── */
export const GUILD_CUTSCENES: readonly GuildCutsceneDef[] = [
  ...F1_ONBOARDING,
  ...F2_DAILY,
  ...F2_EMOTES,
  ...F3_COMBAT,
  ...F4_ABILITIES,
  ...F5_GUILD_HALL,
];

const manifest = makeAssetManifest(GUILD_CUTSCENES, "id", "stillRelPaths");

/** Resolve `cs_id` → cinematic definition (or `undefined` if unknown). */
export const guildCutsceneById = (id: string): GuildCutsceneDef | undefined =>
  manifest.byId.get(id);

/** Resolve `cs_id` → MP4 video URL. Returns `undefined` for the
 *  videoless F.2.4 emotes or for unknown ids. */
export function guildCutsceneVideoUrl(id: string): string | undefined {
  const def = manifest.byId.get(id);
  return def?.videoRelPath ? assetUrl(def.videoRelPath) : undefined;
}

/** Resolve `cs_id` → ordered still URLs (start, end, …). */
export function guildCutsceneStillUrls(id: string): readonly string[] {
  const def = manifest.byId.get(id);
  return def ? def.stillRelPaths.map(assetUrl) : [];
}

/** Resolve `cs_id` (F.2.4 emote) → producer-original sticker URL. */
export function guildCutsceneEmoteOriginalUrl(id: string): string | undefined {
  const def = manifest.byId.get(id);
  return def?.originalStillRelPath ? assetUrl(def.originalStillRelPath) : undefined;
}

/** All cutscenes in a category (for batch preload, debug tooling). */
export const guildCutscenesByCategory = (cat: GuildCutsceneCategory) =>
  manifest.byField("category", cat);

/** F.4 helper: the 24 ability cutscenes for a given Professor (typically 2 — light + dark). */
export const guildCutscenesByProfessor = (professorId: string) =>
  manifest.byField("professorId", professorId);

export const GUILD_CUTSCENE_TOTAL = manifest.total;
