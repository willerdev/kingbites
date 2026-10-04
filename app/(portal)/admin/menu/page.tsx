import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { setMenuAvailability } from "@/app/actions/admin";
import { MenuItemForm } from "@/components/admin/menu-item-form";
import { PortalHeading } from "@/components/portal-shell";
import { getCategory } from "@/lib/catalog";
import { listMenu } from "@/lib/data/menu";
import { formatPrice } from "@/lib/format";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Menu" };

export default async function AdminMenuPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireUser(["admin"], "/admin/menu");
  const { edit } = await searchParams;
  const menu = await listMenu({ includeUnavailable: true });
  const editing = edit ? menu.find((item) => item.id === edit) ?? null : null;

  return (
    <>
      <PortalHeading title="Menu" subtitle={`${menu.filter((item) => item.available).length} of ${menu.length} items available`} />
      <MenuItemForm key={editing?.id ?? "new"} item={editing} />
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Item</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 text-right font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {menu.map((item) => (
              <tr key={item.id} className={item.available ? "" : "bg-mist/60 text-neutral-500"}>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-3">
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-mist">
                      <Image src={item.image} alt="" fill sizes="40px" className="object-cover" />
                    </span>
                    <span>
                      <span className="block font-semibold">{item.name}</span>
                      {item.popular ? <span className="text-xs text-gold-deep">Popular</span> : null}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3">{getCategory(item.category)?.name}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatPrice(item.price)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      item.available ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {item.available ? "Available" : "Sold out"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex justify-end gap-2">
                    <Link href={`/admin/menu?edit=${item.id}`} className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-mist">
                      Edit
                    </Link>
                    <form action={setMenuAvailability.bind(null, item.id, !item.available)}>
                      <button type="submit" className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-mist">
                        {item.available ? "Mark sold out" : "Make available"}
                      </button>
                    </form>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
