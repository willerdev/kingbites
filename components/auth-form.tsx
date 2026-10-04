"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup, type AuthState } from "@/app/actions/auth";
import { fieldClass, goldButtonClass } from "@/lib/styles";

export function AuthForm({ mode, next }: { mode: "login" | "signup"; next: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(mode === "login" ? login : signup, undefined);
  const fields = state?.fields ?? {};
  const suffix = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      {mode === "signup" ? (
        <label className="block text-sm font-semibold">
          Full name
          <input name="name" className={fieldClass} defaultValue={fields.name} autoComplete="name" required />
        </label>
      ) : null}
      <label className="block text-sm font-semibold">
        Username
        <input
          name="username"
          className={fieldClass}
          defaultValue={fields.username}
          autoComplete="username"
          autoCapitalize="none"
          required
        />
      </label>
      {mode === "signup" ? (
        <>
          <label className="block text-sm font-semibold">
            Phone
            <input
              name="phone"
              type="tel"
              className={fieldClass}
              defaultValue={fields.phone}
              placeholder="+250 7XX XXX XXX"
              autoComplete="tel"
              required
            />
          </label>
          <label className="block text-sm font-semibold">
            Delivery address <span className="font-normal text-neutral-400">(optional)</span>
            <input
              name="address"
              className={fieldClass}
              defaultValue={fields.address}
              placeholder="KG 14 Ave, Kimihurura"
              autoComplete="street-address"
            />
          </label>
        </>
      ) : null}
      <label className="block text-sm font-semibold">
        Password
        <input
          name="password"
          type="password"
          className={fieldClass}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
        />
      </label>
      {state?.error ? (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={`${goldButtonClass} w-full`}>
        {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </button>
      <p className="text-center text-sm text-neutral-500">
        {mode === "login" ? (
          <>
            New to King&apos;s Bites?{" "}
            <Link href={`/signup${suffix}`} className="font-semibold text-ink underline">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href={`/login${suffix}`} className="font-semibold text-ink underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
