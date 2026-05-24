# Booking → Telegram relay

Thin Cloudflare Worker that forwards booking-form leads to a Telegram chat.
Keeps the bot token server-side so it's never shipped in the static site's JS.

## Why a relay?

The site is a static export (no API routes). Posting to the Telegram Bot API
directly from the browser would expose the bot token to anyone who views the
bundle. This Worker holds the token as a secret and the site only knows the
Worker URL.

## Setup

1. Create a bot with [@BotFather](https://t.me/BotFather), copy the token.
2. Get the target chat id (DM yourself the bot, then open
   `https://api.telegram.org/bot<token>/getUpdates` and read `chat.id`; or add
   the bot to a group and do the same).
3. Deploy:
   ```bash
   cd infra/booking-telegram-worker
   npx wrangler deploy
   npx wrangler secret put TELEGRAM_BOT_TOKEN
   npx wrangler secret put TELEGRAM_CHAT_ID
   ```
4. Copy the deployed Worker URL (e.g. `https://moreminsk-booking-relay.<acct>.workers.dev`).
5. In the site, set the build-time env var:
   ```
   NEXT_PUBLIC_BOOKING_ENDPOINT=https://moreminsk-booking-relay.<acct>.workers.dev
   ```
   (see `.env.example` at the repo root) and rebuild.

## Swapping for another provider

The site just POSTs `{ text, yacht, service, duration, date, name, phone }` as
JSON to `NEXT_PUBLIC_BOOKING_ENDPOINT`. Point it at Formspree, a Make/Zapier
webhook, etc. instead — no site code changes needed.
