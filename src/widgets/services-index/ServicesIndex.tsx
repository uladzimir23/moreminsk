"use client";

import { Link } from "@/i18n/navigation";
import { SERVICES } from "@/shared/content/services";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { Accent } from "@/shared/ui/accent/Accent";
import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { COVER_BY_YACHT } from "@/widgets/landing/_data/photos";
import { servicePhoto } from "@/widgets/landing/_data/service-photos";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import styles from "./ServicesIndex.module.scss";

// Services catalog — same stacked-showcase language as the fleet catalog: one
// block per service (curated photo + info, alternating sides), theme-aware.
export function ServicesIndex() {
  const { open } = usePanel();

  return (
    <PageShell
      hero={
        <PageHero
          crumbs={[{ label: "Главная", href: "/" }, { label: "Услуги" }]}
          eyebrow="Услуги"
          title="Под что бронируют"
          accent="чаще всего."
          lead="Девять форматов под событие — у каждого свои яхты, пакеты и цена. Откройте, чтобы посмотреть детали."
          image={COVER_BY_YACHT.alfa}
          titleId="services-index-title"
        />
      }
    >
      <section className={styles.root} aria-labelledby="services-index-title">
        <div className={styles.list}>
          {SERVICES.map((service, i) => {
            const photo = servicePhoto(service.slug);
            return (
              <article
                key={service.slug}
                className={clsx(styles.row, i % 2 === 1 && styles.rowReverse)}
              >
                <Link
                  href={`/services/${service.slug}`}
                  className={styles.media}
                  aria-label={`Открыть услугу «${service.shortTitle}»`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.mediaBg}
                    src={photo.url}
                    alt=""
                    aria-hidden="true"
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  {/* Theme-aware wash — light in the light theme, dark in dark. */}
                  <span className={styles.mediaWash} aria-hidden="true" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.mediaPhoto}
                    src={photo.url}
                    alt={`${service.shortTitle} на яхте`}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </Link>

                <div className={styles.info}>
                  <p className={styles.chapter}>{String(i + 1).padStart(2, "0")} · Услуга</p>
                  <h2 className={styles.name}>
                    <Link href={`/services/${service.slug}`} className={styles.nameLink}>
                      <Accent>{service.shortTitle}</Accent>
                    </Link>
                  </h2>
                  <p className={styles.desc}>{service.utp}</p>

                  <div className={styles.priceBlock}>
                    <span className={styles.priceLabel}>от</span>
                    <span className={styles.priceValue}>{service.fromPrice}</span>
                    <span className={styles.priceSuffix}>BYN</span>
                  </div>

                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.cta}
                      onClick={() => open("order", { service: service.slug })}
                    >
                      Забронировать
                      <ArrowRight className={styles.ctaIcon} aria-hidden="true" />
                    </button>
                    <Link href={`/services/${service.slug}`} className={styles.detailLink}>
                      Подробнее
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
