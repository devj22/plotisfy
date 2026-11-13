import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, unauthorized } from "@/lib/admin-auth";

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

/**
 * Public lead capture used by the site's enquiry forms.
 * Returns { ok: true, leadId } only once the lead is saved. When the client
 * sends a submissionId, a repeat of the same submission returns the existing
 * lead with duplicate: true instead of saving it again.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = str(body.name, 80);
    const phone = str(body.phone, 20);
    const submissionId = UUID_RE.test(str(body.submissionId, 36)) ? str(body.submissionId, 36) : "";

    if (name.length < 2 || !/^\+?[\d\s-]{8,20}$/.test(phone) || phone.replace(/\D/g, "").length < 8) {
      return NextResponse.json({ error: "validation" }, { status: 400 });
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
        budgetRange: str(body.budgetRange, 120),
        message: str(body.message, 2000),
        leadStatus: "new",
        source: str(body.source, 60),
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
