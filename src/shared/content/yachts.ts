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
//   ALFA  — борт «maxus», точный размер по фото не подтверждён → принят Maxus 26
//           (идёт рядом с EVA того же размера). inferred: true — уточнить у Павла.
export const YACHTS: ReadonlyArray<Yacht> = [
  {
    slug: "eva",
    name: "EVA",
    type: "sail",
    capacity: 6,
    lengthMeters: 8.4,
    pricePerHour: 150,
    minHours: 2,
    description:
      "Камерная парусная яхта с тиковой палубой и белыми парусами. Носовая каюта, обеденная зона в кают-компании. Подходит для свидания, семейной прогулки или фотосессии на закате.",
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
    lengthMeters: 8.4,
    pricePerHour: 150,
    minHours: 2,
    description:
      "Парусная яхта на 8 гостей. Стол в кают-компании, фуршетный столик на палубе — формат под день рождения, девичник или небольшой корпоратив.",
    features: ["Капитан", "Топливо", "Фуршетный стол", "Аудиосистема"],
    suitableFor: ["birthday", "hen-party", "stag-party", "corporate"],
    gallery: [],
    mainImage: "/yachts/alfa-cover.jpg",
    specs: {
      model: "Northman Maxus 26",
      builder: "Northman, Польша",
      lengthM: 8.4,
      beamM: 2.82,
      draftM: "0,35 / 1,43",
      berths: 4,
      sailAreaM2: 37,
      headroomM: 1.83,
      inferred: true,
    },
  },
  {
    slug: "mario",
    name: "MARIO",
    type: "motor",
    capacity: 8,
    lengthMeters: 8.7,
    pricePerHour: 150,
    minHours: 2,
    description:
      "Моторная яхта с просторным кокпитом и купальной платформой. Ходит без парусов — идёт по графику в любую погоду. Для активных компаний и фотосессий.",
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
    pricePerHour: 150,
    minHours: 2,
    description:
      "Флагман флота: стол в кают-компании, фуршетный столик на палубе, самая большая площадь палубы во флоте. Для юбилея, премиум-корпоратива и VIP-вечера.",
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
