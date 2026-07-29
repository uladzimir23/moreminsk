import { z } from "zod";
import { LegalDocument } from "../entities/document";
import { readSnapshot } from "./snapshot";

const Schema = z.array(LegalDocument);
let cached: LegalDocument[] | null = null;

export function getDocuments(): LegalDocument[] {
  if (cached) return cached;
  cached = readSnapshot("documents", Schema);
  return cached;
}

export function getDocument(slug: string): LegalDocument | undefined {
  return getDocuments().find((d) => d.slug === slug);
}
