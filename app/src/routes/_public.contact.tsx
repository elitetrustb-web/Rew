import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({
    meta: [
      { title: "Contact — NorthAxis Bank" },
      { name: "description", content: "Speak with a NorthAxis private banker." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent. A banker will contact you within 24 hours.");
      (e.target as HTMLFormElement).reset();
    }, 800);
  };
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2">
      <div>
        <h1 className="font-display text-4xl">
          Talk to a <span className="text-gradient-gold">private banker.</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Available 24/7. Average response under 4 hours.
        </p>
        <div className="mt-8 space-y-3 text-sm">
          <div>📍 350 Park Avenue, New York, NY</div>
          <div>📞 +1 (800) 555-NRTH</div>
          <div>✉️ concierge@northaxisbank.com</div>
        </div>
      </div>
      <form onSubmit={onSubmit} className="glass space-y-4 rounded-2xl p-6">
        <Field label="Full name">
          <input required className="input" placeholder="Your name" />
        </Field>
        <Field label="Email">
          <input required type="email" className="input" placeholder="you@email.com" />
        </Field>
        <Field label="How can we help?">
          <textarea required rows={4} className="input" />
        </Field>
        <button
          disabled={sending}
          className="w-full rounded-md gradient-gold py-2.5 text-sm font-semibold text-navy-deep disabled:opacity-60"
        >
          {sending ? "Sending..." : "Send message"}
        </button>
      </form>
      <style>{`
        .input { width:100%; background: oklch(0.21 0.035 260); border:1px solid var(--border); border-radius:.5rem; padding:.6rem .75rem; outline:none; color:inherit; }
        .input:focus { border-color: oklch(0.78 0.14 80 / .6); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
