import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { loadDB } from "@/services/storage";
import { PageHeader, Badge } from "@/components/ui-kit";
import { formatCurrency, formatDateTime } from "@/utils/format";

export const Route = createFileRoute("/_authenticated/crypto")({
  head: () => ({ meta: [{ title: "Crypto — NorthAxis Bank" }] }),
  component: CryptoPage,
});

function CryptoPage() {
  const { user } = useAuth();
  const db = loadDB();
  const wallets = db.cryptoWallets.filter((w) => w.userId === user?.id);
  const txs = db.cryptoTx.filter((t) => t.userId === user?.id);
  const total = wallets.reduce((s, w) => s + w.usdValue, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Digital assets" subtitle="Custody and trading for BTC, ETH, USDT, SOL." />
      <div className="glass rounded-2xl p-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Portfolio value</div>
        <div className="mt-1 font-display text-3xl text-gradient-gold">{formatCurrency(total)}</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {wallets.map((w) => (
          <div key={w.id} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="font-display text-lg">{w.asset}</div>
              <Badge tone="gold">Self-custody</Badge>
            </div>
            <div className="mt-2 font-display text-2xl">{w.balance} {w.asset}</div>
            <div className="text-sm text-muted-foreground">{formatCurrency(w.usdValue)}</div>
            <div className="mt-3 truncate font-mono text-[11px] text-muted-foreground">{w.address}</div>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="mb-3 font-display text-lg">Recent transactions</h3>
        {txs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No crypto activity yet.</p>
        ) : (
          <div className="divide-y divide-border/60">
            {txs.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm">{t.kind === "deposit" ? "Received" : "Sent"} {t.asset}</div>
                  <div className="text-xs text-muted-foreground">{formatDateTime(t.createdAt)} · {t.txHash}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={t.status === "completed" ? "success" : "warning"}>{t.status}</Badge>
                  <div className={`text-sm ${t.kind === "deposit" ? "text-success" : ""}`}>
                    {t.kind === "deposit" ? "+" : "-"}{t.amount} {t.asset}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
