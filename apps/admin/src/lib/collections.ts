// Конфиг коллекций для форм админки (ADR-013). Зеркалит схему PocketBase.
// Вложенные объекты — group (структурный редактор), списки объектов — objectList
// (репитер), списки строк — stringList. Никакого сырого JSON для заказчика.

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "bool"
  | "select"
  | "stringList"
  | "group"
  | "objectList"
  | "photos";

export type FieldSpec = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  help?: string;
  fields?: FieldSpec[]; // для group
  itemFields?: FieldSpec[]; // для objectList
  itemLabel?: string; // подпись кнопки «добавить»
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

// Пара {label, href} — соцсеть/мессенджер.
const linkGroup = (name: string, label: string): FieldSpec => ({
  name,
  label,
  type: "group",
  fields: [
    { name: "label", label: "Подпись", type: "text" },
    { name: "href", label: "Ссылка", type: "text" },
  ],
});

export const COLLECTIONS: CollectionCfg[] = [
  {
    name: "yachts",
    label: "Яхты",
    titleField: "name",
    listColumns: ["name", "type", "pricePerHour", "published"],
    fields: [
      { name: "slug", label: "Slug (адрес)", type: "text", required: true },
      { name: "name", label: "Название", type: "text", required: true },
      {
        name: "type",
        label: "Тип",
        type: "select",
        options: ["sail", "motor", "sail-motor"],
        required: true,
      },
      { name: "capacity", label: "Вместимость, чел", type: "number", required: true },
      { name: "lengthMeters", label: "Длина, м", type: "number" },
      { name: "pricePerHour", label: "Цена/час, BYN", type: "number", required: true },
      { name: "minHours", label: "Минимум часов", type: "number" },
      { name: "description", label: "Описание", type: "textarea" },
      { name: "photos", label: "Фотографии", type: "photos" },
      { name: "features", label: "Что входит", type: "stringList" },
      { name: "suitableFor", label: "Подходит для (теги)", type: "stringList" },
      {
        name: "specs",
        label: "Техпаспорт",
        type: "group",
        fields: [
          { name: "model", label: "Модель", type: "text" },
          { name: "builder", label: "Верфь", type: "text" },
          { name: "lengthM", label: "Длина (LOA), м", type: "number" },
          { name: "beamM", label: "Ширина, м", type: "number" },
          { name: "draftM", label: "Осадка, м", type: "text" },
          { name: "cabins", label: "Кают", type: "number" },
          { name: "berths", label: "Спальных мест", type: "number" },
          { name: "sailAreaM2", label: "Площадь парусов, м²", type: "number" },
          { name: "headroomM", label: "Высота в каюте, м", type: "number" },
          { name: "yearsBuilt", label: "Годы выпуска", type: "text" },
        ],
      },
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
      { name: "slug", label: "Slug (адрес)", type: "text", required: true },
      { name: "h1", label: "Заголовок (H1)", type: "text", required: true },
      { name: "shortTitle", label: "Короткое название", type: "text" },
      { name: "utp", label: "УТП (подзаголовок)", type: "text" },
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
      { name: "slug", label: "Slug (адрес)", type: "text", required: true },
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
      { name: "season", label: "Сезон действия", type: "text" },
      { name: "lead", label: "Лид", type: "textarea" },
      { name: "offer", label: "Оффер (абзацы)", type: "stringList" },
      { name: "photos", label: "Фото (пути)", type: "stringList" },
      { name: "photoAlts", label: "Alt-подписи фото", type: "stringList" },
      {
        name: "faq",
        label: "Вопросы-ответы",
        type: "objectList",
        itemLabel: "вопрос",
        itemFields: [
          { name: "question", label: "Вопрос", type: "text" },
          { name: "answer", label: "Ответ", type: "textarea" },
        ],
      },
    ],
  },
  {
    name: "contacts",
    label: "Контакты",
    singleton: true,
    titleField: "email",
    listColumns: [],
    fields: [
      {
        name: "phones",
        label: "Телефоны",
        type: "objectList",
        itemLabel: "телефон",
        itemFields: [
          { name: "label", label: "Номер", type: "text" },
          { name: "href", label: "Ссылка (tel:)", type: "text" },
          { name: "primary", label: "Основной", type: "bool" },
        ],
      },
      linkGroup("email", "Email"),
      linkGroup("telegram", "Telegram"),
      linkGroup("instagram", "Instagram"),
      linkGroup("viber", "Viber"),
      {
        name: "address",
        label: "Адрес",
        type: "group",
        fields: [
          { name: "line1", label: "Адрес", type: "text" },
          { name: "line2", label: "Уточнение", type: "text" },
          { name: "hours", label: "Часы работы", type: "text" },
          { name: "mapsUrl", label: "Ссылка на карту", type: "text" },
        ],
      },
      {
        name: "legal",
        label: "Юрлицо",
        type: "group",
        fields: [
          { name: "entity", label: "Название", type: "text" },
          { name: "unp", label: "УНП", type: "text" },
          { name: "legalAddress", label: "Юр. адрес", type: "text" },
          { name: "registeredAt", label: "Дата регистрации", type: "text" },
          {
            name: "bank",
            label: "Банк",
            type: "group",
            fields: [
              { name: "account", label: "Счёт (IBAN)", type: "text" },
              { name: "currency", label: "Валюта", type: "text" },
              { name: "name", label: "Банк", type: "text" },
              { name: "bic", label: "BIC", type: "text" },
            ],
          },
        ],
      },
    ],
  },
];

export function collectionByName(name: string): CollectionCfg | undefined {
  return COLLECTIONS.find((c) => c.name === name);
}
