import { z } from "zod";

// PB хранит key; фронт использует id. Ниже — двухступенчатая валидация:
// сырое поле → transform → снова parse. Так bullets в выходной type
// действительно опциональный ключ (bullets?: string[]), а не required-with-undefined.
const FaqItemRaw = z.object({
  key: z.string(),
  question: z.string(),
  answer: z.string(),
  bullets: z.array(z.string()).nullable().optional(),
  tags: z.array(z.string()),
});

const FaqItemOutput = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  bullets: z.array(z.string()).optional(),
  tags: z.array(z.string()),
});

export const FaqItem = FaqItemRaw.transform((v) => {
  const base = {
    id: v.key,
    question: v.question,
    answer: v.answer,
    tags: v.tags,
  };
  return v.bullets && v.bullets.length > 0
    ? { ...base, bullets: v.bullets }
    : base;
}).pipe(FaqItemOutput);
export type FaqItem = z.infer<typeof FaqItem>;
