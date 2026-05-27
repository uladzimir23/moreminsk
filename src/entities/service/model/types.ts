export type Service = {
  slug: string;
  h1: string;
  /** Short headline for cards (shorter than H1). */
  shortTitle: string;
  /** One-line USP shown under the title on cards. */
  utp: string;
  /** Emoji/glyph fallback until real icons land. Lucide name preferred. */
  icon: string;
  /** Lowest hourly entry point, BYN — shown as «от X BYN/час». Equals the
   *  cheapest applicable yacht's rate (no fixed packages — hourly, min 1 ч). */
  fromPrice: number;
  suitableYachts: string[];
};
