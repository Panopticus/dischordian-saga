/**
 * SettingsPage.tsx — Ship Configuration
 * 
 * Full settings panel: Appearance (light/dark + Ark themes + font size),
 * Audio (master, music, SFX, ambient toggles), Accessibility (high contrast,
 * reduce motion, dyslexia font, reduce glow), Game (skip tutorials, show hints,
 * difficulty), Account (login/logout, sync status, export save data).
 */
import { useState, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useSound } from "@/contexts/SoundContext";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { ARK_THEMES } from "@shared/gamification";
import {
  Settings, Sun, Moon, Palette, Volume2, VolumeX, Music,
  Gamepad2, RotateCcw, Check, Lock, Monitor, Accessibility,
  Type, Zap, ChevronDown, ChevronUp, User, LogOut, LogIn,
  Download, Cloud, CloudOff, Shield, Eye, EyeOff, Sparkles,
  Gauge, HelpCircle, SkipForward
} from "lucide-react";
import { toast } from "sonner";

/* ─── SETTINGS STORAGE ─── */
interface AppSettings {
  // Accessibility
  highContrast: boolean;
  reduceMotion: boolean;
  dyslexiaFont: boolean;
  reduceGlow: boolean;
  // Display
  fontSize: "small" | "medium" | "large";
  // Audio
  musicVolume: number;
  sfxVolume: number;
  ambientEnabled: boolean;
  // Game
  skipTutorials: boolean;
  showHints: boolean;
  difficulty: "casual" | "standard" | "hardcore";
}

const DEFAULT_SETTINGS: AppSettings = {
  highContrast: false,
  reduceMotion: false,
  dyslexiaFont: false,
  reduceGlow: false,
  fontSize: "medium",
  musicVolume: 0.5,
  sfxVolume: 0.5,
  ambientEnabled: true,
  skipTutorials: false,
  showHints: true,
  difficulty: "standard",
};

function loadSettings(): AppSettings {
  try {
    const saved = localStorage.getItem("loredex-settings");
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
  } catch { return { ...DEFAULT_SETTINGS }; }
}

function saveSettings(settings: AppSettings) {
  localStorage.setItem("loredex-settings", JSON.stringify(settings));
  // Apply accessibility to document
  const root = document.documentElement;
  root.classList.toggle("high-contrast", settings.highContrast);
  root.classList.toggle("reduce-motion", settings.reduceMotion);
  root.classList.toggle("dyslexia-font", settings.dyslexiaFont);
  root.classList.toggle("reduce-glow", settings.reduceGlow);
  // Font size
  root.classList.remove("font-size-small", "font-size-medium", "font-size-large");
  root.classList.add(`font-size-${settings.fontSize}`);
}

/* ─── SECTION COMPONENT ─── */
function SettingsSection({ title, icon: Icon, children, defaultOpen = true }: {
  title: string; icon: typeof Settings; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-border/50 bg-muted/15 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-5 py-3 border-b border-border/40 w-full hover:bg-muted/15 transition-colors"
      >
        <Icon size={14} className="text-[var(--neon-cyan)]" />
        <h3 className="font-mono text-xs tracking-[0.15em] text-muted-foreground/90 uppercase flex-1 text-left">{title}</h3>
        {open ? <ChevronUp size={14} className="text-muted-foreground/50" /> : <ChevronDown size={14} className="text-muted-foreground/50" />}
      </button>
      {open && (
        <div className="p-5 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── TOGGLE ─── */
function Toggle({ label, description, enabled, onChange, icon: Icon }: {
  label: string; description?: string; enabled: boolean; onChange: (v: boolean) => void; icon?: typeof Settings;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="flex items-center justify-between w-full py-2 group"
    >
      <div className="flex items-center gap-2.5">
        {Icon && <Icon size={13} className="text-muted-foreground/50 shrink-0" />}
        <div>
          <p className="font-mono text-[11px] text-muted-foreground/90 text-left">{label}</p>
          {description && <p className="font-mono text-[9px] text-muted-foreground/50 text-left mt-0.5">{description}</p>}
        </div>
      </div>
      <div className={`w-10 h-5 rounded-full transition-all relative shrink-0 ml-3 ${
        enabled ? "bg-[var(--neon-cyan)]/30" : "bg-muted/50"
      }`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
          enabled ? "left-5 bg-[var(--neon-cyan)] shadow-[0_0_8px_var(--neon-cyan)]" : "left-0.5 bg-foreground/40"
        }`} />
      </div>
    </button>
  );
}

/* ─── SLIDER ─── */
function VolumeSlider({ label, icon: Icon, value, onChange, disabled }: {
  label: string; icon: typeof Volume2; value: number; onChange: (v: number) => void; disabled?: boolean;
}) {
  return (
    <div className={`${disabled ? "opacity-40 pointer-events-none" : ""}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={13} className="text-muted-foreground/60" />
        <p className="font-mono text-[10px] text-muted-foreground/70 tracking-wider flex-1">{label}</p>
        <span className="font-mono text-[10px] text-[var(--neon-cyan)] w-8 text-right">
          {Math.round(value * 100)}%
        </span>
      </div>
      <div className="flex items-center gap-3">
        <VolumeX size={12} className="text-muted-foreground/35 shrink-0" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 accent-[var(--neon-cyan)] h-1"
        />
        <Volume2 size={12} className="text-muted-foreground/35 shrink-0" />
      </div>
    </div>
  );
}

/* ─── OPTION SELECTOR ─── */
function OptionSelector<T extends string>({ label, options, value, onChange }: {
  label: string;
  options: { value: T; label: string; desc?: string; icon?: typeof Settings }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider mb-2">{label}</p>
      <div className="flex gap-2">
        {options.map((opt) => {
          const active = value === opt.value;
          const OptIcon = opt.icon;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-lg border transition-all ${
                active
                  ? "border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5"
                  : "border-border/50 hover:border-border/80 hover:bg-muted/30"
              }`}
            >
              {OptIcon && <OptIcon size={16} className={active ? "text-[var(--neon-cyan)]" : "text-muted-foreground/60"} />}
              <span className={`font-mono text-[10px] ${active ? "text-[var(--neon-cyan)]" : "text-muted-foreground/70"}`}>
                {opt.label}
              </span>
              {opt.desc && <span className="font-mono text-[8px] text-muted-foreground/40">{opt.desc}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN SETTINGS PAGE
   ═══════════════════════════════════════════════════════ */
export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const gam = useGamification();
  const gamSetTheme = gam.setTheme;
  const { muted, setMuted, volume, setVolume } = useSound();
  const { state: gameState, resetGame, syncStatus, lastSyncedAt, forceSave } = useGame();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exporting, setExporting] = useState(false);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      return next;
    });
  }, []);

  // Export save data
  const exportSaveData = useCallback(() => {
    setExporting(true);
    try {
      const exportData = {
        version: "5.0.0",
        exportedAt: new Date().toISOString(),
        gameState: localStorage.getItem("loredex-game-state"),
        settings: localStorage.getItem("loredex-settings"),
        gamification: localStorage.getItem("loredex-gamification"),
        playerProfile: localStorage.getItem("loredex-player-profile"),
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `loredex-save-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Save data exported successfully");
    } catch (e) {
      toast.error("Failed to export save data");
    } finally {
      setExporting(false);
    }
  }, []);

  // Get unlocked/locked themes
  const unlockedThemes = ARK_THEMES.filter(t => gam.level >= t.unlockLevel);
  const lockedThemes = ARK_THEMES.filter(t => gam.level < t.unlockLevel);

  return (
    <div className="px-4 sm:px-6 py-6 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(51,226,230,0.15), var(--glass-border))",
            border: "1px solid rgba(51,226,230,0.3)",
          }}>
          <Settings size={18} className="text-[var(--neon-cyan)]" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold tracking-wider text-foreground">SHIP CONFIGURATION</h1>
          <p className="font-mono text-[10px] text-muted-foreground tracking-wider">System preferences, accessibility, and account</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* ═══ APPEARANCE ═══ */}
        <SettingsSection title="Appearance" icon={Palette}>
          {/* Light/Dark Mode */}
          <OptionSelector
            label="MODE"
            value={theme}
            onChange={(v) => {
              if (theme !== v && toggleTheme) toggleTheme();
            }}
            options={[
              { value: "dark", label: "Dark", desc: "Deep space", icon: Moon },
              { value: "light", label: "Light", desc: "Bright mode", icon: Sun },
            ]}
          />

          {/* Font Size */}
          <OptionSelector
            label="FONT SIZE"
            value={settings.fontSize}
            onChange={(v) => updateSetting("fontSize", v)}
            options={[
              { value: "small", label: "Small", desc: "Compact", icon: Type },
              { value: "medium", label: "Medium", desc: "Default", icon: Type },
              { value: "large", label: "Large", desc: "Readable", icon: Type },
            ]}
          />

          {/* Ark Themes */}
          <div>
            <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider mb-2">ARK THEME</p>
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
                        : "border-border/50 hover:border-border/80 hover:bg-muted/30"
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-md shrink-0 border border-border/60"
                      style={{ background: t.colors?.primary || "var(--neon-cyan)" }}
                    />
                    <div className="min-w-0">
                      <p className={`font-mono text-[10px] truncate ${active ? "text-[var(--neon-cyan)]" : "text-muted-foreground/80"}`}>
                        {t.name}
                      </p>
                      <p className="font-mono text-[8px] text-muted-foreground/40 truncate">{t.description}</p>
                    </div>
                    {active && <Check size={12} className="text-[var(--neon-cyan)] shrink-0 ml-auto" />}
                  </button>
                );
              })}
              {lockedThemes.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border/40 opacity-40"
                >
                  <div className="w-6 h-6 rounded-md shrink-0 bg-muted/50 flex items-center justify-center">
                    <Lock size={10} className="text-muted-foreground/50" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-muted-foreground/50 truncate">{t.name}</p>
                    <p className="font-mono text-[8px] text-muted-foreground/25 truncate">Unlock at LV.{t.unlockLevel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SettingsSection>

        {/* ═══ AUDIO ═══ */}
        <SettingsSection title="Audio" icon={Volume2}>
          <Toggle
            label="Mute All Sounds"
            description="Disable all audio output"
            enabled={muted}
            onChange={setMuted}
            icon={VolumeX}
          />

          <VolumeSlider
            label="MASTER VOLUME"
            icon={Volume2}
            value={volume}
            onChange={setVolume}
            disabled={muted}
          />

          <VolumeSlider
            label="MUSIC VOLUME"
            icon={Music}
            value={settings.musicVolume}
            onChange={(v) => updateSetting("musicVolume", v)}
            disabled={muted}
          />

          <VolumeSlider
            label="SFX VOLUME"
            icon={Zap}
            value={settings.sfxVolume}
            onChange={(v) => updateSetting("sfxVolume", v)}
            disabled={muted}
          />

          <Toggle
            label="Ambient Sounds"
            description="Ship hum, cryo hiss, electrical crackle, void wind"
            enabled={settings.ambientEnabled}
            onChange={(v) => updateSetting("ambientEnabled", v)}
            icon={Sparkles}
          />
        </SettingsSection>

        {/* ═══ ACCESSIBILITY ═══ */}
        <SettingsSection title="Accessibility" icon={Accessibility}>
          <Toggle
            label="High Contrast"
            description="Increase color contrast for better readability"
            enabled={settings.highContrast}
            onChange={(v) => updateSetting("highContrast", v)}
            icon={Shield}
          />
          <Toggle
            label="Reduce Motion"
            description="Minimize animations and transitions"
            enabled={settings.reduceMotion}
            onChange={(v) => updateSetting("reduceMotion", v)}
            icon={SkipForward}
          />
          <Toggle
            label="Dyslexia-Friendly Font"
            description="Use OpenDyslexic font for improved readability"
            enabled={settings.dyslexiaFont}
            onChange={(v) => updateSetting("dyslexiaFont", v)}
            icon={Type}
          />
          <Toggle
            label="Reduce Glow Effects"
            description="Dim neon glows and scan line overlays"
            enabled={settings.reduceGlow}
            onChange={(v) => updateSetting("reduceGlow", v)}
            icon={Eye}
          />
        </SettingsSection>

        {/* ═══ GAME PREFERENCES ═══ */}
        <SettingsSection title="Game Preferences" icon={Gamepad2}>
          <Toggle
            label="Skip Tutorials"
            description="Skip room tutorial dialogs on first entry"
            enabled={settings.skipTutorials}
            onChange={(v) => updateSetting("skipTutorials", v)}
            icon={SkipForward}
          />
          <Toggle
            label="Show Hints"
            description="Display Elara's hint system for puzzles"
            enabled={settings.showHints}
            onChange={(v) => updateSetting("showHints", v)}
            icon={HelpCircle}
          />

          <Toggle
            label="Show Room Markers"
            description="Display interactive hotspot markers on room images"
            enabled={(() => {
              try {
                const v = localStorage.getItem("loredex-show-hotspots");
                return v === null ? true : v === "true";
              } catch { return true; }
            })()}
            onChange={(v) => {
              localStorage.setItem("loredex-show-hotspots", String(v));
              window.dispatchEvent(new CustomEvent("hotspot-visibility-changed", { detail: { visible: v } }));
              toast.success(v ? "Room markers visible" : "Room markers hidden");
            }}
            icon={Eye}
          />

          <OptionSelector
            label="DIFFICULTY"
            value={settings.difficulty}
            onChange={(v) => updateSetting("difficulty", v)}
            options={[
              { value: "casual", label: "Casual", desc: "Relaxed", icon: Eye },
              { value: "standard", label: "Standard", desc: "Balanced", icon: Gauge },
              { value: "hardcore", label: "Hardcore", desc: "Punishing", icon: Shield },
            ]}
          />

          {/* Reset Game */}
          <div className="pt-2 border-t border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[11px] text-muted-foreground/90 flex items-center gap-2">
                  <RotateCcw size={13} className="text-[var(--alert-red)]/60" />
                  Reset Game Progress
                </p>
                <p className="font-mono text-[9px] text-muted-foreground/50 mt-0.5 ml-[21px]">
                  Resets all rooms, XP, achievements, and card collection. Cannot be undone.
                </p>
              </div>
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-1.5 rounded-md border border-[var(--alert-red)]/30 text-[var(--alert-red)] font-mono text-[10px] hover:bg-[var(--alert-red)]/10 transition-colors shrink-0"
                >
                  RESET
                </button>
              ) : (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 rounded-md border border-border/60 text-muted-foreground/70 font-mono text-[10px] hover:bg-muted/50 transition-colors"
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
                    CONFIRM
                  </button>
                </div>
              )}
            </div>
          </div>
        </SettingsSection>

        {/* ═══ ACCOUNT ═══ */}
        <SettingsSection title="Account" icon={User}>
          {/* Auth Status */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isAuthenticated ? "bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30" : "bg-muted/40 border border-border/60"
              }`}>
                <User size={14} className={isAuthenticated ? "text-[var(--neon-cyan)]" : "text-muted-foreground/50"} />
              </div>
              <div>
                <p className="font-mono text-[11px] text-muted-foreground/90">
                  {authLoading ? "Checking..." : isAuthenticated ? (user?.name || "Operative") : "Not logged in"}
                </p>
                <p className="font-mono text-[9px] text-muted-foreground/50">
                  {isAuthenticated ? "Authenticated" : "Log in to sync progress across devices"}
                </p>
              </div>
            </div>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  toast.success("Logged out");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/60 text-muted-foreground/70 font-mono text-[10px] hover:bg-muted/50 hover:text-muted-foreground/90 transition-colors shrink-0"
              >
                <LogOut size={12} />
                LOGOUT
              </button>
            ) : (
              <a
                href={getLoginUrl()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] font-mono text-[10px] hover:bg-[var(--neon-cyan)]/10 transition-colors shrink-0"
              >
                <LogIn size={12} />
                LOGIN
              </a>
            )}
          </div>

          {/* Sync Status */}
          {isAuthenticated && (
            <div className="flex items-center justify-between py-2 border-t border-border/40">
              <div className="flex items-center gap-2.5">
                {syncStatus === "synced" ? (
                  <Cloud size={14} className="text-green-400/70" />
                ) : syncStatus === "saving" ? (
                  <Cloud size={14} className="text-[var(--neon-cyan)] animate-pulse" />
                ) : syncStatus === "error" ? (
                  <CloudOff size={14} className="text-[var(--alert-red)]" />
                ) : (
                  <Cloud size={14} className="text-muted-foreground/50" />
                )}
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground/70">
                    {syncStatus === "synced" ? "Synced to server" :
                     syncStatus === "saving" ? "Saving..." :
                     syncStatus === "loading" ? "Loading..." :
                     syncStatus === "error" ? "Sync error" : "Not synced"}
                  </p>
                  {lastSyncedAt && (
                    <p className="font-mono text-[8px] text-muted-foreground/40">
                      Last: {new Date(lastSyncedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  forceSave();
                  toast.success("Sync triggered");
                }}
                className="px-3 py-1.5 rounded-md border border-border/60 text-muted-foreground/70 font-mono text-[10px] hover:bg-muted/50 transition-colors shrink-0"
              >
                SYNC NOW
              </button>
            </div>
          )}

          {/* Export Save Data */}
          <div className="flex items-center justify-between py-2 border-t border-border/40">
            <div className="flex items-center gap-2.5">
              <Download size={14} className="text-muted-foreground/60" />
              <div>
                <p className="font-mono text-[11px] text-muted-foreground/90">Export Save Data</p>
                <p className="font-mono text-[9px] text-muted-foreground/50">Download all game progress as JSON</p>
              </div>
            </div>
            <button
              onClick={exportSaveData}
              disabled={exporting}
              className="px-3 py-1.5 rounded-md border border-border/60 text-muted-foreground/70 font-mono text-[10px] hover:bg-muted/50 transition-colors shrink-0 disabled:opacity-30"
            >
              {exporting ? "EXPORTING..." : "EXPORT"}
            </button>
          </div>
        </SettingsSection>

        {/* Version Info */}
        <div className="text-center py-4">
          <p className="font-mono text-[9px] text-muted-foreground/25">
            LOREDEX OS v5.0.0 // INCEPTION ARK // CADES ACTIVE
          </p>
          <p className="font-mono text-[9px] text-muted-foreground/20 mt-1">
            Malkia Ukweli & the Panopticon
          </p>
        </div>
      </div>
    </div>
  );
}
