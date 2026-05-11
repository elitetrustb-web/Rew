import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { Brand } from "@/components/Brand";
import { useAuth } from "@/context/AuthContext";
import { initials } from "@/utils/format";
import { Gauge, LogOut } from "lucide-react";
import { toast } from "sonner";

const adminNav = [
  { to: "/admin", label: "Console", icon: Gauge },
] as const;

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Brand compact to="/admin" />
        </div>
        <div className="px-5 py-3">
          <div className="rounded-md border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            Admin Console
          </div>
        </div>
        <nav className="p-3">
          {adminNav.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
                activeProps={{
                  className: "bg-accent text-foreground",
                }}
                activeOptions={{ exact: true }}
              >
                <Icon className="h-4 w-4 text-gold/80" />
                {n.label}
              </Link>
            );
          })}
          <div className="mx-3 my-3 border-t border-sidebar-border" />
          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent"
          >
            ← Back to Banking
          </Link>
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/60 px-4 backdrop-blur-xl sm:px-6">
          <div className="text-sm text-muted-foreground">
            Logged in as <span className="text-foreground">{user?.name}</span>{" "}
            ·{" "}
            <span className="text-gold">
              {user?.role === "super_admin" ? "Super Admin" : "Admin"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full glass px-2 py-1.5">
              <div className="grid h-7 w-7 place-items-center rounded-full gradient-gold text-xs font-bold text-navy-deep">
                {user ? initials(user.name) : "·"}
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                toast.success("Signed out");
                navigate({ to: "/login" });
              }}
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
