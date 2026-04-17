import clsx from "clsx";
import styles from "./SectionHeader.module.scss";

// Standard section eyebrow + title + optional subtitle (Hero & Section Rhythm doc).
// Passed a heading level via `as` prop so each page keeps a valid h1→h2→h3 outline.

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  as: Heading = "h2",
  id,
  className,
}: Props) {
  return (
    <header className={clsx(styles.root, align === "center" && styles.center, className)}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <Heading id={id} className={styles.title}>
        {title}
      </Heading>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
