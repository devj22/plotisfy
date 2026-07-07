"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Trash2, Eye, EyeOff, Edit3, X, ArrowRight, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Deal {
  id: string;
  title: string;
  description: string;
  propertySlug: string;
  originalPrice: number;
  dealPrice: number;
  validUntil: string | null;
  image: string | null;
  badge: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
}

const BLANK: Partial<Deal> = {
  title: "", description: "", propertySlug: "",
  originalPrice: 0, dealPrice: 0, validUntil: null,
  image: "", badge: "", published: false, featured: false,
};

export default function AdminLandDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [form, setForm] = useState<typeof BLANK>(BLANK);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function load() {
    fetch("/api/land-deals")
      .then((r) => r.json())
      .then((d) => setDeals(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function openNew() { setEditing(null); setForm(BLANK); setShowForm(true); }
  function openEdit(d: Deal) { setEditing(d); setForm({ ...d }); setShowForm(true); }

  async function handleSave() {
    setSaving(true);
    const url = editing ? `/api/land-deals/${editing.id}` : "/api/land-deals";
    const method = editing ? "PATCH" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowForm(false); load(); }, 800);
  }

  async function togglePublish(d: Deal) {
    await fetch(`/api/land-deals/${d.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !d.published }),
    });
    load();
  }

  async function deleteDeal(id: string) {
    if (!confirm("Delete this deal? This cannot be undone.")) return;
    await fetch(`/api/land-deals/${id}`, { method: "DELETE" });
    load();
  }

  const discount = (d: Deal) => d.originalPrice > 0
    ? Math.round(((d.originalPrice - d.dealPrice) / d.originalPrice) * 100)
    : 0;

  return (
    <AdminLayout currentPath="/admin/land-deals">
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[#0D2F5B] text-2xl font-bold">Land Deals</h1>
            <p className="text-[#6B7B94] text-sm">{deals.length} deal{deals.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-[#B86A3C] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#9a5630] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Deal
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2DDD6] overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-[#6B7B94] text-sm">Loading...</div>
          ) : deals.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#6B7B94] font-medium mb-2">No deals yet</p>
              <p className="text-[#6B7B94] text-sm">Click "Add Deal" to create your first land deal.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-[1fr_110px_100px_90px_120px] gap-4 px-5 py-3 bg-[#F7F3ED] border-b border-[#E2DDD6] text-xs font-semibold text-[#6B7B94] uppercase tracking-wider">
                <div>Deal</div><div>Deal Price</div><div>Discount</div><div>Status</div><div>Actions</div>
              </div>
              <div className="divide-y divide-[#F7F3ED]">
                {deals.map((d) => (
                  <div key={d.id} className="px-5 py-4 hover:bg-[#F7F3ED]/50 transition-colors">
                    <div className="md:grid md:grid-cols-[1fr_110px_100px_90px_120px] md:gap-4 md:items-center">
                      <div className="mb-2 md:mb-0">
                        <p className="text-[#162338] font-semibold text-sm">{d.title}</p>
                        {d.badge && <span className="text-xs bg-[#B86A3C]/10 text-[#B86A3C] px-2 py-0.5 rounded-full font-medium">{d.badge}</span>}
                        {d.validUntil && <p className="text-xs text-[#6B7B94] mt-0.5">Expires: {new Date(d.validUntil).toLocaleDateString("en-IN")}</p>}
                      </div>
                      <div className="hidden md:block text-[#0D2F5B] font-semibold text-sm">{d.dealPrice > 0 ? formatPrice(d.dealPrice) : "—"}</div>
                      <div className="hidden md:block">
                        {discount(d) > 0 && (
                          <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">-{discount(d)}%</span>
                        )}
                      </div>
                      <div className="hidden md:block">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${d.published ? "bg-[#2D7A4F]/10 text-[#2D7A4F]" : "bg-[#6B7B94]/10 text-[#6B7B94]"}`}>
                          {d.published ? "Live" : "Draft"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2 md:mt-0">
                        <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#0D2F5B] hover:border-[#0D2F5B] transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => togglePublish(d)} className="p-1.5 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#2D7A4F] hover:border-[#2D7A4F] transition-colors">{d.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                        <button onClick={() => deleteDeal(d.id)} className="p-1.5 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-red-500 hover:border-red-300 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {showForm && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[500px] bg-white shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#E2DDD6] sticky top-0 bg-white">
              <h2 className="text-[#0D2F5B] font-bold text-lg">{editing ? "Edit Deal" : "Add Deal"}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-[#F7F3ED]"><X className="w-4 h-4 text-[#6B7B94]" /></button>
            </div>
            <div className="p-5 space-y-4 flex-1">
              <Field label="Title *">
                <input required value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. 30 Guntha Plot — Pre-launch Price" className={inputCls} />
              </Field>
              <Field label="Badge (optional)">
                <input value={form.badge ?? ""} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. Hot Deal, Flash Sale, Limited Units" className={inputCls} />
              </Field>
              <Field label="Description">
                <textarea rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tell buyers why this is a great deal..." className={`${inputCls} resize-none`} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Original Price (₹)">
                  <input type="number" value={form.originalPrice ?? 0} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })} className={inputCls} />
                </Field>
                <Field label="Deal Price (₹)">
                  <input type="number" value={form.dealPrice ?? 0} onChange={(e) => setForm({ ...form, dealPrice: Number(e.target.value) })} className={inputCls} />
                </Field>
              </div>
              <Field label="Link to Property (slug, optional)">
                <input value={form.propertySlug ?? ""} onChange={(e) => setForm({ ...form, propertySlug: e.target.value })} placeholder="e.g. 30-guntha-plot-panvel" className={inputCls} />
              </Field>
              <Field label="Valid Until (optional)">
                <input type="date" value={form.validUntil ? form.validUntil.slice(0, 10) : ""} onChange={(e) => setForm({ ...form, validUntil: e.target.value || null })} className={inputCls} />
              </Field>
              <Field label="Image URL (optional)">
                <input value={form.image ?? ""} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className={inputCls} />
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
                className="w-full flex items-center justify-center gap-2 bg-[#B86A3C] text-white font-bold py-3 rounded-xl hover:bg-[#9a5630] transition-colors disabled:opacity-60"
              >
                {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : saving ? "Saving..." : <><span>{editing ? "Update Deal" : "Create Deal"}</span><ArrowRight className="w-4 h-4" /></>}
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
