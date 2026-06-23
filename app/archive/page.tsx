import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { ArchiveEmptyState } from "@/components/archive/archive-empty-state";
import { getActiveArchiveItems } from "@/lib/archive/queries";

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  const items = await getActiveArchiveItems();

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-12">
      <div className="space-y-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-medium text-sm text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 rounded-sm transition-colors -mx-2 px-2 py-1"
        >
          <ArrowLeftIcon className="h-4 w-4" /> Back to home
        </Link>
        <h1 className="text-2xl font-semibold">Arthur&apos;s Archive</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A messy but browsable dump of internet gold nuggets collected over
          time.
        </p>
      </div>

      {items.length === 0 ? (
        <ArchiveEmptyState />
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex font-medium text-sm text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 rounded-sm transition-colors -mx-2 px-2 py-1"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
