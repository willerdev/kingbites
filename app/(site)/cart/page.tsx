"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Container, PageIntro } from "@/components/container";
import { Quantity } from "@/components/quantity";
import { useCart } from "@/lib/cart";
import { FREE_DELIVERY_FROM, cartTotals, formatPrice, resolveCart } from "@/lib/format";
import { goldButtonClass } from "@/lib/styles";

export default function CartPage() {
  const { lines, setQty, removeItem, loaded } = useCart();
  const items = resolveCart(lines);
  const totals = cartTotals(items);
  const remaining = Math.max(0, FREE_DELIVERY_FROM - totals.subtotal);

  return (
    <>
      <PageIntro title="Your cart" subtitle="Review the order, then checkout for delivery." />
      <Container className="py-8 sm:py-10">
        {!loaded ? (
          <div className="h-48 animate-pulse rounded-3xl bg-mist" />
        ) : items.length === 0 ? (
          <div className="rounded-3xl bg-mist px-6 py-16 text-center">
            <p className="text-xl font-bold">Your cart is empty.</p>
            <p className="mt-2 text-neutral-500">Burgers, wings, and pizza are waiting.</p>
            <Link href="/menu" className={`${goldButtonClass} mt-6`}>
              Browse the menu
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 rounded-2xl border border-black/5 p-3 sm:p-4">
                  <Link href={`/menu/${item.id}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-mist">
                    <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/menu/${item.id}`} className="font-semibold hover:underline">
                        {item.name}
                      </Link>
                      <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}>
                        <Trash2 size={16} className="text-neutral-400" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">{formatPrice(item.price)}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <Quantity value={item.qty} onChange={(qty) => setQty(item.id, qty)} />
                      <p className="font-bold">{formatPrice(item.lineTotal)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="h-fit rounded-2xl bg-mist p-5">
              <h2 className="text-lg font-bold">Summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Delivery</dt>
                  <dd>{totals.deliveryFee === 0 ? "Free" : formatPrice(totals.deliveryFee)}</dd>
                </div>
                <div className="flex justify-between border-t border-black/10 pt-2 text-base font-bold">
                  <dt>Total</dt>
                  <dd>{formatPrice(totals.total)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-neutral-500">
                {remaining > 0
                  ? `Add ${formatPrice(remaining)} for free delivery.`
                  : "Free delivery unlocked."}
              </p>
              <Link href="/checkout" className={`${goldButtonClass} mt-5 w-full`}>
                Checkout
              </Link>
            </aside>
          </div>
        )}
      </Container>
    </>
  );
}
