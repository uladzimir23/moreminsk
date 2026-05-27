import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";

export const yachtStepSchema = z.object({
  yachtSlug: z.union([z.enum(["eva", "alfa", "mario", "bravo"]), z.literal("any")]),
});

export const dateTimeStepSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Выберите дату")
    .refine((val) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(val) >= today;
    }, "Дата не может быть в прошлом"),
  timeSlot: z.string().min(1, "Выберите время"),
});

export const contactStepSchema = z.object({
  name: z.string().trim().min(2, "Минимум 2 символа"),
  phone: z.string().refine((val) => {
    const parsed = parsePhoneNumberFromString(val, "BY");
    return parsed?.isValid() ?? false;
  }, "Телефон должен быть корректным (+375 / +7 / +380)"),
  preferredContact: z.enum(["telegram", "phone", "whatsapp"]),
  email: z
    .union([z.string().email("Некорректный email"), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  guests: z.number().int().min(1, "Минимум 1 гость").max(12, "Максимум 12 гостей"),
  comment: z.string().max(500, "Максимум 500 символов").optional(),
});

export const summaryStepSchema = z.object({
  policyAccepted: z.literal(true, { message: "Нужно согласие с политикой" }),
});

export type YachtStepValues = z.infer<typeof yachtStepSchema>;
export type DateTimeStepValues = z.infer<typeof dateTimeStepSchema>;
export type ContactStepValues = z.infer<typeof contactStepSchema>;
export type SummaryStepValues = z.infer<typeof summaryStepSchema>;
