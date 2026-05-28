"use client";

import { withBase } from "@/shared/lib/base-path";
import { Tooltip } from "@/shared/ui/tooltip/Tooltip";
import clsx from "clsx";
import styles from "./social-link.module.scss";

// Social icon: monochrome glyph (currentColor — rides the header/menu fg) at
// rest, cross-fading to the real brand logo on hover/focus. Brand SVGs live in
// public/social/ (Telegram blue disc, Instagram gradient).
type Platform = "telegram" | "instagram";

const DATA: Record<
  Platform,
  { href: string; label: string; brand: string; mono: React.ReactNode }
> = {
  telegram: {
    href: "https://t.me/moreminsk",
    label: "Telegram",
    brand: "/social/telegram.svg",
    mono: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.5 4.3 18.6 19c-.2 1-.8 1.2-1.6.7l-4.4-3.2-2.1 2c-.2.2-.4.4-.9.4l.3-4.5 8.2-7.4c.36-.3-.08-.5-.55-.2l-10.1 6.4-4.4-1.4c-.95-.3-.97-.95.2-1.4L20 3c.8-.3 1.5.2 1.5 1.3z" />
      </svg>
    ),
  },
  instagram: {
    href: "https://instagram.com/moreminsk.by",
    label: "Instagram",
    brand: "/social/instagram.svg",
    mono: (
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
        href={d.href}
        target="_blank"
        rel="noreferrer"
        aria-label={d.label}
      >
        <span className={styles.mono} aria-hidden="true">
          {d.mono}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.brand} src={withBase(d.brand)} alt="" aria-hidden="true" />
      </a>
    </Tooltip>
  );
}
