"use client";

import { Link } from "@/i18n/navigation";
import { YACHTS } from "@/shared/content/yachts";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { PHOTOS_BY_YACHT, type YachtSlug } from "@/widgets/landing/_data/photos";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FleetCard } from "./FleetCard";
import styles from "./FleetCatalog.module.scss";

// The stacked cards + a mobile «quick-book» bar that sticks under the header and
// mirrors whichever card is currently in view (name · price · Подробнее ·
// Забронировать). The active card is found by a scroll probe just below the
// header, so the bar's info swaps as you scroll past each yacht.
export function FleetList() {
  const { open } = usePanel();
  const [activeIdx, setActiveIdx] = useState(0);
  const [docked, setDocked] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const headerH =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--landing-header-h"),
        ) || 56;
      const probe = headerH + 64; // a line just below the header + the docked bar
      // The bar docks under the header only while the card list spans that line —
      // hidden over the hero (list still below) and once scrolled past (footer).
      const listRect = list.getBoundingClientRect();
      const show = listRect.top <= probe && listRect.bottom > probe + 48;
      setDocked((v) => (v === show ? v : show));

      const cards = Array.from(list.children) as HTMLElement[];
      let best = 0;
      for (let i = 0; i < cards.length; i++) {
        const r = cards[i].getBoundingClientRect();
        if (r.top > probe) break; // this card (and the rest) are still below the probe
        best = i; // last card whose top has passed the probe = the one in view
      }
      setActiveIdx((prev) => (prev === best ? prev : best));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const active = YACHTS[activeIdx];

  return (
    <>
      <div className={clsx(styles.stickyBar, docked && styles.stickyBarDocked)}>
        <div key={active.slug} className={styles.stickyInfo}>
          <span className={styles.stickyName}>{active.name}</span>
          <span className={styles.stickyPrice}>от {active.pricePerHour} BYN/ч</span>
        </div>
        <div className={styles.stickyActions}>
          <Link href={`/fleet/${active.slug}`} className={styles.stickyDetail}>
            Подробнее
          </Link>
          <button
            type="button"
            className={styles.stickyBook}
            onClick={() => open("order", { yacht: active.slug })}
          >
            Забронировать
          </button>
        </div>
      </div>

      <div className={styles.list} ref={listRef}>
        {YACHTS.map((yacht, i) => (
          <FleetCard
            key={yacht.slug}
            yacht={yacht}
            photos={PHOTOS_BY_YACHT[yacht.slug as YachtSlug] ?? []}
            reverse={i % 2 === 1}
            eager={i === 0}
          />
        ))}
      </div>
    </>
  );
}
