import { z } from "zod";

export const CertFaqItem = z.object({
  id: z.string().optional(),
  question: z.string(),
  answer: z.string(),
});
export type CertFaqItem = z.infer<typeof CertFaqItem>;

export const Certificate = z.object({
  priceFrom: z.number(),
  season: z.string(),
  lead: z.string(),
  offer: z.array(z.string()),
  photos: z.array(z.string()),
  photoAlts: z.array(z.string()).default([]),
  faq: z.array(CertFaqItem).default([]),
});
export type Certificate = z.infer<typeof Certificate>;
