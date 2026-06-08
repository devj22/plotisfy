"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, CheckCircle, MessageCircle } from "lucide-react";

const STORAGE_KEY = "plotzify_lead_popup_dismissed";
const DELAY_MS = 4000; // show after 4 seconds

export default function LeadPopup() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Don't show if dismissed in this session
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

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
        body: JSON.stringify({ name, phone, locationPreference: location, budgetRange: budget, message: "Website popup lead" }),
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

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Popup — slides up from bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-[80] md:bottom-6 md:left-auto md:right-6 md:max-w-sm animate-slide-up">
        <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#0D2F5B] px-5 py-4 flex items-start justify-between">
            <div>
              <p className="text-[#B86A3C] text-xs font-semibold uppercase tracking-wide mb-0.5">
                Limited Plots Available
              </p>
              <h2 className="text-white font-bold text-base leading-snug">
                Get Exclusive Details & Pricing
              </h2>
              <p className="text-white/60 text-xs mt-0.5">
                Panvel &amp; Khalapur — verified land plots
              </p>
            </div>
            <button
              onClick={dismiss}
              className="ml-3 mt-0.5 p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 pb-6">
            {submitted ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-[#2D7A4F]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-[#2D7A4F]" />
                </div>
                <h3 className="text-[#0D2F5B] font-bold mb-1">Thank you!</h3>
                <p className="text-[#6B7B94] text-sm mb-4">
                  Our team will call you within 2 hours.
                </p>
                <a
                  href="https://wa.me/918169693894"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#162338] mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#162338] mb-1">
                      Phone *
                    </label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 ..."
                      className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#162338] mb-1">
                      Location
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] text-[#162338]"
                    >
                      <option value="">Any</option>
                      <option value="Panvel">Panvel</option>
                      <option value="Khalapur">Khalapur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#162338] mb-1">
                      Budget
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] text-[#162338]"
                    >
                      <option value="">Select</option>
                      <option value="₹3Cr – ₹5Cr">₹3Cr – ₹5Cr</option>
                      <option value="₹5Cr – ₹10Cr">₹5Cr – ₹10Cr</option>
                      <option value="Above ₹10Cr">Above ₹10Cr</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0D2F5B] text-white font-bold py-3 rounded-xl hover:bg-[#0a2347] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    "Sending..."
                  ) : (
                    <>
                      <span>Get Free Callback</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-[#6B7B94]">
                  No spam · We respond within 2 hours
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
