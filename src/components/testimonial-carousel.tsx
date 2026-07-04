"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Star, BadgeCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";
import { useDictionary } from "@/components/dictionary-provider";

export type TestimonialEntry = {
  id: string;
  clientName: string;
  clientRole: string;
  companyName: string;
  colorHex: string;
  quoteFr: string;
  quoteEn: string;
  rating: number;
  verified: boolean;
};

export function TestimonialCarousel({ items }: { items: TestimonialEntry[] }) {
  const { locale, dict } = useDictionary();
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true, loop: items.length > 2 });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (items.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="w-[85%] shrink-0 rounded-2xl bg-surface p-6 shadow-sm sm:w-[45%] lg:w-[32%]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold text-white"
                  style={{ backgroundColor: item.colorHex }}
                >
                  {item.companyName ? item.companyName[0] : item.clientName[0]}
                </div>
                <div>
                  <p className="font-display text-sm font-bold">{item.clientName}</p>
                  <p className="text-xs text-text-muted">
                    {item.clientRole}
                    {item.companyName ? ` · ${item.companyName}` : ""}
                  </p>
                </div>
                {item.verified && (
                  <BadgeCheck className="ml-auto text-accent" size={18} aria-label={dict.reviews.verified} />
                )}
              </div>
              <div className="mt-3 flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < item.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="mt-3 font-serif italic leading-relaxed text-text">
                “{locale === "fr" ? item.quoteFr : item.quoteEn}”
              </p>
            </div>
          ))}
        </div>
      </div>
      {items.length > 1 && (
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={scrollPrev}
            aria-label="Previous"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-accent hover:text-accent"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-accent hover:text-accent"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
