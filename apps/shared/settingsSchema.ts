import { z } from "zod";

export const settingsSchema = z.object({
  // Accessibility
  highContrast: z.boolean().default(false),
  reduceMotion: z.boolean().default(false),
  dyslexiaFont: z.boolean().default(false),
  reduceGlow: z.boolean().default(false),

  // Motion & FX — fine-grained control on top of reduceMotion.
  // motionIntensity multiplies ambient-motion amplitude (parallax offsets,
  // drift shaders, particle drift). 0 = fully still; 1 = full Void Energy.
  // reduceMotion forces this to 0 regardless of slider value.
  motionIntensity: z.number().min(0).max(1).default(1),
  // Toggle for audio-reactive UI (logo glow pulses, vitals sync, visualizers).
  // Off by default for the first boot so players opt in after hearing the music.
  audioReactive: z.boolean().default(true),

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
