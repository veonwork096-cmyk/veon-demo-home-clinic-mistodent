// All facts come from veon/client.json (W-F ids in comments). Nothing here is invented.

export interface Phone { display: string; tel: string; }

// company.contacts.phones[0..2], W-F004 — only the Uzhhorod numbers (R-001)
export const phones: Phone[] = [
  { display: "+380 97 441 41 14", tel: "+380974414114" },
  { display: "+380 93 441 41 14", tel: "+380934414114" },
  { display: "+380 95 441 41 14", tel: "+380954414114" },
];
export const mainPhone = phones[0];

export const email = "mistodent@gmail.com"; // company.contacts.emails[0]
export const address = {
  street: "вул. Фединця, 19",
  floor: "2 поверх",
  city: "Ужгород",
  region: "Закарпатська область",
  postal: "88000",
}; // company.contacts.addresses[0]
export const mapUrl = "https://maps.app.goo.gl/2CJCPMg7WB7ozJvLA";
export const instagram = "https://www.instagram.com/home.clinic_mistodent/"; // socials, confirmed

// W-F005. day: 0 = Sunday … 6 = Saturday (JS getDay order)
export interface DayHours { day: number; short: string; long: string; open: string; close: string; }
export const week: DayHours[] = [
  { day: 1, short: "Пн", long: "Понеділок", open: "9:00", close: "20:00" },
  { day: 2, short: "Вт", long: "Вівторок", open: "9:00", close: "20:00" },
  { day: 3, short: "Ср", long: "Середа", open: "9:00", close: "20:00" },
  { day: 4, short: "Чт", long: "Четвер", open: "9:00", close: "20:00" },
  { day: 5, short: "Пт", long: "П'ятниця", open: "9:00", close: "20:00" },
  { day: 6, short: "Сб", long: "Субота", open: "9:00", close: "18:00" },
  { day: 0, short: "Нд", long: "Неділя", open: "10:00", close: "17:00" },
];
export const hoursLine = "Пн–Пт 9:00–20:00, Сб 9:00–18:00, Нд 10:00–17:00";

export const nav = [
  { href: "#directions", label: "Послуги" },
  { href: "#kids", label: "Дітям" },
  { href: "#doctors", label: "Лікарі" },
  { href: "#cost", label: "Ціни" },
  { href: "#visit", label: "Контакти" },
];

export const FUTURE = "Розділ у розробці";

// W-F006 grouped by the visitor's situation (ux/demo-home.md §5, concept.md «directions»)
export interface Situation {
  id: string; title: string; lead: string; services: string[]; anchor: { href: string; label: string };
  img: "dytyni" | "bolyt" | "nemaie" | "usmishka";
}
export const situations: Situation[] = [
  {
    id: "dytyni", title: "Дитині", img: "dytyni",
    lead: "Дитяча стоматологія без страху: приймає дитячий лікар-стоматолог, за потреби лікування уві сні.",
    services: ["Дитяча стоматологія"],
    anchor: { href: "#kids", label: "Як ми приймаємо дітей" },
  },
  {
    id: "bolyt", title: "Болить зуб", img: "bolyt",
    lead: "Лікування зубів і ясен, хірургія. Канали лікуємо під мікроскопом.",
    services: ["Лікування зубів", "Лікування ясен", "Хірургія"],
    anchor: { href: "#care", label: "Мікроскоп і технології" },
  },
  {
    id: "nemaie", title: "Немає зуба", img: "nemaie",
    lead: "Імплантація і протезування з власною зуботехнічною лабораторією. Оплата частинами.",
    services: ["Імплантація зубів", "Протезування зубів"],
    anchor: { href: "#cost", label: "Вартість і оплата частинами" },
  },
  {
    id: "usmishka", title: "Хочу гарну усмішку", img: "usmishka",
    lead: "Офісне відбілювання Beyond і виправлення прикусу в ортодонта.",
    services: ["Відбілювання зубів", "Виправлення прикусу"],
    anchor: { href: "#cost", label: "Ціни на відбілювання" },
  },
];

// Keeps initials together: «Мельничук І. В.» never breaks before «В.»
const nb = (s: string) => s.replace(/ (?=[А-ЯІЇЄҐ]\.)/g, "\u00a0");

// W-F012 — six doctors (photos from the clinic site) and six team members
export const doctors = [
  { name: "Яцик К. М.", role: "Лікар-ортодонт", img: "jacyk" as const },
  { name: "Тєняєва Г. В.", role: "Лікар терапевт-ортопед", img: "tenyaeva" as const },
  { name: "Лукач Я. Я.", role: "Лікар-пародонтолог", img: "lukach" as const },
  { name: "Безносков Я. О.", role: "Лікар-хірург, імплантолог", img: "beznoskov" as const },
  { name: "Мельничук І. В.", role: "Дитячий лікар-стоматолог", img: "melnychuk" as const },
  { name: "Харієнко В. В.", role: "Лікар-ортопед, куратор", img: "harienko" as const },
].map((d) => ({ ...d, name: nb(d.name) }));

export const team = [
  { name: "Зінченко К. М.", role: "Керівник філії" },
  { name: "Легеза Л. С.", role: "Старший адміністратор" },
  { name: "Пида Я. В.", role: "Адміністратор" },
  { name: "Паращенко Л. І.", role: "Адміністратор" },
  { name: "Марканич А.", role: "Старший асистент" },
  { name: "Шорбан У. П.", role: "Асистент стоматолога" },
].map((t) => ({ ...t, name: nb(t.name) }));

// W-F035 — published (incomplete) price list, UAH
export const prices = [
  { name: "Розширена консультація", sum: "600 грн" },
  { name: "КТ однієї щелепи", sum: "550 грн" },
  { name: "Реставрація", sum: "від 1 166 грн" },
  { name: "Лікування каналів під мікроскопом", sum: "від 3 950 грн" },
  { name: "Коронка на цирконієвому абатменті CAD/CAM", sum: "10 590–19 280 грн" },
  { name: "Офісне відбілювання Beyond, 1 щелепа", sum: "4 500 грн" },
  { name: "Лікування уві сні", sum: "6 500 грн за годину" },
];

export const futureServices = [
  "Лікування зубів", "Лікування ясен", "Протезування зубів", "Відбілювання зубів",
  "Імплантація зубів", "Дитяча стоматологія", "Хірургія", "Виправлення прикусу",
];
