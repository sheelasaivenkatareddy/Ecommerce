import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth-forms";
import { safeRedirectPath } from "@/lib/paths";
import { getOptionalSession } from "@/lib/session";

export const metadata: Metadata = { title: "Create an account" };

export default async function RegisterPage({ searchParams }: PageProps<"/register">) {
  const next = safeRedirectPath((await searchParams).next);
  if (await getOptionalSession()) redirect(next);

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create your account</h1>
        <p className="mt-1 text-sm text-gray-500">It takes less than a minute.</p>
        <div className="mt-6">
          <SignUpForm next={next} />
        </div>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-indigo-700 hover:text-indigo-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
