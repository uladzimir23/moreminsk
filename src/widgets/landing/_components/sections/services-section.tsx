"use client";

import { SERVICES } from "@/shared/content/services";
import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import { useCallback, useEffect, useRef, useState } from "react";
import { servicePhoto } from "../../_data/service-photos";
import styles from "./services-section.module.scss";

// Responsive carousel: on desktop (≥lg) a wide cinematic banner — blurred
// backdrop + the crisp photo on the right + packages + an in-card CTA. On
// mobile / tablet the same card collapses (via CSS) into a portrait poster:
// the photo fills it cover, the copy sits over a bottom scrim with «от X BYN».
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

  return (
    <section className={styles.section} id="services">
      {/* Ambient section backdrop — blurred copy of the active service's photo. */}
      <AmbientBackdrop
        images={SERVICES.map((service) => servicePhoto(service.slug).url)}
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
            const photo = servicePhoto(service.slug);
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
                  className={styles.bg}
                  src={photo.url}
                  alt={`${service.shortTitle} на яхте ${photo.yacht.toUpperCase()}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
                <div className={styles.bgOverlay} aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.heroImg}
                  src={photo.url}
                  alt=""
                  aria-hidden="true"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />

                <div className={styles.content}>
                  <div className={styles.contentInner}>
                    <p className={styles.chapterNumber}>
                      {String(i + 1).padStart(2, "0")} · {service.shortTitle}
                    </p>
                    <h3 className={styles.serviceName}>
                      {head && `${head} `}
                      <span className={styles.serviceAccent}>{tail}.</span>
                    </h3>
                    <p className={styles.serviceUtp}>{service.utp}</p>

                    <ul className={styles.packages}>
                      {service.packages.map((pkg) => (
                        <li key={pkg.name} className={styles.pkg}>
                          <span className={styles.pkgName}>{pkg.name}</span>
                          <span className={styles.pkgPrice}>{pkg.price}&nbsp;BYN</span>
                          <span className={styles.pkgDuration}>{pkg.duration}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Poster price — shown on mobile / tablet, hidden on the
                        desktop banner (packages carry the prices there). */}
                    <p className={styles.price}>
                      <span className={styles.priceFrom}>от</span>
                      {service.fromPrice}&nbsp;<span className={styles.priceUnit}>BYN</span>
                    </p>

                    <a href="#booking" className={styles.cta}>
                      Забронировать {service.shortTitle.toLowerCase()}
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
                  </div>
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
