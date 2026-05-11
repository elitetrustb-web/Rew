import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { register } from "@/services/auth";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Open Account — NorthAxis Bank" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const { devOtp } = await register(form);
      toast.success(`Account created. OTP: ${devOtp}`, { duration: 8000 });
      navigate({ to: "/verify-otp" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Open your account" subtitle="Approval in minutes — no paperwork.">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Full name">
          <input required value={form.name} onChange={set("name")} className="auth-input" />
        </Field>
        <Field label="Email">
          <input required type="email" value={form.email} onChange={set("email")} className="auth-input" />
        </Field>
        <Field label="Phone">
          <input required value={form.phone} onChange={set("phone")} className="auth-input" placeholder="+1 (555) 555-5555" />
        </Field>
        <Field label="Password">
          <input required type="password" value={form.password} onChange={set("password")} className="auth-input" />
        </Field>
        <button
          disabled={loading}
          className="w-full rounded-md gradient-gold py-2.5 text-sm font-semibold text-navy-deep disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-gold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
