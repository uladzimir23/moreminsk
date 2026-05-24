import clsx from "clsx";
import styles from "./Logo.module.scss";

// Brand lockup for «Минское море» — a geometric two-sail sloop mark (sky
// accent) + wordmark where «море» carries the editorial Lora-italic accent
// used across section titles. Mark colour = --color-accent; wordmark inherits
// currentColor so it reads white over the hero and dark on light surfaces.

type Props = {
  /** Hide the wordmark (mark only) — used in tight spots. */
  markOnly?: boolean;
  className?: string;
};

export function Logo({ markOnly = false, className }: Props) {
  return (
    <span className={clsx(styles.root, className)}>
      <svg
        className={styles.mark}
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        {/* mainsail */}
        <path d="M13 3 L13 19 L4 19 Z" fill="currentColor" />
        {/* jib */}
        <path d="M15 8 L15 19 L22.5 19 Z" fill="currentColor" opacity="0.55" />
        {/* waterline */}
        <path
          d="M2 23.5 q5 2.4 10 0 t10 0 t10 0"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      {!markOnly && (
        <span className={styles.word}>
          Минское&nbsp;<span className={styles.accent}>море</span>
        </span>
      )}
    </span>
  );
}
