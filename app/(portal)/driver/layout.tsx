import type { Metadata } from "next";
import { PortalShell } from "@/components/portal-shell";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: { default: "Rider", template: "%s · Rider · King's Bites" } };

const nav = [
  { href: "/driver", label: "Deliveries" },
  { href: "/driver/history", label: "History" },
  { href: "/driver/settings", label: "Settings" },
];

export default async function DriverLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser(["driver"], "/driver");
  return (
    <PortalShell title="Rider portal" nav={nav} user={user}>
      {children}
    </PortalShell>
  );
}
