import { Link } from "@/i18n/navigation";
import { SERVICES } from "@/shared/content/services";
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
import styles from "./ServicesIndex.module.scss";

const ICONS: Record<string, LucideIcon> = {
  Heart,
  Cake,
  Briefcase,
  Sparkles,
  GlassWater,
  Camera,
};

export function ServicesIndex() {
  return (
    <section className={styles.root} aria-labelledby="services-index-title">
      <div className={styles.container}>
        <SectionHeader
          eyebrow="Услуги"
          title="Каталог услуг"
          subtitle="6 проверенных форматов. Для каждого — свои яхты, пакеты и цены. Нажмите, чтобы посмотреть детали."
          as="h1"
          id="services-index-title"
        />

        <ul className={styles.grid}>
          {SERVICES.map((service) => {
            const Icon = ICONS[service.icon] ?? Sparkles;
            return (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className={styles.card}>
                  <span className={styles.iconWrap} aria-hidden="true">
                    <Icon className={styles.icon} />
                  </span>
                  <h2 className={styles.title}>{service.shortTitle}</h2>
                  <p className={styles.utp}>{service.utp}</p>
                  <div className={styles.footer}>
                    <div className={styles.price}>
                      <span className={styles.priceLabel}>от</span>
                      <span className={styles.priceValue}>{service.fromPrice}</span>
                      <span className={styles.priceSuffix}>BYN</span>
                    </div>
                    <span className={styles.more}>
                      Подробнее
                      <ArrowRight className={styles.moreIcon} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
