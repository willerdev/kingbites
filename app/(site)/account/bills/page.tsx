import type { Metadata } from "next";
import Link from "next/link";
import { PaymentBadge } from "@/components/status-badge";
import { listOrdersForUser } from "@/lib/data/orders";
import { formatDate, formatPrice, paymentLabel } from "@/lib/format";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Bills" };

export default async function BillsPage() {
  const user = await requireUser(["customer"], "/account/bills");
  const bills = (await listOrdersForUser(user.id)).filter((order) => order.status !== "cancelled");
  const paid = bills.filter((bill) => bill.paymentStatus === "paid").reduce((sum, bill) => sum + bill.total, 0);
  const unpaid = bills.filter((bill) => bill.paymentStatus === "unpaid").reduce((sum, bill) => sum + bill.total, 0);

  return (
    <div className="space-y-6">
      <dl className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-mist px-5 py-4">
          <dt className="text-sm text-neutral-500">Bills</dt>
          <dd className="mt-1 text-2xl font-extrabold">{bills.length}</dd>
        </div>
        <div className="rounded-2xl bg-mist px-5 py-4">
          <dt className="text-sm text-neutral-500">Paid</dt>
          <dd className="mt-1 text-2xl font-extrabold">{formatPrice(paid)}</dd>
        </div>
        <div className="rounded-2xl bg-mist px-5 py-4">
          <dt className="text-sm text-neutral-500">Outstanding</dt>
          <dd className="mt-1 text-2xl font-extrabold">{formatPrice(unpaid)}</dd>
        </div>
      </dl>
      {bills.length === 0 ? (
        <p className="rounded-2xl bg-mist px-5 py-10 text-center text-sm text-neutral-500">
          Bills appear here after your first order.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-black/5">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-mist text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Bill</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-mist/60">
                  <td className="px-4 py-3">
                    <Link href={`/account/orders/${bill.id}/bill`} className="font-semibold underline">
                      {bill.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{formatDate(bill.createdAt)}</td>
                  <td className="px-4 py-3">{paymentLabel(bill.paymentMethod)}</td>
                  <td className="px-4 py-3">
                    <PaymentBadge status={bill.paymentStatus} />
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{formatPrice(bill.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
