"use client";

import type { Service } from "@/entities/service/model/types";
import { SERVICES } from "@/shared/content/services";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import {
  ArrowRight,
  Briefcase,
  Cake,
  Camera,
  GlassWater,
  Heart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import styles from "./Services.module.scss";

// Map string icon name from content to a Lucide component. Keeps the content
// file JSON-serializable (future CMS migration).
const ICONS: Record<string, LucideIcon> = {
  Heart,
  Cake,
  Briefcase,
  Sparkles,
  GlassWater,
  Camera,
};

export function Services() {
  const { open } = usePanel();

  return (
    <section className={styles.root} aria-labelledby="services-title">
      <div className={styles.container}>
        <SectionHeader
          eyebrow="Услуги"
          title="Для каких поводов подходит"
          subtitle="От романтического свидания до свадебной церемонии — выбирайте формат, мы подготовим всё."
          id="services-title"
        />

        <ul className={styles.grid}>
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.slug}
              service={service}
              onBook={() => open("order", { service: service.slug })}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServiceCard({ service, onBook }: { service: Service; onBook: () => void }) {
  const Icon = ICONS[service.icon] ?? Sparkles;
  return (
    <li className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.iconWrap} aria-hidden="true">
          <Icon className={styles.icon} />
        </span>
        <h3 className={styles.cardTitle}>{service.shortTitle}</h3>
      </div>

      <p className={styles.utp}>{service.utp}</p>

      <div className={styles.footer}>
        <div className={styles.price}>
          <span className={styles.priceLabel}>от</span>
          <span className={styles.priceValue}>{service.fromPrice}</span>
          <span className={styles.priceSuffix}>BYN</span>
        </div>
        <button
          type="button"
          onClick={onBook}
          className={styles.cta}
          aria-label={`Забронировать «${service.shortTitle}»`}
        >
          Узнать
          <ArrowRight className={styles.ctaIcon} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}
