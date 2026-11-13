import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { budgetOption, normaliseMobile, validateEnquiry, type EnquiryInput } from "@/lib/enquiry";

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const clickId = (v: unknown) => str(v).replace(/[^A-Za-z0-9_\-.]/g, "");

/**
 * Shortlist enquiry from /land-near-mumbai.
 *
 * - 201 { ok, leadId }            saved (or already saved: duplicate: true, 200)
 * - 422 { error: "below_budget" } budget under the qualifier; nothing is saved
 * - 400 { error, fields }         validation failed; nothing is saved
 *
 * leadId is the client's submissionId, a random UUID with no personal data,
 * which the page also uses as the Google Ads transaction_id.
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (str(body.website)) return NextResponse.json({ error: "rejected" }, { status: 400 });

  const input: EnquiryInput = {
    submissionId: str(body.submissionId, 36),
    name: str(body.name, 80),
    mobile: str(body.mobile, 20),
    location: str(body.location),
    intendedUse: str(body.intendedUse),
    timeline: str(body.timeline),
    budget: str(body.budget),
    landArea: str(body.landArea, 100),
  };

  const fields = validateEnquiry(input);
  if (Object.keys(fields).length > 0) {
    return NextResponse.json({ error: "validation", fields }, { status: 400 });
  }

  const budget = budgetOption(input.budget)!;
  if (!budget.eligible) {
    return NextResponse.json({ error: "below_budget" }, { status: 422 });
  }

  try {
    const existing = await prisma.lead.findFirst({
      where: { submissionId: input.submissionId },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ ok: true, leadId: input.submissionId, duplicate: true });
    }

    const a = (body.attribution ?? {}) as Record<string, unknown>;
    await prisma.lead.create({
      data: {
        name: input.name,
        phone: normaliseMobile(input.mobile)!,
        locationPreference: input.location,
        budgetRange: budget.label,
        intendedUse: input.intendedUse,
        timeline: input.timeline,
        landArea: input.landArea,
        message: [
          "Shortlist request (land near Mumbai)",
          `Use: ${input.intendedUse}`,
          `Timeline: ${input.timeline}`,
          input.landArea && `Area: ${input.landArea}`,
        ].filter(Boolean).join(" · "),
        source: "land-near-mumbai",
        landingPage: str(a.landing_page) || "/land-near-mumbai",
        submissionId: input.submissionId,
        utmSource: str(a.utm_source),
        utmMedium: str(a.utm_medium),
        utmCampaign: str(a.utm_campaign),
        utmTerm: str(a.utm_term),
        utmContent: str(a.utm_content),
        gclid: clickId(a.gclid),
        gbraid: clickId(a.gbraid),
        wbraid: clickId(a.wbraid),
        leadStatus: "new",
      },
    });
    return NextResponse.json({ ok: true, leadId: input.submissionId }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
