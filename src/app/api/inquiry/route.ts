import { buildAmoFormData, amoForm, validateInquiry, type InquiryPayload } from "@/lib/amo";

/** Nothing here may be cached — every enquiry has to reach amoCRM. */
export const dynamic = "force-dynamic";

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];

  return typeof value === "string" ? value.slice(0, 2000) : "";
}

export async function POST(request: Request) {
  let raw: Record<string, unknown>;

  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const payload: InquiryPayload = {
    name: readString(raw, "name"),
    email: readString(raw, "email"),
    phone: readString(raw, "phone"),
    tour: readString(raw, "tour"),
    tourLabel: readString(raw, "tourLabel"),
    people: readString(raw, "people"),
    date: readString(raw, "date"),
    message: readString(raw, "message"),
    locale: readString(raw, "locale"),
    page: readString(raw, "page") || request.headers.get("referer") || ""
  };

  if (!validateInquiry(payload)) {
    return Response.json({ ok: false, error: "invalid_payload" }, { status: 422 });
  }

  try {
    const response = await fetch(amoForm.endpoint, {
      method: "POST",
      body: buildAmoFormData(payload),
      signal: AbortSignal.timeout(12_000)
    });

    // amo answers 200 even when it refuses the lead, so the body decides.
    const result = response.ok
      ? ((await response.json()) as { error_code?: number })
      : null;

    if (!result || result.error_code !== 0) {
      console.error(
        `amoCRM rejected the lead: HTTP ${response.status}, error_code ${result?.error_code}`
      );

      return Response.json({ ok: false, error: "crm_rejected" }, { status: 502 });
    }
  } catch (error) {
    console.error("amoCRM request failed", error);

    return Response.json({ ok: false, error: "crm_unreachable" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
