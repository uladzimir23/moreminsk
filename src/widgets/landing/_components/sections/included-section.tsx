import { INCLUDED } from "@/shared/content/included";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import {
  Anchor,
  LifeBuoy,
  Music,
  Navigation,
  Route,
  Sailboat,
  Ship,
  UserRound,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import styles from "./included-section.module.scss";

// «Что входит» — value recap before the booking CTA. Static list (no state) →
// server component. Icon strings from content/included.ts map to Lucide here.
const ICONS: Record<string, LucideIcon> = {
  Anchor,
  LifeBuoy,
  Music,
  Navigation,
  Route,
  Sailboat,
  Ship,
  UserRound,
  Utensils,
};

export function IncludedSection() {
  return (
    <section className={styles.section} id="included">
      <div className={styles.inner}>
        <SectionHeader
          eyebrow="06 · Что входит"
          title="В цене уже"
          accent="всё нужное."
          tone="media"
        />

        <ul className={styles.grid}>
          {INCLUDED.map((item) => {
            const Icon = ICONS[item.icon] ?? Anchor;
            return (
              <li key={item.label} className={styles.item}>
                <span className={styles.icon} aria-hidden="true">
                  <Icon strokeWidth={1.5} />
                </span>
                <span className={styles.label}>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
