"use client";

import { Link } from "@/i18n/navigation";
import { YACHTS } from "@/shared/content/yachts";
import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { YachtGallery } from "@/shared/ui/yacht-gallery/YachtGallery";
import { useEffect, useRef, useState } from "react";
import { PHOTOS_BY_YACHT, type YachtSlug } from "../../_data/photos";
import styles from "./fleet-showcase-section.module.scss";

const TYPE_LABEL = {
  sail: "Парусная",
  motor: "Моторная",
  "sail-motor": "Парусно-моторная",
} as const;

export function FleetShowcaseSection() {
  const [activeYachtIdx, setActiveYachtIdx] = useState(0);
  // Active photo index, fed up from <YachtGallery> via onActiveChange — drives
  // the ambient backdrop so the wash follows whatever photo is on screen.
  const [bgPhotoIdx, setBgPhotoIdx] = useState(0);
  const [tabsStuck, setTabsStuck] = useState(false);

  const activeYacht = YACHTS[activeYachtIdx];
  const photos = PHOTOS_BY_YACHT[activeYacht.slug as YachtSlug];

  // Detect when the mobile tab strip is pinned, so its backdrop only turns to
  // glass while stuck (transparent at rest). Compare the tabs' live viewport
  // position to their resolved sticky `top` (driven by --landing-header-h), so
  // it stays exact regardless of the actual header height.
  const tabsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    // Resolve the sticky `top` ONCE (and on resize) — reading getComputedStyle
    // on every scroll event forced a synchronous style recalc each time, which
    // janked scrolling across the whole page. The scroll path now only does a
    // single rAF-throttled getBoundingClientRect.
    let stickyTop = parseFloat(getComputedStyle(el).top) || 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      setTabsStuck(el.getBoundingClientRect().top <= stickyTop + 1);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    const onResize = () => {
      stickyTop = parseFloat(getComputedStyle(el).top) || 0;
      update();
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className={styles.section} id="fleet">
      {/* Ambient backdrop — same photos as the hero stack, heavily blurred
          and dimmed so the foreground reads white-on-dark. */}
      <AmbientBackdrop images={photos} activeIndex={bgPhotoIdx} />

      <div className={styles.head}>
        <SectionHeader
          eyebrow="01 · Флот"
          title="Четыре яхты — выбирайте"
          accent="настроение."
          tone="media"
        />
      </div>

      <div
        ref={tabsRef}
        className={`${styles.tabs} ${tabsStuck ? styles.tabsStuck : ""}`}
        role="tablist"
        aria-label="Выбор яхты"
      >
        {YACHTS.map((yacht, i) => (
          <button
            key={yacht.slug}
            role="tab"
            type="button"
            aria-selected={i === activeYachtIdx}
            className={i === activeYachtIdx ? styles.tabActive : styles.tab}
            onClick={() => {
              setActiveYachtIdx(i);
              setBgPhotoIdx(0);
            }}
          >
            {yacht.name}
            {yacht.badge === "flagship" && <span className={styles.tabBadge}>флагман</span>}
          </button>
        ))}
      </div>

      <div className={styles.body} key={activeYacht.slug}>
        <aside className={styles.info}>
          <p className={styles.specs}>
            {TYPE_LABEL[activeYacht.type]} · до {activeYacht.capacity} гостей
          </p>
          <h3 className={styles.yachtName}>{activeYacht.name}</h3>
          <p className={styles.desc}>{activeYacht.description}</p>

          <ul className={styles.features}>
            {activeYacht.features.map((f) => (
              <li key={f} className={styles.feature}>
                <span className={styles.featureDot} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>

          <div className={styles.priceBlock}>
            <span className={styles.priceLabel}>от</span>
            <span className={styles.priceValue}>{activeYacht.pricePerHour}</span>
            <span className={styles.priceSuffix}>BYN/ч · мин. {activeYacht.minHours} ч</span>
          </div>

          <div className={styles.actions}>
            <a href="#booking" className={styles.cta}>
              Забронировать {activeYacht.name}
              <svg
                width="14"
                height="14"
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
            </a>
            <Link href={`/fleet/${activeYacht.slug}`} className={styles.detailLink}>
              Подробнее о яхте
            </Link>
          </div>
        </aside>

        <YachtGallery
          key={activeYacht.slug}
          photos={photos}
          name={activeYacht.name}
          zoomable
          eager
          onActiveChange={setBgPhotoIdx}
        />
      </div>
    </section>
  );
}
