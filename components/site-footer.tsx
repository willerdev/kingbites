import Link from "next/link";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/track", label: "Track Order" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const social = [
  {
    label: "Facebook",
    path: "M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.2l.8-3H13V9c0-.6.4-1 1-1z",
  },
  {
    label: "Instagram",
    path: "M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4zm8 2H8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm-4 2.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zM16.7 7.1a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9z",
  },
  {
    label: "X",
    path: "M6 6h2.4l3.3 4.4L15.4 6H18l-4.7 6.1L18.2 18h-2.4l-3.6-4.8L8.6 18H6l5-6.5L6 6z",
  },
  {
    label: "YouTube",
    path: "M20.5 8.2a2.5 2.5 0 0 0-1.8-1.8C17.2 6 12 6 12 6s-5.2 0-6.7.4A2.5 2.5 0 0 0 3.5 8.2 26 26 0 0 0 3 12a26 26 0 0 0 .5 3.8 2.5 2.5 0 0 0 1.8 1.8C6.8 18 12 18 12 18s5.2 0 6.7-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 21 12a26 26 0 0 0-.5-3.8zM10.5 14.8V9.2L15.2 12l-4.7 2.8z",
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink text-white">
      <Container className="grid gap-8 py-10 md:grid-cols-[1.2fr_1.4fr_auto] md:items-center">
        <Logo />
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gold">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {social.map((item) => (
              <span
                key={item.label}
                title={item.label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/80"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
                  <path fill="currentColor" d={item.path} />
                </svg>
                <span className="sr-only">{item.label}</span>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="rounded-lg border border-white/15 px-3 py-1.5 text-[10px] leading-tight">
              <span className="block text-white/60">GET IT ON</span>
              <span className="text-sm font-semibold">Google Play</span>
            </span>
            <span className="rounded-lg border border-white/15 px-3 py-1.5 text-[10px] leading-tight">
              <span className="block text-white/60">Download on the</span>
              <span className="text-sm font-semibold">App Store</span>
            </span>
          </div>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="py-4 text-xs text-white/50">
          © {new Date().getFullYear()} King’s Bites. Kimihurura, Kigali.
        </Container>
      </div>
    </footer>
  );
}
