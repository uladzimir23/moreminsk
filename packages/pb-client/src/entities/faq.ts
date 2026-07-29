import { z } from "zod";

// PB хранит key (уникальный текстовый ключ). Фронт использует id для React-ключей —
// маппим key→id прозрачно через transform.
export const FaqItem = z
  .object({
    key: z.string(),
    question: z.string(),
    answer: z.string(),
    bullets: z.array(z.string()).nullable().optional(),
    tags: z.array(z.string()),
  })
  .transform((v) => ({
    id: v.key,
    question: v.question,
    answer: v.answer,
    bullets: v.bullets ?? undefined,
    tags: v.tags,
  }));
export type FaqItem = z.infer<typeof FaqItem>;
