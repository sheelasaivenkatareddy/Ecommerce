import type { ProductSort } from "./types";

export const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

export function parseSort(value: string | undefined): ProductSort {
  return SORT_OPTIONS.find((option) => option.value === value)?.value ?? "newest";
}
