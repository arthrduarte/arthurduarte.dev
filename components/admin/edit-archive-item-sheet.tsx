"use client";

import { ArchiveItemForm } from "@/components/admin/archive-item-form";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import type { ArchiveItemRecord } from "@/lib/archive/types";

type EditArchiveItemSheetProps = {
  item: ArchiveItemRecord | null;
  existingTags: string[];
  blobConfigured: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditArchiveItemSheet({
  item,
  existingTags,
  blobConfigured,
  open,
  onOpenChange,
}: EditArchiveItemSheetProps) {
  if (!item) {
    return null;
  }

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="data-[vaul-drawer-direction=right]:sm:max-w-xl">
        <div className="flex h-full flex-col overflow-y-auto p-6">
          <DrawerHeader className="px-0">
            <DrawerTitle>Edit archive item</DrawerTitle>
            <DrawerDescription>
              Update fields, tags, notes, and images for this public item.
            </DrawerDescription>
          </DrawerHeader>

          <div className="mt-4 flex-1">
            <ArchiveItemForm
              key={item.id}
              item={item}
              existingTags={existingTags}
              blobConfigured={blobConfigured}
              onSuccess={() => onOpenChange(false)}
            />
          </div>

          <div className="mt-6">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
