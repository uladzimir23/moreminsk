import { SERVICES } from "@/shared/content/services";
import styles from "./services-section.module.scss";

export function ServicesSection() {
  return (
    <section className={styles.section} id="services">
      <div className={styles.head}>
        <p className={styles.eyebrow}>02 · Услуги</p>
        <h2 className={styles.title}>
          Под что бронируют <span className={styles.accent}>чаще всего.</span>
        </h2>
      </div>

      <div className={styles.list}>
        {SERVICES.map((service) => (
          <a key={service.slug} href={`#service-${service.slug}`} className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.name}>{service.shortTitle}</h3>
              <p className={styles.utp}>{service.utp}</p>
            </div>

            <ul className={styles.packages}>
              {service.packages.map((pkg) => (
                <li key={pkg.name} className={styles.pkg}>
                  <span className={styles.pkgName}>{pkg.name}</span>
                  <span className={styles.pkgMeta}>
                    <span>{pkg.duration}</span>
                    <span className={styles.pkgPrice}>{pkg.price} BYN</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className={styles.foot}>
              <span>от {service.fromPrice} BYN</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
