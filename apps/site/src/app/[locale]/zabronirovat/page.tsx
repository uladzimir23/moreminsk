import { BookingWizard } from "@/features/booking-wizard/BookingWizard";
import { withBase } from "@/shared/lib/base-path";
import { buildMetadata } from "@/shared/lib/seo";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import styles from "./BookingPage.module.scss";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    ...buildMetadata({
      locale,
      path: "/zabronirovat",
      title: "Забронировать яхту — Море Minsk",
      description:
        "Выберите яхту, дату и время — свободные окна и цена рассчитаются онлайн. Ответ за 30 минут.",
    }),
    robots: { index: false, follow: true },
  };
}

export default async function BookingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const videoSrc = withBase("/design-lab/yacht-hero.mp4");
  const videoPoster = withBase("/design-lab/yacht-hero-poster.jpg");

  return (
    <div className={styles.page}>
      <video
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        poster={videoPoster}
        aria-hidden="true"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className={styles.videoWash} aria-hidden="true" />

      <div className={styles.safe}>
        <aside className={styles.left}>
          <div className={styles.leftInner}>
            <p className={styles.eyebrow}>Онлайн-бронирование</p>
            <h1 className={styles.title}>
              Парус. Мотор. <span className={styles.accent}>Тишина.</span>
            </h1>
            <p className={styles.tagline}>
              Выберите яхту, дату и час — покажем свободные окна и рассчитаем цену. Оператор
              перезвонит в течение 30 минут для подтверждения.
            </p>
            <ul className={styles.reassure}>
              <li>Без предоплаты — подтверждаем звонком</li>
              <li>Ответ за 30 минут в рабочее время</li>
              <li>Отмена бесплатно за 24 часа</li>
              <li>Капитан и топливо уже в цене</li>
            </ul>
            <div className={styles.contacts}>
              <a href="tel:+375296953636" className={styles.contactLink}>
                +375 29 695 36 36
              </a>
              <a
                href="https://t.me/moreminsk"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                Telegram
              </a>
            </div>
          </div>
        </aside>

        <div className={styles.rightWrap}>
          <div className={styles.frame}>
            <BookingWizard />
          </div>
        </div>
      </div>
    </div>
  );
}
