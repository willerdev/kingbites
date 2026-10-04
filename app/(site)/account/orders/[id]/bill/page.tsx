import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bill } from "@/components/bill";
import { PrintButton } from "@/components/print-button";
import { getOrder } from "@/lib/data/orders";
import { requireUser } from "@/lib/session";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `Bill ${id}` };
}

export default async function BillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(["customer"], `/account/orders/${id}/bill`);
  const order = await getOrder(id);
  if (!order || order.userId !== user.id) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between gap-3 print:hidden">
        <Link href={`/account/orders/${order.id}`} className="text-sm font-semibold underline">
          ← Back to order
        </Link>
        <PrintButton />
      </div>
      <Bill order={order} />
    </div>
  );
}
