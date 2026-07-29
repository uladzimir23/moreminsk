import { z } from "zod";

export const YachtType = z.enum(["sail", "motor", "sail-motor"]);
export type YachtType = z.infer<typeof YachtType>;

export const YachtSpecs = z.object({
  model: z.string(),
  builder: z.string(),
  lengthM: z.number(),
  beamM: z.number(),
  draftM: z.string(),
  cabins: z.number().optional(),
  berths: z.number().optional(),
  sailAreaM2: z.number().optional(),
  headroomM: z.number().optional(),
  yearsBuilt: z.string().optional(),
  inferred: z.boolean().optional(),
});
export type YachtSpecs = z.infer<typeof YachtSpecs>;

export const Yacht = z.object({
  slug: z.string(),
  name: z.string(),
  type: YachtType,
  capacity: z.number(),
  lengthMeters: z.number().optional(),
  pricePerHour: z.number(),
  minHours: z.number(),
  description: z.string(),
  features: z.array(z.string()),
  suitableFor: z.array(z.string()),
  gallery: z.array(z.string()).default([]),
  mainImage: z.string().default(""),
  video: z.string().optional(),
  photos: z.array(z.string()).default([]),
  specs: YachtSpecs.optional(),
  badge: z.enum(["flagship", "new"]).or(z.literal("")).optional(),
});
export type Yacht = z.infer<typeof Yacht>;
