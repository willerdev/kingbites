import type { Metadata } from "next";
import Link from "next/link";
import { resetPassword, setUserActive } from "@/app/actions/admin";
import { StaffForm } from "@/components/admin/staff-form";
import { PortalHeading } from "@/components/portal-shell";
import { sql } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Users & riders" };

const roleLabel = { customer: "Customer", driver: "Rider", admin: "Admin" } as const;
type RoleKey = keyof typeof roleLabel;

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const admin = await requireUser(["admin"], "/admin/users");
  const { role } = await searchParams;
  const filter = role && role in roleLabel ? (role as RoleKey) : null;
  const rows = filter
    ? await sql`
        SELECT u.*, (SELECT count(*) FROM orders o WHERE o.user_id = u.id OR o.driver_id = u.id) AS order_count
        FROM users u WHERE role = ${filter} ORDER BY created_at DESC LIMIT 300`
    : await sql`
        SELECT u.*, (SELECT count(*) FROM orders o WHERE o.user_id = u.id OR o.driver_id = u.id) AS order_count
        FROM users u ORDER BY (role = 'customer'), created_at DESC LIMIT 300`;

  return (
    <>
      <PortalHeading title="Users & riders" subtitle="Create rider and admin accounts. Customers sign up on the store." />
      <StaffForm />
      <div className="mb-4 mt-6 flex gap-2 overflow-x-auto">
        {[{ value: "", label: "Everyone" }, ...Object.entries(roleLabel).map(([value, label]) => ({ value, label }))].map(
          (entry) => (
            <Link
              key={entry.value}
              href={entry.value ? `/admin/users?role=${entry.value}` : "/admin/users"}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${
                (filter ?? "") === entry.value ? "bg-ink text-white" : "bg-white ring-1 ring-black/5"
              }`}
            >
              {entry.label}
            </Link>
          ),
        )}
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Orders</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {rows.map((row) => {
              const self = row.id === admin.id;
              return (
                <tr key={row.id} className={row.active ? "" : "bg-mist/60 text-neutral-400"}>
                  <td className="px-4 py-3">
                    <span className="block font-semibold">{row.name}</span>
                    <span className="text-xs text-neutral-400">@{row.username}</span>
                  </td>
                  <td className="px-4 py-3">
                    {roleLabel[row.role as RoleKey]}
                    {!row.active ? <span className="ml-2 text-xs">(disabled)</span> : null}
                  </td>
                  <td className="px-4 py-3">{row.phone || "—"}</td>
                  <td className="px-4 py-3">{Number(row.order_count)}</td>
                  <td className="px-4 py-3 text-neutral-500">{formatDate(new Date(row.created_at).toISOString())}</td>
                  <td className="px-4 py-3">
                    {self ? (
                      <span className="block text-right text-xs text-neutral-400">You</span>
                    ) : (
                      <span className="flex flex-wrap justify-end gap-2">
                        <form action={resetPassword.bind(null, row.id)} className="flex gap-1">
                          <input
                            name="password"
                            placeholder="New password"
                            minLength={6}
                            required
                            className="w-32 rounded-full border border-black/10 px-3 py-1.5 text-xs"
                          />
                          <button type="submit" className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-mist">
                            Reset
                          </button>
                        </form>
                        <form action={setUserActive.bind(null, row.id, !row.active)}>
                          <button
                            type="submit"
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                              row.active ? "border border-red-200 text-red-700 hover:bg-red-50" : "bg-ink text-white"
                            }`}
                          >
                            {row.active ? "Disable" : "Enable"}
                          </button>
                        </form>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
