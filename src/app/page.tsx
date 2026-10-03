import { ArrowRight, Banknote, Headphones, Lamp, type LucideIcon, RotateCcw, Shirt, Store, Truck, Watch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product-card";
import { getCategories, getProducts } from "@/lib/catalog";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  electronics: Headphones,
  fashion: Shirt,
  accessories: Watch,
  "home-living": Lamp,
};

const PERKS = [
  { icon: Truck, title: "Free delivery over ₹999", text: "A flat ₹49 on smaller orders." },
  { icon: Banknote, title: "Cash on Delivery", text: "Pay when your order arrives." },
  { icon: RotateCcw, title: "Cancel anytime", text: "Before your order is confirmed." },
];

export default async function HomePage() {
  const [featured, categories] = await Promise.all([getProducts({ featured: true, limit: 4 }), getCategories()]);

  return (
    <>
      <section className="bg-gradient-to-br from-indigo-50 via-white to-sky-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm ring-1 ring-indigo-100">
              <Store className="size-4" aria-hidden /> New arrivals every week
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Everyday essentials, thoughtfully picked.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-gray-600">
              Tech, fashion and home goods you will actually use, with free delivery over ₹999 and Cash on Delivery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                Shop all products <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/products?category=electronics"
                className="rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-50"
              >
                Browse electronics
              </Link>
            </div>
          </div>
          <div className="hidden grid-cols-2 gap-4 sm:grid">
            {featured.items.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className={`relative aspect-square overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200 ${index % 2 === 1 ? "translate-y-6" : ""}`}
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 280px, 45vw"
                  className="object-cover"
                  loading={index < 2 ? "eager" : undefined}
                  fetchPriority={index < 2 ? "high" : undefined}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <ul className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-indigo-50 text-indigo-600">
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-500">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-14 sm:px-6">
        <section>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Shop by category</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = CATEGORY_ICONS[category.slug] ?? Store;
              return (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-md"
                >
                  <span className="grid size-12 place-items-center rounded-xl bg-gray-100 text-gray-700 transition group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <span>
                    <span className="block font-semibold text-gray-900">{category.name}</span>
                    <span className="text-sm text-gray-500">{category.productCount} products</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured products</h2>
            <Link href="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:text-indigo-800">
              View all <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-6">
            <ProductGrid products={featured.items} />
          </div>
        </section>
      </div>
    </>
  );
}
