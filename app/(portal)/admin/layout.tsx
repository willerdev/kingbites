import type { Metadata } from "next";
import { PortalShell } from "@/components/portal-shell";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin · King's Bites" } };

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/users", label: "Users & riders" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser(["admin"], "/admin");
  return (
    <PortalShell title="Admin portal" nav={nav} user={user}>
      {children}
    </PortalShell>
  );
}
