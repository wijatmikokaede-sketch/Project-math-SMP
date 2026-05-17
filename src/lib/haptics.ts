/**
 * Trigger a short haptic vibration on supported devices (mostly Android Chrome).
 * Silently no-ops on iOS Safari and desktop browsers.
 */
export function triggerHaptic(pattern: number | number[] = 10) {
  if (typeof window === "undefined") return;
  const nav = window.navigator as Navigator & { vibrate?: (p: number | number[]) => boolean };
  try {
    nav.vibrate?.(pattern);
  } catch {
    // ignore
  }
}

export const haptics = {
  tap: () => triggerHaptic(10),
  soft: () => triggerHaptic(5),
  success: () => triggerHaptic([10, 30, 10]),
  reveal: () => triggerHaptic([15, 25, 40]),
  error: () => triggerHaptic([40, 30, 40]),
};