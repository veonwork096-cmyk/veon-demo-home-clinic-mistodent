export {};
// "Відчинено до …" by the clinic schedule (W-F005) in Europe/Kyiv time.
// Updates every [data-status] line and marks today in [data-week]. Without JS the full schedule stays.
type Slot = { open: number; close: number }; // minutes from midnight
const SCHEDULE: Record<number, Slot> = {
  0: { open: 600, close: 1020 }, // Нд 10:00–17:00
  1: { open: 540, close: 1200 }, 2: { open: 540, close: 1200 }, 3: { open: 540, close: 1200 },
  4: { open: 540, close: 1200 }, 5: { open: 540, close: 1200 }, // Пн–Пт 9:00–20:00
  6: { open: 540, close: 1080 }, // Сб 9:00–18:00
};
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const fmt = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;

function kyivNow(): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Kyiv", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  return { day: WEEKDAYS.indexOf(get("weekday")), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

function clinicStatus(): { open: boolean; text: string; day: number } {
  const { day, minutes } = kyivNow();
  const today = SCHEDULE[day];
  if (minutes >= today.open && minutes < today.close) {
    return { open: true, text: `Зараз відчинено до ${fmt(today.close)}`, day };
  }
  if (minutes < today.open) return { open: false, text: `Зараз зачинено, відкриємо о ${fmt(today.open)}`, day };
  const next = (day + 1) % 7;
  return { open: false, text: `Зараз зачинено, відкриємо завтра о ${fmt(SCHEDULE[next].open)}`, day };
}

function render() {
  const s = clinicStatus();
  document.querySelectorAll<HTMLElement>("[data-status]").forEach((el) => {
    const t = el.querySelector<HTMLElement>("[data-status-text]");
    if (t) t.textContent = s.text;
    el.classList.toggle("is-open", s.open);
  });
  document.querySelectorAll<HTMLElement>("[data-week] [data-day]").forEach((row) => {
    const isToday = Number(row.dataset.day) === s.day;
    row.classList.toggle("is-today", isToday);
    if (isToday) row.setAttribute("aria-current", "date"); else row.removeAttribute("aria-current");
  });
}

render();
window.setInterval(render, 60_000);
