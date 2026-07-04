"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, ShieldCheck, Gauge, Leaf } from "lucide-react";
import { useAboutModal } from "@/components/about-modal-provider";
import { useDictionary } from "@/components/dictionary-provider";
import { ContactForm } from "@/components/contact-form";
import { FaqAccordion, type FaqEntry } from "@/components/faq-accordion";

const iconMap = {
  sparkles: Sparkles,
  shield: ShieldCheck,
  gauge: Gauge,
  leaf: Leaf,
} as const;

export type CommitmentEntry = {
  id: string;
  iconKey: string;
  titleFr: string;
  titleEn: string;
  textFr: string;
  textEn: string;
};

export function AboutModal({
  aboutTextFr,
  aboutTextEn,
  teamTextFr,
  teamTextEn,
  planetTextFr,
  planetTextEn,
  commitments,
  faqItems,
  phone1,
  contactEmail,
  address,
}: {
  aboutTextFr: string;
  aboutTextEn: string;
  teamTextFr: string;
  teamTextEn: string;
  planetTextFr: string;
  planetTextEn: string;
  commitments: CommitmentEntry[];
  faqItems: FaqEntry[];
  phone1: string;
  contactEmail: string;
  address: string;
}) {
  const { isOpen, close } = useAboutModal();
  const { dict, locale } = useDictionary();

  const aboutText = locale === "fr" ? aboutTextFr : aboutTextEn;
  const teamText = locale === "fr" ? teamTextFr : teamTextEn;
  const planetText = locale === "fr" ? planetTextFr : planetTextEn;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] overflow-y-auto bg-ink/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mx-auto my-8 w-full max-w-4xl rounded-3xl bg-surface shadow-2xl"
          >
            <div className="relative h-56 overflow-hidden rounded-t-3xl bg-gradient-to-br from-accent via-accent-dark to-ink sm:h-72">
              <button
                type="button"
                onClick={close}
                aria-label={dict.about.close}
                className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25"
              >
                <X size={18} />
              </button>
              <div className="flex h-full flex-col justify-end p-8">
                <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/70">
                  {dict.hero.overline}
                </p>
                <h2 className="mt-2 font-display text-4xl font-extrabold text-white sm:text-5xl">
                  {dict.about.title}
                </h2>
              </div>
            </div>

            <div className="space-y-12 p-8 sm:p-10">
              <p className="max-w-3xl font-serif text-lg italic leading-relaxed text-text sm:text-xl">
                {aboutText}
              </p>

              <section>
                <h3 className="font-display text-xl font-bold">{dict.about.teamTitle}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-muted sm:text-base">
                  {teamText}
                </p>
              </section>

              <section>
                <h3 className="font-display text-xl font-bold">{dict.about.commitmentsTitle}</h3>
                <div className="mt-5 grid gap-6 sm:grid-cols-3">
                  {commitments.map((item) => {
                    const Icon = iconMap[item.iconKey as keyof typeof iconMap] ?? Sparkles;
                    return (
                      <div key={item.id} className="rounded-2xl bg-surface-alt p-5">
                        <Icon className="text-accent" size={22} />
                        <h4 className="mt-3 font-display font-bold">
                          {locale === "fr" ? item.titleFr : item.titleEn}
                        </h4>
                        <p className="mt-2 text-sm text-text-muted">
                          {locale === "fr" ? item.textFr : item.textEn}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="grid gap-6 rounded-2xl bg-surface-alt p-6 sm:grid-cols-[1fr_1.4fr] sm:p-8">
                <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-ink p-8">
                  <Leaf className="text-white" size={40} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold">{dict.about.planetTitle}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">{planetText}</p>
                </div>
              </section>

              <section>
                <h3 className="font-display text-xl font-bold">{dict.about.faqTitle}</h3>
                <div className="mt-5">
                  <FaqAccordion items={faqItems} />
                </div>
              </section>

              <section className="border-t border-line pt-8">
                <h3 className="font-display text-xl font-bold">{dict.about.contactCta}</h3>
                <p className="mt-2 text-sm text-text-muted">
                  {address} · {phone1} · {contactEmail}
                </p>
                <div className="mt-5">
                  <ContactForm compact />
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
