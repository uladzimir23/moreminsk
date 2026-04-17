// AppPanel modes per ADR-007.
//   order        — главный CTA «Заказать» (форма брони)
//   fleet-filter — фильтры на /fleet
//   more         — mobile-only: вторичная нав
//   gallery      — lightbox для фото яхты
export type PanelMode = "order" | "fleet-filter" | "more" | "gallery";

export type PanelContextValue = {
  isOpen: boolean;
  mode: PanelMode | null;
  payload?: unknown;
  open: (mode: PanelMode, payload?: unknown) => void;
  close: () => void;
};
