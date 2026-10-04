import type { Metadata } from "next";
import { PortalHeading } from "@/components/portal-shell";
import { PasswordForm, ProfileForm } from "@/components/profile-forms";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const user = await requireUser(["admin"], "/admin/settings");
  return (
    <>
      <PortalHeading title="Settings" subtitle="Update your details. Change the default admin password before going live." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
          <ProfileForm defaults={{ name: user.name, phone: user.phone, address: user.address }} />
        </div>
        <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
          <PasswordForm />
        </div>
      </div>
    </>
  );
}
