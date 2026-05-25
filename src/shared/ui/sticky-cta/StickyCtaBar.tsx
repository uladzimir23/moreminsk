"use client";

import clsx from "clsx";
import { useState } from "react";
import styles from "./StickyCtaBar.module.scss";
import type { StickyCtaConfig, StickyCtaIcon } from "./StickyCtaContext";

function CtaIcon({ name }: { name: StickyCtaIcon }) {
  if (name === "gallery") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "check") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// The single fixed bar driven by StickyCtaProvider. It keeps the last config
// while sliding out, so the label never blanks mid-transition.
export function StickyCtaBar({ config }: { config: StickyCtaConfig | undefined }) {
  // Keep the last config while sliding out so the label never blanks. This is
  // React's "adjust state during render" pattern (config identity only changes
  // when the descriptor really changes), cheaper than an effect + no cascade.
  const [shown, setShown] = useState<StickyCtaConfig | null>(config ?? null);
  if (config && config !== shown) setShown(config);

  const visible = !!config;
  if (!shown) return null;

  return (
    <div className={clsx(styles.bar, visible && styles.visible)}>
      <button
        type="button"
        className={styles.btn}
        onClick={shown.onClick}
        disabled={shown.disabled || !visible}
        tabIndex={visible ? 0 : -1}
        aria-hidden={!visible}
      >
        <span className={styles.label}>{shown.label}</span>
        {shown.note && <span className={styles.note}>{shown.note}</span>}
        <span className={styles.icon}>
          <CtaIcon name={shown.icon ?? "arrow"} />
        </span>
      </button>
    </div>
  );
}
