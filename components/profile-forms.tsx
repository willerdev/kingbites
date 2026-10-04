"use client";

import { useActionState } from "react";
import { changePassword, updateProfile, type FormResult } from "@/app/actions/orders";
import { fieldClass, goldButtonClass } from "@/lib/styles";

function Message({ state }: { state: FormResult }) {
  if (state?.error) return <p className="text-sm font-medium text-red-600">{state.error}</p>;
  if (state?.ok) return <p className="text-sm font-medium text-emerald-700">{state.ok}</p>;
  return null;
}

export function ProfileForm({ defaults }: { defaults: { name: string; phone: string; address: string } }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  return (
    <form action={action} className="space-y-4">
      <h2 className="text-xl font-bold">Profile</h2>
      <label className="block text-sm font-semibold">
        Name
        <input name="name" className={fieldClass} defaultValue={defaults.name} required />
      </label>
      <label className="block text-sm font-semibold">
        Phone
        <input name="phone" type="tel" className={fieldClass} defaultValue={defaults.phone} />
      </label>
      <label className="block text-sm font-semibold">
        Address
        <input name="address" className={fieldClass} defaultValue={defaults.address} />
      </label>
      <button type="submit" disabled={pending} className={goldButtonClass}>
        {pending ? "Saving…" : "Save profile"}
      </button>
      <Message state={state} />
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined);
  return (
    <form action={action} className="space-y-4">
      <h2 className="text-xl font-bold">Change password</h2>
      <label className="block text-sm font-semibold">
        Current password
        <input name="current" type="password" className={fieldClass} autoComplete="current-password" required />
      </label>
      <label className="block text-sm font-semibold">
        New password
        <input name="next" type="password" className={fieldClass} autoComplete="new-password" required />
      </label>
      <button type="submit" disabled={pending} className={goldButtonClass}>
        {pending ? "Saving…" : "Change password"}
      </button>
      <Message state={state} />
    </form>
  );
}
