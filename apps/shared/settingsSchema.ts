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
  // M6 — quality preset for Three.js + Pixi.js render-cost knobs.
  //   "auto"   → resolved at runtime via detectQualityTier() +
  //              useIsMobile() (medium on mobile, high on desktop,
  //              low when the detector signals weak hardware).
  //   "low"    → Pixi resolution capped at 1, Three.js DPR 1, no
  //              shader composer chain, simpler particles.
  //   "medium" → Pixi 1.5×, Three.js DPR 1.5, shader composer
  //              with skipped passes, half-density particles.
  //   "high"   → Pixi up to 2×, Three.js DPR up to 2, full chain.
  // The "auto" default keeps existing behavior — players opt into a
  // fixed tier from settings if the auto detection isn't right.
  qualityPreference: z
    .enum(["auto", "low", "medium", "high"])
    .default("auto"),
  // Captions — when on, VO-driven dialog surfaces (Awakening, cutscenes,
  // NPC reveals) render a speaker-label prefix and sound cues inline with
  // the existing typewriter so players who can't hear the VO still get
  // the full narrative context.
  captions: z.boolean().default(false),
  // Caption text size. Multiplies the base caption font size via the
  // `--caption-scale` custom property (set in settingsSync). Sized
  // generously for streaming-quality readability — the largest preset
  // matches WCAG-AA recommendations for closed-caption presentation.
  captionSize: z.enum(["small", "medium", "large", "xlarge"]).default("medium"),
  // Typewriter pacing, in milliseconds per character. Consumers read this
  // via the `--typewriter-speed-ms` custom property (set by settingsSync).
  // Lower = faster reveal; 0 = instant (good for speed-readers).
  typewriterSpeed: z.number().min(0).max(80).default(25),

  // Display
  fontSize: z.enum(["small", "medium", "large"]).default("medium"),
  theme: z.enum(["dark", "light"]).default("dark"),
  arkTheme: z.string().optional(),
  // Immersive mode — when on, the first user gesture in a session
  // requests browser fullscreen and (on mobile) locks orientation to
  // landscape. Designed for the widescreen art direction; players who
  // prefer a windowed/portrait experience can disable this here.
  // Browsers require the request inside a user-activation handler, so
  // ImmersiveModeManager arms a one-shot pointer/keydown listener
  // rather than calling requestFullscreen on mount.
  immersiveMode: z.boolean().default(true),

  // Audio
  masterVolume: z.number().min(0).max(1).default(0.8),
  musicVolume: z.number().min(0).max(1).default(0.6),
  sfxVolume: z.number().min(0).max(1).default(0.8),
  ambientEnabled: z.boolean().default(true),
  // When true, the on-login Dischordian Logic transmission does NOT
  // pop the CRT modal. Instead, the next undelivered transmission is
  // silently routed to the player's INBOX tab in the Transmission Deck
  // where they can watch it on demand. The fictional Meme is hijacking
  // a frequency, so this is the player's volume control on his pirate
  // signal — not a daily-login dismissal. Default off; players opt in.
  muteLoginTransmissions: z.boolean().default(false),

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
