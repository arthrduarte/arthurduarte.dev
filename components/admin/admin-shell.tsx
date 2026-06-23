"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, ExternalLinkIcon, Trash2 } from "lucide-react";

import { logoutAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Archive", href: "/admin/archive", icon: Archive },
  { name: "Trash", href: "/admin/archive/trash", icon: Trash2 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-full">
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card/30 backdrop-blur-xl">
        <div className="border-b border-border px-4 py-5">
          <p className="text-sm font-semibold text-foreground">Admin</p>
          <p className="text-xs text-muted-foreground">Arthur&apos;s Archive</p>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors active:scale-[0.98]",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-border p-3">
          <Link
            href="/archive"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-[0.98]"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            View public archive
          </Link>
          <form action={logoutAction}>
            <Button type="submit" variant="outline" className="w-full">
              Log out
            </Button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <main className="px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
