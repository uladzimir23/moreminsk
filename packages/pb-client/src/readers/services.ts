import { z } from "zod";
import { Service } from "../entities/service";
import { readSnapshot } from "./snapshot";

const ServicesSchema = z.array(Service);
let cached: Service[] | null = null;

export function getServices(): Service[] {
  if (cached) return cached;
  cached = readSnapshot("services", ServicesSchema);
  return cached;
}

export function getService(slug: string): Service | undefined {
  return getServices().find((s) => s.slug === slug);
}
