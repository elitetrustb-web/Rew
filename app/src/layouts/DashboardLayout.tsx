import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { Brand } from "@/components/Brand";
import { useAuth } from "@/context/AuthContext";
import { initials } from "@/utils/format";
import {
  Bell,
  CreditCard,
  FileText,
  Home,
  LogOut,
  Send,
  Settings,
  Shield,
  ShieldAlert,
  Wallet,
  Banknote,
  Bitcoin,
  ArrowLeftRight,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const userNav = [
  { to: "/dashboard", label: "Overview", icon: Home },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/transfers", label: "Transfers", icon: ArrowLeftRight },
  { to: "/wires", label: "Wire Transfers", icon: Send },
  { to: "/crypto", label: "Crypto", icon: Bitcoin },
  { to: "/cards", label: "Cards", icon: CreditCard },
  { to: "/transactions", label: "Transactions", icon: Banknote },
  { to: "/statements", label: "Statements", icon: FileText },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/account-security", label: "Security", icon: Shield },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Session expiration check
  useEffect(() => {
    const i = setInterval(() => {
      const raw = localStorage.getItem("northaxis_session_v1");
      if (!raw) {
        toast.error("Your session has expired. Please sign in again.");
        navigate({ to: "/login" });
      }
    }, 60000);
    return () => clearInterval(i);
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Brand compact />
        </div>
        <nav className="scrollbar-thin h-[calc(100vh-4rem)] overflow-y-auto p-3">
          {userNav.map((n) => {
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
                activeProps={{
                  className:
                    "bg-accent text-foreground border border-border/60",
                }}
              >
                <Icon className="h-4 w-4 text-gold/80 group-hover:text-gold" />
                {n.label}
              </Link>
            );
          })}
          {isAdmin && (
            <>
              <div className="mx-3 my-3 border-t border-sidebar-border" />
              <Link
                to="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gold hover:bg-accent"
              >
                <ShieldAlert className="h-4 w-4" />
                Admin Console
              </Link>
            </>
          )}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:ml-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/60 px-4 backdrop-blur-xl sm:px-6">
          <button
            className="rounded-md border border-border/60 px-3 py-1.5 text-sm lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <div className="hidden text-sm text-muted-foreground sm:block">
            Welcome back,{" "}
            <span className="text-foreground">{user?.name?.split(" ")[0]}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/notifications"
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2 rounded-full glass px-2 py-1.5">
              <div className="grid h-7 w-7 place-items-center rounded-full gradient-gold text-xs font-bold text-navy-deep">
                {user ? initials(user.name) : "·"}
              </div>
              <span className="hidden text-sm sm:inline">{user?.name}</span>
            </div>
            <button
              onClick={() => {
                logout();
                toast.success("Signed out");
                navigate({ to: "/login" });
              }}
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              title="Sign out"
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
