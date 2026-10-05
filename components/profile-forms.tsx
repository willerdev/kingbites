"use client";

import { useActionState } from "react";
import { changePassword, updateProfile, type FormResult } from "@/app/actions/orders";
import { sugarOptions } from "@/lib/dietary";
import { fieldClass, goldButtonClass } from "@/lib/styles";
import type { DietaryInfo } from "@/lib/types";

function Message({ state }: { state: FormResult }) {
  if (state?.error) return <p className="text-sm font-medium text-red-600">{state.error}</p>;
  if (state?.ok) return <p className="text-sm font-medium text-emerald-700">{state.ok}</p>;
  return null;
}

export function ProfileForm({
  defaults,
  dietary,
}: {
  defaults: { name: string; phone: string; address: string };
  dietary?: DietaryInfo;
}) {
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
      {dietary ? (
        <fieldset className="space-y-4 rounded-2xl border border-black/10 p-4">
          <legend className="px-1 text-sm font-bold">Health &amp; dietary needs</legend>
          <p className="text-xs text-neutral-500">
            Added to every order you place so the kitchen sees it while preparing your food.
          </p>
          <label className="block text-sm font-semibold">
            Allergies
            <textarea
              name="allergies"
              className={`${fieldClass} min-h-16`}
              defaultValue={dietary.allergies}
              placeholder="e.g. peanuts, shellfish, gluten, dairy"
              maxLength={500}
            />
          </label>
          <label className="block text-sm font-semibold">
            Sugar tolerance
            <select name="sugarTolerance" className={fieldClass} defaultValue={dietary.sugarTolerance}>
              {sugarOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Medical restrictions
            <textarea
              name="medicalRestrictions"
              className={`${fieldClass} min-h-16`}
              defaultValue={dietary.medicalRestrictions}
              placeholder="e.g. low sodium, no spicy food, halal only"
              maxLength={500}
            />
          </label>
        </fieldset>
      ) : null}
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
