import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  getSession,
  logout as logoutFn,
  refreshSession,
} from "@/services/auth";
import type { Session, User } from "@/types";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  hydrated: boolean;
  refresh: () => void;
  logout: () => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => {
    const s = getSession();
    setSessionState(s);
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);
    const i = setInterval(() => {
      // touch session every 5 min while active
      if (getSession()) refreshSession();
    }, 5 * 60 * 1000);
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(i);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      session,
      hydrated,
      refresh,
      logout: () => {
        logoutFn();
        refresh();
      },
      isAdmin: user?.role === "admin" || user?.role === "super_admin",
      isSuperAdmin: user?.role === "super_admin",
    }),
    [user, session, hydrated, refresh],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
        }
