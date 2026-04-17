import type { Review } from "@/entities/review/model/types";

// Заглушки из docs/60 - Content/Reviews (заглушки).md. Пост-MVP — замещаем
// реальными (скриншоты Instagram @moreminsk.by, Google Reviews, запрос у клиентов).
export const REVIEWS: ReadonlyArray<Review> = [
  {
    id: "rev-001",
    authorName: "Анна К.",
    rating: 5,
    date: "2025-07-18",
    text: "Отмечали годовщину свадьбы на EVA — лучшее решение за последние несколько лет. Капитан Артём посоветовал маршрут с красивым закатом, а команда подготовила всё так, что нам осталось только наслаждаться. Обязательно вернёмся следующим летом.",
    occasionType: "svadba",
    yachtSlug: "eva",
    sourceUrl: "https://instagram.com/moreminsk.by",
  },
  {
    id: "rev-002",
    authorName: "Дмитрий П.",
    rating: 5,
    date: "2025-08-03",
    text: "Проводили день рождения жены на ALFA — 6 человек, 4 часа на воде, свой торт и шампанское. Всё прошло без заминок: встретили у причала, объяснили правила, показали кухню. Фотографии с заката получились огонь.",
    occasionType: "den-rozhdeniya",
    yachtSlug: "alfa",
  },
  {
    id: "rev-003",
    authorName: "Екатерина М.",
    rating: 5,
    date: "2025-06-22",
    text: "Заказывали яхту для свадебной фотосессии. Фотограф был в восторге от фактуры — паруса, палуба, блики воды. Яхту подготовили как просили, команда не мешала съёмке. Фотографии увидели гости — все спрашивают, где мы снимали.",
    occasionType: "fotosessiya",
    yachtSlug: "mario",
    sourceUrl: "https://instagram.com/moreminsk.by",
  },
  {
    id: "rev-004",
    authorName: "Алексей Т.",
    rating: 5,
    date: "2025-07-30",
    text: "Корпоратив на BRAVO для 10 человек. Заказывали с кейтерингом через Море Minsk — цены адекватные, еду принесли ровно к началу. Коллеги до сих пор вспоминают. Отдельное спасибо за то, что объяснили технику безопасности перед выходом.",
    occasionType: "korporativ",
    yachtSlug: "bravo",
  },
  {
    id: "rev-005",
    authorName: "Марина Л.",
    rating: 5,
    date: "2025-08-15",
    text: "Романтический вечер на EVA — подарок мужу на годовщину. Встретили с букетом и бутылкой вина от команды (приятный сюрприз). 3 часа вдвоём на закате на Минском водохранилище — круче любого ресторана. Спасибо за атмосферу.",
    occasionType: "svidanie",
    yachtSlug: "eva",
    sourceUrl: "https://instagram.com/moreminsk.by",
  },
];
