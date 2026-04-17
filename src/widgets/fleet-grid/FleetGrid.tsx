import { YachtCard } from "@/entities/yacht/ui/YachtCard";
import { YACHTS } from "@/shared/content/yachts";
import styles from "./FleetGrid.module.scss";

export function FleetGrid() {
  return (
    <section id="fleet" className={styles.root} aria-labelledby="fleet-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Флот</span>
          <h2 id="fleet-title" className={styles.title}>
            Четыре яхты под любой повод
          </h2>
          <p className={styles.subtitle}>
            От камерной EVA на двоих до флагмана BRAVO для свадьбы — выберите формат и закройте день
            одной заявкой.
          </p>
        </header>

        <div className={styles.grid}>
          {YACHTS.map((yacht) => (
            <YachtCard key={yacht.slug} yacht={yacht} />
          ))}
        </div>
      </div>
    </section>
  );
}
