import type { Service } from "@/entities/service/model/types";

// Цены и состав пакетов согласованы с заказчиком 2026-05-23.
// «От X BYN» = минимальная видимая цена в карточке. Стандартные пакеты — 2 ч / 350 и 4 ч / 500.
// Все яхты доступны под любую услугу.
//
// 2026-05-26: набор расширен до реального состава moreminsk.by (см.
// raw-media/scraped/facts.md): возвращена «Свадьба», добавлены парусная/моторная
// прогулки и мастер-класс. «Корпоратив» — наш SEO-актив, на оригинале страницы нет.
// ⚠️ Цены свадьбы/прогулок/мастер-класса взяты по почасовой ставке сайта +
// стандартным пакетам — отдельно подтвердить у Павла.
export const SERVICES: ReadonlyArray<Service> = [
  {
    slug: "progulka-parusnaya",
    h1: "Прогулка на парусной яхте в Минске",
    shortTitle: "Парусная прогулка",
    utp: "Под парусом по Минскому морю — капитан и топливо в цене",
    icon: "Sailboat",
    fromPrice: 150,
    packages: [
      { name: "Час", duration: "1 ч", price: 150 },
      { name: "Закатные два", duration: "2 ч", price: 300 },
      { name: "Полдня", duration: "4 ч", price: 500 },
    ],
    suitableYachts: ["eva", "alfa", "bravo"],
  },
  {
    slug: "progulka-motornaya",
    h1: "Прогулка на моторной яхте в Минске",
    shortTitle: "Моторная прогулка",
    utp: "MARIO с купальной платформой — идёт по графику в любую погоду",
    icon: "Ship",
    fromPrice: 150,
    packages: [
      { name: "Час", duration: "1 ч", price: 150 },
      { name: "Два часа", duration: "2 ч", price: 300 },
      { name: "Полдня", duration: "4 ч", price: 500 },
    ],
    suitableYachts: ["mario"],
  },
  {
    slug: "svadba",
    h1: "Свадьба на яхте в Минске",
    shortTitle: "Свадьба",
    utp: "Церемония и фуршет на палубе, фото-зона у штурвала, до 10 гостей",
    icon: "Heart",
    fromPrice: 200,
    packages: [
      { name: "Церемония", duration: "2 ч", price: 350 },
      { name: "Свадебный день", duration: "4 ч", price: 500 },
    ],
    suitableYachts: ["bravo", "alfa", "mario", "eva"],
  },
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
  {
    slug: "master-klass",
    h1: "Мастер-класс по яхтингу в Минске",
    shortTitle: "Мастер-класс",
    utp: "Базовые навыки под парусом с капитаном-инструктором, до 4 человек",
    icon: "Compass",
    fromPrice: 200,
    packages: [
      { name: "Знакомство", duration: "1 ч", price: 200 },
      { name: "Базовый", duration: "2 ч", price: 350 },
    ],
    suitableYachts: ["eva", "alfa", "bravo"],
  },
];
