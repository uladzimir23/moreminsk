import { z } from "zod";

// Формы booking / contact шлют в единую коллекцию leads.
// Ключи схемы совпадают с именами полей PB-коллекции (см. миграцию
// 1783523196_created_leads.js: name/phone/service/yacht/date/guests/comment/source).
// PB rule: createRule = "" (public create), read — authed only (см. pb:roles).
export const LeadPayload = z.object({
  source: z.enum(["booking", "contact"]),
  name: z.string().min(1),
  phone: z.string().min(1),
  yacht: z.string().optional(),
  service: z.string().optional(),
  date: z.string().optional(),
  guests: z.number().optional(),
  comment: z.string().default(""),
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
