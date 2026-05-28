"use client";

import { Tooltip } from "@/shared/ui/tooltip/Tooltip";
import clsx from "clsx";
import styles from "./social-link.module.scss";

// Social icon — same monochrome glyph (currentColor) in both states; on
// hover/focus the colour shifts to the platform's brand colour (--brand). No
// shape change.
type Platform = "telegram" | "instagram";

const DATA: Record<
  Platform,
  { href: string; label: string; brand: string; icon: React.ReactNode }
> = {
  telegram: {
    href: "https://t.me/moreminsk",
    label: "Telegram",
    brand: "#34AADF",
    icon: (
      <svg viewBox="0 0 50 43" fill="currentColor" aria-hidden="true">
        <path d="M3.06541 18.7224C3.06541 18.7224 25.1792 9.2852 32.8486 5.96214C35.7887 4.63303 45.759 0.379493 45.759 0.379493C45.759 0.379493 50.3608 -1.48127 49.9773 3.03791C49.8494 4.89885 48.8268 11.4118 47.8043 18.4566C46.2703 28.4256 44.6086 39.3248 44.6086 39.3248C44.6086 39.3248 44.353 42.3821 42.18 42.9137C40.007 43.4454 36.4277 41.053 35.7887 40.5211C35.2773 40.1225 26.2018 34.141 22.8783 31.2168C21.9835 30.4193 20.961 28.8244 23.0061 26.9634C27.6078 22.5771 33.1043 17.1274 36.4277 13.6716C37.9617 12.0764 39.4955 8.35473 33.1043 12.8739C24.0288 19.387 15.081 25.5013 15.081 25.5013C15.081 25.5013 13.0357 26.8304 9.20102 25.6341C5.36614 24.438 0.892247 22.8429 0.892247 22.8429C0.892247 22.8429 -2.17538 20.8491 3.06541 18.7224Z" />
      </svg>
    ),
  },
  instagram: {
    href: "https://instagram.com/moreminsk.by",
    label: "Instagram",
    brand: "#E1306C",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
};

export function SocialLink({ platform, className }: { platform: Platform; className?: string }) {
  const d = DATA[platform];
  return (
    <Tooltip content={d.label}>
      <a
        className={clsx(styles.link, className)}
        style={{ "--brand": d.brand } as React.CSSProperties}
        href={d.href}
        target="_blank"
        rel="noreferrer"
        aria-label={d.label}
      >
        <span className={styles.icon}>{d.icon}</span>
      </a>
    </Tooltip>
  );
}
