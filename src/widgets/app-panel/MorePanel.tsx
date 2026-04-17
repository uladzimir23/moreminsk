"use client";

import { Link } from "@/i18n/navigation";
import { CONTACTS } from "@/shared/content/contacts";
import { usePanel } from "@/shared/lib/panel/usePanel";
import { LocaleToggle } from "@/shared/ui/locale-toggle/LocaleToggle";
import { ThemeToggle } from "@/shared/ui/theme-toggle/ThemeToggle";
import {
  Camera,
  ChevronRight,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Star,
} from "lucide-react";
import styles from "./MorePanel.module.scss";

const NAV_LINKS = [
  {
    href: "/faq",
    label: "FAQ",
    meta: "Частые вопросы про аренду",
    icon: HelpCircle,
  },
  {
    href: "/#reviews",
    label: "Отзывы",
    meta: "Что говорят гости",
    icon: Star,
  },
  {
    href: "/contacts",
    label: "Контакты",
    meta: CONTACTS.address.line1,
    icon: MapPin,
  },
] as const;

export function MorePanel() {
  const { close } = usePanel();

  return (
    <div className={styles.root}>
      <section className={styles.section}>
        <span className={styles.sectionTitle}>Разделы</span>
        {NAV_LINKS.map(({ href, label, meta, icon: Icon }) => (
          <Link key={href} href={href} className={styles.link} onClick={close}>
            <Icon className={styles.linkIcon} aria-hidden="true" />
            <span className={styles.linkBody}>
              <span className={styles.linkLabel}>{label}</span>
              <span className={styles.linkMeta}>{meta}</span>
            </span>
            <ChevronRight size={18} className={styles.linkChevron} aria-hidden="true" />
          </Link>
        ))}
      </section>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Связаться</span>
        <a href={CONTACTS.phones[0].href} className={styles.link}>
          <Phone className={styles.linkIcon} aria-hidden="true" />
          <span className={styles.linkBody}>
            <span className={styles.linkLabel}>Позвонить</span>
            <span className={styles.linkMeta}>{CONTACTS.phones[0].label}</span>
          </span>
          <ChevronRight size={18} className={styles.linkChevron} aria-hidden="true" />
        </a>
        <a href={CONTACTS.email.href} className={styles.link}>
          <Mail className={styles.linkIcon} aria-hidden="true" />
          <span className={styles.linkBody}>
            <span className={styles.linkLabel}>Написать на email</span>
            <span className={styles.linkMeta}>{CONTACTS.email.label}</span>
          </span>
          <ChevronRight size={18} className={styles.linkChevron} aria-hidden="true" />
        </a>

        <div className={styles.socialRow}>
          <a
            href={CONTACTS.telegram.href}
            target="_blank"
            rel="noreferrer"
            className={styles.socialBtn}
            aria-label={`Telegram ${CONTACTS.telegram.label}`}
          >
            <Send className={styles.socialIcon} aria-hidden="true" />
          </a>
          <a
            href={CONTACTS.viber.href}
            className={styles.socialBtn}
            aria-label={`Viber ${CONTACTS.viber.label}`}
          >
            <MessageCircle className={styles.socialIcon} aria-hidden="true" />
          </a>
          <a
            href={CONTACTS.instagram.href}
            target="_blank"
            rel="noreferrer"
            className={styles.socialBtn}
            aria-label={`Instagram ${CONTACTS.instagram.label}`}
          >
            <Camera className={styles.socialIcon} aria-hidden="true" />
          </a>
          <a
            href={CONTACTS.address.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className={styles.socialBtn}
            aria-label="Показать причал на карте"
          >
            <MapPin className={styles.socialIcon} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Настройки</span>
        <div className={styles.togglesRow}>
          <span className={styles.toggleLabel}>Тема</span>
          <ThemeToggle />
        </div>
        <div className={styles.togglesRow}>
          <span className={styles.toggleLabel}>Язык</span>
          <LocaleToggle />
        </div>
      </section>
    </div>
  );
}
