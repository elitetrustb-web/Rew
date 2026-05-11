import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — NorthAxis Bank" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Manage your profile and preferences." />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Profile updated");
        }}
        className="glass grid gap-4 rounded-2xl p-6 md:grid-cols-2"
      >
        <Field label="Full name" defaultValue={user?.name} />
        <Field label="Email" defaultValue={user?.email} />
        <Field label="Phone" defaultValue={user?.phone} />
        <Field label="Role" defaultValue={user?.role} disabled />
        <div className="md:col-span-2 flex justify-end">
          <button className="rounded-md gradient-gold px-5 py-2.5 text-sm font-semibold text-navy-deep">
            Save changes
          </button>
        </div>
        <style>{`
          .auth-input { background: oklch(0.21 0.035 260); border:1px solid var(--border); border-radius:.5rem; padding:.55rem .75rem; outline:none; color:inherit; font-size:.875rem; width:100%; }
        `}</style>
      </form>
    </div>
  );
}

function Field({ label, defaultValue, disabled }: { label: string; defaultValue?: string; disabled?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input defaultValue={defaultValue} disabled={disabled} className="auth-input disabled:opacity-60" />
    </label>
  );
}
