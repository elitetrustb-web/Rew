import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Brand } from "@/components/Brand";
import { loginWithPassword } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — NorthAxis Bank" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, hydrated } = useAuth();
  const [email, setEmail] = useState("demo@northaxisbank.com");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && session) navigate({ to: "/dashboard" });
  }, [session, hydrated, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { devOtp } = await loginWithPassword(email, password);
      toast.success(`OTP sent. Demo code: ${devOtp}`, { duration: 8000 });
      navigate({ to: "/verify-otp" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your private banking dashboard.">
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
        <Field label="Password">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />
        </Field>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-gold hover:underline">
            Forgot password?
          </Link>
        </div>
        <button
          disabled={loading}
          className="w-full rounded-md gradient-gold py-2.5 text-sm font-semibold text-navy-deep disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Continue"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to NorthAxis?{" "}
        <Link to="/register" className="text-gold hover:underline">
          Open an account
        </Link>
      </p>
      <DemoHint />
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between gradient-navy p-10 lg:flex">
        <Brand />
        <div>
          <h2 className="font-display text-4xl">
            Private banking, <span className="text-gradient-gold">redefined.</span>
          </h2>
          <p className="mt-4 max-w-sm text-muted-foreground">
            Your wealth, accessible globally and protected with bank-grade
            security.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} NorthAxis Bank
        </div>
      </div>
      <div className="grid place-items-center px-4 py-10 sm:px-8">
        <div className="glass w-full max-w-md rounded-2xl p-8">
          <div className="lg:hidden">
            <Brand />
          </div>
          <h1 className="mt-6 font-display text-2xl">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
          <div className="mt-6">{children}</div>
        </div>
      </div>
      <style>{`
        .auth-input { width:100%; background: oklch(0.18 0.03 260); border:1px solid var(--border); border-radius:.5rem; padding:.6rem .75rem; outline:none; color:inherit; font-size:.875rem; }
        .auth-input:focus { border-color: oklch(0.78 0.14 80 / .6); }
      `}</style>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function DemoHint() {
  return (
    <div className="mt-6 rounded-lg border border-gold/20 bg-gold/5 p-3 text-xs text-muted-foreground">
      <div className="mb-1 font-semibold text-gold">Demo accounts</div>
      <div>demo@northaxisbank.com / demo1234 (user)</div>
      <div>admin@northaxisbank.com / admin1234 (super admin)</div>
      <div>operations@northaxisbank.com / opsadmin123 (admin)</div>
    </div>
  );
}
