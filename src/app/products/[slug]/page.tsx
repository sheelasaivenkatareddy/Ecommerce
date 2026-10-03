import { Banknote, ChevronRight, ShieldCheck, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { ProductGrid } from "@/components/product-card";
import { getProduct, getProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return product ? { title: product.name, description: product.description } : { title: "Product not found" };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  const sameCategory = await getProducts({ category: product.category.slug, limit: 5 });
  const related = sameCategory.items.filter((item) => item.id !== product.id).slice(0, 4);

  const stockLabel = !product.inStock
    ? { text: "Out of stock", style: "text-gray-500" }
    : product.stock <= 5
      ? { text: `Only ${product.stock} left in stock`, style: "text-amber-600" }
      : { text: "In stock", style: "text-emerald-700" };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="size-4" aria-hidden />
        <Link href={`/products?category=${product.category.slug}`} className="hover:text-gray-900">
          {product.category.name}
        </Link>
        <ChevronRight className="size-4" aria-hidden />
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-gray-200 bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-medium tracking-wide text-indigo-700 uppercase">{product.category.name}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-semibold text-gray-900">{formatPrice(product.pricePaise)}</p>
          <p className="mt-1 text-sm text-gray-500">Inclusive of all taxes</p>
          <p className={`mt-4 text-sm font-medium ${stockLabel.style}`}>{stockLabel.text}</p>
          <p className="mt-6 leading-relaxed text-gray-600">{product.description}</p>

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          <ul className="mt-8 space-y-3 border-t border-gray-200 pt-6 text-sm text-gray-600">
            <li className="flex items-center gap-3">
              <Truck className="size-5 text-gray-400" aria-hidden /> Free delivery on orders over ₹999
            </li>
            <li className="flex items-center gap-3">
              <Banknote className="size-5 text-gray-400" aria-hidden /> Cash on Delivery available
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-gray-400" aria-hidden /> Cancel free of charge before your order is confirmed
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">More in {product.category.name}</h2>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
