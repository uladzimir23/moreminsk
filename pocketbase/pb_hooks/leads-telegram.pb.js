/// <reference path="../pb_data/types.d.ts" />

// Уведомление в Telegram о новой заявке в коллекции `leads`.
//
// Env-переменные (задаются в docker-compose):
//   TG_BOT_TOKEN   — токен бота (@BotFather)
//   TG_CHAT_IDS    — chat_id получателей через запятую (группа/DM)
//   PB_PUBLIC_URL  — базовый URL админки (по умолчанию https://admin.more-minsk.by)
//
// Хук молча ничего не делает, если TG_BOT_TOKEN / TG_CHAT_IDS не заданы —
// удобно для локальной разработки без бота.
//
// Тег `leads` ограничивает хук одной коллекцией.
onRecordAfterCreateSuccess((e) => {
  try {
    const token = $os.getenv("TG_BOT_TOKEN");
    const chatIdsRaw = $os.getenv("TG_CHAT_IDS");
    console.log(
      `[tg] leads create fired · id=${e.record.id} · token=${token ? "yes" : "no"} · chats=${chatIdsRaw ? "yes" : "no"}`,
    );
    if (!token || !chatIdsRaw) {
      e.next();
      return;
    }

    const rec = e.record;
    const source = rec.getString("source") || "—";
    const name = rec.getString("name") || "—";
    const phone = rec.getString("phone") || "—";
    const yacht = rec.getString("yacht");
    const service = rec.getString("service");
    const date = rec.getString("date");
    const guests = rec.getString("guests");
    const comment = rec.getString("comment");

    const lines = [
      `🛥 Новая заявка · ${source}`,
      "",
      `Имя: ${name}`,
      `Тел: ${phone}`,
    ];
    if (yacht) lines.push(`Яхта: ${yacht}`);
    if (service) lines.push(`Услуга: ${service}`);
    if (date) lines.push(`Дата: ${date}`);
    if (guests) lines.push(`Гостей: ${guests}`);
    if (comment) lines.push(`Комментарий: ${comment}`);

    const base = $os.getenv("PB_PUBLIC_URL") || "https://admin.more-minsk.by";
    const adminUrl = `${base}/_/#/collections?collection=leads&recordId=${rec.id}`;
    lines.push("", `↗ ${adminUrl}`);

    const text = lines.join("\n");
    const chatIds = chatIdsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    for (const chatId of chatIds) {
      try {
        const res = $http.send({
          method: "POST",
          url: `https://api.telegram.org/bot${token}/sendMessage`,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            disable_web_page_preview: true,
          }),
          timeout: 8,
        });
        if (res.statusCode >= 300) {
          console.log(`[tg] chat ${chatId} → ${res.statusCode} ${res.raw}`);
        }
      } catch (err) {
        console.log(`[tg] send failed for chat ${chatId}: ${err}`);
      }
    }
  } catch (err) {
    // Никогда не роняем создание записи из-за проблем с уведомлением.
    console.log(`[tg] hook error: ${err}`);
  }

  e.next();
}, "leads");
