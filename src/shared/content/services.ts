import type { Service } from "@/entities/service/model/types";

// Цены и названия сверены с moreminsk.by 2026-04-17 (raw-media/scraped/facts.md).
// «От X BYN» = почасовая ставка × 2 (минимум аренды). На сайте указана только почасовая.
// suitableYachts обновлены под реальные типы: alfa — парусная, mario — моторная, bravo — парусная.
export const SERVICES: ReadonlyArray<Service> = [
  {
    slug: "svadba",
    h1: "Свадьба на яхте в Минске",
    shortTitle: "Свадьба",
    utp: "До 8 гостей на палубе BRAVO, фуршетный стол, фото-зона",
    icon: "Heart",
    fromPrice: 300,
    packages: [
      { name: "Церемония", duration: "2 ч", price: 300 },
      { name: "Фотосессия + прогулка", duration: "3 ч", price: 450 },
      { name: "Полный день", duration: "8 ч", price: 1200 },
    ],
    suitableYachts: ["alfa", "bravo"],
  },
  {
    slug: "den-rozhdeniya",
    h1: "День рождения на яхте",
    shortTitle: "День рождения",
    utp: "До 8 гостей, аудиосистема и фуршетный столик на палубе",
    icon: "Cake",
    fromPrice: 300,
    packages: [
      { name: "Короткий", duration: "2 ч", price: 300 },
      { name: "Полвечера", duration: "4 ч", price: 600 },
      { name: "Весь вечер", duration: "6 ч", price: 900 },
    ],
    suitableYachts: ["alfa", "mario", "bravo"],
  },
  {
    slug: "korporativ",
    h1: "Корпоратив на яхте",
    shortTitle: "Корпоратив",
    utp: "Безнал и документы для юрлица, до 32 человек на 2–4 яхтах",
    icon: "Briefcase",
    fromPrice: 600,
    packages: [
      { name: "Тимбилдинг", duration: "4 ч, 1 яхта", price: 600 },
      { name: "Регата", duration: "6 ч, 2+ яхты", price: 2400 },
      { name: "Банкет на воде", duration: "день", price: 4800 },
    ],
    suitableYachts: ["eva", "alfa", "mario", "bravo"],
  },
  {
    slug: "svidanie",
    h1: "Романтическое свидание на яхте",
    shortTitle: "Свидание",
    utp: "Камерная EVA с тиковой палубой — на двоих, закатный выход",
    icon: "Sparkles",
    fromPrice: 300,
    packages: [
      { name: "Закатный", duration: "2 ч", price: 300 },
      { name: "Вечер с фотографом", duration: "3 ч", price: 450 },
      { name: "Предложение руки", duration: "2 ч", price: 300 },
    ],
    suitableYachts: ["eva", "alfa"],
  },
  {
    slug: "devichnik",
    h1: "Девичник на яхте",
    shortTitle: "Девичник",
    utp: "До 8 человек, аудиосистема, фуршетный стол на палубе",
    icon: "GlassWater",
    fromPrice: 300,
    packages: [
      { name: "Базовый", duration: "2 ч", price: 300 },
      { name: "Закатный", duration: "3 ч", price: 450 },
      { name: "Премиум + декор", duration: "4 ч", price: 700 },
    ],
    suitableYachts: ["alfa", "bravo"],
  },
  {
    slug: "fotosessiya",
    h1: "Фотосессия на яхте",
    shortTitle: "Фотосессия",
    utp: "Тиковая палуба, белые паруса, купальная платформа на моторной",
    icon: "Camera",
    fromPrice: 200,
    packages: [
      { name: "Короткая", duration: "1 ч", price: 200 },
      { name: "Полноценная", duration: "2 ч", price: 300 },
      { name: "Свадебная / семейная", duration: "3 ч", price: 450 },
    ],
    suitableYachts: ["eva", "mario", "bravo"],
  },
];
