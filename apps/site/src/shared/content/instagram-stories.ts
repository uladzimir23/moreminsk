// Истории клиентов с @moreminsk.by Instagram — секция на /otzyvy под
// Yandex-виджетом. Каждый элемент — публикация/Story с фото-обложкой,
// подписью гостя и ссылкой на пост.
//
// Pavel пришлёт реальные кадры (Stories-скриншоты или posts) → заменим обложки
// и подписи. Сейчас placeholder: кадры из /gallery в Stories-формате (9:16) +
// краткие подписи в стиле Instagram.

export type InstagramStory = {
  id: string;
  /** Обложка — 9:16 (Stories-формат). Лежит в /public/. */
  cover: string;
  /** Подпись гостя (1–2 предложения в стиле IG caption). */
  caption: string;
  /** Автор — @username или имя «Анна К.» */
  author: string;
  /** Дата публикации (для меты). */
  date: string;
  /** Прямая ссылка на пост/Stories Highlight (TBD — Pavel пришлёт). */
  url: string;
};

export const INSTAGRAM_STORIES: ReadonlyArray<InstagramStory> = [
  {
    id: "ig-001",
    cover: "/gallery/sunset-deck.jpg",
    caption: "Закат на EVA — лучший подарок мужу на годовщину. Артём, спасибо!",
    author: "@anna.minsk",
    date: "2025-08-12",
    url: "https://instagram.com/moreminsk.by",
  },
  {
    id: "ig-002",
    cover: "/gallery/aerial-people.jpg",
    caption: "Корпоратив на ALFA для команды из 8 человек. Море, парус, бар — идеально.",
    author: "@dmitry_p",
    date: "2025-07-28",
    url: "https://instagram.com/moreminsk.by",
  },
  {
    id: "ig-003",
    cover: "/gallery/motor-sunset.jpg",
    caption: "День рождения дочки на MARIO. Дети в восторге, торт у штурвала — десять из десяти.",
    author: "@elena.kovaleva",
    date: "2025-08-05",
    url: "https://instagram.com/moreminsk.by",
  },
  {
    id: "ig-004",
    cover: "/gallery/sail-sunset.jpg",
    caption: "Фотосессия для свадебного альбома. BRAVO — флагман не зря: каждый кадр обложка.",
    author: "@photo.minsk",
    date: "2025-09-02",
    url: "https://instagram.com/moreminsk.by",
  },
  {
    id: "ig-005",
    cover: "/gallery/deck-evening.jpg",
    caption: "Девичник на EVA — играли в крокет на корме, пили просекко. Сказка.",
    author: "@katya_belarus",
    date: "2025-07-15",
    url: "https://instagram.com/moreminsk.by",
  },
  {
    id: "ig-006",
    cover: "/gallery/mast.jpg",
    caption: "Постоял за штурвалом — теперь хочу права. Спасибо, капитан!",
    author: "@vlad.sail",
    date: "2025-08-22",
    url: "https://instagram.com/moreminsk.by",
  },
] as const;
