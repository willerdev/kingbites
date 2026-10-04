"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { createSession, deleteSession, homeFor } from "@/lib/session";
import type { Role } from "@/lib/types";

export type AuthState = { error?: string; fields?: Record<string, string> } | undefined;

const USERNAME = /^[a-z0-9._-]{3,32}$/;

function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "";
}

export async function signup(_state: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fields = { name, username, phone, address };

  if (name.length < 2) return { error: "Enter your name.", fields };
  if (!USERNAME.test(username))
    return { error: "Usernames are 3–32 characters: letters, numbers, dots, dashes, or underscores.", fields };
  if (phone.replace(/\D/g, "").length < 9) return { error: "Enter a phone number the rider can call.", fields };
  if (password.length < 6) return { error: "Use a password of at least 6 characters.", fields };

  const taken = await sql`SELECT 1 FROM users WHERE username = ${username}`;
  if (taken.length > 0) return { error: "That username is taken. Try another.", fields };

  const hash = await bcrypt.hash(password, 10);
  const [user] = await sql`
    INSERT INTO users (username, name, phone, address, password_hash, role)
    VALUES (${username}, ${name}, ${phone}, ${address}, ${hash}, 'customer')
    RETURNING id`;
  await createSession(user.id as string);
  redirect(safeNext(formData.get("next")) || "/account");
}

export async function login(_state: AuthState, formData: FormData): Promise<AuthState> {
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fields = { username };
  if (!username || !password) return { error: "Enter your username and password.", fields };

  const [user] = await sql`SELECT id, password_hash, role, active FROM users WHERE username = ${username}`;
  const valid = user ? await bcrypt.compare(password, user.password_hash as string) : false;
  if (!user || !valid) return { error: "That username and password do not match.", fields };
  if (!user.active) return { error: "This account is disabled. Contact the restaurant.", fields };

  await createSession(user.id as string);
  const role = user.role as Role;
  const next = safeNext(formData.get("next"));
  redirect(next && (role === "customer" || next.startsWith(homeFor(role))) ? next : homeFor(role));
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
