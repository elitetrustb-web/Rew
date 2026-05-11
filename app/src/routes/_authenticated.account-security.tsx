import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { loadDB } from "@/services/storage";
import { PageHeader, Badge } from "@/components/ui-kit";
import { formatDateTime } from "@/utils/format";

export const Route = createFileRoute("/_authenticated/account-security")({
  head: () => ({ meta: [{ title: "Security — NorthAxis Bank" }] }),
  component: AccountSecurityPage,
});

function AccountSecurityPage() {
  const { user } = useAuth();
  const events = loadDB().loginEvents.filter((e) => e.userId === user?.id);
  return (
    <div className="space-y-6">
      <PageHeader title="Security" subtitle="Login activity and protections on your account." />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Two-factor", "Enabled", "OTP via email"],
          ["Last sign-in", events[0] ? formatDateTime(events[0].at) : "—", events[0]?.location ?? ""],
          ["Active sessions", "1", "This device"],
        ].map(([k, v, h]) => (
          <div key={k} className="glass rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{k}</div>
            <div className="mt-1 font-display text-xl">{v}</div>
            <div className="text-xs text-muted-foreground">{h}</div>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-5">
        <h3 className="mb-3 font-display text-lg">Recent sign-ins</h3>
        <div className="divide-y divide-border/60">
          {events.map((e) => (
            <div key={e.id} className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm">{e.device}</div>
                <div className="text-xs text-muted-foreground">{e.location} · {e.ip}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={e.status === "success" ? "success" : e.status === "suspicious" ? "warning" : "danger"}>
                  {e.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{formatDateTime(e.at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
