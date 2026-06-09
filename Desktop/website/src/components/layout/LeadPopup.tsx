"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, ArrowRight, CheckCircle, MessageCircle, MapPin, FileText, Calendar } from "lucide-react";

const STORAGE_KEY = "plotzify_lead_popup_dismissed";

export default function LeadPopup() {
  const [visible, setVisible] = useState(false);
  const [triggerType, setTriggerType] = useState<"scroll" | "timer" | "exit" | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Track whether popup has already been triggered this session
  const hasTriggered = useRef(false);

  const triggerPopup = useCallback((type: "scroll" | "timer" | "exit") => {
    if (hasTriggered.current) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    hasTriggered.current = true;
    setTriggerType(type);
    setVisible(true);
  }, []);

  useEffect(() => {
    // Skip everything if already dismissed this session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    // ── 1. SCROLL TRIGGER (40% of page height) ─────────────────────────────
    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const pct = scrolled / total;
      if (pct >= 0.40) {
        triggerPopup("scroll");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // ── 2. TIMER TRIGGER (25 seconds) ──────────────────────────────────────
    const timer = setTimeout(() => {
      triggerPopup("timer");
    }, 25000);

    // ── 3. EXIT INTENT (cursor leaves toward top of viewport) ───────────────
    const handleMouseLeave = (e: MouseEvent) => {
      // Only fire when cursor moves toward top (exit intent)
      if (e.clientY <= 5) {
        triggerPopup("exit");
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [triggerPopup]);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          locationPreference: location,
          budgetRange: budget,
          message: `Website popup lead (trigger: ${triggerType})`,
        }),
      });
    } catch {
      // show success anyway
    } finally {
      setLoading(false);
      setSubmitted(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }
  }

  if (!visible) return null;

  const isExitIntent = triggerType === "exit";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-scale">

          {/* Header */}
          <div className="relative bg-[#0D2F5B] px-5 pt-5 pb-6 overflow-hidden">
            {/* Background decorative circles */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#B86A3C]/15 rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />

            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                {isExitIntent ? (
                  <p className="text-[#B86A3C] text-xs font-bold uppercase tracking-widest mb-1.5">
                    ⚡ Wait — Before You Leave!
                  </p>
                ) : (
                  <p className="text-[#B86A3C] text-xs font-bold uppercase tracking-widest mb-1.5">
                    🏡 Limited Plots · Panvel &amp; Khalapur
                  </p>
                )}
                <h2 className="text-white font-bold text-[1.1rem] leading-snug">
                  Get Complete Price Sheet, Location Map &amp; Site Visit Assistance
                </h2>
                <p className="text-white/60 text-xs mt-1.5">
                  Free · No spam · Our team responds within 2 hours
                </p>
              </div>
              <button
                id="popup-close-btn"
                onClick={dismiss}
                className="ml-3 mt-0.5 p-1.5 rounded-lg hover:bg-white/15 transition-colors flex-shrink-0"
                aria-label="Close popup"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* What you'll get strip */}
            <div className="relative mt-4 grid grid-cols-3 gap-2">
              {[
                { icon: FileText, label: "Price Sheet" },
                { icon: MapPin, label: "Location Map" },
                { icon: Calendar, label: "Site Visit" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 bg-white/8 border border-white/10 rounded-xl py-2.5 px-1"
                >
                  <Icon className="w-4 h-4 text-[#B86A3C]" />
                  <span className="text-white/80 text-[10px] font-semibold text-center leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-5">
            {submitted ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-[#2D7A4F]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-7 h-7 text-[#2D7A4F]" />
                </div>
                <h3 className="text-[#0D2F5B] font-bold text-lg mb-1">Thank you!</h3>
                <p className="text-[#6B7B94] text-sm mb-5">
                  We&apos;ll send you the price sheet &amp; map within 2 hours.
                </p>
                <a
                  href="https://wa.me/918169693894"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                </a>
              </div>
            ) : (
              <form id="popup-lead-form" onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#162338] mb-1">
                      Full Name *
                    </label>
                    <input
                      id="popup-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2F5B]/30 focus:border-[#0D2F5B] text-[#162338]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#162338] mb-1">
                      Phone *
                    </label>
                    <input
                      id="popup-phone"
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 ..."
                      className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2F5B]/30 focus:border-[#0D2F5B] text-[#162338]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#162338] mb-1">
                      Location
                    </label>
                    <select
                      id="popup-location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2F5B]/30 focus:border-[#0D2F5B] text-[#162338]"
                    >
                      <option value="">Any</option>
                      <option value="Panvel">Panvel</option>
                      <option value="Khalapur">Khalapur</option>
                      <option value="Both / Open">Both / Open</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#162338] mb-1">
                      Budget
                    </label>
                    <select
                      id="popup-budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2F5B]/30 focus:border-[#0D2F5B] text-[#162338]"
                    >
                      <option value="">Select</option>
                      <option value="₹3Cr – ₹5Cr">₹3Cr – ₹5Cr</option>
                      <option value="₹5Cr – ₹10Cr">₹5Cr – ₹10Cr</option>
                      <option value="Above ₹10Cr">Above ₹10Cr</option>
                    </select>
                  </div>
                </div>

                <button
                  id="popup-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#B86A3C] text-white font-bold py-3 rounded-xl hover:bg-[#9a5630] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 mt-1"
                >
                  {loading
                    ? "Sending..."
                    : (
                      <>
                        <span>Send Me the Price Sheet</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                </button>
                <p className="text-center text-xs text-[#6B7B94]">
                  No spam &middot; Free &middot; Response within 2 hours
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
