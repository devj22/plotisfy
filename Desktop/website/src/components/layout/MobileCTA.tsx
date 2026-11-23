"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, MessageCircle, Calendar, FileText, X, CheckCircle } from "lucide-react";
import { reportConversion } from "@/lib/gtag";
import QualifiedLeadForm from "@/components/forms/QualifiedLeadForm";

export default function MobileCTA() {
  const [showEnquiry, setShowEnquiry] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-[#E2DDD6] shadow-2xl">
        <div className="grid grid-cols-4 divide-x divide-[#E2DDD6]">
          <a
            href="tel:+918169693894"
            onClick={() => reportConversion()}
            className="flex flex-col items-center gap-1 py-3 text-[#0D2F5B] hover:bg-[#F7F3ED] transition-colors active:bg-[#E2DDD6]"
          >
            <Phone className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Call</span>
          </a>
          <a
            href="https://wa.me/918169693894?text=Hi%2C%20I%20am%20interested%20in%20plots%20in%20Panvel%2FKhalapur - Khopoli"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => reportConversion()}
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
  const [submitted, setSubmitted] = useState(false);

  function onSaved() {
    setSubmitted(true);
    window.open("/thank-you", "_blank", "noopener,noreferrer");
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
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => reportConversion()}
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
            >
              <MessageCircle className="w-4 h-4" /> Continue on WhatsApp
            </a>
          </div>
        ) : (
          <QualifiedLeadForm
            source="mobile_enquiry"
            submitLabel="Send Enquiry"
            footnote="We respond within 2 hours · No spam"
            onSaved={onSaved}
          />
        )}
      </div>
    </div>
  );
}
