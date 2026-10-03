import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SortSelect } from "@/components/catalog-controls";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { ProductGrid } from "@/components/product-card";
import { getCategories, getProducts } from "@/lib/catalog";
import { parseSort } from "@/lib/sort";

export const metadata: Metadata = { title: "Shop" };

const PAGE_SIZE = 12;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

function parsePage(value: string | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const params = await searchParams;
  const q = first(params.q)?.trim() || undefined;
  const category = first(params.category) || undefined;
  const sort = parseSort(first(params.sort));
  const page = parsePage(first(params.page));

  const [list, categories] = await Promise.all([
    getProducts({ q, category, sort, page, limit: PAGE_SIZE }),
    getCategories(),
  ]);
  const activeCategory = categories.find((c) => c.slug === category);
  const heading = q ? `Results for “${q}”` : (activeCategory?.name ?? "All products");

  const categoryLink = (slug?: string) => {
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (slug) search.set("category", slug);
    if (sort !== "newest") search.set("sort", sort);
    const query = search.toString();
    return `/products${query ? `?${query}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{heading}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {list.total} {list.total === 1 ? "product" : "products"}
          </p>
        </div>
        <Suspense>
          <SortSelect value={sort} />
        </Suspense>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[200px_1fr]">
        <nav aria-label="Categories">
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:pb-0">
            {[{ slug: undefined, name: "All products" }, ...categories].map((item) => {
              const active = item.slug === activeCategory?.slug;
              return (
                <li key={item.name} className="shrink-0">
                  <Link
                    href={categoryLink(item.slug)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-full px-4 py-2 text-sm font-medium transition lg:rounded-xl ${
                      active ? "bg-indigo-600 text-white" : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100 lg:ring-0"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div>
          {list.items.length > 0 ? (
            <ProductGrid products={list.items} />
          ) : (
            <EmptyState
              icon={SearchX}
              title="No products found"
              description="Try a different search or browse another category."
              action={{ href: "/products", label: "See all products" }}
            />
          )}
          <Pagination
            page={list.page}
            totalPages={list.totalPages}
            query={{ q, category, sort: sort === "newest" ? undefined : sort }}
          />
        </div>
      </div>
    </div>
  );
}
