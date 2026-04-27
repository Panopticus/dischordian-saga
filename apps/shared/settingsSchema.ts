import { z } from "zod";

export const settingsSchema = z.object({
  // Accessibility
  highContrast: z.boolean().default(false),
  reduceMotion: z.boolean().default(false),
  dyslexiaFont: z.boolean().default(false),
  reduceGlow: z.boolean().default(false),
  // Colorblind palette presets — remap the five energy/faction tokens
  // (--energy-primary / -accent / -success / -error / -system) to a
  // palette that stays distinguishable under each common CVD type.
  // Off = the canonical Void Energy palette ships unchanged. The
  // overrides are derived from the Okabe-Ito colorblind-safe palette
  // (Bang Wong, Nature Methods 2011) — distinct under both red-green
  // and blue-yellow vision losses.
  colorblindMode: z
    .enum(["off", "deuteranopia", "protanopia", "tritanopia"])
    .default("off"),

  // Motion & FX — fine-grained control on top of reduceMotion.
  // motionIntensity multiplies ambient-motion amplitude (parallax offsets,
  // drift shaders, particle drift). 0 = fully still; 1 = full Void Energy.
  // reduceMotion forces this to 0 regardless of slider value.
  motionIntensity: z.number().min(0).max(1).default(1),
  // Toggle for audio-reactive UI (logo glow pulses, vitals sync, visualizers).
  // Off by default for the first boot so players opt in after hearing the music.
  audioReactive: z.boolean().default(true),
  // Captions — when on, VO-driven dialog surfaces (Awakening, cutscenes,
  // NPC reveals) render a speaker-label prefix and sound cues inline with
  // the existing typewriter so players who can't hear the VO still get
  // the full narrative context.
  captions: z.boolean().default(false),
  // Typewriter pacing, in milliseconds per character. Consumers read this
  // via the `--typewriter-speed-ms` custom property (set by settingsSync).
  // Lower = faster reveal; 0 = instant (good for speed-readers).
  typewriterSpeed: z.number().min(0).max(80).default(25),

  // Display
  fontSize: z.enum(["small", "medium", "large"]).default("medium"),
  theme: z.enum(["dark", "light"]).default("dark"),
  arkTheme: z.string().optional(),

  // Audio
  masterVolume: z.number().min(0).max(1).default(0.8),
  musicVolume: z.number().min(0).max(1).default(0.6),
  sfxVolume: z.number().min(0).max(1).default(0.8),
  ambientEnabled: z.boolean().default(true),

  // Game
  skipTutorials: z.boolean().default(false),
  showHints: z.boolean().default(true),
  difficulty: z.enum(["casual", "standard", "hardcore"]).default("standard"),

  // Haptics
  hapticsEnabled: z.boolean().default(true),

  // Privacy
  analyticsEnabled: z.boolean().default(true),

  // Localization (#144) — the player-selected UI locale. Defaults to
  // "en" so the first boot is always the canonical English copy.
  // The settings UI persists the choice via settingsSync; the i18n
  // bootstrap reads this on app start and calls i18n.changeLanguage.
  // Validated against the same SUPPORTED_LOCALES list i18n/config.ts
  // ships in `LANGUAGES`, but typed loosely here so a future locale
  // added to that list doesn't require a schema migration. Unknown
  // values fall through to "en" at runtime via i18next's fallbackLng.
  locale: z.string().default("en"),
});

export type GameSettings = z.infer<typeof settingsSchema>;
export const DEFAULT_SETTINGS: GameSettings = settingsSchema.parse({});
