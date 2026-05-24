// Photos originally scraped from moreminsk.by (Tilda), now hosted locally in
// public/fleet/<yacht>/ (optimised to ≤2000px, JPEG q80) so the site no longer
// hotlinks a third-party CDN. Paths in scraped-photos.json are /fleet/... and
// resolve from public/ under static export.

import raw from "./scraped-photos.json";

export type YachtSlug = "eva" | "alfa" | "mario" | "bravo";

const YACHTS: ReadonlyArray<YachtSlug> = ["eva", "alfa", "mario", "bravo"];

export const PHOTOS_BY_YACHT: Readonly<Record<YachtSlug, ReadonlyArray<string>>> = {
  eva: raw.eva,
  alfa: raw.alfa,
  mario: raw.mario,
  bravo: raw.bravo,
};

export const COVER_BY_YACHT: Readonly<Record<YachtSlug, string>> = {
  eva: raw.eva[0],
  alfa: raw.alfa[0],
  mario: raw.mario[0],
  bravo: raw.bravo[0],
};

// Flat list — yacht cover first, then 2 extras from each — for the gallery
// section. Yacht-tagged so a future <Gallery filter=…> can pivot on it.
export const GALLERY: ReadonlyArray<{ url: string; yacht: YachtSlug; alt: string }> =
  YACHTS.flatMap((y) =>
    raw[y].slice(0, 4).map((url) => ({
      url,
      yacht: y,
      alt: `Яхта ${y.toUpperCase()} на Минском море`,
    })),
  );
