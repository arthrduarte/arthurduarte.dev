"use client";

import { useState } from "react";
import categories from "@/constants/list-of-lists";
import type { Resource } from "@/constants/list-of-lists";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function ListOfListsPage() {
  const [selectedLink, setSelectedLink] = useState<Resource | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function handleLinkClick(link: Resource) {
    if (link.reason) {
      setSelectedLink(link);
      setIsDrawerOpen(true);
    } else {
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  }
  return (
    <>
      <div className="max-w-2xl mx-auto p-8 space-y-12">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 font-medium text-sm text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 rounded-sm transition-colors -mx-2 px-2 py-1">
            <ArrowLeftIcon className="h-4 w-4" /> Back to home
          </Link>
          <h1 className="text-2xl font-semibold">
            List of Lists
          </h1>
          <p className="text-sm text-muted-foreground">
            A curated collection of resources across various topics. Click any link with a story to learn more.
          </p>
        </div>

        <div className="space-y-8">
          {categories.map((category) => (
            <section key={category.name}>
              <h2 className="text-sm font-semibold mb-3">
                {category.name}
              </h2>
              <ul className="gap-2">
                {category.links.map((link, index) => {
                  const linkButton = (
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="flex font-medium text-sm text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 rounded-sm transition-colors -mx-2 px-2 py-1 w-full text-left items-center gap-1"
                    >
                      <span className="flex-1">{link.title}</span>
                      {link.reason && (
                        <span className="text-xs">⚙️</span>
                      )}
                    </button>
                  );

                  return (
                    <li key={index}>
                      {link.hover ? (
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            {linkButton}
                          </HoverCardTrigger>
                          <HoverCardContent side="right" className="w-80">
                            <div className="space-y-2">
                              <p className="text-sm leading-relaxed">
                                {link.hover}
                              </p>
                              {link.reason && (
                                <p className="text-xs text-muted-foreground italic border-t pt-2">
                                  Click for the full story ✨
                                </p>
                              )}
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      ) : (
                        linkButton
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <Drawer direction="right" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="overflow-y-auto p-6 h-full">
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-xl font-semibold">{selectedLink?.title}</DrawerTitle>
              <DrawerDescription className="sr-only">
                Information about why this resource was added to the list
              </DrawerDescription>
            </DrawerHeader>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Why it's here
                </h3>
                <p className="text-sm leading-relaxed">
                  {selectedLink?.reason || "No additional information available."}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <a
                  href={selectedLink?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center h-9 px-2.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/80 text-sm font-medium transition-all"
                >
                  Visit →
                </a>
                <DrawerClose>
                  <Button variant="outline" className="flex-1 w-full">
                    Close
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

