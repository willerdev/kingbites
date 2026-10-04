import type { Metadata } from "next";
import { MenuBrowser } from "@/components/menu-browser";
import { PageIntro } from "@/components/container";
import { listMenu } from "@/lib/data/menu";

export const metadata: Metadata = {
  title: "Menu",
  description: "Browse burgers, chicken, pizza, fries, wraps, drinks, and desserts.",
};

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[]; q?: string | string[]; address?: string | string[] }>;
}) {
  const [params, menu] = await Promise.all([searchParams, listMenu()]);
  return (
    <>
      <PageIntro
        title="The menu"
        subtitle="One kitchen, cooked to order. Prices are in Rwandan francs."
      />
      <MenuBrowser
        menu={menu}
        initialCategory={one(params.category)}
        initialQuery={one(params.q)}
        initialAddress={one(params.address)}
      />
    </>
  );
}
