"use client";

import { useEffect, useRef, useState } from "react";
import { PHOTOS_BY_YACHT } from "../_data/photos";
import styles from "./water-backdrop.module.scss";

let RIPPLE_SEQ = 0;
type Ripple = { id: number; x: number; y: number };

type WaterBackdropProps = {
  filterId?: string;
  // "caustics" — procedural sunlit-water highlights. "waves" — layered
  // drifting sine waves (filled sea layers). "photo" — ripple a real
  // water photo. All react to the cursor on desktop, drift on touch.
  variant?: "caustics" | "waves" | "photo";
  image?: string;
};

// A horizontal sine as an SVG path, optionally closed to the bottom to fill.
function wavePath(y: number, amp: number, seg = 180, width = 2400, bottom = 600): string {
  const n = Math.ceil(width / seg) + 6;
  let d = `M${-seg * 2} ${y} q ${seg / 2} ${-amp} ${seg} 0`;
  for (let i = 0; i < n; i += 1) d += ` t ${seg} 0`;
  d += ` L${width + seg * 2} ${bottom} L${-seg * 2} ${bottom} Z`;
  return d;
}

const WAVE_LAYERS = [
  { d: wavePath(120, 26), cls: "wave1" },
  { d: wavePath(190, 30), cls: "wave2" },
  { d: wavePath(270, 34), cls: "wave3" },
  { d: wavePath(360, 40), cls: "wave4" },
];

export function WaterBackdrop({
  filterId = "waterRipple",
  variant = "caustics",
  image = PHOTOS_BY_YACHT.eva[0],
}: WaterBackdropProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const lightRef = useRef<SVGFEPointLightElement | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;

    // ── Caustics: drive the fePointLight position ────────────────────────
    if (variant === "caustics") {
      const light = lightRef.current;
      if (!light) return;
      const setLight = (x: number, y: number) => {
        light.setAttribute("x", String(x));
        light.setAttribute("y", String(y));
      };
      const rect0 = root.getBoundingClientRect();
      setLight(rect0.width * 0.5, rect0.height * 0.4);

      if (reduce) return;

      if (fine) {
        let qx = 0;
        let qy = 0;
        let queued = false;
        const onMove = (e: PointerEvent) => {
          qx = e.clientX;
          qy = e.clientY;
          if (queued) return;
          queued = true;
          raf = requestAnimationFrame(() => {
            queued = false;
            const rect = root.getBoundingClientRect();
            if (qy < rect.top - 240 || qy > rect.bottom + 240) return;
            setLight(qx - rect.left, qy - rect.top);
          });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("pointermove", onMove);
        };
      }

      // Touch: drift the light on a slow Lissajous path.
      let t = 0;
      const tick = () => {
        t += 0.006;
        const rect = root.getBoundingClientRect();
        setLight(
          rect.width * (0.5 + 0.32 * Math.sin(t)),
          rect.height * (0.42 + 0.26 * Math.sin(t * 1.3 + 1)),
        );
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }

    // ── Photo / waves: caustic glow follows cursor (photo also ripples) ──
    if (!fine || reduce) return;
    glowRef.current?.classList.remove(styles.glowAuto);

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
        if (py < rect.top - 200 || py > rect.bottom + 200) return;
        root.style.setProperty("--mx", `${px - rect.left}px`);
        root.style.setProperty("--my", `${py - rect.top}px`);
      });
    };
    const onDown = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      setRipples((r) => [
        ...r,
        { id: ++RIPPLE_SEQ, x: e.clientX - rect.left, y: e.clientY - rect.top },
      ]);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    if (variant === "photo") window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [variant]);

  if (variant === "caustics") {
    return (
      <div className={styles.root} ref={rootRef} aria-hidden="true">
        <svg className={styles.svgCaustics} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.012 0.02"
                numOctaves="3"
                seed="6"
                result="noise"
              >
                <animate
                  attributeName="baseFrequency"
                  dur="24s"
                  values="0.012 0.02; 0.018 0.014; 0.012 0.02"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feSpecularLighting
                in="noise"
                surfaceScale="5"
                specularConstant="1.1"
                specularExponent="22"
                lightingColor="#7fd2ff"
                result="spec"
              >
                <fePointLight ref={lightRef} x="400" y="300" z="80" />
              </feSpecularLighting>
              <feComposite in="spec" in2="spec" operator="arithmetic" k1="0" k2="1" k3="0" k4="0" />
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="#06223a" />
          <rect width="100%" height="100%" filter={`url(#${filterId})`} />
        </svg>
        <div className={styles.shade} />
      </div>
    );
  }

  if (variant === "waves") {
    return (
      <div className={styles.root} ref={rootRef} aria-hidden="true">
        <svg
          className={styles.svgWaves}
          viewBox="0 0 2400 620"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {WAVE_LAYERS.map((w) => (
            <g key={w.cls} className={styles[w.cls]}>
              <path d={w.d} />
            </g>
          ))}
        </svg>
        <div className={styles.shade} />
        <div className={`${styles.glow} ${styles.glowAuto}`} ref={glowRef} />
      </div>
    );
  }

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
        </defs>
        <image
          href={image}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          filter={`url(#${filterId})`}
        />
      </svg>
      <div className={styles.shade} />
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
