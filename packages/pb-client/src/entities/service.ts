import { z } from "zod";

export const Service = z.object({
  slug: z.string(),
  h1: z.string(),
  shortTitle: z.string().default(""),
  utp: z.string().default(""),
  icon: z.string().default(""),
  fromPrice: z.number(),
  suitableYachts: z.array(z.string()).default([]),
});
export type Service = z.infer<typeof Service>;
