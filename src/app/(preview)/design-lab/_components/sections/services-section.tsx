"use client";

import { SERVICES } from "@/shared/content/services";
import { useCallback, useEffect, useRef, useState } from "react";
import { PHOTOS_BY_YACHT, type YachtSlug } from "../../_data/photos";
import styles from "./services-section.module.scss";

// Each service gets a mood photo from one of the yachts — best-fit visual
// for the occasion. EVA = romantic/sunset; ALFA = group dinner; MARIO =
// active/motor; BRAVO = premium/flagship.
const SERVICE_MOOD: Record<string, { yacht: YachtSlug; photoIdx: number }> = {
  "den-rozhdeniya": { yacht: "alfa", photoIdx: 1 },
  korporativ: { yacht: "bravo", photoIdx: 0 },
  svidanie: { yacht: "eva", photoIdx: 0 },
  devichnik: { yacht: "alfa", photoIdx: 3 },
  fotosessiya: { yacht: "eva", photoIdx: 2 },
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

  return (
    <section className={styles.section} id="services">
      {/* Ambient section backdrop — blurred copy of the active service's
          photo, so the whole section breathes its mood. */}
      <div className={styles.backdrop} aria-hidden="true">
        {SERVICES.map((service, i) => {
          const mood = SERVICE_MOOD[service.slug];
          return (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={`section-bg-${service.slug}`}
              src={PHOTOS_BY_YACHT[mood.yacht][mood.photoIdx]}
              alt=""
              className={i === activeIdx ? styles.backdropImgActive : styles.backdropImg}
              loading={i === 0 ? "eager" : "lazy"}
            />
          );
        })}
        <div className={styles.backdropOverlay} />
      </div>

      <header className={styles.head}>
        <p className={styles.eyebrow}>02 · Услуги</p>
        <h2 className={styles.title}>
          Под что бронируют <span className={styles.accent}>чаще всего.</span>
        </h2>
      </header>

      <div className={styles.rail}>
        <div className={styles.track} ref={trackRef}>
          {SERVICES.map((service, i) => {
            const mood = SERVICE_MOOD[service.slug];
            const bgUrl = PHOTOS_BY_YACHT[mood.yacht][mood.photoIdx];
            const heroUrl = PHOTOS_BY_YACHT[mood.yacht][mood.photoIdx];

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
                  src={bgUrl}
                  alt=""
                  aria-hidden="true"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                <div className={styles.bgOverlay} aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.heroImg}
                  src={heroUrl}
                  alt={`${service.shortTitle} — атмосфера на яхте ${mood.yacht.toUpperCase()}`}
                  loading={i === 0 ? "eager" : "lazy"}
                />

                <div className={styles.content}>
                  <div className={styles.contentInner}>
                    <p className={styles.chapterNumber}>
                      {String(i + 1).padStart(2, "0")} · {service.shortTitle}
                    </p>
                    <h3 className={styles.serviceName}>
                      {service.shortTitle.split(" ").length > 1 ? (
                        <>
                          {service.shortTitle.split(" ").slice(0, -1).join(" ")}{" "}
                          <span className={styles.serviceAccent}>
                            {service.shortTitle.split(" ").slice(-1)[0]}.
                          </span>
                        </>
                      ) : (
                        <>
                          <span className={styles.serviceAccent}>{service.shortTitle}.</span>
                        </>
                      )}
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
