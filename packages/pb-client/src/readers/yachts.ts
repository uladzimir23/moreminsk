import { z } from "zod";
import { Yacht } from "../entities/yacht";
import { readSnapshot } from "./snapshot";

const YachtsSchema = z.array(Yacht);

let cached: Yacht[] | null = null;

export function getYachts(): Yacht[] {
  if (cached) return cached;
  cached = readSnapshot("yachts", YachtsSchema);
  return cached;
}

export function getYacht(slug: string): Yacht | undefined {
  return getYachts().find((y) => y.slug === slug);
}
