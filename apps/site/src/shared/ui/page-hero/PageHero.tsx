import { StickyCrumbs } from "@/shared/ui/sticky-crumbs/StickyCrumbs";
import clsx from "clsx";
import type { ReactNode } from "react";
import styles from "./PageHero.module.scss";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow?: string;
  title: ReactNode;
  /** Lora-italic accent word appended to the title. */
  accent?: string;
  lead?: ReactNode;
  crumbs?: ReadonlyArray<Crumb>;
  /** Blurred background photo (page-relevant). */
  image?: string;
  align?: "left" | "center";
  titleId?: string;
  /** Optional extra below the lead (e.g. specs / a CTA). */
  children?: ReactNode;
};

// Full-height hero at the top of a dedicated page: breadcrumbs → eyebrow →
// title (Lora accent) → lead → scroll cue, over a blurred page-relevant photo
// with a theme-aware wash.
export function PageHero({
  eyebrow,
  title,
  accent,
  lead,
  crumbs,
  image,
  align = "left",
  titleId,
  children,
}: Props) {
  return (
    <>
      {crumbs && crumbs.length > 0 && <StickyCrumbs crumbs={crumbs} />}
      <section className={clsx(styles.hero, align === "center" && styles.center)}>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.bg} src={image} alt="" aria-hidden="true" decoding="async" />
        )}
        <span className={styles.wash} aria-hidden="true" />

        <div className={styles.inner}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 id={titleId} className={styles.title}>
            {title}
            {accent && <span className={styles.accent}> {accent}</span>}
          </h1>
          {lead && <p className={styles.lead}>{lead}</p>}
          {children && <div className={styles.extra}>{children}</div>}
        </div>

        <span className={styles.scrollCue} aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </section>
    </>
  );
}
