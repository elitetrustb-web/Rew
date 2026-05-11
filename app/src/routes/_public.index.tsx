import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Banknote,
  Bitcoin,
  CreditCard,
  Globe2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/_public/")({
  head: () => ({
    meta: [
      { title: "NorthAxis Bank — Private Banking Reimagined" },
      {
        name: "description",
        content:
          "Premium private banking, global wires, cards, and digital assets in one elegant platform.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-32">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs uppercase tracking-wider text-gold">
              <Sparkles className="h-3 w-3" />
              Private banking · Reimagined
            </div>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight sm:text-6xl">
              Banking that moves at the
              <span className="text-gradient-gold"> speed of wealth.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              NorthAxis is a digital private bank for founders, executives, and
              global families. Wires, cards, savings, and crypto — engineered in
              one luxurious experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-md gradient-gold px-5 py-3 text-sm font-semibold text-navy-deep ring-gold-glow"
              >
                Open private account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center rounded-md border border-border bg-card/50 px-5 py-3 text-sm font-medium hover:bg-accent"
              >
                Explore services
              </Link>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {[
                ["$24B+", "Assets serviced"],
                ["180", "Countries"],
                ["A+", "Security rating"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-xl text-gradient-gold">
                    {n}
                  </div>
                  <div className="text-xs text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in-up">
            <div className="glass-strong rounded-3xl p-6 ring-gold-glow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Premier Checking
                  </div>
                  <div className="mt-1 font-display text-3xl">$48,230.55</div>
                </div>
                <CreditCard className="h-6 w-6 text-gold" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[
                  ["+12.4%", "30d"],
                  ["$8,500", "Wire in"],
                  ["$1,240", "Card spend"],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-xl border border-border/60 bg-card/40 p-3">
                    <div className="font-display text-sm">{v}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {l}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                {[
                  ["Apple Store", "-$219.00", "Today"],
                  ["Wire from Goldman Sachs", "+$8,500.00", "Yesterday"],
                  ["Delta Airlines", "-$1,420.50", "2d ago"],
                ].map(([m, a, t]) => (
                  <div
                    key={m}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-card/30 px-4 py-3"
                  >
                    <div>
                      <div className="text-sm">{m}</div>
                      <div className="text-xs text-muted-foreground">{t}</div>
                    </div>
                    <div
                      className={`text-sm ${
                        a.startsWith("+") ? "text-success" : ""
                      }`}
                    >
                      {a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -right-4 -top-4 hidden h-32 w-32 rounded-full bg-gold/20 blur-3xl lg:block" />
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-3xl sm:text-4xl">
            One platform. Every financial need.
          </h2>
          <p className="mt-3 text-muted-foreground">
            From everyday banking to private wealth and digital assets.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Banknote, t: "Premier Banking", d: "High-yield checking and reserve savings with concierge support." },
            { icon: Globe2, t: "Global Wires", d: "Same-day SWIFT and IBAN transfers to 180+ countries." },
            { icon: CreditCard, t: "Platinum Cards", d: "Metal Visa & Mastercard with elite rewards." },
            { icon: Bitcoin, t: "Digital Assets", d: "Custody and trading for BTC, ETH, USDT, and SOL." },
            { icon: ShieldCheck, t: "Bank-Grade Security", d: "OTP, device intelligence, and 24/7 fraud monitoring." },
            { icon: TrendingUp, t: "Wealth Insights", d: "Real-time analytics across every account." },
            { icon: Sparkles, t: "Private Concierge", d: "Dedicated relationship manager." },
            { icon: ArrowRight, t: "Instant Onboarding", d: "Open an account in minutes." },
          ].map((f) => (
            <div
              key={f.t}
              className="glass rounded-2xl p-6 transition hover:border-gold/30"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-display text-lg">{f.t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center sm:p-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(at_30%_20%,oklch(0.78_0.14_80/.18),transparent_50%)]" />
          <h2 className="font-display text-3xl sm:text-4xl">
            Apply for your private account today.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Approval in minutes. No paperwork. No queues.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="rounded-md gradient-gold px-6 py-3 text-sm font-semibold text-navy-deep"
            >
              Open account
            </Link>
            <Link
              to="/contact"
              className="rounded-md border border-border bg-card/40 px-6 py-3 text-sm"
            >
              Talk to a banker
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
