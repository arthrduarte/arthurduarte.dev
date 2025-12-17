"use client";

import { useState } from "react";
import Image from "next/image";
import timelineEntries, { TimelineEntry } from "@/constants/timeline";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Camera, X } from "lucide-react";

function groupByDate(entries: TimelineEntry[]) {
  const grouped: { [key: string]: TimelineEntry[] } = {};
  
  entries.forEach((entry) => {
    if (!grouped[entry.date]) {
      grouped[entry.date] = [];
    }
    grouped[entry.date].push(entry);
  });
  
  return grouped;
}

function renderTimelineItem(items: TimelineEntry["items"]) {
  return items.map((item, idx) => {
    if (item.link) {
      return (
        <a
          key={idx}
          href={item.link}
          className="text-sm font-medium underline hover:text-gray-900 transition-colors"
        >
          {item.text}
        </a>
      );
    }
    
    if (item.emphasis === "bold") {
      return <span key={idx} className="text-sm font-semibold">{item.text}</span>;
    }
    
    if (item.emphasis === "italic") {
      return <span key={idx} className="text-sm italic">{item.text}</span>;
    }
    
    return <span key={idx} className="text-gray-700 text-sm">{item.text}</span>;
  });
}

export default function TimelinePage() {
  const groupedEntries = groupByDate(timelineEntries);
  const dates = Object.keys(groupedEntries);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-5xl font-bold text-gray-900 mb-16">
        Timeline
      </h1>

      <div className="space-y-12">
        {dates.map((date, dateIndex) => {
          const entries = groupedEntries[date];
          const isLastDate = dateIndex === dates.length - 1;

          return (
            <div key={date} className="flex gap-8">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full border-4 border-gray-900 bg-white mt-1"></div>
                {!isLastDate && <div className="w-0.5 h-full bg-gray-200 mt-2"></div>}
              </div>
              <div className="flex-1 pb-8">
                <time className="text-sm font-medium text-gray-900 mb-4 block">
                  {date}
                </time>
                <ul className="space-y-3 text-gray-700">
                  {entries.map((entry, entryIndex) => (
                    <TimelineEntryItem key={entryIndex} entry={entry} />
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TimelineEntryItem({ entry }: { entry: TimelineEntry }) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!entry.images || entry.images.length === 0) {
    return (
      <li className="leading-relaxed">
        {renderTimelineItem(entry.items)}
      </li>
    );
  }

  return (
    <>
      <li className="leading-relaxed">
        <Accordion>
          <AccordionItem value="images" className="border-none">
            <AccordionTrigger className="py-0 px-0 hover:no-underline border-none font-normal text-gray-700 focus-visible:ring-0 focus-visible:border-none rounded-none">
              <span className="inline-flex items-center gap-2 text-left text-gray-700 leading-relaxed">
                {renderTimelineItem(entry.items)}
                <Camera className="h-4 w-4 text-gray-400 shrink-0" />
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {entry.images.map((image, idx) => (
                  <div
                    key={idx}
                    className="relative w-full h-64 overflow-hidden rounded-lg bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setLightboxImage(image)}
                  >
                    <Image
                      src={image}
                      alt={`Timeline image ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </li>

      {lightboxImage && (
        <ImageLightbox
          image={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </>
  );
}

function ImageLightbox({ image, onClose }: { image: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        }
      }}
      tabIndex={0}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        aria-label="Close lightbox"
      >
        <X className="h-8 w-8" />
      </button>
      <div
        className="relative w-full h-full max-w-7xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image}
          alt="Expanded view"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}

