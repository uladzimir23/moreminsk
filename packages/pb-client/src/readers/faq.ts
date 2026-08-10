import { z } from "zod";
import { FaqItem } from "../entities/faq";
import { readSnapshot } from "./snapshot";

const FaqSchema = z.array(FaqItem);
let cached: FaqItem[] | null = null;

export function getFaq(): FaqItem[] {
  if (cached) return cached;
  cached = readSnapshot("faq", FaqSchema);
  return cached;
}
