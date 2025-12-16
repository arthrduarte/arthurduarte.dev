"use client";

import { useState } from "react";
import categories from "@/constants/list-of-lists";
import type { Link } from "@/constants/list-of-lists";
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

export default function ListOfListsPage() {
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function handleLinkClick(link: Link) {
    if (link.reason) {
      setSelectedLink(link);
      setIsDrawerOpen(true);
    } else {
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  }
  return (
    <>
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            List of Lists
          </h1>
          <p className="text-lg text-gray-600">
            A curated collection of resources across various topics. Click any link with a story to learn more.
          </p>
        </div>

        <div className="space-y-12">
          {categories.map((category) => (
            <section key={category.name} className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                {category.name}
              </h2>
              <ul className="space-y-2">
                {category.links.map((link, index) => {
                  const linkButton = (
                    <button
                      onClick={() => handleLinkClick(link)}
                      className="text-left text-gray-700 hover:text-primary cursor-pointer transition-colors duration-200 inline-flex items-baseline gap-2"
                    >
                      <span className="text-gray-400 group-hover:text-primary">→</span>
                      <span className="underline decoration-gray-300 group-hover:decoration-primary">
                        {link.title}
                      </span>
                      {link.reason && (
                        <span className="text-xs text-gray-400 ml-1">⚙️</span>
                      )}
                    </button>
                  );

                  return (
                    <li key={index} className="group">
                      {link.hover ? (
                        <HoverCard>
                          <HoverCardTrigger>
                            {linkButton}
                          </HoverCardTrigger>
                          <HoverCardContent side="right" className="w-80">
                            <div className="space-y-2">
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {link.hover}
                              </p>
                              {link.reason && (
                                <p className="text-xs text-gray-400 italic border-t border-gray-200 mt-2 pt-2">
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
              <DrawerTitle className="text-2xl">{selectedLink?.title}</DrawerTitle>
              <DrawerDescription className="sr-only">
                Information about why this resource was added to the list
              </DrawerDescription>
            </DrawerHeader>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Why it's here
                </h3>
                <p className="text-gray-700 leading-relaxed">
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

