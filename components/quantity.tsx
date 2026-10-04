"use client";

import { Minus, Plus } from "lucide-react";

export function Quantity({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-black/10">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-mist"
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="min-w-6 text-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-mist"
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
