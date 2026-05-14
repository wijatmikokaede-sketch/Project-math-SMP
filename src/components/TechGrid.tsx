/**
 * Subtle technical grid background — fixed full-viewport.
 * Black base, faint grey grid lines, soft blue glow accents.
 */
export function TechGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at 50% 30%, black 40%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 30%, black 40%, transparent 90%)",
        }}
      />
      {/* Blue glow blobs */}
      <div
        className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-40 blur-3xl animate-pulse-slow"
        style={{ background: "radial-gradient(circle, var(--accent-glow), transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 h-[360px] w-[360px] rounded-full opacity-25 blur-3xl animate-pulse-slower"
        style={{ background: "radial-gradient(circle, var(--accent-glow), transparent 70%)" }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}