// Yacht domain model. Source-of-truth shape for stub data and CMS migration.
// Mirrors `docs/60 - Content/Флот яхт.md` (TypeScript-тип section).

export type YachtType = "sail" | "motor" | "sail-motor";

// Техпаспорт — реальные ТТХ модели (определены по фото + данные верфи Northman).
export type YachtSpecs = {
  /** Модель, напр. "Northman Maxus 28". */
  model: string;
  /** Верфь / страна. */
  builder: string;
  /** Длина (LOA), м. */
  lengthM: number;
  /** Ширина (beam), м. */
  beamM: number;
  /** Осадка, м — строкой, т.к. у швертбота диапазон «0,4 / 1,6». */
  draftM: string;
  cabins?: number;
  berths?: number;
  /** Площадь парусов, м² — только для парусных. */
  sailAreaM2?: number;
  /** Высота в каюте, м. */
  headroomM?: number;
  /** Годы выпуска модели. */
  yearsBuilt?: string;
  /** Модель определена по фото, не подтверждена владельцем — показываем сноску. */
  inferred?: boolean;
};

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
  specs?: YachtSpecs;
  /** Marketing flag — surface a "флагман" / "новинка" / etc. ribbon. */
  badge?: "flagship" | "new";
};
