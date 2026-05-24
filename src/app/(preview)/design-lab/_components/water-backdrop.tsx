"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./water-backdrop.module.scss";

let RIPPLE_SEQ = 0;

type Ripple = { id: number; x: number; y: number };

// Sits absolutely behind a dark section's content. Fine pointer → caustic
// follows the cursor + clicks ripple; coarse/touch → it drifts by itself.
export function WaterBackdrop({ filterId = "waterRipple" }: { filterId?: string }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const root = rootRef.current;
    if (!root) return;
    // Switch the glow from its default auto-drift to cursor-follow without
    // a state update (avoids a synchronous setState in this effect).
    glowRef.current?.classList.remove(styles.glowAuto);

    let raf = 0;
    let px = 0;
    let py = 0;
    let queued = false;

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(() => {
        queued = false;
        const rect = root.getBoundingClientRect();
        // Only react while the pointer is over (or near) the section.
        if (py < rect.top - 200 || py > rect.bottom + 200) return;
        root.style.setProperty("--mx", `${px - rect.left}px`);
        root.style.setProperty("--my", `${py - rect.top}px`);
      });
    };

    const onClick = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      const id = ++RIPPLE_SEQ;
      setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onClick, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onClick);
    };
  }, []);

  return (
    <div className={styles.root} ref={rootRef} aria-hidden="true">
      <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.018"
              numOctaves="2"
              seed="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="26s"
                values="0.012 0.018; 0.016 0.012; 0.012 0.018"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <pattern id={`${filterId}-grid`} width="46" height="46" patternUnits="userSpaceOnUse">
            <path className={styles.grid} d="M46 0 H0 V46" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#${filterId}-grid)`}
          filter={`url(#${filterId})`}
        />
      </svg>

      <div className={`${styles.glow} ${styles.glowAuto}`} ref={glowRef} />

      {ripples.map((r) => (
        <span
          key={r.id}
          className={styles.ripple}
          style={{ left: r.x, top: r.y }}
          onAnimationEnd={() => setRipples((list) => list.filter((x) => x.id !== r.id))}
        />
      ))}
    </div>
  );
}
