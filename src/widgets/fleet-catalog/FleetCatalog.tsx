import { YACHTS } from "@/shared/content/yachts";
import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { PHOTOS_BY_YACHT, type YachtSlug } from "@/widgets/landing/_data/photos";
import { FleetCard } from "./FleetCard";
import styles from "./FleetCatalog.module.scss";

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
        <div className={styles.list}>
          {YACHTS.map((yacht, i) => (
            <FleetCard
              key={yacht.slug}
              yacht={yacht}
              photos={PHOTOS_BY_YACHT[yacht.slug as YachtSlug] ?? []}
              reverse={i % 2 === 1}
              eager={i === 0}
            />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
