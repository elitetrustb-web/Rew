import { createFileRoute } from "@tanstack/react-router";
import { Eye, Fingerprint, KeyRound, Lock, ServerCog, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_public/security")({
  head: () => ({
    meta: [
      { title: "Security — NorthAxis Bank" },
      {
        name: "description",
        content:
          "Bank-grade security: OTP, device intelligence, encryption, and 24/7 fraud monitoring.",
      },
    ],
  }),
  component: SecurityPage,
});

function SecurityPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs uppercase tracking-wider text-gold">
        <ShieldCheck className="h-3 w-3" /> Security & Trust
      </div>
      <h1 className="mt-6 font-display text-4xl sm:text-5xl">
        Your assets, <span className="text-gradient-gold">protected.</span>
      </h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        Every NorthAxis session is protected by layered defenses, real-time
        anomaly detection, and a security team monitoring activity 24/7.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { i: KeyRound, t: "OTP Verification", d: "All sign-ins require a one-time code before a session is created." },
          { i: Lock, t: "End-to-End Encryption", d: "TLS 1.3 in transit, AES-256 at rest." },
          { i: Fingerprint, t: "Device Intelligence", d: "Each device is fingerprinted and scored on every login." },
          { i: Eye, t: "24/7 Monitoring", d: "Behavioral anomaly detection on every transaction." },
          { i: ServerCog, t: "Resilient Infrastructure", d: "Multi-region active-active with 99.99% SLA." },
          { i: ShieldCheck, t: "FDIC Insured (demo)", d: "Deposits insured up to $250,000 per account." },
        ].map((c) => (
          <div key={c.t} className="glass rounded-2xl p-6">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
              <c.i className="h-5 w-5" />
            </div>
            <div className="mt-4 font-display text-lg">{c.t}</div>
            <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
