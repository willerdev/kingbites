import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { PageIntro } from "@/components/container";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await requireUser(["customer"], "/checkout");
  return (
    <>
      <PageIntro title="Checkout" subtitle="Confirm where we are delivering and how you will pay." />
      <CheckoutForm defaults={{ name: user.name, phone: user.phone, address: user.address }} />
    </>
  );
}
