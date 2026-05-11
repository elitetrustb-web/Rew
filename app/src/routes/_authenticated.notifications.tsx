import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { loadDB, updateDB } from "@/services/storage";
import { PageHeader, Badge } from "@/components/ui-kit";
import { formatDateTime } from "@/utils/format";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "Notifications — NorthAxis Bank" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { user } = useAuth();
  const [, setT] = useState(0);
  const items = loadDB().notifications.filter((n) => n.userId === user?.id);

  const markAll = () => {
    updateDB((db) => {
      db.notifications.forEach((n) => {
        if (n.userId === user?.id) n.read = true;
      });
    });
    setT((x) => x + 1);
  };

  const tone = (l: string) =>
    l === "success" ? "success" : l === "warning" ? "warning" : l === "alert" ? "danger" : "neutral";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle="Real-time alerts about your accounts."
        action={
          <button onClick={markAll} className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent">
            Mark all read
          </button>
        }
      />
      <div className="glass divide-y divide-border/60 rounded-2xl">
        {items.map((n) => (
          <div key={n.id} className="flex items-start gap-3 p-5">
            <span className={`mt-1.5 h-2 w-2 rounded-full ${n.read ? "bg-muted" : "bg-gold"}`} />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{n.title}</span>
                <Badge tone={tone(n.level) as never}>{n.level}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(n.createdAt)}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">All caught up.</div>
        )}
      </div>
    </div>
  );
}
