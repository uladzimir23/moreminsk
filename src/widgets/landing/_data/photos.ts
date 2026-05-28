// Photos originally scraped from moreminsk.by (Tilda), now hosted locally in
// public/fleet/<yacht>/ (optimised to ≤2000px, JPEG q80) so the site no longer
// hotlinks a third-party CDN. Paths in scraped-photos.json are /fleet/... and
// resolve from public/ under static export.
import { withBase } from "@/shared/lib/base-path";

import raw from "./scraped-photos.json";

export type YachtSlug = "eva" | "alfa" | "mario" | "bravo";

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

// Curated gallery — photos supplied by the client (Telegram 2026-05-27), hosted
// in public/gallery/. The `yacht` tag drives the /galereya filter chips (loose
// grouping for a marketing gallery); `alt` describes the scene for SR + SEO.
export const GALLERY: ReadonlyArray<{ url: string; yacht: YachtSlug; alt: string }> = (
  [
    {
      src: "/gallery/sail-sunset.jpg",
      yacht: "bravo",
      alt: "Парусная яхта на закате на Минском море",
    },
    { src: "/gallery/sail-day.jpg", yacht: "alfa", alt: "Под парусом в ясный день" },
    { src: "/gallery/deck-evening.jpg", yacht: "eva", alt: "Вечер на палубе яхты" },
    { src: "/gallery/cabin.jpg", yacht: "bravo", alt: "Каюта с диванами под палубой" },
    { src: "/gallery/table.jpg", yacht: "alfa", alt: "Стол с угощением в кокпите" },
    {
      src: "/gallery/motor-aerial.jpg",
      yacht: "mario",
      alt: "Моторная яхта на закате, вид сверху",
    },
    { src: "/gallery/motor-bow.jpg", yacht: "mario", alt: "Нос моторной яхты на спокойной воде" },
    { src: "/gallery/motor-sunset.jpg", yacht: "mario", alt: "Закатная прогулка под мотором" },
    { src: "/gallery/sunset-deck.jpg", yacht: "eva", alt: "Закат с борта яхты" },
    { src: "/gallery/sunset-sea.jpg", yacht: "bravo", alt: "Закат над Минским морем" },
    { src: "/gallery/aerial-people.jpg", yacht: "alfa", alt: "Компания на яхте, вид сверху" },
    { src: "/gallery/mast.jpg", yacht: "bravo", alt: "Мачта на фоне неба" },
  ] as const
).map((g) => ({ url: withBase(g.src), yacht: g.yacht, alt: g.alt }));
