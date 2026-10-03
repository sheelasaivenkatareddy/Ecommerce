"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/sort";
import type { ProductSort } from "@/lib/types";

export function SortSelect({ value }: { value: ProductSort }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function changeSort(sort: string) {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      Sort by
      <select
        value={value}
        onChange={(event) => changeSort(event.target.value)}
        className="rounded-full border border-gray-300 bg-white py-1.5 pr-8 pl-3 text-sm font-medium text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
