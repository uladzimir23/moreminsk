import { YACHTS } from "@/shared/content/yachts";
import { COVER_BY_YACHT, type YachtSlug } from "../../_data/photos";
import styles from "./fleet-section.module.scss";

const TYPE_LABEL = {
  sail: "Парусная",
  motor: "Моторная",
  "sail-motor": "Парусно-моторная",
} as const;

export function FleetSection() {
  return (
    <section className={styles.section} id="fleet">
      <div className={styles.head}>
        <p className={styles.eyebrow}>01 · Флот</p>
        <h2 className={styles.title}>
          Четыре яхты — выбирайте <span className={styles.accent}>настроение.</span>
        </h2>
      </div>

      <div className={styles.grid}>
        {YACHTS.map((yacht) => {
          const cover = COVER_BY_YACHT[yacht.slug as YachtSlug];
          return (
            <a key={yacht.slug} href={`#yacht-${yacht.slug}`} className={styles.card}>
              <div className={styles.photo}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cover} alt={`Яхта ${yacht.name} на Минском море`} loading="lazy" />
                {yacht.badge === "flagship" && <span className={styles.badge}>Флагман</span>}
              </div>
              <div className={styles.body}>
                <h3 className={styles.name}>{yacht.name}</h3>
                <p className={styles.spec}>
                  {TYPE_LABEL[yacht.type]} · до {yacht.capacity} гостей
                </p>
                <p className={styles.desc}>{yacht.description}</p>
                <div className={styles.foot}>
                  <span className={styles.price}>
                    <span className={styles.priceLabel}>от</span>
                    <span className={styles.priceValue}>{yacht.pricePerHour}</span>
                    <span className={styles.priceSuffix}>BYN/ч</span>
                  </span>
                  <span className={styles.arrow} aria-hidden="true">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
