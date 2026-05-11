import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Send, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { loadDB } from "@/services/storage";
import { PageHeader, StatCard, Badge } from "@/components/ui-kit";
import { formatCurrency, formatDateTime } from "@/utils/format";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — NorthAxis Bank" }] }),
  component: DashboardOverview,
});

function DashboardOverview() {
  const { user } = useAuth();
  const db = loadDB();

  const accounts = db.accounts.filter((a) => a.userId === user?.id);
  const txs = db.transactions.filter((t) => t.userId === user?.id);
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const monthIn = txs
    .filter((t) => t.amount > 0 && new Date(t.createdAt).getMonth() === new Date().getMonth())
    .reduce((s, t) => s + t.amount, 0);
  const monthOut = txs
    .filter((t) => t.amount < 0 && new Date(t.createdAt).getMonth() === new Date().getMonth())
    .reduce((s, t) => s + Math.abs(t.amount), 0);

  const series = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => i);
    let bal = totalBalance * 0.85;
    return days.map((i) => {
      bal += (Math.random() - 0.45) * (totalBalance * 0.02);
      return {
        day: `D${i + 1}`,
        balance: Math.max(0, Math.round(bal)),
      };
    });
  }, [totalBalance]);

  const categories = useMemo(() => {
    const m = new Map<string, number>();
    txs
      .filter((t) => t.amount < 0 && t.kind === "card")
      .forEach((t) => m.set(t.category ?? "Other", (m.get(t.category ?? "Other") ?? 0) + Math.abs(t.amount)));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value: Math.round(value) }));
  }, [txs]);

  const COLORS = ["#E2B85C", "#7AB7A8", "#9D8DF1", "#E78A8A", "#7AB7E2"];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hi, ${user?.name?.split(" ")[0]}`}
        subtitle="Here's a snapshot of your private banking portfolio."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total balance"
          value={formatCurrency(totalBalance)}
          hint="Across all accounts"
          icon={<Wallet className="h-4 w-4" />}
          accent
        />
        <StatCard
          label="Inflows (MTD)"
          value={formatCurrency(monthIn)}
          hint="This month"
          icon={<ArrowDownRight className="h-4 w-4 text-success" />}
        />
        <StatCard
          label="Outflows (MTD)"
          value={formatCurrency(monthOut)}
          hint="This month"
          icon={<ArrowUpRight className="h-4 w-4 text-destructive" />}
        />
        <StatCard
          label="Pending"
          value={txs.filter((t) => t.status === "pending").length}
          hint="Awaiting clearance"
          icon={<Send className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-display text-lg">Balance trend</h3>
            <Badge tone="gold">14 days</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E2B85C" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#E2B85C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ffffff14" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff55" fontSize={11} />
                <YAxis stroke="#ffffff55" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "#1a2238",
                    border: "1px solid #ffffff14",
                    borderRadius: 8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#E2B85C"
                  fill="url(#g)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="mb-2 font-display text-lg">Spending mix</h3>
          {categories.length === 0 ? (
            <div className="grid h-64 place-items-center text-sm text-muted-foreground">
              No card spend yet.
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={categories} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                    {categories.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#1a2238",
                      border: "1px solid #ffffff14",
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
            {categories.map((c, i) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg">Recent activity</h3>
        </div>
        <div className="divide-y divide-border/60">
          {txs.slice(0, 8).map((t) => (
            <div key={t.id} className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm">{t.description}</div>
                <div className="text-xs text-muted-foreground">
                  {formatDateTime(t.createdAt)} · {t.kind}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  tone={
                    t.status === "completed"
                      ? "success"
                      : t.status === "pending"
                        ? "warning"
                        : "danger"
                  }
                >
                  {t.status}
                </Badge>
                <div className={`text-sm ${t.amount > 0 ? "text-success" : ""}`}>
                  {t.amount > 0 ? "+" : ""}
                  {formatCurrency(t.amount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
