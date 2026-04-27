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

  // Keyboard remap — logical-action → KeyboardEvent.code mapping. Each
  // entry is independently editable from the Settings UI (Accessibility
  // section). Consumers read the live map via apps/client/src/hooks/
  // useKeymap.ts which subscribes to localStorage updates.
  //
  // Defaults reflect the keys the codebase currently hardcodes — adding
  // remap support is purely additive: components that haven't been
  // migrated to useKeymap continue to react to the original key.
  keymap: z
    .object({
      // Cancel / dismiss — modal close, dialog dismiss, escape from
      // overlays. Consumers should also accept `Escape` as an
      // always-on fallback so players who clear their keymap aren't
      // stranded.
      cancel: z.string().default("Escape"),
      // Confirm / advance — primary "next" action in cutscenes,
      // dialog wheels, etc.
      confirm: z.string().default("Enter"),
      // Skip current cutscene / typewriter / VO line.
      skipCutscene: z.string().default("Space"),
      // Open / close the settings panel.
      openSettings: z.string().default("KeyS"),
      // Open / close the codex panel.
      openCodex: z.string().default("KeyC"),
      // Toggle the companion chat panel.
      toggleCompanionChat: z.string().default("KeyT"),
    })
    // The inner fields each carry their own .default(); this outer
    // default just covers the case where the entire keymap key is
    // absent from a saved settings blob (older saves, partial imports).
    .default({
      cancel: "Escape",
      confirm: "Enter",
      skipCutscene: "Space",
      openSettings: "KeyS",
      openCodex: "KeyC",
      toggleCompanionChat: "KeyT",
    }),

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
});

export type GameSettings = z.infer<typeof settingsSchema>;
export const DEFAULT_SETTINGS: GameSettings = settingsSchema.parse({});
