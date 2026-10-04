"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { placeOrder } from "@/app/actions/orders";
import { Container } from "@/components/container";
import { useCart } from "@/lib/cart";
import { useDeliveryAddress } from "@/lib/location";
import { cartTotals, formatPrice, paymentLabel, resolveCart } from "@/lib/format";
import { fieldClass, goldButtonClass } from "@/lib/styles";
import type { PaymentMethod } from "@/lib/types";

const methods: PaymentMethod[] = ["momo", "airtel", "cash"];

type Defaults = { name: string; phone: string; address: string };

export function CheckoutForm({ defaults }: { defaults: Defaults }) {
  const router = useRouter();
  const { lines, clear, loaded } = useCart();
  const { address: savedAddress } = useDeliveryAddress();
  const items = resolveCart(lines);
  const totals = cartTotals(items);
  const [draft, setDraft] = useState<{
    name: string;
    phone: string;
    address: string;
    notes: string;
    payment: PaymentMethod;
    saveAddress: boolean;
  } | null>(null);
  const form = draft ?? {
    name: defaults.name,
    phone: defaults.phone,
    address: defaults.address || savedAddress,
    notes: "",
    payment: "momo" as const,
    saveAddress: !defaults.address,
  };
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await placeOrder({
        ...form,
        lines: lines.map((line) => ({ id: line.id, qty: line.qty })),
      });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      clear();
      router.push(`/account/orders/${result.orderId}?placed=1`);
    });
  }

  if (!loaded) {
    return (
      <Container className="py-8 sm:py-10">
        <div className="h-48 animate-pulse rounded-3xl bg-mist" />
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container className="py-8 sm:py-10">
        <div className="rounded-3xl bg-mist px-6 py-16 text-center">
          <p className="text-xl font-bold">Nothing to check out.</p>
          <Link href="/menu" className={`${goldButtonClass} mt-6`}>
            Browse the menu
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-10">
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Name
              <input
                className={fieldClass}
                value={form.name}
                onChange={(event) => setDraft({ ...form, name: event.target.value })}
                required
              />
            </label>
            <label className="block text-sm font-semibold">
              Phone
              <input
                type="tel"
                className={fieldClass}
                value={form.phone}
                onChange={(event) => setDraft({ ...form, phone: event.target.value })}
                placeholder="+250 7XX XXX XXX"
                required
              />
            </label>
          </div>
          <label className="block text-sm font-semibold">
            Delivery address
            <input
              className={fieldClass}
              value={form.address}
              onChange={(event) => setDraft({ ...form, address: event.target.value })}
              placeholder="Street, building, landmark"
              required
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-600">
            <input
              type="checkbox"
              checked={form.saveAddress}
              onChange={(event) => setDraft({ ...form, saveAddress: event.target.checked })}
            />
            Save this phone and address to my account
          </label>
          <label className="block text-sm font-semibold">
            Notes for the kitchen or rider <span className="font-normal text-neutral-400">(optional)</span>
            <textarea
              className={`${fieldClass} min-h-20`}
              value={form.notes}
              onChange={(event) => setDraft({ ...form, notes: event.target.value })}
              placeholder="Gate code, no onions, call on arrival…"
            />
          </label>
          <fieldset>
            <legend className="text-sm font-semibold">Payment</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {methods.map((method) => (
                <label
                  key={method}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm ${
                    form.payment === method ? "border-gold bg-gold/10" : "border-black/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={form.payment === method}
                    onChange={() => setDraft({ ...form, payment: method })}
                  />
                  {paymentLabel(method)}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              Mobile money is confirmed by the restaurant. Cash is collected by your rider at the door.
            </p>
          </fieldset>
          {error ? (
            <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={pending} className={`${goldButtonClass} w-full sm:w-auto`}>
            {pending ? "Placing order…" : `Place order · ${formatPrice(totals.total)}`}
          </button>
        </div>
        <aside className="h-fit rounded-2xl bg-mist p-5">
          <h2 className="font-bold">Order summary</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span>
                  {item.qty} × {item.name}
                </span>
                <span>{formatPrice(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex justify-between border-t border-black/10 pt-3 text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(totals.subtotal)}</span>
          </p>
          <p className="mt-1 flex justify-between text-sm">
            <span>Delivery</span>
            <span>{totals.deliveryFee === 0 ? "Free" : formatPrice(totals.deliveryFee)}</span>
          </p>
          <p className="mt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(totals.total)}</span>
          </p>
          <p className="mt-3 text-xs text-neutral-500">Final prices are confirmed by the kitchen when you order.</p>
        </aside>
      </form>
    </Container>
  );
}
