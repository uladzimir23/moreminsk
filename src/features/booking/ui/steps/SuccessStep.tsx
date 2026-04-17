"use client";

import { usePanel } from "@/shared/lib/panel/usePanel";
import { CheckCircle2, XCircle } from "lucide-react";
import { useBookingStore } from "../../model/store";
import styles from "./SuccessStep.module.scss";

export function SuccessStep() {
  const { submitState, lastError, reset, goToStep } = useBookingStore();
  const { close } = usePanel();

  if (submitState === "submitting") {
    return (
      <div className={styles.root}>
        <div className={styles.spinner} aria-label="Отправляем заявку" />
        <h2 className={styles.title}>Отправляем…</h2>
        <p className={styles.lead}>Обычно это занимает пару секунд.</p>
      </div>
    );
  }

  if (submitState === "error") {
    return (
      <div className={styles.root}>
        <div className={styles.iconWrap} aria-hidden="true">
          <XCircle size={36} />
        </div>
        <h2 className={styles.title}>Не получилось отправить</h2>
        <div className={styles.errorBlock}>
          <span className={styles.errorTitle}>Что-то пошло не так</span>
          <span className={styles.errorMsg}>
            {lastError ?? "Проверьте соединение и попробуйте ещё раз."}
          </span>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={() => goToStep(5)}>
            Попробовать снова
          </button>
          <button type="button" className={styles.secondary} onClick={close}>
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  const handleClose = () => {
    close();
    reset();
  };

  const handleNew = () => {
    reset();
  };

  return (
    <div className={styles.root}>
      <div className={styles.iconWrap} aria-hidden="true">
        <CheckCircle2 size={36} />
      </div>
      <h2 className={styles.title}>Заявка отправлена</h2>
      <p className={styles.lead}>
        Менеджер свяжется с вами в течение 30 минут, подтвердит слот и рассчитает точную цену. Если
        нужно срочно — звоните{" "}
        <a href="tel:+375291234567" style={{ color: "var(--color-primary)" }}>
          +375 29 123-45-67
        </a>
        .
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={handleClose}>
          Закрыть
        </button>
        <button type="button" className={styles.secondary} onClick={handleNew}>
          Новая заявка
        </button>
      </div>
    </div>
  );
}
