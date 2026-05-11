import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { loadDB } from "@/services/storage";
import { PageHeader, Badge } from "@/components/ui-kit";
import { formatCurrency, formatDateTime } from "@/utils/format";

export const Route = createFileRoute("/_authenticated/transactions")({
  head: () => ({ meta: [{ title: "Transactions — NorthAxis Bank" }] }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const { user } = useAuth();
  const all = loadDB().transactions.filter((t) => t.userId === user?.id);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const list = useMemo(
    () =>
      all.filter(
        (t) =>
          (filter === "all" || t.kind === filter) &&
          (!q || t.description.toLowerCase().includes(q.toLowerCase())),
      ),
    [all, q, filter],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" subtitle={`${all.length} total transactions`} />
      <div className="glass flex flex-wrap gap-3 rounded-2xl p-4">
        <input
          placeholder="Search description..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="auth-input flex-1 min-w-[200px]"
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="auth-input max-w-[180px]">
          {["all", "card", "transfer", "wire", "deposit", "atm", "crypto"].map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <style>{`
          .auth-input { background: oklch(0.21 0.035 260); border:1px solid var(--border); border-radius:.5rem; padding:.55rem .75rem; outline:none; color:inherit; font-size:.875rem; }
        `}</style>
      </div>
      <div className="glass rounded-2xl">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {list.map((t) => (
              <tr key={t.id}>
                <td className="px-5 py-3 text-muted-foreground">{formatDateTime(t.createdAt)}</td>
                <td className="px-5 py-3">{t.description}</td>
                <td className="px-5 py-3 text-muted-foreground">{t.kind}</td>
                <td className="px-5 py-3">
                  <Badge tone={t.status === "completed" ? "success" : t.status === "pending" ? "warning" : "danger"}>{t.status}</Badge>
                </td>
                <td className={`px-5 py-3 text-right ${t.amount > 0 ? "text-success" : ""}`}>
                  {t.amount > 0 ? "+" : ""}{formatCurrency(t.amount)}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">No matches.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
