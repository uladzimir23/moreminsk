// Факты сверены с moreminsk.by/contacts 2026-04-17 (raw-media/scraped/facts.md).
// Single source of truth — Appbar / Footer / panel / contacts page читают только отсюда.

export const CONTACTS = {
  phones: [
    { label: "+375 29 695 36 36", href: "tel:+375296953636", primary: true },
    { label: "+375 29 6 109 107", href: "tel:+375296109107" },
  ],
  email: { label: "9797-7@mail.ru", href: "mailto:9797-7@mail.ru" },
  telegram: { label: "@moreminsk", href: "https://t.me/moreminsk" },
  instagram: { label: "@moreminsk.by", href: "https://instagram.com/moreminsk.by" },
  viber: { label: "+375 29 695 36 36", href: "viber://chat?number=%2B375296953636" },
  address: {
    line1: "Ждановичский с/с, д. Качино, ул. Вокзальная 8а",
    line2: "25 минут от центра Минска",
    hours: "Ежедневно 9:00–22:00",
    // Координаты причала с /contacts (2026-04-17): 53.953826, 27.371164.
    mapsUrl: "https://yandex.by/maps/?ll=27.371164,53.953826&z=16&pt=27.371164,53.953826",
  },
  // Юрлицо — для страницы /documents и счетов юрлицам.
  legal: {
    entity: "ИП Киселёва И.А.",
    unp: "590078696",
    legalAddress: "220033, Минск, ул. Фабричная, 30-100",
    registeredAt: "2010-10-11",
    bank: {
      account: "BY89MTBK30130001093300027992",
      currency: "BYN",
      name: "ЗАО «МТБанк»",
      bic: "MTBKBY22",
    },
  },
  // Yandex.Maps — POI данных яхт-клуба (oid из URL ?oid=193210462372).
  // Iframe widget URL ниже встраивается в карту на /contacts; reviewsWidget — на /otzyvy.
  yandex: {
    oid: "193210462372",
    coords: { lat: 53.953826, lon: 27.371164 },
  },
} as const;
