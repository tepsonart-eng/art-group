"use client";

import { useDictionary } from "@/components/dictionary-provider";

export type PartnerLogoEntry = {
  id: string;
  name: string;
  colorHex: string;
};

export function LogoMarquee({ logos }: { logos: PartnerLogoEntry[] }) {
  const { dict } = useDictionary();
  if (logos.length === 0) return null;

  const track = [...logos, ...logos];

  return (
    <section className="border-y border-line bg-surface-alt py-10">
      <p className="mb-6 text-center font-display text-xs font-bold uppercase tracking-[0.3em] text-text-muted">
        {dict.marquee.title}
      </p>
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee gap-10">
          {track.map((logo, i) => (
            <div
              key={`${logo.id}-${i}`}
              className="flex h-16 w-32 shrink-0 items-center justify-center rounded-xl text-sm font-display font-bold text-white"
              style={{ backgroundColor: logo.colorHex }}
              title={logo.name}
            >
              {logo.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
