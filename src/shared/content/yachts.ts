import type { Yacht } from "@/entities/yacht/model/types";

// Факты сверены с moreminsk.by 2026-04-17 (см. raw-media/scraped/facts.md).
// mainImage — плейсхолдер; живой UI флота (FleetCatalog/YachtDetail) берёт фото
// из PHOTOS_BY_YACHT (scraped-photos.json), а не отсюда.
//
// 2026-05-26 — техпаспорт (specs): модели определены по фото (надписи на бортах
// + инсигнии на парусах), ТТХ взяты у верфи Northman (Польша):
//   BRAVO — Maxus 28 (парус «28 maxus», борт «MAXUS») → sailboatdata/northman
//   EVA   — Maxus/Nova 26 (инсигния «26» на гроте)
//   MARIO — Nexus Revo 870 (борт «nexus», рег. AF-9999)
//   ALFA  — Maxus 28 (подтвердил Павел 2026-05-27: та же модель, что BRAVO, но
//           BRAVO новее). Габариты = как у BRAVO (один корпус).
export const YACHTS: ReadonlyArray<Yacht> = [
  {
    slug: "eva",
    name: "EVA",
    type: "sail",
    capacity: 6,
    lengthMeters: 8.4,
    pricePerHour: 150,
    minHours: 1,
    description:
      "EVA — камерная парусная яхта с тиковой палубой и белыми парусами, до 6 гостей. Уютный кокпит и носовая каюта, мягкая гладь Минского моря — формат под свидание, предложение руки или фотосессию на закате.",
    features: ["Капитан", "Топливо", "Тиковая палуба", "Аудиосистема"],
    suitableFor: ["romantic", "photoshoot", "family", "birthday-small"],
    gallery: [],
    mainImage: "/yachts/eva-cover.jpg",
    specs: {
      model: "Northman Maxus 26",
      builder: "Northman, Польша",
      lengthM: 8.4,
      beamM: 2.82,
      draftM: "0,35 / 1,43",
      berths: 4,
      sailAreaM2: 37,
      headroomM: 1.83,
    },
  },
  {
    slug: "alfa",
    name: "ALFA",
    type: "sail",
    capacity: 8,
    lengthMeters: 9.44,
    pricePerHour: 180,
    minHours: 1,
    description:
      "ALFA — парусная яхта Maxus 28, 9 метров, до 8 гостей. Большой кокпит со столиком и каюта с диванами внизу: приходите со своей едой и напитками — под день рождения, девичник или небольшой корпоратив. Релакс за столом или драйв под парусами — выбираете вы.",
    features: ["Капитан", "Топливо", "Фуршетный стол", "Аудиосистема"],
    suitableFor: ["birthday", "hen-party", "stag-party", "corporate"],
    gallery: [],
    mainImage: "/yachts/alfa-cover.jpg",
    specs: {
      model: "Northman Maxus 28",
      builder: "Northman, Польша",
      lengthM: 9.44,
      beamM: 2.92,
      draftM: "0,4 / 1,6",
      cabins: 2,
      berths: 6,
    },
  },
  {
    slug: "mario",
    name: "MARIO",
    type: "motor",
    capacity: 8,
    lengthMeters: 8.7,
    pricePerHour: 180,
    minHours: 1,
    description:
      "MARIO — моторная яхта с закрытой рубкой и панорамным остеклением, до 8 гостей. Диван в кокпите, солярий на носу, купальная платформа: мягкий ход без качки в любую погоду. Семейные выходные, девичник или фотосессия.",
    features: ["Капитан", "Топливо", "Купальная платформа", "Аудиосистема"],
    suitableFor: ["birthday", "hen-party", "corporate", "photoshoot"],
    gallery: [],
    mainImage: "/yachts/mario-cover.jpg",
    specs: {
      model: "Northman Nexus Revo 870",
      builder: "Northman, Польша",
      lengthM: 8.7,
      beamM: 2.9,
      draftM: "0,40",
      cabins: 2,
      berths: 6,
      headroomM: 1.97,
    },
  },
  {
    slug: "bravo",
    name: "BRAVO",
    type: "sail",
    capacity: 8,
    lengthMeters: 9.44,
    pricePerHour: 200,
    minHours: 1,
    description:
      "BRAVO — флагман флота: Maxus 28, 9,4 метра, самый новый корпус у нас. Большой стол на палубе для 8 гостей и каюта внизу — под юбилей, премиум-корпоратив или VIP-вечер. Прогулка с угощением или драйв под парусами.",
    features: ["Капитан", "Топливо", "Фуршетный стол", "Аудиосистема"],
    suitableFor: ["anniversary", "vip-corporate", "proposal"],
    gallery: [],
    mainImage: "/yachts/bravo-cover.jpg",
    badge: "flagship",
    specs: {
      model: "Northman Maxus 28",
      builder: "Northman, Польша",
      lengthM: 9.44,
      beamM: 2.92,
      draftM: "0,4 / 1,6",
      cabins: 2,
      berths: 6,
      yearsBuilt: "2010–2022",
    },
  },
];
