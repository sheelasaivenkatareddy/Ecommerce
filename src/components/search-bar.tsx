import { Search } from "lucide-react";
import Form from "next/form";

export function SearchBar() {
  return (
    <Form action="/products" role="search" className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" aria-hidden />
      <input
        name="q"
        type="search"
        placeholder="Search products"
        aria-label="Search products"
        className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pr-4 pl-9 text-sm transition outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
      />
    </Form>
  );
}
