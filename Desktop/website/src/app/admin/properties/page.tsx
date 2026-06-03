"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Property } from "@/types";
import { formatPrice, formatArea } from "@/lib/utils";
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Star,
  ArrowUpRight,
  CheckCircle,
  X,
  Trash2,
  ImagePlus,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showWizard, setShowWizard] = useState(false);

  function loadProperties() {
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data) => setProperties(Array.isArray(data) ? data : []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadProperties(); }, []);

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
        <PropertyUploadWizard
          onCancel={() => setShowWizard(false)}
          onSaved={() => { setShowWizard(false); loadProperties(); }}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPath="/admin/properties">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[#0D2F5B] text-2xl font-bold">Properties</h1>
            <p className="text-[#6B7B94] text-sm">
              {loading ? "Loading..." : `${properties.length} total listings`}
            </p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 bg-[#0D2F5B] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#0a2347] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Property
          </button>
        </div>

        <div className="bg-white rounded-xl border border-[#E2DDD6] p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7B94]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#E2DDD6] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]"
            />
          </div>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="text-sm border border-[#E2DDD6] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] text-[#162338]"
          >
            <option value="">All Locations</option>
            <option value="Panvel">Panvel</option>
            <option value="Khalapur">Khalapur</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-[#E2DDD6] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] text-[#162338]"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2DDD6] overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-[#6B7B94] text-sm">Loading properties...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#6B7B94] font-medium">No properties found</p>
              <button
                onClick={() => setShowWizard(true)}
                className="mt-4 bg-[#0D2F5B] text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
              >
                Add your first property
              </button>
            </div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_80px_120px] gap-4 px-5 py-3 bg-[#F7F3ED] border-b border-[#E2DDD6] text-xs font-semibold text-[#6B7B94] uppercase tracking-wider">
                <div>Property</div>
                <div>Price</div>
                <div>Area</div>
                <div>Status</div>
                <div>Featured</div>
                <div>Actions</div>
              </div>
              <div className="divide-y divide-[#F7F3ED]">
                {filtered.map((p) => (
                  <PropertyRow key={p.id} property={p} onChange={loadProperties} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function PropertyRow({ property: p, onChange }: { property: Property; onChange: () => void }) {
  const [published, setPublished] = useState(p.published);
  const [featured, setFeatured] = useState(p.featured);

  async function togglePublished() {
    const next = !published;
    setPublished(next);
    await fetch(`/api/properties/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: next }),
    });
  }

  async function toggleFeatured() {
    const next = !featured;
    setFeatured(next);
    await fetch(`/api/properties/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: next }),
    });
  }

  async function deleteProperty() {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    await fetch(`/api/properties/${p.id}`, { method: "DELETE" });
    onChange();
  }

  const thumb = p.gallery?.[0];

  return (
    <div className="px-4 md:px-5 py-4 hover:bg-[#F7F3ED]/50 transition-colors">
      <div className="md:grid md:grid-cols-[2fr_1fr_1fr_1fr_80px_120px] md:gap-4 md:items-center">
        <div className="flex items-center gap-3 mb-3 md:mb-0">
          {thumb ? (
            <img src={thumb} alt="" className="w-12 h-10 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-12 h-10 rounded-lg bg-[#F7F3ED] flex items-center justify-center flex-shrink-0">
              <ImagePlus className="w-5 h-5 text-[#E2DDD6]" />
            </div>
          )}
          <div>
            <div className="text-[#162338] text-sm font-semibold line-clamp-1">{p.title}</div>
            <div className="text-[#6B7B94] text-xs">{p.propertyCode} · {p.location}</div>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="text-[#0D2F5B] text-sm font-bold">{formatPrice(p.priceTotal)}</div>
          <div className="text-[#6B7B94] text-xs">₹{p.pricePerSqft}/sqft</div>
        </div>
        <div className="hidden md:block">
          <div className="text-[#162338] text-sm font-medium">{formatArea(p.areaSqft)}</div>
          <div className="text-[#6B7B94] text-xs">{p.areaGuntha?.toFixed(1)} Guntha</div>
        </div>
        <div className="hidden md:block">
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
            p.status === "available" ? "bg-[#2D7A4F]/10 text-[#2D7A4F]"
            : p.status === "reserved" ? "bg-[#B86A3C]/10 text-[#B86A3C]"
            : "bg-[#6B7B94]/10 text-[#6B7B94]"
          }`}>{p.status}</span>
        </div>
        <div className="hidden md:flex items-center">
          <button
            onClick={toggleFeatured}
            className={`p-1.5 rounded-lg transition-colors ${featured ? "text-[#B86A3C] bg-[#B86A3C]/10" : "text-[#E2DDD6] hover:text-[#6B7B94]"}`}
            title={featured ? "Remove from featured" : "Mark as featured"}
          >
            <Star className={`w-4 h-4 ${featured ? "fill-current" : ""}`} />
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={togglePublished}
            className={`p-1.5 rounded-lg border transition-colors ${
              published ? "border-[#2D7A4F]/30 text-[#2D7A4F] hover:bg-[#2D7A4F]/10"
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
          <button
            onClick={deleteProperty}
            className="p-1.5 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-red-500 hover:border-red-300 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Wizard ───────────────────────────────────────────────────────────────────

interface WizardData {
  title: string; propertyCode: string; status: string; zoningType: string;
  highlightsText: string; featured: boolean; published: boolean; roadAccess: boolean;
  location: string; village: string; taluka: string; district: string;
  lat: string; lng: string; areaSqft: string; areaGuntha: string; landmarksText: string;
  priceTotal: string; pricePerSqft: string; titleClarity: string;
  investmentReasoning: string; whyThisProperty: string;
  gallery: string[]; brochure: string;
  seoTitle: string; seoDescription: string; slug: string;
}

const EMPTY: WizardData = {
  title: "", propertyCode: "", status: "available", zoningType: "Residential",
  highlightsText: "", featured: false, published: true, roadAccess: true,
  location: "Panvel", village: "", taluka: "", district: "Raigad",
  lat: "", lng: "", areaSqft: "", areaGuntha: "", landmarksText: "",
  priceTotal: "", pricePerSqft: "", titleClarity: "clear",
  investmentReasoning: "", whyThisProperty: "",
  gallery: [], brochure: "",
  seoTitle: "", seoDescription: "", slug: "",
};

const STEPS = ["Basic Details", "Location & Area", "Pricing & Land Info", "Photos & Brochure", "SEO & Publish"];

function PropertyUploadWizard({ onCancel, onSaved }: { onCancel: () => void; onSaved: () => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof WizardData, value: unknown) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          areaSqft: parseFloat(data.areaSqft) || 0,
          areaGuntha: parseFloat(data.areaGuntha) || 0,
          priceTotal: parseFloat(data.priceTotal) || 0,
          pricePerSqft: parseFloat(data.pricePerSqft) || 0,
          lat: parseFloat(data.lat) || 0,
          lng: parseFloat(data.lng) || 0,
        }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed to save");
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save property");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#0D2F5B] text-2xl font-bold">Add New Property</h1>
          <p className="text-[#6B7B94] text-sm">Step {step} of {STEPS.length}</p>
        </div>
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-[#F7F3ED] transition-colors">
          <X className="w-5 h-5 text-[#6B7B94]" />
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => i + 1 <= step && setStep(i + 1)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                i + 1 === step ? "bg-[#0D2F5B] text-white"
                : i + 1 < step ? "bg-[#2D7A4F]/10 text-[#2D7A4F]"
                : "bg-[#F7F3ED] text-[#6B7B94]"
              }`}
            >
              {i + 1 < step ? <CheckCircle className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
              {label}
            </button>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-0.5 ${i + 1 < step ? "bg-[#2D7A4F]" : "bg-[#E2DDD6]"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-[#E2DDD6] p-6">
        {step === 1 && <Step1 data={data} set={set} />}
        {step === 2 && <Step2 data={data} set={set} />}
        {step === 3 && <Step3 data={data} set={set} />}
        {step === 4 && <Step4 data={data} set={set} />}
        {step === 5 && <Step5 data={data} set={set} />}
      </div>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-5">
        <button
          onClick={() => step > 1 ? setStep(step - 1) : onCancel()}
          className="text-sm font-medium text-[#6B7B94] hover:text-[#162338] transition-colors"
        >
          {step === 1 ? "Cancel" : "← Previous"}
        </button>
        {step < STEPS.length ? (
          <button
            onClick={() => setStep(step + 1)}
            className="bg-[#0D2F5B] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#0a2347] transition-colors"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-[#2D7A4F] text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#256040] transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving..." : "Publish Property"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Step Components ──────────────────────────────────────────────────────────

type StepProps = { data: WizardData; set: (f: keyof WizardData, v: unknown) => void };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#162338] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] text-[#162338]";

function Step1({ data, set }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-[#0D2F5B] font-bold text-lg mb-5">Basic Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Property Title *">
          <input className={inputCls} value={data.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Premium Residential Plot in Panvel" />
        </Field>
        <Field label="Property Code">
          <input className={inputCls} value={data.propertyCode} onChange={(e) => set("propertyCode", e.target.value)} placeholder="e.g. PLT-PNV-007" />
        </Field>
        <Field label="Status">
          <select className={inputCls} value={data.status} onChange={(e) => set("status", e.target.value)}>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </Field>
        <Field label="Zoning Type">
          <select className={inputCls} value={data.zoningType} onChange={(e) => set("zoningType", e.target.value)}>
            <option>Residential</option>
            <option>Agricultural</option>
            <option>Industrial</option>
            <option>Commercial</option>
          </select>
        </Field>
      </div>
      <Field label="Property Highlights (one per line)">
        <textarea rows={3} className={inputCls + " resize-none"} value={data.highlightsText} onChange={(e) => set("highlightsText", e.target.value)} placeholder="Clear title&#10;Road access available&#10;Near airport" />
      </Field>
      <div className="flex items-center gap-6">
        {([["featured", "Featured listing"], ["published", "Publish immediately"], ["roadAccess", "Road Access"]] as [keyof WizardData, string][]).map(([f, label]) => (
          <label key={f} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-[#0D2F5B]" checked={!!data[f]} onChange={(e) => set(f, e.target.checked)} />
            <span className="text-sm text-[#162338]">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Step2({ data, set }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-[#0D2F5B] font-bold text-lg mb-5">Location & Area</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Location">
          <select className={inputCls} value={data.location} onChange={(e) => set("location", e.target.value)}>
            <option>Panvel</option>
            <option>Khalapur</option>
          </select>
        </Field>
        <Field label="Village">
          <input className={inputCls} value={data.village} onChange={(e) => set("village", e.target.value)} placeholder="e.g. Chikhale" />
        </Field>
        <Field label="Taluka">
          <input className={inputCls} value={data.taluka} onChange={(e) => set("taluka", e.target.value)} placeholder="e.g. Panvel" />
        </Field>
        <Field label="District">
          <input className={inputCls} value={data.district} onChange={(e) => set("district", e.target.value)} placeholder="e.g. Raigad" />
        </Field>
        <Field label="Latitude">
          <input className={inputCls} type="number" value={data.lat} onChange={(e) => set("lat", e.target.value)} placeholder="e.g. 18.9894" />
        </Field>
        <Field label="Longitude">
          <input className={inputCls} type="number" value={data.lng} onChange={(e) => set("lng", e.target.value)} placeholder="e.g. 73.1175" />
        </Field>
        <Field label="Area (sqft) *">
          <input className={inputCls} type="number" value={data.areaSqft} onChange={(e) => set("areaSqft", e.target.value)} placeholder="e.g. 2500" />
        </Field>
        <Field label="Area (Guntha)">
          <input className={inputCls} type="number" value={data.areaGuntha} onChange={(e) => set("areaGuntha", e.target.value)} placeholder="Auto-calculated if blank" />
        </Field>
      </div>
      <Field label="Nearby Landmarks (Name | Distance, one per line)">
        <textarea rows={3} className={inputCls + " resize-none font-mono"} value={data.landmarksText} onChange={(e) => set("landmarksText", e.target.value)} placeholder="Navi Mumbai Airport | 12 km&#10;Panvel Railway Station | 5 km" />
      </Field>
    </div>
  );
}

function Step3({ data, set }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-[#0D2F5B] font-bold text-lg mb-5">Pricing & Land Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Total Price (₹) *">
          <input className={inputCls} type="number" value={data.priceTotal} onChange={(e) => set("priceTotal", e.target.value)} placeholder="e.g. 6500000" />
        </Field>
        <Field label="Price per sqft (₹)">
          <input className={inputCls} type="number" value={data.pricePerSqft} onChange={(e) => set("pricePerSqft", e.target.value)} placeholder="Auto-calculated if blank" />
        </Field>
        <Field label="Title Clarity">
          <select className={inputCls} value={data.titleClarity} onChange={(e) => set("titleClarity", e.target.value)}>
            <option value="clear">Clear</option>
            <option value="pending">Pending Verification</option>
            <option value="disputed">Disputed</option>
          </select>
        </Field>
      </div>
      <Field label="Investment Reasoning">
        <textarea rows={4} className={inputCls + " resize-none"} value={data.investmentReasoning} onChange={(e) => set("investmentReasoning", e.target.value)} placeholder="Explain why this is a good investment opportunity..." />
      </Field>
      <Field label="Why This Property?">
        <textarea rows={3} className={inputCls + " resize-none"} value={data.whyThisProperty} onChange={(e) => set("whyThisProperty", e.target.value)} placeholder="Unique selling points for this specific property..." />
      </Field>
    </div>
  );
}

function Step4({ data, set }: StepProps) {
  const [urlInput, setUrlInput] = useState("");

  function addUrl() {
    const url = urlInput.trim();
    if (!url) return;
    if (data.gallery.includes(url)) { setUrlInput(""); return; }
    set("gallery", [...data.gallery, url]);
    setUrlInput("");
  }

  function removePhoto(url: string) {
    set("gallery", data.gallery.filter((u) => u !== url));
  }

  return (
    <div className="space-y-5">
      <h2 className="text-[#0D2F5B] font-bold text-lg mb-5">Photos & Brochure</h2>

      <div>
        <label className="block text-sm font-medium text-[#162338] mb-2">
          Property Gallery * ({data.gallery.length} photo{data.gallery.length !== 1 ? "s" : ""})
        </label>

        {/* URL input */}
        <div className="flex gap-2 mb-3">
          <input
            className={inputCls + " flex-1"}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
            placeholder="Paste image URL (Google Drive, WhatsApp Web, any hosted image)..."
          />
          <button
            type="button"
            onClick={addUrl}
            className="bg-[#0D2F5B] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#0a2347] transition-colors whitespace-nowrap"
          >
            Add Photo
          </button>
        </div>

        {/* Preview grid */}
        {data.gallery.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {data.gallery.map((url) => (
              <div key={url} className="relative group rounded-lg overflow-hidden aspect-video bg-[#F7F3ED]">
                <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <button
                  onClick={() => removePhoto(url)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-[#E2DDD6] rounded-xl p-8 text-center">
            <div className="text-3xl mb-2">📸</div>
            <p className="text-[#6B7B94] text-sm">Paste an image URL above to add photos</p>
            <p className="text-[#6B7B94] text-xs mt-1">
              Tip: Upload to Google Drive → Share → Copy link → paste here
            </p>
          </div>
        )}
        <p className="text-[#6B7B94] text-xs mt-2">⚠️ Only use real property photos. No stock imagery.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#162338] mb-2">Brochure PDF URL (optional)</label>
        <input
          className={inputCls}
          value={data.brochure}
          onChange={(e) => set("brochure", e.target.value)}
          placeholder="Paste a link to your PDF brochure (Google Drive, etc.)"
        />
      </div>
    </div>
  );
}

function Step5({ data, set }: StepProps) {
  const checklistItems = [
    ["Title filled in", !!data.title],
    ["Location set", !!data.location],
    ["Price entered", !!data.priceTotal],
    ["Area entered", !!data.areaSqft],
    ["At least 1 photo", data.gallery.length > 0],
  ] as [string, boolean][];

  return (
    <div className="space-y-4">
      <h2 className="text-[#0D2F5B] font-bold text-lg mb-5">SEO & Publish</h2>
      <Field label="SEO Title">
        <input className={inputCls} value={data.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder="Property name | Location | Plotzify" />
      </Field>
      <Field label="SEO Meta Description">
        <textarea rows={3} className={inputCls + " resize-none"} value={data.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} placeholder="160 characters max..." />
      </Field>
      <Field label="URL Slug">
        <input className={inputCls} value={data.slug} onChange={(e) => set("slug", e.target.value)} placeholder="e.g. premium-plot-panvel-sector-12 (auto-generated if blank)" />
      </Field>

      <div className="bg-[#F7F3ED] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-4 h-4 text-[#2D7A4F]" />
          <span className="text-[#2D7A4F] font-semibold text-sm">Pre-publish Checklist</span>
        </div>
        <div className="space-y-2">
          {checklistItems.map(([label, done]) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <span className={done ? "text-[#2D7A4F]" : "text-[#6B7B94]"}>{done ? "✓" : "○"}</span>
              <span className={done ? "text-[#162338]" : "text-[#6B7B94]"}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
