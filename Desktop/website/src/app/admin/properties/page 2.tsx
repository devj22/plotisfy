"use client";

import { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import type { Property } from "@/types";
import { formatPrice, formatArea } from "@/lib/utils";
import {
  Plus,
  Search,
  Edit3,
  Eye,
  EyeOff,
  Star,
  MapPin,
  ArrowUpRight,
  CheckCircle,
  X,
} from "lucide-react";
import Link from "next/link";

export default function AdminPropertiesPage() {
  const [list, setList] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showWizard, setShowWizard] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    fetch("/api/properties")
      .then((r) => r.json())
      .then((data: Property[]) => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = list.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.propertyCode.toLowerCase().includes(search.toLowerCase());
    const matchLocation = !locationFilter || p.location === locationFilter;
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchLocation && matchStatus;
  });

  const openCreate = () => {
    setEditId(null);
    setShowWizard(true);
  };

  const openEdit = (id: string) => {
    setEditId(id);
    setShowWizard(true);
  };

  const closeWizard = () => {
    setShowWizard(false);
    setEditId(null);
  };

  if (showWizard) {
    return (
      <AdminLayout currentPath="/admin/properties">
        <PropertyUploadWizard
          editId={editId}
          onCancel={closeWizard}
          onSuccess={() => {
            closeWizard();
            refresh();
          }}
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
              {loading ? "Loading…" : `${list.length} total listings (database)`}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#0D2F5B] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#0a2347] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>

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

        <div className="bg-white rounded-2xl border border-[#E2DDD6] overflow-hidden">
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
              <PropertyRow key={p.id} property={p} onMutate={refresh} onEdit={() => openEdit(p.id)} />
            ))}
          </div>

          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-[#6B7B94]">No properties found.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function PropertyRow({
  property: p,
  onMutate,
  onEdit,
}: {
  property: Property;
  onMutate: () => void;
  onEdit: () => void;
}) {
  const patch = async (body: Record<string, unknown>) => {
    await fetch(`/api/properties/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    onMutate();
  };

  return (
    <div className="px-4 md:px-5 py-4 hover:bg-[#F7F3ED]/50 transition-colors">
      <div className="flex items-center gap-4 md:grid md:grid-cols-[60px_1fr_100px_120px_100px_80px_100px] md:gap-4">
        <img
          src={p.gallery[0] || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400"}
          alt={p.title}
          className="w-14 h-12 rounded-lg object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-xs text-[#6B7B94] bg-[#F7F3ED] px-1.5 py-0.5 rounded">
              {p.propertyCode}
            </span>
            {!p.published && (
              <span className="text-xs text-[#B86A3C] bg-[#B86A3C]/10 px-1.5 py-0.5 rounded">Draft</span>
            )}
          </div>
          <p className="text-[#162338] text-sm font-semibold truncate">{p.title}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-[#B86A3C]" />
            <span className="text-[#6B7B94] text-xs">
              {p.village}, {p.location}
            </span>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="text-[#0D2F5B] text-sm font-bold">{formatPrice(p.priceTotal)}</div>
          <div className="text-[#6B7B94] text-xs">₹{p.pricePerSqft}/sqft</div>
        </div>

        <div className="hidden md:block">
          <div className="text-[#162338] text-sm font-medium">{formatArea(p.areaSqft)}</div>
          <div className="text-[#6B7B94] text-xs">{p.areaGuntha} Guntha</div>
        </div>

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

        <div className="hidden md:flex items-center">
          <button
            type="button"
            onClick={() => patch({ featured: !p.featured })}
            className={`p-1.5 rounded-lg transition-colors ${
              p.featured ? "text-[#B86A3C] bg-[#B86A3C]/10" : "text-[#E2DDD6] hover:text-[#6B7B94]"
            }`}
            title={p.featured ? "Remove from featured" : "Mark as featured"}
          >
            <Star className={`w-4 h-4 ${p.featured ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => patch({ published: !p.published })}
            className={`p-1.5 rounded-lg border transition-colors ${
              p.published
                ? "border-[#2D7A4F]/30 text-[#2D7A4F] hover:bg-[#2D7A4F]/10"
                : "border-[#E2DDD6] text-[#6B7B94] hover:border-[#0D2F5B] hover:text-[#0D2F5B]"
            }`}
            title={p.published ? "Unpublish" : "Publish"}
          >
            {p.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
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
            type="button"
            onClick={onEdit}
            className="p-1.5 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#B86A3C] hover:border-[#B86A3C] transition-colors"
            title="Edit"
          >
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

function PropertyUploadWizard({
  editId,
  onCancel,
  onSuccess,
}: {
  editId: string | null;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [propertyCode, setPropertyCode] = useState("");
  const [status, setStatus] = useState("available");
  const [zoningType, setZoningType] = useState("Residential");
  const [highlightsText, setHighlightsText] = useState("");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [roadAccess, setRoadAccess] = useState(true);

  const [location, setLocation] = useState("Panvel");
  const [village, setVillage] = useState("");
  const [taluka, setTaluka] = useState("");
  const [district, setDistrict] = useState("Raigad");
  const [lat, setLat] = useState("18.9894");
  const [lng, setLng] = useState("73.1175");
  const [areaSqft, setAreaSqft] = useState("");
  const [areaGuntha, setAreaGuntha] = useState("");
  const [landmarksText, setLandmarksText] = useState("");

  const [priceTotal, setPriceTotal] = useState("");
  const [pricePerSqft, setPricePerSqft] = useState("");
  const [titleClarity, setTitleClarity] = useState("clear");
  const [investmentReasoning, setInvestmentReasoning] = useState("");
  const [whyThisProperty, setWhyThisProperty] = useState("");

  const [galleryText, setGalleryText] = useState("");
  const [brochure, setBrochure] = useState("");

  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    if (!editId) return;
    setLoadError(null);
    fetch(`/api/properties/${editId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((p: Property) => {
        setTitle(p.title);
        setPropertyCode(p.propertyCode);
        setStatus(p.status);
        setZoningType(p.zoningType);
        setHighlightsText(p.highlights.join("\n"));
        setFeatured(p.featured);
        setPublished(p.published);
        setRoadAccess(p.roadAccess);
        setLocation(p.location);
        setVillage(p.village);
        setTaluka(p.taluka);
        setDistrict(p.district);
        setLat(String(p.coordinates.lat));
        setLng(String(p.coordinates.lng));
        setAreaSqft(String(p.areaSqft));
        setAreaGuntha(String(p.areaGuntha));
        setLandmarksText(
          p.nearbyLandmarks.map((l) => `${l.name} | ${l.distance} | ${l.type}`).join("\n")
        );
        setPriceTotal(String(p.priceTotal));
        setPricePerSqft(String(p.pricePerSqft));
        setTitleClarity(p.titleClarity);
        setInvestmentReasoning(p.investmentReasoning);
        setWhyThisProperty(p.whyThisProperty);
        setGalleryText(p.gallery.join("\n"));
        setBrochure(p.brochure ?? "");
        setSeoTitle(p.seoTitle ?? "");
        setSeoDescription(p.seoDescription ?? "");
        setSlug(p.slug);
      })
      .catch(() => setLoadError("Could not load property for editing."));
  }, [editId]);

  const buildPayload = () => ({
    title,
    slug: slug || undefined,
    propertyCode: propertyCode || undefined,
    status,
    zoningType,
    highlightsText,
    featured,
    published,
    roadAccess,
    location,
    village,
    taluka,
    district,
    lat: parseFloat(lat) || 0,
    lng: parseFloat(lng) || 0,
    areaSqft: parseFloat(areaSqft) || 0,
    areaGuntha: areaGuntha ? parseFloat(areaGuntha) : undefined,
    landmarksText,
    priceTotal: parseFloat(priceTotal) || 0,
    pricePerSqft: pricePerSqft ? parseFloat(pricePerSqft) : undefined,
    titleClarity,
    investmentReasoning,
    whyThisProperty,
    galleryText,
    brochure: brochure || undefined,
    seoTitle: seoTitle || undefined,
    seoDescription: seoDescription || undefined,
  });

  const handleFinish = async () => {
    setSaving(true);
    try {
      const payload = buildPayload();
      if (editId) {
        const res = await fetch(`/api/properties/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error || "Save failed");
        }
      } else {
        const res = await fetch("/api/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error((err as { error?: string }).error || "Create failed");
        }
      }
      onSuccess();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p className="text-red-600 text-sm mb-4">{loadError}</p>
        <button type="button" onClick={onCancel} className="text-[#0D2F5B] font-medium text-sm">
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#0D2F5B] text-2xl font-bold">
            {editId ? "Edit Property" : "Add New Property"}
          </h1>
          <p className="text-[#6B7B94] text-sm">Step {step} of 5 · Saved to database</p>
        </div>
        <button type="button" onClick={onCancel} className="p-2 rounded-lg hover:bg-[#F7F3ED] transition-colors">
          <X className="w-5 h-5 text-[#6B7B94]" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {WIZARD_STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
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

      <div className="bg-white rounded-2xl border border-[#E2DDD6] p-6 space-y-4">
        {step === 1 && (
          <>
            <h2 className="text-[#0D2F5B] font-bold text-lg mb-4">Basic Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-[#162338]">Property Title *</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#162338]">Property Code</span>
                <input
                  value={propertyCode}
                  onChange={(e) => setPropertyCode(e.target.value)}
                  placeholder="Auto if empty"
                  className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#162338]">Status</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#162338]">Zoning</span>
                <select
                  value={zoningType}
                  onChange={(e) => setZoningType(e.target.value)}
                  className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
                >
                  <option>Residential</option>
                  <option>Agricultural</option>
                  <option>Industrial</option>
                  <option>Commercial</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-[#162338]">Highlights (one per line)</span>
              <textarea
                value={highlightsText}
                onChange={(e) => setHighlightsText(e.target.value)}
                rows={3}
                className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm resize-none"
              />
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={roadAccess} onChange={(e) => setRoadAccess(e.target.checked)} />
                Road access
              </label>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-[#0D2F5B] font-bold text-lg mb-4">Location & Area</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-[#162338]">Location</span>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
                >
                  <option>Panvel</option>
                  <option>Khalapur</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#162338]">Village</span>
                <input
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#162338]">Taluka</span>
                <input
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#162338]">District</span>
                <input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#162338]">Latitude</span>
                <input
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#162338]">Longitude</span>
                <input
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#162338]">Area (sqft) *</span>
                <input
                  value={areaSqft}
                  onChange={(e) => setAreaSqft(e.target.value)}
                  className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#162338]">Guntha (optional)</span>
                <input
                  value={areaGuntha}
                  onChange={(e) => setAreaGuntha(e.target.value)}
                  className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-[#162338]">
                Landmarks: Name | Distance | type (one per line)
              </span>
              <textarea
                value={landmarksText}
                onChange={(e) => setLandmarksText(e.target.value)}
                rows={3}
                placeholder="Airport | 12 km | airport"
                className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm font-mono resize-none"
              />
            </label>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-[#0D2F5B] font-bold text-lg mb-4">Pricing & Land</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-[#162338]">Total price (₹) *</span>
                <input
                  value={priceTotal}
                  onChange={(e) => setPriceTotal(e.target.value)}
                  className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#162338]">Price / sqft (optional)</span>
                <input
                  value={pricePerSqft}
                  onChange={(e) => setPricePerSqft(e.target.value)}
                  className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-[#162338]">Title clarity</span>
                <select
                  value={titleClarity}
                  onChange={(e) => setTitleClarity(e.target.value)}
                  className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
                >
                  <option value="clear">Clear</option>
                  <option value="pending">Pending</option>
                  <option value="disputed">Disputed</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-[#162338]">Investment reasoning</span>
              <textarea
                value={investmentReasoning}
                onChange={(e) => setInvestmentReasoning(e.target.value)}
                rows={4}
                className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm resize-none"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#162338]">Why this property</span>
              <textarea
                value={whyThisProperty}
                onChange={(e) => setWhyThisProperty(e.target.value)}
                rows={3}
                className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm resize-none"
              />
            </label>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-[#0D2F5B] font-bold text-lg mb-4">Photos & brochure</h2>
            <label className="block">
              <span className="text-sm font-medium text-[#162338]">Image URLs (one per line or comma-separated)</span>
              <textarea
                value={galleryText}
                onChange={(e) => setGalleryText(e.target.value)}
                rows={5}
                className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm resize-none"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#162338]">Brochure URL (optional)</span>
              <input
                value={brochure}
                onChange={(e) => setBrochure(e.target.value)}
                className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
              />
            </label>
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="text-[#0D2F5B] font-bold text-lg mb-4">SEO & URL</h2>
            <label className="block">
              <span className="text-sm font-medium text-[#162338]">URL slug (optional)</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto from title if empty"
                className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#162338]">SEO title</span>
              <input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-[#162338]">Meta description</span>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={3}
                className="mt-1.5 w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm resize-none"
              />
            </label>
          </>
        )}
      </div>

      <div className="flex items-center justify-between mt-5">
        <button
          type="button"
          onClick={() => (step > 1 ? setStep(step - 1) : onCancel())}
          className="text-sm font-medium text-[#6B7B94] hover:text-[#162338]"
        >
          {step === 1 ? "Cancel" : "← Previous"}
        </button>
        {step < 5 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="bg-[#0D2F5B] text-white text-sm font-semibold px-6 py-2.5 rounded-xl"
          >
            Continue →
          </button>
        ) : (
          <button
            type="button"
            disabled={saving || !title.trim()}
            onClick={handleFinish}
            className="bg-[#B86A3C] text-white text-sm font-semibold px-6 py-2.5 rounded-xl disabled:opacity-50"
          >
            {saving ? "Saving…" : editId ? "Save changes" : "Publish to site"}
          </button>
        )}
      </div>
    </div>
  );
}
