import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { PHOTOS_BY_YACHT } from "@/widgets/landing/_data/photos";
import styles from "./FleetCatalog.module.scss";
import { FleetList } from "./FleetList";

// Fleet catalog — a stacked showcase, one atmospheric panel per yacht (the
// active photo blurred behind a dark scrim, crisp photo + Lora-italic name +
// accent CTA on top), photo and info alternating sides on desktop.
export function FleetCatalog() {
  return (
    <PageShell
      hero={
        <PageHero
          crumbs={[{ label: "Главная", href: "/" }, { label: "Флот" }]}
          eyebrow="Флот"
          title="Четыре яхты —"
          accent="выбирайте настроение."
          lead="Три парусные и одна моторная, от 2 до 10 гостей. Капитан и топливо в цене."
          image={PHOTOS_BY_YACHT.eva[0]}
          titleId="fleet-catalog-title"
        />
      }
    >
      <section className={styles.root} aria-labelledby="fleet-catalog-title">
        <FleetList />
      </section>
    </PageShell>
  );
}
