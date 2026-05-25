"use client";

import { SERVICES } from "@/shared/content/services";
import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { useStickyCta } from "@/shared/ui/sticky-cta/StickyCtaContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { PHOTOS_BY_YACHT, type YachtSlug } from "../../_data/photos";
import styles from "./services-section.module.scss";

// One hand-picked yacht photo per occasion — best-fit, not the cover shot.
// den-rozhdeniya → ALFA, festive group on deck (red sail, daytime);
// korporativ → BRAVO flagship under full sail; svidanie → EVA at sunset;
// devichnik → ALFA, a girls' evening with drinks; fotosessiya → EVA, the
// coral-dress shoot by the «EVA» lettering (on-brand accent).
const SERVICE_PHOTO: Record<string, { yacht: YachtSlug; idx: number }> = {
  "den-rozhdeniya": { yacht: "alfa", idx: 2 },
  korporativ: { yacht: "bravo", idx: 0 },
  svidanie: { yacht: "eva", idx: 0 },
  devichnik: { yacht: "alfa", idx: 6 },
  fotosessiya: { yacht: "eva", idx: 5 },
};

const photoFor = (slug: string) => {
  const pick = SERVICE_PHOTO[slug] ?? { yacht: "eva" as YachtSlug, idx: 0 };
  return { ...pick, url: PHOTOS_BY_YACHT[pick.yacht][pick.idx] };
};

export function ServicesSection() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  // Observe each slide; whichever is most visible is "active".
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = slideRefs.current.findIndex((el) => el === entry.target);
          if (idx >= 0 && entry.intersectionRatio > 0.55) {
            setActiveIdx(idx);
          }
        });
      },
      { threshold: [0, 0.55, 0.9], root: trackRef.current },
    );
    slideRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((idx: number) => {
    const slide = slideRefs.current[idx];
    if (slide) {
      slide.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, []);

  const next = () => scrollTo(Math.min(SERVICES.length - 1, activeIdx + 1));
  const prev = () => scrollTo(Math.max(0, activeIdx - 1));

  // Page-level CTA — the per-card «Забронировать …» button lives in the fixed
  // bottom bar now and tracks whichever poster is centred.
  const active = SERVICES[activeIdx];
  const sectionRef = useStickyCta("services", {
    label: `Забронировать · ${active.shortTitle.toLowerCase()}`,
    icon: "arrow",
    onClick: () => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" }),
  });

  return (
    <section className={styles.section} id="services" ref={sectionRef}>
      {/* Ambient section backdrop — blurred copy of the active service's photo. */}
      <AmbientBackdrop
        images={SERVICES.map((service) => photoFor(service.slug).url)}
        activeIndex={activeIdx}
      />

      <SectionHeader
        eyebrow="02 · Услуги"
        title="Под что бронируют"
        accent="чаще всего."
        tone="image"
        framed
      />

      <div className={styles.rail}>
        <div className={styles.track} ref={trackRef}>
          {SERVICES.map((service, i) => {
            const photo = photoFor(service.slug);
            const words = service.shortTitle.split(" ");
            const head = words.slice(0, -1).join(" ");
            const tail = words[words.length - 1];

            return (
              <article
                key={service.slug}
                className={styles.slide}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                aria-label={service.h1}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.photo}
                  src={photo.url}
                  alt={`${service.shortTitle} на яхте ${photo.yacht.toUpperCase()}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
                <div className={styles.scrim} aria-hidden="true" />

                <div className={styles.content}>
                  <p className={styles.chapterNumber}>{String(i + 1).padStart(2, "0")}</p>
                  <h3 className={styles.serviceName}>
                    {head && `${head} `}
                    <span className={styles.serviceAccent}>{tail}.</span>
                  </h3>
                  <p className={styles.serviceUtp}>{service.utp}</p>
                  <p className={styles.price}>
                    <span className={styles.priceFrom}>от</span>
                    {service.fromPrice}&nbsp;<span className={styles.priceUnit}>BYN</span>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.controls}>
        <nav className={styles.indicator} aria-label="Услуги">
          {SERVICES.map((service, i) => (
            <button
              key={service.slug}
              type="button"
              className={i === activeIdx ? styles.dotActive : styles.dot}
              onClick={() => scrollTo(i)}
              aria-current={i === activeIdx}
              aria-label={`${service.shortTitle} (${i + 1} из ${SERVICES.length})`}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          ))}
        </nav>

        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrow}
            onClick={prev}
            disabled={activeIdx === 0}
            aria-label="Предыдущая услуга"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={next}
            disabled={activeIdx === SERVICES.length - 1}
            aria-label="Следующая услуга"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
