import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/about")({
  head: () => ({
    meta: [
      { title: "About — NorthAxis Bank" },
      {
        name: "description",
        content: "The story, mission, and leadership behind NorthAxis Bank.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <h1 className="font-display text-4xl sm:text-5xl">
        A new standard for <span className="text-gradient-gold">private banking.</span>
      </h1>
      <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
        NorthAxis was founded by veterans of global banking and Silicon Valley
        engineering with a single mission — make private wealth services
        instant, transparent, and beautiful.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          { t: "Our Mission", d: "Engineer the world's most elegant private bank." },
          { t: "Our Values", d: "Discretion, precision, and obsessive client service." },
          { t: "Our Reach", d: "Clients in 180 countries, 24/7 concierge support." },
        ].map((c) => (
          <div key={c.t} className="glass rounded-2xl p-6">
            <div className="font-display text-lg text-gold">{c.t}</div>
            <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        <div className="glass rounded-2xl p-8">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Founded
          </div>
          <div className="mt-2 font-display text-3xl">2021</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Headquartered in New York, with hubs in London, Singapore, and Dubai.
          </p>
        </div>
        <div className="glass rounded-2xl p-8">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Leadership
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Eleanor Hayes — Chief Executive Officer</li>
            <li>Marcus Reinhardt — Head of Operations</li>
            <li>Sofia Marchetti — Chief Wealth Strategist</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
