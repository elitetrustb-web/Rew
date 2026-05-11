import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { loadDB, updateDB } from "@/services/storage";
import { PageHeader } from "@/components/ui-kit";
import { formatCurrency } from "@/utils/format";

export const Route = createFileRoute("/_authenticated/transfers")({
  head: () => ({ meta: [{ title: "Transfers — NorthAxis Bank" }] }),
  component: TransfersPage,
});

function TransfersPage() {
  const { user } = useAuth();
  const accounts = loadDB().accounts.filter((a) => a.userId === user?.id);
  const [from, setFrom] = useState(accounts[0]?.id ?? "");
  const [to, setTo] = useState(accounts[1]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<null | {
    from: string;
    to: string;
    amount: number;
    ref: string;
  }>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount.");
    if (from === to) return toast.error("Choose two different accounts.");
    const src = accounts.find((a) => a.id === from);
    if (!src || src.balance < amt) return toast.error("Insufficient funds.");

    setProcessing(true);
    setTimeout(() => {
      updateDB((db) => {
        const a = db.accounts.find((x) => x.id === from);
        const b = db.accounts.find((x) => x.id === to);
        if (!a || !b) return;
        a.balance = Number((a.balance - amt).toFixed(2));
        b.balance = Number((b.balance + amt).toFixed(2));
        const now = new Date().toISOString();
        const ref = `NRTH${Date.now().toString().slice(-8)}`;
        db.transactions.unshift(
          {
            id: `tx_${Math.random().toString(36).slice(2, 8)}`,
            userId: user!.id,
            accountId: from,
            kind: "transfer",
            status: "completed",
            amount: -amt,
            currency: "USD",
            description: memo || "Internal transfer (out)",
            createdAt: now,
          },
          {
            id: `tx_${Math.random().toString(36).slice(2, 8)}`,
            userId: user!.id,
            accountId: to,
            kind: "transfer",
            status: "completed",
            amount: amt,
            currency: "USD",
            description: memo || "Internal transfer (in)",
            createdAt: now,
          },
        );
        setReceipt({
          from: a.label,
          to: b.label,
          amount: amt,
          ref,
        });
      });
      setProcessing(false);
      toast.success("Transfer completed");
      setAmount("");
      setMemo("");
    }, 900);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Internal transfers" subtitle="Move funds between your accounts instantly." />

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="glass space-y-4 rounded-2xl p-6">
          <SelectField label="From" value={from} onChange={setFrom} options={accounts} />
          <SelectField label="To" value={to} onChange={setTo} options={accounts} />
          <Field label="Amount (USD)">
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="auth-input"
            />
          </Field>
          <Field label="Memo (optional)">
            <input
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="auth-input"
            />
          </Field>
          <button
            disabled={processing}
            className="w-full rounded-md gradient-gold py-2.5 text-sm font-semibold text-navy-deep disabled:opacity-60"
          >
            {processing ? "Processing transfer..." : "Send transfer"}
          </button>
        </form>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-display text-lg">Receipt</h3>
          {!receipt ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Your last transfer receipt will appear here.
            </p>
          ) : (
            <div className="mt-4 space-y-3 text-sm">
              <Row k="Reference" v={receipt.ref} />
              <Row k="From" v={receipt.from} />
              <Row k="To" v={receipt.to} />
              <Row k="Amount" v={formatCurrency(receipt.amount)} />
              <Row k="Status" v="Completed" />
            </div>
          )}
        </div>
      </div>

      <style>{`
        .auth-input { width:100%; background: oklch(0.21 0.035 260); border:1px solid var(--border); border-radius:.5rem; padding:.55rem .75rem; outline:none; color:inherit; font-size:.875rem; }
        .auth-input:focus { border-color: oklch(0.78 0.14 80 / .6); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string; balance: number; currency: string }[];
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="auth-input"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label} — {formatCurrency(o.balance, o.currency)}
          </option>
        ))}
      </select>
    </Field>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between rounded-md border border-border/60 bg-card/30 px-3 py-2">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {k}
      </span>
      <span className="text-sm">{v}</span>
    </div>
  );
}
