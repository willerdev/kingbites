import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { toSugarTolerance } from "@/lib/dietary";
import type { Role, SessionUser } from "@/lib/types";

export const SESSION_COOKIE = "kb_session";
const SESSION_DAYS = 30;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await sql`INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (${hashToken(token)}, ${userId}, ${expiresAt})`;
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function deleteSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await sql`DELETE FROM sessions WHERE token_hash = ${hashToken(token)}`;
  store.delete(SESSION_COOKIE);
}

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const rows = await sql`
    SELECT u.id, u.username, u.name, u.phone, u.address, u.role,
           u.allergies, u.sugar_tolerance, u.medical_restrictions
    FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${hashToken(token)} AND s.expires_at > now() AND u.active`;
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    phone: row.phone,
    address: row.address,
    role: row.role as Role,
    allergies: row.allergies,
    sugarTolerance: toSugarTolerance(row.sugar_tolerance),
    medicalRestrictions: row.medical_restrictions,
  };
});

export function homeFor(role: Role) {
  if (role === "admin") return "/admin";
  if (role === "driver") return "/driver";
  return "/account";
}

/** Redirects to sign-in when signed out, or to the user's own portal when the role does not match. */
export async function requireUser(roles?: Role[], next?: string) {
  const user = await getCurrentUser();
  if (!user) redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  if (roles && !roles.includes(user.role)) redirect(homeFor(user.role));
  return user;
}
