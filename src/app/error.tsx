"use client";

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Something went wrong</h1>
      <p className="mt-3 text-gray-500">
        We couldn&apos;t load this page. The store may be briefly unavailable. Please try again.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-8 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
      >
        Try again
      </button>
    </div>
  );
}
