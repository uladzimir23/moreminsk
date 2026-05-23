import type { Service } from "@/entities/service/model/types";

// Цены и состав пакетов согласованы с заказчиком 2026-05-23.
// «От X BYN» = минимальная видимая цена в карточке. Стандартные пакеты — 2 ч / 350 и 4 ч / 500.
// «Свадьба» снята с сайта по решению заказчика. Все яхты доступны под любую услугу.
export const SERVICES: ReadonlyArray<Service> = [
  {
    slug: "den-rozhdeniya",
    h1: "День рождения на яхте",
    shortTitle: "День рождения",
    utp: "До 8 гостей, аудиосистема и фуршетный столик на палубе",
    icon: "Cake",
    fromPrice: 200,
    packages: [
      { name: "Короткий", duration: "2 ч", price: 350 },
      { name: "Полвечера", duration: "4 ч", price: 500 },
    ],
    suitableYachts: ["eva", "alfa", "mario", "bravo"],
  },
  {
    slug: "korporativ",
    h1: "Корпоратив на яхте",
    shortTitle: "Корпоратив",
    utp: "Безнал и документы для юрлица, до 32 человек на 2–4 яхтах",
    icon: "Briefcase",
    fromPrice: 200,
    packages: [
      { name: "Тимбилдинг", duration: "2 ч", price: 350 },
      { name: "Регата", duration: "4 ч", price: 500 },
    ],
    suitableYachts: ["eva", "alfa", "mario", "bravo"],
  },
  {
    slug: "svidanie",
    h1: "Романтическое свидание на яхте",
    shortTitle: "Свидание",
    utp: "Камерная EVA с тиковой палубой — на двоих, закатный выход",
    icon: "Sparkles",
    fromPrice: 150,
    packages: [
      { name: "Закатный мини", duration: "1 ч", price: 150 },
      { name: "Закатный", duration: "2 ч", price: 350 },
      { name: "Вечер с фотографом", duration: "4 ч", price: 500 },
    ],
    suitableYachts: ["eva", "alfa", "mario", "bravo"],
  },
  {
    slug: "devichnik",
    h1: "Девичник на яхте",
    shortTitle: "Девичник",
    utp: "До 8 человек, аудиосистема, фуршетный стол на палубе",
    icon: "GlassWater",
    fromPrice: 200,
    packages: [
      { name: "Базовый", duration: "2 ч", price: 350 },
      { name: "Премиум + декор", duration: "4 ч", price: 500 },
    ],
    suitableYachts: ["eva", "alfa", "mario", "bravo"],
  },
  {
    slug: "fotosessiya",
    h1: "Фотосессия на яхте",
    shortTitle: "Фотосессия",
    utp: "Тиковая палуба, белые паруса, купальная платформа на моторной",
    icon: "Camera",
    fromPrice: 200,
    packages: [
      { name: "Короткая", duration: "2 ч", price: 350 },
      { name: "Полноценная", duration: "4 ч", price: 500 },
    ],
    suitableYachts: ["eva", "alfa", "mario", "bravo"],
  },
];
