import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { getPending, resendOtp, verifyOtp } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/verify-otp")({
  head: () => ({ meta: [{ title: "Verify — NorthAxis Bank" }] }),
  component: VerifyOtpPage,
});

function VerifyOtpPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(getPending());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!pending) {
      toast.error("No pending verification. Please log in.");
      navigate({ to: "/login" });
      return;
    }
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!pending) return null;

  const resendIn = Math.max(0, Math.ceil((pending.resendAt - now) / 1000));
  const expiresIn = Math.max(0, Math.ceil((pending.expiresAt - now) / 1000));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp(code.trim());
      refresh();
      toast.success("Signed in successfully");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    try {
      const next = await resendOtp();
      setPending(next);
      toast.success(`New code sent. Demo: ${next.code}`, { duration: 8000 });
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <AuthShell
      title="Verify your identity"
      subtitle={`We sent a 6-digit code to ${pending.email}.`}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Verification code">
          <input
            required
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="auth-input tracking-[0.5em] text-center text-lg"
            placeholder="••••••"
          />
        </Field>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Code expires in {Math.floor(expiresIn / 60)}:{String(expiresIn % 60).padStart(2, "0")}</span>
          <button
            type="button"
            onClick={onResend}
            disabled={resendIn > 0}
            className="text-gold disabled:text-muted-foreground"
          >
            {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
          </button>
        </div>
        <button
          disabled={loading || code.length !== 6}
          className="w-full rounded-md gradient-gold py-2.5 text-sm font-semibold text-navy-deep disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify & continue"}
        </button>
      </form>
    </AuthShell>
  );
}
