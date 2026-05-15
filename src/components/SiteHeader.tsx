import { Link } from "@tanstack/react-router";
import { haptics } from "@/lib/haptics";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          to="/"
          onClick={haptics.tap}
          className="font-display text-base font-bold tracking-tight"
        >
          Art Of Math
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <NavLink to="/quotes" label="Quotes" />
          <NavLink to="/conundrum" label="Conundrum" />
        </nav>
      </div>
    </header>
  );
}

function NavLink({ to, label }: { to: "/quotes" | "/conundrum"; label: string }) {
  return (
    <Link
      to={to}
      onClick={haptics.tap}
      activeProps={{ className: "bg-accent text-accent-foreground" }}
      className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {label}
    </Link>
  );
}