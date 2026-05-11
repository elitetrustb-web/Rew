import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, AlertTriangle, DollarSign, Users } from "lucide-react";
import { loadDB, updateDB } from "@/services/storage";
import { PageHeader, StatCard, Badge } from "@/components/ui-kit";
import { formatCurrency, formatDateTime } from "@/utils/format";

export const Route = createFileRoute("/_admin/admin")({
  head: () => ({ meta: [{ title: "Admin — NorthAxis Bank" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [, setT] = useState(0);
  const db = loadDB();
  const usersOnly = db.users.filter((u) => u.role === "user");
  const totalAUM = db.accounts.reduce((s, a) => s + a.balance, 0);
  const pendingTx = db.transactions.filter((t) => t.status === "pending").length;

  const volume = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => i);
    return days.map((i) => ({
      day: `D${i + 1}`,
      volume: Math.round(20000 + Math.random() * 80000),
      txns: Math.round(40 + Math.random() * 120),
    }));
  }, []);

  const resolveAlert = (id: string) => {
    updateDB((db) => {
      const a = db.fraud.find((x) => x.id === id);
      if (a) a.resolved = true;
    });
    setT((x) => x + 1);
    toast.success("Alert resolved");
  };

  const approveKyc = (id: string) => {
    updateDB((db) => {
      const k = db.kyc.find((x) => x.id === id);
      if (!k) return;
      k.status = "verified";
      const u = db.users.find((u) => u.id === k.userId);
      if (u) u.kyc = "verified";
      db.audit.unshift({
        id: `a_${Math.random().toString(36).slice(2, 8)}`,
        actorId: "u_eleanor",
        actorName: "Admin Console",
        action: "Approved KYC",
        target: k.userName,
        at: new Date().toISOString(),
      });
    });
    setT((x) => x + 1);
    toast.success("KYC approved");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Admin overview" subtitle="Operational view of NorthAxis Bank." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active users" value={usersOnly.length} hint="With verified accounts" icon={<Users className="h-4 w-4" />} accent />
        <StatCard label="AUM" value={formatCurrency(totalAUM)} hint="Across all accounts" icon={<DollarSign className="h-4 w-4" />} />
        <StatCard label="Pending txns" value={pendingTx} hint="Awaiting clearance" icon={<Activity className="h-4 w-4" />} />
        <StatCard label="Open alerts" value={db.fraud.filter((f) => !f.resolved).length} hint="Fraud monitoring" icon={<AlertTriangle className="h-4 w-4 text-warning" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-2 font-display text-lg">Settlement volume (7d)</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={volume}>
                <CartesianGrid stroke="#ffffff14" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff55" fontSize={11} />
                <YAxis stroke="#ffffff55" fontSize={11} />
                <Tooltip contentStyle={{ background: "#1a2238", border: "1px solid #ffffff14", borderRadius: 8 }} />
                <Bar dataKey="volume" fill="#E2B85C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-2 font-display text-lg">Transaction count</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={volume}>
                <CartesianGrid stroke="#ffffff14" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff55" fontSize={11} />
                <YAxis stroke="#ffffff55" fontSize={11} />
                <Tooltip contentStyle={{ background: "#1a2238", border: "1px solid #ffffff14", borderRadius: 8 }} />
                <Line type="monotone" dataKey="txns" stroke="#7AB7E2" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-3 font-display text-lg">KYC queue</h3>
          {db.kyc.length === 0 ? (
            <p className="text-sm text-muted-foreground">Queue is empty.</p>
          ) : (
            <div className="space-y-3">
              {db.kyc.map((k) => (
                <div key={k.id} className="rounded-xl border border-border/60 bg-card/30 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{k.userName}</div>
                      <div className="text-xs text-muted-foreground">
                        Submitted {formatDateTime(k.submittedAt)} · {k.documents.join(", ")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={k.status === "verified" ? "success" : "warning"}>{k.status}</Badge>
                      {k.status !== "verified" && (
                        <button
                          onClick={() => approveKyc(k.id)}
                          className="rounded-md gradient-gold px-3 py-1 text-xs font-semibold text-navy-deep"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="mb-3 font-display text-lg">Fraud alerts</h3>
          <div className="space-y-3">
            {db.fraud.map((f) => (
              <div key={f.id} className="rounded-xl border border-border/60 bg-card/30 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{f.userName}</div>
                    <div className="text-xs text-muted-foreground">{f.reason}</div>
                    <div className="text-xs text-muted-foreground">{formatDateTime(f.at)}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge tone={f.severity === "high" ? "danger" : f.severity === "medium" ? "warning" : "neutral"}>
                      {f.severity}
                    </Badge>
                    {!f.resolved ? (
                      <button onClick={() => resolveAlert(f.id)} className="rounded-md border border-border px-3 py-1 text-xs hover:bg-accent">
                        Resolve
                      </button>
                    ) : (
                      <Badge tone="success">resolved</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="mb-3 font-display text-lg">All users</h3>
          <div className="divide-y divide-border/60">
            {db.users.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={u.kyc === "verified" ? "success" : "warning"}>{u.kyc}</Badge>
                  <Badge tone={u.role === "user" ? "neutral" : "gold"}>{u.role}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="mb-3 font-display text-lg">Audit log</h3>
          <div className="divide-y divide-border/60">
            {db.audit.map((a) => (
              <div key={a.id} className="py-3">
                <div className="text-sm">
                  <span className="text-gold">{a.actorName}</span> · {a.action}
                  {a.target ? ` → ${a.target}` : ""}
                </div>
                <div className="text-xs text-muted-foreground">{formatDateTime(a.at)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
