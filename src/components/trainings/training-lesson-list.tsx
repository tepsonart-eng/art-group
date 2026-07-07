"use client";

import { useEffect, useState } from "react";
import { PlayCircle, CheckCircle2, Circle } from "lucide-react";
import { useDictionary } from "@/components/dictionary-provider";
import { TrainingVideoPlayer } from "@/components/trainings/training-video-player";
import { recordLessonView, toggleLessonComplete } from "@/actions/lesson-progress";
import type { TrainingLessonEntry } from "@/components/trainings/types";

type ProgressMap = Record<string, { completed: boolean }>;

export function TrainingLessonList({
  lessons,
  title,
  trainingId,
  progress,
  initialLessonId,
}: {
  lessons: TrainingLessonEntry[];
  title: string;
  trainingId: string;
  progress?: ProgressMap;
  initialLessonId?: string;
}) {
  const { dict, locale } = useDictionary();
  const loggedIn = progress !== undefined;
  const [localProgress, setLocalProgress] = useState<ProgressMap>(progress ?? {});
  const [activeId, setActiveId] = useState(initialLessonId ?? lessons[0]?.id);
  const active = lessons.find((l) => l.id === activeId) ?? lessons[0];

  useEffect(() => {
    if (loggedIn && active) {
      recordLessonView(active.id, trainingId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id, loggedIn]);

  if (!active) return null;

  function handleToggle(lessonId: string) {
    const nextCompleted = !localProgress[lessonId]?.completed;
    setLocalProgress((prev) => ({ ...prev, [lessonId]: { completed: nextCompleted } }));
    toggleLessonComplete(lessonId, trainingId, nextCompleted);
  }

  const completedCount = lessons.filter((l) => localProgress[l.id]?.completed).length;
  const percent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const completionToggle = (lessonId: string, size: "sm" | "row") => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        handleToggle(lessonId);
      }}
      className={`flex shrink-0 items-center gap-1.5 text-xs font-semibold ${
        size === "row" ? "" : "rounded-full bg-surface-alt px-3 py-1.5"
      } ${localProgress[lessonId]?.completed ? "text-green-600 dark:text-green-400" : "text-text-muted"}`}
    >
      {localProgress[lessonId]?.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
      {size === "sm" && (localProgress[lessonId]?.completed ? dict.trainings.markIncomplete : dict.trainings.markComplete)}
    </button>
  );

  if (lessons.length <= 1) {
    return (
      <div>
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
          <TrainingVideoPlayer lesson={active} title={title} />
        </div>
        {loggedIn && <div className="mt-3">{completionToggle(active.id, "sm")}</div>}
      </div>
    );
  }

  return (
    <div>
      {loggedIn && (
        <div className="mb-3 flex items-center gap-3 text-sm text-text-muted">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-alt">
            <div className="h-full bg-accent transition-all" style={{ width: `${percent}%` }} />
          </div>
          <span className="shrink-0 text-xs font-semibold">
            {completedCount}/{lessons.length} {dict.trainings.completedLabel} ({percent}%)
          </span>
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
          <TrainingVideoPlayer lesson={active} title={title} />
        </div>
        <div className="space-y-2 lg:max-h-[420px] lg:overflow-y-auto">
          {lessons.map((lesson, i) => {
            const isActive = lesson.id === active?.id;
            return (
              <div
                key={lesson.id}
                role="button"
                tabIndex={0}
                onClick={() => setActiveId(lesson.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setActiveId(lesson.id);
                }}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-colors ${
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
                {loggedIn && (
                  <span className={isActive ? "text-white" : ""}>{completionToggle(lesson.id, "row")}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
