import clsx from "clsx";
import styles from "./AmbientBackdrop.module.scss";

// Cross-faded, heavily-blurred photo wash behind dark/media sections (ADR-011).
// Stacks every image and fades in the active one, so the section breathes the
// mood of whatever is in focus (active yacht photo / service / gallery shot).
// Purely decorative — always aria-hidden, never interactive.

type Props = {
  images: readonly string[];
  activeIndex: number;
  className?: string;
};

export function AmbientBackdrop({ images, activeIndex, className }: Props) {
  return (
    <div className={clsx(styles.root, className)} aria-hidden="true">
      {images.map((src, i) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={`${src}-${i}`}
          src={src}
          alt=""
          className={i === activeIndex ? styles.imgActive : styles.img}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      ))}
      <div className={styles.overlay} />
    </div>
  );
}
