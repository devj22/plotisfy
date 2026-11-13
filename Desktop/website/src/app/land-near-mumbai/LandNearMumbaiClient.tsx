"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, CheckCircle, FileText, MapPin, MessageCircle, Phone, Ruler, Wallet } from "lucide-react";
import { reportConversion, reportLeadSubmitted } from "@/lib/gtag";
import { captureAttribution, type Attribution } from "@/lib/attribution";
import {
  BUDGET_OPTIONS,
  LOCATION_OPTIONS,
  MIN_BUDGET_LABEL,
  TIMELINE_OPTIONS,
  USE_OPTIONS,
  budgetOption,
  validateEnquiry,
  type EnquiryInput,
  type FieldErrors,
} from "@/lib/enquiry";

export interface LandingListing {
  slug: string;
  title: string;
  place: string;
  area: string;
  category: string;
  image: string;
}

const PHONE = "+918169693894";
const WHATSAPP = "https://wa.me/918169693894?text=Hi%2C%20I%20am%20looking%20for%20land%20near%20Mumbai";

function newSubmissionId() {
  return crypto.randomUUID();
}

export default function LandNearMumbaiClient({ listings }: { listings: LandingListing[] }) {
  const formRef = useRef<HTMLDivElement>(null);
  const [locationPreset, setLocationPreset] = useState("");

  function goToForm(location?: string) {
    if (location) setLocationPreset(location);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F7F3ED]">
        {/* Hero + form */}
        <section className="gradient-navy text-white px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                <Wallet className="w-3.5 h-3.5" /> Land purchase budgets {MIN_BUDGET_LABEL} and above
              </span>
              <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-5">
                Looking for land <span className="text-[#B86A3C]">near Mumbai?</span>
              </h1>
              <p className="text-white/80 text-lg leading-relaxed mb-6 max-w-xl">
                Agricultural and residential land in <strong className="text-white">Panvel, Karjat, Khalapur and Khopoli</strong>.
                Tell us your budget, intended use and timeline, and we&apos;ll send you a shortlist of parcels that match.
              </p>
              <ul className="space-y-3 mb-8 text-white/85">
                {[
                  "Shortlist matched to your budget, location and use",
                  "Land category and documents shared before any site visit",
                  "Guided site visits across all four locations",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-[#B86A3C] flex-shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
              <p className="text-white/55 text-xs max-w-xl">
                {MIN_BUDGET_LABEL}+ is a general budget qualifier for this service, not the price of any individual parcel.
              </p>
              <div className="flex flex-wrap gap-3 mt-6 lg:hidden">
                <button
                  onClick={() => goToForm()}
                  className="flex items-center gap-2 bg-[#B86A3C] text-white font-bold px-6 py-3 rounded-xl"
                >
                  Request a matching shortlist <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div ref={formRef} className="scroll-mt-24">
              <ShortlistForm locationPreset={locationPreset} />
            </div>
          </div>
        </section>

        {/* Inventory */}
        {listings.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <h2 className="text-[#0D2F5B] text-2xl md:text-3xl font-bold mb-2">A sample of current parcels</h2>
            <p className="text-[#6B7B94] mb-8 max-w-3xl">
              Land category is shown as stated in the seller&apos;s records. It is not a construction approval: what can be built depends
              on each parcel&apos;s zone, NA status and permissions, which we confirm for the parcels on your shortlist.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.slice(0, 9).map((l) => (
                <div key={l.slug} className="bg-white rounded-2xl border border-[#E2DDD6] overflow-hidden flex flex-col">
                  {l.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.image} alt={l.title} loading="lazy" className="w-full h-44 object-cover" />
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <span className="self-start text-[11px] font-semibold uppercase tracking-wide bg-[#F7F3ED] text-[#0D2F5B] px-2.5 py-1 rounded-full mb-3">
                      {l.category}
                    </span>
                    <h3 className="text-[#162338] font-bold leading-snug mb-3 line-clamp-2">{l.title}</h3>
                    <div className="space-y-1.5 text-sm text-[#6B7B94] mb-5">
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {l.place}</div>
                      <div className="flex items-center gap-2"><Ruler className="w-4 h-4" /> {l.area}</div>
                    </div>
                    <div className="mt-auto flex gap-2">
                      <button
                        onClick={() => goToForm(LOCATION_OPTIONS.find((o) => l.place.toLowerCase().includes(o.toLowerCase())))}
                        className="flex-1 bg-[#0D2F5B] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#0D2F5B]/90"
                      >
                        Request a matching shortlist
                      </button>
                      <Link
                        href={`/properties/${l.slug}`}
                        className="px-3 py-2.5 border border-[#E2DDD6] rounded-xl text-[#0D2F5B] text-sm font-semibold hover:bg-[#F7F3ED]"
                      >
                        <FileText className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Call / WhatsApp: tracked as the separate "Contact" conversion, never as a lead */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-2xl border border-[#E2DDD6] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <h2 className="text-[#0D2F5B] text-xl font-bold mb-1">Prefer to talk first?</h2>
              <p className="text-[#6B7B94]">Call or WhatsApp our land team, Monday to Sunday.</p>
            </div>
            <div className="flex gap-3">
              <a href={`tel:${PHONE}`} onClick={() => reportConversion()} className="flex items-center gap-2 border-2 border-[#0D2F5B] text-[#0D2F5B] font-bold px-5 py-3 rounded-xl">
                <Phone className="w-4 h-4" /> Call
              </a>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" onClick={() => reportConversion()} className="flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-3 rounded-xl">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

type FormState = Omit<EnquiryInput, "submissionId">;
const EMPTY: FormState = { name: "", mobile: "", location: "", intendedUse: "", timeline: "", budget: "", landArea: "" };

function ShortlistForm({ locationPreset }: { locationPreset: string }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "failed">("idle");
  const [leadRef, setLeadRef] = useState("");
  // One id per enquiry, reused on retry so the server never saves it twice.
  const submissionId = useRef("");
  const attribution = useRef<Attribution>({});

  useEffect(() => {
    submissionId.current = newSubmissionId();
    attribution.current = captureAttribution();
  }, []);

  useEffect(() => {
    if (locationPreset) setForm((f) => ({ ...f, location: locationPreset }));
  }, [locationPreset]);

  const belowBudget = budgetOption(form.budget)?.eligible === false;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (belowBudget || status === "saving") return;
    const input: EnquiryInput = { ...form, submissionId: submissionId.current };
    const found = validateEnquiry(input);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setStatus("saving");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, website, attribution: attribution.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setLeadRef(String(data.leadId).slice(0, 8).toUpperCase());
        setStatus("saved");
        // Only now, after the server confirmed the save, is the lead reported.
        if (!data.duplicate) {
          reportLeadSubmitted(data.leadId, { budget: form.budget, location: form.location });
        }
        return;
      }
      if (res.status === 400 && data.fields) setErrors(data.fields);
      setStatus("failed");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "saved") {
    return (
      <div className="bg-white rounded-2xl p-7 text-center shadow-xl">
        <CheckCircle className="w-12 h-12 text-[#2D7A4F] mx-auto mb-4" />
        <h2 className="text-[#0D2F5B] text-2xl font-bold mb-2">Request received</h2>
        <p className="text-[#2c3a4d] mb-4">
          Thank you, {form.name.split(" ")[0]}. Our land team will call you on {form.mobile} with a shortlist for{" "}
          {form.location === "Open to suggestions" ? "the best-matching locations" : form.location}.
        </p>
        <p className="text-[#6B7B94] text-sm">Reference: {leadRef}</p>
      </div>
    );
  }

  const inputCls = "w-full border border-[#E2DDD6] rounded-xl px-3.5 py-3 text-[#162338] text-sm focus:outline-none focus:border-[#0D2F5B]";
  const err = (k: keyof FieldErrors) => errors[k] && <p className="text-red-600 text-xs mt-1">{errors[k]}</p>;

  return (
    <form onSubmit={submit} noValidate className="bg-white rounded-2xl p-6 md:p-7 shadow-xl text-[#162338]">
      <h2 className="text-[#0D2F5B] text-xl font-bold mb-1">Request a matching shortlist</h2>
      <p className="text-[#6B7B94] text-sm mb-5">Takes under a minute. We call back with parcels that fit.</p>

      <div className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-[#6B7B94] mb-1">Land purchase budget</label>
          <select className={inputCls} value={form.budget} onChange={(e) => set("budget", e.target.value)}>
            <option value="">Select budget</option>
            {BUDGET_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>
          {err("budget")}
        </div>

        {belowBudget ? (
          <div className="bg-[#F7F3ED] rounded-xl p-4 text-sm text-[#2c3a4d]">
            <p className="font-semibold text-[#0D2F5B] mb-1">This shortlist service starts at {MIN_BUDGET_LABEL}</p>
            <p className="mb-3">
              The parcels we source for this service are larger land purchases of {MIN_BUDGET_LABEL} and above, so we can&apos;t
              prepare a matching shortlist below that budget. You can still browse every listing on our site.
            </p>
            <Link href="/properties" className="inline-flex items-center gap-1 font-semibold text-[#0D2F5B]">
              Browse all listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#6B7B94] mb-1">Name</label>
                <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
                {err("name")}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7B94] mb-1">Mobile</label>
                <input className={inputCls} value={form.mobile} onChange={(e) => set("mobile", e.target.value)} inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" />
                {err("mobile")}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B7B94] mb-1">Preferred location</label>
              <select className={inputCls} value={form.location} onChange={(e) => set("location", e.target.value)}>
                <option value="">Select location</option>
                {LOCATION_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
              {err("location")}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#6B7B94] mb-1">Intended use</label>
                <select className={inputCls} value={form.intendedUse} onChange={(e) => set("intendedUse", e.target.value)}>
                  <option value="">Select use</option>
                  {USE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
                {err("intendedUse")}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6B7B94] mb-1">Purchase timeline</label>
                <select className={inputCls} value={form.timeline} onChange={(e) => set("timeline", e.target.value)}>
                  <option value="">Select timeline</option>
                  {TIMELINE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
                {err("timeline")}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B7B94] mb-1">Land area <span className="font-normal">(optional)</span></label>
              <input className={inputCls} value={form.landArea} onChange={(e) => set("landArea", e.target.value)} placeholder="e.g. 1 acre, 20 guntha" />
              {err("landArea")}
            </div>
            {/* Honeypot, hidden from people */}
            <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden="true" />

            {status === "failed" && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3.5 py-2.5">
                We couldn&apos;t send your request. Your details are still here. Please try again, or call us on +91 81696 93894.
              </p>
            )}
            {errors.submissionId && <p className="text-sm text-red-600">{errors.submissionId}</p>}

            <button
              type="submit"
              disabled={status === "saving"}
              className="w-full flex items-center justify-center gap-2 bg-[#B86A3C] text-white font-bold py-3.5 rounded-xl hover:bg-[#9a5630] transition-colors disabled:opacity-60"
            >
              {status === "saving" ? "Sending…" : status === "failed" ? "Try again" : "Request a matching shortlist"}
              {status !== "saving" && <ArrowRight className="w-4 h-4" />}
            </button>
            <p className="text-[11px] text-[#6B7B94] text-center">
              By submitting you agree to be contacted about land matching your request. See our <Link href="/privacy" className="underline">privacy policy</Link>.
            </p>
          </>
        )}
      </div>
    </form>
  );
}
