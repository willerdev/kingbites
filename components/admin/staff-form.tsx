"use client";

import { useActionState } from "react";
import { createStaff } from "@/app/actions/admin";
import { fieldClass, goldButtonClass } from "@/lib/styles";

export function StaffForm() {
  const [state, action, pending] = useActionState(createStaff, undefined);
  return (
    <form action={action} className="grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-black/5 sm:grid-cols-2 xl:grid-cols-5">
      <h2 className="text-lg font-bold sm:col-span-2 xl:col-span-5">Add a rider or admin</h2>
      <label className="block text-sm font-semibold">
        Name
        <input name="name" className={fieldClass} required />
      </label>
      <label className="block text-sm font-semibold">
        Username
        <input name="username" className={fieldClass} autoCapitalize="none" required />
      </label>
      <label className="block text-sm font-semibold">
        Phone
        <input name="phone" type="tel" className={fieldClass} placeholder="+250 7XX XXX XXX" />
      </label>
      <label className="block text-sm font-semibold">
        Temporary password
        <input name="password" type="text" className={fieldClass} autoComplete="off" required />
      </label>
      <label className="block text-sm font-semibold">
        Role
        <select name="role" className={fieldClass} defaultValue="driver">
          <option value="driver">Rider (delivery)</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2 xl:col-span-5">
        <button type="submit" disabled={pending} className={goldButtonClass}>
          {pending ? "Creating…" : "Create account"}
        </button>
        {state?.error ? <p className="text-sm font-medium text-red-600">{state.error}</p> : null}
        {state?.ok ? <p className="text-sm font-medium text-emerald-700">{state.ok}</p> : null}
      </div>
    </form>
  );
}
