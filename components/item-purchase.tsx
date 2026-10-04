"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Quantity } from "@/components/quantity";
import { useCart } from "@/lib/cart";
import { goldButtonClass } from "@/lib/styles";
import type { CartLine } from "@/lib/types";

export function ItemPurchase({ product }: { product: Omit<CartLine, "qty"> }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <Quantity value={qty} onChange={(next) => setQty(Math.max(1, next))} />
      <button type="button" onClick={() => addItem(product, qty)} className={goldButtonClass}>
        <ShoppingCart size={16} aria-hidden="true" />
        Add to Cart
      </button>
    </div>
  );
}
