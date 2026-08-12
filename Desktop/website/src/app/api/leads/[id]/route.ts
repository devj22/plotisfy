import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { leadStatus, feedback } = body;

    const data: { leadStatus?: string; feedback?: string } = {};
    if (leadStatus !== undefined) data.leadStatus = String(leadStatus);
    if (feedback !== undefined) data.feedback = String(feedback);

    const lead = await prisma.lead.update({
      where: { id },
      data,
    });

    return NextResponse.json(lead);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
