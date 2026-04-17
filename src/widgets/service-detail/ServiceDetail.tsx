"use client";

import type { Service } from "@/entities/service/model/types";
import type { Yacht } from "@/entities/yacht/model/types";
import { Link } from "@/i18n/navigation";
import { usePanel } from "@/shared/lib/panel/usePanel";
import clsx from "clsx";
import {
  ArrowRight,
  Briefcase,
  Cake,
  CalendarDays,
  Camera,
  GlassWater,
  Heart,
  Sailboat,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import styles from "./ServiceDetail.module.scss";

const ICONS: Record<string, LucideIcon> = {
  Heart,
  Cake,
  Briefcase,
  Sparkles,
  GlassWater,
  Camera,
};

type Props = {
  service: Service;
  yachts: Yacht[];
};

export function ServiceDetail({ service, yachts }: Props) {
  const { open } = usePanel();
  const Icon = ICONS[service.icon] ?? Sparkles;

  return (
    <>
      <section className={styles.hero} aria-labelledby={`svc-${service.slug}-title`}>
        <div className={styles.container}>
          <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
            <Link href="/" className={styles.breadcrumbLink}>
              Главная
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/services" className={styles.breadcrumbLink}>
              Услуги
            </Link>
            <span aria-hidden="true">/</span>
            <span>{service.shortTitle}</span>
          </nav>

          <span className={styles.iconWrap} aria-hidden="true">
            <Icon className={styles.heroIcon} />
          </span>

          <h1 id={`svc-${service.slug}-title`} className={styles.h1}>
            {service.h1}
          </h1>
          <p className={styles.utp}>{service.utp}</p>

          <button
            type="button"
            className={styles.heroCta}
            onClick={() => open("order", { service: service.slug })}
          >
            <CalendarDays className={styles.heroCtaIcon} aria-hidden="true" />
            Посмотреть даты
          </button>
        </div>
      </section>

      <section
        className={clsx(styles.section, styles.alt)}
        aria-labelledby={`svc-${service.slug}-packages`}
      >
        <div className={styles.container}>
          <h2 id={`svc-${service.slug}-packages`} className={styles.sectionTitle}>
            Пакеты и цены
          </h2>
          <div className={styles.priceTableWrap}>
            <table className={styles.priceTable}>
              <thead>
                <tr>
                  <th scope="col" className={styles.stickyCol}>
                    Пакет
                  </th>
                  <th scope="col">Длительность</th>
                  <th scope="col">Цена</th>
                </tr>
              </thead>
              <tbody>
                {service.packages.map((pkg) => (
                  <tr key={pkg.name}>
                    <th scope="row" className={styles.stickyCol}>
                      {pkg.name}
                    </th>
                    <td>{pkg.duration}</td>
                    <td className={styles.price}>{pkg.price} BYN</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {yachts.length > 0 && (
        <section className={styles.section} aria-labelledby={`svc-${service.slug}-yachts`}>
          <div className={styles.container}>
            <h2 id={`svc-${service.slug}-yachts`} className={styles.sectionTitle}>
              Подходящие яхты
            </h2>
            <ul className={styles.yachtList}>
              {yachts.map((y) => (
                <li key={y.slug}>
                  <Link href="/fleet" className={styles.yachtChip}>
                    <Sailboat
                      style={{ inlineSize: "1rem", blockSize: "1rem" }}
                      aria-hidden="true"
                    />
                    {y.name} · до {y.capacity}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className={clsx(styles.section, styles.alt)}>
        <div className={styles.container}>
          <div className={styles.finalCta}>
            <h2 className={styles.finalCtaTitle}>
              Подберём дату и яхту под {service.shortTitle.toLowerCase()}
            </h2>
            <p className={styles.finalCtaLead}>
              Напишите — ответим за 30 минут, подскажем свободные окна и зафиксируем авансом 30%.
            </p>
            <button
              type="button"
              className={styles.heroCta}
              onClick={() => open("order", { service: service.slug })}
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
