"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, MessageCircle, Calendar, FileText, X, ArrowRight, CheckCircle } from "lucide-react";

export default function MobileCTA() {
  const [showEnquiry, setShowEnquiry] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-[#E2DDD6] shadow-2xl">
        <div className="grid grid-cols-4 divide-x divide-[#E2DDD6]">
          <a
            href="tel:+918169693894"
            className="flex flex-col items-center gap-1 py-3 text-[#0D2F5B] hover:bg-[#F7F3ED] transition-colors active:bg-[#E2DDD6]"
          >
            <Phone className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Call</span>
          </a>
          <a
            href="https://wa.me/918169693894?text=Hi%2C%20I%20am%20interested%20in%20plots%20in%20Panvel%2FKhalapur"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 py-3 text-[#25D366] hover:bg-[#F7F3ED] transition-colors active:bg-[#E2DDD6]"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-semibold text-[#0D2F5B]">WhatsApp</span>
          </a>
          <Link
            href="/book-site-visit"
            className="flex flex-col items-center gap-1 py-3 text-[#B86A3C] hover:bg-[#F7F3ED] transition-colors active:bg-[#E2DDD6]"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-semibold text-[#0D2F5B]">Site Visit</span>
          </Link>
          <button
            onClick={() => setShowEnquiry(true)}
            className="flex flex-col items-center gap-1 py-3 bg-[#0D2F5B] text-white hover:bg-[#0a2347] transition-colors active:bg-[#162338]"
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Enquire</span>
          </button>
        </div>
      </div>

      {showEnquiry && <EnquiryPopup onClose={() => setShowEnquiry(false)} />}
    </>
  );
}

function EnquiryPopup({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, locationPreference: location, budgetRange: budget, message }),
      });
    } catch {
      // show success anyway
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-2xl p-5 pb-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#0D2F5B] font-bold text-lg">Quick Enquiry</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F7F3ED]">
            <X className="w-5 h-5 text-[#6B7B94]" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-[#2D7A4F]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-7 h-7 text-[#2D7A4F]" />
            </div>
            <h3 className="text-[#0D2F5B] font-bold text-lg mb-1">Enquiry Received!</h3>
            <p className="text-[#6B7B94] text-sm mb-4">Our team will contact you within 2 hours.</p>
            <a
              href="https://wa.me/918169693894"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
            >
              <MessageCircle className="w-4 h-4" /> Continue on WhatsApp
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#162338] mb-1">Full Name *</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#162338] mb-1">Phone *</label>
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
                <label className="block text-xs font-medium text-[#162338] mb-1">Location</label>
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
                <label className="block text-xs font-medium text-[#162338] mb-1">Budget</label>
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
            <div>
              <label className="block text-xs font-medium text-[#162338] mb-1">Message (optional)</label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you're looking for..."
                className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0D2F5B] text-white font-bold py-3 rounded-xl hover:bg-[#0a2347] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? "Sending..." : <><span>Send Enquiry</span><ArrowRight className="w-4 h-4" /></>}
            </button>
            <p className="text-center text-xs text-[#6B7B94]">We respond within 2 hours · No spam</p>
          </form>
        )}
      </div>
    </div>
  );
}
