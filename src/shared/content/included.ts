export type IncludedItem = {
  /** Lucide icon name — resolved to a component in the section. */
  icon: string;
  label: string;
};

// «Что входит» — единый набор для любой яхты и любого повода. Список прислал
// заказчик (Telegram 2026-05-27), причёсан под tone-of-voice; эмодзи заменены
// иконками Lucide в секции.
export const INCLUDED: ReadonlyArray<IncludedItem> = [
  { icon: "Ship", label: "Вся яхта — только для вашей компании" },
  { icon: "UserRound", label: "Капитан с опытом" },
  { icon: "Sailboat", label: "Поднимаем паруса по желанию" },
  { icon: "Navigation", label: "Даём постоять за штурвалом" },
  { icon: "Music", label: "Аудиосистема" },
  { icon: "Route", label: "Живописный маршрут по морю" },
  { icon: "LifeBuoy", label: "Пледы и спасжилеты" },
  { icon: "Utensils", label: "Одноразовая посуда" },
  { icon: "Anchor", label: "Чешки и бахилы, каюта и морской туалет на борту" },
];
