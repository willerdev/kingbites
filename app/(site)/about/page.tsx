import type { Metadata } from "next";
import { Container, PageIntro } from "@/components/container";
import { categories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "About",
  description: "King's Bites is one kitchen in Kimihurura delivering across Kigali.",
};

const values = [
  {
    title: "Fast",
    copy: "We cook to order and our riders leave as soon as the bag is sealed.",
  },
  {
    title: "Fresh",
    copy: "A short menu, one kitchen, and food that is packed for the ride.",
  },
  {
    title: "Delicious",
    copy: "Burgers, wings, pizza, and wraps chosen because people order them again.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        title="Rule your hunger."
        subtitle="King's Bites is one kitchen in Kimihurura with its own riders. One menu, one cart, a rider who knows the neighborhood."
      />
      <Container className="py-12">
        <dl className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Kitchen", value: "Kimihurura" },
            { label: "Menu categories", value: String(categories.length) },
            { label: "Typical ride", value: "25 min" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-mist px-5 py-6">
              <dt className="text-sm text-neutral-500">{stat.label}</dt>
              <dd className="mt-1 text-3xl font-extrabold">{stat.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold">From Kimihurura outward</h2>
            <span className="mt-2 block h-1 w-10 rounded-full bg-gold" />
            <p className="mt-4 text-neutral-600">
              King&apos;s Bites opened in Kimihurura with a short board: a beef burger, wings, a wrap, and fries.
              Pizza, drinks, and desserts followed. Everything still comes out of the same kitchen.
            </p>
            <p className="mt-4 text-neutral-600">
              Create an account to order, keep every bill, and follow your rider from our counter to your door.
            </p>
          </div>
          <div className="grid gap-3">
            {values.map((value) => (
              <article key={value.title} className="rounded-2xl border border-black/5 p-5">
                <h3 className="font-bold">{value.title}</h3>
                <p className="mt-1 text-sm text-neutral-600">{value.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
