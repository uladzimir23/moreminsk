import clsx from "clsx";

// Lora italic wrapper (ADR-008). Per-page budget: max 5 instances, 2 per
// viewport. Allowed: yacht names, Hero accent word, eyebrow of key sections,
// «»-quotes in reviews. Forbidden in buttons, inputs, nav, prices.
//
// Markup is <em> by default — preserves emphasis semantics for screen readers.
// Use `as="span"` to suppress emphasis when the italic is purely decorative.
//
// Tailwind-free: relies on the global `.accent` utility class wired in
// `_typography.scss` (font-family + italic + tracking nudge).

type AccentProps = {
  children: React.ReactNode;
  as?: "em" | "span";
  /** Drop italic — uses upright Lora (rare, e.g. logotype). */
  upright?: boolean;
  /** Bump weight to 500 (subheadings, emphasis). */
  medium?: boolean;
  className?: string;
};

export function Accent({ children, as: Tag = "em", upright, medium, className }: AccentProps) {
  return (
    <Tag
      className={clsx(
        "accent",
        upright && "accent--upright",
        medium && "accent--medium",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
