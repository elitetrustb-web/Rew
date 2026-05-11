import { Link, Outlet } from "@tanstack/react-router";
import { Brand } from "@/components/Brand";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/security", label: "Security" },
  { to: "/contact", label: "Contact" },
] as const;

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Brand />
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
                activeProps={{ className: "text-gold" }}
                activeOptions={{ exact: true }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-md gradient-gold px-4 py-2 text-sm font-semibold text-navy-deep transition hover:opacity-90"
            >
              Open account
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/60 bg-navy-deep/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
          <div>
            <Brand />
            <p className="mt-3 text-sm text-muted-foreground">
              Private banking, wealth, and digital assets — engineered for the
              new financial era.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Banking</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Premier Checking</li>
              <li>Reserve Savings</li>
              <li>Wire Transfers</li>
              <li>Global Cards</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/security">Security</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Member FDIC (demo)</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Disclosures</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60 px-6 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} NorthAxis Bank · A demonstration build.
          Not a real financial institution.
        </div>
      </footer>
    </div>
  );
}
