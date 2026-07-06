"use client";

import Image from "next/image";
import { Star, User } from "lucide-react";
import { motion } from "framer-motion";
import { useDictionary } from "@/components/dictionary-provider";

export type TeamMemberEntry = {
  id: string;
  name: string;
  roleFr: string;
  roleEn: string;
  photoPath: string | null;
  rating: number;
};

export function TeamSection({ members }: { members: TeamMemberEntry[] }) {
  const { dict, locale } = useDictionary();

  if (members.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="title-composite text-center">
        <h2 className="text-3xl sm:text-4xl">
          <span className="accent-serif">{dict.team.titleAccent}</span>{" "}
          <span className="accent-bold">{dict.team.titleBold}</span>
        </h2>
        <div className="divider-dots" />
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative h-32 w-32 overflow-hidden rounded-full bg-surface-alt">
              {member.photoPath ? (
                <Image src={member.photoPath} alt={member.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-text-muted">
                  <User size={40} />
                </div>
              )}
            </div>
            <h3 className="mt-4 font-display font-bold">{member.name}</h3>
            <p className="text-sm text-text-muted">{locale === "fr" ? member.roleFr : member.roleEn}</p>
            <div className="mt-2 flex gap-0.5 text-accent">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star key={starIndex} size={14} fill={starIndex < member.rating ? "currentColor" : "none"} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
