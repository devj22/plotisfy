import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/admin-auth";
import { checkQualifier } from "@/lib/lead-qualifier";

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return unauthorized();
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(leads);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load leads" }, { status: 500 });
  }
}

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const clickId = (v: unknown) => str(v, 200).replace(/[^A-Za-z0-9_\-.]/g, "");
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const OBJECT_ID_RE = /^[0-9a-f]{24}$/i;

/**
 * Public lead capture used by the site's enquiry forms.
 * Returns { ok: true, leadId } only once the lead is saved. When the client
 * sends a submissionId, a repeat of the same submission returns the existing
 * lead with duplicate: true instead of saving it again.
 *
 * Every form asks the land purchase budget first. Budgets below ₹2.5 crore get
 * 422 { error: "below_budget" } and nothing is saved. Eligible leads must give
 * purpose and required land area; price-unlock leads must name a property.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = str(body.name, 80);
    const phone = str(body.phone, 20);
    const submissionId = UUID_RE.test(str(body.submissionId, 36)) ? str(body.submissionId, 36) : "";

    if (name.length < 2 || !/^\+?[\d\s-]{8,20}$/.test(phone) || phone.replace(/\D/g, "").length < 8) {
      return NextResponse.json({ error: "validation", field: "phone" }, { status: 400 });
    }

    const q = checkQualifier({
      budget: str(body.budget, 40),
      purpose: str(body.purpose, 40),
      areaValue: str(body.areaValue, 20),
      areaUnit: str(body.areaUnit, 20),
      areaGuidance: !!str(body.areaGuidance, 5),
    });
    if (!q.ok) {
      return q.reason === "below_budget"
        ? NextResponse.json({ error: "below_budget" }, { status: 422 })
        : NextResponse.json({ error: "validation", field: q.field }, { status: 400 });
    }

    const source = str(body.source, 60);
    const propertyIdRaw = str(body.propertyId, 24);
    let property: { id: string; title: string; propertyCode: string } | null = null;
    if (OBJECT_ID_RE.test(propertyIdRaw)) {
      property = await prisma.property.findUnique({
        where: { id: propertyIdRaw },
        select: { id: true, title: true, propertyCode: true },
      });
    }
    if (source.startsWith("price_unlock") && !property) {
      return NextResponse.json({ error: "validation", field: "propertyId" }, { status: 400 });
    }

    if (submissionId) {
      const existing = await prisma.lead.findFirst({ where: { submissionId }, select: { id: true } });
      if (existing) return NextResponse.json({ ok: true, leadId: submissionId, duplicate: true });
    }

    const a = (body.attribution ?? {}) as Record<string, unknown>;
    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        email: str(body.email, 120),
        locationPreference: str(body.locationPreference, 120),
        budgetRange: q.budgetLabel,
        intendedUse: q.purposeLabel,
        landArea: q.landArea,
        propertyId: property?.id ?? "",
        propertyName: property ? [property.title, property.propertyCode].filter(Boolean).join(" · ") : "",
        message: str(body.message, 2000),
        leadStatus: "new",
        source,
        submissionId,
        landingPage: str(a.landing_page, 200),
        utmSource: str(a.utm_source, 200),
        utmMedium: str(a.utm_medium, 200),
        utmCampaign: str(a.utm_campaign, 200),
        utmTerm: str(a.utm_term, 200),
        utmContent: str(a.utm_content, 200),
        gclid: clickId(a.gclid),
        gbraid: clickId(a.gbraid),
        wbraid: clickId(a.wbraid),
      },
    });

    return NextResponse.json({ ok: true, leadId: submissionId || lead.id }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
