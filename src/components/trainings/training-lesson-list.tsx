"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { useDictionary } from "@/components/dictionary-provider";
import { TrainingVideoPlayer } from "@/components/trainings/training-video-player";
import type { TrainingLessonEntry } from "@/components/trainings/types";

export function TrainingLessonList({ lessons, title }: { lessons: TrainingLessonEntry[]; title: string }) {
  const { locale } = useDictionary();
  const [activeId, setActiveId] = useState(lessons[0]?.id);
  const active = lessons.find((l) => l.id === activeId) ?? lessons[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        {active && <TrainingVideoPlayer lesson={active} title={title} />}
      </div>
      <div className="space-y-2 lg:max-h-[420px] lg:overflow-y-auto">
        {lessons.map((lesson, i) => {
          const isActive = lesson.id === active?.id;
          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => setActiveId(lesson.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                isActive ? "bg-accent text-white" : "bg-surface-alt text-text hover:text-accent"
              }`}
            >
              <PlayCircle size={18} className="shrink-0" />
              <span className="flex-1">
                {i + 1}. {locale === "fr" ? lesson.titleFr : lesson.titleEn}
              </span>
              {lesson.durationMinutes > 0 && (
                <span className="shrink-0 text-xs opacity-80">{lesson.durationMinutes} min</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
