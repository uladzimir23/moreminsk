import clsx from "clsx";
import styles from "./Logo.module.scss";

// Brand lockup for «Море Минск» — a geometric two-sail sloop: the bigger sail
// scarlet («алые паруса»), the other + the waterline in currentColor (header fg
// — white over the hero, dark when frosted). The wordmark stacks «море» over
// «минск» in plain text colour (no accent).

type Props = {
  /** Hide the wordmark (mark only) — used in tight spots. */
  markOnly?: boolean;
  className?: string;
};

export function Logo({ markOnly = false, className }: Props) {
  return (
    <span className={clsx(styles.root, className)}>
      <span className={styles.markWrap}>
        <span className={styles.ripple} aria-hidden="true" />
        <svg
          className={styles.mark}
          viewBox="0 0 28 28"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          {/* Two sails flanking a central mast, like the client's logo: a
              neutral sail leaning left + the bigger sail (right) in scarlet. */}
          <path d="M12.7 4 L6 18.5 L12.7 18.5 Z" fill="currentColor" />
          <path d="M13.3 2.5 L13.3 18.5 L21 18.5 Z" fill="#e51f2c" />
          {/* waterline — extends past the 0–28 viewBox (clipped by the svg) so
              it can drift left one full wave period in a seamless loop */}
          <path
            className={styles.waterline}
            d="M-8 21 q5 2.4 10 0 t10 0 t10 0 t10 0 t10 0 t10 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {!markOnly && (
        <span className={styles.word}>
          <span className={styles.wordMore}>море</span>{" "}
          <span className={styles.wordMinsk}>минск</span>
        </span>
      )}
    </span>
  );
}
