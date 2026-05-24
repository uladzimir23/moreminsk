// Cloudflare Worker — relays booking-form POSTs from the static site to a
// Telegram chat. The bot token stays here (Worker secret), never in the
// browser bundle. The site posts JSON { text, ...fields } to this Worker's URL,
// which is set as NEXT_PUBLIC_BOOKING_ENDPOINT at build time.
//
// Deploy:
//   cd infra/booking-telegram-worker
//   npx wrangler deploy
//   npx wrangler secret put TELEGRAM_BOT_TOKEN   # from @BotFather
//   npx wrangler secret put TELEGRAM_CHAT_ID      # your chat / group id
//   # optional: set ALLOW_ORIGIN to https://moreminsk.by in wrangler.toml [vars]

const handler = {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOW_ORIGIN || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: cors });
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return new Response("Bad JSON", { status: 400, headers: cors });
    }

    // Minimal validation — a real lead needs a name + phone.
    if (!data || typeof data.phone !== "string" || data.phone.trim().length < 5) {
      return new Response("Invalid payload", { status: 422, headers: cors });
    }

    const text =
      typeof data.text === "string" && data.text.length > 0 ? data.text : JSON.stringify(data);

    const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text,
        disable_web_page_preview: true,
      }),
    });

    if (!tg.ok) {
      return new Response("Telegram delivery failed", { status: 502, headers: cors });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};

export default handler;
