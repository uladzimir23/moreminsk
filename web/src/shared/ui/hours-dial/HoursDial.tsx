"use client";

import clsx from "clsx";
import { useRef } from "react";
import styles from "./HoursDial.module.scss";

// 270° dial, 0° at top, clockwise; the bottom 90° is the gap.
const MIN_A = -135;
const MAX_A = 135;
const SPOKES = [0, 45, 90, 135, 180, 225, 270, 315];
const BOLTS = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];

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
  onChange?: (hours: number) => void;
  min?: number;
  max?: number;
  unit?: string;
  ariaLabel?: string;
  /** false = a purely decorative spinning helm (no input, no readout). */
  interactive?: boolean;
  className?: string;
};

// Ship's-wheel hours dial. Interactive: a circular slider (drag / arrows).
// Decorative: just the helm, spinning to mirror the current value — meant to
// sit behind a card and turn as the duration changes.
export function HoursDial({
  value,
  onChange,
  min = 1,
  max = 8,
  unit = "ч",
  ariaLabel = "Длительность, часов",
  interactive = true,
  className,
}: Props) {
  const ref = useRef<SVGSVGElement | null>(null);
  const clamped = Math.max(min, Math.min(max, value));
  const frac = (clamped - min) / (max - min);
  const angle = MIN_A + frac * (MAX_A - MIN_A);

  const setFromPointer = (clientX: number, clientY: number) => {
    const svg = ref.current;
    if (!svg || !onChange) return;
    const r = svg.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let deg = (Math.atan2(clientX - cx, cy - clientY) * 180) / Math.PI; // 0=top, cw
    deg = Math.max(MIN_A, Math.min(MAX_A, deg));
    const f = (deg - MIN_A) / (MAX_A - MIN_A);
    onChange(Math.round(min + f * (max - min)));
  };

  const interactiveProps = interactive
    ? {
        role: "slider" as const,
        tabIndex: 0,
        "aria-label": ariaLabel,
        "aria-valuemin": min,
        "aria-valuemax": max,
        "aria-valuenow": clamped,
        "aria-valuetext": `${clamped} ${unit}`,
        onPointerDown: (e: React.PointerEvent<SVGSVGElement>) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromPointer(e.clientX, e.clientY);
        },
        onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => {
          if (e.buttons === 1) setFromPointer(e.clientX, e.clientY);
        },
        onKeyDown: (e: React.KeyboardEvent) => {
          if (!onChange) return;
          if (e.key === "ArrowUp" || e.key === "ArrowRight") {
            e.preventDefault();
            onChange(Math.min(max, clamped + 1));
          } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
            e.preventDefault();
            onChange(Math.max(min, clamped - 1));
          }
        },
      }
    : { "aria-hidden": true as const };

  return (
    <div className={clsx(styles.root, !interactive && styles.decorative, className)}>
      <svg ref={ref} viewBox="0 0 200 200" className={styles.dial} {...interactiveProps}>
        {interactive && (
          <>
            <path d={arcPath(MIN_A, MAX_A, 92)} className={styles.track} />
            <path d={arcPath(MIN_A, angle, 92)} className={styles.progress} />
          </>
        )}

        {/* Helm — rotates with the value. A real ship's wheel: a banded wooden
            rim, turned-baluster handles past the rim, brass hub with a bolt ring. */}
        <g className={styles.helm} style={{ transform: `rotate(${angle.toFixed(2)}deg)` }}>
          {/* Rim band + its two edges. */}
          <circle cx="100" cy="100" r="66" className={styles.rim} />
          <circle cx="100" cy="100" r="72" className={styles.rimEdge} />
          <circle cx="100" cy="100" r="60" className={styles.rimEdge} />

          {SPOKES.map((a) => {
            const inner = polar(a, 22);
            const rim = polar(a, 60);
            const stemEnd = polar(a, 83);
            const collar = polar(a, 70);
            const knob = polar(a, 90);
            return (
              <g key={a}>
                {/* inner spoke hub → rim */}
                <line x1={inner.x} y1={inner.y} x2={rim.x} y2={rim.y} className={styles.spoke} />
                {/* turned handle past the rim: stem + collar bead + end knob */}
                <line x1={rim.x} y1={rim.y} x2={stemEnd.x} y2={stemEnd.y} className={styles.grip} />
                <circle cx={collar.x} cy={collar.y} r="4" className={styles.collar} />
                <circle cx={knob.x} cy={knob.y} r="7" className={styles.knob} />
              </g>
            );
          })}

          {/* Brass hub: disc + ring of bolt heads + centre bolt. */}
          <circle cx="100" cy="100" r="23" className={styles.hub} />
          {BOLTS.map((a) => {
            const b = polar(a, 15);
            return <circle key={a} cx={b.x} cy={b.y} r="2.4" className={styles.bolt} />;
          })}
          <circle cx="100" cy="100" r="4.5" className={styles.hubCenter} />
        </g>

        {interactive && (
          <>
            <path d="M100 4 l5 9 h-10 Z" className={styles.notch} />
            <text x="100" y="98" textAnchor="middle" className={styles.num}>
              {clamped}
            </text>
            <text x="100" y="120" textAnchor="middle" className={styles.unit}>
              {unit}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
