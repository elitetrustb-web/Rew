import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { loadDB, updateDB } from "@/services/storage";
import { PageHeader, Badge } from "@/components/ui-kit";
import { formatCurrency } from "@/utils/format";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/cards")({
  head: () => ({ meta: [{ title: "Cards — NorthAxis Bank" }] }),
  component: CardsPage,
});

function CardsPage() {
  const { user } = useAuth();
  const [, setT] = useState(0);
  const cards = loadDB().cards.filter((c) => c.userId === user?.id);

  const toggle = (id: string) => {
    updateDB((db) => {
      const c = db.cards.find((c) => c.id === id);
      if (!c) return;
      c.status = c.status === "active" ? "frozen" : "active";
    });
    setT((x) => x + 1);
    toast.success("Card updated");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Cards" subtitle="Manage your NorthAxis cards." />
      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((c) => (
          <div key={c.id} className="space-y-3">
            <div className="aspect-[1.6/1] rounded-2xl gradient-navy p-6 ring-gold-glow relative overflow-hidden">
              <div className="absolute inset-0 -z-0 bg-[radial-gradient(at_80%_20%,oklch(0.78_0.14_80/.2),transparent_60%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm text-gradient-gold">NorthAxis · {c.kind}</span>
                  <span className="text-xs text-muted-foreground">{c.brand}</span>
                </div>
                <div className="font-mono text-lg tracking-[0.2em]">•••• •••• •••• {c.last4}</div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{user?.name?.toUpperCase()}</span>
                  <span>EXP {c.expiry}</span>
                </div>
              </div>
            </div>
            <div className="glass flex items-center justify-between rounded-xl p-4">
              <div className="text-sm">
                <div>Limit: {formatCurrency(c.limit)}</div>
                <div className="text-xs text-muted-foreground">Spent: {formatCurrency(c.spend)}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={c.status === "active" ? "success" : c.status === "frozen" ? "warning" : "danger"}>{c.status}</Badge>
                <button onClick={() => toggle(c.id)} className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent">
                  {c.status === "active" ? "Freeze" : "Unfreeze"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
