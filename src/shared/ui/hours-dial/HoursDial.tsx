"use client";

import { useRef } from "react";
import styles from "./HoursDial.module.scss";

// 270° dial, 0° at top, clockwise; the bottom 90° is the gap.
const MIN_A = -135;
const MAX_A = 135;
const SPOKES = [0, 45, 90, 135, 180, 225, 270, 315];

const polar = (deg: number, r: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: 100 + r * Math.sin(rad), y: 100 - r * Math.cos(rad) };
};

const arcPath = (a1: number, a2: number, r: number) => {
  const p1 = polar(a1, r);
  const p2 = polar(a2, r);
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
};

type Props = {
  value: number;
  onChange: (hours: number) => void;
  min?: number;
  max?: number;
  unit?: string;
  ariaLabel?: string;
};

// Ship's-wheel hours dial — turn the helm (drag / arrows) to set hours; the
// wheel rotates, an accent arc fills, the centre shows the count. A circular
// slider under the hood (role=slider, keyboard-accessible).
export function HoursDial({
  value,
  onChange,
  min = 1,
  max = 8,
  unit = "ч",
  ariaLabel = "Длительность, часов",
}: Props) {
  const ref = useRef<SVGSVGElement | null>(null);
  const clamped = Math.max(min, Math.min(max, value));
  const frac = (clamped - min) / (max - min);
  const angle = MIN_A + frac * (MAX_A - MIN_A);

  const setFromPointer = (clientX: number, clientY: number) => {
    const svg = ref.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let deg = (Math.atan2(clientX - cx, cy - clientY) * 180) / Math.PI; // 0=top, cw
    deg = Math.max(MIN_A, Math.min(MAX_A, deg));
    const f = (deg - MIN_A) / (MAX_A - MIN_A);
    onChange(Math.round(min + f * (max - min)));
  };

  return (
    <div className={styles.root}>
      <svg
        ref={ref}
        viewBox="0 0 200 200"
        className={styles.dial}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-valuetext={`${clamped} ${unit}`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromPointer(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) setFromPointer(e.clientX, e.clientY);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowRight") {
            e.preventDefault();
            onChange(Math.min(max, clamped + 1));
          } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
            e.preventDefault();
            onChange(Math.max(min, clamped - 1));
          }
        }}
      >
        <path d={arcPath(MIN_A, MAX_A, 92)} className={styles.track} />
        <path d={arcPath(MIN_A, angle, 92)} className={styles.progress} />

        {/* Helm — rotates with the value (transform set inline). */}
        <g className={styles.helm} style={{ transform: `rotate(${angle.toFixed(2)}deg)` }}>
          <circle cx="100" cy="100" r="70" className={styles.rim} />
          {SPOKES.map((a) => {
            const inner = polar(a, 18);
            const outer = polar(a, 70);
            const gripA = polar(a, 60);
            const gripB = polar(a, 86);
            return (
              <g key={a}>
                <line
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  className={styles.spoke}
                />
                <line x1={gripA.x} y1={gripA.y} x2={gripB.x} y2={gripB.y} className={styles.grip} />
              </g>
            );
          })}
          <circle cx="100" cy="100" r="18" className={styles.hub} />
          {/* Accent handle — the one grip you grab; makes the spin readable on
              the otherwise-symmetric helm and marks the current position. */}
          <circle cx={polar(0, 86).x} cy={polar(0, 86).y} r="8" className={styles.handle} />
        </g>

        {/* Fixed top notch — the reference the helm turns against. */}
        <path d="M100 4 l5 9 h-10 Z" className={styles.notch} />

        {/* Upright readout. */}
        <text x="100" y="98" textAnchor="middle" className={styles.num}>
          {clamped}
        </text>
        <text x="100" y="120" textAnchor="middle" className={styles.unit}>
          {unit}
        </text>
      </svg>
    </div>
  );
}
