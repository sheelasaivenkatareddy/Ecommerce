import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { href: string; label: string };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-indigo-50 text-indigo-600">
        <Icon className="size-6" aria-hidden />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-6 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
