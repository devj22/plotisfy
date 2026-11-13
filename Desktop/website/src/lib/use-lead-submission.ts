"use client";

import { useRef, useState } from "react";
import { captureAttribution } from "@/lib/attribution";
import { reportLeadSubmitted } from "@/lib/gtag";

export const LEAD_SAVE_ERROR =
  "We couldn't send your enquiry. Your details are still here. Please try again, or call +91 81696 93894.";

/**
 * Submits a lead to /api/leads and reports it only once the server confirms
 * the save. One submission id is kept per form instance and reused on retry,
 * so a resend after a lost response can't create a second lead or a second
 * conversion.
 */
export function useLeadSubmission(source: string) {
  const submissionId = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(payload: Record<string, string>): Promise<boolean> {
    if (loading) return false;
    submissionId.current ??= crypto.randomUUID();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, source, submissionId: submissionId.current, attribution: captureAttribution() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(res.status === 400 ? "Please check your name and phone number." : LEAD_SAVE_ERROR);
        return false;
      }
      if (!data.duplicate) reportLeadSubmitted(data.leadId, { lead_source: source });
      return true;
    } catch {
      setError(LEAD_SAVE_ERROR);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error };
}
