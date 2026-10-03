import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth-forms";
import { safeRedirectPath } from "@/lib/paths";
import { getOptionalSession } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const next = safeRedirectPath((await searchParams).next);
  if (await getOptionalSession()) redirect(next);

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">Sign in to check out and track your orders.</p>
        <div className="mt-6">
          <SignInForm next={next} />
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          New here?{" "}
          <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-semibold text-indigo-700 hover:text-indigo-800">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
