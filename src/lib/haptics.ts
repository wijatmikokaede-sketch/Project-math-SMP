/**
 * Web Haptics helper. Uses navigator.vibrate when available (mostly Android/Chrome).
 * Silently no-ops on iOS Safari and desktop — call sites stay clean.
 */
export type HapticPattern = "tap" | "soft" | "success" | "error" | "warn";

const PATTERNS: Record<HapticPattern, number | number[]> = {
  tap: 8,
  soft: 4,
  success: [12, 40, 12],
  error: [40, 30, 40, 30, 40],
  warn: [20, 30, 20],
};

export function haptic(pattern: HapticPattern = "tap") {
  if (typeof navigator === "undefined") return;
  const v = (navigator as Navigator & { vibrate?: (p: number | number[]) => boolean }).vibrate;
  if (typeof v !== "function") return;
  try {
    v.call(navigator, PATTERNS[pattern]);
  } catch {
    // ignore
  }
}

export function withHaptic<T extends (...args: any[]) => any>(
  fn: T | undefined,
  pattern: HapticPattern = "tap",
): T {
  return ((...args: Parameters<T>) => {
    haptic(pattern);
    return fn?.(...args);
  }) as T;
}