// Time-of-day slots for the booking form. Duration/packages were removed
// (правка D+F: бронь = яхта·дата·время, почасовая цена, без калькулятора).

export type TimeSlotItem = {
  value: string;
  label: string;
};

export const TIME_SLOTS: readonly TimeSlotItem[] = [
  { value: "10:00", label: "10:00" },
  { value: "14:00", label: "14:00" },
  { value: "evening", label: "Вечер" },
  { value: "custom", label: "Обсудим" },
] as const;
