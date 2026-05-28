import { PHOTOS_BY_YACHT, type YachtSlug } from "./photos";

// One hand-picked yacht photo per occasion — best-fit, not the cover shot.
// Shared by the landing services carousel and the /services catalog.
const SERVICE_PHOTO: Record<string, { yacht: YachtSlug; idx: number }> = {
  "progulka-parusnaya": { yacht: "eva", idx: 7 },
  "progulka-motornaya": { yacht: "mario", idx: 0 },
  "den-rozhdeniya": { yacht: "alfa", idx: 2 },
  korporativ: { yacht: "bravo", idx: 0 },
  svidanie: { yacht: "eva", idx: 0 },
  devichnik: { yacht: "alfa", idx: 6 },
  fotosessiya: { yacht: "eva", idx: 5 },
  "master-klass": { yacht: "alfa", idx: 0 },
};

export function servicePhoto(slug: string): { url: string; yacht: YachtSlug } {
  const pick = SERVICE_PHOTO[slug] ?? { yacht: "eva" as YachtSlug, idx: 0 };
  return { url: PHOTOS_BY_YACHT[pick.yacht][pick.idx], yacht: pick.yacht };
}
