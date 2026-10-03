"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

/** Loads the saved cart from localStorage once the app is running in the browser. */
export function CartHydrator() {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);
  return null;
}
