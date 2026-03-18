/* ═══════════════════════════════════════════════════════
   HAPTIC FEEDBACK SYSTEM
   Mobile-first vibration patterns for fighting game events.
   Uses the Vibration API (navigator.vibrate) with graceful
   degradation on unsupported browsers.
   ═══════════════════════════════════════════════════════ */

/** Check if haptics are supported */
export function hapticSupported(): boolean {
  return typeof navigator !== "undefined" && "vibrate" in navigator;
}

/** Fire a single vibration pulse (ms) */
function pulse(ms: number) {
  if (!hapticSupported()) return;
  try { navigator.vibrate(ms); } catch { /* silent */ }
}

/** Fire a pattern: [vibrate, pause, vibrate, pause, ...] */
function pattern(p: number[]) {
  if (!hapticSupported()) return;
  try { navigator.vibrate(p); } catch { /* silent */ }
}

/* ─── ATTACK HAPTICS ─── */

/** Light attack — crisp tap */
export function hapticLightHit() {
  pulse(15);
}

/** Medium attack — firm thud */
export function hapticMediumHit() {
  pulse(30);
}

/** Heavy attack — deep impact */
export function hapticHeavyHit() {
  pattern([40, 20, 25]);
}

/** Heavy charge building — escalating pulses */
export function hapticHeavyCharge() {
  pulse(8);
}

/** Heavy release — slam */
export function hapticHeavyRelease() {
  pattern([50, 15, 35]);
}

/* ─── SPECIAL ATTACK HAPTICS ─── */

/** SP1 — quick burst */
export function hapticSP1() {
  pattern([30, 15, 40, 15, 30]);
}

/** SP2 — powerful sequence */
export function hapticSP2() {
  pattern([40, 20, 50, 20, 60, 15, 40]);
}

/** SP3 — ultimate impact */
export function hapticSP3() {
  pattern([60, 25, 80, 20, 100, 15, 60, 15, 40]);
}

/* ─── DEFENSIVE HAPTICS ─── */

/** Block — dull thud */
export function hapticBlock() {
  pulse(20);
}

/** Parry success — sharp snap + pause + confirmation */
export function hapticParry() {
  pattern([35, 40, 15]);
}

/** Dexterity/Evade — light swoosh */
export function hapticEvade() {
  pattern([10, 30, 10]);
}

/** Guard break — jarring double pulse */
export function hapticGuardBreak() {
  pattern([50, 15, 50]);
}

/* ─── MOVEMENT HAPTICS ─── */

/** Dash forward — quick burst */
export function hapticDashForward() {
  pulse(12);
}

/** Dash back — light retreat feel */
export function hapticDashBack() {
  pulse(10);
}

/* ─── COMBAT EVENT HAPTICS ─── */

/** Intercept — satisfying counter-hit */
export function hapticIntercept() {
  pattern([25, 20, 40]);
}

/** Combo milestone (3+) — escalating with combo count */
export function hapticCombo(count: number) {
  const intensity = Math.min(count * 5, 40);
  pulse(intensity);
}

/** KO — dramatic finish */
export function hapticKO() {
  pattern([80, 30, 60, 30, 100, 50, 40]);
}

/** Round win */
export function hapticRoundWin() {
  pattern([30, 50, 30, 50, 60]);
}

/** Match win — victory celebration */
export function hapticMatchWin() {
  pattern([40, 30, 40, 30, 60, 30, 80, 50, 40]);
}

/** Taking damage — proportional to damage percentage */
export function hapticTakeDamage(damagePercent: number) {
  const ms = Math.min(Math.max(damagePercent * 0.5, 10), 60);
  pulse(ms);
}

/** DOT tick — small recurring sting */
export function hapticDotTick() {
  pulse(8);
}

/** Heal — gentle warm pulse */
export function hapticHeal() {
  pattern([10, 40, 10, 40, 10]);
}

/** Special meter full — notification pulse */
export function hapticSpecialReady() {
  pattern([15, 30, 15, 30, 25]);
}

/** Stun applied — buzzing */
export function hapticStun() {
  pattern([20, 10, 20, 10, 20]);
}

/* ─── MASTER CONTROLLER ─── */

/** Haptic settings (can be toggled by user) */
let hapticEnabled = true;

export function setHapticEnabled(enabled: boolean) {
  hapticEnabled = enabled;
  if (!enabled && hapticSupported()) {
    navigator.vibrate(0); // cancel any ongoing vibration
  }
}

export function isHapticEnabled(): boolean {
  return hapticEnabled && hapticSupported();
}

/**
 * Convenience: fire haptic by event name.
 * Used by FightArena3D callbacks to dispatch haptics.
 */
export function hapticForEvent(event: string, data?: { combo?: number; damagePercent?: number }) {
  if (!hapticEnabled) return;

  switch (event) {
    case "light_hit": hapticLightHit(); break;
    case "medium_hit": hapticMediumHit(); break;
    case "heavy_hit": hapticHeavyHit(); break;
    case "heavy_charge": hapticHeavyCharge(); break;
    case "heavy_release": hapticHeavyRelease(); break;
    case "sp1": hapticSP1(); break;
    case "sp2": hapticSP2(); break;
    case "sp3": hapticSP3(); break;
    case "block": hapticBlock(); break;
    case "parry": hapticParry(); break;
    case "evade": hapticEvade(); break;
    case "guard_break": hapticGuardBreak(); break;
    case "dash_fwd": hapticDashForward(); break;
    case "dash_back": hapticDashBack(); break;
    case "intercept": hapticIntercept(); break;
    case "combo": hapticCombo(data?.combo ?? 3); break;
    case "ko": hapticKO(); break;
    case "round_win": hapticRoundWin(); break;
    case "match_win": hapticMatchWin(); break;
    case "take_damage": hapticTakeDamage(data?.damagePercent ?? 10); break;
    case "dot_tick": hapticDotTick(); break;
    case "heal": hapticHeal(); break;
    case "special_ready": hapticSpecialReady(); break;
    case "stun": hapticStun(); break;
  }
}
