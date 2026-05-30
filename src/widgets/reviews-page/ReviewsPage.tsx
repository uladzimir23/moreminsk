"use client";

import { QuickBooking } from "@/features/booking/QuickBooking";
import { CONTACTS } from "@/shared/content/contacts";
import { PageHero } from "@/shared/ui/page-hero/PageHero";
import { PageShell } from "@/shared/ui/page-hero/PageShell";
import { COVER_BY_YACHT } from "@/widgets/landing/_data/photos";
import { ArrowUpRight, Star } from "lucide-react";
import { InstagramStories } from "./InstagramStories";
import styles from "./ReviewsPage.module.scss";

// Yandex.Карты Reviews widget — лента живых отзывов карточки яхт-клуба (oid).
// Высота фиксированная, внутри widget свой скролл/виртуализация. Когда Pavel
// пришлёт скриншоты Instagram-отзывов — добавим вверху ленту «Избранные»;
// сейчас только Yandex (единый верифицированный источник).
const yandexReviewsUrl = `https://yandex.by/maps-reviews-widget/${CONTACTS.yandex.oid}?comments`;

// Прямая ссылка на карточку организации в Яндекс.Картах — отдельная CTA «Открыть
// в Яндекс.Картах» под виджетом (на случай, если iframe заблокирован).
const yandexMapUrl = `https://yandex.by/maps/org/${CONTACTS.yandex.oid}/reviews`;

export function ReviewsPage() {
  return (
    <PageShell
      hero={
        <PageHero
          crumbs={[{ label: "Главная", href: "/" }, { label: "Отзывы" }]}
          eyebrow="Отзывы"
          title="Что говорят"
          accent="наши гости."
          lead="Живые отзывы с Яндекс.Карт — без модерации с нашей стороны, можно проверить в первоисточнике. Если хотите оставить свой — напишите в Telegram или прямо в Яндекс."
          image={COVER_BY_YACHT.bravo}
          titleId="reviews-title"
        />
      }
    >
      <section className={styles.section} aria-labelledby="reviews-title">
        <div className={styles.grid}>
          {/* ── Left: Yandex Reviews widget ───────────────────────── */}
          <div className={styles.content}>
            <header className={styles.intro}>
              <span className={styles.eyebrow}>Источник</span>
              <h2 className={styles.title}>
                Отзывы с <span className={styles.titleAccent}>Яндекс.Карт</span>
              </h2>
              <p className={styles.lead}>
                <Star className={styles.starIcon} aria-hidden="true" fill="currentColor" />
                Все отзывы написаны клиентами в Яндексе — их нельзя отредактировать или удалить,
                поэтому им можно доверять.
              </p>
            </header>

            <div className={styles.widget}>
              <iframe
                title="Отзывы Минского яхт-клуба на Яндекс.Картах"
                src={yandexReviewsUrl}
                className={styles.widgetFrame}
                loading="lazy"
              />
            </div>

            <a href={yandexMapUrl} target="_blank" rel="noreferrer" className={styles.openYandex}>
              Открыть отзывы в Яндекс.Картах
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>

          {/* ── Right: sticky booking ─────────────────────────────── */}
          <aside className={styles.bookCol}>
            <div className={styles.bookSticky}>
              <h2 className={styles.bookTitle}>Оставить заявку</h2>
              <p className={styles.bookLead}>
                Согласуем дату, яхту и формат прогулки. Перезвоним в течение 30 минут.
              </p>
              <QuickBooking yacht={{ name: "На выбор" }} />
            </div>
          </aside>
        </div>

        {/* Истории клиентов из Instagram — full-width под 50/50 блоком. */}
        <div className={styles.instagramWrap}>
          <InstagramStories />
        </div>
      </section>
    </PageShell>
  );
}
