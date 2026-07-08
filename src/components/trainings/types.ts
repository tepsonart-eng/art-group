export type TrainingLessonEntry = {
  id: string;
  titleFr: string;
  titleEn: string;
  order: number;
  videoSourceType: "UPLOAD" | "YOUTUBE" | "VIMEO" | "EXTERNAL";
  videoFilePath: string | null;
  youtubeUrl: string | null;
  vimeoUrl: string | null;
  externalUrl: string | null;
  durationMinutes: number;
};

export type TrainingResourceEntry = {
  id: string;
  titleFr: string;
  titleEn: string;
  filePath: string;
};

export type TrainingCommentEntry = {
  id: string;
  authorName: string;
  comment: string;
  createdAt: Date;
};

export type TrainingCategoryEntry = {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
};

export type TrainingCardEntry = {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  shortDescFr: string;
  shortDescEn: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  durationMinutes: number;
  thumbnailPath: string | null;
  viewCount: number;
  createdAt: Date;
  category: TrainingCategoryEntry;
  lessons: TrainingLessonEntry[];
  isPremium: boolean;
  priceXaf: number;
};
