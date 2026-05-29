"use client";

import { Link } from "@/i18n/navigation";
import { createPortal } from "react-dom";
import styles from "./StickyCrumbs.module.scss";

type Crumb = { label: string; href?: string };

// Thin breadcrumb bar fixed under the header on every inner page (not home).
// Portaled to <body> so its fixed positioning isn't trapped inside PageShell's
// .heroPin stacking context (which would let the page content paint over it).
// Height is exposed as --crumbs-bar-h so hosts can offset their top spacing.
export function StickyCrumbs({ crumbs }: { crumbs: ReadonlyArray<Crumb> }) {
  const target = typeof window === "undefined" ? null : document.body;
  if (crumbs.length === 0 || !target) return null;

  return createPortal(
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
    </nav>,
    target,
  );
}
