"use client";

import { motion } from "framer-motion";
import { useDictionary } from "@/components/dictionary-provider";
import { useAboutModal } from "@/components/about-modal-provider";

export function AgencySection({
  introFr,
  introEn,
}: {
  introFr: string;
  introEn: string;
}) {
  const { dict, locale } = useDictionary();
  const { open } = useAboutModal();
  const intro = locale === "fr" ? introFr : introEn;

  return (
    <section id="agence" className="bg-surface-alt py-24">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="title-composite text-3xl sm:text-4xl">
            <span className="accent-serif">{dict.agency.titleAccent}</span>{" "}
            <span className="accent-bold">{dict.agency.titleBold}</span>
          </h2>
          <div className="divider-dots" />
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
            {intro}
          </p>
          <button type="button" onClick={open} className="btn-pill-solid mt-8">
            <span aria-hidden>›</span> {dict.agency.readMore}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
