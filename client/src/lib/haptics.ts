/* ═══════════════════════════════════════════════════════
   HAPTIC FEEDBACK — Mobile vibration patterns for game interactions
   Uses the Vibration API where supported, gracefully degrades
   ═══════════════════════════════════════════════════════ */

const isSupported = typeof navigator !== "undefined" && "vibrate" in navigator;

/** Light tap — button press, menu selection */
export function hapticLight() {
  if (isSupported) navigator.vibrate(10);
}

/** Medium tap — card play, hit confirmation */
export function hapticMedium() {
  if (isSupported) navigator.vibrate(25);
}

/** Heavy impact — KO, critical hit, explosion */
export function hapticHeavy() {
  if (isSupported) navigator.vibrate(50);
}

/** Double tap pattern — combo hit, achievement unlock */
export function hapticDouble() {
  if (isSupported) navigator.vibrate([15, 50, 15]);
}

/** Triple burst — special move, ultimate ability */
export function hapticTriple() {
  if (isSupported) navigator.vibrate([10, 30, 10, 30, 25]);
}

/** Error buzz — invalid action, insufficient funds */
export function hapticError() {
  if (isSupported) navigator.vibrate([50, 50, 50]);
}

/** Success pattern — purchase complete, trade accepted */
export function hapticSuccess() {
  if (isSupported) navigator.vibrate([10, 50, 20, 50, 30]);
}

/** Long rumble — round start, boss encounter */
export function hapticRumble() {
  if (isSupported) navigator.vibrate(100);
}

/** Custom pattern */
export function hapticPattern(pattern: number | number[]) {
  if (isSupported) navigator.vibrate(pattern);
}

/** Stop any active vibration */
export function hapticStop() {
  if (isSupported) navigator.vibrate(0);
}
