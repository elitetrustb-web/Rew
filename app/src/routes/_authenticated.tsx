import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { getSession } from "@/services/auth";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const s = getSession();
    if (!s) throw redirect({ to: "/login" });
  },
  component: DashboardLayout,
});
