import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/layouts/AdminLayout";
import { canAccess, getSession } from "@/services/auth";
import { loadDB } from "@/services/storage";

export const Route = createFileRoute("/_admin")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const s = getSession();
    if (!s) throw redirect({ to: "/login" });
    const u = loadDB().users.find((u) => u.id === s.userId);
    if (!u || !canAccess(u.role, "admin")) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: AdminLayout,
});
