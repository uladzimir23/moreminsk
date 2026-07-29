import { Certificate } from "../entities/certificate";
import { readSnapshot } from "./snapshot";

// Singleton: export.ts пишет объект (не массив).
let cached: Certificate | null = null;

export function getCertificate(): Certificate {
  if (cached) return cached;
  cached = readSnapshot("certificates", Certificate);
  return cached;
}
