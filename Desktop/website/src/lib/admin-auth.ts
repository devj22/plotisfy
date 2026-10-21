import { NextRequest, NextResponse } from "next/server";

/** True when the request carries the admin session cookie set by /api/auth/login. */
export function isAdmin(req: NextRequest): boolean {
  const expected = process.env.ADMIN_SESSION_TOKEN;
  return !!expected && req.cookies.get("admin_session")?.value === expected;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
