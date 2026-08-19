/// <reference path="../pb_data/types.d.ts" />

// Зеркалит новую заявку с сайта → tentative-бронь в `bookings`, чтобы админ
// видел её в календаре и мог подтвердить одним кликом.
//
// Триггер: onRecordAfterCreateSuccess("leads") с source="booking" и
// заполненными yacht/date/time (time парсим из comment: "Время: HH:MM").
// Если чего-то не хватает — silent skip.

onRecordAfterCreateSuccess((e) => {
  try {
    const lead = e.record;
    if (lead.getString("source") !== "booking") {
      e.next();
      return;
    }

    const yachtSlug = lead.getString("yacht");
    const date = lead.getString("date");
    const comment = lead.getString("comment") || "";
    if (!yachtSlug || !date) {
      e.next();
      return;
    }

    const timeMatch = comment.match(/(\d{2}):(\d{2})/);
    if (!timeMatch) {
      e.next();
      return;
    }
    const start = `${timeMatch[1]}:${timeMatch[2]}`;
    const startMinutes = parseInt(timeMatch[1]) * 60 + parseInt(timeMatch[2]);
    const endMinutes = startMinutes + 60;
    const end = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

    // Резолвим yacht slug → PB record id
    let yachtId = "";
    try {
      const yachtRec = $app.findFirstRecordByFilter("yachts", `slug = "${yachtSlug}"`);
      yachtId = yachtRec ? yachtRec.id : "";
    } catch (_) {
      yachtId = "";
    }
    if (!yachtId) {
      console.log(`[booking-hook] yacht not found: ${yachtSlug}`);
      e.next();
      return;
    }

    const bookingsCol = $app.findCollectionByNameOrId("bookings");
    const booking = new Record(bookingsCol, {
      yacht: yachtId,
      date: date,
      start: start,
      end: end,
      status: "tentative",
      client_name: lead.getString("name"),
      client_phone: lead.getString("phone"),
      source: "site",
      comment: `Заявка #${lead.id} — ждёт подтверждения`,
      lead: lead.id,
      archived: false,
    });
    $app.save(booking);
    console.log(`[booking-hook] tentative created: ${yachtSlug} ${date} ${start}`);
  } catch (err) {
    console.log(`[booking-hook] error: ${err}`);
  }
  e.next();
}, "leads");
