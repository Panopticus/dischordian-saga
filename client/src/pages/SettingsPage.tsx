/**
 * SettingsPage.tsx — Ship Configuration
 * 
 * Light/dark mode, Ark themes, accessibility tools, audio controls, game management.
 */
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useSound } from "@/contexts/SoundContext";
import { useGame } from "@/contexts/GameContext";
import { ARK_THEMES } from "@shared/gamification";
import {
  Settings, Sun, Moon, Palette, Eye, Volume2, VolumeX,
  Gamepad2, RotateCcw, Check, Lock, Monitor, Accessibility,
  Type, Contrast, Zap, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

/* ─── ACCESSIBILITY OPTIONS ─── */
interface A11ySettings {
  highContrast: boolean;
  reduceMotion: boolean;
  dyslexiaFont: boolean;
  largeText: boolean;
}

function getA11ySettings(): A11ySettings {
  try {
    const saved = localStorage.getItem("loredex-a11y");
    return saved ? JSON.parse(saved) : { highContrast: false, reduceMotion: false, dyslexiaFont: false, largeText: false };
  } catch { return { highContrast: false, reduceMotion: false, dyslexiaFont: false, largeText: false }; }
}

function saveA11ySettings(settings: A11ySettings) {
  localStorage.setItem("loredex-a11y", JSON.stringify(settings));
  // Apply to document
  document.documentElement.classList.toggle("high-contrast", settings.highContrast);
  document.documentElement.classList.toggle("reduce-motion", settings.reduceMotion);
  document.documentElement.classList.toggle("dyslexia-font", settings.dyslexiaFont);
  document.documentElement.classList.toggle("large-text", settings.largeText);
}

/* ─── SECTION COMPONENT ─── */
function SettingsSection({ title, icon: Icon, children }: { title: string; icon: typeof Settings; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/[0.02] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3 border-b border-white/5">
        <Icon size={14} className="text-[var(--neon-cyan)]" />
        <h3 className="font-mono text-xs tracking-[0.15em] text-white/70 uppercase">{title}</h3>
      </div>
      <div className="p-5 space-y-4">
        {children}
      </div>
    </div>
  );
}

/* ─── TOGGLE ─── */
function Toggle({ label, description, enabled, onChange }: {
  label: string; description?: string; enabled: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="flex items-center justify-between w-full py-2 group"
    >
      <div>
        <p className="font-mono text-[11px] text-white/70 text-left">{label}</p>
        {description && <p className="font-mono text-[9px] text-white/30 text-left mt-0.5">{description}</p>}
      </div>
      <div className={`w-10 h-5 rounded-full transition-all relative ${
        enabled ? "bg-[var(--neon-cyan)]/30" : "bg-white/10"
      }`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
          enabled ? "left-5 bg-[var(--neon-cyan)] shadow-[0_0_8px_var(--neon-cyan)]" : "left-0.5 bg-white/40"
        }`} />
      </div>
    </button>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const gam = useGamification();
  const gamSetTheme = gam.setTheme;
  const { muted, setMuted, volume, setVolume } = useSound();
  const { resetGame } = useGame();
  const [a11y, setA11y] = useState<A11ySettings>(getA11ySettings);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const updateA11y = (key: keyof A11ySettings, value: boolean) => {
    const next = { ...a11y, [key]: value };
    setA11y(next);
    saveA11ySettings(next);
    toast.success(`${key === "highContrast" ? "High contrast" : key === "reduceMotion" ? "Reduced motion" : key === "dyslexiaFont" ? "Dyslexia font" : "Large text"} ${value ? "enabled" : "disabled"}`);
  };

  // Get unlocked themes
  const unlockedThemes = ARK_THEMES.filter(t => gam.level >= t.unlockLevel);
  const lockedThemes = ARK_THEMES.filter(t => gam.level < t.unlockLevel);

  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(51,226,230,0.15), rgba(56,117,250,0.15))",
            border: "1px solid rgba(51,226,230,0.3)",
          }}>
          <Settings size={18} className="text-[var(--neon-cyan)]" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold tracking-wider text-foreground">SHIP CONFIGURATION</h1>
          <p className="font-mono text-[10px] text-muted-foreground tracking-wider">System preferences and accessibility</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* ═══ APPEARANCE ═══ */}
        <SettingsSection title="Appearance" icon={Palette}>
          {/* Light/Dark Mode */}
          <div>
            <p className="font-mono text-[10px] text-white/40 tracking-wider mb-2">MODE</p>
            <div className="flex gap-2">
              {[
                { value: "dark" as const, label: "Dark", icon: Moon, desc: "Deep space" },
                { value: "light" as const, label: "Light", icon: Sun, desc: "Bright mode" },
                { value: "system" as const, label: "System", icon: Monitor, desc: "Auto-detect" },
              ].map((mode) => {
                const Icon = mode.icon;
                const active = theme === mode.value;
                return (
                  <button
                    key={mode.value}
                    onClick={() => { if (theme !== mode.value && mode.value !== "system" && toggleTheme) toggleTheme(); }}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg border transition-all ${
                      active
                        ? "border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5"
                        : "border-white/8 hover:border-white/15 hover:bg-white/3"
                    }`}
                  >
                    <Icon size={16} className={active ? "text-[var(--neon-cyan)]" : "text-white/40"} />
                    <span className={`font-mono text-[10px] ${active ? "text-[var(--neon-cyan)]" : "text-white/50"}`}>
                      {mode.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ark Themes */}
          <div>
            <p className="font-mono text-[10px] text-white/40 tracking-wider mb-2">ARK THEME</p>
            <div className="grid grid-cols-2 gap-2">
              {unlockedThemes.map((t) => {
                const active = gam.currentTheme.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      gamSetTheme(t.id);
                      toast.success(`Theme changed to ${t.name}`);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-all text-left ${
                      active
                        ? "border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5"
                        : "border-white/8 hover:border-white/15 hover:bg-white/3"
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-md shrink-0"
                      style={{ background: t.colors?.primary || "var(--neon-cyan)" }}
                    />
                    <div className="min-w-0">
                      <p className={`font-mono text-[10px] truncate ${active ? "text-[var(--neon-cyan)]" : "text-white/60"}`}>
                        {t.name}
                      </p>
                      <p className="font-mono text-[8px] text-white/25 truncate">{t.description}</p>
                    </div>
                    {active && <Check size={12} className="text-[var(--neon-cyan)] shrink-0 ml-auto" />}
                  </button>
                );
              })}
              {lockedThemes.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-white/5 opacity-40"
                >
                  <div className="w-6 h-6 rounded-md shrink-0 bg-white/10 flex items-center justify-center">
                    <Lock size={10} className="text-white/30" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-white/30 truncate">{t.name}</p>
                    <p className="font-mono text-[8px] text-white/15 truncate">Unlock at LV.{t.unlockLevel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SettingsSection>

        {/* ═══ ACCESSIBILITY ═══ */}
        <SettingsSection title="Accessibility" icon={Accessibility}>
          <Toggle
            label="High Contrast"
            description="Increase color contrast for better readability"
            enabled={a11y.highContrast}
            onChange={(v) => updateA11y("highContrast", v)}
          />
          <Toggle
            label="Reduce Motion"
            description="Minimize animations and transitions"
            enabled={a11y.reduceMotion}
            onChange={(v) => updateA11y("reduceMotion", v)}
          />
          <Toggle
            label="Dyslexia-Friendly Font"
            description="Use OpenDyslexic font for improved readability"
            enabled={a11y.dyslexiaFont}
            onChange={(v) => updateA11y("dyslexiaFont", v)}
          />
          <Toggle
            label="Large Text"
            description="Increase base font size across the app"
            enabled={a11y.largeText}
            onChange={(v) => updateA11y("largeText", v)}
          />
        </SettingsSection>

        {/* ═══ AUDIO ═══ */}
        <SettingsSection title="Audio" icon={Volume2}>
          <Toggle
            label="Mute All Sounds"
            description="Disable all sound effects and ambient audio"
            enabled={muted}
            onChange={setMuted}
          />
          <div>
            <p className="font-mono text-[10px] text-white/40 mb-2">MASTER VOLUME</p>
            <div className="flex items-center gap-3">
              <VolumeX size={14} className="text-white/30" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 accent-[var(--neon-cyan)]"
              />
              <Volume2 size={14} className="text-white/30" />
              <span className="font-mono text-[10px] text-white/40 w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </SettingsSection>

        {/* ═══ GAME MANAGEMENT ═══ */}
        <SettingsSection title="Game Management" icon={Gamepad2}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[11px] text-white/70">Reset Game Progress</p>
              <p className="font-mono text-[9px] text-white/30 mt-0.5">
                This will reset all rooms, XP, achievements, and card collection. Cannot be undone.
              </p>
            </div>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-3 py-1.5 rounded-md border border-[var(--alert-red)]/30 text-[var(--alert-red)] font-mono text-[10px] hover:bg-[var(--alert-red)]/10 transition-colors"
              >
                RESET
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 rounded-md border border-white/10 text-white/50 font-mono text-[10px] hover:bg-white/5 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    resetGame();
                    setShowResetConfirm(false);
                    toast.success("Game progress has been reset");
                  }}
                  className="px-3 py-1.5 rounded-md bg-[var(--alert-red)]/20 border border-[var(--alert-red)]/40 text-[var(--alert-red)] font-mono text-[10px] hover:bg-[var(--alert-red)]/30 transition-colors"
                >
                  CONFIRM RESET
                </button>
              </div>
            )}
          </div>
        </SettingsSection>

        {/* Version Info */}
        <div className="text-center py-4">
          <p className="font-mono text-[9px] text-white/15">
            LOREDEX OS v5.0.0 // INCEPTION ARK // CADES ACTIVE
          </p>
          <p className="font-mono text-[9px] text-white/10 mt-1">
            Malkia Ukweli & the Panopticon
          </p>
        </div>
      </div>
    </div>
  );
}
