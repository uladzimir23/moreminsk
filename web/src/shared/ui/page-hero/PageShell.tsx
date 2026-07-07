import type { ReactNode } from "react";
import styles from "./PageShell.module.scss";

type Props = {
  hero: ReactNode;
  children: ReactNode;
};

// Page layout that mirrors the home page: the hero is pinned (sticky) for one
// viewport, and the content container slides up from below over it (higher
// z-index + opaque background). Wrap every dedicated page's content in this.
export function PageShell({ hero, children }: Props) {
  return (
    <div className={styles.shell}>
      <div className={styles.heroPin}>{hero}</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
