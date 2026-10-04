"use client";

import { goldButtonClass } from "@/lib/styles";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-neutral-500">The page did not finish loading. You can try it again.</p>
      <button type="button" onClick={reset} className={`${goldButtonClass} mt-6`}>
        Try again
      </button>
    </div>
  );
}
