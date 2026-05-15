/**
 * Subtle decorative background — radial gradient + dotted noise overlay.
 * Variants: "warm" for quotes, "cool" for conundrum.
 */
export function SubtleBackground({ variant = "warm" }: { variant?: "warm" | "cool" }) {
  const gradient =
    variant === "warm"
      ? "radial-gradient(ellipse at top, oklch(0.95 0.05 70 / 0.6), transparent 60%), radial-gradient(ellipse at bottom right, oklch(0.9 0.08 30 / 0.4), transparent 55%)"
      : "radial-gradient(ellipse at top, oklch(0.94 0.04 240 / 0.5), transparent 60%), radial-gradient(ellipse at bottom left, oklch(0.92 0.06 200 / 0.4), transparent 55%)";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: gradient }} />
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}