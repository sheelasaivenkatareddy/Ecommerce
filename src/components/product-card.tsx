import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const lowStock = product.inStock && product.stock <= 5;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {!product.inStock && (
          <span className="absolute top-3 left-3 rounded-full bg-gray-900/80 px-2.5 py-1 text-xs font-medium text-white">
            Sold out
          </span>
        )}
        {lowStock && (
          <span className="absolute top-3 left-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-medium text-white">
            Only {product.stock} left
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">{product.category.name}</p>
        <h3 className="line-clamp-2 font-medium text-gray-900">{product.name}</h3>
        <p className="mt-auto pt-2 text-lg font-semibold text-gray-900">{formatPrice(product.pricePaise)}</p>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
