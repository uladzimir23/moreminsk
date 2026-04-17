export type Review = {
  id: string;
  authorName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  text: string;
  occasionType: string;
  yachtSlug?: string;
  sourceUrl?: string;
  authorPhoto?: string;
};
