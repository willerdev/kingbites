import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AutoRefresh } from "@/components/auto-refresh";
import { Container, PageIntro } from "@/components/container";
import { OrderTracker } from "@/components/order-tracker";
import { getOrder, listOrdersForUser } from "@/lib/data/orders";
import { isActive } from "@/lib/order-status";
import { homeFor, requireUser } from "@/lib/session";
import Link from "next/link";
import { goldButtonClass } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Follow a King's Bites delivery from the kitchen to your door.",
};

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const user = await requireUser(undefined, "/track");
  if (user.role !== "customer") redirect(homeFor(user.role));
  if (id) redirect(`/account/orders/${encodeURIComponent(id.trim().toUpperCase())}`);

  const active = (await listOrdersForUser(user.id)).filter((order) => isActive(order.status));
  const detailed = (await Promise.all(active.map((order) => getOrder(order.id)))).filter((order) => order !== null);

  return (
    <>
      <PageIntro title="Track your order" subtitle="Live status for every order on its way to you. This page refreshes on its own." />
      <Container className="space-y-6 py-8 sm:py-10">
        {detailed.length > 0 ? <AutoRefresh seconds={10} /> : null}
        {detailed.length === 0 ? (
          <div className="rounded-3xl bg-mist px-6 py-16 text-center">
            <p className="text-xl font-bold">No active deliveries.</p>
            <p className="mt-2 text-sm text-neutral-500">Past orders and bills live in your account.</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/menu" className={goldButtonClass}>
                Order now
              </Link>
              <Link href="/account/orders" className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold">
                Order history
              </Link>
            </div>
          </div>
        ) : (
          detailed.map((order) => (
            <div key={order.id} className="space-y-2">
              <OrderTracker order={order} />
              <Link href={`/account/orders/${order.id}`} className="inline-block text-sm font-semibold underline">
                Order details and bill
              </Link>
            </div>
          ))
        )}
      </Container>
    </>
  );
}
