import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { cancelOrder } from "@/app/actions/orders";
import { AutoRefresh } from "@/components/auto-refresh";
import { Bill } from "@/components/bill";
import { OrderTracker } from "@/components/order-tracker";
import { getOrder } from "@/lib/data/orders";
import { isActive } from "@/lib/order-status";
import { requireUser } from "@/lib/session";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order ${id}` };
}

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const [{ id }, { placed }] = await Promise.all([params, searchParams]);
  const user = await requireUser(["customer"], `/account/orders/${id}`);
  const order = await getOrder(id);
  if (!order || order.userId !== user.id) notFound();

  return (
    <div className="space-y-6">
      {isActive(order.status) ? <AutoRefresh seconds={10} /> : null}
      {placed ? (
        <p className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 size={18} aria-hidden="true" />
          Order placed. The kitchen has it, and this page updates on its own.
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/account/orders" className="text-sm font-semibold underline">
          ← All orders
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/account/orders/${order.id}/bill`}
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-mist"
          >
            View bill
          </Link>
          {order.status === "placed" ? (
            <form action={cancelOrder.bind(null, order.id)}>
              <button
                type="submit"
                className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
              >
                Cancel order
              </button>
            </form>
          ) : null}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <OrderTracker order={order} />
        <Bill order={order} />
      </div>
    </div>
  );
}
