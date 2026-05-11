import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { loadDB, updateDB } from "@/services/storage";
import { PageHeader, Badge } from "@/components/ui-kit";
import { formatCurrency, formatDateTime } from "@/utils/format";

export const Route = createFileRoute("/_authenticated/wires")({
  head: () => ({ meta: [{ title: "Wires — NorthAxis Bank" }] }),
  component: WiresPage,
});

function WiresPage() {
  const { user } = useAuth();
  const db = loadDB();
  const wires = db.transactions.filter((t) => t.userId === user?.id && t.kind === "wire");
  const [form, setForm] = useState({
    beneficiary: "",
    iban: "",
    swift: "",
    amount: "",
    note: "",
  });
  const [processing, setProcessing] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const amt = Number(form.amount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount.");
    setProcessing(true);
    setTimeout(() => {
      updateDB((db) => {
        db.transactions.unshift({
          id: `tx_${Math.random().toString(36).slice(2, 8)}`,
          userId: user!.id,
          kind: "wire",
          status: "pending",
          amount: -amt,
          currency: "USD",
          description: `Wire to ${form.beneficiary}`,
          counterparty: form.beneficiary,
          createdAt: new Date().toISOString(),
        });
      });
      setProcessing(false);
      toast.success("Wire submitted for approval");
      setForm({ beneficiary: "", iban: "", swift: "", amount: "", note: "" });
    }, 900);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="International wires"
        subtitle="Send SWIFT/IBAN wires to 180+ countries."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={onSubmit} className="glass space-y-3 rounded-2xl p-6 lg:col-span-1">
          <In label="Beneficiary" v={form.beneficiary} set={(v) => setForm({ ...form, beneficiary: v })} />
          <In label="IBAN / Account #" v={form.iban} set={(v) => setForm({ ...form, iban: v })} />
          <In label="SWIFT / BIC" v={form.swift} set={(v) => setForm({ ...form, swift: v })} />
          <In label="Amount (USD)" type="number" v={form.amount} set={(v) => setForm({ ...form, amount: v })} />
          <In label="Reference" v={form.note} set={(v) => setForm({ ...form, note: v })} />
          <button
            disabled={processing}
            className="w-full rounded-md gradient-gold py-2.5 text-sm font-semibold text-navy-deep disabled:opacity-60"
          >
            {processing ? "Processing..." : "Submit wire"}
          </button>
          <p className="text-[11px] text-muted-foreground">
            Wires submitted are reviewed by NorthAxis within 1 business day.
          </p>
          <style>{`
            .auth-input { width:100%; background: oklch(0.21 0.035 260); border:1px solid var(--border); border-radius:.5rem; padding:.55rem .75rem; outline:none; color:inherit; font-size:.875rem; }
            .auth-input:focus { border-color: oklch(0.78 0.14 80 / .6); }
          `}</style>
        </form>

        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="mb-3 font-display text-lg">Wire history</h3>
          {wires.length === 0 ? (
            <p className="text-sm text-muted-foreground">No wires yet.</p>
          ) : (
            <div className="divide-y divide-border/60">
              {wires.map((w) => (
                <div key={w.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm">{w.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDateTime(w.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={w.status === "completed" ? "success" : w.status === "pending" ? "warning" : "danger"}>
                      {w.status}
                    </Badge>
                    <span className="text-sm">{formatCurrency(w.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function In({
  label,
  v,
  set,
  type = "text",
}: {
  label: string;
  v: string;
  set: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        required
        type={type}
        value={v}
        onChange={(e) => set(e.target.value)}
        className="auth-input"
      />
    </label>
  );
}
