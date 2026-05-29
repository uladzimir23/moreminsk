import type { Service } from "@/entities/service/model/types";
import type { Yacht } from "@/entities/yacht/model/types";
import { CONTACTS } from "@/shared/content/contacts";
import { SITE, localeUrl } from "./seo";

// Stable @id anchors so nodes can reference each other across pages.
const ORG_ID = `${SITE.url}/#organization`;
const BUSINESS_ID = `${SITE.url}/#business`;

const phone = CONTACTS.phones[0].href.replace("tel:", "");
const sameAs = [CONTACTS.instagram.href, CONTACTS.telegram.href];

// Brand entity — emitted site-wide (in the [locale] layout).
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    alternateName: SITE.alternateName,
    url: SITE.url,
    telephone: phone,
    email: CONTACTS.email.label,
    sameAs,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    inLanguage: "ru-BY",
    publisher: { "@id": ORG_ID },
  };
}

// The bookable business — home + /contacts. No aggregateRating yet: reviews are
// placeholders, so emitting a rating would be fake structured data.
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    name: SITE.name,
    alternateName: SITE.alternateName,
    image: `${SITE.url}${SITE.defaultOgImage}`,
    url: SITE.url,
    telephone: phone,
    email: CONTACTS.email.label,
    priceRange: "150–3000 BYN",
    currenciesAccepted: "BYN",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Вокзальная, 8а",
      addressLocality: "д. Качино, Ждановичский с/с",
      addressRegion: "Минская область",
      addressCountry: "BY",
    },
    geo: { "@type": "GeoCoordinates", latitude: 53.953826, longitude: 27.371164 },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:00",
        closes: "22:00",
      },
    ],
    areaServed: { "@type": "Place", name: "Минское водохранилище (Минское море)" },
    sameAs,
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(items: ReadonlyArray<Crumb>, locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: localeUrl(locale, item.path),
    })),
  };
}

export function serviceSchema(service: Service, locale: string) {
  const url = localeUrl(locale, `/services/${service.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.h1,
    serviceType: service.shortTitle,
    description: service.utp,
    provider: { "@id": BUSINESS_ID },
    areaServed: { "@type": "Place", name: "Минское водохранилище" },
    url,
    offers: {
      "@type": "Offer",
      priceCurrency: "BYN",
      price: String(service.fromPrice),
      availability: "https://schema.org/InStock",
      url,
    },
  };
}

export function productSchema(yacht: Yacht, locale: string) {
  const url = localeUrl(locale, `/fleet/${yacht.slug}`);
  const s = yacht.specs;
  const additionalProperty = s
    ? [
        { "@type": "PropertyValue", name: "Длина", value: `${s.lengthM} м` },
        { "@type": "PropertyValue", name: "Ширина", value: `${s.beamM} м` },
        { "@type": "PropertyValue", name: "Осадка", value: `${s.draftM} м` },
        { "@type": "PropertyValue", name: "Вместимость", value: `${yacht.capacity} чел.` },
        ...(s.berths
          ? [{ "@type": "PropertyValue", name: "Спальных мест", value: String(s.berths) }]
          : []),
      ]
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: `Яхта ${yacht.name}`,
    description: yacht.description,
    category: "Аренда яхты",
    url,
    ...(s ? { brand: { "@type": "Brand", name: s.builder }, model: s.model } : {}),
    ...(additionalProperty ? { additionalProperty } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "BYN",
      price: String(yacht.pricePerHour),
      availability: "https://schema.org/InStock",
      url,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: String(yacht.pricePerHour),
        priceCurrency: "BYN",
        unitText: "час",
      },
    },
  };
}

export function imageGallerySchema(name: string, images: ReadonlyArray<string>) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name,
    associatedMedia: images.map((src) => ({
      "@type": "ImageObject",
      contentUrl: src.startsWith("http") ? src : `${SITE.url}${src}`,
    })),
  };
}

export function faqPageSchema(
  items: ReadonlyArray<{
    question: string;
    answer: string;
    bullets?: ReadonlyArray<string>;
  }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => {
      // Bullets get merged into the answer text so search engines see the full
      // inventory (Google reads acceptedAnswer.text, not the surrounding DOM).
      const text = item.bullets?.length
        ? `${item.answer} ${item.bullets.join(" · ")}`
        : item.answer;
      return {
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text },
      };
    }),
  };
}
