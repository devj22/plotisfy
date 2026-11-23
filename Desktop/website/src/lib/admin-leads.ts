"use client";

import { useEffect, useState } from "react";

export interface AdminLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  locationPreference: string;
  budgetRange: string;
  message: string;
  leadStatus: string;
  feedback: string;
  intendedUse?: string;
  landArea?: string;
  propertyName?: string;
  visitDate?: string;
  source?: string;
  utmSource?: string;
  utmCampaign?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  createdAt: string;
}

export const LEAD_STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  interested: "Interested",
  site_visit_planned: "Visit Planned",
  site_visit_done: "Visit Done",
  negotiation: "Negotiation",
  closed: "Closed",
  lost: "Lost",
};

/** Loads all leads for admin pages. `error` is set if the request fails (e.g. session expired). */
export function useAdminLeads() {
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/leads")
      .then(async (r) => {
        if (r.status === 401) throw new Error("Your admin session has expired. Please log in again.");
        if (!r.ok) throw new Error("Couldn't load leads. Please refresh.");
        const data = await r.json();
        setLeads(Array.isArray(data) ? data : []);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, leadStatus: string) {
    const r = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadStatus }),
    });
    if (r.ok) setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, leadStatus } : l)));
    else alert("Couldn't update the status. Please try again.");
  }

  return { leads, loading, error, updateStatus };
}

export const isSiteVisit = (l: AdminLead) =>
  l.source === "site_visit" || l.leadStatus === "site_visit_planned" || l.leadStatus === "site_visit_done";
