import { z } from "zod";

// Формы booking / contact шлют в единую коллекцию leads.
// PB rule: createRule = "" (public create), read — authed only (см. pb:roles).
export const LeadPayload = z.object({
  source: z.enum(["booking", "contact"]),
  name: z.string().min(1),
  phone: z.string().min(1),
  message: z.string().default(""),
  date: z.string().optional(),
  hours: z.number().optional(),
  yachtSlug: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});
export type LeadPayload = z.infer<typeof LeadPayload>;

const DEFAULT_PB_URL = "https://admin.more-minsk.by";

/**
 * Клиентский POST в PB /api/collections/leads/records.
 * Возвращает id созданной записи или бросает Error с текстом.
 */
export async function submitLead(
  payload: LeadPayload,
  opts: { pbUrl?: string; signal?: AbortSignal } = {},
): Promise<{ id: string }> {
  const parsed = LeadPayload.parse(payload);
  const url = `${opts.pbUrl ?? DEFAULT_PB_URL}/api/collections/leads/records`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed),
    signal: opts.signal,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[pb-client] submitLead failed: ${res.status} ${body}`);
  }
  const data = (await res.json()) as { id: string };
  return { id: data.id };
}
