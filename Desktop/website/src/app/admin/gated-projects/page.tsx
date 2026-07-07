"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Trash2, Eye, EyeOff, Edit3, X, ArrowRight, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface GatedProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  developer: string;
  totalUnits: number;
  priceMin: number;
  priceMax: number;
  amenities: string;
  gallery: string;
  status: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  coming_soon: "Coming Soon",
  available: "Available",
  sold_out: "Sold Out",
};

const BLANK: Partial<GatedProject> = {
  title: "", description: "", location: "", developer: "",
  totalUnits: 0, priceMin: 0, priceMax: 0,
  amenities: "[]", gallery: "[]",
  status: "coming_soon", featured: false, published: false,
};

export default function AdminGatedProjectsPage() {
  const [projects, setProjects] = useState<GatedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GatedProject | null>(null);
  const [form, setForm] = useState<typeof BLANK>(BLANK);
  const [amenityInput, setAmenityInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function load() {
    fetch("/api/gated-projects")
      .then((r) => r.json())
      .then((d) => setProjects(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm(BLANK);
    setAmenityInput("");
    setGalleryInput("");
    setShowForm(true);
  }

  function openEdit(p: GatedProject) {
    setEditing(p);
    setForm({ ...p });
    const amenities: string[] = (() => { try { return JSON.parse(p.amenities); } catch { return []; } })();
    const gallery: string[] = (() => { try { return JSON.parse(p.gallery); } catch { return []; } })();
    setAmenityInput(amenities.join(", "));
    setGalleryInput(gallery.join("\n"));
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    const amenities = amenityInput.split(",").map((s) => s.trim()).filter(Boolean);
    const gallery = galleryInput.split("\n").map((s) => s.trim()).filter(Boolean);
    const payload = { ...form, amenities, gallery };

    const url = editing ? `/api/gated-projects/${editing.id}` : "/api/gated-projects";
    const method = editing ? "PATCH" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowForm(false); load(); }, 800);
  }

  async function togglePublish(p: GatedProject) {
    await fetch(`/api/gated-projects/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !p.published }),
    });
    load();
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    await fetch(`/api/gated-projects/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminLayout currentPath="/admin/gated-projects">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[#0D2F5B] text-2xl font-bold">Gated Community Projects</h1>
            <p className="text-[#6B7B94] text-sm">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-[#0D2F5B] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#0a2347] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#E2DDD6] overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-[#6B7B94] text-sm">Loading...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#6B7B94] font-medium mb-2">No projects yet</p>
              <p className="text-[#6B7B94] text-sm">Click "Add Project" to create your first gated community listing.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-[1fr_120px_110px_90px_120px] gap-4 px-5 py-3 bg-[#F7F3ED] border-b border-[#E2DDD6] text-xs font-semibold text-[#6B7B94] uppercase tracking-wider">
                <div>Project</div><div>Location</div><div>Status</div><div>Published</div><div>Actions</div>
              </div>
              <div className="divide-y divide-[#F7F3ED]">
                {projects.map((p) => (
                  <div key={p.id} className="px-5 py-4 hover:bg-[#F7F3ED]/50 transition-colors">
                    <div className="md:grid md:grid-cols-[1fr_120px_110px_90px_120px] md:gap-4 md:items-center">
                      <div className="mb-2 md:mb-0">
                        <p className="text-[#162338] font-semibold text-sm">{p.title}</p>
                        {p.developer && <p className="text-[#6B7B94] text-xs">By {p.developer}</p>}
                        {(p.priceMin > 0) && <p className="text-[#B86A3C] text-xs font-medium">{formatPrice(p.priceMin)} – {formatPrice(p.priceMax)}</p>}
                      </div>
                      <div className="hidden md:block text-[#6B7B94] text-xs">{p.location}</div>
                      <div className="hidden md:block">
                        <span className="text-xs bg-[#F7F3ED] text-[#6B7B94] px-2 py-0.5 rounded-full border border-[#E2DDD6]">
                          {STATUS_LABELS[p.status] ?? p.status}
                        </span>
                      </div>
                      <div className="hidden md:block">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.published ? "bg-[#2D7A4F]/10 text-[#2D7A4F]" : "bg-[#6B7B94]/10 text-[#6B7B94]"}`}>
                          {p.published ? "Live" : "Draft"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 md:mt-0">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#0D2F5B] hover:border-[#0D2F5B] transition-colors" title="Edit">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => togglePublish(p)} className="p-1.5 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#2D7A4F] hover:border-[#2D7A4F] transition-colors" title={p.published ? "Unpublish" : "Publish"}>
                          {p.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => deleteProject(p.id)} className="p-1.5 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-red-500 hover:border-red-300 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[520px] bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#E2DDD6] sticky top-0 bg-white">
              <h2 className="text-[#0D2F5B] font-bold text-lg">{editing ? "Edit Project" : "Add Project"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-[#F7F3ED]">
                <X className="w-4 h-4 text-[#6B7B94]" />
              </button>
            </div>

            <div className="p-5 space-y-4 flex-1">
              <Field label="Title *">
                <input required value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Green Valley Estate" className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Location">
                  <select value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls}>
                    <option value="">Select</option>
                    <option value="Panvel">Panvel</option>
                    <option value="Khalapur - Khopoli">Khalapur - Khopoli</option>
                  </select>
                </Field>
                <Field label="Status">
                  <select value={form.status ?? "coming_soon"} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="available">Available</option>
                    <option value="sold_out">Sold Out</option>
                  </select>
                </Field>
              </div>
              <Field label="Developer / Builder">
                <input value={form.developer ?? ""} onChange={(e) => setForm({ ...form, developer: e.target.value })} placeholder="e.g. ABC Developers" className={inputCls} />
              </Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Total Units">
                  <input type="number" value={form.totalUnits ?? 0} onChange={(e) => setForm({ ...form, totalUnits: Number(e.target.value) })} className={inputCls} />
                </Field>
                <Field label="Price Min (₹)">
                  <input type="number" value={form.priceMin ?? 0} onChange={(e) => setForm({ ...form, priceMin: Number(e.target.value) })} className={inputCls} />
                </Field>
                <Field label="Price Max (₹)">
                  <input type="number" value={form.priceMax ?? 0} onChange={(e) => setForm({ ...form, priceMax: Number(e.target.value) })} className={inputCls} />
                </Field>
              </div>
              <Field label="Description">
                <textarea rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="About the project..." className={`${inputCls} resize-none`} />
              </Field>
              <Field label="Amenities (comma separated)">
                <input value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} placeholder="Swimming Pool, Clubhouse, 24/7 Security" className={inputCls} />
              </Field>
              <Field label="Gallery Image URLs (one per line)">
                <textarea rows={3} value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)} placeholder="https://..." className={`${inputCls} resize-none`} />
              </Field>
              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={Boolean(form.featured)} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-[#B86A3C]" />
                  <span className="text-sm text-[#162338] font-medium">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={Boolean(form.published)} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-[#2D7A4F]" />
                  <span className="text-sm text-[#162338] font-medium">Published (live)</span>
                </label>
              </div>
            </div>

            <div className="p-5 border-t border-[#E2DDD6] sticky bottom-0 bg-white">
              <button
                onClick={handleSave}
                disabled={saving || !form.title}
                className="w-full flex items-center justify-center gap-2 bg-[#0D2F5B] text-white font-bold py-3 rounded-xl hover:bg-[#0a2347] transition-colors disabled:opacity-60"
              >
                {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : saving ? "Saving..." : <><span>{editing ? "Update Project" : "Create Project"}</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

const inputCls = "w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2F5B]/20 focus:border-[#0D2F5B] text-[#162338]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#162338] mb-1">{label}</label>
      {children}
    </div>
  );
}
