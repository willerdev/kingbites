import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container, PageIntro } from "@/components/container";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to King's Bites in Kigali.",
};

export default function ContactPage() {
  return (
    <>
      <PageIntro title="Contact" subtitle="Questions about an order, a kitchen, or delivering in a new neighborhood." />
      <Container className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <ContactForm />
        <aside className="space-y-4 text-sm">
          <p className="flex gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0 text-gold-deep" aria-hidden="true" />
            KG 7 Ave, Kimihurura, Kigali
          </p>
          <p className="flex gap-3">
            <Phone size={18} className="shrink-0 text-gold-deep" aria-hidden="true" />
            +250 788 000 000
          </p>
          <p className="flex gap-3">
            <Mail size={18} className="shrink-0 text-gold-deep" aria-hidden="true" />
            hello@kingsbites.rw
          </p>
        </aside>
      </Container>
    </>
  );
}
