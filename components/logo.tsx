import Link from "next/link";

export function Crown({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M5 34.5h38L40.6 18.2 32 25.6 24 7.5 16 25.6 7.4 18.2 5 34.5zm3.2 3.2h31.6V41H8.2v-3.3z"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-white">
      <Crown className="h-9 w-9 shrink-0 text-gold" />
      <span className="leading-none">
        <span className="block text-[15px] font-extrabold tracking-tight">
          KING’S <span className="text-gold">BITES</span>
        </span>
        <span className="mt-1 block text-[10px] font-medium tracking-wide text-white/70">
          Rule Your Hunger.
        </span>
      </span>
    </Link>
  );
}
