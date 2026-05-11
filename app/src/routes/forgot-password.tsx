import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — NorthAxis Bank" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
    toast.success("If that account exists, we sent reset instructions.");
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll send you a secure reset link."
    >
      {sent ? (
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Check <span className="text-foreground">{email}</span> for a reset link.
            For this demo, please use one of the seeded credentials shown on the
            sign-in page.
          </p>
          <Link to="/login" className="inline-block text-gold hover:underline">
            ← Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </Field>
          <button className="w-full rounded-md gradient-gold py-2.5 text-sm font-semibold text-navy-deep">
            Send reset link
          </button>
          <Link to="/login" className="block text-center text-xs text-muted-foreground hover:text-gold">
            ← Back to sign in
          </Link>
        </form>
      )}
    </AuthShell>
  );
}
