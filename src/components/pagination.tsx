import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Current query parameters, kept on every page link. */
  query: Record<string, string | undefined>;
}

export function Pagination({ page, totalPages, query }: PaginationProps) {
  if (totalPages <= 1) return null;

  const href = (target: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value && key !== "page") params.set(key, value);
    }
    if (target > 1) params.set("page", String(target));
    const search = params.toString();
    return `/products${search ? `?${search}` : ""}`;
  };

  const link = "grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-medium transition";

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1">
      {page > 1 && (
        <Link href={href(page - 1)} className={`${link} text-gray-600 hover:bg-gray-100`} aria-label="Previous page">
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
        <Link
          key={number}
          href={href(number)}
          aria-current={number === page ? "page" : undefined}
          className={`${link} ${number === page ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}
        >
          {number}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={href(page + 1)} className={`${link} text-gray-600 hover:bg-gray-100`} aria-label="Next page">
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      )}
    </nav>
  );
}
