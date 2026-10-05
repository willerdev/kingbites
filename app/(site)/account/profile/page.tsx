import type { Metadata } from "next";
import { PasswordForm, ProfileForm } from "@/components/profile-forms";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await requireUser(["customer"], "/account/profile");
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <ProfileForm
        defaults={{ name: user.name, phone: user.phone, address: user.address }}
        dietary={{
          allergies: user.allergies,
          sugarTolerance: user.sugarTolerance,
          medicalRestrictions: user.medicalRestrictions,
        }}
      />
      <PasswordForm />
    </div>
  );
}
