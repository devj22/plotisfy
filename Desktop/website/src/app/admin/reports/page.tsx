"use client";

import { useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { LEAD_STATUS_LABELS, isSiteVisit, useAdminLeads, type AdminLead } from "@/lib/admin-leads";

const SOURCE_LABELS: Record<string, string> = {
  "land-near-mumbai": "Ad landing page",
  home_hero_form: "Homepage hero",
  home_enquiry_form: "Homepage enquiry",
  site_popup: "Popup",
  mobile_enquiry: "Mobile enquiry",
  price_unlock_card: "Price unlock (card)",
  price_unlock_sidebar: "Price unlock (sidebar)",
  price_unlock_modal: "Price unlock (modal)",
  site_visit: "Book site visit",
};

const RANGES = [
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
  { value: 0, label: "All time" },
];

function countBy(leads: AdminLead[], key: (l: AdminLead) => string) {
  const m = new Map<string, number>();
  for (const l of leads) {
    const k = key(l) || "Not set";
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function Breakdown({ title, rows, total }: { title: string; rows: [string, number][]; total: number }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2DDD6] p-5">
      <h2 className="text-[#0D2F5B] font-bold mb-4">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-[#6B7B94] text-sm">No data.</p>
      ) : (
        <ul className="space-y-2.5">
          {rows.map(([label, n]) => (
            <li key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#162338]">{label}</span>
                <span className="text-[#6B7B94] tabular-nums">{n} · {Math.round((n / total) * 100)}%</span>
              </div>
              <div className="h-2 bg-[#F7F3ED] rounded-full overflow-hidden">
                <div className="h-full bg-[#0D2F5B] rounded-full" style={{ width: `${(n / total) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ReportsPage() {
  const { leads: all, loading, error } = useAdminLeads();
  const [days, setDays] = useState(30);

  const leads = useMemo(() => {
    if (!days) return all;
    const since = Date.now() - days * 86400000;
    return all.filter((l) => new Date(l.createdAt).getTime() >= since);
  }, [all, days]);

  const total = leads.length;
  const fromAds = leads.filter((l) => l.gclid || l.gbraid || l.wbraid || l.utmSource).length;
  const visits = leads.filter(isSiteVisit).length;
  const closed = leads.filter((l) => l.leadStatus === "closed").length;

  return (
    <AdminLayout currentPath="/admin/reports">
      <div className="p-4 md:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[#0D2F5B] text-2xl font-bold">Reports</h1>
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm bg-white text-[#162338]">
            {RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>}

        {loading ? (
          <p className="text-[#6B7B94] text-sm">Loading…</p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Leads", value: total },
                { label: "From ads / campaigns", value: fromAds },
                { label: "Site visit requests", value: visits },
                { label: "Closed", value: closed },
              ].map((k) => (
                <div key={k.label} className="bg-white rounded-2xl border border-[#E2DDD6] p-4">
                  <div className="text-[#6B7B94] text-xs font-semibold">{k.label}</div>
                  <div className="text-[#0D2F5B] text-2xl font-bold tabular-nums mt-1">{k.value}</div>
                </div>
              ))}
            </div>

            {total > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Breakdown title="By form" total={total} rows={countBy(leads, (l) => SOURCE_LABELS[l.source ?? ""] ?? l.source ?? "")} />
                <Breakdown title="By status" total={total} rows={countBy(leads, (l) => LEAD_STATUS_LABELS[l.leadStatus] ?? l.leadStatus)} />
                <Breakdown title="By budget" total={total} rows={countBy(leads, (l) => l.budgetRange)} />
                <Breakdown title="By purpose" total={total} rows={countBy(leads, (l) => l.intendedUse ?? "")} />
                <Breakdown title="By campaign source" total={total} rows={countBy(leads, (l) => l.utmSource || ((l.gclid || l.gbraid || l.wbraid) ? "google (click ID)" : "Direct / organic"))} />
                <Breakdown title="By location preference" total={total} rows={countBy(leads, (l) => l.locationPreference)} />
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
