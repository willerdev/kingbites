import { CartToast, SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getCurrentUser } from "@/lib/session";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const userPromise = getCurrentUser();
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <SiteHeader userPromise={userPromise} />
      <main id="content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <CartToast />
    </>
  );
}
