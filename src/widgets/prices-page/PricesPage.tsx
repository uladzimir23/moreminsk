"use client";

import type { Yacht } from "@/entities/yacht/model/types";
import { Link } from "@/i18n/navigation";
import { SERVICES } from "@/shared/content/services";
import { YACHTS } from "@/shared/content/yachts";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { COVER_BY_YACHT } from "@/widgets/landing/_data/photos";
import { ArrowRight } from "lucide-react";
import styles from "./PricesPage.module.scss";

const TYPE_LABEL: Record<Yacht["type"], string> = {
  sail: "Парусная",
  motor: "Моторная",
  "sail-motor": "Парусно-моторная",
};

export function PricesPage() {
  const { open } = usePanel();

  return (
    <PageShell
      hero={
        <PageHero
          crumbs={[{ label: "Главная", href: "/" }, { label: "Цены" }]}
          eyebrow="Цены"
          title="Цены на аренду яхт"
          accent="в Минске"
          lead="Почасовые ставки яхт и пакеты под событие. Капитан и топливо уже в цене. Это ориентир — точную стоимость подтверждаем при звонке под вашу дату и состав."
          image={COVER_BY_YACHT.bravo}
          titleId="prices-title"
        />
      }
    >
      <section className={styles.section} aria-labelledby="prices-title">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Яхты — почасовая аренда</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col" className={styles.stickyCol}>
                    Яхта
                  </th>
                  <th scope="col">Тип</th>
                  <th scope="col">Гостей</th>
                  <th scope="col">Цена/час</th>
                  <th scope="col">Минимум</th>
                </tr>
              </thead>
              <tbody>
                {YACHTS.map((y) => (
                  <tr key={y.slug}>
                    <th scope="row" className={styles.stickyCol}>
                      <Link href={`/fleet/${y.slug}`} className={styles.rowLink}>
                        {y.name}
                      </Link>
                    </th>
                    <td>{TYPE_LABEL[y.type]}</td>
                    <td>до {y.capacity}</td>
                    <td className={styles.price}>от {y.pricePerHour} BYN</td>
                    <td>{y.minHours} ч</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.alt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Пакеты под событие</h2>
          <ul className={styles.serviceList}>
            {SERVICES.map((s) => (
              <li key={s.slug} className={styles.serviceCard}>
                <Link href={`/services/${s.slug}`} className={styles.serviceName}>
                  {s.shortTitle}
                  <ArrowRight className={styles.serviceIcon} aria-hidden="true" />
                </Link>
                <ul className={styles.pkgList}>
                  {s.packages.map((p) => (
                    <li key={`${p.name}-${p.duration}`} className={styles.pkg}>
                      <span className={styles.pkgName}>
                        {p.name} · {p.duration}
                      </span>
                      <span className={styles.pkgPrice}>{p.price} BYN</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.cta}>
            <h2 className={styles.ctaTitle}>Соберите свой выход в калькуляторе</h2>
            <p className={styles.ctaLead}>
              Цена обновится сразу — выберите яхту, повод и длительность.
            </p>
            <button type="button" className={styles.ctaBtn} onClick={() => open("order")}>
              Рассчитать стоимость
              <ArrowRight className={styles.ctaIcon} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
