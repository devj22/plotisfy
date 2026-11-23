"use client";

import { useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Calendar, Phone, MessageCircle } from "lucide-react";
import { LEAD_STATUS_LABELS, isSiteVisit, useAdminLeads } from "@/lib/admin-leads";

const fmtDate = (d?: string) =>
  d ? new Date(d.length === 10 ? `${d}T00:00:00` : d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function SiteVisitsPage() {
  const { leads, loading, error, updateStatus } = useAdminLeads();
  const [tab, setTab] = useState<"upcoming" | "all">("upcoming");
  const today = new Date().toISOString().slice(0, 10);

  const visits = useMemo(() => {
    const rows = leads.filter(isSiteVisit);
    const shown = tab === "upcoming"
      ? rows.filter((l) => l.leadStatus !== "site_visit_done" && l.leadStatus !== "closed" && l.leadStatus !== "lost" && (!l.visitDate || l.visitDate >= today))
      : rows;
    // Dated visits first (soonest first), then undated by newest request.
    return [...shown].sort((a, b) => {
      if (a.visitDate && b.visitDate) return a.visitDate.localeCompare(b.visitDate);
      if (a.visitDate) return -1;
      if (b.visitDate) return 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [leads, tab, today]);

  return (
    <AdminLayout currentPath="/admin/site-visits">
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[#0D2F5B] text-2xl font-bold">Site Visits</h1>
            <p className="text-[#6B7B94] text-sm">Requests from the Book Site Visit form, plus leads marked Visit Planned / Visit Done.</p>
          </div>
          <div className="flex bg-white border border-[#E2DDD6] rounded-xl p-1 text-sm">
            {(["upcoming", "all"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg font-semibold ${tab === t ? "bg-[#0D2F5B] text-white" : "text-[#6B7B94]"}`}>
                {t === "upcoming" ? "Upcoming / pending" : "All"}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>}

        <div className="bg-white rounded-2xl border border-[#E2DDD6] overflow-x-auto">
          {loading ? (
            <p className="p-6 text-[#6B7B94] text-sm">Loading…</p>
          ) : visits.length === 0 ? (
            <div className="p-10 text-center">
              <Calendar className="w-8 h-8 text-[#B86A3C] mx-auto mb-2" />
              <p className="text-[#6B7B94] text-sm">No site visit requests {tab === "upcoming" ? "pending" : "yet"}.</p>
            </div>
          ) : (
            <table className="w-full text-sm min-w-[820px]">
              <thead className="bg-[#F7F3ED] text-[#6B7B94] text-xs uppercase tracking-wide">
                <tr>
                  {["Preferred date", "Name", "Phone", "Location", "Budget", "Notes", "Requested", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD6]">
                {visits.map((l) => (
                  <tr key={l.id} className="align-top">
                    <td className="px-4 py-3 font-semibold text-[#0D2F5B] whitespace-nowrap">{l.visitDate ? fmtDate(l.visitDate) : <span className="text-[#6B7B94] font-normal">Not given</span>}</td>
                    <td className="px-4 py-3 text-[#162338] font-medium">{l.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <a href={`tel:${l.phone}`} className="text-[#0D2F5B] hover:underline flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{l.phone}</a>
                        <a href={`https://wa.me/${l.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}`} target="_blank" rel="noopener noreferrer" className="text-[#25D366]" aria-label="WhatsApp"><MessageCircle className="w-4 h-4" /></a>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#162338]">{l.locationPreference || "—"}</td>
                    <td className="px-4 py-3 text-[#162338] whitespace-nowrap">{l.budgetRange || "—"}</td>
                    <td className="px-4 py-3 text-[#6B7B94] max-w-[260px]">{l.message || "—"}</td>
                    <td className="px-4 py-3 text-[#6B7B94] whitespace-nowrap">{fmtDate(l.createdAt)}</td>
                    <td className="px-4 py-3">
                      <select value={l.leadStatus} onChange={(e) => updateStatus(l.id, e.target.value)} className="border border-[#E2DDD6] rounded-lg px-2 py-1.5 text-xs text-[#162338] bg-white">
                        {Object.entries(LEAD_STATUS_LABELS).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
