import { Container, PageIntro } from "@/components/container";
import { TabNav } from "@/components/tab-nav";

const tabs = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/bills", label: "Bills" },
  { href: "/account/profile", label: "Profile" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageIntro title="My account" subtitle="Your orders, bills, and deliveries in one place." />
      <Container className="pt-4 print:hidden">
        <TabNav tabs={tabs} exact={["/account"]} />
      </Container>
      <Container className="py-8">{children}</Container>
    </>
  );
}
