export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  /** Tag set — used to filter FAQs by service page or general. First tag = primary group. */
  tags: ReadonlyArray<string>;
};

// MVP-набор из docs/60 - Content/FAQ.md. На главной показываем первые 6 general.
// На /faq — весь список, сгруппирован по первому тегу (booking / fleet / payment / general).
export const FAQ: ReadonlyArray<FaqItem> = [
  {
    id: "how-to-book",
    question: "Как забронировать яхту?",
    answer:
      "Напишите в Telegram @moreminsk или позвоните +375 29 695 36 36. Подберём свободную дату, подтвердим по предоплате 30%. Остаток — в день мероприятия.",
    tags: ["booking", "general"],
  },
  {
    id: "min-hours",
    question: "Какой минимум по времени?",
    answer: "2 часа. Дальше — любая кратность по 30 минут.",
    tags: ["booking", "general"],
  },
  {
    id: "bad-weather",
    question: "Что делать при плохой погоде?",
    answer:
      "Если капитан принимает решение, что выход небезопасен — переносим на другую дату без штрафа. Мелкий дождь — не помеха.",
    tags: ["booking", "general"],
  },
  {
    id: "year-round",
    question: "Работаете круглый год?",
    answer:
      "Навигация на Минском море — май–октябрь (зависит от погоды). Зимой — обучение и подарочные сертификаты.",
    tags: ["booking", "general"],
  },
  {
    id: "price-includes",
    question: "Что входит в стоимость?",
    answer:
      "Капитан, топливо, базовое оборудование (спасжилеты, пледы, посуда под напитки). Еда, декор, торт, фотограф — дополнительно.",
    tags: ["payment", "general"],
  },
  {
    id: "cashless",
    question: "Можно оплатить безналом / для юрлица?",
    answer: "Да, работаем по договору с актами и счетами. Для корпоративов — обычная практика.",
    tags: ["payment", "korporativ"],
  },
  {
    id: "deposit",
    question: "Сколько предоплата?",
    answer:
      "30% от стоимости при подтверждении брони. Остаток — наличными или переводом в день мероприятия.",
    tags: ["payment"],
  },
  {
    id: "yacht-choice",
    question: "Чем отличаются яхты между собой?",
    answer:
      "EVA — самая камерная (до 6 гостей), ALFA и MARIO — универсальные на 8 человек, BRAVO — флагман с премиум-мебелью для свадьбы и VIP-мероприятий.",
    tags: ["fleet", "general"],
  },
  {
    id: "capacity",
    question: "Сколько человек помещается на яхту?",
    answer: "От 6 до 10 гостей. Для больших компаний — 2–3 яхты одновременно (до 32 человек).",
    tags: ["fleet"],
  },
  {
    id: "food-drinks",
    question: "Можно со своей едой и напитками?",
    answer:
      "Да, берите с собой. Крепкий алкоголь не запрещаем, но просим меру — капитан отвечает за безопасность.",
    tags: ["fleet", "general"],
  },
  {
    id: "location",
    question: "Где находится причал?",
    answer:
      "Ждановичи, ул. Вокзальная 8а (д. Качино). 25 минут на машине от центра Минска. Парковка бесплатная на месте.",
    tags: ["general"],
  },
  {
    id: "with-kids",
    question: "Можно ли с детьми?",
    answer:
      "Да, дети до 12 лет — в спасательном жилете (выдаём бесплатно). Для совсем маленьких рекомендуем короткие прогулки 1 час.",
    tags: ["general"],
  },
];
