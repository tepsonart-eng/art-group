import { getYoutubeId } from "@/lib/youtube";
import type { TrainingLessonEntry } from "@/components/trainings/types";

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

export function TrainingVideoPlayer({ lesson, title }: { lesson: TrainingLessonEntry; title: string }) {
  if (lesson.videoSourceType === "UPLOAD" && lesson.videoFilePath) {
    return (
      <video src={lesson.videoFilePath} controls playsInline className="h-full w-full">
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>
    );
  }

  if (lesson.videoSourceType === "YOUTUBE" && lesson.youtubeUrl) {
    const id = getYoutubeId(lesson.youtubeUrl);
    if (id) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      );
    }
  }

  if (lesson.videoSourceType === "VIMEO" && lesson.vimeoUrl) {
    const id = getVimeoId(lesson.vimeoUrl);
    if (id) {
      return (
        <iframe
          src={`https://player.vimeo.com/video/${id}`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      );
    }
  }

  if (lesson.videoSourceType === "EXTERNAL" && lesson.externalUrl) {
    return (
      <video src={lesson.externalUrl} controls playsInline className="h-full w-full">
        <a href={lesson.externalUrl} target="_blank" rel="noreferrer">
          {lesson.externalUrl}
        </a>
      </video>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-ink text-sm text-white/60">
      Vidéo indisponible
    </div>
  );
}
