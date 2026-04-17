export type ServicePackage = {
  name: string;
  duration: string;
  price: number;
  includes?: string[];
};

export type Service = {
  slug: string;
  h1: string;
  /** Short headline for cards (shorter than H1). */
  shortTitle: string;
  /** One-line USP shown under the title on cards. */
  utp: string;
  /** Emoji/glyph fallback until real icons land. Lucide name preferred. */
  icon: string;
  /** Lowest price entry point (for "от X BYN" pills). */
  fromPrice: number;
  packages: ServicePackage[];
  suitableYachts: string[];
};
