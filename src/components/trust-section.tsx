"use client";

import { useDictionary } from "@/components/dictionary-provider";
import { useAboutModal } from "@/components/about-modal-provider";
import { TestimonialCarousel, type TestimonialEntry } from "@/components/testimonial-carousel";

export function TrustSection({ testimonials }: { testimonials: TestimonialEntry[] }) {
  const { dict } = useDictionary();
  const { open } = useAboutModal();

  return (
    <section className="bg-surface-alt py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 border-b border-line pb-10 sm:grid-cols-[1fr_auto] sm:items-center">
          <h2 className="title-composite text-3xl sm:text-4xl">
            <span className="accent-serif">{dict.trust.titleAccent}</span>{" "}
            <span className="accent-bold">{dict.trust.titleBold}</span>
          </h2>
          <button type="button" onClick={open} className="btn-pill-solid justify-self-start sm:justify-self-end">
            <span aria-hidden>›</span> {dict.trust.cta}
          </button>
        </div>
        <div className="mt-10">
          <TestimonialCarousel items={testimonials} />
        </div>
      </div>
    </section>
  );
}
