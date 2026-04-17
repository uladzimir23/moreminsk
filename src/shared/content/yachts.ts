import type { Yacht } from "@/entities/yacht/model/types";

// Факты сверены с moreminsk.by 2026-04-17 (см. raw-media/scraped/facts.md).
// Длины и год постройки — open-вопрос к Павлу (на действующем сайте не указаны).
// mainImage — пока плейсхолдер, YachtCard рендерит fallback.
export const YACHTS: ReadonlyArray<Yacht> = [
  {
    slug: "eva",
    name: "EVA",
    type: "sail",
    capacity: 6,
    pricePerHour: 150,
    minHours: 2,
    description:
      "Камерная парусная яхта с тиковой палубой и белыми парусами. Носовая каюта, обеденная зона в кают-компании. Подходит для свидания, семейной прогулки или фотосессии на закате.",
    features: ["Капитан", "Топливо", "Тиковая палуба", "Аудиосистема"],
    suitableFor: ["romantic", "photoshoot", "family", "birthday-small"],
    gallery: [],
    mainImage: "/yachts/eva-cover.jpg",
  },
  {
    slug: "alfa",
    name: "ALFA",
    type: "sail",
    capacity: 8,
    pricePerHour: 150,
    minHours: 2,
    description:
      "Парусная яхта на 8 гостей. Стол в кают-компании, фуршетный столик на палубе — формат под день рождения, девичник или небольшой корпоратив.",
    features: ["Капитан", "Топливо", "Фуршетный стол", "Аудиосистема"],
    suitableFor: ["birthday", "hen-party", "stag-party", "corporate", "wedding-small"],
    gallery: [],
    mainImage: "/yachts/alfa-cover.jpg",
  },
  {
    slug: "mario",
    name: "MARIO",
    type: "motor",
    capacity: 8,
    pricePerHour: 150,
    minHours: 2,
    description:
      "Моторная яхта с просторным кокпитом и купальной платформой. Ходит без парусов — идёт по графику в любую погоду. Для активных компаний и фотосессий.",
    features: ["Капитан", "Топливо", "Купальная платформа", "Аудиосистема"],
    suitableFor: ["birthday", "hen-party", "corporate", "photoshoot"],
    gallery: [],
    mainImage: "/yachts/mario-cover.jpg",
  },
  {
    slug: "bravo",
    name: "BRAVO",
    type: "sail",
    capacity: 8,
    pricePerHour: 150,
    minHours: 2,
    description:
      "Флагман флота: стол в кают-компании, фуршетный столик на палубе, самая большая площадь палубы во флоте. Для свадьбы, юбилея и ключевого корпоратива.",
    features: ["Капитан", "Топливо", "Фуршетный стол", "Аудиосистема"],
    suitableFor: ["wedding", "anniversary", "vip-corporate", "proposal"],
    gallery: [],
    mainImage: "/yachts/bravo-cover.jpg",
    badge: "flagship",
  },
];
