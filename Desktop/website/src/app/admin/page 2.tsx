"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { LEADS } from "@/lib/data";
import type { Property } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  Building2,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Phone,
  MessageCircle,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [dbProperties, setDbProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data: Property[]) => setDbProperties(Array.isArray(data) ? data : []))
      .catch(() => setDbProperties([]));
  }, []);

  const totalProperties = dbProperties.filter((p) => p.published).length;
  const availableProperties = dbProperties.filter((p) => p.status === "available").length;
  const totalLeads = LEADS.length;
  const newLeads = LEADS.filter((l) => l.leadStatus === "new").length;
  const hotLeads = LEADS.filter((l) => l.leadScore >= 80).length;
  const missedFollowUps = 2;
  const siteVisitsPlanned = LEADS.filter((l) => l.leadStatus === "site_visit_planned").length;
  const inNegotiation = LEADS.filter((l) => l.leadStatus === "negotiation").length;

  const recentLeads = LEADS.slice(0, 5);

  const leadStatusColor: Record<string, string> = {
    new: "bg-[#2D7A4F]/10 text-[#2D7A4F]",
    contacted: "bg-[#0D2F5B]/10 text-[#0D2F5B]",
    interested: "bg-[#B86A3C]/10 text-[#B86A3C]",
    site_visit_planned: "bg-purple-100 text-purple-700",
    site_visit_done: "bg-blue-100 text-blue-700",
    negotiation: "bg-yellow-100 text-yellow-700",
    closed: "bg-[#2D7A4F]/20 text-[#2D7A4F]",
    lost: "bg-red-100 text-red-500",
  };

  const leadStatusLabel: Record<string, string> = {
    new: "New",
    contacted: "Contacted",
    interested: "Interested",
    site_visit_planned: "Visit Planned",
    site_visit_done: "Visit Done",
    negotiation: "Negotiation",
    closed: "Closed",
    lost: "Lost",
  };

  return (
    <AdminLayout currentPath="/admin">
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#0D2F5B] text-2xl font-bold">Dashboard</h1>
            <p className="text-[#6B7B94] text-sm">Good morning! Here's what's happening today.</p>
          </div>
          <Link
            href="/admin/leads/new"
            className="flex items-center gap-2 bg-[#0D2F5B] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#0a2347] transition-colors"
          >
            + Add Lead
          </Link>
        </div>

        {/* Alerts */}
        {(missedFollowUps > 0 || newLeads > 0) && (
          <div className="space-y-2">
            {missedFollowUps > 0 && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">
                  {missedFollowUps} missed follow-ups from yesterday.{" "}
                  <Link href="/admin/leads?filter=missed" className="underline">
                    View now
                  </Link>
                </p>
              </div>
            )}
            {newLeads > 0 && (
              <div className="flex items-center gap-3 bg-[#2D7A4F]/8 border border-[#2D7A4F]/20 rounded-xl px-4 py-3">
                <Star className="w-4 h-4 text-[#2D7A4F] flex-shrink-0" />
                <p className="text-[#2D7A4F] text-sm font-medium">
                  {newLeads} new unassigned leads.{" "}
                  <Link href="/admin/leads?filter=new" className="underline">
                    Assign now
                  </Link>
                </p>
              </div>
            )}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Active Listings"
            value={String(availableProperties)}
            subtitle={`${totalProperties} total published`}
            icon={Building2}
            iconBg="bg-[#0D2F5B]/10"
            iconColor="text-[#0D2F5B]"
            trend="+2 this week"
            href="/admin/properties"
          />
          <KPICard
            title="Total Leads"
            value={String(totalLeads)}
            subtitle={`${newLeads} new today`}
            icon={Users}
            iconBg="bg-[#B86A3C]/10"
            iconColor="text-[#B86A3C]"
            trend={`${hotLeads} hot leads`}
            href="/admin/leads"
          />
          <KPICard
            title="Site Visits"
            value={String(siteVisitsPlanned)}
            subtitle="Planned this week"
            icon={Calendar}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            href="/admin/site-visits"
          />
          <KPICard
            title="Negotiation"
            value={String(inNegotiation)}
            subtitle="Active deals"
            icon={TrendingUp}
            iconBg="bg-[#2D7A4F]/10"
            iconColor="text-[#2D7A4F]"
            trend="2 closing this month"
            href="/admin/leads?filter=negotiation"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Leads */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2DDD6]">
            <div className="flex items-center justify-between p-5 border-b border-[#E2DDD6]">
              <h2 className="text-[#0D2F5B] font-bold">Recent Leads</h2>
              <Link
                href="/admin/leads"
                className="text-xs text-[#0D2F5B] font-semibold hover:text-[#B86A3C] transition-colors flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-[#F7F3ED]">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="p-4 hover:bg-[#F7F3ED]/50 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#0D2F5B] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#162338] text-sm font-semibold">{lead.name}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              leadStatusColor[lead.leadStatus]
                            }`}
                          >
                            {leadStatusLabel[lead.leadStatus]}
                          </span>
                        </div>
                        <div className="text-[#6B7B94] text-xs mt-0.5">
                          {lead.locationPreference} · {lead.budgetRange} · {lead.purpose}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Lead Score */}
                      <div
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          lead.leadScore >= 80
                            ? "bg-[#2D7A4F]/10 text-[#2D7A4F]"
                            : lead.leadScore >= 60
                            ? "bg-[#B86A3C]/10 text-[#B86A3C]"
                            : "bg-[#6B7B94]/10 text-[#6B7B94]"
                        }`}
                      >
                        {lead.leadScore}
                      </div>
                      <a
                        href={`tel:${lead.phone}`}
                        className="p-1.5 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#0D2F5B] hover:border-[#0D2F5B] transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                        className="p-1.5 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#25D366] hover:border-[#25D366] transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="p-1.5 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#0D2F5B] hover:border-[#0D2F5B] transition-colors"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Lead Pipeline */}
            <div className="bg-white rounded-2xl border border-[#E2DDD6] p-5">
              <h2 className="text-[#0D2F5B] font-bold mb-4">Lead Pipeline</h2>
              <div className="space-y-2.5">
                {[
                  { label: "New", count: LEADS.filter((l) => l.leadStatus === "new").length, color: "bg-[#2D7A4F]" },
                  { label: "Contacted", count: LEADS.filter((l) => l.leadStatus === "contacted").length, color: "bg-[#0D2F5B]" },
                  { label: "Interested", count: LEADS.filter((l) => l.leadStatus === "interested").length, color: "bg-[#B86A3C]" },
                  { label: "Site Visit", count: LEADS.filter((l) => l.leadStatus === "site_visit_planned" || l.leadStatus === "site_visit_done").length, color: "bg-purple-500" },
                  { label: "Negotiation", count: LEADS.filter((l) => l.leadStatus === "negotiation").length, color: "bg-yellow-500" },
                  { label: "Closed", count: LEADS.filter((l) => l.leadStatus === "closed").length, color: "bg-[#2D7A4F]" },
                ].map((stage) => (
                  <div key={stage.label} className="flex items-center gap-3">
                    <div className="w-20 text-xs text-[#6B7B94] text-right flex-shrink-0">{stage.label}</div>
                    <div className="flex-1 bg-[#F7F3ED] rounded-full h-2">
                      <div
                        className={`${stage.color} h-2 rounded-full transition-all`}
                        style={{ width: `${Math.max((stage.count / LEADS.length) * 100, 5)}%` }}
                      />
                    </div>
                    <div className="w-6 text-xs font-bold text-[#162338] flex-shrink-0">{stage.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hot Properties */}
            <div className="bg-white rounded-2xl border border-[#E2DDD6] p-5">
              <h2 className="text-[#0D2F5B] font-bold mb-4">Hot Listings</h2>
              <div className="space-y-3">
                {dbProperties.filter((p) => p.featured && p.published).slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <img
                      src={p.gallery[0]}
                      alt={p.title}
                      className="w-12 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[#162338] text-xs font-semibold truncate">{p.title}</p>
                      <p className="text-[#6B7B94] text-xs">{formatPrice(p.priceTotal)}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                        p.status === "available"
                          ? "bg-[#2D7A4F]/10 text-[#2D7A4F]"
                          : "bg-[#B86A3C]/10 text-[#B86A3C]"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href="/admin/properties"
                className="mt-4 text-xs text-[#0D2F5B] font-semibold hover:text-[#B86A3C] flex items-center gap-1 transition-colors"
              >
                Manage Properties <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-[#E2DDD6] p-5">
              <h2 className="text-[#0D2F5B] font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Add Property", href: "/admin/properties/new", icon: "🏗️" },
                  { label: "Add Lead", href: "/admin/leads/new", icon: "👤" },
                  { label: "Schedule Visit", href: "/admin/site-visits/new", icon: "📅" },
                  { label: "Write Blog", href: "/admin/content/blogs/new", icon: "✍️" },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#F7F3ED] hover:bg-[#E2DDD6] transition-colors text-center"
                  >
                    <span className="text-xl">{action.icon}</span>
                    <span className="text-xs font-semibold text-[#162338]">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  trend?: string;
  href: string;
}

function KPICard({ title, value, subtitle, icon: Icon, iconBg, iconColor, trend, href }: KPICardProps) {
  return (
    <Link href={href} className="bg-white rounded-2xl border border-[#E2DDD6] p-5 hover:shadow-md transition-shadow block">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <ArrowRight className="w-4 h-4 text-[#E2DDD6]" />
      </div>
      <div className="text-[#0D2F5B] text-2xl font-bold mb-0.5">{value}</div>
      <div className="text-[#162338] text-sm font-medium">{title}</div>
      <div className="text-[#6B7B94] text-xs mt-1">{subtitle}</div>
      {trend && (
        <div className="mt-2 text-xs text-[#2D7A4F] font-medium">{trend}</div>
      )}
    </Link>
  );
}
