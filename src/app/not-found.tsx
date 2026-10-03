import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold text-indigo-700">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-gray-500">It may have moved, or the product may no longer be available.</p>
      <Link href="/products" className="mt-8 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
        Browse products
      </Link>
    </div>
  );
}
