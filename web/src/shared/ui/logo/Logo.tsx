import clsx from "clsx";
import styles from "./Logo.module.scss";
import { LogoMark } from "./LogoMark";

// Brand lockup for «Море Минск» — three sails over a stylised wave, exported
// from the Figma source. Two-tone via --logo-ink (white over the dark hero /
// dark theme, navy on the frosted/paper light theme) and --logo-stroke (only
// set on light backgrounds — adds the hand-drawn outline). Scarlet sail fixed.

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
        <LogoMark className={styles.mark} />
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
