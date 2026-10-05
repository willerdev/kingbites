import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DriverSelect, PaymentToggle, StatusActions } from "@/components/admin/order-controls";
import { AutoRefresh } from "@/components/auto-refresh";
import { Bill } from "@/components/bill";
import { DietaryAlert } from "@/components/dietary-alert";
import { OrderTracker } from "@/components/order-tracker";
import { PortalHeading } from "@/components/portal-shell";
import { PrintButton } from "@/components/print-button";
import { getOrder, listDrivers } from "@/lib/data/orders";
import { formatDate } from "@/lib/format";
import { isActive, statusLabel } from "@/lib/order-status";
import { requireUser } from "@/lib/session";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order ${id}` };
}

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireUser(["admin"], `/admin/orders/${id}`);
  const [order, drivers] = await Promise.all([getOrder(id), listDrivers()]);
  if (!order) notFound();

  return (
    <>
      {isActive(order.status) ? <AutoRefresh seconds={15} /> : null}
      <Link href="/admin/orders" className="text-sm font-semibold underline print:hidden">
        ← All orders
      </Link>
      <PortalHeading title={`Order ${order.id}`} subtitle={`Placed ${formatDate(order.createdAt)}`} action={<PrintButton />} />
      <div className="mb-6 grid gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/5 md:grid-cols-3 print:hidden">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Status</p>
          <StatusActions order={order} />
          {!isActive(order.status) ? <p className="text-sm text-neutral-500">{statusLabel(order.status)}</p> : null}
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Rider</p>
          {isActive(order.status) ? (
            <DriverSelect order={order} drivers={drivers} />
          ) : (
            <p className="text-sm">{order.driver?.name ?? "—"}</p>
          )}
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Payment</p>
          <PaymentToggle order={order} />
        </div>
      </div>
      <div className="mb-6">
        <DietaryAlert info={order.dietary} title="Prepare with care — customer health requirements" />
      </div>
      {order.notes ? (
        <p className="mb-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">Customer note: “{order.notes}”</p>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6 print:hidden">
          <div className="rounded-3xl bg-white">
            <OrderTracker order={order} />
          </div>
          <section className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
            <h2 className="font-bold">Activity</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {order.events.map((event, index) => (
                <li key={index} className="flex justify-between gap-3">
                  <span>
                    <span className="font-semibold">{statusLabel(event.status)}</span>
                    {event.note ? <span className="text-neutral-500"> · {event.note}</span> : null}
                  </span>
                  <span className="shrink-0 text-xs text-neutral-400">{formatDate(event.createdAt)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <Bill order={order} />
      </div>
    </>
  );
}
