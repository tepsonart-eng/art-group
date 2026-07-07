"use client";

import { FileText, Download } from "lucide-react";
import { useDictionary } from "@/components/dictionary-provider";
import type { TrainingResourceEntry } from "@/components/trainings/types";

export function TrainingResourceList({ resources }: { resources: TrainingResourceEntry[] }) {
  const { dict, locale } = useDictionary();

  if (resources.length === 0) return null;

  return (
    <div className="space-y-2">
      {resources.map((resource) => (
        <a
          key={resource.id}
          href={resource.filePath}
          download
          className="flex items-center gap-3 rounded-xl bg-surface-alt px-4 py-3 text-sm transition-colors hover:text-accent"
        >
          <FileText size={18} className="shrink-0 text-accent" />
          <span className="flex-1">{locale === "fr" ? resource.titleFr : resource.titleEn}</span>
          <Download size={16} className="shrink-0" />
        </a>
      ))}
      <p className="sr-only">{dict.trainings.resourcesTitle}</p>
    </div>
  );
}
