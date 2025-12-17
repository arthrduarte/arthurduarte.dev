"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, List, Clock, Twitter, Linkedin, Youtube, Mail, PanelsTopLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "list of lists", href: "/list-of-lists", icon: List },
  { name: "timeline", href: "/timeline", icon: Clock },
  { name: "projects", href: "/projects", icon: PanelsTopLeft },
];

const socials = [
  { name: "X", href: "https://x.com/arthrduarte", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com/in/arthrduarte/", icon: Linkedin },
  { name: "YouTube", href: "https://youtube.com/@arthrduarte", icon: Youtube },
  { name: "Email", href: "mailto:tuiduarte@gmail.com", icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-xl font-semibold text-gray-900">
            arthur duarte
          </h1>
          <p className="mt-1 text-sm text-gray-500">arthurduarte.dev</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-gray-600 hover:text-primary"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Socials */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-center gap-4">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors hover:text-primary"
                  aria-label={social.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

