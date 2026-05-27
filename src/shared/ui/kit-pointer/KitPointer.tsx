"use client";

import { useEffect } from "react";

// Site-wide pointer tracking for the «Signature» CTAs (btn-cta mixin). Those
// buttons mark themselves with `--is-cta: 1`; this single delegated listener
// finds the hovered one and feeds it the vars the CSS reads: --mx/--my (edge
// spotlight) and --rx/--ry (3D tilt toward the pointer). One listener for the
// whole site — sections don't need any per-button wiring.

const TILT_MAX = 8; // deg at the button's edge

function isCta(el: HTMLElement): boolean {
  return getComputedStyle(el).getPropertyValue("--is-cta").trim() === "1";
}

export function KitPointer() {
  useEffect(() => {
    let raf = 0;
    let pending: MouseEvent | null = null;

    const apply = () => {
      raf = 0;
      const e = pending;
      pending = null;
      if (!e) return;
      const el = (e.target as Element | null)?.closest?.("a,button") as HTMLElement | null;
      if (!el || !isCta(el)) return;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      el.style.setProperty("--ry", `${(x / r.width - 0.5) * 2 * TILT_MAX}deg`);
      el.style.setProperty("--rx", `${-(y / r.height - 0.5) * 2 * TILT_MAX}deg`);
    };

    const onMove = (e: MouseEvent) => {
      pending = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    // Reset the tilt when leaving a CTA so it doesn't flash stale on re-entry.
    const onOut = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("a,button") as HTMLElement | null;
      if (el && isCta(el)) {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      }
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseout", onOut);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
