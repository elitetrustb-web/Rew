import { createFileRoute } from "@tanstack/react-router";
import { Banknote, Bitcoin, CreditCard, Globe2, ShieldCheck, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_public/services")({
  head: () => ({
    meta: [
      { title: "Services — NorthAxis Bank" },
      {
        name: "description",
        content: "Private banking, global wires, premium cards, and digital assets.",
      },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { i: Banknote, t: "Premier Banking", d: "High-yield Premier Checking and Reserve Savings with concierge support." },
  { i: Globe2, t: "Wire Transfers", d: "SWIFT and IBAN wires to 180+ countries with next-day settlement." },
  { i: CreditCard, t: "Platinum Cards", d: "Metal Visa Platinum and Mastercard Black with elite rewards programs." },
  { i: Bitcoin, t: "Digital Assets", d: "Custody and trading desk for BTC, ETH, USDT, and SOL." },
  { i: TrendingUp, t: "Wealth Strategy", d: "Discretionary portfolio management led by senior advisors." },
  { i: ShieldCheck, t: "Family Office", d: "Multi-generational planning, governance, and reporting." },
];

function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <h1 className="font-display text-4xl sm:text-5xl">
        Services for <span className="text-gradient-gold">global wealth.</span>
      </h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        A complete private banking platform — built around discretion, speed, and design.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.t} className="glass rounded-2xl p-6 transition hover:border-gold/30">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
              <s.i className="h-5 w-5" />
            </div>
            <div className="mt-4 font-display text-lg">{s.t}</div>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
