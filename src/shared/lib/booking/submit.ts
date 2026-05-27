// Booking form submission for a static-export site (no API routes).
//
// The form POSTs to NEXT_PUBLIC_BOOKING_ENDPOINT — a thin relay that forwards
// the lead to Telegram (see infra/booking-telegram-worker) or any webhook
// (Formspree etc.). The Telegram bot token lives in the relay, never in this
// client bundle. If the endpoint isn't configured the caller surfaces a phone
// fallback instead of pretending the lead was sent.

export type BookingPayload = {
  yacht: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  /** Optional повод when the lead came from a service page (no calculator). */
  service?: string;
};

export class BookingNotConfiguredError extends Error {
  constructor() {
    super("Booking endpoint is not configured (NEXT_PUBLIC_BOOKING_ENDPOINT).");
    this.name = "BookingNotConfiguredError";
  }
}

const ENDPOINT = process.env.NEXT_PUBLIC_BOOKING_ENDPOINT;

function formatMessage(p: BookingPayload): string {
  return [
    "🛥 Новая заявка — минское море",
    "",
    `Имя: ${p.name}`,
    `Телефон: ${p.phone}`,
    `Яхта: ${p.yacht}`,
    `Дата: ${p.date || "—"}`,
    `Время: ${p.time || "—"}`,
    ...(p.service ? [`Повод: ${p.service}`] : []),
  ].join("\n");
}

export async function submitBooking(payload: BookingPayload): Promise<void> {
  if (!ENDPOINT) throw new BookingNotConfiguredError();

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ text: formatMessage(payload), ...payload }),
  });

  if (!res.ok) throw new Error(`Booking submit failed: ${res.status}`);
}
