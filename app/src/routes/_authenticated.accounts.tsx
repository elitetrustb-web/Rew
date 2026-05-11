import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { loadDB } from "@/services/storage";
import { PageHeader } from "@/components/ui-kit";
import { formatCurrency } from "@/utils/format";

export const Route = createFileRoute("/_authenticated/accounts")({
  head: () => ({ meta: [{ title: "Accounts — NorthAxis Bank" }] }),
  component: AccountsPage,
});

function AccountsPage() {
  const { user } = useAuth();
  const accounts = loadDB().accounts.filter((a) => a.userId === user?.id);
  return (
    <div className="space-y-6">
      <PageHeader title="Accounts" subtitle="All your NorthAxis accounts in one place." />
      <div className="grid gap-4 md:grid-cols-2">
        {accounts.map((a) => (
          <div key={a.id} className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {a.kind}
                </div>
                <div className="mt-1 font-display text-xl">{a.label}</div>
              </div>
              <div className="rounded-md border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                {a.currency}
              </div>
            </div>
            <div className="mt-4 font-display text-3xl text-gradient-gold">
              {formatCurrency(a.balance)}
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-xs">
              <Row k="Account #" v={a.number} />
              <Row k="Routing" v={a.routing} />
              <Row k="IBAN" v={a.iban} />
              <Row k="SWIFT" v={a.swift} />
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-card/30 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {k}
      </div>
      <div className="mt-0.5 font-mono text-[12px]">{v}</div>
    </div>
  );
}
