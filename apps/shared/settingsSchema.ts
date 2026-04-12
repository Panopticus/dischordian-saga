import { z } from "zod";

export const settingsSchema = z.object({
  // Accessibility
  highContrast: z.boolean().default(false),
  reduceMotion: z.boolean().default(false),
  dyslexiaFont: z.boolean().default(false),
  reduceGlow: z.boolean().default(false),

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
