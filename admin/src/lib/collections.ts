// Конфиг коллекций для форм админки (ADR-013). Зеркалит схему PocketBase
// (pocketbase/pb_migrations). Сложные вложенные поля — тип json (редактор
// правит как JSON); списки строк — stringList (по строке на элемент).

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "bool"
  | "select"
  | "stringList"
  | "json";

export type FieldSpec = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  help?: string;
};

export type CollectionCfg = {
  name: string;
  label: string;
  singleton?: boolean;
  titleField: string;
  listColumns: string[];
  fields: FieldSpec[];
};

const PUBLISHED: FieldSpec = {
  name: "published",
  label: "Опубликовано",
  type: "bool",
};

export const COLLECTIONS: CollectionCfg[] = [
  {
    name: "yachts",
    label: "Яхты",
    titleField: "name",
    listColumns: ["name", "type", "pricePerHour", "published"],
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "name", label: "Название", type: "text", required: true },
      {
        name: "type",
        label: "Тип",
        type: "select",
        options: ["sail", "motor", "sail-motor"],
        required: true,
      },
      { name: "capacity", label: "Вместимость", type: "number", required: true },
      { name: "lengthMeters", label: "Длина, м", type: "number" },
      {
        name: "pricePerHour",
        label: "Цена/час, BYN",
        type: "number",
        required: true,
      },
      { name: "minHours", label: "Минимум часов", type: "number" },
      { name: "description", label: "Описание", type: "textarea" },
      { name: "features", label: "Что входит", type: "stringList" },
      { name: "suitableFor", label: "Подходит для (теги)", type: "stringList" },
      { name: "gallery", label: "Галерея (пути)", type: "stringList" },
      { name: "mainImage", label: "Обложка (путь)", type: "text" },
      { name: "video", label: "Видео (путь)", type: "text" },
      { name: "specs", label: "Техпаспорт (JSON)", type: "json" },
      {
        name: "badge",
        label: "Плашка",
        type: "select",
        options: ["", "flagship", "new"],
      },
      PUBLISHED,
    ],
  },
  {
    name: "services",
    label: "Услуги",
    titleField: "h1",
    listColumns: ["h1", "fromPrice", "published"],
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "h1", label: "H1 (заголовок)", type: "text", required: true },
      { name: "shortTitle", label: "Короткое название", type: "text" },
      { name: "utp", label: "УТП (подзаголовок)", type: "text" },
      { name: "icon", label: "Иконка (Lucide)", type: "text" },
      { name: "fromPrice", label: "От, BYN/час", type: "number" },
      {
        name: "suitableYachts",
        label: "Подходящие яхты (slug)",
        type: "stringList",
      },
      PUBLISHED,
    ],
  },
  {
    name: "faq",
    label: "FAQ",
    titleField: "question",
    listColumns: ["question", "published"],
    fields: [
      { name: "key", label: "Ключ", type: "text", required: true },
      { name: "question", label: "Вопрос", type: "text", required: true },
      { name: "answer", label: "Ответ", type: "textarea", required: true },
      { name: "bullets", label: "Пункты (список)", type: "stringList" },
      { name: "tags", label: "Теги", type: "stringList" },
      PUBLISHED,
    ],
  },
  {
    name: "documents",
    label: "Документы",
    titleField: "title",
    listColumns: ["title", "published"],
    fields: [
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "title", label: "Заголовок", type: "text", required: true },
      { name: "lead", label: "Лид", type: "textarea" },
      { name: "paragraphs", label: "Абзацы", type: "stringList" },
      PUBLISHED,
    ],
  },
  {
    name: "instagram_stories",
    label: "Instagram",
    titleField: "author",
    listColumns: ["author", "caption", "published"],
    fields: [
      { name: "key", label: "Ключ", type: "text", required: true },
      { name: "cover", label: "Обложка (путь)", type: "text" },
      { name: "caption", label: "Подпись", type: "textarea" },
      { name: "author", label: "Автор", type: "text" },
      { name: "date", label: "Дата", type: "text" },
      { name: "url", label: "Ссылка", type: "text" },
      PUBLISHED,
    ],
  },
  {
    name: "certificates",
    label: "Сертификаты",
    singleton: true,
    titleField: "season",
    listColumns: [],
    fields: [
      { name: "priceFrom", label: "Цена от, BYN", type: "number" },
      { name: "season", label: "Сезон", type: "text" },
      { name: "lead", label: "Лид", type: "textarea" },
      { name: "offer", label: "Оффер (абзацы)", type: "stringList" },
      { name: "photos", label: "Фото (пути)", type: "stringList" },
      { name: "photoAlts", label: "Alt фото", type: "stringList" },
      { name: "faq", label: "FAQ (JSON)", type: "json" },
    ],
  },
  {
    name: "contacts",
    label: "Контакты",
    singleton: true,
    titleField: "email",
    listColumns: [],
    fields: [
      { name: "phones", label: "Телефоны (JSON)", type: "json" },
      { name: "email", label: "Email (JSON)", type: "json" },
      { name: "telegram", label: "Telegram (JSON)", type: "json" },
      { name: "instagram", label: "Instagram (JSON)", type: "json" },
      { name: "viber", label: "Viber (JSON)", type: "json" },
      { name: "address", label: "Адрес (JSON)", type: "json" },
      { name: "legal", label: "Юрлицо (JSON)", type: "json" },
    ],
  },
];

export function collectionByName(name: string): CollectionCfg | undefined {
  return COLLECTIONS.find((c) => c.name === name);
}
