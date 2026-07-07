import type { Service } from "@/entities/service/model/types";

// Цены обновлены с заказчиком 2026-05-27: почасовая модель, минимум 1 час, без
// пакетов 2ч/4ч. fromPrice = ставка самой дешёвой подходящей яхты (EVA 150 /
// MARIO 180) → видимое «от X BYN/час». Все яхты доступны под любую услугу.
//
// 2026-05-27: «Свадьба» убрана по просьбе заказчика. Набор — парусная/моторная
// прогулки, день рождения, корпоратив, свидание, девичник, фотосессия,
// мастер-класс. «Корпоратив» — наш SEO-актив, на оригинале страницы его нет.
export const SERVICES: ReadonlyArray<Service> = [
  {
    slug: "progulka-parusnaya",
    h1: "Прогулка на парусной яхте в Минске",
    shortTitle: "Парусная прогулка",
    utp: "Под парусом по Минскому морю — капитан и топливо в цене",
    icon: "Sailboat",
    fromPrice: 150,
    suitableYachts: ["eva", "alfa", "bravo"],
  },
  {
    slug: "progulka-motornaya",
    h1: "Прогулка на моторной яхте в Минске",
    shortTitle: "Моторная прогулка",
    utp: "MARIO с купальной платформой — идёт по графику в любую погоду",
    icon: "Ship",
    fromPrice: 180,
    suitableYachts: ["mario"],
  },
  {
    slug: "den-rozhdeniya",
    h1: "День рождения на яхте",
    shortTitle: "День рождения",
    utp: "До 8 гостей, аудиосистема и фуршетный столик на палубе",
    icon: "Cake",
    fromPrice: 150,
    suitableYachts: ["eva", "alfa", "mario", "bravo"],
  },
  {
    slug: "korporativ",
    h1: "Корпоратив на яхте",
    shortTitle: "Корпоратив",
    utp: "Безнал и документы для юрлица, до 32 человек на 2–4 яхтах",
    icon: "Briefcase",
    fromPrice: 150,
    suitableYachts: ["eva", "alfa", "mario", "bravo"],
  },
  {
    slug: "svidanie",
    h1: "Романтическое свидание на яхте",
    shortTitle: "Свидание",
    utp: "Камерная EVA с тиковой палубой — на двоих, закатный выход",
    icon: "Sparkles",
    fromPrice: 150,
    suitableYachts: ["eva", "alfa", "mario", "bravo"],
  },
  {
    slug: "devichnik",
    h1: "Девичник на яхте",
    shortTitle: "Девичник",
    utp: "До 8 человек, аудиосистема, фуршетный стол на палубе",
    icon: "GlassWater",
    fromPrice: 150,
    suitableYachts: ["eva", "alfa", "mario", "bravo"],
  },
  {
    slug: "fotosessiya",
    h1: "Фотосессия на яхте",
    shortTitle: "Фотосессия",
    utp: "Тиковая палуба, белые паруса, купальная платформа на моторной",
    icon: "Camera",
    fromPrice: 150,
    suitableYachts: ["eva", "alfa", "mario", "bravo"],
  },
  {
    slug: "master-klass",
    h1: "Мастер-класс по яхтингу в Минске",
    shortTitle: "Мастер-класс",
    utp: "Базовые навыки под парусом с капитаном-инструктором, до 4 человек",
    icon: "Compass",
    fromPrice: 150,
    suitableYachts: ["eva", "alfa", "bravo"],
  },
];
