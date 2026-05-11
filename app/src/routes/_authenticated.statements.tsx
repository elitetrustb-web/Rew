import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { loadDB } from "@/services/storage";
import { PageHeader } from "@/components/ui-kit";
import { formatCurrency } from "@/utils/format";

export const Route = createFileRoute("/_authenticated/statements")({
  head: () => ({ meta: [{ title: "Statements — NorthAxis Bank" }] }),
  component: StatementsPage,
});

function StatementsPage() {
  const { user } = useAuth();
  const db = loadDB();
  const statements = db.statements.filter((s) => s.userId === user?.id);
  return (
    <div className="space-y-6">
      <PageHeader title="Statements" subtitle="Download monthly account statements." />
      <div className="glass rounded-2xl">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Period</th>
              <th className="px-5 py-3">Account</th>
              <th className="px-5 py-3 text-right">Closing balance</th>
              <th className="px-5 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {statements.map((s) => {
              const acc = db.accounts.find((a) => a.id === s.accountId);
              return (
                <tr key={s.id}>
                  <td className="px-5 py-3">{s.period}</td>
                  <td className="px-5 py-3 text-muted-foreground">{acc?.label}</td>
                  <td className="px-5 py-3 text-right">{formatCurrency(s.total)}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => toast.success(`Statement ${s.period} downloaded (demo)`)}
                      className="inline-flex items-center gap-1 text-gold hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
