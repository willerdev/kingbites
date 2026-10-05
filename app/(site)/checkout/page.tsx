import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";
import { Container, PageIntro } from "@/components/container";
import { DietaryAlert } from "@/components/dietary-alert";
import { hasDietary } from "@/lib/dietary";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await requireUser(["customer"], "/checkout");
  const dietary = {
    allergies: user.allergies,
    sugarTolerance: user.sugarTolerance,
    medicalRestrictions: user.medicalRestrictions,
  };
  return (
    <>
      <PageIntro title="Checkout" subtitle="Confirm where we are delivering and how you will pay." />
      <Container className="pt-8">
        {hasDietary(dietary) ? (
          <div className="space-y-2">
            <DietaryAlert info={dietary} title="The kitchen will see this with your order" />
            <Link href="/account/profile" className="text-sm font-semibold underline">
              Update health &amp; dietary needs
            </Link>
          </div>
        ) : (
          <p className="rounded-2xl bg-mist px-4 py-3 text-sm text-neutral-600">
            Allergies, sugar limits, or medical restrictions?{" "}
            <Link href="/account/profile" className="font-semibold text-ink underline">
              Add them to your profile
            </Link>{" "}
            and the kitchen will see them on every order.
          </p>
        )}
      </Container>
      <CheckoutForm defaults={{ name: user.name, phone: user.phone, address: user.address }} />
    </>
  );
}
