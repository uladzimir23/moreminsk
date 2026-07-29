"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./StickyCrumbs.module.scss";

type Crumb = { label: string; href?: string };

// Thin breadcrumb bar fixed under the header on every inner page (not home).
// Portaled to <body> so its fixed positioning isn't trapped inside PageShell's
// .heroPin stacking context (which would let the page content paint over it).
// Height is exposed as --crumbs-bar-h so hosts can offset their top spacing.
// Gated on a mount flag: SSR + first client render return null (matching markup),
// then the portal mounts — avoids a hydration mismatch from server null vs portal.
export function StickyCrumbs({ crumbs }: { crumbs: ReadonlyArray<Crumb> }) {
  const [mounted, setMounted] = useState(false);
  // One-time mount flag so the portal renders only on the client (SSR-safe).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (crumbs.length === 0 || !mounted) return null;

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
    document.body,
  );
}
