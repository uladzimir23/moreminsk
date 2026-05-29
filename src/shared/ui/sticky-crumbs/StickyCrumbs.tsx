"use client";

import { Link } from "@/i18n/navigation";
import styles from "./StickyCrumbs.module.scss";

type Crumb = { label: string; href?: string };

// Thin breadcrumb bar fixed under the header on every inner page (not home).
// Used by PageHero and the yacht detail page; height is exposed as
// --crumbs-bar-h so hosts can offset their top padding / stacked bars.
export function StickyCrumbs({ crumbs }: { crumbs: ReadonlyArray<Crumb> }) {
  if (crumbs.length === 0) return null;
  return (
    <nav className={styles.bar} aria-label="Хлебные крошки">
      <div className={styles.inner}>
        {crumbs.map((c, i) => (
          <span key={c.label} className={styles.item}>
            {c.href ? (
              <Link href={c.href} className={styles.link}>
                {c.label}
              </Link>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
            {i < crumbs.length - 1 && (
              <span className={styles.sep} aria-hidden="true">
                /
              </span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
