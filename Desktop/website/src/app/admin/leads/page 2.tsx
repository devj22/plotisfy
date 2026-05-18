"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { LEADS } from "@/lib/data";
import { Lead, LeadStatus } from "@/types";
import {
  Search,
  Filter,
  Phone,
  MessageCircle,
  Calendar,
  ChevronDown,
  MoreVertical,
  User,
  MapPin,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  Download,
  SlidersHorizontal,
  CheckCircle,
  X,
} from "lucide-react";
import Link from "next/link";

const ALL_STATUSES: LeadStatus[] = [
  "new", "contacted", "interested", "site_visit_planned",
  "site_visit_done", "negotiation", "closed", "lost",
];

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new: { label: "New", color: "text-[#2D7A4F]", bg: "bg-[#2D7A4F]/10" },
  contacted: { label: "Contacted", color: "text-[#0D2F5B]", bg: "bg-[#0D2F5B]/10" },
  interested: { label: "Interested", color: "text-[#B86A3C]", bg: "bg-[#B86A3C]/10" },
  site_visit_planned: { label: "Visit Planned", color: "text-purple-600", bg: "bg-purple-100" },
  site_visit_done: { label: "Visit Done", color: "text-blue-600", bg: "bg-blue-100" },
  negotiation: { label: "Negotiation", color: "text-yellow-700", bg: "bg-yellow-100" },
  closed: { label: "Closed ✓", color: "text-[#2D7A4F]", bg: "bg-[#2D7A4F]/20" },
  lost: { label: "Lost", color: "text-red-500", bg: "bg-red-100" },
};

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filtered = LEADS.filter((l) => {
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.leadStatus === statusFilter;
    const matchLocation =
      !locationFilter || l.locationPreference.toLowerCase() === locationFilter.toLowerCase();
    const matchAssignee =
      !assigneeFilter || l.assignedTo === assigneeFilter;
    return matchSearch && matchStatus && matchLocation && matchAssignee;
  });

  return (
    <AdminLayout currentPath="/admin/leads">
      <div className="flex h-full">
        {/* Main Content */}
        <div className={`flex-1 min-w-0 ${selectedLead ? "lg:mr-0" : ""}`}>
          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-[#0D2F5B] text-2xl font-bold">Leads & CRM</h1>
                <p className="text-[#6B7B94] text-sm">
                  {filtered.length} leads · {LEADS.filter((l) => l.leadStatus === "new").length} new
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 border border-[#E2DDD6] text-[#6B7B94] text-sm font-medium px-3 py-2 rounded-lg hover:bg-[#F7F3ED] transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <Link
                  href="/admin/leads/new"
                  className="flex items-center gap-1.5 bg-[#0D2F5B] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#0a2347] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Lead
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-[#E2DDD6] p-4">
              <div className="flex flex-wrap gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7B94]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, phone, email..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#E2DDD6] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "all")}
                  className="text-sm border border-[#E2DDD6] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] text-[#162338]"
                >
                  <option value="all">All Status</option>
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_CONFIG[s].label}
                    </option>
                  ))}
                </select>

                {/* Location Filter */}
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="text-sm border border-[#E2DDD6] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] text-[#162338]"
                >
                  <option value="">All Locations</option>
                  <option value="Panvel">Panvel</option>
                  <option value="Khalapur">Khalapur</option>
                </select>

                {(search || statusFilter !== "all" || locationFilter) && (
                  <button
                    onClick={() => { setSearch(""); setStatusFilter("all"); setLocationFilter(""); }}
                    className="flex items-center gap-1.5 text-xs text-[#B86A3C] border border-[#B86A3C]/20 px-3 py-2 rounded-lg hover:bg-[#B86A3C]/5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
              </div>

              {/* Status Tab Pills */}
              <div className="flex gap-2 mt-3 overflow-x-auto">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                    statusFilter === "all"
                      ? "bg-[#0D2F5B] text-white"
                      : "bg-[#F7F3ED] text-[#6B7B94] hover:bg-[#E2DDD6]"
                  }`}
                >
                  All ({LEADS.length})
                </button>
                {ALL_STATUSES.map((s) => {
                  const count = LEADS.filter((l) => l.leadStatus === s).length;
                  if (count === 0) return null;
                  const cfg = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                        statusFilter === s ? `${cfg.bg} ${cfg.color}` : "bg-[#F7F3ED] text-[#6B7B94] hover:bg-[#E2DDD6]"
                      }`}
                    >
                      {cfg.label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-2xl border border-[#E2DDD6] overflow-hidden">
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <User className="w-10 h-10 text-[#E2DDD6] mx-auto mb-3" />
                  <p className="text-[#6B7B94] font-medium">No leads found</p>
                  <p className="text-[#6B7B94] text-sm mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <>
                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-[1fr_120px_100px_80px_120px_100px] gap-4 px-5 py-3 bg-[#F7F3ED] border-b border-[#E2DDD6] text-xs font-semibold text-[#6B7B94] uppercase tracking-wider">
                    <div>Lead</div>
                    <div>Location / Budget</div>
                    <div>Status</div>
                    <div>Score</div>
                    <div>Assigned</div>
                    <div>Actions</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-[#F7F3ED]">
                    {filtered.map((lead) => {
                      const cfg = STATUS_CONFIG[lead.leadStatus];
                      return (
                        <div
                          key={lead.id}
                          className="px-4 md:px-5 py-4 hover:bg-[#F7F3ED]/50 transition-colors"
                        >
                          <div className="md:grid md:grid-cols-[1fr_120px_100px_80px_120px_100px] md:gap-4 md:items-center">
                            {/* Lead Info */}
                            <div className="flex items-center gap-3 mb-3 md:mb-0">
                              <div className="w-9 h-9 bg-[#0D2F5B] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </div>
                              <div>
                                <div className="text-[#162338] text-sm font-semibold">{lead.name}</div>
                                <div className="text-[#6B7B94] text-xs">{lead.phone}</div>
                                {lead.interestedPropertyTitle && (
                                  <div className="text-[#B86A3C] text-xs truncate max-w-48">
                                    📍 {lead.interestedPropertyTitle}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Location / Budget */}
                            <div className="hidden md:block">
                              <div className="text-[#162338] text-xs font-medium">{lead.locationPreference}</div>
                              <div className="text-[#6B7B94] text-xs">{lead.budgetRange}</div>
                            </div>

                            {/* Status */}
                            <div className="hidden md:block">
                              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${cfg.bg} ${cfg.color}`}>
                                {cfg.label}
                              </span>
                            </div>

                            {/* Score */}
                            <div className="hidden md:block">
                              <div
                                className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold ${
                                  lead.leadScore >= 80
                                    ? "bg-[#2D7A4F]/15 text-[#2D7A4F]"
                                    : lead.leadScore >= 60
                                    ? "bg-[#B86A3C]/15 text-[#B86A3C]"
                                    : "bg-[#6B7B94]/10 text-[#6B7B94]"
                                }`}
                              >
                                {lead.leadScore}
                              </div>
                            </div>

                            {/* Assigned */}
                            <div className="hidden md:block">
                              <div className="text-[#162338] text-xs">{lead.assignedTo || "—"}</div>
                              <div className="text-[#6B7B94] text-xs">
                                {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`tel:${lead.phone}`}
                                className="p-1.5 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#0D2F5B] hover:border-[#0D2F5B] transition-colors"
                                title="Call"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                                className="p-1.5 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#25D366] hover:border-[#25D366] transition-colors"
                                title="WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="p-1.5 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#B86A3C] hover:border-[#B86A3C] transition-colors"
                                title="View details"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Lead Detail Panel */}
        {selectedLead && (
          <LeadDetailPanel
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
}

function LeadDetailPanel({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [newNote, setNewNote] = useState("");
  const [status, setStatus] = useState<LeadStatus>(lead.leadStatus);
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[440px] bg-white border-l border-[#E2DDD6] z-40 flex flex-col shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-[#E2DDD6] sticky top-0 bg-white z-10">
        <h3 className="text-[#0D2F5B] font-bold">Lead Detail</h3>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[#F7F3ED] transition-colors"
        >
          <X className="w-4 h-4 text-[#6B7B94]" />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Lead Identity */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#0D2F5B] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1">
            <h4 className="text-[#0D2F5B] font-bold text-lg">{lead.name}</h4>
            <a href={`tel:${lead.phone}`} className="text-[#6B7B94] text-sm hover:text-[#0D2F5B]">{lead.phone}</a>
            <div className="text-[#6B7B94] text-xs">{lead.email}</div>
          </div>
          <div
            className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${cfg.bg} ${cfg.color}`}
          >
            {cfg.label}
          </div>
        </div>

        {/* Lead Score */}
        <div className="bg-[#F7F3ED] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#6B7B94] text-xs font-medium">Lead Score</span>
            <span
              className={`font-bold text-lg ${
                lead.leadScore >= 80
                  ? "text-[#2D7A4F]"
                  : lead.leadScore >= 60
                  ? "text-[#B86A3C]"
                  : "text-[#6B7B94]"
              }`}
            >
              {lead.leadScore}/100
            </span>
          </div>
          <div className="bg-white rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                lead.leadScore >= 80 ? "bg-[#2D7A4F]" : lead.leadScore >= 60 ? "bg-[#B86A3C]" : "bg-[#6B7B94]"
              }`}
              style={{ width: `${lead.leadScore}%` }}
            />
          </div>
        </div>

        {/* Lead Details */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Location", value: lead.locationPreference },
            { label: "Budget", value: lead.budgetRange },
            { label: "Purpose", value: lead.purpose },
            { label: "Timeline", value: lead.timeline },
            { label: "Source", value: lead.sourcePage },
            { label: "Device", value: lead.deviceType },
          ].map((item) => (
            <div key={item.label} className="bg-[#F7F3ED] rounded-lg p-3">
              <div className="text-[#6B7B94] text-xs mb-0.5">{item.label}</div>
              <div className="text-[#162338] text-sm font-medium capitalize">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Interested Property */}
        {lead.interestedPropertyTitle && (
          <div className="bg-[#B86A3C]/8 border border-[#B86A3C]/20 rounded-xl p-4">
            <div className="text-[#B86A3C] text-xs font-medium mb-1">Interested In</div>
            <div className="text-[#162338] text-sm font-semibold">{lead.interestedPropertyTitle}</div>
          </div>
        )}

        {/* Update Status */}
        <div>
          <label className="block text-[#6B7B94] text-xs font-medium mb-2">Update Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as LeadStatus)}
            className="w-full text-sm border border-[#E2DDD6] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center justify-center gap-2 bg-[#0D2F5B] text-white text-sm font-semibold py-2.5 rounded-xl"
          >
            <Phone className="w-4 h-4" /> Call
          </a>
          <a
            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white text-sm font-semibold py-2.5 rounded-xl"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
          <button className="flex items-center justify-center gap-2 border border-[#E2DDD6] text-[#162338] text-sm font-medium py-2.5 rounded-xl hover:bg-[#F7F3ED] transition-colors col-span-2">
            <Calendar className="w-4 h-4" /> Schedule Follow-up
          </button>
          <Link
            href="/book-site-visit"
            className="flex items-center justify-center gap-2 border border-[#B86A3C] text-[#B86A3C] text-sm font-semibold py-2.5 rounded-xl hover:bg-[#B86A3C]/5 transition-colors col-span-2"
          >
            <Calendar className="w-4 h-4" /> Book Site Visit
          </Link>
        </div>

        {/* Notes */}
        <div>
          <h4 className="text-[#0D2F5B] text-sm font-bold mb-3">Notes</h4>
          {lead.notes && lead.notes.length > 0 ? (
            <div className="space-y-3 mb-3">
              {lead.notes.map((note) => (
                <div key={note.id} className="bg-[#F7F3ED] rounded-xl p-3">
                  <p className="text-[#162338] text-sm">{note.content}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-[#6B7B94]">
                    <span>{note.addedBy}</span>
                    <span>·</span>
                    <span>{new Date(note.addedAt).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6B7B94] text-sm mb-3">No notes yet.</p>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              className="flex-1 text-sm border border-[#E2DDD6] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]"
            />
            <button
              onClick={() => setNewNote("")}
              className="bg-[#0D2F5B] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#0a2347] transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* UTM Data */}
        {(lead.utmSource || lead.utmMedium) && (
          <div className="bg-[#F7F3ED] rounded-xl p-4">
            <div className="text-[#6B7B94] text-xs font-medium mb-2">Traffic Source</div>
            <div className="space-y-1 text-xs">
              {lead.utmSource && (
                <div className="flex justify-between">
                  <span className="text-[#6B7B94]">Source</span>
                  <span className="text-[#162338] font-medium">{lead.utmSource}</span>
                </div>
              )}
              {lead.utmMedium && (
                <div className="flex justify-between">
                  <span className="text-[#6B7B94]">Medium</span>
                  <span className="text-[#162338] font-medium">{lead.utmMedium}</span>
                </div>
              )}
              {lead.utmCampaign && (
                <div className="flex justify-between">
                  <span className="text-[#6B7B94]">Campaign</span>
                  <span className="text-[#162338] font-medium">{lead.utmCampaign}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

