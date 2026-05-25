// Photos originally scraped from moreminsk.by (Tilda), now hosted locally in
// public/fleet/<yacht>/ (optimised to ≤2000px, JPEG q80) so the site no longer
// hotlinks a third-party CDN. Paths in scraped-photos.json are /fleet/... and
// resolve from public/ under static export.
import { withBase } from "@/shared/lib/base-path";

import raw from "./scraped-photos.json";

export type YachtSlug = "eva" | "alfa" | "mario" | "bravo";

const YACHTS: ReadonlyArray<YachtSlug> = ["eva", "alfa", "mario", "bravo"];
const withBaseAll = (urls: ReadonlyArray<string>): ReadonlyArray<string> => urls.map(withBase);

// 240px thumbnail variant living in a `tn/` subfolder beside each photo
// (public/fleet/<yacht>/tn/<name>.jpg). Thumbnail strips must use these — a
// full 1280px image decoded for an 80px thumb wastes ~5MB of bitmap memory
// each, which is what pushed low-memory machines to evict + re-decode.
export const thumbUrl = (url: string): string => url.replace(/\/([^/]+)$/, "/tn/$1");

export const PHOTOS_BY_YACHT: Readonly<Record<YachtSlug, ReadonlyArray<string>>> = {
  eva: withBaseAll(raw.eva),
  alfa: withBaseAll(raw.alfa),
  mario: withBaseAll(raw.mario),
  bravo: withBaseAll(raw.bravo),
};

export const COVER_BY_YACHT: Readonly<Record<YachtSlug, string>> = {
  eva: PHOTOS_BY_YACHT.eva[0],
  alfa: PHOTOS_BY_YACHT.alfa[0],
  mario: PHOTOS_BY_YACHT.mario[0],
  bravo: PHOTOS_BY_YACHT.bravo[0],
};

// Flat list — yacht cover first, then 2 extras from each — for the gallery
// section. Yacht-tagged so a future <Gallery filter=…> can pivot on it.
export const GALLERY: ReadonlyArray<{ url: string; yacht: YachtSlug; alt: string }> =
  YACHTS.flatMap((y) =>
    PHOTOS_BY_YACHT[y].slice(0, 4).map((url) => ({
      url,
      yacht: y,
      alt: `Яхта ${y.toUpperCase()} на Минском море`,
    })),
  );
