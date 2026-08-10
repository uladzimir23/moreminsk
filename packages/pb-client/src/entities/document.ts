import { z } from "zod";

export const LegalDocument = z.object({
  slug: z.string(),
  title: z.string(),
  lead: z.string().default(""),
  paragraphs: z.array(z.string()).default([]),
});
export type LegalDocument = z.infer<typeof LegalDocument>;
