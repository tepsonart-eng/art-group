export type ResourceCategoryEntry = {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
};

export type ResourceCardEntry = {
  id: string;
  type: "EBOOK" | "GUIDE" | "COURSE_MATERIAL" | "CHECKLIST" | "TECHNICAL_SHEET" | "EDUCATIONAL_DOCUMENT" | "OTHER";
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  coverImagePath: string | null;
  fileSizeBytes: number;
  downloadCount: number;
  createdAt: Date;
  category: ResourceCategoryEntry;
};
