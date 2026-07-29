import { Contacts } from "../entities/contact";
import { readSnapshot } from "./snapshot";

// Singleton: export.ts пишет объект (не массив).
let cached: Contacts | null = null;

export function getContacts(): Contacts {
  if (cached) return cached;
  cached = readSnapshot("contacts", Contacts);
  return cached;
}
