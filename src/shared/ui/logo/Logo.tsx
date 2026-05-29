import clsx from "clsx";
import styles from "./Logo.module.scss";

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
        <svg
          className={styles.mark}
          viewBox="0 0 204 178"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M102 0C122.264 50.7705 125 86 104.5 131.5C136.5 128.5 152 134 189.5 158C184.356 75.5767 173.997 38.4837 102 0Z"
            fill="var(--logo-ink, currentColor)"
          />
          <path
            d="M100.5 14C90.3569 64.6305 68.567 119.035 28 158.5C60.1184 144.352 69.9999 139.5 96.5 132C116 94 114.274 50.7681 100.5 14Z"
            fill="#ff2400"
          />
          <path
            d="M100 140.631C69.3245 146.131 69.0808 152.534 0 177.131C72.8409 174.537 73.572 159.56 108.5 157.5C143.428 155.44 153.676 177.131 203.5 177.131C151.5 142.631 130.676 135.131 100 140.631Z"
            fill="var(--logo-ink, currentColor)"
          />
          <path
            d="M100.088 141.123C115.351 138.386 128.138 138.885 143.587 144.353C158.785 149.731 176.57 159.923 201.823 176.621C177.998 176.384 163.427 171.116 150.597 166.078C137.45 160.917 126.059 155.964 108.471 157.001C90.9264 158.036 81.9276 162.326 68.3164 166.639C55.1218 170.819 37.4684 175.07 3.23633 176.505C35.7617 164.833 52.4441 157.382 64.5986 152.18C77.1098 146.825 84.8012 143.864 100.088 141.123ZM102.969 1.08887C138.171 20.08 158.341 38.759 170.373 62.7471C182.458 86.8392 186.365 116.343 188.938 157.05C170.621 145.36 157.532 138.11 145.089 134.148C132.665 130.193 120.917 129.522 105.302 130.925C115.329 108.436 119.686 88.403 119.036 67.7109C118.39 47.1384 112.797 25.9493 102.969 1.08887ZM100.639 15.8223C113.791 52.0659 115.181 94.3423 96.1523 131.578C70.4695 138.857 60.3626 143.672 30.2939 156.939C69.2574 118.001 90.5041 65.2033 100.639 15.8223Z"
            stroke="var(--logo-stroke, transparent)"
            fill="none"
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
