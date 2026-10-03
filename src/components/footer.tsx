import Link from "next/link";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-semibold text-gray-900">Storefront</p>
          <p className="mt-2 text-gray-500">
            Everyday essentials with free delivery over ₹999 and Cash on Delivery across India.
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Shop</p>
          <ul className="mt-2 space-y-1.5 text-gray-500">
            <li><Link href="/products" className="hover:text-gray-900">All products</Link></li>
            <li><Link href="/products?category=electronics" className="hover:text-gray-900">Electronics</Link></li>
            <li><Link href="/products?category=fashion" className="hover:text-gray-900">Fashion</Link></li>
            <li><Link href="/products?category=home-living" className="hover:text-gray-900">Home &amp; Living</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Account</p>
          <ul className="mt-2 space-y-1.5 text-gray-500">
            <li><Link href="/login" className="hover:text-gray-900">Sign in</Link></li>
            <li><Link href="/orders" className="hover:text-gray-900">Your orders</Link></li>
            <li><Link href="/cart" className="hover:text-gray-900">Cart</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-gray-400 sm:px-6">
          © {year} Storefront. A portfolio project by Sheela Saivenkata Reddy: orders placed here are not
          real. Product photos from Unsplash.
        </p>
      </div>
    </footer>
  );
}
