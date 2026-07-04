"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useDictionary } from "@/components/dictionary-provider";

export function Hero({
  taglinesFr,
  taglinesEn,
  videoPath,
}: {
  taglinesFr: string[];
  taglinesEn: string[];
  videoPath?: string | null;
}) {
  const { dict, locale } = useDictionary();
  const taglines = locale === "fr" ? taglinesFr : taglinesEn;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (taglines.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % taglines.length), 4200);
    return () => clearInterval(id);
  }, [taglines.length]);

  return (
    <section className="relative flex h-screen min-h-[560px] items-center justify-center overflow-hidden bg-ink text-white">
      <div className="absolute inset-0">
        {videoPath ? (
          <video
            src={videoPath}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-60"
          />
        ) : (
          <div className="h-full w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/40 via-ink to-ink" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute -left-1/4 -top-1/4 h-[70vmax] w-[70vmax] rounded-full bg-accent/20 blur-3xl"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/3 -right-1/4 h-[60vmax] w-[60vmax] rounded-full bg-accent-dark/30 blur-3xl"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-xs font-bold uppercase tracking-[0.35em] text-white/70 sm:text-sm"
        >
          {dict.hero.overline}
        </motion.p>

        <div className="mt-6 flex min-h-[7rem] items-center justify-center sm:min-h-[9rem]">
          <AnimatePresence mode="wait">
            <motion.h1
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="font-serif text-3xl italic leading-tight sm:text-5xl lg:text-6xl"
            >
              {taglines[index]}
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70"
      >
        <ChevronDown size={26} />
      </motion.div>
    </section>
  );
}
