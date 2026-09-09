/**
 * amoCRM web form 1744102 (forms.amocrm.ru).
 *
 * The embed widget renders amo's own form inside an iframe, which would replace
 * the site's enquiry form. Instead the site keeps its own UI and posts to the
 * same queue endpoint the iframe uses, so leads still land in the CRM.
 *
 * The field names below are the `name` attributes of the published form and
 * have to match it exactly — re-check them after editing the form in amoCRM.
 */
export const amoForm = {
  endpoint: "https://forms.amocrm.ru/queue/add",
  id: "1744102",
  hash: "7b30da78f2906bfd48c43b7e8662572a",
  fields: {
    /** ФИО */
    name: "fields[name_1]",
    /** Телефон */
    phone: "fields[114709_1][61101]",
    /** Email */
    email: "fields[114711_1][61113]",
    /** Дата — amo expects the form locale format, DD.MM.YYYY */
    date: "fields[115135_2]",
    /** Сколько человек — numeric */
    people: "fields[115133_2]",
    /** Какой тур — select, values are amo option ids */
    tour: "fields[115127_2]",
    /** Сообщение клиента */
    note: "fields[note_2]"
  }
} as const;

/** Site tour slug → option id of the "Какой тур" select. */
export const amoTourOptions: Record<string, string> = {
  "song-kol-nomad-life": "61267",
  "kel-suu-expedition": "61271",
  "issyk-kul-and-jeti-oguz": "61275"
};

export type InquiryPayload = {
  name: string;
  email: string;
  phone: string;
  /** Site tour slug, "general", or empty when the form has no tour picker. */
  tour: string;
  /** Human readable tour name, used in the note when the slug has no amo option. */
  tourLabel: string;
  people: string;
  /** ISO date from <input type="date">, may be empty. */
  date: string;
  message: string;
  locale: string;
  /** Page the enquiry was sent from. */
  page: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInquiry(payload: InquiryPayload): boolean {
  return (
    payload.name.trim().length >= 2 &&
    emailPattern.test(payload.email.trim()) &&
    payload.message.trim().length >= 10
  );
}

/** `2026-07-14` → `14.07.2026`; anything unparseable is dropped. */
function toAmoDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());

  return match ? `${match[3]}.${match[2]}.${match[1]}` : "";
}

export function buildAmoFormData(payload: InquiryPayload): FormData {
  const body = new FormData();
  const { fields } = amoForm;

  body.set("form_id", amoForm.id);
  body.set("hash", amoForm.hash);
  body.set(
    "user_origin",
    JSON.stringify({
      datetime: new Date().toString(),
      timezone: "Asia/Bishkek",
      referer: payload.page
    })
  );

  body.set(fields.name, payload.name.trim());
  body.set(fields.email, payload.email.trim());
  body.set(fields.phone, payload.phone.trim());
  body.set(fields.date, toAmoDate(payload.date));
  // The site offers "8+"; the amo field only accepts digits.
  body.set(fields.people, payload.people.replace(/\D/g, ""));
  body.set(fields.tour, amoTourOptions[payload.tour] ?? "");

  const notes = [payload.message.trim()];

  if (payload.tourLabel) {
    notes.push(`Тур: ${payload.tourLabel}`);
  }

  notes.push(`Язык сайта: ${payload.locale}`, `Страница: ${payload.page}`);
  body.set(fields.note, notes.join(" | "));

  return body;
}
