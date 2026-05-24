"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Property } from "@/types";
import { formatPrice, formatArea } from "@/lib/utils";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Star,
  MoreVertical,
  MapPin,
  ArrowUpRight,
  CheckCircle,
  X,
  Filter,
} from "lucide-react";
import Link from "next/link";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => setProperties(Array.isArray(data) ? data : []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = properties.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.propertyCode.toLowerCase().includes(search.toLowerCase());
    const matchLocation = !locationFilter || p.location === locationFilter;
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchLocation && matchStatus;
  });

  if (showWizard) {
    return (
      <AdminLayout currentPath="/admin/properties">
        <PropertyUploadWizard onCancel={() => setShowWizard(false)} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPath="/admin/properties">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[#0D2F5B] text-2xl font-bold">Properties</h1>
            <p className="text-[#6B7B94] text-sm">{loading ? "Loading..." : `${properties.length} total listings`}</p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 bg-[#0D2F5B] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#0a2347] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[#E2DDD6] p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7B94]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or code..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#E2DDD6] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]"
            />
          </div>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="text-sm border border-[#E2DDD6] rounded-lg px-3 py-2 focus:outline-none text-[#162338]"
          >
            <option value="">All Locations</option>
            <option value="Panvel">Panvel</option>
            <option value="Khalapur">Khalapur</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-[#E2DDD6] rounded-lg px-3 py-2 focus:outline-none text-[#162338]"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        {/* Properties Grid */}
        <div className="bg-white rounded-2xl border border-[#E2DDD6] overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[60px_1fr_100px_120px_100px_80px_100px] gap-4 px-5 py-3 bg-[#F7F3ED] border-b border-[#E2DDD6] text-xs font-semibold text-[#6B7B94] uppercase tracking-wider">
            <div>Photo</div>
            <div>Property</div>
            <div>Price</div>
            <div>Area</div>
            <div>Status</div>
            <div>Featured</div>
            <div>Actions</div>
          </div>

          <div className="divide-y divide-[#F7F3ED]">
            {filtered.map((p) => (
              <PropertyRow key={p.id} property={p} />
            ))}
          </div>

          {loading && (
            <div className="text-center py-12 text-[#6B7B94]">Loading properties...</div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-[#6B7B94]">No properties found. Add your first property using the button above.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function PropertyRow({ property: p }: { property: Property }) {
  const [featured, setFeatured] = useState(p.featured);
  const [published, setPublished] = useState(p.published);

  return (
    <div className="px-4 md:px-5 py-4 hover:bg-[#F7F3ED]/50 transition-colors">
      <div className="flex items-center gap-4 md:grid md:grid-cols-[60px_1fr_100px_120px_100px_80px_100px] md:gap-4">
        {/* Photo */}
        <img
          src={p.gallery[0]}
          alt={p.title}
          className="w-14 h-12 rounded-lg object-cover flex-shrink-0"
        />

        {/* Property Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-xs text-[#6B7B94] bg-[#F7F3ED] px-1.5 py-0.5 rounded">
              {p.propertyCode}
            </span>
            {!published && (
              <span className="text-xs text-[#B86A3C] bg-[#B86A3C]/10 px-1.5 py-0.5 rounded">Draft</span>
            )}
          </div>
          <p className="text-[#162338] text-sm font-semibold truncate">{p.title}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-[#B86A3C]" />
            <span className="text-[#6B7B94] text-xs">{p.village}, {p.location}</span>
          </div>
        </div>

        {/* Price */}
        <div className="hidden md:block">
          <div className="text-[#0D2F5B] text-sm font-bold">{formatPrice(p.priceTotal)}</div>
          <div className="text-[#6B7B94] text-xs">₹{p.pricePerSqft}/sqft</div>
        </div>

        {/* Area */}
        <div className="hidden md:block">
          <div className="text-[#162338] text-sm font-medium">{formatArea(p.areaSqft)}</div>
          <div className="text-[#6B7B94] text-xs">{p.areaGuntha} Guntha</div>
        </div>

        {/* Status */}
        <div className="hidden md:block">
          <span
            className={`text-xs px-2 py-1 rounded-full font-semibold ${
              p.status === "available"
                ? "bg-[#2D7A4F]/10 text-[#2D7A4F]"
                : p.status === "reserved"
                ? "bg-[#B86A3C]/10 text-[#B86A3C]"
                : "bg-[#6B7B94]/10 text-[#6B7B94]"
            }`}
          >
            {p.status}
          </span>
        </div>

        {/* Featured Toggle */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => setFeatured(!featured)}
            className={`p-1.5 rounded-lg transition-colors ${
              featured ? "text-[#B86A3C] bg-[#B86A3C]/10" : "text-[#E2DDD6] hover:text-[#6B7B94]"
            }`}
            title={featured ? "Remove from featured" : "Mark as featured"}
          >
            <Star className={`w-4 h-4 ${featured ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPublished(!published)}
            className={`p-1.5 rounded-lg border transition-colors ${
              published
                ? "border-[#2D7A4F]/30 text-[#2D7A4F] hover:bg-[#2D7A4F]/10"
                : "border-[#E2DDD6] text-[#6B7B94] hover:border-[#0D2F5B] hover:text-[#0D2F5B]"
            }`}
            title={published ? "Unpublish" : "Publish"}
          >
            {published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <Link
            href={`/properties/${p.slug}`}
            target="_blank"
            className="p-1.5 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#0D2F5B] hover:border-[#0D2F5B] transition-colors"
            title="View public page"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <button className="p-1.5 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#B86A3C] hover:border-[#B86A3C] transition-colors" title="Edit">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

const WIZARD_STEPS = [
  { id: 1, label: "Basic Details" },
  { id: 2, label: "Location & Area" },
  { id: 3, label: "Pricing & Land Info" },
  { id: 4, label: "Photos & Brochure" },
  { id: 5, label: "SEO & Publish" },
];

function PropertyUploadWizard({ onCancel }: { onCancel: () => void }) {
  const [step, setStep] = useState(1);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#0D2F5B] text-2xl font-bold">Add New Property</h1>
          <p className="text-[#6B7B94] text-sm">Step {step} of 5</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-[#F7F3ED] transition-colors"
        >
          <X className="w-5 h-5 text-[#6B7B94]" />
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {WIZARD_STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => s.id <= step && setStep(s.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                s.id === step
                  ? "bg-[#0D2F5B] text-white"
                  : s.id < step
                  ? "bg-[#2D7A4F]/10 text-[#2D7A4F]"
                  : "bg-[#F7F3ED] text-[#6B7B94]"
              }`}
            >
              {s.id < step ? <CheckCircle className="w-3.5 h-3.5" /> : <span>{s.id}</span>}
              {s.label}
            </button>
            {i < WIZARD_STEPS.length - 1 && (
              <div className={`w-8 h-0.5 ${s.id < step ? "bg-[#2D7A4F]" : "bg-[#E2DDD6]"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-[#E2DDD6] p-6">
        {step === 1 && <WizardStep1 />}
        {step === 2 && <WizardStep2 />}
        {step === 3 && <WizardStep3 />}
        {step === 4 && <WizardStep4 />}
        {step === 5 && <WizardStep5 />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-5">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : onCancel()}
          className="text-sm font-medium text-[#6B7B94] hover:text-[#162338] transition-colors"
        >
          {step === 1 ? "Cancel" : "← Previous"}
        </button>
        <button
          onClick={() => step < 5 ? setStep(step + 1) : onCancel()}
          className="bg-[#0D2F5B] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#0a2347] transition-colors"
        >
          {step === 5 ? "Publish Property" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

function WizardStep1() {
  return (
    <div className="space-y-4">
      <h2 className="text-[#0D2F5B] font-bold text-lg mb-5">Basic Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Property Title *" placeholder="e.g. Premium Residential Plot in Panvel" />
        <FormField label="Property Code" placeholder="e.g. PLT-PNV-007" />
        <div>
          <label className="block text-sm font-medium text-[#162338] mb-1.5">Status</label>
          <select className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]">
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#162338] mb-1.5">Zoning Type</label>
          <select className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]">
            <option>Residential</option>
            <option>Agricultural</option>
            <option>Industrial</option>
            <option>Commercial</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#162338] mb-1.5">Property Highlights</label>
        <textarea
          rows={3}
          placeholder="Enter key highlights, one per line"
          className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] resize-none"
        />
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-[#0D2F5B]" />
          <span className="text-sm text-[#162338]">Featured listing</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-[#0D2F5B]" defaultChecked />
          <span className="text-sm text-[#162338]">Publish immediately</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-[#2D7A4F]" defaultChecked />
          <span className="text-sm text-[#162338]">Road Access</span>
        </label>
      </div>
    </div>
  );
}

function WizardStep2() {
  return (
    <div className="space-y-4">
      <h2 className="text-[#0D2F5B] font-bold text-lg mb-5">Location & Area</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#162338] mb-1.5">Location</label>
          <select className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]">
            <option>Panvel</option>
            <option>Khalapur</option>
          </select>
        </div>
        <FormField label="Village" placeholder="e.g. Chikhale" />
        <FormField label="Taluka" placeholder="e.g. Panvel" />
        <FormField label="District" placeholder="e.g. Raigad" />
        <FormField label="Latitude" placeholder="e.g. 18.9894" type="number" />
        <FormField label="Longitude" placeholder="e.g. 73.1175" type="number" />
        <FormField label="Area (sqft) *" placeholder="e.g. 2500" type="number" />
        <FormField label="Area (Guntha)" placeholder="Auto-calculated" type="number" />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#162338] mb-1.5">Nearby Landmarks</label>
        <textarea
          rows={3}
          placeholder="Format: Landmark Name | Distance&#10;e.g. Navi Mumbai Airport | 12 km"
          className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] resize-none font-mono"
        />
      </div>
    </div>
  );
}

function WizardStep3() {
  return (
    <div className="space-y-4">
      <h2 className="text-[#0D2F5B] font-bold text-lg mb-5">Pricing & Land Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Total Price (₹) *" placeholder="e.g. 6500000" type="number" />
        <FormField label="Price per sqft (₹)" placeholder="Auto-calculated" type="number" />
        <div>
          <label className="block text-sm font-medium text-[#162338] mb-1.5">Title Clarity</label>
          <select className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]">
            <option value="clear">Clear</option>
            <option value="pending">Pending Verification</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#162338] mb-1.5">Investment Reasoning</label>
        <textarea
          rows={4}
          placeholder="Explain why this is a good investment opportunity..."
          className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] resize-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#162338] mb-1.5">Why This Property?</label>
        <textarea
          rows={3}
          placeholder="Unique selling points for this specific property..."
          className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] resize-none"
        />
      </div>
    </div>
  );
}

function WizardStep4() {
  return (
    <div className="space-y-5">
      <h2 className="text-[#0D2F5B] font-bold text-lg mb-5">Photos & Brochure</h2>
      <div>
        <label className="block text-sm font-medium text-[#162338] mb-2">Property Gallery *</label>
        <div className="border-2 border-dashed border-[#E2DDD6] rounded-xl p-8 text-center hover:border-[#0D2F5B]/30 transition-colors cursor-pointer">
          <div className="text-3xl mb-2">📸</div>
          <p className="text-[#162338] font-medium text-sm">Drop photos here or click to upload</p>
          <p className="text-[#6B7B94] text-xs mt-1">JPG, PNG · Min 800×600 · Max 5MB each</p>
          <button className="mt-4 bg-[#0D2F5B] text-white text-xs font-semibold px-4 py-2 rounded-lg">
            Select Photos
          </button>
        </div>
        <p className="text-[#6B7B94] text-xs mt-2">
          ⚠️ Only use real property photos. No stock imagery.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#162338] mb-2">Brochure PDF (optional)</label>
        <div className="border-2 border-dashed border-[#E2DDD6] rounded-xl p-6 text-center cursor-pointer hover:border-[#0D2F5B]/30 transition-colors">
          <div className="text-2xl mb-2">📄</div>
          <p className="text-[#6B7B94] text-sm">Upload PDF brochure</p>
          <button className="mt-3 border border-[#E2DDD6] text-[#162338] text-xs font-medium px-4 py-1.5 rounded-lg hover:bg-[#F7F3ED]">
            Select PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function WizardStep5() {
  return (
    <div className="space-y-4">
      <h2 className="text-[#0D2F5B] font-bold text-lg mb-5">SEO & Publish</h2>
      <FormField label="SEO Title" placeholder="Property name | Location | Plotsify" />
      <div>
        <label className="block text-sm font-medium text-[#162338] mb-1.5">SEO Meta Description</label>
        <textarea
          rows={3}
          placeholder="160 characters max. Describe the property for search engines..."
          className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] resize-none"
        />
      </div>
      <FormField label="URL Slug" placeholder="e.g. premium-plot-panvel-sector-12" />

      <div className="bg-[#2D7A4F]/8 border border-[#2D7A4F]/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-4 h-4 text-[#2D7A4F]" />
          <span className="text-[#2D7A4F] font-semibold text-sm">Pre-publish Checklist</span>
        </div>
        <div className="space-y-2">
          {[
            "At least 3 real property photos uploaded",
            "Price and area filled correctly",
            "Title clarity status set",
            "Nearby landmarks added",
            "Investment reasoning written",
          ].map((item) => (
            <label key={item} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#2D7A4F]" />
              <span className="text-[#162338] text-sm">{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#162338] mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] text-[#162338]"
      />
    </div>
  );
}
