import { LogOut, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/actions/auth";
import { getOptionalSession } from "@/lib/session";
import { CartLink } from "./cart-link";
import { SearchBar } from "./search-bar";

const iconButton = "grid size-10 place-items-center rounded-full text-gray-700 hover:bg-gray-100";

export async function Header() {
  // If the API is down, show a signed-out header and let the page explain the problem.
  const session = await getOptionalSession();
  const firstName = session?.user.name.split(" ")[0];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 md:gap-x-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-gray-900">
          <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-white">
            <ShoppingBag className="size-4" aria-hidden />
          </span>
          Storefront
        </Link>

        <nav aria-label="Main" className="flex items-center gap-5 text-sm font-medium text-gray-600">
          <Link href="/products" className="hover:text-gray-900">
            Shop
          </Link>
          {session && (
            <Link href="/orders" className="hidden hover:text-gray-900 md:inline">
              Orders
            </Link>
          )}
        </nav>

        <div className="order-last w-full md:order-none md:ml-auto md:w-72">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          {session ? (
            <>
              <span className="mr-2 hidden text-sm text-gray-500 lg:inline">Hi, {firstName}</span>
              <Link href="/orders" aria-label="Your orders" className={`${iconButton} md:hidden`}>
                <Package className="size-5" aria-hidden />
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="grid h-10 min-w-10 place-items-center rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 sm:px-3"
                >
                  <LogOut className="size-5 sm:hidden" aria-hidden />
                  <span className="sr-only sm:not-sr-only">Sign out</span>
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="px-2 text-sm font-medium text-gray-600 hover:text-gray-900">
              Sign in
            </Link>
          )}
          <CartLink />
        </div>
      </div>
    </header>
  );
}
