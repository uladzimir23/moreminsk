"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import styles from "./AmbientBackdrop.module.scss";

// Cross-faded, heavily-blurred photo wash behind media sections (ADR-011).
// Renders only a 2-frame window — the active image plus the one fading out —
// instead of stacking EVERY image. Holding all blurred bitmaps decoded at once
// pushed memory-pressured machines (many tabs) to evict + re-decode them on
// scroll-back ("photos reload every time"). Purely decorative; aria-hidden.

type Props = {
  images: readonly string[];
  activeIndex: number;
  className?: string;
};

export function AmbientBackdrop({ images, activeIndex, className }: Props) {
  // The image fading OUT during a crossfade; collapses back to active when settled.
  const [prevIndex, setPrevIndex] = useState(activeIndex);

  useEffect(() => {
    if (prevIndex === activeIndex) return;
    const t = setTimeout(() => setPrevIndex(activeIndex), 850); // ~ .img opacity fade
    return () => clearTimeout(t);
  }, [activeIndex, prevIndex]);

  const window = prevIndex === activeIndex ? [activeIndex] : [prevIndex, activeIndex];

  return (
    <div className={clsx(styles.root, className)} aria-hidden="true">
      {window.map((i) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={images[i]}
          src={images[i]}
          alt=""
          className={i === activeIndex ? styles.imgActive : styles.img}
          loading="lazy"
          decoding="async"
        />
      ))}
      <div className={styles.overlay} />
    </div>
  );
}
