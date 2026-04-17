// Yacht domain model. Source-of-truth shape for stub data and CMS migration.
// Mirrors `docs/60 - Content/Флот яхт.md` (TypeScript-тип section).

export type YachtType = "sail" | "motor" | "sail-motor";

export type Yacht = {
  slug: string;
  name: string;
  type: YachtType;
  capacity: number;
  lengthMeters?: number;
  pricePerHour: number;
  minHours: number;
  description: string;
  features: string[];
  suitableFor: string[];
  gallery: string[];
  mainImage: string;
  video?: string;
  /** Marketing flag — surface a "флагман" / "новинка" / etc. ribbon. */
  badge?: "flagship" | "new";
};
