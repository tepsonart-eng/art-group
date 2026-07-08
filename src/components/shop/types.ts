export type ProductCategoryEntry = { id: string; slug: string; nameFr: string; nameEn: string };

export type ProductCardEntry = {
  id: string;
  slug: string;
  type: "EBOOK" | "TEMPLATE" | "PRESET" | "OTHER";
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  coverImagePath: string | null;
  priceXaf: number;
  category: ProductCategoryEntry;
};
