"use client";

import type { Service } from "@/entities/service/model/types";
import type { Yacht } from "@/entities/yacht/model/types";
import { Link } from "@/i18n/navigation";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { servicePhoto } from "@/widgets/landing/_data/service-photos";
import clsx from "clsx";
import { ArrowRight, CalendarDays, Sailboat } from "lucide-react";
import styles from "./ServiceDetail.module.scss";

type Props = {
  service: Service;
  yachts: Yacht[];
};

export function ServiceDetail({ service, yachts }: Props) {
  const { open } = usePanel();

  return (
    <PageShell
      hero={
        <PageHero
          crumbs={[
            { label: "Главная", href: "/" },
            { label: "Услуги", href: "/services" },
            { label: service.shortTitle },
          ]}
          title={service.h1}
          lead={service.utp}
          image={servicePhoto(service.slug).url}
          titleId={`svc-${service.slug}-title`}
        >
          <button
            type="button"
            className={styles.heroCta}
            onClick={() => open("order", { service: service.slug })}
          >
            <CalendarDays className={styles.heroCtaIcon} aria-hidden="true" />
            Посмотреть даты
          </button>
        </PageHero>
      }
    >
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
                  <Link href={`/fleet/${y.slug}`} className={styles.yachtChip}>
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
    </PageShell>
  );
}
