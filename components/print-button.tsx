"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-mist print:hidden"
    >
      <Printer size={16} aria-hidden="true" />
      Print / save PDF
    </button>
  );
}
