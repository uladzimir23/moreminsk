import clsx from "clsx";
import styles from "./SectionHeader.module.scss";

// Standard section eyebrow + title + optional subtitle (Hero & Section Rhythm doc).
// Passed a heading level via `as` prop so each page keeps a valid h1→h2→h3 outline.
//
// tone: "surface" (default, light canvas) | "media" (theme-aware paper, flips
//   light/dark) | "image" (sits over a photo/video, stays white in both themes).
// accent: a Lora-italic accent word appended to the title (editorial signature).
// framed: wrap in the shared section gutter (max 1440 + --section-gutter) so the
//   header aligns identically across full-bleed landing sections.

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  accent?: string;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  tone?: "surface" | "media" | "image";
  framed?: boolean;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  accent,
  subtitle,
  align = "left",
  tone = "surface",
  framed = false,
  as: Heading = "h2",
  id,
  className,
}: Props) {
  return (
    <header
      className={clsx(
        styles.root,
        align === "center" && styles.center,
        framed && styles.framed,
        className,
      )}
      data-tone={tone}
    >
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <Heading id={id} className={styles.title}>
        {title}
        {accent && <span className={styles.accent}> {accent}</span>}
      </Heading>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
