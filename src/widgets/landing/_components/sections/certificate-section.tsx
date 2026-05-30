import { Link } from "@/i18n/navigation";
import { CERTIFICATE } from "@/shared/content/certificates";
import { withBase } from "@/shared/lib/base-path";
import { AmbientBackdrop } from "@/shared/ui/ambient-backdrop/AmbientBackdrop";
import { SectionHeader } from "@/shared/ui/section-header/SectionHeader";
import styles from "./certificate-section.module.scss";

// «Подарочный сертификат» — single-subject editorial block: blurred ambient
// wash of the cert photos behind, a single framed cover photo on one side, the
// pitch + offer points + price + CTAs to /sertifikaty on the other. Static (no
// state) → server component. Lives between FAQ and BookingCTA.
export function CertificateSection() {
  const cover = withBase(CERTIFICATE.photos[0]);
  const coverAlt = CERTIFICATE.photoAlts[0];
  const washPhotos: ReadonlyArray<string> = CERTIFICATE.photos.map((p) => withBase(p));

  return (
    <section className={styles.section} id="certificate">
      <AmbientBackdrop images={washPhotos} activeIndex={0} className={styles.bg} />
      <div className={styles.inner}>
        <SectionHeader eyebrow="06 · Подарок" title="Сертификат" accent="на яхту." tone="media" />

        <div className={styles.grid}>
          <figure className={styles.media}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={coverAlt}
              className={styles.mediaImg}
              loading="lazy"
              decoding="async"
            />
          </figure>

          <div className={styles.copy}>
            <p className={styles.lead}>{CERTIFICATE.lead}</p>

            <ul className={styles.points}>
              {CERTIFICATE.offer.map((line) => (
                <li key={line} className={styles.point}>
                  {line}
                </li>
              ))}
            </ul>

            <div className={styles.priceRow}>
              <div className={styles.priceBlock}>
                <span className={styles.priceLabel}>от</span>
                <span className={styles.priceValue}>{CERTIFICATE.priceFrom}</span>
                <span className={styles.priceSuffix}>BYN</span>
              </div>
              <span className={styles.season}>Сезон · {CERTIFICATE.season}</span>
            </div>

            <div className={styles.actions}>
              <Link href="/sertifikaty" className={styles.cta}>
                Заказать сертификат
              </Link>
              <Link href="/sertifikaty" className={styles.detail}>
                Подробнее
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
