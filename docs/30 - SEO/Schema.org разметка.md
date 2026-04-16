---
type: seo-schema
tags: [seo, schema, json-ld]
updated: 2026-04-16
---

# Schema.org разметка (JSON-LD)

> Реализуется через компонент `<JsonLd data={...} />` (по образцу `~/Documents/clariva-spa-landing/src/components/seo/JsonLd.tsx`).

## Типы и соответствие страницам

| Тип Schema.org | Применение | Страницы |
|---|---|---|
| `LocalBusiness` | Фирменная карточка | Главная, /kontakty |
| `Organization` | Бренд-сущность | Все страницы (в layout) |
| `Service` | Услуга | /services/* |
| `Product` | Яхта в аренду | /fleet/* |
| `FAQPage` | Вопросы-ответы | /faq, каждая /services/* |
| `BreadcrumbList` | Хлебные крошки | Все кроме главной |
| `ImageGallery` | Галерея | /galereya, /fleet/* |
| `Review` + `AggregateRating` | Отзывы | /otzyvy, /fleet/*, /services/* |
| `Event` | Спец-события | /services/master-klass, /obuchenie |
| `WebSite` + `SearchAction` | Сайт | Главная |
| `BlogPosting` | Статьи | /blog/* (post-MVP) |

## Шаблоны JSON-LD

### LocalBusiness (главная / контакты)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://moreminsk.by/#business",
  "name": "Море Minsk",
  "alternateName": "ЯхтыМинска",
  "description": "Аренда парусных и моторных яхт на Минском водохранилище",
  "url": "https://moreminsk.by",
  "telephone": "+375296953636",
  "email": "9797-7@mail.ru",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ул. Вокзальная 8а",
    "addressLocality": "д. Качино, Ждановичский с/с",
    "addressRegion": "Минская область",
    "postalCode": "223039",
    "addressCountry": "BY"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 53.95,
    "longitude": 27.43
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "09:00",
    "closes": "22:00"
  }],
  "priceRange": "150-3000 BYN",
  "image": ["https://moreminsk.by/og/main.jpg"],
  "sameAs": [
    "https://t.me/moreminsk",
    "https://instagram.com/moreminsk.by"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "47"
  }
}
```

### Service (страница услуги, пример для свадьбы)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Свадьба на яхте",
  "provider": { "@id": "https://moreminsk.by/#business" },
  "areaServed": {
    "@type": "Place",
    "name": "Минское водохранилище"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "BYN",
    "price": "1500",
    "availability": "https://schema.org/InStock"
  },
  "description": "Свадебная церемония и банкет на яхте..."
}
```

### Product (карточка яхты)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Яхта EVA",
  "description": "Парусная яхта на 6 гостей",
  "brand": { "@id": "https://moreminsk.by/#business" },
  "image": ["https://moreminsk.by/fleet/eva/1.jpg"],
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "BYN",
    "lowPrice": "150",
    "highPrice": "1800",
    "priceValidUntil": "2026-12-31"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "12"
  }
}
```

### FAQPage (страница услуги / /faq)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Входит ли капитан в стоимость аренды?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Да, услуги капитана и топливо включены в стоимость всех тарифов."
      }
    },
    {
      "@type": "Question",
      "name": "Можно ли с детьми?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Да, детям до 12 лет — обязательно спасательный жилет (предоставляем бесплатно)."
      }
    }
  ]
}
```

### BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://moreminsk.by/" },
    { "@type": "ListItem", "position": 2, "name": "Услуги", "item": "https://moreminsk.by/services" },
    { "@type": "ListItem", "position": 3, "name": "Свадьба на яхте", "item": "https://moreminsk.by/services/svadba" }
  ]
}
```

### Review (индивидуальный отзыв)

```json
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": { "@id": "https://moreminsk.by/#business" },
  "author": { "@type": "Person", "name": "Анна К." },
  "datePublished": "2026-03-15",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5"
  },
  "reviewBody": "Отметили день рождения на Alfa — всё супер..."
}
```

## Реализация

1. **Общий layout** — вставляет `Organization` и `WebSite`:
   ```tsx
   // src/app/[locale]/layout.tsx
   <JsonLd data={organizationSchema} />
   <JsonLd data={websiteSchema} />
   ```

2. **Страница** — добавляет свой тип:
   ```tsx
   // src/app/[locale]/services/svadba/page.tsx
   <JsonLd data={serviceSchema} />
   <JsonLd data={faqSchema} />
   <JsonLd data={breadcrumbsSchema} />
   ```

3. **Утилиты** в `src/lib/seo.ts`:
   - `buildLocalBusinessSchema()`
   - `buildServiceSchema({ type, price, description })`
   - `buildFaqSchema(questions)`
   - `buildBreadcrumbsSchema(trail)`
   - `buildProductSchema(yacht)`

## Валидация

Перед релизом прогнать через:
- [Schema.org Validator](https://validator.schema.org/)
- [Rich Results Test (Google)](https://search.google.com/test/rich-results)
- [Яндекс Валидатор микроразметки](https://webmaster.yandex.ru/tools/microtest/)

## Связанные документы
- [[Meta-стратегия]]
- [[../40 - Architecture/Architecture Overview]]
- [[../60 - Content/FAQ]]
