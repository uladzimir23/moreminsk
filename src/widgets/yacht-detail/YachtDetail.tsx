"use client";

import type { Service } from "@/entities/service/model/types";
import type { Yacht } from "@/entities/yacht/model/types";
import { Link } from "@/i18n/navigation";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { ArrowRight, CalendarDays, Check, Clock, Sailboat, Ship, Users } from "lucide-react";
import styles from "./YachtDetail.module.scss";

const TYPE_LABEL: Record<Yacht["type"], string> = {
  sail: "Парусная яхта",
  motor: "Моторная яхта",
  "sail-motor": "Парусно-моторная яхта",
};

type Props = {
  yacht: Yacht;
  photos: ReadonlyArray<string>;
  services: ReadonlyArray<Service>;
};

export function YachtDetail({ yacht, photos, services }: Props) {
  const { open } = usePanel();
  const TypeIcon = yacht.type === "motor" ? Ship : Sailboat;

  return (
    <>
      <section className={styles.hero} aria-labelledby={`yacht-${yacht.slug}-title`}>
        <div className={styles.container}>
          <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
            <Link href="/" className={styles.breadcrumbLink}>
              Главная
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/fleet" className={styles.breadcrumbLink}>
              Флот
            </Link>
            <span aria-hidden="true">/</span>
            <span>{yacht.name}</span>
          </nav>

          <p className={styles.eyebrow}>
            <TypeIcon className={styles.eyebrowIcon} aria-hidden="true" />
            {TYPE_LABEL[yacht.type]}
            {yacht.badge === "flagship" && <span className={styles.badge}>флагман</span>}
          </p>

          <h1 id={`yacht-${yacht.slug}-title`} className={styles.h1}>
            Яхта {yacht.name}
          </h1>
          <p className={styles.utp}>{yacht.description}</p>

          <ul className={styles.specs}>
            <li className={styles.spec}>
              <Users className={styles.specIcon} aria-hidden="true" />
              до {yacht.capacity} гостей
            </li>
            <li className={styles.spec}>
              <Clock className={styles.specIcon} aria-hidden="true" />
              мин. {yacht.minHours} ч
            </li>
            <li className={styles.specPriceWrap}>
              <span className={styles.specPrice}>от {yacht.pricePerHour} BYN</span>
              <span className={styles.specUnit}>в час</span>
            </li>
          </ul>

          <button
            type="button"
            className={styles.heroCta}
            onClick={() => open("order", { yacht: yacht.slug })}
          >
            <CalendarDays className={styles.heroCtaIcon} aria-hidden="true" />
            Посмотреть даты
          </button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby={`yacht-${yacht.slug}-onboard`}>
        <div className={styles.container}>
          <h2 id={`yacht-${yacht.slug}-onboard`} className={styles.sectionTitle}>
            Что на борту
          </h2>
          <ul className={styles.features}>
            {yacht.features.map((f) => (
              <li key={f} className={styles.feature}>
                <Check className={styles.featureIcon} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {photos.length > 0 && (
        <section
          className={`${styles.section} ${styles.alt}`}
          aria-labelledby={`yacht-${yacht.slug}-photos`}
        >
          <div className={styles.container}>
            <h2 id={`yacht-${yacht.slug}-photos`} className={styles.sectionTitle}>
              Фото яхты {yacht.name}
            </h2>
            <div className={styles.gallery}>
              {photos.map((src, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={src}
                  className={styles.galleryImg}
                  src={src}
                  alt={`Яхта ${yacht.name} на Минском море — фото ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className={styles.section} aria-labelledby={`yacht-${yacht.slug}-services`}>
          <div className={styles.container}>
            <h2 id={`yacht-${yacht.slug}-services`} className={styles.sectionTitle}>
              Под что подходит
            </h2>
            <ul className={styles.chips}>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className={styles.chip}>
                    {s.shortTitle}
                    <ArrowRight className={styles.chipIcon} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className={`${styles.section} ${styles.alt}`}>
        <div className={styles.container}>
          <div className={styles.finalCta}>
            <h2 className={styles.finalCtaTitle}>Забронировать {yacht.name}</h2>
            <p className={styles.finalCtaLead}>
              Напишите — ответим за 30 минут, подскажем свободные окна и зафиксируем авансом 30%.
            </p>
            <button
              type="button"
              className={styles.heroCta}
              onClick={() => open("order", { yacht: yacht.slug })}
            >
              Оставить заявку
              <ArrowRight className={styles.heroCtaIcon} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
